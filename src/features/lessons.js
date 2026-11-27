import {
  LESSONS,
} from "./lessons-meta.js";
import {
  READINGS, CONVERSATION_MISSIONS, LESSON_CONTENT, LESSON_META,
  SPEAKING_GUIDE,
  PICTURE_MATCH_BANK, COLOMBIA_CHATS, VERB_VERSATILITY_ENGINE,
  SLOT_SWAP_MATRICES, COLOMBIANISMOS,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { userPrefs, saveUserPrefs, effectiveLevel, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, lpEl, scrollAppTop, showAppToast } from "../core/text-utils.js";
import {
  practiceStore, markPractice, practiced,
  lessonProgress, saveLessons, lessonScores, saveLessonScores,
  stageMastery, saveStageMastery, recordPracticeDay, practiceStreak, getWeekActivity, todayActionCount,
  srsDue, srsDueCount, speakingErrors, speakingErrorId,
  missionProgress, readingProgress,
} from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";
import { PHRASE_DIALOGUES, RR_BANK, storedMissedQuestionCount } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";
import {
  openLesson, setLeccionesFocusMode, renderLessonStep, loadResume, openLessonAt,
} from "./lesson-player.js";
import {
  renderRapida, renderSpeakingErrorJournal, resetRrSession,
} from "./rapida.js";
import {
  renderMission, frameDayNumber, renderFramePractice, renderReading, VOICE_NOTE_SCENES, renderVoiceNoteLab, renderSurvivalCard,
} from "./speaking-labs.js";
import {
  LESSON_STAGES, FOCUS_LESSON_SETS,
  routineToday, routineDockHide, routineBack, routineFinishWarmup, routineFinishTwisters,
  routineFinishMission, syncMissedQueueLauncher,
  renderRoutineCard, renderProgressDashboard, renderQuizAuditCard,
  mountTripReadinessTracker, renderModeFocusBar, buildGlobalFinderCard,
} from "./today-hub.js";
export {
  routineToday, routineDockHide, routineBack, routineFinishWarmup, routineFinishTwisters,
  routineFinishMission, syncMissedQueueLauncher,
};

LESSONS.forEach(lesson=>{
  if(typeof LESSON_META!=="undefined"&&LESSON_META[lesson.id])Object.assign(lesson,LESSON_META[lesson.id]);
  if(!lesson.difficulty)lesson.difficulty=/gram|pronombres|groserias/.test(lesson.id)?"Moderate":"Easy";
  if(!lesson.stage)lesson.stage=/gram|pronombres/.test(lesson.id)?"Build Sentences":"Daily Life";
  if(!lesson.readingId){const match=READINGS.find(r=>r.lesson===lesson.id)||READINGS.find(r=>r.lesson===lesson.vocab);lesson.readingId=match?match.id:READINGS[0].id;}
  if(!lesson.missionId){const match=CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.id)||CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.vocab);lesson.missionId=match?match.id:CONVERSATION_MISSIONS[0].id;}
});

/* v58: keep Lecciones from becoming one long mixed-purpose page. The three
   views preserve all existing material while making the next action obvious. */
