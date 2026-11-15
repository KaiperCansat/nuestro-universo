import { DIBUJOS } from "./dibujos.js";
// ─────────────────────────────────────────────────────────────
//  EL CIELO: un sol y una luna dibujados a mano en canvas
//  · el sol: granulado de fBm, oscurecimiento del borde, corona
//  · la luna: mares, cráteres con borde iluminado, fase según
//    dónde esté el sol, y el anillo de diamante antes del total
// ─────────────────────────────────────────────────────────────

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/* ruido de valor con interpolación suave, determinista */
const hash = (x, y, s) => {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, s, oct = 5) {
  let sum = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { sum += vnoise(x * f, y * f, s + i * 17) * amp; norm += amp; amp *= 0.5; f *= 2.03; }
  return sum / norm;
}

/* ── texturas (se generan una sola vez) ───────────────────── */
const SIZE = 384;
let SUN = null, SUN2 = null, MOON = null, STREAMERS = null;

function ramp(t) {
  // del naranja profundo al blanco cálido
  const stops = [[0, [176, 58, 4]], [0.42, [236, 128, 18]], [0.7, [252, 186, 70]], [0.9, [255, 228, 160]], [1, [255, 248, 228]]];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      const k = (t - t0) / (t1 - t0);
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k];
    }
  }
  return stops[stops.length - 1][1];
}

