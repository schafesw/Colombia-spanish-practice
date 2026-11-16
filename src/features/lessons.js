import {
  LESSONS,
} from "./lessons-meta.js";
import {
  READINGS, CONVERSATION_MISSIONS, LESSON_CONTENT, LESSON_META,
  SPEAKING_FRAMES, SENTENCE_LADDERS, SLOT_SWAP_MATRICES,
  TONGUE_TWISTERS, SPEAKING_GUIDE, REGIONAL_SWITCHER,
  PICTURE_MATCH_BANK, COLOMBIA_CHATS, GRAMMAR, VERB_VERSATILITY_ENGINE,
  VC, VERBS, FRASES, VISUAL_GUIDES, COLOMBIANISMOS, GRINGO_TRAPS, COLOMBIAN_STORIES,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { userPrefs, saveUserPrefs, effectiveLevel, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, lpEl, scrollAppTop, spanishStressHint, normalizeQuizText, normalizeQuizPrompt, normalizeQuizAnswer, localDayKey } from "../core/text-utils.js";
import {
  practiceStore, markPractice, practiced,
  lessonProgress, saveLessons, recordPracticeDay, practiceStreak, dayInfo,
  srsStore, saveSrs, srsDue, srsDueCount, recordSrs, SRS_INTERVALS,
  speakingErrors, clearSpeakingError, recordSpeakingError, attachStarBtn,
  missionProgress, saveMissions, readingProgress, saveReadings,
} from "../core/stores.js";
import { attachMic, openMicPanel } from "../core/speech-mic.js";
import { PHRASE_DIALOGUES, RR_BANK, aQ, quizAcceptedAnswers, quizAnswerMatches, storedMissedQuestionCount } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";
import {
  lessonDialogue, openLesson, setLeccionesFocusMode, renderLessonStep, loadResume, openLessonAt,
} from "./lesson-player.js";
import {
  rrStop, renderRapida, renderSpeakingErrorJournal, resetRrSession, getRrStats,
} from "./rapida.js";
import {
  renderMission, frameDayNumber, renderFramePractice, renderReading,
} from "./speaking-labs.js";

LESSONS.forEach(lesson=>{
  if(typeof LESSON_META!=="undefined"&&LESSON_META[lesson.id])Object.assign(lesson,LESSON_META[lesson.id]);
  if(!lesson.difficulty)lesson.difficulty=/gram|pronombres|groserias/.test(lesson.id)?"Moderate":"Easy";
  if(!lesson.stage)lesson.stage=/gram|pronombres/.test(lesson.id)?"Build Sentences":"Daily Life";
  if(!lesson.readingId){const match=READINGS.find(r=>r.lesson===lesson.id)||READINGS.find(r=>r.lesson===lesson.vocab);lesson.readingId=match?match.id:READINGS[0].id;}
  if(!lesson.missionId){const match=CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.id)||CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.vocab);lesson.missionId=match?match.id:CONVERSATION_MISSIONS[0].id;}
});

/* ═══════════════════════════════════════════════════════════════════════════
   Guided daily speaking routine (v35) — one small sequence using existing
   features. The day and current step persist, but content remains replayable.
   ═══════════════════════════════════════════════════════════════════════════ */
const ROUTINE_KEY="esco-routine-v3";
export const ROUTINE_STEPS=[
  {id:"warmup",icon:"🎙️",title:"Warm up your mouth",sub:"Pure vowels, RR, and Ñ · about 2 minutes."},
  {id:"twisters",icon:"🗣️",title:"Train difficult sounds",sub:"Tongue twisters for RR and Ñ · about 3 minutes."},
  {id:"review",icon:"🔁",title:"Recall useful Spanish",sub:"Review due cards and answer before looking."},
  {id:"phrases",icon:"💬",title:"Speak useful phrases",sub:"Practice a real conversation and both sides."},
  {id:"mission",icon:"🗣️",title:"Conversation mission",sub:"Answer in your own words out loud."}
];
export let routineState={date:"",step:0};
try{const rs=JSON.parse(appStorage.getItem(ROUTINE_KEY)||"{}");if(rs&&typeof rs==="object"&&!Array.isArray(rs))Object.assign(routineState,rs);}catch(e){}
export function routineToday(){const today=new Date().toISOString().slice(0,10);if(routineState.date!==today){routineState={date:today,step:0};saveRoutine();}return routineState;}
function saveRoutine(){try{appStorage.setItem(ROUTINE_KEY,JSON.stringify(routineState));}catch(e){}}
export function routineOpen(id){
  removeRoutineQuizGuide();
  routineDockShow();
  if(id==="warmup"){
    clearRoutineFocus();showPage("fonetica");actions.showPhonetic("syllables");setRoutineFocus("warmup");
    setTimeout(()=>{const reminders=document.getElementById("phonetic-english-reminders");if(reminders)reminders.open=true;const start=document.getElementById("phonetic-start");if(start)start.scrollIntoView({behavior:"smooth",block:"start"});},60);
  }
  else if(id==="twisters"){
    clearRoutineFocus();showPage("fonetica");actions.showPhonetic("syllables");setRoutineFocus("twisters");
    setTimeout(()=>{
      const fold=document.getElementById("phonetic-twisters");if(fold)fold.open=true;
      const root=document.getElementById("tongue-twister-lab");
      appState.routineTwisterSelection=actions.getDailyTwisterSelection();
      const labels=appState.routineTwisterSelection.map(x=>escapeVocabHtml(x.title)).join(" + ");
      const list=root&&root.querySelector(".twister-list");
      if(list){appState.routineTwisterSelection.slice().reverse().forEach(item=>{const card=list.querySelector(`[data-twister-id="${item.id}"]`);if(card){card.classList.add("routine-daily-pick");list.prepend(card);}});}
      if(root&&!root.querySelector(".routine-twister-guide")){
        root.insertAdjacentHTML("afterbegin",`<div class="routine-twister-guide"><div class="routine-guide-kicker">🎯 STEP 2 · TODAY'S FOCUS</div><strong>Train RR and Ñ before speed</strong><span>Today's picks: <b>${labels}</b>. They rotate automatically each day. Practice each one 2–3 times: listen slowly, repeat, say it naturally, then record yourself.</span><div class="routine-twister-sequence"><b>1</b> Listen slowly · <b>2</b> Repeat twice · <b>3</b> Natural speed · <b>4</b> Record and compare</div><div class="routine-guide-actions"><button type="button" class="warmup-back" onclick="routineBack()">‹ Back to daily path</button><button type="button" class="warmup-continue" onclick="routineFinishTwisters()">Done — continue →</button></div></div>`);
      }
      const start=document.getElementById("phonetic-twisters");if(start)start.scrollIntoView({behavior:"smooth",block:"start"});
    },60);
  }
  else if(id==="review"){
    showPage("quiz");appState.qMissedOnly=false;appState.qMode="mixed";appState.qCat="all";appState.qFocus="all";appState.repasoLeft=10;actions.resetQuizRound();actions.syncQuizControls();actions.nQ();renderRoutineQuizGuide();
  }
  else if(id==="phrases"){
    showPage("frases");
    const d=PHRASE_DIALOGUES.find(x=>/Uber: hablo poquito español/i.test(x.title))||PHRASE_DIALOGUES.find(x=>/Carro y taxi/i.test(x.title))||PHRASE_DIALOGUES[0];
    if(d)actions.renderFraseDialogue(d,"Ahora");
  }
  else if(id==="mission"){const m=CONVERSATION_MISSIONS.find(x=>!missionProgress[x.id])||CONVERSATION_MISSIONS[0];if(m){showPage("lecciones");renderMission(m);}}
}
function clearRoutineGuide(){appState.routineTwisterSelection=null;actions.renderTongueTwisters();removeRoutineQuizGuide();}
function setRoutineFocus(kind){const page=document.getElementById("page-fonetica");if(page){page.classList.add("routine-focus");page.classList.toggle("routine-focus-warmup",kind==="warmup");page.classList.toggle("routine-focus-twisters",kind==="twisters");}}
function clearRoutineFocus(){const page=document.getElementById("page-fonetica");if(page)page.classList.remove("routine-focus","routine-focus-warmup","routine-focus-twisters");}
export function routineBack(){routineDockHide();clearRoutineGuide();clearRoutineFocus();lessonView="today";showPage("lecciones");}
function routineAdvance(expected){
  routineToday();
  if(routineState.step!==expected){routineBack();return;}
  routineState.step=Math.min(ROUTINE_STEPS.length,routineState.step+1);saveRoutine();
  const next=ROUTINE_STEPS[routineState.step];
  if(next)routineOpen(next.id);else{routineDockHide();clearRoutineGuide();clearRoutineFocus();showPage("lecciones");}
}
export function routineFinishWarmup(){routineAdvance(0);}
export function routineFinishTwisters(){routineAdvance(1);}
export function routineFinishReview(){routineAdvance(2);}
export function routineFinishPhrases(){routineAdvance(3);}
export function routineFinishMission(){
  const mission=CONVERSATION_MISSIONS.find(x=>!missionProgress[x.id])||CONVERSATION_MISSIONS[0];
  if(mission){missionProgress[mission.id]=true;saveMissions();}
  routineAdvance(4);
}
export function routineComplete(){routineToday();routineState.step=Math.min(ROUTINE_STEPS.length,routineState.step+1);saveRoutine();showPage("lecciones");}
function removeRoutineQuizGuide(){const guide=document.querySelector(".routine-quiz-guide");if(guide)guide.remove();}
function routineDockEnsure(){
  let dock=document.getElementById("routine-dock");
  if(dock)return dock;
  dock=document.createElement("section");dock.id="routine-dock";dock.className="routine-dock";dock.setAttribute("aria-label","Daily speaking path controls");
  dock.innerHTML="<div class='routine-dock-meta'><span>🎓 DAILY SPEAKING PATH</span><span class='routine-dock-count'></span></div><button type='button' class='routine-dock-btn'></button><button type='button' class='routine-dock-back'>‹ Back to daily path</button>";
  dock.querySelector(".routine-dock-back").onclick=routineBack;
  dock.querySelector(".routine-dock-btn").onclick=routineDockAdvance;
  document.body.appendChild(dock);return dock;
}
function routineDockShow(){
  const dock=routineDockEnsure();routineToday();
  if(routineState.step>=ROUTINE_STEPS.length){routineDockHide();return;}
  const step=routineState.step,next=ROUTINE_STEPS[step+1];
  dock.querySelector(".routine-dock-count").textContent=`Step ${step+1} of ${ROUTINE_STEPS.length}`;
  dock.querySelector(".routine-dock-btn").textContent=next?`Continue to ${next.title} →`:"Finish today’s speaking path ✓";
  document.body.classList.add("routine-session-active");dock.classList.add("active");
}
export function routineDockHide(){const dock=document.getElementById("routine-dock");if(dock)dock.classList.remove("active");document.body.classList.remove("routine-session-active");}
function routineDockAdvance(){
  routineToday();
  if(routineState.step===0)return routineFinishWarmup();
  if(routineState.step===1)return routineFinishTwisters();
  if(routineState.step===2)return routineFinishReview();
  if(routineState.step===3)return routineFinishPhrases();
  if(routineState.step===4)return routineFinishMission();
}
function renderRoutineQuizGuide(){
  removeRoutineQuizGuide();
  if(routineToday().step!==2)return;
  const page=document.getElementById("page-quiz"),anchor=page&&page.querySelector(".quiz-score-bar");if(!page||!anchor)return;
  const guide=document.createElement("section");guide.className="routine-quiz-guide";
  guide.innerHTML="<div class='routine-guide-kicker'>🎯 STEP 3 · RECALL</div><strong>Practice a few useful answers</strong><span>Answer out loud before tapping. Use the Spanish reveal to repeat the complete sentence.</span><button type='button' class='routine-next-large' onclick='routineFinishReview()'>I practiced — continue to phrases →</button><button type='button' class='routine-back-link' onclick='routineBack()'>‹ Back to daily path</button>";
  page.insertBefore(guide,anchor);
}

