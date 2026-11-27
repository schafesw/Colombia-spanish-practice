import {
  PRONOMBRES, SPEAKING_GUIDE, REGIONAL_ATLAS, REGIONAL_SWITCHER, REGION_IMAGES,
  VISUAL_GUIDES, CONNECTOR_BRIDGE_DRILLS, REGISTER_SWITCHER, STREET_GRID_DECODER,
  TEXTBOOK_VS_COLOMBIAN, STREET_EAR_LINKER, TRAMPAS_COLOMBIANAS,
} from "../../data/index.js";
import { userPrefs, saveUserPrefs, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { markPractice, recordSrs, recordSpeakingError, clearSpeakingError, attachStarBtn } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";

export function mountMiniGrammarLab(sec, kicker, bank, srsPrefix) {
  let idx = 0, score = 0;
  const box = document.createElement("section");
  box.className = "bridge-trainer-card";
  box.style.marginTop = "12px";
  const draw = () => {
    const q = bank[idx % bank.length];
    box.innerHTML = `<div class="bridge-head"><div><div class="bridge-title">${kicker} · ${(idx % bank.length) + 1}/${bank.length}</div><div class="bridge-sub">${escapeVocabHtml(q.prompt)}</div></div><div class="bridge-score">${score}/${idx}</div></div>`;
    const opts = document.createElement("div");
    opts.className = "bridge-opts vq-opts";
    const fb = document.createElement("div");
    fb.className = "bridge-fb";
    const nxt = document.createElement("button");
    nxt.type = "button";
    nxt.className = "bridge-next";
    nxt.hidden = true;
    nxt.textContent = "Next →";
    nxt.onclick = () => { idx++; draw(); };
    const indexed = q.choices.map((c, i) => ({ c, i })).sort(() => Math.random() - 0.5);
    indexed.forEach(({ c, i }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bridge-opt";
      b.textContent = c;
      b.onclick = () => {
        if (!nxt.hidden) return;
        const ok = i === q.ans;
        if (ok) score++;
        b.classList.add(ok ? "ok" : "no");
        if (!ok) Array.from(opts.children).forEach(x => { if (x.textContent === q.choices[q.ans]) x.classList.add("ok"); });
        Array.from(opts.children).forEach(x => x.disabled = true);
        recordSrs(srsPrefix + q.id, ok);
        speak(q.choices[q.ans], 0.8);
        fb.textContent = (ok ? "✅ " : "❌ ") + q.why;
        const sc = box.querySelector(".bridge-score");
        if (sc) sc.textContent = score + "/" + (idx + 1);
        nxt.hidden = false;
      };
      opts.appendChild(b);
    });
    box.append(opts, fb, nxt);
  };
  draw();
  sec.appendChild(box);
}

export function appendGramQuickCheck(sec, items) {
  const valid = (items || []).filter(x => x && x.es && x.en);
  if (valid.length < 2) return;
  const pool = valid.slice(0, 6);
  const picks = pool.slice(0, 2);
  let qi = 0, score = 0, answered = false;
  const card = document.createElement("section");
  card.className = "bridge-trainer-card gram-quick-check";
  const draw = () => {
    if (qi >= picks.length) {
      card.innerHTML = `<div class="bridge-kicker">🧪 QUICK GRAMMAR CHECK</div>
        <div class="gram-qc-done"><strong>${score}/${picks.length} Correct</strong><small>${score === picks.length ? "¡Excelente! Pattern locked in." : "Review the pattern above and retry anytime."}</small></div>
        <button type="button" class="lp-nav-btn primary">🔄 Try another 2 questions</button>`;
      card.querySelector("button").onclick = () => { qi = 0; score = 0; answered = false; draw(); };
      return;
    }
    const target = picks[qi];
    const distractors = pool.filter(x => x.es !== target.es).sort(() => Math.random() - 0.5).slice(0, 2);
    if (distractors.length < 2 && typeof SPEAKING_GUIDE !== "undefined") {
      SPEAKING_GUIDE.flatMap(g => g.examples || []).forEach(ex => {
        if (distractors.length < 2 && ex.es && ex.es !== target.es) distractors.push(ex);
      });
    }
    const opts = [target, ...distractors].slice(0, 3).sort(() => Math.random() - 0.5);
    answered = false;
    card.innerHTML = `<div class="bridge-kicker">🧪 QUICK CHECK · ${qi + 1} OF ${picks.length}</div>
      <div class="bridge-context">Which Spanish sentence naturally expresses: <strong>“${escapeVocabHtml(target.en)}”</strong>?</div>
      <div class="gram-qc-opts"></div>
      <div class="bridge-feedback" aria-live="polite"></div>
      <div class="bridge-actions"></div>`;
    const oWrap = card.querySelector(".gram-qc-opts"), fb = card.querySelector(".bridge-feedback"), acts = card.querySelector(".bridge-actions");
    opts.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lp-opt";
      b.textContent = o.es;
      b.onclick = () => {
        if (answered) return;
        answered = true;
        const ok = o.es === target.es;
        if (ok) { score++; b.classList.add("correct"); clearSpeakingError(target.es); markPractice("phrases", target.es); }
        else { b.classList.add("wrong"); recordSpeakingError(target.es, "grammar check"); oWrap.querySelectorAll(".lp-opt").forEach(x => { if (x.textContent === target.es) x.classList.add("reveal"); }); }
        speak(target.tts || target.es, 0.78);
        fb.textContent = ok ? `✅ ¡Correcto! ${target.es}` : `❌ Natural model: ${target.es}`;
        const nxt = document.createElement("button");
        nxt.type = "button";
        nxt.className = "lp-nav-btn primary";
        nxt.textContent = qi + 1 < picks.length ? "Next question →" : "Finish check →";
        nxt.onclick = () => { qi++; draw(); };
        acts.appendChild(nxt);
      };
      oWrap.appendChild(b);
    });
  };
  draw();
  sec.appendChild(card);
}

const PRONOMBRES_BUILDER_DRILLS = [
  { id: "pro-nequi", en: "I already sent it to you via Nequi (money/transfer → se lo / te lo)", tokens: ["Ya", "te", "lo", "pasé", "por Nequi"], extra: ["le", "la"], why: "'Te' (to you) always comes BEFORE 'lo' (it/transfer), right before the conjugated verb." },
  { id: "pro-menu", en: "Can you gift/serve it to me hot, please? (Colombian café ask · el tinto)", tokens: ["¿Me", "lo", "regala", "calientico", "por fa?"], extra: ["se", "los"], why: "'Me lo regala' puts 'me' (for me) + 'lo' (el tinto, masculine) right before the verb." },
  { id: "pro-empanadas", en: "Bring them (empanadas, feminine plural) to us on a plate!", tokens: ["Nos", "las", "trae", "en un plato,", "por favor"], extra: ["los", "le"], why: "'Empanadas' is feminine plural → 'las', after indirect 'nos' (to us)." },
  { id: "pro-se-lo", en: "Tell it (the address) to her right now ('le lo' → always swaps to 'se lo'!)", tokens: ["Se", "lo", "digo", "ahorita", "a Camila"], extra: ["Le", "la"], why: "Golden rule: Spanish never says 'le lo' or 'les lo' — 'le/les' always becomes 'se'!" },
  { id: "pro-arepa", en: "I recommend it (la arepa de huevo) to you!", tokens: ["Te", "la", "recomiendo", "muchísimo"], extra: ["lo", "le"], why: "'La arepa' is feminine singular → 'Te la recomiendo'." },
  { id: "pro-llaves", en: "Give them (las llaves) back to me when you get back", tokens: ["Me", "las", "devuelves", "cuando", "vuelvas"], extra: ["los", "se"], why: "'Las llaves' (keys) = feminine plural → 'Me las devuelves'." },
];

