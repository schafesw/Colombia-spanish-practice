import { PICTURE_MATCH_BANK, GRINGO_TRAPS, NATURAL_EAR_CLIPS } from "../../data/index.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { markPractice, recordSrs, srsDue, srsStore } from "../core/stores.js";
import { RR_BANK } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";

var dfCards=[],dfIdx=0,dfPicked=null,dfScore=0,dfStreak=0;
export function buildDailyFlowDeck(){
  const cards=[];
  if(typeof PICTURE_MATCH_BANK!=="undefined"&&PICTURE_MATCH_BANK.length){
    const ranked=PICTURE_MATCH_BANK.slice().sort((a,b)=>actions.pmSrsRank(a)-actions.pmSrsRank(b));
    ranked.slice(0,3).forEach(target=>{
      const choices=actions.pmChoicesFor(target,PICTURE_MATCH_BANK);
      cards.push({kind:"pm",kicker:"🖼️ Picture Match",prompt:target.word,tts:target.tts,ans:target.id,ansLabel:target.word+" — "+target.en,hint:target.hint,srsKey:"pm|"+target.id,choices});
    });
  }
  if(typeof GRINGO_TRAPS!=="undefined"&&GRINGO_TRAPS.length){
    const locals=GRINGO_TRAPS.map(x=>x.local);
    GRINGO_TRAPS.slice().sort(()=>Math.random()-0.5).slice(0,2).forEach(g=>{
      const opts=[g.local];
      for(const c of locals.slice().sort(()=>Math.random()-0.5)){if(opts.length>=4)break;if(!opts.includes(c))opts.push(c);}
      cards.push({kind:"quiz",kicker:"🚫 Local Fix",prompt:`Replace "${g.trap}" (${g.intent})`,tts:g.tts,ans:g.local,hint:g.why,srsKey:"gt|"+g.id,opts:opts.sort(()=>Math.random()-0.5)});
    });
  }
  if(typeof RR_BANK!=="undefined"){
    const rrOk=RR_BANK.filter(r=>r&&r.qEn&&r.aEs).slice().sort(()=>Math.random()-0.5);
    const rrPool=rrOk.map(r=>r.aEs);
    rrOk.slice(0,2).forEach(r=>{
      const opts=[r.aEs];
      for(const c of rrPool){if(opts.length>=4)break;if(!opts.includes(c))opts.push(c);}
      while(opts.length<4)opts.push(["¡De una!","Con mucho gusto","A la orden"][opts.length%3]);
      cards.push({kind:"quiz",kicker:"⚡ Reflex Response",prompt:r.qEn,sub:r.qEs,subTts:r.q||r.qEs,tts:r.aTts||r.aEs,ans:r.aEs,hint:r.aEn||r.qEs,srsKey:"rr|"+(r.qEs||r.aEs).slice(0,32),opts:opts.sort(()=>Math.random()-0.5)});
    });
  }
  if(typeof NATURAL_EAR_CLIPS!=="undefined"&&NATURAL_EAR_CLIPS.length){
    const ne=NATURAL_EAR_CLIPS[Math.floor(Math.random()*NATURAL_EAR_CLIPS.length)];
    cards.push({kind:"ear",kicker:"🎧 Street Speed Ear",prompt:ne.fast,clear:ne.clear,tts:ne.fast,ans:ne.answer,hint:ne.tip,srsKey:"ne|"+ne.id,opts:ne.choices.slice()});
  }
  return cards;
}
export function renderDailyFlowSession(){
  const root=document.getElementById("lesson-list");if(!root)return;
  if(typeof actions.setLeccionesFocusMode==="function")actions.setLeccionesFocusMode(true);
  root.innerHTML="";
  const wrap=document.createElement("div");wrap.className="df-wrap";
  const head=document.createElement("div");head.className="df-head-bar";
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.style.marginBottom="0";
  back.innerHTML="<span>‹</span><span>Back to Hoy</span>";
  back.onclick=()=>{if(typeof actions.setLeccionesFocusMode==="function")actions.setLeccionesFocusMode(false);if(typeof actions.renderLessons==="function")actions.renderLessons();};
  head.appendChild(back);
  wrap.appendChild(head);

  if(!dfCards.length||dfIdx>=dfCards.length){
    const pct=dfCards.length?Math.round((dfScore/dfCards.length)*100):100;
    const sum=document.createElement("div");sum.className="quiz-card sprint-intro-card";
    sum.innerHTML=`<div class="qc-label">🎉 5-Min Daily Flow Complete!</div>
      <div class="qc-word sprint-cue-word">${dfScore} / ${dfCards.length} (${pct}%)</div>
      <div class="sprint-intro-desc">Your SRS schedule, weak spots, and daily streak are updated.</div>
      <div class="bridge-actions"><button type="button" class="lp-nav-btn primary df-again-btn">↻ Another 8-Card Mix</button><button type="button" class="lp-nav-btn df-home-btn">‹ Back to Hoy</button></div>`;
    sum.querySelector(".df-again-btn").onclick=()=>openDailyFlowSession();
    sum.querySelector(".df-home-btn").onclick=back.onclick;
    wrap.appendChild(sum);
    root.appendChild(wrap);
    return;
  }

  const c=dfCards[dfIdx];
  const bar=document.createElement("div");bar.className="quiz-score-bar sprint-score-bar";
  bar.innerHTML=`<div class="qs-item"><div class="qs-num" style="color:var(--teal)">${dfIdx+1}/${dfCards.length}</div><div class="qs-label">Card</div></div>
    <div class="qs-item"><div class="qs-num" style="color:var(--gold)">${dfScore}</div><div class="qs-label">Correct</div></div>
    <div class="qs-item"><div class="qs-num" style="color:var(--pink)">🔥 ${dfStreak}</div><div class="qs-label">Streak</div></div>`;
  wrap.appendChild(bar);

  const card=document.createElement("div");card.className="quiz-card sprint-quiz-card";
  if(c.kind==="ear"){
    card.innerHTML=`<div class="qc-label">${escapeVocabHtml(c.kicker)}</div>
      <div class="qc-word sprint-cue-word">What does this mean at street speed?</div>
      <div class="bridge-actions"><button type="button" class="qc-hear df-fast-btn">🐇 Street Speed</button><button type="button" class="qc-hear df-clear-btn">🐢 Slow &amp; Clear</button></div>`;
    card.querySelector(".df-fast-btn").onclick=()=>speak(c.tts,1.0);
    card.querySelector(".df-clear-btn").onclick=()=>speak(c.clear||c.tts,0.72);
  }else{
    card.innerHTML=`<div class="qc-label">${escapeVocabHtml(c.kicker)}</div>
      <div class="qc-word sprint-cue-word">${escapeVocabHtml(c.prompt)}</div>
      ${c.sub?`<div class="sprint-subcue">Asked: «${escapeVocabHtml(c.sub)}»</div>`:""}
      <button type="button" class="qc-hear df-hear-btn">🔊 Hear</button>`;
    card.querySelector(".df-hear-btn").onclick=()=>speak(c.subTts||c.tts,0.82);
  }
  wrap.appendChild(card);

  if(c.kind==="pm"){
    const grid=document.createElement("div");grid.className="pm-grid";
    c.choices.forEach(item=>{
      const btn=document.createElement("button");btn.type="button";
      btn.className="pm-choice-card photo-only"+(dfPicked?(item.id===c.ans?" is-right":(dfPicked===item.id?" is-wrong":"")):"");
      btn.innerHTML=`<img src="${item.img}" alt="${dfPicked?escapeVocabHtml(item.word):"Photo option"}"/>${dfPicked?`<span class="pm-cap">${escapeVocabHtml(item.word)}</span>`:""}`;
      btn.onclick=()=>{
        if(dfPicked)return;
        dfPicked=item.id;
        const ok=item.id===c.ans;
        if(ok){dfScore++;dfStreak++;}else{dfStreak=0;}
        markPractice("vocab",c.tts);
        if(typeof recordSrs==="function")recordSrs(c.srsKey,ok);
        speak(c.tts,0.82);
        renderDailyFlowSession();
      };
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);
  }else{
    const grid=document.createElement("div");grid.className="quiz-opts sprint-opts";
    c.opts.forEach(opt=>{
      const btn=document.createElement("button");btn.type="button";
      btn.className="qopt"+(dfPicked?(opt===c.ans?" correct":(dfPicked===opt?" wrong":"")):"");
      btn.textContent=opt;
      btn.onclick=()=>{
        if(dfPicked)return;
        dfPicked=opt;
        const ok=opt===c.ans;
        if(ok){dfScore++;dfStreak++;}else{dfStreak=0;}
        markPractice("phrases",c.tts);
        if(typeof recordSrs==="function")recordSrs(c.srsKey,ok);
        speak(c.tts,0.85);
        renderDailyFlowSession();
      };
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);
  }

  if(dfPicked){
    const ok=dfPicked===c.ans;
    const fb=document.createElement("div");fb.className="pm-feedback "+(ok?"ok":"warn");fb.style.display="block";
    fb.innerHTML=`${ok?"✅ <strong>¡Exacto!</strong>":"❌ <strong>Local answer:</strong>"} <strong>${escapeVocabHtml(c.ansLabel||c.ans)}</strong><small>${escapeVocabHtml(c.hint||"")}</small>`;
    const nxt=document.createElement("button");nxt.type="button";nxt.className="quiz-next";nxt.style.display="block";
    nxt.textContent=dfIdx+1>=dfCards.length?"Finish 5-Min Flow →":`Next Card (${dfIdx+2}/${dfCards.length}) →`;
    nxt.onclick=()=>{dfIdx++;dfPicked=null;renderDailyFlowSession();};
    wrap.append(fb,nxt);
  }
  root.appendChild(wrap);
}
export function openDailyFlowSession(){
  dfCards=buildDailyFlowDeck();dfIdx=0;dfPicked=null;dfScore=0;dfStreak=0;
  showPage("lecciones");
  renderDailyFlowSession();
}
