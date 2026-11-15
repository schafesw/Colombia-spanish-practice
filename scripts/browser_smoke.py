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

    def do_GET(self):
        path_only = self.path.split("?", 1)[0]
        override = getattr(self.server, "override_index_html", None)
        if override is not None and path_only in ("/", "/index.html"):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(override)))
            self.end_headers()
            self.wfile.write(override)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass


class ReusableTCPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 128
    override_index_html = None


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
    # GitHub/GitLab CI Linux Docker runners run as root without a user namespace.
    if os.environ.get("CI") == "true" or os.environ.get("GITLAB_CI") == "true":
        return p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
    if sys.platform != "win32":
        try:
            return p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        except Exception:
            return p.chromium.launch(channel="chrome", headless=True)
    try:
        return p.chromium.launch(channel="msedge", headless=True)
    except Exception:
        return p.chromium.launch(headless=True)


def assert_quiz_no_scroll(page, label):
    """Verify every quiz question + all options fit in 1 viewport without scrolling."""
    page.evaluate(
        """() => {
            if (window.speechSynthesis) window.speechSynthesis.speak = () => {};
            showPage('quiz');
        }"""
    )
    page.wait_for_selector("#page-quiz.active .qopt")
    res = page.evaluate(
        """async () => {
            const { applyQuizFitClasses } = await import('./src/core/text-utils.js');
            const scroll = document.querySelector('.scroll');
            if (scroll) scroll.scrollTop = 0;
            window.scrollTo(0, 0);
            const topbar = document.getElementById('topbar')?.getBoundingClientRect();
            const tabbar = document.querySelector('.tab-bar')?.getBoundingClientRect();
            const usableTop = topbar ? topbar.bottom : 0;
            const usableBot = (tabbar && tabbar.height < 120) ? tabbar.top : window.innerHeight;
            const usableH = usableBot - usableTop;
            const card = document.querySelector('#page-quiz .quiz-card');
            const word = document.getElementById('qc-word');
            const opts = document.getElementById('quiz-opts');
            const initBot = opts.getBoundingClientRect().bottom;
            const initNeedScroll = Math.round(initBot - usableBot);

            const qmodes = [...document.querySelectorAll('.qmode')].filter(b => !b.textContent.includes('Dictation'));
            let maxPairH = 0, worstOverflow = 0, worstInfo = null;
            for (const btn of qmodes) {
                btn.click();
                for (let i = 0; i < 35; i++) {
                    nQ();
                    const cr = card.getBoundingClientRect();
                    const or = opts.getBoundingClientRect();
                    const pairH = Math.round(or.bottom - cr.top);
                    if (pairH > maxPairH) maxPairH = pairH;
                    const over = Math.round(or.bottom - usableBot);
                    if (over > worstOverflow) {
                        worstOverflow = over;
                        worstInfo = {mode: btn.textContent.trim(), over, pairH, qLen: word.textContent.length, oLens: [...opts.querySelectorAll('.qopt')].map(o=>o.textContent.length)};
                    }
                }
            }
            // Deterministic worst-case test using the longest prompt + longest choices from the bank
            const qb = await import('./src/core/quiz-bank.js');
            const allItems = [...(qb.aQ || []), ...(qb.CONVERSATION_QUIZ || []), ...(qb.FILL_BLANK_QUIZ || [])];
            const longPrompts = allItems.map(x => String(x.quizPrompt || x.es || '')).sort((a,b) => b.length - a.length).slice(0, 3);
            const longChoices = allItems.map(x => String(x.en || x.answer || x.es || '')).sort((a,b) => b.length - a.length).slice(0, 4);
            word.textContent = longPrompts[0];
            opts.innerHTML = '';
            longChoices.forEach(c => { const b = document.createElement('button'); b.className = 'qopt'; b.textContent = c; opts.appendChild(b); });
            applyQuizFitClasses(word, opts, word.textContent, longChoices);
            const synthOr = opts.getBoundingClientRect();
            const synthCr = card.getBoundingClientRect();
            const synthOver = Math.round(synthOr.bottom - usableBot);
            const synthPairH = Math.round(synthOr.bottom - synthCr.top);

            // Picture Match & 60s Sprint single-screen fit
            const pmBtn = [...document.querySelectorAll('#quiz-v102-hub .mf-chip')].find(x => x.textContent.includes('Picture'));
            pmBtn?.click();
            const pmBot = document.querySelector('.pm-grid')?.getBoundingClientRect()?.bottom || 0;
            const spBtn = [...document.querySelectorAll('#quiz-v102-hub .mf-chip')].find(x => x.textContent.includes('Sprint'));
            spBtn?.click();
            document.querySelector('.sprint-start-btn')?.click();
            const spBot = document.querySelector('.sprint-opts')?.getBoundingClientRect()?.bottom || 0;
            document.querySelector('.sprint-stop-pill')?.click();
            document.querySelector('#quiz-v102-hub .mf-chip')?.click();

            return {
                usableH: Math.round(usableH), usableBot: Math.round(usableBot),
                initNeedScroll, maxPairH, worstOverflow, worstInfo,
                synthOver, synthPairH,
                pmOver: Math.round(pmBot - usableBot),
                spOver: Math.round(spBot - usableBot),
            };
        }"""
    )
    assert res["initNeedScroll"] <= 0, f"{label} initial quiz requires scroll: {res}"
    assert res["worstOverflow"] <= 0, f"{label} sampled quiz question overflows viewport: {res}"
    assert res["synthOver"] <= 0 and res["synthPairH"] <= res["usableH"], f"{label} longest quiz item overflows viewport: {res}"
    assert res["pmOver"] <= 0, f"{label} Picture Match overflows viewport: {res}"
    assert res["spOver"] <= 0, f"{label} 60s Sprint overflows viewport: {res}"

    # Verify answering reveals an unobstructed Next button above/separate from the feedback tray
    page.evaluate("() => { nQ(); }")
    page.wait_for_selector("#page-quiz.active .qopt")
    page.locator("#page-quiz .qopt").first.click()
    page.wait_for_selector("#quiz-next", state="visible")
    btn_check = page.evaluate(
        """() => {
            const next = document.getElementById('quiz-next');
            const fb = document.getElementById('quiz-fb');
            const nr = next.getBoundingClientRect();
            const fr = fb.getBoundingClientRect();
            const hit = document.elementFromPoint(nr.left + nr.width / 2, nr.top + nr.height / 2);
            return {
                nextTop: Math.round(nr.top),
                nextBottom: Math.round(nr.bottom),
                fbTop: Math.round(fr.top),
                fbBottom: Math.round(fr.bottom),
                isNextOnTop: hit === next || next.contains(hit),
            };
        }"""
    )
    assert btn_check["isNextOnTop"] and btn_check["nextTop"] >= btn_check["fbBottom"], (
        f"{label} quiz Next button is covered by feedback tray: {btn_check}"
    )
    page.click("#quiz-next")


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
    httpd.override_index_html = static_html.encode("utf-8")

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

            # Verify Frases view filter tabs toggle visibility and fit cleanly inside phone viewport
            page.click("#tb-frases")
            fr_btns = page.locator(".frase-view-switch .fr-view-btn")
            assert fr_btns.count() == 3, f"Expected 3 Frases view buttons, got {fr_btns.count()}"
            page.locator(".frase-view-switch .fr-view-btn", has_text="Phrases / Frases").click()
            assert page.locator(".fr-conversation-group").is_hidden(), "Expected Conversations hidden in Phrases view"
            assert page.locator(".fr-phrase-collections-group").is_visible(), "Expected Phrase collections visible in Phrases view"
            page.locator(".frase-view-switch .fr-view-btn", has_text="Conversations").click()
            assert page.locator(".fr-conversation-group").is_visible(), "Expected Conversations visible in Conversations view"
            assert page.locator(".fr-phrase-collections-group").is_hidden(), "Expected Phrase collections hidden in Conversations view"
            page.locator(".frase-view-switch .fr-view-btn", has_text="All / Todo").click()
            assert page.locator(".fr-conversation-group").is_visible() and page.locator(".fr-phrase-collections-group").is_visible()
            ears_pill = page.locator(".chat-ears-pill").first
            ears_pill.click()
            assert "Ears-First: ON" in ears_pill.inner_text(), f"Expected Ears-First ON, got {ears_pill.inner_text()!r}"
            assert page.locator(".chat-peek-btn").first.is_visible(), "Expected chat Peek button when Ears-First is ON"
            ears_pill.click()
            assert "Ears-First: OFF" in ears_pill.inner_text(), f"Expected Ears-First OFF, got {ears_pill.inner_text()!r}"

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
            assert desk["topbarH"] >= 50 and desk["tabLeft"] == 0 and 88 <= desk["tabWidth"] <= 250 and desk["tabHeight"] >= 500, (
                f"Expected fixed topbar + left vertical tab rail on 1280x800, got {desk}"
            )
            assert not desk["overflowX"], f"Desktop layout overflowed horizontally: {desk}"
            tab_icons = page_desk.eval_on_selector_all(".tab-bar .tab-item .ti", "els => els.map(e => e.textContent.trim())")
            assert tab_icons == ["🔤", "🎓", "📚", "💬", "🇨🇴", "🧪"], f"Expected classic colorful tab icons, got {tab_icons}"
            # Verify v114.0 Studio UI: Command Finder <dialog>, Sagittal Mouth SVG, and Lecciones Spotlight
            assert page_desk.locator("#lecciones-studio-aside .studio-specimen").is_visible(), "Expected Lecciones Spotlight visible on desktop"
            page_desk.click("#studio-search-trigger")
            page_desk.wait_for_selector("#studio-command-dialog[open]")
            page_desk.fill("#studio-command-input", "tinto")
            assert page_desk.locator("#studio-command-results .studio-cmd-item").count() >= 1, "Expected Command Finder hits for tinto"
            page_desk.click("#studio-command-close")
            page_desk.wait_for_function("() => !document.getElementById('studio-command-dialog').open")
            page_desk.click("#tb-fonetica")
            page_desk.wait_for_selector("#phonetic-mouth-studio svg")
            page_desk.locator("#phonetic-mouth-studio [data-phoneme-id='nye']").click()
            assert page_desk.locator("#phonetic-mouth-studio [data-phoneme-id='nye']").get_attribute("aria-pressed") == "true"
            # Verify v114.1 Recall-First Quiz gate and Spanish Brain reflex lab
            page_desk.click("#tb-quiz")
            page_desk.wait_for_selector("#quiz-recall-toggle")
            page_desk.click("#quiz-recall-toggle")
            assert "Recall-First: ON" in page_desk.locator("#quiz-recall-toggle").inner_text()
            assert page_desk.locator("#quiz-recall-gate").is_visible(), "Expected #quiz-recall-gate visible when Recall-First is ON"
            assert page_desk.locator("#quiz-opts").is_hidden(), "Expected #quiz-opts hidden behind Recall-First gate"
            page_desk.click("#quiz-recall-gate .quiz-recall-show")
            assert page_desk.locator("#quiz-opts").is_visible(), "Expected #quiz-opts visible after clicking Reveal"
            page_desk.click("#quiz-recall-toggle")
            assert "Recall-First: OFF" in page_desk.locator("#quiz-recall-toggle").inner_text()
            page_desk.locator("#quiz-v102-hub .mf-chip", has_text="Spanish Brain").click()
            page_desk.wait_for_selector(".brain-lab-card .brain-cue-word")
            page_desk.locator(".brain-opts .qopt").first.click()
            assert "/1" in page_desk.locator(".brain-score-chip").inner_text(), "Expected .brain-score-chip to increment to /1"
            page_desk.locator("#quiz-v102-hub .mf-chip", has_text="Standard Quiz").click()
            assert_quiz_no_scroll(page_desk, "Desktop 1280x800")
            ctx_desk.close()

            # Verify standard iPhone 390x844 quiz fits 100% without scrolling
            ctx_iphone = browser.new_context(viewport={"width": 390, "height": 844})
            page_iphone = ctx_iphone.new_page()
            attach_listeners(page_iphone)
            page_iphone.goto(base_url, wait_until="domcontentloaded")
            page_iphone.wait_for_selector(".top-utility-summary")
            assert_quiz_no_scroll(page_iphone, "iPhone 390x844")
            # Verify Sun Mode (light theme) has zero blank/low-contrast text tiles across all 6 tabs
            page_iphone.click(".profile-utility-drawer summary")
            page_iphone.click("#theme-toggle-btn")
            assert page_iphone.evaluate("document.documentElement.getAttribute('data-theme')") == "light"
            for tab_id in ("fonetica", "lecciones", "vocab", "frases", "gram", "quiz"):
                page_iphone.click(f"#tb-{tab_id}")
                page_iphone.wait_for_timeout(180)
                if tab_id == "quiz":
                    page_iphone.locator("#page-quiz .qopt").first.click()
                    page_iphone.wait_for_timeout(50)
                low_contrast = page_iphone.evaluate(
                    """() => {
                        const parse = s => { const m = s && s.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/); return m ? [+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]] : null; };
                        const comp = (fg, bg) => [fg[0]*fg[3]+bg[0]*(1-fg[3]), fg[1]*fg[3]+bg[1]*(1-fg[3]), fg[2]*fg[3]+bg[2]*(1-fg[3]), 1];
                        const lum = ([r,g,b]) => { const t = [r,g,b].map(v => (v/=255) <= .03928 ? v/12.92 : ((v+.055)/1.055)**2.4); return .2126*t[0]+.7152*t[1]+.0722*t[2]; };
                        const effBg = el => {
                            const ls = []; let cur = el;
                            while (cur && cur.nodeType === 1) { const c = parse(getComputedStyle(cur).backgroundColor); if (c && c[3] > 0) ls.push(c); cur = cur.parentElement; }
                            let out = parse(getComputedStyle(document.body).backgroundColor) || [242,245,241,1];
                            for (let i = ls.length - 1; i >= 0; i--) out = comp(ls[i], out);
                            return out;
                        };
                        const bad = [];
                        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                        let n;
                        while ((n = w.nextNode())) {
                            const txt = (n.textContent || '').trim();
                            if (!txt || (!/[A-Za-z0-9]/.test(txt) && /^[\\p{Emoji}\\s]+$/u.test(txt))) continue;
                            const el = n.parentElement;
                            if (!el || el.closest('[hidden]')) continue;
                            const pg = el.closest('.page');
                            if (pg && !pg.classList.contains('active')) continue;
                            const st = getComputedStyle(el);
                            if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity < .05) continue;
                            const r = el.getBoundingClientRect();
                            if (!r.width || !r.height) continue;
                            const fg = parse(st.color); if (!fg) continue;
                            const bg = effBg(el);
                            const ef = fg[3] < 1 ? comp(fg, bg) : fg;
                            const cr = (Math.max(lum(ef), lum(bg)) + .05) / (Math.min(lum(ef), lum(bg)) + .05);
                            if (cr < 3.2) bad.push({cr: +cr.toFixed(2), sel: el.className || el.tagName, txt: txt.slice(0,24)});
                        }
                        return bad;
                    }"""
                )
                assert not low_contrast, f"Sun Mode low-contrast tiles on tab {tab_id}: {low_contrast}"
            ctx_iphone.close()

            # 3. Portal sync smoke checks (runs when sync.js is present, e.g. local & GitLab CI)
            if (ROOT / "sync.js").exists():
                import json as _json
                httpd.override_index_html = sync_html.encode("utf-8")
                ctx_sync = browser.new_context(viewport={"width": 1280, "height": 800}, service_workers="block")
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
                assert_quiz_no_scroll(page_sync, "GitLab portal 1280x800")
                ctx_sync.close()

                # Fail-closed 401 + 302 redirect tests
                for bad_label, bad_status, bad_headers, bad_body in (
                    ("401", 401, None, '{"detail":"unauthenticated"}'),
                    ("302", 302, {"Location": "https://auth.globalentry.systems/"}, ""),
                ):
                    ctx_auth = browser.new_context(viewport={"width": 430, "height": 932}, service_workers="block")
                    page_auth = ctx_auth.new_page()
                    page_auth.route("https://fonts.**", lambda r: r.abort())
                    def _make_auth_handler(st, hdrs, body):
                        def _handle_auth(r):
                            if r.request.url.endswith("/index.html") or r.request.url.endswith("/"):
                                r.fulfill(status=200, content_type="text/html; charset=utf-8", body=sync_html)
                            elif r.request.url.endswith("/api/me"):
                                r.fulfill(status=st, content_type="application/json", headers=hdrs, body=body)
                            else:
                                r.continue_()
                        return _handle_auth
                    page_auth.route("**/*", _make_auth_handler(bad_status, bad_headers, bad_body))
                    page_auth.goto(base_url, wait_until="domcontentloaded")
                    page_auth.wait_for_timeout(600)
                    auth_state = page_auth.evaluate("({ splashHidden: document.getElementById('splash').hidden, html: document.getElementById('splash-status').innerHTML, hasMe: !!window.__ESCO_ME })")
                    assert (not auth_state["splashHidden"]) and (not auth_state["hasMe"]) and ("Sign in again" in auth_state["html"]), f"{bad_label} did not fail closed: {auth_state}"
                    ctx_auth.close()

                # 502 offline fallback test: falls back to local app & removes splash
                ctx_off = browser.new_context(viewport={"width": 430, "height": 932}, service_workers="block")
                page_off = ctx_off.new_page()
                page_off.route("https://fonts.**", lambda r: r.abort())
                page_off.route("**/*", lambda r: r.fulfill(status=200, content_type="text/html; charset=utf-8", body=sync_html) if (r.request.url.endswith("/index.html") or r.request.url.endswith("/")) else (r.fulfill(status=502, content_type="text/plain", body="bad gateway") if r.request.url.endswith("/api/me") else r.continue_()))
                page_off.goto(base_url, wait_until="domcontentloaded")
                page_off.wait_for_function("() => !document.getElementById('splash') && window.__escoSyncState && window.__escoSyncState.online === false", timeout=10000)
                ctx_off.close()

                # Malformed/"null" hydrated /api/state values must not crash boot
                ctx_bad = browser.new_context(viewport={"width": 430, "height": 932}, service_workers="block")
                page_bad = ctx_bad.new_page()
                attach_listeners(page_bad, use_static_html=False)
                bad_state_body = _json.dumps({"items": {
                    "esco-lesson-progress-v1": "null",
                    "esco-days-v1": "null",
                    "esco-quiz-v1": "null",
                    "esco-routine-v3": "null",
                    "esco-rapid-stats-v1": "null",
                }})
                def route_bad_state(route):
                    url = route.request.url
                    if url.endswith("/index.html") or url.endswith("/"):
                        route.fulfill(status=200, content_type="text/html; charset=utf-8", body=sync_html)
                    elif url.endswith("/api/me"):
                        route.fulfill(status=200, content_type="application/json", body=_json.dumps({
                            "principal_id": 1, "username": "seth", "display_name": "Seth",
                            "email": "seth@example.test", "provider": "portal", "avatar": {"kind": "initials"},
                            "imported": True,
                        }))
                    elif url.endswith("/api/state"):
                        route.fulfill(status=200, content_type="application/json", body=bad_state_body)
                    elif "/api/state/" in url and route.request.method in ("PUT", "DELETE"):
                        route.fulfill(status=200, content_type="application/json", body='{"ok":true}')
                    else:
                        route.continue_()
                page_bad.route("**/*", route_bad_state)
                page_bad.goto(base_url, wait_until="domcontentloaded")
                page_bad.wait_for_function("() => !document.getElementById('splash')", timeout=10000)
                assert page_bad.locator(".account-name").inner_text().strip() == "Seth", "Expected Seth account bar on sanitized /api/state"
                ctx_bad.close()

                # Stale-cached ES module recovery: sync.js flushes cache and reloads once cleanly
                ctx_stale = browser.new_context(viewport={"width": 430, "height": 932}, service_workers="block")
                page_stale = ctx_stale.new_page()
                lessons_hits = {"n": 0}
                def route_stale_module(route):
                    url = route.request.url
                    if url.endswith("/index.html") or "/?_cb=" in url or url.endswith("/"):
                        route.fulfill(status=200, content_type="text/html; charset=utf-8", body=sync_html)
                    elif url.endswith("/api/me"):
                        route.fulfill(status=200, content_type="application/json", body=_json.dumps({
                            "principal_id": 1, "username": "seth", "display_name": "Seth",
                            "email": "seth@example.test", "provider": "portal", "avatar": {"kind": "initials"},
                            "imported": True,
                        }))
                    elif url.endswith("/api/state"):
                        route.fulfill(status=200, content_type="application/json", body='{"items":{}}')
                    elif "/src/features/lessons.js" in url:
                        lessons_hits["n"] += 1
                        if lessons_hits["n"] == 1:
                            route.fulfill(status=200, content_type="application/javascript", headers={"Cache-Control": "max-age=3600"}, body="export const STALE_ONLY = true;\n")
                        else:
                            route.continue_()
                    else:
                        route.continue_()
                page_stale.route("https://fonts.**", lambda r: r.abort())
                page_stale.route("**/*", route_stale_module)
                page_stale.goto(base_url, wait_until="domcontentloaded")
                page_stale.wait_for_function("() => !document.getElementById('splash') && document.querySelector('.account-name')", timeout=12000)
                assert lessons_hits["n"] >= 2, f"Expected sync.js to recover and re-fetch lessons.js, hits={lessons_hits['n']}"
                assert "_cb=" not in page_stale.url, f"Expected _cb query param cleaned after recovery, got {page_stale.url}"
                ctx_stale.close()

                # Active legacy SWR Service Worker + poisoned CacheStorage recovery
                ctx_sw_recover = browser.new_context(viewport={"width": 430, "height": 932})
                page_sw_recover = ctx_sw_recover.new_page()
                legacy_sw_js = """
const OLD_CACHE = 'esco-pwa-v112.0';
self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).pathname.startsWith('/api/')) return;
  e.respondWith(caches.open(OLD_CACHE).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res && res.status === 200) c.put(req, res.clone());
      return res;
    });
    return hit || net;
  })));
});
"""
                def route_sw_recover(route):
                    url = route.request.url
                    if url.endswith("/__seed_legacy_sw"):
                        route.fulfill(status=200, content_type="text/html; charset=utf-8", body="<!doctype html><title>seed</title>")
                    elif url.endswith("/legacy-sw.js"):
                        route.fulfill(status=200, content_type="application/javascript", body=legacy_sw_js)
                    elif url.endswith("/index.html") or "/?_cb=" in url or url.endswith("/"):
                        route.fulfill(status=200, content_type="text/html; charset=utf-8", body=sync_html)
                    elif url.endswith("/api/me"):
                        route.fulfill(status=200, content_type="application/json", body=_json.dumps({
                            "principal_id": 1, "username": "seth", "display_name": "Seth",
                            "email": "seth@example.test", "provider": "portal", "avatar": {"kind": "initials"},
                            "imported": True,
                        }))
                    elif url.endswith("/api/state"):
                        route.fulfill(status=200, content_type="application/json", body='{"items":{}}')
                    else:
                        route.continue_()
                ctx_sw_recover.route("https://fonts.**", lambda r: r.abort())
                ctx_sw_recover.route("**/*", route_sw_recover)
                page_sw_recover.goto(f"http://127.0.0.1:{port}/__seed_legacy_sw", wait_until="domcontentloaded")
                page_sw_recover.evaluate("""async () => {
                    const c = await caches.open('esco-pwa-v112.0');
                    await c.put('/src/features/vocab.js', new Response('export const STALE_VOCAB_ONLY = 1;', {
                        status: 200,
                        headers: { 'Content-Type': 'application/javascript' },
                    }));
                    await navigator.serviceWorker.register('/legacy-sw.js', { scope: '/' });
                    await navigator.serviceWorker.ready;
                    if (!navigator.serviceWorker.controller) {
                        await new Promise(res => navigator.serviceWorker.addEventListener('controllerchange', res, { once: true }));
                    }
                }""")
                page_sw_recover.goto(base_url, wait_until="domcontentloaded")
                page_sw_recover.wait_for_function("() => !document.getElementById('splash') && document.querySelector('.account-name')", timeout=15000)
                rem_caches = page_sw_recover.evaluate("() => caches.keys()")
                assert "esco-pwa-v112.0" not in rem_caches, f"Expected legacy cache deleted after recovery, got {rem_caches}"
                assert "_cb=" not in page_sw_recover.url, f"Expected _cb cleaned after SW recovery, got {page_sw_recover.url}"
                ctx_sw_recover.close()

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
