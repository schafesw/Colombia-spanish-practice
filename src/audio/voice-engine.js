/** Frozen iPhone/Web Speech API voice engine (preserve synchronous speak & un-deduplicated voices). */
import { appStorage } from "../state/storage.js";

let voices=[],selV=null;
export const VOICE_KEY="esco-selected-voice-v45";
export const VOICE_HOSTS=["fonetica","lecciones","vocab","frases","gram","quiz"];
let savedVoiceKey="";
try{
  appStorage.removeItem("esco-selected-voice-v1");
  appStorage.removeItem("esco-selected-voice-v3");
  savedVoiceKey=appStorage.getItem(VOICE_KEY)||"";
}catch(e){}
export function voiceKey(v){return v?(v.voiceURI||`${v.name}::${v.lang}`):"";}
export function voiceLabel(v){return `${v.lang||"es"} · ${(v.name||"Spanish voice").replace("com.apple.","").replace("voice.","")}`;}
export function getSpanishVoices(){
  if(!window.speechSynthesis)return [];
  voices=window.speechSynthesis.getVoices()||[];
  return voices.filter(v=>/^es(?:-|_|$)/i.test(String(v.lang||"")));
}
export function chooseSpanishVoice(sp){
  const saved=sp.find(v=>voiceKey(v)===savedVoiceKey||(`${v.name}::${v.lang}`===savedVoiceKey));
  if(saved)return saved;
  if(!savedVoiceKey){
    for(const p of["es-CO","es-419","es-MX","es-US","es-AR","es-ES"]){
      const v=sp.find(x=>String(x.lang||"").toUpperCase().startsWith(p.toUpperCase()));
      if(v)return v;
    }
  }
  const kept=selV&&sp.find(v=>v.name===selV.name&&v.lang===selV.lang);
  if(kept)return kept;
  return sp[0]||null;
}
export function rememberVoice(v){
  if(!v)return;
  selV=v;savedVoiceKey=voiceKey(v);
  try{appStorage.setItem(VOICE_KEY,savedVoiceKey);}catch(e){}
}
export function syncVoiceSelectors(){
  const key=voiceKey(selV);
  document.querySelectorAll(".voice-choice").forEach(s=>{if(key)s.value=key;});
}
export function loadV(){
  const sp=getSpanishVoices();
  const next=chooseSpanishVoice(sp);
  if(next)selV=next;
  buildVoiceBars(sp);
}
export function buildVoiceBars(sp=getSpanishVoices()){
  VOICE_HOSTS.forEach(id=>{
    const host=document.getElementById(`voice-bar-${id}`);if(!host)return;
    host.innerHTML="";
    const bar=document.createElement("div");bar.className="voice-bar";
    const label=document.createElement("span");label.className="voice-label";label.textContent="🎙️ Voz";
    const select=document.createElement("select");select.className="voice-select voice-choice";select.setAttribute("aria-label","Spanish voice");
    if(sp.length){
      sp.forEach(v=>{const option=document.createElement("option");option.value=voiceKey(v);option.textContent=voiceLabel(v);select.appendChild(option);});
      if(selV)select.value=voiceKey(selV);
    }else{
      const option=document.createElement("option");option.textContent="Loading Spanish voices…";option.disabled=true;option.selected=true;select.appendChild(option);
    }
    select.onchange=()=>chV(select.value);
    const test=document.createElement("button");test.type="button";test.className="voice-test";test.textContent="Probar";test.onclick=()=>speak("Hola, buenos días Colombia",0.8);
    bar.append(label,select,test);host.appendChild(bar);
  });
}
export function chV(key){const v=getSpanishVoices().find(x=>voiceKey(x)===key);if(v){rememberVoice(v);syncVoiceSelectors();}}
export function speak(t,r,onEnd){
  if(!window.speechSynthesis){if(onEnd)onEnd();return;}
  const sp=getSpanishVoices();
  const saved=savedVoiceKey&&sp.find(v=>voiceKey(v)===savedVoiceKey); /* saved pick wins the moment the list recovers */
  const live=saved||(selV&&sp.find(v=>v.name===selV.name&&v.lang===selV.lang));
  const voice=live||chooseSpanishVoice(sp);
  if(voice)selV=voice; /* use it, but do NOT persist — only an explicit dropdown pick (chV) saves, so a flaky iOS voice list can't overwrite the user's choice */
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t);
  if(voice){u.voice=voice;u.lang=voice.lang;}else u.lang="es-MX"; /* es-MX ships on every iPhone; bare es-CO with no matching voice falls back to English */
  u.rate=r||0.8;
  if(onEnd){let finished=false;const done=()=>{if(finished)return;finished=true;onEnd();};u.onend=done;u.onerror=done;}
  speechSynthesis.speak(u);
  rememberSpoken(t);
}
/* ── Lento (slow replay) ─────────────────────────────────────────────────────
   Every speak() remembers its text; the floating 🐢 button replays it at 0.45x. */
let lastSpokenText=null,lentoBtn=null;
export function rememberSpoken(t){
  lastSpokenText=t;
  if(!lentoBtn){
    lentoBtn=document.createElement("button");
    lentoBtn.className="lento-btn";
    lentoBtn.type="button";
    lentoBtn.innerHTML="🐢";
    lentoBtn.title="Repetir despacio";
    lentoBtn.setAttribute("aria-label","Repetir la última frase despacio");
    lentoBtn.onclick=()=>{
      if(!lastSpokenText)return;
      /* replay directly (not via speak) so it doesn't overwrite lastSpokenText rate context */
      const sp=getSpanishVoices();
      const voice=(selV&&sp.find(v=>v.name===selV.name&&v.lang===selV.lang))||chooseSpanishVoice(sp);
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(lastSpokenText);
      if(voice){u.voice=voice;u.lang=voice.lang;}else u.lang="es-MX";
      u.rate=0.45;
      speechSynthesis.speak(u);
    };
    document.body.appendChild(lentoBtn);
  }
  lentoBtn.style.display="flex";
}
export function initVoiceEngine(){
  if(window.speechSynthesis){
    loadV();
    window.speechSynthesis.onvoiceschanged=loadV;
    setTimeout(loadV,100);
    setTimeout(loadV,500);
  }
}
