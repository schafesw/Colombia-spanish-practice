import { appStorage } from "../state/storage.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, lpEl } from "../core/text-utils.js";
import { speakingErrors, recordSpeakingError, clearSpeakingError } from "../core/stores.js";
import { openMicPanel } from "../core/speech-mic.js";
import { RR_BANK } from "../core/quiz-bank.js";
import { actions } from "./navigation.js";
import { setLeccionesFocusMode } from "./lesson-player.js";

export function resetRrSession(){rrSession=0;}
export function getRrStats(){return rrStats;}

let rrTimer=null,rrCurrent=null,rrSession=0,rrPromptToken=0;
let rrRecorder=null,rrStream=null,rrChunks=[],rrUrl=null,rrBlob=null,rrSilenceTimer=null,rrMaxTimer=null,rrAudioContext=null,rrAnalyser=null,rrRated=false;
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
try{const rrs=JSON.parse(appStorage.getItem(RR_STATS_KEY)||"{}");if(rrs&&typeof rrs==="object"&&!Array.isArray(rrs))Object.assign(rrStats,rrs);}catch(e){}
function saveRRStats(){try{appStorage.setItem(RR_STATS_KEY,JSON.stringify(rrStats));}catch(e){}}
function rrClearRecording(){if(rrUrl){try{URL.revokeObjectURL(rrUrl);}catch(e){}rrUrl=null;}rrBlob=null;rrChunks=[];}
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
export function rrExit(){rrStop();actions.renderLessons();}
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
    try{rrRecorder=new MediaRecorder(rrStream,{audioBitsPerSecond:24000});}catch(e){rrRecorder=new MediaRecorder(rrStream);}
    rrRecorder.ondataavailable=e=>{if(e.data&&e.data.size)rrChunks.push(e.data);};
    rrRecorder.onstop=()=>{
      const blob=new Blob(rrChunks,{type:(rrRecorder&&rrRecorder.mimeType)||"audio/mp4"});
      rrBlob=blob;
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
  if(reason==="recorded"&&rrBlob){
    window.dispatchEvent(new CustomEvent("esco:rapida-recorded",{detail:{blob:rrBlob,qEs:rrCurrent.qEs||"",qEn:rrCurrent.qEn||"",aEs:rrCurrent.aEs||"",card}}));
  }
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
