import {
  VL, CN, LI, VW, VS, SYL_TTS_FIX, X_EXAMPLES, RR_SOUND_EXAMPLES,
  PHONETIC_WARMUP, ENGLISH_INTERFERENCE, MINIMAL_PAIRS, SPANISH_THINKING_PROMPTS,
  SPECIAL_SOUNDS, TONGUE_TWISTERS, PRONUNCIATION_TIPS, speakSyl, gc,
} from "../../data/index.js";
import { appState } from "../state/app-state.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { markPractice, recordSrs } from "../core/stores.js";
import { openMicPanel } from "../core/speech-mic.js";
import { actions } from "./navigation.js";

// ── Build Letras ──────────────────────────────────────────────────────────────
// Grids initialized in initPhonetics()
let aL=null;
export function sel(l){
  if(aL){const p=document.getElementById("lc-"+aL);if(p)p.className="lc";}
  aL=l;const iv=VL.includes(l);document.getElementById("lc-"+l).className="lc "+(iv?"av":"ac");
  speak(LI[l].tts,0.7);actions.syncMouthLetter(l);const c=iv?"var(--pink)":"var(--teal)";const i=LI[l];
  document.getElementById("detail-card").innerHTML=`<div class="dc" style="border:1px solid ${iv?"rgba(232,93,117,0.25)":"rgba(74,168,160,0.25)"}">
    <div class="dc-big" style="color:${c}">${l}</div><div class="dc-sub">Se llama</div><div class="dc-name">"${i.name}"</div>
    <div class="dc-phon">[${i.phonetic}]</div><div class="dc-badge">${iv?"🔴 Vocal — el alma de cada sílaba":"🔵 Consonante — se combina con vocales"}</div><br/>
    <button class="spk-btn" style="background:${c}" onclick="speak('${i.tts}',0.65)">🔊 Escuchar otra vez</button></div>`;
}

