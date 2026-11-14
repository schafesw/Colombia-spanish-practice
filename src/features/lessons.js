import {
  LESSONS,
} from "./lessons-meta.js";
import {
  READINGS, CONVERSATION_MISSIONS, LESSON_CONTENT, LESSON_META,
  SPEAKING_FRAMES, SENTENCE_LADDERS, SLOT_SWAP_MATRICES,
  TONGUE_TWISTERS, SPEAKING_GUIDE, REGIONAL_SWITCHER,
  PICTURE_MATCH_BANK, COLOMBIA_CHATS, GRAMMAR, VERB_VERSATILITY_ENGINE,
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

LESSONS.forEach(lesson=>{
  if(typeof LESSON_META!=="undefined"&&LESSON_META[lesson.id])Object.assign(lesson,LESSON_META[lesson.id]);
  if(!lesson.difficulty)lesson.difficulty=/gram|pronombres|groserias/.test(lesson.id)?"Moderate":"Easy";
  if(!lesson.stage)lesson.stage=/gram|pronombres/.test(lesson.id)?"Build Sentences":"Daily Life";
  if(!lesson.readingId){const match=READINGS.find(r=>r.lesson===lesson.id)||READINGS.find(r=>r.lesson===lesson.vocab);lesson.readingId=match?match.id:READINGS[0].id;}
  if(!lesson.missionId){const match=CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.id)||CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.vocab);lesson.missionId=match?match.id:CONVERSATION_MISSIONS[0].id;}
});
let lpSteps=[],lpStep=0,lpScore=0,lpQs=[],lpQi=0,lpAnswered=false,lpPracticed=new Set();
let lpFullMode=false,lpLadderStep=1,lpRoleSim=true,lpRoleTurn=0;
export function lessonDialogue(lesson){return PHRASE_DIALOGUES.find(x=>x.title===lesson.dialogue);}
function lessonResponsePair(lesson,c){
  const d=lessonDialogue(lesson);
  const lines=d&&d.versions&&d.versions[0]&&d.versions[0].lines||[];
  for(let i=0;i<lines.length-1;i++){
    const q=lines[i],a=lines[i+1];
    if(q&&a&&q.es&&a.es&&(/\?\s*$/.test(q.es)||/\?\s*$/.test(q.en||"")))
      return {questionEs:q.es,questionEn:q.en||"Listen for the meaning, then respond.",questionTts:q.tts||q.es,answerEs:a.es,answerEn:a.en||"A natural response",answerTts:a.tts||a.es,alternate:null};
  }
  const mission=lesson&&lesson.missionId&&typeof CONVERSATION_MISSIONS!=="undefined"?CONVERSATION_MISSIONS.find(m=>m.id===lesson.missionId):null;
  const model=mission&&mission.models&&mission.models[0];
  if(model&&mission.prompt)return {questionEs:mission.prompt,questionEn:mission.scenario||"Answer the situation in your own words.",questionTts:mission.prompt,answerEs:model.es,answerEn:model.en||"A natural response",answerTts:model.tts||model.es,alternate:mission.models[1]||null};
  return null;
}
function getLessonLadder(lesson,c){
  if(typeof SENTENCE_LADDERS!=="undefined"&&SENTENCE_LADDERS[lesson.id])return SENTENCE_LADDERS[lesson.id];
  if(!c)return null;
  const sorted=(c.phrases||[]).slice().sort((a,b)=>a.es.length-b.es.length);
  const p1=sorted[0]||{es:c.goal.es,en:c.goal.en};
  const p2=sorted[Math.min(1,sorted.length-1)]||p1;
  const w0=(c.words&&c.words[0])||{es:p1.es,en:p1.en};
  const rest=(c.phrases||[]).filter(p=>p!==p1&&p!==p2).slice(0,3);
  const swaps=(rest.length?rest:(c.words||[]).slice(1,4)).map((item,i)=>({
    label:`Variation ${i+1}`,
    es:item.es,
    en:item.en
  }));
  return {
    title:"Start small and build into a full sentence",
    rungs:[
      {tag:"1. Anchor chunk",es:w0.es,en:w0.en},
      {tag:"2. Core sentence",es:p1.es,en:p1.en},
      {tag:"3. Expanded detail",es:p2.es,en:p2.en},
      {tag:"4. Full conversational turn",es:c.goal.es,en:c.goal.en}
    ],
    swaps
  };
}
function buildLessonSteps(lesson,c,full){
  if(!c)return ["fin"];
  const hasResp=!!lessonResponsePair(lesson,c);
  if(!full){
    return ["objetivo","estructura","palabras","escalera","escucha",...(hasResp?["respuesta"]:[]),"hablaA","mision","fin"];
  }
  return ["objetivo","estructura","palabras","escalera","escucha",...(hasResp?["respuesta"]:[]),"frases","matching","building","typing","hablaA","hablaB","pronun","lectura","quiz","mision","fin"];
}
export function openLesson(lesson,fullMode){
  appState.lpLesson=lesson;lpStep=0;lpScore=0;lpQi=0;lpAnswered=false;lpPracticed=new Set();
  lpLadderStep=1;lpRoleSim=true;lpRoleTurn=0;
  if(typeof fullMode==="boolean")lpFullMode=fullMode;
  const c=LESSON_CONTENT[lesson.id];
  lpSteps=buildLessonSteps(lesson,c,lpFullMode);
  if(c)buildLessonQuiz(lesson,c);
  renderLessonStep();
}
function switchLessonPathMode(full){
  if(!appState.lpLesson||lpFullMode===full)return;
  const currentStepName=lpSteps[lpStep];
  lpFullMode=full;
  const c=LESSON_CONTENT[appState.lpLesson.id];
  lpSteps=buildLessonSteps(appState.lpLesson,c,lpFullMode);
  const idx=lpSteps.indexOf(currentStepName);
  lpStep=idx>=0?idx:0;
  renderLessonStep();
}
function openBonusStep(stepName){
  if(!appState.lpLesson)return;
  lpFullMode=true;
  const c=LESSON_CONTENT[appState.lpLesson.id];
  lpSteps=buildLessonSteps(appState.lpLesson,c,true);
  const idx=lpSteps.indexOf(stepName);
  lpStep=idx>=0?idx:0;
  lpAnswered=false;
  renderLessonStep();
}
function buildLessonQuiz(lesson,c){
  lpQs=[];
  const shuffle=a=>a.slice().sort(()=>Math.random()-0.5);
  const pad=(opts,pool,n)=>{const s=new Set(opts);for(const p of shuffle(pool)){if(opts.length>=n)break;if(p&&!s.has(p)){s.add(p);opts.push(p);}}return opts;};
  const globalEs=aQ.filter(q=>!q.kind).map(q=>q.es);
  const globalEn=aQ.filter(q=>!q.kind).map(q=>q.en);
  shuffle(c.phrases).slice(0,2).forEach(p=>{
    const opts=pad([p.es,...shuffle(c.phrases.filter(x=>x.es!==p.es)).slice(0,3).map(x=>x.es)],globalEs,4);
    lpQs.push({label:"Say it, then pick the Spanish",prompt:p.en,answer:p.es,options:shuffle(opts),afterTts:p.es,revEs:p.es,revEn:p.en});
  });
  shuffle(c.words).slice(0,2).forEach(w=>{
    const opts=pad([w.es,...shuffle(c.words.filter(x=>x.es!==w.es)).slice(0,3).map(x=>x.es)],globalEs,4);
    lpQs.push({label:"¿Cómo se dice?",prompt:w.en,answer:w.es,options:shuffle(opts),afterTts:w.es.replace(/\.\.\./g,""),revEs:w.es,revEn:w.en});
  });
  const d=lessonDialogue(lesson);
  if(d){
    const lines=d.versions[0].lines;
    const L=lines[Math.floor(Math.random()*lines.length)];
    const opts=pad([L.en,...shuffle(lines.filter(x=>x.en!==L.en)).map(x=>x.en).slice(0,3)],globalEn,4);
    lpQs.push({label:"Listen and recognize",prompt:"🎧",answer:L.en,options:shuffle(opts),autoTts:L.tts,afterTts:L.tts,revEs:L.es,revEn:L.en});
  }
}
export function lpSpeakBtn(text,label){const b=document.createElement("button");b.type="button";b.className="lp-speak";b.textContent=label||"🔊 Escuchar";b.onclick=()=>speak(text,0.75);return b;}
export function setLeccionesFocusMode(active){
  const page=document.getElementById("page-lecciones");
  if(page)page.classList.toggle("lesson-focus-mode",!!active);
  document.body.classList.toggle("lesson-focus-active",!!active);
  scrollAppTop();
}
export function renderLessonStep(){
  const root=document.getElementById("lesson-list");if(!root||!appState.lpLesson)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const c=LESSON_CONTENT[appState.lpLesson.id];
  const step=lpSteps[lpStep];
  saveResume();
  const focusTop=lpEl("lp-focus-top");
  const back=document.createElement("button");back.type="button";back.className="lp-exit";
  back.innerHTML="<span class='lp-exit-icon'>×</span><span>Exit lesson</span>";
  back.onclick=()=>{appState.lpLesson=null;renderLessons();};
  const focusProgress=lpEl("lp-focus-progress",`<span style="width:${Math.round(((lpStep+1)/lpSteps.length)*100)}%"></span>`);
  const focusStep=lpEl("lp-focus-step",`${lpStep+1}/${lpSteps.length}`);
  focusTop.append(back,focusProgress,focusStep);root.appendChild(focusTop);
  const modeBar=lpEl("lp-mode-switch");
  const coreBtn=document.createElement("button");coreBtn.type="button";coreBtn.className="lp-mode-btn"+(!lpFullMode?" active":"");coreBtn.textContent="⚡ Core";coreBtn.title="Speaking Core";coreBtn.onclick=()=>switchLessonPathMode(false);
  const fullBtn=document.createElement("button");fullBtn.type="button";fullBtn.className="lp-mode-btn"+(lpFullMode?" active":"");fullBtn.textContent="📚 Full";fullBtn.title="Full Practice";fullBtn.onclick=()=>switchLessonPathMode(true);
  modeBar.append(coreBtn,fullBtn);focusTop.appendChild(modeBar);
  const progress=lpEl("lp-progress-head");
  progress.innerHTML=`<span>${escapeVocabHtml(appState.lpLesson.title||"Lesson")}</span><strong>Step ${lpStep+1} of ${lpSteps.length}</strong>`;
  root.appendChild(progress);
  root.appendChild(lpEl("lp-dots",lpSteps.map((s,i)=>`<span class="lp-dot${i===lpStep?" on":i<lpStep?" past":""}"></span>`).join("")));
  const card=lpEl("lp-card");
  const title=lpEl("lp-step-title");
  const body=lpEl("lp-body");
  card.appendChild(title);card.appendChild(body);root.appendChild(card);
  const nav=lpEl("lp-nav");root.appendChild(nav);
  const navBtn=(label,fn,primary)=>{const b=document.createElement("button");b.type="button";b.className="lp-nav-btn"+(primary?" primary":"");b.textContent=label;b.onclick=fn;nav.appendChild(b);return b;};
  const next=()=>{lpStep++;lpAnswered=false;lpRoleTurn=0;renderLessonStep();};
  const prev=()=>{if(lpStep>0){lpStep--;lpRoleTurn=0;renderLessonStep();}};
  if(step==="objetivo"){
    title.textContent="🎯 Goal — by the end you will be able to say:";
    const goalEs=lpEl("lp-goal-es",c.goal.es);
    goalEs.style.cursor="pointer";
    goalEs.onclick=()=>speak(c.goal.es,0.75);
    body.appendChild(goalEs);
    body.appendChild(lpEl("lp-goal-en",c.goal.en));
    const speedRow=lpEl("lp-speed-row");
    const slowGoal=lpSpeakBtn(c.goal.es,"🐢 Slow (0.6x)");slowGoal.classList.add("lp-speed-btn");slowGoal.onclick=()=>speak(c.goal.es,0.6);
    const natGoal=lpSpeakBtn(c.goal.es,"🗣️ Natural (0.85x)");natGoal.classList.add("lp-speed-btn");natGoal.onclick=()=>speak(c.goal.es,0.85);
    speedRow.append(slowGoal,natGoal);
    body.appendChild(speedRow);
    const stressBox=document.createElement("details");stressBox.className="starter-stress-box";
    if(effectiveLevel()==="starter")stressBox.open=true;
    stressBox.innerHTML=`<summary>🔤 Pronunciation stress guide (CAPS = stressed vowel)</summary><div class="starter-stress-guide">${escapeVocabHtml(spanishStressHint(c.goal.es))}</div>`;
    body.appendChild(stressBox);
    attachMic(body,c.goal.es);
    body.appendChild(lpEl("lp-hint","Tap 🐢 Slow first if needed, then 🗣️ Natural, and say it out loud twice."));
    navBtn("Start →",next,true);
  }
  else if(step==="escalera"){
    const ladder=getLessonLadder(appState.lpLesson,c);
    title.textContent="🪜 Sentence Expansion Ladder — start small, build to full sentences";
    if(!ladder){body.appendChild(lpEl("lp-hint","No ladder available."));navBtn("‹ Back",prev);navBtn("Next →",next,true);}
    else{
      body.appendChild(lpEl("lp-activity-note",`${ladder.title} · Tap any unlocked layer to hear it, then say it out loud before adding the next piece.`));
      const rungsWrap=lpEl("ladder-rungs");
      const maxRung=Math.min(Math.max(lpLadderStep,1),ladder.rungs.length);
      ladder.rungs.forEach((rung,idx)=>{
        const unlocked=idx<maxRung;
        const row=lpEl("ladder-rung"+(unlocked?" unlocked":" locked")+(idx===maxRung-1?" active":""));
        if(unlocked){
          const cleanEs=rung.es.replace(/\.\.\.|…/g,"").trim();
          row.innerHTML=`<div class="ladder-rung-head"><span class="ladder-tag">${escapeVocabHtml(rung.tag)}</span></div><div class="ladder-es">${escapeVocabHtml(rung.es)}</div><div class="ladder-en">${escapeVocabHtml(rung.en)}</div><div class="ladder-actions"></div>`;
          row.style.cursor="pointer";
          row.onclick=e=>{if(!e.target.closest("button")){markPractice("phrases",cleanEs);speak(cleanEs,0.74);}};
          const act=row.querySelector(".ladder-actions");
          const hear=document.createElement("button");hear.type="button";hear.className="warmup-btn";hear.textContent="🔊 Hear";hear.onclick=e=>{e.stopPropagation();markPractice("phrases",cleanEs);speak(cleanEs,0.74);};
          act.appendChild(hear);
          attachMic(act,cleanEs,"phrases");
        }else{
          row.innerHTML=`<div class="ladder-rung-head"><span class="ladder-tag">${escapeVocabHtml(rung.tag)}</span><span class="ladder-lock">🔒 Tap below to add this layer</span></div>`;
        }
        rungsWrap.appendChild(row);
      });
      body.appendChild(rungsWrap);
      if(maxRung<ladder.rungs.length){
        const nextRung=ladder.rungs[maxRung];
        const choice=lpEl("ladder-choice");
        choice.appendChild(lpEl("ladder-choice-title","🧩 Choose the next building block"));
        choice.appendChild(lpEl("ladder-choice-help",`Layer ${maxRung+1} · ${escapeVocabHtml(nextRung.tag)}<br><span>${escapeVocabHtml(nextRung.en)}</span>`));
        const optionWrap=lpEl("ladder-choice-options");
        const candidates=[nextRung,...ladder.rungs.slice(maxRung+1),...(ladder.swaps||[])]
          .filter(Boolean)
          .filter((item,i,all)=>all.findIndex(x=>x.es===item.es)===i)
          .slice(0,4)
          .sort(()=>Math.random()-.5);
        const feedback=lpEl("ladder-choice-feedback"," ");
        let unlocked=false;
        const unlock=()=>{
          if(unlocked)return;
          unlocked=true;
          const nextText=nextRung.es.replace(/\.\.\.|…/g,"").trim();
          /* Keep this speech call inside the tap handler for iPhone Safari. */
          speak(nextText,0.74);
          lpLadderStep=maxRung+1;
          renderLessonStep();
        };
        candidates.forEach(item=>{
          const b=document.createElement("button");b.type="button";b.className="ladder-choice-btn";b.textContent=item.es;
          b.onclick=()=>{
            if(unlocked)return;
            if(item.es===nextRung.es){b.classList.add("correct");feedback.textContent="✅ Correct — now say the new sentence out loud.";unlock();}
            else{b.classList.add("wrong");feedback.textContent="Try again. Listen for the next layer in the ladder.";}
          };
          optionWrap.appendChild(b);
        });
        choice.appendChild(optionWrap);choice.appendChild(feedback);
        const skip=document.createElement("button");skip.type="button";skip.className="ladder-choice-skip";skip.textContent="Show the next layer";skip.onclick=unlock;choice.appendChild(skip);
        body.appendChild(choice);
      }else if(Array.isArray(ladder.swaps)&&ladder.swaps.length){
        const swapsBox=lpEl("ladder-swaps");
        swapsBox.innerHTML=`<div class="ladder-swaps-title">🔄 Rung 5 · Swap a piece and say 3 new sentences out loud</div><div class="ladder-swaps-sub">Tap any variation to hear it:</div>`;
        ladder.swaps.forEach(sw=>{
          const cleanEs=sw.es.replace(/\.\.\.|…/g,"").trim();
          const sRow=lpEl("ladder-swap-card",`<div class="ladder-swap-copy"><small>${escapeVocabHtml(sw.label)}</small><strong>${escapeVocabHtml(sw.es)}</strong><em>${escapeVocabHtml(sw.en)}</em></div><div class="ladder-actions"></div>`);
          sRow.style.cursor="pointer";
          sRow.onclick=e=>{if(!e.target.closest("button")){markPractice("phrases",cleanEs);speak(cleanEs,0.74);}};
          const act=sRow.querySelector(".ladder-actions");
          const hear=document.createElement("button");hear.type="button";hear.className="warmup-btn";hear.textContent="🔊";hear.onclick=e=>{e.stopPropagation();markPractice("phrases",cleanEs);speak(cleanEs,0.74);};
          act.appendChild(hear);attachMic(act,cleanEs,"phrases");
          swapsBox.appendChild(sRow);
        });
        body.appendChild(swapsBox);
      }
      navBtn("‹ Back",prev);navBtn("Next →",next,true);
    }
  }
  else if(step==="escucha"){
    title.textContent="👂 Listen to the conversation";
    const d=lessonDialogue(appState.lpLesson);
    const lines=d?d.versions[0].lines:[];
    lines.forEach(L=>{
      const row=lpEl("lp-line","<strong>"+L.who+":</strong> "+L.es+"<div class='lp-line-en'>"+L.en+"</div>");
      row.onclick=()=>speak(L.tts,0.75);attachMic(row,L.tts);
      body.appendChild(row);
    });
    if(lines.length)body.appendChild(lpSpeakBtn(lines.map(l=>l.tts).join(". "),"▶️ Play all"));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="respuesta"){
    const pair=lessonResponsePair(appState.lpLesson,c);
    title.textContent="🎧 Listen → respond — move from understanding to speaking";
    if(!pair){body.appendChild(lpEl("lp-hint","No response prompt is available for this lesson yet."));navBtn("‹ Back",prev);navBtn("Next →",next,true);}
    else{
      body.appendChild(lpEl("lp-activity-note","Listen for the idea, not every word. First use help, then hide the text and answer out loud in your own words."));
      const rail=lpEl("lp-response-rail");
      const stages=[["1","Slow + help"],["2","Normal speed"],["3","Respond"],["4","Compare"]];
      stages.forEach(([number,label])=>{const item=lpEl("lp-response-stage",`<span>${number}</span><small>${label}</small>`);rail.appendChild(item);});
      body.appendChild(rail);
      const promptBox=lpEl("lp-response-prompt");
      const promptEs=lpEl("lp-response-es",escapeVocabHtml(pair.questionEs));
      const promptEn=lpEl("lp-response-en",escapeVocabHtml(pair.questionEn));
      promptBox.append(promptEs,promptEn);body.appendChild(promptBox);
      const status=lpEl("lp-response-status","Step 1 · Listen slowly and notice the main idea.");status.setAttribute("aria-live","polite");body.appendChild(status);
      const actions=lpEl("lp-response-actions");
      const slow=document.createElement("button");slow.type="button";slow.className="lp-nav-btn";slow.textContent="🐢 Hear slowly";slow.onclick=()=>speak(pair.questionTts,0.55);
      const normal=document.createElement("button");normal.type="button";normal.className="lp-nav-btn";normal.textContent="🔊 Hear normally";normal.onclick=()=>speak(pair.questionTts,0.75);
      const hide=document.createElement("button");hide.type="button";hide.className="lp-nav-btn primary";hide.textContent="I understand the idea →";
      const help=document.createElement("button");help.type="button";help.className="lp-english-help";help.textContent="💡 Hide English help";
      help.setAttribute("aria-expanded","true");
      let stage=1,english=true,modelShown=false;
      const setStage=n=>{
        stage=n;
        rail.querySelectorAll(".lp-response-stage").forEach((item,i)=>item.classList.toggle("on",i<n));
        promptEs.hidden=n>=3;
        // Hide the translation when it is time to answer, but leave it
        // available through the English-help button if the learner needs it.
        if(n>=3)english=false;
        // Keep the English-help toggle authoritative at every response stage.
        // Stage 3 hides the Spanish prompt so the learner answers from memory,
        // but the learner must still be able to reveal the English help text.
        promptEn.hidden=!english;
        help.textContent=english?"🙈 Hide English help":"💡 Show English help";
        if(n===2)status.textContent="Step 2 · Hear it at normal speed. Then hide the text.";
        if(n===3)status.textContent="Step 3 · Answer out loud now. You can use any natural answer that fits.";
        if(n>=4)status.textContent="Step 4 · Compare with a natural model answer. Your wording can be different.";
      };
      hide.onclick=()=>{setStage(2);speak(pair.questionTts,0.75);};
      help.onclick=()=>{english=!english;promptEn.hidden=!english;help.textContent=english?"🙈 Hide English help":"💡 Show English help";help.setAttribute("aria-expanded",String(english));};
      actions.append(slow,normal,hide);body.appendChild(actions);body.appendChild(help);
      const responseActions=lpEl("lp-response-actions");
      const answerBtn=document.createElement("button");answerBtn.type="button";answerBtn.className="lp-nav-btn primary";answerBtn.textContent="🎙️ Record my response";answerBtn.disabled=true;
      answerBtn.onclick=()=>{setStage(3);openMicPanel(pair.answerEs);};
      const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn";reveal.textContent="Reveal model answer";reveal.disabled=true;
      reveal.onclick=()=>{modelShown=true;setStage(4);models.hidden=false;reveal.hidden=true;};
      responseActions.append(answerBtn,reveal);body.appendChild(responseActions);
      const models=lpEl("lp-response-models");models.hidden=true;
      const addModel=(model,label)=>{if(!model)return;const row=lpEl("lp-response-model",`<small>${label}</small><strong>${escapeVocabHtml(model.es)}</strong><em>${escapeVocabHtml(model.en||"")}</em>`);row.onclick=()=>speak(model.tts||model.es,0.75);attachMic(row,model.tts||model.es);models.appendChild(row);};
      addModel({es:pair.answerEs,en:pair.answerEn,tts:pair.answerTts},"Natural option 1");
      if(pair.alternate)addModel(pair.alternate,"Natural option 2");
      body.appendChild(models);
      const rating=lpEl("lp-response-rating");
      [["understood","✅ I understood"],["replay","🔁 Need replay"],["practice","🗣️ Need more practice"]].forEach(([kind,label])=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=()=>{rating.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===b));status.textContent=kind==="understood"?"Nice — keep answering without translating word by word.":kind==="replay"?"Replay slowly, then normally, and try again.":"Good choice. Repeat the model once, then answer again in your own words.";};rating.appendChild(b);});
      body.appendChild(rating);
      const unlock=()=>{answerBtn.disabled=false;reveal.disabled=false;};
      hide.addEventListener("click",unlock);normal.addEventListener("click",()=>{if(stage>=2)unlock();});
      setStage(1);speak(pair.questionTts,0.55);
      navBtn("‹ Back",prev);navBtn("Next →",next,true);
    }
  }
  else if(step==="palabras"){
    title.textContent="🔑 Key building blocks — tap, listen, repeat out loud";
    const grid=lpEl("lp-grid");
    c.words.forEach(w=>{
      const wc=lpEl("lp-word","<div class='lp-word-es'>"+w.es+"</div><div class='lp-word-en'>"+w.en+"</div><span>🔊</span>");
      wc.onclick=()=>{markPractice("phrases",w.es.replace(/\.\.\./g,""));speak(w.es.replace(/\.\.\./g,""),0.75);};attachMic(wc,w.es.replace(/\.\.\./g,""),"phrases");
      grid.appendChild(wc);
    });
    body.appendChild(grid);
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="frases"){
    title.textContent="🗣️ ¿Cómo se dice? — SAY it in Spanish out loud, then tap to check";
    c.phrases.forEach(p=>{
      const pc=lpEl("lp-prod","<div class='lp-prod-en'>"+p.en+"</div><div class='lp-prod-es lp-blur'>"+p.es+"</div>");
      pc.onclick=()=>{pc.querySelector(".lp-prod-es").classList.remove("lp-blur");speak(p.es,0.75);};attachMic(pc,p.es);
      body.appendChild(pc);
    });
    body.appendChild(lpEl("lp-hint","Say it YOURSELF out loud first. Then tap to hear and compare."));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="matching"){
    title.textContent="🧩 Match the meaning — build quick recognition";
    body.appendChild(lpEl("lp-activity-note","Tap an English meaning, then tap the matching Spanish chunk. Say each pair out loud."));
    const pairs=(c.words||[]).slice(0,4).map((w,i)=>({id:String(i),es:w.es,en:w.en}));
    const match=lpEl("lp-match");
    const status=lpEl("lp-match-status",`0 of ${pairs.length} matched`);match.appendChild(status);
    const board=lpEl("lp-match-grid");
    const enCol=lpEl("lp-match-col");enCol.appendChild(lpEl("lp-match-col-title","English"));
    const esCol=lpEl("lp-match-col");esCol.appendChild(lpEl("lp-match-col-title","Español"));
    const enButtons=[],esButtons=[];let selected=null;const matched=new Set();
    const redraw=()=>{
      const selectedId=selected&&selected.id,selectedSide=selected&&selected.side;
      enButtons.forEach(x=>{x.button.classList.toggle("matched",matched.has(x.id));x.button.classList.toggle("match-selected",selectedSide==="en"&&selectedId===x.id);x.button.disabled=matched.has(x.id);});
      esButtons.forEach(x=>{x.button.classList.toggle("matched",matched.has(x.id));x.button.classList.toggle("match-selected",selectedSide==="es"&&selectedId===x.id);x.button.disabled=matched.has(x.id);});
      status.textContent=`${matched.size} of ${pairs.length} matched`;
    };
    const message=lpEl("lp-match-feedback","Choose an English meaning first.");message.setAttribute("aria-live","polite");
    const setMatchMessage=(text,state)=>{message.textContent=text;message.dataset.state=state||"";};
    pairs.slice().sort(()=>Math.random()-0.5).forEach(p=>{const b=document.createElement("button");b.type="button";b.className="lp-match-btn";b.textContent=p.en;b.onclick=()=>{selected={id:p.id,side:"en"};setMatchMessage("Now tap the matching Spanish answer.","selected");redraw();};enButtons.push({id:p.id,button:b});enCol.appendChild(b);});
    pairs.slice().sort(()=>Math.random()-0.5).forEach(p=>{const b=document.createElement("button");b.type="button";b.className="lp-match-btn";b.textContent=p.es;b.onclick=()=>{if(!selected){setMatchMessage("Choose an English meaning first.","error");return;}const picked=selected.id;const enPair=pairs.find(x=>x.id===picked);if(selected.id===p.id){matched.add(p.id);clearSpeakingError(p.es);markPractice("phrases",p.es);selected=null;setMatchMessage(matched.size===pairs.length?"✅ Correct — all matched. Say each pair once more.":"✅ Correct match. Choose the next English meaning.","correct");}else{recordSpeakingError(p.es,"matching");selected=null;setMatchMessage("❌ Not a match. “"+(enPair?enPair.en:"That meaning")+"” goes with “"+(enPair?enPair.es:"the other Spanish phrase")+"”. Try again.","wrong");}redraw();};esButtons.push({id:p.id,button:b});esCol.appendChild(b);});
    board.append(enCol,esCol);match.append(message,board);body.appendChild(match);
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="building"){
    title.textContent="🧱 Build a sentence — then say it";
    const target=(c.phrases||[])[0];
    if(target){
      body.appendChild(lpEl("lp-activity-note","Read the English idea, tap the Spanish pieces in order, then check yourself. This is a bridge to speaking — not a typing test."));
      const builder=lpEl("lp-builder");builder.appendChild(lpEl("lp-builder-target",target.en));
      const output=lpEl("lp-builder-output","Your sentence will appear here…");const chips=lpEl("lp-builder-chips");const feedback=lpEl("lp-builder-feedback","");
      const pieces=target.es.trim().split(/\s+/).map((word,i)=>({word,i})).sort(()=>Math.random()-0.5);const chosen=[];
      const redraw=()=>{output.textContent=chosen.length?chosen.map(x=>x.word).join(" "):"Your sentence will appear here…";chips.querySelectorAll("button").forEach(b=>b.disabled=chosen.some(x=>String(x.i)===b.dataset.i));};
      pieces.forEach(p=>{const b=document.createElement("button");b.type="button";b.className="lp-builder-chip";b.textContent=p.word;b.dataset.i=String(p.i);b.onclick=()=>{chosen.push(p);redraw();};chips.appendChild(b);});
      const actions=lpEl("lp-builder-actions");const clear=document.createElement("button");clear.type="button";clear.className="lp-nav-btn";clear.textContent="↩ Clear";clear.onclick=()=>{chosen.length=0;feedback.textContent="";redraw();};
      const check=document.createElement("button");check.type="button";check.className="lp-nav-btn primary";check.textContent="Check sentence";check.onclick=()=>{const answer=chosen.map(x=>x.word).join(" ");const ok=normalizeQuizText(answer)===normalizeQuizText(target.es);if(ok){clearSpeakingError(target.es);feedback.textContent="✅ Correct — now say it out loud.";speak(target.es,0.75);}else{recordSpeakingError(target.es,"sentence builder");feedback.textContent="Keep adjusting the order, then try again. It is saved in your practice list.";}};
      const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn";hear.textContent="🔊 Hear model";hear.onclick=()=>speak(target.es,0.75);actions.append(clear,check,hear);builder.append(output,chips,feedback,actions);body.appendChild(builder);attachMic(body,target.es);
    }else body.appendChild(lpEl("lp-hint","No sentence is available for this lesson yet."));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="typing"){
    title.textContent="⌨️ Produce the Spanish — type it, then say it";
    const target=(c.phrases||[])[1]||(c.phrases||[])[0];
    if(target){
      body.appendChild(lpEl("lp-activity-note","Start from the English meaning. Type the Spanish sentence you would say, then compare and speak it."));
      const box=lpEl("lp-typing");box.appendChild(lpEl("lp-typing-prompt",target.en));
      const input=document.createElement("input");input.type="text";input.className="lp-typing-input";input.placeholder="Escribe en español…";input.autocomplete="off";input.autocapitalize="sentences";
      const actions=lpEl("lp-typing-actions");const check=document.createElement("button");check.type="button";check.className="lp-nav-btn primary";check.textContent="Check answer";const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn";hear.textContent="🔊 Hear model";hear.onclick=()=>speak(target.es,0.75);
      const feedback=lpEl("lp-typing-feedback","");check.onclick=()=>{const ok=normalizeQuizText(input.value)===normalizeQuizText(target.es);if(ok){clearSpeakingError(target.es);feedback.innerHTML="✅ Correct — say it again without reading.";speak(target.es,0.75);}else{recordSpeakingError(target.es,"typed production");feedback.innerHTML=`Keep practicing. Model: <strong>${escapeVocabHtml(target.es)}</strong><small>Saved in your practice list.</small>`;}attachMic(feedback,target.es);};actions.append(check,hear);box.append(input,actions,feedback);body.appendChild(box);
    }else body.appendChild(lpEl("lp-hint","No typing prompt is available for this lesson yet."));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="estructura"){
    title.textContent="🧱 Understand the pattern first — how sentences snap together";
    const ids=appState.lpLesson.guideIds||["estructura"];
    ids.map(id=>SPEAKING_GUIDE.find(g=>g.id===id)).filter(Boolean).forEach(g=>{
      const box=lpEl("lp-structure-guide");
      box.innerHTML=`<div class="lp-structure-title">${escapeVocabHtml(g.title)}</div><div class="lp-structure-formula">${escapeVocabHtml(g.formula)}</div><div class="lp-structure-text">${escapeVocabHtml(g.explain)}</div><div class="lp-structure-mistake">⚠️ ${escapeVocabHtml(g.mistake)}</div>`;
      (g.examples||[]).forEach(ex=>{const row=lpEl("lp-structure-example",`<strong>${escapeVocabHtml(ex.es)}</strong><small>${escapeVocabHtml(ex.en)}</small>`);row.onclick=()=>speak(ex.tts||ex.es,0.75);attachMic(row,ex.tts||ex.es);box.appendChild(row);});
      box.appendChild(lpEl("lp-hint","Speaking drill: "+g.exercise));body.appendChild(box);
    });
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="hablaA"||step==="hablaB"){
    const who=step==="hablaA"?"B":"A"; /* Default to B in hablaA so Person A speaks first! */
    title.textContent=`🎭 Roleplay — you are Person ${who}`;
    const simControls=lpEl("lp-role-controls");
    const simBtn=document.createElement("button");simBtn.type="button";simBtn.className="lp-mode-btn"+(lpRoleSim?" active":"");simBtn.textContent="💬 Turn-by-Turn Simulator";
    simBtn.onclick=()=>{lpRoleSim=true;lpRoleTurn=0;renderLessonStep();};
    const scriptBtn=document.createElement("button");scriptBtn.type="button";scriptBtn.className="lp-mode-btn"+(!lpRoleSim?" active":"");scriptBtn.textContent="📜 Full Script";
    scriptBtn.onclick=()=>{lpRoleSim=false;renderLessonStep();};
    const switchRoleBtn=document.createElement("button");switchRoleBtn.type="button";switchRoleBtn.className="lp-mode-btn";switchRoleBtn.textContent=`🔄 Switch to Person ${who==="A"?"B":"A"}`;
    switchRoleBtn.onclick=()=>{lpSteps[lpStep]=step==="hablaA"?"hablaB":"hablaA";lpRoleTurn=0;renderLessonStep();};
    simControls.append(simBtn,scriptBtn,switchRoleBtn);body.appendChild(simControls);

    const d=lessonDialogue(appState.lpLesson);
    const lines=d?d.versions[0].lines:[];
    if(lpRoleSim&&lines.length){
      const currentIdx=Math.min(lpRoleTurn,lines.length-1);
      const historyWrap=lpEl("lp-sim-history");
      for(let i=0;i<=currentIdx;i++){
        const L=lines[i];
        const isMe=L.who===who;
        const isCurrent=i===currentIdx;
        const row=lpEl("lp-chat-message"+(isMe?" me":" partner")+(isCurrent?" current":""));
        if(isMe&&isCurrent){
          row.innerHTML=`<div class="lp-chat-avatar">👤</div><div class="lp-chat-bubble"><div class="lp-sim-prompt-tag">🎯 YOUR TURN · Person ${who}</div><div class="lp-sim-intent">“${escapeVocabHtml(L.en)}”</div><div class="lp-line-es lp-blur">${escapeVocabHtml(L.es)}</div><div class="lp-sim-actions"></div></div>`;
          const act=row.querySelector(".lp-sim-actions");
          const revealBtn=document.createElement("button");revealBtn.type="button";revealBtn.className="warmup-btn";revealBtn.textContent="👀 Reveal & Hear Spanish";
          revealBtn.onclick=e=>{
            e.stopPropagation();
            row.querySelector(".lp-line-es").classList.remove("lp-blur");
            markPractice("phrases",L.es);
            speak(L.tts,0.75);
          };
          act.appendChild(revealBtn);
          attachMic(act,L.tts,"phrases");
        }else{
          row.innerHTML=`<div class="lp-chat-avatar">${L.who===who?"👤":"🗣️"}</div><div class="lp-chat-bubble"><strong>${L.who===who?"You":"Partner"}</strong><span class='lp-line-es'>${escapeVocabHtml(L.es)}</span><div class='lp-line-en'>${escapeVocabHtml(L.en)}</div></div>`;
          row.querySelector(".lp-chat-bubble").onclick=()=>speak(L.tts,0.75);
          attachMic(row,L.tts,"phrases");
        }
        historyWrap.appendChild(row);
      }
      body.appendChild(historyWrap);
      const curLine=lines[currentIdx];
      const turnNav=lpEl("lp-sim-turn-nav");
      if(currentIdx<lines.length-1){
        const nextTurn=document.createElement("button");nextTurn.type="button";nextTurn.className="lp-nav-btn primary";
        nextTurn.textContent=curLine.who===who?"✅ I said my line — next turn →":"🔊 Continue to next turn →";
        nextTurn.onclick=()=>{
          lpRoleTurn=currentIdx+1;
          const nl=lines[lpRoleTurn];
          renderLessonStep();
          if(nl&&nl.who!==who)speak(nl.tts,0.75);
        };
        turnNav.appendChild(nextTurn);
      }else{
        const restartSim=document.createElement("button");restartSim.type="button";restartSim.className="lp-nav-btn";
        restartSim.textContent="🔁 Replay conversation";
        restartSim.onclick=()=>{lpRoleTurn=0;renderLessonStep();};
        turnNav.appendChild(restartSim);
      }
      body.appendChild(turnNav);
    }else{
      const help=document.createElement("button");help.type="button";help.className="lp-english-help";help.textContent="💡 Show English help";help.setAttribute("aria-expanded","false");let englishShown=false;
      help.onclick=()=>{englishShown=!englishShown;body.querySelectorAll(".lp-line-en").forEach(x=>x.hidden=!englishShown);help.textContent=englishShown?"🙈 Hide English help":"💡 Show English help";help.setAttribute("aria-expanded",String(englishShown));};body.appendChild(help);
      lines.forEach(L=>{
        const hidden=L.who===who;
        const row=lpEl("lp-line"+(hidden?" lp-me":""),"<strong>"+L.who+":</strong> <span class='lp-line-es"+(hidden?" lp-blur":"")+"'>"+L.es+"</span><div class='lp-line-en' hidden>"+L.en+"</div>");
        row.onclick=()=>{
          const esEl=row.querySelector(".lp-line-es");
          if(esEl.classList.contains("lp-blur"))esEl.classList.remove("lp-blur");
          speak(L.tts,0.75);
        };
        attachMic(row,L.tts);
        body.appendChild(row);
      });
    }
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="pronun"){
    title.textContent="🎙️ Pronunciation — say each phrase, then record & compare";
    const items=[{es:c.goal.es,en:c.goal.en},...c.phrases];
    items.forEach(p=>{
      const done=lpPracticed.has(p.es);
      const row=lpEl("pronun-row"+(done?" done":""));
      row.dataset.mt=p.es;
      row.innerHTML="<div class='pronun-check'>"+(done?"✅":"⭕")+"</div><div class='pronun-copy'><div class='pronun-es'>"+p.es+"</div><div class='pronun-en'>"+p.en+"</div></div>";
      const mb=document.createElement("button");mb.type="button";mb.className="pronun-mic";mb.textContent="🎙️";
      mb.onclick=e=>{e.stopPropagation();openMicPanel(p.es);};
      row.appendChild(mb);
      row.onclick=()=>speak(p.es,0.75);
      body.appendChild(row);
    });
    body.appendChild(lpEl("lp-hint","Tap the mic on each phrase: record yourself, compare with the model. Green checks show what you practiced. You can continue anytime."));
    navBtn("Back",prev);navBtn("Next",next,true);
  }
  else if(step==="quiz"){
    const q=lpQs[lpQi];
    title.textContent="🧪 Mini-quiz "+(lpQi+1)+" of "+lpQs.length+" — "+q.label;
    body.appendChild(lpEl("lp-quiz-prompt",q.prompt));
    if(q.autoTts)speak(q.autoTts,0.7);
    const fb=lpEl("lp-quiz-fb","");fb.classList.add("feedback-tray");
    const grid=lpEl("lp-grid lp-quiz-grid");
    q.options.forEach(opt=>{
      const b=document.createElement("button");b.type="button";b.className="lp-opt";b.textContent=opt;
      b.onclick=()=>{
        if(lpAnswered)return;lpAnswered=true;
        if(quizAnswerMatches(q,opt)){b.classList.add("correct");clearSpeakingError(q.revEs);lpScore++;fb.innerHTML="✅ ¡Correcto! <div class='lp-reveal'>📖 "+q.revEs+" — "+q.revEn+"</div>";speak(q.afterTts,0.75);}
        else{b.classList.add("wrong");recordSpeakingError(q.revEs,"lesson quiz");grid.querySelectorAll(".lp-opt").forEach(x=>{if(x.textContent===q.answer)x.classList.add("reveal");});fb.innerHTML="❌ Not quite. <div class='lp-reveal'>📖 "+q.revEs+" — "+q.revEn+"</div><small>Saved in your practice list.</small>";}
        fb.classList.add("visible");
        attachMic(fb,q.revEs);
        navBtn(lpQi<lpQs.length-1?"Next question →":"Finish →",()=>{
          if(lpQi<lpQs.length-1){lpQi++;lpAnswered=false;renderLessonStep();}
          else{lpStep++;lpAnswered=false;renderLessonStep();}
        },true);
      };
      grid.appendChild(b);
    });
    body.appendChild(grid);body.appendChild(fb);
  }
  else if(step==="lectura"){
    const reading=READINGS.find(r=>r.id===appState.lpLesson.readingId)||READINGS.find(r=>r.lesson===appState.lpLesson.id)||READINGS[0];
    title.textContent="📖 Read aloud for meaning";
    body.appendChild(lpEl("lp-hint",`${reading.title} · Read it aloud once, then listen and shadow it at your own pace.`));
    (reading.lines||[]).forEach(line=>{const row=lpEl("lp-line",`<span>${escapeVocabHtml(line.es)}</span><div class='lp-line-en'>${escapeVocabHtml(line.en)}</div>`);row.onclick=()=>speak(line.tts||line.es,0.75);attachMic(row,line.tts||line.es);body.appendChild(row);});
    const open=document.createElement("button");open.type="button";open.className="lp-nav-btn primary";open.textContent="📖 Read & shadow full passage";open.onclick=()=>renderReading(reading);body.appendChild(open);
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="mision"){
    const mission=CONVERSATION_MISSIONS.find(m=>m.id===appState.lpLesson.missionId)||CONVERSATION_MISSIONS.find(m=>m.lesson===appState.lpLesson.id)||CONVERSATION_MISSIONS[0];
    title.textContent="🗣️ Speaking mission — answer before looking";
    body.appendChild(lpEl("mission-title",mission.title));body.appendChild(lpEl("mission-scenario",mission.scenario));body.appendChild(lpEl("mission-prompt",mission.prompt));
    /* v39: optional sentence builder. It gives a learner a bridge from
       knowing words to producing a complete response, without replacing the
       open-ended speaking mission. */
    const target=(mission.models&&mission.models[0]&&mission.models[0].es)||"";
    if(target){
      const builder=lpEl("mission-builder");
      builder.appendChild(lpEl("mission-builder-title","🧩 Optional: build the sentence first"));
      builder.appendChild(lpEl("mission-builder-help","Tap the pieces in order, then say your sentence out loud. This is a speaking scaffold, not a spelling test."));
      const builtBox=lpEl("mission-built","Your sentence will appear here…");
      const chipBox=lpEl("mission-chips");
      const words=target.trim().split(/\s+/).map((word,i)=>({word,i})).sort(()=>Math.random()-0.5);
      const built=[];
      const redraw=()=>{
        builtBox.textContent=built.length?built.map(x=>x.word).join(" "):"Your sentence will appear here…";
        chipBox.querySelectorAll("button").forEach(b=>b.disabled=built.some(x=>String(x.i)===b.dataset.i));
      };
      words.forEach(({word,i})=>{const b=document.createElement("button");b.type="button";b.className="mission-chip";b.textContent=word;b.dataset.i=String(i);b.onclick=()=>{built.push({word,i});redraw();};chipBox.appendChild(b);});
      builder.appendChild(builtBox);builder.appendChild(chipBox);
      const builderActions=lpEl("mission-builder-actions");
      const clear=document.createElement("button");clear.type="button";clear.className="lp-nav-btn";clear.textContent="↩ Clear";clear.onclick=()=>{built.length=0;redraw();};
      const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn";hear.textContent="🔊 Hear model";hear.onclick=()=>speak(target,0.75);
      const record=document.createElement("button");record.type="button";record.className="lp-nav-btn";record.textContent="🎙️ Compare";record.onclick=()=>openMicPanel(built.length?built.map(x=>x.word).join(" "):target);
      builderActions.append(clear,hear,record);builder.appendChild(builderActions);body.appendChild(builder);
    }
    const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn primary";reveal.textContent="👀 Reveal 2 natural answers";
    const models=lpEl("mission-models");models.hidden=true;
    reveal.onclick=()=>{models.hidden=false;reveal.remove();};body.appendChild(reveal);
    (mission.models||[]).forEach(m=>{const row=lpEl("mission-model",`<div class='mission-model-label'>Natural option</div><div class='mission-model-es'>${escapeVocabHtml(m.es)}</div><div class='mission-model-en'>${escapeVocabHtml(m.en)}</div>`);row.onclick=()=>speak(m.tts||m.es,0.75);attachMic(row,m.tts||m.es);models.appendChild(row);});
    body.appendChild(models);
    const done=document.createElement("button");done.type="button";done.className="lesson-start";done.textContent="✅ I answered out loud";done.onclick=()=>{missionProgress[mission.id]=true;saveMissions();done.textContent="✅ Saved — practice it again anytime";};body.appendChild(done);
    navBtn("‹ Back",prev);navBtn("Finish lesson →",next,true);
  }
  else{
    title.textContent="🎉 Lesson complete!";
    const completion=lpEl("lp-completion-hero");
    completion.innerHTML=`<div class="lp-completion-emoji">🎉</div><strong>¡Muy bien!</strong><span>You completed this lesson.</span><div class="lp-completion-stats"><span><b>${lpPracticed.size}</b><small>spoken</small></span><span><b>${lpFullMode&&lpQs.length?`${lpScore}/${lpQs.length}`:"—"}</b><small>quiz</small></span><span><b>🔥</b><small>keep going</small></span></div>`;
    body.appendChild(completion);
    if(lpFullMode&&lpQs.length)body.appendChild(lpEl("lp-goal-es","Mini-quiz: "+lpScore+" of "+lpQs.length));
    if(c){body.appendChild(lpEl("lp-hint","You can now say:"));body.appendChild(lpEl("lp-goal-es",c.goal.es));body.appendChild(lpSpeakBtn(c.goal.es));attachMic(body,c.goal.es);}
    lessonProgress[appState.lpLesson.id]=true;saveLessons();
    if(c){
      const bonus=lpEl("lp-explore","<div class='lp-hint'>➕ Optional bonus drills for this lesson:</div><div class='lp-bonus-grid'></div>");
      const bGrid=bonus.querySelector(".lp-bonus-grid");
      [
        ["🗣️ Flash phrases","frases"],
        ["🧩 Match pairs","matching"],
        ["🧱 Word chips","building"],
        ["⌨️ Type Spanish","typing"],
        ["🎙️ Pronunciation","pronun"],
        ["📖 Reading","lectura"],
        ["🧪 Mini-quiz","quiz"]
      ].forEach(([lbl,st])=>{
        const b=document.createElement("button");b.type="button";b.className="lp-nav-btn";b.textContent=lbl;b.onclick=()=>openBonusStep(st);bGrid.appendChild(b);
      });
      body.appendChild(bonus);
    }
    const explore=lpEl("lp-explore","<div class='lp-hint'>Explore more:</div>");
    const mk=(label,fn)=>{const b=document.createElement("button");b.type="button";b.className="lp-nav-btn";b.textContent=label;b.onclick=fn;explore.appendChild(b);};
    mk("📚 Vocabulary",()=>{showPage("vocab");actions.sCat(appState.lpLesson.vocab);});
    mk("📖 Read & shadow",()=>{const reading=READINGS.find(r=>r.id===appState.lpLesson.readingId)||READINGS.find(r=>r.lesson===appState.lpLesson.id)||READINGS[0];renderReading(reading);});
    mk("💬 Full conversation",()=>{showPage("frases");const d=lessonDialogue(appState.lpLesson);if(d)actions.renderFraseDialogue(d);});
    mk("🧪 Full quiz",()=>{showPage("quiz");appState.qMissedOnly=false;appState.qCat=appState.lpLesson.quizCat;appState.qMode=appState.lpLesson.quizMode||"mixed";appState.qFocus=appState.lpLesson.quizFocus||"all";appState.repasoLeft=0;actions.resetQuizRound();actions.syncQuizControls();actions.nQ();});
    body.appendChild(explore);
    navBtn("Back to lessons",()=>{appState.lpLesson=null;},true);
  }
}
/* ═══════════════════════════════════════════════════════════════════════════
   Lesson Resume (v21) — pick up exactly where you left off
   ═══════════════════════════════════════════════════════════════════════════ */
