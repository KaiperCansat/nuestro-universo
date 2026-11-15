// ─────────────────────────────────────────────────────────────
//  NUESTRO UNIVERSO · el motor
//  Sin frameworks: un solo bucle de animación, Lenis para el
//  scroll suave y todo lo demás hecho a mano.
// ─────────────────────────────────────────────────────────────
import { PAREJA, NUMEROS, ESTRELLAS, HISTORIA, FRASES, FOTOS, PORTADA, PLAYLIST, CANCIONES, RESENAS, RESENAS_GUARDADO } from "./datos.js";
import { preparar, dibujar, lienzo, estrellas, arteSVG } from "./cielo.js";

history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COARSE = matchMedia("(hover: none) and (pointer: coarse)").matches;
// Lee un token de color resolviendo toda la cadena de var() a través de un elemento de prueba.
const css = (name) => {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${name})`;
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c;
};

/* ── fechas en español ─────────────────────────────────────── */
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const corta = (iso) => { const d = parse(iso); return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`; };
const larga = (iso) => { const d = parse(iso); return `${d.getDate()} de ${MESES_LARGOS[d.getMonth()]} de ${d.getFullYear()}`; };
const puntos = (iso) => { const [y, m, d] = iso.split("-"); return `${d}.${m}`; };
const hoy = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const diasEntre = (a, b) => Math.round((b - a) / 86400000);

/* ═════════════════════════════════════════════════════════════
   1 · EL RELOJ: un solo requestAnimationFrame para todo
   ═════════════════════════════════════════════════════════════ */
const subs = new Set();
let rafId = 0;
function subscribe(fn, every = 0) {
  const s = { fn, every, last: 0 };
  subs.add(s);
  if (!rafId) rafId = requestAnimationFrame(loop);
  return () => subs.delete(s);
}
function loop(time) {
  for (const s of [...subs]) {
    if (time - s.last > s.every) { s.last = time; s.fn(time); }
  }
  rafId = subs.size ? requestAnimationFrame(loop) : 0;
}

/* Lenis (scroll suave). Si no carga, el scroll nativo funciona igual. */
let lenis = null;
if (!REDUCED) {
  try {
    const { default: Lenis } = await import("lenis");
    lenis = new Lenis({ smoothWheel: true });
    subscribe((t) => lenis.raf(t), 0);
    lenis.stop();
  } catch (e) { lenis = null; }
}
const lockScroll = (on) => {
  if (lenis) on ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = on ? "hidden" : "";
};
lockScroll(true);

/* Vigila si un elemento está a la vista (+10 frames de margen). */
function inView(el, margin = "0px") {
  const st = { on: false, grace: 0 };
  new IntersectionObserver(([e]) => { st.on = e.isIntersecting; if (st.on) st.grace = 10; }, { rootMargin: margin }).observe(el);
  return () => { if (st.on) return true; if (st.grace > 0) { st.grace--; return true; } return false; };
}

/* ═════════════════════════════════════════════════════════════
   2 · CONSTRUIR LA PÁGINA CON LOS DATOS
   ═════════════════════════════════════════════════════════════ */
const ROT = [-7, 5, -2, 3, -4, 6, -3, 2, -5, 4];

function polaroid(f, i, { tape = false } = {}) {
  const fig = document.createElement("figure");
  fig.className = "polaroid";
  fig.style.setProperty("--r", `${ROT[i % ROT.length] * 0.6}deg`);
  if (tape) fig.insertAdjacentHTML("beforeend", `<span class="tape" aria-hidden="true"></span>`);
  const img = new Image();
  img.src = f.src;
  img.alt = f.texto ? `${f.texto}, ${larga(f.fecha)}` : `Foto del ${larga(f.fecha)}`;
  img.loading = "lazy";
  img.decoding = "async";
  img.onerror = () => fallo(f.src);
  fig.append(img);
  fig.insertAdjacentHTML("beforeend", `<figcaption><span>${f.texto || "&nbsp;"}</span><time datetime="${f.fecha}">${corta(f.fecha)}</time></figcaption>`);
  return fig;
}

/* Si una foto no carga, que se vea (en vez de un hueco mudo). */
function fallo(src) {
  let bar = $("#fallos");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "fallos";
    bar.style.cssText = "position:fixed;left:1rem;bottom:1rem;z-index:80;max-width:26rem;padding:.75rem 1rem;background:#c8102e;color:#fff;font:13px/1.3 'Courier Prime',monospace";
    bar.textContent = "No se pudo cargar: ";
    document.body.append(bar);
  }
  bar.textContent += ` ${src} ·`;
}

// Portada: tres polaroids en abanico
const fan = $("#fan");
const FAN_POSE = [{ x: -40, y: -26, r: -10 }, { x: 40, y: -34, r: 8 }, { x: 0, y: 6, r: -2 }];
PORTADA.forEach((f, i) => {
  const p = polaroid(f, i, { tape: i === 2 });
  p.style.setProperty("--r", `${FAN_POSE[i].r}deg`);
  p.dataset.x = FAN_POSE[i].x;
  p.dataset.y = FAN_POSE[i].y;
  p.querySelector("img").loading = "eager";
  fan.append(p);
});

// Canción
$("#song").href = PAREJA.cancion.enlace;
$("#songTitle").textContent = PAREJA.cancion.titulo;
$("#songArtist").textContent = PAREJA.cancion.artista;

// Contadores
const H = hoy();
const conocimos = parse(PAREJA.conocimos);
const novios = parse(PAREJA.novios);
let meses = (H.getFullYear() - novios.getFullYear()) * 12 + (H.getMonth() - novios.getMonth());
if (H.getDate() < novios.getDate()) meses--;
const COUNTS = { dias: diasEntre(conocimos, H), novios: diasEntre(novios, H), meses: Math.max(0, meses) };
$$("[data-count]").forEach((el) => { el.textContent = COUNTS[el.dataset.count]; el.dataset.split = "letters"; el.dataset.stagger = "26"; });

// El próximo 11
const dia = novios.getDate();
let next = new Date(H.getFullYear(), H.getMonth(), dia);
if (next < H) next = new Date(H.getFullYear(), H.getMonth() + 1, dia);
const falta = diasEntre(H, next);
const cumpleMeses = (next.getFullYear() - novios.getFullYear()) * 12 + (next.getMonth() - novios.getMonth());
$("#next11Label").textContent = falta === 0 ? "¡es hoy!" : `${cumpleMeses} ${cumpleMeses === 1 ? "mes" : "meses"}`;
$("#next11Days").textContent = falta === 0 ? "feliz 11, amor" : `faltan ${falta} ${falta === 1 ? "día" : "días"}`;
$("#next11Date").textContent = `${next.getDate()} ${MESES[next.getMonth()]} ${next.getFullYear()}`;
$("#next11Date").setAttribute("datetime", next.toISOString().slice(0, 10));
$("#phase").style.setProperty("--phase", `${lerp(-100, 100, clamp(falta / 30))}%`);
$("#todayLine").textContent = `hoy, ${H.getDate()} ${MESES[H.getMonth()]} ${H.getFullYear()} · día ${COUNTS.dias + 1}`;

// La placa de números
$("#plateStats").innerHTML = NUMEROS.map((n, i) =>
  `<div><dt data-split="letters" data-stagger="22" data-delay="${430 + i * 110}">${n.cifra}</dt><dd data-split="letters" data-stagger="22" data-delay="${500 + i * 110}">${n.texto}</dd></div>`).join("");

