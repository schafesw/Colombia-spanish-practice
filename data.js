// Spanish learning app data
// ── Alphabet ──────────────────────────────────────────────────────────────────
const VW=["a","e","i","o","u"],VL=["A","E","I","O","U"];
const AL=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const CN=AL.filter(l=>!VL.includes(l));
const LI={A:{name:"a",phonetic:"ah",tts:"a"},B:{name:"be",phonetic:"beh",tts:"be"},C:{name:"ce",phonetic:"seh",tts:"ce"},D:{name:"de",phonetic:"deh",tts:"de"},E:{name:"e",phonetic:"eh",tts:"e"},F:{name:"efe",phonetic:"EH-feh",tts:"efe"},G:{name:"ge",phonetic:"heh",tts:"ge"},H:{name:"hache",phonetic:"AH-cheh",tts:"hache"},I:{name:"i",phonetic:"ee",tts:"i"},J:{name:"jota",phonetic:"HOH-tah",tts:"jota"},K:{name:"ka",phonetic:"kah",tts:"ka"},L:{name:"ele",phonetic:"EH-leh",tts:"ele"},M:{name:"eme",phonetic:"EH-meh",tts:"eme"},N:{name:"ene",phonetic:"EH-neh",tts:"ene"},Ñ:{name:"eñe",phonetic:"EH-nyeh",tts:"eñe"},O:{name:"o",phonetic:"oh",tts:"o"},P:{name:"pe",phonetic:"peh",tts:"pe"},Q:{name:"cu",phonetic:"koo",tts:"cu"},R:{name:"erre",phonetic:"EH-rreh",tts:"erre"},S:{name:"ese",phonetic:"EH-seh",tts:"ese"},T:{name:"te",phonetic:"teh",tts:"te"},U:{name:"u",phonetic:"oo",tts:"u"},V:{name:"uve",phonetic:"OO-beh (=B)",tts:"uve"},W:{name:"doble ve",phonetic:"DOH-bleh beh",tts:"doble ve"},X:{name:"equis",phonetic:"EH-kees",tts:"equis"},Y:{name:"ye",phonetic:"yeh",tts:"ye"},Z:{name:"zeta",phonetic:"SEH-tah",tts:"zeta"}};
const VS={a:"ah",e:"eh",i:"ee",o:"oh",u:"oo"};
/* Spanish orthography on purpose: these strings are read by a SPANISH voice,
   so "dó/quí/só" come out right, while English-style "doh/kee/soh" would not. */
const SYL_TTS_FIX={do:"dó",go:"gó",he:"é",hi:"í",qi:"quí",to:"tó",ro:"ró",wu:"wú",zo:"só"};
/* X almost never starts a syllable in real Spanish — it lives between vowels.
   So instead of fake X+vowel syllables, the Sílabas tab shows real example words. */
const X_EXAMPLES=[
  {word:"Taxi",ph:"TAK-see",tts:"taxi",en:"taxi"},
  {word:"Examen",ph:"ek-SAH-men",tts:"examen",en:"exam"},
  {word:"Éxito",ph:"EK-see-toh",tts:"éxito",en:"success"},
];
function sylTTS(label,fallback){return SYL_TTS_FIX[label.toLowerCase()]||fallback||label.toLowerCase();}
function speakSyl(label,fallback){
  speak(sylTTS(label,fallback),0.75);
}
function gc(l,v){
  const pv={C:{a:{p:"kah",t:"ca",n:null},e:{p:"seh",t:"ce",n:"suena 's'"},i:{p:"see",t:"ci",n:"suena 's'"},o:{p:"koh",t:"co",n:null},u:{p:"koo",t:"cu",n:null}},G:{a:{p:"gah",t:"ga",n:null},e:{p:"heh",t:"ge",n:"suena 'j'"},i:{p:"hee",t:"gi",n:"suena 'j'"},o:{p:"goh",t:"go",n:null},u:{p:"goo",t:"gu",n:null}},H:{a:{p:"ah",t:"ha",n:"H muda"},e:{p:"eh",t:"he",n:"H muda"},i:{p:"ee",t:"hi",n:"H muda"},o:{p:"oh",t:"ho",n:"H muda"},u:{p:"oo",t:"hu",n:"H muda"}},Q:{a:{p:"kah",t:"qa",n:"usa QU"},e:{p:"keh",t:"que",n:"QUE='keh'"},i:{p:"kee",t:"qui",n:"QUI='kee'"},o:{p:"koh",t:"qo",n:"usa QU"},u:{p:"koo",t:"qu",n:"con U"}},
    V:{a:{p:"bah",t:"ba",n:"V=B en Colombia"},e:{p:"beh",t:"be",n:"V=B en Colombia"},i:{p:"bee",t:"bi",n:"V=B en Colombia"},o:{p:"boh",t:"bo",n:"V=B en Colombia"},u:{p:"boo",t:"bu",n:"V=B en Colombia"}},
    L:{a:{p:"lah",t:"la",n:null},e:{p:"leh",t:"le",n:null},i:{p:"lee",t:"li",n:null},o:{p:"loh",t:"lo",n:null},u:{p:"loo",t:"lu",n:null}},
    N:{a:{p:"nah",t:"na",n:null},e:{p:"neh",t:"ne",n:null},i:{p:"nee",t:"ni",n:null},o:{p:"noh",t:"no",n:null},u:{p:"noo",t:"nu",n:null}},
    Y:{a:{p:"yah",t:"ya",n:null},e:{p:"yeh",t:"ye",n:null},i:{p:"yee",t:"yi",n:"sonido 'y'"},o:{p:"yoh",t:"yo",n:null},u:{p:"yoo",t:"yu",n:null}},
  };
  if(pv[l])return pv[l][v];
  const s={B:"b",D:"d",F:"f",J:"j",K:"k",M:"m",Ñ:"ny",P:"p",R:"r",S:"s",T:"t",W:"w",X:"ks",Z:"s"};
  const n={J:"suena 'j'",X:"'ks' o 'j'",Z:"suena 's'",Ñ:"sonido 'ny'"};
  return{p:(s[l]||l.toLowerCase())+VS[v],t:(l==="Ñ"?"ñ":l.toLowerCase())+v,n:n[l]||null};
}