const RESUME_KEY="esco-lesson-resume-v1";
function saveResume(){
  try{
    if(appState.lpLesson&&lpSteps[lpStep]&&lpSteps[lpStep]!=="fin")
      appStorage.setItem(RESUME_KEY,JSON.stringify({id:appState.lpLesson.id,step:lpStep,qi:lpQi,score:lpScore}));
    else appStorage.removeItem(RESUME_KEY);
  }catch(e){}
}
function loadResume(){
  try{const r=JSON.parse(appStorage.getItem(RESUME_KEY)||"null");return r&&r.id?r:null;}catch(e){return null;}
}
export function openLessonAt(lesson,step,qi,score){
  openLesson(lesson);
  lpStep=Math.min(Math.max(step|0,0),lpSteps.length-1);
  lpQi=Math.min(Math.max(qi|0,0),Math.max(lpQs.length-1,0));
  lpScore=Math.max(score|0,0);
  renderLessonStep();
}

/* ═══════════════════════════════════════════════════════════════════════════
   Reacción Rápida (v21) — answer OUT LOUD under mild time pressure.
   Question bank auto-built from every question→answer pair in the conversations.
   Forgiving by design: reveal early anytime, retry anytime, no grading.
   ═══════════════════════════════════════════════════════════════════════════ */
