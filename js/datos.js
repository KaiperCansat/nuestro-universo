// ─────────────────────────────────────────────────────────────
//  TODO LO QUE SE PUEDE EDITAR DE LA WEB ESTÁ AQUÍ.
//  · Para añadir una foto: súbela a la carpeta /fotos y añade
//    una línea en FOTOS con { src, fecha, texto }.
//  · Las fechas van siempre en formato "AAAA-MM-DD".
//  · quien: "marti" (☀ el sol) o "mati" (☾ la luna).
// ─────────────────────────────────────────────────────────────

export const PAREJA = {
  ella: "Martina",
  el: "Matías",
  // El día que empezamos a hablar (por un llavero).
  conocimos: "2026-03-27",
  // El día que nos hicimos novios. El 11 de cada mes es nuestro día.
  novios: "2026-05-11",
  // "Ama de mi sol" — Milo J. Cámbiala por el enlace que quieras.
  cancion: {
    titulo: "Ama de mi sol",
    artista: "Milo J",
    enlace: "https://open.spotify.com/search/ama%20de%20mi%20sol%20milo%20j",
  },
};

// Los números salen del chat (27 mar – 14 nov 2026).
export const NUMEROS = [
  { cifra: "290.081", texto: "mensajes" },
  { cifra: "14.404", texto: "te amo" },
  { cifra: "229", texto: "días hablando" },
];

// Puntos de la constelación del corazón (en orden).
export const ESTRELLAS = [
  { fecha: "2026-03-27", texto: "un llavero" },
  { fecha: "2026-05-11", texto: "somos novios" },
  { fecha: "2026-06-11", texto: "un mes" },
  { fecha: "2026-08-11", texto: "tres meses" },
];

