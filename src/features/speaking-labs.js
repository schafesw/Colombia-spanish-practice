import { SPEAKING_FRAMES, SLOT_SWAP_MATRICES, SPEAKING_GUIDE } from "../../data/index.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, lpEl, normalizeQuizText } from "../core/text-utils.js";
import { markPractice, recordSrs, recordSpeakingError, clearSpeakingError, missionProgress, saveMissions, readingProgress, saveReadings } from "../core/stores.js";
import { attachMic, openMicPanel } from "../core/speech-mic.js";
import { actions } from "./navigation.js";
import { lpSpeakBtn, setLeccionesFocusMode } from "./lesson-player.js";
import { rrStop } from "./rapida.js";

export function renderMission(mission){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");if(!root)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=actions.renderLessons;root.appendChild(back);
  const card=lpEl("lp-card mission-card");card.appendChild(lpEl("lp-step-title","🗣️ Conversation mission"));card.appendChild(lpEl("mission-title",mission.title));card.appendChild(lpEl("mission-scenario",mission.scenario));card.appendChild(lpEl("mission-prompt",mission.prompt));
  const say=lpEl("mission-say","Say or write your Spanish reply first, then compare with natural Colombian models:");card.appendChild(say);
  const model0=(mission.models&&mission.models[0]&&mission.models[0].es)||"";
  const replyWrap=lpEl("lp-typing mission-reply-box");
  const replyIn=document.createElement("input");replyIn.type="text";replyIn.className="lp-typing-input";replyIn.placeholder="Write your Spanish reply (2+ words) or use 🎙️…";replyIn.autocomplete="off";
  const replyAct=lpEl("lp-typing-actions");
  const checkBtn=document.createElement("button");checkBtn.type="button";checkBtn.className="lp-nav-btn";checkBtn.textContent="Check reply";
  const replyFb=lpEl("lp-typing-feedback","");
  replyAct.appendChild(checkBtn);
  if(model0)attachMic(replyAct,model0,"phrases");
  replyWrap.append(replyIn,replyAct,replyFb);card.appendChild(replyWrap);
  const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn primary";reveal.textContent="👀 Reveal natural answers";
  const models=document.createElement("div");models.className="mission-models";models.hidden=true;
  reveal.onclick=()=>{say.textContent="Compare your idea with these natural Colombian answers:";reveal.remove();models.hidden=false;};card.appendChild(reveal);
  (mission.models||[]).forEach((m,i)=>{const row=document.createElement("div");row.className="mission-model";row.innerHTML=`<div class="mission-model-label">Natural option ${i+1}</div><div class="mission-model-es">${escapeVocabHtml(m.es)}</div><div class="mission-model-en">${escapeVocabHtml(m.en)}</div>`;row.onclick=()=>{markPractice("phrases",m.es);speak(m.tts||m.es,0.75);};attachMic(row,m.es);models.appendChild(row);});
  card.appendChild(models);
  const inRoutine=actions.routineToday().step===4;
  let unlocked=!!missionProgress[mission.id];
  const done=document.createElement("button");done.type="button";done.className="lesson-start";
  const syncDoneBtn=()=>{
    done.disabled=!unlocked;
    done.textContent=!unlocked?"🔒 Check or speak your reply above to complete":(inRoutine?"✅ Finish today’s speaking path":(missionProgress[mission.id]?"✅ Mission completed — practice again":"✅ Complete mission ✓"));
  };
  const unlockMission=msg=>{
    unlocked=true;models.hidden=false;if(reveal.parentNode)reveal.remove();
    replyFb.textContent=msg;
    if(model0){markPractice("phrases",model0);speak(model0,0.75);}
    syncDoneBtn();
  };
  checkBtn.onclick=()=>{
    const txt=replyIn.value.trim();
    const words=normalizeQuizText(txt).split(" ").filter(w=>w.length>=2&&/[a-z]/.test(w));
    if(txt.replace(/[^a-záéíóúüñ]/gi,"").length<4||words.length<2){
      replyFb.textContent="❌ Write at least 2 real Spanish words first (or use the 🎙️ mic).";
      replyIn.focus();
      return;
    }
    unlockMission("✅ Great effort! Compare with the natural answers below, then tap Complete.");
  };
  replyIn.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();checkBtn.click();}};
  const onMic=ev=>{
    const tgt=ev&&ev.detail&&ev.detail.target;
    if(tgt&&(mission.models||[]).some(m=>m.es===tgt||m.tts===tgt)){
      unlockMission("🎙️ Spoken & matched! Tap Complete below.");
      window.removeEventListener("esco:mic-matched",onMic);
    }
  };
  window.addEventListener("esco:mic-matched",onMic);
  syncDoneBtn();
  done.onclick=()=>{if(!unlocked)return;missionProgress[mission.id]=true;saveMissions();if(inRoutine)actions.routineFinishMission();else renderMission(mission);};card.appendChild(done);root.appendChild(card);
}