// ── VERB CONJUGATION DATA ─────────────────────────────────────────────────────
const VERBS={
  hablar:{en:"to speak / talk",type:"AR — Regular",icon:"🗣️",color:"#4aa8a0",
    gerund:{f:"hablando",en:"speaking"},participle:{f:"hablado",en:"spoken"},
    imperative:{tu:{f:"¡Habla!",en:"Speak! (informal)"},usted:{f:"¡Hable!",en:"Speak! (formal)"}},
    present:[{p:"yo",v:"hablo",e:"I speak"},{p:"tú",v:"hablas",e:"you speak"},{p:"él/ella",v:"habla",e:"he/she speaks"},{p:"nosotros",v:"hablamos",e:"we speak"},{p:"ellos",v:"hablan",e:"they speak"}],
    past:[{p:"yo",v:"hablé",e:"I spoke"},{p:"tú",v:"hablaste",e:"you spoke"},{p:"él/ella",v:"habló",e:"he/she spoke"},{p:"nosotros",v:"hablamos",e:"we spoke"},{p:"ellos",v:"hablaron",e:"they spoke"}],
    future:[{p:"yo",v:"hablaré",e:"I will speak"},{p:"tú",v:"hablarás",e:"you will speak"},{p:"él/ella",v:"hablará",e:"he/she will speak"},{p:"nosotros",v:"hablaremos",e:"we will speak"},{p:"ellos",v:"hablarán",e:"they will speak"}],
    family:[{f:"el habla",e:"speech / dialect",t:"sustantivo"},{f:"el/la hablante",e:"speaker",t:"sustantivo"},{f:"hablador/a",e:"talkative person",t:"adjetivo"},{f:"la hablada",e:"accent / way of talking",t:"sustantivo"}],
    example:{es:"Yo hablo un poco de español.",en:"I speak a little Spanish."}},
  comer:{en:"to eat",type:"ER — Regular",icon:"🍽️",color:"#f97316",
    gerund:{f:"comiendo",en:"eating"},participle:{f:"comido",en:"eaten"},
    imperative:{tu:{f:"¡Come!",en:"Eat! (informal)"},usted:{f:"¡Coma!",en:"Eat! (formal)"}},
    present:[{p:"yo",v:"como",e:"I eat"},{p:"tú",v:"comes",e:"you eat"},{p:"él/ella",v:"come",e:"he/she eats"},{p:"nosotros",v:"comemos",e:"we eat"},{p:"ellos",v:"comen",e:"they eat"}],
    past:[{p:"yo",v:"comí",e:"I ate"},{p:"tú",v:"comiste",e:"you ate"},{p:"él/ella",v:"comió",e:"he/she ate"},{p:"nosotros",v:"comimos",e:"we ate"},{p:"ellos",v:"comieron",e:"they ate"}],
    future:[{p:"yo",v:"comeré",e:"I will eat"},{p:"tú",v:"comerás",e:"you will eat"},{p:"él/ella",v:"comerá",e:"he/she will eat"},{p:"nosotros",v:"comeremos",e:"we will eat"},{p:"ellos",v:"comerán",e:"they will eat"}],
    family:[{f:"la comida",e:"food / meal",t:"sustantivo"},{f:"el comedor",e:"dining room",t:"sustantivo"},{f:"el/la comensal",e:"diner / guest",t:"sustantivo"},{f:"comestible",e:"edible",t:"adjetivo"}],
    example:{es:"¿Qué vas a comer?",en:"What are you going to eat?"}},
  vivir:{en:"to live",type:"IR — Regular",icon:"🏠",color:"#34d399",
    gerund:{f:"viviendo",en:"living"},participle:{f:"vivido",en:"lived"},
    imperative:{tu:{f:"¡Vive!",en:"Live! (informal)"},usted:{f:"¡Viva!",en:"Live! (formal) / Cheers!"}},
    present:[{p:"yo",v:"vivo",e:"I live"},{p:"tú",v:"vives",e:"you live"},{p:"él/ella",v:"vive",e:"he/she lives"},{p:"nosotros",v:"vivimos",e:"we live"},{p:"ellos",v:"viven",e:"they live"}],
    past:[{p:"yo",v:"viví",e:"I lived"},{p:"tú",v:"viviste",e:"you lived"},{p:"él/ella",v:"vivió",e:"he/she lived"},{p:"nosotros",v:"vivimos",e:"we lived"},{p:"ellos",v:"vivieron",e:"they lived"}],
    future:[{p:"yo",v:"viviré",e:"I will live"},{p:"tú",v:"vivirás",e:"you will live"},{p:"él/ella",v:"vivirá",e:"he/she will live"},{p:"nosotros",v:"viviremos",e:"we will live"},{p:"ellos",v:"vivirán",e:"they will live"}],
    family:[{f:"la vida",e:"life",t:"sustantivo"},{f:"la vivienda",e:"housing / home",t:"sustantivo"},{f:"vivo/a",e:"alive / lively",t:"adjetivo"},{f:"el/la vecino/a",e:"neighbour",t:"sustantivo"}],
    example:{es:"Vivo en Colombia.",en:"I live in Colombia."}},
  beber:{en:"to drink",type:"ER — Regular",icon:"🥤",color:"#60a5fa",
    gerund:{f:"bebiendo",en:"drinking"},participle:{f:"bebido",en:"drunk (drunk something)"},
    imperative:{tu:{f:"¡Bebe!",en:"Drink! (informal)"},usted:{f:"¡Beba!",en:"Drink! (formal)"}},
    present:[{p:"yo",v:"bebo",e:"I drink"},{p:"tú",v:"bebes",e:"you drink"},{p:"él/ella",v:"bebe",e:"he/she drinks"},{p:"nosotros",v:"bebemos",e:"we drink"},{p:"ellos",v:"beben",e:"they drink"}],
    past:[{p:"yo",v:"bebí",e:"I drank"},{p:"tú",v:"bebiste",e:"you drank"},{p:"él/ella",v:"bebió",e:"he/she drank"},{p:"nosotros",v:"bebimos",e:"we drank"},{p:"ellos",v:"bebieron",e:"they drank"}],
    future:[{p:"yo",v:"beberé",e:"I will drink"},{p:"tú",v:"beberás",e:"you will drink"},{p:"él/ella",v:"beberá",e:"he/she will drink"},{p:"nosotros",v:"beberemos",e:"we will drink"},{p:"ellos",v:"beberán",e:"they will drink"}],
    family:[{f:"la bebida",e:"drink / beverage",t:"sustantivo"},{f:"el bebedor",e:"drinker",t:"sustantivo"},{f:"bebible",e:"drinkable",t:"adjetivo"},{f:"la bebida alcohólica",e:"alcoholic drink",t:"sustantivo"}],
    example:{es:"¿Qué bebida quieres?",en:"What drink do you want?"}},
  trabajar:{en:"to work",type:"AR — Regular",icon:"💼",color:"#e8b44a",
    gerund:{f:"trabajando",en:"working"},participle:{f:"trabajado",en:"worked"},
    imperative:{tu:{f:"¡Trabaja!",en:"Work! (informal)"},usted:{f:"¡Trabaje!",en:"Work! (formal)"}},
    present:[{p:"yo",v:"trabajo",e:"I work"},{p:"tú",v:"trabajas",e:"you work"},{p:"él/ella",v:"trabaja",e:"he/she works"},{p:"nosotros",v:"trabajamos",e:"we work"},{p:"ellos",v:"trabajan",e:"they work"}],
    past:[{p:"yo",v:"trabajé",e:"I worked"},{p:"tú",v:"trabajaste",e:"you worked"},{p:"él/ella",v:"trabajó",e:"he/she worked"},{p:"nosotros",v:"trabajamos",e:"we worked"},{p:"ellos",v:"trabajaron",e:"they worked"}],
    future:[{p:"yo",v:"trabajaré",e:"I will work"},{p:"tú",v:"trabajarás",e:"you will work"},{p:"él/ella",v:"trabajará",e:"he/she will work"},{p:"nosotros",v:"trabajaremos",e:"we will work"},{p:"ellos",v:"trabajarán",e:"they will work"}],
    family:[{f:"el trabajo",e:"work / job",t:"sustantivo"},{f:"el/la trabajador/a",e:"worker",t:"sustantivo"},{f:"trabajador/a",e:"hardworking",t:"adjetivo"},{f:"el taller",e:"workshop",t:"sustantivo"}],
    example:{es:"Trabajo en una empresa colombiana.",en:"I work at a Colombian company."}},
  comprar:{en:"to buy",type:"AR — Regular",icon:"🛍️",color:"#ec4899",
    gerund:{f:"comprando",en:"buying"},participle:{f:"comprado",en:"bought"},
    imperative:{tu:{f:"¡Compra!",en:"Buy! (informal)"},usted:{f:"¡Compre!",en:"Buy! (formal)"}},
    present:[{p:"yo",v:"compro",e:"I buy"},{p:"tú",v:"compras",e:"you buy"},{p:"él/ella",v:"compra",e:"he/she buys"},{p:"nosotros",v:"compramos",e:"we buy"},{p:"ellos",v:"compran",e:"they buy"}],
    past:[{p:"yo",v:"compré",e:"I bought"},{p:"tú",v:"compraste",e:"you bought"},{p:"él/ella",v:"compró",e:"he/she bought"},{p:"nosotros",v:"compramos",e:"we bought"},{p:"ellos",v:"compraron",e:"they bought"}],
    future:[{p:"yo",v:"compraré",e:"I will buy"},{p:"tú",v:"comprarás",e:"you will buy"},{p:"él/ella",v:"comprará",e:"he/she will buy"},{p:"nosotros",v:"compraremos",e:"we will buy"},{p:"ellos",v:"comprarán",e:"they will buy"}],
    family:[{f:"la compra",e:"purchase / shopping",t:"sustantivo"},{f:"el/la comprador/a",e:"buyer / shopper",t:"sustantivo"},{f:"las compras",e:"shopping (groceries)",t:"sustantivo"},{f:"el supermercado",e:"supermarket",t:"sustantivo"}],
    example:{es:"Fui a comprar en el mercado.",en:"I went to shop at the market."}},
  ir:{en:"to go",type:"Irregular",icon:"🚶",color:"#a78bfa",
    gerund:{f:"yendo",en:"going"},participle:{f:"ido",en:"gone"},
    imperative:{tu:{f:"¡Ve!",en:"Go! (informal)"},usted:{f:"¡Vaya!",en:"Go! (formal)"}},
    present:[{p:"yo",v:"voy",e:"I go"},{p:"tú",v:"vas",e:"you go"},{p:"él/ella",v:"va",e:"he/she goes"},{p:"nosotros",v:"vamos",e:"we go"},{p:"ellos",v:"van",e:"they go"}],
    past:[{p:"yo",v:"fui",e:"I went"},{p:"tú",v:"fuiste",e:"you went"},{p:"él/ella",v:"fue",e:"he/she went"},{p:"nosotros",v:"fuimos",e:"we went"},{p:"ellos",v:"fueron",e:"they went"}],
    future:[{p:"yo",v:"iré",e:"I will go"},{p:"tú",v:"irás",e:"you will go"},{p:"él/ella",v:"irá",e:"he/she will go"},{p:"nosotros",v:"iremos",e:"we will go"},{p:"ellos",v:"irán",e:"they will go"}],
    family:[{f:"la ida",e:"going / outward journey",t:"sustantivo"},{f:"la vuelta",e:"return / coming back",t:"sustantivo"},{f:"el viaje",e:"trip / journey",t:"sustantivo"},{f:"vamos a...",e:"let's go to... / going to...",t:"expresión"}],
    example:{es:"¿A dónde vas mañana?",en:"Where are you going tomorrow?"}},
  ser:{en:"to be (permanent)",type:"Irregular",icon:"⭐",color:"#a78bfa",
    gerund:{f:"siendo",en:"being"},participle:{f:"sido",en:"been"},
    imperative:{tu:{f:"¡Sé!",en:"Be! (informal)"},usted:{f:"¡Sea!",en:"Be! (formal)"}},
    present:[{p:"yo",v:"soy",e:"I am"},{p:"tú",v:"eres",e:"you are"},{p:"él/ella",v:"es",e:"he/she is"},{p:"nosotros",v:"somos",e:"we are"},{p:"ellos",v:"son",e:"they are"}],
    past:[{p:"yo",v:"fui",e:"I was"},{p:"tú",v:"fuiste",e:"you were"},{p:"él/ella",v:"fue",e:"he/she was"},{p:"nosotros",v:"fuimos",e:"we were"},{p:"ellos",v:"fueron",e:"they were"}],
    future:[{p:"yo",v:"seré",e:"I will be"},{p:"tú",v:"serás",e:"you will be"},{p:"él/ella",v:"será",e:"he/she will be"},{p:"nosotros",v:"seremos",e:"we will be"},{p:"ellos",v:"serán",e:"they will be"}],
    family:[{f:"el ser",e:"being / creature",t:"sustantivo"},{f:"la persona",e:"person",t:"sustantivo"},{f:"la identidad",e:"identity",t:"sustantivo"},{f:"propio/a",e:"own / one's own",t:"adjetivo"}],
    example:{es:"Soy colombiano. ¿Y tú?",en:"I'm Colombian. And you?"}},
  estar:{en:"to be (temporary/location)",type:"Irregular",icon:"📍",color:"#60a5fa",
    gerund:{f:"estando",en:"being"},participle:{f:"estado",en:"been"},
    imperative:{tu:{f:"¡Estate!",en:"Stay! (informal)"},usted:{f:"¡Esté!",en:"Be! (formal)"}},
    present:[{p:"yo",v:"estoy",e:"I am"},{p:"tú",v:"estás",e:"you are"},{p:"él/ella",v:"está",e:"he/she is"},{p:"nosotros",v:"estamos",e:"we are"},{p:"ellos",v:"están",e:"they are"}],
    past:[{p:"yo",v:"estuve",e:"I was"},{p:"tú",v:"estuviste",e:"you were"},{p:"él/ella",v:"estuvo",e:"he/she was"},{p:"nosotros",v:"estuvimos",e:"we were"},{p:"ellos",v:"estuvieron",e:"they were"}],
    future:[{p:"yo",v:"estaré",e:"I will be"},{p:"tú",v:"estarás",e:"you will be"},{p:"él/ella",v:"estará",e:"he/she will be"},{p:"nosotros",v:"estaremos",e:"we will be"},{p:"ellos",v:"estarán",e:"they will be"}],
    family:[{f:"el estado",e:"state / condition",t:"sustantivo"},{f:"la estancia",e:"stay / ranch",t:"sustantivo"},{f:"estable",e:"stable",t:"adjetivo"},{f:"bien/mal",e:"well/bad (used with estar)",t:"adjetivo"}],
    example:{es:"¿Cómo estás? Estoy bien.",en:"How are you? I'm fine."}},
  tener:{en:"to have",type:"Irregular",icon:"✋",color:"#f59e0b",
    gerund:{f:"teniendo",en:"having"},participle:{f:"tenido",en:"had"},
    imperative:{tu:{f:"¡Ten!",en:"Have/Take! (informal)"},usted:{f:"¡Tenga!",en:"Have/Take! (formal)"}},
    present:[{p:"yo",v:"tengo",e:"I have"},{p:"tú",v:"tienes",e:"you have"},{p:"él/ella",v:"tiene",e:"he/she has"},{p:"nosotros",v:"tenemos",e:"we have"},{p:"ellos",v:"tienen",e:"they have"}],
    past:[{p:"yo",v:"tuve",e:"I had"},{p:"tú",v:"tuviste",e:"you had"},{p:"él/ella",v:"tuvo",e:"he/she had"},{p:"nosotros",v:"tuvimos",e:"we had"},{p:"ellos",v:"tuvieron",e:"they had"}],
    future:[{p:"yo",v:"tendré",e:"I will have"},{p:"tú",v:"tendrás",e:"you will have"},{p:"él/ella",v:"tendrá",e:"he/she will have"},{p:"nosotros",v:"tendremos",e:"we will have"},{p:"ellos",v:"tendrán",e:"they will have"}],
    family:[{f:"el tenedor",e:"fork",t:"sustantivo"},{f:"la tenencia",e:"possession / holding",t:"sustantivo"},{f:"el/la dueño/a",e:"owner",t:"sustantivo"},{f:"tener que",e:"to have to (must)",t:"expresión"}],
    example:{es:"Tengo treinta años. ¿Cuántos años tienes tú?",en:"I'm thirty years old. How old are you?"}},
  hacer:{en:"to do / to make",type:"Irregular",icon:"🛠️",color:"#34d399",
    gerund:{f:"haciendo",en:"doing/making"},participle:{f:"hecho",en:"done/made"},
    imperative:{tu:{f:"¡Haz!",en:"Do/Make! (informal)"},usted:{f:"¡Haga!",en:"Do/Make! (formal)"}},
    present:[{p:"yo",v:"hago",e:"I do/make"},{p:"tú",v:"haces",e:"you do/make"},{p:"él/ella",v:"hace",e:"he/she does/makes"},{p:"nosotros",v:"hacemos",e:"we do/make"},{p:"ellos",v:"hacen",e:"they do/make"}],
    past:[{p:"yo",v:"hice",e:"I did/made"},{p:"tú",v:"hiciste",e:"you did/made"},{p:"él/ella",v:"hizo",e:"he/she did/made"},{p:"nosotros",v:"hicimos",e:"we did/made"},{p:"ellos",v:"hicieron",e:"they did/made"}],
    future:[{p:"yo",v:"haré",e:"I will do/make"},{p:"tú",v:"harás",e:"you will do/make"},{p:"él/ella",v:"hará",e:"he/she will do/make"},{p:"nosotros",v:"haremos",e:"we will do/make"},{p:"ellos",v:"harán",e:"they will do/make"}],
    family:[{f:"el hecho",e:"fact / deed (done!)",t:"sustantivo"},{f:"la hazaña",e:"feat / achievement",t:"sustantivo"},{f:"hacedero/a",e:"doable / feasible",t:"adjetivo"},{f:"hacer una vuelta",e:"to run an errand (Colombian!)",t:"expresión"}],
    example:{es:"¿Qué haces hoy?",en:"What are you doing today?"}},
  poder:{en:"can / to be able to",type:"Irregular (stem-change)",icon:"💪",color:"#ef4444",
    gerund:{f:"pudiendo",en:"being able to"},participle:{f:"podido",en:"been able to"},
    imperative:{tu:{f:"¡Puede!",en:"You can! (rare as command)"},usted:{f:"—",en:"Rarely used as imperative"}},
    present:[{p:"yo",v:"puedo",e:"I can"},{p:"tú",v:"puedes",e:"you can"},{p:"él/ella",v:"puede",e:"he/she can"},{p:"nosotros",v:"podemos",e:"we can"},{p:"ellos",v:"pueden",e:"they can"}],
    past:[{p:"yo",v:"pude",e:"I could"},{p:"tú",v:"pudiste",e:"you could"},{p:"él/ella",v:"pudo",e:"he/she could"},{p:"nosotros",v:"pudimos",e:"we could"},{p:"ellos",v:"pudieron",e:"they could"}],
    future:[{p:"yo",v:"podré",e:"I will be able to"},{p:"tú",v:"podrás",e:"you will be able to"},{p:"él/ella",v:"podrá",e:"he/she will be able to"},{p:"nosotros",v:"podremos",e:"we will be able to"},{p:"ellos",v:"podrán",e:"they will be able to"}],
    family:[{f:"el poder",e:"power",t:"sustantivo"},{f:"poderoso/a",e:"powerful",t:"adjetivo"},{f:"posible",e:"possible",t:"adjetivo"},{f:"¿Puede ayudarme?",e:"Can you help me?",t:"expresión"}],
    example:{es:"¿Puede repetir, por favor?",en:"Can you repeat, please?"}},
  querer:{en:"to want / to love",type:"Irregular (stem-change)",icon:"❤️",color:"#e85d75",
    gerund:{f:"queriendo",en:"wanting/loving"},participle:{f:"querido",en:"wanted/loved"},
    imperative:{tu:{f:"¡Quiere!",en:"Want/Love! (informal)"},usted:{f:"¡Quiera!",en:"Please want (formal, rare)"}},
    present:[{p:"yo",v:"quiero",e:"I want/love"},{p:"tú",v:"quieres",e:"you want/love"},{p:"él/ella",v:"quiere",e:"he/she wants/loves"},{p:"nosotros",v:"queremos",e:"we want/love"},{p:"ellos",v:"quieren",e:"they want/love"}],
    past:[{p:"yo",v:"quise",e:"I wanted/loved"},{p:"tú",v:"quisiste",e:"you wanted"},{p:"él/ella",v:"quiso",e:"he/she wanted"},{p:"nosotros",v:"quisimos",e:"we wanted"},{p:"ellos",v:"quisieron",e:"they wanted"}],
    future:[{p:"yo",v:"querré",e:"I will want"},{p:"tú",v:"querrás",e:"you will want"},{p:"él/ella",v:"querrá",e:"he/she will want"},{p:"nosotros",v:"querremos",e:"we will want"},{p:"ellos",v:"querrán",e:"they will want"}],
    family:[{f:"el/la querido/a",e:"dear / darling",t:"sustantivo/adjetivo"},{f:"el querer",e:"love / affection",t:"sustantivo"},{f:"querido/a",e:"dear / beloved",t:"adjetivo"},{f:"querer decir",e:"to mean (to want to say)",t:"expresión"}],
    example:{es:"Te quiero mucho. ¿Qué quieres comer?",en:"I love you a lot. What do you want to eat?"}},
  dormir:{en:"to sleep",type:"IR — Irregular (stem-change)",icon:"😴",color:"#8b5cf6",
    gerund:{f:"durmiendo",en:"sleeping"},participle:{f:"dormido",en:"slept/asleep"},
    imperative:{tu:{f:"¡Duerme!",en:"Sleep! (informal)"},usted:{f:"¡Duerma!",en:"Sleep! (formal)"}},
    present:[{p:"yo",v:"duermo",e:"I sleep"},{p:"tú",v:"duermes",e:"you sleep"},{p:"él/ella",v:"duerme",e:"he/she sleeps"},{p:"nosotros",v:"dormimos",e:"we sleep"},{p:"ellos",v:"duermen",e:"they sleep"}],
    past:[{p:"yo",v:"dormí",e:"I slept"},{p:"tú",v:"dormiste",e:"you slept"},{p:"él/ella",v:"durmió",e:"he/she slept"},{p:"nosotros",v:"dormimos",e:"we slept"},{p:"ellos",v:"durmieron",e:"they slept"}],
    future:[{p:"yo",v:"dormiré",e:"I will sleep"},{p:"tú",v:"dormirás",e:"you will sleep"},{p:"él/ella",v:"dormirá",e:"he/she will sleep"},{p:"nosotros",v:"dormiremos",e:"we will sleep"},{p:"ellos",v:"dormirán",e:"they will sleep"}],
    family:[{f:"el sueño",e:"sleep / dream",t:"sustantivo"},{f:"el dormitorio",e:"bedroom",t:"sustantivo"},{f:"dormido/a",e:"asleep",t:"adjetivo"},{f:"la siesta",e:"nap / siesta",t:"sustantivo"}],
    example:{es:"Dormí ocho horas anoche.",en:"I slept eight hours last night."}},
  escribir:{en:"to write",type:"IR — Regular",icon:"✍️",color:"#06b6d4",
    gerund:{f:"escribiendo",en:"writing"},participle:{f:"escrito",en:"written (irregular!)"},
    imperative:{tu:{f:"¡Escribe!",en:"Write! (informal)"},usted:{f:"¡Escriba!",en:"Write! (formal)"}},
    present:[{p:"yo",v:"escribo",e:"I write"},{p:"tú",v:"escribes",e:"you write"},{p:"él/ella",v:"escribe",e:"he/she writes"},{p:"nosotros",v:"escribimos",e:"we write"},{p:"ellos",v:"escriben",e:"they write"}],
    past:[{p:"yo",v:"escribí",e:"I wrote"},{p:"tú",v:"escribiste",e:"you wrote"},{p:"él/ella",v:"escribió",e:"he/she wrote"},{p:"nosotros",v:"escribimos",e:"we wrote"},{p:"ellos",v:"escribieron",e:"they wrote"}],
    future:[{p:"yo",v:"escribiré",e:"I will write"},{p:"tú",v:"escribirás",e:"you will write"},{p:"él/ella",v:"escribirá",e:"he/she will write"},{p:"nosotros",v:"escribiremos",e:"we will write"},{p:"ellos",v:"escribirán",e:"they will write"}],
    family:[{f:"la escritura",e:"writing / handwriting",t:"sustantivo"},{f:"escrito/a",e:"written",t:"adjetivo"},{f:"el/la escritor/a",e:"writer / author",t:"sustantivo"},{f:"la carta",e:"letter (written)",t:"sustantivo"}],
    example:{es:"Escríbalo, por favor.",en:"Write it down, please."}},
};