// La historia.
//  frame: "centro" (grande, con texto) o "lado" (pequeña, con una nota).
//  En vez de foto se puede poner `arte`: "eclipse" (con `sep`, la distancia
//  entre el sol y la luna), o un dibujo: flores, cartas, corazon, chat, llamada,
//  sushi, disco, unas, escenario, avion, birrete, pluma, camiseta, sol,
//  estrellas, feria, bus, halloween, lista, piano.
export const HISTORIA = [
  {
    fecha: "2026-03-27", frame: "centro", arte: "eclipse", sep: 3.4,
    alt: "El sol y la luna, todavía muy lejos el uno del otro",
    titulo: "Un llavero.",
    texto: "Esa misma noche me escribiste: «y aun así, sabiendo que todo esto empezó por un llavero… un gusto conocerte, soy Martina».",
  },
  {
    fecha: "2026-03-28", frame: "lado", lado: "derecha", arte: "chat",
    alt: "Dos bocadillos de chat que dicen holii",
    nota: "«hablar contigo es mejor que ver unos globos desinflándose»",
  },
  {
    fecha: "2026-04-07", frame: "centro", arte: "eclipse", sep: 2.9,
    alt: "El sol y la luna acercándose un poco",
    titulo: "Te acompaño a casa.",
    texto: "La primera vez que te acompañé a casa: «te espero nomás porque tú lo pides». Al día siguiente, un abrazo en el cole y medio instituto mirándonos «como si no hubieran visto ningún abrazo más».",
  },
  {
    fecha: "2026-04-10", frame: "lado", lado: "izquierda", arte: "llamada",
    alt: "Un móvil con un corazón y ondas de llamada",
    nota: "«mira que no suelo hacer llamadas. Eres la excepción»",
  },
  {
    fecha: "2026-04-17", frame: "centro", arte: "sushi",
    alt: "Tres piezas de sushi hechas con galletas Oreo",
    titulo: "Sushi de Oreo.",
    texto: "Planeamos nuestro picnic y te ofreciste a cocinarlo todo: «haré hasta un sushi de oreo». Al día siguiente te dije que eras «más abrazable».",
  },
  {
    fecha: "2026-04-19", frame: "lado", lado: "derecha", arte: "disco",
    alt: "Un CD pintado a mano: mitad roja con las letras MA en blanco y mitad oscura con una telaraña",
    nota: "un CD pintado a mano: «para ti»",
  },
  {
    fecha: "2026-04-29", frame: "centro", arte: "unas",
    alt: "Cinco uñas pintadas: amarilla con estrellas, blanca con una espiral azul, blanca con una estrella azul de cuatro puntas, amarilla con una ola naranja y una azul marino",
    titulo: "Mis uñas, tu diseño.",
    texto: "Te pedí que diseñaras mis uñas y que al menos dos tuvieran algo tuyo. Tardaste una hora. A la mañana siguiente: «LO DISFRUTÉ. HARÍA MILES».",
  },
  {
    fecha: "2026-05-01", frame: "lado", lado: "izquierda", arte: "corazon",
    alt: "Un corazón hecho de estrellas",
    nota: "el primer «te amo», y esa noche, Ama de mi sol",
  },
  {
    fecha: "2026-05-08", frame: "centro", arte: "flores",
    alt: "Cinco flores: rosa, blanca, amarilla, roja y blanca",
    titulo: "Una flor cada día.",
    texto: "El lunes una rosa, pero llovió. El martes una blanca, y no me atreví. El miércoles la amarilla. El jueves una roja, y me diste un beso. El viernes otra, y seguí sin decírtelo.",
  },
  {
    fecha: "2026-05-11", frame: "lado", lado: "derecha", foto: "fotos/2026-05-11-somos-novios.jpg",
    alt: "Captura del chat: MATÍAS, SOMOS NOVIOS, 11 de mayo de 2026",
    nota: "«eres el primero»",
  },
  {
    fecha: "2026-05-16", frame: "centro", arte: "eclipse", sep: 1.7,
    alt: "El sol y la luna cada vez más cerca",
    titulo: "La mejor de todas.",
    texto: "Nuestra primera cita, nuestros primeros besos. Esa noche solo te pude escribir eso: «la mejor de todas».",
  },
  {
    fecha: "2026-05-25", frame: "lado", lado: "izquierda", arte: "cartas",
    alt: "Una baraja de cartas con corazones",
    nota: "52 cartas, 52 fotos tuyas",
  },
  {
    fecha: "2026-05-29", frame: "centro", arte: "escenario",
    alt: "Un escenario con telón rojo y una estrella",
    titulo: "Desde el escenario.",
    texto: "El festival del cole. Estabas ahí arriba, y luego me escribiste: «cuando te vi me ayudaste a sonreír».",
  },
  {
    fecha: "2026-06-11", frame: "lado", lado: "derecha", foto: "fotos/2026-08-20-carta-feliz-mes.jpg", posicion: "center 40%",
    alt: "Tarjeta escrita a mano: ¡Feliz mes!",
    nota: "nuestro primer 11",
  },
  {
    fecha: "2026-06-11", frame: "centro", arte: "eclipse", sep: 1.25,
    alt: "El sol y la luna empezando a tocarse",
    titulo: "Una parte de mí.",
    texto: "Una carta, una sudadera y un «te estoy dando una parte de mí, quédatela». Desde ese día, el 11 de cada mes es nuestro.",
  },
  {
    fecha: "2026-06-14", frame: "lado", lado: "izquierda", arte: "avion",
    alt: "Un avión de Tona a Italia y un reloj que marca las 05:00",
    nota: "tú en Italia, yo despierto hasta las 5 am",
  },
  {
    fecha: "2026-06-18", frame: "centro", arte: "birrete",
    alt: "Un birrete de graduación con borla dorada",
    titulo: "Tu graduación.",
    texto: "Te graduaste siendo mi novia, y yo lloré en tu graduación. «Lo mejor de la graduación, aparte de verte…».",
  },
  {
    fecha: "2026-06-21", frame: "lado", lado: "derecha", arte: "pluma",
    alt: "Una pluma y una medalla de primer puesto",
    nota: "tu premio de prosa: «yo ya sabía que ganarías»",
  },
  {
    fecha: "2026-06-22", frame: "centro", arte: "camiseta",
    alt: "Una camiseta blanca pintada a mano con una M grande hecha de besos rojos y besos sueltos alrededor",
    titulo: "Pintada a mano.",
    texto: "Mi regalo de cumpleaños: una camiseta que pintaste con pintura de tela. «Acabé. Pensé que me iba a morir».",
  },
  {
    fecha: "2026-06-28", frame: "lado", lado: "izquierda", foto: "fotos/2026-08-04-tarjeta-sol-luna.jpg", posicion: "center 30%",
    alt: "Tarjeta dibujada a mano con un sol y una luna",
    nota: "«somos literalmente la luna y el sol»",
  },
  {
    fecha: "2026-07-11", frame: "centro", arte: "sol",
    alt: "Un sol muy fuerte y un camino hasta Tona",
    titulo: "Bajo el sol hasta Tona.",
    texto: "Fui caminando hasta Tona con un sol horrible para darte tu regalo. Mi madre dijo que era mucho amor para aguantar ese sol. Tú me diste una photocard: «quiero que puedas llevarme».",
  },
  {
    fecha: "2026-07-12", frame: "lado", lado: "derecha", arte: "estrellas",
    alt: "Una constelación de estrellas",
    nota: "«te buscaría en todas mis vidas»",
  },
  {
    fecha: "2026-07-30", frame: "centro", foto: "fotos/2026-07-30-matias-conejo.jpg",
    alt: "Matías con Florentina, el conejo de lana que tejió",
    titulo: "Florentina.",
    texto: "Un día entero tejiendo un conejo de lana para ti. Le buscamos nombre juntos y se quedó con el más original: Florentina.",
  },
  {
    fecha: "2026-08-03", frame: "lado", lado: "izquierda", foto: "fotos/2026-08-03-playa-atardecer.jpg", posicion: "center 35%",
    alt: "Los dos en la playa al atardecer",
    nota: "nuestro atardecer",
  },
  {
    fecha: "2026-08-04", frame: "centro", arte: "feria",
    alt: "Una noria de feria",
    titulo: "La feria de Tona.",
    texto: "Una noche de feria juntos, con atracción incluida. Y al día siguiente, más peluches hechos a mano para ti.",
  },
  {
    fecha: "2026-08-06", frame: "lado", lado: "derecha", foto: "fotos/m-2026-08-05-195839.jpg",
    alt: "Una tarjeta hecha a mano con una estrella",
    nota: "«lo que más valoro es la confianza»",
  },
  {
    fecha: "2026-08-11", frame: "centro", foto: "fotos/2026-08-20-carta-11-08.jpg", posicion: "center 35%",
    alt: "Carta escrita a mano con la fecha 11/08/26",
    titulo: "Tres meses.",
    texto: "Una carta con la fecha en un recuadro, 11/08/26, y «Felices 3 meses». Y al día siguiente, el cielo se puso de acuerdo con nosotros.",
  },
  {
    fecha: "2026-08-12", frame: "lado", lado: "izquierda", arte: "eclipse", sep: 0.35,
    alt: "Un eclipse casi total",
    nota: "el eclipse de verdad",
  },
  {
    fecha: "2026-08-20", frame: "centro", foto: "fotos/2026-08-20-dibujo-familia.jpg", posicion: "center 45%",
    alt: "Dibujo a boli de los dos con tres niños: Kai, Elio y Sienna",
    titulo: "Escribir un futuro juntos.",
    texto: "Mi plan era arrodillarme y preguntarte: «Marti, tú estás escribiendo un libro, ¿verdad?… ¿Y si mejor escribimos un futuro juntos?». Tú ya habías dibujado a Kai, Elio y Sienna.",
  },
  {
    fecha: "2026-08-21", frame: "lado", lado: "derecha", foto: "fotos/2026-08-21-mejillas.jpg",
    alt: "Los dos mejilla con mejilla",
    nota: "mejilla con mejilla",
  },
  {
    fecha: "2026-08-24", frame: "centro", arte: "eclipse", sep: 0,
    alt: "El eclipse perfecto",
    titulo: "Eclipse.",
    texto: "«Y aunque transitaban por el mismo cielo, no lo consiguieron. Hasta que una tarde, ellos coincidieron, formando así, el eclipse perfecto.» — el poema que te escribí. Ese mismo día ya tenías también tu canción, y te dije que eras «la mejor novia del mundo».",
  },
  {
    fecha: "2026-09-09", frame: "centro", arte: "eclipse", sep: 1.05,
    alt: "El sol saliendo detrás de la luna",
    titulo: "A las 7 de la mañana.",
    texto: "Aparecí a las 7 de la mañana solo para estar contigo antes de clase. Ese día quedó dicho: el 11 de cada mes, siempre especial.",
  },
  {
    fecha: "2026-09-12", frame: "lado", lado: "derecha", foto: "fotos/m-2026-09-12-144736.jpg", posicion: "center 30%",
    alt: "Martina",
    nota: "«eres como mi lugar seguro, mi hogar»",
  },
  {
    fecha: "2026-10-02", frame: "centro", arte: "bus",
    alt: "Un autobús camino de Vic",
    titulo: "«No dejaré a Martina sola».",
    texto: "Me estaba haciendo la comida y lo pensé así. La dejé a medias, salí y cogí el bus hasta Vic para verte en la EART.",
  },
  {
    fecha: "2026-10-24", frame: "lado", lado: "izquierda", arte: "corazon",
    alt: "Un corazón hecho de estrellas",
    nota: "«no sabes cuánta ilusión me hacía cuando te veía por la calle»",
  },
  {
    fecha: "2026-10-30", frame: "centro", arte: "halloween",
    alt: "Una luna, murciélagos y una calabaza",
    titulo: "Halloween.",
    texto: "«¿Me maquillas?», te pregunté. Y me maquillaste para Halloween.",
  },
  {
    fecha: "2026-11-01", frame: "lado", lado: "derecha", arte: "lista",
    alt: "Una hoja: 10 cosas que odio sobre ti",
    nota: "«odio que tantas canciones me recuerden a ti»",
  },
];