const LESSON_VIEW_KEY="esco-lesson-view-v1";
let lessonView="today";
try{lessonView=appStorage.getItem(LESSON_VIEW_KEY)||"today";}catch(e){}
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
export function openStageTestOut(stage,stageLessons,bossMode=false){
  const root=document.getElementById("lesson-list");if(!root)return;
  setLeccionesFocusMode(true);
  scrollAppTop();
  const poolItems=[];
  stageLessons.forEach(l=>{
    const c=typeof LESSON_CONTENT!=="undefined"&&LESSON_CONTENT[l.id];
    if(!c)return;
    const items=(bossMode&&Array.isArray(c.phrases)&&c.phrases.length)?c.phrases.slice(0,2):[(c.examples&&c.examples[0])||c.goal];
    items.forEach(item=>{if(item&&item.es&&item.en)poolItems.push({lesson:l,es:item.es,en:item.en});});
  });
  if(poolItems.length<2){openLesson(stageLessons[0]);return;}
  const targetCount=bossMode?6:5;
  const stepN=Math.max(1,Math.floor(poolItems.length/targetCount));
  const picks=[];
  for(let i=0;i<poolItems.length&&picks.length<targetCount;i+=stepN)picks.push(poolItems[i]);
  for(let i=0;picks.length<Math.min(targetCount,poolItems.length)&&i<poolItems.length;i++){
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
        recordPracticeDay();
        stageLessons.forEach(l=>{
          lessonProgress[l.id]=true;
          lessonScores[l.id]=Math.max(Number(lessonScores[l.id])||0,bossMode?100:80);
        });
        saveLessons();saveLessonScores();
        if(bossMode){stageMastery[stage.name]=true;saveStageMastery();showAppToast("👑 Stage Mastered!","ok");}
      }
      const res=document.createElement("div");res.className="testout-result";
      res.innerHTML=`<div class="testout-kicker">${passed?(bossMode?"👑 STAGE CROWN EARNED":"🎉 STAGE TEST-OUT PASSED"):"🧭 KEEP PRACTICING"}</div>
        <h3>${score}/${questions.length} Correct</h3>
        <p>${passed?(bossMode?`<strong>${escapeVocabHtml(stage.name)}</strong> is now Crowned Mastered!`:`All ${stageLessons.length} lessons in <strong>${escapeVocabHtml(stage.name)}</strong> are now marked complete!`):`Score ${passNeed}/${questions.length} to ${bossMode?"crown this stage":"test out and unlock the next stage"}.`}</p>
        <div class="testout-acts"></div>`;
      const acts=res.querySelector(".testout-acts");
      if(passed){
        const cont=document.createElement("button");cont.type="button";cont.className="lp-nav-btn primary";cont.textContent="Continue on Ruta →";
        cont.onclick=()=>{setLeccionesFocusMode(false);};
        acts.appendChild(cont);
      }else{
        const retry=document.createElement("button");retry.type="button";retry.className="lp-nav-btn primary";retry.textContent=bossMode?"🔄 Retry Stage Boss":"🔄 Retry Test-Out";
        retry.onclick=()=>openStageTestOut(stage,stageLessons,bossMode);
        const startL=document.createElement("button");startL.type="button";startL.className="lp-nav-btn";startL.textContent="Practice Lesson 1 →";
        startL.onclick=()=>openLesson(stageLessons[0]);
        acts.append(retry,startL);
      }
      wrap.appendChild(res);root.appendChild(wrap);return;
    }
    const q=questions[qi];answered=false;
    const card=document.createElement("div");card.className="lp-card";
    card.innerHTML=`<div class="lp-kicker">${bossMode?"🏁 STAGE BOSS":"⚡ STAGE TEST-OUT"} · ${qi+1} OF ${questions.length} (NEED ${passNeed})</div>
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
function mountTodaySmartWarmup(hero){
  const picks=[];
  const seen=new Set();
  const pushPick=(es,en,tag)=>{
    if(!es||seen.has(es)||picks.length>=3)return;
    seen.add(es);picks.push({es,en,tag});
  };
  Object.values(speakingErrors||{}).sort((a,b)=>((b&&b.last)||0)-((a&&a.last)||0)).forEach(e=>{if(e&&e.text)pushPick(e.text,e.source||"Recent speaking miss","🎯 Refresh");});
  const seed=(new Date().getDate()+todayActionCount())%Math.max(1,(COLOMBIANISMOS||[]).length);
  const cols=Array.isArray(COLOMBIANISMOS)?COLOMBIANISMOS:[];
  for(let i=0;i<cols.length&&picks.length<3;i++){
    const c=cols[(seed+i)%cols.length];
    if(c)pushPick(c.example||c.word,c.en,"🇨🇴 Warmup");
  }
  if(!picks.length)return;
  const fold=document.createElement("details");fold.className="today-warmup-fold";
  const doneSet=new Set();
  const sum=document.createElement("summary");
  const body=document.createElement("div");body.className="today-warmup-body";
  const syncSum=()=>{sum.innerHTML=`<span>⏱️ <strong>30-Sec Warmup</strong> <small>Listen &amp; say 3 quick lines</small></span><span class="warmup-badge">${doneSet.size}/${picks.length}${doneSet.size>=picks.length?" ✓":""}</span>`;};
  syncSum();
  picks.forEach((p,idx)=>{
    const row=document.createElement("div");row.className="warmup-mini-row";
    row.innerHTML=`<div class="warmup-mini-copy"><span class="warmup-tag">${escapeVocabHtml(p.tag)}</span><strong>${escapeVocabHtml(p.es)}</strong><small>${escapeVocabHtml(p.en)}</small></div><div class="warmup-mini-acts"></div>`;
    const acts=row.querySelector(".warmup-mini-acts");
    const hear=document.createElement("button");hear.type="button";hear.className="hl-mini-btn";hear.textContent="🔊";hear.setAttribute("aria-label","Listen to warmup phrase");
    hear.onclick=()=>speak(p.es,0.78);
    const tick=document.createElement("button");tick.type="button";tick.className="hl-mini-btn warmup-done-btn";tick.textContent="✓";tick.setAttribute("aria-label","Mark warmup phrase practiced");
    tick.onclick=()=>{doneSet.add(idx);row.classList.add("done");tick.classList.add("saved");markPractice("phrases",p.es);syncSum();};
    acts.append(hear);
    attachMic(acts,p.es,"phrases");
    acts.append(tick);
    body.appendChild(row);
  });
  fold.append(sum,body);
  hero.appendChild(fold);
}

export function renderLessons(){
  const root=document.getElementById("lesson-list");if(!root)return;
  if(appState.lpLesson){renderLessonStep();return;}
  setLeccionesFocusMode(false);
  try{lessonView=appStorage.getItem(LESSON_VIEW_KEY)||"today";}catch(e){}
  root.innerHTML="";
  buildLessonViewTabs(root);
  renderModeFocusBar(root, renderLessons);
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

  const dueHome=srsDueCount();
  const missedHome=storedMissedQuestionCount();
  const lessonDueCount=lesson=>{
    if(!lessonProgress[lesson.id])return 0;
    const c=typeof LESSON_CONTENT!=="undefined"&&LESSON_CONTENT[lesson.id];
    if(!c)return 0;
    const keys=new Set();
    (c.phrases||[]).forEach(p=>{if(p&&p.es)keys.add(p.es);});
    (c.words||[]).forEach(w=>{if(w&&w.es)keys.add(w.es.replace(/\.\.\./g,"").trim());});
    let count=0;
    keys.forEach(k=>{
      const err=speakingErrors[speakingErrorId(k)];
      if((err&&!err.starred)||srsDue(k))count++;
    });
    return count;
  };
  const streakDays=practiceStreak();
  const todayCnt=todayActionCount();
  const crownedCount=LESSONS.filter(x=>(lessonScores[x.id]||0)>=100).length;
  const weekHtml=getWeekActivity().map(d=>`<span class="week-dot${d.active?" active":""}${d.isToday?" today":""}" title="${d.key}">${d.label}</span>`).join("");

  /* 1. Unified Hero Card — Status + Primary Lesson CTA + 1-Tap Session Launchers */
  const hero=document.createElement("section");hero.className="today-hero-card";hero.dataset.lessonView="today";
  hero.innerHTML=`<div class="today-hero-status"><span class="hero-pill streak">🔥 ${streakDays}d streak</span><span class="hero-pill ${todayCnt>=3?"goal-met":"level"}">🎯 ${todayCnt>=3?"Daily goal ✓":`${todayCnt}/3 today`}</span><span class="hero-pill count">${crownedCount?`👑 ${crownedCount} · `:""}${done}/${LESSONS.length} done</span></div><div class="lesson-progress"><span style="width:${Math.round(percent*100)}%"></span></div><div class="week-streak-row" aria-label="7-day practice activity">${weekHtml}</div>`;

  const primaryLesson=(resLesson&&!lessonProgress[resLesson.id]&&(!focusIds||focusIds.includes(resLesson.id)))?resLesson:(nextLesson||LESSONS[0]);
  const isResuming=!!(resLesson&&primaryLesson.id===resLesson.id&&!lessonProgress[resLesson.id]);
  const focusTag=userPrefs.focus==="sanjuan"?"🪗 SAN JUAN":userPrefs.focus==="travel"?"✈️ TRAVEL & FOOD":userPrefs.focus==="daily"?"🏠 DAILY CO":"";
  const heroCta=document.createElement("button");heroCta.type="button";heroCta.className="today-hero-cta";
  heroCta.innerHTML=`<div class="today-hero-cta-icon">${primaryLesson.icon||"🎓"}</div><div class="today-hero-cta-copy"><span class="today-hero-cta-kicker">${isResuming?`▶️ CONTINUE · STEP ${(resume.step|0)+1}`:(done===0?"🚀 START HERE · LESSON 1":`🎓 NEXT LESSON${focusTag?" · "+focusTag:""}`)}</span><strong>${escapeVocabHtml(primaryLesson.title)}</strong><small>${escapeVocabHtml(primaryLesson.sub)}</small></div><div class="today-hero-cta-badge">${isResuming?"Resume →":"Start →"}</div>`;
  heroCta.onclick=()=>{if(isResuming)openLessonAt(resLesson,resume.step,resume.qi,resume.score);else openLesson(primaryLesson);};
  hero.appendChild(heroCta);const flowBtn=document.createElement("button");flowBtn.type="button";flowBtn.className="daily-flow-cta";flowBtn.innerHTML=`<span class="df-cta-icon">⚡</span><span class="df-cta-copy"><strong>Today’s 5-Min Mixed Flow</strong><small>Due SRS · Pictures · Local Fixes · Street Ear (8 cards)</small></span><span class="df-cta-badge">Mix →</span>`;flowBtn.onclick=()=>{if(typeof actions.openDailyFlowSession==="function")actions.openDailyFlowSession();};hero.appendChild(flowBtn);
  mountTodaySmartWarmup(hero);
  if(dueHome+missedHome>0){
    const weakBtn=document.createElement("button");weakBtn.type="button";weakBtn.className="starter-sound-btn weak-spots-cta";
    weakBtn.innerHTML=`<span>🔁 <strong>Fix Weak Spots</strong> <small>${missedHome?`${missedHome} missed`:""}${missedHome&&dueHome?" · ":""}${dueHome?`${dueHome} due`:""}</small></span><span>Drill →</span>`;
    weakBtn.onclick=()=>{if(missedHome)actions.openMissedQueue();else actions.openReviewSession();};
    hero.appendChild(weakBtn);
  }

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

  /* 2. Quick Speaking Tiles & 60s Warm-Up (tucked cleanly into expandable Hoy tray below Finder) */
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

  buildGlobalFinderCard(root,{onOpenLesson:openLesson});
  mountTripReadinessTracker(root,{onOpenLesson:openLesson});

  /* 4. Calm Hoy tray: fold secondary drills, daily routine, stats & error journal */
  const moreWrap=document.createElement("details");moreWrap.className="starter-more-tools";moreWrap.dataset.lessonView="today";
  moreWrap.innerHTML="<summary><span>🧰 More drills, daily routine, stats &amp; error journal</span><small>10-Min Routine · Slot-Swapper · Stats</small></summary>";
  renderRoutineCard(moreWrap);
  moreWrap.appendChild(quickGrid);
  moreWrap.appendChild(focusStrip);
  renderProgressDashboard(moreWrap,done);
  renderSpeakingErrorJournal(moreWrap);
  root.appendChild(moreWrap);
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

  const missionFold=document.createElement("details");missionFold.className="starter-more-tools";missionFold.dataset.lessonView="practice";
  missionFold.innerHTML=`<summary><span>🗣️ Conversation missions</span><small>${Object.keys(missionProgress).length}/${CONVERSATION_MISSIONS.length} completed ▾</small></summary>`;
  const missionGrid=document.createElement("div");missionGrid.className="mission-grid";
  CONVERSATION_MISSIONS.forEach(m=>{const b=document.createElement("button");b.type="button";b.className="mission-home-card";b.innerHTML=`<span class="mission-home-icon">${missionProgress[m.id]?"✅":"🗣️"}</span><span class="mission-home-copy"><strong>${m.title}</strong><small>${m.scenario}</small></span>`;b.onclick=()=>renderMission(m);missionGrid.appendChild(b);});
  missionFold.appendChild(missionGrid);root.appendChild(missionFold);

  const readingFold=document.createElement("details");readingFold.className="starter-more-tools";readingFold.dataset.lessonView="practice";
  readingFold.innerHTML=`<summary><span>📖 Lecturas / Readings</span><small>${Object.keys(readingProgress).length}/${READINGS.length} completed ▾</small></summary>`;
  const readingGrid=document.createElement("div");readingGrid.className="reading-home-grid";
  READINGS.forEach(reading=>{const b=document.createElement("button");b.type="button";b.className="reading-home-card";b.innerHTML=`<span class='reading-home-icon'>${readingProgress[reading.id]?"✅":"📖"}</span><span><strong>${reading.title}</strong><small>${reading.level} · ${reading.intro}</small></span><span>›</span>`;b.onclick=()=>renderReading(reading);readingGrid.appendChild(b);});
  readingFold.appendChild(readingGrid);root.appendChild(readingFold);

  const vnFold=document.createElement("details");vnFold.className="starter-more-tools";vnFold.dataset.lessonView="practice";
  const vnAll=VOICE_NOTE_SCENES||[];
  const vnDone=vnAll.filter(v=>readingProgress[v.id]).length;
  vnFold.innerHTML=`<summary><span>🎧 Notas de Voz (Audio Stories)</span><small>${vnDone}/${vnAll.length} completed ▾</small></summary>`;
  let activeVnReg="all";
  const vnRegBar=document.createElement("div");vnRegBar.className="vn-region-bar";
  const vnGrid=document.createElement("div");vnGrid.className="reading-home-grid";
  const drawVnList=()=>{
    vnRegBar.innerHTML="";
    [["all",`🗺️ Todas (${vnAll.length})`],["bogota","🏔️ Bogotá"],["medellin","🌸 Medellín"],["guajira","🪗 La Guajira"]].forEach(([rid,lbl])=>{
      const cnt=rid==="all"?vnAll.length:vnAll.filter(v=>v.region===rid).length;
      const chip=document.createElement("button");chip.type="button";chip.className="mf-chip"+(activeVnReg===rid?" active":"");
      chip.textContent=rid==="all"?lbl:`${lbl} (${cnt})`;
      chip.onclick=()=>{activeVnReg=rid;drawVnList();};
      vnRegBar.appendChild(chip);
    });
    vnGrid.innerHTML="";
    vnAll.filter(v=>activeVnReg==="all"||v.region===activeVnReg).forEach(vn=>{
      const b=document.createElement("button");b.type="button";b.className="reading-home-card";
      b.innerHTML=`<span class='reading-home-icon'>${readingProgress[vn.id]?"✅":"🎧"}</span><span><strong>${vn.title}</strong><small>${vn.sender} · ${vn.duration}</small></span><span>›</span>`;
      b.onclick=()=>renderVoiceNoteLab(vn);
      vnGrid.appendChild(b);
    });
  };
  drawVnList();
  vnFold.append(vnRegBar,vnGrid);root.appendChild(vnFold);
  renderSurvivalCard(root);

  /* Lessons grouped into a speaking-first progression (shared LESSON_STAGES) */
  const roadmap=lpEl("lesson-roadmap");
  roadmap.dataset.lessonView="path";
  const pathControls=lpEl("lesson-roadmap-controls");
  const pathSearch=document.createElement("input");pathSearch.type="search";pathSearch.className="content-search lesson-path-search";pathSearch.placeholder=`🔎 Search ${LESSONS.length} lessons (e.g. Uber, Nequi, pasado…)`;pathSearch.setAttribute("aria-label","Search lessons");
  const jumpSelect=document.createElement("select");jumpSelect.className="voice-select lesson-jump-select";jumpSelect.setAttribute("aria-label","Jump to any lesson topic");
  const defOpt=document.createElement("option");defOpt.value="";defOpt.textContent=`📚 Jump to any topic (${LESSONS.length}) ▾`;jumpSelect.appendChild(defOpt);
  let jumpIdx=0;
  LESSON_STAGES.forEach(st=>{
    const og=document.createElement("optgroup");og.label=st.name;
    st.ids.forEach(id=>{
      const l=LESSONS.find(x=>x.id===id);if(!l)return;
      jumpIdx++;
      const opt=document.createElement("option");opt.value=l.id;
      const sc=Number(lessonScores[l.id])||0;
      const dueN=lessonDueCount(l);
      const ico=dueN?"🔁":sc>=100?"👑":lessonProgress[l.id]?"✅":jumpIdx===1?"▶":"🔓";
      opt.textContent=`${ico} #${jumpIdx} ${l.title}${sc?` (${sc}%)`:""}${dueN?` · ${dueN} due`:""}`;
      og.appendChild(opt);
    });
    if(og.children.length)jumpSelect.appendChild(og);
  });
  jumpSelect.onchange=()=>{
    const id=jumpSelect.value;if(!id)return;
    const target=LESSONS.find(x=>x.id===id);
    jumpSelect.value="";
    if(target)openLesson(target);
  };
  pathControls.append(pathSearch,jumpSelect);
  roadmap.appendChild(pathControls);
  root.appendChild(roadmap);
  pathSearch.oninput=()=>{
    const q=pathSearch.value.trim().toLowerCase();
    root.querySelectorAll(".lesson-stage").forEach(st=>{
      let matchesInStage=0;
      st.querySelectorAll(".lesson-card").forEach(card=>{
        const hit=!q||card.textContent.toLowerCase().includes(q);
        card.style.display=hit?"":"none";
        if(hit)matchesInStage++;
      });
      const lockedFold=st.querySelector(".stage-locked-fold");
      if(lockedFold){
        const foldHits=[...lockedFold.querySelectorAll(".lesson-card")].some(c=>c.style.display!=="none");
        lockedFold.style.display=(!q||foldHits)?"":"none";
        lockedFold.open=!!(q&&foldHits);
      }
      st.style.display=(!q||matchesInStage>0)?"":"none";
      if(q&&matchesInStage>0)st.open=true;
    });
    const futureFold=root.querySelector(".future-stages-fold");
    if(futureFold){
      const futureHits=[...futureFold.querySelectorAll(".lesson-stage")].some(st=>st.style.display!=="none");
      futureFold.style.display=(!q||futureHits)?"":"none";
      futureFold.open=!!(q&&futureHits);
    }
  };
  let lessonNum=0;
  let prevStageDone=true;
  const lockedStages=[];
  let lockedLessonTotal=0;
  LESSON_STAGES.forEach((stage,stageIndex)=>{
    const stageLessons=stage.ids.map(id=>LESSONS.find(l=>l.id===id)).filter(Boolean);
    if(!stageLessons.length)return;
    const sDone=stageLessons.filter(l=>lessonProgress[l.id]).length;
    const stageUnlocked=stageIndex===0||prevStageDone||sDone>0;
    const firstPendingId=(stageLessons.find(l=>!lessonProgress[l.id])||{}).id;
    const isMastered=!!stageMastery[stage.name];
    const stageWrap=document.createElement("details");stageWrap.className="lesson-stage"+(stageUnlocked?"":" locked")+(isMastered?" crowned":"");stageWrap.dataset.lessonView="path";stageWrap.id="lesson-stage-"+stageIndex;
    const isCurrentStage=!!(nextLesson&&stageLessons.some(l=>l.id===nextLesson.id));
    if(isCurrentStage||(!nextLesson&&stageIndex===0))stageWrap.open=true;
    const sh=document.createElement("summary");sh.className="stage-label";
    sh.innerHTML=`<div class="stage-label-main"><span>${isMastered?"👑 ":stageUnlocked?"":"🔒 "}${stage.name}</span><span class="stage-count">${sDone}/${stageLessons.length}${isMastered?" · Crowned":""}</span></div><div class="stage-sub">${stageUnlocked?stage.sub:`Finish Stage ${stageIndex} or use ⚡ Test out below`}</div><div class="stage-progress"><span style="width:${Math.round((sDone/Math.max(stageLessons.length,1))*100)}%"></span></div>`;
    stageWrap.appendChild(sh);
    if(stageIndex>=0&&stageIndex<=4&&sDone<stageLessons.length){
      const testBar=document.createElement("div");testBar.className="stage-testout-bar";
      testBar.innerHTML=`<span>${stageUnlocked?"Know this stage already?":"Skip ahead to this stage"}</span><button type="button" class="stage-testout-btn">⚡ Test out (5Q)</button>`;
      testBar.querySelector("button").onclick=()=>openStageTestOut(stage,stageLessons,false);
      stageWrap.appendChild(testBar);
    }else if(sDone===stageLessons.length&&!isMastered&&stageLessons.length>=2){
      const bossBar=document.createElement("div");bossBar.className="stage-testout-bar boss";
      bossBar.innerHTML=`<span>Stage finished — earn your mastery crown?</span><button type="button" class="stage-testout-btn">🏁 Stage Boss (6Q)</button>`;
      bossBar.querySelector("button").onclick=()=>openStageTestOut(stage,stageLessons,true);
      stageWrap.appendChild(bossBar);
    }
    if(stageUnlocked)root.appendChild(stageWrap);
    else{lockedStages.push(stageWrap);lockedLessonTotal+=stageLessons.length;}
    let lockedVisibleCount=0;
    const hiddenLockedCards=[];
    stageLessons.forEach(lesson=>{
      lessonNum++;
      const isComplete=!!lessonProgress[lesson.id];
      const bestScore=Number(lessonScores[lesson.id])||0;
      const dueN=lessonDueCount(lesson);
      const isCrowned=isComplete&&bestScore>=100;
      const cardUnlocked=isComplete||(stageUnlocked&&lesson.id===firstPendingId);
      const recommended=nextLesson&&nextLesson.id===lesson.id;
      const isActiveCard=cardUnlocked&&!isComplete;
      const card=document.createElement("article");
      card.className="lesson-card"+(isComplete?" complete compact":"")+(isCrowned?" crowned":"")+(dueN?" needs-review":"")+(recommended?" recommended":"")+(!cardUnlocked?" locked compact":"");
      card.dataset.lessonView="path";
      const badgeSymbol=dueN?"🔁":isCrowned?"👑":isComplete?"✅":cardUnlocked?"▶":"🔒";
      const badgeLabel=dueN?`Completed (${dueN} items due to refresh)`:isCrowned?"Perfected (100%)":isComplete?(bestScore?`Completed (${bestScore}%)`:"Completed"):cardUnlocked?"Ready to start":"Locked — finish lesson above or jump via dropdown";
      const shortSummary=escapeVocabHtml(lesson.enSub||lesson.sub||"");
      const scoreBadge=(isComplete&&bestScore)?` <span class='lesson-score-pill'>${bestScore}%</span>`:"";
      const reviewBadge=dueN?` <span class='lesson-review-pill'>🔁 ${dueN} due</span>`:"";
      card.innerHTML=isActiveCard
        ?`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Next</span>":""}</div><div class="lesson-sub">${shortSummary}</div></div><span class="lesson-status-badge" title="${badgeLabel}" aria-label="${badgeLabel}">${badgeSymbol}</span></div>`
        :`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${scoreBadge}${reviewBadge}</div></div><span class="lesson-status-badge" title="${badgeLabel}" aria-label="${badgeLabel}">${badgeSymbol}</span></div>`;
      card.onclick=()=>{
        if(!cardUnlocked&&!pathSearch.value.trim()){
          showAppToast("🔒 Finish the unlocked lesson above — or use ⚡ Test out / 📚 Jump to topic ▾","warn");
          return;
        }
        openLesson(lesson);
      };
      if(!cardUnlocked){
        lockedVisibleCount++;
        if(lockedVisibleCount<=1)stageWrap.appendChild(card);
        else hiddenLockedCards.push(card);
      }else{
        stageWrap.appendChild(card);
      }
    });
    if(hiddenLockedCards.length){
      const lockedFold=document.createElement("details");lockedFold.className="stage-locked-fold";
      const sum=document.createElement("summary");sum.textContent=`🔒 ${hiddenLockedCards.length} upcoming locked lesson${hiddenLockedCards.length===1?"":"s"} in ${stage.name.replace(/^.*?(Stage \d+).*$/,"$1")} ▾`;
      lockedFold.appendChild(sum);
      hiddenLockedCards.forEach(c=>lockedFold.appendChild(c));
      stageWrap.appendChild(lockedFold);
    }
    prevStageDone=(sDone===stageLessons.length);
  });
  if(lockedStages.length){
    const futureFold=document.createElement("details");futureFold.className="future-stages-fold";futureFold.dataset.lessonView="path";
    const sum=document.createElement("summary");
    sum.innerHTML=`<span>🔒 <strong>${lockedStages.length} future stage${lockedStages.length===1?"":"s"} locked</strong> <small>(${lockedLessonTotal} lessons)</small></span><small>Test out or peek ▾</small>`;
    futureFold.appendChild(sum);
    lockedStages.forEach(sw=>futureFold.appendChild(sw));
    root.appendChild(futureFold);
  }
  /* Any lesson not assigned to a stage still shows (future-proofing weekly additions) */
  const staged=new Set(LESSON_STAGES.flatMap(s=>s.ids));
  LESSONS.filter(l=>!staged.has(l.id)).forEach(lesson=>{
    lessonNum++;
    const isComplete=!!lessonProgress[lesson.id];
    const recommended=nextLesson&&nextLesson.id===lesson.id;
    const card=document.createElement("article");card.className="lesson-card"+(isComplete?" complete compact":"")+(recommended?" recommended":"");card.dataset.lessonView="path";
    card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Next</span>":""}</div></div><span class="lesson-status-badge" aria-label="${isComplete?"Completed":"Ready"}">${isComplete?"✅":"▶"}</span></div>`;
    card.onclick=()=>openLesson(lesson);
    root.appendChild(card);
  });
  const tenseRoadmap=document.createElement("details");tenseRoadmap.className="tense-roadmap tense-roadmap-fold";tenseRoadmap.dataset.lessonView="practice";
  tenseRoadmap.innerHTML="<summary class='tense-roadmap-summary'><span>🧭 <strong>Speaking Tense Roadmap</strong> <small>8 layers from Presente to Future Perfect</small></span><span class='tense-roadmap-chev'>⌄</span></summary><div class='tense-roadmap-body'><p>Learn the high-frequency patterns first, then add detail to your stories. The advanced forms are for recognition before production.</p><div class='tense-roadmap-grid'></div></div>";
  const tenseTargets=[
    ["Presente","Hablo / tengo","gram-presente","Core now"],["Near future","Voy a hacer","gram-futuro","Easy next step"],["Completed past","Fui / hice","gram-pasado","Tell what happened"],["Past contrast","Fui vs. iba","gram-pasado-contraste","Story detail"],["Present perfect","He hecho","gram-perfecto","Connected to now"],["Conditional","Me gustaría","gram-condicional","Polite and possible"],["Past perfect","Había hecho","gram-pasado-perfecto","Earlier past"],["Future perfect","Habré hecho","gram-futuro-perfecto","Advanced recognition"]
  ];
  const tenseGrid=tenseRoadmap.querySelector(".tense-roadmap-grid");tenseTargets.forEach(([label,pattern,id,sub],i)=>{const b=document.createElement("button");b.type="button";b.className="tense-roadmap-item";b.innerHTML=`<span class='tense-roadmap-number'>${i+1}</span><span><strong>${label}</strong><small>${pattern} · ${sub}</small></span><span>›</span>`;b.onclick=()=>{const lesson=LESSONS.find(l=>l.id===id);if(lesson)openLesson(lesson);else{showPage("gram");actions.showGram(id);}};tenseGrid.appendChild(b);});
  root.appendChild(tenseRoadmap);
  /* Progress backup & content audit live tucked cleanly at the bottom */
  const auditFold=document.createElement("details");auditFold.className="starter-more-tools";auditFold.dataset.lessonView="practice";
  auditFold.innerHTML="<summary><span>🧪 Quiz quality check</span><small>Validate question pool ▾</small></summary>";
  renderQuizAuditCard(auditFold);
  root.appendChild(auditFold);
  const bkFold=document.createElement("details");bkFold.className="starter-more-tools";bkFold.dataset.lessonView="practice";
  bkFold.innerHTML="<summary><span>💾 Legacy text backup</span><small>Use Profile drawer for .json file backup</small></summary>";
  const bk=document.createElement("div");bk.className="backup-row";
  const BK_KEYS=["esco-quiz-v1","esco-srs-v1","esco-speaking-errors-v1","esco-lesson-progress-v1","esco-lesson-scores-v1","esco-stage-mastery-v1","esco-mission-progress-v1","esco-reading-progress-v1","esco-routine-v1","esco-routine-v2","esco-routine-v3","esco-practice-v1","esco-days-v1","esco-week-days-v1","esco-today-actions-v1"];
  const b1=document.createElement("button");b1.type="button";b1.className="backup-btn";b1.textContent="💾 Copy backup";
  b1.onclick=()=>{
    const data={};BK_KEYS.forEach(k=>{const v=appStorage.getItem(k);if(v)data[k]=v;});
    const txt="ESCO-BACKUP:"+JSON.stringify(data);
    const done=()=>{b1.textContent="✅ Copied";showAppToast("✅ Backup copied to clipboard","ok");setTimeout(()=>{b1.textContent="💾 Copy backup";},2000);};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>prompt("Copy this text and save it somewhere safe:",txt));
    else prompt("Copy this text and save it somewhere safe:",txt);
  };
  const b2=document.createElement("button");b2.type="button";b2.className="backup-btn";b2.textContent="📥 Restore";
  b2.onclick=()=>{
    const txt=prompt("Paste your backup here:");
    if(!txt)return;
    try{
      const data=JSON.parse(txt.replace(/^ESCO-BACKUP:/,""));
      if(!data||typeof data!=="object"||Array.isArray(data))throw new Error("Invalid backup shape");
      let restored=0;
      Object.keys(data).forEach(k=>{
        if(BK_KEYS.includes(k)&&typeof data[k]==="string"&&data[k].length<=512000){
          appStorage.setItem(k,data[k]);
          restored++;
        }
      });
      if(!restored)throw new Error("No valid backup keys");
      showAppToast(`✅ Backup restored (${restored} items) — reloading…`,"ok");
      setTimeout(()=>location.reload(),600);
    }catch(e){showAppToast("⚠️ Invalid backup text — use a valid ESCO-BACKUP string.","warn");}
  };
  bk.append(b1,b2);bkFold.appendChild(bk);root.appendChild(bkFold);
  setLessonView(lessonView);
  actions.syncStudioChrome();
}


// ── Build Grammar ─────────────────────────────────────────────────────────────
export function initLessons() {
  renderLessons();
}