// ── Numbers ───────────────────────────────────────────────────────────────────
const N130=[{n:1,w:"Uno",ph:"OO-noh"},{n:2,w:"Dos",ph:"dohs"},{n:3,w:"Tres",ph:"trehs"},{n:4,w:"Cuatro",ph:"KWAH-troh"},{n:5,w:"Cinco",ph:"SEEN-koh"},{n:6,w:"Seis",ph:"seh-ees"},{n:7,w:"Siete",ph:"SYEH-teh"},{n:8,w:"Ocho",ph:"OH-choh"},{n:9,w:"Nueve",ph:"NWEH-beh"},{n:10,w:"Diez",ph:"dyehs"},{n:11,w:"Once",ph:"ON-seh"},{n:12,w:"Doce",ph:"DOH-seh"},{n:13,w:"Trece",ph:"TREH-seh"},{n:14,w:"Catorce",ph:"kah-TOR-seh"},{n:15,w:"Quince",ph:"KEEN-seh"},{n:16,w:"Dieciséis",ph:"dyeh-see-SEYS"},{n:17,w:"Diecisiete",ph:"dyeh-see-SYEH-teh"},{n:18,w:"Dieciocho",ph:"dyeh-see-OH-choh"},{n:19,w:"Diecinueve",ph:"dyeh-see-NWEH-beh"},{n:20,w:"Veinte",ph:"BEYN-teh"},{n:21,w:"Veintiuno",ph:"beyn-tee-OO-noh"},{n:22,w:"Veintidós",ph:"beyn-tee-DOHS"},{n:23,w:"Veintitrés",ph:"beyn-tee-TREHS"},{n:24,w:"Veinticuatro",ph:"beyn-tee-KWAH-troh"},{n:25,w:"Veinticinco",ph:"beyn-tee-SEEN-koh"},{n:26,w:"Veintiséis",ph:"beyn-tee-SEYS"},{n:27,w:"Veintisiete",ph:"beyn-tee-SYEH-teh"},{n:28,w:"Veintiocho",ph:"beyn-tee-OH-choh"},{n:29,w:"Veintinueve",ph:"beyn-tee-NWEH-beh"},{n:30,w:"Treinta",ph:"TREYN-tah"}];
const NT=[{n:40,w:"Cuarenta",ph:"kwah-REN-tah"},{n:50,w:"Cincuenta",ph:"seen-KWEN-tah"},{n:60,w:"Sesenta",ph:"seh-SEN-tah"},{n:70,w:"Setenta",ph:"seh-TEN-tah"},{n:80,w:"Ochenta",ph:"oh-CHEN-tah"},{n:90,w:"Noventa",ph:"noh-BEN-tah"},{n:100,w:"Cien",ph:"syen"},{n:200,w:"Doscientos",ph:"dohs-SYEN-tohs"},{n:300,w:"Trescientos",ph:"trehs-SYEN-tohs"},{n:400,w:"Cuatrocientos",ph:"kwah-troh-SYEN-tohs"},{n:500,w:"Quinientos",ph:"kee-NYEN-tohs"}];