// La historia
const PLATE_OUTLINE = "M13.6168 0.497469H697.378C700.858 0.497469 704.195 1.38786 706.655 2.97277C709.115 4.55769 710.498 6.70729 710.498 8.94869V411.208C710.498 413.449 709.115 415.599 706.655 417.183C704.195 418.768 700.858 419.659 697.378 419.659H460.249C454.073 419.659 447.976 420.555 442.411 422.281C436.847 424.008 431.958 426.519 428.107 429.63L399.246 452.95C395.559 455.928 390.878 458.333 385.55 459.986C380.223 461.639 374.385 462.497 368.472 462.497H13.6168C10.1373 462.497 6.80038 461.607 4.34003 460.022C1.87968 458.437 0.497469 456.288 0.497469 454.046V8.94869C0.497469 6.70729 1.87968 4.55769 4.34003 2.97277C6.80038 1.38786 10.1373 0.497469 13.6168 0.497469Z";
const rowsEl = $("#rows");
HISTORIA.forEach((h, i) => {
  const row = document.createElement("article");
  row.className = `row row--${h.frame}${h.lado ? ` is-${h.lado}` : ""}${h.ajuste === "contener" ? " is-contain" : ""}${h.foto ? "" : " is-arte"}`;
  const par = h.frame === "centro" ? 20 : 60;
  const contenido = h.foto
    ? `<div class="plateph__slot" data-slot><img src="${h.foto}" alt="${h.alt}" loading="lazy" decoding="async" style="object-position:${h.posicion || "center 35%"}"></div>`
    : h.arte === "eclipse"
      ? `<canvas class="plateph__art" data-arte="eclipse" data-sep="${h.sep ?? 2}" role="img" aria-label="${h.alt}"></canvas>`
      : `<div class="plateph__art plateph__art--svg" role="img" aria-label="${h.alt}">${arteSVG(h.arte)}</div>`;
  row.innerHTML = `
    <div class="layer" data-par="${par}">
      <div class="plateph">
        <div class="plateph__fill">${contenido}${h.nota ? `<span class="plateph__shade" aria-hidden="true"></span>` : ""}</div>
        <svg class="plateph__outline" viewBox="0 0 710.995 462.995" preserveAspectRatio="none" aria-hidden="true"><path d="${PLATE_OUTLINE}"/></svg>
        ${h.nota ? `<p class="plateph__note">${h.nota}</p>` : ""}
      </div>
      <p class="year" data-split="letters" data-stagger="26" data-year>${puntos(h.fecha)}<span class="sr"> de ${parse(h.fecha).getFullYear()}</span></p>
    </div>
    ${h.titulo ? `<div class="layer" data-par="110"><p class="copy" data-rise="220"><b>${h.titulo}</b>${h.texto}</p></div>` : ""}`;
  const img = row.querySelector("img");
  if (img) img.onerror = () => fallo(h.foto);
  rowsEl.append(row);
});

// Las ilustraciones del sol y la luna en la historia: estáticas, se redibujan al cambiar de tamaño
$$('canvas[data-arte="eclipse"]').forEach((c, i) => {
  const st = lienzo(c);
  const sep = Number(c.dataset.sep);
  st.onSize = () => {
    const { ctx, w, h } = st;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    estrellas(ctx, w, h, 5 + i, Math.round((w * h) / 2600));
    const R = Math.min(h * 0.24, w / (sep + 2) / 2.1);
    dibujar(ctx, { sx: w / 2 + (sep * R) / 2, sy: h / 2, R, mx: -sep, my: sep > 0.5 ? -0.08 : 0.02, t: 3 + i, fondo: "oscuro", halo: 0.9, limite: Math.min(h / 2, (w - sep * R) / 2) });
  };
  st.onSize();
});

// Las frases
// Una conversación de notas de papel: ella a la izquierda (sol), yo a la derecha (luna),
// con el mes como separador. Cada nota entra entera (una sola transición, nada de palabra a palabra).
const list = $("#quoteList");
const GIRO = [-1.1, 0.7, -0.4, 1, -0.8, 0.5, -1.3, 0.9];
let mesActual = "";
FRASES.forEach((q, i) => {
  const mes = q.fecha.slice(0, 7);
  if (mes !== mesActual) {
    mesActual = mes;
    const sep = document.createElement("li");
    sep.className = "qmonth";
    sep.dataset.mes = mes;
    sep.setAttribute("aria-hidden", "true");
    sep.innerHTML = `<span>${MESES_LARGOS[Number(mes.slice(5)) - 1]} ${mes.slice(0, 4)}</span>`;
    list.append(sep);
  }
  const li = document.createElement("li");
  li.className = `quote quote--${q.quien}${q.grande ? " quote--grande" : ""}`;
  li.dataset.quien = q.quien;
  li.dataset.mes = mes;
  li.dataset.rise = "0";
  li.style.setProperty("--r", `${GIRO[i % GIRO.length]}deg`);
  const nombre = q.quien === "marti" ? PAREJA.ella : PAREJA.el;
  li.innerHTML = `
    <blockquote class="quote__text">${q.texto}</blockquote>
    <p class="quote__by"><span class="ico ico--${q.quien === "marti" ? "sun" : "moon"}" aria-hidden="true"></span><span class="who">${nombre}</span><time datetime="${q.fecha}">${corta(q.fecha)}</time></p>`;
  list.append(li);
});
const nEl = FRASES.filter((q) => q.quien === "marti").length;
$("#quoteCount").textContent = `${FRASES.length} frases · ${nEl} tuyas · ${FRASES.length - nEl} mías`;
$$(".filter").forEach((b) => b.addEventListener("click", () => {
  $$(".filter").forEach((x) => x.classList.toggle("is-on", x === b));
  const f = b.dataset.filter;
  const conFrase = new Set();
  $$(".quote").forEach((q) => {
    q.hidden = f !== "todas" && q.dataset.quien !== f;
    if (!q.hidden) { conFrase.add(q.dataset.mes); q.classList.add("is-in"); }
  });
  $$(".qmonth").forEach((m) => { m.hidden = !conFrase.has(m.dataset.mes); });
  lenis?.resize?.();
}));

// Las fotos de la historia también se abren en grande
const FOTOS_HISTORIA = HISTORIA.filter((h) => h.foto).map((h) => ({ src: h.foto, fecha: h.fecha, texto: h.titulo ? h.titulo.replace(/\.$/, "") : h.nota || "" }));
$$(".row").forEach((row, i) => {
  const h = HISTORIA[i];
  if (!h.foto) return;
  const plate = $(".plateph", row);
  const k = FOTOS_HISTORIA.findIndex((f) => f.src === h.foto);
  plate.classList.add("is-zoomable");
  plate.tabIndex = 0;
  plate.setAttribute("role", "button");
  plate.setAttribute("aria-label", `Ver en grande: ${h.alt}`);
  const abrir = () => abrirVisor(k, FOTOS_HISTORIA);
  plate.addEventListener("click", abrir);
  plate.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
});

// Las canciones
const SP_ALLOW = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
$("#playlist").innerHTML = `
  <svg class="playlist__frame" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0.5 0.5H599.5V108L588 119.5H0.5Z"/></svg>
  <div class="playlist__copy">
    <p class="playlist__eyebrow"><span class="ico ico--moon" aria-hidden="true"></span>de Matías para ti · <time datetime="${PLAYLIST.fecha}">${larga(PLAYLIST.fecha)}</time></p>
    <h3 class="playlist__title">${PLAYLIST.titulo}</h3>
    <p class="playlist__note">${PLAYLIST.nota}</p>
  </div>
  <div class="playlist__player">
    <iframe title="Playlist ${PLAYLIST.titulo} en Spotify" src="https://open.spotify.com/embed/playlist/${PLAYLIST.id}?utm_source=generator&theme=0" width="100%" height="380" frameborder="0" allow="${SP_ALLOW}" loading="lazy"></iframe>
  </div>`;
