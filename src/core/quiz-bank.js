import {
  DIALOGUE, CONVERSATIONS, V36_CONVERSATIONS, V38_CONVERSATIONS, V39_CONVERSATIONS, V60_CONVERSATIONS,
  V60_CONVERSATION_QUIZ, V60_FILL_BLANK_QUIZ,
  VC, VOCALES_DATA, N130, NT, PQ, VERBS, COLOMBIANISMOS, SPECIAL_SOUNDS, SPEAKING_GUIDE, FRASES,
} from "../../data/index.js";
import { appState } from "../state/app-state.js";
import { normalizeQuizText, normalizeQuizPrompt, normalizeQuizAnswer } from "./text-utils.js";
import { qStore, srsStore, srsDue } from "./stores.js";

export const PHRASE_DIALOGUES=[
  {title:"Saludos formales",preview:DIALOGUE[0].es,en:"Formal greetings and introductions",versions:[{tense:null,lines:DIALOGUE}]},
  ...Array.from(new Set(CONVERSATIONS.map(c=>c.title))).map(title=>{
    const versions=CONVERSATIONS.filter(c=>c.title===title).map(c=>({tense:c.tense,lines:c.lines,alternates:c.alternates||[]}));
    const source=CONVERSATIONS.find(c=>c.title===title);
    return {title,preview:versions[0].lines[0].es,en:source&&source.en?source.en:"Ahora · Planes · Ayer",versions};
  })
];
export const RR_BANK=[];
(function(){
  const seen=new Set();
  PHRASE_DIALOGUES.forEach(d=>{(d.versions||[]).forEach(v=>{
    for(let i=0;i<v.lines.length-1;i++){
      const q=v.lines[i],ans=v.lines[i+1];
      if(/\?\s*$/.test(q.es)&&ans&&ans.es&&!seen.has(q.es)){
        seen.add(q.es);
        const combined=`${q.es} ${ans.es}`;
        const words=combined.trim().split(/\s+/).length;
        const clauses=(combined.match(/[,;:]/g)||[]).length;
        const level=words<=14&&clauses===0?"easy":(words<=24&&clauses<=1?"moderate":"challenge");
        RR_BANK.push({q:q.tts||q.es,qEs:q.es,qEn:q.en,aEs:ans.es,aTts:ans.tts||ans.es,aEn:ans.en,level});
      }
    }
  });});
})();
/* v79: Colombian service-counter reflexes. These are short, high-frequency
   prompts learners hear at shops, banks, restaurants, and on the street. */