// ── All Vocab Categories ──────────────────────────────────────────────────────
const VC=[
  {id:"vocales",label:"🐝 Vocales",type:"vocales"},
  {id:"numeros",label:"🔢 Números",type:"numeros"},
  {id:"meses",label:"📆 Meses",type:"basic",items:[
    {word:"Enero",en:"January",ph:"eh-NEH-roh",tts:"enero",icon:"❄️",color:"#60a5fa"},
    {word:"Febrero",en:"February",ph:"feh-BREH-roh",tts:"febrero",icon:"💝",color:"#f43f5e"},
    {word:"Marzo",en:"March",ph:"MAR-soh",tts:"marzo",icon:"🌱",color:"#34d399"},
    {word:"Abril",en:"April",ph:"ah-BREEL",tts:"abril",icon:"🌸",color:"#f9a8d4"},
    {word:"Mayo",en:"May",ph:"MAH-yoh",tts:"mayo",icon:"🌻",color:"#fbbf24"},
    {word:"Junio",en:"June",ph:"HOO-nyoh",tts:"junio",icon:"☀️",color:"#fb923c"},
    {word:"Julio",en:"July",ph:"HOO-lyoh",tts:"julio",icon:"🏖️",color:"#f59e0b"},
    {word:"Agosto",en:"August",ph:"ah-GOHS-toh",tts:"agosto",icon:"🌞",color:"#ef4444"},
    {word:"Septiembre",en:"September",ph:"sep-TYEM-breh",tts:"septiembre",icon:"🍂",color:"#d97706"},
    {word:"Octubre",en:"October",ph:"ok-TOO-breh",tts:"octubre",icon:"🎃",color:"#f97316"},
    {word:"Noviembre",en:"November",ph:"noh-BYEM-breh",tts:"noviembre",icon:"🍁",color:"#92400e"},
    {word:"Diciembre",en:"December",ph:"dee-SYEM-breh",tts:"diciembre",icon:"🎄",color:"#4aa8a0"},
  ]},
  {id:"colores",label:"🎨 Colores",type:"basic",items:[{word:"Rojo",en:"Red",ph:"RROH-hoh",tts:"rojo",icon:"🔴",color:"#ef4444"},{word:"Azul",en:"Blue",ph:"ah-SOOL",tts:"azul",icon:"🔵",color:"#3b82f6"},{word:"Verde",en:"Green",ph:"BER-deh",tts:"verde",icon:"🟢",color:"#10b981"},{word:"Amarillo",en:"Yellow",ph:"ah-mah-REE-yoh",tts:"amarillo",icon:"🟡",color:"#f59e0b"},{word:"Naranja",en:"Orange",ph:"nah-RAN-hah",tts:"naranja",icon:"🟠",color:"#f97316"},{word:"Rosado",en:"Pink",ph:"roh-SAH-doh",tts:"rosado",icon:"🩷",color:"#ec4899"},{word:"Morado",en:"Purple",ph:"moh-RAH-doh",tts:"morado",icon:"🟣",color:"#8b5cf6"},{word:"Blanco",en:"White",ph:"BLAN-koh",tts:"blanco",icon:"⬜",color:"#94a3b8"},{word:"Negro",en:"Black",ph:"NEH-groh",tts:"negro",icon:"⬛",color:"#475569"},{word:"Café",en:"Brown",ph:"kah-FEH",tts:"café",icon:"🟫",color:"#92400e"},{word:"Gris",en:"Gray",ph:"grees",tts:"gris",icon:"🩶",color:"#64748b"}]},
  {id:"dias",label:"📅 Los Días",type:"basic",items:[{word:"Lunes",en:"Monday",ph:"LOO-nehs",tts:"lunes",icon:"1️⃣",color:"#4aa8a0"},{word:"Martes",en:"Tuesday",ph:"MAR-tehs",tts:"martes",icon:"2️⃣",color:"#4aa8a0"},{word:"Miércoles",en:"Wednesday",ph:"MYER-koh-lehs",tts:"miércoles",icon:"3️⃣",color:"#4aa8a0"},{word:"Jueves",en:"Thursday",ph:"HWEH-behs",tts:"jueves",icon:"4️⃣",color:"#4aa8a0"},{word:"Viernes",en:"Friday",ph:"BYER-nehs",tts:"viernes",icon:"5️⃣",color:"#4aa8a0"},{word:"Sábado",en:"Saturday",ph:"SAH-bah-doh",tts:"sábado",icon:"6️⃣",color:"#e8b44a"},{word:"Domingo",en:"Sunday",ph:"doh-MEEN-goh",tts:"domingo",icon:"7️⃣",color:"#e8b44a"}]},
  {id:"familia",label:"👨‍👩‍👧 Familia",type:"basic",items:[{word:"Mamá",en:"Mom",ph:"mah-MAH",tts:"mamá",icon:"👩",color:"#ec4899"},{word:"Papá",en:"Dad",ph:"pah-PAH",tts:"papá",icon:"👨",color:"#3b82f6"},{word:"Hermano",en:"Brother",ph:"er-MAH-noh",tts:"hermano",icon:"👦",color:"#10b981"},{word:"Hermana",en:"Sister",ph:"er-MAH-nah",tts:"hermana",icon:"👧",color:"#f59e0b"},{word:"Abuelo",en:"Grandfather",ph:"ah-BWEH-loh",tts:"abuelo",icon:"👴",color:"#8b5cf6"},{word:"Abuela",en:"Grandmother",ph:"ah-BWEH-lah",tts:"abuela",icon:"👵",color:"#e85d75"},{word:"Tío",en:"Uncle",ph:"TEE-oh",tts:"tío",icon:"🧑",color:"#4aa8a0"},{word:"Tía",en:"Aunt",ph:"TEE-ah",tts:"tía",icon:"👩",color:"#a78bfa"},{word:"Hijo",en:"Son",ph:"EE-hoh",tts:"hijo",icon:"👦",color:"#34d399"},{word:"Hija",en:"Daughter",ph:"EE-hah",tts:"hija",icon:"👧",color:"#fb923c"}]},
  {id:"verbos",label:"🏃 Verbos",type:"verbos"},
  {id:"cuerpo",label:"🫀 Cuerpo",type:"basic",items:[{word:"Cabeza",en:"Head",ph:"kah-BEH-sah",tts:"cabeza",icon:"🧠",color:"#e85d75"},{word:"Ojo",en:"Eye",ph:"OH-hoh",tts:"ojo",icon:"👁️",color:"#60a5fa"},{word:"Oreja",en:"Ear",ph:"oh-REH-hah",tts:"oreja",icon:"👂",color:"#f59e0b"},{word:"Nariz",en:"Nose",ph:"nah-REES",tts:"nariz",icon:"👃",color:"#f97316"},{word:"Boca",en:"Mouth",ph:"BOH-kah",tts:"boca",icon:"👄",color:"#e85d75"},{word:"Cuello",en:"Neck",ph:"KWEH-yoh",tts:"cuello",icon:"🔵",color:"#4aa8a0"},{word:"Hombro",en:"Shoulder",ph:"OHM-broh",tts:"hombro",icon:"💪",color:"#a78bfa"},{word:"Brazo",en:"Arm",ph:"BRAH-soh",tts:"brazo",icon:"💪",color:"#3b82f6"},{word:"Mano",en:"Hand",ph:"MAH-noh",tts:"mano",icon:"✋",color:"#f59e0b"},{word:"Dedo",en:"Finger",ph:"DEH-doh",tts:"dedo",icon:"☝️",color:"#fb923c"},{word:"Pierna",en:"Leg",ph:"PYER-nah",tts:"pierna",icon:"🦵",color:"#34d399"},{word:"Pie",en:"Foot",ph:"pyeh",tts:"pie",icon:"🦶",color:"#e85d75"},{word:"Corazón",en:"Heart",ph:"koh-rah-SOHN",tts:"corazón",icon:"❤️",color:"#ef4444"},{word:"Estómago",en:"Stomach",ph:"ehs-TOH-mah-goh",tts:"estómago",icon:"🫄",color:"#f97316"},{word:"Espalda",en:"Back",ph:"ehs-PAL-dah",tts:"espalda",icon:"🔵",color:"#8b5cf6"}]},
  {id:"comida",label:"🍽️ Comida",type:"basic",items:[{word:"Agua",en:"Water",ph:"AH-gwah",tts:"agua",icon:"💧",color:"#60a5fa"},{word:"Café",en:"Coffee",ph:"kah-FEH",tts:"café",icon:"☕",color:"#92400e"},{word:"Tinto",en:"Black coffee (Colombian!)",ph:"TEEN-toh",tts:"tinto",icon:"☕",color:"#7c2d12"},{word:"Jugo",en:"Juice",ph:"HOO-goh",tts:"jugo",icon:"🧃",color:"#f59e0b"},{word:"Cerveza",en:"Beer",ph:"ser-BEH-sah",tts:"cerveza",icon:"🍺",color:"#d97706"},{word:"Leche",en:"Milk",ph:"LEH-cheh",tts:"leche",icon:"🥛",color:"#94a3b8"},{word:"Pan",en:"Bread",ph:"pan",tts:"pan",icon:"🍞",color:"#d97706"},{word:"Arroz",en:"Rice",ph:"ah-RROHS",tts:"arroz",icon:"🍚",color:"#94a3b8"},{word:"Pollo",en:"Chicken",ph:"POH-yoh",tts:"pollo",icon:"🍗",color:"#f59e0b"},{word:"Carne",en:"Meat / Beef",ph:"KAR-neh",tts:"carne",icon:"🥩",color:"#ef4444"},{word:"Arepa",en:"Arepa (Colombian!)",ph:"ah-REH-pah",tts:"arepa",icon:"🫓",color:"#f59e0b"},{word:"Aguacate",en:"Avocado",ph:"ah-gwah-KAH-teh",tts:"aguacate",icon:"🥑",color:"#34d399"},{word:"Fruta",en:"Fruit",ph:"FROO-tah",tts:"fruta",icon:"🍎",color:"#e85d75"},{word:"Huevo",en:"Egg",ph:"WEH-boh",tts:"huevo",icon:"🥚",color:"#fbbf24"},{word:"Bandeja paisa",en:"Traditional Colombian meal",ph:"ban-DEH-hah PAY-sah",tts:"bandeja paisa",icon:"🍛",color:"#f97316"}]},
  {id:"lugares",label:"📍 Lugares",type:"basic",items:[{word:"Casa",en:"House / Home",ph:"KAH-sah",tts:"casa",icon:"🏠",color:"#4aa8a0"},{word:"Tienda",en:"Shop / Store",ph:"TYEN-dah",tts:"tienda",icon:"🏪",color:"#f59e0b"},{word:"Mercado",en:"Market",ph:"mer-KAH-doh",tts:"mercado",icon:"🛒",color:"#34d399"},{word:"Banco",en:"Bank",ph:"BAN-koh",tts:"banco",icon:"🏦",color:"#60a5fa"},{word:"Hospital",en:"Hospital",ph:"ohs-pee-TAL",tts:"hospital",icon:"🏥",color:"#ef4444"},{word:"Farmacia",en:"Pharmacy",ph:"far-MAH-syah",tts:"farmacia",icon:"💊",color:"#34d399"},{word:"Restaurante",en:"Restaurant",ph:"rrehs-tah-oo-RAN-teh",tts:"restaurante",icon:"🍽️",color:"#f97316"},{word:"Hotel",en:"Hotel",ph:"oh-TEL",tts:"hotel",icon:"🏨",color:"#a78bfa"},{word:"Aeropuerto",en:"Airport",ph:"ah-eh-roh-PWER-toh",tts:"aeropuerto",icon:"✈️",color:"#60a5fa"},{word:"Calle",en:"Street",ph:"KAH-yeh",tts:"calle",icon:"🛣️",color:"#94a3b8"},{word:"Parque",en:"Park",ph:"PAR-keh",tts:"parque",icon:"🌳",color:"#34d399"},{word:"Baño",en:"Bathroom",ph:"BAH-nyoh",tts:"baño",icon:"🚽",color:"#60a5fa"}]},
  {id:"tiempo",label:"⏰ Tiempo",type:"basic",items:[{word:"Hoy",en:"Today",ph:"oy",tts:"hoy",icon:"📅",color:"#4aa8a0"},{word:"Mañana",en:"Tomorrow",ph:"mah-NYAH-nah",tts:"mañana",icon:"🌅",color:"#f59e0b"},{word:"Ayer",en:"Yesterday",ph:"ah-YER",tts:"ayer",icon:"⏮️",color:"#a78bfa"},{word:"Ahora",en:"Now",ph:"ah-OH-rah",tts:"ahora",icon:"⚡",color:"#34d399"},{word:"Tarde",en:"Late / Afternoon",ph:"TAR-deh",tts:"tarde",icon:"🌆",color:"#fb923c"},{word:"Temprano",en:"Early",ph:"tem-PRAH-noh",tts:"temprano",icon:"🌅",color:"#60a5fa"},{word:"Siempre",en:"Always",ph:"SYEM-preh",tts:"siempre",icon:"♾️",color:"#4aa8a0"},{word:"Nunca",en:"Never",ph:"NOON-kah",tts:"nunca",icon:"🚫",color:"#ef4444"},{word:"A veces",en:"Sometimes",ph:"ah BEH-sehs",tts:"a veces",icon:"🔄",color:"#e8b44a"},{word:"Después",en:"After / Later",ph:"dehs-PWES",tts:"después",icon:"⏩",color:"#f97316"},{word:"Antes",en:"Before",ph:"AN-tehs",tts:"antes",icon:"⏪",color:"#8b5cf6"}]},
  {id:"adjetivos",label:"✨ Adjetivos",type:"basic",items:[{word:"Grande",en:"Big / Large",ph:"GRAN-deh",tts:"grande",icon:"🔼",color:"#4aa8a0"},{word:"Pequeño",en:"Small / Little",ph:"peh-KEH-nyoh",tts:"pequeño",icon:"🔽",color:"#60a5fa"},{word:"Bonito",en:"Pretty / Nice",ph:"boh-NEE-toh",tts:"bonito",icon:"😍",color:"#ec4899"},{word:"Feo",en:"Ugly",ph:"FEH-oh",tts:"feo",icon:"😬",color:"#94a3b8"},{word:"Caro",en:"Expensive",ph:"KAH-roh",tts:"caro",icon:"💸",color:"#ef4444"},{word:"Barato",en:"Cheap",ph:"bah-RAH-toh",tts:"barato",icon:"🏷️",color:"#34d399"},{word:"Rápido",en:"Fast",ph:"RRAH-pee-doh",tts:"rápido",icon:"⚡",color:"#f59e0b"},{word:"Lento",en:"Slow",ph:"LEN-toh",tts:"lento",icon:"🐢",color:"#94a3b8"},{word:"Fácil",en:"Easy",ph:"FAH-seel",tts:"fácil",icon:"😊",color:"#34d399"},{word:"Difícil",en:"Difficult",ph:"dee-FEE-seel",tts:"difícil",icon:"😰",color:"#ef4444"},{word:"Bueno",en:"Good",ph:"BWEH-noh",tts:"bueno",icon:"👍",color:"#34d399"},{word:"Malo",en:"Bad",ph:"MAH-loh",tts:"malo",icon:"👎",color:"#ef4444"},{word:"Nuevo",en:"New",ph:"NWEH-boh",tts:"nuevo",icon:"✨",color:"#a78bfa"},{word:"Viejo",en:"Old",ph:"BYEH-hoh",tts:"viejo",icon:"📜",color:"#92400e"},{word:"Limpio",en:"Clean",ph:"LEEM-pyoh",tts:"limpio",icon:"✅",color:"#34d399"},{word:"Sucio",en:"Dirty",ph:"SOO-syoh",tts:"sucio",icon:"🤢",color:"#92400e"}]},
  {id:"colombianismos",label:"🇨🇴 Colombia",type:"colombianismos"},
  {id:"preguntas",label:"❓ Preguntas",type:"preguntas"},
  {id:"profesiones",label:"👔 Profesiones",type:"basic",items:[
    {word:"estudiante",en:"student",ph:"ehs-too-DYAN-teh",tts:"estudiante",icon:"🎓",color:"#60a5fa"},
    {word:"profesor/a",en:"teacher",ph:"proh-feh-SOR / soh-RAH",tts:"profesor o profesora",icon:"🧑‍🏫",color:"#a78bfa"},
    {word:"ingeniero/a",en:"engineer",ph:"een-heh-NYEH-roh / rah",tts:"ingeniero o ingeniera",icon:"🛠️",color:"#4aa8a0"},
    {word:"médico/a",en:"doctor",ph:"MEH-dee-koh / kah",tts:"médico o médica",icon:"🩺",color:"#ef4444"},
    {word:"enfermero/a",en:"nurse",ph:"en-fer-MEH-roh / rah",tts:"enfermero o enfermera",icon:"🩹",color:"#34d399"},
    {word:"dentista",en:"dentist",ph:"den-TEES-tah",tts:"dentista",icon:"🦷",color:"#60a5fa"},
    {word:"abogado/a",en:"lawyer",ph:"ah-boh-GAH-doh / dah",tts:"abogado o abogada",icon:"⚖️",color:"#e8b44a"},
    {word:"contador/a",en:"accountant",ph:"kon-tah-DOR / doh-rah",tts:"contador o contadora",icon:"🧮",color:"#34d399"},
    {word:"arquitecto/a",en:"architect",ph:"ar-kee-TEHK-toh / tah",tts:"arquitecto o arquitecta",icon:"📐",color:"#f97316"},
    {word:"diseñador/a",en:"designer",ph:"dee-seh-nya-DOR / doh-rah",tts:"diseñador o diseñadora",icon:"🎨",color:"#ec4899"},
    {word:"conductor/a",en:"driver",ph:"kon-dook-TOR / toh-rah",tts:"conductor o conductora",icon:"🚗",color:"#60a5fa"},
    {word:"chef / cocinero/a",en:"chef / cook",ph:"shef / koh-see-NEH-roh",tts:"chef, cocinero o cocinera",icon:"👨‍🍳",color:"#f59e0b"},
    {word:"empresario/a",en:"business owner",ph:"em-preh-SAH-ryoh / ryah",tts:"empresario o empresaria",icon:"💼",color:"#a78bfa"},
    {word:"empleado/a",en:"employee",ph:"em-pleh-AH-doh / dah",tts:"empleado o empleada",icon:"🧑‍💼",color:"#4aa8a0"}
  ]},
  {id:"casa",label:"🏠 Casa",type:"basic",items:[
    {word:"ducha",en:"shower",ph:"DOO-chah",tts:"ducha",icon:"🚿",color:"#60a5fa"},
    {word:"inodoro",en:"toilet",ph:"ee-noh-DOH-roh",tts:"inodoro",icon:"🚽",color:"#94a3b8"},
    {word:"lavamanos",en:"sink",ph:"lah-vah-MAH-nohs",tts:"lavamanos",icon:"🧼",color:"#60a5fa"},
    {word:"jabón",en:"soap",ph:"hah-BON",tts:"jabón",icon:"🧴",color:"#34d399"},
    {word:"toalla",en:"towel",ph:"toh-AH-yah",tts:"toalla",icon:"🧖",color:"#a78bfa"},
    {word:"cepillo de dientes",en:"toothbrush",ph:"seh-PEE-yoh deh DYEN-tehs",tts:"cepillo de dientes",icon:"🪥",color:"#60a5fa"},
    {word:"cama",en:"bed",ph:"KAH-mah",tts:"cama",icon:"🛏️",color:"#a78bfa"},
    {word:"almohada",en:"pillow",ph:"al-moh-AH-dah",tts:"almohada",icon:"🛌",color:"#ec4899"},
    {word:"cobija",en:"blanket",ph:"koh-BEE-hah",tts:"cobija",icon:"🧣",color:"#e85d75"},
    {word:"sábana",en:"sheet",ph:"SAH-bah-nah",tts:"sábana",icon:"🛏️",color:"#60a5fa"},
    {word:"clóset",en:"closet",ph:"KLOH-set",tts:"clóset",icon:"🚪",color:"#a78bfa"},
    {word:"ventana",en:"window",ph:"ben-TAH-nah",tts:"ventana",icon:"🪟",color:"#60a5fa"},
    {word:"puerta",en:"door",ph:"PWER-tah",tts:"puerta",icon:"🚪",color:"#f59e0b"},
    {word:"luz",en:"light",ph:"loos",tts:"luz",icon:"💡",color:"#e8b44a"},
    {word:"habitación",en:"bedroom / room",ph:"ah-bee-tah-SYON",tts:"habitación",icon:"🛋️",color:"#4aa8a0"}
  ]},
  {id:"direcciones",label:"🧭 Direcciones",type:"basic",items:[
    {word:"carro",en:"car",ph:"KAH-rroh",tts:"carro",icon:"🚗",color:"#60a5fa"},
    {word:"moto",en:"motorcycle",ph:"MOH-toh",tts:"moto",icon:"🏍️",color:"#e85d75"},
    {word:"pasajero/a",en:"passenger",ph:"pah-sah-HEH-roh / rah",tts:"pasajero o pasajera",icon:"🧍",color:"#a78bfa"},
    {word:"dirección",en:"address",ph:"dee-rehk-SYON",tts:"dirección",icon:"📍",color:"#f97316"},
    {word:"derecha",en:"right",ph:"deh-REH-chah",tts:"derecha",icon:"➡️",color:"#34d399"},
    {word:"izquierda",en:"left",ph:"ees-KYER-dah",tts:"izquierda",icon:"⬅️",color:"#34d399"},
    {word:"siga derecho",en:"go straight",ph:"SEE-gah deh-REH-choh",tts:"siga derecho",icon:"⬆️",color:"#4aa8a0"},
    {word:"gire",en:"turn",ph:"HEE-reh",tts:"gire",icon:"↪️",color:"#f59e0b"},
    {word:"semáforo",en:"traffic light",ph:"seh-MAH-foh-roh",tts:"semáforo",icon:"🚦",color:"#ef4444"},
    {word:"esquina",en:"corner",ph:"ehs-KEE-nah",tts:"esquina",icon:"📐",color:"#a78bfa"},
    {word:"parqueadero",en:"parking lot",ph:"par-keh-ah-DEH-roh",tts:"parqueadero",icon:"🅿️",color:"#60a5fa"},
    {word:"gasolina",en:"gas",ph:"gah-soh-LEE-nah",tts:"gasolina",icon:"⛽",color:"#f97316"},
    {word:"trancón",en:"traffic jam",ph:"trahn-KON",tts:"trancón",icon:"🚗",color:"#e85d75"},
    {word:"queda cerca",en:"it is nearby",ph:"KEH-dah SEHR-kah",tts:"queda cerca",icon:"📍",color:"#34d399"},
    {word:"queda lejos",en:"it is far",ph:"KEH-dah LEH-hohs",tts:"queda lejos",icon:"🗺️",color:"#a78bfa"}
  ]},
  {id:"cocina",label:"🍳 Cocina",type:"basic",items:[
    {word:"cocinar",en:"to cook",ph:"koh-see-NAR",tts:"cocinar",icon:"👩‍🍳",color:"#f59e0b"},
    {word:"cortar",en:"to cut",ph:"kor-TAR",tts:"cortar",icon:"🔪",color:"#e85d75"},
    {word:"mezclar",en:"to mix",ph:"mes-KLAR",tts:"mezclar",icon:"🥣",color:"#a78bfa"},
    {word:"probar",en:"to taste / try",ph:"proh-BAR",tts:"probar",icon:"😋",color:"#34d399"},
    {word:"lavar",en:"to wash",ph:"lah-BAR",tts:"lavar",icon:"🧼",color:"#60a5fa"},
    {word:"hervir",en:"to boil",ph:"er-BEER",tts:"hervir",icon:"♨️",color:"#ef4444"},
    {word:"freír",en:"to fry",ph:"freh-EER",tts:"freír",icon:"🍳",color:"#f97316"},
    {word:"olla",en:"pot",ph:"OH-yah",tts:"olla",icon:"🍲",color:"#94a3b8"},
    {word:"sartén",en:"pan",ph:"sar-TEN",tts:"sartén",icon:"🍳",color:"#94a3b8"},
    {word:"cuchillo",en:"knife",ph:"koo-CHEE-yoh",tts:"cuchillo",icon:"🔪",color:"#60a5fa"},
    {word:"cuchara",en:"spoon",ph:"koo-CHAR-ah",tts:"cuchara",icon:"🥄",color:"#a78bfa"},
    {word:"plato",en:"plate / dish",ph:"PLAH-toh",tts:"plato",icon:"🍽️",color:"#4aa8a0"},
    {word:"sal",en:"salt",ph:"sahl",tts:"sal",icon:"🧂",color:"#94a3b8"},
    {word:"azúcar",en:"sugar",ph:"ah-SOO-kar",tts:"azúcar",icon:"🍬",color:"#ec4899"}
  ]},
  {id:"gustos",label:"❤️ Gustos",type:"basic",items:[
    {word:"Me gusta la música.",en:"I like music.",ph:"",tts:"Me gusta la música.",icon:"🎵",color:"#ec4899"},
    {word:"Me gusta el deporte.",en:"I like sports.",ph:"",tts:"Me gusta el deporte.",icon:"⚽",color:"#34d399"},
    {word:"Me gusta leer.",en:"I like to read.",ph:"",tts:"Me gusta leer.",icon:"📚",color:"#a78bfa"},
    {word:"Me gusta viajar.",en:"I like to travel.",ph:"",tts:"Me gusta viajar.",icon:"✈️",color:"#60a5fa"},
    {word:"Me gusta cocinar.",en:"I like to cook.",ph:"",tts:"Me gusta cocinar.",icon:"🍳",color:"#f59e0b"},
    {word:"Me gusta ver películas.",en:"I like watching movies.",ph:"",tts:"Me gusta ver películas.",icon:"🎬",color:"#e85d75"},
    {word:"Me gusta pasar tiempo con mi familia.",en:"I like spending time with my family.",ph:"",tts:"Me gusta pasar tiempo con mi familia.",icon:"👨‍👩‍👧",color:"#4aa8a0"},
    {word:"Me gustan los animales.",en:"I like animals.",ph:"",tts:"Me gustan los animales.",icon:"🐶",color:"#f97316"},
    {word:"Me gustan los videojuegos.",en:"I like video games.",ph:"",tts:"Me gustan los videojuegos.",icon:"🎮",color:"#a78bfa"},
    {word:"Me gustan las redes sociales.",en:"I like social media.",ph:"",tts:"Me gustan las redes sociales.",icon:"📱",color:"#60a5fa"},
    {word:"Es divertido.",en:"It is fun.",ph:"",tts:"Es divertido.",icon:"😄",color:"#34d399"},
    {word:"Es interesante.",en:"It is interesting.",ph:"",tts:"Es interesante.",icon:"💡",color:"#e8b44a"},
    {word:"Es aburrido.",en:"It is boring.",ph:"",tts:"Es aburrido.",icon:"🥱",color:"#94a3b8"},
    {word:"Es fácil.",en:"It is easy.",ph:"",tts:"Es fácil.",icon:"😊",color:"#34d399"},
    {word:"Es difícil.",en:"It is difficult.",ph:"",tts:"Es difícil.",icon:"😰",color:"#ef4444"},
    {word:"Es delicioso.",en:"It is delicious.",ph:"",tts:"Es delicioso.",icon:"😋",color:"#f59e0b"},
    {word:"Es horrible.",en:"It is horrible.",ph:"",tts:"Es horrible.",icon:"😖",color:"#e85d75"}
  ]},
  /* ── NEW v13: TV · Descanso (restored) ── */
  {id:"tv",label:"📺 TV · Descanso",type:"basic",items:[
    {word:"Televisión",en:"Television",ph:"teh-leh-bee-SYOHN",tts:"televisión",icon:"📺",color:"#60a5fa"},
    {word:"Película",en:"Movie",ph:"peh-LEE-koo-lah",tts:"película",icon:"🎬",color:"#e85d75"},
    {word:"Serie",en:"Series",ph:"SEH-ryeh",tts:"serie",icon:"🎞️",color:"#a78bfa"},
    {word:"Noticias",en:"News",ph:"noh-TEE-syahs",tts:"noticias",icon:"📰",color:"#94a3b8"},
    {word:"Programa",en:"Show",ph:"proh-GRAH-mah",tts:"programa",icon:"📡",color:"#4aa8a0"},
    {word:"Control remoto",en:"Remote control",ph:"kon-TROL rreh-MOH-toh",tts:"control remoto",icon:"🎛️",color:"#f59e0b"},
    {word:"Sofá",en:"Sofa",ph:"soh-FAH",tts:"sofá",icon:"🛋️",color:"#92400e"},
    {word:"Descansar",en:"To rest",ph:"dehs-kan-SAR",tts:"descansar",icon:"😌",color:"#34d399"},
    {word:"Relajarse",en:"To relax",ph:"rreh-lah-HAR-seh",tts:"relajarse",icon:"🧘",color:"#a78bfa"},
    {word:"Ver televisión",en:"To watch TV",ph:"ber teh-leh-bee-SYOHN",tts:"ver televisión",icon:"👀",color:"#60a5fa"},
  ]},
  /* ── NEW v13: Ropa ── */
  {id:"ropa",label:"👕 Ropa",type:"basic",items:[
    {word:"Camisa",en:"Shirt",ph:"kah-MEE-sah",tts:"camisa",icon:"👔",color:"#60a5fa"},
    {word:"Camiseta",en:"T-shirt",ph:"kah-mee-SEH-tah",tts:"camiseta",icon:"👕",color:"#4aa8a0"},
    {word:"Pantalón",en:"Pants",ph:"pan-tah-LOHN",tts:"pantalón",icon:"👖",color:"#3b82f6"},
    {word:"Zapatos",en:"Shoes",ph:"sah-PAH-tohs",tts:"zapatos",icon:"👟",color:"#92400e"},
    {word:"Medias",en:"Socks (Colombian!)",ph:"MEH-dyahs",tts:"medias",icon:"🧦",color:"#e85d75"},
    {word:"Chaqueta",en:"Jacket",ph:"chah-KEH-tah",tts:"chaqueta",icon:"🧥",color:"#a78bfa"},
    {word:"Saco",en:"Sweater (Colombian!)",ph:"SAH-koh",tts:"saco",icon:"🧶",color:"#e8b44a"},
    {word:"Vestido",en:"Dress",ph:"behs-TEE-doh",tts:"vestido",icon:"👗",color:"#ec4899"},
    {word:"Falda",en:"Skirt",ph:"FAL-dah",tts:"falda",icon:"👚",color:"#f9a8d4"},
    {word:"Sombrero",en:"Hat",ph:"som-BREH-roh",tts:"sombrero",icon:"👒",color:"#f59e0b"},
    {word:"Gafas",en:"Glasses",ph:"GAH-fahs",tts:"gafas",icon:"👓",color:"#94a3b8"},
    {word:"Reloj",en:"Watch / Clock",ph:"rreh-LOH",tts:"reloj",icon:"⌚",color:"#64748b"},
  ]},
  /* ── NEW v13: Animales ── */
  {id:"animales",label:"🐾 Animales",type:"basic",items:[
    {word:"Perro",en:"Dog",ph:"PEH-rroh",tts:"perro",icon:"🐕",color:"#e8b44a"},
    {word:"Gato",en:"Cat",ph:"GAH-toh",tts:"gato",icon:"🐈",color:"#94a3b8"},
    {word:"Pájaro",en:"Bird",ph:"PAH-hah-roh",tts:"pájaro",icon:"🐦",color:"#60a5fa"},
    {word:"Pez",en:"Fish",ph:"pehs",tts:"pez",icon:"🐟",color:"#3b82f6"},
    {word:"Caballo",en:"Horse",ph:"kah-BAH-yoh",tts:"caballo",icon:"🐴",color:"#92400e"},
    {word:"Vaca",en:"Cow",ph:"BAH-kah",tts:"vaca",icon:"🐄",color:"#94a3b8"},
    {word:"Gallina",en:"Hen / Chicken",ph:"gah-YEE-nah",tts:"gallina",icon:"🐔",color:"#f59e0b"},
    {word:"Cerdo",en:"Pig",ph:"SER-doh",tts:"cerdo",icon:"🐷",color:"#ec4899"},
    {word:"Mono",en:"Monkey",ph:"MOH-noh",tts:"mono",icon:"🐒",color:"#e8b44a"},
    {word:"Mariposa",en:"Butterfly",ph:"mah-ree-POH-sah",tts:"mariposa",icon:"🦋",color:"#a78bfa"},
    {word:"Mosca",en:"Fly",ph:"MOHS-kah",tts:"mosca",icon:"🪰",color:"#64748b"},
    {word:"Culebra",en:"Snake (Colombian!)",ph:"koo-LEH-brah",tts:"culebra",icon:"🐍",color:"#34d399"},
  ]},
  /* ── NEW v13: Clima ── */
  {id:"clima",label:"🌤️ Clima",type:"basic",items:[
    {word:"Clima",en:"Weather",ph:"KLEE-mah",tts:"clima",icon:"🌡️",color:"#4aa8a0"},
    {word:"Sol",en:"Sun",ph:"sohl",tts:"sol",icon:"☀️",color:"#f59e0b"},
    {word:"Lluvia",en:"Rain",ph:"YOO-byah",tts:"lluvia",icon:"🌧️",color:"#60a5fa"},
    {word:"Nube",en:"Cloud",ph:"NOO-beh",tts:"nube",icon:"☁️",color:"#94a3b8"},
    {word:"Viento",en:"Wind",ph:"BYEN-toh",tts:"viento",icon:"💨",color:"#4aa8a0"},
    {word:"Tormenta",en:"Storm",ph:"tor-MEN-tah",tts:"tormenta",icon:"⛈️",color:"#8b5cf6"},
    {word:"Aguacero",en:"Downpour (Colombian!)",ph:"ah-gwah-SEH-roh",tts:"aguacero",icon:"🌧️",color:"#3b82f6"},
    {word:"Hace calor",en:"It's hot",ph:"AH-seh kah-LOR",tts:"hace calor",icon:"🥵",color:"#ef4444"},
    {word:"Hace frío",en:"It's cold",ph:"AH-seh FREE-oh",tts:"hace frío",icon:"🥶",color:"#60a5fa"},
    {word:"Hace sol",en:"It's sunny",ph:"AH-seh sohl",tts:"hace sol",icon:"😎",color:"#f59e0b"},
    {word:"Está lloviendo",en:"It's raining",ph:"ehs-TAH yoh-BYEN-doh",tts:"está lloviendo",icon:"☔",color:"#3b82f6"},
  ]},
  /* ── NEW v13: Tecnología ── */
  {id:"tecnologia",label:"📱 Tecnología",type:"basic",items:[
    {word:"Celular",en:"Cell phone (Colombian!)",ph:"seh-loo-LAR",tts:"celular",icon:"📱",color:"#4aa8a0"},
    {word:"Cargador",en:"Charger",ph:"kar-gah-DOR",tts:"cargador",icon:"🔌",color:"#f59e0b"},
    {word:"Computador",en:"Computer (Colombian!)",ph:"kom-poo-tah-DOR",tts:"computador",icon:"💻",color:"#60a5fa"},
    {word:"Wifi",en:"Wifi",ph:"WEE-fee",tts:"wifi",icon:"📶",color:"#34d399"},
    {word:"Aplicación",en:"App",ph:"ah-plee-kah-SYOHN",tts:"aplicación",icon:"📲",color:"#a78bfa"},
    {word:"Mensaje",en:"Message",ph:"men-SAH-heh",tts:"mensaje",icon:"💬",color:"#4aa8a0"},
    {word:"Llamada",en:"Call",ph:"yah-MAH-dah",tts:"llamada",icon:"📞",color:"#e85d75"},
    {word:"Foto",en:"Photo",ph:"FOH-toh",tts:"foto",icon:"📷",color:"#ec4899"},
    {word:"Audífonos",en:"Headphones",ph:"ah-oo-DEE-foh-nohs",tts:"audífonos",icon:"🎧",color:"#8b5cf6"},
    {word:"Pantalla",en:"Screen",ph:"pan-TAH-yah",tts:"pantalla",icon:"🖥️",color:"#94a3b8"},
    {word:"Contraseña",en:"Password",ph:"kon-trah-SEH-nyah",tts:"contraseña",icon:"🔑",color:"#e8b44a"},
    {word:"Batería",en:"Battery",ph:"bah-teh-REE-ah",tts:"batería",icon:"🔋",color:"#34d399"},
  ]},
  /* ── NEW v13: Emociones ── */
  {id:"emociones",label:"😊 Emociones",type:"basic",items:[
    {word:"Feliz",en:"Happy",ph:"feh-LEES",tts:"feliz",icon:"😄",color:"#f59e0b"},
    {word:"Triste",en:"Sad",ph:"TREES-teh",tts:"triste",icon:"😢",color:"#60a5fa"},
    {word:"Cansado/a",en:"Tired",ph:"kan-SAH-doh",tts:"cansado",icon:"😴",color:"#8b5cf6"},
    {word:"Preocupado/a",en:"Worried",ph:"preh-oh-koo-PAH-doh",tts:"preocupado",icon:"😟",color:"#94a3b8"},
    {word:"Emocionado/a",en:"Excited",ph:"eh-moh-syoh-NAH-doh",tts:"emocionado",icon:"🤩",color:"#ec4899"},
    {word:"Bravo/a",en:"Angry (Colombian!)",ph:"BRAH-boh",tts:"bravo",icon:"😠",color:"#ef4444"},
    {word:"Nervioso/a",en:"Nervous",ph:"ner-BYOH-soh",tts:"nervioso",icon:"😬",color:"#e8b44a"},
    {word:"Tranquilo/a",en:"Calm",ph:"tran-KEE-loh",tts:"tranquilo",icon:"😌",color:"#34d399"},
    {word:"Aburrido/a",en:"Bored",ph:"ah-boo-RREE-doh",tts:"aburrido",icon:"🥱",color:"#64748b"},
    {word:"Sorprendido/a",en:"Surprised",ph:"sor-pren-DEE-doh",tts:"sorprendido",icon:"😲",color:"#a78bfa"},
    {word:"Enamorado/a",en:"In love",ph:"eh-nah-moh-RAH-doh",tts:"enamorado",icon:"😍",color:"#e85d75"},
    {word:"Asustado/a",en:"Scared",ph:"ah-soos-TAH-doh",tts:"asustado",icon:"😨",color:"#8b5cf6"},
  ]},
];

