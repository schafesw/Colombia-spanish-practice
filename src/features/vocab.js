import {
  VC, VOCAB_EXAMPLES, VOCALES_DATA, N130, NT, VERBS, PQ, COLOMBIANISMOS,
  FRASES, REGIONAL_ATLAS, STREET_EAR_LINKER, TRAMPAS_COLOMBIANAS, VERBOS_COMODIN,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, lpEl } from "../core/text-utils.js";
import { markPractice, practiced, practicedCount, vocabKeys, refreshVocabProgress, setVocabRefreshHook, attachStarBtn } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";
import { LESSONS } from "./lessons-meta.js";
import { actions, showPage, ensurePageInitialized } from "./navigation.js";

export const VOCAB_CATS=VC.filter(cat=>cat.id!=="vocales");
const VOCAB_LAST_KEY="esco-vocab-last-v1";
let vocabHome=null;
let vocabHomeJump=null;
let vocabJumpHome=null;
let vocabCategoryView=null;
let vocabHomeBack=null;
let cw=null;
let vocabJump=null;
let vocabPosition=null;
let vocabPrev=null;
let vocabNext=null;
let vocabSearch=null;
let vocabSearchView=null;
let aC="gustos";

if(!VOCAB_CATS.some(cat=>cat.id===aC))aC=VOCAB_CATS.some(cat=>cat.id==="gustos")?"gustos":(VOCAB_CATS[0]?.id||"");
export const VOCAB_GROUPS=[
  {title:"Start with everyday speech",sub:"Useful words for talking about yourself",ids:["gustos","familia","verbos","acciones","tiempo","emociones","colombianismos"]},
  {title:"Daily life",sub:"Home, food, clothing, and things around you",ids:["comida","casa","habitacion","bano","cocina","ropa","cuerpo"]},
  {title:"Getting things done",sub:"Work, travel, directions, and technology",ids:["numeros","direcciones","lugares","trabajo","oficina","carropartes","tecnologia","tv"]},
  {title:"Describe the world",sub:"People, places, weather, and details",ids:["colores","adjetivos","meses","dias","profesiones","animales","clima","preguntas"]}
];
// Vocab DOM event wiring moved to initVocab()
export function vocabCount(cat){
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
export function renderVocabHome(){
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
  phon.onclick=()=>{showPage("fonetica");actions.showPhonetic("letters");};vocabHome.appendChild(phon);
  if(typeof actions.mountPictureMatchEntry==="function")actions.mountPictureMatchEntry(vocabHome);
  VOCAB_GROUPS.forEach(group=>{
    const section=document.createElement("section");section.className="vocab-home-group";
    section.innerHTML=`<div class="vocab-home-group-title">${group.title}</div><div class="vocab-home-group-sub">${group.sub}</div>`;
    const grid=document.createElement("div");grid.className="vocab-home-grid";
    group.ids.map(id=>VOCAB_CATS.find(cat=>cat.id===id)).filter(Boolean).forEach(cat=>grid.appendChild(vocabCard(cat)));
    section.appendChild(grid);vocabHome.appendChild(section);
  });
}
export function showVocabHome(){
  hideVerbDetail();
  if(vocabSearchView)vocabSearchView.hidden=true;
  vocabHomeJump.hidden=false;vocabHome.hidden=false;vocabCategoryView.hidden=true;renderVocabHome();
}
export function showVocabCategory(){if(vocabSearchView)vocabSearchView.hidden=true;vocabHomeJump.hidden=true;vocabHome.hidden=true;vocabCategoryView.hidden=false;}
export function updateVocabNav(){
  const i=VOCAB_CATS.findIndex(c=>c.id===aC);
  if(i<0)return;
  vocabJump.value=aC;if(vocabJumpHome)vocabJumpHome.value=aC;vocabPosition.textContent=`${i+1} of ${VOCAB_CATS.length}`;
  vocabPrev.disabled=i<=0;vocabNext.disabled=i>=VOCAB_CATS.length-1;
}
export function sCat(id){
  if(id==="vocales"){showPage("fonetica");actions.showPhonetic("letters");return;}
  if(!VOCAB_CATS.some(cat=>cat.id===id))return;
  document.querySelectorAll(".cat-pill").forEach((p,i)=>p.classList.toggle("active",VOCAB_CATS[i].id===id));
  aC=id;try{appStorage.setItem(VOCAB_LAST_KEY,aC);}catch(e){}
  showVocabCategory();updateVocabNav();hideVerbDetail();rV();document.querySelector(".scroll").scrollTop=0;
}
export function renderVocabSearch(term){
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

export function addEnglishHint(parent,text,label="💡 English help"){
  if(!parent||!text)return;
  const wrap=document.createElement("div");wrap.className="english-hint";
  const button=document.createElement("button");button.type="button";button.className="english-hint-btn";button.textContent=label;button.setAttribute("aria-expanded","false");
  const copy=document.createElement("span");copy.className="english-hint-text";copy.hidden=true;copy.textContent=text;
  button.onclick=e=>{e.stopPropagation();const open=copy.hidden;copy.hidden=!open;button.setAttribute("aria-expanded",String(open));button.textContent=open?"✅ English shown":label;};
  wrap.append(button,copy);parent.appendChild(wrap);
}
export function getVocabExample(item,catId,index){
  const raw=item.example||(VOCAB_EXAMPLES[catId]||[])[index];
  if(Array.isArray(raw))return {es:raw[0],en:raw[1],tts:raw[0]};
  if(raw)return {es:raw.es||item.word,en:raw.en||item.en,tts:raw.tts||raw.es||item.tts};
  return {es:item.word,en:item.en,tts:item.tts||item.word};
}
export function addVocabExample(card,item,catId,index){
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
let vocabFlashMode=false,vocabFlashIdx=0,vocabFlashFlipped=false;
function getVocabFlashItems(cat){
  if(!cat)return[];
  if(cat.type==="basic")return(cat.items||[]).map(it=>({es:it.word,en:it.en,ph:it.ph||"",tts:it.tts||it.word}));
  if(cat.type==="colombianismos")return COLOMBIANISMOS.map(it=>({es:it.word,en:it.en,ph:it.register||it.usage||"",tts:it.tts||it.word}));
  if(cat.type==="preguntas")return PREGUNTAS.map(it=>({es:it.word,en:it.en,ph:it.ph||"",tts:it.tts||it.word}));
  if(cat.type==="verbos")return Object.entries(VERBS).map(([w,v])=>({es:w,en:v.en,ph:v.type||"",tts:w}));
  return[];
}
export function rV(){
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

export function rVocales(list){
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
export function rVerbos(list){
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
export function rCol(list){
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

export function rN(list){
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
export function rP(list){
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


// ── Verb Detail View ──────────────────────────────────────────────────────────
export function showVerbDetail(key,verb){
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
export function hideVerbDetail(){
  document.getElementById("vocab-list").style.display="";
  const vd=document.getElementById("verb-detail");vd.classList.remove("active");vd.innerHTML="";
}


 // ── Build Frases ──────────────────────────────────────────────────────────────
export function getActiveVocabCat(){ return aC; }
export function getVocabHomeEl(){ return vocabHome || document.getElementById("vocab-home"); }
export function initVocab() {
  vocabHome = document.getElementById("vocab-home");
  vocabHomeJump = document.getElementById("vocab-home-jump");
  vocabJumpHome = document.getElementById("vocab-jump-home");
  vocabCategoryView = document.getElementById("vocab-category-view");
  vocabHomeBack = document.getElementById("vocab-home-back");
  cw = document.getElementById("cat-wrap");
  vocabJump = document.getElementById("vocab-jump");
  vocabPosition = document.getElementById("vocab-position");
  vocabPrev = document.getElementById("vocab-prev");
  vocabNext = document.getElementById("vocab-next");
  vocabSearch = document.getElementById("vocab-search");
  vocabSearchView = document.getElementById("vocab-search-view");
  try { aC = appStorage.getItem(VOCAB_LAST_KEY) || aC; } catch(e) {}
  if (!VOCAB_CATS.some(cat => cat.id === aC)) aC = VOCAB_CATS.some(cat => cat.id === "gustos") ? "gustos" : (VOCAB_CATS[0] ? VOCAB_CATS[0].id : "");
  setVocabRefreshHook(() => {
    const cat = VOCAB_CATS.find(c => c.id === aC), keys = vocabKeys(cat);
    const strong = document.querySelector("#vocab-progress strong");
    if (!cat || !keys.length || !strong) return;
    strong.textContent = `${practicedCount("vocab", keys)} of ${keys.length} practiced`;
  });
  if (cw && !cw.children.length) {
    VOCAB_CATS.forEach(cat=>{const p=document.createElement("button");p.className="cat-pill";p.textContent=cat.label;p.onclick=()=>sCat(cat.id);cw.appendChild(p);});
    vocabJump.innerHTML=VOCAB_CATS.map(cat=>`<option value="${cat.id}">${cat.label}</option>`).join("");
    vocabJumpHome.innerHTML=`<option value="">Choose a category…</option>`+VOCAB_CATS.map(cat=>`<option value="${cat.id}">${cat.label}</option>`).join("");
    vocabJump.onchange=()=>sCat(vocabJump.value);
    vocabJumpHome.onchange=()=>{if(vocabJumpHome.value)sCat(vocabJumpHome.value);};
    vocabPrev.onclick=()=>{const i=VOCAB_CATS.findIndex(c=>c.id===aC);if(i>0)sCat(VOCAB_CATS[i-1].id);};
    vocabNext.onclick=()=>{const i=VOCAB_CATS.findIndex(c=>c.id===aC);if(i<VOCAB_CATS.length-1)sCat(VOCAB_CATS[i+1].id);};
    vocabHomeBack.onclick=()=>showVocabHome();
  }
  if (vocabSearch) vocabSearch.oninput = () => renderVocabSearch(vocabSearch.value);
  rV();
  updateVocabNav();
  showVocabHome();
}
