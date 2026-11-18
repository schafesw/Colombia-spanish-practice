import {
  PICTURE_MATCH_BANK, NATURAL_EAR_CLIPS, GRINGO_TRAPS,
  SPEAKING_GUIDE, PRONOMBRES, REFLEXIVOS, GRAMMAR,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { userPrefs, saveUserPrefs, effectiveLevel, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, normalizeDictation, normalizeQuizText, normalizeQuizPrompt, normalizeQuizAnswer, quizItemKey, applyQuizFitClasses } from "../core/text-utils.js";
import { qStore, saveQ, srsStore, srsDue, srsNextLabel, recordSrs, recordSpeakingError, clearSpeakingError, markPractice, resetQAndSrs, getStarredPhrases } from "../core/stores.js";
import { attachMic, openMicPanel } from "../core/speech-mic.js";
import { aQ, RR_BANK, BLANK_EN, CONVERSATION_QUIZ, FILL_BLANK_QUIZ, storedMissedQuestionCount, spanishAnswer, englishAnswer, quizAcceptedAnswers, quizAnswerMatches } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";
import { renderQuizV102Hub } from "./quiz-labs.js";

export const QC=[{id:"all",label:"All"},{id:"frases",label:"Frases"},{id:"cortesia",label:"🙏 Courtesy"},{id:"muletillas",label:"☕ Diminutives & Fillers"},{id:"reparar",label:"🧰 Repair"},{id:"conectores",label:"🔗 Connectors"},{id:"direcciones",label:"🧭 Directions"},{id:"aeropuerto",label:"🛬 Airport"},{id:"uber",label:"🚕 Uber"},{id:"uber-real",label:"🚕 Uber · full trip"},{id:"hotel",label:"🏨 Hotel"},{id:"bancos-pagos",label:"💳 Nequi & Pay"},{id:"restaurante",label:"🍽️ Restaurant"},{id:"restaurante-real",label:"🍽️ Restaurant · real"},{id:"compras",label:"🛒 Shopping"},{id:"mercado",label:"🛍️ Market"},{id:"farmacia",label:"💊 Pharmacy"},{id:"medico",label:"🩺 Medical"},{id:"barberia",label:"💈 Barbershop"},{id:"porteria",label:"🏢 Portería & Rappi"},{id:"panaderia",label:"🥐 Panadería & Jugos"},{id:"viajes-finca",label:"🌄 Buses & Finca"},{id:"empatia",label:"💛 Empathy & Reactions"},{id:"comodin",label:"🔑 Verbos Comodín"},{id:"whatsapp",label:"📱 WhatsApp & Citas"},{id:"arriendo",label:"🔑 Arriendo & Airbnb"},{id:"gym-ciclovia",label:"🚴 Gym & Ciclovía"},{id:"citas-familia",label:"❤️ Citas & Familia"},{id:"corrientazo",label:"🫓 Corrientazo & Onces"},{id:"cajero-sim",label:"🏦 Cajero & SIM Card"},{id:"puentes-rumba",label:"🎉 Puentes & Rumba"},{id:"sanjuan-guajira",label:"🪗 San Juan & Guajira"},{id:"seguridad-emergencias",label:"🚨 Seguridad & 123"},{id:"hogar-reparaciones",label:"🔧 Hogar & Técnico"},{id:"eventos-futbol",label:"⚽ Fútbol & Boletas"},{id:"trampas",label:"🪤 Trampas Colombianas"},{id:"estratos",label:"🏘️ Estratos & Conjuntos"},{id:"odontologia",label:"🦷 Odontología & Óptica"},{id:"migracion-ce",label:"🛂 Migración & Cédula"},{id:"expresiones",label:"🇨🇴 Expressions"},{id:"social",label:"🤝 Social"},{id:"fiesta",label:"🎉 Party"},{id:"deportes",label:"⚽ Sports"},{id:"oficina-real",label:"🧑‍💼 Office"},{id:"gerundios",label:"🔄 Actions in progress"},{id:"mandatos",label:"🗣️ Commands"},{id:"estructura",label:"🧱 Structure"},{id:"subjuntivo",label:"🌱 Subjuntivo"},{id:"pronunciacion",label:"🔊 Sounds"},{id:"groserias",label:"⚠️ Groserías"},{id:"pronombres",label:"Lo / La / Le"},{id:"vocales",label:"Vocales"},{id:"numeros",label:"Números"},{id:"meses",label:"Meses"},{id:"colores",label:"Colores"},{id:"dias",label:"Días"},{id:"familia",label:"Familia"},{id:"verbos",label:"Verbos"},{id:"acciones",label:"Acciones"},{id:"cuerpo",label:"Cuerpo"},{id:"comida",label:"Comida"},{id:"lugares",label:"Lugares"},{id:"tiempo",label:"Tiempo"},{id:"adjetivos",label:"Adjetivos"},{id:"profesiones",label:"Profesiones"},{id:"casa",label:"Casa"},{id:"habitacion",label:"Habitación"},{id:"bano",label:"Baño"},{id:"trabajo",label:"Trabajo"},{id:"oficina",label:"Oficina"},{id:"carropartes",label:"Partes del carro"},{id:"cocina",label:"Cocina"},{id:"gustos",label:"Gustos"},{id:"tv",label:"TV"},{id:"ropa",label:"Ropa"},{id:"animales",label:"Animals"},{id:"clima",label:"Clima"},{id:"tecnologia",label:"Tecnología"},{id:"emociones",label:"Emociones"},{id:"colombianismos",label:"Colombia"}];
export const QUIZ_MODES=[
  {id:"mixed",label:"Mixed"},{id:"es-en",label:"ES → EN"},{id:"en-es",label:"EN → ES"},
  {id:"listening",label:"🎧 Listening"},{id:"dictation",label:"⌨️ Dictation"},{id:"blank",label:"✏️ Fill blank"},{id:"conversation",label:"💬 Conversation"}
];
export const QUIZ_FOCUS=[
  {id:"all",label:"All patterns"},{id:"present",label:"Presente"},{id:"past",label:"Pasado"},
  {id:"future",label:"Futuro"},{id:"perfecto",label:"He hecho"},{id:"condicional",label:"Condicional"},
  {id:"pasado-perfecto",label:"Había hecho"},{id:"futuro-perfecto",label:"Habré hecho"},
  {id:"pronombres",label:"Pronombres"},{id:"subjuntivo",label:"Subjuntivo"}
];
export const FOCUS_MODES=new Set(["mixed","blank","conversation","dictation"]);
/* Normal quiz rounds do not repeat until the available pool is used. Missed
   questions may still repeat intentionally through the explicit Repaso card. */
export function resetQuizRound(){appState.qRoundKey="";appState.qRoundSeen.clear();}
// Quiz score DOM init moved to initQuiz()

export const SITUATION_BLITZ_PACKS=[
  {id:"uber-blitz",label:"🚕 In an Uber",cats:["uber","uber-real","direcciones","carropartes"]},
  {id:"food-blitz",label:"🍽️ Order & Pay",cats:["restaurante","restaurante-real","bancos-pagos","cortesia","comida","mercado"]},
  {id:"travel-blitz",label:"🛬 Airport & Hotel",cats:["aeropuerto","hotel","lugares","compras"]},
  {id:"social-blitz",label:"🤝 Social & Parche",cats:["social","fiesta","deportes","muletillas","expresiones","colombianismos"]},
  {id:"living-blitz",label:"🏢 Apt, Estratos, Reparaciones & Salud",cats:["estratos","hogar-reparaciones","seguridad-emergencias","migracion-ce","odontologia","cajero-sim","porteria","arriendo","whatsapp","barberia","farmacia","medico","reparar","casa"]},
  {id:"local-blitz",label:"🪗 San Juan, Trampas, Fútbol & Rumba",cats:["sanjuan-guajira","eventos-futbol","trampas","corrientazo","citas-familia","puentes-rumba","panaderia","viajes-finca","empatia","comodin","gym-ciclovia","direcciones","colombianismos"]}
];
let qmw=null,qcw=null,qfs=null;
export function syncQuizControls(){
  document.querySelectorAll(".qcat").forEach((x,i)=>x.classList.toggle("active",!appState.qBlitzPack&&QC[i].id===appState.qCat));
  document.querySelectorAll(".qmode").forEach((x,i)=>x.classList.toggle("active",QUIZ_MODES[i].id===appState.qMode));
  document.querySelectorAll(".qblitz-btn").forEach(x=>x.classList.toggle("active",!!(appState.qBlitzPack&&x.dataset.blitz===appState.qBlitzPack.id)));
  const missedChip=document.querySelector(".qv102-missed-btn");
  if(missedChip){
    const mCount=storedMissedQuestionCount();
    missedChip.textContent=`🎯 Missed (${mCount})`;
    missedChip.classList.toggle("active",!!appState.qMissedOnly);
    missedChip.setAttribute("aria-pressed",appState.qMissedOnly?"true":"false");
  }
  const focusSupported=FOCUS_MODES.has(appState.qMode);
  if(!focusSupported)appState.qFocus="all";
  if(qfs){qfs.value=appState.qFocus;qfs.disabled=!focusSupported;}
  const note=document.getElementById("qfocus-note");
  if(note){note.textContent=focusSupported?"Choose a grammar pattern, or leave All patterns.":"Choose Mixed, Fill blank, or Conversation to use Grammar focus.";note.classList.toggle("active",focusSupported&&appState.qFocus!=="all");}
  const sum=document.getElementById("quiz-customize-summary");
  if(sum){
    if(appState.qBlitzPack)sum.textContent=appState.qBlitzPack.label;
    else if(appState.qCat!=="all"||appState.qFocus!=="all"){
      const parts=[];
      if(appState.qCat!=="all")parts.push((QC.find(c=>c.id===appState.qCat)||{}).label||appState.qCat);
      if(appState.qFocus!=="all")parts.push((QUIZ_FOCUS.find(f=>f.id===appState.qFocus)||{}).label||appState.qFocus);
      sum.textContent=parts.join(" · ");
    }else sum.textContent="Topic + grammar";
  }
}
export function quizPool(){
  if(appState.qSavedOnly){
    const starred=getStarredPhrases();
    const mapped=starred.map(s=>{
      const norm=normalizeQuizText(s.text);
      const match=aQ.find(x=>normalizeQuizText(x.es)===norm);
      const en=s.en||(match&&match.en)||"";
      if(appState.qMode==="dictation")return{es:s.text,en,tts:s.text,answer:s.text,prompt:"🎧",dictation:true,cat:"frases"};
      if(appState.qMode==="listening"||!en)return{es:s.text,en:en||"Saved Colombian phrase",tts:s.text,answer:s.text,prompt:"🎧",kind:"listening",cat:"frases"};
      if(appState.qMode==="en-es")return{es:s.text,en,tts:s.text,answer:s.text,prompt:en,cat:"frases"};
      return{es:s.text,en,tts:s.text,answer:en,prompt:s.text,kind:"meaning",cat:"frases"};
    });
    return cleanQuizPool(mapped);
  }
  let pool;
  if(appState.qMode==="blank")pool=FILL_BLANK_QUIZ.map(q=>({...q,answer:q.en,prompt:q.quizPrompt||q.es}));
  else if(appState.qMode==="conversation")pool=CONVERSATION_QUIZ.map(q=>({...q,answer:q.en,prompt:q.es}));
  else if(appState.qMode==="dictation")pool=aQ.filter(q=>!q.kind&&q.es&&q.tts).map(q=>({...q,answer:q.es,prompt:"🎧",dictation:true}));
  else if(appState.qMode==="en-es")pool=aQ.filter(q=>!q.kind).map(q=>({...q,answer:q.es,prompt:q.en}));
  else if(appState.qMode==="listening")pool=aQ.filter(q=>!q.kind).map(q=>({...q,answer:q.es,prompt:"🎧"}));
  else if(appState.qMode==="es-en")pool=aQ.filter(q=>!q.kind||q.kind==="meaning").map(q=>({...q,answer:q.en,prompt:q.quizPrompt||q.es}));
  else pool=aQ.map(q=>({...q,answer:q.en,prompt:q.kind==="listening"?"🎧":(q.quizPrompt||q.es)}));
  if(appState.qBlitzPack&&Array.isArray(appState.qBlitzPack.cats)){
    pool=pool.filter(q=>appState.qBlitzPack.cats.includes(q.cat));
  }else if(appState.qMode==="blank"){
    if(appState.qCat==="pronombres")pool=pool.filter(q=>q.cat==="pronombres");
    else if(appState.qCat!=="all")pool=pool.filter(q=>q.cat===appState.qCat);
  }else if(appState.qMode==="conversation"){
    pool=appState.qCat==="all"?pool:pool.filter(q=>q.cat===appState.qCat);
  }else{
    pool=appState.qCat==="all"?pool:pool.filter(q=>q.cat===appState.qCat);
  }
  if(FOCUS_MODES.has(appState.qMode)&&appState.qFocus!=="all")pool=pool.filter(q=>q.focus===appState.qFocus);
  return cleanQuizPool(pool);
}
export function quizRoundPromptKey(q){
  const text=(appState.qMode==="listening"||q.prompt==="🎧")?(q.tts||q.es):(q.prompt||q.es);
  return normalizeQuizPrompt(text);
}
export function cleanQuizPool(pool){
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
export function missedQuizKey(q){return `${q.es}|${q.en||q.answer}`;}
export function clearMissedQuiz(q){
  const canonical=missedQuizKey(q),legacy=`${q.es}|${q.answer}`;
  if(qStore.missed[canonical])delete qStore.missed[canonical];
  if(legacy!==canonical&&qStore.missed[legacy])delete qStore.missed[legacy];
}
export function exitMissedQueue(){appState.qMissedOnly=false;appState.qSavedOnly=false;appState.repasoLeft=0;resetQuizRound();syncQuizControls();nQ();}
export function openMissedQueue(){appState.qBlitzPack=null;appState.qSavedOnly=false;showPage("quiz");appState.qMissedOnly=true;appState.qMode="mixed";appState.qCat="all";appState.qFocus="all";appState.repasoLeft=0;resetQuizRound();syncQuizControls();nQ();}
export function nQ(){
  appState.an=false;document.getElementById("quiz-next").style.display="none";const quizFb=document.getElementById("quiz-fb"),quizReveal=document.getElementById("quiz-reveal");quizFb.innerHTML="";if(quizReveal){quizFb.appendChild(quizReveal);quizReveal.innerHTML="";}quizFb.classList.remove("visible");actions.syncMissedQueueLauncher();
  const helpRow=document.getElementById("quiz-help-row"),helpBtn=document.getElementById("quiz-help"),helpText=document.getElementById("quiz-help-text");
  if(helpRow){helpRow.hidden=true;if(helpText){helpText.hidden=true;helpText.textContent="";}if(helpBtn){helpBtn.textContent="💡 Show English help";helpBtn.onclick=null;}}
  const reviewBanner=document.getElementById("quiz-review-banner");
  if(reviewBanner){reviewBanner.hidden=!(appState.qMissedOnly||appState.qSavedOnly);reviewBanner.innerHTML="";}
  const base=quizPool();
  if(!base.length){
    if(appState.qSavedOnly&&reviewBanner){
      reviewBanner.hidden=false;
      reviewBanner.innerHTML="<span><strong>⭐ Saved phrases</strong> — pin any phrase with ☆ first to quiz your custom list.</span><button type='button' class='quiz-review-exit'>Back to quiz</button>";
      reviewBanner.querySelector("button").onclick=exitMissedQueue;
    }
    document.querySelector(".qc-label").textContent=appState.qSavedOnly?"No saved phrases yet":"No matching questions";
    document.getElementById("qc-word").textContent=appState.qSavedOnly?"⭐":"Try All topics or All patterns";
    document.getElementById("quiz-opts").innerHTML="";
    return;
  }
  const reviewBase=appState.qMissedOnly?base.filter(q=>Number(qStore.missed[missedQuizKey(q)])>0):base;
  if(!reviewBase.length){
    document.querySelector(".qc-label").textContent=appState.qMissedOnly?"Missed queue complete":"No matching questions";
    document.getElementById("qc-word").textContent=appState.qMissedOnly?"✅":"Try All topics or All patterns";
    document.getElementById("quiz-opts").innerHTML="";
    if(reviewBanner){reviewBanner.hidden=false;reviewBanner.innerHTML="<span><strong>Missed questions</strong> — your retry queue is clear.</span><button type='button' class='quiz-review-exit'>Back to quiz</button>";reviewBanner.querySelector("button").onclick=exitMissedQueue;}
    return;
  }
  if(reviewBanner&&appState.qMissedOnly){reviewBanner.hidden=false;reviewBanner.innerHTML="<span><strong>Missed questions</strong> · "+storedMissedQuestionCount()+" remaining. Correct answers leave the queue.</span><button type='button' class='quiz-review-exit'>Exit queue</button>";reviewBanner.querySelector("button").onclick=exitMissedQueue;}
  else if(reviewBanner&&appState.qSavedOnly){reviewBanner.hidden=false;reviewBanner.innerHTML=`<span><strong>⭐ Saved Phrasebook</strong> · quizzing ${base.length} personal phrase${base.length===1?"":"s"}.</span><button type='button' class='quiz-review-exit'>Exit ⭐</button>`;reviewBanner.querySelector("button").onclick=exitMissedQueue;}
  const roundKey=(appState.qMissedOnly?"missed|":appState.qSavedOnly?"saved|":"normal|")+appState.qMode+"|"+appState.qCat+"|"+appState.qFocus;
  if(roundKey!==appState.qRoundKey){appState.qRoundKey=roundKey;appState.qRoundSeen.clear();}
   let unseen=reviewBase.filter(q=>!appState.qRoundSeen.has(quizRoundPromptKey(q)));
  if(!unseen.length){appState.qRoundSeen.clear();unseen=reviewBase;}
  /* Missed questions can repeat during appState.an explicit Repaso session. In a
     normal round, only unseen missed questions receive extra weighting. */
   const dueAll=reviewBase.filter(q=>srsDue(q.es+"|"+q.answer));
   const duePool=unseen.filter(q=>srsDue(q.es+"|"+q.answer));
   let pickFrom;
   if(appState.repasoLeft>0&&dueAll.length){pickFrom=dueAll;appState.repasoLeft--;}
   else{if(appState.repasoLeft>0)appState.repasoLeft=0;pickFrom=(duePool.length&&Math.random()<0.7)?duePool:unseen;}
  appState.cQ=pickFrom[Math.floor(Math.random()*pickFrom.length)];
   appState.qRoundSeen.add(quizRoundPromptKey(appState.cQ));
  if(helpRow&&appState.cQ.kind==="blank"){
    const translation=englishAnswer(appState.cQ);
    if(translation){
      helpRow.hidden=false;
      helpText.textContent=translation;
      helpBtn.onclick=()=>{const open=helpText.hidden;helpText.hidden=!open;helpBtn.textContent=open?"🙈 Hide English help":"💡 Show English help";};
    }
  }
  if(appState.qMode==="dictation"){
    const wordEl=document.getElementById("qc-word");
    wordEl.textContent="🎧";
    applyQuizFitClasses(wordEl,null,"🎧",null);
    document.querySelector(".qc-label").textContent="Listen, then tap words or type Spanish";
    const ow=document.getElementById("quiz-opts");ow.innerHTML="";ow.classList.remove("opts-stack","opts-dense");
    const box=document.createElement("div");box.className="quiz-dictation";
    box.innerHTML="<div class='dictation-hint'>Listen first — tap tiles below in order or type manually.</div>";
    const input=document.createElement("input");input.type="text";input.className="dictation-input";input.placeholder="Tap words below or write en español…";input.autocomplete="off";input.autocapitalize="sentences";
    const targetWords=String(appState.cQ.answer||appState.cQ.es).trim().split(/\s+/).filter(Boolean);
    const chipBank=document.createElement("div");chipBank.className="dictation-chips";
    const extras=["para","muy","con","por","pues","aquí"].filter(w=>!targetWords.some(tw=>normalizeQuizText(tw)===w)).slice(0,2);
    [...targetWords,...extras].sort(()=>Math.random()-0.5).forEach(w=>{
      const t=document.createElement("button");t.type="button";t.className="lp-builder-chip dictation-chip";t.textContent=w;
      t.onclick=()=>{if(appState.an)return;input.value=(input.value.trim()?input.value.trim()+" ":"")+w;t.disabled=true;};
      chipBank.appendChild(t);
    });
    const clearTiles=document.createElement("button");clearTiles.type="button";clearTiles.className="lp-builder-chip dictation-chip-clear";clearTiles.textContent="↩ Clear";
    clearTiles.onclick=()=>{if(appState.an)return;input.value="";chipBank.querySelectorAll(".dictation-chip").forEach(c=>c.disabled=false);};
    chipBank.appendChild(clearTiles);
    const submit=document.createElement("button");submit.type="button";submit.className="dictation-submit";submit.textContent="Check →";
    const finish=()=>{
      if(appState.an)return;
      const raw=input.value.trim();if(!raw){input.focus();return;}
      appState.an=true;appState.qT++;document.getElementById("q-total").textContent=appState.qT;
      const expected=String(appState.cQ.answer||appState.cQ.es),strict=normalizeDictation(raw,false)===normalizeDictation(expected,false);
      const loose=normalizeDictation(raw,true)===normalizeDictation(expected,true);
      const correct=strict||loose,fb=document.getElementById("quiz-fb"),quizReveal=document.getElementById("quiz-reveal"),mk=appState.cQ.es+"|"+appState.cQ.answer,missKey=missedQuizKey(appState.cQ);
      submit.disabled=true;input.classList.add(correct?"correct":"wrong");
      if(correct){
        appState.qC++;appState.qS++;recordSrs(mk,true);clearSpeakingError(appState.cQ.tts||appState.cQ.es);document.getElementById("q-correct").textContent=appState.qC;document.getElementById("q-streak").textContent="🔥 "+appState.qS;
         fb.innerHTML=(strict?"✅ ¡Correcto!":"✅ Correcto — check the accent marks.")+" <small class='srs-next'>Next review: "+srsNextLabel(srsStore[mk])+"</small>";fb.style.color="var(--teal)";fb.classList.add("visible");speak(appState.cQ.tts,0.75);
        clearMissedQuiz(appState.cQ);
      }else{
        appState.qS=0;recordSrs(mk,false);recordSpeakingError(appState.cQ.tts||appState.cQ.es,"dictation");document.getElementById("q-streak").textContent="🔥 0";
         fb.innerHTML="❌ Not quite <small class='srs-next'>Review again tomorrow.</small>";fb.style.color="var(--pink)";fb.classList.add("visible");
        input.value=expected;
        qStore.missed[missKey]=(qStore.missed[missKey]||0)+2;
      }
      if(quizReveal){quizReveal.innerHTML="<div>🇨🇴 <strong>"+spanishAnswer(appState.cQ)+"</strong></div><div>🇺🇸 "+englishAnswer(appState.cQ)+"</div>";attachMic(quizReveal,spanishAnswer(appState.cQ));fb.appendChild(quizReveal);}
      qStore.c=appState.qC;qStore.t=appState.qT;qStore.s=appState.qS;saveQ();actions.syncMissedQueueLauncher();
      document.getElementById("quiz-next").style.display="block";
    };
    submit.onclick=finish;input.onkeydown=e=>{if(e.key==="Enter")finish();};
    box.append(chipBank,input,submit);ow.appendChild(box);if(document.getElementById("page-quiz")?.classList.contains("active")){speak(appState.cQ.tts,0.7);}
    return;
  }
  /* Listening questions must not show the Spanish text — hide it and auto-play */
  appState.qBlindPeek=false;
  document.getElementById("qc-word").textContent=appState.qMode==="listening"||appState.cQ.kind==="listening"?"🎧":appState.cQ.prompt;
  renderQuizPromptAndBlind();
  document.querySelector(".qc-label").textContent=appState.qMode==="en-es"?"Translate to Spanish":appState.qMode==="listening"?"Listen and recognize":appState.qMode==="blank"?"Complete the sentence":appState.qMode==="conversation"?(appState.cQ.kind==="reply"?"Choose the natural reply":appState.cQ.kind==="meaning"?"Choose the English meaning":appState.cQ.kind==="listening"?"Listen and recognize":appState.cQ.kind==="tense"?"Choose the matching tense":"Choose the best answer"):appState.qMode==="es-en"?"Translate to English":appState.cQ.kind==="reply"?"Choose the correct reply":appState.cQ.kind==="listening"?"Listen and recognize":appState.cQ.kind==="tense"?"Which tense is it?":appState.cQ.kind==="blank"?"Complete the sentence":"Choose the correct answer";
  if(document.getElementById("page-quiz")?.classList.contains("active")){
    if(appState.qMode==="listening"||appState.cQ.kind==="listening")speak(appState.cQ.tts,0.7);
    else if(isBlindEarActive()&&appState.qMode!=="en-es"&&appState.cQ.kind!=="blank")speak(appState.cQ.tts||appState.cQ.es,0.78);
  }
  const seen=new Set(quizAcceptedAnswers(appState.cQ).map(normalizeQuizText));const wrong=[];
  /* Mixed mode contains several question families.  Do not use a Spanish
     blank answer as a distractor for appState.an English meaning question (or vice
     versa); that makes some questions look like they have multiple answers. */
  const questionFamily=q=>q.kind||"vocab";
  let compatible=base.filter(q=>q!==appState.cQ&&questionFamily(q)===questionFamily(appState.cQ));
  if(compatible.length<3)compatible=[...base,...(appState.qSavedOnly?aQ:[])].filter(q=>q!==appState.cQ&&typeof q.answer===typeof appState.cQ.answer);
  const wrongPool=appState.cQ.choices?appState.cQ.choices.map(answer=>({answer})):compatible.sort(()=>Math.random()-0.5);
  for(const w of wrongPool){if(wrong.length>=3)break;if(!w.answer)continue;const wk=normalizeQuizText(w.answer);if(!wk||seen.has(wk))continue;seen.add(wk);wrong.push({answer:w.answer});}
  const opts=[appState.cQ,...wrong].sort(()=>Math.random()-0.5);
  const ow=document.getElementById("quiz-opts");ow.innerHTML="";ow.hidden=false;
  const rg=document.getElementById("quiz-recall-gate");if(rg){rg.hidden=true;rg.innerHTML="";}
  applyQuizFitClasses(document.getElementById("qc-word"),ow,document.getElementById("qc-word")?.textContent,opts.map(o=>o.answer));
  opts.forEach((opt,optIdx)=>{const b=document.createElement("button");b.className="qopt";b.textContent=opt.answer;b.dataset.kbd=String(optIdx+1);
    b.onclick=()=>{if(appState.an)return;appState.an=true;appState.qT++;document.getElementById("q-total").textContent=appState.qT;
      if(rg){rg.hidden=true;}ow.hidden=false;
      renderQuizPromptAndBlind();
      const fb=document.getElementById("quiz-fb"),quizReveal=document.getElementById("quiz-reveal");
      const mk=appState.cQ.es+"|"+appState.cQ.answer,missKey=missedQuizKey(appState.cQ);
        if(quizAnswerMatches(appState.cQ,opt.answer)){b.classList.add("correct");appState.qC++;appState.qS++;recordSrs(mk,true);clearSpeakingError(appState.cQ.tts||appState.cQ.es);document.getElementById("q-correct").textContent=appState.qC;document.getElementById("q-streak").textContent="🔥 "+appState.qS;fb.innerHTML=`✅ ¡Correcto! <small class="srs-next">Next review: ${srsNextLabel(srsStore[mk])}</small>`;fb.style.color="var(--teal)";fb.classList.add("visible");speak(appState.cQ.tts,0.75);
        clearMissedQuiz(appState.cQ);}
        else{b.classList.add("wrong");appState.qS=0;recordSrs(mk,false);recordSpeakingError(appState.cQ.tts||appState.cQ.es,"quiz");document.getElementById("q-streak").textContent="🔥 0";fb.innerHTML="❌ Incorrecto <small class='srs-next'>Review again tomorrow.</small>";fb.style.color="var(--pink)";fb.classList.add("visible");document.querySelectorAll(".qopt").forEach(x=>{if(normalizeQuizText(x.textContent)===normalizeQuizText(appState.cQ.answer))x.classList.add("reveal");});
        qStore.missed[missKey]=(qStore.missed[missKey]||0)+2;}
      if(quizReveal){quizReveal.innerHTML=`<div>🇨🇴 <strong>${spanishAnswer(appState.cQ)}</strong></div><div>🇺🇸 ${englishAnswer(appState.cQ)}</div>`;attachMic(quizReveal,spanishAnswer(appState.cQ));fb.appendChild(quizReveal);}
      qStore.c=appState.qC;qStore.t=appState.qT;qStore.s=appState.qS;saveQ();actions.syncMissedQueueLauncher();
      document.getElementById("quiz-next").style.display="block";};ow.appendChild(b);});
  syncRecallFirstGate();
}
export function syncRecallFirstGate(){
  const btn=document.getElementById("quiz-recall-toggle");
  const rg=document.getElementById("quiz-recall-gate");
  const ow=document.getElementById("quiz-opts");
  const on=!!userPrefs.recallFirst;
  if(btn){
    btn.textContent=on?"🗣️ Recall-First: ON":"🗣️ Recall-First: OFF";
    btn.classList.toggle("active",on);
    btn.setAttribute("aria-pressed",on?"true":"false");
  }
  if(!rg||!ow)return;
  if(!on||!appState.cQ||appState.an||appState.qMode==="dictation"){
    rg.hidden=true;
    ow.hidden=false;
    return;
  }
  ow.hidden=true;
  rg.hidden=false;
  rg.innerHTML=`<div class="brain-recall-copy">Say or translate it from memory first — reveal choices once you've tried!</div><div class="bridge-actions"><button type="button" class="lp-nav-btn quiz-recall-mic">🎙️ Say Answer</button><button type="button" class="lp-nav-btn primary quiz-recall-show">👀 Show 4 Choices</button></div>`;
  rg.querySelector(".quiz-recall-mic").onclick=()=>openMicPanel(spanishAnswer(appState.cQ),"phrases");
  rg.querySelector(".quiz-recall-show").onclick=()=>{rg.hidden=true;ow.hidden=false;};
}
export function toggleQuizRecallFirst(){
  userPrefs.recallFirst=!userPrefs.recallFirst;
  saveUserPrefs();
  syncRecallFirstGate();
}
export function renderQuizPromptAndBlind(){
  const wordEl=document.getElementById("qc-word");
  const tog=document.getElementById("quiz-blind-toggle");
  const peek=document.getElementById("quiz-blind-peek");
  const earOn=isBlindEarActive();
  if(tog){
    tog.textContent=earOn?"🎧 Blind-Ear: ON":"🎧 Blind-Ear: OFF";
    tog.classList.toggle("active",earOn);
    tog.setAttribute("aria-pressed",earOn?"true":"false");
  }
  if(!appState.cQ){if(peek)peek.hidden=true;return;}
  const spanishPrompt=!["en-es","listening","dictation"].includes(appState.qMode)&&appState.cQ.kind!=="listening"&&appState.cQ.prompt&&normalizeQuizText(appState.cQ.prompt)!==normalizeQuizText(appState.cQ.en||"");
  const mask=earOn&&spanishPrompt&&!appState.qBlindPeek&&!appState.an;
  if(appState.qMode==="listening"||appState.cQ.kind==="listening"||appState.qMode==="dictation"){
    if(wordEl)wordEl.textContent="🎧";
    if(peek)peek.hidden=true;
  }else{
    if(wordEl)wordEl.textContent=mask?"🎧 Listen first — tap Peek to read":appState.cQ.prompt;
    if(peek){
      peek.hidden=!(earOn&&spanishPrompt&&!appState.an);
      peek.textContent=appState.qBlindPeek?"🙈 Hide Spanish":"👁️ Peek Spanish";
      peek.onclick=()=>{appState.qBlindPeek=!appState.qBlindPeek;renderQuizPromptAndBlind();};
    }
  }
  applyQuizFitClasses(wordEl,null,wordEl?wordEl.textContent:"",null);
}
export function toggleQuizBlindEar(){
  const earOn=isBlindEarActive();
  if(effectiveLevel()==="fluent"&&earOn){userPrefs.level="explorer";userPrefs.blindEar=false;}
  else{userPrefs.blindEar=!earOn;}
  saveUserPrefs();
  renderQuizPromptAndBlind();
  if(isBlindEarActive()&&appState.cQ&&!appState.an&&appState.qMode!=="en-es")quizHear();
  if(typeof actions.buildSpeakingGuide==="function")actions.buildSpeakingGuide();
  if(typeof actions.buildGram==="function"&&typeof GRAMMAR!=="undefined")actions.buildGram("presente",GRAMMAR.presente);
}
export function quizHear(){
  if(!appState.cQ)return;
  if(appState.an){speak(spanishAnswer(appState.cQ),0.7);return;} /* after answering: hear the Spanish answer */
  if(appState.qMode==="dictation"){speak(appState.cQ.tts,0.7);return;}
  if(appState.qMode==="en-es")return; /* pre-answer audio in EN→ES would speak the answer */
  if(appState.cQ.kind==="blank"){speak(appState.cQ.es.replace(/_+/g,","),0.7);return;}
  speak(appState.cQ.tts,0.7);
}


export function resumeQuizListeningAudio() {
  if (!appState.an && appState.cQ && (appState.qMode === "listening" || appState.cQ.kind === "listening" || appState.qMode === "dictation")) {
    speak(appState.cQ.tts, 0.7);
  }
}
export function openReviewSession() {
  if (typeof actions.openUnifiedSrsReview === "function" && actions.openUnifiedSrsReview()) return;
  appState.qBlitzPack = null;
  appState.qMissedOnly = false;
  showPage("quiz");
  appState.qMode = "mixed";
  appState.qCat = "all";
  appState.qFocus = "all";
  appState.repasoLeft = 10;
  resetQuizRound();
  syncQuizControls();
  nQ();
}
export function initQuiz() {
  appState.qC = qStore.c || 0;
  appState.qT = qStore.t || 0;
  appState.qS = qStore.s || 0;
  document.getElementById("q-correct").textContent=appState.qC;
  document.getElementById("q-total").textContent=appState.qT;
  document.getElementById("q-streak").textContent="🔥 "+appState.qS;
  /* Reset button inside the compact score bar */
  (function(){
    const bar=document.querySelector(".quiz-score-bar");
    const btn=document.createElement("button");
    btn.type="button";btn.className="quiz-reset";
    btn.textContent="↺";btn.title="Reiniciar puntaje";btn.setAttribute("aria-label","Reiniciar puntaje");
    btn.onclick=()=>{
      appState.qC=0;appState.qT=0;appState.qS=0;appState.repasoLeft=0;appState.qMissedOnly=false;resetQAndSrs();
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
  qmw = document.getElementById("qmode-wrap");
  qcw = document.getElementById("qcat-wrap");
  qfs = document.getElementById("qfocus-select");
  if (qmw && qmw.parentElement && !document.getElementById("qblitz-wrap")) {
    const blitzWrap = document.createElement("div"); blitzWrap.className = "quiz-blitz-wrap";
    blitzWrap.innerHTML = `<div class="quiz-control-label">⚡ Real-Life Situation Blitz (1-tap scenario warmup)</div><div class="quiz-blitz-row" id="qblitz-wrap"></div>`;
    const custBody = document.querySelector("#quiz-customize .quiz-customize-body");
    if (custBody) custBody.insertBefore(blitzWrap, custBody.firstChild);
    else qmw.parentElement.parentElement.insertBefore(blitzWrap, qmw.parentElement);
    const qbw = blitzWrap.querySelector("#qblitz-wrap");
    SITUATION_BLITZ_PACKS.forEach(pack => {
      const b = document.createElement("button"); b.type = "button"; b.className = "qblitz-btn"; b.dataset.blitz = pack.id; b.textContent = pack.label;
      b.onclick = () => {
        if (appState.qBlitzPack && appState.qBlitzPack.id === pack.id) { appState.qBlitzPack = null; appState.repasoLeft = 0; }
        else { appState.qBlitzPack = pack; appState.qMissedOnly = false; appState.qMode = "mixed"; appState.qCat = "all"; appState.qFocus = "all"; appState.repasoLeft = 10; }
        resetQuizRound(); syncQuizControls(); nQ();
      };
      qbw.appendChild(b);
    });
  }
  if (qmw && !qmw.children.length) {
    QUIZ_MODES.forEach(m => { const b = document.createElement("button"); b.type = "button"; b.className = "qmode" + (m.id === appState.qMode ? " active" : ""); b.textContent = m.label; b.onclick = () => { appState.qBlitzPack = null; appState.qMissedOnly = false; appState.qMode = m.id; appState.repasoLeft = 0; resetQuizRound(); syncQuizControls(); nQ(); }; qmw.appendChild(b); });
  }
  if (qcw && !qcw.children.length) {
    QC.forEach(c => { const b = document.createElement("button"); b.className = "qcat" + (c.id === "all" ? " active" : ""); b.textContent = c.label; b.onclick = () => { appState.qBlitzPack = null; appState.qMissedOnly = false; appState.qCat = c.id; appState.repasoLeft = 0; resetQuizRound(); syncQuizControls(); nQ(); }; qcw.appendChild(b); });
  }
  if (qfs) qfs.onchange = () => { appState.qMissedOnly = false; appState.qFocus = qfs.value; appState.repasoLeft = 0; resetQuizRound(); syncQuizControls(); nQ(); };
  const pq = document.getElementById("page-quiz");
  const qc = pq && pq.querySelector(".quiz-card");
  if (pq && qc && !document.getElementById("quiz-v102-hub")) {
    const hub = document.createElement("div"); hub.id = "quiz-v102-hub";
    pq.insertBefore(hub, qc);
    renderQuizV102Hub();
  }
  if (pq && !pq.dataset.kbdReady) {
    pq.dataset.kbdReady = "1";
    document.addEventListener("keydown", e => {
      if (!pq.classList.contains("active") || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key >= "1" && e.key <= "4") {
        const idx = Number(e.key) - 1;
        const pool = pq.classList.contains("v102-solo")
          ? pq.querySelectorAll("#quiz-v102-hub .sprint-opts .qopt, #quiz-v102-hub .pm-grid .pm-choice-card")
          : (!appState.an ? pq.querySelectorAll("#quiz-opts .qopt") : []);
        const btn = pool[idx];
        if (btn) { e.preventDefault(); btn.click(); }
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        const soloNext = pq.classList.contains("v102-solo")
          ? pq.querySelector("#quiz-v102-hub .pm-actions .lp-nav-btn.primary, #quiz-v102-hub .sprint-intro-card .lp-nav-btn.primary")
          : null;
        const nextBtn = soloNext || document.getElementById("quiz-next");
        if (nextBtn && nextBtn.getClientRects().length > 0 && getComputedStyle(nextBtn).display !== "none") {
          e.preventDefault();
          nextBtn.click();
        }
      } else if (e.key === "r" || e.key === "R") {
        const hearBtn = pq.classList.contains("v102-solo")
          ? pq.querySelector("#quiz-v102-hub .sprint-hear-btn, #quiz-v102-hub .pm-hear-btn, #quiz-v102-hub .pm-hear-mini")
          : pq.querySelector(".qc-hear");
        if (hearBtn && hearBtn.getClientRects().length > 0) {
          e.preventDefault();
          hearBtn.click();
        }
      }
    });
  }
  nQ();
}
