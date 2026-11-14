/** Application entrypoint for Español · Colombia (v107.0 ES Module build). */
import { speakSyl } from "../data/index.js";
import { appState } from "./state/app-state.js";
import { registerStorageUiHooks, buildProfileBar, attachProfileBackupControls } from "./state/storage.js";
import { initTheme, toggleAppTheme } from "./state/preferences.js";
import { speak, initVoiceEngine } from "./audio/voice-engine.js";
import { closeMicPanel, micListen, micPlay, micStart, micStop } from "./core/speech-mic.js";
import { runDataValidator } from "./core/validator.js";
import { actions, registerPageInit, ensurePageInitialized, showPage, initTabSwipe } from "./features/navigation.js";
import { initPhonetics, showPhonetic, sel, renderTongueTwisters, getDailyTwisterSelection } from "./features/phonetics.js";
import { initVocab, showVocabHome, hideVerbDetail, sCat, vocabCount, renderVocabHome } from "./features/vocab.js";
import { initPhrases, renderFraseMenu, renderFraseSection, renderFraseDialogue, returnFromFraseDialogue } from "./features/phrases.js";
import { initGuides, buildGram, buildSpeakingGuide, showGram, showGramGroup, mountColombiaChatsLab } from "./features/guides.js";
import {
  initLessons, renderLessons, openLesson, setLeccionesFocusMode,
  routineToday, routineDockHide, routineBack, routineFinishWarmup, routineFinishTwisters,
  syncMissedQueueLauncher,
} from "./features/lessons.js";
import { openDailyFlowSession } from "./features/daily-flow.js";
import {
  initQuiz, nQ, quizHear, toggleQuizBlindEar, syncQuizControls, resetQuizRound,
  openMissedQueue, openReviewSession, openQuizV102Tab, stopActiveSprint, resumeQuizListeningAudio,
  mountPictureMatchEntry, openVocabPictureMatch, pmSrsRank, pmChoicesFor,
  mountNaturalEarLab, mountGringoTrapLab,
} from "./features/quiz.js";

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
  openReviewSession: () => { ensurePageInitialized("quiz"); openReviewSession(); },
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
  showPhonetic: id => { ensurePageInitialized("fonetica"); showPhonetic(id); },
  showGramGroup: g => { ensurePageInitialized("gram"); showGramGroup(g); },
  nQ: () => { ensurePageInitialized("quiz"); nQ(); },
  quizHear: () => { ensurePageInitialized("quiz"); quizHear(); },
  toggleQuizBlindEar: () => { ensurePageInitialized("quiz"); toggleQuizBlindEar(); },
  routineBack,
  routineFinishWarmup,
  routineFinishTwisters,
  closeMicPanel,
  micListen,
  micPlay,
  micStart,
  micStop,
});

// Deterministic startup bootstrap
initTheme();
buildProfileBar(attachProfileBackupControls);
initVoiceEngine();
ensurePageInitialized("lecciones");
initTabSwipe();
runDataValidator();
