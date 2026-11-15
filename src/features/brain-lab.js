import { SPANISH_BRAIN_DRILLS } from "../../data/index.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, applyQuizFitClasses } from "../core/text-utils.js";
import { markPractice, recordSrs, recordSpeakingError, clearSpeakingError } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";
import { isBlindEarActive } from "../state/preferences.js";

const BRAIN_MODES = [
  ["all", "🎲 All Reflexes"],
  ["prodrop", "⚡ Who + When"],
  ["reverse", "🔄 Accidental Se"],
  ["pronouns", "🧩 Se Lo Decoder"],
  ["stress", "🎯 Stress & Flips"],
];

let brKind = "all";
let brIdx = 0;
let brPicked = null;
let brRecallGate = false;
let brTextPeek = false;
let brScore = 0;
let brTotal = 0;

function filteredBrainDrills() {
  if (!Array.isArray(SPANISH_BRAIN_DRILLS)) return [];
  if (brKind === "all") return SPANISH_BRAIN_DRILLS;
  return SPANISH_BRAIN_DRILLS.filter(d => d.kind === brKind);
}

export function renderSpanishBrainLab(host) {
  if (!host || !Array.isArray(SPANISH_BRAIN_DRILLS) || !SPANISH_BRAIN_DRILLS.length) return;
  const pool = filteredBrainDrills();
  if (!pool.length) return;
  const item = pool[brIdx % pool.length];
  const hideSpanishPrompt = isBlindEarActive() && !brTextPeek && !brPicked;

  host.innerHTML = "";
  const wrap = document.createElement("section");
  wrap.className = "bridge-trainer-card brain-lab-card";
  wrap.innerHTML = `
    <div class="brain-head-row">
      <div class="bridge-kicker">🧠 SPANISH BRAIN REFLEXES · ${(brIdx % pool.length) + 1} / ${pool.length}</div>
      <div class="brain-mini-tools">
        <button type="button" class="brain-pill-toggle${brRecallGate ? " active" : ""}" id="brain-recall-toggle" aria-pressed="${brRecallGate ? "true" : "false"}">🗣️ Say/Think First: ${brRecallGate ? "ON" : "OFF"}</button>
        <span class="brain-score-chip tabular-nums">${brScore}/${brTotal}</span>
      </div>
    </div>
    <div class="brain-mode-row" role="tablist" aria-label="Spanish Brain drill focus"></div>
    <div class="quiz-card brain-quiz-card">
      <div class="qc-label">${escapeVocabHtml(item.badge)} · ${escapeVocabHtml(item.question)}</div>
      <div class="qc-word brain-cue-word">${hideSpanishPrompt ? "🎧 Listen first — catch the ending & meaning" : escapeVocabHtml(item.prompt)}</div>
      ${brPicked ? `<div class="brain-en-reveal">🇺🇸 ${escapeVocabHtml(item.en)}</div>` : ""}
      <div class="brain-audio-bar">
        <button type="button" class="qc-hear brain-hear-btn">🔊 Listen (0.8×)</button>
        <button type="button" class="qc-hear brain-fast-btn">⚡ Street (1.05×)</button>
        ${isBlindEarActive() && !brPicked ? `<button type="button" class="quiz-blind-peek-btn brain-peek-btn">${brTextPeek ? "🙈 Hide Text" : "👁️ Peek Spanish"}</button>` : ""}
      </div>
    </div>
    <div class="brain-recall-gate" hidden>
      <div class="brain-recall-copy">Answer out loud or in your head first — don't rely on seeing choices yet.</div>
      <div class="bridge-actions"><button type="button" class="lp-nav-btn primary brain-show-opts">👀 Reveal Choices</button></div>
    </div>
    <div class="quiz-opts brain-opts"></div>
    <div class="brain-feedback-slot"></div>
    <div class="bridge-actions brain-foot"></div>
  `;

  const modeRow = wrap.querySelector(".brain-mode-row");
  BRAIN_MODES.forEach(([id, lbl]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "mf-chip" + (brKind === id ? " active" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", brKind === id ? "true" : "false");
    b.textContent = lbl;
    b.onclick = () => {
      brKind = id;
      brIdx = 0;
      brPicked = null;
      brTextPeek = false;
      renderSpanishBrainLab(host);
    };
    modeRow.appendChild(b);
  });

  wrap.querySelector("#brain-recall-toggle").onclick = () => {
    brRecallGate = !brRecallGate;
    renderSpanishBrainLab(host);
  };
  wrap.querySelector(".brain-hear-btn").onclick = () => speak(item.tts || item.prompt, 0.78);
  wrap.querySelector(".brain-fast-btn").onclick = () => speak(item.tts || item.prompt, 1.05);
  const peekBtn = wrap.querySelector(".brain-peek-btn");
  if (peekBtn) {
    peekBtn.onclick = () => {
      brTextPeek = !brTextPeek;
      renderSpanishBrainLab(host);
    };
  }

  const gate = wrap.querySelector(".brain-recall-gate");
  const optsBox = wrap.querySelector(".brain-opts");
  const fbSlot = wrap.querySelector(".brain-feedback-slot");
  const foot = wrap.querySelector(".brain-foot");

  const sortedOpts = (item.choices || [])
    .slice()
    .map((text, idx) => ({ text, sort: (idx * 3 + brIdx) % 7 }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.text);

  applyQuizFitClasses(wrap.querySelector(".brain-cue-word"), optsBox, item.prompt, sortedOpts);

  const shouldGateOpts = brRecallGate && !brPicked;
  gate.hidden = !shouldGateOpts;
  optsBox.hidden = shouldGateOpts;
  if (shouldGateOpts) {
    attachMic(gate.querySelector(".bridge-actions"), item.sayTarget || item.tts || item.prompt, "phrases");
    gate.querySelector(".brain-show-opts").onclick = () => {
      gate.hidden = true;
      optsBox.hidden = false;
    };
  }

  sortedOpts.forEach(opt => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "qopt";
    b.textContent = opt;
    if (brPicked !== null) {
      if (opt === item.answer) b.classList.add("correct");
      else if (opt === brPicked) b.classList.add("wrong");
    }
    b.onclick = () => {
      if (brPicked !== null) return;
      brPicked = opt;
      brTotal++;
      const ok = opt === item.answer;
      if (ok) {
        brScore++;
        markPractice("phrases", item.tts || item.prompt);
        clearSpeakingError(item.tts || item.prompt);
      } else {
        recordSpeakingError(item.tts || item.prompt, "Spanish Brain");
      }
      recordSrs("brain|" + item.id, ok);
      speak(item.tts || item.prompt, 0.8);
      renderSpanishBrainLab(host);
    };
    optsBox.appendChild(b);
  });

  if (brPicked !== null) {
    const ok = brPicked === item.answer;
    fbSlot.innerHTML = `
      <div class="trampas-feedback-banner ${ok ? "ok" : "warn"}">
        ${ok ? "✅ <strong>¡Exacto!</strong>" : `❌ <strong>Key takeaway:</strong> ${escapeVocabHtml(item.answer)}`}
      </div>
      <div class="tvc-why">💡 ${escapeVocabHtml(item.tip)}</div>
    `;
  }

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "lp-nav-btn";
  prevBtn.textContent = "‹ Prev";
  prevBtn.onclick = () => {
    brIdx = (brIdx - 1 + pool.length) % pool.length;
    brPicked = null;
    brTextPeek = false;
    renderSpanishBrainLab(host);
    speak(filteredBrainDrills()[brIdx].tts || filteredBrainDrills()[brIdx].prompt, 0.78);
  };

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "lp-nav-btn primary";
  nextBtn.textContent = "Next Reflex →";
  nextBtn.onclick = () => {
    brIdx = (brIdx + 1) % pool.length;
    brPicked = null;
    brTextPeek = false;
    renderSpanishBrainLab(host);
    speak(filteredBrainDrills()[brIdx].tts || filteredBrainDrills()[brIdx].prompt, 0.78);
  };

  foot.append(prevBtn, nextBtn);
  if (brPicked !== null || !shouldGateOpts) {
    attachMic(foot, item.sayTarget || item.tts || item.prompt, "phrases");
  }

  host.appendChild(wrap);
}
