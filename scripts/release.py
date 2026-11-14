# -*- coding: utf-8 -*-
"""Professional local pre-flight, OneDrive export, and CI-gated GitHub release tool."""
import argparse
import base64
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
ONEDRIVE_DIR = pathlib.Path(os.environ.get("ESCO_EXPORT_DIR") or (pathlib.Path.home() / "OneDrive" / "Documents" / "Spanish app"))
GITHUB_REPO = "schafesw/Colombia-spanish-practice"
GIT_AUTHOR = {
    "name": "schafesw",
    "email": "171106502+schafesw@users.noreply.github.com",
}


def current_version():
    sw_txt = (ROOT / "sw.js").read_text(encoding="utf-8")
    m = re.search(r'CACHE_NAME\s*=\s*"esco-pwa-(v\d+(?:\.\d+)*)"', sw_txt)
    if not m:
        raise RuntimeError("Could not parse version from sw.js CACHE_NAME")
    return m.group(1)


def find_github_pat():
    if os.environ.get("GITHUB_PAT"):
        return os.environ["GITHUB_PAT"].strip()
    matches = sorted(ONEDRIVE_DIR.glob("*pat_*.txt"))
    if not matches:
        raise RuntimeError(f"Set GITHUB_PAT or place token file in {ONEDRIVE_DIR}")
    return matches[0].read_text(encoding="utf-8").strip().splitlines()[0].strip()


def run_local_checks():
    print("==> Step 1: Running static & PWA integrity checks...")
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "verify-app.py")], cwd=str(ROOT))
    print("==> Step 2: Running Playwright browser smoke tests...")
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "browser_smoke.py")], cwd=str(ROOT))


def public_repo_files():
    return sorted(
        p for p in ROOT.rglob("*")
        if p.is_file()
        and ".git" not in p.parts
        and "__pycache__" not in p.parts
        and ".pytest_cache" not in p.parts
        and p.name != "AGENTS.md"
    )


def export_onedrive(version, files):
    export_dir = ONEDRIVE_DIR / f"colombia-spanish-{version}"
    zip_path = ONEDRIVE_DIR / f"colombia-spanish-{version}-upload.zip"
    export_dir.mkdir(parents=True, exist_ok=True)
    expected = {src.relative_to(ROOT).as_posix() for src in files}
    for old in sorted(export_dir.rglob("*"), reverse=True):
        if old.is_file() and old.relative_to(export_dir).as_posix() not in expected:
            try:
                old.unlink()
            except OSError:
                pass
    for src in files:
        rel = src.relative_to(ROOT)
        dst = export_dir / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for src in files:
            zf.write(src, arcname=src.relative_to(ROOT).as_posix())
    print(f"==> Step 3: Exported {len(files)} files -> {export_dir} & {zip_path.name} ({zip_path.stat().st_size} bytes)")


def gh_api(pat, method, path, payload=None):
    url = f"https://api.github.com/repos/{GITHUB_REPO}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {pat}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "espanol-colombia-release",
            **({"Content-Type": "application/json"} if data is not None else {}),
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))


