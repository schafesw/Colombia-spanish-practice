import {
  VERB_VERSATILITY_ENGINE, PRONOMBRES, REFLEXIVOS, SPEAKING_GUIDE, GRAMMAR,
  REGIONAL_ATLAS, REGIONAL_SWITCHER, REGION_IMAGES, ROLEPLAY_IMAGES, VISUAL_GUIDES,
  CONNECTOR_BRIDGE_DRILLS, REGISTER_SWITCHER, STREET_GRID_DECODER, CONVERSATION_CURVEBALLS,
  VERBOS_COMODIN, TEXTBOOK_VS_COLOMBIAN, BRANCHING_ROLEPLAYS, STREET_EAR_LINKER,
  TRAMPAS_COLOMBIANAS,
} from "../../data/index.js";
import { appState } from "../state/app-state.js";
import { userPrefs, saveUserPrefs, isBlindEarActive } from "../state/preferences.js";
import { speak } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { markPractice, recordSrs, recordSpeakingError, clearSpeakingError, attachStarBtn } from "../core/stores.js";
import { attachMic } from "../core/speech-mic.js";

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
function appendGramQuickCheck(sec,items){
  const valid=(items||[]).filter(x=>x&&x.es&&x.en);
  if(valid.length<2)return;
  const pool=valid.slice(0,6);
  const picks=pool.slice(0,2);
  let qi=0,score=0,answered=false;
  const card=document.createElement("section");card.className="bridge-trainer-card gram-quick-check";
  const draw=()=>{
    if(qi>=picks.length){
      card.innerHTML=`<div class="bridge-kicker">🧪 QUICK GRAMMAR CHECK</div>
        <div class="gram-qc-done"><strong>${score}/${picks.length} Correct</strong><small>${score===picks.length?"¡Excelente! Pattern locked in.":"Review the pattern above and retry anytime."}</small></div>
        <button type="button" class="lp-nav-btn primary">🔄 Try another 2 questions</button>`;
      card.querySelector("button").onclick=()=>{qi=0;score=0;answered=false;draw();};
      return;
    }
    const target=picks[qi];
    const distractors=pool.filter(x=>x.es!==target.es).sort(()=>Math.random()-0.5).slice(0,2);
    if(distractors.length<2&&typeof SPEAKING_GUIDE!=="undefined"){
      SPEAKING_GUIDE.flatMap(g=>g.examples||[]).forEach(ex=>{if(distractors.length<2&&ex.es&&ex.es!==target.es)distractors.push(ex);});
    }
    const opts=[target,...distractors].slice(0,3).sort(()=>Math.random()-0.5);
    answered=false;
    card.innerHTML=`<div class="bridge-kicker">🧪 QUICK CHECK · ${qi+1} OF ${picks.length}</div>
      <div class="bridge-context">Which Spanish sentence naturally expresses: <strong>“${escapeVocabHtml(target.en)}”</strong>?</div>
      <div class="gram-qc-opts"></div>
      <div class="bridge-feedback" aria-live="polite"></div>
      <div class="bridge-actions"></div>`;
    const oWrap=card.querySelector(".gram-qc-opts"),fb=card.querySelector(".bridge-feedback"),acts=card.querySelector(".bridge-actions");
    opts.forEach(o=>{
      const b=document.createElement("button");b.type="button";b.className="lp-opt";b.textContent=o.es;
      b.onclick=()=>{
        if(answered)return;answered=true;
        const ok=o.es===target.es;
        if(ok){score++;b.classList.add("correct");clearSpeakingError(target.es);markPractice("phrases",target.es);}
        else{b.classList.add("wrong");recordSpeakingError(target.es,"grammar check");oWrap.querySelectorAll(".lp-opt").forEach(x=>{if(x.textContent===target.es)x.classList.add("reveal");});}
        speak(target.tts||target.es,0.78);
        fb.textContent=ok?`✅ ¡Correcto! ${target.es}`:`❌ Natural model: ${target.es}`;
        const nxt=document.createElement("button");nxt.type="button";nxt.className="lp-nav-btn primary";nxt.textContent=qi+1<picks.length?"Next question →":"Finish check →";
        nxt.onclick=()=>{qi++;draw();};
        acts.appendChild(nxt);
      };
      oWrap.appendChild(b);
    });
  };
  draw();
  sec.appendChild(card);
}
export function buildGram(id,data){
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
  if(id==="voseo"){buildVoseoLab(sec);return;}
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
const VOSEO_SITUATIONS=[
  {id:"bogota-taxi",q:"Grabbing an Uber or talking to an adult stranger in Bogotá",choices:["Usted (warm & normal in Bogotá)","Vos (standard in Bogotá)","Tú (only for bosses in Bogotá)"],ans:0,why:"In Bogotá and Boyacá, 'usted' is the everyday warm default — even friends and couples use 'su merced' or 'usted' without sounding stiff."},
  {id:"sanjuan-friend",q:"Texting a close friend in San Juan del Cesar, La Guajira",choices:["Tú (standard on La Costa)","Vos (Paisa only)","Su merced"],ans:0,why:"On Colombia's Caribbean coast (La Guajira, Barranquilla, Cartagena), 'tú' flows naturally with friends and family."},
  {id:"medellin-come",q:"A Paisa friend in Medellín calls you over: 'Come here!'",choices:["¡Vení pues! (vos)","¡Venga usted pues!","¡Venís vosotros!"],ans:0,why:"Antioquia and Valle del Cauca drop final -s/stress the ending on vos commands: Vení, Decime, Mirá, Sentate."},
  {id:"cali-want",q:"Ordering casually with a friend in Cali: 'Do you want empanadas?'",choices:["¿Querés empanadas? (vos)","¿Quiere empanadas tú?","¿Queréis empanadas?"],ans:0,why:"Cali & Medellín use Rioplatense-style stressed present endings for vos: querés, tenés, podés, sabés (never 'queréis')."},
  {id:"family-abuela",q:"Greeting your Colombian partner's grandmother for the first time",choices:["¿Cómo está usted, señora?","¿Vos qué más?","¿Tú qué haces?"],ans:0,why:"Always use 'usted' with elders, grandparents, and first-time family introductions across every region of Colombia."}
];
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
export function buildPronombres(sec){
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
  appendGramQuickCheck(sec,PRONOMBRES.examples);
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
let bridgeDrillIdx=0;
export function applyHablarTab(tabId){
  userPrefs.hablarTab=tabId||"regions";
  saveUserPrefs();
  const sec=document.getElementById("gs-estructura");if(!sec)return;
  sec.querySelectorAll(".hablar-subtab").forEach(b=>{
    const on=b.dataset.tab===userPrefs.hablarTab;
    b.classList.toggle("active",on);
    b.setAttribute("aria-selected",on?"true":"false");b.tabIndex=on?0:-1;
  });
  sec.querySelectorAll("[data-hablar-group]").forEach(el=>{
    el.hidden=(userPrefs.hablarTab!=="all"&&el.dataset.hablarGroup!==userPrefs.hablarTab);
  });
}
export function buildSpeakingGuide(){
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
    const b=document.createElement("button");b.type="button";b.className="hablar-subtab";b.dataset.tab=id;b.setAttribute("role","tab");b.textContent=lbl;
    b.onclick=()=>applyHablarTab(id);
    subBar.appendChild(b);
  });
  subBar.onkeydown=e=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;const tabs=Array.from(subBar.querySelectorAll('[role="tab"]'));const i=tabs.indexOf(document.activeElement);if(i<0)return;e.preventDefault();const nxt=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;applyHablarTab(tabs[nxt].dataset.tab);tabs[nxt].focus();};sec.appendChild(subBar);
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
    const atlasFold=document.createElement("details");atlasFold.className="lesson-stage guides-fold";atlasFold.dataset.hablarGroup="regions";
    atlasFold.innerHTML=`<summary class="stage-label guides-fold-summary"><div class="stage-label-main"><span>🗺️ Regional Accent &amp; Slang Atlas</span><span class="stage-count">${REGIONAL_ATLAS.length} regions</span></div><div class="stage-sub">San Juan del Cesar, Guajira, Paisa, Rolos &amp; more — tap to expand</div></summary>`;
    atlasFold.appendChild(atlasCard);
    sec.appendChild(atlasFold);
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
    const swFold=document.createElement("details");swFold.className="lesson-stage guides-fold";swFold.dataset.hablarGroup="regions";
    swFold.innerHTML=`<summary class="stage-label guides-fold-summary"><div class="stage-label-main"><span>🧭 Comparador Regional</span><span class="stage-count">${REGIONAL_SWITCHER.length} cards</span></div><div class="stage-sub">Compare Tú / Usted / Vos side-by-side — tap to expand</div></summary>`;
    swFold.appendChild(swCard);
    sec.appendChild(swFold);
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
      lb.innerHTML=`<div class="vg-lightbox-panel"><div class="vg-lightbox-head"><div class="vg-lightbox-title" id="vg-lb-title"></div><button type="button" class="vg-lightbox-close" id="vg-lb-close" aria-label="Close visual guide">✕ Close</button></div><img id="vg-lb-img" alt=""/><div class="vg-lightbox-cap" id="vg-lb-cap"></div></div>`;
      document.body.appendChild(lb);
      const closeLb=()=>{
        lb.hidden=true;
        const im=lb.querySelector("#vg-lb-img");if(im){im.removeAttribute("src");im.alt="";}if(lb._opener&&typeof lb._opener.focus==="function"){lb._opener.focus();lb._opener=null;}
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
    const fold=document.createElement("details");fold.className="starter-more-tools gram-guide-fold";fold.dataset.hablarGroup="trampas";
    fold.innerHTML=`<summary><span><b>${i+1}.</b> ${escapeVocabHtml(g.title)}</span><small>${escapeVocabHtml(g.formula)}</small></summary>`;
    const card=document.createElement("article");card.className="speaking-guide-card";
    card.innerHTML=`<div class='speaking-guide-copy'><div class='speaking-guide-formula'>${escapeVocabHtml(g.formula)}</div><p>${escapeVocabHtml(g.explain)}</p><div class='speaking-guide-mistake'>⚠️ ${escapeVocabHtml(g.mistake)}</div></div>`;
    (g.examples||[]).forEach(ex=>{const row=document.createElement("button");row.type="button";row.className="speaking-guide-example";row.innerHTML=`<strong>${escapeVocabHtml(ex.es)}</strong><small>${escapeVocabHtml(ex.en)}</small><span>🔊</span>`;row.onclick=()=>speak(ex.tts||ex.es,0.75);card.appendChild(row);});
    const drill=document.createElement("div");drill.className="speaking-guide-drill";drill.textContent="🗣️ Try it: "+g.exercise;card.appendChild(drill);
    fold.appendChild(card);sec.appendChild(fold);
  });
  applyHablarTab(userPrefs.hablarTab||"regions");
}