const COLOMBIANISMOS=[
  {word:"¿Qué más?",en:"What's up? / How's it going?",usage:"The most common Colombian greeting. Used instead of ¿Cómo estás? with friends.",example:"¡Hola! ¿Qué más, parce?",tts:"¿Qué más?"},
  {word:"¡Venga!",en:"Come on! / OK! / Come here!",usage:"One word, many meanings. ¡Venga! = OK/agreed. Venga acá = Come here. ¡Venga, hagámoslo! = Come on, let's do it!",example:"¿Vamos al mercado? — ¡Venga!",tts:"¡Venga!"},
  {word:"Listo",en:"OK / Ready / Got it / Done",usage:"Said constantly. Means you understand or agree. Like saying 'alright' or 'got it' in English.",example:"¿Entendiste? — Sí, listo.",tts:"listo"},
  {word:"Bacano/a",en:"Cool / Great / Awesome",usage:"Very Colombian. 'Qué bacano' = How cool! Used for things, places, people.",example:"¡Qué bacano ese restaurante!",tts:"bacano"},
  {word:"Chévere",en:"Great / Cool / Awesome",usage:"Used across Latin America but very common in Colombia. Similar to 'bacano'.",example:"¡Chévere! Vamos entonces.",tts:"chévere"},
  {word:"Parcero / Parce",en:"Buddy / Friend / Mate",usage:"Like 'mate' or 'buddy'. Very Colombian. Used between friends. Parce is the short form.",example:"¡Parce, qué más!",tts:"parcero"},
  {word:"Tinto",en:"Black coffee (Colombian!)",usage:"In Colombia, tinto = black coffee. In Spain, tinto = red wine. Don't get confused! '¿Un tinto?' means a coffee.",example:"¿Le traigo un tinto?",tts:"tinto"},
  {word:"Plata",en:"Money (not silver!)",usage:"In Colombia plata = money, not silver. 'No tengo plata' = I have no money. Very common everyday word.",example:"No tengo plata para el taxi.",tts:"plata"},
  {word:"Vaina",en:"Thing / Stuff / What's-it",usage:"A catch-all word for anything. Like 'thing' or 'stuff' in English. '¿Qué es esa vaina?' = What is that thing?",example:"Esa vaina no funciona.",tts:"vaina"},
  {word:"¡Uy!",en:"Wow! / Oh! / Oops!",usage:"Expression of surprise, shock, or mild pain. Like 'ooh' or 'wow' in English.",example:"¡Uy, qué calor hace!",tts:"uy"},
  {word:"Dale",en:"Go ahead / OK / Sure",usage:"Used to agree or encourage. '¡Dale!' = Go for it! / OK! / Let's go!",example:"¿Empezamos? — ¡Dale!",tts:"dale"},
  {word:"Chimba",en:"Awesome / Amazing (informal!)",usage:"Very informal slang. Only use with close friends. Qué chimba = How awesome!",example:"¡Qué chimba de concierto!",tts:"chimba"},
  {word:"Hacer una vuelta",en:"To run an errand",usage:"'Una vuelta' literally means a turn/loop but in Colombia it means running an errand. Very common expression.",example:"Tengo que hacer una vuelta en el banco.",tts:"hacer una vuelta"},
  {word:"¿Me regala...?",en:"Can I have...? / Please give me...",usage:"Literally 'gift me' but used like 'can I have' when ordering or asking for something. Very polite.",example:"¿Me regala un tinto, por favor?",tts:"¿Me regala un tinto, por favor?"},
  {word:"Chino/a",en:"Kid / Boy / Girl",usage:"In Colombia chino = kid/child, NOT Chinese person. '¿Ese chino quién es?' = Who is that kid?",example:"Los chinos están jugando.",tts:"chino"},
  {word:"Berraco/a",en:"Tough / Impressive / Badass",usage:"Can mean hardworking, tough, or impressive. '¡Qué berracos!' = What tough/impressive people!",example:"Ese man es muy berraco.",tts:"berraco"},
];

const VOCALES_DATA=[
  {letter:"A",color:"#e85d75",bg:"rgba(232,93,117,0.15)",sound:"ah",examples:[{word:"Abeja",en:"Bee",ph:"ah-BEH-hah",tts:"abeja"},{word:"Árbol",en:"Tree",ph:"AR-bol",tts:"árbol"},{word:"Amor",en:"Love",ph:"ah-MOR",tts:"amor"}]},
  {letter:"E",color:"#a78bfa",bg:"rgba(167,139,250,0.15)",sound:"eh",examples:[{word:"Elefante",en:"Elephant",ph:"eh-leh-FAN-teh",tts:"elefante"},{word:"Estrella",en:"Star",ph:"ehs-TREH-yah",tts:"estrella"},{word:"Escuela",en:"School",ph:"ehs-KWEH-lah",tts:"escuela"}]},
  {letter:"I",color:"#60a5fa",bg:"rgba(96,165,250,0.15)",sound:"ee",examples:[{word:"Iguana",en:"Iguana",ph:"ee-GWAH-nah",tts:"iguana"},{word:"Isla",en:"Island",ph:"EES-lah",tts:"isla"},{word:"Iglesia",en:"Church",ph:"ee-GLEH-syah",tts:"iglesia"}]},
  {letter:"O",color:"#34d399",bg:"rgba(52,211,153,0.15)",sound:"oh",examples:[{word:"Oveja",en:"Sheep",ph:"oh-BEH-hah",tts:"oveja"},{word:"Oso",en:"Bear",ph:"OH-soh",tts:"oso"},{word:"Ojo",en:"Eye",ph:"OH-hoh",tts:"ojo"}]},
  {letter:"U",color:"#f59e0b",bg:"rgba(245,158,11,0.15)",sound:"oo",examples:[{word:"Urraca",en:"Magpie",ph:"oo-RRAH-kah",tts:"urraca"},{word:"Uva",en:"Grape",ph:"OO-bah",tts:"uva"},{word:"Uno",en:"One",ph:"OO-noh",tts:"uno"}]},
];
const PQ=[{word:"¿Quién?",en:"Who?",ph:"kyen",tts:"¿Quién?",example:"¿Quién es? — Who is it?"},{word:"¿Qué?",en:"What?",ph:"keh",tts:"¿Qué?",example:"¿Qué es esto? — What is this?"},{word:"¿Cuándo?",en:"When?",ph:"KWAN-doh",tts:"¿Cuándo?",example:"¿Cuándo es? — When is it?"},{word:"¿Dónde?",en:"Where?",ph:"DON-deh",tts:"¿Dónde?",example:"¿Dónde está? — Where is it?"},{word:"¿Cómo?",en:"How?",ph:"KOH-moh",tts:"¿Cómo?",example:"¿Cómo se dice? — How do you say?"},{word:"¿Por qué?",en:"Why?",ph:"por KEH",tts:"¿Por qué?",example:"¿Por qué? — Why?"},{word:"¿Cuánto?",en:"How much?",ph:"KWAN-toh",tts:"¿Cuánto?",example:"¿Cuánto cuesta? — How much?"},{word:"¿Cuántos?",en:"How many?",ph:"KWAN-tohs",tts:"¿Cuántos?",example:"¿Cuántos son? — How many?"},{word:"¿Cuál?",en:"Which?",ph:"kwal",tts:"¿Cuál?",example:"¿Cuál quiere? — Which one?"},{word:"¿A qué hora?",en:"What time?",ph:"ah keh OH-rah",tts:"¿A qué hora?",example:"¿A qué hora es? — What time?"}];

