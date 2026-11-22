import { PICTURE_MATCH_BANK, GRINGO_TRAPS, NATURAL_EAR_CLIPS, SPANISH_BRAIN_DRILLS, VC, VERBS, PQ, COLOMBIANISMOS, FRASES } from "../../data/index.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { markPractice, recordSrs, srsDue, srsStore } from "../core/stores.js";
import { aQ, RR_BANK } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";
import { NUMBERS_EAR_DRILLS } from "./vocab.js";

var dfCards=[],dfIdx=0,dfPicked=null,dfScore=0,dfStreak=0,dfSessionMode="mix";
function shuffledCopy(list){return list.slice().sort(()=>Math.random()-0.5);}
export function buildSrsReviewDeck(){
  if(typeof srsStore!=="object")return[];
  const dueKeys=Object.keys(srsStore).filter(srsDue).sort((a,b)=>((srsStore[a]&&srsStore[a].due)||0)-((srsStore[b]&&srsStore[b].due)||0));
  const cards=[];
  const gtLocals=(typeof GRINGO_TRAPS!=="undefined"?GRINGO_TRAPS.map(x=>x.local):[]);
  const rrPool=(typeof RR_BANK!=="undefined"?RR_BANK.filter(r=>r&&r.aEs).map(r=>r.aEs):[]);
  const aqAnsPool=(typeof aQ!=="undefined"?aQ.map(q=>q.en).filter(Boolean):[]);
  for(const key of dueKeys){
    if(cards.length>=12)break;
    if(key.startsWith("pm|")&&typeof PICTURE_MATCH_BANK!=="undefined"){
      const target=PICTURE_MATCH_BANK.find(x=>x.id===key.slice(3));
      if(target){
        cards.push({kind:"pm",kicker:"🖼️ Due · Picture Match",prompt:target.word,tts:target.tts,ans:target.id,ansLabel:target.word+" — "+target.en,hint:target.hint,srsKey:key,choices:actions.pmChoicesFor(target,PICTURE_MATCH_BANK)});
      }
    }else if(key.startsWith("gt|")&&typeof GRINGO_TRAPS!=="undefined"){
      const g=GRINGO_TRAPS.find(x=>x.id===key.slice(3));
      if(g){
        const opts=[g.local];
        for(const c of shuffledCopy(gtLocals)){if(opts.length>=4)break;if(!opts.includes(c))opts.push(c);}
        cards.push({kind:"quiz",kicker:"🚫 Due · Local Fix",prompt:`Replace "${g.trap}" (${g.intent})`,tts:g.tts,ans:g.local,hint:g.why,srsKey:key,opts:shuffledCopy(opts)});
      }
    }else if(key.startsWith("ne|")&&typeof NATURAL_EAR_CLIPS!=="undefined"){
      const ne=NATURAL_EAR_CLIPS.find(x=>x.id===key.slice(3));
      if(ne){
        cards.push({kind:"ear",kicker:"🎧 Due · Street Speed Ear",prompt:ne.fast,clear:ne.clear,tts:ne.fast,ans:ne.answer,hint:ne.tip,srsKey:key,opts:ne.choices.slice()});
      }
    }else if(key.startsWith("brain|")&&typeof SPANISH_BRAIN_DRILLS!=="undefined"){
      const br=SPANISH_BRAIN_DRILLS.find(x=>x.id===key.slice(6));
      if(br){
        cards.push({kind:"quiz",kicker:`🧠 Due · ${br.badge}`,prompt:br.prompt,sub:br.question,subTts:br.tts,tts:br.tts,ans:br.answer,hint:br.tip,srsKey:key,opts:shuffledCopy(br.choices)});
      }
    }else if(key.startsWith("rr|")&&typeof RR_BANK!=="undefined"){
      const pref=key.slice(3);
      const r=RR_BANK.find(x=>x&&((x.qEs||x.aEs||"").slice(0,32)===pref));
      if(r&&r.aEs){
        const opts=[r.aEs];
        for(const c of shuffledCopy(rrPool)){if(opts.length>=4)break;if(!opts.includes(c))opts.push(c);}
        while(opts.length<4)opts.push(["¡De una!","Con mucho gusto","A la orden"][opts.length%3]);
        cards.push({kind:"quiz",kicker:"⚡ Due · Reflex",prompt:r.qEn||r.qEs,sub:r.qEs,subTts:r.q||r.qEs,tts:r.aTts||r.aEs,ans:r.aEs,hint:r.aEn||r.qEs,srsKey:key,opts:shuffledCopy(opts)});
      }
    }else if(key.startsWith("vf|")||key.startsWith("vq|")){
      const target=key.slice(3).trim();
      const allV=[];
      (VC||[]).forEach(c=>(c.items||[]).forEach(it=>{if(it&&(it.word||it.tts)&&it.en)allV.push({word:it.word||it.tts,en:it.en,tts:it.tts||it.word});}));
      Object.entries(VERBS||{}).forEach(([w,v])=>{if(v&&v.en)allV.push({word:w,en:v.en,tts:w});});
      (typeof PQ!=="undefined"?PQ:[]).forEach(p=>{if(p&&p.en)allV.push({word:p.word,en:p.en,tts:p.tts||p.word});});
      (typeof COLOMBIANISMOS!=="undefined"?COLOMBIANISMOS:[]).forEach(c=>{if(c&&c.en)allV.push({word:c.word,en:c.en,tts:c.tts||c.word});});
      const hit=allV.find(x=>x.tts===target||x.word===target);
      if(hit){
        const opts=[hit.word];
        for(const c of shuffledCopy(allV)){if(opts.length>=4)break;if(c.word&&!opts.includes(c.word))opts.push(c.word);}
        while(opts.length<4)opts.push(["El tinto","Con gusto","De una"][opts.length%3]);
        cards.push({kind:"quiz",kicker:"🔁 Due · Vocabulario",prompt:hit.en,tts:hit.tts,ans:hit.word,hint:`${hit.word} — ${hit.en}`,srsKey:key,opts:shuffledCopy(opts)});
      }
    }else if(key.startsWith("num|")&&Array.isArray(NUMBERS_EAR_DRILLS)){
      const ans=key.slice(4);
      const n=NUMBERS_EAR_DRILLS.find(x=>x.ans===ans);
      if(n){
        cards.push({kind:"quiz",kicker:`💵 Due · ${n.tag}`,prompt:"🎧 Listen and catch the exact Colombian peso price, address, or time",tts:n.tts,ans:n.ans,hint:`${n.es} (${n.en})`,srsKey:key,opts:shuffledCopy([n.ans,...n.dist])});
      }
    }else if(key.startsWith("frq|")&&typeof FRASES!=="undefined"){
      const targetEs=key.slice(4);
      const allFr=FRASES.flatMap(s=>s.items||[]).filter(it=>it&&it.es&&it.en);
      const hit=allFr.find(it=>it.es===targetEs);
      if(hit){
        const opts=[hit.es];
        for(const c of shuffledCopy(allFr)){if(opts.length>=4)break;if(c.es&&!opts.includes(c.es))opts.push(c.es);}
        cards.push({kind:"quiz",kicker:"💬 Due · Phrase Recall",prompt:hit.en,tts:hit.es,ans:hit.es,hint:`${hit.es} — ${hit.en}`,srsKey:key,opts:shuffledCopy(opts)});
      }
    }else if(key.startsWith("verb|")&&typeof VERBS!=="undefined"){
      const parts=key.split("|");
      const vKey=parts[1],tenseKey=parts[2],pro=parts[3];
      const vObj=VERBS[vKey];
      if(vObj){
        let hit=null;
        if(tenseKey==="imp"&&vObj.imperative){
          const slot=pro==="usted"?vObj.imperative.usted:vObj.imperative.tu;
          if(slot)hit={ans:slot.f,en:slot.en,lbl:"Imperativo"};
        }else if(Array.isArray(vObj[tenseKey])){
          const slot=vObj[tenseKey].find(r=>r.p===pro);
          if(slot)hit={ans:slot.v,en:slot.e,lbl:tenseKey};
        }
        if(hit){
          const pool=[...vObj.present,...vObj.past,...(vObj.imperfect||[]),...vObj.future].map(r=>r.v).filter(Boolean);
          const opts=[hit.ans];
          for(const f of shuffledCopy(pool)){if(opts.length>=4)break;if(!opts.includes(f))opts.push(f);}
          cards.push({kind:"quiz",kicker:`🎯 Due · Verb (${vKey})`,prompt:`${pro} · ${hit.lbl} — "${hit.en}"`,tts:hit.ans,ans:hit.ans,hint:`${vKey}: ${pro} → ${hit.ans}`,srsKey:key,opts:shuffledCopy(opts)});
        }
      }
    }else if(key.startsWith("col|")&&typeof COLOMBIANISMOS!=="undefined"){
      const word=key.slice(4);
      const colHit=COLOMBIANISMOS.find(x=>x&&x.word===word);
      if(colHit){
        const opts=[colHit.word];
        for(const d of shuffledCopy(COLOMBIANISMOS)){if(opts.length>=4)break;if(d&&d.word&&!opts.includes(d.word))opts.push(d.word);}
        cards.push({kind:"quiz",kicker:"🇨🇴 Due · Colombianismo",prompt:colHit.en,tts:colHit.example||colHit.tts||colHit.word,ans:colHit.word,hint:`${colHit.word} — ${colHit.example||colHit.usage}`,srsKey:key,opts:shuffledCopy(opts)});
      }
    }else if(key.includes("|")&&!/^(?:pm|gt|ne|brain|rr|vf|vq|num|frq|verb|read|voseo|col|contraste|subj)\|/.test(key)){
      const sep=key.indexOf("|");
      const es=key.slice(0,sep),ans=key.slice(sep+1);
      if(es&&ans){
        const match=(typeof aQ!=="undefined"?aQ.find(q=>q.es===es&&(q.en===ans||q.answer===ans)):null);
        const opts=[ans];
        const sourceOpts=(match&&Array.isArray(match.choices)&&match.choices.length>=2)?match.choices:aqAnsPool;
        for(const c of shuffledCopy(sourceOpts)){if(opts.length>=4)break;if(c&&!opts.includes(c))opts.push(c);}
        while(opts.length<4)opts.push(["Yes, please","Not right now","See you later"][opts.length%3]);
        cards.push({kind:"quiz",kicker:"🔁 Due · Vocab & Phrases",prompt:match&&(match.quizPrompt||match.es)||es,tts:(match&&match.tts)||es,ans,hint:(match&&match.note)||(es+" → "+ans),srsKey:key,opts:shuffledCopy(opts)});
      }
    }
  }
  return cards;
}
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
  if(typeof SPANISH_BRAIN_DRILLS!=="undefined"&&SPANISH_BRAIN_DRILLS.length){
    const br=SPANISH_BRAIN_DRILLS[Math.floor(Math.random()*SPANISH_BRAIN_DRILLS.length)];
    cards.push({kind:"quiz",kicker:`🧠 ${br.badge}`,prompt:br.prompt,sub:br.question,subTts:br.tts,tts:br.tts,ans:br.answer,hint:br.tip,srsKey:"brain|"+br.id,opts:shuffledCopy(br.choices)});
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
    const isSrs=dfSessionMode==="srs";
    const sum=document.createElement("div");sum.className="quiz-card sprint-intro-card";
    sum.innerHTML=`<div class="qc-label">${isSrs?"🎉 Due Cards Reviewed!":"🎉 5-Min Daily Flow Complete!"}</div>
      <div class="qc-word sprint-cue-word">${dfScore} / ${dfCards.length} (${pct}%)</div>
      <div class="sprint-intro-desc">${isSrs?"Picture Match, Vocab, Local Fix &amp; Phrase intervals updated for today.":"Your SRS schedule, weak spots, and daily streak are updated."}</div>
      <div class="bridge-actions"><button type="button" class="lp-nav-btn primary df-again-btn">${isSrs?"↻ Next Due Batch":"↻ Another 8-Card Mix"}</button><button type="button" class="lp-nav-btn df-home-btn">‹ Back to Hoy</button></div>`;
    sum.querySelector(".df-again-btn").onclick=()=>{if(isSrs){if(!openUnifiedSrsReview())back.onclick();}else openDailyFlowSession();};
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
      <div class="bridge-actions"><button type="button" class="qc-hear df-hear-btn">🔊 Clear (0.72×)</button><button type="button" class="qc-hear df-street-btn">⚡ Street (1.05×)</button></div>`;
    card.querySelector(".df-hear-btn").onclick=()=>speak(c.subTts||c.tts,0.72);
    card.querySelector(".df-street-btn").onclick=()=>speak(c.subTts||c.tts,1.05);
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
  dfSessionMode="mix";
  dfCards=buildDailyFlowDeck();dfIdx=0;dfPicked=null;dfScore=0;dfStreak=0;
  showPage("lecciones");
  renderDailyFlowSession();
}
export function openUnifiedSrsReview(){
  const deck=buildSrsReviewDeck();
  if(!deck.length)return false;
  dfSessionMode="srs";
  dfCards=deck;dfIdx=0;dfPicked=null;dfScore=0;dfStreak=0;
  showPage("lecciones");
  renderDailyFlowSession();
  return true;
}
