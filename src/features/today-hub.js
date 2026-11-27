import { LESSONS } from "./lessons-meta.js";
import {
  CONVERSATION_MISSIONS, SPEAKING_GUIDE, GRAMMAR,
  VC, VERBS, FRASES, VISUAL_GUIDES, COLOMBIANISMOS, GRINGO_TRAPS, COLOMBIAN_STORIES,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { userPrefs, saveUserPrefs, effectiveLevel, isBlindEarActive } from "../state/preferences.js";
import { escapeVocabHtml, lpEl, normalizeQuizPrompt, normalizeQuizText, normalizeQuizAnswer } from "../core/text-utils.js";
import {
  practiceStore, lessonProgress, stageMastery, srsStore, SRS_INTERVALS, speakingErrors,
  missionProgress, saveMissions, readingProgress,
} from "../core/stores.js";
import { PHRASE_DIALOGUES, aQ, quizAcceptedAnswers, quizAnswerMatches, storedMissedQuestionCount } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";
import { getRrStats } from "./rapida.js";
import { renderMission, VOICE_NOTE_SCENES, renderVoiceNoteLab } from "./speaking-labs.js";

export const LESSON_STAGES = [
  { name: "🌱 Stage 1 · Start Here", sub: "Greetings, Colombian politeness, false-friend traps (cancelar/provocar), numbers, and repairing misunderstandings.", ids: ["presentate", "cortesia-colombiana", "trampas-colombianas", "plata", "survival-communication", "casa", "gustos"] },
  { name: "🧭 Stage 2 · Travel and Survival", sub: "Airport, Uber, street safety (no dar papaya & 123), corrientazo lunches, panaderías & jugos, hotels, Nequi, restaurants, markets, dental/optical, and medical care.", ids: ["aeropuerto-migracion", "uber-ride", "uber-completo", "hotel-checkin", "calle", "direcciones", "direcciones-cuadras", "seguridad-emergencias", "bancos-pagos", "panaderia-jugos", "almuerzo-corrientazo", "cocina", "restaurante-real", "mercado-negociar", "commands-repair", "farmacia", "medico-urgencias", "odontologia-optica"] },
  { name: "🏠 Stage 3 · Daily Life", sub: "Migración & Cédula de Extranjería, ATMs & SIM cards, estratos & conjuntos, home repairs & utilities, Airbnb, WhatsApp, portería, office, barbershop, and finca trips.", ids: ["trabajo", "oficina-real", "cajero-sim-tramites", "migracion-bancos-ce", "porteria-domicilios", "arriendo-airbnb", "estratos-barrios", "hogar-reparaciones", "whatsapp-audios", "barberia", "viajes-finca", "daily-repair", "planes", "gerundios-actividades", "sentirse"] },
  { name: "🧱 Stage 4 · Build Sentences", sub: "Present, future, past, contrast, perfect tenses, conditional, action chunks, connectors, and pronouns.", ids: ["sentence-structure", "action-chunks", "connectors-v36", "function-words", "gram-presente", "gram-futuro", "gram-pasado", "gram-pasado-historia", "gram-pasado-contraste", "gram-perfecto", "gram-condicional", "gram-pasado-perfecto", "gram-futuro-perfecto", "gram-subjuntivo", "gram-necesidades", "gram-conectores", "gram-pronombres"] },
  { name: "🇨🇴 Stage 5 · Speak More Naturally", sub: "San Juan del Cesar & La Guajira (vallenato & family), Colombian wildcard verbs, dating & family, fútbol & conciertos, puentes & salsa, empathy, and diminutives.", ids: ["san-juan-guajira", "colombia", "verbos-comodin", "citas-familia", "eventos-futbol-cultura", "puentes-rumba-cultura", "empatia-reacciones", "muletillas-diminutivos", "social-colombia-v36", "gym-ciclovia", "social-salida", "fiesta-gathering", "deportes-partido", "gram-groserias"] },
  { name: "🎯 Stage 6 · Conversation Challenge", sub: "Read aloud, react quickly, and complete real speaking missions.", ids: ["conversation-challenge"] },
];

export const FOCUS_LESSON_SETS = {
  all: null,
  sanjuan: ["san-juan-guajira", "cortesia-colombiana", "trampas-colombianas", "plata", "casa", "panaderia-jugos", "almuerzo-corrientazo", "verbos-comodin", "citas-familia", "puentes-rumba-cultura", "empatia-reacciones", "muletillas-diminutivos"],
  travel: ["presentate", "cortesia-colombiana", "trampas-colombianas", "aeropuerto-migracion", "uber-ride", "uber-completo", "hotel-checkin", "direcciones", "direcciones-cuadras", "seguridad-emergencias", "bancos-pagos", "panaderia-jugos", "almuerzo-corrientazo", "restaurante-real", "mercado-negociar", "farmacia"],
  daily: ["presentate", "cortesia-colombiana", "casa", "trabajo", "oficina-real", "cajero-sim-tramites", "migracion-bancos-ce", "porteria-domicilios", "arriendo-airbnb", "estratos-barrios", "hogar-reparaciones", "whatsapp-audios", "barberia", "viajes-finca"],
};

const ROUTINE_KEY = "esco-routine-v3";
export const ROUTINE_STEPS = [
  { id: "warmup", icon: "🎙️", title: "Warm up your mouth", sub: "Pure vowels, RR, and Ñ · about 2 minutes." },
  { id: "twisters", icon: "🗣️", title: "Train difficult sounds", sub: "Tongue twisters for RR and Ñ · about 3 minutes." },
  { id: "review", icon: "🔁", title: "Recall useful Spanish", sub: "Review due cards and answer before looking." },
  { id: "phrases", icon: "💬", title: "Speak useful phrases", sub: "Practice a real conversation and both sides." },
  { id: "mission", icon: "🗣️", title: "Conversation mission", sub: "Answer in your own words out loud." },
];
export let routineState = { date: "", step: 0 };
try { const rs = JSON.parse(appStorage.getItem(ROUTINE_KEY) || "{}"); if (rs && typeof rs === "object" && !Array.isArray(rs)) Object.assign(routineState, rs); } catch (e) {}
export function routineToday() { const today = new Date().toISOString().slice(0, 10); if (routineState.date !== today) { routineState = { date: today, step: 0 }; saveRoutine(); } return routineState; }
function saveRoutine() { try { appStorage.setItem(ROUTINE_KEY, JSON.stringify(routineState)); } catch (e) {} }

function clearRoutineGuide() { appState.routineTwisterSelection = null; actions.renderTongueTwisters(); removeRoutineQuizGuide(); }
function setRoutineFocus(kind) { const page = document.getElementById("page-fonetica"); if (page) { page.classList.add("routine-focus"); page.classList.toggle("routine-focus-warmup", kind === "warmup"); page.classList.toggle("routine-focus-twisters", kind === "twisters"); } }
function clearRoutineFocus() { const page = document.getElementById("page-fonetica"); if (page) page.classList.remove("routine-focus", "routine-focus-warmup", "routine-focus-twisters"); }
function removeRoutineQuizGuide() { const guide = document.querySelector(".routine-quiz-guide"); if (guide) guide.remove(); }

export function routineBack() {
  routineDockHide();
  clearRoutineGuide();
  clearRoutineFocus();
  try { appStorage.setItem("esco-lesson-view-v1", "today"); } catch (e) {}
  showPage("lecciones");
}

function routineAdvance(expected) {
  routineToday();
  if (routineState.step !== expected) { routineBack(); return; }
  routineState.step = Math.min(ROUTINE_STEPS.length, routineState.step + 1);
  saveRoutine();
  const next = ROUTINE_STEPS[routineState.step];
  if (next) routineOpen(next.id);
  else { routineDockHide(); clearRoutineGuide(); clearRoutineFocus(); showPage("lecciones"); }
}

export function routineFinishWarmup() { routineAdvance(0); }
export function routineFinishTwisters() { routineAdvance(1); }
export function routineFinishReview() { routineAdvance(2); }
export function routineFinishPhrases() { routineAdvance(3); }
export function routineFinishMission() {
  const mission = CONVERSATION_MISSIONS.find(x => !missionProgress[x.id]) || CONVERSATION_MISSIONS[0];
  if (mission) { missionProgress[mission.id] = true; saveMissions(); }
  routineAdvance(4);
}
export function routineComplete() { routineToday(); routineState.step = Math.min(ROUTINE_STEPS.length, routineState.step + 1); saveRoutine(); showPage("lecciones"); }

function routineDockEnsure() {
  let dock = document.getElementById("routine-dock");
  if (dock) return dock;
  dock = document.createElement("section");
  dock.id = "routine-dock";
  dock.className = "routine-dock";
  dock.setAttribute("aria-label", "Daily speaking path controls");
  dock.innerHTML = "<div class='routine-dock-meta'><span>🎓 DAILY SPEAKING PATH</span><span class='routine-dock-count'></span></div><button type='button' class='routine-dock-btn'></button><button type='button' class='routine-dock-back'>‹ Back to daily path</button>";
  dock.querySelector(".routine-dock-back").onclick = routineBack;
  dock.querySelector(".routine-dock-btn").onclick = routineDockAdvance;
  document.body.appendChild(dock);
  return dock;
}
function routineDockShow() {
  const dock = routineDockEnsure();
  routineToday();
  if (routineState.step >= ROUTINE_STEPS.length) { routineDockHide(); return; }
  const step = routineState.step, next = ROUTINE_STEPS[step + 1];
  dock.querySelector(".routine-dock-count").textContent = `Step ${step + 1} of ${ROUTINE_STEPS.length}`;
  dock.querySelector(".routine-dock-btn").textContent = next ? `Continue to ${next.title} →` : "Finish today’s speaking path ✓";
  document.body.classList.add("routine-session-active");
  dock.classList.add("active");
}
export function routineDockHide() { const dock = document.getElementById("routine-dock"); if (dock) dock.classList.remove("active"); document.body.classList.remove("routine-session-active"); }
function routineDockAdvance() {
  routineToday();
  if (routineState.step === 0) return routineFinishWarmup();
  if (routineState.step === 1) return routineFinishTwisters();
  if (routineState.step === 2) return routineFinishReview();
  if (routineState.step === 3) return routineFinishPhrases();
  if (routineState.step === 4) return routineFinishMission();
}
function renderRoutineQuizGuide() {
  removeRoutineQuizGuide();
  if (routineToday().step !== 2) return;
  const page = document.getElementById("page-quiz"), anchor = page && page.querySelector(".quiz-score-bar");
  if (!page || !anchor) return;
  const guide = document.createElement("section");
  guide.className = "routine-quiz-guide";
  guide.innerHTML = "<div class='routine-guide-kicker'>🎯 STEP 3 · RECALL</div><strong>Practice a few useful answers</strong><span>Answer out loud before tapping. Use the Spanish reveal to repeat the complete sentence.</span><button type='button' class='routine-next-large'>I practiced — continue to phrases →</button><button type='button' class='routine-back-link'>‹ Back to daily path</button>";
  const rNxt = guide.querySelector(".routine-next-large"); if (rNxt) rNxt.onclick = () => routineFinishReview();
  const rBak = guide.querySelector(".routine-back-link"); if (rBak) rBak.onclick = () => routineBack();
  page.insertBefore(guide, anchor);
}

export function routineOpen(id) {
  removeRoutineQuizGuide();
  routineDockShow();
  if (id === "warmup") {
    clearRoutineFocus(); showPage("fonetica"); actions.showPhonetic("syllables"); setRoutineFocus("warmup");
    setTimeout(() => { const reminders = document.getElementById("phonetic-english-reminders"); if (reminders) reminders.open = true; const start = document.getElementById("phonetic-start"); if (start) start.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  } else if (id === "twisters") {
    clearRoutineFocus(); showPage("fonetica"); actions.showPhonetic("syllables"); setRoutineFocus("twisters");
    setTimeout(() => {
      const fold = document.getElementById("phonetic-twisters"); if (fold) fold.open = true;
      const root = document.getElementById("tongue-twister-lab");
      appState.routineTwisterSelection = actions.getDailyTwisterSelection();
      const labels = appState.routineTwisterSelection.map(x => escapeVocabHtml(x.title)).join(" + ");
      const list = root && root.querySelector(".twister-list");
      if (list) { appState.routineTwisterSelection.slice().reverse().forEach(item => { const card = list.querySelector(`[data-twister-id="${item.id}"]`); if (card) { card.classList.add("routine-daily-pick"); list.prepend(card); } }); }
      if (root && !root.querySelector(".routine-twister-guide")) {
        root.insertAdjacentHTML("afterbegin", `<div class="routine-twister-guide"><div class="routine-guide-kicker">🎯 STEP 2 · TODAY'S FOCUS</div><strong>Train RR and Ñ before speed</strong><span>Today's picks: <b>${labels}</b>. They rotate automatically each day. Practice each one 2–3 times: listen slowly, repeat, say it naturally, then record yourself.</span><div class="routine-twister-sequence"><b>1</b> Listen slowly · <b>2</b> Repeat twice · <b>3</b> Natural speed · <b>4</b> Record and compare</div><div class="routine-guide-actions"><button type="button" class="warmup-back">‹ Back to daily path</button><button type="button" class="warmup-continue">Done — continue →</button></div></div>`);
        const tg = root.querySelector(".routine-twister-guide");
        if (tg) {
          const tb = tg.querySelector(".warmup-back"); if (tb) tb.onclick = () => routineBack();
          const tc = tg.querySelector(".warmup-continue"); if (tc) tc.onclick = () => routineFinishTwisters();
        }
      }
      const start = document.getElementById("phonetic-twisters"); if (start) start.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  } else if (id === "review") {
    showPage("quiz"); appState.qMissedOnly = false; appState.qMode = "mixed"; appState.qCat = "all"; appState.qFocus = "all"; appState.repasoLeft = 10; actions.resetQuizRound(); actions.syncQuizControls(); actions.nQ(); renderRoutineQuizGuide();
  } else if (id === "phrases") {
    showPage("frases");
    const d = PHRASE_DIALOGUES.find(x => /Uber: hablo poquito español/i.test(x.title)) || PHRASE_DIALOGUES.find(x => /Carro y taxi/i.test(x.title)) || PHRASE_DIALOGUES[0];
    if (d) actions.renderFraseDialogue(d, "Ahora");
  } else if (id === "mission") {
    const m = CONVERSATION_MISSIONS.find(x => !missionProgress[x.id]) || CONVERSATION_MISSIONS[0];
    if (m) { showPage("lecciones"); renderMission(m); }
  }
}

export function renderRoutineCard(root) {
  routineToday();
  const wrap = document.createElement("section");
  wrap.className = "daily-routine-card";
  wrap.dataset.lessonView = "today";
  const complete = routineState.step >= ROUTINE_STEPS.length;
  const current = ROUTINE_STEPS[Math.min(routineState.step, ROUTINE_STEPS.length - 1)];
  wrap.innerHTML = `<div class='routine-top'><div><div class='routine-kicker'>🎯 10-MINUTE DAILY SPEAKING ROUTINE</div><div class='routine-title'>${complete ? "Routine complete for today" : "Step " + (routineState.step + 1) + " of " + ROUTINE_STEPS.length + ": " + current.title}</div></div><div class='routine-count'>${complete ? `${ROUTINE_STEPS.length}/${ROUTINE_STEPS.length}` : `${routineState.step}/${ROUTINE_STEPS.length}`}</div></div><div class='routine-track'><span style='width:${Math.round(routineState.step / ROUTINE_STEPS.length * 100)}%'></span></div>`;
  if (!complete) {
    const step = lpEl("routine-current"); step.innerHTML = `<span class='routine-current-icon'>${current.icon}</span><span><strong>${current.title}</strong><small>${current.sub}</small></span>`;
    const rActs = lpEl("routine-actions");
    const open = document.createElement("button"); open.type = "button"; open.className = "lp-nav-btn primary"; open.textContent = "▶ Start routine step"; open.onclick = () => routineOpen(current.id);
    const done = document.createElement("button"); done.type = "button"; done.className = "lp-nav-btn"; done.textContent = "Skip / Mark done"; done.onclick = routineComplete;
    rActs.append(open, done); wrap.append(step, rActs);
  } else {
    const replay = document.createElement("button"); replay.type = "button"; replay.className = "lp-nav-btn"; replay.textContent = "↻ Replay daily routine"; replay.onclick = () => { routineState.step = 0; saveRoutine(); routineOpen(ROUTINE_STEPS[0].id); }; wrap.appendChild(replay);
  }
  root.appendChild(wrap);
}

export function renderProgressDashboard(root, done) {
  const vocabCount = Object.keys((practiceStore && practiceStore.vocab) || {}).length;
  const phraseCount = Object.keys((practiceStore && practiceStore.phrases) || {}).length;
  const mastered = Object.values(srsStore || {}).filter(c => (c.interval || 0) >= SRS_INTERVALS.length).length;
  const rapid = getRrStats().attempts || 0;
  const stageRowsHtml = LESSON_STAGES.map(st => {
    const total = st.ids.length;
    const sDone = st.ids.filter(id => lessonProgress[id]).length;
    const pct = Math.round((sDone / Math.max(total, 1)) * 100);
    const crowned = !!stageMastery[st.name];
    return `<div class="stage-readiness-row"><span class="sr-name">${crowned ? "👑 " : ""}${escapeVocabHtml(st.name.replace(/^.*?Stage /, "Stage "))}</span><div class="sr-bar"><span style="width:${pct}%"></span></div><span class="sr-pct">${sDone}/${total}</span></div>`;
  }).join("");
  const card = document.createElement("section");
  card.className = "progress-dashboard compact-stats-card";
  card.dataset.lessonView = "today";
  card.innerHTML = `<div class="progress-metrics"><div><strong>${done}/${LESSONS.length}</strong><small>lessons</small></div><div><strong>${vocabCount}</strong><small>words</small></div><div><strong>${phraseCount}</strong><small>phrases</small></div><div><strong>${mastered}</strong><small>mastered</small></div></div><div class="stage-readiness-list">${stageRowsHtml}</div><details class="lesson-overview"><summary><span>ⓘ How the speaking path works</span><small>8-step core · ${rapid} rapid drills</small></summary><div class="lesson-flow">Recommended path: Start Here → Travel → Daily Life → Build Sentences → Speak Naturally<br>⚡ Speaking Core (8 steps): 🎯 Goal → 🧱 Frame → 🔑 Words → 🪜 Sentence Ladder → 💬 Dialogue → 🎭 Role-play → 🗣️ Speak Out Loud</div></details>`;
  root.appendChild(card);
}

const TRIP_CLUSTERS = [
  { id: "airport", title: "✈️ Aeropuerto, SIM & Cajero", lessons: ["aeropuerto-migracion", "cajero-sim-tramites"], vn: ["vn-dorado-sim"] },
  { id: "uber", title: "🚕 Uber, Rutas & Seguridad", lessons: ["uber-ride", "uber-completo", "direcciones", "seguridad-emergencias"], vn: ["vn-taxi-seguridad"] },
  { id: "food", title: "🥐 Panadería, Tiendita & Pagos", lessons: ["cortesia-colombiana", "plata", "panaderia-jugos", "almuerzo-corrientazo", "restaurante-real", "bancos-pagos"], vn: ["vn-medellin-cafe"] },
  { id: "health", title: "💊 Droguería & Emergencias", lessons: ["farmacia", "medico-urgencias"], vn: ["vn-drogueria"] },
  { id: "family", title: "🪗 Familia en San Juan / Guajira", lessons: ["san-juan-guajira", "citas-familia"], vn: ["vn-sanjuan-almuerzo", "vn-sanjuan-cena"] },
];

export function mountTripReadinessTracker(root, { onOpenLesson } = {}) {
  const fold = document.createElement("details");
  fold.className = "trip-readiness-fold";
  fold.dataset.lessonView = "today";
  let doneTotal = 0, itemTotal = 0;
  const rowsData = TRIP_CLUSTERS.map(cl => {
    const lsDone = cl.lessons.filter(id => lessonProgress[id]).length;
    const vnDone = cl.vn.filter(id => readingProgress[id]).length;
    const done = lsDone + vnDone;
    const total = cl.lessons.length + cl.vn.length;
    doneTotal += done;
    itemTotal += total;
    const nextLessonId = cl.lessons.find(id => !lessonProgress[id]) || cl.lessons[0];
    const nextVnId = cl.vn.find(id => !readingProgress[id]);
    return { cl, done, total, pct: Math.round((done / Math.max(total, 1)) * 100), nextLessonId, nextVnId };
  });
  const totalPct = Math.round((doneTotal / Math.max(itemTotal, 1)) * 100);
  fold.innerHTML = `<summary><span>🧳 Checklist de Viaje · Colombia Readiness</span><span class="trip-readiness-pill">${doneTotal}/${itemTotal} (${totalPct}%)</span></summary><div class="trip-readiness-list"></div>`;
  const list = fold.querySelector(".trip-readiness-list");
  rowsData.forEach(({ cl, done, total, pct, nextLessonId, nextVnId }) => {
    const row = document.createElement("div");
    row.className = "trip-cluster-row";
    row.innerHTML = `<div class="trip-cluster-info"><strong>${escapeVocabHtml(cl.title)}</strong><small>${done}/${total} lessons &amp; audio stories completed</small><div class="trip-cluster-bar"><span style="width:${pct}%"></span></div></div><button type="button" class="trip-cluster-go">${done >= total ? "✓ Review" : "Practice →"}</button>`;
    row.querySelector(".trip-cluster-go").onclick = () => {
      if (nextVnId && (cl.lessons.every(id => lessonProgress[id]) || done > 0)) {
        const vn = (VOICE_NOTE_SCENES || []).find(v => v.id === nextVnId);
        if (vn) { renderVoiceNoteLab(vn); return; }
      }
      const target = LESSONS.find(l => l.id === nextLessonId);
      if (target && typeof onOpenLesson === "function") onOpenLesson(target);
    };
    list.appendChild(row);
  });
  root.appendChild(fold);
}

export function buildQuizAuditReport(pool) {
  const groups = new Map(), choiceIssues = [], missingFields = [], weakContext = [];
  pool.forEach((q, i) => {
    const number = i + 1, promptText = q.quizPrompt || q.prompt || q.es || "", promptKey = normalizeQuizPrompt(promptText), groupKey = promptKey + "|" + (q.kind || "vocab"), answers = quizAcceptedAnswers(q);
    if (!q.es || !q.tts || !answers.length) missingFields.push({ number, detail: "missing Spanish, audio text, or intended answer" });
    if (promptKey) { const group = groups.get(groupKey) || { prompt: promptText, items: [] }; group.items.push({ number, answers }); groups.set(groupKey, group); }
    if (Array.isArray(q.choices)) {
      const normalized = q.choices.map(normalizeQuizText), unique = new Set(normalized);
      if (q.choices.length !== 4) choiceIssues.push({ number, detail: "needs exactly four choices" });
      else if (unique.size !== normalized.length) choiceIssues.push({ number, detail: "contains duplicate choices" });
      else if (!q.choices.some(choice => quizAnswerMatches(q, choice))) choiceIssues.push({ number, detail: "intended answer is not among the choices" });
    }
    if ((q.kind === "reply" || q.kind === "tense") && !q.quizPrompt) weakContext.push({ number, prompt: promptText, detail: "add a situation or response instruction" });
    if (q.kind === "blank" && !String(q.es || "").includes("___")) choiceIssues.push({ number, detail: "blank question has no blank marker" });
  });
  const conflicting = [], duplicates = [];
  groups.forEach(group => {
    if (group.items.length < 2) return;
    const distinct = [...new Set(group.items.flatMap(item => item.answers).map(normalizeQuizAnswer).filter(Boolean))];
    const itemSummary = group.items.map(item => `#${item.number}: ${item.answers.join(" / ")}`).join(" · ");
    (distinct.length > 1 ? conflicting : duplicates).push({ prompt: group.prompt, summary: itemSummary });
  });
  return { pool, choiceIssues, missingFields, weakContext, conflicting, duplicates };
}

export function renderQuizAuditCard(root) {
  const card = document.createElement("section");
  card.className = "quiz-audit-card";
  card.dataset.lessonView = "practice";
  card.innerHTML = "<div class='quiz-audit-kicker'>🧪 QUIZ QUALITY CHECK</div><div class='quiz-audit-title'>Keep questions fair and unambiguous</div><p>Run this after adding quiz content. It checks structure and flags prompts that need a human meaning check. It never deletes questions.</p><button type='button' class='quiz-audit-btn'>Run quiz audit</button><div class='quiz-audit-result' aria-live='polite'></div>";
  card.querySelector(".quiz-audit-btn").onclick = () => {
    const result = card.querySelector(".quiz-audit-result");
    const pool = typeof aQ !== "undefined" ? aQ : [];
    const report = buildQuizAuditReport(pool);
    const seen = new Map(), duplicates = [], choiceIssues = report.choiceIssues.map(x => x.number);
    pool.forEach((q, i) => {
      const prompt = normalizeQuizPrompt(q.quizPrompt || q.es || q.prompt || "");
      const signature = normalizeQuizAnswer(q.en || q.answer || "") + "|" + (Array.isArray(q.choices) ? q.choices.map(normalizeQuizAnswer).sort().join("/") : "");
      if (prompt) { if (seen.has(prompt)) { const prior = seen.get(prompt); if (prior.signature !== signature) duplicates.push({ first: prior.index, second: i + 1, prompt: q.quizPrompt || q.es || q.prompt || "", firstAnswer: prior.answer || "", secondAnswer: q.en || q.answer || "" }); } else seen.set(prompt, { index: i + 1, signature, answer: q.en || q.answer || "" }); }
    });
    report.conflicting.forEach(x => duplicates.push({ first: "conflict", second: "", prompt: x.prompt, firstAnswer: x.summary, secondAnswer: "Possible multiple valid answers" }));
    const total = duplicates.length + choiceIssues.length + report.missingFields.length + report.weakContext.length;
    const structure = choiceIssues.length ? `⚠️ ${choiceIssues.length} choice-structure issue${choiceIssues.length === 1 ? "" : "s"}` : `✅ No malformed choice sets in ${pool.length} questions`;
    const repeatNote = duplicates.length ? `${duplicates.length} repeated or possible-conflict prompt${duplicates.length === 1 ? "" : "s"} listed for human review.` : "No repeated or conflicting prompts found.";
    result.innerHTML = `<strong>${structure}</strong><small>${repeatNote}</small><small>${report.weakContext.length} weak-context candidate${report.weakContext.length === 1 ? "" : "s"} · ${report.missingFields.length} missing-data item${report.missingFields.length === 1 ? "" : "s"}</small><em>A computer can find duplicates and malformed choices, but only a person can decide whether two natural replies both fit. Review candidates before publishing.</em>`;
    if (total) {
      const detail = document.createElement("details"); detail.className = "quiz-audit-details";
      const summary = document.createElement("summary"); summary.textContent = "Show candidate list"; detail.appendChild(summary);
      const list = document.createElement("div"); list.className = "quiz-audit-list";
      duplicates.slice(0, 60).forEach(x => { const row = document.createElement("div"); row.innerHTML = `<strong>#${x.first} / #${x.second}</strong><span>${escapeVocabHtml(x.prompt)}</span><small>Answers: ${escapeVocabHtml(x.firstAnswer)} · ${escapeVocabHtml(x.secondAnswer)}</small>`; list.appendChild(row); });
      if (choiceIssues.length) { const row = document.createElement("div"); row.innerHTML = `<strong>Choice structure</strong><span>Question numbers: ${choiceIssues.join(", ")}</span><small>Check that each has four unique choices and exactly one intended answer.</small>`; list.appendChild(row); }
      report.weakContext.slice(0, 60).forEach(x => { const row = document.createElement("div"); row.innerHTML = `<strong>#${x.number}</strong><span>${escapeVocabHtml(x.prompt)}</span><small>Needs clearer context: ${escapeVocabHtml(x.detail)}</small>`; list.appendChild(row); });
      report.missingFields.slice(0, 60).forEach(x => { const row = document.createElement("div"); row.innerHTML = `<strong>#${x.number}</strong><span>Missing required quiz data</span><small>${escapeVocabHtml(x.detail)}</small>`; list.appendChild(row); });
      detail.appendChild(list); result.appendChild(detail);
    }
  };
  root.appendChild(card);
}

export function syncMissedQueueLauncher() {
  const missedChip = document.querySelector(".qv102-missed-btn");
  const count = storedMissedQuestionCount();
  if (missedChip) {
    missedChip.textContent = `🎯 Missed (${count})`;
    missedChip.classList.toggle("active", !!appState.qMissedOnly);
    missedChip.setAttribute("aria-pressed", appState.qMissedOnly ? "true" : "false");
  }
  const host = document.getElementById("quiz-review-launch");
  if (!host) return;
  host.hidden = appState.qMissedOnly || count === 0;
  if (host.hidden) { host.innerHTML = ""; return; }
  host.innerHTML = `<span>🧠 <strong>${count} missed question${count === 1 ? "" : "s"}</strong> waiting for review</span><button type="button" class="quiz-review-launch-btn">Review missed →</button>`;
  const btn = host.querySelector("button");
  if (btn) btn.onclick = () => actions.openMissedQueue();
}

export function renderModeFocusBar(root, onRefresh) {
  const bar = document.createElement("section");
  bar.className = "mode-focus-bar";
  bar.dataset.lessonView = "today";
  bar.setAttribute("aria-label", "Learning level and life focus");
  const curLvl = effectiveLevel();
  const lvlOpts = [["starter", "🌱 Starter A0"], ["explorer", "🚀 Explorer A1–A2"], ["fluent", "🔥 Fluent Flow B1+"]];
  const focOpts = [["all", "🌎 All"], ["sanjuan", "🪗 San Juan"], ["travel", "✈️ Travel & Food"], ["daily", "🏠 Daily CO"]];
  const lvlRow = document.createElement("div"); lvlRow.className = "mf-row";
  lvlOpts.forEach(([id, lbl]) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "mf-pill" + (curLvl === id ? " active" : "");
    b.textContent = lbl; b.setAttribute("aria-pressed", curLvl === id ? "true" : "false");
    b.onclick = () => {
      userPrefs.level = id;
      if (id === "fluent") userPrefs.blindEar = true;
      else if (id === "starter" && userPrefs.blindEar) userPrefs.blindEar = false;
      saveUserPrefs();
      if (typeof actions.buildSpeakingGuide === "function") actions.buildSpeakingGuide();
      if (typeof actions.buildGram === "function" && typeof GRAMMAR !== "undefined") actions.buildGram("presente", GRAMMAR.presente);
      if (typeof onRefresh === "function") onRefresh();
    };
    lvlRow.appendChild(b);
  });
  const focRow = document.createElement("div"); focRow.className = "mf-row mf-row-sub";
  focOpts.forEach(([id, lbl]) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "mf-chip" + (userPrefs.focus === id ? " active" : "");
    b.textContent = lbl; b.setAttribute("aria-pressed", userPrefs.focus === id ? "true" : "false");
    b.onclick = () => { userPrefs.focus = id; saveUserPrefs(); if (typeof onRefresh === "function") onRefresh(); };
    focRow.appendChild(b);
  });
  const earBtn = document.createElement("button"); earBtn.type = "button";
  const earOn = isBlindEarActive();
  earBtn.className = "mf-chip blind-ear-chip" + (earOn ? " active" : "");
  earBtn.textContent = earOn ? "🎧 Blind-Ear: ON" : "🎧 Blind-Ear: OFF";
  earBtn.setAttribute("aria-pressed", earOn ? "true" : "false");
  earBtn.onclick = () => {
    if (effectiveLevel() === "fluent" && earOn) { userPrefs.level = "explorer"; userPrefs.blindEar = false; }
    else { userPrefs.blindEar = !earOn; }
    saveUserPrefs();
    if (typeof actions.buildSpeakingGuide === "function") actions.buildSpeakingGuide();
    if (typeof actions.buildGram === "function" && typeof GRAMMAR !== "undefined") actions.buildGram("presente", GRAMMAR.presente);
    if (typeof onRefresh === "function") onRefresh();
  };
  focRow.appendChild(earBtn);
  bar.append(lvlRow, focRow);
  root.appendChild(bar);
}

export function buildGlobalFinderCard(root, { onOpenLesson } = {}) {
  const foldFinder = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const runGlobalFinder = raw => {
    const q = foldFinder(raw).trim();
    if (q.length < 2) return [];
    const hits = [];
    LESSONS.forEach((l, li) => {
      if (foldFinder(`${l.title} ${l.sub} ${l.enSub || ""} ${l.id} ${l.vocab}`).includes(q)) {
        hits.push({ kind: "Lesson", ico: l.icon || "📚", title: `#${li + 1} ${l.title}`, sub: l.enSub || l.sub, go: () => { if (typeof onOpenLesson === "function") onOpenLesson(l); } });
      }
    });
    FRASES.forEach((sec, si) => {
      const matchSec = foldFinder(sec.section).includes(q);
      const matchItem = (sec.items || []).find(it => foldFinder(`${it.es} ${it.en}`).includes(q));
      if (matchSec || matchItem) {
        hits.push({ kind: "Phrases", ico: "💬", title: sec.section, sub: matchItem ? `${matchItem.es} — ${matchItem.en}` : `${(sec.items || []).length} expressions`, go: () => { showPage("frases"); actions.renderFraseSection(si); } });
      }
    });
    VC.forEach(cat => {
      const matchCat = foldFinder(`${cat.label} ${cat.id}`).includes(q);
      let matchItem = (cat.items || []).find(it => foldFinder(`${it.word || it.es || ""} ${it.en || ""}`).includes(q));
      if (!matchItem && cat.id === "colombianismos" && typeof COLOMBIANISMOS !== "undefined") {
        matchItem = COLOMBIANISMOS.find(it => foldFinder(`${it.word || ""} ${it.en || ""}`).includes(q));
      }
      if (matchCat || matchItem) {
        hits.push({ kind: "Vocab", ico: "🗂️", title: cat.label, sub: matchItem ? `${matchItem.word || matchItem.es} — ${matchItem.en}` : "Vocabulary flashcards", go: () => { showPage("vocab"); actions.sCat(cat.id); } });
      }
    });
    Object.entries(VERBS || {}).forEach(([k, v]) => {
      const conj = [...(v.present || []), ...(v.past || [])].map(r => r.v).join(" ");
      const fam = (v.family || []).map(f => `${f.f} ${f.e}`).join(" ");
      const kf = foldFinder(k);
      if (foldFinder(`${k} ${v.en} ${v.type} ${v.example?.es || ""} ${v.example?.en || ""} ${conj} ${fam}`).includes(q)) {
        const boost = kf === q ? 100 : kf.startsWith(q) ? 50 : 0;
        hits.push({ _s: boost, kind: "Verb", ico: v.icon || "⚡", title: `${k} — ${v.en}`, sub: `${v.type} · ${v.example?.es || ""}`, go: () => { showPage("vocab"); actions.openVerbByKey(k); } });
      }
    });
    (PHRASE_DIALOGUES || []).forEach(d => {
      const linesText = (d.versions || []).flatMap(v => v.lines || []).map(l => `${l.es} ${l.en}`).join(" ");
      if (foldFinder(`${d.title} ${d.sub || ""} ${linesText}`).includes(q)) {
        hits.push({ _s: foldFinder(d.title).includes(q) ? 25 : 0, kind: "Dialogue", ico: d.icon || "🗣️", title: d.title, sub: d.sub || "Interactive roleplay dialogue", go: () => { showPage("frases"); actions.renderFraseDialogue(d); } });
      }
    });
    (GRINGO_TRAPS || []).forEach((g, gi) => {
      if (foldFinder(`${g.intent} ${g.trap} ${g.local} ${g.why || ""}`).includes(q)) {
        hits.push({ _s: foldFinder(g.trap).includes(q) || foldFinder(g.local).includes(q) ? 30 : 0, kind: "Trap Fix", ico: "🚧", title: g.local, sub: `Avoid: ${g.trap} · ${g.intent}`, go: () => { showPage("frases"); const card = document.querySelector(".gringo-trap-card"); if (card) { card.dispatchEvent(new CustomEvent("gt-jump", { detail: gi })); card.scrollIntoView({ behavior: "smooth", block: "start" }); } } });
      }
    });
    (COLOMBIAN_STORIES || []).forEach((st, si) => {
      const partsText = (st.parts || []).flatMap(p => p.options || []).map(o => `${o.es} ${o.en}`).join(" ");
      if (foldFinder(`${st.title} ${st.sub || ""} ${partsText}`).includes(q)) {
        hits.push({ _s: foldFinder(st.title).includes(q) ? 20 : 0, kind: "Story", ico: "📖", title: st.title, sub: st.sub || "3-part Colombian story", go: () => { showPage("frases"); const tabs = document.querySelectorAll(".story-builder-card .story-tabs .reg-tab-btn"); if (tabs[si]) tabs[si].click(); const card = document.querySelector(".story-builder-card"); if (card) card.scrollIntoView({ behavior: "smooth", block: "start" }); } });
      }
    });
    (VISUAL_GUIDES || []).forEach(vg => {
      if (foldFinder(`${vg.title} ${vg.sub} ${vg.region || ""} ${vg.es || ""} ${vg.en || ""}`).includes(q)) {
        hits.push({ kind: "Poster", ico: "🖼️", title: vg.title, sub: vg.sub || vg.en, go: () => { showPage("gram"); actions.showGramGroup("posters"); } });
      }
    });
    return hits.sort((a, b) => (b._s || 0) - (a._s || 0)).slice(0, 10);
  };
  const finderCard = document.createElement("section");
  finderCard.className = "global-finder-card";
  finderCard.dataset.lessonView = "today";
  finderCard.innerHTML = `<div class="global-finder-head"><strong>🔎 Global Finder</strong><small>Search lessons, verbs, dialogues, traps &amp; posters</small></div>
    <div class="global-finder-bar"><input type="search" class="global-finder-input" placeholder="Try: airport, Nequi, poner, taxi, trap, slang…" aria-label="Search across lessons, verbs, dialogues, traps, vocabulary, and guides"/></div>
    <div class="global-finder-chips"></div>
    <div class="global-finder-results" aria-live="polite"></div>`;
  const fInput = finderCard.querySelector(".global-finder-input");
  const fChips = finderCard.querySelector(".global-finder-chips");
  const fRes = finderCard.querySelector(".global-finder-results");
  const renderFinder = val => {
    const q = String(val || "").trim();
    fRes.innerHTML = "";
    if (q.length < 2) return;
    const rows = runGlobalFinder(q);
    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "global-finder-empty";
      empty.textContent = `No matches for "${q}" — try English or Spanish keywords like "uber", "nequi", or "familia".`;
      fRes.appendChild(empty);
      return;
    }
    rows.forEach(r => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "global-finder-hit";
      btn.innerHTML = `<span class="gf-hit-ico">${r.ico}</span><span class="gf-hit-copy"><strong>${escapeVocabHtml(r.title)}</strong><small>${escapeVocabHtml(r.sub || "")}</small></span><span class="gf-hit-badge">${escapeVocabHtml(r.kind)}</span>`;
      btn.onclick = r.go;
      fRes.appendChild(btn);
    });
  };
  [["🚕 Uber", "uber"], ["☕ Bakery", "panaderia"], ["💳 Nequi", "nequi"], ["💊 Pharmacy", "farmacia"], ["❤️ Family", "familia"]].forEach(([lbl, term]) => {
    const c = document.createElement("button"); c.type = "button"; c.className = "mf-chip"; c.textContent = lbl;
    c.onclick = () => { fInput.value = term; renderFinder(term); };
    fChips.appendChild(c);
  });
  fInput.oninput = () => renderFinder(fInput.value);
  root.appendChild(finderCard);
}
