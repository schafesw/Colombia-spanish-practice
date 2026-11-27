/** Application entrypoint for Español · Colombia (v114.0 Editorial Language Studio). */
import { speakSyl } from "../data/index.js";
import { appState } from "./state/app-state.js";
import { registerStorageUiHooks, buildProfileBar, attachProfileBackupControls } from "./state/storage.js";
import { initTheme, toggleAppTheme } from "./state/preferences.js";
import { speak, initVoiceEngine } from "./audio/voice-engine.js";
import { closeMicPanel, micListen, micPlay, micStart, micStop } from "./core/speech-mic.js";
import { runDataValidator } from "./core/validator.js";
import { actions, registerPageInit, ensurePageInitialized, showPage, navigatePage, initTabSwipe } from "./features/navigation.js";
import { initPhonetics, showPhonetic, sel, renderTongueTwisters, getDailyTwisterSelection } from "./features/phonetics.js";
import { initVocab, showVocabHome, hideVerbDetail, openVerbByKey, sCat, vocabCount, renderVocabHome } from "./features/vocab.js";
import { initPhrases, renderFraseMenu, renderFraseSection, renderFraseDialogue, returnFromFraseDialogue } from "./features/phrases.js";
import { initGuides, buildGram, buildSpeakingGuide, showGram, showGramGroup } from "./features/guides.js";
import { mountColombiaChatsLab } from "./features/colombia-chats.js";
import {
  initLessons, renderLessons,
  routineToday, routineDockHide, routineBack, routineFinishWarmup, routineFinishTwisters,
  routineFinishMission, syncMissedQueueLauncher,
} from "./features/lessons.js";
import { openLesson, setLeccionesFocusMode } from "./features/lesson-player.js";
import { rrStop } from "./features/rapida.js";
import { renderReading } from "./features/speaking-labs.js";
import { openDailyFlowSession, openUnifiedSrsReview } from "./features/daily-flow.js";
import { initQuiz, nQ, quizHear, toggleQuizBlindEar, toggleQuizRecallFirst, toggleQuizSpeed, syncQuizControls, resetQuizRound, openMissedQueue, exitMissedQueue, openReviewSession, resumeQuizListeningAudio } from "./features/quiz.js";
import { mountPictureMatchEntry, openVocabPictureMatch, pmSrsRank, pmChoicesFor } from "./features/picture-match.js";
import { openQuizV102Tab, stopActiveSprint, mountNaturalEarLab, mountGringoTrapLab } from "./features/quiz-labs.js";
import { initStudioShell, syncStudioChrome, syncMouthLetter, openCommandFinder } from "./features/studio-shell.js";

// Wire storage UI hooks without circular module imports
registerStorageUiHooks({
  onAudioTest: (t, r) => speak(t, r),
  onThemeToggle: toggleAppTheme,
});

// Wire cross-feature action registry
Object.assign(actions, {
  stopActiveSprint,
  setLeccionesFocusMode,
  hideVerbDetail,
  openVerbByKey: k => { ensurePageInitialized("vocab"); openVerbByKey(k); },
  showVocabHome,
  renderVocabHome: () => { ensurePageInitialized("vocab"); renderVocabHome(); },
  renderLessons,
  routineDockHide,
  resumeQuizListeningAudio,
  returnFromFraseDialogue,
  sCat: id => { ensurePageInitialized("vocab"); sCat(id); },
  vocabCount,
  openVocabPictureMatch: () => { ensurePageInitialized("vocab"); ensurePageInitialized("quiz"); openVocabPictureMatch(); },
  showGram: id => { ensurePageInitialized("gram"); showGram(id); },
  showGramGroup: g => { ensurePageInitialized("gram"); showGramGroup(g); },
  buildGram,
  buildSpeakingGuide,
  openMissedQueue: () => { ensurePageInitialized("quiz"); openMissedQueue(); },
  exitMissedQueue: () => { ensurePageInitialized("quiz"); exitMissedQueue(); },
  openReviewSession: () => { ensurePageInitialized("quiz"); openReviewSession(); },
  openUnifiedSrsReview,
  openQuizV102Tab: tab => { ensurePageInitialized("quiz"); openQuizV102Tab(tab); },
  openDailyFlowSession,
  syncMissedQueueLauncher,
  nQ,
  renderFraseMenu: () => { ensurePageInitialized("frases"); renderFraseMenu(); },
  renderFraseSection: idx => { ensurePageInitialized("frases"); renderFraseSection(idx); },
  renderFraseDialogue: (d, t) => { ensurePageInitialized("frases"); renderFraseDialogue(d, t); },
  setFraseReturnToLessons: v => { appState.fraseReturnToLessons = !!v; },
  mountColombiaChatsLab,
  mountNaturalEarLab,
  mountGringoTrapLab,
  mountPictureMatchEntry,
  pmSrsRank,
  pmChoicesFor,
  renderTongueTwisters,
  getDailyTwisterSelection,
  showPhonetic: id => { ensurePageInitialized("fonetica"); showPhonetic(id); },
  sel: l => { ensurePageInitialized("fonetica"); sel(l); },
  syncQuizControls,
  resetQuizRound,
  openLesson,
  routineToday,
  routineFinishMission,
  renderReading,
  rrStop,
  syncStudioChrome,
  syncMouthLetter,
});

