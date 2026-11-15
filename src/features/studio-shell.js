/**
 * Editorial Language Studio Shell (v114.0):
 * - Top-layer <dialog closedby="any"> Global Command Finder (⌘K / Ctrl+K) with discrete exit + light-dismiss fallback
 * - Topbar Lento 0.45x acoustic waveform replay control
 * - Desktop Studio Rail live curriculum mastery card + 1–6 room shortcuts
 * - Interactive Articulatory Sagittal Mouth & Tongue SVG Studio in Fonética
 * - Asymmetric Desktop Acoustic Spotlight Inspector in Lecciones
 */
import {
  VC, VERBS, COLOMBIANISMOS, FRASES, TRAMPAS_COLOMBIANAS,
  STREET_EAR_LINKER, REGIONAL_ATLAS, SPANISH_BRAIN_DRILLS,
} from "../../data/index.js";
import { LESSONS } from "./lessons-meta.js";
import { speak, subscribeSpeechActivity, replayLastSpokenSlow, getLastSpokenText } from "../audio/voice-engine.js";
import { escapeVocabHtml } from "../core/text-utils.js";
import { lessonProgress, srsStore, srsDueCount, practiceStreak, markPractice } from "../core/stores.js";
import { PG, actions, showPage, navigatePage } from "./navigation.js";
import { openLesson } from "./lesson-player.js";

const STUDIO_PHONEMES = [
  {
    id: "rr",
    symbol: "RR",
    tag: "Vibrante múltiple",
    ipa: "/r/",
    tongueTransform: "translate(6px, -11px)",
    tipCy: 66,
    tipCx: 74,
    coach: "Apoya suavemente la punta de la lengua detrás de los dientes superiores (cresta alveolar) y deja que el aire la haga vibrar sin tensar la mandíbula.",
    examples: [
      { word: "perro", syl: ["PE", "rro"], tonicIdx: 0, en: "dog" },
      { word: "arriba", syl: ["a", "RRI", "ba"], tonicIdx: 1, en: "upstairs" },
      { word: "corrientazo", syl: ["co", "rrien", "TA", "zo"], tonicIdx: 2, en: "daily lunch" },
    ],
  },
  {
    id: "r-tap",
    symbol: "R suave",
    tag: "Toque simple",
    ipa: "/ɾ/",
    tongueTransform: "translate(4px, -8px)",
    tipCy: 70,
    tipCx: 76,
    coach: "Exactamente como la «tt» rápida del inglés norteamericano en «butter» o «water»: un único toque ágil contra el paladar delantero.",
    examples: [
      { word: "pero", syl: ["PE", "ro"], tonicIdx: 0, en: "but" },
      { word: "arepa", syl: ["a", "RE", "pa"], tonicIdx: 1, en: "corn cake" },
      { word: "portería", syl: ["por", "te", "RÍ", "a"], tonicIdx: 2, en: "front desk" },
    ],
  },
  {
    id: "nye",
    symbol: "Ñ",
    tag: "Nasal palatal",
    ipa: "/ɲ/",
    tongueTransform: "translate(-2px, -13px)",
    tipCy: 64,
    tipCx: 96,
    coach: "El dorso medio de la lengua sube amplio contra el techo del paladar en un solo gesto continuo (más compacto que «ny» en «canyon»).",
    examples: [
      { word: "mañana", syl: ["ma", "ÑA", "na"], tonicIdx: 1, en: "tomorrow / morning" },
      { word: "señor", syl: ["se", "ÑOR"], tonicIdx: 1, en: "sir" },
      { word: "buñuelo", syl: ["bu", "ÑUE", "lo"], tonicIdx: 1, en: "cheese fritter" },
    ],
  },
  {
    id: "bv",
    symbol: "B · V",
    tag: "Mismo sonido",
    ipa: "/b/ ~ [β]",
    tongueTransform: "translate(0px, 2px)",
    tipCy: 92,
    tipCx: 54,
    coach: "En español colombiano «B» y «V» suenan idénticas. Nunca muerdas el labio inferior como en inglés «very»; entre vocales los dos labios apenas se rozan.",
    examples: [
      { word: "vamos", syl: ["VA", "mos"], tonicIdx: 0, en: "let's go" },
      { word: "abanico", syl: ["a", "ba", "NI", "co"], tonicIdx: 2, en: "electric fan" },
      { word: "chévere", syl: ["CHÉ", "ve", "re"], tonicIdx: 0, en: "cool / great" },
    ],
  },
  {
    id: "j-ge",
    symbol: "J · GE",
    tag: "Aspirada suave",
    ipa: "[h]",
    tongueTransform: "translate(-8px, -4px)",
    tipCy: 82,
    tipCx: 118,
    coach: "A diferencia de España, la «J» y «GE/GI» en Colombia son suaves y aireadas, muy cercanas a la «H» inglesa de «home».",
    examples: [
      { word: "jugo", syl: ["JU", "go"], tonicIdx: 0, en: "juice" },
      { word: "gente", syl: ["GEN", "te"], tonicIdx: 0, en: "people" },
      { word: "Guajira", syl: ["gua", "JI", "ra"], tonicIdx: 1, en: "La Guajira" },
    ],
  },
  {
    id: "vowels",
    symbol: "A E I O U",
    tag: "Vocales puras",
    ipa: "/a e i o u/",
    tongueTransform: "translate(0px, 4px)",
    tipCy: 96,
    tipCx: 88,
    coach: "Cinco vocales cortas, tensas e invariables: nunca se deslizan en diptongos al final («no» jamás suena «nou», y ninguna vocal se vuelve schwa).",
    examples: [
      { word: "Colombia", syl: ["co", "LOM", "bia"], tonicIdx: 1, en: "Colombia" },
      { word: "tinto", syl: ["TIN", "to"], tonicIdx: 0, en: "black coffee" },
      { word: "lulo", syl: ["LU", "lo"], tonicIdx: 0, en: "Andean citrus" },
    ],
  },
];

