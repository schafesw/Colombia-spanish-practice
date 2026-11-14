import { PICTURE_MATCH_BANK } from "../../data/index.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { srsStore, srsDue, recordSrs, markPractice } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";
import { actions } from "./navigation.js";

var pmOpenInVocab=false,pmSetFilter="all",pmDirection="word2pic",pmTargetIdx=0,pmPickedId=null,pmScore=0,pmAttempts=0,pmStreak=0,pmPoolOrder=null,pmPoolKey="";
export function pmSrsRank(x){
  const card=(typeof srsStore!=="undefined"&&srsStore["pm|"+x.id])||null;
  if(!card)return 10;
  const due=(typeof srsDue==="function"&&srsDue("pm|"+x.id))?-20:0;
  return due-(card.lapses||0)*4+(card.reps||0)*2;
}
export function pmFilteredPool(){
  if(typeof PICTURE_MATCH_BANK==="undefined"||!PICTURE_MATCH_BANK.length)return[];
  const sub=pmSetFilter==="all"?PICTURE_MATCH_BANK:PICTURE_MATCH_BANK.filter(x=>x.set===pmSetFilter);
  const base=sub.length>=4?sub:PICTURE_MATCH_BANK;
  if(!pmPoolOrder||pmPoolKey!==pmSetFilter||pmPoolOrder.length!==base.length){
    pmPoolKey=pmSetFilter;
    pmPoolOrder=base.slice().sort((a,b)=>pmSrsRank(a)-pmSrsRank(b));
  }
  return pmPoolOrder;
}
export function pmChoicesFor(target,pool){
  const others=PICTURE_MATCH_BANK.filter(x=>x.id!==target.id);
  const sameSet=others.filter(x=>x.set===target.set);
  const pick=[target];
  for(const item of [...sameSet,...others]){
    if(pick.length>=4)break;
    if(!pick.some(p=>p.id===item.id))pick.push(item);
  }
  return pick.sort((a,b)=>(a.id.charCodeAt(3)+target.word.length)%7-((b.id.charCodeAt(3)+target.word.length)%7));
}
export function renderPictureMatchDeck(host){
  if(!host||typeof PICTURE_MATCH_BANK==="undefined"||!PICTURE_MATCH_BANK.length)return;
  host.innerHTML="";
  const pool=pmFilteredPool();
  const target=pool[pmTargetIdx%pool.length];
  const choices=pmChoicesFor(target,pool);
  const isPicChoice=pmDirection!=="pic2word";
  const cFood=PICTURE_MATCH_BANK.filter(x=>x.set==="food").length;
  const cCity=PICTURE_MATCH_BANK.filter(x=>x.set==="city").length;
  const cGear=PICTURE_MATCH_BANK.filter(x=>x.set==="gear").length;
  const box=document.createElement("div");box.className="pm-deck";
  box.innerHTML=`<div class="pm-controls">
    <div class="pm-set-row"></div>
    <div class="pm-dir-row">
      <button type="button" class="mf-chip${pmDirection==="word2pic"?" active":""}" data-dir="word2pic">📖 Word → Photo</button>
      <button type="button" class="mf-chip${pmDirection==="audio2pic"?" active":""}" data-dir="audio2pic">🔊 Hear → Photo</button>
      <button type="button" class="mf-chip${pmDirection==="pic2word"?" active":""}" data-dir="pic2word">👁️ Photo → Word</button>
    </div>
  </div>
  <div class="pm-prompt-box"></div>
  <div class="pm-grid"></div>
  <div class="pm-feedback" aria-live="polite"></div>
  <div class="bridge-actions pm-actions"></div>`;
  const sRow=box.querySelector(".pm-set-row");
  [["all",`All (${PICTURE_MATCH_BANK.length})`],["food",`☕ Food (${cFood})`],["city",`🚕 City (${cCity})`],["gear",`🎒 Gear (${cGear})`]].forEach(([sid,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(pmSetFilter===sid?" active":"");
    b.textContent=lbl;b.onclick=()=>{pmSetFilter=sid;pmTargetIdx=0;pmPickedId=null;pmPoolOrder=null;renderPictureMatchDeck(host);};
    sRow.appendChild(b);
  });
  const statChip=document.createElement("span");statChip.className="pm-mini-stat";
  statChip.textContent=`⭐ ${pmScore}/${pmAttempts}${pmStreak>1?" · 🔥"+pmStreak:""}`;
  sRow.appendChild(statChip);
  box.querySelectorAll(".pm-dir-row button").forEach(b=>{
    b.onclick=()=>{pmDirection=b.dataset.dir;pmPickedId=null;renderPictureMatchDeck(host);if(pmDirection==="audio2pic")speak(target.tts,0.82);};
  });
  const pBox=box.querySelector(".pm-prompt-box");
  if(pmDirection==="word2pic"){
    pBox.innerHTML=`<div class="pm-word-prompt-row"><span class="pm-word-badge">${escapeVocabHtml(target.word)}</span><button type="button" class="lp-nav-btn pm-hear-mini">🔊 Hear</button></div>`
      +(pmPickedId?"":`<div class="pm-prompt-hint">Tap the matching photo (audio optional)</div>`);
    pBox.querySelector(".pm-hear-mini").onclick=()=>speak(target.tts,0.82);
  }else if(pmDirection==="audio2pic"){
    pBox.innerHTML=`<button type="button" class="lp-nav-btn primary pm-hear-btn">🔊 Tap to Hear Colombian Phrase</button>`
      +(pmPickedId?"":`<div class="pm-prompt-hint">Match what you hear to the photo</div>`);
    pBox.querySelector(".pm-hear-btn").onclick=()=>speak(target.tts,0.82);
  }else{
    pBox.innerHTML=`<div class="pm-solo-img-wrap"><img class="pm-solo-img" src="${target.img}" alt="${escapeVocabHtml(target.en)}"/></div>`
      +(pmPickedId?"":`<div class="pm-prompt-hint">Which Colombian phrase matches this photo?</div>`);
  }
  const grid=box.querySelector(".pm-grid");
  const fb=box.querySelector(".pm-feedback");
  choices.forEach(item=>{
    const btn=document.createElement("button");btn.type="button";
    btn.className="pm-choice-card"+(isPicChoice?" photo-only":" word-only")+(pmPickedId===item.id?(item.id===target.id?" is-right":" is-wrong"):(pmPickedId&&item.id===target.id?" is-right":""));
    if(isPicChoice){
      btn.innerHTML=`<img src="${item.img}" alt="${pmPickedId?escapeVocabHtml(item.word):"Photo option"}"/>${pmPickedId?`<span class="pm-cap">${escapeVocabHtml(item.word)}</span>`:""}`;
    }else{
      btn.innerHTML=`<strong>${escapeVocabHtml(item.word)}</strong><small>${escapeVocabHtml(item.tts)}</small>`;
    }
    btn.onclick=()=>{
      if(pmPickedId===target.id)return;
      const firstTry=!pmPickedId;
      pmPickedId=item.id;
      const ok=item.id===target.id;
      if(firstTry){
        pmAttempts++;
        if(ok){pmScore++;pmStreak++;}
        else{pmStreak=0;}
      }
      if(ok){
        markPractice("vocab",target.tts);
        if(typeof recordSrs==="function")recordSrs("pm|"+target.id,true);
      }else if(typeof recordSrs==="function"){
        recordSrs("pm|"+target.id,false);
      }
      speak(target.tts,0.8);
      renderPictureMatchDeck(host);
    };
    grid.appendChild(btn);
  });
  if(pmPickedId){
    const ok=pmPickedId===target.id;
    const wrongLbl=pmDirection==="audio2pic"?"🔁 <strong>Keep listening:</strong>":"❌ <strong>Not quite — it's:</strong>";
    fb.className="pm-feedback "+(ok?"ok":"warn");
    fb.innerHTML=`${ok?"✅ <strong>¡Exacto!</strong>":wrongLbl} <strong>${escapeVocabHtml(target.word)}</strong> — <em>${escapeVocabHtml(target.en)}</em><small>${escapeVocabHtml(target.hint)}</small>`;
  }
  const acts=box.querySelector(".pm-actions");
  const nextB=document.createElement("button");nextB.type="button";nextB.className="lp-nav-btn primary";
  nextB.textContent=`Next (${(pmTargetIdx%pool.length)+1}/${pool.length}) →`;
  nextB.onclick=()=>{pmTargetIdx=(pmTargetIdx+1)%pool.length;pmPickedId=null;renderPictureMatchDeck(host);if(pmDirection==="audio2pic"){const nx=pmFilteredPool()[pmTargetIdx%pmFilteredPool().length];if(nx)speak(nx.tts,0.82);}};
  const shufB=document.createElement("button");shufB.type="button";shufB.className="lp-nav-btn";shufB.textContent="🔀 Random";
  shufB.onclick=()=>{const nxt=Math.floor(Math.random()*pool.length);pmTargetIdx=(nxt===pmTargetIdx&&pool.length>1)?(nxt+1)%pool.length:nxt;pmPickedId=null;renderPictureMatchDeck(host);if(pmDirection==="audio2pic"){const nx=pmFilteredPool()[pmTargetIdx%pmFilteredPool().length];if(nx)speak(nx.tts,0.82);}};
  acts.append(nextB,shufB);
  attachMic(acts,target.tts,"vocab");
  host.appendChild(box);
}
export function mountPictureMatchEntry(vocabHome){
  if(!vocabHome||typeof PICTURE_MATCH_BANK==="undefined"||!PICTURE_MATCH_BANK.length)return;
  const wrap=document.createElement("section");wrap.className="pm-card-shell";
  const hdr=document.createElement("button");hdr.type="button";hdr.className="vocab-phonetic-card pm-launch-btn";
  hdr.innerHTML=`<span class="vocab-phonetic-icon">🖼️</span><span><strong>Picture-to-Word Match (${PICTURE_MATCH_BANK.length})</strong><small>Connect photos directly to Colombian Spanish — no English</small></span><span class="vocab-home-arrow">${pmOpenInVocab?"▾":"›"}</span>`;
  const deckHost=document.createElement("div");deckHost.className="pm-deck-host";deckHost.hidden=!pmOpenInVocab;
  hdr.onclick=()=>{
    pmOpenInVocab=!pmOpenInVocab;deckHost.hidden=!pmOpenInVocab;
    hdr.querySelector(".vocab-home-arrow").textContent=pmOpenInVocab?"▾":"›";
    if(pmOpenInVocab)renderPictureMatchDeck(deckHost);
  };
  wrap.append(hdr,deckHost);
  if(pmOpenInVocab)renderPictureMatchDeck(deckHost);
  vocabHome.appendChild(wrap);
}
export function openVocabPictureMatch(){
  if(typeof actions.showVocabHome==="function")actions.showVocabHome();
  pmOpenInVocab=true;
  if(typeof actions.renderVocabHome==="function")actions.renderVocabHome();
  const card=document.querySelector(".pm-card-shell");
  if(card)card.scrollIntoView({behavior:"smooth",block:"start"});
}
