import { VERBS, N130, NT, PQ, COLOMBIANISMOS } from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { escapeVocabHtml, localDayKey, normalizeQuizText } from "./text-utils.js";

export const PRACTICE_KEY="esco-practice-v1";
export let practiceStore={vocab:{},phrases:{}};
try{practiceStore=Object.assign(practiceStore,JSON.parse(appStorage.getItem(PRACTICE_KEY)||"{}"));practiceStore.vocab=practiceStore.vocab||{};practiceStore.phrases=practiceStore.phrases||{};}catch(e){practiceStore={vocab:{},phrases:{}};}
export function savePractice(){try{appStorage.setItem(PRACTICE_KEY,JSON.stringify(practiceStore));}catch(e){}}
export function practiceKey(value){return String(value||"").trim().toLowerCase();}
let vocabRefreshHook = () => {};
export function setVocabRefreshHook(fn){ if(fn) vocabRefreshHook = fn; }
export function refreshVocabProgress(){ vocabRefreshHook(); }
export function markPractice(type,value){const key=practiceKey(value);if(!key)return;const bucket=practiceStore[type]||(practiceStore[type]={});bucket[key]=(bucket[key]||0)+1;savePractice();refreshVocabProgress();}
export function practiced(type,value){return !!(practiceStore[type]&&practiceStore[type][practiceKey(value)]);}
export function practicedCount(type,values){return (values||[]).filter(v=>practiced(type,v)).length;}
export function vocabKeys(cat){
  if(!cat)return [];
  if(cat.type==="basic")return (cat.items||[]).map(i=>i.tts||i.word);
  if(cat.type==="verbos")return Object.keys(VERBS);
  if(cat.type==="numeros")return [...N130,...NT].map(n=>n.w);
  if(cat.type==="preguntas")return PQ.map(p=>p.tts||p.word);
  if(cat.type==="colombianismos")return COLOMBIANISMOS.map(c=>c.tts||c.word);
  return [];
}
export function phraseProgress(items){return practicedCount("phrases",[...new Set((items||[]).map(i=>i.es))]);}
export const LESSON_KEY="esco-lesson-progress-v1";
export let lessonProgress={};
try{const lp=JSON.parse(appStorage.getItem(LESSON_KEY)||"{}");lessonProgress=(lp&&typeof lp==="object"&&!Array.isArray(lp))?lp:{};}catch(e){lessonProgress={};}
export function saveLessons(){try{appStorage.setItem(LESSON_KEY,JSON.stringify(lessonProgress));}catch(e){}}
export const LESSON_SCORES_KEY="esco-lesson-scores-v1";
export let lessonScores={};
try{const ls=JSON.parse(appStorage.getItem(LESSON_SCORES_KEY)||"{}");lessonScores=(ls&&typeof ls==="object"&&!Array.isArray(ls))?ls:{};}catch(e){lessonScores={};}
export function saveLessonScores(){try{appStorage.setItem(LESSON_SCORES_KEY,JSON.stringify(lessonScores));}catch(e){}}
export const STAGE_MASTERY_KEY="esco-stage-mastery-v1";
export let stageMastery={};
try{const sm=JSON.parse(appStorage.getItem(STAGE_MASTERY_KEY)||"{}");stageMastery=(sm&&typeof sm==="object"&&!Array.isArray(sm))?sm:{};}catch(e){stageMastery={};}
export function saveStageMastery(){try{appStorage.setItem(STAGE_MASTERY_KEY,JSON.stringify(stageMastery));}catch(e){}}

/* Racha de días — practice-day streak */
export const DAY_KEY="esco-days-v1";
export let dayInfo={last:"",streak:0};
try{const di=JSON.parse(appStorage.getItem(DAY_KEY)||"{}");if(di&&typeof di==="object"&&!Array.isArray(di))Object.assign(dayInfo,di);}catch(e){}
export function recordPracticeDay(){
  const today=localDayKey();
  if(dayInfo.last===today)return;
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  dayInfo.streak=dayInfo.last===localDayKey(yesterday)?Math.max(0,Number(dayInfo.streak)||0)+1:1;
  dayInfo.last=today;
  try{appStorage.setItem(DAY_KEY,JSON.stringify(dayInfo));}catch(e){}
}
export function practiceStreak(){
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  return dayInfo.last===localDayKey()||dayInfo.last===localDayKey(yesterday)?Math.max(0,Number(dayInfo.streak)||0):0;
}
recordPracticeDay();

