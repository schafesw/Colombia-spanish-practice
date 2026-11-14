import { PICTURE_MATCH_BANK, NATURAL_EAR_CLIPS, GRINGO_TRAPS } from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, applyQuizFitClasses } from "../core/text-utils.js";
import { markPractice } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";
import { RR_BANK, storedMissedQuestionCount } from "../core/quiz-bank.js";
import { pmFilteredPool, renderPictureMatchDeck } from "./picture-match.js";
import { actions } from "./navigation.js";

export function mountNaturalEarLab(parent){
  if(!parent||typeof NATURAL_EAR_CLIPS==="undefined"||!NATURAL_EAR_CLIPS.length)return;
  let neIdx=0,nePicked=null,neReveal=false;
  const card=document.createElement("section");card.className="bridge-trainer-card natural-ear-card";
  const renderNe=()=>{
    const c=NATURAL_EAR_CLIPS[neIdx%NATURAL_EAR_CLIPS.length];
    card.innerHTML=`<div class="bridge-kicker">🎧 NATURAL-SPEED COLOMBIAN EAR · HOW LOCALS BLEND WORDS</div>
      <div class="bridge-context">Listen at full Colombian speed first, spot what was said, then reveal the shortened spoken form:</div>
      <div class="ne-audio-row">
        <button type="button" class="lp-nav-btn primary ne-play-norm">🗣️ Normal (1.0x)</button>
        <button type="button" class="lp-nav-btn ne-play-fast">⚡ Street Fast (1.15x)</button>
        <button type="button" class="lp-nav-btn ne-play-slow">🐢 Clear Slow (0.7x)</button>
      </div>
      <div class="ne-choices"></div>
      <div class="ne-reveal-box" ${neReveal?"":"hidden"}>
        <div class="ne-forms"><strong>Spoken Fast:</strong> ${escapeVocabHtml(c.fast)} <span class="ne-phon">[${escapeVocabHtml(c.phonetic)}]</span></div>
        <div class="ne-clear"><strong>Full Textbook Form:</strong> ${escapeVocabHtml(c.clear)}</div>
        <div class="tvc-why">💡 ${escapeVocabHtml(c.tip)}</div>
      </div>
      <div class="bridge-actions ne-foot"></div>`;
    card.querySelector(".ne-play-norm").onclick=()=>speak(c.fast,1.0);
    card.querySelector(".ne-play-fast").onclick=()=>speak(c.fast,1.15);
    card.querySelector(".ne-play-slow").onclick=()=>speak(c.clear,0.7);
    const chBox=card.querySelector(".ne-choices");
    c.choices.forEach(opt=>{
      const b=document.createElement("button");b.type="button";
      b.className="vv-quiz-opt"+(nePicked===opt?(opt===c.answer?" is-right":" is-wrong"):(nePicked&&opt===c.answer?" is-right":""));
      b.textContent=opt;
      b.onclick=()=>{nePicked=opt;neReveal=true;markPractice("phrases",c.fast);renderNe();speak(c.fast,0.95);};
      chBox.appendChild(b);
    });
    const foot=card.querySelector(".ne-foot");
    const peek=document.createElement("button");peek.type="button";peek.className="lp-nav-btn";
    peek.textContent=neReveal?"🙈 Hide Transcript":"👁️ Show Spoken Breakdown";
    peek.onclick=()=>{neReveal=!neReveal;renderNe();};
    const nextB=document.createElement("button");nextB.type="button";nextB.className="lp-nav-btn primary";
    nextB.textContent=`Next Clip (${(neIdx%NATURAL_EAR_CLIPS.length)+1}/${NATURAL_EAR_CLIPS.length}) →`;
    nextB.onclick=()=>{neIdx=(neIdx+1)%NATURAL_EAR_CLIPS.length;nePicked=null;neReveal=false;renderNe();speak(NATURAL_EAR_CLIPS[neIdx].fast,1.0);};
    foot.append(peek,nextB);
  };
  renderNe();
  parent.appendChild(card);
}