const FRASES=[
  {section:"💬 Saludos — Informal",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[{es:"Hola, ¿cómo estás?",en:"Hi, how are you?"},{es:"¿Cómo te va?",en:"How are you doing?"},{es:"¿Qué más?",en:"What's up? (very Colombian)"},{es:"¿Qué tal?",en:"How are things?"},{es:"Estoy bien, gracias.",en:"I'm fine, thank you."},{es:"Muy bien, ¿y tú?",en:"Very well, and you?"},{es:"Más o menos.",en:"More or less."},{es:"Chao.",en:"Bye! (very Colombian)"}]},
  {section:"🤝 Saludos — Formal",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[{es:"Buenos días.",en:"Good morning."},{es:"Buenas tardes.",en:"Good afternoon."},{es:"Buenas noches.",en:"Good evening."},{es:"¿Cómo le va a usted?",en:"How are you? (formal)"},{es:"¡Gusto en conocerle!",en:"Nice to meet you! (formal)"},{es:"¡El gusto es mío!",en:"The pleasure is mine!"},{es:"Igualmente.",en:"Likewise."}]},
  {section:"🛍️ De Compras",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[{es:"¿Cuánto cuesta?",en:"How much does it cost?"},{es:"¿Me regala...?",en:"Can I have...? (Colombian!)"},{es:"Es muy caro.",en:"It's very expensive."},{es:"¿Tiene algo más barato?",en:"Do you have something cheaper?"},{es:"¿Puede hacer un descuento?",en:"Can you give me a discount?"},{es:"Solo estoy mirando.",en:"I'm just looking."},{es:"Me llevo este.",en:"I'll take this one."},{es:"¿Aceptan tarjeta?",en:"Do you accept card?"}]},
  {section:"🍽️ En el Restaurante",cls:"color:var(--green);background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2)",items:[{es:"Una mesa para dos, por favor.",en:"A table for two, please."},{es:"¿Qué recomienda?",en:"What do you recommend?"},{es:"Quisiera pedir...",en:"I would like to order..."},{es:"La cuenta, por favor.",en:"The bill, please."},{es:"Está delicioso.",en:"It's delicious."},{es:"¿Tiene menú del día?",en:"Do you have a daily menu?"},{es:"Sin picante, por favor.",en:"Without spice, please."},{es:"¿Me regala un tinto?",en:"Can I have a black coffee? (Colombian!)"}]},
  {section:"🆘 Pidiendo Ayuda",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[{es:"No entiendo.",en:"I don't understand."},{es:"¿Puede repetir más despacio?",en:"Can you repeat more slowly?"},{es:"¿Habla inglés?",en:"Do you speak English?"},{es:"No hablo bien español.",en:"I don't speak Spanish well."},{es:"¿Cómo se dice... en español?",en:"How do you say... in Spanish?"},{es:"¿Me puede ayudar?",en:"Can you help me?"},{es:"Estoy perdido/a.",en:"I'm lost."},{es:"¿Dónde está...?",en:"Where is...?"},{es:"No sé.",en:"I don't know."}]},
  {section:"🚨 Emergencias",cls:"color:var(--pink);background:rgba(232,93,117,0.12);border:1px solid rgba(232,93,117,0.3)",items:[{es:"¡Ayuda!",en:"Help!"},{es:"Llame a la policía.",en:"Call the police."},{es:"Necesito un médico.",en:"I need a doctor."},{es:"Llame a una ambulancia.",en:"Call an ambulance."},{es:"Me robaron.",en:"I was robbed."},{es:"¿Dónde está el hospital?",en:"Where is the hospital?"},{es:"Me siento mal.",en:"I feel sick."}]},
  {section:"🚕 Transporte",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[{es:"¿Dónde está la parada de bus?",en:"Where is the bus stop?"},{es:"¿Cuánto cuesta el taxi hasta...?",en:"How much is a taxi to...?"},{es:"Lléveme a esta dirección.",en:"Take me to this address."},{es:"Para aquí, por favor.",en:"Stop here, please."},{es:"¿Cuánto tarda hasta...?",en:"How long does it take to...?"},{es:"¿Tiene cambio?",en:"Do you have change?"}]},
  {section:"☀️ Conversación Diaria",cls:"color:var(--teal);background:rgba(74,168,160,0.08);border:1px solid rgba(74,168,160,0.18)",items:[{es:"¿Cuántos años tiene usted?",en:"How old are you? (formal)"},{es:"Tengo ___ años.",en:"I am ___ years old."},{es:"¿De dónde es usted?",en:"Where are you from?"},{es:"Soy de...",en:"I'm from..."},{es:"¿Qué hora es?",en:"What time is it?"},{es:"Son las tres.",en:"It's three o'clock."},{es:"Por favor.",en:"Please."},{es:"Gracias.",en:"Thank you."},{es:"De nada.",en:"You're welcome."},{es:"Con permiso.",en:"Excuse me (passing)."},{es:"¿Puede escribirlo?",en:"Can you write it down?"},{es:"Entiendo un poco.",en:"I understand a little."}]},
  {section:"❤️ Gustos y conversación",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[{es:"Soy...",en:"I am..."},{es:"Trabajo como...",en:"I work as..."},{es:"Trabajo en...",en:"I work at / in..."},{es:"Estudio...",en:"I study..."},{es:"Me gusta mi trabajo.",en:"I like my job."},{es:"No me gusta mi trabajo.",en:"I don't like my job."},{es:"¿Qué haces?",en:"What do you do?"},{es:"¿En qué trabajas?",en:"What do you do for work?"},{es:"¿Cómo te llamas?",en:"What's your name?"},{es:"Me llamo...",en:"My name is..."},{es:"¿De dónde eres?",en:"Where are you from?"},{es:"¿Dónde vives?",en:"Where do you live?"},{es:"Vivo en...",en:"I live in..."},{es:"Mi ciudad es grande / pequeña.",en:"My city is big / small."},{es:"Me gusta vivir aquí.",en:"I like living here."},{es:"No me gusta vivir aquí.",en:"I don't like living here."},{es:"Tengo ... años.",en:"I am ... years old."},{es:"Mi cumpleaños es...",en:"My birthday is..."},{es:"¿Cuántos años tienes?",en:"How old are you?"},{es:"¿Tienes hermanos?",en:"Do you have siblings?"},{es:"¿Tienes mascotas?",en:"Do you have pets?"},{es:"Mi familia es pequeña / grande.",en:"My family is small / big."},{es:"Los quiero mucho.",en:"I love them very much."},{es:"Me gusta...",en:"I like..."},{es:"No me gusta...",en:"I don't like..."},{es:"Me encanta...",en:"I love..."},{es:"Odio...",en:"I hate..."},{es:"Prefiero...",en:"I prefer..."},{es:"Mi favorito/a es...",en:"My favorite is..."},{es:"Es divertido.",en:"It's fun."},{es:"Es interesante.",en:"It's interesting."},{es:"Es aburrido.",en:"It's boring."},{es:"Es fácil.",en:"It's easy."},{es:"Es difícil.",en:"It's difficult."},{es:"Es delicioso.",en:"It's delicious."},{es:"Es horrible.",en:"It's horrible."}]},
  /* ── NEW v13: Haciendo Planes ── */
  {section:"📆 Haciendo Planes",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[{es:"¿Qué vas a hacer mañana?",en:"What are you going to do tomorrow?"},{es:"¿Nos vemos mañana?",en:"Shall we meet tomorrow?"},{es:"¿A qué hora nos vemos?",en:"What time shall we meet?"},{es:"¿Quieres salir?",en:"Do you want to go out?"},{es:"¡Claro que sí!",en:"Of course!"},{es:"No puedo, tengo planes.",en:"I can't, I have plans."},{es:"¿Qué tal el sábado?",en:"How about Saturday?"},{es:"De pronto voy.",en:"Maybe I'll go. (Colombian: de pronto = maybe)"},{es:"Nos vemos a las siete.",en:"See you at seven."},{es:"¡De una!",en:"I'm in! / Right away! (Colombian!)"},{es:"Te aviso.",en:"I'll let you know."},{es:"¿Dónde nos encontramos?",en:"Where shall we meet?"}]},
  /* ── NEW v13: Por Teléfono / Mensajes ── */
  {section:"📱 Por Teléfono / Mensajes",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[{es:"¿Aló?",en:"Hello? (answering the phone — Colombian!)"},{es:"¿Con quién hablo?",en:"Who am I speaking with?"},{es:"¿Me escuchas?",en:"Can you hear me?"},{es:"Te llamo más tarde.",en:"I'll call you later."},{es:"Se cortó la llamada.",en:"The call dropped."},{es:"Te escribo.",en:"I'll text you."},{es:"Mándame la ubicación.",en:"Send me the location."},{es:"¿Me pasas tu número?",en:"Can you give me your number?"},{es:"Estoy sin señal.",en:"I have no signal."},{es:"No tengo minutos.",en:"I don't have phone minutes. (very Colombian)"},{es:"Voy a llamar.",en:"I'm going to call."},{es:"Deja el mensaje.",en:"Leave the message."}]},
  /* ── NEW v13: ¿Cómo Te Sientes? ── */
  {section:"🩺 ¿Cómo Te Sientes?",cls:"color:var(--green);background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2)",items:[{es:"¿Cómo te sientes?",en:"How do you feel?"},{es:"Me siento bien.",en:"I feel good."},{es:"Me siento mal.",en:"I feel bad."},{es:"Tengo hambre.",en:"I'm hungry."},{es:"Tengo sed.",en:"I'm thirsty."},{es:"Tengo sueño.",en:"I'm sleepy."},{es:"Tengo frío.",en:"I'm cold."},{es:"Tengo calor.",en:"I'm hot."},{es:"Me duele la cabeza.",en:"My head hurts."},{es:"Me duele el estómago.",en:"My stomach hurts."},{es:"Estoy cansado/a.",en:"I'm tired."},{es:"Estoy enfermo/a.",en:"I'm sick."},{es:"Necesito descansar.",en:"I need to rest."},{es:"¡Que te mejores!",en:"Get well soon!"}]},
  /* ── NEW v13: Plata y Pagos ── */
  {section:"💰 Plata y Pagos",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[{es:"¿Cuánto le debo?",en:"How much do I owe you?"},{es:"¿Tiene cambio de cincuenta mil?",en:"Do you have change for fifty thousand?"},{es:"¿Puedo pagar con tarjeta?",en:"Can I pay by card?"},{es:"Pago en efectivo.",en:"I'll pay in cash."},{es:"¿Me hace la transferencia?",en:"Can you send me the transfer? (Nequi-style)"},{es:"Quedamos a mano.",en:"We're even."},{es:"¿Me rebaja algo?",en:"Can you lower the price a bit?"},{es:"Necesito sacar plata.",en:"I need to withdraw money. (Colombian!)"},{es:"¿Dónde hay un cajero?",en:"Where is there an ATM?"},{es:"A la orden.",en:"At your service / You're welcome. (Colombian!)"}]},
  {id:"habitacion",label:"🛏️ Habitación",type:"basic",items:[
    {word:"cama",en:"bed",ph:"KAH-mah",tts:"cama",icon:"🛏️",color:"#a78bfa"},{word:"almohada",en:"pillow",ph:"al-moh-AH-dah",tts:"almohada",icon:"🛌",color:"#ec4899"},{word:"cobija",en:"blanket",ph:"koh-BEE-hah",tts:"cobija",icon:"🧣",color:"#e85d75"},{word:"sábana",en:"sheet",ph:"SAH-bah-nah",tts:"sábana",icon:"🛏️",color:"#60a5fa"},{word:"clóset",en:"closet",ph:"KLOH-set",tts:"clóset",icon:"🚪",color:"#a78bfa"},{word:"mesita de noche",en:"nightstand",ph:"meh-SEE-tah deh NOH-cheh",tts:"mesita de noche",icon:"🛋️",color:"#e8b44a"},{word:"lámpara",en:"lamp",ph:"LAM-pah-rah",tts:"lámpara",icon:"💡",color:"#f59e0b"},{word:"espejo",en:"mirror",ph:"ehs-PEH-hoh",tts:"espejo",icon:"🪞",color:"#60a5fa"},{word:"cortina",en:"curtain",ph:"kor-TEE-nah",tts:"cortina",icon:"🪟",color:"#4aa8a0"},{word:"armario",en:"wardrobe",ph:"ar-MAH-ryoh",tts:"armario",icon:"🗄️",color:"#92400e"}
  ]},
  {id:"bano",label:"🚿 Baño",type:"basic",items:[
    {word:"baño",en:"bathroom",ph:"BAH-nyoh",tts:"baño",icon:"🚿",color:"#60a5fa"},{word:"ducha",en:"shower",ph:"DOO-chah",tts:"ducha",icon:"🚿",color:"#60a5fa"},{word:"inodoro",en:"toilet",ph:"ee-noh-DOH-roh",tts:"inodoro",icon:"🚽",color:"#94a3b8"},{word:"lavamanos",en:"sink",ph:"lah-vah-MAH-nohs",tts:"lavamanos",icon:"🧼",color:"#60a5fa"},{word:"jabón",en:"soap",ph:"hah-BON",tts:"jabón",icon:"🧴",color:"#34d399"},{word:"toalla",en:"towel",ph:"toh-AH-yah",tts:"toalla",icon:"🧖",color:"#a78bfa"},{word:"cepillo de dientes",en:"toothbrush",ph:"seh-PEE-yoh deh DYEN-tehs",tts:"cepillo de dientes",icon:"🪥",color:"#60a5fa"},{word:"pasta dental",en:"toothpaste",ph:"PAHS-tah den-TAHL",tts:"pasta dental",icon:"🦷",color:"#34d399"},{word:"papel higiénico",en:"toilet paper",ph:"pah-PEL ee-HYEH-nee-koh",tts:"papel higiénico",icon:"🧻",color:"#fff"},{word:"champú",en:"shampoo",ph:"cham-POO",tts:"champú",icon:"🧴",color:"#ec4899"}
  ]},
  {id:"trabajo",label:"💼 Trabajo",type:"basic",items:[
    {word:"empresa",en:"company",ph:"em-PREH-sah",tts:"empresa",icon:"🏢",color:"#a78bfa"},{word:"jefe/a",en:"boss",ph:"HEH-feh / fah",tts:"jefe o jefa",icon:"👔",color:"#e8b44a"},{word:"cliente",en:"client / customer",ph:"klee-EN-teh",tts:"cliente",icon:"🤝",color:"#4aa8a0"},{word:"compañero/a",en:"coworker",ph:"kom-pah-NYEH-roh / rah",tts:"compañero o compañera",icon:"🧑‍💼",color:"#60a5fa"},{word:"reunión",en:"meeting",ph:"reh-oo-NYON",tts:"reunión",icon:"🗣️",color:"#ec4899"},{word:"proyecto",en:"project",ph:"proh-YEHK-toh",tts:"proyecto",icon:"📋",color:"#f59e0b"},{word:"horario",en:"schedule",ph:"oh-RAH-ryoh",tts:"horario",icon:"🕘",color:"#34d399"},{word:"sueldo",en:"salary",ph:"SWEHL-doh",tts:"sueldo",icon:"💰",color:"#e8b44a"},{word:"entrevista",en:"interview",ph:"en-treh-BEES-tah",tts:"entrevista",icon:"📝",color:"#a78bfa"},{word:"negocio",en:"business",ph:"neh-GOH-syoh",tts:"negocio",icon:"🏪",color:"#e85d75"}
  ]},
  {id:"oficina",label:"🖥️ Oficina",type:"basic",items:[
    {word:"computador",en:"computer (Colombian)",ph:"kom-poo-tah-DOR",tts:"computador",icon:"💻",color:"#60a5fa"},{word:"escritorio",en:"desk",ph:"ehs-kree-TOH-ryoh",tts:"escritorio",icon:"🪑",color:"#92400e"},{word:"teclado",en:"keyboard",ph:"teh-KLAH-doh",tts:"teclado",icon:"⌨️",color:"#94a3b8"},{word:"pantalla",en:"screen",ph:"pan-TAH-yah",tts:"pantalla",icon:"🖥️",color:"#60a5fa"},{word:"impresora",en:"printer",ph:"eem-preh-SOH-rah",tts:"impresora",icon:"🖨️",color:"#a78bfa"},{word:"documento",en:"document",ph:"doh-koo-MEN-toh",tts:"documento",icon:"📄",color:"#fff"},{word:"correo electrónico",en:"email",ph:"koh-RREH-oh eh-lehk-TROH-nee-koh",tts:"correo electrónico",icon:"📧",color:"#4aa8a0"},{word:"archivo",en:"file",ph:"ar-CHEE-boh",tts:"archivo",icon:"🗂️",color:"#f59e0b"},{word:"silla",en:"chair",ph:"SEE-yah",tts:"silla",icon:"🪑",color:"#34d399"}
  ]},
  {id:"carropartes",label:"🚗 Partes del carro",type:"basic",items:[
    {word:"motor",en:"engine",ph:"moh-TOR",tts:"motor",icon:"⚙️",color:"#94a3b8"},{word:"llanta",en:"tire (Colombian)",ph:"YAN-tah",tts:"llanta",icon:"🛞",color:"#e85d75"},{word:"volante",en:"steering wheel",ph:"boh-LAN-teh",tts:"volante",icon:"⭕",color:"#60a5fa"},{word:"freno",en:"brake",ph:"FREH-noh",tts:"freno",icon:"🛑",color:"#e85d75"},{word:"batería",en:"battery",ph:"bah-teh-REE-ah",tts:"batería",icon:"🔋",color:"#34d399"},{word:"parabrisas",en:"windshield",ph:"pah-rah-BREE-sahs",tts:"parabrisas",icon:"🚘",color:"#60a5fa"},{word:"espejo retrovisor",en:"rearview mirror",ph:"ehs-PEH-hoh rreh-troh-bee-SOR",tts:"espejo retrovisor",icon:"🪞",color:"#a78bfa"},{word:"placa",en:"license plate",ph:"PLAH-kah",tts:"placa",icon:"🔖",color:"#e8b44a"},{word:"baúl",en:"trunk",ph:"bah-OOL",tts:"baúl",icon:"🧳",color:"#92400e"},{word:"capó",en:"hood",ph:"kah-POH",tts:"capó",icon:"🚗",color:"#f59e0b"},{word:"puerta",en:"door",ph:"PWER-tah",tts:"puerta",icon:"🚪",color:"#4aa8a0"}
  ]},
];
/* New home, work, office, and car categories are also available in Vocab. */
VC.push(...FRASES.filter(section=>section.id&&section.type==="basic"));
const DIALOGUE=[{who:"A",es:"Hola, ¿cómo está?",en:"Hi, how are you? (formal)",tts:"Hola, ¿cómo está?"},{who:"B",es:"Hola, estoy bien, gracias.",en:"Hi, I'm fine, thank you.",tts:"Hola, estoy bien, gracias."},{who:"A",es:"Soy David. ¡Gusto en conocerle!",en:"I'm David. Nice to meet you!",tts:"Soy David. ¡Gusto en conocerle!"},{who:"B",es:"Soy Roberto. ¡El gusto es mío!",en:"I'm Roberto. The pleasure is mine!",tts:"Soy Roberto. ¡El gusto es mío!"},{who:"A",es:"Mucho gusto, señor Roberto.",en:"Nice to meet you, Mr. Roberto.",tts:"Mucho gusto, señor Roberto."},{who:"B",es:"Igualmente, señor David.",en:"Likewise, Mr. David.",tts:"Igualmente, señor David."}];
const CONVERSATIONS=[
  {title:"Presentación personal",tense:"Ahora",lines:[{who:"A",es:"Hola, ¿cómo te llamas?",en:"Hi, what's your name?",tts:"Hola, ¿cómo te llamas?"},{who:"B",es:"Me llamo Laura. Mucho gusto.",en:"My name is Laura. Nice to meet you.",tts:"Me llamo Laura. Mucho gusto."}]},
  {title:"Presentación personal",tense:"Planes",lines:[{who:"A",es:"Mañana voy a presentarme a mis nuevos vecinos.",en:"Tomorrow I'm going to introduce myself to my new neighbors.",tts:"Mañana voy a presentarme a mis nuevos vecinos."},{who:"B",es:"¡Qué bien! Vas a hablar con mucha confianza.",en:"Great! You are going to speak confidently.",tts:"¡Qué bien! Vas a hablar con mucha confianza."}]},
  {title:"Presentación personal",tense:"Ayer",lines:[{who:"A",es:"Ayer conocí a una persona nueva.",en:"Yesterday I met a new person.",tts:"Ayer conocí a una persona nueva."},{who:"B",es:"Le dije mi nombre y nos saludamos.",en:"I told them my name and we greeted each other.",tts:"Le dije mi nombre y nos saludamos."}]},
  {title:"Profesión",tense:"Ahora",lines:[{who:"A",es:"¿En qué trabajas?",en:"What do you do for work?",tts:"¿En qué trabajas?"},{who:"B",es:"Trabajo como ingeniero.",en:"I work as an engineer.",tts:"Trabajo como ingeniero."}]},
  {title:"Profesión",tense:"Planes",lines:[{who:"A",es:"¿Qué vas a estudiar?",en:"What are you going to study?",tts:"¿Qué vas a estudiar?"},{who:"B",es:"Voy a estudiar para ser médico.",en:"I'm going to study to become a doctor.",tts:"Voy a estudiar para ser médico."}]},
  {title:"Profesión",tense:"Ayer",lines:[{who:"A",es:"¿Qué hiciste ayer?",en:"What did you do yesterday?",tts:"¿Qué hiciste ayer?"},{who:"B",es:"Ayer trabajé en la oficina.",en:"Yesterday I worked at the office.",tts:"Ayer trabajé en la oficina."}]},
  {title:"¿Dónde vives?",tense:"Ahora",lines:[{who:"A",es:"¿Dónde vives?",en:"Where do you live?",tts:"¿Dónde vives?"},{who:"B",es:"Vivo en Medellín, cerca del parque.",en:"I live in Medellín, near the park.",tts:"Vivo en Medellín, cerca del parque."}]},
  {title:"¿Dónde vives?",tense:"Planes",lines:[{who:"A",es:"¿Dónde vas a vivir?",en:"Where are you going to live?",tts:"¿Dónde vas a vivir?"},{who:"B",es:"Voy a vivir en Bogotá el próximo año.",en:"I'm going to live in Bogotá next year.",tts:"Voy a vivir en Bogotá el próximo año."}]},
  {title:"¿Dónde vives?",tense:"Ayer",lines:[{who:"A",es:"¿Dónde viviste antes?",en:"Where did you live before?",tts:"¿Dónde viviste antes?"},{who:"B",es:"Viví en Cali con mi familia.",en:"I lived in Cali with my family.",tts:"Viví en Cali con mi familia."}]},
  {title:"Gustos y familia",tense:"Ahora",lines:[{who:"A",es:"¿Tienes hermanos?",en:"Do you have siblings?",tts:"¿Tienes hermanos?"},{who:"B",es:"Sí, tengo una hermana y un hermano.",en:"Yes, I have a sister and a brother.",tts:"Sí, tengo una hermana y un hermano."}]},
  {title:"Gustos y familia",tense:"Planes",lines:[{who:"A",es:"¿Qué vas a hacer con tu familia?",en:"What are you going to do with your family?",tts:"¿Qué vas a hacer con tu familia?"},{who:"B",es:"Voy a pasar tiempo con ellos.",en:"I'm going to spend time with them.",tts:"Voy a pasar tiempo con ellos."}]},
  {title:"Gustos y familia",tense:"Ayer",lines:[{who:"A",es:"¿Qué hiciste con tu familia?",en:"What did you do with your family?",tts:"¿Qué hiciste con tu familia?"},{who:"B",es:"Ayer cené con mis padres.",en:"Yesterday I had dinner with my parents.",tts:"Ayer cené con mis padres."}]},
  {title:"Pedir direcciones",tense:"Ahora",lines:[{who:"A",es:"Disculpe, ¿me regala la dirección?",en:"Excuse me, could you give me the address?",tts:"Disculpe, ¿me regala la dirección?"},{who:"B",es:"Siga derecho y gire a la izquierda.",en:"Go straight and turn left.",tts:"Siga derecho y gire a la izquierda."}]},
  {title:"Pedir direcciones",tense:"Planes",lines:[{who:"A",es:"¿Cómo voy a llegar al parqueadero?",en:"How am I going to get to the parking lot?",tts:"¿Cómo voy a llegar al parqueadero?"},{who:"B",es:"Va a girar en la próxima esquina.",en:"You are going to turn at the next corner.",tts:"Va a girar en la próxima esquina."}]},
  {title:"Pedir direcciones",tense:"Ayer",lines:[{who:"A",es:"¿Cómo llegaste al hospital?",en:"How did you get to the hospital?",tts:"¿Cómo llegaste al hospital?"},{who:"B",es:"Seguí derecho y pregunté en la esquina.",en:"I went straight and asked at the corner.",tts:"Seguí derecho y pregunté en la esquina."}]},
  {title:"Carro y taxi",tense:"Ahora",lines:[{who:"A",es:"¿Me lleva a esta dirección, por favor?",en:"Can you take me to this address, please?",tts:"¿Me lleva a esta dirección, por favor?"},{who:"B",es:"Claro, con mucho gusto.",en:"Of course, with pleasure.",tts:"Claro, con mucho gusto."}]},
  {title:"Carro y taxi",tense:"Planes",lines:[{who:"A",es:"¿Vamos a pedir un carro?",en:"Are we going to request a car?",tts:"¿Vamos a pedir un carro?"},{who:"B",es:"Sí, voy a pedir un taxi.",en:"Yes, I'm going to request a taxi.",tts:"Sí, voy a pedir un taxi."}]},
  {title:"Carro y taxi",tense:"Ayer",lines:[{who:"A",es:"¿Tomaste taxi ayer?",en:"Did you take a taxi yesterday?",tts:"¿Tomaste taxi ayer?"},{who:"B",es:"Sí, el conductor fue muy amable.",en:"Yes, the driver was very kind.",tts:"Sí, el conductor fue muy amable."}]},
  {title:"Cocinar juntos",tense:"Ahora",lines:[{who:"A",es:"¿Cocinamos juntos?",en:"Shall we cook together?",tts:"¿Cocinamos juntos?"},{who:"B",es:"Dale, yo corto las verduras.",en:"Sure, I'll cut the vegetables.",tts:"Dale, yo corto las verduras."}]},
  {title:"Cocinar juntos",tense:"Planes",lines:[{who:"A",es:"¿Qué vamos a cocinar?",en:"What are we going to cook?",tts:"¿Qué vamos a cocinar?"},{who:"B",es:"Vamos a preparar una sopa.",en:"We are going to make a soup.",tts:"Vamos a preparar una sopa."}]},
  {title:"Cocinar juntos",tense:"Ayer",lines:[{who:"A",es:"¿Qué cocinaron ayer?",en:"What did you cook yesterday?",tts:"¿Qué cocinaron ayer?"},{who:"B",es:"Ayer hervimos la comida y probamos la salsa.",en:"Yesterday we boiled the food and tasted the sauce.",tts:"Ayer hervimos la comida y probamos la salsa."}]},
  {title:"Ver televisión",tense:"Ahora",lines:[{who:"A",es:"¿Qué quieres ver?",en:"What do you want to watch?",tts:"¿Qué quieres ver?"},{who:"B",es:"Una serie. ¿Dónde está el control remoto?",en:"A series. Where is the remote control?",tts:"Una serie. ¿Dónde está el control remoto?"},{who:"A",es:"Está en el sofá.",en:"It's on the sofa.",tts:"Está en el sofá."}]},
  {title:"Ver televisión",tense:"Planes",lines:[{who:"A",es:"¿Qué vas a hacer esta noche?",en:"What are you going to do tonight?",tts:"¿Qué vas a hacer esta noche?"},{who:"B",es:"Voy a ver una película y relajarme.",en:"I'm going to watch a movie and relax.",tts:"Voy a ver una película y relajarme."}]},
  {title:"Ver televisión",tense:"Ayer",lines:[{who:"A",es:"¿Qué viste anoche?",en:"What did you watch last night?",tts:"¿Qué viste anoche?"},{who:"B",es:"Vi las noticias y descansé en el sofá.",en:"I watched the news and rested on the sofa.",tts:"Vi las noticias y descansé en el sofá."}]},
  {title:"En casa",tense:"Ahora",lines:[{who:"A",es:"¿Dónde está el baño?",en:"Where is the bathroom?",tts:"¿Dónde está el baño?"},{who:"B",es:"Está al lado de la habitación.",en:"It is next to the bedroom.",tts:"Está al lado de la habitación."}]},
  {title:"En casa",tense:"Planes",lines:[{who:"A",es:"¿Vas a arreglar la habitación?",en:"Are you going to tidy the bedroom?",tts:"¿Vas a arreglar la habitación?"},{who:"B",es:"Sí, voy a cambiar la sábana y la cobija.",en:"Yes, I'm going to change the sheet and the blanket.",tts:"Sí, voy a cambiar la sábana y la cobija."}]},
  {title:"En casa",tense:"Ayer",lines:[{who:"A",es:"¿Dónde estaba la toalla?",en:"Where was the towel?",tts:"¿Dónde estaba la toalla?"},{who:"B",es:"Ayer la dejé junto al lavamanos.",en:"Yesterday I left it next to the sink.",tts:"Ayer la dejé junto al lavamanos."}]}
  ,{title:"La habitación",tense:"Ahora",lines:[{who:"A",es:"¿Dónde está la sábana?",en:"Where is the sheet?",tts:"¿Dónde está la sábana?"},{who:"B",es:"Está en el clóset, al lado de la cobija.",en:"It is in the closet, next to the blanket.",tts:"Está en el clóset, al lado de la cobija."},{who:"A",es:"También necesito una almohada.",en:"I also need a pillow.",tts:"También necesito una almohada."},{who:"B",es:"Hay una sobre la cama.",en:"There is one on the bed.",tts:"Hay una sobre la cama."}]},
  {title:"El baño",tense:"Ahora",lines:[{who:"A",es:"Disculpe, ¿dónde está el baño?",en:"Excuse me, where is the bathroom?",tts:"Disculpe, ¿dónde está el baño?"},{who:"B",es:"Está al fondo, a la derecha.",en:"It is at the back, on the right.",tts:"Está al fondo, a la derecha."},{who:"A",es:"¿Hay una toalla limpia?",en:"Is there a clean towel?",tts:"¿Hay una toalla limpia?"},{who:"B",es:"Sí, está junto al lavamanos.",en:"Yes, it is next to the sink.",tts:"Sí, está junto al lavamanos."}]},
  {title:"Trabajo y oficina",tense:"Ahora",lines:[{who:"A",es:"¿Tienes una reunión hoy?",en:"Do you have a meeting today?",tts:"¿Tienes una reunión hoy?"},{who:"B",es:"Sí, con un cliente nuevo.",en:"Yes, with a new client.",tts:"Sí, con un cliente nuevo."},{who:"A",es:"¿Vas a enviar el correo?",en:"Are you going to send the email?",tts:"¿Vas a enviar el correo?"},{who:"B",es:"Sí, después de imprimir el documento.",en:"Yes, after printing the document.",tts:"Sí, después de imprimir el documento."}]},
  {title:"Partes del carro",tense:"Ahora",lines:[{who:"A",es:"¿Qué le pasa al carro?",en:"What is wrong with the car?",tts:"¿Qué le pasa al carro?"},{who:"B",es:"La llanta está baja y el freno suena.",en:"The tire is low and the brake makes a noise.",tts:"La llanta está baja y el freno suena."},{who:"A",es:"¿Hay gasolina?",en:"Is there gas?",tts:"¿Hay gasolina?"},{who:"B",es:"Sí, pero hay que revisar la batería.",en:"Yes, but we need to check the battery.",tts:"Sí, pero hay que revisar la batería."}]},
  {title:"Preparar la cocina",tense:"Ahora",lines:[{who:"A",es:"¿Dónde está el cuchillo?",en:"Where is the knife?",tts:"¿Dónde está el cuchillo?"},{who:"B",es:"Está en el cajón, junto a la cuchara.",en:"It is in the drawer, next to the spoon.",tts:"Está en el cajón, junto a la cuchara."},{who:"A",es:"Voy a cortar las verduras.",en:"I am going to cut the vegetables.",tts:"Voy a cortar las verduras."},{who:"B",es:"Listo, yo caliento la olla.",en:"All right, I will heat the pot.",tts:"Listo, yo caliento la olla."}]}
];