// Register lazy page initializers (render inactive tabs on first visit)
registerPageInit("fonetica", initPhonetics);
registerPageInit("lecciones", initLessons);
registerPageInit("vocab", initVocab);
registerPageInit("frases", initPhrases);
registerPageInit("gram", initGuides);
registerPageInit("quiz", initQuiz);

// Expose explicit global handlers used by HTML inline onclick="..." attributes
Object.assign(window, {
  speak,
  speakSyl,
  showPage,
  navigatePage,
  openCommandFinder,
  showPhonetic: id => { ensurePageInitialized("fonetica"); showPhonetic(id); },
  showGramGroup: g => { ensurePageInitialized("gram"); showGramGroup(g); },
  nQ: () => { ensurePageInitialized("quiz"); nQ(); },
  quizHear: () => { ensurePageInitialized("quiz"); quizHear(); },
  toggleQuizBlindEar: () => { ensurePageInitialized("quiz"); toggleQuizBlindEar(); },
  toggleQuizRecallFirst: () => { ensurePageInitialized("quiz"); toggleQuizRecallFirst(); },
  toggleQuizSpeed: () => { ensurePageInitialized("quiz"); toggleQuizSpeed(); },
  routineBack,
  routineFinishWarmup,
  routineFinishTwisters,
  closeMicPanel,
  micListen,
  micPlay,
  micStart,
  micStop,
});

function showPwaUpdateBanner() {
  if (document.getElementById("pwa-update-toast")) return;
  const toast = document.createElement("div");
  toast.id = "pwa-update-toast";
  toast.className = "pwa-update-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `<span class="pwa-update-copy">🆕 App updated to v133.0</span><button type="button" class="pwa-update-btn">Refresh</button><button type="button" class="pwa-update-dismiss" aria-label="Dismiss update notification">✕</button>`;
  toast.querySelector(".pwa-update-btn").onclick = () => location.reload();
  toast.querySelector(".pwa-update-dismiss").onclick = () => toast.remove();
  document.body.appendChild(toast);
}

function initPwaUpdater() {
  if (!("serviceWorker" in navigator) || !/^https?:$/i.test(location.protocol)) return;
  const registerSw = () => {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register("sw.js?v=133.0").then(reg => {
      if (!reg) return;
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "activated" && hadController) {
            showPwaUpdateBanner();
          }
        });
      });
    }).catch(() => {});
  };
  if (document.readyState === "complete") registerSw();
  else window.addEventListener("load", registerSw);
}

function bindStaticShellHandlers() {
  document.querySelectorAll(".phonetic-tab[data-phonetic]").forEach(b => {
    b.onclick = () => { ensurePageInitialized("fonetica"); showPhonetic(b.dataset.phonetic); };
  });
  const wb = document.querySelector("#phonetic-start .warmup-back");
  if (wb) wb.onclick = () => routineBack();
  const wc = document.querySelector("#phonetic-start .warmup-continue");
  if (wc) wc.onclick = () => routineFinishWarmup();
  document.querySelectorAll(".gram-groups .ggroup[data-g]").forEach(b => {
    b.onclick = () => { ensurePageInitialized("gram"); showGramGroup(b.dataset.g); };
  });
  const qh = document.getElementById("quiz-hear-btn");
  if (qh) qh.onclick = () => { ensurePageInitialized("quiz"); quizHear(); };
  const qb = document.getElementById("quiz-blind-toggle");
  if (qb) qb.onclick = () => { ensurePageInitialized("quiz"); toggleQuizBlindEar(); };
  const qr = document.getElementById("quiz-recall-toggle");
  if (qr) qr.onclick = () => { ensurePageInitialized("quiz"); toggleQuizRecallFirst(); };
  const qs = document.getElementById("quiz-speed-toggle");
  if (qs) qs.onclick = () => { ensurePageInitialized("quiz"); toggleQuizSpeed(); };
  const qn = document.getElementById("quiz-next");
  if (qn) qn.onclick = () => { ensurePageInitialized("quiz"); nQ(); };
  document.querySelectorAll(".tab-bar .tab-item[data-page]").forEach(b => {
    b.onclick = () => navigatePage(b.dataset.page);
  });
}

// Deterministic startup bootstrap
const splashEl = document.getElementById("splash");
if (splashEl && !window.__ESCO_SYNC_BOOT) splashEl.remove();
initTheme();
buildProfileBar(attachProfileBackupControls);
initVoiceEngine();
bindStaticShellHandlers();
ensurePageInitialized("lecciones");
initStudioShell();
initTabSwipe();
runDataValidator();
initPwaUpdater();