/* v58: keep Lecciones from becoming one long mixed-purpose page. The three
   views preserve all existing material while making the next action obvious. */
const LESSON_VIEW_KEY="esco-lesson-view-v1";
const SESSION_LENGTH_KEY="esco-session-length-v1";
let lessonView="today",sessionLength="10";
try{lessonView=appStorage.getItem(LESSON_VIEW_KEY)||"today";sessionLength=appStorage.getItem(SESSION_LENGTH_KEY)||"10";}catch(e){}
export function setLessonView(view){
  lessonView=view||"today";
  try{appStorage.setItem(LESSON_VIEW_KEY,lessonView);}catch(e){}
  const root=document.getElementById("lesson-list");if(!root)return;
  root.querySelectorAll(".lesson-view-tab").forEach(b=>b.classList.toggle("active",b.dataset.view===lessonView));
  root.querySelectorAll("[data-lesson-view]").forEach(el=>el.classList.toggle("lesson-view-hidden",el.dataset.lessonView!==lessonView));
  scrollAppTop();
}
function buildLessonViewTabs(root){
  const nav=document.createElement("nav");nav.className="lesson-view-tabs";nav.setAttribute("aria-label","Lesson views");
  [["today","Today / Hoy","Daily hub"],["path","Learning path / Ruta",`${LESSONS.length} lessons`],["practice","Practice / Biblioteca","Missions & stories"]].forEach(([id,title,sub])=>{
    const b=document.createElement("button");b.type="button";b.className="lesson-view-tab";b.dataset.view=id;b.innerHTML=`<strong>${title}</strong><small>${sub}</small>`;b.onclick=()=>setLessonView(id);nav.appendChild(b);
  });
  root.appendChild(nav);
}
function setSessionLength(value){
  sessionLength=String(value);try{appStorage.setItem(SESSION_LENGTH_KEY,sessionLength);}catch(e){}
  const root=document.getElementById("lesson-list");if(!root)return;
  root.querySelectorAll(".session-length-btn").forEach(b=>b.classList.toggle("selected",b.dataset.minutes===sessionLength));
}
function startSelectedSession(){
  scrollAppTop();
  if(sessionLength==="5"){renderFramePractice(false);return;}
  if(sessionLength==="20"){
    const target=LESSONS.find(l=>!lessonProgress[l.id])||LESSONS[0];
    if(target)openLesson(target);return;
  }
  routineToday();
  if(routineState.step>=ROUTINE_STEPS.length){routineState.step=0;saveRoutine();}
  routineOpen(ROUTINE_STEPS[routineState.step].id);
}
export function renderRoutineCard(root){
  routineToday();
  const wrap=document.createElement("section");wrap.className="daily-routine-card";wrap.dataset.lessonView="today";
  const complete=routineState.step>=ROUTINE_STEPS.length;
  const current=ROUTINE_STEPS[Math.min(routineState.step,ROUTINE_STEPS.length-1)];
  wrap.innerHTML=`<div class='routine-top'><div><div class='routine-kicker'>🎯 10-MINUTE DAILY SPEAKING ROUTINE</div><div class='routine-title'>${complete?"Routine complete for today":"Step "+(routineState.step+1)+" of "+ROUTINE_STEPS.length+": "+current.title}</div></div><div class='routine-count'>${complete?`${ROUTINE_STEPS.length}/${ROUTINE_STEPS.length}`:`${routineState.step}/${ROUTINE_STEPS.length}`}</div></div><div class='routine-track'><span style='width:${Math.round(routineState.step/ROUTINE_STEPS.length*100)}%'></span></div>`;
  if(!complete){
    const step=lpEl("routine-current");step.innerHTML=`<span class='routine-current-icon'>${current.icon}</span><span><strong>${current.title}</strong><small>${current.sub}</small></span>`;
    const actions=lpEl("routine-actions");
    const open=document.createElement("button");open.type="button";open.className="lp-nav-btn primary";open.textContent="▶ Start routine step";open.onclick=()=>routineOpen(current.id);
    const done=document.createElement("button");done.type="button";done.className="lp-nav-btn";done.textContent="Skip / Mark done";done.onclick=routineComplete;
    actions.append(open,done);wrap.append(step,actions);
  }else{
    const replay=document.createElement("button");replay.type="button";replay.className="lp-nav-btn";replay.textContent="↻ Replay daily routine";replay.onclick=()=>{routineState.step=0;saveRoutine();routineOpen(ROUTINE_STEPS[0].id);};wrap.appendChild(replay);
  }
  root.appendChild(wrap);
}

export function renderProgressDashboard(root,done){
  const vocabCount=Object.keys((practiceStore&&practiceStore.vocab)||{}).length;
  const phraseCount=Object.keys((practiceStore&&practiceStore.phrases)||{}).length;
  const mastered=Object.values(srsStore||{}).filter(c=>(c.interval||0)>=SRS_INTERVALS.length).length;
  const rapid=getRrStats().attempts||0;
  const card=document.createElement("section");card.className="progress-dashboard compact-stats-card";card.dataset.lessonView="today";
  card.innerHTML=`<div class="progress-metrics"><div><strong>${done}/${LESSONS.length}</strong><small>lessons</small></div><div><strong>${vocabCount}</strong><small>words</small></div><div><strong>${phraseCount}</strong><small>phrases</small></div><div><strong>${mastered}</strong><small>mastered</small></div></div><details class="lesson-overview"><summary><span>ⓘ How the speaking path works</span><small>8-step core · ${rapid} rapid drills</small></summary><div class="lesson-flow">Recommended path: Start Here → Travel → Daily Life → Build Sentences → Speak Naturally<br>⚡ Speaking Core (8 steps): 🎯 Goal → 🧱 Frame → 🔑 Words → 🪜 Sentence Ladder → 💬 Dialogue → 🎭 Role-play → 🗣️ Speak Out Loud</div></details>`;
  root.appendChild(card);
}