// ── Grammar data ──────────────────────────────────────────────────────────────
const GRAMMAR={
  presente:{intro:"The present tense describes habits, facts, and current actions. 3 verb types: AR, ER, IR.",trick:"The -O ending always means 'I'. Yo habl-O = I speak. Yo com-O = I eat. Yo viv-O = I live. Learn -O and you can talk about yourself instantly!",
    tables:[{title:"AR Verbs — Hablar",sub:"Drop -AR, add: -o, -as, -a, -amos, -an",rows:[{pro:"Yo",verb:"hablo",en:"I speak",tts:"yo hablo"},{pro:"Tú",verb:"hablas",en:"you speak",tts:"tú hablas"},{pro:"Él/Ella",verb:"habla",en:"he/she speaks",tts:"él habla"},{pro:"Nosotros",verb:"hablamos",en:"we speak",tts:"nosotros hablamos"},{pro:"Ellos",verb:"hablan",en:"they speak",tts:"ellos hablan"}]},{title:"ER Verbs — Comer",sub:"Drop -ER, add: -o, -es, -e, -emos, -en",rows:[{pro:"Yo",verb:"como",en:"I eat",tts:"yo como"},{pro:"Tú",verb:"comes",en:"you eat",tts:"tú comes"},{pro:"Él/Ella",verb:"come",en:"he/she eats",tts:"él come"},{pro:"Nosotros",verb:"comemos",en:"we eat",tts:"nosotros comemos"},{pro:"Ellos",verb:"comen",en:"they eat",tts:"ellos comen"}]},{title:"IR Verbs — Vivir",sub:"Drop -IR, add: -o, -es, -e, -imos, -en",rows:[{pro:"Yo",verb:"vivo",en:"I live",tts:"yo vivo"},{pro:"Tú",verb:"vives",en:"you live",tts:"tú vives"},{pro:"Él/Ella",verb:"vive",en:"he/she lives",tts:"él vive"},{pro:"Nosotros",verb:"vivimos",en:"we live",tts:"nosotros vivimos"},{pro:"Ellos",verb:"viven",en:"they live",tts:"ellos viven"}]}],
    examples:[{es:"Yo hablo un poco de español.",en:"I speak a little Spanish.",tts:"Yo hablo un poco de español."},{es:"¿Dónde vives tú?",en:"Where do you live?",tts:"¿Dónde vives tú?"},{es:"Ella come arepa todos los días.",en:"She eats arepa every day.",tts:"Ella come arepa todos los días."}]},
  pasado:{intro:"The simple past (Pretérito Indefinido) is used for completed actions. 'I spoke', 'I ate', 'I went'. Accents on the endings are the key signal.",trick:"Look for the accent at the END of a verb — it signals past tense! hablÉ = I spoke, comIÓ = he ate, fuÉ = I was/went. Spot the tilde = something HAPPENED!",
    tables:[{title:"AR Verbs — Hablar",sub:"Past endings: -é, -aste, -ó, -amos, -aron",rows:[{pro:"Yo",verb:"hablé",en:"I spoke",tts:"yo hablé"},{pro:"Tú",verb:"hablaste",en:"you spoke",tts:"tú hablaste"},{pro:"Él/Ella",verb:"habló",en:"he/she spoke",tts:"él habló"},{pro:"Nosotros",verb:"hablamos",en:"we spoke",tts:"nosotros hablamos"},{pro:"Ellos",verb:"hablaron",en:"they spoke",tts:"ellos hablaron"}]},{title:"ER/IR Verbs — Comer",sub:"Past endings: -í, -iste, -ió, -imos, -ieron",rows:[{pro:"Yo",verb:"comí",en:"I ate",tts:"yo comí"},{pro:"Tú",verb:"comiste",en:"you ate",tts:"tú comiste"},{pro:"Él/Ella",verb:"comió",en:"he/she ate",tts:"él comió"},{pro:"Nosotros",verb:"comimos",en:"we ate",tts:"nosotros comimos"},{pro:"Ellos",verb:"comieron",en:"they ate",tts:"ellos comieron"}]},{title:"⚡ Ser & Ir — IDENTICAL past tense!",sub:"Both mean 'was' AND 'went' — context tells you which",rows:[{pro:"Yo",verb:"fui",en:"I was / I went",tts:"yo fui"},{pro:"Tú",verb:"fuiste",en:"you were / went",tts:"tú fuiste"},{pro:"Él/Ella",verb:"fue",en:"he was / he went",tts:"él fue"},{pro:"Nosotros",verb:"fuimos",en:"we were / went",tts:"nosotros fuimos"},{pro:"Ellos",verb:"fueron",en:"they were / went",tts:"ellos fueron"}]}],
    examples:[{es:"Ayer hablé con mi amigo.",en:"Yesterday I spoke with my friend.",tts:"Ayer hablé con mi amigo."},{es:"¿Qué comiste anoche?",en:"What did you eat last night?",tts:"¿Qué comiste anoche?"},{es:"Fui al mercado esta mañana.",en:"I went to the market this morning.",tts:"Fui al mercado esta mañana."}]},
  futuro:{intro:"Great news — the future is the EASIEST tense! Keep the full infinitive and add endings. Or use the even simpler 'voy a' (going to) form.",trick:"Near future = VOY A + any verb. Exactly like English 'going to'. Voy a comer = I'm going to eat. Start with this — you can use it for months before needing the full future tense!",
    tables:[{title:"Simple Future — Any Verb",sub:"Keep full infinitive + add: -é, -ás, -á, -emos, -án",rows:[{pro:"Yo",verb:"-é  (hablaré)",en:"I will speak",tts:"yo hablaré"},{pro:"Tú",verb:"-ás  (hablarás)",en:"you will speak",tts:"tú hablarás"},{pro:"Él/Ella",verb:"-á  (hablará)",en:"he/she will speak",tts:"él hablará"},{pro:"Nosotros",verb:"-emos  (hablaremos)",en:"we will speak",tts:"nosotros hablaremos"},{pro:"Ellos",verb:"-án  (hablarán)",en:"they will speak",tts:"ellos hablarán"}]},{title:"Ir a + Infinitive — Near Future",sub:"The easy way: voy/vas/va/vamos/van + a + verb",rows:[{pro:"Yo",verb:"voy a comer",en:"I'm going to eat",tts:"voy a comer"},{pro:"Tú",verb:"vas a comer",en:"you're going to eat",tts:"vas a comer"},{pro:"Él/Ella",verb:"va a comer",en:"he's going to eat",tts:"va a comer"},{pro:"Nosotros",verb:"vamos a comer",en:"we're going to eat",tts:"vamos a comer"},{pro:"Ellos",verb:"van a comer",en:"they're going to eat",tts:"van a comer"}]}],
    examples:[{es:"Mañana voy a ir al mercado.",en:"Tomorrow I'm going to go to the market.",tts:"Mañana voy a ir al mercado."},{es:"¿Vas a comer arepa?",en:"Are you going to eat arepa?",tts:"¿Vas a comer arepa?"},{es:"Va a llover esta tarde.",en:"It's going to rain this afternoon.",tts:"Va a llover esta tarde."}]},
  trucos:[{main:"V = B in Colombian Spanish",sub:"Never stress about V vs B. Vaca = 'baca'. Vo = 'bo'. Identical sounds in Colombia. ✓",icon:"🎯"},{main:"Accents at end = Past tense",sub:"Hablé = I spoke. Comió = he ate. Fue = he was/went. If you see an accent at the END of a verb, something HAPPENED.",icon:"⏮️"},{main:"Voy a = 'Going to'",sub:"The simplest future: Voy a + verb. Voy a comer = I'm going to eat. Start with this for months.",icon:"⏭️"},{main:"Ser vs Estar (both = 'to be')",sub:"Ser = permanent: Soy alto. Estar = temporary: Estoy cansado. Will it change? Yes → Estar. No → Ser.",icon:"⭐"},{main:"Fui = was AND went",sub:"Ser and Ir are IDENTICAL in past tense! Fui = I was (ser) OR I went (ir). Context tells you which.",icon:"🤯"},{main:"-O ending always means 'I'",sub:"Any present verb ending -O = I do it. Hablo = I speak. Como = I eat. Tengo = I have.",icon:"👤"},{main:"H is always silent",sub:"Hola, huevo, hacer, hotel — H is NEVER pronounced in Spanish. Just ignore it.",icon:"🤫"},{main:"The tilde changes meaning",sub:"Sí = Yes. Si = If. Él = He. El = The. Más = More. Mas = But. That little accent changes everything.",icon:"✍️"},{main:"Colombia = no 'vosotros'",sub:"Spain uses 'vosotros' for 'you all'. Colombia just uses 'ustedes' for everyone. One less thing to learn!",icon:"🇨🇴"},{main:"Gerunds end in -ando/-iendo",sub:"Habl-ANDO = speaking. Com-IENDO = eating. Viv-IENDO = living. Use these with estar: Estoy hablando = I am speaking.",icon:"🔄"}],
};