export function mountGringoTrapLab(parent){
  if(!parent||typeof GRINGO_TRAPS==="undefined"||!GRINGO_TRAPS.length)return;
  let gtIdx=0;
  const card=document.createElement("section");card.className="bridge-trainer-card gringo-trap-card";
  const renderGt=()=>{
    const g=GRINGO_TRAPS[gtIdx%GRINGO_TRAPS.length];
    card.innerHTML=`<div class="bridge-kicker">🚧 GRINGO-TRAP FIXER · STOP WORD-FOR-WORD TRANSLATIONS</div>
      <div class="bridge-context"><strong>Goal:</strong> ${escapeVocabHtml(g.intent)}</div>
      <div class="gt-compare-grid">
        <div class="gt-box gt-avoid"><span>❌ Literal English Trap</span><strong>${escapeVocabHtml(g.trap)}</strong></div>
        <div class="gt-box gt-local" role="button" tabindex="0"><span>✅ Natural Colombian</span><strong>${escapeVocabHtml(g.local)} 🔊</strong></div>
      </div>
      <div class="tvc-why">💡 ${escapeVocabHtml(g.why)}</div>
      <div class="bridge-actions gt-foot"></div>`;
    const gtLocalEl=card.querySelector(".gt-local");
    const playGt=()=>{markPractice("phrases",g.tts);speak(g.tts,0.8);};
    gtLocalEl.onclick=playGt;
    gtLocalEl.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();playGt();}};
    const foot=card.querySelector(".gt-foot");
    const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn primary";hear.textContent="🔊 Hear Local Example";
    hear.onclick=playGt;
    const prev=document.createElement("button");prev.type="button";prev.className="lp-nav-btn";prev.textContent="‹ Prev";
    prev.onclick=()=>{gtIdx=(gtIdx-1+GRINGO_TRAPS.length)%GRINGO_TRAPS.length;renderGt();};
    const next=document.createElement("button");next.type="button";next.className="lp-nav-btn";next.textContent=`Next (${(gtIdx%GRINGO_TRAPS.length)+1}/${GRINGO_TRAPS.length}) ›`;
    next.onclick=()=>{gtIdx=(gtIdx+1)%GRINGO_TRAPS.length;renderGt();};
    const rand=document.createElement("button");rand.type="button";rand.className="lp-nav-btn";rand.textContent="🎲 Random";
    rand.onclick=()=>{const r=Math.floor(Math.random()*GRINGO_TRAPS.length);gtIdx=(r===gtIdx&&GRINGO_TRAPS.length>1)?(r+1)%GRINGO_TRAPS.length:r;renderGt();};
    foot.append(hear,prev,next,rand);
    attachMic(foot,g.tts,"phrases");
  };
  renderGt();
  parent.appendChild(card);
}