let rrTimer=null,rrCurrent=null,rrSession=0,rrPromptToken=0;
let rrRecorder=null,rrStream=null,rrChunks=[],rrUrl=null,rrSilenceTimer=null,rrMaxTimer=null,rrAudioContext=null,rrAnalyser=null,rrRated=false;
const RR_DIFFICULTY_KEY="esco-rapid-difficulty-v1";
const RR_DIFFICULTIES={
  easy:{label:"Easy",seconds:8,description:"More time · shorter prompts"},
  moderate:{label:"Moderate",seconds:5,description:"Balanced speaking pace"},
  challenge:{label:"Challenge",seconds:3,description:"Quick conversation pressure"}
};
let rrDifficulty="moderate";
try{const saved=appStorage.getItem(RR_DIFFICULTY_KEY);if(RR_DIFFICULTIES[saved])rrDifficulty=saved;}catch(e){}
function rrSaveDifficulty(){try{appStorage.setItem(RR_DIFFICULTY_KEY,rrDifficulty);}catch(e){}}
function rrDifficultyConfig(){return RR_DIFFICULTIES[rrDifficulty]||RR_DIFFICULTIES.moderate;}
let rrPack="all";
function rrQuestionPool(){
  const level=rrDifficulty;
  const source=rrPack==="service"?RR_BANK.filter(item=>item.service):RR_BANK;
  const matching=source.filter(item=>item.level===level);
  return matching.length>=3?matching:source;
}
const RR_STATS_KEY="esco-rapid-stats-v1";
let rrStats={attempts:0,got:0,practice:0,skipped:0};
try{rrStats=Object.assign(rrStats,JSON.parse(appStorage.getItem(RR_STATS_KEY)||"{}"));}catch(e){}
function saveRRStats(){try{appStorage.setItem(RR_STATS_KEY,JSON.stringify(rrStats));}catch(e){}}
function rrClearRecording(){if(rrUrl){try{URL.revokeObjectURL(rrUrl);}catch(e){}rrUrl=null;}rrChunks=[];}
function rrStopStream(){if(rrStream){rrStream.getTracks().forEach(t=>t.stop());rrStream=null;}}
function rrCloseAudio(){if(rrAudioContext){try{rrAudioContext.close();}catch(e){}rrAudioContext=null;}rrAnalyser=null;}
function rrCancelRecording(){
  if(rrSilenceTimer){clearInterval(rrSilenceTimer);rrSilenceTimer=null;}
  if(rrMaxTimer){clearTimeout(rrMaxTimer);rrMaxTimer=null;}
  if(rrRecorder){try{rrRecorder.onstop=null;if(rrRecorder.state==="recording")rrRecorder.stop();}catch(e){}rrRecorder=null;}
  rrStopStream();rrCloseAudio();
}
export function rrStop(){
  const wasActive=!!(rrTimer||rrRecorder||rrStream);
  rrPromptToken++;
  if(rrTimer){clearInterval(rrTimer);rrTimer=null;}
  rrCancelRecording();
  if(wasActive){if(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending))window.speechSynthesis.cancel();if(typeof ttsAudio!=="undefined"&&ttsAudio){try{ttsAudio.pause();}catch(e){}}}
}
export function rrExit(){rrStop();}
function rrSetStatus(text,cls){
  const cd=document.querySelector("#lesson-list .rr-countdown");
  const hint=document.querySelector("#lesson-list .rr-recording-note");
  if(cd)cd.textContent=text;
  if(hint){hint.textContent=cls==="recording"?"🔴 Grabando… habla de forma natural. Se detendrá después de una pausa.":text;hint.className="rr-recording-note "+(cls||"");}
}
function rrStopRecording(){
  if(rrRecorder&&rrRecorder.state==="recording"){
    rrSetStatus("⏳","recording");
    try{rrRecorder.stop();}catch(e){rrReveal("mic-error");}
  }
}
async function rrBeginRecording(token){
  if(token!==rrPromptToken)return;
  if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder)){rrReveal("mic-unavailable");return;}
  rrSetStatus("🔴","recording");
  try{
    rrStream=await navigator.mediaDevices.getUserMedia({audio:true});
    if(token!==rrPromptToken){rrStopStream();return;}
    rrChunks=[];
    rrRecorder=new MediaRecorder(rrStream);
    rrRecorder.ondataavailable=e=>{if(e.data&&e.data.size)rrChunks.push(e.data);};
    rrRecorder.onstop=()=>{
      const blob=new Blob(rrChunks,{type:(rrRecorder&&rrRecorder.mimeType)||"audio/mp4"});
      rrUrl=URL.createObjectURL(blob);
      rrRecorder=null;rrStopStream();rrCloseAudio();
      if(rrSilenceTimer){clearInterval(rrSilenceTimer);rrSilenceTimer=null;}
      if(rrMaxTimer){clearTimeout(rrMaxTimer);rrMaxTimer=null;}
      if(token===rrPromptToken)rrReveal("recorded");else rrClearRecording();
    };
    rrRecorder.onerror=()=>{rrReveal("mic-error");};
    rrRecorder.start();
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    let heard=false,lastLoud=Date.now();
    if(AudioCtx){
      try{
        rrAudioContext=new AudioCtx();
        const source=rrAudioContext.createMediaStreamSource(rrStream);
        rrAnalyser=rrAudioContext.createAnalyser();rrAnalyser.fftSize=512;source.connect(rrAnalyser);
        const data=new Uint8Array(rrAnalyser.fftSize);
        rrSilenceTimer=setInterval(()=>{
          if(!rrAnalyser||!rrRecorder||rrRecorder.state!=="recording")return;
          rrAnalyser.getByteTimeDomainData(data);let sum=0;
          for(let i=0;i<data.length;i++){const n=(data[i]-128)/128;sum+=n*n;}
          const rms=Math.sqrt(sum/data.length);const now=Date.now();
          if(rms>.035){heard=true;lastLoud=now;}
          if(heard&&now-lastLoud>1100)rrStopRecording();
        },100);
      }catch(e){rrCloseAudio();}
    }
    rrMaxTimer=setTimeout(()=>rrStopRecording(),8000);
  }catch(e){rrStopStream();rrCloseAudio();rrReveal("mic-error");}
}
export function renderRapida(keepSame,questionRate){
  rrStop();
  rrClearRecording();rrRated=false;
  const promptToken=rrPromptToken;
  const root=document.getElementById("lesson-list");if(!root)return;
  if(!RR_BANK.length){return;}
  setLeccionesFocusMode(true);
  const pace=rrDifficultyConfig();
  const pool=rrQuestionPool();
  if(!keepSame||!rrCurrent||!pool.includes(rrCurrent)){rrCurrent=pool[Math.floor(Math.random()*pool.length)];rrSession++;}
  root.innerHTML="";
  const back=document.createElement("button");back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=rrExit;
  root.appendChild(back);
  const card=lpEl("lp-card rr-card");
  card.appendChild(lpEl("lp-step-title",`⚡ Reacción Rápida · ${pace.label} — question ${rrSession} this session`));
  const difficultyRow=lpEl("rr-difficulty-row");
  const difficultyLabel=lpEl("rr-difficulty-label","Choose your speaking pace");difficultyRow.appendChild(difficultyLabel);
  const difficultyButtons=lpEl("rr-difficulty-buttons");
  Object.entries(RR_DIFFICULTIES).forEach(([key,config])=>{
    const b=document.createElement("button");b.type="button";b.className="rr-difficulty-btn";b.classList.toggle("selected",key===rrDifficulty);b.dataset.difficulty=key;
    b.innerHTML=`<strong>${config.label}</strong><small>${config.seconds}s · ${config.description.split(" · ")[0]}</small>`;
    b.onclick=()=>{if(key===rrDifficulty)return;rrDifficulty=key;rrSaveDifficulty();renderRapida(false);};
    difficultyButtons.appendChild(b);
  });
  difficultyRow.appendChild(difficultyButtons);card.appendChild(difficultyRow);
  const packRow=lpEl("rr-pack-row");
  packRow.appendChild(lpEl("rr-pack-label","Choose a prompt pack"));
  const packButtons=lpEl("rr-pack-buttons");
  [["all","All conversation prompts"],["service","🇨🇴 Colombian counter reflexes"]].forEach(([key,label])=>{
    const b=document.createElement("button");b.type="button";b.className="rr-pack-btn"+(key===rrPack?" selected":"");b.textContent=label;
    b.onclick=()=>{if(key===rrPack)return;rrPack=key;rrCurrent=null;renderRapida(false);};packButtons.appendChild(b);
  });
  packRow.appendChild(packButtons);card.appendChild(packRow);
  const qBox=lpEl("rr-question",rrCurrent.qEs);
  qBox.onclick=()=>speak(rrCurrent.q,0.75);
  card.appendChild(qBox);
  if(rrCurrent.qEn){
    const qHelp=lpEl("rr-qen rr-qen-help",rrCurrent.qEn);qHelp.hidden=true;qHelp.id="rr-question-help";card.appendChild(qHelp);
    const helpBtn=document.createElement("button");helpBtn.type="button";helpBtn.className="rr-help-toggle";helpBtn.textContent="💡 Show English help";
    helpBtn.onclick=()=>{qHelp.hidden=!qHelp.hidden;helpBtn.textContent=qHelp.hidden?"💡 Show English help":"🙈 Hide English help";};card.appendChild(helpBtn);
  }
  const cd=lpEl("rr-countdown","🎧");
  card.appendChild(cd);
  card.appendChild(lpEl("lp-hint",`🗣️ Answer OUT LOUD — any answer that fits. You get ${pace.seconds} seconds to think, then your microphone starts automatically.`));
  const controls=lpEl("lp-nav");
  const repeatBtn=document.createElement("button");repeatBtn.type="button";repeatBtn.className="lp-nav-btn";repeatBtn.textContent="🔁 Repeat question";
  repeatBtn.onclick=()=>renderRapida(true);
  const slowBtn=document.createElement("button");slowBtn.type="button";slowBtn.className="lp-nav-btn";slowBtn.textContent="🐢 Hear slower";
  slowBtn.onclick=()=>renderRapida(true,0.5);
  const revealBtn=document.createElement("button");revealBtn.type="button";revealBtn.className="lp-nav-btn";revealBtn.textContent="Reveal without recording";
  revealBtn.onclick=()=>rrReveal("skipped");
  controls.append(repeatBtn,slowBtn);
  controls.appendChild(revealBtn);
  card.appendChild(controls);
  const recNote=lpEl("rr-recording-note","After the countdown, recording starts automatically.");recNote.className="rr-recording-note";card.appendChild(recNote);
  root.appendChild(card);
  let n=pace.seconds;
  cd.textContent=String(n);
  const startCountdown=()=>{
    if(promptToken!==rrPromptToken)return;
    n=pace.seconds;
    cd.textContent=String(n);
    rrTimer=setInterval(()=>{
      n--;
      if(n<=0){clearInterval(rrTimer);rrTimer=null;cd.textContent="🔴";rrBeginRecording(promptToken);return;}
      cd.textContent=String(n);
    },1000);
  };
  speak(rrCurrent.q,typeof questionRate==="number"?questionRate:0.75,startCountdown);
}
function rrReveal(reason){
  rrStop();
  const root=document.getElementById("lesson-list");if(!root||!rrCurrent)return;
  root.innerHTML="";
  const back=document.createElement("button");back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=rrExit;
  root.appendChild(back);
  const card=lpEl("lp-card rr-card");
  card.appendChild(lpEl("lp-step-title","⚡ Reacción Rápida — model answer"));
  card.appendChild(lpEl("rr-question rr-q-small",rrCurrent.qEs));
  if(reason==="recorded"){
    const mine=lpEl("rr-my-answer","✅ Your answer was recorded. Listen once, then compare with the model.");
    const mineBtn=document.createElement("button");mineBtn.type="button";mineBtn.className="lp-nav-btn";mineBtn.textContent="▶️ Your answer";mineBtn.onclick=()=>{if(rrUrl)try{new Audio(rrUrl).play();}catch(e){}};
    mine.appendChild(mineBtn);card.appendChild(mine);
  }else if(reason==="mic-unavailable")card.appendChild(lpEl("rr-recording-note","Microphone recording is not available here, so this round stays honor-system. You can still answer out loud and compare with the model."));
  else if(reason==="mic-error")card.appendChild(lpEl("rr-recording-note","I could not access the microphone. Check browser microphone permission, then try again."));
  else if(reason==="skipped")card.appendChild(lpEl("rr-recording-note","You revealed the answer before recording. Try the next one when you are ready to speak."));
  const ans=lpEl("rr-answer",rrCurrent.aEs);
  ans.onclick=()=>speak(rrCurrent.aTts,0.75);
  card.appendChild(ans);
  card.appendChild(lpEl("rr-qen",rrCurrent.aEn||""));
  card.appendChild(lpEl("lp-hint","There is no automatic grade: choose honestly. The goal is to respond naturally, not to repeat one perfect sentence."));
  const row1=lpEl("lp-nav");
  const hearB=document.createElement("button");hearB.type="button";hearB.className="lp-nav-btn";hearB.textContent="🔊 Model";
  hearB.onclick=()=>speak(rrCurrent.aTts,0.75);
  row1.appendChild(hearB);
  card.appendChild(row1);
  const rating=lpEl("rr-rating");
  [["got","✅ I got it"],["practice","🔁 Need more practice"],["skipped","⏭️ I didn’t answer"]].forEach(([kind,label])=>{
    const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=()=>rrRate(kind);b.dataset.rate=kind;rating.appendChild(b);
  });
  card.appendChild(rating);card.appendChild(lpEl("rr-rate-status","Self-rating only — this never pretends to score your pronunciation."));
  const row2=lpEl("lp-nav");
  const sameB=document.createElement("button");sameB.type="button";sameB.className="lp-nav-btn";sameB.textContent="🔁 Try again";
  sameB.onclick=()=>renderRapida(true);
  const nextB=document.createElement("button");nextB.type="button";nextB.className="lp-nav-btn primary";nextB.textContent="➡️ Next question";
  nextB.onclick=()=>renderRapida(false);
  row2.appendChild(sameB);row2.appendChild(nextB);
  card.appendChild(row2);
  root.appendChild(card);
  speak(rrCurrent.aTts,0.75);
}
function rrRate(kind){
  if(!rrRated){rrRated=true;rrStats.attempts++;if(kind==="got")rrStats.got++;if(kind==="practice")rrStats.practice++;if(kind==="skipped")rrStats.skipped++;saveRRStats();}
  if(kind==="got")clearSpeakingError(rrCurrent&&rrCurrent.qEs);
  else if(kind==="practice"||kind==="skipped")recordSpeakingError(rrCurrent&&rrCurrent.qEs,"rapid response");
  document.querySelectorAll(".rr-rating button").forEach(b=>b.classList.toggle("selected",b.dataset.rate===kind));
  const status=document.querySelector(".rr-rate-status");
  if(status)status.textContent=kind==="got"?"Nice — keep that response available for real conversation.":kind==="practice"?"Good choice. Try the same question again and say it a little more smoothly.":"No problem. Listen to the model, then take the next question when ready.";
}