export function buildQuizAuditReport(pool){
  const groups=new Map(),choiceIssues=[],missingFields=[],weakContext=[];
  pool.forEach((q,i)=>{
    const number=i+1,promptText=q.quizPrompt||q.prompt||q.es||"",promptKey=normalizeQuizPrompt(promptText),groupKey=promptKey+"|"+(q.kind||"vocab"),answers=quizAcceptedAnswers(q);
    if(!q.es||!q.tts||!answers.length)missingFields.push({number,detail:"missing Spanish, audio text, or intended answer"});
    if(promptKey){const group=groups.get(groupKey)||{prompt:promptText,items:[]};group.items.push({number,answers});groups.set(groupKey,group);}
    if(Array.isArray(q.choices)){
      const normalized=q.choices.map(normalizeQuizText),unique=new Set(normalized);
      if(q.choices.length!==4)choiceIssues.push({number,detail:"needs exactly four choices"});
      else if(unique.size!==normalized.length)choiceIssues.push({number,detail:"contains duplicate choices"});
      else if(!q.choices.some(choice=>quizAnswerMatches(q,choice)))choiceIssues.push({number,detail:"intended answer is not among the choices"});
    }
    if((q.kind==="reply"||q.kind==="tense")&&!q.quizPrompt)weakContext.push({number,prompt:promptText,detail:"add a situation or response instruction"});
    if(q.kind==="blank"&&!String(q.es||"").includes("___"))choiceIssues.push({number,detail:"blank question has no blank marker"});
  });
  const conflicting=[],duplicates=[];
  groups.forEach(group=>{
    if(group.items.length<2)return;
    const distinct=[...new Set(group.items.flatMap(item=>item.answers).map(normalizeQuizAnswer).filter(Boolean))];
    const itemSummary=group.items.map(item=>`#${item.number}: ${item.answers.join(" / ")}`).join(" · ");
    (distinct.length>1?conflicting:duplicates).push({prompt:group.prompt,summary:itemSummary});
  });
  return {pool,choiceIssues,missingFields,weakContext,conflicting,duplicates};
}
export function renderQuizAuditCard(root){
  const card=document.createElement("section");card.className="quiz-audit-card";card.dataset.lessonView="practice";
  card.innerHTML="<div class='quiz-audit-kicker'>🧪 QUIZ QUALITY CHECK</div><div class='quiz-audit-title'>Keep questions fair and unambiguous</div><p>Run this after adding quiz content. It checks structure and flags prompts that need a human meaning check. It never deletes questions.</p><button type='button' class='quiz-audit-btn'>Run quiz audit</button><div class='quiz-audit-result' aria-live='polite'></div>";
  card.querySelector(".quiz-audit-btn").onclick=()=>{
    const result=card.querySelector(".quiz-audit-result");
    const pool=typeof aQ!=="undefined"?aQ:[];const report=buildQuizAuditReport(pool);const seen=new Map(),duplicates=[],choiceIssues=report.choiceIssues.map(x=>x.number);
    pool.forEach((q,i)=>{
      const prompt=normalizeQuizPrompt(q.quizPrompt||q.es||q.prompt||"");
      const signature=normalizeQuizAnswer(q.en||q.answer||"")+"|"+(Array.isArray(q.choices)?q.choices.map(normalizeQuizAnswer).sort().join("/"):"");
      if(prompt){if(seen.has(prompt)){const prior=seen.get(prompt);if(prior.signature!==signature)duplicates.push({first:prior.index,second:i+1,prompt:q.quizPrompt||q.es||q.prompt||"",firstAnswer:prior.answer||"",secondAnswer:q.en||q.answer||""});}else seen.set(prompt,{index:i+1,signature,answer:q.en||q.answer||""});}
    });
    report.conflicting.forEach(x=>duplicates.push({first:"conflict",second:"",prompt:x.prompt,firstAnswer:x.summary,secondAnswer:"Possible multiple valid answers"}));
    const total=duplicates.length+choiceIssues.length+report.missingFields.length+report.weakContext.length;
    const structure=choiceIssues.length?`⚠️ ${choiceIssues.length} choice-structure issue${choiceIssues.length===1?"":"s"}`:`✅ No malformed choice sets in ${pool.length} questions`;
    const repeatNote=duplicates.length?`${duplicates.length} repeated or possible-conflict prompt${duplicates.length===1?"":"s"} listed for human review.`:"No repeated or conflicting prompts found.";
    result.innerHTML=`<strong>${structure}</strong><small>${repeatNote}</small><small>${report.weakContext.length} weak-context candidate${report.weakContext.length===1?"":"s"} · ${report.missingFields.length} missing-data item${report.missingFields.length===1?"":"s"}</small><em>A computer can find duplicates and malformed choices, but only a person can decide whether two natural replies both fit. Review candidates before publishing.</em>`;
    if(total){
      const detail=document.createElement("details");detail.className="quiz-audit-details";
      const summary=document.createElement("summary");summary.textContent="Show candidate list";detail.appendChild(summary);
      const list=document.createElement("div");list.className="quiz-audit-list";
      duplicates.slice(0,60).forEach(x=>{const row=document.createElement("div");row.innerHTML=`<strong>#${x.first} / #${x.second}</strong><span>${escapeVocabHtml(x.prompt)}</span><small>Answers: ${escapeVocabHtml(x.firstAnswer)} · ${escapeVocabHtml(x.secondAnswer)}</small>`;list.appendChild(row);});
      if(choiceIssues.length){const row=document.createElement("div");row.innerHTML=`<strong>Choice structure</strong><span>Question numbers: ${choiceIssues.join(", ")}</span><small>Check that each has four unique choices and exactly one intended answer.</small>`;list.appendChild(row);}
      report.weakContext.slice(0,60).forEach(x=>{const row=document.createElement("div");row.innerHTML=`<strong>#${x.number}</strong><span>${escapeVocabHtml(x.prompt)}</span><small>Needs clearer context: ${escapeVocabHtml(x.detail)}</small>`;list.appendChild(row);});
      report.missingFields.slice(0,60).forEach(x=>{const row=document.createElement("div");row.innerHTML=`<strong>#${x.number}</strong><span>Missing required quiz data</span><small>${escapeVocabHtml(x.detail)}</small>`;list.appendChild(row);});
      detail.appendChild(list);result.appendChild(detail);
    }
  };
  root.appendChild(card);
}

export function syncMissedQueueLauncher(){
  const missedChip=document.querySelector(".qv102-missed-btn");
  const count=storedMissedQuestionCount();
  if(missedChip){
    missedChip.textContent=`🎯 Missed (${count})`;
    missedChip.classList.toggle("active",!!appState.qMissedOnly);
    missedChip.setAttribute("aria-pressed",appState.qMissedOnly?"true":"false");
  }
  const host=document.getElementById("quiz-review-launch");if(!host)return;
  host.hidden=appState.qMissedOnly||count===0;
  if(host.hidden){host.innerHTML="";return;}
  host.innerHTML=`<span>🧠 <strong>${count} missed question${count===1?"":"s"}</strong> waiting for review</span><button type="button" class="quiz-review-launch-btn">Review missed →</button>`;
  const btn=host.querySelector("button");if(btn)btn.onclick=()=>actions.openMissedQueue();
}