export const RR_SERVICE_REFLEXES=[
  {q:"¿Con bolsa?",qEs:"¿Con bolsa?",qEn:"With a bag?",aEs:"Sí, por favor.",aTts:"Sí, por favor.",aEn:"Yes, please.",level:"easy",service:true},
  {q:"¿Desea incluir el servicio?",qEs:"¿Desea incluir el servicio?",qEn:"Would you like to include the service charge?",aEs:"Sí, agréguelo, por favor.",aTts:"Sí, agréguelo, por favor.",aEn:"Yes, please add it.",level:"moderate",service:true},
  {q:"¿A cuántas cuotas?",qEs:"¿A cuántas cuotas?",qEn:"How many installments?",aEs:"A una cuota, por favor.",aTts:"A una cuota, por favor.",aEn:"One installment, please.",level:"easy",service:true},
  {q:"¿Ahorros o corriente?",qEs:"¿Ahorros o corriente?",qEn:"Savings or checking?",aEs:"Ahorros, por favor.",aTts:"Ahorros, por favor.",aEn:"Savings, please.",level:"easy",service:true},
  {q:"¿Me confirma la dirección?",qEs:"¿Me confirma la dirección?",qEn:"Can you confirm the address?",aEs:"Sí, es la de la calle diez con carrera séptima.",aTts:"Sí, es la de la calle diez con carrera séptima.",aEn:"Yes, it is the one at Calle 10 and Carrera 7.",level:"moderate",service:true},
  {q:"¿Para llevar o para comer aquí?",qEs:"¿Para llevar o para comer aquí?",qEn:"To go or to eat here?",aEs:"Para llevar, por favor.",aTts:"Para llevar, por favor.",aEn:"To go, please.",level:"easy",service:true},
  {q:"¿Tiene sencillo?",qEs:"¿Tiene sencillo?",qEn:"Do you have smaller change?",aEs:"Sí, tengo un billete de diez mil.",aTts:"Sí, tengo un billete de diez mil.",aEn:"Yes, I have a ten-thousand-peso bill.",level:"moderate",service:true},
  {q:"¿Le ayudo con algo más?",qEs:"¿Le ayudo con algo más?",qEn:"Can I help you with anything else?",aEs:"No, gracias. Eso es todo.",aTts:"No, gracias. Eso es todo.",aEn:"No, thank you. That is all.",level:"easy",service:true},
  {q:"¿Necesita factura electrónica o consumidor final?",qEs:"¿Necesita factura electrónica o consumidor final?",qEn:"Do you need an electronic tax invoice or final consumer?",aEs:"Consumidor final, por favor.",aTts:"Consumidor final, por favor.",aEn:"Final consumer, please.",level:"easy",service:true},
  {q:"¿Cuál es el motivo de su viaje a Colombia?",qEs:"¿Cuál es el motivo de su viaje a Colombia?",qEn:"What is the purpose of your trip to Colombia?",aEs:"Vengo por turismo durante dos semanas.",aTts:"Vengo por turismo durante dos semanas.",aEn:"I am coming for tourism for two weeks.",level:"moderate",service:true},
  {q:"¿Para qué apartamento va?",qEs:"¿Para qué apartamento va?",qEn:"Which apartment are you going to?",aEs:"Buenas, voy para el apartamento quinientos dos.",aTts:"Buenas, voy para el apartamento quinientos dos.",aEn:"Hi, I am going to apartment 502.",level:"easy",service:true},
  {q:"¿Autoriza la subida del domiciliario?",qEs:"¿Autoriza la subida del domiciliario?",qEn:"Do you authorize the delivery driver to come up?",aEs:"Sí, vecino, déjelo subir por favor.",aTts:"Sí, vecino, déjelo subir por favor.",aEn:"Yes, doorman, please let him come up.",level:"moderate",service:true},
  {q:"¿Cómo se lo vamos a cortar hoy?",qEs:"¿Cómo se lo vamos a cortar hoy?",qEn:"How are we going to cut your hair today?",aEs:"Bajito a los lados con la dos y arriba con tijera.",aTts:"Bajito a los lados con la dos y arriba con tijera.",aEn:"Low on the sides with a #2 and scissors on top.",level:"moderate",service:true},
  {q:"¿En efectivo, tarjeta o transferencia por Nequi?",qEs:"¿En efectivo, tarjeta o transferencia por Nequi?",qEn:"In cash, card, or Nequi transfer?",aEs:"Con tarjeta en el datáfono, por favor.",aTts:"Con tarjeta en el datáfono, por favor.",aEn:"By card on the terminal, please.",level:"easy",service:true},
  {q:"¿Es alérgico a algún medicamento?",qEs:"¿Es alérgico a algún medicamento?",qEn:"Are you allergic to any medication?",aEs:"No, no soy alérgico a ningún medicamento.",aTts:"No, no soy alérgico a ningún medicamento.",aEn:"No, I am not allergic to any medication.",level:"moderate",service:true},
  {q:"¿Lo quiere con azúcar o sin azúcar?",qEs:"¿Lo quiere con azúcar o sin azúcar?",qEn:"Do you want it with sugar or without sugar?",aEs:"Sin azúcar, por favor.",aTts:"Sin azúcar, por favor.",aEn:"Without sugar, please.",level:"easy",service:true},
  {q:"¿Con copia del recibo?",qEs:"¿Con copia del recibo?",qEn:"Would you like a copy of the card receipt?",aEs:"No, gracias, sin copia está bien.",aTts:"No, gracias, sin copia está bien.",aEn:"No, thank you, without a copy is fine.",level:"easy",service:true},
  {q:"¿El jugo lo quiere en agua o en leche?",qEs:"¿El jugo lo quiere en agua o en leche?",qEn:"Do you want the juice in water or in milk?",aEs:"En agua y bajito de azúcar, por favor.",aTts:"En agua y bajito de azúcar, por favor.",aEn:"In water and low on sugar, please.",level:"easy",service:true},
  {q:"¿Los pandebonos son para comer acá o para llevar?",qEs:"¿Los pandebonos son para comer acá o para llevar?",qEn:"Are the pandebonos to eat here or to go?",aEs:"Para comer acá, calienticos por favor.",aTts:"Para comer acá, calienticos por favor.",aEn:"To eat here, warm please.",level:"easy",service:true},
  {q:"¿Por cuál plataforma sale el bus?",qEs:"¿Por cuál plataforma sale el bus?",qEn:"From which platform does the bus leave?",aEs:"Sale en diez minutos por la plataforma cuatro.",aTts:"Sale en diez minutos por la plataforma cuatro.",aEn:"It leaves in ten minutes from platform four.",level:"moderate",service:true},
  {q:"¿Este sector es tranquilo para caminar de noche?",qEs:"¿Este sector es tranquilo para caminar de noche?",qEn:"Is this area safe to walk at night?",aEs:"Sí, por la avenida es tranquilo, pero sin dar papaya.",aTts:"Sí, por la avenida es tranquilo, pero sin dar papaya.",aEn:"Yes, on the avenue it's calm, just don't flash valuables.",level:"moderate",service:true},
  {q:"¿Te queda bien si nos vemos mañana a las diez?",qEs:"¿Te queda bien si nos vemos mañana a las diez?",qEn:"Does it work for you if we meet tomorrow at ten?",aEs:"¡De una! Así quedamos; me confirmas por WhatsApp.",aTts:"¡De una! Así quedamos; me confirmas por WhatsApp.",aEn:"For sure! It's a plan; confirm with me on WhatsApp.",level:"easy",service:true},
  {q:"¿Cuántas series te faltan? ¿Nos turnamos en la máquina?",qEs:"¿Cuántas series te faltan? ¿Nos turnamos en la máquina?",qEn:"How many sets do you have left? Shall we take turns on the machine?",aEs:"Claro, hágale, solo me quedan dos series.",aTts:"Claro, hágale, solo me quedan dos series.",aEn:"Sure, go ahead, I only have two sets left.",level:"easy",service:true},
  {q:"¿En el arriendo están incluidos la administración y los servicios?",qEs:"¿En el arriendo están incluidos la administración y los servicios?",qEn:"Are the HOA fee and utilities included in the rent?",aEs:"Sí, todo está incluido y el calentador es a gas.",aTts:"Sí, todo está incluido y el calentador es a gas.",aEn:"Yes, everything is included and the water heater is gas.",level:"moderate",service:true},
  {q:"¿Será que me colaboras enviándome la ubicación por acá?",qEs:"¿Será que me colaboras enviándome la ubicación por acá?",qEn:"Could you help me out by sending me the location here?",aEs:"Claro que sí, ya mismo te la mando por WhatsApp.",aTts:"Claro que sí, ya mismo te la mando por WhatsApp.",aEn:"Of course, I'll send it to you on WhatsApp right now.",level:"easy",service:true},
  {q:"Buenas tardes, ¿con sopa o fruta? ¿Y qué principio le pongo?",qEs:"Buenas tardes, ¿con sopa o fruta? ¿Y qué principio le pongo?",qEn:"Good afternoon, with soup or fruit? And what side shall I put?",aEs:"Con sopa, por favor, y de principio frijoles con tajadas.",aTts:"Con sopa, por favor, y de principio frijoles con tajadas.",aEn:"With soup, please, and beans with plantains for the side.",level:"easy",service:true},
  {q:"Para registrar la SIM card necesito su número de cédula, por favor.",qEs:"Para registrar la SIM card necesito su número de cédula, por favor.",qEn:"To register the SIM card I need your Colombian ID number, please.",aEs:"Todavía no tengo cédula; ¿le sirve el número de mi pasaporte?",aTts:"Todavía no tengo cédula; ¿le sirve el número de mi pasaporte?",aEn:"I don't have a Colombian ID yet; does my passport number work?",level:"moderate",service:true},
  {q:"Bienvenido a la casa; te presento a mis papás, don Hernán y doña Clara.",qEs:"Bienvenido a la casa; te presento a mis papás, don Hernán y doña Clara.",qEn:"Welcome to the house; let me introduce my parents, Mr. Hernán and Mrs. Clara.",aEs:"Mucho gusto; me han hablado muchísimo de ustedes. ¡Qué casa tan acogedora!",aTts:"Mucho gusto; me han hablado muchísimo de ustedes. ¡Qué casa tan acogedora!",aEn:"Nice to meet you; I've heard so much about you. What a welcoming home!",level:"easy",service:true},
  {q:"¡Por fin viernes! ¿Qué planes tienes para este puente festivo?",qEs:"¡Por fin viernes! ¿Qué planes tienes para este puente festivo?",qEn:"Finally Friday! What plans do you have for this holiday weekend?",aEs:"Hoy vamos a una salsoteca y mañana salimos temprano para un pueblito.",aTts:"Hoy vamos a una salsoteca y mañana salimos temprano para un pueblito.",aEn:"Tonight we're going to a salsa club and tomorrow we leave early for a small town.",level:"easy",service:true},
  {q:"Señorita, ¿en dónde cancelo la cuenta del almuerzo?",qEs:"Señorita, ¿en dónde cancelo la cuenta del almuerzo?",qEn:"Miss, where do I pay the lunch bill?",aEs:"Puede cancelar allá en la caja con tarjeta, efectivo o Nequi.",aTts:"Puede cancelar allá en la caja con tarjeta, efectivo o Nequi.",aEn:"You can pay over at the register by card, cash, or Nequi.",level:"easy",service:true},
  {q:"¿En qué estrato está ubicado este conjunto cerrado?",qEs:"¿En qué estrato está ubicado este conjunto cerrado?",qEn:"What socioeconomic tier is this gated complex in?",aEs:"Está en estrato cuatro, así que los servicios llegan a buen precio.",aTts:"Está en estrato cuatro, así que los servicios llegan a buen precio.",aEn:"It's in tier 4, so the utilities come at a good price.",level:"moderate",service:true},
  {q:"Buenos días, ¿viene por medicina prepagada o consulta particular?",qEs:"Buenos días, ¿viene por medicina prepagada o consulta particular?",qEn:"Good morning, are you coming through private insurance or self-pay?",aEs:"Vengo por consulta particular para una limpieza dental.",aTts:"Vengo por consulta particular para una limpieza dental.",aEn:"I'm coming as self-pay for a dental cleaning.",level:"easy",service:true},
  {q:"Bienvenido a Migración Colombia. ¿Qué trámite viene a realizar hoy?",qEs:"Bienvenido a Migración Colombia. ¿Qué trámite viene a realizar hoy?",qEn:"Welcome to Migración Colombia. What process are you here for today?",aEs:"Vengo a registrar mi visa para sacar la cédula de extranjería.",aTts:"Vengo a registrar mi visa para sacar la cédula de extranjería.",aEn:"I'm here to register my visa to get my foreigner ID card.",level:"moderate",service:true},
  {q:"¡Ajá, primo! Bienvenido a San Juan del Cesar; pasa a la terraza y siéntate en la mecedora.",qEs:"¡Ajá, primo! Bienvenido a San Juan del Cesar; pasa a la terraza y siéntate en la mecedora.",qEn:"Hey cousin! Welcome to San Juan del Cesar; come onto the front porch and sit in the rocking chair.",aEs:"¡Muchas gracias! Qué alegría estar aquí en La Guajira con toda la familia.",aTts:"¡Muchas gracias! Qué alegría estar aquí en La Guajira con toda la familia.",aEn:"Thank you so much! What a joy to be here in La Guajira with the whole family.",level:"easy",service:true},
  {q:"Se fue la luz en la cocina después del aguacero; ¿qué revisamos primero?",qEs:"Se fue la luz en la cocina después del aguacero; ¿qué revisamos primero?",qEn:"The power went out in the kitchen after the downpour; what do we check first?",aEs:"Revisemos la caja de tacos porque seguro se saltó un taco de la luz.",aTts:"Revisemos la caja de tacos porque seguro se saltó un taco de la luz.",aEn:"Let's check the breaker box because a circuit breaker probably tripped.",level:"moderate",service:true},
  {q:"¡Hoy juega la Selección Colombia! ¿Cómo hacemos para pedir las picadas?",qEs:"¡Hoy juega la Selección Colombia! ¿Cómo hacemos para pedir las picadas?",qEn:"Today the Colombian National Team plays! How should we order the shared platters?",aEs:"Hagamos vaca entre todos por Nequi y pedimos a domicilio.",aTts:"Hagamos vaca entre todos por Nequi y pedimos a domicilio.",aEn:"Let's all pitch in via Nequi and order delivery.",level:"easy",service:true},
  {q:"Disculpe, agente, se me extravió el pasaporte; ¿dónde pongo el reporte?",qEs:"Disculpe, agente, se me extravió el pasaporte; ¿dónde pongo el reporte?",qEn:"Excuse me, officer, my passport was lost; where do I file the report?",aEs:"Puede registrar la constancia en el portal de la Policía Nacional o en el CAI.",aTts:"Puede registrar la constancia en el portal de la Policía Nacional o en el CAI.",aEn:"You can file the report on the National Police portal or at the CAI post.",level:"moderate",service:true},
  {q:"¡Uy, y ese milagro que vino por acá!",qEs:"¡Uy, y ese milagro que vino por acá!",qEn:"Oh, what a pleasant surprise seeing you around here!",aEs:"¡Cómo estás! Tenía muchas ganas de saludarlos.",aTts:"¡Cómo estás! Tenía muchas ganas de saludarlos.",aEn:"How are you! I really wanted to come say hi.",level:"easy",service:true},
  {q:"¿Cómo así? ¿Ya se acabó el partido?",qEs:"¿Cómo así? ¿Ya se acabó el partido?",qEn:"Wait what? Is the game already over?",aEs:"Sí, terminó hace cinco minutos; quedamos dos a uno.",aTts:"Sí, terminó hace cinco minutos; quedamos dos a uno.",aEn:"Yes, it ended five minutes ago; final score was two to one.",level:"easy",service:true},
  {q:"A la orden, mi vecino, ¿qué se le ofrece?",qEs:"A la orden, mi vecino, ¿qué se le ofrece?",qEn:"At your service, neighbor, what can I get for you?",aEs:"Buenas, ¿me regala dos empanadas y un ají por aparte?",aTts:"Buenas, ¿me regala dos empanadas y un ají por aparte?",aEn:"Hi, could I get two empanadas and hot sauce on the side?",level:"easy",service:true},
  {q:"¿De parte de quién digo que lo buscan?",qEs:"¿De parte de quién digo que lo buscan?",qEn:"Who shall I say is calling / looking for them?",aEs:"De parte de Seth; ya me estaban esperando.",aTts:"De parte de Seth; ya me estaban esperando.",aEn:"On behalf of Seth; they were already expecting me.",level:"moderate",service:true},
  {q:"¿Tiene el valor exacto o necesita vueltas?",qEs:"¿Tiene el valor exacto o necesita vueltas?",qEn:"Do you have exact change or do you need change back?",aEs:"Le pago con este billete de veinte mil, por favor.",aTts:"Le pago con este billete de veinte mil, por favor.",aEn:"I'll pay with this twenty-thousand bill, please.",level:"moderate",service:true},
  {q:"¿Qué más pues? ¿Cómo va todo en la casa?",qEs:"¿Qué más pues? ¿Cómo va todo en la casa?",qEn:"What's up then? How's everything at home?",aEs:"Todo súper bien, gracias a Dios, trabajando juiciosos.",aTts:"Todo súper bien, gracias a Dios, trabajando juiciosos.",aEn:"Everything's super good, thank God, staying busy with work.",level:"easy",service:true},
  {q:"¿Me regalas un segundito mientras cuadro la caja?",qEs:"¿Me regalas un segundito mientras cuadro la caja?",qEn:"Can you give me a quick second while I settle the register?",aEs:"Claro, tranquilo, tómate tu tiempo sin afán.",aTts:"Claro, tranquilo, tómate tu tiempo sin afán.",aEn:"Sure, no worries, take your time without rushing.",level:"moderate",service:true},
  {q:"¿Sí me hice entender con la dirección?",qEs:"¿Sí me hice entender con la dirección?",qEn:"Did I make myself clear with the directions?",aEs:"Sí, clarísimo: dos cuadras derecho y giro a la izquierda.",aTts:"Sí, clarísimo: dos cuadras derecho y giro a la izquierda.",aEn:"Yes, super clear: two blocks straight and turn left.",level:"moderate",service:true},
  {q:"¿Vas saliendo ya o te demoras un ratico?",qEs:"¿Vas saliendo ya o te demoras un ratico?",qEn:"Are you heading out now or taking a little longer?",aEs:"Ya salgo en cinco minuticos; voy bajando al lobby.",aTts:"Ya salgo en cinco minuticos; voy bajando al lobby.",aEn:"Leaving in five quick minutes; heading down to the lobby.",level:"easy",service:true},
  {q:"¿El café lo prefiere bien cargado o clarito?",qEs:"¿El café lo prefiere bien cargado o clarito?",qEn:"Do you prefer the coffee strong or mild?",aEs:"Término medio está perfecto, sin azúcar por favor.",aTts:"Término medio está perfecto, sin azúcar por favor.",aEn:"Medium strength is perfect, no sugar please.",level:"easy",service:true}
];
RR_BANK.push(...RR_SERVICE_REFLEXES);
export function quizAcceptedAnswers(q){
  const values=[];const add=value=>{if(value!==undefined&&value!==null&&String(value).trim())values.push(String(value));};
  if(q&&q.answer!==undefined)add(q.answer);else add(q&&q.en);
  (q&&Array.isArray(q.acceptedAnswers)?q.acceptedAnswers:[]).forEach(add);
  if(q&&!q.kind&&(!q.answer||q.answer===q.en)&&typeof aQ!=="undefined"){
    const prompt=normalizeQuizPrompt(q.quizPrompt||q.es);
    aQ.filter(other=>!other.kind&&normalizeQuizPrompt(other.quizPrompt||other.es)===prompt).forEach(other=>add(other.en));
  }
  return [...new Map(values.map(value=>[normalizeQuizText(value),value])).values()];
}
export function quizAnswerMatches(q,value){
  const key=normalizeQuizText(value);return !!key&&quizAcceptedAnswers(q).some(answer=>normalizeQuizText(answer)===key);
}
export function storedMissedQuestionCount(){
  try{
    const raw=JSON.parse(localStorage.getItem("esco-quiz-v1")||"{}");
    const missed=raw&&raw.missed&&typeof raw.missed==="object"?raw.missed:{};
    return Object.values(missed).filter(value=>Number(value)>0).length;
  }catch(e){return 0;}
}
export const CONVERSATION_QUIZ=[
  {kind:"meaning",es:"¿Cómo te llamas?",en:"What's your name?",tts:"¿Cómo te llamas?",cat:"conversaciones",choices:["What's your name?","Where do you live?","What do you do for work?","Do you have siblings?"]},
  {kind:"reply",es:"¿Cómo te llamas?",quizPrompt:"Reply naturally: ¿Cómo te llamas?",en:"Me llamo Laura.",tts:"¿Cómo te llamas?",cat:"conversaciones",choices:["Me llamo Laura.","Vivo en Medellín.","Trabajo como chef.","Siga derecho."]},
  {kind:"listening",es:"Me llamo Laura. Mucho gusto.",en:"My name is Laura. Nice to meet you.",tts:"Me llamo Laura. Mucho gusto.",cat:"conversaciones",choices:["My name is Laura. Nice to meet you.","Yesterday I met a new person.","I work as an engineer.","I live near the park."]},
  {kind:"tense",es:"¿Cuál frase habla de un plan futuro?",en:"Mañana voy a presentarme a mis nuevos vecinos.",tts:"Mañana voy a presentarme a mis nuevos vecinos.",cat:"conversaciones",choices:["Mañana voy a presentarme a mis nuevos vecinos.","Me llamo Laura.","Ayer conocí a una persona nueva.","Le dije mi nombre."]},
  {kind:"meaning",es:"Trabajo como ingeniero.",en:"I work as an engineer.",tts:"Trabajo como ingeniero.",cat:"conversaciones",choices:["I work as an engineer.","I'm going to study medicine.","I worked at the office yesterday.","I'm a passenger."]},
  {kind:"reply",es:"¿En qué trabajas?",en:"Trabajo como ingeniero.",tts:"¿En qué trabajas?",cat:"conversaciones",choices:["Trabajo como ingeniero.","Voy a vivir en Bogotá.","Tengo una hermana.","Me gusta leer."]},
  {kind:"listening",es:"Voy a estudiar para ser médico.",en:"I'm going to study to become a doctor.",tts:"Voy a estudiar para ser médico.",cat:"conversaciones",choices:["I'm going to study to become a doctor.","Yesterday I worked at the office.","Go straight and turn left.","I like my job."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes the work day?",en:"Ayer trabajé en la oficina.",tts:"Ayer trabajé en la oficina.",cat:"conversaciones",choices:["Ayer trabajé en la oficina.","Trabajo como ingeniero.","Voy a estudiar para ser médico.","¿Qué vas a estudiar?"]},
  {kind:"meaning",es:"¿Dónde vives?",en:"Where do you live?",tts:"¿Dónde vives?",cat:"conversaciones",choices:["Where do you live?","Where are you going to live?","Where did you live before?","Where is the bathroom?"]},
  {kind:"reply",es:"¿Dónde vives?",quizPrompt:"Reply with where you live: ¿Dónde vives?",en:"Vivo en Medellín, cerca del parque.",tts:"¿Dónde vives?",cat:"conversaciones",choices:["Vivo en Medellín, cerca del parque.","Voy a pasar tiempo con ellos.","Viví en Cali con mi familia.","Claro, con mucho gusto."]},
  {kind:"listening",es:"Voy a vivir en Bogotá el próximo año.",en:"I'm going to live in Bogotá next year.",tts:"Voy a vivir en Bogotá el próximo año.",cat:"conversaciones",choices:["I'm going to live in Bogotá next year.","I live in Medellín.","I lived in Cali with my family.","I'm going to request a taxi."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes where someone lived?",en:"Viví en Cali con mi familia.",tts:"Viví en Cali con mi familia.",cat:"conversaciones",choices:["Viví en Cali con mi familia.","Vivo en Medellín.","Voy a vivir en Bogotá.","¿Dónde vives?"]},
  {kind:"meaning",es:"¿Tienes hermanos?",en:"Do you have siblings?",tts:"¿Tienes hermanos?",cat:"conversaciones",choices:["Do you have siblings?","Do you have pets?","What are you going to do?","Do you like sports?"]},
  {kind:"reply",es:"¿Qué vas a hacer con tu familia?",en:"Voy a pasar tiempo con ellos.",tts:"¿Qué vas a hacer con tu familia?",cat:"conversaciones",choices:["Voy a pasar tiempo con ellos.","Sí, tengo una hermana.","Ayer cené con mis padres.","No me gusta mi trabajo."]},
  {kind:"listening",es:"Ayer cené con mis padres.",en:"Yesterday I had dinner with my parents.",tts:"Ayer cené con mis padres.",cat:"conversaciones",choices:["Yesterday I had dinner with my parents.","I have a sister and a brother.","I'm going to spend time with them.","It is delicious."]},
  {kind:"tense",es:"¿Cuál frase describe el presente?",en:"Sí, tengo una hermana y un hermano.",tts:"Sí, tengo una hermana y un hermano.",cat:"conversaciones",choices:["Sí, tengo una hermana y un hermano.","Voy a pasar tiempo con ellos.","Ayer cené con mis padres.","¿Qué hiciste con tu familia?"]},
  {kind:"meaning",es:"Siga derecho y gire a la izquierda.",en:"Go straight and turn left.",tts:"Siga derecho y gire a la izquierda.",cat:"conversaciones",choices:["Go straight and turn left.","Turn right at the traffic light.","The address is nearby.","Take me to this address."]},
  {kind:"reply",es:"Disculpe, ¿me regala la dirección?",en:"Siga derecho y gire a la izquierda.",tts:"Disculpe, ¿me regala la dirección?",cat:"conversaciones",choices:["Siga derecho y gire a la izquierda.","Me llamo Laura.","Voy a preparar una sopa.","Está al lado de la habitación."]},
  {kind:"listening",es:"Va a girar en la próxima esquina.",en:"You are going to turn at the next corner.",tts:"Va a girar en la próxima esquina.",cat:"conversaciones",choices:["You are going to turn at the next corner.","I went straight and asked at the corner.","Go straight and turn left.","The driver was very kind."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence tells what happened while finding the address?",en:"Seguí derecho y pregunté en la esquina.",tts:"Seguí derecho y pregunté en la esquina.",cat:"conversaciones",choices:["Seguí derecho y pregunté en la esquina.","Siga derecho y gire a la izquierda.","Va a girar en la próxima esquina.","¿Cómo voy a llegar al parqueadero?"]},
  {kind:"meaning",es:"¿Me lleva a esta dirección, por favor?",en:"Can you take me to this address, please?",tts:"¿Me lleva a esta dirección, por favor?",cat:"conversaciones",choices:["Can you take me to this address, please?","Are we going to request a car?","Did you take a taxi yesterday?","Where is the parking lot?"]},
  {kind:"reply",es:"¿Qué vas a pedir para llegar a la dirección?",en:"Voy a pedir un taxi.",tts:"¿Qué vas a pedir para llegar a la dirección?",cat:"conversaciones",choices:["Voy a pedir un taxi.","Claro, con mucho gusto.","Trabajo como conductor.","Ayer trabajé en la oficina."]},
  {kind:"listening",es:"Claro, con mucho gusto.",en:"Of course, with pleasure.",tts:"Claro, con mucho gusto.",cat:"conversaciones",choices:["Of course, with pleasure.","Yes, I'm going to request a taxi.","The driver was very kind.","I live near the park."]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes the driver?",en:"Sí, el conductor fue muy amable.",tts:"Sí, el conductor fue muy amable.",cat:"conversaciones",choices:["Sí, el conductor fue muy amable.","¿Me lleva a esta dirección?","Voy a pedir un taxi.","Vamos a pedir un carro."]},
  {kind:"meaning",es:"¿Cocinamos juntos?",en:"Shall we cook together?",tts:"¿Cocinamos juntos?",cat:"conversaciones",choices:["Shall we cook together?","What are we going to cook?","What did you cook yesterday?","I cut the vegetables."]},
  {kind:"reply",es:"¿Qué vamos a cocinar?",en:"Vamos a preparar una sopa.",tts:"¿Qué vamos a cocinar?",cat:"conversaciones",choices:["Vamos a preparar una sopa.","Dale, yo corto las verduras.","Ayer hervimos la comida.","Me gusta la música."]},
  {kind:"listening",es:"Dale, yo corto las verduras.",en:"Sure, I'll cut the vegetables.",tts:"Dale, yo corto las verduras.",cat:"conversaciones",choices:["Sure, I'll cut the vegetables.","We are going to make a soup.","Yesterday we tasted the sauce.","Can you give me the address?"]},
  {kind:"tense",es:"¿Cuál frase está en pasado?",quizPrompt:"Past tense: which sentence describes cooking yesterday?",en:"Ayer hervimos la comida y probamos la salsa.",tts:"Ayer hervimos la comida y probamos la salsa.",cat:"conversaciones",choices:["Ayer hervimos la comida y probamos la salsa.","¿Cocinamos juntos?","Vamos a preparar una sopa.","Yo corto las verduras."]},
  {kind:"meaning",es:"¿Dónde está el baño?",en:"Where is the bathroom?",tts:"¿Dónde está el baño?",cat:"conversaciones",choices:["Where is the bathroom?","Where is the bedroom?","Where was the towel?","Are you going to tidy the bedroom?"]},
  {kind:"reply",es:"¿Vas a arreglar la habitación?",en:"Sí, voy a cambiar la sábana y la cobija.",tts:"¿Vas a arreglar la habitación?",cat:"conversaciones",choices:["Sí, voy a cambiar la sábana y la cobija.","Está al lado de la habitación.","Ayer la dejé junto al lavamanos.","Siga derecho."]},
  {kind:"listening",es:"Ayer la dejé junto al lavamanos.",en:"Yesterday I left it next to the sink.",tts:"Ayer la dejé junto al lavamanos.",cat:"conversaciones",choices:["Yesterday I left it next to the sink.","It is next to the bedroom.","I'm going to change the sheet.","Where is the bathroom?"]},
  {kind:"tense",es:"¿Cuál frase describe el presente?",quizPrompt:"Present tense: which sentence describes the current location?",en:"Está al lado de la habitación.",tts:"Está al lado de la habitación.",cat:"conversaciones",choices:["Está al lado de la habitación.","Voy a cambiar la sábana.","Ayer la dejé junto al lavamanos.","¿Dónde estaba la toalla?"]},
  {kind:"pronoun",es:"¿Me lo puede repetir, por favor?",en:"Sí, se lo repito despacio.",tts:"¿Me lo puede repetir, por favor?",cat:"pronombres",choices:["Sí, se lo repito despacio.","Sí, la tengo aquí.","No, pero me la puede enviar.","Sí, necesito ayuda."]},
  {kind:"pronoun",es:"¿La dirección la tiene?",en:"Sí, la tengo aquí.",tts:"¿La dirección la tiene?",cat:"pronombres",choices:["Sí, la tengo aquí.","Sí, se lo repito despacio.","Sí, necesito ayuda.","La voy a buscar mañana."]},
  {kind:"pronoun",es:"¿Le explicaste el problema?",en:"Sí, se lo expliqué al técnico.",tts:"¿Le explicaste el problema?",cat:"pronombres",choices:["Sí, se lo expliqué al técnico.","Sí, la tengo aquí.","No, pero me la puede enviar.","Sí, se lo repito despacio."]},
  {kind:"meaning",es:"Fui al mercado porque necesitaba comida.",en:"I went to the market because I needed food.",tts:"Fui al mercado porque necesitaba comida.",cat:"frases",choices:["I went to the market because I needed food.","I was going to cook, but I had to work.","I am at home and I have to finish a project.","I could not go because I was sick."]},
  {kind:"reply",es:"¿Qué ibas a hacer?",en:"Iba a cocinar, pero tuve que trabajar.",tts:"¿Qué ibas a hacer?",cat:"frases",choices:["Iba a cocinar, pero tuve que trabajar.","Estaba en casa; quería descansar.","Fui al mercado porque necesitaba comida.","Estoy en casa y tengo que terminar un proyecto."]},
  {kind:"listening",es:"Estaba en la oficina cuando me llamaste.",en:"I was at the office when you called me.",tts:"Estaba en la oficina cuando me llamaste.",cat:"frases",choices:["I was at the office when you called me.","I went to the market because I needed food.","I wanted to rest at home.","I was going to cook, but I had to work."]},
  {kind:"tense",es:"¿Cuál frase describe una situación en progreso en el pasado?",en:"Estaba en casa cuando llamaste.",tts:"Estaba en casa cuando llamaste.",cat:"frases",choices:["Estaba en casa cuando llamaste.","Fui al mercado ayer.","Voy a cocinar esta noche.","Soy de Estados Unidos."]},
  {kind:"meaning",es:"No podía ir porque estaba enfermo.",en:"I couldn't go because I was sick.",tts:"No podía ir porque estaba enfermo.",cat:"frases",choices:["I couldn't go because I was sick.","I had to work yesterday.","I was going to the market.","I wanted to cook dinner."]},
  {kind:"reply",es:"¿Por qué no fuiste?",en:"No podía ir porque estaba enfermo.",tts:"¿Por qué no fuiste?",cat:"frases",choices:["No podía ir porque estaba enfermo.","Fui al mercado porque necesitaba comida.","Estaba en casa; quería descansar.","Iba a cocinar, pero tuve que trabajar."]},
  {kind:"meaning",es:"¡No joda!",en:"No way! / Come on!",tts:"¡No joda!",cat:"groserias",choices:["No way! / Come on!","Darn, I'm late!","What a drag!","I don't give a fuck."]},
  {kind:"meaning",es:"¡Juepucha, se me hizo tarde!",en:"Darn, I'm late!",tts:"¡Juepucha, se me hizo tarde!",cat:"groserias",choices:["Darn, I'm late!","What horrible traffic!","Don't be an idiot.","That's awesome!"]},
  {kind:"meaning",es:"¡Qué gonorrea de tráfico!",en:"What horrible traffic!",tts:"¡Qué gonorrea de tráfico!",cat:"groserias",choices:["What horrible traffic!","What a drag!","No way! / Come on!","That guy is a jerk."]},
  {kind:"meaning",es:"Ese man es un pirobo.",en:"That guy is a jerk.",tts:"Ese man es un pirobo.",cat:"groserias",choices:["That guy is a jerk.","That guy is very hardworking.","That guy is my friend.","That guy is late."]},
  {kind:"meaning",es:"No sea güevón.",en:"Don't be an idiot.",tts:"No sea güevón.",cat:"groserias",choices:["Don't be an idiot.","Don't be late.","Don't be afraid.","Don't be formal."]},
  {kind:"meaning",es:"¡Puta, se dañó el carro!",en:"Fuck, the car broke down.",tts:"¡Puta, se dañó el carro!",cat:"groserias",choices:["Fuck, the car broke down.","The car is very clean.","I am going to buy a car.","The car is nearby."]},
  {kind:"meaning",es:"Me importa un culo.",en:"I don't give a fuck.",tts:"Me importa un culo.",cat:"groserias",choices:["I don't give a fuck.","I need a favor.","I care a lot.","I am very tired."]},
  {kind:"meaning",es:"¡Ay, marica, qué susto!",en:"Dude, what a scare!",tts:"¡Ay, marica, qué susto!",cat:"groserias",choices:["Dude, what a scare!","Darn, I'm late!","What a delicious meal!","I am at the office."]},
  {kind:"meaning",es:"Ese malparido me estafó.",en:"That bastard scammed me.",tts:"Ese malparido me estafó.",cat:"groserias",choices:["That bastard scammed me.","That friend helped me.","The driver called me.","I paid in cash."]},
  {kind:"meaning",es:"Tengo que terminar el proyecto.",en:"I have to finish the project.",tts:"Tengo que terminar el proyecto.",cat:"frases",choices:["I have to finish the project.","I just finished the project.","I forgot the project.","I sent the project to her."]},
  {kind:"meaning",es:"Acabo de llegar.",en:"I just arrived.",tts:"Acabo de llegar.",cat:"frases",choices:["I just arrived.","I am going to leave.","I have to arrive tomorrow.","I arrived yesterday."]},
  {kind:"meaning",es:"Se me olvidó la dirección.",en:"I forgot the address.",tts:"Se me olvidó la dirección.",cat:"frases",choices:["I forgot the address.","I have the address.","I sent the address.","I need the address."]},
  {kind:"meaning",es:"Se lo mando en un momento.",en:"I will send it to him/her in a moment.",tts:"Se lo mando en un momento.",cat:"frases",choices:["I will send it to him/her in a moment.","I sent her the address yesterday.","I need to send it to myself.","I am going to buy it."]},
  {kind:"pronoun",es:"¿Tienes el documento? Sí, ___ tengo aquí.",en:"lo",tts:"¿Tienes el documento? Sí, lo tengo aquí.",cat:"pronombres",choices:["lo","la","le","las"]},
  {kind:"pronoun",es:"¿Tienes la llave? Sí, ___ tengo aquí.",en:"la",tts:"¿Tienes la llave? Sí, la tengo aquí.",cat:"pronombres",choices:["la","lo","le","los"]},
  {kind:"pronoun",es:"¿Le mandaste el mensaje? Sí, ___ mandé ayer.",en:"se lo",tts:"¿Le mandaste el mensaje? Sí, se lo mandé ayer.",cat:"pronombres",choices:["se lo","se la","lo le","la se"]},
  {kind:"pronoun",es:"¿Le explicaste la situación? Sí, ___ expliqué despacio.",en:"se la",tts:"¿Le explicaste la situación? Sí, se la expliqué despacio.",cat:"pronombres",choices:["se la","se lo","la le","lo se"]}
];
/* Tag the curated conversation bank so Focus can narrow it without removing
   the existing topic/category choices. */
CONVERSATION_QUIZ.forEach(q=>{
  if(q.cat==="conversaciones")q.cat="frases";
  const text=(q.es+" "+q.en).toLowerCase();
  if(q.kind==="pronoun")q.focus="pronombres";
  else if(/mañana|voy a|vas a|va a|vamos a|going to/.test(text))q.focus="future";
  else if(/ayer|anoche|fui|fuiste|fuimos|fueron|viví|trabajé|cené|hervimos|fue|seguí|estaba|estuve|era|tenía|tuve que|quería|necesitaba|podía|iba a|yesterday|worked at|lived in|was at|couldn't/.test(text))q.focus="past";
  else q.focus="present";
});
/* Add two authored translation checks per new practical dialogue.  The
   choices come from the same dialogue but are fixed, distinct answers, so a
   learner is never graded against two equally valid options. */
export const PRACTICAL_DIALOGUES=(typeof V36_CONVERSATIONS!=="undefined"?V36_CONVERSATIONS:[]).concat(typeof V38_CONVERSATIONS!=="undefined"?V38_CONVERSATIONS:[],typeof V39_CONVERSATIONS!=="undefined"?V39_CONVERSATIONS:[]);
PRACTICAL_DIALOGUES.forEach(c=>{
  const topicCat=/Acciones/.test(c.title)?"acciones":/Uber/.test(c.title)?"uber":/Hotel/.test(c.title)?"hotel":/Farmacia/.test(c.title)?"farmacia":/Teléfono/.test(c.title)?"reparar":/dirección|edificio/i.test(c.title)?"direcciones":/Mercado/.test(c.title)?"compras":/Restaurante/.test(c.title)?"restaurante":/Planes/.test(c.title)?"frases":"frases";
  const lines=(c.lines||[]).slice(0,2);
  lines.forEach(line=>{
    const distractors=(c.lines||[]).filter(x=>x.en!==line.en).slice(0,3).map(x=>x.en);
    if(distractors.length===3)CONVERSATION_QUIZ.push({kind:"meaning",es:line.es,en:line.en,tts:line.tts,cat:topicCat,focus:/voy a|mañana|puedo|vamos/.test(line.es.toLowerCase())?"future":/ayer|anoche|llegué|pedí|estaba|se dañó/.test(line.es.toLowerCase())?"past":"present",choices:[line.en,...distractors]});
  });
});
/* ── Fill-in-the-blank Quiz Data (NEW v13) ──────────────────────────────────
   kind:"blank" — sentence with ___ ; choices are single words; tts = full sentence */
export const FILL_BLANK_QUIZ=[
  /* Presente */
  {kind:"blank",es:"Yo ___ en Bogotá.",en:"vivo",tts:"Yo vivo en Bogotá.",cat:"completar",choices:["vivo","vives","vive","vivimos"]},
  {kind:"blank",es:"¿Dónde ___ tú?",en:"vives",tts:"¿Dónde vives tú?",cat:"completar",choices:["vives","vivo","viven","vivimos"]},
  {kind:"blank",es:"Ella ___ arepa todos los días.",en:"come",tts:"Ella come arepa todos los días.",cat:"completar",choices:["come","como","comes","comemos"]},
  {kind:"blank",es:"Nosotros ___ español.",en:"hablamos",tts:"Nosotros hablamos español.",cat:"completar",choices:["hablamos","hablo","hablas","hablan"]},
  {kind:"blank",es:"Yo ___ dos hermanos.",en:"tengo",tts:"Yo tengo dos hermanos.",cat:"completar",choices:["tengo","tienes","tiene","tenemos"]},
  {kind:"blank",es:"¿Usted ___ inglés?",en:"habla",tts:"¿Usted habla inglés?",cat:"completar",choices:["habla","hablo","hablamos","hablan"]},
  /* Futuro cercano — voy a... */
  {kind:"blank",es:"Mañana yo ___ a trabajar.",en:"voy",tts:"Mañana yo voy a trabajar.",cat:"completar",choices:["voy","vas","va","vamos"]},
  {kind:"blank",es:"¿Qué ___ a comer tú?",en:"vas",tts:"¿Qué vas a comer tú?",cat:"completar",choices:["vas","voy","va","van"]},
  {kind:"blank",es:"Nosotros ___ a cocinar arepas.",en:"vamos",tts:"Nosotros vamos a cocinar arepas.",cat:"completar",choices:["vamos","voy","vas","van"]},
  {kind:"blank",es:"Ella ___ a ver una película.",en:"va",tts:"Ella va a ver una película.",cat:"completar",choices:["va","voy","vas","vamos"]},
  /* Pasado */
  {kind:"blank",es:"Ayer yo ___ al mercado.",en:"fui",tts:"Ayer yo fui al mercado.",cat:"completar",choices:["fui","fue","fuiste","fuimos"]},
  {kind:"blank",es:"¿Qué ___ tú anoche?",en:"comiste",tts:"¿Qué comiste tú anoche?",cat:"completar",choices:["comiste","comí","comió","comimos"]},
  {kind:"blank",es:"Él ___ hasta las seis.",en:"trabajó",tts:"Él trabajó hasta las seis.",cat:"completar",choices:["trabajó","trabajé","trabajaste","trabajamos"]},
  {kind:"blank",es:"Anoche yo ___ ocho horas.",en:"dormí",tts:"Anoche yo dormí ocho horas.",cat:"completar",choices:["dormí","durmió","dormiste","dormimos"]},
  /* Vocabulario */
  {kind:"blank",es:"¿Me regala un ___ para tomar, por favor?",en:"tinto",tts:"¿Me regala un tinto para tomar, por favor?",cat:"completar",choices:["tinto","trancón","cuchillo","semáforo"]},
  {kind:"blank",es:"Gire a la ___ en la esquina.",en:"derecha",tts:"Gire a la derecha en la esquina.",cat:"completar",choices:["derecha","ducha","cuchara","almohada"]},
  {kind:"blank",es:"Me ducho en la ___ y me seco con la toalla.",en:"ducha",tts:"Me ducho en la ducha y me seco con la toalla.",cat:"completar",choices:["ducha","cama","olla","esquina"]},
  {kind:"blank",es:"Hay mucho ___ y los carros no avanzan por la avenida.",en:"trancón",tts:"Hay mucho trancón y los carros no avanzan por la avenida.",cat:"completar",choices:["trancón","tinto","clóset","jabón"]},
  {kind:"blank",es:"Corto la cebolla con el ___ para picarla.",en:"cuchillo",tts:"Corto la cebolla con el cuchillo para picarla.",cat:"completar",choices:["cuchillo","sofá","semáforo","reloj"]},
  {kind:"blank",es:"Me siento en el ___ de la sala para ver la película.",en:"sofá",tts:"Me siento en el sofá de la sala para ver la película.",cat:"completar",choices:["sofá","lavamanos","parqueadero","azúcar"]},
  {kind:"blank",es:"No tengo suficiente ___ para pagar el taxi.",en:"plata",tts:"No tengo suficiente plata para pagar el taxi.",cat:"completar",choices:["plata","vaina","cobija","sartén"]},
  {kind:"blank",es:"La ___ está sobre la cama y me abriga.",en:"cobija",tts:"La cobija está sobre la cama y me abriga.",cat:"completar",choices:["cobija","gasolina","luz","sal"]},
];

/* Focus tags keep grammar practice separate from the broader topic filters. */
FILL_BLANK_QUIZ.forEach((q,i)=>{
  if(i<6)q.focus="present";
  else if(i<10)q.focus="future";
  else if(i<14)q.focus="past";
});
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"pronombres",es:"El número es masculino: ¿Tienes el número? Sí, ___ tengo aquí.",en:"lo",tts:"El número es masculino: ¿Tienes el número? Sí, lo tengo aquí.",cat:"pronombres",choices:["lo","la","le","los"],trans:"The number is masculine: Do you have the number? Yes, I have it here."},
  {kind:"blank",focus:"pronombres",es:"La dirección es femenina: ¿Tienes la dirección? Sí, ___ tengo aquí.",en:"la",tts:"La dirección es femenina: ¿Tienes la dirección? Sí, la tengo aquí.",cat:"pronombres",choices:["la","lo","le","las"],trans:"The address is feminine: Do you have the address? Yes, I have it here."},
  {kind:"blank",focus:"pronombres",es:"A Juan, ___ doy el libro.",en:"le",tts:"A Juan, le doy el libro.",cat:"pronombres",choices:["le","lo","la","les"],trans:"To Juan, I give him the book."}
);

/* ── Approved vocabulary blanks ─────────────────────────────────────────────
   These are authored prompts, not blanks generated from every example.
   Each one has a tight context and fixed distractors so the learner is not
   penalized when more than one answer would be natural. */
export const APPROVED_VOCAB_BLANKS=[
  /* Cuerpo */
  {kind:"blank",cat:"cuerpo",es:"Tengo dolor de ___ después de trabajar.",en:"cabeza",tts:"Tengo dolor de cabeza después de trabajar.",trans:"I have a headache after working.",choices:["cabeza","cargador","sal","puerta"]},
  {kind:"blank",cat:"cuerpo",es:"Mi ___ derecho está rojo.",en:"ojo",tts:"Mi ojo derecho está rojo.",trans:"My right eye is red.",choices:["ojo","silla","azúcar","motor"]},
  {kind:"blank",cat:"cuerpo",es:"Tengo la ___ tapada.",en:"nariz",tts:"Tengo la nariz tapada.",trans:"My nose is blocked.",choices:["nariz","plato","archivo","sartén"]},
  {kind:"blank",cat:"cuerpo",es:"Me lavo la ___ después de comer.",en:"boca",tts:"Me lavo la boca después de comer.",trans:"I wash my mouth after eating.",choices:["boca","ventana","proyecto","gasolina"]},
  {kind:"blank",cat:"cuerpo",es:"Llevo la mochila en el ___.",en:"hombro",tts:"Llevo la mochila en el hombro.",trans:"I carry the backpack on my shoulder.",choices:["hombro","cuchara","contraseña","parqueadero"]},
  {kind:"blank",cat:"cuerpo",es:"Me golpeé el ___ con la puerta.",en:"brazo",tts:"Me golpeé el brazo con la puerta.",trans:"I hit my arm on the door.",choices:["brazo","lámpara","documento","tinto"]},
  {kind:"blank",cat:"cuerpo",es:"Me corté el ___ al cocinar.",en:"dedo",tts:"Me corté el dedo al cocinar.",trans:"I cut my finger while cooking.",choices:["dedo","baúl","reunión","jabón"]},
  {kind:"blank",cat:"cuerpo",es:"El ___ late rápido cuando corro.",en:"corazón",tts:"El corazón late rápido cuando corro.",trans:"My heart beats fast when I run.",choices:["corazón","escritorio","semáforo","arepa"]},
  {kind:"blank",cat:"cuerpo",es:"Tengo el ___ lleno después de almorzar.",en:"estómago",tts:"Tengo el estómago lleno después de almorzar.",trans:"My stomach is full after lunch.",choices:["estómago","impresora","llanta","sábana"]},
  {kind:"blank",cat:"cuerpo",es:"Me duele la ___ por estar sentado.",en:"espalda",tts:"Me duele la espalda por estar sentado.",trans:"My back hurts from sitting.",choices:["espalda","pantalla","sartén","negocio"]},

  /* Casa, habitación y baño */
  {kind:"blank",cat:"casa",es:"Me ducho en la ___ antes de trabajar.",en:"ducha",tts:"Me ducho en la ducha antes de trabajar.",trans:"I shower before going to work.",choices:["ducha","silla","archivo","gasolina"]},
  {kind:"blank",cat:"casa",es:"Lavo mis manos en el ___.",en:"lavamanos",tts:"Lavo mis manos en el lavamanos.",trans:"I wash my hands in the sink.",choices:["lavamanos","motor","reunión","azúcar"]},
  {kind:"blank",cat:"casa",es:"Me seco con la ___ después de bañarme.",en:"toalla",tts:"Me seco con la toalla después de bañarme.",trans:"I dry myself with the towel after bathing.",choices:["toalla","semáforo","proyecto","cuchara"]},
  {kind:"blank",cat:"casa",es:"Uso el ___ para lavarme los dientes.",en:"cepillo de dientes",tts:"Uso el cepillo de dientes para lavarme los dientes.",trans:"I use the toothbrush to brush my teeth.",choices:["cepillo de dientes","volante","sueldo","película"]},
  {kind:"blank",cat:"casa",es:"La ropa está en el ___.",en:"clóset",tts:"La ropa está en el clóset.",trans:"The clothes are in the closet.",choices:["clóset","hospital","cargador","sartén"]},
  {kind:"blank",cat:"casa",es:"Enciendo la ___ cuando oscurece.",en:"luz",tts:"Enciendo la luz cuando oscurece.",trans:"I turn on the light when it gets dark.",choices:["luz","llanta","archivo","arepa"]},
  {kind:"blank",cat:"casa",es:"La ___ está sobre la cama y me abriga.",en:"cobija",tts:"La cobija está sobre la cama y me abriga.",trans:"The blanket is on the bed and keeps me warm.",choices:["cobija","impresora","gasolina","cuchillo"]},
  {kind:"blank",cat:"habitacion",es:"La ___ está junto a la cama y tiene una lámpara.",en:"mesita de noche",tts:"La mesita de noche está junto a la cama y tiene una lámpara.",trans:"The nightstand is next to the bed and has a lamp.",choices:["mesita de noche","farmacia","batería","sal"]},
  {kind:"blank",cat:"habitacion",es:"La ___ está encendida junto a la cama.",en:"lámpara",tts:"La lámpara está encendida junto a la cama.",trans:"The lamp is on next to the bed.",choices:["lámpara","parqueadero","documento","jugo"]},
  {kind:"blank",cat:"habitacion",es:"Me miro en el ___ antes de salir.",en:"espejo",tts:"Me miro en el espejo antes de salir.",trans:"I look at myself in the mirror before leaving.",choices:["espejo","trancón","horario","azúcar"]},
  {kind:"blank",cat:"bano",es:"Necesito ___ para lavarme los dientes.",en:"pasta dental",tts:"Necesito pasta dental para lavarme los dientes.",trans:"I need toothpaste to brush my teeth.",choices:["pasta dental","carro","reunión","cobija"]},
  {kind:"blank",cat:"bano",es:"El ___ está en el baño y se acaba rápido.",en:"papel higiénico",tts:"El papel higiénico está en el baño y se acaba rápido.",trans:"The toilet paper is in the bathroom and runs out quickly.",choices:["papel higiénico","volante","proyecto","café"]},
  {kind:"blank",cat:"bano",es:"Necesito ___ para lavarme el pelo.",en:"champú",tts:"Necesito champú para lavarme el pelo.",trans:"I need shampoo to wash my hair.",choices:["champú","llanta","archivo","pan"]},
  {kind:"blank",cat:"bano",es:"El ___ está limpio y tiene la tapa cerrada.",en:"inodoro",tts:"El inodoro está limpio y tiene la tapa cerrada.",trans:"The toilet is clean and the lid is closed.",choices:["inodoro","escritorio","gasolina","jugo"]},

  /* Cocina */
  {kind:"blank",cat:"cocina",es:"Voy a ___ las verduras para la sopa.",en:"cortar",tts:"Voy a cortar las verduras para la sopa.",trans:"I am going to cut the vegetables for the soup.",choices:["cortar","dormir","volante","sueldo"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ la salsa en un tazón.",en:"mezclar",tts:"Voy a mezclar la salsa en un tazón.",trans:"I am going to mix the sauce in a bowl.",choices:["mezclar","trabajar","llanta","contraseña"]},
  {kind:"blank",cat:"cocina",es:"Quiero ___ la sopa antes de servirla.",en:"probar",tts:"Quiero probar la sopa antes de servirla.",trans:"I want to taste the soup before serving it.",choices:["probar","cobija","semáforo","archivo"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ el agua para el café.",en:"hervir",tts:"Voy a hervir el agua para el café.",trans:"I am going to boil the water for the coffee.",choices:["hervir","conducir","espejo","silla"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ un huevo para el desayuno.",en:"freír",tts:"Voy a freír un huevo para el desayuno.",trans:"I am going to fry an egg for breakfast.",choices:["freír","leer","motor","ventana"]},
  {kind:"blank",cat:"cocina",es:"La ___ sirve para cocinar la sopa.",en:"olla",tts:"La olla sirve para cocinar la sopa.",trans:"The pot is used to cook soup.",choices:["olla","pantalla","reunión","gasolina"]},
  {kind:"blank",cat:"cocina",es:"La ___ sirve para freír un huevo.",en:"sartén",tts:"La sartén sirve para freír un huevo.",trans:"The frying pan is used to fry an egg.",choices:["sartén","puerta","documento","parqueadero"]},
  {kind:"blank",cat:"cocina",es:"Uso la ___ para comer sopa.",en:"cuchara",tts:"Uso la cuchara para comer sopa.",trans:"I use the spoon to eat soup.",choices:["cuchara","llanta","contraseña","hotel"]},
  {kind:"blank",cat:"cocina",es:"Pongo la comida en el ___.",en:"plato",tts:"Pongo la comida en el plato.",trans:"I put the food on the plate.",choices:["plato","motor","horario","cargador"]},
  {kind:"blank",cat:"cocina",es:"No le pongas mucha ___ a la sopa.",en:"sal",tts:"No le pongas mucha sal a la sopa.",trans:"Do not add too much salt to the soup.",choices:["sal","silla","archivo","aeropuerto"]},
  {kind:"blank",cat:"cocina",es:"Necesito ___ para el café.",en:"azúcar",tts:"Necesito azúcar para el café.",trans:"I need sugar for the coffee.",choices:["azúcar","freno","proyecto","ventana"]},
  {kind:"blank",cat:"cocina",es:"Voy a ___ los platos después de comer.",en:"lavar",tts:"Voy a lavar los platos después de comer.",trans:"I am going to wash the dishes after eating.",choices:["lavar","correr","volante","sueldo"]},

  /* Direcciones y carro */
  {kind:"blank",cat:"direcciones",es:"El ___ está en rojo y debemos parar.",en:"semáforo",tts:"El semáforo está en rojo y debemos parar.",trans:"The traffic light is red and we have to stop.",choices:["semáforo","almohada","reunión","café"]},
  {kind:"blank",cat:"direcciones",es:"Hay un ___ y los carros no avanzan.",en:"trancón",tts:"Hay un trancón y los carros no avanzan.",trans:"There is a traffic jam and the cars are not moving.",choices:["trancón","pasta dental","archivo","sábana"]},
  {kind:"blank",cat:"direcciones",es:"El ___ está cerca; allí dejo el carro.",en:"parqueadero",tts:"El parqueadero está cerca; allí dejo el carro.",trans:"The parking lot is nearby; I leave the car there.",choices:["parqueadero","cuchara","proyecto","jabón"]},
  {kind:"blank",cat:"direcciones",es:"Necesito ___ para llenar el tanque.",en:"gasolina",tts:"Necesito gasolina para llenar el tanque.",trans:"I need gas to fill the tank.",choices:["gasolina","lámpara","reunión","plato"]},
  {kind:"blank",cat:"carropartes",es:"La ___ está baja y debo inflarla.",en:"llanta",tts:"La llanta está baja y debo inflarla.",trans:"The tire is low and I need to inflate it.",choices:["llanta","pantalla","sueldo","cobija"]},
  {kind:"blank",cat:"carropartes",es:"El ___ sirve para controlar la dirección del carro.",en:"volante",tts:"El volante sirve para controlar la dirección del carro.",trans:"The steering wheel is used to control the car's direction.",choices:["volante","toalla","archivo","azúcar"]},
  {kind:"blank",cat:"carropartes",es:"El ___ suena cuando freno.",en:"freno",tts:"El freno suena cuando freno.",trans:"The brake makes a noise when I brake.",choices:["freno","cuchara","contraseña","mesita de noche"]},
  {kind:"blank",cat:"carropartes",es:"El equipaje está en el ___.",en:"baúl",tts:"El equipaje está en el baúl.",trans:"The luggage is in the trunk.",choices:["baúl","hospital","reunión","sal"]},
  {kind:"blank",cat:"carropartes",es:"Abro el ___ para revisar el motor.",en:"capó",tts:"Abro el capó para revisar el motor.",trans:"I open the hood to check the engine.",choices:["capó","cama","proyecto","jugo"]},
  {kind:"blank",cat:"carropartes",es:"Miro el ___ para ver los carros detrás.",en:"espejo retrovisor",tts:"Miro el espejo retrovisor para ver los carros detrás.",trans:"I look at the rearview mirror to see the cars behind me.",choices:["espejo retrovisor","cargador","sartén","entrevista"]},
  {kind:"blank",cat:"direcciones",es:"El ___ tiene cuatro ruedas y dos puertas.",en:"carro",tts:"El carro tiene cuatro ruedas y dos puertas.",trans:"The car has four wheels and two doors.",choices:["carro","cobija","documento","sal"]},

  /* Tecnología, oficina y trabajo */
  {kind:"blank",cat:"tecnologia",es:"Mi ___ no tiene batería; necesito cargarlo.",en:"celular",tts:"Mi celular no tiene batería; necesito cargarlo.",trans:"My cell phone has no battery; I need to charge it.",choices:["celular","cuchillo","reunión","sábana"]},
  {kind:"blank",cat:"tecnologia",es:"Necesito el ___ para cargar el celular.",en:"cargador",tts:"Necesito el cargador para cargar el celular.",trans:"I need the charger to charge the cell phone.",choices:["cargador","parqueadero","sal","proyecto"]},
  {kind:"blank",cat:"tecnologia",es:"El ___ está encendido y tiene teclado.",en:"computador",tts:"El computador está encendido y tiene teclado.",trans:"The computer is on and has a keyboard.",choices:["computador","toalla","trancón","café"]},
  {kind:"blank",cat:"tecnologia",es:"Descargué una ___ para estudiar español.",en:"aplicación",tts:"Descargué una aplicación para estudiar español.",trans:"I downloaded an app to study Spanish.",choices:["aplicación","llanta","cuchara","entrevista"]},
  {kind:"blank",cat:"tecnologia",es:"Te mando un ___ por WhatsApp.",en:"mensaje",tts:"Te mando un mensaje por WhatsApp.",trans:"I am sending you a message on WhatsApp.",choices:["mensaje","motor","cobija","sartén"]},
  {kind:"blank",cat:"tecnologia",es:"Tomé una ___ de la pantalla.",en:"foto",tts:"Tomé una foto de la pantalla.",trans:"I took a photo of the screen.",choices:["foto","freno","reunión","ducha"]},
  {kind:"blank",cat:"tecnologia",es:"No recuerdo la ___.",en:"contraseña",tts:"No recuerdo la contraseña.",trans:"I do not remember the password.",choices:["contraseña","llanta","plato","sueldo"]},
  {kind:"blank",cat:"tecnologia",es:"La ___ del celular está baja.",en:"batería",tts:"La batería del celular está baja.",trans:"The cell phone battery is low.",choices:["batería","cuchara","parqueadero","entrevista"]},
  {kind:"blank",cat:"oficina",es:"La ___ no funciona; no puedo imprimir.",en:"impresora",tts:"La impresora no funciona; no puedo imprimir.",trans:"The printer does not work; I cannot print.",choices:["impresora","cobija","gasolina","arepa"]},
  {kind:"blank",cat:"oficina",es:"Necesito el ___ para leer las instrucciones.",en:"documento",tts:"Necesito el documento para leer las instrucciones.",trans:"I need the document to read the instructions.",choices:["documento","llanta","sartén","tarde"]},
  {kind:"blank",cat:"oficina",es:"Guarda el ___ en la carpeta.",en:"archivo",tts:"Guarda el archivo en la carpeta.",trans:"Save the file in the folder.",choices:["archivo","toalla","trancón","azúcar"]},
  {kind:"blank",cat:"oficina",es:"Te mando un ___ con la información.",en:"correo electrónico",tts:"Te mando un correo electrónico con la información.",trans:"I am sending you an email with the information.",choices:["correo electrónico","cuchillo","cama","gasolina"]},
  {kind:"blank",cat:"oficina",es:"Mi ___ está junto a la ventana; trabajo allí.",en:"escritorio",tts:"Mi escritorio está junto a la ventana; trabajo allí.",trans:"My desk is next to the window; I work there.",choices:["escritorio","semáforo","sal","cobija"]},
  {kind:"blank",cat:"trabajo",es:"Tengo una ___ a las diez con mi jefe.",en:"reunión",tts:"Tengo una reunión a las diez con mi jefe.",trans:"I have a meeting with my boss at ten.",choices:["reunión","llanta","ducha","pan"]},
  {kind:"blank",cat:"trabajo",es:"El ___ empieza hoy y termina el viernes.",en:"proyecto",tts:"El proyecto empieza hoy y termina el viernes.",trans:"The project starts today and ends on Friday.",choices:["proyecto","cuchara","baúl","champú"]},
  {kind:"blank",cat:"trabajo",es:"Mi ___ cambia la próxima semana.",en:"horario",tts:"Mi horario cambia la próxima semana.",trans:"My schedule changes next week.",choices:["horario","espejo","trancón","arepa"]},
  {kind:"blank",cat:"trabajo",es:"Recibo mi ___ el viernes.",en:"sueldo",tts:"Recibo mi sueldo el viernes.",trans:"I receive my salary on Friday.",choices:["sueldo","lavamanos","motor","cobija"]},
  {kind:"blank",cat:"trabajo",es:"Tengo una ___ para el puesto mañana.",en:"entrevista",tts:"Tengo una entrevista para el puesto mañana.",trans:"I have an interview for the position tomorrow.",choices:["entrevista","plato","llanta","jabón"]},
  {kind:"blank",cat:"trabajo",es:"Mi ___ está en el centro; vendo comida allí.",en:"negocio",tts:"Mi negocio está en el centro; vendo comida allí.",trans:"My business is downtown; I sell food there.",choices:["negocio","toalla","freno","cuchara"]},

  /* Acciones, comida, clima y descanso */
  {kind:"blank",cat:"acciones",es:"Voy a ___ la mesa antes de cenar.",en:"poner",tts:"Voy a poner la mesa antes de cenar.",trans:"I am going to set the table before dinner.",choices:["poner","llanta","sueldo","cobija"]},
  {kind:"blank",cat:"acciones",es:"Puedes ___ la mochila aquí.",en:"dejar",tts:"Puedes dejar la mochila aquí.",trans:"You can leave the backpack here.",choices:["dejar","semáforo","contraseña","sartén"]},
  {kind:"blank",cat:"acciones",es:"Voy a ___ la basura esta noche.",en:"sacar",tts:"Voy a sacar la basura esta noche.",trans:"I am going to take out the trash tonight.",choices:["sacar","cuchara","reunión","motor"]},
  {kind:"blank",cat:"acciones",es:"Voy a ___ después del trabajo.",en:"volver",tts:"Voy a volver después del trabajo.",trans:"I am going to return after work.",choices:["volver","toalla","archivo","sal"]},
  {kind:"blank",cat:"comida",es:"Quiero ___ fría, por favor.",en:"agua",tts:"Quiero agua fría, por favor.",trans:"I want cold water, please.",choices:["agua","llanta","documento","lámpara"]},
  {kind:"blank",cat:"comida",es:"Tomo ___ en la mañana.",en:"café",tts:"Tomo café en la mañana.",trans:"I drink coffee in the morning.",choices:["café","parqueadero","cobija","freno"]},
  {kind:"blank",cat:"comida",es:"¿Me regala un ___?",en:"tinto",tts:"¿Me regala un tinto?",trans:"Can I have a black coffee?",choices:["tinto","escritorio","llanta","pasta dental"]},
  {kind:"blank",cat:"comida",es:"El ___ está maduro y lo pongo en la ensalada.",en:"aguacate",tts:"El aguacate está maduro y lo pongo en la ensalada.",trans:"The avocado is ripe and I put it in the salad.",choices:["aguacate","volante","reunión","toalla"]},
  {kind:"blank",cat:"comida",es:"Me gusta la ___ con queso.",en:"arepa",tts:"Me gusta la arepa con queso.",trans:"I like arepa with cheese.",choices:["arepa","cargador","archivo","llanta"]},
  {kind:"blank",cat:"comida",es:"Como ___ con huevo.",en:"pan",tts:"Como pan con huevo.",trans:"I eat bread with egg.",choices:["pan","semáforo","proyecto","lámpara"]},
  {kind:"blank",cat:"clima",es:"Cayó un ___ muy fuerte en la tarde.",en:"aguacero",tts:"Cayó un aguacero muy fuerte en la tarde.",trans:"A very heavy downpour fell in the afternoon.",choices:["aguacero","escritorio","sueldo","cuchara"]},
  {kind:"blank",cat:"clima",es:"Hoy ___ en Bogotá; ponte una chaqueta.",en:"hace frío",tts:"Hoy hace frío en Bogotá; ponte una chaqueta.",trans:"It is cold in Bogotá today; put on a jacket.",choices:["hace frío","cortar","llanta","archivo"]},
  {kind:"blank",cat:"clima",es:"Está ___; necesitamos paraguas.",en:"lloviendo",tts:"Está lloviendo; necesitamos paraguas.",trans:"It is raining; we need umbrellas.",choices:["lloviendo","sueldo","cuchara","motor"]},
  {kind:"blank",cat:"tv",es:"¿Dónde está el ___?",en:"control remoto",tts:"¿Dónde está el control remoto?",trans:"Where is the remote control?",choices:["control remoto","llanta","reunión","sal"]},
  {kind:"blank",cat:"tv",es:"Estoy sentado en el ___ viendo una película.",en:"sofá",tts:"Estoy sentado en el sofá viendo una película.",trans:"I am sitting on the sofa watching a movie.",choices:["sofá","freno","archivo","azúcar"]},
  {kind:"blank",cat:"tv",es:"Necesito ___ después de trabajar.",en:"descansar",tts:"Necesito descansar después de trabajar.",trans:"I need to rest after working.",choices:["descansar","cuchara","contraseña","parqueadero"]}
];
export const CONVERSATION_FRAME_BLANKS=[
  {kind:"blank",focus:"past",cat:"frases",es:"Ayer ___ al mercado.",en:"fui",tts:"Ayer fui al mercado.",trans:"Yesterday I went to the market.",choices:["fui","comí","dormí","hablé"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Cuando me llamaste, yo ___ en la oficina.",en:"estaba",tts:"Cuando me llamaste, yo estaba en la oficina.",trans:"When you called me, I was at the office.",choices:["estaba","fui","quería","tuve"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Antes ___ estudiante en Bogotá.",en:"era",tts:"Antes era estudiante en Bogotá.",trans:"Before, I was a student in Bogotá.",choices:["era","comí","dormí","hice"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Yo ___ a salir, pero empezó a llover.",en:"iba",tts:"Yo iba a salir, pero empezó a llover.",trans:"I was going to go out, but it started to rain.",choices:["iba","tuve","estaba","quería"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Ayer ___ que trabajar hasta tarde.",en:"tuve",tts:"Ayer tuve que trabajar hasta tarde.",trans:"Yesterday I had to work late.",choices:["tuve","fui","era","podía"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Yo ___ descansar, pero tenía una reunión.",en:"quería",tts:"Yo quería descansar, pero tenía una reunión.",trans:"I wanted to rest, but I had a meeting.",choices:["quería","fui","estuve","tuve"]},
  {kind:"blank",focus:"past",cat:"frases",es:"___ ayuda para terminar el proyecto.",en:"necesitaba",tts:"Necesitaba ayuda para terminar el proyecto.",trans:"I needed help to finish the project.",choices:["necesitaba","estaba","fui","pude"]},
  {kind:"blank",focus:"past",cat:"frases",es:"No ___ ir porque estaba enfermo.",en:"podía",tts:"No podía ir porque estaba enfermo.",trans:"I couldn't go because I was sick.",choices:["podía","era","tuve","fui"]}
];
export const PRONOUN_FRAME_BLANKS=[
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Tienes el documento? Sí, ___ tengo aquí.",en:"lo",tts:"¿Tienes el documento? Sí, lo tengo aquí.",trans:"Do you have the document? Yes, I have it here.",choices:["lo","la","le","las"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Tienes la llave? Sí, ___ tengo aquí.",en:"la",tts:"¿Tienes la llave? Sí, la tengo aquí.",trans:"Do you have the key? Yes, I have it here.",choices:["la","lo","le","los"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"Le expliqué el problema: ___ expliqué despacio.",en:"se lo",tts:"Le expliqué el problema: se lo expliqué despacio.",trans:"I explained the problem to him/her: I explained it slowly.",choices:["se lo","se la","lo le","la se"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"Le mandé la ubicación: ___ mandé por mensaje.",en:"se la",tts:"Le mandé la ubicación: se la mandé por mensaje.",trans:"I sent him/her the location: I sent it by message.",choices:["se la","se lo","la le","lo se"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ llegar a casa.",en:"Acabo de",tts:"Acabo de llegar a casa.",trans:"I just arrived home.",choices:["Acabo de","Tengo que","Voy a","Se me"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ terminar el proyecto hoy.",en:"Tengo que",tts:"Tengo que terminar el proyecto hoy.",trans:"I have to finish the project today.",choices:["Tengo que","Acabo de","Se me","Lo"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ olvidó la dirección.",en:"Se me",tts:"Se me olvidó la dirección.",trans:"I forgot the address.",choices:["Se me","Tengo que","Acabo de","La"]},
  {kind:"blank",focus:"present",cat:"frases",es:"___ mando en un momento.",en:"Se lo",tts:"Se lo mando en un momento.",trans:"I will send it to him/her in a moment.",choices:["Se lo","Lo se","La le","Me la"]}
];
FILL_BLANK_QUIZ.push(...CONVERSATION_FRAME_BLANKS);
FILL_BLANK_QUIZ.push(...PRONOUN_FRAME_BLANKS);
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"perfecto",cat:"frases",es:"Esta semana ___ tres veces.",en:"he practicado",tts:"Esta semana he practicado tres veces.",trans:"This week I have practiced three times.",choices:["he practicado","practiqué","practicaba","practicaré"]},
  {kind:"blank",focus:"perfecto",cat:"frases",es:"¿___ la arepa?",en:"Has probado",tts:"¿Has probado la arepa?",trans:"Have you tried arepa?",choices:["Has probado","Probaste","Habías probado","Probarás"]},
  {kind:"blank",focus:"condicional",cat:"frases",es:"Me ___ pedir una mesa.",en:"gustaría",tts:"Me gustaría pedir una mesa.",trans:"I would like to order a table.",choices:["gustaría","gusta","gustó","gustará"]},
  {kind:"blank",focus:"condicional",cat:"frases",es:"¿___ repetir, por favor?",en:"Podría",tts:"¿Podría repetir, por favor?",trans:"Could you repeat, please?",choices:["Podría","Puedo","Pude","Podré"]},
  {kind:"blank",focus:"pasado-perfecto",cat:"frases",es:"Cuando llegué, ya ___ la tienda.",en:"habían cerrado",tts:"Cuando llegué, ya habían cerrado la tienda.",trans:"When I arrived, they had already closed the store.",choices:["habían cerrado","cerraron","cerraban","han cerrado"]},
  {kind:"blank",focus:"pasado-perfecto",cat:"frases",es:"Ya ___ cuando me llamaste.",en:"había comido",tts:"Ya había comido cuando me llamaste.",trans:"I had already eaten when you called me.",choices:["había comido","comí","comía","he comido"]},
  {kind:"blank",focus:"futuro-perfecto",cat:"frases",es:"Para las ocho, ___ terminado.",en:"habré",tts:"Para las ocho, habré terminado.",trans:"By eight, I will have finished.",choices:["habré","había","he","habría"]},
  {kind:"blank",focus:"futuro-perfecto",cat:"frases",es:"En un año, ___ mucho.",en:"habré aprendido",tts:"En un año, habré aprendido mucho.",trans:"In a year, I will have learned a lot.",choices:["habré aprendido","había aprendido","he aprendido","aprenderé"]}
);
FILL_BLANK_QUIZ.push(...APPROVED_VOCAB_BLANKS);
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"past",cat:"frases",es:"Cuando era niño, ___ en Cali.",en:"vivía",tts:"Cuando era niño, vivía en Cali.",trans:"When I was a child, I used to live in Cali.",choices:["vivía","viví","vivo","voy"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Ayer ___ al mercado.",en:"fui",tts:"Ayer fui al mercado.",trans:"Yesterday I went to the market.",choices:["fui","iba","voy","era"]},
  {kind:"blank",focus:"past",cat:"frases",es:"Mientras ___, me llamaste.",en:"cocinaba",tts:"Mientras cocinaba, me llamaste.",trans:"While I was cooking, you called me.",choices:["cocinaba","cociné","cocino","cocinaré"]},
  {kind:"blank",focus:"subjuntivo",cat:"subjuntivo",es:"Quiero que ___ mañana.",en:"vengas",tts:"Quiero que vengas mañana.",trans:"I want you to come tomorrow.",choices:["vengas","vienes","venir","viniste"]},
  {kind:"blank",focus:"subjuntivo",cat:"subjuntivo",es:"Espero que ___ bien.",en:"estés",tts:"Espero que estés bien.",trans:"I hope you are well.",choices:["estés","estás","estar","estuviste"]},
  {kind:"blank",focus:"subjuntivo",cat:"subjuntivo",es:"Es importante que ___ despacio.",en:"hables",tts:"Es importante que hables despacio.",trans:"It is important that you speak slowly.",choices:["hables","hablas","hablar","hablaste"]}
);
FILL_BLANK_QUIZ.push(
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Tienes la dirección? Sí, ___ tengo aquí.",en:"la",tts:"¿Tienes la dirección? Sí, la tengo aquí.",trans:"Do you have the address? Yes, I have it here.",choices:["la","lo","le","las"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Le mandaste la ubicación? Sí, ___ mandé ayer.",en:"se la",tts:"¿Le mandaste la ubicación? Sí, se la mandé ayer.",trans:"Did you send him/her the location? Yes, I sent it to him/her yesterday.",choices:["se la","se lo","la le","lo se"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Qué haces con el documento? ___ voy a enviar ahora.",en:"Se lo",tts:"¿Qué haces con el documento? Se lo voy a enviar ahora.",trans:"What are you doing with the document? I am going to send it to him/her now.",choices:["Se lo","Se la","Lo le","La se"]},
  {kind:"blank",focus:"pronombres",cat:"pronombres",es:"¿Le explicaste la ruta? Sí, ___ expliqué despacio.",en:"se la",tts:"¿Le explicaste la ruta? Sí, se la expliqué despacio.",trans:"Did you explain the route to him/her? Yes, I explained it to him/her slowly.",choices:["se la","se lo","la le","lo se"]}
);

/* v60 content is kept in data.js so the quiz remains data-driven and easy to
   extend without changing the quiz engine. */
if(typeof V60_CONVERSATION_QUIZ!=="undefined")CONVERSATION_QUIZ.push(...V60_CONVERSATION_QUIZ);
if(typeof V60_FILL_BLANK_QUIZ!=="undefined")FILL_BLANK_QUIZ.push(...V60_FILL_BLANK_QUIZ);

export let aQ=[];
VC.forEach(cat=>{
  if(cat.type==="basic")cat.items.forEach(i=>{
    const quizPrompt=cat.id==="colores"&&i.word==="Café"?"El color café":cat.id==="comida"&&i.word==="Café"?"Una bebida: café":undefined;
    aQ.push({es:i.word,en:i.en,tts:i.tts,cat:cat.id,quizPrompt});
  });
  if(cat.type==="vocales")VOCALES_DATA.forEach(v=>v.examples.forEach(ex=>aQ.push({es:ex.word,en:ex.en,tts:ex.tts,cat:"vocales"})));
  if(cat.type==="numeros"){[...N130,...NT].forEach(n=>aQ.push({es:n.w,en:String(n.n),tts:n.w,cat:"numeros"}));}
  if(cat.type==="preguntas")PQ.forEach(p=>aQ.push({es:p.word,en:p.en,tts:p.tts,cat:"preguntas"}));
  if(cat.type==="verbos")Object.entries(VERBS).forEach(([k,v])=>aQ.push({es:k,en:v.en,tts:k,cat:"verbos"}));
  if(cat.type==="colombianismos")COLOMBIANISMOS.forEach(c=>aQ.push({es:c.word,en:c.en,tts:c.tts,cat:"colombianismos"}));
});
SPECIAL_SOUNDS.forEach(sound=>sound.examples.forEach(ex=>aQ.push({es:ex.word,en:ex.en,tts:ex.tts,cat:"pronunciacion"})));
SPEAKING_GUIDE.forEach(guide=>guide.examples.forEach(ex=>aQ.push({es:ex.es,en:ex.en,tts:ex.tts,cat:"estructura",focus:guide.id==="pasado"||guide.id==="pasado-contraste"?"past":guide.id==="futuro"?"future":guide.id==="pronombres"?"pronombres":guide.id==="subjuntivo"?"subjuntivo":"present"})));
FRASES.filter(sec=>sec.section).forEach(sec=>{if(sec.items){const isPron=/Pronombres/i.test(sec.section);const isBad=/Groserías/i.test(sec.section);const quizCat=sec.quizCat||(isPron?"pronombres":isBad?"groserias":"frases");sec.items.forEach(i=>aQ.push({es:i.es,en:i.en,tts:i.es,cat:quizCat,focus:isPron?"pronombres":undefined}));}});
CONVERSATION_QUIZ.forEach(q=>aQ.push(q));
FILL_BLANK_QUIZ.forEach(q=>aQ.push(q));
export const BLANK_EN={
  "Yo vivo en Bogotá.":"I live in Bogotá.","¿Dónde vives tú?":"Where do you live?","Ella come arepa todos los días.":"She eats arepa every day.","Nosotros hablamos español.":"We speak Spanish.","Yo tengo dos hermanos.":"I have two siblings.","¿Usted habla inglés?":"Do you speak English?",
  "Mañana yo voy a trabajar.":"Tomorrow I am going to work.","¿Qué vas a comer tú?":"What are you going to eat?","Nosotros vamos a cocinar arepas.":"We are going to cook arepas.","Ella va a ver una película.":"She is going to watch a movie.",
  "Ayer yo fui al mercado.":"Yesterday I went to the market.","¿Qué comiste tú anoche?":"What did you eat last night?","Él trabajó hasta las seis.":"He worked until six.","Anoche yo dormí ocho horas.":"Last night I slept eight hours.",
  "¿Me regala un tinto para tomar, por favor?":"Can I have a black coffee to drink, please?","Gire a la derecha en la esquina.":"Turn right at the corner.","Me ducho en la ducha y me seco con la toalla.":"I shower in the shower and dry myself with the towel.","Hay mucho trancón y los carros no avanzan por la avenida.":"There is a lot of traffic and the cars are not moving on the avenue.","Corto la cebolla con el cuchillo para picarla.":"I cut the onion with the knife to chop it.","Me siento en el sofá de la sala para ver la película.":"I sit on the living-room sofa to watch the movie.","No tengo suficiente plata para pagar el taxi.":"I don't have enough money to pay for the taxi.","La cobija está sobre la cama y me abriga.":"The blanket is on the bed and keeps me warm."
};
export function spanishAnswer(q){
  if(appState.qMode==="en-es")return q.es;
  if(q.kind==="reply"||q.kind==="tense"||q.kind==="pronoun")return q.en;
  if(q.kind==="blank")return q.tts;
  return q.es||q.tts;
}
export function englishAnswer(q){
  if(q.kind==="blank")return q.trans||BLANK_EN[q.tts]||"";
  const lines=[...(typeof DIALOGUE!=="undefined"?DIALOGUE:[]),...CONVERSATIONS.flatMap(c=>c.lines||[])];
  const found=lines.find(line=>line.es===q.en||line.es===q.tts||line.es===q.es);
  return found?found.en:(q.en||"");
}
