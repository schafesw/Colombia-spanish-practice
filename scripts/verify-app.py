# -*- coding: utf-8 -*-
"""CI & local pre-push integrity checks for Español · Colombia (zero dependencies)."""
import json
import os
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def collect_exports():
    exports = {}
    all_exported = {}
    files = sorted((ROOT / "data").glob("*.js")) + sorted((ROOT / "src").rglob("*.js"))
    for f in files:
        text = f.read_text(encoding="utf-8")
        syms = set(re.findall(r"^export\s+(?:const|let|var|function|async\s+function)\s+([A-Za-z0-9_$]+)", text, re.M))
        for s in syms:
            all_exported[s] = f.relative_to(ROOT).as_posix()
        for m in re.finditer(r"export\s*\{([^}]+)\}(?:\s*from\s*[\"']([^\"']+)[\"'])?", text, re.S):
            for item in m.group(1).split(","):
                item = item.strip()
                if not item:
                    continue
                syms.add(item.split(" as ")[-1].strip())
        exports[f.resolve()] = syms
    # Resolve `export * from "..."` barrel re-exports
    for f in files:
        text = f.read_text(encoding="utf-8")
        for m in re.finditer(r"export\s+\*\s+from\s+[\"']([^\"']+)[\"']", text):
            target = (f.parent / m.group(1)).resolve()
            exports[f.resolve()].update(exports.get(target, set()))
    return exports, all_exported


def check_imports(exports):
    errors = []
    for f in sorted((ROOT / "data").glob("*.js")) + sorted((ROOT / "src").rglob("*.js")):
        text = f.read_text(encoding="utf-8")
        for m in re.finditer(r"import\s*\{([^}]+)\}\s*from\s*[\"']([^\"']+)[\"']", text, re.S):
            items = [i.strip().split(" as ")[0].strip() for i in m.group(1).split(",") if i.strip()]
            target = (f.parent / m.group(2)).resolve()
            if not target.exists():
                errors.append(f"{f.relative_to(ROOT).as_posix()}: missing import target {m.group(2)}")
                continue
            target_exports = exports.get(target, set())
            missing = [x for x in items if x not in target_exports]
            if missing:
                errors.append(f"{f.relative_to(ROOT).as_posix()} <- {m.group(2)}: missing exports {missing}")
    return errors


def strip_strings_keep_interpolations(code):
    out = []
    i = 0
    n = len(code)
    in_sq = in_dq = False
    bt_depth = 0
    interp_braces = []
    while i < n:
        c = code[i]
        nxt = code[i + 1] if i + 1 < n else ""
        if in_sq:
            if c == "\\":
                i += 2; continue
            if c == "'":
                in_sq = False; out.append("''")
            i += 1
        elif in_dq:
            if c == "\\":
                i += 2; continue
            if c == '"':
                in_dq = False; out.append('""')
            i += 1
        elif interp_braces:
            if c == "'" and not in_dq:
                in_sq = True; i += 1
            elif c == '"' and not in_sq:
                in_dq = True; i += 1
            elif c == "`":
                bt_depth += 1; out.append(" "); i += 1
            elif c == "{":
                interp_braces[-1] += 1; out.append(c); i += 1
            elif c == "}":
                interp_braces[-1] -= 1
                if interp_braces[-1] == 0:
                    interp_braces.pop(); out.append(" ")
                else:
                    out.append(c)
                i += 1
            else:
                out.append(c); i += 1
        elif bt_depth > 0:
            if c == "\\":
                i += 2; continue
            if c == "$" and nxt == "{":
                interp_braces.append(1); out.append(" "); i += 2
            elif c == "`":
                bt_depth -= 1; out.append('""'); i += 1
            else:
                i += 1
        else:
            if c == "'":
                in_sq = True; i += 1
            elif c == '"':
                in_dq = True; i += 1
            elif c == "`":
                bt_depth += 1; i += 1
            else:
                out.append(c); i += 1
    return "".join(out)


def check_free_vars(all_exported):
    warnings = []
    # Local parameter names that intentionally shadow exported symbols inside callbacks
    ignored_locals = {"sel"}
    for f in sorted((ROOT / "src").rglob("*.js")):
        rel = f.relative_to(ROOT).as_posix()
        t = f.read_text(encoding="utf-8")
        local_syms = set(re.findall(r"\b(?:const|let|var|function|async\s+function)\s+([A-Za-z0-9_$]+)", t))
        for m in re.finditer(r"import\s*\{([^}]+)\}\s*from", t, re.S):
            for item in m.group(1).split(","):
                item = item.strip()
                if item:
                    local_syms.add(item.split(" as ")[-1].strip())
        no_comments = re.sub(r"//.*?$|/\*[\s\S]*?\*/", "", t, flags=re.M)
        cleaned = strip_strings_keep_interpolations(no_comments)
        used = set(re.findall(r"(?<![.\w$])\b([A-Za-z_][A-Za-z0-9_$]*)\b(?!\s*:)", cleaned))
        for u in sorted(used):
            if u in ignored_locals or u in local_syms or u not in all_exported:
                continue
            if all_exported[u] != rel:
                warnings.append(f"{rel}: unimported reference `{u}` (defined in {all_exported[u]})")
    return warnings