// Las frases bonitas, tal cual las escribimos en el chat.
export const FRASES = [
  { quien: "mati", fecha: "2026-03-31", texto: "Que fuerte que nos empezamos a hablar por un llavero." },
  { quien: "marti", fecha: "2026-04-02", texto: "Me das más ganas de amarme." },
  { quien: "marti", fecha: "2026-04-20", texto: "¿Cansada? Actualmente no. Porque llegaste tú." },
  { quien: "marti", fecha: "2026-05-02", texto: "Gracias por tus abrazos. Gracias por estar a mi lado. Gracias por soportarme. Gracias por ser tú." },
  { quien: "mati", fecha: "2026-05-02", texto: "Tú me volviste mejor persona. Por fin me sentí escuchado, por fin me sentí querido. Me brindaste luz en la oscuridad." },
  { quien: "marti", fecha: "2026-05-02", texto: "Y yo te brindo luz en la oscuridad, pero ¿sabes qué es lo mejor? Que sin ti, yo no puedo brillar.", grande: true },
  { quien: "marti", fecha: "2026-05-03", texto: "Siempre voy a recordar más un momento vivido que un dato. Aunque contigo me acuerdo de todo." },
  { quien: "marti", fecha: "2026-05-04", texto: "Tú también eres mi primer amor. Vas antes que Stray Kids. Y nunca pensé que diría eso." },
  { quien: "mati", fecha: "2026-05-05", texto: "¿Viernes? Ahí estaré. ¿Sábado? Ahí estaré. ¿Un martes a las 3 am? Ahí estaré. Porque te amo." },
  { quien: "mati", fecha: "2026-05-06", texto: "Me da igual si tengo que caminar todo el desierto del Sahara si al final puedo estar contigo.", grande: true },
  { quien: "marti", fecha: "2026-05-06", texto: "Nunca dejes de sonreír, porfa. Tu sonrisa es la más bella." },
  { quien: "marti", fecha: "2026-05-09", texto: "Eres como el sol para las flores. Eres como las estrellas en un cielo de noche." },
  { quien: "marti", fecha: "2026-05-09", texto: "Yo soy el astronauta y tu mirada representa ser el espacio. Yo trato de buscarlo todo en tu mirada, como si fueran los planetas que busca un astronauta.", grande: true },
  { quien: "mati", fecha: "2026-05-09", texto: "Yo estaba en la oscuridad hasta que apareciste tú, mi sol, y me iluminaste. Eres la ama de mi sol." },
  { quien: "mati", fecha: "2026-05-13", texto: "Yo tampoco me arrepiento de nada. De las rosas, de los abrazos, de las citas." },
  { quien: "marti", fecha: "2026-05-13", texto: "No sé qué haría sin ti. Me alegro de ser tu novia. No me arrepiento." },
  { quien: "mati", fecha: "2026-05-23", texto: "No hay cartas suficientes para decir todo lo que amo de ti." },
  { quien: "marti", fecha: "2026-05-23", texto: "No te amo solo por lo que me haces. Te amo porque te molestas en dedicarme tiempo. Te amo porque tú sí sabes valorar." },
  { quien: "marti", fecha: "2026-05-25", texto: "Eres lo mejor que me ha pasado." },
  { quien: "mati", fecha: "2026-06-01", texto: "Un día una chica me preguntó por un llavero de Star Wars y, en un abrir y cerrar de ojos, somos novios." },
  { quien: "marti", fecha: "2026-06-04", texto: "Mis ojos solo buscan tu mirada. Mi voz grita tu nombre mentalmente. Y mi corazón solo busca estar cerca de ti." },
  { quien: "mati", fecha: "2026-06-06", texto: "Tu manera de amar es muy única, y valoro demasiado eso. Hay muchas, muchas más de 52 razones por las que te amo." },
  { quien: "marti", fecha: "2026-06-07", texto: "Contigo no me da miedo pasar el resto de mi vida. Contigo la idea de crecer no me da tanto miedo." },
  { quien: "mati", fecha: "2026-06-11", texto: "Te estoy dando una parte de mí. Quédatela." },
  { quien: "marti", fecha: "2026-06-14", texto: "Eres el amor de mi vida." },
  { quien: "marti", fecha: "2026-06-20", texto: "Tu olor = hogar.", grande: true },
  { quien: "marti", fecha: "2026-06-28", texto: "Piel clara y piel más oscura, ojos más claros y ojos más oscuros. Por eso somos literalmente la luna y el sol." },
  { quien: "marti", fecha: "2026-06-29", texto: "No verte no me hará no quererte. Si de verdad nos amamos, la distancia es lo de menos." },
  { quien: "mati", fecha: "2026-07-01", texto: "Cuando te digo «mi vida» no es de manera cursi o irónica. Eres literalmente mi vida." },
  { quien: "marti", fecha: "2026-07-01", texto: "Hasta los momentos de separación me dan ilusión, porque siento que seremos muy lindos. Por eso te digo que eres lo que andaba buscando." },
  { quien: "marti", fecha: "2026-07-02", texto: "Me haces la chica más feliz de este universo. No entiendo cómo pude encontrarte." },
  { quien: "mati", fecha: "2026-07-02", texto: "Tú me haces el chico más feliz de la galaxia entera." },
  { quien: "marti", fecha: "2026-07-12", texto: "Te buscaría en todas mis vidas, sea el año que sea.", grande: true },
  { quien: "mati", fecha: "2026-07-28", texto: "Contigo me volví a sentir como el que alguna vez fui. Me sentí como ese que reía con cualquier cosa." },
  { quien: "marti", fecha: "2026-07-28", texto: "Gracias por escucharme. Sabes hacer algo que muchas personas ya no saben." },
  { quien: "mati", fecha: "2026-08-08", texto: "Me gusta decirte cosas bonitas, pero ninguna de todas esas palabras basta para decir cómo me haces sentir." },
  { quien: "mati", fecha: "2026-08-17", texto: "Estar contigo es como un sueño. Un sueño del que no quiero despertar." },
  { quien: "marti", fecha: "2026-08-21", texto: "Siempre odiaré no habernos conocido antes, para poder pasar más tiempo juntos." },
  { quien: "mati", fecha: "2026-08-22", texto: "El futuro no está escrito. Y si ya lo está, le pondré típex y lo reescribo para estar contigo.", grande: true },
  { quien: "mati", fecha: "2026-08-24", texto: "Por ser tú misma conmigo. Por elegirme. Yo ya estaba vivo, pero contigo empecé a vivir." },
  { quien: "mati", fecha: "2026-08-28", texto: "Enamorarme de ti ha sido la cosa más fácil que he hecho en mi vida. Te amé el día que te conocí, te amo hoy y te amaré el resto de mi vida.", grande: true },
  { quien: "mati", fecha: "2026-09-09", texto: "En mi ordenador tengo como 20 fotos tuyas de fondo de pantalla. Siempre estás en mi cabeza. Nunca te olvidaría." },
  { quien: "mati", fecha: "2026-09-12", texto: "Eres como mi lugar seguro, mi hogar." },
  { quien: "mati", fecha: "2026-10-27", texto: "Aunque esté haciendo cualquier cosa, siempre acabo pensando en ti. Siempre te llevo conmigo aunque no estemos juntitos." },
  { quien: "marti", fecha: "2026-10-29", texto: "T'estimo. Molt molt." },
  { quien: "marti", fecha: "2026-10-31", texto: "Te amo mucho, Matías. Nunca lo olvides." },
];