const tracks = $("#tracks");
[...CANCIONES].sort((a, b) => (a.top || 99) - (b.top || 99) || a.fecha.localeCompare(b.fecha)).forEach((c, i) => {
  const li = document.createElement("li");
  li.className = `track track--${c.de}${c.top ? " is-top" : ""}`;
  li.dataset.rise = String((i % 3) * 90);
  const de = c.de === "marti" ? `de ${PAREJA.ella}` : `de ${PAREJA.el}`;
  const busca = `https://open.spotify.com/search/${encodeURIComponent(`${c.titulo} ${c.artista}`.trim())}`;
  li.innerHTML = `
    <div class="track__disc" aria-hidden="true"><span class="track__label ico ico--${c.de === "marti" ? "sun" : "moon"}"></span></div>
    <div class="track__body">
      ${c.top ? `<p class="track__top">★ nº ${c.top} de nuestro top 3</p>` : ""}
      <p class="track__meta"><time datetime="${c.fecha}">${corta(c.fecha)}</time> · ${de}</p>
      <h3 class="track__title">${c.titulo}</h3>
      ${c.artista ? `<p class="track__artist">${c.artista}</p>` : ""}
      <blockquote class="track__quote">«${c.cita}»</blockquote>
      ${c.spotify
        ? `<button class="track__play" type="button">▶ escuchar aquí</button>`
        : `<a class="track__play" href="${busca}" target="_blank" rel="noopener">buscar en Spotify ↗</a>`}
      <div class="track__player"></div>
    </div>`;
  if (c.spotify) {
    const btn = $(".track__play", li);
    btn.addEventListener("click", () => {
      const box = $(".track__player", li);
      if (!box.firstChild) box.innerHTML = `<iframe title="${c.titulo} en Spotify" src="https://open.spotify.com/embed/track/${c.spotify}?utm_source=generator&theme=0" width="100%" height="152" frameborder="0" allow="${SP_ALLOW}" loading="lazy"></iframe>`;
      li.classList.add("is-playing");
      btn.hidden = true;
    });
  }
  tracks.append(li);
});

// Las reseñas: las de Martina (fijas) y las que deja la gente.
// Con RESENAS_GUARDADO rellenado se comparten (Supabase); si no, se quedan en el dispositivo.
const revList = $("#reviewList");
const revForm = $("#reviewForm");
const revMsg = $("#revMsg");
const REV_LOCAL = "nuestro-universo:resenas";
const revRemoto = Boolean(RESENAS_GUARDADO.url && RESENAS_GUARDADO.clave);
const todasResenas = [];
const estrellasTxt = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
function tarjetaResena(r, { fija = false, delante = false } = {}) {
  const li = el("li", `review${fija ? " review--marti" : ""}`);
  if (fija) li.dataset.rise = "0";
  const head = el("div", "review__head");
  head.append(el("span", "review__avatar", (r.nombre.trim()[0] || "?").toUpperCase()));
  const who = el("div", "review__who");
  const name = el("p", "review__name", r.nombre);
  if (fija) name.append(el("span", "review__badge", "verificada ☀"));
  const meta = el("p", "review__meta");
  const st = el("span", "review__stars", estrellasTxt(r.estrellas));
  st.setAttribute("role", "img");
  st.setAttribute("aria-label", `${r.estrellas} de 5 estrellas`);
  const t = el("time", null, corta(r.fecha));
  t.dateTime = r.fecha;
  meta.append(st, " · ", t);
  who.append(name, meta);
  head.append(who);
  li.append(head, el("p", "review__text", r.texto));
  if (r.respuesta) {
    const rep = el("div", "review__reply");
    rep.append(el("p", "review__reply-by", `respuesta de ${PAREJA.el}`), el("p", "review__reply-text", r.respuesta));
    li.append(rep);
  }
  todasResenas.push(r);
  if (delante) revList.insertBefore(li, revList.children[RESENAS.length] || null);
  else revList.append(li);
  pintarNota();
  return li;
}
function pintarNota() {
  const n = todasResenas.length;
  const media = n ? todasResenas.reduce((a, r) => a + r.estrellas, 0) / n : 5;
  $("#revAvg").textContent = media.toFixed(1).replace(".", ",");
  $("#revAvgStars").textContent = estrellasTxt(Math.round(media));
  $("#revCount").textContent = `${n} ${n === 1 ? "reseña" : "reseñas"}`;
}
RESENAS.forEach((r) => tarjetaResena(r, { fija: true }));
const leerLocales = () => { try { return JSON.parse(localStorage.getItem(REV_LOCAL) || "[]"); } catch { return []; } };
const cabeceras = () => {
  const h = { apikey: RESENAS_GUARDADO.clave, "Content-Type": "application/json" };
  if (RESENAS_GUARDADO.clave.startsWith("eyJ")) h.Authorization = `Bearer ${RESENAS_GUARDADO.clave}`;
  return h;
};
const deFila = (f) => ({ nombre: f.nombre, estrellas: f.estrellas, texto: f.texto, fecha: String(f.creado || f.fecha).slice(0, 10) });
if (revRemoto) {
  fetch(`${RESENAS_GUARDADO.url}/rest/v1/resenas?select=nombre,estrellas,texto,creado&order=creado.desc&limit=300`, { headers: cabeceras() })
    .then((r) => (r.ok ? r.json() : []))
    .then((filas) => { filas.forEach((f) => tarjetaResena(deFila(f))); lenis?.resize?.(); })
    .catch(() => {});
} else {
  leerLocales().reverse().forEach((r) => tarjetaResena(r));
}
revForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = new FormData(revForm);
  if (datos.get("web")) return; // trampa para robots
  const nombre = String(datos.get("nombre") || "").trim().slice(0, 40);
  const texto = String(datos.get("texto") || "").trim().slice(0, 500);
  const estrellas = Math.min(5, Math.max(1, Number(datos.get("estrellas")) || 5));
  if (!nombre || !texto) {
    revMsg.textContent = !nombre ? "Falta tu nombre." : "Falta tu reseña.";
    revMsg.className = "review-form__msg is-error";
    (!nombre ? $("#revName") : $("#revText")).focus();
    return;
  }
  const boton = $(".review-form__send", revForm);
  boton.disabled = true;
  revMsg.className = "review-form__msg";
  revMsg.textContent = "Publicando…";
  const hoyIso = new Date().toISOString().slice(0, 10);
  let nueva = { nombre, estrellas, texto, fecha: hoyIso };
  try {
    if (revRemoto) {
      const res = await fetch(`${RESENAS_GUARDADO.url}/rest/v1/resenas`, { method: "POST", headers: { ...cabeceras(), Prefer: "return=representation" }, body: JSON.stringify({ nombre, estrellas, texto }) });
      if (!res.ok) throw new Error(String(res.status));
      const [fila] = await res.json();
      if (fila) nueva = deFila(fila);
      revMsg.textContent = "¡Gracias! Tu reseña ya está publicada.";
    } else {
      const locales = leerLocales();
      locales.push(nueva);
      try { localStorage.setItem(REV_LOCAL, JSON.stringify(locales)); } catch {}
      revMsg.textContent = "¡Gracias! Tu reseña se ha guardado en este dispositivo.";
    }
    const li = tarjetaResena(nueva, { delante: true });
    li.classList.add("is-new");
    revForm.reset();
    lenis?.resize?.();
  } catch {
    revMsg.textContent = "No se ha podido publicar. Prueba otra vez en un momento.";
    revMsg.className = "review-form__msg is-error";
  } finally {
    boton.disabled = false;
  }
});

