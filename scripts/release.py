# -*- coding: utf-8 -*-
"""Professional local pre-flight, OneDrive export, and CI-gated GitHub release tool."""
import argparse
import base64
import hashlib
import http.server
import json
import os
import pathlib
import re
import shutil
import struct
import subprocess
import sys
import time
import urllib.error
import urllib.request
import zipfile
import zlib

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
    gitlab_only = {
        "api", "portal", "sync.js", "nginx.conf", "Dockerfile", "docker-compose.yml",
        ".gitlab-ci.yml", ".dockerignore", "tools", "build.txt",
    }
    return sorted(
        p for p in ROOT.rglob("*")
        if p.is_file()
        and ".git" not in p.parts
        and "__pycache__" not in p.parts
        and ".pytest_cache" not in p.parts
        and p.name != "AGENTS.md"
        and p.relative_to(ROOT).parts[0] not in gitlab_only
    )


def gitlab_repo_files():
    excluded_top = {".git", "__pycache__", ".pytest_cache", ".github", "AGENTS.md"}
    return sorted(
        p for p in ROOT.rglob("*")
        if p.is_file()
        and ".git" not in p.parts
        and "__pycache__" not in p.parts
        and ".pytest_cache" not in p.parts
        and p.relative_to(ROOT).parts[0] not in excluded_top
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
    for attempt in range(45):
        time.sleep(5)
        st_runs, runs = gh_api(pat, "GET", f"/actions/runs?head_sha={new_sha}")
        assert st_runs == 200, (st_runs, runs)
        verify_runs = [r for r in runs.get("workflow_runs", []) if r.get("name") == "Verify Español · Colombia"]
        st_cr, cr = gh_api(pat, "GET", f"/commits/{new_sha}/check-runs")
        verify_checks = [c for c in (cr.get("check_runs", []) if st_cr == 200 else []) if c.get("name") == "verify"]
        if verify_runs and all(r.get("status") == "completed" for r in verify_runs) and (not verify_checks or all(c.get("status") == "completed" for c in verify_checks)):
            bad = [r.get("conclusion") for r in verify_runs if r.get("conclusion") != "success"] + [c.get("conclusion") for c in verify_checks if c.get("conclusion") != "success"]
            if bad:
                raise RuntimeError(f"ABORTED MERGE: CI failed with conclusions={bad}")
            ci_ok = True
            print(f"    CI poll {attempt + 1}: all {len(verify_runs)} workflow run(s) & {len(verify_checks)} check-run(s) succeeded")
            break
        statuses = [r.get("status") for r in verify_runs] + [c.get("status") for c in verify_checks]
        print(f"    CI poll {attempt + 1}: statuses={statuses or ['pending']}")
    if not ci_ok:
        raise RuntimeError("ABORTED MERGE: Timed out waiting for GitHub Actions CI")

    for mg_try in range(6):
        st_mg, mg = gh_api(pat, "PUT", f"/pulls/{pr_num}/merge", {"merge_method": "merge"})
        if st_mg == 200:
            break
        if st_mg == 405 and "in progress" in str(mg.get("message", "")).lower() and mg_try < 5:
            time.sleep(5)
            continue
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


def find_gitlab_remote_and_key():
    url = os.environ.get("GITLAB_REMOTE_URL", "").strip()
    if not url:
        cfg = ROOT / ".git" / "config"
        if cfg.exists():
            m = re.search(r'\[remote\s+"origin"\][^\[]*\burl\s*=\s*(\S+)', cfg.read_text(encoding="utf-8"))
            if m:
                url = m.group(1).strip()
    key = os.environ.get("GES_API_KEY", "").strip()
    if not key:
        cfg_dir = pathlib.Path.home() / ".config" / "opencode"
        if cfg_dir.exists():
            for p in sorted(cfg_dir.glob("*.key")):
                txt = p.read_text(encoding="utf-8").strip()
                if txt:
                    key = txt.splitlines()[0].strip()
                    break
    return url.rstrip("/"), key


def _git_obj(obj_type, data):
    raw = f"{obj_type} {len(data)}\0".encode("utf-8") + data
    return hashlib.sha1(raw).digest(), data


def _build_tree_rec(node, objs):
    entries = []
    for name, val in sorted(node.items(), key=lambda kv: kv[0] + "/" if isinstance(kv[1], dict) else kv[0]):
        if isinstance(val, dict):
            sub_sha = _build_tree_rec(val, objs)
            entries.append((f"40000 {name}\0").encode("utf-8") + sub_sha)
        else:
            sha_b, raw_b = _git_obj("blob", val)
            objs.setdefault(sha_b, (3, raw_b))
            entries.append((f"100644 {name}\0").encode("utf-8") + sha_b)
    tree_sha, tree_data = _git_obj("tree", b"".join(entries))
    objs.setdefault(tree_sha, (2, tree_data))
    return tree_sha


def _encode_pack(objs):
    chunks = [b"PACK" + struct.pack(">II", 2, len(objs))]
    for _sha, (otype, data) in objs.items():
        size = len(data)
        hdr = bytearray()
        b0 = (otype << 4) | (size & 0x0F)
        size >>= 4
        if size:
            b0 |= 0x80
        hdr.append(b0)
        while size:
            nxt = size & 0x7F
            size >>= 7
            if size:
                nxt |= 0x80
            hdr.append(nxt)
        chunks.append(bytes(hdr) + zlib.compress(data))
    body = b"".join(chunks)
    return body + hashlib.sha1(body).digest()


def _pkt_line(text_bytes):
    return f"{len(text_bytes) + 4:04x}".encode("ascii") + text_bytes


def release_to_gitlab(version, files, message):
    remote_url, ges_key = find_gitlab_remote_and_key()
    if not remote_url or not ges_key:
        raise RuntimeError("Missing GitLab remote URL in .git/config or GES_API_KEY credential.")
    ver_num = version.lstrip("v")

    # Fetch remote main ref via Smart Git HTTP
    req_refs = urllib.request.Request(
        f"{remote_url}/info/refs?service=git-receive-pack",
        headers={"X-GES-Key": ges_key, "User-Agent": "git/2.45.0"},
    )
    with urllib.request.urlopen(req_refs, timeout=30) as resp:
        refs_raw = resp.read()
    m_ref = re.search(rb"([0-9a-f]{40})\s+refs/heads/main\b", refs_raw)
    if not m_ref:
        raise RuntimeError(f"Could not find refs/heads/main in remote refs: {refs_raw[:300]!r}")
    parent_sha = m_ref.group(1).decode("ascii")

    # Build directory tree mapping; swap index.html entrypoint to sync.js for portal mode only
    root_map = {}
    for src in files:
        rel_parts = src.relative_to(ROOT).parts
        content = src.read_bytes()
        if rel_parts == ("index.html",):
            html_str = content.decode("utf-8")
            html_str = html_str.replace('<div id="splash" hidden', '<div id="splash"', 1)
            html_str = html_str.replace(
                f'<script type="module" src="src/main.js?v={ver_num}"></script>',
                f'<script src="sync.js?v={ver_num}"></script>',
                1,
            )
            content = html_str.encode("utf-8")
        cur = root_map
        for part in rel_parts[:-1]:
            cur = cur.setdefault(part, {})
        cur[rel_parts[-1]] = content

    objs = {}
    tree_sha = _build_tree_rec(root_map, objs)
    ts = int(time.time())
    commit_text = (
        f"tree {tree_sha.hex()}\n"
        f"parent {parent_sha}\n"
        f"author {GIT_AUTHOR['name']} <{GIT_AUTHOR['email']}> {ts} +0000\n"
        f"committer {GIT_AUTHOR['name']} <{GIT_AUTHOR['email']}> {ts} +0000\n\n"
        f"{message or f'{version}: verified release'}\n"
    ).encode("utf-8")
    commit_sha_b, commit_raw = _git_obj("commit", commit_text)
    objs[commit_sha_b] = (1, commit_raw)
    new_sha = commit_sha_b.hex()

    pack_bytes = _encode_pack(objs)
    cmd = f"{parent_sha} {new_sha} refs/heads/main\0 report-status\n".encode("utf-8")
    payload = _pkt_line(cmd) + b"0000" + pack_bytes

    req_push = urllib.request.Request(
        f"{remote_url}/git-receive-pack",
        data=payload,
        method="POST",
        headers={
            "X-GES-Key": ges_key,
            "User-Agent": "git/2.45.0",
            "Content-Type": "application/x-git-receive-pack-request",
            "Accept": "application/x-git-receive-pack-result",
        },
    )
    with urllib.request.urlopen(req_push, timeout=120) as resp:
        push_res = resp.read().decode("utf-8", errors="replace")
    if "unpack ok" not in push_res or "ok refs/heads/main" not in push_res:
        raise RuntimeError(f"GitLab push rejected: {push_res!r}")
    print(f"==> Step 8: Pushed GitLab main {new_sha[:8]} ({len(files)} files, portal sync enabled; CI build queued)")
    return new_sha


def main():
    parser = argparse.ArgumentParser(description="Validate, export, and CI-gate release Español · Colombia")
    parser.add_argument("--check-only", action="store_true", help="Run local static + Playwright checks only")
    parser.add_argument("--github-only", action="store_true", help="Release to OneDrive + GitHub Pages only")
    parser.add_argument("--gitlab-only", action="store_true", help="Release to private GitLab mirror only")
    parser.add_argument("--message", "-m", default="", help="Commit/PR title")
    args = parser.parse_args()

    ver = current_version()
    run_local_checks()
    if args.check_only:
        print(f"ALL CHECKS PASSED for {ver} (check-only mode, nothing uploaded).")
        return 0
    msg = args.message or f"{ver}: verified release"
    if not args.gitlab_only:
        gh_files = public_repo_files()
        export_onedrive(ver, gh_files)
        release_to_github(ver, gh_files, msg)
    if not args.github_only:
        gl_files = gitlab_repo_files()
        release_to_gitlab(ver, gl_files, msg)
    return 0


if __name__ == "__main__":
    sys.exit(main())
