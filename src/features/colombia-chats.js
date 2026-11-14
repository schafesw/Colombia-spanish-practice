import { COLOMBIA_CHATS, ROLEPLAY_IMAGES } from "../../data/index.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { markPractice, recordSrs } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";

var chatIdx=0,chatTurn=0,chatSolved=false,chatWrongIds=[],chatCoachMsg="",chatFirstTryOk=0,chatShowEn=false;
export function mountColombiaChatsLab(parent){
  if(!parent||typeof COLOMBIA_CHATS==="undefined"||!COLOMBIA_CHATS.length)return;
  chatIdx=Number(chatIdx)||0;chatTurn=Number(chatTurn)||0;chatFirstTryOk=Number(chatFirstTryOk)||0;
  if(!Array.isArray(chatWrongIds))chatWrongIds=[];
  chatSolved=!!chatSolved;chatShowEn=!!chatShowEn;chatCoachMsg=chatCoachMsg||"";
  const sec=document.createElement("section");sec.className="bridge-trainer-card colombia-chats-card";
  const render=()=>{
    const ch=COLOMBIA_CHATS[chatIdx%COLOMBIA_CHATS.length];
    const chatHero=(typeof ROLEPLAY_IMAGES!=="undefined"&&ROLEPLAY_IMAGES[ch.id])
      ?`<div class="chat-hero-banner rp-hero-banner"><img src="${ROLEPLAY_IMAGES[ch.id]}" alt="${escapeVocabHtml(ch.title)} · ${escapeVocabHtml(ch.place)}"/><span class="region-hero-badge">${escapeVocabHtml(ch.place)}</span></div>`
      :"";
    sec.innerHTML=`<div class="bridge-kicker">💬 COLOMBIA CHATS · REAL 4-TURN ROLEPLAY</div>
      <div class="chat-tabs" role="tablist" aria-label="Colombia chat scenarios"></div>
      ${chatHero}
      <div class="chat-header">
        <div class="chat-partner"><span class="chat-partner-ico">${escapeVocabHtml(ch.emoji)}</span><div><strong>${escapeVocabHtml(ch.partner)} · ${escapeVocabHtml(ch.title)}</strong><small>${escapeVocabHtml(ch.place)}</small></div></div>
        <span class="chat-turn-pill">${chatTurn>=ch.turns.length?"4/4 ✓":`Turn ${chatTurn+1}/${ch.turns.length}`}</span>
      </div>
      <div class="chat-thread"></div>
      <div class="chat-reply-zone"></div>`;
    const tabRow=sec.querySelector(".chat-tabs");
    COLOMBIA_CHATS.forEach((item,i)=>{
      const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(i===chatIdx?" active":"");
      b.setAttribute("role","tab");b.setAttribute("aria-selected",i===chatIdx?"true":"false");b.tabIndex=i===chatIdx?0:-1;
      b.textContent=`${item.emoji} ${item.title}`;
      b.onclick=()=>{chatIdx=i;chatTurn=0;chatSolved=false;chatWrongIds=[];chatCoachMsg="";chatFirstTryOk=0;chatShowEn=false;render();};
      tabRow.appendChild(b);
    });
    tabRow.onkeydown=e=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;const tabs=Array.from(tabRow.querySelectorAll('[role="tab"]'));const i=tabs.indexOf(document.activeElement);if(i<0)return;e.preventDefault();const nxt=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;tabs[nxt].click();sec.querySelectorAll('.chat-tabs [role="tab"]')[nxt]?.focus();};
    const thread=sec.querySelector(".chat-thread");
    const rZone=sec.querySelector(".chat-reply-zone");
    const limit=Math.min(chatTurn,ch.turns.length);
    for(let ti=0;ti<limit;ti++){
      const pastT=ch.turns[ti];
      const nat=pastT.options.find(o=>o.quality==="natural")||pastT.options[0];
      const bb=document.createElement("div");bb.className="chat-bubble bot past";
      bb.innerHTML=`<div class="chat-bubble-meta"><span>${escapeVocabHtml(ch.partner)}</span></div><div>${escapeVocabHtml(pastT.botEs)}</div>`;
      const ub=document.createElement("div");ub.className="chat-bubble user past";
      ub.innerHTML=`<div class="chat-bubble-meta"><span>Tú</span></div><div>${escapeVocabHtml(nat.es)}</div>`;
      thread.append(bb,ub);
    }
    if(chatTurn>=ch.turns.length){
      const done=document.createElement("div");done.className="chat-done-box";
      done.innerHTML=`<strong>🎉 Conversation Complete! (¡Conversación completa!)</strong><div>First-try natural replies: <strong>${chatFirstTryOk} / ${ch.turns.length}</strong></div><div class="bridge-actions"><button type="button" class="lp-nav-btn chat-replay-btn">↻ Replay</button><button type="button" class="lp-nav-btn primary chat-next-btn">Next Chat →</button></div>`;
      done.querySelector(".chat-replay-btn").onclick=()=>{chatTurn=0;chatSolved=false;chatWrongIds=[];chatCoachMsg="";chatFirstTryOk=0;render();};
      done.querySelector(".chat-next-btn").onclick=()=>{chatIdx=(chatIdx+1)%COLOMBIA_CHATS.length;chatTurn=0;chatSolved=false;chatWrongIds=[];chatCoachMsg="";chatFirstTryOk=0;render();};
      thread.appendChild(done);
      return;
    }
    const t=ch.turns[chatTurn];
    const botB=document.createElement("div");botB.className="chat-bubble bot";
    botB.innerHTML=`<div class="chat-bubble-meta"><span>${escapeVocabHtml(ch.partner)}</span></div>
      <div><strong>${escapeVocabHtml(t.botEs)}</strong></div>
      ${chatShowEn?`<div class="chat-en-line">${escapeVocabHtml(t.botEn)}</div>`:""}
      <div class="chat-bubble-tools"><button type="button" class="chat-mini-btn chat-hear-btn">🔊 Hear</button><button type="button" class="chat-mini-btn chat-en-btn">${chatShowEn?"🙈 Hide EN":"👁️ EN"}</button></div>`;
    botB.querySelector(".chat-hear-btn").onclick=()=>speak(t.tts,0.82);
    botB.querySelector(".chat-en-btn").onclick=()=>{chatShowEn=!chatShowEn;render();};
    thread.appendChild(botB);

    const natOpt=t.options.find(o=>o.quality==="natural")||t.options[0];
    if(chatSolved){
      const uB=document.createElement("div");uB.className="chat-bubble user";
      uB.innerHTML=`<div class="chat-bubble-meta"><span>Tú · ✅ Natural</span></div><div><strong>${escapeVocabHtml(natOpt.es)}</strong></div>`;
      thread.appendChild(uB);
      const fb=document.createElement("div");fb.className="chat-coach-fb ok";
      fb.innerHTML=`<strong>✅ Natural:</strong> ${escapeVocabHtml(natOpt.note)}`;
      const acts=document.createElement("div");acts.className="bridge-actions";acts.style.marginTop="8px";
      const nxt=document.createElement("button");nxt.type="button";nxt.className="lp-nav-btn primary";
      nxt.textContent=chatTurn+1>=ch.turns.length?"Finish Chat →":"Next Turn →";
      nxt.onclick=()=>{
        chatTurn++;chatSolved=false;chatWrongIds=[];chatCoachMsg="";
        render();
        if(chatTurn<ch.turns.length)speak(ch.turns[chatTurn].tts,0.82);
      };
      acts.appendChild(nxt);
      attachMic(acts,natOpt.es,"phrases");
      rZone.append(fb,acts);
    }else{
      const optsWrap=document.createElement("div");optsWrap.className="chat-opts";
      const ordered=t.options.map((o,oi)=>({o,oi})).sort((a,b)=>((a.oi*3+chatIdx+chatTurn)%5)-((b.oi*3+chatIdx+chatTurn)%5));
      ordered.forEach(({o,oi})=>{
        const b=document.createElement("button");b.type="button";
        const tried=chatWrongIds.includes(oi);
        b.className="chat-opt-btn"+(tried?(o.quality==="stiff"?" is-stiff":" is-wrong"):"");
        b.innerHTML=`<strong>${escapeVocabHtml(o.es)}</strong><small>${escapeVocabHtml(o.en)}</small>`;
        b.onclick=()=>{
          if(o.quality==="natural"){
            chatSolved=true;
            if(chatWrongIds.length===0)chatFirstTryOk++;
            markPractice("phrases",o.es);
            if(typeof recordSrs==="function")recordSrs("chat|"+ch.id+"|"+chatTurn,true);
            speak(o.es,0.84);
            render();
          }else{
            if(!chatWrongIds.includes(oi))chatWrongIds.push(oi);
            chatCoachMsg=`${o.tag}: ${o.note}`;
            if(typeof recordSrs==="function")recordSrs("chat|"+ch.id+"|"+chatTurn,false);
            render();
          }
        };
        optsWrap.appendChild(b);
      });
      rZone.appendChild(optsWrap);
      if(chatCoachMsg){
        const cFb=document.createElement("div");cFb.className="chat-coach-fb";
        cFb.textContent=chatCoachMsg;
        rZone.appendChild(cFb);
      }
    }
  };
  render();
  parent.appendChild(sec);
}
