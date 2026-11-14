import { speak } from "../src/audio/voice-engine.js";

// Spanish learning app data
// ── Alphabet ──────────────────────────────────────────────────────────────────
export const VW=["a","e","i","o","u"];
export const VL=["A","E","I","O","U"];
export const AL=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
export const CN=AL.filter(l=>!VL.includes(l));
export const LI={A:{name:"a",phonetic:"ah",tts:"a"},B:{name:"be",phonetic:"beh",tts:"be"},C:{name:"ce",phonetic:"seh",tts:"ce"},D:{name:"de",phonetic:"deh",tts:"de"},E:{name:"e",phonetic:"eh",tts:"e"},F:{name:"efe",phonetic:"EH-feh",tts:"efe"},G:{name:"ge",phonetic:"heh",tts:"ge"},H:{name:"hache",phonetic:"AH-cheh",tts:"hache"},I:{name:"i",phonetic:"ee",tts:"i"},J:{name:"jota",phonetic:"HOH-tah",tts:"jota"},K:{name:"ka",phonetic:"kah",tts:"ka"},L:{name:"ele",phonetic:"EH-leh",tts:"ele"},M:{name:"eme",phonetic:"EH-meh",tts:"eme"},N:{name:"ene",phonetic:"EH-neh",tts:"ene"},Ñ:{name:"eñe",phonetic:"EH-nyeh",tts:"eñe"},O:{name:"o",phonetic:"oh",tts:"o"},P:{name:"pe",phonetic:"peh",tts:"pe"},Q:{name:"cu",phonetic:"koo",tts:"cu"},R:{name:"erre",phonetic:"EH-rreh",tts:"erre"},S:{name:"ese",phonetic:"EH-seh",tts:"ese"},T:{name:"te",phonetic:"teh",tts:"te"},U:{name:"u",phonetic:"oo",tts:"u"},V:{name:"uve",phonetic:"OO-beh (=B)",tts:"uve"},W:{name:"doble ve",phonetic:"DOH-bleh beh",tts:"doble ve"},X:{name:"equis",phonetic:"EH-kees",tts:"equis"},Y:{name:"ye",phonetic:"yeh",tts:"ye"},Z:{name:"zeta",phonetic:"SEH-tah",tts:"zeta"}};
export const VS={a:"ah",e:"eh",i:"ee",o:"oh",u:"oo"};
/* Spanish orthography on purpose: these strings are read by a SPANISH voice,
   so "dó/quí/só" come out right, while English-style "doh/kee/soh" would not. */
export const SYL_TTS_FIX={do:"dó",go:"gó",qi:"quí",to:"tó",ro:"ró",wu:"wú",zo:"só",ha:"a",he:"e",hi:"i",ho:"o",hu:"u"};
/* X almost never starts a syllable in real Spanish — it lives between vowels.
   So instead of fake X+vowel syllables, the Sílabas tab shows real example words. */
export const X_EXAMPLES=[
  {word:"Taxi",ph:"TAK-see",tts:"taxi",en:"taxi"},
  {word:"Examen",ph:"ek-SAH-men",tts:"examen",en:"exam"},
  {word:"Éxito",ph:"EK-see-toh",tts:"éxito",en:"success"},
];
/* H is silent in Spanish. Keep HA/HE/HI/HO/HU visible for comparison, but
   send only the vowel to speechSynthesis so the learner hears the real sound. */
export const RR_SOUND_EXAMPLES={
  a:{word:"arriba",ph:"ah-RREE-bah",tts:"arriba",en:"up / above"},
  e:{word:"arreglo",ph:"ah-RREH-gloh",tts:"arreglo",en:"repair / arrangement"},
  i:{word:"barriga",ph:"bah-RREE-gah",tts:"barriga",en:"stomach / belly"},
  o:{word:"arroyo",ph:"ah-RROH-yoh",tts:"arroyo",en:"stream"},
  u:{word:"arruga",ph:"ah-RROO-gah",tts:"arruga",en:"wrinkle"},
};
/* Special spelling patterns: these need their own lesson because a simple
   consonant + vowel grid cannot show the silent U or the dieresis clearly. */