export const PRONOMBRES_QUIZ = [
  { id: "pro-le-lo", prompt: "Tell the cashier 'I already sent it (the payment) to him/her' — avoid 'le lo':", choices: ["Ya se lo envié por Nequi.", "Ya le lo envié por Nequi.", "Ya lo le envié por Nequi."], ans: 0, why: "'Le/les' + 'lo/la/los/las' ALWAYS changes 'le' → 'se' (Se lo envié)." },
  { id: "pro-empanadas-ask", prompt: "Asking for 3 empanadas ('las empanadas'): 'Please heat them up for me':", choices: ["¿Me las calienta, por favor?", "¿Me los calienta, por favor?", "¿Me le calienta, por favor?"], ans: 0, why: "'Empanadas' is feminine plural → use 'las' ('Me las calienta')." },
  { id: "pro-cafe-order", prompt: "Asking for un tinto (masculine): 'Waiter, give it to me please':", choices: ["¿Me lo regala, por favor?", "¿Me la regala, por favor?", "¿Lo me regala, por favor?"], ans: 0, why: "Order rule: Indirect ('me/te/se/nos') ALWAYS goes before Direct ('lo/la') → Me lo regala." },
  { id: "pro-bandeja", prompt: "Commenting on 'la bandeja paisa' you loved: 'You have to try it!'", choices: ["¡Tienes que probarla!", "¡Tienes que probarlo!", "¡Tienes que probarle!"], ans: 0, why: "'La bandeja' is feminine → attach '-la' to infinitive ('probarla') or place before ('La tienes que probar')." },
  { id: "pro-regalar-plural", prompt: "Buying two water bottles ('dos botellas de agua'): 'Give them to us cold':", choices: ["Nos las da bien frías.", "Nos los da bien frías.", "Les nos da bien frías."], ans: 0, why: "'Botellas' is feminine plural → 'Nos' (to us) + 'las' (them)." },
  { id: "pro-dilo", prompt: "Short command: 'Tell me (what happened)!' in Bogotá polite usted:", choices: ["Cuénteme qué pasó.", "Cuéntelo qué pasó.", "Me cuente qué pasó."], ans: 0, why: "Positive commands attach the pronoun cleanly to the end: 'Cuénteme' / 'Dígame'." },
];

export function buildPronombres(sec) {
  const intro = document.createElement("div");
  intro.className = "gram-intro";
  intro.innerHTML = `<div class="gram-intro-title">👤 Pronombres de Objeto</div>
    <div class="gram-intro-text">Lo/La/Le/Me/Te etc. These small words replace nouns and are placed BEFORE the verb. Mastering these makes you sound very natural in Colombian Spanish.</div>`;
  sec.appendChild(intro);
  [PRONOMBRES.directo, PRONOMBRES.indirecto].forEach(table => {
    const pt = document.createElement("div");
    pt.className = "pro-table";
    pt.innerHTML = `<div class="pro-hdr" style="background:${table.color}22"><div class="pro-hdr-title" style="color:${table.color}">${table.title}</div><div class="pro-hdr-sub">${table.sub}</div></div>`;
    table.rows.forEach(row => {
      const r = document.createElement("div");
      r.className = "pro-row";
      r.innerHTML = `<span class="pro-word" style="color:${table.color}">${row.w}</span><div style="flex:1"><div class="pro-meaning">${row.meaning}</div><div class="pro-example">${row.example}</div></div><span class="pro-spk">🔊</span>`;
      r.onclick = () => speak(row.tts, 0.8);
      pt.appendChild(r);
    });
    sec.appendChild(pt);
  });
  const trick = document.createElement("div");
  trick.className = "trick-box";
  trick.innerHTML = `<div class="trick-title">🧠 Colombian Tip</div><div class="trick-text">${PRONOMBRES.trick}</div>`;
  sec.appendChild(trick);

  /* Interactive Tap-to-Assemble Word-Order Builder (v133.0) */
  let bIdx = 0, bScore = 0, bAttempts = 0;
  const bCard = document.createElement("section");
  bCard.className = "bridge-trainer-card pro-builder-card";
  const drawBuilder = () => {
    const item = PRONOMBRES_BUILDER_DRILLS[bIdx % PRONOMBRES_BUILDER_DRILLS.length];
    const targetSentence = item.tokens.join(" ");
    const allChoices = [...item.tokens, ...(item.extra || [])].map((t, i) => ({ t, uid: i })).sort((a, b) => a.t.localeCompare(b.t));
    let pickedIds = [], solved = false;
    const renderBuilderState = () => {
      const builtText = pickedIds.map(id => allChoices.find(x => x.uid === id)?.t || "").join(" ");
      bCard.innerHTML = `<div class="bridge-head"><div><div class="bridge-kicker">🧩 TAP-TO-BUILD PRONOUN ORDER · ${(bIdx % PRONOMBRES_BUILDER_DRILLS.length) + 1}/${PRONOMBRES_BUILDER_DRILLS.length}</div><div class="bridge-sub">${escapeVocabHtml(item.en)}</div></div><div class="bridge-score">${bScore}/${bAttempts}</div></div>
        <div class="pro-builder-slots" aria-live="polite"></div>
        <div class="pro-tile-pool"></div>
        <div class="bridge-fb"></div>
        <div class="bridge-actions"></div>`;
      const slots = bCard.querySelector(".pro-builder-slots");
      const pool = bCard.querySelector(".pro-tile-pool");
      const fb = bCard.querySelector(".bridge-fb");
      const acts = bCard.querySelector(".bridge-actions");
      if (!pickedIds.length) {
        slots.innerHTML = `<span class="bridge-context" style="margin:0">Tap words in order below (indirect → direct → verb)…</span>`;
      } else {
        pickedIds.forEach(uid => {
          const obj = allChoices.find(x => x.uid === uid);
          const pb = document.createElement("button");
          pb.type = "button";
          pb.className = "pro-tile placed";
          pb.textContent = obj.t;
          pb.onclick = () => {
            if (solved) return;
            pickedIds = pickedIds.filter(x => x !== uid);
            renderBuilderState();
          };
          slots.appendChild(pb);
        });
      }
      allChoices.forEach(obj => {
        const used = pickedIds.includes(obj.uid);
        const tb = document.createElement("button");
        tb.type = "button";
        tb.className = "pro-tile" + (used ? " used" : "");
        tb.disabled = used || solved;
        tb.textContent = obj.t;
        tb.onclick = () => {
          if (solved || pickedIds.includes(obj.uid)) return;
          pickedIds.push(obj.uid);
          renderBuilderState();
        };
        pool.appendChild(tb);
      });
      const hearBtn = document.createElement("button");
      hearBtn.type = "button";
      hearBtn.className = "lp-nav-btn";
      hearBtn.textContent = "🔊 Hear Goal";
      hearBtn.onclick = () => speak(targetSentence, 0.78);
      const clrBtn = document.createElement("button");
      clrBtn.type = "button";
      clrBtn.className = "lp-nav-btn";
      clrBtn.textContent = "↺ Clear";
      clrBtn.disabled = solved || !pickedIds.length;
      clrBtn.onclick = () => { pickedIds = []; renderBuilderState(); };
      const chkBtn = document.createElement("button");
      chkBtn.type = "button";
      chkBtn.className = "lp-nav-btn primary";
      chkBtn.textContent = "✓ Check Order";
      chkBtn.disabled = solved || !pickedIds.length;
      chkBtn.onclick = () => {
        bAttempts++;
        const ok = builtText === targetSentence;
        if (ok) bScore++;
        solved = true;
        recordSrs("pro|" + item.id, ok);
        markPractice("phrases", targetSentence);
        speak(targetSentence, 0.78);
        const slotHtml = ok
          ? `✅ <strong>¡Perfecto!</strong> “${escapeVocabHtml(targetSentence)}” — ${escapeVocabHtml(item.why)}`
          : `❌ Model: <strong>“${escapeVocabHtml(targetSentence)}”</strong> — ${escapeVocabHtml(item.why)}`;
        const sc = bCard.querySelector(".bridge-score");
        if (sc) sc.textContent = `${bScore}/${bAttempts}`;
        fb.innerHTML = slotHtml;
        chkBtn.hidden = true;
        clrBtn.hidden = true;
        const nxt = document.createElement("button");
        nxt.type = "button";
        nxt.className = "bridge-next";
        nxt.textContent = "Next sentence →";
        nxt.onclick = () => { bIdx++; drawBuilder(); };
        acts.appendChild(nxt);
      };
      acts.append(hearBtn, clrBtn, chkBtn);
    };
    renderBuilderState();
  };
  drawBuilder();
  sec.appendChild(bCard);

  mountMiniGrammarLab(sec, "👤 Lo · La · Le · Se lo Check", PRONOMBRES_QUIZ, "pro|");

  const exLabel = document.createElement("div");
  exLabel.className = "sl";
  exLabel.style.color = "var(--muted)";
  exLabel.textContent = "Ejemplos";
  sec.appendChild(exLabel);
  PRONOMBRES.examples.forEach(ex => {
    const card = document.createElement("div");
    card.className = "example-card";
    card.innerHTML = `<div class="ex-info"><div class="ex-es">${ex.es}</div><div class="ex-en">${ex.en}</div></div><span class="ex-spk">🔊</span>`;
    card.onclick = () => speak(ex.tts, 0.75);
    sec.appendChild(card);
  });
  appendGramQuickCheck(sec, PRONOMBRES.examples);
}

