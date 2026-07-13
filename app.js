// Spanish learning app behavior
// ── Voice ─────────────────────────────────────────────────────────────────────
let voices=[],selV=null;
const VOICE_KEY="esco-selected-voice-v1";
const VOICE_HOSTS=["fonetica","lecciones","vocab","frases","gram","quiz"];
let savedVoiceKey="";
try{savedVoiceKey=localStorage.getItem(VOICE_KEY)||"";}catch(e){}
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
function speak(t,r){
  if(!window.speechSynthesis)return;
  const sp=getSpanishVoices();
  const saved=savedVoiceKey&&sp.find(v=>voiceKey(v)===savedVoiceKey); /* saved pick wins the moment the list recovers */
  const live=saved||(selV&&sp.find(v=>v.name===selV.name&&v.lang===selV.lang));
  const voice=live||chooseSpanishVoice(sp);
  if(voice)selV=voice; /* use it, but do NOT persist — only an explicit dropdown pick (chV) saves, so a flaky iOS voice list can't overwrite the user's choice */
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t);
  if(voice){u.voice=voice;u.lang=voice.lang;}else u.lang="es-MX"; /* es-MX ships on every iPhone; bare es-CO with no matching voice falls back to English */
  u.rate=r||0.8;
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
let aF=null;const fw=document.getElementById("filter-wrap");
const fab=document.createElement("button");fab.className="fb active";fab.id="fb-all";fab.textContent="Todas";fab.onclick=()=>sF(null);fw.appendChild(fab);
CN.forEach(l=>{const b=document.createElement("button");b.className="fb";b.id="fb-"+l;b.textContent=l;b.onclick=()=>sF(l);fw.appendChild(b);});
function sF(l){document.getElementById(aF?"fb-"+aF:"fb-all").classList.remove("active");aF=l;document.getElementById(l?"fb-"+l:"fb-all").classList.add("active");rC();}
function rC(){
  const c=document.getElementById("combo-groups");c.innerHTML="";
  (aF?[aF]:CN).forEach(con=>{
    const ch=con==="Ñ"?"ñ":con.toLowerCase();const g=document.createElement("div");g.className="cg";
    const sub=con==="X"?"X casi siempre va entre vocales — palabras reales":"Toca para escuchar";
    g.innerHTML=`<div class="cg-hdr"><button class="cg-badge" onclick="speak('${LI[con].tts}',0.7)">${con}</button>
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
    VW.forEach(v=>{const inf=gc(con,v);const d=ch+v;const chip=document.createElement("button");chip.className="cc";
      chip.innerHTML=`<span class="cc-big"><span style="color:var(--teal)">${d[0].toUpperCase()}</span><span style="color:var(--pink)">${d[1]}</span></span>
        <span class="cc-ph">${inf.p}</span>${inf.n?`<span class="cc-note">${inf.n}</span>`:""}
        <span style="font-size:0.8rem">🔊</span>`;
      const label=d;chip.onclick=()=>speakSyl(label,inf.t);gr.appendChild(chip);});});
}
rC();

// ── Build Vocab ───────────────────────────────────────────────────────────────
const VOCAB_CATS=VC.filter(cat=>cat.id!=="vocales");
const VOCAB_LAST_KEY="esco-vocab-last-v1";
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
let aC="gustos";
try{aC=localStorage.getItem(VOCAB_LAST_KEY)||aC;}catch(e){}
if(!VOCAB_CATS.some(cat=>cat.id===aC))aC=VOCAB_CATS.some(cat=>cat.id==="gustos")?"gustos":(VOCAB_CATS[0]?.id||"");
const VOCAB_GROUPS=[
  {title:"Start with everyday speech",sub:"Useful words for talking about yourself",ids:["gustos","familia","verbos","tiempo","emociones","colombianismos"]},
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
  b.innerHTML=`<span class="vocab-home-card-title">${cat.label}</span><span class="vocab-home-card-meta">${vocabCount(cat)} ${tag||"words"} <span>›</span></span>`;
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
  vocabHomeJump.hidden=false;vocabHome.hidden=false;vocabCategoryView.hidden=true;renderVocabHome();
}
function showVocabCategory(){vocabHomeJump.hidden=true;vocabHome.hidden=true;vocabCategoryView.hidden=false;}
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
function escapeVocabHtml(value){return String(value||"").replace(/[&<>\"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[ch]));}
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
  toggle.onclick=event=>{event.stopPropagation();const open=panel.hidden;panel.hidden=!open;toggle.classList.toggle("open",open);toggle.setAttribute("aria-expanded",String(open));};
  panel.onclick=event=>event.stopPropagation();
  panel.querySelector(".vc-example-speak").onclick=event=>{event.stopPropagation();speak(ex.tts||ex.es,0.75);};
  card.appendChild(toggle);card.appendChild(panel);
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
let micPanel=null,micRecorder=null,micChunks=[],micUrl=null,micTarget="",micStream=null;
function micSupported(){return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);}
function micStopStream(){if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}}
function closeMicPanel(){if(micPanel)micPanel.style.display="none";micStopStream();try{if(micRecorder&&micRecorder.state==="recording")micRecorder.stop();}catch(e){}}
function openMicPanel(target){
  micTarget=target;
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
  else if(state==="idle"&&!micUrl)h+='<div class="mic-hint">Say it out loud FIRST. Then record and compare with the model.</div>';
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
    return micLev(h,t)<=Math.max(1,Math.floor(t.length*0.25));
  });
}
function micListen(){
  if(!SR){renderMicPanel("idle","Speech recognition is not available on this device.");return;}
  const languages=["es-CO","es-419","es-MX"];
  let attempt=0,done=false,retrying=false,current=null;
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
      if(micMatch(alts,micTarget)){markPracticed(micTarget);renderMicPanel("idle","✅ Understood! I heard: “"+heard+"”");}
      else renderMicPanel("idle","❌ I heard: “"+(heard||"…nothing")+"” — try again, slower and louder.");
    };
    rec.onerror=e=>{
      if(rec!==current||done)return;
      const canRetry=(e.error==="language-not-supported"||e.error==="network")&&attempt<languages.length-1;
      if(canRetry){retrying=true;attempt++;setTimeout(()=>{if(!done){retrying=false;start();}},180);return;}
      done=true;renderMicPanel("idle","Recognition failed ("+(e.error||"error")+"). Use Record + compare by ear if this keeps happening.");
    };
    rec.onend=()=>{if(rec!==current||done||retrying)return;done=true;renderMicPanel("idle","I did not hear anything. Get closer to the mic and try again.");};
    try{rec.start();}catch(e){
      if(attempt<languages.length-1){attempt++;start();}
      else{done=true;renderMicPanel("idle","Recognition is not available here.");}
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
function attachMic(container,target){
  if(!target)return;
  if(!micSupported()&&!(SPEECH_CHECK_ENABLED&&SR))return;
  const b=document.createElement("button");
  b.type="button";b.className="mic-mini";b.textContent="🎙️";b.title="Practice pronunciation";
  b.onclick=e=>{e.stopPropagation();openMicPanel(target);};
  container.appendChild(b);
}

function rV(){
  const cat=VC.find(c=>c.id===aC);const list=document.getElementById("vocab-list");list.innerHTML="";
  if(cat.type==="vocales"){rVocales(list);return;}
  if(cat.type==="numeros"){rN(list);return;}
  if(cat.type==="preguntas"){rP(list);return;}
  if(cat.type==="verbos"){rVerbos(list);return;}
  if(cat.type==="colombianismos"){rCol(list);return;}
  cat.items.forEach((item,index)=>{
    const card=document.createElement("div");card.className="vc";
    card.innerHTML=`<div class="vc-icon" style="background:${item.color}22;color:${item.color}">${item.icon}</div>
      <div class="vc-info"><div class="vc-word">${item.word}</div><div class="vc-en">${item.en}</div><div class="vc-ph">${item.ph}</div></div>
      <span class="vc-spk">🔊</span>`;
    card.onclick=()=>speak(item.tts,0.75);
    addVocabExample(card,item,cat.id,index);attachMic(card,item.tts||item.word);list.appendChild(card);
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

function rVerbos(list){
  const note=document.createElement("div");note.className="intro-note";
  note.innerHTML=`<div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--purple);margin-bottom:6px;font-weight:800">🏃 Verbos — Tap any verb for full conjugation</div>
    <div style="font-size:0.82rem;color:var(--muted);line-height:1.6">Tap a verb to see all tenses (present/past/future), word family (beber→bebida), imperatives, and examples.</div>`;
  list.appendChild(note);
  Object.entries(VERBS).forEach(([key,verb])=>{
    const card=document.createElement("div");card.className="vc";
    card.style.borderColor=`${verb.color}44`;
    card.innerHTML=`<div class="vc-icon" style="background:${verb.color}22;color:${verb.color}">${verb.icon}</div>
      <div class="vc-info"><div class="vc-word" style="color:${verb.color}">${key}</div><div class="vc-en">${verb.en}</div><div class="vc-ph" style="color:${verb.color}">${verb.type}</div></div>
      <span class="vc-arrow">›</span>`;
    card.onclick=()=>showVerbDetail(key,verb);list.appendChild(card);});
}

function rCol(list){
  const note=document.createElement("div");note.className="intro-note";
  note.innerHTML=`<div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);margin-bottom:6px;font-weight:800">🇨🇴 Colombianismos</div>
    <div style="font-size:0.82rem;color:var(--muted);line-height:1.6">Expressions used every day in Colombia that you won't learn in a textbook. Tap to hear.</div>`;
  list.appendChild(note);
  COLOMBIANISMOS.forEach(item=>{
    const card=document.createElement("div");card.className="col-card";
    card.innerHTML=`<div class="col-card-top">
      <span class="col-flag">🇨🇴</span>
      <div class="col-word-wrap"><div class="col-word">${item.word}</div><div class="col-en">${item.en}</div></div>
      <span class="col-spk">🔊</span></div>
      <div class="col-usage">${item.usage}<div class="col-example">💬 ${item.example}</div></div>`;
    card.onclick=()=>speak(item.tts,0.75);list.appendChild(card);});
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
  [["⚡ Presente","present","rgba(74,168,160,0.2)","var(--teal)"],["⏮️ Pasado","past","rgba(232,93,117,0.2)","var(--pink)"],["⏭️ Futuro","future","rgba(96,165,250,0.2)","var(--blue)"]].forEach(([title,tense,bg,color])=>{
    const wrap=document.createElement("div");wrap.className="vd-tense-wrap";
    const th=document.createElement("div");th.className="vd-tense-title";th.style.background=bg;
    th.innerHTML=`<span class="vd-tense-name" style="color:${color}">${title}</span>`;
    const rows=document.createElement("div");rows.className="vd-conj-rows";
    verb[tense].forEach(row=>{
      const r=document.createElement("div");r.className="vd-conj-row";
      r.innerHTML=`<span class="vd-pro">${row.p}</span><span class="vd-verb">${row.v}</span><span class="vd-en-small">${row.e}</span><span class="vd-spk">🔊</span>`;
      r.onclick=()=>speak(row.v,0.75);rows.appendChild(r);});
    wrap.appendChild(th);wrap.appendChild(rows);vd.appendChild(wrap);});
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
    const versions=CONVERSATIONS.filter(c=>c.title===title).map(c=>({tense:c.tense,lines:c.lines}));
    return {title,preview:versions[0].lines[0].es,en:"Ahora · Planes · Ayer",versions};
  })
];
const TENSE_BADGE={
  "Ahora":{txt:"⚡ Ahora · presente",css:"color:var(--teal);background:rgba(74,168,160,0.12);border:1px solid rgba(74,168,160,0.25)"},
  "Planes":{txt:"⏭️ Planes · voy a...",css:"color:var(--blue);background:rgba(96,165,250,0.12);border:1px solid rgba(96,165,250,0.25)"},
  "Ayer":{txt:"⏮️ Ayer · pasado",css:"color:var(--pink);background:rgba(232,93,117,0.12);border:1px solid rgba(232,93,117,0.25)"},
};
function fraseSectionMeta(sec){
  const m=String(sec.section||"").match(/^(\S+)\s+(.*)$/);
  return m?{icon:m[1],name:m[2]}:{icon:"💬",name:sec.section||""};
}
function renderFraseMenu(){
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
  const h1=document.createElement("div");h1.className="fr-home-label";h1.textContent="💬 Conversations · practice both sides";
  fl.appendChild(h1);
  const g1=document.createElement("div");g1.className="fr-home-grid";
  PHRASE_DIALOGUES.forEach(d=>{
    const c=document.createElement("button");c.type="button";c.className="fr-home-card";
    c.innerHTML=`<div class="fr-card-title">${d.title}</div><div class="fr-card-sub">${d.en||""}</div><div class="fr-card-meta">${(d.versions||[]).length} tenses ›</div>`;
    c.onclick=()=>renderFraseDialogue(d);
    g1.appendChild(c);
  });
  fl.appendChild(g1);
  const h2=document.createElement("div");h2.className="fr-home-label";h2.textContent="📋 Phrase collections · tap to open";
  fl.appendChild(h2);
  const g2=document.createElement("div");g2.className="fr-home-grid";
  const tit=document.createElement("button");tit.type="button";tit.className="fr-home-card fr-col";
  tit.innerHTML=`<div class="fr-card-icon">🏷️</div><div class="fr-card-title">Títulos</div><div class="fr-card-meta">2 items ›</div>`;
  tit.onclick=()=>renderFraseSection(-1);
  g2.appendChild(tit);
  sections.forEach((s,i)=>{
    const meta=fraseSectionMeta(s);
    const c=document.createElement("button");c.type="button";c.className="fr-home-card fr-col";
    c.innerHTML=`<div class="fr-card-icon">${meta.icon}</div><div class="fr-card-title">${meta.name}</div><div class="fr-card-meta">${(s.items||[]).length} phrases ›</div>`;
    c.onclick=()=>renderFraseSection(i);
    g2.appendChild(c);
  });
  fl.appendChild(g2);
}
function renderFraseSection(idx){
  fl.dataset.view="section";
  fl.innerHTML="";
  const back=document.createElement("button");
  back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>All phrases</span>";
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
  const st=document.createElement("div");st.className="frase-title";st.style.cssText=sec.cls||"";st.textContent=sec.section;wrap.appendChild(st);
  sec.items.forEach(item=>{
    const card=document.createElement("div");card.className="frase-card";
    card.innerHTML=`<div class="frase-txt"><div class="f-es">${item.es}</div><div class="f-en">${item.en}</div></div><span class="f-spk">🔊</span>`;
    card.onclick=()=>speak(item.es,0.75);
    attachMic(card,item.es);
    wrap.appendChild(card);
  });
  fl.appendChild(wrap);
}
function renderFraseDialogue(dialogue,tense){
  fl.dataset.view="dialogue";
  fl.innerHTML="";
  const back=document.createElement("button");
  back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>Back to phrases</span>";
  back.onclick=renderFraseMenu;
  fl.appendChild(back);
  /* Header: title + English + tense selector — one version at a time (v23) */
  const versions=dialogue.versions||[];
  const active=tense||(versions[0]&&versions[0].tense)||"Ahora";
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
  /* Speaking practice: hide one side, say the line out loud, tap to reveal */
  const bubbles=[];
  const pbar=document.createElement("div");pbar.className="practice-bar";
  const pInfo=document.createElement("div");pInfo.className="practice-info";
  pInfo.textContent="🗣️ Speaking practice: hide one side, say the line out loud, then tap to reveal.";
  const pBtns=document.createElement("div");pBtns.className="practice-btns";
  const mkPB=(label,who)=>{
    const b=document.createElement("button");b.type="button";b.className="practice-btn"+(who===null?" active":"");b.textContent=label;
    b.onclick=()=>{
      pBtns.querySelectorAll(".practice-btn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      bubbles.forEach(bb=>bb.el.classList.toggle("dlg-hidden",who!==null&&bb.who===who));
    };
    return b;
  };
  pBtns.appendChild(mkPB("👀 Show all",null));
  pBtns.appendChild(mkPB("Practice A","A"));
  pBtns.appendChild(mkPB("Practice B","B"));
  pbar.appendChild(pInfo);pbar.appendChild(pBtns);
  fl.appendChild(pbar);
  const box=document.createElement("div");
  box.className="dialogue phrase-dialogue";
  box.innerHTML=`<div class="dlg-title">Tap any line to hear it</div>`;
  const version=versions.find(v=>v.tense===active)||versions[0];
  if(version){
    version.lines.forEach(line=>{
      const row=document.createElement("div");
      row.className="dlg-line"+(line.who==="B"?" right":"");
      row.innerHTML=`<div class="dlg-avatar" style="background:${line.who==="A"?"rgba(74,168,160,0.2)":"rgba(167,139,250,0.2)"}">${line.who}</div><div class="dlg-bubble"><div class="dlg-es">${line.es}</div><div class="dlg-en">${line.en}</div></div>`;
      const bub=row.querySelector(".dlg-bubble");
      bubbles.push({who:line.who,el:bub});
      bub.onclick=()=>{
        if(bub.classList.contains("dlg-hidden"))bub.classList.remove("dlg-hidden");
        speak(line.tts,0.75);
      };
      attachMic(row,line.tts);
      box.appendChild(row);
    });
  }
  fl.appendChild(box);
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
  {id:"colombia",icon:"🇨🇴",title:"Colombianismos",sub:"Sonidos y palabras que escucharás en Colombia",vocab:"colombianismos",dialogue:"Carro y taxi",quizCat:"colombianismos"}
];
const LESSON_KEY="esco-lesson-progress-v1";
let lessonProgress={};
try{lessonProgress=JSON.parse(localStorage.getItem(LESSON_KEY)||"{}");}catch(e){lessonProgress={};}
function saveLessons(){try{localStorage.setItem(LESSON_KEY,JSON.stringify(lessonProgress));}catch(e){}}

/* Racha de días — practice-day streak */
const DAY_KEY="esco-days-v1";
let dayInfo={last:"",streak:0};
try{dayInfo=Object.assign(dayInfo,JSON.parse(localStorage.getItem(DAY_KEY)||"{}"));}catch(e){}
(function(){
  const today=new Date().toISOString().slice(0,10);
  if(dayInfo.last!==today){
    const y=new Date(Date.now()-86400000).toISOString().slice(0,10);
    dayInfo.streak=(dayInfo.last===y)?(dayInfo.streak||0)+1:1;
    dayInfo.last=today;
    try{localStorage.setItem(DAY_KEY,JSON.stringify(dayInfo));}catch(e){}
  }
})();

/* Lesson player state */
let lpLesson=null,lpSteps=[],lpStep=0,lpScore=0,lpQs=[],lpQi=0,lpAnswered=false,lpPracticed=new Set();
function lessonDialogue(lesson){return PHRASE_DIALOGUES.find(x=>x.title===lesson.dialogue);}
function openLesson(lesson){
  lpLesson=lesson;lpStep=0;lpScore=0;lpQi=0;lpAnswered=false;lpPracticed=new Set();
  const c=LESSON_CONTENT[lesson.id];
  lpSteps=c?["objetivo","escucha","palabras","frases","hablaA","hablaB","pronun","quiz","fin"]:["fin"];
  if(c)buildLessonQuiz(lesson,c);
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
function renderLessonStep(){
  const root=document.getElementById("lesson-list");if(!root||!lpLesson)return;root.innerHTML="";
  const c=LESSON_CONTENT[lpLesson.id];
  const step=lpSteps[lpStep];
  saveResume();
  const back=document.createElement("button");back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>Back to lessons</span>";
  back.onclick=()=>{lpLesson=null;renderLessons();};
  root.appendChild(back);
  root.appendChild(lpEl("lp-dots",lpSteps.map((s,i)=>`<span class="lp-dot${i===lpStep?" on":i<lpStep?" past":""}"></span>`).join("")));
  const card=lpEl("lp-card");
  const title=lpEl("lp-step-title");
  const body=lpEl("lp-body");
  card.appendChild(title);card.appendChild(body);root.appendChild(card);
  const nav=lpEl("lp-nav");root.appendChild(nav);
  const navBtn=(label,fn,primary)=>{const b=document.createElement("button");b.type="button";b.className="lp-nav-btn"+(primary?" primary":"");b.textContent=label;b.onclick=fn;nav.appendChild(b);return b;};
  const next=()=>{lpStep++;lpAnswered=false;renderLessonStep();};
  const prev=()=>{if(lpStep>0){lpStep--;renderLessonStep();}};
  if(step==="objetivo"){
    title.textContent="🎯 Goal — by the end you will be able to say:";
    body.appendChild(lpEl("lp-goal-es",c.goal.es));
    body.appendChild(lpEl("lp-goal-en",c.goal.en));
    body.appendChild(lpSpeakBtn(c.goal.es));
    attachMic(body,c.goal.es);
    body.appendChild(lpEl("lp-hint","Listen to it, then say it out loud twice before moving on."));
    navBtn("Start →",next,true);
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
  else if(step==="palabras"){
    title.textContent="🔑 Key words — tap, listen, repeat out loud";
    const grid=lpEl("lp-grid");
    c.words.forEach(w=>{
      const wc=lpEl("lp-word","<div class='lp-word-es'>"+w.es+"</div><div class='lp-word-en'>"+w.en+"</div><span>🔊</span>");
      wc.onclick=()=>speak(w.es.replace(/\.\.\./g,""),0.75);attachMic(wc,w.es.replace(/\.\.\./g,""));
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
  else if(step==="hablaA"||step==="hablaB"){
    const who=step==="hablaA"?"A":"B";
    title.textContent="🎭 Your turn — you are Person "+who+". Say your lines out loud, tap to check";
    const d=lessonDialogue(lpLesson);
    const lines=d?d.versions[0].lines:[];
    lines.forEach(L=>{
      const hidden=L.who===who;
      const row=lpEl("lp-line"+(hidden?" lp-me":""),"<strong>"+L.who+":</strong> <span class='lp-line-es"+(hidden?" lp-blur":"")+"'>"+L.es+"</span><div class='lp-line-en'>"+L.en+"</div>");
      row.onclick=()=>{
        const esEl=row.querySelector(".lp-line-es");
        if(esEl.classList.contains("lp-blur"))esEl.classList.remove("lp-blur");
        speak(L.tts,0.75);
      };
      attachMic(row,L.tts);
      body.appendChild(row);
    });
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
    if(q.autoTts)setTimeout(()=>speak(q.autoTts,0.7),300);
    const fb=lpEl("lp-quiz-fb","");
    const grid=lpEl("lp-grid lp-quiz-grid");
    q.options.forEach(opt=>{
      const b=document.createElement("button");b.type="button";b.className="lp-opt";b.textContent=opt;
      b.onclick=()=>{
        if(lpAnswered)return;lpAnswered=true;
        if(opt===q.answer){b.classList.add("correct");lpScore++;fb.innerHTML="✅ ¡Correcto! <div class='lp-reveal'>📖 "+q.revEs+" — "+q.revEn+"</div>";speak(q.afterTts,0.75);}
        else{b.classList.add("wrong");grid.querySelectorAll(".lp-opt").forEach(x=>{if(x.textContent===q.answer)x.classList.add("reveal");});fb.innerHTML="❌ Not quite. <div class='lp-reveal'>📖 "+q.revEs+" — "+q.revEn+"</div>";}
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
  else{
    title.textContent="🎉 Lesson complete!";
    if(lpQs.length)body.appendChild(lpEl("lp-goal-es","Mini-quiz: "+lpScore+" of "+lpQs.length));
    if(c){body.appendChild(lpEl("lp-hint","You can now say:"));body.appendChild(lpEl("lp-goal-es",c.goal.es));body.appendChild(lpSpeakBtn(c.goal.es));attachMic(body,c.goal.es);}
    lessonProgress[lpLesson.id]=true;saveLessons();
    const explore=lpEl("lp-explore","<div class='lp-hint'>Explore more:</div>");
    const mk=(label,fn)=>{const b=document.createElement("button");b.type="button";b.className="lp-nav-btn";b.textContent=label;b.onclick=fn;explore.appendChild(b);};
    mk("📚 Vocabulary",()=>{showPage("vocab");sCat(lpLesson.vocab);});
    mk("💬 Full conversation",()=>{showPage("frases");const d=lessonDialogue(lpLesson);if(d)renderFraseDialogue(d);});
    mk("🧪 Full quiz",()=>{showPage("quiz");qCat=lpLesson.quizCat;qMode=lpLesson.quizMode||"mixed";syncQuizControls();nQ();});
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
        RR_BANK.push({q:q.tts||q.es,qEs:q.es,qEn:q.en,aEs:ans.es,aTts:ans.tts||ans.es,aEn:ans.en});
      }
    }
  });});
})();
let rrTimer=null,rrCurrent=null,rrSession=0;
function rrStop(){if(rrTimer){clearInterval(rrTimer);rrTimer=null;}}
function rrExit(){rrStop();renderLessons();}
function renderRapida(keepSame){
  rrStop();
  const root=document.getElementById("lesson-list");if(!root)return;
  if(!RR_BANK.length){renderLessons();return;}
  if(!keepSame||!rrCurrent){rrCurrent=RR_BANK[Math.floor(Math.random()*RR_BANK.length)];rrSession++;}
  root.innerHTML="";
  const back=document.createElement("button");back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=rrExit;
  root.appendChild(back);
  const card=lpEl("lp-card rr-card");
  card.appendChild(lpEl("lp-step-title","⚡ Reacción Rápida — question "+rrSession+" this session"));
  const qBox=lpEl("rr-question",rrCurrent.qEs);
  qBox.onclick=()=>speak(rrCurrent.q,0.75);
  card.appendChild(qBox);
  card.appendChild(lpEl("rr-qen",rrCurrent.qEn||""));
  const cd=lpEl("rr-countdown","5");
  card.appendChild(cd);
  card.appendChild(lpEl("lp-hint","🗣️ Answer OUT LOUD — any answer that fits. The model reveals when the timer ends."));
  const controls=lpEl("lp-nav");
  const revealBtn=document.createElement("button");revealBtn.type="button";revealBtn.className="lp-nav-btn";revealBtn.textContent="Reveal now";
  revealBtn.onclick=()=>rrReveal();
  controls.appendChild(revealBtn);
  card.appendChild(controls);
  root.appendChild(card);
  speak(rrCurrent.q,0.75);
  let n=5;
  rrTimer=setInterval(()=>{
    n--;
    if(n<=0){rrReveal();return;}
    cd.textContent=String(n);
  },1000);
}
function rrReveal(){
  rrStop();
  const root=document.getElementById("lesson-list");if(!root||!rrCurrent)return;
  root.innerHTML="";
  const back=document.createElement("button");back.type="button";back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>Back to lessons</span>";back.onclick=rrExit;
  root.appendChild(back);
  const card=lpEl("lp-card rr-card");
  card.appendChild(lpEl("lp-step-title","⚡ Reacción Rápida — model answer"));
  card.appendChild(lpEl("rr-question rr-q-small",rrCurrent.qEs));
  const ans=lpEl("rr-answer",rrCurrent.aEs);
  ans.onclick=()=>speak(rrCurrent.aTts,0.75);
  card.appendChild(ans);
  card.appendChild(lpEl("rr-qen",rrCurrent.aEn||""));
  card.appendChild(lpEl("lp-hint","Did your answer get the idea across? That counts. Compare with the model, then try the same one again or grab the next."));
  const row1=lpEl("lp-nav");
  const hearB=document.createElement("button");hearB.type="button";hearB.className="lp-nav-btn";hearB.textContent="🔊 Model";
  hearB.onclick=()=>speak(rrCurrent.aTts,0.75);
  const micB=document.createElement("button");micB.type="button";micB.className="lp-nav-btn";micB.textContent="🎙️ Record & compare";
  micB.onclick=()=>openMicPanel(rrCurrent.aTts);
  row1.appendChild(hearB);row1.appendChild(micB);
  card.appendChild(row1);
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

function renderLessons(){
  const root=document.getElementById("lesson-list");if(!root)return;
  if(lpLesson){renderLessonStep();return;}
  root.innerHTML="";
  const done=LESSONS.filter(x=>lessonProgress[x.id]).length;
  const intro=document.createElement("div");intro.className="lesson-intro";
  intro.innerHTML=`<div class="lesson-intro-title">${done} de ${LESSONS.length} complete · 🔥 ${dayInfo.streak}-day streak</div><div class="lesson-progress"><span style="width:${Math.round(done/LESSONS.length*100)}%"></span></div><div class="lesson-flow">Each lesson: 📖 Learn → 🗣️ Speak → 🧪 Quiz</div>`;
  root.appendChild(intro);
  /* Continue / Start here (v21) */
  const resume=loadResume();
  const resLesson=resume&&LESSONS.find(l=>l.id===resume.id);
  const nextLesson=LESSONS.find(l=>!lessonProgress[l.id]);
  const cont=document.createElement("div");cont.className="continue-card";
  let cTitle,cSub,cAction;
  if(resLesson&&!lessonProgress[resLesson.id]){
    cTitle="▶️ Continue: "+resLesson.title;
    cSub="Step "+((resume.step|0)+1)+" of 9 — pick up where you left off";
    cAction=()=>openLessonAt(resLesson,resume.step,resume.qi,resume.score);
  }else if(nextLesson){
    cTitle=(done===0?"▶️ Start here: ":"▶️ Next lesson: ")+nextLesson.title;
    cSub=nextLesson.sub;
    cAction=()=>openLesson(nextLesson);
  }else{
    cTitle="🎉 All lessons complete";
    cSub="Replay any lesson below, or drill with Reacción Rápida";
    cAction=null;
  }
  cont.innerHTML=`<div class="continue-title">${cTitle}</div><div class="continue-sub">${cSub}</div>`;
  if(cAction){cont.onclick=cAction;cont.classList.add("tappable");}
  root.appendChild(cont);
  let missedCount=0;
  try{const s=JSON.parse(localStorage.getItem("esco-quiz-v1")||"{}");missedCount=s.missed?Object.keys(s.missed).length:0;}catch(e){}
  /* Daily practice — one compact row (v22) */
  const daily=document.createElement("div");daily.className="daily-row";
  const dr1=document.createElement("button");dr1.type="button";dr1.className="daily-card";
  dr1.innerHTML=`<div class="daily-icon">🔁</div><div class="daily-title">Review</div><div class="daily-sub">${missedCount?missedCount+" item"+(missedCount===1?"":"s")+" due":"nothing due"}</div>`;
  dr1.onclick=()=>{showPage("quiz");qMode="mixed";qCat="all";syncQuizControls();repasoLeft=10;nQ();};
  const dr2=document.createElement("button");dr2.type="button";dr2.className="daily-card";
  dr2.innerHTML=`<div class="daily-icon">⚡</div><div class="daily-title">Rápida</div><div class="daily-sub">${RR_BANK.length} questions</div>`;
  dr2.onclick=()=>{rrSession=0;renderRapida(false);};
  daily.appendChild(dr1);daily.appendChild(dr2);
  root.appendChild(daily);

  /* Lessons grouped into stages (v23) */
  const LESSON_STAGES=[
    {name:"🌱 Fundamentos",ids:["presentate","plata"]},
    {name:"🏠 Vida diaria",ids:["casa","cocina","calle"]},
    {name:"💬 Conversación",ids:["trabajo","gustos","planes","sentirse"]},
    {name:"🇨🇴 Colombia",ids:["colombia"]}
  ];
  let lessonNum=0;
  LESSON_STAGES.forEach(stage=>{
    const stageLessons=stage.ids.map(id=>LESSONS.find(l=>l.id===id)).filter(Boolean);
    if(!stageLessons.length)return;
    const sDone=stageLessons.filter(l=>lessonProgress[l.id]).length;
    const sh=document.createElement("div");sh.className="stage-label";
    sh.innerHTML=`<span>${stage.name}</span><span class="stage-count">${sDone}/${stageLessons.length}</span>`;
    root.appendChild(sh);
    stageLessons.forEach(lesson=>{
      lessonNum++;
      const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"");
      card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}</div><div class="lesson-sub">${lesson.sub}</div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
      card.onclick=()=>openLesson(lesson);
      card.querySelector(".lesson-check").onclick=(e)=>{e.stopPropagation();if(lessonProgress[lesson.id])delete lessonProgress[lesson.id];else lessonProgress[lesson.id]=true;saveLessons();renderLessons();};
      root.appendChild(card);
    });
  });
  /* Any lesson not assigned to a stage still shows (future-proofing weekly additions) */
  const staged=new Set(LESSON_STAGES.flatMap(s=>s.ids));
  LESSONS.filter(l=>!staged.has(l.id)).forEach(lesson=>{
    lessonNum++;
    const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"");
    card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${lessonNum}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}</div><div class="lesson-sub">${lesson.sub}</div></div><button type="button" class="lesson-check" aria-label="Mark lesson complete">${lessonProgress[lesson.id]?"✓":"○"}</button></div>`;
    card.onclick=()=>openLesson(lesson);
    card.querySelector(".lesson-check").onclick=(e)=>{e.stopPropagation();if(lessonProgress[lesson.id])delete lessonProgress[lesson.id];else lessonProgress[lesson.id]=true;saveLessons();renderLessons();};
    root.appendChild(card);
  });
  /* Progress backup lives at the bottom — rare-use utility (v22) */
  const bkLabel=document.createElement("div");bkLabel.className="fr-home-label";bkLabel.textContent="💾 Progress backup";
  root.appendChild(bkLabel);
  /* Backup / restore progress (v17) */
  const bk=document.createElement("div");bk.className="backup-row";
  const BK_KEYS=["esco-quiz-v1","esco-lesson-progress-v1","esco-days-v1"];
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
}
renderLessons();

// ── Build Grammar ─────────────────────────────────────────────────────────────
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
  const intro=document.createElement("div");intro.className="gram-intro";
  intro.innerHTML=`<div class="gram-intro-title">${id==="presente"?"⚡":id==="pasado"?"⏮️":"⏭️"} ${id.charAt(0).toUpperCase()+id.slice(1)}</div>
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
["presente","pasado","futuro","trucos"].forEach(id=>buildGram(id,GRAMMAR[id]));
buildGram("pronombres");buildGram("reflexivos");

/* Grouped grammar navigation (v23): Tiempos / Pronombres / Patrones */
const GRAM_GROUPS={
  tiempos:{label:"⏱️ Tiempos",items:[["presente","⚡ Presente"],["pasado","⏮️ Pasado"],["futuro","⏭️ Futuro"]]},
  pronombres:{label:"👤 Pronombres",items:[["pronombres","Lo / La / Le"]]},
  patrones:{label:"🧩 Patrones",items:[["reflexivos","🔄 Reflexivos"],["trucos","🧠 Trucos"]]}
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
  ["presente","pasado","futuro","pronombres","reflexivos","trucos"].forEach(g=>{
    document.getElementById("gs-"+g).classList.toggle("active",g===id);
  });
  const sub=document.getElementById("gram-sub");
  if(sub){
    const items=GRAM_GROUPS[gramGroup].items;
    Array.from(sub.children).forEach((b,i)=>b.classList.toggle("active",items[i]&&items[i][0]===id));
  }
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
const CONVERSATION_QUIZ=[
  {kind:"meaning",es:"¿Cómo te llamas?",en:"What's your name?",tts:"¿Cómo te llamas?",cat:"conversaciones",choices:["What's your name?","Where do you live?","What do you do for work?","Do you have siblings?"]},
  {kind:"reply",es:"¿Cómo te llamas?",en:"Me llamo Laura.",tts:"¿Cómo te llamas?",cat:"conversaciones",choices:["Me llamo Laura.","Vivo en Medellín.","Trabajo como chef.","Siga derecho."]},
  {kind:"listening",es:"Me llamo Laura. Mucho gusto.",en:"My name is Laura. Nice to meet you.",tts:"Me llamo Laura. Mucho gusto.",cat:"conversaciones",choices:["My name is Laura. Nice to meet you.","Yesterday I met a new person.","I work as an engineer.","I live near the park."]},
  {kind:"tense",es:"¿Cuál frase habla de un plan futuro?",en:"Mañana voy a presentarme a mis nuevos vecinos.",tts:"Mañana voy a presentarme a mis nuevos vecinos.",cat:"conversaciones",choices:["Mañana voy a presentarme a mis nuevos vecinos.","Me llamo Laura.","Ayer conocí a una persona nueva.","Le dije mi nombre."]},
  {kind:"meaning",es:"Trabajo como ingeniero.",en:"I work as an engineer.",tts:"Trabajo como ingeniero.",cat:"conversaciones",choices:["I work as an engineer.","I'm going to study medicine.","I worked at the office yesterday.","I'm a passenger."]},
  {kind:"reply",es:"¿En qué trabajas?",en:"Trabajo como ingeniero.",tts:"¿En qué trabajas?",cat:"conversaciones",choices:["Trabajo como ingeniero.","Voy a vivir en Bogotá.","Tengo una hermana.","Me gusta leer."]},
  {kind:"listening",es:"Voy a estudiar para ser médico.",en:"I'm going to study to become a doctor.",tts:"Voy a estudiar para ser médico.",cat:"conversaciones",choices:["I'm going to study to become a doctor.","Yesterday I worked at the office.","Go straight and turn left.","I like my job."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",en:"Ayer trabajé en la oficina.",tts:"Ayer trabajé en la oficina.",cat:"conversaciones",choices:["Ayer trabajé en la oficina.","Trabajo como ingeniero.","Voy a estudiar para ser médico.","¿Qué vas a estudiar?"]},
  {kind:"meaning",es:"¿Dónde vives?",en:"Where do you live?",tts:"¿Dónde vives?",cat:"conversaciones",choices:["Where do you live?","Where are you going to live?","Where did you live before?","Where is the bathroom?"]},
  {kind:"reply",es:"¿Dónde vives?",en:"Vivo en Medellín, cerca del parque.",tts:"¿Dónde vives?",cat:"conversaciones",choices:["Vivo en Medellín, cerca del parque.","Voy a pasar tiempo con ellos.","Viví en Cali con mi familia.","Claro, con mucho gusto."]},
  {kind:"listening",es:"Voy a vivir en Bogotá el próximo año.",en:"I'm going to live in Bogotá next year.",tts:"Voy a vivir en Bogotá el próximo año.",cat:"conversaciones",choices:["I'm going to live in Bogotá next year.","I live in Medellín.","I lived in Cali with my family.","I'm going to request a taxi."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",en:"Viví en Cali con mi familia.",tts:"Viví en Cali con mi familia.",cat:"conversaciones",choices:["Viví en Cali con mi familia.","Vivo en Medellín.","Voy a vivir en Bogotá.","¿Dónde vives?"]},
  {kind:"meaning",es:"¿Tienes hermanos?",en:"Do you have siblings?",tts:"¿Tienes hermanos?",cat:"conversaciones",choices:["Do you have siblings?","Do you have pets?","What are you going to do?","Do you like sports?"]},
  {kind:"reply",es:"¿Qué vas a hacer con tu familia?",en:"Voy a pasar tiempo con ellos.",tts:"¿Qué vas a hacer con tu familia?",cat:"conversaciones",choices:["Voy a pasar tiempo con ellos.","Sí, tengo una hermana.","Ayer cené con mis padres.","No me gusta mi trabajo."]},
  {kind:"listening",es:"Ayer cené con mis padres.",en:"Yesterday I had dinner with my parents.",tts:"Ayer cené con mis padres.",cat:"conversaciones",choices:["Yesterday I had dinner with my parents.","I have a sister and a brother.","I'm going to spend time with them.","It is delicious."]},
  {kind:"tense",es:"¿Cuál frase describe el presente?",en:"Sí, tengo una hermana y un hermano.",tts:"Sí, tengo una hermana y un hermano.",cat:"conversaciones",choices:["Sí, tengo una hermana y un hermano.","Voy a pasar tiempo con ellos.","Ayer cené con mis padres.","¿Qué hiciste con tu familia?"]},
  {kind:"meaning",es:"Siga derecho y gire a la izquierda.",en:"Go straight and turn left.",tts:"Siga derecho y gire a la izquierda.",cat:"conversaciones",choices:["Go straight and turn left.","Turn right at the traffic light.","The address is nearby.","Take me to this address."]},
  {kind:"reply",es:"Disculpe, ¿me regala la dirección?",en:"Siga derecho y gire a la izquierda.",tts:"Disculpe, ¿me regala la dirección?",cat:"conversaciones",choices:["Siga derecho y gire a la izquierda.","Me llamo Laura.","Voy a preparar una sopa.","Está al lado de la habitación."]},
  {kind:"listening",es:"Va a girar en la próxima esquina.",en:"You are going to turn at the next corner.",tts:"Va a girar en la próxima esquina.",cat:"conversaciones",choices:["You are going to turn at the next corner.","I went straight and asked at the corner.","Go straight and turn left.","The driver was very kind."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",en:"Seguí derecho y pregunté en la esquina.",tts:"Seguí derecho y pregunté en la esquina.",cat:"conversaciones",choices:["Seguí derecho y pregunté en la esquina.","Siga derecho y gire a la izquierda.","Va a girar en la próxima esquina.","¿Cómo voy a llegar al parqueadero?"]},
  {kind:"meaning",es:"¿Me lleva a esta dirección, por favor?",en:"Can you take me to this address, please?",tts:"¿Me lleva a esta dirección, por favor?",cat:"conversaciones",choices:["Can you take me to this address, please?","Are we going to request a car?","Did you take a taxi yesterday?","Where is the parking lot?"]},
  {kind:"reply",es:"¿Vamos a pedir un carro?",en:"Sí, voy a pedir un taxi.",tts:"¿Vamos a pedir un carro?",cat:"conversaciones",choices:["Sí, voy a pedir un taxi.","Claro, con mucho gusto.","Trabajo como conductor.","Ayer trabajé en la oficina."]},
  {kind:"listening",es:"Claro, con mucho gusto.",en:"Of course, with pleasure.",tts:"Claro, con mucho gusto.",cat:"conversaciones",choices:["Of course, with pleasure.","Yes, I'm going to request a taxi.","The driver was very kind.","I live near the park."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",en:"Sí, el conductor fue muy amable.",tts:"Sí, el conductor fue muy amable.",cat:"conversaciones",choices:["Sí, el conductor fue muy amable.","¿Me lleva a esta dirección?","Voy a pedir un taxi.","Vamos a pedir un carro."]},
  {kind:"meaning",es:"¿Cocinamos juntos?",en:"Shall we cook together?",tts:"¿Cocinamos juntos?",cat:"conversaciones",choices:["Shall we cook together?","What are we going to cook?","What did you cook yesterday?","I cut the vegetables."]},
  {kind:"reply",es:"¿Qué vamos a cocinar?",en:"Vamos a preparar una sopa.",tts:"¿Qué vamos a cocinar?",cat:"conversaciones",choices:["Vamos a preparar una sopa.","Dale, yo corto las verduras.","Ayer hervimos la comida.","Me gusta la música."]},
  {kind:"listening",es:"Dale, yo corto las verduras.",en:"Sure, I'll cut the vegetables.",tts:"Dale, yo corto las verduras.",cat:"conversaciones",choices:["Sure, I'll cut the vegetables.","We are going to make a soup.","Yesterday we tasted the sauce.","Can you give me the address?"]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",en:"Ayer hervimos la comida y probamos la salsa.",tts:"Ayer hervimos la comida y probamos la salsa.",cat:"conversaciones",choices:["Ayer hervimos la comida y probamos la salsa.","¿Cocinamos juntos?","Vamos a preparar una sopa.","Yo corto las verduras."]},
  {kind:"meaning",es:"¿Dónde está el baño?",en:"Where is the bathroom?",tts:"¿Dónde está el baño?",cat:"conversaciones",choices:["Where is the bathroom?","Where is the bedroom?","Where was the towel?","Are you going to tidy the bedroom?"]},
  {kind:"reply",es:"¿Vas a arreglar la habitación?",en:"Sí, voy a cambiar la sábana y la cobija.",tts:"¿Vas a arreglar la habitación?",cat:"conversaciones",choices:["Sí, voy a cambiar la sábana y la cobija.","Está al lado de la habitación.","Ayer la dejé junto al lavamanos.","Siga derecho."]},
  {kind:"listening",es:"Ayer la dejé junto al lavamanos.",en:"Yesterday I left it next to the sink.",tts:"Ayer la dejé junto al lavamanos.",cat:"conversaciones",choices:["Yesterday I left it next to the sink.","It is next to the bedroom.","I'm going to change the sheet.","Where is the bathroom?"]},
  {kind:"tense",es:"¿Cuál frase describe el presente?",en:"Está al lado de la habitación.",tts:"Está al lado de la habitación.",cat:"conversaciones",choices:["Está al lado de la habitación.","Voy a cambiar la sábana.","Ayer la dejé junto al lavamanos.","¿Dónde estaba la toalla?"]}
];
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
  {kind:"blank",es:"Mañana ___ a trabajar.",en:"voy",tts:"Mañana voy a trabajar.",cat:"completar",choices:["voy","vas","va","vamos"]},
  {kind:"blank",es:"¿Qué ___ a comer tú?",en:"vas",tts:"¿Qué vas a comer tú?",cat:"completar",choices:["vas","voy","va","van"]},
  {kind:"blank",es:"Nosotros ___ a cocinar arepas.",en:"vamos",tts:"Nosotros vamos a cocinar arepas.",cat:"completar",choices:["vamos","voy","vas","van"]},
  {kind:"blank",es:"Ella ___ a ver una película.",en:"va",tts:"Ella va a ver una película.",cat:"completar",choices:["va","voy","vas","vamos"]},
  /* Pasado */
  {kind:"blank",es:"Ayer yo ___ al mercado.",en:"fui",tts:"Ayer yo fui al mercado.",cat:"completar",choices:["fui","fue","fuiste","fuimos"]},
  {kind:"blank",es:"¿Qué ___ tú anoche?",en:"comiste",tts:"¿Qué comiste tú anoche?",cat:"completar",choices:["comiste","comí","comió","comimos"]},
  {kind:"blank",es:"Él ___ hasta las seis.",en:"trabajó",tts:"Él trabajó hasta las seis.",cat:"completar",choices:["trabajó","trabajé","trabajaste","trabajamos"]},
  {kind:"blank",es:"Anoche yo ___ ocho horas.",en:"dormí",tts:"Anoche yo dormí ocho horas.",cat:"completar",choices:["dormí","durmió","dormiste","dormimos"]},
  /* Vocabulario */
  {kind:"blank",es:"¿Me regala un ___, por favor?",en:"tinto",tts:"¿Me regala un tinto, por favor?",cat:"completar",choices:["tinto","trancón","cuchillo","semáforo"]},
  {kind:"blank",es:"Gire a la ___ en la esquina.",en:"derecha",tts:"Gire a la derecha en la esquina.",cat:"completar",choices:["derecha","ducha","cuchara","almohada"]},
  {kind:"blank",es:"El jabón está en la ___.",en:"ducha",tts:"El jabón está en la ducha.",cat:"completar",choices:["ducha","cama","olla","esquina"]},
  {kind:"blank",es:"Hay mucho ___ en la avenida.",en:"trancón",tts:"Hay mucho trancón en la avenida.",cat:"completar",choices:["trancón","tinto","clóset","jabón"]},
  {kind:"blank",es:"Corto la cebolla con el ___.",en:"cuchillo",tts:"Corto la cebolla con el cuchillo.",cat:"completar",choices:["cuchillo","sofá","semáforo","reloj"]},
  {kind:"blank",es:"Veo la película en el ___.",en:"sofá",tts:"Veo la película en el sofá.",cat:"completar",choices:["sofá","lavamanos","parqueadero","azúcar"]},
  {kind:"blank",es:"No tengo ___ para el taxi.",en:"plata",tts:"No tengo plata para el taxi.",cat:"completar",choices:["plata","vaina","cobija","sartén"]},
  {kind:"blank",es:"La ___ está sobre la cama.",en:"cobija",tts:"La cobija está sobre la cama.",cat:"completar",choices:["cobija","gasolina","luz","sal"]},
];

let aQ=[];
VC.forEach(cat=>{
  if(cat.type==="basic")cat.items.forEach(i=>aQ.push({es:i.word,en:i.en,tts:i.tts,cat:cat.id}));
  if(cat.type==="vocales")VOCALES_DATA.forEach(v=>v.examples.forEach(ex=>aQ.push({es:ex.word,en:ex.en,tts:ex.tts,cat:"vocales"})));
  if(cat.type==="numeros"){[...N130,...NT].forEach(n=>aQ.push({es:n.w,en:String(n.n),tts:n.w,cat:"numeros"}));}
  if(cat.type==="preguntas")PQ.forEach(p=>aQ.push({es:p.word,en:p.en,tts:p.tts,cat:"preguntas"}));
  if(cat.type==="verbos")Object.entries(VERBS).forEach(([k,v])=>aQ.push({es:k,en:v.en,tts:k,cat:"verbos"}));
  if(cat.type==="colombianismos")COLOMBIANISMOS.forEach(c=>aQ.push({es:c.word,en:c.en,tts:c.tts,cat:"colombianismos"}));
});
FRASES.filter(sec=>sec.section).forEach(sec=>{if(sec.items)sec.items.forEach(i=>aQ.push({es:i.es,en:i.en,tts:i.es,cat:"frases"}));});
CONVERSATION_QUIZ.forEach(q=>aQ.push(q));
FILL_BLANK_QUIZ.forEach(q=>aQ.push(q));
/* ── AUTO-COMPLETAR (v17): every vocab example becomes a fill-in-the-blank ── */
(function(){
  const norm=t=>[...String(t)].map(ch=>{const d=ch.normalize("NFD");return d[0].toLowerCase();}).join("");
  let made=0;
  VC.forEach(cat=>{
    if(!cat.items)return;
    const sibs=[...new Set(cat.items.map(i=>i.tts||i.word).filter(Boolean))];
    cat.items.forEach((item,ix)=>{
      const ex=getVocabExample(item,cat.id,ix);
      if(!ex||!ex.es||ex.es===item.word)return;
      const target=item.tts||item.word;
      if(!target)return;
      const sEs=ex.es,sN=norm(sEs),tN=norm(target);
      if(tN.length<3)return;
      const pos=sN.indexOf(tN);
      if(pos<0)return;
      let end=pos+tN.length;
      while(end<sEs.length&&/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/.test(sEs[end]))end++;
      const found=sEs.slice(pos,end);
      const blanked=sEs.slice(0,pos)+"___"+sEs.slice(end);
      const wrong=sibs.filter(w=>norm(w)!==tN).sort(()=>Math.random()-0.5).slice(0,3);
      if(wrong.length<3)return;
      aQ.push({kind:"blank",es:blanked,en:found,tts:sEs,cat:"completar",choices:[found,...wrong],trans:ex.en});
      made++;
    });
  });
  console.log("Auto-Completar generated:",made,"questions");
})();

const QC=[{id:"all",label:"All"},{id:"frases",label:"Frases"},{id:"vocales",label:"Vocales"},{id:"numeros",label:"Números"},{id:"meses",label:"Meses"},{id:"colores",label:"Colores"},{id:"dias",label:"Días"},{id:"familia",label:"Familia"},{id:"verbos",label:"Verbos"},{id:"cuerpo",label:"Cuerpo"},{id:"comida",label:"Comida"},{id:"lugares",label:"Lugares"},{id:"tiempo",label:"Tiempo"},{id:"adjetivos",label:"Adjetivos"},{id:"profesiones",label:"Profesiones"},{id:"casa",label:"Casa"},{id:"habitacion",label:"Habitación"},{id:"bano",label:"Baño"},{id:"trabajo",label:"Trabajo"},{id:"oficina",label:"Oficina"},{id:"carropartes",label:"Partes del carro"},{id:"direcciones",label:"Direcciones"},{id:"cocina",label:"Cocina"},{id:"gustos",label:"Gustos"},{id:"tv",label:"TV"},{id:"ropa",label:"Ropa"},{id:"animales",label:"Animales"},{id:"clima",label:"Clima"},{id:"tecnologia",label:"Tecnología"},{id:"emociones",label:"Emociones"},{id:"colombianismos",label:"Colombia"}];
const QUIZ_MODES=[
  {id:"mixed",label:"Mixed"},{id:"es-en",label:"ES → EN"},{id:"en-es",label:"EN → ES"},
  {id:"listening",label:"🎧 Listening"},{id:"blank",label:"✏️ Fill blank"},{id:"conversation",label:"💬 Conversation"}
];

/* ── Persistent score + missed-question tracking (NEW v13) ──────────────────
   Saved in localStorage. Wrong answers get asked again more often. */
const QS_KEY="esco-quiz-v1";
let qStore={c:0,t:0,s:0,missed:{}};
try{const raw=localStorage.getItem(QS_KEY);if(raw)qStore=Object.assign(qStore,JSON.parse(raw));}catch(e){}
function saveQ(){try{localStorage.setItem(QS_KEY,JSON.stringify(qStore));}catch(e){}}
let repasoLeft=0;
let qCat="all",qMode="mixed",qC=qStore.c||0,qT=qStore.t||0,qS=qStore.s||0,cQ=null,an=false;
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
    qC=0;qT=0;qS=0;qStore={c:0,t:0,s:0,missed:{}};saveQ();
    document.getElementById("q-correct").textContent=0;
    document.getElementById("q-total").textContent=0;
    document.getElementById("q-streak").textContent="🔥 0";
    document.getElementById("quiz-fb").textContent="";
    nQ();
  };
  bar.appendChild(btn);
})();

const qmw=document.getElementById("qmode-wrap");
QUIZ_MODES.forEach(m=>{const b=document.createElement("button");b.type="button";b.className="qmode"+(m.id===qMode?" active":"");b.textContent=m.label;b.onclick=()=>{qMode=m.id;syncQuizControls();nQ();};qmw.appendChild(b);});
const qcw=document.getElementById("qcat-wrap");
QC.forEach(c=>{const b=document.createElement("button");b.className="qcat"+(c.id==="all"?" active":"");b.textContent=c.label;
  b.onclick=()=>{qCat=c.id;syncQuizControls();nQ();};qcw.appendChild(b);});
function syncQuizControls(){
  document.querySelectorAll(".qcat").forEach((x,i)=>x.classList.toggle("active",QC[i].id===qCat));
  document.querySelectorAll(".qmode").forEach((x,i)=>x.classList.toggle("active",QUIZ_MODES[i].id===qMode));
}
const BLANK_EN={
  "Yo vivo en Bogotá.":"I live in Bogotá.","¿Dónde vives tú?":"Where do you live?","Ella come arepa todos los días.":"She eats arepa every day.","Nosotros hablamos español.":"We speak Spanish.","Yo tengo dos hermanos.":"I have two siblings.","¿Usted habla inglés?":"Do you speak English?",
  "Mañana voy a trabajar.":"Tomorrow I am going to work.","¿Qué vas a comer tú?":"What are you going to eat?","Nosotros vamos a cocinar arepas.":"We are going to cook arepas.","Ella va a ver una película.":"She is going to watch a movie.",
  "Ayer yo fui al mercado.":"Yesterday I went to the market.","¿Qué comiste tú anoche?":"What did you eat last night?","Él trabajó hasta las seis.":"He worked until six.","Anoche yo dormí ocho horas.":"Last night I slept eight hours.",
  "¿Me regala un tinto, por favor?":"Can I have a black coffee, please?","Gire a la derecha en la esquina.":"Turn right at the corner.","El jabón está en la ducha.":"The soap is in the shower.","Hay mucho trancón en la avenida.":"There is a lot of traffic on the avenue.","Corto la cebolla con el cuchillo.":"I cut the onion with the knife.","Veo la película en el sofá.":"I watch the movie on the sofa.","No tengo plata para el taxi.":"I don't have money for the taxi.","La cobija está sobre la cama.":"The blanket is on the bed."
};
function quizPool(){
  let pool;
  if(qMode==="blank")pool=FILL_BLANK_QUIZ.map(q=>({...q,answer:q.en,prompt:q.es}));
  else if(qMode==="conversation")pool=CONVERSATION_QUIZ.map(q=>({...q,answer:q.en,prompt:q.es}));
  else if(qMode==="en-es")pool=aQ.filter(q=>!q.kind).map(q=>({...q,answer:q.es,prompt:q.en}));
  else if(qMode==="listening")pool=aQ.filter(q=>!q.kind).map(q=>({...q,answer:q.es,prompt:"🎧"}));
  else if(qMode==="es-en")pool=aQ.filter(q=>!q.kind||q.kind==="meaning").map(q=>({...q,answer:q.en,prompt:q.es}));
  else pool=aQ.map(q=>({...q,answer:q.en,prompt:q.kind==="listening"?"🎧":q.es}));
  if(qMode==="blank"||qMode==="conversation")return pool; /* these have their own cats */
  return qCat==="all"?pool:pool.filter(q=>q.cat===qCat);
}
function spanishAnswer(q){
  if(qMode==="en-es")return q.es;
  if(q.kind==="reply"||q.kind==="tense")return q.en;
  if(q.kind==="blank")return q.tts;
  return q.es||q.tts;
}
function englishAnswer(q){
  if(q.kind==="blank")return q.trans||BLANK_EN[q.tts]||"";
  const lines=[...(typeof DIALOGUE!=="undefined"?DIALOGUE:[]),...CONVERSATIONS.flatMap(c=>c.lines||[])];
  const found=lines.find(line=>line.es===q.en||line.es===q.tts||line.es===q.es);
  return found?found.en:(q.en||"");
}
function nQ(){
  an=false;document.getElementById("quiz-next").style.display="none";document.getElementById("quiz-fb").textContent="";document.getElementById("quiz-reveal").innerHTML="";
  const base=quizPool();if(!base.length){document.getElementById("qc-word").textContent="—";return;}
  /* 35% of the time, re-serve a question you previously missed */
  const missedPool=base.filter(q=>qStore.missed&&qStore.missed[q.es+"|"+q.answer]);
  let pickFrom;
  if(repasoLeft>0&&missedPool.length){pickFrom=missedPool;repasoLeft--;}
  else{if(repasoLeft>0)repasoLeft=0;pickFrom=(missedPool.length&&Math.random()<0.35)?missedPool:base;}
  cQ=pickFrom[Math.floor(Math.random()*pickFrom.length)];
  /* Listening questions must not show the Spanish text — hide it and auto-play */
  document.getElementById("qc-word").textContent=qMode==="listening"||cQ.kind==="listening"?"🎧":cQ.prompt;
  document.querySelector(".qc-label").textContent=qMode==="en-es"?"Translate to Spanish":qMode==="listening"?"Listen and recognize":qMode==="blank"?"Complete the sentence":qMode==="conversation"?"Choose the correct reply":qMode==="es-en"?"Translate to English":cQ.kind==="reply"?"Choose the correct reply":cQ.kind==="listening"?"Listen and recognize":cQ.kind==="tense"?"Which tense is it?":cQ.kind==="blank"?"Complete the sentence":"Choose the correct answer";
  if(qMode==="listening"||cQ.kind==="listening")setTimeout(()=>speak(cQ.tts,0.7),350);
  const seen=new Set([cQ.answer]);const wrong=[];
  const wrongPool=cQ.choices?cQ.choices.map(answer=>({answer})):base.slice().sort(()=>Math.random()-0.5);
  for(const w of wrongPool){if(wrong.length>=3)break;if(!w.answer||seen.has(w.answer))continue;seen.add(w.answer);wrong.push({answer:w.answer});}
  const opts=[cQ,...wrong].sort(()=>Math.random()-0.5);
  const ow=document.getElementById("quiz-opts");ow.innerHTML="";
  opts.forEach(opt=>{const b=document.createElement("button");b.className="qopt";b.textContent=opt.answer;
    b.onclick=()=>{if(an)return;an=true;qT++;document.getElementById("q-total").textContent=qT;
      const fb=document.getElementById("quiz-fb");
      const mk=cQ.es+"|"+cQ.answer;
      if(opt.answer===cQ.answer){b.classList.add("correct");qC++;qS++;document.getElementById("q-correct").textContent=qC;document.getElementById("q-streak").textContent="🔥 "+qS;fb.textContent="✅ ¡Correcto!";fb.style.color="var(--teal)";speak(cQ.tts,0.75);
        if(qStore.missed[mk]){qStore.missed[mk]--;if(qStore.missed[mk]<=0)delete qStore.missed[mk];}}
      else{b.classList.add("wrong");qS=0;document.getElementById("q-streak").textContent="🔥 0";fb.textContent="❌ Incorrecto";fb.style.color="var(--pink)";document.querySelectorAll(".qopt").forEach(x=>{if(x.textContent===cQ.answer)x.classList.add("reveal");});
        qStore.missed[mk]=(qStore.missed[mk]||0)+2;}
      document.getElementById("quiz-reveal").innerHTML=`<div>🇪🇸 <strong>${spanishAnswer(cQ)}</strong></div><div>🇬🇧 ${englishAnswer(cQ)}</div>`;
      attachMic(document.getElementById("quiz-reveal"),spanishAnswer(cQ));
      qStore.c=qC;qStore.t=qT;qStore.s=qS;saveQ();
      document.getElementById("quiz-next").style.display="block";};ow.appendChild(b);});
}
function quizHear(){
  if(!cQ)return;
  if(an){speak(spanishAnswer(cQ),0.7);return;} /* after answering: hear the Spanish answer */
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
  PG.forEach(p=>{document.getElementById("page-"+p).classList.toggle("active",p===id);document.getElementById("tb-"+p).classList.toggle("active",p===id);});
  document.querySelector(".scroll").scrollTop=0;
  if(id!=="vocab")hideVerbDetail();
  if(id==="vocab")showVocabHome();
}
 


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
    CONVERSATIONS.forEach(c=>c.lines.forEach(L=>{if(!L.tts)issues.push('Conversation "'+c.title+'" ('+c.tense+'): line missing tts');}));
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