// El muro
const wall = $("#wall");
FOTOS.forEach((f, i) => {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", `Ver en grande: ${f.texto || "foto"}, ${larga(f.fecha)}`);
  const p = polaroid(f, i, { tape: i % 3 === 0 });
  p.style.setProperty("--d", `${(i % 4) * 90}ms`);
  btn.append(p);
  btn.addEventListener("click", () => abrirVisor(i));
  li.append(btn);
  wall.append(li);
});

/* ═════════════════════════════════════════════════════════════
   3 · EL MOTOR DE TEXTO Y LAS ENTRADAS
   ═════════════════════════════════════════════════════════════ */
function split(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const mode = el.dataset.split;
  const stagger = Number(el.dataset.stagger || (mode === "letters" ? 26 : 110));
  const delay = Number(el.dataset.delay || 0);
  const sr = el.querySelector(".sr");
  const plain = el.textContent.replace(/\s+/g, " ").trim();
  // conservar el "." de color si lo hay
  const dot = el.querySelector(".dot");
  const base = (sr ? el.firstChild.textContent : (dot ? plain.slice(0, -1) : plain)).trim();
  el.textContent = "";
  el.classList.add("split", `split--${mode}`);
  const hidden = document.createElement("span");
  hidden.className = "sr";
  hidden.textContent = sr ? plain : plain;
  const units = mode === "letters" ? [...base] : base.split(" ");
  let i = 0;
  for (const u of units) {
    const s = document.createElement("span");
    s.className = "split__u";
    s.setAttribute("aria-hidden", "true");
    s.textContent = u;
    s.style.setProperty("--d", `${delay + i * stagger}ms`);
    if (i === units.length - 1) s.classList.add("is-last");
    el.append(s);
    i++;
  }
  if (dot) {
    const d = document.createElement("span");
    d.className = "split__u dot";
    d.setAttribute("aria-hidden", "true");
    d.textContent = ".";
    d.style.setProperty("--d", `${delay + i * stagger + 110}ms`);
    d.style.marginLeft = mode === "words" ? "-0.28em" : "0";
    el.append(d);
  }
  el.append(hidden);
}
$$("[data-split]").forEach(split);

// retrasos de las entradas sueltas
$$("[data-rise],[data-fade],[data-grow]").forEach((el) => {
  el.style.setProperty("--d", `${el.dataset.rise || el.dataset.fade || el.dataset.grow || 0}ms`);
});
$$("[data-grow]").forEach((el) => el.classList.add("rule"));

const heroEls = $$("[data-hero] [data-split], [data-hero] [data-rise], [data-hero] [data-fade]");
const revealIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add("is-in");
    revealIO.unobserve(e.target);
  }
}, { rootMargin: "0px 0px -12% 0px" });
$$("[data-split],[data-rise],[data-fade],[data-grow]").forEach((el) => {
  if (heroEls.includes(el) || el.closest(".row") || el.closest(".plate")) return;
  revealIO.observe(el);
});
// el final: su pie está pegado al borde inferior, así que entra todo junto cuando el bloque se ve
new IntersectionObserver(([e], o) => {
  if (!e.isIntersecting) return;
  $$(".finale [data-split], .finale [data-rise], .finale [data-fade]").forEach((el) => el.classList.add("is-in"));
  o.disconnect();
}, { threshold: 0.45 }).observe($(".finale"));
// la placa entra cuando entra su bloque
new IntersectionObserver(([e], o) => {
  if (!e.isIntersecting) return;
  $$(".plate, .plate [data-split]").forEach((el) => el.classList.add("is-in"));
  o.disconnect();
}, { threshold: 0.3 }).observe($(".universe"));
// polaroids del muro
const wallIO = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); wallIO.unobserve(e.target); }
}, { rootMargin: "0px 0px -8% 0px" });
$$(".wall .polaroid").forEach((p) => wallIO.observe(p));

/* ═════════════════════════════════════════════════════════════
   4 · EL VELO: un eclipse que se cierra mientras carga
   ═════════════════════════════════════════════════════════════ */
const veil = $("#veil");
preparar(); // texturas del sol y la luna (una sola vez)
const veilSky = lienzo($("#veilSky"));
let progress = 0, ready = false;
const setP = (p) => { $("#veilMeter").style.setProperty("--p", p.toFixed(4)); };
const stopVeil = subscribe((t) => {
  const target = ready ? 1 : 0.7;
  progress += (target - progress) * (ready ? 0.12 : 0.025);
  setP(progress);
  const { ctx, w, h } = veilSky;
  ctx.clearRect(0, 0, w, h);
  dibujar(ctx, { sx: w / 2, sy: h / 2, R: w / 2 / 2.4, mx: (1 - progress) * 1.38, my: (1 - progress) * -0.2, t: t / 1000, fondo: "claro", limite: w / 2 });
}, 0);

const decode = (img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve());
Promise.race([
  Promise.all([document.fonts?.ready ?? Promise.resolve(), ...$$("#fan img").map(decode)]),
  new Promise((r) => setTimeout(r, 5000)),
]).then(() => {
  ready = true;
  veil.setAttribute("aria-label", "Cargado");
  setTimeout(() => $("#veilInner").classList.add("is-clear"), 380);
  setTimeout(() => {
    veil.classList.add("is-lifting");
    entrada();
    const t0 = performance.now();
    const quitar = () => {
      if (Number(getComputedStyle(veil).opacity) <= 0.004 || performance.now() - t0 > 3000) { veil.remove(); stopVeil(); return; }
      requestAnimationFrame(quitar);
    };
    requestAnimationFrame(quitar);
  }, 380 + 430 + 240);
});

function entrada() {
  lockScroll(false);
  heroEls.forEach((el) => el.classList.add("is-in"));
  $$("[data-hero] [data-count]").forEach((el, i) => {
    $$(".split__u", el).forEach((u, j) => u.style.setProperty("--d", `${1000 + i * 90 + j * 26}ms`));
  });
}

/* ═════════════════════════════════════════════════════════════
   5 · LA PILA: el bloque cubierto se encoge y se oscurece
   ═════════════════════════════════════════════════════════════ */
const pinned = $$("[data-pin]").map((layer) => ({
  inner: $(".stack__inner", layer),
  shade: $(".stack__shade", layer),
  next: layer.nextElementSibling,
}));
const phone = matchMedia("(max-width: 639px)");
let recedeQueued = false;
function recede() {
  recedeQueued = false;
  const view = innerHeight || 1;
  const shrink = phone.matches || REDUCED ? 0 : 0.1;
  for (const { inner, shade, next } of pinned) {
    if (!next) continue;
    const p = clamp(1 - next.getBoundingClientRect().top / view);
    inner.style.transform = p > 0 && shrink > 0 ? `scale(${1 - shrink * p})` : "";
    inner.style.willChange = p > 0 && shrink > 0 ? "transform" : "";
    shade.style.opacity = `${0.55 * p}`;
    inner.style.visibility = p >= 1 ? "hidden" : "visible";
  }
}
addEventListener("scroll", () => { if (!recedeQueued) { recedeQueued = true; requestAnimationFrame(recede); } }, { passive: true });
addEventListener("resize", recede);
recede();
// Un bloque más alto que la pantalla se fija cuando su pie llega abajo, no cuando su techo llega arriba:
// así nunca queda nada suyo tapado antes de haberse visto.
const pinTop = () => $$("[data-pin]").forEach((l) => { l.style.top = `${Math.min(0, innerHeight - l.offsetHeight)}px`; });
new ResizeObserver(pinTop).observe($("#stack"));
addEventListener("resize", pinTop);
pinTop();

