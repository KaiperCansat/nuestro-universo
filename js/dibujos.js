// ─────────────────────────────────────────────────────────────
//  LOS DIBUJOS de la historia: pequeñas ilustraciones de línea
//  (dorado, crema y rojo vichy sobre la noche) para los momentos
//  de los que no hay foto. Todas en un lienzo de 710 × 463.
// ─────────────────────────────────────────────────────────────
const G = "#ffd27a", A = "#f6a21a", C = "#fcf9f1", R = "#c8102e", M = "#c9ccd8", N = "#232c63", K = "#17152a";
const hand = (x, y, t, size = 30, fill = M, anchor = "middle") =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Caveat, cursive" font-size="${size}" fill="${fill}">${t}</text>`;
const star = (x, y, s, fill = G) =>
  `<path d="M${x} ${y - s}L${x + s * 0.28} ${y - s * 0.28}L${x + s} ${y}L${x + s * 0.28} ${y + s * 0.28}L${x} ${y + s}L${x - s * 0.28} ${y + s * 0.28}L${x - s} ${y}L${x - s * 0.28} ${y - s * 0.28}Z" fill="${fill}"/>`;
const heart = (x, y, s, fill = R) =>
  `<path d="M${x} ${y + s * 0.9}C${x - s * 1.6} ${y - s * 0.2} ${x - s * 0.9} ${y - s * 1.5} ${x} ${y - s * 0.55}C${x + s * 0.9} ${y - s * 1.5} ${x + s * 1.6} ${y - s * 0.2} ${x} ${y + s * 0.9}Z" fill="${fill}"/>`;