const DAILY_SPOTLIGHTS = [
  {
    es: "Vecino, ¿me regala un tinto y dos pandebonos calienticos?",
    en: "Neighbor, could I please get a black coffee and two warm cheese breads?",
    syllables: [
      { text: "ve", tonic: false }, { text: "CI", tonic: true }, { text: "no", tonic: false },
      { sep: true },
      { text: "re", tonic: false }, { text: "GA", tonic: true }, { text: "la", tonic: false },
      { sep: true },
      { text: "pan", tonic: false }, { text: "de", tonic: false }, { text: "BO", tonic: true }, { text: "nos", tonic: false },
    ],
    note: "En Colombia, «¿me regala…?» en una tienda nunca pide algo gratis: es la fórmula cotidiana más cálida para pedir atención y comprar.",
  },
  {
    es: "Con tarjeta, pásela a una sola cuota, sin copia por favor.",
    en: "By card, run it as a single installment, no receipt copy please.",
    syllables: [
      { text: "pá", tonic: true }, { text: "se", tonic: false }, { text: "la", tonic: false },
      { sep: true },
      { text: "U", tonic: true }, { text: "na", tonic: false },
      { sep: true },
      { text: "CUO", tonic: true }, { text: "ta", tonic: false },
    ],
    note: "Los datáfonos colombianos preguntan cuántas cuotas incluso para un café; «a una sola cuota» liquida el pago sin intereses.",
  },
  {
    es: "Buenas tardes, qué pena con usted, voy para el quinientos dos.",
    en: "Good afternoon, excuse me, I am heading to apartment 502.",
    syllables: [
      { text: "BUE", tonic: true }, { text: "nas", tonic: false },
      { sep: true },
      { text: "PE", tonic: true }, { text: "na", tonic: false },
      { sep: true },
      { text: "qui", tonic: false }, { text: "NIEN", tonic: true }, { text: "tos", tonic: false },
    ],
    note: "«Qué pena con usted» abre cualquier consulta con suavidad y respeto frente a celadores, vecinos o cajeros.",
  },
];

const LETTER_TO_PHONEME = {
  A: "vowels", E: "vowels", I: "vowels", O: "vowels", U: "vowels",
  R: "r-tap", "Ñ": "nye", B: "bv", V: "bv", J: "j-ge", G: "j-ge",
};

let activePhonemeId = "rr";
let supportsDisplayTransition;

function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
    return false;
  }
  try {
    const probe = document.createElement("div");
    probe.style.cssText = "transition: display 1s allow-discrete !important; display: block; position: fixed; opacity: 0; pointer-events: none;";
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = "none";
    supportsDisplayTransition = getComputedStyle(probe).display === "block";
    probe.remove();
    return supportsDisplayTransition;
  } catch (e) {
    supportsDisplayTransition = false;
    return false;
  }
}