export const SRS_KEY="esco-srs-v1";
export let srsStore={};
try{srsStore=JSON.parse(appStorage.getItem(SRS_KEY)||"{}");if(!srsStore||typeof srsStore!=="object")srsStore={};}catch(e){srsStore={};}
export const SRS_INTERVALS=[1,3,7,14,30];
export function saveSrs(){try{appStorage.setItem(SRS_KEY,JSON.stringify(srsStore));}catch(e){}}
export function srsDue(key){const card=srsStore[key];return !!card&&(!card.due||card.due<=Date.now());}
export function srsDueCount(){return Object.keys(srsStore).filter(srsDue).length;}
export function recordSrs(key,correct){
  recordPracticeDay();
  const now=Date.now(),today=localDayKey();
  const card=srsStore[key]||{reps:0,interval:0,lapses:0,due:0};
  if(correct){
    if(card.lastReviewDay!==today&&(!card.due||card.due<=now)){
      card.reps=(card.reps||0)+1;
      card.spacedReviews=(card.spacedReviews||0)+1;
      card.interval=Math.min((card.interval||0)+1,SRS_INTERVALS.length);
      card.due=now+SRS_INTERVALS[card.interval-1]*86400000;
      card.lastReviewDay=today;
    }
  }else{
    card.lapses=(card.lapses||0)+1;card.reps=0;card.spacedReviews=0;card.interval=0;
    card.due=now+86400000;card.lastReviewDay=today;
  }
  srsStore[key]=card;saveSrs();
}
export function srsNextLabel(card){if(!card||!card.interval)return "tomorrow";const days=SRS_INTERVALS[Math.max(0,Math.min(SRS_INTERVALS.length-1,card.interval-1))];return days===1?"tomorrow":`in ${days} days`;}

/* v61: a small, profile-scoped error journal. Quiz misses and speaking
   hesitations become useful practice targets instead of disappearing into a
   score counter. It stores the Spanish target, not private recordings. */
export const SPEAKING_ERROR_KEY="esco-speaking-errors-v1";
export let speakingErrors={};
try{speakingErrors=JSON.parse(appStorage.getItem(SPEAKING_ERROR_KEY)||"{}");if(!speakingErrors||typeof speakingErrors!=="object")speakingErrors={};}catch(e){speakingErrors={};}
export function saveSpeakingErrors(){try{appStorage.setItem(SPEAKING_ERROR_KEY,JSON.stringify(speakingErrors));}catch(e){}}
export function speakingErrorId(target){return normalizeQuizText(target||"");}
export function recordSpeakingError(target,source){
  const text=String(target||"").trim(),id=speakingErrorId(text);if(!id)return;
  const old=speakingErrors[id]||{};
  speakingErrors[id]={text:old.text||text,source:source||old.source||"practice",count:(old.count||0)+1,last:Date.now()};
  saveSpeakingErrors();
}
export function clearSpeakingError(target){const id=speakingErrorId(target);if(!id)return;delete speakingErrors[id];saveSpeakingErrors();}
export function isStarredPhrase(target){const id=speakingErrorId(target);return !!(id&&speakingErrors[id]&&speakingErrors[id].starred);}
export function toggleStarPhrase(target,source,btn){
  const text=String(target||"").trim(),id=speakingErrorId(text);if(!id)return false;
  if(speakingErrors[id]&&speakingErrors[id].starred){
    delete speakingErrors[id];saveSpeakingErrors();
    if(btn){btn.textContent="☆";btn.classList.remove("starred");btn.title="Pin to speaking practice list";}
    return false;
  }
  const old=speakingErrors[id]||{};
  speakingErrors[id]={text:old.text||text,source:source||old.source||"starred",count:old.count||1,last:Date.now(),starred:true};
  saveSpeakingErrors();
  if(btn){btn.textContent="⭐";btn.classList.add("starred");btn.title="Pinned in your speaking practice list";}
  return true;
}
export function attachStarBtn(container,target,source){
  if(!container||!target)return;
  const b=document.createElement("button");b.type="button";
  const on=isStarredPhrase(target);
  b.className="star-pin-btn"+(on?" starred":"");
  b.textContent=on?"⭐":"☆";
  b.title=on?"Pinned in your speaking practice list":"Pin to speaking practice list";
  b.setAttribute("aria-label","Pin phrase to speaking list");
  b.onclick=e=>{e.stopPropagation();toggleStarPhrase(target,source,b);};
  container.appendChild(b);
}
export const MISSION_KEY="esco-mission-progress-v1";
export let missionProgress={};
try{missionProgress=JSON.parse(appStorage.getItem(MISSION_KEY)||"{}");if(!missionProgress||typeof missionProgress!=="object")missionProgress={};}catch(e){missionProgress={};}
export function saveMissions(){try{appStorage.setItem(MISSION_KEY,JSON.stringify(missionProgress));}catch(e){}}
export const READING_KEY="esco-reading-progress-v1";
export let readingProgress={};
try{readingProgress=JSON.parse(appStorage.getItem(READING_KEY)||"{}");if(!readingProgress||typeof readingProgress!=="object")readingProgress={};}catch(e){readingProgress={};}
export function saveReadings(){try{appStorage.setItem(READING_KEY,JSON.stringify(readingProgress));}catch(e){}}
export const QS_KEY="esco-quiz-v1";
export let qStore={c:0,t:0,s:0,missed:{}};
try{const raw=appStorage.getItem(QS_KEY);const parsed=raw?JSON.parse(raw):null;if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed))Object.assign(qStore,parsed);if(!qStore.missed||typeof qStore.missed!=="object")qStore.missed={};}catch(e){}
if(!Object.keys(srsStore).length&&qStore.missed){Object.keys(qStore.missed).forEach(key=>{srsStore[key]={reps:0,interval:0,lapses:0,due:Date.now()};});saveSrs();}
export function saveQ(){try{appStorage.setItem(QS_KEY,JSON.stringify(qStore));}catch(e){}}

export function resetQAndSrs(){qStore={c:0,t:0,s:0,missed:{}};srsStore={};saveQ();saveSrs();}