const svg = (body) => `<svg viewBox="0 0 710 463" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const sparkles = (pts) => pts.map(([x, y, s]) => star(x, y, s, s > 6 ? G : C)).join("");

export const DIBUJOS = {
  chat: () => svg(`
    <rect x="140" y="120" width="250" height="88" rx="30" fill="${N}" stroke="${M}" stroke-width="3"/>
    <path d="M178 206 L162 236 L206 208" fill="${N}" stroke="${M}" stroke-width="3"/>
    ${hand(265, 177, "holii", 46, C)}
    <rect x="330" y="236" width="250" height="88" rx="30" fill="${A}" stroke="${G}" stroke-width="3"/>
    <path d="M540 322 L556 352 L512 324" fill="${A}" stroke="${G}" stroke-width="3"/>
    ${hand(455, 294, "holii", 46, K)}
    ${heart(610, 150, 16)}${heart(108, 300, 11, A)}${sparkles([[640, 260, 7], [90, 120, 5], [560, 90, 5]])}`),

  llamada: () => svg(`
    <rect x="285" y="70" width="140" height="290" rx="26" fill="${N}" stroke="${C}" stroke-width="4"/>
    <rect x="300" y="100" width="110" height="220" rx="10" fill="#0b1236"/>
    <circle cx="355" cy="340" r="9" stroke="${C}" stroke-width="3"/>
    ${heart(355, 200, 26)}
    ${[60, 95, 130].map((r) => `<path d="M${445 + r * 0.2} ${215 - r * 0.7} A ${r} ${r} 0 0 1 ${445 + r * 0.2} ${215 + r * 0.7}" stroke="${G}" stroke-width="4"/>`).join("")}
    ${[60, 95, 130].map((r) => `<path d="M${265 - r * 0.2} ${215 - r * 0.7} A ${r} ${r} 0 0 0 ${265 - r * 0.2} ${215 + r * 0.7}" stroke="${G}" stroke-width="4"/>`).join("")}
    ${hand(355, 402, "eres la excepción", 34, C)}`),

  sushi: () => svg(`
    ${[200, 355, 510].map((x, i) => `
      <circle cx="${x}" cy="220" r="72" fill="${K}" stroke="${C}" stroke-width="4"/>
      <circle cx="${x}" cy="220" r="52" fill="${C}"/>
      <circle cx="${x}" cy="220" r="26" fill="${K}"/>
      <circle cx="${x}" cy="220" r="18" fill="none" stroke="${C}" stroke-width="2" stroke-dasharray="3 5"/>`).join("")}
    <path d="M120 360 L600 330" stroke="${G}" stroke-width="7"/><path d="M130 382 L610 346" stroke="${A}" stroke-width="7"/>
    ${hand(330, 420, "sushi de oreo", 34, C)}`),

  disco: () => {
    // el CD: mitad roja con «MA» en letras blancas, mitad oscura con telaraña
    const cx = 355, cy = 225, Rr = 168;
    const spokes = Array.from({ length: 9 }, (_, i) => -Math.PI / 2 + (i * Math.PI) / 8);
    const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const radios = spokes.map((a) => { const [x, y] = pt(Rr + 4, a); return `M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ");
    const hilos = [34, 56, 80, 106, 134, 164].map((r) => spokes.slice(0, -1).map((a, i) => {
      const b = spokes[i + 1], m = (a + b) / 2;
      const [x1, y1] = pt(r, a), [x2, y2] = pt(r, b), [qx, qy] = pt(r * 0.8, m);
      return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }).join(" ")).join(" ");
    return svg(`
      <defs><clipPath id="cdDer"><path d="M${cx} ${cy - Rr} A${Rr} ${Rr} 0 0 1 ${cx} ${cy + Rr} Z"/></clipPath></defs>
      <circle cx="${cx}" cy="${cy}" r="${Rr}" fill="#a3222b"/>
      <path d="M${cx} ${cy - Rr} A${Rr} ${Rr} 0 0 1 ${cx} ${cy + Rr} Z" fill="#6e121c"/>
      <g clip-path="url(#cdDer)"><path d="${radios} ${hilos}" stroke="${K}" stroke-width="3.2"/></g>
      <path d="M${cx} ${cy - Rr} V${cy + Rr}" stroke="#55101a" stroke-width="2"/>
      <path d="M${cx - 150} ${cy - 40} A150 150 0 0 1 ${cx - 60} ${cy - 138}" stroke="${C}" stroke-width="5" opacity="0.14"/>
      <g transform="rotate(-2 270 225)" stroke="${K}" stroke-width="3.5" fill="${C}">
        <path d="M214 282 L217 168 H239 L253 216 L267 168 H289 L287 282 H269 L270 212 L257 250 H247 L234 212 L233 282 Z"/>
        <path fill-rule="evenodd" d="M290 282 L310 168 H331 L350 282 H331 L327 258 H312 L308 282 Z M314 238 H325 L319.5 200 Z"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="${Rr}" stroke="#55101a" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="21" fill="${C}" stroke="#55101a" stroke-width="3"/>
      ${sparkles([[600, 90, 7], [110, 360, 5], [620, 380, 4]])}`);
  },

  unas: () => {
    // las cinco uñas tal y como las pintaste: estrellas, espiral, estrella ninja, ola y azul marino
    const AM = "#f8e38c", AZ = "#2733a0", CI = "#7cc6e6";
    const star5 = (x, y, r, fill) => {
      const d = Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r; return `${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`; });
      return `<path d="M${d.join(" L")}Z" fill="${fill}"/>`;
    };
    const espiral = Array.from({ length: 60 }, (_, k) => { const t = (k / 59) * 3.1 * Math.PI, r = 1.5 + 2.1 * t; return `${(r * Math.cos(t)).toFixed(1)} ${(-6 + r * Math.sin(t)).toFixed(1)}`; });
    const unas = [
      { fill: AM, w: 92, deco: `${star5(-12, -22, 15, A)}${star5(14, 2, 9, AZ)}` },
      { fill: C, w: 74, deco: `<path d="M${espiral.join(" L")}" stroke="${CI}" stroke-width="4.5"/>` },
      { fill: "#e6f2fb", w: 76, deco: star(0, -6, 24, AZ) },
      { fill: AM, w: 72, deco: `<path d="M-40 6 C -22 -12, -6 24, 12 6 C 22 -4, 32 2, 40 -2 V70 H-40 Z" fill="${A}"/>` },
      { fill: AZ, w: 62, deco: `<path d="M-14 -50 C -20 -30, -20 0, -16 20" stroke="${C}" stroke-width="4" opacity="0.35"/>` },
    ];
    const xs = [150, 255, 355, 455, 548];
    const dedos = unas.map((u, i) => {
      const h = 132, hw = u.w / 2, fw = hw + 15;
      return `<g transform="translate(${xs[i]} ${190 + Math.abs(2 - i) * 16})">
        <clipPath id="una${i}"><rect x="${-hw}" y="-72" width="${u.w}" height="${h}" rx="${hw * 0.8}"/></clipPath>
        <path d="M${-fw} 150 V-30 C${-fw} -104 ${fw} -104 ${fw} -30 V150" stroke="${M}" stroke-width="3"/>
        <rect x="${-hw}" y="-72" width="${u.w}" height="${h}" rx="${hw * 0.8}" fill="${u.fill}"/>
        <g clip-path="url(#una${i})">${u.deco}</g>
        <rect x="${-hw}" y="-72" width="${u.w}" height="${h}" rx="${hw * 0.8}" stroke="${C}" stroke-width="3"/>
      </g>`;
    }).join("");
    return svg(`${dedos}${hand(355, 420, "«lo disfruté. haría miles»", 34, C)}`);
  },

  escenario: () => svg(`
    <path d="M355 40 L230 400 L480 400 Z" fill="${G}" opacity="0.14"/>
    <path d="M40 40 H670" stroke="${R}" stroke-width="16"/>
    <path d="M40 40 C 90 160, 70 300, 120 410 L40 410 Z" fill="${R}"/><path d="M670 40 C 620 160, 640 300, 590 410 L670 410 Z" fill="${R}"/>
    ${[70, 95].map((x) => `<path d="M${x} 50 C ${x + 30} 170, ${x + 10} 300, ${x + 40} 400" stroke="#8f0a20" stroke-width="3"/>`).join("")}
    ${[640, 615].map((x) => `<path d="M${x} 50 C ${x - 30} 170, ${x - 10} 300, ${x - 40} 400" stroke="#8f0a20" stroke-width="3"/>`).join("")}
    <path d="M150 400 H560" stroke="${C}" stroke-width="4"/>
    ${star(355, 230, 30)}${hand(355, 305, "me ayudaste a sonreír", 34, C)}`),

  avion: () => svg(`
    <path d="M110 360 C 250 120, 460 100, 600 250" stroke="${C}" stroke-width="3" stroke-dasharray="4 14"/>
    <g transform="translate(470 150) rotate(18)"><path d="M-60 0 L60 -6 C 78 -6 78 6 60 6 L-60 0 Z" fill="${C}"/><path d="M0 -4 L-30 -50 L-12 -50 L22 -4 Z M0 4 L-30 50 L-12 50 L22 4 Z" fill="${G}"/><path d="M-55 -2 L-70 -24 L-60 -24 L-45 -2Z" fill="${G}"/></g>
    <circle cx="110" cy="360" r="8" fill="${A}"/>${hand(110, 405, "Tona", 34, C)}
    <circle cx="600" cy="250" r="8" fill="${A}"/>${hand(600, 300, "Italia", 34, C)}
    <rect x="270" y="300" width="170" height="80" rx="12" fill="${N}" stroke="${G}" stroke-width="3"/>
    <text x="355" y="356" text-anchor="middle" font-family="Courier Prime, monospace" font-weight="700" font-size="44" fill="${G}">05:00</text>`),

  birrete: () => svg(`
    <path d="M355 110 L590 190 L355 270 L120 190 Z" fill="${K}" stroke="${C}" stroke-width="4"/>
    <path d="M220 225 V310 C 280 350, 430 350, 490 310 V225" fill="${K}" stroke="${C}" stroke-width="4"/>
    <circle cx="355" cy="190" r="9" fill="${G}"/>
    <path d="M355 190 C 420 200, 480 215, 520 230 V330" stroke="${G}" stroke-width="5"/>
    <path d="M505 330 L535 330 L528 380 L512 380 Z" fill="${G}"/>
    ${hand(355, 402, "2026", 40, G)}${sparkles([[140, 110, 8], [600, 320, 6], [190, 360, 5]])}`),

  pluma: () => svg(`
    <path d="M470 70 C 560 60, 600 120, 520 190 C 470 235, 410 270, 330 330 L310 320 C 360 250, 400 190, 470 70 Z" fill="${C}" stroke="${G}" stroke-width="3"/>
    <path d="M318 326 L470 90" stroke="${G}" stroke-width="2"/>
    ${[120, 150, 180, 210].map((y) => `<path d="M${470 - (y - 70) * 0.5} ${y} L${500 - (y - 70) * 0.2} ${y - 12}" stroke="${M}" stroke-width="2"/>`).join("")}
    <path d="M320 330 L290 380" stroke="${C}" stroke-width="4"/>
    <path d="M150 395 C 210 375, 260 410, 300 385" stroke="${G}" stroke-width="3"/>
    <circle cx="200" cy="200" r="58" fill="${A}" stroke="${G}" stroke-width="4"/>
    <text x="200" y="218" text-anchor="middle" font-family="Playfair Display, serif" font-weight="900" font-size="46" fill="${K}">1º</text>
    <path d="M170 255 L150 320 L185 300 L200 330 L215 300 L250 320 L230 255" fill="${R}"/>
    ${hand(560, 400, "prosa", 40, C)}`),

  camiseta: () => {
    // la camiseta blanca: una M grande rellena de besos y besos sueltos alrededor
    const BES = "#b8323f";
    const beso = (x, y, s, rot, fill = BES) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <path d="M-1 0 C -0.75 -0.55 -0.3 -0.6 0 -0.28 C 0.3 -0.6 0.75 -0.55 1 0 C 0.7 0.62 -0.7 0.62 -1 0 Z" fill="${fill}"/>
      <path d="M-0.92 0.02 C -0.4 0.14 0.4 0.14 0.92 0.02" stroke="#f6d3d8" stroke-width="${0.09}"/></g>`;
    const patron = `<pattern id="besosM" width="34" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
      <rect width="34" height="26" fill="#f6d6da"/>${beso(9, 7, 13, -10)}${beso(26, 20, 13, 15)}${beso(27, 4, 8, 30, "#c43f4d")}${beso(8, 22, 7, -35, "#c43f4d")}</pattern>`;
    const sueltos = [[240, 165, 14, -15], [470, 128, 13, 20], [392, 148, 11, -30], [462, 300, 12, 8], [250, 292, 11, 70], [340, 372, 13, -25], [440, 382, 10, 12], [262, 392, 9, -8]];
    return svg(`<defs>${patron}</defs>
      <path d="M262 96 Q355 62 448 96" stroke="#c98a4a" stroke-width="9"/>
      <path d="M355 80 V58 C355 36 382 36 382 52" stroke="${M}" stroke-width="4"/>
      <path d="M270 80 L210 100 L130 170 L180 230 L225 200 V412 H485 V200 L530 230 L580 170 L500 100 L440 80 C 430 120, 280 120, 270 80 Z" fill="${C}" stroke="${M}" stroke-width="4"/>
      <text x="355" y="345" text-anchor="middle" font-family="Playfair Display, serif" font-weight="900" font-size="200" fill="url(#besosM)" stroke="${BES}" stroke-width="2">M</text>
      ${sueltos.map(([x, y, s, r]) => beso(x, y, s, r)).join("")}`);
  },

  sol: () => svg(`
    ${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<path d="M${355 + Math.cos(a) * 110} ${190 + Math.sin(a) * 110} L${355 + Math.cos(a) * 150} ${190 + Math.sin(a) * 150}" stroke="${G}" stroke-width="6"/>`; }).join("")}
    <circle cx="355" cy="190" r="88" fill="${A}" stroke="${G}" stroke-width="4"/>
    <path d="M60 400 C 200 380, 520 420, 660 395" stroke="${C}" stroke-width="3" stroke-dasharray="2 12"/>
    ${hand(600, 380, "→ Tona", 36, C)}`),

  estrellas: () => {
    const pts = [[120, 300], [210, 210], [300, 250], [390, 150], [480, 220], [560, 120], [620, 260]];
    return svg(`<path d="M${pts.map((p) => p.join(" ")).join(" L")}" stroke="${M}" stroke-width="2" stroke-dasharray="3 7"/>
      ${pts.map(([x, y], i) => star(x, y, i % 3 ? 10 : 16)).join("")}
      ${sparkles([[90, 120, 4], [330, 360, 4], [660, 390, 5], [450, 380, 3], [250, 90, 3]])}`);
  },

  feria: () => {
    const cab = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; const x = 355 + Math.cos(a) * 140, y = 200 + Math.sin(a) * 140; return `<path d="M355 200 L${x} ${y}" stroke="${M}" stroke-width="2"/><rect x="${x - 16}" y="${y}" width="32" height="26" rx="6" fill="${[R, A, G, C][i % 4]}"/>`; }).join("");
    return svg(`<circle cx="355" cy="200" r="140" stroke="${C}" stroke-width="4"/><circle cx="355" cy="200" r="100" stroke="${M}" stroke-width="2"/>${cab}
      <circle cx="355" cy="200" r="12" fill="${G}"/><path d="M355 200 L270 420 M355 200 L440 420" stroke="${C}" stroke-width="5"/>
      ${sparkles([[110, 90, 6], [600, 80, 8], [630, 330, 5]])}`);
  },

  bus: () => svg(`
    <rect x="150" y="150" width="410" height="180" rx="28" fill="${A}" stroke="${G}" stroke-width="4"/>
    ${[190, 270, 350, 430].map((x) => `<rect x="${x}" y="180" width="62" height="60" rx="8" fill="#0b1236"/>`).join("")}
    <rect x="505" y="180" width="38" height="120" rx="6" fill="#0b1236"/>
    <circle cx="240" cy="335" r="30" fill="${K}" stroke="${C}" stroke-width="4"/><circle cx="470" cy="335" r="30" fill="${K}" stroke="${C}" stroke-width="4"/>
    ${heart(381, 210, 13)}
    <path d="M60 380 H660" stroke="${M}" stroke-width="3" stroke-dasharray="20 14"/>
    ${hand(355, 402, "→ Vic", 38, C)}`),

  halloween: () => svg(`
    <circle cx="470" cy="160" r="100" fill="${G}"/><circle cx="510" cy="135" r="92" fill="#0b1236"/>
    ${[[200, 120, 1], [270, 180, 0.7], [150, 220, 0.6]].map(([x, y, s]) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0 C -20 -25, -45 -20, -60 -5 C -45 -8, -35 0, -30 10 C -20 0, -10 5, 0 15 C 10 5, 20 0, 30 10 C 35 0, 45 -8, 60 -5 C 45 -20, 20 -25, 0 0 Z" fill="${K}" stroke="${M}" stroke-width="2"/>`).join("")}
    <ellipse cx="300" cy="350" rx="80" ry="62" fill="${A}" stroke="#c46a00" stroke-width="3"/>
    <path d="M300 288 V270" stroke="#5e8c60" stroke-width="8"/>
    <path d="M265 335 L280 315 L295 335Z M305 335 L320 315 L335 335Z" fill="${K}"/><path d="M265 370 C 285 385, 315 385, 335 370" stroke="${K}" stroke-width="5"/>
    ${sparkles([[620, 330, 6], [110, 360, 5], [600, 60, 4]])}`),

  lista: () => svg(`
    <rect x="200" y="40" width="310" height="390" rx="6" fill="${C}" transform="rotate(-3 355 235)"/>
    <g transform="rotate(-3 355 235)">
      ${hand(355, 92, "10 cosas que odio sobre ti", 30, K)}
      ${Array.from({ length: 10 }, (_, i) => `<text x="230" y="${135 + i * 29}" font-family="Courier Prime, monospace" font-size="18" fill="${R}">${i + 1}.</text><path d="M262 ${130 + i * 29} H${300 + ((i * 53) % 180)}" stroke="#8f93a8" stroke-width="3"/>`).join("")}
    </g>
    ${heart(560, 380, 20)}`),

  piano: () => {
    const w = 46, x0 = 355 - w * 6;
    const white = Array.from({ length: 12 }, (_, i) => `<rect x="${x0 + i * w}" y="140" width="${w - 3}" height="200" rx="5" fill="${C}"/>`).join("");
    const black = [0, 1, 3, 4, 5, 7, 8, 10].map((i) => `<rect x="${x0 + i * w + w * 0.68}" y="140" width="${w * 0.6}" height="120" rx="4" fill="${K}"/>`).join("");
    return svg(`<rect x="${x0 - 16}" y="110" width="${w * 12 + 26}" height="250" rx="14" fill="${N}" stroke="${G}" stroke-width="3"/>${white}${black}
      <path d="M470 90 V40 L520 30 V80" stroke="${G}" stroke-width="5"/><circle cx="460" cy="92" r="12" fill="${G}"/><circle cx="510" cy="82" r="12" fill="${G}"/>
      ${hand(355, 402, "«ya te está saliendo súper bien»", 32, C)}`);
  },
  pergamino: () => svg(`
    <path d="M300 64 l12 -26 l14 18 l14 -24 l14 24 l14 -18 l12 26 Z" fill="${G}"/>
    <rect x="225" y="92" width="260" height="270" fill="${C}"/>
    <rect x="212" y="80" width="286" height="26" rx="13" fill="#e9dfca" stroke="${M}" stroke-width="2"/>
    <rect x="212" y="350" width="286" height="26" rx="13" fill="#e9dfca" stroke="${M}" stroke-width="2"/>
    ${hand(355, 150, "amor cortès", 38, K)}
    ${[180, 210, 240, 270, 300].map((y, i) => `<path d="M255 ${y} H${430 - ((i * 37) % 90)}" stroke="#8f93a8" stroke-width="3"/>`).join("")}
    <circle cx="440" cy="312" r="26" fill="${R}"/>${heart(440, 312, 10, C)}
    <path d="M560 70 C 600 110, 590 190, 520 250 L512 244 C 560 180, 570 120, 560 70 Z" fill="${C}" stroke="${G}" stroke-width="2"/>
    <path d="M516 248 L496 290" stroke="${C}" stroke-width="3"/>
    ${sparkles([[130, 120, 6], [600, 360, 5], [150, 330, 4]])}`),

  navidad: () => svg(`
    <path d="M355 120 L262 222 H448 Z M355 168 L240 286 H470 Z M355 226 L214 348 H496 Z" fill="#3f7a52" stroke="#5e9c6c" stroke-width="3"/>
    <rect x="340" y="348" width="30" height="34" fill="#8a5a2b"/>
    <path d="M285 214 C 330 236, 380 236, 425 212 M262 278 C 320 302, 390 302, 450 276 M238 340 C 310 364, 400 364, 474 338" stroke="${G}" stroke-width="3" stroke-dasharray="2 9"/>
    ${[[318, 196, R], [392, 200, C], [290, 262, G], [362, 270, R], [430, 258, C], [262, 326, C], [330, 334, G], [404, 330, R], [462, 322, G]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>`).join("")}
    ${star(355, 104, 26)}
    <rect x="150" y="320" width="64" height="58" fill="${R}"/><path d="M182 320 V378 M150 346 H214" stroke="${C}" stroke-width="6"/>
    <rect x="510" y="334" width="52" height="44" fill="${G}"/><path d="M536 334 V378" stroke="${R}" stroke-width="6"/>
    ${sparkles([[130, 110, 6], [590, 130, 7], [620, 260, 4], [100, 240, 4]])}
    ${hand(355, 418, "primera Navidad · primer año nuevo", 32, C)}`),

  girasol: () => {
    const petalos = Array.from({ length: 18 }, (_, i) => `<ellipse cx="355" cy="${180 - 78}" rx="17" ry="44" fill="${i % 2 ? G : A}" transform="rotate(${i * 20} 355 180)"/>`).join("");
    const pipas = Array.from({ length: 28 }, (_, i) => { const a = i * 2.4, r = 5 * Math.sqrt(i); return `<circle cx="${(355 + Math.cos(a) * r * 1.6).toFixed(1)}" cy="${(180 + Math.sin(a) * r * 1.6).toFixed(1)}" r="3" fill="#2e1b0c"/>`; }).join("");
    return svg(`
      <path d="M355 240 C 350 300, 362 340, 355 372" stroke="#5e9c6c" stroke-width="9"/>
      <path d="M357 318 C 400 290, 440 300, 452 318 C 420 334, 390 332, 357 318 Z" fill="#3f7a52"/>
      ${petalos}<circle cx="355" cy="180" r="50" fill="#5a3a1a"/>${pipas}
      ${heart(520, 120, 14)}${sparkles([[180, 110, 6], [560, 300, 5]])}
      ${hand(355, 412, "mi girasol favorito", 34, C)}`);
  },

  hijos: () => {
    const rayos = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${(270 + Math.cos(a) * 76).toFixed(1)} ${(170 + Math.sin(a) * 76).toFixed(1)} L${(270 + Math.cos(a) * 98).toFixed(1)} ${(170 + Math.sin(a) * 98).toFixed(1)}" stroke="${G}" stroke-width="6"/>`; }).join("");
    const nombres = [["Kai", 215, 296], ["Siena", 355, 312], ["Elio", 495, 296]];
    return svg(`
      ${rayos}<circle cx="270" cy="170" r="64" fill="${A}" stroke="${G}" stroke-width="4"/>
      <circle cx="445" cy="170" r="62" fill="${M}"/><circle cx="472" cy="152" r="56" fill="#0b1236"/>
      ${heart(357, 104, 13)}
      ${nombres.map(([n, x, y]) => `${star(x, y, 15)}${hand(x, y + 44, n, 32, C)}`).join("")}
      ${hand(355, 418, "y si salen gemelas: Sol y Luna", 32, G)}`);
  },

  cerezo: () => {
    const flor = (x, y, s) => Array.from({ length: 5 }, (_, i) => `<circle cx="${(x + Math.cos((i / 5) * Math.PI * 2) * s).toFixed(1)}" cy="${(y + Math.sin((i / 5) * Math.PI * 2) * s).toFixed(1)}" r="${s * 0.85}" fill="#f4a7c0"/>`).join("") + `<circle cx="${x}" cy="${y}" r="${s * 0.45}" fill="${R}"/>`;
    return svg(`
      ${Array.from({ length: 9 }, (_, i) => { const a = Math.PI + ((i + 0.5) / 9) * Math.PI; return `<path d="M${(355 + Math.cos(a) * 112).toFixed(1)} ${(320 + Math.sin(a) * 112).toFixed(1)} L${(355 + Math.cos(a) * 140).toFixed(1)} ${(320 + Math.sin(a) * 140).toFixed(1)}" stroke="${G}" stroke-width="5"/>`; }).join("")}
      <circle cx="355" cy="320" r="92" fill="${A}"/>
      <rect x="0" y="320" width="710" height="143" fill="#0b1236"/>
      <path d="M90 322 H620" stroke="${G}" stroke-width="3"/>
      ${[340, 356, 372].map((y, i) => `<path d="M${240 + i * 20} ${y} H${470 - i * 20}" stroke="${G}" stroke-width="2" opacity="${0.6 - i * 0.15}"/>`).join("")}
      <path d="M40 60 C 140 90, 220 80, 300 130 M150 82 C 170 120, 200 140, 230 150 M230 98 C 250 70, 280 60, 310 64" stroke="#7a4a2a" stroke-width="7"/>
      ${flor(300, 130, 12)}${flor(230, 150, 10)}${flor(310, 64, 11)}${flor(190, 86, 9)}${flor(120, 72, 8)}${flor(262, 108, 8)}
      ${hand(355, 412, "hora dorada", 36, C)}`);
  },

  web: () => svg(`
    <rect x="205" y="84" width="300" height="206" rx="12" fill="${N}" stroke="${C}" stroke-width="4"/>
    <rect x="222" y="100" width="266" height="172" rx="4" fill="#0b1236"/>
    <circle cx="340" cy="176" r="46" fill="${A}" opacity="0.25"/>
    <circle cx="340" cy="176" r="34" fill="${A}"/><circle cx="364" cy="170" r="32" fill="${K}" stroke="${M}" stroke-width="2"/>
    ${hand(355, 252, "nuestro universo", 24, C)}
    ${sparkles([[250, 120, 4], [460, 130, 5], [450, 240, 3]])}
    <path d="M170 300 H540 L566 324 H144 Z" fill="${M}"/>
    <text x="600" y="130" text-anchor="middle" font-family="Courier Prime, monospace" font-weight="700" font-size="34" fill="${G}">04:30</text>
    <circle cx="600" cy="74" r="18" fill="${M}"/><circle cx="610" cy="66" r="16" fill="#0b1236"/>
    ${hand(355, 392, "para verla en el ordenador, con calma", 30, C)}`),
  musica: () => {
    const rayos = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${(355 + Math.cos(a) * 46).toFixed(1)} ${(205 + Math.sin(a) * 46).toFixed(1)} L${(355 + Math.cos(a) * 70).toFixed(1)} ${(205 + Math.sin(a) * 70).toFixed(1)}" stroke="${G}" stroke-width="5"/>`; }).join("");
    const nota = (x, y, c) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="14" transform="rotate(-20 ${x} ${y})" fill="${c}"/><path d="M${x + 18} ${y - 4} V${y - 110}" stroke="${c}" stroke-width="5"/>`;
    return svg(`
      ${[150, 170, 190, 210, 230].map((y) => `<path d="M90 ${y + 40} H620" stroke="${M}" stroke-width="1.5" opacity="0.35"/>`).join("")}
      ${rayos}<circle cx="355" cy="205" r="34" fill="${A}"/>
      ${nota(170, 300, A)}${nota(225, 285, A)}<path d="M188 190 L243 175" stroke="${A}" stroke-width="9"/>
      ${nota(480, 290, M)}${nota(535, 275, M)}<path d="M498 180 L553 165" stroke="${M}" stroke-width="9"/>
      ${hand(355, 405, "a dos voces", 36, C)}`);
  },

  continuara: () => {
    const pts = [[90, 360], [160, 330], [225, 300], [285, 262], [340, 230], [395, 200], [450, 168], [505, 140], [560, 116], [615, 96]];
    const hoy = 4;
    return svg(`
      <path d="M${pts.map((p) => p.join(" ")).join(" L")}" stroke="${M}" stroke-width="2" stroke-dasharray="3 8"/>
      ${pts.map(([x, y], i) => i <= hoy ? `<circle cx="${x}" cy="${y}" r="9" fill="${G}"/>` : `<circle cx="${x}" cy="${y}" r="${9 - (i - hoy)}" stroke="${C}" stroke-width="2" opacity="${(1 - (i - hoy) * 0.15).toFixed(2)}"/>`).join("")}
      <circle cx="322" cy="190" r="22" fill="${A}"/><circle cx="360" cy="186" r="20" fill="${M}"/><circle cx="368" cy="180" r="17" fill="#0b1236"/>
      ${sparkles([[600, 50, 7], [660, 150, 5], [540, 60, 4], [140, 120, 4]])}
      ${hand(355, 412, "continuará…", 42, G)}`);
  },
};