/* ═════════════════════════════════════════════════════════════
   6 · LÍNEAS DE CONTORNO (marching squares sobre 4 senos)
   ═════════════════════════════════════════════════════════════ */
const LINE_SCALE = 3.8, LINE_COUNT = 2.5, WAVE_AMOUNT = 0.37, WAVE_SPEED = 1.66, LINE_OPACITY = 0.85, CELLS = 96;
const field = (x, y, t) => {
  let f = Math.sin(x + t * 0.6) * 0.5;
  f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
  f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
  f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
  return f * 0.5 + 0.5;
};
const CONTOUR_COLOR = { hero: "--contour-light", quotes: "--contour-ink", finale: "--raw-white-alpha-10" };
$$("[data-contours]").forEach((canvas) => {
  const ctx = canvas.getContext("2d");
  const visible = inView(canvas);
  const color = css(CONTOUR_COLOR[canvas.dataset.contours]) || "rgba(0,0,0,.08)";
  const start = performance.now();
  let w = 0, h = 0;
  const size = () => {
    const r = Math.min(devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * r); canvas.height = Math.round(h * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
  };
  new ResizeObserver(size).observe(canvas);
  size();
  const draw = (now) => {
    if (!w || !h || !visible()) return;
    const t = REDUCED ? 0 : ((now - start) / 1000) * WAVE_SPEED;
    const cols = w >= h ? CELLS : Math.max(8, Math.round((CELLS * w) / h));
    const rows = Math.max(8, Math.round((cols * h) / w));
    const sx = w / cols, sy = h / rows, aspect = w / h;
    const v = new Float32Array((cols + 1) * (rows + 1));
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
      const nx = ((i / cols) * 2 - 1) * aspect * LINE_SCALE;
      const ny = ((j / rows) * 2 - 1) * LINE_SCALE;
      const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE_AMOUNT;
      const qy = ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE_AMOUNT;
      v[j * (cols + 1) + i] = field(qx, qy, t) * LINE_COUNT;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = LINE_OPACITY; ctx.beginPath();
    const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
    for (let level = 0.5; level < LINE_COUNT; level += 1)
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const a = v[j * (cols + 1) + i], b = v[j * (cols + 1) + i + 1];
        const c = v[(j + 1) * (cols + 1) + i + 1], d = v[(j + 1) * (cols + 1) + i];
        const k = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (k === 0 || k === 15) continue;
        const x0 = i * sx, y0 = j * sy;
        const top = [x0 + sx * ((level - a) / (b - a)), y0];
        const right = [x0 + sx, y0 + sy * ((level - b) / (c - b))];
        const bottom = [x0 + sx * ((level - d) / (c - d)), y0 + sy];
        const left = [x0, y0 + sy * ((level - a) / (d - a))];
        switch (k) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 5: seg(left, top); seg(bottom, right); break;
          case 10: seg(left, bottom); seg(top, right); break;
        }
      }
    ctx.stroke(); ctx.globalAlpha = 1;
  };
  subscribe(draw, REDUCED ? 1e9 : 33);
  if (REDUCED) requestAnimationFrame(draw);
});

/* ═════════════════════════════════════════════════════════════
   7 · LA COSTURA DE VICHY: cuadros que se deshacen al bajar
   ═════════════════════════════════════════════════════════════ */
const noise = (x, y) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const CARRY = { light: "--background", dark: "--night", ink: "--night-deep" };
$$("[data-vichy]").forEach((canvas) => {
  const ctx = canvas.getContext("2d");
  const section = canvas.closest("section");
  const surface = css(CARRY[canvas.dataset.vichy]);
  const red = css("--vichy");
  const visible = inView(section);
  let last = -1, w = 0, h = 0, ratio = 1;
  const size = () => { ratio = Math.min(devicePixelRatio || 1, 2); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio); last = -1; };
  new ResizeObserver(size).observe(canvas);
  size();
  subscribe(() => {
    if (!visible() || !w) return;
    const vh = innerHeight;
    const top = section.getBoundingClientRect().top;
    const progress = clamp(1 - top / vh);
    if (Math.abs(progress - last) < 0.002) return;
    last = progress;
    const cell = w < 640 ? 16 : 22;
    const SOLID_UNTIL = 0.16, LIFT = 2, RED_SHARE = 0.14;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell), lift = progress * LIFT;
    for (let y = 0; y < rows; y++) {
      const depth = y / Math.max(1, rows - 1) + lift;
      if (depth > 1) break;
      const solid = depth <= SOLID_UNTIL;
      const fade = clamp(1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL));
      if (!solid && fade <= 0) break;
      for (let x = 0; x < cols; x++) {
        if (!solid) {
          if ((x + y) % 2 !== 0) continue;
          if (noise(x, y) > fade) continue;
        }
        ctx.fillStyle = !solid && noise(x + 101, y + 57) < RED_SHARE ? red : surface;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }, 10);
});

/* ═════════════════════════════════════════════════════════════
   8 · LA PORTADA: la luna sigue al cursor hasta tapar el sol
   ═════════════════════════════════════════════════════════════ */
const eclipse = $("#eclipse"), hint = $("#hint"), hero = $("[data-hero]");
const heroSky = lienzo(eclipse, 1.5);
const HERO_SPAN = 2.35; // el lienzo mide 2·2,35 radios de sol: cabe la luna y la corona
const heroVisible = () => scrollY <= innerHeight * 1.15 && !document.hidden;
const pointer = { x: innerWidth * 0.3, y: innerHeight * 0.55, seen: false, nx: 0, ny: 0 };
const moonPos = { x: -0.62, y: 0.08 };
let eclipsed = false;
if (!COARSE) addEventListener("pointermove", (e) => {
  pointer.x = e.clientX; pointer.y = e.clientY; pointer.seen = true;
  pointer.nx = (e.clientX / innerWidth) * 2 - 1; pointer.ny = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });
if (COARSE) hint.textContent = "tú, mi sol · yo, tu luna";

subscribe((t) => {
  if (!heroVisible()) return;
  const r = eclipse.getBoundingClientRect();
  const R = r.width / 2 / HERO_SPAN;
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let tx, ty;
  if (pointer.seen && !REDUCED) {
    tx = clamp((pointer.x - cx) / R, -1.3, 1.3);
    ty = clamp((pointer.y - cy) / R, -1.3, 1.3);
  } else {
    // sin cursor: la luna orbita sola y cada tanto se alinea
    const s = REDUCED ? 0 : t / 1000;
    tx = Math.cos(s * 0.32) * 1.25; ty = Math.sin(s * 0.64) * 0.22;
  }
  moonPos.x = lerp(moonPos.x, tx, 0.08);
  moonPos.y = lerp(moonPos.y, ty, 0.08);
  const { ctx: hc, w: hw, h: hh } = heroSky;
  hc.clearRect(0, 0, hw, hh);
  dibujar(hc, { sx: hw / 2, sy: hh / 2, R: hw / 2 / HERO_SPAN, mx: moonPos.x, my: moonPos.y, t: REDUCED ? 0 : t / 1000, fondo: "claro", limite: hw / 2 });
  const d = Math.hypot(moonPos.x, moonPos.y);
  const now = d < 0.1;
  if (now !== eclipsed) {
    eclipsed = now;
    hint.classList.toggle("is-eclipse", now);
    hint.textContent = now ? "el eclipse perfecto ✦" : COARSE ? "tú, mi sol · yo, tu luna" : "mueve la luna hasta el sol";
  }
  // polaroids con un poco de paralaje
  $$(".polaroid", fan).forEach((p, i) => {
    const k = (i + 1) * 4;
    p.style.setProperty("--px", `${(Number(p.dataset.x) + pointer.nx * k).toFixed(1)}px`);
    p.style.setProperty("--py", `${(Number(p.dataset.y) + pointer.ny * k).toFixed(1)}px`);
  });
  const sc = clamp(scrollY / (innerHeight * 0.4));
  $(".hero__scroll-line")?.style.setProperty("--s", (0.35 + sc * 0.65).toFixed(3));
}, 0);

