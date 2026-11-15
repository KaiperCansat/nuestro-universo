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

## Reseñas compartidas

GitHub Pages solo sirve archivos: no puede guardar lo que escribe la gente.
Sin configurar nada, cada reseña se queda solo en el móvil u ordenador de quien
la escribe. Para que todos vean las de todos, usa Supabase (gratis):

1. Entra en <https://supabase.com>, crea una cuenta y un proyecto nuevo
   (cualquier nombre y región, por ejemplo Europa).
2. En el proyecto, abre **SQL Editor**, pega esto y pulsa **Run**:

```sql
create table resenas (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 1 and 40),
  estrellas int not null check (estrellas between 1 and 5),
  texto text not null check (char_length(texto) between 1 and 500)
);
alter table resenas enable row level security;
create policy "todos leen" on resenas for select to anon using (true);
create policy "todos escriben" on resenas for insert to anon with check (true);
grant select, insert on resenas to anon;
```

3. Ve a **Project Settings → API** (o **API Keys**) y copia la **Project URL**
   y la clave **anon public** (o **publishable**).
4. En `js/datos.js`, al final, rellena:

```js
export const RESENAS_GUARDADO = {
  url: "https://TU-PROYECTO.supabase.co",
  clave: "la-clave-anon-o-publishable",
};
```

5. Sube `js/datos.js` a GitHub. Listo.

Esa clave está pensada para ir en páginas públicas: solo permite leer y añadir
reseñas, no borrarlas ni cambiarlas. Para borrar una (spam o algo feo), entra en
Supabase → **Table Editor → resenas**, selecciona la fila y bórrala.
Las reseñas de Martina están fijas en `js/datos.js` (`RESENAS`).
