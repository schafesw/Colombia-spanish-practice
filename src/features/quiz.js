import {
  PICTURE_MATCH_BANK, NATURAL_EAR_CLIPS, GRINGO_TRAPS,
  SPEAKING_GUIDE, PRONOMBRES, REFLEXIVOS, GRAMMAR,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { userPrefs, saveUserPrefs, effectiveLevel, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, normalizeDictation, normalizeQuizText, normalizeQuizPrompt, normalizeQuizAnswer, quizItemKey } from "../core/text-utils.js";
import { qStore, saveQ, srsStore, saveSrs, srsDue, srsNextLabel, recordSrs, recordSpeakingError, clearSpeakingError, markPractice } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";
import { aQ, RR_BANK, BLANK_EN, CONVERSATION_QUIZ, FILL_BLANK_QUIZ, storedMissedQuestionCount, spanishAnswer, englishAnswer, quizAcceptedAnswers, quizAnswerMatches } from "../core/quiz-bank.js";
import { actions, showPage, ensurePageInitialized } from "./navigation.js";

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
  const focusSupported=FOCUS_MODES.has(appState.qMode);
  if(!focusSupported)appState.qFocus="all";
  if(qfs){qfs.value=appState.qFocus;qfs.disabled=!focusSupported;}
  const note=document.getElementById("qfocus-note");
  if(note){note.textContent=focusSupported?"Choose a grammar pattern, or leave All patterns.":"Choose Mixed, Fill blank, or Conversation to use Grammar focus.";note.classList.toggle("active",focusSupported&&appState.qFocus!=="all");}
}
export function quizPool(){
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
export function exitMissedQueue(){appState.qMissedOnly=false;appState.repasoLeft=0;resetQuizRound();nQ();}
export function openMissedQueue(){appState.qBlitzPack=null;showPage("quiz");appState.qMissedOnly=true;appState.qMode="mixed";appState.qCat="all";appState.qFocus="all";appState.repasoLeft=0;resetQuizRound();syncQuizControls();nQ();}
export function nQ(){
  appState.an=false;document.getElementById("quiz-next").style.display="none";const quizFb=document.getElementById("quiz-fb"),quizReveal=document.getElementById("quiz-reveal");quizFb.innerHTML="";if(quizReveal){quizFb.appendChild(quizReveal);quizReveal.innerHTML="";}quizFb.classList.remove("visible");actions.syncMissedQueueLauncher();
  const helpRow=document.getElementById("quiz-help-row"),helpBtn=document.getElementById("quiz-help"),helpText=document.getElementById("quiz-help-text");
  if(helpRow){helpRow.hidden=true;if(helpText){helpText.hidden=true;helpText.textContent="";}if(helpBtn){helpBtn.textContent="💡 Show English help";helpBtn.onclick=null;}}
  const reviewBanner=document.getElementById("quiz-review-banner");
  if(reviewBanner){reviewBanner.hidden=!appState.qMissedOnly;reviewBanner.innerHTML="";}
  const base=quizPool();
  if(!base.length){
    document.querySelector(".qc-label").textContent="No matching questions";
    document.getElementById("qc-word").textContent="Try All topics or All patterns";
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
  if(reviewBanner){reviewBanner.hidden=false;reviewBanner.innerHTML="<span><strong>Missed questions</strong> · "+storedMissedQuestionCount()+" remaining. Correct answers leave the queue.</span><button type='button' class='quiz-review-exit'>Exit queue</button>";reviewBanner.querySelector("button").onclick=exitMissedQueue;}
  const roundKey=(appState.qMissedOnly?"missed|":"normal|")+appState.qMode+"|"+appState.qCat+"|"+appState.qFocus;
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
    document.getElementById("qc-word").textContent="🎧";
    document.querySelector(".qc-label").textContent="Listen, then type the Spanish";
    const ow=document.getElementById("quiz-opts");ow.innerHTML="";
    const box=document.createElement("div");box.className="quiz-dictation";
    box.innerHTML="<div class='dictation-hint'>Listen first. Type the full Spanish sentence or phrase from memory.</div>";
    const input=document.createElement("input");input.type="text";input.className="dictation-input";input.placeholder="Escribe en español…";input.autocomplete="off";input.autocapitalize="sentences";
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
    box.append(input,submit);ow.appendChild(box);if(document.getElementById("page-quiz")?.classList.contains("active")){setTimeout(()=>input.focus(),50);speak(appState.cQ.tts,0.7);}
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
  if(compatible.length<3)compatible=base.filter(q=>q!==appState.cQ&&typeof q.answer===typeof appState.cQ.answer);
  const wrongPool=appState.cQ.choices?appState.cQ.choices.map(answer=>({answer})):compatible.sort(()=>Math.random()-0.5);
  for(const w of wrongPool){if(wrong.length>=3)break;if(!w.answer)continue;const wk=normalizeQuizText(w.answer);if(!wk||seen.has(wk))continue;seen.add(wk);wrong.push({answer:w.answer});}
  const opts=[appState.cQ,...wrong].sort(()=>Math.random()-0.5);
  const ow=document.getElementById("quiz-opts");ow.innerHTML="";
  opts.forEach(opt=>{const b=document.createElement("button");b.className="qopt";b.textContent=opt.answer;
    b.onclick=()=>{if(appState.an)return;appState.an=true;appState.qT++;document.getElementById("q-total").textContent=appState.qT;
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


var pmOpenInVocab=false,pmSetFilter="all",pmDirection="word2pic",pmTargetIdx=0,pmPickedId=null,pmScore=0,pmAttempts=0,pmStreak=0,pmPoolOrder=null,pmPoolKey="";
export function pmSrsRank(x){
  const card=(typeof srsStore!=="undefined"&&srsStore["pm|"+x.id])||null;
  if(!card)return 10;
  const due=(typeof srsDue==="function"&&srsDue("pm|"+x.id))?-20:0;
  return due-(card.lapses||0)*4+(card.reps||0)*2;
}
export function pmFilteredPool(){
  if(typeof PICTURE_MATCH_BANK==="undefined"||!PICTURE_MATCH_BANK.length)return[];
  const sub=pmSetFilter==="all"?PICTURE_MATCH_BANK:PICTURE_MATCH_BANK.filter(x=>x.set===pmSetFilter);
  const base=sub.length>=4?sub:PICTURE_MATCH_BANK;
  if(!pmPoolOrder||pmPoolKey!==pmSetFilter||pmPoolOrder.length!==base.length){
    pmPoolKey=pmSetFilter;
    pmPoolOrder=base.slice().sort((a,b)=>pmSrsRank(a)-pmSrsRank(b));
  }
  return pmPoolOrder;
}
export function pmChoicesFor(target,pool){
  const others=PICTURE_MATCH_BANK.filter(x=>x.id!==target.id);
  const sameSet=others.filter(x=>x.set===target.set);
  const pick=[target];
  for(const item of [...sameSet,...others]){
    if(pick.length>=4)break;
    if(!pick.some(p=>p.id===item.id))pick.push(item);
  }
  return pick.sort((a,b)=>(a.id.charCodeAt(3)+target.word.length)%7-((b.id.charCodeAt(3)+target.word.length)%7));
}
export function renderPictureMatchDeck(host){
  if(!host||typeof PICTURE_MATCH_BANK==="undefined"||!PICTURE_MATCH_BANK.length)return;
  host.innerHTML="";
  const pool=pmFilteredPool();
  const target=pool[pmTargetIdx%pool.length];
  const choices=pmChoicesFor(target,pool);
  const isPicChoice=pmDirection!=="pic2word";
  const cFood=PICTURE_MATCH_BANK.filter(x=>x.set==="food").length;
  const cCity=PICTURE_MATCH_BANK.filter(x=>x.set==="city").length;
  const cGear=PICTURE_MATCH_BANK.filter(x=>x.set==="gear").length;
  const box=document.createElement("div");box.className="pm-deck";
  box.innerHTML=`<div class="pm-controls">
    <div class="pm-set-row"></div>
    <div class="pm-dir-row">
      <button type="button" class="mf-chip${pmDirection==="word2pic"?" active":""}" data-dir="word2pic">📖 Word → Photo</button>
      <button type="button" class="mf-chip${pmDirection==="audio2pic"?" active":""}" data-dir="audio2pic">🔊 Hear → Photo</button>
      <button type="button" class="mf-chip${pmDirection==="pic2word"?" active":""}" data-dir="pic2word">👁️ Photo → Word</button>
    </div>
  </div>
  <div class="pm-prompt-box"></div>
  <div class="pm-grid"></div>
  <div class="pm-feedback" aria-live="polite"></div>
  <div class="bridge-actions pm-actions"></div>`;
  const sRow=box.querySelector(".pm-set-row");
  [["all",`All (${PICTURE_MATCH_BANK.length})`],["food",`☕ Food (${cFood})`],["city",`🚕 City (${cCity})`],["gear",`🎒 Gear (${cGear})`]].forEach(([sid,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(pmSetFilter===sid?" active":"");
    b.textContent=lbl;b.onclick=()=>{pmSetFilter=sid;pmTargetIdx=0;pmPickedId=null;pmPoolOrder=null;renderPictureMatchDeck(host);};
    sRow.appendChild(b);
  });
  const statChip=document.createElement("span");statChip.className="pm-mini-stat";
  statChip.textContent=`⭐ ${pmScore}/${pmAttempts}${pmStreak>1?" · 🔥"+pmStreak:""}`;
  sRow.appendChild(statChip);
  box.querySelectorAll(".pm-dir-row button").forEach(b=>{
    b.onclick=()=>{pmDirection=b.dataset.dir;pmPickedId=null;renderPictureMatchDeck(host);if(pmDirection==="audio2pic")speak(target.tts,0.82);};
  });
  const pBox=box.querySelector(".pm-prompt-box");
  if(pmDirection==="word2pic"){
    pBox.innerHTML=`<div class="pm-word-prompt-row"><span class="pm-word-badge">${escapeVocabHtml(target.word)}</span><button type="button" class="lp-nav-btn pm-hear-mini">🔊 Hear</button></div>`
      +(pmPickedId?"":`<div class="pm-prompt-hint">Tap the matching photo (audio optional)</div>`);
    pBox.querySelector(".pm-hear-mini").onclick=()=>speak(target.tts,0.82);
  }else if(pmDirection==="audio2pic"){
    pBox.innerHTML=`<button type="button" class="lp-nav-btn primary pm-hear-btn">🔊 Tap to Hear Colombian Phrase</button>`
      +(pmPickedId?"":`<div class="pm-prompt-hint">Match what you hear to the photo</div>`);
    pBox.querySelector(".pm-hear-btn").onclick=()=>speak(target.tts,0.82);
  }else{
    pBox.innerHTML=`<div class="pm-solo-img-wrap"><img class="pm-solo-img" src="${target.img}" alt="${escapeVocabHtml(target.en)}"/></div>`
      +(pmPickedId?"":`<div class="pm-prompt-hint">Which Colombian phrase matches this photo?</div>`);
  }
  const grid=box.querySelector(".pm-grid");
  const fb=box.querySelector(".pm-feedback");
  choices.forEach(item=>{
    const btn=document.createElement("button");btn.type="button";
    btn.className="pm-choice-card"+(isPicChoice?" photo-only":" word-only")+(pmPickedId===item.id?(item.id===target.id?" is-right":" is-wrong"):(pmPickedId&&item.id===target.id?" is-right":""));
    if(isPicChoice){
      btn.innerHTML=`<img src="${item.img}" alt="${pmPickedId?escapeVocabHtml(item.word):"Photo option"}"/>${pmPickedId?`<span class="pm-cap">${escapeVocabHtml(item.word)}</span>`:""}`;
    }else{
      btn.innerHTML=`<strong>${escapeVocabHtml(item.word)}</strong><small>${escapeVocabHtml(item.tts)}</small>`;
    }
    btn.onclick=()=>{
      if(pmPickedId===target.id)return;
      const firstTry=!pmPickedId;
      pmPickedId=item.id;
      const ok=item.id===target.id;
      if(firstTry){
        pmAttempts++;
        if(ok){pmScore++;pmStreak++;}
        else{pmStreak=0;}
      }
      if(ok){
        markPractice("vocab",target.tts);
        if(typeof recordSrs==="function")recordSrs("pm|"+target.id,true);
      }else if(typeof recordSrs==="function"){
        recordSrs("pm|"+target.id,false);
      }
      speak(target.tts,0.8);
      renderPictureMatchDeck(host);
    };
    grid.appendChild(btn);
  });
  if(pmPickedId){
    const ok=pmPickedId===target.id;
    const wrongLbl=pmDirection==="audio2pic"?"🔁 <strong>Keep listening:</strong>":"❌ <strong>Not quite — it's:</strong>";
    fb.className="pm-feedback "+(ok?"ok":"warn");
    fb.innerHTML=`${ok?"✅ <strong>¡Exacto!</strong>":wrongLbl} <strong>${escapeVocabHtml(target.word)}</strong> — <em>${escapeVocabHtml(target.en)}</em><small>${escapeVocabHtml(target.hint)}</small>`;
  }
  const acts=box.querySelector(".pm-actions");
  const nextB=document.createElement("button");nextB.type="button";nextB.className="lp-nav-btn primary";
  nextB.textContent=`Next (${(pmTargetIdx%pool.length)+1}/${pool.length}) →`;
  nextB.onclick=()=>{pmTargetIdx=(pmTargetIdx+1)%pool.length;pmPickedId=null;renderPictureMatchDeck(host);if(pmDirection==="audio2pic"){const nx=pmFilteredPool()[pmTargetIdx%pmFilteredPool().length];if(nx)speak(nx.tts,0.82);}};
  const shufB=document.createElement("button");shufB.type="button";shufB.className="lp-nav-btn";shufB.textContent="🔀 Random";
  shufB.onclick=()=>{const nxt=Math.floor(Math.random()*pool.length);pmTargetIdx=(nxt===pmTargetIdx&&pool.length>1)?(nxt+1)%pool.length:nxt;pmPickedId=null;renderPictureMatchDeck(host);if(pmDirection==="audio2pic"){const nx=pmFilteredPool()[pmTargetIdx%pmFilteredPool().length];if(nx)speak(nx.tts,0.82);}};
  acts.append(nextB,shufB);
  attachMic(acts,target.tts,"vocab");
  host.appendChild(box);
}
export function mountPictureMatchEntry(vocabHome){
  if(!vocabHome||typeof PICTURE_MATCH_BANK==="undefined"||!PICTURE_MATCH_BANK.length)return;
  const wrap=document.createElement("section");wrap.className="pm-card-shell";
  const hdr=document.createElement("button");hdr.type="button";hdr.className="vocab-phonetic-card pm-launch-btn";
  hdr.innerHTML=`<span class="vocab-phonetic-icon">🖼️</span><span><strong>Picture-to-Word Match (${PICTURE_MATCH_BANK.length})</strong><small>Connect photos directly to Colombian Spanish — no English</small></span><span class="vocab-home-arrow">${pmOpenInVocab?"▾":"›"}</span>`;
  const deckHost=document.createElement("div");deckHost.className="pm-deck-host";deckHost.hidden=!pmOpenInVocab;
  hdr.onclick=()=>{
    pmOpenInVocab=!pmOpenInVocab;deckHost.hidden=!pmOpenInVocab;
    hdr.querySelector(".vocab-home-arrow").textContent=pmOpenInVocab?"▾":"›";
    if(pmOpenInVocab)renderPictureMatchDeck(deckHost);
  };
  wrap.append(hdr,deckHost);
  if(pmOpenInVocab)renderPictureMatchDeck(deckHost);
  vocabHome.appendChild(wrap);
}
export function openVocabPictureMatch(){
  if(typeof actions.showVocabHome==="function")actions.showVocabHome();
  pmOpenInVocab=true;
  if(typeof actions.renderVocabHome==="function")actions.renderVocabHome();
  const card=document.querySelector(".pm-card-shell");
  if(card)card.scrollIntoView({behavior:"smooth",block:"start"});
}

export function mountNaturalEarLab(parent){
  if(!parent||typeof NATURAL_EAR_CLIPS==="undefined"||!NATURAL_EAR_CLIPS.length)return;
  let neIdx=0,nePicked=null,neReveal=false;
  const card=document.createElement("section");card.className="bridge-trainer-card natural-ear-card";
  const renderNe=()=>{
    const c=NATURAL_EAR_CLIPS[neIdx%NATURAL_EAR_CLIPS.length];
    card.innerHTML=`<div class="bridge-kicker">🎧 NATURAL-SPEED COLOMBIAN EAR · HOW LOCALS BLEND WORDS</div>
      <div class="bridge-context">Listen at full Colombian speed first, spot what was said, then reveal the shortened spoken form:</div>
      <div class="ne-audio-row">
        <button type="button" class="lp-nav-btn primary ne-play-norm">🗣️ Normal (1.0x)</button>
        <button type="button" class="lp-nav-btn ne-play-fast">⚡ Street Fast (1.15x)</button>
        <button type="button" class="lp-nav-btn ne-play-slow">🐢 Clear Slow (0.7x)</button>
      </div>
      <div class="ne-choices"></div>
      <div class="ne-reveal-box" ${neReveal?"":"hidden"}>
        <div class="ne-forms"><strong>Spoken Fast:</strong> ${escapeVocabHtml(c.fast)} <span class="ne-phon">[${escapeVocabHtml(c.phonetic)}]</span></div>
        <div class="ne-clear"><strong>Full Textbook Form:</strong> ${escapeVocabHtml(c.clear)}</div>
        <div class="tvc-why">💡 ${escapeVocabHtml(c.tip)}</div>
      </div>
      <div class="bridge-actions ne-foot"></div>`;
    card.querySelector(".ne-play-norm").onclick=()=>speak(c.fast,1.0);
    card.querySelector(".ne-play-fast").onclick=()=>speak(c.fast,1.15);
    card.querySelector(".ne-play-slow").onclick=()=>speak(c.clear,0.7);
    const chBox=card.querySelector(".ne-choices");
    c.choices.forEach(opt=>{
      const b=document.createElement("button");b.type="button";
      b.className="vv-quiz-opt"+(nePicked===opt?(opt===c.answer?" is-right":" is-wrong"):(nePicked&&opt===c.answer?" is-right":""));
      b.textContent=opt;
      b.onclick=()=>{nePicked=opt;neReveal=true;markPractice("phrases",c.fast);renderNe();speak(c.fast,0.95);};
      chBox.appendChild(b);
    });
    const foot=card.querySelector(".ne-foot");
    const peek=document.createElement("button");peek.type="button";peek.className="lp-nav-btn";
    peek.textContent=neReveal?"🙈 Hide Transcript":"👁️ Show Spoken Breakdown";
    peek.onclick=()=>{neReveal=!neReveal;renderNe();};
    const nextB=document.createElement("button");nextB.type="button";nextB.className="lp-nav-btn primary";
    nextB.textContent=`Next Clip (${(neIdx%NATURAL_EAR_CLIPS.length)+1}/${NATURAL_EAR_CLIPS.length}) →`;
    nextB.onclick=()=>{neIdx=(neIdx+1)%NATURAL_EAR_CLIPS.length;nePicked=null;neReveal=false;renderNe();speak(NATURAL_EAR_CLIPS[neIdx].fast,1.0);};
    foot.append(peek,nextB);
  };
  renderNe();
  parent.appendChild(card);
}

export function mountGringoTrapLab(parent){
  if(!parent||typeof GRINGO_TRAPS==="undefined"||!GRINGO_TRAPS.length)return;
  let gtIdx=0;
  const card=document.createElement("section");card.className="bridge-trainer-card gringo-trap-card";
  const renderGt=()=>{
    const g=GRINGO_TRAPS[gtIdx%GRINGO_TRAPS.length];
    card.innerHTML=`<div class="bridge-kicker">🚧 GRINGO-TRAP FIXER · STOP WORD-FOR-WORD TRANSLATIONS</div>
      <div class="bridge-context"><strong>Goal:</strong> ${escapeVocabHtml(g.intent)}</div>
      <div class="gt-compare-grid">
        <div class="gt-box gt-avoid"><span>❌ Literal English Trap</span><strong>${escapeVocabHtml(g.trap)}</strong></div>
        <div class="gt-box gt-local" role="button" tabindex="0"><span>✅ Natural Colombian</span><strong>${escapeVocabHtml(g.local)} 🔊</strong></div>
      </div>
      <div class="tvc-why">💡 ${escapeVocabHtml(g.why)}</div>
      <div class="bridge-actions gt-foot"></div>`;
    const gtLocalEl=card.querySelector(".gt-local");
    const playGt=()=>{markPractice("phrases",g.tts);speak(g.tts,0.8);};
    gtLocalEl.onclick=playGt;
    gtLocalEl.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();playGt();}};
    const foot=card.querySelector(".gt-foot");
    const hear=document.createElement("button");hear.type="button";hear.className="lp-nav-btn primary";hear.textContent="🔊 Hear Local Example";
    hear.onclick=playGt;
    const prev=document.createElement("button");prev.type="button";prev.className="lp-nav-btn";prev.textContent="‹ Prev";
    prev.onclick=()=>{gtIdx=(gtIdx-1+GRINGO_TRAPS.length)%GRINGO_TRAPS.length;renderGt();};
    const next=document.createElement("button");next.type="button";next.className="lp-nav-btn";next.textContent=`Next (${(gtIdx%GRINGO_TRAPS.length)+1}/${GRINGO_TRAPS.length}) ›`;
    next.onclick=()=>{gtIdx=(gtIdx+1)%GRINGO_TRAPS.length;renderGt();};
    const rand=document.createElement("button");rand.type="button";rand.className="lp-nav-btn";rand.textContent="🎲 Random";
    rand.onclick=()=>{const r=Math.floor(Math.random()*GRINGO_TRAPS.length);gtIdx=(r===gtIdx&&GRINGO_TRAPS.length>1)?(r+1)%GRINGO_TRAPS.length:r;renderGt();};
    foot.append(hear,prev,next,rand);
    attachMic(foot,g.tts,"phrases");
  };
  renderGt();
  parent.appendChild(card);
}

var qV102Tab="off",spScore=0,spTotal=0,spItem=null,spFb="";
const SPRINT_BEST_KEY="esco-sprint-best-v102";
export function nextSprintQuestion(){
  const pool=[];
  if(typeof PICTURE_MATCH_BANK!=="undefined")PICTURE_MATCH_BANK.forEach(p=>pool.push({kind:"🖼️ Picture",cue:p.en,tts:p.tts,img:p.img,ans:p.word,pool:PICTURE_MATCH_BANK.map(x=>x.word)}));
  if(typeof GRINGO_TRAPS!=="undefined")GRINGO_TRAPS.forEach(g=>pool.push({kind:"🚫 Local Fix",cue:"Replace \""+g.trap+"\" ("+g.intent+")",tts:g.tts,ans:g.local,pool:GRINGO_TRAPS.map(x=>x.local)}));
  if(typeof RR_BANK!=="undefined"){
    const rrOk=RR_BANK.filter(r=>r&&r.qEn&&r.aEs).slice(0,24);
    const rrAnsPool=rrOk.map(x=>x.aEs);
    rrOk.forEach(r=>pool.push({kind:"⚡ Reflex",cue:r.qEn,subCue:r.qEs,subTts:r.q||r.qEs,tts:r.aTts||r.aEs,ans:r.aEs,pool:rrAnsPool}));
  }
  const pick=pool[Math.floor(Math.random()*pool.length)]||{kind:"⚡ Reflex",cue:"I'll take a black coffee",tts:"Me regala un tinto",ans:"¿Me regala un tinto?",pool:["¿Me regala un tinto?","Con mucho gusto","A la orden","¡De una!"]};
  const alts=[pick.ans];
  for(const cand of pick.pool.slice().sort(()=>Math.random()-0.5)){
    if(alts.length>=4)break;
    if(cand&&!alts.includes(cand))alts.push(cand);
  }
  for(const fb of ["¡De una!","Con mucho gusto","A la orden","¿Me regala un tinto?"]){
    if(alts.length>=4)break;
    if(!alts.includes(fb))alts.push(fb);
  }
  pick.opts=alts.sort(()=>Math.random()-0.5);
  return pick;
}
export function renderQuizV102Hub(){
  const host=document.getElementById("quiz-v102-hub");if(!host)return;
  const pq=document.getElementById("page-quiz");
  if(pq)pq.classList.toggle("v102-solo",qV102Tab!=="off");
  host.innerHTML="";
  const bar=document.createElement("div");bar.className="qv102-bar";
  const pmCount=typeof PICTURE_MATCH_BANK!=="undefined"?PICTURE_MATCH_BANK.length:20;
  [["off","📝 Standard Quiz"],["picture",`🖼️ Picture Match (${pmCount})`],["sprint","⏱️ 60s Fluency Sprint"]].forEach(([tid,lbl])=>{
    const b=document.createElement("button");b.type="button";b.className="mf-chip"+(qV102Tab===tid?" active":"");
    b.textContent=lbl;
    b.onclick=()=>{
      if(tid!=="sprint"&&appState.spTimer){clearInterval(appState.spTimer);appState.spTimer=null;appState.spRunning=false;}
      qV102Tab=tid;renderQuizV102Hub();
    };
    bar.appendChild(b);
  });
  host.appendChild(bar);
  if(qV102Tab==="picture"){
    const pmSlot=document.createElement("div");pmSlot.className="qv102-panel";
    renderPictureMatchDeck(pmSlot);
    host.appendChild(pmSlot);
  }else if(qV102Tab==="sprint"){
    const spWrap=document.createElement("div");spWrap.className="qv102-panel sprint-panel";
    const best=Number(appStorage.getItem(SPRINT_BEST_KEY)||0);
    if(!appState.spRunning&&appState.spLeft===60){
      spWrap.innerHTML=`<div class="quiz-score-bar sprint-score-bar">
          <div class="qs-item"><div class="qs-num" style="color:var(--teal)">60s</div><div class="qs-label">Clock</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--gold)">🏆 ${best}</div><div class="qs-label">Best</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--muted)">4</div><div class="qs-label">Choices</div></div>
        </div>
        <div class="quiz-card sprint-intro-card">
          <div class="qc-label">⏱️ 60-Second Colombian Fluency Sprint</div>
          <div class="qc-word sprint-cue-word">Rapid Mixed Blitz</div>
          <div class="sprint-intro-desc">Mixes Picture Match, Gringo-Trap swaps &amp; Reacción Rápida against the 60s clock.</div>
          <button type="button" class="quiz-next sprint-start-btn">▶ Start 60s Sprint</button>
        </div>`;
      spWrap.querySelector(".sprint-start-btn").onclick=()=>{
        appState.spRunning=true;appState.spLeft=60;spScore=0;spTotal=0;spFb="";spItem=nextSprintQuestion();
        if(appState.spTimer)clearInterval(appState.spTimer);
        appState.spTimer=setInterval(()=>{
          appState.spLeft--;
          if(appState.spLeft<=0){clearInterval(appState.spTimer);appState.spTimer=null;appState.spRunning=false;if(spScore>best)try{appStorage.setItem(SPRINT_BEST_KEY,String(spScore));}catch(e){}}
          renderQuizV102Hub();
        },1000);
        renderQuizV102Hub();
      };
    }else if(!appState.spRunning&&appState.spLeft<=0){
      const updatedBest=Math.max(best,spScore);
      spWrap.innerHTML=`<div class="quiz-score-bar sprint-score-bar">
          <div class="qs-item"><div class="qs-num" style="color:var(--teal)">${spScore}</div><div class="qs-label">Correct</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--gold)">🏆 ${updatedBest}</div><div class="qs-label">Best</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--muted)">${spTotal}</div><div class="qs-label">Answered</div></div>
        </div>
        <div class="quiz-card sprint-intro-card">
          <div class="qc-label">🏁 Sprint Complete!</div>
          <div class="qc-word sprint-cue-word">${spScore} / ${spTotal} Correct</div>
          <div class="sprint-intro-desc">Personal best: ${updatedBest}. Jump right back in to beat your speed!</div>
          <button type="button" class="quiz-next sprint-again-btn">↻ Sprint Again (60s)</button>
        </div>`;
      spWrap.querySelector(".sprint-again-btn").onclick=()=>{appState.spLeft=60;spScore=0;spTotal=0;spFb="";renderQuizV102Hub();};
    }else{
      const q=spItem||(spItem=nextSprintQuestion());
      const fbTone=spFb.startsWith("✅")?"var(--teal)":(spFb?"var(--pink)":"var(--muted)");
      spWrap.innerHTML=`<div class="quiz-score-bar sprint-score-bar">
          <div class="qs-item"><div class="qs-num${appState.spLeft<=10?" sprint-urgent":""}" style="color:var(--gold)">${appState.spLeft}s</div><div class="qs-label">Time Left</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--teal)">${spScore}/${spTotal}</div><div class="qs-label">Score</div></div>
          <div class="qs-item"><div class="qs-num" style="color:var(--muted)">🏆 ${Math.max(best,spScore)}</div><div class="qs-label">Best</div></div>
          <button type="button" class="sprint-stop-pill" aria-label="Stop 60s sprint">⏹ Stop</button>
        </div>
        <div class="quiz-card sprint-quiz-card">
          <div class="qc-label">${escapeVocabHtml(q.kind)}</div>
          ${q.img?`<img class="sprint-thumb" src="${q.img}" alt="${escapeVocabHtml(q.cue)}"/>`:""}
          <div class="qc-word sprint-cue-word">${escapeVocabHtml(q.cue)}</div>
          ${q.subCue?`<div class="sprint-subcue">Asked: «${escapeVocabHtml(q.subCue)}»</div>`:""}
          <button type="button" class="qc-hear sprint-hear-btn">🔊 Hear</button>
        </div>
        <div class="quiz-opts sprint-opts"></div>
        <div class="quiz-feedback sprint-fb" style="color:${fbTone}">${escapeVocabHtml(spFb)}</div>`;
      spWrap.querySelector(".sprint-stop-pill").onclick=()=>{if(appState.spTimer){clearInterval(appState.spTimer);appState.spTimer=null;}appState.spRunning=false;appState.spLeft=60;spFb="";renderQuizV102Hub();};
      spWrap.querySelector(".sprint-hear-btn").onclick=()=>speak(q.subTts||q.tts,0.85);
      const oWrap=spWrap.querySelector(".sprint-opts");
      q.opts.forEach(opt=>{
        const b=document.createElement("button");b.type="button";b.className="qopt";b.textContent=opt;
        b.onclick=()=>{
          spTotal++;
          if(opt===q.ans){spScore++;spFb="✅ +1 · "+q.ans;speak(q.tts,0.9);}
          else{spFb="⚠️ Local answer: "+q.ans;speak(q.tts,0.85);}
          spItem=nextSprintQuestion();renderQuizV102Hub();
        };
        oWrap.appendChild(b);
      });
    }
    host.appendChild(spWrap);
  }
}
export function openQuizV102Tab(tab){
  qV102Tab=tab||"sprint";
  renderQuizV102Hub();
  const h=document.getElementById("quiz-v102-hub");
  if(h)h.scrollIntoView({behavior:"smooth",block:"start"});
}


export function stopActiveSprint() {
  if (appState.spTimer) {
    clearInterval(appState.spTimer);
    appState.spTimer = null;
  }
  appState.spRunning = false;
  appState.spLeft = 60;
  renderQuizV102Hub();
}
export function resumeQuizListeningAudio() {
  if (!appState.an && appState.cQ && (appState.qMode === "listening" || appState.cQ.kind === "listening" || appState.qMode === "dictation")) {
    speak(appState.cQ.tts, 0.7);
  }
}
export function openReviewSession() {
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
      appState.qC=0;appState.qT=0;appState.qS=0;appState.repasoLeft=0;appState.qMissedOnly=false;qStore={c:0,t:0,s:0,missed:{}};srsStore={};saveQ();saveSrs();
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
    qmw.parentElement.parentElement.insertBefore(blitzWrap, qmw.parentElement);
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
  nQ();
}