const FOCUS_LESSON_SETS={
  all:null,
  sanjuan:["san-juan-guajira","cortesia-colombiana","trampas-colombianas","plata","casa","panaderia-jugos","almuerzo-corrientazo","verbos-comodin","citas-familia","puentes-rumba-cultura","empatia-reacciones","muletillas-diminutivos"],
  travel:["presentate","cortesia-colombiana","trampas-colombianas","aeropuerto-migracion","uber-ride","uber-completo","hotel-checkin","direcciones","direcciones-cuadras","seguridad-emergencias","bancos-pagos","panaderia-jugos","almuerzo-corrientazo","restaurante-real","mercado-negociar","farmacia"],
  daily:["presentate","cortesia-colombiana","casa","trabajo","oficina-real","cajero-sim-tramites","migracion-bancos-ce","porteria-domicilios","arriendo-airbnb","estratos-barrios","hogar-reparaciones","whatsapp-audios","barberia","viajes-finca"]
};
function renderModeFocusBar(root){
  const bar=document.createElement("section");bar.className="mode-focus-bar";bar.setAttribute("aria-label","Learning level and life focus");
  const curLvl=effectiveLevel();
  const lvlOpts=[["starter","🌱 Starter A0"],["explorer","🚀 Explorer A1–A2"],["fluent","🔥 Fluent Flow B1+"]];
  const focOpts=[["all","🌎 All"],["sanjuan","🪗 San Juan"],["travel","✈️ Travel & Food"],["daily","🏠 Daily CO"]];
  const lvlRow=document.createElement("div");lvlRow.className="mf-row";
  lvlOpts.forEach(([id,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="mf-pill"+(curLvl===id?" active":"");
    b.textContent=lbl;b.setAttribute("aria-pressed",curLvl===id?"true":"false");
    b.onclick=()=>{
      userPrefs.level=id;
      if(id==="fluent")userPrefs.blindEar=true;
      else if(id==="starter"&&userPrefs.blindEar)userPrefs.blindEar=false;
      saveUserPrefs();
      if(typeof actions.buildSpeakingGuide==="function")actions.buildSpeakingGuide();
      if(typeof actions.buildGram==="function"&&typeof GRAMMAR!=="undefined")actions.buildGram("presente",GRAMMAR.presente);
      renderLessons();
    };
    lvlRow.appendChild(b);
  });
  const focRow=document.createElement("div");focRow.className="mf-row mf-row-sub";
  focOpts.forEach(([id,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="mf-chip"+(userPrefs.focus===id?" active":"");
    b.textContent=lbl;b.setAttribute("aria-pressed",userPrefs.focus===id?"true":"false");
    b.onclick=()=>{userPrefs.focus=id;saveUserPrefs();renderLessons();};
    focRow.appendChild(b);
  });
  const earBtn=document.createElement("button");earBtn.type="button";
  const earOn=isBlindEarActive();
  earBtn.className="mf-chip blind-ear-chip"+(earOn?" active":"");
  earBtn.textContent=earOn?"🎧 Blind-Ear: ON":"🎧 Blind-Ear: OFF";
  earBtn.setAttribute("aria-pressed",earOn?"true":"false");
  earBtn.onclick=()=>{
    if(effectiveLevel()==="fluent"&&earOn){userPrefs.level="explorer";userPrefs.blindEar=false;}
    else{userPrefs.blindEar=!earOn;}
    saveUserPrefs();
    if(typeof actions.buildSpeakingGuide==="function")actions.buildSpeakingGuide();
    if(typeof actions.buildGram==="function"&&typeof GRAMMAR!=="undefined")actions.buildGram("presente",GRAMMAR.presente);
    renderLessons();
  };
  focRow.appendChild(earBtn);
  bar.append(lvlRow,focRow);root.appendChild(bar);
}
export function openStageTestOut(stage,stageLessons){
  const root=document.getElementById("lesson-list");if(!root)return;
  setLeccionesFocusMode(true);
  scrollAppTop();
  const poolItems=[];
  stageLessons.forEach(l=>{
    const c=typeof LESSON_CONTENT!=="undefined"&&LESSON_CONTENT[l.id];
    if(!c)return;
    const item=(c.examples&&c.examples[0])||c.goal;
    if(item&&item.es&&item.en)poolItems.push({lesson:l,es:item.es,en:item.en});
  });
  if(poolItems.length<2){openLesson(stageLessons[0]);return;}
  const stepN=Math.max(1,Math.floor(poolItems.length/5));
  const picks=[];
  for(let i=0;i<poolItems.length&&picks.length<5;i+=stepN)picks.push(poolItems[i]);
  for(let i=0;picks.length<Math.min(5,poolItems.length)&&i<poolItems.length;i++){
    if(!picks.includes(poolItems[i]))picks.push(poolItems[i]);
  }
  const allDistractors=LESSONS.map(l=>LESSON_CONTENT[l.id]&&((LESSON_CONTENT[l.id].examples&&LESSON_CONTENT[l.id].examples[0])||LESSON_CONTENT[l.id].goal)).filter(x=>x&&x.es&&x.en);
  const questions=picks.map((p,idx)=>{
    const askEsToEn=idx%2===0;
    const correct=askEsToEn?p.en:p.es;
    const seen=new Set([correct.toLowerCase()]);
    const wrong=[];
    for(const cand of allDistractors){
      if(wrong.length>=3)break;
      const val=askEsToEn?cand.en:cand.es;
      if(!val||seen.has(val.toLowerCase()))continue;
      seen.add(val.toLowerCase());wrong.push(val);
    }
    const opts=[correct,...wrong].sort(()=>Math.random()-0.5);
    return{title:p.lesson.title,prompt:askEsToEn?p.es:p.en,askEsToEn,tts:p.es,correct,opts};
  });
  let qi=0,score=0,answered=false;
  const passNeed=Math.min(questions.length,Math.max(3,Math.ceil(questions.length*0.8)));
  const renderTest=()=>{
    root.innerHTML="";
    const wrap=document.createElement("section");wrap.className="lp-wrap testout-card";
    const back=document.createElement("button");back.type="button";back.className="lp-back";back.textContent="‹ Back to Ruta";
    back.onclick=()=>{setLeccionesFocusMode(false);};
    wrap.appendChild(back);
    if(qi>=questions.length){
      const passed=score>=passNeed;
      if(passed){
        stageLessons.forEach(l=>{lessonProgress[l.id]=true;});
        saveLessons();
      }
      const res=document.createElement("div");res.className="testout-result";
      res.innerHTML=`<div class="testout-kicker">${passed?"🎉 STAGE TEST-OUT PASSED":"🧭 KEEP PRACTICING"}</div>
        <h3>${score}/${questions.length} Correct</h3>
        <p>${passed?`All ${stageLessons.length} lessons in <strong>${escapeVocabHtml(stage.name)}</strong> are now marked complete!`:`Score ${passNeed}/${questions.length} to test out and unlock the next stage faster.`}</p>
        <div class="testout-acts"></div>`;
      const acts=res.querySelector(".testout-acts");
      if(passed){
        const cont=document.createElement("button");cont.type="button";cont.className="lp-nav-btn primary";cont.textContent="Continue to Next Stage →";
        cont.onclick=()=>{setLeccionesFocusMode(false);};
        acts.appendChild(cont);
      }else{
        const retry=document.createElement("button");retry.type="button";retry.className="lp-nav-btn primary";retry.textContent="🔄 Retry Test-Out";
        retry.onclick=()=>openStageTestOut(stage,stageLessons);
        const startL=document.createElement("button");startL.type="button";startL.className="lp-nav-btn";startL.textContent="Start Lesson 1 →";
        startL.onclick=()=>openLesson(stageLessons[0]);
        acts.append(retry,startL);
      }
      wrap.appendChild(res);root.appendChild(wrap);return;
    }
    const q=questions[qi];answered=false;
    const card=document.createElement("div");card.className="lp-card";
    card.innerHTML=`<div class="lp-kicker">⚡ STAGE TEST-OUT · ${qi+1} OF ${questions.length} (NEED ${passNeed})</div>
      <div class="lp-step-sub">${escapeVocabHtml(stage.name)} · ${escapeVocabHtml(q.title)}</div>
      <div class="testout-prompt">${escapeVocabHtml(q.prompt)}</div>
      ${q.askEsToEn?'<button type="button" class="lp-nav-btn testout-hear">🔊 Listen</button>':""}
      <div class="testout-opts"></div>
      <div class="testout-fb" aria-live="polite"></div>
      <div class="testout-next-row"></div>`;
    if(q.askEsToEn){
      card.querySelector(".testout-hear").onclick=()=>speak(q.tts,0.75);
    }
    const optsWrap=card.querySelector(".testout-opts"),fb=card.querySelector(".testout-fb"),nextRow=card.querySelector(".testout-next-row");
    q.opts.forEach(opt=>{
      const b=document.createElement("button");b.type="button";b.className="qopt testout-opt";b.textContent=opt;
      b.onclick=()=>{
        if(answered)return;
        answered=true;
        const ok=opt===q.correct;
        if(ok){score++;b.classList.add("correct");}
        else{
          b.classList.add("wrong");
          optsWrap.querySelectorAll("button").forEach(x=>{if(x.textContent===q.correct)x.classList.add("reveal");});
        }
        fb.textContent=ok?"✅ ¡Correcto!":`❌ Correct answer: ${q.correct}`;
        fb.className="testout-fb "+(ok?"ok":"warn");
        speak(q.tts,0.75);
        const nxt=document.createElement("button");nxt.type="button";nxt.className="lp-nav-btn primary";
        nxt.textContent=qi+1<questions.length?"Next question →":"See Test-Out Result →";
        nxt.onclick=()=>{qi++;renderTest();};
        nextRow.appendChild(nxt);
      };
      optsWrap.appendChild(b);
    });
    wrap.appendChild(card);root.appendChild(wrap);
  };
  renderTest();
}

const WELCOME_DISMISS_KEY="esco-v100-welcome-dismissed";
export function renderLessons(){
  const root=document.getElementById("lesson-list");if(!root)return;
  if(appState.lpLesson){renderLessonStep();return;}
  setLeccionesFocusMode(false);
  root.innerHTML="";
  buildLessonViewTabs(root);
  renderModeFocusBar(root);
  const done=LESSONS.filter(x=>lessonProgress[x.id]).length;
  const percent=LESSONS.length?done/LESSONS.length:0;
  const lvlMode=effectiveLevel();
  let welcomeDismissed=false;
  try{welcomeDismissed=appStorage.getItem(WELCOME_DISMISS_KEY)==="1";}catch(e){}
  const pathLevel=percent<0.16?"A0 · Foundations":percent<0.38?"A1 · Everyday basics":percent<0.68?"A2 · Connected speech":"B1 · Conversational";
  const resume=loadResume();
  const resLesson=resume&&LESSONS.find(l=>l.id===resume.id);
  const focusIds=FOCUS_LESSON_SETS[userPrefs.focus];
  const focusedNext=focusIds?focusIds.map(id=>LESSONS.find(l=>l.id===id)).find(l=>l&&!lessonProgress[l.id]):null;
  const nextLesson=focusedNext||LESSONS.find(l=>!lessonProgress[l.id]);

  /* 1. Unified Hero Card — Status + Primary Lesson CTA + 1-Tap Session Launchers */
  const hero=document.createElement("section");hero.className="today-hero-card";hero.dataset.lessonView="today";
  hero.innerHTML=`<div class="today-hero-status"><span class="hero-pill streak">🔥 ${dayInfo.streak}d streak</span><span class="hero-pill level">🧭 ${pathLevel}</span><span class="hero-pill count">${done}/${LESSONS.length} lessons · ~4 min</span></div><div class="lesson-progress"><span style="width:${Math.round(percent*100)}%"></span></div>`;

  const primaryLesson=(resLesson&&!lessonProgress[resLesson.id]&&(!focusIds||focusIds.includes(resLesson.id)))?resLesson:(nextLesson||LESSONS[0]);
  const isResuming=!!(resLesson&&primaryLesson.id===resLesson.id&&!lessonProgress[resLesson.id]);
  const focusTag=userPrefs.focus==="sanjuan"?"🪗 SAN JUAN":userPrefs.focus==="travel"?"✈️ TRAVEL & FOOD":userPrefs.focus==="daily"?"🏠 DAILY CO":"";
  const heroCta=document.createElement("button");heroCta.type="button";heroCta.className="today-hero-cta";
  heroCta.innerHTML=`<div class="today-hero-cta-icon">${primaryLesson.icon||"🎓"}</div><div class="today-hero-cta-copy"><span class="today-hero-cta-kicker">${isResuming?`▶️ CONTINUE · STEP ${(resume.step|0)+1}`:(done===0?"🚀 START HERE · LESSON 1":`🎓 NEXT LESSON${focusTag?" · "+focusTag:""}`)}</span><strong>${escapeVocabHtml(primaryLesson.title)}</strong><small>${escapeVocabHtml(primaryLesson.sub)}</small></div><div class="today-hero-cta-badge">${isResuming?"Resume →":"Start →"}</div>`;
  heroCta.onclick=()=>{if(isResuming)openLessonAt(resLesson,resume.step,resume.qi,resume.score);else openLesson(primaryLesson);};
  hero.appendChild(heroCta);const flowBtn=document.createElement("button");flowBtn.type="button";flowBtn.className="daily-flow-cta";flowBtn.innerHTML=`<span class="df-cta-icon">⚡</span><span class="df-cta-copy"><strong>Today’s 5-Min Mixed Flow</strong><small>Due SRS · Pictures · Local Fixes · Street Ear (8 cards)</small></span><span class="df-cta-badge">Mix →</span>`;flowBtn.onclick=()=>{if(typeof actions.openDailyFlowSession==="function")actions.openDailyFlowSession();};hero.appendChild(flowBtn);

  if(lvlMode==="starter"&&done<3){
    const soundBtn=document.createElement("button");soundBtn.type="button";soundBtn.className="starter-sound-btn";
    soundBtn.innerHTML=`<span>🔤 <strong>2-Min Sound Basics</strong> <small>A·E·I·O·U · Silent H · Ñ · RR</small></span><span>Start →</span>`;
    soundBtn.onclick=()=>{showPage("fonetica");actions.showPhonetic("letters");};
    hero.appendChild(soundBtn);
  }else{
    const expRow=document.createElement("div");expRow.className="explorer-shortcut-row";
    const vvShortcut=document.createElement("button");vvShortcut.type="button";vvShortcut.className="starter-sound-btn explorer-vv-btn";
    vvShortcut.innerHTML=`<span>⚡ <strong>1-Verb → 5 Times</strong> <small>${typeof VERB_VERSATILITY_ENGINE!=="undefined"?VERB_VERSATILITY_ENGINE.length:10} verbs × 5 frames</small></span><span>Go →</span>`;
    vvShortcut.onclick=()=>{showPage("gram");actions.showGramGroup("tiempos");};
    const stShortcut=document.createElement("button");stShortcut.type="button";stShortcut.className="starter-sound-btn explorer-story-btn";
    stShortcut.innerHTML=`<span>📖 <strong>Story Builder</strong> <small>Chain 3 real turns</small></span><span>Build →</span>`;
    stShortcut.onclick=()=>{showPage("frases");if(typeof actions.renderFraseMenu==="function")actions.renderFraseMenu();const card=document.querySelector(".story-builder-card");if(card)card.scrollIntoView({behavior:"smooth",block:"start"});};
    const pmShortcut=document.createElement("button");pmShortcut.type="button";pmShortcut.className="starter-sound-btn explorer-pm-btn";
    pmShortcut.innerHTML=`<span>🖼️ <strong>Picture Match (${typeof PICTURE_MATCH_BANK!=="undefined"?PICTURE_MATCH_BANK.length:20})</strong> <small>Word &amp; audio → photo</small></span><span>Play →</span>`;
    pmShortcut.onclick=()=>{showPage("quiz");if(typeof actions.openQuizV102Tab==="function")actions.openQuizV102Tab("picture");};
    const spShortcut=document.createElement("button");spShortcut.type="button";spShortcut.className="starter-sound-btn explorer-sp-btn";
    spShortcut.innerHTML=`<span>⏱️ <strong>60s Sprint</strong> <small>Fast recall mix</small></span><span>Go →</span>`;
    spShortcut.onclick=()=>{showPage("quiz");if(typeof actions.openQuizV102Tab==="function")actions.openQuizV102Tab("sprint");};
    const chatShortcut=document.createElement("button");chatShortcut.type="button";chatShortcut.className="starter-sound-btn explorer-chats-btn";chatShortcut.innerHTML=`<span>💬 <strong>Colombia Chats (${typeof COLOMBIA_CHATS!=="undefined"?COLOMBIA_CHATS.length:6})</strong> <small>4-turn WhatsApp-style roleplays · Natural vs. stiff</small></span><span>Chat →</span>`;chatShortcut.onclick=()=>{showPage("frases");if(typeof actions.renderFraseMenu==="function")actions.renderFraseMenu();const card=document.querySelector(".colombia-chats-card");if(card)card.scrollIntoView({behavior:"smooth",block:"start"});};expRow.append(vvShortcut,stShortcut,pmShortcut,spShortcut,chatShortcut);
    hero.appendChild(expRow);
  }

  root.appendChild(hero);

  if(!welcomeDismissed){
    const wCard=document.createElement("section");wCard.className="welcome-lane-card";wCard.dataset.lessonView="today";
    wCard.innerHTML=`<div class="welcome-lane-head"><span>🧭 <strong>Pick your starting lane</strong> <small>(you can switch anytime above)</small></span><button type="button" class="welcome-lane-close" aria-label="Dismiss welcome card">×</button></div><div class="welcome-lane-btns"></div>`;
    const wClose=wCard.querySelector(".welcome-lane-close");
    const dismissWelcome=(targetView)=>{try{appStorage.setItem(WELCOME_DISMISS_KEY,"1");}catch(e){}renderLessons();if(targetView)setLessonView(targetView);};
    wClose.onclick=()=>{dismissWelcome();};
    const wBtns=wCard.querySelector(".welcome-lane-btns");
    [
      ["🌱 Brand new (A0)","Show Sound Basics & keep extra tools tucked away",()=>{userPrefs.level="starter";userPrefs.blindEar=false;saveUserPrefs();dismissWelcome();}],
      ["🚀 Know basics (A1–A2)","Keep all drills open & unlock 5Q Stage Test-Outs",()=>{userPrefs.level="explorer";saveUserPrefs();dismissWelcome("path");}],
      ["🔥 Wanna flow (B1+)","Turn on Blind-Ear listening challenge right away",()=>{userPrefs.level="fluent";userPrefs.blindEar=true;saveUserPrefs();dismissWelcome();}]
    ].forEach(([title,sub,fn])=>{
      const b=document.createElement("button");b.type="button";b.className="welcome-lane-btn";
      b.innerHTML=`<strong>${title}</strong><small>${sub}</small>`;
      b.onclick=fn;wBtns.appendChild(b);
    });
    root.appendChild(wCard);
  }

  /* 2. Guided 10-Min Daily Speaking Routine directly below Hero */
  renderRoutineCard(root);

  /* 3. Clean 2x2 Quick Speaking Grid */
  const dueHome=srsDueCount();
  const missedHome=storedMissedQuestionCount();
  const quickGrid=document.createElement("section");quickGrid.className="today-quick-grid";quickGrid.dataset.lessonView="today";
  [
    ["🎰","Slot-Swapper",`${typeof SLOT_SWAP_MATRICES!=="undefined"?SLOT_SWAP_MATRICES.length:9} sentence builders`,()=>renderFramePractice(false)],
    ["⚡","Reacción Rápida",`${RR_BANK.length} audio reflexes`,()=>{resetRrSession();renderRapida(false);}],
    ["🔁","Review Cards",dueHome?`${dueHome} due today`:"Spaced repetition",()=>actions.openReviewSession()],
    ["🧠","Missed Queue",missedHome?`${missedHome} waiting`:"All clear ✓",()=>{if(missedHome)actions.openMissedQueue();else actions.openReviewSession();}]
  ].forEach(([icon,title,sub,fn])=>{
    const tile=document.createElement("button");tile.type="button";tile.className="today-quick-tile";
    tile.innerHTML=`<span class="today-quick-icon">${icon}</span><span class="today-quick-copy"><strong>${title}</strong><small>${sub}</small></span>`;
    tile.onclick=fn;
    quickGrid.appendChild(tile);
  });

  /* 3b. Smart Coach Focus Strip ("Enfoque de Hoy · 60s Warm-Up") */
  const focusStrip=document.createElement("section");focusStrip.className="coach-focus-strip";focusStrip.dataset.lessonView="today";
  const savedEntries=Object.values(speakingErrors||{}).sort((a,b)=>((b.starred?1:0)-(a.starred?1:0))||((b.last||0)-(a.last||0)));
  const coachPools={
    starter:[
      {text:"Mucho gusto, me llamo Seth.",en:"Nice to meet you, my name is Seth.",source:"👋 First Greeting"},
      {text:"Buenos días, ¿cómo está?",en:"Good morning, how are you?",source:"☀️ Polite Hello"},
      {text:"¿Me regala un tinto, por favor?",en:"Could I have a black coffee, please?",source:"☕ Ordering"},
      {text:"Más despacio, por favor.",en:"Slower, please.",source:"🛟 Survival"},
      {text:"¿Cuánto cuesta esto?",en:"How much does this cost?",source:"💵 Shopping"}
    ],
    sanjuan:[
      {text:"¡Ajá primo! ¿Todo bien por San Juan?",en:"Hey cousin! All good in San Juan?",source:"🪗 San Juan"},
      {text:"Hoy hace un calor sabroso, vamos por una fría.",en:"Great warm day today, let's grab a cold beer.",source:"🌴 La Guajira"},
      {text:"¿Qué hubo compa, cómo amaneció la familia?",en:"What's up buddy, how's the family this morning?",source:"👨‍👩‍👧 Familia"},
      {text:"¡Qué nota ese vallenato de Diomedes!",en:"That Diomedes vallenato song is awesome!",source:"🎶 Vallenato"}
    ],
    travel:[
      {text:"Con tarjeta de crédito, a una sola cuota, por favor.",en:"By credit card, single payment, please.",source:"💳 Pagos"},
      {text:"¿El jugo de lulo me lo da en agua y bajito de azúcar?",en:"Lulo juice in water, light on sugar please?",source:"🍹 Jugos"},
      {text:"¿Me deja en la carrera séptima con calle setenta y dos?",en:"Drop me at Carrera 7 with Calle 72?",source:"🚕 Uber/Taxi"},
      {text:"Veci, ¿me regala un pandebono calientico y un perico?",en:"Neighbor, a warm pandebono and milk coffee please?",source:"🥐 Panadería"}
    ],
    daily:[
      {text:"Buenas, en portería dejaron un domicilio para el 402.",en:"Hi, delivery was left at front desk for apt 402.",source:"🏢 Portería"},
      {text:"Hágale pues, ahorita le mando un audio por WhatsApp.",en:"For sure, I'll send you a WhatsApp voice note soon.",source:"📱 WhatsApp"},
      {text:"¿Me hace un degradado bajito a los lados, por favor?",en:"Low fade on the sides, please?",source:"💈 Barbería"},
      {text:"¡No me digas! ¡Uy, qué embarrada contigo!",en:"No way! Oh man, I'm so sorry about that!",source:"💛 Empatía"}
    ]
  };
  const activePool=(lvlMode==="starter"&&userPrefs.focus==="all")?coachPools.starter:(coachPools[userPrefs.focus]||coachPools.travel);
  const dayOff=frameDayNumber()%activePool.length;
  const focusPicks=lvlMode==="starter"?[]:savedEntries.slice(0,2);
  for(let i=0;focusPicks.length<3&&i<activePool.length;i++){
    const cand=activePool[(dayOff+i)%activePool.length];
    if(!focusPicks.some(x=>x.text===cand.text))focusPicks.push(cand);
  }
  const blindEarOn=isBlindEarActive();
  const blindRevealed=new Set();
  let coachPlayIdx=0;
  focusStrip.innerHTML=`<div class="coach-focus-head"><div><span class="coach-focus-kicker">🎯 ENFOQUE DE HOY · ${blindEarOn?"BLIND-EAR WARM-UP":"60s WARM-UP"}</span><strong>${blindEarOn?"Listen first — tap each card to hear & reveal":"Say these 3 expressions out loud right now"}</strong></div><button type="button" class="coach-focus-playall">🔊 Play 1/3</button></div><div class="coach-focus-chips"></div>`;
  const playAllBtn=focusStrip.querySelector(".coach-focus-playall");
  const chipsWrap=focusStrip.querySelector(".coach-focus-chips");
  const renderFocusChips=()=>{
    chipsWrap.innerHTML="";
    focusPicks.forEach((item,idx)=>{
      const hiddenNow=blindEarOn&&!blindRevealed.has(item.text);
      const chip=document.createElement("button");chip.type="button";chip.className="coach-focus-chip"+(hiddenNow?" blind-masked":"");
      const subEn=(lvlMode==="starter"&&item.en&&!hiddenNow)?`<small class="coach-chip-en">${escapeVocabHtml(item.en)}</small>`:"";
      chip.innerHTML=`<span class="coach-chip-tag">${item.starred?"⭐ Pinned":escapeVocabHtml(item.source||"Coach pick")}</span><strong>${hiddenNow?`🎧 Listen #${idx+1} (tap to hear & reveal)`:escapeVocabHtml(item.text)}</strong>${subEn}<span class="coach-chip-spk">🔊</span>`;
      chip.onclick=()=>{
        markPractice("phrases",item.text);
        speak(item.text,lvlMode==="starter"?0.65:0.78);
        if(blindEarOn&&!blindRevealed.has(item.text)){blindRevealed.add(item.text);renderFocusChips();}
      };
      chipsWrap.appendChild(chip);
    });
  };
  renderFocusChips();
  playAllBtn.onclick=()=>{
    const cur=focusPicks[coachPlayIdx%focusPicks.length];
    speak(cur.text,lvlMode==="starter"?0.65:0.78);
    if(blindEarOn){blindRevealed.add(cur.text);renderFocusChips();}
    coachPlayIdx=(coachPlayIdx+1)%focusPicks.length;
    playAllBtn.textContent=`🔊 Next (${coachPlayIdx+1}/${focusPicks.length})`;
  };
  root.appendChild(focusStrip);

  /* 3c. Global App Finder across Lessons, Phrases, Vocab & Visual Guides */
  const foldFinder=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const runGlobalFinder=raw=>{
    const q=foldFinder(raw).trim();
    if(q.length<2)return [];
    const hits=[];
    LESSONS.forEach((l,li)=>{
      if(foldFinder(`${l.title} ${l.sub} ${l.enSub||""} ${l.id} ${l.vocab}`).includes(q)){
        hits.push({kind:"Lesson",ico:l.icon||"📚",title:`#${li+1} ${l.title}`,sub:l.enSub||l.sub,go:()=>openLesson(l)});
      }
    });
    FRASES.forEach((sec,si)=>{
      const matchSec=foldFinder(sec.section).includes(q);
      const matchItem=(sec.items||[]).find(it=>foldFinder(`${it.es} ${it.en}`).includes(q));
      if(matchSec||matchItem){
        hits.push({kind:"Phrases",ico:"💬",title:sec.section,sub:matchItem?`${matchItem.es} — ${matchItem.en}`:`${(sec.items||[]).length} expressions`,go:()=>{showPage("frases");actions.renderFraseSection(si);}});
      }
    });
    VC.forEach(cat=>{
      const matchCat=foldFinder(`${cat.label} ${cat.id}`).includes(q);
      let matchItem=(cat.items||[]).find(it=>foldFinder(`${it.word||it.es||""} ${it.en||""}`).includes(q));
      if(!matchItem&&cat.id==="colombianismos"&&typeof COLOMBIANISMOS!=="undefined"){
        matchItem=COLOMBIANISMOS.find(it=>foldFinder(`${it.word||""} ${it.en||""}`).includes(q));
      }
      if(matchCat||matchItem){
        hits.push({kind:"Vocab",ico:"🗂️",title:cat.label,sub:matchItem?`${matchItem.word||matchItem.es} — ${matchItem.en}`:"Vocabulary flashcards",go:()=>{showPage("vocab");actions.sCat(cat.id);}});
      }
    });
    Object.entries(VERBS||{}).forEach(([k,v])=>{
      const conj=[...(v.present||[]),...(v.past||[])].map(r=>r.v).join(" ");
      const fam=(v.family||[]).map(f=>`${f.f} ${f.e}`).join(" ");
      const kf=foldFinder(k);
      if(foldFinder(`${k} ${v.en} ${v.type} ${v.example?.es||""} ${v.example?.en||""} ${conj} ${fam}`).includes(q)){
        const boost=kf===q?100:kf.startsWith(q)?50:0;
        hits.push({_s:boost,kind:"Verb",ico:v.icon||"⚡",title:`${k} — ${v.en}`,sub:`${v.type} · ${v.example?.es||""}`,go:()=>{showPage("vocab");actions.openVerbByKey(k);}});
      }
    });
    (PHRASE_DIALOGUES||[]).forEach(d=>{
      const linesText=(d.versions||[]).flatMap(v=>v.lines||[]).map(l=>`${l.es} ${l.en}`).join(" ");
      if(foldFinder(`${d.title} ${d.sub||""} ${linesText}`).includes(q)){
        hits.push({_s:foldFinder(d.title).includes(q)?25:0,kind:"Dialogue",ico:d.icon||"🗣️",title:d.title,sub:d.sub||"Interactive roleplay dialogue",go:()=>{showPage("frases");actions.renderFraseDialogue(d);}});
      }
    });
    (GRINGO_TRAPS||[]).forEach((g,gi)=>{
      if(foldFinder(`${g.intent} ${g.trap} ${g.local} ${g.why||""}`).includes(q)){
        hits.push({_s:foldFinder(g.trap).includes(q)||foldFinder(g.local).includes(q)?30:0,kind:"Trap Fix",ico:"🚧",title:g.local,sub:`Avoid: ${g.trap} · ${g.intent}`,go:()=>{showPage("frases");const card=document.querySelector(".gringo-trap-card");if(card){card.dispatchEvent(new CustomEvent("gt-jump",{detail:gi}));card.scrollIntoView({behavior:"smooth",block:"start"});}}});
      }
    });
    (COLOMBIAN_STORIES||[]).forEach((st,si)=>{
      const partsText=(st.parts||[]).flatMap(p=>p.options||[]).map(o=>`${o.es} ${o.en}`).join(" ");
      if(foldFinder(`${st.title} ${st.sub||""} ${partsText}`).includes(q)){
        hits.push({_s:foldFinder(st.title).includes(q)?20:0,kind:"Story",ico:"📖",title:st.title,sub:st.sub||"3-part Colombian story",go:()=>{showPage("frases");const tabs=document.querySelectorAll(".story-builder-card .story-tabs .reg-tab-btn");if(tabs[si])tabs[si].click();const card=document.querySelector(".story-builder-card");if(card)card.scrollIntoView({behavior:"smooth",block:"start"});}});
      }
    });
    (VISUAL_GUIDES||[]).forEach(vg=>{
      if(foldFinder(`${vg.title} ${vg.sub} ${vg.region||""} ${vg.es||""} ${vg.en||""}`).includes(q)){
        hits.push({kind:"Poster",ico:"🖼️",title:vg.title,sub:vg.sub||vg.en,go:()=>{showPage("gram");actions.showGramGroup("posters");}});
      }
    });
    return hits.sort((a,b)=>(b._s||0)-(a._s||0)).slice(0,10);
  };
  const finderCard=document.createElement("section");finderCard.className="global-finder-card";finderCard.dataset.lessonView="today";
  finderCard.innerHTML=`<div class="global-finder-head"><strong>🔎 Global Finder</strong><small>Search lessons, verbs, dialogues, traps &amp; posters</small></div>
    <div class="global-finder-bar"><input type="search" class="global-finder-input" placeholder="Try: airport, Nequi, poner, taxi, trap, slang…" aria-label="Search across lessons, verbs, dialogues, traps, vocabulary, and guides"/></div>
    <div class="global-finder-chips"></div>
    <div class="global-finder-results" aria-live="polite"></div>`;
  const fInput=finderCard.querySelector(".global-finder-input");
  const fChips=finderCard.querySelector(".global-finder-chips");
  const fRes=finderCard.querySelector(".global-finder-results");
  const renderFinder=val=>{
    const q=String(val||"").trim();
    fRes.innerHTML="";
    if(q.length<2)return;
    const rows=runGlobalFinder(q);
    if(!rows.length){
      const empty=document.createElement("div");empty.className="global-finder-empty";
      empty.textContent=`No matches for "${q}" — try English or Spanish keywords like "uber", "nequi", or "familia".`;
      fRes.appendChild(empty);
      return;
    }
    rows.forEach(r=>{
      const btn=document.createElement("button");btn.type="button";btn.className="global-finder-hit";
      btn.innerHTML=`<span class="gf-hit-ico">${r.ico}</span><span class="gf-hit-copy"><strong>${escapeVocabHtml(r.title)}</strong><small>${escapeVocabHtml(r.sub||"")}</small></span><span class="gf-hit-badge">${escapeVocabHtml(r.kind)}</span>`;
      btn.onclick=r.go;
      fRes.appendChild(btn);
    });
  };
  [["🚕 Uber","uber"],["☕ Bakery","panaderia"],["💳 Nequi","nequi"],["💊 Pharmacy","farmacia"],["❤️ Family","familia"]].forEach(([lbl,term])=>{
    const c=document.createElement("button");c.type="button";c.className="mf-chip";c.textContent=lbl;
    c.onclick=()=>{fInput.value=term;renderFinder(term);};
    fChips.appendChild(c);
  });
  fInput.oninput=()=>renderFinder(fInput.value);
  root.appendChild(finderCard);

  /* 4. Compact Stats + Secondary Practice Grid (collapsed for brand-new Starter learners) */
  if(lvlMode==="starter"&&done<3){
    const moreWrap=document.createElement("details");moreWrap.className="starter-more-tools";moreWrap.dataset.lessonView="today";
    moreWrap.innerHTML="<summary><span>🧰 More drills, stats &amp; error journal</span><small>Slot-Swapper · Review Cards</small></summary>";
    moreWrap.appendChild(quickGrid);
    renderProgressDashboard(moreWrap,done);
    renderSpeakingErrorJournal(moreWrap);
    root.appendChild(moreWrap);
  }else{
    root.appendChild(quickGrid);
    renderProgressDashboard(root,done);
    renderSpeakingErrorJournal(root);
  }
  /* Daily practice — one compact row (v22) */
  const daily=document.createElement("div");daily.className="daily-row";daily.dataset.lessonView="practice";
  const dr1=document.createElement("button");dr1.type="button";dr1.className="daily-card";
  dr1.innerHTML=`<div class="daily-icon">⚡</div><div class="daily-title">Rápida</div><div class="daily-sub">${RR_BANK.length} questions · answer under pressure</div>`;
  dr1.onclick=()=>{resetRrSession();renderRapida(false);};
  const dr2=document.createElement("button");dr2.type="button";dr2.className="daily-card";
  dr2.innerHTML="<div class='daily-icon'>💬</div><div class='daily-title'>Shadow a dialogue</div><div class='daily-sub'>Listen · hide a side · speak</div>";
  dr2.onclick=()=>{
    showPage("frases");
    const candidates=PHRASE_DIALOGUES.filter(d=>/Uber|direcciones|taxi|transporte|farmacia|restaurante/i.test(d.title));
    const d=(candidates.length?candidates:PHRASE_DIALOGUES)[frameDayNumber()%(candidates.length||PHRASE_DIALOGUES.length)];
    appState.fraseReturnToLessons=true;actions.renderFraseDialogue(d);
  };
  daily.appendChild(dr1);daily.appendChild(dr2);
  root.appendChild(daily);

  const missionLabel=document.createElement("div");missionLabel.className="fr-home-label";missionLabel.dataset.lessonView="practice";missionLabel.textContent=`🗣️ Conversation missions · ${Object.keys(missionProgress).length}/${CONVERSATION_MISSIONS.length} completed`;root.appendChild(missionLabel);
  const missionGrid=document.createElement("div");missionGrid.className="mission-grid";missionGrid.dataset.lessonView="practice";
  CONVERSATION_MISSIONS.forEach(m=>{const b=document.createElement("button");b.type="button";b.className="mission-home-card";b.innerHTML=`<span class="mission-home-icon">${missionProgress[m.id]?"✅":"🗣️"}</span><span class="mission-home-copy"><strong>${m.title}</strong><small>${m.scenario}</small></span>`;b.onclick=()=>renderMission(m);missionGrid.appendChild(b);});
  root.appendChild(missionGrid);

  const readingLabel=document.createElement("div");readingLabel.className="fr-home-label";readingLabel.dataset.lessonView="practice";readingLabel.textContent=`📖 Lecturas · ${Object.keys(readingProgress).length}/${READINGS.length} completed`;root.appendChild(readingLabel);
  const readingGrid=document.createElement("div");readingGrid.className="reading-home-grid";readingGrid.dataset.lessonView="practice";
  READINGS.forEach(reading=>{const b=document.createElement("button");b.type="button";b.className="reading-home-card";b.innerHTML=`<span class='reading-home-icon'>${readingProgress[reading.id]?"✅":"📖"}</span><span><strong>${reading.title}</strong><small>${reading.level} · ${reading.intro}</small></span><span>›</span>`;b.onclick=()=>renderReading(reading);readingGrid.appendChild(b);});
  root.appendChild(readingGrid);

  /* Lessons grouped into a speaking-first progression */
  const LESSON_STAGES=[
    {name:"🌱 Stage 1 · Start Here",sub:"Greetings, Colombian politeness, false-friend traps (cancelar/provocar), numbers, and repairing misunderstandings.",ids:["presentate","cortesia-colombiana","trampas-colombianas","plata","survival-communication","casa","gustos"]},
    {name:"🧭 Stage 2 · Travel and Survival",sub:"Airport, Uber, street safety (no dar papaya & 123), corrientazo lunches, panaderías & jugos, hotels, Nequi, restaurants, markets, dental/optical, and medical care.",ids:["aeropuerto-migracion","uber-ride","uber-completo","hotel-checkin","calle","direcciones","direcciones-cuadras","seguridad-emergencias","bancos-pagos","panaderia-jugos","almuerzo-corrientazo","cocina","restaurante-real","mercado-negociar","commands-repair","farmacia","medico-urgencias","odontologia-optica"]},
    {name:"🏠 Stage 3 · Daily Life",sub:"Migración & Cédula de Extranjería, ATMs & SIM cards, estratos & conjuntos, home repairs & utilities, Airbnb, WhatsApp, portería, office, barbershop, and finca trips.",ids:["trabajo","oficina-real","cajero-sim-tramites","migracion-bancos-ce","porteria-domicilios","arriendo-airbnb","estratos-barrios","hogar-reparaciones","whatsapp-audios","barberia","viajes-finca","daily-repair","planes","gerundios-actividades","sentirse"]},
    {name:"🧱 Stage 4 · Build Sentences",sub:"Present, future, past, contrast, perfect tenses, conditional, action chunks, connectors, and pronouns.",ids:["sentence-structure","action-chunks","connectors-v36","function-words","gram-presente","gram-futuro","gram-pasado","gram-pasado-historia","gram-pasado-contraste","gram-perfecto","gram-condicional","gram-pasado-perfecto","gram-futuro-perfecto","gram-subjuntivo","gram-necesidades","gram-conectores","gram-pronombres"]},
    {name:"🇨🇴 Stage 5 · Speak More Naturally",sub:"San Juan del Cesar & La Guajira (vallenato & family), Colombian wildcard verbs, dating & family, fútbol & conciertos, puentes & salsa, empathy, and diminutives.",ids:["san-juan-guajira","colombia","verbos-comodin","citas-familia","eventos-futbol-cultura","puentes-rumba-cultura","empatia-reacciones","muletillas-diminutivos","social-colombia-v36","gym-ciclovia","social-salida","fiesta-gathering","deportes-partido","gram-groserias"]},
    {name:"🎯 Stage 6 · Conversation Challenge",sub:"Read aloud, react quickly, and complete real speaking missions.",ids:["conversation-challenge"]}
  ];
  const roadmap=lpEl("lesson-roadmap");
  roadmap.dataset.lessonView="path";
  const pathSearch=document.createElement("input");pathSearch.type="search";pathSearch.className="content-search lesson-path-search";pathSearch.placeholder=`🔎 Search ${LESSONS.length} lessons (e.g. Uber, Nequi, pasado, barbería…)`;pathSearch.setAttribute("aria-label","Search lessons");
  roadmap.appendChild(pathSearch);
  const roadmapRow=lpEl("lesson-roadmap-row");
  LESSON_STAGES.forEach((stage,i)=>{const b=document.createElement("button");b.type="button";b.className="lesson-roadmap-btn";b.textContent=stage.name.replace(/^.*?Stage /,"Stage ");b.onclick=()=>{const target=document.getElementById("lesson-stage-"+i);if(target){target.open=true;target.scrollIntoView({behavior:"smooth",block:"start"});}};roadmapRow.appendChild(b);});
  roadmap.appendChild(roadmapRow);root.appendChild(roadmap);
  pathSearch.oninput=()=>{
    const q=pathSearch.value.trim().toLowerCase();
    root.querySelectorAll(".lesson-stage").forEach(st=>{
      let matchesInStage=0;
      st.querySelectorAll(".lesson-card").forEach(card=>{
        const hit=!q||card.textContent.toLowerCase().includes(q);
        card.style.display=hit?"":"none";
        if(hit)matchesInStage++;
      });
      st.style.display=(!q||matchesInStage>0)?"":"none";
      if(q&&matchesInStage>0)st.open=true;
    });
  };
  const tenseRoadmap=document.createElement("details");tenseRoadmap.className="tense-roadmap tense-roadmap-fold";tenseRoadmap.dataset.lessonView="path";
  tenseRoadmap.innerHTML="<summary class='tense-roadmap-summary'><span>🧭 <strong>Speaking Tense Roadmap</strong> <small>8 layers from Presente to Future Perfect</small></span><span class='tense-roadmap-chev'>⌄</span></summary><div class='tense-roadmap-body'><p>Learn the high-frequency patterns first, then add detail to your stories. The advanced forms are for recognition before production.</p><div class='tense-roadmap-grid'></div></div>";
  const tenseTargets=[
    ["Presente","Hablo / tengo","gram-presente","Core now"],["Near future","Voy a hacer","gram-futuro","Easy next step"],["Completed past","Fui / hice","gram-pasado","Tell what happened"],["Past contrast","Fui vs. iba","gram-pasado-contraste","Story detail"],["Present perfect","He hecho","gram-perfecto","Connected to now"],["Conditional","Me gustaría","gram-condicional","Polite and possible"],["Past perfect","Había hecho","gram-pasado-perfecto","Earlier past"],["Future perfect","Habré hecho","gram-futuro-perfecto","Advanced recognition"]
  ];
  const tenseGrid=tenseRoadmap.querySelector(".tense-roadmap-grid");tenseTargets.forEach(([label,pattern,id,sub],i)=>{const b=document.createElement("button");b.type="button";b.className="tense-roadmap-item";b.innerHTML=`<span class='tense-roadmap-number'>${i+1}</span><span><strong>${label}</strong><small>${pattern} · ${sub}</small></span><span>›</span>`;b.onclick=()=>{const lesson=LESSONS.find(l=>l.id===id);if(lesson)openLesson(lesson);else{showPage("gram");actions.showGram(id);}};tenseGrid.appendChild(b);});
  root.appendChild(tenseRoadmap);
  let lessonNum=0;
  const toggleLessonCheck=(e,lessonId)=>{
    e.stopPropagation();
    const sc=document.querySelector(".scroll");
    const prevTop=sc?sc.scrollTop:0;
    const openStages=[...root.querySelectorAll(".lesson-stage[open]")].map(s=>s.id);
    if(lessonProgress[lessonId])delete lessonProgress[lessonId];
    else lessonProgress[lessonId]=true;
    saveLessons();
    renderLessons();
    openStages.forEach(id=>{const el=document.getElementById(id);if(el)el.open=true;});
    if(sc)sc.scrollTop=prevTop;
  };
  LESSON_STAGES.forEach((stage,stageIndex)=>{
    const stageLessons=stage.ids.map(id=>LESSONS.find(l=>l.id===id)).filter(Boolean);
    if(!stageLessons.length)return;
    const sDone=stageLessons.filter(l=>lessonProgress[l.id]).length;
    const stageWrap=document.createElement("details");stageWrap.className="lesson-stage";stageWrap.dataset.lessonView="path";stageWrap.id="lesson-stage-"+stageIndex;
    const isCurrentStage=!!(nextLesson&&stageLessons.some(l=>l.id===nextLesson.id));
    if(isCurrentStage||(!nextLesson&&stageIndex===0))stageWrap.open=true;
    const sh=document.createElement("summary");sh.className="stage-label";
    sh.innerHTML=`<div class="stage-label-main"><span>${stage.name}</span><span class="stage-count">${sDone}/${stageLessons.length}</span></div><div class="stage-sub">${stage.sub}</div><div class="stage-progress"><span style="width:${Math.round((sDone/Math.max(stageLessons.length,1))*100)}%"></span></div>`;
    stageWrap.appendChild(sh);
    if(stageIndex>=0&&stageIndex<=3&&sDone<stageLessons.length){
      const testBar=document.createElement("div");testBar.className="stage-testout-bar";
      testBar.innerHTML=`<span>Know the basics in this stage?</span><button type="button" class="stage-testout-btn">⚡ Test out (5Q)</button>`;
      testBar.querySelector("button").onclick=()=>openStageTestOut(stage,stageLessons);
      stageWrap.appendChild(testBar);
    }
    root.appendChild(stageWrap);
    stageLessons.forEach(lesson=>{
      lessonNum++;
      const recommended=nextLesson&&nextLesson.id===lesson.id;
      const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"")+(recommended?" recommended":"");card.dataset.lessonView="path";
      card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Recommended next</span>":""}</div><div class="lesson-sub">${lesson.sub}</div>${lesson.enSub?`<div class="lesson-en-sub">${escapeVocabHtml(lesson.enSub)}</div>`:""}<div class="lesson-meta"><span>${lesson.difficulty}</span><span>${lesson.prereq||"Next step"}</span></div><div class="lesson-deeplinks"></div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
      const dlRow=card.querySelector(".lesson-deeplinks");
      [
        ["💬 Diálogo",()=>{showPage("frases");const d=lessonDialogue(lesson);if(d){appState.fraseReturnToLessons=true;actions.renderFraseDialogue(d);}}],
        ["📚 Vocab",()=>{showPage("vocab");if(typeof actions.sCat==="function")actions.sCat(lesson.vocab);}],
        ["⚡ Quiz",()=>{showPage("quiz");appState.qBlitzPack=null;appState.qMissedOnly=false;appState.qCat=lesson.quizCat||"all";appState.qMode=lesson.quizMode||"mixed";appState.qFocus=lesson.quizFocus||"all";appState.repasoLeft=0;actions.resetQuizRound();actions.syncQuizControls();actions.nQ();}]
      ].forEach(([lbl,fn])=>{
        const b=document.createElement("button");b.type="button";b.className="lesson-deeplink-pill";b.textContent=lbl;
        b.onclick=e=>{e.stopPropagation();fn();};
        dlRow.appendChild(b);
      });
      card.onclick=()=>openLesson(lesson);
      card.querySelector(".lesson-check").onclick=(e)=>toggleLessonCheck(e,lesson.id);
      stageWrap.appendChild(card);
    });
  });
  /* Any lesson not assigned to a stage still shows (future-proofing weekly additions) */
  const staged=new Set(LESSON_STAGES.flatMap(s=>s.ids));
  LESSONS.filter(l=>!staged.has(l.id)).forEach(lesson=>{
    lessonNum++;
    const recommended=nextLesson&&nextLesson.id===lesson.id;
    const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"")+(recommended?" recommended":"");card.dataset.lessonView="path";
    card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Recommended next</span>":""}</div><div class="lesson-sub">${lesson.sub}</div>${lesson.enSub?`<div class="lesson-en-sub">${escapeVocabHtml(lesson.enSub)}</div>`:""}<div class="lesson-meta"><span>${lesson.difficulty}</span><span>${lesson.prereq||"Next step"}</span></div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
    card.onclick=()=>openLesson(lesson);
    card.querySelector(".lesson-check").onclick=(e)=>toggleLessonCheck(e,lesson.id);
    root.appendChild(card);
  });
  /* Progress backup lives at the bottom — rare-use utility (v22) */
  renderQuizAuditCard(root);
  const bkLabel=document.createElement("div");bkLabel.className="fr-home-label";bkLabel.dataset.lessonView="practice";bkLabel.textContent="💾 Progress backup";
  root.appendChild(bkLabel);
  /* Backup / restore progress (v17) */
  const bk=document.createElement("div");bk.className="backup-row";bk.dataset.lessonView="practice";
  const BK_KEYS=["esco-quiz-v1","esco-srs-v1","esco-speaking-errors-v1","esco-lesson-progress-v1","esco-mission-progress-v1","esco-reading-progress-v1","esco-routine-v1","esco-routine-v2","esco-routine-v3","esco-practice-v1","esco-days-v1"];
  const b1=document.createElement("button");b1.type="button";b1.className="backup-btn";b1.textContent="💾 Copy backup";
  b1.onclick=()=>{
    const data={};BK_KEYS.forEach(k=>{const v=appStorage.getItem(k);if(v)data[k]=v;});
    const txt="ESCO-BACKUP:"+JSON.stringify(data);
    const done=()=>{b1.textContent="✅ Copied";setTimeout(()=>{b1.textContent="💾 Copy backup";},2000);};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>prompt("Copy this text and save it somewhere safe:",txt));
    else prompt("Copy this text and save it somewhere safe:",txt);
  };
  const b2=document.createElement("button");b2.type="button";b2.className="backup-btn";b2.textContent="📥 Restore";
  b2.onclick=()=>{
    const txt=prompt("Paste your backup here:");
    if(!txt)return;
    try{
      const data=JSON.parse(txt.replace(/^ESCO-BACKUP:/,""));
      Object.keys(data).forEach(k=>{if(BK_KEYS.includes(k))appStorage.setItem(k,data[k]);});
      alert("✅ Backup restored. The app will reload.");
      location.reload();
    }catch(e){alert("⚠️ That does not look like a valid backup.");}
  };
  bk.appendChild(b1);bk.appendChild(b2);root.appendChild(bk);
  setLessonView(lessonView);
  actions.syncStudioChrome();
}


// ── Build Grammar ─────────────────────────────────────────────────────────────
export function initLessons() {
  renderLessons();
}
