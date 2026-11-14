# -*- coding: utf-8 -*-
"""Headless Chromium smoke test for Español · Colombia (runs in CI and locally)."""
import functools
import http.server
import os
import pathlib
import socketserver
import sys
import threading
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass


class ReusableTCPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 128


def wait_images_decoded(page, selector):
    page.wait_for_function(
        """(sel) => {
            const imgs = [...document.querySelectorAll(sel)];
            return imgs.length > 0 && imgs.every(i => i.complete && i.naturalWidth > 0);
        }""",
        arg=selector,
        timeout=10000,
    )


def launch_browser(p):
    # GitHub Actions Linux runners install bundled Chromium; Windows local can reuse Edge.
    if os.environ.get("CI") == "true" or sys.platform != "win32":
        return p.chromium.launch(headless=True)
    try:
        return p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        return p.chromium.launch(headless=True)


def run_smoke():
    import re as _re
    httpd = ReusableTCPServer(("127.0.0.1", 0), QuietHandler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base_url = f"http://127.0.0.1:{port}/index.html"

    raw_html = (ROOT / "index.html").read_text(encoding="utf-8")
    ver_m = _re.search(r'(?:src/main|sync)\.js\?v=([0-9.]+)', raw_html)
    ver = ver_m.group(1) if ver_m else "110.0"
    static_html = (
        raw_html
        .replace('<div id="splash" role=', '<div id="splash" hidden role=')
        .replace(f'<script src="sync.js?v={ver}"></script>', f'<script type="module" src="src/main.js?v={ver}"></script>')
    )
    sync_html = (
        raw_html
        .replace('<div id="splash" hidden', '<div id="splash"')
        .replace(f'<script type="module" src="src/main.js?v={ver}"></script>', f'<script src="sync.js?v={ver}"></script>')
    )

    console_errors = []
    page_errors = []
    http_errors = []

    def attach_listeners(page, use_static_html=True):
        page.route("https://fonts.**", lambda route: route.abort())
        if use_static_html and raw_html != static_html:
            page.route("**/index.html", lambda route: route.fulfill(status=200, content_type="text/html; charset=utf-8", body=static_html))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))
        page.on(
            "requestfailed",
            lambda req: http_errors.append(("FAILED", f"{req.url}: {req.failure}"))
            if "fonts.g" not in req.url
            else None,
        )
        page.on(
            "response",
            lambda res: http_errors.append((res.status, res.url))
            if res.status >= 400 and "fonts.g" not in res.url
            else None,
        )

    try:
        with sync_playwright() as p:
            browser = launch_browser(p)

            # 1. Fresh device smoke test
            ctx = browser.new_context(viewport={"width": 430, "height": 932})
            page = ctx.new_page()
            attach_listeners(page)
            page.goto(base_url, wait_until="domcontentloaded")
            try:
                page.wait_for_selector(".profile-select", state="attached")
            except Exception as e:
                raise RuntimeError(f"Boot failed ({e}); console={console_errors} page={page_errors} http={http_errors}") from e

            warnings = page.locator(".data-warning").count()
            assert warnings == 0, f"Expected 0 data-warning banners, saw {warnings}"

            summary = page.locator(".top-utility-summary small").inner_text().strip()
            assert "Guest" in summary, f"Fresh device should default to Guest, got {summary!r}"
            opt_values = page.eval_on_selector_all(".profile-select option", "els => els.map(e => e.value)")
            assert opt_values == ["guest"], f"Fresh device should only expose guest profile, got {opt_values}"

            # Exercise all 6 top-level navigation tabs
            for tab_id in ("fonetica", "lecciones", "vocab", "frases", "gram", "quiz"):
                page.click(f"#tb-{tab_id}")
                page.wait_for_selector(f"#page-{tab_id}.active")

            # Verify Picture Match deck + 5 category pills + image decode
            page.click("#tb-vocab")
            page.click(".pm-launch-btn")
            set_texts = page.eval_on_selector_all(".pm-set-row button", "els => els.map(e => e.textContent.trim())")
            assert len(set_texts) == 6, f"Expected 6 set filter buttons (All + 5 sets), got {set_texts}"
            assert "All (58)" in set_texts[0], f"Expected All (58) Picture Match scenes, got {set_texts[0]!r}"
            page.locator(".pm-set-row button", has_text="Home").click()
            wait_images_decoded(page, ".pm-grid img")

            # Open Lesson 'Panadería, café y jugos' via Learning Path & search filter
            page.click("#tb-lecciones")
            page.click(".lesson-view-tab[data-view='path']")
            page.fill(".lesson-path-search", "Panadería")
            page.locator(".lesson-card", has_text="Panadería, café y jugos").click()
            page.locator("#lesson-list .lp-nav-btn.primary").click()  # objetivo -> estructura
            page.locator("#lesson-list .lp-nav-btn.primary").click()  # estructura -> palabras
            wait_images_decoded(page, "#lesson-list .lp-visual-card img")

            # Switch to Full mode and step to photo mini-quiz question
            page.locator("#lesson-list .lp-mode-btn", has_text="Full").click()
            seen_photo_quiz = False
            for _ in range(45):
                if page.locator("#lesson-list .lp-quiz-photo").count() > 0:
                    wait_images_decoded(page, "#lesson-list .lp-quiz-photo")
                    opt_count = page.locator("#lesson-list .lp-opt").count()
                    assert opt_count == 4, f"Expected 4 quiz options on photo question, got {opt_count}"
                    page.locator("#lesson-list .lp-opt").first.click()
                    seen_photo_quiz = True
                    break
                next_btns = page.locator("#lesson-list .lp-nav-btn.primary", has_text="Next")
                if next_btns.count() > 0:
                    next_btns.first.click()
                else:
                    finish_btns = page.locator("#lesson-list .lp-nav-btn.primary", has_text="Finish")
                    if finish_btns.count() > 0:
                        finish_btns.first.click()
                    else:
                        page.locator("#lesson-list .lp-opt").first.click()
            assert seen_photo_quiz, "Never reached photo mini-quiz question in Full lesson flow"

            # Verify Service Worker registers cleanly and caches core assets
            sw_info = page.evaluate(
                """async () => {
                    const reg = await navigator.serviceWorker.ready;
                    const keys = await caches.keys();
                    const cache = keys.length ? await caches.open(keys[0]) : null;
                    const cachedUrls = cache ? await cache.keys() : [];
                    return {
                        state: reg && reg.active && reg.active.state,
                        cacheCount: cachedUrls.length,
                        keys,
                    };
                }"""
            )
            assert sw_info["state"] == "activated", f"Service Worker not activated: {sw_info}"
            assert sw_info["cacheCount"] >= 50, f"Expected Service Worker cache populated, got {sw_info}"

            # Exit lesson focus mode, then verify friend '+ New' local profile creation persists across reload cleanly
            page.click("#lesson-list .lp-exit")
            page.locator(".profile-utility-drawer summary").click()
            page.once("dialog", lambda d: d.accept("María"))
            with page.expect_navigation(wait_until="domcontentloaded"):
                page.locator(".profile-bar button", has_text="+ New").click()
            page.wait_for_selector(".profile-select", state="attached")
            summary_new = page.locator(".top-utility-summary small").inner_text().strip()
            active_new = page.evaluate("localStorage.getItem('esco-active-profile-v1')")
            opt_vals_new = page.eval_on_selector_all(".profile-select option", "els => els.map(e => e.value)")
            assert "María" in summary_new and active_new.startswith("mar"), f"Expected new María profile active, got {summary_new!r} ({active_new!r})"
            assert "seth" not in opt_vals_new, f"Fresh friend device must never expose seth profile, got {opt_vals_new}"
            ctx.close()

            # 2. Pre-seeded Seth device preservation check + unified Due Today SRS Review check
            ctx2 = browser.new_context(viewport={"width": 430, "height": 932})
            ctx2.add_init_script(
                "localStorage.setItem('esco-profile-seth-esco-lessons-v1', JSON.stringify({presentate: true}));"
                "localStorage.setItem('esco-profile-seth-esco-srs-v1', JSON.stringify({'pm|pm-gaseosa':{reps:1,interval:1,lapses:0,due:1}}));"
            )
            page2 = ctx2.new_page()
            attach_listeners(page2)
            page2.goto(base_url, wait_until="domcontentloaded")
            page2.wait_for_selector(".profile-select", state="attached")
            summary2 = page2.locator(".top-utility-summary small").inner_text().strip()
            active2 = page2.evaluate("localStorage.getItem('esco-active-profile-v1')")
            assert "Seth" in summary2 and active2 == "seth", f"Expected Seth preserved, got summary={summary2!r}, active={active2!r}"
            more_summary = page2.locator(".starter-more-tools > summary").first
            if more_summary.count() > 0:
                more_summary.click()
            page2.locator(".today-quick-grid button", has_text="Review Cards").click()
            page2.wait_for_selector("#lesson-list .df-wrap")
            due_prompt = page2.locator("#lesson-list .sprint-cue-word").inner_text().strip()
            assert "gaseosa" in due_prompt.lower(), f"Expected due pm|pm-gaseosa card in unified SRS review, got {due_prompt!r}"
            ctx2.close()

            # Verify desktop left tab rail & fixed #topbar without horizontal overflow
            ctx_desk = browser.new_context(viewport={"width": 1280, "height": 800})
            page_desk = ctx_desk.new_page()
            attach_listeners(page_desk)
            if page_desk_sync := (ROOT / "sync.js").exists():
                pass
            page_desk.goto(base_url, wait_until="domcontentloaded")
            page_desk.wait_for_selector("#topbar .top-utility-summary")
            desk = page_desk.evaluate(
                """() => {
                    const topbar = document.getElementById('topbar').getBoundingClientRect();
                    const tabbar = document.querySelector('.tab-bar').getBoundingClientRect();
                    const scroll = document.querySelector('.scroll');
                    return {
                        topbarH: topbar.height,
                        tabLeft: tabbar.left,
                        tabWidth: tabbar.width,
                        tabHeight: tabbar.height,
                        overflowX: scroll.scrollWidth > scroll.clientWidth || document.documentElement.scrollWidth > window.innerWidth,
                    };
                }"""
            )
            assert desk["topbarH"] >= 50 and desk["tabLeft"] == 0 and desk["tabWidth"] <= 110 and desk["tabHeight"] >= 500, (
                f"Expected fixed topbar + left vertical tab rail on 1280x800, got {desk}"
            )
            assert not desk["overflowX"], f"Desktop layout overflowed horizontally: {desk}"
            ctx_desk.close()

            # 3. Portal sync smoke checks (runs when sync.js is present, e.g. local & GitLab CI)
            if (ROOT / "sync.js").exists():
                import json as _json
                ctx_sync = browser.new_context(viewport={"width": 1280, "height": 800})
                ctx_sync.add_init_script("localStorage.setItem('esco-profile-seth-esco-streak-v1', '7');")
                page_sync = ctx_sync.new_page()
                attach_listeners(page_sync, use_static_html=False)
                sync_calls = {"import": 0, "state_puts": [], "avatar": 0}

                def route_sync(route):
                    url = route.request.url
                    if url.endswith("/index.html") or url.endswith("/"):
                        route.fulfill(status=200, content_type="text/html; charset=utf-8", body=sync_html)
                    elif url.endswith("/api/me"):
                        route.fulfill(status=200, content_type="application/json", body=_json.dumps({
                            "principal_id": 9, "username": "other", "display_name": "Other User",
                            "email": "other@example.test", "provider": "portal", "avatar": {"kind": "initials"},
                            "imported": False,
                        }))
                    elif url.endswith("/api/state"):
                        route.fulfill(status=200, content_type="application/json", body='{"items":{}}')
                    elif url.endswith("/api/import"):
                        sync_calls["import"] += 1
                        route.fulfill(status=200, content_type="application/json", body='{"ok":true}')
                    elif "/api/state/" in url and route.request.method in ("PUT", "DELETE"):
                        if route.request.method == "PUT":
                            sync_calls["state_puts"].append(url.split("/api/state/")[-1])
                        route.fulfill(status=200, content_type="application/json", body='{"ok":true}')
                    else:
                        route.continue_()

                page_sync.route("**/*", route_sync)
                page_sync.goto(base_url, wait_until="domcontentloaded")
                page_sync.wait_for_selector(".account-name", timeout=10000)
                acct_name = page_sync.locator(".account-name").inner_text().strip()
                assert acct_name == "Other User", f"Expected portal account bar, got {acct_name!r}"
                assert sync_calls["import"] == 0, "Review #4 regression: auto-imported legacy seth keys without user consent!"
                page_sync.locator(".account-summary").click()
                assert page_sync.locator(".import-legacy-banner button").count() == 1, "Expected explicit opt-in import button"
                # Ensure app writes sync normal state while VOICE_KEY remains device-local
                page_sync.evaluate("""async () => {
                    const st = await import('./src/state/storage.js?v=' + '%s');
                    st.appStorage.setItem('esco-selected-voice-v45', 'apple-paulina');
                    st.appStorage.setItem('esco-streak-v1', '8');
                }""" % ver)
                page_sync.wait_for_timeout(850)
                assert "esco-streak-v1" in sync_calls["state_puts"], f"Expected streak sync PUT, got {sync_calls['state_puts']}"
                assert "esco-selected-voice-v45" not in sync_calls["state_puts"], f"Voice key leaked to sync queue: {sync_calls['state_puts']}"
                ctx_sync.close()

                # Fail-closed 401 test
                ctx_401 = browser.new_context(viewport={"width": 430, "height": 932})
                page_401 = ctx_401.new_page()
                page_401.route("https://fonts.**", lambda r: r.abort())
                page_401.route("**/*", lambda r: r.fulfill(status=200, content_type="text/html; charset=utf-8", body=sync_html) if (r.request.url.endswith("/index.html") or r.request.url.endswith("/")) else (r.fulfill(status=401, content_type="application/json", body='{"detail":"unauthenticated"}') if r.request.url.endswith("/api/me") else r.continue_()))
                page_401.goto(base_url, wait_until="domcontentloaded")
                page_401.wait_for_timeout(600)
                auth_state = page_401.evaluate("({ splashHidden: document.getElementById('splash').hidden, html: document.getElementById('splash-status').innerHTML, hasMe: !!window.__ESCO_ME })")
                assert (not auth_state["splashHidden"]) and (not auth_state["hasMe"]) and ("Iniciar sesi" in auth_state["html"]), f"401 did not fail closed: {auth_state}"
                ctx_401.close()

            browser.close()
    finally:
        httpd.shutdown()

    assert not console_errors, f"Console errors: {console_errors}"
    assert not page_errors, f"Uncaught page errors: {page_errors}"
    assert not http_errors, f"HTTP >=400 errors: {http_errors}"
    print("OK: Browser smoke passed (Guest default, +New profile, SW cache, Seth preservation, 6 tabs, Picture Match, Lesson photos & 4-opt quiz, 0 errors).")
    return 0


if __name__ == "__main__":
    sys.exit(run_smoke())