// polvo de estrellas detrás del cursor
const sp = $("#sparkles"), spx = sp.getContext("2d");
const motes = [];
let spW = 0, spH = 0;
const spSize = () => { const r = Math.min(devicePixelRatio || 1, 2); spW = sp.clientWidth; spH = sp.clientHeight; sp.width = spW * r; sp.height = spH * r; spx.setTransform(r, 0, 0, r, 0, 0); };
new ResizeObserver(spSize).observe(sp); spSize();
let lastMote = { x: 0, y: 0 };
if (!COARSE && !REDUCED) addEventListener("pointermove", (e) => {
  if (!heroVisible()) return;
  const hr = hero.getBoundingClientRect();
  const x = e.clientX - hr.left, y = e.clientY - hr.top;
  if (Math.hypot(x - lastMote.x, y - lastMote.y) < 14) return;
  lastMote = { x, y };
  motes.push({ x, y, life: 1, s: 2 + Math.random() * 4, rot: Math.random() * Math.PI, vy: -0.15 - Math.random() * 0.35 });
  if (motes.length > 70) motes.shift();
}, { passive: true });
const gold = css("--accent");
subscribe(() => {
  if (!motes.length) return;
  spx.clearRect(0, 0, spW, spH);
  for (let i = motes.length - 1; i >= 0; i--) {
    const m = motes[i];
    m.life -= 0.018; m.y += m.vy; m.rot += 0.03;
    if (m.life <= 0) { motes.splice(i, 1); continue; }
    spx.save(); spx.translate(m.x, m.y); spx.rotate(m.rot);
    spx.globalAlpha = m.life * 0.9; spx.fillStyle = gold;
    const s = m.s * (0.5 + m.life * 0.5);
    spx.beginPath();
    spx.moveTo(0, -s); spx.lineTo(s * 0.28, -s * 0.28); spx.lineTo(s, 0); spx.lineTo(s * 0.28, s * 0.28);
    spx.lineTo(0, s); spx.lineTo(-s * 0.28, s * 0.28); spx.lineTo(-s, 0); spx.lineTo(-s * 0.28, -s * 0.28);
    spx.closePath(); spx.fill(); spx.restore();
  }
  if (!motes.length) spx.clearRect(0, 0, spW, spH);
}, 0);

/* ═════════════════════════════════════════════════════════════
   9 · NUESTRO UNIVERSO: estrellas y un corazón que se dibuja
   ═════════════════════════════════════════════════════════════ */
const uSection = $(".universe"), uStage = $("#uStage");
const starsC = $("#stars"), sx = starsC.getContext("2d");
const traceC = $("#trace"), tx = traceC.getContext("2d");
const labels = $("#uLabels");
const uVisible = inView(uSection);
const PITCH = 15;
let UW = 0, UH = 0, URatio = 1, STARS = [], HEART = [], HEART_LEN = [], HEART_TOTAL = 0, MARKS = [];
const SUN = [246, 162, 26], BRIGHT = [255, 214, 140], WHITE = [255, 255, 255];
const rgba = ([r, g, b], a) => `rgb(${r} ${g} ${b} / ${a})`;

function uLayout() {
  URatio = Math.min(devicePixelRatio || 1, COARSE ? 1 : 2);
  UW = uStage.clientWidth; UH = uStage.clientHeight;
  for (const c of [starsC, traceC]) { c.width = Math.round(UW * URatio); c.height = Math.round(UH * URatio); }
  STARS = [];
  for (let j = 0; j * PITCH < UH + PITCH; j++) for (let i = 0; i * PITCH < UW + PITCH; i++) {
    const n = noise(i, j);
    if (n > 0.3) continue;
    STARS.push({ x: i * PITCH + (noise(i + 7, j) - 0.5) * 6, y: j * PITCH + (noise(i, j + 7) - 0.5) * 6, r: 0.5 + noise(i + 3, j + 3) * 1.1, a: 0.18 + noise(i + 9, j + 1) * 0.5, ph: noise(i + 1, j + 9) * 6.28, lit: 0 });
  }
  // el corazón
  const wide = UW > 900;
  const cx = wide ? UW * 0.62 : UW * 0.5, cy = wide ? UH * 0.47 : UH * 0.52;
  const size = Math.min(UW * (wide ? 0.3 : 0.42), UH * 0.34) / 16;
  HEART = [];
  const N = 720;
  for (let k = 0; k <= N; k++) {
    const t = Math.PI + (k / N) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    HEART.push([cx + x * size, cy - y * size]);
  }
  HEART_LEN = [0];
  for (let k = 1; k < HEART.length; k++) HEART_LEN.push(HEART_LEN[k - 1] + Math.hypot(HEART[k][0] - HEART[k - 1][0], HEART[k][1] - HEART[k - 1][1]));
  HEART_TOTAL = HEART_LEN[HEART_LEN.length - 1];
  const at = [0.02, 0.27, 0.62, 0.86];
  labels.innerHTML = "";
  MARKS = ESTRELLAS.map((s, i) => {
    const d = at[i] * HEART_TOTAL;
    const k = HEART_LEN.findIndex((l) => l >= d);
    const [x, y] = HEART[Math.max(0, k)];
    const el = document.createElement("p");
    el.className = "star-label";
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.innerHTML = `<b>${puntos(s.fecha)}</b><span>${s.texto}</span>`;
    labels.append(el);
    return { x, y, d, el };
  });
  drawTrace();
}
new ResizeObserver(() => uLayout()).observe(uStage);

// el trazo: una sola vuelta de 6 s cuando el bloque aparece
let lap = 0, heat = 1, lapDone = false, lapStarted = false;
const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
new IntersectionObserver(([e]) => {
  if (!e.isIntersecting || lapStarted) return;
  lapStarted = true;
  const t0 = performance.now();
  const D = REDUCED ? 1 : 6000;
  const run = (now) => {
    lap = ease(clamp((now - t0) / D));
    drawTrace();
    if (lap < 1) return requestAnimationFrame(run);
    const c0 = performance.now();
    const cool = (n) => {
      const k = clamp((n - c0) / 800);
      heat = 1 - (1 - (1 - k) ** 3);
      drawTrace();
      if (k < 1) requestAnimationFrame(cool); else lapDone = true;
    };
    requestAnimationFrame(cool);
  };
  requestAnimationFrame(run);
}, { threshold: 0.35 }).observe(uSection);