function supportsTopLayerExit() {
  return !!(window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay());
}

export async function closeStudioDialog(dialog) {
  if (!dialog || !dialog.open) return;
  if (!supportsTopLayerExit()) {
    dialog.setAttribute("data-closing", "");
    const animations = dialog.getAnimations ? dialog.getAnimations({ subtree: true }) : [];
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map(a => a.finished)),
        new Promise(r => setTimeout(r, 400)),
      ]);
    }
    if (!dialog.hasAttribute("data-closing")) return;
    dialog.removeAttribute("data-closing");
  }
  if (dialog.open) dialog.close();
}

function wireDialogLightDismiss(dialog) {
  if (!dialog || dialog.dataset.studioBound) return;
  dialog.dataset.studioBound = "1";
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    closeStudioDialog(dialog);
  });
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isDialogContent) closeStudioDialog(dialog);
    });
  }
}

function speakerSvg() {
  return '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18.8 5.8a9 9 0 0 1 0 12.4"></path></svg>';
}

export function mountArticulatoryMouthStudio() {
  const host = document.getElementById("phonetic-mouth-studio");
  if (!host) return;
  const p = STUDIO_PHONEMES.find(x => x.id === activePhonemeId) || STUDIO_PHONEMES[0];

  const btnsHtml = STUDIO_PHONEMES.map(item => `
    <button type="button" class="studio-phoneme-btn" aria-pressed="${item.id === p.id}" data-phoneme-id="${escapeVocabHtml(item.id)}">
      <span class="studio-phoneme-sym">${escapeVocabHtml(item.symbol)}</span>
      <span class="studio-phoneme-tag">${escapeVocabHtml(item.tag)}</span>
    </button>
  `).join("");

  const exHtml = p.examples.map(ex => {
    const sylMarkup = ex.syl.map((s, idx) =>
      `<span class="studio-syl-chip${idx === ex.tonicIdx ? " is-tonic" : ""}">${escapeVocabHtml(s)}</span>`
    ).join("");
    return `
      <div class="studio-mouth-ex">
        <div>
          <div class="studio-mouth-ex-top">
            <strong>${escapeVocabHtml(ex.word)}</strong>
            <span>${escapeVocabHtml(ex.en)}</span>
          </div>
          <div class="studio-syl-row">${sylMarkup}</div>
        </div>
        <button type="button" class="studio-speak-pill" data-mouth-speak="${escapeVocabHtml(ex.word)}" aria-label="Listen to ${escapeVocabHtml(ex.word)}">
          ${speakerSvg()} <span>Oír</span>
        </button>
      </div>`;
  }).join("");

  host.innerHTML = `
    <div class="studio-mouth-card">
      <div class="studio-card-head">
        <span>Geometría articulatoria interactiva</span>
        <span class="studio-badge emerald">${escapeVocabHtml(p.ipa)}</span>
      </div>
      <div class="studio-phoneme-grid" role="group" aria-label="Choose Colombian sound">
        ${btnsHtml}
      </div>
      <div class="studio-sagittal-layout">
        <div class="studio-mouth-svg-wrap" aria-hidden="true">
          <svg viewBox="0 0 180 180" width="180" height="180" fill="none">
            <path d="M28 72 C52 38, 128 38, 152 86 C158 104, 154 134, 142 152" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/>
            <path d="M46 66 L52 80 L58 68" stroke="var(--text)" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M24 74 C32 74, 38 78, 42 82" stroke="var(--text)" stroke-width="3.2" stroke-linecap="round"/>
            <path d="M26 108 C34 106, 40 102, 44 98" stroke="var(--text)" stroke-width="3.2" stroke-linecap="round"/>
            <g class="studio-tongue-group" style="transform:${escapeVocabHtml(p.tongueTransform)}">
              <path d="M48 118 C64 90, 108 86, 134 126 C116 138, 72 138, 48 118 Z" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="3"/>
            </g>
            <circle cx="${p.tipCx}" cy="${p.tipCy}" r="7" fill="var(--gold)" opacity="0.95"/>
            <circle cx="${p.tipCx}" cy="${p.tipCy}" r="14" stroke="var(--gold)" stroke-width="1.6" opacity="0.45"/>
          </svg>
        </div>
        <div class="studio-mouth-copy">
          <h3 class="studio-mouth-title">${escapeVocabHtml(p.symbol)} · ${escapeVocabHtml(p.tag)}</h3>
          <p class="studio-mouth-coach">${escapeVocabHtml(p.coach)}</p>
          <div class="studio-mouth-examples">${exHtml}</div>
        </div>
      </div>
    </div>
  `;

  host.querySelectorAll("[data-phoneme-id]").forEach(btn => {
    btn.onclick = () => {
      activePhonemeId = btn.dataset.phonemeId;
      mountArticulatoryMouthStudio();
      const picked = STUDIO_PHONEMES.find(x => x.id === activePhonemeId);
      if (picked && picked.examples[0]) speak(picked.examples[0].word, 0.78);
    };
  });
  host.querySelectorAll("[data-mouth-speak]").forEach(btn => {
    btn.onclick = () => {
      const w = btn.dataset.mouthSpeak;
      markPractice("vocab", w);
      speak(w, 0.76);
    };
  });
}

