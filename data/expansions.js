import { COLOMBIANISMOS } from "./vocab.js";
import {
  FRASES, CONVERSATIONS, v60Dialogue,
  LESSON_CONTENT, LESSON_META, SENTENCE_LADDERS, SLOT_SWAP_MATRICES,
  CONVERSATION_MISSIONS, READINGS, V60_CONVERSATION_QUIZ, V60_FILL_BLANK_QUIZ,
} from "./content.js";

export const CONNECTOR_BRIDGE_DRILLS=[
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
export const REGISTER_SWITCHER=[
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
export const STREET_GRID_DECODER=[
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
export const CONVERSATION_CURVEBALLS=[
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

export const VERBOS_COMODIN = [
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

export const TEXTBOOK_VS_COLOMBIAN = [
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

export const REGIONAL_ATLAS = [
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

export const BRANCHING_ROLEPLAYS = [
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

export const STREET_EAR_LINKER = [
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

export const TRAMPAS_COLOMBIANAS = [
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

export const REGIONAL_SWITCHER = [
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