/* v34 spaced repetition: due dates replace the old forever-missed weighting. */
export function renderSpeakingErrorJournal(root){
  const entries=Object.values(speakingErrors||{}).sort((a,b)=>((b.starred?1:0)-(a.starred?1:0))||((b.last||0)-(a.last||0)));
  const card=document.createElement("details");card.className="error-journal-fold";card.dataset.lessonView="today";
  if(entries.length>0)card.open=true;
  card.innerHTML=`<summary class="error-journal-summary"><span>⭐ <strong>Saved & tricky phrases</strong> <small>${entries.length?`${entries.length} phrase${entries.length===1?"":"s"} pinned or queued`:"Tap ☆ on any phrase to pin it here"}</small></span><span class="error-journal-count">${entries.length}</span></summary>`;
  const list=document.createElement("div");list.className="error-journal-list";
  if(!entries.length){const empty=document.createElement("div");empty.className="error-journal-empty";empty.textContent="Your list is empty. Tap ☆ on any phrase, Colombianismo, or dialogue line (or miss a quiz question) to save it here.";list.appendChild(empty);}
  else{
    let drillIdx=0;
    const drillBar=document.createElement("div");drillBar.className="error-journal-drill-bar";
    const drillBtn=document.createElement("button");drillBtn.type="button";drillBtn.className="lp-nav-btn primary error-journal-drill-btn";
    drillBtn.textContent=`🔊 Speak through my list (1/${Math.min(entries.length,12)})`;
    drillBtn.onclick=()=>{
      const pool=entries.slice(0,12);
      const cur=pool[drillIdx%pool.length];
      speak(cur.text,0.75);
      drillIdx=(drillIdx+1)%pool.length;
      drillBtn.textContent=`🔊 Speak next (${drillIdx+1}/${pool.length}): "${cur.text.slice(0,26)}${cur.text.length>26?"…":""}"`;
    };
    drillBar.appendChild(drillBtn);
    list.appendChild(drillBar);
  }
  entries.slice(0,12).forEach(item=>{
    const row=document.createElement("div");row.className="error-journal-row";
    const copy=document.createElement("div");copy.className="error-journal-copy";copy.innerHTML=`<strong>${item.starred?"⭐ ":""}${escapeVocabHtml(item.text)}</strong><small>${escapeVocabHtml(item.source||"practice")}${item.starred?" · pinned":` · ${item.count||1} attempt${(item.count||1)===1?"":"s"}`}</small>`;
    copy.style.cursor="pointer";copy.onclick=()=>speak(item.text,0.75);
    const actions=document.createElement("div");actions.className="error-journal-actions";
    const hear=document.createElement("button");hear.type="button";hear.className="error-journal-btn";hear.textContent="🔊";hear.title="Hear sentence";hear.setAttribute("aria-label","Hear sentence");hear.onclick=()=>speak(item.text,0.75);
    const record=document.createElement("button");record.type="button";record.className="error-journal-btn";record.textContent="🎙️";record.title="Record yourself";record.setAttribute("aria-label","Record yourself");record.onclick=()=>openMicPanel(item.text);
    const done=document.createElement("button");done.type="button";done.className="error-journal-btn done";done.textContent="✓";done.title="Remove from practice list";done.setAttribute("aria-label","Remove from practice list");done.onclick=()=>{clearSpeakingError(item.text);};
    actions.append(hear,record,done);row.append(copy,actions);list.appendChild(row);
  });
  card.appendChild(list);root.appendChild(card);
}
export function renderMission(mission){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");if(!root)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=renderLessons;root.appendChild(back);
  const card=lpEl("lp-card mission-card");card.appendChild(lpEl("lp-step-title","🗣️ Conversation mission"));card.appendChild(lpEl("mission-title",mission.title));card.appendChild(lpEl("mission-scenario",mission.scenario));card.appendChild(lpEl("mission-prompt",mission.prompt));
  const say=lpEl("mission-say","Answer out loud before looking at the examples.");card.appendChild(say);
  const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn primary";reveal.textContent="👀 Reveal natural answers";
  const models=document.createElement("div");models.className="mission-models";models.hidden=true;
  reveal.onclick=()=>{say.textContent="Compare your idea with these natural Colombian answers:";reveal.remove();models.hidden=false;};card.appendChild(reveal);
  (mission.models||[]).forEach((m,i)=>{const row=document.createElement("div");row.className="mission-model";row.innerHTML=`<div class="mission-model-label">Natural option ${i+1}</div><div class="mission-model-es">${escapeVocabHtml(m.es)}</div><div class="mission-model-en">${escapeVocabHtml(m.en)}</div>`;row.onclick=()=>{markPractice("phrases",m.es);speak(m.tts||m.es,0.75);};attachMic(row,m.es);models.appendChild(row);});
  card.appendChild(models);
  const inRoutine=routineToday().step===4;
  const done=document.createElement("button");done.type="button";done.className="lesson-start";done.textContent=inRoutine?"✅ Finish today’s speaking path":(missionProgress[mission.id]?"✅ Mission completed — practice again":"✅ I answered out loud");done.onclick=()=>{missionProgress[mission.id]=true;saveMissions();if(inRoutine)routineFinishMission();else renderMission(mission);};card.appendChild(done);root.appendChild(card);
}