function trailUpTo(dist) {
  const out = [];
  for (let k = 0; k < HEART.length; k++) {
    if (HEART_LEN[k] <= dist) { out.push(HEART[k]); continue; }
    const a = HEART[k - 1], b = HEART[k];
    const r = (dist - HEART_LEN[k - 1]) / (HEART_LEN[k] - HEART_LEN[k - 1] || 1);
    out.push([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]);
    break;
  }
  return out;
}
function stroke(pts, from = 0) {
  tx.beginPath(); tx.moveTo(pts[from][0], pts[from][1]);
  for (let k = from + 1; k < pts.length; k++) tx.lineTo(pts[k][0], pts[k][1]);
  tx.stroke();
}
function drawTrace() {
  if (!UW) return;
  tx.setTransform(URatio, 0, 0, URatio, 0, 0);
  tx.clearRect(0, 0, UW, UH);
  const dist = lap * HEART_TOTAL;
  const pts = trailUpTo(dist);
  if (pts.length > 1) {
    tx.lineCap = "round"; tx.lineJoin = "round";
    tx.save(); tx.globalCompositeOperation = "lighter";
    tx.strokeStyle = rgba(SUN, 0.06); tx.lineWidth = 16; stroke(pts);
    tx.strokeStyle = rgba(SUN, 0.12); tx.lineWidth = 7; stroke(pts);
    tx.restore();
    tx.strokeStyle = rgba(SUN, 0.9); tx.lineWidth = 2.2; stroke(pts);
    const head = Math.min(pts.length - 1, 70);
    const from = pts.length - 1 - head;
    const tip = pts[pts.length - 1];
    if (head > 1) {
      const g = tx.createLinearGradient(pts[from][0], pts[from][1], tip[0], tip[1]);
      g.addColorStop(0, rgba(SUN, 0)); g.addColorStop(0.5, rgba(BRIGHT, 0.8 * heat)); g.addColorStop(1, rgba(WHITE, heat));
      tx.strokeStyle = g; tx.lineWidth = 2.6; stroke(pts, from);
    }
    if (heat > 0.01) {
      tx.save(); tx.globalCompositeOperation = "lighter";
      const s = tx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 16);
      s.addColorStop(0, rgba(WHITE, 0.9 * heat)); s.addColorStop(0.35, rgba(BRIGHT, 0.45 * heat)); s.addColorStop(1, rgba(SUN, 0));
      tx.fillStyle = s; tx.beginPath(); tx.arc(tip[0], tip[1], 16, 0, Math.PI * 2); tx.fill(); tx.restore();
    }
  }
  for (const m of MARKS) {
    const reached = dist >= m.d;
    m.el.classList.toggle("is-in", reached);
    if (!reached) continue;
    const age = clamp((dist - m.d) / 120);
    const r = 10 + (1 - age) * 14;
    tx.save(); tx.globalCompositeOperation = "lighter";
    const g = tx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r);
    g.addColorStop(0, rgba(BRIGHT, 0.55 + 0.4 * (1 - age))); g.addColorStop(0.45, rgba(SUN, 0.3)); g.addColorStop(1, rgba(SUN, 0));
    tx.fillStyle = g; tx.beginPath(); tx.arc(m.x, m.y, r, 0, Math.PI * 2); tx.fill(); tx.restore();
    tx.fillStyle = rgba(WHITE, 1); tx.beginPath(); tx.arc(m.x, m.y, 2.6, 0, Math.PI * 2); tx.fill();
  }
}

// el cielo: titila, y tras el corazón el cursor se vuelve una retícula de luz
const uPointer = { x: -999, y: -999, on: false, heat: 0, spread: 0, px: -999, py: -999 };
if (!COARSE && !REDUCED) {
  addEventListener("pointermove", (e) => {
    const r = uStage.getBoundingClientRect();
    uPointer.x = e.clientX - r.left; uPointer.y = e.clientY - r.top;
    uPointer.on = e.clientY >= r.top && e.clientY <= r.bottom;
  }, { passive: true });
  document.addEventListener("pointerleave", () => { uPointer.on = false; });
}
let uLast = 0;
subscribe((now) => {
  if (!uVisible() || !UW) return;
  const dt = uLast ? Math.min(0.1, (now - uLast) / 1000) : 0;
  uLast = now;
  const t = now / 1000;
  const want = uPointer.on && lapDone ? 1 : 0;
  uPointer.heat += (want - uPointer.heat) * (1 - Math.exp(-dt / (want ? 0.14 : 0.3)));
  const ox = uPointer.px, oy = uPointer.py;
  uPointer.px = ox < -900 ? uPointer.x : lerp(ox, uPointer.x, 1 - Math.exp(-dt / 0.07));
  uPointer.py = oy < -900 ? uPointer.y : lerp(oy, uPointer.y, 1 - Math.exp(-dt / 0.07));
  const speed = dt ? Math.hypot(uPointer.px - ox, uPointer.py - oy) / dt : 0;
  const wantSpread = clamp(1 - speed / 900);
  uPointer.spread += (wantSpread - uPointer.spread) * (1 - Math.exp(-dt / (wantSpread > uPointer.spread ? 0.38 : 0.09)));
  sx.setTransform(URatio, 0, 0, URatio, 0, 0);
  sx.clearRect(0, 0, UW, UH);
  const heatP = uPointer.heat, reach = 360 * uPointer.spread;
  for (const s of STARS) {
    const tw = REDUCED ? 1 : 0.7 + 0.3 * Math.sin(t * 1.3 + s.ph);
    let light = 0;
    if (heatP > 0.01) {
      const dx = Math.abs(s.x - uPointer.px), dy = Math.abs(s.y - uPointer.py);
      const d = Math.hypot(dx, dy);
      if (d < 70) light = (1 - d / 70) ** 2;
      if (reach > 1 && dy < PITCH * 0.6 && dx < reach) light = Math.max(light, (1 - dx / reach) * 0.85);
      if (reach > 1 && dx < PITCH * 0.6 && dy < reach) light = Math.max(light, (1 - dy / reach) * 0.85);
      light *= heatP;
    }
    s.lit = Math.max(light, s.lit * 0.9);
    if (s.lit > 0.25) {
      const k = s.lit;
      const sz = 1.5 + k * 3.2;
      sx.fillStyle = k > 0.8 ? rgba(WHITE, 1) : k > 0.5 ? rgba(BRIGHT, 1) : rgba(SUN, 0.5 + k * 0.5);
      sx.beginPath();
      sx.moveTo(s.x, s.y - sz); sx.lineTo(s.x + sz * 0.25, s.y - sz * 0.25); sx.lineTo(s.x + sz, s.y);
      sx.lineTo(s.x + sz * 0.25, s.y + sz * 0.25); sx.lineTo(s.x, s.y + sz); sx.lineTo(s.x - sz * 0.25, s.y + sz * 0.25);
      sx.lineTo(s.x - sz, s.y); sx.lineTo(s.x - sz * 0.25, s.y - sz * 0.25); sx.closePath(); sx.fill();
    } else {
      sx.fillStyle = `rgb(201 204 216 / ${(s.a * tw).toFixed(3)})`;
      sx.fillRect(s.x - s.r / 2, s.y - s.r / 2, s.r, s.r);
    }
  }
}, 16);

// la luna de la placa gira (10 s por vuelta)
const meridian = $("#meridian");
subscribe((now) => {
  if (!uVisible()) return;
  const turn = REDUCED ? 0.6 : ((now % 10000) / 10000) * Math.PI * 2;
  meridian.setAttribute("rx", Math.max(0.5, Math.abs(Math.cos(turn)) * 17.5).toFixed(2));
}, 30);

/* ═════════════════════════════════════════════════════════════
   10 · LA HISTORIA: paralaje, años letra a letra y el hilo
   ═════════════════════════════════════════════════════════════ */
const story = $(".story"), storyVisible = inView(story);
const rows = $$(".row");
const unit = () => innerWidth / 1440;
const yearIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const row = e.target;
    $$("[data-year], [data-rise]", row).forEach((el) => el.classList.add("is-in"));
    if (row.classList.contains("row--centro")) setTimeout(() => row.querySelector("[data-year]")?.classList.add("is-settled"), 2200);
    yearIO.unobserve(row);
  }
}, { rootMargin: "0px 0px -25% 0px" });
rows.forEach((r) => yearIO.observe(r));