// Las fotos del muro, por orden. texto = lo que se escribe a mano debajo.
export const FOTOS = [
  { src: "fotos/2026-07-30-conejo.jpg", fecha: "2026-07-30", texto: "Florentina, naciendo" },
  { src: "fotos/2026-07-30-matias-conejo.jpg", fecha: "2026-07-30", texto: "Florentina y yo" },
  { src: "fotos/m-2026-07-30-173347.jpg", fecha: "2026-07-30", texto: "✌︎" },
  { src: "fotos/m-2026-07-30-194402.jpg", fecha: "2026-07-30", texto: "M" },
  { src: "fotos/m-2026-07-30-195006.jpg", fecha: "2026-07-30", texto: "" },
  { src: "fotos/m-2026-08-02-200458.jpg", fecha: "2026-08-02", texto: "esa cara" },
  { src: "fotos/2026-08-03-playa-atardecer.jpg", fecha: "2026-08-03", texto: "nuestro atardecer" },
  { src: "fotos/2026-08-03-matias-playa.jpg", fecha: "2026-08-03", texto: "✌︎" },
  { src: "fotos/2026-08-04-tarjeta-sol-luna.jpg", fecha: "2026-08-04", texto: "el sol y la luna" },
  { src: "fotos/m-2026-08-05-183821.jpg", fecha: "2026-08-05", texto: "crêpe" },
  { src: "fotos/2026-08-05-conejo-lazo.jpg", fecha: "2026-08-05", texto: "Florentina, con lazo rojo" },
  { src: "fotos/m-2026-08-05-195839.jpg", fecha: "2026-08-05", texto: "hecho a mano" },
  { src: "fotos/2026-08-08-espejo.jpg", fecha: "2026-08-08", texto: "en blanco y negro" },
  { src: "fotos/m-2026-08-08-022327.jpg", fecha: "2026-08-08", texto: "" },
  { src: "fotos/2026-08-08-tarjeta-te-amo.jpg", fecha: "2026-08-08", texto: "te amo (versión Woodstock)" },
  { src: "fotos/m-2026-08-11-180717.jpg", fecha: "2026-08-11", texto: "trencitas" },
  { src: "fotos/m-2026-08-11-182008.jpg", fecha: "2026-08-11", texto: ":P" },
  { src: "fotos/2026-08-11-marti.jpg", fecha: "2026-08-11", texto: "tres meses" },
  { src: "fotos/m-2026-08-11-201835.jpg", fecha: "2026-08-11", texto: "" },
  { src: "fotos/m-2026-08-11-201851.jpg", fecha: "2026-08-11", texto: "golden hour" },
  { src: "fotos/2026-08-11-donostia.jpg", fecha: "2026-08-11", texto: "atardecer en Donostia" },
  { src: "fotos/m-2026-08-11-214038.jpg", fecha: "2026-08-11", texto: "" },
  { src: "fotos/2026-08-11-marti-atardecer-2.jpg", fecha: "2026-08-11", texto: "mi sol, literal" },
  { src: "fotos/m-2026-08-11-215527.jpg", fecha: "2026-08-11", texto: "" },
  { src: "fotos/2026-08-12-eclipse.jpg", fecha: "2026-08-12", texto: "el día del eclipse" },
  { src: "fotos/2026-08-15-fuegos.jpg", fecha: "2026-08-15", texto: "fuegos artificiales" },
  { src: "fotos/m-2026-08-15-134717.jpg", fecha: "2026-08-15", texto: "el mar" },
  { src: "fotos/2026-08-16-recuerdo.jpg", fecha: "2026-08-16", texto: "«recuerdo esta foto»" },
  { src: "fotos/m-2026-08-19-215832.jpg", fecha: "2026-08-19", texto: "" },
  { src: "fotos/2026-08-20-carta-feliz-mes.jpg", fecha: "2026-08-20", texto: "¡feliz mes!" },
  { src: "fotos/2026-08-20-carta-11-08.jpg", fecha: "2026-08-20", texto: "la carta del 11/08" },
  { src: "fotos/2026-08-20-the-astronaut.jpg", fecha: "2026-08-20", texto: "The Astronaut" },
  { src: "fotos/2026-08-20-dibujo-familia.jpg", fecha: "2026-08-20", texto: "Kai, Elio y Sienna" },
  { src: "fotos/2026-08-20-unas.jpg", fecha: "2026-08-20", texto: "uñas pintadas" },
  { src: "fotos/2026-08-20-matias-espejo.jpg", fecha: "2026-08-20", texto: "yo, con el iPad" },
  { src: "fotos/m-2026-08-20-140213.jpg", fecha: "2026-08-20", texto: "M de…" },
  { src: "fotos/m-2026-08-20-155450.jpg", fecha: "2026-08-20", texto: "" },
  { src: "fotos/m-2026-08-20-155508.jpg", fecha: "2026-08-20", texto: "" },
  { src: "fotos/m-2026-08-20-171932.jpg", fecha: "2026-08-20", texto: "yo" },
  { src: "fotos/2026-08-20-marti-collar-m.jpg", fecha: "2026-08-20", texto: "" },
  { src: "fotos/2026-08-20-sobre.jpg", fecha: "2026-08-20", texto: "un sobre con cerezas" },
  { src: "fotos/2026-08-20-noche.jpg", fecha: "2026-08-20", texto: "otra vez nosotros" },
  { src: "fotos/2026-08-21-crochet.jpg", fecha: "2026-08-21", texto: "un poyoyoi de crochet" },
  { src: "fotos/2026-08-21-mejillas.jpg", fecha: "2026-08-21", texto: "mejilla con mejilla" },
  { src: "fotos/2026-08-21-oscuridad.jpg", fecha: "2026-08-21", texto: "aunque sea de noche" },
  { src: "fotos/2026-08-21-beso.jpg", fecha: "2026-08-21", texto: "" },
  { src: "fotos/2026-08-24-marti-bosque.jpg", fecha: "2026-08-24", texto: "entre pinos" },
  { src: "fotos/m-2026-08-24-222413.jpg", fecha: "2026-08-24", texto: "" },
  { src: "fotos/2026-08-29-playlist.jpg", fecha: "2026-08-29", texto: "TE AMO MARTINA ♡" },
  { src: "fotos/m-2026-09-12-144736.jpg", fecha: "2026-09-12", texto: "" },
  { src: "fotos/m-2026-09-12-165806.jpg", fecha: "2026-09-12", texto: "" },
  { src: "fotos/m-2026-09-12-170107.jpg", fecha: "2026-09-12", texto: "" },
  { src: "fotos/m-2026-09-12-170443.jpg", fecha: "2026-09-12", texto: "" },
  { src: "fotos/m-2026-09-12-225518.jpg", fecha: "2026-09-12", texto: "" },
];

