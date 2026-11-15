/**
 * Spanish Brain Reflex Drills (v114.1):
 * Targets the 4 spontaneous comprehension & production bottlenecks:
 *  1) prodrop  — Instant "Who + When?" recognition when subjects are dropped
 *  2) reverse  — Reverse-subject & accidental-se mental model ("se me olvidó", "nos toca")
 *  3) pronouns — Double object pronoun decoding ("se lo", "me la", "dámelo")
 *  4) stress   — Spoken stress shifts ("hablo" vs "habló") & meaning flips (ser/estar, cuando+subj)
 */
export const SPANISH_BRAIN_DRILLS = [
  // ── 1. Pro-Drop Verb-Ending Radar ───────────────────────────────────────────
  {
    id: "sb-pd-1",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Llegaron anoche.",
    tts: "Llegaron anoche.",
    en: "They arrived last night.",
    question: "Who arrived, and when?",
    choices: ["Ellos / ustedes · Past", "Nosotros · Past", "Yo · Past", "Ellos · Future"],
    answer: "Ellos / ustedes · Past",
    sayTarget: "Llegaron anoche.",
    tip: "Ending '-aron' signals 'they / you all' (ellos/ustedes) completed action in the past — Spanish drops the pronoun because the ending carries both person and tense."
  },
  {
    id: "sb-pd-2",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Se lo dije ayer.",
    tts: "Se lo dije ayer.",
    en: "I told it to him/her yesterday.",
    question: "Who spoke, and when?",
    choices: ["Yo · Past", "Él / ella · Past", "Tú · Past", "Nosotros · Future"],
    answer: "Yo · Past",
    sayTarget: "Se lo dije ayer.",
    tip: "Irregular preterite 'dije' (-e) is strictly 'yo' in the past ('I said/told'). Compare 'dijo' (-o) which is 'he / she / usted'."
  },
  {
    id: "sb-pd-3",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Habló con mi mamá.",
    tts: "Habló con mi mamá.",
    en: "He/she/usted spoke with my mom.",
    question: "Who spoke? (Listen for the final stress!)",
    choices: ["Él / ella / usted · Past", "Yo · Present", "Tú · Present", "Ellos · Future"],
    answer: "Él / ella / usted · Past",
    sayTarget: "Habló con mi mamá.",
    tip: "Stressed final '-ó' (hablÓ) means 3rd-person past ('he/she/usted spoke'). Unstressed 'HA-blo' means 'I speak' right now."
  },
  {
    id: "sb-pd-4",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Iban pa'l centro.",
    tts: "Iban para el centro.",
    en: "They were heading downtown.",
    question: "Who + what timeframe?",
    choices: ["Ellos / ustedes · Ongoing past", "Nosotros · Ongoing past", "Yo · Future", "Usted · Command"],
    answer: "Ellos / ustedes · Ongoing past",
    sayTarget: "Iban para el centro.",
    tip: "'-ban' on 'iban' (imperfect) paints an ongoing background action in the past for 'they / you all' ('were going')."
  },
  {
    id: "sb-pd-5",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Tráigame la cuenta, porfa.",
    tts: "Tráigame la cuenta, por favor.",
    en: "Bring me the check, please.",
    question: "Who are you addressing, and what mood?",
    choices: ["Usted · Polite command", "Yo · Past", "Nosotros · Suggestion", "Tú · Habitual present"],
    answer: "Usted · Polite command",
    sayTarget: "Tráigame la cuenta, por favor.",
    tip: "In Colombia, 'usted' commands swap vowel endings (-ga for traer) and attach 'me' to the end: 'trái-ga-me'."
  },
  {
    id: "sb-pd-6",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Vendrían mañana temprano.",
    tts: "Vendrían mañana temprano.",
    en: "They would come tomorrow morning.",
    question: "Who + what timeframe?",
    choices: ["Ellos / ustedes · Would (hypothetical)", "Nosotros · Past", "Tú · Future", "Yo · Ongoing past"],
    answer: "Ellos / ustedes · Would (hypothetical)",
    sayTarget: "Vendrían mañana temprano.",
    tip: "Ending '-ían' after the future stem (vendr-) means conditional 'would' for they/you all ('would come')."
  },
  {
    id: "sb-pd-7",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Tuvimos muchísima suerte.",
    tts: "Tuvimos muchísima suerte.",
    en: "We were super lucky.",
    question: "Who had luck, and when?",
    choices: ["Nosotros · Past", "Ellos · Past", "Usted · Present", "Tú · Conditional"],
    answer: "Nosotros · Past",
    sayTarget: "Tuvimos muchísima suerte.",
    tip: "'-imos' on irregular stem 'tuv-' always signals 'nosotros' (we) completed in the past."
  },
  {
    id: "sb-pd-8",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Me dijiste otra cosa.",
    tts: "Me dijiste otra cosa.",
    en: "You told me something else.",
    question: "Who told whom?",
    choices: ["Tú → Yo · Past", "Yo → Tú · Past", "Él → Yo · Present", "Nosotros → Ustedes · Past"],
    answer: "Tú → Yo · Past",
    sayTarget: "Me dijiste otra cosa.",
    tip: "Ending '-ste' (dijiste) is 'tú' in the past, and 'me' at the front tells you 'to me' — you hear the recipient BEFORE the verb!"
  },
  {
    id: "sb-pd-9",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Quedamos así entonces.",
    tts: "Quedamos así entonces.",
    en: "So we're agreed / settled like that then.",
    question: "Who agreed?",
    choices: ["Nosotros · Present/Past agreement", "Ellos · Future", "Yo · Conditional", "Usted · Command"],
    answer: "Nosotros · Present/Past agreement",
    sayTarget: "Quedamos así entonces.",
    tip: "'-mos' is always 'nosotros' (we). In Colombia 'quedamos así' closes plans ('that's our deal')."
  },
  {
    id: "sb-pd-10",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "¿Pasarás por la tarde?",
    tts: "¿Pasarás por la tarde?",
    en: "Will you stop by in the afternoon?",
    question: "Who + what timeframe?",
    choices: ["Tú · Future", "Tú · Past", "Usted · Imperfect", "Nosotros · Future"],
    answer: "Tú · Future",
    sayTarget: "¿Pasarás por la tarde?",
    tip: "Stressed '-ás' attached to the whole infinitive (pasar + ás) signals 'tú' in the simple future."
  },
  {
    id: "sb-pd-11",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Estuvo buenísimo el paseo.",
    tts: "Estuvo buenísimo el paseo.",
    en: "The trip was awesome.",
    question: "What timeframe does 'estuvo' signal?",
    choices: ["3rd person · Completed event (wrapped up)", "1st person · Right now", "2nd person · Hypothetical", "Plural · Ongoing habit"],
    answer: "3rd person · Completed event (wrapped up)",
    sayTarget: "Estuvo buenísimo el paseo.",
    tip: "'Estuvo' (preterite) sums up an entire finished experience ('the trip is over and it was awesome'), vs. 'estaba' (what it was like at a moment during it)."
  },
  {
    id: "sb-pd-12",
    kind: "prodrop",
    badge: "⚡ Who + When?",
    prompt: "Haremos todo lo posible.",
    tts: "Haremos todo lo posible.",
    en: "We will do everything possible.",
    question: "Who + what timeframe?",
    choices: ["Nosotros · Future", "Ustedes · Past", "Yo · Imperfect", "Tú · Command"],
    answer: "Nosotros · Future",
    sayTarget: "Haremos todo lo posible.",
    tip: "'-emos' on the irregular stem 'har-' (from hacer) marks 'nosotros' in the future ('we will do')."
  },

  // ── 2. Reverse-Subject & Accidental Se ──────────────────────────────────────
  {
    id: "sb-rv-1",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Se me olvidó la billetera.",
    tts: "Se me olvidó la billetera.",
    en: "I accidentally forgot my wallet.",
    question: "Why isn't this 'Yo olvidé'?",
    choices: [
      "The wallet 'forgot itself to me' — accidental framing",
      "Because 'billetera' is always plural",
      "Because it hasn't happened yet",
      "It means someone else stole it"
    ],
    answer: "The wallet 'forgot itself to me' — accidental framing",
    sayTarget: "Se me olvidó la billetera.",
    tip: "Accidental 'se + indirect pronoun (me/te/le/nos) + 3rd-person verb' removes blame and sounds 100% natural: 'se me olvidaron las llaves' (plural verb because 'llaves' is plural!)."
  },
  {
    id: "sb-rv-2",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Se me cayó el celular.",
    tts: "Se me cayó el celular.",
    en: "I dropped my phone (by accident).",
    question: "Which natural response expresses 'I dropped my keys'?",
    choices: [
      "Se me cayeron las llaves.",
      "Se me cayó las llaves.",
      "Yo caí las llaves.",
      "Me caigo las llaves."
    ],
    answer: "Se me cayeron las llaves.",
    tip: "The dropped items are the grammatical subject! Singular phone -> 'se me cayó'; plural keys -> 'se me cayeron'."
  },
  {
    id: "sb-rv-3",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Nos tocó esperar media hora.",
    tts: "Nos tocó esperar media hora.",
    en: "We had to wait half an hour (no choice).",
    question: "What does 'tocar + pronoun' express here?",
    choices: [
      "Circumstance forced it on us ('it fell to us to...')",
      "We physically touched something",
      "We really wanted to wait",
      "We arrived half an hour early"
    ],
    answer: "Circumstance forced it on us ('it fell to us to...')",
    sayTarget: "Nos tocó esperar media hora.",
    tip: "Colombians use 'me toca / nos tocó' far more than 'tuve que' when outside circumstances forced the situation."
  },
  {
    id: "sb-rv-4",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Me hace falta el tinto de la mañana.",
    tts: "Me hace falta el tinto de la mañana.",
    en: "I miss / need my morning black coffee.",
    question: "How does 'hacer falta' work grammatically?",
    choices: [
      "The coffee 'makes lack to me' (coffee = subject)",
      "I am actively making coffee right now",
      "Coffee is forbidden this morning",
      "It means I have too much coffee"
    ],
    answer: "The coffee 'makes lack to me' (coffee = subject)",
    sayTarget: "Me hace falta el tinto de la mañana.",
    tip: "Just like 'gustar', the missing thing controls the verb: 'me hace falta un cable' (singular) vs. 'me hacen falta dos mil pesos' (plural)."
  },
  {
    id: "sb-rv-5",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "¡Le quedó buenísimo el ajiaco!",
    tts: "¡Le quedó buenísimo el ajiaco!",
    en: "The ajiaco turned out amazing for you!",
    question: "Who cooked / owns the result?",
    choices: [
      "Usted / Él / Ella (it 'turned out' great for you/them)",
      "Nobody — the soup isn't cooked yet",
      "Only the speaker cooked it",
      "There is leftover soup only"
    ],
    answer: "Usted / Él / Ella (it 'turned out' great for you/them)",
    sayTarget: "¡Le quedó buenísimo el ajiaco!",
    tip: "'Te quedó / le quedó + adjective' is the warmest Colombian compliment for cooking, haircuts, photos, or work ('how it turned out for you')."
  },
  {
    id: "sb-rv-6",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Se nos fue la luz por el aguacero.",
    tts: "Se nos fue la luz por el aguacero.",
    en: "Our power went out because of the downpour.",
    question: "Why does 'se nos fue' include 'nos'?",
    choices: [
      "It happened 'on us' — we were affected by the outage",
      "We left the house before the rain",
      "We turned off the breaker on purpose",
      "The rain stopped early"
    ],
    answer: "It happened 'on us' — we were affected by the outage",
    sayTarget: "Se nos fue la luz por el aguacero.",
    tip: "Adding 'nos / me / te' after 'se' marks who got hit by an unexpected event: 'se me acabó la batería', 'se nos pasó el bus'."
  },
  {
    id: "sb-rv-7",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Qué pena con usted, se me pasó la hora.",
    tts: "Qué pena con usted, se me pasó la hora.",
    en: "I'm so sorry, I completely lost track of time.",
    question: "How do you say 'It slipped our minds' using this same pattern?",
    choices: [
      "Se nos pasó.",
      "Nosotros pasamos la hora.",
      "Me pasé mucho tiempo.",
      "Lo pasaste por allá."
    ],
    answer: "Se nos pasó.",
    sayTarget: "Qué pena con usted, se me pasó la hora.",
    tip: "'Se me pasó' = 'it slipped past me'. Swap 'me' -> 'nos / te / le' to shift who forgot without changing 'pasó'."
  },
  {
    id: "sb-rv-8",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "¿No te provoca un pandebono?",
    tts: "¿No te provoca un pandebono?",
    en: "Doesn't a warm cheese bread sound tempting right now?",
    question: "Which English trap does 'provocar' replace in Colombia?",
    choices: [
      "Craving / appealing to someone (NOT picking a fight)",
      "Canceling a restaurant order",
      "Feeling embarrassed in public",
      "Paying by credit card"
    ],
    answer: "Craving / appealing to someone (NOT picking a fight)",
    sayTarget: "¿No te provoca un pandebono?",
    tip: "In Colombia '¿qué te provoca?' = 'what are you in the mood for?' — the food 'provokes appetite in you' (singular/plural like gustar)."
  },
  {
    id: "sb-rv-9",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Me urge hablar con el dueño.",
    tts: "Me urge hablar con el dueño.",
    en: "I urgently need to speak with the owner.",
    question: "What is the subject of 'urge'?",
    choices: [
      "Speaking with the owner (infinitive acts as 3rd-person singular)",
      "Me (yo)",
      "The owner is urgent",
      "Yesterday afternoon"
    ],
    answer: "Speaking with the owner (infinitive acts as 3rd-person singular)",
    sayTarget: "Me urge hablar con el dueño.",
    tip: "Like 'me falta' or 'me encanta', 'me urge + verb' puts the urgency onto the action itself."
  },
  {
    id: "sb-rv-10",
    kind: "reverse",
    badge: "🔄 Spanish Brain Flip",
    prompt: "Nos sobró bastante comida.",
    tts: "Nos sobró bastante comida.",
    en: "We ended up with plenty of leftover food.",
    question: "Which matches 'I'm missing 5 mil / I came up 5 mil short'?",
    choices: [
      "Me faltan cinco mil pesos.",
      "Yo falto cinco mil pesos.",
      "Me sobra cinco mil pesos.",
      "Se me olvidó cinco mil."
    ],
    answer: "Me faltan cinco mil pesos.",
    tip: "'Sobrar' = left over / too much; 'faltar' = missing / short. Because 'cinco mil pesos' is plural, say 'me faltan'."
  },

  // ── 3. Pronoun Stack Decoder (me lo / te la / se lo / dámelo) ───────────────
  {
    id: "sb-pr-1",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "¿Se lo mandaste por WhatsApp?",
    tts: "¿Se lo mandaste por WhatsApp?",
    en: "Did you send it to him/her via WhatsApp?",
    question: "Decode: Who sent -> What -> To whom?",
    choices: [
      "You (tú) -> something masculine -> to him/her/usted",
      "He/she -> something feminine -> to me",
      "I -> something masculine -> to myself",
      "They -> something plural -> to us"
    ],
    answer: "You (tú) -> something masculine -> to him/her/usted",
    sayTarget: "¿Se lo mandaste por WhatsApp?",
    tip: "Spanish forbids 'le lo', so 'le' morphs into 'se': SE (to him/her) + LO (it, masc. like 'el mensaje') + mandaste (you sent)."
  },
  {
    id: "sb-pr-2",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "Ya te la paso en un segundito.",
    tts: "Ya te la paso en un segundito.",
    en: "I'll pass/send it (fem.) to you in just a second.",
    question: "What does 'te la' tell you before the verb even finishes?",
    choices: [
      "To YOU + a FEMININE item (e.g., la foto / la dirección)",
      "To HIM + a MASCULINE item",
      "To ME + PLURAL items",
      "From YOU to THEM"
    ],
    answer: "To YOU + a FEMININE item (e.g., la foto / la dirección)",
    sayTarget: "Ya te la paso en un segundito.",
    tip: "Hear pronouns in strict order: [Recipient first: te = to you] + [Object second: la = feminine noun] + [Action: paso = I pass]."
  },
  {
    id: "sb-pr-3",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "Dámelo cuando puedas, porfa.",
    tts: "Dámelo cuando puedas, por favor.",
    en: "Give it to me whenever you can, please.",
    question: "Break down the attached tail '-melo':",
    choices: [
      "Give (tú command) + to ME + IT (masc.)",
      "Give (usted command) + to YOU + IT (fem.)",
      "We give + to THEM + IT",
      "I gave + to MYSELF"
    ],
    answer: "Give (tú command) + to ME + IT (masc.)",
    sayTarget: "Dámelo cuando puedas, por favor.",
    tip: "Positive commands glue pronouns directly to the verb end: da + me + lo = 'dámelo' (accent preserves stress on 'dá')."
  },
  {
    id: "sb-pr-4",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "No me lo digas todavía.",
    tts: "No me lo digas todavía.",
    en: "Don't tell me it yet.",
    question: "Why did '-melo' move in front of the verb here?",
    choices: [
      "Negative commands put pronouns BEFORE the verb",
      "Because 'me' means 'myself'",
      "Because it happened yesterday",
      "Because it's a question"
    ],
    answer: "Negative commands put pronouns BEFORE the verb",
    sayTarget: "No me lo digas todavía.",
    tip: "Positive = glue to the end ('dímelo'); Negative = ALWAYS place before the verb ('no me lo digas')."
  },
  {
    id: "sb-pr-5",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "Nos lo trajeron súper frío.",
    tts: "Nos lo trajeron súper frío.",
    en: "They brought it to us super cold.",
    question: "Decode: Who brought -> To whom -> What?",
    choices: [
      "They brought -> to US -> something masculine",
      "We brought -> to THEM -> something feminine",
      "You brought -> to ME -> plural drinks",
      "He brought -> to YOU -> food (fem.)"
    ],
    answer: "They brought -> to US -> something masculine",
    sayTarget: "Nos lo trajeron súper frío.",
    tip: "'Nos' (to us) + 'lo' (it, masc., e.g. el café / el almuerzo) + 'trajeron' (they brought)."
  },
  {
    id: "sb-pr-6",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "Se las guardé en la cocina.",
    tts: "Se las guardé en la cocina.",
    en: "I saved them (fem. plural) for you/him/her in the kitchen.",
    question: "What kind of items did the speaker put away?",
    choices: [
      "Feminine plural items (e.g., las arepas / las llaves)",
      "One masculine item",
      "People going to the kitchen",
      "One feminine item"
    ],
    answer: "Feminine plural items (e.g., las arepas / las llaves)",
    sayTarget: "Se las guardé en la cocina.",
    tip: "'Se' = to usted/him/her/them; 'las' = feminine plural objects; 'guardé' (-é) = I saved."
  },
  {
    id: "sb-pr-7",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "Déjelo ahí en portería, vecino.",
    tts: "Déjelo ahí en portería, vecino.",
    en: "Leave it there at the front desk, neighbor.",
    question: "Notice '-lo' attached to 'deje'. Who is speaking to whom?",
    choices: [
      "Addressing 'usted' politely, referring to one masc. package/item",
      "Addressing 'tú' casually about feminine keys",
      "Referring to 'we left it yesterday'",
      "Asking where the front desk is"
    ],
    answer: "Addressing 'usted' politely, referring to one masc. package/item",
    sayTarget: "Déjelo ahí en portería, vecino.",
    tip: "Very high-frequency Colombian intercom phrase: 'deje' (usted command) + 'lo' (el pedido / el paquete) = 'déjelo'."
  },
  {
    id: "sb-pr-8",
    kind: "pronouns",
    badge: "🧩 Who → What → Whom",
    prompt: "¿Me lo puede explicar otra vez?",
    tts: "¿Me lo puede explicar otra vez?",
    en: "Can you (usted) explain it to me one more time?",
    question: "Which equivalent phrasing puts the pronouns at the end?",
    choices: [
      "¿Puede explicármelo otra vez?",
      "¿Puede me lo explicar otra vez?",
      "¿Explicarlo me puede?",
      "¿Se lo puede explicarme?"
    ],
    answer: "¿Puede explicármelo otra vez?",
    sayTarget: "¿Me lo puede explicar otra vez?",
    tip: "With helper verbs ('puede / voy a / quiero + infinitive'), BOTH positions are 100% correct: 'me lo puede explicar' = 'puede explicármelo'."
  },

  // ── 4. Stress-Shift & Meaning-Flip Contrasts ────────────────────────────────
  {
    id: "sb-st-1",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "Ayer él habló con el dueño.",
    tts: "Ayer él habló con el dueño.",
    en: "Yesterday he spoke with the owner.",
    question: "How does 'HA-blo' differ from 'ha-BLÓ' when listening?",
    choices: [
      "Stress on 1st syllable = I speak now; stress on last (-ó) = he/she/usted spoke",
      "Only spelling changes — they sound identical",
      "'Habló' means 'we will speak'",
      "'Hablo' is always a noun"
    ],
    answer: "Stress on 1st syllable = I speak now; stress on last (-ó) = he/she/usted spoke",
    sayTarget: "Ayer él habló con el dueño.",
    tip: "Every regular -ar verb follows this golden contrast: 'canto/cantó', 'paso/pasó', 'trabajo/trabajó', 'pago/pagó'."
  },
  {
    id: "sb-st-2",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "El técnico ya está listo.",
    tts: "El técnico ya está listo.",
    en: "The technician is already ready.",
    question: "What would 'El técnico ES muy listo' mean instead?",
    choices: [
      "The technician IS very smart / clever (permanent trait)",
      "The technician arrived early",
      "The technician is busy today",
      "Both mean 'ready'"
    ],
    answer: "The technician IS very smart / clever (permanent trait)",
    sayTarget: "El técnico ya está listo.",
    tip: "Classic 'ser' vs. 'estar' meaning flip: 'ser listo' = smart/clever; 'estar listo' = ready!"
  },
  {
    id: "sb-st-3",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "Esta fruta está buenísima.",
    tts: "Esta fruta está buenísima.",
    en: "This fruit tastes delicious!",
    question: "Why use 'está buena' instead of 'es buena' for food?",
    choices: [
      "'Estar bueno/buenísimo' praises taste/experience right now; 'ser bueno' means healthy/moral quality",
      "'Es buena' is only for drinks",
      "'Está' is past tense here",
      "They cannot be used with food"
    ],
    answer: "'Estar bueno/buenísimo' praises taste/experience right now; 'ser bueno' means healthy/moral quality",
    sayTarget: "Esta fruta está buenísima.",
    tip: "Similarly: 'es aburrido' = he's a boring person; 'está aburrido' = he's feeling bored right now!"
  },
  {
    id: "sb-st-4",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "Avísame cuando llegues al hotel.",
    tts: "Avísame cuando llegues al hotel.",
    en: "Let me know when you arrive at the hotel.",
    question: "Why 'llegues' (subjunctive) instead of 'llegas'?",
    choices: [
      "Future event that hasn't happened yet ('cuando' triggers subjunctive)",
      "It is a habit every morning",
      "It happened yesterday afternoon",
      "Because 'hotel' is masculine"
    ],
    answer: "Future event that hasn't happened yet ('cuando' triggers subjunctive)",
    sayTarget: "Avísame cuando llegues al hotel.",
    tip: "'Cuando llegas' = whenever/habitually; 'Cuando llegues' = when you get there (future)! Native speakers rely on that 1-vowel shift constantly."
  },
  {
    id: "sb-st-5",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "Esta esquina vs. ¿Dónde está la esquina?",
    tts: "¿Dónde está esta esquina?",
    en: "Where is this corner?",
    question: "Hear the stress: 'ES-ta' vs 'es-TÁ'. Which is the verb 'is'?",
    choices: [
      "es-TÁ (final syllable stressed) = is located",
      "ES-ta (first syllable stressed) = is located",
      "Both mean 'this'",
      "es-TÁ means 'that one over there'"
    ],
    answer: "es-TÁ (final syllable stressed) = is located",
    sayTarget: "¿Dónde está esta esquina?",
    tip: "'ES-ta casa' = THIS house (demonstrative); 'es-TÁ aquí' = IS here. Listen for where the voice punches!"
  },
  {
    id: "sb-st-6",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "Necesito el informe para mañana por la mañana.",
    tts: "Necesito el informe para mañana por la mañana.",
    en: "I need the report by tomorrow morning.",
    question: "Why does 'para' come first and 'por' come second?",
    choices: [
      "'para' = deadline ('by tomorrow'); 'por' = time window ('during the morning')",
      "'por' always means deadline and 'para' means reason",
      "They are interchangeable here",
      "'para' only goes before verbs"
    ],
    answer: "'para' = deadline ('by tomorrow'); 'por' = time window ('during the morning')",
    sayTarget: "Necesito el informe para mañana por la mañana.",
    tip: "Mental shortcut: PARA points forward to a goal/deadline/destination; POR travels through a time window, price, or cause."
  },
  {
    id: "sb-st-7",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "Ayer supe la verdad.",
    tts: "Ayer supe la verdad.",
    en: "Yesterday I found out the truth.",
    question: "How does 'supe' (preterite) differ from 'sabía' (imperfect)?",
    choices: [
      "'supe' = the moment I found out; 'sabía' = ongoing background knowledge ('I already knew')",
      "'sabía' means I forgot everything",
      "'supe' means I still don't know",
      "Both mean 'I guessed'"
    ],
    answer: "'supe' = the moment I found out; 'sabía' = ongoing background knowledge ('I already knew')",
    sayTarget: "Ayer supe la verdad.",
    tip: "Key verb shifts in past: 'sabía' (knew) vs 'supe' (found out); 'conocía' (knew someone) vs 'conocí' (met for the first time)."
  },
  {
    id: "sb-st-8",
    kind: "stress",
    badge: "🎯 Stress & Contrast",
    prompt: "El papá come papa criolla.",
    tts: "El papá come papa criolla.",
    en: "The dad is eating Andean yellow potato.",
    question: "Which syllable carries stress for 'dad' vs. 'potato'?",
    choices: [
      "pa-PÁ = dad; PA-pa = potato",
      "PA-pa = dad; pa-PÁ = potato",
      "Both stress the first syllable",
      "Both stress the final syllable"
    ],
    answer: "pa-PÁ = dad; PA-pa = potato",
    sayTarget: "El papá come papa criolla.",
    tip: "One accent mark separates family from lunch! In Colombia 'papa criolla' are those golden baby potatoes served with ajiaco and picada."
  }
];