// Pronouns data
const PRONOMBRES={
  directo:{title:"Objeto Directo (Direct Object)",sub:"Replaces the thing receiving the action directly",color:"#60a5fa",rows:[
    {w:"lo",meaning:"him / it (m.)",example:"Lo veo. — I see him/it.",tts:"lo veo"},
    {w:"la",meaning:"her / it (f.)",example:"La veo. — I see her/it.",tts:"la veo"},
    {w:"los",meaning:"them (m./mixed)",example:"Los compro. — I'm buying them.",tts:"los compro"},
    {w:"las",meaning:"them (f.)",example:"Las tengo. — I have them.",tts:"las tengo"},
    {w:"me",meaning:"me (first person)",example:"Me llaman. — They call me.",tts:"me llaman"},
    {w:"te",meaning:"you (second person)",example:"Te veo mañana. — I'll see you tomorrow.",tts:"te veo mañana"},
    {w:"nos",meaning:"us",example:"Nos llaman. — They call us.",tts:"nos llaman"},
  ]},
  indirecto:{title:"Objeto Indirecto (Indirect Object)",sub:"Replaces the person TO WHOM something is done",color:"#a78bfa",rows:[
    {w:"le",meaning:"to him / to her / to you (formal)",example:"Le doy el libro. — I give him/her the book.",tts:"le doy el libro"},
    {w:"me",meaning:"to me",example:"Me da el dinero. — He gives me the money.",tts:"me da el dinero"},
    {w:"te",meaning:"to you",example:"Te mando un mensaje. — I'm sending you a message.",tts:"te mando un mensaje"},
    {w:"nos",meaning:"to us",example:"Nos explica todo. — He explains everything to us.",tts:"nos explica todo"},
    {w:"les",meaning:"to them / to you all",example:"Les digo la verdad. — I tell them the truth.",tts:"les digo la verdad"},
  ]},
  trick:"In Colombian Spanish: 'Le' is used for the indirect object (to him/her). 'Lo/La' for the direct object (him/her/it). Unlike Spain, Colombians do NOT use 'le' for the direct object — they always say 'lo veo' (I see him), never 'le veo'.",
  examples:[
    {es:"¿Lo ves? — Sí, lo veo.",en:"Do you see it/him? — Yes, I see it/him.",tts:"¿Lo ves? Sí, lo veo."},
    {es:"Le di el dinero a Juan.",en:"I gave Juan the money. (to Juan = le)",tts:"Le di el dinero a Juan."},
    {es:"Te quiero mucho.",en:"I love you a lot.",tts:"Te quiero mucho."},
    {es:"¿Me puede ayudar?",en:"Can you help me?",tts:"¿Me puede ayudar?"},
    {es:"La compré en el mercado.",en:"I bought it (f.) at the market.",tts:"La compré en el mercado."},
    {es:"Nos llaman mañana.",en:"They're calling us tomorrow.",tts:"Nos llaman mañana."},
  ],
};

// Reflexive verbs
const REFLEXIVOS=[
  {inf:"llamarse",en:"to be called (name)",forms:[{p:"Yo",v:"me llamo",e:"I am called / my name is"},{p:"Tú",v:"te llamas",e:"you are called"},{p:"Él/Ella",v:"se llama",e:"he/she is called"},{p:"Nosotros",v:"nos llamamos",e:"we are called"},{p:"Ellos",v:"se llaman",e:"they are called"}],example:{es:"Me llamo David. ¿Cómo te llamas?",en:"My name is David. What's your name?"}},
  {inf:"levantarse",en:"to get up / to stand up",forms:[{p:"Yo",v:"me levanto",e:"I get up"},{p:"Tú",v:"te levantas",e:"you get up"},{p:"Él/Ella",v:"se levanta",e:"he/she gets up"},{p:"Nosotros",v:"nos levantamos",e:"we get up"},{p:"Ellos",v:"se levantan",e:"they get up"}],example:{es:"Me levanto a las seis.",en:"I get up at six o'clock."}},
  {inf:"sentarse",en:"to sit down",forms:[{p:"Yo",v:"me siento",e:"I sit down"},{p:"Tú",v:"te sientas",e:"you sit down"},{p:"Él/Ella",v:"se sienta",e:"he/she sits down"},{p:"Nosotros",v:"nos sentamos",e:"we sit down"},{p:"Ellos",v:"se sientan",e:"they sit down"}],example:{es:"¿Puedo sentarme aquí?",en:"Can I sit here?"}},
  {inf:"irse",en:"to leave / to go away",forms:[{p:"Yo",v:"me voy",e:"I'm leaving"},{p:"Tú",v:"te vas",e:"you're leaving"},{p:"Él/Ella",v:"se va",e:"he/she is leaving"},{p:"Nosotros",v:"nos vamos",e:"we're leaving"},{p:"Ellos",v:"se van",e:"they're leaving"}],example:{es:"¡Me voy! Hasta mañana.",en:"I'm leaving! See you tomorrow."}},
  {inf:"sentirse",en:"to feel (emotion/physical)",forms:[{p:"Yo",v:"me siento",e:"I feel"},{p:"Tú",v:"te sientes",e:"you feel"},{p:"Él/Ella",v:"se siente",e:"he/she feels"},{p:"Nosotros",v:"nos sentimos",e:"we feel"},{p:"Ellos",v:"se sienten",e:"they feel"}],example:{es:"Me siento muy bien hoy.",en:"I feel very well today."}},
  {inf:"despertarse",en:"to wake up",forms:[{p:"Yo",v:"me despierto",e:"I wake up"},{p:"Tú",v:"te despiertas",e:"you wake up"},{p:"Él/Ella",v:"se despierta",e:"he/she wakes up"},{p:"Nosotros",v:"nos despertamos",e:"we wake up"},{p:"Ellos",v:"se despiertan",e:"they wake up"}],example:{es:"Me despierto temprano en Colombia.",en:"I wake up early in Colombia."}},
];