function makeSun(seed, gran) {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(SIZE, SIZE);
  const d = img.data;
  for (let j = 0; j < SIZE; j++) for (let i = 0; i < SIZE; i++) {
    const u = ((i + 0.5) / SIZE) * 2 - 1, v = ((j + 0.5) / SIZE) * 2 - 1;
    const r2 = u * u + v * v;
    const k = (j * SIZE + i) * 4;
    if (r2 > 1) { d[k + 3] = 0; continue; }
    const mu = Math.sqrt(1 - r2);
    const g = fbm(u * gran + 3, v * gran + 7, seed, 4);          // granulado fino
    const big = fbm(u * 2.2 + 11, v * 2.2 - 4, seed + 5, 3);     // manchas grandes
    const fac = vnoise(u * 9, v * 9, seed + 9);                  // fáculas
    let t = 0.3 + 0.62 * Math.pow(mu, 0.55) + (g - 0.5) * 0.32 + (big - 0.5) * 0.18;
    t += smooth(0.72, 0.95, fac) * 0.08 * (1 - mu);
    const [r, gg, b] = ramp(clamp(t));
    d[k] = r; d[k + 1] = gg; d[k + 2] = b;
    d[k + 3] = 255 * clamp((1 - Math.sqrt(r2)) * SIZE * 0.5);    // borde suavizado
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function makeMoon(seed) {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(SIZE, SIZE);
  const d = img.data;
  // cráteres: posición, radio y profundidad
  const craters = [];
  for (let n = 0; n < 90; n++) {
    const a = hash(n, 1, seed) * Math.PI * 2, rr = Math.sqrt(hash(n, 2, seed)) * 0.92;
    const big = hash(n, 3, seed);
    craters.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr, r: 0.018 + big * big * big * 0.16, dep: 0.5 + hash(n, 4, seed) * 0.6 });
  }
  const L = [-0.6, -0.65]; // dirección de la luz para el relieve de los cráteres
  for (let j = 0; j < SIZE; j++) for (let i = 0; i < SIZE; i++) {
    const u = ((i + 0.5) / SIZE) * 2 - 1, v = ((j + 0.5) / SIZE) * 2 - 1;
    const r2 = u * u + v * v;
    const k = (j * SIZE + i) * 4;
    if (r2 > 1) { d[k + 3] = 0; continue; }
    let g = 0.66 + (fbm(u * 3.2, v * 3.2, seed, 5) - 0.5) * 0.34;
    // mares: zonas grandes y oscuras
    const mare = fbm(u * 1.35 + 5.1, v * 1.35 + 2.3, seed + 3, 4);
    g -= smooth(0.5, 0.66, mare) * 0.2;
    // grano fino
    g += (vnoise(u * 60, v * 60, seed + 7) - 0.5) * 0.05;
    for (const cr of craters) {
      const dx = u - cr.x, dy = v - cr.y;
      const dd = Math.sqrt(dx * dx + dy * dy) / cr.r;
      if (dd > 1.25) continue;
      if (dd < 1) {
        // cuenco: más oscuro del lado de la luz, más claro del contrario
        const side = (dx * L[0] + dy * L[1]) / (cr.r * (dd || 1));
        g -= cr.dep * 0.13 * (1 - dd * dd) * (0.6 + side * 0.4);
        g += cr.dep * 0.08 * smooth(0.55, 1, dd) * Math.max(0, -side);
      } else {
        // borde: un anillo claro
        g += cr.dep * 0.07 * (1 - (dd - 1) / 0.25);
      }
    }
    const mu = Math.sqrt(1 - r2);
    g *= 0.72 + 0.28 * Math.pow(mu, 0.4);
    g = clamp(g);
    d[k] = 168 * g + 22; d[k + 1] = 172 * g + 24; d[k + 2] = 190 * g + 34;
    d[k + 3] = 255 * clamp((1 - Math.sqrt(r2)) * SIZE * 0.5);
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

export function preparar() {
  if (SUN) return;
  SUN = makeSun(3, 13);
  SUN2 = makeSun(29, 19);
  MOON = makeMoon(11);
  STREAMERS = Array.from({ length: 150 }, (_, n) => {
    const long = hash(n, 5, 77) > 0.86;
    return {
      a: hash(n, 1, 77) * Math.PI * 2,
      len: long ? 0.9 + hash(n, 2, 77) * 1.1 : 0.18 + hash(n, 2, 77) * 0.5,
      w: 0.6 + hash(n, 3, 77) * 2.2,
      al: 0.05 + hash(n, 4, 77) * 0.14,
      ph: hash(n, 6, 77) * 6.28,
    };
  });
}

/* ── dibujar la escena ─────────────────────────────────────
   ctx en píxeles CSS. sx, sy: centro del sol. R: radio del sol.
   mx, my: la luna, en radios de sol respecto al centro del sol.
   t: segundos. halo: 0..1, cuánto brilla el sol sobre el fondo.  */
export function dibujar(ctx, { sx, sy, R, mx, my, t = 0, halo = 1, fondo = "claro", limite = Infinity }) {
  if (!SUN) preparar();
  // nada puede salirse del lienzo: así no se ve nunca su borde cuadrado
  const lim = Math.max(R * 1.2, limite * 0.97);
  const d = Math.hypot(mx, my);
  const tapa = clamp(1 - d / 2);                 // 0 tocándose, 1 centrados
  const total = smooth(0.25, 0.02, d);           // casi total
  const corona = 0.18 + 0.82 * Math.pow(tapa, 1.6);

  // 1 · halo exterior
  ctx.save();
  ctx.globalCompositeOperation = fondo === "oscuro" ? "lighter" : "source-over";
  const haloR = Math.min(R * (2.6 + corona * 0.8), lim);
  const g0 = ctx.createRadialGradient(sx, sy, R * 0.9, sx, sy, haloR);
  const hA = (fondo === "oscuro" ? 0.42 : 0.3) * halo * (0.55 + 0.45 * corona);
  g0.addColorStop(0, `rgb(255 196 96 / ${hA})`);
  g0.addColorStop(0.35, `rgb(246 150 30 / ${hA * 0.35})`);
  g0.addColorStop(1, "rgb(246 150 30 / 0)");
  ctx.fillStyle = g0;
  ctx.beginPath(); ctx.arc(sx, sy, haloR, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 2 · corona: filamentos que salen del borde
  ctx.save();
  ctx.globalCompositeOperation = fondo === "oscuro" ? "lighter" : "source-over";
  ctx.lineCap = "round";
  const rot = t * 0.012;
  for (const s of STREAMERS) {
    const a = s.a + rot;
    const breathe = 1 + 0.12 * Math.sin(t * 0.6 + s.ph);
    const L = Math.min(R * s.len * breathe * (0.55 + 0.75 * corona), lim - R);
    const x0 = sx + Math.cos(a) * R * 0.96, y0 = sy + Math.sin(a) * R * 0.96;
    const x1 = sx + Math.cos(a) * (R + L), y1 = sy + Math.sin(a) * (R + L);
    const gr = ctx.createLinearGradient(x0, y0, x1, y1);
    const al = s.al * corona * (fondo === "oscuro" ? 1.5 : 1.1);
    gr.addColorStop(0, fondo === "oscuro" ? `rgb(255 244 222 / ${al})` : `rgb(250 160 40 / ${al})`);
    gr.addColorStop(1, "rgb(255 200 120 / 0)");
    ctx.strokeStyle = gr; ctx.lineWidth = s.w * (R / 140);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  ctx.restore();

  // 3 · el disco del sol (dos capas girando despacio = superficie viva)
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(t * 0.02);
  ctx.drawImage(SUN, -R, -R, R * 2, R * 2);
  ctx.rotate(-t * 0.045);
  ctx.globalAlpha = 0.38;
  ctx.drawImage(SUN2, -R, -R, R * 2, R * 2);
  ctx.restore();
  // núcleo un poco más blanco
  ctx.save();
  const gc = ctx.createRadialGradient(sx - R * 0.15, sy - R * 0.18, 0, sx, sy, R);
  gc.addColorStop(0, "rgb(255 250 235 / 0.35)");
  gc.addColorStop(0.6, "rgb(255 230 180 / 0.06)");
  gc.addColorStop(1, "rgb(255 230 180 / 0)");
  ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 4 · la luna
  const lx = sx + mx * R, ly = sy + my * R;
  ctx.save();
  ctx.beginPath(); ctx.arc(lx, ly, R, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(MOON, lx - R, ly - R, R * 2, R * 2);
  // fase: iluminada hacia el sol, en sombra al otro lado
  const ux = d > 0.0001 ? -mx / d : 0, uy = d > 0.0001 ? -my / d : -1;
  const fase = ctx.createRadialGradient(lx + ux * R * 0.9, ly + uy * R * 0.9, R * 0.15, lx + ux * R * 0.3, ly + uy * R * 0.3, R * 2.1);
  fase.addColorStop(0, "rgb(11 18 54 / 0)");
  fase.addColorStop(0.45, "rgb(11 18 54 / 0.25)");
  fase.addColorStop(1, "rgb(7 11 36 / 0.92)");
  ctx.fillStyle = fase; ctx.fillRect(lx - R, ly - R, R * 2, R * 2);
  // a contraluz: cuanto más tapa al sol, más oscura (con un poco de luz de la Tierra)
  const sombra = smooth(2.1, 0.4, d);
  ctx.fillStyle = `rgb(9 12 34 / ${0.66 * sombra})`;
  ctx.fillRect(lx - R, ly - R, R * 2, R * 2);
  // luz cenicienta: la Tierra ilumina un poco la cara oscura y se siguen viendo los cráteres
  const tierra = ctx.createRadialGradient(lx - R * 0.25, ly - R * 0.3, 0, lx, ly, R * 1.05);
  tierra.addColorStop(0, `rgb(120 138 196 / ${0.24 * sombra})`);
  tierra.addColorStop(0.7, `rgb(80 96 150 / ${0.1 * sombra})`);
  tierra.addColorStop(1, "rgb(90 110 170 / 0)");
  ctx.fillStyle = tierra; ctx.fillRect(lx - R, ly - R, R * 2, R * 2);
  ctx.restore();

  // 5a · el anillo de la corona: en el total, la luz que asoma alrededor de la luna
  if (tapa > 0.35) {
    const k = smooth(0.35, 0.98, tapa);
    ctx.save();
    ctx.globalCompositeOperation = fondo === "oscuro" ? "lighter" : "source-over";
    const ringR = Math.max(R * 1.05, Math.min(R * 1.75, lim - Math.hypot(mx, my) * R));
    const ring = ctx.createRadialGradient(lx, ly, R * 0.98, lx, ly, ringR);
    if (fondo === "oscuro") {
      ring.addColorStop(0, `rgb(255 246 226 / ${0.75 * k})`);
      ring.addColorStop(0.12, `rgb(255 214 150 / ${0.42 * k})`);
      ring.addColorStop(0.45, `rgb(246 162 26 / ${0.14 * k})`);
    } else {
      ring.addColorStop(0, `rgb(255 214 120 / ${0.95 * k})`);
      ring.addColorStop(0.1, `rgb(246 162 26 / ${0.6 * k})`);
      ring.addColorStop(0.42, `rgb(232 120 10 / ${0.16 * k})`);
    }
    ring.addColorStop(1, "rgb(246 162 26 / 0)");
    ctx.fillStyle = ring;
    ctx.beginPath(); ctx.arc(lx, ly, ringR, 0, Math.PI * 2); ctx.arc(lx, ly, R * 0.99, 0, Math.PI * 2, true); ctx.fill("evenodd");
    // filamentos largos de la corona, solo en el total
    ctx.lineCap = "round";
    for (const s of STREAMERS) {
      if (s.len < 0.5) continue;
      const a = s.a + t * 0.012;
      const x0 = lx + Math.cos(a) * R, y0 = ly + Math.sin(a) * R;
      const L = Math.min(R * s.len * 1.15 * k, lim - R - Math.hypot(mx, my) * R);
      const x1 = lx + Math.cos(a) * (R + L), y1 = ly + Math.sin(a) * (R + L);
      const gr = ctx.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, fondo === "oscuro" ? `rgb(255 244 222 / ${0.5 * k})` : `rgb(236 140 20 / ${0.55 * k})`);
      gr.addColorStop(1, "rgb(246 162 26 / 0)");
      ctx.strokeStyle = gr; ctx.lineWidth = s.w * 1.4 * (R / 140);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.restore();
  }

  // 5b · borde de la luna encendido por el sol que tiene detrás
  if (tapa > 0.05) {
    ctx.save();
    ctx.globalCompositeOperation = fondo === "oscuro" ? "lighter" : "source-over";
    ctx.strokeStyle = `rgb(255 236 200 / ${0.55 * tapa * (0.4 + 0.6 * total)})`;
    ctx.lineWidth = Math.max(1, R * 0.018);
    ctx.beginPath(); ctx.arc(lx, ly, R * 1.005, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  // 6 · anillo de diamante: el último punto de sol antes del total
  const anillo = smooth(0.32, 0.12, d) * smooth(0.012, 0.06, d);
  if (anillo > 0.01) {
    const bx = sx + (d > 0.0001 ? -mx / d : 0) * R, by = sy + (d > 0.0001 ? -my / d : -1) * R;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const gb = ctx.createRadialGradient(bx, by, 0, bx, by, R * 0.55);
    gb.addColorStop(0, `rgb(255 255 255 / ${anillo})`);
    gb.addColorStop(0.12, `rgb(255 244 214 / ${0.8 * anillo})`);
    gb.addColorStop(0.45, `rgb(255 200 120 / ${0.22 * anillo})`);
    gb.addColorStop(1, "rgb(255 200 120 / 0)");
    ctx.fillStyle = gb; ctx.beginPath(); ctx.arc(bx, by, R * 0.55, 0, Math.PI * 2); ctx.fill();
    // destellos en cruz
    ctx.strokeStyle = `rgb(255 250 235 / ${0.7 * anillo})`;
    ctx.lineWidth = Math.max(1, R * 0.012);
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      ctx.beginPath(); ctx.moveTo(bx - dx * R * 0.5, by - dy * R * 0.5); ctx.lineTo(bx + dx * R * 0.5, by + dy * R * 0.5); ctx.stroke();
    }
    ctx.restore();
  }
}

/* ── un lienzo que se ajusta solo a su tamaño en pantalla ── */
export function lienzo(canvas, maxRatio = 2) {
  const ctx = canvas.getContext("2d");
  const st = { ctx, w: 0, h: 0 };
  const size = () => {
    const r = Math.min(devicePixelRatio || 1, maxRatio);
    st.w = canvas.clientWidth; st.h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(st.w * r)); canvas.height = Math.max(1, Math.round(st.h * r));
    ctx.setTransform(r, 0, 0, r, 0, 0);
    st.onSize?.();
  };
  new ResizeObserver(size).observe(canvas);
  size();
  return st;
}

/* ── las ilustraciones de la historia ─────────────────────── */
export function estrellas(ctx, w, h, seed = 1, n = 90) {
  for (let i = 0; i < n; i++) {
    const x = hash(i, 1, seed) * w, y = hash(i, 2, seed) * h;
    const r = 0.4 + hash(i, 3, seed) * 1.1;
    ctx.fillStyle = `rgb(201 204 216 / ${0.2 + hash(i, 4, seed) * 0.55})`;
    ctx.fillRect(x, y, r, r);
  }
}

export function arteSVG(tipo) {
  if (DIBUJOS[tipo]) return DIBUJOS[tipo]();
  if (tipo === "flores") {
    const cols = [["#f4a7c0", "#e0789b"], ["#fbf7ee", "#d9ccb0"], ["#ffd27a", "#f6a21a"], ["#e3344f", "#a80d26"], ["#fbf7ee", "#9fc6e8"]];
    const dias = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    const flor = (x, [a, b], i) => {
      const pet = Array.from({ length: 6 }, (_, k) => `<ellipse cx="0" cy="-15" rx="8.5" ry="15" fill="${a}" stroke="${b}" stroke-width="1" transform="rotate(${k * 60 + i * 9})"/>`).join("");
      return `<g transform="translate(${x} 118) scale(1.45)">
        <path d="M0 22 C -4 60, 4 90, 0 128" stroke="#4f7a52" stroke-width="2.4" fill="none"/>
        <path d="M0 78 C 12 66, 24 68, 30 72 C 20 80, 10 82, 0 80Z" fill="#5e8c60"/>
        <g>${pet}<circle r="7" fill="${i === 3 ? "#ffd27a" : "#f6a21a"}"/></g>
        <text y="152" text-anchor="middle" font-family="Caveat, cursive" font-size="21" fill="#c9ccd8">${dias[i]}</text></g>`;
    };
    return `<svg viewBox="0 0 710 463" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${cols.map((c, i) => flor(95 + i * 130, c, i)).join("")}</svg>`;
  }
  if (tipo === "cartas") {
    const carta = (i) => {
      const r = -24 + i * 12;
      const suit = i % 2 ? "♥" : "♦";
      return `<g transform="translate(355 300) rotate(${r}) translate(-62 -190)">
        <rect width="124" height="176" rx="10" fill="#fcf9f1" stroke="#d9ccb0"/>
        <text x="14" y="30" font-family="Playfair Display, serif" font-weight="700" font-size="22" fill="#c8102e">${i === 4 ? "A" : 52 - i}</text>
        <text x="62" y="108" text-anchor="middle" font-size="46" fill="#c8102e">${suit}</text></g>`;
    };
    return `<svg viewBox="0 0 710 463" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${[0, 1, 2, 3, 4].map(carta).join("")}</svg>`;
  }
  if (tipo === "corazon") {
    const pts = [];
    for (let k = 0; k < 46; k++) {
      const t = (k / 46) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3, y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      pts.push([355 + x * 9.5, 220 - y * 9.5]);
    }
    const star = ([x, y], i) => {
      const s = 3 + (i % 4);
      return `<path d="M${x} ${y - s}L${x + s * 0.28} ${y - s * 0.28}L${x + s} ${y}L${x + s * 0.28} ${y + s * 0.28}L${x} ${y + s}L${x - s * 0.28} ${y + s * 0.28}L${x - s} ${y}L${x - s * 0.28} ${y - s * 0.28}Z" fill="${i % 5 ? "#ffd27a" : "#ffffff"}"/>`;
    };
    return `<svg viewBox="0 0 710 463" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${pts.map(star).join("")}
      <text x="355" y="232" text-anchor="middle" font-family="Caveat, cursive" font-size="40" fill="#fcf9f1">te amo</text></svg>`;
  }
  return "";
}