export function syncMouthLetter(letter) {
  const mapped = LETTER_TO_PHONEME[String(letter || "").toUpperCase()];
  if (!mapped || mapped === activePhonemeId) return;
  activePhonemeId = mapped;
  mountArticulatoryMouthStudio();
}

export function renderLeccionesStudioAside() {
  const aside = document.getElementById("lecciones-studio-aside");
  if (!aside) return;
  const now = new Date();
  const dayIdx = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const sp = DAILY_SPOTLIGHTS[dayIdx % DAILY_SPOTLIGHTS.length];
  const dueCount = srsDueCount();
  const masteredCount = Object.keys(srsStore || {}).length;

  const sylHtml = sp.syllables.map(s =>
    s.sep
      ? `<span class="studio-syl-sep" aria-hidden="true">·</span>`
      : `<span class="studio-syl-chip${s.tonic ? " is-tonic" : ""}">${escapeVocabHtml(s.text)}</span>`
  ).join("");

  aside.innerHTML = `
    <section class="studio-aside-card">
      <div class="studio-card-head">
        <span>Frase acústica del día</span>
        <span class="studio-badge amber">Acento tónico</span>
      </div>
      <p class="studio-specimen">«${escapeVocabHtml(sp.es)}»</p>
      <p class="studio-gloss">${escapeVocabHtml(sp.en)}</p>
      <div class="studio-syl-row studio-syl-strip" aria-label="Syllable stress breakdown">${sylHtml}</div>
      <div class="studio-aside-actions">
        <button type="button" class="studio-speak-pill" data-aside-rate="0.86">${speakerSvg()} <span>Ritmo natural</span></button>
        <button type="button" class="studio-speak-pill" data-aside-rate="0.45">${speakerSvg()} <span>Lento 0.45×</span></button>
      </div>
      <p class="studio-aside-note">${escapeVocabHtml(sp.note)}</p>
    </section>

    <section class="studio-aside-card subtle">
      <div class="studio-card-head">
        <span>Memoria visual activa</span>
        <span class="studio-badge emerald">${dueCount ? `${dueCount} hoy` : `${masteredCount} tarjetas`}</span>
      </div>
      <p class="studio-aside-note">Conecta objetos cotidianos de Colombia directamente con su imagen y pronunciación sin traducir palabra por palabra.</p>
      <button type="button" class="studio-secondary-btn" id="aside-open-pm">Abrir Picture Match →</button>
    </section>

    <section class="studio-aside-card subtle">
      <div class="studio-card-head">
        <span>Atajos del estudio</span>
        <kbd class="studio-kbd">1–6</kbd>
      </div>
      <p class="studio-aside-note">Usa <kbd class="studio-kbd">1</kbd>–<kbd class="studio-kbd">6</kbd> para cambiar de sala al instante, o presiona <kbd class="studio-kbd">⌘K</kbd> para buscar cualquier verbo, modismo o ciudad.</p>
    </section>
  `;

  aside.querySelectorAll("[data-aside-rate]").forEach(btn => {
    btn.onclick = () => {
      markPractice("phrases", sp.es);
      speak(sp.es, Number(btn.dataset.asideRate) || 0.82);
    };
  });
  const pmBtn = aside.querySelector("#aside-open-pm");
  if (pmBtn) {
    pmBtn.onclick = () => {
      showPage("quiz");
      actions.openQuizV102Tab("picture");
    };
  }
}

