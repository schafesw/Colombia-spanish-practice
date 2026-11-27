import {
  VERB_VERSATILITY_ENGINE, REFLEXIVOS, GRAMMAR,
} from "../../data/index.js";
import { userPrefs, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { markPractice, recordSrs } from "../core/stores.js";
import {
  PRONOMBRES_QUIZ, mountMiniGrammarLab, appendGramQuickCheck,
  buildPronombres, applyHablarTab, buildSpeakingGuide,
} from "./hablar-labs.js";
export { buildSpeakingGuide, PRONOMBRES_QUIZ };

export function buildVerbVersatilityLab(sec){
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
      const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(i===vvIdx?" active":"");b.setAttribute("role","tab");b.setAttribute("aria-selected",i===vvIdx?"true":"false");b.tabIndex=i===vvIdx?0:-1;
      b.textContent=v.label;
      b.onclick=()=>{vvIdx=i;vvRevealSet.clear();if(vvMode==="quiz")pickQuizTarget();renderLab();};
      vWrap.appendChild(b);
    });
    const pWrap=lab.querySelector(".vv-person-tabs");
    personsMeta.forEach(([pk,plbl])=>{
      const b=document.createElement("button");b.type="button";b.className="mf-chip"+(pk===vvPerson?" active":"");b.setAttribute("role","tab");b.setAttribute("aria-selected",pk===vvPerson?"true":"false");b.tabIndex=pk===vvPerson?0:-1;
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
const TRUCOS_TTS=[
  "Vaca, boca, vamos, bueno.",
  "Hablé, comió, fue.",
  "Voy a comer ahora.",
  "Soy alto, estoy cansado.",
  "Ayer fui al mercado.",
  "Yo hablo, como, tengo.",
  "Hola, hotel, hacer, huevo.",
  "Sí quiero. Si llueve, él trae más.",
  "Ustedes hablan español.",
  "Estoy hablando contigo."
];
export const CONTRAST_DRILLS=[
  {id:"ayer-fui",prompt:"Yesterday I went to the market (finished event):",choices:["Ayer fui al mercado","Ayer iba al mercado"],ans:0,why:"Completed single action at a specific time ('ayer') → Preterite (fui)."},
  {id:"nino-cali",prompt:"When I was a kid, I used to live in Cali (background / habit):",choices:["Cuando era niño, vivía en Cali","Cuando fui niño, viví en Cali"],ans:0,why:"Age and ongoing childhood setting → Imperfect (era, vivía)."},
  {id:"mientras-sono",prompt:"While I was cooking, the phone rang (interruption):",choices:["Mientras cocinaba, sonó el teléfono","Mientras cociné, sonaba el teléfono"],ans:0,why:"Background action in progress (cocinaba) interrupted by a sudden event (sonó)."},
  {id:"llovia-mucho",prompt:"Describing the weather when you stepped outside: 'It was raining'",choices:["Estaba lloviendo / Llovía mucho","Llovió todo el día pasado"],ans:0,why:"Setting the scene or weather in progress → Imperfect (llovía / estaba lloviendo)."},
  {id:"tuve-tiempo",prompt:"I had time yesterday and finished the errands (bounded event):",choices:["Ayer tuve tiempo","Ayer tenía tiempo siempre"],ans:0,why:"Seen as a bounded, completed fact ('ayer') → Preterite (tuve)."}
];
export const SUBJUNCTIVE_DRILLS=[
  {id:"espero-vengas",prompt:"I hope you come to the party: 'Espero que ___ a la fiesta.'",choices:["vengas","vienes","viniste"],ans:0,why:"'Espero que' expresses wish/hope with a subject change → Subjunctive (vengas)."},
  {id:"quiero-tengas",prompt:"I want you to have a great day: 'Quiero que ___ un buen día.'",choices:["tengas","tienes","tuviste"],ans:0,why:"Wish + 'que' + new subject → present subjunctive drops -o from 'tengo' → tengas."},
  {id:"ojala-pueda",prompt:"Hopefully it doesn't rain later: 'Ojalá no ___ más tarde.'",choices:["llueva","llueve","llovió"],ans:0,why:"'Ojalá' ALWAYS triggers the subjunctive in Spanish."},
  {id:"cuando-llegues",prompt:"Call me when you arrive in Bogotá (future event): 'Cuando ___ a Bogotá, llámame.'",choices:["llegues","llegas","llegaste"],ans:0,why:"'Cuando' + an action that hasn't happened yet → Subjunctive (llegues)."},
  {id:"importante-hables",prompt:"It's important that you speak slowly: 'Es importante que ___ despacio.'",choices:["hables","hablas","hablaste"],ans:0,why:"Impersonal recommendation ('Es importante que…') triggers subjunctive (-AR swaps to -es → hables)."}
];
export function buildGram(id,data){
  const sec=document.getElementById("gs-"+id);sec.innerHTML="";
  if(id==="trucos"){
    const intro=document.createElement("div");intro.className="gram-intro";
    intro.innerHTML=`<div class="gram-intro-title">🧠 Memory Tricks for Colombian Spanish</div>
      <div class="gram-intro-text">Learn these patterns and tap any card to hear the example out loud.</div>`;
    sec.appendChild(intro);
    data.forEach((trick,i)=>{
      const item=document.createElement("div");item.className="trick-list-item";item.style.cursor="pointer";
      const sampleTts=TRUCOS_TTS[i]||trick.main;
      item.innerHTML=`<div class="trick-num">${i+1}</div>
        <div class="trick-item-text"><div class="trick-item-main">${trick.icon} ${trick.main} <span class="col-spk">🔊</span></div><div class="trick-item-sub">${trick.sub}</div></div>`;
      item.onclick=()=>speak(sampleTts,0.78);
      sec.appendChild(item);});return;
  }
  if(id==="pronombres"){buildPronombres(sec);return;}
  if(id==="reflexivos"){buildReflexivos(sec);return;}
  if(id==="voseo"){buildVoseoLab(sec);return;}
  if(id==="muletillas"){buildMuletillasLab(sec);return;}
  if(id==="falsos"){buildFalsosAmigosLab(sec);return;}
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
  if(id==="pasado-contraste")mountMiniGrammarLab(sec,"🎞️ Preterite vs. Imperfect",CONTRAST_DRILLS,"contraste|");
  if(id==="subjuntivo")mountMiniGrammarLab(sec,"🌱 Subjunctive Trigger Lab",SUBJUNCTIVE_DRILLS,"subj|");
  appendGramQuickCheck(sec,data.examples);
}
const VOSEO_COMPARISONS=[
  {en:"How are you?",usted:"¿Usted cómo está?",tu:"¿Tú cómo estás?",vos:"¿Vos cómo estás?"},
  {en:"Come here!",usted:"¡Venga!",tu:"¡Ven!",vos:"¡Vení!"},
  {en:"Tell me / What happened?",usted:"Cuénteme",tu:"Cuéntame",vos:"Contame"},
  {en:"Do you want a coffee?",usted:"¿Quiere un tinto?",tu:"¿Quieres un tinto?",vos:"¿Querés un tinto?"},
  {en:"Go ahead / Do it!",usted:"Hágale pues",tu:"Hazlo pues",vos:"Hacelo pues"},
  {en:"Don't worry",usted:"No se preocupe",tu:"No te preocupes",vos:"No te preocupés"}
];
export const VOSEO_SITUATIONS=[
  {id:"bogota-taxi",q:"Grabbing an Uber or talking to an adult stranger in Bogotá",choices:["Usted (warm & normal in Bogotá)","Vos (standard in Bogotá)","Tú (only for bosses in Bogotá)"],ans:0,why:"In Bogotá and Boyacá, 'usted' is the everyday warm default — even friends and couples use 'su merced' or 'usted' without sounding stiff."},
  {id:"sanjuan-friend",q:"Texting a close friend in San Juan del Cesar, La Guajira",choices:["Tú (standard on La Costa)","Vos (Paisa only)","Su merced"],ans:0,why:"On Colombia's Caribbean coast (La Guajira, Barranquilla, Cartagena), 'tú' flows naturally with friends and family."},
  {id:"medellin-come",q:"A Paisa friend in Medellín calls you over: 'Come here!'",choices:["¡Vení pues! (vos)","¡Venga usted pues!","¡Venís vosotros!"],ans:0,why:"Antioquia and Valle del Cauca drop final -s/stress the ending on vos commands: Vení, Decime, Mirá, Sentate."},
  {id:"cali-want",q:"Ordering casually with a friend in Cali: 'Do you want empanadas?'",choices:["¿Querés empanadas? (vos)","¿Quiere empanadas tú?","¿Queréis empanadas?"],ans:0,why:"Cali & Medellín use Rioplatense-style stressed present endings for vos: querés, tenés, podés, sabés (never 'queréis')."},
  {id:"family-abuela",q:"Greeting your Colombian partner's grandmother for the first time",choices:["¿Cómo está usted, señora?","¿Vos qué más?","¿Tú qué haces?"],ans:0,why:"Always use 'usted' with elders, grandparents, and first-time family introductions across every region of Colombia."}
];
const MULETILLAS_BANK=[
  {w:"Pues",meaning:"well / so / then (softener & flow glue)",ex:"Pues, vamos a ver qué hay en el menú.",en:"Well, let's see what's on the menu."},
  {w:"O sea",meaning:"I mean / in other words",ex:"O sea, nos vemos a las tres en la tienda.",en:"I mean, we'll meet at three at the shop."},
  {w:"Es que…",meaning:"it's just that… / the thing is… (polite excuse)",ex:"Es que todavía estoy aprendiendo español.",en:"It's just that I'm still learning Spanish."},
  {w:"Mejor dicho",meaning:"or rather / put simply",ex:"Hace mucho calor, mejor dicho, ¡qué bochorno!",en:"It's super hot — or rather, what humidity!"},
  {w:"A ver",meaning:"let's see… (buying 2 seconds while thinking)",ex:"A ver… deme dos pandebonos y un tinto.",en:"Let's see… give me two pandebonos and a black coffee."},
  {w:"Ni modo",meaning:"oh well / can't help it",ex:"Está lloviendo duro; ni modo, pedimos Uber.",en:"It's raining hard; oh well, let's order an Uber."},
  {w:"De una",meaning:"for sure / right away / sounds good!",ex:"¿Tomamos un café ahorita? — ¡De una!",en:"Shall we grab a coffee right now? — For sure!"},
  {w:"Por si las moscas",meaning:"just in case ('in case of flies')",ex:"Lleva sombrilla por si las moscas.",en:"Bring an umbrella just in case."}
];
export const MULETILLAS_QUIZ=[
  {id:"flow-a-ver",prompt:"You need 2 seconds to check the bakery case before ordering:",choices:["A ver… deme una almojábana.","Por si las moscas… deme una almojábana.","Ni modo… deme una almojábana."],ans:0,why:"'A ver…' ('let's see…') buys natural thinking time in every Colombian conversation."},
  {id:"flow-es-que",prompt:"Politely explain why you spoke slowly: 'The thing is I'm still practicing.'",choices:["Es que todavía estoy practicando.","Mejor dicho todavía estoy practicando.","De una todavía estoy practicando."],ans:0,why:"'Es que…' ('it's just that…') softens explanations and polite excuses without sounding blunt."},
  {id:"flow-o-sea",prompt:"Clarifying what you meant ('I mean, tomorrow morning, not tonight'):",choices:["O sea, mañana por la mañana.","Ni modo, mañana por la mañana.","Pues ya qué, mañana por la mañana."],ans:0,why:"'O sea' means 'I mean / in other words' when rephrasing your point."},
  {id:"flow-ni-modo",prompt:"The bus just pulled away — shrug and accept it naturally:",choices:["Ni modo, esperamos el siguiente.","De una, esperamos el siguiente.","A ver, esperamos el siguiente."],ans:0,why:"'Ni modo' = 'oh well / nothing we can do about it'."},
  {id:"flow-moscas",prompt:"Tell a friend to pack a jacket 'just in case' in Bogotá:",choices:["Lleva chaqueta por si las moscas.","Lleva chaqueta o sea.","Lleva chaqueta a ver."],ans:0,why:"'Por si las moscas' is the quintessential Colombian expression for 'just in case'."},
  {id:"flow-de-una",prompt:"Friend asks '¿Vamos por un tinto?' — answer enthusiastically 'I'm down / for sure!'",choices:["¡De una!","¡Es que!","¡Ni modo!"],ans:0,why:"'¡De una!' means 'right away / count me in / for sure!' across Colombia."}
];
export function buildMuletillasLab(sec){
  sec.innerHTML="";
  const intro=document.createElement("div");intro.className="gram-intro";
  intro.innerHTML=`<div class="gram-intro-title">🔗 Muletillas & Conversational Flow</div>
    <div class="gram-intro-text">Stop translating word-for-word in your head — use the natural Colombian connector words that buy thinking time and make sentences flow.</div>`;
  sec.appendChild(intro);
  const grid=document.createElement("div");grid.className="muletillas-grid";
  MULETILLAS_BANK.forEach(item=>{
    const c=document.createElement("button");c.type="button";c.className="muletilla-card";
    c.innerHTML=`<div class="muletilla-top"><strong>${escapeVocabHtml(item.w)}</strong><span>🔊</span></div>
      <div class="muletilla-mean">${escapeVocabHtml(item.meaning)}</div>
      <div class="muletilla-ex">💬 ${escapeVocabHtml(item.ex)}</div>
      <div class="muletilla-en">${escapeVocabHtml(item.en)}</div>`;
    c.onclick=()=>{markPractice("phrases",item.ex);speak(item.ex,0.78);};
    grid.appendChild(c);
  });
  sec.appendChild(grid);
  mountMiniGrammarLab(sec,"🔗 Pick the Natural Connector",MULETILLAS_QUIZ,"flow|");
}
const FALSOS_AMIGOS_BANK=[
  {w:"Embarazada",trap:"embarrassed ❌",real:"pregnant ✅ (use 'qué pena' or 'avergonzado/a' for embarrassed)",ex:"Qué pena contigo, llegué tarde.",en:"So sorry / embarrassed, I arrived late."},
  {w:"Éxito",trap:"exit ❌",real:"success / hit ✅ (exit = salida)",ex:"La cena fue un éxito total; ¿dónde queda la salida?",en:"Dinner was a total success; where is the exit?"},
  {w:"Actualmente",trap:"actually ❌",real:"currently / nowadays ✅ (actually = en realidad / de hecho)",ex:"Actualmente vivo en Bogotá, pero en realidad soy de Texas.",en:"Currently I live in Bogotá, though actually I'm from Texas."},
  {w:"Soportar",trap:"support ❌",real:"to put up with / tolerate ✅ (support = apoyar)",ex:"Apoyo tu idea, pero no soporto este trancón.",en:"I support your idea, but I can't stand this traffic jam."},
  {w:"Carpeta",trap:"carpet ❌",real:"folder ✅ (carpet = alfombra / tapete)",ex:"Guarda el pasaporte en la carpeta azul.",en:"Keep the passport in the blue folder."},
  {w:"Realizar",trap:"realize ❌",real:"to carry out / achieve ✅ (realize = darse cuenta)",ex:"Me di cuenta de que ya realizamos el pago por Nequi.",en:"I realized that we already completed the Nequi payment."},
  {w:"Constipado",trap:"constipated ❌",real:"stuffed-up / having a cold ✅ (often 'resfriado' or 'con gripa' in Colombia)",ex:"Tengo gripa y estoy un poco congestionado por la lluvia.",en:"I have a cold and I'm a bit congested from the rain."},
  {w:"Asistir",trap:"assist ❌",real:"to attend ✅ (assist = ayudar / atender)",ex:"Voy a asistir a la reunión y luego te ayudo con las maletas.",en:"I'm going to attend the meeting and then I'll help you with the bags."}
];
export const FALSOS_AMIGOS_QUIZ=[
  {id:"falso-embarazada",prompt:"You accidentally bumped someone's coffee in a café. How do you say 'I'm so embarrassed'?",choices:["Qué pena, qué vergüenza contigo.","Estoy muy embarazado contigo.","Es un éxito contigo."],ans:0,why:"'Embarazada' means pregnant! Use 'qué pena' or 'qué vergüenza' for embarrassed."},
  {id:"falso-exito",prompt:"Looking for the building exit (NOT a Colombian supermarket called Éxito):",choices:["Disculpe, ¿dónde está la salida?","Disculpe, ¿dónde está el éxito?","Disculpe, ¿dónde está la carpeta?"],ans:0,why:"'Salida' = exit; 'éxito' = success (and also Colombia's big supermarket chain!)."},
  {id:"falso-actualmente",prompt:"Correcting a gentle misunderstanding ('Actually, I prefer black coffee'):",choices:["En realidad prefiero el tinto sin azúcar.","Actualmente prefiero el tinto sin azúcar.","Realizo prefiero el tinto sin azúcar."],ans:0,why:"'Actualmente' means 'currently / right now'. Use 'en realidad' or 'de hecho' for 'actually'."},
  {id:"falso-soportar",prompt:"Telling your partner 'I support your decision 100%':",choices:["Apoyo tu decisión al cien por ciento.","Soporto tu decisión al cien por ciento.","Asisto tu decisión al cien por ciento."],ans:0,why:"'Apoyar' = support/back up. 'Soportar' means to endure or tolerate ('no soporto el ruido')."},
  {id:"falso-carpeta",prompt:"Asking for the rug / carpet at a home store in Medellín:",choices:["Busco un tapete o una alfombra para la sala.","Busco una carpeta para la sala.","Busco una salida para la sala."],ans:0,why:"'Carpeta' is a paper/digital folder. For a rug or carpet, say 'tapete' or 'alfombra'."},
  {id:"falso-realizar",prompt:"Saying 'I just realized I left my charger at the Airbnb':",choices:["Acabo de darme cuenta de que dejé el cargador.","Acabo de realizar que dejé el cargador.","Acabo de asistir que dejé el cargador."],ans:0,why:"'Darse cuenta' = to realize / notice. 'Realizar' means to carry out or complete a task."},
  {id:"falso-constipado",prompt:"If you hear someone say 'estoy constipado' in Spanish, what do they normally mean?",choices:["They have a stuffy nose / head cold","They are very embarrassed","They are currently busy"],ans:0,why:"'Constipado' normally means nasal congestion / a head cold (for tummy trouble, use 'estreñido' or 'mal del estómago')."},
  {id:"falso-asistir",prompt:"Asking a hotel clerk to assist/help you carry your luggage:",choices:["¿Me puede ayudar con las maletas, por favor?","¿Me puede asistir a la cena con las maletas?","¿Me puede soportar las maletas?"],ans:0,why:"'Asistir a' means 'to attend' an event. Use 'ayudar' to ask someone to help/assist you."}
];
export function buildFalsosAmigosLab(sec){
  sec.innerHTML="";
  const intro=document.createElement("div");intro.className="gram-intro";
  intro.innerHTML=`<div class="gram-intro-title">⚠️ Falsos Amigos (False Friends)</div>
    <div class="gram-intro-text">Spanish words that look identical to English — but mean something completely different. Tap any card to hear the safe Colombian phrasing.</div>`;
  sec.appendChild(intro);
  const grid=document.createElement("div");grid.className="muletillas-grid";
  FALSOS_AMIGOS_BANK.forEach(item=>{
    const c=document.createElement("button");c.type="button";c.className="muletilla-card";
    c.innerHTML=`<div class="muletilla-top"><strong>${escapeVocabHtml(item.w)}</strong><span>🔊</span></div>
      <div class="muletilla-mean">Not ${escapeVocabHtml(item.trap)} → ${escapeVocabHtml(item.real)}</div>
      <div class="muletilla-ex">💬 ${escapeVocabHtml(item.ex)}</div>
      <div class="muletilla-en">${escapeVocabHtml(item.en)}</div>`;
    c.onclick=()=>{markPractice("phrases",item.ex);speak(item.ex,0.78);};
    grid.appendChild(c);
  });
  sec.appendChild(grid);
  mountMiniGrammarLab(sec,"⚠️ Spot the False Friend",FALSOS_AMIGOS_QUIZ,"falso|");
}
export function buildVoseoLab(sec){
  sec.innerHTML="";
  const intro=document.createElement("div");intro.className="gram-intro";
  intro.innerHTML=`<div class="gram-intro-title">🇨🇴 Usted vs. Tú vs. Vos in Colombia</div>
    <div class="gram-intro-text">Colombia uses all three "you" forms depending on city and closeness. Tap a region below to flip real phrases and hear the difference.</div>`;
  sec.appendChild(intro);
  let activeReg="usted";
  const regTabs=[
    ["usted","🏔️ Bogotá · Usted","Warm everyday default & respect nationwide"],
    ["tu","🌴 La Costa · Tú","Natural with friends in San Juan, Barranquilla & Cartagena"],
    ["vos","🌸 Paisa / Cali · Vos","Medellín & Cali everyday stress shift (querés, vení)"]
  ];
  const card=document.createElement("section");card.className="bridge-trainer-card";
  const tabRow=document.createElement("div");tabRow.className="reg-tabs-row";
  const note=document.createElement("div");note.className="bridge-context";note.style.marginTop="8px";
  const matrix=document.createElement("div");matrix.className="voseo-matrix";
  const drawMatrix=()=>{
    tabRow.innerHTML="";
    regTabs.forEach(([id,lbl,desc])=>{
      const b=document.createElement("button");b.type="button";b.className="reg-tab-btn"+(activeReg===id?" active":"");
      b.textContent=lbl;
      b.onclick=()=>{activeReg=id;drawMatrix();};
      tabRow.appendChild(b);
      if(activeReg===id)note.textContent=desc;
    });
    matrix.innerHTML="";
    VOSEO_COMPARISONS.forEach(item=>{
      const row=document.createElement("div");row.className="voseo-matrix-row";
      const mainPhrase=item[activeReg];
      row.innerHTML=`<div class="voseo-main"><span class="voseo-en">${escapeVocabHtml(item.en)}</span><button type="button" class="voseo-play-main">${escapeVocabHtml(mainPhrase)} 🔊</button></div>
        <div class="voseo-mini-pills"></div>`;
      row.querySelector(".voseo-play-main").onclick=()=>{markPractice("phrases",mainPhrase);speak(mainPhrase,0.8);};
      const pills=row.querySelector(".voseo-mini-pills");
      [["usted","Ud."],["tu","Tú"],["vos","Vos"]].forEach(([k,shortLbl])=>{
        const pb=document.createElement("button");pb.type="button";pb.className="voseo-pill"+(k===activeReg?" active":"");
        pb.textContent=`${shortLbl}: ${item[k]}`;
        pb.onclick=()=>{markPractice("phrases",item[k]);speak(item[k],0.8);};
        pills.appendChild(pb);
      });
      matrix.appendChild(row);
    });
  };
  drawMatrix();
  card.append(tabRow,note,matrix);
  sec.appendChild(card);

  // Situational register check
  let si=0,sScore=0;
  const quizCard=document.createElement("section");quizCard.className="bridge-trainer-card";
  const drawQuiz=()=>{
    const q=VOSEO_SITUATIONS[si%VOSEO_SITUATIONS.length];
    quizCard.innerHTML=`<div class="bridge-head"><div><div class="bridge-title">🧭 Which Form Fits? · ${(si%VOSEO_SITUATIONS.length)+1}/${VOSEO_SITUATIONS.length}</div><div class="bridge-sub">${escapeVocabHtml(q.q)}</div></div><div class="bridge-score">${sScore}/${si}</div></div>`;
    const opts=document.createElement("div");opts.className="bridge-opts vq-opts";
    const fb=document.createElement("div");fb.className="bridge-fb";
    const nxt=document.createElement("button");nxt.type="button";nxt.className="bridge-next";nxt.hidden=true;nxt.textContent="Next scenario →";
    nxt.onclick=()=>{si++;drawQuiz();};
    q.choices.forEach((c,idx)=>{
      const b=document.createElement("button");b.type="button";b.className="bridge-opt";b.textContent=c;
      b.onclick=()=>{
        if(!nxt.hidden)return;
        const ok=idx===q.ans;
        if(ok)sScore++;
        b.classList.add(ok?"ok":"no");
        if(!ok)opts.children[q.ans]?.classList.add("ok");
        Array.from(opts.children).forEach(x=>x.disabled=true);
        recordSrs("voseo|"+q.id,ok);
        fb.textContent=(ok?"✅ ":"❌ ")+q.why;
        const sc=quizCard.querySelector(".bridge-score");if(sc)sc.textContent=sScore+"/"+(si+1);
        nxt.hidden=false;
      };
      opts.appendChild(b);
    });
    quizCard.append(opts,fb,nxt);
  };
  drawQuiz();
  sec.appendChild(quizCard);
}
export function buildReflexivos(sec){
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
    exDiv.innerHTML=`<div style="font-size:0.9rem;font-weight:700;color:var(--text)">${verb.example.es}</div>
      <div style="font-size:0.72rem;color:var(--muted);font-style:italic;margin-top:3px">${verb.example.en} 🔊</div>`;
    exDiv.onclick=()=>speak(verb.example.es,0.75);card.appendChild(exDiv);
    sec.appendChild(card);});
  appendGramQuickCheck(sec,REFLEXIVOS.map(v=>v.example));
}
/* Grouped grammar navigation (v23): Tiempos / Pronombres / Patrones */
export const GRAM_GROUPS={regiones:{label:"🗺️ Regiones",items:[["estructura","🗺️ Regiones"]]},posters:{label:"🖼️ Posters",items:[["estructura","🖼️ Posters"]]},
  tiempos:{label:"⏱️ Tiempos",items:[["presente","⚡ Presente"],["pasado","⏮️ Pasado"],["pasado-contraste","🎞️ Evento vs. contexto"],["futuro","⏭️ Futuro"],["perfecto","✅ He hecho"],["condicional","🙏 Haría / podría"],["pasado-perfecto","⏪ Había hecho"],["futuro-perfecto","⏩ Habré hecho"]]},
  pronombres:{label:"👤 Pronombres",items:[["pronombres","Lo / La / Le"]]},
  patrones:{label:"🧩 Patrones",items:[["voseo","🇨🇴 Usted · Tú · Vos"],["muletillas","🔗 Muletillas & Flow"],["falsos","⚠️ Falsos Amigos"],["reflexivos","🔄 Reflexivos"],["subjuntivo","🌱 Subjuntivo"],["trucos","🧠 Trucos"]]},
  estructura:{label:"🧱 Hablar",items:[["estructura","🧱 Estructura"]]}
};
let gramGroup="regiones",gramSection="estructura";
export function showGramGroup(g){
  gramGroup=g;
  document.querySelectorAll(".ggroup").forEach(b=>b.classList.toggle("active",b.dataset.g===g));if(typeof applyHablarTab==="function"){if(g==="regiones")applyHablarTab("regions");else if(g==="posters")applyHablarTab("visual");else if(g==="estructura"&&(userPrefs.hablarTab==="regions"||userPrefs.hablarTab==="visual"))applyHablarTab("ear");}
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
export function showGram(id){
  gramSection=id;
  ["presente","pasado","pasado-contraste","futuro","perfecto","condicional","pasado-perfecto","futuro-perfecto","pronombres","reflexivos","voseo","muletillas","falsos","subjuntivo","trucos","estructura"].forEach(g=>{
    document.getElementById("gs-"+g).classList.toggle("active",g===id);
  });
  const sub=document.getElementById("gram-sub");
  if(sub){
    const items=GRAM_GROUPS[gramGroup].items;
    Array.from(sub.children).forEach((b,i)=>b.classList.toggle("active",items[i]&&items[i][0]===id));
  }
}


export function initGuides() {
  ["presente","pasado","pasado-contraste","futuro","perfecto","condicional","pasado-perfecto","futuro-perfecto","subjuntivo","trucos"].forEach(id=>buildGram(id,GRAMMAR[id]));
  buildGram("pronombres");
  buildGram("reflexivos");
  buildGram("voseo");
  buildGram("muletillas");
  buildGram("falsos");
  buildSpeakingGuide();
  showGramGroup("regiones");
}
