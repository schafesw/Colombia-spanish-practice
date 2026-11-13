// Spanish learning app behavior
// ── Voice ─────────────────────────────────────────────────────────────────────
// ── Local profiles ──────────────────────────────────────────────────────────
// Profiles are intentionally local to this browser/device. They keep quiz,
// lesson, SRS, streak, and practice state separate without requiring accounts.
const nativeStorage=window.localStorage;
const PROFILE_LIST_KEY="esco-profiles-v1";
const ACTIVE_PROFILE_KEY="esco-active-profile-v1";
const PROFILE_MIGRATION_KEY="esco-profile-migrated-v1";
const DEFAULT_PROFILES=[{id:"seth",label:"Seth",emoji:"🧑‍🎓"},{id:"guest",label:"Guest",emoji:"👤"}];
const REMOVED_PROFILE_IDS=new Set(["brad"]);
let profileList=DEFAULT_PROFILES.slice();
let activeProfileId="seth";
try{
  const savedProfiles=JSON.parse(nativeStorage.getItem(PROFILE_LIST_KEY)||"null");
  if(Array.isArray(savedProfiles)&&savedProfiles.length){
    const savedById=new Map(savedProfiles.filter(p=>p&&p.id).map(p=>[p.id,p]));
    profileList=DEFAULT_PROFILES.map(p=>savedById.get(p.id)||p).concat(savedProfiles.filter(p=>p&&p.id&&!REMOVED_PROFILE_IDS.has(p.id)&&!DEFAULT_PROFILES.some(d=>d.id===p.id)));
  }
  const savedActive=nativeStorage.getItem(ACTIVE_PROFILE_KEY);
  if(profileList.some(p=>p.id===savedActive))activeProfileId=savedActive;
}catch(e){}
try{
  for(let i=nativeStorage.length-1;i>=0;i--){
    const key=nativeStorage.key(i);
    if(key&&key.startsWith("esco-profile-brad-"))nativeStorage.removeItem(key);
  }
  if(activeProfileId==="brad")activeProfileId="seth";
}catch(e){}
/* Preserve the existing single-profile app the first time profiles are used. */
try{
  if(!nativeStorage.getItem(PROFILE_MIGRATION_KEY)){
    for(let i=0;i<nativeStorage.length;i++){
      const key=nativeStorage.key(i);
      if(!key||!key.startsWith("esco-")||key.startsWith("esco-profile-")||[PROFILE_LIST_KEY,ACTIVE_PROFILE_KEY,PROFILE_MIGRATION_KEY].includes(key))continue;
      const destination="esco-profile-seth-"+key;
      if(nativeStorage.getItem(destination)===null)nativeStorage.setItem(destination,nativeStorage.getItem(key));
    }
    nativeStorage.setItem(PROFILE_MIGRATION_KEY,"1");
  }
  nativeStorage.setItem(PROFILE_LIST_KEY,JSON.stringify(profileList));
  nativeStorage.setItem(ACTIVE_PROFILE_KEY,activeProfileId);
}catch(e){}
const profileStorage={
  getItem:key=>nativeStorage.getItem("esco-profile-"+activeProfileId+"-"+key),
  setItem:(key,value)=>nativeStorage.setItem("esco-profile-"+activeProfileId+"-"+key,value),
  removeItem:key=>nativeStorage.removeItem("esco-profile-"+activeProfileId+"-"+key),
  key:index=>{const prefix="esco-profile-"+activeProfileId+"-";const keys=[];for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(k&&k.startsWith(prefix))keys.push(k.slice(prefix.length));}return keys[index]||null;},
  get length(){const prefix="esco-profile-"+activeProfileId+"-";let n=0;for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(k&&k.startsWith(prefix))n++;}return n;}
};
// Existing app code can continue using localStorage; this proxy scopes it.
const localStorage=profileStorage;
function buildProfileBar(){
  const host=document.getElementById("profile-host");if(!host)return;
  host.innerHTML="";
  const currentProfile=profileList.find(p=>p.id===activeProfileId)||{label:activeProfileId,emoji:"👤"};
  const drawer=document.createElement("details");drawer.className="top-utility-drawer profile-utility-drawer";
  const summary=document.createElement("summary");summary.className="top-utility-summary";
  summary.innerHTML=`<span>👤 Profile</span><small>${currentProfile.emoji||"👤"} ${currentProfile.label}</small>`;
  const utilityBody=document.createElement("div");utilityBody.className="top-utility-body";
  const bar=document.createElement("div");bar.className="profile-bar";
  const label=document.createElement("span");label.className="profile-label";label.textContent="Profile";
  const select=document.createElement("select");select.className="profile-select";select.setAttribute("aria-label","Choose local profile");
  profileList.forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=(p.emoji||"👤")+" "+p.label;select.appendChild(o);});
  select.value=activeProfileId;
  select.onchange=()=>{activeProfileId=select.value;nativeStorage.setItem(ACTIVE_PROFILE_KEY,activeProfileId);location.reload();};
  const reset=document.createElement("button");reset.type="button";reset.className="profile-reset";reset.textContent=`Reset ${currentProfile.label}`;reset.title=`Clear ${currentProfile.label} progress only`;
  reset.onclick=()=>{
    if(!confirm(`Clear the ${currentProfile.label} profile's saved progress? Other profiles will not change.`))return;
    const prefix=`esco-profile-${activeProfileId}-`;const keys=[];
    for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(k&&k.startsWith(prefix))keys.push(k);}
    keys.forEach(k=>nativeStorage.removeItem(k));
    location.reload();
  };
  const ver=document.createElement("button");ver.type="button";ver.className="profile-reset";ver.textContent="v101.0 🔊";ver.title="Tap to test iPhone/computer audio";
  ver.onclick=()=>speak("Hola, buenos días Colombia",0.82);const themeBtn=document.createElement("button");themeBtn.type="button";themeBtn.id="theme-toggle-btn";themeBtn.className="profile-reset";themeBtn.textContent=(localStorage.getItem("esco-theme-v101")==="light"?"🌙 Dark":"☀️ Sun");themeBtn.title="Switch dark / sunlight theme";themeBtn.onclick=()=>toggleAppTheme();
  bar.append(label,select,reset,ver,themeBtn);utilityBody.appendChild(bar);if(typeof attachProfileBackupControls==="function")attachProfileBackupControls(utilityBody);drawer.append(summary,utilityBody);host.appendChild(drawer);
}
buildProfileBar();
let voices=[],selV=null;
const VOICE_KEY="esco-selected-voice-v45";
const VOICE_HOSTS=["fonetica","lecciones","vocab","frases","gram","quiz"];
let savedVoiceKey="";
try{
  localStorage.removeItem("esco-selected-voice-v1");
  localStorage.removeItem("esco-selected-voice-v3");
  savedVoiceKey=localStorage.getItem(VOICE_KEY)||"";
}catch(e){}
function voiceKey(v){return v?(v.voiceURI||`${v.name}::${v.lang}`):"";}
function voiceLabel(v){return `${v.lang||"es"} · ${(v.name||"Spanish voice").replace("com.apple.","").replace("voice.","")}`;}
function getSpanishVoices(){
  if(!window.speechSynthesis)return [];
  voices=window.speechSynthesis.getVoices()||[];
  return voices.filter(v=>/^es(?:-|_|$)/i.test(String(v.lang||"")));
}
function chooseSpanishVoice(sp){
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
function rememberVoice(v){
  if(!v)return;
  selV=v;savedVoiceKey=voiceKey(v);
  try{localStorage.setItem(VOICE_KEY,savedVoiceKey);}catch(e){}
}
function syncVoiceSelectors(){
  const key=voiceKey(selV);
  document.querySelectorAll(".voice-choice").forEach(s=>{if(key)s.value=key;});
}
function loadV(){
  const sp=getSpanishVoices();
  const next=chooseSpanishVoice(sp);
  if(next)selV=next;
  buildVoiceBars(sp);
}
function buildVoiceBars(sp=getSpanishVoices()){
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
function chV(key){const v=getSpanishVoices().find(x=>voiceKey(x)===key);if(v){rememberVoice(v);syncVoiceSelectors();}}
function speak(t,r,onEnd){
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
function rememberSpoken(t){
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
if(window.speechSynthesis){
  loadV();
  window.speechSynthesis.onvoiceschanged=loadV;
  setTimeout(loadV,100);
  setTimeout(loadV,500);
}

// ── v99.0 Adaptive Mode, Life Focus & Blind-Ear Preferences + v101.0 Theme ────
const THEME_KEY="esco-theme-v101";
function applyAppTheme(t){
  const isLight=t==="light";
  document.documentElement.setAttribute("data-theme",isLight?"light":"dark");
  const btn=document.getElementById("theme-toggle-btn");
  if(btn)btn.textContent=isLight?"🌙 Dark":"☀️ Sun";
}
function toggleAppTheme(){
  const next=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";
  try{localStorage.setItem(THEME_KEY,next);}catch(e){}
  applyAppTheme(next);
}
try{applyAppTheme(localStorage.getItem(THEME_KEY)||"dark");}catch(e){}
const USER_PREFS_KEY="esco-user-prefs-v99";
let userPrefs={level:"auto",focus:"all",blindEar:false,hablarTab:"regions"};
try{
  const rawP=JSON.parse(localStorage.getItem(USER_PREFS_KEY)||"null");
  if(rawP&&typeof rawP==="object"){
    if(["auto","starter","explorer","fluent"].includes(rawP.level))userPrefs.level=rawP.level;
    if(["all","sanjuan","travel","daily"].includes(rawP.focus))userPrefs.focus=rawP.focus;
    userPrefs.blindEar=!!rawP.blindEar;
    if(["regions","visual","ear","trampas","all"].includes(rawP.hablarTab))userPrefs.hablarTab=rawP.hablarTab;
  }
}catch(e){}
function saveUserPrefs(){try{localStorage.setItem(USER_PREFS_KEY,JSON.stringify(userPrefs));}catch(e){}}
function effectiveLevel(){
  if(userPrefs.level!=="auto")return userPrefs.level;
  try{
    const done=LESSONS.filter(x=>lessonProgress[x.id]).length;
    return done>=3?"explorer":"starter";
  }catch(e){return "starter";}
}
function isBlindEarActive(){return !!(userPrefs.blindEar||effectiveLevel()==="fluent");}
function spanishStressHint(text){
  const clean=String(text||"").replace(/[¿?¡!.,;:]+/g,"").trim();
  const words=clean.split(/\s+/).filter(Boolean).slice(0,14);
  return words.map(raw=>{
    const w=raw.toLowerCase();
    if(w.length<=2)return w;
    const vowels=[...w.matchAll(/[aeiouáéíóúü]/gi)];
    if(!vowels.length)return w;
    const acc=w.search(/[áéíóú]/i);
    if(acc>=0)return w.slice(0,acc)+w[acc].toUpperCase()+w.slice(acc+1);
    const endsVowelOrNS=/[aeiousn]$/i.test(w);
    const targetV=vowels[Math.max(0,endsVowelOrNS?vowels.length-2:vowels.length-1)];
    return w.slice(0,targetV.index)+targetV[0].toUpperCase()+w.slice(targetV.index+1);
  }).join(" · ");
}

// ── Build Letras ──────────────────────────────────────────────────────────────
const vg=document.getElementById("vowel-grid");
VL.forEach(l=>{const b=document.createElement("button");b.className="lc";b.id="lc-"+l;b.textContent=l;b.onclick=()=>sel(l);vg.appendChild(b);});
const cgEl=document.getElementById("cons-grid");
CN.forEach(l=>{const b=document.createElement("button");b.className="lc";b.id="lc-"+l;b.textContent=l;b.onclick=()=>sel(l);cgEl.appendChild(b);});
let aL=null;
function sel(l){
  if(aL){const p=document.getElementById("lc-"+aL);if(p)p.className="lc";}
  aL=l;const iv=VL.includes(l);document.getElementById("lc-"+l).className="lc "+(iv?"av":"ac");
  speak(LI[l].tts,0.7);const c=iv?"var(--pink)":"var(--teal)";const i=LI[l];
  document.getElementById("detail-card").innerHTML=`<div class="dc" style="border:1px solid ${iv?"rgba(232,93,117,0.25)":"rgba(74,168,160,0.25)"}">
    <div class="dc-big" style="color:${c}">${l}</div><div class="dc-sub">Se llama</div><div class="dc-name">"${i.name}"</div>
    <div class="dc-phon">[${i.phonetic}]</div><div class="dc-badge">${iv?"🔴 Vocal — el alma de cada sílaba":"🔵 Consonante — se combina con vocales"}</div><br/>
    <button class="spk-btn" style="background:${c}" onclick="speak('${i.tts}',0.65)">🔊 Escuchar otra vez</button></div>`;
}

// ── Build Sílabas ─────────────────────────────────────────────────────────────
const SYL_CONS=CN.flatMap(l=>l==="R"?[l,"RR"]:[l]);
let aF=null;const fw=document.getElementById("filter-wrap");
const fab=document.createElement("button");fab.className="fb active";fab.id="fb-all";fab.textContent="Todas";fab.onclick=()=>sF(null);fw.appendChild(fab);
SYL_CONS.forEach(l=>{const b=document.createElement("button");b.className="fb";b.id="fb-"+l;b.textContent=l;b.onclick=()=>sF(l);fw.appendChild(b);});
function sF(l){document.getElementById(aF?"fb-"+aF:"fb-all").classList.remove("active");aF=l;document.getElementById(l?"fb-"+l:"fb-all").classList.add("active");rC();}
function rC(){
  const c=document.getElementById("combo-groups");c.innerHTML="";
  (aF?[aF]:SYL_CONS).forEach(con=>{
    const ch=con==="Ñ"?"ñ":con.toLowerCase();const g=document.createElement("div");g.className="cg";
    const sub=con==="X"?"X casi siempre va entre vocales — palabras reales":con==="H"?"H muda — suena como la vocal":con==="RR"?"RR fuerte — practica la vibración":"Toca para escuchar";
    const headerTts=con==="RR"?"erre doble":LI[con].tts;
    g.innerHTML=`<div class="cg-hdr"><button class="cg-badge" onclick="speak('${headerTts}',0.7)">${con}</button>
      <div><div class="cg-title">${con==="X"?"X en palabras reales":con+" + vocal"}</div><div class="cg-sub">${sub}</div></div></div><div class="g5c" id="cg-${con}"></div>`;
    c.appendChild(g);const gr=g.querySelector(".g5c");
    /* X never starts a Spanish syllable — show real words instead of fake X+vowel combos */
    if(con==="X"){
      gr.style.gridTemplateColumns="repeat(3,1fr)";
      X_EXAMPLES.forEach(ex=>{
        const chip=document.createElement("button");chip.className="cc";
        const w=ex.word.replace(/x/i,m=>`<span style="color:var(--pink)">${m}</span>`);
        chip.innerHTML=`<span class="cc-big" style="font-size:1.05rem;color:var(--teal)">${w}</span>
          <span class="cc-ph">${ex.ph}</span><span class="cc-note">${ex.en}</span>
          <span style="font-size:0.8rem">🔊</span>`;
        chip.onclick=()=>speak(ex.tts,0.75);gr.appendChild(chip);
      });
      return;
    }
    if(con==="RR"){
      gr.style.gridTemplateColumns="repeat(3,1fr)";
      VW.forEach(v=>{const ex=RR_SOUND_EXAMPLES[v];const chip=document.createElement("button");chip.className="cc rr-example";
        chip.innerHTML=`<span class="cc-big"><span style="color:var(--teal)">RR</span><span style="color:var(--pink)">${v}</span></span><span class="cc-ph">${ex.ph}</span><span class="cc-note">${ex.word}</span><span style="font-size:0.8rem">🔊</span>`;
        chip.title=`RR${v} — ${ex.word}`;chip.onclick=()=>speak(ex.tts,0.75);gr.appendChild(chip);});
      return;
    }
    VW.forEach(v=>{const inf=gc(con,v);const d=ch+v;const chip=document.createElement("button");chip.className="cc";
      const note=con==="H"?"H muda · suena como la vocal":inf.n;
      chip.innerHTML=`<span class="cc-big"><span style="color:var(--teal)">${d[0].toUpperCase()}</span><span style="color:var(--pink)">${d[1]}</span></span>
        <span class="cc-ph">${inf.p}</span>${note?`<span class="cc-note">${note}</span>`:""}
        <span style="font-size:0.8rem">🔊</span>`;
      const label=d;chip.onclick=()=>speakSyl(label,inf.t);gr.appendChild(chip);});});
}
rC();

function renderPhoneticWarmup(){
  const root=document.getElementById("phonetic-warmup");
  if(!root||typeof PHONETIC_WARMUP==="undefined")return;
  root.innerHTML="";
  PHONETIC_WARMUP.forEach(step=>{
    const row=document.createElement("div");row.className="warmup-row";
    row.innerHTML=`<div class='warmup-copy'><strong>${escapeVocabHtml(step.label)}</strong><span>${escapeVocabHtml(step.detail)}</span><small>${escapeVocabHtml(step.note)}</small></div><div class='warmup-actions'></div>`;
    const actions=row.querySelector(".warmup-actions");
    const listen=document.createElement("button");listen.type="button";listen.className="warmup-btn";listen.textContent="🔊 Listen";listen.onclick=()=>{markPractice("phrases",step.target);speak(step.tts,0.68);};
    const record=document.createElement("button");record.type="button";record.className="warmup-btn warmup-record";record.textContent="🎙️ Say it";record.onclick=()=>openMicPanel(step.target);
    actions.append(listen,record);root.appendChild(row);
  });
}
function renderEnglishInterference(){
  const root=document.getElementById("english-interference-list");
  if(!root||typeof ENGLISH_INTERFERENCE==="undefined")return;
  root.innerHTML="";
  ENGLISH_INTERFERENCE.forEach(item=>{
    const card=document.createElement("button");card.type="button";card.className="interference-card";card.title="Listen to the Spanish example";
    card.innerHTML=`<span class='interference-pattern'>${escapeVocabHtml(item.pattern)}</span><strong>${escapeVocabHtml(item.spanish)}</strong><small>${escapeVocabHtml(item.english)}</small><em>${escapeVocabHtml(item.example)} · ${escapeVocabHtml(item.en)}</em><span class='interference-speak'>🔊</span>`;
    card.onclick=()=>speak(item.tts,0.72);root.appendChild(card);
  });
}
function renderMinimalPairs(){
  const root=document.getElementById("minimal-pairs-list");
  if(!root||typeof MINIMAL_PAIRS==="undefined")return;
  root.innerHTML="";
  MINIMAL_PAIRS.forEach(pair=>{
    const card=document.createElement("article");card.className="minimal-pair-card";
    card.innerHTML=`<div class='minimal-pair-words'><button type='button' class='minimal-word'><strong>${escapeVocabHtml(pair.a)}</strong><small>${escapeVocabHtml(pair.aEn)}</small></button><span class='minimal-vs'>vs.</span><button type='button' class='minimal-word'><strong>${escapeVocabHtml(pair.b)}</strong><small>${escapeVocabHtml(pair.bEn)}</small></button></div><div class='minimal-pair-tip'>${escapeVocabHtml(pair.tip)}</div><div class='minimal-pair-actions'></div>`;
    card.querySelectorAll(".minimal-word").forEach((button,i)=>button.onclick=()=>speak(i===0?pair.a:pair.b,0.72));
    const actions=card.querySelector(".minimal-pair-actions");
    const listen=document.createElement("button");listen.type="button";listen.className="twister-btn";listen.textContent="🔊 Hear both";listen.onclick=()=>speak(pair.tts,0.68);
    const record=document.createElement("button");record.type="button";record.className="twister-btn gold";record.textContent="🎙️ Compare";record.onclick=()=>openMicPanel(`${pair.a}, ${pair.b}`);
    actions.append(listen,record);root.appendChild(card);
  });
}
function renderSpanishThinking(){
  const root=document.getElementById("spanish-thinking");
  if(!root||typeof SPANISH_THINKING_PROMPTS==="undefined")return;
  let index=0,revealed=false;
  const draw=()=>{
    const item=SPANISH_THINKING_PROMPTS[index%SPANISH_THINKING_PROMPTS.length];
    root.innerHTML=`<div class='thinking-intent'>${escapeVocabHtml(item.intent)}</div><div class='thinking-model' ${revealed?"":"hidden"}>${escapeVocabHtml(item.model)}</div><div class='thinking-actions'></div>`;
    const actions=root.querySelector(".thinking-actions");
    const reveal=document.createElement("button");reveal.type="button";reveal.className="warmup-btn";reveal.textContent=revealed?"✅ Model shown":"👀 Reveal model";reveal.onclick=()=>{revealed=true;draw();};
    const hear=document.createElement("button");hear.type="button";hear.className="warmup-btn";hear.textContent="🔊 Hear";hear.onclick=()=>speak(item.tts,0.72);
    const say=document.createElement("button");say.type="button";say.className="warmup-btn warmup-record";say.textContent="🎙️ Say it";say.onclick=()=>openMicPanel(item.model);
    const next=document.createElement("button");next.type="button";next.className="warmup-btn warmup-next";next.textContent="Next →";next.onclick=()=>{index=(index+1)%SPANISH_THINKING_PROMPTS.length;revealed=false;draw();};
    actions.append(reveal,hear,say,next);
  };
  draw();
}
function openPhoneticSection(id){
  const target=document.getElementById(id);if(!target)return;
  if(target.tagName.toLowerCase()==="details")target.open=true;
  setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"start"}),20);
}
function setupPhoneticLinks(){
  document.querySelectorAll(".phonetic-map-links a").forEach(link=>link.onclick=event=>{event.preventDefault();openPhoneticSection(link.getAttribute("href").slice(1));});
  const jump=document.getElementById("phonetic-jump");
  if(jump)jump.onchange=()=>{if(jump.value){openPhoneticSection(jump.value);jump.value="";}};
}
renderPhoneticWarmup();renderEnglishInterference();renderMinimalPairs();renderSpanishThinking();setupPhoneticLinks();

// ── Special spelling sounds (v35) ────────────────────────────────────────────
function renderSpecialSounds(){
  const root=document.getElementById("special-sound-lab");
  if(!root||typeof SPECIAL_SOUNDS==="undefined")return;
  root.innerHTML="<div class='special-sound-intro'>Tap a word, listen, then record yourself. Pay attention to the silent U and the two dots over Ü.</div>";
  SPECIAL_SOUNDS.forEach(group=>{
    const section=document.createElement("section");section.className="special-sound-group";
    section.innerHTML=`<div class='special-sound-title'><strong>${group.label}</strong><span>${group.sound}</span></div><div class='special-sound-tip'>${group.tip}</div>`;
    const grid=document.createElement("div");grid.className="special-sound-grid";
    group.examples.forEach(ex=>{
      const card=document.createElement("article");card.className="special-sound-card";
      card.innerHTML=`<button type='button' class='special-sound-word'><strong>${escapeVocabHtml(ex.word)}</strong><small>${escapeVocabHtml(ex.ph)}</small><em>${escapeVocabHtml(ex.en)}</em><span>🔊</span></button>`;
      card.querySelector(".special-sound-word").onclick=()=>speak(ex.tts,0.7);
      const rec=document.createElement("button");rec.type="button";rec.className="special-sound-record";rec.textContent="🎙️ Record";rec.onclick=()=>openMicPanel(ex.tts);
      card.appendChild(rec);grid.appendChild(card);
    });
    section.appendChild(grid);root.appendChild(section);
  });
}
renderSpecialSounds();

let routineTwisterSelection=null;
function getDailyTwisterSelection(){
  const rr=TONGUE_TWISTERS.filter(x=>x.target==="RR");
  const ene=TONGUE_TWISTERS.filter(x=>x.target==="Ñ");
  const now=new Date();const day=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);
  return [rr[day%rr.length],ene[day%ene.length]].filter(Boolean);
}
function renderTongueTwisters(){
  const root=document.getElementById("tongue-twister-lab");
  if(!root||typeof TONGUE_TWISTERS==="undefined")return;
  root.innerHTML="<div class='special-sound-intro'>Round 1: listen slowly. Round 2: repeat at a natural speed. Round 3: record yourself and compare. Accuracy comes before speed.</div>";
  const filters=document.createElement("div");filters.className="twister-filters";
  const list=document.createElement("div");list.className="twister-list";
  const tips=document.createElement("div");tips.className="sound-tips";
  if(typeof PRONUNCIATION_TIPS!=="undefined")PRONUNCIATION_TIPS.forEach(t=>{
    const card=document.createElement("article");card.className="sound-tip-card";
    card.innerHTML=`<div class='sound-tip-head'><span class='twister-target'>${escapeVocabHtml(t.target)}</span><strong>${escapeVocabHtml(t.title)}</strong></div><div class='sound-tip-sound'>${escapeVocabHtml(t.sound)}</div><ol>${t.steps.map(step=>`<li>${escapeVocabHtml(step)}</li>`).join("")}</ol><div class='sound-tip-avoid'><strong>Watch for:</strong> ${escapeVocabHtml(t.avoid)}</div>`;
    tips.appendChild(card);
  });
  const groups=["ALL",...new Set(TONGUE_TWISTERS.map(x=>x.target))];
  const render=(filter)=>{list.innerHTML="";TONGUE_TWISTERS.filter(x=>filter==="ALL"||x.target===filter).forEach(item=>{
    const card=document.createElement("article");card.className="twister-card";card.dataset.twisterId=item.id;
    card.innerHTML=`<div class='twister-top'><span class='twister-target'>${item.target}</span><strong>${item.title}</strong></div><div class='twister-es'>${escapeVocabHtml(item.text)}</div><div class='twister-en'>${escapeVocabHtml(item.en)}</div><div class='twister-actions'></div>`;
    const actions=card.querySelector(".twister-actions");
    const listen=document.createElement("button");listen.type="button";listen.className="twister-btn";listen.textContent="🔊 Listen";listen.onclick=()=>{markPractice("phrases",item.text);speak(item.tts,0.65);};
    const slow=document.createElement("button");slow.type="button";slow.className="twister-btn";slow.textContent="🐢 Slow";slow.onclick=()=>{markPractice("phrases",item.text);speak(item.tts,0.45);};
    const record=document.createElement("button");record.type="button";record.className="twister-btn gold";record.textContent="🎙️ Record";record.onclick=()=>openMicPanel(item.tts);
    actions.append(listen,slow,record);list.appendChild(card);
  });};
  groups.forEach((group,i)=>{const b=document.createElement("button");b.type="button";b.className="fb twister-filter"+(i===0?" active":"");b.textContent=group;b.onclick=()=>{filters.querySelectorAll(".twister-filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(group);};filters.appendChild(b);});
  root.append(tips,filters,list);render("ALL");
}
renderTongueTwisters();

// ── Build Vocab ───────────────────────────────────────────────────────────────
const VOCAB_CATS=VC.filter(cat=>cat.id!=="vocales");
const VOCAB_LAST_KEY="esco-vocab-last-v1";
const PRACTICE_KEY="esco-practice-v1";
let practiceStore={vocab:{},phrases:{}};
try{practiceStore=Object.assign(practiceStore,JSON.parse(localStorage.getItem(PRACTICE_KEY)||"{}"));practiceStore.vocab=practiceStore.vocab||{};practiceStore.phrases=practiceStore.phrases||{};}catch(e){practiceStore={vocab:{},phrases:{}};}
function savePractice(){try{localStorage.setItem(PRACTICE_KEY,JSON.stringify(practiceStore));}catch(e){}}
function practiceKey(value){return String(value||"").trim().toLowerCase();}
function refreshVocabProgress(){
  const cat=typeof VOCAB_CATS!=="undefined"?VOCAB_CATS.find(c=>c.id===aC):null,keys=vocabKeys(cat),strong=document.querySelector("#vocab-list .vocab-progress strong"),fill=document.querySelector("#vocab-list .vocab-progress-fill");
  if(!cat||!keys.length||!strong)return;
  const done=practicedCount("vocab",keys);strong.textContent=`${done} of ${keys.length} practiced`;if(fill)fill.style.width=`${Math.round(done/keys.length*100)}%`;
}
function markPractice(type,value){const key=practiceKey(value);if(!key)return;const bucket=practiceStore[type]||(practiceStore[type]={});bucket[key]=(bucket[key]||0)+1;savePractice();refreshVocabProgress();}
function practiced(type,value){return !!(practiceStore[type]&&practiceStore[type][practiceKey(value)]);}
function practicedCount(type,values){return (values||[]).filter(v=>practiced(type,v)).length;}
function vocabKeys(cat){
  if(!cat)return [];
  if(cat.type==="basic")return (cat.items||[]).map(i=>i.tts||i.word);
  if(cat.type==="verbos")return Object.keys(VERBS);
  if(cat.type==="numeros")return [...N130,...NT].map(n=>n.w);
  if(cat.type==="preguntas")return PQ.map(p=>p.tts||p.word);
  if(cat.type==="colombianismos")return COLOMBIANISMOS.map(c=>c.tts||c.word);
  return [];
}
function phraseProgress(items){return practicedCount("phrases",[...new Set((items||[]).map(i=>i.es))]);}
const vocabHome=document.getElementById("vocab-home");
const vocabHomeJump=document.getElementById("vocab-home-jump");
const vocabJumpHome=document.getElementById("vocab-jump-home");
const vocabCategoryView=document.getElementById("vocab-category-view");
const vocabHomeBack=document.getElementById("vocab-home-back");
const cw=document.getElementById("cat-wrap");
const vocabJump=document.getElementById("vocab-jump");
const vocabPosition=document.getElementById("vocab-position");
const vocabPrev=document.getElementById("vocab-prev");
const vocabNext=document.getElementById("vocab-next");
const vocabSearch=document.getElementById("vocab-search");
const vocabSearchView=document.getElementById("vocab-search-view");
let aC="gustos";
try{aC=localStorage.getItem(VOCAB_LAST_KEY)||aC;}catch(e){}
if(!VOCAB_CATS.some(cat=>cat.id===aC))aC=VOCAB_CATS.some(cat=>cat.id==="gustos")?"gustos":(VOCAB_CATS[0]?.id||"");
const VOCAB_GROUPS=[
  {title:"Start with everyday speech",sub:"Useful words for talking about yourself",ids:["gustos","familia","verbos","acciones","tiempo","emociones","colombianismos"]},
  {title:"Daily life",sub:"Home, food, clothing, and things around you",ids:["comida","casa","habitacion","bano","cocina","ropa","cuerpo"]},
  {title:"Getting things done",sub:"Work, travel, directions, and technology",ids:["numeros","direcciones","lugares","trabajo","oficina","carropartes","tecnologia","tv"]},
  {title:"Describe the world",sub:"People, places, weather, and details",ids:["colores","adjetivos","meses","dias","profesiones","animales","clima","preguntas"]}
];
VOCAB_CATS.forEach(cat=>{const p=document.createElement("button");p.className="cat-pill";p.textContent=cat.label;p.onclick=()=>sCat(cat.id);cw.appendChild(p);});
vocabJump.innerHTML=VOCAB_CATS.map(cat=>`<option value="${cat.id}">${cat.label}</option>`).join("");
vocabJumpHome.innerHTML=`<option value="">Choose a category…</option>`+VOCAB_CATS.map(cat=>`<option value="${cat.id}">${cat.label}</option>`).join("");
vocabJump.onchange=()=>sCat(vocabJump.value);
vocabJumpHome.onchange=()=>{if(vocabJumpHome.value)sCat(vocabJumpHome.value);};
vocabPrev.onclick=()=>{const i=VOCAB_CATS.findIndex(c=>c.id===aC);if(i>0)sCat(VOCAB_CATS[i-1].id);};
vocabNext.onclick=()=>{const i=VOCAB_CATS.findIndex(c=>c.id===aC);if(i<VOCAB_CATS.length-1)sCat(VOCAB_CATS[i+1].id);};
vocabHomeBack.onclick=()=>showVocabHome();
function vocabCount(cat){
  if(cat.type==="basic")return cat.items?.length||0;
  if(cat.type==="verbos")return Object.keys(VERBS).length;
  if(cat.type==="numeros")return N130.length+NT.length;
  if(cat.type==="preguntas")return PQ.length;
  if(cat.type==="colombianismos")return COLOMBIANISMOS.length;
  return 0;
}
function vocabCard(cat,tag){
  const b=document.createElement("button");b.type="button";b.className="vocab-home-card";
  const total=vocabCount(cat),done=practicedCount("vocab",vocabKeys(cat));
  b.innerHTML=`<span class="vocab-home-card-title">${cat.label}</span><span class="vocab-home-card-meta">${total} ${tag||"words"} · ${done} practiced <span>›</span></span>`;
  b.onclick=()=>sCat(cat.id);return b;
}
function renderVocabHome(){
  if(!vocabHome)return;
  vocabHome.innerHTML="";
  const intro=document.createElement("div");intro.className="vocab-home-intro";
  intro.innerHTML="<div class='vocab-home-kicker'>Choose a topic · Elige un tema</div><div class='vocab-home-title'>What do you want to practice?</div><div class='vocab-home-sub'>Tap a section to learn the word, hear the pronunciation, and see it used in a sentence.</div>";
  vocabHome.appendChild(intro);
  const last=VOCAB_CATS.find(cat=>cat.id===aC);
  if(last){
    const continueCard=document.createElement("button");continueCard.type="button";continueCard.className="vocab-continue-card";
    continueCard.innerHTML=`<span class="vocab-continue-icon">▶</span><span class="vocab-continue-copy"><span class="vocab-continue-label">Continue / Continuar</span><strong>${last.label}</strong><small>${vocabCount(last)} words ready to practice</small></span><span class="vocab-home-arrow">›</span>`;
    continueCard.onclick=()=>sCat(last.id);vocabHome.appendChild(continueCard);
  }
  const phon=document.createElement("button");phon.type="button";phon.className="vocab-phonetic-card";
  phon.innerHTML="<span class='vocab-phonetic-icon'>🔤</span><span><strong>Fonética</strong><small>Vocales, consonantes, y sílabas</small></span><span class='vocab-home-arrow'>›</span>";
  phon.onclick=()=>{showPage("fonetica");showPhonetic("letters");};vocabHome.appendChild(phon);
  VOCAB_GROUPS.forEach(group=>{
    const section=document.createElement("section");section.className="vocab-home-group";
    section.innerHTML=`<div class="vocab-home-group-title">${group.title}</div><div class="vocab-home-group-sub">${group.sub}</div>`;
    const grid=document.createElement("div");grid.className="vocab-home-grid";
    group.ids.map(id=>VOCAB_CATS.find(cat=>cat.id===id)).filter(Boolean).forEach(cat=>grid.appendChild(vocabCard(cat)));
    section.appendChild(grid);vocabHome.appendChild(section);
  });
}
function showVocabHome(){
  hideVerbDetail();
  if(vocabSearchView)vocabSearchView.hidden=true;
  vocabHomeJump.hidden=false;vocabHome.hidden=false;vocabCategoryView.hidden=true;renderVocabHome();
}
function showVocabCategory(){if(vocabSearchView)vocabSearchView.hidden=true;vocabHomeJump.hidden=true;vocabHome.hidden=true;vocabCategoryView.hidden=false;}
function updateVocabNav(){
  const i=VOCAB_CATS.findIndex(c=>c.id===aC);
  if(i<0)return;
  vocabJump.value=aC;if(vocabJumpHome)vocabJumpHome.value=aC;vocabPosition.textContent=`${i+1} of ${VOCAB_CATS.length}`;
  vocabPrev.disabled=i<=0;vocabNext.disabled=i>=VOCAB_CATS.length-1;
}
function sCat(id){
  if(id==="vocales"){showPage("fonetica");showPhonetic("letters");return;}
  if(!VOCAB_CATS.some(cat=>cat.id===id))return;
  document.querySelectorAll(".cat-pill").forEach((p,i)=>p.classList.toggle("active",VOCAB_CATS[i].id===id));
  aC=id;try{localStorage.setItem(VOCAB_LAST_KEY,aC);}catch(e){}
  showVocabCategory();updateVocabNav();hideVerbDetail();rV();document.querySelector(".scroll").scrollTop=0;
}
function renderVocabSearch(term){
  if(!vocabSearchView)return;
  const q=String(term||"").trim().toLowerCase();
  if(!q){showVocabHome();return;}
  vocabHomeJump.hidden=true;vocabHome.hidden=true;vocabCategoryView.hidden=true;vocabSearchView.hidden=false;vocabSearchView.innerHTML="";
  const head=document.createElement("div");head.className="search-results-head";head.innerHTML=`<strong>Global Search Results</strong><span>${escapeVocabHtml(q)}</span>`;vocabSearchView.appendChild(head);
  const rows=[];
  VOCAB_CATS.forEach(cat=>{
    if(cat.type==="basic")(cat.items||[]).forEach(item=>{if((item.word+" "+item.en).toLowerCase().includes(q))rows.push({word:item.word,en:item.en,tts:item.tts||item.word,cat:cat.label});});
    if(cat.type==="verbos")Object.entries(VERBS).forEach(([word,v])=>{if((word+" "+v.en).toLowerCase().includes(q))rows.push({word,en:v.en,tts:word,cat:cat.label});});
    if(cat.type==="colombianismos")COLOMBIANISMOS.forEach(item=>{if((item.word+" "+item.en+" "+item.usage+" "+item.example+" "+(item.register||"")).toLowerCase().includes(q))rows.push({word:item.word,en:item.en,tts:item.tts||item.word,cat:cat.label,usage:item.usage,example:item.example});});
  });
  if(typeof FRASES!=="undefined")FRASES.filter(s=>s.section&&Array.isArray(s.items)).forEach(sec=>{
    sec.items.forEach(it=>{if((it.es+" "+it.en+" "+(it.register||"")+" "+sec.section).toLowerCase().includes(q))rows.push({word:it.es,en:it.en,tts:it.es,cat:"💬 "+sec.section,usage:it.register||""});});
  });
  if(typeof TRAMPAS_COLOMBIANAS!=="undefined")TRAMPAS_COLOMBIANAS.forEach(t=>{
    if((t.trap+" "+t.realMeaning+" "+t.wrongGuess+" "+t.es+" "+t.en).toLowerCase().includes(q))rows.push({word:`🪤 ${t.trap}`,en:`Real meaning: ${t.realMeaning}`,tts:t.es,cat:"🪤 Trampas Colombianas",usage:`⚠️ Literal trap: ${t.wrongGuess}`,example:t.es});
  });
  if(typeof STREET_EAR_LINKER!=="undefined")STREET_EAR_LINKER.forEach(e=>{
    if((e.streetEs+" "+e.carefulEs+" "+e.en+" "+e.context).toLowerCase().includes(q))rows.push({word:`🎧 ${e.streetEs}`,en:`${e.carefulEs} — ${e.en}`,tts:e.carefulEs,cat:"🎧 Street Ear",usage:e.tip});
  });
  if(typeof REGIONAL_ATLAS!=="undefined")REGIONAL_ATLAS.forEach(reg=>{
    (reg.items||[]).forEach(it=>{if((reg.title+" "+reg.tab+" "+it.es+" "+it.en+" "+it.tip).toLowerCase().includes(q))rows.push({word:it.es,en:it.en,tts:it.es,cat:reg.tab,usage:it.tip});});
  });
  if(typeof LESSONS!=="undefined")LESSONS.forEach(les=>{
    if((les.title+" "+les.sub+" "+les.id).toLowerCase().includes(q))rows.push({word:`🎯 Lesson: ${les.icon} ${les.title}`,en:les.sub,tts:les.title,cat:"📘 Guided Lesson",lessonObj:les});
  });
  if(!rows.length){vocabSearchView.appendChild(lpEl("search-empty","No matches yet. Try searching 'San Juan', 'friche', 'cancelar', 'estrato', or any Spanish/English word."));return;}
  rows.slice(0,80).forEach(row=>{
    const card=document.createElement("button");card.type="button";card.className="search-result-card";
    card.innerHTML=`<span><small class="search-cat-pill">${escapeVocabHtml(row.cat||"Vocab")}</small><strong>${escapeVocabHtml(row.word)}</strong><small>${escapeVocabHtml(row.en)}</small>${row.usage?`<em>${escapeVocabHtml(row.usage)}</em>`:""}${row.example?`<small>💬 ${escapeVocabHtml(row.example)}</small>`:""}</span><span>${row.lessonObj?"Open ›":"🔊"}</span>`;
    card.onclick=()=>{
      if(row.lessonObj){showPage("lecciones");openLesson(row.lessonObj);return;}
      markPractice("vocab",row.tts);speak(row.tts,0.75);
    };
    vocabSearchView.appendChild(card);
  });
  if(rows.length>80)vocabSearchView.appendChild(lpEl("search-empty",`Showing 80 of ${rows.length} matches.`));
}
if(vocabSearch)vocabSearch.oninput=()=>renderVocabSearch(vocabSearch.value);
function escapeVocabHtml(value){return String(value||"").replace(/[&<>\"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[ch]));}
function addEnglishHint(parent,text,label="💡 English help"){
  if(!parent||!text)return;
  const wrap=document.createElement("div");wrap.className="english-hint";
  const button=document.createElement("button");button.type="button";button.className="english-hint-btn";button.textContent=label;button.setAttribute("aria-expanded","false");
  const copy=document.createElement("span");copy.className="english-hint-text";copy.hidden=true;copy.textContent=text;
  button.onclick=e=>{e.stopPropagation();const open=copy.hidden;copy.hidden=!open;button.setAttribute("aria-expanded",String(open));button.textContent=open?"✅ English shown":label;};
  wrap.append(button,copy);parent.appendChild(wrap);
}
function getVocabExample(item,catId,index){
  const raw=item.example||(VOCAB_EXAMPLES[catId]||[])[index];
  if(Array.isArray(raw))return {es:raw[0],en:raw[1],tts:raw[0]};
  if(raw)return {es:raw.es||item.word,en:raw.en||item.en,tts:raw.tts||raw.es||item.tts};
  return {es:item.word,en:item.en,tts:item.tts||item.word};
}
function addVocabExample(card,item,catId,index){
  const ex=getVocabExample(item,catId,index);
  const toggle=document.createElement("button");
  toggle.type="button";toggle.className="vc-example-toggle";toggle.textContent="📝 Example";toggle.setAttribute("aria-expanded","false");
  const panel=document.createElement("div");panel.className="vc-example";panel.hidden=true;
  panel.innerHTML=`<div class="vc-example-label">In context</div><div class="vc-example-es">${escapeVocabHtml(ex.es)}</div><div class="vc-example-en">${escapeVocabHtml(ex.en)}</div><button type="button" class="vc-example-speak">🔊 Hear the sentence</button>`;
  toggle.onclick=event=>{event.stopPropagation();const open=panel.hidden;panel.hidden=!open;toggle.classList.toggle("open",open);toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"✕ Close example":"📝 Example";};
  panel.onclick=event=>event.stopPropagation();
  panel.querySelector(".vc-example-speak").onclick=event=>{event.stopPropagation();markPractice("vocab",item.tts||item.word);speak(ex.tts||ex.es,0.75);};
  const actions=card.querySelector(".vc-actions")||card;
  actions.appendChild(toggle);card.appendChild(panel);
}
/* ═══════════════════════════════════════════════════════════════════════════
   Pronunciation Practice (v17)
   Tier 1: Record & Compare — always available when the mic works.
   Tier 2: "¿Me entendió?" speech-recognition check.
   KILL SWITCH: set SPEECH_CHECK_ENABLED=false to remove Tier 2 everywhere.
   Tier 2 also auto-hides if the device doesn't support recognition.
   ═══════════════════════════════════════════════════════════════════════════ */
const SPEECH_CHECK_ENABLED=true;
const SR=window.SpeechRecognition||window.webkitSpeechRecognition||null;
let micPanel=null,micRecorder=null,micChunks=[],micUrl=null,micTarget="",micStream=null,micPracticeType="";
function micSupported(){return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);}
function micStopStream(){if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}}
function closeMicPanel(){if(micPanel)micPanel.style.display="none";micStopStream();try{if(micRecorder&&micRecorder.state==="recording")micRecorder.stop();}catch(e){}}
function openMicPanel(target,practiceType){
  micTarget=target;
  micPracticeType=practiceType||"";
  if(micUrl){URL.revokeObjectURL(micUrl);micUrl=null;}
  if(!micPanel){micPanel=document.createElement("div");micPanel.className="mic-panel";document.body.appendChild(micPanel);}
  renderMicPanel("idle");
  micPanel.style.display="block";
}
function renderMicPanel(state,extra){
  let h='<div class="mic-head"><div class="mic-target">🗣️ '+micTarget+'</div><button type="button" class="mic-close" onclick="closeMicPanel()">✕</button></div><div class="mic-row">';
  if(state==="recording")h+='<button type="button" class="mic-btn rec" onclick="micStop()">⏹ Stop</button>';
  else h+='<button type="button" class="mic-btn" onclick="micStart()">🔴 Record</button>';
  h+='<button type="button" class="mic-btn" onclick="speak(micTarget,0.7)">🔊 Model</button>';
  if(micUrl&&state!=="recording")h+='<button type="button" class="mic-btn teal" onclick="micPlay()">▶️ Your voice</button>';
  if(SPEECH_CHECK_ENABLED&&SR&&state!=="recording")h+='<button type="button" class="mic-btn gold" onclick="micListen()">🎯 Check me</button>';
  h+='</div>';
  if(extra)h+='<div class="mic-result">'+extra+'</div>';
  else if(state==="idle"&&!micUrl)h+='<div class="mic-hint">Say it out loud FIRST. “Check me” depends on the browser; Record + compare is the reliable fallback.</div>';
  micPanel.innerHTML=h;
}
async function micStart(){
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
function micStop(){try{if(micRecorder&&micRecorder.state==="recording")micRecorder.stop();}catch(e){renderMicPanel("idle","Error stopping the recording.");}}
function micPlay(){if(micUrl){try{new Audio(micUrl).play();}catch(e){}}}
function micNorm(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zñü ]/g,"").replace(/ +/g," ").trim();}
function micLev(x,y){
  const m=x.length,n=y.length;if(!m)return n;if(!n)return m;
  let prev=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const cur=[i];
    for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(x[i-1]===y[j-1]?0:1));
    prev=cur;}
  return prev[n];
}
function micMatch(heardList,target){
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
function micListen(){
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
function markPracticed(target){
  try{
    lpPracticed.add(target);
    document.querySelectorAll(".pronun-row").forEach(r=>{
      if(r.dataset.mt===target){r.classList.add("done");const ck=r.querySelector(".pronun-check");if(ck)ck.textContent="✅";}
    });
  }catch(e){}
}
function attachMic(container,target,practiceType){
  if(!target)return;
  if(!micSupported()&&!(SPEECH_CHECK_ENABLED&&SR))return;
  const b=document.createElement("button");
  b.type="button";b.className="mic-mini";b.textContent="🎙️";b.title="Practice pronunciation";
  b.onclick=e=>{e.stopPropagation();openMicPanel(target,practiceType);};
  container.appendChild(b);
}

let vocabFlashMode=false,vocabFlashIdx=0,vocabFlashFlipped=false;
function getVocabFlashItems(cat){
  if(!cat)return[];
  if(cat.type==="basic")return(cat.items||[]).map(it=>({es:it.word,en:it.en,ph:it.ph||"",tts:it.tts||it.word}));
  if(cat.type==="colombianismos")return COLOMBIANISMOS.map(it=>({es:it.word,en:it.en,ph:it.register||it.usage||"",tts:it.tts||it.word}));
  if(cat.type==="preguntas")return PREGUNTAS.map(it=>({es:it.word,en:it.en,ph:it.ph||"",tts:it.tts||it.word}));
  if(cat.type==="verbos")return Object.entries(VERBS).map(([w,v])=>({es:w,en:v.en,ph:v.type||"",tts:w}));
  return[];
}
function rV(){
  const cat=VC.find(c=>c.id===aC);const list=document.getElementById("vocab-list");list.innerHTML="";
  const keys=vocabKeys(cat);if(keys.length){const done=practicedCount("vocab",keys);const p=document.createElement("div");p.className="vocab-progress";p.innerHTML=`<strong>${done} of ${keys.length} practiced</strong> · Tap a word, hear its example, or record yourself to count it.<div class="vocab-progress-track"><div class="vocab-progress-fill" style="width:${Math.round(done/keys.length*100)}%"></div></div>`;list.appendChild(p);}
  const flashItems=getVocabFlashItems(cat);
  if(flashItems.length>=3){
    const mBar=document.createElement("div");mBar.className="vocab-mode-toggle";
    const listB=document.createElement("button");listB.type="button";listB.className="mf-chip"+(!vocabFlashMode?" active":"");listB.textContent="📋 Word List";
    listB.onclick=()=>{vocabFlashMode=false;rV();};
    const flB=document.createElement("button");flB.type="button";flB.className="mf-chip"+(vocabFlashMode?" active":"");flB.textContent=`🃏 Flashcards (${flashItems.length})`;
    flB.onclick=()=>{vocabFlashMode=true;vocabFlashIdx=0;vocabFlashFlipped=false;rV();};
    mBar.append(listB,flB);list.appendChild(mBar);
    if(vocabFlashMode){
      const cur=flashItems[vocabFlashIdx%flashItems.length];
      const fc=document.createElement("section");fc.className="flash-card";
      fc.innerHTML=`<div class="flash-head"><span>🃏 Card ${(vocabFlashIdx%flashItems.length)+1} of ${flashItems.length}</span><small>${escapeVocabHtml(cat.label)}</small></div>
        <div class="flash-prompt-label">How do you say this in Colombia?</div>
        <div class="flash-en">${escapeVocabHtml(cur.en)}</div>
        ${cur.ph?`<div class="flash-hint">Hint: ${escapeVocabHtml(cur.ph)}</div>`:""}
        ${vocabFlashFlipped?`<div class="flash-answer-box"><div class="flash-es">${escapeVocabHtml(cur.es)}</div></div>`:""}
        <div class="flash-acts"></div>`;
      const fActs=fc.querySelector(".flash-acts");
      if(!vocabFlashFlipped){
        const rev=document.createElement("button");rev.type="button";rev.className="lp-nav-btn primary";rev.textContent="👁️ Reveal & Hear 🔊";
        rev.onclick=()=>{vocabFlashFlipped=true;markPractice("vocab",cur.tts);speak(cur.tts,0.78);rV();};
        fActs.appendChild(rev);
      }else{
        const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn";hear.textContent="🔊 Hear again";
        hear.onclick=()=>speak(cur.tts,0.78);
        const again=document.createElement("button");again.type="button";again.className="lp-nav-btn";again.textContent="↻ Practice again";
        again.onclick=()=>{if(typeof recordSrs==="function")recordSrs("vf|"+cur.tts,false);vocabFlashIdx=(vocabFlashIdx+1)%flashItems.length;vocabFlashFlipped=false;rV();};
        const got=document.createElement("button");got.type="button";got.className="lp-nav-btn primary";got.textContent="✓ Got it →";
        got.onclick=()=>{if(typeof recordSrs==="function")recordSrs("vf|"+cur.tts,true);markPractice("vocab",cur.tts);vocabFlashIdx=(vocabFlashIdx+1)%flashItems.length;vocabFlashFlipped=false;rV();};
        fActs.append(hear,again,got);
        attachMic(fActs,cur.tts,"vocab");
      }
      list.appendChild(fc);return;
    }
  }
  if(cat.type==="vocales"){rVocales(list);return;}
  if(cat.type==="numeros"){rN(list);return;}
  if(cat.type==="preguntas"){rP(list);return;}
  if(cat.type==="verbos"){rVerbos(list);return;}
  if(cat.type==="colombianismos"){rCol(list);return;}
  cat.items.forEach((item,index)=>{
    const card=document.createElement("div");card.className="vc vc-basic";
    card.innerHTML=`<div class="vc-top"><div class="vc-icon" style="background:${item.color}22;color:${item.color}">${item.icon}</div>
      <div class="vc-info"><div class="vc-word">${item.word}</div><div class="vc-en">${item.en}</div></div><button type="button" class="vc-listen" aria-label="Listen">🔊</button></div>
      <div class="vc-ph">${item.ph}</div><div class="vc-actions"></div>`;
    const play=()=>{markPractice("vocab",item.tts||item.word);speak(item.tts||item.word,0.75);};
    const vcTop=card.querySelector(".vc-top");vcTop.setAttribute("role","button");vcTop.setAttribute("tabindex","0");vcTop.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();play();}};
    vcTop.onclick=play;card.querySelector(".vc-listen").onclick=e=>{e.stopPropagation();play();};
    addVocabExample(card,item,cat.id,index);attachMic(card.querySelector(".vc-actions"),item.tts||item.word,"vocab");list.appendChild(card);
  });
}

function rVocales(list){
  VOCALES_DATA.forEach(v=>{
    const sec=document.createElement("div");sec.className="vocal-section";
    const hdr=document.createElement("div");hdr.className="vocal-hdr";
    hdr.innerHTML=`<div class="vocal-ltr" style="background:${v.bg};color:${v.color}">${v.letter}</div>
      <div class="vocal-hdr-info"><div class="vocal-name">La vocal "${v.letter.toLowerCase()}"</div><div class="vocal-sound">Suena: "${v.sound}"</div></div>
      <button onclick="speak('${v.letter}',0.7)" style="background:transparent;border:none;font-size:1.3rem;cursor:pointer">🔊</button>`;
    sec.appendChild(hdr);
    const exs=document.createElement("div");exs.className="vocal-exs";
    v.examples.forEach(ex=>{
      const ec=document.createElement("div");ec.className="vocal-ex";
      const w=ex.word.replace(new RegExp(v.letter,"gi"),m=>`<span style="color:${v.color};font-weight:900">${m}</span>`);
      ec.innerHTML=`<div style="flex:1"><div class="vocal-ex-word">${w}</div><div class="vocal-ex-en">${ex.en}</div><div class="vocal-ex-ph">${ex.ph}</div></div><span style="font-size:1.2rem">🔊</span>`;
      ec.onclick=()=>speak(ex.tts,0.75);exs.appendChild(ec);});
    sec.appendChild(exs);list.appendChild(sec);});
}

let activeComodinIdx=0;
function rVerbos(list){
  const note=document.createElement("div");note.className="intro-note";
  note.innerHTML=`<div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--purple);margin-bottom:6px;font-weight:800">🏃 Verbos & Wildcard Chunks — Tap any verb for full conjugation</div>
    <div style="font-size:0.82rem;color:var(--muted);line-height:1.6">Master the 7 Colombian wildcard verbs ("verbos comodín") below, or tap any of the 25 verbs for full conjugations, word families, and imperatives.</div>`;
  list.appendChild(note);
  if(typeof VERBOS_COMODIN!=="undefined"&&VERBOS_COMODIN.length){
    const hub=document.createElement("section");hub.className="bridge-trainer-card comodin-hub-card";
    const renderComodin=()=>{
      const vObj=VERBOS_COMODIN[activeComodinIdx%VERBOS_COMODIN.length];
      hub.innerHTML=`<div class="bridge-kicker">🔑 VERBOS COMODÍN · THE 7 WILDCARD VERBS OF COLOMBIA</div>
        <div class="bridge-context">Tap a wildcard verb to drill the idiomatic chunks Colombians use all day:</div>
        <div class="reg-tabs-row comodin-tabs"></div>
        <div class="comodin-sub">${escapeVocabHtml(vObj.verb)} — ${escapeVocabHtml(vObj.tag)}</div>
        <div class="comodin-chunks-grid"></div>`;
      const tRow=hub.querySelector(".comodin-tabs");
      VERBOS_COMODIN.forEach((item,idx)=>{
        const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(idx===activeComodinIdx?" active":"");
        b.textContent=item.verb;
        b.onclick=()=>{
          activeComodinIdx=idx;
          renderComodin();
          if(item.chunks&&item.chunks[0])speak(item.chunks[0].es,0.75);
        };
        tRow.appendChild(b);
      });
      const grid=hub.querySelector(".comodin-chunks-grid");
      (vObj.chunks||[]).forEach(ch=>{
        const row=document.createElement("div");row.className="comodin-chunk-card";
        row.innerHTML=`<div class="comodin-chunk-head"><span class="comodin-chunk-pill">${escapeVocabHtml(ch.chunk)}</span><span class="comodin-chunk-en">${escapeVocabHtml(ch.en)}</span><div class="comodin-chunk-acts"></div></div>
          <div class="comodin-chunk-es">🗣️ ${escapeVocabHtml(ch.es)} 🔊</div>
          <div class="comodin-chunk-esen">${escapeVocabHtml(ch.esEn)}</div>`;
        row.onclick=e=>{if(e.target.closest("button"))return;markPractice("vocab",ch.es);speak(ch.es,0.75);};
        const acts=row.querySelector(".comodin-chunk-acts");
        if(typeof attachStarBtn==="function")attachStarBtn(acts,ch.es,"Verbos comodín");
        attachMic(acts,ch.es,"vocab");
        grid.appendChild(row);
      });
    };
    renderComodin();
    list.appendChild(hub);
  }
  Object.entries(VERBS).forEach(([key,verb])=>{
    const card=document.createElement("div");card.className="vc";
    card.style.borderColor=`${verb.color}44`;
    card.innerHTML=`<div class="vc-icon" style="background:${verb.color}22;color:${verb.color}">${verb.icon}</div>
      <div class="vc-info"><div class="vc-word" style="color:${verb.color}">${key}</div><div class="vc-en">${verb.en}</div><div class="vc-ph" style="color:${verb.color}">${verb.type}</div></div>
      <span class="vc-arrow">›</span>`;
    card.onclick=()=>{markPractice("vocab",key);showVerbDetail(key,verb);};list.appendChild(card);});
}

function registerTone(item){
  const group=String(item&&item.registerGroup||"").toLowerCase();
  if(group==="danger")return "danger";
  if(group==="informal")return "informal";
  if(group==="formal")return "formal";
  if(group==="everyday")return "everyday";
  const value=String(item&&((item.registerGroup||"")+" "+(item.register||""))).toLowerCase();
  if(/danger|strong|vulgar|insult|understand|context/.test(value))return "danger";
  if(/informal|colombian/.test(value))return "informal";
  if(/formal|polite/.test(value))return "formal";
  return "everyday";
}
function registerBadge(item){
  return item&&item.register?'<span class="f-register register-'+registerTone(item)+'">'+escapeVocabHtml(item.register)+'</span>':"";
}
let colRegionFilter="all";
const COL_REGIONS=[
  ["all","🇨🇴 All Colombia"],
  ["costa","🪗 San Juan, Guajira & Costa"],
  ["bogota","🏔️ Bogotá & Rolos"],
  ["medellin","🌸 Medellín & Paisas"],
  ["cali-costa","🌴 Cali & La Costa"]
];
const COL_REGION_LABELS={
  all:"🇨🇴 National",
  costa:"🪗 San Juan del Cesar / Guajira & Costa",
  bogota:"🏔️ Bogotá / Altiplano",
  medellin:"🌸 Medellín / Eje Cafetero",
  "cali-costa":"🌴 Cali & Costa"
};
function rCol(list){
  const note=document.createElement("div");note.className="intro-note";
  note.innerHTML=`<div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);margin-bottom:6px;font-weight:800">🇨🇴 Colombianismos & Regional Flavors (including San Juan del Cesar & La Guajira)</div>
    <div style="font-size:0.82rem;color:var(--muted);line-height:1.55">Filter by region to learn how people speak in San Juan del Cesar & La Guajira, Bogotá, Medellín, Cali, and across Colombia. Tap any card to hear it, or tap ⭐ to pin it to your practice list.</div>`;
  list.appendChild(note);
  const matchColRegion=(item,regId)=>regId==="all"||item.region===regId||(regId==="cali-costa"&&item.region==="costa")||item.region==="all";
  const filterBar=document.createElement("div");filterBar.className="col-region-tabs";
  COL_REGIONS.forEach(([regId,regLabel])=>{
    const count=COLOMBIANISMOS.filter(x=>matchColRegion(x,regId)).length;
    const b=document.createElement("button");b.type="button";
    b.className="lp-mode-btn col-region-btn"+(colRegionFilter===regId?" active":"");
    b.setAttribute("aria-pressed",colRegionFilter===regId?"true":"false");
    b.textContent=`${regLabel} (${count})`;
    b.onclick=()=>{colRegionFilter=regId;rV();};
    filterBar.appendChild(b);
  });
  list.appendChild(filterBar);
  const filtered=COLOMBIANISMOS.filter(item=>matchColRegion(item,colRegionFilter));
  filtered.forEach(item=>{
    const card=document.createElement("div");card.className="col-card";
    card.setAttribute("role","button");card.setAttribute("tabindex","0");
    const regKey=item.region||"all";
    const regBadge=`<span class="col-region-pill reg-${regKey}">${COL_REGION_LABELS[regKey]||"🇨🇴 Colombia"}</span>`;
    card.innerHTML=`<div class="col-card-top">
      <span class="col-flag">${regKey==="costa"?"🪗":regKey==="bogota"?"🏔️":regKey==="medellin"?"🌸":regKey==="cali-costa"?"🌴":"🇨🇴"}</span>
      <div class="col-word-wrap"><div class="col-word">${item.word}</div><div class="col-en">${item.en}</div></div>
      <div class="col-top-actions"><span class="col-spk">🔊</span></div></div>
      <div class="col-usage">${regBadge}${item.usage}<div class="col-example">💬 ${item.example}</div></div>`;
    if(item.register){const badge=document.createElement("span");badge.className="f-register register-"+registerTone(item);badge.textContent=item.register;const usage=card.querySelector(".col-usage");if(usage){usage.prepend(badge);if(item.registerNote){const rNote=document.createElement("div");rNote.className="col-register-note";rNote.textContent="ⓘ "+item.registerNote;usage.appendChild(rNote);}}}
    const topAct=card.querySelector(".col-top-actions");
    if(topAct&&typeof attachStarBtn==="function")attachStarBtn(topAct,item.example||item.word,"Colombianismos");
    const playCol=()=>{markPractice("vocab",item.tts||item.word);speak(item.tts||item.word,0.75);};
    card.onclick=e=>{if(e.target.closest(".star-pin-btn"))return;playCol();};
    card.onkeydown=e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest(".star-pin-btn")){e.preventDefault();playCol();}};
    list.appendChild(card);
  });
}

function rN(list){
  const cr=document.createElement("div");cr.className="counting-rules";
  cr.innerHTML=`<div class="cr-title">📖 Reglas para contar</div>
    <div class="cr-row"><div class="cr-ex">31 = treinta y uno</div><div class="cr-rule">30–90: [decena] + y + [unidad]</div></div>
    <div class="cr-row"><div class="cr-ex">101 = ciento uno</div><div class="cr-rule">After 100: ciento + [número]</div></div>
    <div class="cr-row"><div class="cr-ex">245 = doscientos cuarenta y cinco</div><div class="cr-rule">Hundreds + tens + units</div></div>`;
  list.appendChild(cr);
  const mb=document.createElement("div");mb.className="money-box";mb.innerHTML=`<div class="money-title">💰 Dinero Colombiano (COP)</div>`;
  [{cop:"$1.000",es:"Mil pesos",en:"~$0.25 USD",tts:"mil pesos"},{cop:"$5.000",es:"Cinco mil pesos",en:"~$1.25 USD",tts:"cinco mil pesos"},{cop:"$10.000",es:"Diez mil pesos",en:"~$2.50 USD",tts:"diez mil pesos"},{cop:"$20.000",es:"Veinte mil pesos",en:"~$5 USD",tts:"veinte mil pesos"},{cop:"$50.000",es:"Cincuenta mil pesos",en:"~$12 USD",tts:"cincuenta mil pesos"},{cop:"$100.000",es:"Cien mil pesos",en:"~$25 USD",tts:"cien mil pesos"},{cop:"$500.000",es:"Quinientos mil pesos",en:"~$125 USD",tts:"quinientos mil pesos"},{cop:"$1.000.000",es:"Un millón de pesos",en:"~$250 USD",tts:"un millón de pesos"},{cop:"$2.000.000",es:"Dos millones de pesos",en:"~$500 USD",tts:"dos millones de pesos"}].forEach(m=>{
    const row=document.createElement("div");row.className="money-row";
    row.innerHTML=`<div class="money-cop">${m.cop}</div><div class="money-info"><div class="money-es">${m.es}</div><div class="money-en">${m.en}</div></div><span style="font-size:1.1rem">🔊</span>`;
    row.onclick=()=>speak(m.tts,0.75);mb.appendChild(row);});
  list.appendChild(mb);
  [[N130,"1 – 30","var(--pink)","rgba(232,93,117,0.1)","rgba(232,93,117,0.2)"],[NT,"40 – 500","var(--teal)","rgba(74,168,160,0.1)","rgba(74,168,160,0.2)"]].forEach(([data,title,col,bg,bdr])=>{
    const s=document.createElement("div");s.className="num-section";
    s.innerHTML=`<div class="num-section-title" style="color:${col};background:${bg};border:1px solid ${bdr}">${title}</div>`;
    const g=document.createElement("div");g.className="num-grid";
    data.forEach(n=>{const card=document.createElement("div");card.className="num-card";
      const nc=["#e85d75","#f59e0b","#10b981","#3b82f6","#8b5cf6"][typeof n.n==="number"?n.n%5:0];
      card.innerHTML=`<div class="num-digit" style="color:${nc}">${n.n}</div><div><div class="num-word">${n.w}</div><div class="num-ph">${n.ph}</div></div>`;
      card.onclick=()=>speak(n.w,0.75);g.appendChild(card);});s.appendChild(g);list.appendChild(s);});
  const s3=document.createElement("div");s3.className="num-section";s3.innerHTML=`<div class="num-section-title" style="color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)">Miles y Millones</div>`;
  const g3=document.createElement("div");g3.className="num-grid";
  [{n:"1.000",w:"Mil",ph:"meel"},{n:"2.000",w:"Dos mil",ph:"dohs meel"},{n:"10.000",w:"Diez mil",ph:"dyehs meel"},{n:"100.000",w:"Cien mil",ph:"syen meel"},{n:"1.000.000",w:"Un millón",ph:"oon mee-LYON"},{n:"2.000.000",w:"Dos millones",ph:"dohs mee-YOH-nehs"}].forEach(n=>{
    const card=document.createElement("div");card.className="num-card";
    card.innerHTML=`<div style="font-size:0.82rem;font-weight:900;color:var(--gold);min-width:58px;text-align:right;flex-shrink:0">${n.n}</div><div><div class="num-word">${n.w}</div><div class="num-ph">${n.ph}</div></div>`;
    card.onclick=()=>speak(n.w,0.75);g3.appendChild(card);});s3.appendChild(g3);list.appendChild(s3);
}
function rP(list){
  const intro=document.createElement("div");intro.className="intro-note";
  intro.innerHTML=`<div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--purple);margin-bottom:6px;font-weight:800">❓ Palabras interrogativas</div>
    <div style="font-size:0.82rem;color:var(--muted);line-height:1.6">Question words always carry accent marks. Tap each card to hear it.</div>`;
  list.appendChild(intro);
  PQ.forEach(item=>{const card=document.createElement("div");card.className="q-card";
    card.innerHTML=`<div class="q-mark" style="color:var(--purple)">${item.word.replace("¿","").replace("?","")}</div>
      <div class="q-info"><div class="q-word">${item.word}</div><div class="q-en">${item.en}</div>
      <div class="q-ph">[${item.ph}]</div><div class="q-example">💬 ${item.example}</div></div>
      <span class="q-spk">🔊</span>`;card.onclick=()=>speak(item.tts,0.75);list.appendChild(card);});
}
rV();updateVocabNav();showVocabHome();

// ── Verb Detail View ──────────────────────────────────────────────────────────
function showVerbDetail(key,verb){
  document.getElementById("vocab-list").style.display="none";
  const vd=document.getElementById("verb-detail");vd.innerHTML="";vd.classList.add("active");
  // Back button
  const back=document.createElement("button");back.className="vd-back";
  back.innerHTML=`<span style="font-size:1.2rem">‹</span><span class="vd-back-label">Volver a Verbos</span>`;
  back.onclick=hideVerbDetail;vd.appendChild(back);
  // Header
  const hdr=document.createElement("div");hdr.className="vd-header";
  hdr.style.borderColor=`${verb.color}44`;
  hdr.innerHTML=`<div class="vd-infinitive" style="color:${verb.color}">${key}</div>
    <div class="vd-type">${verb.type}</div>
    <div class="vd-en">${verb.en}</div>
    <div class="vd-forms">
      <div class="vd-form-card" onclick="speak('${verb.gerund.f}',0.8)"><div class="vd-form-label">Gerundio</div><div class="vd-form-word">${verb.gerund.f}</div><div class="vd-form-en">${verb.gerund.en} 🔊</div></div>
      <div class="vd-form-card" onclick="speak('${verb.participle.f}',0.8)"><div class="vd-form-label">Participio</div><div class="vd-form-word">${verb.participle.f}</div><div class="vd-form-en">${verb.participle.en} 🔊</div></div>
    </div>`;
  vd.appendChild(hdr);
  // Conjugation tables
  const tenseRows=[["⚡ Presente","present","rgba(74,168,160,0.2)","var(--teal)"],["⏮️ Pasado","past","rgba(232,93,117,0.2)","var(--pink)"]];
  if(verb.imperfect)tenseRows.push(["🕰️ Imperfecto","imperfect","rgba(167,139,250,0.2)","var(--purple)"]);
  tenseRows.push(["⏭️ Futuro","future","rgba(96,165,250,0.2)","var(--blue)"]);
  tenseRows.forEach(([title,tense,bg,color])=>{
    const wrap=document.createElement("div");wrap.className="vd-tense-wrap";
    const th=document.createElement("div");th.className="vd-tense-title";th.style.background=bg;
    th.innerHTML=`<span class="vd-tense-name" style="color:${color}">${title}</span>`;
    const rows=document.createElement("div");rows.className="vd-conj-rows";
    verb[tense].forEach(row=>{
      const r=document.createElement("div");r.className="vd-conj-row";
      r.innerHTML=`<span class="vd-pro">${row.p}</span><span class="vd-verb">${row.v}</span><span class="vd-en-small">${row.e}</span><span class="vd-spk">🔊</span>`;
      r.onclick=()=>speak(row.v,0.75);rows.appendChild(r);});
    wrap.appendChild(th);wrap.appendChild(rows);vd.appendChild(wrap);});
  if(verb.imperfect){const note=document.createElement("div");note.className="vd-imperfect-note";note.innerHTML="<strong>🧠 When do I use the imperfect?</strong><span>Use it for background, repeated habits, or an action in progress. Use the simple past above for a completed event.</span><div><b>Tenía tiempo</b> = I had time / used to have time · <b>Tuve tiempo ayer</b> = I had time yesterday (completed situation).</div>";vd.appendChild(note);}
  // Imperative
  const imp=document.createElement("div");imp.className="imperative-box";
  imp.innerHTML=`<div class="imp-title">🫵 Imperativo (Commands)</div>
    <div class="imp-grid">
      <div class="imp-card" onclick="speak('${verb.imperative.tu.f}',0.75)"><div class="imp-label">Tú (informal)</div><div class="imp-form">${verb.imperative.tu.f}</div><div class="imp-en">${verb.imperative.tu.en} 🔊</div></div>
      <div class="imp-card" onclick="speak('${verb.imperative.usted.f}',0.75)"><div class="imp-label">Usted (formal)</div><div class="imp-form">${verb.imperative.usted.f}</div><div class="imp-en">${verb.imperative.usted.en} 🔊</div></div>
    </div>`;
  vd.appendChild(imp);
  // Word family
  const wf=document.createElement("div");wf.className="word-family";
  wf.innerHTML=`<div class="wf-title">🌱 Familia de Palabras — Words from "${key}"</div><div class="wf-grid"></div>`;
  const wfg=wf.querySelector(".wf-grid");
  verb.family.forEach(item=>{
    const c=document.createElement("div");c.className="wf-card";
    c.innerHTML=`<div class="wf-type">${item.t}</div><div class="wf-word">${item.f}</div><div class="wf-en">${item.e}</div><span style="font-size:0.9rem;margin-top:4px;display:block">🔊</span>`;
    c.onclick=()=>speak(item.f,0.75);wfg.appendChild(c);});
  vd.appendChild(wf);
  // Example sentence
  const ex=document.createElement("div");ex.style.cssText="background:rgba(167,139,250,0.07);border:1px solid rgba(167,139,250,0.18);border-radius:14px;padding:14px;margin-bottom:10px;cursor:pointer;";
  ex.innerHTML=`<div style="font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--purple);margin-bottom:7px;font-weight:800">💬 Ejemplo</div>
    <div style="font-size:0.95rem;font-weight:800;color:#fff">${verb.example.es}</div>
    <div style="font-size:0.78rem;color:var(--muted);font-style:italic;margin-top:4px">${verb.example.en} 🔊</div>`;
  ex.onclick=()=>speak(verb.example.es,0.75);vd.appendChild(ex);
}
function hideVerbDetail(){
  document.getElementById("vocab-list").style.display="";
  const vd=document.getElementById("verb-detail");vd.classList.remove("active");vd.innerHTML="";
}


 // ── Build Frases ──────────────────────────────────────────────────────────────
const fl=document.getElementById("frases-list");
/* Each menu entry keeps its versions separate so Ahora / Planes / Ayer all display */
const PHRASE_DIALOGUES=[
  {title:"Saludos formales",preview:DIALOGUE[0].es,en:"Formal greetings and introductions",versions:[{tense:null,lines:DIALOGUE}]},
  ...Array.from(new Set(CONVERSATIONS.map(c=>c.title))).map(title=>{
    const versions=CONVERSATIONS.filter(c=>c.title===title).map(c=>({tense:c.tense,lines:c.lines,alternates:c.alternates||[]}));
    const source=CONVERSATIONS.find(c=>c.title===title);
    return {title,preview:versions[0].lines[0].es,en:source&&source.en?source.en:"Ahora · Planes · Ayer",versions};
  })
];
let fraseSearchTerm="";
let fraseView="all";
let fraseReturnToLessons=false;
const TENSE_BADGE={
  "Ahora":{txt:"⚡ Ahora · presente",css:"color:var(--teal);background:rgba(74,168,160,0.12);border:1px solid rgba(74,168,160,0.25)"},
  "Planes":{txt:"⏭️ Planes · voy a...",css:"color:var(--blue);background:rgba(96,165,250,0.12);border:1px solid rgba(96,165,250,0.25)"},
  "Ayer":{txt:"⏮️ Ayer · pasado",css:"color:var(--pink);background:rgba(232,93,117,0.12);border:1px solid rgba(232,93,117,0.25)"},
};
const PHRASE_EN={
  "💬 Saludos — Informal":"Informal greetings",
  "🤝 Saludos — Formal":"Formal greetings",
  "🛍️ De Compras":"Shopping",
  "🍽️ En el Restaurante":"At the restaurant",
  "🆘 Pidiendo Ayuda":"Asking for help",
  "🚨 Emergencias":"Emergencies",
  "🚕 Transporte":"Transportation",
  "☀️ Conversación Diaria":"Everyday conversation",
  "❤️ Gustos y conversación":"Likes and conversation",
  "🧱 Frases para contar historias":"Phrases for telling stories",
  "🧩 Conectores para sonar natural":"Connectors for natural speech",
  "🧱 Patrones para hablar cada día":"Everyday speaking patterns",
  "⚠️ Groserías colombianas — entender primero":"Colombian swear words · understand first",
  "⚠️ Groserías colombianas — más para entender":"More Colombian swear words · understand first",
  "📆 Haciendo Planes":"Making plans",
  "📱 Por Teléfono / Mensajes":"Phone and messages",
  "🩺 ¿Cómo Te Sientes?":"How are you feeling?",
  "💰 Plata y Pagos":"Money and payments",
  "👤 Pronombres en acción":"Pronouns in action",
  "🧰 Comunicación para aclarar":"Communication repair",
  "🧭 Direcciones y ubicación":"Directions and location",
  "🚕 Uber y transporte real":"Real Uber and transportation",
  "🔗 Conectores y palabras de unión":"Connectors and linking words",
  "🗣️ Palabras para conversar — everyday glue":"Conversation glue",
  "🧱 Marcos para construir frases":"Sentence-building frames",
  "⚡ Acciones para hablar cada día":"Everyday action phrases",
  "🇨🇴 Expresiones sociales colombianas":"Colombian social expressions",
  "🗣️ Pedir, repetir y aclarar":"Ask, repeat, and clarify",
  "🚗 Un viaje completo en Uber":"A complete Uber ride",
  "🍽️ Comer fuera — conversación real":"Eating out — real conversation",
  "🛍️ Mercado — comprar y negociar":"Market — buying and negotiating",
  "🔄 Actividades en progreso":"Activities in progress (-ando/-iendo)",
  "🤝 Salir con amigos":"Going out with friends",
  "🎉 En una fiesta":"At a party",
  "⚽ Ver el partido":"Watching the soccer game",
  "🧑‍💼 Oficina — conversación real":"Office — real conversation",
  "🙏 Cortesía colombiana — polite requests":"Colombian politeness — ¿Me regala…? & ¿Será que…?",
  "☕ Diminutivos y muletillas — sound local":"Diminutives & time-buyers — tintico, ahorita, pues…",
  "🛬 Aeropuerto y migración":"Airport, immigration, and baggage claim",
  "💳 Nequi, datáfono y pagos":"Card payments, one installment, and Nequi",
  "💈 Peluquería y barbería":"Haircuts, fades, and beard trims",
  "🩺 Cita médica y urgencias":"Medical appointments, symptoms, and prescriptions",
  "🏢 Portería, Rappi y apartamento":"Building front desk, Rappi deliveries, and utilities",
  "🧭 Cuadras, carreras y seguridad":"Colombian street grid, blocks, and neighborhood safety",
  "🥐 Panadería, café y jugos":"Neighborhood bakery, coffee, and fresh fruit juices",
  "🌄 Buses, pueblos y paseo de finca":"Bus terminal, highway tolls, and weekend finca trips",
  "💛 Empatía, reacciones y amistad":"Authentic Colombian empathy, reactions, and friendship",
  "🔑 Verbos comodín (dar, hacer, poner, echar, quedar)":"High-frequency Colombian wildcard verb chunks",
  "📱 WhatsApp, audios y citas":"Voice notes, polite requests with colaborar, and appointments",
  "🔑 Arriendo, Airbnb y servicios del hogar":"Renting, utilities, water heater, washer, and house cleaning",
  "🚴 Gimnasio, ciclovía y senderos":"Gym sets, Sunday Ciclovía, mountain trails, and altitude",
  "❤️ Citas, cumplidos y la familia":"Dating, natural compliments, and meeting Colombian parents",
  "🫓 Almuerzo ejecutivo (corrientazo) y onces":"Weekday lunch specials (sopa, principio, sobremesa) & afternoon coffee",
  "🏦 Cajero, SIM card y trámites":"ATMs, savings vs. checking, prepaid SIM top-ups, and passport ID",
  "🎉 Puentes festivos, salsa y rumba":"Long holiday weekends, salsa clubs, aguardiente toasts, and guayabo",
  "🪤 Trampas y falsos amigos (cancelar, provocar, regalar)":"Colombian false friends: cancelar = pay, provocar = crave, regalar = buy",
  "🏘️ Estratos, conjuntos cerrados y barrios":"Socioeconomic utility tiers (1–6), gated complexes, and walkable barrios",
  "🦷 Odontología, óptica y EPS / prepagada":"Dental cleanings, fillings, eyeglasses, and Colombian health plans",
  "🛂 Migración Colombia, visa y cuenta bancaria":"Tourist extensions, Cédula de Extranjería, notary offices, and bank accounts",
  "🪗 San Juan del Cesar, La Guajira y vallenato":"Warm Sanjuanero/Guajiro family greetings, terraza & mecedoras, friche, and vallenato",
  "🚨 Seguridad, emergencias (123) y no dar papaya":"Street smarts (no dar papaya), 123 emergency line, and lost document reports",
  "🔧 Reparaciones del hogar, recibos y técnico":"Circuit breakers (tacos), plumbers, internet technicians, and utility due dates",
  "⚽ Fútbol, conciertos, boletas y hacer vaca":"Concert & match tickets (boletas), Selección Colombia, and pooling money (hacer vaca)"
};
const DIALOGUE_EN={
  "Saludos formales":"Formal greetings and introductions",
  "Presentación personal":"Personal introduction","Carro y taxi":"Car and taxi","Trabajo y oficina":"Work and office",
  "La habitación":"The bedroom","Pedir direcciones":"Asking for directions","Preparar la cocina":"Preparing the kitchen",
  "Gustos y familia":"Likes and family","Ver televisión":"Watching television","En casa":"At home",
  "Groserías colombianas":"Colombian swear words","Pronombres en acción":"Pronouns in action",
  "Uber: hablo poquito español":"Uber: I speak a little Spanish","Uber: confirmar la recogida":"Uber: confirming the pickup",
  "Hotel: registrarse":"Hotel: checking in","Farmacia: explicar síntomas":"Pharmacy: explaining symptoms",
  "Teléfono: mala señal":"Phone: bad signal","Contar lo que pasó":"Telling what happened",
  "Planes de fin de semana":"Weekend plans","Palabras para conversar":"Conversation glue",
  "Acciones de todos los días":"Everyday actions","Compañeros de trabajo":"Coworkers",
  "Profesión":"Profession","¿Dónde vives?":"Where do you live?","Cocinar juntos":"Cooking together",
  "El baño":"The bathroom","Partes del carro":"Car parts","Uber: pedir que repita":"Uber: asking for repetition",
  "Uber: dirección equivocada":"Uber: wrong address","Restaurante: pedir y cambiar":"Restaurant: ordering and changing an order",
  "Mercado: comprar comida":"Market: buying food","Problema con apartamento o carro":"Apartment or car problem",
  "Comunicación: pedir y aclarar":"Communication: asking and clarifying",
  "Uber: viaje completo":"Uber: complete trip from pickup to drop-off",
  "Restaurante: una comida completa":"Restaurant: a full meal and the bill",
  "Mercado: comprar y negociar":"Market: buying food and negotiating",
  "Cocinar y hablar de lo que haces":"Cooking and talking about what you're doing",
  "Salir con amigos":"Going out with friends",
  "En una fiesta":"Meeting people at a party",
  "Ver el partido":"Watching the soccer match",
  "Oficina: proyecto y retraso":"Office: project progress and delays",
  "Cortesía en una tienda":"Polite ordering at a neighborhood shop",
  "Ganar tiempo al hablar":"Buying time with muletillas and diminutives",
  "Aeropuerto y migración":"Passport control, length of stay, and baggage claim",
  "Pagos con datáfono y Nequi":"Paying by card in one installment and Nequi",
  "En la barbería":"Asking for a fade, scissor trim, and beard line-up",
  "Consulta médica y droguería":"Explaining symptoms, allergies, and prescriptions",
  "Portería y domicilio Rappi":"Talking to the building doorman and receiving Rappi",
  "Direcciones, cuadras y seguridad":"Colombian street grid, landmarks, and street safety",
  "Panadería, tinto y jugos naturales":"Ordering warm pandebonos, coffee, and juices in water or milk",
  "Terminal, peajes y paseo de finca":"Bus tickets, holiday traffic, and rural drop-offs",
  "Reacciones, empatía y amistad":"Reacting with empathy, celebrating news, and friendship",
  "Verbos comodín en acción":"Using dar, hacer, poner, echar, tocar, and quedar naturally",
  "WhatsApp, notas de voz y citas":"Voice notes, asking with colaborar, and confirming plans",
  "Arriendo, Airbnb, aseo y lavadora":"Apartment check-in, appliances, HOA fee, and cleaning",
  "Gimnasio, ciclovía, senderos y soroche":"Sharing gym machines, Sunday Ciclovía, and altitude pacing",
  "Citas, cumplidos y conocer a la familia":"Warm compliments, inviting someone out, and greeting Colombian parents",
  "Almuerzo ejecutivo, corrientazo y onces":"Ordering sopa, principio, proteína, sobremesa, and afternoon onces",
  "Cajero automático, SIM card y trámites":"Activating a prepaid SIM, using your passport, and finding safe ATMs",
  "Puentes festivos, salsa y rumba":"Holiday weekend plans, dancing salsa, and toasting with friends",
  "Trampas colombianas: cancelar, provocar y qué pena":"Using cancelar (pay), provocar (crave), regalar, and rising ¿Señor? naturally",
  "Estratos, conjuntos cerrados y barrios":"Evaluating apartment estratos (1–6), gated complexes, and utility costs",
  "Odontología, óptica y medicina prepagada":"Booking a self-pay dental cleaning, fixing a filling, and optical shops",
  "Migración Colombia, cédula de extranjería y bancos":"Registering a visa, getting your Cédula de Extranjería, and opening a bank account",
  "San Juan del Cesar, La Guajira y parranda vallenata":"Visiting in-laws in San Juan del Cesar, front-porch mecedoras, friche, and vallenato",
  "Seguridad, emergencias (123) y no dar papaya":"Calm street smarts, checking ride-share plates, dialing 123, and police reports",
  "Reparaciones del hogar, recibos y técnico":"Fixing a tripped breaker (taco), internet technicians, and portería authorization",
  "Fútbol, conciertos, boletas y hacer vaca":"Buying stadium/concert tickets (boletas) and pitching in together (hacer vaca)"
};
function phraseEnglishTitle(title){return PHRASE_EN[title]||"Useful phrases";}
function dialogueEnglishTitle(title){return DIALOGUE_EN[title]||"Practice conversation";}
const PHRASE_RECENT_KEY="esco-frase-recent-v1";
let fraseRecent=[];
try{fraseRecent=JSON.parse(localStorage.getItem(PHRASE_RECENT_KEY)||"[]");if(!Array.isArray(fraseRecent))fraseRecent=[];}catch(e){fraseRecent=[];}
function rememberFraseLocation(location){
  if(!location||!location.kind)return;
  fraseRecent=[location,...fraseRecent.filter(x=>!(x.kind===location.kind&&String(x.value)===String(location.value)))].slice(0,3);
  try{localStorage.setItem(PHRASE_RECENT_KEY,JSON.stringify(fraseRecent));}catch(e){}
}
function renderRecentPhrase(root){
  if(!fraseRecent.length)return;
  const wrap=document.createElement("div");wrap.className="phrase-recent";
  wrap.innerHTML="<div class='phrase-recent-label'>↩ Recently opened · Visto recientemente</div>";
  const item=fraseRecent[0];
  const b=document.createElement("button");b.type="button";b.className="phrase-recent-card";
  b.innerHTML="<span class='phrase-recent-icon'>"+(item.kind==="dialogue"?"💬":"📋")+"</span><span class='phrase-recent-copy'><strong>"+escapeVocabHtml(item.title)+"</strong><small>"+escapeVocabHtml(item.subtitle||"Open where you left off")+"</small></span><span class='phrase-recent-arrow'>›</span>";
  b.onclick=()=>{
    if(item.kind==="dialogue"){const d=PHRASE_DIALOGUES.find(x=>x.title===item.value);if(d)renderFraseDialogue(d,item.tense);}
    else renderFraseSection(Number(item.value));
  };
  wrap.appendChild(b);root.appendChild(wrap);
}
function fraseSectionMeta(sec){
  const m=String(sec.section||"").match(/^(\S+)\s+(.*)$/);
  return m?{icon:m[1],name:m[2]}:{icon:"💬",name:sec.section||""};
}
function phraseCollectionGroup(sec){
  const n=String(sec.section||"").toLowerCase();
  if(/groser|bad word|strong language/.test(n))return {id:"strong",label:"⚠️ Strong language / Entender primero"};
  if(/aeropuerto|migración|visa|bancaria|nequi|datáfono|cajero|sim|trámites|portería|rappi|arriendo|airbnb|hogar|reparaciones|recibos|técnico|estratos|conjuntos|barrios|direcciones|cuadras|seguridad|papaya|123|panadería|jugos|corrientazo|ejecutivo|onces|buses|finca|peaje|ubicación|uber|transporte|compras|mercado|restaurante|comer fuera|emergencias|ayuda|aclarar|repetir|plata|pagos|médica|urgencias|odontología|óptica|prepagada|sientes|barbería|peluquería|cortesía/.test(n))return {id:"survival",label:"🧭 Survival, Travel & Services / Para desenvolverse"};
  if(/conectores|patrones|marcos|construir|contar historias|pronombres|acciones|progreso|muletillas|diminutivos|comodín|trampas|falsos amigos/.test(n))return {id:"build",label:"🧱 Sentence Builders & Local Flow / Construir frases"};
  if(/saludo|gusto|conversación diaria|social|amigos|fiesta|puentes|salsa|rumba|partido|fútbol|conciertos|boletas|vaca|san juan|guajira|vallenato|oficina|planes|teléfono|whatsapp|audios|citas|cumplidos|gimnasio|ciclovía|senderos|familia|empatía|reacciones|amistad/.test(n))return {id:"social",label:"🤝 Social, San Juan / Guajira & Daily Life / Conversación diaria"};
  return {id:"other",label:"📚 More useful phrases / Más frases"};
}
function dialogueSituationGroup(d){
  const t=String(d.title||"").toLowerCase();
  if(/uber|aeropuerto|carro|direcciones|cuadras|seguridad|emergencias|papaya|hotel|transporte|terminal|peajes|finca/.test(t))return {id:"travel",label:"🛬 Travel, Uber, Safety & Getting Around",sub:"Airport, Uber rides, street safety (no dar papaya & 123), buses/fincas, and hotels"};
  if(/restaurante|almuerzo|corrientazo|onces|panadería|jugos|trampas|cancelar|provocar|mercado|tienda|cortesía|pagos|datáfono|nequi|cocina/.test(t))return {id:"food",label:"🍽️ Food, Corrientazo, Trampas & Payments",sub:"Corrientazo lunches, panaderías, false friends (cancelar/provocar), and Nequi"};
  if(/oficina|trabajo|profesión|cajero|sim|trámites|migración|extranjería|bancos|estratos|conjuntos|odontología|óptica|prepagada|reparaciones|recibos|técnico|portería|rappi|arriendo|airbnb|lavadora|whatsapp|notas de voz|barbería|farmacia|médica|casa|habitación|baño|teléfono|comunicación|apartamento/.test(t))return {id:"daily",label:"🏠 Daily Life, Estratos, Repairs & Health",sub:"Migración/banks, estratos/conjuntos, home repairs, dental/optical, and WhatsApp"};
  return {id:"social",label:"🇨🇴 San Juan del Cesar, Social, Rumba & Culture",sub:"San Juan del Cesar & Guajira, dating & family, fútbol/boletas, puentes & salsa"};
}
function resetFraseScroll(){const sc=document.querySelector(".scroll");if(sc)sc.scrollTop=0;}
function renderFraseMenu(){
  fraseReturnToLessons=false;
  resetFraseScroll();
  fl.dataset.view="menu";
  fl.innerHTML="";
  const sections=FRASES.filter(s=>s.section);
  const jump=document.createElement("div");
  jump.className="frase-jump";
  const sel=document.createElement("select");
  sel.className="voice-select frase-jump-select";
  let opts=`<option value="">🧭 Jump to…</option>`;
  opts+=`<optgroup label="Conversations">`+PHRASE_DIALOGUES.map((d,i)=>`<option value="d:${i}">${d.title}</option>`).join("")+`</optgroup>`;
  opts+=`<optgroup label="Phrase collections"><option value="t">Títulos · Sr. / Sra.</option>`+sections.map((s,i)=>`<option value="s:${i}">${s.section}</option>`).join("")+`</optgroup>`;
  sel.innerHTML=opts;
  const groupsInSelect=sel.querySelectorAll("optgroup");if(groupsInSelect[0])groupsInSelect[0].label="Conversations / Conversaciones";if(groupsInSelect[1])groupsInSelect[1].label="Phrase collections / Colecciones";
  Array.from(sel.options).forEach(option=>{
    const value=option.value;
    if(value.startsWith("d:")){const d=PHRASE_DIALOGUES[Number(value.slice(2))];if(d)option.textContent=d.title+" · "+dialogueEnglishTitle(d.title);}
    if(value.startsWith("s:")){const s=sections[Number(value.slice(2))];if(s)option.textContent=s.section+" · "+phraseEnglishTitle(s.section);}
  });
  sel.onchange=()=>{
    const v=sel.value;sel.value="";
    if(!v)return;
    if(v==="t")return renderFraseSection(-1);
    const idx=parseInt(v.slice(2),10);
    if(v[0]==="d"&&PHRASE_DIALOGUES[idx])renderFraseDialogue(PHRASE_DIALOGUES[idx]);
    else if(v[0]==="s")renderFraseSection(idx);
  };
  jump.appendChild(sel);
  fl.appendChild(jump);
  const navNote=document.createElement("details");navNote.className="phrase-help";
  navNote.innerHTML="<summary><span>ⓘ How to use Frases</span><small>Start with a situation</small></summary><div class='phrase-help-body'><strong>Start with a situation, then practice the phrases you need.</strong><span>Spanish stays first for speaking practice; English subtitles help you find the right section.</span></div>";
  fl.appendChild(navNote);
  renderRecentPhrase(fl);
  const viewSwitch=document.createElement("div");viewSwitch.className="frase-view-switch";viewSwitch.setAttribute("aria-label","Filter phrase content");
  [["all","All / Todo"],["phrases","Useful phrases / Frases"],["conversations","Conversations / Diálogos"]].forEach(([view,label])=>{
    const b=document.createElement("button");b.type="button";b.className="fr-view-btn"+(fraseView===view?" active":"");b.textContent=label;
    b.onclick=()=>{fraseView=view;renderFraseMenu();};viewSwitch.appendChild(b);
  });
  fl.appendChild(viewSwitch);
  const search=document.createElement("input");search.type="search";search.className="content-search";search.placeholder="🔎 Search phrases or conversation lines…";search.setAttribute("aria-label","Search phrases");search.value=fraseSearchTerm;
  const results=document.createElement("div");results.className="search-results";fl.appendChild(search);fl.appendChild(results);
  const h1=document.createElement("div");h1.className="fr-home-label";h1.textContent=`💬 Conversations (${PHRASE_DIALOGUES.length}) · grouped by situation`;
  const g1=document.createElement("div");g1.className="fr-dialogue-groups";
  const dlgOrder=["travel","food","daily","social"];
  const dlgMap=new Map();
  PHRASE_DIALOGUES.forEach(d=>{
    const grp=dialogueSituationGroup(d);
    if(!dlgMap.has(grp.id))dlgMap.set(grp.id,{meta:grp,items:[]});
    dlgMap.get(grp.id).items.push(d);
  });
  dlgOrder.forEach((gid,gIdx)=>{
    const entry=dlgMap.get(gid);if(!entry)return;
    const fold=document.createElement("details");fold.className="lesson-stage fr-dialogue-fold";
    if(gIdx===0)fold.open=true;
    fold.innerHTML=`<summary><div class="stage-label"><div class="stage-title">${entry.meta.label} · ${entry.items.length}</div><div class="stage-sub">${entry.meta.sub}</div></div></summary><div class="fr-home-grid fr-fold-grid"></div>`;
    const grid=fold.querySelector(".fr-fold-grid");
    entry.items.forEach(d=>{
      const c=document.createElement("button");c.type="button";c.className="fr-home-card";
      const lines=[...(d.versions||[]).flatMap(v=>v.lines||[])];
      c.innerHTML=`<div class="fr-card-title">${d.title}</div><div class="fr-card-sub">${dialogueEnglishTitle(d.title)}</div><div class="fr-card-meta">${(d.versions||[]).length} tenses · ${phraseProgress(lines)} practiced ›</div>`;
      c.onclick=()=>renderFraseDialogue(d);
      grid.appendChild(c);
    });
    g1.appendChild(fold);
  });
  const conversationGroup=document.createElement("section");conversationGroup.className="fr-conversation-group";
  if(typeof BRANCHING_ROLEPLAYS!=="undefined"&&BRANCHING_ROLEPLAYS.length){
    let rpScenarioIdx=0,rpTurnIdx=0,rpPickedOpt=null;
    const rpCard=document.createElement("section");rpCard.className="bridge-trainer-card branching-roleplay-card";
    rpCard.setAttribute("aria-label","Interactive Colombian branching roleplay simulator");
    const bindKeyClick=(el,fn)=>{
      el.onclick=fn;
      el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();fn(e);}};
    };
    let rpBlindPeek=false;
    const renderRp=(focusTarget)=>{
      const scen=BRANCHING_ROLEPLAYS[rpScenarioIdx%BRANCHING_ROLEPLAYS.length];
      const turns=scen.turns||[];
      const turn=turns[rpTurnIdx%turns.length]||{};
      const blind=isBlindEarActive()&&!rpBlindPeek;
      const rpHero=(typeof ROLEPLAY_IMAGES!=="undefined"&&ROLEPLAY_IMAGES[scen.id])?`<div class="rp-hero-banner"><img src="${ROLEPLAY_IMAGES[scen.id]}" alt="${escapeVocabHtml(scen.title)}"/><span class="region-hero-badge">${escapeVocabHtml(scen.title)}</span></div>`:"";
      rpCard.innerHTML=`<div class="bridge-kicker-row"><div class="bridge-kicker">🎭 SIMULADOR DE CONVERSACIÓN · INTERACTIVE BRANCHING ROLEPLAY</div><button type="button" class="blind-ear-chip${isBlindEarActive()?" active":""}" aria-pressed="${isBlindEarActive()?"true":"false"}">🎧 Blind-Ear: ${isBlindEarActive()?"ON":"OFF"}</button></div>
        <div class="bridge-context">Choose a real-life Colombian scenario, listen to the speaker, and pick how you want to reply:</div>
        <div class="reg-tabs-row rp-scenario-tabs" role="tablist" aria-label="Roleplay scenarios"></div>
        ${rpHero}
        <div class="comodin-sub" aria-live="polite">${escapeVocabHtml(scen.title)} — ${escapeVocabHtml(scen.sub||"")} · <strong>Turn ${rpTurnIdx+1} of ${turns.length}</strong></div>
        <div class="rp-npc-box" role="button" tabindex="0" title="Tap or press Enter to hear speaker" aria-label="Colombian speaker says: ${escapeVocabHtml(turn.npcEs||"")}. Tap to hear audio.">
          <div class="rp-npc-label">🗣️ Colombian speaker says to you:</div>
          <div class="rp-npc-es">${blind?"🎧 Listen first — tap to hear (use Peek below to read)":escapeVocabHtml(turn.npcEs||"")+" 🔊"}</div>
          <div class="rp-npc-en">${blind?"English & transcript hidden in Blind-Ear mode":escapeVocabHtml(turn.npcEn||"")}</div>
        </div>
        <div class="rp-audio-tools">
          <button type="button" class="warmup-btn rp-slow-btn">🐢 Slow (0.6x)</button>
          <button type="button" class="warmup-btn rp-fast-btn">🗣️ Natural (0.85x)</button>
          ${isBlindEarActive()?`<button type="button" class="warmup-btn rp-peek-btn">${rpBlindPeek?"🙈 Hide text":"👁️ Peek text"}</button>`:""}
        </div>
        <div class="rp-options-label">👇 Choose your reply style (tap to speak &amp; see how they respond):</div>
        <div class="rp-options-grid" role="group" aria-label="Reply style options"></div>
        <div class="rp-outcome-slot" role="region" aria-live="polite" aria-label="Conversation response and coaching"></div>`;
      const beBtn=rpCard.querySelector(".blind-ear-chip");
      if(beBtn)beBtn.onclick=()=>{userPrefs.blindEar=!isBlindEarActive();if(!userPrefs.blindEar&&userPrefs.level==="fluent")userPrefs.level="explorer";rpBlindPeek=false;saveUserPrefs();renderRp();};
      rpCard.querySelector(".rp-slow-btn").onclick=()=>speak(turn.npcEs||"",0.6);
      rpCard.querySelector(".rp-fast-btn").onclick=()=>speak(turn.npcEs||"",0.85);
      const peekBtn=rpCard.querySelector(".rp-peek-btn");
      if(peekBtn)peekBtn.onclick=()=>{rpBlindPeek=!rpBlindPeek;renderRp();};
      const npcBox=rpCard.querySelector(".rp-npc-box");
      bindKeyClick(npcBox,()=>speak(turn.npcEs||"",0.75));
      const tRow=rpCard.querySelector(".rp-scenario-tabs");
      BRANCHING_ROLEPLAYS.forEach((sc,idx)=>{
        const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(idx===rpScenarioIdx?" active":"");
        b.setAttribute("role","tab");
        b.setAttribute("aria-selected",idx===rpScenarioIdx?"true":"false");
        b.setAttribute("aria-pressed",idx===rpScenarioIdx?"true":"false");
        b.textContent=sc.title;
        b.onclick=()=>{
          rpScenarioIdx=idx;rpTurnIdx=0;rpPickedOpt=null;
          if(sc.turns&&sc.turns[0])speak(sc.turns[0].npcEs,0.75);
          renderRp("npc");
        };
        tRow.appendChild(b);
      });
      const optGrid=rpCard.querySelector(".rp-options-grid");
      (turn.options||[]).forEach((opt,oIdx)=>{
        const ob=document.createElement("button");ob.type="button";ob.className="rp-option-btn"+(rpPickedOpt===oIdx?" selected":"");
        ob.setAttribute("aria-pressed",rpPickedOpt===oIdx?"true":"false");
        ob.innerHTML=`<span class="rp-opt-style">${escapeVocabHtml(opt.style)}</span>
          <strong class="rp-opt-es">🗣️ ${escapeVocabHtml(opt.es)} 🔊</strong>
          <small class="rp-opt-en">${escapeVocabHtml(opt.en)}</small>`;
        ob.onclick=()=>{
          rpPickedOpt=oIdx;
          markPractice("phrases",opt.es);
          if(typeof recordSrs==="function")recordSrs("rp|"+opt.es,true);
          /* Synchronous speak inside tap handler for iPhone Safari */
          speak(opt.es,0.75);
          renderRp("reply");
        };
        optGrid.appendChild(ob);
      });
      if(rpPickedOpt!==null&&turn.options&&turn.options[rpPickedOpt]){
        const chosen=turn.options[rpPickedOpt];
        const outSlot=rpCard.querySelector(".rp-outcome-slot");
        outSlot.innerHTML=`<div class="rp-outcome-box">
          <div class="rp-reply-box" role="button" tabindex="0" title="Tap or press Enter to hear their response" aria-label="They respond: ${escapeVocabHtml(chosen.replyEs)}. Tap to hear audio.">
            <span class="rp-reply-tag">💬 They respond to your choice:</span>
            <strong>${escapeVocabHtml(chosen.replyEs)} 🔊</strong>
            <small>${escapeVocabHtml(chosen.replyEn)}</small>
          </div>
          <div class="tvc-why">💡 <strong>Why this works in Colombia:</strong> ${escapeVocabHtml(chosen.coach)}</div>
          <div class="bridge-actions rp-nav-actions"></div>
        </div>`;
        const replyBox=outSlot.querySelector(".rp-reply-box");
        bindKeyClick(replyBox,()=>speak(chosen.replyEs,0.75));
        const navActs=outSlot.querySelector(".rp-nav-actions");
        const hearReplyBtn=document.createElement("button");hearReplyBtn.type="button";hearReplyBtn.className="lp-nav-btn";hearReplyBtn.textContent="🔊 Hear Their Reply";
        hearReplyBtn.onclick=()=>speak(chosen.replyEs,0.75);
        const nextBtn=document.createElement("button");nextBtn.type="button";nextBtn.className="lp-nav-btn primary";
        if(rpTurnIdx+1<turns.length){
          nextBtn.textContent=`Next Turn (${rpTurnIdx+2}/${turns.length}) →`;
          nextBtn.onclick=()=>{rpTurnIdx++;rpPickedOpt=null;if(turns[rpTurnIdx])speak(turns[rpTurnIdx].npcEs,0.75);renderRp("npc");};
        }else{
          nextBtn.textContent="Next Scenario →";
          nextBtn.onclick=()=>{rpScenarioIdx=(rpScenarioIdx+1)%BRANCHING_ROLEPLAYS.length;rpTurnIdx=0;rpPickedOpt=null;const nx=BRANCHING_ROLEPLAYS[rpScenarioIdx];if(nx&&nx.turns&&nx.turns[0])speak(nx.turns[0].npcEs,0.75);renderRp("npc");};
        }
        navActs.append(hearReplyBtn,nextBtn);
        if(typeof attachStarBtn==="function")attachStarBtn(navActs,chosen.es,scen.title);
        attachMic(navActs,chosen.es,"phrases");
      }
      if(focusTarget==="reply"){
        const rb=rpCard.querySelector(".rp-reply-box");if(rb)rb.focus();
      }else if(focusTarget==="npc"){
        const nb=rpCard.querySelector(".rp-npc-box");if(nb)nb.focus();
      }
    };
    renderRp();
    conversationGroup.appendChild(rpCard);
  }
  if(typeof COLOMBIAN_STORIES!=="undefined"&&COLOMBIAN_STORIES.length){
    let stIdx=0,stPick=[0,0,0],stBlindPeek=false;
    const stCard=document.createElement("section");stCard.className="bridge-trainer-card story-builder-card";
    const renderStory=()=>{
      const st=COLOMBIAN_STORIES[stIdx%COLOMBIAN_STORIES.length];
      const blind=isBlindEarActive()&&!stBlindPeek;
      const chosenParts=st.parts.map((pt,pi)=>pt.options[stPick[pi]%pt.options.length]||pt.options[0]);
      const fullEs=chosenParts.map(o=>o.es).join(" ").replace(/\s+/g," ").trim();
      const fullEn=chosenParts.map(o=>o.en).join(" ").replace(/\s+/g," ").trim();
      stCard.innerHTML=`<div class="bridge-kicker">📖 3-PART COLOMBIAN STORY BUILDER · CONNECT PAST, BRIDGE &amp; OUTCOME</div>
        <div class="bridge-context">${escapeVocabHtml(st.sub)}</div>
        <div class="reg-tabs-row story-tabs"></div>
        <div class="story-parts"></div>
        <div class="story-assembled-box${blind?" blind-masked":""}">
          <div class="story-assembled-kicker">🗣️ Your Connected Story ${blind?"(🎧 Blind-Ear: listen first!)":""}</div>
          <div class="story-assembled-es">${blind?"🎧 Tap Hear Full Story below, then Peek to check your story text":escapeVocabHtml(fullEs)}</div>
          <div class="story-assembled-en">${escapeVocabHtml(fullEn)}</div>
          <div class="bridge-actions story-actions"></div>
        </div>`;
      const tabsRow=stCard.querySelector(".story-tabs");
      COLOMBIAN_STORIES.forEach((s,i)=>{
        const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(i===stIdx?" active":"");
        b.textContent=s.title;
        b.onclick=()=>{stIdx=i;stPick=[0,0,0];stBlindPeek=false;renderStory();};
        tabsRow.appendChild(b);
      });
      const partsWrap=stCard.querySelector(".story-parts");
      st.parts.forEach((pt,pi)=>{
        const pRow=document.createElement("div");pRow.className="story-part-row";
        pRow.innerHTML=`<div class="story-part-label">${escapeVocabHtml(pt.label)}</div><div class="story-part-chips"></div>`;
        const cWrap=pRow.querySelector(".story-part-chips");
        pt.options.forEach((opt,oi)=>{
          const b=document.createElement("button");b.type="button";b.className="story-chip"+(stPick[pi]===oi?" active":"");
          b.innerHTML=`<strong>${escapeVocabHtml(opt.es)}</strong><small>${escapeVocabHtml(opt.en)}</small>`;
          b.onclick=()=>{stPick[pi]=oi;renderStory();speak(opt.es,0.78);};
          cWrap.appendChild(b);
        });
        partsWrap.appendChild(pRow);
      });
      const sActs=stCard.querySelector(".story-actions");
      const hearStory=document.createElement("button");hearStory.type="button";hearStory.className="lp-nav-btn primary";hearStory.textContent="🔊 Hear Full Story";
      hearStory.onclick=()=>{markPractice("phrases",fullEs);speak(fullEs,0.78);};
      const slowStory=document.createElement("button");slowStory.type="button";slowStory.className="lp-nav-btn";slowStory.textContent="🐢 Slow (0.62x)";
      slowStory.onclick=()=>speak(fullEs,0.62);
      const remixStory=document.createElement("button");remixStory.type="button";remixStory.className="lp-nav-btn";remixStory.textContent="🎲 Remix Story";
      remixStory.onclick=()=>{
        stPick=st.parts.map(p=>Math.floor(Math.random()*p.options.length));
        stBlindPeek=false;
        const nextFull=st.parts.map((p,pi)=>p.options[stPick[pi]].es).join(" ");
        renderStory();speak(nextFull,0.78);
      };
      sActs.append(hearStory,slowStory,remixStory);
      if(isBlindEarActive()){
        const peekB=document.createElement("button");peekB.type="button";peekB.className="rp-peek-btn";
        peekB.textContent=stBlindPeek?"🙈 Hide Text":"👁️ Peek Story";
        peekB.onclick=()=>{stBlindPeek=!stBlindPeek;renderStory();};
        sActs.appendChild(peekB);
      }
      attachMic(sActs,fullEs,"phrases");
    };
    renderStory();
    conversationGroup.appendChild(stCard);
  }
  conversationGroup.append(h1,g1);
  const h2=document.createElement("div");h2.className="fr-home-label";h2.textContent="📋 Phrase collections · tap to open";
  const g2=document.createElement("div");g2.className="fr-collections-groups";
  const groupOrder=["survival","social","build","strong","other"];
  const groups=new Map();
  const addCollection=(parent,s,i)=>{
    const meta=fraseSectionMeta(s);
    const c=document.createElement("button");c.type="button";c.className="fr-home-card fr-col";
    c.innerHTML=`<div class="fr-card-icon">${meta.icon}</div><div class="fr-card-title">${meta.name}</div><div class="fr-card-meta">${(s.items||[]).length} phrases · ${phraseProgress(s.items)} practiced ›</div>`;
    const collectionMeta=c.querySelector(".fr-card-meta");if(collectionMeta){const english=document.createElement("div");english.className="fr-card-sub";english.textContent=phraseEnglishTitle(s.section);c.insertBefore(english,collectionMeta);}
    c.onclick=()=>renderFraseSection(i);parent.appendChild(c);
  };
  const titleGroup=document.createElement("div");titleGroup.className="fr-collection-group";titleGroup.dataset.group="titles";
  titleGroup.innerHTML=`<div class="fr-group-label">🏷️ Names & polite titles / Títulos</div><div class="fr-home-grid"></div>`;
  const titleGrid=titleGroup.querySelector(".fr-home-grid");
  const titleLabel=titleGroup.querySelector(".fr-group-label");titleLabel.setAttribute("role","button");titleLabel.tabIndex=0;titleLabel.setAttribute("aria-expanded","true");
  const toggleTitles=()=>{const closed=titleGroup.classList.toggle("collapsed");titleLabel.setAttribute("aria-expanded",String(!closed));};
  titleLabel.onclick=toggleTitles;titleLabel.onkeydown=e=>{if(e.key==="Enter"||e.key===" ")toggleTitles()};
  const tit=document.createElement("button");tit.type="button";tit.className="fr-home-card fr-col";
  tit.innerHTML=`<div class="fr-card-icon">🏷️</div><div class="fr-card-title">Títulos</div><div class="fr-card-meta">2 items ›</div>`;
  tit.onclick=()=>renderFraseSection(-1);titleGrid.appendChild(tit);g2.appendChild(titleGroup);
  sections.forEach((s,i)=>{
    const group=phraseCollectionGroup(s);if(!groups.has(group.id)){
      const block=document.createElement("div");block.className="fr-collection-group";block.dataset.group=group.id;block.innerHTML=`<div class="fr-group-label">${group.label}</div><div class="fr-home-grid"></div>`;
      const groupLabel=block.querySelector(".fr-group-label");groupLabel.setAttribute("role","button");groupLabel.tabIndex=0;groupLabel.setAttribute("aria-expanded","true");
      const toggleGroup=()=>{const closed=block.classList.toggle("collapsed");groupLabel.setAttribute("aria-expanded",String(!closed));};
      groupLabel.onclick=toggleGroup;groupLabel.onkeydown=e=>{if(e.key==="Enter"||e.key===" ")toggleGroup()};
      groups.set(group.id,block);
    }
    addCollection(groups.get(group.id).querySelector(".fr-home-grid"),s,i);
  });
  groupOrder.forEach(id=>{const block=groups.get(id);if(block){g2.appendChild(block);}});
  g2.appendChild(titleGroup);
  const phraseCollectionsGroup=document.createElement("section");phraseCollectionsGroup.className="fr-phrase-collections-group";phraseCollectionsGroup.append(h2,g2);
  /* Put the speaking-first material first; collections remain immediately
     below it for lookup and targeted study. */
  fl.appendChild(conversationGroup);
  fl.appendChild(phraseCollectionsGroup);
  const blocks=[phraseCollectionsGroup,conversationGroup];
  function applyFraseView(){
    const q=fraseSearchTerm.trim();
    if(q){blocks.forEach(el=>{el.hidden=true;});return;}
    const showConversations=fraseView!=="phrases";const showPhrases=fraseView!=="conversations";
    conversationGroup.hidden=!showConversations;g2.hidden=!showPhrases;
  }
  function refreshPhraseSearch(){
    const q=fraseSearchTerm.trim().toLowerCase();const active=!!q;results.innerHTML="";results.hidden=!active;applyFraseView();if(!active)return;
    const matches=[];
    PHRASE_DIALOGUES.forEach(d=>(d.versions||[]).forEach(v=>(v.lines||[]).forEach(line=>{if((line.es+" "+line.en).toLowerCase().includes(q))matches.push({title:d.title,kind:"dialogue",line,dialogue:d,tense:v.tense});})));
    sections.forEach((s,i)=>(s.items||[]).forEach(item=>{if((item.es+" "+item.en).toLowerCase().includes(q))matches.push({title:s.section,kind:"section",item,index:i});}));
    if(!matches.length){results.appendChild(lpEl("search-empty","No phrase matches yet. Try a Spanish or English word."));return;}
    matches.slice(0,80).forEach(m=>{const card=document.createElement("button");card.type="button";card.className="search-result-card";if(m.kind==="dialogue"){card.innerHTML=`<span><strong>${escapeVocabHtml(m.line.es)}</strong><small>${escapeVocabHtml(m.line.en)}</small><em>💬 ${escapeVocabHtml(m.title)}</em></span><span>›</span>`;card.onclick=()=>renderFraseDialogue(m.dialogue,m.tense);}else{const register=m.item.register?`<b class="search-register">${escapeVocabHtml(m.item.register)}</b>`:"";card.innerHTML=`<span><strong>${escapeVocabHtml(m.item.es)}</strong><small>${escapeVocabHtml(m.item.en)}</small>${register}<em>📋 ${escapeVocabHtml(m.title)}</em></span><span>🔊</span>`;card.onclick=()=>renderFraseSection(m.index);}results.appendChild(card);});
  }
  search.oninput=()=>{fraseSearchTerm=search.value;refreshPhraseSearch();};refreshPhraseSearch();
}
function renderFraseSection(idx){
  resetFraseScroll();
  fl.dataset.view="section";
  fl.innerHTML="";
  const back=document.createElement("button");
  back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>All phrases · Todas las frases</span>";
  back.onclick=renderFraseMenu;
  fl.appendChild(back);
  if(idx===-1){
    const td=document.createElement("div");td.className="frase-section";
    const ttlEl=document.createElement("div");ttlEl.className="frase-title";
    ttlEl.style.cssText="color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)";
    ttlEl.textContent="Títulos · Titles";td.appendChild(ttlEl);
    const tg=document.createElement("div");tg.className="titles-grid";
    [{abbr:"Sr.",full:"Señor",en:"Mr."},{abbr:"Sra.",full:"Señora",en:"Mrs. / Ms."}].forEach(t=>{
      const tc=document.createElement("div");tc.className="title-card";
      tc.innerHTML=`<div class="title-abbr">${t.abbr}</div><div class="title-full">${t.full}</div><div class="title-en">${t.en}</div>`;
      tc.onclick=()=>speak(t.full,0.75);tg.appendChild(tc);});
    td.appendChild(tg);fl.appendChild(td);
    return;
  }
  const sec=FRASES.filter(s=>s.section)[idx];
  if(!sec){renderFraseMenu();return;}
  const wrap=document.createElement("div");wrap.className="frase-section";
  const st=document.createElement("div");st.className="frase-title";st.style.cssText=sec.cls||"";st.innerHTML="<span>"+escapeVocabHtml(sec.section)+"</span><small>"+escapeVocabHtml(phraseEnglishTitle(sec.section))+"</small>";wrap.appendChild(st);
  sec.items.forEach(item=>{
    const card=document.createElement("div");card.className="frase-card";
    card.setAttribute("role","button");card.setAttribute("tabindex","0");
    const register=item.register?`<span class="f-register">${escapeVocabHtml(item.register)}</span>`:"";
    card.innerHTML=`<div class="frase-txt"><div class="f-es">${item.es}</div><div class="f-en">${item.en}</div>${register}</div><span class="f-spk">🔊</span>`;
    const playFrase=()=>{markPractice("phrases",item.es);speak(item.es,0.75);};
    card.onclick=e=>{if(e.target.closest(".star-pin-btn")||e.target.closest(".lp-mic"))return;playFrase();};
    card.onkeydown=e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest("button")){e.preventDefault();playFrase();}};
    if(typeof attachStarBtn==="function")attachStarBtn(card,item.es,sec.section||"Frases");
    attachMic(card,item.es);
    wrap.appendChild(card);
  });
  fl.appendChild(wrap);
  rememberFraseLocation({kind:"section",value:idx,title:sec.section,subtitle:phraseEnglishTitle(sec.section)});
}
function returnFromFraseDialogue(){
  const returnToLessons=fraseReturnToLessons;
  fraseReturnToLessons=false;
  if(returnToLessons){showPage("lecciones");renderLessons();}
  else renderFraseMenu();
}
function renderFraseDialogue(dialogue,tense){
  resetFraseScroll();
  fl.dataset.view="dialogue";
  fl.innerHTML="";
  const back=document.createElement("button");
  back.type="button";back.className="phrase-back";
  const returnToLessons=fraseReturnToLessons;
  back.innerHTML=returnToLessons?"<span>‹</span><span>Back to lessons · Volver a lecciones</span>":"<span>‹</span><span>Back to phrases · Volver a frases</span>";
  back.onclick=returnFromFraseDialogue;
  fl.appendChild(back);
  /* Header: title + English + tense selector — one version at a time (v23) */
  const versions=dialogue.versions||[];
  const active=tense||(versions[0]&&versions[0].tense)||"Ahora";
  rememberFraseLocation({kind:"dialogue",value:dialogue.title,title:dialogue.title,subtitle:dialogueEnglishTitle(dialogue.title),tense:active});
  const hdr=document.createElement("div");hdr.className="dlg-head";
  hdr.innerHTML=`<div class="dlg-head-title">${dialogue.title}</div><div class="dlg-head-en">${dialogue.en||""}</div>`;
  if(versions.length>1){
    const trow=document.createElement("div");trow.className="dlg-tense-row";
    versions.forEach(v=>{
      const b=document.createElement("button");b.type="button";
      b.className="dlg-tense-btn"+(v.tense===active?" active":"");
      b.textContent=v.tense;
      b.onclick=()=>renderFraseDialogue(dialogue,v.tense);
      trow.appendChild(b);
    });
    hdr.appendChild(trow);
  }
  fl.appendChild(hdr);
  if(routineToday().step===3){
    const guide=document.createElement("section");guide.className="routine-phrase-guide";
    guide.innerHTML="<div class='routine-guide-kicker'>🎯 STEP 4 · SPEAKING</div><strong>Practice both sides of the conversation</strong><span>Tap each line to listen. Then cover one side with your hand, say it from memory, and compare. Try the Ahora version first.</span><button type='button' class='routine-next-large' onclick='routineFinishPhrases()'>I practiced both sides — continue →</button><button type='button' class='routine-back-link' onclick='routineBack()'>‹ Back to daily path</button>";
    fl.appendChild(guide);
  }
  /* Speaking practice: hide one side, say the line out loud, tap to reveal */
  const bubbles=[];
  let activeRole=null,stepIdx=-1,waitingReveal=false;
  const pbar=document.createElement("div");pbar.className="practice-bar";
  const pInfo=document.createElement("div");pInfo.className="practice-info";
  pInfo.innerHTML="<strong>🗣️ Roleplay & Shadowing</strong><small>Hide a role to speak from memory, or step through turn by turn</small>";
  const pBtns=document.createElement("div");pBtns.className="practice-btns";
  const applyRole=(who)=>{
    activeRole=who;
    pBtns.querySelectorAll(".role-btn").forEach(x=>x.classList.toggle("active",x.dataset.who===String(who)));
    bubbles.forEach(bb=>bb.el.classList.toggle("dlg-hidden",who!==null&&bb.who===who));
  };
  const mkPB=(label,who)=>{
    const b=document.createElement("button");b.type="button";b.className="practice-btn role-btn"+(who===null?" active":"");b.dataset.who=String(who);b.textContent=label;
    b.onclick=()=>applyRole(who);
    return b;
  };
  pBtns.appendChild(mkPB("👀 Show all",null));
  pBtns.appendChild(mkPB("🎭 You are A","A"));
  pBtns.appendChild(mkPB("🎭 You are B","B"));
  const swapBtn=document.createElement("button");swapBtn.type="button";swapBtn.className="practice-btn";swapBtn.textContent="🔄 Swap A↔B";
  swapBtn.onclick=()=>applyRole(activeRole==="A"?"B":"A");
  pBtns.appendChild(swapBtn);
  const shadowAllBtn=document.createElement("button");shadowAllBtn.type="button";shadowAllBtn.className="practice-btn shadow-all-btn";shadowAllBtn.textContent="🗣️ Shadow All";shadowAllBtn.title="Listen to every line spoken twice with a pause to repeat out loud";
  shadowAllBtn.onclick=()=>{
    const verNow=versions.find(v=>v.tense===active)||versions[0];
    if(!verNow||!verNow.lines||!verNow.lines.length)return;
    const script=verNow.lines.map(l=>`${l.tts} ... ... ${l.tts}`).join(" ... ");
    verNow.lines.forEach(l=>markPractice("phrases",l.es));
    /* Synchronous speak inside tap handler for iPhone Safari */
    speak(script,0.72);
  };
  pBtns.appendChild(shadowAllBtn);
  pbar.appendChild(pInfo);pbar.appendChild(pBtns);
  fl.appendChild(pbar);
  const box=document.createElement("div");
  box.className="dialogue phrase-dialogue";
  const stepper=document.createElement("div");stepper.className="dlg-stepper-bar";
  const stepStatus=document.createElement("span");stepStatus.className="dlg-stepper-status";stepStatus.textContent="Tap ▶️ Next Turn to step through the conversation out loud";
  const stepBtn=document.createElement("button");stepBtn.type="button";stepBtn.className="lp-nav-btn primary dlg-stepper-btn";stepBtn.textContent="▶️ Start Turn 1";
  stepper.append(stepStatus,stepBtn);
  box.appendChild(stepper);
  const langBtn=document.createElement("button");langBtn.type="button";langBtn.className="practice-btn language-toggle";langBtn.textContent="🇺🇸 Hide English";langBtn.onclick=()=>{const hidden=box.classList.toggle("dlg-no-english");langBtn.textContent=hidden?"🇺🇸 Show English":"🇺🇸 Hide English";};pBtns.appendChild(langBtn);
  const blindBtn=document.createElement("button");blindBtn.type="button";blindBtn.className="practice-btn blind-listen-btn";blindBtn.textContent="🙈 Solo Oído";blindBtn.title="Blur text so you train your ear first: 1st tap plays audio, 2nd tap reveals text";
  blindBtn.onclick=()=>{
    const on=box.classList.toggle("dlg-blind-listen");
    blindBtn.classList.toggle("active",on);
    blindBtn.textContent=on?"👂 Solo Oído: ON":"🙈 Solo Oído";
    bubbles.forEach(b=>{b.el.classList.remove("blind-heard","blind-revealed");});
  };
  pBtns.appendChild(blindBtn);
  if(typeof CONVERSATION_CURVEBALLS!=="undefined"&&CONVERSATION_CURVEBALLS.length){
    const sitCat=dialogueSituationGroup(dialogue).id;
    const catPool=CONVERSATION_CURVEBALLS.filter(x=>x.cat===sitCat);
    const cbPool=catPool.length?catPool:CONVERSATION_CURVEBALLS;
    let cbIdx=0;
    const cbPanel=document.createElement("section");cbPanel.className="curveball-panel";cbPanel.hidden=true;
    const renderCb=(autoSpeak)=>{
      const cb=cbPool[cbIdx%cbPool.length];
      cbPanel.innerHTML=`<div class="curveball-head"><span class="curveball-kicker">⚡ IMPREVISTO · REAL-WORLD CURVEBALL</span><button type="button" class="curveball-close" aria-label="Close curveball">✕</button></div>
        <div class="curveball-title">${escapeVocabHtml(cb.title)}</div>
        <div class="curveball-prompt-box" title="Tap to hear curveball">
          <div class="curveball-prompt-label">🗣️ They unexpectedly say:</div>
          <div class="curveball-prompt-es">${escapeVocabHtml(cb.curveballEs)} 🔊</div>
          <div class="curveball-prompt-en">${escapeVocabHtml(cb.curveballEn)}</div>
        </div>
        <div class="curveball-repairs-label">🛠️ Choose how you pivot & respond out loud:</div>
        <div class="curveball-repairs">
          <div class="curveball-option">
            <span class="curveball-opt-tag">Option 1 · Direct Repair</span>
            <div class="curveball-opt-es">${escapeVocabHtml(cb.repairEs)}</div>
            <div class="curveball-opt-en">${escapeVocabHtml(cb.repairEn)}</div>
            <div class="curveball-opt-actions" data-opt="1"></div>
          </div>
          <div class="curveball-option">
            <span class="curveball-opt-tag">Option 2 · Backup Pivot</span>
            <div class="curveball-opt-es">${escapeVocabHtml(cb.backupEs)}</div>
            <div class="curveball-opt-en">${escapeVocabHtml(cb.backupEn)}</div>
            <div class="curveball-opt-actions" data-opt="2"></div>
          </div>
        </div>
        <div class="curveball-tip">💡 ${escapeVocabHtml(cb.tip)}</div>
        <div class="curveball-footer"></div>`;
      cbPanel.querySelector(".curveball-close").onclick=()=>{cbPanel.hidden=true;cbBtn.classList.remove("active");};
      const pBox=cbPanel.querySelector(".curveball-prompt-box");
      pBox.onclick=()=>speak(cb.curveballEs,0.75);
      [[1,cb.repairEs],[2,cb.backupEs]].forEach(([num,txt])=>{
        const act=cbPanel.querySelector(`.curveball-opt-actions[data-opt="${num}"]`);
        const hBtn=document.createElement("button");hBtn.type="button";hBtn.className="warmup-btn";hBtn.textContent="🔊 Speak";
        hBtn.onclick=e=>{e.stopPropagation();markPractice("phrases",txt);speak(txt,0.75);};
        act.appendChild(hBtn);
        if(typeof attachStarBtn==="function")attachStarBtn(act,txt,"Imprevisto");
        attachMic(act,txt,"phrases");
      });
      const foot=cbPanel.querySelector(".curveball-footer");
      const nextCb=document.createElement("button");nextCb.type="button";nextCb.className="lp-nav-btn primary";nextCb.textContent="🎲 Otro imprevisto (Next curveball) →";
      nextCb.onclick=()=>{cbIdx=(cbIdx+1)%cbPool.length;renderCb(true);};
      foot.appendChild(nextCb);
      if(autoSpeak)speak(cb.curveballEs,0.75);
    };
    const cbBtn=document.createElement("button");cbBtn.type="button";cbBtn.className="practice-btn curveball-trigger-btn";cbBtn.textContent="⚡ Imprevisto";cbBtn.title="Throw a realistic Colombian curveball to practice unscripted recovery";
    cbBtn.onclick=()=>{
      const willOpen=cbPanel.hidden;
      cbPanel.hidden=!willOpen;
      cbBtn.classList.toggle("active",willOpen);
      if(willOpen)renderCb(true);
    };
    pBtns.appendChild(cbBtn);
    box.insertBefore(cbPanel,stepper);
  }
  const version=versions.find(v=>v.tense===active)||versions[0];
  if(version){
    version.lines.forEach((line,lIdx)=>{
      const row=document.createElement("div");
      row.className="dlg-line"+(line.who==="B"?" right":"");
      row.innerHTML=`<div class="dlg-avatar" style="background:${line.who==="A"?"rgba(74,168,160,0.2)":"rgba(167,139,250,0.2)"}">${line.who}</div><div class="dlg-bubble"><div class="dlg-es">${line.es}</div><div class="dlg-en">${line.en}</div></div>`;
      const bub=row.querySelector(".dlg-bubble");
      bubbles.push({who:line.who,el:bub,row,line,idx:lIdx});
      const shadow=document.createElement("button");shadow.type="button";shadow.className="dlg-shadow";shadow.textContent="🗣️ Shadow";shadow.title="Listen, then record yourself";
      shadow.onclick=e=>{e.stopPropagation();speak(line.tts,0.72,()=>setTimeout(()=>openMicPanel(line.tts),180));};
      bub.appendChild(shadow);
      bub.onclick=e=>{
        if(e.target.closest(".star-pin-btn"))return;
        if(bub.classList.contains("dlg-hidden"))bub.classList.remove("dlg-hidden");
        if(box.classList.contains("dlg-blind-listen")){
          if(!bub.classList.contains("blind-heard"))bub.classList.add("blind-heard");
          else bub.classList.add("blind-revealed");
        }
        markPractice("phrases",line.es);
        speak(line.tts,0.75);
      };
      if(typeof attachStarBtn==="function")attachStarBtn(row,line.es,dialogue.title);
      attachMic(row,line.tts);
      box.appendChild(row);
    });
    stepBtn.onclick=()=>{
      if(!bubbles.length)return;
      if(waitingReveal&&stepIdx>=0&&stepIdx<bubbles.length){
        const cur=bubbles[stepIdx];
        cur.el.classList.remove("dlg-hidden");
        markPractice("phrases",cur.line.es);
        /* Synchronous speak inside click handler for iPhone Safari */
        speak(cur.line.tts,0.75);
        waitingReveal=false;
        const isLast=stepIdx>=bubbles.length-1;
        stepStatus.textContent=`Turn ${stepIdx+1}/${bubbles.length} (${cur.who}) · Repeat out loud!`;
        stepBtn.textContent=isLast?"↻ Restart Turns":`▶️ Next Turn (${stepIdx+2}/${bubbles.length})`;
        return;
      }
      stepIdx=(stepIdx+1)%bubbles.length;
      if(stepIdx===0&&activeRole)applyRole(activeRole);
      bubbles.forEach((b,i)=>b.row.classList.toggle("active-turn",i===stepIdx));
      const cur=bubbles[stepIdx];
      cur.row.scrollIntoView({behavior:"smooth",block:"nearest"});
      if(cur.el.classList.contains("dlg-hidden")){
        waitingReveal=true;
        stepStatus.textContent=`🗣️ Turn ${stepIdx+1}/${bubbles.length}: Your turn (${cur.who})! Say it out loud first.`;
        stepBtn.textContent="👀 Reveal & Hear My Line";
      }else{
        markPractice("phrases",cur.line.es);
        /* Synchronous speak inside click handler for iPhone Safari */
        speak(cur.line.tts,0.75);
        const isLast=stepIdx>=bubbles.length-1;
        stepStatus.textContent=`🔊 Turn ${stepIdx+1}/${bubbles.length} (Speaker ${cur.who})`;
        stepBtn.textContent=isLast?"↻ Restart Turns":`▶️ Next Turn (${stepIdx+2}/${bubbles.length})`;
      }
    };
  }
  let alt=null;
  if(version&&Array.isArray(version.alternates)&&version.alternates.length){
    alt=document.createElement("details");alt.className="dlg-alternates";
    alt.innerHTML="<summary>🧩 More natural ways to say it</summary>";
    const list=document.createElement("div");list.className="dlg-alternate-list";
    version.alternates.forEach(item=>{
      const row=document.createElement("button");row.type="button";row.className="dlg-alternate";
      row.innerHTML=`<strong>${escapeVocabHtml(item.es)}</strong><small>${escapeVocabHtml(item.en)}</small><span>🔊</span>`;
      row.onclick=()=>{markPractice("phrases",item.es);speak(item.tts||item.es,0.75);};list.appendChild(row);
    });
    alt.appendChild(list);
  }
  fl.appendChild(box);
  if(alt)fl.appendChild(alt);
  const tip=document.createElement("div");
  tip.className="phrase-practice-note";
  tip.textContent="Practice both sides: read Persona A, then Persona B. Switch tenses above to level up.";
  fl.appendChild(tip);
}
renderFraseMenu();
// ── Build Lecciones — speaking-first lesson player (v15) ─────────────────────
const LESSONS=[
  {id:"presentate",icon:"👋",title:"Preséntate",sub:"Tu nombre, tu ciudad y un saludo",vocab:"gustos",dialogue:"Presentación personal",quizCat:"all",quizMode:"conversation"},
  {id:"plata",icon:"💰",title:"Números y plata",sub:"Precios, cantidades y dinero colombiano",vocab:"numeros",dialogue:"Carro y taxi",quizCat:"numeros"},
  {id:"trabajo",icon:"💼",title:"Tu trabajo",sub:"Habla de tu profesión y tus planes",vocab:"trabajo",dialogue:"Trabajo y oficina",quizCat:"trabajo"},
  {id:"casa",icon:"🏠",title:"Tu casa",sub:"Habitaciones, objetos y ubicación",vocab:"habitacion",dialogue:"La habitación",quizCat:"habitacion"},
  {id:"calle",icon:"🧭",title:"En la calle",sub:"Direcciones, taxi y transporte",vocab:"direcciones",dialogue:"Pedir direcciones",quizCat:"direcciones"},
  {id:"cocina",icon:"🍳",title:"La cocina",sub:"Utensilios, comida y acciones",vocab:"cocina",dialogue:"Preparar la cocina",quizCat:"cocina"},
  {id:"gustos",icon:"❤️",title:"Gustos y familia",sub:"Habla de las personas y cosas que te gustan",vocab:"gustos",dialogue:"Gustos y familia",quizCat:"gustos"},
  {id:"planes",icon:"📱",title:"Planes y teléfono",sub:"Organiza una salida y mantén el contacto",vocab:"tecnologia",dialogue:"Ver televisión",quizCat:"tecnologia"},
  {id:"sentirse",icon:"😊",title:"Cómo te sientes",sub:"Expresa necesidades, emociones y estados",vocab:"emociones",dialogue:"En casa",quizCat:"emociones"},
  {id:"colombia",icon:"🇨🇴",title:"Colombianismos",sub:"Sonidos y palabras que escucharás en Colombia",vocab:"colombianismos",dialogue:"Carro y taxi",quizCat:"colombianismos"},
  {id:"gram-presente",icon:"⚡",title:"Presente para hablar",sub:"Di quién eres, qué haces y cómo estás",vocab:"verbos",dialogue:"Presentación personal",quizCat:"all",quizMode:"conversation",quizFocus:"present"},
  {id:"gram-futuro",icon:"⏭️",title:"Planes futuros",sub:"Usa voy a… para hablar de tus planes",vocab:"acciones",dialogue:"Trabajo y oficina",quizCat:"all",quizMode:"conversation",quizFocus:"future"},
  {id:"gram-pasado",icon:"⏮️",title:"Hablar del pasado",sub:"Cuenta qué hiciste ayer y qué pasó",vocab:"acciones",dialogue:"Preparar la cocina",quizCat:"all",quizMode:"conversation",quizFocus:"past"},
  {id:"gram-pasado-historia",icon:"🗣️",title:"Pasado para conversar",sub:"Cuenta qué hiciste y qué estaba pasando",vocab:"verbos",dialogue:"Contar lo que pasó",quizCat:"all",quizMode:"conversation",quizFocus:"past",readingId:"lectura-historia-contraste"},
  {id:"gram-pasado-contraste",icon:"🎞️",title:"Pasado: evento vs. contexto",sub:"Fui, iba, estaba y era para contar historias",vocab:"acciones",dialogue:"Contar lo que pasó",quizCat:"frases",quizMode:"blank",quizFocus:"past",readingId:"lectura-historia-contraste"},
  {id:"gram-subjuntivo",icon:"🌱",title:"Deseos y recomendaciones",sub:"Quiero que…, espero que…, es importante que…",vocab:"acciones",dialogue:"Planes de fin de semana",quizCat:"subjuntivo",quizMode:"blank",quizFocus:"subjuntivo"},
  {id:"gram-necesidades",icon:"🧱",title:"Necesidades y obligaciones",sub:"Di lo que querías, necesitabas y tenías que hacer",vocab:"acciones",dialogue:"Contar lo que pasó",quizCat:"all",quizMode:"conversation",quizFocus:"past"},
  {id:"gram-conectores",icon:"🔗",title:"Conecta tus ideas",sub:"Usa pero, porque y entonces para sonar natural",vocab:"gustos",dialogue:"Contar lo que pasó",quizCat:"all",quizMode:"conversation"},
  {id:"gram-groserias",icon:"⚠️",title:"Groserías colombianas",sub:"Reconócelas y aprende el contexto antes de usarlas",vocab:"colombianismos",dialogue:"Groserías colombianas",quizCat:"groserias",quizMode:"conversation"},
  {id:"gram-pronombres",icon:"👤",title:"Pronombres en conversación",sub:"Practica lo, la, le y las combinaciones comunes",vocab:"gustos",dialogue:"Pronombres en acción",quizCat:"pronombres",quizMode:"conversation",quizFocus:"pronombres",readingId:"lectura-pronombres-ubicacion"},
  {id:"survival-communication",icon:"🧰",title:"Hazte entender",sub:"Pide repetición, tiempo y ayuda cuando no entiendes",vocab:"gustos",dialogue:"Uber: hablo poquito español",quizCat:"reparar"},
  {id:"cortesia-colombiana",icon:"🙏",title:"Cortesía colombiana",sub:"Usa ¿Me regala…?, ¿Será que…? y Qué pena con usted",vocab:"colombianismos",dialogue:"Cortesía en una tienda",quizCat:"cortesia",quizMode:"conversation"},
  {id:"uber-ride",icon:"🚕",title:"Uber en español",sub:"Confirma la recogida, la dirección y el destino",vocab:"direcciones",dialogue:"Uber: confirmar la recogida",quizCat:"uber",quizMode:"conversation"},
  {id:"direcciones",icon:"🏢",title:"Edificios y entradas",sub:"Encuentra la entrada, el piso y el edificio correcto",vocab:"direcciones",dialogue:"Uber: dirección equivocada",quizCat:"direcciones",quizMode:"conversation"},
  {id:"hotel-checkin",icon:"🏨",title:"Llegada al hotel",sub:"Regístrate, pregunta por el desayuno y ubícate",vocab:"lugares",dialogue:"Hotel: registrarse",quizCat:"hotel",quizMode:"conversation"},
  {id:"farmacia",icon:"💊",title:"En la farmacia",sub:"Explica síntomas y pregunta cómo tomar algo",vocab:"emociones",dialogue:"Farmacia: explicar síntomas",quizCat:"farmacia",quizMode:"conversation"},
  {id:"daily-repair",icon:"📱",title:"Resolver una llamada",sub:"Repara la conversación cuando hay mala señal",vocab:"tecnologia",dialogue:"Teléfono: mala señal",quizCat:"reparar",quizMode:"conversation"},
  {id:"sentence-structure",icon:"🧱",title:"Construye tus frases",sub:"Une palabras en frases que puedas decir de verdad",vocab:"acciones",dialogue:"Compañeros de trabajo",quizCat:"estructura",quizMode:"mixed"},
  {id:"connectors-v36",icon:"🔗",title:"Conecta tus ideas",sub:"Usa si, pero, porque y entonces para sonar natural",vocab:"gustos",dialogue:"Planes de fin de semana",quizCat:"conectores",quizMode:"mixed"},
  {id:"function-words",icon:"🗣️",title:"Palabras para conversar",sub:"Usa frases pequeñas para conectar ideas y mantener la charla",vocab:"gustos",dialogue:"Palabras para conversar",quizCat:"conectores",quizMode:"mixed"},
  {id:"action-chunks",icon:"⚡",title:"Acciones de todos los días",sub:"Quiero, necesito, tengo que y voy a… para decir lo que haces",vocab:"acciones",dialogue:"Acciones de todos los días",quizCat:"acciones",quizMode:"conversation"},
  {id:"social-colombia-v36",icon:"🇨🇴",title:"Habla más colombiano",sub:"Expresiones sociales con registro y contexto",vocab:"colombianismos",dialogue:"Compañeros de trabajo",quizCat:"expresiones",quizMode:"conversation"},
  {id:"muletillas-diminutivos",icon:"☕",title:"Tintico, ahorita y muletillas",sub:"Gana tiempo al hablar y suena más colombiano",vocab:"colombianismos",dialogue:"Ganar tiempo al hablar",quizCat:"muletillas",quizMode:"conversation"},
  {id:"gram-perfecto",icon:"✅",title:"Lo que has hecho",sub:"He visto, has probado, hemos llegado",vocab:"acciones",dialogue:"Contar lo que pasó",quizCat:"frases",quizMode:"blank",quizFocus:"perfecto"},
  {id:"gram-condicional",icon:"🙏",title:"Pedir con cortesía",sub:"Me gustaría, podría y debería",vocab:"acciones",dialogue:"Restaurante: pedir y cambiar",quizCat:"frases",quizMode:"blank",quizFocus:"condicional"},
  {id:"gram-pasado-perfecto",icon:"⏪",title:"Lo que ya había pasado",sub:"Había llegado, había visto, ya había terminado",vocab:"acciones",dialogue:"Contar lo que pasó",quizCat:"frases",quizMode:"blank",quizFocus:"pasado-perfecto"},
  {id:"gram-futuro-perfecto",icon:"⏩",title:"Lo que habrá pasado",sub:"Reconoce habré llegado y habremos terminado",vocab:"acciones",dialogue:"Planes de fin de semana",quizCat:"frases",quizMode:"blank",quizFocus:"futuro-perfecto"},
  {id:"conversation-challenge",icon:"🎯",title:"Reto de conversación",sub:"Combina lectura, reacción rápida y una misión",vocab:"gustos",dialogue:"Uber: confirmar la recogida",quizCat:"all",quizMode:"conversation"},
  {id:"commands-repair",icon:"🗣️",title:"Pide, repite y aclara",sub:"Usa mandatos útiles sin sonar brusco",vocab:"direcciones",dialogue:"Comunicación: pedir y aclarar",quizCat:"mandatos",quizMode:"conversation"},
  {id:"uber-completo",icon:"🚗",title:"Un viaje completo en Uber",sub:"Recogida, dirección, tráfico y llegada",vocab:"direcciones",dialogue:"Uber: viaje completo",quizCat:"uber-real",quizMode:"conversation"},
  {id:"restaurante-real",icon:"🍽️",title:"Comer fuera",sub:"Pide, cambia algo, pregunta y paga",vocab:"comida",dialogue:"Restaurante: una comida completa",quizCat:"restaurante-real",quizMode:"conversation"},
  {id:"mercado-negociar",icon:"🛍️",title:"Mercado y precios",sub:"Compra comida, pregunta el precio y negocia",vocab:"comida",dialogue:"Mercado: comprar y negociar",quizCat:"mercado",quizMode:"conversation"},
  {id:"gerundios-actividades",icon:"🔄",title:"Lo que estás haciendo",sub:"Estoy cocinando, buscando y aprendiendo",vocab:"acciones",dialogue:"Cocinar y hablar de lo que haces",quizCat:"gerundios",quizMode:"blank",quizFocus:"gerundios"},
  {id:"social-salida",icon:"🤝",title:"Salir con amigos",sub:"Propón planes, acepta y cambia la hora",vocab:"gustos",dialogue:"Salir con amigos",quizCat:"social",quizMode:"conversation"},
  {id:"fiesta-gathering",icon:"🎉",title:"En una fiesta",sub:"Saluda, conversa y despídete con naturalidad",vocab:"colombianismos",dialogue:"En una fiesta",quizCat:"fiesta",quizMode:"conversation"},
  {id:"deportes-partido",icon:"⚽",title:"Ver el partido",sub:"Habla del marcador, el equipo y la emoción",vocab:"tv",dialogue:"Ver el partido",quizCat:"deportes",quizMode:"conversation"},
  {id:"oficina-real",icon:"🧑‍💼",title:"Una conversación en la oficina",sub:"Explica avances, retrasos y próximos pasos",vocab:"oficina",dialogue:"Oficina: proyecto y retraso",quizCat:"oficina-real",quizMode:"conversation"},
  {id:"aeropuerto-migracion",icon:"🛬",title:"Aeropuerto y migración",sub:"Pasaporte, motivo del viaje, estadía y maletas",vocab:"lugares",dialogue:"Aeropuerto y migración",quizCat:"aeropuerto",quizMode:"conversation"},
  {id:"bancos-pagos",icon:"💳",title:"Nequi, datáfono y pagos",sub:"Paga a una cuota, cuenta de ahorros y propina",vocab:"numeros",dialogue:"Pagos con datáfono y Nequi",quizCat:"bancos-pagos",quizMode:"conversation"},
  {id:"barberia",icon:"💈",title:"Peluquería y barbería",sub:"Pide un desvanecido, corte con tijera y barba",vocab:"cuerpo",dialogue:"En la barbería",quizCat:"barberia",quizMode:"conversation"},
  {id:"medico-urgencias",icon:"🩺",title:"Cita médica y síntomas",sub:"Explica qué te duele, alergias y fórmulas médicas",vocab:"cuerpo",dialogue:"Consulta médica y droguería",quizCat:"medico",quizMode:"conversation"},
  {id:"porteria-domicilios",icon:"🏢",title:"Portería, Rappi y edificio",sub:"Habla con el portero, recibe pedidos y reporta daños",vocab:"casa",dialogue:"Portería y domicilio Rappi",quizCat:"porteria",quizMode:"conversation"},
  {id:"direcciones-cuadras",icon:"🧭",title:"Cuadras, carreras y seguridad",sub:"Lee direcciones colombianas y camina seguro sin dar papaya",vocab:"direcciones",dialogue:"Direcciones, cuadras y seguridad",quizCat:"direcciones",quizMode:"conversation"},
  {id:"panaderia-jugos",icon:"🥐",title:"Panadería, café y jugos",sub:"Pide pandebono calientico, perico y jugos en agua o en leche",vocab:"comida",dialogue:"Panadería, tinto y jugos naturales",quizCat:"panaderia",quizMode:"conversation"},
  {id:"viajes-finca",icon:"🌄",title:"Buses, peajes y finca",sub:"Compra pasajes en la terminal y viaja en puente festivo",vocab:"lugares",dialogue:"Terminal, peajes y paseo de finca",quizCat:"viajes-finca",quizMode:"conversation"},
  {id:"empatia-reacciones",icon:"💛",title:"Empatía, reacciones y amistad",sub:"Usa ¡Qué embarrada!, ¡Qué pecado! y ¡Qué nota! al conversar",vocab:"colombianismos",dialogue:"Reacciones, empatía y amistad",quizCat:"empatia",quizMode:"conversation"},
  {id:"verbos-comodin",icon:"🔑",title:"Verbos comodín de Colombia",sub:"Usa dar, hacer, poner, echar, tocar y quedar como un local",vocab:"verbos",dialogue:"Verbos comodín en acción",quizCat:"comodin",quizMode:"conversation"},
  {id:"whatsapp-audios",icon:"📱",title:"WhatsApp, audios y citas",sub:"Manda notas de voz, usa ¿me colaboras? y confirma citas",vocab:"tecnologia",dialogue:"WhatsApp, notas de voz y citas",quizCat:"whatsapp",quizMode:"conversation"},
  {id:"arriendo-airbnb",icon:"🔑",title:"Arriendo, Airbnb y aseo",sub:"Pregunta por administración, calentador, lavadora y aseo",vocab:"casa",dialogue:"Arriendo, Airbnb, aseo y lavadora",quizCat:"arriendo",quizMode:"conversation"},
  {id:"gym-ciclovia",icon:"🚴",title:"Gimnasio, ciclovía y senderos",sub:"Túrnate en el gym, sal a la ciclovía y cuídate del soroche",vocab:"cuerpo",dialogue:"Gimnasio, ciclovía, senderos y soroche",quizCat:"gym-ciclovia",quizMode:"conversation"},
  {id:"citas-familia",icon:"❤️",title:"Citas, cumplidos y la familia",sub:"Invita a salir, haz cumplidos naturales y saluda a los papás",vocab:"familia",dialogue:"Citas, cumplidos y conocer a la familia",quizCat:"citas-familia",quizMode:"conversation"},
  {id:"almuerzo-corrientazo",icon:"🫓",title:"El corrientazo y las onces",sub:"Pide sopa, principio, proteína, sobremesa y las onces",vocab:"comida",dialogue:"Almuerzo ejecutivo, corrientazo y onces",quizCat:"corrientazo",quizMode:"conversation"},
  {id:"cajero-sim-tramites",icon:"🏦",title:"Cajero, SIM card y trámites",sub:"Saca efectivo seguro, activa tu SIM prepago y usa tu pasaporte",vocab:"numeros",dialogue:"Cajero automático, SIM card y trámites",quizCat:"cajero-sim",quizMode:"conversation"},
  {id:"puentes-rumba-cultura",icon:"🎉",title:"Puentes festivos, salsa y rumba",sub:"Arma plan de puente festivo, baila salsa y brinda con amigos",vocab:"colombianismos",dialogue:"Puentes festivos, salsa y rumba",quizCat:"puentes-rumba",quizMode:"conversation"},
  {id:"trampas-colombianas",icon:"🪤",title:"Trampas: cancelar, provocar y regalar",sub:"Domina los falsos amigos colombianos sin confundirte",vocab:"comida",dialogue:"Trampas colombianas: cancelar, provocar y qué pena",quizCat:"trampas",quizMode:"conversation"},
  {id:"estratos-barrios",icon:"🏘️",title:"Estratos, conjuntos y barrios",sub:"Entiende los estratos 1–6, los conjuntos cerrados y los recibos",vocab:"casa",dialogue:"Estratos, conjuntos cerrados y barrios",quizCat:"estratos",quizMode:"conversation"},
  {id:"odontologia-optica",icon:"🦷",title:"Odontología, óptica y EPS",sub:"Agenda limpieza dental, revisa una calza y pide gafas",vocab:"cuerpo",dialogue:"Odontología, óptica y medicina prepagada",quizCat:"odontologia",quizMode:"conversation"},
  {id:"migracion-bancos-ce",icon:"🛂",title:"Migración, cédula y bancos",sub:"Registra tu visa, saca tu cédula de extranjería y abre cuenta",vocab:"numeros",dialogue:"Migración Colombia, cédula de extranjería y bancos",quizCat:"migracion-ce",quizMode:"conversation"},
  {id:"san-juan-guajira",icon:"🪗",title:"San Juan del Cesar y Guajira",sub:"Habla con la familia en la terraza, prueba el friche y vive el vallenato",vocab:"familia",dialogue:"San Juan del Cesar, La Guajira y parranda vallenata",quizCat:"sanjuan-guajira",quizMode:"conversation"},
  {id:"seguridad-emergencias",icon:"🚨",title:"Seguridad, 123 y no dar papaya",sub:"Camina seguro, verifica placas, llama al 123 y reporta documentos",vocab:"direcciones",dialogue:"Seguridad, emergencias (123) y no dar papaya",quizCat:"seguridad-emergencias",quizMode:"conversation"},
  {id:"hogar-reparaciones",icon:"🔧",title:"Reparaciones, recibos y técnico",sub:"Sube los tacos de la luz, agenda técnico de internet y autoriza en portería",vocab:"casa",dialogue:"Reparaciones del hogar, recibos y técnico",quizCat:"hogar-reparaciones",quizMode:"conversation"},
  {id:"eventos-futbol-cultura",icon:"⚽",title:"Fútbol, conciertos y hacer vaca",sub:"Compra boletas, ponte la camiseta de la Selección y haz vaca con amigos",vocab:"colombianismos",dialogue:"Fútbol, conciertos, boletas y hacer vaca",quizCat:"eventos-futbol",quizMode:"conversation"}
];
LESSONS.forEach(lesson=>{
  if(typeof LESSON_META!=="undefined"&&LESSON_META[lesson.id])Object.assign(lesson,LESSON_META[lesson.id]);
  if(!lesson.difficulty)lesson.difficulty=/gram|pronombres|groserias/.test(lesson.id)?"Moderate":"Easy";
  if(!lesson.stage)lesson.stage=/gram|pronombres/.test(lesson.id)?"Build Sentences":"Daily Life";
  if(!lesson.readingId){const match=READINGS.find(r=>r.lesson===lesson.id)||READINGS.find(r=>r.lesson===lesson.vocab);lesson.readingId=match?match.id:READINGS[0].id;}
  if(!lesson.missionId){const match=CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.id)||CONVERSATION_MISSIONS.find(m=>m.lesson===lesson.vocab);lesson.missionId=match?match.id:CONVERSATION_MISSIONS[0].id;}
});
const LESSON_KEY="esco-lesson-progress-v1";
let lessonProgress={};
try{lessonProgress=JSON.parse(localStorage.getItem(LESSON_KEY)||"{}");}catch(e){lessonProgress={};}
function saveLessons(){try{localStorage.setItem(LESSON_KEY,JSON.stringify(lessonProgress));}catch(e){}}

/* Racha de días — practice-day streak */
const DAY_KEY="esco-days-v1";
let dayInfo={last:"",streak:0};
try{dayInfo=Object.assign(dayInfo,JSON.parse(localStorage.getItem(DAY_KEY)||"{}"));}catch(e){}
function localDayKey(date=new Date()){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function recordPracticeDay(){
  const today=localDayKey();
  if(dayInfo.last===today)return;
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  dayInfo.streak=dayInfo.last===localDayKey(yesterday)?Math.max(0,Number(dayInfo.streak)||0)+1:1;
  dayInfo.last=today;
  try{localStorage.setItem(DAY_KEY,JSON.stringify(dayInfo));}catch(e){}
}
function practiceStreak(){
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  return dayInfo.last===localDayKey()||dayInfo.last===localDayKey(yesterday)?Math.max(0,Number(dayInfo.streak)||0):0;
}
recordPracticeDay();

/* Lesson player state */
let lpLesson=null,lpSteps=[],lpStep=0,lpScore=0,lpQs=[],lpQi=0,lpAnswered=false,lpPracticed=new Set();
let lpFullMode=false,lpLadderStep=1,lpRoleSim=true,lpRoleTurn=0;
function lessonDialogue(lesson){return PHRASE_DIALOGUES.find(x=>x.title===lesson.dialogue);}
function lessonResponsePair(lesson,c){
  const d=lessonDialogue(lesson);
  const lines=d&&d.versions&&d.versions[0]&&d.versions[0].lines||[];
  for(let i=0;i<lines.length-1;i++){
    const q=lines[i],a=lines[i+1];
    if(q&&a&&q.es&&a.es&&(/\?\s*$/.test(q.es)||/\?\s*$/.test(q.en||"")))
      return {questionEs:q.es,questionEn:q.en||"Listen for the meaning, then respond.",questionTts:q.tts||q.es,answerEs:a.es,answerEn:a.en||"A natural response",answerTts:a.tts||a.es,alternate:null};
  }
  const mission=lesson&&lesson.missionId&&typeof CONVERSATION_MISSIONS!=="undefined"?CONVERSATION_MISSIONS.find(m=>m.id===lesson.missionId):null;
  const model=mission&&mission.models&&mission.models[0];
  if(model&&mission.prompt)return {questionEs:mission.prompt,questionEn:mission.scenario||"Answer the situation in your own words.",questionTts:mission.prompt,answerEs:model.es,answerEn:model.en||"A natural response",answerTts:model.tts||model.es,alternate:mission.models[1]||null};
  return null;
}
function getLessonLadder(lesson,c){
  if(typeof SENTENCE_LADDERS!=="undefined"&&SENTENCE_LADDERS[lesson.id])return SENTENCE_LADDERS[lesson.id];
  if(!c)return null;
  const sorted=(c.phrases||[]).slice().sort((a,b)=>a.es.length-b.es.length);
  const p1=sorted[0]||{es:c.goal.es,en:c.goal.en};
  const p2=sorted[Math.min(1,sorted.length-1)]||p1;
  const w0=(c.words&&c.words[0])||{es:p1.es,en:p1.en};
  const rest=(c.phrases||[]).filter(p=>p!==p1&&p!==p2).slice(0,3);
  const swaps=(rest.length?rest:(c.words||[]).slice(1,4)).map((item,i)=>({
    label:`Variation ${i+1}`,
    es:item.es,
    en:item.en
  }));
  return {
    title:"Start small and build into a full sentence",
    rungs:[
      {tag:"1. Anchor chunk",es:w0.es,en:w0.en},
      {tag:"2. Core sentence",es:p1.es,en:p1.en},
      {tag:"3. Expanded detail",es:p2.es,en:p2.en},
      {tag:"4. Full conversational turn",es:c.goal.es,en:c.goal.en}
    ],
    swaps
  };
}
function buildLessonSteps(lesson,c,full){
  if(!c)return ["fin"];
  const hasResp=!!lessonResponsePair(lesson,c);
  if(!full){
    return ["objetivo","estructura","palabras","escalera","escucha",...(hasResp?["respuesta"]:[]),"hablaA","mision","fin"];
  }
  return ["objetivo","estructura","palabras","escalera","escucha",...(hasResp?["respuesta"]:[]),"frases","matching","building","typing","hablaA","hablaB","pronun","lectura","quiz","mision","fin"];
}
function openLesson(lesson,fullMode){
  lpLesson=lesson;lpStep=0;lpScore=0;lpQi=0;lpAnswered=false;lpPracticed=new Set();
  lpLadderStep=1;lpRoleSim=true;lpRoleTurn=0;
  if(typeof fullMode==="boolean")lpFullMode=fullMode;
  const c=LESSON_CONTENT[lesson.id];
  lpSteps=buildLessonSteps(lesson,c,lpFullMode);
  if(c)buildLessonQuiz(lesson,c);
  renderLessonStep();
}
function switchLessonPathMode(full){
  if(!lpLesson||lpFullMode===full)return;
  const currentStepName=lpSteps[lpStep];
  lpFullMode=full;
  const c=LESSON_CONTENT[lpLesson.id];
  lpSteps=buildLessonSteps(lpLesson,c,lpFullMode);
  const idx=lpSteps.indexOf(currentStepName);
  lpStep=idx>=0?idx:0;
  renderLessonStep();
}
function openBonusStep(stepName){
  if(!lpLesson)return;
  lpFullMode=true;
  const c=LESSON_CONTENT[lpLesson.id];
  lpSteps=buildLessonSteps(lpLesson,c,true);
  const idx=lpSteps.indexOf(stepName);
  lpStep=idx>=0?idx:0;
  lpAnswered=false;
  renderLessonStep();
}
function buildLessonQuiz(lesson,c){
  lpQs=[];
  const shuffle=a=>a.slice().sort(()=>Math.random()-0.5);
  const pad=(opts,pool,n)=>{const s=new Set(opts);for(const p of shuffle(pool)){if(opts.length>=n)break;if(p&&!s.has(p)){s.add(p);opts.push(p);}}return opts;};
  const globalEs=aQ.filter(q=>!q.kind).map(q=>q.es);
  const globalEn=aQ.filter(q=>!q.kind).map(q=>q.en);
  shuffle(c.phrases).slice(0,2).forEach(p=>{
    const opts=pad([p.es,...shuffle(c.phrases.filter(x=>x.es!==p.es)).slice(0,3).map(x=>x.es)],globalEs,4);
    lpQs.push({label:"Say it, then pick the Spanish",prompt:p.en,answer:p.es,options:shuffle(opts),afterTts:p.es,revEs:p.es,revEn:p.en});
  });
  shuffle(c.words).slice(0,2).forEach(w=>{
    const opts=pad([w.es,...shuffle(c.words.filter(x=>x.es!==w.es)).slice(0,3).map(x=>x.es)],globalEs,4);
    lpQs.push({label:"¿Cómo se dice?",prompt:w.en,answer:w.es,options:shuffle(opts),afterTts:w.es.replace(/\.\.\./g,""),revEs:w.es,revEn:w.en});
  });
  const d=lessonDialogue(lesson);
  if(d){
    const lines=d.versions[0].lines;
    const L=lines[Math.floor(Math.random()*lines.length)];
    const opts=pad([L.en,...shuffle(lines.filter(x=>x.en!==L.en)).map(x=>x.en).slice(0,3)],globalEn,4);
    lpQs.push({label:"Listen and recognize",prompt:"🎧",answer:L.en,options:shuffle(opts),autoTts:L.tts,afterTts:L.tts,revEs:L.es,revEn:L.en});
  }
}
function lpEl(cls,html){const d=document.createElement("div");d.className=cls;if(html!==undefined)d.innerHTML=html;return d;}
function lpSpeakBtn(text,label){const b=document.createElement("button");b.type="button";b.className="lp-speak";b.textContent=label||"🔊 Escuchar";b.onclick=()=>speak(text,0.75);return b;}
function scrollAppTop(){
  const s=document.querySelector(".scroll");
  if(s)s.scrollTop=0;
  window.scrollTo(0,0);
}
function setLeccionesFocusMode(active){
  const page=document.getElementById("page-lecciones");
  if(page)page.classList.toggle("lesson-focus-mode",!!active);
  document.body.classList.toggle("lesson-focus-active",!!active);
  scrollAppTop();
}
function renderLessonStep(){
  const root=document.getElementById("lesson-list");if(!root||!lpLesson)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const c=LESSON_CONTENT[lpLesson.id];
  const step=lpSteps[lpStep];
  saveResume();
  const focusTop=lpEl("lp-focus-top");
  const back=document.createElement("button");back.type="button";back.className="lp-exit";
  back.innerHTML="<span class='lp-exit-icon'>×</span><span>Exit lesson</span>";
  back.onclick=()=>{lpLesson=null;renderLessons();};
  const focusProgress=lpEl("lp-focus-progress",`<span style="width:${Math.round(((lpStep+1)/lpSteps.length)*100)}%"></span>`);
  const focusStep=lpEl("lp-focus-step",`${lpStep+1}/${lpSteps.length}`);
  focusTop.append(back,focusProgress,focusStep);root.appendChild(focusTop);
  const modeBar=lpEl("lp-mode-switch");
  const coreBtn=document.createElement("button");coreBtn.type="button";coreBtn.className="lp-mode-btn"+(!lpFullMode?" active":"");coreBtn.textContent="⚡ Core";coreBtn.title="Speaking Core";coreBtn.onclick=()=>switchLessonPathMode(false);
  const fullBtn=document.createElement("button");fullBtn.type="button";fullBtn.className="lp-mode-btn"+(lpFullMode?" active":"");fullBtn.textContent="📚 Full";fullBtn.title="Full Practice";fullBtn.onclick=()=>switchLessonPathMode(true);
  modeBar.append(coreBtn,fullBtn);focusTop.appendChild(modeBar);
  const progress=lpEl("lp-progress-head");
  progress.innerHTML=`<span>${escapeVocabHtml(lpLesson.title||"Lesson")}</span><strong>Step ${lpStep+1} of ${lpSteps.length}</strong>`;
  root.appendChild(progress);
  root.appendChild(lpEl("lp-dots",lpSteps.map((s,i)=>`<span class="lp-dot${i===lpStep?" on":i<lpStep?" past":""}"></span>`).join("")));
  const card=lpEl("lp-card");
  const title=lpEl("lp-step-title");
  const body=lpEl("lp-body");
  card.appendChild(title);card.appendChild(body);root.appendChild(card);
  const nav=lpEl("lp-nav");root.appendChild(nav);
  const navBtn=(label,fn,primary)=>{const b=document.createElement("button");b.type="button";b.className="lp-nav-btn"+(primary?" primary":"");b.textContent=label;b.onclick=fn;nav.appendChild(b);return b;};
  const next=()=>{lpStep++;lpAnswered=false;lpRoleTurn=0;renderLessonStep();};
  const prev=()=>{if(lpStep>0){lpStep--;lpRoleTurn=0;renderLessonStep();}};
  if(step==="objetivo"){
    title.textContent="🎯 Goal — by the end you will be able to say:";
    const goalEs=lpEl("lp-goal-es",c.goal.es);
    goalEs.style.cursor="pointer";
    goalEs.onclick=()=>speak(c.goal.es,0.75);
    body.appendChild(goalEs);
    body.appendChild(lpEl("lp-goal-en",c.goal.en));
    const speedRow=lpEl("lp-speed-row");
    const slowGoal=lpSpeakBtn(c.goal.es,"🐢 Slow (0.6x)");slowGoal.classList.add("lp-speed-btn");slowGoal.onclick=()=>speak(c.goal.es,0.6);
    const natGoal=lpSpeakBtn(c.goal.es,"🗣️ Natural (0.85x)");natGoal.classList.add("lp-speed-btn");natGoal.onclick=()=>speak(c.goal.es,0.85);
    speedRow.append(slowGoal,natGoal);
    body.appendChild(speedRow);
    const stressBox=document.createElement("details");stressBox.className="starter-stress-box";
    if(effectiveLevel()==="starter")stressBox.open=true;
    stressBox.innerHTML=`<summary>🔤 Pronunciation stress guide (CAPS = stressed vowel)</summary><div class="starter-stress-guide">${escapeVocabHtml(spanishStressHint(c.goal.es))}</div>`;
    body.appendChild(stressBox);
    attachMic(body,c.goal.es);
    body.appendChild(lpEl("lp-hint","Tap 🐢 Slow first if needed, then 🗣️ Natural, and say it out loud twice."));
    navBtn("Start →",next,true);
  }
  else if(step==="escalera"){
    const ladder=getLessonLadder(lpLesson,c);
    title.textContent="🪜 Sentence Expansion Ladder — start small, build to full sentences";
    if(!ladder){body.appendChild(lpEl("lp-hint","No ladder available."));navBtn("‹ Back",prev);navBtn("Next →",next,true);}
    else{
      body.appendChild(lpEl("lp-activity-note",`${ladder.title} · Tap any unlocked layer to hear it, then say it out loud before adding the next piece.`));
      const rungsWrap=lpEl("ladder-rungs");
      const maxRung=Math.min(Math.max(lpLadderStep,1),ladder.rungs.length);
      ladder.rungs.forEach((rung,idx)=>{
        const unlocked=idx<maxRung;
        const row=lpEl("ladder-rung"+(unlocked?" unlocked":" locked")+(idx===maxRung-1?" active":""));
        if(unlocked){
          const cleanEs=rung.es.replace(/\.\.\.|…/g,"").trim();
          row.innerHTML=`<div class="ladder-rung-head"><span class="ladder-tag">${escapeVocabHtml(rung.tag)}</span></div><div class="ladder-es">${escapeVocabHtml(rung.es)}</div><div class="ladder-en">${escapeVocabHtml(rung.en)}</div><div class="ladder-actions"></div>`;
          row.style.cursor="pointer";
          row.onclick=e=>{if(!e.target.closest("button")){markPractice("phrases",cleanEs);speak(cleanEs,0.74);}};
          const act=row.querySelector(".ladder-actions");
          const hear=document.createElement("button");hear.type="button";hear.className="warmup-btn";hear.textContent="🔊 Hear";hear.onclick=e=>{e.stopPropagation();markPractice("phrases",cleanEs);speak(cleanEs,0.74);};
          act.appendChild(hear);
          attachMic(act,cleanEs,"phrases");
        }else{
          row.innerHTML=`<div class="ladder-rung-head"><span class="ladder-tag">${escapeVocabHtml(rung.tag)}</span><span class="ladder-lock">🔒 Tap below to add this layer</span></div>`;
        }
        rungsWrap.appendChild(row);
      });
      body.appendChild(rungsWrap);
      if(maxRung<ladder.rungs.length){
        const nextRung=ladder.rungs[maxRung];
        const choice=lpEl("ladder-choice");
        choice.appendChild(lpEl("ladder-choice-title","🧩 Choose the next building block"));
        choice.appendChild(lpEl("ladder-choice-help",`Layer ${maxRung+1} · ${escapeVocabHtml(nextRung.tag)}<br><span>${escapeVocabHtml(nextRung.en)}</span>`));
        const optionWrap=lpEl("ladder-choice-options");
        const candidates=[nextRung,...ladder.rungs.slice(maxRung+1),...(ladder.swaps||[])]
          .filter(Boolean)
          .filter((item,i,all)=>all.findIndex(x=>x.es===item.es)===i)
          .slice(0,4)
          .sort(()=>Math.random()-.5);
        const feedback=lpEl("ladder-choice-feedback"," ");
        let unlocked=false;
        const unlock=()=>{
          if(unlocked)return;
          unlocked=true;
          const nextText=nextRung.es.replace(/\.\.\.|…/g,"").trim();
          /* Keep this speech call inside the tap handler for iPhone Safari. */
          speak(nextText,0.74);
          lpLadderStep=maxRung+1;
          renderLessonStep();
        };
        candidates.forEach(item=>{
          const b=document.createElement("button");b.type="button";b.className="ladder-choice-btn";b.textContent=item.es;
          b.onclick=()=>{
            if(unlocked)return;
            if(item.es===nextRung.es){b.classList.add("correct");feedback.textContent="✅ Correct — now say the new sentence out loud.";unlock();}
            else{b.classList.add("wrong");feedback.textContent="Try again. Listen for the next layer in the ladder.";}
          };
          optionWrap.appendChild(b);
        });
        choice.appendChild(optionWrap);choice.appendChild(feedback);
        const skip=document.createElement("button");skip.type="button";skip.className="ladder-choice-skip";skip.textContent="Show the next layer";skip.onclick=unlock;choice.appendChild(skip);
        body.appendChild(choice);
      }else if(Array.isArray(ladder.swaps)&&ladder.swaps.length){
        const swapsBox=lpEl("ladder-swaps");
        swapsBox.innerHTML=`<div class="ladder-swaps-title">🔄 Rung 5 · Swap a piece and say 3 new sentences out loud</div><div class="ladder-swaps-sub">Tap any variation to hear it:</div>`;
        ladder.swaps.forEach(sw=>{
          const cleanEs=sw.es.replace(/\.\.\.|…/g,"").trim();
          const sRow=lpEl("ladder-swap-card",`<div class="ladder-swap-copy"><small>${escapeVocabHtml(sw.label)}</small><strong>${escapeVocabHtml(sw.es)}</strong><em>${escapeVocabHtml(sw.en)}</em></div><div class="ladder-actions"></div>`);
          sRow.style.cursor="pointer";
          sRow.onclick=e=>{if(!e.target.closest("button")){markPractice("phrases",cleanEs);speak(cleanEs,0.74);}};
          const act=sRow.querySelector(".ladder-actions");
          const hear=document.createElement("button");hear.type="button";hear.className="warmup-btn";hear.textContent="🔊";hear.onclick=e=>{e.stopPropagation();markPractice("phrases",cleanEs);speak(cleanEs,0.74);};
          act.appendChild(hear);attachMic(act,cleanEs,"phrases");
          swapsBox.appendChild(sRow);
        });
        body.appendChild(swapsBox);
      }
      navBtn("‹ Back",prev);navBtn("Next →",next,true);
    }
  }
  else if(step==="escucha"){
    title.textContent="👂 Listen to the conversation";
    const d=lessonDialogue(lpLesson);
    const lines=d?d.versions[0].lines:[];
    lines.forEach(L=>{
      const row=lpEl("lp-line","<strong>"+L.who+":</strong> "+L.es+"<div class='lp-line-en'>"+L.en+"</div>");
      row.onclick=()=>speak(L.tts,0.75);attachMic(row,L.tts);
      body.appendChild(row);
    });
    if(lines.length)body.appendChild(lpSpeakBtn(lines.map(l=>l.tts).join(". "),"▶️ Play all"));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="respuesta"){
    const pair=lessonResponsePair(lpLesson,c);
    title.textContent="🎧 Listen → respond — move from understanding to speaking";
    if(!pair){body.appendChild(lpEl("lp-hint","No response prompt is available for this lesson yet."));navBtn("‹ Back",prev);navBtn("Next →",next,true);}
    else{
      body.appendChild(lpEl("lp-activity-note","Listen for the idea, not every word. First use help, then hide the text and answer out loud in your own words."));
      const rail=lpEl("lp-response-rail");
      const stages=[["1","Slow + help"],["2","Normal speed"],["3","Respond"],["4","Compare"]];
      stages.forEach(([number,label])=>{const item=lpEl("lp-response-stage",`<span>${number}</span><small>${label}</small>`);rail.appendChild(item);});
      body.appendChild(rail);
      const promptBox=lpEl("lp-response-prompt");
      const promptEs=lpEl("lp-response-es",escapeVocabHtml(pair.questionEs));
      const promptEn=lpEl("lp-response-en",escapeVocabHtml(pair.questionEn));
      promptBox.append(promptEs,promptEn);body.appendChild(promptBox);
      const status=lpEl("lp-response-status","Step 1 · Listen slowly and notice the main idea.");status.setAttribute("aria-live","polite");body.appendChild(status);
      const actions=lpEl("lp-response-actions");
      const slow=document.createElement("button");slow.type="button";slow.className="lp-nav-btn";slow.textContent="🐢 Hear slowly";slow.onclick=()=>speak(pair.questionTts,0.55);
      const normal=document.createElement("button");normal.type="button";normal.className="lp-nav-btn";normal.textContent="🔊 Hear normally";normal.onclick=()=>speak(pair.questionTts,0.75);
      const hide=document.createElement("button");hide.type="button";hide.className="lp-nav-btn primary";hide.textContent="I understand the idea →";
      const help=document.createElement("button");help.type="button";help.className="lp-english-help";help.textContent="💡 Hide English help";
      help.setAttribute("aria-expanded","true");
      let stage=1,english=true,modelShown=false;
      const setStage=n=>{
        stage=n;
        rail.querySelectorAll(".lp-response-stage").forEach((item,i)=>item.classList.toggle("on",i<n));
        promptEs.hidden=n>=3;
        // Hide the translation when it is time to answer, but leave it
        // available through the English-help button if the learner needs it.
        if(n>=3)english=false;
        // Keep the English-help toggle authoritative at every response stage.
        // Stage 3 hides the Spanish prompt so the learner answers from memory,
        // but the learner must still be able to reveal the English help text.
        promptEn.hidden=!english;
        help.textContent=english?"🙈 Hide English help":"💡 Show English help";
        if(n===2)status.textContent="Step 2 · Hear it at normal speed. Then hide the text.";
        if(n===3)status.textContent="Step 3 · Answer out loud now. You can use any natural answer that fits.";
        if(n>=4)status.textContent="Step 4 · Compare with a natural model answer. Your wording can be different.";
      };
      hide.onclick=()=>{setStage(2);speak(pair.questionTts,0.75);};
      help.onclick=()=>{english=!english;promptEn.hidden=!english;help.textContent=english?"🙈 Hide English help":"💡 Show English help";help.setAttribute("aria-expanded",String(english));};
      actions.append(slow,normal,hide);body.appendChild(actions);body.appendChild(help);
      const responseActions=lpEl("lp-response-actions");
      const answerBtn=document.createElement("button");answerBtn.type="button";answerBtn.className="lp-nav-btn primary";answerBtn.textContent="🎙️ Record my response";answerBtn.disabled=true;
      answerBtn.onclick=()=>{setStage(3);openMicPanel(pair.answerEs);};
      const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn";reveal.textContent="Reveal model answer";reveal.disabled=true;
      reveal.onclick=()=>{modelShown=true;setStage(4);models.hidden=false;reveal.hidden=true;};
      responseActions.append(answerBtn,reveal);body.appendChild(responseActions);
      const models=lpEl("lp-response-models");models.hidden=true;
      const addModel=(model,label)=>{if(!model)return;const row=lpEl("lp-response-model",`<small>${label}</small><strong>${escapeVocabHtml(model.es)}</strong><em>${escapeVocabHtml(model.en||"")}</em>`);row.onclick=()=>speak(model.tts||model.es,0.75);attachMic(row,model.tts||model.es);models.appendChild(row);};
      addModel({es:pair.answerEs,en:pair.answerEn,tts:pair.answerTts},"Natural option 1");
      if(pair.alternate)addModel(pair.alternate,"Natural option 2");
      body.appendChild(models);
      const rating=lpEl("lp-response-rating");
      [["understood","✅ I understood"],["replay","🔁 Need replay"],["practice","🗣️ Need more practice"]].forEach(([kind,label])=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=()=>{rating.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===b));status.textContent=kind==="understood"?"Nice — keep answering without translating word by word.":kind==="replay"?"Replay slowly, then normally, and try again.":"Good choice. Repeat the model once, then answer again in your own words.";};rating.appendChild(b);});
      body.appendChild(rating);
      const unlock=()=>{answerBtn.disabled=false;reveal.disabled=false;};
      hide.addEventListener("click",unlock);normal.addEventListener("click",()=>{if(stage>=2)unlock();});
      setStage(1);speak(pair.questionTts,0.55);
      navBtn("‹ Back",prev);navBtn("Next →",next,true);
    }
  }
  else if(step==="palabras"){
    title.textContent="🔑 Key building blocks — tap, listen, repeat out loud";
    const grid=lpEl("lp-grid");
    c.words.forEach(w=>{
      const wc=lpEl("lp-word","<div class='lp-word-es'>"+w.es+"</div><div class='lp-word-en'>"+w.en+"</div><span>🔊</span>");
      wc.onclick=()=>{markPractice("phrases",w.es.replace(/\.\.\./g,""));speak(w.es.replace(/\.\.\./g,""),0.75);};attachMic(wc,w.es.replace(/\.\.\./g,""),"phrases");
      grid.appendChild(wc);
    });
    body.appendChild(grid);
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="frases"){
    title.textContent="🗣️ ¿Cómo se dice? — SAY it in Spanish out loud, then tap to check";
    c.phrases.forEach(p=>{
      const pc=lpEl("lp-prod","<div class='lp-prod-en'>"+p.en+"</div><div class='lp-prod-es lp-blur'>"+p.es+"</div>");
      pc.onclick=()=>{pc.querySelector(".lp-prod-es").classList.remove("lp-blur");speak(p.es,0.75);};attachMic(pc,p.es);
      body.appendChild(pc);
    });
    body.appendChild(lpEl("lp-hint","Say it YOURSELF out loud first. Then tap to hear and compare."));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="matching"){
    title.textContent="🧩 Match the meaning — build quick recognition";
    body.appendChild(lpEl("lp-activity-note","Tap an English meaning, then tap the matching Spanish chunk. Say each pair out loud."));
    const pairs=(c.words||[]).slice(0,4).map((w,i)=>({id:String(i),es:w.es,en:w.en}));
    const match=lpEl("lp-match");
    const status=lpEl("lp-match-status",`0 of ${pairs.length} matched`);match.appendChild(status);
    const board=lpEl("lp-match-grid");
    const enCol=lpEl("lp-match-col");enCol.appendChild(lpEl("lp-match-col-title","English"));
    const esCol=lpEl("lp-match-col");esCol.appendChild(lpEl("lp-match-col-title","Español"));
    const enButtons=[],esButtons=[];let selected=null;const matched=new Set();
    const redraw=()=>{
      const selectedId=selected&&selected.id,selectedSide=selected&&selected.side;
      enButtons.forEach(x=>{x.button.classList.toggle("matched",matched.has(x.id));x.button.classList.toggle("match-selected",selectedSide==="en"&&selectedId===x.id);x.button.disabled=matched.has(x.id);});
      esButtons.forEach(x=>{x.button.classList.toggle("matched",matched.has(x.id));x.button.classList.toggle("match-selected",selectedSide==="es"&&selectedId===x.id);x.button.disabled=matched.has(x.id);});
      status.textContent=`${matched.size} of ${pairs.length} matched`;
    };
    const message=lpEl("lp-match-feedback","Choose an English meaning first.");message.setAttribute("aria-live","polite");
    const setMatchMessage=(text,state)=>{message.textContent=text;message.dataset.state=state||"";};
    pairs.slice().sort(()=>Math.random()-0.5).forEach(p=>{const b=document.createElement("button");b.type="button";b.className="lp-match-btn";b.textContent=p.en;b.onclick=()=>{selected={id:p.id,side:"en"};setMatchMessage("Now tap the matching Spanish answer.","selected");redraw();};enButtons.push({id:p.id,button:b});enCol.appendChild(b);});
    pairs.slice().sort(()=>Math.random()-0.5).forEach(p=>{const b=document.createElement("button");b.type="button";b.className="lp-match-btn";b.textContent=p.es;b.onclick=()=>{if(!selected){setMatchMessage("Choose an English meaning first.","error");return;}const picked=selected.id;const enPair=pairs.find(x=>x.id===picked);if(selected.id===p.id){matched.add(p.id);clearSpeakingError(p.es);markPractice("phrases",p.es);selected=null;setMatchMessage(matched.size===pairs.length?"✅ Correct — all matched. Say each pair once more.":"✅ Correct match. Choose the next English meaning.","correct");}else{recordSpeakingError(p.es,"matching");selected=null;setMatchMessage("❌ Not a match. “"+(enPair?enPair.en:"That meaning")+"” goes with “"+(enPair?enPair.es:"the other Spanish phrase")+"”. Try again.","wrong");}redraw();};esButtons.push({id:p.id,button:b});esCol.appendChild(b);});
    board.append(enCol,esCol);match.append(message,board);body.appendChild(match);
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="building"){
    title.textContent="🧱 Build a sentence — then say it";
    const target=(c.phrases||[])[0];
    if(target){
      body.appendChild(lpEl("lp-activity-note","Read the English idea, tap the Spanish pieces in order, then check yourself. This is a bridge to speaking — not a typing test."));
      const builder=lpEl("lp-builder");builder.appendChild(lpEl("lp-builder-target",target.en));
      const output=lpEl("lp-builder-output","Your sentence will appear here…");const chips=lpEl("lp-builder-chips");const feedback=lpEl("lp-builder-feedback","");
      const pieces=target.es.trim().split(/\s+/).map((word,i)=>({word,i})).sort(()=>Math.random()-0.5);const chosen=[];
      const redraw=()=>{output.textContent=chosen.length?chosen.map(x=>x.word).join(" "):"Your sentence will appear here…";chips.querySelectorAll("button").forEach(b=>b.disabled=chosen.some(x=>String(x.i)===b.dataset.i));};
      pieces.forEach(p=>{const b=document.createElement("button");b.type="button";b.className="lp-builder-chip";b.textContent=p.word;b.dataset.i=String(p.i);b.onclick=()=>{chosen.push(p);redraw();};chips.appendChild(b);});
      const actions=lpEl("lp-builder-actions");const clear=document.createElement("button");clear.type="button";clear.className="lp-nav-btn";clear.textContent="↩ Clear";clear.onclick=()=>{chosen.length=0;feedback.textContent="";redraw();};
      const check=document.createElement("button");check.type="button";check.className="lp-nav-btn primary";check.textContent="Check sentence";check.onclick=()=>{const answer=chosen.map(x=>x.word).join(" ");const ok=normalizeQuizText(answer)===normalizeQuizText(target.es);if(ok){clearSpeakingError(target.es);feedback.textContent="✅ Correct — now say it out loud.";speak(target.es,0.75);}else{recordSpeakingError(target.es,"sentence builder");feedback.textContent="Keep adjusting the order, then try again. It is saved in your practice list.";}};
      const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn";hear.textContent="🔊 Hear model";hear.onclick=()=>speak(target.es,0.75);actions.append(clear,check,hear);builder.append(output,chips,feedback,actions);body.appendChild(builder);attachMic(body,target.es);
    }else body.appendChild(lpEl("lp-hint","No sentence is available for this lesson yet."));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="typing"){
    title.textContent="⌨️ Produce the Spanish — type it, then say it";
    const target=(c.phrases||[])[1]||(c.phrases||[])[0];
    if(target){
      body.appendChild(lpEl("lp-activity-note","Start from the English meaning. Type the Spanish sentence you would say, then compare and speak it."));
      const box=lpEl("lp-typing");box.appendChild(lpEl("lp-typing-prompt",target.en));
      const input=document.createElement("input");input.type="text";input.className="lp-typing-input";input.placeholder="Escribe en español…";input.autocomplete="off";input.autocapitalize="sentences";
      const actions=lpEl("lp-typing-actions");const check=document.createElement("button");check.type="button";check.className="lp-nav-btn primary";check.textContent="Check answer";const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn";hear.textContent="🔊 Hear model";hear.onclick=()=>speak(target.es,0.75);
      const feedback=lpEl("lp-typing-feedback","");check.onclick=()=>{const ok=normalizeQuizText(input.value)===normalizeQuizText(target.es);if(ok){clearSpeakingError(target.es);feedback.innerHTML="✅ Correct — say it again without reading.";speak(target.es,0.75);}else{recordSpeakingError(target.es,"typed production");feedback.innerHTML=`Keep practicing. Model: <strong>${escapeVocabHtml(target.es)}</strong><small>Saved in your practice list.</small>`;}attachMic(feedback,target.es);};actions.append(check,hear);box.append(input,actions,feedback);body.appendChild(box);
    }else body.appendChild(lpEl("lp-hint","No typing prompt is available for this lesson yet."));
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="estructura"){
    title.textContent="🧱 Understand the pattern first — how sentences snap together";
    const ids=lpLesson.guideIds||["estructura"];
    ids.map(id=>SPEAKING_GUIDE.find(g=>g.id===id)).filter(Boolean).forEach(g=>{
      const box=lpEl("lp-structure-guide");
      box.innerHTML=`<div class="lp-structure-title">${escapeVocabHtml(g.title)}</div><div class="lp-structure-formula">${escapeVocabHtml(g.formula)}</div><div class="lp-structure-text">${escapeVocabHtml(g.explain)}</div><div class="lp-structure-mistake">⚠️ ${escapeVocabHtml(g.mistake)}</div>`;
      (g.examples||[]).forEach(ex=>{const row=lpEl("lp-structure-example",`<strong>${escapeVocabHtml(ex.es)}</strong><small>${escapeVocabHtml(ex.en)}</small>`);row.onclick=()=>speak(ex.tts||ex.es,0.75);attachMic(row,ex.tts||ex.es);box.appendChild(row);});
      box.appendChild(lpEl("lp-hint","Speaking drill: "+g.exercise));body.appendChild(box);
    });
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="hablaA"||step==="hablaB"){
    const who=step==="hablaA"?"B":"A"; /* Default to B in hablaA so Person A speaks first! */
    title.textContent=`🎭 Roleplay — you are Person ${who}`;
    const simControls=lpEl("lp-role-controls");
    const simBtn=document.createElement("button");simBtn.type="button";simBtn.className="lp-mode-btn"+(lpRoleSim?" active":"");simBtn.textContent="💬 Turn-by-Turn Simulator";
    simBtn.onclick=()=>{lpRoleSim=true;lpRoleTurn=0;renderLessonStep();};
    const scriptBtn=document.createElement("button");scriptBtn.type="button";scriptBtn.className="lp-mode-btn"+(!lpRoleSim?" active":"");scriptBtn.textContent="📜 Full Script";
    scriptBtn.onclick=()=>{lpRoleSim=false;renderLessonStep();};
    const switchRoleBtn=document.createElement("button");switchRoleBtn.type="button";switchRoleBtn.className="lp-mode-btn";switchRoleBtn.textContent=`🔄 Switch to Person ${who==="A"?"B":"A"}`;
    switchRoleBtn.onclick=()=>{lpSteps[lpStep]=step==="hablaA"?"hablaB":"hablaA";lpRoleTurn=0;renderLessonStep();};
    simControls.append(simBtn,scriptBtn,switchRoleBtn);body.appendChild(simControls);

    const d=lessonDialogue(lpLesson);
    const lines=d?d.versions[0].lines:[];
    if(lpRoleSim&&lines.length){
      const currentIdx=Math.min(lpRoleTurn,lines.length-1);
      const historyWrap=lpEl("lp-sim-history");
      for(let i=0;i<=currentIdx;i++){
        const L=lines[i];
        const isMe=L.who===who;
        const isCurrent=i===currentIdx;
        const row=lpEl("lp-chat-message"+(isMe?" me":" partner")+(isCurrent?" current":""));
        if(isMe&&isCurrent){
          row.innerHTML=`<div class="lp-chat-avatar">👤</div><div class="lp-chat-bubble"><div class="lp-sim-prompt-tag">🎯 YOUR TURN · Person ${who}</div><div class="lp-sim-intent">“${escapeVocabHtml(L.en)}”</div><div class="lp-line-es lp-blur">${escapeVocabHtml(L.es)}</div><div class="lp-sim-actions"></div></div>`;
          const act=row.querySelector(".lp-sim-actions");
          const revealBtn=document.createElement("button");revealBtn.type="button";revealBtn.className="warmup-btn";revealBtn.textContent="👀 Reveal & Hear Spanish";
          revealBtn.onclick=e=>{
            e.stopPropagation();
            row.querySelector(".lp-line-es").classList.remove("lp-blur");
            markPractice("phrases",L.es);
            speak(L.tts,0.75);
          };
          act.appendChild(revealBtn);
          attachMic(act,L.tts,"phrases");
        }else{
          row.innerHTML=`<div class="lp-chat-avatar">${L.who===who?"👤":"🗣️"}</div><div class="lp-chat-bubble"><strong>${L.who===who?"You":"Partner"}</strong><span class='lp-line-es'>${escapeVocabHtml(L.es)}</span><div class='lp-line-en'>${escapeVocabHtml(L.en)}</div></div>`;
          row.querySelector(".lp-chat-bubble").onclick=()=>speak(L.tts,0.75);
          attachMic(row,L.tts,"phrases");
        }
        historyWrap.appendChild(row);
      }
      body.appendChild(historyWrap);
      const curLine=lines[currentIdx];
      const turnNav=lpEl("lp-sim-turn-nav");
      if(currentIdx<lines.length-1){
        const nextTurn=document.createElement("button");nextTurn.type="button";nextTurn.className="lp-nav-btn primary";
        nextTurn.textContent=curLine.who===who?"✅ I said my line — next turn →":"🔊 Continue to next turn →";
        nextTurn.onclick=()=>{
          lpRoleTurn=currentIdx+1;
          const nl=lines[lpRoleTurn];
          renderLessonStep();
          if(nl&&nl.who!==who)speak(nl.tts,0.75);
        };
        turnNav.appendChild(nextTurn);
      }else{
        const restartSim=document.createElement("button");restartSim.type="button";restartSim.className="lp-nav-btn";
        restartSim.textContent="🔁 Replay conversation";
        restartSim.onclick=()=>{lpRoleTurn=0;renderLessonStep();};
        turnNav.appendChild(restartSim);
      }
      body.appendChild(turnNav);
    }else{
      const help=document.createElement("button");help.type="button";help.className="lp-english-help";help.textContent="💡 Show English help";help.setAttribute("aria-expanded","false");let englishShown=false;
      help.onclick=()=>{englishShown=!englishShown;body.querySelectorAll(".lp-line-en").forEach(x=>x.hidden=!englishShown);help.textContent=englishShown?"🙈 Hide English help":"💡 Show English help";help.setAttribute("aria-expanded",String(englishShown));};body.appendChild(help);
      lines.forEach(L=>{
        const hidden=L.who===who;
        const row=lpEl("lp-line"+(hidden?" lp-me":""),"<strong>"+L.who+":</strong> <span class='lp-line-es"+(hidden?" lp-blur":"")+"'>"+L.es+"</span><div class='lp-line-en' hidden>"+L.en+"</div>");
        row.onclick=()=>{
          const esEl=row.querySelector(".lp-line-es");
          if(esEl.classList.contains("lp-blur"))esEl.classList.remove("lp-blur");
          speak(L.tts,0.75);
        };
        attachMic(row,L.tts);
        body.appendChild(row);
      });
    }
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="pronun"){
    title.textContent="🎙️ Pronunciation — say each phrase, then record & compare";
    const items=[{es:c.goal.es,en:c.goal.en},...c.phrases];
    items.forEach(p=>{
      const done=lpPracticed.has(p.es);
      const row=lpEl("pronun-row"+(done?" done":""));
      row.dataset.mt=p.es;
      row.innerHTML="<div class='pronun-check'>"+(done?"✅":"⭕")+"</div><div class='pronun-copy'><div class='pronun-es'>"+p.es+"</div><div class='pronun-en'>"+p.en+"</div></div>";
      const mb=document.createElement("button");mb.type="button";mb.className="pronun-mic";mb.textContent="🎙️";
      mb.onclick=e=>{e.stopPropagation();openMicPanel(p.es);};
      row.appendChild(mb);
      row.onclick=()=>speak(p.es,0.75);
      body.appendChild(row);
    });
    body.appendChild(lpEl("lp-hint","Tap the mic on each phrase: record yourself, compare with the model. Green checks show what you practiced. You can continue anytime."));
    navBtn("Back",prev);navBtn("Next",next,true);
  }
  else if(step==="quiz"){
    const q=lpQs[lpQi];
    title.textContent="🧪 Mini-quiz "+(lpQi+1)+" of "+lpQs.length+" — "+q.label;
    body.appendChild(lpEl("lp-quiz-prompt",q.prompt));
    if(q.autoTts)speak(q.autoTts,0.7);
    const fb=lpEl("lp-quiz-fb","");fb.classList.add("feedback-tray");
    const grid=lpEl("lp-grid lp-quiz-grid");
    q.options.forEach(opt=>{
      const b=document.createElement("button");b.type="button";b.className="lp-opt";b.textContent=opt;
      b.onclick=()=>{
        if(lpAnswered)return;lpAnswered=true;
        if(quizAnswerMatches(q,opt)){b.classList.add("correct");clearSpeakingError(q.revEs);lpScore++;fb.innerHTML="✅ ¡Correcto! <div class='lp-reveal'>📖 "+q.revEs+" — "+q.revEn+"</div>";speak(q.afterTts,0.75);}
        else{b.classList.add("wrong");recordSpeakingError(q.revEs,"lesson quiz");grid.querySelectorAll(".lp-opt").forEach(x=>{if(x.textContent===q.answer)x.classList.add("reveal");});fb.innerHTML="❌ Not quite. <div class='lp-reveal'>📖 "+q.revEs+" — "+q.revEn+"</div><small>Saved in your practice list.</small>";}
        fb.classList.add("visible");
        attachMic(fb,q.revEs);
        navBtn(lpQi<lpQs.length-1?"Next question →":"Finish →",()=>{
          if(lpQi<lpQs.length-1){lpQi++;lpAnswered=false;renderLessonStep();}
          else{lpStep++;lpAnswered=false;renderLessonStep();}
        },true);
      };
      grid.appendChild(b);
    });
    body.appendChild(grid);body.appendChild(fb);
  }
  else if(step==="lectura"){
    const reading=READINGS.find(r=>r.id===lpLesson.readingId)||READINGS.find(r=>r.lesson===lpLesson.id)||READINGS[0];
    title.textContent="📖 Read aloud for meaning";
    body.appendChild(lpEl("lp-hint",`${reading.title} · Read it aloud once, then listen and shadow it at your own pace.`));
    (reading.lines||[]).forEach(line=>{const row=lpEl("lp-line",`<span>${escapeVocabHtml(line.es)}</span><div class='lp-line-en'>${escapeVocabHtml(line.en)}</div>`);row.onclick=()=>speak(line.tts||line.es,0.75);attachMic(row,line.tts||line.es);body.appendChild(row);});
    const open=document.createElement("button");open.type="button";open.className="lp-nav-btn primary";open.textContent="📖 Read & shadow full passage";open.onclick=()=>renderReading(reading);body.appendChild(open);
    navBtn("‹ Back",prev);navBtn("Next →",next,true);
  }
  else if(step==="mision"){
    const mission=CONVERSATION_MISSIONS.find(m=>m.id===lpLesson.missionId)||CONVERSATION_MISSIONS.find(m=>m.lesson===lpLesson.id)||CONVERSATION_MISSIONS[0];
    title.textContent="🗣️ Speaking mission — answer before looking";
    body.appendChild(lpEl("mission-title",mission.title));body.appendChild(lpEl("mission-scenario",mission.scenario));body.appendChild(lpEl("mission-prompt",mission.prompt));
    /* v39: optional sentence builder. It gives a learner a bridge from
       knowing words to producing a complete response, without replacing the
       open-ended speaking mission. */
    const target=(mission.models&&mission.models[0]&&mission.models[0].es)||"";
    if(target){
      const builder=lpEl("mission-builder");
      builder.appendChild(lpEl("mission-builder-title","🧩 Optional: build the sentence first"));
      builder.appendChild(lpEl("mission-builder-help","Tap the pieces in order, then say your sentence out loud. This is a speaking scaffold, not a spelling test."));
      const builtBox=lpEl("mission-built","Your sentence will appear here…");
      const chipBox=lpEl("mission-chips");
      const words=target.trim().split(/\s+/).map((word,i)=>({word,i})).sort(()=>Math.random()-0.5);
      const built=[];
      const redraw=()=>{
        builtBox.textContent=built.length?built.map(x=>x.word).join(" "):"Your sentence will appear here…";
        chipBox.querySelectorAll("button").forEach(b=>b.disabled=built.some(x=>String(x.i)===b.dataset.i));
      };
      words.forEach(({word,i})=>{const b=document.createElement("button");b.type="button";b.className="mission-chip";b.textContent=word;b.dataset.i=String(i);b.onclick=()=>{built.push({word,i});redraw();};chipBox.appendChild(b);});
      builder.appendChild(builtBox);builder.appendChild(chipBox);
      const builderActions=lpEl("mission-builder-actions");
      const clear=document.createElement("button");clear.type="button";clear.className="lp-nav-btn";clear.textContent="↩ Clear";clear.onclick=()=>{built.length=0;redraw();};
      const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn";hear.textContent="🔊 Hear model";hear.onclick=()=>speak(target,0.75);
      const record=document.createElement("button");record.type="button";record.className="lp-nav-btn";record.textContent="🎙️ Compare";record.onclick=()=>openMicPanel(built.length?built.map(x=>x.word).join(" "):target);
      builderActions.append(clear,hear,record);builder.appendChild(builderActions);body.appendChild(builder);
    }
    const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn primary";reveal.textContent="👀 Reveal 2 natural answers";
    const models=lpEl("mission-models");models.hidden=true;
    reveal.onclick=()=>{models.hidden=false;reveal.remove();};body.appendChild(reveal);
    (mission.models||[]).forEach(m=>{const row=lpEl("mission-model",`<div class='mission-model-label'>Natural option</div><div class='mission-model-es'>${escapeVocabHtml(m.es)}</div><div class='mission-model-en'>${escapeVocabHtml(m.en)}</div>`);row.onclick=()=>speak(m.tts||m.es,0.75);attachMic(row,m.tts||m.es);models.appendChild(row);});
    body.appendChild(models);
    const done=document.createElement("button");done.type="button";done.className="lesson-start";done.textContent="✅ I answered out loud";done.onclick=()=>{missionProgress[mission.id]=true;saveMissions();done.textContent="✅ Saved — practice it again anytime";};body.appendChild(done);
    navBtn("‹ Back",prev);navBtn("Finish lesson →",next,true);
  }
  else{
    title.textContent="🎉 Lesson complete!";
    const completion=lpEl("lp-completion-hero");
    completion.innerHTML=`<div class="lp-completion-emoji">🎉</div><strong>¡Muy bien!</strong><span>You completed this lesson.</span><div class="lp-completion-stats"><span><b>${lpPracticed.size}</b><small>spoken</small></span><span><b>${lpFullMode&&lpQs.length?`${lpScore}/${lpQs.length}`:"—"}</b><small>quiz</small></span><span><b>🔥</b><small>keep going</small></span></div>`;
    body.appendChild(completion);
    if(lpFullMode&&lpQs.length)body.appendChild(lpEl("lp-goal-es","Mini-quiz: "+lpScore+" of "+lpQs.length));
    if(c){body.appendChild(lpEl("lp-hint","You can now say:"));body.appendChild(lpEl("lp-goal-es",c.goal.es));body.appendChild(lpSpeakBtn(c.goal.es));attachMic(body,c.goal.es);}
    lessonProgress[lpLesson.id]=true;saveLessons();
    if(c){
      const bonus=lpEl("lp-explore","<div class='lp-hint'>➕ Optional bonus drills for this lesson:</div><div class='lp-bonus-grid'></div>");
      const bGrid=bonus.querySelector(".lp-bonus-grid");
      [
        ["🗣️ Flash phrases","frases"],
        ["🧩 Match pairs","matching"],
        ["🧱 Word chips","building"],
        ["⌨️ Type Spanish","typing"],
        ["🎙️ Pronunciation","pronun"],
        ["📖 Reading","lectura"],
        ["🧪 Mini-quiz","quiz"]
      ].forEach(([lbl,st])=>{
        const b=document.createElement("button");b.type="button";b.className="lp-nav-btn";b.textContent=lbl;b.onclick=()=>openBonusStep(st);bGrid.appendChild(b);
      });
      body.appendChild(bonus);
    }
    const explore=lpEl("lp-explore","<div class='lp-hint'>Explore more:</div>");
    const mk=(label,fn)=>{const b=document.createElement("button");b.type="button";b.className="lp-nav-btn";b.textContent=label;b.onclick=fn;explore.appendChild(b);};
    mk("📚 Vocabulary",()=>{showPage("vocab");sCat(lpLesson.vocab);});
    mk("📖 Read & shadow",()=>{const reading=READINGS.find(r=>r.id===lpLesson.readingId)||READINGS.find(r=>r.lesson===lpLesson.id)||READINGS[0];renderReading(reading);});
    mk("💬 Full conversation",()=>{showPage("frases");const d=lessonDialogue(lpLesson);if(d)renderFraseDialogue(d);});
    mk("🧪 Full quiz",()=>{showPage("quiz");qMissedOnly=false;qCat=lpLesson.quizCat;qMode=lpLesson.quizMode||"mixed";qFocus=lpLesson.quizFocus||"all";repasoLeft=0;resetQuizRound();syncQuizControls();nQ();});
    body.appendChild(explore);
    navBtn("Back to lessons",()=>{lpLesson=null;renderLessons();},true);
  }
}
/* ═══════════════════════════════════════════════════════════════════════════
   Lesson Resume (v21) — pick up exactly where you left off
   ═══════════════════════════════════════════════════════════════════════════ */
const RESUME_KEY="esco-lesson-resume-v1";
function saveResume(){
  try{
    if(lpLesson&&lpSteps[lpStep]&&lpSteps[lpStep]!=="fin")
      localStorage.setItem(RESUME_KEY,JSON.stringify({id:lpLesson.id,step:lpStep,qi:lpQi,score:lpScore}));
    else localStorage.removeItem(RESUME_KEY);
  }catch(e){}
}
function loadResume(){
  try{const r=JSON.parse(localStorage.getItem(RESUME_KEY)||"null");return r&&r.id?r:null;}catch(e){return null;}
}
function openLessonAt(lesson,step,qi,score){
  openLesson(lesson);
  lpStep=Math.min(Math.max(step|0,0),lpSteps.length-1);
  lpQi=Math.min(Math.max(qi|0,0),Math.max(lpQs.length-1,0));
  lpScore=Math.max(score|0,0);
  renderLessonStep();
}

/* ═══════════════════════════════════════════════════════════════════════════
   Reacción Rápida (v21) — answer OUT LOUD under mild time pressure.
   Question bank auto-built from every question→answer pair in the conversations.
   Forgiving by design: reveal early anytime, retry anytime, no grading.
   ═══════════════════════════════════════════════════════════════════════════ */
const RR_BANK=[];
(function(){
  const seen=new Set();
  PHRASE_DIALOGUES.forEach(d=>{(d.versions||[]).forEach(v=>{
    for(let i=0;i<v.lines.length-1;i++){
      const q=v.lines[i],ans=v.lines[i+1];
      if(/\?\s*$/.test(q.es)&&ans&&ans.es&&!seen.has(q.es)){
        seen.add(q.es);
        const combined=`${q.es} ${ans.es}`;
        const words=combined.trim().split(/\s+/).length;
        const clauses=(combined.match(/[,;:]/g)||[]).length;
        const level=words<=14&&clauses===0?"easy":(words<=24&&clauses<=1?"moderate":"challenge");
        RR_BANK.push({q:q.tts||q.es,qEs:q.es,qEn:q.en,aEs:ans.es,aTts:ans.tts||ans.es,aEn:ans.en,level});
      }
    }
  });});
})();
/* v79: Colombian service-counter reflexes. These are short, high-frequency
   prompts learners hear at shops, banks, restaurants, and on the street. */
const RR_SERVICE_REFLEXES=[
  {q:"¿Con bolsa?",qEs:"¿Con bolsa?",qEn:"With a bag?",aEs:"Sí, por favor.",aTts:"Sí, por favor.",aEn:"Yes, please.",level:"easy",service:true},
  {q:"¿Desea incluir el servicio?",qEs:"¿Desea incluir el servicio?",qEn:"Would you like to include the service charge?",aEs:"Sí, agréguelo, por favor.",aTts:"Sí, agréguelo, por favor.",aEn:"Yes, please add it.",level:"moderate",service:true},
  {q:"¿A cuántas cuotas?",qEs:"¿A cuántas cuotas?",qEn:"How many installments?",aEs:"A una cuota, por favor.",aTts:"A una cuota, por favor.",aEn:"One installment, please.",level:"easy",service:true},
  {q:"¿Ahorros o corriente?",qEs:"¿Ahorros o corriente?",qEn:"Savings or checking?",aEs:"Ahorros, por favor.",aTts:"Ahorros, por favor.",aEn:"Savings, please.",level:"easy",service:true},
  {q:"¿Me confirma la dirección?",qEs:"¿Me confirma la dirección?",qEn:"Can you confirm the address?",aEs:"Sí, es la de la calle diez con carrera séptima.",aTts:"Sí, es la de la calle diez con carrera séptima.",aEn:"Yes, it is the one at Calle 10 and Carrera 7.",level:"moderate",service:true},
  {q:"¿Para llevar o para comer aquí?",qEs:"¿Para llevar o para comer aquí?",qEn:"To go or to eat here?",aEs:"Para llevar, por favor.",aTts:"Para llevar, por favor.",aEn:"To go, please.",level:"easy",service:true},
  {q:"¿Tiene sencillo?",qEs:"¿Tiene sencillo?",qEn:"Do you have smaller change?",aEs:"Sí, tengo un billete de diez mil.",aTts:"Sí, tengo un billete de diez mil.",aEn:"Yes, I have a ten-thousand-peso bill.",level:"moderate",service:true},
  {q:"¿Le ayudo con algo más?",qEs:"¿Le ayudo con algo más?",qEn:"Can I help you with anything else?",aEs:"No, gracias. Eso es todo.",aTts:"No, gracias. Eso es todo.",aEn:"No, thank you. That is all.",level:"easy",service:true},
  {q:"¿Necesita factura electrónica o consumidor final?",qEs:"¿Necesita factura electrónica o consumidor final?",qEn:"Do you need an electronic tax invoice or final consumer?",aEs:"Consumidor final, por favor.",aTts:"Consumidor final, por favor.",aEn:"Final consumer, please.",level:"easy",service:true},
  {q:"¿Cuál es el motivo de su viaje a Colombia?",qEs:"¿Cuál es el motivo de su viaje a Colombia?",qEn:"What is the purpose of your trip to Colombia?",aEs:"Vengo por turismo durante dos semanas.",aTts:"Vengo por turismo durante dos semanas.",aEn:"I am coming for tourism for two weeks.",level:"moderate",service:true},
  {q:"¿Para qué apartamento va?",qEs:"¿Para qué apartamento va?",qEn:"Which apartment are you going to?",aEs:"Buenas, voy para el apartamento quinientos dos.",aTts:"Buenas, voy para el apartamento quinientos dos.",aEn:"Hi, I am going to apartment 502.",level:"easy",service:true},
  {q:"¿Autoriza la subida del domiciliario?",qEs:"¿Autoriza la subida del domiciliario?",qEn:"Do you authorize the delivery driver to come up?",aEs:"Sí, vecino, déjelo subir por favor.",aTts:"Sí, vecino, déjelo subir por favor.",aEn:"Yes, doorman, please let him come up.",level:"moderate",service:true},
  {q:"¿Cómo se lo vamos a cortar hoy?",qEs:"¿Cómo se lo vamos a cortar hoy?",qEn:"How are we going to cut your hair today?",aEs:"Bajito a los lados con la dos y arriba con tijera.",aTts:"Bajito a los lados con la dos y arriba con tijera.",aEn:"Low on the sides with a #2 and scissors on top.",level:"moderate",service:true},
  {q:"¿En efectivo, tarjeta o transferencia por Nequi?",qEs:"¿En efectivo, tarjeta o transferencia por Nequi?",qEn:"In cash, card, or Nequi transfer?",aEs:"Con tarjeta en el datáfono, por favor.",aTts:"Con tarjeta en el datáfono, por favor.",aEn:"By card on the terminal, please.",level:"easy",service:true},
  {q:"¿Es alérgico a algún medicamento?",qEs:"¿Es alérgico a algún medicamento?",qEn:"Are you allergic to any medication?",aEs:"No, no soy alérgico a ningún medicamento.",aTts:"No, no soy alérgico a ningún medicamento.",aEn:"No, I am not allergic to any medication.",level:"moderate",service:true},
  {q:"¿Lo quiere con azúcar o sin azúcar?",qEs:"¿Lo quiere con azúcar o sin azúcar?",qEn:"Do you want it with sugar or without sugar?",aEs:"Sin azúcar, por favor.",aTts:"Sin azúcar, por favor.",aEn:"Without sugar, please.",level:"easy",service:true},
  {q:"¿Con copia del recibo?",qEs:"¿Con copia del recibo?",qEn:"Would you like a copy of the card receipt?",aEs:"No, gracias, sin copia está bien.",aTts:"No, gracias, sin copia está bien.",aEn:"No, thank you, without a copy is fine.",level:"easy",service:true},
  {q:"¿El jugo lo quiere en agua o en leche?",qEs:"¿El jugo lo quiere en agua o en leche?",qEn:"Do you want the juice in water or in milk?",aEs:"En agua y bajito de azúcar, por favor.",aTts:"En agua y bajito de azúcar, por favor.",aEn:"In water and low on sugar, please.",level:"easy",service:true},
  {q:"¿Los pandebonos son para comer acá o para llevar?",qEs:"¿Los pandebonos son para comer acá o para llevar?",qEn:"Are the pandebonos to eat here or to go?",aEs:"Para comer acá, calienticos por favor.",aTts:"Para comer acá, calienticos por favor.",aEn:"To eat here, warm please.",level:"easy",service:true},
  {q:"¿Por cuál plataforma sale el bus?",qEs:"¿Por cuál plataforma sale el bus?",qEn:"From which platform does the bus leave?",aEs:"Sale en diez minutos por la plataforma cuatro.",aTts:"Sale en diez minutos por la plataforma cuatro.",aEn:"It leaves in ten minutes from platform four.",level:"moderate",service:true},
  {q:"¿Este sector es tranquilo para caminar de noche?",qEs:"¿Este sector es tranquilo para caminar de noche?",qEn:"Is this area safe to walk at night?",aEs:"Sí, por la avenida es tranquilo, pero sin dar papaya.",aTts:"Sí, por la avenida es tranquilo, pero sin dar papaya.",aEn:"Yes, on the avenue it's calm, just don't flash valuables.",level:"moderate",service:true},
  {q:"¿Te queda bien si nos vemos mañana a las diez?",qEs:"¿Te queda bien si nos vemos mañana a las diez?",qEn:"Does it work for you if we meet tomorrow at ten?",aEs:"¡De una! Así quedamos; me confirmas por WhatsApp.",aTts:"¡De una! Así quedamos; me confirmas por WhatsApp.",aEn:"For sure! It's a plan; confirm with me on WhatsApp.",level:"easy",service:true},
  {q:"¿Cuántas series te faltan? ¿Nos turnamos en la máquina?",qEs:"¿Cuántas series te faltan? ¿Nos turnamos en la máquina?",qEn:"How many sets do you have left? Shall we take turns on the machine?",aEs:"Claro, hágale, solo me quedan dos series.",aTts:"Claro, hágale, solo me quedan dos series.",aEn:"Sure, go ahead, I only have two sets left.",level:"easy",service:true},
  {q:"¿En el arriendo están incluidos la administración y los servicios?",qEs:"¿En el arriendo están incluidos la administración y los servicios?",qEn:"Are the HOA fee and utilities included in the rent?",aEs:"Sí, todo está incluido y el calentador es a gas.",aTts:"Sí, todo está incluido y el calentador es a gas.",aEn:"Yes, everything is included and the water heater is gas.",level:"moderate",service:true},
  {q:"¿Será que me colaboras enviándome la ubicación por acá?",qEs:"¿Será que me colaboras enviándome la ubicación por acá?",qEn:"Could you help me out by sending me the location here?",aEs:"Claro que sí, ya mismo te la mando por WhatsApp.",aTts:"Claro que sí, ya mismo te la mando por WhatsApp.",aEn:"Of course, I'll send it to you on WhatsApp right now.",level:"easy",service:true},
  {q:"Buenas tardes, ¿con sopa o fruta? ¿Y qué principio le pongo?",qEs:"Buenas tardes, ¿con sopa o fruta? ¿Y qué principio le pongo?",qEn:"Good afternoon, with soup or fruit? And what side shall I put?",aEs:"Con sopa, por favor, y de principio frijoles con tajadas.",aTts:"Con sopa, por favor, y de principio frijoles con tajadas.",aEn:"With soup, please, and beans with plantains for the side.",level:"easy",service:true},
  {q:"Para registrar la SIM card necesito su número de cédula, por favor.",qEs:"Para registrar la SIM card necesito su número de cédula, por favor.",qEn:"To register the SIM card I need your Colombian ID number, please.",aEs:"Todavía no tengo cédula; ¿le sirve el número de mi pasaporte?",aTts:"Todavía no tengo cédula; ¿le sirve el número de mi pasaporte?",aEn:"I don't have a Colombian ID yet; does my passport number work?",level:"moderate",service:true},
  {q:"Bienvenido a la casa; te presento a mis papás, don Hernán y doña Clara.",qEs:"Bienvenido a la casa; te presento a mis papás, don Hernán y doña Clara.",qEn:"Welcome to the house; let me introduce my parents, Mr. Hernán and Mrs. Clara.",aEs:"Mucho gusto; me han hablado muchísimo de ustedes. ¡Qué casa tan acogedora!",aTts:"Mucho gusto; me han hablado muchísimo de ustedes. ¡Qué casa tan acogedora!",aEn:"Nice to meet you; I've heard so much about you. What a welcoming home!",level:"easy",service:true},
  {q:"¡Por fin viernes! ¿Qué planes tienes para este puente festivo?",qEs:"¡Por fin viernes! ¿Qué planes tienes para este puente festivo?",qEn:"Finally Friday! What plans do you have for this holiday weekend?",aEs:"Hoy vamos a una salsoteca y mañana salimos temprano para un pueblito.",aTts:"Hoy vamos a una salsoteca y mañana salimos temprano para un pueblito.",aEn:"Tonight we're going to a salsa club and tomorrow we leave early for a small town.",level:"easy",service:true},
  {q:"Señorita, ¿en dónde cancelo la cuenta del almuerzo?",qEs:"Señorita, ¿en dónde cancelo la cuenta del almuerzo?",qEn:"Miss, where do I pay the lunch bill?",aEs:"Puede cancelar allá en la caja con tarjeta, efectivo o Nequi.",aTts:"Puede cancelar allá en la caja con tarjeta, efectivo o Nequi.",aEn:"You can pay over at the register by card, cash, or Nequi.",level:"easy",service:true},
  {q:"¿En qué estrato está ubicado este conjunto cerrado?",qEs:"¿En qué estrato está ubicado este conjunto cerrado?",qEn:"What socioeconomic tier is this gated complex in?",aEs:"Está en estrato cuatro, así que los servicios llegan a buen precio.",aTts:"Está en estrato cuatro, así que los servicios llegan a buen precio.",aEn:"It's in tier 4, so the utilities come at a good price.",level:"moderate",service:true},
  {q:"Buenos días, ¿viene por medicina prepagada o consulta particular?",qEs:"Buenos días, ¿viene por medicina prepagada o consulta particular?",qEn:"Good morning, are you coming through private insurance or self-pay?",aEs:"Vengo por consulta particular para una limpieza dental.",aTts:"Vengo por consulta particular para una limpieza dental.",aEn:"I'm coming as self-pay for a dental cleaning.",level:"easy",service:true},
  {q:"Bienvenido a Migración Colombia. ¿Qué trámite viene a realizar hoy?",qEs:"Bienvenido a Migración Colombia. ¿Qué trámite viene a realizar hoy?",qEn:"Welcome to Migración Colombia. What process are you here for today?",aEs:"Vengo a registrar mi visa para sacar la cédula de extranjería.",aTts:"Vengo a registrar mi visa para sacar la cédula de extranjería.",aEn:"I'm here to register my visa to get my foreigner ID card.",level:"moderate",service:true},
  {q:"¡Ajá, primo! Bienvenido a San Juan del Cesar; pasa a la terraza y siéntate en la mecedora.",qEs:"¡Ajá, primo! Bienvenido a San Juan del Cesar; pasa a la terraza y siéntate en la mecedora.",qEn:"Hey cousin! Welcome to San Juan del Cesar; come onto the front porch and sit in the rocking chair.",aEs:"¡Muchas gracias! Qué alegría estar aquí en La Guajira con toda la familia.",aTts:"¡Muchas gracias! Qué alegría estar aquí en La Guajira con toda la familia.",aEn:"Thank you so much! What a joy to be here in La Guajira with the whole family.",level:"easy",service:true},
  {q:"Se fue la luz en la cocina después del aguacero; ¿qué revisamos primero?",qEs:"Se fue la luz en la cocina después del aguacero; ¿qué revisamos primero?",qEn:"The power went out in the kitchen after the downpour; what do we check first?",aEs:"Revisemos la caja de tacos porque seguro se saltó un taco de la luz.",aTts:"Revisemos la caja de tacos porque seguro se saltó un taco de la luz.",aEn:"Let's check the breaker box because a circuit breaker probably tripped.",level:"moderate",service:true},
  {q:"¡Hoy juega la Selección Colombia! ¿Cómo hacemos para pedir las picadas?",qEs:"¡Hoy juega la Selección Colombia! ¿Cómo hacemos para pedir las picadas?",qEn:"Today the Colombian National Team plays! How should we order the shared platters?",aEs:"Hagamos vaca entre todos por Nequi y pedimos a domicilio.",aTts:"Hagamos vaca entre todos por Nequi y pedimos a domicilio.",aEn:"Let's all pitch in via Nequi and order delivery.",level:"easy",service:true},
  {q:"Disculpe, agente, se me extravió el pasaporte; ¿dónde pongo el reporte?",qEs:"Disculpe, agente, se me extravió el pasaporte; ¿dónde pongo el reporte?",qEn:"Excuse me, officer, my passport was lost; where do I file the report?",aEs:"Puede registrar la constancia en el portal de la Policía Nacional o en el CAI.",aTts:"Puede registrar la constancia en el portal de la Policía Nacional o en el CAI.",aEn:"You can file the report on the National Police portal or at the CAI post.",level:"moderate",service:true},
  {q:"¡Uy, y ese milagro que vino por acá!",qEs:"¡Uy, y ese milagro que vino por acá!",qEn:"Oh, what a pleasant surprise seeing you around here!",aEs:"¡Cómo estás! Tenía muchas ganas de saludarlos.",aTts:"¡Cómo estás! Tenía muchas ganas de saludarlos.",aEn:"How are you! I really wanted to come say hi.",level:"easy",service:true},
  {q:"¿Cómo así? ¿Ya se acabó el partido?",qEs:"¿Cómo así? ¿Ya se acabó el partido?",qEn:"Wait what? Is the game already over?",aEs:"Sí, terminó hace cinco minutos; quedamos dos a uno.",aTts:"Sí, terminó hace cinco minutos; quedamos dos a uno.",aEn:"Yes, it ended five minutes ago; final score was two to one.",level:"easy",service:true},
  {q:"A la orden, mi vecino, ¿qué se le ofrece?",qEs:"A la orden, mi vecino, ¿qué se le ofrece?",qEn:"At your service, neighbor, what can I get for you?",aEs:"Buenas, ¿me regala dos empanadas y un ají por aparte?",aTts:"Buenas, ¿me regala dos empanadas y un ají por aparte?",aEn:"Hi, could I get two empanadas and hot sauce on the side?",level:"easy",service:true},
  {q:"¿De parte de quién digo que lo buscan?",qEs:"¿De parte de quién digo que lo buscan?",qEn:"Who shall I say is calling / looking for them?",aEs:"De parte de Seth; ya me estaban esperando.",aTts:"De parte de Seth; ya me estaban esperando.",aEn:"On behalf of Seth; they were already expecting me.",level:"moderate",service:true},
  {q:"¿Tiene el valor exacto o necesita vueltas?",qEs:"¿Tiene el valor exacto o necesita vueltas?",qEn:"Do you have exact change or do you need change back?",aEs:"Le pago con este billete de veinte mil, por favor.",aTts:"Le pago con este billete de veinte mil, por favor.",aEn:"I'll pay with this twenty-thousand bill, please.",level:"moderate",service:true},
  {q:"¿Qué más pues? ¿Cómo va todo en la casa?",qEs:"¿Qué más pues? ¿Cómo va todo en la casa?",qEn:"What's up then? How's everything at home?",aEs:"Todo súper bien, gracias a Dios, trabajando juiciosos.",aTts:"Todo súper bien, gracias a Dios, trabajando juiciosos.",aEn:"Everything's super good, thank God, staying busy with work.",level:"easy",service:true},
  {q:"¿Me regalas un segundito mientras cuadro la caja?",qEs:"¿Me regalas un segundito mientras cuadro la caja?",qEn:"Can you give me a quick second while I settle the register?",aEs:"Claro, tranquilo, tómate tu tiempo sin afán.",aTts:"Claro, tranquilo, tómate tu tiempo sin afán.",aEn:"Sure, no worries, take your time without rushing.",level:"moderate",service:true},
  {q:"¿Sí me hice entender con la dirección?",qEs:"¿Sí me hice entender con la dirección?",qEn:"Did I make myself clear with the directions?",aEs:"Sí, clarísimo: dos cuadras derecho y giro a la izquierda.",aTts:"Sí, clarísimo: dos cuadras derecho y giro a la izquierda.",aEn:"Yes, super clear: two blocks straight and turn left.",level:"moderate",service:true},
  {q:"¿Vas saliendo ya o te demoras un ratico?",qEs:"¿Vas saliendo ya o te demoras un ratico?",qEn:"Are you heading out now or taking a little longer?",aEs:"Ya salgo en cinco minuticos; voy bajando al lobby.",aTts:"Ya salgo en cinco minuticos; voy bajando al lobby.",aEn:"Leaving in five quick minutes; heading down to the lobby.",level:"easy",service:true},
  {q:"¿El café lo prefiere bien cargado o clarito?",qEs:"¿El café lo prefiere bien cargado o clarito?",qEn:"Do you prefer the coffee strong or mild?",aEs:"Término medio está perfecto, sin azúcar por favor.",aTts:"Término medio está perfecto, sin azúcar por favor.",aEn:"Medium strength is perfect, no sugar please.",level:"easy",service:true}
];
RR_BANK.push(...RR_SERVICE_REFLEXES);
let rrTimer=null,rrCurrent=null,rrSession=0,rrPromptToken=0;
let rrRecorder=null,rrStream=null,rrChunks=[],rrUrl=null,rrSilenceTimer=null,rrMaxTimer=null,rrAudioContext=null,rrAnalyser=null,rrRated=false;
const RR_DIFFICULTY_KEY="esco-rapid-difficulty-v1";
const RR_DIFFICULTIES={
  easy:{label:"Easy",seconds:8,description:"More time · shorter prompts"},
  moderate:{label:"Moderate",seconds:5,description:"Balanced speaking pace"},
  challenge:{label:"Challenge",seconds:3,description:"Quick conversation pressure"}
};
let rrDifficulty="moderate";
try{const saved=localStorage.getItem(RR_DIFFICULTY_KEY);if(RR_DIFFICULTIES[saved])rrDifficulty=saved;}catch(e){}
function rrSaveDifficulty(){try{localStorage.setItem(RR_DIFFICULTY_KEY,rrDifficulty);}catch(e){}}
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
try{rrStats=Object.assign(rrStats,JSON.parse(localStorage.getItem(RR_STATS_KEY)||"{}"));}catch(e){}
function saveRRStats(){try{localStorage.setItem(RR_STATS_KEY,JSON.stringify(rrStats));}catch(e){}}
function rrClearRecording(){if(rrUrl){try{URL.revokeObjectURL(rrUrl);}catch(e){}rrUrl=null;}rrChunks=[];}
function rrStopStream(){if(rrStream){rrStream.getTracks().forEach(t=>t.stop());rrStream=null;}}
function rrCloseAudio(){if(rrAudioContext){try{rrAudioContext.close();}catch(e){}rrAudioContext=null;}rrAnalyser=null;}
function rrCancelRecording(){
  if(rrSilenceTimer){clearInterval(rrSilenceTimer);rrSilenceTimer=null;}
  if(rrMaxTimer){clearTimeout(rrMaxTimer);rrMaxTimer=null;}
  if(rrRecorder){try{rrRecorder.onstop=null;if(rrRecorder.state==="recording")rrRecorder.stop();}catch(e){}rrRecorder=null;}
  rrStopStream();rrCloseAudio();
}
function rrStop(){
  const wasActive=!!(rrTimer||rrRecorder||rrStream);
  rrPromptToken++;
  if(rrTimer){clearInterval(rrTimer);rrTimer=null;}
  rrCancelRecording();
  if(wasActive){if(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending))window.speechSynthesis.cancel();if(typeof ttsAudio!=="undefined"&&ttsAudio){try{ttsAudio.pause();}catch(e){}}}
}
function rrExit(){rrStop();renderLessons();}
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
    rrRecorder=new MediaRecorder(rrStream);
    rrRecorder.ondataavailable=e=>{if(e.data&&e.data.size)rrChunks.push(e.data);};
    rrRecorder.onstop=()=>{
      const blob=new Blob(rrChunks,{type:(rrRecorder&&rrRecorder.mimeType)||"audio/mp4"});
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
function renderRapida(keepSame,questionRate){
  rrStop();
  rrClearRecording();rrRated=false;
  const promptToken=rrPromptToken;
  const root=document.getElementById("lesson-list");if(!root)return;
  if(!RR_BANK.length){renderLessons();return;}
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
const SRS_KEY="esco-srs-v1";
let srsStore={};
try{srsStore=JSON.parse(localStorage.getItem(SRS_KEY)||"{}");if(!srsStore||typeof srsStore!=="object")srsStore={};}catch(e){srsStore={};}
const SRS_INTERVALS=[1,3,7,14,30];
function saveSrs(){try{localStorage.setItem(SRS_KEY,JSON.stringify(srsStore));}catch(e){}}
function srsDue(key){const card=srsStore[key];return !!card&&(!card.due||card.due<=Date.now());}
function srsDueCount(){return Object.keys(srsStore).filter(srsDue).length;}
function recordSrs(key,correct){
  recordPracticeDay();
  const now=Date.now(),today=localDayKey();
  const card=srsStore[key]||{reps:0,interval:0,lapses:0,due:0};
  if(correct){
    if(card.lastReviewDay!==today&&(!card.due||card.due<=now)){
      card.reps=(card.reps||0)+1;
      card.spacedReviews=(card.spacedReviews||0)+1;
      card.interval=Math.min((card.interval||0)+1,SRS_INTERVALS.length);
      card.due=now+SRS_INTERVALS[card.interval-1]*86400000;
      card.lastReviewDay=today;
    }
  }else{
    card.lapses=(card.lapses||0)+1;card.reps=0;card.spacedReviews=0;card.interval=0;
    card.due=now+86400000;card.lastReviewDay=today;
  }
  srsStore[key]=card;saveSrs();
}
function srsNextLabel(card){if(!card||!card.interval)return "tomorrow";const days=SRS_INTERVALS[Math.max(0,Math.min(SRS_INTERVALS.length-1,card.interval-1))];return days===1?"tomorrow":`in ${days} days`;}

/* v61: a small, profile-scoped error journal. Quiz misses and speaking
   hesitations become useful practice targets instead of disappearing into a
   score counter. It stores the Spanish target, not private recordings. */
const SPEAKING_ERROR_KEY="esco-speaking-errors-v1";
let speakingErrors={};
try{speakingErrors=JSON.parse(localStorage.getItem(SPEAKING_ERROR_KEY)||"{}");if(!speakingErrors||typeof speakingErrors!=="object")speakingErrors={};}catch(e){speakingErrors={};}
function saveSpeakingErrors(){try{localStorage.setItem(SPEAKING_ERROR_KEY,JSON.stringify(speakingErrors));}catch(e){}}
function speakingErrorId(target){return normalizeQuizText(target||"");}
function recordSpeakingError(target,source){
  const text=String(target||"").trim(),id=speakingErrorId(text);if(!id)return;
  const old=speakingErrors[id]||{};
  speakingErrors[id]={text:old.text||text,source:source||old.source||"practice",count:(old.count||0)+1,last:Date.now()};
  saveSpeakingErrors();
}
function clearSpeakingError(target){const id=speakingErrorId(target);if(!id)return;delete speakingErrors[id];saveSpeakingErrors();}
function isStarredPhrase(target){const id=speakingErrorId(target);return !!(id&&speakingErrors[id]&&speakingErrors[id].starred);}
function toggleStarPhrase(target,source,btn){
  const text=String(target||"").trim(),id=speakingErrorId(text);if(!id)return false;
  if(speakingErrors[id]&&speakingErrors[id].starred){
    delete speakingErrors[id];saveSpeakingErrors();
    if(btn){btn.textContent="☆";btn.classList.remove("starred");btn.title="Pin to speaking practice list";}
    return false;
  }
  const old=speakingErrors[id]||{};
  speakingErrors[id]={text:old.text||text,source:source||old.source||"starred",count:old.count||1,last:Date.now(),starred:true};
  saveSpeakingErrors();
  if(btn){btn.textContent="⭐";btn.classList.add("starred");btn.title="Pinned in your speaking practice list";}
  return true;
}
function attachStarBtn(container,target,source){
  if(!container||!target)return;
  const b=document.createElement("button");b.type="button";
  const on=isStarredPhrase(target);
  b.className="star-pin-btn"+(on?" starred":"");
  b.textContent=on?"⭐":"☆";
  b.title=on?"Pinned in your speaking practice list":"Pin to speaking practice list";
  b.setAttribute("aria-label","Pin phrase to speaking list");
  b.onclick=e=>{e.stopPropagation();toggleStarPhrase(target,source,b);};
  container.appendChild(b);
}
function renderSpeakingErrorJournal(root){
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
    const done=document.createElement("button");done.type="button";done.className="error-journal-btn done";done.textContent="✓";done.title="Remove from practice list";done.setAttribute("aria-label","Remove from practice list");done.onclick=()=>{clearSpeakingError(item.text);renderLessons();};
    actions.append(hear,record,done);row.append(copy,actions);list.appendChild(row);
  });
  card.appendChild(list);root.appendChild(card);
}
const MISSION_KEY="esco-mission-progress-v1";
let missionProgress={};
try{missionProgress=JSON.parse(localStorage.getItem(MISSION_KEY)||"{}");if(!missionProgress||typeof missionProgress!=="object")missionProgress={};}catch(e){missionProgress={};}
function saveMissions(){try{localStorage.setItem(MISSION_KEY,JSON.stringify(missionProgress));}catch(e){}}
function renderMission(mission){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");if(!root)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=renderLessons;root.appendChild(back);
  const card=lpEl("lp-card mission-card");card.appendChild(lpEl("lp-step-title","🗣️ Conversation mission"));card.appendChild(lpEl("mission-title",mission.title));card.appendChild(lpEl("mission-scenario",mission.scenario));card.appendChild(lpEl("mission-prompt",mission.prompt));
  const say=lpEl("mission-say","Answer out loud before looking at the examples.");card.appendChild(say);
  const reveal=document.createElement("button");reveal.type="button";reveal.className="lp-nav-btn primary";reveal.textContent="👀 Reveal natural answers";
  const models=document.createElement("div");models.className="mission-models";models.hidden=true;
  reveal.onclick=()=>{say.textContent="Compare your idea with these natural Colombian answers:";reveal.remove();models.hidden=false;};card.appendChild(reveal);
  (mission.models||[]).forEach((m,i)=>{const row=document.createElement("div");row.className="mission-model";row.innerHTML=`<div class="mission-model-label">Natural option ${i+1}</div><div class="mission-model-es">${escapeVocabHtml(m.es)}</div><div class="mission-model-en">${escapeVocabHtml(m.en)}</div>`;row.onclick=()=>{markPractice("phrases",m.es);speak(m.tts||m.es,0.75);};attachMic(row,m.es);models.appendChild(row);});
  card.appendChild(models);
  const inRoutine=routineToday().step===4;
  const done=document.createElement("button");done.type="button";done.className="lesson-start";done.textContent=inRoutine?"✅ Finish today’s speaking path":(missionProgress[mission.id]?"✅ Mission completed — practice again":"✅ I answered out loud");done.onclick=()=>{missionProgress[mission.id]=true;saveMissions();if(inRoutine)routineFinishMission();else renderMission(mission);};card.appendChild(done);root.appendChild(card);
}

/* v56 + v71: Sentence-frame trainer & Interactive 3-Column Slot-Swapper. */
let frameSessionIndex=0,frameMode="slots",slotMatrixIndex=0,slotPick=[0,0,0];
function frameDayNumber(){return Math.floor(Date.now()/86400000);}
function renderFramePractice(advance){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");
  if(!root||typeof SPEAKING_FRAMES==="undefined"||!SPEAKING_FRAMES.length){renderLessons();return;}
  if(advance)frameSessionIndex=(frameSessionIndex+1)%SPEAKING_FRAMES.length;
  root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=renderLessons;root.appendChild(back);
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
const READING_KEY="esco-reading-progress-v1";
let readingProgress={};
try{readingProgress=JSON.parse(localStorage.getItem(READING_KEY)||"{}");if(!readingProgress||typeof readingProgress!=="object")readingProgress={};}catch(e){readingProgress={};}
function saveReadings(){try{localStorage.setItem(READING_KEY,JSON.stringify(readingProgress));}catch(e){}}
function renderReading(reading){
  if(typeof rrStop==="function")rrStop();
  const root=document.getElementById("lesson-list");if(!root)return;root.innerHTML="";
  setLeccionesFocusMode(true);
  const back=document.createElement("button");back.type="button";back.className="phrase-back";back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=renderLessons;root.appendChild(back);
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

/* ═══════════════════════════════════════════════════════════════════════════
   Guided daily speaking routine (v35) — one small sequence using existing
   features. The day and current step persist, but content remains replayable.
   ═══════════════════════════════════════════════════════════════════════════ */
const ROUTINE_KEY="esco-routine-v3";
const ROUTINE_STEPS=[
  {id:"warmup",icon:"🎙️",title:"Warm up your mouth",sub:"Pure vowels, RR, and Ñ · about 2 minutes."},
  {id:"twisters",icon:"🗣️",title:"Train difficult sounds",sub:"Tongue twisters for RR and Ñ · about 3 minutes."},
  {id:"review",icon:"🔁",title:"Recall useful Spanish",sub:"Review due cards and answer before looking."},
  {id:"phrases",icon:"💬",title:"Speak useful phrases",sub:"Practice a real conversation and both sides."},
  {id:"mission",icon:"🗣️",title:"Conversation mission",sub:"Answer in your own words out loud."}
];
let routineState={date:"",step:0};
try{routineState=Object.assign(routineState,JSON.parse(localStorage.getItem(ROUTINE_KEY)||"{}"));}catch(e){}
function routineToday(){const today=new Date().toISOString().slice(0,10);if(routineState.date!==today){routineState={date:today,step:0};saveRoutine();}return routineState;}
function saveRoutine(){try{localStorage.setItem(ROUTINE_KEY,JSON.stringify(routineState));}catch(e){}}
function routineOpen(id){
  removeRoutineQuizGuide();
  routineDockShow();
  if(id==="warmup"){
    clearRoutineFocus();showPage("fonetica");showPhonetic("syllables");setRoutineFocus("warmup");
    setTimeout(()=>{const reminders=document.getElementById("phonetic-english-reminders");if(reminders)reminders.open=true;const start=document.getElementById("phonetic-start");if(start)start.scrollIntoView({behavior:"smooth",block:"start"});},60);
  }
  else if(id==="twisters"){
    clearRoutineFocus();showPage("fonetica");showPhonetic("syllables");setRoutineFocus("twisters");
    setTimeout(()=>{
      const fold=document.getElementById("phonetic-twisters");if(fold)fold.open=true;
      const root=document.getElementById("tongue-twister-lab");
      routineTwisterSelection=getDailyTwisterSelection();
      const labels=routineTwisterSelection.map(x=>escapeVocabHtml(x.title)).join(" + ");
      const list=root&&root.querySelector(".twister-list");
      if(list){routineTwisterSelection.slice().reverse().forEach(item=>{const card=list.querySelector(`[data-twister-id="${item.id}"]`);if(card){card.classList.add("routine-daily-pick");list.prepend(card);}});}
      if(root&&!root.querySelector(".routine-twister-guide")){
        root.insertAdjacentHTML("afterbegin",`<div class="routine-twister-guide"><div class="routine-guide-kicker">🎯 STEP 2 · TODAY'S FOCUS</div><strong>Train RR and Ñ before speed</strong><span>Today's picks: <b>${labels}</b>. They rotate automatically each day. Practice each one 2–3 times: listen slowly, repeat, say it naturally, then record yourself.</span><div class="routine-twister-sequence"><b>1</b> Listen slowly · <b>2</b> Repeat twice · <b>3</b> Natural speed · <b>4</b> Record and compare</div><div class="routine-guide-actions"><button type="button" class="warmup-back" onclick="routineBack()">‹ Back to daily path</button><button type="button" class="warmup-continue" onclick="routineFinishTwisters()">Done — continue →</button></div></div>`);
      }
      const start=document.getElementById("phonetic-twisters");if(start)start.scrollIntoView({behavior:"smooth",block:"start"});
    },60);
  }
  else if(id==="review"){
    showPage("quiz");qMissedOnly=false;qMode="mixed";qCat="all";qFocus="all";repasoLeft=10;resetQuizRound();syncQuizControls();nQ();renderRoutineQuizGuide();
  }
  else if(id==="phrases"){
    showPage("frases");
    const d=PHRASE_DIALOGUES.find(x=>/Uber: hablo poquito español/i.test(x.title))||PHRASE_DIALOGUES.find(x=>/Carro y taxi/i.test(x.title))||PHRASE_DIALOGUES[0];
    if(d)renderFraseDialogue(d,"Ahora");
  }
  else if(id==="mission"){const m=CONVERSATION_MISSIONS.find(x=>!missionProgress[x.id])||CONVERSATION_MISSIONS[0];if(m){showPage("lecciones");renderMission(m);}}
}
function clearRoutineGuide(){routineTwisterSelection=null;renderTongueTwisters();removeRoutineQuizGuide();}
function setRoutineFocus(kind){const page=document.getElementById("page-fonetica");if(page){page.classList.add("routine-focus");page.classList.toggle("routine-focus-warmup",kind==="warmup");page.classList.toggle("routine-focus-twisters",kind==="twisters");}}
function clearRoutineFocus(){const page=document.getElementById("page-fonetica");if(page)page.classList.remove("routine-focus","routine-focus-warmup","routine-focus-twisters");}
function routineBack(){routineDockHide();clearRoutineGuide();clearRoutineFocus();lessonView="today";showPage("lecciones");renderLessons();}
function routineAdvance(expected){
  routineToday();
  if(routineState.step!==expected){routineBack();return;}
  routineState.step=Math.min(ROUTINE_STEPS.length,routineState.step+1);saveRoutine();
  const next=ROUTINE_STEPS[routineState.step];
  if(next)routineOpen(next.id);else{routineDockHide();clearRoutineGuide();clearRoutineFocus();showPage("lecciones");renderLessons();}
}
function routineFinishWarmup(){routineAdvance(0);}
function routineFinishTwisters(){routineAdvance(1);}
function routineFinishReview(){routineAdvance(2);}
function routineFinishPhrases(){routineAdvance(3);}
function routineFinishMission(){
  const mission=CONVERSATION_MISSIONS.find(x=>!missionProgress[x.id])||CONVERSATION_MISSIONS[0];
  if(mission){missionProgress[mission.id]=true;saveMissions();}
  routineAdvance(4);
}
function routineComplete(){routineToday();routineState.step=Math.min(ROUTINE_STEPS.length,routineState.step+1);saveRoutine();showPage("lecciones");renderLessons();}
function removeRoutineQuizGuide(){const guide=document.querySelector(".routine-quiz-guide");if(guide)guide.remove();}
function routineDockEnsure(){
  let dock=document.getElementById("routine-dock");
  if(dock)return dock;
  dock=document.createElement("section");dock.id="routine-dock";dock.className="routine-dock";dock.setAttribute("aria-label","Daily speaking path controls");
  dock.innerHTML="<div class='routine-dock-meta'><span>🎓 DAILY SPEAKING PATH</span><span class='routine-dock-count'></span></div><button type='button' class='routine-dock-btn'></button><button type='button' class='routine-dock-back'>‹ Back to daily path</button>";
  dock.querySelector(".routine-dock-back").onclick=routineBack;
  dock.querySelector(".routine-dock-btn").onclick=routineDockAdvance;
  document.body.appendChild(dock);return dock;
}
function routineDockShow(){
  const dock=routineDockEnsure();routineToday();
  if(routineState.step>=ROUTINE_STEPS.length){routineDockHide();return;}
  const step=routineState.step,next=ROUTINE_STEPS[step+1];
  dock.querySelector(".routine-dock-count").textContent=`Step ${step+1} of ${ROUTINE_STEPS.length}`;
  dock.querySelector(".routine-dock-btn").textContent=next?`Continue to ${next.title} →`:"Finish today’s speaking path ✓";
  document.body.classList.add("routine-session-active");dock.classList.add("active");
}
function routineDockHide(){const dock=document.getElementById("routine-dock");if(dock)dock.classList.remove("active");document.body.classList.remove("routine-session-active");}
function routineDockAdvance(){
  routineToday();
  if(routineState.step===0)return routineFinishWarmup();
  if(routineState.step===1)return routineFinishTwisters();
  if(routineState.step===2)return routineFinishReview();
  if(routineState.step===3)return routineFinishPhrases();
  if(routineState.step===4)return routineFinishMission();
}
function renderRoutineQuizGuide(){
  removeRoutineQuizGuide();
  if(routineToday().step!==2)return;
  const page=document.getElementById("page-quiz"),anchor=page&&page.querySelector(".quiz-score-bar");if(!page||!anchor)return;
  const guide=document.createElement("section");guide.className="routine-quiz-guide";
  guide.innerHTML="<div class='routine-guide-kicker'>🎯 STEP 3 · RECALL</div><strong>Practice a few useful answers</strong><span>Answer out loud before tapping. Use the Spanish reveal to repeat the complete sentence.</span><button type='button' class='routine-next-large' onclick='routineFinishReview()'>I practiced — continue to phrases →</button><button type='button' class='routine-back-link' onclick='routineBack()'>‹ Back to daily path</button>";
  page.insertBefore(guide,anchor);
}

/* v58: keep Lecciones from becoming one long mixed-purpose page. The three
   views preserve all existing material while making the next action obvious. */
const LESSON_VIEW_KEY="esco-lesson-view-v1";
const SESSION_LENGTH_KEY="esco-session-length-v1";
let lessonView="today",sessionLength="10";
try{lessonView=localStorage.getItem(LESSON_VIEW_KEY)||"today";sessionLength=localStorage.getItem(SESSION_LENGTH_KEY)||"10";}catch(e){}
function setLessonView(view){
  lessonView=view||"today";
  try{localStorage.setItem(LESSON_VIEW_KEY,lessonView);}catch(e){}
  const root=document.getElementById("lesson-list");if(!root)return;
  root.querySelectorAll(".lesson-view-tab").forEach(b=>b.classList.toggle("active",b.dataset.view===lessonView));
  root.querySelectorAll("[data-lesson-view]").forEach(el=>el.classList.toggle("lesson-view-hidden",el.dataset.lessonView!==lessonView));
  scrollAppTop();
}
function buildLessonViewTabs(root){
  const nav=document.createElement("nav");nav.className="lesson-view-tabs";nav.setAttribute("aria-label","Lesson views");
  [["today","Today / Hoy","Daily hub"],["path","Learning path / Ruta",`${LESSONS.length} lessons`],["practice","Practice / Biblioteca","Missions & stories"]].forEach(([id,title,sub])=>{
    const b=document.createElement("button");b.type="button";b.className="lesson-view-tab";b.dataset.view=id;b.innerHTML=`<strong>${title}</strong><small>${sub}</small>`;b.onclick=()=>setLessonView(id);nav.appendChild(b);
  });
  root.appendChild(nav);
}
function setSessionLength(value){
  sessionLength=String(value);try{localStorage.setItem(SESSION_LENGTH_KEY,sessionLength);}catch(e){}
  const root=document.getElementById("lesson-list");if(!root)return;
  root.querySelectorAll(".session-length-btn").forEach(b=>b.classList.toggle("selected",b.dataset.minutes===sessionLength));
}
function startSelectedSession(){
  scrollAppTop();
  if(sessionLength==="5"){renderFramePractice(false);return;}
  if(sessionLength==="20"){
    const target=LESSONS.find(l=>!lessonProgress[l.id])||LESSONS[0];
    if(target)openLesson(target);return;
  }
  routineToday();
  if(routineState.step>=ROUTINE_STEPS.length){routineState.step=0;saveRoutine();}
  routineOpen(ROUTINE_STEPS[routineState.step].id);
}
function renderRoutineCard(root){
  routineToday();
  const wrap=document.createElement("section");wrap.className="daily-routine-card";wrap.dataset.lessonView="today";
  const complete=routineState.step>=ROUTINE_STEPS.length;
  const current=ROUTINE_STEPS[Math.min(routineState.step,ROUTINE_STEPS.length-1)];
  wrap.innerHTML=`<div class='routine-top'><div><div class='routine-kicker'>🎯 10-MINUTE DAILY SPEAKING ROUTINE</div><div class='routine-title'>${complete?"Routine complete for today":"Step "+(routineState.step+1)+" of "+ROUTINE_STEPS.length+": "+current.title}</div></div><div class='routine-count'>${complete?`${ROUTINE_STEPS.length}/${ROUTINE_STEPS.length}`:`${routineState.step}/${ROUTINE_STEPS.length}`}</div></div><div class='routine-track'><span style='width:${Math.round(routineState.step/ROUTINE_STEPS.length*100)}%'></span></div>`;
  if(!complete){
    const step=lpEl("routine-current");step.innerHTML=`<span class='routine-current-icon'>${current.icon}</span><span><strong>${current.title}</strong><small>${current.sub}</small></span>`;
    const actions=lpEl("routine-actions");
    const open=document.createElement("button");open.type="button";open.className="lp-nav-btn primary";open.textContent="▶ Start routine step";open.onclick=()=>routineOpen(current.id);
    const done=document.createElement("button");done.type="button";done.className="lp-nav-btn";done.textContent="Skip / Mark done";done.onclick=routineComplete;
    actions.append(open,done);wrap.append(step,actions);
  }else{
    const replay=document.createElement("button");replay.type="button";replay.className="lp-nav-btn";replay.textContent="↻ Replay daily routine";replay.onclick=()=>{routineState.step=0;saveRoutine();routineOpen(ROUTINE_STEPS[0].id);};wrap.appendChild(replay);
  }
  root.appendChild(wrap);
}

function renderProgressDashboard(root,done){
  const vocabCount=Object.keys((practiceStore&&practiceStore.vocab)||{}).length;
  const phraseCount=Object.keys((practiceStore&&practiceStore.phrases)||{}).length;
  const mastered=Object.values(srsStore||{}).filter(c=>(c.interval||0)>=SRS_INTERVALS.length).length;
  const rapid=rrStats.attempts||0;
  const card=document.createElement("section");card.className="progress-dashboard compact-stats-card";card.dataset.lessonView="today";
  card.innerHTML=`<div class="progress-metrics"><div><strong>${done}/${LESSONS.length}</strong><small>lessons</small></div><div><strong>${vocabCount}</strong><small>words</small></div><div><strong>${phraseCount}</strong><small>phrases</small></div><div><strong>${mastered}</strong><small>mastered</small></div></div><details class="lesson-overview"><summary><span>ⓘ How the speaking path works</span><small>8-step core · ${rapid} rapid drills</small></summary><div class="lesson-flow">Recommended path: Start Here → Travel → Daily Life → Build Sentences → Speak Naturally<br>⚡ Speaking Core (8 steps): 🎯 Goal → 🧱 Frame → 🔑 Words → 🪜 Sentence Ladder → 💬 Dialogue → 🎭 Role-play → 🗣️ Speak Out Loud</div></details>`;
  root.appendChild(card);
}

function quizAcceptedAnswers(q){
  const values=[];const add=value=>{if(value!==undefined&&value!==null&&String(value).trim())values.push(String(value));};
  if(q&&q.answer!==undefined)add(q.answer);else add(q&&q.en);
  (q&&Array.isArray(q.acceptedAnswers)?q.acceptedAnswers:[]).forEach(add);
  if(q&&!q.kind&&(!q.answer||q.answer===q.en)&&typeof aQ!=="undefined"){
    const prompt=normalizeQuizPrompt(q.quizPrompt||q.es);
    aQ.filter(other=>!other.kind&&normalizeQuizPrompt(other.quizPrompt||other.es)===prompt).forEach(other=>add(other.en));
  }
  return [...new Map(values.map(value=>[normalizeQuizText(value),value])).values()];
}
function quizAnswerMatches(q,value){
  const key=normalizeQuizText(value);return !!key&&quizAcceptedAnswers(q).some(answer=>normalizeQuizText(answer)===key);
}
function buildQuizAuditReport(pool){
  const groups=new Map(),choiceIssues=[],missingFields=[],weakContext=[];
  pool.forEach((q,i)=>{
    const number=i+1,promptText=q.quizPrompt||q.prompt||q.es||"",promptKey=normalizeQuizPrompt(promptText),groupKey=promptKey+"|"+(q.kind||"vocab"),answers=quizAcceptedAnswers(q);
    if(!q.es||!q.tts||!answers.length)missingFields.push({number,detail:"missing Spanish, audio text, or intended answer"});
    if(promptKey){const group=groups.get(groupKey)||{prompt:promptText,items:[]};group.items.push({number,answers});groups.set(groupKey,group);}
    if(Array.isArray(q.choices)){
      const normalized=q.choices.map(normalizeQuizText),unique=new Set(normalized);
      if(q.choices.length!==4)choiceIssues.push({number,detail:"needs exactly four choices"});
      else if(unique.size!==normalized.length)choiceIssues.push({number,detail:"contains duplicate choices"});
      else if(!q.choices.some(choice=>quizAnswerMatches(q,choice)))choiceIssues.push({number,detail:"intended answer is not among the choices"});
    }
    if((q.kind==="reply"||q.kind==="tense")&&!q.quizPrompt)weakContext.push({number,prompt:promptText,detail:"add a situation or response instruction"});
    if(q.kind==="blank"&&!String(q.es||"").includes("___"))choiceIssues.push({number,detail:"blank question has no blank marker"});
  });
  const conflicting=[],duplicates=[];
  groups.forEach(group=>{
    if(group.items.length<2)return;
    const distinct=[...new Set(group.items.flatMap(item=>item.answers).map(normalizeQuizAnswer).filter(Boolean))];
    const itemSummary=group.items.map(item=>`#${item.number}: ${item.answers.join(" / ")}`).join(" · ");
    (distinct.length>1?conflicting:duplicates).push({prompt:group.prompt,summary:itemSummary});
  });
  return {pool,choiceIssues,missingFields,weakContext,conflicting,duplicates};
}
function renderQuizAuditCard(root){
  const card=document.createElement("section");card.className="quiz-audit-card";card.dataset.lessonView="practice";
  card.innerHTML="<div class='quiz-audit-kicker'>🧪 QUIZ QUALITY CHECK</div><div class='quiz-audit-title'>Keep questions fair and unambiguous</div><p>Run this after adding quiz content. It checks structure and flags prompts that need a human meaning check. It never deletes questions.</p><button type='button' class='quiz-audit-btn'>Run quiz audit</button><div class='quiz-audit-result' aria-live='polite'></div>";
  card.querySelector(".quiz-audit-btn").onclick=()=>{
    const result=card.querySelector(".quiz-audit-result");
    const pool=typeof aQ!=="undefined"?aQ:[];const report=buildQuizAuditReport(pool);const seen=new Map(),duplicates=[],choiceIssues=report.choiceIssues.map(x=>x.number);
    pool.forEach((q,i)=>{
      const prompt=normalizeQuizPrompt(q.quizPrompt||q.es||q.prompt||"");
      const signature=normalizeQuizAnswer(q.en||q.answer||"")+"|"+(Array.isArray(q.choices)?q.choices.map(normalizeQuizAnswer).sort().join("/"):"");
      if(prompt){if(seen.has(prompt)){const prior=seen.get(prompt);if(prior.signature!==signature)duplicates.push({first:prior.index,second:i+1,prompt:q.quizPrompt||q.es||q.prompt||"",firstAnswer:prior.answer||"",secondAnswer:q.en||q.answer||""});}else seen.set(prompt,{index:i+1,signature,answer:q.en||q.answer||""});}
    });
    report.conflicting.forEach(x=>duplicates.push({first:"conflict",second:"",prompt:x.prompt,firstAnswer:x.summary,secondAnswer:"Possible multiple valid answers"}));
    const total=duplicates.length+choiceIssues.length+report.missingFields.length+report.weakContext.length;
    const structure=choiceIssues.length?`⚠️ ${choiceIssues.length} choice-structure issue${choiceIssues.length===1?"":"s"}`:`✅ No malformed choice sets in ${pool.length} questions`;
    const repeatNote=duplicates.length?`${duplicates.length} repeated or possible-conflict prompt${duplicates.length===1?"":"s"} listed for human review.`:"No repeated or conflicting prompts found.";
    result.innerHTML=`<strong>${structure}</strong><small>${repeatNote}</small><small>${report.weakContext.length} weak-context candidate${report.weakContext.length===1?"":"s"} · ${report.missingFields.length} missing-data item${report.missingFields.length===1?"":"s"}</small><em>A computer can find duplicates and malformed choices, but only a person can decide whether two natural replies both fit. Review candidates before publishing.</em>`;
    if(total){
      const detail=document.createElement("details");detail.className="quiz-audit-details";
      const summary=document.createElement("summary");summary.textContent="Show candidate list";detail.appendChild(summary);
      const list=document.createElement("div");list.className="quiz-audit-list";
      duplicates.slice(0,60).forEach(x=>{const row=document.createElement("div");row.innerHTML=`<strong>#${x.first} / #${x.second}</strong><span>${escapeVocabHtml(x.prompt)}</span><small>Answers: ${escapeVocabHtml(x.firstAnswer)} · ${escapeVocabHtml(x.secondAnswer)}</small>`;list.appendChild(row);});
      if(choiceIssues.length){const row=document.createElement("div");row.innerHTML=`<strong>Choice structure</strong><span>Question numbers: ${choiceIssues.join(", ")}</span><small>Check that each has four unique choices and exactly one intended answer.</small>`;list.appendChild(row);}
      report.weakContext.slice(0,60).forEach(x=>{const row=document.createElement("div");row.innerHTML=`<strong>#${x.number}</strong><span>${escapeVocabHtml(x.prompt)}</span><small>Needs clearer context: ${escapeVocabHtml(x.detail)}</small>`;list.appendChild(row);});
      report.missingFields.slice(0,60).forEach(x=>{const row=document.createElement("div");row.innerHTML=`<strong>#${x.number}</strong><span>Missing required quiz data</span><small>${escapeVocabHtml(x.detail)}</small>`;list.appendChild(row);});
      detail.appendChild(list);result.appendChild(detail);
    }
  };
  root.appendChild(card);
}

function storedMissedQuestionCount(){
  try{
    const raw=JSON.parse(localStorage.getItem("esco-quiz-v1")||"{}");
    const missed=raw&&raw.missed&&typeof raw.missed==="object"?raw.missed:{};
    return Object.values(missed).filter(value=>Number(value)>0).length;
  }catch(e){return 0;}
}
function syncMissedQueueLauncher(){
  const host=document.getElementById("quiz-review-launch");if(!host)return;
  const count=storedMissedQuestionCount();
  host.hidden=qMissedOnly||count===0;
  if(host.hidden){host.innerHTML="";return;}
  host.innerHTML=`<span>🧠 <strong>${count} missed question${count===1?"":"s"}</strong> waiting for review</span><button type="button" class="quiz-review-launch-btn">Review missed →</button>`;
  const btn=host.querySelector("button");if(btn)btn.onclick=openMissedQueue;
}
function openReviewSession(){qBlitzPack=null;qMissedOnly=false;showPage("quiz");qMode="mixed";qCat="all";qFocus="all";syncQuizControls();repasoLeft=10;resetQuizRound();nQ();}

const FOCUS_LESSON_SETS={
  all:null,
  sanjuan:["san-juan-guajira","cortesia-colombiana","trampas-colombianas","plata","casa","panaderia-jugos","almuerzo-corrientazo","verbos-comodin","citas-familia","puentes-rumba-cultura","empatia-reacciones","muletillas-diminutivos"],
  travel:["presentate","cortesia-colombiana","trampas-colombianas","aeropuerto-migracion","uber-ride","uber-completo","hotel-checkin","direcciones","direcciones-cuadras","seguridad-emergencias","bancos-pagos","panaderia-jugos","almuerzo-corrientazo","restaurante-real","mercado-negociar","farmacia"],
  daily:["presentate","cortesia-colombiana","casa","trabajo","oficina-real","cajero-sim-tramites","migracion-bancos-ce","porteria-domicilios","arriendo-airbnb","estratos-barrios","hogar-reparaciones","whatsapp-audios","barberia","viajes-finca"]
};
function renderModeFocusBar(root){
  const bar=document.createElement("section");bar.className="mode-focus-bar";bar.setAttribute("aria-label","Learning level and life focus");
  const curLvl=effectiveLevel();
  const lvlOpts=[["starter","🌱 Starter A0"],["explorer","🚀 Explorer A1–A2"],["fluent","🔥 Fluent Flow B1+"]];
  const focOpts=[["all","🌎 All"],["sanjuan","🪗 San Juan"],["travel","✈️ Travel & Food"],["daily","🏠 Daily CO"]];
  const lvlRow=document.createElement("div");lvlRow.className="mf-row";
  lvlOpts.forEach(([id,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="mf-pill"+(curLvl===id?" active":"");
    b.textContent=lbl;b.setAttribute("aria-pressed",curLvl===id?"true":"false");
    b.onclick=()=>{
      userPrefs.level=id;
      if(id==="fluent")userPrefs.blindEar=true;
      else if(id==="starter"&&userPrefs.blindEar)userPrefs.blindEar=false;
      saveUserPrefs();renderLessons();
      if(typeof buildSpeakingGuide==="function")buildSpeakingGuide();
      if(typeof buildGram==="function"&&typeof GRAMMAR!=="undefined")buildGram("presente",GRAMMAR.presente);
    };
    lvlRow.appendChild(b);
  });
  const focRow=document.createElement("div");focRow.className="mf-row mf-row-sub";
  focOpts.forEach(([id,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="mf-chip"+(userPrefs.focus===id?" active":"");
    b.textContent=lbl;b.setAttribute("aria-pressed",userPrefs.focus===id?"true":"false");
    b.onclick=()=>{userPrefs.focus=id;saveUserPrefs();renderLessons();};
    focRow.appendChild(b);
  });
  const earBtn=document.createElement("button");earBtn.type="button";
  const earOn=isBlindEarActive();
  earBtn.className="mf-chip blind-ear-chip"+(earOn?" active":"");
  earBtn.textContent=earOn?"🎧 Blind-Ear: ON":"🎧 Blind-Ear: OFF";
  earBtn.setAttribute("aria-pressed",earOn?"true":"false");
  earBtn.onclick=()=>{
    if(effectiveLevel()==="fluent"&&earOn){userPrefs.level="explorer";userPrefs.blindEar=false;}
    else{userPrefs.blindEar=!earOn;}
    saveUserPrefs();renderLessons();
    if(typeof buildSpeakingGuide==="function")buildSpeakingGuide();
    if(typeof buildGram==="function"&&typeof GRAMMAR!=="undefined")buildGram("presente",GRAMMAR.presente);
  };
  focRow.appendChild(earBtn);
  bar.append(lvlRow,focRow);root.appendChild(bar);
}
function openStageTestOut(stage,stageLessons){
  const root=document.getElementById("lesson-list");if(!root)return;
  setLeccionesFocusMode(true);
  scrollAppTop();
  const poolItems=[];
  stageLessons.forEach(l=>{
    const c=typeof LESSON_CONTENT!=="undefined"&&LESSON_CONTENT[l.id];
    if(!c)return;
    const item=(c.examples&&c.examples[0])||c.goal;
    if(item&&item.es&&item.en)poolItems.push({lesson:l,es:item.es,en:item.en});
  });
  if(poolItems.length<2){openLesson(stageLessons[0]);return;}
  const stepN=Math.max(1,Math.floor(poolItems.length/5));
  const picks=[];
  for(let i=0;i<poolItems.length&&picks.length<5;i+=stepN)picks.push(poolItems[i]);
  for(let i=0;picks.length<Math.min(5,poolItems.length)&&i<poolItems.length;i++){
    if(!picks.includes(poolItems[i]))picks.push(poolItems[i]);
  }
  const allDistractors=LESSONS.map(l=>LESSON_CONTENT[l.id]&&((LESSON_CONTENT[l.id].examples&&LESSON_CONTENT[l.id].examples[0])||LESSON_CONTENT[l.id].goal)).filter(x=>x&&x.es&&x.en);
  const questions=picks.map((p,idx)=>{
    const askEsToEn=idx%2===0;
    const correct=askEsToEn?p.en:p.es;
    const seen=new Set([correct.toLowerCase()]);
    const wrong=[];
    for(const cand of allDistractors){
      if(wrong.length>=3)break;
      const val=askEsToEn?cand.en:cand.es;
      if(!val||seen.has(val.toLowerCase()))continue;
      seen.add(val.toLowerCase());wrong.push(val);
    }
    const opts=[correct,...wrong].sort(()=>Math.random()-0.5);
    return{title:p.lesson.title,prompt:askEsToEn?p.es:p.en,askEsToEn,tts:p.es,correct,opts};
  });
  let qi=0,score=0,answered=false;
  const passNeed=Math.min(questions.length,Math.max(3,Math.ceil(questions.length*0.8)));
  const renderTest=()=>{
    root.innerHTML="";
    const wrap=document.createElement("section");wrap.className="lp-wrap testout-card";
    const back=document.createElement("button");back.type="button";back.className="lp-back";back.textContent="‹ Back to Ruta";
    back.onclick=()=>{setLeccionesFocusMode(false);renderLessons();};
    wrap.appendChild(back);
    if(qi>=questions.length){
      const passed=score>=passNeed;
      if(passed){
        stageLessons.forEach(l=>{lessonProgress[l.id]=true;});
        saveLessons();
      }
      const res=document.createElement("div");res.className="testout-result";
      res.innerHTML=`<div class="testout-kicker">${passed?"🎉 STAGE TEST-OUT PASSED":"🧭 KEEP PRACTICING"}</div>
        <h3>${score}/${questions.length} Correct</h3>
        <p>${passed?`All ${stageLessons.length} lessons in <strong>${escapeVocabHtml(stage.name)}</strong> are now marked complete!`:`Score ${passNeed}/${questions.length} to test out and unlock the next stage faster.`}</p>
        <div class="testout-acts"></div>`;
      const acts=res.querySelector(".testout-acts");
      if(passed){
        const cont=document.createElement("button");cont.type="button";cont.className="lp-nav-btn primary";cont.textContent="Continue to Next Stage →";
        cont.onclick=()=>{setLeccionesFocusMode(false);renderLessons();};
        acts.appendChild(cont);
      }else{
        const retry=document.createElement("button");retry.type="button";retry.className="lp-nav-btn primary";retry.textContent="🔄 Retry Test-Out";
        retry.onclick=()=>openStageTestOut(stage,stageLessons);
        const startL=document.createElement("button");startL.type="button";startL.className="lp-nav-btn";startL.textContent="Start Lesson 1 →";
        startL.onclick=()=>openLesson(stageLessons[0]);
        acts.append(retry,startL);
      }
      wrap.appendChild(res);root.appendChild(wrap);return;
    }
    const q=questions[qi];answered=false;
    const card=document.createElement("div");card.className="lp-card";
    card.innerHTML=`<div class="lp-kicker">⚡ STAGE TEST-OUT · ${qi+1} OF ${questions.length} (NEED ${passNeed})</div>
      <div class="lp-step-sub">${escapeVocabHtml(stage.name)} · ${escapeVocabHtml(q.title)}</div>
      <div class="testout-prompt">${escapeVocabHtml(q.prompt)}</div>
      ${q.askEsToEn?'<button type="button" class="lp-nav-btn testout-hear">🔊 Listen</button>':""}
      <div class="testout-opts"></div>
      <div class="testout-fb" aria-live="polite"></div>
      <div class="testout-next-row"></div>`;
    if(q.askEsToEn){
      card.querySelector(".testout-hear").onclick=()=>speak(q.tts,0.75);
    }
    const optsWrap=card.querySelector(".testout-opts"),fb=card.querySelector(".testout-fb"),nextRow=card.querySelector(".testout-next-row");
    q.opts.forEach(opt=>{
      const b=document.createElement("button");b.type="button";b.className="qopt testout-opt";b.textContent=opt;
      b.onclick=()=>{
        if(answered)return;
        answered=true;
        const ok=opt===q.correct;
        if(ok){score++;b.classList.add("correct");}
        else{
          b.classList.add("wrong");
          optsWrap.querySelectorAll("button").forEach(x=>{if(x.textContent===q.correct)x.classList.add("reveal");});
        }
        fb.textContent=ok?"✅ ¡Correcto!":`❌ Correct answer: ${q.correct}`;
        fb.className="testout-fb "+(ok?"ok":"warn");
        speak(q.tts,0.75);
        const nxt=document.createElement("button");nxt.type="button";nxt.className="lp-nav-btn primary";
        nxt.textContent=qi+1<questions.length?"Next question →":"See Test-Out Result →";
        nxt.onclick=()=>{qi++;renderTest();};
        nextRow.appendChild(nxt);
      };
      optsWrap.appendChild(b);
    });
    wrap.appendChild(card);root.appendChild(wrap);
  };
  renderTest();
}

const WELCOME_DISMISS_KEY="esco-v100-welcome-dismissed";
function renderLessons(){
  const root=document.getElementById("lesson-list");if(!root)return;
  if(lpLesson){renderLessonStep();return;}
  setLeccionesFocusMode(false);
  root.innerHTML="";
  buildLessonViewTabs(root);
  renderModeFocusBar(root);
  const done=LESSONS.filter(x=>lessonProgress[x.id]).length;
  const percent=LESSONS.length?done/LESSONS.length:0;
  const lvlMode=effectiveLevel();
  let welcomeDismissed=false;
  try{welcomeDismissed=localStorage.getItem(WELCOME_DISMISS_KEY)==="1";}catch(e){}
  if(!welcomeDismissed){
    const wCard=document.createElement("section");wCard.className="welcome-lane-card";wCard.dataset.lessonView="today";
    wCard.innerHTML=`<div class="welcome-lane-head"><span>🧭 <strong>Pick your starting lane</strong> <small>(you can switch anytime above)</small></span><button type="button" class="welcome-lane-close" aria-label="Dismiss welcome card">×</button></div><div class="welcome-lane-btns"></div>`;
    const wClose=wCard.querySelector(".welcome-lane-close");
    const dismissWelcome=()=>{try{localStorage.setItem(WELCOME_DISMISS_KEY,"1");}catch(e){}};
    wClose.onclick=()=>{dismissWelcome();renderLessons();};
    const wBtns=wCard.querySelector(".welcome-lane-btns");
    [
      ["🌱 Brand new (A0)","Show Sound Basics & keep extra tools tucked away",()=>{userPrefs.level="starter";userPrefs.blindEar=false;saveUserPrefs();dismissWelcome();renderLessons();}],
      ["🚀 Know basics (A1–A2)","Keep all drills open & unlock 5Q Stage Test-Outs",()=>{userPrefs.level="explorer";saveUserPrefs();dismissWelcome();renderLessons();setLessonView("path");}],
      ["🔥 Wanna flow (B1+)","Turn on Blind-Ear listening challenge right away",()=>{userPrefs.level="fluent";userPrefs.blindEar=true;saveUserPrefs();dismissWelcome();renderLessons();}]
    ].forEach(([title,sub,fn])=>{
      const b=document.createElement("button");b.type="button";b.className="welcome-lane-btn";
      b.innerHTML=`<strong>${title}</strong><small>${sub}</small>`;
      b.onclick=fn;wBtns.appendChild(b);
    });
    root.appendChild(wCard);
  }
  const pathLevel=percent<0.16?"A0 · Foundations":percent<0.38?"A1 · Everyday basics":percent<0.68?"A2 · Connected speech":"B1 · Conversational";
  const resume=loadResume();
  const resLesson=resume&&LESSONS.find(l=>l.id===resume.id);
  const focusIds=FOCUS_LESSON_SETS[userPrefs.focus];
  const focusedNext=focusIds?focusIds.map(id=>LESSONS.find(l=>l.id===id)).find(l=>l&&!lessonProgress[l.id]):null;
  const nextLesson=focusedNext||LESSONS.find(l=>!lessonProgress[l.id]);

  /* 1. Unified Hero Card — Status + Primary Lesson CTA + 1-Tap Session Launchers */
  const hero=document.createElement("section");hero.className="today-hero-card";hero.dataset.lessonView="today";
  hero.innerHTML=`<div class="today-hero-status"><span class="hero-pill streak">🔥 ${dayInfo.streak}d streak</span><span class="hero-pill level">🧭 ${pathLevel}</span><span class="hero-pill count">${done}/${LESSONS.length} lessons · ~4 min</span></div><div class="lesson-progress"><span style="width:${Math.round(percent*100)}%"></span></div>`;

  const primaryLesson=(resLesson&&!lessonProgress[resLesson.id]&&(!focusIds||focusIds.includes(resLesson.id)))?resLesson:(nextLesson||LESSONS[0]);
  const isResuming=!!(resLesson&&primaryLesson.id===resLesson.id&&!lessonProgress[resLesson.id]);
  const focusTag=userPrefs.focus==="sanjuan"?"🪗 SAN JUAN":userPrefs.focus==="travel"?"✈️ TRAVEL & FOOD":userPrefs.focus==="daily"?"🏠 DAILY CO":"";
  const heroCta=document.createElement("button");heroCta.type="button";heroCta.className="today-hero-cta";
  heroCta.innerHTML=`<div class="today-hero-cta-icon">${primaryLesson.icon||"🎓"}</div><div class="today-hero-cta-copy"><span class="today-hero-cta-kicker">${isResuming?`▶️ CONTINUE · STEP ${(resume.step|0)+1}`:(done===0?"🚀 START HERE · LESSON 1":`🎓 NEXT LESSON${focusTag?" · "+focusTag:""}`)}</span><strong>${escapeVocabHtml(primaryLesson.title)}</strong><small>${escapeVocabHtml(primaryLesson.sub)}</small></div><div class="today-hero-cta-badge">${isResuming?"Resume →":"Start →"}</div>`;
  heroCta.onclick=()=>{if(isResuming)openLessonAt(resLesson,resume.step,resume.qi,resume.score);else openLesson(primaryLesson);};
  hero.appendChild(heroCta);

  if(lvlMode==="starter"&&done<3){
    const soundBtn=document.createElement("button");soundBtn.type="button";soundBtn.className="starter-sound-btn";
    soundBtn.innerHTML=`<span>🔤 <strong>2-Min Sound Basics</strong> <small>A·E·I·O·U · Silent H · Ñ · RR</small></span><span>Start →</span>`;
    soundBtn.onclick=()=>{showPage("phonetics");showPhonetic("letras");};
    hero.appendChild(soundBtn);
  }else{
    const expRow=document.createElement("div");expRow.className="explorer-shortcut-row";
    const vvShortcut=document.createElement("button");vvShortcut.type="button";vvShortcut.className="starter-sound-btn explorer-vv-btn";
    vvShortcut.innerHTML=`<span>⚡ <strong>1-Verb → 5 Times</strong> <small>${typeof VERB_VERSATILITY_ENGINE!=="undefined"?VERB_VERSATILITY_ENGINE.length:10} verbs × 5 frames</small></span><span>Go →</span>`;
    vvShortcut.onclick=()=>{showPage("gram");showGramGroup("tiempos");};
    const stShortcut=document.createElement("button");stShortcut.type="button";stShortcut.className="starter-sound-btn explorer-story-btn";
    stShortcut.innerHTML=`<span>📖 <strong>Story Builder</strong> <small>Chain 3 real turns</small></span><span>Build →</span>`;
    stShortcut.onclick=()=>{showPage("frases");const card=document.querySelector(".story-builder-card");if(card)card.scrollIntoView({behavior:"smooth",block:"start"});};
    expRow.append(vvShortcut,stShortcut);
    hero.appendChild(expRow);
  }

  root.appendChild(hero);

  /* 2. Guided 10-Min Daily Speaking Routine directly below Hero */
  renderRoutineCard(root);

  /* 3. Clean 2x2 Quick Speaking Grid */
  const dueHome=srsDueCount();
  const missedHome=storedMissedQuestionCount();
  const quickGrid=document.createElement("section");quickGrid.className="today-quick-grid";quickGrid.dataset.lessonView="today";
  [
    ["🎰","Slot-Swapper",`${typeof SLOT_SWAP_MATRICES!=="undefined"?SLOT_SWAP_MATRICES.length:9} sentence builders`,()=>renderFramePractice(false)],
    ["⚡","Reacción Rápida",`${RR_BANK.length} audio reflexes`,()=>{rrSession=0;renderRapida(false);}],
    ["🔁","Review Cards",dueHome?`${dueHome} due today`:"Spaced repetition",openReviewSession],
    ["🧠","Missed Queue",missedHome?`${missedHome} waiting`:"All clear ✓",()=>{if(missedHome)openMissedQueue();else openReviewSession();}]
  ].forEach(([icon,title,sub,fn])=>{
    const tile=document.createElement("button");tile.type="button";tile.className="today-quick-tile";
    tile.innerHTML=`<span class="today-quick-icon">${icon}</span><span class="today-quick-copy"><strong>${title}</strong><small>${sub}</small></span>`;
    tile.onclick=fn;
    quickGrid.appendChild(tile);
  });

  /* 3b. Smart Coach Focus Strip ("Enfoque de Hoy · 60s Warm-Up") */
  const focusStrip=document.createElement("section");focusStrip.className="coach-focus-strip";focusStrip.dataset.lessonView="today";
  const savedEntries=Object.values(speakingErrors||{}).sort((a,b)=>((b.starred?1:0)-(a.starred?1:0))||((b.last||0)-(a.last||0)));
  const coachPools={
    starter:[
      {text:"Mucho gusto, me llamo Seth.",en:"Nice to meet you, my name is Seth.",source:"👋 First Greeting"},
      {text:"Buenos días, ¿cómo está?",en:"Good morning, how are you?",source:"☀️ Polite Hello"},
      {text:"¿Me regala un tinto, por favor?",en:"Could I have a black coffee, please?",source:"☕ Ordering"},
      {text:"Más despacio, por favor.",en:"Slower, please.",source:"🛟 Survival"},
      {text:"¿Cuánto cuesta esto?",en:"How much does this cost?",source:"💵 Shopping"}
    ],
    sanjuan:[
      {text:"¡Ajá primo! ¿Todo bien por San Juan?",en:"Hey cousin! All good in San Juan?",source:"🪗 San Juan"},
      {text:"Hoy hace un calor sabroso, vamos por una fría.",en:"Great warm day today, let's grab a cold beer.",source:"🌴 La Guajira"},
      {text:"¿Qué hubo compa, cómo amaneció la familia?",en:"What's up buddy, how's the family this morning?",source:"👨‍👩‍👧 Familia"},
      {text:"¡Qué nota ese vallenato de Diomedes!",en:"That Diomedes vallenato song is awesome!",source:"🎶 Vallenato"}
    ],
    travel:[
      {text:"Con tarjeta de crédito, a una sola cuota, por favor.",en:"By credit card, single payment, please.",source:"💳 Pagos"},
      {text:"¿El jugo de lulo me lo da en agua y bajito de azúcar?",en:"Lulo juice in water, light on sugar please?",source:"🍹 Jugos"},
      {text:"¿Me deja en la carrera séptima con calle setenta y dos?",en:"Drop me at Carrera 7 with Calle 72?",source:"🚕 Uber/Taxi"},
      {text:"Veci, ¿me regala un pandebono calientico y un perico?",en:"Neighbor, a warm pandebono and milk coffee please?",source:"🥐 Panadería"}
    ],
    daily:[
      {text:"Buenas, en portería dejaron un domicilio para el 402.",en:"Hi, delivery was left at front desk for apt 402.",source:"🏢 Portería"},
      {text:"Hágale pues, ahorita le mando un audio por WhatsApp.",en:"For sure, I'll send you a WhatsApp voice note soon.",source:"📱 WhatsApp"},
      {text:"¿Me hace un degradado bajito a los lados, por favor?",en:"Low fade on the sides, please?",source:"💈 Barbería"},
      {text:"¡No me digas! ¡Uy, qué embarrada contigo!",en:"No way! Oh man, I'm so sorry about that!",source:"💛 Empatía"}
    ]
  };
  const activePool=(lvlMode==="starter"&&userPrefs.focus==="all")?coachPools.starter:(coachPools[userPrefs.focus]||coachPools.travel);
  const dayOff=frameDayNumber()%activePool.length;
  const focusPicks=lvlMode==="starter"?[]:savedEntries.slice(0,2);
  for(let i=0;focusPicks.length<3&&i<activePool.length;i++){
    const cand=activePool[(dayOff+i)%activePool.length];
    if(!focusPicks.some(x=>x.text===cand.text))focusPicks.push(cand);
  }
  const blindEarOn=isBlindEarActive();
  const blindRevealed=new Set();
  let coachPlayIdx=0;
  focusStrip.innerHTML=`<div class="coach-focus-head"><div><span class="coach-focus-kicker">🎯 ENFOQUE DE HOY · ${blindEarOn?"BLIND-EAR WARM-UP":"60s WARM-UP"}</span><strong>${blindEarOn?"Listen first — tap each card to hear & reveal":"Say these 3 expressions out loud right now"}</strong></div><button type="button" class="coach-focus-playall">🔊 Play 1/3</button></div><div class="coach-focus-chips"></div>`;
  const playAllBtn=focusStrip.querySelector(".coach-focus-playall");
  const chipsWrap=focusStrip.querySelector(".coach-focus-chips");
  const renderFocusChips=()=>{
    chipsWrap.innerHTML="";
    focusPicks.forEach((item,idx)=>{
      const hiddenNow=blindEarOn&&!blindRevealed.has(item.text);
      const chip=document.createElement("button");chip.type="button";chip.className="coach-focus-chip"+(hiddenNow?" blind-masked":"");
      const subEn=(lvlMode==="starter"&&item.en&&!hiddenNow)?`<small class="coach-chip-en">${escapeVocabHtml(item.en)}</small>`:"";
      chip.innerHTML=`<span class="coach-chip-tag">${item.starred?"⭐ Pinned":escapeVocabHtml(item.source||"Coach pick")}</span><strong>${hiddenNow?`🎧 Listen #${idx+1} (tap to hear & reveal)`:escapeVocabHtml(item.text)}</strong>${subEn}<span class="coach-chip-spk">🔊</span>`;
      chip.onclick=()=>{
        markPractice("phrases",item.text);
        speak(item.text,lvlMode==="starter"?0.65:0.78);
        if(blindEarOn&&!blindRevealed.has(item.text)){blindRevealed.add(item.text);renderFocusChips();}
      };
      chipsWrap.appendChild(chip);
    });
  };
  renderFocusChips();
  playAllBtn.onclick=()=>{
    const cur=focusPicks[coachPlayIdx%focusPicks.length];
    speak(cur.text,lvlMode==="starter"?0.65:0.78);
    if(blindEarOn){blindRevealed.add(cur.text);renderFocusChips();}
    coachPlayIdx=(coachPlayIdx+1)%focusPicks.length;
    playAllBtn.textContent=`🔊 Next (${coachPlayIdx+1}/${focusPicks.length})`;
  };
  root.appendChild(focusStrip);

  /* 4. Compact Stats + Secondary Practice Grid (collapsed for brand-new Starter learners) */
  if(lvlMode==="starter"&&done<3){
    const moreWrap=document.createElement("details");moreWrap.className="starter-more-tools";moreWrap.dataset.lessonView="today";
    moreWrap.innerHTML="<summary><span>🧰 More drills, stats &amp; error journal</span><small>Slot-Swapper · Review Cards</small></summary>";
    moreWrap.appendChild(quickGrid);
    renderProgressDashboard(moreWrap,done);
    renderSpeakingErrorJournal(moreWrap);
    root.appendChild(moreWrap);
  }else{
    root.appendChild(quickGrid);
    renderProgressDashboard(root,done);
    renderSpeakingErrorJournal(root);
  }
  /* Daily practice — one compact row (v22) */
  const daily=document.createElement("div");daily.className="daily-row";daily.dataset.lessonView="practice";
  const dr1=document.createElement("button");dr1.type="button";dr1.className="daily-card";
  dr1.innerHTML=`<div class="daily-icon">⚡</div><div class="daily-title">Rápida</div><div class="daily-sub">${RR_BANK.length} questions · answer under pressure</div>`;
  dr1.onclick=()=>{rrSession=0;renderRapida(false);};
  const dr2=document.createElement("button");dr2.type="button";dr2.className="daily-card";
  dr2.innerHTML="<div class='daily-icon'>💬</div><div class='daily-title'>Shadow a dialogue</div><div class='daily-sub'>Listen · hide a side · speak</div>";
  dr2.onclick=()=>{
    showPage("frases");
    const candidates=PHRASE_DIALOGUES.filter(d=>/Uber|direcciones|taxi|transporte|farmacia|restaurante/i.test(d.title));
    const d=(candidates.length?candidates:PHRASE_DIALOGUES)[frameDayNumber()%(candidates.length||PHRASE_DIALOGUES.length)];
    fraseReturnToLessons=true;renderFraseDialogue(d);
  };
  daily.appendChild(dr1);daily.appendChild(dr2);
  root.appendChild(daily);

  const missionLabel=document.createElement("div");missionLabel.className="fr-home-label";missionLabel.dataset.lessonView="practice";missionLabel.textContent=`🗣️ Conversation missions · ${Object.keys(missionProgress).length}/${CONVERSATION_MISSIONS.length} completed`;root.appendChild(missionLabel);
  const missionGrid=document.createElement("div");missionGrid.className="mission-grid";missionGrid.dataset.lessonView="practice";
  CONVERSATION_MISSIONS.forEach(m=>{const b=document.createElement("button");b.type="button";b.className="mission-home-card";b.innerHTML=`<span class="mission-home-icon">${missionProgress[m.id]?"✅":"🗣️"}</span><span class="mission-home-copy"><strong>${m.title}</strong><small>${m.scenario}</small></span>`;b.onclick=()=>renderMission(m);missionGrid.appendChild(b);});
  root.appendChild(missionGrid);

  const readingLabel=document.createElement("div");readingLabel.className="fr-home-label";readingLabel.dataset.lessonView="practice";readingLabel.textContent=`📖 Lecturas · ${Object.keys(readingProgress).length}/${READINGS.length} completed`;root.appendChild(readingLabel);
  const readingGrid=document.createElement("div");readingGrid.className="reading-home-grid";readingGrid.dataset.lessonView="practice";
  READINGS.forEach(reading=>{const b=document.createElement("button");b.type="button";b.className="reading-home-card";b.innerHTML=`<span class='reading-home-icon'>${readingProgress[reading.id]?"✅":"📖"}</span><span><strong>${reading.title}</strong><small>${reading.level} · ${reading.intro}</small></span><span>›</span>`;b.onclick=()=>renderReading(reading);readingGrid.appendChild(b);});
  root.appendChild(readingGrid);

  /* Lessons grouped into a speaking-first progression */
  const LESSON_STAGES=[
    {name:"🌱 Stage 1 · Start Here",sub:"Greetings, Colombian politeness, false-friend traps (cancelar/provocar), numbers, and repairing misunderstandings.",ids:["presentate","cortesia-colombiana","trampas-colombianas","plata","survival-communication","casa","gustos"]},
    {name:"🧭 Stage 2 · Travel and Survival",sub:"Airport, Uber, street safety (no dar papaya & 123), corrientazo lunches, panaderías & jugos, hotels, Nequi, restaurants, markets, dental/optical, and medical care.",ids:["aeropuerto-migracion","uber-ride","uber-completo","hotel-checkin","calle","direcciones","direcciones-cuadras","seguridad-emergencias","bancos-pagos","panaderia-jugos","almuerzo-corrientazo","cocina","restaurante-real","mercado-negociar","commands-repair","farmacia","medico-urgencias","odontologia-optica"]},
    {name:"🏠 Stage 3 · Daily Life",sub:"Migración & Cédula de Extranjería, ATMs & SIM cards, estratos & conjuntos, home repairs & utilities, Airbnb, WhatsApp, portería, office, barbershop, and finca trips.",ids:["trabajo","oficina-real","cajero-sim-tramites","migracion-bancos-ce","porteria-domicilios","arriendo-airbnb","estratos-barrios","hogar-reparaciones","whatsapp-audios","barberia","viajes-finca","daily-repair","planes","gerundios-actividades","sentirse"]},
    {name:"🧱 Stage 4 · Build Sentences",sub:"Present, future, past, contrast, perfect tenses, conditional, action chunks, connectors, and pronouns.",ids:["sentence-structure","action-chunks","connectors-v36","function-words","gram-presente","gram-futuro","gram-pasado","gram-pasado-historia","gram-pasado-contraste","gram-perfecto","gram-condicional","gram-pasado-perfecto","gram-futuro-perfecto","gram-subjuntivo","gram-necesidades","gram-conectores","gram-pronombres"]},
    {name:"🇨🇴 Stage 5 · Speak More Naturally",sub:"San Juan del Cesar & La Guajira (vallenato & family), Colombian wildcard verbs, dating & family, fútbol & conciertos, puentes & salsa, empathy, and diminutives.",ids:["san-juan-guajira","colombia","verbos-comodin","citas-familia","eventos-futbol-cultura","puentes-rumba-cultura","empatia-reacciones","muletillas-diminutivos","social-colombia-v36","gym-ciclovia","social-salida","fiesta-gathering","deportes-partido","gram-groserias"]},
    {name:"🎯 Stage 6 · Conversation Challenge",sub:"Read aloud, react quickly, and complete real speaking missions.",ids:["conversation-challenge"]}
  ];
  const roadmap=lpEl("lesson-roadmap");
  roadmap.dataset.lessonView="path";
  const pathSearch=document.createElement("input");pathSearch.type="search";pathSearch.className="content-search lesson-path-search";pathSearch.placeholder=`🔎 Search ${LESSONS.length} lessons (e.g. Uber, Nequi, pasado, barbería…)`;pathSearch.setAttribute("aria-label","Search lessons");
  roadmap.appendChild(pathSearch);
  const roadmapRow=lpEl("lesson-roadmap-row");
  LESSON_STAGES.forEach((stage,i)=>{const b=document.createElement("button");b.type="button";b.className="lesson-roadmap-btn";b.textContent=stage.name.replace(/^.*?Stage /,"Stage ");b.onclick=()=>{const target=document.getElementById("lesson-stage-"+i);if(target){target.open=true;target.scrollIntoView({behavior:"smooth",block:"start"});}};roadmapRow.appendChild(b);});
  roadmap.appendChild(roadmapRow);root.appendChild(roadmap);
  pathSearch.oninput=()=>{
    const q=pathSearch.value.trim().toLowerCase();
    root.querySelectorAll(".lesson-stage").forEach(st=>{
      let matchesInStage=0;
      st.querySelectorAll(".lesson-card").forEach(card=>{
        const hit=!q||card.textContent.toLowerCase().includes(q);
        card.style.display=hit?"":"none";
        if(hit)matchesInStage++;
      });
      st.style.display=(!q||matchesInStage>0)?"":"none";
      if(q&&matchesInStage>0)st.open=true;
    });
  };
  const tenseRoadmap=document.createElement("details");tenseRoadmap.className="tense-roadmap tense-roadmap-fold";tenseRoadmap.dataset.lessonView="path";
  tenseRoadmap.innerHTML="<summary class='tense-roadmap-summary'><span>🧭 <strong>Speaking Tense Roadmap</strong> <small>8 layers from Presente to Future Perfect</small></span><span class='tense-roadmap-chev'>⌄</span></summary><div class='tense-roadmap-body'><p>Learn the high-frequency patterns first, then add detail to your stories. The advanced forms are for recognition before production.</p><div class='tense-roadmap-grid'></div></div>";
  const tenseTargets=[
    ["Presente","Hablo / tengo","gram-presente","Core now"],["Near future","Voy a hacer","gram-futuro","Easy next step"],["Completed past","Fui / hice","gram-pasado","Tell what happened"],["Past contrast","Fui vs. iba","gram-pasado-contraste","Story detail"],["Present perfect","He hecho","gram-perfecto","Connected to now"],["Conditional","Me gustaría","gram-condicional","Polite and possible"],["Past perfect","Había hecho","gram-pasado-perfecto","Earlier past"],["Future perfect","Habré hecho","gram-futuro-perfecto","Advanced recognition"]
  ];
  const tenseGrid=tenseRoadmap.querySelector(".tense-roadmap-grid");tenseTargets.forEach(([label,pattern,id,sub],i)=>{const b=document.createElement("button");b.type="button";b.className="tense-roadmap-item";b.innerHTML=`<span class='tense-roadmap-number'>${i+1}</span><span><strong>${label}</strong><small>${pattern} · ${sub}</small></span><span>›</span>`;b.onclick=()=>{const lesson=LESSONS.find(l=>l.id===id);if(lesson)openLesson(lesson);else{showPage("gram");showGram(id);}};tenseGrid.appendChild(b);});
  root.appendChild(tenseRoadmap);
  let lessonNum=0;
  LESSON_STAGES.forEach((stage,stageIndex)=>{
    const stageLessons=stage.ids.map(id=>LESSONS.find(l=>l.id===id)).filter(Boolean);
    if(!stageLessons.length)return;
    const sDone=stageLessons.filter(l=>lessonProgress[l.id]).length;
    const stageWrap=document.createElement("details");stageWrap.className="lesson-stage";stageWrap.dataset.lessonView="path";stageWrap.id="lesson-stage-"+stageIndex;
    const isCurrentStage=!!(nextLesson&&stageLessons.some(l=>l.id===nextLesson.id));
    if(isCurrentStage||(!nextLesson&&stageIndex===0))stageWrap.open=true;
    const sh=document.createElement("summary");sh.className="stage-label";
    sh.innerHTML=`<div class="stage-label-main"><span>${stage.name}</span><span class="stage-count">${sDone}/${stageLessons.length}</span></div><div class="stage-sub">${stage.sub}</div><div class="stage-progress"><span style="width:${Math.round((sDone/Math.max(stageLessons.length,1))*100)}%"></span></div>`;
    stageWrap.appendChild(sh);
    if(stageIndex>=0&&stageIndex<=3&&sDone<stageLessons.length){
      const testBar=document.createElement("div");testBar.className="stage-testout-bar";
      testBar.innerHTML=`<span>Know the basics in this stage?</span><button type="button" class="stage-testout-btn">⚡ Test out (5Q)</button>`;
      testBar.querySelector("button").onclick=()=>openStageTestOut(stage,stageLessons);
      stageWrap.appendChild(testBar);
    }
    root.appendChild(stageWrap);
    stageLessons.forEach(lesson=>{
      lessonNum++;
      const recommended=nextLesson&&nextLesson.id===lesson.id;
      const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"")+(recommended?" recommended":"");card.dataset.lessonView="path";
      card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Recommended next</span>":""}</div><div class="lesson-sub">${lesson.sub}</div><div class="lesson-meta"><span>${lesson.difficulty}</span><span>${lesson.prereq||"Next step"}</span></div><div class="lesson-deeplinks"></div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
      const dlRow=card.querySelector(".lesson-deeplinks");
      [
        ["💬 Diálogo",()=>{showPage("frases");const d=lessonDialogue(lesson);if(d){fraseReturnToLessons=true;renderFraseDialogue(d);}}],
        ["📚 Vocab",()=>{showPage("vocab");if(typeof sCat==="function")sCat(lesson.vocab);}],
        ["⚡ Quiz",()=>{showPage("quiz");qBlitzPack=null;qMissedOnly=false;qCat=lesson.quizCat||"all";qMode=lesson.quizMode||"mixed";qFocus=lesson.quizFocus||"all";repasoLeft=0;resetQuizRound();syncQuizControls();nQ();}]
      ].forEach(([lbl,fn])=>{
        const b=document.createElement("button");b.type="button";b.className="lesson-deeplink-pill";b.textContent=lbl;
        b.onclick=e=>{e.stopPropagation();fn();};
        dlRow.appendChild(b);
      });
      card.onclick=()=>openLesson(lesson);
      card.querySelector(".lesson-check").onclick=(e)=>{e.stopPropagation();if(lessonProgress[lesson.id])delete lessonProgress[lesson.id];else lessonProgress[lesson.id]=true;saveLessons();renderLessons();};
      stageWrap.appendChild(card);
    });
  });
  /* Any lesson not assigned to a stage still shows (future-proofing weekly additions) */
  const staged=new Set(LESSON_STAGES.flatMap(s=>s.ids));
  LESSONS.filter(l=>!staged.has(l.id)).forEach(lesson=>{
    lessonNum++;
    const recommended=nextLesson&&nextLesson.id===lesson.id;
    const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"")+(recommended?" recommended":"");card.dataset.lessonView="path";
    card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}${recommended?" <span class='lesson-recommended'>▶ Recommended next</span>":""}</div><div class="lesson-sub">${lesson.sub}</div><div class="lesson-meta"><span>${lesson.difficulty}</span><span>${lesson.prereq||"Next step"}</span></div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
    card.onclick=()=>openLesson(lesson);
    card.querySelector(".lesson-check").onclick=(e)=>{e.stopPropagation();if(lessonProgress[lesson.id])delete lessonProgress[lesson.id];else lessonProgress[lesson.id]=true;saveLessons();renderLessons();};
    root.appendChild(card);
  });
  /* Progress backup lives at the bottom — rare-use utility (v22) */
  renderQuizAuditCard(root);
  const bkLabel=document.createElement("div");bkLabel.className="fr-home-label";bkLabel.dataset.lessonView="practice";bkLabel.textContent="💾 Progress backup";
  root.appendChild(bkLabel);
  /* Backup / restore progress (v17) */
  const bk=document.createElement("div");bk.className="backup-row";bk.dataset.lessonView="practice";
  const BK_KEYS=["esco-quiz-v1","esco-srs-v1","esco-speaking-errors-v1","esco-lesson-progress-v1","esco-mission-progress-v1","esco-reading-progress-v1","esco-routine-v1","esco-routine-v2","esco-routine-v3","esco-practice-v1","esco-days-v1"];
  const b1=document.createElement("button");b1.type="button";b1.className="backup-btn";b1.textContent="💾 Copy backup";
  b1.onclick=()=>{
    const data={};BK_KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v)data[k]=v;});
    const txt="ESCO-BACKUP:"+JSON.stringify(data);
    const done=()=>{b1.textContent="✅ Copied";setTimeout(()=>{b1.textContent="💾 Copy backup";},2000);};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>prompt("Copy this text and save it somewhere safe:",txt));
    else prompt("Copy this text and save it somewhere safe:",txt);
  };
  const b2=document.createElement("button");b2.type="button";b2.className="backup-btn";b2.textContent="📥 Restore";
  b2.onclick=()=>{
    const txt=prompt("Paste your backup here:");
    if(!txt)return;
    try{
      const data=JSON.parse(txt.replace(/^ESCO-BACKUP:/,""));
      Object.keys(data).forEach(k=>{if(BK_KEYS.includes(k))localStorage.setItem(k,data[k]);});
      alert("✅ Backup restored. The app will reload.");
      location.reload();
    }catch(e){alert("⚠️ That does not look like a valid backup.");}
  };
  bk.appendChild(b1);bk.appendChild(b2);root.appendChild(bk);
  setLessonView(lessonView);
}
renderLessons();

// ── Build Grammar ─────────────────────────────────────────────────────────────
function buildVerbVersatilityLab(sec){
  if(typeof VERB_VERSATILITY_ENGINE==="undefined"||!VERB_VERSATILITY_ENGINE.length)return;
  let vvIdx=0,vvPerson="yo",vvMode="explore",vvQuizKey="just",vvQuizPicked=null,vvRevealSet=new Set();
  const lab=document.createElement("section");lab.className="bridge-trainer-card vv-lab-card";
  const personsMeta=[["yo","🙋 Yo"],["tu","👋 Tú"],["vos","🌸 Vos"],["usted","🎩 Usted"],["nosotros","👥 Nosotros"]];
  const frameMeta=[
    ["past","⏮️ Past","Ya pasó"],
    ["just","🔄 Just Did","Acabo de…"],
    ["now","⚡ Right Now","En este momento"],
    ["future","⏭️ Going To","Voy a…"],
    ["polite","🙏 Polite Ask","Cortesía CO"]
  ];
  const pickQuizTarget=()=>{
    const keys=frameMeta.map(f=>f[0]);
    vvQuizKey=keys[Math.floor(Math.random()*keys.length)];
    vvQuizPicked=null;
  };
  const renderLab=()=>{
    const item=VERB_VERSATILITY_ENGINE[vvIdx%VERB_VERSATILITY_ENGINE.length];
    const pForms=(item.forms&&item.forms[vvPerson])||{};
    const blind=isBlindEarActive();
    lab.innerHTML=`<div class="bridge-kicker">⚡ 1-VERB → 5-TIMEFRAME VERSATILITY LAB (${vvIdx+1}/${VERB_VERSATILITY_ENGINE.length})</div>
      <div class="bridge-context">Pick an everyday verb &amp; person — switch between browsing all 5 timeframes or quizzing your timeframe reflexes:</div>
      <div class="vv-mode-row"></div>
      <div class="vv-verb-tabs" role="tablist" aria-label="Choose verb"></div>
      <div class="vv-person-tabs" role="tablist" aria-label="Choose person or register"></div>
      <div class="vv-body-slot"></div>
      <div class="tvc-why">💡 <strong>Colombian Shortcut:</strong> ${escapeVocabHtml(item.tip)}</div>`;
    const mWrap=lab.querySelector(".vv-mode-row");
    [["explore","📋 Explore 5 Timeframes"],["quiz","🎯 Quick Timeframe Quiz"]].forEach(([mk,mlbl])=>{
      const b=document.createElement("button");b.type="button";b.className="mf-chip"+(vvMode===mk?" active":"");
      b.textContent=mlbl;
      b.onclick=()=>{vvMode=mk;if(mk==="quiz")pickQuizTarget();renderLab();};
      mWrap.appendChild(b);
    });
    const vWrap=lab.querySelector(".vv-verb-tabs");
    VERB_VERSATILITY_ENGINE.forEach((v,i)=>{
      const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(i===vvIdx?" active":"");
      b.textContent=v.label;
      b.onclick=()=>{vvIdx=i;vvRevealSet.clear();if(vvMode==="quiz")pickQuizTarget();renderLab();};
      vWrap.appendChild(b);
    });
    const pWrap=lab.querySelector(".vv-person-tabs");
    personsMeta.forEach(([pk,plbl])=>{
      const b=document.createElement("button");b.type="button";b.className="mf-chip"+(pk===vvPerson?" active":"");
      b.textContent=plbl;
      b.onclick=()=>{
        vvPerson=pk;vvRevealSet.clear();
        if(vvMode==="quiz")pickQuizTarget();
        renderLab();
        if(vvMode==="explore"){const first=item.forms&&item.forms[pk]&&item.forms[pk].now;if(first)speak(first.es,0.78);}
      };
      pWrap.appendChild(b);
    });
    const slot=lab.querySelector(".vv-body-slot");
    if(vvMode==="quiz"){
      const targetMeta=frameMeta.find(f=>f[0]===vvQuizKey)||frameMeta[1];
      const correctObj=pForms[vvQuizKey];
      const distractors=frameMeta.filter(f=>f[0]!==vvQuizKey&&pForms[f[0]]).map(f=>({key:f[0],lbl:f[1],...pForms[f[0]]}));
      const pool=[{key:vvQuizKey,lbl:targetMeta[1],...correctObj},...distractors.slice(0,2)].sort((a,b)=>a.es.localeCompare(b.es));
      const qBox=document.createElement("div");qBox.className="vv-quiz-box";
      qBox.innerHTML=`<div class="vv-quiz-cue"><span class="vv-row-tag">${targetMeta[1]} · ${targetMeta[2]}</span><strong>Which Colombian phrase expresses: "${escapeVocabHtml(correctObj?correctObj.en:"")}"?</strong></div><div class="vv-quiz-opts"></div><div class="vv-quiz-fb"></div><div class="bridge-actions vv-quiz-acts"></div>`;
      const qOpts=qBox.querySelector(".vv-quiz-opts"),qFb=qBox.querySelector(".vv-quiz-fb"),qActs=qBox.querySelector(".vv-quiz-acts");
      pool.forEach(opt=>{
        const b=document.createElement("button");b.type="button";
        const isPick=vvQuizPicked===opt.key,isOk=opt.key===vvQuizKey;
        b.className="ear-check-btn"+(isPick?(isOk?" correct":" wrong"):"")+(vvQuizPicked&&isOk?" correct-hint":"");
        b.textContent=opt.es;
        b.onclick=()=>{
          vvQuizPicked=opt.key;
          speak(opt.es,0.78);
          renderLab();
        };
        qOpts.appendChild(b);
      });
      if(vvQuizPicked){
        qFb.innerHTML=vvQuizPicked===vvQuizKey
          ?`<div class="trampas-feedback-banner ok">✅ <strong>¡Exacto!</strong> "${escapeVocabHtml(correctObj.es)}"</div>`
          :`<div class="trampas-feedback-banner warn">💡 Look for <strong>${targetMeta[1]}</strong>: "${escapeVocabHtml(correctObj.es)}"</div>`;
        const nxt=document.createElement("button");nxt.type="button";nxt.className="lp-nav-btn primary";nxt.textContent="Next Timeframe Check →";
        nxt.onclick=()=>{vvIdx=(vvIdx+1)%VERB_VERSATILITY_ENGINE.length;pickQuizTarget();renderLab();};
        qActs.appendChild(nxt);
      }
      slot.appendChild(qBox);
      return;
    }
    const listWrap=document.createElement("div");listWrap.className="vv-tense-list";
    frameMeta.forEach(([fk,flbl,fsub])=>{
      const rowData=pForms[fk];
      if(!rowData)return;
      const rKey=`${item.id}|${vvPerson}|${fk}`;
      const masked=blind&&!vvRevealSet.has(rKey);
      const row=document.createElement("button");row.type="button";row.className="vv-tense-row"+(masked?" blind-masked":"");
      row.innerHTML=`<div class="vv-row-meta"><span class="vv-row-tag">${flbl}</span><small>${fsub}</small></div><div class="vv-row-copy"><strong>${masked?"🎧 Tap to hear &amp; reveal":escapeVocabHtml(rowData.es)}</strong><small>${masked?"Blind-Ear active — listen first":escapeVocabHtml(rowData.en)}</small></div><span class="vv-row-spk">🔊</span>`;
      row.onclick=()=>{
        markPractice("phrases",rowData.es);
        speak(rowData.es,0.78);
        if(masked){vvRevealSet.add(rKey);renderLab();}
      };
      listWrap.appendChild(row);
    });
    slot.appendChild(listWrap);
  };
  renderLab();
  sec.appendChild(lab);
}
function buildGram(id,data){
  const sec=document.getElementById("gs-"+id);sec.innerHTML="";
  if(id==="trucos"){
    const intro=document.createElement("div");intro.className="gram-intro";
    intro.innerHTML=`<div class="gram-intro-title">🧠 Memory Tricks for Colombian Spanish</div>
      <div class="gram-intro-text">Learn these patterns and you will sound much more natural, much faster.</div>`;
    sec.appendChild(intro);
    data.forEach((trick,i)=>{
      const item=document.createElement("div");item.className="trick-list-item";
      item.innerHTML=`<div class="trick-num">${i+1}</div>
        <div class="trick-item-text"><div class="trick-item-main">${trick.icon} ${trick.main}</div><div class="trick-item-sub">${trick.sub}</div></div>`;
      sec.appendChild(item);});return;
  }
  if(id==="pronombres"){buildPronombres(sec);return;}
  if(id==="reflexivos"){buildReflexivos(sec);return;}
  if(id==="presente"){buildVerbVersatilityLab(sec);}
  const intro=document.createElement("div");intro.className="gram-intro";
  const grammarMeta={perfecto:["✅","Present perfect"],condicional:["🙏","Conditional"],"pasado-perfecto":["⏪","Past perfect"],"futuro-perfecto":["⏩","Future perfect"]}[id];
  const grammarIcon=grammarMeta?grammarMeta[0]:(id==="presente"?"⚡":id==="pasado"?"⏮️":"⏭️");
  const grammarTitle=grammarMeta?grammarMeta[1]:id.charAt(0).toUpperCase()+id.slice(1);
  intro.innerHTML=`<div class="gram-intro-title">${grammarIcon} ${grammarTitle}</div>
    <div class="gram-intro-text">${data.intro}</div>`;
  sec.appendChild(intro);
  const trick=document.createElement("div");trick.className="trick-box";
  trick.innerHTML=`<div class="trick-title">🧠 Memory Trick</div><div class="trick-text">${data.trick}</div>`;
  sec.appendChild(trick);
  data.tables.forEach((table,ti)=>{
    const ct=document.createElement("div");ct.className="conj-table"+(ti>0?" collapsed":"");
    ct.innerHTML=`<div class="conj-hdr"><div><div class="conj-hdr-title">${table.title}</div><div class="conj-hdr-sub">${table.sub}</div></div><span class="conj-chevron">${ti>0?"▸":"▾"}</span></div>`;
    ct.querySelector(".conj-hdr").onclick=()=>{
      const closed=ct.classList.contains("collapsed");
      ct.classList.toggle("collapsed",!closed);
      ct.querySelector(".conj-chevron").textContent=closed?"▾":"▸";
    };
    table.rows.forEach(row=>{
      const r=document.createElement("div");r.className="conj-row";
      r.innerHTML=`<span class="conj-pronoun">${row.pro}</span><span class="conj-verb">${row.verb}</span><span class="conj-en">${row.en}</span><span class="conj-spk">🔊</span>`;
      r.onclick=()=>speak(row.tts,0.75);ct.appendChild(r);});sec.appendChild(ct);});
  const exLabel=document.createElement("div");exLabel.className="sl";exLabel.style.color="var(--muted)";exLabel.textContent="Ejemplos";sec.appendChild(exLabel);
  data.examples.forEach(ex=>{const card=document.createElement("div");card.className="example-card";
    card.innerHTML=`<div class="ex-info"><div class="ex-es">${ex.es}</div><div class="ex-en">${ex.en}</div></div><span class="ex-spk">🔊</span>`;
    card.onclick=()=>speak(ex.tts,0.75);sec.appendChild(card);});
}
function buildPronombres(sec){
  const intro=document.createElement("div");intro.className="gram-intro";
  intro.innerHTML=`<div class="gram-intro-title">👤 Pronombres de Objeto</div>
    <div class="gram-intro-text">Lo/La/Le/Me/Te etc. These small words replace nouns and are placed BEFORE the verb. Mastering these makes you sound very natural in Colombian Spanish.</div>`;
  sec.appendChild(intro);
  [PRONOMBRES.directo,PRONOMBRES.indirecto].forEach(table=>{
    const pt=document.createElement("div");pt.className="pro-table";
    pt.innerHTML=`<div class="pro-hdr" style="background:${table.color}22"><div class="pro-hdr-title" style="color:${table.color}">${table.title}</div><div class="pro-hdr-sub">${table.sub}</div></div>`;
    table.rows.forEach(row=>{
      const r=document.createElement("div");r.className="pro-row";
      r.innerHTML=`<span class="pro-word" style="color:${table.color}">${row.w}</span><div style="flex:1"><div class="pro-meaning">${row.meaning}</div><div class="pro-example">${row.example}</div></div><span class="pro-spk">🔊</span>`;
      r.onclick=()=>speak(row.tts,0.8);pt.appendChild(r);});
    sec.appendChild(pt);});
  const trick=document.createElement("div");trick.className="trick-box";
  trick.innerHTML=`<div class="trick-title">🧠 Colombian Tip</div><div class="trick-text">${PRONOMBRES.trick}</div>`;
  sec.appendChild(trick);
  const exLabel=document.createElement("div");exLabel.className="sl";exLabel.style.color="var(--muted)";exLabel.textContent="Ejemplos";sec.appendChild(exLabel);
  PRONOMBRES.examples.forEach(ex=>{const card=document.createElement("div");card.className="example-card";
    card.innerHTML=`<div class="ex-info"><div class="ex-es">${ex.es}</div><div class="ex-en">${ex.en}</div></div><span class="ex-spk">🔊</span>`;
    card.onclick=()=>speak(ex.tts,0.75);sec.appendChild(card);});
}
function buildReflexivos(sec){
  const intro=document.createElement("div");intro.className="gram-intro";
  intro.innerHTML=`<div class="gram-intro-title">🔄 Verbos Reflexivos</div>
    <div class="gram-intro-text">Reflexive verbs have 'se' at the end of the infinitive (llamarse, levantarse). When conjugated, the pronoun (me/te/se/nos) goes BEFORE the verb. Very common in everyday Colombian Spanish.</div>`;
  sec.appendChild(intro);
  const trick=document.createElement("div");trick.className="trick-box";
  trick.innerHTML=`<div class="trick-title">🧠 The Pattern</div><div class="trick-text">Think of reflexive verbs as doing something TO YOURSELF. Me llamo = I call myself. Me levanto = I lift myself up (get up). Se llama = He/she calls himself/herself. The "me/te/se" always matches the subject!</div>`;
  sec.appendChild(trick);
  REFLEXIVOS.forEach(verb=>{
    const card=document.createElement("div");card.className="reflex-card";
    const hdr=document.createElement("div");hdr.className="reflex-hdr";
    hdr.innerHTML=`<span class="reflex-hdr-title">${verb.inf}</span><span class="reflex-hdr-en">${verb.en} 🔊</span>`;
    hdr.onclick=()=>speak(verb.inf,0.75);card.appendChild(hdr);
    verb.forms.forEach(row=>{
      const r=document.createElement("div");r.className="reflex-row";
      r.innerHTML=`<span class="reflex-pro">${row.p}</span><span class="reflex-verb">${row.v}</span><span class="reflex-en">${row.e}</span><span class="reflex-spk">🔊</span>`;
      r.onclick=()=>speak(row.v,0.75);card.appendChild(r);});
    const exDiv=document.createElement("div");exDiv.style.cssText="padding:11px 14px;border-top:1px solid rgba(52,211,153,0.15);background:rgba(52,211,153,0.04);cursor:pointer;";
    exDiv.innerHTML=`<div style="font-size:0.9rem;font-weight:700;color:#fff">${verb.example.es}</div>
      <div style="font-size:0.72rem;color:var(--muted);font-style:italic;margin-top:3px">${verb.example.en} 🔊</div>`;
    exDiv.onclick=()=>speak(verb.example.es,0.75);card.appendChild(exDiv);
    sec.appendChild(card);});
}
let bridgeDrillIdx=0;
function applyHablarTab(tabId){
  userPrefs.hablarTab=tabId||"regions";
  saveUserPrefs();
  const sec=document.getElementById("gs-estructura");if(!sec)return;
  sec.querySelectorAll(".hablar-subtab").forEach(b=>{
    const on=b.dataset.tab===userPrefs.hablarTab;
    b.classList.toggle("active",on);
    b.setAttribute("aria-pressed",on?"true":"false");
  });
  sec.querySelectorAll("[data-hablar-group]").forEach(el=>{
    el.hidden=(userPrefs.hablarTab!=="all"&&el.dataset.hablarGroup!==userPrefs.hablarTab);
  });
}
function buildSpeakingGuide(){
  const sec=document.getElementById("gs-estructura");if(!sec)return;sec.innerHTML="";
  const intro=document.createElement("div");intro.className="gram-intro";intro.innerHTML="<div class='gram-intro-title'>🇨🇴 Guías &amp; Hablar Naturalmente</div><div class='gram-intro-text'>Switch between Colombian regions, illustrated guides, street-speed contractions, and false-friend traps without scrolling through one giant wall.</div>";sec.appendChild(intro);
  const subBar=document.createElement("div");subBar.className="hablar-subtabs";subBar.setAttribute("role","tablist");subBar.setAttribute("aria-label","Guías categories");
  [
    ["regions","🗺️ Regions & Switcher"],
    ["visual","🖼️ Visual Guides"],
    ["ear","🎧 Street Ear"],
    ["trampas","🪤 Bridges & Trampas"],
    ["all","📋 All"]
  ].forEach(([id,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="hablar-subtab";b.dataset.tab=id;b.textContent=lbl;
    b.onclick=()=>applyHablarTab(id);
    subBar.appendChild(b);
  });
  sec.appendChild(subBar);
  if(typeof CONNECTOR_BRIDGE_DRILLS!=="undefined"&&CONNECTOR_BRIDGE_DRILLS.length){
    const trainer=document.createElement("section");trainer.className="bridge-trainer-card";trainer.dataset.hablarGroup="trampas";
    const renderBridge=()=>{
      const d=CONNECTOR_BRIDGE_DRILLS[bridgeDrillIdx%CONNECTOR_BRIDGE_DRILLS.length];
      const fullEs=(d.thoughtA+d.correct+d.thoughtB).replace(/\s+/g," ").trim();
      trainer.innerHTML=`<div class="bridge-kicker">🔗 INTERACTIVE BRIDGE TRAINER · ${bridgeDrillIdx+1} OF ${CONNECTOR_BRIDGE_DRILLS.length}</div>
        <div class="bridge-context">${escapeVocabHtml(d.context)}</div>
        <div class="bridge-sentence-box">
          <span class="bridge-part">${escapeVocabHtml(d.thoughtA)}</span>
          <span class="bridge-slot" id="bridge-slot-label"> [ choose bridge ] </span>
          <span class="bridge-part">${escapeVocabHtml(d.thoughtB)}</span>
        </div>
        <div class="bridge-en">${escapeVocabHtml(d.en)}</div>
        <div class="bridge-choices"></div>
        <div class="bridge-feedback" aria-live="polite">Tap the Colombian connector that links these two ideas:</div>
        <div class="bridge-actions"></div>`;
      const choicesWrap=trainer.querySelector(".bridge-choices");
      const fb=trainer.querySelector(".bridge-feedback");
      const slotEl=trainer.querySelector("#bridge-slot-label");
      d.choices.forEach(ch=>{
        const b=document.createElement("button");b.type="button";b.className="bridge-choice-btn";b.textContent=ch.trim();
        b.onclick=()=>{
          if(ch===d.correct){
            choicesWrap.querySelectorAll("button").forEach(x=>x.classList.remove("wrong"));
            b.classList.add("correct");
            slotEl.textContent=" "+ch.trim()+" ";
            slotEl.classList.add("filled");
            fb.innerHTML=`✅ <strong>${escapeVocabHtml(fullEs)}</strong><br><small>💡 ${escapeVocabHtml(d.tip)}</small>`;
            markPractice("phrases",fullEs);
            /* Synchronous speak inside tap handler for iPhone Safari */
            speak(fullEs,0.75);
          }else{
            b.classList.add("wrong");
            fb.textContent="Try another connector — listen for what fits the meaning in brackets.";
          }
        };
        choicesWrap.appendChild(b);
      });
      const acts=trainer.querySelector(".bridge-actions");
      const hearFull=document.createElement("button");hearFull.type="button";hearFull.className="lp-nav-btn";hearFull.textContent="🔊 Hear full sentence";
      hearFull.onclick=()=>speak(fullEs,0.75);
      const nextDrill=document.createElement("button");nextDrill.type="button";nextDrill.className="lp-nav-btn primary";nextDrill.textContent="Next bridge drill →";
      nextDrill.onclick=()=>{bridgeDrillIdx=(bridgeDrillIdx+1)%CONNECTOR_BRIDGE_DRILLS.length;renderBridge();};
      acts.append(hearFull,nextDrill);
      attachMic(acts,fullEs,"phrases");
    };
    renderBridge();
    sec.appendChild(trainer);
  }
  if(typeof REGISTER_SWITCHER!=="undefined"&&REGISTER_SWITCHER.length){
    let regIdx=0,activeReg="ust";
    const regCard=document.createElement("section");regCard.className="bridge-trainer-card register-switcher-card";regCard.dataset.hablarGroup="regions";
    const regMeta={
      ust:{badge:"🎩 Usted",region:"Bogotá · Formal & Affectionate"},
      tu:{badge:"👋 Tú",region:"Bogotá Peers · Caribbean Coast"},
      vos:{badge:"🌸 Vos",region:"Medellín (Paisa) · Cali (Valluno)"},
      sumerce:{badge:"🏔️ Sumercé",region:"Bogotá · Boyacá Warm Polite"}
    };
    const renderReg=()=>{
      const item=REGISTER_SWITCHER[regIdx%REGISTER_SWITCHER.length];
      const cur=item[activeReg]||item.ust;
      regCard.innerHTML=`<div class="bridge-kicker">🗣️ COLOMBIAN REGISTER SWITCHER · ${regIdx+1} OF ${REGISTER_SWITCHER.length}</div>
        <div class="bridge-context">${escapeVocabHtml(item.intent)}</div>
        <div class="bridge-en">${escapeVocabHtml(item.when)}</div>
        <div class="reg-tabs-row"></div>
        <div class="reg-active-box" title="Tap to hear">
          <div class="reg-active-region">${escapeVocabHtml(regMeta[activeReg].badge)} · ${escapeVocabHtml(regMeta[activeReg].region)}</div>
          <div class="reg-active-es">${escapeVocabHtml(cur.es)} 🔊</div>
          <div class="reg-active-note">💡 ${escapeVocabHtml(cur.note)}</div>
        </div>
        <div class="reg-compare-grid"></div>
        <div class="bridge-actions"></div>`;
      const tabsRow=regCard.querySelector(".reg-tabs-row");
      Object.entries(regMeta).forEach(([k,m])=>{
        const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(k===activeReg?" active":"");
        b.textContent=m.badge;
        b.onclick=()=>{
          activeReg=k;
          const picked=item[k]||item.ust;
          renderReg();
          /* Synchronous speak inside tap handler for iPhone Safari */
          speak(picked.es,0.75);
        };
        tabsRow.appendChild(b);
      });
      const activeBox=regCard.querySelector(".reg-active-box");
      activeBox.onclick=()=>speak(cur.es,0.75);
      const cmpGrid=regCard.querySelector(".reg-compare-grid");
      Object.entries(regMeta).forEach(([k,m])=>{
        const v=item[k];if(!v)return;
        const row=document.createElement("button");row.type="button";row.className="reg-compare-row"+(k===activeReg?" current":"");
        row.innerHTML=`<span class="reg-cmp-badge">${escapeVocabHtml(m.badge)}</span><span class="reg-cmp-es">${escapeVocabHtml(v.es)}</span><span>🔊</span>`;
        row.onclick=()=>{activeReg=k;renderReg();speak(v.es,0.75);};
        cmpGrid.appendChild(row);
      });
      const acts=regCard.querySelector(".bridge-actions");
      const hearBtn=document.createElement("button");hearBtn.type="button";hearBtn.className="lp-nav-btn";hearBtn.textContent="🔊 Hear selected";
      hearBtn.onclick=()=>speak(cur.es,0.75);
      const nextBtn=document.createElement("button");nextBtn.type="button";nextBtn.className="lp-nav-btn primary";nextBtn.textContent="Next situation →";
      nextBtn.onclick=()=>{regIdx=(regIdx+1)%REGISTER_SWITCHER.length;renderReg();};
      acts.append(hearBtn,nextBtn);
      attachMic(acts,cur.es,"phrases");
    };
    renderReg();
    sec.appendChild(regCard);
  }
  if(typeof STREET_GRID_DECODER!=="undefined"&&STREET_GRID_DECODER.length){
    let gridIdx=0;
    const gridCard=document.createElement("section");gridCard.className="bridge-trainer-card street-grid-card";gridCard.dataset.hablarGroup="visual";
    const renderGrid=()=>{
      const g=STREET_GRID_DECODER[gridIdx%STREET_GRID_DECODER.length];
      gridCard.innerHTML=`<div class="bridge-kicker">🧭 COLOMBIAN STREET GRID & SAFETY DECODER</div>
        <div class="bridge-context">Tap any piece of a Colombian address to decode how it works:</div>
        <div class="street-formula-bar"></div>
        <div class="street-detail-box">
          <div class="street-detail-label">${escapeVocabHtml(g.label)} — ${escapeVocabHtml(g.title)}</div>
          <p class="street-detail-explain">${escapeVocabHtml(g.explain)}</p>
          <button type="button" class="street-example-btn"><strong>🗣️ ${escapeVocabHtml(g.exampleEs)}</strong><small>${escapeVocabHtml(g.exampleEn)}</small><span>🔊</span></button>
        </div>`;
      const fBar=gridCard.querySelector(".street-formula-bar");
      STREET_GRID_DECODER.forEach((seg,idx)=>{
        const b=document.createElement("button");b.type="button";b.className="street-seg-chip"+(idx===gridIdx?" active":"");
        b.textContent=seg.part;
        b.onclick=()=>{gridIdx=idx;renderGrid();speak(seg.exampleEs,0.75);};
        fBar.appendChild(b);
      });
      const exBtn=gridCard.querySelector(".street-example-btn");
      exBtn.onclick=()=>speak(g.exampleEs,0.75);
    };
    renderGrid();
    sec.appendChild(gridCard);
  }
  if(typeof TEXTBOOK_VS_COLOMBIAN!=="undefined"&&TEXTBOOK_VS_COLOMBIAN.length){
    let tvcIdx=0;
    const tvcCard=document.createElement("section");tvcCard.className="bridge-trainer-card tvc-switcher-card";tvcCard.dataset.hablarGroup="ear";
    const renderTvc=()=>{
      const item=TEXTBOOK_VS_COLOMBIAN[tvcIdx%TEXTBOOK_VS_COLOMBIAN.length];
      tvcCard.innerHTML=`<div class="bridge-kicker">🆚 TEXTBOOK SPANISH VS. NATURAL COLOMBIAN · ${tvcIdx+1} OF ${TEXTBOOK_VS_COLOMBIAN.length}</div>
        <div class="bridge-context">${escapeVocabHtml(item.context)}</div>
        <div class="bridge-en">${escapeVocabHtml(item.en)}</div>
        <div class="tvc-compare-pair">
          <button type="button" class="tvc-box tvc-textbook" title="Tap to hear textbook phrasing">
            <span class="tvc-tag">❌ Too Textbook / Stiff</span>
            <strong>${escapeVocabHtml(item.textbook)}</strong>
          </button>
          <button type="button" class="tvc-box tvc-colombian" title="Tap to hear natural Colombian phrasing">
            <span class="tvc-tag">✅ Natural Colombian Upgrade 🔊</span>
            <strong>${escapeVocabHtml(item.colombian)}</strong>
          </button>
        </div>
        <div class="tvc-why">💡 <strong>Why this works in Colombia:</strong> ${escapeVocabHtml(item.why)}</div>
        <div class="bridge-actions"></div>`;
      tvcCard.querySelector(".tvc-textbook").onclick=()=>speak(item.textbook,0.75);
      tvcCard.querySelector(".tvc-colombian").onclick=()=>{markPractice("phrases",item.colombian);speak(item.colombian,0.75);};
      const acts=tvcCard.querySelector(".bridge-actions");
      const hearCol=document.createElement("button");hearCol.type="button";hearCol.className="lp-nav-btn";hearCol.textContent="🔊 Hear Colombian";
      hearCol.onclick=()=>{markPractice("phrases",item.colombian);speak(item.colombian,0.75);};
      const nextTvc=document.createElement("button");nextTvc.type="button";nextTvc.className="lp-nav-btn primary";nextTvc.textContent="Next upgrade →";
      nextTvc.onclick=()=>{tvcIdx=(tvcIdx+1)%TEXTBOOK_VS_COLOMBIAN.length;renderTvc();};
      acts.append(hearCol,nextTvc);
      if(typeof attachStarBtn==="function")attachStarBtn(acts,item.colombian,"Colombian Upgrade");
      attachMic(acts,item.colombian,"phrases");
    };
    renderTvc();
    sec.appendChild(tvcCard);
  }
  if(typeof REGIONAL_ATLAS!=="undefined"&&REGIONAL_ATLAS.length){
    let regAtlasIdx=0;
    const sjIdx=REGIONAL_ATLAS.findIndex(r=>r.id==="sanjuan-guajira");
    if(sjIdx>=0)regAtlasIdx=sjIdx;
    const atlasCard=document.createElement("section");atlasCard.className="bridge-trainer-card regional-atlas-card";atlasCard.dataset.hablarGroup="regions";
    const renderAtlas=()=>{
      const reg=REGIONAL_ATLAS[regAtlasIdx%REGIONAL_ATLAS.length];
      const regHero=(typeof REGION_IMAGES!=="undefined"&&REGION_IMAGES[reg.id])?`<div class="region-hero-banner"><img src="${REGION_IMAGES[reg.id]}" alt="${escapeVocabHtml(reg.title)}"/><span class="region-hero-badge">${escapeVocabHtml(reg.tab)}</span></div>`:"";
      atlasCard.innerHTML=`<div class="bridge-kicker">🗺️ COLOMBIAN REGIONAL ACCENT & SLANG ATLAS · ${REGIONAL_ATLAS.length} REGIONS (INCLUDING SAN JUAN DEL CESAR & GUAJIRA)</div>
        <div class="bridge-context">Tap a region to hear how family greetings, pronouns, food, and rhythm change across Colombia:</div>
        <div class="reg-tabs-row atlas-tabs" role="tablist" aria-label="Colombian regions"></div>
        ${regHero}
        <div class="comodin-sub">${escapeVocabHtml(reg.title)} — ${escapeVocabHtml(reg.vibe)}</div>
        <div class="comodin-chunks-grid atlas-items-grid"></div>`;
      const tRow=atlasCard.querySelector(".atlas-tabs");
      REGIONAL_ATLAS.forEach((r,idx)=>{
        const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(idx===regAtlasIdx?" active":"");
        b.setAttribute("role","tab");b.setAttribute("aria-selected",idx===regAtlasIdx?"true":"false");
        b.textContent=r.tab;
        b.onclick=()=>{
          regAtlasIdx=idx;
          renderAtlas();
          if(r.items&&r.items[0])speak(r.items[0].es,0.75);
        };
        tRow.appendChild(b);
      });
      const grid=atlasCard.querySelector(".atlas-items-grid");
      (reg.items||[]).forEach(it=>{
        const row=document.createElement("div");row.className="comodin-chunk-card atlas-item-card";
        row.setAttribute("role","button");row.setAttribute("tabindex","0");
        row.innerHTML=`<div class="comodin-chunk-head"><span class="comodin-chunk-pill">${escapeVocabHtml(it.category)}</span><span class="comodin-chunk-en">${escapeVocabHtml(it.tip)}</span><div class="comodin-chunk-acts"></div></div>
          <div class="comodin-chunk-es">🗣️ ${escapeVocabHtml(it.es)} 🔊</div>
          <div class="comodin-chunk-esen">${escapeVocabHtml(it.en)}</div>`;
        const playIt=()=>{markPractice("phrases",it.es);if(typeof recordSrs==="function")recordSrs("atlas|"+it.es,true);speak(it.es,0.75);};
        row.onclick=e=>{if(e.target.closest("button"))return;playIt();};
        row.onkeydown=e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest("button")){e.preventDefault();playIt();}};
        const acts=row.querySelector(".comodin-chunk-acts");
        if(typeof attachStarBtn==="function")attachStarBtn(acts,it.es,reg.tab);
        attachMic(acts,it.es,"phrases");
        grid.appendChild(row);
      });
    };
    renderAtlas();
    sec.appendChild(atlasCard);
  }
  if(typeof REGIONAL_SWITCHER!=="undefined"&&REGIONAL_SWITCHER.length){
    let swIdx=0;
    const swCard=document.createElement("section");swCard.className="bridge-trainer-card regional-switcher-card";swCard.dataset.hablarGroup="regions";
    swCard.setAttribute("aria-label","Regional and pronoun switcher across San Juan del Cesar, Bogotá, Medellín, and Cali");
    const renderSwitcher=()=>{
      const cur=REGIONAL_SWITCHER[swIdx%REGIONAL_SWITCHER.length];
      swCard.innerHTML=`<div class="bridge-kicker">🧭 COMPARADOR REGIONAL · SAN JUAN DEL CESAR VS. BOGOTÁ, MEDELLÍN & CALI (${swIdx+1}/${REGIONAL_SWITCHER.length})</div>
        <div class="bridge-context">Compare how the exact same everyday meaning changes pronouns (<em>tú / primo</em> vs. <em>usted / sumercé</em> vs. <em>vos / parce</em>) across Colombia:</div>
        <div class="reg-tabs-row sw-intent-tabs" role="tablist" aria-label="Everyday situations"></div>
        <div class="comodin-sub"><strong>${escapeVocabHtml(cur.intent)}</strong> — ${escapeVocabHtml(cur.context)}</div>
        <div class="comodin-chunks-grid sw-variants-grid"></div>`;
      const tRow=swCard.querySelector(".sw-intent-tabs");
      REGIONAL_SWITCHER.forEach((item,idx)=>{
        const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(idx===swIdx?" active":"");
        b.setAttribute("role","tab");b.setAttribute("aria-selected",idx===swIdx?"true":"false");
        b.textContent=item.intent;
        b.onclick=()=>{swIdx=idx;renderSwitcher();if(item.variants&&item.variants[0])speak(item.variants[0].es,0.75);};
        tRow.appendChild(b);
      });
      const vGrid=swCard.querySelector(".sw-variants-grid");
      (cur.variants||[]).forEach(v=>{
        const row=document.createElement("div");row.className="comodin-chunk-card sw-variant-card";
        row.setAttribute("role","button");row.setAttribute("tabindex","0");
        row.innerHTML=`<div class="comodin-chunk-head"><span class="comodin-chunk-pill">${escapeVocabHtml(v.region)} · ${escapeVocabHtml(v.pronoun)}</span><span class="comodin-chunk-en">${escapeVocabHtml(v.note)}</span><div class="comodin-chunk-acts"></div></div>
          <div class="comodin-chunk-es">🗣️ ${escapeVocabHtml(v.es)} 🔊</div>
          <div class="comodin-chunk-esen">${escapeVocabHtml(v.en)}</div>`;
        const playV=()=>{markPractice("phrases",v.es);if(typeof recordSrs==="function")recordSrs("regsw|"+v.es,true);speak(v.es,0.75);};
        row.onclick=e=>{if(e.target.closest("button"))return;playV();};
        row.onkeydown=e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest("button")){e.preventDefault();playV();}};
        const acts=row.querySelector(".comodin-chunk-acts");
        if(typeof attachStarBtn==="function")attachStarBtn(acts,v.es,v.region);
        attachMic(acts,v.es,"phrases");
        vGrid.appendChild(row);
      });
    };
    renderSwitcher();
    sec.appendChild(swCard);
  }
  if(typeof VISUAL_GUIDES!=="undefined"&&VISUAL_GUIDES.length){
    const vgCard=document.createElement("section");vgCard.className="bridge-trainer-card visual-guides-card";vgCard.dataset.hablarGroup="visual";
    vgCard.setAttribute("aria-label","Visual Colombian guides and illustrated phrase posters");
    vgCard.innerHTML=`<div class="bridge-kicker">🖼️ GUÍAS VISUALES DE COLOMBIA · ILLUSTRATED CULTURAL POSTERS</div>
      <div class="bridge-context">Tap any poster to zoom in full-screen, or tap the phrase below each poster to hear &amp; practice it:</div>
      <div class="visual-guides-grid"></div>`;
    let lb=document.getElementById("vg-lightbox");
    if(!lb){
      lb=document.createElement("div");lb.id="vg-lightbox";lb.className="vg-lightbox";lb.hidden=true;
      lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");lb.setAttribute("aria-labelledby","vg-lb-title");
      lb.innerHTML=`<div class="vg-lightbox-panel"><div class="vg-lightbox-head"><div class="vg-lightbox-title" id="vg-lb-title"></div><button type="button" class="vg-lightbox-close" id="vg-lb-close" aria-label="Close visual guide">✕ Close</button></div><img id="vg-lb-img" src="" alt=""/><div class="vg-lightbox-cap" id="vg-lb-cap"></div></div>`;
      document.body.appendChild(lb);
      const closeLb=()=>{
        lb.hidden=true;
        if(lb._opener&&typeof lb._opener.focus==="function"){lb._opener.focus();lb._opener=null;}
      };
      lb.querySelector("#vg-lb-close").onclick=closeLb;
      lb.onclick=e=>{if(e.target===lb)closeLb();};
      document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!lb.hidden)closeLb();});
    }
    const vgGrid=vgCard.querySelector(".visual-guides-grid");
    VISUAL_GUIDES.forEach(vg=>{
      const tile=document.createElement("article");tile.className="visual-guide-tile";
      tile.innerHTML=`<button type="button" class="visual-guide-thumb" aria-label="Zoom ${escapeVocabHtml(vg.title)}">
          <img src="${vg.img}" alt="${escapeVocabHtml(vg.alt)}" loading="lazy"/>
          <span class="visual-guide-zoom">🔍 Zoom</span>
        </button>
        <div class="visual-guide-title">${escapeVocabHtml(vg.title)}</div>
        <div class="visual-guide-sub">${escapeVocabHtml(vg.sub)}</div>
        <div class="visual-guide-cap">${escapeVocabHtml(vg.caption)}</div>
        <div class="visual-guide-phrase" role="button" tabindex="0" aria-label="Listen to ${escapeVocabHtml(vg.es)}">
          <div class="comodin-chunk-head"><span class="comodin-chunk-pill">${escapeVocabHtml(vg.region)}</span><div class="comodin-chunk-acts"></div></div>
          <div class="visual-guide-es">🗣️ ${escapeVocabHtml(vg.es)} 🔊</div>
          <div class="visual-guide-en">${escapeVocabHtml(vg.en)}</div>
        </div>`;
      const thumb=tile.querySelector(".visual-guide-thumb");
      thumb.onclick=()=>{
        lb._opener=thumb;
        lb.querySelector("#vg-lb-title").textContent=vg.title;
        const im=lb.querySelector("#vg-lb-img");im.src=vg.img;im.alt=vg.alt;
        lb.querySelector("#vg-lb-cap").textContent=vg.caption;
        lb.hidden=false;
        lb.querySelector("#vg-lb-close").focus();
      };
      const phraseBox=tile.querySelector(".visual-guide-phrase");
      const playVg=()=>{markPractice("phrases",vg.es);if(typeof recordSrs==="function")recordSrs("vg|"+vg.es,true);speak(vg.es,0.75);};
      phraseBox.onclick=e=>{if(e.target.closest("button"))return;playVg();};
      phraseBox.onkeydown=e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest("button")){e.preventDefault();playVg();}};
      const acts=phraseBox.querySelector(".comodin-chunk-acts");
      if(typeof attachStarBtn==="function")attachStarBtn(acts,vg.es,vg.region);
      attachMic(acts,vg.es,"phrases");
      vgGrid.appendChild(tile);
    });
    sec.appendChild(vgCard);
  }
  if(typeof STREET_EAR_LINKER!=="undefined"&&STREET_EAR_LINKER.length){
    let earIdx=0,earGuess=null;
    const earCard=document.createElement("section");earCard.className="bridge-trainer-card street-ear-card";earCard.dataset.hablarGroup="ear";
    earCard.setAttribute("aria-label","Street-speed contractions and ear comprehension trainer");
    const renderEar=()=>{
      const len=STREET_EAR_LINKER.length;
      const item=STREET_EAR_LINKER[earIdx%len];
      const earBlind=isBlindEarActive()&&earGuess===null;
      const d1=STREET_EAR_LINKER[(earIdx+3)%len];
      const d2=STREET_EAR_LINKER[(earIdx+7)%len];
      const rawChoices=[
        {id:"correct",label:`${item.carefulEs} — ${item.en}`,correct:true},
        {id:"d1",label:`${d1.carefulEs} — ${d1.en}`,correct:false},
        {id:"d2",label:`${d2.carefulEs} — ${d2.en}`,correct:false}
      ];
      const shift=earIdx%3;
      const choices=rawChoices.slice(shift).concat(rawChoices.slice(0,shift));
      earCard.innerHTML=`<div class="bridge-kicker">🎧 CÓMO SUENA EN LA CALLE · STREET-SPEED CONTRACTIONS (${earIdx+1}/${len})</div>
        <div class="bridge-context">${escapeVocabHtml(item.context)} — ${earBlind?"Blind-Ear active: tap street speech first, then pick the matching meaning:":"Listen first, then test your ear below:"}</div>
        <div class="tvc-compare-pair">
          <button type="button" class="tvc-box ear-careful" title="Tap to hear careful speed">
            <span class="tvc-tag">🐢 Careful / Written Spanish (0.65x)</span>
            <strong>${escapeVocabHtml(earGuess!==null?item.carefulEs:"Tap or answer below to reveal careful form")}</strong>
          </button>
          <button type="button" class="tvc-box tvc-colombian ear-street" title="Tap to hear natural street speed">
            <span class="tvc-tag">⚡ How It Sounds on the Street (0.85x) 🔊</span>
            <strong>${escapeVocabHtml(earBlind?"🎧 Tap here to listen to street speed":item.streetEs)}</strong>
            <small class="ear-phonetic">${earBlind?"(Hidden in Blind-Ear until you answer)":"🎵 Rhythm: "+escapeVocabHtml(item.phoneticHint||"")}</small>
          </button>
        </div>
        <div class="ear-check-box" role="group" aria-label="Street ear comprehension check">
          <div class="rp-options-label">${earBlind?"🎯 Quick Ear Check: Listen above, then pick the real meaning:":"🎯 Quick Ear Check: What does <strong>\""+escapeVocabHtml(item.streetEs)+"\"</strong> mean?"}</div>
          <div class="ear-check-options"></div>
          <div class="ear-check-feedback" role="region" aria-live="polite"></div>
        </div>
        <div class="tvc-why">💡 <strong>Ear Linker Tip:</strong> ${escapeVocabHtml(item.tip)}</div>
        <div class="bridge-actions"></div>`;
      earCard.querySelector(".ear-careful").onclick=()=>{earGuess=earGuess||"correct";speak(item.carefulEs,0.65);renderEar();};
      earCard.querySelector(".ear-street").onclick=()=>{markPractice("phrases",item.streetEs);speak(item.streetEs,0.85);};
      const optWrap=earCard.querySelector(".ear-check-options");
      choices.forEach(ch=>{
        const b=document.createElement("button");b.type="button";
        const isPicked=earGuess===ch.id;
        b.className="ear-check-btn"+(isPicked?(ch.correct?" correct":" wrong"):"")+(earGuess!==null&&ch.correct?" correct-hint":"");
        b.setAttribute("aria-pressed",isPicked?"true":"false");
        b.textContent=ch.label;
        b.onclick=()=>{
          earGuess=ch.id;
          markPractice("phrases",item.streetEs);
          if(typeof recordSrs==="function")recordSrs("ear|"+item.streetEs,!!ch.correct);
          if(!ch.correct&&typeof recordSpeakingError==="function")recordSpeakingError(item.streetEs,"Street Ear");
          if(ch.correct&&typeof clearSpeakingError==="function")clearSpeakingError(item.streetEs);
          speak(item.carefulEs,0.75);
          renderEar();
        };
        optWrap.appendChild(b);
      });
      if(earGuess!==null){
        const pickedObj=choices.find(c=>c.id===earGuess);
        const fb=earCard.querySelector(".ear-check-feedback");
        fb.innerHTML=pickedObj&&pickedObj.correct
          ?`<div class="trampas-feedback-banner ok">✅ <strong>¡Buen oído!</strong> "${escapeVocabHtml(item.streetEs)}" links <strong>${escapeVocabHtml(item.carefulEs)}</strong> (${escapeVocabHtml(item.en)}).</div>`
          :`<div class="trampas-feedback-banner warn">👂 <strong>Close!</strong> "${escapeVocabHtml(item.streetEs)}" is actually <strong>${escapeVocabHtml(item.carefulEs)}</strong> (${escapeVocabHtml(item.en)}).</div>`;
      }
      const acts=earCard.querySelector(".bridge-actions");
      const slowBtn=document.createElement("button");slowBtn.type="button";slowBtn.className="lp-nav-btn";slowBtn.textContent="🐢 Careful (0.65x)";
      slowBtn.onclick=()=>speak(item.carefulEs,0.65);
      const fastBtn=document.createElement("button");fastBtn.type="button";fastBtn.className="lp-nav-btn";fastBtn.textContent="⚡ Street (0.85x)";
      fastBtn.onclick=()=>{markPractice("phrases",item.streetEs);speak(item.streetEs,0.85);};
      const nextEar=document.createElement("button");nextEar.type="button";nextEar.className="lp-nav-btn primary";nextEar.textContent="Next contraction →";
      nextEar.onclick=()=>{earIdx=(earIdx+1)%len;earGuess=null;renderEar();};
      acts.append(slowBtn,fastBtn,nextEar);
      if(typeof attachStarBtn==="function")attachStarBtn(acts,item.streetEs,"Street Ear");
    };
    renderEar();
    sec.appendChild(earCard);
  }
  if(typeof TRAMPAS_COLOMBIANAS!=="undefined"&&TRAMPAS_COLOMBIANAS.length){
    let trIdx=0,trPredicted=null;
    const trCard=document.createElement("section");trCard.className="bridge-trainer-card trampas-decoder-card";trCard.dataset.hablarGroup="trampas";
    trCard.setAttribute("aria-label","Colombian false friends prediction and decoder trainer");
    const renderTrap=()=>{
      const t=TRAMPAS_COLOMBIANAS[trIdx%TRAMPAS_COLOMBIANAS.length];
      const opts=trIdx%2===0
        ?[{id:"real",label:t.realMeaning,isReal:true},{id:"trap",label:t.wrongGuess,isReal:false}]
        :[{id:"trap",label:t.wrongGuess,isReal:false},{id:"real",label:t.realMeaning,isReal:true}];
      const revealed=trPredicted!==null;
      trCard.innerHTML=`<div class="bridge-kicker">🪤 TRAMPAS COLOMBIANAS · FALSE FRIENDS DECODER (${trIdx+1}/${TRAMPAS_COLOMBIANAS.length})</div>
        <div class="bridge-context">Colombian expression: <strong>"${escapeVocabHtml(t.trap)}"</strong></div>
        <div class="street-grid-example" role="button" tabindex="0" title="Tap or press Enter to hear example" aria-label="Spanish example: ${escapeVocabHtml(t.es)}. Tap to hear audio.">
          <div class="street-grid-es">🗣️ ${escapeVocabHtml(t.es)} 🔊</div>
          <div class="street-grid-en">${revealed?escapeVocabHtml(t.en):"<em>Predict the meaning below to unlock the full English translation…</em>"}</div>
        </div>
        <div class="trampas-predict-box" role="group" aria-label="Predict what this phrase means in Colombia">
          <div class="rp-options-label">🤔 Step 1 · Predict: What does <strong>"${escapeVocabHtml(t.trap)}"</strong> mean in Colombia?</div>
          <div class="ear-check-options trampas-predict-opts"></div>
        </div>
        <div class="trampas-reveal-slot" role="region" aria-live="polite"></div>
        <div class="bridge-actions"></div>`;
      const exBox=trCard.querySelector(".street-grid-example");
      const hearEx=()=>{markPractice("phrases",t.es);speak(t.es,0.75);};
      exBox.onclick=hearEx;
      exBox.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();hearEx();}};
      const pWrap=trCard.querySelector(".trampas-predict-opts");
      opts.forEach(o=>{
        const b=document.createElement("button");b.type="button";
        const isPicked=trPredicted===o.id;
        b.className="ear-check-btn"+(isPicked?(o.isReal?" correct":" wrong"):"")+(revealed&&o.isReal?" correct-hint":"");
        b.setAttribute("aria-pressed",isPicked?"true":"false");
        b.textContent=o.label;
        b.onclick=()=>{
          trPredicted=o.id;
          markPractice("phrases",t.es);
          if(typeof recordSrs==="function")recordSrs("trampa|"+t.trap,!!o.isReal);
          if(!o.isReal&&typeof recordSpeakingError==="function")recordSpeakingError(t.es,"Trampas Colombianas");
          if(o.isReal&&typeof clearSpeakingError==="function")clearSpeakingError(t.es);
          speak(t.es,0.75);
          renderTrap();
        };
        pWrap.appendChild(b);
      });
      const revSlot=trCard.querySelector(".trampas-reveal-slot");
      if(revealed){
        const chosenOpt=opts.find(o=>o.id===trPredicted);
        const banner=chosenOpt&&chosenOpt.isReal
          ?`<div class="trampas-feedback-banner ok">✅ <strong>¡Exacto!</strong> You spotted the real Colombian meaning.</div>`
          :(trPredicted==="reveal"
            ?`<div class="trampas-feedback-banner ok">👀 <strong>Meaning revealed:</strong> Compare the common literal interpretation with the real Colombian usage below.</div>`
            :`<div class="trampas-feedback-banner warn">🪤 <strong>Careful — that's the literal trap!</strong> See what it actually means in Colombia below:</div>`);
        revSlot.innerHTML=`${banner}
          <div class="tvc-compare-pair">
            <div class="tvc-box tvc-textbook">
              <span class="tvc-tag">⚠️ Common literal interpretation</span>
              <strong>${escapeVocabHtml(t.wrongGuess)}</strong>
            </div>
            <div class="tvc-box tvc-colombian">
              <span class="tvc-tag">✅ Real Meaning in Colombia</span>
              <strong>${escapeVocabHtml(t.realMeaning)}</strong>
            </div>
          </div>
          <div class="tvc-why">💡 <strong>Cultural Note:</strong> ${escapeVocabHtml(t.tip)}</div>`;
      }
      const acts=trCard.querySelector(".bridge-actions");
      const hearTrap=document.createElement("button");hearTrap.type="button";hearTrap.className="lp-nav-btn";hearTrap.textContent="🔊 Hear Example";
      hearTrap.onclick=hearEx;
      acts.appendChild(hearTrap);
      if(!revealed){
        const revBtn=document.createElement("button");revBtn.type="button";revBtn.className="lp-nav-btn";revBtn.textContent="👀 Reveal Meaning";
        revBtn.onclick=()=>{trPredicted="reveal";renderTrap();};
        acts.appendChild(revBtn);
      }
      const nextTrap=document.createElement("button");nextTrap.type="button";nextTrap.className="lp-nav-btn primary";nextTrap.textContent="Next trap →";
      nextTrap.onclick=()=>{trIdx=(trIdx+1)%TRAMPAS_COLOMBIANAS.length;trPredicted=null;renderTrap();};
      acts.appendChild(nextTrap);
      if(typeof attachStarBtn==="function")attachStarBtn(acts,t.es,"Trampas Colombianas");
      attachMic(acts,t.es,"phrases");
    };
    renderTrap();
    sec.appendChild(trCard);
  }
  SPEAKING_GUIDE.forEach((g,i)=>{
    const card=document.createElement("article");card.className="speaking-guide-card";card.dataset.hablarGroup="trampas";
    card.innerHTML=`<div class='speaking-guide-number'>${i+1}</div><div class='speaking-guide-copy'><h3>${escapeVocabHtml(g.title)}</h3><div class='speaking-guide-formula'>${escapeVocabHtml(g.formula)}</div><p>${escapeVocabHtml(g.explain)}</p><div class='speaking-guide-mistake'>⚠️ ${escapeVocabHtml(g.mistake)}</div></div>`;
    (g.examples||[]).forEach(ex=>{const row=document.createElement("button");row.type="button";row.className="speaking-guide-example";row.innerHTML=`<strong>${escapeVocabHtml(ex.es)}</strong><small>${escapeVocabHtml(ex.en)}</small><span>🔊</span>`;row.onclick=()=>speak(ex.tts||ex.es,0.75);card.appendChild(row);});
    const drill=document.createElement("div");drill.className="speaking-guide-drill";drill.textContent="🗣️ Try it: "+g.exercise;card.appendChild(drill);sec.appendChild(card);
  });
  applyHablarTab(userPrefs.hablarTab||"regions");
}
["presente","pasado","pasado-contraste","futuro","perfecto","condicional","pasado-perfecto","futuro-perfecto","subjuntivo","trucos"].forEach(id=>buildGram(id,GRAMMAR[id]));
buildGram("pronombres");buildGram("reflexivos");
buildSpeakingGuide();

/* Grouped grammar navigation (v23): Tiempos / Pronombres / Patrones */
const GRAM_GROUPS={
  tiempos:{label:"⏱️ Tiempos",items:[["presente","⚡ Presente"],["pasado","⏮️ Pasado"],["pasado-contraste","🎞️ Evento vs. contexto"],["futuro","⏭️ Futuro"],["perfecto","✅ He hecho"],["condicional","🙏 Haría / podría"],["pasado-perfecto","⏪ Había hecho"],["futuro-perfecto","⏩ Habré hecho"]]},
  pronombres:{label:"👤 Pronombres",items:[["pronombres","Lo / La / Le"]]},
  patrones:{label:"🧩 Patrones",items:[["reflexivos","🔄 Reflexivos"],["subjuntivo","🌱 Subjuntivo"],["trucos","🧠 Trucos"]]},
  estructura:{label:"🧱 Hablar",items:[["estructura","🧱 Estructura"]]}
};
let gramGroup="tiempos",gramSection="presente";
function showGramGroup(g){
  gramGroup=g;
  document.querySelectorAll(".ggroup").forEach(b=>b.classList.toggle("active",b.dataset.g===g));
  const sub=document.getElementById("gram-sub");
  const items=GRAM_GROUPS[g].items;
  sub.innerHTML="";
  sub.style.display=items.length>1?"flex":"none";
  items.forEach(([id,label])=>{
    const b=document.createElement("button");b.type="button";b.className="gtab";b.textContent=label;
    b.onclick=()=>showGram(id);
    sub.appendChild(b);
  });
  showGram(items[0][0]);
}
function showGram(id){
  gramSection=id;
  ["presente","pasado","pasado-contraste","futuro","perfecto","condicional","pasado-perfecto","futuro-perfecto","pronombres","reflexivos","subjuntivo","trucos","estructura"].forEach(g=>{
    document.getElementById("gs-"+g).classList.toggle("active",g===id);
  });
  const sub=document.getElementById("gram-sub");
  if(sub){
    const items=GRAM_GROUPS[gramGroup].items;
    Array.from(sub.children).forEach((b,i)=>b.classList.toggle("active",items[i]&&items[i][0]===id));
  }
}
showGramGroup("tiempos");

// ── Quiz ──────────────────────────────────────────────────────────────────────
const CONVERSATION_QUIZ=[
  {kind:"meaning",es:"¿Cómo te llamas?",en:"What's your name?",tts:"¿Cómo te llamas?",cat:"conversaciones",choices:["What's your name?","Where do you live?","What do you do for work?","Do you have siblings?"]},
  {kind:"reply",es:"¿Cómo te llamas?",quizPrompt:"Reply naturally: ¿Cómo te llamas?",en:"Me llamo Laura.",tts:"¿Cómo te llamas?",cat:"conversaciones",choices:["Me llamo Laura.","Vivo en Medellín.","Trabajo como chef.","Siga derecho."]},
  {kind:"listening",es:"Me llamo Laura. Mucho gusto.",en:"My name is Laura. Nice to meet you.",tts:"Me llamo Laura. Mucho gusto.",cat:"conversaciones",choices:["My name is Laura. Nice to meet you.","Yesterday I met a new person.","I work as an engineer.","I live near the park."]},
  {kind:"tense",es:"¿Cuál frase habla de un plan futuro?",en:"Mañana voy a presentarme a mis nuevos vecinos.",tts:"Mañana voy a presentarme a mis nuevos vecinos.",cat:"conversaciones",choices:["Mañana voy a presentarme a mis nuevos vecinos.","Me llamo Laura.","Ayer conocí a una persona nueva.","Le dije mi nombre."]},
  {kind:"meaning",es:"Trabajo como ingeniero.",en:"I work as an engineer.",tts:"Trabajo como ingeniero.",cat:"conversaciones",choices:["I work as an engineer.","I'm going to study medicine.","I worked at the office yesterday.","I'm a passenger."]},
  {kind:"reply",es:"¿En qué trabajas?",en:"Trabajo como ingeniero.",tts:"¿En qué trabajas?",cat:"conversaciones",choices:["Trabajo como ingeniero.","Voy a vivir en Bogotá.","Tengo una hermana.","Me gusta leer."]},
  {kind:"listening",es:"Voy a estudiar para ser médico.",en:"I'm going to study to become a doctor.",tts:"Voy a estudiar para ser médico.",cat:"conversaciones",choices:["I'm going to study to become a doctor.","Yesterday I worked at the office.","Go straight and turn left.","I like my job."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes the work day?",en:"Ayer trabajé en la oficina.",tts:"Ayer trabajé en la oficina.",cat:"conversaciones",choices:["Ayer trabajé en la oficina.","Trabajo como ingeniero.","Voy a estudiar para ser médico.","¿Qué vas a estudiar?"]},
  {kind:"meaning",es:"¿Dónde vives?",en:"Where do you live?",tts:"¿Dónde vives?",cat:"conversaciones",choices:["Where do you live?","Where are you going to live?","Where did you live before?","Where is the bathroom?"]},
  {kind:"reply",es:"¿Dónde vives?",quizPrompt:"Reply with where you live: ¿Dónde vives?",en:"Vivo en Medellín, cerca del parque.",tts:"¿Dónde vives?",cat:"conversaciones",choices:["Vivo en Medellín, cerca del parque.","Voy a pasar tiempo con ellos.","Viví en Cali con mi familia.","Claro, con mucho gusto."]},
  {kind:"listening",es:"Voy a vivir en Bogotá el próximo año.",en:"I'm going to live in Bogotá next year.",tts:"Voy a vivir en Bogotá el próximo año.",cat:"conversaciones",choices:["I'm going to live in Bogotá next year.","I live in Medellín.","I lived in Cali with my family.","I'm going to request a taxi."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes where someone lived?",en:"Viví en Cali con mi familia.",tts:"Viví en Cali con mi familia.",cat:"conversaciones",choices:["Viví en Cali con mi familia.","Vivo en Medellín.","Voy a vivir en Bogotá.","¿Dónde vives?"]},
  {kind:"meaning",es:"¿Tienes hermanos?",en:"Do you have siblings?",tts:"¿Tienes hermanos?",cat:"conversaciones",choices:["Do you have siblings?","Do you have pets?","What are you going to do?","Do you like sports?"]},
  {kind:"reply",es:"¿Qué vas a hacer con tu familia?",en:"Voy a pasar tiempo con ellos.",tts:"¿Qué vas a hacer con tu familia?",cat:"conversaciones",choices:["Voy a pasar tiempo con ellos.","Sí, tengo una hermana.","Ayer cené con mis padres.","No me gusta mi trabajo."]},
  {kind:"listening",es:"Ayer cené con mis padres.",en:"Yesterday I had dinner with my parents.",tts:"Ayer cené con mis padres.",cat:"conversaciones",choices:["Yesterday I had dinner with my parents.","I have a sister and a brother.","I'm going to spend time with them.","It is delicious."]},
  {kind:"tense",es:"¿Cuál frase describe el presente?",en:"Sí, tengo una hermana y un hermano.",tts:"Sí, tengo una hermana y un hermano.",cat:"conversaciones",choices:["Sí, tengo una hermana y un hermano.","Voy a pasar tiempo con ellos.","Ayer cené con mis padres.","¿Qué hiciste con tu familia?"]},
  {kind:"meaning",es:"Siga derecho y gire a la izquierda.",en:"Go straight and turn left.",tts:"Siga derecho y gire a la izquierda.",cat:"conversaciones",choices:["Go straight and turn left.","Turn right at the traffic light.","The address is nearby.","Take me to this address."]},
  {kind:"reply",es:"Disculpe, ¿me regala la dirección?",en:"Siga derecho y gire a la izquierda.",tts:"Disculpe, ¿me regala la dirección?",cat:"conversaciones",choices:["Siga derecho y gire a la izquierda.","Me llamo Laura.","Voy a preparar una sopa.","Está al lado de la habitación."]},
  {kind:"listening",es:"Va a girar en la próxima esquina.",en:"You are going to turn at the next corner.",tts:"Va a girar en la próxima esquina.",cat:"conversaciones",choices:["You are going to turn at the next corner.","I went straight and asked at the corner.","Go straight and turn left.","The driver was very kind."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence tells what happened while finding the address?",en:"Seguí derecho y pregunté en la esquina.",tts:"Seguí derecho y pregunté en la esquina.",cat:"conversaciones",choices:["Seguí derecho y pregunté en la esquina.","Siga derecho y gire a la izquierda.","Va a girar en la próxima esquina.","¿Cómo voy a llegar al parqueadero?"]},
  {kind:"meaning",es:"¿Me lleva a esta dirección, por favor?",en:"Can you take me to this address, please?",tts:"¿Me lleva a esta dirección, por favor?",cat:"conversaciones",choices:["Can you take me to this address, please?","Are we going to request a car?","Did you take a taxi yesterday?","Where is the parking lot?"]},
  {kind:"reply",es:"¿Qué vas a pedir para llegar a la dirección?",en:"Voy a pedir un taxi.",tts:"¿Qué vas a pedir para llegar a la dirección?",cat:"conversaciones",choices:["Voy a pedir un taxi.","Claro, con mucho gusto.","Trabajo como conductor.","Ayer trabajé en la oficina."]},
  {kind:"listening",es:"Claro, con mucho gusto.",en:"Of course, with pleasure.",tts:"Claro, con mucho gusto.",cat:"conversaciones",choices:["Of course, with pleasure.","Yes, I'm going to request a taxi.","The driver was very kind.","I live near the park."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes the driver?",en:"Sí, el conductor fue muy amable.",tts:"Sí, el conductor fue muy amable.",cat:"conversaciones",choices:["Sí, el conductor fue muy amable.","¿Me lleva a esta dirección?","Voy a pedir un taxi.","Vamos a pedir un carro."]},
  {kind:"meaning",es:"¿Cocinamos juntos?",en:"Shall we cook together?",tts:"¿Cocinamos juntos?",cat:"conversaciones",choices:["Shall we cook together?","What are we going to cook?","What did you cook yesterday?","I cut the vegetables."]},
  {kind:"reply",es:"¿Qué vamos a cocinar?",en:"Vamos a preparar una sopa.",tts:"¿Qué vamos a cocinar?",cat:"conversaciones",choices:["Vamos a preparar una sopa.","Dale, yo corto las verduras.","Ayer hervimos la comida.","Me gusta la música."]},
  {kind:"listening",es:"Dale, yo corto las verduras.",en:"Sure, I'll cut the vegetables.",tts:"Dale, yo corto las verduras.",cat:"conversaciones",choices:["Sure, I'll cut the vegetables.","We are going to make a soup.","Yesterday we tasted the sauce.","Can you give me the address?"]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes cooking yesterday?",en:"Ayer hervimos la comida y probamos la salsa.",tts:"Ayer hervimos la comida y probamos la salsa.",cat:"conversaciones",choices:["Ayer hervimos la comida y probamos la salsa.","¿Cocinamos juntos?","Vamos a preparar una sopa.","Yo corto las verduras."]},
  {kind:"meaning",es:"¿Dónde está el baño?",en:"Where is the bathroom?",tts:"¿Dónde está el baño?",cat:"conversaciones",choices:["Where is the bathroom?","Where is the bedroom?","Where was the towel?","Are you going to tidy the bedroom?"]},
  {kind:"reply",es:"¿Vas a arreglar la habitación?",en:"Sí, voy a cambiar la sábana y la cobija.",tts:"¿Vas a arreglar la habitación?",cat:"conversaciones",choices:["Sí, voy a cambiar la sábana y la cobija.","Está al lado de la habitación.","Ayer la dejé junto al lavamanos.","Siga derecho."]},
  {kind:"listening",es:"Ayer la dejé junto al lavamanos.",en:"Yesterday I left it next to the sink.",tts:"Ayer la dejé junto al lavamanos.",cat:"conversaciones",choices:["Yesterday I left it next to the sink.","It is next to the bedroom.","I'm going to change the sheet.","Where is the bathroom?"]},
  {kind:"tense",es:"¿Cuál frase describe el presente?",quizPrompt:"Present tense: which sentence describes the current location?",en:"Está al lado de la habitación.",tts:"Está al lado de la habitación.",cat:"conversaciones",choices:["Está al lado de la habitación.","Voy a cambiar la sábana.","Ayer la dejé junto al lavamanos.","¿Dónde estaba la toalla?"]},
  {kind:"pronoun",es:"¿Me lo puede repetir, por favor?",en:"Sí, se lo repito despacio.",tts:"¿Me lo puede repetir, por favor?",cat:"pronombres",choices:["Sí, se lo repito despacio.","Sí, la tengo aquí.","No, pero me la puede enviar.","Sí, necesito ayuda."]},
  {kind:"pronoun",es:"¿La dirección la tiene?",en:"Sí, la tengo aquí.",tts:"¿La dirección la tiene?",cat:"pronombres",choices:["Sí, la tengo aquí.","Sí, se lo repito despacio.","Sí, necesito ayuda.","La voy a buscar mañana."]},
  {kind:"pronoun",es:"¿Le explicaste el problema?",en:"Sí, se lo expliqué al técnico.",tts:"¿Le explicaste el problema?",cat:"pronombres",choices:["Sí, se lo expliqué al técnico.","Sí, la tengo aquí.","No, pero me la puede enviar.","Sí, se lo repito despacio."]},
  {kind:"meaning",es:"Fui al mercado porque necesitaba comida.",en:"I went to the market because I needed food.",tts:"Fui al mercado porque necesitaba comida.",cat:"frases",choices:["I went to the market because I needed food.","I was going to cook, but I had to work.","I am at home and I have to finish a project.","I could not go because I was sick."]},
  {kind:"reply",es:"¿Qué ibas a hacer?",en:"Iba a cocinar, pero tuve que trabajar.",tts:"¿Qué ibas a hacer?",cat:"frases",choices:["Iba a cocinar, pero tuve que trabajar.","Estaba en casa; quería descansar.","Fui al mercado porque necesitaba comida.","Estoy en casa y tengo que terminar un proyecto."]},
  {kind:"listening",es:"Estaba en la oficina cuando me llamaste.",en:"I was at the office when you called me.",tts:"Estaba en la oficina cuando me llamaste.",cat:"frases",choices:["I was at the office when you called me.","I went to the market because I needed food.","I wanted to rest at home.","I was going to cook, but I had to work."]},
  {kind:"tense",es:"¿Cuál frase describe una situación en progreso en el pasado?",en:"Estaba en casa cuando llamaste.",tts:"Estaba en casa cuando llamaste.",cat:"frases",choices:["Estaba en casa cuando llamaste.","Fui al mercado ayer.","Voy a cocinar esta noche.","Soy de Estados Unidos."]},
  {kind:"meaning",es:"No podía ir porque estaba enfermo.",en:"I couldn't go because I was sick.",tts:"No podía ir porque estaba enfermo.",cat:"frases",choices:["I couldn't go because I was sick.","I had to work yesterday.","I was going to the market.","I wanted to cook dinner."]},
  {kind:"reply",es:"¿Por qué no fuiste?",en:"No podía ir porque estaba enfermo.",tts:"¿Por qué no fuiste?",cat:"frases",choices:["No podía ir porque estaba enfermo.","Fui al mercado porque necesitaba comida.","Estaba en casa; quería descansar.","Iba a cocinar, pero tuve que trabajar."]},
  {kind:"meaning",es:"¡No joda!",en:"No way! / Come on!",tts:"¡No joda!",cat:"groserias",choices:["No way! / Come on!","Darn, I'm late!","What a drag!","I don't give a fuck."]},
  {kind:"meaning",es:"¡Juepucha, se me hizo tarde!",en:"Darn, I'm late!",tts:"¡Juepucha, se me hizo tarde!",cat:"groserias",choices:["Darn, I'm late!","What horrible traffic!","Don't be an idiot.","That's awesome!"]},
  {kind:"meaning",es:"¡Qué gonorrea de tráfico!",en:"What horrible traffic!",tts:"¡Qué gonorrea de tráfico!",cat:"groserias",choices:["What horrible traffic!","What a drag!","No way! / Come on!","That guy is a jerk."]},
  {kind:"meaning",es:"Ese man es un pirobo.",en:"That guy is a jerk.",tts:"Ese man es un pirobo.",cat:"groserias",choices:["That guy is a jerk.","That guy is very hardworking.","That guy is my friend.","That guy is late."]},
  {kind:"meaning",es:"No sea güevón.",en:"Don't be an idiot.",tts:"No sea güevón.",cat:"groserias",choices:["Don't be an idiot.","Don't be late.","Don't be afraid.","Don't be formal."]},
  {kind:"meaning",es:"¡Puta, se dañó el carro!",en:"Fuck, the car broke down.",tts:"¡Puta, se dañó el carro!",cat:"groserias",choices:["Fuck, the car broke down.","The car is very clean.","I am going to buy a car.","The car is nearby."]},
  {kind:"meaning",es:"Me importa un culo.",en:"I don't give a fuck.",tts:"Me importa un culo.",cat:"groserias",choices:["I don't give a fuck.","I need a favor.","I care a lot.","I am very tired."]},
  {kind:"meaning",es:"¡Ay, marica, qué susto!",en:"Dude, what a scare!",tts:"¡Ay, marica, qué susto!",cat:"groserias",choices:["Dude, what a scare!","Darn, I'm late!","What a delicious meal!","I am at the office."]},
  {kind:"meaning",es:"Ese malparido me estafó.",en:"That bastard scammed me.",tts:"Ese malparido me estafó.",cat:"groserias",choices:["That bastard scammed me.","That friend helped me.","The driver called me.","I paid in cash."]},
  {kind:"meaning",es:"Tengo que terminar el proyecto.",en:"I have to finish the project.",tts:"Tengo que terminar el proyecto.",cat:"frases",choices:["I have to finish the project.","I just finished the project.","I forgot the project.","I sent the project to her."]},
  {kind:"meaning",es:"Acabo de llegar.",en:"I just arrived.",tts:"Acabo de llegar.",cat:"frases",choices:["I just arrived.","I am going to leave.","I have to arrive tomorrow.","I arrived yesterday."]},
  {kind:"meaning",es:"Se me olvidó la dirección.",en:"I forgot the address.",tts:"Se me olvidó la dirección.",cat:"frases",choices:["I forgot the address.","I have the address.","I sent the address.","I need the address."]},
  {kind:"meaning",es:"Se lo mando en un momento.",en:"I will send it to him/her in a moment.",tts:"Se lo mando en un momento.",cat:"frases",choices:["I will send it to him/her in a moment.","I sent her the address yesterday.","I need to send it to myself.","I am going to buy it."]},
  {kind:"pronoun",es:"¿Tienes el documento? Sí, ___ tengo aquí.",en:"lo",tts:"¿Tienes el documento? Sí, lo tengo aquí.",cat:"pronombres",choices:["lo","la","le","las"]},
  {kind:"pronoun",es:"¿Tienes la llave? Sí, ___ tengo aquí.",en:"la",tts:"¿Tienes la llave? Sí, la tengo aquí.",cat:"pronombres",choices:["la","lo","le","los"]},
  {kind:"pronoun",es:"¿Le mandaste el mensaje? Sí, ___ mandé ayer.",en:"se lo",tts:"¿Le mandaste el mensaje? Sí, se lo mandé ayer.",cat:"pronombres",choices:["se lo","se la","lo le","la se"]},
  {kind:"pronoun",es:"¿Le explicaste la situación? Sí, ___ expliqué despacio.",en:"se la",tts:"¿Le explicaste la situación? Sí, se la expliqué despacio.",cat:"pronombres",choices:["se la","se lo","la le","lo se"]}
];
/* Tag the curated conversation bank so Focus can narrow it without removing
   the existing topic/category choices. */
CONVERSATION_QUIZ.forEach(q=>{
  if(q.cat==="conversaciones")q.cat="frases";
  const text=(q.es+" "+q.en).toLowerCase();
  if(q.kind==="pronoun")q.focus="pronombres";
  else if(/mañana|voy a|vas a|va a|vamos a|going to/.test(text))q.focus="future";
  else if(/ayer|anoche|fui|fuiste|fuimos|fueron|viví|trabajé|cené|hervimos|fue|seguí|estaba|estuve|era|tenía|tuve que|quería|necesitaba|podía|iba a|yesterday|worked at|lived in|was at|couldn't/.test(text))q.focus="past";
  else q.focus="present";
});
/* Add two authored translation checks per new practical dialogue.  The
   choices come from the same dialogue but are fixed, distinct answers, so a
   learner is never graded against two equally valid options. */
const PRACTICAL_DIALOGUES=(typeof V36_CONVERSATIONS!=="undefined"?V36_CONVERSATIONS:[]).concat(typeof V38_CONVERSATIONS!=="undefined"?V38_CONVERSATIONS:[],typeof V39_CONVERSATIONS!=="undefined"?V39_CONVERSATIONS:[]);
PRACTICAL_DIALOGUES.forEach(c=>{
  const topicCat=/Acciones/.test(c.title)?"acciones":/Uber/.test(c.title)?"uber":/Hotel/.test(c.title)?"hotel":/Farmacia/.test(c.title)?"farmacia":/Teléfono/.test(c.title)?"reparar":/dirección|edificio/i.test(c.title)?"direcciones":/Mercado/.test(c.title)?"compras":/Restaurante/.test(c.title)?"restaurante":/Planes/.test(c.title)?"frases":"frases";
  const lines=(c.lines||[]).slice(0,2);
  lines.forEach(line=>{
    const distractors=(c.lines||[]).filter(x=>x.en!==line.en).slice(0,3).map(x=>x.en);
    if(distractors.length===3)CONVERSATION_QUIZ.push({kind:"meaning",es:line.es,en:line.en,tts:line.tts,cat:topicCat,focus:/voy a|mañana|puedo|vamos/.test(line.es.toLowerCase())?"future":/ayer|anoche|llegué|pedí|estaba|se dañó/.test(line.es.toLowerCase())?"past":"present",choices:[line.en,...distractors]});
  });
});
/* ── Fill-in-the-blank Quiz Data (NEW v13) ──────────────────────────────────
   kind:"blank" — sentence with ___ ; choices are single words; tts = full sentence */
const FILL_BLANK_QUIZ=[
  /* Presente */
  {kind:"blank",es:"Yo ___ en Bogotá.",en:"vivo",tts:"Yo vivo en Bogotá.",cat:"completar",choices:["vivo","vives","vive","vivimos"]},
  {kind:"blank",es:"¿Dónde ___ tú?",en:"vives",tts:"¿Dónde vives tú?",cat:"completar",choices:["vives","vivo","viven","vivimos"]},
  {kind:"blank",es:"Ella ___ arepa todos los días.",en:"come",tts:"Ella come arepa todos los días.",cat:"completar",choices:["come","como","comes","comemos"]},
  {kind:"blank",es:"Nosotros ___ español.",en:"hablamos",tts:"Nosotros hablamos español.",cat:"completar",choices:["hablamos","hablo","hablas","hablan"]},
  {kind:"blank",es:"Yo ___ dos hermanos.",en:"tengo",tts:"Yo tengo dos hermanos.",cat:"completar",choices:["tengo","tienes","tiene","tenemos"]},
  {kind:"blank",es:"¿Usted ___ inglés?",en:"habla",tts:"¿Usted habla inglés?",cat:"completar",choices:["habla","hablo","hablamos","hablan"]},
  /* Futuro cercano — voy a... */
  {kind:"blank",es:"Mañana yo ___ a trabajar.",en:"voy",tts:"Mañana yo voy a trabajar.",cat:"completar",choices:["voy","vas","va","vamos"]},
  {kind:"blank",es:"¿Qué ___ a comer tú?",en:"vas",tts:"¿Qué vas a comer tú?",cat:"completar",choices:["vas","voy","va","van"]},
  {kind:"blank",es:"Nosotros ___ a cocinar arepas.",en:"vamos",tts:"Nosotros vamos a cocinar arepas.",cat:"completar",choices:["vamos","voy","vas","van"]},
  {kind:"blank",es:"Ella ___ a ver una película.",en:"va",tts:"Ella va a ver una película.",cat:"completar",choices:["va","voy","vas","vamos"]},
  /* Pasado */
  {kind:"blank",es:"Ayer yo ___ al mercado.",en:"fui",tts:"Ayer yo fui al mercado.",cat:"completar",choices:["fui","fue","fuiste","fuimos"]},
  {kind:"blank",es:"¿Qué ___ tú anoche?",en:"comiste",tts:"¿Qué comiste tú anoche?",cat:"completar",choices:["comiste","comí","comió","comimos"]},
  {kind:"blank",es:"Él ___ hasta las seis.",en:"trabajó",tts:"Él trabajó hasta las seis.",cat:"completar",choices:["trabajó","trabajé","trabajaste","trabajamos"]},
  {kind:"blank",es:"Anoche yo ___ ocho horas.",en:"dormí",tts:"Anoche yo dormí ocho horas.",cat:"completar",choices:["dormí","durmió","dormiste","dormimos"]},
  /* Vocabulario */
  {kind:"blank",es:"¿Me regala un ___ para tomar, por favor?",en:"tinto",tts:"¿Me regala un tinto para tomar, por favor?",cat:"completar",choices:["tinto","trancón","cuchillo","semáforo"]},
  {kind:"blank",es:"Gire a la ___ en la esquina.",en:"derecha",tts:"Gire a la derecha en la esquina.",cat:"completar",choices:["derecha","ducha","cuchara","almohada"]},
  {kind:"blank",es:"Me ducho en la ___ y me seco con la toalla.",en:"ducha",tts:"Me ducho en la ducha y me seco con la toalla.",cat:"completar",choices:["ducha","cama","olla","esquina"]},
  {kind:"blank",es:"Hay mucho ___ y los carros no avanzan por la avenida.",en:"trancón",tts:"Hay mucho trancón y los carros no avanzan por la avenida.",cat:"completar",choices:["trancón","tinto","clóset","jabón"]},
  {kind:"blank",es:"Corto la cebolla con el ___ para picarla.",en:"cuchillo",tts:"Corto la cebolla con el cuchillo para picarla.",cat:"completar",choices:["cuchillo","sofá","semáforo","reloj"]},
  {kind:"blank",es:"Me siento en el ___ de la sala para ver la película.",en:"sofá",tts:"Me siento en el sofá de la sala para ver la película.",cat:"completar",choices:["sofá","lavamanos","parqueadero","azúcar"]},
  {kind:"blank",es:"No tengo suficiente ___ para pagar el taxi.",en:"plata",tts:"No tengo suficiente plata para pagar el taxi.",cat:"completar",choices:["plata","vaina","cobija","sartén"]},
  {kind:"blank",es:"La ___ está sobre la cama y me abriga.",en:"cobija",tts:"La cobija está sobre la cama y me abriga.",cat:"completar",choices:["cobija","gasolina","luz","sal"]},
];

/* Focus tags keep grammar practice separate from the broader topic filters. */
FILL_BLANK_QUIZ.forEach((q,i)=>{
  if(i<6)q.focus="present";
  else if(i<10)q.focus="future";
  else if(i<14)q.focus="past";
});
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"pronombres",es:"El número es masculino: ¿Tienes el número? Sí, ___ tengo aquí.",en:"lo",tts:"El número es masculino: ¿Tienes el número? Sí, lo tengo aquí.",cat:"pronombres",choices:["lo","la","le","los"],trans:"The number is masculine: Do you have the number? Yes, I have it here."},
  {kind:"blank",focus:"pronombres",es:"La dirección es femenina: ¿Tienes la dirección? Sí, ___ tengo aquí.",en:"la",tts:"La dirección es femenina: ¿Tienes la dirección? Sí, la tengo aquí.",cat:"pronombres",choices:["la","lo","le","las"],trans:"The address is feminine: Do you have the address? Yes, I have it here."},
  {kind:"blank",focus:"pronombres",es:"A Juan, ___ doy el libro.",en:"le",tts:"A Juan, le doy el libro.",cat:"pronombres",choices:["le","lo","la","les"],trans:"To Juan, I give him the book."}
);

/* ── Approved vocabulary blanks ─────────────────────────────────────────────
   These are authored prompts, not blanks generated from every example.
   Each one has a tight context and fixed distractors so the learner is not
   penalized when more than one answer would be natural. */
const APPROVED_VOCAB_BLANKS=[
  /* Cuerpo */
  {kind:"blank",cat:"cuerpo",es:"Tengo dolor de ___ después de trabajar.",en:"cabeza",tts:"Tengo dolor de cabeza después de trabajar.",trans:"I have a headache after working.",choices:["cabeza","cargador","sal","puerta"]},
  {kind:"blank",cat:"cuerpo",es:"Mi ___ derecho está rojo.",en:"ojo",tts:"Mi ojo derecho está rojo.",trans:"My right eye is red.",choices:["ojo","silla","azúcar","motor"]},
  {kind:"blank",cat:"cuerpo",es:"Tengo la ___ tapada.",en:"nariz",tts:"Tengo la nariz tapada.",trans:"My nose is blocked.",choices:["nariz","plato","archivo","sartén"]},
  {kind:"blank",cat:"cuerpo",es:"Me lavo la ___ después de comer.",en:"boca",tts:"Me lavo la boca después de comer.",trans:"I wash my mouth after eating.",choices:["boca","ventana","proyecto","gasolina"]},
  {kind:"blank",cat:"cuerpo",es:"Llevo la mochila en el ___.",en:"hombro",tts:"Llevo la mochila en el hombro.",trans:"I carry the backpack on my shoulder.",choices:["hombro","cuchara","contraseña","parqueadero"]},
  {kind:"blank",cat:"cuerpo",es:"Me golpeé el ___ con la puerta.",en:"brazo",tts:"Me golpeé el brazo con la puerta.",trans:"I hit my arm on the door.",choices:["brazo","lámpara","documento","tinto"]},
  {kind:"blank",cat:"cuerpo",es:"Me corté el ___ al cocinar.",en:"dedo",tts:"Me corté el dedo al cocinar.",trans:"I cut my finger while cooking.",choices:["dedo","baúl","reunión","jabón"]},
  {kind:"blank",cat:"cuerpo",es:"El ___ late rápido cuando corro.",en:"corazón",tts:"El corazón late rápido cuando corro.",trans:"My heart beats fast when I run.",choices:["corazón","escritorio","semáforo","arepa"]},
  {kind:"blank",cat:"cuerpo",es:"Tengo el ___ lleno después de almorzar.",en:"estómago",tts:"Tengo el estómago lleno después de almorzar.",trans:"My stomach is full after lunch.",choices:["estómago","impresora","llanta","sábana"]},
  {kind:"blank",cat:"cuerpo",es:"Me duele la ___ por estar sentado.",en:"espalda",tts:"Me duele la espalda por estar sentado.",trans:"My back hurts from sitting.",choices:["espalda","pantalla","sartén","negocio"]},

  /* Casa, habitación y baño */
  {kind:"blank",cat:"casa",es:"Me ducho en la ___ antes de trabajar.",en:"ducha",tts:"Me ducho en la ducha antes de trabajar.",trans:"I shower before going to work.",choices:["ducha","silla","archivo","gasolina"]},
  {kind:"blank",cat:"casa",es:"Lavo mis manos en el ___.",en:"lavamanos",tts:"Lavo mis manos en el lavamanos.",trans:"I wash my hands in the sink.",choices:["lavamanos","motor","reunión","azúcar"]},
  {kind:"blank",cat:"casa",es:"Me seco con la ___ después de bañarme.",en:"toalla",tts:"Me seco con la toalla después de bañarme.",trans:"I dry myself with the towel after bathing.",choices:["toalla","semáforo","proyecto","cuchara"]},
  {kind:"blank",cat:"casa",es:"Uso el ___ para lavarme los dientes.",en:"cepillo de dientes",tts:"Uso el cepillo de dientes para lavarme los dientes.",trans:"I use the toothbrush to brush my teeth.",choices:["cepillo de dientes","volante","sueldo","película"]},
  {kind:"blank",cat:"casa",es:"La ropa está en el ___.",en:"clóset",tts:"La ropa está en el clóset.",trans:"The clothes are in the closet.",choices:["clóset","hospital","cargador","sartén"]},
  {kind:"blank",cat:"casa",es:"Enciendo la ___ cuando oscurece.",en:"luz",tts:"Enciendo la luz cuando oscurece.",trans:"I turn on the light when it gets dark.",choices:["luz","llanta","archivo","arepa"]},
  {kind:"blank",cat:"casa",es:"La ___ está sobre la cama y me abriga.",en:"cobija",tts:"La cobija está sobre la cama y me abriga.",trans:"The blanket is on the bed and keeps me warm.",choices:["cobija","impresora","gasolina","cuchillo"]},
  {kind:"blank",cat:"habitacion",es:"La ___ está junto a la cama y tiene una lámpara.",en:"mesita de noche",tts:"La mesita de noche está junto a la cama y tiene una lámpara.",trans:"The nightstand is next to the bed and has a lamp.",choices:["mesita de noche","farmacia","batería","sal"]},
  {kind:"blank",cat:"habitacion",es:"La ___ está encendida junto a la cama.",en:"lámpara",tts:"La lámpara está encendida junto a la cama.",trans:"The lamp is on next to the bed.",choices:["lámpara","parqueadero","documento","jugo"]},
  {kind:"blank",cat:"habitacion",es:"Me miro en el ___ antes de salir.",en:"espejo",tts:"Me miro en el espejo antes de salir.",trans:"I look at myself in the mirror before leaving.",choices:["espejo","trancón","horario","azúcar"]},
  {kind:"blank",cat:"bano",es:"Necesito ___ para lavarme los dientes.",en:"pasta dental",tts:"Necesito pasta dental para lavarme los dientes.",trans:"I need toothpaste to brush my teeth.",choices:["pasta dental","carro","reunión","cobija"]},
  {kind:"blank",cat:"bano",es:"El ___ está en el baño y se acaba rápido.",en:"papel higiénico",tts:"El papel higiénico está en el baño y se acaba rápido.",trans:"The toilet paper is in the bathroom and runs out quickly.",choices:["papel higiénico","volante","proyecto","café"]},
  {kind:"blank",cat:"bano",es:"Necesito ___ para lavarme el pelo.",en:"champú",tts:"Necesito champú para lavarme el pelo.",trans:"I need shampoo to wash my hair.",choices:["champú","llanta","archivo","pan"]},
  {kind:"blank",cat:"bano",es:"El ___ está limpio y tiene la tapa cerrada.",en:"inodoro",tts:"El inodoro está limpio y tiene la tapa cerrada.",trans:"The toilet is clean and the lid is closed.",choices:["inodoro","escritorio","gasolina","jugo"]},

  /* Cocina */
  {kind:"blank",cat:"cocina",es:"Voy a ___ las verduras para la sopa.",en:"cortar",tts:"Voy a cortar las verduras para la sopa.",trans:"I am going to cut the vegetables for the soup.",choices:["cortar","dormir","volante","sueldo"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ la salsa en un tazón.",en:"mezclar",tts:"Voy a mezclar la salsa en un tazón.",trans:"I am going to mix the sauce in a bowl.",choices:["mezclar","trabajar","llanta","contraseña"]},
  {kind:"blank",cat:"cocina",es:"Quiero ___ la sopa antes de servirla.",en:"probar",tts:"Quiero probar la sopa antes de servirla.",trans:"I want to taste the soup before serving it.",choices:["probar","cobija","semáforo","archivo"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ el agua para el café.",en:"hervir",tts:"Voy a hervir el agua para el café.",trans:"I am going to boil the water for the coffee.",choices:["hervir","conducir","espejo","silla"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ un huevo para el desayuno.",en:"freír",tts:"Voy a freír un huevo para el desayuno.",trans:"I am going to fry an egg for breakfast.",choices:["freír","leer","motor","ventana"]},
  {kind:"blank",cat:"cocina",es:"La ___ sirve para cocinar la sopa.",en:"olla",tts:"La olla sirve para cocinar la sopa.",trans:"The pot is used to cook soup.",choices:["olla","pantalla","reunión","gasolina"]},
  {kind:"blank",cat:"cocina",es:"La ___ sirve para freír un huevo.",en:"sartén",tts:"La sartén sirve para freír un huevo.",trans:"The frying pan is used to fry an egg.",choices:["sartén","puerta","documento","parqueadero"]},
  {kind:"blank",cat:"cocina",es:"Uso la ___ para comer sopa.",en:"cuchara",tts:"Uso la cuchara para comer sopa.",trans:"I use the spoon to eat soup.",choices:["cuchara","llanta","contraseña","hotel"]},
  {kind:"blank",cat:"cocina",es:"Pongo la comida en el ___.",en:"plato",tts:"Pongo la comida en el plato.",trans:"I put the food on the plate.",choices:["plato","motor","horario","cargador"]},
  {kind:"blank",cat:"cocina",es:"No le pongas mucha ___ a la sopa.",en:"sal",tts:"No le pongas mucha sal a la sopa.",trans:"Do not add too much salt to the soup.",choices:["sal","silla","archivo","aeropuerto"]},
  {kind:"blank",cat:"cocina",es:"Necesito ___ para el café.",en:"azúcar",tts:"Necesito azúcar para el café.",trans:"I need sugar for the coffee.",choices:["azúcar","freno","proyecto","ventana"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ los platos después de comer.",en:"lavar",tts:"Voy a lavar los platos después de comer.",trans:"I am going to wash the dishes after eating.",choices:["lavar","correr","volante","sueldo"]},

  /* Direcciones y carro */
  {kind:"blank",cat:"direcciones",es:"El ___ está en rojo y debemos parar.",en:"semáforo",tts:"El semáforo está en rojo y debemos parar.",trans:"The traffic light is red and we have to stop.",choices:["semáforo","almohada","reunión","café"]},
  {kind:"blank",cat:"direcciones",es:"Hay un ___ y los carros no avanzan.",en:"trancón",tts:"Hay un trancón y los carros no avanzan.",trans:"There is a traffic jam and the cars are not moving.",choices:["trancón","pasta dental","archivo","sábana"]},
  {kind:"blank",cat:"direcciones",es:"El ___ está cerca; allí dejo el carro.",en:"parqueadero",tts:"El parqueadero está cerca; allí dejo el carro.",trans:"The parking lot is nearby; I leave the car there.",choices:["parqueadero","cuchara","proyecto","jabón"]},
  {kind:"blank",cat:"direcciones",es:"Necesito ___ para llenar el tanque.",en:"gasolina",tts:"Necesito gasolina para llenar el tanque.",trans:"I need gas to fill the tank.",choices:["gasolina","lámpara","reunión","plato"]},
  {kind:"blank",cat:"carropartes",es:"La ___ está baja y debo inflarla.",en:"llanta",tts:"La llanta está baja y debo inflarla.",trans:"The tire is low and I need to inflate it.",choices:["llanta","pantalla","sueldo","cobija"]},
  {kind:"blank",cat:"carropartes",es:"El ___ sirve para controlar la dirección del carro.",en:"volante",tts:"El volante sirve para controlar la dirección del carro.",trans:"The steering wheel is used to control the car's direction.",choices:["volante","toalla","archivo","azúcar"]},
  {kind:"blank",cat:"carropartes",es:"El ___ suena cuando freno.",en:"freno",tts:"El freno suena cuando freno.",trans:"The brake makes a noise when I brake.",choices:["freno","cuchara","contraseña","mesita de noche"]},
  {kind:"blank",cat:"carropartes",es:"El equipaje está en el ___.",en:"baúl",tts:"El equipaje está en el baúl.",trans:"The luggage is in the trunk.",choices:["baúl","hospital","reunión","sal"]},
  {kind:"blank",cat:"carropartes",es:"Abro el ___ para revisar el motor.",en:"capó",tts:"Abro el capó para revisar el motor.",trans:"I open the hood to check the engine.",choices:["capó","cama","proyecto","jugo"]},
  {kind:"blank",cat:"carropartes",es:"Miro el ___ para ver los carros detrás.",en:"espejo retrovisor",tts:"Miro el espejo retrovisor para ver los carros detrás.",trans:"I look at the rearview mirror to see the cars behind me.",choices:["espejo retrovisor","cargador","sartén","entrevista"]},
  {kind:"blank",cat:"direcciones",es:"El ___ tiene cuatro ruedas y dos puertas.",en:"carro",tts:"El carro tiene cuatro ruedas y dos puertas.",trans:"The car has four wheels and two doors.",choices:["carro","cobija","documento","sal"]},

  /* Tecnología, oficina y trabajo */
  {kind:"blank",cat:"tecnologia",es:"Mi ___ no tiene batería; necesito cargarlo.",en:"celular",tts:"Mi celular no tiene batería; necesito cargarlo.",trans:"My cell phone has no battery; I need to charge it.",choices:["celular","cuchillo","reunión","sábana"]},
  {kind:"blank",cat:"tecnologia",es:"Necesito el ___ para cargar el celular.",en:"cargador",tts:"Necesito el cargador para cargar el celular.",trans:"I need the charger to charge the cell phone.",choices:["cargador","parqueadero","sal","proyecto"]},
  {kind:"blank",cat:"tecnologia",es:"El ___ está encendido y tiene teclado.",en:"computador",tts:"El computador está encendido y tiene teclado.",trans:"The computer is on and has a keyboard.",choices:["computador","toalla","trancón","café"]},
  {kind:"blank",cat:"tecnologia",es:"Descargué una ___ para estudiar español.",en:"aplicación",tts:"Descargué una aplicación para estudiar español.",trans:"I downloaded an app to study Spanish.",choices:["aplicación","llanta","cuchara","entrevista"]},
  {kind:"blank",cat:"tecnologia",es:"Te mando un ___ por WhatsApp.",en:"mensaje",tts:"Te mando un mensaje por WhatsApp.",trans:"I am sending you a message on WhatsApp.",choices:["mensaje","motor","cobija","sartén"]},
  {kind:"blank",cat:"tecnologia",es:"Tomé una ___ de la pantalla.",en:"foto",tts:"Tomé una foto de la pantalla.",trans:"I took a photo of the screen.",choices:["foto","freno","reunión","ducha"]},
  {kind:"blank",cat:"tecnologia",es:"No recuerdo la ___.",en:"contraseña",tts:"No recuerdo la contraseña.",trans:"I do not remember the password.",choices:["contraseña","llanta","plato","sueldo"]},
  {kind:"blank",cat:"tecnologia",es:"La ___ del celular está baja.",en:"batería",tts:"La batería del celular está baja.",trans:"The cell phone battery is low.",choices:["batería","cuchara","parqueadero","entrevista"]},
  {kind:"blank",cat:"oficina",es:"La ___ no funciona; no puedo imprimir.",en:"impresora",tts:"La impresora no funciona; no puedo imprimir.",trans:"The printer does not work; I cannot print.",choices:["impresora","cobija","gasolina","arepa"]},
  {kind:"blank",cat:"oficina",es:"Necesito el ___ para leer las instrucciones.",en:"documento",tts:"Necesito el documento para leer las instrucciones.",trans:"I need the document to read the instructions.",choices:["documento","llanta","sartén","tarde"]},
  {kind:"blank",cat:"oficina",es:"Guarda el ___ en la carpeta.",en:"archivo",tts:"Guarda el archivo en la carpeta.",trans:"Save the file in the folder.",choices:["archivo","toalla","trancón","azúcar"]},
  {kind:"blank",cat:"oficina",es:"Te mando un ___ con la información.",en:"correo electrónico",tts:"Te mando un correo electrónico con la información.",trans:"I am sending you an email with the information.",choices:["correo electrónico","cuchillo","cama","gasolina"]},
  {kind:"blank",cat:"oficina",es:"Mi ___ está junto a la ventana; trabajo allí.",en:"escritorio",tts:"Mi escritorio está junto a la ventana; trabajo allí.",trans:"My desk is next to the window; I work there.",choices:["escritorio","semáforo","sal","cobija"]},
  {kind:"blank",cat:"trabajo",es:"Tengo una ___ a las diez con mi jefe.",en:"reunión",tts:"Tengo una reunión a las diez con mi jefe.",trans:"I have a meeting with my boss at ten.",choices:["reunión","llanta","ducha","pan"]},
  {kind:"blank",cat:"trabajo",es:"El ___ empieza hoy y termina el viernes.",en:"proyecto",tts:"El proyecto empieza hoy y termina el viernes.",trans:"The project starts today and ends on Friday.",choices:["proyecto","cuchara","baúl","champú"]},
  {kind:"blank",cat:"trabajo",es:"Mi ___ cambia la próxima semana.",en:"horario",tts:"Mi horario cambia la próxima semana.",trans:"My schedule changes next week.",choices:["horario","espejo","trancón","arepa"]},
  {kind:"blank",cat:"trabajo",es:"Recibo mi ___ el viernes.",en:"sueldo",tts:"Recibo mi sueldo el viernes.",trans:"I receive my salary on Friday.",choices:["sueldo","lavamanos","motor","cobija"]},
  {kind:"blank",cat:"trabajo",es:"Tengo una ___ para el puesto mañana.",en:"entrevista",tts:"Tengo una entrevista para el puesto mañana.",trans:"I have an interview for the position tomorrow.",choices:["entrevista","plato","llanta","jabón"]},
  {kind:"blank",cat:"trabajo",es:"Mi ___ está en el centro; vendo comida allí.",en:"negocio",tts:"Mi negocio está en el centro; vendo comida allí.",trans:"My business is downtown; I sell food there.",choices:["negocio","toalla","freno","cuchara"]},

  /* Acciones, comida, clima y descanso */
  {kind:"blank",cat:"acciones",es:"Voy a ___ la mesa antes de cenar.",en:"poner",tts:"Voy a poner la mesa antes de cenar.",trans:"I am going to set the table before dinner.",choices:["poner","llanta","sueldo","cobija"]},
  {kind:"blank",cat:"acciones",es:"Puedes ___ la mochila aquí.",en:"dejar",tts:"Puedes dejar la mochila aquí.",trans:"You can leave the backpack here.",choices:["dejar","semáforo","contraseña","sartén"]},
  {kind:"blank",cat:"acciones",es:"Voy a ___ la basura esta noche.",en:"sacar",tts:"Voy a sacar la basura esta noche.",trans:"I am going to take out the trash tonight.",choices:["sacar","cuchara","reunión","motor"]},
  {kind:"blank",cat:"acciones",es:"Voy a ___ después del trabajo.",en:"volver",tts:"Voy a volver después del trabajo.",trans:"I am going to return after work.",choices:["volver","toalla","archivo","sal"]},
  {kind:"blank",cat:"comida",es:"Quiero ___ fría, por favor.",en:"agua",tts:"Quiero agua fría, por favor.",trans:"I want cold water, please.",choices:["agua","llanta","documento","lámpara"]},
  {kind:"blank",cat:"comida",es:"Tomo ___ en la mañana.",en:"café",tts:"Tomo café en la mañana.",trans:"I drink coffee in the morning.",choices:["café","parqueadero","cobija","freno"]},
  {kind:"blank",cat:"comida",es:"¿Me regala un ___?",en:"tinto",tts:"¿Me regala un tinto?",trans:"Can I have a black coffee?",choices:["tinto","escritorio","llanta","pasta dental"]},
  {kind:"blank",cat:"comida",es:"El ___ está maduro y lo pongo en la ensalada.",en:"aguacate",tts:"El aguacate está maduro y lo pongo en la ensalada.",trans:"The avocado is ripe and I put it in the salad.",choices:["aguacate","volante","reunión","toalla"]},
  {kind:"blank",cat:"comida",es:"Me gusta la ___ con queso.",en:"arepa",tts:"Me gusta la arepa con queso.",trans:"I like arepa with cheese.",choices:["arepa","cargador","archivo","llanta"]},
  {kind:"blank",cat:"comida",es:"Como ___ con huevo.",en:"pan",tts:"Como pan con huevo.",trans:"I eat bread with egg.",choices:["pan","semáforo","proyecto","lámpara"]},
  {kind:"blank",cat:"clima",es:"Cayó un ___ muy fuerte en la tarde.",en:"aguacero",tts:"Cayó un aguacero muy fuerte en la tarde.",trans:"A very heavy downpour fell in the afternoon.",choices:["aguacero","escritorio","sueldo","cuchara"]},
  {kind:"blank",cat:"clima",es:"Hoy ___ en Bogotá; ponte una chaqueta.",en:"hace frío",tts:"Hoy hace frío en Bogotá; ponte una chaqueta.",trans:"It is cold in Bogotá today; put on a jacket.",choices:["hace frío","cortar","llanta","archivo"]},
  {kind:"blank",cat:"clima",es:"Está ___; necesitamos paraguas.",en:"lloviendo",tts:"Está lloviendo; necesitamos paraguas.",trans:"It is raining; we need umbrellas.",choices:["lloviendo","sueldo","cuchara","motor"]},
  {kind:"blank",cat:"tv",es:"¿Dónde está el ___?",en:"control remoto",tts:"¿Dónde está el control remoto?",trans:"Where is the remote control?",choices:["control remoto","llanta","reunión","sal"]},
  {kind:"blank",cat:"tv",es:"Estoy sentado en el ___ viendo una película.",en:"sofá",tts:"Estoy sentado en el sofá viendo una película.",trans:"I am sitting on the sofa watching a movie.",choices:["sofá","freno","archivo","azúcar"]},
  {kind:"blank",cat:"tv",es:"Necesito ___ después de trabajar.",en:"descansar",tts:"Necesito descansar después de trabajar.",trans:"I need to rest after working.",choices:["descansar","cuchara","contraseña","parqueadero"]}
];
const CONVERSATION_FRAME_BLANKS=[
  {kind:"blank",focus:"past",cat:"frases",es:"Ayer ___ al mercado.",en:"fui",tts:"Ayer fui al mercado.",trans:"Yesterday I went to the market.",choices:["fui","comí","dormí","hablé"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Cuando me llamaste, yo ___ en la oficina.",en:"estaba",tts:"Cuando me llamaste, yo estaba en la oficina.",trans:"When you called me, I was at the office.",choices:["estaba","fui","quería","tuve"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Antes ___ estudiante en Bogotá.",en:"era",tts:"Antes era estudiante en Bogotá.",trans:"Before, I was a student in Bogotá.",choices:["era","comí","dormí","hice"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Yo ___ a salir, pero empezó a llover.",en:"iba",tts:"Yo iba a salir, pero empezó a llover.",trans:"I was going to go out, but it started to rain.",choices:["iba","tuve","estaba","quería"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Ayer ___ que trabajar hasta tarde.",en:"tuve",tts:"Ayer tuve que trabajar hasta tarde.",trans:"Yesterday I had to work late.",choices:["tuve","fui","era","podía"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Yo ___ descansar, pero tenía una reunión.",en:"quería",tts:"Yo quería descansar, pero tenía una reunión.",trans:"I wanted to rest, but I had a meeting.",choices:["quería","fui","estuve","tuve"]},
  {kind:"blank",focus:"past",cat:"frases",es:"___ ayuda para terminar el proyecto.",en:"necesitaba",tts:"Necesitaba ayuda para terminar el proyecto.",trans:"I needed help to finish the project.",choices:["necesitaba","estaba","fui","pude"]},
  {kind:"blank",focus:"past",cat:"frases",es:"No ___ ir porque estaba enfermo.",en:"podía",tts:"No podía ir porque estaba enfermo.",trans:"I couldn't go because I was sick.",choices:["podía","era","tuve","fui"]}
];
const PRONOUN_FRAME_BLANKS=[
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Tienes el documento? Sí, ___ tengo aquí.",en:"lo",tts:"¿Tienes el documento? Sí, lo tengo aquí.",trans:"Do you have the document? Yes, I have it here.",choices:["lo","la","le","las"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Tienes la llave? Sí, ___ tengo aquí.",en:"la",tts:"¿Tienes la llave? Sí, la tengo aquí.",trans:"Do you have the key? Yes, I have it here.",choices:["la","lo","le","los"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"Le expliqué el problema: ___ expliqué despacio.",en:"se lo",tts:"Le expliqué el problema: se lo expliqué despacio.",trans:"I explained the problem to him/her: I explained it slowly.",choices:["se lo","se la","lo le","la se"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"Le mandé la ubicación: ___ mandé por mensaje.",en:"se la",tts:"Le mandé la ubicación: se la mandé por mensaje.",trans:"I sent him/her the location: I sent it by message.",choices:["se la","se lo","la le","lo se"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ llegar a casa.",en:"Acabo de",tts:"Acabo de llegar a casa.",trans:"I just arrived home.",choices:["Acabo de","Tengo que","Voy a","Se me"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ terminar el proyecto hoy.",en:"Tengo que",tts:"Tengo que terminar el proyecto hoy.",trans:"I have to finish the project today.",choices:["Tengo que","Acabo de","Se me","Lo"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ olvidó la dirección.",en:"Se me",tts:"Se me olvidó la dirección.",trans:"I forgot the address.",choices:["Se me","Tengo que","Acabo de","La"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ mando en un momento.",en:"Se lo",tts:"Se lo mando en un momento.",trans:"I will send it to him/her in a moment.",choices:["Se lo","Lo se","La le","Me la"]}
];
FILL_BLANK_QUIZ.push(...CONVERSATION_FRAME_BLANKS);
FILL_BLANK_QUIZ.push(...PRONOUN_FRAME_BLANKS);
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"perfecto",cat:"frases",es:"Esta semana ___ tres veces.",en:"he practicado",tts:"Esta semana he practicado tres veces.",trans:"This week I have practiced three times.",choices:["he practicado","practiqué","practicaba","practicaré"]},
  {kind:"blank",focus:"perfecto",cat:"frases",es:"¿___ la arepa?",en:"Has probado",tts:"¿Has probado la arepa?",trans:"Have you tried arepa?",choices:["Has probado","Probaste","Habías probado","Probarás"]},
  {kind:"blank",focus:"condicional",cat:"frases",es:"Me ___ pedir una mesa.",en:"gustaría",tts:"Me gustaría pedir una mesa.",trans:"I would like to order a table.",choices:["gustaría","gusta","gustó","gustará"]},
  {kind:"blank",focus:"condicional",cat:"frases",es:"¿___ repetir, por favor?",en:"Podría",tts:"¿Podría repetir, por favor?",trans:"Could you repeat, please?",choices:["Podría","Puedo","Pude","Podré"]},
  {kind:"blank",focus:"pasado-perfecto",cat:"frases",es:"Cuando llegué, ya ___ la tienda.",en:"habían cerrado",tts:"Cuando llegué, ya habían cerrado la tienda.",trans:"When I arrived, they had already closed the store.",choices:["habían cerrado","cerraron","cerraban","han cerrado"]},
  {kind:"blank",focus:"pasado-perfecto",cat:"frases",es:"Ya ___ cuando me llamaste.",en:"había comido",tts:"Ya había comido cuando me llamaste.",trans:"I had already eaten when you called me.",choices:["había comido","comí","comía","he comido"]},
  {kind:"blank",focus:"futuro-perfecto",cat:"frases",es:"Para las ocho, ___ terminado.",en:"habré",tts:"Para las ocho, habré terminado.",trans:"By eight, I will have finished.",choices:["habré","había","he","habría"]},
  {kind:"blank",focus:"futuro-perfecto",cat:"frases",es:"En un año, ___ mucho.",en:"habré aprendido",tts:"En un año, habré aprendido mucho.",trans:"In a year, I will have learned a lot.",choices:["habré aprendido","había aprendido","he aprendido","aprenderé"]}
);
FILL_BLANK_QUIZ.push(...APPROVED_VOCAB_BLANKS);
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"past",cat:"frases",es:"Cuando era niño, ___ en Cali.",en:"vivía",tts:"Cuando era niño, vivía en Cali.",trans:"When I was a child, I used to live in Cali.",choices:["vivía","viví","vivo","voy"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Ayer ___ al mercado.",en:"fui",tts:"Ayer fui al mercado.",trans:"Yesterday I went to the market.",choices:["fui","iba","voy","era"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Mientras ___, me llamaste.",en:"cocinaba",tts:"Mientras cocinaba, me llamaste.",trans:"While I was cooking, you called me.",choices:["cocinaba","cociné","cocino","cocinaré"]},
  {kind:"blank",focus:"subjuntivo",cat:"subjuntivo",es:"Quiero que ___ mañana.",en:"vengas",tts:"Quiero que vengas mañana.",trans:"I want you to come tomorrow.",choices:["vengas","vienes","venir","viniste"]},
  {kind:"blank",focus:"subjuntivo",cat:"subjuntivo",es:"Espero que ___ bien.",en:"estés",tts:"Espero que estés bien.",trans:"I hope you are well.",choices:["estés","estás","estar","estuviste"]},
  {kind:"blank",focus:"subjuntivo",cat:"subjuntivo",es:"Es importante que ___ despacio.",en:"hables",tts:"Es importante que hables despacio.",trans:"It is important that you speak slowly.",choices:["hables","hablas","hablar","hablaste"]}
);
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Tienes la dirección? Sí, ___ tengo aquí.",en:"la",tts:"¿Tienes la dirección? Sí, la tengo aquí.",trans:"Do you have the address? Yes, I have it here.",choices:["la","lo","le","las"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Le mandaste la ubicación? Sí, ___ mandé ayer.",en:"se la",tts:"¿Le mandaste la ubicación? Sí, se la mandé ayer.",trans:"Did you send him/her the location? Yes, I sent it to him/her yesterday.",choices:["se la","se lo","la le","lo se"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Qué haces con el documento? ___ voy a enviar ahora.",en:"Se lo",tts:"¿Qué haces con el documento? Se lo voy a enviar ahora.",trans:"What are you doing with the document? I am going to send it to him/her now.",choices:["Se lo","Se la","Lo le","La se"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Le explicaste la ruta? Sí, ___ expliqué despacio.",en:"se la",tts:"¿Le explicaste la ruta? Sí, se la expliqué despacio.",trans:"Did you explain the route to him/her? Yes, I explained it to him/her slowly.",choices:["se la","se lo","la le","lo se"]}
);

/* v60 content is kept in data.js so the quiz remains data-driven and easy to
   extend without changing the quiz engine. */
if(typeof V60_CONVERSATION_QUIZ!=="undefined")CONVERSATION_QUIZ.push(...V60_CONVERSATION_QUIZ);
if(typeof V60_FILL_BLANK_QUIZ!=="undefined")FILL_BLANK_QUIZ.push(...V60_FILL_BLANK_QUIZ);

let aQ=[];
VC.forEach(cat=>{
  if(cat.type==="basic")cat.items.forEach(i=>{
    const quizPrompt=cat.id==="colores"&&i.word==="Café"?"El color café":cat.id==="comida"&&i.word==="Café"?"Una bebida: café":undefined;
    aQ.push({es:i.word,en:i.en,tts:i.tts,cat:cat.id,quizPrompt});
  });
  if(cat.type==="vocales")VOCALES_DATA.forEach(v=>v.examples.forEach(ex=>aQ.push({es:ex.word,en:ex.en,tts:ex.tts,cat:"vocales"})));
  if(cat.type==="numeros"){[...N130,...NT].forEach(n=>aQ.push({es:n.w,en:String(n.n),tts:n.w,cat:"numeros"}));}
  if(cat.type==="preguntas")PQ.forEach(p=>aQ.push({es:p.word,en:p.en,tts:p.tts,cat:"preguntas"}));
  if(cat.type==="verbos")Object.entries(VERBS).forEach(([k,v])=>aQ.push({es:k,en:v.en,tts:k,cat:"verbos"}));
  if(cat.type==="colombianismos")COLOMBIANISMOS.forEach(c=>aQ.push({es:c.word,en:c.en,tts:c.tts,cat:"colombianismos"}));
});
SPECIAL_SOUNDS.forEach(sound=>sound.examples.forEach(ex=>aQ.push({es:ex.word,en:ex.en,tts:ex.tts,cat:"pronunciacion"})));
SPEAKING_GUIDE.forEach(guide=>guide.examples.forEach(ex=>aQ.push({es:ex.es,en:ex.en,tts:ex.tts,cat:"estructura",focus:guide.id==="pasado"||guide.id==="pasado-contraste"?"past":guide.id==="futuro"?"future":guide.id==="pronombres"?"pronombres":guide.id==="subjuntivo"?"subjuntivo":"present"})));
FRASES.filter(sec=>sec.section).forEach(sec=>{if(sec.items){const isPron=/Pronombres/i.test(sec.section);const isBad=/Groserías/i.test(sec.section);const quizCat=sec.quizCat||(isPron?"pronombres":isBad?"groserias":"frases");sec.items.forEach(i=>aQ.push({es:i.es,en:i.en,tts:i.es,cat:quizCat,focus:isPron?"pronombres":undefined}));}});
CONVERSATION_QUIZ.forEach(q=>aQ.push(q));
FILL_BLANK_QUIZ.forEach(q=>aQ.push(q));
/* Vocabulary examples remain in Vocab as full context. Only the authored
   prompts above enter Fill blank; generic example sentences stay out. */

const QC=[{id:"all",label:"All"},{id:"frases",label:"Frases"},{id:"cortesia",label:"🙏 Courtesy"},{id:"muletillas",label:"☕ Diminutives & Fillers"},{id:"reparar",label:"🧰 Repair"},{id:"conectores",label:"🔗 Connectors"},{id:"direcciones",label:"🧭 Directions"},{id:"aeropuerto",label:"🛬 Airport"},{id:"uber",label:"🚕 Uber"},{id:"uber-real",label:"🚕 Uber · full trip"},{id:"hotel",label:"🏨 Hotel"},{id:"bancos-pagos",label:"💳 Nequi & Pay"},{id:"restaurante",label:"🍽️ Restaurant"},{id:"restaurante-real",label:"🍽️ Restaurant · real"},{id:"compras",label:"🛒 Shopping"},{id:"mercado",label:"🛍️ Market"},{id:"farmacia",label:"💊 Pharmacy"},{id:"medico",label:"🩺 Medical"},{id:"barberia",label:"💈 Barbershop"},{id:"porteria",label:"🏢 Portería & Rappi"},{id:"panaderia",label:"🥐 Panadería & Jugos"},{id:"viajes-finca",label:"🌄 Buses & Finca"},{id:"empatia",label:"💛 Empathy & Reactions"},{id:"comodin",label:"🔑 Verbos Comodín"},{id:"whatsapp",label:"📱 WhatsApp & Citas"},{id:"arriendo",label:"🔑 Arriendo & Airbnb"},{id:"gym-ciclovia",label:"🚴 Gym & Ciclovía"},{id:"citas-familia",label:"❤️ Citas & Familia"},{id:"corrientazo",label:"🫓 Corrientazo & Onces"},{id:"cajero-sim",label:"🏦 Cajero & SIM Card"},{id:"puentes-rumba",label:"🎉 Puentes & Rumba"},{id:"sanjuan-guajira",label:"🪗 San Juan & Guajira"},{id:"seguridad-emergencias",label:"🚨 Seguridad & 123"},{id:"hogar-reparaciones",label:"🔧 Hogar & Técnico"},{id:"eventos-futbol",label:"⚽ Fútbol & Boletas"},{id:"trampas",label:"🪤 Trampas Colombianas"},{id:"estratos",label:"🏘️ Estratos & Conjuntos"},{id:"odontologia",label:"🦷 Odontología & Óptica"},{id:"migracion-ce",label:"🛂 Migración & Cédula"},{id:"expresiones",label:"🇨🇴 Expressions"},{id:"social",label:"🤝 Social"},{id:"fiesta",label:"🎉 Party"},{id:"deportes",label:"⚽ Sports"},{id:"oficina-real",label:"🧑‍💼 Office"},{id:"gerundios",label:"🔄 Actions in progress"},{id:"mandatos",label:"🗣️ Commands"},{id:"estructura",label:"🧱 Structure"},{id:"subjuntivo",label:"🌱 Subjuntivo"},{id:"pronunciacion",label:"🔊 Sounds"},{id:"groserias",label:"⚠️ Groserías"},{id:"pronombres",label:"Lo / La / Le"},{id:"vocales",label:"Vocales"},{id:"numeros",label:"Números"},{id:"meses",label:"Meses"},{id:"colores",label:"Colores"},{id:"dias",label:"Días"},{id:"familia",label:"Familia"},{id:"verbos",label:"Verbos"},{id:"acciones",label:"Acciones"},{id:"cuerpo",label:"Cuerpo"},{id:"comida",label:"Comida"},{id:"lugares",label:"Lugares"},{id:"tiempo",label:"Tiempo"},{id:"adjetivos",label:"Adjetivos"},{id:"profesiones",label:"Profesiones"},{id:"casa",label:"Casa"},{id:"habitacion",label:"Habitación"},{id:"bano",label:"Baño"},{id:"trabajo",label:"Trabajo"},{id:"oficina",label:"Oficina"},{id:"carropartes",label:"Partes del carro"},{id:"cocina",label:"Cocina"},{id:"gustos",label:"Gustos"},{id:"tv",label:"TV"},{id:"ropa",label:"Ropa"},{id:"animales",label:"Animals"},{id:"clima",label:"Clima"},{id:"tecnologia",label:"Tecnología"},{id:"emociones",label:"Emociones"},{id:"colombianismos",label:"Colombia"}];
const QUIZ_MODES=[
  {id:"mixed",label:"Mixed"},{id:"es-en",label:"ES → EN"},{id:"en-es",label:"EN → ES"},
  {id:"listening",label:"🎧 Listening"},{id:"dictation",label:"⌨️ Dictation"},{id:"blank",label:"✏️ Fill blank"},{id:"conversation",label:"💬 Conversation"}
];
const QUIZ_FOCUS=[
  {id:"all",label:"All patterns"},{id:"present",label:"Presente"},{id:"past",label:"Pasado"},
  {id:"future",label:"Futuro"},{id:"perfecto",label:"He hecho"},{id:"condicional",label:"Condicional"},
  {id:"pasado-perfecto",label:"Había hecho"},{id:"futuro-perfecto",label:"Habré hecho"},
  {id:"pronombres",label:"Pronombres"},{id:"subjuntivo",label:"Subjuntivo"}
];
const FOCUS_MODES=new Set(["mixed","blank","conversation","dictation"]);

/* ── Persistent score + missed-question tracking (NEW v13) ──────────────────
   Saved in localStorage. Wrong answers get asked again more often. */
const QS_KEY="esco-quiz-v1";
let qStore={c:0,t:0,s:0,missed:{}};
try{const raw=localStorage.getItem(QS_KEY);if(raw)qStore=Object.assign(qStore,JSON.parse(raw));}catch(e){}
if(!Object.keys(srsStore).length&&qStore.missed){Object.keys(qStore.missed).forEach(key=>{srsStore[key]={reps:0,interval:0,lapses:0,due:Date.now()};});saveSrs();}
function saveQ(){try{localStorage.setItem(QS_KEY,JSON.stringify(qStore));}catch(e){}}
let repasoLeft=0;
let qCat="all",qMode="mixed",qFocus="all",qC=qStore.c||0,qT=qStore.t||0,qS=qStore.s||0,cQ=null,an=false,qMissedOnly=false;
/* Normal quiz rounds do not repeat until the available pool is used. Missed
   questions may still repeat intentionally through the explicit Repaso card. */
let qRoundKey="",qRoundSeen=new Set();
function resetQuizRound(){qRoundKey="";qRoundSeen.clear();}
document.getElementById("q-correct").textContent=qC;
document.getElementById("q-total").textContent=qT;
document.getElementById("q-streak").textContent="🔥 "+qS;
/* Reset button inside the compact score bar */
(function(){
  const bar=document.querySelector(".quiz-score-bar");
  const btn=document.createElement("button");
  btn.type="button";btn.className="quiz-reset";
  btn.textContent="↺";btn.title="Reiniciar puntaje";btn.setAttribute("aria-label","Reiniciar puntaje");
  btn.onclick=()=>{
    qC=0;qT=0;qS=0;repasoLeft=0;qMissedOnly=false;qStore={c:0,t:0,s:0,missed:{}};srsStore={};saveQ();saveSrs();
    resetQuizRound();
    document.getElementById("q-correct").textContent=0;
    document.getElementById("q-total").textContent=0;
    document.getElementById("q-streak").textContent="🔥 0";
     /* nQ() clears feedback while preserving the unified reveal element. */
     document.getElementById("quiz-fb").classList.remove("visible");
    nQ();
  };
  bar.appendChild(btn);
})();

const SITUATION_BLITZ_PACKS=[
  {id:"uber-blitz",label:"🚕 In an Uber",cats:["uber","uber-real","direcciones","carropartes"]},
  {id:"food-blitz",label:"🍽️ Order & Pay",cats:["restaurante","restaurante-real","bancos-pagos","cortesia","comida","mercado"]},
  {id:"travel-blitz",label:"🛬 Airport & Hotel",cats:["aeropuerto","hotel","lugares","compras"]},
  {id:"social-blitz",label:"🤝 Social & Parche",cats:["social","fiesta","deportes","muletillas","expresiones","colombianismos"]},
  {id:"living-blitz",label:"🏢 Apt, Estratos, Reparaciones & Salud",cats:["estratos","hogar-reparaciones","seguridad-emergencias","migracion-ce","odontologia","cajero-sim","porteria","arriendo","whatsapp","barberia","farmacia","medico","reparar","casa"]},
  {id:"local-blitz",label:"🪗 San Juan, Trampas, Fútbol & Rumba",cats:["sanjuan-guajira","eventos-futbol","trampas","corrientazo","citas-familia","puentes-rumba","panaderia","viajes-finca","empatia","comodin","gym-ciclovia","direcciones","colombianismos"]}
];
let qBlitzPack=null;
const qmw=document.getElementById("qmode-wrap");
if(qmw&&qmw.parentElement){
  const blitzWrap=document.createElement("div");blitzWrap.className="quiz-blitz-wrap";
  blitzWrap.innerHTML=`<div class="quiz-control-label">⚡ Real-Life Situation Blitz (1-tap scenario warmup)</div><div class="quiz-blitz-row" id="qblitz-wrap"></div>`;
  qmw.parentElement.parentElement.insertBefore(blitzWrap,qmw.parentElement);
  const qbw=blitzWrap.querySelector("#qblitz-wrap");
  SITUATION_BLITZ_PACKS.forEach(pack=>{
    const b=document.createElement("button");b.type="button";b.className="qblitz-btn";b.dataset.blitz=pack.id;b.textContent=pack.label;
    b.onclick=()=>{
      if(qBlitzPack&&qBlitzPack.id===pack.id){qBlitzPack=null;repasoLeft=0;}
      else{qBlitzPack=pack;qMissedOnly=false;qMode="mixed";qCat="all";qFocus="all";repasoLeft=10;}
      resetQuizRound();syncQuizControls();nQ();
    };
    qbw.appendChild(b);
  });
}
QUIZ_MODES.forEach(m=>{const b=document.createElement("button");b.type="button";b.className="qmode"+(m.id===qMode?" active":"");b.textContent=m.label;b.onclick=()=>{qBlitzPack=null;qMissedOnly=false;qMode=m.id;repasoLeft=0;resetQuizRound();syncQuizControls();nQ();};qmw.appendChild(b);});
const qcw=document.getElementById("qcat-wrap");
QC.forEach(c=>{const b=document.createElement("button");b.className="qcat"+(c.id==="all"?" active":"");b.textContent=c.label;
  b.onclick=()=>{qBlitzPack=null;qMissedOnly=false;qCat=c.id;repasoLeft=0;resetQuizRound();syncQuizControls();nQ();};qcw.appendChild(b);});
const qfs=document.getElementById("qfocus-select");
if(qfs)qfs.onchange=()=>{qMissedOnly=false;qFocus=qfs.value;repasoLeft=0;resetQuizRound();syncQuizControls();nQ();};
function syncQuizControls(){
  document.querySelectorAll(".qcat").forEach((x,i)=>x.classList.toggle("active",!qBlitzPack&&QC[i].id===qCat));
  document.querySelectorAll(".qmode").forEach((x,i)=>x.classList.toggle("active",QUIZ_MODES[i].id===qMode));
  document.querySelectorAll(".qblitz-btn").forEach(x=>x.classList.toggle("active",!!(qBlitzPack&&x.dataset.blitz===qBlitzPack.id)));
  const focusSupported=FOCUS_MODES.has(qMode);
  if(!focusSupported)qFocus="all";
  if(qfs){qfs.value=qFocus;qfs.disabled=!focusSupported;}
  const note=document.getElementById("qfocus-note");
  if(note){note.textContent=focusSupported?"Choose a grammar pattern, or leave All patterns.":"Choose Mixed, Fill blank, or Conversation to use Grammar focus.";note.classList.toggle("active",focusSupported&&qFocus!=="all");}
}
const BLANK_EN={
  "Yo vivo en Bogotá.":"I live in Bogotá.","¿Dónde vives tú?":"Where do you live?","Ella come arepa todos los días.":"She eats arepa every day.","Nosotros hablamos español.":"We speak Spanish.","Yo tengo dos hermanos.":"I have two siblings.","¿Usted habla inglés?":"Do you speak English?",
  "Mañana yo voy a trabajar.":"Tomorrow I am going to work.","¿Qué vas a comer tú?":"What are you going to eat?","Nosotros vamos a cocinar arepas.":"We are going to cook arepas.","Ella va a ver una película.":"She is going to watch a movie.",
  "Ayer yo fui al mercado.":"Yesterday I went to the market.","¿Qué comiste tú anoche?":"What did you eat last night?","Él trabajó hasta las seis.":"He worked until six.","Anoche yo dormí ocho horas.":"Last night I slept eight hours.",
  "¿Me regala un tinto para tomar, por favor?":"Can I have a black coffee to drink, please?","Gire a la derecha en la esquina.":"Turn right at the corner.","Me ducho en la ducha y me seco con la toalla.":"I shower in the shower and dry myself with the towel.","Hay mucho trancón y los carros no avanzan por la avenida.":"There is a lot of traffic and the cars are not moving on the avenue.","Corto la cebolla con el cuchillo para picarla.":"I cut the onion with the knife to chop it.","Me siento en el sofá de la sala para ver la película.":"I sit on the living-room sofa to watch the movie.","No tengo suficiente plata para pagar el taxi.":"I don't have enough money to pay for the taxi.","La cobija está sobre la cama y me abriga.":"The blanket is on the bed and keeps me warm."
};
function quizPool(){
  let pool;
  if(qMode==="blank")pool=FILL_BLANK_QUIZ.map(q=>({...q,answer:q.en,prompt:q.quizPrompt||q.es}));
  else if(qMode==="conversation")pool=CONVERSATION_QUIZ.map(q=>({...q,answer:q.en,prompt:q.es}));
  else if(qMode==="dictation")pool=aQ.filter(q=>!q.kind&&q.es&&q.tts).map(q=>({...q,answer:q.es,prompt:"🎧",dictation:true}));
  else if(qMode==="en-es")pool=aQ.filter(q=>!q.kind).map(q=>({...q,answer:q.es,prompt:q.en}));
  else if(qMode==="listening")pool=aQ.filter(q=>!q.kind).map(q=>({...q,answer:q.es,prompt:"🎧"}));
  else if(qMode==="es-en")pool=aQ.filter(q=>!q.kind||q.kind==="meaning").map(q=>({...q,answer:q.en,prompt:q.quizPrompt||q.es}));
  else pool=aQ.map(q=>({...q,answer:q.en,prompt:q.kind==="listening"?"🎧":(q.quizPrompt||q.es)}));
  if(qBlitzPack&&Array.isArray(qBlitzPack.cats)){
    pool=pool.filter(q=>qBlitzPack.cats.includes(q.cat));
  }else if(qMode==="blank"){
    if(qCat==="pronombres")pool=pool.filter(q=>q.cat==="pronombres");
    else if(qCat!=="all")pool=pool.filter(q=>q.cat===qCat);
  }else if(qMode==="conversation"){
    pool=qCat==="all"?pool:pool.filter(q=>q.cat===qCat);
  }else{
    pool=qCat==="all"?pool:pool.filter(q=>q.cat===qCat);
  }
  if(FOCUS_MODES.has(qMode)&&qFocus!=="all")pool=pool.filter(q=>q.focus===qFocus);
  return cleanQuizPool(pool);
}
function spanishAnswer(q){
  if(qMode==="en-es")return q.es;
  if(q.kind==="reply"||q.kind==="tense"||q.kind==="pronoun")return q.en;
  if(q.kind==="blank")return q.tts;
  return q.es||q.tts;
}
function englishAnswer(q){
  if(q.kind==="blank")return q.trans||BLANK_EN[q.tts]||"";
  const lines=[...(typeof DIALOGUE!=="undefined"?DIALOGUE:[]),...CONVERSATIONS.flatMap(c=>c.lines||[])];
  const found=lines.find(line=>line.es===q.en||line.es===q.tts||line.es===q.es);
  return found?found.en:(q.en||"");
}
function normalizeDictation(text,stripAccents){
  let s=String(text||"").toLowerCase().trim().replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ");
  return stripAccents?s.normalize("NFD").replace(/n\u0303/g,"ñ").replace(/[\u0300-\u036f]/g,""):s;
}
function normalizeQuizText(text){return String(text||"").toLowerCase().normalize("NFD").replace(/n\u0303/g,"ñ").replace(/[\u0300-\u036f]/g,"").replace(/[’‘]/g,"'").replace(/\bit's\b/g,"it is").replace(/\bi'm\b/g,"i am").replace(/\b(you|we|they)'re\b/g,"$1 are").replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ").trim();}
/* Audit prompts keep accents so "si" and "sí" are not treated as the same
   Spanish word. Answer cleanup ignores parenthetical teaching notes when it
   compares duplicate records. */
function normalizeQuizPrompt(text){return String(text||"").toLowerCase().replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ").trim();}
function normalizeQuizAnswer(text){return String(text||"").toLowerCase().replace(/\([^)]*\)/g,"").replace(/[¿?¡!.,;:…]+/g,"").replace(/\s+/g," ").trim();}
/* Treat a plain vocabulary translation and an authored `meaning` question
   with the same Spanish/English pair as one learning item. Keep other kinds
   separate: a reply, tense check, listening item, or pronoun drill can share
   a prompt while testing a different skill. */
function quizItemKey(q){
  const family=q.kind==="meaning"||!q.kind?"meaning":q.kind;
  return normalizeQuizText(`${family}|${q.es}|${q.answer}`);
}
function quizRoundPromptKey(q){
  const text=(qMode==="listening"||q.prompt==="🎧")?(q.tts||q.es):(q.prompt||q.es);
  return normalizeQuizPrompt(text);
}
function cleanQuizPool(pool){
  const chosen=new Map();
  pool.forEach(q=>{
    if(!q||!q.es||q.answer===undefined)return;
    const key=quizItemKey(q),previous=chosen.get(key);
    /* Authored questions have stronger context and hand-picked distractors;
       prefer them over a plain vocabulary record when both represent the
       same translation pair. */
    const authored=!!(q.kind||q.quizPrompt||Array.isArray(q.choices));
    const previousAuthored=!!(previous&&(previous.kind||previous.quizPrompt||Array.isArray(previous.choices)));
    if(!previous||(!previousAuthored&&authored))chosen.set(key,q);
  });
  return [...chosen.values()].filter(q=>{
    if(!Array.isArray(q.choices))return true;
    const choices=[];const seenChoices=new Set();
    q.choices.forEach(choice=>{const text=String(choice||"").trim();const ck=normalizeQuizText(text);if(text&&ck&&!seenChoices.has(ck)){seenChoices.add(ck);choices.push(text);}});
    q.choices=choices;
    return choices.some(choice=>quizAnswerMatches(q,choice));
  });
}
function missedQuizKey(q){return `${q.es}|${q.en||q.answer}`;}
function clearMissedQuiz(q){
  const canonical=missedQuizKey(q),legacy=`${q.es}|${q.answer}`;
  if(qStore.missed[canonical])delete qStore.missed[canonical];
  if(legacy!==canonical&&qStore.missed[legacy])delete qStore.missed[legacy];
}
function exitMissedQueue(){qMissedOnly=false;repasoLeft=0;resetQuizRound();nQ();}
function openMissedQueue(){qBlitzPack=null;showPage("quiz");qMissedOnly=true;qMode="mixed";qCat="all";qFocus="all";repasoLeft=0;resetQuizRound();syncQuizControls();nQ();}
function nQ(){
  an=false;document.getElementById("quiz-next").style.display="none";const quizFb=document.getElementById("quiz-fb"),quizReveal=document.getElementById("quiz-reveal");quizFb.innerHTML="";if(quizReveal){quizFb.appendChild(quizReveal);quizReveal.innerHTML="";}quizFb.classList.remove("visible");syncMissedQueueLauncher();
  const helpRow=document.getElementById("quiz-help-row"),helpBtn=document.getElementById("quiz-help"),helpText=document.getElementById("quiz-help-text");
  if(helpRow){helpRow.hidden=true;if(helpText){helpText.hidden=true;helpText.textContent="";}if(helpBtn){helpBtn.textContent="💡 Show English help";helpBtn.onclick=null;}}
  const reviewBanner=document.getElementById("quiz-review-banner");
  if(reviewBanner){reviewBanner.hidden=!qMissedOnly;reviewBanner.innerHTML="";}
  const base=quizPool();
  if(!base.length){
    document.querySelector(".qc-label").textContent="No matching questions";
    document.getElementById("qc-word").textContent="Try All topics or All patterns";
    document.getElementById("quiz-opts").innerHTML="";
    return;
  }
  const reviewBase=qMissedOnly?base.filter(q=>Number(qStore.missed[missedQuizKey(q)])>0):base;
  if(!reviewBase.length){
    document.querySelector(".qc-label").textContent=qMissedOnly?"Missed queue complete":"No matching questions";
    document.getElementById("qc-word").textContent=qMissedOnly?"✅":"Try All topics or All patterns";
    document.getElementById("quiz-opts").innerHTML="";
    if(reviewBanner){reviewBanner.hidden=false;reviewBanner.innerHTML="<span><strong>Missed questions</strong> — your retry queue is clear.</span><button type='button' class='quiz-review-exit'>Back to quiz</button>";reviewBanner.querySelector("button").onclick=exitMissedQueue;}
    return;
  }
  if(reviewBanner){reviewBanner.hidden=false;reviewBanner.innerHTML="<span><strong>Missed questions</strong> · "+storedMissedQuestionCount()+" remaining. Correct answers leave the queue.</span><button type='button' class='quiz-review-exit'>Exit queue</button>";reviewBanner.querySelector("button").onclick=exitMissedQueue;}
  const roundKey=(qMissedOnly?"missed|":"normal|")+qMode+"|"+qCat+"|"+qFocus;
  if(roundKey!==qRoundKey){qRoundKey=roundKey;qRoundSeen.clear();}
   let unseen=reviewBase.filter(q=>!qRoundSeen.has(quizRoundPromptKey(q)));
  if(!unseen.length){qRoundSeen.clear();unseen=reviewBase;}
  /* Missed questions can repeat during an explicit Repaso session. In a
     normal round, only unseen missed questions receive extra weighting. */
   const dueAll=reviewBase.filter(q=>srsDue(q.es+"|"+q.answer));
   const duePool=unseen.filter(q=>srsDue(q.es+"|"+q.answer));
   let pickFrom;
   if(repasoLeft>0&&dueAll.length){pickFrom=dueAll;repasoLeft--;}
   else{if(repasoLeft>0)repasoLeft=0;pickFrom=(duePool.length&&Math.random()<0.7)?duePool:unseen;}
  cQ=pickFrom[Math.floor(Math.random()*pickFrom.length)];
   qRoundSeen.add(quizRoundPromptKey(cQ));
  if(helpRow&&cQ.kind==="blank"){
    const translation=englishAnswer(cQ);
    if(translation){
      helpRow.hidden=false;
      helpText.textContent=translation;
      helpBtn.onclick=()=>{const open=helpText.hidden;helpText.hidden=!open;helpBtn.textContent=open?"🙈 Hide English help":"💡 Show English help";};
    }
  }
  if(qMode==="dictation"){
    document.getElementById("qc-word").textContent="🎧";
    document.querySelector(".qc-label").textContent="Listen, then type the Spanish";
    const ow=document.getElementById("quiz-opts");ow.innerHTML="";
    const box=document.createElement("div");box.className="quiz-dictation";
    box.innerHTML="<div class='dictation-hint'>Listen first. Type the full Spanish sentence or phrase from memory.</div>";
    const input=document.createElement("input");input.type="text";input.className="dictation-input";input.placeholder="Escribe en español…";input.autocomplete="off";input.autocapitalize="sentences";
    const submit=document.createElement("button");submit.type="button";submit.className="dictation-submit";submit.textContent="Check →";
    const finish=()=>{
      if(an)return;
      const raw=input.value.trim();if(!raw){input.focus();return;}
      an=true;qT++;document.getElementById("q-total").textContent=qT;
      const expected=String(cQ.answer||cQ.es),strict=normalizeDictation(raw,false)===normalizeDictation(expected,false);
      const loose=normalizeDictation(raw,true)===normalizeDictation(expected,true);
      const correct=strict||loose,fb=document.getElementById("quiz-fb"),quizReveal=document.getElementById("quiz-reveal"),mk=cQ.es+"|"+cQ.answer,missKey=missedQuizKey(cQ);
      submit.disabled=true;input.classList.add(correct?"correct":"wrong");
      if(correct){
        qC++;qS++;recordSrs(mk,true);clearSpeakingError(cQ.tts||cQ.es);document.getElementById("q-correct").textContent=qC;document.getElementById("q-streak").textContent="🔥 "+qS;
         fb.innerHTML=(strict?"✅ ¡Correcto!":"✅ Correcto — check the accent marks.")+" <small class='srs-next'>Next review: "+srsNextLabel(srsStore[mk])+"</small>";fb.style.color="var(--teal)";fb.classList.add("visible");speak(cQ.tts,0.75);
        clearMissedQuiz(cQ);
      }else{
        qS=0;recordSrs(mk,false);recordSpeakingError(cQ.tts||cQ.es,"dictation");document.getElementById("q-streak").textContent="🔥 0";
         fb.innerHTML="❌ Not quite <small class='srs-next'>Review again tomorrow.</small>";fb.style.color="var(--pink)";fb.classList.add("visible");
        input.value=expected;
        qStore.missed[missKey]=(qStore.missed[missKey]||0)+2;
      }
      if(quizReveal){quizReveal.innerHTML="<div>🇨🇴 <strong>"+spanishAnswer(cQ)+"</strong></div><div>🇺🇸 "+englishAnswer(cQ)+"</div>";attachMic(quizReveal,spanishAnswer(cQ));fb.appendChild(quizReveal);}
      qStore.c=qC;qStore.t=qT;qStore.s=qS;saveQ();syncMissedQueueLauncher();
      document.getElementById("quiz-next").style.display="block";
    };
    submit.onclick=finish;input.onkeydown=e=>{if(e.key==="Enter")finish();};
    box.append(input,submit);ow.appendChild(box);if(document.getElementById("page-quiz")?.classList.contains("active")){setTimeout(()=>input.focus(),50);speak(cQ.tts,0.7);}
    return;
  }
  /* Listening questions must not show the Spanish text — hide it and auto-play */
  qBlindPeek=false;
  document.getElementById("qc-word").textContent=qMode==="listening"||cQ.kind==="listening"?"🎧":cQ.prompt;
  renderQuizPromptAndBlind();
  document.querySelector(".qc-label").textContent=qMode==="en-es"?"Translate to Spanish":qMode==="listening"?"Listen and recognize":qMode==="blank"?"Complete the sentence":qMode==="conversation"?(cQ.kind==="reply"?"Choose the natural reply":cQ.kind==="meaning"?"Choose the English meaning":cQ.kind==="listening"?"Listen and recognize":cQ.kind==="tense"?"Choose the matching tense":"Choose the best answer"):qMode==="es-en"?"Translate to English":cQ.kind==="reply"?"Choose the correct reply":cQ.kind==="listening"?"Listen and recognize":cQ.kind==="tense"?"Which tense is it?":cQ.kind==="blank"?"Complete the sentence":"Choose the correct answer";
  if(document.getElementById("page-quiz")?.classList.contains("active")){
    if(qMode==="listening"||cQ.kind==="listening")speak(cQ.tts,0.7);
    else if(isBlindEarActive()&&qMode!=="en-es"&&cQ.kind!=="blank")speak(cQ.tts||cQ.es,0.78);
  }
  const seen=new Set(quizAcceptedAnswers(cQ).map(normalizeQuizText));const wrong=[];
  /* Mixed mode contains several question families.  Do not use a Spanish
     blank answer as a distractor for an English meaning question (or vice
     versa); that makes some questions look like they have multiple answers. */
  const questionFamily=q=>q.kind||"vocab";
  let compatible=base.filter(q=>q!==cQ&&questionFamily(q)===questionFamily(cQ));
  if(compatible.length<3)compatible=base.filter(q=>q!==cQ&&typeof q.answer===typeof cQ.answer);
  const wrongPool=cQ.choices?cQ.choices.map(answer=>({answer})):compatible.sort(()=>Math.random()-0.5);
  for(const w of wrongPool){if(wrong.length>=3)break;if(!w.answer)continue;const wk=normalizeQuizText(w.answer);if(!wk||seen.has(wk))continue;seen.add(wk);wrong.push({answer:w.answer});}
  const opts=[cQ,...wrong].sort(()=>Math.random()-0.5);
  const ow=document.getElementById("quiz-opts");ow.innerHTML="";
  opts.forEach(opt=>{const b=document.createElement("button");b.className="qopt";b.textContent=opt.answer;
    b.onclick=()=>{if(an)return;an=true;qT++;document.getElementById("q-total").textContent=qT;
      renderQuizPromptAndBlind();
      const fb=document.getElementById("quiz-fb"),quizReveal=document.getElementById("quiz-reveal");
      const mk=cQ.es+"|"+cQ.answer,missKey=missedQuizKey(cQ);
        if(quizAnswerMatches(cQ,opt.answer)){b.classList.add("correct");qC++;qS++;recordSrs(mk,true);clearSpeakingError(cQ.tts||cQ.es);document.getElementById("q-correct").textContent=qC;document.getElementById("q-streak").textContent="🔥 "+qS;fb.innerHTML=`✅ ¡Correcto! <small class="srs-next">Next review: ${srsNextLabel(srsStore[mk])}</small>`;fb.style.color="var(--teal)";fb.classList.add("visible");speak(cQ.tts,0.75);
        clearMissedQuiz(cQ);}
        else{b.classList.add("wrong");qS=0;recordSrs(mk,false);recordSpeakingError(cQ.tts||cQ.es,"quiz");document.getElementById("q-streak").textContent="🔥 0";fb.innerHTML="❌ Incorrecto <small class='srs-next'>Review again tomorrow.</small>";fb.style.color="var(--pink)";fb.classList.add("visible");document.querySelectorAll(".qopt").forEach(x=>{if(normalizeQuizText(x.textContent)===normalizeQuizText(cQ.answer))x.classList.add("reveal");});
        qStore.missed[missKey]=(qStore.missed[missKey]||0)+2;}
      if(quizReveal){quizReveal.innerHTML=`<div>🇨🇴 <strong>${spanishAnswer(cQ)}</strong></div><div>🇺🇸 ${englishAnswer(cQ)}</div>`;attachMic(quizReveal,spanishAnswer(cQ));fb.appendChild(quizReveal);}
      qStore.c=qC;qStore.t=qT;qStore.s=qS;saveQ();syncMissedQueueLauncher();
      document.getElementById("quiz-next").style.display="block";};ow.appendChild(b);});
}
let qBlindPeek=false;
function renderQuizPromptAndBlind(){
  const wordEl=document.getElementById("qc-word");
  const tog=document.getElementById("quiz-blind-toggle");
  const peek=document.getElementById("quiz-blind-peek");
  const earOn=isBlindEarActive();
  if(tog){
    tog.textContent=earOn?"🎧 Blind-Ear: ON":"🎧 Blind-Ear: OFF";
    tog.classList.toggle("active",earOn);
    tog.setAttribute("aria-pressed",earOn?"true":"false");
  }
  if(!cQ){if(peek)peek.hidden=true;return;}
  const spanishPrompt=!["en-es","listening","dictation"].includes(qMode)&&cQ.kind!=="listening"&&cQ.prompt&&normalizeQuizText(cQ.prompt)!==normalizeQuizText(cQ.en||"");
  const mask=earOn&&spanishPrompt&&!qBlindPeek&&!an;
  if(qMode==="listening"||cQ.kind==="listening"||qMode==="dictation"){
    if(wordEl)wordEl.textContent="🎧";
    if(peek)peek.hidden=true;
  }else{
    if(wordEl)wordEl.textContent=mask?"🎧 Listen first — tap Peek to read":cQ.prompt;
    if(peek){
      peek.hidden=!(earOn&&spanishPrompt&&!an);
      peek.textContent=qBlindPeek?"🙈 Hide Spanish":"👁️ Peek Spanish";
      peek.onclick=()=>{qBlindPeek=!qBlindPeek;renderQuizPromptAndBlind();};
    }
  }
}
function toggleQuizBlindEar(){
  const earOn=isBlindEarActive();
  if(effectiveLevel()==="fluent"&&earOn){userPrefs.level="explorer";userPrefs.blindEar=false;}
  else{userPrefs.blindEar=!earOn;}
  saveUserPrefs();
  renderQuizPromptAndBlind();
  if(isBlindEarActive()&&cQ&&!an&&qMode!=="en-es")quizHear();
  if(typeof buildSpeakingGuide==="function")buildSpeakingGuide();
  if(typeof buildGram==="function"&&typeof GRAMMAR!=="undefined")buildGram("presente",GRAMMAR.presente);
}
function quizHear(){
  if(!cQ)return;
  if(an){speak(spanishAnswer(cQ),0.7);return;} /* after answering: hear the Spanish answer */
  if(qMode==="dictation"){speak(cQ.tts,0.7);return;}
  if(qMode==="en-es")return; /* pre-answer audio in EN→ES would speak the answer */
  if(cQ.kind==="blank"){speak(cQ.es.replace(/_+/g,","),0.7);return;}
  speak(cQ.tts,0.7);
}
setTimeout(nQ,400);

// ── Nav ───────────────────────────────────────────────────────────────────────
function showPhonetic(id){
  document.querySelectorAll(".phonetic-panel").forEach(x=>x.classList.toggle("active",x.id==="phonetic-"+id));
  document.querySelectorAll(".phonetic-tab").forEach(x=>x.classList.toggle("active",x.id==="pt-"+id));
}
const PG=["fonetica","lecciones","vocab","frases","gram","quiz"];
function showPage(id){
  if(id!=="lecciones"&&typeof setLeccionesFocusMode==="function")setLeccionesFocusMode(false);
  PG.forEach(p=>{document.getElementById("page-"+p).classList.toggle("active",p===id);document.getElementById("tb-"+p).classList.toggle("active",p===id);});
  document.querySelector(".scroll").scrollTop=0;
  if(id!=="vocab")hideVerbDetail();
  if(id==="vocab")showVocabHome();
  if(id==="lecciones"&&typeof renderLessons==="function"){lpLesson=null;renderLessons();}
  if(id==="vocab"||id==="gram")routineDockHide();
  if(id==="quiz"&&!an&&cQ&&(qMode==="listening"||cQ.kind==="listening"||qMode==="dictation"))speak(cQ.tts,0.7);
}

/* v64: iPhone-style horizontal tab swipes without hijacking vertical scroll. */
function initTabSwipe(){
  const scroller=document.querySelector(".scroll");if(!scroller)return;
  let start=null;
  const interactive="button,input,select,textarea,a,summary,[contenteditable='true'],.quiz-mode-row,.quiz-cat-row,.vocab-pills,.phrase-menu,.gram-tabs,.phonetic-tabs";
  scroller.addEventListener("touchstart",e=>{
    if(e.touches.length!==1||e.target.closest(interactive)){start=null;return;}
    const t=e.touches[0];start={x:t.clientX,y:t.clientY,time:Date.now()};
  },{passive:true});
  scroller.addEventListener("touchend",e=>{
    if(!start||e.changedTouches.length!==1){start=null;return;}
    const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y,duration=Date.now()-start.time;start=null;
    if(duration>800||Math.abs(dx)<72||Math.abs(dx)<Math.abs(dy)*1.35)return;
    const active=PG.findIndex(p=>document.getElementById("page-"+p)?.classList.contains("active"));
    if(active<0)return;
    /* A dialogue opened from the daily Shadow action has its own return
       destination. Treat a right swipe like the visible Back button instead
       of jumping to the previous top-level tab (usually Vocab). */
    if(dx>0&&active===PG.indexOf("frases")&&document.getElementById("frases-list")?.dataset.view==="dialogue"){
      returnFromFraseDialogue();
      return;
    }
    const next=active+(dx<0?1:-1);
    if(next>=0&&next<PG.length)showPage(PG[next]);
  },{passive:true});
}
initTabSwipe();
 


/* ═══════════════════════════════════════════════════════════════════════════
   Startup Data Validator (v17) — catches silent data corruption on load.
   ═══════════════════════════════════════════════════════════════════════════ */
function runDataValidator(){
  const issues=[];
  try{
    const seen=new Set();
    VC.forEach(c=>{
      if(seen.has(c.id))issues.push("Duplicate category id: "+c.id);
      seen.add(c.id);
      if(c.items&&typeof VOCAB_EXAMPLES!=="undefined"&&VOCAB_EXAMPLES[c.id]&&VOCAB_EXAMPLES[c.id].length!==c.items.length)
        issues.push('Examples misaligned in "'+c.id+'": '+c.items.length+' words vs '+VOCAB_EXAMPLES[c.id].length+' examples');
    });
    LESSONS.forEach(l=>{
      if(!VC.some(c=>c.id===l.vocab))issues.push('Lesson "'+l.id+'": vocab "'+l.vocab+'" does not exist');
      if(!PHRASE_DIALOGUES.some(d=>d.title===l.dialogue))issues.push('Lesson "'+l.id+'": dialogue "'+l.dialogue+'" does not exist');
      if(l.quizCat!=="all"&&!aQ.some(q=>q.cat===l.quizCat))issues.push('Lesson "'+l.id+'": quiz category "'+l.quizCat+'" is empty');
      if(typeof LESSON_CONTENT!=="undefined"&&!LESSON_CONTENT[l.id])issues.push('Lesson "'+l.id+'": no LESSON_CONTENT entry');
    });
    if(typeof LESSON_CONTENT!=="undefined")Object.entries(LESSON_CONTENT).forEach(([id,c])=>{
      if(!c||!c.goal||!c.goal.es||!c.goal.en)issues.push('Lesson content "'+id+'": missing bilingual goal');
      if(!Array.isArray(c&&c.words)||c.words.length<3)issues.push('Lesson content "'+id+'": needs at least three key words');
      if(!Array.isArray(c&&c.phrases)||c.phrases.length<3)issues.push('Lesson content "'+id+'": needs at least three speaking phrases');
      (c&&c.words||[]).forEach((w,i)=>{if(!w.es||!w.en)issues.push('Lesson content "'+id+'" word '+(i+1)+' missing Spanish or English');});
      (c&&c.phrases||[]).forEach((p,i)=>{if(!p.es||!p.en)issues.push('Lesson content "'+id+'" phrase '+(i+1)+' missing Spanish or English');});
    });
    CONVERSATION_MISSIONS.forEach(m=>{if(!m.id||!m.scenario||!m.prompt||!Array.isArray(m.models)||m.models.length<2)issues.push('Mission "'+(m.id||"?")+'": missing scenario, prompt, or model answers');});
    SPECIAL_SOUNDS.forEach(s=>{if(!s.id||!s.label||!s.tip||!Array.isArray(s.examples)||!s.examples.length)issues.push('Special sound "'+(s.id||"?")+ '": incomplete examples');});
    READINGS.forEach(r=>{if(!r.id||!r.title||!Array.isArray(r.lines)||r.lines.length<3)issues.push('Reading "'+(r.id||"?")+ '": needs at least three lines');r.lines&&r.lines.forEach((line,i)=>{if(!line.es||!line.en||!line.tts)issues.push('Reading "'+r.id+'" line '+(i+1)+' missing Spanish, English, or tts');});});
    CONVERSATIONS.forEach(c=>{c.lines.forEach(L=>{if(!L.tts)issues.push('Conversation "'+c.title+'" ('+c.tense+'): line missing tts');});(c.alternates||[]).forEach((L,i)=>{if(!L.es||!L.en||!L.tts)issues.push('Conversation "'+c.title+'" alternate '+(i+1)+' missing Spanish, English, or tts');});});
    if(typeof TONGUE_TWISTERS!=="undefined")TONGUE_TWISTERS.forEach(t=>{if(!t.id||!t.target||!t.text||!t.en||!t.tts)issues.push('Tongue twister "'+(t.id||"?")+'": incomplete Spanish, English, or audio text');});
    if(typeof PRONUNCIATION_TIPS!=="undefined")PRONUNCIATION_TIPS.forEach(t=>{if(!t.target||!t.title||!t.sound||!Array.isArray(t.steps)||!t.steps.length||!t.avoid)issues.push('Pronunciation tip "'+(t.target||"?")+'": incomplete coaching content');});
    if(typeof PHONETIC_WARMUP!=="undefined")PHONETIC_WARMUP.forEach(s=>{if(!s.id||!s.label||!s.detail||!s.tts||!s.target||!s.note)issues.push('Warm-up step "'+(s.id||"?")+'": incomplete practice content');});
    if(typeof ENGLISH_INTERFERENCE!=="undefined")ENGLISH_INTERFERENCE.forEach(s=>{if(!s.pattern||!s.spanish||!s.english||!s.example||!s.en||!s.tts)issues.push('English interference card "'+(s.pattern||"?")+'": incomplete content');});
    if(typeof MINIMAL_PAIRS!=="undefined")MINIMAL_PAIRS.forEach(s=>{if(!s.a||!s.aEn||!s.b||!s.bEn||!s.tip||!s.tts)issues.push('Minimal pair "'+(s.a||"?")+'": incomplete content');});
    if(typeof SPANISH_THINKING_PROMPTS!=="undefined")SPANISH_THINKING_PROMPTS.forEach(s=>{if(!s.intent||!s.model||!s.tts)issues.push('Spanish-thinking prompt missing intent, model, or tts');});
    if(typeof SPEAKING_GUIDE!=="undefined")SPEAKING_GUIDE.forEach(g=>{if(!g.id||!g.title||!g.formula||!g.explain||!g.mistake||!g.exercise)issues.push('Speaking guide "'+(g.id||"?")+ '": incomplete explanation');(g.examples||[]).forEach((ex,i)=>{if(!ex.es||!ex.en||!ex.tts)issues.push('Speaking guide "'+g.id+'" example '+(i+1)+' missing Spanish, English, or tts');});});
    if(typeof LESSON_META!=="undefined")LESSONS.forEach(l=>{const m=LESSON_META[l.id];if(!m)return;(m.guideIds||[]).forEach(id=>{if(typeof SPEAKING_GUIDE!=="undefined"&&!SPEAKING_GUIDE.some(g=>g.id===id))issues.push('Lesson "'+l.id+'": guide "'+id+'" does not exist');});});
    [...CONVERSATION_QUIZ,...FILL_BLANK_QUIZ].forEach((q,i)=>{if(!Array.isArray(q.choices))return;const choices=q.choices.map(String);const normalized=choices.map(normalizeQuizText);if(choices.length!==4)issues.push('Data quiz question '+(i+1)+' needs exactly four answer choices');if(new Set(normalized).size!==normalized.length)issues.push('Data quiz question '+(i+1)+' has duplicate answer choices');if(q.en&&!normalized.includes(normalizeQuizText(q.en)))issues.push('Data quiz question '+(i+1)+' correct answer is not in its choices');if(q.kind==="blank"&&!String(q.es).includes("___"))issues.push('Data quiz question '+(i+1)+' is marked blank but has no blank in its Spanish prompt');});
    aQ.forEach((q,i)=>{if(!Array.isArray(q.choices))return;const choices=q.choices.map(String);const normalized=choices.map(normalizeQuizText);if(choices.length!==4)issues.push('Quiz question '+(i+1)+' needs exactly four answer choices');if(new Set(normalized).size!==normalized.length)issues.push('Quiz question '+(i+1)+' has duplicate answer choices');if(q.en&&!normalized.includes(normalizeQuizText(q.en)))issues.push('Quiz question '+(i+1)+' correct answer is not in its choices');if(q.kind==="blank"&&!String(q.es).includes("___"))issues.push('Quiz question '+(i+1)+' is marked blank but has no blank in its Spanish prompt');});
    FRASES.forEach(s=>{if(s.id&&s.section)issues.push('FRASES "'+s.id+'": has BOTH id and section (breaks hybrid filters)');});
  }catch(e){issues.push("Validator crashed: "+e.message);}
  if(issues.length){
    const b=document.createElement("div");b.className="data-warning";
    b.innerHTML="⚠️ <strong>Data problems detected:</strong><br>"+issues.slice(0,6).join("<br>")+(issues.length>6?"<br>…and "+(issues.length-6)+" more (see console)":"");
    document.body.appendChild(b);
    console.warn("DATA VALIDATOR:",issues);
  }
  return issues;
}
runDataValidator();

/* ═══════════════════════════════════════════════════════════════════════════
   Portable Profile Backup & Restore (v97.0) — 100% static GitHub Pages sync
   between PC and iPhone without requiring a backend server.
   ═══════════════════════════════════════════════════════════════════════════ */
function attachProfileBackupControls(utilityBody){
  if(!utilityBody)return;
  const row=document.createElement("div");row.className="profile-backup-row";
  const expBtn=document.createElement("button");expBtn.type="button";expBtn.className="profile-reset profile-backup-btn";
  expBtn.textContent="💾 Export Backup";expBtn.title="Download a JSON backup of this profile's progress to transfer to iPhone or PC";
  const impBtn=document.createElement("button");impBtn.type="button";impBtn.className="profile-reset profile-backup-btn";
  impBtn.textContent="📂 Import Backup";impBtn.title="Restore progress from a saved JSON backup file";
  const fileIn=document.createElement("input");fileIn.type="file";fileIn.accept="application/json,.json";fileIn.hidden=true;
  const status=document.createElement("small");status.className="profile-backup-status";status.setAttribute("aria-live","polite");
  expBtn.onclick=()=>{
    try{
      const prefix=`esco-profile-${activeProfileId}-`;
      const data={};
      for(let i=0;i<nativeStorage.length;i++){
        const k=nativeStorage.key(i);
        if(k&&k.startsWith(prefix))data[k.slice(prefix.length)]=nativeStorage.getItem(k);
      }
      const payload=JSON.stringify({app:"espanol-colombia",version:"v97.0",profile:activeProfileId,exportedAt:new Date().toISOString(),data},null,2);
      const blob=new Blob([payload],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.download=`espanol-colombia-${activeProfileId}-backup.json`;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      status.textContent="✅ Backup downloaded!";
    }catch(e){status.textContent="⚠️ Could not export backup.";}
  };
  impBtn.onclick=()=>fileIn.click();
  fileIn.onchange=()=>{
    const f=fileIn.files&&fileIn.files[0];if(!f)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(String(reader.result||"{}"));
        const entries=parsed&&parsed.data&&typeof parsed.data==="object"?parsed.data:null;
        if(!entries)throw new Error("Invalid backup file");
        const prefix=`esco-profile-${activeProfileId}-`;
        Object.entries(entries).forEach(([k,v])=>{if(typeof v==="string")nativeStorage.setItem(prefix+k,v);});
        status.textContent="✅ Backup restored! Reloading…";
        setTimeout(()=>location.reload(),350);
      }catch(e){status.textContent="⚠️ Invalid backup JSON file.";}
    };
    reader.readAsText(f);
  };
  row.append(expBtn,impBtn,fileIn,status);
  utilityBody.appendChild(row);
}
buildProfileBar();
