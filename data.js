// Spanish learning app data
// ── Alphabet ──────────────────────────────────────────────────────────────────
const VW=["a","e","i","o","u"],VL=["A","E","I","O","U"];
const AL=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const CN=AL.filter(l=>!VL.includes(l));
const LI={A:{name:"a",phonetic:"ah",tts:"a"},B:{name:"be",phonetic:"beh",tts:"be"},C:{name:"ce",phonetic:"seh",tts:"ce"},D:{name:"de",phonetic:"deh",tts:"de"},E:{name:"e",phonetic:"eh",tts:"e"},F:{name:"efe",phonetic:"EH-feh",tts:"efe"},G:{name:"ge",phonetic:"heh",tts:"ge"},H:{name:"hache",phonetic:"AH-cheh",tts:"hache"},I:{name:"i",phonetic:"ee",tts:"i"},J:{name:"jota",phonetic:"HOH-tah",tts:"jota"},K:{name:"ka",phonetic:"kah",tts:"ka"},L:{name:"ele",phonetic:"EH-leh",tts:"ele"},M:{name:"eme",phonetic:"EH-meh",tts:"eme"},N:{name:"ene",phonetic:"EH-neh",tts:"ene"},Ñ:{name:"eñe",phonetic:"EH-nyeh",tts:"eñe"},O:{name:"o",phonetic:"oh",tts:"o"},P:{name:"pe",phonetic:"peh",tts:"pe"},Q:{name:"cu",phonetic:"koo",tts:"cu"},R:{name:"erre",phonetic:"EH-rreh",tts:"erre"},S:{name:"ese",phonetic:"EH-seh",tts:"ese"},T:{name:"te",phonetic:"teh",tts:"te"},U:{name:"u",phonetic:"oo",tts:"u"},V:{name:"uve",phonetic:"OO-beh (=B)",tts:"uve"},W:{name:"doble ve",phonetic:"DOH-bleh beh",tts:"doble ve"},X:{name:"equis",phonetic:"EH-kees",tts:"equis"},Y:{name:"ye",phonetic:"yeh",tts:"ye"},Z:{name:"zeta",phonetic:"SEH-tah",tts:"zeta"}};
const VS={a:"ah",e:"eh",i:"ee",o:"oh",u:"oo"};
/* Spanish orthography on purpose: these strings are read by a SPANISH voice,
   so "dó/quí/só" come out right, while English-style "doh/kee/soh" would not. */
const SYL_TTS_FIX={do:"dó",go:"gó",qi:"quí",to:"tó",ro:"ró",wu:"wú",zo:"só",ha:"a",he:"e",hi:"i",ho:"o",hu:"u"};
/* X almost never starts a syllable in real Spanish — it lives between vowels.
   So instead of fake X+vowel syllables, the Sílabas tab shows real example words. */
const X_EXAMPLES=[
  {word:"Taxi",ph:"TAK-see",tts:"taxi",en:"taxi"},
  {word:"Examen",ph:"ek-SAH-men",tts:"examen",en:"exam"},
  {word:"Éxito",ph:"EK-see-toh",tts:"éxito",en:"success"},
];
/* H is silent in Spanish. Keep HA/HE/HI/HO/HU visible for comparison, but
   send only the vowel to speechSynthesis so the learner hears the real sound. */
const RR_SOUND_EXAMPLES={
  a:{word:"arriba",ph:"ah-RREE-bah",tts:"arriba",en:"up / above"},
  e:{word:"arreglo",ph:"ah-RREH-gloh",tts:"arreglo",en:"repair / arrangement"},
  i:{word:"barriga",ph:"bah-RREE-gah",tts:"barriga",en:"stomach / belly"},
  o:{word:"arroyo",ph:"ah-RROH-yoh",tts:"arroyo",en:"stream"},
  u:{word:"arruga",ph:"ah-RROO-gah",tts:"arruga",en:"wrinkle"},
};
/* Special spelling patterns: these need their own lesson because a simple
   consonant + vowel grid cannot show the silent U or the dieresis clearly. */
const SPECIAL_SOUNDS=[
  {id:"ge-gi",label:"GE / GI",sound:"j",tip:"G + E/I has the same strong breathy sound as Spanish J.",examples:[
    {word:"gente",en:"people",ph:"HEN-teh",tts:"gente"},{word:"girar",en:"to turn",ph:"hee-RAR",tts:"girar"}]},
  {id:"ga-go-gu",label:"GA / GO / GU",sound:"g",tip:"G + A/O/U keeps the hard G sound. In GU, the U is part of the spelling but is not a separate vowel sound.",examples:[
    {word:"gato",en:"cat",ph:"GAH-toh",tts:"gato"},{word:"goma",en:"eraser",ph:"GOH-mah",tts:"goma"},{word:"gusano",en:"worm",ph:"goo-SAH-noh",tts:"gusano"}]},
  {id:"gua",label:"GUA",sound:"gwa",tip:"GUA sounds like ‘gwa’: hard G + a quick U glide + A.",examples:[
    {word:"agua",en:"water",ph:"AH-gwah",tts:"agua"},{word:"guante",en:"glove",ph:"GWAHN-teh",tts:"guante"},{word:"guardar",en:"to save / put away",ph:"gwar-DAR",tts:"guardar"}]},
  {id:"gue-gui",label:"GUE / GUI",sound:"ge / gi",tip:"The U is silent. GUE is hard ‘ge’; GUI is hard ‘gi’. Compare them with GE/GI.",examples:[
    {word:"guerra",en:"war",ph:"GEH-rrah",tts:"guerra"},{word:"guitarra",en:"guitar",ph:"gee-TAH-rrah",tts:"guitarra"},{word:"seguir",en:"to continue / follow",ph:"seh-GEER",tts:"seguir"}]},
  {id:"gue-gui-dieresis",label:"GÜE / GÜI",sound:"gwe / gwi",tip:"The two dots make the U audible. Without Ü, the U is silent in GUE/GUI.",examples:[
    {word:"pingüino",en:"penguin",ph:"peen-GWEE-noh",tts:"pingüino"},{word:"vergüenza",en:"shame / embarrassment",ph:"behr-GWEN-sah",tts:"vergüenza"},{word:"bilingüe",en:"bilingual",ph:"bee-leen-GWEH",tts:"bilingüe"}]},
  {id:"que-qui",label:"QUE / QUI",sound:"k",tip:"The U is silent: QUE sounds ‘keh’ and QUI sounds ‘kee’.",examples:[
    {word:"queso",en:"cheese",ph:"KEH-soh",tts:"queso"},{word:"quince",en:"fifteen",ph:"KEEN-seh",tts:"quince"},{word:"¿Qué?",en:"What?",ph:"keh",tts:"¿Qué?"}]}
];
SPECIAL_SOUNDS.push(
  {id:"ca-co-cu",label:"CA / CO / CU",sound:"k",tip:"C + A/O/U keeps the hard K sound.",examples:[{word:"casa",en:"house",ph:"KAH-sah",tts:"casa"},{word:"comer",en:"to eat",ph:"koh-MEHR",tts:"comer"},{word:"cuchara",en:"spoon",ph:"koo-CHAH-rah",tts:"cuchara"}]},
  {id:"ce-ci",label:"CE / CI",sound:"s",tip:"In Colombian Spanish, C + E/I sounds like S.",examples:[{word:"cena",en:"dinner",ph:"SEH-nah",tts:"cena"},{word:"cinco",en:"five",ph:"SEEN-koh",tts:"cinco"},{word:"cerca",en:"near",ph:"SEHR-kah",tts:"cerca"}]},
  {id:"r-rr",label:"R / RR",sound:"tap / trill",tip:"Single R is a quick tap between vowels; RR is a stronger trill.",examples:[{word:"pero",en:"but",ph:"PEH-roh",tts:"pero"},{word:"perro",en:"dog",ph:"PEH-rroh",tts:"perro"},{word:"carro",en:"car",ph:"KAH-rroh",tts:"carro"}]},
  {id:"ll-y",label:"LL / Y",sound:"y",tip:"In most Colombian speech, LL and Y share the same y-like sound.",examples:[{word:"llave",en:"key",ph:"YAH-beh",tts:"llave"},{word:"yo",en:"I",ph:"yoh",tts:"yo"},{word:"calle",en:"street",ph:"KAH-yeh",tts:"calle"}]},
  {id:"ene",label:"Ñ",sound:"ny",tip:"Ñ is one sound, like the ny in canyon.",examples:[{word:"niño",en:"boy / child",ph:"NEE-nyoh",tts:"niño"},{word:"mañana",en:"tomorrow",ph:"mah-NYAH-nah",tts:"mañana"},{word:"año",en:"year",ph:"AH-nyoh",tts:"año"}]},
  {id:"h-silent",label:"H muda",sound:"silent",tip:"H is silent at the start of Spanish words.",examples:[{word:"hola",en:"hello",ph:"OH-lah",tts:"hola"},{word:"hotel",en:"hotel",ph:"oh-TEL",tts:"hotel"},{word:"hacer",en:"to do / make",ph:"ah-SEHR",tts:"hacer"}]},
  {id:"v-b",label:"V / B",sound:"b",tip:"V and B are pronounced alike in Colombian Spanish; focus on the word, not an English V.",examples:[{word:"vaca",en:"cow",ph:"BAH-kah",tts:"vaca"},{word:"vivir",en:"to live",ph:"bee-BEER",tts:"vivir"},{word:"bebé",en:"baby",ph:"beh-BEH",tts:"bebé"}]}
);
const TONGUE_TWISTERS=[
  {id:"rr-1",target:"RR",title:"RR fuerte · nivel 1",text:"Rosa corre rápido alrededor del carro rojo.",en:"Rosa runs quickly around the red car.",tts:"Rosa corre rápido alrededor del carro rojo."},
  {id:"rr-2",target:"RR",title:"RR fuerte · nivel 2",text:"El perro de Roberto corre por el barrio.",en:"Roberto's dog runs through the neighborhood.",tts:"El perro de Roberto corre por el barrio."},
  {id:"rr-3",target:"RR",title:"RR fuerte · reto",text:"Raúl arregla la rueda rota del carro rojo.",en:"Raúl repairs the red car's broken wheel.",tts:"Raúl arregla la rueda rota del carro rojo."},
  {id:"rr-advanced",target:"RR",title:"RR fuerte · reto largo",text:"Parra tenía una perra.\nGuerra tenía una parra.\nLa perra de Parra subió a la parra de Guerra.\nGuerra pegó con la porra a la perra de Parra.\nY Parra le dijo a Guerra: ¿Por qué ha pegado Guerra con la porra a la perra de Parra?\nY Guerra le contestó: Si la perra de Parra no hubiera subido a la parra de Guerra, Guerra no hubiese pegado con la porra a la perra de Parra.",en:"A long RR drill about Parra's dog and Guerra's grapevine.",tts:"Parra tenía una perra. Guerra tenía una parra. La perra de Parra subió a la parra de Guerra. Guerra pegó con la porra a la perra de Parra. Y Parra le dijo a Guerra: ¿Por qué ha pegado Guerra con la porra a la perra de Parra? Y Guerra le contestó: Si la perra de Parra no hubiera subido a la parra de Guerra, Guerra no hubiese pegado con la porra a la perra de Parra."},
  {id:"ene-1",target:"Ñ",title:"Ñ · nivel 1",text:"La niña come piña en la mañana.",en:"The girl eats pineapple in the morning.",tts:"La niña come piña en la mañana."},
  {id:"ene-2",target:"Ñ",title:"Ñ · nivel 2",text:"Mañana, Toño sueña con una montaña pequeña.",en:"Tomorrow, Toño dreams about a small mountain.",tts:"Mañana, Toño sueña con una montaña pequeña."},
  {id:"ge-gi-1",target:"J / GE-GI",title:"J y GE/GI",text:"Jorge gira y recoge la guitarra.",en:"Jorge turns and picks up the guitar.",tts:"Jorge gira y recoge la guitarra."},
  {id:"b-v-1",target:"B / V",title:"B y V",text:"Vivi bebe vino, pero Beto bebe agua.",en:"Vivi drinks wine, but Beto drinks water.",tts:"Vivi bebe vino, pero Beto bebe agua."},
];
const PRONUNCIATION_TIPS=[
  {target:"RR",title:"RR: make the tongue vibrate",sound:"Not the English R",steps:["Keep the tip of your tongue relaxed just behind your upper teeth, where you would say Spanish D/T.","Let air flow over the relaxed tip. Do not curl the tongue back like an English R and do not force the vibration.","Build it slowly: t-ra → d-ra → rra, then rra/rre/rri/rro/rru → perro, carro, arriba."],avoid:"If it sounds like an English R, relax the tongue more and add steady air. A short tap is a useful step, but RR needs repeated vibration."},
  {target:"Ñ",title:"Ñ: one sound, one syllable",sound:"Like the ny in canyon",steps:["Lift the middle of your tongue toward the hard roof of your mouth, while the sides stay near the upper teeth.","Keep Ñ together as one consonant sound. Do not pronounce it as two separate sounds: ni-ño should flow as nee-nyoh.","Build it slowly: ña/ñe/ñi/ño/ñu → niño, mañana, año → a full sentence."],avoid:"Do not replace Ñ with an English N or add an extra vowel. Listen for the smooth ‘ny’ sound in the middle of the word."},
];
const PHONETIC_WARMUP=[
  {id:"vowels",label:"Pure vowels",detail:"A · E · I · O · U",tts:"a, e, i, o, u",target:"a e i o u",note:"Keep each vowel short and steady; do not turn it into an English diphthong."},
  {id:"rr",label:"RR vibration",detail:"RRA · RRE · RRI · RRO · RRU",tts:"arriba, arreglo, barriga, arroyo, arruga",target:"arriba, arreglo, barriga, arroyo, arruga",note:"Relax the tongue tip and let the air create the vibration."},
  {id:"ene",label:"Ñ connection",detail:"ÑA · ÑE · ÑI · ÑO · ÑU",tts:"mañana, pequeño, niño, sueño, ñu",target:"mañana, pequeño, niño, sueño, ñu",note:"Keep Ñ as one smooth consonant; do not separate it into N plus a new syllable."},
  {id:"pairs",label:"Hear the contrast",detail:"PERO ↔ PERRO",tts:"pero, perro, pero, perro",target:"pero, perro",note:"Single R is a quick tap; RR is a stronger vibration."},
];
const ENGLISH_INTERFERENCE=[
  {pattern:"A",spanish:"ah",english:"not ‘ay’",example:"casa",en:"house",tts:"casa"},
  {pattern:"E",spanish:"eh",english:"not ‘ee’",example:"mesa",en:"table",tts:"mesa"},
  {pattern:"I",spanish:"ee",english:"not English ‘eye’",example:"vino",en:"wine / came",tts:"vino"},
  {pattern:"O",spanish:"short oh",english:"do not add ‘oo’",example:"rojo",en:"red",tts:"rojo"},
  {pattern:"H",spanish:"silent",english:"never an English H",example:"hola",en:"hello",tts:"hola"},
  {pattern:"J / GE / GI",spanish:"strong breathy sound",english:"not English J",example:"gente",en:"people",tts:"gente"},
  {pattern:"B / V",spanish:"both use Spanish B",english:"not English V",example:"vivir",en:"to live",tts:"vivir"},
  {pattern:"R / RR",spanish:"tap / trill",english:"not English R",example:"pero / perro",en:"but / dog",tts:"pero, perro"},
];
const MINIMAL_PAIRS=[
  {a:"pero",aEn:"but",b:"perro",bEn:"dog",tip:"One quick tap vs. a trill",tts:"pero, perro"},
  {a:"caro",aEn:"expensive",b:"carro",bEn:"car",tip:"Keep the double R vibrating",tts:"caro, carro"},
  {a:"cero",aEn:"zero",b:"cerro",bEn:"hill",tip:"S stays the same; R changes",tts:"cero, cerro"},
  {a:"para",aEn:"for / in order to",b:"parra",bEn:"grapevine",tip:"A perfect bridge to the long drill",tts:"para, parra"},
  {a:"coro",aEn:"choir",b:"corro",bEn:"I run",tip:"Short R vs. RR in the middle",tts:"coro, corro"},
];
const SPANISH_THINKING_PROMPTS=[
  {intent:"Say that you need to practice today.",model:"Necesito practicar hoy.",tts:"Necesito practicar hoy."},
  {intent:"Say that you are going to call later.",model:"Voy a llamar más tarde.",tts:"Voy a llamar más tarde."},
  {intent:"Say that you did not understand.",model:"No entendí.",tts:"No entendí."},
  {intent:"Ask someone to repeat slowly.",model:"¿Puede repetir despacio?",tts:"¿Puede repetir despacio?"},
  {intent:"Say that the car is over there.",model:"El carro está allá.",tts:"El carro está allá."},
  {intent:"Say that you want to speak Spanish.",model:"Quiero hablar español.",tts:"Quiero hablar español."},
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
    present:[{p:"yo",v:"hablo",e:"I speak"},{p:"tú",v:"hablas",e:"you speak"},{p:"él/ella/ud.",v:"habla",e:"he/she speaks"},{p:"nosotros",v:"hablamos",e:"we speak"},{p:"ellos/uds.",v:"hablan",e:"they speak"}],
    past:[{p:"yo",v:"hablé",e:"I spoke"},{p:"tú",v:"hablaste",e:"you spoke"},{p:"él/ella/ud.",v:"habló",e:"he/she spoke"},{p:"nosotros",v:"hablamos",e:"we spoke"},{p:"ellos/uds.",v:"hablaron",e:"they spoke"}],
    imperfect:[{p:"yo",v:"hablaba",e:"I was speaking / used to speak"},{p:"tú",v:"hablabas",e:"you were speaking / used to speak"},{p:"él/ella/ud.",v:"hablaba",e:"he/she was speaking / used to speak"},{p:"nosotros",v:"hablábamos",e:"we were speaking / used to speak"},{p:"ellos/uds.",v:"hablaban",e:"they were speaking / used to speak"}],
    future:[{p:"yo",v:"hablaré",e:"I will speak"},{p:"tú",v:"hablarás",e:"you will speak"},{p:"él/ella/ud.",v:"hablará",e:"he/she will speak"},{p:"nosotros",v:"hablaremos",e:"we will speak"},{p:"ellos/uds.",v:"hablarán",e:"they will speak"}],
    family:[{f:"el habla",e:"speech / dialect",t:"sustantivo"},{f:"el/la hablante",e:"speaker",t:"sustantivo"},{f:"hablador/a",e:"talkative person",t:"adjetivo"},{f:"la hablada",e:"accent / way of talking",t:"sustantivo"}],
    example:{es:"Yo hablo un poco de español.",en:"I speak a little Spanish."}},
  comer:{en:"to eat",type:"ER — Regular",icon:"🍽️",color:"#f97316",
    gerund:{f:"comiendo",en:"eating"},participle:{f:"comido",en:"eaten"},
    imperative:{tu:{f:"¡Come!",en:"Eat! (informal)"},usted:{f:"¡Coma!",en:"Eat! (formal)"}},
    present:[{p:"yo",v:"como",e:"I eat"},{p:"tú",v:"comes",e:"you eat"},{p:"él/ella/ud.",v:"come",e:"he/she eats"},{p:"nosotros",v:"comemos",e:"we eat"},{p:"ellos/uds.",v:"comen",e:"they eat"}],
    past:[{p:"yo",v:"comí",e:"I ate"},{p:"tú",v:"comiste",e:"you ate"},{p:"él/ella/ud.",v:"comió",e:"he/she ate"},{p:"nosotros",v:"comimos",e:"we ate"},{p:"ellos/uds.",v:"comieron",e:"they ate"}],
    imperfect:[{p:"yo",v:"comía",e:"I was eating / used to eat"},{p:"tú",v:"comías",e:"you were eating / used to eat"},{p:"él/ella/ud.",v:"comía",e:"he/she was eating / used to eat"},{p:"nosotros",v:"comíamos",e:"we were eating / used to eat"},{p:"ellos/uds.",v:"comían",e:"they were eating / used to eat"}],
    future:[{p:"yo",v:"comeré",e:"I will eat"},{p:"tú",v:"comerás",e:"you will eat"},{p:"él/ella/ud.",v:"comerá",e:"he/she will eat"},{p:"nosotros",v:"comeremos",e:"we will eat"},{p:"ellos/uds.",v:"comerán",e:"they will eat"}],
    family:[{f:"la comida",e:"food / meal",t:"sustantivo"},{f:"el comedor",e:"dining room",t:"sustantivo"},{f:"el/la comensal",e:"diner / guest",t:"sustantivo"},{f:"comestible",e:"edible",t:"adjetivo"}],
    example:{es:"¿Qué vas a comer?",en:"What are you going to eat?"}},
  vivir:{en:"to live",type:"IR — Regular",icon:"🏠",color:"#34d399",
    gerund:{f:"viviendo",en:"living"},participle:{f:"vivido",en:"lived"},
    imperative:{tu:{f:"¡Vive!",en:"Live! (informal)"},usted:{f:"¡Viva!",en:"Live! (formal) / Cheers!"}},
    present:[{p:"yo",v:"vivo",e:"I live"},{p:"tú",v:"vives",e:"you live"},{p:"él/ella/ud.",v:"vive",e:"he/she lives"},{p:"nosotros",v:"vivimos",e:"we live"},{p:"ellos/uds.",v:"viven",e:"they live"}],
    past:[{p:"yo",v:"viví",e:"I lived"},{p:"tú",v:"viviste",e:"you lived"},{p:"él/ella/ud.",v:"vivió",e:"he/she lived"},{p:"nosotros",v:"vivimos",e:"we lived"},{p:"ellos/uds.",v:"vivieron",e:"they lived"}],
    imperfect:[{p:"yo",v:"vivía",e:"I was living / used to live"},{p:"tú",v:"vivías",e:"you were living / used to live"},{p:"él/ella/ud.",v:"vivía",e:"he/she was living / used to live"},{p:"nosotros",v:"vivíamos",e:"we were living / used to live"},{p:"ellos/uds.",v:"vivían",e:"they were living / used to live"}],
    future:[{p:"yo",v:"viviré",e:"I will live"},{p:"tú",v:"vivirás",e:"you will live"},{p:"él/ella/ud.",v:"vivirá",e:"he/she will live"},{p:"nosotros",v:"viviremos",e:"we will live"},{p:"ellos/uds.",v:"vivirán",e:"they will live"}],
    family:[{f:"la vida",e:"life",t:"sustantivo"},{f:"la vivienda",e:"housing / home",t:"sustantivo"},{f:"vivo/a",e:"alive / lively",t:"adjetivo"},{f:"el/la vecino/a",e:"neighbour",t:"sustantivo"}],
    example:{es:"Vivo en Colombia.",en:"I live in Colombia."}},
  beber:{en:"to drink",type:"ER — Regular",icon:"🥤",color:"#60a5fa",
    gerund:{f:"bebiendo",en:"drinking"},participle:{f:"bebido",en:"drunk (drunk something)"},
    imperative:{tu:{f:"¡Bebe!",en:"Drink! (informal)"},usted:{f:"¡Beba!",en:"Drink! (formal)"}},
    present:[{p:"yo",v:"bebo",e:"I drink"},{p:"tú",v:"bebes",e:"you drink"},{p:"él/ella/ud.",v:"bebe",e:"he/she drinks"},{p:"nosotros",v:"bebemos",e:"we drink"},{p:"ellos/uds.",v:"beben",e:"they drink"}],
    past:[{p:"yo",v:"bebí",e:"I drank"},{p:"tú",v:"bebiste",e:"you drank"},{p:"él/ella/ud.",v:"bebió",e:"he/she drank"},{p:"nosotros",v:"bebimos",e:"we drank"},{p:"ellos/uds.",v:"bebieron",e:"they drank"}],
    imperfect:[{p:"yo",v:"bebía",e:"I was drinking / used to drink"},{p:"tú",v:"bebías",e:"you were drinking / used to drink"},{p:"él/ella/ud.",v:"bebía",e:"he/she was drinking / used to drink"},{p:"nosotros",v:"bebíamos",e:"we were drinking / used to drink"},{p:"ellos/uds.",v:"bebían",e:"they were drinking / used to drink"}],
    future:[{p:"yo",v:"beberé",e:"I will drink"},{p:"tú",v:"beberás",e:"you will drink"},{p:"él/ella/ud.",v:"beberá",e:"he/she will drink"},{p:"nosotros",v:"beberemos",e:"we will drink"},{p:"ellos/uds.",v:"beberán",e:"they will drink"}],
    family:[{f:"la bebida",e:"drink / beverage",t:"sustantivo"},{f:"el bebedor",e:"drinker",t:"sustantivo"},{f:"bebible",e:"drinkable",t:"adjetivo"},{f:"la bebida alcohólica",e:"alcoholic drink",t:"sustantivo"}],
    example:{es:"¿Qué bebida quieres?",en:"What drink do you want?"}},
  trabajar:{en:"to work",type:"AR — Regular",icon:"💼",color:"#e8b44a",
    gerund:{f:"trabajando",en:"working"},participle:{f:"trabajado",en:"worked"},
    imperative:{tu:{f:"¡Trabaja!",en:"Work! (informal)"},usted:{f:"¡Trabaje!",en:"Work! (formal)"}},
    present:[{p:"yo",v:"trabajo",e:"I work"},{p:"tú",v:"trabajas",e:"you work"},{p:"él/ella/ud.",v:"trabaja",e:"he/she works"},{p:"nosotros",v:"trabajamos",e:"we work"},{p:"ellos/uds.",v:"trabajan",e:"they work"}],
    past:[{p:"yo",v:"trabajé",e:"I worked"},{p:"tú",v:"trabajaste",e:"you worked"},{p:"él/ella/ud.",v:"trabajó",e:"he/she worked"},{p:"nosotros",v:"trabajamos",e:"we worked"},{p:"ellos/uds.",v:"trabajaron",e:"they worked"}],
    imperfect:[{p:"yo",v:"trabajaba",e:"I was working / used to work"},{p:"tú",v:"trabajabas",e:"you were working / used to work"},{p:"él/ella/ud.",v:"trabajaba",e:"he/she was working / used to work"},{p:"nosotros",v:"trabajábamos",e:"we were working / used to work"},{p:"ellos/uds.",v:"trabajaban",e:"they were working / used to work"}],
    future:[{p:"yo",v:"trabajaré",e:"I will work"},{p:"tú",v:"trabajarás",e:"you will work"},{p:"él/ella/ud.",v:"trabajará",e:"he/she will work"},{p:"nosotros",v:"trabajaremos",e:"we will work"},{p:"ellos/uds.",v:"trabajarán",e:"they will work"}],
    family:[{f:"el trabajo",e:"work / job",t:"sustantivo"},{f:"el/la trabajador/a",e:"worker",t:"sustantivo"},{f:"trabajador/a",e:"hardworking",t:"adjetivo"},{f:"el taller",e:"workshop",t:"sustantivo"}],
    example:{es:"Trabajo en una empresa colombiana.",en:"I work at a Colombian company."}},
  comprar:{en:"to buy",type:"AR — Regular",icon:"🛍️",color:"#ec4899",
    gerund:{f:"comprando",en:"buying"},participle:{f:"comprado",en:"bought"},
    imperative:{tu:{f:"¡Compra!",en:"Buy! (informal)"},usted:{f:"¡Compre!",en:"Buy! (formal)"}},
    present:[{p:"yo",v:"compro",e:"I buy"},{p:"tú",v:"compras",e:"you buy"},{p:"él/ella/ud.",v:"compra",e:"he/she buys"},{p:"nosotros",v:"compramos",e:"we buy"},{p:"ellos/uds.",v:"compran",e:"they buy"}],
    past:[{p:"yo",v:"compré",e:"I bought"},{p:"tú",v:"compraste",e:"you bought"},{p:"él/ella/ud.",v:"compró",e:"he/she bought"},{p:"nosotros",v:"compramos",e:"we bought"},{p:"ellos/uds.",v:"compraron",e:"they bought"}],
    imperfect:[{p:"yo",v:"compraba",e:"I was buying / used to buy"},{p:"tú",v:"comprabas",e:"you were buying / used to buy"},{p:"él/ella/ud.",v:"compraba",e:"he/she was buying / used to buy"},{p:"nosotros",v:"comprábamos",e:"we were buying / used to buy"},{p:"ellos/uds.",v:"compraban",e:"they were buying / used to buy"}],
    future:[{p:"yo",v:"compraré",e:"I will buy"},{p:"tú",v:"comprarás",e:"you will buy"},{p:"él/ella/ud.",v:"comprará",e:"he/she will buy"},{p:"nosotros",v:"compraremos",e:"we will buy"},{p:"ellos/uds.",v:"comprarán",e:"they will buy"}],
    family:[{f:"la compra",e:"purchase / shopping",t:"sustantivo"},{f:"el/la comprador/a",e:"buyer / shopper",t:"sustantivo"},{f:"las compras",e:"shopping (groceries)",t:"sustantivo"},{f:"el supermercado",e:"supermarket",t:"sustantivo"}],
    example:{es:"Fui a comprar en el mercado.",en:"I went to shop at the market."}},
  ir:{en:"to go",type:"Irregular",icon:"🚶",color:"#a78bfa",
    gerund:{f:"yendo",en:"going"},participle:{f:"ido",en:"gone"},
    imperative:{tu:{f:"¡Ve!",en:"Go! (informal)"},usted:{f:"¡Vaya!",en:"Go! (formal)"}},
    present:[{p:"yo",v:"voy",e:"I go"},{p:"tú",v:"vas",e:"you go"},{p:"él/ella/ud.",v:"va",e:"he/she goes"},{p:"nosotros",v:"vamos",e:"we go"},{p:"ellos/uds.",v:"van",e:"they go"}],
    past:[{p:"yo",v:"fui",e:"I went"},{p:"tú",v:"fuiste",e:"you went"},{p:"él/ella/ud.",v:"fue",e:"he/she went"},{p:"nosotros",v:"fuimos",e:"we went"},{p:"ellos/uds.",v:"fueron",e:"they went"}],
    imperfect:[{p:"yo",v:"iba",e:"I was going / used to go"},{p:"tú",v:"ibas",e:"you were going / used to go"},{p:"él/ella/ud.",v:"iba",e:"he/she was going / used to go"},{p:"nosotros",v:"íbamos",e:"we were going / used to go"},{p:"ellos/uds.",v:"iban",e:"they were going / used to go"}],
    future:[{p:"yo",v:"iré",e:"I will go"},{p:"tú",v:"irás",e:"you will go"},{p:"él/ella/ud.",v:"irá",e:"he/she will go"},{p:"nosotros",v:"iremos",e:"we will go"},{p:"ellos/uds.",v:"irán",e:"they will go"}],
    family:[{f:"la ida",e:"going / outward journey",t:"sustantivo"},{f:"la vuelta",e:"return / coming back",t:"sustantivo"},{f:"el viaje",e:"trip / journey",t:"sustantivo"},{f:"vamos a...",e:"let's go to... / going to...",t:"expresión"}],
    example:{es:"¿A dónde vas mañana?",en:"Where are you going tomorrow?"}},
  ser:{en:"to be (permanent)",type:"Irregular",icon:"⭐",color:"#a78bfa",
    gerund:{f:"siendo",en:"being"},participle:{f:"sido",en:"been"},
    imperative:{tu:{f:"¡Sé!",en:"Be! (informal)"},usted:{f:"¡Sea!",en:"Be! (formal)"}},
    present:[{p:"yo",v:"soy",e:"I am"},{p:"tú",v:"eres",e:"you are"},{p:"él/ella/ud.",v:"es",e:"he/she is"},{p:"nosotros",v:"somos",e:"we are"},{p:"ellos/uds.",v:"son",e:"they are"}],
    past:[{p:"yo",v:"fui",e:"I was"},{p:"tú",v:"fuiste",e:"you were"},{p:"él/ella/ud.",v:"fue",e:"he/she was"},{p:"nosotros",v:"fuimos",e:"we were"},{p:"ellos/uds.",v:"fueron",e:"they were"}],
    imperfect:[{p:"yo",v:"era",e:"I was / used to be"},{p:"tú",v:"eras",e:"you were / used to be"},{p:"él/ella/ud.",v:"era",e:"he/she was / used to be"},{p:"nosotros",v:"éramos",e:"we were / used to be"},{p:"ellos/uds.",v:"eran",e:"they were / used to be"}],
    future:[{p:"yo",v:"seré",e:"I will be"},{p:"tú",v:"serás",e:"you will be"},{p:"él/ella/ud.",v:"será",e:"he/she will be"},{p:"nosotros",v:"seremos",e:"we will be"},{p:"ellos/uds.",v:"serán",e:"they will be"}],
    family:[{f:"el ser",e:"being / creature",t:"sustantivo"},{f:"la persona",e:"person",t:"sustantivo"},{f:"la identidad",e:"identity",t:"sustantivo"},{f:"propio/a",e:"own / one's own",t:"adjetivo"}],
    example:{es:"Soy colombiano. ¿Y tú?",en:"I'm Colombian. And you?"}},
  estar:{en:"to be (temporary/location)",type:"Irregular",icon:"📍",color:"#60a5fa",
    gerund:{f:"estando",en:"being"},participle:{f:"estado",en:"been"},
    imperative:{tu:{f:"¡Estate!",en:"Stay! (informal)"},usted:{f:"¡Esté!",en:"Be! (formal)"}},
    present:[{p:"yo",v:"estoy",e:"I am"},{p:"tú",v:"estás",e:"you are"},{p:"él/ella/ud.",v:"está",e:"he/she is"},{p:"nosotros",v:"estamos",e:"we are"},{p:"ellos/uds.",v:"están",e:"they are"}],
    past:[{p:"yo",v:"estuve",e:"I was"},{p:"tú",v:"estuviste",e:"you were"},{p:"él/ella/ud.",v:"estuvo",e:"he/she was"},{p:"nosotros",v:"estuvimos",e:"we were"},{p:"ellos/uds.",v:"estuvieron",e:"they were"}],
    imperfect:[{p:"yo",v:"estaba",e:"I was / used to be"},{p:"tú",v:"estabas",e:"you were / used to be"},{p:"él/ella/ud.",v:"estaba",e:"he/she was / used to be"},{p:"nosotros",v:"estábamos",e:"we were / used to be"},{p:"ellos/uds.",v:"estaban",e:"they were / used to be"}],
    future:[{p:"yo",v:"estaré",e:"I will be"},{p:"tú",v:"estarás",e:"you will be"},{p:"él/ella/ud.",v:"estará",e:"he/she will be"},{p:"nosotros",v:"estaremos",e:"we will be"},{p:"ellos/uds.",v:"estarán",e:"they will be"}],
    family:[{f:"el estado",e:"state / condition",t:"sustantivo"},{f:"la estancia",e:"stay / ranch",t:"sustantivo"},{f:"estable",e:"stable",t:"adjetivo"},{f:"bien/mal",e:"well/bad (used with estar)",t:"adjetivo"}],
    example:{es:"¿Cómo estás? Estoy bien.",en:"How are you? I'm fine."}},
  tener:{en:"to have",type:"Irregular",icon:"✋",color:"#f59e0b",
    gerund:{f:"teniendo",en:"having"},participle:{f:"tenido",en:"had"},
    imperative:{tu:{f:"¡Ten!",en:"Have/Take! (informal)"},usted:{f:"¡Tenga!",en:"Have/Take! (formal)"}},
    present:[{p:"yo",v:"tengo",e:"I have"},{p:"tú",v:"tienes",e:"you have"},{p:"él/ella/ud.",v:"tiene",e:"he/she has"},{p:"nosotros",v:"tenemos",e:"we have"},{p:"ellos/uds.",v:"tienen",e:"they have"}],
    past:[{p:"yo",v:"tuve",e:"I had"},{p:"tú",v:"tuviste",e:"you had"},{p:"él/ella/ud.",v:"tuvo",e:"he/she had"},{p:"nosotros",v:"tuvimos",e:"we had"},{p:"ellos/uds.",v:"tuvieron",e:"they had"}],
    imperfect:[{p:"yo",v:"tenía",e:"I had / used to have"},{p:"tú",v:"tenías",e:"you had / used to have"},{p:"él/ella/ud.",v:"tenía",e:"he/she had / used to have"},{p:"nosotros",v:"teníamos",e:"we had / used to have"},{p:"ellos/uds.",v:"tenían",e:"they had / used to have"}],
    future:[{p:"yo",v:"tendré",e:"I will have"},{p:"tú",v:"tendrás",e:"you will have"},{p:"él/ella/ud.",v:"tendrá",e:"he/she will have"},{p:"nosotros",v:"tendremos",e:"we will have"},{p:"ellos/uds.",v:"tendrán",e:"they will have"}],
    family:[{f:"el tenedor",e:"fork",t:"sustantivo"},{f:"la tenencia",e:"possession / holding",t:"sustantivo"},{f:"el/la dueño/a",e:"owner",t:"sustantivo"},{f:"tener que",e:"to have to (must)",t:"expresión"}],
    example:{es:"Tengo treinta años. ¿Cuántos años tienes tú?",en:"I'm thirty years old. How old are you?"}},
  hacer:{en:"to do / to make",type:"Irregular",icon:"🛠️",color:"#34d399",
    gerund:{f:"haciendo",en:"doing/making"},participle:{f:"hecho",en:"done/made"},
    imperative:{tu:{f:"¡Haz!",en:"Do/Make! (informal)"},usted:{f:"¡Haga!",en:"Do/Make! (formal)"}},
    present:[{p:"yo",v:"hago",e:"I do/make"},{p:"tú",v:"haces",e:"you do/make"},{p:"él/ella/ud.",v:"hace",e:"he/she does/makes"},{p:"nosotros",v:"hacemos",e:"we do/make"},{p:"ellos/uds.",v:"hacen",e:"they do/make"}],
    past:[{p:"yo",v:"hice",e:"I did/made"},{p:"tú",v:"hiciste",e:"you did/made"},{p:"él/ella/ud.",v:"hizo",e:"he/she did/made"},{p:"nosotros",v:"hicimos",e:"we did/made"},{p:"ellos/uds.",v:"hicieron",e:"they did/made"}],
    imperfect:[{p:"yo",v:"hacía",e:"I was doing / used to do"},{p:"tú",v:"hacías",e:"you were doing / used to do"},{p:"él/ella/ud.",v:"hacía",e:"he/she was doing / used to do"},{p:"nosotros",v:"hacíamos",e:"we were doing / used to do"},{p:"ellos/uds.",v:"hacían",e:"they were doing / used to do"}],
    future:[{p:"yo",v:"haré",e:"I will do/make"},{p:"tú",v:"harás",e:"you will do/make"},{p:"él/ella/ud.",v:"hará",e:"he/she will do/make"},{p:"nosotros",v:"haremos",e:"we will do/make"},{p:"ellos/uds.",v:"harán",e:"they will do/make"}],
    family:[{f:"el hecho",e:"fact / deed (done!)",t:"sustantivo"},{f:"la hazaña",e:"feat / achievement",t:"sustantivo"},{f:"hacedero/a",e:"doable / feasible",t:"adjetivo"},{f:"hacer una vuelta",e:"to run an errand (Colombian!)",t:"expresión"}],
    example:{es:"¿Qué haces hoy?",en:"What are you doing today?"}},
  poder:{en:"can / to be able to",type:"Irregular (stem-change)",icon:"💪",color:"#ef4444",
    gerund:{f:"pudiendo",en:"being able to"},participle:{f:"podido",en:"been able to"},
    imperative:{tu:{f:"¡Puede!",en:"You can! (rare as command)"},usted:{f:"—",en:"Rarely used as imperative"}},
    present:[{p:"yo",v:"puedo",e:"I can"},{p:"tú",v:"puedes",e:"you can"},{p:"él/ella/ud.",v:"puede",e:"he/she can"},{p:"nosotros",v:"podemos",e:"we can"},{p:"ellos/uds.",v:"pueden",e:"they can"}],
    past:[{p:"yo",v:"pude",e:"I could"},{p:"tú",v:"pudiste",e:"you could"},{p:"él/ella/ud.",v:"pudo",e:"he/she could"},{p:"nosotros",v:"pudimos",e:"we could"},{p:"ellos/uds.",v:"pudieron",e:"they could"}],
    imperfect:[{p:"yo",v:"podía",e:"I could / was able to"},{p:"tú",v:"podías",e:"you could / were able to"},{p:"él/ella/ud.",v:"podía",e:"he/she could / was able to"},{p:"nosotros",v:"podíamos",e:"we could / were able to"},{p:"ellos/uds.",v:"podían",e:"they could / were able to"}],
    future:[{p:"yo",v:"podré",e:"I will be able to"},{p:"tú",v:"podrás",e:"you will be able to"},{p:"él/ella/ud.",v:"podrá",e:"he/she will be able to"},{p:"nosotros",v:"podremos",e:"we will be able to"},{p:"ellos/uds.",v:"podrán",e:"they will be able to"}],
    family:[{f:"el poder",e:"power",t:"sustantivo"},{f:"poderoso/a",e:"powerful",t:"adjetivo"},{f:"posible",e:"possible",t:"adjetivo"},{f:"¿Puede ayudarme?",e:"Can you help me?",t:"expresión"}],
    example:{es:"¿Puede repetir, por favor?",en:"Can you repeat, please?"}},
  querer:{en:"to want / to love",type:"Irregular (stem-change)",icon:"❤️",color:"#e85d75",
    gerund:{f:"queriendo",en:"wanting/loving"},participle:{f:"querido",en:"wanted/loved"},
    imperative:{tu:{f:"¡Quiere!",en:"Want/Love! (informal)"},usted:{f:"¡Quiera!",en:"Please want (formal, rare)"}},
    present:[{p:"yo",v:"quiero",e:"I want/love"},{p:"tú",v:"quieres",e:"you want/love"},{p:"él/ella/ud.",v:"quiere",e:"he/she wants/loves"},{p:"nosotros",v:"queremos",e:"we want/love"},{p:"ellos/uds.",v:"quieren",e:"they want/love"}],
    past:[{p:"yo",v:"quise",e:"I wanted/loved"},{p:"tú",v:"quisiste",e:"you wanted"},{p:"él/ella/ud.",v:"quiso",e:"he/she wanted"},{p:"nosotros",v:"quisimos",e:"we wanted"},{p:"ellos/uds.",v:"quisieron",e:"they wanted"}],
    imperfect:[{p:"yo",v:"quería",e:"I wanted / used to want"},{p:"tú",v:"querías",e:"you wanted / used to want"},{p:"él/ella/ud.",v:"quería",e:"he/she wanted / used to want"},{p:"nosotros",v:"queríamos",e:"we wanted / used to want"},{p:"ellos/uds.",v:"querían",e:"they wanted / used to want"}],
    future:[{p:"yo",v:"querré",e:"I will want"},{p:"tú",v:"querrás",e:"you will want"},{p:"él/ella/ud.",v:"querrá",e:"he/she will want"},{p:"nosotros",v:"querremos",e:"we will want"},{p:"ellos/uds.",v:"querrán",e:"they will want"}],
    family:[{f:"el/la querido/a",e:"dear / darling",t:"sustantivo/adjetivo"},{f:"el querer",e:"love / affection",t:"sustantivo"},{f:"querido/a",e:"dear / beloved",t:"adjetivo"},{f:"querer decir",e:"to mean (to want to say)",t:"expresión"}],
    example:{es:"Te quiero mucho. ¿Qué quieres comer?",en:"I love you a lot. What do you want to eat?"}},
  dormir:{en:"to sleep",type:"IR — Irregular (stem-change)",icon:"😴",color:"#8b5cf6",
    gerund:{f:"durmiendo",en:"sleeping"},participle:{f:"dormido",en:"slept/asleep"},
    imperative:{tu:{f:"¡Duerme!",en:"Sleep! (informal)"},usted:{f:"¡Duerma!",en:"Sleep! (formal)"}},
    present:[{p:"yo",v:"duermo",e:"I sleep"},{p:"tú",v:"duermes",e:"you sleep"},{p:"él/ella/ud.",v:"duerme",e:"he/she sleeps"},{p:"nosotros",v:"dormimos",e:"we sleep"},{p:"ellos/uds.",v:"duermen",e:"they sleep"}],
    past:[{p:"yo",v:"dormí",e:"I slept"},{p:"tú",v:"dormiste",e:"you slept"},{p:"él/ella/ud.",v:"durmió",e:"he/she slept"},{p:"nosotros",v:"dormimos",e:"we slept"},{p:"ellos/uds.",v:"durmieron",e:"they slept"}],
    imperfect:[{p:"yo",v:"dormía",e:"I was sleeping / used to sleep"},{p:"tú",v:"dormías",e:"you were sleeping / used to sleep"},{p:"él/ella/ud.",v:"dormía",e:"he/she was sleeping / used to sleep"},{p:"nosotros",v:"dormíamos",e:"we were sleeping / used to sleep"},{p:"ellos/uds.",v:"dormían",e:"they were sleeping / used to sleep"}],
    future:[{p:"yo",v:"dormiré",e:"I will sleep"},{p:"tú",v:"dormirás",e:"you will sleep"},{p:"él/ella/ud.",v:"dormirá",e:"he/she will sleep"},{p:"nosotros",v:"dormiremos",e:"we will sleep"},{p:"ellos/uds.",v:"dormirán",e:"they will sleep"}],
    family:[{f:"el sueño",e:"sleep / dream",t:"sustantivo"},{f:"el dormitorio",e:"bedroom",t:"sustantivo"},{f:"dormido/a",e:"asleep",t:"adjetivo"},{f:"la siesta",e:"nap / siesta",t:"sustantivo"}],
    example:{es:"Dormí ocho horas anoche.",en:"I slept eight hours last night."}},
  escribir:{en:"to write",type:"IR — Regular",icon:"✍️",color:"#06b6d4",
    gerund:{f:"escribiendo",en:"writing"},participle:{f:"escrito",en:"written (irregular!)"},
    imperative:{tu:{f:"¡Escribe!",en:"Write! (informal)"},usted:{f:"¡Escriba!",en:"Write! (formal)"}},
    present:[{p:"yo",v:"escribo",e:"I write"},{p:"tú",v:"escribes",e:"you write"},{p:"él/ella/ud.",v:"escribe",e:"he/she writes"},{p:"nosotros",v:"escribimos",e:"we write"},{p:"ellos/uds.",v:"escriben",e:"they write"}],
    past:[{p:"yo",v:"escribí",e:"I wrote"},{p:"tú",v:"escribiste",e:"you wrote"},{p:"él/ella/ud.",v:"escribió",e:"he/she wrote"},{p:"nosotros",v:"escribimos",e:"we wrote"},{p:"ellos/uds.",v:"escribieron",e:"they wrote"}],
    imperfect:[{p:"yo",v:"escribía",e:"I was writing / used to write"},{p:"tú",v:"escribías",e:"you were writing / used to write"},{p:"él/ella/ud.",v:"escribía",e:"he/she was writing / used to write"},{p:"nosotros",v:"escribíamos",e:"we were writing / used to write"},{p:"ellos/uds.",v:"escribían",e:"they were writing / used to write"}],
    future:[{p:"yo",v:"escribiré",e:"I will write"},{p:"tú",v:"escribirás",e:"you will write"},{p:"él/ella/ud.",v:"escribirá",e:"he/she will write"},{p:"nosotros",v:"escribiremos",e:"we will write"},{p:"ellos/uds.",v:"escribirán",e:"they will write"}],
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
  {id:"acciones",label:"🏃 Acciones diarias",type:"basic",items:[
    {word:"Poner",en:"To put / place",ph:"poh-NEHR",tts:"poner",icon:"📍",color:"#4aa8a0"},
    {word:"Quitar",en:"To remove / take off",ph:"kee-TAR",tts:"quitar",icon:"🧥",color:"#e85d75"},
    {word:"Llevar",en:"To take / carry / wear",ph:"yeh-BAR",tts:"llevar",icon:"👜",color:"#60a5fa"},
    {word:"Traer",en:"To bring",ph:"trah-ER",tts:"traer",icon:"📦",color:"#f59e0b"},
    {word:"Dejar",en:"To leave / let",ph:"deh-HAR",tts:"dejar",icon:"🫳",color:"#a78bfa"},
    {word:"Sacar",en:"To take out",ph:"sah-KAR",tts:"sacar",icon:"🗑️",color:"#34d399"},
    {word:"Meter",en:"To put in",ph:"meh-TEHR",tts:"meter",icon:"📥",color:"#8b5cf6"},
    {word:"Buscar",en:"To look for",ph:"boos-KAR",tts:"buscar",icon:"🔎",color:"#e8b44a"},
    {word:"Encontrar",en:"To find",ph:"en-kon-TRAR",tts:"encontrar",icon:"✅",color:"#34d399"},
    {word:"Esperar",en:"To wait / hope",ph:"ehs-peh-RAR",tts:"esperar",icon:"⏳",color:"#60a5fa"},
    {word:"Ayudar",en:"To help",ph:"ah-yoo-DAR",tts:"ayudar",icon:"🤝",color:"#4aa8a0"},
    {word:"Necesitar",en:"To need",ph:"neh-seh-see-TAR",tts:"necesitar",icon:"❗",color:"#e85d75"},
    {word:"Quedar",en:"To be located / remain",ph:"keh-DAR",tts:"quedar",icon:"📌",color:"#a78bfa"},
    {word:"Volver",en:"To return",ph:"bol-BEHR",tts:"volver",icon:"↩️",color:"#f59e0b"},
    {word:"Seguir",en:"To continue / follow",ph:"seh-GEER",tts:"seguir",icon:"➡️",color:"#60a5fa"},
    {word:"Usar",en:"To use",ph:"oo-SAR",tts:"usar",icon:"🛠️",color:"#34d399"}
  ]},
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

/* ── Vocabulary examples ─────────────────────────────────────────────────────
   One example per basic vocabulary item, in the same order as its category. */
const VOCAB_EXAMPLES={
  meses:[
    ["En enero hace frío en Bogotá.","In January it is cold in Bogotá."],["En febrero practico español.","In February I practice Spanish."],["En marzo tengo una reunión.","In March I have a meeting."],["En abril viajo a Medellín.","In April I travel to Medellín."],["En mayo visito a mi mamá.","In May I visit my mom."],["En junio celebro mi cumpleaños.","In June I celebrate my birthday."],["En julio quiero descansar.","In July I want to rest."],["En agosto voy a trabajar.","In August I am going to work."],["En septiembre empieza mi curso.","My course starts in September."],["En octubre llueve mucho.","It rains a lot in October."],["En noviembre compro regalos.","In November I buy gifts."],["En diciembre paso tiempo con mi familia.","In December I spend time with my family."]
  ],
  colores:[
    ["La bandera tiene una franja roja.","The flag has a red stripe."],["El cielo está azul esta mañana.","The sky is blue this morning."],["La camisa verde combina con mis zapatos.","The green shirt matches my shoes."],["El taxi amarillo está esperando.","The yellow taxi is waiting."],["Compré una naranja grande.","I bought a large orange."],["El vestido rosado es bonito.","The pink dress is pretty."],["Mi mochila morada está aquí.","My purple backpack is here."],["La camisa blanca está limpia.","The white shirt is clean."],["El gato negro duerme.","The black cat is sleeping."],["La mesa café está en la cocina.","The brown table is in the kitchen."],["El cielo está gris hoy.","The sky is gray today."]
  ],
  dias:[
    ["El lunes trabajo en la oficina.","On Monday I work in the office."],["El martes estudio español.","On Tuesday I study Spanish."],["El miércoles tengo una cita.","On Wednesday I have an appointment."],["El jueves cocino en casa.","On Thursday I cook at home."],["El viernes salgo temprano.","On Friday I leave early."],["El sábado descanso.","On Saturday I rest."],["El domingo visito a mi familia.","On Sunday I visit my family."]
  ],
  familia:[
    ["Mi mamá vive en Colombia.","My mom lives in Colombia."],["Mi papá trabaja en una empresa.","My dad works at a company."],["Mi hermano estudia español.","My brother studies Spanish."],["Mi hermana vive cerca.","My sister lives nearby."],["Mi abuelo cuenta historias.","My grandfather tells stories."],["Mi abuela cocina muy bien.","My grandmother cooks very well."],["Mi tío maneja un carro azul.","My uncle drives a blue car."],["Mi tía trabaja en un hospital.","My aunt works at a hospital."],["Mi hijo juega en el parque.","My son plays in the park."],["Mi hija lee una historia.","My daughter reads a story."]
  ],
  cuerpo:[
    ["Tengo dolor de cabeza después de trabajar.","I have a headache after working."],["Mi ojo derecho está rojo.","My right eye is red."],["Me limpié la oreja con cuidado.","I cleaned my ear carefully."],["Tengo la nariz tapada.","My nose is blocked."],["Me lavo la boca después de comer.","I wash my mouth after eating."],["Giro el cuello lentamente.","I turn my neck slowly."],["Llevo la mochila en el hombro.","I carry the backpack on my shoulder."],["Me golpeé el brazo con la puerta.","I hit my arm on the door."],["Dame la mano, por favor.","Give me your hand, please."],["Me corté el dedo al cocinar.","I cut my finger while cooking."],["La pierna derecha me duele.","My right leg hurts."],["Me duele el pie después de caminar.","My foot hurts after walking."],["El corazón late rápido cuando corro.","My heart beats fast when I run."],["Tengo el estómago lleno.","My stomach is full."],["Me duele la espalda por estar sentado.","My back hurts from sitting."]
  ],
  comida:[
    ["Quiero agua, por favor.","I want water, please."],["Tomo café en la mañana.","I drink coffee in the morning."],["¿Me regala un tinto?","Can I have a black coffee?"],["El jugo está delicioso.","The juice is delicious."],["¿Quieres una cerveza?","Do you want a beer?"],["La leche está en la nevera.","The milk is in the refrigerator."],["Como pan con huevo.","I eat bread with egg."],["Me gusta el arroz.","I like rice."],["El pollo está listo.","The chicken is ready."],["No como mucha carne.","I do not eat much meat."],["Me gusta la arepa.","I like arepa."],["El aguacate está maduro.","The avocado is ripe."],["Como fruta todos los días.","I eat fruit every day."],["Quiero un huevo para el desayuno.","I want an egg for breakfast."],["La bandeja paisa es muy completa.","Bandeja paisa is very filling."]
  ],
  lugares:[
    ["Mi casa está cerca.","My house is nearby."],["Voy a la tienda.","I am going to the store."],["Compro fruta en el mercado.","I buy fruit at the market."],["Tengo que ir al banco.","I have to go to the bank."],["El hospital queda lejos.","The hospital is far away."],["Voy a la farmacia.","I am going to the pharmacy."],["Nos vemos en el restaurante.","See you at the restaurant."],["El hotel está aquí.","The hotel is here."],["El aeropuerto queda cerca.","The airport is nearby."],["Cruzo la calle.","I cross the street."],["El parque queda cerca.","The park is nearby."],["¿Dónde está el baño?","Where is the bathroom?"]
  ],
  tiempo:[
    ["Hoy practico español.","Today I practice Spanish."],["Mañana voy a trabajar.","Tomorrow I am going to work."],["Ayer cené en casa.","Yesterday I had dinner at home."],["Ahora estoy ocupado.","I am busy now."],["Llego tarde.","I am arriving late."],["Me levanto temprano.","I get up early."],["Siempre tomo café.","I always drink coffee."],["Nunca tomo cerveza.","I never drink beer."],["A veces cocino.","Sometimes I cook."],["Te llamo después.","I will call you later."],["Antes trabajaba en un banco.","I used to work at a bank."]
  ],
  adjetivos:[
    ["El carro es grande.","The car is big."],["El apartamento es pequeño.","The apartment is small."],["El parque es bonito.","The park is pretty."],["El tráfico es feo hoy.","The traffic is ugly today."],["El hotel es caro.","The hotel is expensive."],["Este restaurante es barato.","This restaurant is cheap."],["El carro es rápido.","The car is fast."],["El servicio es lento.","The service is slow."],["El ejercicio es fácil.","The exercise is easy."],["La pregunta es difícil.","The question is difficult."],["El café está bueno.","The coffee is good."],["El tiempo está malo hoy.","The weather is bad today."],["Mi celular es nuevo.","My cell phone is new."],["Mi carro es viejo.","My car is old."],["El baño está limpio.","The bathroom is clean."],["El plato está sucio.","The plate is dirty."]
  ],
  profesiones:[
    ["Soy estudiante.","I am a student."],["Mi hermana es profesora.","My sister is a teacher."],["Mi hermano es ingeniero.","My brother is an engineer."],["Necesito un médico.","I need a doctor."],["La enfermera trabaja aquí.","The nurse works here."],["El dentista revisa mis dientes.","The dentist checks my teeth."],["Mi abogado me ayuda.","My lawyer helps me."],["El contador revisa las cuentas.","The accountant checks the accounts."],["El arquitecto diseña la casa.","The architect designs the house."],["La diseñadora trabaja en una oficina.","The designer works in an office."],["El conductor maneja el carro.","The driver drives the car."],["El chef prepara la comida.","The chef prepares the food."],["El empresario tiene un negocio.","The business owner has a business."],["El empleado llega temprano.","The employee arrives early."]
  ],
  casa:[
    ["Me ducho por la mañana.","I shower in the morning."],["El inodoro está limpio.","The toilet is clean."],["Lavo mis manos en el lavamanos.","I wash my hands in the sink."],["El jabón está en la ducha.","The soap is in the shower."],["La toalla está aquí.","The towel is here."],["Uso el cepillo de dientes todos los días.","I use the toothbrush every day."],["La cama está en la habitación.","The bed is in the bedroom."],["La almohada es cómoda.","The pillow is comfortable."],["La cobija está sobre la cama.","The blanket is on the bed."],["La sábana está limpia.","The sheet is clean."],["La ropa está en el clóset.","The clothes are in the closet."],["Abro la ventana.","I open the window."],["Cierro la puerta.","I close the door."],["Enciendo la luz.","I turn on the light."],["Mi habitación es pequeña.","My bedroom is small."]
  ],
  direcciones:[
    ["El carro está aquí.","The car is here."],["Voy en moto.","I am going by motorcycle."],["El pasajero espera afuera.","The passenger waits outside."],["Escriba la dirección.","Write down the address."],["Gire a la derecha.","Turn right."],["Gire a la izquierda.","Turn left."],["Siga derecho, por favor.","Go straight, please."],["Gire en la esquina.","Turn at the corner."],["El semáforo está en rojo.","The traffic light is red."],["Nos vemos en la esquina.","See you at the corner."],["El parqueadero está cerca.","The parking lot is nearby."],["Necesito gasolina.","I need gas."],["Hay un trancón.","There is a traffic jam."],["El hotel queda cerca.","The hotel is nearby."],["El hospital queda lejos.","The hospital is far away."]
  ],
  cocina:[
    ["Me gusta cocinar.","I like to cook."],["Voy a cortar las verduras.","I am going to cut the vegetables."],["Voy a mezclar la salsa.","I am going to mix the sauce."],["Quiero probar la sopa.","I want to taste the soup."],["Voy a lavar los platos.","I am going to wash the dishes."],["Voy a hervir el agua.","I am going to boil the water."],["Voy a freír un huevo.","I am going to fry an egg."],["La olla está en la cocina.","The pot is in the kitchen."],["La sartén está caliente.","The pan is hot."],["El cuchillo está en el cajón.","The knife is in the drawer."],["La cuchara está en la mesa.","The spoon is on the table."],["El plato está limpio.","The plate is clean."],["No le pongas mucha sal.","Do not add too much salt."],["Necesito azúcar para el café.","I need sugar for the coffee."]
  ],
  gustos:[
    ["A mí también me gusta la música.","I like music too."],["A mí también me gusta el deporte.","I like sports too."],["Me gusta leer por la noche.","I like to read at night."],["Me gusta viajar a Colombia.","I like to travel to Colombia."],["Me gusta cocinar con mi familia.","I like to cook with my family."],["Me gusta ver películas los viernes.","I like watching movies on Fridays."],["Los domingos me gusta pasar tiempo con mi familia en la finca.","On Sundays I like spending time with my family at the farm."],["A mis hijos les gustan los animales.","My children like animals."],["A mi hermano le gustan los videojuegos.","My brother likes video games."],["A mis amigos les gustan las redes sociales.","My friends like social media."],["Aprender español es divertido.","Learning Spanish is fun."],["Es interesante conocer Colombia.","It is interesting to learn about Colombia."],["El trabajo no es aburrido.","The work is not boring."],["Este ejercicio es fácil.","This exercise is easy."],["La pronunciación es difícil al principio.","Pronunciation is difficult at first."],["El desayuno está delicioso.","Breakfast is delicious."],["Ese programa es horrible.","That show is horrible."]
  ],
  tv:[
    ["Veo televisión por la noche.","I watch television at night."],["La película empieza a las ocho.","The movie starts at eight."],["Esta serie es muy buena.","This series is very good."],["Escucho las noticias.","I listen to the news."],["¿Qué programa quieres ver?","What show do you want to watch?"],["¿Dónde está el control remoto?","Where is the remote control?"],["Estoy sentado en el sofá.","I am sitting on the sofa."],["Necesito descansar.","I need to rest."],["Quiero relajarme.","I want to relax."],["Voy a ver televisión.","I am going to watch television."]
  ],
  ropa:[
    ["Mi camisa es azul.","My shirt is blue."],["Llevo una camiseta blanca.","I am wearing a white T-shirt."],["El pantalón es negro.","The pants are black."],["Mis zapatos están limpios.","My shoes are clean."],["Necesito comprar medias.","I need to buy socks."],["La chaqueta es nueva.","The jacket is new."],["Mi saco es cómodo.","My sweater is comfortable."],["El vestido es bonito.","The dress is pretty."],["La falda es roja.","The skirt is red."],["El sombrero es grande.","The hat is big."],["Necesito mis gafas.","I need my glasses."],["Mi reloj está en la mesa.","My watch is on the table."]
  ],
  animales:[
    ["Tengo un perro.","I have a dog."],["Mi gato duerme.","My cat sleeps."],["El pájaro canta.","The bird sings."],["Vi un pez.","I saw a fish."],["El caballo corre.","The horse runs."],["La vaca come.","The cow eats."],["La gallina puso un huevo.","The hen laid an egg."],["El cerdo está en la granja.","The pig is on the farm."],["El mono come una banana.","The monkey eats a banana."],["La mariposa es bonita.","The butterfly is pretty."],["Hay una mosca en la cocina.","There is a fly in the kitchen."],["Vi una culebra.","I saw a snake."]
  ],
  clima:[
    ["El clima está bueno hoy.","The weather is good today."],["Hace mucho sol.","It is very sunny."],["La lluvia empieza ahora.","The rain starts now."],["Hay una nube grande.","There is a big cloud."],["El viento está fuerte.","The wind is strong."],["La tormenta llega esta tarde.","The storm arrives this afternoon."],["Cayó un aguacero.","A downpour fell."],["Hoy hace calor.","It is hot today."],["Hoy hace frío.","It is cold today."],["Hace sol en Medellín.","It is sunny in Medellín."],["Está lloviendo.","It is raining."]
  ],
  tecnologia:[
    ["Mi celular está en la mesa.","My cell phone is on the table."],["Necesito el cargador.","I need the charger."],["El computador está encendido.","The computer is on."],["El wifi no funciona.","The Wi-Fi does not work."],["Descargué una aplicación.","I downloaded an app."],["Te mando un mensaje.","I am sending you a message."],["Tengo una llamada.","I have a call."],["Tomé una foto.","I took a photo."],["Mis audífonos están aquí.","My headphones are here."],["La pantalla está rota.","The screen is broken."],["No recuerdo la contraseña.","I do not remember the password."],["La batería está baja.","The battery is low."]
  ],
  emociones:[
    ["Estoy feliz hoy.","I am happy today."],["Estoy triste.","I am sad."],["Estoy cansado.","I am tired."],["Estoy preocupado.","I am worried."],["Estoy emocionado.","I am excited."],["Estoy bravo.","I am angry."],["Estoy nervioso.","I am nervous."],["Estoy tranquilo.","I am calm."],["Estoy aburrido.","I am bored."],["Estoy sorprendido.","I am surprised."],["Estoy enamorado.","I am in love."],["Estoy asustado.","I am scared."]
  ],
  habitacion:[
    ["La cama está en la habitación.","The bed is in the bedroom."],["La almohada es cómoda.","The pillow is comfortable."],["La cobija está sobre la cama.","The blanket is on the bed."],["La sábana está limpia.","The sheet is clean."],["La ropa está en el clóset.","The clothes are in the closet."],["La mesita de noche está junto a la cama.","The nightstand is next to the bed."],["La lámpara está encendida.","The lamp is on."],["Me miro en el espejo.","I look at myself in the mirror."],["Abro la cortina.","I open the curtain."],["El armario está lleno.","The wardrobe is full."]
  ],
  bano:[
    ["El baño está al fondo.","The bathroom is at the back."],["Me ducho por la mañana.","I shower in the morning."],["El inodoro está limpio.","The toilet is clean."],["El lavamanos está aquí.","The sink is here."],["El jabón está junto a la ducha.","The soap is next to the shower."],["La toalla está seca.","The towel is dry."],["Uso el cepillo de dientes.","I use the toothbrush."],["Necesito pasta dental.","I need toothpaste."],["El papel higiénico está en el baño.","The toilet paper is in the bathroom."],["El champú está en la ducha.","The shampoo is in the shower."]
  ],
  trabajo:[
    ["Trabajo en una empresa.","I work at a company."],["Mi jefe está en una reunión.","My boss is in a meeting."],["El cliente llega a las diez.","The client arrives at ten."],["Mi compañero me ayuda.","My coworker helps me."],["Tengo una reunión.","I have a meeting."],["El proyecto empieza hoy.","The project starts today."],["Mi horario cambia mañana.","My schedule changes tomorrow."],["Recibo mi sueldo el viernes.","I receive my salary on Friday."],["Tengo una entrevista.","I have an interview."],["Mi negocio está en el centro.","My business is downtown."]
  ],
  oficina:[
    ["El computador está en el escritorio.","The computer is on the desk."],["Mi escritorio está junto a la ventana.","My desk is next to the window."],["El teclado está limpio.","The keyboard is clean."],["La pantalla está encendida.","The screen is on."],["La impresora no funciona.","The printer does not work."],["Necesito el documento.","I need the document."],["Te mando un correo electrónico.","I am sending you an email."],["Guarda el archivo.","Save the file."],["La silla es cómoda.","The chair is comfortable."]
  ],
  carropartes:[
    ["El motor funciona bien.","The engine works well."],["La llanta está baja.","The tire is low."],["El volante está duro.","The steering wheel is stiff."],["El freno suena.","The brake makes a noise."],["La batería está baja.","The battery is low."],["El parabrisas está limpio.","The windshield is clean."],["Miro el espejo retrovisor.","I look at the rearview mirror."],["La placa está sucia.","The license plate is dirty."],["El equipaje está en el baúl.","The luggage is in the trunk."],["Abro el capó.","I open the hood."],["Cierro la puerta.","I close the door."]
  ],
  acciones:[
    ["Voy a poner la mesa.","I am going to set the table."],["Quítate la chaqueta; hace calor.","Take off your jacket; it is hot."],["Llevo las llaves en el bolsillo.","I carry the keys in my pocket."],["¿Me traes un tinto, por favor?","Will you bring me a black coffee, please?"],["Puedes dejar la mochila aquí.","You can leave the backpack here."],["Voy a sacar la basura.","I am going to take out the trash."],["Mete la ropa en el clóset.","Put the clothes in the closet."],["Estoy buscando mi celular.","I am looking for my cell phone."],["Por fin encontré mis llaves.","I finally found my keys."],["Te espero en la esquina.","I will wait for you on the corner."],["¿Me ayudas con esta caja?","Can you help me with this box?"],["Necesito comprar mercado.","I need to buy groceries."],["El banco queda cerca.","The bank is nearby."],["Voy a volver después del trabajo.","I am going to return after work."],["Sigue derecho hasta la esquina.","Continue straight to the corner."],["Uso el celular para estudiar.","I use my cell phone to study."]
  ]
};

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
  {word:"Juepucha / hijuepucha",en:"Darn! / What the heck!",usage:"A softer euphemism for hijueputa. Still informal; useful to recognize and safer than the stronger form.",example:"¡Juepucha, se me hizo tarde!",tts:"¡Juepucha, se me hizo tarde!"},
  {word:"Hijueputa",en:"Very strong insult / exclamation",usage:"Colombian contraction of hijo de puta. Very strong; understand first and do not use casually.",example:"¡Hijueputa, qué susto!",tts:"¡Hijueputa, qué susto!"},
  {word:"Gonorrea",en:"Very strong insult / intensifier",usage:"Can insult a person or describe something awful. Extremely context-dependent and vulgar; understand first.",example:"¡Qué gonorrea de tráfico!",tts:"¡Qué gonorrea de tráfico!"},
  {word:"Pirobo",en:"Jerk / scumbag",usage:"Strong Colombian insult. Hear it often in arguments, but do not use it casually.",example:"No sea pirobo.",tts:"No sea pirobo."},
  {word:"Malparido/a",en:"Bastard / son of a bitch",usage:"Very strong insult. Understand it, but avoid saying it.",example:"Ese malparido me estafó.",tts:"Ese malparido me estafó."},
  {word:"Carechimba",en:"Asshole / dickhead",usage:"Extremely vulgar Colombian insult. Understand-only.",example:"¡Carechimba!",tts:"¡Carechimba!"},
  {word:"Marica",en:"Dude / idiot (highly context-sensitive)",usage:"Among close friends it can mean dude, but it can also be an offensive slur. Do not use it unless a trusted Colombian friend teaches you the context.",example:"¡Ay, marica, qué susto!",tts:"¡Ay, marica, qué susto!"},
  {word:"Güevón / huevón",en:"Dude / idiot (vulgar)",usage:"Meaning changes with tone and relationship. Hear it often, but understand first; avoid using it with strangers.",example:"No sea güevón.",tts:"No sea güevón."},
  {word:"Puta",en:"Fuck! / Whore (very strong)",usage:"A strong vulgarity whose meaning depends on context. Understand-only for now.",example:"¡Puta, se dañó el carro!",tts:"¡Puta, se dañó el carro!"},
  {word:"No joda / No jodas",en:"No way! / Come on! / Don't mess around!",usage:"Common informal exclamation. Less harsh than the strongest insults, but still not for formal situations.",example:"¡No joda! ¿En serio?",tts:"¡No joda! ¿En serio?"},
  {word:"Qué jartera",en:"What a drag! / What a pain!",usage:"A common Colombian complaint. Mild compared with the strong insults above.",example:"¡Qué jartera tener tanta tarea!",tts:"¡Qué jartera tener tanta tarea!"},
  {word:"Me importa un culo",en:"I don't give a fuck",usage:"Very vulgar way to say you do not care. Understand-only.",example:"Me importa un culo lo que digan.",tts:"Me importa un culo lo que digan."},
];

/* Structured usage labels: the wording remains in the card, while the group
   gives the UI a consistent, scannable signal for when a word is safe to use. */
const REGISTER_PROFILES={
  everyday:{label:"Colombian · everyday",note:"Common in casual Colombian conversation."},
  informal:{label:"Colombian · informal",note:"Natural with friends; avoid in formal situations."},
  danger:{label:"Strong · understand first",note:"Recognize it, but avoid using it until a trusted Colombian explains the context."}
};
const REGISTER_GROUPS={
  informal:["Parcero / Parce","Chimba","Berraco/a","Juepucha / hijuepucha","No joda / No jodas","Qué jartera"],
  danger:["Hijueputa","Gonorrea","Pirobo","Malparido/a","Carechimba","Marica","Güevón / huevón","Puta","Me importa un culo"]
};
COLOMBIANISMOS.forEach(item=>{
  const group=REGISTER_GROUPS.danger.includes(item.word)?"danger":REGISTER_GROUPS.informal.includes(item.word)?"informal":"everyday";
  const profile=REGISTER_PROFILES[group];
  item.registerGroup=item.registerGroup||group;
  item.register=item.register||profile.label;
  item.registerNote=item.registerNote||profile.note;
});

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
  {section:"🧱 Frases para contar historias",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[{es:"Fui a...",en:"I went to..."},{es:"Fui al...",en:"I went to the..."},{es:"Estuve en...",en:"I was / stayed in..."},{es:"Estaba en...",en:"I was in / at... (ongoing)"},{es:"Era...",en:"I was... (identity / description)"},{es:"Iba a...",en:"I was going to..."},{es:"Tenía que...",en:"I had to..."},{es:"Tuve que...",en:"I had to... (specific event)"},{es:"Quería...",en:"I wanted..."},{es:"Necesitaba...",en:"I needed..."},{es:"Podía...",en:"I could / was able to..."},{es:"No podía...",en:"I couldn't..."},{es:"Después...",en:"Afterward..."},{es:"Luego...",en:"Then / afterward..."},{es:"Pero...",en:"But..."},{es:"Porque...",en:"Because..."},{es:"Entonces...",en:"So / then..."}]},
  {section:"🧩 Conectores para sonar natural",cls:"color:var(--teal);background:rgba(74,168,160,0.08);border:1px solid rgba(74,168,160,0.18)",items:[{es:"También...",en:"Also..."},{es:"Ya...",en:"Already / now..."},{es:"Todavía...",en:"Still / yet..."},{es:"La verdad...",en:"The truth is..."},{es:"Pues...",en:"Well / so..."},{es:"O sea...",en:"I mean..."},{es:"De pronto...",en:"Maybe... (Colombian)"},{es:"Por eso...",en:"That's why..."},{es:"Al final...",en:"In the end..."},{es:"En cambio...",en:"On the other hand..."}]},
  {section:"🧱 Patrones para hablar cada día",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[{es:"Tengo que...",en:"I have to..."},{es:"Voy a...",en:"I am going to..."},{es:"Estoy en...",en:"I am in / at..."},{es:"Acabo de...",en:"I just..."},{es:"Me toca...",en:"I have to... / It's my turn..."},{es:"Se me olvidó...",en:"I forgot..."},{es:"Lo necesito.",en:"I need it. (masculine)"},{es:"La necesito.",en:"I need it. (feminine)"},{es:"Lo tengo.",en:"I have it. (masculine)"},{es:"La tengo.",en:"I have it. (feminine)"},{es:"Le dije...",en:"I told him / her..."},{es:"Se lo mando.",en:"I will send it to him / her."},{es:"No lo sé.",en:"I don't know it / that."},{es:"Ya lo hice.",en:"I already did it."},{es:"Todavía no.",en:"Not yet."},{es:"A ver...",en:"Let's see..."},{es:"Es que...",en:"It's just that..."}]},
  {section:"⚠️ Groserías colombianas — entender primero",cls:"color:var(--pink);background:rgba(232,93,117,0.12);border:1px solid rgba(232,93,117,0.3)",items:[{es:"¡Juepucha, se me hizo tarde!",en:"Darn, I'm late! (milder euphemism)",register:"Mild · informal"},{es:"¡No joda!",en:"No way! / Come on! (informal)",register:"Strong · informal"},{es:"¡Qué gonorrea de tráfico!",en:"What horrible traffic! (very strong)",register:"Very strong · understand first"},{es:"Ese man es un pirobo.",en:"That guy is a jerk. (strong)",register:"Strong insult"},{es:"No sea güevón.",en:"Don't be an idiot. (vulgar)",register:"Vulgar · strong"},{es:"¡Puta, se dañó el carro!",en:"Fuck, the car broke down. (very strong)",register:"Very strong · understand first"},{es:"Me importa un culo.",en:"I don't give a fuck. (very vulgar)",register:"Very vulgar · understand first"},{es:"¡Qué chimba!",en:"That's awesome! (vulgar/informal)",register:"Vulgar · close friends"},{es:"¡Ay, marica, qué susto!",en:"Dude, what a scare! (context-sensitive)",register:"Context-sensitive"},{es:"¡Qué jartera!",en:"What a drag! (milder)",register:"Mild · informal"},{es:"¡Hijueputa, qué susto!",en:"Holy shit, what a scare! (very strong)",register:"Very strong · understand first"}]},
  /* ── NEW v13: Haciendo Planes ── */
  {section:"📆 Haciendo Planes",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[{es:"¿Qué vas a hacer mañana?",en:"What are you going to do tomorrow?"},{es:"¿Nos vemos mañana?",en:"Shall we meet tomorrow?"},{es:"¿A qué hora nos vemos?",en:"What time shall we meet?"},{es:"¿Quieres salir?",en:"Do you want to go out?"},{es:"¡Claro que sí!",en:"Of course!"},{es:"No puedo, tengo planes.",en:"I can't, I have plans."},{es:"¿Qué tal el sábado?",en:"How about Saturday?"},{es:"De pronto voy.",en:"Maybe I'll go. (Colombian: de pronto = maybe)"},{es:"Nos vemos a las siete.",en:"See you at seven."},{es:"¡De una!",en:"I'm in! / Right away! (Colombian!)"},{es:"Te aviso.",en:"I'll let you know."},{es:"¿Dónde nos encontramos?",en:"Where shall we meet?"}]},
  /* ── NEW v13: Por Teléfono / Mensajes ── */
  {section:"📱 Por Teléfono / Mensajes",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[{es:"¿Aló?",en:"Hello? (answering the phone — Colombian!)"},{es:"¿Con quién hablo?",en:"Who am I speaking with?"},{es:"¿Me escuchas?",en:"Can you hear me?"},{es:"Te llamo más tarde.",en:"I'll call you later."},{es:"Se cortó la llamada.",en:"The call dropped."},{es:"Te escribo.",en:"I'll text you."},{es:"Mándame la ubicación.",en:"Send me the location."},{es:"¿Me pasas tu número?",en:"Can you give me your number?"},{es:"Estoy sin señal.",en:"I have no signal."},{es:"No tengo minutos.",en:"I don't have phone minutes. (very Colombian)"},{es:"Voy a llamar.",en:"I'm going to call."},{es:"Deja el mensaje.",en:"Leave the message."}]},
  /* ── NEW v13: ¿Cómo Te Sientes? ── */
  {section:"🩺 ¿Cómo Te Sientes?",cls:"color:var(--green);background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2)",items:[{es:"¿Cómo te sientes?",en:"How do you feel?"},{es:"Me siento bien.",en:"I feel good."},{es:"Me siento mal.",en:"I feel bad."},{es:"Tengo hambre.",en:"I'm hungry."},{es:"Tengo sed.",en:"I'm thirsty."},{es:"Tengo sueño.",en:"I'm sleepy."},{es:"Tengo frío.",en:"I'm cold."},{es:"Tengo calor.",en:"I'm hot."},{es:"Me duele la cabeza.",en:"My head hurts."},{es:"Me duele el estómago.",en:"My stomach hurts."},{es:"Estoy cansado/a.",en:"I'm tired."},{es:"Estoy enfermo/a.",en:"I'm sick."},{es:"Necesito descansar.",en:"I need to rest."},{es:"¡Que te mejores!",en:"Get well soon!"}]},
  /* ── NEW v13: Plata y Pagos ── */
  {section:"💰 Plata y Pagos",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[{es:"¿Cuánto le debo?",en:"How much do I owe you?"},{es:"¿Tiene cambio de cincuenta mil?",en:"Do you have change for fifty thousand?"},{es:"¿Puedo pagar con tarjeta?",en:"Can I pay by card?"},{es:"Pago en efectivo.",en:"I'll pay in cash."},{es:"¿Me hace la transferencia?",en:"Can you send me the transfer? (Nequi-style)"},{es:"Quedamos a mano.",en:"We're even."},{es:"¿Me rebaja algo?",en:"Can you lower the price a bit?"},{es:"Necesito sacar plata.",en:"I need to withdraw money. (Colombian!)"},{es:"¿Dónde hay un cajero?",en:"Where is there an ATM?"},{es:"A la orden.",en:"At your service / You're welcome. (Colombian!)"}]},
  {section:"👤 Pronombres en acción",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[{es:"¿Me lo puede repetir, por favor?",en:"Can you repeat it for me, please?"},{es:"Sí, se lo repito despacio.",en:"Yes, I'll repeat it slowly."},{es:"¿La dirección la tiene?",en:"Do you have the address?"},{es:"Sí, la tengo aquí.",en:"Yes, I have it here."},{es:"¿Le puedo ayudar?",en:"Can I help you?"},{es:"Sí, necesito ayuda.",en:"Yes, I need help."},{es:"¿Me la puede mandar?",en:"Can you send it to me?"},{es:"Se la mando en un momento.",en:"I'll send it to you in a moment."}]},
];
/* v36: high-value language for keeping a real conversation moving.  The
   quizCat field lets the quiz keep these practical topics separate while the
   existing Frases menu still treats them like normal phrase collections. */
FRASES.push(
  {section:"🧰 Comunicación para aclarar",quizCat:"reparar",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[
    {es:"No entendí.",en:"I didn't understand."},{es:"¿Puede repetir?",en:"Can you repeat?"},{es:"Más despacio, por favor.",en:"More slowly, please."},{es:"¿Qué quiere decir?",en:"What does that mean?"},{es:"¿Cómo se dice ___?",en:"How do you say ___?"},{es:"¿Me puede mostrar?",en:"Can you show me?"},{es:"Un momento.",en:"One moment."},{es:"Déjeme pensar.",en:"Let me think."},{es:"Hablo poquito español.",en:"I speak a little Spanish."},{es:"No estoy seguro/a.",en:"I'm not sure."},{es:"¿Así está bien?",en:"Is it okay like this?"},{es:"¿Me entiende?",en:"Do you understand me?"},{es:"Perdón, estoy aprendiendo español.",en:"Sorry, I'm learning Spanish."}
  ]},
  {section:"🧱 Marcos para construir frases",quizCat:"frases",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[
    {es:"Quiero...",en:"I want..."},{es:"Necesito...",en:"I need..."},{es:"Puedo...",en:"I can..."},{es:"No puedo...",en:"I can't..."},{es:"Me gustaría...",en:"I would like..."},{es:"Hay que...",en:"We have to / One must..."},{es:"No sé cómo...",en:"I don't know how to..."},{es:"Estoy tratando de...",en:"I'm trying to..."},{es:"Depende.",en:"It depends."},{es:"No importa.",en:"It doesn't matter."},{es:"No pasa nada.",en:"It's okay / No problem."},{es:"Me hace falta...",en:"I am missing / I need..."}
  ]},
  {section:"🔗 Conectores y palabras de unión",quizCat:"conectores",cls:"color:var(--teal);background:rgba(74,168,160,0.08);border:1px solid rgba(74,168,160,0.18)",items:[
    {es:"Si...",en:"If..."},{es:"Sí.",en:"Yes."},{es:"Pero...",en:"But..."},{es:"Porque...",en:"Because..."},{es:"¿Por qué?",en:"Why?"},{es:"Entonces...",en:"So / then..."},{es:"Así que...",en:"So / therefore..."},{es:"Aunque...",en:"Although..."},{es:"Todavía no.",en:"Not yet."},{es:"Primero...",en:"First..."},{es:"Cuando...",en:"When..."},{es:"Mientras...",en:"While..."},{es:"Tampoco.",en:"Neither / not either."},{es:"Como...",en:"Since / as..."},{es:"¿Cómo?",en:"How?"},{es:"Que...",en:"That / which..."},{es:"¿Qué?",en:"What?"},{es:"Luego...",en:"Then / afterward..."},{es:"También.",en:"Also."},{es:"Al final.",en:"In the end."}
  ]},
  {section:"🧭 Direcciones y ubicación",quizCat:"direcciones",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[
    {es:"Siga derecho hasta el fondo.",en:"Go straight to the back / end."},{es:"Sigue derecho hasta la esquina.",en:"Go straight to the corner."},{es:"Gire a la derecha.",en:"Turn right."},{es:"Gire a la izquierda.",en:"Turn left."},{es:"Está al frente.",en:"It is in front / across from you."},{es:"Está al lado de...",en:"It is next to..."},{es:"Queda detrás de...",en:"It is behind..."},{es:"Está en la esquina.",en:"It is on the corner."},{es:"La entrada está por allá.",en:"The entrance is over there."},{es:"Es el edificio de allá.",en:"It's that building over there."},{es:"El edificio está al frente.",en:"The building is across the way."},{es:"Más adelante.",en:"Farther ahead."},{es:"Devuélvase un poquito.",en:"Go back a little."},{es:"Suba al segundo piso.",en:"Go up to the second floor."},{es:"Baje las escaleras.",en:"Go down the stairs."},{es:"¿Me puede indicar?",en:"Can you point it out / give me directions?"}
  ]},
  {section:"🚕 Uber y transporte real",quizCat:"uber",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[
    {es:"Buenas, ¿usted es mi conductor?",en:"Hi, are you my driver?"},{es:"Sí, soy yo.",en:"Yes, that's me."},{es:"Voy para este hotel.",en:"I'm going to this hotel."},{es:"No conozco mucho la ciudad.",en:"I don't know the city very well."},{es:"¿Esta dirección está bien?",en:"Is this address correct?"},{es:"¿Me puede dejar aquí?",en:"Can you drop me off here?"},{es:"¿Cuánto falta?",en:"How much longer?"},{es:"¿Hay mucho trancón?",en:"Is there a lot of traffic?"},{es:"Ya llegamos.",en:"We've arrived."},{es:"Muchas gracias, muy amable.",en:"Thank you very much, that's very kind."}
  ]},
  {section:"🇨🇴 Expresiones sociales colombianas",quizCat:"expresiones",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[
    {es:"¿Cómo te ha ido?",en:"How have things been?",register:"Everyday"},{es:"Todo bien.",en:"All good.",register:"Everyday"},{es:"Hágale.",en:"Go ahead / Let's do it.",register:"Colombian · informal"},{es:"Con mucho gusto.",en:"With pleasure / You're welcome.",register:"Everyday"},{es:"No se preocupe.",en:"Don't worry.",register:"Polite"},{es:"Tranquilo/a.",en:"Take it easy / Don't worry.",register:"Everyday"},{es:"¡Qué pena!",en:"Sorry! / What a shame!",register:"Colombian · everyday"},{es:"¡Qué nota!",en:"How cool!",register:"Colombian · informal"},{es:"¡Bacano!",en:"Awesome / cool!",register:"Colombian · informal"},{es:"¡Chévere!",en:"Cool / great!",register:"Everyday"},{es:"Parce.",en:"Buddy / friend.",register:"Colombian · informal"},{es:"Fresco/a.",en:"Relax / no worries.",register:"Colombian · informal"},{es:"De una vez.",en:"Right away / while we're at it.",register:"Everyday"}
  ]}
);
/* v37: more Colombian informal language.  These are deliberately labeled so
   a learner can recognize them without treating every word as safe to say. */
COLOMBIANISMOS.push(
  {word:"Joder",en:"To bother / mess with; damn",usage:"Informal and vulgar. In ¡Deje de joder! it means 'stop bothering me.' Stronger than a neutral complaint; understand the tone first.",example:"¡Deje de joder, estoy trabajando!",tts:"¡Deje de joder, estoy trabajando!",register:"Strong · understand first"},
  {word:"Mierda",en:"Shit",usage:"Common vulgar exclamation or noun. Recognize it, but avoid it in polite or professional situations.",example:"¡Mierda, olvidé las llaves!",tts:"¡Mierda, olvidé las llaves!",register:"Strong · understand first"},
  {word:"Carajo",en:"Damn it / hell",usage:"A strong exclamation. It is milder than the strongest personal insults, but still informal and rude.",example:"¡Carajo, se nos hizo tarde!",tts:"¡Carajo, se nos hizo tarde!",register:"Strong · informal"},
  {word:"Lambón / lambona",en:"Suck-up / brown-noser",usage:"A Colombian insult for someone who flatters people to get an advantage. Informal and insulting.",example:"Ese man es muy lambón con el jefe.",tts:"Ese man es muy lambón con el jefe.",register:"Insult · informal"},
  {word:"Sapo / sapa",en:"Snitch / busybody",usage:"In Colombia, calling someone sapo can mean they meddle or tell on others. Insulting; do not use casually.",example:"No seas sapo, eso es privado.",tts:"No seas sapo, eso es privado.",register:"Insult · informal"},
  {word:"Mamado/a",en:"Fed up / sick and tired",usage:"Very common Colombian informal expression. It describes being fed up, not literal tiredness only. Context matters.",example:"Estoy mamado de esperar.",tts:"Estoy mamado de esperar.",register:"Colombian · informal"},
  {word:"Emberracado/a",en:"Pissed off / furious",usage:"Colombian informal adjective for being very angry. Strong conversational language; understand first.",example:"Estoy emberracado con ese problema.",tts:"Estoy emberracado con ese problema.",register:"Colombian · strong"},
  {word:"Cansón / cansona",en:"Annoying / tiresome",usage:"A milder everyday way to say someone or something is annoying. Still direct, so use with care.",example:"No seas tan cansón.",tts:"No seas tan cansón.",register:"Informal"}
);
FRASES.push(
  {section:"⚠️ Groserías colombianas — más para entender",quizCat:"groserias",cls:"color:var(--pink);background:rgba(232,93,117,0.12);border:1px solid rgba(232,93,117,0.3)",items:[
    {es:"¡Deje de joder!",en:"Stop bothering me! / Stop messing around!",register:"Strong · understand first"},
    {es:"¡No me joda!",en:"Don't mess with me! / No way!",register:"Strong · informal"},
    {es:"¿Qué carajos?",en:"What the hell?",register:"Strong · understand first"},
    {es:"¿Qué putas?",en:"What the hell? / What the fuck?",register:"Very strong · understand first"},
    {es:"¡Mierda, olvidé las llaves!",en:"Shit, I forgot the keys!",register:"Strong · understand first"},
    {es:"¡Carajo, se nos hizo tarde!",en:"Damn it, we're late!",register:"Strong · informal"},
    {es:"Ese man es un lambón.",en:"That guy is a suck-up.",register:"Insult · informal"},
    {es:"No seas sapo.",en:"Don't be a snitch / busybody.",register:"Insult · informal"},
    {es:"Estoy mamado de esperar.",en:"I'm fed up with waiting.",register:"Colombian · informal"},
    {es:"Estoy emberracado con ese problema.",en:"I'm pissed off about that problem.",register:"Colombian · strong"},
    {es:"No seas tan cansón.",en:"Don't be so annoying.",register:"Informal · milder"},
    {es:"¡Qué mierda de día!",en:"What a shitty day!",register:"Strong · understand first"},
    {es:"¡Qué hijueputa susto!",en:"What a fucking scare!",register:"Very strong · understand first"},
    {es:"¡No sea tan güevón!",en:"Don't be such an idiot!",register:"Vulgar · strong"},
    {es:"¡Qué putas está pasando!",en:"What the hell is going on!",register:"Very strong · understand first"}
  ]}
);
/* v38: high-frequency conversation glue. These are the small words and
   sentence frames that help a learner connect ideas instead of speaking in
   isolated textbook fragments. */
FRASES.push({section:"🗣️ Palabras para conversar — everyday glue",quizCat:"conectores",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[
  {es:"De hecho...",en:"In fact...",register:"Everyday"},
  {es:"En realidad...",en:"Actually...",register:"Everyday"},
  {es:"Lo que pasa es que...",en:"The thing is...",register:"Everyday"},
  {es:"El problema es que...",en:"The problem is that...",register:"Everyday"},
  {es:"Ya casi.",en:"Almost / Almost there.",register:"Everyday"},
  {es:"Por ahora.",en:"For now.",register:"Everyday"},
  {es:"Al rato.",en:"Later / In a little while.",register:"Everyday · Colombia"},
  {es:"En cuanto pueda...",en:"As soon as I can...",register:"Everyday"},
  {es:"Aunque sea...",en:"Even if / At least...",register:"Everyday"},
  {es:"Más bien...",en:"Rather / Instead...",register:"Everyday"},
  {es:"Si no...",en:"If not...",register:"Everyday"}
]});
/* v39: high-frequency action chunks. These are more useful for speaking than
   isolated nouns because they give the learner a ready-made sentence frame. */
FRASES.push({section:"⚡ Acciones para hablar cada día",quizCat:"acciones",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[
  {es:"Quiero...",en:"I want to...",register:"Everyday"},
  {es:"Necesito...",en:"I need to...",register:"Everyday"},
  {es:"Puedo...",en:"I can...",register:"Everyday"},
  {es:"No puedo...",en:"I can't...",register:"Everyday"},
  {es:"Tengo que...",en:"I have to...",register:"Everyday"},
  {es:"Me toca...",en:"I have to... / It's my turn...",register:"Everyday · Colombia"},
  {es:"Voy a...",en:"I'm going to...",register:"Everyday"},
  {es:"Acabo de...",en:"I just...",register:"Everyday"},
  {es:"Estoy tratando de...",en:"I'm trying to...",register:"Everyday"},
  {es:"Estoy buscando...",en:"I'm looking for...",register:"Everyday"},
  {es:"Estoy esperando...",en:"I'm waiting for...",register:"Everyday"},
  {es:"Ya llegué.",en:"I already arrived.",register:"Everyday"},
  {es:"Voy llegando.",en:"I'm on my way / almost there.",register:"Everyday · Colombia"},
  {es:"Se me olvidó...",en:"I forgot...",register:"Everyday"},
  {es:"Me hace falta...",en:"I need... / I'm missing...",register:"Everyday"},
  {es:"Me queda...",en:"I have left... / It is left for me...",register:"Everyday"},
  {es:"Voy para...",en:"I'm headed to...",register:"Everyday · Colombia"},
  {es:"Vengo de...",en:"I come from... / I'm coming from...",register:"Everyday"},
  {es:"Llevo...",en:"I bring / carry / have been...",register:"Everyday"},
  {es:"Traigo...",en:"I bring...",register:"Everyday"},
  {es:"Dejo...",en:"I leave / drop off...",register:"Everyday"},
  {es:"Paso por...",en:"I stop by / pass through...",register:"Everyday"},
  {es:"Me quedo...",en:"I stay...",register:"Everyday"},
  {es:"Resulta que...",en:"It turns out that...",register:"Everyday"},
  {es:"Depende de...",en:"It depends on...",register:"Everyday"}
]});
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
  {title:"Contar lo que pasó",tense:"Ahora",lines:[{who:"A",es:"¿Dónde estás?",en:"Where are you?",tts:"¿Dónde estás?"},{who:"B",es:"Estoy en casa y tengo que terminar un proyecto.",en:"I'm at home and I have to finish a project.",tts:"Estoy en casa y tengo que terminar un proyecto."}]},
  {title:"Contar lo que pasó",tense:"Planes",lines:[{who:"A",es:"¿Qué ibas a hacer?",en:"What were you going to do?",tts:"¿Qué ibas a hacer?"},{who:"B",es:"Iba a cocinar, pero tuve que trabajar.",en:"I was going to cook, but I had to work.",tts:"Iba a cocinar, pero tuve que trabajar."}]},
   {title:"Contar lo que pasó",tense:"Ayer",lines:[{who:"A",es:"¿Qué hiciste ayer?",en:"What did you do yesterday?",tts:"¿Qué hiciste ayer?"},{who:"B",es:"Fui al mercado porque necesitaba comida.",en:"I went to the market because I needed food.",tts:"Fui al mercado porque necesitaba comida."},{who:"A",es:"¿Y dónde estabas después?",en:"And where were you afterward?",tts:"¿Y dónde estabas después?"},{who:"B",es:"Estaba en casa; quería descansar.",en:"I was at home; I wanted to rest.",tts:"Estaba en casa; quería descansar."}]},
   {title:"Groserías colombianas",tense:"Ahora",lines:[{who:"A",es:"¿Qué significa «juepucha»?",en:"What does «juepucha» mean?",tts:"¿Qué significa juepucha?"},{who:"B",es:"Es una forma más suave de decir «hijueputa». Úsala con cuidado.",en:"It is a milder way to say «hijueputa». Use it carefully.",tts:"Es una forma más suave de decir hijueputa. Úsala con cuidado."}]},
   {title:"Groserías colombianas",tense:"Planes",lines:[{who:"A",es:"¿Puedo decir «marica» con cualquier persona?",en:"Can I say «marica» with anyone?",tts:"¿Puedo decir marica con cualquier persona?"},{who:"B",es:"No. Depende mucho de la confianza, el tono y la región; mejor entiéndela primero.",en:"No. It depends a lot on trust, tone, and region; understand it first.",tts:"No. Depende mucho de la confianza, el tono y la región; mejor entiéndela primero."}]},
   {title:"Groserías colombianas",tense:"Ayer",lines:[{who:"A",es:"¿Qué escuchaste en la calle?",en:"What did you hear in the street?",tts:"¿Qué escuchaste en la calle?"},{who:"B",es:"Escuché «qué jartera», una queja informal y menos fuerte.",en:"I heard «qué jartera», an informal and milder complaint.",tts:"Escuché qué jartera, una queja informal y menos fuerte."}]},
   {title:"Ver televisión",tense:"Ahora",lines:[{who:"A",es:"¿Qué quieres ver?",en:"What do you want to watch?",tts:"¿Qué quieres ver?"},{who:"B",es:"Una serie. ¿Dónde está el control remoto?",en:"A series. Where is the remote control?",tts:"Una serie. ¿Dónde está el control remoto?"},{who:"A",es:"Está en el sofá.",en:"It's on the sofa.",tts:"Está en el sofá."}]},
  {title:"Ver televisión",tense:"Planes",lines:[{who:"A",es:"¿Qué vas a hacer esta noche?",en:"What are you going to do tonight?",tts:"¿Qué vas a hacer esta noche?"},{who:"B",es:"Voy a ver una película y relajarme.",en:"I'm going to watch a movie and relax.",tts:"Voy a ver una película y relajarme."}]},
  {title:"Ver televisión",tense:"Ayer",lines:[{who:"A",es:"¿Qué viste anoche?",en:"What did you watch last night?",tts:"¿Qué viste anoche?"},{who:"B",es:"Vi las noticias y descansé en el sofá.",en:"I watched the news and rested on the sofa.",tts:"Vi las noticias y descansé en el sofá."}]},
  {title:"En casa",tense:"Ahora",lines:[{who:"A",es:"¿Dónde está el baño?",en:"Where is the bathroom?",tts:"¿Dónde está el baño?"},{who:"B",es:"Está al lado de la habitación.",en:"It is next to the bedroom.",tts:"Está al lado de la habitación."}]},
  {title:"En casa",tense:"Planes",lines:[{who:"A",es:"¿Vas a arreglar la habitación?",en:"Are you going to tidy the bedroom?",tts:"¿Vas a arreglar la habitación?"},{who:"B",es:"Sí, voy a cambiar la sábana y la cobija.",en:"Yes, I'm going to change the sheet and the blanket.",tts:"Sí, voy a cambiar la sábana y la cobija."}]},
  {title:"En casa",tense:"Ayer",lines:[{who:"A",es:"¿Dónde estaba la toalla?",en:"Where was the towel?",tts:"¿Dónde estaba la toalla?"},{who:"B",es:"Ayer la dejé junto al lavamanos.",en:"Yesterday I left it next to the sink.",tts:"Ayer la dejé junto al lavamanos."}]}
  ,{title:"La habitación",tense:"Ahora",lines:[{who:"A",es:"¿Dónde está la sábana?",en:"Where is the sheet?",tts:"¿Dónde está la sábana?"},{who:"B",es:"Está en el clóset, al lado de la cobija.",en:"It is in the closet, next to the blanket.",tts:"Está en el clóset, al lado de la cobija."},{who:"A",es:"También necesito una almohada.",en:"I also need a pillow.",tts:"También necesito una almohada."},{who:"B",es:"Hay una sobre la cama.",en:"There is one on the bed.",tts:"Hay una sobre la cama."}]},
  {title:"La habitación",tense:"Planes",lines:[
    {who:"A",es:"Voy a organizar la habitación mañana.",en:"I'm going to organize the bedroom tomorrow.",tts:"Voy a organizar la habitación mañana."},
    {who:"B",es:"¿Vas a cambiar las sábanas?",en:"Are you going to change the sheets?",tts:"¿Vas a cambiar las sábanas?"},
    {who:"A",es:"Sí, y voy a comprar una almohada nueva.",en:"Yes, and I'm going to buy a new pillow.",tts:"Sí, y voy a comprar una almohada nueva."}]},
  {title:"La habitación",tense:"Ayer",lines:[
    {who:"A",es:"Ayer arreglé la habitación.",en:"Yesterday I tidied up the bedroom.",tts:"Ayer arreglé la habitación."},
    {who:"B",es:"¿Lavaste las cobijas?",en:"Did you wash the blankets?",tts:"¿Lavaste las cobijas?"},
    {who:"A",es:"Sí, y guardé la ropa en el clóset.",en:"Yes, and I put the clothes away in the closet.",tts:"Sí, y guardé la ropa en el clóset."}]},
  {title:"El baño",tense:"Ahora",lines:[{who:"A",es:"Disculpe, ¿dónde está el baño?",en:"Excuse me, where is the bathroom?",tts:"Disculpe, ¿dónde está el baño?"},{who:"B",es:"Está al fondo, a la derecha.",en:"It is at the back, on the right.",tts:"Está al fondo, a la derecha."},{who:"A",es:"¿Hay una toalla limpia?",en:"Is there a clean towel?",tts:"¿Hay una toalla limpia?"},{who:"B",es:"Sí, está junto al lavamanos.",en:"Yes, it is next to the sink.",tts:"Sí, está junto al lavamanos."}]},
  {title:"El baño",tense:"Planes",lines:[
    {who:"A",es:"Voy a tomar una ducha.",en:"I'm going to take a shower.",tts:"Voy a tomar una ducha."},
    {who:"B",es:"Listo, voy a buscar una toalla limpia.",en:"OK, I'm going to get a clean towel.",tts:"Listo, voy a buscar una toalla limpia."},
    {who:"A",es:"¿Vas a comprar champú mañana?",en:"Are you going to buy shampoo tomorrow?",tts:"¿Vas a comprar champú mañana?"},
    {who:"B",es:"Sí, y también jabón.",en:"Yes, and soap too.",tts:"Sí, y también jabón."}]},
  {title:"El baño",tense:"Ayer",lines:[
    {who:"A",es:"Ayer limpié el baño.",en:"Yesterday I cleaned the bathroom.",tts:"Ayer limpié el baño."},
    {who:"B",es:"¡Gracias! ¿Cambiaste la cortina de baño?",en:"Thanks! Did you change the shower curtain?",tts:"¡Gracias! ¿Cambiaste la cortina de baño?"},
    {who:"A",es:"Sí, y lavé el lavamanos.",en:"Yes, and I washed the sink.",tts:"Sí, y lavé el lavamanos."}]},
  {title:"Trabajo y oficina",tense:"Ahora",lines:[{who:"A",es:"¿Tienes una reunión hoy?",en:"Do you have a meeting today?",tts:"¿Tienes una reunión hoy?"},{who:"B",es:"Sí, con un cliente nuevo.",en:"Yes, with a new client.",tts:"Sí, con un cliente nuevo."},{who:"A",es:"¿Vas a enviar el correo?",en:"Are you going to send the email?",tts:"¿Vas a enviar el correo?"},{who:"B",es:"Sí, después de imprimir el documento.",en:"Yes, after printing the document.",tts:"Sí, después de imprimir el documento."}]},
  {title:"Trabajo y oficina",tense:"Planes",lines:[
    {who:"A",es:"Mañana voy a firmar el contrato.",en:"Tomorrow I'm going to sign the contract.",tts:"Mañana voy a firmar el contrato."},
    {who:"B",es:"¡Qué bueno! ¿Vas a hablar con el jefe?",en:"Great! Are you going to talk to the boss?",tts:"¡Qué bueno! ¿Vas a hablar con el jefe?"},
    {who:"A",es:"Sí, vamos a revisar el proyecto en la sala de juntas.",en:"Yes, we're going to review the project in the meeting room.",tts:"Sí, vamos a revisar el proyecto en la sala de juntas."}]},
  {title:"Trabajo y oficina",tense:"Ayer",lines:[
    {who:"A",es:"¿Cómo te fue en la reunión ayer?",en:"How did the meeting go yesterday?",tts:"¿Cómo te fue en la reunión ayer?"},
    {who:"B",es:"Muy bien. El cliente firmó el contrato.",en:"Very well. The client signed the contract.",tts:"Muy bien. El cliente firmó el contrato."},
    {who:"A",es:"¡Felicitaciones! Fue una buena venta.",en:"Congratulations! It was a good sale.",tts:"¡Felicitaciones! Fue una buena venta."}]},
  {title:"Partes del carro",tense:"Ahora",lines:[{who:"A",es:"¿Qué le pasa al carro?",en:"What is wrong with the car?",tts:"¿Qué le pasa al carro?"},{who:"B",es:"La llanta está baja y el freno suena.",en:"The tire is low and the brake makes a noise.",tts:"La llanta está baja y el freno suena."},{who:"A",es:"¿Hay gasolina?",en:"Is there gas?",tts:"¿Hay gasolina?"},{who:"B",es:"Sí, pero hay que revisar la batería.",en:"Yes, but we need to check the battery.",tts:"Sí, pero hay que revisar la batería."}]},
  {title:"Partes del carro",tense:"Planes",lines:[
    {who:"A",es:"Mañana voy a llevar el carro al taller.",en:"Tomorrow I'm going to take the car to the shop.",tts:"Mañana voy a llevar el carro al taller."},
    {who:"B",es:"¿Qué le van a cambiar?",en:"What are they going to change on it?",tts:"¿Qué le van a cambiar?"},
    {who:"A",es:"Van a cambiar la llanta y revisar los frenos.",en:"They're going to change the tire and check the brakes.",tts:"Van a cambiar la llanta y revisar los frenos."}]},
  {title:"Partes del carro",tense:"Ayer",lines:[
    {who:"A",es:"Ayer llevé el carro al taller.",en:"Yesterday I took the car to the shop.",tts:"Ayer llevé el carro al taller."},
    {who:"B",es:"¿Qué le hicieron?",en:"What did they do to it?",tts:"¿Qué le hicieron?"},
    {who:"A",es:"Cambiaron la batería y arreglaron el pito.",en:"They changed the battery and fixed the horn.",tts:"Cambiaron la batería y arreglaron el pito."},
    {who:"B",es:"¡Uy, qué caro!",en:"Wow, so expensive!",tts:"¡Uy, qué caro!"}]},
  {title:"Preparar la cocina",tense:"Ahora",lines:[{who:"A",es:"¿Dónde está el cuchillo?",en:"Where is the knife?",tts:"¿Dónde está el cuchillo?"},{who:"B",es:"Está en el cajón, junto a la cuchara.",en:"It is in the drawer, next to the spoon.",tts:"Está en el cajón, junto a la cuchara."},{who:"A",es:"Voy a cortar las verduras.",en:"I am going to cut the vegetables.",tts:"Voy a cortar las verduras."},{who:"B",es:"Listo, yo caliento la olla.",en:"All right, I will heat the pot.",tts:"Listo, yo caliento la olla."}]},
  {title:"Preparar la cocina",tense:"Planes",lines:[
    {who:"A",es:"¿Qué vamos a cocinar mañana?",en:"What are we going to cook tomorrow?",tts:"¿Qué vamos a cocinar mañana?"},
    {who:"B",es:"Vamos a freír unas arepas.",en:"We're going to fry some arepas.",tts:"Vamos a freír unas arepas."},
    {who:"A",es:"Voy a sacar los huevos de la nevera.",en:"I'm going to get the eggs out of the fridge.",tts:"Voy a sacar los huevos de la nevera."}]},
  {title:"Preparar la cocina",tense:"Ayer",lines:[
    {who:"A",es:"¿Qué cocinaste anoche?",en:"What did you cook last night?",tts:"¿Qué cocinaste anoche?"},
    {who:"B",es:"Hice una sopa. Herví las verduras en la olla.",en:"I made a soup. I boiled the vegetables in the pot.",tts:"Hice una sopa. Herví las verduras en la olla."},
    {who:"A",es:"¿Y probaste la salsa?",en:"And did you taste the sauce?",tts:"¿Y probaste la salsa?"},
    {who:"B",es:"Sí, ¡quedó deliciosa!",en:"Yes, it turned out delicious!",tts:"Sí, ¡quedó deliciosa!"}]},
  {title:"Pronombres en acción",tense:"Ahora",lines:[
    {who:"A",es:"¿Me lo puede repetir, por favor?",en:"Can you repeat it for me, please?",tts:"¿Me lo puede repetir, por favor?"},
    {who:"B",es:"Sí, se lo repito despacio.",en:"Yes, I'll repeat it slowly.",tts:"Sí, se lo repito despacio."},
    {who:"A",es:"¿La dirección la tiene?",en:"Do you have the address?",tts:"¿La dirección la tiene?"},
    {who:"B",es:"Sí, la tengo aquí.",en:"Yes, I have it here.",tts:"Sí, la tengo aquí."}]},
  {title:"Pronombres en acción",tense:"Planes",lines:[
    {who:"A",es:"¿Me lo va a mandar hoy?",en:"Are you going to send it to me today?",tts:"¿Me lo va a mandar hoy?"},
    {who:"B",es:"Sí, se lo voy a mandar en la tarde.",en:"Yes, I'm going to send it to you this afternoon.",tts:"Sí, se lo voy a mandar en la tarde."},
    {who:"A",es:"¿La ubicación la tiene?",en:"Do you have the location?",tts:"¿La ubicación la tiene?"},
    {who:"B",es:"No, pero me la puede enviar.",en:"No, but you can send it to me.",tts:"No, pero me la puede enviar."}]},
  {title:"Pronombres en acción",tense:"Ayer",lines:[
    {who:"A",es:"¿Le explicaste el problema?",en:"Did you explain the problem to him/her?",tts:"¿Le explicaste el problema?"},
    {who:"B",es:"Sí, se lo expliqué al técnico.",en:"Yes, I explained it to the technician.",tts:"Sí, se lo expliqué al técnico."},
    {who:"A",es:"¿La factura la guardaste?",en:"Did you save the invoice?",tts:"¿La factura la guardaste?"},
    {who:"B",es:"Sí, la guardé en el archivo.",en:"Yes, I saved it in the file.",tts:"Sí, la guardé en el archivo."}]}
 ];

/* v36: practical conversations.  The helper keeps every line's TTS field
   consistent while still storing both sides and the English meaning. */
const v36Lines=rows=>rows.map(([who,es,en])=>({who,es,en,tts:es}));
const v36Conversation=(title,en,now,plans,was)=>[
  {title,tense:"Ahora",lines:v36Lines(now)},
  ...(plans?[{title,tense:"Planes",lines:v36Lines(plans)}]:[]),
  ...(was?[{title,tense:"Ayer",lines:v36Lines(was)}]:[])
];
const V36_CONVERSATIONS=[
  ...v36Conversation("Uber: confirmar la recogida","Confirming an Uber pickup",[
    ["A","Buenas, ¿usted es mi conductor?","Hi, are you my driver?"],["B","Sí, soy yo. ¿Usted es Seth?","Yes, that's me. Are you Seth?"],["A","Sí. Estoy al frente del hotel.","Yes. I am in front of the hotel."],["B","Ya lo veo. Estoy en un carro gris.","I see you now. I am in a gray car."],["A","Perfecto. Voy para este hotel.","Perfect. I'm going to this hotel."],["B","Listo, súbase. ¿Tiene el equipaje?","Okay, get in. Do you have your luggage?"],["A","Sí, aquí está. Muchas gracias.","Yes, here it is. Thank you very much."]
  ],[
    ["A","Buenas, mañana tengo un viaje al aeropuerto.","Hi, tomorrow I have a trip to the airport."],["B","Claro, puedo recogerlo a las seis.","Sure, I can pick you up at six."],["A","¿Puede confirmar la dirección?","Can you confirm the address?"],["B","Sí, lo recojo frente al hotel.","Yes, I will pick you up in front of the hotel."],["A","Perfecto, le escribo cuando esté listo.","Perfect, I will message you when I am ready."],["B","De una. Nos vemos mañana.","Sounds good. See you tomorrow."]
  ],[
    ["A","Ayer pedí un Uber desde el hotel.","Yesterday I requested an Uber from the hotel."],["B","¿El conductor encontró la dirección?","Did the driver find the address?"],["A","Sí, lo vi al frente del edificio.","Yes, I saw him in front of the building."],["B","¿Llegó a tiempo?","Did you arrive on time?"],["A","Sí, pero había mucho trancón.","Yes, but there was a lot of traffic."],["B","Bueno, lo importante es que llegó bien.","Well, the important thing is that you arrived safely."]
  ]),
  ...v36Conversation("Uber: hablo poquito español","Explaining limited Spanish to a driver",[
    ["A","Buenas, hablo poquito español.","Hi, I speak a little Spanish."],["B","Tranquilo, ¿para dónde va?","No worries, where are you going?"],["A","Voy para este hotel.","I'm going to this hotel."],["B","¿Quiere que usemos la dirección de la aplicación?","Do you want us to use the address in the app?"],["A","Sí, por favor. ¿Puede hablar más despacio?","Yes, please. Can you speak more slowly?"],["B","Claro. No se preocupe.","Sure. Don't worry."],["A","Gracias por tener paciencia.","Thanks for being patient."]
  ]),
  ...v36Conversation("Uber: pedir que repita","Asking the driver to repeat",[
    ["A","Perdón, no entendí.","Sorry, I didn't understand."],["B","Le pregunté si quiere ir por esta avenida.","I asked if you want to go along this avenue."],["A","¿Me puede repetir, por favor?","Can you repeat that, please?"],["B","¿Quiere ir por esta avenida?","Do you want to go along this avenue?"],["A","Sí, está bien. Más despacio, por favor.","Yes, that's fine. More slowly, please."],["B","Listo, vamos despacio.","Okay, we will go slowly."]
  ]),
  ...v36Conversation("Uber: dirección equivocada","Fixing a wrong pickup or building",[
    ["A","Creo que estamos en el edificio equivocado.","I think we are at the wrong building."],["B","¿La dirección dice número veinte?","Does the address say number twenty?"],["A","Sí, pero la entrada está por allá.","Yes, but the entrance is over there."],["B","¿Es el edificio alto de la esquina?","Is it the tall building on the corner?"],["A","Sí. Devuélvase un poquito, por favor.","Yes. Go back a little, please."],["B","Listo, ya estamos en la entrada.","Okay, we are at the entrance now."],["A","Perfecto. Muchas gracias.","Perfect. Thank you very much."]
  ]),
  ...v36Conversation("Hotel: registrarse","Checking into a hotel",[
    ["A","Buenas, tengo una reserva a nombre de Seth.","Hi, I have a reservation under Seth's name."],["B","Buenas. ¿Me puede mostrar el pasaporte?","Hi. Can you show me your passport?"],["A","Claro, aquí tiene.","Of course, here you go."],["B","Su habitación está en el segundo piso.","Your room is on the second floor."],["A","¿A qué hora es el desayuno?","What time is breakfast?"],["B","De seis a diez, en el primer piso.","From six to ten, on the first floor."],["A","Muchas gracias. ¿Dónde está el ascensor?","Thank you very much. Where is the elevator?"]
  ],[
    ["A","Mañana voy a llegar al hotel a las ocho.","Tomorrow I am going to arrive at the hotel at eight."],["B","Perfecto, vamos a tener su habitación lista.","Perfect, we will have your room ready."],["A","¿Puedo dejar el equipaje antes?","Can I leave my luggage earlier?"],["B","Sí, puede dejarlo en recepción.","Yes, you can leave it at reception."],["A","De una. Nos vemos mañana.","Sounds good. See you tomorrow."],["B","Con mucho gusto.","With pleasure."]
  ],[
    ["A","Ayer llegué al hotel y mostré mi pasaporte.","Yesterday I arrived at the hotel and showed my passport."],["B","¿Le dieron la habitación enseguida?","Did they give you the room right away?"],["A","Sí, pero pregunté por el ascensor.","Yes, but I asked about the elevator."],["B","¿Y dónde estaba el desayuno?","And where was breakfast?"],["A","Estaba en el primer piso.","It was on the first floor."],["B","Qué bien. ¿Descansó?","Great. Did you rest?"]
  ]),
  ...v36Conversation("Restaurante: pedir y cambiar","Ordering and changing a restaurant order",[
    ["A","Buenas, quisiera pedir una sopa y un jugo.","Hi, I would like to order a soup and a juice."],["B","Claro. ¿La sopa con arroz o con papa?","Sure. Soup with rice or potato?"],["A","Con papa, por favor. Sin picante.","With potato, please. Without spice."],["B","¿Y para tomar?","And to drink?"],["A","Un jugo de mango, pero sin azúcar.","A mango juice, but without sugar."],["B","Listo, ya le traigo todo.","Okay, I will bring everything right away."],["A","Perdón, ¿puede cambiar el jugo por agua?","Sorry, can you change the juice for water?"]
  ],null,[
    ["A","Ayer pedí una sopa en un restaurante.","Yesterday I ordered a soup at a restaurant."],["B","¿Te gustó?","Did you like it?"],["A","Sí, pero estaba un poco picante.","Yes, but it was a little spicy."],["B","¿Pediste algo para tomar?","Did you order something to drink?"],["A","Sí, pedí agua y después la cuenta.","Yes, I ordered water and then the bill."],["B","¿Pagaste con tarjeta?","Did you pay by card?"]
  ]),
  ...v36Conversation("Farmacia: explicar síntomas","Explaining symptoms at a pharmacy",[
    ["A","Buenas, necesito algo para el dolor de cabeza.","Hi, I need something for a headache."],["B","¿Desde cuándo le duele?","Since when has it hurt?"],["A","Desde esta mañana.","Since this morning."],["B","¿Tiene fiebre o tos?","Do you have a fever or cough?"],["A","No, pero me siento cansado.","No, but I feel tired."],["B","Le recomiendo estas pastillas.","I recommend these pills."],["A","¿Cómo las debo tomar?","How should I take them?"]
  ]),
  ...v36Conversation("Mercado: comprar comida","Buying food at a Colombian market",[
    ["A","Buenas, ¿cuánto cuestan estas arepas?","Hi, how much do these arepas cost?"],["B","Son cinco mil pesos las dos.","They are five thousand pesos for two."],["A","Me regala dos, por favor.","Can I have two, please?"],["B","Claro. ¿Algo más?","Sure. Anything else?"],["A","Sí, necesito tomates y aguacate.","Yes, I need tomatoes and avocado."],["B","Todo cuesta quince mil.","Everything costs fifteen thousand."],["A","¿Puedo pagar con tarjeta?","Can I pay by card?"]
  ]),
  ...v36Conversation("Teléfono: mala señal","Handling a phone call with a bad signal",[
    ["A","¿Aló? ¿Me escuchas?","Hello? Can you hear me?"],["B","Te escucho, pero la señal está mala.","I can hear you, but the signal is bad."],["A","Se está cortando la llamada.","The call is cutting out."],["B","Te llamo más tarde.","I will call you later."],["A","No, mándame un mensaje mejor.","No, send me a message instead."],["B","Listo. Te escribo en un momento.","Okay. I will text you in a moment."]
  ],null,[
    ["A","Ayer llamé, pero no tenía señal.","Yesterday I called, but I had no signal."],["B","¿Se cortó la llamada?","Did the call drop?"],["A","Sí. Después mandé un mensaje.","Yes. Then I sent a message."],["B","¿Te respondieron?","Did they answer you?"],["A","Sí, me respondieron en la noche.","Yes, they answered me at night."],["B","Qué bueno.","That's good."]
  ]),
  ...v36Conversation("Compañeros de trabajo","Meeting coworkers",[
    ["A","Hola, soy nuevo en el equipo.","Hi, I am new on the team."],["B","Mucho gusto. Yo trabajo con el jefe.","Nice to meet you. I work with the boss."],["A","¿En qué proyecto estás trabajando?","What project are you working on?"],["B","Estoy trabajando en el proyecto de ventas.","I am working on the sales project."],["A","Tengo una reunión a las diez.","I have a meeting at ten."],["B","De una. Después tomamos un tinto.","Sounds good. We can have a coffee afterward."]
  ]),
  ...v36Conversation("Planes de fin de semana","Making weekend plans",[
    ["A","¿Qué vas a hacer este fin de semana?","What are you going to do this weekend?"],["B","Voy a visitar a mi familia.","I am going to visit my family."],["A","¿Nos vemos el sábado?","Shall we meet Saturday?"],["B","De una. ¿A qué hora?","Sure. What time?"],["A","A las tres, para tomar un tinto.","At three, to have a coffee."],["B","Listo. Te aviso el lugar.","Okay. I will let you know the place."]
  ],[
    ["A","El próximo sábado voy a visitar a mi familia.","Next Saturday I am going to visit my family."],["B","Entonces podemos vernos el domingo.","Then we can meet Sunday."],["A","Sí, si tengo tiempo te escribo.","Yes, if I have time I will text you."],["B","Perfecto. ¿Quieres ir a un café?","Perfect. Do you want to go to a café?"],["A","Sí, me gustaría conocer uno nuevo.","Yes, I would like to try a new one."],["B","Hágale. Quedamos así.","Let's do it. It's a plan."]
  ]),
  ...v36Conversation("Problema con apartamento o carro","Reporting a home, car, or reservation problem",[
    ["A","Buenas, la ducha no funciona.","Hi, the shower does not work."],["B","¿Desde cuándo tiene el problema?","Since when have you had the problem?"],["A","Desde ayer. También hay una gotera.","Since yesterday. There is also a leak."],["B","Voy a mandar un técnico esta tarde.","I am going to send a technician this afternoon."],["A","Perfecto. ¿A qué hora viene?","Perfect. What time is he coming?"],["B","Llega entre dos y cuatro.","He will arrive between two and four."],["A","Muchas gracias por la ayuda.","Thank you very much for the help."]
  ],null,[
    ["A","Ayer se dañó el carro en la carretera.","Yesterday the car broke down on the road."],["B","¿Qué parte se dañó?","What part broke?"],["A","La llanta estaba baja y el motor se apagó.","The tire was low and the engine turned off."],["B","¿Llamaste al seguro?","Did you call the insurance company?"],["A","Sí, pero tuve que esperar una hora.","Yes, but I had to wait an hour."],["B","Qué problema. ¿Ya está funcionando?","What a problem. Is it working now?"]
  ])
];
CONVERSATIONS.push(...V36_CONVERSATIONS);
const V38_CONVERSATIONS=[
  ...v36Conversation("Palabras para conversar","Using everyday glue words to keep a conversation moving",[
    ["A","¿Qué vas a hacer después del trabajo?","What are you going to do after work?"],
    ["B","Todavía no sé. De pronto voy a pasar por el mercado.","I don't know yet. Maybe I am going to stop by the market."],
    ["A","Bueno, si tienes tiempo, me avisas.","Well, if you have time, let me know."],
    ["B","De una. En cuanto pueda te escribo.","Sure. I will text you as soon as I can."]
  ],[
    ["A","¿Qué piensas hacer mañana?","What are you thinking of doing tomorrow?"],
    ["B","Por ahora no tengo planes.","For now I don't have plans."],
    ["A","Si no llueve, podemos ir a tomar un tinto.","If it doesn't rain, we can go have a coffee."],
    ["B","Más bien nos vemos al rato, ¿te parece?","Instead, let's meet later. What do you think?"]
  ],[
    ["A","¿Qué pasó ayer?","What happened yesterday?"],
    ["B","El problema es que había mucho trancón.","The problem is that there was a lot of traffic."],
    ["A","¿Llegaste tarde?","Did you arrive late?"],
    ["B","Sí, pero de hecho llegué a tiempo.","Yes, but in fact I arrived on time."]
  ])
];
CONVERSATIONS.push(...V38_CONVERSATIONS);
const V39_CONVERSATIONS=[
  ...v36Conversation("Acciones de todos los días","High-frequency action chunks in a natural conversation",[
    ["A","¿Qué quieres hacer después del trabajo?","What do you want to do after work?"],
    ["B","Quiero pasar por el mercado, pero tengo que llegar temprano.","I want to stop by the market, but I have to arrive early."],
    ["A","¿Vas para tu casa después?","Are you headed home afterward?"],
    ["B","Sí, voy para la casa y acabo de comprar la comida.","Yes, I am headed home and I just bought the food."]
  ],[
    ["A","¿Qué estás haciendo?","What are you doing?"],
    ["B","Estoy buscando la dirección. No puedo encontrarla.","I am looking for the address. I can't find it."],
    ["A","¿Te puedo ayudar?","Can I help you?"],
    ["B","Sí, me hace falta la ubicación. Te la mando en un momento.","Yes, I need the location. I will send it to you in a moment."]
  ],[
    ["A","¿Qué pasó ayer?","What happened yesterday?"],
    ["B","Se me olvidó la cita y me tocó llamar para cambiarla.","I forgot the appointment and had to call to change it."],
    ["A","¿Y después qué hiciste?","And what did you do afterward?"],
    ["B","Me quedé en casa porque estaba cansado.","I stayed home because I was tired."]
  ])
];
CONVERSATIONS.push(...V39_CONVERSATIONS);

/* v60: longer, task-based conversations. Each one follows a real-life arc:
   opening → request → clarification → confirmation/closing. */
const v60Lines=rows=>rows.map(([who,es,en])=>({who,es,en,tts:es}));
const v60Dialogue=(title,en,rows,alternates=[])=>({title,en,tense:"Ahora",lines:v60Lines(rows),alternates});
const V60_CONVERSATIONS=[
  v60Dialogue("Comunicación: pedir y aclarar","Asking someone to repeat and give directions",[
    ["A","Perdón, ¿me puede ayudar?","Excuse me, can you help me?"],["B","Claro, dígame.","Of course, tell me."],["A","Hábleme más despacio, por favor.","Speak to me more slowly, please."],["B","Sí, cómo no.","Yes, of course."],["A","¿Me puede repetir la dirección?","Can you repeat the address for me?"],["B","Sí, siga derecho y gire a la derecha.","Yes, go straight and turn right."],["A","Disculpe, ¿es el edificio de allá?","Excuse me, is it that building over there?"],["B","Sí, ese mismo.","Yes, that one."]
  ],[{es:"¿Me puede hablar un poco más despacio, por favor?",en:"Can you speak a little more slowly, please?",tts:"¿Me puede hablar un poco más despacio, por favor?"},{es:"Perdón, ¿me lo puede repetir?",en:"Sorry, can you repeat that for me?",tts:"Perdón, ¿me lo puede repetir?"}]),
  v60Dialogue("Uber: viaje completo","A complete Uber ride from pickup to drop-off",[
    ["A","Hola, ¿usted es el conductor de Uber?","Hi, are you the Uber driver?"],["B","Sí, soy yo. ¿Usted es Seth?","Yes, that's me. Are you Seth?"],["A","Sí. Hablo un poco de español. ¿Puede hablar despacio?","Yes. I speak a little Spanish. Can you speak slowly?"],["B","Claro, no hay problema.","Of course, no problem."],["A","Voy para este edificio, el de la esquina.","I'm going to this building, the one on the corner."],["B","¿El edificio alto que está al frente?","The tall building that's across the way?"],["A","Sí, ese mismo. Avíseme dónde me bajo, por favor.","Yes, that one. Please let me know where I get out."],["B","Listo, llegamos en unos minutos.","Okay, we'll arrive in a few minutes."]
  ],[{es:"Voy para el edificio de la esquina. ¿Me puede avisar cuando lleguemos?",en:"I'm going to the building on the corner. Can you let me know when we arrive?",tts:"Voy para el edificio de la esquina. ¿Me puede avisar cuando lleguemos?"},{es:"No conozco mucho la ciudad; ¿me ayuda con la dirección?",en:"I don't know the city very well; can you help me with the address?",tts:"No conozco mucho la ciudad; ¿me ayuda con la dirección?"}]),
  v60Dialogue("Restaurante: una comida completa","Ordering, changing an order, and asking for the bill",[
    ["A","Buenas, ¿tiene una mesa para dos?","Hi, do you have a table for two?"],["B","Sí, por aquí.","Yes, this way."],["A","Quisiera una sopa y un jugo, por favor.","I would like a soup and a juice, please."],["B","¿La sopa la quiere con arroz o con papa?","Would you like the soup with rice or potato?"],["A","Con papa. Y el jugo sin azúcar, por favor.","With potato. And the juice without sugar, please."],["B","Claro. ¿Algo más?","Of course. Anything else?"],["A","No, gracias. ¿Me trae la cuenta cuando pueda?","No, thank you. Can you bring me the bill when you can?"],["B","De una, ya se la traigo.","Sure, I'll bring it right away."]
  ],[{es:"Me gustaría pedir una sopa y algo para tomar.",en:"I would like to order a soup and something to drink.",tts:"Me gustaría pedir una sopa y algo para tomar."},{es:"¿Me puede traer la cuenta, por favor?",en:"Can you bring me the bill, please?",tts:"¿Me puede traer la cuenta, por favor?"}]),
  v60Dialogue("Mercado: comprar y negociar","Buying food and negotiating a price",[
    ["A","Buenas, ¿cuánto cuesta el kilo de tomates?","Hi, how much does a kilo of tomatoes cost?"],["B","Cuesta ocho mil pesos.","It costs eight thousand pesos."],["A","Está un poco caro. ¿Me lo deja en siete?","It's a little expensive. Can you let me have it for seven?"],["B","Bueno, se lo dejo en siete mil.","Okay, I'll let you have it for seven thousand."],["A","Listo, deme un kilo y dos aguacates.","Great, give me a kilo and two avocados."],["B","¿Algo más?","Anything else?"],["A","No, gracias. ¿Puedo pagar con Nequi?","No, thank you. Can I pay with Nequi?"],["B","Sí, claro.","Yes, of course."]
  ],[{es:"¿Me hace un descuento si compro dos?",en:"Can you give me a discount if I buy two?",tts:"¿Me hace un descuento si compro dos?"},{es:"¿Cuánto le debo por todo?",en:"How much do I owe you for everything?",tts:"¿Cuánto le debo por todo?"}]),
  v60Dialogue("Cocinar y hablar de lo que haces","Talking about what you are doing",[
    ["A","¿Qué estás haciendo?","What are you doing?"],["B","Estoy cocinando la cena.","I'm cooking dinner."],["A","¿Y después qué vas a hacer?","And what are you going to do afterward?"],["B","Voy a salir con unos amigos.","I'm going to go out with some friends."],["A","Yo estaba trabajando cuando me llamaste.","I was working when you called me."],["B","Perdón, no sabía.","Sorry, I didn't know."],["A","No pasa nada. Ahora estoy descansando.","No problem. Now I'm resting."],["B","Qué bien, te lo mereces.","Great, you deserve it."]
  ],[{es:"En este momento estoy preparando la comida.",en:"At this moment I am preparing the food.",tts:"En este momento estoy preparando la comida."},{es:"Acabo de llegar y estoy buscando algo para comer.",en:"I just arrived and I am looking for something to eat.",tts:"Acabo de llegar y estoy buscando algo para comer."}]),
  v60Dialogue("Salir con amigos","Making and adjusting plans with friends",[
    ["A","¿Qué más? ¿Qué vas a hacer esta noche?","What's up? What are you going to do tonight?"],["B","Voy a salir con unos amigos.","I'm going out with some friends."],["A","¿Nos vemos después?","Shall we meet later?"],["B","De una, pero llego un poco tarde.","Sure, but I'll arrive a little late."],["A","No hay problema. Avísame cuando llegues.","No problem. Let me know when you arrive."],["B","Listo, te escribo.","Okay, I'll text you."],["A","¿Quieres ir a comer algo?","Do you want to go eat something?"],["B","Sí, me parece buena idea.","Yes, I think that's a good idea."]
  ],[{es:"¿Te parece si nos vemos más tarde?",en:"How about we meet later?",tts:"¿Te parece si nos vemos más tarde?"},{es:"De pronto llego después de las ocho.",en:"Maybe I'll arrive after eight.",tts:"De pronto llego después de las ocho."}]),
  v60Dialogue("En una fiesta","Meeting people and making conversation at a party",[
    ["A","Hola, ¿cómo conoces a la gente de aquí?","Hi, how do you know the people here?"],["B","Soy amigo de Laura. ¿Y tú?","I'm a friend of Laura. And you?"],["A","También. ¿Quieres algo de tomar?","Me too. Do you want something to drink?"],["B","Sí, gracias. Un jugo está bien.","Yes, thank you. A juice is fine."],["A","La música está muy buena.","The music is really good."],["B","Sí, está chévere.","Yes, it's cool."],["A","Me tengo que ir, pero la pasé muy bien.","I have to go, but I had a great time."],["B","Nos vemos, cuídate.","See you, take care."]
  ],[{es:"¿Ya conocías a alguien antes de venir?",en:"Did you already know anyone before coming?",tts:"¿Ya conocías a alguien antes de venir?"},{es:"Qué gusto conocerte. Nos vemos luego.",en:"Nice to meet you. See you later.",tts:"Qué gusto conocerte. Nos vemos luego."}]),
  v60Dialogue("Ver el partido","Talking about a soccer match",[
    ["A","¿Vas a ver el partido esta noche?","Are you going to watch the game tonight?"],["B","Claro, no me lo pierdo.","Of course, I wouldn't miss it."],["A","¿Quién está jugando?","Who's playing?"],["B","Juega Colombia contra Brasil.","Colombia is playing against Brazil."],["A","Ojalá gane Colombia.","I hope Colombia wins."],["B","Sí, vamos con toda.","Yes, let's give it our all."],["A","Si hacen gol, te escribo.","If they score, I'll text you."],["B","De una, lo vemos juntos.","Sure, we'll watch it together."]
  ],[{es:"¿Cómo va el marcador?",en:"How is the score?",tts:"¿Cómo va el marcador?"},{es:"Ese partido estuvo buenísimo.",en:"That game was really great.",tts:"Ese partido estuvo buenísimo."}]),
  v60Dialogue("Oficina: proyecto y retraso","Explaining progress and a delay at work",[
    ["A","¿Cómo va el proyecto?","How is the project going?"],["B","Va bien, pero estoy un poco atrasado.","It's going well, but I'm a little behind."],["A","¿Necesitas ayuda con el informe?","Do you need help with the report?"],["B","Sí, ¿me puede revisar esta parte?","Yes, can you review this part for me?"],["A","Claro, se la reviso después de la reunión.","Of course, I'll review it after the meeting."],["B","Perfecto. Yo termino los datos hoy.","Perfect. I'll finish the data today."],["A","Entonces mañana lo mandamos al cliente.","Then tomorrow we'll send it to the client."],["B","Listo, me parece bien.","Okay, sounds good to me."]
  ],[{es:"El proyecto está casi listo, pero necesito un día más.",en:"The project is almost ready, but I need one more day.",tts:"El proyecto está casi listo, pero necesito un día más."},{es:"¿Me puede dar una mano con este informe?",en:"Can you give me a hand with this report?",tts:"¿Me puede dar una mano con este informe?"}])
];
CONVERSATIONS.push(...V60_CONVERSATIONS);

FRASES.push(
  {section:"🗣️ Pedir, repetir y aclarar",quizCat:"mandatos",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[{es:"Háblame más despacio.",en:"Speak to me more slowly. (informal)"},{es:"Hábleme más despacio, por favor.",en:"Speak to me more slowly, please. (formal)"},{es:"Dígame la dirección.",en:"Tell me the address. (formal)"},{es:"Escúchame un momento.",en:"Listen to me for a moment. (informal)"},{es:"Repítame la pregunta, por favor.",en:"Repeat the question for me, please. (formal)"},{es:"Disculpe, no entendí.",en:"Excuse me, I didn't understand."},{es:"Dime otra vez.",en:"Tell me again. (informal)"},{es:"¿Me puede mostrar?","en":"Can you show me?"}]},
  {section:"🚗 Un viaje completo en Uber",quizCat:"uber-real",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[{es:"¿Usted es el conductor de Uber?",en:"Are you the Uber driver?"},{es:"Hablo un poco de español.",en:"I speak a little Spanish."},{es:"¿Puede hablar despacio?",en:"Can you speak slowly?"},{es:"Voy para el edificio de la esquina.",en:"I'm going to the building on the corner."},{es:"El de allá, al frente.",en:"The one over there, across the way."},{es:"Avíseme dónde me bajo.",en:"Let me know where I get out."},{es:"¿Cuánto falta?",en:"How much longer?"},{es:"Ya llegamos.",en:"We've arrived."}]},
  {section:"🍽️ Comer fuera — conversación real",quizCat:"restaurante-real",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[{es:"¿Tiene una mesa para dos?",en:"Do you have a table for two?"},{es:"Quisiera pedir…",en:"I would like to order…"},{es:"Con papa, por favor.",en:"With potato, please."},{es:"Sin azúcar.",en:"Without sugar."},{es:"¿Algo más?",en:"Anything else?"},{es:"¿Me cambia esto, por favor?",en:"Can you change this for me, please?"},{es:"¿Me trae la cuenta?",en:"Can you bring me the bill?"},{es:"¿Puedo pagar con tarjeta?",en:"Can I pay by card?"}]},
  {section:"🛍️ Mercado — comprar y negociar",quizCat:"mercado",cls:"color:var(--green);background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2)",items:[{es:"¿Cuánto cuesta el kilo?",en:"How much does a kilo cost?"},{es:"Está un poco caro.",en:"It's a little expensive."},{es:"¿Me lo deja en siete?",en:"Can you let me have it for seven?"},{es:"¿Me hace un descuento?",en:"Can you give me a discount?"},{es:"Deme dos, por favor.",en:"Give me two, please."},{es:"¿Cuánto le debo por todo?",en:"How much do I owe you for everything?"},{es:"¿Puedo pagar con Nequi?",en:"Can I pay with Nequi?"},{es:"Listo, muchas gracias.",en:"Great, thank you very much."}]},
  {section:"🔄 Actividades en progreso",quizCat:"gerundios",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[{es:"Estoy cocinando.",en:"I am cooking."},{es:"Estoy buscando la dirección.",en:"I am looking for the address."},{es:"Estoy aprendiendo español.",en:"I am learning Spanish."},{es:"Está lloviendo.",en:"It is raining."},{es:"¿Qué estás haciendo?",en:"What are you doing?"},{es:"Estaba trabajando.",en:"I was working."},{es:"Acabo de llegar.",en:"I just arrived."},{es:"Fui de compras.",en:"I went shopping."}]},
  {section:"🤝 Salir con amigos",quizCat:"social",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[{es:"¿Qué vas a hacer esta noche?",en:"What are you going to do tonight?"},{es:"Voy a salir con unos amigos.",en:"I'm going out with some friends."},{es:"¿Nos vemos después?",en:"Shall we meet later?"},{es:"De una.",en:"Sure / I'm in. (Colombian)"},{es:"Llego un poco tarde.",en:"I'll arrive a little late."},{es:"Avísame cuando llegues.",en:"Let me know when you arrive."},{es:"¿Quieres ir a comer algo?",en:"Do you want to go eat something?"},{es:"Me parece buena idea.",en:"I think that's a good idea."}]},
  {section:"🎉 En una fiesta",quizCat:"fiesta",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[{es:"¿Cómo conoces a la gente de aquí?",en:"How do you know the people here?"},{es:"Soy amigo de…",en:"I'm a friend of…"},{es:"¿Quieres algo de tomar?",en:"Do you want something to drink?"},{es:"Un jugo está bien.",en:"A juice is fine."},{es:"La música está muy buena.",en:"The music is really good."},{es:"Está chévere.",en:"It's cool."},{es:"La pasé muy bien.",en:"I had a great time."},{es:"Me tengo que ir.",en:"I have to go."}]},
  {section:"⚽ Ver el partido",quizCat:"deportes",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[{es:"¿Vas a ver el partido?",en:"Are you going to watch the game?"},{es:"No me lo pierdo.",en:"I wouldn't miss it."},{es:"¿Quién está jugando?",en:"Who's playing?"},{es:"¿Cómo va el marcador?",en:"How is the score?"},{es:"Ojalá gane Colombia.",en:"I hope Colombia wins."},{es:"Vamos con toda.",en:"Let's give it our all. (Colombian)"},{es:"Hicieron gol.",en:"They scored."},{es:"Lo vemos juntos.",en:"We'll watch it together."}]},
  {section:"🧑‍💼 Oficina — conversación real",quizCat:"oficina-real",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[{es:"¿Cómo va el proyecto?",en:"How is the project going?"},{es:"Estoy un poco atrasado.",en:"I'm a little behind."},{es:"¿Necesitas ayuda?",en:"Do you need help?"},{es:"¿Me puede revisar esta parte?",en:"Can you review this part for me?"},{es:"Se la reviso después.",en:"I'll review it for you afterward."},{es:"Termino los datos hoy.",en:"I'll finish the data today."},{es:"Lo mandamos mañana.",en:"We'll send it tomorrow."},{es:"Me parece bien.",en:"Sounds good to me."}]}
);

 /* Speaking missions: situations first, with more than one natural answer. */
 const CONVERSATION_MISSIONS=[
   {id:"taxi-aeropuerto",title:"Pide un taxi",scenario:"You are outside a hotel in Bogotá. Ask the driver to take you to the airport and ask the price.",prompt:"Di tu respuesta en español:",lesson:"calle",models:[{es:"¿Me lleva al aeropuerto, por favor? ¿Cuánto cuesta?",en:"Can you take me to the airport, please? How much does it cost?",tts:"¿Me lleva al aeropuerto, por favor? ¿Cuánto cuesta?"},{es:"Buenas, necesito ir al aeropuerto. ¿Cuánto me cobra?",en:"Hi, I need to go to the airport. How much will you charge me?",tts:"Buenas, necesito ir al aeropuerto. ¿Cuánto me cobra?"}]},
   {id:"tinto-por-favor",title:"Pide un tinto",scenario:"You are in a Colombian café. Order a black coffee politely and say you want it without sugar.",prompt:"Di tu pedido:",lesson:"colombia",models:[{es:"¿Me regala un tinto, por favor? Sin azúcar.",en:"Can I have a black coffee, please? Without sugar.",tts:"¿Me regala un tinto, por favor? Sin azúcar."},{es:"Quisiera un tinto, por favor, y no le ponga azúcar.",en:"I would like a black coffee, please, and don't add sugar.",tts:"Quisiera un tinto, por favor, y no le ponga azúcar."}]},
   {id:"saludo-parce",title:"Saluda a un amigo",scenario:"You run into a Colombian friend you have not seen recently. Greet them and ask how things are going.",prompt:"Saluda de forma natural:",lesson:"colombia",models:[{es:"¡Hola, parce! ¿Qué más?",en:"Hi, buddy! What's up?",tts:"¡Hola, parce! ¿Qué más?"},{es:"¿Qué más, parce? ¿Cómo te ha ido?",en:"What's up, buddy? How have things been?",tts:"¿Qué más, parce? ¿Cómo te ha ido?"}]},
   {id:"reunion-trabajo",title:"Habla de tu trabajo",scenario:"A new coworker asks what you are doing today. Say that you have a meeting and need to finish a project.",prompt:"Responde en español:",lesson:"trabajo",models:[{es:"Tengo una reunión y necesito terminar un proyecto.",en:"I have a meeting and I need to finish a project.",tts:"Tengo una reunión y necesito terminar un proyecto."},{es:"Estoy trabajando en un proyecto; después tengo una reunión.",en:"I am working on a project; afterward I have a meeting.",tts:"Estoy trabajando en un proyecto; después tengo una reunión."}]},
   {id:"problema-casa",title:"Explica un problema",scenario:"Something at home stopped working. Explain the problem and say you need help.",prompt:"Explica qué pasó:",lesson:"casa",models:[{es:"La ducha no funciona y necesito ayuda.",en:"The shower does not work and I need help.",tts:"La ducha no funciona y necesito ayuda."},{es:"Se dañó la ducha. ¿Me puede ayudar, por favor?",en:"The shower broke. Can you help me, please?",tts:"Se dañó la ducha. ¿Me puede ayudar, por favor?"}]},
   {id:"mercado-comida",title:"Compra comida",scenario:"You are at a market. Say what you need to buy and ask how much it costs.",prompt:"Habla con el vendedor:",lesson:"plata",models:[{es:"Necesito comprar arepas. ¿Cuánto cuestan?",en:"I need to buy arepas. How much do they cost?",tts:"Necesito comprar arepas. ¿Cuánto cuestan?"},{es:"¿Me regala dos arepas? ¿Cuánto le debo?",en:"Can I have two arepas? How much do I owe you?",tts:"¿Me regala dos arepas? ¿Cuánto le debo?"}]},
   {id:"contar-ayer",title:"Cuenta qué pasó",scenario:"A friend asks what you did yesterday. Say where you went and what you wanted to do afterward.",prompt:"Cuenta tu día:",lesson:"gram-pasado-historia",models:[{es:"Ayer fui al mercado y después quería descansar en casa.",en:"Yesterday I went to the market and afterward I wanted to rest at home.",tts:"Ayer fui al mercado y después quería descansar en casa."},{es:"Fui al mercado porque necesitaba comida; luego me quedé en casa.",en:"I went to the market because I needed food; then I stayed home.",tts:"Fui al mercado porque necesitaba comida; luego me quedé en casa."}]},
   {id:"planes-fin-semana",title:"Haz planes",scenario:"Ask a friend what they are going to do this weekend and suggest meeting for coffee.",prompt:"Propón un plan:",lesson:"planes",models:[{es:"¿Qué vas a hacer este fin de semana? ¿Nos vemos para un tinto?",en:"What are you going to do this weekend? Shall we meet for a coffee?",tts:"¿Qué vas a hacer este fin de semana? ¿Nos vemos para un tinto?"},{es:"¿Te parece si nos vemos el sábado para tomar un tinto?",en:"How about we meet Saturday for a coffee?",tts:"¿Te parece si nos vemos el sábado para tomar un tinto?"}]},
   {id:"direcciones-hospital",title:"Pide direcciones",scenario:"You are lost and need to find the hospital. Ask someone politely and repeat the key location.",prompt:"Pide ayuda:",lesson:"calle",models:[{es:"Disculpe, ¿dónde queda el hospital?",en:"Excuse me, where is the hospital?",tts:"Disculpe, ¿dónde queda el hospital?"},{es:"Perdón, estoy perdido. ¿Me regala la dirección del hospital?",en:"Sorry, I am lost. Could you give me the hospital's address?",tts:"Perdón, estoy perdido. ¿Me regala la dirección del hospital?"}]},
   {id:"como-te-sientes",title:"Explica cómo te sientes",scenario:"A friend asks how you feel. Say that you are tired, have a headache, and need to rest.",prompt:"Responde:",lesson:"sentirse",models:[{es:"Estoy cansado y me duele la cabeza. Necesito descansar.",en:"I am tired and my head hurts. I need to rest.",tts:"Estoy cansado y me duele la cabeza. Necesito descansar."},{es:"Me siento mal; tengo sueño y quiero descansar.",en:"I feel bad; I am sleepy and I want to rest.",tts:"Me siento mal; tengo sueño y quiero descansar."}]}
 ];

CONVERSATION_MISSIONS.push(
  {id:"uber-habla-despacio",title:"Pide que hablen despacio",scenario:"Your Uber driver speaks quickly. Explain that you are learning Spanish and ask them to repeat slowly.",prompt:"Responde con calma:",lesson:"uber-ride",models:[{es:"Hablo poquito español. ¿Puede hablar más despacio, por favor?",en:"I speak a little Spanish. Can you speak more slowly, please?",tts:"Hablo poquito español. ¿Puede hablar más despacio, por favor?"},{es:"Perdón, estoy aprendiendo español. ¿Me puede repetir?",en:"Sorry, I am learning Spanish. Can you repeat that?",tts:"Perdón, estoy aprendiendo español. ¿Me puede repetir?"}]},
  {id:"hotel-checkin",title:"Regístrate en el hotel",scenario:"Check in, show your passport, and ask where breakfast is.",prompt:"Haz el registro:",lesson:"hotel-checkin",models:[{es:"Buenas, tengo una reserva a nombre de Seth. ¿A qué hora es el desayuno?",en:"Hi, I have a reservation under Seth's name. What time is breakfast?",tts:"Buenas, tengo una reserva a nombre de Seth. ¿A qué hora es el desayuno?"},{es:"Claro, aquí tiene mi pasaporte. ¿Dónde está el ascensor?",en:"Of course, here is my passport. Where is the elevator?",tts:"Claro, aquí tiene mi pasaporte. ¿Dónde está el ascensor?"}]},
  {id:"farmacia-sintomas",title:"Explica síntomas",scenario:"At a pharmacy, say that you have a headache and ask how to take the medicine.",prompt:"Explica lo que necesitas:",lesson:"farmacia",models:[{es:"Necesito algo para el dolor de cabeza. ¿Cómo lo debo tomar?",en:"I need something for a headache. How should I take it?",tts:"Necesito algo para el dolor de cabeza. ¿Cómo lo debo tomar?"},{es:"Me siento cansado y me duele la cabeza desde esta mañana.",en:"I feel tired and my head has hurt since this morning.",tts:"Me siento cansado y me duele la cabeza desde esta mañana."}]},
  {id:"edificio-direcciones",title:"Encuentra el edificio",scenario:"You are looking for a building. Ask where the entrance is and repeat the directions.",prompt:"Pide y confirma la dirección:",lesson:"direcciones",models:[{es:"¿Me puede indicar? ¿Es el edificio de allá?",en:"Can you point it out? Is it that building over there?",tts:"¿Me puede indicar? ¿Es el edificio de allá?"},{es:"¿Dónde está la entrada? ¿Queda al frente o detrás del edificio?",en:"Where is the entrance? Is it in front of or behind the building?",tts:"¿Dónde está la entrada? ¿Queda al frente o detrás del edificio?"}]}
);
CONVERSATION_MISSIONS.push(
  {id:"acciones-diarias",title:"Habla de tus acciones",scenario:"A friend asks what you are doing and where you are going. Use two or three action chunks to answer naturally.",prompt:"Responde sin traducir palabra por palabra:",lesson:"action-chunks",models:[{es:"Estoy buscando la dirección y voy para el hotel. Te aviso cuando llegue.",en:"I am looking for the address and I am headed to the hotel. I will let you know when I arrive.",tts:"Estoy buscando la dirección y voy para el hotel. Te aviso cuando llegue."},{es:"Quiero pasar por el mercado, pero tengo que llegar a casa temprano.",en:"I want to stop by the market, but I have to get home early.",tts:"Quiero pasar por el mercado, pero tengo que llegar a casa temprano."}]}
);
CONVERSATION_MISSIONS.push(
  {id:"uber-ruta",title:"Corrige la ruta del Uber",scenario:"Your Uber driver seems to be going the wrong way. Explain the problem politely and confirm the destination.",prompt:"Responde con una frase para reparar la situación:",lesson:"uber-ride",models:[{es:"Disculpe, creo que vamos por otro lado. El destino es este hotel.",en:"Excuse me, I think we are going another way. The destination is this hotel.",tts:"Disculpe, creo que vamos por otro lado. El destino es este hotel."},{es:"Perdón, ¿puede revisar la dirección? Creo que esta no es la ruta.",en:"Sorry, can you check the address? I think this is not the route.",tts:"Perdón, ¿puede revisar la dirección? Creo que esta no es la ruta."}]},
  {id:"edificio-entrada",title:"Explica dónde está el edificio",scenario:"Someone asks for directions. Tell them to go straight, identify the building over there, and explain where the entrance is.",prompt:"Da las indicaciones:",lesson:"direcciones",models:[{es:"Siga derecho hasta el fondo. Es el edificio de allá y la entrada queda detrás.",en:"Go straight to the back. It is that building over there, and the entrance is behind it.",tts:"Siga derecho hasta el fondo. Es el edificio de allá y la entrada queda detrás."},{es:"Vaya derecho hasta la esquina; el edificio está al frente y la entrada queda por atrás.",en:"Go straight to the corner; the building is in front, and the entrance is in the back.",tts:"Vaya derecho hasta la esquina; el edificio está al frente y la entrada queda por atrás."}]},
  {id:"cita-cambio",title:"Cambia una cita",scenario:"You cannot attend an appointment tomorrow. Explain why and suggest another time.",prompt:"Llama y cambia la cita:",lesson:"planes",models:[{es:"Mañana no puedo ir porque tengo una reunión. ¿Podemos vernos el viernes?",en:"I cannot go tomorrow because I have a meeting. Can we meet Friday?",tts:"Mañana no puedo ir porque tengo una reunión. ¿Podemos vernos el viernes?"},{es:"Se me cruzó algo mañana. ¿Le parece si cambiamos la cita para la próxima semana?",en:"Something came up tomorrow. Would it be okay if we move the appointment to next week?",tts:"Se me cruzó algo mañana. ¿Le parece si cambiamos la cita para la próxima semana?"}]},
  {id:"si-entonces-plan",title:"Propón un plan con una condición",scenario:"Make a weekend plan with a friend. Say what you will do if the weather is good, and offer a backup plan.",prompt:"Habla de las dos posibilidades:",lesson:"planes",models:[{es:"Si hace buen tiempo, vamos al parque; si no, nos vemos para un tinto.",en:"If the weather is good, we will go to the park; if not, we will meet for a coffee.",tts:"Si hace buen tiempo, vamos al parque; si no, nos vemos para un tinto."},{es:"Si no llueve, podemos caminar. Si llueve, hacemos algo en casa.",en:"If it does not rain, we can walk. If it rains, we will do something at home.",tts:"Si no llueve, podemos caminar. Si llueve, hacemos algo en casa."}]}
);

 /* Short readings: read for meaning first, then shadow each sentence aloud. */
 const READINGS=[
   {id:"lectura-cafe",level:"A1",title:"Un tinto en la mañana",lesson:"colombia",intro:"A simple Colombian café order.",lines:[
     {es:"Por la mañana voy a una cafetería cerca de mi casa.",en:"In the morning I go to a café near my house.",tts:"Por la mañana voy a una cafetería cerca de mi casa."},
     {es:"¿Me regala un tinto, por favor?",en:"Can I have a black coffee, please?",tts:"¿Me regala un tinto, por favor?"},
     {es:"Sí, claro. ¿Lo quiere con azúcar?",en:"Yes, of course. Do you want it with sugar?",tts:"Sí, claro. ¿Lo quiere con azúcar?"},
     {es:"No, gracias. Así está bien.",en:"No, thank you. It is fine like that.",tts:"No, gracias. Así está bien."}
   ],questions:[{q:"¿Qué pide la persona?",choices:["Un tinto","Una cerveza","Un jugo"],answer:"Un tinto"}]},
   {id:"lectura-mercado",level:"A1",title:"En el mercado",lesson:"plata",intro:"Useful words for buying food.",lines:[
     {es:"Hoy necesito comprar mercado para la semana.",en:"Today I need to buy groceries for the week.",tts:"Hoy necesito comprar mercado para la semana."},
     {es:"Compro arepas, huevos, arroz y aguacates.",en:"I buy arepas, eggs, rice, and avocados.",tts:"Compro arepas, huevos, arroz y aguacates."},
     {es:"La señora me dice el precio y yo pago con tarjeta.",en:"The woman tells me the price and I pay by card.",tts:"La señora me dice el precio y yo pago con tarjeta."},
     {es:"Después vuelvo a casa con las bolsas.",en:"Afterward I return home with the bags.",tts:"Después vuelvo a casa con las bolsas."}
   ],questions:[{q:"¿Qué compra la persona?",choices:["Comida","Ropa","Un carro"],answer:"Comida"}]},
   {id:"lectura-taxi",level:"A1",title:"Un taxi en Bogotá",lesson:"calle",intro:"Practice directions and polite requests.",lines:[
     {es:"Salgo del hotel y busco un taxi.",en:"I leave the hotel and look for a taxi.",tts:"Salgo del hotel y busco un taxi."},
     {es:"Buenas, ¿me lleva al aeropuerto, por favor?",en:"Hi, can you take me to the airport, please?",tts:"Buenas, ¿me lleva al aeropuerto, por favor?"},
     {es:"Claro. Siga derecho y luego gire a la izquierda.",en:"Of course. Go straight and then turn left.",tts:"Claro. Siga derecho y luego gire a la izquierda."},
     {es:"Hay un poco de trancón, pero llegamos a tiempo.",en:"There is a little traffic, but we will arrive on time.",tts:"Hay un poco de trancón, pero llegamos a tiempo."}
   ],questions:[{q:"¿A dónde va la persona?",choices:["Al aeropuerto","Al mercado","A la oficina"],answer:"Al aeropuerto"}]},
   {id:"lectura-trabajo",level:"A1",title:"Un día de trabajo",lesson:"trabajo",intro:"Present tense plus everyday speaking patterns.",lines:[
     {es:"Trabajo en una oficina y llego a las ocho.",en:"I work in an office and arrive at eight.",tts:"Trabajo en una oficina y llego a las ocho."},
     {es:"Tengo que terminar un proyecto antes del almuerzo.",en:"I have to finish a project before lunch.",tts:"Tengo que terminar un proyecto antes del almuerzo."},
     {es:"A las diez tengo una reunión con mi jefe.",en:"At ten I have a meeting with my boss.",tts:"A las diez tengo una reunión con mi jefe."},
     {es:"Después de trabajar, voy a descansar en casa.",en:"After working, I am going to rest at home.",tts:"Después de trabajar, voy a descansar en casa."}
   ],questions:[{q:"¿Qué tiene la persona a las diez?",choices:["Una reunión","Un taxi","Una clase"],answer:"Una reunión"}]},
   {id:"lectura-ayer",level:"A2",title:"Lo que hice ayer",lesson:"gram-pasado-historia",intro:"Tell a short story with past-tense verbs.",lines:[
     {es:"Ayer fui al centro porque necesitaba comprar un regalo.",en:"Yesterday I went downtown because I needed to buy a gift.",tts:"Ayer fui al centro porque necesitaba comprar un regalo."},
     {es:"Había mucho trancón, así que llegué un poco tarde.",en:"There was a lot of traffic, so I arrived a little late.",tts:"Había mucho trancón, así que llegué un poco tarde."},
     {es:"Compré el regalo y después tomé un tinto.",en:"I bought the gift and afterward had a black coffee.",tts:"Compré el regalo y después tomé un tinto."},
     {es:"Al final regresé a casa y descansé.",en:"In the end I returned home and rested.",tts:"Al final regresé a casa y descansé."}
   ],questions:[{q:"¿Por qué fue al centro?",choices:["Para comprar un regalo","Para trabajar","Para tomar un taxi"],answer:"Para comprar un regalo"}]},
   {id:"lectura-planes",level:"A2",title:"Planes para el sábado",lesson:"planes",intro:"Use future plans and natural Colombian responses.",lines:[
     {es:"El viernes le escribo a mi amigo para hacer planes.",en:"On Friday I text my friend to make plans.",tts:"El viernes le escribo a mi amigo para hacer planes."},
     {es:"¿Qué vas a hacer el sábado?",en:"What are you going to do Saturday?",tts:"¿Qué vas a hacer el sábado?"},
     {es:"Voy a visitar a mi familia, pero podemos vernos en la tarde.",en:"I am going to visit my family, but we can meet in the afternoon.",tts:"Voy a visitar a mi familia, pero podemos vernos en la tarde."},
     {es:"De una. Te aviso la hora después.",en:"I'm in. I will let you know the time later.",tts:"De una. Te aviso la hora después."}
   ],questions:[{q:"¿Cuándo pueden verse?",choices:["En la tarde","En la mañana","La próxima semana"],answer:"En la tarde"}]}
 ];

READINGS.push(
  {id:"lectura-uber",level:"A1",title:"Una recogida en Uber",lesson:"uber-ride",intro:"Read a short pickup conversation and notice repair phrases.",lines:[
    {es:"Buenas, ¿usted es mi conductor?",en:"Hi, are you my driver?",tts:"Buenas, ¿usted es mi conductor?"},{es:"Sí, soy yo. Estoy en un carro gris.",en:"Yes, that's me. I am in a gray car.",tts:"Sí, soy yo. Estoy en un carro gris."},{es:"Hablo poquito español, pero voy para este hotel.",en:"I speak a little Spanish, but I am going to this hotel.",tts:"Hablo poquito español, pero voy para este hotel."},{es:"¿Puede hablar más despacio, por favor?",en:"Can you speak more slowly, please?",tts:"¿Puede hablar más despacio, por favor?"}
  ],questions:[{q:"¿Adónde va la persona?",choices:["A un hotel","A una farmacia","A una oficina"],answer:"A un hotel"}]},
  {id:"lectura-hotel",level:"A1",title:"Llegar al hotel",lesson:"hotel-checkin",intro:"Practice a simple check-in and location question.",lines:[
    {es:"Tengo una reserva a nombre de Seth.",en:"I have a reservation under Seth's name.",tts:"Tengo una reserva a nombre de Seth."},{es:"Claro, ¿me puede mostrar el pasaporte?",en:"Of course, can you show me your passport?",tts:"Claro, ¿me puede mostrar el pasaporte?"},{es:"Aquí tiene. ¿A qué hora es el desayuno?",en:"Here you go. What time is breakfast?",tts:"Aquí tiene. ¿A qué hora es el desayuno?"},{es:"El desayuno es en el primer piso, al lado del ascensor.",en:"Breakfast is on the first floor, next to the elevator.",tts:"El desayuno es en el primer piso, al lado del ascensor."}
  ],questions:[{q:"¿Dónde está el desayuno?",choices:["En el primer piso","En el carro","Detrás del hospital"],answer:"En el primer piso"}]},
  {id:"lectura-telefono",level:"A2",title:"Una llamada con mala señal",lesson:"daily-repair",intro:"Notice how speakers repair a broken phone call.",lines:[
    {es:"¿Aló? ¿Me escuchas?",en:"Hello? Can you hear me?",tts:"¿Aló? ¿Me escuchas?"},{es:"Te escucho, pero la señal está mala.",en:"I can hear you, but the signal is bad.",tts:"Te escucho, pero la señal está mala."},{es:"Se está cortando la llamada, así que te escribo.",en:"The call is cutting out, so I will text you.",tts:"Se está cortando la llamada, así que te escribo."},{es:"Listo, hablamos más tarde.",en:"Okay, we will talk later.",tts:"Listo, hablamos más tarde."}
  ],questions:[{q:"¿Qué problema tienen?",choices:["Mala señal","No tienen comida","Perdieron el carro"],answer:"Mala señal"}]},
  {id:"lectura-edificio",level:"A1",title:"El edificio de allá",lesson:"direcciones",intro:"Practice front, behind, entrance, and floor directions.",lines:[
    {es:"Disculpe, ¿dónde está la entrada?",en:"Excuse me, where is the entrance?",tts:"Disculpe, ¿dónde está la entrada?"},{es:"Es el edificio de allá, al frente.",en:"It is that building over there, across the way.",tts:"Es el edificio de allá, al frente."},{es:"Siga derecho hasta la esquina y gire a la derecha.",en:"Go straight to the corner and turn right.",tts:"Siga derecho hasta la esquina y gire a la derecha."},{es:"Después suba al segundo piso.",en:"Then go up to the second floor.",tts:"Después suba al segundo piso."}
  ],questions:[{q:"¿A qué piso debe subir?",choices:["Al segundo piso","Al primer piso","Al sótano"],answer:"Al segundo piso"}]}
);
READINGS.push(
  {id:"lectura-historia-contraste",level:"A2",title:"Una tarde con lluvia",lesson:"gram-pasado-contraste",intro:"Notice the difference between the background and the completed events. Read once for meaning, then shadow each line.",lines:[
    {es:"Cuando era niño, vivía cerca de un parque.",en:"When I was a child, I lived near a park.",tts:"Cuando era niño, vivía cerca de un parque."},
    {es:"Ayer fui al mismo parque porque quería caminar.",en:"Yesterday I went to the same park because I wanted to walk.",tts:"Ayer fui al mismo parque porque quería caminar."},
    {es:"Estaba lloviendo cuando llegué, pero no me devolví.",en:"It was raining when I arrived, but I did not turn back.",tts:"Estaba lloviendo cuando llegué, pero no me devolví."},
    {es:"Esperé diez minutos y después regresé a casa.",en:"I waited ten minutes and then returned home.",tts:"Esperé diez minutos y después regresé a casa."}
  ],questions:[{q:"¿Qué estaba pasando cuando llegó?",choices:["Estaba lloviendo","Estaba trabajando","Estaba cocinando"],answer:"Estaba lloviendo"},{q:"¿Qué hizo después?",choices:["Regresó a casa","Compró un carro","Llamó al médico"],answer:"Regresó a casa"}]},
  {id:"lectura-pronombres-ubicacion",level:"A2",title:"La dirección y el mensaje",lesson:"gram-pronombres",intro:"Listen for lo, la, le, and se lo. Try to say each line before hearing it.",lines:[
    {es:"¿Tienes la dirección del edificio?",en:"Do you have the building's address?",tts:"¿Tienes la dirección del edificio?"},
    {es:"Sí, la tengo aquí, pero no sé cómo llegar.",en:"Yes, I have it here, but I do not know how to get there.",tts:"Sí, la tengo aquí, pero no sé cómo llegar."},
    {es:"Mándamela por mensaje y se la muestro al conductor.",en:"Send it to me by message and I will show it to the driver.",tts:"Mándamela por mensaje y se la muestro al conductor."},
    {es:"Listo, ya te la mandé.",en:"Okay, I already sent it to you.",tts:"Listo, ya te la mandé."}
  ],questions:[{q:"¿Qué va a mostrarle al conductor?",choices:["La dirección","La habitación","La comida"],answer:"La dirección"}]}
);

// ── Grammar data ──────────────────────────────────────────────────────────────
const GRAMMAR={
  presente:{intro:"The present tense describes habits, facts, and current actions. 3 verb types: AR, ER, IR.",trick:"The -O ending always means 'I'. Yo habl-O = I speak. Yo com-O = I eat. Yo viv-O = I live. Learn -O and you can talk about yourself instantly!",
    tables:[{title:"AR Verbs — Hablar",sub:"Drop -AR, add: -o, -as, -a, -amos, -an",rows:[{pro:"Yo",verb:"hablo",en:"I speak",tts:"yo hablo"},{pro:"Tú",verb:"hablas",en:"you speak",tts:"tú hablas"},{pro:"Él/Ella/Ud.",verb:"habla",en:"he/she speaks",tts:"él habla"},{pro:"Nosotros",verb:"hablamos",en:"we speak",tts:"nosotros hablamos"},{pro:"Ellos/Uds.",verb:"hablan",en:"they speak",tts:"ellos hablan"}]},{title:"ER Verbs — Comer",sub:"Drop -ER, add: -o, -es, -e, -emos, -en",rows:[{pro:"Yo",verb:"como",en:"I eat",tts:"yo como"},{pro:"Tú",verb:"comes",en:"you eat",tts:"tú comes"},{pro:"Él/Ella/Ud.",verb:"come",en:"he/she eats",tts:"él come"},{pro:"Nosotros",verb:"comemos",en:"we eat",tts:"nosotros comemos"},{pro:"Ellos/Uds.",verb:"comen",en:"they eat",tts:"ellos comen"}]},{title:"IR Verbs — Vivir",sub:"Drop -IR, add: -o, -es, -e, -imos, -en",rows:[{pro:"Yo",verb:"vivo",en:"I live",tts:"yo vivo"},{pro:"Tú",verb:"vives",en:"you live",tts:"tú vives"},{pro:"Él/Ella/Ud.",verb:"vive",en:"he/she lives",tts:"él vive"},{pro:"Nosotros",verb:"vivimos",en:"we live",tts:"nosotros vivimos"},{pro:"Ellos/Uds.",verb:"viven",en:"they live",tts:"ellos viven"}]}],
    examples:[{es:"Yo hablo un poco de español.",en:"I speak a little Spanish.",tts:"Yo hablo un poco de español."},{es:"¿Dónde vives tú?",en:"Where do you live?",tts:"¿Dónde vives tú?"},{es:"Ella come arepa todos los días.",en:"She eats arepa every day.",tts:"Ella come arepa todos los días."}]},
  pasado:{intro:"The simple past (Pretérito Indefinido) is used for completed actions. 'I spoke', 'I ate', 'I went'. Accents on the endings are the key signal.",trick:"Look for the accent at the END of a verb — it signals past tense! hablÉ = I spoke, comIÓ = he ate, fuÉ = I was/went. Spot the tilde = something HAPPENED!",
    tables:[{title:"AR Verbs — Hablar",sub:"Past endings: -é, -aste, -ó, -amos, -aron",rows:[{pro:"Yo",verb:"hablé",en:"I spoke",tts:"yo hablé"},{pro:"Tú",verb:"hablaste",en:"you spoke",tts:"tú hablaste"},{pro:"Él/Ella/Ud.",verb:"habló",en:"he/she spoke",tts:"él habló"},{pro:"Nosotros",verb:"hablamos",en:"we spoke",tts:"nosotros hablamos"},{pro:"Ellos/Uds.",verb:"hablaron",en:"they spoke",tts:"ellos hablaron"}]},{title:"ER/IR Verbs — Comer",sub:"Past endings: -í, -iste, -ió, -imos, -ieron",rows:[{pro:"Yo",verb:"comí",en:"I ate",tts:"yo comí"},{pro:"Tú",verb:"comiste",en:"you ate",tts:"tú comiste"},{pro:"Él/Ella/Ud.",verb:"comió",en:"he/she ate",tts:"él comió"},{pro:"Nosotros",verb:"comimos",en:"we ate",tts:"nosotros comimos"},{pro:"Ellos/Uds.",verb:"comieron",en:"they ate",tts:"ellos comieron"}]},{title:"⚡ Ser & Ir — IDENTICAL past tense!",sub:"Both mean 'was' AND 'went' — context tells you which",rows:[{pro:"Yo",verb:"fui",en:"I was / I went",tts:"yo fui"},{pro:"Tú",verb:"fuiste",en:"you were / went",tts:"tú fuiste"},{pro:"Él/Ella/Ud.",verb:"fue",en:"he was / he went",tts:"él fue"},{pro:"Nosotros",verb:"fuimos",en:"we were / went",tts:"nosotros fuimos"},{pro:"Ellos/Uds.",verb:"fueron",en:"they were / went",tts:"ellos fueron"}]}],
    examples:[{es:"Ayer hablé con mi amigo.",en:"Yesterday I spoke with my friend.",tts:"Ayer hablé con mi amigo."},{es:"¿Qué comiste anoche?",en:"What did you eat last night?",tts:"¿Qué comiste anoche?"},{es:"Fui al mercado esta mañana.",en:"I went to the market this morning.",tts:"Fui al mercado esta mañana."}]},
  futuro:{intro:"Great news — the future is the EASIEST tense! Keep the full infinitive and add endings. Or use the even simpler 'voy a' (going to) form.",trick:"Near future = VOY A + any verb. Exactly like English 'going to'. Voy a comer = I'm going to eat. Start with this — you can use it for months before needing the full future tense!",
    tables:[{title:"Simple Future — Any Verb",sub:"Keep full infinitive + add: -é, -ás, -á, -emos, -án",rows:[{pro:"Yo",verb:"-é  (hablaré)",en:"I will speak",tts:"yo hablaré"},{pro:"Tú",verb:"-ás  (hablarás)",en:"you will speak",tts:"tú hablarás"},{pro:"Él/Ella/Ud.",verb:"-á  (hablará)",en:"he/she will speak",tts:"él hablará"},{pro:"Nosotros",verb:"-emos  (hablaremos)",en:"we will speak",tts:"nosotros hablaremos"},{pro:"Ellos/Uds.",verb:"-án  (hablarán)",en:"they will speak",tts:"ellos hablarán"}]},{title:"Ir a + Infinitive — Near Future",sub:"The easy way: voy/vas/va/vamos/van + a + verb",rows:[{pro:"Yo",verb:"voy a comer",en:"I'm going to eat",tts:"voy a comer"},{pro:"Tú",verb:"vas a comer",en:"you're going to eat",tts:"vas a comer"},{pro:"Él/Ella/Ud.",verb:"va a comer",en:"he's going to eat",tts:"va a comer"},{pro:"Nosotros",verb:"vamos a comer",en:"we're going to eat",tts:"vamos a comer"},{pro:"Ellos/Uds.",verb:"van a comer",en:"they're going to eat",tts:"van a comer"}]}],
    examples:[{es:"Mañana voy a ir al mercado.",en:"Tomorrow I'm going to go to the market.",tts:"Mañana voy a ir al mercado."},{es:"¿Vas a comer arepa?",en:"Are you going to eat arepa?",tts:"¿Vas a comer arepa?"},{es:"Va a llover esta tarde.",en:"It's going to rain this afternoon.",tts:"Va a llover esta tarde."}]},
  "pasado-contraste":{intro:"Spanish uses two past viewpoints: the preterite tells the completed event; the imperfect paints the background, habit, or action in progress.",trick:"Preterite moves the story forward: Ayer fui al mercado. Imperfect sets the scene: Cuando era niño, vivía en Cali.",tables:[{title:"The contrast",sub:"Completed event vs. background or repeated action",rows:[{pro:"Evento",verb:"Ayer fui al mercado.",en:"Yesterday I went to the market.",tts:"Ayer fui al mercado."},{pro:"Contexto",verb:"Cuando era niño, vivía en Cali.",en:"When I was a child, I used to live in Cali.",tts:"Cuando era niño, vivía en Cali."},{pro:"En progreso",verb:"Mientras cocinaba, me llamaste.",en:"While I was cooking, you called me.",tts:"Mientras cocinaba, me llamaste."}]}],examples:[{es:"Ayer fui al mercado, pero estaba cerrado.",en:"Yesterday I went to the market, but it was closed.",tts:"Ayer fui al mercado, pero estaba cerrado."},{es:"Cuando era niño, iba al parque todos los días.",en:"When I was a child, I used to go to the park every day.",tts:"Cuando era niño, iba al parque todos los días."},{es:"Mientras trabajaba, sonó el teléfono.",en:"While I was working, the phone rang.",tts:"Mientras trabajaba, sonó el teléfono."}]},
  subjuntivo:{intro:"The subjunctive is useful after a wish, hope, request, emotion, or recommendation when another person is doing the action.",trick:"Learn it as a speaking chunk: trigger + que + new subject + subjunctive. Quiero que vengas. Espero que estés bien.",tables:[{title:"Useful conversation triggers",sub:"Memorize the whole chunk",rows:[{pro:"Quiero que",verb:"vengas",en:"I want you to come",tts:"Quiero que vengas mañana."},{pro:"Espero que",verb:"estés",en:"I hope you are well",tts:"Espero que estés bien."},{pro:"Es importante que",verb:"hables",en:"It is important that you speak",tts:"Es importante que hables despacio."}]}],examples:[{es:"Quiero que vengas mañana.",en:"I want you to come tomorrow.",tts:"Quiero que vengas mañana."},{es:"Espero que estés bien.",en:"I hope you are well.",tts:"Espero que estés bien."},{es:"Es importante que practiques todos los días.",en:"It is important that you practice every day.",tts:"Es importante que practiques todos los días."}]},
  trucos:[{main:"V = B in Colombian Spanish",sub:"Never stress about V vs B. Vaca = 'baca'. Vo = 'bo'. Identical sounds in Colombia. ✓",icon:"🎯"},{main:"Accents at end = Past tense",sub:"Hablé = I spoke. Comió = he ate. Fue = he was/went. If you see an accent at the END of a verb, something HAPPENED.",icon:"⏮️"},{main:"Voy a = 'Going to'",sub:"The simplest future: Voy a + verb. Voy a comer = I'm going to eat. Start with this for months.",icon:"⏭️"},{main:"Ser vs Estar (both = 'to be')",sub:"Ser = permanent: Soy alto. Estar = temporary: Estoy cansado. Will it change? Yes → Estar. No → Ser.",icon:"⭐"},{main:"Fui = was AND went",sub:"Ser and Ir are IDENTICAL in past tense! Fui = I was (ser) OR I went (ir). Context tells you which.",icon:"🤯"},{main:"-O ending always means 'I'",sub:"Any present verb ending -O = I do it. Hablo = I speak. Como = I eat. Tengo = I have.",icon:"👤"},{main:"H is always silent",sub:"Hola, huevo, hacer, hotel — H is NEVER pronounced in Spanish. Just ignore it.",icon:"🤫"},{main:"The tilde changes meaning",sub:"Sí = Yes. Si = If. Él = He. El = The. Más = More. Mas = But. That little accent changes everything.",icon:"✍️"},{main:"Colombia = no 'vosotros'",sub:"Spain uses 'vosotros' for 'you all'. Colombia just uses 'ustedes' for everyone. One less thing to learn!",icon:"🇨🇴"},{main:"Gerunds end in -ando/-iendo",sub:"Habl-ANDO = speaking. Com-IENDO = eating. Viv-IENDO = living. Use these with estar: Estoy hablando = I am speaking.",icon:"🔄"}],
};

/* v58: the next tense layer, taught as useful speaking patterns first. */
Object.assign(GRAMMAR,{
  perfecto:{label:"Present perfect",intro:"Use he/has/ha + participle for experiences or actions connected to now. It is useful for talking about what you have done during a trip or today.",trick:"Keep the helper verb short: he, has, ha, hemos, han + -ado/-ido. He comido = I have eaten.",tables:[{title:"Haber + participle",sub:"he / has / ha / hemos / han + -ado or -ido",rows:[{pro:"Yo",verb:"he hablado",en:"I have spoken",tts:"yo he hablado"},{pro:"Tú",verb:"has comido",en:"you have eaten",tts:"tú has comido"},{pro:"Él/Ella/Ud.",verb:"ha ido",en:"he/she has gone",tts:"él ha ido"},{pro:"Nosotros",verb:"hemos visto",en:"we have seen",tts:"nosotros hemos visto"},{pro:"Ellos/Uds.",verb:"han llegado",en:"they have arrived",tts:"ellos han llegado"}]}],examples:[{es:"He practicado español esta semana.",en:"I have practiced Spanish this week.",tts:"He practicado español esta semana."},{es:"¿Has probado la arepa?",en:"Have you tried arepa?",tts:"¿Has probado la arepa?"},{es:"Ya hemos llegado al hotel.",en:"We have already arrived at the hotel.",tts:"Ya hemos llegado al hotel."}]},
  condicional:{label:"Conditional",intro:"Use the conditional for polite requests, possibilities, and imagined situations. These forms are especially useful for sounding natural and respectful.",trick:"Keep the infinitive and add: -ía, -ías, -ía, -íamos, -ían. Me gustaría and podría are high-value chunks.",tables:[{title:"Useful conditional forms",sub:"infinitive + -ía endings",rows:[{pro:"Yo",verb:"me gustaría",en:"I would like",tts:"me gustaría"},{pro:"Tú",verb:"podrías",en:"you could",tts:"tú podrías"},{pro:"Él/Ella/Ud.",verb:"debería",en:"he/she should",tts:"él debería"},{pro:"Nosotros",verb:"iríamos",en:"we would go",tts:"nosotros iríamos"},{pro:"Ellos/Uds.",verb:"tendrían",en:"they would have",tts:"ellos tendrían"}]}],examples:[{es:"Me gustaría pedir una mesa.",en:"I would like to order a table.",tts:"Me gustaría pedir una mesa."},{es:"¿Podría repetir, por favor?",en:"Could you repeat, please?",tts:"¿Podría repetir, por favor?"},{es:"Deberíamos salir temprano.",en:"We should leave early.",tts:"Deberíamos salir temprano."}]},
  "pasado-perfecto":{label:"Past perfect",intro:"Use había + participle for something that had already happened before another past event. Learn it after the preterite and imperfect contrast.",trick:"Put the earlier event in the background with había: Cuando llegué, ya había salido.",tables:[{title:"Había + participle",sub:"había / habías / había / habíamos / habían + -ado or -ido",rows:[{pro:"Yo",verb:"había hablado",en:"I had spoken",tts:"yo había hablado"},{pro:"Tú",verb:"habías comido",en:"you had eaten",tts:"tú habías comido"},{pro:"Él/Ella/Ud.",verb:"había salido",en:"he/she had left",tts:"él había salido"},{pro:"Nosotros",verb:"habíamos visto",en:"we had seen",tts:"nosotros habíamos visto"},{pro:"Ellos/Uds.",verb:"habían llegado",en:"they had arrived",tts:"ellos habían llegado"}]}],examples:[{es:"Cuando llegué, ya habían cerrado.",en:"When I arrived, they had already closed.",tts:"Cuando llegué, ya habían cerrado."},{es:"Nunca había usado esa aplicación.",en:"I had never used that app.",tts:"Nunca había usado esa aplicación."},{es:"Ya había comido cuando me llamaste.",en:"I had already eaten when you called me.",tts:"Ya había comido cuando me llamaste."}]},
  "futuro-perfecto":{label:"Future perfect",intro:"Use habré + participle for something that will have happened by a future point. This is advanced; recognize it before trying to produce it quickly.",trick:"Think: by then, I will have… Habré llegado = I will have arrived.",tables:[{title:"Habré + participle",sub:"habré / habrás / habrá / habremos / habrán + -ado or -ido",rows:[{pro:"Yo",verb:"habré llegado",en:"I will have arrived",tts:"yo habré llegado"},{pro:"Tú",verb:"habrás terminado",en:"you will have finished",tts:"tú habrás terminado"},{pro:"Él/Ella/Ud.",verb:"habrá salido",en:"he/she will have left",tts:"él habrá salido"},{pro:"Nosotros",verb:"habremos comido",en:"we will have eaten",tts:"nosotros habremos comido"},{pro:"Ellos/Uds.",verb:"habrán llegado",en:"they will have arrived",tts:"ellos habrán llegado"}]}],examples:[{es:"Para las ocho, habré terminado.",en:"By eight, I will have finished.",tts:"Para las ocho, habré terminado."},{es:"Cuando llegues, ya habremos salido.",en:"When you arrive, we will have already left.",tts:"Cuando llegues, ya habremos salido."},{es:"En un año, habré aprendido mucho.",en:"In a year, I will have learned a lot.",tts:"En un año, habré aprendido mucho."}]}
});

const V58_SPEAKING_GUIDE=[
  {id:"perfecto",title:"Present perfect for recent experience",formula:"he / has / ha + participle",explain:"Use this for experiences or actions connected to now. In daily speech, learn it as a complete chunk instead of memorizing every rule first.",examples:[{es:"He practicado esta semana.",en:"I have practiced this week.",tts:"He practicado esta semana."},{es:"¿Has probado la arepa?",en:"Have you tried arepa?",tts:"¿Has probado la arepa?"}],mistake:"Do not use the English word 'have' by itself. Spanish needs the correct form of haber: he, has, ha, hemos, han.",exercise:"Say one thing you have done today and ask someone ¿Has...?"},
  {id:"condicional",title:"Polite requests and possibilities",formula:"infinitive + -ía",explain:"The conditional helps you ask politely and talk about possibilities. Me gustaría and podría are more useful at first than a full table.",examples:[{es:"Me gustaría pedir una mesa.",en:"I would like to order a table.",tts:"Me gustaría pedir una mesa."},{es:"¿Podría repetir, por favor?",en:"Could you repeat, please?",tts:"¿Podría repetir, por favor?"}],mistake:"Keep the infinitive before the ending: gustaría, podría, debería. Do not remove the whole verb stem.",exercise:"Make one polite request with Me gustaría and one with ¿Podría...?"},
  {id:"pasado-perfecto",title:"Had already happened",formula:"había + participle",explain:"Use this to place an earlier action before another past event. It is useful for telling clearer stories, but it comes after the basic past contrast.",examples:[{es:"Cuando llegué, ya habían cerrado.",en:"When I arrived, they had already closed.",tts:"Cuando llegué, ya habían cerrado."},{es:"Ya había comido cuando me llamaste.",en:"I had already eaten when you called me.",tts:"Ya había comido cuando me llamaste."}],mistake:"Do not use this for every past sentence. Use it only when one past action happened before another.",exercise:"Tell what had already happened before you arrived somewhere."},
  {id:"futuro-perfecto",title:"Will have happened",formula:"habré + participle",explain:"This is an advanced recognition pattern. Learn to understand it first; you can produce it later when the simpler future forms feel automatic.",examples:[{es:"Para las ocho, habré terminado.",en:"By eight, I will have finished.",tts:"Para las ocho, habré terminado."},{es:"En un año, habré aprendido mucho.",en:"In a year, I will have learned a lot.",tts:"En un año, habré aprendido mucho."}],mistake:"Do not confuse habré with the simple future of the main verb. Habré terminado means I will have finished.",exercise:"Recognize one future-perfect sentence and explain what will be completed by then."}
];

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
  {inf:"llamarse",en:"to be called (name)",forms:[{p:"Yo",v:"me llamo",e:"I am called / my name is"},{p:"Tú",v:"te llamas",e:"you are called"},{p:"Él/Ella/Ud.",v:"se llama",e:"he/she is called"},{p:"Nosotros",v:"nos llamamos",e:"we are called"},{p:"Ellos/Uds.",v:"se llaman",e:"they are called"}],example:{es:"Me llamo David. ¿Cómo te llamas?",en:"My name is David. What's your name?"}},
  {inf:"levantarse",en:"to get up / to stand up",forms:[{p:"Yo",v:"me levanto",e:"I get up"},{p:"Tú",v:"te levantas",e:"you get up"},{p:"Él/Ella/Ud.",v:"se levanta",e:"he/she gets up"},{p:"Nosotros",v:"nos levantamos",e:"we get up"},{p:"Ellos/Uds.",v:"se levantan",e:"they get up"}],example:{es:"Me levanto a las seis.",en:"I get up at six o'clock."}},
  {inf:"sentarse",en:"to sit down",forms:[{p:"Yo",v:"me siento",e:"I sit down"},{p:"Tú",v:"te sientas",e:"you sit down"},{p:"Él/Ella/Ud.",v:"se sienta",e:"he/she sits down"},{p:"Nosotros",v:"nos sentamos",e:"we sit down"},{p:"Ellos/Uds.",v:"se sientan",e:"they sit down"}],example:{es:"¿Puedo sentarme aquí?",en:"Can I sit here?"}},
  {inf:"irse",en:"to leave / to go away",forms:[{p:"Yo",v:"me voy",e:"I'm leaving"},{p:"Tú",v:"te vas",e:"you're leaving"},{p:"Él/Ella/Ud.",v:"se va",e:"he/she is leaving"},{p:"Nosotros",v:"nos vamos",e:"we're leaving"},{p:"Ellos/Uds.",v:"se van",e:"they're leaving"}],example:{es:"¡Me voy! Hasta mañana.",en:"I'm leaving! See you tomorrow."}},
  {inf:"sentirse",en:"to feel (emotion/physical)",forms:[{p:"Yo",v:"me siento",e:"I feel"},{p:"Tú",v:"te sientes",e:"you feel"},{p:"Él/Ella/Ud.",v:"se siente",e:"he/she feels"},{p:"Nosotros",v:"nos sentimos",e:"we feel"},{p:"Ellos/Uds.",v:"se sienten",e:"they feel"}],example:{es:"Me siento muy bien hoy.",en:"I feel very well today."}},
  {inf:"despertarse",en:"to wake up",forms:[{p:"Yo",v:"me despierto",e:"I wake up"},{p:"Tú",v:"te despiertas",e:"you wake up"},{p:"Él/Ella/Ud.",v:"se despierta",e:"he/she wakes up"},{p:"Nosotros",v:"nos despertamos",e:"we wake up"},{p:"Ellos/Uds.",v:"se despiertan",e:"they wake up"}],example:{es:"Me despierto temprano en Colombia.",en:"I wake up early in Colombia."}},
];


/* v36: simple explanations for turning words into sentences.  These are
   rendered in Gramática and their examples are added to the quiz pool. */
const SPEAKING_GUIDE=[
  {id:"estructura",title:"Subject + verb + object",formula:"Subject + verb + object",explain:"Spanish can use the same basic order as English, but the subject is often optional.",examples:[{es:"Yo necesito ayuda.",en:"I need help.",tts:"Yo necesito ayuda."},{es:"Necesito ayuda.",en:"I need help. (the subject is understood)",tts:"Necesito ayuda."}],mistake:"Do not force Yo into every sentence; the verb ending often already tells us who is speaking.",exercise:"Say three sentences beginning with Necesito, Quiero, and Puedo."},
  {id:"sujeto-omitido",title:"Why Spanish omits the subject",formula:"Hablo = I speak · Hablas = you speak",explain:"Verb endings carry information. Native speakers add yo, tú, or él when they want emphasis or clarity.",examples:[{es:"Vivo en Bogotá.",en:"I live in Bogotá.",tts:"Vivo en Bogotá."},{es:"Yo vivo en Bogotá, pero ella vive en Cali.",en:"I live in Bogotá, but she lives in Cali.",tts:"Yo vivo en Bogotá, pero ella vive en Cali."}],mistake:"English needs the subject more often; Spanish does not.",exercise:"Answer ¿Dónde vives? with Vivo en... instead of Yo vivo..."},
  {id:"presente",title:"Present-tense endings",formula:"AR: -o, -as, -a · ER/IR: -o, -es, -e",explain:"Remove -ar, -er, or -ir and add the ending that matches the person. Start with the useful yo -o ending.",examples:[{es:"Hablo un poco de español.",en:"I speak a little Spanish.",tts:"Hablo un poco de español."},{es:"¿Qué haces hoy?",en:"What are you doing today?",tts:"¿Qué haces hoy?"}],mistake:"The infinitive is not the sentence: quiero hablar, but yo hablo.",exercise:"Say what you do today with Trabajo, Vivo, Tengo, and Quiero."},
  {id:"futuro",title:"Near future with voy a",formula:"Voy / vas / va / vamos / van + a + infinitive",explain:"This is the easiest everyday future. Keep the second verb in its infinitive form.",examples:[{es:"Voy a practicar esta noche.",en:"I am going to practice tonight.",tts:"Voy a practicar esta noche."},{es:"¿Qué vas a hacer mañana?",en:"What are you going to do tomorrow?",tts:"¿Qué vas a hacer mañana?"}],mistake:"Do not conjugate the second verb: voy a hablar, not voy a hablo.",exercise:"Say three plans beginning with Voy a..."},
  {id:"pasado",title:"Completed past actions",formula:"Ayer + completed verb",explain:"Use the past to tell what happened. Common first-person endings are -é for AR verbs and -í for ER/IR verbs; memorize high-frequency irregulars like fui, hice, and tuve.",examples:[{es:"Ayer fui al mercado.",en:"Yesterday I went to the market.",tts:"Ayer fui al mercado."},{es:"Comí una arepa y tomé un tinto.",en:"I ate an arepa and had a coffee.",tts:"Comí una arepa y tomé un tinto."}],mistake:"Fui means I went or I was; the rest of the sentence gives the context.",exercise:"Tell one short story with Ayer fui..., después..., y al final..."},
  {id:"negativas-preguntas",title:"Negatives and questions",formula:"No + verb · question words + sentence",explain:"Put no directly before the conjugated verb. Questions can keep normal word order; your voice and question marks do the work.",examples:[{es:"No entiendo.",en:"I don't understand.",tts:"No entiendo."},{es:"¿Dónde queda la farmacia?",en:"Where is the pharmacy?",tts:"¿Dónde queda la farmacia?"}],mistake:"Do not add do/does: ¿Hablas español? means Do you speak Spanish?",exercise:"Turn Entiendo un poco into a negative and then ask ¿Entiendes?"},
  {id:"acuerdo",title:"Gender and number agreement",formula:"el/la + noun · adjective matches noun",explain:"Nouns and adjectives often show masculine/feminine and singular/plural. Learn the article with the noun.",examples:[{es:"La dirección correcta.",en:"The correct address.",tts:"La dirección correcta."},{es:"Los edificios altos.",en:"The tall buildings.",tts:"Los edificios altos."}],mistake:"The adjective is not always masculine; follow the noun.",exercise:"Say el edificio alto and la entrada correcta."},
  {id:"ser-estar",title:"Ser vs. estar",formula:"Ser = identity · estar = state/location",explain:"Use ser for identity, origin, and description; use estar for temporary states and location.",examples:[{es:"Soy de Estados Unidos.",en:"I am from the United States.",tts:"Soy de Estados Unidos."},{es:"Estoy cansado y estoy en el hotel.",en:"I am tired and I am at the hotel.",tts:"Estoy cansado y estoy en el hotel."}],mistake:"Location normally uses estar: El hotel está al frente.",exercise:"Say where you are and how you feel with Estoy..."},
  {id:"hay",title:"Hay vs. está / están",formula:"Hay = there is/are · está/están = is/are located",explain:"Use hay to introduce that something exists. Use está or están for the location of a known thing.",examples:[{es:"Hay una farmacia cerca.",en:"There is a pharmacy nearby.",tts:"Hay una farmacia cerca."},{es:"La farmacia está al frente.",en:"The pharmacy is across the way.",tts:"La farmacia está al frente."}],mistake:"Hay does not change for singular or plural.",exercise:"Say There is a hotel and The hotel is behind the building."},
  {id:"gustar",title:"Gustar sentence structure",formula:"Me gusta + singular · Me gustan + plural",explain:"The thing you like is grammatically the subject. Me means to me; gusta agrees with the thing, not with you.",examples:[{es:"Me gusta la música.",en:"I like music.",tts:"Me gusta la música."},{es:"Me gustan las arepas.",en:"I like arepas.",tts:"Me gustan las arepas."}],mistake:"Do not say Yo gusto la música for I like music.",exercise:"Say one thing you like and two things you like."},
  {id:"pronombres",title:"lo, la, le, se lo",formula:"lo/la = thing · le = to someone · se lo = it to someone",explain:"Object pronouns make speech shorter and more natural. Put them before a conjugated verb; with an infinitive they can attach to the end.",examples:[{es:"Lo tengo aquí.",en:"I have it here. (masculine)",tts:"Lo tengo aquí."},{es:"Se lo voy a mandar.",en:"I am going to send it to him/her.",tts:"Se lo voy a mandar."},{es:"Voy a verlo.",en:"I am going to see it.",tts:"Voy a verlo."}],mistake:"The combination le lo changes to se lo: never le lo.",exercise:"Replace el documento in Tengo el documento with lo."},
  {id:"conectores",title:"Connectors make speech flow",formula:"Idea 1 + connector + idea 2",explain:"Use connectors to join short sentences into a natural thought instead of stopping after every phrase.",examples:[{es:"Quería salir, pero tuve que trabajar.",en:"I wanted to go out, but I had to work.",tts:"Quería salir, pero tuve que trabajar."},{es:"Había trancón, así que llegué tarde.",en:"There was traffic, so I arrived late.",tts:"Había trancón, así que llegué tarde."},{es:"Si puedo, te aviso.",en:"If I can, I will let you know.",tts:"Si puedo, te aviso."}],mistake:"si means if; sí means yes. porque means because; ¿por qué? means why.",exercise:"Join two ideas with pero, porque, entonces, and así que."},
  {id:"por-para",title:"Por vs. para",formula:"para = purpose/destination · por = reason/route/exchange",explain:"Use para when you mean for a purpose, a recipient, or a destination. Use por for a reason, a route, an amount of time, or an exchange.",examples:[{es:"Voy para el hotel.",en:"I'm headed to the hotel.",tts:"Voy para el hotel."},{es:"Estudio español para hablar con la gente.",en:"I study Spanish in order to speak with people.",tts:"Estudio español para hablar con la gente."},{es:"Gracias por la ayuda.",en:"Thanks for the help.",tts:"Gracias por la ayuda."}],mistake:"Do not translate every English 'for' the same way. Ask: purpose/destination (para) or reason/route/exchange (por)?",exercise:"Say one destination with para and one reason with por."},
  {id:"ir-venir",title:"Ir, venir, llevar, traer",formula:"ir = go · venir = come · llevar = take/bring there · traer = bring here",explain:"The direction is from the speaker's point of view. Use venir/traer when something moves toward the place or person you are talking about; use ir/llevar when it moves away.",examples:[{es:"Voy para tu casa.",en:"I'm going to your house.",tts:"Voy para tu casa."},{es:"¿Vienes a la reunión?",en:"Are you coming to the meeting?",tts:"¿Vienes a la reunión?"},{es:"Te llevo el documento.",en:"I'll take/bring the document to you there.",tts:"Te llevo el documento."},{es:"Tráeme un tinto, por favor.",en:"Bring me a black coffee, please.",tts:"Tráeme un tinto, por favor."}],mistake:"Choose the verb based on direction, not only on the English word 'bring' or 'take'.",exercise:"Say where you are going, what you are taking, and what someone should bring you."},
  {id:"se-me",title:"Se me... for things that happened to you",formula:"Se me + verb + thing",explain:"This very common pattern presents an event as something that happened to you, often accidentally or unexpectedly. It sounds natural in phrases like Se me olvidó.",examples:[{es:"Se me olvidó la dirección.",en:"I forgot the address.",tts:"Se me olvidó la dirección."},{es:"Se me dañó el celular.",en:"My cell phone broke on me.",tts:"Se me dañó el celular."},{es:"Se me quedó la billetera en el carro.",en:"I left my wallet in the car.",tts:"Se me quedó la billetera en el carro."}],mistake:"Do not force a literal 'I forgot' structure. In conversation, Se me olvidó... is a useful natural chunk.",exercise:"Say three problems beginning with Se me..."},
  {id:"quedar",title:"Quedar for location and plans",formula:"¿Dónde queda...? · Nos vemos / quedamos...",explain:"Use quedar to ask where a place is and to talk about arranging a meeting. It is one of the most useful verbs for getting around and making plans.",examples:[{es:"¿Dónde queda la farmacia?",en:"Where is the pharmacy located?",tts:"¿Dónde queda la farmacia?"},{es:"¿A qué hora quedamos?",en:"What time shall we meet?",tts:"¿A qué hora quedamos?"},{es:"Nos vemos a las siete.",en:"See you at seven.",tts:"Nos vemos a las siete."}],mistake:"For a known object's current location, use está; for asking where a place is located, ¿Dónde queda...? is very natural.",exercise:"Ask where the hotel is and arrange a time to meet."}
];
SPEAKING_GUIDE.push(
  {id:"pasado-contraste",title:"Preterite vs. imperfect",formula:"event = preterite · background/habit = imperfect",explain:"Use the preterite for a completed event that moves the story forward. Use the imperfect for what was happening, what used to happen, or the setting.",examples:[{es:"Ayer fui al mercado.",en:"Yesterday I went to the market.",tts:"Ayer fui al mercado."},{es:"Cuando era niño, vivía en Cali.",en:"When I was a child, I used to live in Cali.",tts:"Cuando era niño, vivía en Cali."},{es:"Mientras trabajaba, sonó el teléfono.",en:"While I was working, the phone rang.",tts:"Mientras trabajaba, sonó el teléfono."}],mistake:"Do not choose only by translating was. Ask whether you are describing the background (era/estaba/iba) or a completed event (fui/sonó).",exercise:"Tell a two-sentence story: set the scene with estaba or era, then say what happened with fui or llegó."},
  {id:"subjuntivo",title:"Wishes and recommendations",formula:"trigger + que + new subject + subjunctive",explain:"Use this high-value pattern after quiero que, espero que, es importante que, and similar expressions when another person is doing the action.",examples:[{es:"Quiero que vengas mañana.",en:"I want you to come tomorrow.",tts:"Quiero que vengas mañana."},{es:"Espero que estés bien.",en:"I hope you are well.",tts:"Espero que estés bien."},{es:"Es importante que hables despacio.",en:"It is important that you speak slowly.",tts:"Es importante que hables despacio."}],mistake:"If the subject stays the same, use the infinitive: Quiero hablar. If the subject changes, use que + subjunctive: Quiero que hables.",exercise:"Say one wish with Quiero que..., one hope with Espero que..., and one recommendation with Es importante que..."}
);
SPEAKING_GUIDE.push(...V58_SPEAKING_GUIDE);

/* v60: high-frequency production patterns. Teach the useful chunk first;
   explain the grammar only after the learner has said it. */
SPEAKING_GUIDE.push(
  {id:"gerundios",title:"Actions in progress",formula:"estar + gerundio",explain:"Use estar + -ando/-iendo for an action happening now or in progress. English -ing does not always use this form: Fui de compras means I went shopping, not I went being shopping.",examples:[{es:"Estoy cocinando la cena.",en:"I am cooking dinner.",tts:"Estoy cocinando la cena."},{es:"Estoy buscando la dirección.",en:"I am looking for the address.",tts:"Estoy buscando la dirección."},{es:"Estaba trabajando cuando llamaste.",en:"I was working when you called.",tts:"Estaba trabajando cuando llamaste."}],mistake:"Do not use estar + gerundio for every English -ing idea. Use fui de compras, me gusta cocinar, or voy a tomar depending on the meaning.",exercise:"Say what you are doing now, what you were doing earlier, and one activity you went to do."},
  {id:"mandatos",title:"Useful commands and repair",formula:"habla / hable · dime / dígame",explain:"Commands let you ask for a practical action quickly. Use the informal form with a close friend and the formal usted form with a driver, employee, stranger, or older person.",examples:[{es:"Háblame más despacio.",en:"Speak to me more slowly. (informal)",tts:"Háblame más despacio."},{es:"Hábleme más despacio, por favor.",en:"Speak to me more slowly, please. (formal)",tts:"Hábleme más despacio, por favor."},{es:"Discúlpeme, ¿me puede repetir?",en:"Excuse me, can you repeat that for me? (formal)",tts:"Discúlpeme, ¿me puede repetir?"}],mistake:"Do not say discúlpe or discúplte. Say disculpa with a friend, disculpe to one person formally, and discúlpeme when you mean excuse me / excuse me for interrupting.",exercise:"Ask a friend to listen, then ask a driver to repeat the address more slowly."}
);

/* ═══════════════════════════════════════════════════════════════════════════
   Lesson Player Content (v15) — speaking-first
   goal: the sentence you'll be able to SAY at the end
   words: key chunks (tap to hear) · phrases: production cards (EN shown → you say it in Spanish, tap to check)
   ═══════════════════════════════════════════════════════════════════════════ */
const LESSON_CONTENT={
  presentate:{goal:{es:"Hola, ¿cómo estás? Me llamo Seth, soy de Estados Unidos y vivo en Colombia.",en:"Hi, how are you? My name is Seth, I'm from the U.S. and I live in Colombia."},
    words:[{es:"¿Cómo estás?",en:"How are you?"},{es:"Estoy bien, gracias.",en:"I'm fine, thank you."},{es:"Me llamo...",en:"My name is..."},{es:"Soy de...",en:"I'm from..."},{es:"Vivo en...",en:"I live in..."},{es:"Mucho gusto",en:"Nice to meet you"},{es:"¿Cómo te llamas?",en:"What's your name?"},{es:"¿De dónde eres?",en:"Where are you from?"},{es:"No entendí.",en:"I didn't understand."}],
    phrases:[{en:"How are you?",es:"¿Cómo estás?"},{en:"I'm fine, thank you.",es:"Estoy bien, gracias."},{en:"My name is Ana.",es:"Me llamo Ana."},{en:"I'm from the United States.",es:"Soy de Estados Unidos."},{en:"I live in Bogotá.",es:"Vivo en Bogotá."},{en:"Nice to meet you!",es:"¡Mucho gusto!"},{en:"I didn't understand. Can you repeat, please?",es:"No entendí. ¿Puede repetir, por favor?"}]},
  plata:{goal:{es:"¿Cuánto cuesta? — Son veinte mil pesos.",en:"How much is it? — It's twenty thousand pesos."},
    words:[{es:"La plata",en:"Money (Colombian!)"},{es:"¿Cuánto cuesta?",en:"How much does it cost?"},{es:"Mil pesos",en:"A thousand pesos"},{es:"El cambio",en:"Change"},{es:"En efectivo",en:"In cash"},{es:"Caro / Barato",en:"Expensive / Cheap"}],
    phrases:[{en:"How much does it cost?",es:"¿Cuánto cuesta?"},{en:"It's ten thousand pesos.",es:"Son diez mil pesos."},{en:"Do you have change?",es:"¿Tiene cambio?"},{en:"It's very expensive!",es:"¡Está muy caro!"}]},
  trabajo:{goal:{es:"Trabajo como ingeniero y tengo una reunión hoy.",en:"I work as an engineer and I have a meeting today."},
    words:[{es:"El trabajo",en:"Work / Job"},{es:"La reunión",en:"Meeting"},{es:"El cliente",en:"Client"},{es:"El jefe",en:"Boss"},{es:"El correo",en:"Email"},{es:"La oficina",en:"Office"}],
    phrases:[{en:"What do you do for work?",es:"¿En qué trabajas?"},{en:"I work as an engineer.",es:"Trabajo como ingeniero."},{en:"I have a meeting today.",es:"Tengo una reunión hoy."},{en:"I like my job.",es:"Me gusta mi trabajo."}]},
  casa:{goal:{es:"La toalla está en la habitación, sobre la cama.",en:"The towel is in the bedroom, on the bed."},
    words:[{es:"La cama",en:"Bed"},{es:"La almohada",en:"Pillow"},{es:"La cobija",en:"Blanket (Colombian!)"},{es:"La ducha",en:"Shower"},{es:"La toalla",en:"Towel"},{es:"El clóset",en:"Closet"}],
    phrases:[{en:"Where is the towel?",es:"¿Dónde está la toalla?"},{en:"It's on the bed.",es:"Está sobre la cama."},{en:"I need a pillow.",es:"Necesito una almohada."},{en:"The soap is in the shower.",es:"El jabón está en la ducha."}]},
  calle:{goal:{es:"Siga derecho y gire a la derecha en el semáforo.",en:"Go straight and turn right at the traffic light."},
    words:[{es:"La derecha",en:"Right"},{es:"La izquierda",en:"Left"},{es:"La esquina",en:"Corner"},{es:"El semáforo",en:"Traffic light"},{es:"Queda cerca",en:"It's nearby"},{es:"Queda lejos",en:"It's far"}],
    phrases:[{en:"Where is the bank?",es:"¿Dónde queda el banco?"},{en:"Go straight.",es:"Siga derecho."},{en:"Turn left at the corner.",es:"Gire a la izquierda en la esquina."},{en:"Is it nearby?",es:"¿Queda cerca?"}]},
  cocina:{goal:{es:"Voy a cortar las verduras y tú calientas la olla.",en:"I'll cut the vegetables and you heat the pot."},
    words:[{es:"El cuchillo",en:"Knife"},{es:"La olla",en:"Pot"},{es:"La sartén",en:"Pan"},{es:"Cortar",en:"To cut"},{es:"Hervir",en:"To boil"},{es:"La nevera",en:"Fridge (Colombian!)"}],
    phrases:[{en:"Where is the knife?",es:"¿Dónde está el cuchillo?"},{en:"I'm going to cut the onion.",es:"Voy a cortar la cebolla."},{en:"The pot is on the stove.",es:"La olla está en la estufa."},{en:"It's delicious!",es:"¡Está delicioso!"}]},
  gustos:{goal:{es:"Me gusta cocinar y pasar tiempo con mi familia.",en:"I like cooking and spending time with my family."},
    words:[{es:"Me gusta...",en:"I like..."},{es:"Me encanta...",en:"I love..."},{es:"La familia",en:"Family"},{es:"Los hermanos",en:"Siblings"},{es:"Mi favorito/a",en:"My favorite"},{es:"Odio...",en:"I hate..."}],
    phrases:[{en:"I like music.",es:"Me gusta la música."},{en:"I love traveling.",es:"Me encanta viajar."},{en:"Do you have siblings?",es:"¿Tienes hermanos?"},{en:"I love them a lot.",es:"Los quiero mucho."}]},
  planes:{goal:{es:"¿Nos vemos mañana? — ¡De una! Te escribo.",en:"Shall we meet tomorrow? — I'm in! I'll text you."},
    words:[{es:"Mañana",en:"Tomorrow"},{es:"El celular",en:"Cell phone (Colombian!)"},{es:"El mensaje",en:"Message"},{es:"La llamada",en:"Call"},{es:"¿Aló?",en:"Hello? (phone, Colombian!)"},{es:"De pronto",en:"Maybe (Colombian!)"}],
    phrases:[{en:"Shall we meet tomorrow?",es:"¿Nos vemos mañana?"},{en:"I'll call you later.",es:"Te llamo más tarde."},{en:"Send me the location.",es:"Mándame la ubicación."},{en:"I'm in!",es:"¡De una!"}]},
  sentirse:{goal:{es:"Me duele la cabeza y tengo sueño.",en:"My head hurts and I'm sleepy."},
    words:[{es:"Cansado/a",en:"Tired"},{es:"Feliz",en:"Happy"},{es:"Tengo hambre",en:"I'm hungry"},{es:"Tengo sueño",en:"I'm sleepy"},{es:"Me duele...",en:"...hurts"},{es:"Enfermo/a",en:"Sick"}],
    phrases:[{en:"How do you feel?",es:"¿Cómo te sientes?"},{en:"I'm hungry.",es:"Tengo hambre."},{en:"My head hurts.",es:"Me duele la cabeza."},{en:"I need to rest.",es:"Necesito descansar."}]},
  colombia:{goal:{es:"¿Qué más, parce? — Todo bien, ¡qué bacano verte!",en:"What's up, buddy? — All good, so cool to see you!"},
    words:[{es:"Parce",en:"Buddy (Colombian!)"},{es:"Chévere",en:"Cool"},{es:"Bacano",en:"Awesome (Colombian!)"},{es:"El tinto",en:"Black coffee (Colombian!)"},{es:"La plata",en:"Money (Colombian!)"},{es:"¿Qué más?",en:"What's up? (Colombian!)"}],
    phrases:[{en:"What's up, buddy?",es:"¿Qué más, parce?"},{en:"How cool!",es:"¡Qué bacano!"},{en:"Can I have a coffee?",es:"¿Me regala un tinto?"},{en:"OK, got it.",es:"Listo."}]},
  "gram-presente":{goal:{es:"Hablo español todos los días y vivo en Colombia.",en:"I speak Spanish every day and I live in Colombia."},
    words:[{es:"Hablo",en:"I speak"},{es:"Vivo",en:"I live"},{es:"Tengo",en:"I have"},{es:"Soy",en:"I am (identity)"},{es:"Estoy",en:"I am (state/location)"},{es:"Me gusta",en:"I like"}],
    phrases:[{en:"I speak a little Spanish.",es:"Hablo un poco de español."},{en:"I live in Colombia.",es:"Vivo en Colombia."},{en:"I have a question.",es:"Tengo una pregunta."},{en:"I like Colombian food.",es:"Me gusta la comida colombiana."}]},
  "gram-futuro":{goal:{es:"Mañana voy a practicar español y voy a hablar con un colombiano.",en:"Tomorrow I am going to practice Spanish and talk with a Colombian."},
    words:[{es:"Voy a...",en:"I am going to..."},{es:"Vas a...",en:"You are going to..."},{es:"Vamos a...",en:"We are going to..."},{es:"Mañana",en:"Tomorrow"},{es:"Después",en:"Later / afterward"},{es:"Te voy a llamar",en:"I am going to call you"}],
    phrases:[{en:"I am going to study tonight.",es:"Voy a estudiar esta noche."},{en:"What are you going to do tomorrow?",es:"¿Qué vas a hacer mañana?"},{en:"We are going to go out after work.",es:"Vamos a salir después del trabajo."},{en:"I am going to call you later.",es:"Te voy a llamar más tarde."}]},
  "gram-pasado":{goal:{es:"Ayer fui al mercado y compré comida.",en:"Yesterday I went to the market and bought food."},
    words:[{es:"Ayer",en:"Yesterday"},{es:"Fui",en:"I went / I was"},{es:"Hice",en:"I did / made"},{es:"Tuve",en:"I had"},{es:"Comí",en:"I ate"},{es:"Hablé",en:"I spoke"}],
    phrases:[{en:"Yesterday I went to the market.",es:"Ayer fui al mercado."},{en:"I ate an arepa.",es:"Comí una arepa."},{en:"I spoke with my friend.",es:"Hablé con mi amigo."},{en:"What did you do yesterday?",es:"¿Qué hiciste ayer?"}]},
  "gram-pronombres":{goal:{es:"¿Me lo puede repetir? — Sí, se lo repito despacio.",en:"Can you repeat it for me? — Yes, I will repeat it slowly."},
    words:[{es:"lo",en:"him / it (masculine)"},{es:"la",en:"her / it (feminine)"},{es:"le",en:"to him / to her"},{es:"me lo",en:"it to me (masculine)"},{es:"se lo",en:"it to him/her"},{es:"me la",en:"it to me (feminine)"},{es:"se la",en:"it to him/her (feminine)"},{es:"lo necesito",en:"I need it (masculine)"}],
    phrases:[{en:"Do you have the address? — Yes, I have it here.",es:"¿Tiene la dirección? — Sí, la tengo aquí."},{en:"Can you help me? — Yes, I will help you.",es:"¿Me puede ayudar? — Sí, le ayudo."},{en:"Can you repeat it for me? — Yes, I will repeat it slowly.",es:"¿Me lo puede repetir? — Sí, se lo repito despacio."},{en:"Can you send it to me? — Yes, I will send it.",es:"¿Me la puede mandar? — Sí, se la mando."},{en:"Do you have the document? — Yes, I have it.",es:"¿Tiene el documento? — Sí, lo tengo."},{en:"Did you send her the location? — Yes, I sent it to her.",es:"¿Le mandaste la ubicación? — Sí, se la mandé."}]},
 };

 /* Conversation foundations and Colombian slang are separate lesson content so
    the existing lesson player can reuse the same speaking-first steps. */
 Object.assign(LESSON_CONTENT,{
   "gram-pasado-historia":{goal:{es:"Fui al mercado, pero después estaba en casa.",en:"I went to the market, but afterward I was at home."},
     words:[{es:"Fui a...",en:"I went to..."},{es:"Estuve en...",en:"I was / stayed in..."},{es:"Estaba en...",en:"I was in / at..."},{es:"Era...",en:"I was... (identity / description)"},{es:"Iba a...",en:"I was going to..."},{es:"Tenía que...",en:"I had to..."}],
     phrases:[{en:"I went to the market.",es:"Fui al mercado."},{en:"I was at the office.",es:"Estaba en la oficina."},{en:"I was going to cook.",es:"Iba a cocinar."},{en:"I had to work.",es:"Tuve que trabajar."}]},
   "gram-necesidades":{goal:{es:"Quería salir, pero tuve que trabajar porque estaba ocupado.",en:"I wanted to go out, but I had to work because I was busy."},
     words:[{es:"Quería...",en:"I wanted..."},{es:"Necesitaba...",en:"I needed..."},{es:"Podía...",en:"I could..."},{es:"No podía...",en:"I couldn't..."},{es:"Tuve que...",en:"I had to..."},{es:"Porque...",en:"Because..."}],
     phrases:[{en:"I wanted to rest.",es:"Quería descansar."},{en:"I needed help.",es:"Necesitaba ayuda."},{en:"I couldn't go.",es:"No podía ir."},{en:"I had to work late.",es:"Tuve que trabajar hasta tarde."}]},
   "gram-conectores":{goal:{es:"Fui al mercado, pero estaba cerrado, entonces regresé.",en:"I went to the market, but it was closed, so I went back."},
     words:[{es:"Pero...",en:"But..."},{es:"Porque...",en:"Because..."},{es:"Entonces...",en:"So / then..."},{es:"Después...",en:"Afterward..."},{es:"También...",en:"Also..."},{es:"La verdad...",en:"The truth is..."}],
     phrases:[{en:"I was tired, but I went.",es:"Estaba cansado, pero fui."},{en:"I stayed home because it was raining.",es:"Me quedé en casa porque estaba lloviendo."},{en:"I finished work, so I went home.",es:"Terminé el trabajo, entonces me fui a casa."},{en:"I also wanted to call you.",es:"También quería llamarte."}]},
   "gram-groserias":{goal:{es:"Entiendo las groserías, pero sé cuándo no decirlas.",en:"I understand swear words, but I know when not to say them."},
     words:[{es:"¡No joda!",en:"No way! / Come on! (informal)"},{es:"Juepucha",en:"Darn! (milder euphemism)"},{es:"Gonorrea",en:"Very strong insult / intensifier"},{es:"Pirobo",en:"Strong insult: jerk / scumbag"},{es:"Marica",en:"Highly context-sensitive: dude / insult"},{es:"Hijueputa",en:"Very strong insult / exclamation"}],
     phrases:[{en:"Darn, I'm late!",es:"¡Juepucha, se me hizo tarde!"},{en:"No way!",es:"¡No joda!"},{en:"What horrible traffic! (very strong)",es:"¡Qué gonorrea de tráfico!"},{en:"I understand it, but I would not say it to a stranger.",es:"Lo entiendo, pero no se lo diría a un desconocido."}]}
 });

/* v36 lesson metadata gives each lesson a clear reason to exist and links it
   to the exact conversation, reading, mission, and grammar guide it uses. */
Object.assign(LESSON_CONTENT,{
  "survival-communication":{goal:{es:"No entendí. ¿Puede repetir más despacio, por favor?",en:"I didn't understand. Can you repeat more slowly, please?"},words:[{es:"No entendí.",en:"I didn't understand."},{es:"¿Puede repetir?",en:"Can you repeat?"},{es:"Más despacio.",en:"More slowly."},{es:"¿Qué quiere decir?",en:"What does that mean?"},{es:"Un momento.",en:"One moment."},{es:"¿Así está bien?",en:"Is it okay like this?"}],phrases:[{en:"I speak a little Spanish.",es:"Hablo poquito español."},{en:"Can you repeat, please?",es:"¿Puede repetir, por favor?"},{en:"Sorry, I am learning Spanish.",es:"Perdón, estoy aprendiendo español."}]},
  "uber-ride":{goal:{es:"Buenas, ¿usted es mi conductor? Hablo poquito español.",en:"Hi, are you my driver? I speak a little Spanish."},words:[{es:"el conductor",en:"driver"},{es:"la recogida",en:"pickup"},{es:"la dirección",en:"address"},{es:"el hotel",en:"hotel"},{es:"el trancón",en:"traffic jam (Colombian)"},{es:"súbase",en:"get in"}],phrases:[{en:"Are you my driver?",es:"¿Usted es mi conductor?"},{en:"I am going to this hotel.",es:"Voy para este hotel."},{en:"Can you speak more slowly?",es:"¿Puede hablar más despacio?"}]},
  "hotel-checkin":{goal:{es:"Tengo una reserva a nombre de Seth. ¿Dónde está el ascensor?",en:"I have a reservation under Seth's name. Where is the elevator?"},words:[{es:"la reserva",en:"reservation"},{es:"a nombre de...",en:"under the name of..."},{es:"el pasaporte",en:"passport"},{es:"la recepción",en:"front desk"},{es:"el ascensor",en:"elevator"},{es:"el desayuno",en:"breakfast"}],phrases:[{en:"I have a reservation.",es:"Tengo una reserva."},{en:"Can you show me the elevator?",es:"¿Me puede mostrar el ascensor?"},{en:"What time is breakfast?",es:"¿A qué hora es el desayuno?"}]},
  "farmacia":{goal:{es:"Me duele la cabeza desde esta mañana. ¿Cómo lo debo tomar?",en:"My head has hurt since this morning. How should I take it?"},words:[{es:"la farmacia",en:"pharmacy"},{es:"el dolor de cabeza",en:"headache"},{es:"la pastilla",en:"pill"},{es:"la fiebre",en:"fever"},{es:"la tos",en:"cough"},{es:"desde esta mañana",en:"since this morning"}],phrases:[{en:"I need something for a headache.",es:"Necesito algo para el dolor de cabeza."},{en:"How should I take it?",es:"¿Cómo lo debo tomar?"},{en:"I feel tired.",es:"Me siento cansado."}]},
  "direcciones":{goal:{es:"Siga derecho hasta la esquina y gire a la derecha.",en:"Go straight to the corner and turn right."},words:[{es:"hasta el fondo",en:"to the back / end"},{es:"al frente",en:"in front / across"},{es:"detrás de",en:"behind"},{es:"la entrada",en:"entrance"},{es:"el edificio",en:"building"},{es:"el segundo piso",en:"second floor"}],phrases:[{en:"Where is the entrance?",es:"¿Dónde está la entrada?"},{en:"It is that building over there.",es:"Es el edificio de allá."},{en:"Go up to the second floor.",es:"Suba al segundo piso."}]},
  "daily-repair":{goal:{es:"No entendí. La señal está mala, así que te escribo.",en:"I didn't understand. The signal is bad, so I will text you."},words:[{es:"¿Me escuchas?",en:"Can you hear me?"},{es:"la señal está mala",en:"the signal is bad"},{es:"se está cortando",en:"it is cutting out"},{es:"te escribo",en:"I will text you"},{es:"más tarde",en:"later"},{es:"un mensaje",en:"a message"}],phrases:[{en:"Can you hear me?",es:"¿Me escuchas?"},{en:"The call is cutting out.",es:"Se está cortando la llamada."},{en:"I will text you later.",es:"Te escribo más tarde."}]},
  "sentence-structure":{goal:{es:"Quiero aprender, así que practico un poco todos los días.",en:"I want to learn, so I practice a little every day."},words:[{es:"Quiero...",en:"I want..."},{es:"así que...",en:"so / therefore..."},{es:"porque...",en:"because..."},{es:"primero...",en:"first..."},{es:"después...",en:"afterward..."},{es:"al final...",en:"in the end..."}],phrases:[{en:"I need to practice because I want to speak.",es:"Necesito practicar porque quiero hablar."},{en:"First I listen, then I repeat.",es:"Primero escucho, después repito."},{en:"I was tired, but I practiced.",es:"Estaba cansado, pero practiqué."}]},
  "connectors-v36":{goal:{es:"Si puedo, te aviso; si no, no pasa nada.",en:"If I can, I will let you know; if not, it's okay."},words:[{es:"si",en:"if"},{es:"sí",en:"yes"},{es:"pero",en:"but"},{es:"porque",en:"because"},{es:"por qué",en:"why"},{es:"entonces",en:"so / then"},{es:"aunque",en:"although"},{es:"todavía no",en:"not yet"}],phrases:[{en:"I want to go, but I have to work.",es:"Quiero ir, pero tengo que trabajar."},{en:"Why are you late?",es:"¿Por qué llegas tarde?"},{en:"There is traffic, so I will arrive late.",es:"Hay trancón, entonces voy a llegar tarde."}]},
  "function-words":{goal:{es:"Todavía no sé; si puedo, te aviso en cuanto pueda.",en:"I don't know yet; if I can, I will let you know as soon as I can."},words:[{es:"Todavía no",en:"Not yet"},{es:"De pronto",en:"Maybe (Colombian)"},{es:"En realidad",en:"Actually"},{es:"Lo que pasa es que",en:"The thing is"},{es:"Por ahora",en:"For now"},{es:"Al rato",en:"Later (Colombian)"}],phrases:[{en:"I don't know yet.",es:"Todavía no sé."},{en:"Maybe I will call you later.",es:"De pronto te llamo al rato."},{en:"The thing is, I have to work.",es:"Lo que pasa es que tengo que trabajar."},{en:"I will let you know as soon as I can.",es:"Te aviso en cuanto pueda."}]},
  "action-chunks":{goal:{es:"Quiero ir para el hotel, pero tengo que pasar por el mercado.",en:"I want to go to the hotel, but I have to stop by the market."},words:[{es:"Quiero...",en:"I want to..."},{es:"Necesito...",en:"I need to..."},{es:"Tengo que...",en:"I have to..."},{es:"Voy para...",en:"I'm headed to..."},{es:"Estoy buscando...",en:"I'm looking for..."},{es:"Se me olvidó...",en:"I forgot..."},{es:"Me toca...",en:"I have to... / It's my turn..."}],phrases:[{en:"I want to go home.",es:"Quiero ir para la casa."},{en:"I need to find the address.",es:"Necesito encontrar la dirección."},{en:"I need to call my friend.",es:"Necesito llamar a mi amigo."},{en:"I have to call my friend.",es:"Tengo que llamar a mi amigo."},{en:"I'm going to call my friend.",es:"Voy a llamar a mi amigo."},{en:"I have to stop by the market.",es:"Tengo que pasar por el mercado."},{en:"I am looking for the hotel.",es:"Estoy buscando el hotel."},{en:"I forgot the location.",es:"Se me olvidó la ubicación."},{en:"I am on my way.",es:"Voy llegando."}]},
  "social-colombia-v36":{goal:{es:"¿Qué más? Todo bien. ¡Qué nota verte, parce!",en:"What's up? All good. How cool to see you, buddy!"},words:[{es:"¿Cómo te ha ido?",en:"How have things been?"},{es:"Hágale",en:"Go ahead / let's do it"},{es:"Qué pena",en:"Sorry / what a shame"},{es:"Qué nota",en:"How cool"},{es:"Bacano",en:"Awesome"},{es:"Parce",en:"Buddy"}],phrases:[{en:"How have things been?",es:"¿Cómo te ha ido?"},{en:"Don't worry.",es:"No se preocupe."},{en:"Let's do it.",es:"¡Hágale!"}]}
  ,"conversation-challenge":{goal:{es:"Puedo responder, pedir aclaración y mantener una conversación corta.",en:"I can respond, ask for clarification, and keep a short conversation going."},words:[{es:"No entendí.",en:"I didn't understand."},{es:"¿Puede repetir?",en:"Can you repeat?"},{es:"Voy a...",en:"I am going to..."},{es:"Ayer fui...",en:"Yesterday I went..."},{es:"Después...",en:"Afterward..."},{es:"¿Qué más?",en:"What's up?"}],phrases:[{en:"I speak a little Spanish, but I am practicing.",es:"Hablo poquito español, pero estoy practicando."},{en:"I am going to answer in Spanish.",es:"Voy a responder en español."},{en:"I did not understand, but I will try again.",es:"No entendí, pero voy a intentarlo otra vez."}]}
});
Object.assign(LESSON_CONTENT,{
  "gram-pasado-contraste":{goal:{es:"Ayer fui al mercado mientras mi hermano estaba en casa.",en:"Yesterday I went to the market while my brother was at home."},words:[{es:"Ayer fui...",en:"Yesterday I went..."},{es:"Era...",en:"I was... (identity / description)"},{es:"Estaba...",en:"I was... (state / location)"},{es:"Iba...",en:"I used to go / was going"},{es:"Mientras...",en:"While..."},{es:"De repente...",en:"Suddenly..."}],phrases:[{en:"Yesterday I went to the market.",es:"Ayer fui al mercado."},{en:"When I was a child, I used to live in Cali.",es:"Cuando era niño, vivía en Cali."},{en:"While I was cooking, you called me.",es:"Mientras cocinaba, me llamaste."},{en:"The phone rang, so I stopped working.",es:"Sonó el teléfono, entonces dejé de trabajar."}]},
  "gram-subjuntivo":{goal:{es:"Quiero que vengas y espero que estés bien.",en:"I want you to come, and I hope you are well."},words:[{es:"Quiero que...",en:"I want you to..."},{es:"Espero que...",en:"I hope that..."},{es:"Es importante que...",en:"It is important that..."},{es:"Vengas",en:"You come (subjunctive)"},{es:"Estés",en:"You are (subjunctive)"},{es:"Hables",en:"You speak (subjunctive)"}],phrases:[{en:"I want you to come tomorrow.",es:"Quiero que vengas mañana."},{en:"I hope you are well.",es:"Espero que estés bien."},{en:"It is important that you speak slowly.",es:"Es importante que hables despacio."},{en:"I want to practice so that I can speak.",es:"Quiero practicar para poder hablar."}]}
  ,"gram-perfecto":{goal:{es:"He practicado español esta semana y ya he probado la arepa.",en:"I have practiced Spanish this week and I have already tried arepa."},words:[{es:"He hecho...",en:"I have done..."},{es:"Has probado...",en:"You have tried..."},{es:"Ya he visto...",en:"I have already seen..."},{es:"Hemos llegado...",en:"We have arrived..."},{es:"Todavía no he...",en:"I have not yet..."},{es:"Nunca he...",en:"I have never..."}],phrases:[{en:"I have practiced this week.",es:"He practicado esta semana."},{en:"Have you tried the arepa?",es:"¿Has probado la arepa?"},{en:"We have already arrived.",es:"Ya hemos llegado."}]}
  ,"gram-condicional":{goal:{es:"Me gustaría pedir una mesa. ¿Podría repetir, por favor?",en:"I would like to order a table. Could you repeat, please?"},words:[{es:"Me gustaría...",en:"I would like..."},{es:"¿Podría...?",en:"Could you...?"},{es:"Podríamos...",en:"We could..."},{es:"Debería...",en:"I/you/he should..."},{es:"Sería...",en:"It would be..."},{es:"Quisiera...",en:"I would like... (polite)"}],phrases:[{en:"I would like to order a table.",es:"Me gustaría pedir una mesa."},{en:"Could you repeat, please?",es:"¿Podría repetir, por favor?"},{en:"We should leave early.",es:"Deberíamos salir temprano."}]}
  ,"gram-pasado-perfecto":{goal:{es:"Cuando llegué, ya habían cerrado la tienda.",en:"When I arrived, they had already closed the store."},words:[{es:"Ya había...",en:"I had already..."},{es:"Habías visto...",en:"You had seen..."},{es:"Había salido...",en:"He/she had left..."},{es:"Habíamos comido...",en:"We had eaten..."},{es:"Antes de que...",en:"Before..."},{es:"Cuando llegué...",en:"When I arrived..."}],phrases:[{en:"When I arrived, they had already closed.",es:"Cuando llegué, ya habían cerrado."},{en:"I had already eaten when you called.",es:"Ya había comido cuando me llamaste."},{en:"I had never used that app.",es:"Nunca había usado esa aplicación."}]}
  ,"gram-futuro-perfecto":{goal:{es:"Para las ocho, habré terminado.",en:"By eight, I will have finished."},words:[{es:"Habré terminado...",en:"I will have finished..."},{es:"Habrás llegado...",en:"You will have arrived..."},{es:"Habrá salido...",en:"He/she will have left..."},{es:"Habremos comido...",en:"We will have eaten..."},{es:"Para las ocho...",en:"By eight..."},{es:"Cuando llegues...",en:"When you arrive..."}],phrases:[{en:"By eight, I will have finished.",es:"Para las ocho, habré terminado."},{en:"When you arrive, we will have already left.",es:"Cuando llegues, ya habremos salido."},{en:"In a year, I will have learned a lot.",es:"En un año, habré aprendido mucho."}]}
});
/* v60 lesson content: each new lesson is short enough to finish, but moves
   from recognition to guided production and then real conversation. */
Object.assign(LESSON_CONTENT,{
  "commands-repair":{goal:{es:"Disculpe, hábleme más despacio y repítame la dirección, por favor.",en:"Excuse me, speak to me more slowly and repeat the address for me, please."},words:[{es:"Disculpe",en:"Excuse me (formal)"},{es:"Hábleme",en:"Speak to me (formal)"},{es:"Dígame",en:"Tell me (formal)"},{es:"Escúchame",en:"Listen to me (informal)"},{es:"Repítame",en:"Repeat for me (formal)"},{es:"Más despacio",en:"More slowly"}],phrases:[{en:"Speak to me more slowly, please.",es:"Hábleme más despacio, por favor."},{en:"Tell me the address.",es:"Dígame la dirección."},{en:"Excuse me, I didn't understand.",es:"Disculpe, no entendí."},{en:"Can you repeat that for me?",es:"¿Me lo puede repetir?"}]},
  "uber-completo":{goal:{es:"Hablo un poco de español. Voy para el edificio de la esquina.",en:"I speak a little Spanish. I am going to the building on the corner."},words:[{es:"el conductor",en:"driver"},{es:"la esquina",en:"corner"},{es:"al frente",en:"across the way"},{es:"hablo un poco",en:"I speak a little"},{es:"avísame",en:"let me know (informal)"},{es:"dónde me bajo",en:"where I get out"}],phrases:[{en:"Are you the Uber driver?",es:"¿Usted es el conductor de Uber?"},{en:"Can you speak slowly?",es:"¿Puede hablar despacio?"},{en:"I am going to the building on the corner.",es:"Voy para el edificio de la esquina."},{en:"Please let me know when we arrive.",es:"Avíseme cuando lleguemos, por favor."}]},
  "restaurante-real":{goal:{es:"Quisiera una sopa con papa y un jugo sin azúcar, por favor.",en:"I would like a soup with potato and a juice without sugar, please."},words:[{es:"una mesa para dos",en:"a table for two"},{es:"quisiera",en:"I would like"},{es:"con papa",en:"with potato"},{es:"sin azúcar",en:"without sugar"},{es:"algo más",en:"anything else"},{es:"la cuenta",en:"the bill"}],phrases:[{en:"Do you have a table for two?",es:"¿Tiene una mesa para dos?"},{en:"I would like to order a soup.",es:"Quisiera pedir una sopa."},{en:"Without sugar, please.",es:"Sin azúcar, por favor."},{en:"Can you bring me the bill?",es:"¿Me trae la cuenta?"}]},
  "mercado-negociar":{goal:{es:"Está un poco caro. ¿Me lo deja en siete mil?",en:"It's a little expensive. Can you let me have it for seven thousand?"},words:[{es:"el kilo",en:"kilo"},{es:"está caro",en:"it is expensive"},{es:"me lo deja",en:"can you let me have it"},{es:"un descuento",en:"a discount"},{es:"deme",en:"give me (formal)"},{es:"por todo",en:"for everything"}],phrases:[{en:"How much does a kilo cost?",es:"¿Cuánto cuesta el kilo?"},{en:"It's a little expensive.",es:"Está un poco caro."},{en:"Can you give me a discount?",es:"¿Me hace un descuento?"},{en:"How much do I owe you for everything?",es:"¿Cuánto le debo por todo?"}]},
  "gerundios-actividades":{goal:{es:"Ahora estoy cocinando, pero después voy a salir.",en:"Right now I am cooking, but afterward I am going to go out."},words:[{es:"estoy cocinando",en:"I am cooking"},{es:"estoy buscando",en:"I am looking for"},{es:"estoy aprendiendo",en:"I am learning"},{es:"estaba trabajando",en:"I was working"},{es:"fui de compras",en:"I went shopping"},{es:"acabo de llegar",en:"I just arrived"}],phrases:[{en:"What are you doing?",es:"¿Qué estás haciendo?"},{en:"I am cooking dinner.",es:"Estoy cocinando la cena."},{en:"I was working when you called.",es:"Estaba trabajando cuando me llamaste."},{en:"I went shopping yesterday.",es:"Ayer fui de compras."}]},
  "social-salida":{goal:{es:"De una, nos vemos después. Te aviso cuando llegue.",en:"Sure, see you later. I will let you know when I arrive."},words:[{es:"¿Qué más?",en:"What's up?"},{es:"esta noche",en:"tonight"},{es:"salir con amigos",en:"go out with friends"},{es:"de una",en:"sure / I'm in"},{es:"llego tarde",en:"I arrive late"},{es:"avísame",en:"let me know"}],phrases:[{en:"What are you going to do tonight?",es:"¿Qué vas a hacer esta noche?"},{en:"I am going out with some friends.",es:"Voy a salir con unos amigos."},{en:"Shall we meet later?",es:"¿Nos vemos después?"},{en:"I think that's a good idea.",es:"Me parece buena idea."}]},
  "fiesta-gathering":{goal:{es:"La música está muy buena. La pasé muy bien.",en:"The music is really good. I had a great time."},words:[{es:"la gente",en:"the people"},{es:"conocer",en:"to know / meet"},{es:"algo de tomar",en:"something to drink"},{es:"está chévere",en:"it's cool"},{es:"la pasé bien",en:"I had a good time"},{es:"me tengo que ir",en:"I have to go"}],phrases:[{en:"How do you know the people here?",es:"¿Cómo conoces a la gente de aquí?"},{en:"Do you want something to drink?",es:"¿Quieres algo de tomar?"},{en:"The music is really good.",es:"La música está muy buena."},{en:"Nice to meet you. See you later.",es:"Qué gusto conocerte. Nos vemos luego."}]},
  "deportes-partido":{goal:{es:"Ojalá gane Colombia. Lo vemos juntos.",en:"I hope Colombia wins. We will watch it together."},words:[{es:"el partido",en:"the game"},{es:"no me lo pierdo",en:"I wouldn't miss it"},{es:"el marcador",en:"the score"},{es:"jugar contra",en:"to play against"},{es:"ojalá gane",en:"I hope it wins"},{es:"hicieron gol",en:"they scored"}],phrases:[{en:"Are you going to watch the game?",es:"¿Vas a ver el partido?"},{en:"Who's playing?",es:"¿Quién está jugando?"},{en:"How is the score?",es:"¿Cómo va el marcador?"},{en:"I hope Colombia wins.",es:"Ojalá gane Colombia."}]},
  "oficina-real":{goal:{es:"El proyecto va bien, pero estoy un poco atrasado.",en:"The project is going well, but I am a little behind."},words:[{es:"el proyecto",en:"the project"},{es:"atrasado",en:"behind / delayed"},{es:"el informe",en:"the report"},{es:"revisar",en:"to review"},{es:"después de la reunión",en:"after the meeting"},{es:"mandar al cliente",en:"send to the client"}],phrases:[{en:"How is the project going?",es:"¿Cómo va el proyecto?"},{en:"I am a little behind.",es:"Estoy un poco atrasado."},{en:"Can you review this part for me?",es:"¿Me puede revisar esta parte?"},{en:"Tomorrow we will send it to the client.",es:"Entonces mañana lo mandamos al cliente."}]}
});

const LESSON_META={
  presentate:{stage:"Start Here",difficulty:"Easy",prereq:"None",guideIds:["estructura"],readingId:"lectura-cafe",missionId:"saludo-parce"},
  plata:{stage:"Start Here",difficulty:"Easy",prereq:"Preséntate",guideIds:["estructura"],readingId:"lectura-mercado",missionId:"mercado-comida"},
  "survival-communication":{stage:"Start Here",difficulty:"Easy",prereq:"Preséntate",dialogue:"Uber: hablo poquito español",vocab:"gustos",quizCat:"reparar",quizMode:"mixed",guideIds:["negativas-preguntas"],missionId:"uber-habla-despacio"},
  "uber-ride":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Comunicación para aclarar",dialogue:"Uber: confirmar la recogida",vocab:"direcciones",quizCat:"uber",quizMode:"conversation",readingId:"lectura-uber",missionId:"taxi-aeropuerto"},
  "hotel-checkin":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Uber y transporte",dialogue:"Hotel: registrarse",vocab:"lugares",quizCat:"hotel",quizMode:"conversation",readingId:"lectura-hotel",missionId:"hotel-checkin"},
  "farmacia":{stage:"Travel and Survival",difficulty:"Moderate",prereq:"Hotel",dialogue:"Farmacia: explicar síntomas",vocab:"emociones",quizCat:"farmacia",quizMode:"conversation",missionId:"farmacia-sintomas"},
  calle:{stage:"Travel and Survival",difficulty:"Easy",prereq:"Números y plata",guideIds:["hay"],readingId:"lectura-edificio",missionId:"edificio-direcciones"},
  "daily-repair":{stage:"Daily Life",difficulty:"Moderate",prereq:"Travel and Survival",dialogue:"Teléfono: mala señal",vocab:"tecnologia",quizCat:"reparar",quizMode:"conversation",readingId:"lectura-telefono"},
  "sentence-structure":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Start Here",dialogue:"Compañeros de trabajo",vocab:"acciones",quizCat:"estructura",quizMode:"mixed",guideIds:["estructura","sujeto-omitido","presente"]},
  "connectors-v36":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Sentence structure",dialogue:"Planes de fin de semana",vocab:"gustos",quizCat:"conectores",quizMode:"mixed",guideIds:["conectores"],missionId:"planes-fin-semana"},
  "function-words":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Connectors",dialogue:"Palabras para conversar",vocab:"gustos",quizCat:"conectores",quizMode:"mixed",guideIds:["conectores"],missionId:"planes-fin-semana"},
  "action-chunks":{stage:"Build Sentences",difficulty:"Easy",prereq:"Start Here",dialogue:"Acciones de todos los días",vocab:"acciones",quizCat:"acciones",quizMode:"conversation",guideIds:["estructura","presente"],missionId:"acciones-diarias"},
  "social-colombia-v36":{stage:"Speak More Naturally",difficulty:"Moderate",prereq:"Build Sentences",dialogue:"Compañeros de trabajo",vocab:"colombianismos",quizCat:"expresiones",quizMode:"conversation",guideIds:["conectores"],missionId:"saludo-parce"},
  "conversation-challenge":{stage:"Conversation Challenge",difficulty:"Challenge",prereq:"Speak More Naturally",dialogue:"Uber: confirmar la recogida",vocab:"gustos",quizCat:"all",quizMode:"conversation",readingId:"lectura-uber",missionId:"uber-habla-despacio",guideIds:["conectores","pronombres"]},
  "gram-presente":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Start Here",guideIds:["presente","sujeto-omitido"]},
  "gram-futuro":{stage:"Build Sentences",difficulty:"Easy",prereq:"Presente",guideIds:["futuro"]},
  "gram-pasado":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Presente",guideIds:["pasado"]},
  "gram-pasado-contraste":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Pasado",guideIds:["pasado-contraste"],quizCat:"frases",quizMode:"blank",quizFocus:"past"},
  "gram-subjuntivo":{stage:"Build Sentences",difficulty:"Challenge",prereq:"Pasado",guideIds:["subjuntivo"],quizCat:"subjuntivo",quizMode:"blank",quizFocus:"subjuntivo"},
  "gram-pasado-historia":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Pasado",guideIds:["pasado","conectores"]},
  "gram-necesidades":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Pasado",guideIds:["negativas-preguntas"]},
  "gram-conectores":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Sentence structure",guideIds:["conectores"]},
  "gram-pronombres":{stage:"Build Sentences",difficulty:"Challenge",prereq:"Sentence structure",guideIds:["pronombres"]},
  "gram-groserias":{stage:"Speak More Naturally",difficulty:"Challenge",prereq:"Everyday expressions",guideIds:["conectores"]}
};

Object.assign(LESSON_META,{
  "gram-perfecto":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Pasado",guideIds:["perfecto"],quizCat:"frases",quizMode:"blank",quizFocus:"perfecto"},
  "gram-condicional":{stage:"Build Sentences",difficulty:"Moderate",prereq:"Presente",guideIds:["condicional"],quizCat:"frases",quizMode:"blank",quizFocus:"condicional"},
  "gram-pasado-perfecto":{stage:"Build Sentences",difficulty:"Challenge",prereq:"Pasado: evento vs. contexto",guideIds:["pasado-perfecto"],quizCat:"frases",quizMode:"blank",quizFocus:"pasado-perfecto"},
  "gram-futuro-perfecto":{stage:"Build Sentences",difficulty:"Challenge",prereq:"Planes futuros",guideIds:["futuro-perfecto"],quizCat:"frases",quizMode:"blank",quizFocus:"futuro-perfecto"}
});
Object.assign(LESSON_META,{
  "commands-repair":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Hazte entender",dialogue:"Comunicación: pedir y aclarar",vocab:"direcciones",quizCat:"mandatos",quizMode:"conversation",guideIds:["mandatos"]},
  "uber-completo":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Uber en español",dialogue:"Uber: viaje completo",vocab:"direcciones",quizCat:"uber-real",quizMode:"conversation",guideIds:["negativas-preguntas"]},
  "restaurante-real":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Números y plata",dialogue:"Restaurante: una comida completa",vocab:"comida",quizCat:"restaurante-real",quizMode:"conversation",guideIds:["condicional"]},
  "mercado-negociar":{stage:"Travel and Survival",difficulty:"Moderate",prereq:"Números y plata",dialogue:"Mercado: comprar y negociar",vocab:"comida",quizCat:"mercado",quizMode:"conversation",guideIds:["condicional"]},
  "gerundios-actividades":{stage:"Build Sentences",difficulty:"Easy",prereq:"Acciones de todos los días",dialogue:"Cocinar y hablar de lo que haces",vocab:"acciones",quizCat:"gerundios",quizMode:"blank",quizFocus:"gerundios",guideIds:["gerundios"]},
  "social-salida":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Planes y teléfono",dialogue:"Salir con amigos",vocab:"gustos",quizCat:"social",quizMode:"conversation",guideIds:["futuro"]},
  "fiesta-gathering":{stage:"Speak More Naturally",difficulty:"Moderate",prereq:"Habla más colombiano",dialogue:"En una fiesta",vocab:"colombianismos",quizCat:"fiesta",quizMode:"conversation",guideIds:["conectores"]},
  "deportes-partido":{stage:"Speak More Naturally",difficulty:"Moderate",prereq:"Planes y teléfono",dialogue:"Ver el partido",vocab:"tv",quizCat:"deportes",quizMode:"conversation",guideIds:["futuro"]},
  "oficina-real":{stage:"Daily Life",difficulty:"Moderate",prereq:"Tu trabajo",dialogue:"Oficina: proyecto y retraso",vocab:"oficina",quizCat:"oficina-real",quizMode:"conversation",guideIds:["conectores","pronombres"]}
});

/* v56: speaking frames keep high-frequency sentence patterns separate from
   app logic. The trainer uses these as short, repeatable production drills. */
const SPEAKING_FRAMES=[
  {id:"quiero",title:"Say what you want",formula:"Quiero + infinitive",en:"I want to…",guide:"presente",prompts:[
    {en:"I want to go home.",es:"Quiero ir para la casa."},
    {en:"I want to practice Spanish.",es:"Quiero practicar español."},
    {en:"I want to order a coffee.",es:"Quiero pedir un café."}
  ]},
  {id:"tengo-que",title:"Say what you have to do",formula:"Tengo que + infinitive",en:"I have to…",guide:"presente",prompts:[
    {en:"I have to work today.",es:"Tengo que trabajar hoy."},
    {en:"I have to find the address.",es:"Tengo que encontrar la dirección."},
    {en:"I have to call my friend.",es:"Tengo que llamar a mi amigo."}
  ]},
  {id:"voy-a",title:"Talk about your next plan",formula:"Voy a + infinitive",en:"I am going to…",guide:"futuro",prompts:[
    {en:"I am going to call you later.",es:"Voy a llamarte más tarde."},
    {en:"I am going to take a taxi.",es:"Voy a tomar un taxi."},
    {en:"I am going to practice tonight.",es:"Voy a practicar esta noche."}
  ]},
  {id:"acabo-de",title:"Say what just happened",formula:"Acabo de + infinitive",en:"I just…",guide:"presente",prompts:[
    {en:"I just arrived.",es:"Acabo de llegar."},
    {en:"I just ate.",es:"Acabo de comer."},
    {en:"I just sent the location.",es:"Acabo de mandar la ubicación."}
  ]},
  {id:"se-me",title:"Explain an accidental problem",formula:"Se me + verb + thing",en:"Something happened to me…",guide:"se-me",prompts:[
    {en:"I forgot the address.",es:"Se me olvidó la dirección."},
    {en:"My phone broke on me.",es:"Se me dañó el celular."},
    {en:"I left my wallet in the car.",es:"Se me quedó la billetera en el carro."}
  ]},
  {id:"me-gustaria",title:"Make a polite request",formula:"Me gustaría + infinitive",en:"I would like to…",guide:"estructura",prompts:[
    {en:"I would like to ask a question.",es:"Me gustaría hacer una pregunta."},
    {en:"I would like to change the order.",es:"Me gustaría cambiar el pedido."},
    {en:"I would like to practice with you.",es:"Me gustaría practicar contigo."}
  ]},
  {id:"pronombres",title:"Use object pronouns naturally",formula:"lo / la / le → se lo / se la",en:"it / to him or her",guide:"pronombres",prompts:[
    {en:"I have it here.",es:"Lo tengo aquí."},
    {en:"I sent her the location.",es:"Se la mandé por mensaje."},
    {en:"I am going to send it to him.",es:"Se lo voy a mandar."}
  ]},
  {id:"connectors",title:"Connect two ideas",formula:"idea + pero / porque / entonces",en:"but / because / so",guide:"conectores",prompts:[
    {en:"I want to go, but I have to work.",es:"Quiero ir, pero tengo que trabajar."},
    {en:"I practice because I want to speak.",es:"Practico porque quiero hablar."},
    {en:"There is traffic, so I will arrive late.",es:"Hay trancón, entonces voy a llegar tarde."}
  ]}
];

/* v59: high-frequency chunks for real conversation, not isolated vocabulary. */
SPEAKING_FRAMES.push(
  {id:"ya-todavia",title:"Say what is already done",formula:"ya + verb / todavía no",en:"already / not yet",guide:"presente",prompts:[
    {en:"I already ate.",es:"Ya comí."},{en:"I have not arrived yet.",es:"Todavía no he llegado."},{en:"I already sent the location.",es:"Ya mandé la ubicación."}
  ]},
  {id:"lo-que-pasa",title:"Explain the real situation",formula:"Lo que pasa es que…",en:"The thing is…",guide:"conectores",prompts:[
    {en:"The thing is, I am still learning.",es:"Lo que pasa es que todavía estoy aprendiendo."},{en:"The thing is, I do not have the address.",es:"Lo que pasa es que no tengo la dirección."},{en:"The thing is, I have to work tomorrow.",es:"Lo que pasa es que tengo que trabajar mañana."}
  ]},
  {id:"no-se-si",title:"Sound natural when you are unsure",formula:"No sé si + sentence",en:"I do not know if…",guide:"conectores",prompts:[
    {en:"I do not know if the office is open.",es:"No sé si la oficina está abierta."},{en:"I do not know if he received the message.",es:"No sé si recibió el mensaje."},{en:"I do not know if I can go tomorrow.",es:"No sé si puedo ir mañana."}
  ]},
  {id:"si-entonces",title:"Talk about two possibilities",formula:"Si + present, …",en:"If…, then…",guide:"conectores",prompts:[
    {en:"If it rains, I will stay home.",es:"Si llueve, me quedo en casa."},{en:"If you want, we can practice later.",es:"Si quieres, podemos practicar más tarde."},{en:"If the driver arrives, I will call you.",es:"Si llega el conductor, te llamo."}
  ]},
  {id:"me-toca",title:"Say what you have to handle",formula:"Me toca + infinitive",en:"I have to / it is my turn to…",guide:"presente",prompts:[
    {en:"I have to work tomorrow.",es:"Me toca trabajar mañana."},{en:"I have to call the office.",es:"Me toca llamar a la oficina."},{en:"It is my turn to pay.",es:"Me toca pagar."}
  ]}
);

/* v61: essential production frames for a true beginner. These are deliberately
   short, reusable chunks; the learner swaps the final idea instead of
   memorizing isolated vocabulary. */
SPEAKING_FRAMES.push(
  {id:"necesito",title:"Say what you need",formula:"Necesito + noun / infinitive",en:"I need…",guide:"presente",prompts:[
    {en:"I need help.",es:"Necesito ayuda."},{en:"I need to find the bathroom.",es:"Necesito encontrar el baño."},{en:"I need to call my friend.",es:"Necesito llamar a mi amigo."}
  ]},
  {id:"puedo",title:"Ask what you can do",formula:"¿Puedo + infinitive?",en:"Can I…?",guide:"presente",prompts:[
    {en:"Can I pay by card?",es:"¿Puedo pagar con tarjeta?"},{en:"Can I sit here?",es:"¿Puedo sentarme aquí?"},{en:"Can I ask a question?",es:"¿Puedo hacer una pregunta?"}
  ]},
  {id:"estoy",title:"Say where you are and how you feel",formula:"Estoy + state / location",en:"I am…",guide:"ser-estar",prompts:[
    {en:"I am at the hotel.",es:"Estoy en el hotel."},{en:"I am tired, but I am okay.",es:"Estoy cansado, pero estoy bien."},{en:"I am ready.",es:"Estoy listo."}
  ]},
  {id:"fui",title:"Tell what you did",formula:"Ayer fui / hice / tuve…",en:"Yesterday I…",guide:"pasado",prompts:[
    {en:"Yesterday I went to the market.",es:"Ayer fui al mercado."},{en:"Yesterday I worked all day.",es:"Ayer trabajé todo el día."},{en:"Yesterday I had a meeting.",es:"Ayer tuve una reunión."}
  ]},
  {id:"quiero-que",title:"Express a wish about another person",formula:"Quiero que + subjunctive",en:"I want you to…",guide:"subjuntivo",prompts:[
    {en:"I want you to speak slowly.",es:"Quiero que hables despacio."},{en:"I want you to come tomorrow.",es:"Quiero que vengas mañana."},{en:"I want you to tell me the truth.",es:"Quiero que me digas la verdad."}
  ]},
  {id:"me-pasa",title:"Explain what is happening",formula:"Me pasa que… / El problema es que…",en:"What is happening is…",guide:"conectores",prompts:[
    {en:"The problem is that I do not understand.",es:"El problema es que no entiendo."},{en:"What is happening is that the app is not working.",es:"Me pasa que la aplicación no funciona."},{en:"The problem is that I am running late.",es:"El problema es que voy tarde."}
  ]}
);

/* v60 quiz additions. Conversation questions test the response a learner
   would actually choose; fill blanks use a single, context-locked answer. */
const V60_CONVERSATION_QUIZ=[
  {kind:"reply",focus:"present",cat:"mandatos",es:"Hábleme más despacio, por favor.",en:"Of course, no problem.",tts:"Hábleme más despacio, por favor.",choices:["Of course, no problem.","I went shopping yesterday.","It costs seven thousand.","The game is tonight."]},
  {kind:"reply",focus:"present",cat:"uber-real",es:"¿Dónde me bajo, por favor?",en:"At the building on the corner.",tts:"¿Dónde me bajo, por favor?",choices:["At the building on the corner.","Without sugar, please.","I am a little behind.","I hope Colombia wins."]},
  {kind:"reply",focus:"present",cat:"restaurante-real",es:"¿Algo más?",en:"No, thank you. Bring me the bill when you can.",tts:"¿Algo más?",choices:["No, thank you. Bring me the bill when you can.","The driver is over there.","I am going out tonight.","They scored a goal."]},
  {kind:"reply",focus:"present",cat:"mercado",es:"Está un poco caro. ¿Me lo deja en siete?",en:"Okay, I will let you have it for seven thousand.",tts:"Está un poco caro. ¿Me lo deja en siete?",choices:["Okay, I will let you have it for seven thousand.","Yes, the report is ready.","I am cooking dinner.","See you at the party."]},
  {kind:"meaning",focus:"gerundios",cat:"gerundios",es:"Estoy buscando la dirección.",en:"I am looking for the address.",tts:"Estoy buscando la dirección.",choices:["I am looking for the address.","I found the address yesterday.","I will send the address tomorrow.","I forgot the address."]},
  {kind:"reply",focus:"future",cat:"social",es:"¿Nos vemos después?",en:"Sure, but I will arrive a little late.",tts:"¿Nos vemos después?",choices:["Sure, but I will arrive a little late.","No, I did not understand.","It is behind the building.","The soup has potato."]},
  {kind:"reply",focus:"present",cat:"fiesta",es:"¿Quieres algo de tomar?",en:"Yes, thank you. A juice is fine.",tts:"¿Quieres algo de tomar?",choices:["Yes, thank you. A juice is fine.","I need the report.","Go straight to the corner.","I am a little behind."]},
  {kind:"reply",focus:"future",cat:"deportes",es:"¿Vas a ver el partido esta noche?",en:"Of course, I wouldn't miss it.",tts:"¿Vas a ver el partido esta noche?",choices:["Of course, I wouldn't miss it.","I need to change the order.","The entrance is behind it.","I went to the market."]},
  {kind:"reply",focus:"present",cat:"oficina-real",es:"¿Necesitas ayuda con el informe?",en:"Yes, can you review this part for me?",tts:"¿Necesitas ayuda con el informe?",choices:["Yes, can you review this part for me?","No, the music is good.","I am going to the corner.","Give me a kilo."]},
  {kind:"reply",focus:"present",cat:"mandatos",es:"Disculpe, no entendí.",en:"No problem. I will repeat it.",tts:"Disculpe, no entendí.",choices:["No problem. I will repeat it.","The game is tomorrow.","I would like a table.","I am behind schedule."]},
  {kind:"meaning",focus:"past",cat:"gerundios",es:"Estaba trabajando cuando me llamaste.",en:"I was working when you called.",tts:"Estaba trabajando cuando me llamaste.",choices:["I was working when you called.","I will work after I call.","I just finished working.","I went shopping for work."]},
  {kind:"reply",focus:"pronombres",cat:"oficina-real",es:"¿Qué hacemos con el proyecto?",en:"We will send it to the client tomorrow.",tts:"¿Qué hacemos con el proyecto?",choices:["We will send it to the client tomorrow.","I am looking for the driver.","It is a little expensive.","I hope Colombia wins."]}
];
const V60_FILL_BLANK_QUIZ=[
  {kind:"blank",focus:"gerundios",cat:"gerundios",es:"Ahora ___ la cena.",quizPrompt:"Complete to mean 'Right now I am cooking dinner.': Ahora ___ la cena.",en:"estoy cocinando",tts:"Ahora estoy cocinando la cena.",trans:"Right now I am cooking dinner.",choices:["estoy cocinando","cociné","voy a cocinar","cocinar"]},
  {kind:"blank",focus:"gerundios",cat:"gerundios",es:"¿Qué ___ haciendo?",en:"estás",tts:"¿Qué estás haciendo?",trans:"What are you doing?",choices:["estás","eres","fuiste","vas"]},
  {kind:"blank",focus:"gerundios",cat:"gerundios",es:"Mientras ___, me llamaste.",quizPrompt:"Complete to mean 'While I was working, you called me.': Mientras ___, me llamaste.",en:"trabajaba",tts:"Mientras trabajaba, me llamaste.",trans:"While I was working, you called me.",choices:["trabajaba","trabajé","trabajo","trabajaré"]},
  {kind:"blank",focus:"past",cat:"gerundios",es:"Ayer fui de ___.",en:"compras",tts:"Ayer fui de compras.",trans:"Yesterday I went shopping.",choices:["compras","cocinar","trabajo","salir"]},
  {kind:"blank",focus:"present",cat:"mandatos",es:"___ más despacio, por favor.",quizPrompt:"Use usted (one person): ___ más despacio, por favor.",en:"Hábleme",tts:"Hábleme más despacio, por favor.",trans:"Speak to me more slowly, please.",choices:["Hábleme","Hablame","Háblate","Hablar"]},
  {kind:"blank",focus:"present",cat:"mandatos",es:"___ la pregunta, por favor.",quizPrompt:"Use usted (one person): ___ la pregunta, por favor.",en:"Repítame",tts:"Repítame la pregunta, por favor.",trans:"Repeat the question for me, please.",choices:["Repítame","Repíteme","Repetir","Repítate"]},
  {kind:"blank",focus:"present",cat:"mandatos",es:"___, no entendí.",quizPrompt:"Use usted (one person): ___, no entendí.",en:"Disculpe",tts:"Disculpe, no entendí.",trans:"Excuse me, I did not understand.",choices:["Disculpe","Discúlpame","Disculpa a él","Disculpen"]},
  {kind:"blank",focus:"present",cat:"direcciones",es:"___ derecho hasta la esquina.",quizPrompt:"Use usted (one person): ___ derecho hasta la esquina.",en:"Siga",tts:"Siga derecho hasta la esquina.",trans:"Go straight to the corner.",choices:["Siga","Sigue","Seguir","Sigan"]},
  {kind:"blank",focus:"present",cat:"restaurante-real",es:"Quisiera ___ una sopa.",en:"pedir",tts:"Quisiera pedir una sopa.",trans:"I would like to order a soup.",choices:["pedir","pido","pedí","pidiendo"]},
  {kind:"blank",focus:"present",cat:"mercado",es:"¿Cuánto ___ el kilo?",quizPrompt:"Complete to mean 'How much does the kilo cost?': ¿Cuánto ___ el kilo?",en:"cuesta",tts:"¿Cuánto cuesta el kilo?",trans:"How much does the kilo cost?",choices:["cuesta","costó","costando","costar"]},
  {kind:"blank",focus:"present",cat:"mercado",es:"¿Me ___ un descuento?",quizPrompt:"Complete to mean 'Can you give me a discount?': ¿Me ___ un descuento?",en:"hace",tts:"¿Me hace un descuento?",trans:"Can you give me a discount?",choices:["hace","hizo","haciendo","hacer"]},
  {kind:"blank",focus:"future",cat:"social",es:"Voy a ___ con unos amigos.",en:"salir",tts:"Voy a salir con unos amigos.",trans:"I am going out with some friends.",choices:["salir","salgo","salí","saliendo"]},
  {kind:"blank",focus:"future",cat:"social",es:"Avísame cuando ___.",en:"llegues",tts:"Avísame cuando llegues.",trans:"Let me know when you arrive.",choices:["llegues","llegas","llegaste","llegar"]},
  {kind:"blank",focus:"subjuntivo",cat:"deportes",es:"Ojalá ___ Colombia.",quizPrompt:"Complete to mean 'I hope Colombia wins.': Ojalá ___ Colombia.",en:"gane",tts:"Ojalá gane Colombia.",trans:"I hope Colombia wins.",choices:["gane","gana","ganó","ganar"]},
  {kind:"blank",focus:"present",cat:"oficina-real",es:"Estoy un poco ___.",en:"atrasado",tts:"Estoy un poco atrasado.",trans:"I am a little behind.",choices:["atrasado","atrasar","atrasando","atrasé"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Tienes la dirección? Sí, ___ tengo aquí.",en:"la",tts:"¿Tienes la dirección? Sí, la tengo aquí.",trans:"Do you have the address? Yes, I have it here.",choices:["la","lo","le","las"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"El proyecto es importante; mañana ___ mandamos al cliente.",en:"lo",tts:"El proyecto es importante; mañana lo mandamos al cliente.",trans:"The project is important; tomorrow we will send it to the client.",choices:["lo","la","le","los"]},
  {kind:"blank",focus:"present",cat:"fiesta",es:"La música ___ muy buena.",quizPrompt:"Describe how the music sounds right now: La música ___ muy buena.",en:"está",tts:"La música está muy buena.",trans:"The music is really good.",choices:["está","están","fue","sea"]}
];

/* ═══════════════════════════════════════════════════════════════════════════
   v71 Conversational Roadmap Upgrade:
   1. Colombian Polite Softeners, Diminutives, Time-Buyers (Muletillas), & Usted/Tú/Vos
   2. Complete guideIds for all lessons (no generic fallbacks)
   3. 5-Rung Sentence Expansion Ladders (Escalera de Oraciones)
   4. Interactive 3-Column Slot-Swap Matrices (Constructor de Frases)
   ═══════════════════════════════════════════════════════════════════════════ */
SPEAKING_GUIDE.push(
  {id:"cortesia-colombiana",title:"Colombian polite softeners",formula:"¿Me regala…? · ¿Será que…? · Qué pena con usted",explain:"In Colombia, direct requests like Quiero… or Deme… can sound abrupt with strangers. Soften requests with Qué pena con usted, ¿Me regala…?, or ¿Será que me puede…?",examples:[{es:"Qué pena con usted, ¿me regala un tintico?",en:"Sorry to bother you, can I have a black coffee?",tts:"Qué pena con usted, ¿me regala un tintico?"},{es:"¿Será que me puede ayudar con esta dirección?",en:"Could you possibly help me with this address?",tts:"¿Será que me puede ayudar con esta dirección?"},{es:"Veci, ¿me hace un favor?",en:"Neighbor/friend (shopkeeper), can you do me a favor?",tts:"Veci, ¿me hace un favor?"}],mistake:"Do not translate 'I want a coffee' as Yo quiero un café at a counter. Use ¿Me regala un tinto, por favor? or Quisiera…",exercise:"Ask for a coffee, the bill, and directions using ¿Me regala…? and ¿Será que…?"},
  {id:"diminutivos",title:"Diminutives (-ito / -ico) for warmth",formula:"tinto → tintico · ahora → ahorita · momento → momentico",explain:"Colombians use -ito/-ita (and -ico/-ica after T, like tintico or momentico) to sound warm, polite, and relaxed—not just to describe small size.",examples:[{es:"Espéreme un momentico, por favor.",en:"Wait for me just a moment, please.",tts:"Espéreme un momentico, por favor."},{es:"Ahorita te llamo; estoy cerquita.",en:"I'll call you right now/shortly; I'm very close.",tts:"Ahorita te llamo; estoy cerquita."},{es:"¿Me habla más despacito, por favor?",en:"Can you speak a little more slowly to me, please?",tts:"¿Me habla más despacito, por favor?"}],mistake:"When a word ends in -to/-ta, Colombians switch to -tico/-tica: momentico, tintico, ratico (never momentito in Colombia).",exercise:"Soften un momento, ahora, despacio, and cerca using Colombian diminutives."},
  {id:"muletillas",title:"Time-buyers while you think (Muletillas)",formula:"Pues… · A ver… · Es que… · Digamos que…",explain:"Native speakers use small filler chunks to hold the floor while organizing their next sentence. Using these prevents awkward silence while you think.",examples:[{es:"Pues, a ver… creo que vamos para el centro.",en:"Well, let's see… I think we are going downtown.",tts:"Pues, a ver… creo que vamos para el centro."},{es:"Es que todavía estoy aprendiendo español.",en:"It's just that I am still learning Spanish.",tts:"Es que todavía estoy aprendiendo español."},{es:"Digamos que necesito un poco más de práctica.",en:"Let's say I need a little more practice.",tts:"Digamos que necesito un poco más de práctica."}],mistake:"Instead of saying English 'uh / um' or freezing, start your answer with Pues, a ver… or Lo que pasa es que…",exercise:"Start three answers out loud with Pues, a ver…, Es que…, and O sea…"},
  {id:"usted-tu-vos",title:"Usted, tú, sumercé, and vos in Colombia",formula:"usted = respect & daily Bogotá · tú = friendly · ustedes = plural you",explain:"Colombian pronoun choice is warm and regional. Usted is standard with drivers, shopkeepers, doctors, and often even friends in Bogotá. Ustedes is always used for plural 'you all'.",examples:[{es:"Disculpe, ¿usted me puede indicar la entrada?",en:"Excuse me, can you show me the entrance? (formal)",tts:"Disculpe, ¿usted me puede indicar la entrada?"},{es:"¿Tú vas a salir esta noche o te quedas?",en:"Are you going out tonight or staying in? (friendly)",tts:"¿Tú vas a salir esta noche o te quedas?"},{es:"¿Ustedes a qué hora abren mañana?",en:"What time do you all open tomorrow?",tts:"¿Ustedes a qué hora abren mañana?"}],mistake:"Remember that él, ella, and usted all share the exact same verb form (habla, tiene, va), and ellos/ustedes share the -n form (hablan, tienen, van).",exercise:"Ask the same question first to a friend with tú, then to a driver with usted."}
);

FRASES.push(
  {section:"🙏 Cortesía colombiana — polite requests",quizCat:"cortesia",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[
    {es:"Qué pena con usted.",en:"Sorry to bother you / Excuse me.",register:"Colombian · polite"},
    {es:"¿Me regala un tintico, por favor?",en:"Can I have a black coffee, please?",register:"Colombian · everyday"},
    {es:"¿Será que me puede ayudar?",en:"Could you possibly help me?",register:"Colombian · polite"},
    {es:"¿Será que tiene cambio?",en:"Would you happen to have change?",register:"Colombian · polite"},
    {es:"Veci, ¿cuánto le debo?",en:"Neighbor/shopkeeper, how much do I owe you?",register:"Colombian · everyday"},
    {es:"¿Me hace un favor?",en:"Can you do me a favor?",register:"Everyday"},
    {es:"Con mucho gusto.",en:"With pleasure / Happy to help.",register:"Colombian · polite"},
    {es:"A la orden.",en:"At your service / You're welcome.",register:"Colombian · everyday"},
    {es:"Dios le pague.",en:"Thank you very much (warm traditional).",register:"Colombian · warm"}
  ]},
  {section:"☕ Diminutivos y muletillas — sound local",quizCat:"muletillas",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[
    {es:"Espéreme un momentico.",en:"Wait for me just a moment.",register:"Colombian · everyday"},
    {es:"Ahorita vengo.",en:"I'll be right back / coming shortly.",register:"Colombian · everyday"},
    {es:"Queda aquí cerquita.",en:"It's right nearby.",register:"Colombian · everyday"},
    {es:"Hábleme más despacito, por favor.",en:"Speak to me a little more slowly, please.",register:"Colombian · polite"},
    {es:"Nos vemos en un ratico.",en:"See you in a little while.",register:"Colombian · everyday"},
    {es:"Pues, a ver…",en:"Well, let's see… (buying time)",register:"Everyday"},
    {es:"Es que todavía estoy aprendiendo.",en:"It's just that I'm still learning.",register:"Everyday"},
    {es:"Digamos que sí.",en:"Let's say yes / more or less.",register:"Everyday"},
    {es:"¿Sí me entiende?",en:"Do you see what I mean?",register:"Colombian · everyday"}
  ]}
);

CONVERSATIONS.push(
  v60Dialogue("Cortesía en una tienda","Polite Colombian ordering with ¿Me regala…?, ¿Será que…?, and Veci",[
    ["A","Buenas, veci. Qué pena con usted, ¿me regala un tintico?","Hi, neighbor. Sorry to bother you, can I have a black coffee?"],
    ["B","Claro, con mucho gusto. ¿Lo quiere con azúcar?","Of course, with pleasure. Do you want it with sugar?"],
    ["A","Sin azúcar, por favor. ¿Y será que tiene una arepa con queso?","Without sugar, please. And would you happen to have an arepa with cheese?"],
    ["B","Sí, claro, ya le sale calentica.","Yes, of course, it's coming right out warm."],
    ["A","Perfecto. ¿Cuánto le debo por todo?","Perfect. How much do I owe you for everything?"],
    ["B","Son seis mil pesos. A la orden.","It's six thousand pesos. At your service."]
  ],[{es:"Qué pena, ¿será que puedo pagar con Nequi o en efectivo?",en:"Excuse me, could I pay with Nequi or in cash?",tts:"Qué pena, ¿será que puedo pagar con Nequi o en efectivo?"},{es:"Muchas gracias, muy amable.",en:"Thank you very much, very kind of you.",tts:"Muchas gracias, muy amable."}]),
  v60Dialogue("Ganar tiempo al hablar","Using muletillas and diminutives to keep a conversation flowing",[
    ["A","Hola, ¿ya conoces bien el barrio?","Hi, do you know the neighborhood well yet?"],
    ["B","Pues, a ver… apenas llevo unos días aquí, pero me gusta mucho.","Well, let's see… I've only been here a few days, but I like it a lot."],
    ["A","¿Y dónde queda tu hotel?","And where is your hotel located?"],
    ["B","Queda aquí cerquita, a dos cuadras del parque.","It's right nearby, two blocks from the park."],
    ["A","¿Vamos por un tintico ahorita?","Shall we go for a coffee right now?"],
    ["B","De una, espéreme un momentico y salimos.","I'm in, wait for me just a moment and we'll head out."]
  ],[{es:"Lo que pasa es que todavía hablo despacito, pero ahí voy.",en:"The thing is I still speak slowly, but I'm getting there.",tts:"Lo que pasa es que todavía hablo despacito, pero ahí voy."},{es:"Nos vemos en un ratico en la esquina.",en:"See you in a little while on the corner.",tts:"Nos vemos en un ratico en la esquina."}])
);

Object.assign(LESSON_CONTENT,{
  "cortesia-colombiana":{
    goal:{es:"Qué pena con usted, ¿me regala un tintico y me dice cuánto le debo?",en:"Sorry to bother you, can I have a black coffee and can you tell me how much I owe you?"},
    words:[{es:"Qué pena con usted",en:"Sorry to bother you"},{es:"¿Me regala…?",en:"Can I have…? (Colombian)"},{es:"¿Será que…?",en:"Could it be that…? (polite opener)"},{es:"Veci",en:"Friendly shopkeeper address"},{es:"Con mucho gusto",en:"With pleasure"},{es:"A la orden",en:"At your service"}],
    phrases:[{en:"Sorry to bother you, can you help me?",es:"Qué pena con usted, ¿me puede ayudar?"},{en:"Can I have a black coffee, please?",es:"¿Me regala un tintico, por favor?"},{en:"Would you happen to have change?",es:"¿Será que tiene cambio?"},{en:"How much do I owe you for everything?",es:"¿Cuánto le debo por todo?"}]
  },
  "muletillas-diminutivos":{
    goal:{es:"Pues, a ver… espéreme un momentico porque ya estoy cerquita.",en:"Well, let's see… wait for me just a moment because I am already very close."},
    words:[{es:"un momentico",en:"just a moment"},{es:"ahorita",en:"right now / shortly"},{es:"cerquita",en:"very close"},{es:"despacito",en:"nice and slowly"},{es:"Pues, a ver…",en:"Well, let's see…"},{es:"Es que…",en:"It's just that…"}],
    phrases:[{en:"Wait for me just a moment, please.",es:"Espéreme un momentico, por favor."},{en:"It's right nearby, across the way.",es:"Queda aquí cerquita, al frente."},{en:"Well, let's see… it's just that I'm still learning.",es:"Pues, a ver… es que todavía estoy aprendiendo."},{en:"I'll call you in a little while.",es:"Te llamo en un ratico."}]
  }
});

Object.assign(LESSON_META,{
  trabajo:{stage:"Daily Life",difficulty:"Easy",prereq:"Preséntate",guideIds:["presente","por-para"],readingId:"lectura-trabajo",missionId:"reunion-trabajo"},
  casa:{stage:"Start Here",difficulty:"Easy",prereq:"Preséntate",guideIds:["ser-estar","hay"],missionId:"problema-casa"},
  cocina:{stage:"Travel and Survival",difficulty:"Easy",prereq:"Tu casa",guideIds:["futuro","ir-venir"]},
  gustos:{stage:"Start Here",difficulty:"Easy",prereq:"Preséntate",guideIds:["gustar","acuerdo"]},
  planes:{stage:"Daily Life",difficulty:"Easy",prereq:"Gustos y familia",guideIds:["quedar","futuro"],readingId:"lectura-planes",missionId:"planes-fin-semana"},
  sentirse:{stage:"Daily Life",difficulty:"Easy",prereq:"Tu casa",guideIds:["ser-estar","estructura"],missionId:"como-te-sientes"},
  colombia:{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Start Here",guideIds:["cortesia-colombiana","diminutivos"],readingId:"lectura-cafe",missionId:"tinto-por-favor"},
  "uber-ride":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Comunicación para aclarar",dialogue:"Uber: confirmar la recogida",vocab:"direcciones",quizCat:"uber",quizMode:"conversation",guideIds:["usted-tu-vos","por-para"],readingId:"lectura-uber",missionId:"taxi-aeropuerto"},
  "hotel-checkin":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Uber y transporte",dialogue:"Hotel: registrarse",vocab:"lugares",quizCat:"hotel",quizMode:"conversation",guideIds:["hay","cortesia-colombiana"],readingId:"lectura-hotel",missionId:"hotel-checkin"},
  farmacia:{stage:"Travel and Survival",difficulty:"Moderate",prereq:"Hotel",dialogue:"Farmacia: explicar síntomas",vocab:"emociones",quizCat:"farmacia",quizMode:"conversation",guideIds:["ser-estar","negativas-preguntas"],missionId:"farmacia-sintomas"},
  "daily-repair":{stage:"Daily Life",difficulty:"Moderate",prereq:"Travel and Survival",dialogue:"Teléfono: mala señal",vocab:"tecnologia",quizCat:"reparar",quizMode:"conversation",guideIds:["conectores","se-me"],readingId:"lectura-telefono"},
  direcciones:{stage:"Travel and Survival",difficulty:"Easy",prereq:"En la calle",dialogue:"Uber: dirección equivocada",vocab:"direcciones",quizCat:"direcciones",quizMode:"conversation",guideIds:["hay","quedar"],readingId:"lectura-edificio",missionId:"edificio-direcciones"},
  "cortesia-colombiana":{stage:"Start Here",difficulty:"Easy",prereq:"Preséntate",dialogue:"Cortesía en una tienda",vocab:"colombianismos",quizCat:"cortesia",quizMode:"conversation",guideIds:["cortesia-colombiana","usted-tu-vos"],readingId:"lectura-cafe",missionId:"tinto-por-favor"},
  "muletillas-diminutivos":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Colombianismos",dialogue:"Ganar tiempo al hablar",vocab:"colombianismos",quizCat:"muletillas",quizMode:"conversation",guideIds:["diminutivos","muletillas"],readingId:"lectura-cafe",missionId:"saludo-parce"}
});

SPEAKING_FRAMES.push(
  {id:"sera-que",title:"Soften a request the Colombian way",formula:"¿Será que + can / have…?",en:"Could it be that / Would you happen to…?",guide:"cortesia-colombiana",prompts:[
    {en:"Could you possibly help me?",es:"¿Será que me puede ayudar?"},
    {en:"Would you happen to have change?",es:"¿Será que tiene cambio?"},
    {en:"Could we meet a little later?",es:"¿Será que nos vemos más tarde?"}
  ]},
  {id:"me-regala",title:"Order or ask politely in Colombia",formula:"¿Me regala + thing, por favor?",en:"Can I have…, please?",guide:"cortesia-colombiana",prompts:[
    {en:"Can I have a black coffee, please?",es:"¿Me regala un tintico, por favor?"},
    {en:"Can you give me the address, please?",es:"¿Me regala la dirección, por favor?"},
    {en:"Can I have the bill, please?",es:"¿Me regala la cuenta, por favor?"}
  ]},
  {id:"pues-es-que",title:"Buy time while you think",formula:"Pues, a ver… es que + sentence",en:"Well, let's see… it's just that…",guide:"muletillas",prompts:[
    {en:"Well, let's see… it's just that I am still learning.",es:"Pues, a ver… es que todavía estoy aprendiendo."},
    {en:"It's just that I forgot the address.",es:"Es que se me olvidó la dirección."},
    {en:"Well, let's see… I think it's over there.",es:"Pues, a ver… creo que queda por allá."}
  ]}
);

const V71_QUIZ=[
  {kind:"reply",focus:"present",cat:"cortesia",es:"Buenas, veci. ¿Me regala un tintico, por favor?",en:"Claro, con mucho gusto. ¿Con azúcar?",tts:"Buenas, veci. ¿Me regala un tintico, por favor?",choices:["Claro, con mucho gusto. ¿Con azúcar?","La llanta está baja.","Ayer trabajé en la oficina.","Juega Colombia esta noche."]},
  {kind:"meaning",focus:"present",cat:"cortesia",es:"¿Será que me puede ayudar con esta dirección?",en:"Could you possibly help me with this address?",tts:"¿Será que me puede ayudar con esta dirección?",choices:["Could you possibly help me with this address?","Did you already send the address?","I forgot the address yesterday.","Go straight to the corner."]},
  {kind:"reply",focus:"present",cat:"muletillas",es:"¿Vamos por un tintico ahorita?",en:"De una, espéreme un momentico y salimos.",tts:"¿Vamos por un tintico ahorita?",choices:["De una, espéreme un momentico y salimos.","No, la impresora no funciona.","Ayer fui al mercado.","El semáforo está en rojo."]},
  {kind:"meaning",focus:"present",cat:"muletillas",es:"Queda aquí cerquita, a dos cuadras.",en:"It's right nearby, two blocks away.",tts:"Queda aquí cerquita, a dos cuadras.",choices:["It's right nearby, two blocks away.","It is very far from the airport.","I lived there last year.","The entrance is on the second floor."]}
];
V60_CONVERSATION_QUIZ.push(...V71_QUIZ);

/* ── 5-Rung Sentence Expansion Ladders (Escalera de Oraciones) ─────────────
   Teaches learners how to start with a 2-word anchor chunk and snap pieces
   together into a complete conversational sentence, plus 3 slot-swaps. */
const SENTENCE_LADDERS={
  presentate:{
    title:"Build your introduction step by step",
    rungs:[
      {tag:"1. Anchor stem",es:"Me llamo…",en:"My name is…"},
      {tag:"2. + Origin",es:"Me llamo Seth y soy de Estados Unidos.",en:"My name is Seth and I'm from the United States."},
      {tag:"3. + Where you live",es:"Me llamo Seth, soy de Estados Unidos y vivo en Colombia.",en:"My name is Seth, I'm from the U.S. and I live in Colombia."},
      {tag:"4. + Conversational softener",es:"Hola, mucho gusto. Me llamo Seth, soy de Estados Unidos y estoy aprendiendo español.",en:"Hi, nice to meet you. My name is Seth, I'm from the U.S. and I'm learning Spanish."}
    ],
    swaps:[
      {label:"Swap city",es:"Vivo en Medellín, cerca del parque.",en:"I live in Medellín, near the park."},
      {label:"Ask back",es:"Mucho gusto, ¿y tú de dónde eres?",en:"Nice to meet you, and where are you from?"},
      {label:"Slow down",es:"Hablo un poquito de español; ¿me habla más despacito?",en:"I speak a little Spanish; can you speak more slowly to me?"}
    ]
  },
  "cortesia-colombiana":{
    title:"Grow a polite Colombian request",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Me regala…?",en:"Can I have…?"},
      {tag:"2. + Warm diminutive",es:"¿Me regala un tintico, por favor?",en:"Can I have a black coffee, please?"},
      {tag:"3. + Polite opener",es:"Buenas, veci. Qué pena con usted, ¿me regala un tintico?",en:"Hi, neighbor. Sorry to bother you, can I have a black coffee?"},
      {tag:"4. + Second polite question",es:"Qué pena con usted, ¿me regala un tintico y será que tiene cambio?",en:"Sorry to bother you, can I have a black coffee and would you happen to have change?"}
    ],
    swaps:[
      {label:"Swap for water",es:"Qué pena con usted, ¿me regala un vaso de agua?",en:"Sorry to bother you, can I have a glass of water?"},
      {label:"Swap for the bill",es:"Veci, ¿me regala la cuenta cuando pueda?",en:"Neighbor, can I have the bill when you can?"},
      {label:"Swap for directions",es:"Qué pena con usted, ¿será que me puede indicar la entrada?",en:"Sorry to bother you, could you possibly show me the entrance?"}
    ]
  },
  plata:{
    title:"Ask prices and negotiate naturally",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Cuánto cuesta?",en:"How much does it cost?"},
      {tag:"2. + Specific item",es:"¿Cuánto cuestan estas arepas?",en:"How much do these arepas cost?"},
      {tag:"3. + Quantity request",es:"¿Cuánto cuestan estas arepas? Me regala dos, por favor.",en:"How much do these arepas cost? Can I have two, please."},
      {tag:"4. + Payment question",es:"Me regala dos arepas, por favor. ¿Será que puedo pagar con tarjeta?",en:"Can I have two arepas, please. Could I pay by card?"}
    ],
    swaps:[
      {label:"Pay cash",es:"Pago en efectivo; ¿tiene cambio de cincuenta mil?",en:"I'll pay in cash; do you have change for fifty thousand?"},
      {label:"Ask total",es:"Listo, ¿cuánto le debo por todo?",en:"Great, how much do I owe you for everything?"},
      {label:"Ask discount",es:"Está un poquito caro; ¿me hace un descuento?",en:"It's a little expensive; can you give me a discount?"}
    ]
  },
  "survival-communication":{
    title:"Repair a fast conversation without freezing",
    rungs:[
      {tag:"1. Anchor stem",es:"No entendí.",en:"I didn't understand."},
      {tag:"2. + Polite request",es:"Disculpe, no entendí bien.",en:"Excuse me, I didn't quite understand."},
      {tag:"3. + Ask to slow down",es:"Disculpe, no entendí bien. ¿Me puede hablar más despacito?",en:"Excuse me, I didn't quite understand. Can you speak more slowly to me?"},
      {tag:"4. + Explain why",es:"Disculpe, ¿me lo puede repetir más despacito? Es que todavía estoy aprendiendo español.",en:"Excuse me, can you repeat it more slowly for me? It's just that I'm still learning Spanish."}
    ],
    swaps:[
      {label:"Buy time",es:"Espéreme un momentico, déjeme pensar.",en:"Wait for me just a moment, let me think."},
      {label:"Ask meaning",es:"Perdón, ¿qué quiere decir esa palabra?",en:"Sorry, what does that word mean?"},
      {label:"Check yourself",es:"¿Así está bien o cómo se dice?",en:"Is it okay like this, or how do you say it?"}
    ]
  },
  "uber-ride":{
    title:"Confirm your Uber pickup and destination",
    rungs:[
      {tag:"1. Anchor stem",es:"Voy para…",en:"I'm headed to…"},
      {tag:"2. + Destination",es:"Voy para este hotel.",en:"I'm headed to this hotel."},
      {tag:"3. + Pickup location",es:"Buenas, estoy al frente y voy para este hotel.",en:"Hi, I'm out front and I'm headed to this hotel."},
      {tag:"4. + Polite instruction",es:"Buenas, estoy al frente del edificio. Voy para este hotel; ¿me avisa cuando lleguemos?",en:"Hi, I'm in front of the building. I'm going to this hotel; can you let me know when we arrive?"}
    ],
    swaps:[
      {label:"Drop-off",es:"¿Me puede dejar aquí en la esquina, por favor?",en:"Can you drop me off here on the corner, please?"},
      {label:"Check traffic",es:"¿Hay mucho trancón por esta avenida?",en:"Is there a lot of traffic on this avenue?"},
      {label:"Wrong entrance",es:"Creo que la entrada queda por allá; ¿se devuelve un poquito?",en:"I think the entrance is over there; can you go back a little?"}
    ]
  },
  "action-chunks":{
    title:"Snap action stems onto infinitives",
    rungs:[
      {tag:"1. Anchor stem",es:"Tengo que…",en:"I have to…"},
      {tag:"2. + Infinitive + object",es:"Tengo que pasar por el mercado.",en:"I have to stop by the market."},
      {tag:"3. + Second clause",es:"Quiero ir para la casa, pero tengo que pasar por el mercado.",en:"I want to go home, but I have to stop by the market."},
      {tag:"4. + Time + follow-up",es:"Quiero ir para la casa, pero primero tengo que pasar por el mercado; te aviso ahorita.",en:"I want to go home, but first I have to stop by the market; I'll let you know shortly."}
    ],
    swaps:[
      {label:"Use Necesito",es:"Necesito encontrar la dirección antes de salir.",en:"I need to find the address before leaving."},
      {label:"Use Me toca",es:"Hoy me toca trabajar hasta tarde en la oficina.",en:"Today I have to work late at the office."},
      {label:"Use Acabo de",es:"Acabo de llegar al hotel y voy a descansar.",en:"I just arrived at the hotel and I'm going to rest."}
    ]
  }
};

/* ── 3-Column Interactive Slot-Swap Matrices (Constructor de Frases) ────────
   Lets learners physically tap 1 opener + 1 core action + 1 connector/reason
   to assemble dozens of real Colombian sentences and speak them out loud. */
const SLOT_SWAP_MATRICES=[
  {
    id:"survival-polite",
    title:"🇨🇴 Polite Requests & Survival",
    sub:"Combine a Colombian opener + what you need + why",
    col1Title:"1. Opener / Stem",
    col2Title:"2. Action / Need",
    col3Title:"3. Context / Reason",
    col1:[
      {es:"Qué pena con usted, necesito",en:"Sorry to bother you, I need"},
      {es:"Disculpe, ¿será que puedo",en:"Excuse me, could I possibly"},
      {es:"Buenas, veci, quisiera",en:"Hi neighbor, I would like"},
      {es:"Perdón, tengo que",en:"Sorry, I have to"}
    ],
    col2:[
      {es:"pedir un Uber para el hotel",en:"to order an Uber to the hotel"},
      {es:"confirmar esta dirección",en:"to confirm this address"},
      {es:"pagar la cuenta con tarjeta",en:"to pay the bill by card"},
      {es:"cambiar la reserva para mañana",en:"to change the reservation for tomorrow"}
    ],
    col3:[
      {es:"porque voy un poquito tarde.",en:"because I'm running a little late."},
      {es:"pero todavía no tengo buena señal.",en:"but I still don't have good signal."},
      {es:"antes de que empiece el trancón.",en:"before the traffic jam starts."},
      {es:"si me hace el favor.",en:"if you'd do me the favor."}
    ]
  },
  {
    id:"daily-plans",
    title:"📆 Plans, Work & Daily Flow",
    sub:"Talk about what you're doing now and next",
    col1Title:"1. Time + Stem",
    col2Title:"2. Core Action",
    col3Title:"3. Connector + Follow-up",
    col1:[
      {es:"Ahorita voy a",en:"Right now I'm going to"},
      {es:"Después del trabajo quiero",en:"After work I want"},
      {es:"Hoy me toca",en:"Today I have to"},
      {es:"En este momento estoy tratando de",en:"Right now I'm trying to"}
    ],
    col2:[
      {es:"pasar por el mercado",en:"to stop by the market"},
      {es:"terminar el informe de la oficina",en:"to finish the office report"},
      {es:"tomar un tintico con unos amigos",en:"to have a coffee with some friends"},
      {es:"buscar la entrada del edificio",en:"to look for the building entrance"}
    ],
    col3:[
      {es:"y te aviso en cuanto llegue.",en:"and I'll let you know as soon as I arrive."},
      {es:"pero primero tengo una reunión.",en:"but first I have a meeting."},
      {es:"porque mañana salgo temprano.",en:"because tomorrow I leave early."},
      {es:"así que nos vemos en un ratico.",en:"so I'll see you in a little while."}
    ]
  },
  {
    id:"past-stories",
    title:"⏮️ Telling What Happened (Past)",
    sub:"Combine a past event with background context",
    col1Title:"1. Past Anchor",
    col2Title:"2. What Happened",
    col3Title:"3. Background / Result",
    col1:[
      {es:"Ayer fui a",en:"Yesterday I went to"},
      {es:"Anoche tuve que",en:"Last night I had to"},
      {es:"Esta mañana iba a",en:"This morning I was going to"},
      {es:"Hace un ratico acabé de",en:"A little while ago I finished"}
    ],
    col2:[
      {es:"hacer una vuelta en el centro",en:"run an errand downtown"},
      {es:"llamar al técnico del apartamento",en:"call the apartment technician"},
      {es:"comprar comida para la cena",en:"buy food for dinner"},
      {es:"hablar con mi compañero de trabajo",en:"talk with my coworker"}
    ],
    col3:[
      {es:"porque estaba lloviendo muy fuerte.",en:"because it was raining very hard."},
      {es:"pero había mucho trancón en la avenida.",en:"but there was a lot of traffic on the avenue."},
      {es:"entonces llegué a la casa un poco cansado.",en:"so I arrived home a little tired."},
      {es:"mientras esperaba el carro.",en:"while I was waiting for the car."}
    ]
  }
];


/* ═══════════════════════════════════════════════════════════════════════════
   v91.0 Curriculum & Conversational Expansion:
   1. 10 Essential Conversational Verbs in VERBS (25 verbs total)
   2. 5 Real-Life Colombian Scenarios (Aeropuerto, Pagos/Nequi, Barbería, Médico, Portería/Rappi)
   3. Complete 4-Rung Sentence Expansion Ladders (SENTENCE_LADDERS) for all 52 lessons
   4. 4 New Interactive 3-Column Slot-Swap Matrices (7 matrices total)
   5. Context-locked Conversation & Fill-in-the-Blank Quiz Items
   ═══════════════════════════════════════════════════════════════════════════ */
Object.assign(VERBS,{
  decir:{en:"to say / to tell",type:"IR — Irregular",icon:"💬",color:"#4aa8a0",
    gerund:{f:"diciendo",en:"saying / telling"},participle:{f:"dicho",en:"said / told (irregular!)"},
    imperative:{tu:{f:"¡Di!",en:"Say / Tell! (informal)"},usted:{f:"¡Diga!",en:"Say / Tell! (formal)"}},
    present:[{p:"yo",v:"digo",e:"I say/tell"},{p:"tú",v:"dices",e:"you say/tell"},{p:"él/ella/ud.",v:"dice",e:"he/she says/tells"},{p:"nosotros",v:"decimos",e:"we say/tell"},{p:"ellos/uds.",v:"dicen",e:"they say/tell"}],
    past:[{p:"yo",v:"dije",e:"I said/told"},{p:"tú",v:"dijiste",e:"you said/told"},{p:"él/ella/ud.",v:"dijo",e:"he/she said/told"},{p:"nosotros",v:"dijimos",e:"we said/told"},{p:"ellos/uds.",v:"dijeron",e:"they said/told"}],
    imperfect:[{p:"yo",v:"decía",e:"I was saying / used to say"},{p:"tú",v:"decías",e:"you were saying"},{p:"él/ella/ud.",v:"decía",e:"he/she was saying"},{p:"nosotros",v:"decíamos",e:"we were saying"},{p:"ellos/uds.",v:"decían",e:"they were saying"}],
    future:[{p:"yo",v:"diré",e:"I will say/tell"},{p:"tú",v:"dirás",e:"you will say/tell"},{p:"él/ella/ud.",v:"dirá",e:"he/she will say/tell"},{p:"nosotros",v:"diremos",e:"we will say/tell"},{p:"ellos/uds.",v:"dirán",e:"they will say/tell"}],
    family:[{f:"el dicho",e:"saying / proverb",t:"sustantivo"},{f:"querer decir",e:"to mean",t:"expresión"},{f:"es decir",e:"that is to say",t:"conector"},{f:"dígame",e:"tell me (formal phone/service)",t:"expresión"}],
    example:{es:"¿Cómo se dice esto en español?",en:"How do you say this in Spanish?"}},
  venir:{en:"to come",type:"IR — Irregular",icon:"👋",color:"#34d399",
    gerund:{f:"viniendo",en:"coming"},participle:{f:"venido",en:"come"},
    imperative:{tu:{f:"¡Ven!",en:"Come! (informal)"},usted:{f:"¡Venga!",en:"Come! (formal)"}},
    present:[{p:"yo",v:"vengo",e:"I come"},{p:"tú",v:"vienes",e:"you come"},{p:"él/ella/ud.",v:"viene",e:"he/she comes"},{p:"nosotros",v:"venimos",e:"we come"},{p:"ellos/uds.",v:"vienen",e:"they come"}],
    past:[{p:"yo",v:"vine",e:"I came"},{p:"tú",v:"viniste",e:"you came"},{p:"él/ella/ud.",v:"vino",e:"he/she came"},{p:"nosotros",v:"vinimos",e:"we came"},{p:"ellos/uds.",v:"vinieron",e:"they came"}],
    imperfect:[{p:"yo",v:"venía",e:"I was coming / used to come"},{p:"tú",v:"venías",e:"you were coming"},{p:"él/ella/ud.",v:"venía",e:"he/she was coming"},{p:"nosotros",v:"veníamos",e:"we were coming"},{p:"ellos/uds.",v:"venían",e:"they were coming"}],
    future:[{p:"yo",v:"vendré",e:"I will come"},{p:"tú",v:"vendrás",e:"you will come"},{p:"él/ella/ud.",v:"vendrá",e:"he/she will come"},{p:"nosotros",v:"vendremos",e:"we will come"},{p:"ellos/uds.",v:"vendrán",e:"they will come"}],
    family:[{f:"la venida",e:"arrival / coming",t:"sustantivo"},{f:"bienvenido/a",e:"welcome",t:"adjetivo"},{f:"el porvenir",e:"future",t:"sustantivo"},{f:"venga le digo",e:"come here, let me tell you (Colombian!)",t:"expresión"}],
    example:{es:"Vengo de Estados Unidos por turismo.",en:"I come from the United States for tourism."}},
  salir:{en:"to leave / to go out",type:"IR — Irregular yo",icon:"🚪",color:"#f59e0b",
    gerund:{f:"saliendo",en:"leaving / going out"},participle:{f:"salido",en:"left / gone out"},
    imperative:{tu:{f:"¡Sal!",en:"Leave / Go out! (informal)"},usted:{f:"¡Salga!",en:"Leave / Come out! (formal)"}},
    present:[{p:"yo",v:"salgo",e:"I leave / go out"},{p:"tú",v:"sales",e:"you leave / go out"},{p:"él/ella/ud.",v:"sale",e:"he/she leaves"},{p:"nosotros",v:"salimos",e:"we leave / go out"},{p:"ellos/uds.",v:"salen",e:"they leave / go out"}],
    past:[{p:"yo",v:"salí",e:"I left / went out"},{p:"tú",v:"saliste",e:"you left"},{p:"él/ella/ud.",v:"salió",e:"he/she left"},{p:"nosotros",v:"salimos",e:"we left"},{p:"ellos/uds.",v:"salieron",e:"they left"}],
    imperfect:[{p:"yo",v:"salía",e:"I was leaving / used to go out"},{p:"tú",v:"salías",e:"you were leaving"},{p:"él/ella/ud.",v:"salía",e:"he/she was leaving"},{p:"nosotros",v:"salíamos",e:"we were leaving"},{p:"ellos/uds.",v:"salían",e:"they were leaving"}],
    future:[{p:"yo",v:"saldré",e:"I will leave"},{p:"tú",v:"saldrás",e:"you will leave"},{p:"él/ella/ud.",v:"saldrá",e:"he/she will leave"},{p:"nosotros",v:"saldremos",e:"we will leave"},{p:"ellos/uds.",v:"saldrán",e:"they will leave"}],
    family:[{f:"la salida",e:"exit / departure / outing",t:"sustantivo"},{f:"salir con amigos",e:"to go out with friends",t:"expresión"},{f:"salir bien",e:"to turn out well",t:"expresión"},{f:"ya le sale",e:"it's coming right out for you (Colombian!)",t:"expresión"}],
    example:{es:"Salgo del trabajo a las cinco.",en:"I leave work at five."}},
  saber:{en:"to know (facts / how to)",type:"ER — Irregular",icon:"🧠",color:"#60a5fa",
    gerund:{f:"sabiendo",en:"knowing"},participle:{f:"sabido",en:"known"},
    imperative:{tu:{f:"¡Sabe!",en:"Know! (rare)"},usted:{f:"¡Sepa!",en:"Know! (formal)"}},
    present:[{p:"yo",v:"sé",e:"I know"},{p:"tú",v:"sabes",e:"you know"},{p:"él/ella/ud.",v:"sabe",e:"he/she knows"},{p:"nosotros",v:"sabemos",e:"we know"},{p:"ellos/uds.",v:"saben",e:"they know"}],
    past:[{p:"yo",v:"supe",e:"I found out"},{p:"tú",v:"supiste",e:"you found out"},{p:"él/ella/ud.",v:"supo",e:"he/she found out"},{p:"nosotros",v:"supimos",e:"we found out"},{p:"ellos/uds.",v:"supieron",e:"they found out"}],
    imperfect:[{p:"yo",v:"sabía",e:"I knew"},{p:"tú",v:"sabías",e:"you knew"},{p:"él/ella/ud.",v:"sabía",e:"he/she knew"},{p:"nosotros",v:"sabíamos",e:"we knew"},{p:"ellos/uds.",v:"sabían",e:"they knew"}],
    future:[{p:"yo",v:"sabré",e:"I will know"},{p:"tú",v:"sabrás",e:"you will know"},{p:"él/ella/ud.",v:"sabrá",e:"he/she will know"},{p:"nosotros",v:"sabremos",e:"we will know"},{p:"ellos/uds.",v:"sabrán",e:"they will know"}],
    family:[{f:"el saber",e:"knowledge",t:"sustantivo"},{f:"sabio/a",e:"wise",t:"adjetivo"},{f:"no sé",e:"I don't know",t:"expresión"},{f:"¿quién sabe?",e:"who knows?",t:"expresión"}],
    example:{es:"No sé dónde queda la entrada.",en:"I don't know where the entrance is."}},
  conocer:{en:"to know (people / places) / meet",type:"ER — Irregular yo",icon:"🤝",color:"#a78bfa",
    gerund:{f:"conociendo",en:"knowing / meeting"},participle:{f:"conocido",en:"known / met"},
    imperative:{tu:{f:"¡Conoce!",en:"Meet / Get to know!"},usted:{f:"¡Conozca!",en:"Meet / Get to know! (formal)"}},
    present:[{p:"yo",v:"conozco",e:"I know / meet"},{p:"tú",v:"conoces",e:"you know"},{p:"él/ella/ud.",v:"conoce",e:"he/she knows"},{p:"nosotros",v:"conocemos",e:"we know"},{p:"ellos/uds.",v:"conocen",e:"they know"}],
    past:[{p:"yo",v:"conocí",e:"I met / visited"},{p:"tú",v:"conociste",e:"you met"},{p:"él/ella/ud.",v:"conoció",e:"he/she met"},{p:"nosotros",v:"conocimos",e:"we met"},{p:"ellos/uds.",v:"conocieron",e:"they met"}],
    imperfect:[{p:"yo",v:"conocía",e:"I knew (person/place)"},{p:"tú",v:"conocías",e:"you knew"},{p:"él/ella/ud.",v:"conocía",e:"he/she knew"},{p:"nosotros",v:"conocíamos",e:"we knew"},{p:"ellos/uds.",v:"conocían",e:"they knew"}],
    future:[{p:"yo",v:"conoceré",e:"I will know / meet"},{p:"tú",v:"conocerás",e:"you will know"},{p:"él/ella/ud.",v:"conocerá",e:"he/she will know"},{p:"nosotros",v:"conoceremos",e:"we will know"},{p:"ellos/uds.",v:"conocerán",e:"they will know"}],
    family:[{f:"el conocimiento",e:"knowledge",t:"sustantivo"},{f:"conocido/a",e:"acquaintance / well-known",t:"sustantivo/adj"},{f:"desconocido/a",e:"stranger / unknown",t:"sustantivo/adj"},{f:"mucho gusto en conocerte",e:"nice to meet you",t:"expresión"}],
    example:{es:" Todavía no conozco bien el barrio.",en:"I still don't know the neighborhood well."}},
  dar:{en:"to give",type:"AR — Irregular",icon:"🎁",color:"#ec4899",
    gerund:{f:"dando",en:"giving"},participle:{f:"dado",en:"given"},
    imperative:{tu:{f:"¡Da! / ¡Dame!",en:"Give! / Give me!"},usted:{f:"¡Dé! / ¡Deme!",en:"Give! / Give me! (formal)"}},
    present:[{p:"yo",v:"doy",e:"I give"},{p:"tú",v:"das",e:"you give"},{p:"él/ella/ud.",v:"da",e:"he/she gives"},{p:"nosotros",v:"damos",e:"we give"},{p:"ellos/uds.",v:"dan",e:"they give"}],
    past:[{p:"yo",v:"di",e:"I gave"},{p:"tú",v:"diste",e:"you gave"},{p:"él/ella/ud.",v:"dio",e:"he/she gave"},{p:"nosotros",v:"dimos",e:"we gave"},{p:"ellos/uds.",v:"dieron",e:"they gave"}],
    imperfect:[{p:"yo",v:"daba",e:"I was giving / used to give"},{p:"tú",v:"dabas",e:"you were giving"},{p:"él/ella/ud.",v:"daba",e:"he/she was giving"},{p:"nosotros",v:"dábamos",e:"we were giving"},{p:"ellos/uds.",v:"daban",e:"they were giving"}],
    future:[{p:"yo",v:"daré",e:"I will give"},{p:"tú",v:"darás",e:"you will give"},{p:"él/ella/ud.",v:"dará",e:"he/she will give"},{p:"nosotros",v:"daremos",e:"we will give"},{p:"ellos/uds.",v:"darán",e:"they will give"}],
    family:[{f:"el dato",e:"fact / piece of info",t:"sustantivo"},{f:"darse cuenta",e:"to realize",t:"expresión"},{f:"dar una vuelta",e:"to take a walk / ride",t:"expresión"},{f:"¿me da la cuenta?",e:"can you give me the bill?",t:"expresión"}],
    example:{es:"¿Me da un recibo, por favor?",en:"Can you give me a receipt, please?"}},
  poner:{en:"to put / to place",type:"ER — Irregular",icon:"📍",color:"#f97316",
    gerund:{f:"poniendo",en:"putting"},participle:{f:"puesto",en:"put / placed (irregular!)"},
    imperative:{tu:{f:"¡Pon!",en:"Put! (informal)"},usted:{f:"¡Ponga!",en:"Put! (formal)"}},
    present:[{p:"yo",v:"pongo",e:"I put"},{p:"tú",v:"pones",e:"you put"},{p:"él/ella/ud.",v:"pone",e:"he/she puts"},{p:"nosotros",v:"ponemos",e:"we put"},{p:"ellos/uds.",v:"ponen",e:"they put"}],
    past:[{p:"yo",v:"puse",e:"I put"},{p:"tú",v:"pusiste",e:"you put"},{p:"él/ella/ud.",v:"puso",e:"he/she put"},{p:"nosotros",v:"pusimos",e:"we put"},{p:"ellos/uds.",v:"pusieron",e:"they put"}],
    imperfect:[{p:"yo",v:"ponía",e:"I was putting / used to put"},{p:"tú",v:"ponías",e:"you were putting"},{p:"él/ella/ud.",v:"ponía",e:"he/she was putting"},{p:"nosotros",v:"poníamos",e:"we were putting"},{p:"ellos/uds.",v:"ponían",e:"they were putting"}],
    future:[{p:"yo",v:"pondré",e:"I will put"},{p:"tú",v:"pondrás",e:"you will put"},{p:"él/ella/ud.",v:"pondrá",e:"he/she will put"},{p:"nosotros",v:"pondremos",e:"we will put"},{p:"ellos/uds.",v:"pondrán",e:"they will put"}],
    family:[{f:"el puesto",e:"stall / seat / position",t:"sustantivo"},{f:"ponerse",e:"to put on (clothes) / become",t:"verbo"},{f:"póngale cuidado",e:"pay attention (Colombian!)",t:"expresión"},{f:"no le ponga azúcar",e:"don't put sugar in it",t:"expresión"}],
    example:{es:"No le ponga azúcar al tinto, por favor.",en:"Don't put sugar in the coffee, please."}},
  pedir:{en:"to ask for / to order",type:"IR — Stem-change (e→i)",icon:"🍽️",color:"#e8b44a",
    gerund:{f:"pidiendo",en:"asking for / ordering"},participle:{f:"pedido",en:"asked for / ordered"},
    imperative:{tu:{f:"¡Pide!",en:"Ask for / Order! (informal)"},usted:{f:"¡Pida!",en:"Ask for / Order! (formal)"}},
    present:[{p:"yo",v:"pido",e:"I ask for / order"},{p:"tú",v:"pides",e:"you ask for / order"},{p:"él/ella/ud.",v:"pide",e:"he/she asks for / orders"},{p:"nosotros",v:"pedimos",e:"we ask for / order"},{p:"ellos/uds.",v:"piden",e:"they ask for / order"}],
    past:[{p:"yo",v:"pedí",e:"I asked for / ordered"},{p:"tú",v:"pediste",e:"you ordered"},{p:"él/ella/ud.",v:"pidió",e:"he/she ordered"},{p:"nosotros",v:"pedimos",e:"we ordered"},{p:"ellos/uds.",v:"pidieron",e:"they ordered"}],
    imperfect:[{p:"yo",v:"pedía",e:"I was ordering / used to ask for"},{p:"tú",v:"pedías",e:"you were ordering"},{p:"él/ella/ud.",v:"pedía",e:"he/she was ordering"},{p:"nosotros",v:"pedíamos",e:"we were ordering"},{p:"ellos/uds.",v:"pedían",e:"they were ordering"}],
    future:[{p:"yo",v:"pediré",e:"I will order"},{p:"tú",v:"pedirás",e:"you will order"},{p:"él/ella/ud.",v:"pedirá",e:"he/she will order"},{p:"nosotros",v:"pediremos",e:"we will order"},{p:"ellos/uds.",v:"pedirán",e:"they will order"}],
    family:[{f:"el pedido",e:"order (food/delivery)",t:"sustantivo"},{f:"pedir perdón",e:"to apologize",t:"expresión"},{f:"pedir un Uber",e:"to order an Uber",t:"expresión"},{f:"pedir un domicilio",e:"to order delivery (Colombian!)",t:"expresión"}],
    example:{es:"Voy a pedir un domicilio por Rappi.",en:"I'm going to order delivery on Rappi."}},
  entender:{en:"to understand",type:"ER — Stem-change (e→ie)",icon:"💡",color:"#06b6d4",
    gerund:{f:"entendiendo",en:"understanding"},participle:{f:"entendido",en:"understood"},
    imperative:{tu:{f:"¡Entiende!",en:"Understand! (informal)"},usted:{f:"¡Entienda!",en:"Understand! (formal)"}},
    present:[{p:"yo",v:"entiendo",e:"I understand"},{p:"tú",v:"entiendes",e:"you understand"},{p:"él/ella/ud.",v:"entiende",e:"he/she understands"},{p:"nosotros",v:"entendemos",e:"we understand"},{p:"ellos/uds.",v:"entienden",e:"they understand"}],
    past:[{p:"yo",v:"entendí",e:"I understood"},{p:"tú",v:"entendiste",e:"you understood"},{p:"él/ella/ud.",v:"entendió",e:"he/she understood"},{p:"nosotros",v:"entendimos",e:"we understood"},{p:"ellos/uds.",v:"entendieron",e:"they understood"}],
    imperfect:[{p:"yo",v:"entendía",e:"I understood / was understanding"},{p:"tú",v:"entendías",e:"you understood"},{p:"él/ella/ud.",v:"entendía",e:"he/she understood"},{p:"nosotros",v:"entendíamos",e:"we understood"},{p:"ellos/uds.",v:"entendían",e:"they understood"}],
    future:[{p:"yo",v:"entenderé",e:"I will understand"},{p:"tú",v:"entenderás",e:"you will understand"},{p:"él/ella/ud.",v:"entenderá",e:"he/she will understand"},{p:"nosotros",v:"entenderemos",e:"we will understand"},{p:"ellos/uds.",v:"entenderán",e:"they will understand"}],
    family:[{f:"el entendimiento",e:"understanding",t:"sustantivo"},{f:"entendido/a",e:"understood / expert",t:"adjetivo"},{f:"no entendí",e:"I didn't understand",t:"expresión"},{f:"¿sí me entiende?",e:"do you see what I mean? (Colombian!)",t:"expresión"}],
    example:{es:"Disculpe, no entendí bien. ¿Me repite?",en:"Excuse me, I didn't quite understand. Can you repeat for me?"}},
  llamar:{en:"to call",type:"AR — Regular",icon:"📞",color:"#10b981",
    gerund:{f:"llamando",en:"calling"},participle:{f:"llamado",en:"called"},
    imperative:{tu:{f:"¡Llama!",en:"Call! (informal)"},usted:{f:"¡Llame!",en:"Call! (formal)"}},
    present:[{p:"yo",v:"llamo",e:"I call"},{p:"tú",v:"llamas",e:"you call"},{p:"él/ella/ud.",v:"llama",e:"he/she calls"},{p:"nosotros",v:"llamamos",e:"we call"},{p:"ellos/uds.",v:"llaman",e:"they call"}],
    past:[{p:"yo",v:"llamé",e:"I called"},{p:"tú",v:"llamaste",e:"you called"},{p:"él/ella/ud.",v:"llamó",e:"he/she called"},{p:"nosotros",v:"llamamos",e:"we called"},{p:"ellos/uds.",v:"llamaron",e:"they called"}],
    imperfect:[{p:"yo",v:"llamaba",e:"I was calling / used to call"},{p:"tú",v:"llamabas",e:"you were calling"},{p:"él/ella/ud.",v:"llamaba",e:"he/she was calling"},{p:"nosotros",v:"llamábamos",e:"we were calling"},{p:"ellos/uds.",v:"llamaban",e:"they were calling"}],
    future:[{p:"yo",v:"llamaré",e:"I will call"},{p:"tú",v:"llamarás",e:"you will call"},{p:"él/ella/ud.",v:"llamará",e:"he/she will call"},{p:"nosotros",v:"llamaremos",e:"we will call"},{p:"ellos/uds.",v:"llamarán",e:"they will call"}],
    family:[{f:"la llamada",e:"phone call",t:"sustantivo"},{f:"llamarse",e:"to be named",t:"verbo reflexivo"},{f:"devolver la llamada",e:"to call back",t:"expresión"},{f:"te llamo ahorita",e:"I'll call you shortly",t:"expresión"}],
    example:{es:"Te llamo ahorita cuando salga de la reunión.",en:"I'll call you shortly when I get out of the meeting."}}
});

/* ── 5 New Real-Life Colombian Scenarios (Phrases, Dialogues, Readings, Missions, Lessons) ── */
FRASES.push(
  {section:"🛬 Aeropuerto y migración",quizCat:"aeropuerto",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[
    {es:"Vengo por turismo y a visitar amigos.",en:"I'm coming for tourism and to visit friends.",register:"Travel · formal"},
    {es:"Me voy a quedar dos semanas en el país.",en:"I am going to stay in the country for two weeks.",register:"Travel · formal"},
    {es:"Aquí tiene mi pasaporte y la reserva del hotel.",en:"Here is my passport and the hotel reservation.",register:"Travel · formal"},
    {es:"¿Por dónde queda el reclamo de equipaje?",en:"Where is the baggage claim located?",register:"Travel · everyday"},
    {es:"Mi maleta todavía no ha salido por la banda.",en:"My suitcase still hasn't come out on the belt.",register:"Travel · everyday"},
    {es:"¿En qué puerta me recoge el Uber?",en:"At which door does the Uber pick me up?",register:"Colombian · everyday"}
  ]},
  {section:"💳 Nequi, datáfono y pagos",quizCat:"bancos-pagos",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[
    {es:"¿Puedo pagar con tarjeta o por Nequi?",en:"Can I pay by card or with Nequi?",register:"Colombian · everyday"},
    {es:"Con tarjeta de crédito, a una sola cuota, por favor.",en:"By credit card, in a single installment, please.",register:"Colombian · everyday"},
    {es:"Cuenta de ahorros, por favor.",en:"Savings account, please.",register:"Colombian · everyday"},
    {es:"Sí, puede incluir el servicio en la cuenta.",en:"Yes, you can include the tip/service charge on the bill.",register:"Colombian · polite"},
    {es:"Sin factura electrónica; consumidor final, por favor.",en:"No electronic invoice needed; final consumer, please.",register:"Colombian · everyday"},
    {es:"¿Me acerca el datáfono, por favor?",en:"Can you bring the card machine over to me, please?",register:"Colombian · polite"}
  ]},
  {section:"💈 Peluquería y barbería",quizCat:"barberia",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[
    {es:"Buenas, ¿tiene turno disponible ahorita?",en:"Hi, do you have an opening available right now?",register:"Colombian · everyday"},
    {es:"Quiero un corte bajito a los lados con la dos.",en:"I want a low cut on the sides with a #2 guard.",register:"Colombian · everyday"},
    {es:"Arriba solo bájeme un poquito con tijera.",en:"On top just trim a little bit with scissors.",register:"Colombian · everyday"},
    {es:"¿Me hace un desvanecido limpio atrás?",en:"Can you give me a clean fade in the back?",register:"Colombian · everyday"},
    {es:"También quiero arreglarme y perfilar la barba.",en:"I also want to trim and line up my beard.",register:"Everyday"},
    {es:"Así quedó perfecto, muchas gracias.",en:"That turned out perfect, thank you very much.",register:"Polite"}
  ]},
  {section:"🩺 Cita médica y urgencias",quizCat:"medico",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[
    {es:"Vengo a consulta porque me siento mal desde ayer.",en:"I'm here for a consultation because I've felt sick since yesterday.",register:"Medical · formal"},
    {es:"Tengo dolor de estómago y un poco de fiebre.",en:"I have a stomachache and a slight fever.",register:"Medical"},
    {es:"No soy alérgico a ningún medicamento.",en:"I am not allergic to any medication.",register:"Medical"},
    {es:"¿Cada cuántas horas debo tomar esta pastilla?",en:"How many hours apart should I take this pill?",register:"Medical"},
    {es:"¿La debo tomar antes o después de las comidas?",en:"Should I take it before or after meals?",register:"Medical"},
    {es:"¿Necesito fórmula médica para comprar esto?",en:"Do I need a prescription to buy this?",register:"Colombian · medical"}
  ]},
  {section:"🏢 Portería, Rappi y apartamento",quizCat:"porteria",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[
    {es:"Buenas, vecino. Voy para el apartamento quinientos dos.",en:"Hi, doorman. I'm going to apartment 502.",register:"Colombian · everyday"},
    {es:"Estoy esperando un domicilio de Rappi; ¿me avisa cuando llegue?",en:"I'm waiting for a Rappi delivery; can you let me know when it arrives?",register:"Colombian · everyday"},
    {es:"¿Me autoriza la subida del domiciliario, por favor?",en:"Can you authorize the delivery driver to come up, please?",register:"Colombian · polite"},
    {es:"Se cayó el internet en el apartamento desde esta mañana.",en:"The internet has been down in the apartment since this morning.",register:"Everyday"},
    {es:"Parece que se fue el agua en todo el edificio.",en:"It seems the water went out in the whole building.",register:"Everyday"},
    {es:"¿Le puedo dejar este paquete aquí en portería?",en:"Can I leave this package here at the front desk?",register:"Colombian · polite"}
  ]}
);

CONVERSATIONS.push(
  v60Dialogue("Aeropuerto y migración","Passport control, length of stay, and finding baggage claim",[
    ["A","Buenos días. ¿Me permite su pasaporte, por favor? ¿Cuál es el motivo de su viaje?","Good morning. May I see your passport, please? What is the purpose of your trip?"],
    ["B","Buenos días, aquí tiene. Vengo por turismo y a visitar a unos amigos.","Good morning, here you go. I'm coming for tourism and to visit some friends."],
    ["A","¿Cuántos días se va a quedar en Colombia y dónde se va a hospedar?","How many days are you going to stay in Colombia and where will you be staying?"],
    ["B","Me voy a quedar dos semanas. Aquí tengo la dirección del hotel en Bogotá.","I'm going to stay two weeks. Here I have the address of the hotel in Bogotá."],
    ["A","Perfecto, bienvenido a Colombia. Siga adelante hacia el reclamo de equipaje.","Perfect, welcome to Colombia. Go ahead toward the baggage claim."],
    ["B","Muchas gracias, muy amable. ¿Por qué puerta salgo para pedir un taxi?","Thank you very much, very kind. Which door do I exit through to get a taxi?"]
  ],[{es:"Vengo por negocios durante diez días.",en:"I'm coming on business for ten days.",tts:"Vengo por negocios durante diez días."},{es:"Me quedo en un apartamento en Medellín.",en:"I'm staying at an apartment in Medellín.",tts:"Me quedo en un apartamento en Medellín."}]),
  v60Dialogue("Pagos con datáfono y Nequi","Paying by card in one installment, savings vs. checking, and Nequi",[
    ["A","Listo, señor. Son cuarenta y cinco mil pesos. ¿Desea incluir el servicio?","All set, sir. That's forty-five thousand pesos. Would you like to include the service charge?"],
    ["B","Sí, claro, inclúyalo por favor. ¿Puedo pagar con tarjeta o por Nequi?","Yes, of course, please include it. Can I pay by card or with Nequi?"],
    ["A","Claro que sí, ya le traigo el datáfono. ¿Ahorros, corriente o crédito?","Of course, I'll bring you the card terminal right away. Savings, checking, or credit?"],
    ["B","Con tarjeta de crédito, a una sola cuota, por favor.","With a credit card, in a single installment, please."],
    ["A","Perfecto. ¿Necesita factura electrónica a su nombre o consumidor final?","Perfect. Do you need an electronic invoice in your name or final consumer?"],
    ["B","Consumidor final está bien. Muchas gracias, qué buena atención.","Final consumer is fine. Thank you very much, great service."]
  ],[{es:"¿Me regala el número de Nequi o el código QR para transferirle?",en:"Can you give me the Nequi number or QR code to transfer to you?",tts:"¿Me regala el número de Nequi o el código QR para transferirle?"},{es:"A una cuota sin factura electrónica, por favor.",en:"One installment without an electronic invoice, please.",tts:"A una cuota sin factura electrónica, por favor."}]),
  v60Dialogue("En la barbería","Asking for a fade, scissor trim on top, and beard line-up",[
    ["A","Buenas, parcero. Siga y siéntese. ¿Cómo se lo vamos a cortar hoy?","Hi, buddy. Come in and have a seat. How are we going to cut it for you today?"],
    ["B","Buenas, maestro. Quiero un desvanecido bajito a los lados con la máquina dos.","Hi, boss. I want a low fade on the sides with a #2 guard."],
    ["A","Listo, de una. ¿Y arriba cómo lo quiere? ¿Le bajo bastante o solo las puntas?","Got it, right away. And how do you want it on top? Should I take a lot off or just the tips?"],
    ["B","Arriba solo bájeme un poquito con tijera para que quede parejo.","On top just take a little off with scissors so it looks even."],
    ["A","Perfecto. ¿Le arreglo y le perfilo también la barba?","Perfect. Shall I also trim and line up your beard?"],
    ["B","Sí, por favor, bájela un poquito y límpieme el cuello.","Yes, please, take it down a little and clean up my neck."]
  ],[{es:"Déjemelo natural atrás, sin subir mucho la máquina.",en:"Leave it natural in the back, without taking the clippers too high.",tts:"Déjemelo natural atrás, sin subir mucho la máquina."},{es:"Así quedó excelente, hermano. ¿Le pago en efectivo o por Nequi?",en:"That turned out excellent, brother. Do I pay you in cash or by Nequi?",tts:"Así quedó excelente, hermano. ¿Le pago en efectivo o por Nequi?"}]),
  v60Dialogue("Consulta médica y droguería","Explaining symptoms, duration, allergies, and medicine instructions",[
    ["A","Buenas tardes. Cuénteme, ¿qué síntomas tiene y desde cuándo se siente así?","Good afternoon. Tell me, what symptoms do you have and since when have you felt like this?"],
    ["B","Buenas tardes, doctora. Desde anoche tengo dolor de estómago y un poco de fiebre.","Good afternoon, doctor. Since last night I've had a stomachache and a slight fever."],
    ["A","Entiendo. ¿Ha tomado algún medicamento hoy o es alérgico a algo?","I understand. Have you taken any medication today or are you allergic to anything?"],
    ["B","No soy alérgico a nada; solo he tomado agua y suero oral esta mañana.","I'm not allergic to anything; I've only had water and oral rehydration salts this morning."],
    ["A","Le voy a formular estas pastillas. Tómese una cada ocho horas después de comer.","I'm going to prescribe these pills for you. Take one every eight hours after eating."],
    ["B","Perfecto, doctora. ¿Con esta fórmula las puedo comprar en cualquier droguería?","Perfect, doctor. With this prescription can I buy them at any pharmacy?"]
  ],[{es:"Me duele mucho la garganta al pasar saliva.",en:"My throat hurts a lot when I swallow.",tts:"Me duele mucho la garganta al pasar saliva."},{es:"¿Por cuántos días debo seguir el tratamiento?",en:"For how many days should I continue the treatment?",tts:"¿Por cuántos días debo seguir el tratamiento?"}]),
  v60Dialogue("Portería y domicilio Rappi","Talking to the building doorman, receiving Rappi, and reporting an issue",[
    ["A","Buenas tardes, vecino.Llegó un domiciliario de Rappi para el apartamento quinientos dos.","Good afternoon, neighbor. A Rappi delivery driver arrived for apartment 502."],
    ["B","Hola, don Carlos. Qué pena, ¿se lo puede recibir ahí en portería? Ya bajo en un momentico.","Hi, Don Carlos. Sorry to bother you, can you receive it there at the front desk? I'll come down in just a moment."],
    ["A","Claro que sí, tranquilo, yo se lo guardo aquí en recepción.","Of course, no worries, I'll keep it for you right here at the front desk."],
    ["B","Muchas gracias. Aprovecho para preguntarle: ¿se fue el agua en el edificio?","Thank you very much. While I have you, let me ask: did the water go out in the building?"],
    ["A","Sí, señor, están haciendo un arreglo en la tubería, pero vuelve en una hora.","Yes, sir, they are doing a repair on the pipe, but it comes back in an hour."],
    ["B","Listo, don Carlos, muy amable. Ya mismo bajo por el pedido.","Got it, Don Carlos, very kind of you. I'm coming right down for the order."]
  ],[{es:"Vecino, hoy viene un técnico a revisar el internet; ¿lo deja seguir?",en:"Doorman, a technician is coming today to check the internet; can you let him in?",tts:"Vecino, hoy viene un técnico a revisar el internet; ¿lo deja seguir?"},{es:"¿Llegó algún paquete o correspondencia para mi apartamento?",en:"Did any package or mail arrive for my apartment?",tts:"¿Llegó algún paquete o correspondencia para mi apartamento?"}])
);

READINGS.push(
  {id:"lectura-aeropuerto",level:"A2",title:"Llegada al aeropuerto El Dorado",lesson:"aeropuerto-migracion",intro:"Follow a traveler passing through Colombian immigration and picking up their ride.",lines:[
    {es:"Acabo de aterrizar en Bogotá y hago la fila para migración.",en:"I just landed in Bogotá and I get in line for immigration.",tts:"Acabo de aterrizar en Bogotá y hago la fila para migración."},
    {es:"El oficial me pide el pasaporte y me pregunta cuántos días me voy a quedar.",en:"The officer asks for my passport and asks how many days I am going to stay.",tts:"El oficial me pide el pasaporte y me pregunta cuántos días me voy a quedar."},
    {es:"Le explico que vengo por turismo durante dos semanas y le muestro la dirección del hotel.",en:"I explain that I am coming for tourism for two weeks and show him the hotel address.",tts:"Le explico que vengo por turismo durante dos semanas y le muestro la dirección del hotel."},
    {es:"Después recojo mi maleta en la banda y salgo al segundo piso para pedir mi Uber.",en:"Afterward I pick up my suitcase at the belt and go out to the second floor to order my Uber.",tts:"Después recojo mi maleta en la banda y salgo al segundo piso para pedir mi Uber."}
  ],questions:[{q:"¿Cuánto tiempo se va a quedar en Colombia?",choices:["Dos semanas","Dos meses","Tres días"],answer:"Dos semanas"}]},
  {id:"lectura-pagos",level:"A2",title:"Pagar la cuenta en Colombia",lesson:"bancos-pagos",intro:"Learn the three questions every Colombian cashier or waiter asks when you pay by card.",lines:[
    {es:"Cuando pido la cuenta en un restaurante, el mesero me pregunta si deseo incluir el servicio.",en:"When I ask for the bill at a restaurant, the waiter asks if I want to include the service charge.",tts:"Cuando pido la cuenta en un restaurante, el mesero me pregunta si deseo incluir el servicio."},
    {es:"Le digo que sí y le pido pagar con tarjeta en el datáfono.",en:"I tell him yes and ask to pay by card on the terminal.",tts:"Le digo que sí y le pido pagar con tarjeta en el datáfono."},
    {es:"Siempre me preguntan si es cuenta de ahorros, corriente o crédito y a cuántas cuotas.",en:"They always ask me if it is savings, checking, or credit and how many installments.",tts:"Siempre me preguntan si es cuenta de ahorros, corriente o crédito y a cuántas cuotas."},
    {es:"Respondo: a una sola cuota y consumidor final, por favor.",en:"I answer: in a single installment and final consumer, please.",tts:"Respondo: a una sola cuota y consumidor final, por favor."}
  ],questions:[{q:"¿Qué responde cuando le preguntan por las cuotas?",choices:["A una sola cuota","A doce cuotas","En efectivo"],answer:"A una sola cuota"}]},
  {id:"lectura-barberia",level:"A2",title:"Un corte en la barbería",lesson:"barberia",intro:"Read how to ask for a clean fade and trim in a neighborhood barbershop.",lines:[
    {es:"El sábado por la mañana voy a la barbería que queda a dos cuadras de mi casa.",en:"On Saturday morning I go to the barbershop that is two blocks from my house.",tts:"El sábado por la mañana voy a la barbería que queda a dos cuadras de mi casa."},
    {es:"Le pido al barbero un desvanecido bajito a los lados con la máquina número dos.",en:"I ask the barber for a low fade on the sides with a #2 clipper guard.",tts:"Le pido al barbero un desvanecido bajito a los lados con la máquina número dos."},
    {es:"Arriba solo quiero bajar un poquito las puntas con tijera.",en:"On top I only want to trim the tips a little bit with scissors.",tts:"Arriba solo quiero bajar un poquito las puntas con tijera."},
    {es:"Al final me perfila la barba y le pago por Nequi.",en:"At the end he lines up my beard and I pay him via Nequi.",tts:"Al final me perfila la barba y le pago por Nequi."}
  ],questions:[{q:"¿Cómo quiere el corte en la parte de arriba?",choices:["Un poquito con tijera","Rapado con la cero","Sin tocar nada"],answer:"Un poquito con tijera"}]},
  {id:"lectura-medico",level:"A2",title:"En la consulta médica",lesson:"medico-urgencias",intro:"Practice describing symptoms clearly and understanding dosage instructions.",lines:[
    {es:"Me desperté con dolor de estómago y fiebre, así que pedí una cita médica.",en:"I woke up with a stomachache and fever, so I scheduled a medical appointment.",tts:"Me desperté con dolor de estómago y fiebre, así que pedí una cita médica."},
    {es:"La doctora me pregunta desde cuándo me siento mal y si soy alérgico a algún medicamento.",en:"The doctor asks me since when I have felt sick and if I am allergic to any medication.",tts:"La doctora me pregunta desde cuándo me siento mal y si soy alérgico a algún medicamento."},
    {es:"Me receta unas pastillas que debo tomar cada ocho horas después de comer.",en:"She prescribes some pills that I must take every eight hours after eating.",tts:"Me receta unas pastillas que debo tomar cada ocho horas después de comer."},
    {es:"Paso por la droguería con la fórmula médica y regreso a casa a descansar.",en:"I stop by the pharmacy with the prescription and return home to rest.",tts:"Paso por la droguería con la fórmula médica y regreso a casa a descansar."}
  ],questions:[{q:"¿Cada cuánto debe tomar las pastillas?",choices:["Cada ocho horas","Una vez a la semana","Antes de dormir"],answer:"Cada ocho horas"}]},
  {id:"lectura-porteria",level:"A2",title:"La portería y el domicilio",lesson:"porteria-domicilios",intro:"Everyday building life in Colombia: talking to the portero and receiving deliveries.",lines:[
    {es:"En Colombia casi todos los edificios tienen una portería con vigilante las veinticuatro horas.",en:"In Colombia almost all apartment buildings have a front desk with a 24-hour doorman.",tts:"En Colombia casi todos los edificios tienen una portería con vigilante las veinticuatro horas."},
    {es:"Cuando pido comida por Rappi, el portero me llama por el citófono para avisarme.",en:"When I order food on Rappi, the doorman calls me on the intercom to let me know.",tts:"Cuando pido comida por Rappi, el portero me llama por el citófono para avisarme."},
    {es:"Si estoy ocupado en una reunión, le pido el favor de recibirme el paquete abajo.",en:"If I am busy in a meeting, I ask him the favor of receiving the package for me downstairs.",tts:"Si estoy ocupado en una reunión, le pido el favor de recibirme el paquete abajo."},
    {es:"Ahorita bajo un momentico, saludo al vecino y recojo mi pedido.",en:"Shortly I go down for a moment, greet the doorman, and pick up my order.",tts:"Ahorita bajo un momentico, saludo al vecino y recojo mi pedido."}
  ],questions:[{q:"¿Por dónde avisa el portero cuando llega el pedido?",choices:["Por el citófono","Por correo postal","En el aeropuerto"],answer:"Por el citófono"}]}
);

CONVERSATION_MISSIONS.push(
  {id:"migracion-llegada",title:"Responde en migración",scenario:"The immigration officer in Bogotá asks why you are visiting Colombia and how long you will stay.",prompt:"Responde con calma y muestra tu reserva:",lesson:"aeropuerto-migracion",models:[
    {es:"Buenos días. Vengo por turismo durante dos semanas y me voy a quedar en este hotel.",en:"Good morning. I am coming for tourism for two weeks and I am going to stay at this hotel.",tts:"Buenos días. Vengo por turismo durante dos semanas y me voy a quedar en este hotel."},
    {es:"Vengo a visitar a unos amigos por diez días; aquí tiene mi pasaporte y la dirección.",en:"I'm coming to visit some friends for ten days; here is my passport and the address.",tts:"Vengo a visitar a unos amigos por diez días; aquí tiene mi pasaporte y la dirección."}
  ]},
  {id:"pagar-datafono",title:"Paga con tarjeta en Colombia",scenario:"The waiter brings the bill and asks if you want to include the tip and how you will pay.",prompt:"Acepta el servicio y pide pagar a una cuota:",lesson:"bancos-pagos",models:[
    {es:"Sí, incluya el servicio, por favor. Pago con tarjeta de crédito a una sola cuota.",en:"Yes, include the service charge, please. I'll pay by credit card in a single installment.",tts:"Sí, incluya el servicio, por favor. Pago con tarjeta de crédito a una sola cuota."},
    {es:"Con tarjeta en el datáfono, cuenta de ahorros y sin factura electrónica, por favor.",en:"By card on the terminal, savings account and without an electronic invoice, please.",tts:"Con tarjeta en el datáfono, cuenta de ahorros y sin factura electrónica, por favor."}
  ]},
  {id:"corte-barberia",title:"Explica tu corte de pelo",scenario:"You sit down in a Colombian barbershop and the barber asks how you want your hair and beard.",prompt:"Explica cómo quieres los lados y la parte de arriba:",lesson:"barberia",models:[
    {es:"Quiero un desvanecido bajito a los lados con la dos, y arriba solo las puntas con tijera.",en:"I want a low fade on the sides with a #2, and on top just the tips with scissors.",tts:"Quiero un desvanecido bajito a los lados con la dos, y arriba solo las puntas con tijera."},
    {es:"Bájeme a los lados con máquina y arrégleme un poquito la barba, por favor.",en:"Take the sides down with clippers and trim my beard a little bit, please.",tts:"Bájeme a los lados con máquina y arrégleme un poquito la barba, por favor."}
  ]},
  {id:"consulta-medica",title:"Explica tus síntomas al médico",scenario:"You are at a medical consultation. Explain what hurts, since when, and ask how to take the medicine.",prompt:"Habla con la doctora:",lesson:"medico-urgencias",models:[
    {es:"Desde ayer tengo dolor de estómago y fiebre. ¿Cada cuántas horas debo tomar la pastilla?",en:"Since yesterday I've had a stomachache and fever. Every how many hours should I take the pill?",tts:"Desde ayer tengo dolor de estómago y fiebre. ¿Cada cuántas horas debo tomar la pastilla?"},
    {es:"Me siento muy cansado y me duele la garganta desde anoche; no soy alérgico a nada.",en:"I feel very tired and my throat has hurt since last night; I'm not allergic to anything.",tts:"Me siento muy cansado y me duele la garganta desde anoche; no soy alérgico a nada."}
  ]},
  {id:"porteria-rappi",title:"Habla con la portería",scenario:"Your Rappi delivery arrived while you are finishing a call. Ask the doorman to hold it for you for a moment.",prompt:"Dile al portero:",lesson:"porteria-domicilios",models:[
    {es:"Qué pena, vecino, ¿me puede recibir el pedido ahí en portería? Ya bajo en un momentico.",en:"Sorry to bother you, doorman, can you receive the order for me there at the front desk? I'll come down in a moment.",tts:"Qué pena, vecino, ¿me puede recibir el pedido ahí en portería? Ya bajo en un momentico."},
    {es:"Buenas, don Carlos. Estoy esperando un domicilio de Rappi; ¿me avisa cuando llegue?",en:"Hi, Don Carlos. I'm waiting for a Rappi delivery; can you let me know when it arrives?",tts:"Buenas, don Carlos. Estoy esperando un domicilio de Rappi; ¿me avisa cuando llegue?"}
  ]}
);

Object.assign(LESSON_CONTENT,{
  "aeropuerto-migracion":{
    goal:{es:"Vengo por turismo durante dos semanas y me voy a quedar en este hotel.",en:"I'm coming for tourism for two weeks and I'm going to stay at this hotel."},
    words:[{es:"vengo por turismo",en:"I come for tourism"},{es:"me voy a quedar",en:"I am going to stay"},{es:"dos semanas",en:"two weeks"},{es:"el reclamo de equipaje",en:"baggage claim"},{es:"la maleta",en:"suitcase"},{es:"la puerta de salida",en:"exit door"}],
    phrases:[{en:"I am coming for tourism.",es:"Vengo por turismo."},{en:"I am going to stay for two weeks.",es:"Me voy a quedar dos semanas."},{en:"Here is my passport and hotel reservation.",es:"Aquí tiene mi pasaporte y la reserva del hotel."},{en:"Where is the baggage claim?",es:"¿Por dónde queda el reclamo de equipaje?"}]
  },
  "bancos-pagos":{
    goal:{es:"Sí, incluya el servicio. Pago con tarjeta a una sola cuota, por favor.",en:"Yes, include the service charge. I'll pay by card in a single installment, please."},
    words:[{es:"el datáfono",en:"card terminal (Colombian)"},{es:"a una cuota",en:"one installment"},{es:"cuenta de ahorros",en:"savings account"},{es:"incluir el servicio",en:"include tip/service"},{es:"por Nequi",en:"via Nequi"},{es:"consumidor final",en:"final consumer (no tax ID invoice)"}],
    phrases:[{en:"Can I pay by card or with Nequi?",es:"¿Puedo pagar con tarjeta o por Nequi?"},{en:"In a single installment, please.",es:"A una sola cuota, por favor."},{en:"Savings account, please.",es:"Cuenta de ahorros, por favor."},{en:"Yes, you can include the service charge.",es:"Sí, puede incluir el servicio."}]
  },
  "barberia":{
    goal:{es:"Quiero un desvanecido bajito a los lados con la dos y arriba solo con tijera.",en:"I want a low fade on the sides with a #2 and on top only with scissors."},
    words:[{es:"un desvanecido",en:"a fade"},{es:"bajito a los lados",en:"low on the sides"},{es:"con la dos",en:"with a #2 guard"},{es:"con tijera",en:"with scissors"},{es:"solo las puntas",en:"just the tips"},{es:"perfilar la barba",en:"line up the beard"}],
    phrases:[{en:"Do you have an opening right now?",es:"¿Tiene turno disponible ahorita?"},{en:"I want it low on the sides with a #2.",es:"Lo quiero bajito a los lados con la dos."},{en:"On top just trim a little with scissors.",es:"Arriba solo bájeme un poquito con tijera."},{en:"Can you also line up my beard?",es:"¿Me perfila también la barba?"}]
  },
  "medico-urgencias":{
    goal:{es:"Tengo dolor de estómago desde anoche. ¿Cada cuántas horas debo tomar la pastilla?",en:"I've had a stomachache since last night. Every how many hours should I take the pill?"},
    words:[{es:"desde anoche",en:"since last night"},{es:"dolor de estómago",en:"stomachache"},{es:"soy alérgico/a",en:"I am allergic"},{es:"cada ocho horas",en:"every eight hours"},{es:"después de comer",en:"after eating"},{es:"la fórmula médica",en:"medical prescription"}],
    phrases:[{en:"I have felt sick since yesterday.",es:"Me siento mal desde ayer."},{en:"I am not allergic to any medication.",es:"No soy alérgico a ningún medicamento."},{en:"Every how many hours should I take it?",es:"¿Cada cuántas horas debo tomarla?"},{en:"Should I take it after eating?",es:"¿La debo tomar después de comer?"}]
  },
  "porteria-domicilios":{
    goal:{es:"Vecino, estoy esperando un domicilio de Rappi; ¿me lo recibe en portería?",en:"Doorman, I'm waiting for a Rappi delivery; can you hold it for me at the front desk?"},
    words:[{es:"la portería",en:"front desk / doorman station"},{es:"el domicilio",en:"delivery (Colombian)"},{es:"el citófono",en:"intercom"},{es:"se fue el agua",en:"the water went out"},{es:"se cayó el internet",en:"the internet went down"},{es:"ya bajo",en:"I'm coming right down"}],
    phrases:[{en:"I am waiting for a Rappi delivery.",es:"Estoy esperando un domicilio de Rappi."},{en:"Can you receive it for me at the front desk?",es:"¿Me lo puede recibir ahí en portería?"},{en:"I'll come down in just a moment.",es:"Ya bajo en un momentico."},{en:"Did the water go out in the building?",es:"¿Se fue el agua en el edificio?"}]
  }
});

Object.assign(LESSON_META,{
  "aeropuerto-migracion":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Uber en español",dialogue:"Aeropuerto y migración",vocab:"lugares",quizCat:"aeropuerto",quizMode:"conversation",guideIds:["futuro","por-para"],readingId:"lectura-aeropuerto",missionId:"migracion-llegada"},
  "bancos-pagos":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Números y plata",dialogue:"Pagos con datáfono y Nequi",vocab:"numeros",quizCat:"bancos-pagos",quizMode:"conversation",guideIds:["cortesia-colombiana","usted-tu-vos"],readingId:"lectura-pagos",missionId:"pagar-datafono"},
  "barberia":{stage:"Daily Life",difficulty:"Moderate",prereq:"Cortesía colombiana",dialogue:"En la barbería",vocab:"cuerpo",quizCat:"barberia",quizMode:"conversation",guideIds:["mandatos","pronombres"],readingId:"lectura-barberia",missionId:"corte-barberia"},
  "medico-urgencias":{stage:"Travel and Survival",difficulty:"Moderate",prereq:"En la farmacia",dialogue:"Consulta médica y droguería",vocab:"cuerpo",quizCat:"medico",quizMode:"conversation",guideIds:["ser-estar","perfecto"],readingId:"lectura-medico",missionId:"consulta-medica"},
  "porteria-domicilios":{stage:"Daily Life",difficulty:"Easy",prereq:"Tu casa",dialogue:"Portería y domicilio Rappi",vocab:"casa",quizCat:"porteria",quizMode:"conversation",guideIds:["cortesia-colombiana","se-me"],readingId:"lectura-porteria",missionId:"porteria-rappi"}
});

/* ── Complete 4-Rung Sentence Expansion Ladders for All Remaining 46 Lessons ── */
Object.assign(SENTENCE_LADDERS,{
  trabajo:{
    title:"Talk about your job and daily schedule",
    rungs:[
      {tag:"1. Anchor stem",es:"Trabajo como…",en:"I work as…"},
      {tag:"2. + Profession",es:"Trabajo como ingeniero en una empresa.",en:"I work as an engineer at a company."},
      {tag:"3. + Today's plan",es:"Trabajo como ingeniero y hoy tengo una reunión.",en:"I work as an engineer and today I have a meeting."},
      {tag:"4. + Follow-up",es:"Trabajo como ingeniero; hoy tengo una reunión importante con un cliente, así que salgo un poco tarde.",en:"I work as an engineer; today I have an important meeting with a client, so I leave a little late."}
    ],
    swaps:[
      {label:"Remote work",es:"Hoy estoy trabajando desde la casa porque tengo varias llamadas.",en:"Today I'm working from home because I have several calls."},
      {label:"Ask back",es:"Me gusta mucho mi trabajo. ¿Y tú en qué trabajas?",en:"I like my job a lot. And what do you do for work?"},
      {label:"Send email",es:"Antes de salir tengo que mandar un correo a la oficina.",en:"Before leaving I have to send an email to the office."}
    ]
  },
  casa:{
    title:"Describe where things are in your home",
    rungs:[
      {tag:"1. Anchor stem",es:"Está en…",en:"It is in…"},
      {tag:"2. + Room",es:"La toalla está en la habitación.",en:"The towel is in the bedroom."},
      {tag:"3. + Exact spot",es:"La toalla limpia está en la habitación, sobre la cama.",en:"The clean towel is in the bedroom, on the bed."},
      {tag:"4. + Extra need",es:"La toalla está sobre la cama, pero necesito buscar otra cobija en el clóset.",en:"The towel is on the bed, but I need to look for another blanket in the closet."}
    ],
    swaps:[
      {label:"Bathroom",es:"El jabón y el champú están en la ducha.",en:"The soap and shampoo are in the shower."},
      {label:"Kitchen",es:"Dejé las llaves sobre la mesa del comedor.",en:"I left the keys on the dining table."},
      {label:"Ask location",es:"Disculpa, ¿sabes dónde está la almohada extra?",en:"Excuse me, do you know where the extra pillow is?"}
    ]
  },
  calle:{
    title:"Give and follow street directions",
    rungs:[
      {tag:"1. Anchor stem",es:"Siga derecho…",en:"Go straight…"},
      {tag:"2. + Landmark",es:"Siga derecho hasta el semáforo.",en:"Go straight to the traffic light."},
      {tag:"3. + Turn",es:"Siga derecho hasta el semáforo y gire a la derecha.",en:"Go straight to the traffic light and turn right."},
      {tag:"4. + Final spot",es:"Siga derecho dos cuadras y gire a la derecha en la esquina; el banco queda ahí al frente.",en:"Go straight two blocks and turn right at the corner; the bank is right there across the way."}
    ],
    swaps:[
      {label:"Turn left",es:"Pasa el parque y gira a la izquierda en la farmacia.",en:"Pass the park and turn left at the pharmacy."},
      {label:"Ask distance",es:"Qué pena, ¿el supermercado queda cerca o queda lejos?",en:"Excuse me, is the supermarket nearby or far away?"},
      {label:"Stop here",es:"Déjeme aquí después del semáforo, por favor.",en:"Drop me off here after the traffic light, please."}
    ]
  },
  cocina:{
    title:"Coordinate cooking and kitchen tasks",
    rungs:[
      {tag:"1. Anchor stem",es:"Voy a cortar…",en:"I'm going to cut…"},
      {tag:"2. + Ingredient",es:"Voy a cortar las verduras para la cena.",en:"I'm going to cut the vegetables for dinner."},
      {tag:"3. + Partner action",es:"Voy a cortar las verduras y tú calientas la olla.",en:"I'll cut the vegetables and you heat the pot."},
      {tag:"4. + Full kitchen flow",es:"Mientras yo corto la cebolla y el tomate, ¿puedes ir calentando la sartén en la estufa?",en:"While I cut the onion and tomato, can you start heating the pan on the stove?"}
    ],
    swaps:[
      {label:"Fridge",es:"Saca el aguacate y el queso de la nevera, por favor.",en:"Take the avocado and cheese out of the fridge, please."},
      {label:"Boil water",es:"Ya puse a hervir el agua para hacer el arroz.",en:"I already put the water on to boil to make the rice."},
      {label:"Compliment",es:"¡Esta comida huele muy rico y quedó deliciosa!",en:"This food smells great and turned out delicious!"}
    ]
  },
  gustos:{
    title:"Share what you love and talk about family",
    rungs:[
      {tag:"1. Anchor stem",es:"Me gusta…",en:"I like…"},
      {tag:"2. + Activity",es:"Me gusta cocinar y escuchar música.",en:"I like cooking and listening to music."},
      {tag:"3. + With whom",es:"Me gusta cocinar y pasar tiempo con mi familia.",en:"I like cooking and spending time with my family."},
      {tag:"4. + Weekend detail",es:"Me encanta pasar tiempo con mi familia los fines de semana y preparar algo rico en casa.",en:"I love spending time with my family on weekends and making something delicious at home."}
    ],
    swaps:[
      {label:"Plural things",es:"Me gustan mucho las arepas y el café de Colombia.",en:"I really like arepas and Colombian coffee."},
      {label:"Ask back",es:"A mí me encanta viajar. ¿Y a ti qué te gusta hacer?",en:"I love traveling. And what do you like to do?"},
      {label:"Siblings",es:"Tengo dos hermanos y los quiero muchísimo.",en:"I have two siblings and I love them very much."}
    ]
  },
  planes:{
    title:"Set up a plan and coordinate by phone",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Nos vemos…?",en:"Shall we meet…?"},
      {tag:"2. + Time",es:"¿Nos vemos mañana por la tarde?",en:"Shall we meet tomorrow afternoon?"},
      {tag:"3. + Enthusiastic reply",es:"¿Nos vemos mañana? — ¡De una! Te escribo.",en:"Shall we meet tomorrow? — I'm in! I'll text you."},
      {tag:"4. + Location follow-up",es:"¡De una! Mándame la ubicación por WhatsApp y te aviso apenas salga de la casa.",en:"I'm in! Send me the location on WhatsApp and I'll let you know as soon as I leave the house."}
    ],
    swaps:[
      {label:"Call later",es:"Ahorita estoy ocupado, pero te llamo más tarde.",en:"Right now I'm busy, but I'll call you later."},
      {label:"Reschedule",es:"De pronto llego diez minutos tarde por el trancón.",en:"Maybe I'll arrive ten minutes late because of traffic."},
      {label:"Confirm",es:"¿A qué hora quedamos entonces en el centro?",en:"What time shall we meet downtown then?"}
    ]
  },
  sentirse:{
    title:"Explain how you feel physically and emotionally",
    rungs:[
      {tag:"1. Anchor stem",es:"Me siento…",en:"I feel…"},
      {tag:"2. + Symptom",es:"Me siento cansado y tengo sueño.",en:"I feel tired and I'm sleepy."},
      {tag:"3. + Specific pain",es:"Me duele la cabeza y tengo mucho sueño.",en:"My head hurts and I'm very sleepy."},
      {tag:"4. + What you need",es:"Hoy me duele un poco la cabeza y tengo sueño, así que me voy a acostar temprano para descansar.",en:"Today my head hurts a little and I'm sleepy, so I'm going to go to bed early to rest."}
    ],
    swaps:[
      {label:"Hungry/Thirsty",es:"Tengo mucha hambre y sed; ¿vamos a comer algo?",en:"I'm very hungry and thirsty; shall we go eat something?"},
      {label:"Feeling great",es:"Hoy me siento muy bien y estoy contento de estar aquí.",en:"Today I feel great and I'm happy to be here."},
      {label:"Ask someone",es:"Te veo cansado, ¿cómo te sientes hoy?",en:"You look tired, how do you feel today?"}
    ]
  },
  colombia:{
    title:"Greet friends with warm Colombian expressions",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Qué más?",en:"What's up?"},
      {tag:"2. + Friendly address",es:"¿Qué más, parce? ¿Todo bien?",en:"What's up, buddy? All good?"},
      {tag:"3. + Warm reaction",es:"¿Qué más, parce? — Todo bien, ¡qué bacano verte!",en:"What's up, buddy? — All good, so cool to see you!"},
      {tag:"4. + Invite for coffee",es:"¡Qué bacano verte, parce! ¿Vamos por un tintico ahorita y me cuentas cómo te ha ido?",en:"So cool to see you, buddy! Shall we grab a coffee right now and you tell me how things have been?"}
    ],
    swaps:[
      {label:"Hágale",es:"¡Hágale de una! Nos vemos allá en diez minutos.",en:"Let's do it! See you there in ten minutes."},
      {label:"Qué nota",es:"¡Qué nota que viniste a visitar Colombia!",en:"How awesome that you came to visit Colombia!"},
      {label:"Listo",es:"Listo, parce, cuadramos entonces para el sábado.",en:"Got it, buddy, we'll set it up for Saturday then."}
    ]
  },
  "hotel-checkin":{
    title:"Check into your hotel and get oriented",
    rungs:[
      {tag:"1. Anchor stem",es:"Tengo una reserva…",en:"I have a reservation…"},
      {tag:"2. + Under your name",es:"Buenas, tengo una reserva a nombre de Seth.",en:"Hi, I have a reservation under Seth's name."},
      {tag:"3. + Ask for elevator",es:"Tengo una reserva a nombre de Seth. ¿Dónde está el ascensor?",en:"I have a reservation under Seth's name. Where is the elevator?"},
      {tag:"4. + Breakfast & Wi-Fi",es:"Aquí tiene mi pasaporte. ¿Me dice a qué hora es el desayuno y cuál es la clave del wifi?",en:"Here is my passport. Can you tell me what time breakfast is and what the Wi-Fi password is?"}
    ],
    swaps:[
      {label:"Luggage",es:"¿Puedo dejar mi maleta en recepción mientras sale la habitación?",en:"Can I leave my suitcase at the front desk while the room gets ready?"},
      {label:"Check-out",es:"Disculpe, ¿a qué hora es la salida mañana?",en:"Excuse me, what time is check-out tomorrow?"},
      {label:"Room issue",es:"En mi habitación falta una toalla; ¿me regala una?",en:"My room is missing a towel; can I have one?"}
    ]
  },
  farmacia:{
    title:"Explain symptoms at a Colombian droguería",
    rungs:[
      {tag:"1. Anchor stem",es:"Me duele…",en:"My … hurts"},
      {tag:"2. + Duration",es:"Me duele la cabeza desde esta mañana.",en:"My head has hurt since this morning."},
      {tag:"3. + Ask for medicine",es:"Me duele la cabeza desde esta mañana. ¿Qué me recomienda?",en:"My head has hurt since this morning. What do you recommend?"},
      {tag:"4. + Dosage question",es:"Necesito algo para el dolor de cabeza y la tos. ¿Cómo me debo tomar estas pastillas?",en:"I need something for a headache and cough. How should I take these pills?"}
    ],
    swaps:[
      {label:"Stomach",es:"¿Tiene algo bueno para el dolor de estómago?",en:"Do you have something good for a stomachache?"},
      {label:"With food",es:"¿La tomo con agua antes o después de comer?",en:"Do I take it with water before or after eating?"},
      {label:"Drowsiness",es:"¿Esta pastilla da sueño o puedo trabajar normal?",en:"Does this pill make you drowsy or can I work normally?"}
    ]
  },
  direcciones:{
    title:"Find the right building, entrance, and floor",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Dónde está la entrada?",en:"Where is the entrance?"},
      {tag:"2. + Point out building",es:"Es el edificio de allá, al frente.",en:"It is that building over there, across the way."},
      {tag:"3. + Street path",es:"Siga derecho hasta la esquina y gire a la derecha.",en:"Go straight to the corner and turn right."},
      {tag:"4. + Entrance & floor",es:"La entrada principal queda detrás del edificio; entre por ahí y suba al segundo piso.",en:"The main entrance is behind the building; go in there and go up to the second floor."}
    ],
    swaps:[
      {label:"Ask security",es:"Buenas, ¿por dónde entro para ir a la oficina trescientos?",en:"Hi, which way do I go in to get to office 300?"},
      {label:"Across street",es:"No es de este lado, sino cruzando la avenida al frente.",en:"It's not on this side, but across the avenue in front."},
      {label:"Confirm number",es:"¿Este es el edificio de la calle setenta y dos?",en:"Is this the building on 72nd Street?"}
    ]
  },
  "daily-repair":{
    title:"Handle a bad phone connection smoothly",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Me escuchas?",en:"Can you hear me?"},
      {tag:"2. + Explain signal",es:"No te escucho bien; la señal está mala.",en:"I can't hear you well; the signal is bad."},
      {tag:"3. + Call cutting out",es:"Se está cortando la llamada, así que te escribo.",en:"The call is cutting out, so I'll text you."},
      {tag:"4. + Full recovery",es:"Casi no te escucho porque se está cortando la señal; te mando un mensaje por WhatsApp ahorita.",en:"I can barely hear you because the signal is cutting out; I'll send you a WhatsApp message right now."}
    ],
    swaps:[
      {label:"Call back",es:"Voy a colgar y te devuelvo la llamada en un minuto.",en:"I'm going to hang up and call you back in a minute."},
      {label:"Voice note",es:"Mejor mándame un audio porque hay mucho ruido aquí.",en:"Better send me a voice note because there's a lot of noise here."},
      {label:"Repeat last part",es:"Se cortó al final; ¿me repites lo último que dijiste?",en:"It cut out at the end; can you repeat the last thing you said?"}
    ]
  },
  "sentence-structure":{
    title:"Build clear Subject + Verb + Reason sentences",
    rungs:[
      {tag:"1. Anchor stem",es:"Quiero aprender.",en:"I want to learn."},
      {tag:"2. + Daily action",es:"Quiero aprender, así que practico todos los días.",en:"I want to learn, so I practice every day."},
      {tag:"3. + Detail",es:"Quiero aprender español, así que practico un poco todos los días.",en:"I want to learn Spanish, so I practice a little every day."},
      {tag:"4. + Two-part routine",es:"Primero escucho las frases en español y después las repito en voz alta para hablar mejor.",en:"First I listen to the phrases in Spanish and then I repeat them out loud to speak better."}
    ],
    swaps:[
      {label:"Need + because",es:"Necesito practicar hoy porque mañana tengo una reunión.",en:"I need to practice today because tomorrow I have a meeting."},
      {label:"Contrast",es:"Estaba un poco cansado, pero igual practiqué diez minutos.",en:"I was a little tired, but I practiced ten minutes anyway."},
      {label:"Omit subject",es:"Vivo en Colombia y hablo con mis vecinos todos los días.",en:"I live in Colombia and talk with my neighbors every day."}
    ]
  },
  "connectors-v36":{
    title:"Link short thoughts with natural connectors",
    rungs:[
      {tag:"1. Anchor stem",es:"Si puedo…",en:"If I can…"},
      {tag:"2. + Promise",es:"Si puedo, te aviso más tarde.",en:"If I can, I'll let you know later."},
      {tag:"3. + Backup option",es:"Si puedo, te aviso; si no, no pasa nada.",en:"If I can, I'll let you know; if not, no worries."},
      {tag:"4. + Full explanation",es:"Quiero ir contigo, pero tengo que terminar un trabajo; si salgo temprano, te aviso de una.",en:"I want to go with you, but I have to finish some work; if I get out early, I'll let you know right away."}
    ],
    swaps:[
      {label:"Traffic result",es:"Hay mucho trancón en la calle, entonces voy a llegar tarde.",en:"There is a lot of traffic on the street, so I'm going to arrive late."},
      {label:"Although",es:"Aunque todavía hablo despacio, la gente me entiende bien.",en:"Although I still speak slowly, people understand me well."},
      {label:"Not yet",es:"Todavía no he cenado porque acabo de llegar a la casa.",en:"I haven't eaten dinner yet because I just got home."}
    ]
  },
  "function-words":{
    title:"Use everyday conversational glue chunks",
    rungs:[
      {tag:"1. Anchor stem",es:"Todavía no sé.",en:"I don't know yet."},
      {tag:"2. + Colombian maybe",es:"Todavía no sé; de pronto voy más tarde.",en:"I don't know yet; maybe I'll go later."},
      {tag:"3. + Explain why",es:"Lo que pasa es que todavía tengo que trabajar.",en:"The thing is, I still have to work."},
      {tag:"4. + Natural flow",es:"Todavía no sé a qué hora salgo, pero te aviso en cuanto pueda para vernos al rato.",en:"I don't know yet what time I leave, but I'll let you know as soon as I can so we can meet later."}
    ],
    swaps:[
      {label:"For now",es:"Por ahora me quedo aquí, pero al rato paso por tu casa.",en:"For now I'm staying here, but later I'll stop by your place."},
      {label:"Actually",es:"En realidad prefiero salir mañana temprano.",en:"Actually I prefer to leave early tomorrow."},
      {label:"The thing is",es:"Lo que pasa es que se me descargó el celular.",en:"The thing is, my cell phone died."}
    ]
  },
  "social-colombia-v36":{
    title:"Sound warm and local in social conversations",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Cómo te ha ido?",en:"How have things been?"},
      {tag:"2. + Positive reply",es:"Todo muy bien, gracias. ¡Qué nota verte!",en:"Everything's great, thanks. How cool to see you!"},
      {tag:"3. + Friendly address",es:"¿Qué más, parce? Todo bien. ¡Qué nota verte!",en:"What's up, buddy? All good. How cool to see you!"},
      {tag:"4. + Social plan",es:"¡Qué nota verte, parce! Hágale, sentémonos un ratico y nos tomamos un café.",en:"How cool to see you, buddy! Come on, let's sit down for a bit and have a coffee."}
    ],
    swaps:[
      {label:"Polite apology",es:"Qué pena llegar tarde, es que había mucho trancón.",en:"Sorry for arriving late, it's just that there was a lot of traffic."},
      {label:"No worries",es:"Tranquilo, no se preocupe, acabamos de llegar también.",en:"Relax, don't worry, we just arrived too."},
      {label:"Praise",es:"¡Este restaurante que elegiste está muy bacano!",en:"This restaurant you picked is really cool!"}
    ]
  },
  "muletillas-diminutivos":{
    title:"Buy time with muletillas and warm diminutives",
    rungs:[
      {tag:"1. Anchor stem",es:"Pues, a ver…",en:"Well, let's see…"},
      {tag:"2. + Diminutive wait",es:"Pues, a ver… espéreme un momentico.",en:"Well, let's see… wait for me just a moment."},
      {tag:"3. + Distance",es:"Pues, a ver… espéreme un momentico porque ya estoy cerquita.",en:"Well, let's see… wait for me just a moment because I'm already very close."},
      {tag:"4. + Full local turn",es:"Pues, a ver… es que todavía estoy a dos cuadras, pero espéreme un momentico que ya llego ahorita.",en:"Well, let's see… it's just that I'm still two blocks away, but wait for me a moment, I'll be right there."}
    ],
    swaps:[
      {label:"Slow down",es:"Qué pena, ¿me habla un poquito más despacito, por favor?",en:"Excuse me, can you speak a little bit more slowly to me, please?"},
      {label:"Coffee",es:"Ahorita en un ratico pasamos por un tintico calentico.",en:"In a little while we'll stop by for a warm black coffee."},
      {label:"Hold the floor",es:"Digamos que entiendo bastante, aunque todavía practico cada día.",en:"Let's say I understand quite a bit, although I still practice every day."}
    ]
  },
  "gram-presente":{
    title:"Speak in the present tense about habits and facts",
    rungs:[
      {tag:"1. Anchor stem",es:"Hablo español.",en:"I speak Spanish."},
      {tag:"2. + Frequency",es:"Hablo español todos los días.",en:"I speak Spanish every day."},
      {tag:"3. + Where you live",es:"Hablo español todos los días y vivo en Colombia.",en:"I speak Spanish every day and I live in Colombia."},
      {tag:"4. + Extra detail",es:"Vivo en Colombia, trabajo desde aquí y practico español todos los días con mis amigos.",en:"I live in Colombia, work from here, and practice Spanish every day with my friends."}
    ],
    swaps:[
      {label:"Tengo + question",es:"Tengo una pregunta rápida sobre esta palabra.",en:"I have a quick question about this word."},
      {label:"Estoy + state",es:"Hoy estoy un poco ocupado, pero tengo tiempo ahorita.",en:"Today I am a little busy, but I have time right now."},
      {label:"Ask tú",es:"¿Tú vives por aquí cerca o trabajas en este barrio?",en:"Do you live near here or work in this neighborhood?"}
    ]
  },
  "gram-futuro":{
    title:"Express plans using voy a + infinitive",
    rungs:[
      {tag:"1. Anchor stem",es:"Voy a practicar.",en:"I am going to practice."},
      {tag:"2. + Time",es:"Mañana voy a practicar español.",en:"Tomorrow I am going to practice Spanish."},
      {tag:"3. + Second plan",es:"Mañana voy a practicar español y voy a hablar con un amigo.",en:"Tomorrow I'm going to practice Spanish and talk with a friend."},
      {tag:"4. + Full schedule",es:"Esta noche voy a estudiar un rato y mañana vamos a salir a comer después del trabajo.",en:"Tonight I'm going to study for a bit and tomorrow we're going to go out to eat after work."}
    ],
    swaps:[
      {label:"Call you",es:"Te voy a llamar apenas salga de la oficina.",en:"I'm going to call you as soon as I leave the office."},
      {label:"Ask plans",es:"¿Qué vas a hacer este fin de semana con tu familia?",en:"What are you going to do this weekend with your family?"},
      {label:"Group plan",es:"Vamos a pedir un taxi porque va a llover.",en:"We are going to order a taxi because it's going to rain."}
    ]
  },
  "gram-pasado":{
    title:"Tell completed past events with preterite verbs",
    rungs:[
      {tag:"1. Anchor stem",es:"Ayer fui…",en:"Yesterday I went…"},
      {tag:"2. + Place",es:"Ayer fui al mercado por la mañana.",en:"Yesterday I went to the market in the morning."},
      {tag:"3. + Second event",es:"Ayer fui al mercado y compré comida.",en:"Yesterday I went to the market and bought food."},
      {tag:"4. + Full mini-story",es:"Ayer fui al mercado, compré frutas y arepas, y después hablé un buen rato con mi vecino.",en:"Yesterday I went to the market, bought fruit and arepas, and afterward talked for a good while with my neighbor."}
    ],
    swaps:[
      {label:"What I ate",es:"Anoche comí bandeja paisa y tomé un jugo natural.",en:"Last night I ate bandeja paisa and drank a fresh juice."},
      {label:"Ask yesterday",es:"¿Qué hiciste ayer después de salir de la reunión?",en:"What did you do yesterday after leaving the meeting?"},
      {label:"Had to do",es:"Esta mañana tuve que hacer una vuelta en el banco.",en:"This morning I had to run an errand at the bank."}
    ]
  },
  "gram-pasado-historia":{
    title:"Combine what happened with where you were",
    rungs:[
      {tag:"1. Anchor stem",es:"Fui al mercado.",en:"I went to the market."},
      {tag:"2. + Contrast",es:"Fui al mercado, pero estaba lleno.",en:"I went to the market, but it was crowded."},
      {tag:"3. + Where you stayed",es:"Fui al mercado, pero después estuve en casa.",en:"I went to the market, but afterward I stayed at home."},
      {tag:"4. + Background plan",es:"Esta mañana iba a salir temprano, pero tenía que terminar un trabajo y me quedé en casa.",en:"This morning I was going to leave early, but I had to finish some work and stayed home."}
    ],
    swaps:[
      {label:"At the office",es:"Estaba en la oficina cuando me mandaste el mensaje.",en:"I was at the office when you sent me the message."},
      {label:"Was going to",es:"Iba a cocinar anoche, pero al final pedimos domicilio.",en:"I was going to cook last night, but in the end we ordered delivery."},
      {label:"Description",es:"El restaurante era pequeño, pero la comida estuvo deliciosa.",en:"The restaurant was small, but the food was delicious."}
    ]
  },
  "gram-pasado-contraste":{
    title:"Contrast background scene (imperfect) with event (preterite)",
    rungs:[
      {tag:"1. Anchor stem",es:"Mientras trabajaba…",en:"While I was working…"},
      {tag:"2. + Interrupting event",es:"Mientras trabajaba, sonó el teléfono.",en:"While I was working, the phone rang."},
      {tag:"3. + Consequence",es:"Mientras trabajaba, sonó el teléfono y contesté de una.",en:"While I was working, the phone rang and I answered right away."},
      {tag:"4. + Complete story",es:"Ayer fui al mercado mientras mi hermano estaba en casa, pero empezó a llover muy fuerte.",en:"Yesterday I went to the market while my brother was at home, but it started raining very hard."}
    ],
    swaps:[
      {label:"Childhood habit",es:"Cuando era niño, vivía cerca de aquí e iba al parque todos los días.",en:"When I was a child, I used to live near here and went to the park every day."},
      {label:"Closed shop",es:"Fui a la tienda a las ocho, pero ya estaba cerrada.",en:"I went to the shop at eight, but it was already closed."},
      {label:"Cooking call",es:"Mientras cocinaba la cena, llegaste tú con las arepas.",en:"While I was cooking dinner, you arrived with the arepas."}
    ]
  },
  "gram-subjuntivo":{
    title:"Express wishes and advice with que + subjunctive",
    rungs:[
      {tag:"1. Anchor stem",es:"Quiero que…",en:"I want you to…"},
      {tag:"2. + Subjunctive verb",es:"Quiero que vengas mañana.",en:"I want you to come tomorrow."},
      {tag:"3. + Warm hope",es:"Quiero que vengas y espero que estés muy bien.",en:"I want you to come and I hope you are doing very well."},
      {tag:"4. + Polite request",es:"Es importante que me hables un poquito más despacio para que yo te entienda todo bien.",en:"It's important that you speak a little more slowly to me so that I understand everything well."}
    ],
    swaps:[
      {label:"Ojalá",es:"Ojalá no llueva esta tarde para que podamos salir.",en:"Hopefully it doesn't rain this afternoon so we can go out."},
      {label:"Recommendation",es:"Te recomiendo que pruebes el ajiaco de este restaurante.",en:"I recommend that you try the ajiaco at this restaurant."},
      {label:"When you arrive",es:"Avísame por mensaje en cuanto llegues al edificio.",en:"Let me know by message as soon as you arrive at the building."}
    ]
  },
  "gram-necesidades":{
    title:"Explain past intentions, needs, and obligations",
    rungs:[
      {tag:"1. Anchor stem",es:"Quería salir…",en:"I wanted to go out…"},
      {tag:"2. + Obligation",es:"Quería salir, pero tuve que trabajar.",en:"I wanted to go out, but I had to work."},
      {tag:"3. + Reason",es:"Quería salir, pero tuve que trabajar porque estaba ocupado.",en:"I wanted to go out, but I had to work because I was busy."},
      {tag:"4. + Full apology",es:"Ayer quería ir a cenar contigo, pero no pude porque necesitaba entregar un informe temprano.",en:"Yesterday I wanted to go to dinner with you, but I couldn't because I needed to turn in a report early."}
    ],
    swaps:[
      {label:"Needed help",es:"Necesitaba ayuda con la dirección, así que le pregunté al vecino.",en:"I needed help with the address, so I asked the neighbor."},
      {label:"Couldn't answer",es:"No podía contestar el celular porque estaba manejando.",en:"I couldn't answer my phone because I was driving."},
      {label:"Had to rest",es:"Quería seguir practicando, pero tenía mucho sueño.",en:"I wanted to keep practicing, but I was very sleepy."}
    ]
  },
  "gram-conectores":{
    title:"Chain three clauses into a smooth story",
    rungs:[
      {tag:"1. Anchor stem",es:"Fui al mercado…",en:"I went to the market…"},
      {tag:"2. + Obstacle (pero)",es:"Fui al mercado, pero estaba cerrado.",en:"I went to the market, but it was closed."},
      {tag:"3. + Result (entonces)",es:"Fui al mercado, pero estaba cerrado, entonces regresé.",en:"I went to the market, but it was closed, so I went back."},
      {tag:"4. + Next step (después)",es:"Fui al mercado, pero como estaba cerrado, entonces regresé a casa y después pedí un domicilio.",en:"I went to the market, but since it was closed, I went back home and afterward ordered delivery."}
    ],
    swaps:[
      {label:"Rain reason",es:"Me quedé trabajando en casa porque estaba lloviendo durísimo.",en:"I stayed working at home because it was raining really hard."},
      {label:"Also",es:"Compré café y también traje pan fresco para el desayuno.",en:"I bought coffee and also brought fresh bread for breakfast."},
      {label:"Truth is",es:"La verdad es que todavía necesito practicar más este tema.",en:"The truth is that I still need to practice this topic more."}
    ]
  },
  "gram-groserias":{
    title:"Recognize strong Colombian slang and respond safely",
    rungs:[
      {tag:"1. Anchor stem",es:"Lo entiendo…",en:"I understand it…"},
      {tag:"2. + Safe boundary",es:"Entiendo las groserías, pero no las uso.",en:"I understand swear words, but I don't use them."},
      {tag:"3. + Register awareness",es:"Entiendo las groserías, pero sé cuándo no decirlas.",en:"I understand swear words, but I know when not to say them."},
      {tag:"4. + Safe alternative",es:"Si escucho una palabra fuerte en la calle la entiendo, pero yo prefiero decir «¡juepucha!» o «¡no puede ser!».",en:"If I hear a strong word on the street I understand it, but I prefer to say 'juepucha!' or 'no way!'."}
    ],
    swaps:[
      {label:"Mild euphemism",es:"¡Juepucha, se me hizo tardísimo para llegar a la cita!",en:"Darn, it got super late on me to make it to the appointment!"},
      {label:"Express surprise",es:"¡No me diga eso! ¿De verdad pasó todo eso ayer?",en:"You don't say! Did all that really happen yesterday?"},
      {label:"Keep it polite",es:"Con desconocidos siempre es mejor hablar con respeto y calma.",en:"With strangers it is always better to speak with respect and calm."}
    ]
  },
  "gram-pronombres":{
    title:"Use lo, la, le, and se lo without tangling your words",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Me lo repite?",en:"Can you repeat it for me?"},
      {tag:"2. + Polite modal",es:"¿Me lo puede repetir, por favor?",en:"Can you repeat it for me, please?"},
      {tag:"3. + Natural reply",es:"¿Me lo puede repetir? — Sí, se lo repito despacio.",en:"Can you repeat it for me? — Yes, I'll repeat it to you slowly."},
      {tag:"4. + Location transfer",es:"¿Tienes la dirección del hotel? — Sí, ya la tengo aquí y te la voy a mandar por mensaje.",en:"Do you have the hotel address? — Yes, I already have it here and I'm going to send it to you by message."}
    ],
    swaps:[
      {label:"Direct object (lo)",es:"El documento ya está listo; lo tengo aquí sobre la mesa.",en:"The document is ready; I have it right here on the table."},
      {label:"Double pronoun",es:"El cliente pidió el informe, así que se lo mandé esta mañana.",en:"The client asked for the report, so I sent it to him this morning."},
      {label:"Help me / you",es:"¿Me puede ayudar un momentico? — Claro, ya le ayudo.",en:"Can you help me a moment? — Of course, I'll help you right now."}
    ]
  },
  "gram-perfecto":{
    title:"Talk about recent experiences with he / has + participle",
    rungs:[
      {tag:"1. Anchor stem",es:"He practicado…",en:"I have practiced…"},
      {tag:"2. + Timeframe",es:"He practicado español toda esta semana.",en:"I have practiced Spanish all this week."},
      {tag:"3. + Second experience",es:"He practicado español esta semana y ya he probado la arepa.",en:"I have practiced Spanish this week and I have already tried arepa."},
      {tag:"4. + Ask back",es:"Esta semana he aprendido muchas frases nuevas. ¿Y tú ya has probado el ajiaco bogotano?",en:"This week I have learned many new phrases. And have you already tried Bogotá ajiaco?"}
    ],
    swaps:[
      {label:"Not yet",es:"Todavía no he ido a Medellín, pero quiero ir pronto.",en:"I haven't gone to Medellín yet, but I want to go soon."},
      {label:"Never",es:"Nunca he visto ese lugar, ¿queda cerca del centro?",en:"I have never seen that place, is it near downtown?"},
      {label:"We arrived",es:"Ya hemos llegado al restaurante y estamos en la mesa.",en:"We have already arrived at the restaurante and are at the table."}
    ]
  },
  "gram-condicional":{
    title:"Make polite requests and suggestions with -ía forms",
    rungs:[
      {tag:"1. Anchor stem",es:"Me gustaría…",en:"I would like…"},
      {tag:"2. + Order/Request",es:"Me gustaría pedir una mesa para dos.",en:"I would like to request a table for two."},
      {tag:"3. + Polite question",es:"Me gustaría pedir una mesa. ¿Podría ayudarme, por favor?",en:"I would like to request a table. Could you help me, please?"},
      {tag:"4. + Suggestion",es:"¿Podría traernos el menú, por favor? Y creo que deberíamos pedir algo típico para compartir.",en:"Could you bring us the menu, please? And I think we should order something traditional to share."}
    ],
    swaps:[
      {label:"Could you repeat",es:"Disculpe, ¿podría hablarme un poquito más despacio?",en:"Excuse me, could you speak a little more slowly to me?"},
      {label:"We could",es:"Si tienes tiempo mañana, podríamos vernos para almorzar.",en:"If you have time tomorrow, we could meet for lunch."},
      {label:"It would be",es:"Sería muy bueno practicar diez minutos antes de salir.",en:"It would be great to practice ten minutes before leaving."}
    ]
  },
  "gram-pasado-perfecto":{
    title:"Explain what had already happened before a past moment",
    rungs:[
      {tag:"1. Anchor stem",es:"Ya había…",en:"I/it had already…"},
      {tag:"2. + Past participle",es:"Ya habían cerrado la tienda.",en:"They had already closed the store."},
      {tag:"3. + Time anchor",es:"Cuando llegué, ya habían cerrado la tienda.",en:"When I arrived, they had already closed the store."},
      {tag:"4. + Full context",es:"Cuando llegué al mercado a las nueve, ya habían cerrado todo, así que tuve que ir a otra tienda.",en:"When I arrived at the market at nine, they had already closed everything, so I had to go to another shop."}
    ],
    swaps:[
      {label:"Already eaten",es:"Ya había cenado en casa cuando me invitaste a salir.",en:"I had already eaten dinner at home when you invited me out."},
      {label:"Never tried",es:"Antes de venir a Colombia, nunca había probado el lulo.",en:"Before coming to Colombia, I had never tried lulo fruit."},
      {label:"Had left",es:"Cuando bajé a la portería, el taxi ya había llegado.",en:"When I went down to the front desk, the taxi had already arrived."}
    ]
  },
  "gram-futuro-perfecto":{
    title:"Recognize and express what will be completed by a deadline",
    rungs:[
      {tag:"1. Anchor stem",es:"Habré terminado.",en:"I will have finished."},
      {tag:"2. + Deadline",es:"Para las ocho, ya habré terminado.",en:"By eight o'clock, I will have already finished."},
      {tag:"3. + Object",es:"Para las ocho, ya habré terminado el informe.",en:"By eight o'clock, I will have already finished the report."},
      {tag:"4. + Follow-up plan",es:"Para las seis de la tarde ya habré terminado el trabajo, así que podremos salir a cenar tranquilos.",en:"By six in the afternoon I will have finished work, so we'll be able to go out for dinner relaxed."}
    ],
    swaps:[
      {label:"We will have left",es:"Cuando llegues a la oficina, ya habremos salido.",en:"When you arrive at the office, we will have already left."},
      {label:"In a year",es:"En unos meses habré aprendido a conversar con mucha más fluidez.",en:"In a few months I will have learned to converse much more fluently."},
      {label:"By tomorrow",es:"Para mañana al mediodía ya habrán arreglado el internet.",en:"By tomorrow at noon they will have fixed the internet."}
    ]
  },
  "conversation-challenge":{
    title:"Keep a full conversation going even when surprised",
    rungs:[
      {tag:"1. Anchor stem",es:"Hablo poquito español…",en:"I speak a little Spanish…"},
      {tag:"2. + Positive attitude",es:"Hablo poquito español, pero estoy practicando.",en:"I speak a little Spanish, but I am practicing."},
      {tag:"3. + Ask to slow down",es:"No entendí todo, pero si me habla despacito le respondo en español.",en:"I didn't understand everything, but if you speak slowly I'll answer you in Spanish."},
      {tag:"4. + Full confident turn",es:"Disculpe, todavía estoy aprendiendo español; ¿me repite la pregunta más despacito para poder responderle bien?",en:"Excuse me, I'm still learning Spanish; can you repeat the question more slowly so I can answer you properly?"}
    ],
    swaps:[
      {label:"Buy time & answer",es:"Pues, a ver… déjeme pensar un momentico y ya le digo.",en:"Well, let's see… let me think for a moment and I'll tell you right away."},
      {label:"Confirm meaning",es:"¿Usted me pregunta por la dirección del hotel o por mi nombre?",en:"Are you asking me for the hotel address or for my name?"},
      {label:"Keep talking",es:"Ayer practiqué este tema y hoy quiero intentar decirlo completo.",en:"Yesterday I practiced this topic and today I want to try saying it in full."}
    ]
  },
  "commands-repair":{
    title:"Use polite usted commands to guide the conversation",
    rungs:[
      {tag:"1. Anchor stem",es:"Disculpe, hábleme…",en:"Excuse me, speak to me…"},
      {tag:"2. + Speed",es:"Disculpe, hábleme más despacio, por favor.",en:"Excuse me, speak to me more slowly, please."},
      {tag:"3. + Second command",es:"Disculpe, hábleme más despacio y repítame la dirección.",en:"Excuse me, speak to me more slowly and repeat the address for me."},
      {tag:"4. + Full polite repair",es:"Qué pena con usted, hábleme un poquito más despacio y dígame otra vez por dónde queda la entrada.",en:"Sorry to bother you, speak to me a little more slowly and tell me again where the entrance is."}
    ],
    swaps:[
      {label:"Informal friend",es:"Oye, escúchame un segundo y dime qué opinas de esto.",en:"Hey, listen to me for a second and tell me what you think of this."},
      {label:"Driver drop-off",es:"Maestro, déjeme ahí adelante después del semáforo, por favor.",en:"Boss, drop me off up ahead after the traffic light, please."},
      {label:"Wait a moment",es:"Espéreme un momentico mientras reviso el mensaje en el celular.",en:"Wait for me just a moment while I check the message on my phone."}
    ]
  },
  "uber-completo":{
    title:"Navigate a complete Uber ride from pickup to drop-off",
    rungs:[
      {tag:"1. Anchor stem",es:"Voy para…",en:"I'm going to…"},
      {tag:"2. + Corner building",es:"Voy para el edificio de la esquina.",en:"I'm going to the building on the corner."},
      {tag:"3. + Introduce yourself",es:"Buenas, hablo un poco de español. Voy para el edificio de la esquina.",en:"Hi, I speak a little Spanish. I'm going to the building on the corner."},
      {tag:"4. + Arrival instruction",es:"Buenas, voy para el edificio blanco de la esquina; ¿me avisa cuando lleguemos y me deja al frente?",en:"Hi, I'm going to the white building on the corner; can you let me know when we arrive and drop me off out front?"}
    ],
    swaps:[
      {label:"Confirm driver",es:"Buenas, ¿usted es el conductor para Seth? Ya salgo.",en:"Hi, are you the driver for Seth? I'm coming right out."},
      {label:"Traffic route",es:"Si hay mucho trancón por ahí, podemos irnos por otra calle.",en:"If there's a lot of traffic that way, we can go down another street."},
      {label:"Where to exit",es:"¿Dónde me bajo para quedar cerca de la puerta principal?",en:"Where do I get out to be close to the main door?"}
    ]
  },
  "restaurante-real":{
    title:"Order a complete meal, customize it, and ask for the bill",
    rungs:[
      {tag:"1. Anchor stem",es:"Quisiera pedir…",en:"I would like to order…"},
      {tag:"2. + Main dish",es:"Quisiera pedir una sopa con papa, por favor.",en:"I would like to order a soup with potato, please."},
      {tag:"3. + Customized drink",es:"Quisiera una sopa con papa y un jugo sin azúcar, por favor.",en:"I would like a soup with potato and a juice without sugar, please."},
      {tag:"4. + Full table flow",es:"Buenas tardes, ¿tiene una mesa para dos? Quisiera pedir el menú del día con jugo de mora sin azúcar.",en:"Good afternoon, do you have a table for two? I'd like to order the daily special with blackberry juice without sugar."}
    ],
    swaps:[
      {label:"Sauce on the side",es:"¿Me trae el ají aparte, por favor, para que no pique mucho?",en:"Can you bring me the hot sauce on the side, please, so it's not too spicy?"},
      {label:"Ask for the bill",es:"Todo estuvo delicioso; ¿me regala la cuenta cuando pueda?",en:"Everything was delicious; can I have the bill when you can?"},
      {label:"Change side dish",es:"¿Será que me puede cambiar las papas por ensalada?",en:"Could you possibly swap the fries for salad for me?"}
    ]
  },
  "mercado-negociar":{
    title:"Ask prices by weight and negotiate politely at a market",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Cuánto cuesta el kilo?",en:"How much does a kilo cost?"},
      {tag:"2. + Gentle reaction",es:"Está un poquito caro hoy.",en:"It's a little expensive today."},
      {tag:"3. + Polite counter-offer",es:"Está un poco caro. ¿Me lo deja en siete mil?",en:"It's a little expensive. Can you let me have it for seven thousand?"},
      {tag:"4. + Bundle & pay",es:"Veci, deme dos kilos de aguacate; ¿me hace un descuentico y me dice cuánto le debo por todo?",en:"Neighbor, give me two kilos of avocado; can you give me a little discount and tell me how much I owe you for everything?"}
    ],
    swaps:[
      {label:"Pick ripe one",es:"¿Me escoge uno que esté madurito para comer hoy mismo?",en:"Can you pick one for me that's nice and ripe to eat today?"},
      {label:"Pay cash",es:"Aquí tiene veinte mil en efectivo; gracias por la ñapa.",en:"Here is twenty thousand in cash; thanks for the free extra bit."},
      {label:"Ask total",es:"¿En cuánto me salen las frutas y las arepas por todo?",en:"How much do the fruits and arepas come out to for everything?"}
    ]
  },
  "gerundios-actividades":{
    title:"Describe what you are doing right now vs. next",
    rungs:[
      {tag:"1. Anchor stem",es:"Estoy cocinando.",en:"I am cooking."},
      {tag:"2. + Right now",es:"Ahora mismo estoy cocinando la cena.",en:"Right now I am cooking dinner."},
      {tag:"3. + Next plan",es:"Ahora estoy cocinando, pero después voy a salir.",en:"Right now I am cooking, but afterward I am going to go out."},
      {tag:"4. + Past + present flow",es:"Hace un ratico acabo de llegar del mercado y ahora estoy cocinando antes de salir con mis amigos.",en:"A little while ago I just arrived from the market and now I'm cooking before going out with my friends."}
    ],
    swaps:[
      {label:"Looking for",es:"En este momento estoy buscando la entrada del edificio.",en:"Right now I am looking for the building entrance."},
      {label:"Was doing",es:"Estaba trabajando en el computador cuando me llamaste.",en:"I was working on the computer when you called me."},
      {label:"Learning",es:"Estoy aprendiendo a hablar español cada vez con más confianza.",en:"I am learning to speak Spanish with more and more confidence."}
    ]
  },
  "social-salida":{
    title:"Propose a night out, accept, and coordinate arrival",
    rungs:[
      {tag:"1. Anchor stem",es:"¡De una!",en:"Sure / I'm in!"},
      {tag:"2. + See you later",es:"¡De una! Nos vemos después del trabajo.",en:"I'm in! See you after work."},
      {tag:"3. + Arrival update",es:"De una, nos vemos después. Te aviso cuando llegue.",en:"Sure, see you later. I'll let you know when I arrive."},
      {tag:"4. + Full plan",es:"Me parece muy buena idea salir esta noche; voy un poquito tarde, pero te aviso apenas llegue allá.",en:"Going out tonight sounds like a great idea; I'm running a little late, but I'll let you know as soon as I get there."}
    ],
    swaps:[
      {label:"Invite friends",es:"¿Qué vas a hacer esta noche? Vamos a tomar algo con unos amigos.",en:"What are you doing tonight? Let's go grab a drink with some friends."},
      {label:"Send pin",es:"Mándame la ubicación exacta del sitio para pedir el Uber.",en:"Send me the exact location of the place so I can order the Uber."},
      {label:"Confirm time",es:"Listo, entonces quedamos a las ocho en la entrada.",en:"Got it, so we'll meet at eight at the entrance."}
    ]
  },
  "fiesta-gathering":{
    title:"Break the ice, chat, and say goodbye at a gathering",
    rungs:[
      {tag:"1. Anchor stem",es:"Está muy chévere.",en:"It's really cool."},
      {tag:"2. + Compliment music",es:"La música está muy buena y el sitio está chévere.",en:"The music is really good and the place is cool."},
      {tag:"3. + Warm summary",es:"La música está muy buena. La pasé muy bien hoy.",en:"The music is really good. I had a great time today."},
      {tag:"4. + Polite exit",es:"Qué gusto conocerte; la pasé muy bien con ustedes, pero ya me tengo que ir porque mañana madrugo.",en:"So nice to meet you; I had a great time with you all, but I have to head out now because I get up early tomorrow."}
    ],
    swaps:[
      {label:"Offer a drink",es:"Voy a la cocina; ¿quieres algo de tomar o un vaso de agua?",en:"I'm going to the kitchen; do you want something to drink or a glass of water?"},
      {label:"How you know host",es:"¿Y tú cómo conoces a la gente de aquí? Yo soy amigo de Carlos.",en:"And how do you know the people here? I'm a friend of Carlos."},
      {label:"Keep in touch",es:"Pásame tu número para que cuadremos una salida la otra semana.",en:"Give me your number so we can set up an outing next week."}
    ]
  },
  "deportes-partido":{
    title:"Talk about a Colombian fútbol match with friends",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Vas a ver el partido?",en:"Are you going to watch the game?"},
      {tag:"2. + Enthusiasm",es:"Claro, no me lo pierdo por nada.",en:"Of course, I wouldn't miss it for anything."},
      {tag:"3. + Cheer for Colombia",es:"Ojalá gane Colombia hoy. Lo vemos juntos.",en:"I hope Colombia wins today. We'll watch it together."},
      {tag:"4. + Full match talk",es:"¿Cómo va el marcador? Ojalá gane la selección Colombia hoy; nos vemos ahorita para verlo juntos.",en:"What's the score? I hope the Colombian national team wins today; see you shortly to watch it together."}
    ],
    swaps:[
      {label:"Goal reaction",es:"¡Qué golazo hicieron! Están jugando muy bien este segundo tiempo.",en:"What an amazing goal they scored! They're playing great this second half."},
      {label:"Who's playing",es:"¿Hoy a qué hora juega Colombia y contra quién le toca?",en:"What time does Colombia play today and who are they playing against?"},
      {label:"Watch at a bar",es:"Vamos a verlo en el restaurante de la esquina que tiene pantalla grande.",en:"Let's go watch it at the corner restaurant that has a big screen."}
    ]
  },
  "oficina-real":{
    title:"Give project updates, ask for review, and set next steps",
    rungs:[
      {tag:"1. Anchor stem",es:"El proyecto va bien.",en:"The project is going well."},
      {tag:"2. + Honest status",es:"El proyecto va bien, pero estoy un poco atrasado.",en:"The project is going well, but I am a little behind."},
      {tag:"3. + Ask for review",es:"Estoy un poco atrasado; ¿me puede revisar esta parte del informe?",en:"I'm a little behind; can you review this part of the report for me?"},
      {tag:"4. + Next step",es:"Hoy termino los datos después de la reunión y mañana a primera hora se lo mandamos al cliente.",en:"Today I'll finish the data after the meeting and tomorrow first thing we'll send it to the client."}
    ],
    swaps:[
      {label:"Offer help",es:"Ya terminé mi parte; ¿necesitas que te ayude a revisar algo?",en:"I already finished my part; do you need me to help you review anything?"},
      {label:"Schedule call",es:"Hablemos diez minutos por teléfono antes de mandar el correo.",en:"Let's talk ten minutes by phone before sending the email."},
      {label:"Confirm deadline",es:"Me parece bien así; entonces queda listo para el jueves.",en:"Sounds good to me like that; so it'll be ready for Thursday."}
    ]
  },
  "aeropuerto-migracion":{
    title:"Pass Colombian immigration and find your airport pickup",
    rungs:[
      {tag:"1. Anchor stem",es:"Vengo por turismo.",en:"I'm coming for tourism."},
      {tag:"2. + Length of stay",es:"Vengo por turismo y me voy a quedar dos semanas.",en:"I'm coming for tourism and I'm going to stay two weeks."},
      {tag:"3. + Hotel address",es:"Vengo por turismo durante dos semanas y me quedo en este hotel.",en:"I'm coming for tourism for two weeks and I'm staying at this hotel."},
      {tag:"4. + Full immigration turn",es:"Buenos días, aquí tiene mi pasaporte; vengo por turismo dos semanas y aquí está la dirección de mi hotel.",en:"Good morning, here is my passport; I'm coming for tourism for two weeks and here is my hotel address."}
    ],
    swaps:[
      {label:"Baggage claim",es:"Disculpe, ¿por dónde queda la banda para recoger el equipaje?",en:"Excuse me, where is the belt to pick up baggage?"},
      {label:"Uber pickup",es:"Ya salí con mi maleta; estoy en el segundo piso en la puerta cuatro.",en:"I already came out with my suitcase; I'm on the second floor at door 4."},
      {label:"Visiting friends",es:"Vengo a visitar a unos amigos en Medellín por diez días.",en:"I'm coming to visit some friends in Medellín for ten days."}
    ]
  },
  "bancos-pagos":{
    title:"Pay smoothly by card, datáfono, or Nequi",
    rungs:[
      {tag:"1. Anchor stem",es:"Con tarjeta, por favor.",en:"By card, please."},
      {tag:"2. + Installments",es:"Con tarjeta de crédito, a una sola cuota.",en:"By credit card, in a single installment."},
      {tag:"3. + Include tip",es:"Sí, incluya el servicio y pago con tarjeta a una cuota.",en:"Yes, include the service charge and I'll pay by card in one installment."},
      {tag:"4. + Full checkout reflex",es:"Sí, incluya el servicio, por favor; pago con tarjeta a una sola cuota y consumidor final.",en:"Yes, include the service charge, please; I'll pay by credit card in one installment and final consumer."}
    ],
    swaps:[
      {label:"Savings card",es:"Es tarjeta débito, cuenta de ahorros, por favor.",en:"It's a debit card, savings account, please."},
      {label:"Pay by Nequi",es:"¿Tienes Nequi o código QR para hacerte la transferencia?",en:"Do you have Nequi or a QR code so I can transfer to you?"},
      {label:"Bring terminal",es:"Qué pena, ¿me acerca el datáfono a la mesa, por favor?",en:"Excuse me, can you bring the card terminal to the table, please?"}
    ]
  },
  barberia:{
    title:"Ask for the exact haircut and beard trim you want",
    rungs:[
      {tag:"1. Anchor stem",es:"Quiero un corte…",en:"I want a cut…"},
      {tag:"2. + Sides (clipper #)",es:"Quiero un desvanecido bajito a los lados con la dos.",en:"I want a low fade on the sides with a #2."},
      {tag:"3. + Top (scissors)",es:"Bajito a los lados con la dos, y arriba solo las puntas con tijera.",en:"Low on the sides with a #2, and on top just the tips with scissors."},
      {tag:"4. + Beard & neck",es:"Maestro, hágame un desvanecido bajito con la dos, arriba solo tijera y perfíleme un poquito la barba.",en:"Boss, give me a low fade with a #2, scissors only on top, and line up my beard a little bit."}
    ],
    swaps:[
      {label:"Ask opening",es:"Buenas, ¿tiene turno ahorita o a qué hora puedo pasar?",en:"Hi, do you have an opening right now or what time can I stop by?"},
      {label:"Keep natural",es:"No me lo suba mucho atrás; déjemelo más bien natural.",en:"Don't take it too high in the back; leave it more natural for me."},
      {label:"Great result",es:"Así quedó perfecto, hermano, muchas gracias.",en:"That turned out perfect, brother, thank you very much."}
    ]
  },
  "medico-urgencias":{
    title:"Describe symptoms, allergies, and prescriptions clearly",
    rungs:[
      {tag:"1. Anchor stem",es:"Me siento mal…",en:"I feel sick…"},
      {tag:"2. + Symptoms & time",es:"Tengo dolor de estómago y fiebre desde anoche.",en:"I've had a stomachache and fever since last night."},
      {tag:"3. + Allergy info",es:"Tengo fiebre desde anoche y no soy alérgico a ningún medicamento.",en:"I've had a fever since last night and I'm not allergic to any medication."},
      {tag:"4. + Ask dosage",es:"Doctora, tengo dolor de estómago desde ayer; ¿cada cuántas horas debo tomar esta pastilla?",en:"Doctor, I've had a stomachache since yesterday; how many hours apart should I take this pill?"}
    ],
    swaps:[
      {label:"Before/after food",es:"¿Este medicamento se toma antes o después de las comidas?",en:"Is this medication taken before or after meals?"},
      {label:"Prescription",es:"¿Con esta fórmula médica puedo comprar todo en la droguería?",en:"With this prescription can I buy everything at the pharmacy?"},
      {label:"Sore throat",es:"Me duele bastante la garganta y tengo tos desde hace dos días.",en:"My throat hurts quite a bit and I've had a cough for two days."}
    ]
  },
  "porteria-domicilios":{
    title:"Coordinate deliveries and building questions with the portero",
    rungs:[
      {tag:"1. Anchor stem",es:"Estoy esperando…",en:"I'm waiting for…"},
      {tag:"2. + Rappi order",es:"Estoy esperando un domicilio de Rappi.",en:"I'm waiting for a Rappi delivery."},
      {tag:"3. + Ask front desk",es:"Vecino, estoy esperando un domicilio; ¿me lo recibe en portería?",en:"Doorman, I'm waiting for a delivery; can you receive it for me at the front desk?"},
      {tag:"4. + Full polite request",es:"Hola, don Carlos, qué pena: llegó un pedido de Rappi para el quinientos dos; ¿me lo guarda un momentico mientras bajo?",en:"Hi, Don Carlos, sorry to bother you: a Rappi order arrived for 502; can you hold it for a moment while I come down?"}
    ],
    swaps:[
      {label:"Authorize guest",es:"Vecino, ahorita viene un amigo a visitarme; ¿lo deja subir?",en:"Doorman, a friend is coming to visit me shortly; can you let him come up?"},
      {label:"Water/Internet",es:"Disculpe, ¿sabe si se fue el agua o la luz en el edificio?",en:"Excuse me, do you know if the water or power went out in the building?"},
      {label:"Leave package",es:"¿Le puedo dejar esta llave aquí encargada en recepción?",en:"Can I leave this key here in your care at the front desk?"}
    ]
  }
});

/* ── 4 New 3-Column Interactive Slot-Swapper Matrices (7 total) ── */
SLOT_SWAP_MATRICES.push(
  {
    id:"restaurante-pedido",
    title:"🍽️ Ordering & Customizing Food",
    sub:"Order politely at any Colombian café or restaurant and customize your meal",
    col1Title:"1. Polite Opener",
    col2Title:"2. Dish or Drink",
    col3Title:"3. Customization",
    col1:[
      {es:"Buenas tardes, ¿me regala",en:"Good afternoon, can I have"},
      {es:"Qué pena, quisiera pedir",en:"Excuse me, I would like to order"},
      {es:"Veci, ¿será que me trae",en:"Neighbor, could you bring me"},
      {es:"Para mí me da por favor",en:"For me please give me"}
    ],
    col2:[
      {es:"el almuerzo ejecutivo del día",en:"today's lunch special"},
      {es:"una bandeja paisa y un jugo de mora",en:"a bandeja paisa and a blackberry juice"},
      {es:"dos arepas con queso y un tintico",en:"two cheese arepas and a black coffee"},
      {es:"una sopa caliente con aguacate",en:"a hot soup with avocado"}
    ],
    col3:[
      {es:"pero sin azúcar, por favor.",en:"but without sugar, please."},
      {es:"con el ají aparte, si es tan amable.",en:"with the hot sauce on the side, if you'd be so kind."},
      {es:"para llevar, y me regala la cuenta.",en:"to go, and can I have the bill."},
      {es:"y pago con tarjeta a una sola cuota.",en:"and I'll pay by card in one installment."}
    ]
  },
  {
    id:"uber-navegacion",
    title:"🚕 Uber, Directions & Drop-offs",
    sub:"Guide your driver smoothly through Bogotá, Medellín, or Cali",
    col1Title:"1. Driver Prompt",
    col2Title:"2. Direction / Action",
    col3Title:"3. Landmark / Reason",
    col1:[
      {es:"Buenas, maestro, por favor",en:"Hi boss, please"},
      {es:"Disculpe, ¿será que puede",en:"Excuse me, could you possibly"},
      {es:"Qué pena con usted,",en:"Sorry to bother you,"},
      {es:"Listo, amigo, ahí adelante",en:"Great friend, right up ahead"}
    ],
    col2:[
      {es:"siga derecho dos cuadras más",en:"go straight two more blocks"},
      {es:"gire a la derecha después del semáforo",en:"turn right after the traffic light"},
      {es:"déjeme aquí al frente del edificio",en:"drop me off right here in front of the building"},
      {es:"espéreme un momentico en la esquina",en:"wait for me just a moment on the corner"}
    ],
    col3:[
      {es:"porque la entrada principal queda por detrás.",en:"because the main entrance is in the back."},
      {es:"antes de que cojamos el trancón.",en:"before we hit the traffic jam."},
      {es:"que ya estoy saliendo por la portería.",en:"as I'm coming out through the front desk right now."},
      {es:"donde está la tienda de la esquina.",en:"where the corner shop is."}
    ]
  },
  {
    id:"social-parche",
    title:"🎉 Social Plans & El Parche",
    sub:"Invite Colombian friends out, accept plans, or reschedule naturally",
    col1Title:"1. Casual Opener",
    col2Title:"2. Proposed Plan",
    col3Title:"3. Time / Condition",
    col1:[
      {es:"¿Qué más, parce? ¿Vamos a",en:"What's up, buddy? Shall we"},
      {es:"Oye, ¿te parece si podemos",en:"Hey, how about we"},
      {es:"¡De una! Esta noche quiero",en:"I'm in! Tonight I want to"},
      {es:"Estaba pensando que podríamos",en:"I was thinking we could"}
    ],
    col2:[
      {es:"tomarnos un tintico y conversar",en:"grab a coffee and chat"},
      {es:"ver el partido de Colombia juntos",en:"watch the Colombia game together"},
      {es:"salir a cenar con unos amigos",en:"go out to dinner with some friends"},
      {es:"caminar un rato por el parque",en:"walk around the park for a bit"}
    ],
    col3:[
      {es:"apenas salgamos de la oficina.",en:"as soon as we get out of the office."},
      {es:"mañana por la tarde si no llueve.",en:"tomorrow afternoon if it doesn't rain."},
      {es:"y yo te mando la ubicación por WhatsApp.",en:"and I'll send you the location on WhatsApp."},
      {es:"en un ratico cuando termine aquí.",en:"in a little while when I finish here."}
    ]
  },
  {
    id:"deseos-subjuntivo",
    title:"🌱 Wishes & Subjunctive Chunks",
    sub:"Connect a wish, hope, or recommendation to what someone else does",
    col1Title:"1. Trigger + Que",
    col2Title:"2. Subjunctive Action",
    col3Title:"3. Purpose / Time",
    col1:[
      {es:"Quiero que",en:"I want you/us to"},
      {es:"Espero que",en:"I hope that"},
      {es:"Es importante que",en:"It is important that"},
      {es:"Ojalá que",en:"Hopefully"}
    ],
    col2:[
      {es:"me hables un poquito más despacito",en:"you speak a little more slowly to me"},
      {es:"vengas a visitarnos a Colombia",en:"you come visit us in Colombia"},
      {es:"nos veamos este fin de semana",en:"we meet up this weekend"},
      {es:"todo te salga muy bien en la reunión",en:"everything goes really well for you in the meeting"}
    ],
    col3:[
      {es:"para que podamos practicar español.",en:"so that we can practice Spanish."},
      {es:"cuando tengas un tiempito libre.",en:"when you have a little free time."},
      {es:"antes de que te regreses a casa.",en:"before you head back home."},
      {es:"y me avises apenas llegues.",en:"and let me know as soon as you arrive."}
    ]
  }
);

/* ── New Quiz Items for All 5 New Scenarios & Verbs (V91) ── */
V60_CONVERSATION_QUIZ.push(
  {kind:"reply",focus:"future",cat:"aeropuerto",es:"¿Cuál es el motivo de su viaje y cuántos días se queda?",en:"Vengo por turismo y me voy a quedar dos semanas.",tts:"¿Cuál es el motivo de su viaje y cuántos días se queda?",choices:["Vengo por turismo y me voy a quedar dos semanas.","A una sola cuota, por favor.","Bajito a los lados con la dos.","Se fue el agua en el edificio."]},
  {kind:"meaning",focus:"present",cat:"aeropuerto",es:"¿Por dónde queda el reclamo de equipaje?",en:"Where is the baggage claim located?",tts:"¿Por dónde queda el reclamo de equipaje?",choices:["Where is the baggage claim located?","Can you include the service charge?","Every how many hours do I take the pill?","Can you trim my beard with scissors?"]},
  {kind:"reply",focus:"present",cat:"bancos-pagos",es:"¿Ahorros, corriente o crédito, y a cuántas cuotas?",en:"Crédito, a una sola cuota, por favor.",tts:"¿Ahorros, corriente o crédito, y a cuántas cuotas?",choices:["Crédito, a una sola cuota, por favor.","Vengo por turismo dos semanas.","Cada ocho horas después de comer.","Arriba solo las puntas con tijera."]},
  {kind:"meaning",focus:"present",cat:"bancos-pagos",es:"Sin factura electrónica; consumidor final, por favor.",en:"No electronic invoice needed; final consumer, please.",tts:"Sin factura electrónica; consumidor final, por favor.",choices:["No electronic invoice needed; final consumer, please.","My suitcase still hasn't come out on the belt.","I am waiting for a Rappi delivery.","I am not allergic to any medication."]},
  {kind:"reply",focus:"present",cat:"barberia",es:"Buenas, parcero. ¿Cómo se lo vamos a cortar hoy?",en:"Quiero un desvanecido bajito a los lados con la dos.",tts:"Buenas, parcero. ¿Cómo se lo vamos a cortar hoy?",choices:["Quiero un desvanecido bajito a los lados con la dos.","Cuenta de ahorros, por favor.","Aquí tiene mi pasaporte.","Tómese una pastilla cada ocho horas."]},
  {kind:"meaning",focus:"present",cat:"barberia",es:"Arriba solo bájeme un poquito con tijera.",en:"On top just trim a little bit with scissors.",tts:"Arriba solo bájeme un poquito con tijera.",choices:["On top just trim a little bit with scissors.","Go straight to the traffic light.","The internet went down this morning.","Include the tip on the bill, please."]},
  {kind:"reply",focus:"present",cat:"medico",es:"¿Desde cuándo tiene fiebre y es alérgico a algún medicamento?",en:"Desde anoche, y no soy alérgico a nada.",tts:"¿Desde cuándo tiene fiebre y es alérgico a algún medicamento?",choices:["Desde anoche, y no soy alérgico a nada.","A una sola cuota sin factura.","En el apartamento quinientos dos.","Solo las puntas con tijera."]},
  {kind:"meaning",focus:"present",cat:"medico",es:"¿Cada cuántas horas debo tomar esta pastilla?",en:"How many hours apart should I take this pill?",tts:"¿Cada cuántas horas debo tomar esta pastilla?",choices:["How many hours apart should I take this pill?","At which door does the Uber pick me up?","Can I pay with Nequi or cash?","Can you hold the package at the front desk?"]},
  {kind:"reply",focus:"present",cat:"porteria",es:"Vecino, llegó un domiciliario de Rappi para su apartamento.",en:"Qué pena, ¿me lo puede recibir ahí en portería? Ya bajo.",tts:"Vecino, llegó un domiciliario de Rappi para su apartamento.",choices:["Qué pena, ¿me lo puede recibir ahí en portería? Ya bajo.","Vengo por turismo durante diez días.","No soy alérgico a ningún medicamento.","Quiero un corte bajito a los lados."]},
  {kind:"meaning",focus:"past",cat:"porteria",es:"Se cayó el internet en el apartamento desde esta mañana.",en:"The internet has been down in the apartment since this morning.",tts:"Se cayó el internet en el apartamento desde esta mañana.",choices:["The internet has been down in the apartment since this morning.","The suitcase arrived on the baggage belt.","He trimmed my beard at the barbershop.","We included the tip on the credit card."]}
);

V60_FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"future",cat:"aeropuerto",es:"Me ___ a quedar dos semanas en Colombia.",en:"voy",tts:"Me voy a quedar dos semanas en Colombia.",trans:"I am going to stay two weeks in Colombia.",choices:["voy","fui","vaya","yendo"]},
  {kind:"blank",focus:"present",cat:"bancos-pagos",es:"Con tarjeta de crédito, a una sola ___, por favor.",en:"cuota",tts:"Con tarjeta de crédito, a una sola cuota, por favor.",trans:"By credit card, in a single installment, please.",choices:["cuota","cuenta","maleta","tijera"]},
  {kind:"blank",focus:"present",cat:"bancos-pagos",es:"¿Me acerca el ___ para pagar con tarjeta?",en:"datáfono",tts:"¿Me acerca el datáfono para pagar con tarjeta?",trans:"Can you bring me the card terminal to pay by card?",choices:["datáfono","semáforo","citófono","pasaporte"]},
  {kind:"blank",focus:"present",cat:"barberia",es:"Quiero un ___ bajito a los lados con la dos.",en:"desvanecido",tts:"Quiero un desvanecido bajito a los lados con la dos.",trans:"I want a low fade on the sides with a #2.",choices:["desvanecido","domicilio","equipaje","descuento"]},
  {kind:"blank",focus:"present",cat:"medico",es:"Tómese esta pastilla cada ocho horas ___ de comer.",en:"después",tts:"Tómese esta pastilla cada ocho horas después de comer.",trans:"Take this pill every eight hours after eating.",choices:["después","durante","adentro","lejos"]},
  {kind:"blank",focus:"present",cat:"porteria",es:"Estoy esperando un ___ de Rappi; ¿me avisa cuando llegue?",en:"domicilio",tts:"Estoy esperando un domicilio de Rappi; ¿me avisa cuando llegue?",trans:"I am waiting for a Rappi delivery; can you let me know when it arrives?",choices:["domicilio","datáfono","desayuno","documento"]},
  {kind:"blank",focus:"past",cat:"porteria",es:"Parece que se ___ el agua en todo el edificio.",en:"fue",tts:"Parece que se fue el agua en todo el edificio.",trans:"It seems the water went out in the whole building.",choices:["fue","fui","iré","ido"]}
);

// ── V92.0 CONVERSATIONAL MASTERY EXPANSION ──────────────────────────────────
/* 1. Regional tags for existing COLOMBIANISMOS + 24 new regional expressions */
(function(){
  const regionMap={
    "¿Qué más?":"all","¡Venga!":"all","Listo":"all","Bacano/a":"all","Chévere":"all",
    "Parcero / Parce":"medellin","Tinto":"all","Plata":"all","Vaina":"all","¡Uy!":"all",
    "Dale":"all","Chimba":"medellin","Hacer una vuelta":"all","¿Me regala...?":"bogota",
    "Chino/a":"bogota","Berraco/a":"all","Juepucha / hijuepucha":"all","Hijueputa":"all",
    "Gonorrea":"all","Pirobo":"bogota","Malparido/a":"all","Carechimba":"medellin",
    "Marica":"all","Güevón / huevón":"all","Puta":"all","No joda / No jodas":"cali-costa",
    "Qué jartera":"bogota","Me importa un culo":"all"
  };
  COLOMBIANISMOS.forEach(item=>{if(!item.region)item.region=regionMap[item.word]||"all";});
})();

COLOMBIANISMOS.push(
  /* 🏔️ Bogotá & Altiplano (Rolos) */
  {word:"Sumercé",en:"You (warm, respectful address)",region:"bogota",register:"Bogotá · warm polite",registerGroup:"everyday",usage:"A beloved Bogotá and Boyacá pronoun meaning 'you' (from 'su merced'). Shows warmth and respect with family, shopkeepers, or elders.",example:"Sumercé, ¿me regala un tintico por favor?",tts:"Sumercé, ¿me regala un tintico por favor?"},
  {word:"Veci / Vecino/a",en:"Neighbor (used for shopkeepers & doormen)",region:"bogota",register:"Bogotá · everyday polite",registerGroup:"everyday",usage:"In Bogotá, people call store clerks, bakers, and building staff 'veci' or 'vecino/a' even if they don't know them.",example:"Buenas, veci, ¿a cómo tiene el aguacate hoy?",tts:"Buenas, veci, ¿a cómo tiene el aguacate hoy?"},
  {word:"Qué pena con usted",en:"Excuse me / Sorry to bother you",region:"bogota",register:"Colombian · essential polite",registerGroup:"everyday",usage:"The gold-standard Bogotá softener before asking a question, squeezing past someone, or apologizing.",example:"Qué pena con usted, ¿me dice dónde queda el baño?",tts:"Qué pena con usted, ¿me dice dónde queda el baño?"},
  {word:"Pola",en:"Beer (cold lager)",region:"bogota",register:"Colombian · everyday",registerGroup:"everyday",usage:"Named after independence heroine Policarpa Salavarrieta ('La Pola'). 'Vamos por unas polas' = Let's grab some beers.",example:"¿Nos tomamos una pola después del trabajo?",tts:"¿Nos tomamos una pola después del trabajo?"},
  {word:"Mecato",en:"Snacks / junk food / treats",region:"all",register:"Colombian · everyday",registerGroup:"everyday",usage:"Small snacks between meals (chips, chocolates, pastries). 'Mecatear' = to snack.",example:"Voy a la tienda a comprar mecato para la tarde.",tts:"Voy a la tienda a comprar mecato para la tarde."},
  {word:"Hacer frío / El Pacheco",en:"Bitterness of Bogotá's cold wind",region:"bogota",register:"Bogotá · local",registerGroup:"everyday",usage:"In Bogotá, intense cold weather is affectionately called 'el Pacheco'. Always carry an umbrella and jacket!",example:"¡Uy, hoy está haciendo un frío tenaz en Bogotá!",tts:"¡Uy, hoy está haciendo un frío tenaz en Bogotá!"},
  {word:"Chusco/a",en:"Cute / good-looking / nice",region:"bogota",register:"Bogotá · friendly",registerGroup:"everyday",usage:"Classic Bogotá compliment for a person, outfit, or place.",example:"¡Qué apartamento tan chusco tienes!",tts:"¡Qué apartamento tan chusco tienes!"},
  {word:"Juicioso/a",en:"Well-behaved / diligent / responsible",region:"all",register:"Colombian · everyday",registerGroup:"everyday",usage:"One of the most Colombian words of all. Means hardworking, focused, or staying out of trouble.",example:"Estoy estudiando español muy juicioso todos los días.",tts:"Estoy estudiando español muy juicioso todos los días."},

  /* 🌸 Medellín & Eje Cafetero (Paisas) */
  {word:"¿Qué más pues?",en:"How's it going then? (Paisa greeting)",region:"medellin",register:"Medellín · everyday",registerGroup:"everyday",usage:"Adding 'pues' at the end of phrases is the signature rhythm of Medellín and the coffee region.",example:"¡Hola, parce! ¿Qué más pues? ¿Todo bien?",tts:"¡Hola, parce! ¿Qué más pues? ¿Todo bien?"},
  {word:"Hágale pues",en:"Go right ahead / Sounds good / Let's do it",region:"medellin",register:"Medellín · everyday",registerGroup:"everyday",usage:"Warm green-light response in Medellín for 'go ahead', 'sure thing', or 'let's do it'.",example:"¿Nos vemos a las siete? — ¡Hágale pues!",tts:"¿Nos vemos a las siete? ¡Hágale pues!"},
  {word:"Amañado/a",en:"Feeling at home / loving a place",region:"medellin",register:"Medellín · warm local",registerGroup:"everyday",usage:"In Medellín, people will constantly ask '¿Está amañado en Colombia?' meaning 'Are you settling in and enjoying it here?'",example:"Estoy muy amañado viviendo aquí en Medellín.",tts:"Estoy muy amañado viviendo aquí en Medellín."},
  {word:"Charro/a",en:"Funny / awkward / uncool (Paisa)",region:"medellin",register:"Medellín · watch context",registerGroup:"informal",usage:"In Medellín, 'qué charro' means something is either hilariously silly OR a bit lame/awkward depending on tone.",example:"¡Qué cuento tan charro el que me contaste!",tts:"¡Qué cuento tan charro el que me contaste!"},
  {word:"El parche",en:"The friend group / hangout plan",region:"medellin",register:"Colombian · casual",registerGroup:"everyday",usage:"'Armar parche' or 'un buen parche' means a great hangout plan or group of friends.",example:"Hoy tenemos un parche muy bacano con los amigos.",tts:"Hoy tenemos un parche muy bacano con los amigos."},
  {word:"Taco",en:"Traffic jam (Medellín!)",region:"medellin",register:"Medellín · everyday",registerGroup:"everyday",usage:"While Bogotá says 'trancón', Medellín says 'taco' for heavy traffic! ('Hay mucho taco en El Poblado').",example:"Llegué tarde porque había un taco horrible en la avenida.",tts:"Llegué tarde porque había un taco horrible en la avenida."},
  {word:"¡Eh, ave María!",en:"Oh my goodness! / Well I never!",region:"medellin",register:"Medellín · classic paisa",registerGroup:"everyday",usage:"Classic Paisa exclamation of surprise, admiration, or emphasis.",example:"¡Eh, ave María, qué almuerzo tan rico!",tts:"¡Eh, ave María, qué almuerzo tan rico!"},
  {word:"Vos ( ¿Cómo estás vos? )",en:"You (informal Paisa & Cali pronoun)",region:"medellin",register:"Medellín & Cali · everyday",registerGroup:"everyday",usage:"In Medellín and Cali, 'vos' often replaces 'tú' among friends ('¿Vos de dónde sos?', '¿Qué querés comer?').",example:"¿Y vos a qué hora salís de trabajar hoy?",tts:"¿Y vos a qué hora salís de trabajar hoy?"},

  /* 🌴 Cali, Valle & La Costa */
  {word:"¡Mirá ve!",en:"Look here! / Hey listen! (Cali signature)",region:"cali-costa",register:"Cali · everyday",registerGroup:"everyday",usage:"The unmistakable signature phrase of Cali (Valle del Cauca) to get someone's attention warmly.",example:"¡Mirá ve, vamos a comer un cholado en el parque!",tts:"¡Mirá ve, vamos a comer un cholado en el parque!"},
  {word:"¿Oís? / ¿Oíste?",en:"You hear? / Got it? (Cali & Costa)",region:"cali-costa",register:"Cali & Costa · everyday",registerGroup:"everyday",usage:"Placed at the end of a sentence in Cali and the Caribbean coast to check agreement, like 'okay?' or 'you know?'",example:"Te aviso apenas llegue a la casa, ¿oíste?",tts:"Te aviso apenas llegue a la casa, ¿oíste?"},
  {word:"Camellar",en:"To work hard / hustle",region:"all",register:"Colombian · casual",registerGroup:"everyday",usage:"'El camello' = work/job; 'camellar' = to work. Heard across Cali, the Coast, Bogotá, and Medellín.",example:"Mañana me toca camellar desde temprano.",tts:"Mañana me toca camellar desde temprano."},
  {word:"Un chicharrón",en:"A messy problem / hassle (or crispy pork!)",region:"all",register:"Colombian · everyday",registerGroup:"everyday",usage:"Besides delicious crispy pork belly, 'tener un chicharrón' in Colombia means dealing with a complicated work or life problem.",example:"Me salió un chicharrón en la oficina a última hora.",tts:"Me salió un chicharrón en la oficina a última hora."},
  {word:"Guayabo",en:"Hangover (or homesickness)",region:"all",register:"Colombian · everyday",registerGroup:"everyday",usage:"In Colombia, 'tener guayabo' means having a hangover after a party (unlike Mexico's 'cruda' or Spain's 'resaca').",example:"Amanecí con guayabo después de la fiesta de anoche.",tts:"Amanecí con guayabo después de la fiesta de anoche."},
  {word:"La ñapa",en:"Free extra bit / bonus on top",region:"cali-costa",register:"Colombian · market & shops",registerGroup:"everyday",usage:"When buying fruit, juice, or street food, asking '¿Y la ñapa?' politely asks for a little extra on the house.",example:"Veci, deme dos jugos de mango, ¿y me da la ñapa?",tts:"Veci, deme dos jugos de mango, ¿y me da la ñapa?"},
  {word:"Rumbear / La rumba",en:"To party / go out dancing",region:"cali-costa",register:"Colombian · social",registerGroup:"everyday",usage:"In Colombia (especially Cali, the salsa capital), 'ir de rumba' or 'rumbear' means going out dancing and partying.",example:"El viernes vamos a rumbear y a bailar salsa en Cali.",tts:"El viernes vamos a rumbear y a bailar salsa en Cali."},
  {word:"¡Eche!",en:"Hey! / Come on! (Caribbean Coast)",region:"cali-costa",register:"Costa · informal",registerGroup:"informal",usage:"Signature expression in Barranquilla, Cartagena, and Santa Marta expressing surprise or 'come on!'",example:"¡Eche, pero por qué llegaste tan tarde hoy!",tts:"¡Eche, pero por qué llegaste tan tarde hoy!"}
);

/* 2. Interactive Connector & Time-Buyer Bridge Drills for Gramática → Hablar */
const CONNECTOR_BRIDGE_DRILLS=[
  {
    id:"bridge-1",
    context:"🤝 Softening an excuse when you can't make it on time",
    thoughtA:"Quiero ir a cenar con ustedes",
    thoughtB:"todavía tengo que terminar un informe en la oficina.",
    en:"I want to go to dinner with you all, [the thing is that] I still have to finish a report at the office.",
    correct:", lo que pasa es que ",
    choices:[", lo que pasa es que "," por culpa de "," sin embargo ayer "," para que nunca "],
    tip:"'Lo que pasa es que…' ('The thing is that…') is the #1 Colombian softener for explaining a delay or problem."
  },
  {
    id:"bridge-2",
    context:"☕ Buying time while thinking of an address or answer",
    thoughtA:"¿La dirección del restaurante?",
    thoughtB:"queda en la calle setenta, al lado del parque.",
    en:"The restaurant address? [Well, let's see…] it's on 70th Street, next to the park.",
    correct:" Pues, a ver… ",
    choices:[" Pues, a ver… "," A pesar de "," Sin embargo "," Mientras tanto "],
    tip:"Start your answer with 'Pues, a ver…' ('Well, let's see…') to buy 2 seconds of natural thinking time instead of saying 'ummm'."
  },
  {
    id:"bridge-3",
    context:"📲 Promising to text a friend the moment you arrive",
    thoughtA:"Ya voy saliendo en el Uber;",
    thoughtB:"llegue a la entrada, te mando un mensaje.",
    en:"I'm heading out in the Uber now; [as soon as] I arrive at the entrance, I'll send you a message.",
    correct:" apenas ",
    choices:[" apenas "," aunque ayer "," porque nunca "," durante "],
    tip:"'Apenas + subjunctive' ('apenas llegue' / 'apenas salga') is the most natural Colombian way to say 'as soon as'."
  },
  {
    id:"bridge-4",
    context:"🌧️ Explaining why you're bringing an umbrella or cash",
    thoughtA:"Voy a llevar veinte mil pesos en efectivo",
    thoughtB:"no funcione el datáfono en la tienda.",
    en:"I'm going to bring 20,000 pesos in cash [just in case] the card terminal doesn't work at the shop.",
    correct:" por si acaso ",
    choices:[" por si acaso "," por eso ayer "," desde que "," tampoco "],
    tip:"'Por si acaso' ('just in case') connects any precaution to what might happen."
  },
  {
    id:"bridge-5",
    context:"🚕 Explaining the cause of a delay naturally at the start",
    thoughtA:"Qué pena llegar tarde;",
    thoughtB:"había mucho trancón en la avenida, nos demoramos media hora.",
    en:"Sorry for arriving late; [since / because] there was a lot of traffic on the avenue, we were delayed half an hour.",
    correct:" como ",
    choices:[" como "," pero si "," para que "," ni siquiera "],
    tip:"When the reason comes FIRST, Spanish uses 'Como…' ('Como había trancón…') rather than starting with 'Porque'."
  },
  {
    id:"bridge-6",
    context:"🎉 Accepting an invitation warmly with a small condition",
    thoughtA:"¡Hágale, de una!",
    thoughtB:"me toca salir temprano porque mañana madrugo.",
    en:"Let's do it, I'm in! [Except / only thing is] I have to head out early because I get up early tomorrow.",
    correct:" Eso sí, ",
    choices:[" Eso sí, "," Por lo tanto "," Ni siquiera "," Cuando ayer "],
    tip:"'Eso sí…' ('Mind you / That said…') lets you enthusiastically agree first and add one condition right after."
  },
  {
    id:"bridge-7",
    context:"🛒 Expressing a 'maybe' plan in Colombian Spanish",
    thoughtA:"Todavía no sé qué voy a hacer el domingo;",
    thoughtB:"vamos a almorzar a un pueblo cerca de la ciudad.",
    en:"I don't know yet what I'm doing on Sunday; [maybe / perhaps] we'll go have lunch in a town near the city.",
    correct:" de pronto ",
    choices:[" de pronto "," hace rato "," en cambio "," jamás "],
    tip:"In Colombia, 'de pronto' means 'maybe / perhaps' (not 'suddenly'!) in 90% of everyday conversations."
  },
  {
    id:"bridge-8",
    context:"🏢 Asking someone to do something so you both benefit",
    thoughtA:"Pásame la ubicación exacta por WhatsApp",
    thoughtB:"el conductor pueda dejarme justo al frente de la portería.",
    en:"Send me the exact location on WhatsApp [so that] the driver can drop me right in front of the front desk.",
    correct:" para que ",
    choices:[" para que "," porque ya "," sin que ayer "," entonces fui "],
    tip:"Use 'para que + subjunctive' whenever you do something so that someone else can do something."
  }
];
// ── V93.0 COLOMBIAN SPEAKING MASTERY & PRO COACHING EXPANSION ───────────────
/* 1. 4 New Real-World Colombian Scenarios (Phrases, Dialogues, Readings, Missions, Lessons, Ladders):
      - Direcciones, cuadras y seguridad ("No dar papaya" & Colombian address grid)
      - Panadería, tinto y jugos naturales (pandebono, almojábana, perico, lulo en agua/leche)
      - Terminal, peajes y paseo de finca (puente festivo, buses, pueblos)
      - Reacciones, empatía y amistad (¡Qué pecado!, ¡Qué embarrada!, ¡No me digas!) */

FRASES.push(
  {section:"🧭 Cuadras, carreras y seguridad",quizCat:"direcciones",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[
    {es:"Queda en la carrera séptima con calle setenta y dos.",en:"It is at Carrera 7 and Calle 72.",register:"Colombian · address grid"},
    {es:"Suba dos cuadras hacia los cerros y voltee a la derecha.",en:"Go up two blocks toward the hills and turn right.",register:"Bogotá · navigation"},
    {es:"El edificio queda justo al frente del parque, pasando el semáforo.",en:"The building is right across from the park, past the traffic light.",register:"Colombian · everyday"},
    {es:"Qué pena, ¿este sector es tranquilo para caminar de noche?",en:"Excuse me, is this area safe/calm to walk at night?",register:"Street smart · polite"},
    {es:"Es mejor no dar papaya con el celular en la calle.",en:"It's better not to make yourself an easy target with your phone on the street.",register:"Colombian · essential idiom"},
    {es:"¿Por dónde es mejor coger para no meternos en el trancón?",en:"Which way is better to take so we don't get stuck in traffic?",register:"Colombian · everyday"}
  ]},
  {section:"🥐 Panadería, café y jugos",quizCat:"panaderia",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[
    {es:"Buenas, veci. ¿Los pandebonos y las almojábanas salieron calienticos?",en:"Hi neighbor. Did the pandebonos and almojábanas come out warm/fresh?",register:"Colombian · panadería"},
    {es:"Me regala un perico y un buñuelo para comer aquí, por favor.",en:"Can I have a small coffee with milk and a buñuelo to eat here, please.",register:"Bogotá & Eje Cafetero"},
    {es:"¿Qué jugos naturales tiene hoy? ¿Tiene de lulo o de maracuyá?",en:"What fresh fruit juices do you have today? Do you have lulo or passionfruit?",register:"Colombian · everyday"},
    {es:"Me da un jugo de guanábana en leche, bajito de azúcar, por favor.",en:"Give me a soursop juice in milk, low on sugar, please.",register:"Colombian · everyday"},
    {es:"Y para mí un jugo de mora en agua, sin azúcar.",en:"And for me a blackberry juice in water, without sugar.",register:"Colombian · everyday"},
    {es:"¿Me regala dos empanadas con ají aparte para llevar?",en:"Can I have two empanadas with hot sauce on the side to go?",register:"Colombian · everyday"}
  ]},
  {section:"🌄 Buses, pueblos y paseo de finca",quizCat:"viajes-finca",cls:"color:var(--green);background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2)",items:[
    {es:"Buenas, ¿a qué hora sale el próximo bus para Villa de Leyva?",en:"Hi, what time does the next bus leave for Villa de Leyva?",register:"Travel · bus terminal"},
    {es:"Me vende dos pasajes para las diez de la mañana, por favor.",en:"Sell me two tickets for ten in the morning, please.",register:"Travel · everyday"},
    {es:"¿Por cuál plataforma o módulo abordamos el bus?",en:"From which platform or bay do we board the bus?",register:"Travel · bus terminal"},
    {es:"Maestro, ¿me puede dejar en la entrada de la vereda después del peaje?",en:"Driver, can you drop me off at the entrance to the rural district (vereda) after the toll booth?",register:"Colombian · rural travel"},
    {es:"Este puente festivo vamos de paseo a una finca en tierra caliente.",en:"This long holiday weekend we're going on a trip to a country house in warm country.",register:"Colombian · social"},
    {es:"¿Cuánto se demora el viaje si no hay mucho trancón en la salida?",en:"How long does the trip take if there isn't much traffic leaving town?",register:"Colombian · everyday"}
  ]},
  {section:"💛 Empatía, reacciones y amistad",quizCat:"empatia",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[
    {es:"¡No me digas! ¿En serio te pasó todo eso ayer?",en:"You don't say! Did all of that really happen to you yesterday?",register:"Colombian · reaction"},
    {es:"¡Qué embarrada! Lo siento mucho, cuenta conmigo para lo que necesites.",en:"What a bummer / mess! I'm so sorry, count on me for whatever you need.",register:"Colombian · empathy"},
    {es:"¡Ay, qué pecado! Ojalá se mejore muy pronto.",en:"Oh, what a shame / poor thing! Hopefully they get better very soon.",register:"Colombian · warm empathy"},
    {es:"¡Qué nota! Me alegra muchísimo por ti, te lo mereces.",en:"How awesome! I'm so happy for you, you deserve it.",register:"Colombian · celebration"},
    {es:"Me caes súper bien; qué chévere hablar contigo.",en:"I really like you (as a person); how great talking with you.",register:"Colombian · friendship & dating"},
    {es:"¿Te gustaría volver a vernos esta semana para tomar un café?",en:"Would you like to see each other again this week to grab a coffee?",register:"Colombian · warm invite"}
  ]}
);

CONVERSATIONS.push(
  v60Dialogue("Direcciones, cuadras y seguridad","Decoding Colombian street addresses, landmarks, and asking about neighborhood safety",[
    ["A","Disculpe, vecino, qué pena con usted. Busco la carrera séptima con calle setenta y dos, número once veinticuatro.","Excuse me, neighbor, sorry to bother you. I'm looking for Carrera 7 and Calle 72, number 11-24."],
    ["B","Con mucho gusto. Suba dos cuadras hacia los cerros y voltee a la izquierda en el semáforo.","With pleasure. Go up two blocks toward the hills and turn left at the traffic light."],
    ["A","Ah, listo. ¿Queda pasando el parque o antes de llegar al banco?","Ah, got it. Is it past the park or before getting to the bank?"],
    ["B","Queda justo al frente del banco, al lado de una panadería grande.","It's right across from the bank, next to a big bakery."],
    ["A","Perfecto. Una pregunta más: ¿este sector es tranquilo para caminar por la noche?","Perfect. One more question: is this area safe to walk at night?"],
    ["B","Sí, por esta avenida es tranquilo, pero igual es mejor no dar papaya con el celular.","Yes, along this avenue it's calm, but still it's better not to flash your phone on the street."]
  ],[{es:"¿Cuántas cuadras faltan para llegar a la estación?",en:"How many blocks are left to get to the station?",tts:"¿Cuántas cuadras faltan para llegar a la estación?"},{es:"Por la noche es mejor pedir un Uber desde la portería.",en:"At night it's better to order an Uber from the front desk.",tts:"Por la noche es mejor pedir un Uber desde la portería."}]),
  v60Dialogue("Panadería, tinto y jugos naturales","Ordering warm pandebonos, coffee, and fresh fruit juices in water or milk",[
    ["A","Buenos días, bienvenido. ¿Qué se va a servir hoy? Acabaron de salir pandebonos y almojábanas.","Good morning, welcome. What will you have today? Pandebonos and almojábanas just came out of the oven."],
    ["B","Buenos días, veci. ¡Qué rico! Me regala dos pandebonos calienticos y un perico, por favor.","Good morning, neighbor. How delicious! Can I have two warm pandebonos and a small coffee with milk, please."],
    ["A","Claro que sí. ¿Y para tomar algo frío? Hoy tenemos jugo natural de lulo, maracuyá, guanábana y mora.","Of course. And for something cold to drink? Today we have fresh lulo, passionfruit, soursop, and blackberry juice."],
    ["B","Me da un jugo de lulo en agua y otro de guanábana en leche, ambos bajitos de azúcar.","Give me a lulo juice in water and a soursop juice in milk, both low on sugar."],
    ["A","Con mucho gusto. ¿Para comer aquí en la mesa o se los empaco para llevar?","With pleasure. To eat here at the table or should I pack them to go?"],
    ["B","Para comer aquí, y me incluye también una empanada con ají aparte, por favor.","To eat here, and please also include an empanada with hot sauce on the side."]
  ],[{es:"¿Me regala un tintico sin azúcar y un pan de yuca?",en:"Can I have a black coffee without sugar and a yuca cheese bread?",tts:"¿Me regala un tintico sin azúcar y un pan de yuca?"},{es:"¿El jugo de maracuyá lo prefiere en agua o en leche?",en:"Do you prefer the passionfruit juice in water or in milk?",tts:"¿El jugo de maracuyá lo prefiere en agua o en leche?"}]),
  v60Dialogue("Terminal, peajes y paseo de finca","Buying bus tickets, asking about holiday traffic, and getting off on a rural road",[
    ["A","Buenas tardes. ¿Para dónde viaja hoy? Tenemos salida para Medellín, Guatapé y el Eje Cafetero.","Good afternoon. Where are you traveling to today? We have departures for Medellín, Guatapé, and the Coffee Region."],
    ["B","Buenas tardes. Me vende dos pasajes para el próximo bus que salga, por favor. ¿Cuánto se demora?","Good afternoon. Sell me two tickets for the next bus leaving, please. How long does it take?"],
    ["A","Normalmente son dos horas, pero como hoy es puente festivo hay bastante tráfico en el peaje.","Normally it's two hours, but since today is a holiday weekend there is quite a bit of traffic at the toll booth."],
    ["B","Entiendo. ¿El conductor nos puede dejar sobre la vía principal en la entrada de la vereda?","I understand. Can the driver drop us off on the main road at the entrance to the rural lane?"],
    ["A","Sí, señor, usted le avisa al conductor diez minutos antes de llegar para que pare con cuidado.","Yes, sir, just let the driver know ten minutes before arriving so he can pull over safely."],
    ["B","Excelente, muchas gracias. ¿Por cuál plataforma abordamos y dónde entregamos las maletas?","Excellent, thank you very much. From which platform do we board and where do we hand over the suitcases?"]
  ],[{es:"Este puente festivo nos vamos de paseo a una finca con los amigos.",en:"This long weekend we're going on a trip to a finca with friends.",tts:"Este puente festivo nos vamos de paseo a una finca con los amigos."},{es:"Maestro, ¿me avisa cuando pasemos el segundo peaje, por favor?",en:"Driver, can you let me know when we pass the second toll booth, please?",tts:"Maestro, ¿me avisa cuando pasemos el segundo peaje, por favor?"}]),
  v60Dialogue("Reacciones, empatía y amistad","Reacting naturally with empathy, celebrating good news, and building real friendships",[
    ["A","¡Hola! Qué alegría verte. No te imaginas la semana tan pesada que tuve en el trabajo.","Hi! So good to see you. You can't imagine what a rough week I had at work."],
    ["B","¡No me digas! ¿Qué pasó? Cuéntame mientras nos tomamos un café.","You don't say! What happened? Tell me while we have a coffee."],
    ["A","Se nos cayó el sistema el martes y además perdí las llaves del apartamento bajo el aguacero.","Our system crashed on Tuesday and on top of that I lost my apartment keys in the downpour."],
    ["B","¡Uy, qué embarrada! Qué pesar contigo, de verdad. ¿Y al final cómo lograste entrar?","Oh, what a bummer! I feel so bad for you, really. And how did you manage to get in at the end?"],
    ["A","Por suerte el vecino de la portería tenía una copia. Pero bueno, la buena noticia es que me ascendieron hoy.","Luckily the doorman at the front desk had a spare. But anyway, the good news is I got promoted today."],
    ["B","¡¿En serio?! ¡Qué nota, te felicito! Me alegra muchísimo, tenemos que celebrar este viernes.","Seriously?! How awesome, congratulations! I'm so happy for you, we have to celebrate this Friday."]
  ],[{es:"¡Ay, qué pecado! Ojalá todo se solucione rápido.",en:"Oh, what a shame! Hopefully everything gets sorted out quickly.",tts:"¡Ay, qué pecado! Ojalá todo se solucione rápido."},{es:"Me caes súper bien; qué chévere conversar contigo siempre.",en:"I really like you; it's always so nice talking with you.",tts:"Me caes súper bien; qué chévere conversar contigo siempre."}])
);

READINGS.push(
  {id:"lectura-cuadras",level:"A2",title:"Cómo funcionan las direcciones en Colombia",lesson:"direcciones-cuadras",intro:"Learn how Colombians navigate using Calles, Carreras, numbers, and mountain landmarks.",lines:[
    {es:"En la mayoría de las ciudades colombianas, las direcciones usan un sistema de cuadrícula con calles y carreras.",en:"In most Colombian cities, addresses use a grid system with calles (streets) and carreras (avenues).",tts:"En la mayoría de las ciudades colombianas, las direcciones usan un sistema de cuadrícula con calles y carreras."},
    {es:"En Bogotá, las carreras van de sur a norte paralelas a los cerros, y las calles suben o bajan.",en:"In Bogotá, carreras run south to north parallel to the mountains, and calles go up or down.",tts:"En Bogotá, las carreras van de sur a norte paralelas a los cerros, y las calles suben o bajan."},
    {es:"Cuando alguien dice Carrera séptima con Calle setenta y dos, número once veinticuatro, el último número indica los metros desde la esquina.",en:"When someone says Carrera 7 with Calle 72, #11-24, the last number indicates the meters from the corner.",tts:"Cuando alguien dice Carrera séptima con Calle setenta y dos, número once veinticuatro, el último número indica los metros desde la esquina."},
    {es:"Además, los colombianos siempre recomiendan no dar papaya y guardar el celular al caminar.",en:"In addition, Colombians always recommend 'no dar papaya' (not making yourself a target) and putting your phone away when walking.",tts:"Además, los colombianos siempre recomiendan no dar papaya y guardar el celular al caminar."}
  ],questions:[{q:"¿Qué significa 'no dar papaya' en Colombia?",choices:["No exponerse ni descuidar objetos de valor","No comer fruta en la mañana","Caminar siempre hacia los cerros"],answer:"No exponerse ni descuidar objetos de valor"}]},
  {id:"lectura-panaderia",level:"A2",title:"La panadería del barrio y los jugos",lesson:"panaderia-jugos",intro:"Discover Colombia's beloved neighborhood bakery and fresh tropical fruit juice culture.",lines:[
    {es:"Por la mañana en Colombia siempre huele a pan recién horneado en la panadería de la esquina.",en:"In the morning in Colombia it always smells like freshly baked bread at the corner bakery.",tts:"Por la mañana en Colombia siempre huele a pan recién horneado en la panadería de la esquina."},
    {es:"La gente pasa temprano a pedir un tinto o un perico acompañado de un pandebono o una almojábana calientica.",en:"People stop by early to order a black coffee or small milk coffee with a warm pandebono or almojábana.",tts:"La gente pasa temprano a pedir un tinto o un perico acompañado de un pandebono o una almojábana calientica."},
    {es:"Al mediodía es muy común pedir un jugo natural de lulo, maracuyá, mora o guanábana.",en:"At noon it is very common to order a fresh juice made of lulo, passionfruit, blackberry, or soursop.",tts:"Al mediodía es muy común pedir un jugo natural de lulo, maracuyá, mora o guanábana."},
    {es:"El mesero siempre pregunta si lo quieres en agua o en leche, y puedes pedirlo bajito de azúcar.",en:"The waiter always asks if you want it in water or in milk, and you can ask for it low on sugar.",tts:"El mesero siempre pregunta si lo quieres en agua o en leche, y puedes pedirlo bajito de azúcar."}
  ],questions:[{q:"¿Qué pregunta siempre hacen cuando pides un jugo natural en Colombia?",choices:["¿En agua o en leche?","¿A cuántas cuotas?","¿Por cuál plataforma sale?"],answer:"¿En agua o en leche?"}]},
  {id:"lectura-finca",level:"B1",title:"Un puente festivo en una finca",lesson:"viajes-finca",intro:"Colombia has more public holidays (puentes festivos) than almost any country—and people love heading to a finca.",lines:[
    {es:"Colombia es famosa por sus puentes festivos, cuando el feriado se traslada al lunes para tener tres días libres.",en:"Colombia is famous for its long holiday weekends, when the holiday moves to Monday for three days off.",tts:"Colombia es famosa por sus puentes festivos, cuando el feriado se traslada al lunes para tener tres días libres."},
    {es:"Muchas familias y grupos de amigos viajan desde la terminal de transporte hacia pueblos de tierra caliente.",en:"Many families and friend groups travel from the bus terminal toward warm-weather towns.",tts:"Muchas familias y grupos de amigos viajan desde la terminal de transporte hacia pueblos de tierra caliente."},
    {es:"En el camino pasamos varios peajes y paramos a comer arepas de choclo en la carretera.",en:"Along the way we pass several toll booths and stop to eat sweet corn arepas on the highway.",tts:"En el camino pasamos varios peajes y paramos a comer arepas de choclo en la carretera."},
    {es:"Al llegar a la entrada de la vereda, caminamos diez minutos hasta la finca para descansar todo el fin de semana.",en:"Upon arriving at the rural lane entrance, we walk ten minutes to the finca to relax all weekend.",tts:"Al llegar a la entrada de la vereda, caminamos diez minutos hasta la finca para descansar todo el fin de semana."}
  ],questions:[{q:"¿Qué es un 'puente festivo' en Colombia?",choices:["Un fin de semana largo con lunes feriado","Un puente sobre un río en Bogotá","Un boleto de autobús"],answer:"Un fin de semana largo con lunes feriado"}]},
  {id:"lectura-empatia",level:"B1",title:"Ponerse al día con un amigo",lesson:"empatia-reacciones",intro:"Sound warm and human in Spanish by using authentic Colombian empathy reactions.",lines:[
    {es:"Cuando un colombiano te cuenta una historia, espera que reacciones con emoción y calidez.",en:"When a Colombian tells you a story, they expect you to react with emotion and warmth.",tts:"Cuando un colombiano te cuenta una historia, espera que reacciones con emoción y calidez."},
    {es:"Si algo salió mal o hubo un problema, puedes decir: ¡Uy, qué embarrada! o ¡Qué pesar contigo!",en:"If something went wrong or there was a problem, you can say: 'Uy, qué embarrada!' or 'Qué pesar contigo!'",tts:"Si algo salió mal o hubo un problema, puedes decir: ¡Uy, qué embarrada! o ¡Qué pesar contigo!"},
    {es:"Si te cuentan algo tierno o triste de alguien más, la expresión más natural es: ¡Ay, qué pecado!",en:"If they tell you something touching or sad about someone else, the most natural expression is: 'Ay, qué pecado!'",tts:"Si te cuentan algo tierno o triste de alguien más, la expresión más natural es: ¡Ay, qué pecado!"},
    {es:"Y cuando te dan una excelente noticia, celebra diciendo: ¡No me digas! ¡Qué nota, me alegra mucho!",en:"And when they give you great news, celebrate by saying: 'No me digas! Qué nota, I'm so glad!'",tts:"Y cuando te dan una excelente noticia, celebra diciendo: ¡No me digas! ¡Qué nota, me alegra mucho!"}
  ],questions:[{q:"¿Qué expresión colombiana se usa cuando pasa un problema o contratiempo frustrante?",choices:["¡Qué embarrada!","A una sola cuota","En agua sin azúcar"],answer:"¡Qué embarrada!"}]}
);

CONVERSATION_MISSIONS.push(
  {id:"mision-cuadras",title:"Da una dirección con cuadras y puntos de referencia",scenario:"A delivery driver or friend asks where your building is located relative to the avenue and park.",prompt:"Explica la dirección y da una recomendación de seguridad:",lesson:"direcciones-cuadras",models:[
    {es:"Queda en la carrera séptima con calle setenta y dos, dos cuadras arriba del parque, al frente del banco.",en:"It's at Carrera 7 and Calle 72, two blocks up from the park, across from the bank.",tts:"Queda en la carrera séptima con calle setenta y dos, dos cuadras arriba del parque, al frente del banco."},
    {es:"El sector es muy tranquilo, pero de noche es mejor no dar papaya con el celular en la calle.",en:"The area is very calm, but at night it's better not to flash your phone on the street.",tts:"El sector es muy tranquilo, pero de noche es mejor no dar papaya con el celular en la calle."}
  ]},
  {id:"mision-panaderia",title:"Pide en la panadería y personaliza tu jugo",scenario:"You walk into a neighborhood panadería in the morning. Ask what came out warm and order coffee and a fresh fruit juice.",prompt:"Haz tu pedido completo al panadero:",lesson:"panaderia-jugos",models:[
    {es:"Buenas, veci. ¿Salieron calienticos los pandebonos? Me regala dos, un perico y un jugo de lulo en agua bajito de azúcar.",en:"Hi neighbor. Did the pandebonos come out warm? Can I have two, a small coffee with milk, and a lulo juice in water low on sugar.",tts:"Buenas, veci. ¿Salieron calienticos los pandebonos? Me regala dos, un perico y un jugo de lulo en agua bajito de azúcar."},
    {es:"Me da una almojábana, una empanada con ají aparte y un jugo de guanábana en leche, por favor.",en:"Give me an almojábana, an empanada with hot sauce on the side, and a soursop juice in milk, please.",tts:"Me da una almojábana, una empanada con ají aparte y un jugo de guanábana en leche, por favor."}
  ]},
  {id:"mision-finca",title:"Compra pasajes y coordina la parada del bus",scenario:"You are at the bus terminal heading to a town for a puente festivo. Buy two tickets and ask the driver to drop you at the finca entrance.",prompt:"Habla en la taquilla y con el conductor:",lesson:"viajes-finca",models:[
    {es:"Buenas, me vende dos pasajes para el próximo bus. Maestro, ¿nos deja en la entrada de la vereda después del peaje?",en:"Hi, sell me two tickets for the next bus. Driver, can you drop us at the entrance to the rural district (vereda) after the toll?",tts:"Buenas, me vende dos pasajes para el próximo bus. Maestro, ¿nos deja en la entrada de la vereda después del peaje?"},
    {es:"¿A qué hora sale el bus y por cuál plataforma abordamos? Llevamos dos maletas.",en:"What time does the bus leave and from which platform do we board? We have two suitcases.",tts:"¿A qué hora sale el bus y por cuál plataforma abordamos? Llevamos dos maletas."}
  ]},
  {id:"mision-empatia",title:"Reacciona con empatía a lo que te cuenta un amigo",scenario:"Your Colombian friend tells you their flight got canceled in the rain, and then invites you for coffee tomorrow.",prompt:"Reacciona con empatía natural y acepta el plan:",lesson:"empatia-reacciones",models:[
    {es:"¡No me digas! ¡Uy, qué embarrada contigo! Claro que sí, mañana nos tomamos un café y me cuentas todo.",en:"You don't say! Oh, what a bummer for you! Of course, tomorrow we'll grab a coffee and you can tell me everything.",tts:"¡No me digas! ¡Uy, qué embarrada contigo! Claro que sí, mañana nos tomamos un café y me cuentas todo."},
    {es:"¡Qué pesar! Menos mal ya estás en casa. Me caes súper bien, nos vemos mañana sin falta.",en:"What a shame! Thankfully you're already home. I really like you, see you tomorrow without fail.",tts:"¡Qué pesar! Menos mal ya estás en casa. Me caes súper bien, nos vemos mañana sin falta."}
  ]}
);

Object.assign(LESSON_CONTENT,{
  "direcciones-cuadras":{
    goal:{es:"Queda en la carrera séptima con calle setenta y dos, dos cuadras arriba del parque.",en:"It is at Carrera 7 and Calle 72, two blocks up from the park."},
    words:[{es:"la carrera / la calle",en:"avenue (N-S) / street (E-W)"},{es:"dos cuadras arriba",en:"two blocks up (toward hills)"},{es:"al frente de",en:"across from / in front of"},{es:"pasando el semáforo",en:"past the traffic light"},{es:"sector tranquilo",en:"safe / calm area"},{es:"no dar papaya",en:"don't make yourself an easy target"}],
    phrases:[{en:"It is at Carrera 7 and Calle 72.",es:"Queda en la carrera séptima con calle setenta y dos."},{en:"Go up two blocks and turn right.",es:"Suba dos cuadras y voltee a la derecha."},{en:"Is this area safe to walk at night?",es:"¿Este sector es tranquilo para caminar de noche?"},{en:"It's better not to flash your phone on the street.",es:"Es mejor no dar papaya con el celular en la calle."}]
  },
  "panaderia-jugos":{
    goal:{es:"Veci, me regala un pandebono calientico, un perico y un jugo de lulo en agua bajito de azúcar.",en:"Neighbor, can I have a warm pandebono, a small coffee with milk, and a lulo juice in water low on sugar."},
    words:[{es:"el pandebono / la almojábana",en:"Colombian cheese breads"},{es:"calientico/a",en:"nice and warm / fresh out of the oven"},{es:"un perico / un tinto",en:"small milk coffee / black coffee"},{es:"jugo de lulo / maracuyá",en:"lulo / passionfruit juice"},{es:"en agua o en leche",en:"in water or in milk"},{es:"bajito de azúcar",en:"low on sugar"}],
    phrases:[{en:"Did the pandebonos come out warm?",es:"¿Salieron calienticos los pandebonos?"},{en:"Can I have a small coffee with milk and an almojábana?",es:"¿Me regala un perico y una almojábana?"},{en:"Give me a soursop juice in milk, low on sugar.",es:"Me da un jugo de guanábana en leche, bajito de azúcar."},{en:"And a blackberry juice in water without sugar.",es:"Y un jugo de mora en agua sin azúcar."}]
  },
  "viajes-finca":{
    goal:{es:"Me vende dos pasajes para el próximo bus. ¿Me deja en la entrada de la vereda después del peaje?",en:"Sell me two tickets for the next bus. Can you drop me at the entrance to the rural district (vereda) after the toll booth?"},
    words:[{es:"el puente festivo",en:"long holiday weekend"},{es:"la terminal de transporte",en:"bus terminal"},{es:"dos pasajes",en:"two tickets"},{es:"el peaje",en:"highway toll booth"},{es:"la entrada de la vereda",en:"rural lane entrance"},{es:"ir de paseo a una finca",en:"go on a trip to a country house"}],
    phrases:[{en:"What time does the next bus leave?",es:"¿A qué hora sale el próximo bus?"},{en:"Sell me two tickets for ten in the morning.",es:"Me vende dos pasajes para las diez de la mañana."},{en:"Can you drop me off after the toll booth?",es:"¿Me puede dejar después del peaje?"},{en:"This holiday weekend we are going to a finca.",es:"Este puente festivo vamos a una finca."}]
  },
  "empatia-reacciones":{
    goal:{es:"¡No me digas! ¡Uy, qué embarrada contigo! Cuenta conmigo para lo que necesites.",en:"You don't say! Oh, what a bummer for you! Count on me for whatever you need."},
    words:[{es:"¡No me digas!",en:"You don't say! / No way!"},{es:"¡Qué embarrada!",en:"What a bummer / mess!"},{es:"¡Qué pecado!",en:"What a shame / poor thing!"},{es:"¡Qué pesar!",en:"I feel so bad / what a pity!"},{es:"¡Qué nota!",en:"How awesome / cool!"},{es:"me caes súper bien",en:"I really like you (friendly)"}],
    phrases:[{en:"You don't say! Did that really happen?",es:"¡No me digas! ¿En serio pasó eso?"},{en:"What a bummer! I am so sorry.",es:"¡Qué embarrada! Lo siento mucho."},{en:"How awesome! I'm really happy for you.",es:"¡Qué nota! Me alegra muchísimo por ti."},{en:"I really like you; how nice talking with you.",es:"Me caes súper bien; qué chévere hablar contigo."}]
  }
});

Object.assign(LESSON_META,{
  "direcciones-cuadras":{stage:"Travel and Survival",difficulty:"Easy",prereq:"En la calle",dialogue:"Direcciones, cuadras y seguridad",vocab:"direcciones",quizCat:"direcciones",quizMode:"conversation",guideIds:["mandatos","por-para"],readingId:"lectura-cuadras",missionId:"mision-cuadras"},
  "panaderia-jugos":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Cortesía colombiana",dialogue:"Panadería, tinto y jugos naturales",vocab:"comida",quizCat:"panaderia",quizMode:"conversation",guideIds:["cortesia-colombiana","usted-tu-vos"],readingId:"lectura-panaderia",missionId:"mision-panaderia"},
  "viajes-finca":{stage:"Daily Life",difficulty:"Moderate",prereq:"Llegada al hotel",dialogue:"Terminal, peajes y paseo de finca",vocab:"lugares",quizCat:"viajes-finca",quizMode:"conversation",guideIds:["futuro","por-para"],readingId:"lectura-finca",missionId:"mision-finca"},
  "empatia-reacciones":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Colombianismos",dialogue:"Reacciones, empatía y amistad",vocab:"colombianismos",quizCat:"empatia",quizMode:"conversation",guideIds:["gustar","subjuntivo"],readingId:"lectura-empatia",missionId:"mision-empatia"}
});

Object.assign(SENTENCE_LADDERS,{
  "direcciones-cuadras":{
    title:"Decode Colombian street grids, landmarks, and safety",
    rungs:[
      {tag:"1. Anchor stem",es:"Queda en la carrera séptima…",en:"It is on Carrera 7…"},
      {tag:"2. + Cross street",es:"Queda en la carrera séptima con calle setenta y dos.",en:"It is at Carrera 7 and Calle 72."},
      {tag:"3. + Landmark & blocks",es:"Suba dos cuadras hacia los cerros; queda al frente del parque.",en:"Go up two blocks toward the hills; it's across from the park."},
      {tag:"4. + Street safety check",es:"Queda dos cuadras arriba del parque; el sector es tranquilo, pero de noche es mejor no dar papaya con el celular.",en:"It's two blocks up from the park; the area is calm, but at night it's better not to flash your phone."}
    ],
    swaps:[
      {label:"Address number",es:"Busco la calle ochenta y cinco con carrera quince, número doce treinta.",en:"I'm looking for Calle 85 and Carrera 15, number 12-30."},
      {label:"Past traffic light",es:"Siga derecho pasando el semáforo y voltee en la panadería.",en:"Go straight past the traffic light and turn at the bakery."},
      {label:"Safe at night",es:"Qué pena, ¿por qué calle es mejor caminar a esta hora?",en:"Excuse me, which street is better to walk along at this hour?"}
    ]
  },
  "panaderia-jugos":{
    title:"Order warm bakery treats, coffee, and fresh fruit juices",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Me regala un pandebono?",en:"Can I have a pandebono?"},
      {tag:"2. + Freshness & coffee",es:"Veci, ¿me regala un pandebono calientico y un perico?",en:"Neighbor, can I have a warm pandebono and a small milk coffee?"},
      {tag:"3. + Fresh fruit juice",es:"Me regala un pandebono calientico y un jugo de lulo en agua.",en:"Can I have a warm pandebono and a lulo juice in water."},
      {tag:"4. + Full panadería order",es:"Buenos días, veci; me regala dos pandebonos calienticos, un perico y un jugo de guanábana en leche bajito de azúcar.",en:"Good morning, neighbor; can I have two warm pandebonos, a small milk coffee, and a soursop juice in milk low on sugar."}
    ],
    swaps:[
      {label:"Almojábana & tinto",es:"¿Salieron calienticas las almojábanas? Me da una con un tintico.",en:"Did the almojábanas come out warm? Give me one with a black coffee."},
      {label:"Maracuyá sin azúcar",es:"Para tomar quiero un jugo natural de maracuyá en agua, sin azúcar.",en:"To drink I want a fresh passionfruit juice in water, without sugar."},
      {label:"Empanadas con ají",es:"¿Me empaca tres empanadas para llevar con el ají aparte, por favor?",en:"Can you pack three empanadas to go with the hot sauce on the side, please?"}
    ]
  },
  "viajes-finca":{
    title:"Buy bus tickets and coordinate rural finca drop-offs",
    rungs:[
      {tag:"1. Anchor stem",es:"Me vende dos pasajes…",en:"Sell me two tickets…"},
      {tag:"2. + Destination & time",es:"Me vende dos pasajes para el próximo bus a Guatapé.",en:"Sell me two tickets for the next bus to Guatapé."},
      {tag:"3. + Boarding gate",es:"Me vende dos pasajes, por favor. ¿Por cuál plataforma sale el bus?",en:"Sell me two tickets, please. From which platform does the bus leave?"},
      {tag:"4. + Rural drop-off",es:"Maestro, vamos para una finca este puente festivo; ¿nos puede dejar en la entrada de la vereda después del peaje?",en:"Driver, we're going to a finca this holiday weekend; can you drop us at the entrance to the rural district (vereda) after the toll booth?"}
    ],
    swaps:[
      {label:"Travel duration",es:"¿Cuánto se demora el bus si hay trancón saliendo de la ciudad?",en:"How long does the bus take if there is traffic leaving the city?"},
      {label:"Luggage tag",es:"¿Dónde entrego esta maleta grande para que la guarden en la bodega?",en:"Where do I hand over this large suitcase so they put it in the luggage hold?"},
      {label:"Return ticket",es:"¿A qué hora sale el último bus de regreso el lunes festivo?",en:"What time does the last bus back leave on holiday Monday?"}
    ]
  },
  "empatia-reacciones":{
    title:"React with authentic Colombian warmth, empathy, and celebration",
    rungs:[
      {tag:"1. Anchor stem",es:"¡No me digas!",en:"You don't say!"},
      {tag:"2. + Empathy reaction",es:"¡No me digas! ¡Uy, qué embarrada contigo!",en:"You don't say! Oh, what a bummer for you!"},
      {tag:"3. + Offer support",es:"¡Qué embarrada lo que pasó! Cuenta conmigo para lo que necesites.",en:"What a bummer what happened! Count on me for whatever you need."},
      {tag:"4. + Warm connection",es:"¡Qué nota que ya todo salió bien! Me caes súper bien; tenemos que vernos esta semana para celebrar.",en:"How awesome that everything worked out! I really like you; we have to meet up this week to celebrate."}
    ],
    swaps:[
      {label:"Sympathy (Qué pecado)",es:"¡Ay, qué pecado! Ojalá se recupere muy pronto de la gripa.",en:"Oh, poor thing! Hopefully they recover very soon from the flu."},
      {label:"Excitement (En serio)",es:"¡¿En serio te dieron el trabajo?! ¡Qué alegría, te felicito!",en:"Did they seriously give you the job?! What great news, congratulations!"},
      {label:"Second date / coffee",es:"Qué chévere hablar contigo hoy; ¿te gustaría salir otra vez el viernes?",en:"So nice talking with you today; would you like to go out again on Friday?"}
    ]
  }
});

/* 2. 8 New Everyday & Empathy Colombianismos (60 total) */
COLOMBIANISMOS.push(
  {word:"¡Qué embarrada!",en:"What a bummer! / What a mess!",region:"all",register:"Colombian · essential empathy",registerGroup:"everyday",usage:"The go-to safe Colombian reaction when someone tells you about a frustrating problem, canceled plan, or mistake.",example:"¡Uy, qué embarrada que se te quedó el celular en el taxi!",tts:"¡Uy, qué embarrada que se te quedó el celular en el taxi!"},
  {word:"¡Qué pecado!",en:"Poor thing! / What a shame!",region:"all",register:"Colombian · warm empathy",registerGroup:"everyday",usage:"Does NOT mean 'what a sin' in daily Colombia—it expresses warm sympathy or tenderness ('Aw, poor thing!').",example:"¡Ay, qué pecado, el perrito se quedó afuera bajo la lluvia!",tts:"¡Ay, qué pecado, el perrito se quedó afuera bajo la lluvia!"},
  {word:"¡No me digas! / ¡No me diga!",en:"You don't say! / No way!",region:"all",register:"Colombian · storytelling",registerGroup:"everyday",usage:"Used constantly while listening to someone's story to show active interest and surprise.",example:"¡No me digas! ¿Y qué hiciste cuando cerraron el aeropuerto?",tts:"¡No me digas! ¿Y qué hiciste cuando cerraron el aeropuerto?"},
  {word:"No dar papaya",en:"Don't make yourself an easy target",region:"all",register:"Colombian · #1 street rule",registerGroup:"everyday",usage:"The single most famous Colombian proverb: don't flash valuables or leave yourself vulnerable ('Papaya puesta, papaya partida').",example:"El barrio es chévere, pero no des papaya con el teléfono en la acera.",tts:"El barrio es chévere, pero no des papaya con el teléfono en la acera."},
  {word:"Calientico/a",en:"Nice and warm / fresh out of the oven",region:"all",register:"Colombian · panadería & food",registerGroup:"everyday",usage:"Colombians love using the diminutive '-ico' for warm bread, pandebonos, arepas, and coffee.",example:"Veci, ¿esos pandebonos acaban de salir calienticos?",tts:"Veci, ¿esos pandebonos acaban de salir calienticos?"},
  {word:"Perico / Pintado",en:"Small coffee with steamed milk",region:"bogota",register:"Bogotá & Eje · panadería",registerGroup:"everyday",usage:"In Bogotá and the Coffee Region, ordering 'un perico' at a bakery means a small coffee with milk (in Medellín/Cali they often say 'pintado' or 'café con leche').",example:"Buenos días, me regala un perico y dos almojábanas, por favor.",tts:"Buenos días, me regala un perico y dos almojábanas, por favor."},
  {word:"Puente festivo",en:"Three-day holiday weekend",region:"all",register:"Colombian · travel & social",registerGroup:"everyday",usage:"Colombia moves most public holidays to Monday ('Ley Emiliani'), creating 18+ holidays and frequent 'puentes festivos' for finca trips.",example:"¿Qué vas a hacer este puente festivo? Vamos para una finca.",tts:"¿Qué vas a hacer este puente festivo? Vamos para una finca."},
  {word:"¡Qué nota!",en:"How awesome! / How cool!",region:"all",register:"Colombian · positive reaction",registerGroup:"everyday",usage:"Friendly, upbeat expression heard across Colombia to celebrate good news or compliment a great plan.",example:"¡Qué nota que viniste a visitarnos a Colombia!",tts:"¡Qué nota que viniste a visitarnos a Colombia!"}
);

/* 3. 2 New 3-Column Slot-Swapper Matrices (9 total) */
SLOT_SWAP_MATRICES.push(
  {
    id:"panaderia-jugos-matrix",
    title:"🥐 Panadería, Café & Jugos",
    sub:"Order fresh Colombian bakery items, coffee, and fruit juices in water or milk",
    col1Title:"1. Bakery Opener",
    col2Title:"2. Bread, Coffee or Juice",
    col3Title:"3. Colombian Customization",
    col1:[
      {es:"Buenos días, veci, ¿me regala",en:"Good morning neighbor, can I have"},
      {es:"Qué pena, ¿me da por favor",en:"Excuse me, can you please give me"},
      {es:"Para desayunar quisiera pedir",en:"For breakfast I'd like to order"},
      {es:"¿Será que me empaca",en:"Could you possibly pack for me"}
    ],
    col2:[
      {es:"dos pandebonos calienticos y un perico",en:"two warm pandebonos and a small milk coffee"},
      {es:"un jugo natural de lulo y una almojábana",en:"a fresh lulo juice and an almojábana"},
      {es:"un jugo de guanábana y dos empanadas",en:"a soursop juice and two empanadas"},
      {es:"un tintico y un buñuelo recién salido",en:"a black coffee and a freshly made buñuelo"}
    ],
    col3:[
      {es:"en agua y bajito de azúcar, por favor.",en:"in water and low on sugar, please."},
      {es:"en leche, para tomar aquí en la mesa.",en:"in milk, to drink here at the table."},
      {es:"con el ají aparte para llevar.",en:"with the hot sauce on the side to go."},
      {es:"y me dice cuánto le debo por Nequi.",en:"and tell me how much I owe you on Nequi."}
    ]
  },
  {
    id:"empatia-reacciones-matrix",
    title:"💛 Empathy & Story Reactions",
    sub:"React warmly to good news or bad news and follow up like a true Colombian friend",
    col1Title:"1. Emotional Reaction",
    col2Title:"2. Empathy / Validation",
    col3Title:"3. Warm Follow-Up",
    col1:[
      {es:"¡No me digas! ¡Uy, qué embarrada",en:"You don't say! Oh, what a bummer"},
      {es:"¡Ay, qué pesar contigo, pero menos mal",en:"Oh, I feel so bad for you, but thankfully"},
      {es:"¡¿En serio?! ¡Qué nota",en:"Seriously?! How awesome"},
      {es:"¡Qué alegría escucharte! Me encanta",en:"So great to hear you! I love"}
    ],
    col2:[
      {es:"todo lo que te pasó ayer en el viaje,",en:"everything that happened to you yesterday on the trip,"},
      {es:"que ya lograste solucionar ese chicharrón,",en:"that you already managed to solve that hassle,"},
      {es:"que te haya salido tan bien el proyecto,",en:"that the project turned out so well for you,"},
      {es:"poder conversar un rato contigo,",en:"being able to chat for a bit with you,"}
    ],
    col3:[
      {es:"cuenta conmigo para lo que necesites.",en:"count on me for whatever you need."},
      {es:"así que esta semana nos tomamos un café.",en:"so this week we'll grab a coffee."},
      {es:"porque de verdad te lo mereces mucho.",en:"because you really deserve it so much."},
      {es:"y me avisas cómo sigues mañana.",en:"and let me know how you're doing tomorrow."}
    ]
  }
);

/* 4. Interactive Colombian Register Switcher (Tú vs Usted vs Vos vs Sumercé) */
const REGISTER_SWITCHER=[
  {
    id:"reg-wait",
    intent:"⏱️ Ask someone to wait a moment",
    when:"Use 'usted' at counters/banks or in Bogotá; 'tú' with peers/Coast; 'vos' in Medellín & Cali; 'sumercé' for warm Bogotá/Boyacá respect.",
    ust:{es:"¿Me espera un momentico, por favor?",note:"Bogotá formal, strangers & respectful daily use"},
    tu:{es:"¿Me esperas un momentico, porfa?",note:"Bogotá friends/peers & Caribbean Coast"},
    vos:{es:"¿Me esperás un momentico, parce?",note:"Medellín (Paisa) & Cali (Valluno) informal"},
    sumerce:{es:"¿Sumercé me espera un momentico?",note:"Bogotá & Boyacá affectionate/warm polite"}
  },
  {
    id:"reg-coffee",
    intent:"☕ Invite someone for a coffee (un tintico)",
    when:"Notice how reflexive 'tomarse' shifts: se toma (usted/sumercé) → te tomas (tú) → te tomás (vos).",
    ust:{es:"¿Le gustaría tomarse un tintico conmigo?",note:"Polite invite / Bogotá traditional"},
    tu:{es:"¿Te tomas un tintico conmigo ahorita?",note:"Casual invite with friends or date"},
    vos:{es:"¿Te tomás un tintico conmigo pues?",note:"Medellín & Cali natural invite"},
    sumerce:{es:"¿Sumercé se toma un tintico conmigo?",note:"Warm, endearing Bogotá/Boyacá invite"}
  },
  {
    id:"reg-repeat",
    intent:"🔁 Ask someone to repeat what they said",
    when:"Essential repair reflex when someone speaks fast.",
    ust:{es:"Qué pena con usted, ¿me repite por favor?",note:"Standard polite with drivers, clerks & elders"},
    tu:{es:"Perdona, ¿me repites eso otra vez?",note:"Casual with friends & peers"},
    vos:{es:"Parce, ¿me repetís eso porfa?",note:"Medellín & Cali everyday"},
    sumerce:{es:"¿Sumercé me repite un momentico?",note:"Warm & respectful Bogotá/Boyacá"}
  },
  {
    id:"reg-where",
    intent:"📍 Ask where someone is from or where they live",
    when:"Look at 'ser' and 'vivir': es/vive (usted) → eres/vives (tú) → sos/vivís (vos).",
    ust:{es:"¿Usted de dónde es y por dónde vive?",note:"Polite conversation starter"},
    tu:{es:"¿Tú de dónde eres y por dónde vives?",note:"Bogotá & Coast social/party"},
    vos:{es:"¿Vos de dónde sos y por dónde vivís?",note:"Medellín & Cali signature 'sos / vivís'"},
    sumerce:{es:"¿Sumercé de qué parte es?",note:"Warm Andean Colombian"}
  },
  {
    id:"reg-directions",
    intent:"🧭 Ask for directions on the street",
    when:"On the street with strangers, always lead with 'usted' or 'sumercé'.",
    ust:{es:"Disculpe, ¿me indica cómo llego al parque?",note:"Safe everywhere in Colombia"},
    tu:{es:"Oye, ¿me dices cómo llego al parque?",note:"Among young peers / classmates"},
    vos:{es:"Mirá ve, ¿me decís cómo llego al parque?",note:"Cali ('mirá ve') & Medellín ('mirá')"},
    sumerce:{es:"Veci, ¿sumercé me indica por dónde cojo?",note:"Bogotá neighborhood favorite"}
  },
  {
    id:"reg-food",
    intent:"🍽️ Ask if someone has already eaten",
    when:"In Colombia, offering food is how people show care.",
    ust:{es:"¿Usted ya almorzó? Si quiere, vamos.",note:"Respectful coworker, host, or family"},
    tu:{es:"¿Tú ya almorzaste? Si quieres, vamos.",note:"Friends & peers"},
    vos:{es:"¿Vos ya almorzaste? Si querés, vamos.",note:"Note: preterite is 'almorzaste' and present is 'querés'"},
    sumerce:{es:"¿Sumercé ya almorzó? Si gusta, le sirvo.",note:"Classic warm family/host hospitality"}
  },
  {
    id:"reg-ready",
    intent:"🚪 Check if someone is ready to head out",
    when:"Great for coordinating departures with friends or family.",
    ust:{es:"¿Ya está listo? Cuando quiera nos vamos.",note:"Polite / Bogotá family"},
    tu:{es:"¿Ya estás listo? ¡Vamos saliendo!",note:"Bogotá & Coast friends"},
    vos:{es:"¿Ya estás listo? ¡Hágale pues, vámonos!",note:"Medellín & Eje Cafetero"},
    sumerce:{es:"¿Sumercé ya está listo para salir?",note:"Warm Bogotá/Boyacá"}
  },
  {
    id:"reg-late",
    intent:"🚕 Apologize for running a little late",
    when:"Imperative shift: disculpe (usted/sumercé) → disculpa/perdona (tú) → perdoná (vos).",
    ust:{es:"Discúlpeme la demora, había mucho trancón.",note:"Formal / work / service"},
    tu:{es:"Perdona la demora, había mucho trancón.",note:"Friends & casual dates"},
    vos:{es:"Perdoná la demora, había un taco tenaz.",note:"Medellín ('taco' = traffic jam)"},
    sumerce:{es:"Sumercé disculpe la demora, ya estoy llegando.",note:"Warm polite"}
  }
];

/* 5. Interactive Colombian Street Grid & Safety Decoder */
const STREET_GRID_DECODER=[
  {
    part:"Carrera 7",
    label:"1. La Carrera (Norte ↔ Sur)",
    title:"Carreras run parallel to the mountains",
    explain:"In Bogotá, Carreras run South–North (parallel to the eastern hills, Los Cerros). Lower numbers (Carrera 1–7) are closer to the mountains; higher numbers go west.",
    exampleEs:"Estoy en la carrera séptima y voy subiendo hacia la quinta.",
    exampleEn:"I am on Carrera 7 and I'm heading up toward Carrera 5."
  },
  {
    part:"con Calle 72",
    label:"2. La Calle (Oriente ↔ Occidente)",
    title:"Calles cross the Carreras perpendicular to the hills",
    explain:"Calles run East–West. In Bogotá, numbers increase as you go North (Calle 10 is downtown; Calle 72 is Chapinero/financial district; Calle 100+ is el Norte).",
    exampleEs:"El restaurante queda en la calle setenta y dos con carrera diez.",
    exampleEn:"The restaurant is at Calle 72 and Carrera 10."
  },
  {
    part:"# 11 - 24",
    label:"3. El Número (# 11-24)",
    title:"Exact meter distance from the corner!",
    explain:"Colombian addresses are mathematical: in 'Calle 72 # 11-24', 11 is the cross-Carrera (Carrera 11), and 24 means the door is 24 meters past Carrera 11!",
    exampleEs:"Busco la calle setenta y dos, número once veinticuatro.",
    exampleEn:"I'm looking for Calle 72, number 11-24 (24 meters past Carrera 11)."
  },
  {
    part:"Suba 2 cuadras",
    label:"4. Cuadras, Arriba y Abajo",
    title:"'Subir' means toward the mountains; 'Bajar' means away",
    explain:"One 'cuadra' is one city block. In Bogotá, 'subir' means walking East toward the mountains (even on flat ground!), and 'bajar' means walking West.",
    exampleEs:"Suba dos cuadras hacia los cerros y gire a la izquierda.",
    exampleEn:"Go up two blocks toward the hills and turn left."
  },
  {
    part:"No dar papaya",
    label:"5. Regla de Oro (Street Safety)",
    title:"Ask locals & keep your phone put away on sidewalks",
    explain:"Colombians are super helpful if you ask '¿Este sector es tranquilo?'. Follow the golden rule: 'No dar papaya'—step inside a shop or portería before pulling out your phone.",
    exampleEs:"¿Este sector es tranquilo de noche, o mejor pido Uber en la puerta?",
    exampleEn:"Is this area calm at night, or should I better order an Uber at the door?"
  }
];

/* 6. Conversation Curveballs & Repair Drills (⚡ Imprevistos) */
const CONVERSATION_CURVEBALLS=[
  {
    id:"cb-uber-gate",
    cat:"travel",
    title:"🚕 El Uber no puede entrar a la portería",
    curveballEs:"No me dejan entrar al conjunto; lo espero afuera sobre la avenida principal.",
    curveballEn:"They won't let me into the complex; I'll wait for you outside on the main avenue.",
    repairEs:"Listo, maestro, ya salgo caminando a la portería. ¿Me confirma el color del carro?",
    repairEn:"Got it, boss, I'm walking out to the front gate now. Can you confirm the car color?",
    backupEs:"Espéreme ahí al frente de la tienda de la esquina, ya voy saliendo.",
    backupEn:"Wait for me right across from the corner shop, I'm heading out now.",
    tip:"In Colombia, residential complexes ('conjuntos') usually require you to walk out to the 'portería' (guard gate)."
  },
  {
    id:"cb-uber-cancel",
    cat:"travel",
    title:"📱 El conductor pide cancelar o cambiar ruta",
    curveballEs:"Parce, hay un trancón horrible por la séptima. ¿Nos metemos por abajo o qué hacemos?",
    curveballEn:"Buddy, there's a terrible traffic jam on 7th. Shall we cut through down below or what do we do?",
    repairEs:"Sí, hágale, váyase por donde le marque mejor el Waze para no quedarnos en el trancón.",
    repairEn:"Yes, go for it, go whichever way Waze shows best so we don't get stuck in traffic.",
    backupEs:"No conozco bien esa vía, pero si es más rápido por ahí, dele tranquilo.",
    backupEn:"I don't know that road well, but if it's faster that way, go right ahead.",
    tip:"Drivers in Colombia use Waze constantly and will ask '¿Nos vamos por lo que diga Waze?'."
  },
  {
    id:"cb-bus-gate",
    cat:"travel",
    title:"🚌 Cambio de plataforma en la terminal",
    curveballEs:"Señor, el bus de las diez se retrasó por el trancón en el peaje; sale por la plataforma cuatro.",
    curveballEn:"Sir, the 10 o'clock bus was delayed by traffic at the toll; it's leaving from platform 4.",
    repairEs:"Gracias por avisarme. ¿Por dónde bajo a la plataforma cuatro y a qué hora abordamos?",
    repairEn:"Thanks for letting me know. Which way do I go down to platform 4 and what time do we board?",
    backupEs:"¿Con este mismo tiquete puedo subir o tengo que cambiarlo en la taquilla?",
    backupEn:"Can I board with this same ticket or do I have to exchange it at the ticket booth?",
    tip:"At Colombian bus terminals, 'taquilla' is the ticket counter and 'plataforma / módulo' is the departure gate."
  },
  {
    id:"cb-panaderia-out",
    cat:"food",
    title:"🥐 Se acabó el pandebono o la fruta del jugo",
    curveballEs:"Qué pena, veci, ya se me acabó el pandebono y tampoco queda jugo de lulo hoy.",
    curveballEn:"So sorry, neighbor, I just ran out of pandebono and there's no lulo juice left today either.",
    repairEs:"Tranquilo, no pasa nada. Entonces deme una almojábana calientica y un jugo de maracuyá en agua.",
    repairEn:"No worries at all. Then give me a warm almojábana and a passionfruit juice in water.",
    backupEs:"Bueno, ¿y qué pan acabó de salir calientico del horno?",
    backupEn:"Okay, and what bread just came out warm from the oven?",
    tip:"Pivoting with 'Tranquilo, entonces deme…' keeps the interaction warm and effortless."
  },
  {
    id:"cb-datafono-down",
    cat:"food",
    title:"💳 No hay sistema en el datáfono",
    curveballEs:"Qué pena con usted, se cayó la señal del datáfono y no están pasando las tarjetas.",
    curveballEn:"So sorry to bother you, the card terminal lost signal and cards aren't going through.",
    repairEs:"¿Tiene código QR de Nequi para hacerle la transferencia, o le pago en efectivo?",
    repairEn:"Do you have a Nequi QR code so I can transfer to you, or shall I pay you in cash?",
    backupEs:"Espéreme un momentico, voy al cajero de la esquina a sacar efectivo y ya vuelvo.",
    backupEn:"Wait for me a moment, I'll go to the ATM on the corner to take out cash and be right back.",
    tip:"'No hay sistema' or 'se cayó el datáfono' happens often—always have Nequi or a 50-mil bill as backup!"
  },
  {
    id:"cb-porteria-guest",
    cat:"daily",
    title:"🏢 La portería pide autorización del anfitrión",
    curveballEs:"Buenas, vecino. No me aparece autorizado en la minuta; necesito que el propietario llame a portería.",
    curveballEn:"Hi, neighbor. You don't appear authorized in the logbook; I need the owner to call the front desk.",
    repairEs:"Claro, don Carlos. Ya mismo le escribo por WhatsApp al dueño para que baje o llame al citófono.",
    repairEn:"Of course, Don Carlos. I'll message the owner on WhatsApp right now so they come down or call the intercom.",
    backupEs:"Aquí tengo el número del apartamento y mi documento de identidad mientras nos confirman.",
    backupEn:"Here is the apartment number and my ID while they confirm for us.",
    tip:"Colombian building security is strict—the logbook at the desk is called 'la minuta' or 'la bitácora'."
  },
  {
    id:"cb-landmark-cai",
    cat:"daily",
    title:"🧭 Dirección con punto de referencia local (el CAI)",
    curveballEs:"Siga derecho hasta el CAI de la policía, suba media cuadra y es el portón gris.",
    curveballEn:"Go straight to the police post (CAI), go up half a block, and it's the gray gate.",
    repairEs:"Para confirmar: ¿el CAI queda pasando el semáforo hacia los cerros?",
    repairEn:"Just to confirm: is the police post past the traffic light toward the hills?",
    backupEs:"Qué pena, ¿me señala con la mano hacia qué lado queda el CAI?",
    backupEn:"Excuse me, can you point with your hand which way the police post is?",
    tip:"A 'CAI' (Comando de Atención Inmediata) is a small neighborhood police station used constantly as a landmark."
  },
  {
    id:"cb-social-rain",
    cat:"social",
    title:"🌧️ Aguacero repentino antes de salir con amigos",
    curveballEs:"¡Parce, se largó un aguacero tenaz y no consigo Uber por ningún lado!",
    curveballEn:"Buddy, a massive downpour just started and I can't get an Uber anywhere!",
    repairEs:"¡Uy, qué embarrada! Tranquilo, escampa un ratico y nos vemos media hora más tarde.",
    repairEn:"Oh, what a bummer! No worries, wait for the rain to let up a bit and we'll meet half an hour later.",
    backupEs:"Si quieres, paso por ti en taxi que yo ya voy en camino por tu barrio.",
    backupEn:"If you want, I'll swing by for you in a taxi since I'm already on my way through your neighborhood.",
    tip:"'Escampar' is the essential Colombian verb meaning 'to wait under shelter until the rain stops'!"
  }
];

/* 7. New Quiz Questions for v93 Scenarios (Direcciones/Cuadras, Panadería/Jugos, Finca/Buses, Empatía) */
V60_CONVERSATION_QUIZ.push(
  {kind:"reply",focus:"present",cat:"direcciones",es:"Disculpe, ¿este sector es tranquilo para caminar de noche?",en:"Sí, por la avenida es tranquilo, pero es mejor no dar papaya con el celular.",tts:"Disculpe, ¿este sector es tranquilo para caminar de noche?",choices:["Sí, por la avenida es tranquilo, pero es mejor no dar papaya con el celular.","En leche y bajito de azúcar, por favor.","A una sola cuota sin factura electrónica.","Bajito a los lados con la máquina dos."]},
  {kind:"meaning",focus:"present",cat:"direcciones",es:"Suba dos cuadras hacia los cerros y voltee a la derecha.",en:"Go up two blocks toward the hills and turn right.",tts:"Suba dos cuadras hacia los cerros y voltee a la derecha.",choices:["Go up two blocks toward the hills and turn right.","Give me two warm pandebonos and a black coffee.","Include the tip on the card terminal, please.","Take one pill every eight hours after eating."]},
  {kind:"reply",focus:"present",cat:"panaderia",es:"Buenos días, veci. ¿El jugo de guanábana lo quiere en agua o en leche?",en:"En leche y bajito de azúcar, por favor.",tts:"Buenos días, veci. ¿El jugo de guanábana lo quiere en agua o en leche?",choices:["En leche y bajito de azúcar, por favor.","Vengo por turismo durante dos semanas.","Suba dos cuadras hacia los cerros.","Por la plataforma número cuatro."]},
  {kind:"meaning",focus:"present",cat:"panaderia",es:"¿Los pandebonos y las almojábanas salieron calienticos?",en:"Did the pandebonos and almojábanas come out warm/fresh?",tts:"¿Los pandebonos y las almojábanas salieron calienticos?",choices:["Did the pandebonos and almojábanas come out warm/fresh?","Where is the baggage claim belt?","Can you authorize the delivery driver to come up?","How long does the bus take to get to the town?"]},
  {kind:"reply",focus:"future",cat:"viajes-finca",es:"Buenas tardes, ¿a qué hora sale el próximo bus y por cuál plataforma abordamos?",en:"Sale en veinte minutos por la plataforma cuatro.",tts:"Buenas tardes, ¿a qué hora sale el próximo bus y por cuál plataforma abordamos?",choices:["Sale en veinte minutos por la plataforma cuatro.","En agua sin azúcar, por favor.","No soy alérgico a ningún medicamento.","Quiero un desvanecido con tijera arriba."]},
  {kind:"meaning",focus:"present",cat:"viajes-finca",es:"Maestro, ¿me puede dejar en la entrada de la vereda después del peaje?",en:"Driver, can you drop me off at the entrance to the rural district (vereda) after the toll booth?",tts:"Maestro, ¿me puede dejar en la entrada de la vereda después del peaje?",choices:["Driver, can you drop me off at the entrance to the rural district (vereda) after the toll booth?","Neighbor, can I have a small coffee with milk and a buñuelo?","Doorman, did a Rappi delivery arrive for apartment 502?","Doctor, I have had a fever and stomachache since last night."]},
  {kind:"reply",focus:"past",cat:"empatia",es:"Se me quedó el celular en el taxi bajo el aguacero.",en:"¡Uy, qué embarrada! ¿Y ya intentaste llamar al número?",tts:"Se me quedó el celular en el taxi bajo el aguacero.",choices:["¡Uy, qué embarrada! ¿Y ya intentaste llamar al número?","Cuenta de ahorros a una sola cuota.","Con el ají aparte para llevar, por favor.","Siga derecho hasta el reclamo de equipaje."]},
  {kind:"meaning",focus:"present",cat:"empatia",es:"¡Qué nota! Me alegra muchísimo por ti, te lo mereces.",en:"How awesome! I'm so happy for you, you deserve it.",tts:"¡Qué nota! Me alegra muchísimo por ti, te lo mereces.",choices:["How awesome! I'm so happy for you, you deserve it.","It's better not to flash your phone on the street.","Sell me two bus tickets for the holiday weekend.","The internet went down in the building this morning."]}
);

V60_FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"present",cat:"direcciones",es:"El barrio es tranquilo, pero es mejor no dar ___ con el celular.",en:"papaya",tts:"El barrio es tranquilo, pero es mejor no dar papaya con el celular.",trans:"The neighborhood is calm, but it's better not to make yourself an easy target with your phone.",choices:["papaya","cuota","maleta","tijera"]},
  {kind:"blank",focus:"present",cat:"panaderia",es:"Me da un jugo de lulo en ___ y bajito de azúcar, por favor.",en:"agua",tts:"Me da un jugo de lulo en agua y bajito de azúcar, por favor.",trans:"Give me a lulo juice in water and low on sugar, please.",choices:["agua","cuadra","peaje","portería"]},
  {kind:"blank",focus:"present",cat:"panaderia",es:"Veci, ¿los pandebonos acabaron de salir ___ del horno?",en:"calienticos",tts:"Veci, ¿los pandebonos acabaron de salir calienticos del horno?",trans:"Neighbor, did the pandebonos just come out warm from the oven?",choices:["calienticos","alérgicos","atrasados","cerrados"]},
  {kind:"blank",focus:"future",cat:"viajes-finca",es:"Este ___ festivo vamos de paseo a una finca.",en:"puente",tts:"Este puente festivo vamos de paseo a una finca.",trans:"This long holiday weekend we are going on a trip to a finca.",choices:["puente","datáfono","semáforo","citófono"]},
  {kind:"blank",focus:"present",cat:"viajes-finca",es:"Maestro, ¿nos deja en la entrada de la vereda después del ___?",en:"peaje",tts:"Maestro, ¿nos deja en la entrada de la vereda después del peaje?",trans:"Driver, can you drop us at the entrance to the rural district (vereda) after the toll booth?",choices:["peaje","equipaje","almuerzo","desvanecido"]},
  {kind:"blank",focus:"past",cat:"empatia",es:"¡Uy, qué ___ que se fue la luz justo en tu reunión!",en:"embarrada",tts:"¡Uy, qué embarrada que se fue la luz justo en tu reunión!",trans:"Oh, what a bummer that the power went out right during your meeting!",choices:["embarrada","almojábana","plataforma","cuadra"]}
);
// ── V94.0 COLOMBIAN SPEAKING MASTERY & PRO COACHING EXPANSION ───────────────
/* 1. 4 New Real-World Colombian Scenarios (Lessons 57–60, Dialogues 47–50):
      - Verbos comodín en acción (dar, hacer, poner, echar, tocar, quedar, coger)
      - WhatsApp, notas de voz y citas ("Te mando un audio", "¿Me colaboras?", "Quedo atento")
      - Arriendo, Airbnb, aseo y lavadora (administración, calentador, hacer aseo, servicios)
      - Gimnasio, ciclovía, senderos y soroche (turnarse en la máquina, ciclovía, altura) */

const VERBOS_COMODIN = [
  {
    "verb": "Dar",
    "tag": "Feelings, trouble & walks",
    "chunks": [
      {
        "chunk": "dar papaya",
        "en": "to make oneself an easy target",
        "es": "No deje el celular sobre la mesa porque da papaya.",
        "esEn": "Don't leave your cellphone on the table because you're making yourself an easy target."
      },
      {
        "chunk": "dar una mano",
        "en": "to lend a hand",
        "es": "¿Me da una mano con estas cajas, por favor?",
        "esEn": "Could you give me a hand with these boxes, please?"
      },
      {
        "chunk": "dar lidia",
        "en": "to be a hassle or cause trouble",
        "es": "Ese trámite me ha dado mucha lidia toda la semana.",
        "esEn": "That process has been a real hassle all week."
      },
      {
        "chunk": "dar hambre",
        "en": "to make someone hungry",
        "es": "Ver esas empanadas me dio hambre.",
        "esEn": "Seeing those empanadas made me hungry."
      }
    ]
  },
  {
    "verb": "Hacer",
    "tag": "Plans, favors & routines",
    "chunks": [
      {
        "chunk": "hacer una vuelta",
        "en": "to run an errand",
        "es": "Voy a hacer una vuelta al banco y regreso.",
        "esEn": "I'm going to run an errand at the bank and come back."
      },
      {
        "chunk": "hacer caso",
        "en": "to pay attention or heed advice",
        "es": "Hágale caso a su mamá y lleve una chaqueta.",
        "esEn": "Listen to your mom and take a jacket."
      },
      {
        "chunk": "hacer cola",
        "en": "to stand in line",
        "es": "Nos tocó hacer cola casi una hora para entrar.",
        "esEn": "We had to stand in line for almost an hour to get in."
      },
      {
        "chunk": "hacerle el quite a algo",
        "en": "to avoid something",
        "es": "Yo siempre le hago el quite a las reuniones muy temprano.",
        "esEn": "I always avoid meetings that are very early."
      }
    ]
  },
  {
    "verb": "Poner",
    "tag": "Attention, effort & problems",
    "chunks": [
      {
        "chunk": "poner cuidado",
        "en": "to pay attention",
        "es": "Ponga cuidado al cruzar esa avenida.",
        "esEn": "Pay attention when crossing that avenue."
      },
      {
        "chunk": "ponerse las pilas",
        "en": "to get moving or shape up",
        "es": "Tenemos que ponernos las pilas si queremos terminar hoy.",
        "esEn": "We have to get moving if we want to finish today."
      },
      {
        "chunk": "poner problema",
        "en": "to object or make an issue of something",
        "es": "No me ponga problema por llegar cinco minutos tarde.",
        "esEn": "Don't make an issue of me being five minutes late."
      },
      {
        "chunk": "ponerle ganas",
        "en": "to put effort into something",
        "es": "Si le pone ganas, aprende a manejar rapidísimo.",
        "esEn": "If you put in the effort, you'll learn to drive really quickly."
      }
    ]
  },
  {
    "verb": "Echar",
    "tag": "Stories, looks & breaks",
    "chunks": [
      {
        "chunk": "echar cuento",
        "en": "to chat or tell stories",
        "es": "Nos quedamos echando cuento después de la cena.",
        "esEn": "We stayed chatting after dinner."
      },
      {
        "chunk": "echarle un ojo",
        "en": "to take a look or keep an eye on something",
        "es": "¿Me echa un ojo a la olla mientras contesto esta llamada?",
        "esEn": "Could you keep an eye on the pot while I answer this call?"
      },
      {
        "chunk": "echarse una siesta",
        "en": "to take a nap",
        "es": "Después del almuerzo me voy a echar una siestica.",
        "esEn": "After lunch I'm going to take a little nap."
      },
      {
        "chunk": "echar raíces",
        "en": "to put down roots",
        "es": "Después de tantos años aquí, por fin echó raíces en Medellín.",
        "esEn": "After so many years here, he finally put down roots in Medellín."
      }
    ]
  },
  {
    "verb": "Tocar",
    "tag": "Turns, duties & luck",
    "chunks": [
      {
        "chunk": "tocarle a alguien",
        "en": "to be someone's turn or responsibility",
        "es": "Hoy me toca cocinar porque usted lavó los platos ayer.",
        "esEn": "It's my turn to cook today because you washed the dishes yesterday."
      },
      {
        "chunk": "tocar fondo",
        "en": "to hit rock bottom",
        "es": "Después de tocar fondo, buscó ayuda y empezó de nuevo.",
        "esEn": "After hitting rock bottom, he sought help and started over."
      },
      {
        "chunk": "tocar la puerta",
        "en": "to knock on the door",
        "es": "Si llega temprano, tóqueme la puerta y le abro.",
        "esEn": "If you arrive early, knock on my door and I'll let you in."
      },
      {
        "chunk": "tocar madera",
        "en": "to knock on wood",
        "es": "Todo ha salido bien hasta ahora, toco madera.",
        "esEn": "Everything has gone well so far, knock on wood."
      }
    ]
  },
  {
    "verb": "Quedar",
    "tag": "Plans, places & impressions",
    "chunks": [
      {
        "chunk": "quedar de verse",
        "en": "to arrange to meet",
        "es": "Quedamos de vernos el sábado en el parque.",
        "esEn": "We arranged to meet on Saturday at the park."
      },
      {
        "chunk": "quedar debiendo",
        "en": "to still owe someone",
        "es": "Con lo que pagué hoy todavía quedo debiéndole diez mil pesos.",
        "esEn": "Even after what I paid today, I still owe you ten thousand pesos."
      },
      {
        "chunk": "quedar mal",
        "en": "to let someone down or look bad",
        "es": "No quiero quedar mal, así que voy a cumplir lo que prometí.",
        "esEn": "I don't want to let anyone down, so I'm going to do what I promised."
      },
      {
        "chunk": "quedar en algo",
        "en": "to agree on something",
        "es": "Quedamos en que usted reserva la mesa y yo llevo el postre.",
        "esEn": "We agreed that you would reserve the table and I would bring dessert."
      }
    ]
  },
  {
    "verb": "Coger",
    "tag": "Transport, habits & connection",
    "chunks": [
      {
        "chunk": "coger el bus",
        "en": "to take the bus",
        "es": "Para llegar al centro, coja el bus que pasa por la Séptima.",
        "esEn": "To get downtown, take the bus that goes along Seventh Avenue."
      },
      {
        "chunk": "cogerle el tiro a algo",
        "en": "to get the hang of something",
        "es": "Al principio fue difícil, pero ya le cogí el tiro al programa.",
        "esEn": "It was difficult at first, but I've got the hang of the program now."
      },
      {
        "chunk": "cogerle cariño a alguien",
        "en": "to grow fond of someone",
        "es": "Uno les coge cariño a los vecinos después de vivir tantos años ahí.",
        "esEn": "You grow fond of your neighbors after living there for so many years."
      },
      {
        "chunk": "coger oficio",
        "en": "to learn a trade or become responsible",
        "es": "Desde que consiguió trabajo, el muchacho cogió oficio.",
        "esEn": "Since he got a job, the young man has become more responsible."
      }
    ]
  }
];

const TEXTBOOK_VS_COLOMBIAN = [
  {
    "id": "tvc1",
    "context": "☕ Ordering coffee at a bakery",
    "textbook": "Quiero un café negro, por favor.",
    "colombian": "Veci, ¿me regala un tintico, por favor?",
    "en": "Can I have a black coffee, please?",
    "why": "Colombians often avoid a blunt 'yo quiero' at counters; '¿me regala...?' is a warm request, and 'tintico' is a familiar diminutive for black coffee."
  },
  {
    "id": "tvc2",
    "context": "🚌 Asking where to catch public transportation",
    "textbook": "¿Dónde puedo tomar el autobús?",
    "colombian": "¿Por dónde pasa el bus para el centro?",
    "en": "Where can I catch the bus downtown?",
    "why": "In Colombia, 'bus' is more common than 'autobús', and asking '¿por dónde pasa?' sounds more natural when looking for a route."
  },
  {
    "id": "tvc3",
    "context": "🛒 Asking a shopkeeper for help",
    "textbook": "¿Puede ayudarme a encontrar este producto?",
    "colombian": "¿Me hace el favor y me ayuda a buscar esto?",
    "en": "Could you help me find this item?",
    "why": "'Hacer el favor' is a very common Colombian politeness formula, often followed by 'y' plus the requested action."
  },
  {
    "id": "tvc4",
    "context": "🏠 Inviting a friend inside",
    "textbook": "Por favor, entra.",
    "colombian": "Siga, siga; ¿quiere un cafecito?",
    "en": "Come on in; would you like a little coffee?",
    "why": "'Siga' is a friendly Colombian way to invite someone in, and offering a 'cafecito' adds warmth and hospitality."
  },
  {
    "id": "tvc5",
    "context": "📅 Making plans with a friend",
    "textbook": "Nos vemos el sábado a las tres.",
    "colombian": "¿Nos vemos el sábado a las tres o qué?",
    "en": "Shall we meet on Saturday at three, or what?",
    "why": "The tag '¿o qué?' is a casual Colombian way to confirm plans and make the invitation sound relaxed."
  },
  {
    "id": "tvc6",
    "context": "💸 Saying that something is expensive",
    "textbook": "Este restaurante es muy caro.",
    "colombian": "Está carísimo este restaurante, ¿no?",
    "en": "This restaurant is really expensive, isn't it?",
    "why": "Colombians commonly use 'estar' for a current price or situation, and 'carísimo' plus '¿no?' makes the comment conversational."
  },
  {
    "id": "tvc7",
    "context": "🚕 Asking a taxi driver to stop",
    "textbook": "Pare aquí, por favor.",
    "colombian": "Por aquí está bien, jefe.",
    "en": "Here is fine, thanks.",
    "why": "'Por aquí está bien' is a natural, less abrupt way to tell a taxi driver where to stop; 'jefe' is a common friendly form of address."
  },
  {
    "id": "tvc8",
    "context": "🍲 Saying you are full after lunch",
    "textbook": "Estoy lleno porque almorcé mucho.",
    "colombian": "Quedé llenísimo con ese almuerzo.",
    "en": "I'm absolutely stuffed after that lunch.",
    "why": "'Quedar' describes the resulting state after eating, and 'llenísimo' is more idiomatic and expressive in casual Colombian speech."
  },
  {
    "id": "tvc9",
    "context": "📱 Asking someone to wait briefly",
    "textbook": "Espera un momento, por favor.",
    "colombian": "Regáleme un segundito, ya voy.",
    "en": "Give me just a second; I'll be right there.",
    "why": "'Regáleme un segundito' is a common polite Colombian request, with a diminutive that softens the interruption."
  },
  {
    "id": "tvc10",
    "context": "🌧️ Commenting on sudden rain",
    "textbook": "Está lloviendo mucho.",
    "colombian": "Se soltó el aguacero, ¡qué berraco!",
    "en": "The downpour started all of a sudden; what a crazy one!",
    "why": "'Se soltó el aguacero' vividly describes heavy rain beginning, while 'berraco' can express surprise or intensity depending on context."
  }
];

FRASES.push(
  {section:"🔑 Verbos comodín (dar, hacer, poner, echar, quedar)",quizCat:"comodin",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[
    {es:"Ese trámite en el banco me ha dado mucha lidia esta semana.",en:"That bank errand has given me a lot of trouble/hassle this week.",register:"Colombian · dar lidia"},
    {es:"Voy a hacer una vuelta rápida en el centro y ya regreso.",en:"I'm going to run a quick errand downtown and be right back.",register:"Colombian · hacer una vuelta"},
    {es:"Póngale cuidado a lo que le voy a explicar para que no se pierda.",en:"Pay close attention to what I'm going to explain so you don't get lost.",register:"Colombian · poner cuidado"},
    {es:"Nos quedamos echando cuento toda la tarde con un tintico.",en:"We stayed chatting/telling stories all afternoon over a black coffee.",register:"Colombian · echar cuento"},
    {es:"¿Me echa un ojo a la maleta mientras entro al baño?",en:"Can you keep an eye on my suitcase while I go to the bathroom?",register:"Colombian · echar un ojo"},
    {es:"Quedamos de vernos el sábado a las tres; no te vayas a quedar mal.",en:"We agreed to meet Saturday at three; don't flake/let me down.",register:"Colombian · quedar"}
  ]},
  {section:"📱 WhatsApp, audios y citas",quizCat:"whatsapp",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[
    {es:"Hola, ¿cómo vas? Te mando un audio rapidito porque voy caminando.",en:"Hi, how's it going? I'm sending you a quick voice note because I'm walking.",register:"Colombian · WhatsApp"},
    {es:"Qué pena responder apenas ahora, estaba en una reunión toda la mañana.",en:"Sorry for only replying just now, I was in a meeting all morning.",register:"Colombian · polite WhatsApp"},
    {es:"¿Será que me colaboras enviándome la ubicación exacta por acá?",en:"Could you help me out by sending me the exact location right here?",register:"Colombian · colaborarme"},
    {es:"¿Te queda bien si agendamos la cita para mañana a las diez?",en:"Does it work for you if we schedule the appointment for tomorrow at ten?",register:"Colombian · scheduling"},
    {es:"Listo, dale, así quedamos. Me confirmas cualquier cambio, porfa.",en:"Got it, sounds good, it's a plan. Let me know if anything changes, please.",register:"Colombian · WhatsApp"},
    {es:"Muchas gracias por la información; quedo muy atento a tu respuesta.",en:"Thank you very much for the information; I'll look forward to your reply.",register:"Colombian · polite/work"}
  ]},
  {section:"🔑 Arriendo, Airbnb y servicios del hogar",quizCat:"arriendo",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[
    {es:"¿En el precio del arriendo ya están incluidos la administración y los servicios?",en:"Are the building HOA fee and utilities already included in the rent price?",register:"Living in Colombia"},
    {es:"Disculpe, ¿cómo se prende el calentador de agua para la ducha?",en:"Excuse me, how do you turn on the water heater for the shower?",register:"Airbnb & apartment"},
    {es:"¿Me puede recomendar a alguien de confianza que venga a hacer aseo?",en:"Can you recommend someone trustworthy to come clean the apartment?",register:"Living in Colombia"},
    {es:"Se dañó la lavadora y está botando agua por debajo.",en:"The washing machine broke and is leaking water underneath.",register:"Home repair"},
    {es:"¿En qué días pasa el camión de la basura y cómo se separa el reciclaje?",en:"Which days does the garbage truck come by and how do you separate recycling?",register:"Apartment life"},
    {es:"¿Cuál es la clave del wifi? Es que no me conecta en el computador.",en:"What is the Wi-Fi password? It's not connecting on my computer.",register:"Everyday"}
  ]},
  {section:"🚴 Gimnasio, ciclovía y senderos",quizCat:"gym-ciclovia",cls:"color:var(--green);background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2)",items:[
    {es:"Hola, parce, ¿cuántas series te faltan? ¿Nos turnamos en la máquina?",en:"Hey buddy, how many sets do you have left? Shall we take turns on the machine?",register:"Gym · everyday"},
    {es:"El domingo por la mañana vamos a salir a montar en bici por la ciclovía.",en:"On Sunday morning we're going out to ride bikes on the Ciclovía.",register:"Bogotá & Medellín"},
    {es:"¿Qué tan pesada es la subida por ese sendero hasta la quebrada?",en:"How tough/steep is the climb up that trail to the mountain stream?",register:"Hiking · Colombia"},
    {es:"Vamos un poquito más despacio que me está faltando el aire por la altura.",en:"Let's go a little slower because I'm short of breath from the altitude.",register:"Bogotá & mountains"},
    {es:"Creo que me dio un poquito de soroche; descansemos cinco minuticos.",en:"I think I got a bit of altitude sickness; let's rest five minutes.",register:"Andean Colombia"},
    {es:"Después de entrenar vamos por un jugo natural o una ensalada de frutas.",en:"After working out let's go get a fresh juice or a fruit salad.",register:"Everyday"}
  ]}
);

CONVERSATIONS.push(
  v60Dialogue("Verbos comodín en acción","Using dar, hacer, poner, echar, tocar, and quedar like a native Colombian",[
    ["A","¡Hola! ¿Cómo vas? Te vi corriendo esta mañana por la Séptima.","Hi! How's it going? I saw you rushing down 7th Avenue this morning."],
    ["B","¡Uy, sí! Es que me tocó ir a hacer una vuelta en el banco y ese trámite me dio mucha lidia.","Oh, yes! I had to go run an errand at the bank and that paperwork gave me so much trouble."],
    ["A","¡No me digas! Esos trámites siempre ponen problema. ¿Pero ya lograste salir de eso?","You don't say! Those errands always cause a hassle. But did you manage to get it done?"],
    ["B","Sí, por suerte le puse ganas y ya quedó listo. Ahora solo quiero echarme un descansito.","Yes, luckily I put effort into it and now it's all set. Now I just want to take a little rest."],
    ["A","De una. Póngale cuidado: ¿nos vemos más tarde para echar cuento y tomarnos un café?","For sure. Listen: shall we meet up later to chat and grab a coffee?"],
    ["B","¡Claro! Quedamos de vernos a las cinco en la panadería; no me vayas a quedar mal.","Of course! Let's plan to meet at five at the bakery; don't flake on me."]
  ],[{es:"¿Me echa una mano con este paquete, por favor?",en:"Can you lend me a hand with this package, please?",tts:"¿Me echa una mano con este paquete, por favor?"},{es:"Ya le estoy cogiendo el tiro al español colombiano.",en:"I'm already getting the hang of Colombian Spanish.",tts:"Ya le estoy cogiendo el tiro al español colombiano."}]),
  v60Dialogue("WhatsApp, notas de voz y citas","Sending voice notes, asking for favors with 'colaborar', and confirming appointments",[
    ["A","Hola, Laura, ¿cómo vas? Qué pena responderte apenas ahora, te mando este audio rapidito porque iba manejando.","Hi Laura, how's it going? Sorry for only replying just now, I'm sending you this quick voice note because I was driving."],
    ["B","¡Hola! Tranquilo, no pasa nada. Te escribía para saber si te queda bien que revisemos el contrato mañana.","Hi! No worries at all. I was messaging you to see if tomorrow works for you to review the contract."],
    ["A","Sí, claro, mañana por la mañana me queda perfecto. ¿Será que me colaboras enviándome el documento por acá antes?", "Yes, of course, tomorrow morning works perfectly for me. Could you help me out by sending me the document here beforehand?"],
    ["B","¡De una! Ya mismo te lo mando en PDF por WhatsApp para que le eches un ojo.","Right away! I'll send it to you in PDF on WhatsApp right now so you can take a look at it."],
    ["A","Excelente, mil gracias. ¿Nos vemos entonces a las diez en el café de la esquina?","Excellent, thanks a million. Shall we meet at ten at the corner café then?"],
    ["B","Listo, así quedamos. Cualquier novedad me confirmas por un mensajito; quedo súper atenta.","All set, it's a plan. Let me know by text if anything comes up; I'll keep an eye out."]
  ],[{es:"Te mando un audio porque es más fácil explicarte todo el cuento.",en:"I'm sending you a voice note because it's easier to explain the whole story.",tts:"Te mando un audio porque es más fácil explicarte todo el cuento."},{es:"Quedo muy atento a tu confirmación, muchas gracias.",en:"I'll look forward to your confirmation, thank you very much.",tts:"Quedo muy atento a tu confirmación, muchas gracias."}]),
  v60Dialogue("Arriendo, Airbnb, aseo y lavadora","Checking into an apartment, learning how appliances work, and scheduling cleaning",[
    ["A","Bienvenido al apartamento. Aquí tiene las llaves de la entrada y el control del garaje.","Welcome to the apartment. Here are the front door keys and the garage remote."],
    ["B","Muchas gracias. Quería preguntarle: ¿en el valor del arriendo ya están incluidos la administración y el internet?","Thank you very much. I wanted to ask: are the HOA fee and internet already included in the rent?"],
    ["A","Sí, señor, todo está incluido. La clave del wifi está pegada detrás del módem en la sala.","Yes, sir, everything is included. The Wi-Fi password is stuck behind the router in the living room."],
    ["B","Perfecto. ¿Y cómo funciona el calentador de agua para la ducha y la lavadora?","Perfect. And how does the water heater for the shower and the washing machine work?"],
    ["A","El calentador es automático a gas; apenas abre la llave caliente se prende solo. Y la lavadora usa este botón.","The heater is automatic gas; as soon as you turn on the hot tap it lights by itself. And the washer uses this button."],
    ["B","Excelente. Por último, ¿me podría recomendar a una persona de confianza para hacer aseo una vez por semana?","Excellent. Finally, could you recommend someone trustworthy to clean once a week?"]
  ],[{es:"Se dañó la llave del lavamanos y está goteando.",en:"The bathroom sink faucet broke and is dripping.",tts:"Se dañó la llave del lavamanos y está goteando."},{es:"¿A qué hora pasa la señora del aseo mañana?",en:"What time does the cleaning lady come by tomorrow?",tts:"¿A qué hora pasa la señora del aseo mañana?"}]),
  v60Dialogue("Gimnasio, ciclovía, senderos y soroche","Sharing gym equipment, riding the Sunday Ciclovía, and pacing yourself at altitude",[
    ["A","Buenas, parce. Qué pena, ¿cuántas series te faltan en esta polea? ¿Nos podemos turnar?","Hey, buddy. Excuse me, how many sets do you have left on this cable machine? Can we take turns?"],
    ["B","¡Claro, de una! Solo me quedan dos series; dale tranquilo mientras yo descanso un minuto.","Of course, go for it! I only have two sets left; go ahead while I rest a minute."],
    ["A","¡Gracias! Oye, ¿vas a salir este domingo a montar en bici por la ciclovía o a caminar a los cerros?","Thanks! Hey, are you going out this Sunday to bike on the Ciclovía or hike in the hills?"],
    ["B","Vamos a subir temprano por el sendero de la quebrada, pero toca ir suave por la altura.","We're going up the mountain stream trail early, but we have to take it easy because of the altitude."],
    ["A","Totalmente. La semana pasada subí muy rápido y me dio un poquito de soroche; me faltaba el aire.","Totally. Last week I climbed too fast and got a bit of altitude sickness; I was short of breath."],
    ["B","Sí, allá arriba toca caminar despacio, tomar buena agua y parar a descansar en el mirador.","Yes, up there you have to walk slowly, drink plenty of water, and stop to rest at the lookout."]
  ],[{es:"¿Me cuida las pesas un segundito mientras lleno el termo de agua?",en:"Can you watch the weights for a second while I fill my water bottle?",tts:"¿Me cuida las pesas un segundito mientras lleno el termo de agua?"},{es:"El domingo cierran toda la avenida séptima para la ciclovía.",en:"On Sunday they close all of 7th Avenue for the Ciclovía.",tts:"El domingo cierran toda la avenida séptima para la ciclovía."}])
);

READINGS.push(
  {id:"lectura-comodin",level:"B1",title:"Los siete verbos comodín de Colombia",lesson:"verbos-comodin",intro:"Master how Colombians use dar, hacer, poner, echar, tocar, and quedar in everyday speech.",lines:[
    {es:"En Colombia, aprender vocabulario avanzado ayuda, pero la verdadera fluidez está en los verbos comodín.",en:"In Colombia, learning advanced vocabulary helps, but true fluency lies in the wildcard verbs.",tts:"En Colombia, aprender vocabulario avanzado ayuda, pero la verdadera fluidez está en los verbos comodín."},
    {es:"En vez de decir realizar una diligencia, todo el mundo dice hacer una vuelta.",en:"Instead of saying 'carry out an errand', everyone says 'hacer una vuelta'.",tts:"En vez de decir realizar una diligencia, todo el mundo dice hacer una vuelta."},
    {es:"Cuando algo es difícil decimos que da mucha lidia, y para conversar con amigos decimos echar cuento.",en:"When something is difficult we say it 'da mucha lidia', and to chat with friends we say 'echar cuento'.",tts:"Cuando algo es difícil decimos que da mucha lidia, y para conversar con amigos decimos echar cuento."},
    {es:"Si le pones cuidado a estos verbos cortos, ya le vas a coger el tiro al español colombiano muy rápido.",en:"If you pay attention to these short verbs, you'll get the hang of Colombian Spanish very quickly.",tts:"Si le pones cuidado a estos verbos cortos, ya le vas a coger el tiro al español colombiano muy rápido."}
  ],questions:[{q:"¿Qué significa 'echar cuento' en Colombia?",choices:["Conversar o charlar con amigos","Pagar la cuenta en efectivo","Subir por una montaña"],answer:"Conversar o charlar con amigos"}]},
  {id:"lectura-whatsapp",level:"A2",title:"Todo se cuadra por WhatsApp",lesson:"whatsapp-audios",intro:"In Colombia, WhatsApp voice notes and polite phrases run both social life and business.",lines:[
    {es:"En Colombia casi nadie deja mensajes en el buzón de voz; todo se coordina por WhatsApp.",en:"In Colombia almost nobody leaves voicemail messages; everything is coordinated on WhatsApp.",tts:"En Colombia casi nadie deja mensajes en el buzón de voz; todo se coordina por WhatsApp."},
    {es:"Es muy común empezar diciendo: Hola, ¿cómo vas? Te mando un audio rapidito para explicarte mejor.",en:"It is very common to start by saying: 'Hi, how's it going? I'm sending you a quick voice note to explain better.'",tts:"Es muy común empezar diciendo: Hola, ¿cómo vas? Te mando un audio rapidito para explicarte mejor."},
    {es:"Para pedir ayuda en el trabajo o en un servicio, la palabra mágica es colaborar: ¿Me colaboras con este dato?",en:"To ask for help at work or a service, the magic word is 'colaborar': 'Can you help me out with this info?'",tts:"Para pedir ayuda en el trabajo o en un servicio, la palabra mágica es colaborar: ¿Me colaboras con este dato?"},
    {es:"Y al cerrar una cita siempre decimos: Listo, así quedamos, quedo muy atento a tu confirmación.",en:"And when closing an appointment we always say: 'Got it, it's a plan, I'll look forward to your confirmation.'",tts:"Y al cerrar una cita siempre decimos: Listo, así quedamos, quedo muy atento a tu confirmación."}
  ],questions:[{q:"¿Cuál es el verbo favorito en Colombia para pedir ayuda amablemente por WhatsApp o en oficinas?",choices:["Colaborar (¿Me colaboras con…?)","Gritar","Olvidar"],answer:"Colaborar (¿Me colaboras con…?)"}]},
  {id:"lectura-arriendo",level:"B1",title:"Vivir en un apartamento en Colombia",lesson:"arriendo-airbnb",intro:"Learn how apartment administration fees, gas heaters, and home cleaning work in Colombia.",lines:[
    {es:"Al tomar un apartamento o un Airbnb en Colombia, es importante preguntar si el precio incluye la administración y los servicios.",en:"When renting an apartment or Airbnb in Colombia, it's important to ask if the price includes the HOA fee and utilities.",tts:"Al tomar un apartamento o un Airbnb en Colombia, es importante preguntar si el precio incluye la administración y los servicios."},
    {es:"Muchos apartamentos tienen calentador de agua a gas que se enciende automáticamente al abrir la ducha.",en:"Many apartments have a gas water heater that turns on automatically when you turn on the shower.",tts:"Muchos apartamentos tienen calentador de agua a gas que se enciende automáticamente al abrir la ducha."},
    {es:"También es muy común contratar a una señora de confianza para hacer aseo una vez por semana.",en:"It is also very common to hire a trustworthy lady to do house cleaning once a week.",tts:"También es muy común contratar a una señora de confianza para hacer aseo una vez por semana."},
    {es:"Si se daña la lavadora o el internet, le escribes al anfitrión o a la administración para pedir un técnico.",en:"If the washing machine or internet breaks, you message the host or building office to request a technician.",tts:"Si se daña la lavadora o el internet, le escribes al anfitrión o a la administración para pedir un técnico."}
  ],questions:[{q:"¿Cómo se dice comúnmente 'limpiar la casa' en Colombia?",choices:["Hacer aseo","Hacer trancón","Dar papaya"],answer:"Hacer aseo"}]},
  {id:"lectura-ciclovia",level:"A2",title:"Domingo de ciclovía y senderos",lesson:"gym-ciclovia",intro:"Experience Bogotá and Medellín's famous Sunday Ciclovía and mountain hiking trails.",lines:[
    {es:"Todos los domingos y festivos por la mañana, Bogotá y Medellín cierran grandes avenidas para la ciclovía.",en:"Every Sunday and holiday morning, Bogotá and Medellín close major avenues for the Ciclovía.",tts:"Todos los domingos y festivos por la mañana, Bogotá y Medellín cierran grandes avenidas para la ciclovía."},
    {es:"Miles de personas salen a montar en bicicleta, trotar o caminar con sus amigos y mascotas.",en:"Thousands of people go out to ride bikes, jog, or walk with their friends and pets.",tts:"Miles de personas salen a montar en bicicleta, trotar o caminar con sus amigos y mascotas."},
    {es:"Si subes a caminar por un sendero en los cerros de Bogotá, recuerda que estás a más de dos mil seiscientos metros de altura.",en:"If you go up to hike a trail in Bogotá's hills, remember you are at over 2,600 meters of altitude.",tts:"Si subes a caminar por un sendero en los cerros de Bogotá, recuerda que estás a más de dos mil seiscientos metros de altura."},
    {es:"Por eso es mejor subir despacio, tomar agua y descansar si sientes que te falta el aire.",en:"That's why it's better to climb slowly, drink water, and rest if you feel short of breath.",tts:"Por eso es mejor subir despacio, tomar agua y descansar si sientes que te falta el aire."}
  ],questions:[{q:"¿Qué pasa los domingos por la mañana en las avenidas principales de Bogotá y Medellín?",choices:["Se abren para la ciclovía sin carros","Cierran todos los parques","No hay buses en el país"],answer:"Se abren para la ciclovía sin carros"}]}
);

CONVERSATION_MISSIONS.push(
  {id:"mision-comodin",title:"Usa verbos comodín como un local",scenario:"A friend asks why you were busy this morning and if you want to hang out later.",prompt:"Cuéntale que hiciste una vuelta que dio lidia y cuadra para verse más tarde:",lesson:"verbos-comodin",models:[
    {es:"Esta mañana me tocó hacer una vuelta en el banco y me dio mucha lidia, pero más tarde quedamos para echar cuento.",en:"This morning I had to run an errand at the bank and it gave me a lot of trouble, but later let's meet up to chat.",tts:"Esta mañana me tocó hacer una vuelta en el banco y me dio mucha lidia, pero más tarde quedamos para echar cuento."},
    {es:"Póngale cuidado: ya le cogí el tiro al trámite, así que a las cinco nos vemos sin falta.",en:"Listen up: I already got the hang of the process, so at five we'll meet up without fail.",tts:"Póngale cuidado: ya le cogí el tiro al trámite, así que a las cinco nos vemos sin falta."}
  ]},
  {id:"mision-whatsapp",title:"Manda un audio de WhatsApp y cuadra una cita",scenario:"You missed a message because you were in a meeting. Send a voice note apologizing, asking for a document, and proposing a time tomorrow.",prompt:"Graba tu nota de voz:",lesson:"whatsapp-audios",models:[
    {es:"Hola, ¿cómo vas? Qué pena responder apenas ahora, te mando este audio rapidito. ¿Te queda bien si nos vemos mañana a las diez?",en:"Hi, how's it going? Sorry for only replying now, I'm sending you this quick audio. Does tomorrow at ten work for you?",tts:"Hola, ¿cómo vas? Qué pena responder apenas ahora, te mando este audio rapidito. ¿Te queda bien si nos vemos mañana a las diez?"},
    {es:"¿Será que me colaboras enviándome la ubicación por acá? Quedo muy atento a tu confirmación.",en:"Could you help me out by sending me the location here? I'll look forward to your confirmation.",tts:"¿Será que me colaboras enviándome la ubicación por acá? Quedo muy atento a tu confirmación."}
  ]},
  {id:"mision-arriendo",title:"Pregunta por los servicios y el aseo del apartamento",scenario:"You are checking into a monthly apartment rental. Ask about utilities, the water heater, and someone to clean.",prompt:"Habla con el anfitrión o propietario:",lesson:"arriendo-airbnb",models:[
    {es:"Disculpe, ¿en el arriendo ya están incluidos la administración y los servicios? ¿Y cómo se prende el calentador?",en:"Excuse me, are the HOA fee and utilities included in the rent? And how do you turn on the water heater?",tts:"Disculpe, ¿en el arriendo ya están incluidos la administración y los servicios? ¿Y cómo se prende el calentador?"},
    {es:"¿Me podría recomendar a alguien de confianza que venga a hacer aseo una vez por semana?",en:"Could you recommend someone trustworthy to come clean once a week?",tts:"¿Me podría recomendar a alguien de confianza que venga a hacer aseo una vez por semana?"}
  ]},
  {id:"mision-ciclovia",title:"Comparte máquina en el gym e invita a la ciclovía",scenario:"You are at the gym and want to work in on a machine, then invite your friend to the Sunday Ciclovía.",prompt:"Habla con tu compañero en el gimnasio:",lesson:"gym-ciclovia",models:[
    {es:"Buenas, parce, ¿cuántas series te faltan? ¿Nos turnamos en la máquina mientras descansas?",en:"Hey buddy, how many sets do you have left? Shall we take turns on the machine while you rest?",tts:"Buenas, parce, ¿cuántas series te faltan? ¿Nos turnamos en la máquina mientras descansas?"},
    {es:"El domingo vamos a salir a la ciclovía por la mañana; vamos suave para que no nos dé soroche.",en:"On Sunday we're going out to the Ciclovía in the morning; let's take it easy so we don't get altitude sickness.",tts:"El domingo vamos a salir a la ciclovía por la mañana; vamos suave para que no nos dé soroche."}
  ]}
);

Object.assign(LESSON_CONTENT,{
  "verbos-comodin":{
    goal:{es:"Me tocó hacer una vuelta que me dio lidia, pero más tarde quedamos para echar cuento.",en:"I had to run an errand that gave me trouble, but later we're meeting up to chat."},
    words:[{es:"hacer una vuelta",en:"to run an errand"},{es:"dar lidia",en:"to give trouble / be a hassle"},{es:"poner cuidado",en:"to pay attention"},{es:"echar cuento",en:"to chat / tell stories"},{es:"quedar de verse",en:"to agree to meet up"},{es:"cogerle el tiro",en:"to get the hang of it"}],
    phrases:[{en:"I have to run an errand downtown.",es:"Me toca hacer una vuelta en el centro."},{en:"That paperwork gave me a lot of trouble.",es:"Ese trámite me dio mucha lidia."},{en:"Pay attention to what I'm going to tell you.",es:"Póngale cuidado a lo que le voy a decir."},{en:"We agreed to meet on Saturday.",es:"Quedamos de vernos el sábado."}]
  },
  "whatsapp-audios":{
    goal:{es:"Te mando un audio rapidito. ¿Me colaboras con la ubicación y me confirmas si te queda bien mañana?",en:"I'm sending you a quick voice note. Can you help me with the location and confirm if tomorrow works for you?"},
    words:[{es:"mandar un audio",en:"to send a voice note"},{es:"¿me colaboras con…?",en:"can you help me out with…?"},{es:"¿te queda bien?",en:"does it work for you?"},{es:"así quedamos",en:"it's a plan / agreed"},{es:"me confirmas",en:"let me know / confirm for me"},{es:"quedo atento/a",en:"I'll look forward to your reply"}],
    phrases:[{en:"I'm sending you a quick voice note.",es:"Te mando un audio rapidito."},{en:"Could you help me out with this info?",es:"¿Será que me colaboras con este dato?"},{en:"Does tomorrow at ten work for you?",es:"¿Te queda bien mañana a las diez?"},{en:"I look forward to your reply.",es:"Quedo muy atento a tu respuesta."}]
  },
  "arriendo-airbnb":{
    goal:{es:"¿La administración está incluida? ¿Y me recomienda a alguien de confianza para hacer aseo?",en:"Is the HOA fee included? And can you recommend someone trustworthy to clean?"},
    words:[{es:"la administración",en:"HOA / building fee"},{es:"los servicios",en:"utilities (water/power/gas)"},{es:"el calentador",en:"water heater"},{es:"la lavadora",en:"washing machine"},{es:"hacer aseo",en:"to clean the house"},{es:"se dañó",en:"it broke / stopped working"}],
    phrases:[{en:"Is the building fee included in the rent?",es:"¿La administración está incluida en el arriendo?"},{en:"How do you turn on the water heater?",es:"¿Cómo se prende el calentador de agua?"},{en:"The washing machine broke yesterday.",es:"Se dañó la lavadora ayer."},{en:"Can you recommend someone to clean?",es:"¿Me recomienda a alguien para hacer aseo?"}]
  },
  "gym-ciclovia":{
    goal:{es:"¿Cuántas series te faltan? ¿Nos turnamos en la máquina? Y el domingo vamos a la ciclovía.",en:"How many sets do you have left? Shall we take turns on the machine? And Sunday let's go to the Ciclovía."},
    words:[{es:"¿nos turnamos?",en:"shall we take turns / work in?"},{es:"cuántas series",en:"how many sets"},{es:"la ciclovía",en:"Sunday car-free bike avenues"},{es:"el sendero / la quebrada",en:"hiking trail / mountain stream"},{es:"me falta el aire",en:"I'm short of breath"},{es:"el soroche",en:"altitude sickness"}],
    phrases:[{en:"Shall we take turns on the machine?",es:"¿Nos turnamos en la máquina?"},{en:"How many sets do you have left?",es:"¿Cuántas series te faltan?"},{en:"On Sunday we're going out to the Ciclovía.",es:"El domingo salimos a la ciclovía."},{en:"Let's go slowly; I'm short of breath from the altitude.",es:"Vamos despacio que me falta el aire por la altura."}]
  }
});

Object.assign(LESSON_META,{
  "verbos-comodin":{stage:"Speak More Naturally",difficulty:"Moderate",prereq:"Colombianismos",dialogue:"Verbos comodín en acción",vocab:"verbos",quizCat:"comodin",quizMode:"conversation",guideIds:["se-me","por-para"],readingId:"lectura-comodin",missionId:"mision-comodin"},
  "whatsapp-audios":{stage:"Daily Life",difficulty:"Easy",prereq:"Planes y teléfono",dialogue:"WhatsApp, notas de voz y citas",vocab:"tecnologia",quizCat:"whatsapp",quizMode:"conversation",guideIds:["cortesia-colombiana","usted-tu-vos"],readingId:"lectura-whatsapp",missionId:"mision-whatsapp"},
  "arriendo-airbnb":{stage:"Daily Life",difficulty:"Easy",prereq:"Portería, Rappi y edificio",dialogue:"Arriendo, Airbnb, aseo y lavadora",vocab:"casa",quizCat:"arriendo",quizMode:"conversation",guideIds:["ser-estar","se-me"],readingId:"lectura-arriendo",missionId:"mision-arriendo"},
  "gym-ciclovia":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Salir con amigos",dialogue:"Gimnasio, ciclovía, senderos y soroche",vocab:"cuerpo",quizCat:"gym-ciclovia",quizMode:"conversation",guideIds:["gustar","futuro"],readingId:"lectura-ciclovia",missionId:"mision-ciclovia"}
});

Object.assign(SENTENCE_LADDERS,{
  "verbos-comodin":{
    title:"Combine Colombian wildcard verbs (dar, hacer, poner, echar, quedar)",
    rungs:[
      {tag:"1. Anchor stem",es:"Me toca hacer una vuelta.",en:"I have to run an errand."},
      {tag:"2. + Dar lidia",es:"Me tocó hacer una vuelta y me dio mucha lidia.",en:"I had to run an errand and it gave me a lot of trouble."},
      {tag:"3. + Coger el tiro",es:"Al principio me dio lidia, pero ya le cogí el tiro.",en:"At first it gave me trouble, but I already got the hang of it."},
      {tag:"4. + Quedar & echar cuento",es:"Hoy me tocó hacer una vuelta temprano, pero a las cinco quedamos de vernos para echar cuento con un tintico.",en:"Today I had to run an errand early, but at five we agreed to meet up to chat over a coffee."}
    ],
    swaps:[
      {label:"Poner cuidado",es:"Póngale cuidado a esta dirección para que no nos perdamos.",en:"Pay close attention to this address so we don't get lost."},
      {label:"Echar un ojo",es:"¿Me echa un ojo al computador mientras pido otro café?",en:"Can you keep an eye on my laptop while I order another coffee?"},
      {label:"Ponerse las pilas",es:"Nos toca ponernos las pilas para terminar el trabajo hoy.",en:"We have to get moving/focused to finish the work today."}
    ]
  },
  "whatsapp-audios":{
    title:"Send polite Colombian WhatsApp messages and voice notes",
    rungs:[
      {tag:"1. Anchor stem",es:"Te mando un audio…",en:"I'm sending you a voice note…"},
      {tag:"2. + Apology & reason",es:"Qué pena la demora; te mando un audio rapidito.",en:"Sorry for the delay; I'm sending you a quick voice note."},
      {tag:"3. + Colaborar request",es:"Te mando un audio: ¿será que me colaboras con la dirección?",en:"I'm sending you a voice note: could you help me out with the address?"},
      {tag:"4. + Schedule & close",es:"Hola, te mando un audio rapidito: ¿te queda bien si nos vemos mañana a las diez? Me confirmas, quedo muy atento.",en:"Hi, I'm sending you a quick voice note: does tomorrow at ten work for you? Let me know, I'll look forward to your reply."}
    ],
    swaps:[
      {label:"Send pin",es:"¿Me mandas la ubicación actual por WhatsApp cuando llegues?",en:"Can you send me your live location on WhatsApp when you arrive?"},
      {label:"Confirm plan",es:"Listo, dale, así quedamos para el viernes sin falta.",en:"Got it, sounds good, we're set for Friday without fail."},
      {label:"Send screenshot",es:"Ya te pasé el comprobante de Nequi por mensaje.",en:"I already sent you the Nequi receipt screenshot by message."}
    ]
  },
  "arriendo-airbnb":{
    title:"Ask about rent, utilities, appliances, and apartment cleaning",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Está incluida la administración?",en:"Is the HOA fee included?"},
      {tag:"2. + Utilities & wifi",es:"¿En el arriendo están incluidos la administración y los servicios?",en:"Are the HOA fee and utilities included in the rent?"},
      {tag:"3. + Appliances",es:"Todo está incluido, pero ¿cómo se prende el calentador de agua?",en:"Everything is included, but how do you turn on the water heater?"},
      {tag:"4. + Cleaning recommendation",es:"Disculpe, ¿me enseña cómo funciona la lavadora y me recomienda a alguien de confianza para hacer aseo?",en:"Excuse me, can you show me how the washer works and recommend someone trustworthy to clean?"}
    ],
    swaps:[
      {label:"Report leak",es:"Qué pena, se dañó un tubo en el baño y está goteando.",en:"Excuse me, a pipe broke in the bathroom and is dripping."},
      {label:"Wi-Fi password",es:"¿Me regala la clave del wifi para conectar el portátil?",en:"Can you give me the Wi-Fi password to connect my laptop?"},
      {label:"Trash & recycling",es:"¿En qué cuarto del edificio se deja la basura y el reciclaje?",en:"In which room of the building do we leave the trash and recycling?"}
    ]
  },
  "gym-ciclovia":{
    title:"Work in at the gym, plan Sunday Ciclovía, and pace for altitude",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Nos turnamos?",en:"Shall we take turns?"},
      {tag:"2. + Gym machine",es:"Parce, ¿cuántas series te faltan? ¿Nos turnamos en la máquina?",en:"Buddy, how many sets do you have left? Shall we take turns on the machine?"},
      {tag:"3. + Sunday Ciclovía",es:"¿Nos turnamos aquí? Y oye, ¿salimos el domingo a la ciclovía?",en:"Shall we take turns here? And hey, shall we go out to the Ciclovía on Sunday?"},
      {tag:"4. + Trail & altitude",es:"El domingo vamos a caminar por el sendero de los cerros, pero subamos despacio para que no nos dé soroche.",en:"On Sunday let's hike the mountain trail, but let's climb slowly so we don't get altitude sickness."}
    ],
    swaps:[
      {label:"Short of breath",es:"Esperemos cinco minuticos aquí que me está faltando el aire.",en:"Let's wait five minutes here because I'm short of breath."},
      {label:"Spotter / weights",es:"¿Usas estas mancuernas o las puedo coger un momento?",en:"Are you using these dumbbells or can I grab them for a moment?"},
      {label:"Post-workout juice",es:"Después de entrenar vamos por un jugo de mandarina en la esquina.",en:"After working out let's grab a fresh tangerine juice on the corner."}
    ]
  }
});

/* 2. 6 More High-Frequency Colombianismos (66 total) */
COLOMBIANISMOS.push(
  {word:"¿Me colaboras?",en:"Could you help me out? (Colombian magic word)",region:"all",register:"Colombian · polite everyday",registerGroup:"everyday",usage:"In Colombia, people say 'colaborar' instead of 'ayudar' in shops, offices, Uber, and WhatsApp ('¿Me colaboras con la cuenta?').",example:"Qué pena, ¿me colaboras abriendo la puerta un segundito?",tts:"Qué pena, ¿me colaboras abriendo la puerta un segundito?"},
  {word:"Dar lidia",en:"To give trouble / be a hassle",region:"all",register:"Colombian · everyday",registerGroup:"everyday",usage:"Used for an appliance, paperwork, traffic, or a kid/pet that is being difficult ('Eso sí da lidia').",example:"Esa cerradura vieja me ha dado mucha lidia hoy.",tts:"Esa cerradura vieja me ha dado mucha lidia hoy."},
  {word:"Echar cuento",en:"To chat / catch up / tell stories",region:"all",register:"Colombian · friendly",registerGroup:"everyday",usage:"Sitting down with friends to talk and catch up (also used for flirting: 'le está echando los perros / echando cuento').",example:"Vamos por un café y echamos cuento un rato.",tts:"Vamos por un café y echamos cuento un rato."},
  {word:"Cogerle el tiro",en:"To get the hang of something",region:"all",register:"Colombian · everyday",registerGroup:"everyday",usage:"Means mastering the rhythm or trick of a skill, job, or language.",example:"Ya le estoy cogiendo el tiro a las direcciones en Bogotá.",tts:"Ya le estoy cogiendo el tiro a las direcciones en Bogotá."},
  {word:"Hacer aseo",en:"To clean the house / tidy up",region:"all",register:"Colombian · home life",registerGroup:"everyday",usage:"In Colombia, nobody says 'limpiar el apartamento'—everyone says 'hacer aseo' (and the cleaner is 'la señora del aseo').",example:"El sábado por la mañana me toca hacer aseo en la casa.",tts:"El sábado por la mañana me toca hacer aseo en la casa."},
  {word:"Soroche",en:"Altitude sickness (Bogotá & Andes)",region:"bogota",register:"Andean · health & outdoors",registerGroup:"everyday",usage:"Feeling winded, dizzy, or tired when arriving in Bogotá (2,640m) or hiking in the mountains.",example:"Camina despacio el primer día en Bogotá para que no te dé soroche.",tts:"Camina despacio el primer día en Bogotá para que no te dé soroche."}
);

/* 3. 10th 3-Column Slot-Swapper Matrix: WhatsApp, Audios & Scheduling */
SLOT_SWAP_MATRICES.push(
  {
    id:"whatsapp-citas-matrix",
    title:"📱 WhatsApp, Audios & Citas",
    sub:"Send natural Colombian voice notes, ask for favors with 'colaborar', and schedule plans",
    col1Title:"1. WhatsApp Opener",
    col2Title:"2. Request / Plan",
    col3Title:"3. Polite Close",
    col1:[
      {es:"Hola, ¿cómo vas? Te mando un audio porque",en:"Hi, how's it going? I'm sending you a voice note because"},
      {es:"Qué pena responder apenas ahora, quería saber si",en:"Sorry for only replying just now, I wanted to see if"},
      {es:"Buenas tardes, ¿será que usted me colabora y",en:"Good afternoon, could you possibly help me out and"},
      {es:"Oye, te escribo rapidito para preguntar si",en:"Hey, I'm texting you quickly to ask if"}
    ],
    col2:[
      {es:"te queda bien que nos veamos mañana a las diez",en:"it works for you for us to meet tomorrow at ten"},
      {es:"me compartes la ubicación exacta por acá",en:"you can share the exact location with me here"},
      {es:"podemos cuadrar la visita del técnico el jueves",en:"we can schedule the technician visit on Thursday"},
      {es:"le puedes echar un ojo al documento que te envié",en:"you can take a look at the document I sent you"}
    ],
    col3:[
      {es:"y me confirmas cualquier cosa, porfa.",en:"and let me know if anything comes up, please."},
      {es:"quedo súper atento a tu respuesta.",en:"I'll look forward to your reply."},
      {es:"para que así quedemos listos.",en:"so that we're all set."},
      {es:"cuando tengas un tiempito libre.",en:"when you have a little free time."}
    ]
  }
);

/* 4. New Quiz Items for v94 Scenarios (Comodín, WhatsApp, Arriendo, Gym/Ciclovía) */
V60_CONVERSATION_QUIZ.push(
  {kind:"reply",focus:"past",cat:"comodin",es:"¿Cómo te fue con el trámite en el banco esta mañana?",en:"Me dio mucha lidia al principio, pero ya quedó listo.",tts:"¿Cómo te fue con el trámite en el banco esta mañana?",choices:["Me dio mucha lidia al principio, pero ya quedó listo.","En leche y bajito de azúcar, por favor.","A una sola cuota sin factura.","Suba dos cuadras hacia los cerros."]},
  {kind:"meaning",focus:"present",cat:"comodin",es:"Vamos por un tintico y echamos cuento un rato.",en:"Let's go get a black coffee and chat/catch up for a while.",tts:"Vamos por un tintico y echamos cuento un rato.",choices:["Let's go get a black coffee and chat/catch up for a while.","Turn right after the traffic light.","The washing machine is leaking water.","Take one pill every eight hours."]},
  {kind:"reply",focus:"present",cat:"whatsapp",es:"Hola, ¿te queda bien si nos vemos mañana a las diez en el café?",en:"¡De una! Así quedamos; cualquier cambio me confirmas por acá.",tts:"Hola, ¿te queda bien si nos vemos mañana a las diez en el café?",choices:["¡De una! Así quedamos; cualquier cambio me confirmas por acá.","Vengo por turismo durante dos semanas.","No soy alérgico a ningún medicamento.","Quiero un desvanecido con la máquina dos."]},
  {kind:"meaning",focus:"present",cat:"whatsapp",es:"¿Será que me colaboras enviándome la ubicación por WhatsApp?",en:"Could you help me out by sending me the location on WhatsApp?",tts:"¿Será que me colaboras enviándome la ubicación por WhatsApp?",choices:["Could you help me out by sending me the location on WhatsApp?","Did the pandebonos come out warm from the oven?","From which platform does the bus leave?","Is the HOA fee included in the rent?"]},
  {kind:"reply",focus:"present",cat:"arriendo",es:"¿En el valor del arriendo ya están incluidos la administración y los servicios?",en:"Sí, señor, todo está incluido y la clave del wifi está en la sala.",tts:"¿En el valor del arriendo ya están incluidos la administración y los servicios?",choices:["Sí, señor, todo está incluido y la clave del wifi está en la sala.","Por la plataforma cuatro después del peaje.","En agua sin azúcar para llevar.","Arriba solo las puntas con tijera."]},
  {kind:"meaning",focus:"present",cat:"arriendo",es:"¿Me puede recomendar a alguien de confianza que venga a hacer aseo?",en:"Can you recommend someone trustworthy to come clean the apartment?",tts:"¿Me puede recomendar a alguien de confianza que venga a hacer aseo?",choices:["Can you recommend someone trustworthy to come clean the apartment?","Can you authorize the delivery driver at the front gate?","Where is the baggage claim belt at the airport?","Shall we take turns on the gym machine?"]},
  {kind:"reply",focus:"present",cat:"gym-ciclovia",es:"Buenas, parce, ¿cuántas series te faltan? ¿Nos turnamos en la máquina?",en:"¡Claro, hágale! Solo me faltan dos series.",tts:"Buenas, parce, ¿cuántas series te faltan? ¿Nos turnamos en la máquina?",choices:["¡Claro, hágale! Solo me faltan dos series.","Consumidor final a una sola cuota.","Se cayó el internet desde esta mañana.","Me da dos almojábanas calienticas."]},
  {kind:"meaning",focus:"present",cat:"gym-ciclovia",es:"Vamos más despacio en la subida que me dio un poquito de soroche.",en:"Let's go slower on the climb because I got a bit of altitude sickness.",tts:"Vamos más despacio en la subida que me dio un poquito de soroche.",choices:["Let's go slower on the climb because I got a bit of altitude sickness.","It's better not to flash your phone on the street at night.","I'm sending you a quick voice note because I'm walking.","The water heater turns on automatically when you open the shower."]}
);

V60_FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"past",cat:"comodin",es:"Ese trámite en la oficina me dio mucha ___ toda la mañana.",en:"lidia",tts:"Ese trámite en la oficina me dio mucha lidia toda la mañana.",trans:"That paperwork at the office gave me a lot of trouble/hassle all morning.",choices:["lidia","cuota","maleta","almojábana"]},
  {kind:"blank",focus:"present",cat:"comodin",es:"Al principio fue difícil, pero ya le cogí el ___ al español colombiano.",en:"tiro",tts:"Al principio fue difícil, pero ya le cogí el tiro al español colombiano.",trans:"At first it was hard, but I already got the hang of Colombian Spanish.",choices:["tiro","peaje","datáfono","semáforo"]},
  {kind:"blank",focus:"present",cat:"whatsapp",es:"¿Será que me ___ enviándome el documento por WhatsApp?",en:"colaboras",tts:"¿Será que me colaboras enviándome el documento por WhatsApp?",trans:"Could you help me out by sending me the document on WhatsApp?",choices:["colaboras","almuerzas","escampas","aterrizas"]},
  {kind:"blank",focus:"present",cat:"arriendo",es:"El sábado por la mañana nos toca hacer ___ en el apartamento.",en:"aseo",tts:"El sábado por la mañana nos toca hacer aseo en el apartamento.",trans:"On Saturday morning we have to clean the apartment.",choices:["aseo","trancón","soroche","pasaje"]},
  {kind:"blank",focus:"present",cat:"gym-ciclovia",es:"Parce, ¿nos ___ en la máquina mientras descansas un minuto?",en:"turnamos",tts:"Parce, ¿nos turnamos en la máquina mientras descansas un minuto?",trans:"Buddy, shall we take turns on the machine while you rest a minute?",choices:["turnamos","empacamos","cobramos","aterrizamos"]},
  {kind:"blank",focus:"present",cat:"gym-ciclovia",es:"El domingo por la mañana salimos a montar en bici por la ___.",en:"ciclovía",tts:"El domingo por la mañana salimos a montar en bici por la ciclovía.",trans:"On Sunday morning we go out to ride bikes on the Ciclovía.",choices:["ciclovía","portería","droguería","peluquería"]}
);
// ── V95.0 COLOMBIAN SPEAKING MASTERY & REGIONAL ATLAS EXPANSION ─────────────
/* 1. Interactive 4-Region Colombian Accent & Slang Atlas (Bogotá, Medellín, Costa, Cali)
   2. 4 New Real-World Colombian Scenarios (Lessons 61–64, Dialogues 51–54):
      - Citas, cumplidos y conocer a la familia (invitar a salir, caer bien, elogiar la casa/comida)
      - Almuerzo ejecutivo, corrientazo y onces (sopa o fruta, principio, proteína, sobremesa)
      - Cajero automático, SIM card y trámites (ahorros o corriente, recarga Claro, cédula/pasaporte)
      - Puentes festivos, salsa y rumba (puente festivo, bailar salsa/vallenato, media de guaro) */

const REGIONAL_ATLAS = [
  {
    "id": "bogota",
    "tab": "🏔️ Bogotá (Rolo)",
    "title": "Bogotá & Altiplano (Rolo / Cachaco)",
    "vibe": "Polite, melodic, uses usted/tú/sumercé, diminutives (-ico/-ito), and warm courtesy.",
    "items": [
      {
        "category": "👋 Greeting & Friend",
        "es": "¿Cómo amaneció, sumercé? Qué dicha volverlo a ver, ¿todo bien?",
        "en": "How did you wake up, sumercé? It’s so nice to see you again—is everything good?",
        "tip": "Sumercé expresses warmth and respect; rolos also soften speech with diminutives."
      },
      {
        "category": "✨ 'That's awesome!'",
        "es": "¡Uy, qué chévere! Ese plan quedó muy bonito, ¿sí o qué?",
        "en": "Wow, that’s awesome! That plan turned out really nice, right?",
        "tip": "Uy and ¿sí o qué? add friendly emphasis without sounding overly loud."
      },
      {
        "category": "☕ Food & Drink Specialty",
        "es": "Hagamos una paradita para un tintico y un pancito, y luego nos comemos un ajiaco.",
        "en": "Let’s make a little stop for a small coffee and some bread, and then we’ll have ajiaco.",
        "tip": "Tintico and pancito are affectionate diminutives commonly heard in Bogotá; ajiaco is the local classic."
      },
      {
        "category": "🎉 Plans & Hangout",
        "es": "¿Te provoca que nos tomemos un cafecito por La Candelaria esta tardecita?",
        "en": "Would you like to have a little coffee in La Candelaria this afternoon?",
        "tip": "Te provoca and diminutives make invitations sound gentle and courteous."
      },
      {
        "category": "🗣️ Signature Filler / Rhythm",
        "es": "Pues sí, claro, con mucho gusto; me cuenta cualquier cosita y yo le colaboro.",
        "en": "Well yes, of course, gladly; let me know if you need anything and I’ll help you out.",
        "tip": "Polite fillers such as pues, claro, and con mucho gusto create the characteristic courteous rhythm."
      }
    ]
  },
  {
    "id": "medellin",
    "tab": "🌸 Medellín (Paisa)",
    "title": "Medellín & Eje Cafetero (Paisa)",
    "vibe": "Expressive, musical intonation, uses vos/tú, 'pues' at the end of phrases, and 'parce'.",
    "items": [
      {
        "category": "👋 Greeting & Friend",
        "es": "¿Qué más, pues, parce? ¿Cómo vas o qué?",
        "en": "What’s up, buddy? How are you doing?",
        "tip": "Parce is a very common friendly word, while pues and o qué give the greeting its Paisa rhythm."
      },
      {
        "category": "✨ 'That's awesome!'",
        "es": "¡No, parce, eso está una chimba, pues!",
        "en": "No way, buddy, that’s awesome!",
        "tip": "Una chimba is enthusiastic and informal; use it with friends, not in formal settings."
      },
      {
        "category": "☕ Food & Drink Specialty",
        "es": "Vení, nos tomamos un tinto y después nos comemos una bandejita paisa, ¿sí o qué?",
        "en": "Come on, let’s have a black coffee and then eat a little bandeja paisa, all right?",
        "tip": "Vení is the familiar voseo imperative, and bandeja paisa is Medellín’s emblematic hearty dish."
      },
      {
        "category": "🎉 Plans & Hangout",
        "es": "¿Vos qué vas a hacer esta noche? Caé a mi casa y parchamos un rato, pues.",
        "en": "What are you doing tonight? Come over to my place and let’s hang out for a while.",
        "tip": "Vos forms such as caé and parchamos are strongly associated with relaxed Paisa conversation."
      },
      {
        "category": "🗣️ Signature Filler / Rhythm",
        "es": "Eso sí queda listo mañana, pues, ¿cierto?",
        "en": "That will definitely be ready tomorrow, right?",
        "tip": "Pues at the end of a phrase and ¿cierto? create the recognizable musical Paisa cadence."
      }
    ]
  },
  {
    "id": "costa",
    "tab": "🌴 Costa Caribe (Costeño)",
    "title": "Cartagena, Barranquilla & Santa Marta (Costeño)",
    "vibe": "Fast, rhythmic, warm Caribbean energy, drops final -s, uses 'ajá', 'mani', 'chevere/bacano', and 'no joda'.",
    "items": [
      {
        "category": "👋 Greeting & Friend",
        "es": "¿Ajá, maní, qué más? ¿Todo bien o qué?",
        "en": "Hey, buddy, what’s up? Everything good or what?",
        "tip": "Ajá opens many Caribbean exchanges, while maní is a warm, informal way to address a friend."
      },
      {
        "category": "✨ 'That's awesome!'",
        "es": "¡Eso está bacano, no joda; quedó chévere de verdad!",
        "en": "That’s awesome, seriously; it turned out really great!",
        "tip": "Bacano and chévere mean cool or excellent; no joda intensifies the excitement."
      },
      {
        "category": "☕ Food & Drink Specialty",
        "es": "Vamos por una arepita de huevo y un juguito de corozo, que hace una calor tremenda.",
        "en": "Let’s get an egg-stuffed arepa and a corozo juice, because it’s incredibly hot.",
        "tip": "Arepa de huevo and corozo are iconic Caribbean foods and drinks; final -s may be weakened or dropped in speech."
      },
      {
        "category": "🎉 Plans & Hangout",
        "es": "Esta noche nos vamos pa’l malecón a escuchar música y a pasarla bacano, ¿ajá?",
        "en": "Tonight we’re going to the waterfront to listen to music and have a great time, all right?",
        "tip": "Pa’l is the conversational contraction of para el, and pasarla bacano reflects the region’s easygoing warmth."
      },
      {
        "category": "🗣️ Signature Filler / Rhythm",
        "es": "Ajá, entonces nos vemos ahorita, pero no te me demorés, ¿oíste?",
        "en": "All right, then I’ll see you in a little while, but don’t take too long, you hear?",
        "tip": "Ajá, ahorita, and ¿oíste? give the speech a quick, rhythmic Caribbean pulse."
      }
    ]
  },
  {
    "id": "cali",
    "tab": "💃 Cali (Valluno)",
    "title": "Cali & Valle del Cauca (Valluno / Caleño)",
    "vibe": "Salsa capital rhythm, uses 'vos' ('mirá, ve, oís'), 'qué nota', and warm open hospitality.",
    "items": [
      {
        "category": "👋 Greeting & Friend",
        "es": "¿Qué más, vos? Vení, dame un abrazo, que hace rato no te veía.",
        "en": "What’s up? Come here, give me a hug—I haven’t seen you in a while.",
        "tip": "Caleños often combine vos with warm, open invitations and affectionate physical greetings."
      },
      {
        "category": "✨ 'That's awesome!'",
        "es": "¡Mirá, ve, qué nota ese concierto; estuvo buenísimo!",
        "en": "Look, that concert was so awesome; it was amazing!",
        "tip": "Qué nota means how cool or great, while mirá and ve are characteristic conversational markers."
      },
      {
        "category": "☕ Food & Drink Specialty",
        "es": "Después de bailar nos vamos por un champús y un pandebono calientico.",
        "en": "After dancing, we’ll go get some champús and a warm pandebono.",
        "tip": "Champús and pandebono are beloved Valle del Cauca specialties; calientico adds affectionate warmth."
      },
      {
        "category": "🎉 Plans & Hangout",
        "es": "¿Vos qué decís si salimos a bailar salsa esta noche? Mirá que hay una rumba muy buena.",
        "en": "What do you say we go dancing salsa tonight? There’s a really good party happening.",
        "tip": "Salsa is central to Cali’s identity, and vos forms such as decís are common in casual speech."
      },
      {
        "category": "🗣️ Signature Filler / Rhythm",
        "es": "Eso queda listo, ve; vos llegás temprano y me avisás, ¿oís?",
        "en": "That’ll be all set; you arrive early and let me know, you hear?",
        "tip": "Ve and oís shape the lively Caleño rhythm, while llegás and avisás show familiar voseo."
      }
    ]
  }
];

FRASES.push(
  {section:"❤️ Citas, cumplidos y la familia",quizCat:"citas-familia",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.2)",items:[
    {es:"Me encanta conversar contigo; ¿te gustaría salir a tomar un café o un cóctel el viernes?",en:"I love talking with you; would you like to go out for a coffee or cocktail on Friday?",register:"Colombian · dating"},
    {es:"¡Uy, ese color te queda súper bien! Te ves muy linda hoy.",en:"Wow, that color looks great on you! You look very pretty today.",register:"Colombian · natural compliment"},
    {es:"Mucho gusto, señora Marta; Camila me ha hablado muchísimo de ustedes.",en:"Very nice to meet you, Mrs. Marta; Camila has told me so much about you all.",register:"Meeting family · polite"},
    {es:"¡Qué casa tan acogedora tienen! Muchas gracias por la invitación a almorzar.",en:"What a welcoming/cozy home you have! Thank you so much for the lunch invitation.",register:"Meeting family · warm"},
    {es:"Tu familia me cayó súper bien; son unas personas muy queridas y atentas.",en:"I really liked your family; they are such sweet and attentive people.",register:"Colombian · caer bien"},
    {es:"Avísame apenas llegues a la casa para quedarme tranquilo.",en:"Let me know as soon as you get home so I know you're safe.",register:"Colombian · caring"}
  ]},
  {section:"🫓 Almuerzo ejecutivo (corrientazo) y onces",quizCat:"corrientazo",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[
    {es:"Buenas tardes, veci, ¿qué trae hoy el almuerzo ejecutivo?",en:"Good afternoon, neighbor, what comes with today's lunch special?",register:"Colombian · corrientazo"},
    {es:"Con sopa de ajiaco, de principio lentejas y la pechuga a la plancha, por favor.",en:"With ajiaco soup, lentils for the side, and the grilled chicken breast, please.",register:"Ordering corrientazo"},
    {es:"¿Me cambia el arroz por más ensalada y tajadas de plátano maduro?",en:"Could you swap the rice for more salad and sweet plantain slices?",register:"Customizing lunch"},
    {es:"¿Qué hay de sobremesa hoy? Me regala limonada natural sin azúcar.",en:"What drink comes with lunch today? I'll have fresh unsweetened lemonade.",register:"Colombian · sobremesa"},
    {es:"A las cuatro vamos a tomar las onces con aguapanela, queso y almojábana.",en:"At four o'clock let's have afternoon coffee/snack with aguapanela, cheese, and almojábana.",register:"Bogotá & Andes · onces"},
    {es:"Compré un poquito de mecato para picar en el camino.",en:"I bought some snacks/treats to nibble on along the way.",register:"Medellín & Colombia · mecato"}
  ]},
  {section:"🏦 Cajero, SIM card y trámites",quizCat:"cajero-sim",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[
    {es:"Disculpe, ¿dónde queda un cajero automático de Bancolombia o Davivienda cerca?",en:"Excuse me, where is a Bancolombia or Davivienda ATM nearby?",register:"Banking · everyday"},
    {es:"Para pagar con tarjeta extranjera en el datáfono, a veces toca elegir cuenta de ahorros o crédito.",en:"To pay with a foreign card on the terminal, sometimes you have to choose savings or credit.",register:"Colombian payments"},
    {es:"Buenas, ¿me colabora con una SIM card prepago y una recarga de treinta mil pesos?",en:"Hi, could you help me with a prepaid SIM card and a 30,000-peso top-up?",register:"Phone & SIM"},
    {es:"No tengo cédula colombiana todavía; ¿le sirve el número de mi pasaporte?",en:"I don't have a Colombian ID yet; does my passport number work for you?",register:"Errands & ID"},
    {es:"El cajero me descontó la plata pero no me entregó los billetes.",en:"The ATM deducted the money from my account but didn't give me the bills.",register:"Bank issue"},
    {es:"¿Dónde puedo sacar una fotocopia de la cédula o imprimir este formulario?",en:"Where can I make a photocopy of my ID or print this form?",register:"Paperwork"}
  ]},
  {section:"🎉 Puentes festivos, salsa y rumba",quizCat:"puentes-rumba",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[
    {es:"¿Qué planes tienes para este puente festivo? ¿Te quedas en la ciudad o viajas?",en:"What plans do you have for this long holiday weekend? Are you staying in town or traveling?",register:"Colombian · puente"},
    {es:"El sábado por la noche vamos a rumbear a una salsoteca muy buena.",en:"On Saturday night we're going out partying/dancing at a great salsa club.",register:"Colombian · rumba"},
    {es:"Yo tengo dos pies izquierdos, pero si me enseñas el paso básico de salsa, yo le hago.",en:"I have two left feet, but if you teach me the basic salsa step, I'll go for it.",register:"Dancing · friendly"},
    {es:"¡Salud! Pidamos una media de guaro con agua y limón para brindar.",en:"Cheers! Let's order a half-bottle of aguardiente with water and lime to toast.",register:"Colombian · rumba"},
    {es:"En Colombia ponen salsa, merengue, reggaetón y vallenato en todas las fiestas.",en:"In Colombia they play salsa, merengue, reggaeton, and vallenato at every party.",register:"Culture"},
    {es:"¡Uy, qué guayabo tan bravo tengo hoy! Necesito un caldo de costilla urgente.",en:"Oof, what a rough hangover I have today! I urgently need a beef rib broth.",register:"Morning after · guayabo"}
  ]}
);

CONVERSATIONS.push(
  v60Dialogue("Citas, cumplidos y conocer a la familia","Inviting someone out, giving warm compliments, and meeting Colombian parents",[
    ["A","¡Hola, Valeria! Qué alegría verte. Ese vestido te queda súper bien.","Hi Valeria! So great to see you. That dress looks amazing on you."],
    ["B","¡Ay, tan bello, muchas gracias! Adelante, sigue; te presento a mis papás, don Hernán y doña Clara.","Aw, how sweet of you, thank you so much! Come on in; let me introduce you to my parents, Mr. Hernán and Mrs. Clara."],
    ["A","Mucho gusto, don Hernán y doña Clara. Valeria me ha hablado muchísimo de ustedes; ¡qué casa tan acogedora tienen!","Very nice to meet you, Mr. Hernán and Mrs. Clara. Valeria has told me so much about you; what a welcoming home you have!"],
    ["B","El gusto es de nosotros, mijo. Siéntate como en tu casa; ¿te provocan unas onces con tintico y pandebono?","The pleasure is ours, son. Make yourself at home; would you like an afternoon coffee with pandebono?"],
    ["A","¡Claro que sí, doña Clara, muchas gracias! Todo huele delicioso.","Of course, Mrs. Clara, thank you very much! Everything smells delicious."],
    ["B","Qué bueno que viniste; tus papás también están muy invitados cuando vengan a Colombia.","So glad you came; your parents are also very welcome whenever they visit Colombia."]
  ],[{es:"Tus papás me cayeron súper bien; son muy queridos.",en:"I really liked your parents; they are so sweet.",tts:"Tus papás me cayeron súper bien; son muy queridos."},{es:"¿Te gustaría salir a cenar conmigo este viernes?",en:"Would you like to go out to dinner with me this Friday?",tts:"¿Te gustaría salir a cenar conmigo este viernes?"}]),
  v60Dialogue("Almuerzo ejecutivo, corrientazo y onces","Ordering a Colombian weekday lunch special (sopa, principio, proteína, sobremesa)",[
    ["A","Buenas tardes, bienvenido. ¿Va a pedir el almuerzo ejecutivo de hoy?","Good afternoon, welcome. Are you ordering today's lunch special?"],
    ["B","Buenas tardes, veci. Sí, por favor, ¿qué trae el ejecutivo hoy?","Good afternoon, neighbor. Yes, please, what comes with the lunch special today?"],
    ["A","Hoy tenemos sopa de verduras o fruta; de principio hay frijoles, lentejas o tajadas de maduro; y de proteína carne asada, pechuga a la plancha o mojarra.","Today we have vegetable soup or fruit; for the side there's beans, lentils, or sweet plantain; and for protein grilled beef, grilled chicken breast, or fried tilapia."],
    ["B","Me regala con sopa, de principio frijoles con tajadas, y la pechuga a la plancha, por favor.","I'll have it with soup, beans and plantains for the side, and the grilled chicken breast, please."],
    ["A","¡Con mucho gusto! ¿Y de sobremesa qué desea tomar: limonada de panela o jugo de maracuyá?","With pleasure! And for the lunch drink what would you like: panela lemonade or passionfruit juice?"],
    ["B","Jugo de maracuyá bajito de azúcar, por favor. Y más tarde pasamos por unas onces con buñuelo.","Passionfruit juice low on sugar, please. And later we'll stop by for an afternoon snack with a buñuelo."]
  ],[{es:"¿Me cambia el arroz por más ensalada, por favor?",en:"Could you swap the rice for more salad, please?",tts:"¿Me cambia el arroz por más ensalada, por favor?"},{es:"El corrientazo de esta esquina es casero, rico y barato.",en:"The daily lunch at this corner spot is homemade, tasty, and cheap.",tts:"El corrientazo de esta esquina es casero, rico y barato."}]),
  v60Dialogue("Cajero automático, SIM card y trámites","Withdrawing cash, activating a prepaid SIM card, and using your passport for ID",[
    ["A","Buenas tardes, joven. ¿Me colabora activando una SIM card prepago con datos para el celular?","Good afternoon. Could you help me activate a prepaid SIM card with data for my phone?"],
    ["B","Claro que sí, con mucho gusto. Para registrar la línea necesito su cédula o su pasaporte.","Of course, with pleasure. To register the line I need your Colombian ID or your passport."],
    ["A","Todavía no tengo cédula de extranjería, pero aquí tengo mi pasaporte. ¿Le puedo hacer una recarga de treinta mil pesos?","I don't have a foreigner ID card yet, but here is my passport. Can I put a 30,000-peso top-up on it?"],
    ["B","Sí, señor, con ese paquete le quedan quince gigas por un mes. ¿Paga en efectivo o con tarjeta?","Yes, sir, with that package you get 15 GB for a month. Are you paying cash or by card?"],
    ["A","Con tarjeta, por favor. ¿Sabe si por esta cuadra hay un cajero automático seguro para sacar efectivo ahorita?","By card, please. Do you know if there's a safe ATM on this block to withdraw cash right now?"],
    ["B","Sí, adentro del centro comercial de la esquina hay cajeros de todos los bancos; es mucho más seguro allá.","Yes, inside the mall on the corner there are ATMs for all banks; it's much safer in there."]
  ],[{es:"En el datáfono elija cuenta de ahorros o tarjeta de crédito.",en:"On the card terminal choose savings account or credit card.",tts:"En el datáfono elija cuenta de ahorros o tarjeta de crédito."},{es:"¿Me hace una recarga de veinte mil a este número de Claro?",en:"Can you do a 20,000-peso top-up to this Claro number?",tts:"¿Me hace una recarga de veinte mil a este número de Claro?"}]),
  v60Dialogue("Puentes festivos, salsa y rumba","Planning a long holiday weekend, dancing salsa, and toasting with friends",[
    ["A","¡Por fin viernes y con puente festivo! ¿Qué vas a hacer este puente, parce?","Finally Friday and with a long holiday weekend! What are you doing this long weekend, buddy?"],
    ["B","Esta noche vamos a rumbear a una salsoteca en el barrio, y mañana salimos temprano para un pueblito.","Tonight we're going out dancing at a salsa club in the neighborhood, and tomorrow we leave early for a small town."],
    ["A","¡Qué nota de plan! Yo quiero ir a la salsoteca, aunque todavía me cuesta un poquito el paso de salsa.","What a great plan! I want to go to the salsa club, even though the salsa step is still a little tough for me."],
    ["B","¡Tranquilo, hágale sin miedo! Allá todo el mundo es relajado y te enseñamos a llevar el ritmo.","Don't worry, go for it! Everyone there is laid-back and we'll teach you how to keep the beat."],
    ["A","¡De una! Entonces yo invito la primera ronda o una media de guaro para brindar.","I'm in! Then I'll buy the first round or a half-bottle of aguardiente to toast."],
    ["B","¡Listo, trato hecho! Pero tomamos juicio con agua para no amanecer con guayabo mañana.","Deal! But let's drink responsibly with water so we don't wake up with a hangover tomorrow."]
  ],[{es:"¡Salud! Que viva la música y los buenos amigos.",en:"Cheers! Long live music and good friends.",tts:"¡Salud! Que viva la música y los buenos amigos."},{es:"Para el guayabo no hay nada mejor que un caldo de costilla.",en:"For a hangover there's nothing better than a beef rib broth.",tts:"Para el guayabo no hay nada mejor que un caldo de costilla."}])
);

READINGS.push(
  {id:"lectura-citas-familia",level:"B1",title:"La calidez de las familias colombianas",lesson:"citas-familia",intro:"Learn how compliments, hospitality, and meeting the family work in Colombia.",lines:[
    {es:"En Colombia, cuando sales con alguien o haces buenos amigos, es muy común que te inviten a almorzar o a tomar las onces con la familia.",en:"In Colombia, when you date someone or make close friends, it's very common to be invited for lunch or afternoon coffee with the family.",tts:"En Colombia, cuando sales con alguien o haces buenos amigos, es muy común que te inviten a almorzar o a tomar las onces con la familia."},
    {es:"A los papás se les trata con mucho respeto usando don o doña con su nombre, como don Carlos o doña María.",en:"Parents are addressed with great respect using 'don' or 'doña' with their first name, like Don Carlos or Doña María.",tts:"A los papás se les trata con mucho respeto usando don o doña con su nombre, como don Carlos o doña María."},
    {es:"Elogiar la casa y la comida diciendo ¡qué casa tan acogedora! o ¡todo está delicioso! siempre deja una excelente impresión.",en:"Complimenting the home and food by saying 'what a welcoming house!' or 'everything is delicious!' always leaves a great impression.",tts:"Elogiar la casa y la comida diciendo ¡qué casa tan acogedora! o ¡todo está delicioso! siempre deja una excelente impresión."},
    {es:"Cuando alguien es amable y simpático en Colombia, decimos: esa persona es muy querida y me cayó súper bien.",en:"When someone is kind and likable in Colombia, we say: 'that person is very sweet (querida) and I really liked them (me cayó súper bien).'",tts:"Cuando alguien es amable y simpático en Colombia, decimos: esa persona es muy querida y me cayó súper bien."}
  ],questions:[{q:"¿Qué significa decir que alguien 'es muy querido/a' en Colombia?",choices:["Que es una persona muy amable, cálida y atenta","Que cuesta mucho dinero","Que vive muy lejos del centro"],answer:"Que es una persona muy amable, cálida y atenta"}]},
  {id:"lectura-corrientazo",level:"A2",title:"El arte de pedir un corrientazo",lesson:"almuerzo-corrientazo",intro:"Decode the 4 parts of Colombia's famous weekday lunch special.",lines:[
    {es:"Al mediodía en toda Colombia, el almuerzo del día se conoce con cariño como el corrientazo o el almuerzo ejecutivo.",en:"At noon all across Colombia, the daily lunch special is affectionately known as the 'corrientazo' or 'almuerzo ejecutivo'.",tts:"Al mediodía en toda Colombia, el almuerzo del día se conoce con cariño como el corrientazo o el almuerzo ejecutivo."},
    {es:"Primero eliges entre sopa o fruta; después eliges el principio, que puede ser frijoles, lentejas, garbanzos o tajadas.",en:"First you choose between soup or fruit; next you choose the 'principio' (side), which can be beans, lentils, chickpeas, or plantains.",tts:"Primero eliges entre sopa o fruta; después eliges el principio, que puede ser frijoles, lentejas, garbanzos o tajadas."},
    {es:"El plato fuerte viene con arroz, ensalada y una proteína como carne asada, pollo a la plancha o pescado.",en:"The main plate comes with rice, salad, and a protein like grilled beef, grilled chicken, or fish.",tts:"El plato fuerte viene con arroz, ensalada y una proteína como carne asada, pollo a la plancha o pescado."},
    {es:"Y la bebida que acompaña el almuerzo se llama la sobremesa, que casi siempre es jugo natural o limonada de panela.",en:"And the drink that comes with lunch is called the 'sobremesa', which is almost always fresh fruit juice or panela lemonade.",tts:"Y la bebida que acompaña el almuerzo se llama la sobremesa, que casi siempre es jugo natural o limonada de panela."}
  ],questions:[{q:"En un almuerzo colombiano, ¿qué es 'la sobremesa'?",choices:["La bebida que acompaña el almuerzo","La silla donde te sientas","La cuenta del restaurante"],answer:"La bebida que acompaña el almuerzo"}]},
  {id:"lectura-cajero-sim",level:"A2",title:"Cajeros, tarjetas y SIM card en Colombia",lesson:"cajero-sim-tramites",intro:"Practical tips for ATMs, prepaid phone lines, and ID numbers in Colombia.",lines:[
    {es:"Cuando necesitas sacar efectivo, lo más recomendable es usar un cajero automático dentro de un centro comercial o supermercado.",en:"When you need to withdraw cash, it is best to use an ATM inside a shopping mall or supermarket.",tts:"Cuando necesitas sacar efectivo, lo más recomendable es usar un cajero automático dentro de un centro comercial o supermercado."},
    {es:"Para tener internet en la calle desde el primer día, puedes comprar una SIM card prepago de Claro, Movistar o Tigo.",en:"To have mobile internet on the street from day one, you can buy a prepaid SIM card from Claro, Movistar, or Tigo.",tts:"Para tener internet en la calle desde el primer día, puedes comprar una SIM card prepago de Claro, Movistar o Tigo."},
    {es:"Solo necesitas tu pasaporte para registrar la línea y pedir una recarga o un paquete de datos en cualquier droguería o tienda.",en:"You only need your passport to register the line and ask for a top-up or data package at any pharmacy or shop.",tts:"Solo necesitas tu pasaporte para registrar la línea y pedir una recarga o un paquete de datos en cualquier droguería o tienda."},
    {es:"Y en las cajas siempre te van a pedir el número de cédula o pasaporte para el registro de la compra.",en:"And at checkout counters they will always ask for your ID or passport number to register the purchase.",tts:"Y en las cajas siempre te van a pedir el número de cédula o pasaporte para el registro de la compra."}
  ],questions:[{q:"¿Dónde es más seguro usar un cajero automático en las ciudades colombianas?",choices:["Dentro de un centro comercial o supermercado","En una esquina oscura a medianoche","En el bus intermunicipal"],answer:"Dentro de un centro comercial o supermercado"}]},
  {id:"lectura-puentes-rumba",level:"B1",title:"Puentes festivos, salsa y alegría",lesson:"puentes-rumba-cultura",intro:"Why Colombia is famous for its long holiday weekends and musical culture.",lines:[
    {es:"Colombia es uno de los países con más días festivos del mundo, y muchos se trasladan al lunes para formar un puente festivo.",en:"Colombia is one of the countries with the most public holidays in the world, and many move to Monday to create a long weekend ('puente festivo').",tts:"Colombia es uno de los países con más días festivos del mundo, y muchos se trasladan al lunes para formar un puente festivo."},
    {es:"Por eso desde el jueves la pregunta favorita en la oficina o con amigos es: ¿Qué vas a hacer este puente?",en:"That's why starting Thursday the favorite question at the office or with friends is: 'What are you doing this long weekend?'",tts:"Por eso desde el jueves la pregunta favorita en la oficina o con amigos es: ¿Qué vas a hacer este puente?"},
    {es:"En las noches de rumba nunca faltan la salsa caleña, el vallenato de la Costa, el merengue y el reggaetón de Medellín.",en:"On nights out dancing, Cali salsa, Caribbean vallenato, merengue, and Medellín reggaeton are always playing.",tts:"En las noches de rumba nunca faltan la salsa caleña, el vallenato de la Costa, el merengue y el reggaetón de Medellín."},
    {es:"Y si alguien amanece con guayabo al día siguiente, el remedio tradicional es un buen caldo de costilla o una changua.",en:"And if someone wakes up with a hangover the next day, the traditional cure is a good beef rib broth or 'changua'.",tts:"Y si alguien amanece con guayabo al día siguiente, el remedio tradicional es un buen caldo de costilla o una changua."}
  ],questions:[{q:"¿Qué es un 'puente festivo' en Colombia?",choices:["Un fin de semana largo con lunes festivo","Un puente peatonal sobre una autopista","Un plato típico con pescado"],answer:"Un fin de semana largo con lunes festivo"}]}
);

CONVERSATION_MISSIONS.push(
  {id:"mision-citas-familia",title:"Saluda a los papás y haz un cumplido natural",scenario:"You arrive at your Colombian partner's or friend's family home for afternoon coffee (las onces). Greet the parents warmly and compliment their home.",prompt:"Saluda a los papás con calidez:",lesson:"citas-familia",models:[
    {es:"Mucho gusto, don Hernán y doña Clara; me han hablado muchísimo de ustedes. ¡Qué casa tan acogedora tienen!",en:"Very nice to meet you, Mr. Hernán and Mrs. Clara; I've heard so much about you. What a welcoming home you have!",tts:"Mucho gusto, don Hernán y doña Clara; me han hablado muchísimo de ustedes. ¡Qué casa tan acogedora tienen!"},
    {es:"Muchas gracias por la invitación a tomar las onces; todo se ve delicioso.",en:"Thank you so much for the invitation for afternoon coffee; everything looks delicious.",tts:"Muchas gracias por la invitación a tomar las onces; todo se ve delicioso."}
  ]},
  {id:"mision-corrientazo",title:"Pide tu almuerzo ejecutivo completo",scenario:"The server asks what you want for your weekday lunch special (sopa o fruta, principio, proteína, and sobremesa).",prompt:"Haz tu pedido completo como un local:",lesson:"almuerzo-corrientazo",models:[
    {es:"Me regala el ejecutivo con sopa, de principio lentejas con tajadas, pechuga a la plancha y de sobremesa limonada natural.",en:"I'll have the lunch special with soup, lentils and plantains for the side, grilled chicken breast, and fresh lemonade for the drink.",tts:"Me regala el ejecutivo con sopa, de principio lentejas con tajadas, pechuga a la plancha y de sobremesa limonada natural."},
    {es:"¿Será que me puede cambiar el arroz por una porción extra de ensalada, por favor?",en:"Could you swap the rice for an extra portion of salad, please?",tts:"¿Será que me puede cambiar el arroz por una porción extra de ensalada, por favor?"}
  ]},
  {id:"mision-cajero-sim",title:"Compra una SIM card y pregunta por un cajero",scenario:"You are at a mobile shop. Ask to activate a prepaid SIM card with your passport, add a 30,000-peso top-up, and ask where a safe ATM is.",prompt:"Habla con el asesor de la tienda:",lesson:"cajero-sim-tramites",models:[
    {es:"Buenas tardes, ¿me colabora con una SIM card prepago y una recarga de treinta mil? Aquí tengo mi pasaporte.",en:"Good afternoon, could you help me with a prepaid SIM card and a 30,000-peso top-up? Here is my passport.",tts:"Buenas tardes, ¿me colabora con una SIM card prepago y una recarga de treinta mil? Aquí tengo mi pasaporte."},
    {es:"Disculpe, ¿dónde queda un cajero automático seguro por acá cerca para sacar efectivo?",en:"Excuse me, where is a safe ATM nearby to withdraw cash?",tts:"Disculpe, ¿dónde queda un cajero automático seguro por acá cerca para sacar efectivo?"}
  ]},
  {id:"mision-puentes-rumba",title:"Arma plan para el puente festivo y la salsoteca",scenario:"It's Friday before a three-day holiday weekend (puente festivo). Ask your friend about their weekend plans and invite them to dance salsa tonight.",prompt:"Cuadra el plan del puente con tu amigo:",lesson:"puentes-rumba-cultura",models:[
    {es:"¡Qué nota que este fin de semana es puente festivo! ¿Qué vas a hacer este puente? ¿Vamos hoy a una salsoteca?",en:"So awesome that this weekend is a holiday weekend! What are you doing this long weekend? Shall we go to a salsa club tonight?",tts:"¡Qué nota que este fin de semana es puente festivo! ¿Qué vas a hacer este puente? ¿Vamos hoy a una salsoteca?"},
    {es:"Yo apenas estoy aprendiendo a bailar salsa, pero allá le cogemos el ritmo y brindamos con los amigos.",en:"I'm just learning to dance salsa, but we'll catch the rhythm there and toast with friends.",tts:"Yo apenas estoy aprendiendo a bailar salsa, pero allá le cogemos el ritmo y brindamos con los amigos."}
  ]}
);

Object.assign(LESSON_CONTENT,{
  "citas-familia":{
    goal:{es:"Mucho gusto, me han hablado mucho de ustedes; ¡qué casa tan acogedora! Me cayeron súper bien.",en:"Nice to meet you, I've heard so much about you; what a welcoming home! I really liked them."},
    words:[{es:"te queda súper bien",en:"it looks great on you"},{es:"¿te gustaría salir?",en:"would you like to go out?"},{es:"me cayeron súper bien",en:"I really liked them"},{es:"una persona muy querida",en:"a very sweet / kind person"},{es:"acogedor / acogedora",en:"cozy / welcoming"},{es:"don / doña + nombre",en:"respectful title for parents/elders"}],
    phrases:[{en:"That color looks great on you!",es:"¡Ese color te queda súper bien!"},{en:"Would you like to go for a coffee on Friday?",es:"¿Te gustaría ir a tomar un café el viernes?"},{en:"What a welcoming home you have!",es:"¡Qué casa tan acogedora tienen!"},{en:"Your family is so sweet; I really liked them.",es:"Tu familia es muy querida; me cayeron súper bien."}]
  },
  "almuerzo-corrientazo":{
    goal:{es:"Me regala el ejecutivo con sopa, de principio frijoles, pechuga a la plancha y de sobremesa limonada.",en:"I'll have the lunch special with soup, beans for the side, grilled chicken, and lemonade to drink."},
    words:[{es:"el corrientazo / ejecutivo",en:"weekday daily lunch special"},{es:"el principio",en:"lunch side choice (beans/lentils/plantain)"},{es:"la sobremesa",en:"drink included with lunch"},{es:"a la plancha / asada",en:"grilled"},{es:"las onces / el algo",en:"afternoon coffee & snack"},{es:"el mecato",en:"snacks / treats between meals"}],
    phrases:[{en:"What comes with today's lunch special?",es:"¿Qué trae hoy el almuerzo ejecutivo?"},{en:"With soup and beans for the side, please.",es:"Con sopa y de principio frijoles, por favor."},{en:"What drink comes with lunch today?",es:"¿Qué hay de sobremesa hoy?"},{en:"Let's have afternoon coffee with pandebono.",es:"Vamos a tomar las onces con pandebono."}]
  },
  "cajero-sim-tramites":{
    goal:{es:"¿Me colabora con una recarga de treinta mil a Claro? ¿Y dónde hay un cajero automático seguro?",en:"Can you help me with a 30,000 top-up on Claro? And where is a safe ATM?"},
    words:[{es:"el cajero automático",en:"ATM"},{es:"ahorros o corriente",en:"savings or checking account"},{es:"una recarga",en:"prepaid phone top-up"},{es:"la cédula / el pasaporte",en:"Colombian ID / passport"},{es:"sacar efectivo",en:"to withdraw cash"},{es:"la fotocopia",en:"photocopy"}],
    phrases:[{en:"Where is a safe ATM nearby?",es:"¿Dónde queda un cajero automático seguro por acá?"},{en:"Can you do a 20,000-peso top-up to this number?",es:"¿Me hace una recarga de veinte mil a este número?"},{en:"Does my passport number work for you?",es:"¿Le sirve el número de mi pasaporte?"},{en:"Savings account, one installment, please.",es:"Cuenta de ahorros, a una sola cuota, por favor."}]
  },
  "puentes-rumba-cultura":{
    goal:{es:"¿Qué vas a hacer este puente festivo? Esta noche vamos a rumbear y a bailar salsa.",en:"What are you doing this long weekend? Tonight we're going out partying and dancing salsa."},
    words:[{es:"el puente festivo",en:"3-day holiday weekend"},{es:"rumbear / la rumba",en:"to party / nightlife"},{es:"la salsoteca",en:"salsa dance club"},{es:"una media de guaro",en:"half-bottle of aguardiente"},{es:"el guayabo",en:"hangover"},{es:"el caldo de costilla",en:"beef rib broth (hangover cure)"}],
    phrases:[{en:"What are you doing this long holiday weekend?",es:"¿Qué vas a hacer este puente festivo?"},{en:"On Saturday night we're going out to a salsa club.",es:"El sábado por la noche vamos a una salsoteca."},{en:"Teach me the basic salsa step!",es:"¡Enséñame el paso básico de salsa!"},{en:"I have a hangover; I need a rib broth.",es:"Tengo guayabo; necesito un caldo de costilla."}]
  }
});

Object.assign(LESSON_META,{
  "citas-familia":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Empatía, reacciones y amistad",dialogue:"Citas, cumplidos y conocer a la familia",vocab:"familia",quizCat:"citas-familia",quizMode:"conversation",guideIds:["gustar","usted-tu-vos"],readingId:"lectura-citas-familia",missionId:"mision-citas-familia"},
  "almuerzo-corrientazo":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Panadería, tinto y jugos",dialogue:"Almuerzo ejecutivo, corrientazo y onces",vocab:"comida",quizCat:"corrientazo",quizMode:"conversation",guideIds:["cortesia-colombiana","usted-tu-vos"],readingId:"lectura-corrientazo",missionId:"mision-corrientazo"},
  "cajero-sim-tramites":{stage:"Daily Life",difficulty:"Easy",prereq:"Nequi, datáfono y cuentas",dialogue:"Cajero automático, SIM card y trámites",vocab:"numeros",quizCat:"cajero-sim",quizMode:"conversation",guideIds:["cortesia-colombiana","por-para"],readingId:"lectura-cajero-sim",missionId:"mision-cajero-sim"},
  "puentes-rumba-cultura":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"En una fiesta",dialogue:"Puentes festivos, salsa y rumba",vocab:"colombianismos",quizCat:"puentes-rumba",quizMode:"conversation",guideIds:["futuro","gustar"],readingId:"lectura-puentes-rumba",missionId:"mision-puentes-rumba"}
});

Object.assign(SENTENCE_LADDERS,{
  "citas-familia":{
    title:"Give warm compliments, ask someone out, and greet Colombian parents",
    rungs:[
      {tag:"1. Anchor stem",es:"Me encanta hablar contigo.",en:"I love talking with you."},
      {tag:"2. + Invite out",es:"Me encanta hablar contigo; ¿salimos a tomar un café el viernes?",en:"I love talking with you; shall we go out for a coffee on Friday?"},
      {tag:"3. + Greet parents",es:"Mucho gusto, don Hernán y doña Clara; me han hablado muchísimo de ustedes.",en:"Very nice to meet you, Mr. Hernán and Mrs. Clara; I've heard so much about you."},
      {tag:"4. + Warm follow-up",es:"¡Qué casa tan acogedora tienen! Tus papás me cayeron súper bien; son unas personas muy queridas.",en:"What a welcoming home you have! I really liked your parents; they are such sweet people."}
    ],
    swaps:[
      {label:"Natural compliment",es:"¡Uy, esa chaqueta te queda súper bien!",en:"Wow, that jacket looks great on you!"},
      {label:"Get home safe",es:"Avísame por WhatsApp apenas llegues a la casa.",en:"Let me know on WhatsApp as soon as you get home."},
      {label:"Thank for food",es:"Muchas gracias por el almuerzo, doña Clara; le quedó delicioso.",en:"Thank you very much for lunch, Mrs. Clara; it turned out delicious."}
    ]
  },
  "almuerzo-corrientazo":{
    title:"Order a full Colombian 'almuerzo ejecutivo / corrientazo' without freezing",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Qué trae hoy el ejecutivo?",en:"What comes with today's lunch special?"},
      {tag:"2. + Sopa & principio",es:"Me regala el ejecutivo con sopa y de principio frijoles.",en:"I'll have the lunch special with soup and beans for the side."},
      {tag:"3. + Proteína",es:"Con sopa, de principio frijoles con tajadas, y la pechuga a la plancha.",en:"With soup, beans and plantains for the side, and the grilled chicken breast."},
      {tag:"4. + Sobremesa",es:"Buenas, veci, me regala el ejecutivo con sopa, frijoles, pechuga a la plancha y de sobremesa limonada de panela, por favor.",en:"Afternoon, neighbor, I'll have the lunch special with soup, beans, grilled chicken, and panela lemonade for the drink, please."}
    ],
    swaps:[
      {label:"Swap rice for salad",es:"¿Me cambia el arroz por más ensalada y aguacate, porfa?",en:"Can you swap the rice for more salad and avocado, please?"},
      {label:"Afternoon onces",es:"A las cuatro pasamos por unas onces con aguapanela y queso.",en:"At four let's stop by for afternoon coffee with aguapanela and cheese."},
      {label:"Fried fish option",es:"Hoy quiero la mojarra frita con patacones y sopa de pescado.",en:"Today I want the fried tilapia with patacones and fish soup."}
    ]
  },
  "cajero-sim-tramites":{
    title:"Activate a prepaid SIM, top up data, and use ATMs safely",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Me colabora con una recarga?",en:"Could you help me with a phone top-up?"},
      {tag:"2. + Carrier & amount",es:"Buenas, ¿me colabora con una recarga de treinta mil a Claro?",en:"Hi, could you help me with a 30,000-peso top-up to Claro?"},
      {tag:"3. + Passport ID",es:"No tengo cédula todavía, pero aquí tengo el número de mi pasaporte.",en:"I don't have a Colombian ID yet, but here is my passport number."},
      {tag:"4. + Safe ATM",es:"Muchas gracias; disculpe, ¿dónde queda un cajero automático seguro dentro de este centro comercial para sacar efectivo?",en:"Thank you very much; excuse me, where is a safe ATM inside this mall to withdraw cash?"}
    ],
    swaps:[
      {label:"Savings or checking",es:"En el datáfono es cuenta de ahorros a una sola cuota.",en:"On the card terminal it's savings account in one installment."},
      {label:"Prepaid SIM package",es:"¿Qué paquete prepago tiene con quince gigas por treinta días?",en:"What prepaid package do you have with 15 GB for 30 days?"},
      {label:"Photocopy / print",es:"¿Dónde puedo imprimir este documento y sacar una fotocopia?",en:"Where can I print this document and make a photocopy?"}
    ]
  },
  "puentes-rumba-cultura":{
    title:"Make long-weekend ('puente') plans and talk about salsa and nightlife",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Qué vas a hacer este puente?",en:"What are you doing this long weekend?"},
      {tag:"2. + Friday salsa plan",es:"¿Qué vas a hacer este puente festivo? ¿Vamos hoy a una salsoteca?",en:"What are you doing this long holiday weekend? Shall we go to a salsa club tonight?"},
      {tag:"3. + Learning to dance",es:"Todavía estoy aprendiendo a bailar salsa, pero si me enseñas el paso, yo le hago.",en:"I'm still learning to dance salsa, but if you teach me the step, I'll go for it."},
      {tag:"4. + Toast & hangover cure",es:"¡Salud por el puente festivo! Pero tomemos agua también para no amanecer mañana con guayabo.",en:"Cheers to the long weekend! But let's drink water too so we don't wake up with a hangover tomorrow."}
    ],
    swaps:[
      {label:"Order guaro",es:"¿Pedimos una media de guaro con agua y limón para la mesa?",en:"Shall we order a half-bottle of aguardiente with water and lime for the table?"},
      {label:"Hangover cure",es:"Para el guayabo vamos por un caldo de costilla bien caliente.",en:"For the hangover let's go get a piping hot beef rib broth."},
      {label:"Travel on puente",es:"En puente festivo toca salir temprano por el trancón en el peaje.",en:"On a holiday weekend you have to leave early because of traffic at the toll."}
    ]
  }
});

/* 3. 6 More High-Frequency Colombianismos (72 total) */
COLOMBIANISMOS.push(
  {word:"Corrientazo / Ejecutivo",en:"Colombian weekday daily lunch special",region:"all",register:"Colombian · food & daily life",registerGroup:"everyday",usage:"Includes sopa or fruta, principio (beans/lentils/plantain), arroz, ensalada, proteína, and sobremesa (juice/lemonade).",example:"Vamos a almorzar un corrientazo casero aquí a la vuelta.",tts:"Vamos a almorzar un corrientazo casero aquí a la vuelta."},
  {word:"Puente (festivo)",en:"Three-day holiday weekend (Monday off)",region:"all",register:"Colombian · culture",registerGroup:"everyday",usage:"Colombia moves most bank holidays to Mondays ('Ley Emiliani'), making '¿Qué vas a hacer este puente?' universal small talk.",example:"Este fin de semana hay puente festivo; vamos para Villa de Leyva.",tts:"Este fin de semana hay puente festivo; vamos para Villa de Leyva."},
  {word:"Caer bien / Ser muy querido",en:"To make a great impression / Be very sweet & kind",region:"all",register:"Colombian · social",registerGroup:"everyday",usage:"'Me cayó súper bien' means you really liked someone; 'es muy querido/a' means someone is warm and kind-hearted.",example:"Tus amigos me cayeron súper bien; son muy queridos.",tts:"Tus amigos me cayeron súper bien; son muy queridos."},
  {word:"Las onces / El algo / Mecato",en:"Afternoon coffee & snack (4–5 PM) / Treats",region:"all",register:"Colombian · food culture",registerGroup:"everyday",usage:"Called 'las onces' in Bogotá, 'el algo' in Medellín, and 'mecato' for snacks/pastries between meals.",example:"¿Tomamos las onces con un tintico y un pandebono?",tts:"¿Tomamos las onces con un tintico y un pandebono?"},
  {word:"Rumbear / La rumba",en:"To party / go out dancing",region:"all",register:"Colombian · nightlife",registerGroup:"informal",usage:"In Colombia, 'ir de rumba' or 'rumbear' always centers on dancing (salsa, vallenato, merengue, reggaetón) with friends.",example:"El viernes por la noche vamos a rumbear en Provenza.",tts:"El viernes por la noche vamos a rumbear en Provenza."},
  {word:"Guaro (Aguardiente)",en:"Anise-flavored Colombian spirit for toasting",region:"all",register:"Colombian · nightlife",registerGroup:"informal",usage:"Ordered by the bottle or half-bottle ('una media de guaro') and shared in small shot glasses at parties and concerts.",example:"Pidamos una media de guaro sin azúcar para brindar.",tts:"Pidamos una media de guaro sin azúcar para brindar."}
);

/* 4. 11th 3-Column Slot-Swapper Matrix: Citas, Cumplidos & Familia */
SLOT_SWAP_MATRICES.push(
  {
    id:"citas-familia-matrix",
    title:"❤️ Citas, Cumplidos & Familia",
    sub:"Give warm compliments, invite someone out naturally, and connect with Colombian families",
    col1Title:"1. Warm Opener",
    col2Title:"2. Invitation or Compliment",
    col3Title:"3. Friendly Close",
    col1:[
      {es:"Me encanta conversar contigo y quería saber si",en:"I love talking with you and wanted to see if"},
      {es:"Mucho gusto en conocerlos; me alegra mucho que",en:"So nice to meet you all; I'm really glad that"},
      {es:"¡Qué alegría verte hoy! Te quería decir que",en:"So great to see you today! I wanted to tell you that"},
      {es:"Muchas gracias por la invitación a su casa;",en:"Thank you so much for the invitation to your home;"}
    ],
    col2:[
      {es:"te gustaría salir a tomar un café o a cenar",en:"you'd like to go out for a coffee or dinner"},
      {es:"podamos compartir este almuerzo en familia",en:"we can share this lunch together as a family"},
      {es:"ese estilo te queda súper bien y me caes genial",en:"that style looks great on you and I really like your vibe"},
      {es:"tienen un hogar súper acogedor y todo está delicioso",en:"you have such a welcoming home and everything is delicious"}
    ],
    col3:[
      {es:"este viernes por la noche.",en:"this Friday evening."},
      {es:"porque son unas personas muy queridas.",en:"because you are such sweet, kind people."},
      {es:"cuando tengas un ratico libre.",en:"whenever you have a little free time."},
      {es:"y me sentí como en mi propia casa.",en:"and I felt right at home."}
    ]
  }
);

/* 5. New Quiz Items for v95 Scenarios (Citas/Familia, Corrientazo, Cajero/SIM, Puentes/Rumba) */
V60_CONVERSATION_QUIZ.push(
  {kind:"reply",focus:"present",cat:"citas-familia",es:"Adelante, bienvenido a la casa; te presento a mis papás, don Hernán y doña Clara.",en:"Mucho gusto, don Hernán y doña Clara; ¡qué casa tan acogedora tienen!",tts:"Adelante, bienvenido a la casa; te presento a mis papás, don Hernán y doña Clara.",choices:["Mucho gusto, don Hernán y doña Clara; ¡qué casa tan acogedora tienen!","Cuenta de ahorros a una sola cuota, por favor.","¿Por cuál plataforma sale el bus para Medellín?","Se dañó la lavadora y está botando agua."]},
  {kind:"meaning",focus:"past",cat:"citas-familia",es:"Tus papás me cayeron súper bien; son unas personas muy queridas.",en:"I really liked your parents; they are such sweet/kind people.",tts:"Tus papás me cayeron súper bien; son unas personas muy queridas.",choices:["I really liked your parents; they are such sweet/kind people.","Your parents live two blocks north of the traffic light.","I sent your parents a PDF on WhatsApp.","Your parents asked for a half-bottle of aguardiente."]},
  {kind:"reply",focus:"present",cat:"corrientazo",es:"Buenas tardes, ¿con sopa o fruta? ¿Y qué principio le pongo al ejecutivo?",en:"Con sopa, por favor, y de principio frijoles con tajadas de maduro.",tts:"Buenas tardes, ¿con sopa o fruta? ¿Y qué principio le pongo al ejecutivo?",choices:["Con sopa, por favor, y de principio frijoles con tajadas de maduro.","Con la máquina número dos a los lados.","No soy alérgico a ningún medicamento.","Aquí tiene mi pasaporte para registrar la línea."]},
  {kind:"meaning",focus:"present",cat:"corrientazo",es:"¿Qué hay de sobremesa hoy en el almuerzo ejecutivo?",en:"What drink comes with the lunch special today?",tts:"¿Qué hay de sobremesa hoy en el almuerzo ejecutivo?",choices:["What drink comes with the lunch special today?","How much is the monthly HOA fee?","Where is the baggage claim carousel?","How many sets do you have left on this machine?"]},
  {kind:"reply",focus:"present",cat:"cajero-sim",es:"Para registrar la SIM card prepago necesito su número de cédula, por favor.",en:"Todavía no tengo cédula colombiana; ¿le sirve el número de mi pasaporte?",tts:"Para registrar la SIM card prepago necesito su número de cédula, por favor.",choices:["Todavía no tengo cédula colombiana; ¿le sirve el número de mi pasaporte?","En leche y bajito de azúcar, por favor.","De principio me regala lentejas.","Vamos suave para que no nos dé soroche."]},
  {kind:"meaning",focus:"present",cat:"cajero-sim",es:"¿Me colabora con una recarga de treinta mil pesos a este número de Claro?",en:"Could you help me with a 30,000-peso top-up to this Claro number?",tts:"¿Me colabora con una recarga de treinta mil pesos a este número de Claro?",choices:["Could you help me with a 30,000-peso top-up to this Claro number?","Can you watch my suitcase while I use the restroom?","Is the water heater gas or electric?","Would you like soup or fruit with your lunch?"]},
  {kind:"reply",focus:"future",cat:"puentes-rumba",es:"¡Por fin viernes! ¿Qué planes tienes para este puente festivo?",en:"Hoy vamos a una salsoteca y mañana salimos temprano para un pueblito.",tts:"¡Por fin viernes! ¿Qué planes tienes para este puente festivo?",choices:["Hoy vamos a una salsoteca y mañana salimos temprano para un pueblito.","Una tableta cada ocho horas después de comer.","Consumidor final sin factura electrónica.","Suba tres cuadras hacia los cerros."]},
  {kind:"meaning",focus:"present",cat:"puentes-rumba",es:"¡Uy, qué guayabo tengo hoy! Vamos por un caldo de costilla.",en:"Oof, what a hangover I have today! Let's go get a beef rib broth.",tts:"¡Uy, qué guayabo tengo hoy! Vamos por un caldo de costilla.",choices:["Oof, what a hangover I have today! Let's go get a beef rib broth.","It's raining hard; let's wait under the roof until it lets up.","The ATM inside the shopping mall is much safer.","Can you swap the rice for more salad, please?"]}
);

V60_FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"past",cat:"citas-familia",es:"Tus amigos me ___ súper bien; son unas personas muy queridas.",en:"cayeron",tts:"Tus amigos me cayeron súper bien; son unas personas muy queridas.",trans:"I really liked your friends; they are such sweet people.",choices:["cayeron","cobraron","aterrizaron","alquilaron"]},
  {kind:"blank",focus:"present",cat:"corrientazo",es:"En el almuerzo ejecutivo, ¿qué desea tomar de ___: limonada o jugo de mora?",en:"sobremesa",tts:"En el almuerzo ejecutivo, ¿qué desea tomar de sobremesa: limonada o jugo de mora?",trans:"With the lunch special, what would you like to drink: lemonade or blackberry juice?",choices:["sobremesa","portería","cuadra","cédula"]},
  {kind:"blank",focus:"present",cat:"corrientazo",es:"A las cuatro de la tarde vamos a la panadería a tomar las ___ con tintico.",en:"onces",tts:"A las cuatro de la tarde vamos a la panadería a tomar las onces con tintico.",trans:"At four in the afternoon let's go to the bakery for afternoon coffee/snack.",choices:["onces","cuotas","series","maletas"]},
  {kind:"blank",focus:"present",cat:"cajero-sim",es:"¿Me hace una ___ de veinte mil pesos para tener datos en el celular?",en:"recarga",tts:"¿Me hace una recarga de veinte mil pesos para tener datos en el celular?",trans:"Can you do a 20,000-peso top-up so I have data on my phone?",choices:["recarga","almojábana","quebrada","salsoteca"]},
  {kind:"blank",focus:"future",cat:"puentes-rumba",es:"Como el lunes es festivo, este ___ vamos a viajar a la finca.",en:"puente",tts:"Como el lunes es festivo, este puente vamos a viajar a la finca.",trans:"Since Monday is a holiday, this long weekend we're traveling to the country house.",choices:["puente","cajero","datáfono","calentador"]},
  {kind:"blank",focus:"present",cat:"puentes-rumba",es:"El sábado por la noche vamos a ___ a una salsoteca muy buena.",en:"rumbear",tts:"El sábado por la noche vamos a rumbear a una salsoteca muy buena.",trans:"On Saturday night we're going out partying/dancing at a great salsa club.",choices:["rumbear","escampar","facturar","madrugar"]}
);
// ── V96.0 COLOMBIAN SPEAKING MASTERY (NT HEAVY + BATCH JOBS EXPANSION) ──────
/* 1. Interactive "Choose Your Reply" Branching Roleplays (authored by NT Heavy)
   2. Street-Speed Contractions & Ear Linker ("Cómo suena en la calle", authored by NT Heavy)
   3. Trampas Colombianas — 12 Colombian False Friends & Listening Traps (via /ai/v1/jobs batch)
   4. 4 New Real-World Colombian Scenarios (Lessons 65–68, Dialogues 55–58):
      - Trampas colombianas: cancelar, provocar y qué pena
      - Estratos, conjuntos cerrados y barrios
      - Odontología, óptica y medicina prepagada (EPS)
      - Migración Colombia, cédula de extranjería y bancos */

const BRANCHING_ROLEPLAYS = [
  {
    "id": "rp-uber",
    "title": "🚕 Uber en la portería",
    "sub": "Find your driver outside a residential building and confirm the ride.",
    "turns": [
      {
        "npcEs": "Hola, soy su conductor. Estoy frente a la portería. ¿Ya va a bajar?",
        "npcEn": "Hi, I'm your driver. I'm in front of the building's security entrance. Are you coming down?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Sí, señor. Ya bajo. ¿Me espera un momentico, por favor?",
            "en": "Yes, sir. I'm coming down. Could you wait just a moment, please?",
            "replyEs": "Claro, con mucho gusto. Aquí lo espero.",
            "replyEn": "Of course, happy to. I'll wait here.",
            "coach": "Using usted and momentico makes a brief request sound respectful and warm."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Listo! Ya voy bajando. Regáleme un minutico.",
            "en": "Great! I'm heading down now. Give me just a minute.",
            "replyEs": "De una, aquí estoy pendiente.",
            "replyEn": "Sure thing, I'll keep an eye out here.",
            "coach": "Regáleme un minutico is a common Colombian way to ask for a little time; it is not a request for a gift."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "¿Está en la entrada principal o en la de visitantes?",
            "en": "Are you at the main entrance or the visitors' entrance?",
            "replyEs": "En la de visitantes, al lado de la talanquera.",
            "replyEn": "At the visitors' entrance, next to the vehicle barrier.",
            "coach": "Buildings may have several entrances, and talanquera commonly refers to a vehicle access barrier."
          }
        ]
      },
      {
        "npcEs": "¿Va para la carrera quince con calle ochenta y cinco?",
        "npcEn": "Are you going to Carrera 15 at Calle 85?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Sí, esa es la dirección. ¿Me confirma la placa antes de subir, por favor?",
            "en": "Yes, that's the address. Could you confirm the license plate before I get in, please?",
            "replyEs": "Claro, termina en cuatro, siete, dos. Revise que coincida con la aplicación.",
            "replyEn": "Of course, it ends in four, seven, two. Check that it matches the app.",
            "coach": "Confirming the plate is a practical safety step, and me confirma sounds courteous."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "Sí, ahí es. Ya reviso la placa y me subo.",
            "en": "Yes, that's the place. I'll check the plate and get in.",
            "replyEs": "Listo, sin afán. Aquí lo espero.",
            "replyEn": "All right, no rush. I'll wait here.",
            "coach": "Ahí es and listo are natural everyday confirmations; sin afán means there is no need to hurry."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Sí, pero la entrada queda por la ochenta y cinco. ¿Podemos llegar por ese lado?",
            "en": "Yes, but the entrance is on 85th Street. Can we arrive on that side?",
            "replyEs": "Claro, si la vía lo permite, lo dejo por esa entrada.",
            "replyEn": "Of course, if the road allows it, I'll drop you at that entrance.",
            "coach": "Once the street type is clear, locals often shorten calle ochenta y cinco to la ochenta y cinco."
          }
        ]
      }
    ]
  },
  {
    "id": "rp-panaderia",
    "title": "🥐 Pan calientico en la panadería",
    "sub": "Order fresh warm bread and juice at a neighborhood bakery.",
    "turns": [
      {
        "npcEs": "¡Buenas! Acaba de salir el pan del horno. ¿Qué le provoca?",
        "npcEn": "Hello! The bread just came out of the oven. What sounds good?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Buenos días. ¿Me hace el favor de darme dos panes de queso calienticos?",
            "en": "Good morning. Could you please give me two warm cheese breads?",
            "replyEs": "Con mucho gusto. Estos están recién salidos.",
            "replyEn": "With pleasure. These just came out.",
            "coach": "¿Me hace el favor de…? is a familiar Colombian service request, and calienticos adds warmth to the interaction."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Uy, qué rico huele! Regáleme dos panes de queso de esos calienticos.",
            "en": "Wow, that smells delicious! Could I get two of those warm cheese breads?",
            "replyEs": "¡Claro! Le escojo dos bien fresquitos.",
            "replyEn": "Of course! I'll pick out two really fresh ones for you.",
            "coach": "Regáleme commonly means 'I'd like' when ordering in Colombia; you are still expected to pay."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "¿Cuáles están recién hechos? Quisiera algo con queso.",
            "en": "Which ones are freshly made? I'd like something with cheese.",
            "replyEs": "Los panes de queso y las almojábanas acaban de salir.",
            "replyEn": "The cheese breads and almojábanas just came out.",
            "coach": "Asking what is recién hecho helps you find the freshest batch without needing to know every bread name."
          }
        ]
      },
      {
        "npcEs": "¿Y para tomar? Hay jugo de naranja y de mora. ¿Es para acá o para llevar?",
        "npcEn": "And to drink? We have orange juice and blackberry juice. Is it for here or to go?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Un jugo de naranja, por favor. Para tomar acá. ¿Me lo puede servir sin hielo?",
            "en": "An orange juice, please. To have here. Could you serve it without ice?",
            "replyEs": "Sí, claro. Se lo llevo a la mesa sin hielo.",
            "replyEn": "Yes, of course. I'll bring it to your table without ice.",
            "coach": "Para tomar acá clearly identifies dine-in service, and me lo puede… politely introduces a preference."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "Uno de mora en agua, porfa, y todo para llevar.",
            "en": "A blackberry juice made with water, please, and everything to go.",
            "replyEs": "Listo, ya le empaco el pan y le preparo el juguito.",
            "replyEn": "Sure, I'll pack your bread and make your juice.",
            "coach": "Many Colombian fruit juices can be made en agua or en leche; porfa is a friendly informal 'please.'"
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Para llevar. ¿El de mora lo preparan al momento? ¿Puede ser sin azúcar?",
            "en": "To go. Do you make the blackberry juice to order? Can it be without sugar?",
            "replyEs": "Sí, lo preparamos al momento y se lo hacemos sin azúcar.",
            "replyEn": "Yes, we make it to order, and we can make yours without sugar.",
            "coach": "Checking whether juice is made al momento helps you find out whether sweetness can be adjusted."
          }
        ]
      }
    ]
  },
  {
    "id": "rp-airbnb",
    "title": "🔑 Llegada al apartamento",
    "sub": "Check into your rental and ask how the building and utilities work.",
    "turns": [
      {
        "npcEs": "Bienvenido. Para registrarlo en portería, ¿me muestra su documento, por favor?",
        "npcEn": "Welcome. To register you with building security, could you show me your ID, please?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Claro, aquí tiene mi pasaporte. ¿Necesita algo más para el registro?",
            "en": "Of course, here's my passport. Do you need anything else for registration?",
            "replyEs": "Gracias. Solo confirmar su nombre y las fechas de la reserva.",
            "replyEn": "Thank you. I just need to confirm your name and reservation dates.",
            "coach": "Aquí tiene is a respectful way to hand someone a document without sounding stiff."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Claro que sí! Ya se lo muestro. ¿Con eso quedamos listos?",
            "en": "Absolutely! I'll show it to you now. Does that take care of everything?",
            "replyEs": "Sí, con eso queda registrado. Ya le entrego las llaves.",
            "replyEn": "Yes, that gets you registered. I'll give you the keys now.",
            "coach": "¿Con eso quedamos listos? is a friendly way to check whether a practical task is complete."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Claro. Antes de subir, ¿me explica cómo entro si regreso tarde?",
            "en": "Of course. Before I go up, could you explain how to get in if I return late?",
            "replyEs": "Hay portero las veinticuatro horas. Le dice su nombre y el número del apartamento.",
            "replyEn": "There's a security attendant around the clock. Tell them your name and apartment number.",
            "coach": "Ask about the actual entry procedure rather than assuming every building uses a keypad or self-check-in."
          }
        ]
      },
      {
        "npcEs": "Esta es la clave del wifi. Los servicios están incluidos. ¿Tiene alguna pregunta?",
        "npcEn": "Here's the Wi-Fi password. Utilities are included. Do you have any questions?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Muchas gracias. ¿Me explica cómo funciona el agua caliente y dónde se saca la basura?",
            "en": "Thank you very much. Could you explain how the hot water works and where to take the trash?",
            "replyEs": "Claro. La ducha tiene calentador a gas y el cuarto de basuras está en el sótano.",
            "replyEn": "Of course. The shower has a gas water heater, and the trash room is in the basement.",
            "coach": "Los servicios often means utilities in housing contexts; asking about hot water is useful because systems vary."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Buenísimo! ¿Y si se va la luz o falla el internet, a quién le escribo?",
            "en": "Great! And if the power goes out or the internet stops working, who should I message?",
            "replyEs": "Me escribe por la aplicación y yo le ayudo.",
            "replyEn": "Message me through the app, and I'll help you.",
            "coach": "Se va la luz is the everyday expression for a power outage, and escribirle a alguien can mean messaging them."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Cuando dice servicios incluidos, ¿se refiere al agua, la luz, el gas y el internet?",
            "en": "When you say utilities are included, do you mean water, electricity, gas, and internet?",
            "replyEs": "Sí, esos cuatro están incluidos. El aseo adicional se cobra aparte.",
            "replyEn": "Yes, those four are included. Extra cleaning is charged separately.",
            "coach": "Listing each service avoids ambiguity; aseo can refer to cleaning rather than a utility."
          }
        ]
      }
    ]
  },
  {
    "id": "rp-cuenta",
    "title": "💳 La cuenta: datáfono o Nequi",
    "sub": "Handle the optional service charge and pay by card or Nequi.",
    "turns": [
      {
        "npcEs": "Aquí tiene la cuenta. ¿Desea incluir el diez por ciento de servicio voluntario?",
        "npcEn": "Here's your bill. Would you like to include the voluntary ten percent service charge?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Sí, por favor, inclúyalo. ¿Me trae el datáfono?",
            "en": "Yes, please include it. Could you bring me the card terminal?",
            "replyEs": "Con mucho gusto. Ya se lo traigo.",
            "replyEn": "With pleasure. I'll bring it right over.",
            "coach": "Datáfono is the usual Colombian word for a card terminal; the suggested service charge is voluntary."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "Sí, de una, con el servicio. ¿Reciben Nequi?",
            "en": "Yes, absolutely, include the service charge. Do you take Nequi?",
            "replyEs": "Sí, claro. Puede pagar por Nequi o con tarjeta.",
            "replyEn": "Yes, of course. You can pay with Nequi or by card.",
            "coach": "De una gives an upbeat confirmation, while ¿reciben Nequi? checks whether the restaurant accepts that payment method."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Por ahora, sin el servicio, por favor. ¿Me confirma el total?",
            "en": "Without the service charge for now, please. Could you confirm the total?",
            "replyEs": "Claro, no hay problema. Sin servicio son sesenta mil pesos.",
            "replyEn": "Of course, no problem. Without the service charge, it's sixty thousand pesos.",
            "coach": "You can decline a voluntary service charge politely without giving a justification."
          }
        ]
      },
      {
        "npcEs": "Si paga con tarjeta de crédito, ¿a cuántas cuotas? Si prefiere Nequi, le muestro el QR.",
        "npcEn": "If you're paying by credit card, how many installments? If you prefer Nequi, I'll show you the QR code.",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Con tarjeta de crédito, a una cuota, por favor. ¿Me permite revisar el valor?",
            "en": "By credit card, in one installment, please. May I check the amount?",
            "replyEs": "Claro. Aquí puede ver el total antes de pagar.",
            "replyEn": "Of course. You can see the total here before paying.",
            "coach": "A una cuota requests a single installment; interest and foreign-card handling depend on your issuer and the terminal."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "Por Nequi, de una. Muéstreme el QR y ya le confirmo.",
            "en": "Nequi it is. Show me the QR code, and I'll confirm once it's sent.",
            "replyEs": "Listo, aquí está. Verifique el nombre del negocio antes de confirmar.",
            "replyEn": "Great, here it is. Check the business name before confirming.",
            "coach": "This suits someone with an active Nequi account; verify the recipient and amount before sending."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Mi tarjeta es extranjera. ¿Podemos intentar a una cuota?",
            "en": "My card is foreign. Can we try one installment?",
            "replyEs": "Claro, intentemos. Si no aparece esa opción, revisamos qué permite el datáfono.",
            "replyEn": "Of course, let's try. If that option doesn't appear, we'll check what the terminal allows.",
            "coach": "Foreign cards may not support local installment options, so asking to try avoids assuming they will."
          }
        ]
      }
    ]
  },
  {
    "id": "rp-familia",
    "title": "☕ Onces con la familia",
    "sub": "Meet your Colombian partner's parents over afternoon drinks and snacks.",
    "turns": [
      {
        "npcEs": "¡Qué gusto conocerle! Siga, está en su casa. ¿Le provoca un tintico o un chocolate para las onces?",
        "npcEn": "It's lovely to meet you! Come in, make yourself at home. Would you like a black coffee or hot chocolate for our afternoon snack?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Mucho gusto. Muchas gracias por recibirme. Un chocolate estaría perfecto, si es tan amable.",
            "en": "It's a pleasure to meet you. Thank you so much for having me. A hot chocolate would be perfect, if you don't mind.",
            "replyEs": "Con mucho gusto. Ya se lo sirvo con una almojábana.",
            "replyEn": "With pleasure. I'll serve it with an almojábana.",
            "coach": "Thanking your hosts and starting with usted is a respectful default; follow their lead if they prefer another form."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Qué gusto! Gracias por invitarme. Un tintico me cae de maravilla.",
            "en": "So nice to meet you! Thanks for inviting me. A little black coffee sounds wonderful.",
            "replyEs": "¡Claro que sí! Siéntese, que ya sale el café.",
            "replyEn": "Absolutely! Have a seat; the coffee will be ready in a moment.",
            "coach": "In Colombia, a tinto is black coffee, not red wine; tintico makes the offer or request sound affectionate."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Muchas gracias. No tomo café; ¿será que me puede dar una aromática?",
            "en": "Thank you very much. I don't drink coffee; could I have an herbal tea?",
            "replyEs": "Por supuesto. Tengo de hierbabuena y de manzanilla.",
            "replyEn": "Of course. I have mint and chamomile.",
            "coach": "¿Será que…? softens a request, and an aromática is an herbal or fruit infusion."
          }
        ]
      },
      {
        "npcEs": "Cuéntenos, ¿cómo se han sentido en Colombia? ¿Ya han podido pasear un poquito?",
        "npcEn": "Tell us, how have you both been finding Colombia? Have you had a chance to explore a little?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Nos hemos sentido muy bien, gracias. ¿Usted qué lugar nos recomendaría conocer?",
            "en": "We've felt very welcome, thank you. What place would you recommend we visit?",
            "replyEs": "Les recomendaría Villa de Leyva. Es muy bonito para ir con tiempo.",
            "replyEn": "I'd recommend Villa de Leyva. It's lovely if you have time to explore.",
            "coach": "A sincere answer followed by a question invites your host into the conversation without requiring exaggerated praise."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Muy rico todo! Hemos paseado poquito, pero ahí vamos. ¿Qué plan nos recomiendan?",
            "en": "It's all been lovely! We haven't explored much yet, but we're getting there. What outing would you recommend?",
            "replyEs": "Un paseo por un pueblito les puede gustar. Les mostramos unas fotos.",
            "replyEn": "You might enjoy visiting a small town. We'll show you some photos.",
            "coach": "Rico can describe a pleasant experience, not just food; un plan can mean an outing or activity."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Todavía estamos conociendo. Y ustedes, ¿siempre han vivido en esta ciudad?",
            "en": "We're still getting to know the place. And have you always lived in this city?",
            "replyEs": "No, somos de Boyacá, pero llevamos muchos años acá.",
            "replyEn": "No, we're from Boyacá, but we've lived here for many years.",
            "coach": "A gentle question about their background keeps the exchange reciprocal without making assumptions about their hometown."
          }
        ]
      }
    ]
  },
  {
    "id": "rp-puente",
    "title": "💃 Viernes de puente y salsoteca",
    "sub": "Make Friday dance plans and coordinate a holiday-weekend outing.",
    "turns": [
      {
        "npcEs": "¿Qué va a hacer este viernes? Como el lunes es festivo, tenemos puente. ¿Se anima a ir a una salsoteca?",
        "npcEn": "What are you doing this Friday? Since Monday is a public holiday, we have a long weekend. Are you up for going to a salsa club?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Sí, muchas gracias por invitarme. ¿A qué hora le parece que nos encontremos?",
            "en": "Yes, thank you very much for inviting me. What time would you like us to meet?",
            "replyEs": "A las ocho y media estaría bien, así llegamos temprano.",
            "replyEn": "Eight thirty would be good, so we get there early.",
            "coach": "Usted can be friendly as well as formal in Colombia; its use among friends varies by region and person."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡De una, me le mido! Hace rato quiero salir a bailar.",
            "en": "Absolutely, I'm in! I've been wanting to go dancing for a while.",
            "replyEs": "¡Eso! Entonces vamos armando el parche.",
            "replyEn": "That's the spirit! Let's start getting the group together.",
            "coach": "Me le mido means you're willing to give something a go; el parche can refer to the group you're hanging out with."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Me suena, pero bailo poquito. ¿El lugar sirve para principiantes?",
            "en": "Sounds good, but I don't dance much. Is the place suitable for beginners?",
            "replyEs": "Sí, vamos a pasarla bueno. No tiene que ser experto.",
            "replyEn": "Yes, we're going to have a good time. You don't have to be an expert.",
            "coach": "Me suena expresses interest without fully committing, and bailo poquito modestly signals your comfort level."
          }
        ]
      },
      {
        "npcEs": "Entonces, ¿nos vemos allá el viernes? Y para el puente, ¿armamos un paseo el domingo?",
        "npcEn": "So, shall we meet there on Friday? And for the long weekend, shall we plan an outing on Sunday?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Me parece muy bien. ¿Me comparte la ubicación y me cuenta cuánto debemos presupuestar para cada plan?",
            "en": "That sounds very good. Could you send me the location and tell me how much we should budget for each outing?",
            "replyEs": "Claro. Le mando la ubicación y averiguo el cover y los gastos del paseo.",
            "replyEn": "Of course. I'll send you the location and check the club's cover charge and the outing costs.",
            "coach": "Asking about the budget is practical; cover is commonly used for a venue's entrance charge."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Listo! Nos pillamos allá el viernes, y el domingo salimos tempranito para evitar el trancón.",
            "en": "Great! See you there Friday, and on Sunday we'll leave nice and early to avoid traffic.",
            "replyEs": "De una. Armamos un grupo y cuadramos quién lleva carro.",
            "replyEn": "Absolutely. We'll make a group chat and work out who's driving.",
            "coach": "Nos pillamos is an informal 'see you,' cuadrar means to arrange, and trancón means a traffic jam."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "El viernes sí puedo; lo del domingo se lo confirmo mañana. ¿Hay que reservar en la salsoteca?",
            "en": "I can do Friday; I'll confirm Sunday tomorrow. Do we need a reservation at the salsa club?",
            "replyEs": "Perfecto. Para el viernes voy a preguntar si necesitamos reserva.",
            "replyEn": "Perfect. I'll ask whether we need a reservation for Friday.",
            "coach": "Confirming one plan while leaving another pending sets a clear boundary without sounding dismissive."
          }
        ]
      }
    ]
  }
];

const STREET_EAR_LINKER = [
  {
    "id": "ear1",
    "context": "🚕 Asking where someone is going",
    "carefulEs": "¿Para dónde va?",
    "streetEs": "¿Pa' dónde va?",
    "phoneticHint": "pah DOHN-deh bah",
    "en": "Where are you going?",
    "tip": "In casual Colombian speech, para often becomes pa'; this is an informal reduction, not a requirement."
  },
  {
    "id": "ear2",
    "context": "🥐 Taking a bakery order to go",
    "carefulEs": "Para llevar, por favor.",
    "streetEs": "Pa' llevar, por favor.",
    "phoneticHint": "pah yeh-BAHR por fah-BOHR",
    "en": "To go, please.",
    "tip": "The reduced pa' links directly into llevar, while por favor can remain fully pronounced."
  },
  {
    "id": "ear3",
    "context": "🚪 Saying you are on your way out",
    "carefulEs": "Ya voy a salir.",
    "streetEs": "Ya voya salir.",
    "phoneticHint": "yah BOY-ah sah-LEER",
    "en": "I'm about to head out.",
    "tip": "Voy a flows together as voya in connected speech; the sound-spelling here is a listening aid, not standard writing."
  },
  {
    "id": "ear4",
    "context": "🔑 Finding out whether someone has arrived",
    "carefulEs": "¿Está en la portería?",
    "streetEs": "¿Estáen la portería?",
    "phoneticHint": "eh-STAH-ehn lah por-teh-REE-ah",
    "en": "Are you at the building's security entrance?",
    "tip": "The vowels at the está en boundary connect smoothly without the pause that written spaces might suggest."
  },
  {
    "id": "ear5",
    "context": "☕ Accepting a coffee",
    "carefulEs": "Me da un tinto, por favor.",
    "streetEs": "Me daun tinto, por favor.",
    "phoneticHint": "meh dah-oon TEEN-toh por fah-BOHR",
    "en": "A black coffee, please.",
    "tip": "Da un often runs together in one rhythmic stretch, with both vowel qualities still potentially audible."
  },
  {
    "id": "ear6",
    "context": "💳 Choosing a single credit-card installment",
    "carefulEs": "A una cuota, por favor.",
    "streetEs": "Auna cuota, por favor.",
    "phoneticHint": "ah-OO-nah KWOH-tah por fah-BOHR",
    "en": "In one installment, please.",
    "tip": "A una links without a break, making the payment phrase sound like one short unit."
  },
  {
    "id": "ear7",
    "context": "🍽️ Asking for the bill",
    "carefulEs": "¿Me trae la cuenta, por favor?",
    "streetEs": "¿Me trae la cuenta, porfa?",
    "phoneticHint": "meh TRAH-eh lah KWEHN-tah POR-fah",
    "en": "Could you bring me the bill, please?",
    "tip": "Porfa is a common informal shortening of por favor in Colombia and elsewhere in the Spanish-speaking world."
  },
  {
    "id": "ear8",
    "context": "👨‍👩‍👧 Explaining who you are meeting",
    "carefulEs": "Voy con mis amigos.",
    "streetEs": "Voy con mi-samigos.",
    "phoneticHint": "boy kohn mee-sah-MEE-gohs",
    "en": "I'm going with my friends.",
    "tip": "When retained, the final s in mis links to the following vowel in amigos; s pronunciation varies across Colombian regions."
  },
  {
    "id": "ear9",
    "context": "💃 Suggesting dancing",
    "carefulEs": "Vamos a bailar.",
    "streetEs": "Vamo-sa bailar.",
    "phoneticHint": "BAH-moh-sah bai-LAHR",
    "en": "Let's go dancing.",
    "tip": "With the s retained, vamos a is heard as va-mo-sa because the final consonant links to the next vowel."
  },
  {
    "id": "ear10",
    "context": "📍 Saying you are outside",
    "carefulEs": "Estoy en la entrada.",
    "streetEs": "Estoyen laentrada.",
    "phoneticHint": "eh-STOY-ehn lah-ehn-TRAH-dah",
    "en": "I'm at the entrance.",
    "tip": "Estoy en and la entrada flow across word boundaries, so listen for stress and meaning rather than pauses between words."
  }
];

const TRAMPAS_COLOMBIANAS = [
  {
    "trap": "Cancelar la cuenta",
    "wrongGuess": "To cancel the account or bill",
    "realMeaning": "To pay or settle the bill",
    "es": "Ya terminamos de comer; ¿podemos cancelar la cuenta con tarjeta, por favor?",
    "en": "We’ve finished eating; can we pay the bill by card, please?",
    "tip": "In Colombia, cancelar una cuenta usually means paying it, especially at a restaurant or store."
  },
  {
    "trap": "¿Qué te provoca?",
    "wrongGuess": "What is provoking or making you angry?",
    "realMeaning": "What do you feel like eating or drinking?",
    "es": "¿Qué te provoca para el almuerzo: una bandeja paisa o una sopa?",
    "en": "What do you feel like having for lunch: a bandeja paisa or a soup?",
    "tip": "The phrase commonly asks about a craving or preference for food and drinks."
  },
  {
    "trap": "¡Qué pena con usted!",
    "wrongGuess": "I feel deeply ashamed in front of you",
    "realMeaning": "Excuse me, sorry to bother you, or I’m sorry",
    "es": "¡Qué pena con usted! ¿Me podría repetir la dirección?",
    "en": "Excuse me! Could you repeat the address?",
    "tip": "Pena is often a polite way to soften an interruption, request, or apology."
  },
  {
    "trap": "¿Me regala...?",
    "wrongGuess": "Will you give me this for free?",
    "realMeaning": "Can I have or buy this, please?",
    "es": "¿Me regala un tinto y una empanada, por favor?",
    "en": "Could I have a black coffee and an empanada, please?",
    "tip": "At a Colombian counter, regáleme or ¿me regala...? is a polite way to order; it does not normally imply a free item."
  },
  {
    "trap": "Ahorita",
    "wrongGuess": "Right this second",
    "realMeaning": "In a little while, later, or soon",
    "es": "Ahorita voy a su oficina; estoy terminando este informe.",
    "en": "I’ll come to your office in a little while; I’m finishing this report.",
    "tip": "Its timing is flexible and depends on context; it often means soon or later rather than immediately."
  },
  {
    "trap": "¿Señor? / ¿Señora? with rising intonation",
    "wrongGuess": "Yes, sir or yes, ma’am",
    "realMeaning": "Pardon? or What did you say?",
    "es": "—La cita es mañana a las ocho. —¿Señor? No le alcancé a oír.",
    "en": "—The appointment is tomorrow at eight. —Pardon? I didn’t quite hear you.",
    "tip": "With rising intonation after not hearing someone, the title functions as a polite request for repetition."
  },
  {
    "trap": "Un tinto",
    "wrongGuess": "A red wine",
    "realMeaning": "A small black coffee; red wine is called vino tinto",
    "es": "Para empezar el día, me tomé un tinto en la cafetería de la esquina.",
    "en": "To start the day, I had a small black coffee at the café on the corner.",
    "tip": "In Colombia, ordering un tinto by itself normally means coffee, not wine."
  },
  {
    "trap": "Un perico",
    "wrongGuess": "A parrot",
    "realMeaning": "In a café or bakery, it can mean a small coffee with milk or scrambled eggs with tomato and onion, depending on the context",
    "es": "En la panadería pedí un perico y dos panes de bono para desayunar.",
    "en": "At the bakery, I ordered a small coffee with milk and two cheese breads for breakfast.",
    "tip": "The food-and-drink context tells you whether perico means coffee with milk or scrambled eggs."
  },
  {
    "trap": "Coger el bus / coger confianza",
    "wrongGuess": "A vulgar sexual expression, or an unusually blunt way to say take or gain",
    "realMeaning": "A completely normal everyday way in Colombia to take transportation or gain confidence",
    "es": "Voy a coger el bus antes de que se llene, y después espero coger confianza con mis nuevos compañeros.",
    "en": "I’m going to catch the bus before it gets full, and afterward I hope to become more comfortable with my new colleagues.",
    "tip": "Although coger has vulgar meanings in some Spanish-speaking regions, it is ordinary and widely used in Colombia in these expressions."
  },
  {
    "trap": "Estar verraco / berraco",
    "wrongGuess": "To be a wild boar, or simply to be tough in every situation",
    "realMeaning": "Estar verraco or berraco can mean to be angry; ser verraco or berraco can mean to be very talented or admirable, while something can also be verraco or berraco when it is very difficult",
    "es": "Mi hermana está berraca porque le dañaron el computador, pero es una verraca para las matemáticas y resolvió el problema más berraco del examen.",
    "en": "My sister is angry because her computer was damaged, but she is amazing at math and solved the hardest problem on the exam.",
    "tip": "The meaning depends heavily on context and whether it describes a person’s mood, a person’s ability, or a difficult situation; both verraco and berraco are heard."
  },
  {
    "trap": "Dar papaya",
    "wrongGuess": "To give someone a papaya",
    "realMeaning": "To leave yourself vulnerable or give someone an easy opportunity to rob, deceive, or take advantage of you",
    "es": "No saques el celular en esa calle, porque estarías dando papaya.",
    "en": "Don’t take out your cellphone on that street, because you would be making yourself vulnerable.",
    "tip": "The phrase is especially common in warnings about displaying phones, wallets, jewelry, or other valuables in public."
  },
  {
    "trap": "Quedar mal / quedar bien",
    "wrongGuess": "To remain physically badly or well",
    "realMeaning": "Quedar mal means to let someone down, fail to follow through, or make a bad impression; quedar bien means to keep your word or make a good impression",
    "es": "Si no llegas a la reunión después de confirmar, vas a quedar mal; si cumples lo que prometiste, vas a quedar bien con todos.",
    "en": "If you don’t come to the meeting after confirming, you’ll let everyone down; if you do what you promised, you’ll make a good impression with everyone.",
    "tip": "These expressions are often about social reliability and how your actions affect your reputation."
  }
];

FRASES.push(
  {section:"🪤 Trampas y falsos amigos (cancelar, provocar, regalar)",quizCat:"trampas",cls:"color:var(--gold);background:rgba(232,180,74,0.1);border:1px solid rgba(232,180,74,0.2)",items:[
    {es:"Buenas tardes, señorita, ¿en dónde cancelo la cuenta del almuerzo?",en:"Good afternoon, miss, where do I pay the lunch bill? ('cancelar' = to pay!)",register:"Colombian trap · cancelar"},
    {es:"¿Qué te provoca comer hoy? ¿Te provoca una arepita con queso o un pandebono?",en:"What do you feel like eating today? Would you like an arepa with cheese or a pandebono?",register:"Colombian trap · provocar"},
    {es:"¡Qué pena con usted molestarla! ¿Me indica dónde queda la salida?",en:"Excuse me for bothering you! Could you show me where the exit is?",register:"Colombian trap · qué pena"},
    {es:"Veci, ¿me regala una botella de agua sin gas, por favor? ¿Cuánto le debo?",en:"Neighbor, can I buy/have a bottle of still water, please? How much do I owe you?",register:"Colombian trap · regalar"},
    {es:"Ahorita después del almuerzo paso por tu oficina y revisamos eso.",en:"In a little while after lunch I'll stop by your office and we'll check that.",register:"Colombian trap · ahorita"},
    {es:"¿Señor? Qué pena, no le escuché bien por el ruido de la calle.",en:"Pardon / What did you say? Sorry, I didn't hear you well because of the street noise.",register:"Colombian trap · ¿Señor?"}
  ]},
  {section:"🏘️ Estratos, conjuntos cerrados y barrios",quizCat:"estratos",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.2)",items:[
    {es:"¿En qué estrato está ubicado el edificio? Es para calcular cuánto llegan los servicios públicos.",en:"What socioeconomic tier (1–6) is the building in? It's to estimate how much the utility bills cost.",register:"Living in Colombia · estratos"},
    {es:"El apartamento queda en un conjunto cerrado con vigilancia las veinticuatro horas y salón comunal.",en:"The apartment is in a gated complex with 24-hour security and a community room.",register:"Colombian housing"},
    {es:"En Colombia los estratos cinco y seis suelen pagar un recargo en los recibos de luz y agua, mientras que el estrato cuatro paga la tarifa base.",en:"In Colombia tiers 5 and 6 usually pay a surcharge on electricity and water bills, while tier 4 pays the standard base rate.",register:"Living in Colombia"},
    {es:"Este barrio es muy caminable; tiene parques, supermercados y panaderías a dos cuadras.",en:"This neighborhood is very walkable; it has parks, supermarkets, and bakeries two blocks away.",register:"Neighborhoods"},
    {es:"Para usar el gimnasio o la terraza del conjunto a veces toca reservar turno en la administración.",en:"To use the gym or rooftop of the complex you sometimes have to book a slot with the building office.",register:"Conjunto life"},
    {es:"¿La ventana del cuarto da hacia la avenida principal o hacia el interior del conjunto?",en:"Does the bedroom window face the main avenue or the inside of the complex?",register:"Quiet apartment check"}
  ]},
  {section:"🦷 Odontología, óptica y EPS / prepagada",quizCat:"odontologia",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2)",items:[
    {es:"Quisiera agendar una cita de odontología para una limpieza dental y una valoración general.",en:"I'd like to schedule a dental appointment for a cleaning and a general checkup.",register:"Dentist · Colombia"},
    {es:"Se me partió una calza en una muela de atrás y me duele al tomar cosas frías.",en:"A filling chipped in a back molar and it hurts when I drink cold things.",register:"Dentist · emergency"},
    {es:"¿Ustedes atienden con mi póliza de medicina prepagada o la consulta sería particular?",en:"Do you accept my private supplemental health plan or would the appointment be self-pay?",register:"Healthcare · Colombia"},
    {es:"Necesito hacerme un examen de optometría para revisar la fórmula de mis gafas.",en:"I need to get an optometry exam to check my glasses prescription.",register:"Optometrist · óptica"},
    {es:"Se me soltó un tornillito del marco de las gafas; ¿me colabora ajustándolo?",en:"A tiny screw came loose on my glasses frame; could you help me tighten it?",register:"Óptica · everyday"},
    {es:"Por la EPS normalmente toca pedir cita primero con médico general, salvo en urgencias.",en:"Through an EPS you usually have to book an appointment with a general practitioner first, except in emergencies.",register:"Colombian EPS"}
  ]},
  {section:"🛂 Migración Colombia, visa y cuenta bancaria",quizCat:"migracion-ce",cls:"color:var(--purple);background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2)",items:[
    {es:"Quisiera consultar cómo solicitar la prórroga del permiso de turismo antes de que venza mi sello.",en:"I'd like to ask how to request an extension of my tourist permit before my entry stamp expires.",register:"Migración Colombia"},
    {es:"Ya me aprobaron la visa; ahora debo hacer el registro de visa y tramitar la cédula de extranjería.",en:"My visa was approved; now I need to complete the visa registration and apply for my foreigner ID card.",register:"Expat paperwork"},
    {es:"Buenas tardes, tengo mi cédula de extranjería y quisiera consultar los requisitos para abrir una cuenta de ahorros o Nequi.",en:"Good afternoon, I have my foreigner ID card and would like to check the requirements to open a savings account or Nequi.",register:"Colombian banking"},
    {es:"¿Qué documentos nos piden en la notaría si el arrendador solicita autenticar las firmas del contrato?",en:"What documents do they ask for at the notary office if the landlord asks to notarize the contract signatures?",register:"Notaría · Colombia"},
    {es:"Recuerde verificar el plazo oficial en días calendario para registrar su visa ante Migración Colombia.",en:"Remember to check the official calendar-day deadline (often 15 days) to register your visa with Migración Colombia.",register:"Visa rule · verify"},
    {es:"¿Me puede descargar un certificado bancario de titularidad para recibir pagos locales?",en:"Can you download a bank account ownership certificate for me to receive local payments?",register:"Banking · work"}
  ]}
);

CONVERSATIONS.push(
  v60Dialogue("Trampas colombianas: cancelar, provocar y qué pena","Navigating Colombian false friends at a café and checkout counter without confusion",[
    ["A","¡Hola! Qué pena hacerte esperar, es que dije ahorita vengo y me demoré veinte minutos en el banco.","Hi! Sorry to make you wait—I said 'I'll be back in a little bit' and took twenty minutes at the bank."],
    ["B","¡Tranquilo, no pasa nada! Más bien dime: ¿qué te provoca tomar? ¿Un tintico o un jugo frío?","No worries at all! Instead tell me: what do you feel like drinking? A black coffee or a cold juice?"],
    ["A","Me provoca un perico bien calientico con un pandebono. Veci, ¿me regala un perico y dos pandebonos, por favor?","I feel like a warm small coffee with milk and a pandebono. Neighbor, can I have a perico and two pandebonos, please?"],
    ["B","¿Señor? Qué pena con usted, no le escuché bien lo último.","Pardon? Excuse me, I didn't quite catch that last part."],
    ["A","Un café con leche pequeño y dos pandebonos, por favor. ¿Y en dónde cancelo la cuenta?","A small coffee with milk and two pandebonos, please. And where do I pay the bill?"],
    ["B","Con mucho gusto; puede cancelar allá en la caja con efectivo o Nequi cuando termine.","With pleasure; you can pay over at the register with cash or Nequi when you finish."]
  ],[{es:"En Colombia 'cancelar la cuenta' significa pagar, no anular el pedido.",en:"In Colombia 'cancelar la cuenta' means to pay the bill, not cancel the order.",tts:"En Colombia cancelar la cuenta significa pagar, no anular el pedido."},{es:"Cuando alguien dice '¿Señor?' con tono de pregunta, significa '¿Cómo dijo?'",en:"When someone says '¿Señor?' with a rising tone, it means 'Pardon / What did you say?'",tts:"Cuando alguien dice Señor con tono de pregunta, significa Cómo dijo."}]),
  v60Dialogue("Estratos, conjuntos cerrados y barrios","Comparing apartments in a gated complex and understanding Colombian utility tiers (estratos)",[
    ["A","Este apartamento está ubicado en un conjunto cerrado muy tranquilo, con portería veinticuatro horas y gimnasio.","This apartment is located in a very quiet gated complex, with a 24-hour front desk and a gym."],
    ["B","Se ve súper bien e iluminado. Disculpe, ¿en qué estrato está clasificado este edificio?","It looks super nice and bright. Excuse me, what socioeconomic tier is this building classified in?"],
    ["A","Aquí estamos en estrato cuatro, que paga la tarifa base sin sobrecosto en los recibos de agua, luz y gas.","Here we are in tier 4, which pays the standard base rate without a surcharge on water, electricity, and gas bills."],
    ["B","¡Buenísimo! Porque en estratos cinco y seis los servicios públicos suelen llegar más altos cada mes.","Great! Because in tiers 5 and 6 the utility bills usually come out higher every month."],
    ["A","Así es. Además, este cuarto da hacia el jardín interior del conjunto, entonces casi no se escucha ruido de la avenida.","That's right. Plus, this bedroom faces the interior garden of the complex, so you barely hear any street noise from the avenue."],
    ["B","Me encanta. ¿Y para usar el salón comunal o la terraza hay que reservar turno en la administración?","I love it. And to use the community room or rooftop do you have to book a slot at the building office?"]
  ],[{es:"En las ciudades de Colombia los estratos van del uno al seis según las características del sector.",en:"In Colombian cities socioeconomic tiers run from 1 to 6 based on the area's characteristics.",tts:"En las ciudades de Colombia los estratos van del uno al seis según las características del sector."},{es:"Este barrio es muy caminable y tiene comercio a dos cuadras.",en:"This neighborhood is very walkable and has shops within two blocks.",tts:"Este barrio es muy caminable y tiene comercio a dos cuadras."}]),
  v60Dialogue("Odontología, óptica y medicina prepagada","Booking a dental cleaning, fixing a chipped filling, and checking glasses",[
    ["A","Buenos días, bienvenido al consultorio odontológico. ¿Tiene convenio de medicina prepagada o viene por consulta particular?","Good morning, welcome to the dental office. Do you have a private supplemental insurance plan or are you coming as self-pay?"],
    ["B","Buenos días. Vengo por consulta particular; quisiera hacerme una limpieza dental y que el doctor me revise una muela.","Good morning. I'm coming as self-pay; I'd like to get a dental cleaning and have the doctor check a molar."],
    ["A","Claro que sí. ¿Siente dolor en esa muela o se le cayó alguna calza?","Of course. Do you feel pain in that molar or did a filling fall out?"],
    ["B","Ayer comiendo se me partió un pedacito de la calza y me da sensibilidad al tomar agua fría.","Yesterday while eating a tiny piece of the filling chipped and it gives me sensitivity when drinking cold water."],
    ["A","Listo, la doctora ya lo atiende en unos minutos. ¿Necesita factura con su pasaporte o documento?","Got it, the doctor will see you in a few minutes. Do you need an invoice with your passport or ID?"],
    ["B","Sí, por favor. Y saliendo de acá voy a pasar a la óptica de al lado para consultar por un examen visual.","Yes, please. And when I leave here I'm going to stop by the optical shop next door to ask about an eye exam."]
  ],[{es:"¿Cuánto cuesta la valoración y limpieza dental particular?",en:"How much do a self-pay dental checkup and cleaning cost?",tts:"¿Cuánto cuesta la valoración y limpieza dental particular?"},{es:"En muchas ópticas te colaboran ajustando los tornillos de las gafas.",en:"At many optical shops they'll help you tighten the screws on your glasses.",tts:"En muchas ópticas te colaboran ajustando los tornillos de las gafas."}]),
  v60Dialogue("Migración Colombia, cédula de extranjería y bancos","Registering an approved visa, picking up a foreigner ID card, and checking bank requirements",[
    ["A","Buenos días, bienvenido a Migración Colombia. ¿Viene a reclamar su cédula de extranjería o a consultar por una prórroga de permanencia?","Good morning, welcome to Migración Colombia. Are you here to pick up your foreigner ID card or ask about a stay extension?"],
    ["B","Buenos días. Ya me aprobaron la visa y vine a mi cita para registrar la visa y tramitar la cédula de extranjería.","Good morning. My visa was approved and I came for my appointment to register the visa and apply for my foreigner ID card."],
    ["A","Perfecto, está dentro del plazo reglamentario. ¿Me permite su pasaporte original y la visa electrónica, por favor?","Perfect, you are within the official deadline. May I see your original passport and the e-visa, please?"],
    ["B","Aquí los tiene. Una pregunta: ¿aproximadamente en cuántos días hábiles entregan la cédula física para llevarla al banco?","Here they are. One question: in roughly how many business days is the physical ID card ready so I can take it to the bank?"],
    ["A","Normalmente le avisan por correo en unos días hábiles cuando esté lista. Con la cédula física ya puede consultar en los bancos para abrir cuenta de ahorros o Nequi.","Usually they notify you by email in a few business days when it's ready. With the physical card you can check with banks to open a savings account or Nequi."],
    ["B","¡Qué alivio, muchas gracias por su orientación! Ahora voy a la notaría para autenticar la firma del contrato de arriendo.","What a relief, thank you so much for your guidance! Now I'm heading to the notary office to notarize the signature on my lease."]
  ],[{es:"Muchos bancos en Colombia piden la cédula de extranjería física para abrir una cuenta de ahorros.",en:"Many banks in Colombia require the physical foreigner ID card to open a savings account.",tts:"Muchos bancos en Colombia piden la cédula de extranjería física para abrir una cuenta de ahorros."},{es:"Verifique siempre los plazos y requisitos vigentes en el portal oficial de Migración Colombia.",en:"Always verify current deadlines and requirements on the official Migración Colombia portal.",tts:"Verifique siempre los plazos y requisitos vigentes en el portal oficial de Migración Colombia."}])
);

READINGS.push(
  {id:"lectura-trampas",level:"A2",title:"Palabras trampa en Colombia: cancelar, provocar y regalar",lesson:"trampas-colombianas",intro:"Why everyday Colombian words mean something totally different from literal English translations.",lines:[
    {es:"Si en un restaurante colombiano el mesero te dice puede cancelar en la caja, no significa que tu pedido se anuló: cancelar significa pagar la cuenta.",en:"If a waiter in a Colombian restaurant tells you 'puede cancelar en la caja', it doesn't mean your order was canceled: 'cancelar' means to pay the bill.",tts:"Si en un restaurante colombiano el mesero te dice puede cancelar en la caja, no significa que tu pedido se anuló: cancelar significa pagar la cuenta."},
    {es:"Cuando un amigo te pregunta ¿qué te provoca?, no está buscando pelea; te está preguntando con cariño qué tienes ganas de comer o tomar.",en:"When a friend asks '¿qué te provoca?', they aren't looking for a fight; they are warmly asking what you feel like eating or drinking.",tts:"Cuando un amigo te pregunta ¿qué te provoca?, no está buscando pelea; te está preguntando con cariño qué tienes ganas de comer o tomar."},
    {es:"Y si alguien no escuchó lo que dijiste, te va a mirar y va a decir ¿Señor? o ¿Señora?, que significa ¿puede repetir, por favor?",en:"And if someone didn't hear what you said, they will look at you and say '¿Señor?' or '¿Señora?', which means 'could you repeat that, please?'",tts:"Y si alguien no escuchó lo que dijiste, te va a mirar y va a decir ¿Señor? o ¿Señora?, que significa ¿puede repetir, por favor?"},
    {es:"Dominar estos falsos amigos te ahorra confusiones todos los días desde tu primera semana en el país.",en:"Mastering these false friends saves you confusion every single day from your very first week in the country.",tts:"Dominar estos falsos amigos te ahorra confusiones todos los días desde tu primera semana en el país."}
  ],questions:[{q:"En una tienda o restaurante de Colombia, ¿qué significa '¿Dónde cancelo?'?",choices:["¿Dónde pago la cuenta?","¿Dónde anulo la reserva?","¿Dónde queda el baño?"],answer:"¿Dónde pago la cuenta?"}]},
  {id:"lectura-estratos",level:"B1",title:"Cómo funcionan los estratos y conjuntos en Colombia",lesson:"estratos-barrios",intro:"Understand Colombia's 1-to-6 residential tier system for utility billing (general cultural context; municipal rules vary).",lines:[
    {es:"En las ciudades colombianas, las cuadras y viviendas se clasifican en estratos socioeconómicos del uno al seis según las características físicas del entorno.",en:"In Colombian cities, blocks and homes are classified into socioeconomic tiers ('estratos') from 1 to 6 based on the physical characteristics of the area.",tts:"En las ciudades colombianas, las cuadras y viviendas se clasifican en estratos socioeconómicos del uno al seis según las características físicas del entorno."},
    {es:"Este sistema se usa principalmente para facturar los servicios públicos: los estratos cinco y seis pagan una contribución que ayuda a subsidiar los estratos uno, dos y tres.",en:"This system is mainly used to bill public utilities: tiers 5 and 6 pay a surcharge that helps subsidize tiers 1, 2, and 3.",tts:"Este sistema se usa principalmente para facturar los servicios públicos: los estratos cinco y seis pagan una contribución que ayuda a subsidiar los estratos uno, dos y tres."},
    {es:"El estrato cuatro generalmente paga la tarifa de referencia: no recibe subsidio, pero tampoco paga sobrecosto en agua, luz o gas.",en:"Tier 4 generally pays the baseline rate: it receives no subsidy, but also pays no surcharge on water, electricity, or gas.",tts:"El estrato cuatro generalmente paga la tarifa de referencia: no recibe subsidio, pero tampoco paga sobrecosto en agua, luz o gas."},
    {es:"Además, muchos apartamentos urbanos están en conjuntos cerrados con vigilancia en portería y reglamento de administración.",en:"Additionally, many urban apartments are in gated complexes ('conjuntos cerrados') with front-desk security and building administration rules.",tts:"Además, muchos apartamentos urbanos están en conjuntos cerrados con vigilancia en portería y reglamento de administración."}
  ],questions:[{q:"¿Para qué se usa principalmente la clasificación por estratos (1 al 6) de una vivienda en Colombia?",choices:["Para definir las tarifas, subsidios o contribuciones de los servicios públicos","Para saber cuántos pisos tiene el edificio","Para elegir el color del taxi"],answer:"Para definir las tarifas, subsidios o contribuciones de los servicios públicos"}]},
  {id:"lectura-odontologia",level:"B1",title:"Odontología, ópticas y opciones de salud en Colombia",lesson:"odontologia-optica",intro:"How public/contributory EPS, private medicina prepagada, and self-pay (particular) appointments work in practice (check your clinic or insurer for coverage details).",lines:[
    {es:"Ciudades como Bogotá, Medellín, Cali y Bucaramanga cuentan con una amplia oferta de consultorios odontológicos, ópticas y clínicas privadas.",en:"Cities like Bogotá, Medellín, Cali, and Bucaramanga have a wide range of dental offices, optical shops, and private clinics.",tts:"Ciudades como Bogotá, Medellín, Cali y Bucaramanga cuentan con una amplia oferta de consultorios odontológicos, ópticas y clínicas privadas."},
    {es:"Los residentes afiliados al sistema de salud cotizan a una EPS, y algunas personas contratan además medicina prepagada o una póliza privada.",en:"Residents enrolled in the health system contribute to an EPS, and some people also purchase a private 'medicina prepagada' or insurance policy.",tts:"Los residentes afiliados al sistema de salud cotizan a una EPS, y algunas personas contratan además medicina prepagada o una póliza privada."},
    {es:"Si eres visitante o buscas atención directa sin trámites de aseguradora, es común agendar una consulta particular para una limpieza dental, una calza o optometría.",en:"If you are a visitor or want direct care without insurance referrals, it is common to book a self-pay ('particular') appointment for a dental cleaning, a filling, or optometry.",tts:"Si eres visitante o buscas atención directa sin trámites de aseguradora, es común agendar una consulta particular para una limpieza dental, una calza o optometría."},
    {es:"En muchas ópticas hacen el examen de optometría en el local y, según la fórmula, entregan los lentes en pocos días.",en:"At many optical shops they perform the eye exam on-site and, depending on your prescription, have your glasses ready in a few days.",tts:"En muchas ópticas hacen el examen de optometría en el local y, según la fórmula, entregan los lentes en pocos días."}
  ],questions:[{q:"¿Cómo se llama una consulta médica u odontológica cuando el paciente paga directamente sin usar EPS ni póliza?",choices:["Consulta particular","Consulta de peaje","Consulta de ciclovía"],answer:"Consulta particular"}]},
  {id:"lectura-migracion-ce",level:"B1",title:"Permisos de turismo, visas y cédula de extranjería",lesson:"migracion-bancos-ce",intro:"Conversational overview of tourist extensions, visas, and banking in Colombia. Note: Immigration, visa, and banking rules change frequently—always verify current requirements with Migración Colombia, Cancillería, and your bank.",lines:[
    {es:"Muchos viajeros reciben un permiso de turismo al entrar a Colombia (con frecuencia de noventa días) y, según su nacionalidad, pueden solicitar una prórroga ante Migración Colombia.",en:"Many travelers receive a tourist permit upon entering Colombia (often 90 days) and, depending on nationality, can apply for an extension ('prórroga') with Migración Colombia.",tts:"Muchos viajeros reciben un permiso de turismo al entrar a Colombia y, según su nacionalidad, pueden solicitar una prórroga ante Migración Colombia."},
    {es:"Quienes obtienen una visa elegible deben registrarla dentro del plazo oficial (a menudo quince días calendario) y tramitar su cédula de extranjería.",en:"Those who obtain an eligible visa must register it within the official deadline (often 15 calendar days) and apply for their foreigner ID card ('cédula de extranjería').",tts:"Quienes obtienen una visa elegible deben registrarla dentro del plazo oficial y tramitar su cédula de extranjería."},
    {es:"En la mayoría de los bancos colombianos y billeteras como Nequi suelen exigir la cédula de extranjería física para abrir una cuenta de ahorros, aunque las políticas varían según la entidad.",en:"Most Colombian banks and wallets like Nequi generally require the physical foreigner ID card to open a savings account, though policies vary by institution.",tts:"En la mayoría de los bancos colombianos y billeteras como Nequi suelen exigir la cédula de extranjería física para abrir una cuenta de ahorros, aunque las políticas varían según la entidad."},
    {es:"Además, en trámites como contratos de arriendo es frecuente que pidan autenticar la firma en una notaría, junto con requisitos como fiador o póliza.",en:"Additionally, in processes like lease agreements they often ask to notarize your signature at a notary office ('notaría'), along with requirements like a co-signer or lease bond.",tts:"Además, en trámites como contratos de arriendo es frecuente que pidan autenticar la firma en una notaría, junto con requisitos como fiador o póliza."}
  ],questions:[{q:"¿Qué documento suelen exigir la mayoría de los bancos colombianos a un residente extranjero para abrir una cuenta de ahorros?",choices:["La cédula de extranjería (según la política del banco)","El tiquete del bus","El recibo de la panadería"],answer:"La cédula de extranjería (según la política del banco)"}]}
);

CONVERSATION_MISSIONS.push(
  {id:"mision-trampas",title:"Usa 'cancelar', 'provocar' y 'qué pena' como un colombiano",scenario:"You are at a café with a friend. Ask what they feel like eating (provocar), order from the counter (regalar), and ask where to pay the bill (cancelar).",prompt:"Habla con tu amigo y con el cajero:",lesson:"trampas-colombianas",models:[
    {es:"¿Qué te provoca comer hoy? Veci, qué pena con usted, ¿me regala dos tinticos y me dice dónde cancelo la cuenta?",en:"What do you feel like eating today? Neighbor, excuse me, can I have two black coffees and can you tell me where I pay the bill?",tts:"¿Qué te provoca comer hoy? Veci, qué pena con usted, ¿me regala dos tinticos y me dice dónde cancelo la cuenta?"},
    {es:"Ahorita cuando terminemos cancelamos en la caja con Nequi.",en:"In a little bit when we finish we'll pay at the register with Nequi.",tts:"Ahorita cuando terminemos cancelamos en la caja con Nequi."}
  ]},
  {id:"mision-estratos",title:"Pregunta por el estrato y las zonas del conjunto cerrado",scenario:"You are viewing an apartment to rent. Ask what socioeconomic tier (estrato) the building is in and whether the bedroom faces away from street noise.",prompt:"Hazle las preguntas clave al arrendador:",lesson:"estratos-barrios",models:[
    {es:"Disculpe, ¿en qué estrato está ubicado este conjunto cerrado para calcular el costo de los servicios públicos?",en:"Excuse me, what socioeconomic tier is this gated complex in so I can estimate the cost of utilities?",tts:"Disculpe, ¿en qué estrato está ubicado este conjunto cerrado para calcular el costo de los servicios públicos?"},
    {es:"¿La habitación principal da hacia el interior del conjunto o hacia la avenida?",en:"Does the master bedroom face the inside of the complex or the avenue?",tts:"¿La habitación principal da hacia el interior del conjunto o hacia la avenida?"}
  ]},
  {id:"mision-odontologia",title:"Agenda una limpieza dental y revisión de una calza",scenario:"Call or visit a dental clinic in Colombia. Ask for a self-pay (particular) appointment for a cleaning and a chipped filling.",prompt:"Explica lo que necesitas en la clínica:",lesson:"odontologia-optica",models:[
    {es:"Buenos días, quisiera pedir una cita particular de odontología para una limpieza dental y revisar una calza que se me partió.",en:"Good morning, I'd like to book a self-pay dental appointment for a cleaning and to check a filling that chipped.",tts:"Buenos días, quisiera pedir una cita particular de odontología para una limpieza dental y revisar una calza que se me partió."},
    {es:"Tengo un poquito de sensibilidad al tomar agua fría en una muela de atrás.",en:"I have a bit of sensitivity when drinking cold water in a back molar.",tts:"Tengo un poquito de sensibilidad al tomar agua fría en una muela de atrás."}
  ]},
  {id:"mision-migracion-ce",title:"Registra tu visa y abre una cuenta con tu cédula de extranjería",scenario:"You are at Migración Colombia to register your visa for your Cédula de Extranjería so you can open a savings account.",prompt:"Habla con el funcionario:",lesson:"migracion-bancos-ce",models:[
    {es:"Buenos días, vengo a mi cita para registrar la visa y tramitar mi cédula de extranjería; aquí tengo mi pasaporte.",en:"Good morning, I'm here for my appointment to register my visa and apply for my foreigner ID card; here is my passport.",tts:"Buenos días, vengo a mi cita para registrar la visa y tramitar mi cédula de extranjería; aquí tengo mi pasaporte."},
    {es:"Apenas me entreguen la cédula física voy al banco a abrir una cuenta de ahorros y activar Nequi.",en:"As soon as they give me the physical ID card I'm going to the bank to open a savings account and activate Nequi.",tts:"Apenas me entreguen la cédula física voy al banco a abrir una cuenta de ahorros y activar Nequi."}
  ]}
);

Object.assign(LESSON_CONTENT,{
  "trampas-colombianas":{
    goal:{es:"¿Qué te provoca pedir? Veci, ¿me regala un perico y me dice dónde cancelo la cuenta?",en:"What do you feel like ordering? Neighbor, can I have a small milk coffee and can you tell me where I pay the bill?"},
    words:[{es:"cancelar la cuenta",en:"to pay / settle the bill (NOT cancel!)"},{es:"¿qué te provoca?",en:"what do you feel like (eating/drinking)?"},{es:"¡qué pena con usted!",en:"excuse me / sorry to bother you"},{es:"¿me regala…?",en:"can I buy / have…? (polite counter request)"},{es:"ahorita",en:"in a little while / later / soon"},{es:"¿señor? / ¿señora?",en:"pardon? / could you repeat that?"}],
    phrases:[{en:"Where do I pay the bill?",es:"¿En dónde cancelo la cuenta?"},{en:"What do you feel like eating today?",es:"¿Qué te provoca comer hoy?"},{en:"Excuse me for bothering you!",es:"¡Qué pena con usted molestarlo!"},{en:"In a little while I'll stop by your house.",es:"Ahorita paso por tu casa."}]
  },
  "estratos-barrios":{
    goal:{es:"El apartamento queda en un conjunto cerrado en estrato cuatro, muy tranquilo y caminable.",en:"The apartment is in a gated complex in tier 4, very quiet and walkable."},
    words:[{es:"el estrato (1 al 6)",en:"socioeconomic utility tier"},{es:"el conjunto cerrado",en:"gated residential complex"},{es:"los servicios públicos",en:"public utilities (water/power/gas)"},{es:"el salón comunal",en:"building community room"},{es:"dar hacia el interior",en:"to face the quiet interior"},{es:"barrio caminable",en:"walkable neighborhood"}],
    phrases:[{en:"What socioeconomic tier is the building in?",es:"¿En qué estrato está ubicado el edificio?"},{en:"The apartment is in a gated complex with 24-hour security.",es:"El apartamento queda en un conjunto cerrado con vigilancia."},{en:"Does the window face the avenue or the interior?",es:"¿La ventana da hacia la avenida o hacia el interior?"},{en:"Tier 4 pays a reasonable price for utilities.",es:"En estrato cuatro los servicios llegan a buen precio."}]
  },
  "odontologia-optica":{
    goal:{es:"Quisiera pedir una cita particular de odontología para una limpieza y revisar una calza.",en:"I'd like to book a self-pay dental appointment for a cleaning and to check a filling."},
    words:[{es:"la limpieza dental",en:"dental cleaning"},{es:"la calza / la muela",en:"filling / molar tooth"},{es:"consulta particular",en:"self-pay appointment (no insurance needed)"},{es:"la medicina prepagada / EPS",en:"private supplemental / standard health plan"},{es:"la óptica / las gafas",en:"optical shop / eyeglasses"},{es:"la sensibilidad",en:"tooth sensitivity"}],
    phrases:[{en:"I'd like a self-pay dental cleaning appointment.",es:"Quisiera una cita particular para una limpieza dental."},{en:"A filling chipped in a back molar.",es:"Se me partió una calza en una muela de atrás."},{en:"Do you take private insurance or self-pay?",es:"¿Atienden por medicina prepagada o particular?"},{en:"Can you tighten the screw on my glasses?",es:"¿Me colabora ajustando el tornillo de las gafas?"}]
  },
  "migracion-bancos-ce":{
    goal:{es:"Vengo a registrar mi visa para sacar la cédula de extranjería y abrir una cuenta de ahorros.",en:"I'm here to register my visa to get my foreigner ID card and open a savings account."},
    words:[{es:"la cédula de extranjería",en:"Colombian foreigner ID card"},{es:"la prórroga de turismo",en:"90-day tourist permit extension"},{es:"registrar la visa",en:"to register an approved visa"},{es:"la notaría / autenticar",en:"notary office / to notarize a signature"},{es:"abrir cuenta de ahorros",en:"to open a savings account"},{es:"días hábiles",en:"business days"}],
    phrases:[{en:"I'm here to request an extension of my tourist permit.",es:"Vengo a solicitar la prórroga del permiso de turismo."},{en:"I need to apply for my foreigner ID card.",es:"Necesito tramitar mi cédula de extranjería."},{en:"With my foreigner ID I want to open a savings account.",es:"Con mi cédula de extranjería quiero abrir una cuenta de ahorros."},{en:"Where is a notary office to notarize this contract?",es:"¿Dónde queda una notaría para autenticar este contrato?"}]
  }
});

Object.assign(LESSON_META,{
  "trampas-colombianas":{stage:"Start Here",difficulty:"Easy",prereq:"Cortesía colombiana",dialogue:"Trampas colombianas: cancelar, provocar y qué pena",vocab:"comida",quizCat:"trampas",quizMode:"conversation",guideIds:["cortesia-colombiana","usted-tu-vos"],readingId:"lectura-trampas",missionId:"mision-trampas"},
  "estratos-barrios":{stage:"Daily Life",difficulty:"Easy",prereq:"Arriendo, Airbnb y aseo",dialogue:"Estratos, conjuntos cerrados y barrios",vocab:"casa",quizCat:"estratos",quizMode:"conversation",guideIds:["ser-estar","por-para"],readingId:"lectura-estratos",missionId:"mision-estratos"},
  "odontologia-optica":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Cita médica y urgencias",dialogue:"Odontología, óptica y medicina prepagada",vocab:"cuerpo",quizCat:"odontologia",quizMode:"conversation",guideIds:["se-me","cortesia-colombiana"],readingId:"lectura-odontologia",missionId:"mision-odontologia"},
  "migracion-bancos-ce":{stage:"Daily Life",difficulty:"Moderate",prereq:"Cajero, SIM card y trámites",dialogue:"Migración Colombia, cédula de extranjería y bancos",vocab:"numeros",quizCat:"migracion-ce",quizMode:"conversation",guideIds:["por-para","futuro"],readingId:"lectura-migracion-ce",missionId:"mision-migracion-ce"}
});

Object.assign(SENTENCE_LADDERS,{
  "trampas-colombianas":{
    title:"Use Colombian 'false friends' (cancelar, provocar, regalar, ahorita) like a native",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Qué te provoca pedir?",en:"What do you feel like ordering?"},
      {tag:"2. + Polite regalar",es:"¿Qué te provoca? Veci, ¿me regala un perico y un pandebono?",en:"What do you feel like? Neighbor, can I have a small milk coffee and a pandebono?"},
      {tag:"3. + Cancelar (pay)",es:"Veci, qué pena con usted, ¿en dónde cancelo la cuenta?",en:"Neighbor, excuse me, where do I pay the bill?"},
      {tag:"4. + Ahorita follow-up",es:"Cancela tú en la caja con Nequi y ahorita en la tarde yo te invito a las onces.",en:"You pay at the register with Nequi and in a little while this afternoon I'll treat you to afternoon coffee."}
    ],
    swaps:[
      {label:"Rising ¿Señor?",es:"¿Señor? Qué pena, no le alcancé a escuchar bien.",en:"Pardon? Sorry, I didn't quite catch what you said."},
      {label:"Provocar cold drink",es:"Con este calor me provoca una limonada de coco bien fría.",en:"With this heat I feel like an ice-cold coconut lemonade."},
      {label:"Cancelar at counter",es:"¿Cancelo de una vez aquí en la barra o al final en la mesa?",en:"Do I pay right now here at the counter or at the end at the table?"}
    ]
  },
  "estratos-barrios":{
    title:"Evaluate a Colombian apartment's estrato, noise level, and conjunto amenities",
    rungs:[
      {tag:"1. Anchor stem",es:"¿En qué estrato está el edificio?",en:"What socioeconomic tier is the building in?"},
      {tag:"2. + Conjunto cerrado",es:"¿En qué estrato está este conjunto cerrado con vigilancia?",en:"What tier is this gated complex with security in?"},
      {tag:"3. + Utility cost",es:"Está en estrato cuatro, así que los servicios públicos llegan a buen precio.",en:"It's in tier 4, so the utility bills come at a good price."},
      {tag:"4. + Quiet window check",es:"El conjunto está en estrato cuatro y la alcoba da hacia el interior, así que no se oye ruido de la calle.",en:"The complex is in tier 4 and the bedroom faces the interior, so you don't hear street noise."}
    ],
    swaps:[
      {label:"Book rooftop/gym",es:"¿Cómo se reserva turno para el gimnasio en la administración?",en:"How do you book a slot for the gym with the building office?"},
      {label:"Walkable barrio",es:"Este barrio es súper caminable y tiene parques a dos cuadras.",en:"This neighborhood is super walkable and has parks two blocks away."},
      {label:"Visitor parking",es:"¿El conjunto cerrado tiene parqueadero de visitantes?",en:"Does the gated complex have visitor parking?"}
    ]
  },
  "odontologia-optica":{
    title:"Book a self-pay dental cleaning, explain a chipped filling, and visit an optical shop",
    rungs:[
      {tag:"1. Anchor stem",es:"Quisiera una cita de odontología.",en:"I'd like a dental appointment."},
      {tag:"2. + Particular & cleaning",es:"Quisiera una cita particular para una limpieza dental.",en:"I'd like a self-pay appointment for a dental cleaning."},
      {tag:"3. + Chipped filling",es:"Ayer se me partió una calza en una muela y tengo sensibilidad.",en:"Yesterday a filling chipped in a molar and I have sensitivity."},
      {tag:"4. + Optical shop",es:"Después de la limpieza dental voy a pasar a la óptica para hacerme el examen de las gafas.",en:"After the dental cleaning I'm going to stop by the optical shop to get my glasses exam."}
    ],
    swaps:[
      {label:"Tighten glasses",es:"Se me aflojó una patica de las gafas; ¿me colabora ajustándola?",en:"An arm on my glasses came loose; could you help me tighten it?"},
      {label:"Prepagada vs particular",es:"¿Atienden por medicina prepagada o solo consulta particular?",en:"Do you accept private supplemental insurance or only self-pay?"},
      {label:"Cold water pain",es:"Me duele un poquito la muela cuando tomo cosas muy frías.",en:"My molar hurts a little when I drink very cold things."}
    ]
  },
  "migracion-bancos-ce":{
    title:"Handle Migración Colombia, get your Cédula de Extranjería, and open a bank account",
    rungs:[
      {tag:"1. Anchor stem",es:"Vengo a registrar mi visa.",en:"I'm here to register my visa."},
      {tag:"2. + Cédula de extranjería",es:"Vengo a registrar mi visa para sacar la cédula de extranjería.",en:"I'm here to register my visa to get my foreigner ID card."},
      {tag:"3. + Delivery timeline",es:"¿En cuántos días hábiles me entregan la cédula de extranjería física?",en:"In how many business days will they hand me the physical foreigner ID card?"},
      {tag:"4. + Bank & notaría",es:"Apenas tenga mi cédula de extranjería, abro la cuenta de ahorros en el banco y autentico el contrato en la notaría.",en:"As soon as I have my foreigner ID card, I'll open a savings account at the bank and notarize the contract at the notary office."}
    ],
    swaps:[
      {label:"Tourist extension",es:"Quiero solicitar la prórroga de noventa días del permiso de turismo.",en:"I want to request the 90-day extension of my tourist permit."},
      {label:"Notary signature",es:"Buenas, vengo a autenticar mi firma en este contrato de arriendo.",en:"Hi, I'm here to notarize my signature on this lease agreement."},
      {label:"Bank certificate",es:"¿Me descarga el certificado de titularidad de mi cuenta de ahorros?",en:"Can you download the ownership certificate for my savings account?"}
    ]
  }
});

/* 5. 6 More High-Frequency Colombianismos (78 total) */
COLOMBIANISMOS.push(
  {word:"Cancelar (la cuenta)",en:"To pay / settle the bill (NOT cancel!)",region:"all",register:"Colombian · essential trap",registerGroup:"formal",usage:"At every Colombian store, café, restaurant, or clinic, '¿Dónde cancelo?' means 'Where do I pay?'. To cancel an order, say 'anular'.",example:"Señorita, ¿le cancelo a usted o allá en la caja?",tts:"Señorita, ¿le cancelo a usted o allá en la caja?"},
  {word:"¿Qué te provoca?",en:"What do you feel like (eating/drinking/doing)?",region:"all",register:"Colombian · warm everyday",registerGroup:"everyday",usage:"In Colombia, 'provocar' with food/drink/plans means 'to crave / feel like / sound good to you' ('¿Te provoca un tintico?').",example:"¿Qué te provoca almorzar hoy? ¿Te provoca ajiaco?",tts:"¿Qué te provoca almorzar hoy? ¿Te provoca ajiaco?"},
  {word:"El estrato (1 al 6)",en:"Socioeconomic block/housing tier (1–6)",region:"all",register:"Colombian · housing & daily life",registerGroup:"everyday",usage:"Residential blocks in Colombian cities are generally classified from 1 to 6 to calculate utility subsidies (1–3), base rates (4), or surcharges (5–6).",example:"Ese edificio está en estrato cuatro y los servicios llegan a tarifa base.",tts:"Ese edificio está en estrato cuatro y los servicios llegan a tarifa base."},
  {word:"El conjunto cerrado",en:"Gated apartment/housing complex with guard desk",region:"all",register:"Colombian · housing",registerGroup:"everyday",usage:"Many urban apartments in Colombia are inside a 'conjunto cerrado' with 'portería' security and shared amenities governed by an HOA ('administración').",example:"Vivo en un conjunto cerrado a dos cuadras del parque.",tts:"Vivo en un conjunto cerrado a dos cuadras del parque."},
  {word:"La EPS / La prepagada",en:"Contributory health plan / Private supplemental plan",region:"all",register:"Colombian · healthcare",registerGroup:"everyday",usage:"Residents enrolled in the national health system use an 'EPS', some add private 'medicina prepagada', and visitors or self-pay patients book a 'consulta particular'.",example:"Pedí la cita de odontología como consulta particular.",tts:"Pedí la cita de odontología como consulta particular."},
  {word:"La cédula de extranjería",en:"Colombian Foreigner ID card (for eligible visa holders)",region:"all",register:"Colombian · expats & banking",registerGroup:"formal",usage:"Issued by Migración Colombia after registering an eligible visa; most local banks and Nequi generally require it for resident accounts (policies vary by bank).",example:"Con la cédula de extranjería pude solicitar mi cuenta de ahorros en el banco.",tts:"Con la cédula de extranjería pude solicitar mi cuenta de ahorros en el banco."}
);

/* 6. 12th 3-Column Slot-Swapper Matrix: Trampas, Cancelar & Provocar */
SLOT_SWAP_MATRICES.push(
  {
    id:"trampas-cortesia-matrix",
    title:"🪤 Trampas: Cancelar, Provocar & Regalar",
    sub:"Use Colombia's famous false-friend verbs ('cancelar', 'provocar', 'regalar', 'qué pena') with 100% native confidence",
    col1Title:"1. Polite Opener",
    col2Title:"2. Colombian Verb Trap",
    col3Title:"3. Natural Context",
    col1:[
      {es:"Veci, qué pena con usted,",en:"Neighbor, excuse me for bothering you,"},
      {es:"Oye, antes de pedir,",en:"Hey, before we order,"},
      {es:"Buenas tardes, señorita,",en:"Good afternoon, miss,"},
      {es:"Ahorita cuando terminemos,",en:"In a little while when we finish,"}
    ],
    col2:[
      {es:"¿en dónde cancelo la cuenta",en:"where do I pay the bill"},
      {es:"¿qué te provoca tomar hoy",en:"what do you feel like drinking today"},
      {es:"¿me regala un perico bien calientico",en:"can I buy/have a piping hot small milk coffee"},
      {es:"cancelamos de una vez en la caja",en:"we'll pay right away at the register"}
    ],
    col3:[
      {es:"con tarjeta o código QR de Nequi?",en:"by card or Nequi QR code?"},
      {es:"para acompañar estos pandebonos?",en:"to go with these pandebonos?"},
      {es:"antes de que nos coja la tarde.",en:"before it gets late on us."},
      {es:"y salimos a caminar por el barrio.",en:"and head out for a walk around the neighborhood."}
    ]
  }
);

/* 7. New Quiz Items for v96 Scenarios (Trampas, Estratos, Odontología, Migración/CE) */
V60_CONVERSATION_QUIZ.push(
  {kind:"reply",focus:"present",cat:"trampas",es:"Buenas tardes, ¿en dónde cancelo la cuenta del almuerzo?",en:"Puede cancelar allá en la caja en efectivo, con tarjeta o por Nequi.",tts:"Buenas tardes, ¿en dónde cancelo la cuenta del almuerzo?",choices:["Puede cancelar allá en la caja en efectivo, con tarjeta o por Nequi.","Suba dos cuadras hacia los cerros.","Se me partió una calza en una muela.","El bus sale por la plataforma cuatro."]},
  {kind:"meaning",focus:"present",cat:"trampas",es:"¿Qué te provoca tomar: un tintico o una limonada fría?",en:"What do you feel like drinking: a black coffee or a cold lemonade?",tts:"¿Qué te provoca tomar: un tintico o una limonada fría?",choices:["What do you feel like drinking: a black coffee or a cold lemonade?","Why are you trying to make me angry?","Did you cancel the reservation at the hotel?","How many installments on your credit card?"]},
  {kind:"reply",focus:"present",cat:"estratos",es:"Disculpe, ¿en qué estrato está ubicado este conjunto cerrado?",en:"Está en estrato cuatro, así que los servicios públicos llegan a muy buen precio.",tts:"Disculpe, ¿en qué estrato está ubicado este conjunto cerrado?",choices:["Está en estrato cuatro, así que los servicios públicos llegan a muy buen precio.","En agua y bajito de azúcar, por favor.","Con la máquina número dos a los lados.","Una tableta cada ocho horas después de comer."]},
  {kind:"meaning",focus:"present",cat:"estratos",es:"La habitación principal da hacia el jardín interior del conjunto cerrado.",en:"The master bedroom faces the interior garden of the gated complex.",tts:"La habitación principal da hacia el jardín interior del conjunto cerrado.",choices:["The master bedroom faces the interior garden of the gated complex.","The washing machine is leaking water on the floor.","The ATM deducted the money from my savings account.","We have to leave early because of traffic at the toll booth."]},
  {kind:"reply",focus:"past",cat:"odontologia",es:"Buenos días, ¿viene por limpieza dental o tiene algún dolor?",en:"Ayer se me partió una calza en una muela y tengo sensibilidad al frío.",tts:"Buenos días, ¿viene por limpieza dental o tiene algún dolor?",choices:["Ayer se me partió una calza en una muela y tengo sensibilidad al frío.","Con sopa de verduras y de principio lentejas.","Consumidor final a una sola cuota.","Todavía no tengo cédula de extranjería."]},
  {kind:"meaning",focus:"present",cat:"odontologia",es:"¿Ustedes atienden por medicina prepagada o solo consulta particular?",en:"Do you accept private supplemental insurance or only self-pay appointments?",tts:"¿Ustedes atienden por medicina prepagada o solo consulta particular?",choices:["Do you accept private supplemental insurance or only self-pay appointments?","Are the HOA fee and utilities included in the monthly rent?","Shall we take turns on the gym machine while you rest?","Where can I get a 30,000-peso top-up for my prepaid SIM?"]},
  {kind:"reply",focus:"present",cat:"migracion-ce",es:"Buenos días, bienvenido a Migración Colombia. ¿Qué trámite viene a realizar hoy?",en:"Vengo a registrar mi visa para sacar la cédula de extranjería.",tts:"Buenos días, bienvenido a Migración Colombia. ¿Qué trámite viene a realizar hoy?",choices:["Vengo a registrar mi visa para sacar la cédula de extranjería.","Me regala dos almojábanas calienticas y un perico.","Hoy vamos a rumbear a una salsoteca.","De sobremesa quiero jugo de maracuyá."]},
  {kind:"meaning",focus:"present",cat:"migracion-ce",es:"Con la cédula de extranjería ya puedes abrir tu cuenta de ahorros en el banco.",en:"With your foreigner ID card you can now open your savings account at the bank.",tts:"Con la cédula de extranjería ya puedes abrir tu cuenta de ahorros en el banco.",choices:["With your foreigner ID card you can now open your savings account at the bank.","You can leave your package with the building doorman at the front desk.","On Sunday morning they close the main avenues for the Ciclovía.","If you climb too fast in Bogotá you might get altitude sickness."]}
);

V60_FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"present",cat:"trampas",es:"Señorita, ¿en dónde ___ la cuenta del almuerzo: aquí o en la caja?",en:"cancelo",tts:"Señorita, ¿en dónde cancelo la cuenta del almuerzo: aquí o en la caja?",trans:"Miss, where do I pay the lunch bill: here or at the register?",choices:["cancelo","aterrizo","escampo","alquilo"]},
  {kind:"blank",focus:"present",cat:"trampas",es:"Hace mucho calor; ¿qué te ___ tomar bien frío?",en:"provoca",tts:"Hace mucho calor; ¿qué te provoca tomar bien frío?",trans:"It's very hot; what do you feel like drinking ice-cold?",choices:["provoca","empaca","madruga","factura"]},
  {kind:"blank",focus:"present",cat:"estratos",es:"Este apartamento queda en ___ cuatro, por eso el recibo de la luz es económico.",en:"estrato",tts:"Este apartamento queda en estrato cuatro, por eso el recibo de la luz es económico.",trans:"This apartment is in socioeconomic tier 4, so the electric bill is affordable.",choices:["estrato","peaje","soroche","guayabo"]},
  {kind:"blank",focus:"past",cat:"odontologia",es:"Ayer masticando se me partió una ___ en una muela de atrás.",en:"calza",tts:"Ayer masticando se me partió una calza en una muela de atrás.",trans:"Yesterday while chewing a filling chipped in a back molar.",choices:["calza","cuadra","cuota","taquilla"]},
  {kind:"blank",focus:"present",cat:"migracion-ce",es:"Para abrir cuenta bancaria como residente necesitas tu cédula de ___.",en:"extranjería",tts:"Para abrir cuenta bancaria como residente necesitas tu cédula de extranjería.",trans:"To open a bank account as a resident you need your foreigner ID card.",choices:["extranjería","panadería","peluquería","ciclovía"]},
  {kind:"blank",focus:"present",cat:"migracion-ce",es:"Vamos a la ___ de la esquina para autenticar la firma del contrato.",en:"notaría",tts:"Vamos a la notaría de la esquina para autenticar la firma del contrato.",trans:"Let's go to the notary office on the corner to notarize the contract signature.",choices:["notaría","salsoteca","lavadora","quebrada"]}
);
// ── V97.0 SAN JUAN DEL CESAR, LA GUAJIRA & REGIONAL / PRACTICAL EXPANSION ──
/* 1. San Juan del Cesar, Sur de La Guajira & Provincia Vallenata in REGIONAL_ATLAS
   2. Interactive 5-Region Same-Intent Switcher (REGIONAL_SWITCHER)
   3. New Branching Roleplay #7: Visita a la familia en San Juan del Cesar
   4. New Guajiro / Costeño items in STREET_EAR_LINKER (13 total) & TRAMPAS_COLOMBIANAS (15 total)
   5. 4 New Full Scenario Tracks (Lessons 69–72, Dialogues 59–62, Readings, Missions, Ladders, Quiz):
      - San Juan del Cesar, La Guajira y parranda vallenata (san-juan-guajira)
      - Seguridad, emergencias (123 / denuncia) y no dar papaya (seguridad-emergencias)
      - Reparaciones del hogar, servicios y técnico en casa (hogar-reparaciones)
      - Fútbol, conciertos, boletas y hacer vaca (eventos-futbol-cultura) */

REGIONAL_ATLAS.splice(3, 0, {
  "id": "sanjuan-guajira",
  "tab": "🪗 San Juan & Guajira (Vallenato)",
  "title": "San Juan del Cesar, Sur de La Guajira & Valledupar (Provincia Vallenata)",
  "vibe": "Warm family hospitality, 'tú' with everyone, 'primo / compadre / manito', front-porch mecedoras by the abanico, friche, and vallenato composer heritage.",
  "items": [
    {
      "category": "👋 Greeting Family & Friends",
      "es": "¡Ajá, primo! ¿Cómo está la vaina? Pasa adelante y siéntate en la mecedora al lado del abanico.",
      "en": "Hey there, cousin/friend! How are things going? Come on in and sit in the rocking chair next to the fan.",
      "tip": "In San Juan del Cesar and southern La Guajira, primo/prima and compadre are affectionate everyday terms for friends and family, and abanico means an electric fan."
    },
    {
      "category": "✨ 'You're kidding! / That's amazing!'",
      "es": "¡No me digas embuste, compadre! ¡Cipote alegría tenerte de visita por San Juan del Cesar!",
      "en": "No way / don't kid me, buddy! What a huge joy to have you visiting San Juan del Cesar!",
      "tip": "Embuste is the signature coastal and Guajiro word for a fib or 'you're kidding,' and cipote intensifies nouns ('huge / tremendous')."
    },
    {
      "category": "🐐 Food & Guajiro Specialties",
      "es": "Hoy preparamos friche y chivo guisado con arroz de camarón, patacón, queso costeño y suero.",
      "en": "Today we made friche (fried goat dish) and stewed goat with shrimp rice, fried green plantain, salty coastal cheese, and sour cream dip.",
      "tip": "Friche and chivo are iconic dishes of La Guajira, and queso costeño con suero accompanies breakfasts and dinners across the Cesar–Guajira valley."
    },
    {
      "category": "🪗 Parranda Vallenata & Compositores",
      "es": "En diciembre vamos pa'l Festival de Compositores en San Juan a escuchar acordeón, caja y guacharaca.",
      "en": "In December we're heading to the Composers Festival in San Juan to listen to accordion, caja drum, and guacharaca.",
      "tip": "San Juan del Cesar is celebrated as the 'Tierra de Compositores' and hosts the Festival Nacional de Compositores de Música Vallenata every December."
    },
    {
      "category": "🪑 Afternoon Terraza Culture",
      "es": "Cuando baje el sol sacamos las mecedoras a la terraza para coger fresco y conversar con la familia.",
      "en": "When the sun goes down we bring the rocking chairs out to the front porch to catch the breeze and chat with the family.",
      "tip": "In San Juan del Cesar, la terraza is the covered front porch at street level (not a rooftop), where family and neighbors gather in the late afternoon breeze."
    }
  ]
});

const REGIONAL_SWITCHER = [
  {
    "id": "reg-greet",
    "intent": "👋 Greeting a close friend or relative warmly",
    "context": "How you open a friendly conversation when arriving at someone's home:",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú + primo/compae", "es": "¡Ajá, primo! ¿Cómo está la vaina? ¿Cómo está la familia?", "en": "Hey, cousin/friend! How's it going? How is the family?", "note": "Warm, direct 'tú' with 'primo/a' or 'compadre' right on the front terraza."},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "usted / sumercé", "es": "¡Hola! ¿Cómo me le va, sumercé? ¿Cómo ha estado?", "en": "Hello! How have you been doing, sumercé?", "note": "Polite, melodic 'usted' or affectionate 'sumercé' with indirect object 'me le'."},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos + parce", "es": "¡Quiubo pues, parce! ¿Cómo vas o qué?", "en": "What's up, buddy! How are you doing?", "note": "Uses 'parce' and sentence-final 'pues' with familiar 'vos/tú'."},
      {"region": "💃 Cali / Valle", "pronoun": "vos + mirá ve", "es": "¿Qué más, vos? Mirá ve, qué alegría verte por acá.", "en": "What's up? Look, what a joy to see you around here.", "note": "Caleño voseo paired with 'mirá ve' and warm hospitality."}
    ]
  },
  {
    "id": "reg-heat-drink",
    "intent": "🥵 Talking about the heat & offering something cold",
    "context": "When the afternoon gets warm (or chilly in Bogotá) and you offer a drink:",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú (Guajiro/Costeño)", "es": "¡Erda, está haciendo un fogaje! Prende el abanico y tómate un jugo de corozo bien frío.", "en": "Whew, it's sweltering! Turn on the fan and have an ice-cold corozo berry juice.", "note": "'Fogaje' = intense heat, 'abanico' = electric fan (never 'ventilador'), and cold fruit juices rule."},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "usted / tú", "es": "¡Uy, qué frío está haciendo hoy! ¿Le provoca un tintico o una aguapanela caliente con queso?", "en": "Ooh, it's chilly today! Would you like a hot black coffee or hot sugarcane water with cheese?", "note": "In high-altitude Bogotá (2,600m), warm 'tintico' and 'aguapanela' replace coastal cold drinks."},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos", "es": "¡Qué calor tan berraco, pues! ¿Te tomás una limonada bien fría o un guarapo?", "en": "What intense heat! Will you have an ice-cold lemonade or sugarcane lime drink?", "note": "Uses 'berraco' for intense and voseo 'te tomás'."},
      {"region": "💃 Cali / Valle", "pronoun": "vos", "es": "A las cuatro empieza la brisa caleña; vamos por una lulada o un champús bien frío, ¿oís?", "en": "At four the Cali breeze starts; let's get an ice-cold lulada or champús, you hear?", "note": "'Lulada' and 'champús' are classic Valle del Cauca afternoon refreshers."}
    ]
  },
  {
    "id": "reg-disbelief",
    "intent": "😲 Saying 'No way! / You're kidding me!'",
    "context": "When someone tells you a surprising story or exaggerates:",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú + compadre", "es": "¡Qué va, primo, no me digas embuste! ¿De verdad pasó esa vaina?", "en": "Come on, cousin, don't tell me fibs! Did that really happen?", "note": "'¡Qué va!' and 'embuste' are signature Sanjuanero and Guajiro expressions for 'you're kidding!'"},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "usted / tú", "es": "¡No me diga eso! ¿En serio? ¡Qué impresión!", "en": "Don't tell me that! Seriously? How wild!", "note": "More measured and polite surprise using '¿en serio?' and '¡qué impresión!'"},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos", "es": "¡Eh, ave María, parce! ¿Me estás hablando en serio pues?", "en": "Whoa, buddy! Are you talking to me seriously?", "note": "'¡Eh, ave María!' is the classic Paisa exclamation of surprise."},
      {"region": "💃 Cali / Valle", "pronoun": "vos", "es": "¡Andá, mirá ve! ¿Cómo así que pasó eso, vos?", "en": "Get out of here, look! How is it that happened?", "note": "'¡Andá!' and '¿cómo así?' anchor Caleño reactions."}
    ]
  },
  {
    "id": "reg-hangout",
    "intent": "🎶 Inviting friends & family to hang out",
    "context": "How you invite people over for music, conversation, and food:",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú", "es": "Vente esta tarde pa' la terraza de la casa; vamos a armar una parranda vallenata con los primos.", "en": "Come over this afternoon to the front porch; we're putting together a vallenato gathering with the cousins.", "note": "A 'parranda vallenata' is a warm home/patio gathering centered on accordion songs and storytelling."},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "tú / usted", "es": "¿Qué plan tienes hoy? Pasemos por unas onces y luego vamos a conversar un ratico.", "en": "What's your plan today? Let's stop for afternoon coffee/snacks and chat for a little bit.", "note": "'Hacer un plan' and 'tomar las onces' are quintessential Bogotá social phrases."},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos", "es": "Caé esta noche a la casa y parchamos en el balcón con los parceros, pues.", "en": "Drop by the house tonight and we'll hang out on the balcony with our friends.", "note": "'Caer' (to drop by) and 'parchar' (to hang out) are everyday Medellín staples."},
      {"region": "💃 Cali / Valle", "pronoun": "vos", "es": "Vení esta noche que vamos a azotar baldosa con buena salsa, ¿oís?", "en": "Come over tonight—we're going to hit the dance floor with great salsa, you hear?", "note": "'Azotar baldosa' literally means 'to whip the floor tiles' (dance salsa passionately)."}
    ]
  }
];

BRANCHING_ROLEPLAYS.push(
  {
    "id": "rp-sanjuan-familia",
    "title": "🪗 Visita en San Juan del Cesar (Guajira)",
    "sub": "Arrive at your wife's family's home in San Juan del Cesar, greet your in-laws on the front porch (terraza), and join the conversation.",
    "turns": [
      {
        "npcEs": "¡Ajá, bienvenido a San Juan del Cesar! Pasa adelante a la terraza y siéntate en la mecedora cerca del abanico. ¿Cómo estuvo ese viaje desde Valledupar?",
        "npcEn": "Hey there, welcome to San Juan del Cesar! Come on onto the front porch and sit in the rocking chair near the fan. How was the trip from Valledupar?",
        "options": [
          {
            "style": "🪗 Sanjuanero / Cálido (Tú)",
            "es": "¡Muchas gracias! Qué alegría estar aquí en San Juan con ustedes. El viaje desde Valledupar estuvo tranquilo y esta brisa en la terraza está sabrosa.",
            "en": "Thank you so much! What a joy to be here in San Juan with you all. The trip from Valledupar was smooth and this breeze on the porch feels great.",
            "replyEs": "¡Así se habla! Aquí en La Guajira esta es tu casa, primo. Ya te traigo un jugo de corozo bien frío.",
            "replyEn": "Now you're talking! Here in La Guajira this is your home, cousin. I'll bring you an ice-cold corozo juice right now.",
            "coach": "Warm, open gratitude and mentioning the breeze on the 'terraza' (front porch) immediately connects with Guajiro hospitality."
          },
          {
            "style": "🙏 Respetuoso con los suegros",
            "es": "Muchas gracias por recibirme con tanto cariño. El camino desde Valledupar es muy bonito y me alegra mucho conocer su tierra.",
            "en": "Thank you very much for welcoming me so warmly. The road from Valledupar is very pretty and I'm so happy to visit your hometown.",
            "replyEs": "¡Tan querido! Siéntate con confianza, que aquí todos somos familia y ya casi está listo el almuerzo.",
            "replyEn": "How sweet! Sit down and make yourself at home—here we're all family and lunch is almost ready.",
            "coach": "Polite warmth works wonderfully with parents-in-law ('suegros') while they invite you to relax like family."
          },
          {
            "style": "🔄 Pivot / Calor costeño",
            "es": "¡Gracias! Está haciendo bastante calorcito hoy; ese abanico me salvó la vida. ¿Me regala un vasito de agua fría, por favor?",
            "en": "Thanks! It's pretty warm today; that electric fan saved my life. Could I have a glass of cold water, please?",
            "replyEs": "¡Claro que sí! Con este fogaje toca prender el abanico en tres. Ya te traigo agua bien helada.",
            "replyEn": "Of course! With this heat we have to turn the fan up to three. I'll bring you ice-cold water right away.",
            "coach": "Using the local word 'abanico' for the electric fan (instead of 'ventilador') shows you know coastal/Guajiro Spanish."
          }
        ]
      },
      {
        "npcEs": "Hoy preparamos friche y arroz de camarón para celebrar que vinieron, y más tarde llegan los primos con un acordeón. ¿Te animas a probar el friche?",
        "npcEn": "Today we made friche (traditional Guajiro goat dish) and shrimp rice to celebrate your visit, and later the cousins are coming over with an accordion. Are you up for trying the friche?",
        "options": [
          {
            "style": "🪗 Sanjuanero / Entusiasta",
            "es": "¡Claro que sí, no me digas embuste! Mi esposa me ha hablado muchísimo del friche y de las parrandas vallenatas de San Juan.",
            "en": "Of course, no kidding! My wife has told me so much about friche and the vallenato gatherings in San Juan.",
            "replyEs": "¡Jajaja, qué bueno! Vas a ver que el friche con patacón y queso costeño te va a encantar.",
            "replyEn": "Hahaha, awesome! You'll see that you're going to love friche with fried plantain and coastal cheese.",
            "coach": "Playfully using '¡no me digas embuste!' and praising your wife's hometown traditions is a guaranteed hit in San Juan del Cesar."
          },
          {
            "style": "🙏 Cortesía familiar",
            "es": "¡Con mucho gusto! Quiero probar un poquito de todo, y qué emoción escuchar vallenato en vivo aquí en la Tierra de Compositores.",
            "en": "Gladly! I want to try a little bit of everything, and how exciting to hear live vallenato here in the Land of Composers.",
            "replyEs": "¡Qué orgullo que sepas eso! San Juan del Cesar es la cuna de grandes compositores del vallenato.",
            "replyEn": "How proud we are that you know that! San Juan del Cesar is the cradle of great vallenato songwriters.",
            "coach": "Calling San Juan del Cesar 'la Tierra de Compositores' honors the town's deepest cultural pride."
          },
          {
            "style": "🔄 Pivot / Empezar suave",
            "es": "Me encantaría probar un poquito del friche y también del arroz de camarón con patacón y queso costeño, muchas gracias.",
            "en": "I'd love to try a little bit of the friche and also the shrimp rice with fried plantain and coastal cheese, thank you so much.",
            "replyEs": "¡Listo! Te sirvo una porción suave con bastante patacón, queso costeño y suero.",
            "replyEn": "Got it! I'll serve you a light portion with plenty of fried plantain, coastal cheese, and sour cream dip.",
            "coach": "Asking to try 'un poquito' lets you taste traditional dishes graciously while pacing yourself."
          }
        ]
      }
    ]
  }
);

STREET_EAR_LINKER.push(
  {
    "id": "ear11",
    "context": "🪗 Greeting a cousin or friend in San Juan del Cesar / La Guajira",
    "carefulEs": "¡Ajá, primo! ¿Cómo está la vaina?",
    "streetEs": "¡Ajá, primo! ¿Cómo etá la vaina?",
    "phoneticHint": "ah-HAH PREE-moh KOH-moh eh-TAH lah BAI-nah",
    "en": "Hey, cousin/friend! How are things going?",
    "tip": "In La Guajira, Cesar, and the Caribbean coast, syllable-final -s in está is softly aspirated or dropped, so ¿cómo está? sounds like ¿cómo etá?"
  },
  {
    "id": "ear12",
    "context": "🪭 Cooling off on a warm afternoon in San Juan del Cesar",
    "carefulEs": "Estoy cansado por el calor; prende el abanico.",
    "streetEs": "Toy cansao por el fogaje; prende el abanico.",
    "phoneticHint": "toy kahn-SAO por ehl foh-GAH-heh PREHN-deh ehl ah-bah-NEE-koh",
    "en": "I'm tired from the heat; turn on the electric fan.",
    "tip": "In coastal and Guajiro speech, estoy often shortens to toy, the -d- in -ado drops (cansao), fogaje means intense heat, and abanico means electric fan."
  },
  {
    "id": "ear13",
    "context": "🚗 Heading from Valledupar to San Juan del Cesar to visit family",
    "carefulEs": "Vamos para San Juan a ver a la familia.",
    "streetEs": "Vamo' pa' San Juan a vé a la familia.",
    "phoneticHint": "BAH-moh pah sahng hwang ah BEH ah lah fah-MEE-lyah",
    "en": "We're going to San Juan to see the family.",
    "tip": "Vamos para contracts to vamo' pa', and infinitive final -r in ver often softens to vé in relaxed Caribbean family conversation."
  }
);

TRAMPAS_COLOMBIANAS.push(
  {
    "trap": "¡No me digas embuste! (Guajira / Costa)",
    "wrongGuess": "Don't ambush me or talk about a statue bust",
    "realMeaning": "Don't lie to me! / You're kidding me! (embuste = a fib, lie, or exaggeration)",
    "es": "¡Qué va, primo, no me digas embuste! ¿De verdad te comiste todo el friche tú solo?",
    "en": "Come on, cousin, don't kid me! Did you really eat all the friche by yourself?",
    "tip": "Across San Juan del Cesar, La Guajira, Cesar, and the Caribbean Coast, embuste (and embustero) is far more common in everyday speech than mentira."
  },
  {
    "trap": "Prender el abanico (Guajira / Costa)",
    "wrongGuess": "To set fire to a small hand-held paper fan",
    "realMeaning": "To turn on the electric standing or ceiling fan (called ventilador in Bogotá/Medellín)",
    "es": "Pasa a la sala y prende el abanico en tres, que hoy está haciendo bastante calor en San Juan.",
    "en": "Come into the living room and turn the electric fan on level three, because it's quite hot in San Juan today.",
    "tip": "In La Guajira and on the Coast, every electric fan is called el abanico, and prender means to switch on an appliance."
  },
  {
    "trap": "Un guineo (Guajira / Costa)",
    "wrongGuess": "Someone from Guinea or a guinea pig",
    "realMeaning": "A banana (either ripe yellow banana or green cooking banana, depending on context)",
    "es": "En el desayuno comimos cayeye de guineo verde con queso costeño rallado y suero.",
    "en": "For breakfast we ate mashed green banana (cayeye) with grated coastal cheese and sour cream dip.",
    "tip": "While the interior of Colombia says banano, people in La Guajira, Cesar, and Magdalena call bananas guineo."
  }
);

FRASES.push(
  {section:"🪗 San Juan del Cesar, La Guajira y vallenato",quizCat:"sanjuan-guajira",cls:"color:var(--gold);background:rgba(232,180,74,0.12);border:1px solid rgba(232,180,74,0.28)",items:[
    {es:"¡Ajá, primo! ¿Cómo está la vaina? Pasa y siéntate en la mecedora al lado del abanico.",en:"Hey, cousin/friend! How are things going? Come in and sit in the rocking chair next to the fan.",register:"San Juan del Cesar · warm greeting"},
    {es:"Por la tardecita sacamos las mecedoras a la terraza para coger fresco y conversar con los suegros.",en:"In the late afternoon we bring the rocking chairs out to the front porch to catch the breeze and chat with the in-laws.",register:"Guajira · terraza culture"},
    {es:"¡No me digas embuste, compadre! ¿De verdad vienen para el Festival de Compositores en diciembre?",en:"Don't kid me, buddy! Are you really coming for the Composers Festival in December?",register:"San Juan del Cesar · embuste"},
    {es:"Hoy almorzamos friche y chivo guisado con arroz de camarón, patacón y queso costeño.",en:"Today we're having fried goat (friche) and stewed goat with shrimp rice, patacón, and salty coastal cheese for lunch.",register:"Guajira & Cesar · food"},
    {es:"El vallenato tradicional se toca con tres instrumentos: acordeón, caja y guacharaca.",en:"Traditional vallenato is played with three instruments: accordion, caja drum, and guacharaca.",register:"Provincia Vallenata · music"},
    {es:"Salimos temprano de Valledupar y en cuarenta y cinco minutos llegamos a San Juan del Cesar.",en:"We leave Valledupar early and in forty-five minutes we arrive in San Juan del Cesar.",register:"Cesar–Guajira route"}
  ]},
  {section:"🚨 Seguridad, emergencias (123) y no dar papaya",quizCat:"seguridad-emergencias",cls:"color:var(--pink);background:rgba(232,93,117,0.1);border:1px solid rgba(232,93,117,0.25)",items:[
    {es:"En la calle es mejor no dar papaya: guarda el celular y revisa siempre la placa antes de subirte al carro.",en:"On the street it's best not to make yourself an easy target: put your phone away and always check the license plate before getting in the car.",register:"Colombian street smarts"},
    {es:"Necesito ayuda, por favor; ¿puede llamar a la línea única de emergencias uno, dos, tres?",en:"I need help, please; can you call the single emergency line 1-2-3?",register:"Emergency · 123 Colombia"},
    {es:"Se me extravió el pasaporte y necesito poner el constancia o denuncia para el seguro y la embajada.",en:"My passport was lost and I need to file an official report for insurance and the embassy.",register:"Lost documents · Policía"},
    {es:"Disculpe, agente, ¿dónde queda el CAI de la policía o la Policía de Turismo más cercana?",en:"Excuse me, officer, where is the nearest neighborhood police post (CAI) or Tourism Police office?",register:"Police assistance"},
    {es:"Por seguridad, prefiero pedir el taxi o el carro por aplicación desde adentro del centro comercial.",en:"For safety, I prefer to order a taxi or ride-share via app from inside the shopping mall.",register:"Safe transport"},
    {es:"Voy a bloquear mis tarjetas inmediatamente desde la aplicación del banco por precaución.",en:"I'm going to lock my cards immediately from the bank app as a precaution.",register:"Banking safety"}
  ]},
  {section:"🔧 Reparaciones del hogar, recibos y técnico",quizCat:"hogar-reparaciones",cls:"color:var(--teal);background:rgba(74,168,160,0.1);border:1px solid rgba(74,168,160,0.25)",items:[
    {es:"Buenos días, se cayó el internet de fibra óptica desde esta mañana; ¿pueden enviar un técnico a revisar el módem?",en:"Good morning, the fiber-optic internet has been down since this morning; can you send a technician to check the router?",register:"Home internet · técnico"},
    {es:"Hay una fuga de agua debajo del lavaplatos y necesitamos que venga un plomero hoy.",en:"There is a water leak under the kitchen sink and we need a plumber to come today.",register:"Plumbing · hogar"},
    {es:"Se saltó el taco de la luz en la cocina; ¿sabe dónde está la caja de tacos del apartamento?",en:"The circuit breaker tripped in the kitchen; do you know where the apartment's breaker box is?",register:"Electricity · los tacos"},
    {es:"Voy a dejar autorizado en la portería el ingreso del técnico del internet para esta tarde.",en:"I'm going to authorize entry at the front desk for the internet technician this afternoon.",register:"Portería · repairs"},
    {es:"Revisemos la fecha límite de pago en el recibo del gas para que no nos vayan a cortar el servicio.",en:"Let's check the payment due date on the gas bill so they don't shut off the service.",register:"Utility bills · recibos"},
    {es:"¿A qué hora aproximada llega el técnico: en la jornada de la mañana o en la tarde?",en:"Around what time will the technician arrive: during the morning window or in the afternoon?",register:"Scheduling repairs"}
  ]},
  {section:"⚽ Fútbol, conciertos, boletas y hacer vaca",quizCat:"eventos-futbol",cls:"color:var(--blue);background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.25)",items:[
    {es:"¿Ya compraste las boletas para el concierto del sábado o todavía quedan en occidental?",en:"Did you already buy the tickets for Saturday's concert or are there still seats left in the west stand?",register:"Concerts & boletas"},
    {es:"Hoy juega la Selección Colombia; ponte la camiseta que vamos a ver el partido donde mis primos.",en:"Today the Colombian National Team plays; put on your jersey because we're going to watch the match at my cousins' place.",register:"Fútbol · Selección"},
    {es:"Hagamos vaca entre todos para pedir las picadas y las cervezas antes del partido.",en:"Let's all pitch in ('hacer vaca') to order the shared meat platters and beers before the match.",register:"Colombian · hacer vaca"},
    {es:"En la entrada del estadio piden la boleta digital en el celular y el documento de identidad.",en:"At the stadium entrance they ask for the digital ticket on your phone and your ID document.",register:"Stadium entry"},
    {es:"¿Dónde hacemos la previa antes de entrar al concierto para no hacer tanta fila?",en:"Where should we do the pre-game/pre-concert hangout before going into the concert so we don't wait in such a long line?",register:"Nightlife · la previa"},
    {es:"¡Qué golazo al último minuto! Todo el barrio salió a celebrar.",en:"What an amazing goal at the last minute! The whole neighborhood came out to celebrate.",register:"Fútbol · celebration"}
  ]}
);

CONVERSATIONS.push(
  v60Dialogue("San Juan del Cesar, La Guajira y parranda vallenata","Visiting your wife's family in San Juan del Cesar, enjoying the front-porch breeze, friche, and vallenato music",[
    ["A","¡Ajá, primo! Bienvenido a San Juan del Cesar. Pasa a la terraza y siéntate en la mecedora que ya prendí el abanico.","Hey, cousin/friend! Welcome to San Juan del Cesar. Come onto the front porch and sit in the rocking chair—I already turned on the fan."],
    ["B","¡Muchas gracias! Qué alegría estar por fin aquí en La Guajira con toda la familia de mi esposa.","Thank you so much! What a joy to finally be here in La Guajira with my wife's whole family."],
    ["A","Aquí te queremos como a un hijo más. ¿Qué te provoca tomar para este calor: un jugo de corozo bien frío o agua de panela con limón?","Here we love you like another son. What do you feel like drinking for this heat: an ice-cold corozo juice or panela limeade?"],
    ["B","Un jugo de corozo bien frío me cae de maravilla. ¡Y huele delicioso en la cocina! ¿Qué están preparando?","An ice-cold corozo juice sounds wonderful. And it smells delicious in the kitchen! What are you cooking?"],
    ["A","Hoy hicimos friche tradicional y arroz de camarón con patacones, queso costeño y suero. ¡No te digo embuste, quedó espectacular!","Today we made traditional friche (fried goat) and shrimp rice with patacones, coastal cheese, and sour cream dip. No kidding, it turned out spectacular!"],
    ["B","¡Qué delicia! Y me contaron que esta noche vienen los tíos con el acordeón para armar una parranda vallenata aquí en la casa.","How delicious! And they told me that tonight the uncles are coming over with the accordion to put together a vallenato gathering right here at the house."]
  ],[{es:"En San Juan del Cesar y La Guajira 'el abanico' es el ventilador eléctrico y 'la terraza' es el porche frente a la calle.",en:"In San Juan del Cesar and La Guajira 'el abanico' is the electric fan and 'la terraza' is the front porch facing the street.",tts:"En San Juan del Cesar y La Guajira el abanico es el ventilador eléctrico y la terraza es el porche frente a la calle."},{es:"'¡No me digas embuste!' significa '¡No me digas mentiras / no me bromees!'",en:"'¡No me digas embuste!' means 'Don't tell me fibs / you're kidding me!'",tts:"No me digas embuste significa No me digas mentiras o no me bromees."}]),
  v60Dialogue("Seguridad, emergencias (123) y no dar papaya","Practicing smart urban habits, verifying ride-share plates, and reporting a lost document",[
    ["A","Oye, antes de salir a caminar por el centro, recuerda el consejo número uno en Colombia: no dar papaya con el celular en la mano.","Hey, before we head out to walk downtown, remember rule number one in Colombia: don't make yourself an easy target with your phone in your hand."],
    ["B","Tienes toda la razón. Si necesito mirar el mapa o contestar un mensaje, mejor entro un momento a un café o centro comercial.","You're totally right. If I need to check the map or answer a message, it's better to step inside a café or mall for a moment."],
    ["A","Exacto. Y cuando pidamos el carro por la aplicación, verificamos primero que la placa y el nombre del conductor coincidan.","Exactly. And when we order the car on the app, we first verify that the license plate and driver's name match."],
    ["B","Una pregunta importante: si algún día tenemos una emergencia médica o policial, ¿a qué número se llama en Colombia?","An important question: if we ever have a medical or police emergency, what number do you call in Colombia?"],
    ["A","En Colombia marcas el uno, dos, tres desde cualquier celular. Y si se te pierde un documento, puedes poner la constancia en la página de la Policía Nacional o ir a un CAI.","In Colombia you dial 1-2-3 from any cell phone. And if you lose a document, you can file a lost-property report on the National Police website or go to a neighborhood CAI post."],
    ["B","¡Súper claro! Con esas precauciones básicas uno anda tranquilo y disfruta muchísimo la ciudad.","Super clear! With those basic precautions you can walk around calmly and really enjoy the city."]
  ],[{es:"El 123 es la línea única de emergencias en Colombia para policía, bomberos y ambulancia.",en:"123 is the unified emergency number in Colombia for police, fire, and ambulance.",tts:"El uno dos tres es la línea única de emergencias en Colombia para policía, bomberos y ambulancia."},{es:"'No dar papaya' significa tomar precauciones básicas y no descuidar objetos de valor en la vía pública.",en:"'No dar papaya' means taking basic street-smart precautions and not leaving valuables exposed in public.",tts:"No dar papaya significa tomar precauciones básicas y no descuidar objetos de valor en la vía pública."}]),
  v60Dialogue("Reparaciones del hogar, recibos y técnico","Scheduling an internet technician, fixing a tripped breaker, and authorizing entry at the portería",[
    ["A","Veci, buenos días. Es que anoche después del aguacero se saltó un taco de la luz y además el módem del internet quedó sin señal.","Neighbor, good morning. Last night after the downpour a circuit breaker tripped and on top of that the internet router lost its signal."],
    ["B","Buenos días. La caja de tacos está detrás de la puerta de la cocina; basta con volver a subir el interruptor que quedó en la mitad.","Good morning. The breaker box is behind the kitchen door; just flip the switch that stopped in the middle back up."],
    ["A","¡Ah, perfecto, ya volvió la luz en la cocina! Pero el internet sigue caído, así que ya agendé visita técnica para hoy en la tarde.","Oh, perfect, the kitchen power is back on! But the internet is still down, so I already scheduled a technician visit for this afternoon."],
    ["B","Listo, recuerde llamar a la portería para dejar autorizado el ingreso del técnico con su nombre y empresa.","Got it, remember to call the front desk to authorize the technician's entry with their name and company."],
    ["A","Ya mismo aviso en portería. También quería preguntarle: ¿este recibo del agua que llegó por debajo de la puerta ya está incluido en el arriendo o se paga aparte?","I'll let the front desk know right now. I also wanted to ask: is this water bill that was slipped under the door included in the rent or paid separately?"],
    ["B","En su contrato los servicios se pagan aparte antes de la fecha límite de pago; puede cancelarlo por PSE o en un corresponsal bancario.","In your lease utilities are paid separately before the due date; you can pay it online via PSE or at a local banking correspondent."]
  ],[{es:"En Colombia a los interruptores del tablero eléctrico se les dice 'los tacos de la luz'.",en:"In Colombia the switches in the electrical breaker box are called 'los tacos de la luz'.",tts:"En Colombia a los interruptores del tablero eléctrico se les dice los tacos de la luz."},{es:"Siempre avisa en portería antes de que llegue un plomero, electricista o técnico.",en:"Always notify the front desk ('portería') before a plumber, electrician, or technician arrives.",tts:"Siempre avisa en portería antes de que llegue un plomero, electricista o técnico."}]),
  v60Dialogue("Fútbol, conciertos, boletas y hacer vaca","Getting tickets for a match or concert, wearing the Selección jersey, and splitting expenses ('hacer vaca')",[
    ["A","¡Oye, este jueves juega la Selección Colombia! ¿Dónde vamos a ver el partido con el combo?","Hey, this Thursday the Colombian National Team is playing! Where are we going to watch the game with the crew?"],
    ["B","Vamos a verlo en la casa de mis primos. Ponte la camiseta amarilla y hacemos vaca entre todos para pedir unas picadas y cervezas.","Let's watch it at my cousins' house. Put on the yellow jersey and we'll all pitch in ('hacer vaca') to order shared meat platters and beers."],
    ["A","¡De una! ¿De a cuánto ponemos para la vaca? ¿Te paso mi parte de una vez por Nequi?","I'm in! How much should we each put in for the pool? Should I send you my share right now on Nequi?"],
    ["B","Sí, pongamos de a cuarenta mil pesos por persona. Oye, ¿y ya compraste las boletas para el concierto del sábado?","Yes, let's put in forty thousand pesos per person. Hey, and did you already buy the tickets for Saturday's concert?"],
    ["A","Sí, alcancé a comprar dos boletas en tribuna occidental. Nos vemos a las seis para hacer la previa cerca del estadio.","Yes, I managed to buy two tickets in the west stand. Let's meet at six to do the pre-concert hangout near the stadium."],
    ["B","¡Qué nota! Lleva la boleta digital descargada en el celular y la cédula para entrar rápido sin fila.","Awesome! Bring the digital ticket downloaded on your phone and your ID so we can get in fast without waiting in line."]
  ],[{es:"'Hacer vaca' significa reunir plata entre varias personas para comprar algo compartido.",en:"'Hacer vaca' means pooling money among several people to buy something shared.",tts:"Hacer vaca significa reunir plata entre varias personas para comprar algo compartido."},{es:"En Colombia a las entradas de un concierto, cine o partido se les dice 'las boletas'.",en:"In Colombia tickets for a concert, movie, or game are called 'las boletas'.",tts:"En Colombia a las entradas de un concierto, cine o partido se les dice las boletas."}])
);

READINGS.push(
  {id:"lectura-sanjuan-guajira",level:"B1",title:"San Juan del Cesar, La Guajira y la Tierra de Compositores",lesson:"san-juan-guajira",intro:"Discover the warm family culture, front-porch terraza life, food, and vallenato heritage of San Juan del Cesar in southern La Guajira.",lines:[
    {es:"San Juan del Cesar está ubicado en el sur de La Guajira, muy cerca de Valledupar, en una región famosa por su hospitalidad familiar y su tradición musical.",en:"San Juan del Cesar is located in southern La Guajira, very close to Valledupar, in a region famous for its family hospitality and musical tradition.",tts:"San Juan del Cesar está ubicado en el sur de La Guajira, muy cerca de Valledupar, en una región famosa por su hospitalidad familiar y su tradición musical."},
    {es:"Conocido como la Tierra de Compositores, el municipio celebra cada diciembre el Festival Nacional de Compositores de Música Vallenata al son de acordeón, caja y guacharaca.",en:"Known as the Land of Composers, the town celebrates the National Festival of Vallenato Composers every December to the sound of accordion, caja drum, and guacharaca.",tts:"Conocido como la Tierra de Compositores, el municipio celebra cada diciembre el Festival Nacional de Compositores de Música Vallenata al son de acordeón, caja y guacharaca."},
    {es:"En la vida diaria, la gente se trata con mucha cercanía usando tú, primo, prima y compadre, y al caer la tarde las familias sacan las mecedoras a la terraza frente a la calle para conversar al fresco.",en:"In daily life, people address each other warmly using 'tú', 'primo', 'prima', and 'compadre', and at dusk families bring rocking chairs out to the front porch ('terraza') to chat in the breeze.",tts:"En la vida diaria, la gente se trata con mucha cercanía usando tú, primo, prima y compadre, y al caer la tarde las familias sacan las mecedoras a la terraza frente a la calle para conversar al fresco."},
    {es:"En la mesa nunca faltan el queso costeño con suero, el patacón, el guineo, el arroz de camarón y platos tradicionales guajiros como el friche y el chivo guisado.",en:"At the table you'll always find salty coastal cheese with sour cream dip, fried green plantain, banana ('guineo'), shrimp rice, and traditional Guajiro dishes like friche and stewed goat.",tts:"En la mesa nunca faltan el queso costeño con suero, el patacón, el guineo, el arroz de camarón y platos tradicionales guajiros como el friche y el chivo guisado."}
  ],questions:[{q:"En San Juan del Cesar y La Guajira, ¿qué significan 'el abanico' y 'la terraza' en una casa?",choices:["El ventilador eléctrico y el porche delantero donde se ponen las mecedoras","El garaje del edificio y el ascensor","El paraguas para la lluvia y el sótano"],answer:"El ventilador eléctrico y el porche delantero donde se ponen las mecedoras"}]},
  {id:"lectura-seguridad-emergencias",level:"A2",title:"No dar papaya, transporte seguro y la línea 123",lesson:"seguridad-emergencias",intro:"Practical, calm street smarts for enjoying Colombian cities safely and handling lost documents or emergencies.",lines:[
    {es:"La expresión colombiana no dar papaya resume una regla práctica de prevención: evitar usar el celular distraído en aceras solas o mostrar objetos de valor sin necesidad.",en:"The Colombian expression 'no dar papaya' sums up a practical prevention rule: avoid using your phone distractedly on quiet sidewalks or flashing valuables unnecessarily.",tts:"La expresión colombiana no dar papaya resume una regla práctica de prevención: evitar usar el celular distraído en aceras solas o mostrar objetos de valor sin necesidad."},
    {es:"Al pedir transporte por aplicación, es buena costumbre esperar adentro del local o edificio y verificar que la placa y el conductor coincidan antes de subir.",en:"When ordering a ride via app, it is a good habit to wait inside the venue or building and verify that the license plate and driver match before getting in.",tts:"Al pedir transporte por aplicación, es buena costumbre esperar adentro del local o edificio y verificar que la placa y el conductor coincidan antes de subir."},
    {es:"En caso de emergencia médica, incendio o situación policial, el número único nacional desde cualquier teléfono en Colombia es el uno, dos, tres.",en:"In case of a medical, fire, or police emergency, the unified national emergency number from any phone in Colombia is 1-2-3.",tts:"En caso de emergencia médica, incendio o situación policial, el número único nacional desde cualquier teléfono en Colombia es el uno, dos, tres."},
    {es:"Si pierdes un documento, puedes registrar la constancia por pérdida en el portal de la Policía Nacional o acudir a un CAI o a la Policía de Turismo para orientación.",en:"If you lose a document, you can file a lost-document report on the National Police portal or visit a neighborhood CAI post or the Tourism Police for guidance.",tts:"Si pierdes un documento, puedes registrar la constancia por pérdida en el portal de la Policía Nacional o acudir a un CAI o a la Policía de Turismo para orientación."}
  ],questions:[{q:"¿Cuál es el número único de emergencias en Colombia y qué significa 'no dar papaya'?",choices:["123; significa tomar precauciones básicas y no descuidar objetos de valor","999; significa regalar fruta en el mercado","411; significa cancelar la cuenta con tarjeta"],answer:"123; significa tomar precauciones básicas y no descuidar objetos de valor"}]},
  {id:"lectura-hogar-reparaciones",level:"B1",title:"Recibos, tacos de la luz y reparaciones en el apartamento",lesson:"hogar-reparaciones",intro:"How to handle power breakers ('tacos'), internet technicians, plumbing repairs, and utility payment dates in Colombia.",lines:[
    {es:"Cuando se va la energía en una parte del apartamento, los colombianos revisan primero si se saltó un taco en la caja de tacos eléctricos.",en:"When the power goes out in part of an apartment, Colombians first check whether a breaker ('taco') tripped in the electrical breaker box.",tts:"Cuando se va la energía en una parte del apartamento, los colombianos revisan primero si se saltó un taco en la caja de tacos eléctricos."},
    {es:"Si necesitas que venga un plomero, un electricista o el técnico del internet a un conjunto cerrado, debes autorizar su ingreso previamente en la portería.",en:"If you need a plumber, electrician, or internet technician to come to a gated complex, you must authorize their entry beforehand at the front desk ('portería').",tts:"Si necesitas que venga un plomero, un electricista o el técnico del internet a un conjunto cerrado, debes autorizar su ingreso previamente en la portería."},
    {es:"Los recibos de agua, energía, gas e internet traen una fecha límite de pago; si pasa esa fecha, la empresa puede generar recargo o suspensión del servicio.",en:"Water, electricity, gas, and internet bills show a payment due date; if that date passes, the utility company may charge a late fee or suspend service.",tts:"Los recibos de agua, energía, gas e internet traen una fecha límite de pago; si pasa esa fecha, la empresa puede generar recargo o suspensión del servicio."},
    {es:"Muchos residentes pagan los recibos en línea por PSE o en efectivo en corresponsales bancarios del barrio.",en:"Many residents pay utility bills online via PSE or in cash at neighborhood banking correspondents.",tts:"Muchos residentes pagan los recibos en línea por PSE o en efectivo en corresponsales bancarios del barrio."}
  ],questions:[{q:"En un apartamento en Colombia, ¿qué significa 'se saltó el taco de la luz'?",choices:["Que se disparó el interruptor del tablero eléctrico","Que llegaron los mariachis a la fiesta","Que subió el precio de la gasolina"],answer:"Que se disparó el interruptor del tablero eléctrico"}]},
  {id:"lectura-eventos-futbol",level:"A2",title:"Pasión por la Selección, boletas y 'hacer vaca'",lesson:"eventos-futbol-cultura",intro:"Understand how Colombians buy concert and soccer tickets ('boletas'), celebrate matches, and pool money ('hacer vaca') with friends.",lines:[
    {es:"Cuando juega la Selección Colombia, es tradición ponerse la camiseta amarilla y reunirse con la familia o los amigos para ver el partido.",en:"When the Colombian National Team plays, it is a tradition to put on the yellow jersey and get together with family or friends to watch the match.",tts:"Cuando juega la Selección Colombia, es tradición ponerse la camiseta amarilla y reunirse con la familia o los amigos para ver el partido."},
    {es:"Para compartir gastos de comida, picadas o bebidas en grupo, los colombianos dicen vamos a hacer vaca, poniendo cada uno su parte en efectivo o por Nequi.",en:"To split the cost of food, shared platters, or drinks in a group, Colombians say 'vamos a hacer vaca', with each person pitching in their share in cash or via Nequi.",tts:"Para compartir gastos de comida, picadas o bebidas en grupo, los colombianos dicen vamos a hacer vaca, poniendo cada uno su parte en efectivo o por Nequi."},
    {es:"A las entradas para el estadio, el cine o un concierto se les llama las boletas, y las tribunas del estadio suelen dividirse en occidental, oriental, norte y sur.",en:"Tickets for the stadium, movies, or a concert are called 'las boletas', and stadium stands are usually divided into west ('occidental'), east ('oriental'), north, and south.",tts:"A las entradas para el estadio, el cine o un concierto se les llama las boletas, y las tribunas del estadio suelen dividirse en occidental, oriental, norte y sur."},
    {es:"Antes de entrar a un concierto o partido nocturno, muchos grupos se reúnen cerca del lugar para hacer la previa y conversar.",en:"Before going into an evening concert or match, many groups meet up near the venue for 'la previa' (pre-event hangout) to chat.",tts:"Antes de entrar a un concierto o partido nocturno, muchos grupos se reúnen cerca del lugar para hacer la previa y conversar."}
  ],questions:[{q:"¿Qué significa la expresión colombiana 'hacer vaca' entre amigos?",choices:["Reunir dinero entre varios para pagar algo compartido","Ir a ordeñar vacas a una finca","Cancelar una reserva de hotel"],answer:"Reunir dinero entre varios para pagar algo compartido"}]}
);

CONVERSATION_MISSIONS.push(
  {id:"mision-sanjuan-guajira",title:"Saluda a tu familia política en San Juan del Cesar (La Guajira)",scenario:"You arrive at your wife's family's house in San Juan del Cesar. Greet your in-laws and cousins on the front porch (terraza), ask them to turn on the fan (abanico), and say you're excited to try friche and hear vallenato.",prompt:"Habla con cariño en la terraza de San Juan del Cesar:",lesson:"san-juan-guajira",models:[
    {es:"¡Ajá, primo! Qué alegría estar aquí en San Juan del Cesar con toda la familia; pasemos a la terraza a sentarnos en las mecedoras al lado del abanico.",en:"Hey, cousin! What a joy to be here in San Juan del Cesar with the whole family; let's go out to the front porch and sit in the rocking chairs next to the fan.",tts:"¡Ajá, primo! Qué alegría estar aquí en San Juan del Cesar con toda la familia; pasemos a la terraza a sentarnos en las mecedoras al lado del abanico."},
    {es:"¡No me digas embuste! Me muero de ganas de probar el friche con patacón y queso costeño y escuchar una parranda vallenata.",en:"No kidding! I'm dying to try the friche with fried plantain and coastal cheese and listen to a vallenato gathering.",tts:"¡No me digas embuste! Me muero de ganas de probar el friche con patacón y queso costeño y escuchar una parranda vallenata."}
  ]},
  {id:"mision-seguridad-emergencias",title:"Aplica 'no dar papaya' y pide ayuda o reporta un documento perdido",scenario:"Tell a friend how to order a ride safely without giving papaya, and ask an officer how to file a report for a lost passport.",prompt:"Explica las medidas de seguridad y haz la consulta:",lesson:"seguridad-emergencias",models:[
    {es:"Pidamos el carro desde adentro del centro comercial para no dar papaya en la calle y revisemos bien la placa antes de subir.",en:"Let's order the car from inside the mall so we don't make ourselves a target on the street, and let's check the license plate carefully before getting in.",tts:"Pidamos el carro desde adentro del centro comercial para no dar papaya en la calle y revisemos bien la placa antes de subir."},
    {es:"Disculpe, agente, se me extravió el pasaporte; ¿puedo poner la constancia en el portal de la Policía Nacional o en el CAI?",en:"Excuse me, officer, my passport was lost; can I file the report on the National Police portal or at the CAI post?",tts:"Disculpe, agente, se me extravió el pasaporte; ¿puedo poner la constancia en el portal de la Policía Nacional o en el CAI?"}
  ]},
  {id:"mision-hogar-reparaciones",title:"Coordina un técnico de internet o plomero y autorízalo en portería",scenario:"Your apartment internet dropped or a breaker tripped. Explain the issue and authorize the technician at the building front desk.",prompt:"Habla con el soporte técnico y con la portería:",lesson:"hogar-reparaciones",models:[
    {es:"Buenos días, se saltó un taco de la luz y además el módem de fibra óptica quedó sin señal; ¿pueden enviar un técnico hoy en la tarde?",en:"Good morning, a circuit breaker tripped and the fiber-optic router also lost signal; can you send a technician this afternoon?",tts:"Buenos días, se saltó un taco de la luz y además el módem de fibra óptica quedó sin señal; ¿pueden enviar un técnico hoy en la tarde?"},
    {es:"Veci, llamo a la portería para dejar autorizado el ingreso del técnico del internet que viene entre las dos y las cinco.",en:"Neighbor, I'm calling the front desk to authorize entry for the internet technician who is coming between two and five.",tts:"Veci, llamo a la portería para dejar autorizado el ingreso del técnico del internet que viene entre las dos y las cinco."}
  ]},
  {id:"mision-eventos-futbol",title:"Compra boletas y propón 'hacer vaca' para el partido de la Selección",scenario:"Invite friends to watch the Colombian National Team match or go to a concert, ask about tickets ('boletas'), and propose pooling money ('hacer vaca').",prompt:"Organiza el plan con tus amigos:",lesson:"eventos-futbol-cultura",models:[
    {es:"¡Hoy juega la Selección Colombia! Ponte la camiseta amarilla y hacemos vaca entre todos por Nequi para pedir las picadas.",en:"Today the Colombian National Team plays! Put on the yellow jersey and let's all pool money via Nequi to order the shared meat platters.",tts:"¡Hoy juega la Selección Colombia! Ponte la camiseta amarilla y hacemos vaca entre todos por Nequi para pedir las picadas."},
    {es:"Ya tengo las boletas digitales en el celular para la tribuna occidental; nos vemos a las seis para hacer la previa.",en:"I already have the digital tickets on my phone for the west stand; see you at six for the pre-game hangout.",tts:"Ya tengo las boletas digitales en el celular para la tribuna occidental; nos vemos a las seis para hacer la previa."}
  ]}
);

Object.assign(LESSON_CONTENT,{
  "san-juan-guajira":{
    goal:{es:"¡Ajá, primo! Pasemos a la terraza a sentarnos en la mecedora al lado del abanico mientras sale el friche.",en:"Hey, cousin! Let's go onto the front porch and sit in the rocking chair next to the fan while the friche finishes cooking."},
    words:[{es:"¡ajá, primo / compadre!",en:"hey cousin / buddy! (warm Guajiro address)"},{es:"la terraza y la mecedora",en:"front porch & rocking chair"},{es:"el abanico",en:"electric fan (coastal word for ventilador)"},{es:"¡no me digas embuste!",en:"don't kid me / don't tell fibs!"},{es:"el friche y el queso costeño",en:"traditional fried goat dish & salty coastal cheese"},{es:"la parranda vallenata",en:"home/patio vallenato music gathering"}],
    phrases:[{en:"Hey cousin, how are things going?",es:"¡Ajá, primo! ¿Cómo está la vaina?"},{en:"Turn on the fan because it's hot today.",es:"Prende el abanico que hoy está haciendo calor."},{en:"Don't kid me, buddy!",es:"¡No me digas embuste, compadre!"},{en:"San Juan del Cesar is the Land of Vallenato Composers.",es:"San Juan del Cesar es la Tierra de Compositores del vallenato."}]
  },
  "seguridad-emergencias":{
    goal:{es:"Para no dar papaya, pidamos el carro desde adentro y revisemos la placa antes de subir.",en:"So we don't make ourselves an easy target, let's order the ride from inside and check the license plate before getting in."},
    words:[{es:"no dar papaya",en:"don't leave yourself vulnerable / use street smarts"},{es:"la línea 123",en:"Colombia's unified emergency number (1-2-3)"},{es:"el CAI / Policía de Turismo",en:"neighborhood police post / Tourism Police"},{es:"la denuncia / constancia",en:"official police or lost-property report"},{es:"verificar la placa",en:"to check the vehicle license plate"},{es:"bloquear la tarjeta",en:"to lock/freeze your bank card"}],
    phrases:[{en:"Don't take your phone out on a lonely street; don't give papaya.",es:"No saques el celular en una calle sola; no des papaya."},{en:"Can you call the 1-2-3 emergency line, please?",es:"¿Puede llamar a la línea de emergencias uno, dos, tres, por favor?"},{en:"Always check the license plate before getting into the car.",es:"Revisa siempre la placa antes de subirte al carro."},{en:"Where is the nearest neighborhood police post (CAI)?",es:"¿Dónde queda el CAI de la policía más cercano?"}]
  },
  "hogar-reparaciones":{
    goal:{es:"Se saltó un taco de la luz y voy a dejar autorizado en portería el ingreso del técnico.",en:"A circuit breaker tripped and I'm going to authorize the technician's entry at the front desk."},
    words:[{es:"los tacos de la luz",en:"electrical circuit breakers"},{es:"el plomero / el técnico",en:"plumber / internet or appliance technician"},{es:"hay una fuga / gotera",en:"there is a pipe leak / roof drip"},{es:"se cayó el internet",en:"the internet went down"},{es:"la fecha límite de pago",en:"utility bill payment due date"},{es:"autorizar en portería",en:"to authorize visitor entry at the front desk"}],
    phrases:[{en:"A circuit breaker tripped in the kitchen.",es:"Se saltó un taco de la luz en la cocina."},{en:"The internet has been down since this morning.",es:"Se cayó el internet desde esta mañana."},{en:"I'll authorize the technician's entry at the front desk.",es:"Voy a dejar autorizado en la portería el ingreso del técnico."},{en:"When is the payment due date on the electricity bill?",es:"¿Cuándo es la fecha límite de pago del recibo de la luz?"}]
  },
  "eventos-futbol-cultura":{
    goal:{es:"Ponte la camiseta de la Selección y hacemos vaca entre todos para las picadas y las boletas.",en:"Put on the National Team jersey and let's all pool money for the shared platters and the tickets."},
    words:[{es:"hacer vaca",en:"to pitch in / pool money as a group"},{es:"las boletas",en:"tickets (for a concert, match, or movie)"},{es:"la Selección Colombia",en:"the Colombian National Soccer Team"},{es:"la previa",en:"pre-game or pre-concert hangout"},{es:"tribuna occidental / oriental",en:"west / east stadium stand"},{es:"una picada",en:"shared platter of grilled meats, patacón, and arepa"}],
    phrases:[{en:"Let's all pitch in ('hacer vaca') to order food.",es:"Hagamos vaca entre todos para pedir comida."},{en:"Did you already buy the tickets for the concert?",es:"¿Ya compraste las boletas para el concierto?"},{en:"Today the Colombian National Team is playing!",es:"¡Hoy juega la Selección Colombia!"},{en:"How much do we each put in for the group pool?",es:"¿De a cuánto ponemos para la vaca?"}]
  }
});

Object.assign(LESSON_META,{
  "san-juan-guajira":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Citas, cumplidos y la familia",dialogue:"San Juan del Cesar, La Guajira y parranda vallenata",vocab:"familia",quizCat:"sanjuan-guajira",quizMode:"conversation",guideIds:["usted-tu-vos","cortesia-colombiana"],readingId:"lectura-sanjuan-guajira",missionId:"mision-sanjuan-guajira"},
  "seguridad-emergencias":{stage:"Travel and Survival",difficulty:"Easy",prereq:"Direcciones, cuadras y seguridad",dialogue:"Seguridad, emergencias (123) y no dar papaya",vocab:"direcciones",quizCat:"seguridad-emergencias",quizMode:"conversation",guideIds:["cortesia-colombiana","por-para"],readingId:"lectura-seguridad-emergencias",missionId:"mision-seguridad-emergencias"},
  "hogar-reparaciones":{stage:"Daily Life",difficulty:"Easy",prereq:"Portería, domicilios y paquetes",dialogue:"Reparaciones del hogar, recibos y técnico",vocab:"casa",quizCat:"hogar-reparaciones",quizMode:"conversation",guideIds:["se-me","cortesia-colombiana"],readingId:"lectura-hogar-reparaciones",missionId:"mision-hogar-reparaciones"},
  "eventos-futbol-cultura":{stage:"Speak More Naturally",difficulty:"Easy",prereq:"Puentes festivos, salsa y rumba",dialogue:"Fútbol, conciertos, boletas y hacer vaca",vocab:"colombianismos",quizCat:"eventos-futbol",quizMode:"conversation",guideIds:["futuro","gustar"],readingId:"lectura-eventos-futbol",missionId:"mision-eventos-futbol"}
});

Object.assign(SENTENCE_LADDERS,{
  "san-juan-guajira":{
    title:"Connect with family in San Juan del Cesar & La Guajira on the terraza and at a parranda vallenata",
    rungs:[
      {tag:"1. Anchor greeting",es:"¡Ajá, primo! ¿Cómo está la vaina?",en:"Hey, cousin/friend! How are things going?"},
      {tag:"2. + Terraza & abanico",es:"¡Ajá, primo! Pasa a la terraza y siéntate en la mecedora al lado del abanico.",en:"Hey, cousin! Come onto the front porch and sit in the rocking chair next to the fan."},
      {tag:"3. + Friche & queso costeño",es:"Hoy preparamos friche y arroz de camarón con patacón, queso costeño y suero.",en:"Today we made friche and shrimp rice with fried plantain, coastal cheese, and sour cream dip."},
      {tag:"4. + Parranda vallenata",es:"¡No me digas embuste! Después del almuerzo llegan los tíos con el acordeón para armar la parranda vallenata aquí en San Juan del Cesar.",en:"No kidding! After lunch the uncles are coming over with the accordion to start the vallenato gathering right here in San Juan del Cesar."}
    ],
    swaps:[
      {label:"Festival de Compositores",es:"En diciembre vamos para el Festival de Compositores en San Juan del Cesar.",en:"In December we're going to the Composers Festival in San Juan del Cesar."},
      {label:"Cold corozo juice",es:"Con este fogaje me provoca un jugo de corozo bien helado.",en:"With this heat I feel like an ice-cold corozo berry juice."},
      {label:"Valledupar route",es:"De Valledupar a San Juan del Cesar son unos cuarenta y cinco minutos por carretera.",en:"From Valledupar to San Juan del Cesar is about forty-five minutes by road."}
    ]
  },
  "seguridad-emergencias":{
    title:"Practice calm Colombian street smarts ('no dar papaya') and handle emergencies or lost documents",
    rungs:[
      {tag:"1. Anchor rule",es:"Es mejor no dar papaya en la calle.",en:"It's better not to make yourself an easy target on the street."},
      {tag:"2. + Ride-share check",es:"Para no dar papaya, pidamos el carro desde adentro y revisemos la placa.",en:"To stay street-smart, let's order the car from inside and check the license plate."},
      {tag:"3. + 123 emergency line",es:"Si pasa alguna emergencia, llamamos de una vez a la línea uno, dos, tres.",en:"If any emergency happens, we call the 1-2-3 emergency line right away."},
      {tag:"4. + Lost passport report",es:"Disculpe, agente, se me extravió el pasaporte y necesito poner la constancia para la embajada y el seguro.",en:"Excuse me, officer, my passport was lost and I need to file the official report for the embassy and insurance."}
    ],
    swaps:[
      {label:"Find nearest CAI",es:"¿Dónde queda el CAI de la policía o la Policía de Turismo más cercana?",en:"Where is the nearest neighborhood police post or Tourism Police office?"},
      {label:"Freeze bank card",es:"Voy a congelar mi tarjeta inmediatamente desde la aplicación del banco.",en:"I'm going to freeze my card immediately from the bank app."},
      {label:"Step inside to check phone",es:"Entremos un momento a esta cafetería para mirar el mapa en el celular.",en:"Let's step into this café for a moment to check the map on my phone."}
    ]
  },
  "hogar-reparaciones":{
    title:"Coordinate home repairs, electrical breakers ('tacos'), and building front-desk authorization",
    rungs:[
      {tag:"1. Anchor stem",es:"Se saltó un taco de la luz.",en:"A circuit breaker tripped."},
      {tag:"2. + Internet router",es:"Se saltó un taco de la luz y el módem del internet quedó sin señal.",en:"A circuit breaker tripped and the internet router lost signal."},
      {tag:"3. + Schedule technician",es:"¿Pueden enviar un técnico de internet hoy en la jornada de la tarde?",en:"Can you send an internet technician today during the afternoon window?"},
      {tag:"4. + Authorize at portería",es:"Voy a llamar a la portería del conjunto para dejar autorizado el ingreso del técnico esta tarde.",en:"I'm going to call the complex front desk to authorize the technician's entry this afternoon."}
    ],
    swaps:[
      {label:"Plumber for water leak",es:"Hay una fuga de agua debajo del lavaplatos; necesitamos un plomero.",en:"There is a water leak under the kitchen sink; we need a plumber."},
      {label:"Utility due date",es:"Paguemos el recibo del agua antes de la fecha límite para evitar el corte.",en:"Let's pay the water bill before the due date to avoid shutoff."},
      {label:"Pay via PSE",es:"Ya cancelé los recibos de luz y gas en línea por PSE.",en:"I already paid the electricity and gas bills online via PSE."}
    ]
  },
  "eventos-futbol-cultura":{
    title:"Buy concert or soccer tickets ('boletas') and pool money ('hacer vaca') with friends",
    rungs:[
      {tag:"1. Anchor stem",es:"¿Ya compraste las boletas?",en:"Did you already buy the tickets?"},
      {tag:"2. + Stadium section",es:"Ya compré las boletas digitales en tribuna occidental para el partido.",en:"I already bought the digital tickets in the west stand for the match."},
      {tag:"3. + Hacer vaca",es:"Hagamos vaca entre todos por Nequi para pedir las picadas y las bebidas.",en:"Let's all pitch in via Nequi to order the shared meat platters and drinks."},
      {tag:"4. + La previa",es:"Ponte la camiseta de la Selección y nos vemos a las cinco para hacer la previa antes de entrar al estadio.",en:"Put on your National Team jersey and let's meet at five for the pre-game hangout before going into the stadium."}
    ],
    swaps:[
      {label:"How much per person?",es:"¿De a cuánto nos toca poner para la vaca de hoy?",en:"How much does each of us need to pitch in for today's group pool?"},
      {label:"Digital ticket & ID",es:"Ten lista la boleta en el celular y la cédula en la entrada.",en:"Have your ticket ready on your phone and your ID at the entrance."},
      {label:"Last-minute goal",es:"¡Qué golazo metieron al último minuto del partido!",en:"What an amazing goal they scored in the final minute of the match!"}
    ]
  }
});

/* 6. 8 More High-Frequency Colombianismos & Guajiro/Costeño Gems (86 total) */
COLOMBIANISMOS.push(
  {word:"¡Ajá, primo / compadre!",en:"Hey cousin / buddy! (warm Guajiro & Vallenato address)",region:"costa",register:"San Juan del Cesar & Guajira · warm",registerGroup:"everyday",usage:"In San Juan del Cesar, La Guajira, and Cesar, 'primo/prima' and 'compadre/compae' are used affectionately every day with relatives, in-laws, and friends.",example:"¡Ajá, primo! ¿Cómo está la vaina por San Juan del Cesar?",tts:"¡Ajá, primo! ¿Cómo está la vaina por San Juan del Cesar?"},
  {word:"Embuste / Embustero",en:"A fib, lie, or exaggeration ('You're kidding!')",region:"costa",register:"Guajira & Costa · essential",registerGroup:"informal",usage:"In San Juan del Cesar and across the Coast, people say '¡Eso es embuste!' or '¡No me digas embuste!' instead of 'mentira'.",example:"¡Qué va, compadre, no me digas embuste!",tts:"¡Qué va, compadre, no me digas embuste!"},
  {word:"El abanico (Costa / Guajira)",en:"Electric standing or ceiling fan (ventilador)",region:"costa",register:"Guajira & Costa · daily life",registerGroup:"everyday",usage:"While Bogotá and Medellín say 'ventilador', in San Juan del Cesar and the Caribbean coast every electric fan is called 'el abanico'.",example:"Prende el abanico en tres que está haciendo mucho fogaje.",tts:"Prende el abanico en tres que está haciendo mucho fogaje."},
  {word:"La terraza y la mecedora",en:"Street-level front porch & rocking chair",region:"costa",register:"San Juan del Cesar · family culture",registerGroup:"everyday",usage:"In Guajiro and Vallenato towns, 'la terraza' is the shaded front porch where families sit in 'mecedoras' (rocking chairs) in the late afternoon breeze.",example:"Vamos a sentarnos en las mecedoras de la terraza a coger fresco.",tts:"Vamos a sentarnos en las mecedoras de la terraza a coger fresco."},
  {word:"El friche (La Guajira)",en:"Traditional Guajiro fried & seasoned goat dish",region:"costa",register:"La Guajira · culinary heritage",registerGroup:"everyday",usage:"Emblematic dish of La Guajira (including San Juan del Cesar and Riohacha), typically served with patacón, yuca, or arroz de camarón.",example:"En el almuerzo familiar en San Juan preparamos friche con patacones.",tts:"En el almuerzo familiar en San Juan preparamos friche con patacones."},
  {word:"Hacer vaca",en:"To pitch in / pool money together as a group",region:"all",register:"Colombian · social",registerGroup:"everyday",usage:"Used nationwide when friends or family chip in money to buy shared food, drinks, or a gift ('¿De a cuánto es la vaca?').",example:"Hagamos vaca entre todos para comprar la picada y las gaseosas.",tts:"Hagamos vaca entre todos para comprar la picada y las gaseosas."},
  {word:"Los tacos (de la luz)",en:"Electrical circuit breakers in a home",region:"all",register:"Colombian · home repairs",registerGroup:"everyday",usage:"When the power trips in an apartment, Colombians say 'se saltó un taco' or 'se bajaron los tacos de la luz'.",example:"Se saltó el taco de la cocina cuando prendimos el horno.",tts:"Se saltó el taco de la cocina cuando prendimos el horno."},
  {word:"Las boletas",en:"Tickets for a concert, soccer match, or movie",region:"all",register:"Colombian · events & culture",registerGroup:"everyday",usage:"In Colombia, event and movie tickets are called 'boletas' (while plane or long-distance bus tickets are 'tiquetes').",example:"Ya compré las boletas para el concierto y el partido del domingo.",tts:"Ya compré las boletas para el concierto y el partido del domingo."}
);

/* 7. 13th 3-Column Slot-Swapper Matrix: San Juan del Cesar, La Guajira & Familia */
SLOT_SWAP_MATRICES.push(
  {
    id:"sanjuan-guajira-matrix",
    title:"🪗 San Juan del Cesar, Guajira & Parranda",
    sub:"Speak warm Sanjuanero / Guajiro Spanish on the terraza with your wife's family, in-laws, and cousins",
    col1Title:"1. Warm Guajiro Opener",
    col2Title:"2. Terraza, Food or Music",
    col3Title:"3. Family & Vallenato Close",
    col1:[
      {es:"¡Ajá, primo! Qué alegría verte;",en:"Hey, cousin! What a joy to see you;"},
      {es:"Buenas tardes, suegros queridos,",en:"Good afternoon, dear in-laws,"},
      {es:"¡No me digas embuste, compadre!",en:"No kidding, buddy!"},
      {es:"Cuando baje el sol esta tardecita,",en:"When the sun goes down late this afternoon,"}
    ],
    col2:[
      {es:"pasemos a la terraza a sentarnos en las mecedoras",en:"let's head out to the front porch to sit in the rocking chairs"},
      {es:"prendamos el abanico y tomemos un jugo de corozo frío",en:"let's turn on the fan and drink an ice-cold corozo juice"},
      {es:"me provoca probar ese friche con patacón y queso costeño",en:"I'd love to try that friche with fried plantain and coastal cheese"},
      {es:"se arma la parranda vallenata con acordeón y guacharaca",en:"the vallenato gathering gets going with accordion and guacharaca"}
    ],
    col3:[
      {es:"aquí en San Juan del Cesar con toda la familia.",en:"right here in San Juan del Cesar with the whole family."},
      {es:"mientras corre la brisa fresca de La Guajira.",en:"while the cool Guajira breeze blows."},
      {es:"para celebrar en la Tierra de Compositores.",en:"to celebrate in the Land of Composers."},
      {es:"y conversamos sabroso con los tíos y los primos.",en:"and have a wonderful chat with the aunts, uncles, and cousins."}
    ]
  }
);

/* 8. New Quiz Items for v97 Scenarios (San Juan/Guajira, Seguridad/123, Hogar/Reparaciones, Eventos/Fútbol) */
V60_CONVERSATION_QUIZ.push(
  {kind:"reply",focus:"present",cat:"sanjuan-guajira",es:"¡Ajá, primo! Bienvenido a San Juan del Cesar; pasa a la terraza y siéntate en la mecedora al lado del abanico.",en:"¡Muchas gracias! Qué alegría estar aquí en La Guajira con toda la familia y disfrutar la brisa.",tts:"¡Ajá, primo! Bienvenido a San Juan del Cesar; pasa a la terraza y siéntate en la mecedora al lado del abanico.",choices:["¡Muchas gracias! Qué alegría estar aquí en La Guajira con toda la familia y disfrutar la brisa.","Cuenta de ahorros a una sola cuota, por favor.","Se me partió una calza en una muela de atrás.","El edificio está clasificado en estrato cuatro."]},
  {kind:"meaning",focus:"present",cat:"sanjuan-guajira",es:"¡No me digas embuste, compadre! Hoy almorzamos friche con patacón y queso costeño.",en:"Don't kid me, buddy! Today we're having traditional fried goat with fried plantain and coastal cheese for lunch.",tts:"¡No me digas embuste, compadre! Hoy almorzamos friche con patacón y queso costeño.",choices:["Don't kid me, buddy! Today we're having traditional fried goat with fried plantain and coastal cheese for lunch.","Please notarize the lease agreement at the notary office.","The circuit breaker tripped in the kitchen last night.","Remember to register your visa within fifteen calendar days."]},
  {kind:"reply",focus:"present",cat:"seguridad-emergencias",es:"Disculpe, se me extravió el pasaporte y necesito el reporte para el seguro y la embajada.",en:"Puede registrar la constancia por pérdida en la página de la Policía Nacional o acercarse al CAI.",tts:"Disculpe, se me extravió el pasaporte y necesito el reporte para el seguro y la embajada.",choices:["Puede registrar la constancia por pérdida en la página de la Policía Nacional o acercarse al CAI.","Con sopa de ajiaco y de principio lentejas.","En leche y bajito de azúcar, por favor.","Con la máquina número dos a los lados."]},
  {kind:"meaning",focus:"present",cat:"seguridad-emergencias",es:"Para no dar papaya, pidamos el carro desde adentro y revisemos la placa antes de subir.",en:"So we don't make ourselves an easy target, let's order the car from inside and check the license plate before getting in.",tts:"Para no dar papaya, pidamos el carro desde adentro y revisemos la placa antes de subir.",choices:["So we don't make ourselves an easy target, let's order the car from inside and check the license plate before getting in.","Let's buy two pounds of sweet papaya at the neighborhood fruit stand.","Can you tighten the tiny screw on my eyeglasses frame?","The master bedroom faces the interior garden of the gated complex."]},
  {kind:"reply",focus:"past",cat:"hogar-reparaciones",es:"Veci, se fue la luz en la cocina después del aguacero; ¿qué pudo pasar?",en:"Revisa la caja de tacos detrás de la puerta; seguro se saltó un taco de la luz.",tts:"Veci, se fue la luz en la cocina después del aguacero; ¿qué pudo pasar?",choices:["Revisa la caja de tacos detrás de la puerta; seguro se saltó un taco de la luz.","De sobremesa me regala jugo de maracuyá.","A una sola cuota sin intereses, por favor.","Vamos a bailar salsa este puente festivo."]},
  {kind:"meaning",focus:"present",cat:"hogar-reparaciones",es:"Voy a dejar autorizado en la portería el ingreso del técnico del internet para esta tarde.",en:"I'm going to authorize entry at the front desk for the internet technician this afternoon.",tts:"Voy a dejar autorizado en la portería el ingreso del técnico del internet para esta tarde.",choices:["I'm going to authorize entry at the front desk for the internet technician this afternoon.","I'm going to request a 90-day extension of my tourist permit.","We're going to watch the soccer match in the west stand.","I'd like a self-pay dental cleaning appointment."]},
  {kind:"reply",focus:"present",cat:"eventos-futbol",es:"¡Hoy juega la Selección Colombia! ¿Cómo hacemos para pedir las picadas y las bebidas?",en:"Hagamos vaca entre todos de a cuarenta mil pesos por Nequi.",tts:"¡Hoy juega la Selección Colombia! ¿Cómo hacemos para pedir las picadas y las bebidas?",choices:["Hagamos vaca entre todos de a cuarenta mil pesos por Nequi.","Se me cayó una calza masticando algo duro.","Necesito autenticar la firma en la notaría.","Por la EPS toca pedir cita con médico general."]},
  {kind:"meaning",focus:"present",cat:"eventos-futbol",es:"Ya compré las boletas digitales en tribuna occidental para el concierto del sábado.",en:"I already bought the digital tickets in the west stand for Saturday's concert.",tts:"Ya compré las boletas digitales en tribuna occidental para el concierto del sábado.",choices:["I already bought the digital tickets in the west stand for Saturday's concert.","I already paid the water and electricity bills online.","The bus leaves from platform four at the terminal.","Turn on the electric fan because it's very hot today."]}
);

V60_FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"present",cat:"sanjuan-guajira",es:"En San Juan del Cesar sacamos las ___ a la terraza para coger fresco en la tarde.",en:"mecedoras",tts:"En San Juan del Cesar sacamos las mecedoras a la terraza para coger fresco en la tarde.",trans:"In San Juan del Cesar we bring the rocking chairs out to the front porch to catch the afternoon breeze.",choices:["mecedoras","calzas","cuotas","taquillas"]},
  {kind:"blank",focus:"present",cat:"sanjuan-guajira",es:"¡Qué va, primo, no me digas ___! ¿De verdad vienen para el Festival de Compositores?",en:"embuste",tts:"¡Qué va, primo, no me digas embuste! ¿De verdad vienen para el Festival de Compositores?",trans:"Come on, cousin, don't kid me / tell fibs! Are you really coming for the Composers Festival?",choices:["embuste","estrato","soroche","peaje"]},
  {kind:"blank",focus:"present",cat:"sanjuan-guajira",es:"Prende el ___ en tres que hoy está haciendo bastante calor en La Guajira.",en:"abanico",tts:"Prende el abanico en tres que hoy está haciendo bastante calor en La Guajira.",trans:"Turn the electric fan on three because it's quite hot in La Guajira today.",choices:["abanico","datáfono","corrientazo","parqueadero"]},
  {kind:"blank",focus:"present",cat:"seguridad-emergencias",es:"No saques el celular en una calle sola; es mejor no dar ___.",en:"papaya",tts:"No saques el celular en una calle sola; es mejor no dar papaya.",trans:"Don't take out your phone on a quiet street; it's better not to make yourself an easy target.",choices:["papaya","vaca","calza","cuadra"]},
  {kind:"blank",focus:"past",cat:"hogar-reparaciones",es:"Se fue la energía en la cocina porque se saltó un ___ de la luz.",en:"taco",tts:"Se fue la energía en la cocina porque se saltó un taco de la luz.",trans:"The power went out in the kitchen because a circuit breaker tripped.",choices:["taco","puente","tinto","estrato"]},
  {kind:"blank",focus:"present",cat:"eventos-futbol",es:"Hagamos ___ entre todos para comprar las picadas y ver el partido de la Selección.",en:"vaca",tts:"Hagamos vaca entre todos para comprar las picadas y ver el partido de la Selección.",trans:"Let's all pitch in / pool money to buy the shared platters and watch the National Team match.",choices:["vaca","fila","pena","fórmula"]}
);

// ── V98.0 GE API VISUAL GUIDES, ILLUSTRATED REGIONS & EXTRA NT-HEAVY ROLEPLAYS / SWITCHER ──
const REGION_IMAGES = {
  "sanjuan-guajira": "region-sanjuan.webp",
  "bogota": "region-bogota.webp",
  "medellin": "region-medellin.webp",
  "costa": "region-costa.webp",
  "cali": "region-cali.webp"
};

const ROLEPLAY_IMAGES = {
  "rp-tienda-napa": "guide-trampas.webp",
  "rp-sanjuan-familia": "region-sanjuan.webp",
  "rp-sanjuan-parranda": "guide-sanjuan.webp",
  "rp-corrientazo": "guide-corrientazo.webp",
  "rp-taxi": "guide-grid.webp",
  "rp-uber": "region-bogota.webp",
  "rp-panaderia": "guide-trampas.webp",
  "rp-drogueria": "region-medellin.webp",
  "rp-cita": "region-cali.webp"
};

const VISUAL_GUIDES = [
  {
    id: "vg-grid",
    title: "🧭 Calle vs. Carrera (City Grid)",
    sub: "How Colombian street numbers like Cra 7 # 72-41 actually work",
    img: "guide-grid.webp",
    alt: "Colombian city street grid infographic showing Calle 72, Carrera 7, pin Cra 7 # 72-41, and compass Norte and Cerros",
    caption: "In Bogotá and most Colombian cities, Calles run crosswise (East–West toward the Cerros), Carreras run parallel (North–South), and '# 72-41' means on Carrera 7 about 41 meters past Calle 72.",
    es: "Disculpe, ¿la Carrera Séptima con Calle Setenta y Dos queda hacia los cerros?",
    en: "Excuse me, is Carrera 7 and Calle 72 up toward the eastern mountains?",
    region: "Nacional / Bogotá"
  },
  {
    id: "vg-corrientazo",
    title: "🍽️ El Corrientazo (Daily Lunch)",
    sub: "Sopa · Principio · Proteína · Tajadas · Sobremesa",
    img: "guide-corrientazo.webp",
    alt: "Overhead educational plate diagram of a Colombian corrientazo daily lunch labeled Sopa, Principio, Proteina, Tajadas, and Sobremesa",
    caption: "Colombia's everyday budget lunch follows five classic parts: Sopa (starter soup), Principio (beans, lentils, or rice side), Proteína (chicken, beef, or pork), Tajadas (sweet fried plantain), and Sobremesa (fresh fruit juice or mazamorra).",
    es: "Buenas tardes, ¿qué tiene de principio y de sobremesa con el corrientazo de hoy?",
    en: "Good afternoon, what do you have for the side (principio) and drink (sobremesa) with today's daily lunch?",
    region: "Todo Colombia"
  },
  {
    id: "vg-trampas",
    title: "🪤 Trampas de Colombia (Bakery Sign)",
    sub: "Cancelar · ¿Qué te provoca? · ¿Me regala…?",
    img: "guide-trampas.webp",
    alt: "Colombian neighborhood bakery chalkboard guide listing cancelar = pay the bill, que te provoca = what do you crave, me regala = can I order",
    caption: "Three daily phrases that fool textbook learners: 'cancelar' usually means to pay (not cancel!), '¿qué te provoca?' asks what food or plan sounds tempting, and '¿me regala…?' politely asks to order and pay for something.",
    es: "Veci, ¿me regala un pandebono calientico y un tinto? Ya mismo le cancelo.",
    en: "Neighbor, can I get a warm pandebono and a black coffee? I'll pay you right now.",
    region: "Cortesía diaria"
  },
  {
    id: "vg-sanjuan",
    title: "🪗 San Juan del Cesar (Guajira)",
    sub: "La Terraza · El Abanico · El Acordeón · El Friche",
    img: "guide-sanjuan.webp",
    alt: "Cultural postcard infographic of San Juan del Cesar, La Guajira showing La Terraza porch, El Abanico fan, El Acordeon, and El Friche",
    caption: "Four essentials in your wife's hometown ('Tierra de Compositores'): La Terraza (covered street-level front porch), El Abanico (standing/ceiling fan), El Acordeón (vallenato parranda instrument), and El Friche (traditional seasoned fried goat dish).",
    es: "¡Ajá, primo! Pasa adelante a la terraza, prende el abanico y probemos este friche.",
    en: "Hey, cousin! Come out to the front porch, turn on the fan, and let's try this friche.",
    region: "San Juan del Cesar & Guajira"
  },
  {
    id: "vg-panaderia",
    title: "🥐 Panadería & Tinto (Bakery Counter)",
    sub: "Tinto · Perico · Pandebono · Almojábana · Arepa con queso",
    img: "guide-panaderia.webp",
    alt: "Colombian neighborhood panaderia chalkboard poster labeling tinto, perico, pandebono, almojabana, and arepa con queso",
    caption: "Morning staples across Colombia: tinto (small black coffee), perico (coffee with warm milk — note: in breakfast eggs, huevos pericos means scrambled eggs with tomato and green onion), pandebono & almojábana (warm cheese breads), and arepa con queso.",
    es: "Buenos veci, ¿me regala dos pandebonos calienticos y un perico para acá, por favor?",
    en: "Morning neighbor, could I have two warm pandebonos and a coffee with milk for here, please?",
    region: "Nacional · Mañanas"
  },
  {
    id: "vg-conectores",
    title: "🔗 Puentes para Hablar (Sentence Connectors)",
    sub: "Pero · Aunque · Entonces · Pues · De todas formas",
    img: "guide-conectores.webp",
    alt: "Educational poster showing Colombian sentence connectors Pero, Aunque, Entonces, Pues, and De todas formas",
    caption: "Glue short thoughts into natural Colombian flow: use pero (but) to pivot, aunque (even though) to add nuance, entonces (so/then) to connect outcomes, pues (well/then) to buy thinking time, and de todas formas (anyway) to wrap up politely.",
    es: "Quería salir temprano, pero estaba lloviendo; entonces pedí un Uber de todas formas.",
    en: "I wanted to leave early, but it was raining; so I ordered an Uber anyway.",
    region: "Fluidez · Conversación"
  },
  {
    id: "vg-pagos",
    title: "💳 Pagos en Colombia (How Paying Works)",
    sub: "Efectivo · Datáfono · A una cuota · Nequi QR · Cancelar = Pay",
    img: "guide-pagos.webp",
    alt: "Colombian payments visual poster showing Efectivo, Datafono, A una cuota, Nequi QR, and Cancelar = Pay",
    caption: "In Colombia, paying by credit card always prompts '¿A cuántas cuotas?' — answer 'A una cuota, por favor' (single payment, no interest). Small shops love cash with exact change ('sencillo') or Nequi QR, and 'cancelar' means to pay the bill.",
    es: "Con tarjeta en el datáfono y a una sola cuota, por favor. ¿Dónde puedo cancelar?",
    en: "By card on the terminal in a single installment, please. Where can I pay?",
    region: "Todo Colombia"
  },
  {
    id: "vg-comodines",
    title: "🔑 4 Verbos Comodín (Swiss-Army Verbs)",
    sub: "Quedar · Regalar · Provocar · Dar papaya",
    img: "guide-comodines.webp",
    alt: "Colombian wildcard verbs poster explaining Quedar, Regalar, Provocar, and Dar papaya",
    caption: "Four essentials you hear every single day: quedar (location, agreeing on plans '¿así quedamos?', fit), regalar (polite ordering '¿me regala…?'), provocar (craving '¿qué te provoca?'), and no dar papaya (don't leave valuables exposed).",
    es: "¿Te provoca un tinto? Así quedamos entonces: nos vemos allá y sin dar papaya.",
    en: "Feel like a coffee? It's a plan then: see you there and stay alert.",
    region: "Español Diario"
  }
];

BRANCHING_ROLEPLAYS.push(
  {
    "id": "rp-tienda-napa",
    "title": "🛒 En la tienda de barrio y la ñapa",
    "sub": "Greet the neighborhood shopkeeper, check produce prices and ripeness, and politely ask for a little extra before paying.",
    "turns": [
      {
        "npcEs": "¡Buenos días, veci! ¿Qué le vendemos hoy?",
        "npcEn": "Good morning, neighbor! What can I get you today?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Buenos días. ¿Cómo está? ¿Me hace el favor de mostrarme los tomates y los aguacates?",
            "en": "Good morning. How are you? Would you please show me the tomatoes and avocados?",
            "replyEs": "Claro que sí. Mire, aquí tengo los tomates y acá están los aguacates.",
            "replyEn": "Of course. Look, I have the tomatoes here, and the avocados are over here.",
            "coach": "“¿Me hace el favor de…?” is a warm, everyday Colombian request using usted. Keep your tone friendly rather than overly formal."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Buenas, veci! ¿Cómo va todo? Vengo por tomatico y un aguacate.",
            "en": "Hi, neighbor! How's everything? I'm here for some tomatoes and an avocado.",
            "replyEs": "¡Bien, veci! Siga, que aquí tenemos de los dos.",
            "replyEn": "Good, neighbor! Come on in—we have both here.",
            "coach": "“Veci” is an affectionate shortening of vecino or vecina. “Tomatico” adds warmth; it does not necessarily mean a tiny tomato."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "¡Buenos días! ¿Aquí venden frutas y verduras también?",
            "en": "Good morning! Do you sell fruit and vegetables here too?",
            "replyEs": "Sí, claro. Hoy tenemos tomate, aguacate y varias cositas más.",
            "replyEn": "Yes, of course. Today we have tomatoes, avocados, and a few other things.",
            "coach": "This is a useful opening when you are unsure what a small tienda stocks. “¿Aquí venden…?” avoids having to choose tú or usted."
          }
        ]
      },
      {
        "npcEs": "¿Qué va a llevar, veci? Tengo aguacate para hoy y otro más durito para después.",
        "npcEn": "What would you like, neighbor? I have avocados ready for today and firmer ones for later.",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "¿A cómo tiene la libra de tomate? ¿Y me puede escoger un aguacate madurito para hoy?",
            "en": "How much is a pound of tomatoes? And could you pick out a ripe avocado for today?",
            "replyEs": "La libra está a tres mil y el aguacate a cuatro mil. Este está madurito, listo para el almuerzo.",
            "replyEn": "The tomatoes are three thousand pesos a pound, and the avocado is four thousand. This one is ripe, ready for lunch.",
            "coach": "“¿A cómo tiene…?” is an idiomatic way to ask a shopkeeper's price. In Colombian produce shopping, a libra commonly means 500 grams; these prices are illustrative."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "Veci, ¿a cómo la libra de tomate? ¿Y ese aguacate sí está madurito para hoy?",
            "en": "Neighbor, how much is a pound of tomatoes? And is that avocado ripe enough for today?",
            "replyEs": "A tres mil la libra, y el aguacate vale cuatro mil. Sí, este está en su punto.",
            "replyEn": "Three thousand pesos a pound, and the avocado costs four thousand. Yes, this one is just right.",
            "coach": "“¿A cómo la libra de…?” is a natural shortened price question. “Sí” adds emphasis here: you are checking that it really is ready to eat."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Perdón, ¿el tomate se vende por libra o por kilo? Busco también un aguacate para comer hoy.",
            "en": "Sorry, are the tomatoes sold by the pound or by the kilo? I'm also looking for an avocado to eat today.",
            "replyEs": "Por libra, a tres mil. Y este aguacate de cuatro mil le sirve para hoy.",
            "replyEn": "By the pound, at three thousand pesos. And this four-thousand-peso avocado will be ready to eat today.",
            "coach": "Clarifying the unit before ordering prevents misunderstandings. “Le sirve para hoy” means it suits your plan to eat it today."
          }
        ]
      },
      {
        "npcEs": "Entonces, una libra de tomate y un aguacate: son siete mil. ¿Le pongo bolsa? Puede pagar en efectivo o por Nequi.",
        "npcEn": "So, a pound of tomatoes and one avocado: that's seven thousand pesos. Would you like a bag? You can pay cash or with Nequi.",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "¿Será que me puede dar un tomatico de ñapa? Si no se puede, no se preocupe. Le pago por Nequi y sin bolsa, por favor; traje la mía.",
            "en": "Could you possibly throw in a little tomato as an extra? If not, no worries. I'll pay with Nequi, and no bag, please; I brought my own.",
            "replyEs": "Claro, le agrego este tomatico. Ya le doy el número de Nequi y guardamos todo en su bolsa.",
            "replyEn": "Of course, I'll add this little tomato. I'll give you the Nequi number now, and we'll put everything in your bag.",
            "coach": "“La ñapa” is a small complimentary extra, not an entitlement. Ask lightly and accept a no; with Nequi, confirm the recipient and amount before sending."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "Veci, ¿me regala un tomatico de ñapa? Si se puede. Aquí tiene los siete mil en efectivo. Sin chuspa, que traje bolsa.",
            "en": "Neighbor, could you throw in a little tomato as an extra? If possible. Here's the seven thousand in cash. No plastic bag—I brought a bag.",
            "replyEs": "¡Listo, veci! Va con su tomatico de ñapa. Gracias por traer la bolsa.",
            "replyEn": "All set, neighbor! Your extra little tomato is in there. Thanks for bringing your bag.",
            "coach": "Here “¿me regala…?” really does request a free extra. “Chuspa” means bag in some regions, especially southwestern Colombia; “bolsa” is more widely neutral."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "¿La ñapa es un poquito de más? Si se puede, ¿me da un tomatico? Y para pagar por Nequi, ¿a qué número le envío? No necesito bolsa.",
            "en": "Is ñapa a little extra? If possible, could I have a little tomato? And to pay with Nequi, what number should I send it to? I don't need a bag.",
            "replyEs": "Sí, es un detallito extra; hoy le puedo dar este tomate. Le muestro el número para el pago. Y listo, sin bolsa.",
            "replyEn": "Yes, it's a little extra something; today I can give you this tomato. I'll show you the number for the payment. And all right, no bag.",
            "coach": "This lets you check a new word and finish the purchase naturally. A ñapa depends on the seller and the purchase; it is not guaranteed."
          }
        ]
      }
    ]
  },
  {
    "id": "rp-sanjuan-parranda",
    "title": "🪗 Domingo en San Juan del Cesar (Valledupar–Guajira)",
    "sub": "Arrive from Valledupar for a relaxed Sunday family visit, enjoy a coastal breakfast, and decline seconds warmly before offering drinks.",
    "turns": [
      {
        "npcEs": "¡Primo, bienvenido a San Juan del Cesar! ¿Cómo te fue en el viaje desde Valledupar? Ven, siéntate en la terraza, cerca del abanico.",
        "npcEn": "Cousin, welcome to San Juan del Cesar! How was the trip from Valledupar? Come sit on the terrace, near the fan.",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "¡Buenos días, compadre! ¿Cómo está? El viaje estuvo tranquilo. Muchas gracias por recibirme este domingo.",
            "en": "Good morning, compadre! How are you? The trip was easy. Thank you so much for having me this Sunday.",
            "replyEs": "¡Con mucho gusto! Aquí lo estábamos esperando. Siéntese, que ya casi sale el desayuno.",
            "replyEn": "You're very welcome! We've been waiting for you. Have a seat; breakfast is almost ready.",
            "coach": "Usted can express warmth and respect, even when someone addresses you with tú. “Compadre” can be a genuine relationship term or a friendly address among people who already have that rapport."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Primo! Todo bien, salimos temprano de Valledupar. ¿Y tú cómo vas? Me voy a sentar cerquita del abanico.",
            "en": "Cousin! All good—we left Valledupar early. How are you doing? I'm going to sit nice and close to the fan.",
            "replyEs": "¡Bien, primo! Ponte cómodo, que tus primas ya vienen con el desayuno.",
            "replyEn": "Good, cousin! Make yourself comfortable; your cousins are bringing breakfast.",
            "coach": "Tú is natural in many familiar coastal conversations. “Abanico” commonly means an electric fan here, not only a handheld fan."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "¡Gracias, primo! Llegamos bien. ¿Me siento aquí en la terraza o entramos a saludar primero?",
            "en": "Thanks, cousin! We got here safely. Should I sit here on the terrace, or should we go inside to say hello first?",
            "replyEs": "Saluda primero a las tías y después te sientas aquí con nosotros, al fresquito.",
            "replyEn": "Say hello to the aunts first, and then sit here with us where it's cooler.",
            "coach": "“¿Me siento aquí…?” checks the host's plan without sounding stiff. A terraza may be a ground-level outdoor sitting area, not necessarily a balcony."
          }
        ]
      },
      {
        "npcEs": "Primo, hoy hay cayeye con queso costeño y suero. Tus primas ya están en la mesa. ¿Te sirvo?",
        "npcEn": "Cousin, today we have mashed green bananas with coastal cheese and fermented cream. Your cousins are already at the table. Shall I serve you some?",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Sí, muchas gracias. ¿Me sirve un poquito de cayeye con queso costeño y el suero aparte, por favor? ¿Usted también se sienta con nosotros?",
            "en": "Yes, thank you very much. Could you serve me a little cayeye with coastal cheese and the fermented cream on the side, please? Will you join us too?",
            "replyEs": "Claro, le dejo el suero aparte. Ya me siento con ustedes; sus primas me guardaron puesto.",
            "replyEn": "Of course, I'll leave the fermented cream on the side. I'll join you in a moment; your cousins saved me a seat.",
            "coach": "“Aparte” is the useful word for a topping or sauce on the side. Suero costeño is a tangy fermented dairy condiment, not ordinary milk or whey."
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "¡Claro, primo! Sírveme poquito para empezar, con queso y suero. ¿Y tú? Ven, desayuna con nosotros.",
            "en": "Of course, cousin! Give me a little to start, with cheese and fermented cream. What about you? Come have breakfast with us.",
            "replyEs": "¡Ya voy! Pero eso de que tú comes poquito es embuste, primo. Prueba primero y me dices.",
            "replyEn": "I'm coming! But that business about you eating only a little is a tall tale, cousin. Try some first and let me know.",
            "coach": "“Sírveme” and “ven” are tú commands softened by family warmth. “Embuste” means a lie or tall tale; this teasing use fits close relationships, not every encounter."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "Qué rico se ve. ¿El cayeye es guineo verde machacado? ¿Y el suero se lo pongo por encima?",
            "en": "That looks delicious. Is cayeye mashed green banana? And do I put the fermented cream on top?",
            "replyEs": "Sí, lo hacemos con guineo verde cocido y machacado. El suero se lo puedes poner por encima, al gusto.",
            "replyEn": "Yes, we make it with cooked, mashed green bananas. You can put the fermented cream on top, as much as you like.",
            "coach": "Cayeye names the prepared dish; guineo verde names its main ingredient. Asking how this household serves it leaves room for family variations."
          }
        ]
      },
      {
        "npcEs": "Mi amor, ¿vas a repetir? Quedó cayeye. No te me vayas con hambre para Valledupar.",
        "npcEn": "Sweetheart, would you like seconds? There's cayeye left. Don't go heading back to Valledupar hungry.",
        "options": [
          {
            "style": "🙏 Cortesía (Usted)",
            "es": "Muchas gracias, tía, pero ya quedé muy bien. Le quedó delicioso. Antes de irnos para Valledupar, ¿le provoca un jugo de corozo bien frío? Yo la invito.",
            "en": "Thank you so much, Auntie, but I've had plenty. It was delicious. Before we leave for Valledupar, would you like an ice-cold corozo juice? My treat.",
            "replyEs": "Bueno, mi amor, no le insisto. Sí me provoca ese juguito; nos lo tomamos aquí en la terraza.",
            "replyEn": "All right, sweetheart, I won't insist. I'd love that juice; we can have it here on the terrace.",
            "coach": "“Ya quedé muy bien” declines seconds gently, while “Le quedó delicioso” compliments the cook. “¿Le provoca…?” is a natural Colombian offer meaning “Would you like…?”"
          },
          {
            "style": "🇨🇴 Callejero / Local",
            "es": "Tía, qué rico, pero ya no me cabe más. Gracias por consentirme. ¿Te invito un café antes de que arranquemos para Valledupar?",
            "en": "Auntie, that was so good, but I couldn't eat another bite. Thanks for spoiling me. Can I treat you to a coffee before we head off to Valledupar?",
            "replyEs": "¡Claro que sí! Un cafecito y conversamos otro ratico antes de que se vayan.",
            "replyEn": "Of course! A little coffee, and we can chat a bit longer before you leave.",
            "coach": "Use tú with an aunt only if that matches your relationship. “Arrancar para…” informally means to set off for a place."
          },
          {
            "style": "🔄 Pivot / Aclarar",
            "es": "¿Repetir es servirme otro poquito? Estaba delicioso, pero por ahora no, gracias. Mejor los invito a un jugo de corozo bien frío antes de volver a Valledupar. ¿Les provoca?",
            "en": "Does repetir mean having another helping? It was delicious, but not for now, thank you. Instead, let me treat everyone to an ice-cold corozo juice before going back to Valledupar. Would you like that?",
            "replyEs": "Sí, repetir es comer otra porción. Y gracias por la invitación; un jugo frío nos cae muy bien.",
            "replyEn": "Yes, repetir means having another helping. And thanks for the invitation; a cold juice would really hit the spot.",
            "coach": "In a meal context, “repetir” means to have seconds. “Los invito” addresses the group, and “¿Les provoca?” keeps the offer warm and inclusive."
          }
        ]
      }
    ]
  }
);

REGIONAL_SWITCHER.push(
  {
    "id": "reg-youre-welcome",
    "intent": "🙏 Responding to 'Thank you' / Responder a «gracias»",
    "context": "A friend thanks you for a small favor; these are plausible regional choices, not expressions exclusive to each region.",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú (implicit)", "es": "¡Con gusto, primo! Tú sabes que aquí estamos.", "en": "Happy to help, cousin! You know we're here for you.", "note": "Primo suits actual cousins and some familiar friendships; it is not a default address for every stranger."},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "usted (implicit)", "es": "Con mucho gusto. Para eso estamos.", "en": "You're very welcome. That's what we're here for.", "note": "A warm response compatible with usted, although the sentence itself contains no explicit second-person form; it is common beyond Bogotá."},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos", "es": "¡Con gusto! Vos sabés que podés contar conmigo.", "en": "Happy to help! You know you can count on me.", "note": "Sabés and podés are voseo forms. Paisa speakers also use usted and tú depending on the relationship."},
      {"region": "💃 Cali / Valle", "pronoun": "vos", "es": "¡Con mucho gusto! Cuando necesités, me avisás.", "en": "You're very welcome! Whenever you need anything, let me know.", "note": "Necesités and avisás model familiar voseo, which is common in Cali but not obligatory for every speaker or situation."}
    ]
  },
  {
    "id": "reg-counter-coffee-juice",
    "intent": "☕ Quick coffee or juice / Pedir un café o un jugo",
    "context": "Order a small black coffee or a juice at a counter using a friendly request suited to the relationship.",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú", "es": "Buenos días. ¿Me das un jugo de corozo bien frío, por favor?", "en": "Good morning. Could I have an ice-cold corozo juice, please?", "note": "Tú can fit a relaxed exchange; usted is also available. Corozo juice is associated with the Caribbean region, but availability varies by establishment."},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "usted", "es": "Buenos días. ¿Me regala un tinto para llevar, por favor?", "en": "Good morning. Could I have a black coffee to go, please?", "note": "In Colombian ordering, “¿me regala…?” normally requests something you will pay for. A tinto is black coffee, not red wine in this context."},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos", "es": "Hola, ¿me regalás un tintico para llevar, por favor?", "en": "Hi, could I have a little black coffee to go, please?", "note": "Regalás marks voseo. Tintico is a friendly diminutive used in several Colombian regions, not only Antioquia."},
      {"region": "💃 Cali / Valle", "pronoun": "vos", "es": "Buenas, ¿me das un jugo de lulo en agua, por favor?", "en": "Hi, could I have a lulo juice made with water, please?", "note": "Das works with both tú and vos, so this wording does not uniquely mark voseo. “En agua” distinguishes the order from juice blended with milk."}
    ]
  },
  {
    "id": "reg-price-good-deal",
    "intent": "💸 Price and a good deal / Preguntar el precio y celebrar la oferta",
    "context": "At a produce stall, ask the price per libra and react warmly after hearing a price you consider good.",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú", "es": "¿A cómo tienes la libra de tomate? ¡Está a buen precio! Dame dos libras, por favor.", "en": "How much is a pound of tomatoes? That's a good price! Give me two pounds, please.", "note": "Tienes and dame model tú. This is broadly Colombian wording that fits a friendly coastal interaction without relying on exaggerated slang."},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "usted", "es": "¿A cómo tiene la libra de tomate? ¡Está económico! Me da dos libras, por favor.", "en": "How much is a pound of tomatoes? That's inexpensive! I'll have two pounds, please.", "note": "Tiene and me da use usted. “Económico” is a positive way to describe an affordable price."},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos", "es": "¿A cómo tenés la libra de tomate? ¡Qué buen precio! Vendeme dos libras, por favor.", "en": "How much is a pound of tomatoes? What a good price! I'll take two pounds, please.", "note": "Tenés and vendeme show voseo. Vendeme has no written accent because its stress is regular after the pronoun is attached."},
      {"region": "💃 Cali / Valle", "pronoun": "vos", "es": "¿A cómo tenés la libra de tomate? ¡Está barato! Dame dos libras, por favor.", "en": "How much is a pound of tomatoes? That's cheap! Give me two pounds, please.", "note": "Tenés explicitly marks voseo; dame is shared with tú. In Colombian produce retail, a libra commonly refers to 500 grams."}
    ]
  },
  {
    "id": "reg-hold-on-repeat",
    "intent": "🚌 Hold on or repeat / Pedir un momento o una repetición",
    "context": "When someone gives directions too quickly, gently pause the conversation and ask them to repeat more slowly.",
    "variants": [
      {"region": "🪗 San Juan del Cesar / Guajira", "pronoun": "tú", "es": "Un momentico, primo. ¿Me repites más despacio, por favor?", "en": "Just a second, cousin. Could you repeat that more slowly, please?", "note": "Repites uses tú. Momentico softens the interruption; primo requires an appropriately familiar relationship."},
      {"region": "🏔️ Bogotá / Interior", "pronoun": "usted", "es": "Qué pena, un momentico. ¿Me repite más despacio, por favor?", "en": "Sorry, just a second. Could you repeat that more slowly, please?", "note": "“Qué pena” commonly softens an interruption or request in Colombia; it need not express deep embarrassment."},
      {"region": "🌸 Medellín / Paisa", "pronoun": "vos", "es": "Esperá un momentico, por favor. ¿Me repetís más despacio?", "en": "Wait just a second, please. Could you repeat that more slowly?", "note": "Esperá and repetís are voseo forms. The polite wording and gentle delivery keep the imperative from sounding abrupt."},
      {"region": "💃 Cali / Valle", "pronoun": "vos", "es": "Un momentico, por favor. ¿Podés repetir lo último más despacio?", "en": "Just a second, please. Could you repeat the last part more slowly?", "note": "Podés marks voseo. Asking for “lo último” narrows the repair to the part you missed."}
    ]
  }
);

const VERB_VERSATILITY_ENGINE = [
  {
    id: "vv-hacer",
    verb: "hacer",
    label: "🛠️ Hacer (to do / make)",
    tip: "With 'acabar de + infinitive' Colombians express something that just happened seconds ago without needing complex past conjugations.",
    forms: {
      yo: {
        past: { es: "Ya hice el pedido por Nequi.", en: "I already placed the order via Nequi." },
        just: { es: "Acabo de hacer un tinto bien cargado.", en: "I just made a strong black coffee." },
        now: { es: "Estoy haciendo la fila en la caja.", en: "I am waiting in line at the register." },
        future: { es: "Voy a hacer el mercado ahorita.", en: "I am going to do the grocery shopping soon." },
        polite: { es: "¿Me podría hacer el favor de cambiar esto?", en: "Could you do me the favor of breaking this bill?" }
      },
      tu: {
        past: { es: "¿Ya hiciste la vuelta del banco?", en: "Did you already run the bank errand?" },
        just: { es: "Acabas de hacer una buena elección.", en: "You just made a great choice." },
        now: { es: "¿Qué haces hoy por la tarde, primo?", en: "What are you doing this afternoon, cousin?" },
        future: { es: "¿Vas a hacer comida en la casa hoy?", en: "Are you going to cook at home today?" },
        polite: { es: "¿Me haces un favor y me pasas la ubicación?", en: "Could you do me a favor and send me the pin?" }
      },
      vos: {
        past: { es: "¿Qué hiciste ayer en Medellín?", en: "What did you do yesterday in Medellín?" },
        just: { es: "Acabás de hacer justo lo que tocaba.", en: "You just did exactly what was needed." },
        now: { es: "¿Vos qué estás haciendo por acá?", en: "What are you up to around here?" },
        future: { es: "¿Vas a hacer el asado el domingo?", en: "Are you going to do the barbecue on Sunday?" },
        polite: { es: "¿Me hacés el favor de parar en la esquina?", en: "Could you please stop at the corner?" }
      },
      usted: {
        past: { es: "¿Usted ya hizo el registro en portería?", en: "Did you already sign in at the front desk?" },
        just: { es: "Usted acaba de hacer la diferencia.", en: "You just made all the difference." },
        now: { es: "¿Qué está haciendo en este momento?", en: "What are you doing right now?" },
        future: { es: "¿Va a hacer algún trámite hoy?", en: "Are you going to run an errand today?" },
        polite: { es: "¿Usted me hace el favor de llamarme cuando llegue?", en: "Would you please call me when you arrive?" }
      },
      nosotros: {
        past: { es: "Ayer hicimos una vaca para las empanadas.", en: "Yesterday we all chipped in for empanadas." },
        just: { es: "Acabamos de hacer el check-in en el hotel.", en: "We just checked in at the hotel." },
        now: { es: "Estamos haciendo planes para el puente.", en: "We are making plans for the long weekend." },
        future: { es: "Mañana vamos a hacer un paseo a la finca.", en: "Tomorrow we are going to take a trip to the country house." },
        polite: { es: "¿Podemos hacer el pago en una sola cuota?", en: "Can we pay in a single installment?" }
      }
    }
  },
  {
    id: "vv-tener",
    verb: "tener",
    label: "🎒 Tener (to have)",
    tip: "Note 'tener que + verb' means 'to have to', and shops ask '¿Tiene sencillo?' for small bills.",
    forms: {
      yo: {
        past: { es: "Ayer tuve que ir hasta Migración.", en: "Yesterday I had to go all the way to Immigration." },
        just: { es: "Acabo de tener una idea buenísima.", en: "I just had a great idea." },
        now: { es: "Tengo ganas de un jugo de lulo en agua.", en: "I feel like having a lulo juice in water." },
        future: { es: "Voy a tener que salir más temprano.", en: "I am going to have to leave earlier." },
        polite: { es: "Disculpe, ¿será que tengo que firmar acá?", en: "Excuse me, do I happen to need to sign here?" }
      },
      tu: {
        past: { es: "¿Tuviste tiempo de hablar con la familia?", en: "Did you have time to talk with the family?" },
        just: { es: "Acabas de tener mucha suerte con el tráfico.", en: "You just got very lucky with traffic." },
        now: { es: "¿Tienes el número del domiciliario?", en: "Do you have the delivery driver's number?" },
        future: { es: "Vas a tener un día bien movido.", en: "You are going to have a very busy day." },
        polite: { es: "¿Tienes sencillo para un billete de cincuenta?", en: "Do you have change for a fifty-thousand bill?" }
      },
      vos: {
        past: { es: "¿Tuviste algún problema con el Uber?", en: "Did you have any trouble with the Uber?" },
        just: { es: "Acabás de tener el mismo pensamiento que yo.", en: "You just had the exact same thought as me." },
        now: { es: "¿Vos tenés carga en el celular?", en: "Do you have battery on your phone?" },
        future: { es: "Vas a tener que madrugar mañana.", en: "You are going to have to wake up early tomorrow." },
        polite: { es: "¿Tenés un momentico para explicarme?", en: "Do you have a quick second to explain to me?" }
      },
      usted: {
        past: { es: "¿Usted tuvo que esperar mucho en la caja?", en: "Did you have to wait long at the register?" },
        just: { es: "Usted acaba de tener un detalle muy bonito.", en: "You just did something very thoughtful." },
        now: { es: "¿Usted tiene pandebono calientico todavía?", en: "Do you still have warm pandebono?" },
        future: { es: "Va a tener que girar a la derecha en la setenta.", en: "You are going to have to turn right on 70th." },
        polite: { es: "¿Tiene bolsa, por favor, o me regala una?", en: "Do you have a bag, please, or could I get one?" }
      },
      nosotros: {
        past: { es: "Tuvimos una parranda buenísima en San Juan.", en: "We had an awesome parranda in San Juan." },
        just: { es: "Acabamos de tener noticias del vuelo.", en: "We just got news about the flight." },
        now: { es: "Tenemos reserva para cuatro personas a las ocho.", en: "We have a reservation for four people at eight." },
        future: { es: "Vamos a tener que pedir dos taxis.", en: "We are going to have to call two taxis." },
        polite: { es: "¿Tenemos que cancelar antes de sentarnos?", en: "Do we need to pay before sitting down?" }
      }
    }
  },
  {
    id: "vv-ir",
    verb: "ir",
    label: "🚕 Ir (to go / 'Voy a…')",
    tip: "Your #1 future shortcut in Colombia: '[ir in present] + a + infinitive verb' covers 90% of everyday future plans.",
    forms: {
      yo: {
        past: { es: "Ayer fui a la farmacia de la esquina.", en: "Yesterday I went to the corner pharmacy." },
        just: { es: "Acabo de ir a recoger el domicilio.", en: "I just went to pick up the delivery." },
        now: { es: "Voy para el apartamento quinientos dos.", en: "I am heading to apartment 502." },
        future: { es: "Voy a ir al mercado mañana temprano.", en: "I am going to go to the market early tomorrow." },
        polite: { es: "Con permiso, voy pasando por aquí.", en: "Excuse me, just squeezing right past here." }
      },
      tu: {
        past: { es: "¿Fuiste a la terraza ayer en la noche?", en: "Did you go out to the front porch last night?" },
        just: { es: "Acabas de ir por el camino más rápido.", en: "You just took the fastest route." },
        now: { es: "¿Cómo vas con el español colombiano?", en: "How is your Colombian Spanish going?" },
        future: { es: "¿Vas a ir a la playa este puente?", en: "Are you going to go to the beach this holiday weekend?" },
        polite: { es: "Cuando vayas saliendo, me avisas por WhatsApp.", en: "When you head out, let me know on WhatsApp." }
      },
      vos: {
        past: { es: "¿Adónde fuiste a comer corrientazo?", en: "Where did you go eat a daily lunch?" },
        just: { es: "Acabás de ir hasta allá de balde.", en: "You just went all the way there for nothing." },
        now: { es: "¿Para dónde vas con tanto afán, parce?", en: "Where are you rushing off to, buddy?" },
        future: { es: "¿Vas a ir al partido con nosotros?", en: "Are you going to go to the game with us?" },
        polite: { es: "Andá tranquilo, nos vemos ahorita.", en: "Go easy, see you in a bit." }
      },
      usted: {
        past: { es: "¿Usted ya fue a sacar la cédula?", en: "Did you already go get your ID card?" },
        just: { es: "Usted acaba de ir directo al punto.", en: "You just got straight to the point." },
        now: { es: "¿Hacia qué dirección va ahorita?", en: "Which direction are you heading right now?" },
        future: { es: "¿Va a ir por la autopista o por la séptima?", en: "Are you going to take the highway or Carrera 7?" },
        polite: { es: "¿Cómo le ha ido hoy, vecino?", en: "How has your day been going, neighbor?" }
      },
      nosotros: {
        past: { es: "El domingo fuimos a almorzar friche.", en: "On Sunday we went out to eat friche for lunch." },
        just: { es: "Acabamos de ir a pagar los servicios.", en: "We just went to pay the utility bills." },
        now: { es: "Vamos llegando en diez minutos.", en: "We are arriving in ten minutes." },
        future: { es: "Vamos a ir a caminar por la ciclovía.", en: "We are going to go walk on the Sunday car-free streets." },
        polite: { es: "Nos vamos yendo, muchas gracias por todo.", en: "We are heading out, thank you so much for everything." }
      }
    }
  },
  {
    id: "vv-poder",
    verb: "poder",
    label: "🤝 Poder (can / could)",
    tip: "In Colombia, softening requests with '¿Será que puedo…?' or '¿Podría…?' earns instant warmth and cooperation.",
    forms: {
      yo: {
        past: { es: "Por el trancón no pude llegar a tiempo.", en: "Because of traffic I could not arrive on time." },
        just: { es: "Por fin pude registrar mi línea celular.", en: "I was finally able to register my phone line." },
        now: { es: "Puedo pagar por Nequi o con tarjeta.", en: "I can pay via Nequi or by card." },
        future: { es: "Voy a poder hablar mejor cada semana.", en: "I am going to be able to speak better every week." },
        polite: { es: "¿Será que puedo pasar a ver el apartamento?", en: "Could I possibly stop by to see the apartment?" }
      },
      tu: {
        past: { es: "¿Pudiste descansar bien anoche?", en: "Were you able to rest well last night?" },
        just: { es: "Acabas de poder resolverlo en un minuto.", en: "You just managed to solve it in one minute." },
        now: { es: "¿Puedes repetir eso más despacio, porfa?", en: "Can you repeat that slower, please?" },
        future: { es: "¿Vas a poder venir al almuerzo?", en: "Are you going to be able to make it to lunch?" },
        polite: { es: "¿Me podrías recomendar un buen café?", en: "Could you recommend a good coffee shop?" }
      },
      vos: {
        past: { es: "¿Pudiste hablar con el portero?", en: "Were you able to talk with the doorman?" },
        just: { es: "Ya pudiste cuadrar la cita médica.", en: "You just managed to set up the medical appointment." },
        now: { es: "¿Vos podés venir hoy por la tarde?", en: "Can you come by this afternoon?" },
        future: { es: "¿Vas a poder acompañarnos a San Juan?", en: "Are you going to be able to join us in San Juan?" },
        polite: { es: "¿Me podés confirmar por WhatsApp?", en: "Can you confirm with me on WhatsApp?" }
      },
      usted: {
        past: { es: "¿Pudo encontrar la dirección sin problema?", en: "Were you able to find the address with no problem?" },
        just: { es: "¿Ya pudo revisar la caja de tacos?", en: "Were you already able to check the breaker box?" },
        now: { es: "¿Puede ponerlo a una sola cuota, por favor?", en: "Can you put it as a single installment, please?" },
        future: { es: "¿Va a poder pasar antes del mediodía?", en: "Are you going to be able to stop by before noon?" },
        polite: { es: "Disculpe, ¿podría hablar un poquito más despacio?", en: "Excuse me, could you speak a tiny bit slower?" }
      },
      nosotros: {
        past: { es: "No pudimos salir porque cayó un aguacero.", en: "We could not go out because it poured rain." },
        just: { es: "Acabamos de poder conectarnos al Wi-Fi.", en: "We just got connected to the Wi-Fi." },
        now: { es: "Podemos pedir el corrientazo para llevar.", en: "We can order the daily lunch to go." },
        future: { es: "Vamos a poder practicar todos los días.", en: "We are going to be able to practice every day." },
        polite: { es: "¿Podemos sentarnos en esa mesa de allá?", en: "Can we sit at that table over there?" }
      }
    }
  },
  {
    id: "vv-dar-regalar",
    verb: "regalar / dar",
    label: "☕ Regalar / Dar (Colombian ordering)",
    tip: "In Colombia, '¿Me regala…?' at counters never means free—it's the standard polite way to order food, drinks, or help!",
    forms: {
      yo: {
        past: { es: "Le di mi pasaporte al recepcionista.", en: "I gave my passport to the receptionist." },
        just: { es: "Le acabo de dar la propina al domiciliario.", en: "I just gave the tip to the delivery driver." },
        now: { es: "Le doy mil gracias por la paciencia.", en: "Thank you so much for your patience." },
        future: { es: "Le voy a dar un abrazo a toda la familia.", en: "I am going to give the whole family a hug." },
        polite: { es: "Veci, ¿me regala la cuenta cuando pueda?", en: "Neighbor, could I have the check when you can?" }
      },
      tu: {
        past: { es: "Me diste una muy buena recomendación.", en: "You gave me a really good recommendation." },
        just: { es: "Me acabas de dar justo lo que necesitaba.", en: "You just gave me exactly what I needed." },
        now: { es: "¿Me das un poquito más de ají, porfa?", en: "Can you give me a little more salsa/ají, please?" },
        future: { es: "Me vas a dar tu receta del jugo de corozo.", en: "You are going to give me your corozo juice recipe." },
        polite: { es: "¿Me regalas tu número para guardarlo?", en: "Could you share your number so I save it?" }
      },
      vos: {
        past: { es: "Vos me diste la dirección exacta.", en: "You gave me the exact address." },
        just: { es: "Me acabás de dar tremendo consejo.", en: "You just gave me awesome advice." },
        now: { es: "¿Me regalás un vaso con agua?", en: "Could I get a glass of water?" },
        future: { es: "Nos vas a dar una vuelta por el barrio.", en: "You are going to show us around the neighborhood." },
        polite: { es: "¿Me das una ñapa en esa bolsa, porfa?", en: "Could you toss a tiny extra bit in that bag, please?" }
      },
      usted: {
        past: { es: "Usted me dio las vueltas exactas, gracias.", en: "You gave me the exact change, thank you." },
        just: { es: "Usted me acaba de dar una gran mano.", en: "You just gave me a huge hand." },
        now: { es: "¿Me regala un tinto y un pandebono?", en: "Could I order a black coffee and a pandebono?" },
        future: { es: "¿Me va a dar copia del recibo o sin copia?", en: "Are you giving me a receipt copy or without?" },
        polite: { es: "¿Sumercé me regala un momentico, por favor?", en: "Could you kindly give me a quick second, please?" }
      },
      nosotros: {
        past: { es: "Dimos una vuelta por el centro histórico.", en: "We took a walk around the historic center." },
        just: { es: "Acabamos de darle la autorización al portero.", en: "We just gave permission to the doorman." },
        now: { es: "No damos papaya con el celular en la calle.", en: "We stay alert with our phone on the street." },
        future: { es: "Vamos a darnos una escapada al pueblito.", en: "We are going to take a quick getaway to the town." },
        polite: { es: "¿Nos regala dos cucharitas y servilletas?", en: "Could we get two little spoons and napkins?" }
      }
    }
  },
  {
    id: "vv-decir",
    verb: "decir",
    label: "💬 Decir (to say / tell)",
    tip: "'¡No me digas!' is the classic Colombian warm reaction showing surprise ('No way!').",
    forms: {
      yo: {
        past: { es: "Ya le dije al conductor que pare acá.", en: "I already told the driver to stop here." },
        just: { es: "Acabo de decir que voy aprendiendo poco a poco.", en: "I just said that I am learning little by little." },
        now: { es: "¿Cómo se dice esto en colombiano?", en: "How do you say this in Colombian Spanish?" },
        future: { es: "Te voy a decir la verdad: me encantó.", en: "I am going to tell you the truth: I loved it." },
        polite: { es: "Disculpe, ¿me puede decir qué significa eso?", en: "Excuse me, can you tell me what that means?" }
      },
      tu: {
        past: { es: "Me dijiste que el almuerzo estaba buenísimo.", en: "You told me the lunch was delicious." },
        just: { es: "Acabas de decir una palabra nueva para mí.", en: "You just said a brand-new word for me." },
        now: { es: "¿Por qué dices eso, primo?", en: "Why do you say that, cousin?" },
        future: { es: "Me vas a decir a qué hora salimos.", en: "You are going to tell me what time we leave." },
        polite: { es: "¿Me dices cómo llegar a la terminal?", en: "Can you tell me how to get to the bus terminal?" }
      },
      vos: {
        past: { es: "Vos me dijiste que nos viéramos acá.", en: "You told me to meet up here." },
        just: { es: "Acabás de decir algo muy cierto.", en: "You just said something very true." },
        now: { es: "¿Qué decís vos? ¿Nos vamos de una?", en: "What do you say? Shall we go right away?" },
        future: { es: "¿Nos vas a decir dónde queda la tienda?", en: "Are you going to tell us where the store is?" },
        polite: { es: "Decime con confianza si hablo muy rápido.", en: "Tell me openly if I speak too fast." }
      },
      usted: {
        past: { es: "Usted me dijo que quedaba a dos cuadras.", en: "You told me it was two blocks away." },
        just: { es: "Usted acaba de decir lo más importante.", en: "You just said the most important part." },
        now: { es: "¿Qué me dice de ese clima tan sabroso?", en: "What do you think of this awesome weather?" },
        future: { es: "¿Me va a decir en qué plataforma sale?", en: "Are you going to tell me which platform it leaves from?" },
        polite: { es: "¿Me podría decir a qué hora cierran hoy?", en: "Could you tell me what time you close today?" }
      },
      nosotros: {
        past: { es: "Siempre decimos 'con mucho gusto' al ayudar.", en: "We always say 'my pleasure' when helping." },
        just: { es: "Acabamos de decir que vamos por el café.", en: "We just said we are going for coffee." },
        now: { es: "Aquí en la costa decimos 'ajá' para saludar.", en: "Here on the coast we say 'ajá' to greet." },
        future: { es: "Te vamos a decir cuando llegue el paquete.", en: "We are going to tell you when the package arrives." },
        polite: { es: "Como decimos por acá: ¡hágale sin pena!", en: "As we say around here: go right ahead, no shyness!" }
      }
    }
  },
  {
    id: "vv-quedar",
    verb: "quedar",
    label: "📍 Quedar (location / agree / fit)",
    tip: "Colombia's #1 Swiss-Army verb: location ('¿Dónde queda?'), confirming plans ('¿Así quedamos?'), how clothes fit, and leftovers.",
    forms: {
      yo: {
        past: { es: "Ayer quedé muy lleno con ese corrientazo.", en: "Yesterday I ended up super full from that daily lunch." },
        just: { es: "Acabo de quedar con mi primo a las cinco.", en: "I just made plans with my cousin for five." },
        now: { es: "Me quedo dos semanas más en Colombia.", en: "I am staying two more weeks in Colombia." },
        future: { es: "Voy a quedar pendiente de tu mensaje.", en: "I am going to stay on the lookout for your message." },
        polite: { es: "¿Le quedó claro o prefiere que repita?", en: "Was that clear or do you prefer I repeat?" }
      },
      tu: {
        past: { es: "Qué bien te quedó esa camisa nueva.", en: "That new shirt looks great on you." },
        just: { es: "Acabas de quedar en un restaurante buenísimo.", en: "You just agreed to meet at an awesome restaurant." },
        now: { es: "¿Te queda bien si pasamos a las tres?", en: "Does it work well for you if we stop by at three?" },
        future: { es: "Vas a quedar encantado con San Juan.", en: "You are going to be thrilled with San Juan." },
        polite: { es: "¿Te queda algún pandebono calientico?", en: "Do you have any warm pandebonos left?" }
      },
      vos: {
        past: { es: "¿En qué quedaste con el dueño del Airbnb?", en: "What did you end up agreeing on with the Airbnb host?" },
        just: { es: "Acabás de quedar súper bien con la familia.", en: "You just made a great impression on the family." },
        now: { es: "¿Vos te quedás en Medellín este puente?", en: "Are you staying in Medellín this long weekend?" },
        future: { es: "Te vas a quedar sorprendido con la vista.", en: "You are going to be amazed by the view." },
        polite: { es: "Decime dónde queda la panadería más cercana.", en: "Tell me where the nearest bakery is located." }
      },
      usted: {
        past: { es: "Quedó perfecto el corte, muchas gracias.", en: "The haircut turned out perfect, thank you very much." },
        just: { es: "Usted acaba de quedar en enviarme el recibo.", en: "You just agreed to send me the receipt." },
        now: { es: "Disculpe, ¿dónde queda el cajero más cercano?", en: "Excuse me, where is the nearest ATM located?" },
        future: { es: "¿El parque va a quedar a mano derecha?", en: "Will the park be on the right-hand side?" },
        polite: { es: "¿Así quedamos entonces? ¡Muchísimas gracias!", en: "Is that our plan then? Thank you so much!" }
      },
      nosotros: {
        past: { es: "Quedamos de vernos en la plaza principal.", en: "We agreed to meet at the main square." },
        just: { es: "Acabamos de quedar listos para salir.", en: "We just got all ready to head out." },
        now: { es: "Nos quedan solo diez minuticos para abordar.", en: "We only have ten quick minutes left to board." },
        future: { es: "Vamos a quedar cerca de la estación.", en: "We are going to stay near the station." },
        polite: { es: "¡De una, así quedamos para mañana!", en: "Sounds great, it's a plan for tomorrow!" }
      }
    }
  },
  {
    id: "vv-estar",
    verb: "estar",
    label: "☀️ Estar (location / mood / ready)",
    tip: "Use ESTAR for where places/people are right now, how food tastes in the moment ('¡Está delicioso!'), and feelings.",
    forms: {
      yo: {
        past: { es: "Ayer estuve todo el día en La Guajira.", en: "Yesterday I spent all day in La Guajira." },
        just: { es: "Acabo de estar hablando con el portero.", en: "I was just talking with the doorman." },
        now: { es: "Estoy muy contento de estar por acá.", en: "I am very happy to be around here." },
        future: { es: "Mañana voy a estar en Bogotá temprano.", en: "Tomorrow I am going to be in Bogotá early." },
        polite: { es: "¿Está bien si cancelo en la caja?", en: "Is it okay if I pay at the register?" }
      },
      tu: {
        past: { es: "¿Dónde estuviste anoche, primo?", en: "Where were you last night, cousin?" },
        just: { es: "Acabas de estar pasando justo por mi cuadra.", en: "You were just passing right by my block." },
        now: { es: "¿Cómo estás? ¿Todo bien en la casa?", en: "How are you? Everything good at home?" },
        future: { es: "Vas a estar súper cómodo en la terraza.", en: "You are going to be super comfortable on the porch." },
        polite: { es: "Avísame cuando estés listo para pedir.", en: "Let me know when you are ready to order." }
      },
      vos: {
        past: { es: "¿Estuviste en la fiesta del sábado?", en: "Were you at Saturday's party?" },
        just: { es: "Acabás de estar en el centro comercial.", en: "You were just at the shopping mall." },
        now: { es: "¿Cómo estás vos? ¿Todo tranquilo?", en: "How are you doing? All chill?" },
        future: { es: "¿Vas a estar por el barrio esta tarde?", en: "Are you going to be around the neighborhood this afternoon?" },
        polite: { es: "Contame si estás ocupado en este momento.", en: "Tell me if you are busy right now." }
      },
      usted: {
        past: { es: "¡El almuerzo estuvo buenísimo, gracias!", en: "The lunch was delicious, thank you!" },
        just: { es: "Usted acaba de estar muy amable conmigo.", en: "You were just very kind to me." },
        now: { es: "Buenas tardes, ¿cómo está usted hoy?", en: "Good afternoon, how are you today?" },
        future: { es: "¿El domicilio va a estar listo en diez minutos?", en: "Will the delivery be ready in ten minutes?" },
        polite: { es: "Disculpe, ¿está ocupado este asiento?", en: "Excuse me, is this seat taken?" }
      },
      nosotros: {
        past: { es: "Estuvimos caminando por toda la ciclovía.", en: "We were walking all along the car-free street." },
        just: { es: "Acabamos de estar en la panadería.", en: "We were just at the bakery." },
        now: { es: "Estamos aprendiendo español colombiano.", en: "We are learning Colombian Spanish." },
        future: { es: "Vamos a estar en San Juan el próximo mes.", en: "We are going to be in San Juan next month." },
        polite: { es: "¡Con mucho gusto, para eso estamos!", en: "My pleasure, that is what we are here for!" }
      }
    }
  },
  {
    id: "vv-ser",
    verb: "ser",
    label: "🇨🇴 Ser (identity / price / time)",
    tip: "Use SER for identity, jobs, prices ('¿Cuánto es?'), time, and permanent traits ('Es muy acogedor').",
    forms: {
      yo: {
        past: { es: "Fui ingeniero antes de mudarme.", en: "I was an engineer before moving." },
        just: { es: "Acabo de ser atendido súper rápido.", en: "I was just helped super fast." },
        now: { es: "Soy de Estados Unidos, pero vivo aquí.", en: "I am from the US, but I live here." },
        future: { es: "Voy a ser más constante practicando.", en: "I am going to be more consistent practicing." },
        polite: { es: "¿Será que me puede ayudar con una pregunta?", en: "Might you be able to help me with a question?" }
      },
      tu: {
        past: { es: "¡Fuiste muy amable con mi esposa!", en: "You were very kind to my wife!" },
        just: { es: "Acabas de ser el primero en responder.", en: "You were just the first to reply." },
        now: { es: "¿Tú eres de San Juan del Cesar?", en: "Are you from San Juan del Cesar?" },
        future: { es: "Vas a ser un crack hablando español.", en: "You are going to be a pro speaking Spanish." },
        polite: { es: "¿Eso es aquí nomás a la vuelta?", en: "Is that right just around the corner?" }
      },
      vos: {
        past: { es: "Vos fuiste quien recomendó ese café.", en: "You were the one who recommended that cafe." },
        just: { es: "Acabás de ser súper claro conmigo.", en: "You were just super clear with me." },
        now: { es: "¿Vos sos paisa o de Cali?", en: "Are you Paisa or from Cali?" },
        future: { es: "Va a ser un día sabroso para pasear.", en: "It is going to be a great day to stroll around." },
        polite: { es: "¿Es verdad que allá cierran temprano?", en: "Is it true they close early over there?" }
      },
      usted: {
        past: { es: "Fue un gusto conocerlo hoy.", en: "It was a pleasure meeting you today." },
        just: { es: "Eso acaba de ser una gran ayuda.", en: "That was just a huge help." },
        now: { es: "¿Cuánto es por todo, por favor?", en: "How much is it for everything, please?" },
        future: { es: "¿Será por tarjeta o por transferencia?", en: "Would that be by card or transfer?" },
        polite: { es: "Disculpe, ¿es esta la fila para pagar?", en: "Excuse me, is this the line to pay?" }
      },
      nosotros: {
        past: { es: "Fuimos los únicos extranjeros en el bus.", en: "We were the only foreigners on the bus." },
        just: { es: "Acabamos de ser invitados a un asado.", en: "We were just invited to a barbecue." },
        now: { es: "Somos familia de por aquí en el barrio.", en: "We are family from around this neighborhood." },
        future: { es: "Va a ser una experiencia inolvidable.", en: "It is going to be an unforgettable experience." },
        polite: { es: "¿Es necesario mostrar la cédula o el pasaporte?", en: "Is it necessary to show Colombian ID or passport?" }
      }
    }
  },
  {
    id: "vv-querer",
    verb: "querer",
    label: "❤️ Querer (want / 'Me gustaría')",
    tip: "Saying direct 'Quiero…' works with friends, while Colombians soften restaurant/shop orders with '¿Me regala…?' or 'Quisiera…'.",
    forms: {
      yo: {
        past: { es: "Ayer quise probar el friche tradicional.", en: "Yesterday I wanted to try traditional friche." },
        just: { es: "Acabo de querer cambiar el pedido a tiempo.", en: "I just wanted to update the order in time." },
        now: { es: "Quiero practicar diez minutos todos los días.", en: "I want to practice ten minutes every day." },
        future: { es: "Voy a querer volver a Cartagena pronto.", en: "I am going to want to return to Cartagena soon." },
        polite: { es: "Quisiera un jugo de lulo en agua, por favor.", en: "I would like a lulo juice in water, please." }
      },
      tu: {
        past: { es: "¿Quisiste salir aunque estaba lloviendo?", en: "Did you still want to go out even though it rained?" },
        just: { es: "Justo ahora querías escuchar un vallenato.", en: "Just now you wanted to listen to a vallenato." },
        now: { es: "¿Qué quieres tomar ahorita? ¿Un café?", en: "What do you want to drink right now? A coffee?" },
        future: { es: "¿Vas a querer llevar algo para la casa?", en: "Are you going to want to take something home?" },
        polite: { es: "Si quieres, te mando la dirección por acá.", en: "If you want, I'll send you the address right here." }
      },
      vos: {
        past: { es: "¿No quisiste pedir postre después del plato?", en: "Didn't you want to order dessert after the dish?" },
        just: { es: "Acabás de decir que querías caminar.", en: "You just said you wanted to walk." },
        now: { es: "¿Querés que pidamos un Uber de una vez?", en: "Do you want us to call an Uber right now?" },
        future: { es: "¿Vas a querer ir a la ciclovía el domingo?", en: "Are you going to want to go to ciclovía Sunday?" },
        polite: { es: "Cuando querás, nos tomamos un tinto.", en: "Whenever you want, let's grab a black coffee." }
      },
      usted: {
        past: { es: "¿Usted quiso decir con o sin azúcar?", en: "Did you mean with or without sugar?" },
        just: { es: "Perdón, ¿quería factura electrónica?", en: "Sorry, did you want an electronic invoice?" },
        now: { es: "¿Lo quiere para comer acá o para llevar?", en: "Do you want it for here or to go?" },
        future: { es: "¿Va a querer copia del recibo?", en: "Are you going to want a copy of the receipt?" },
        polite: { es: "Si usted quiere, lo puedo cancelar por Nequi.", en: "If you'd like, I can pay it via Nequi." }
      },
      nosotros: {
        past: { es: "Quisimos conocer el centro histórico temprano.", en: "We wanted to visit the historic center early." },
        just: { es: "Acabamos de pedir lo que queríamos.", en: "We just ordered what we wanted." },
        now: { es: "Queremos una mesa tranquila cerca de la ventana.", en: "We want a quiet table near the window." },
        future: { es: "Vamos a querer otro tinto en la tarde.", en: "We are going to want another black coffee later." },
        polite: { es: "Quisiéramos ver el menú del día, por favor.", en: "We would like to see the daily menu, please." }
      }
    }
  }
];

const COLOMBIAN_STORIES = [
  {
    id: "st-sanjuan",
    title: "🪗 Fin de semana en San Juan",
    sub: "Connect yesterday's trip, a warm bridge, and what's happening today.",
    parts: [
      {
        label: "1️⃣ Setup / What Happened",
        options: [
          { es: "Ayer llegamos a San Juan del Cesar por la tarde.", en: "Yesterday we arrived in San Juan del Cesar in the afternoon." },
          { es: "El sábado salimos temprano para visitar a la familia.", en: "On Saturday we left early to visit family." },
          { es: "Anoche estuvimos escuchando vallenato en la terraza.", en: "Last night we were listening to vallenato on the porch." }
        ]
      },
      {
        label: "2️⃣ Connector Bridge",
        options: [
          { es: "Hacía muchísimo calor, entonces", en: "It was super hot, so" },
          { es: "Aunque el viaje fue largo,", en: "Even though the trip was long," },
          { es: "De todas formas teníamos hambre, así que", en: "Anyway we were hungry, so" }
        ]
      },
      {
        label: "3️⃣ Outcome / Next Step",
        options: [
          { es: "prendimos el abanico y probamos el friche.", en: "we turned on the fan and tried friche." },
          { es: "hoy vamos a tomar un jugo de corozo bien frío.", en: "today we are going to drink an ice-cold corozo juice." },
          { es: "nos quedamos hablando con los primos hasta tarde.", en: "we stayed chatting with the cousins until late." }
        ]
      }
    ]
  },
  {
    id: "st-lluvia-uber",
    title: "🚕 Aguacero y Uber en Bogotá",
    sub: "Turn a sudden plan change into smooth natural storytelling.",
    parts: [
      {
        label: "1️⃣ Original Plan / Past",
        options: [
          { es: "Hoy quería caminar hasta el café de la esquina,", en: "Today I wanted to walk to the corner cafe," },
          { es: "Esta mañana salí sin sombrilla por el afán,", en: "This morning I went out without an umbrella in a rush," },
          { es: "Al principio pensé tomar el bus por la séptima,", en: "At first I thought about taking the bus on Carrera 7," }
        ]
      },
      {
        label: "2️⃣ Connector Bridge",
        options: [
          { es: "pero cayó un aguacero fuerte;", en: "but a heavy downpour fell;" },
          { es: "sin embargo había muchísimo trancón;", en: "however there was awful traffic;" },
          { es: "y como se puso tarde, entonces", en: "and since it got late, then" }
        ]
      },
      {
        label: "3️⃣ How You Handled It",
        options: [
          { es: "pedí un Uber y llegué justo a tiempo.", en: "I ordered an Uber and arrived right on time." },
          { es: "entré a una panadería y me pedí un tinto calientico.", en: "I stepped into a bakery and ordered a hot black coffee." },
          { es: "le mandé un audio por WhatsApp para avisar.", en: "I sent a WhatsApp voice note to let them know." }
        ]
      }
    ]
  },
  {
    id: "st-panaderia",
    title: "🥐 Pedir y Cancelar en la Panadería",
    sub: "Practice past-present-polite switches in everyday errands.",
    parts: [
      {
        label: "1️⃣ Entering / Setting Scene",
        options: [
          { es: "Ahorita pasé por la panadería del barrio", en: "A bit ago I stopped by the neighborhood bakery" },
          { es: "Hoy me provocó algo calientico para desayunar,", en: "Today I felt like something warm for breakfast," },
          { es: "Fui a comprar dos pandebonos antes del trabajo", en: "I went to buy two pandebonos before work" }
        ]
      },
      {
        label: "2️⃣ Connector Bridge",
        options: [
          { es: "y cuando fui a pagar en el datáfono,", en: "and when I went to pay on the card terminal," },
          { es: "pero no tenía sencillo en efectivo, así que", en: "but I didn't have small cash, so" },
          { es: "y la señora muy amable me preguntó el pago; entonces", en: "and the kind lady asked about payment; then" }
        ]
      },
      {
        label: "3️⃣ Smooth Resolution",
        options: [
          { es: "dije 'con tarjeta y a una sola cuota, por favor'.", en: "I said 'by card in a single installment, please'." },
          { es: "lo cancelé por Nequi en dos segundos y salí feliz.", en: "I paid it via Nequi in two seconds and left happy." },
          { es: "me regaló una servilleta y salí caminando tranquilo.", en: "she handed me a napkin and I walked out relaxed." }
        ]
      }
    ]
  },
  {
    id: "st-almuerzo",
    title: "🍽️ Almuerzo Corrientazo",
    sub: "Explain preferences, ask politely, and wrap up naturally.",
    parts: [
      {
        label: "1️⃣ Arriving at Lunch",
        options: [
          { es: "Al mediodía entramos a un restaurante súper acogedor", en: "At noon we went into a super cozy restaurant" },
          { es: "Ayer tenía mucha hambre después de caminar tanto,", en: "Yesterday I was really hungry after walking so much," },
          { es: "Con mis amigos quisimos probar el menú del día", en: "With my friends we wanted to try today's set lunch" }
        ]
      },
      {
        label: "2️⃣ Connector Bridge",
        options: [
          { es: "y como me encanta el jugo natural,", en: "and since I love fresh fruit juice," },
          { es: "entonces cuando me preguntaron por el principio,", en: "so when they asked about the side dish," },
          { es: "pero no quería nada muy dulce, así que", en: "but I didn't want anything too sweet, so" }
        ]
      },
      {
        label: "3️⃣ Result / Wrap-Up",
        options: [
          { es: "pedí frijoles con tajadas y lulo en agua bajito de azúcar.", en: "I ordered beans with plantains and lulo in water light on sugar." },
          { es: "todo estuvo delicioso y quedamos súper satisfechos.", en: "everything was delicious and we ended up super satisfied." },
          { es: "vamos a volver mañana porque atienden buenísimo.", en: "we are going to come back tomorrow because service is awesome." }
        ]
      }
    ]
  }
];