def release_to_github(version, files, message):
    pat = find_github_pat()
    st, ref_upd = gh_api(pat, "GET", "/git/ref/heads/Updates")
    assert st == 200, (st, ref_upd)
    parent_sha = ref_upd["object"]["sha"]

    tree_items = []
    for src in files:
        rel_posix = src.relative_to(ROOT).as_posix()
        b64 = base64.b64encode(src.read_bytes()).decode("ascii")
        st_bl, bl = gh_api(pat, "POST", "/git/blobs", {"content": b64, "encoding": "base64"})
        assert st_bl in (200, 201), (rel_posix, st_bl, bl)
        tree_items.append({"path": rel_posix, "mode": "100644", "type": "blob", "sha": bl["sha"]})

    st_tr, tr = gh_api(pat, "POST", "/git/trees", {"tree": tree_items})
    if st_tr == 403:
        st_pt, pt = gh_api(pat, "GET", f"/git/trees/{parent_sha}?recursive=1")
        assert st_pt == 200, (st_pt, pt)
        kept_gh = [
            {"path": x["path"], "mode": x["mode"], "type": "blob", "sha": x["sha"]}
            for x in pt.get("tree", [])
            if x["type"] == "blob" and x["path"].startswith(".github/")
        ]
        tree_items = [x for x in tree_items if not x["path"].startswith(".github/")] + kept_gh
        st_tr, tr = gh_api(pat, "POST", "/git/trees", {"tree": tree_items})
    assert st_tr in (200, 201), (st_tr, tr)

    st_cm, cm = gh_api(
        pat,
        "POST",
        "/git/commits",
        {
            "message": message or f"{version}: verified release",
            "tree": tr["sha"],
            "parents": [parent_sha],
            "author": GIT_AUTHOR,
            "committer": GIT_AUTHOR,
        },
    )
    assert st_cm in (200, 201), (st_cm, cm)
    new_sha = cm["sha"]

    st_rf, rf = gh_api(pat, "PATCH", "/git/refs/heads/Updates", {"sha": new_sha, "force": False})
    assert st_rf == 200, (st_rf, rf)
    print(f"==> Step 4: Pushed Updates {new_sha[:8]} ({len(tree_items)} blobs)")

    st_prs, prs = gh_api(pat, "GET", "/pulls?state=open&head=schafesw:Updates&base=main")
    if prs:
        pr_num = prs[0]["number"]
    else:
        st_pr, pr = gh_api(
            pat,
            "POST",
            "/pulls",
            {"title": message or f"{version}: verified release", "head": "Updates", "base": "main", "body": f"CI-gated release `{version}`."},
        )
        assert st_pr in (200, 201), (st_pr, pr)
        pr_num = pr["number"]

    print(f"==> Step 5: Waiting for GitHub Actions CI on PR #{pr_num} ({new_sha[:8]}) BEFORE merging main...")
    ci_ok = False
    for attempt in range(40):
        time.sleep(5)
        st_runs, runs = gh_api(pat, "GET", f"/actions/runs?head_sha={new_sha}")
        assert st_runs == 200, (st_runs, runs)
        verify_runs = [r for r in runs.get("workflow_runs", []) if r.get("name") == "Verify Español · Colombia"]
        if verify_runs:
            run = verify_runs[0]
            print(f"    CI poll {attempt + 1}: status={run.get('status')} conclusion={run.get('conclusion')}")
            if run.get("status") == "completed":
                if run.get("conclusion") != "success":
                    raise RuntimeError(f"ABORTED MERGE: CI failed with conclusion={run.get('conclusion')}")
                ci_ok = True
                break
    if not ci_ok:
        raise RuntimeError("ABORTED MERGE: Timed out waiting for GitHub Actions CI")

    st_mg, mg = gh_api(pat, "PUT", f"/pulls/{pr_num}/merge", {"merge_method": "merge"})
    assert st_mg == 200, (st_mg, mg)
    main_sha = mg["sha"]
    print(f"==> Step 6: CI passed! Merged PR #{pr_num} -> main {main_sha[:8]}")

    for poll in range(20):
        time.sleep(4)
        st_pg, pg = gh_api(pat, "GET", "/pages/builds/latest")
        status = pg.get("status")
        if status == "built" and pg.get("commit") == main_sha:
            print(f"==> Step 7: GitHub Pages built ({main_sha[:8]})")
            break
        if status == "errored":
            raise RuntimeError(f"GitHub Pages build errored: {pg}")
    else:
        raise RuntimeError("Timed out waiting for GitHub Pages build")

    with urllib.request.urlopen(f"https://{GITHUB_REPO.split('/')[0]}.github.io/{GITHUB_REPO.split('/')[1]}/sw.js", timeout=15) as r:
        assert r.status == 200
    print("==> LIVE OK: GitHub Pages is serving the verified release.")


def main():
    parser = argparse.ArgumentParser(description="Validate, export, and CI-gate release Español · Colombia")
    parser.add_argument("--check-only", action="store_true", help="Run local static + Playwright checks only")
    parser.add_argument("--message", "-m", default="", help="Commit/PR title")
    args = parser.parse_args()

    ver = current_version()
    run_local_checks()
    if args.check_only:
        print(f"ALL CHECKS PASSED for {ver} (check-only mode, nothing uploaded).")
        return 0
    files = public_repo_files()
    export_onedrive(ver, files)
    release_to_github(ver, files, args.message or f"{ver}: verified release")
    return 0


if __name__ == "__main__":
    sys.exit(main())