const narrow = matchMedia("(max-width: 760px)");
subscribe(() => {
  if (!storyVisible()) return;
  const vh = innerHeight;
  for (const row of rows) {
    const r = row.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    const p = clamp((vh - r.top) / (vh + r.height));
    const k = narrow.matches ? 0.35 : 1;
    for (const layer of $$("[data-par]", row)) {
      const travel = Number(layer.dataset.par) * unit() * k;
      layer.style.transform = `translateY(${((1 - 2 * p) * travel).toFixed(1)}px)`;
    }
    const slot = $("[data-slot]", row);
    if (slot) {
      const q = clamp((vh - r.top) / (vh / 2));
      slot.style.top = `${lerp(-10, 0, q).toFixed(2)}%`;
    }
  }
}, 0);

if (matchMedia("(hover: hover)").matches) rows.forEach((row) => {
  const plate = $(".plateph", row);
  plate.addEventListener("pointerenter", () => { story.classList.add("is-hovering"); row.classList.add("is-hover"); });
  plate.addEventListener("pointerleave", () => { story.classList.remove("is-hovering"); row.classList.remove("is-hover"); });
});

// el hilo
const rail = $("#rail"), railSvg = $("#railSvg");
const thread = $(".rail__thread"), star = $(".rail__star"), dash = $(".rail__dash");
let railRun = 0, railRest = 1, railH = 1;
function railLayout() {
  railH = rail.clientHeight || 1;
  railSvg.setAttribute("viewBox", `0 0 16 ${railH}`);
  const last = rows[rows.length - 1];
  const wrapTop = rail.getBoundingClientRect().top;
  const lr = last.getBoundingClientRect();
  railRest = Math.max(120, lr.top - wrapTop + lr.height / 2 - 50);
  dash.setAttribute("y2", railRest);
}
new ResizeObserver(railLayout).observe($("#storyWrap"));
subscribe(() => {
  if (!storyVisible() || narrow.matches) return;
  const r = rail.getBoundingClientRect();
  const vh = innerHeight;
  const start = r.top - vh / 2;
  const end = r.bottom - vh;
  const len = Math.abs(start - end) || 1;
  const p = clamp(1 - (start + len) / len);
  railRun = lerp(railRun, p * railRest, 0.12);
  thread.setAttribute("height", railRun.toFixed(1));
  star.setAttribute("transform", `translate(8 ${railRun.toFixed(1)}) rotate(${((railRun / railRest) * 1800).toFixed(1)})`);
}, 0);

// el cielo detrás de las canciones (estático)
{
  const st = lienzo($("#songStars"), 1.5);
  st.onSize = () => { st.ctx.clearRect(0, 0, st.w, st.h); estrellas(st.ctx, st.w, st.h, 21, Math.round((st.w * st.h) / 1800)); };
  st.onSize();
}

/* ═════════════════════════════════════════════════════════════
   11 · EL FINAL: el eclipse se completa al llegar abajo del todo
   ═════════════════════════════════════════════════════════════ */
const finale = $(".finale"), fig = $("#finaleFig"), finVisible = inView(finale);
const finSky = lienzo(fig, COARSE ? 1.5 : 2);
let finP = 0;
subscribe((now) => {
  if (!finVisible()) return;
  const r = finale.getBoundingClientRect();
  const vh = innerHeight;
  const start = r.top - vh, end = r.bottom - vh;
  const p = clamp(1 - (start + Math.abs(start - end)) / (Math.abs(start - end) || 1));
  finP = lerp(finP, REDUCED ? 1 : p, 0.1);
  fig.style.setProperty("--fy", `${((1 - finP) * 60 * unit()).toFixed(1)}px`);
  const { ctx, w, h } = finSky;
  ctx.clearRect(0, 0, w, h);
  dibujar(ctx, { sx: w / 2, sy: h / 2, R: w / 2 / 2.3, mx: (1 - finP) * -1.28, my: (1 - finP) * -0.12, t: now / 1000, fondo: "oscuro", limite: w / 2 });
}, 0);

/* ═════════════════════════════════════════════════════════════
   12 · MENÚ, VISOR Y ENLACES
   ═════════════════════════════════════════════════════════════ */
const sheet = $("#sheet"), burger = $("#burger");
function sheetOpen(on) {
  if (on) {
    sheet.hidden = false;
    $$(".sheet__nav a", sheet).forEach((a, i) => a.style.setProperty("--d", `${120 + i * 55}ms`));
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    lockScroll(true);
    $("#sheetClose").focus();
  } else {
    sheet.classList.remove("is-open");
    setTimeout(() => { sheet.hidden = true; }, 400);
    lockScroll(false);
    burger.focus();
  }
  burger.setAttribute("aria-expanded", String(on));
}
burger.addEventListener("click", () => sheetOpen(true));
$("#sheetClose").addEventListener("click", () => sheetOpen(false));
matchMedia("(min-width: 1024px)").addEventListener("change", (e) => { if (e.matches && !sheet.hidden) sheetOpen(false); });

const lb = $("#lightbox"), lbFigure = $("#lbFigure");
const lbImg = new Image();
lbFigure.prepend(lbImg);
let lbIndex = 0, lbReturn = null, lbLista = FOTOS;
function pintarVisor() {
  const f = lbLista[lbIndex];
  lbImg.src = f.src;
  lbImg.alt = f.texto ? `${f.texto}, ${larga(f.fecha)}` : `Foto del ${larga(f.fecha)}`;
  $("#lbText").textContent = f.texto || "";
  $("#lbDate").textContent = larga(f.fecha);
  $("#lbDate").setAttribute("datetime", f.fecha);
}
function abrirVisor(i, lista = FOTOS) {
  lbLista = lista; lbIndex = i; lbReturn = document.activeElement;
  pintarVisor();
  lb.hidden = false; lockScroll(true);
  $("#lbClose").focus();
}
function cerrarVisor() { lb.hidden = true; lockScroll(false); lbReturn?.focus?.(); }
const mover = (d) => { lbIndex = (lbIndex + d + lbLista.length) % lbLista.length; pintarVisor(); };
$("#lbClose").addEventListener("click", cerrarVisor);
$("#lbPrev").addEventListener("click", () => mover(-1));
$("#lbNext").addEventListener("click", () => mover(1));
lb.addEventListener("click", (e) => { if (e.target === lb) cerrarVisor(); });
addEventListener("keydown", (e) => {
  if (e.key === "Escape") { if (!lb.hidden) cerrarVisor(); else if (!sheet.hidden) sheetOpen(false); }
  if (!lb.hidden && e.key === "ArrowRight") mover(1);
  if (!lb.hidden && e.key === "ArrowLeft") mover(-1);
});
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => { if (touchX == null) return; const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1); touchX = null; });

// enlaces internos con el scroll suave
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  const target = id === "#inicio" ? document.body : $(id);
  if (!target) return;
  e.preventDefault();
  if (!sheet.hidden) sheetOpen(false);
  // Un bloque fijado (sticky) no dice dónde empieza de verdad: se suma la altura de los anteriores.
  const layer = target.closest?.("[data-pin]");
  let y;
  if (id === "#inicio") y = 0;
  else if (layer) {
    y = $("#stack").offsetTop;
    for (let el = layer.previousElementSibling; el; el = el.previousElementSibling) y += el.offsetHeight;
  } else y = target.getBoundingClientRect().top + scrollY;
  if (lenis) lenis.scrollTo(y, { duration: 1.6 }); else scrollTo({ top: y, behavior: REDUCED ? "auto" : "smooth" });
}));