/* v56 + v71: Sentence-frame trainer & Interactive 3-Column Slot-Swapper. */
let frameSessionIndex=0,frameMode="slots",slotMatrixIndex=0,slotPick=[0,0,0];
export function frameDayNumber(){return Math.floor(Date.now()/86400000);}
export function renderFramePractice(advance){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");
  if(!root||typeof SPEAKING_FRAMES==="undefined"||!SPEAKING_FRAMES.length){return;}
  if(advance)frameSessionIndex=(frameSessionIndex+1)%SPEAKING_FRAMES.length;
  root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=actions.renderLessons;root.appendChild(back);
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
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=actions.renderLessons;root.appendChild(back);
  const card=lpEl("lp-card reading-card");
  card.appendChild(lpEl("reading-kicker",`${reading.level} · LECTURA`));
  card.appendChild(lpEl("lp-step-title",reading.title));
  card.appendChild(lpEl("reading-intro",reading.intro));
  const guide=lpEl("reading-guide","Read the Spanish aloud before revealing the English. Then listen and compare.");card.appendChild(guide);
  const readingText=reading.lines.map(line=>line.tts||line.es).join(". ");
  let readingRate=1;
  let blindMode=false;
  const qs=reading.questions||[];
  const answeredQs=new Set();
  const speed=lpEl("reading-speed");speed.innerHTML="<span>Playback speed</span>";
  [[1,"Full speed"],[0.78,"Slower"],[0.6,"Very slow"]].forEach(([rate,label],i)=>{
    const b=document.createElement("button");b.type="button";b.className="reading-speed-btn";b.textContent=label;b.classList.toggle("selected",i===0);b.onclick=()=>{readingRate=rate;speed.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");speak(readingText,readingRate);};speed.appendChild(b);
  });
  card.appendChild(speed);
  const ctrlRow=lpEl("reading-ctrl-row");
  const play=document.createElement("button");play.type="button";play.className="lp-speak reading-play";play.textContent="▶️ Listen to the whole reading";play.onclick=()=>speak(readingText,readingRate);ctrlRow.appendChild(play);
  const blindBtn=document.createElement("button");blindBtn.type="button";blindBtn.className="reading-blind-btn";blindBtn.textContent="🎧 Listen Blind: OFF";blindBtn.setAttribute("aria-pressed","false");
  ctrlRow.appendChild(blindBtn);
  card.appendChild(ctrlRow);
  const translation=document.createElement("details");translation.className="reading-translation";translation.innerHTML="<summary>📖 Show full English translation</summary><div class='reading-translation-copy'></div>";
  const translationCopy=translation.querySelector(".reading-translation-copy");
  reading.lines.forEach(line=>{const p=document.createElement("p");p.textContent=line.en||"";translationCopy.appendChild(p);});
  card.appendChild(translation);
  const lines=lpEl("reading-lines");
  blindBtn.onclick=()=>{
    blindMode=!blindMode;
    blindBtn.textContent=blindMode?"🎧 Listen Blind: ON":"🎧 Listen Blind: OFF";
    blindBtn.setAttribute("aria-pressed",blindMode?"true":"false");
    blindBtn.classList.toggle("active",blindMode);
    lines.classList.toggle("reading-blind",blindMode);
  };
  reading.lines.forEach((line,i)=>{
    const row=document.createElement("article");row.className="reading-line";
    row.innerHTML=`<div class='reading-line-num'>${i+1}</div><div class='reading-line-copy'><button type='button' class='reading-es'>${escapeVocabHtml(line.es)}</button><button type='button' class='reading-en' hidden>${escapeVocabHtml(line.en)}</button></div><div class='reading-actions'></div>`;
    const es=row.querySelector(".reading-es"),en=row.querySelector(".reading-en");
    es.onclick=()=>{row.classList.add("revealed");speak(line.tts||line.es,readingRate);};en.onclick=()=>{en.hidden=!en.hidden;};
    const rec=document.createElement("button");rec.type="button";rec.className="reading-record";rec.textContent="🎙️";rec.title="Record yourself";rec.setAttribute("aria-label","Record yourself");rec.onclick=()=>openMicPanel(line.tts||line.es);
    row.querySelector(".reading-actions").appendChild(rec);lines.appendChild(row);
  });
  card.appendChild(lines);
  const done=document.createElement("button");done.type="button";done.className="lesson-start";
  const syncReadingDone=()=>{
    if(readingProgress[reading.id]){
      done.disabled=false;
      done.textContent="✅ Reading complete — practice again";
      return;
    }
    const remaining=qs.length-answeredQs.size;
    if(remaining>0){
      done.disabled=true;
      done.textContent=`🔒 Answer ${remaining} comprehension question${remaining===1?"":"s"} above to complete`;
    }else{
      done.disabled=false;
      done.textContent="✅ I read & understood this";
    }
  };
  qs.forEach((q,qi)=>{
    const box=lpEl("reading-question");box.appendChild(lpEl("reading-question-text",q.q));
    const opts=lpEl("reading-question-options");
    const feedback=lpEl("reading-question-feedback","");feedback.setAttribute("aria-live","polite");
    q.choices.forEach(choice=>{const b=document.createElement("button");b.type="button";b.className="reading-choice";b.textContent=choice;b.onclick=()=>{opts.querySelectorAll("button").forEach(x=>x.disabled=true);const ok=choice===q.answer;b.classList.add(ok?"correct":"wrong");if(!ok)opts.querySelectorAll("button").forEach(x=>{if(x.textContent===q.answer)x.classList.add("reveal");});feedback.className="reading-question-feedback "+(ok?"correct":"wrong");feedback.textContent=ok?"✅ Correct — you understood it.":"❌ Not quite. Correct answer: "+q.answer;answeredQs.add(qi);recordSrs("read|"+reading.id+"|"+qi,ok);syncReadingDone();};opts.appendChild(b);});
    box.appendChild(opts);box.appendChild(feedback);card.appendChild(box);
  });
  syncReadingDone();
  done.onclick=()=>{readingProgress[reading.id]=true;saveReadings();markPractice("phrases",reading.title);renderReading(reading);};card.appendChild(done);root.appendChild(card);
}

export const VOICE_NOTE_SCENES=[
  {
    id:"vn-sanjuan-almuerzo",
    region:"guajira",
    sender:"Primo Carlos · San Juan del Cesar 🪗",
    title:"Sancocho en casa de la abuela",
    duration:"0:28",
    tts:"¡Quiubo primo! Oye, hoy mi mamá va a hacer sancocho de gallina como a la una. Si vienes en mototaxi, dile que te deje en la esquina de la tienda de Don Julio. Trae hielo por si las moscas, que hace un calor tremendo.",
    lines:[
      {es:"¡Quiubo primo! Oye, hoy mi mamá va a hacer sancocho de gallina como a la una.",en:"Hey cousin! Listen, today my mom is making chicken sancocho around 1:00."},
      {es:"Si vienes en mototaxi, dile que te deje en la esquina de la tienda de Don Julio.",en:"If you come by mototaxi, tell them to drop you at the corner of Don Julio's corner store."},
      {es:"Trae hielo por si las moscas, que hace un calor tremendo.",en:"Bring ice just in case, because it's super hot."}
    ],
    questions:[
      {q:"What is Carlos's mom cooking?",choices:["Sancocho de gallina around 1:00","Ajiaco at 3:00","Bandeja paisa tonight"],answer:"Sancocho de gallina around 1:00"},
      {q:"Where should the mototaxi drop you?",choices:["Corner of Don Julio's store","Main bus terminal","Plaza Simón Bolívar"],answer:"Corner of Don Julio's store"},
      {q:"What does he ask you to bring just in case?",choices:["Ice (hielo)","Umbrella","Soda"],answer:"Ice (hielo)"}
    ]
  },
  {
    id:"vn-bogota-llaves",
    region:"bogota",
    sender:"Doña Marta · Arrendadora Bogotá 🏔️",
    title:"Llaves, portería y agua caliente",
    duration:"0:32",
    tts:"Buenas tardes Seth, soy Marta del apartamento cuatrocientos dos. Te dejé las llaves con el portero, don Luis. Ojo que para el agua caliente hay que abrir primero la llave izquierda y esperar diez segundos. Cualquier cosa me escribes por WhatsApp.",
    lines:[
      {es:"Buenas tardes Seth, soy Marta del apartamento 402.",en:"Good afternoon Seth, it's Marta from apartment 402."},
      {es:"Te dejé las llaves con el portero, don Luis.",en:"I left the keys with the doorman, Don Luis."},
      {es:"Ojo que para el agua caliente hay que abrir primero la llave izquierda y esperar diez segundos.",en:"Heads up: for hot water you have to turn on the left tap first and wait 10 seconds."},
      {es:"Cualquier cosa me escribes por WhatsApp.",en:"Anything at all, message me on WhatsApp."}
    ],
    questions:[
      {q:"Which apartment is it?",choices:["402","204","412"],answer:"402"},
      {q:"Who has the keys?",choices:["Don Luis at the portería (doorman)","Marta upstairs","A neighbor in 301"],answer:"Don Luis at the portería (doorman)"},
      {q:"How do you get hot water?",choices:["Left tap first, wait 10 seconds","Right tap all the way","Flip the breaker in the kitchen"],answer:"Left tap first, wait 10 seconds"}
    ]
  },
  {
    id:"vn-medellin-cafe",
    region:"medellin",
    sender:"Valeria · Medellín 🌸",
    title:"Cambio de punto de encuentro",
    duration:"0:25",
    tts:"¡Hola! Qué pena contigo, hay un trancón horrible bajando por El Poblado. Mejor nos vemos en el café Pergamino a las cuatro y media en vez de las cuatro. Pídeme un tinto campesino si llegas antes, ya te transfiero por Nequi.",
    lines:[
      {es:"¡Hola! Qué pena contigo, hay un trancón horrible bajando por El Poblado.",en:"Hi! So sorry, there's a horrible traffic jam coming down El Poblado."},
      {es:"Mejor nos vemos en el café Pergamino a las 4:30 en vez de las 4:00.",en:"Better if we meet at Pergamino café at 4:30 instead of 4:00."},
      {es:"Pídeme un tinto campesino si llegas antes, ya te transfiero por Nequi.",en:"Order me a tinto campesino if you arrive early, I'll send you Nequi right away."}
    ],
    questions:[
      {q:"Why is Valeria running late?",choices:["Heavy traffic jam (trancón) in El Poblado","Rain closed the Metro","She lost her keys"],answer:"Heavy traffic jam (trancón) in El Poblado"},
      {q:"New meeting time at Pergamino?",choices:["4:30","4:00","5:15"],answer:"4:30"},
      {q:"What does she ask you to order for her?",choices:["Un tinto campesino (Nequi payback)","A maracuyá juice","Two pandebonos"],answer:"Un tinto campesino (Nequi payback)"}
    ]
  },
  {
    id:"vn-dorado-sim",
    region:"bogota",
    sender:"Andrés · Bogotá (Aeropuerto) ✈️",
    title:"SIM card y cajero en El Dorado",
    duration:"0:27",
    tts:"Cuando salgas de migración en El Dorado, pasa de una al módulo de Claro a mano derecha y pide una SIM prepago con veinte gigas. Para sacar efectivo, usa el cajero de Davivienda o Bancolombia y siempre escoge pagar en pesos colombianos, nunca en dólares.",
    lines:[
      {es:"Cuando salgas de migración en El Dorado, pasa de una al módulo de Claro a mano derecha.",en:"When you leave immigration at El Dorado, go straight to the Claro kiosk on the right."},
      {es:"Pide una SIM prepago con veinte gigas; te la dejan activada ahí mismo.",en:"Ask for a prepaid SIM with 20 GB; they activate it right there on the spot."},
      {es:"Para sacar efectivo, usa Davivienda o Bancolombia y siempre escoge pesos colombianos, nunca dólares.",en:"To withdraw cash, use Davivienda or Bancolombia and always choose Colombian pesos, never dollars."}
    ],
    questions:[
      {q:"Which direction is the Claro kiosk after immigration?",choices:["On the right (a mano derecha)","Upstairs near departures","Across the parking lot"],answer:"On the right (a mano derecha)"},
      {q:"How much data does Andrés recommend?",choices:["20 GB (veinte gigas)","5 GB","100 GB"],answer:"20 GB (veinte gigas)"},
      {q:"Which currency should you choose at the ATM?",choices:["Colombian pesos (never dollars)","US dollars for a locked rate","Euros"],answer:"Colombian pesos (never dollars)"}
    ]
  },
  {
    id:"vn-taxi-seguridad",
    region:"bogota",
    sender:"Camila · Bogotá 🚕",
    title:"Reglas de Uber y 'no dar papaya'",
    duration:"0:26",
    tts:"Ojo con el celular en la calle: acá decimos no dar papaya, así que guárdalo antes de abrir la puerta del carro. Si pides Uber o InDrive de noche, siéntate adelante como si fueras amigo del conductor y confirma siempre las tres últimas letras de la placa.",
    lines:[
      {es:"Ojo con el celular en la calle: acá decimos no dar papaya, guárdalo antes de bajar.",en:"Watch out with your phone on the street: here we say don't make yourself an easy target, put it away before stepping out."},
      {es:"Si pides Uber de noche, siéntate en el puesto de adelante para evitar problemas.",en:"If you order an Uber at night, sit in the front seat to avoid hassles."},
      {es:"Antes de subirte, confirma la placa del carro y pregunta el nombre del conductor.",en:"Before getting in, check the license plate and ask the driver's name."}
    ],
    questions:[
      {q:"What does 'no dar papaya' mean here?",choices:["Don't flash valuables or make yourself an easy target","Never eat papaya before riding","Always tip 30% in cash"],answer:"Don't flash valuables or make yourself an easy target"},
      {q:"Where does Camila suggest sitting in a night Uber?",choices:["In the front seat (adelante)","Always in the left back seat","In the third row"],answer:"In the front seat (adelante)"},
      {q:"What should you verify before getting into the car?",choices:["The license plate (la placa) & driver's name","The driver's passport","The trunk capacity"],answer:"The license plate (la placa) & driver's name"}
    ]
  },
  {
    id:"vn-barberia",
    region:"medellin",
    sender:"Mateo · Medellín 💈",
    title:"Cómo pedir corte en la barbería",
    duration:"0:24",
    tts:"Parce, si vas a la barbería de la esquina, pregunta por Julián y dile que quieres degradado bajito a los lados con la dos, y arriba solo despuntado con tijera. Si te ofrece barba con toalla caliente, dile de una que sí, vale treinta mil pesos.",
    lines:[
      {es:"Si vas a la barbería de la esquina, pregunta por Julián, corta súper bien.",en:"If you go to the corner barbershop, ask for Julián, he cuts super well."},
      {es:"Dile que quieres degradado bajito a los lados con la dos y arriba despuntado con tijera.",en:"Tell him you want a low fade on the sides with a #2 guard and just a scissor trim on top."},
      {es:"Si te ofrece perfilada de barba con toalla caliente, dile de una que sí, vale treinta mil.",en:"If he offers a hot-towel beard trim, say yes right away — it's 30,000 COP."}
    ],
    questions:[
      {q:"Who should you ask for at the corner barbershop?",choices:["Julián","Mateo","Don Luis"],answer:"Julián"},
      {q:"What haircut instructions did Mateo give?",choices:["Low fade with #2 on sides & scissor trim on top","Completely shaved with #0","Bleach highlights"],answer:"Low fade with #2 on sides & scissor trim on top"},
      {q:"How much is the haircut/beard service mentioned?",choices:["30,000 COP (treinta mil)","15,000 COP","90,000 COP"],answer:"30,000 COP (treinta mil)"}
    ]
  },
  {
    id:"vn-drogueria",
    region:"bogota",
    sender:"Dra. Paula · Droguería 💊",
    title:"Recogiendo fórmula médica",
    duration:"0:28",
    tts:"Buenos días, aquí en la droguería ya tenemos listas las pastillas para la alergia y el protector solar. El antihistamínico se toma una sola vez en la noche después de cenar porque da un poquito de sueño, y el recibo quedó a nombre tuyo con cédula o pasaporte.",
    lines:[
      {es:"Buenos días, en la droguería ya tenemos listas tus pastillas para la alergia y el bloqueador.",en:"Good morning, at the pharmacy we have your allergy pills and sunscreen ready."},
      {es:"Toma una sola pastilla en la noche después de cenar porque da un poco de sueño.",en:"Take just one pill at night after dinner because it makes you a bit sleepy."},
      {es:"Trae tu pasaporte o foto del documento en el celular para reclamar el pedido.",en:"Bring your passport or photo ID on your phone to pick up the order."}
    ],
    questions:[
      {q:"When should you take the allergy pill?",choices:["Once at night after dinner","Twice before breakfast","Every 4 hours with coffee"],answer:"Once at night after dinner"},
      {q:"Why take it at night?",choices:["It causes a little drowsiness (da un poco de sueño)","The pharmacy closes early","Sunlight ruins the pill"],answer:"It causes a little drowsiness (da un poco de sueño)"},
      {q:"What should you bring to pick up the order?",choices:["Passport or ID photo on your phone","A signed doctor's stamp in person","Exact change in coins only"],answer:"Passport or ID photo on your phone"}
    ]
  },
  {
    id:"vn-sanjuan-cena",
    region:"guajira",
    sender:"Tía Carmen · San Juan del Cesar 🍲",
    title:"Cena familiar en La Guajira",
    duration:"0:25",
    tts:"Mijo, no comas nada por la tarde porque esta noche hice chivo guisado con arroz de coco, patacones y suero costeño fresquito. Llega como a las siete y media y trae gaseosa o hielo de la tienda de Don Rafa que está a media cuadra.",
    lines:[
      {es:"Mijo, no comas nada por la tarde porque esta noche hice chivo guisado con arroz de coco.",en:"Dear, don't eat anything this afternoon because tonight I made stewed goat with coconut rice."},
      {es:"También hay patacones bien tostados y suero costeño fresquito de la finca.",en:"There are also crispy fried green plantains and fresh coastal cultured cream from the farm."},
      {es:"Llega a las siete y media y pasa por la tienda de Don Rafa por dos bolsas de hielo.",en:"Come by 7:30 and stop at Don Rafa's corner store for two bags of ice."}
    ],
    questions:[
      {q:"Why does Tía Carmen tell you not to eat in the afternoon?",choices:["She cooked stewed goat, coconut rice & patacones for dinner","Everyone is going out to a restaurant at 5","The kitchen is under repair"],answer:"She cooked stewed goat, coconut rice & patacones for dinner"},
      {q:"What time should you arrive?",choices:["7:30 (siete y media)","6:00","9:15"],answer:"7:30 (siete y media)"},
      {q:"What should you pick up at Don Rafa's store?",choices:["Two bags of ice (dos bolsas de hielo)","Three avocados","Charcoal for the grill"],answer:"Two bags of ice (dos bolsas de hielo)"}
    ]
  }
];

export function renderVoiceNoteLab(note){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");if(!root||!note)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=actions.renderLessons;root.appendChild(back);
  const card=lpEl("lp-card vn-card");
  card.appendChild(lpEl("reading-kicker","🎧 NOTA DE VOZ · WHATSAPP LISTENING"));
  card.appendChild(lpEl("lp-step-title",note.title));
  card.appendChild(lpEl("reading-intro",`${note.sender} · ${note.duration}`));
  let rate=0.92;
  const speedRow=lpEl("reading-speed");speedRow.innerHTML="<span>Speed</span>";
  [[0.92,"Natural (0.92×)"],[1.05,"Street (1.05×)"],[0.7,"Clear (0.7×)"]].forEach(([r,lbl],idx)=>{
    const b=document.createElement("button");b.type="button";b.className="reading-speed-btn"+(idx===0?" selected":"");b.textContent=lbl;
    b.onclick=()=>{rate=r;speedRow.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");speak(note.tts,rate);};
    speedRow.appendChild(b);
  });
  card.appendChild(speedRow);
  const play=document.createElement("button");play.type="button";play.className="lp-speak reading-play";play.textContent="▶️ Play Voice Note";play.onclick=()=>speak(note.tts,rate);card.appendChild(play);
  const transcript=document.createElement("details");transcript.className="reading-translation";transcript.innerHTML="<summary>👀 Show Spanish transcript & English (listen blind first!)</summary><div class='reading-translation-copy'></div>";
  const tCopy=transcript.querySelector(".reading-translation-copy");
  note.lines.forEach(l=>{const p=document.createElement("p");p.innerHTML=`<strong>${escapeVocabHtml(l.es)}</strong><br><small>${escapeVocabHtml(l.en)}</small>`;tCopy.appendChild(p);});
  card.appendChild(transcript);

  const solved=new Set();
  const done=document.createElement("button");done.type="button";done.className="lesson-start";
  const syncDone=()=>{
    const left=note.questions.length-solved.size;
    done.disabled=left>0&&!readingProgress[note.id];
    done.textContent=readingProgress[note.id]?"✅ Voice note mastered — listen again":(left>0?`🔒 Answer ${left} detail question${left===1?"":"s"} above to complete`:"✅ Mark Voice Note Complete");
  };
  note.questions.forEach((q,qi)=>{
    const box=lpEl("reading-question");box.appendChild(lpEl("reading-question-text",q.q));
    const opts=lpEl("reading-question-options");const fb=lpEl("reading-question-feedback","");
    q.choices.forEach(c=>{
      const b=document.createElement("button");b.type="button";b.className="reading-choice";b.textContent=c;
      b.onclick=()=>{
        opts.querySelectorAll("button").forEach(x=>x.disabled=true);
        const ok=c===q.answer;
        b.classList.add(ok?"correct":"wrong");
        if(!ok)opts.querySelectorAll("button").forEach(x=>{if(x.textContent===q.answer)x.classList.add("reveal");});
        fb.className="reading-question-feedback "+(ok?"correct":"wrong");
        fb.textContent=ok?"✅ ¡Oído fino!":"❌ Answer: "+q.answer;
        solved.add(qi);recordSrs("vn|"+note.id+"|"+qi,ok);syncDone();
      };
      opts.appendChild(b);
    });
    box.append(opts,fb);card.appendChild(box);
  });
  syncDone();
  done.onclick=()=>{readingProgress[note.id]=true;saveReadings();markPractice("phrases",note.title);renderVoiceNoteLab(note);};
  card.appendChild(done);root.appendChild(card);
}

export const SURVIVAL_EMERGENCY_BANK=[
  {tag:"🚨 123 Emergency",es:"¡Ayuda por favor, necesito llamar al ciento veintitrés!",en:"Help please, I need to call 123 (Colombia emergency number)."},
  {tag:"🛂 Lost Passport / ID",es:"Se me perdió el pasaporte; necesito el número del cuadrante de policía.",en:"I lost my passport; I need the local police precinct number."},
  {tag:"💊 Medical / Allergy",es:"Soy alérgico a la penicilina. ¿Me puede atender un médico?",en:"I'm allergic to penicillin. Can a doctor see me?"},
  {tag:"🚕 Taxi / Uber Safety",es:"Déjeme aquí en la esquina por favor; la placa sí coincide.",en:"Let me off here on the corner please; yes, the license plate matches."},
  {tag:"🏦 Bank / ATM Card",es:"El cajero no me dio efectivo pero me descontaron el retiro.",en:"The ATM didn't give cash but my account was charged."},
  {tag:"🏢 Building / Portería",es:"Soy huésped del apartamento cuatrocientos dos; ¿me abre la puerta por fa?",en:"I'm a guest in apartment 402; can you open the door please?"}
];

export function renderSurvivalCard(root){
  const fold=document.createElement("details");fold.className="starter-more-tools survival-sheet-fold";fold.dataset.lessonView="practice";
  fold.innerHTML=`<summary><span>🚨 Survival &amp; Emergency Quick Sheet</span><small>${SURVIVAL_EMERGENCY_BANK.length} tap-to-speak lines ▾</small></summary>`;
  const list=document.createElement("div");list.className="survival-sheet-list";
  SURVIVAL_EMERGENCY_BANK.forEach(item=>{
    const row=document.createElement("button");row.type="button";row.className="survival-row";
    row.innerHTML=`<div class="survival-copy"><span class="survival-tag">${escapeVocabHtml(item.tag)}</span><strong>${escapeVocabHtml(item.es)}</strong><small>${escapeVocabHtml(item.en)}</small></div><span class="survival-spk">🔊</span>`;
    row.onclick=()=>{markPractice("phrases",item.es);speak(item.es,0.78);};
    list.appendChild(row);
  });
  fold.appendChild(list);root.appendChild(fold);
}
