# Nuestro universo · M & M

Un regalo para Marti. *Tú, mi sol. Yo, tu luna.*

## Las carpetas

```
nuestro-universo/
├── index.html      ← la página
├── .nojekyll       ← le dice a GitHub que no toque nada (déjalo)
├── css/
│   └── style.css   ← colores, letras y diseño
├── js/
│   ├── datos.js    ← ✏️ AQUÍ se cambian frases, fotos, fechas e historia
│   ├── cielo.js    ← el sol y la luna (dibujados a mano en canvas)
│   ├── dibujos.js  ← las ilustraciones de los momentos sin foto
│   └── main.js     ← las animaciones (no hace falta tocarlo)
└── fotos/          ← todas las fotos (jpg)
```

## Cómo publicarla en GitHub Pages

1. Entra en <https://github.com> y crea un repositorio nuevo (botón **New**).
   Ponle un nombre que no sea obvio, por ejemplo `nuestro-universo`, márcalo
   como **Public** y pulsa **Create repository**.
2. En el repositorio vacío, pulsa **uploading an existing file** y arrastra
   **lo que hay dentro** de esta carpeta (index.html, README.md, css, js y fotos),
   no la carpeta entera: `index.html` tiene que quedar arriba del todo.
   Pulsa **Commit changes**. (`.nojekyll` es un archivo oculto y el Finder no lo
   muestra; si no se sube, no pasa nada.)
3. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**; en
   *Branch* elige `main` y la carpeta `/ (root)`, y pulsa **Save**.
4. En uno o dos minutos la web estará en
   `https://TU-USUARIO.github.io/nuestro-universo/` (el enlace sale arriba en
   esa misma página de Settings → Pages).

Para cambiar algo después: abre el archivo en GitHub, pulsa el lápiz ✏️,
edita y **Commit changes**. La web se actualiza sola en un minuto.

> Ojo: GitHub Pages es **público** aunque el repositorio sea privado (y en la
> versión gratis el repositorio tiene que ser público). Cualquiera con el enlace
> puede verla. La página lleva `noindex` para que Google no la muestre, pero
> no es un candado. Comparte el enlace solo con ella.

## Cómo añadir más fotos

1. Copia la foto a `fotos/` (mejor `.jpg`, y si pesa mucho, redúcela a ~1400 px).
2. Abre `js/datos.js` y añade una línea en `FOTOS`:

```js
{ src: "fotos/mi-foto.jpg", fecha: "2026-11-11", texto: "lo que quieras escribir" },
```

Las fotos de antes del 29 de julio no venían en la exportación del chat; si las
tienes en la galería, añádelas así.

## Verla en tu ordenador antes de subirla

Abre una terminal en esta carpeta y ejecuta:

```
python3 -m http.server 8000
```

y entra en <http://localhost:8000>. (Abriendo el `index.html` con doble clic
no funciona, porque los navegadores bloquean los módulos de JavaScript en
archivos locales.)
