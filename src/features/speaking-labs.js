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