var qV102Tab="off",spScore=0,spTotal=0,spItem=null,spFb="";
const SPRINT_BEST_KEY="esco-sprint-best-v102";
export function nextSprintQuestion(){
  const pool=[];
  if(typeof PICTURE_MATCH_BANK!=="undefined")PICTURE_MATCH_BANK.forEach(p=>pool.push({kind:"🖼️ Picture",cue:p.en,tts:p.tts,img:p.img,ans:p.word,pool:PICTURE_MATCH_BANK.map(x=>x.word)}));
  if(typeof GRINGO_TRAPS!=="undefined")GRINGO_TRAPS.forEach(g=>pool.push({kind:"🚫 Local Fix",cue:"Replace \""+g.trap+"\" ("+g.intent+")",tts:g.tts,ans:g.local,pool:GRINGO_TRAPS.map(x=>x.local)}));
  if(typeof RR_BANK!=="undefined"){
    const rrOk=RR_BANK.filter(r=>r&&r.qEn&&r.aEs).slice(0,24);
    const rrAnsPool=rrOk.map(x=>x.aEs);
    rrOk.forEach(r=>pool.push({kind:"⚡ Reflex",cue:r.qEn,subCue:r.qEs,subTts:r.q||r.qEs,tts:r.aTts||r.aEs,ans:r.aEs,pool:rrAnsPool}));
  }
  const pick=pool[Math.floor(Math.random()*pool.length)]||{kind:"⚡ Reflex",cue:"I'll take a black coffee",tts:"Me regala un tinto",ans:"¿Me regala un tinto?",pool:["¿Me regala un tinto?","Con mucho gusto","A la orden","¡De una!"]};
  const alts=[pick.ans];
  for(const cand of pick.pool.slice().sort(()=>Math.random()-0.5)){
    if(alts.length>=4)break;
    if(cand&&!alts.includes(cand))alts.push(cand);
  }
  for(const fb of ["¡De una!","Con mucho gusto","A la orden","¿Me regala un tinto?"]){
    if(alts.length>=4)break;
    if(!alts.includes(fb))alts.push(fb);
  }
  pick.opts=alts.sort(()=>Math.random()-0.5);
  return pick;
}
export function renderQuizV102Hub(){
  const host=document.getElementById("quiz-v102-hub");if(!host)return;
  const pq=document.getElementById("page-quiz");
  if(pq)pq.classList.toggle("v102-solo",qV102Tab!=="off");
  host.innerHTML="";
  const bar=document.createElement("div");bar.className="qv102-bar";
  const pmCount=typeof PICTURE_MATCH_BANK!=="undefined"?PICTURE_MATCH_BANK.length:20;
  [["off","📝 Standard Quiz"],["picture",`🖼️ Picture Match (${pmCount})`],["sprint","⏱️ 60s Fluency Sprint"]].forEach(([tid,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="mf-chip"+(qV102Tab===tid&&!appState.qMissedOnly?" active":"");
    b.textContent=lbl;
    b.onclick=()=>{
      if(tid!=="sprint"&&appState.spTimer){clearInterval(appState.spTimer);appState.spTimer=null;appState.spRunning=false;}
      if(tid==="off"&&appState.qMissedOnly){actions.exitMissedQueue();}
      qV102Tab=tid;renderQuizV102Hub();
    };
    bar.appendChild(b);
  });
  const mCount=storedMissedQuestionCount();
  const mBtn=document.createElement("button");mBtn.type="button";
  mBtn.className="mf-chip qv102-missed-btn"+(qV102Tab==="off"&&appState.qMissedOnly?" active":"");
  mBtn.textContent=`🎯 Missed (${mCount})`;
  mBtn.setAttribute("aria-pressed",qV102Tab==="off"&&appState.qMissedOnly?"true":"false");
  mBtn.title=mCount?`Practice ${mCount} missed question(s)`:"No missed items right now — tap for SRS review";
  mBtn.onclick=()=>{
    if(appState.spTimer){clearInterval(appState.spTimer);appState.spTimer=null;appState.spRunning=false;}
    if(qV102Tab==="off"&&appState.qMissedOnly){
      actions.exitMissedQueue();
      renderQuizV102Hub();
      return;
    }
    qV102Tab="off";
    if(storedMissedQuestionCount()>0)actions.openMissedQueue();
    else actions.openReviewSession();
    renderQuizV102Hub();
  };
  bar.appendChild(mBtn);
  host.appendChild(bar);
  if(qV102Tab==="picture"){
    const pmSlot=document.createElement("div");pmSlot.className="qv102-panel";
    renderPictureMatchDeck(pmSlot);
    host.appendChild(pmSlot);
  }else if(qV102Tab==="sprint"){
    const spWrap=document.createElement("div");spWrap.className="qv102-panel sprint-panel";
    const best=Number(appStorage.getItem(SPRINT_BEST_KEY)||0);
    if(!appState.spRunning&&appState.spLeft===60){
      spWrap.innerHTML=`<div class="quiz-score-bar sprint-score-bar">
          <div class="qs-item"><div class="qs-num" style="color:var(--teal)">60s</div><div class="qs-label">Clock</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--gold)">🏆 ${best}</div><div class="qs-label">Best</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--muted)">4</div><div class="qs-label">Choices</div></div>
        </div>
        <div class="quiz-card sprint-intro-card">
          <div class="qc-label">⏱️ 60-Second Colombian Fluency Sprint</div>
          <div class="qc-word sprint-cue-word">Rapid Mixed Blitz</div>
          <div class="sprint-intro-desc">Mixes Picture Match, Gringo-Trap swaps &amp; Reacción Rápida against the 60s clock.</div>
          <button type="button" class="quiz-next sprint-start-btn">▶ Start 60s Sprint</button>
        </div>`;
      spWrap.querySelector(".sprint-start-btn").onclick=()=>{
        appState.spRunning=true;appState.spLeft=60;spScore=0;spTotal=0;spFb="";spItem=nextSprintQuestion();
        if(appState.spTimer)clearInterval(appState.spTimer);
        appState.spTimer=setInterval(()=>{
          appState.spLeft--;
          if(appState.spLeft<=0){clearInterval(appState.spTimer);appState.spTimer=null;appState.spRunning=false;if(spScore>best)try{appStorage.setItem(SPRINT_BEST_KEY,String(spScore));}catch(e){}}
          renderQuizV102Hub();
        },1000);
        renderQuizV102Hub();
      };
    }else if(!appState.spRunning&&appState.spLeft<=0){
      const updatedBest=Math.max(best,spScore);
      spWrap.innerHTML=`<div class="quiz-score-bar sprint-score-bar">
          <div class="qs-item"><div class="qs-num" style="color:var(--teal)">${spScore}</div><div class="qs-label">Correct</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--gold)">🏆 ${updatedBest}</div><div class="qs-label">Best</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--muted)">${spTotal}</div><div class="qs-label">Answered</div></div>
        </div>
        <div class="quiz-card sprint-intro-card">
          <div class="qc-label">🏁 Sprint Complete!</div>
          <div class="qc-word sprint-cue-word">${spScore} / ${spTotal} Correct</div>
          <div class="sprint-intro-desc">Personal best: ${updatedBest}. Jump right back in to beat your speed!</div>
          <button type="button" class="quiz-next sprint-again-btn">↻ Sprint Again (60s)</button>
        </div>`;
      spWrap.querySelector(".sprint-again-btn").onclick=()=>{appState.spLeft=60;spScore=0;spTotal=0;spFb="";renderQuizV102Hub();};
    }else{
      const q=spItem||(spItem=nextSprintQuestion());
      const fbTone=spFb.startsWith("✅")?"var(--teal)":(spFb?"var(--pink)":"var(--muted)");
      spWrap.innerHTML=`<div class="quiz-score-bar sprint-score-bar">
          <div class="qs-item"><div class="qs-num${appState.spLeft<=10?" sprint-urgent":""}" style="color:var(--gold)">${appState.spLeft}s</div><div class="qs-label">Time Left</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--teal)">${spScore}/${spTotal}</div><div class="qs-label">Score</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--muted)">🏆 ${Math.max(best,spScore)}</div><div class="qs-label">Best</div></div>
          <button type="button" class="sprint-stop-pill" aria-label="Stop 60s sprint">⏹ Stop</button>
        </div>
        <div class="quiz-card sprint-quiz-card">
          <div class="qc-label">${escapeVocabHtml(q.kind)}</div>
          ${q.img?`<img class="sprint-thumb" src="${q.img}" alt="${escapeVocabHtml(q.cue)}"/>`:""}
          <div class="qc-word sprint-cue-word">${escapeVocabHtml(q.cue)}</div>
          ${q.subCue?`<div class="sprint-subcue">Asked: «${escapeVocabHtml(q.subCue)}»</div>`:""}
          <button type="button" class="qc-hear sprint-hear-btn">🔊 Hear</button>
        </div>
        <div class="quiz-opts sprint-opts"></div>
        <div class="quiz-feedback sprint-fb" style="color:${fbTone}">${escapeVocabHtml(spFb)}</div>`;
      spWrap.querySelector(".sprint-stop-pill").onclick=()=>{if(appState.spTimer){clearInterval(appState.spTimer);appState.spTimer=null;}appState.spRunning=false;appState.spLeft=60;spFb="";renderQuizV102Hub();};
      spWrap.querySelector(".sprint-hear-btn").onclick=()=>speak(q.subTts||q.tts,0.85);
      const oWrap=spWrap.querySelector(".sprint-opts");
      applyQuizFitClasses(spWrap.querySelector(".sprint-cue-word"),oWrap,q.cue,q.opts);
      q.opts.forEach(opt=>{
        const b=document.createElement("button");b.type="button";b.className="qopt";b.textContent=opt;
        b.onclick=()=>{
          spTotal++;
          if(opt===q.ans){spScore++;spFb="✅ +1 · "+q.ans;speak(q.tts,0.9);}
          else{spFb="⚠️ Local answer: "+q.ans;speak(q.tts,0.85);}
          spItem=nextSprintQuestion();renderQuizV102Hub();
        };
        oWrap.appendChild(b);
      });
    }
    host.appendChild(spWrap);
  }
}
export function openQuizV102Tab(tab){
  qV102Tab=tab||"sprint";
  renderQuizV102Hub();
  const h=document.getElementById("quiz-v102-hub");
  if(h)h.scrollIntoView({behavior:"smooth",block:"start"});
}


export function stopActiveSprint() {
  if (appState.spTimer) {
    clearInterval(appState.spTimer);
    appState.spTimer = null;
  }
  appState.spRunning = false;
  appState.spLeft = 60;
  renderQuizV102Hub();
}
