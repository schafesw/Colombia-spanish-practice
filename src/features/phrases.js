import {
  FRASES, CONVERSATIONS, BRANCHING_ROLEPLAYS, CONVERSATION_CURVEBALLS,
  COLOMBIAN_STORIES, ROLEPLAY_IMAGES,
} from "../../data/index.js";
import { appStorage } from "../state/storage.js";
import { appState } from "../state/app-state.js";
import { userPrefs, saveUserPrefs, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml, lpEl } from "../core/text-utils.js";
import { markPractice, practiced, phraseProgress, recordSrs, attachStarBtn } from "../core/stores.js";
import { attachMic, openMicPanel } from "../core/speech-mic.js";
import { PHRASE_DIALOGUES } from "../core/quiz-bank.js";
import { actions, showPage } from "./navigation.js";

let fl=null;
/* Each menu entry keeps its versions separate so Ahora / Planes / Ayer all display */
let fraseSearchTerm="";
let fraseView="all";

const TENSE_BADGE={
  "Ahora":{txt:"⚡ Ahora · presente",css:"color:var(--teal);background:rgba(74,168,160,0.12);border:1px solid rgba(74,168,160,0.25)"},
  "Planes":{txt:"⏭️ Planes · voy a...",css:"color:var(--blue);background:rgba(96,165,250,0.12);border:1px solid rgba(96,165,250,0.25)"},
  "Ayer":{txt:"⏮️ Ayer · pasado",css:"color:var(--pink);background:rgba(232,93,117,0.12);border:1px solid rgba(232,93,117,0.25)"},
};
export const PHRASE_EN={
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
export const DIALOGUE_EN={
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
export function phraseEnglishTitle(title){return PHRASE_EN[title]||"Useful phrases";}
export function dialogueEnglishTitle(title){return DIALOGUE_EN[title]||"Practice conversation";}
const PHRASE_RECENT_KEY="esco-frase-recent-v1";
let fraseRecent=[];
try{fraseRecent=JSON.parse(appStorage.getItem(PHRASE_RECENT_KEY)||"[]");if(!Array.isArray(fraseRecent))fraseRecent=[];}catch(e){fraseRecent=[];}
export function rememberFraseLocation(location){
  if(!location||!location.kind)return;
  fraseRecent=[location,...fraseRecent.filter(x=>!(x.kind===location.kind&&String(x.value)===String(location.value)))].slice(0,3);
  try{appStorage.setItem(PHRASE_RECENT_KEY,JSON.stringify(fraseRecent));}catch(e){}
}
export function renderRecentPhrase(root){
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
export function fraseSectionMeta(sec){
  const m=String(sec.section||"").match(/^(\S+)\s+(.*)$/);
  return m?{icon:m[1],name:m[2]}:{icon:"💬",name:sec.section||""};
}
export function phraseCollectionGroup(sec){
  const n=String(sec.section||"").toLowerCase();
  if(/groser|bad word|strong language/.test(n))return {id:"strong",label:"⚠️ Strong language / Entender primero"};
  if(/aeropuerto|migración|visa|bancaria|nequi|datáfono|cajero|sim|trámites|portería|rappi|arriendo|airbnb|hogar|reparaciones|recibos|técnico|estratos|conjuntos|barrios|direcciones|cuadras|seguridad|papaya|123|panadería|jugos|corrientazo|ejecutivo|onces|buses|finca|peaje|ubicación|uber|transporte|compras|mercado|restaurante|comer fuera|emergencias|ayuda|aclarar|repetir|plata|pagos|médica|urgencias|odontología|óptica|prepagada|sientes|barbería|peluquería|cortesía/.test(n))return {id:"survival",label:"🧭 Survival, Travel & Services / Para desenvolverse"};
  if(/conectores|patrones|marcos|construir|contar historias|pronombres|acciones|progreso|muletillas|diminutivos|comodín|trampas|falsos amigos/.test(n))return {id:"build",label:"🧱 Sentence Builders & Local Flow / Construir frases"};
  if(/saludo|gusto|conversación diaria|social|amigos|fiesta|puentes|salsa|rumba|partido|fútbol|conciertos|boletas|vaca|san juan|guajira|vallenato|oficina|planes|teléfono|whatsapp|audios|citas|cumplidos|gimnasio|ciclovía|senderos|familia|empatía|reacciones|amistad/.test(n))return {id:"social",label:"🤝 Social, San Juan / Guajira & Daily Life / Conversación diaria"};
  return {id:"other",label:"📚 More useful phrases / Más frases"};
}
export function dialogueSituationGroup(d){
  const t=String(d.title||"").toLowerCase();
  if(/uber|aeropuerto|carro|direcciones|cuadras|seguridad|emergencias|papaya|hotel|transporte|terminal|peajes|finca/.test(t))return {id:"travel",label:"🛬 Travel, Uber, Safety & Getting Around",sub:"Airport, Uber rides, street safety (no dar papaya & 123), buses/fincas, and hotels"};
  if(/restaurante|almuerzo|corrientazo|onces|panadería|jugos|trampas|cancelar|provocar|mercado|tienda|cortesía|pagos|datáfono|nequi|cocina/.test(t))return {id:"food",label:"🍽️ Food, Corrientazo, Trampas & Payments",sub:"Corrientazo lunches, panaderías, false friends (cancelar/provocar), and Nequi"};
  if(/oficina|trabajo|profesión|cajero|sim|trámites|migración|extranjería|bancos|estratos|conjuntos|odontología|óptica|prepagada|reparaciones|recibos|técnico|portería|rappi|arriendo|airbnb|lavadora|whatsapp|notas de voz|barbería|farmacia|médica|casa|habitación|baño|teléfono|comunicación|apartamento/.test(t))return {id:"daily",label:"🏠 Daily Life, Estratos, Repairs & Health",sub:"Migración/banks, estratos/conjuntos, home repairs, dental/optical, and WhatsApp"};
  return {id:"social",label:"🇨🇴 San Juan del Cesar, Social, Rumba & Culture",sub:"San Juan del Cesar & Guajira, dating & family, fútbol/boletas, puentes & salsa"};
}
export function resetFraseScroll(){const sc=document.querySelector(".scroll");if(sc)sc.scrollTop=0;}
export function renderFraseMenu(){
  appState.fraseReturnToLessons=false;
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
  [["all","All / Todo"],["phrases","Phrases / Frases"],["conversations","Conversations"]].forEach(([view,label])=>{
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
        b.tabIndex=idx===rpScenarioIdx?0:-1;
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
  if(typeof actions.mountColombiaChatsLab==="function")actions.mountColombiaChatsLab(conversationGroup);if(typeof actions.mountNaturalEarLab==="function")actions.mountNaturalEarLab(conversationGroup);
  if(typeof actions.mountGringoTrapLab==="function")actions.mountGringoTrapLab(conversationGroup);
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
    conversationGroup.hidden=!showConversations;phraseCollectionsGroup.hidden=!showPhrases;
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
export function renderFraseSection(idx){
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
  if(!sec){return;}
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
export function returnFromFraseDialogue(){
  const returnToLessons=appState.fraseReturnToLessons;
  appState.fraseReturnToLessons=false;
  if(returnToLessons){showPage("lecciones");actions.renderLessons();}
  else renderFraseMenu();
}
export function renderFraseDialogue(dialogue,tense){
  resetFraseScroll();
  fl.dataset.view="dialogue";
  fl.innerHTML="";
  const back=document.createElement("button");
  back.type="button";back.className="phrase-back";
  const returnToLessons=appState.fraseReturnToLessons;
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
  if(actions.routineToday&&actions.routineToday().step===3){
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

// ── Build Lecciones — speaking-first lesson player (v15) ─────────────────────
export function initPhrases() {
  fl = document.getElementById("frases-list");
  renderFraseMenu();
}
