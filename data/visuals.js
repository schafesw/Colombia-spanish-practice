import { BRANCHING_ROLEPLAYS, REGIONAL_SWITCHER } from "./expansions.js";

// ── V98.0 GE API VISUAL GUIDES, ILLUSTRATED REGIONS & EXTRA NT-HEAVY ROLEPLAYS / SWITCHER ──
export const REGION_IMAGES = {
  "sanjuan-guajira": "assets/region-sanjuan.webp",
  "bogota": "assets/region-bogota.webp",
  "medellin": "assets/region-medellin.webp",
  "costa": "assets/region-costa.webp",
  "cali": "assets/region-cali.webp"
};

export const ROLEPLAY_IMAGES = {
  "rp-tienda-napa": "assets/scene-tienda.webp",
  "rp-sanjuan-familia": "assets/scene-terraza.webp",
  "rp-sanjuan-parranda": "assets/guide-sanjuan.webp",
  "rp-corrientazo": "assets/scene-restaurante.webp",
  "rp-taxi": "assets/scene-bogota-noche.webp",
  "rp-uber": "assets/scene-uber.webp",
  "rp-panaderia": "assets/scene-panaderia.webp",
  "rp-drogueria": "assets/scene-farmacia.webp",
  "rp-cita": "assets/region-cali.webp",
  "chat-panaderia": "assets/scene-panaderia.webp",
  "chat-taxi": "assets/scene-taxi.webp",
  "chat-drogueria": "assets/scene-drogueria.webp",
  "chat-uber": "assets/scene-uber.webp",
  "chat-tienda": "assets/scene-tienda.webp",
  "chat-sanjuan": "assets/scene-terraza.webp",
  "chat-aeropuerto": "assets/scene-aeropuerto.webp",
  "chat-farmacia": "assets/scene-farmacia.webp",
  "chat-porteria": "assets/scene-porteria.webp",
  "chat-pagos": "assets/guide-pagos.webp",
  "chat-corrientazo": "assets/scene-restaurante.webp"
};

export const VISUAL_GUIDES = [
  {
    id: "vg-grid",
    title: "🧭 Calle vs. Carrera (City Grid)",
    sub: "How Colombian street numbers like Cra 7 # 72-41 actually work",
    img: "assets/guide-grid.webp",
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
    img: "assets/guide-corrientazo.webp",
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
    img: "assets/guide-trampas.webp",
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
    img: "assets/guide-sanjuan.webp",
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
    img: "assets/guide-panaderia.webp",
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
    img: "assets/guide-conectores.webp",
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
    img: "assets/guide-pagos.webp",
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
    img: "assets/guide-comodines.webp",
    alt: "Colombian wildcard verbs poster explaining Quedar, Regalar, Provocar, and Dar papaya",
    caption: "Four essentials you hear every single day: quedar (location, agreeing on plans '¿así quedamos?', fit), regalar (polite ordering '¿me regala…?'), provocar (craving '¿qué te provoca?'), and no dar papaya (don't leave valuables exposed).",
    es: "¿Te provoca un tinto? Así quedamos entonces: nos vemos allá y sin dar papaya.",
    en: "Feel like a coffee? It's a plan then: see you there and stay alert.",
    region: "Español Diario"
  },
  {
    id: "vg-comida",
    title: "🥐 Comida Callejera (Café & Street Bites)",
    sub: "Tinto · Arepa · Empanada · Jugo de Lulo",
    img: "assets/guide-comida.webp",
    alt: "Colombian street food and cafe poster featuring Tinto, Arepa, Empanada, and Jugo de Lulo",
    caption: "Four Colombian counter classics you can point to or order anywhere: tinto (black coffee), arepa con queso (grilled white corn cake), empanada con ají (crispy corn pastry with mild herb salsa), and jugo de lulo en agua (tangy emerald citrus juice).",
    es: "Veci, ¿me regala una empanada con ají y un jugo de lulo en agua?",
    en: "Neighbor, could I have an empanada with ají and a lulo juice in water?",
    region: "Todo Colombia"
  },
  {
    id: "vg-modismos",
    title: "⚡ Frases Cortas (Instant Native Reactions)",
    sub: "¡De una! · ¡Con gusto! · ¡Qué pena! · ¡Hágale!",
    img: "assets/guide-modismos.webp",
    alt: "Colombian short reaction phrases poster featuring ¡De una!, ¡Con gusto!, ¡Qué pena!, and ¡Hágale!",
    caption: "Colombians answer fast with 2-word reflexes: '¡De una!' (I'm in / right away), '¡Con gusto!' (you're welcome), '¡Qué pena!' (excuse me / sorry), and '¡Hágale!' (go ahead / do it).",
    es: "¿Nos vemos a las cuatro? — ¡De una, hágale pues!",
    en: "Meet at four? — You got it, let's do it!",
    region: "Conversación Rápida"
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

