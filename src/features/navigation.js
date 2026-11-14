/** Page routing, swipe gestures, lazy page initialization & cross-feature action registry. */
import { appState } from "../state/app-state.js";
import { speak } from "../audio/voice-engine.js";

export const PG = ["fonetica", "lecciones", "vocab", "frases", "gram", "quiz"];
const pageInits = new Map();

export const actions = {
  stopActiveSprint: () => {},
  setLeccionesFocusMode: () => {},
  hideVerbDetail: () => {},
  openVerbByKey: () => {},
  showVocabHome: () => {},
  renderLessons: () => {},
  routineDockHide: () => {},
  resumeQuizListeningAudio: () => {},
  returnFromFraseDialogue: () => {},
  sCat: () => {},
  vocabCount: () => 0,
  openVocabPictureMatch: () => {},
  showGram: () => {},
  showGramGroup: () => {},
  buildGram: () => {},
  buildSpeakingGuide: () => {},
  openMissedQueue: () => {},
  exitMissedQueue: () => {},
  openReviewSession: () => {},
  openUnifiedSrsReview: () => false,
  openQuizV102Tab: () => {},
  openDailyFlowSession: () => {},
  syncMissedQueueLauncher: () => {},
  nQ: () => {},
  renderFraseMenu: () => {},
  renderFraseSection: () => {},
  renderFraseDialogue: () => {},
  setFraseReturnToLessons: () => {},
  mountColombiaChatsLab: () => {},
  mountNaturalEarLab: () => {},
  mountGringoTrapLab: () => {},
  mountPictureMatchEntry: () => {},
  pmSrsRank: () => 10,
  pmChoicesFor: () => [],
  renderTongueTwisters: () => {},
  getDailyTwisterSelection: () => [],
  showPhonetic: () => {},
  sel: () => {},
  syncQuizControls: () => {},
  resetQuizRound: () => {},
};

export function registerPageInit(id, fn) {
  pageInits.set(id, fn);
}

export function ensurePageInitialized(id) {
  if (appState.initializedPages.has(id)) return;
  appState.initializedPages.add(id);
  const fn = pageInits.get(id);
  if (fn) fn();
}

export function showPage(id) {
  if (id !== "quiz" && appState.spTimer) {
    actions.stopActiveSprint();
  }
  if (id !== "lecciones") {
    actions.setLeccionesFocusMode(false);
  }
  ensurePageInitialized(id);
  PG.forEach(p => {
    document.getElementById("page-" + p)?.classList.toggle("active", p === id);
    document.getElementById("tb-" + p)?.classList.toggle("active", p === id);
  });
  const scroller = document.querySelector(".scroll");
  if (scroller) scroller.scrollTop = 0;
  if (id !== "vocab") actions.hideVerbDetail();
  if (id === "vocab") actions.showVocabHome();
  if (id === "lecciones") {
    appState.lpLesson = null;
    actions.renderLessons();
  }
  if (id === "vocab" || id === "gram") actions.routineDockHide();
  if (id === "quiz") actions.resumeQuizListeningAudio(speak);
}

export function initTabSwipe() {
  const scroller = document.querySelector(".scroll");
  if (!scroller) return;
  let start = null;
  const interactive = "button,input,select,textarea,a,summary,[contenteditable='true'],.quiz-mode-row,.quiz-cat-row,.vocab-pills,.phrase-menu,.gram-tabs,.phonetic-tabs";
  scroller.addEventListener("touchstart", e => {
    if (e.touches.length !== 1 || e.target.closest(interactive)) { start = null; return; }
    const t = e.touches[0];
    start = { x: t.clientX, y: t.clientY, time: Date.now() };
  }, { passive: true });
  scroller.addEventListener("touchend", e => {
    if (!start || e.changedTouches.length !== 1) { start = null; return; }
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x, dy = t.clientY - start.y, duration = Date.now() - start.time;
    start = null;
    if (duration > 800 || Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    const active = PG.findIndex(p => document.getElementById("page-" + p)?.classList.contains("active"));
    if (active < 0) return;
    if (dx > 0 && active === PG.indexOf("frases") && document.getElementById("frases-list")?.dataset.view === "dialogue") {
      actions.returnFromFraseDialogue();
      return;
    }
    const next = active + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < PG.length) showPage(PG[next]);
  }, { passive: true });
}