/* Grouped grammar navigation (v23): Tiempos / Pronombres / Patrones */
export const GRAM_GROUPS={regiones:{label:"🗺️ Regiones",items:[["estructura","🗺️ Regiones"]]},posters:{label:"🖼️ Posters",items:[["estructura","🖼️ Posters"]]},
  tiempos:{label:"⏱️ Tiempos",items:[["presente","⚡ Presente"],["pasado","⏮️ Pasado"],["pasado-contraste","🎞️ Evento vs. contexto"],["futuro","⏭️ Futuro"],["perfecto","✅ He hecho"],["condicional","🙏 Haría / podría"],["pasado-perfecto","⏪ Había hecho"],["futuro-perfecto","⏩ Habré hecho"]]},
  pronombres:{label:"👤 Pronombres",items:[["pronombres","Lo / La / Le"]]},
  patrones:{label:"🧩 Patrones",items:[["voseo","🇨🇴 Usted · Tú · Vos"],["reflexivos","🔄 Reflexivos"],["subjuntivo","🌱 Subjuntivo"],["trucos","🧠 Trucos"]]},
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
  ["presente","pasado","pasado-contraste","futuro","perfecto","condicional","pasado-perfecto","futuro-perfecto","pronombres","reflexivos","voseo","subjuntivo","trucos","estructura"].forEach(g=>{
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
  buildSpeakingGuide();
  showGramGroup("regiones");
}