export function syncStudioChrome() {
  const railCard = document.getElementById("rail-mastery-card");
  if (railCard) {
    const total = LESSONS.length || 1;
    const done = LESSONS.filter(l => lessonProgress[l.id]).length;
    const pct = Math.round((done / total) * 100);
    const streak = practiceStreak();
    railCard.innerHTML = `
      <div class="rail-mastery-head">
        <span>Dominio curricular</span>
        <strong class="tabular-nums">${pct}%</strong>
      </div>
      <div class="rail-mastery-track" aria-hidden="true"><span style="width:${pct}%"></span></div>
      <div class="rail-mastery-meta tabular-nums">
        <span>${done}/${total} lecciones</span>
        <span>${streak}d racha</span>
      </div>
    `;
  }
  renderLeccionesStudioAside();
}

function buildSearchCorpus() {
  const items = [];
  LESSONS.forEach(les => {
    items.push({
      badge: "Lección",
      title: `${les.title}`,
      sub: les.sub || "",
      search: `${les.title} ${les.sub} ${les.id}`.toLowerCase(),
      run: () => { showPage("lecciones"); openLesson(les); },
    });
  });
  Object.entries(VERBS || {}).forEach(([inf, v]) => {
    items.push({
      badge: "Verbo",
      title: inf,
      sub: v.en || "Conjugación completa",
      search: `${inf} ${v.en || ""} verbos`.toLowerCase(),
      run: () => { showPage("vocab"); actions.sCat("verbos"); actions.openVerbByKey(inf); },
    });
  });
  (COLOMBIANISMOS || []).forEach(c => {
    items.push({
      badge: "Colombia",
      title: c.word,
      sub: `${c.en}${c.usage ? " · " + c.usage : ""}`,
      search: `${c.word} ${c.en} ${c.usage || ""} ${c.example || ""}`.toLowerCase(),
      run: () => { markPractice("vocab", c.tts || c.word); speak(c.tts || c.word, 0.78); },
    });
  });
  (TRAMPAS_COLOMBIANAS || []).forEach(t => {
    items.push({
      badge: "Trampa",
      title: t.trap,
      sub: `${t.realMeaning} (not "${t.wrongGuess}")`,
      search: `${t.trap} ${t.realMeaning} ${t.wrongGuess} ${t.es}`.toLowerCase(),
      run: () => { markPractice("phrases", t.es); speak(t.es, 0.78); },
    });
  });
  (REGIONAL_ATLAS || []).forEach(reg => {
    (reg.items || []).forEach(it => {
      items.push({
        badge: reg.tab || "Región",
        title: it.es,
        sub: `${it.en}${it.tip ? " · " + it.tip : ""}`,
        search: `${reg.title} ${reg.tab} ${it.es} ${it.en} ${it.tip || ""}`.toLowerCase(),
        run: () => { speak(it.es, 0.78); },
      });
    });
  });
  (STREET_EAR_LINKER || []).forEach(e => {
    items.push({
      badge: "Street Ear",
      title: e.streetEs,
      sub: `${e.carefulEs} — ${e.en}`,
      search: `${e.streetEs} ${e.carefulEs} ${e.en}`.toLowerCase(),
      run: () => { speak(e.carefulEs, 0.78); },
    });
  });
  (SPANISH_BRAIN_DRILLS || []).forEach(b => {
    items.push({
      badge: "Spanish Brain",
      title: b.prompt,
      sub: `${b.question} · ${b.answer}`,
      search: `${b.prompt} ${b.en} ${b.question} ${b.answer} ${b.tip}`.toLowerCase(),
      run: () => { showPage("quiz"); actions.openQuizV102Tab("brain"); speak(b.tts || b.prompt, 0.78); },
    });
  });
  (VC || []).forEach(cat => {
    if (cat.type === "basic") {
      (cat.items || []).forEach(it => {
        items.push({
          badge: cat.label,
          title: it.word,
          sub: it.en,
          search: `${it.word} ${it.en} ${cat.label}`.toLowerCase(),
          run: () => { markPractice("vocab", it.tts || it.word); speak(it.tts || it.word, 0.78); },
        });
      });
    }
  });
  (FRASES || []).filter(s => s.section && Array.isArray(s.items)).forEach(sec => {
    sec.items.forEach(it => {
      items.push({
        badge: sec.section,
        title: it.es,
        sub: it.en,
        search: `${it.es} ${it.en} ${sec.section}`.toLowerCase(),
        run: () => { markPractice("phrases", it.es); speak(it.es, 0.78); },
      });
    });
  });
  return items;
}