/* v56 + v71: Sentence-frame trainer & Interactive 3-Column Slot-Swapper. */
let frameSessionIndex=0,frameMode="slots",slotMatrixIndex=0,slotPick=[0,0,0];
function frameDayNumber(){return Math.floor(Date.now()/86400000);}
export function renderFramePractice(advance){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");
  if(!root||typeof SPEAKING_FRAMES==="undefined"||!SPEAKING_FRAMES.length){return;}
  if(advance)frameSessionIndex=(frameSessionIndex+1)%SPEAKING_FRAMES.length;
  root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=renderLessons;root.appendChild(back);
  const modeBar=lpEl("lp-mode-switch");
  const slotTab=document.createElement("button");slotTab.type="button";slotTab.className="lp-mode-btn"+(frameMode==="slots"?" active":"");slotTab.textContent="🎰 Slot-Swapper (Mix & Speak)";
  slotTab.onclick=()=>{frameMode="slots";renderFramePractice(false);};
  const cardTab=document.createElement("button");cardTab.type="button";cardTab.className="lp-mode-btn"+(frameMode==="cards"?" active":"");cardTab.textContent=`🧱 Pattern Cards (${SPEAKING_FRAMES.length})`;
  cardTab.onclick=()=>{frameMode="cards";renderFramePractice(false);};
  modeBar.append(slotTab,cardTab);root.appendChild(modeBar);

  if(frameMode==="slots"&&typeof SLOT_SWAP_MATRICES!=="undefined"&&SLOT_SWAP_MATRICES.length){
    const slotFilter=window._slotFilter||"all";
    const matchSlotFilter=(m,cat)=>{
      if(cat==="all")return true;
      const t=(m.id+" "+m.title+" "+(m.sub||"")).toLowerCase();
      if(cat==="sanjuan")return /sanjuan|familia|citas|social/.test(t);
      if(cat==="travel")return /uber|aeropuerto|direcciones|cafe|panaderia|mercado|corrientazo|restaurante|finca|viajes/.test(t);
      return !/sanjuan|familia|citas/.test(t);
    };
    const visibleMatrices=SLOT_SWAP_MATRICES.map((m,i)=>({m,i})).filter(x=>matchSlotFilter(x.m,slotFilter));
    if(visibleMatrices.length&&!visibleMatrices.some(x=>x.i===slotMatrixIndex))slotMatrixIndex=visibleMatrices[0].i;
    const matrix=SLOT_SWAP_MATRICES[slotMatrixIndex%SLOT_SWAP_MATRICES.length];
    const card=lpEl("lp-card frame-practice-card");
    card.appendChild(lpEl("frame-kicker","🎰 CONSTRUCTOR DE FRASES · SENTENCE VERSATILITY LAB"));
    card.appendChild(lpEl("frame-title",matrix.title));
    card.appendChild(lpEl("frame-explain",matrix.sub+" Combine pieces from each column to bend tense, politeness, and context automatically."));
    const fRow=lpEl("slot-filter-row");
    [["all","🌎 All ("+SLOT_SWAP_MATRICES.length+")"],["travel","✈️ Travel & Food"],["daily","🏠 Daily Life"],["sanjuan","🪗 San Juan & Family"]].forEach(([fid,flbl])=>{
      const fb=document.createElement("button");fb.type="button";fb.className="reg-tab-btn slot-filter-btn"+(slotFilter===fid?" active":"");fb.textContent=flbl;
      fb.onclick=()=>{window._slotFilter=fid;renderFramePractice(false);};
      fRow.appendChild(fb);
    });
    card.appendChild(fRow);
    const mSwitch=lpEl("slot-matrix-tabs");
    (visibleMatrices.length?visibleMatrices:SLOT_SWAP_MATRICES.map((m,i)=>({m,i}))).forEach(({m,i:idx})=>{
      const b=document.createElement("button");b.type="button";b.className="lp-mode-btn"+(idx===slotMatrixIndex?" active":"");b.textContent=m.title;
      b.onclick=()=>{slotMatrixIndex=idx;slotPick=[0,0,0];renderFramePractice(false);};
      mSwitch.appendChild(b);
    });
    card.appendChild(mSwitch);

    const c1=matrix.col1[slotPick[0]]||matrix.col1[0];
    const c2=matrix.col2[slotPick[1]]||matrix.col2[0];
    const c3=matrix.col3[slotPick[2]]||matrix.col3[0];
    const isQuestion=c1.es.trim().startsWith("¿");
    const rawCombined=`${c1.es} ${c2.es} ${c3.es}`.replace(/\s+/g," ").trim();
    const assembledEs=isQuestion?(rawCombined.replace(/\.$/,"")+"?"):rawCombined;
    const assembledEn=`${c1.en} ${c2.en} ${c3.en}`.replace(/\s+/g," ").trim();

    const preview=lpEl("slot-assembled-box");
    preview.innerHTML=`<div class="slot-assembled-label">🗣️ Your assembled Colombian sentence (tap to hear):</div><div class="slot-assembled-es">${escapeVocabHtml(assembledEs)}</div><div class="slot-assembled-en">${escapeVocabHtml(assembledEn)}</div><div class="slot-assembled-actions"></div>`;
    preview.style.cursor="pointer";
    preview.onclick=e=>{if(!e.target.closest("button")){markPractice("phrases",assembledEs);speak(assembledEs,0.76);}};
    const pAct=preview.querySelector(".slot-assembled-actions");
    const slowBtn=document.createElement("button");slowBtn.type="button";slowBtn.textContent="🐢 Slow (0.6x)";slowBtn.className="lp-nav-btn";
    slowBtn.onclick=e=>{e.stopPropagation();speak(assembledEs,0.6);};
    const hearBtn=document.createElement("button");hearBtn.type="button";hearBtn.className="lp-nav-btn primary";hearBtn.textContent="🗣️ Natural (0.85x)";
    hearBtn.onclick=e=>{e.stopPropagation();markPractice("phrases",assembledEs);speak(assembledEs,0.85);};
    const randBtn=document.createElement("button");randBtn.type="button";randBtn.className="lp-nav-btn slot-remix-btn";randBtn.textContent="🎲 Remix Sentence";
    randBtn.onclick=e=>{
      e.stopPropagation();
      slotPick=[
        Math.floor(Math.random()*matrix.col1.length),
        Math.floor(Math.random()*matrix.col2.length),
        Math.floor(Math.random()*matrix.col3.length)
      ];
      renderFramePractice(false);
      const r1=matrix.col1[slotPick[0]]||matrix.col1[0],r2=matrix.col2[slotPick[1]]||matrix.col2[0],r3=matrix.col3[slotPick[2]]||matrix.col3[0];
      const rQ=r1.es.trim().startsWith("¿");
      const rRaw=`${r1.es} ${r2.es} ${r3.es}`.replace(/\s+/g," ").trim();
      speak(rQ?(rRaw.replace(/\.$/,"")+"?"):rRaw,0.8);
    };
    pAct.append(slowBtn,hearBtn,randBtn);
    attachMic(pAct,assembledEs,"phrases");
    card.appendChild(preview);

    const grid=lpEl("slot-columns-grid");
    [
      [matrix.col1Title,matrix.col1,0],
      [matrix.col2Title,matrix.col2,1],
      [matrix.col3Title,matrix.col3,2]
    ].forEach(([colTitle,items,colIdx])=>{
      const col=lpEl("slot-column");
      col.appendChild(lpEl("slot-col-title",colTitle));
      items.forEach((item,rowIdx)=>{
        const b=document.createElement("button");b.type="button";
        b.className="slot-chip"+(slotPick[colIdx]===rowIdx?" active":"");
        b.innerHTML=`<strong>${escapeVocabHtml(item.es)}</strong><small>${escapeVocabHtml(item.en)}</small>`;
        b.onclick=()=>{
          slotPick[colIdx]=rowIdx;
          renderFramePractice(false);
          speak(item.es.replace(/\.\.\.|…/g,"").trim(),0.78);
        };
        col.appendChild(b);
      });
      grid.appendChild(col);
    });
    card.appendChild(grid);
    root.appendChild(card);
    return;
  }

  const day=frameDayNumber();
  const frame=SPEAKING_FRAMES[frameSessionIndex];
  const prompt=frame.prompts[(day+frameSessionIndex)%frame.prompts.length];
  const guide=typeof SPEAKING_GUIDE!=="undefined"?SPEAKING_GUIDE.find(g=>g.id===frame.guide):null;
  const card=lpEl("lp-card frame-practice-card");
  card.appendChild(lpEl("frame-kicker",`🧱 BUILD A SENTENCE · FRAME ${frameSessionIndex+1} OF ${SPEAKING_FRAMES.length}`));
  const jumpSelect=document.createElement("select");jumpSelect.className="voice-select frame-jump-select";jumpSelect.setAttribute("aria-label","Jump to sentence frame");
  SPEAKING_FRAMES.forEach((f,idx)=>{const opt=document.createElement("option");opt.value=String(idx);opt.textContent=`${idx+1}. ${f.title} (${f.formula})`;if(idx===frameSessionIndex)opt.selected=true;jumpSelect.appendChild(opt);});
  jumpSelect.onchange=()=>{frameSessionIndex=Number(jumpSelect.value)||0;renderFramePractice(false);};
  card.appendChild(jumpSelect);
  card.appendChild(lpEl("frame-title",frame.title));
  const formula=lpEl("frame-formula");formula.innerHTML=`<strong>${escapeVocabHtml(frame.formula)}</strong><span>${escapeVocabHtml(frame.en)}</span>`;card.appendChild(formula);
  if(guide)card.appendChild(lpEl("frame-explain",guide.explain));
  card.appendChild(lpEl("frame-prompt-label","Say this in Spanish before revealing the model:"));
  card.appendChild(lpEl("frame-prompt-en",prompt.en));
  const listen=lpSpeakBtn(prompt.es,"🔊 Hear the model");listen.classList.add("frame-listen");card.appendChild(listen);
  const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn primary frame-reveal";reveal.textContent="👀 Reveal model sentence";
  const model=lpEl("frame-model");model.hidden=true;
  model.innerHTML=`<div class="frame-model-label">Natural answer</div><div class="frame-model-es">${escapeVocabHtml(prompt.es)}</div><div class="frame-model-en">${escapeVocabHtml(prompt.en)}</div>`;
  model.style.cursor="pointer";
  model.onclick=e=>{if(!e.target.closest("button"))speak(prompt.es,0.75);};
  const modelSpeak=lpSpeakBtn(prompt.es,"🔊 Repeat the sentence");model.appendChild(modelSpeak);
  reveal.onclick=()=>{model.hidden=false;reveal.remove();markPractice("frames",frame.id);speak(prompt.es,0.75);};
  card.appendChild(reveal);card.appendChild(model);attachMic(card,prompt.es);
  const more=document.createElement("details");more.className="frame-more";more.innerHTML="<summary>More ways to use this frame</summary><div class='frame-more-list'></div>";
  const moreList=more.querySelector(".frame-more-list");
  frame.prompts.filter(x=>x!==prompt).forEach(x=>{const row=document.createElement("button");row.type="button";row.className="frame-example-row";row.innerHTML=`<span><strong>${escapeVocabHtml(x.es)}</strong><small>${escapeVocabHtml(x.en)}</small></span><span>🔊</span>`;row.onclick=()=>{markPractice("frames",frame.id);speak(x.es,0.75);};moreList.appendChild(row);});
  card.appendChild(more);
  const rating=lpEl("frame-rating");rating.innerHTML="<span>After saying it:</span>";
  [["got","✅ I said it"],["practice","🔁 Need more practice"]].forEach(([kind,label])=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=()=>{recordSrs("frame:"+frame.id,kind==="got");if(kind==="got")clearSpeakingError(prompt.es);else recordSpeakingError(prompt.es,"sentence frame");markPractice("frames",frame.id);rating.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");};rating.appendChild(b);});
  card.appendChild(rating);
  const next=document.createElement("button");next.type="button";next.className="lp-nav-btn primary frame-next";next.textContent="Next sentence frame →";next.onclick=()=>renderFramePractice(true);card.appendChild(next);
  root.appendChild(card);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Lecturas (v35) — short Colombian paragraphs with listen, read-aloud, and
   comprehension practice. Kept inside Lecciones so the six-tab layout stays.
   ═══════════════════════════════════════════════════════════════════════════ */
export function renderReading(reading){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");if(!root)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=renderLessons;root.appendChild(back);
  const card=lpEl("lp-card reading-card");
  card.appendChild(lpEl("reading-kicker",`${reading.level} · LECTURA`));
  card.appendChild(lpEl("lp-step-title",reading.title));
  card.appendChild(lpEl("reading-intro",reading.intro));
  const guide=lpEl("reading-guide","Read the Spanish aloud before revealing the English. Then listen and compare.");card.appendChild(guide);
  const readingText=reading.lines.map(line=>line.tts||line.es).join(". ");
  let readingRate=1;
  const speed=lpEl("reading-speed");speed.innerHTML="<span>Playback speed</span>";
  [[1,"Full speed"],[0.78,"Slower"],[0.6,"Very slow"]].forEach(([rate,label],i)=>{
    const b=document.createElement("button");b.type="button";b.className="reading-speed-btn";b.textContent=label;b.classList.toggle("selected",i===0);b.onclick=()=>{readingRate=rate;speed.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");speak(readingText,readingRate);};speed.appendChild(b);
  });
  card.appendChild(speed);
  const play=document.createElement("button");play.type="button";play.className="lp-speak reading-play";play.textContent="▶️ Listen to the whole reading";play.onclick=()=>speak(readingText,readingRate);card.appendChild(play);
  const translation=document.createElement("details");translation.className="reading-translation";translation.innerHTML="<summary>📖 Show full English translation</summary><div class='reading-translation-copy'></div>";
  const translationCopy=translation.querySelector(".reading-translation-copy");
  reading.lines.forEach(line=>{const p=document.createElement("p");p.textContent=line.en||"";translationCopy.appendChild(p);});
  card.appendChild(translation);
  const lines=lpEl("reading-lines");
  reading.lines.forEach((line,i)=>{
    const row=document.createElement("article");row.className="reading-line";
    row.innerHTML=`<div class='reading-line-num'>${i+1}</div><div class='reading-line-copy'><button type='button' class='reading-es'>${escapeVocabHtml(line.es)}</button><button type='button' class='reading-en' hidden>${escapeVocabHtml(line.en)}</button></div><div class='reading-actions'></div>`;
    const es=row.querySelector(".reading-es"),en=row.querySelector(".reading-en");
    es.onclick=()=>speak(line.tts||line.es,readingRate);en.onclick=()=>{en.hidden=!en.hidden;};
    const rec=document.createElement("button");rec.type="button";rec.className="reading-record";rec.textContent="🎙️";rec.title="Record yourself";rec.setAttribute("aria-label","Record yourself");rec.onclick=()=>openMicPanel(line.tts||line.es);
    row.querySelector(".reading-actions").appendChild(rec);lines.appendChild(row);
  });
  card.appendChild(lines);
  (reading.questions||[]).forEach(q=>{
    const box=lpEl("reading-question");box.appendChild(lpEl("reading-question-text",q.q));
    const opts=lpEl("reading-question-options");
    const feedback=lpEl("reading-question-feedback","");feedback.setAttribute("aria-live","polite");
    q.choices.forEach(choice=>{const b=document.createElement("button");b.type="button";b.className="reading-choice";b.textContent=choice;b.onclick=()=>{opts.querySelectorAll("button").forEach(x=>x.disabled=true);const ok=choice===q.answer;b.classList.add(ok?"correct":"wrong");if(!ok)opts.querySelectorAll("button").forEach(x=>{if(x.textContent===q.answer)x.classList.add("reveal");});feedback.className="reading-question-feedback "+(ok?"correct":"wrong");feedback.textContent=ok?"✅ Correct — you understood it.":"❌ Not quite. Correct answer: "+q.answer;};opts.appendChild(b);});
    box.appendChild(opts);box.appendChild(feedback);card.appendChild(box);
  });
  const done=document.createElement("button");done.type="button";done.className="lesson-start";done.textContent=readingProgress[reading.id]?"✅ Reading complete — practice again":"✅ I read this aloud";done.onclick=()=>{readingProgress[reading.id]=true;saveReadings();renderReading(reading);};card.appendChild(done);root.appendChild(card);
}

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
try{routineState=Object.assign(routineState,JSON.parse(appStorage.getItem(ROUTINE_KEY)||"{}"));}catch(e){}
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
  const rapid=rrStats.attempts||0;
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
  const host=document.getElementById("quiz-review-launch");if(!host)return;
  const count=storedMissedQuestionCount();
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
    };
    lvlRow.appendChild(b);
  });
  const focRow=document.createElement("div");focRow.className="mf-row mf-row-sub";
  focOpts.forEach(([id,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="mf-chip"+(userPrefs.focus===id?" active":"");
    b.textContent=lbl;b.setAttribute("aria-pressed",userPrefs.focus===id?"true":"false");
    b.onclick=()=>{userPrefs.focus=id;saveUserPrefs();};
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
  if(!welcomeDismissed){
    const wCard=document.createElement("section");wCard.className="welcome-lane-card";wCard.dataset.lessonView="today";
    wCard.innerHTML=`<div class="welcome-lane-head"><span>🧭 <strong>Pick your starting lane</strong> <small>(you can switch anytime above)</small></span><button type="button" class="welcome-lane-close" aria-label="Dismiss welcome card">×</button></div><div class="welcome-lane-btns"></div>`;
    const wClose=wCard.querySelector(".welcome-lane-close");
    const dismissWelcome=()=>{try{appStorage.setItem(WELCOME_DISMISS_KEY,"1");}catch(e){}};
    wClose.onclick=()=>{dismissWelcome();};
    const wBtns=wCard.querySelector(".welcome-lane-btns");
    [
      ["🌱 Brand new (A0)","Show Sound Basics & keep extra tools tucked away",()=>{userPrefs.level="starter";userPrefs.blindEar=false;saveUserPrefs();dismissWelcome();}],
      ["🚀 Know basics (A1–A2)","Keep all drills open & unlock 5Q Stage Test-Outs",()=>{userPrefs.level="explorer";saveUserPrefs();dismissWelcome();setLessonView("path");}],
      ["🔥 Wanna flow (B1+)","Turn on Blind-Ear listening challenge right away",()=>{userPrefs.level="fluent";userPrefs.blindEar=true;saveUserPrefs();dismissWelcome();}]
    ].forEach(([title,sub,fn])=>{
      const b=document.createElement("button");b.type="button";b.className="welcome-lane-btn";
      b.innerHTML=`<strong>${title}</strong><small>${sub}</small>`;
      b.onclick=fn;wBtns.appendChild(b);
    });
    root.appendChild(wCard);
  }
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

  /* 2. Guided 10-Min Daily Speaking Routine directly below Hero */
  renderRoutineCard(root);

  /* 3. Clean 2x2 Quick Speaking Grid */
  const dueHome=srsDueCount();
  const missedHome=storedMissedQuestionCount();
  const quickGrid=document.createElement("section");quickGrid.className="today-quick-grid";quickGrid.dataset.lessonView="today";
  [
    ["🎰","Slot-Swapper",`${typeof SLOT_SWAP_MATRICES!=="undefined"?SLOT_SWAP_MATRICES.length:9} sentence builders`,()=>renderFramePractice(false)],
    ["⚡","Reacción Rápida",`${RR_BANK.length} audio reflexes`,()=>{rrSession=0;renderRapida(false);}],
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
  dr1.onclick=()=>{rrSession=0;renderRapida(false);};
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
      card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Recommended next</span>":""}</div><div class="lesson-sub">${lesson.sub}</div><div class="lesson-meta"><span>${lesson.difficulty}</span><span>${lesson.prereq||"Next step"}</span></div><div class="lesson-deeplinks"></div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
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
      card.querySelector(".lesson-check").onclick=(e)=>{e.stopPropagation();if(lessonProgress[lesson.id])delete lessonProgress[lesson.id];else lessonProgress[lesson.id]=true;saveLessons();};
      stageWrap.appendChild(card);
    });
  });
  /* Any lesson not assigned to a stage still shows (future-proofing weekly additions) */
  const staged=new Set(LESSON_STAGES.flatMap(s=>s.ids));
  LESSONS.filter(l=>!staged.has(l.id)).forEach(lesson=>{
    lessonNum++;
    const recommended=nextLesson&&nextLesson.id===lesson.id;
    const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"")+(recommended?" recommended":"");card.dataset.lessonView="path";
    card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Recommended next</span>":""}</div><div class="lesson-sub">${lesson.sub}</div><div class="lesson-meta"><span>${lesson.difficulty}</span><span>${lesson.prereq||"Next step"}</span></div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
    card.onclick=()=>openLesson(lesson);
    card.querySelector(".lesson-check").onclick=(e)=>{e.stopPropagation();if(lessonProgress[lesson.id])delete lessonProgress[lesson.id];else lessonProgress[lesson.id]=true;saveLessons();};
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
}


// ── Build Grammar ─────────────────────────────────────────────────────────────
export function initLessons() {
  renderLessons();
}
