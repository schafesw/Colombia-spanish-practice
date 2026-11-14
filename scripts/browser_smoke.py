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
    httpd = ReusableTCPServer(("127.0.0.1", 0), QuietHandler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base_url = f"http://127.0.0.1:{port}/index.html"

    console_errors = []
    page_errors = []
    http_errors = []

    def attach_listeners(page):
        page.route("https://fonts.**", lambda route: route.abort())
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
            ctx.close()

            # 2. Pre-seeded Seth device preservation check
            ctx2 = browser.new_context(viewport={"width": 430, "height": 932})
            ctx2.add_init_script(
                "localStorage.setItem('esco-profile-seth-esco-lessons-v1', JSON.stringify({presentate: true}));"
            )
            page2 = ctx2.new_page()
            attach_listeners(page2)
            page2.goto(base_url, wait_until="domcontentloaded")
            page2.wait_for_selector(".profile-select", state="attached")
            summary2 = page2.locator(".top-utility-summary small").inner_text().strip()
            active2 = page2.evaluate("localStorage.getItem('esco-active-profile-v1')")
            assert "Seth" in summary2 and active2 == "seth", f"Expected Seth preserved, got summary={summary2!r}, active={active2!r}"
            ctx2.close()

            browser.close()
    finally:
        httpd.shutdown()

    assert not console_errors, f"Console errors: {console_errors}"
    assert not page_errors, f"Uncaught page errors: {page_errors}"
    assert not http_errors, f"HTTP >=400 errors: {http_errors}"
    print("OK: Browser smoke passed (Guest default, Seth preservation, 6 tabs, Picture Match, Lesson photos & 4-opt quiz, 0 errors).")
    return 0


if __name__ == "__main__":
    sys.exit(run_smoke())