// ── Build Sílabas ─────────────────────────────────────────────────────────────
const SYL_CONS=CN.flatMap(l=>l==="R"?[l,"RR"]:[l]);
let aF=null;
export function sF(l){document.getElementById(aF?"fb-"+aF:"fb-all").classList.remove("active");aF=l;document.getElementById(l?"fb-"+l:"fb-all").classList.add("active");rC();}
export function rC(){
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


export function renderPhoneticWarmup(){
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
export function renderEnglishInterference(){
  const root=document.getElementById("english-interference-list");
  if(!root||typeof ENGLISH_INTERFERENCE==="undefined")return;
  root.innerHTML="";
  ENGLISH_INTERFERENCE.forEach(item=>{
    const card=document.createElement("button");card.type="button";card.className="interference-card";card.title="Listen to the Spanish example";
    card.innerHTML=`<span class='interference-pattern'>${escapeVocabHtml(item.pattern)}</span><strong>${escapeVocabHtml(item.spanish)}</strong><small>${escapeVocabHtml(item.english)}</small><em>${escapeVocabHtml(item.example)} · ${escapeVocabHtml(item.en)}</em><span class='interference-speak'>🔊</span>`;
    card.onclick=()=>speak(item.tts,0.72);root.appendChild(card);
  });
}
export function renderMinimalPairs(){
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
export function renderSpanishThinking(){
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
export function openPhoneticSection(id){
  const target=document.getElementById(id);if(!target)return;
  if(target.tagName.toLowerCase()==="details")target.open=true;
  setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"start"}),20);
}
export function setupPhoneticLinks(){
  document.querySelectorAll(".phonetic-map-links a").forEach(link=>link.onclick=event=>{event.preventDefault();openPhoneticSection(link.getAttribute("href").slice(1));});
  const jump=document.getElementById("phonetic-jump");
  if(jump)jump.onchange=()=>{if(jump.value){openPhoneticSection(jump.value);jump.value="";}};
}


// ── Special spelling sounds (v35) ────────────────────────────────────────────
export function renderSpecialSounds(){
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



export function getDailyTwisterSelection(){
  const rr=TONGUE_TWISTERS.filter(x=>x.target==="RR");
  const ene=TONGUE_TWISTERS.filter(x=>x.target==="Ñ");
  const now=new Date();const day=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);
  return [rr[day%rr.length],ene[day%ene.length]].filter(Boolean);
}
export function renderTongueTwisters(){
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
const STRESS_ACCENT_PAIRS=[
  {a:"hablo",aEn:"I speak (present — HA-blo)",b:"habló",bEn:"he/she spoke (past — ha-BLÓ)",tip:"Final accent -ó shifts stress to the last syllable and turns it into past tense."},
  {a:"papa",aEn:"potato (PA-pa)",b:"papá",bEn:"dad (pa-PÁ)",tip:"Without tilde: potato / Pope. With -á: dad!"},
  {a:"esta",aEn:"this (feminine — ES-ta)",b:"está",bEn:"is / located (es-TÁ)",tip:"Stress on the end makes it the verb estar ('está aquí')."},
  {a:"canto",aEn:"I sing / song (CAN-to)",b:"cantó",bEn:"he/she sang (can-TÓ)",tip:"First-syllable stress = I sing; final stressed -ó = past event."},
  {a:"llegue",aEn:"arrive (subjunctive — LLE-gue)",b:"llegué",bEn:"I arrived (past — lle-GUÉ)",tip:"Final stressed -é marks 1st-person past ('ayer llegué tarde')."},
  {a:"paso",aEn:"I pass / step (PA-so)",b:"pasó",bEn:"it happened / passed (pa-SÓ)",tip:"'¿Qué pasó?' stresses the last syllable for past events."},
  {a:"tomo",aEn:"I take / drink (TO-mo)",b:"tomó",bEn:"he/she took / drank (to-MÓ)",tip:"Tilde at the end marks preterite he/she/usted."},
  {a:"compro",aEn:"I buy (COM-pro)",b:"compró",bEn:"he/she bought (com-PRÓ)",tip:"Stressing -ó tells the listener the purchase already happened."},
  {a:"camino",aEn:"road / I walk (ca-MI-no)",b:"caminó",bEn:"he/she walked (ca-mi-NÓ)",tip:"Middle stress = path / I walk; end stress = walked."},
  {a:"trabajó",aEn:"he/she worked (tra-ba-JÓ)",b:"trabajo",aAlt:true,bEn:"work / I work (tra-BA-jo)",tip:"End stress = worked; middle stress = job / I work."}
];
export function renderPhoneticEarQuiz(){
  const root=document.getElementById("phonetic-ear-quiz");
  if(!root||typeof MINIMAL_PAIRS==="undefined"||!MINIMAL_PAIRS.length)return;
  const makeBank=(list)=>list.flatMap(pair=>{
    const out=[];
    if(pair.a&&pair.b){
      out.push({word:pair.a,other:pair.b,en:pair.aEn,otherEn:pair.bEn,tip:pair.tip,pairLabel:`${pair.a} vs. ${pair.b}`});
      out.push({word:pair.b,other:pair.a,en:pair.bEn,otherEn:pair.aEn,tip:pair.tip,pairLabel:`${pair.a} vs. ${pair.b}`});
    }
    return out;
  });
  let earMode="pairs";
  let qi=0,score=0,total=0,answered=false;
  const draw=()=>{
    const bank=earMode==="stress"?makeBank(STRESS_ACCENT_PAIRS):makeBank(MINIMAL_PAIRS);
    const q=bank[qi%bank.length];
    const opts=[{w:q.word,en:q.en},{w:q.other,en:q.otherEn}].sort(()=>Math.random()-0.5);
    answered=false;
    root.innerHTML=`<section class="phonetic-ear-card">
      <div class="vf-mode-bar" style="margin-bottom:10px">
        <button type="button" class="vf-mode-btn${earMode==="pairs"?" active":""}" data-ear="pairs">👂 Minimal Pairs</button>
        <button type="button" class="vf-mode-btn${earMode==="stress"?" active":""}" data-ear="stress">🎯 Stress &amp; Accents</button>
      </div>
      <div class="bridge-kicker">👂 SOUND CATCHER · EAR TRAINING (${score}/${total})</div>
      <div class="bridge-context">Listen carefully, then pick which Spanish word was spoken: <strong>${escapeVocabHtml(q.pairLabel)}</strong></div>
      <div class="phonetic-ear-controls"><button type="button" class="lp-nav-btn primary phonetic-ear-play">🔊 Play sound</button><button type="button" class="lp-nav-btn phonetic-ear-slow">🐢 Slow</button></div>
      <div class="phonetic-ear-opts"></div>
      <div class="bridge-feedback" aria-live="polite"></div>
      <div class="bridge-actions"></div>
    </section>`;
    root.querySelectorAll("[data-ear]").forEach(mb=>{
      mb.onclick=()=>{earMode=mb.dataset.ear;qi=0;score=0;total=0;draw();};
    });
    root.querySelector(".phonetic-ear-play").onclick=()=>speak(q.word,0.72);
    root.querySelector(".phonetic-ear-slow").onclick=()=>speak(q.word,0.52);
    const oWrap=root.querySelector(".phonetic-ear-opts"),fb=root.querySelector(".bridge-feedback"),acts=root.querySelector(".bridge-actions");
    opts.forEach(o=>{
      const b=document.createElement("button");b.type="button";b.className="lp-opt";
      b.innerHTML=`<strong>${escapeVocabHtml(o.w)}</strong><small>${escapeVocabHtml(o.en||"")}</small>`;
      b.onclick=()=>{
        if(answered)return;answered=true;total++;
        const ok=o.w===q.word;
        if(ok){score++;b.classList.add("correct");}
        else{b.classList.add("wrong");oWrap.querySelectorAll(".lp-opt").forEach(x=>{if(x.querySelector("strong")?.textContent===q.word)x.classList.add("reveal");});}
        markPractice("phrases",q.word);
        recordSrs("phon|"+q.word,ok);
        speak(q.word,0.7);
        fb.textContent=(ok?"✅ ¡Oído fino! ":"❌ Look closely: ")+`${q.word} (${q.en}) — ${q.tip}`;
        const nxt=document.createElement("button");nxt.type="button";nxt.className="lp-nav-btn primary";nxt.textContent="Next sound →";
        nxt.onclick=()=>{qi=(qi+1)%bank.length;draw();};
        acts.appendChild(nxt);
      };
      oWrap.appendChild(b);
    });
  };
  draw();
}
export function showPhonetic(id){
  document.querySelectorAll(".phonetic-panel").forEach(x=>x.classList.toggle("active",x.id==="phonetic-"+id));
  document.querySelectorAll(".phonetic-tab").forEach(x=>x.classList.toggle("active",x.id==="pt-"+id));
}
export function initPhonetics() {
  const vg = document.getElementById("vowel-grid");
  if (vg && !vg.children.length) {
    VL.forEach(l => { const b = document.createElement("button"); b.className = "lc"; b.id = "lc-" + l; b.textContent = l; b.onclick = () => sel(l); vg.appendChild(b); });
  }
  const cgEl = document.getElementById("cons-grid");
  if (cgEl && !cgEl.children.length) {
    CN.forEach(l => { const b = document.createElement("button"); b.className = "lc"; b.id = "lc-" + l; b.textContent = l; b.onclick = () => sel(l); cgEl.appendChild(b); });
  }
  const fw = document.getElementById("filter-wrap");
  if (fw && !fw.children.length) {
    const fab = document.createElement("button"); fab.className = "fb active"; fab.id = "fb-all"; fab.textContent = "Todas"; fab.onclick = () => sF(null); fw.appendChild(fab);
    SYL_CONS.forEach(l => { const b = document.createElement("button"); b.className = "fb"; b.id = "fb-" + l; b.textContent = l; b.onclick = () => sF(l); fw.appendChild(b); });
  }
  rC();
  renderPhoneticWarmup();
  renderEnglishInterference();
  renderMinimalPairs();
  renderSpanishThinking();
  setupPhoneticLinks();
  renderSpecialSounds();
  renderTongueTwisters();
  renderPhoneticEarQuiz();
}
