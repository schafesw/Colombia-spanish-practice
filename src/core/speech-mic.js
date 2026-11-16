import { speak } from "../audio/voice-engine.js";
import { appState } from "../state/app-state.js";
import { escapeVocabHtml } from "./text-utils.js";
import { markPractice, refreshVocabProgress, recordSpeakingError, clearSpeakingError } from "./stores.js";

export const SPEECH_CHECK_ENABLED=true;
const SR=window.SpeechRecognition||window.webkitSpeechRecognition||null;
let micPanel=null,micRecorder=null,micChunks=[],micUrl=null,micTarget="",micStream=null,micPracticeType="";
export function micSupported(){return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);}
export function micStopStream(){if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}}
export function closeMicPanel(){if(micPanel)micPanel.style.display="none";micStopStream();try{if(micRecorder&&micRecorder.state==="recording")micRecorder.stop();}catch(e){}}
export function openMicPanel(target,practiceType){
  micTarget=target;
  micPracticeType=practiceType||"";
  if(micUrl){URL.revokeObjectURL(micUrl);micUrl=null;}
  if(!micPanel){micPanel=document.createElement("div");micPanel.className="mic-panel";document.body.appendChild(micPanel);}
  renderMicPanel("idle");
  micPanel.style.display="block";
}
function renderMicPanel(state,extra){
  let h='<div class="mic-head"><div class="mic-target">🗣️ '+escapeVocabHtml(micTarget)+'</div><button type="button" class="mic-close">✕</button></div><div class="mic-row">';
  if(state==="recording")h+='<button type="button" class="mic-btn rec" data-mic="stop">⏹ Stop</button>';
  else h+='<button type="button" class="mic-btn" data-mic="start">🔴 Record</button>';
  h+='<button type="button" class="mic-btn" data-mic="model">🔊 Model</button>';
  if(micUrl&&state!=="recording")h+='<button type="button" class="mic-btn teal" data-mic="play">▶️ Your voice</button>';
  if(SPEECH_CHECK_ENABLED&&SR&&state!=="recording")h+='<button type="button" class="mic-btn gold" data-mic="listen">🎯 Check me</button>';
  h+='</div>';
  if(extra)h+='<div class="mic-result">'+extra+'</div>';
  else if(state==="idle"&&!micUrl)h+='<div class="mic-hint">Say it out loud FIRST. “Check me” depends on the browser; Record + compare is the reliable fallback.</div>';
  micPanel.innerHTML=h;
  const closeBtn=micPanel.querySelector(".mic-close");if(closeBtn)closeBtn.onclick=closeMicPanel;
  const bind=(sel,fn)=>{const b=micPanel.querySelector(`[data-mic="${sel}"]`);if(b)b.onclick=fn;};
  bind("stop",micStop);
  bind("start",micStart);
  bind("model",()=>speak(micTarget,0.7));
  bind("play",micPlay);
  bind("listen",micListen);
}
export async function micStart(){
  if(!micSupported()){renderMicPanel("idle","Recording is not available on this device. Use the Model button and your ear.");return;}
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:true});
    micChunks=[];
    micRecorder=new MediaRecorder(micStream);
    micRecorder.ondataavailable=e=>{if(e.data&&e.data.size)micChunks.push(e.data);};
    micRecorder.onstop=()=>{
      const blob=new Blob(micChunks,{type:(micRecorder&&micRecorder.mimeType)||"audio/mp4"});
      if(micUrl)URL.revokeObjectURL(micUrl);
      micUrl=URL.createObjectURL(blob);
      micStopStream();
      if(micPracticeType)markPractice(micPracticeType,micTarget);
      markPracticed(micTarget);renderMicPanel("idle","Done ✅ — tap Your voice, then Model. Do they match?");
    };
    micRecorder.start();
    renderMicPanel("recording","🔴 Recording… say: “"+micTarget+"”");
  }catch(e){
    micStopStream();
    renderMicPanel("idle","Could not access the microphone. Check Settings, Safari, Microphone.");
  }
}
export function micStop(){try{if(micRecorder&&micRecorder.state==="recording")micRecorder.stop();}catch(e){renderMicPanel("idle","Error stopping the recording.");}}
export function micPlay(){if(micUrl){try{new Audio(micUrl).play();}catch(e){}}}
export function micNorm(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zñü ]/g,"").replace(/ +/g," ").trim();}
export function micLev(x,y){
  const m=x.length,n=y.length;if(!m)return n;if(!n)return m;
  let prev=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const cur=[i];
    for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(x[i-1]===y[j-1]?0:1));
    prev=cur;}
  return prev[n];
}
export function micMatch(heardList,target){
  const t=micNorm(target);
  return heardList.some(hRaw=>{
    const h=micNorm(hRaw);
    if(!h)return false;
    if(h===t||h.includes(t))return true;
    if(t.includes(h)&&h.length>=Math.max(3,Math.floor(t.length*0.6)))return true;
    if(micLev(h,t)<=Math.max(1,Math.floor(t.length*0.25)))return true;
    /* Browser recognition often drops a short word or slightly misspells one
       word. Accept a close phrase when at least 75% of its content matches. */
    const tw=t.split(" ").filter(Boolean),hw=h.split(" ").filter(Boolean);
    if(tw.length>=2){
      const matched=tw.filter(word=>hw.some(other=>other===word||(word.length>=4&&micLev(other,word)<=1))).length;
      if(matched/tw.length>=0.75)return true;
    }
    return false;
  });
}
function micErrorMessage(code){
  const messages={
    "not-allowed":"Microphone permission is blocked. Allow microphone access for this site, then try again.",
    "service-not-allowed":"This browser does not allow its speech-check service right now. Use Record + compare by ear.",
    network:"The browser speech service is unavailable. Use Record + compare by ear instead.",
    "audio-capture":"No microphone was available. Check the phone microphone and browser permission.",
    "no-speech":"I did not hear a clear answer. Move closer, speak a little louder, and try again.",
    aborted:"The speech check stopped. Try again when you are ready.",
  };
  return messages[code]||`Speech check unavailable (${code||"unknown error"}). Record yourself and compare by ear.`;
}
export function micListen(){
  if(!SR){renderMicPanel("idle","Speech recognition is not available on this device.");return;}
  const languages=["es-CO","es-419","es-MX","es-ES"];
  let attempt=0,done=false,retrying=false,current=null,noSpeechRetried=false;
  const start=()=>{
    let rec=null;
    try{rec=new SR();}catch(e){renderMicPanel("idle","Recognition is not available here. Use Record + your ear.");return;}
    current=rec;rec.lang=languages[attempt]||"es-MX";rec.interimResults=false;rec.maxAlternatives=3;
    renderMicPanel("listening","🎯 Listening… say: “"+micTarget+"”");
    rec.onresult=e=>{
      if(rec!==current)return;
      done=true;
      const alts=[];for(let i=0;i<e.results[0].length;i++)alts.push(e.results[0][i].transcript);
      const heard=alts[0]||"";
      if(micMatch(alts,micTarget)){clearSpeakingError(micTarget);if(micPracticeType)markPractice(micPracticeType,micTarget);markPracticed(micTarget);renderMicPanel("idle","✅ Understood! I heard: “"+heard+"”");}
      else{recordSpeakingError(micTarget,"speech check");renderMicPanel("idle","❌ I heard: “"+(heard||"…nothing")+"” — try again, slower and louder. It is saved in your practice list.");}
    };
    rec.onerror=e=>{
      if(rec!==current||done)return;
      const code=e.error||"error";
      if(code==="language-not-supported"&&attempt<languages.length-1){retrying=true;attempt++;setTimeout(()=>{if(!done){retrying=false;start();}},180);return;}
      if(code==="no-speech"&&!noSpeechRetried){noSpeechRetried=true;retrying=true;setTimeout(()=>{if(!done){retrying=false;start();}},250);return;}
      done=true;renderMicPanel("idle",micErrorMessage(code));
    };
    rec.onend=()=>{if(rec!==current||done||retrying)return;done=true;renderMicPanel("idle",micErrorMessage("no-speech"));};
    try{rec.start();}catch(e){
      if(attempt<languages.length-1){attempt++;start();}
      else{done=true;renderMicPanel("idle",micErrorMessage("service-not-allowed"));}
    }
  };
  start();
}
export function markPracticed(target){
  try{
    appState.lpPracticed.add(target);
    document.querySelectorAll(".pronun-row").forEach(r=>{
      if(r.dataset.mt===target){r.classList.add("done");const ck=r.querySelector(".pronun-check");if(ck)ck.textContent="✅";}
    });
  }catch(e){}
}
export function attachMic(container,target,practiceType){
  if(!target)return;
  if(!micSupported()&&!(SPEECH_CHECK_ENABLED&&SR))return;
  const b=document.createElement("button");
  b.type="button";b.className="mic-mini";b.textContent="🎙️";b.title="Practice pronunciation";
  b.onclick=e=>{e.stopPropagation();openMicPanel(target,practiceType);};
  container.appendChild(b);
}

