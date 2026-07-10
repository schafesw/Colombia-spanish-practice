// Spanish learning app behavior
// ── Voice ─────────────────────────────────────────────────────────────────────
let voices=[],selV=null;
function getSpanishVoices(){
  voices=window.speechSynthesis.getVoices();
  return voices.filter(v=>/^es(?:-|_)/i.test(v.lang));
}
function chooseSpanishVoice(sp){
  const kept=selV&&sp.find(v=>v.name===selV.name&&v.lang===selV.lang);
  if(kept)return kept;
  for(const p of["es-CO","es-419","es-MX","es-US","es-AR"]){
    const v=sp.find(x=>x.lang.toUpperCase().startsWith(p));
    if(v)return v;
  }
  return sp[0]||null;
}
function loadV(){
  const sp=getSpanishVoices();
  const next=chooseSpanishVoice(sp);
  if(next)selV=next;
  buildVB(sp);
}
function buildVB(sp=getSpanishVoices()){
  if(!sp.length)return;
  document.getElementById("voice-bar-letras").innerHTML=`<div class="voice-bar"><span class="voice-label">🎙️ Voz</span><select class="voice-select" onchange="chV(this.value)">${sp.map((v,i)=>`<option value="${i}" ${selV&&v.name===selV.name&&v.lang===selV.lang?"selected":""}>${v.lang} · ${v.name.replace("com.apple.","").replace("voice.","")}</option>`).join("")}</select><button class="voice-test" onclick="speak('Hola, buenos días Colombia',0.8)">Probar</button></div>`;
}
function chV(i){const sp=getSpanishVoices();selV=sp[i]||null;}
function speak(t,r){
  if(!window.speechSynthesis)return;
  const sp=getSpanishVoices();
  const live=selV&&sp.find(v=>v.name===selV.name&&v.lang===selV.lang);
  const voice=live||chooseSpanishVoice(sp);
  if(voice)selV=voice;
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
let aC="vocales";const cw=document.getElementById("cat-wrap");
const vocabJump=document.getElementById("vocab-jump");
const vocabPosition=document.getElementById("vocab-position");
const vocabPrev=document.getElementById("vocab-prev");
const vocabNext=document.getElementById("vocab-next");
VC.forEach(cat=>{const p=document.createElement("button");p.className="cat-pill"+(cat.id===aC?" active":"");p.textContent=cat.label;p.onclick=()=>sCat(cat.id);cw.appendChild(p);});
vocabJump.innerHTML=VC.map(cat=>`<option value="${cat.id}">${cat.label}</option>`).join("");
vocabJump.onchange=()=>sCat(vocabJump.value);
vocabPrev.onclick=()=>{const i=VC.findIndex(c=>c.id===aC);if(i>0)sCat(VC[i-1].id);};
vocabNext.onclick=()=>{const i=VC.findIndex(c=>c.id===aC);if(i<VC.length-1)sCat(VC[i+1].id);};
function updateVocabNav(){
  const i=VC.findIndex(c=>c.id===aC);
  vocabJump.value=aC;
  vocabPosition.textContent=`${i+1} de ${VC.length}`;
  vocabPrev.disabled=i<=0;vocabNext.disabled=i>=VC.length-1;
}
function sCat(id){document.querySelectorAll(".cat-pill").forEach((p,i)=>p.classList.toggle("active",VC[i].id===id));aC=id;updateVocabNav();hideVerbDetail();rV();}
function rV(){
  const cat=VC.find(c=>c.id===aC);const list=document.getElementById("vocab-list");list.innerHTML="";
  if(cat.type==="vocales"){rVocales(list);return;}
  if(cat.type==="numeros"){rN(list);return;}
  if(cat.type==="preguntas"){rP(list);return;}
  if(cat.type==="verbos"){rVerbos(list);return;}
  if(cat.type==="colombianismos"){rCol(list);return;}
  cat.items.forEach(item=>{const card=document.createElement("div");card.className="vc";
    card.innerHTML=`<div class="vc-icon" style="background:${item.color}22;color:${item.color}">${item.icon}</div>
      <div class="vc-info"><div class="vc-word">${item.word}</div><div class="vc-en">${item.en}</div><div class="vc-ph">${item.ph}</div></div>
      <span class="vc-spk">🔊</span>`;card.onclick=()=>speak(item.tts,0.75);list.appendChild(card);});
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
rV();updateVocabNav();

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
function renderFraseMenu(){
  fl.dataset.view="menu";
  fl.innerHTML="";
  /* Sticky jump navigation — pick a section without scrolling */
  const jump=document.createElement("div");
  jump.className="frase-jump";
  const sel=document.createElement("select");
  sel.className="voice-select frase-jump-select";
  const jumpTargets=[["frs-dialogos","🗣️ Diálogos y conversaciones"],["frs-titulos","Títulos · Sr. / Sra."],
    ...FRASES.filter(s=>s.section).map((s,i)=>["frs-sec-"+i,s.section])];
  sel.innerHTML=`<option value="">🧭 Ir a sección…</option>`+jumpTargets.map(([id,label])=>`<option value="${id}">${label}</option>`).join("");
  sel.onchange=()=>{
    const el=document.getElementById(sel.value);
    if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
    sel.value="";
  };
  jump.appendChild(sel);
  fl.appendChild(jump);
  const note=document.createElement("div");
  note.className="phrase-index-note";
  note.id="frs-dialogos";
  note.innerHTML=`<div class="phrase-index-title">Elige una situación</div><div class="phrase-index-text">Toca una frase para abrir un diálogo corto. Puedes practicar las dos personas: A y B.</div>`;
  fl.appendChild(note);
  const menu=document.createElement("div");
  menu.className="phrase-menu";
  PHRASE_DIALOGUES.forEach(dialogue=>{
    const card=document.createElement("button");
    card.type="button";
    card.className="phrase-topic-card";
    card.innerHTML=`<div class="phrase-topic-copy"><div class="phrase-topic-title">${dialogue.title}</div><div class="phrase-topic-preview">${dialogue.preview}</div><div class="phrase-topic-en">${dialogue.en}</div></div><span class="phrase-topic-arrow">›</span>`;
    card.onclick=()=>renderFraseDialogue(dialogue);
    menu.appendChild(card);
  });
  fl.appendChild(menu);
  renderFraseSections();
}
/* Classic phrase lists (Saludos, Compras, Restaurante, Gustos, etc.) below the dialogue menu */
function renderFraseSections(){
  const td=document.createElement("div");td.className="frase-section";td.id="frs-titulos";
  const ttlEl=document.createElement("div");ttlEl.className="frase-title";
  ttlEl.style.cssText="color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)";
  ttlEl.textContent="Títulos · Titles";td.appendChild(ttlEl);
  const tg=document.createElement("div");tg.className="titles-grid";
  [{abbr:"Sr.",full:"Señor",en:"Mr."},{abbr:"Sra.",full:"Señora",en:"Mrs. / Ms."}].forEach(t=>{
    const tc=document.createElement("div");tc.className="title-card";
    tc.innerHTML=`<div class="title-abbr">${t.abbr}</div><div class="title-full">${t.full}</div><div class="title-en">${t.en}</div>`;
    tc.onclick=()=>speak(t.full,0.75);tg.appendChild(tc);});
  td.appendChild(tg);fl.appendChild(td);
  FRASES.filter(s=>s.section).forEach((sec,i)=>{const wrap=document.createElement("div");wrap.className="frase-section";wrap.id="frs-sec-"+i;
    const st=document.createElement("div");st.className="frase-title";st.style.cssText=sec.cls;st.textContent=sec.section;wrap.appendChild(st);
    sec.items.forEach(item=>{const card=document.createElement("div");card.className="frase-card";
      card.innerHTML=`<div class="frase-txt"><div class="f-es">${item.es}</div><div class="f-en">${item.en}</div></div><span class="f-spk">🔊</span>`;
      card.onclick=()=>speak(item.es,0.75);wrap.appendChild(card);});fl.appendChild(wrap);});
}
function renderFraseDialogue(dialogue){
  fl.dataset.view="dialogue";
  fl.innerHTML="";
  const back=document.createElement("button");
  back.type="button";
  back.className="phrase-back";
  back.innerHTML="<span>‹</span><span>Volver a frases</span>";
  back.onclick=renderFraseMenu;
  fl.appendChild(back);
  const roles=document.createElement("div");
  roles.className="phrase-role-controls";
  roles.innerHTML=`<div class="phrase-role-label">Practica tu papel</div><div class="phrase-role-buttons"><button type="button" data-role="both" class="active">Ambos</button><button type="button" data-role="A">Yo soy A</button><button type="button" data-role="B">Yo soy B</button></div>`;
  fl.appendChild(roles);
  const box=document.createElement("div");
  box.className="dialogue phrase-dialogue";
  let activeRole="both";
  function paintDialogue(){
    box.innerHTML=`<div class="dlg-title">${dialogue.title} · Toca cada línea para escuchar</div>`;
    dialogue.versions.forEach(version=>{
      if(version.tense&&TENSE_BADGE[version.tense]){
        const badge=document.createElement("div");
        badge.className="conv-tense-badge";
        badge.style.cssText=TENSE_BADGE[version.tense].css;
        badge.textContent=TENSE_BADGE[version.tense].txt;
        box.appendChild(badge);
      }
      version.lines.forEach(line=>{
        const row=document.createElement("div");
        const hidden=activeRole!=="both"&&activeRole===line.who;
        row.className="dlg-line"+(line.who==="B"?" right":"")+(hidden?" role-hidden":"");
        row.innerHTML=`<div class="dlg-avatar" style="background:${line.who==="A"?"rgba(74,168,160,0.2)":"rgba(167,139,250,0.2)"}">${line.who}</div><div class="dlg-bubble"><div class="dlg-es">${line.es}</div><div class="dlg-en">${line.en}</div></div>`;
        row.querySelector(".dlg-bubble").onclick=()=>{if(row.classList.contains("role-hidden")){row.classList.remove("role-hidden");}else{speak(line.tts,0.75);}};
        box.appendChild(row);
      });
    });
  }
  roles.querySelectorAll("[data-role]").forEach(button=>button.onclick=()=>{activeRole=button.dataset.role;roles.querySelectorAll("[data-role]").forEach(x=>x.classList.toggle("active",x===button));paintDialogue();});
  paintDialogue();
  fl.appendChild(box);
  const tip=document.createElement("div");
  tip.className="phrase-practice-note";
  tip.textContent="En Yo soy A/B, la línea de tu papel está borrosa. Dila primero y tócala para revelar y escuchar.";
  fl.appendChild(tip);
}
renderFraseMenu();

// ── Build Lecciones ──────────────────────────────────────────────────────────
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
function renderLessons(){
  const root=document.getElementById("lesson-list");if(!root)return;root.innerHTML="";
  const done=LESSONS.filter(x=>lessonProgress[x.id]).length;
  const intro=document.createElement("div");intro.className="lesson-intro";
  intro.innerHTML=`<div class="lesson-intro-title">${done} de ${LESSONS.length} completadas</div><div class="lesson-progress"><span style="width:${Math.round(done/LESSONS.length*100)}%"></span></div><div class="lesson-intro-text">Cada lección combina palabras, conversación y práctica oral. Avanza a tu ritmo.</div>`;
  root.appendChild(intro);
  LESSONS.forEach((lesson,i)=>{
    const card=document.createElement("article");card.className="lesson-card"+(lessonProgress[lesson.id]?" complete":"");
    card.innerHTML=`<div class="lesson-card-top"><div class="lesson-number">${i+1}</div><div class="lesson-icon">${lesson.icon}</div><div class="lesson-copy"><div class="lesson-title">${lesson.title}</div><div class="lesson-sub">${lesson.sub}</div></div><button type="button" class="lesson-check" aria-label="Marcar lección completa">${lessonProgress[lesson.id]?"✓":"○"}</button></div><div class="lesson-actions"><button type="button" data-action="learn">Aprende</button><button type="button" data-action="speak">Habla</button><button type="button" data-action="quiz">Quiz</button></div>`;
    card.querySelector("[data-action=learn]").onclick=()=>{showPage("vocab");sCat(lesson.vocab);};
    card.querySelector("[data-action=speak]").onclick=()=>{showPage("frases");const d=PHRASE_DIALOGUES.find(x=>x.title===lesson.dialogue);if(d)renderFraseDialogue(d);};
    card.querySelector("[data-action=quiz]").onclick=()=>{showPage("quiz");qCat=lesson.quizCat;qMode=lesson.quizMode||"mixed";syncQuizControls();nQ();};
    card.querySelector(".lesson-check").onclick=()=>{lessonProgress[lesson.id]=!lessonProgress[lesson.id];saveLessons();renderLessons();};
    root.appendChild(card);
  });
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
  data.tables.forEach(table=>{
    const ct=document.createElement("div");ct.className="conj-table";
    ct.innerHTML=`<div class="conj-hdr"><div class="conj-hdr-title">${table.title}</div><div class="conj-hdr-sub">${table.sub}</div></div>`;
    table.rows.forEach(row=>{
      const r=document.createElement("div");r.className="conj-row";
      r.innerHTML=`<span class="conj-pronoun">${row.pro}</span><span class="conj-verb">${row.verb}</span><span class="conj-en">${row.en}</span><span class="conj-spk">🔊</span>`;
      r.onclick=()=>speak(row.tts,0.75);ct.appendChild(r);});sec.appendChild(ct);});
  const exLabel=document.createElement("div");exLabel.style.cssText="font-size:0.56rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;font-weight:800;";exLabel.textContent="Ejemplos";sec.appendChild(exLabel);
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
  const exLabel=document.createElement("div");exLabel.style.cssText="font-size:0.56rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;font-weight:800;";exLabel.textContent="Ejemplos";sec.appendChild(exLabel);
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

function showGram(id){
  ["presente","pasado","futuro","pronombres","reflexivos","trucos"].forEach(g=>{
    document.getElementById("gs-"+g).classList.toggle("active",g===id);
    document.getElementById("gt-"+g).classList.toggle("active",g===id);
  });
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

const QC=[{id:"all",label:"Todo"},{id:"frases",label:"Frases"},{id:"vocales",label:"Vocales"},{id:"numeros",label:"Números"},{id:"meses",label:"Meses"},{id:"colores",label:"Colores"},{id:"dias",label:"Días"},{id:"familia",label:"Familia"},{id:"verbos",label:"Verbos"},{id:"cuerpo",label:"Cuerpo"},{id:"comida",label:"Comida"},{id:"lugares",label:"Lugares"},{id:"tiempo",label:"Tiempo"},{id:"adjetivos",label:"Adjetivos"},{id:"profesiones",label:"Profesiones"},{id:"casa",label:"Casa"},{id:"habitacion",label:"Habitación"},{id:"bano",label:"Baño"},{id:"trabajo",label:"Trabajo"},{id:"oficina",label:"Oficina"},{id:"carropartes",label:"Partes del carro"},{id:"direcciones",label:"Direcciones"},{id:"cocina",label:"Cocina"},{id:"gustos",label:"Gustos"},{id:"tv",label:"TV"},{id:"ropa",label:"Ropa"},{id:"animales",label:"Animales"},{id:"clima",label:"Clima"},{id:"tecnologia",label:"Tecnología"},{id:"emociones",label:"Emociones"},{id:"colombianismos",label:"Colombia"}];
const QUIZ_MODES=[
  {id:"mixed",label:"Mixto"},{id:"es-en",label:"ES → EN"},{id:"en-es",label:"EN → ES"},
  {id:"listening",label:"🎧 Escuchar"},{id:"blank",label:"✏️ Completar"},{id:"conversation",label:"💬 Conversación"}
];

/* ── Persistent score + missed-question tracking (NEW v13) ──────────────────
   Saved in localStorage. Wrong answers get asked again more often. */
const QS_KEY="esco-quiz-v1";
let qStore={c:0,t:0,s:0,missed:{}};
try{const raw=localStorage.getItem(QS_KEY);if(raw)qStore=Object.assign(qStore,JSON.parse(raw));}catch(e){}
function saveQ(){try{localStorage.setItem(QS_KEY,JSON.stringify(qStore));}catch(e){}}
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
  return qCat==="all"?pool:pool.filter(q=>q.cat===qCat);
}
function spanishAnswer(q){
  if(qMode==="en-es")return q.es;
  if(q.kind==="reply"||q.kind==="tense")return q.en;
  if(q.kind==="blank")return q.tts;
  return q.es||q.tts;
}
function englishAnswer(q){
  if(q.kind==="blank")return BLANK_EN[q.tts]||"";
  const lines=[...(typeof DIALOGUE!=="undefined"?DIALOGUE:[]),...CONVERSATIONS.flatMap(c=>c.lines||[])];
  const found=lines.find(line=>line.es===q.en||line.es===q.tts||line.es===q.es);
  return found?found.en:(q.en||"");
}
function nQ(){
  an=false;document.getElementById("quiz-next").style.display="none";document.getElementById("quiz-fb").textContent="";document.getElementById("quiz-reveal").innerHTML="";
  const base=quizPool();if(!base.length){document.getElementById("qc-word").textContent="—";return;}
  /* 35% of the time, re-serve a question you previously missed */
  const missedPool=base.filter(q=>qStore.missed&&qStore.missed[q.es+"|"+q.answer]);
  const pickFrom=(missedPool.length&&Math.random()<0.35)?missedPool:base;
  cQ=pickFrom[Math.floor(Math.random()*pickFrom.length)];
  /* Listening questions must not show the Spanish text — hide it and auto-play */
  document.getElementById("qc-word").textContent=qMode==="listening"||cQ.kind==="listening"?"🎧":cQ.prompt;
  document.querySelector(".qc-label").textContent=qMode==="en-es"?"Traduce al español":qMode==="listening"?"Escucha y reconoce":qMode==="blank"?"Completa la frase":qMode==="conversation"?"Escoge la respuesta correcta":qMode==="es-en"?"Traduce al inglés":cQ.kind==="reply"?"Escoge la respuesta correcta":cQ.kind==="listening"?"Escucha y reconoce":cQ.kind==="tense"?"Reconoce el tiempo":"Elige la respuesta correcta";
  if(qMode==="listening"||cQ.kind==="listening")setTimeout(()=>speak(cQ.tts,0.7),350);
  const wrong=cQ.choices?cQ.choices.filter(x=>x!==cQ.answer).sort(()=>Math.random()-0.5).slice(0,3).map(answer=>({answer})):base.filter(q=>q.answer!==cQ.answer).sort(()=>Math.random()-0.5).slice(0,3);
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
      qStore.c=qC;qStore.t=qT;qStore.s=qS;saveQ();
      document.getElementById("quiz-next").style.display="block";};ow.appendChild(b);});
}
function quizHear(){
  if(!cQ)return;
  /* For fill-in-the-blank, don't speak the answer word — pause at the blank instead */
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
}
 