export const SPECIAL_SOUNDS=[
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
export const TONGUE_TWISTERS=[
  {id:"rr-1",target:"RR",title:"RR fuerte · nivel 1",text:"Rosa corre rápido alrededor del carro rojo.",en:"Rosa runs quickly around the red car.",tts:"Rosa corre rápido alrededor del carro rojo."},
  {id:"rr-2",target:"RR",title:"RR fuerte · nivel 2",text:"El perro de Roberto corre por el barrio.",en:"Roberto's dog runs through the neighborhood.",tts:"El perro de Roberto corre por el barrio."},
  {id:"rr-3",target:"RR",title:"RR fuerte · reto",text:"Raúl arregla la rueda rota del carro rojo.",en:"Raúl repairs the red car's broken wheel.",tts:"Raúl arregla la rueda rota del carro rojo."},
  {id:"rr-advanced",target:"RR",title:"RR fuerte · reto largo",text:"Parra tenía una perra.\nGuerra tenía una parra.\nLa perra de Parra subió a la parra de Guerra.\nGuerra pegó con la porra a la perra de Parra.\nY Parra le dijo a Guerra: ¿Por qué ha pegado Guerra con la porra a la perra de Parra?\nY Guerra le contestó: Si la perra de Parra no hubiera subido a la parra de Guerra, Guerra no hubiese pegado con la porra a la perra de Parra.",en:"A long RR drill about Parra's dog and Guerra's grapevine.",tts:"Parra tenía una perra. Guerra tenía una parra. La perra de Parra subió a la parra de Guerra. Guerra pegó con la porra a la perra de Parra. Y Parra le dijo a Guerra: ¿Por qué ha pegado Guerra con la porra a la perra de Parra? Y Guerra le contestó: Si la perra de Parra no hubiera subido a la parra de Guerra, Guerra no hubiese pegado con la porra a la perra de Parra."},
  {id:"ene-1",target:"Ñ",title:"Ñ · nivel 1",text:"La niña come piña en la mañana.",en:"The girl eats pineapple in the morning.",tts:"La niña come piña en la mañana."},
  {id:"ene-2",target:"Ñ",title:"Ñ · nivel 2",text:"Mañana, Toño sueña con una montaña pequeña.",en:"Tomorrow, Toño dreams about a small mountain.",tts:"Mañana, Toño sueña con una montaña pequeña."},
  {id:"ge-gi-1",target:"J / GE-GI",title:"J y GE/GI",text:"Jorge gira y recoge la guitarra.",en:"Jorge turns and picks up the guitar.",tts:"Jorge gira y recoge la guitarra."},
  {id:"b-v-1",target:"B / V",title:"B y V",text:"Vivi bebe vino, pero Beto bebe agua.",en:"Vivi drinks wine, but Beto drinks water.",tts:"Vivi bebe vino, pero Beto bebe agua."},
];
export const PRONUNCIATION_TIPS=[
  {target:"RR",title:"RR: make the tongue vibrate",sound:"Not the English R",steps:["Keep the tip of your tongue relaxed just behind your upper teeth, where you would say Spanish D/T.","Let air flow over the relaxed tip. Do not curl the tongue back like an English R and do not force the vibration.","Build it slowly: t-ra → d-ra → rra, then rra/rre/rri/rro/rru → perro, carro, arriba."],avoid:"If it sounds like an English R, relax the tongue more and add steady air. A short tap is a useful step, but RR needs repeated vibration."},
  {target:"Ñ",title:"Ñ: one sound, one syllable",sound:"Like the ny in canyon",steps:["Lift the middle of your tongue toward the hard roof of your mouth, while the sides stay near the upper teeth.","Keep Ñ together as one consonant sound. Do not pronounce it as two separate sounds: ni-ño should flow as nee-nyoh.","Build it slowly: ña/ñe/ñi/ño/ñu → niño, mañana, año → a full sentence."],avoid:"Do not replace Ñ with an English N or add an extra vowel. Listen for the smooth ‘ny’ sound in the middle of the word."},
];
export const PHONETIC_WARMUP=[
  {id:"vowels",label:"Pure vowels",detail:"A · E · I · O · U",tts:"a, e, i, o, u",target:"a e i o u",note:"Keep each vowel short and steady; do not turn it into an English diphthong."},
  {id:"rr",label:"RR vibration",detail:"RRA · RRE · RRI · RRO · RRU",tts:"arriba, arreglo, barriga, arroyo, arruga",target:"arriba, arreglo, barriga, arroyo, arruga",note:"Relax the tongue tip and let the air create the vibration."},
  {id:"ene",label:"Ñ connection",detail:"ÑA · ÑE · ÑI · ÑO · ÑU",tts:"mañana, pequeño, niño, sueño, ñu",target:"mañana, pequeño, niño, sueño, ñu",note:"Keep Ñ as one smooth consonant; do not separate it into N plus a new syllable."},
  {id:"pairs",label:"Hear the contrast",detail:"PERO ↔ PERRO",tts:"pero, perro, pero, perro",target:"pero, perro",note:"Single R is a quick tap; RR is a stronger vibration."},
];
export const ENGLISH_INTERFERENCE=[
  {pattern:"A",spanish:"ah",english:"not ‘ay’",example:"casa",en:"house",tts:"casa"},
  {pattern:"E",spanish:"eh",english:"not ‘ee’",example:"mesa",en:"table",tts:"mesa"},
  {pattern:"I",spanish:"ee",english:"not English ‘eye’",example:"vino",en:"wine / came",tts:"vino"},
  {pattern:"O",spanish:"short oh",english:"do not add ‘oo’",example:"rojo",en:"red",tts:"rojo"},
  {pattern:"H",spanish:"silent",english:"never an English H",example:"hola",en:"hello",tts:"hola"},
  {pattern:"J / GE / GI",spanish:"strong breathy sound",english:"not English J",example:"gente",en:"people",tts:"gente"},
  {pattern:"B / V",spanish:"both use Spanish B",english:"not English V",example:"vivir",en:"to live",tts:"vivir"},
  {pattern:"R / RR",spanish:"tap / trill",english:"not English R",example:"pero / perro",en:"but / dog",tts:"pero, perro"},
];
export const MINIMAL_PAIRS=[
  {a:"pero",aEn:"but",b:"perro",bEn:"dog",tip:"One quick tap vs. a trill",tts:"pero, perro"},
  {a:"caro",aEn:"expensive",b:"carro",bEn:"car",tip:"Keep the double R vibrating",tts:"caro, carro"},
  {a:"cero",aEn:"zero",b:"cerro",bEn:"hill",tip:"S stays the same; R changes",tts:"cero, cerro"},
  {a:"para",aEn:"for / in order to",b:"parra",bEn:"grapevine",tip:"A perfect bridge to the long drill",tts:"para, parra"},
  {a:"coro",aEn:"choir",b:"corro",bEn:"I run",tip:"Short R vs. RR in the middle",tts:"coro, corro"},
];
export const SPANISH_THINKING_PROMPTS=[
  {intent:"Say that you need to practice today.",model:"Necesito practicar hoy.",tts:"Necesito practicar hoy."},
  {intent:"Say that you are going to call later.",model:"Voy a llamar más tarde.",tts:"Voy a llamar más tarde."},
  {intent:"Say that you did not understand.",model:"No entendí.",tts:"No entendí."},
  {intent:"Ask someone to repeat slowly.",model:"¿Puede repetir despacio?",tts:"¿Puede repetir despacio?"},
  {intent:"Say that the car is over there.",model:"El carro está allá.",tts:"El carro está allá."},
  {intent:"Say that you want to speak Spanish.",model:"Quiero hablar español.",tts:"Quiero hablar español."},
];
export function sylTTS(label,fallback){return SYL_TTS_FIX[label.toLowerCase()]||fallback||label.toLowerCase();}
export function speakSyl(label,fallback){
  speak(sylTTS(label,fallback),0.75);
}
export function gc(l,v){
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