let cachedCorpus = null;

export function openCommandFinder() {
  const dialog = document.getElementById("studio-command-dialog");
  if (!dialog) return;
  wireDialogLightDismiss(dialog);
  if (!cachedCorpus) cachedCorpus = buildSearchCorpus();
  const input = document.getElementById("studio-command-input");
  const resultsHost = document.getElementById("studio-command-results");

  const renderHits = q => {
    if (!resultsHost) return;
    const term = String(q || "").trim().toLowerCase();
    const matches = term
      ? cachedCorpus.filter(x => x.search.includes(term)).slice(0, 24)
      : cachedCorpus.slice(0, 12);
    resultsHost.innerHTML = "";
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "studio-cmd-empty";
      empty.textContent = "Sin coincidencias. Prueba «tinto», «cuota», «provocar», «portería», «hacer» o «San Juan».";
      resultsHost.appendChild(empty);
      return;
    }
    matches.forEach(m => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "studio-cmd-item";
      row.innerHTML = `
        <div class="studio-cmd-copy">
          <strong>${escapeVocabHtml(m.title)}</strong>
          <small>${escapeVocabHtml(m.sub)}</small>
        </div>
        <span class="studio-badge">${escapeVocabHtml(m.badge)}</span>
      `;
      row.onclick = () => {
        closeStudioDialog(dialog).then(() => m.run());
      };
      resultsHost.appendChild(row);
    });
  };

  if (input && !input.dataset.bound) {
    input.dataset.bound = "1";
    input.addEventListener("input", () => renderHits(input.value));
  }
  const closeBtn = document.getElementById("studio-command-close");
  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = "1";
    closeBtn.onclick = () => closeStudioDialog(dialog);
  }

  if (input) input.value = "";
  renderHits("");
  dialog.removeAttribute("data-closing");
  if (!dialog.open) dialog.showModal();
  if (input) setTimeout(() => input.focus(), 20);
}

export function initStudioShell() {
  // 1. Mount rail mastery footer inside .tab-bar for desktop Studio Rail
  const tabBar = document.querySelector(".tab-bar");
  if (tabBar && !document.getElementById("rail-mastery-card")) {
    const hdr = document.createElement("div");
    hdr.className = "rail-section-kicker";
    hdr.setAttribute("aria-hidden", "true");
    hdr.textContent = "SALAS DE ESTUDIO";
    tabBar.prepend(hdr);

    const card = document.createElement("div");
    card.id = "rail-mastery-card";
    card.className = "rail-mastery-card";
    tabBar.appendChild(card);
  }

  // 2. Wire Topbar Lento 0.45x Acoustic Pill
  const lentoTop = document.getElementById("studio-lento-btn");
  if (lentoTop) {
    const syncLento = ({ speaking, text }) => {
      const hasText = !!(text || getLastSpokenText());
      lentoTop.disabled = !hasText;
      lentoTop.classList.toggle("is-speaking", !!speaking);
      if (hasText) {
        const snippet = String(text || getLastSpokenText()).slice(0, 42);
        lentoTop.title = `Repetir despacio (0.45×): «${snippet}»`;
      }
    };
    syncLento({ speaking: false, text: getLastSpokenText() });
    subscribeSpeechActivity(syncLento);
    lentoTop.onclick = () => replayLastSpokenSlow();
  }

  // 3. Wire Topbar Command Finder trigger + Global Shortcuts
  const searchBtn = document.getElementById("studio-search-trigger");
  if (searchBtn) searchBtn.onclick = () => openCommandFinder();

  const dialog = document.getElementById("studio-command-dialog");
  if (dialog) wireDialogLightDismiss(dialog);

  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommandFinder();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const openModal = document.querySelector("dialog[open]");
    if (openModal) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable) return;
    // Preserve 1-4 answer hotkeys on Quiz page; elsewhere 1-6 switch Studio rooms!
    const quizActive = document.getElementById("page-quiz")?.classList.contains("active");
    if (!quizActive && e.key >= "1" && e.key <= "6") {
      const targetId = PG[Number(e.key) - 1];
      if (targetId) {
        e.preventDefault();
        navigatePage(targetId);
      }
    }
  });

  // 4. Mount interactive Phonetics Sagittal Mouth Studio & Lecciones Spotlight
  mountArticulatoryMouthStudio();
  syncStudioChrome();
}