// Las canciones. La playlist que te hice (se reproduce dentro de la web) y las que nos dedicamos.
// spotify: el código de la canción si la mandamos por el chat (sale un reproductor);
// si no, el botón abre la búsqueda en Spotify.
// top: 1, 2 o 3 → nuestro top 3: sale primero, en dorado y con su número.
export const PLAYLIST = {
  id: "68Np9D2lzz1Y60mLzL7ICD",
  titulo: "💗 TE AMO MARTINA 💗",
  fecha: "2026-05-14",
  nota: "«Amor, para qué dedicarte una canción, cuando puedo dedicarte una playlist.» Canciones que nos gustan y otras que dicen lo que siento por ti.",
};

export const CANCIONES = [
  { fecha: "2026-04-21", de: "marti", titulo: "Don't Say You Love Me", artista: "Jin", cita: "Te dedico Don't Say You Love Me, pues." },
  { fecha: "2026-04-28", de: "marti", titulo: "The Astronaut", artista: "Jin", top: 3, cita: "Nunca pensé que lo diría… te dedico The Astronaut. Valora que te la haya dedicado." },
  { fecha: "2026-05-01", de: "mati", titulo: "Ama de mi sol", artista: "Milo J", top: 1, cita: "Te dedico Ama de mi sol." },
  { fecha: "2026-05-16", de: "mati", titulo: "Can't Take My Eyes Off You", artista: "Gloria Gaynor", cita: "Te la dedico. —¡No! Esa es mía, te la tendría que dedicar yo a ti: mi padre me la ponía desde los 4 años." },
  { fecha: "2026-05-18", de: "marti", titulo: "Nobody New", artista: "The Marías", cita: "Bueno, coroné por dedicarte Nobody New." },
  { fecha: "2026-05-25", de: "marti", titulo: "Blue", artista: "Yung Kai", cita: "Habla del mar. Mar y amor. Esa sería nuestra canción." },
  { fecha: "2026-07-03", de: "mati", titulo: "Made In Japan", artista: "Buck Owens", top: 2, spotify: "3vpLBt35y9gLu2Xv59PXLg", cita: "Te quiero dedicar Made In Japan, pero es una canción que significa tanto… quiero dedicártela en un momento especial." },
  { fecha: "2026-10-23", de: "mati", titulo: "Dos oruguitas", artista: "Sebastián Yatra", cita: "Te dedico una canción: Dos oruguitas." },
  { fecha: "2026-10-23", de: "marti", titulo: "Cinderella", artista: "", cita: "Te dedico Cinderella, que es mi temazo favorito." },
  { fecha: "2026-10-24", de: "mati", titulo: "Love Is Orange", artista: "", cita: "Oye, por cierto, te dedico Love Is Orange." },
  { fecha: "2026-10-26", de: "mati", titulo: "My Kind of Woman", artista: "Mac DeMarco", spotify: "38tfi9dtBQQ5Wyt7EL0G3z", cita: "Te la dedico." },
  { fecha: "2026-10-29", de: "marti", titulo: "Still", artista: "", cita: "Te dedico Still." },
  { fecha: "2026-10-31", de: "marti", titulo: "Funny Little Fears", artista: "Damiano David", cita: "Pues yo te dedico un álbum entero, como Damiano le hizo un álbum entero al amor de su vida." },
];

// Las tres polaroids del principio (portada).
export const PORTADA = [
  { src: "fotos/2026-08-03-playa-atardecer.jpg", fecha: "2026-08-03", texto: "nuestro atardecer" },
  { src: "fotos/2026-08-21-mejillas.jpg", fecha: "2026-08-21", texto: "mi sol" },
  { src: "fotos/2026-08-20-noche.jpg", fecha: "2026-08-20", texto: "tu luna" },
];

// Las reseñas. Las primeras son de Martina, tal cual las escribió el día que vio la página.
// respuesta = lo que le contesté (opcional).
export const RESENAS = [];

// Dónde se guardan las reseñas que escribe la gente (Supabase, gratis).
// Mientras esté vacío, cada reseña se guarda solo en el móvil u ordenador de quien la escribe.
// Pasos en el README: «Reseñas compartidas».
export const RESENAS_GUARDADO = {
  url: "https://gxckeronpddxmaslsmsy.supabase.co",
  clave: "sb_publishable_pySEs5hhUM-wBIalPObpDg_V0xW05HQ",
};