def check_service_worker():
    errors = []
    sw_txt = (ROOT / "sw.js").read_text(encoding="utf-8")
    start = sw_txt.find("[")
    end = sw_txt.find("];", start) + 1
    sw_list = json.loads(sw_txt[start:end])
    sw_set = set(x[2:] for x in sw_list if x != "./")
    for rel in sorted(sw_set):
        if not (ROOT / rel).exists():
            errors.append(f"sw.js lists missing file: {rel}")

    runtime_dirs = ("assets", "data", "src", "styles")
    disk_runtime = {"index.html", "manifest.json"}
    for d in runtime_dirs:
        p = ROOT / d
        if p.exists():
            for f in p.rglob("*"):
                if f.is_file():
                    disk_runtime.add(f.relative_to(ROOT).as_posix())
    unlisted = sorted(disk_runtime - sw_set)
    if unlisted:
        errors.append(f"Runtime files missing from sw.js CORE_ASSETS: {unlisted}")
    return errors, len(sw_list)


def check_audio_freeze():
    errors = []
    ve = (ROOT / "src" / "audio" / "voice-engine.js").read_text(encoding="utf-8")
    checks = [
        ('VOICE_KEY="esco-selected-voice-v45"', "VOICE_KEY must stay esco-selected-voice-v45"),
        ('["es-CO","es-419","es-MX","es-US","es-AR","es-ES"]', "Locale priority order changed"),
        ("speechSynthesis.speak(u)", "Synchronous speechSynthesis.speak(u) missing"),
        ("voices.filter(", "Un-deduplicated voices filter missing"),
    ]
    for needle, msg in checks:
        if needle not in ve:
            errors.append(f"Audio freeze violation: {msg}")
    return errors


def check_profile_storage_isolation():
    errors = []
    for f in sorted((ROOT / "src").rglob("*.js")):
        rel = f.relative_to(ROOT).as_posix()
        if rel == "src/state/storage.js":
            continue
        t = re.sub(r"//.*?$|/\*[\s\S]*?\*/", "", f.read_text(encoding="utf-8"), flags=re.M)
        if re.search(r"\blocalStorage\b", t):
            errors.append(f"{rel}: direct `localStorage` usage bypasses profile-scoped `appStorage`")
    return errors


def check_version_parity():
    errors = []
    sw_txt = (ROOT / "sw.js").read_text(encoding="utf-8")
    m = re.search(r'CACHE_NAME\s*=\s*"esco-pwa-(v\d+(?:\.\d+)*)"', sw_txt)
    if not m:
        return ['sw.js: could not parse CACHE_NAME ("esco-pwa-v...")']
    ver = m.group(1)
    ver_num = ver.lstrip("v")

    idx_txt = (ROOT / "index.html").read_text(encoding="utf-8")
    for asset in ("manifest.json", "styles/base.css", "styles/polish.css", "styles/labs.css", "src/main.js"):
        needle = f"{asset}?v={ver_num}"
        if needle not in idx_txt:
            errors.append(f"index.html: missing versioned reference `{needle}` (expected {ver})")

    main_txt = (ROOT / "src" / "main.js").read_text(encoding="utf-8")
    for needle in (f"App updated to {ver}", f"sw.js?v={ver_num}"):
        if needle not in main_txt:
            errors.append(f"src/main.js: missing `{needle}` (expected {ver})")

    storage_txt = (ROOT / "src" / "state" / "storage.js").read_text(encoding="utf-8")
    for needle in (f'"{ver} 🔊"', f'version:"{ver}"'):
        if needle not in storage_txt:
            errors.append(f"src/state/storage.js: missing `{needle}` (expected {ver})")

    return errors


def check_github_hygiene():
    errors = []
    if os.environ.get("CI") == "true" and (ROOT / "AGENTS.md").exists():
        errors.append("AGENTS.md must not exist in GitHub repository!")
    sensitive_pats = [
        (r"norvi\.tech", "private host reference"),
        (r"github_pat_", "GitHub token literal"),
        (r"ge-api\.key", "private API key filename"),
    ]
    scan_files = [ROOT / "README.md", ROOT / "index.html", ROOT / "sw.js"] + list((ROOT / "src").rglob("*.js")) + list((ROOT / "data").glob("*.js"))
    for f in scan_files:
        if not f.exists():
            continue
        txt = f.read_text(encoding="utf-8", errors="replace")
        for pat, desc in sensitive_pats:
            if re.search(pat, txt):
                errors.append(f"{f.relative_to(ROOT).as_posix()}: contains disallowed {desc}")
    return errors


def main():
    exports, all_exported = collect_exports()
    errs = []
    errs.extend(check_imports(exports))
    errs.extend(check_free_vars(all_exported))
    sw_errs, sw_count = check_service_worker()
    errs.extend(sw_errs)
    errs.extend(check_audio_freeze())
    errs.extend(check_profile_storage_isolation())
    errs.extend(check_version_parity())
    errs.extend(check_github_hygiene())
    if errs:
        print("VERIFICATION FAILED:")
        for e in errs:
            print(" -", e)
        return 1
    print(f"OK: 0 missing exports, 0 unimported symbols, {sw_count} sw.js assets verified, TTS engine freeze intact.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