let bridgeDrillIdx = 0;
export function applyHablarTab(tabId) {
  userPrefs.hablarTab = tabId || "regions";
  saveUserPrefs();
  const sec = document.getElementById("gs-estructura");
  if (!sec) return;
  sec.querySelectorAll(".hablar-subtab").forEach(b => {
    const on = b.dataset.tab === userPrefs.hablarTab;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
    b.tabIndex = on ? 0 : -1;
  });
  sec.querySelectorAll("[data-hablar-group]").forEach(el => {
    el.hidden = (userPrefs.hablarTab !== "all" && el.dataset.hablarGroup !== userPrefs.hablarTab);
  });
}

export function buildSpeakingGuide() {
  const sec = document.getElementById("gs-estructura");
  if (!sec) return;
  sec.innerHTML = "";
  const intro = document.createElement("div");
  intro.className = "gram-intro";
  intro.innerHTML = "<div class='gram-intro-title'>🇨🇴 Guías &amp; Hablar Naturalmente</div><div class='gram-intro-text'>Switch between Colombian regions, illustrated guides, street-speed contractions, and false-friend traps without scrolling through one giant wall.</div>";
  sec.appendChild(intro);
  const subBar = document.createElement("div");
  subBar.className = "hablar-subtabs";
  subBar.setAttribute("role", "tablist");
  subBar.setAttribute("aria-label", "Guías categories");
  [
    ["regions", "🗺️ Regions & Switcher"],
    ["visual", "🖼️ Visual Guides"],
    ["ear", "🎧 Street Ear"],
    ["trampas", "🪤 Bridges & Trampas"],
    ["all", "📋 All"],
  ].forEach(([id, lbl]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hablar-subtab";
    b.dataset.tab = id;
    b.setAttribute("role", "tab");
    b.textContent = lbl;
    b.onclick = () => applyHablarTab(id);
    subBar.appendChild(b);
  });
  subBar.onkeydown = e => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const tabs = Array.from(subBar.querySelectorAll('[role="tab"]'));
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const nxt = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    applyHablarTab(tabs[nxt].dataset.tab);
    tabs[nxt].focus();
  };
  sec.appendChild(subBar);

  if (typeof CONNECTOR_BRIDGE_DRILLS !== "undefined" && CONNECTOR_BRIDGE_DRILLS.length) {
    const trainer = document.createElement("section");
    trainer.className = "bridge-trainer-card";
    trainer.dataset.hablarGroup = "trampas";
    const renderBridge = () => {
      const d = CONNECTOR_BRIDGE_DRILLS[bridgeDrillIdx % CONNECTOR_BRIDGE_DRILLS.length];
      const fullEs = (d.thoughtA + d.correct + d.thoughtB).replace(/\s+/g, " ").trim();
      trainer.innerHTML = `<div class="bridge-kicker">🔗 INTERACTIVE BRIDGE TRAINER · ${bridgeDrillIdx + 1} OF ${CONNECTOR_BRIDGE_DRILLS.length}</div>
        <div class="bridge-context">${escapeVocabHtml(d.context)}</div>
        <div class="bridge-sentence-box">
          <span class="bridge-part">${escapeVocabHtml(d.thoughtA)}</span>
          <span class="bridge-slot" id="bridge-slot-label"> [ choose bridge ] </span>
          <span class="bridge-part">${escapeVocabHtml(d.thoughtB)}</span>
        </div>
        <div class="bridge-en">${escapeVocabHtml(d.en)}</div>
        <div class="bridge-choices"></div>
        <div class="bridge-feedback" aria-live="polite">Tap the Colombian connector that links these two ideas:</div>
        <div class="bridge-actions"></div>`;
      const choicesWrap = trainer.querySelector(".bridge-choices");
      const fb = trainer.querySelector(".bridge-feedback");
      const slotEl = trainer.querySelector("#bridge-slot-label");
      d.choices.forEach(ch => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "bridge-choice-btn";
        b.textContent = ch.trim();
        b.onclick = () => {
          if (ch === d.correct) {
            choicesWrap.querySelectorAll("button").forEach(x => x.classList.remove("wrong"));
            b.classList.add("correct");
            slotEl.textContent = " " + ch.trim() + " ";
            slotEl.classList.add("filled");
            fb.innerHTML = `✅ <strong>${escapeVocabHtml(fullEs)}</strong><br><small>💡 ${escapeVocabHtml(d.tip)}</small>`;
            markPractice("phrases", fullEs);
            speak(fullEs, 0.75);
          } else {
            b.classList.add("wrong");
            fb.textContent = "Try another connector — listen for what fits the meaning in brackets.";
          }
        };
        choicesWrap.appendChild(b);
      });
      const acts = trainer.querySelector(".bridge-actions");
      const hearFull = document.createElement("button");
      hearFull.type = "button";
      hearFull.className = "lp-nav-btn";
      hearFull.textContent = "🔊 Hear full sentence";
      hearFull.onclick = () => speak(fullEs, 0.75);
      const nextDrill = document.createElement("button");
      nextDrill.type = "button";
      nextDrill.className = "lp-nav-btn primary";
      nextDrill.textContent = "Next bridge drill →";
      nextDrill.onclick = () => { bridgeDrillIdx = (bridgeDrillIdx + 1) % CONNECTOR_BRIDGE_DRILLS.length; renderBridge(); };
      acts.append(hearFull, nextDrill);
      attachMic(acts, fullEs, "phrases");
    };
    renderBridge();
    sec.appendChild(trainer);
  }

  if (typeof REGISTER_SWITCHER !== "undefined" && REGISTER_SWITCHER.length) {
    let regIdx = 0, activeReg = "ust";
    const regCard = document.createElement("section");
    regCard.className = "bridge-trainer-card register-switcher-card";
    regCard.dataset.hablarGroup = "regions";
    const regMeta = {
      ust: { badge: "🎩 Usted", region: "Bogotá · Formal & Affectionate" },
      tu: { badge: "👋 Tú", region: "Bogotá Peers · Caribbean Coast" },
      vos: { badge: "🌸 Vos", region: "Medellín (Paisa) · Cali (Valluno)" },
      sumerce: { badge: "🏔️ Sumercé", region: "Bogotá · Boyacá Warm Polite" },
    };
    const renderReg = () => {
      const item = REGISTER_SWITCHER[regIdx % REGISTER_SWITCHER.length];
      const cur = item[activeReg] || item.ust;
      regCard.innerHTML = `<div class="bridge-kicker">🗣️ COLOMBIAN REGISTER SWITCHER · ${regIdx + 1} OF ${REGISTER_SWITCHER.length}</div>
        <div class="bridge-context">${escapeVocabHtml(item.intent)}</div>
        <div class="bridge-en">${escapeVocabHtml(item.when)}</div>
        <div class="reg-tabs-row"></div>
        <div class="reg-active-box" title="Tap to hear">
          <div class="reg-active-region">${escapeVocabHtml(regMeta[activeReg].badge)} · ${escapeVocabHtml(regMeta[activeReg].region)}</div>
          <div class="reg-active-es">${escapeVocabHtml(cur.es)} 🔊</div>
          <div class="reg-active-note">💡 ${escapeVocabHtml(cur.note)}</div>
        </div>
        <div class="reg-compare-grid"></div>
        <div class="bridge-actions"></div>`;
      const tabsRow = regCard.querySelector(".reg-tabs-row");
      Object.entries(regMeta).forEach(([k, m]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "reg-tab-btn" + (k === activeReg ? " active" : "");
        b.textContent = m.badge;
        b.onclick = () => {
          activeReg = k;
          const picked = item[k] || item.ust;
          renderReg();
          speak(picked.es, 0.75);
        };
        tabsRow.appendChild(b);
      });
      regCard.querySelector(".reg-active-box").onclick = () => speak(cur.es, 0.75);
      const cmpGrid = regCard.querySelector(".reg-compare-grid");
      Object.entries(regMeta).forEach(([k, m]) => {
        const v = item[k];
        if (!v) return;
        const row = document.createElement("button");
        row.type = "button";
        row.className = "reg-compare-row" + (k === activeReg ? " current" : "");
        row.innerHTML = `<span class="reg-cmp-badge">${escapeVocabHtml(m.badge)}</span><span class="reg-cmp-es">${escapeVocabHtml(v.es)}</span><span>🔊</span>`;
        row.onclick = () => { activeReg = k; renderReg(); speak(v.es, 0.75); };
        cmpGrid.appendChild(row);
      });
      const acts = regCard.querySelector(".bridge-actions");
      const hearBtn = document.createElement("button");
      hearBtn.type = "button";
      hearBtn.className = "lp-nav-btn";
      hearBtn.textContent = "🔊 Hear selected";
      hearBtn.onclick = () => speak(cur.es, 0.75);
      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "lp-nav-btn primary";
      nextBtn.textContent = "Next situation →";
      nextBtn.onclick = () => { regIdx = (regIdx + 1) % REGISTER_SWITCHER.length; renderReg(); };
      acts.append(hearBtn, nextBtn);
      attachMic(acts, cur.es, "phrases");
    };
    renderReg();
    sec.appendChild(regCard);
  }

  if (typeof STREET_GRID_DECODER !== "undefined" && STREET_GRID_DECODER.length) {
    let gridIdx = 0;
    const gridCard = document.createElement("section");
    gridCard.className = "bridge-trainer-card street-grid-card";
    gridCard.dataset.hablarGroup = "visual";
    const renderGrid = () => {
      const g = STREET_GRID_DECODER[gridIdx % STREET_GRID_DECODER.length];
      gridCard.innerHTML = `<div class="bridge-kicker">🧭 COLOMBIAN STREET GRID & SAFETY DECODER</div>
        <div class="bridge-context">Tap any piece of a Colombian address to decode how it works:</div>
        <div class="street-formula-bar"></div>
        <div class="street-detail-box">
          <div class="street-detail-label">${escapeVocabHtml(g.label)} — ${escapeVocabHtml(g.title)}</div>
          <p class="street-detail-explain">${escapeVocabHtml(g.explain)}</p>
          <button type="button" class="street-example-btn"><strong>🗣️ ${escapeVocabHtml(g.exampleEs)}</strong><small>${escapeVocabHtml(g.exampleEn)}</small><span>🔊</span></button>
        </div>`;
      const fBar = gridCard.querySelector(".street-formula-bar");
      STREET_GRID_DECODER.forEach((seg, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "street-seg-chip" + (idx === gridIdx ? " active" : "");
        b.textContent = seg.part;
        b.onclick = () => { gridIdx = idx; renderGrid(); speak(seg.exampleEs, 0.75); };
        fBar.appendChild(b);
      });
      gridCard.querySelector(".street-example-btn").onclick = () => speak(g.exampleEs, 0.75);
    };
    renderGrid();
    sec.appendChild(gridCard);
  }

  if (typeof TEXTBOOK_VS_COLOMBIAN !== "undefined" && TEXTBOOK_VS_COLOMBIAN.length) {
    let tvcIdx = 0;
    const tvcCard = document.createElement("section");
    tvcCard.className = "bridge-trainer-card tvc-switcher-card";
    tvcCard.dataset.hablarGroup = "ear";
    const renderTvc = () => {
      const item = TEXTBOOK_VS_COLOMBIAN[tvcIdx % TEXTBOOK_VS_COLOMBIAN.length];
      tvcCard.innerHTML = `<div class="bridge-kicker">🆚 TEXTBOOK SPANISH VS. NATURAL COLOMBIAN · ${tvcIdx + 1} OF ${TEXTBOOK_VS_COLOMBIAN.length}</div>
        <div class="bridge-context">${escapeVocabHtml(item.context)}</div>
        <div class="bridge-en">${escapeVocabHtml(item.en)}</div>
        <div class="tvc-compare-pair">
          <button type="button" class="tvc-box tvc-textbook" title="Tap to hear textbook phrasing">
            <span class="tvc-tag">❌ Too Textbook / Stiff</span>
            <strong>${escapeVocabHtml(item.textbook)}</strong>
          </button>
          <button type="button" class="tvc-box tvc-colombian" title="Tap to hear natural Colombian phrasing">
            <span class="tvc-tag">✅ Natural Colombian Upgrade 🔊</span>
            <strong>${escapeVocabHtml(item.colombian)}</strong>
          </button>
        </div>
        <div class="tvc-why">💡 <strong>Why this works in Colombia:</strong> ${escapeVocabHtml(item.why)}</div>
        <div class="bridge-actions"></div>`;
      tvcCard.querySelector(".tvc-textbook").onclick = () => speak(item.textbook, 0.75);
      tvcCard.querySelector(".tvc-colombian").onclick = () => { markPractice("phrases", item.colombian); speak(item.colombian, 0.75); };
      const acts = tvcCard.querySelector(".bridge-actions");
      const hearCol = document.createElement("button");
      hearCol.type = "button";
      hearCol.className = "lp-nav-btn";
      hearCol.textContent = "🔊 Hear Colombian";
      hearCol.onclick = () => { markPractice("phrases", item.colombian); speak(item.colombian, 0.75); };
      const nextTvc = document.createElement("button");
      nextTvc.type = "button";
      nextTvc.className = "lp-nav-btn primary";
      nextTvc.textContent = "Next upgrade →";
      nextTvc.onclick = () => { tvcIdx = (tvcIdx + 1) % TEXTBOOK_VS_COLOMBIAN.length; renderTvc(); };
      acts.append(hearCol, nextTvc);
      if (typeof attachStarBtn === "function") attachStarBtn(acts, item.colombian, "Colombian Upgrade");
      attachMic(acts, item.colombian, "phrases");
    };
    renderTvc();
    sec.appendChild(tvcCard);
  }

  if (typeof REGIONAL_ATLAS !== "undefined" && REGIONAL_ATLAS.length) {
    let regAtlasIdx = 0;
    const sjIdx = REGIONAL_ATLAS.findIndex(r => r.id === "sanjuan-guajira");
    if (sjIdx >= 0) regAtlasIdx = sjIdx;
    const atlasCard = document.createElement("section");
    atlasCard.className = "bridge-trainer-card regional-atlas-card";
    atlasCard.dataset.hablarGroup = "regions";
    const renderAtlas = () => {
      const reg = REGIONAL_ATLAS[regAtlasIdx % REGIONAL_ATLAS.length];
      const regHero = (typeof REGION_IMAGES !== "undefined" && REGION_IMAGES[reg.id]) ? `<div class="region-hero-banner"><img src="${REGION_IMAGES[reg.id]}" alt="${escapeVocabHtml(reg.title)}"/><span class="region-hero-badge">${escapeVocabHtml(reg.tab)}</span></div>` : "";
      atlasCard.innerHTML = `<div class="bridge-kicker">🗺️ COLOMBIAN REGIONAL ACCENT & SLANG ATLAS · ${REGIONAL_ATLAS.length} REGIONS (INCLUDING SAN JUAN DEL CESAR & GUAJIRA)</div>
        <div class="bridge-context">Tap a region to hear how family greetings, pronouns, food, and rhythm change across Colombia:</div>
        <div class="reg-tabs-row atlas-tabs" role="tablist" aria-label="Colombian regions"></div>
        ${regHero}
        <div class="comodin-sub">${escapeVocabHtml(reg.title)} — ${escapeVocabHtml(reg.vibe)}</div>
        <div class="comodin-chunks-grid atlas-items-grid"></div>`;
      const tRow = atlasCard.querySelector(".atlas-tabs");
      REGIONAL_ATLAS.forEach((r, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "reg-tab-btn" + (idx === regAtlasIdx ? " active" : "");
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", idx === regAtlasIdx ? "true" : "false");
        b.textContent = r.tab;
        b.onclick = () => {
          regAtlasIdx = idx;
          renderAtlas();
          if (r.items && r.items[0]) speak(r.items[0].es, 0.75);
        };
        tRow.appendChild(b);
      });
      const grid = atlasCard.querySelector(".atlas-items-grid");
      (reg.items || []).forEach(it => {
        const row = document.createElement("div");
        row.className = "comodin-chunk-card atlas-item-card";
        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");
        row.innerHTML = `<div class="comodin-chunk-head"><span class="comodin-chunk-pill">${escapeVocabHtml(it.category)}</span><span class="comodin-chunk-en">${escapeVocabHtml(it.tip)}</span><div class="comodin-chunk-acts"></div></div>
          <div class="comodin-chunk-es">🗣️ ${escapeVocabHtml(it.es)} 🔊</div>
          <div class="comodin-chunk-esen">${escapeVocabHtml(it.en)}</div>`;
        const playIt = () => { markPractice("phrases", it.es); if (typeof recordSrs === "function") recordSrs("atlas|" + it.es, true); speak(it.es, 0.75); };
        row.onclick = e => { if (e.target.closest("button")) return; playIt(); };
        row.onkeydown = e => { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("button")) { e.preventDefault(); playIt(); } };
        const acts = row.querySelector(".comodin-chunk-acts");
        if (typeof attachStarBtn === "function") attachStarBtn(acts, it.es, reg.tab);
        attachMic(acts, it.es, "phrases");
        grid.appendChild(row);
      });
    };
    renderAtlas();
    const atlasFold = document.createElement("details");
    atlasFold.className = "lesson-stage guides-fold";
    atlasFold.dataset.hablarGroup = "regions";
    atlasFold.innerHTML = `<summary class="stage-label guides-fold-summary"><div class="stage-label-main"><span>🗺️ Regional Accent &amp; Slang Atlas</span><span class="stage-count">${REGIONAL_ATLAS.length} regions</span></div><div class="stage-sub">San Juan del Cesar, Guajira, Paisa, Rolos &amp; more — tap to expand</div></summary>`;
    atlasFold.appendChild(atlasCard);
    sec.appendChild(atlasFold);
  }

  if (typeof REGIONAL_SWITCHER !== "undefined" && REGIONAL_SWITCHER.length) {
    let swIdx = 0;
    const swCard = document.createElement("section");
    swCard.className = "bridge-trainer-card regional-switcher-card";
    swCard.dataset.hablarGroup = "regions";
    swCard.setAttribute("aria-label", "Regional and pronoun switcher across San Juan del Cesar, Bogotá, Medellín, and Cali");
    const renderSwitcher = () => {
      const cur = REGIONAL_SWITCHER[swIdx % REGIONAL_SWITCHER.length];
      swCard.innerHTML = `<div class="bridge-kicker">🧭 COMPARADOR REGIONAL · SAN JUAN DEL CESAR VS. BOGOTÁ, MEDELLÍN & CALI (${swIdx + 1}/${REGIONAL_SWITCHER.length})</div>
        <div class="bridge-context">Compare how the exact same everyday meaning changes pronouns (<em>tú / primo</em> vs. <em>usted / sumercé</em> vs. <em>vos / parce</em>) across Colombia:</div>
        <div class="reg-tabs-row sw-intent-tabs" role="tablist" aria-label="Everyday situations"></div>
        <div class="comodin-sub"><strong>${escapeVocabHtml(cur.intent)}</strong> — ${escapeVocabHtml(cur.context)}</div>
        <div class="comodin-chunks-grid sw-variants-grid"></div>`;
      const tRow = swCard.querySelector(".sw-intent-tabs");
      REGIONAL_SWITCHER.forEach((item, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "reg-tab-btn" + (idx === swIdx ? " active" : "");
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", idx === swIdx ? "true" : "false");
        b.textContent = item.intent;
        b.onclick = () => { swIdx = idx; renderSwitcher(); if (item.variants && item.variants[0]) speak(item.variants[0].es, 0.75); };
        tRow.appendChild(b);
      });
      const vGrid = swCard.querySelector(".sw-variants-grid");
      (cur.variants || []).forEach(v => {
        const row = document.createElement("div");
        row.className = "comodin-chunk-card sw-variant-card";
        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");
        row.innerHTML = `<div class="comodin-chunk-head"><span class="comodin-chunk-pill">${escapeVocabHtml(v.region)} · ${escapeVocabHtml(v.pronoun)}</span><span class="comodin-chunk-en">${escapeVocabHtml(v.note)}</span><div class="comodin-chunk-acts"></div></div>
          <div class="comodin-chunk-es">🗣️ ${escapeVocabHtml(v.es)} 🔊</div>
          <div class="comodin-chunk-esen">${escapeVocabHtml(v.en)}</div>`;
        const playV = () => { markPractice("phrases", v.es); if (typeof recordSrs === "function") recordSrs("regsw|" + v.es, true); speak(v.es, 0.75); };
        row.onclick = e => { if (e.target.closest("button")) return; playV(); };
        row.onkeydown = e => { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("button")) { e.preventDefault(); playV(); } };
        const acts = row.querySelector(".comodin-chunk-acts");
        if (typeof attachStarBtn === "function") attachStarBtn(acts, v.es, v.region);
        attachMic(acts, v.es, "phrases");
        vGrid.appendChild(row);
      });
    };
    renderSwitcher();
    const swFold = document.createElement("details");
    swFold.className = "lesson-stage guides-fold";
    swFold.dataset.hablarGroup = "regions";
    swFold.innerHTML = `<summary class="stage-label guides-fold-summary"><div class="stage-label-main"><span>🧭 Comparador Regional</span><span class="stage-count">${REGIONAL_SWITCHER.length} cards</span></div><div class="stage-sub">Compare Tú / Usted / Vos side-by-side — tap to expand</div></summary>`;
    swFold.appendChild(swCard);
    sec.appendChild(swFold);
  }

  if (typeof VISUAL_GUIDES !== "undefined" && VISUAL_GUIDES.length) {
    const vgCard = document.createElement("section");
    vgCard.className = "bridge-trainer-card visual-guides-card";
    vgCard.dataset.hablarGroup = "visual";
    vgCard.setAttribute("aria-label", "Visual Colombian guides and illustrated phrase posters");
    vgCard.innerHTML = `<div class="bridge-kicker">🖼️ GUÍAS VISUALES DE COLOMBIA · ILLUSTRATED CULTURAL POSTERS</div>
      <div class="bridge-context">Tap any poster to zoom in full-screen, or tap the phrase below each poster to hear &amp; practice it:</div>
      <div class="visual-guides-grid"></div>`;
    let lb = document.getElementById("vg-lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "vg-lightbox";
      lb.className = "vg-lightbox";
      lb.hidden = true;
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-labelledby", "vg-lb-title");
      lb.innerHTML = `<div class="vg-lightbox-panel"><div class="vg-lightbox-head"><div class="vg-lightbox-title" id="vg-lb-title"></div><button type="button" class="vg-lightbox-close" id="vg-lb-close" aria-label="Close visual guide">✕ Close</button></div><img id="vg-lb-img" alt=""/><div class="vg-lightbox-cap" id="vg-lb-cap"></div></div>`;
      document.body.appendChild(lb);
      const closeLb = () => {
        lb.hidden = true;
        const im = lb.querySelector("#vg-lb-img");
        if (im) { im.removeAttribute("src"); im.alt = ""; }
        if (lb._opener && typeof lb._opener.focus === "function") { lb._opener.focus(); lb._opener = null; }
      };
      lb.querySelector("#vg-lb-close").onclick = closeLb;
      lb.onclick = e => { if (e.target === lb) closeLb(); };
      document.addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) closeLb(); });
    }
    const vgGrid = vgCard.querySelector(".visual-guides-grid");
    VISUAL_GUIDES.forEach(vg => {
      const tile = document.createElement("article");
      tile.className = "visual-guide-tile";
      tile.innerHTML = `<button type="button" class="visual-guide-thumb" aria-label="Zoom ${escapeVocabHtml(vg.title)}">
          <img src="${vg.img}" alt="${escapeVocabHtml(vg.alt)}" loading="lazy"/>
          <span class="visual-guide-zoom">🔍 Zoom</span>
        </button>
        <div class="visual-guide-title">${escapeVocabHtml(vg.title)}</div>
        <div class="visual-guide-sub">${escapeVocabHtml(vg.sub)}</div>
        <div class="visual-guide-cap">${escapeVocabHtml(vg.caption)}</div>
        <div class="visual-guide-phrase" role="button" tabindex="0" aria-label="Listen to ${escapeVocabHtml(vg.es)}">
          <div class="comodin-chunk-head"><span class="comodin-chunk-pill">${escapeVocabHtml(vg.region)}</span><div class="comodin-chunk-acts"></div></div>
          <div class="visual-guide-es">🗣️ ${escapeVocabHtml(vg.es)} 🔊</div>
          <div class="visual-guide-en">${escapeVocabHtml(vg.en)}</div>
        </div>`;
      const thumb = tile.querySelector(".visual-guide-thumb");
      thumb.onclick = () => {
        lb._opener = thumb;
        lb.querySelector("#vg-lb-title").textContent = vg.title;
        const im = lb.querySelector("#vg-lb-img");
        im.src = vg.img;
        im.alt = vg.alt;
        lb.querySelector("#vg-lb-cap").textContent = vg.caption;
        lb.hidden = false;
        lb.querySelector("#vg-lb-close").focus();
      };
      const phraseBox = tile.querySelector(".visual-guide-phrase");
      const playVg = () => { markPractice("phrases", vg.es); if (typeof recordSrs === "function") recordSrs("vg|" + vg.es, true); speak(vg.es, 0.75); };
      phraseBox.onclick = e => { if (e.target.closest("button")) return; playVg(); };
      phraseBox.onkeydown = e => { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("button")) { e.preventDefault(); playVg(); } };
      const acts = phraseBox.querySelector(".comodin-chunk-acts");
      if (typeof attachStarBtn === "function") attachStarBtn(acts, vg.es, vg.region);
      attachMic(acts, vg.es, "phrases");
      vgGrid.appendChild(tile);
    });
    sec.appendChild(vgCard);
  }

  if (typeof STREET_EAR_LINKER !== "undefined" && STREET_EAR_LINKER.length) {
    let earIdx = 0, earGuess = null;
    const earCard = document.createElement("section");
    earCard.className = "bridge-trainer-card street-ear-card";
    earCard.dataset.hablarGroup = "ear";
    earCard.setAttribute("aria-label", "Street-speed contractions and ear comprehension trainer");
    const renderEar = () => {
      const len = STREET_EAR_LINKER.length;
      const item = STREET_EAR_LINKER[earIdx % len];
      const earBlind = isBlindEarActive() && earGuess === null;
      const d1 = STREET_EAR_LINKER[(earIdx + 3) % len];
      const d2 = STREET_EAR_LINKER[(earIdx + 7) % len];
      const rawChoices = [
        { id: "correct", label: `${item.carefulEs} — ${item.en}`, correct: true },
        { id: "d1", label: `${d1.carefulEs} — ${d1.en}`, correct: false },
        { id: "d2", label: `${d2.carefulEs} — ${d2.en}`, correct: false },
      ];
      const shift = earIdx % 3;
      const choices = rawChoices.slice(shift).concat(rawChoices.slice(0, shift));
      earCard.innerHTML = `<div class="bridge-kicker">🎧 CÓMO SUENA EN LA CALLE · STREET-SPEED CONTRACTIONS (${earIdx + 1}/${len})</div>
        <div class="bridge-context">${escapeVocabHtml(item.context)} — ${earBlind ? "Blind-Ear active: tap street speech first, then pick the matching meaning:" : "Listen first, then test your ear below:"}</div>
        <div class="tvc-compare-pair">
          <button type="button" class="tvc-box ear-careful" title="Tap to hear careful speed">
            <span class="tvc-tag">🐢 Careful / Written Spanish (0.65x)</span>
            <strong>${escapeVocabHtml(earGuess !== null ? item.carefulEs : "Tap or answer below to reveal careful form")}</strong>
          </button>
          <button type="button" class="tvc-box tvc-colombian ear-street" title="Tap to hear natural street speed">
            <span class="tvc-tag">⚡ How It Sounds on the Street (0.85x) 🔊</span>
            <strong>${escapeVocabHtml(earBlind ? "🎧 Tap here to listen to street speed" : item.streetEs)}</strong>
            <small class="ear-phonetic">${earBlind ? "(Hidden in Blind-Ear until you answer)" : "🎵 Rhythm: " + escapeVocabHtml(item.phoneticHint || "")}</small>
          </button>
        </div>
        <div class="ear-check-box" role="group" aria-label="Street ear comprehension check">
          <div class="rp-options-label">${earBlind ? "🎯 Quick Ear Check: Listen above, then pick the real meaning:" : '🎯 Quick Ear Check: What does <strong>"' + escapeVocabHtml(item.streetEs) + '"</strong> mean?'}</div>
          <div class="ear-check-options"></div>
          <div class="ear-check-feedback" role="region" aria-live="polite"></div>
        </div>
        <div class="tvc-why">💡 <strong>Ear Linker Tip:</strong> ${escapeVocabHtml(item.tip)}</div>
        <div class="bridge-actions"></div>`;
      earCard.querySelector(".ear-careful").onclick = () => { earGuess = earGuess || "correct"; speak(item.carefulEs, 0.65); renderEar(); };
      earCard.querySelector(".ear-street").onclick = () => { markPractice("phrases", item.streetEs); speak(item.streetEs, 0.85); };
      const optWrap = earCard.querySelector(".ear-check-options");
      choices.forEach(ch => {
        const b = document.createElement("button");
        b.type = "button";
        const isPicked = earGuess === ch.id;
        b.className = "ear-check-btn" + (isPicked ? (ch.correct ? " correct" : " wrong") : "") + (earGuess !== null && ch.correct ? " correct-hint" : "");
        b.setAttribute("aria-pressed", isPicked ? "true" : "false");
        b.textContent = ch.label;
        b.onclick = () => {
          earGuess = ch.id;
          markPractice("phrases", item.streetEs);
          if (typeof recordSrs === "function") recordSrs("ear|" + item.streetEs, !!ch.correct);
          if (!ch.correct && typeof recordSpeakingError === "function") recordSpeakingError(item.streetEs, "Street Ear");
          if (ch.correct && typeof clearSpeakingError === "function") clearSpeakingError(item.streetEs);
          speak(item.carefulEs, 0.75);
          renderEar();
        };
        optWrap.appendChild(b);
      });
      if (earGuess !== null) {
        const pickedObj = choices.find(c => c.id === earGuess);
        const fb = earCard.querySelector(".ear-check-feedback");
        fb.innerHTML = pickedObj && pickedObj.correct
          ? `<div class="trampas-feedback-banner ok">✅ <strong>¡Buen oído!</strong> "${escapeVocabHtml(item.streetEs)}" links <strong>${escapeVocabHtml(item.carefulEs)}</strong> (${escapeVocabHtml(item.en)}).</div>`
          : `<div class="trampas-feedback-banner warn">👂 <strong>Close!</strong> "${escapeVocabHtml(item.streetEs)}" is actually <strong>${escapeVocabHtml(item.carefulEs)}</strong> (${escapeVocabHtml(item.en)}).</div>`;
      }
      const acts = earCard.querySelector(".bridge-actions");
      const slowBtn = document.createElement("button");
      slowBtn.type = "button";
      slowBtn.className = "lp-nav-btn";
      slowBtn.textContent = "🐢 Careful (0.65x)";
      slowBtn.onclick = () => speak(item.carefulEs, 0.65);
      const fastBtn = document.createElement("button");
      fastBtn.type = "button";
      fastBtn.className = "lp-nav-btn";
      fastBtn.textContent = "⚡ Street (0.85x)";
      fastBtn.onclick = () => { markPractice("phrases", item.streetEs); speak(item.streetEs, 0.85); };
      const nextEar = document.createElement("button");
      nextEar.type = "button";
      nextEar.className = "lp-nav-btn primary";
      nextEar.textContent = "Next contraction →";
      nextEar.onclick = () => { earIdx = (earIdx + 1) % len; earGuess = null; renderEar(); };
      acts.append(slowBtn, fastBtn, nextEar);
      if (typeof attachStarBtn === "function") attachStarBtn(acts, item.streetEs, "Street Ear");
    };
    renderEar();
    sec.appendChild(earCard);
  }

  if (typeof TRAMPAS_COLOMBIANAS !== "undefined" && TRAMPAS_COLOMBIANAS.length) {
    let trIdx = 0, trPredicted = null;
    const trCard = document.createElement("section");
    trCard.className = "bridge-trainer-card trampas-decoder-card";
    trCard.dataset.hablarGroup = "trampas";
    trCard.setAttribute("aria-label", "Colombian false friends prediction and decoder trainer");
    const renderTrap = () => {
      const t = TRAMPAS_COLOMBIANAS[trIdx % TRAMPAS_COLOMBIANAS.length];
      const opts = trIdx % 2 === 0
        ? [{ id: "real", label: t.realMeaning, isReal: true }, { id: "trap", label: t.wrongGuess, isReal: false }]
        : [{ id: "trap", label: t.wrongGuess, isReal: false }, { id: "real", label: t.realMeaning, isReal: true }];
      const revealed = trPredicted !== null;
      trCard.innerHTML = `<div class="bridge-kicker">🪤 TRAMPAS COLOMBIANAS · FALSE FRIENDS DECODER (${trIdx + 1}/${TRAMPAS_COLOMBIANAS.length})</div>
        <div class="bridge-context">Colombian expression: <strong>"${escapeVocabHtml(t.trap)}"</strong></div>
        <div class="street-grid-example" role="button" tabindex="0" title="Tap or press Enter to hear example" aria-label="Spanish example: ${escapeVocabHtml(t.es)}. Tap to hear audio.">
          <div class="street-grid-es">🗣️ ${escapeVocabHtml(t.es)} 🔊</div>
          <div class="street-grid-en">${revealed ? escapeVocabHtml(t.en) : "<em>Predict the meaning below to unlock the full English translation…</em>"}</div>
        </div>
        <div class="trampas-predict-box" role="group" aria-label="Predict what this phrase means in Colombia">
          <div class="rp-options-label">🤔 Step 1 · Predict: What does <strong>"${escapeVocabHtml(t.trap)}"</strong> mean in Colombia?</div>
          <div class="ear-check-options trampas-predict-opts"></div>
        </div>
        <div class="trampas-reveal-slot" role="region" aria-live="polite"></div>
        <div class="bridge-actions"></div>`;
      const exBox = trCard.querySelector(".street-grid-example");
      const hearEx = () => { markPractice("phrases", t.es); speak(t.es, 0.75); };
      exBox.onclick = hearEx;
      exBox.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hearEx(); } };
      const pWrap = trCard.querySelector(".trampas-predict-opts");
      opts.forEach(o => {
        const b = document.createElement("button");
        b.type = "button";
        const isPicked = trPredicted === o.id;
        b.className = "ear-check-btn" + (isPicked ? (o.isReal ? " correct" : " wrong") : "") + (revealed && o.isReal ? " correct-hint" : "");
        b.setAttribute("aria-pressed", isPicked ? "true" : "false");
        b.textContent = o.label;
        b.onclick = () => {
          trPredicted = o.id;
          markPractice("phrases", t.es);
          if (typeof recordSrs === "function") recordSrs("trampa|" + t.trap, !!o.isReal);
          if (!o.isReal && typeof recordSpeakingError === "function") recordSpeakingError(t.es, "Trampas Colombianas");
          if (o.isReal && typeof clearSpeakingError === "function") clearSpeakingError(t.es);
          speak(t.es, 0.75);
          renderTrap();
        };
        pWrap.appendChild(b);
      });
      const revSlot = trCard.querySelector(".trampas-reveal-slot");
      if (revealed) {
        const chosenOpt = opts.find(o => o.id === trPredicted);
        const banner = chosenOpt && chosenOpt.isReal
          ? `<div class="trampas-feedback-banner ok">✅ <strong>¡Exacto!</strong> You spotted the real Colombian meaning.</div>`
          : (trPredicted === "reveal"
            ? `<div class="trampas-feedback-banner ok">👀 <strong>Meaning revealed:</strong> Compare the common literal interpretation with the real Colombian usage below.</div>`
            : `<div class="trampas-feedback-banner warn">🪤 <strong>Careful — that's the literal trap!</strong> See what it actually means in Colombia below:</div>`);
        revSlot.innerHTML = `${banner}
          <div class="tvc-compare-pair">
            <div class="tvc-box tvc-textbook">
              <span class="tvc-tag">⚠️ Common literal interpretation</span>
              <strong>${escapeVocabHtml(t.wrongGuess)}</strong>
            </div>
            <div class="tvc-box tvc-colombian">
              <span class="tvc-tag">✅ Real Meaning in Colombia</span>
              <strong>${escapeVocabHtml(t.realMeaning)}</strong>
            </div>
          </div>
          <div class="tvc-why">💡 <strong>Cultural Note:</strong> ${escapeVocabHtml(t.tip)}</div>`;
      }
      const acts = trCard.querySelector(".bridge-actions");
      const hearTrap = document.createElement("button");
      hearTrap.type = "button";
      hearTrap.className = "lp-nav-btn";
      hearTrap.textContent = "🔊 Hear Example";
      hearTrap.onclick = hearEx;
      acts.appendChild(hearTrap);
      if (!revealed) {
        const revBtn = document.createElement("button");
        revBtn.type = "button";
        revBtn.className = "lp-nav-btn";
        revBtn.textContent = "👀 Reveal Meaning";
        revBtn.onclick = () => { trPredicted = "reveal"; renderTrap(); };
        acts.appendChild(revBtn);
      }
      const nextTrap = document.createElement("button");
      nextTrap.type = "button";
      nextTrap.className = "lp-nav-btn primary";
      nextTrap.textContent = "Next trap →";
      nextTrap.onclick = () => { trIdx = (trIdx + 1) % TRAMPAS_COLOMBIANAS.length; trPredicted = null; renderTrap(); };
      acts.appendChild(nextTrap);
      if (typeof attachStarBtn === "function") attachStarBtn(acts, t.es, "Trampas Colombianas");
      attachMic(acts, t.es, "phrases");
    };
    renderTrap();
    sec.appendChild(trCard);
  }

  SPEAKING_GUIDE.forEach((g, i) => {
    const fold = document.createElement("details");
    fold.className = "starter-more-tools gram-guide-fold";
    fold.dataset.hablarGroup = "trampas";
    fold.innerHTML = `<summary><span><b>${i + 1}.</b> ${escapeVocabHtml(g.title)}</span><small>${escapeVocabHtml(g.formula)}</small></summary>`;
    const card = document.createElement("article");
    card.className = "speaking-guide-card";
    card.innerHTML = `<div class='speaking-guide-copy'><div class='speaking-guide-formula'>${escapeVocabHtml(g.formula)}</div><p>${escapeVocabHtml(g.explain)}</p><div class='speaking-guide-mistake'>⚠️ ${escapeVocabHtml(g.mistake)}</div></div>`;
    (g.examples || []).forEach(ex => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "speaking-guide-example";
      row.innerHTML = `<strong>${escapeVocabHtml(ex.es)}</strong><small>${escapeVocabHtml(ex.en)}</small><span>🔊</span>`;
      row.onclick = () => speak(ex.tts || ex.es, 0.75);
      card.appendChild(row);
    });
    const drill = document.createElement("div");
    drill.className = "speaking-guide-drill";
    drill.textContent = "🗣️ Try it: " + g.exercise;
    card.appendChild(drill);
    fold.appendChild(card);
    sec.appendChild(fold);
  });
  applyHablarTab(userPrefs.hablarTab || "regions");
}
