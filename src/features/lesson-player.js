import {
  READINGS, CONVERSATION_MISSIONS, LESSON_CONTENT, SPEAKING_FRAMES,
  SENTENCE_LADDERS, SPEAKING_GUIDE, REGIONAL_SWITCHER, PICTURE_MATCH_BANK,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { effectiveLevel } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, lpEl, scrollAppTop, spanishStressHint, normalizeQuizText } from "../core/text-utils.js";
import {
  markPractice, practiced, lessonProgress, saveLessons,
  recordPracticeDay, recordSrs, recordSpeakingError, clearSpeakingError,
  attachStarBtn, missionProgress, saveMissions, readingProgress, saveReadings,
} from "../core/stores.js";
import { attachMic, openMicPanel } from "../core/speech-mic.js";
import { PHRASE_DIALOGUES, aQ, quizAcceptedAnswers, quizAnswerMatches } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";

let lpSteps=[],lpStep=0,lpScore=0,lpQs=[],lpQi=0,lpAnswered=false,lpPracticed=new Set();
let lpFullMode=false,lpLadderStep=1,lpRoleSim=true,lpRoleTurn=0;
export function lessonDialogue(lesson){return PHRASE_DIALOGUES.find(x=>x.title===lesson.dialogue);}
function lessonPictures(lesson){
  if(typeof PICTURE_MATCH_BANK==="undefined"||!lesson)return[];
  return PICTURE_MATCH_BANK.filter(p=>Array.isArray(p.lessons)&&p.lessons.includes(lesson.id));
}
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
  const pics=lessonPictures(lesson);
  if(pics.length&&typeof PICTURE_MATCH_BANK!=="undefined"&&PICTURE_MATCH_BANK.length>=4){
    const target=shuffle(pics)[0];
    const sameSet=shuffle(PICTURE_MATCH_BANK.filter(p=>p.id!==target.id&&p.word!==target.word&&p.set===target.set));
    const otherSet=shuffle(PICTURE_MATCH_BANK.filter(p=>p.id!==target.id&&p.word!==target.word&&p.set!==target.set));
    const opts=pad([target.word,...sameSet.concat(otherSet).slice(0,3).map(p=>p.word)],PICTURE_MATCH_BANK.map(p=>p.word),4);
    lpQs.push({label:"Match the Colombian photo",prompt:"¿Qué es esto en Colombia?",img:target.img,answer:target.word,options:shuffle(opts),afterTts:target.tts,revEs:target.word,revEn:target.en});
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
  back.onclick=()=>{appState.lpLesson=null;actions.renderLessons();};
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
    const pics=lessonPictures(appState.lpLesson);
    if(pics.length){
      const vis=lpEl("lp-visual-section");
      vis.appendChild(lpEl("lp-visual-head",`📸 Colombian visuals for this lesson (${pics.length}) — tap to hear & say`));
      const vGrid=lpEl("lp-visual-grid");
      pics.slice(0,6).forEach(pm=>{
        const vc=lpEl("lp-visual-card",`<img src="${pm.img}" alt="${escapeVocabHtml(pm.en)}" loading="lazy"/><div class="lp-visual-cap"><strong>${escapeVocabHtml(pm.word)}</strong><small>${escapeVocabHtml(pm.en)}</small></div>`);
        vc.onclick=()=>{markPractice("vocab",pm.tts);speak(pm.tts,0.78);};
        attachMic(vc,pm.tts,"vocab");
        vGrid.appendChild(vc);
      });
      vis.appendChild(vGrid);
      body.appendChild(vis);
    }
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
    if(q.img){
      const pWrap=lpEl("lp-quiz-photo-wrap");
      pWrap.innerHTML=`<img class="lp-quiz-photo" src="${q.img}" alt="${escapeVocabHtml(q.revEn||"Colombian photo")}"/>`;
      body.appendChild(pWrap);
    }
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
    const open=document.createElement("button");open.type="button";open.className="lp-nav-btn primary";open.textContent="📖 Read & shadow full passage";open.onclick=()=>actions.renderReading(reading);body.appendChild(open);
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
    mk("📖 Read & shadow",()=>{const reading=READINGS.find(r=>r.id===appState.lpLesson.readingId)||READINGS.find(r=>r.lesson===appState.lpLesson.id)||READINGS[0];actions.renderReading(reading);});
    mk("💬 Full conversation",()=>{showPage("frases");const d=lessonDialogue(appState.lpLesson);if(d)actions.renderFraseDialogue(d);});
    mk("🧪 Full quiz",()=>{showPage("quiz");appState.qMissedOnly=false;appState.qCat=appState.lpLesson.quizCat;appState.qMode=appState.lpLesson.quizMode||"mixed";appState.qFocus=appState.lpLesson.quizFocus||"all";appState.repasoLeft=0;actions.resetQuizRound();actions.syncQuizControls();actions.nQ();});
    body.appendChild(explore);
    navBtn("Back to lessons",()=>{appState.lpLesson=null;actions.renderLessons();},true);
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
export function loadResume(){
  try{const r=JSON.parse(appStorage.getItem(RESUME_KEY)||"null");return r&&r.id?r:null;}catch(e){return null;}
}
export function loadResumeRef(){return loadResume();}
export function openLessonAt(lesson,step,qi,score){
  openLesson(lesson);
  lpStep=Math.min(Math.max(step|0,0),lpSteps.length-1);
  lpQi=Math.min(Math.max(qi|0,0),Math.max(lpQs.length-1,0));
  lpScore=Math.max(score|0,0);
  renderLessonStep();
}
