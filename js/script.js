'use strict';

/* =======================
   Configuración
   ======================= */
const SHEET_ID = '1A2qHdYFzmOcLU4-xqKwREIbchy-H3CRWzin_Ht2GV9k';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
const BLOG_URL = 'https://blog.juanmasierragarcia.eu/';
const BLOG_API_URL = `${BLOG_URL}wp-json/wp/v2/posts?per_page=3&_embed`;
const FETCH_TIMEOUT_MS = 10000;
const PAGE_SIZE = 10;
const EXCERPT_LENGTH = 120;

/* =======================
   Almacenamiento seguro
   (localStorage lanza una excepción si el navegador bloquea las cookies del sitio;
   sin esto el script entero se detenía)
   ======================= */
const storage = {
  get(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* sin persistencia */ }
  }
};

/* =======================
   Textos multilengua
   data-i18n="clave"          -> textContent
   data-i18n-html="clave"     -> innerHTML (solo textos propios de este fichero)
   data-i18n-attr="attr:clave;attr2:clave2" -> atributos
   ======================= */
const I18N = {
  es: {
    docTitle: 'JuanMa Sierra García - Ingeniero Informático + Biólogo',
    dateLocale: 'es-ES',
    jobTitle: 'Ingeniero Informático Superior & Biólogo',
    navLabel: 'Navegación principal',
    navHome: 'Bio',
    navExp: 'Mi Experiencia',
    navBlog: 'Blog',
    navContact: 'Contacto',
    themeLabel: 'Modo oscuro',
    langBtn: 'English',
    langBtnLang: 'en',
    socialLabel: 'Redes sociales',
    hello: '¡Hola, soy JuanMa Sierra García!',
    p1: 'Bueno, como habrás adivinado, me llamo JuanMa Sierra García, alias juanmgar. Soy de Cádiz, pero vivo en <s>Granada, Málaga, Córdoba, Ciudad Real, Madrid, Gijón, Oporto</s> Oviedo, Asturias. Me encanta la música de Los Planetas y acumulo estanterías de libros leídos y por leer.',
    p2: 'Si has llegado hasta aquí, quizá te interese saber que estudié Biología y Biotecnología. Tras mi etapa como desarrollador DevOps y Full-Stack, me he graduado como Ingeniero Informático Superior. En los últimos meses me he volcado en la operacionalización y el estudio del discurso <em>fringe</em> en redes sociales. De hecho, puedes consultar mi Trabajo Fin de Máster sobre el tema <a href="https://digibuo.uniovi.es/dspace/handle/10651/85090" target="_blank" rel="noopener">justo aquí</a>.',
    p3: 'Si quieres saber más sobre mí o mis proyectos actuales, te animo a contactarme a través del formulario o por cualquiera de mis redes sociales.',
    photoAlt: 'Fotografía de JuanMa Sierra García, alias juanmgar',
    secPath: 'Mi Trayectoria',
    tablistLabel: 'Categorías del currículum',
    catDegrees: 'Títulos Oficiales',
    catLanguages: 'Idiomas',
    catCS: 'Informática',
    catScience: 'Ciencias',
    catOther: 'Otros',
    cvLoading: 'Cargando datos...',
    cvError: 'No se ha podido cargar el currículum.',
    retry: 'Reintentar',
    noEntries: 'Sin entradas',
    prev: 'Anterior',
    next: 'Siguiente',
    pageInfo: (page, total) => `Página ${page} de ${total}`,
    secBlog: 'Últimos artículos en mi blog',
    blogSubtitle: `Reflexiones desde <a href="${BLOG_URL}" target="_blank" rel="noopener">La sinceridad está mal vista</a>`,
    blogLoading: 'Cargando artículos...',
    blogError: 'No se han podido cargar los artículos.',
    blogErrorLink: 'Visita el blog directamente',
    blogEmpty: 'Todavía no hay artículos publicados.',
    btnMoreBlog: 'Leer más en el blog',
    secContact: 'Hablemos',
    labelName: 'Nombre',
    labelEmail: 'Correo Electrónico',
    labelMsg: 'Mensaje',
    btnSubmit: 'Enviar Mensaje'
  },
  en: {
    docTitle: 'JuanMa Sierra García - Computer Engineer + Biologist',
    dateLocale: 'en-US',
    jobTitle: 'Computer Engineer & Biologist',
    navLabel: 'Main navigation',
    navHome: 'Bio',
    navExp: 'My Experience',
    navBlog: 'Blog',
    navContact: 'Contact',
    themeLabel: 'Dark mode',
    langBtn: 'Español',
    langBtnLang: 'es',
    socialLabel: 'Social profiles',
    hello: "Hello, I'm JuanMa Sierra García!",
    p1: "Well, as you might guess, my name is JuanMa Sierra Garcia, aka juanmgar. I'm from Cadiz, but I live in <s>Granada, Malaga, Cordoba, Ciudad Real, Madrid, Gijon, Porto</s> Oviedo, Asturias. I love the music of Los Planetas and I accumulate shelves of books read and to be read.",
    p2: 'If you have come this far you may be interested to know that I studied Biology and Biotechnology. After my time working as a DevOps and Full-Stack developer, I have graduated as a Computer Engineer. Recently, my main interest lies in the operationalization and study of fringe discourse on social networks. You can check out my Master\'s Thesis on the subject <a href="https://digibuo.uniovi.es/dspace/handle/10651/85090" target="_blank" rel="noopener">right here</a>.',
    p3: 'If you want to know more about me or my current projects, I encourage you to contact me through the form below or any of my social networks.',
    photoAlt: 'Photo of JuanMa Sierra García, aka juanmgar',
    secPath: 'My Path',
    tablistLabel: 'CV categories',
    catDegrees: 'Official Degrees',
    catLanguages: 'Languages',
    catCS: 'Computer Science',
    catScience: 'Science',
    catOther: 'Other',
    cvLoading: 'Loading data...',
    cvError: "The CV couldn't be loaded.",
    retry: 'Try again',
    noEntries: 'No entries',
    prev: 'Previous',
    next: 'Next',
    pageInfo: (page, total) => `Page ${page} of ${total}`,
    secBlog: 'Latest posts on my blog',
    blogSubtitle: `Reflections from <a href="${BLOG_URL}" target="_blank" rel="noopener">La sinceridad está mal vista</a>`,
    blogLoading: 'Loading posts...',
    blogError: "The posts couldn't be loaded.",
    blogErrorLink: 'Visit the blog directly',
    blogEmpty: 'No posts published yet.',
    btnMoreBlog: 'Read more on the blog',
    secContact: "Let's Talk",
    labelName: 'Name',
    labelEmail: 'Email',
    labelMsg: 'Message',
    btnSubmit: 'Send Message'
  }
};

/* =======================
   Utilidades
   ======================= */
async function fetchWithTimeout(url, read, ms = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    return await read(res);
  } finally {
    clearTimeout(timer);
  }
}

function createSpinner() {
  const el = document.createElement('span');
  el.className = 'spinner';
  el.setAttribute('aria-hidden', 'true');
  return el;
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// Convierte HTML de WordPress en texto plano sin ejecutar nada (DOMParser crea un documento inerte)
function htmlToText(html = '') {
  return new DOMParser()
    .parseFromString(html, 'text/html')
    .body.textContent.replace(/\s+/g, ' ')
    .trim();
}

// Solo admite enlaces http(s); cualquier otra cosa se sustituye por el valor de reserva
function safeUrl(url, fallback) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

/* =======================
   Altura de la cabecera
   (sustituye los paddings fijos: la cabecera cambia de alto según idioma y ancho)
   ======================= */
const root = document.documentElement;
const header = document.querySelector('.top-nav');

function updateHeaderHeight() {
  if (header) root.style.setProperty('--header-h', `${header.offsetHeight}px`);
}

if (header && 'ResizeObserver' in window) {
  new ResizeObserver(updateHeaderHeight).observe(header);
} else {
  window.addEventListener('resize', updateHeaderHeight);
}
updateHeaderHeight();

/* =======================
   Modo Oscuro
   (la clase inicial ya la pone el script del <head>)
   ======================= */
const themeBtn = document.getElementById('toggle-theme');
const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function applyTheme(isDark) {
  root.classList.toggle('dark-mode', isDark);
  themeBtn?.setAttribute('aria-pressed', String(isDark));
}

applyTheme(root.classList.contains('dark-mode'));

themeBtn?.addEventListener('click', () => {
  const isDark = !root.classList.contains('dark-mode');
  applyTheme(isDark);
  storage.set('theme', isDark ? 'dark' : 'light');
});

// Si el usuario no ha elegido tema, sigue el del sistema en tiempo real
darkQuery?.addEventListener?.('change', (e) => {
  if (!storage.get('theme')) applyTheme(e.matches);
});

/* =======================
   Idioma
   ======================= */
function detectLanguage() {
  const saved = storage.get('lang');
  if (saved === 'es' || saved === 'en') return saved;
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  const match = preferred
    .map((lang) => lang.slice(0, 2).toLowerCase())
    .find((lang) => lang === 'es' || lang === 'en');
  return match || 'en';
}

let currentLang = detectLanguage();

function applyLanguage() {
  const t = I18N[currentLang];

  root.lang = currentLang;
  document.title = t.docTitle;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = t[el.dataset.i18n];
    if (typeof value === 'string') el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = t[el.dataset.i18nHtml];
    if (typeof value === 'string') el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && typeof t[key] === 'string') el.setAttribute(attr, t[key]);
    });
  });

  // Contenido dinámico
  renderCV();
  renderBlog();
}

document.getElementById('toggle-lang')?.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  storage.set('lang', currentLang);
  applyLanguage();
});

/* =======================
   Pestañas del CV (patrón ARIA tabs)
   ======================= */
const tablist = document.querySelector('.cv-index[role="tablist"]');
const tabs = tablist ? [...tablist.querySelectorAll('[role="tab"]')] : [];

function activateTab(tab, { focus = false, updateHash = false } = {}) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    if (panel) panel.hidden = !selected;
  });
  if (focus) tab.focus();
  if (updateHash) history.replaceState(null, '', `#${tab.getAttribute('aria-controls')}`);
}

function activateTabFromHash() {
  let id = '';
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const tab = tabs.find((t) => t.getAttribute('aria-controls') === id);
  if (!tab) return;
  activateTab(tab);
  document.getElementById('cv-section')?.scrollIntoView();
}

tablist?.addEventListener('click', (e) => {
  const tab = e.target.closest('[role="tab"]');
  if (tab) activateTab(tab, { updateHash: true });
});

tablist?.addEventListener('keydown', (e) => {
  const index = tabs.indexOf(document.activeElement);
  if (index === -1) return;
  let next;
  switch (e.key) {
    case 'ArrowRight': next = tabs[(index + 1) % tabs.length]; break;
    case 'ArrowLeft': next = tabs[(index - 1 + tabs.length) % tabs.length]; break;
    case 'Home': next = tabs[0]; break;
    case 'End': next = tabs[tabs.length - 1]; break;
    default: return;
  }
  e.preventDefault();
  activateTab(next, { focus: true, updateHash: true });
});

// Permite enlazar directamente a una categoría, p. ej. juanmasierragarcia.eu/#cs
window.addEventListener('hashchange', activateTabFromHash);

/* =======================
   CV (Google Sheets)
   ======================= */
const cv = { status: 'loading', groups: null, pages: {} };

// La respuesta de gviz es JSON envuelto en una llamada JS: se extrae entre la primera { y la última }
function parseGviz(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('Respuesta inesperada de Google Sheets');
  return JSON.parse(text.slice(start, end + 1));
}

function buildCVGroups(data) {
  const headers = data.table.cols.map((col) => (col.label || '').trim());
  const col = (name) => headers.indexOf(name);
  const idx = {
    es: col('Spanish'), en: col('English'), institution: col('Institution'), year: col('Year'),
    area: col('Area'), type: col('Type'), published: col('Published'), level: col('Level')
  };
  const cell = (row, i) => {
    const value = row?.c?.[i]?.v;
    return value === null || value === undefined ? '' : String(value).trim();
  };

  const groups = { degrees: [], languages: [], cs: [], science: [], misc: [] };

  for (const row of data.table.rows) {
    if (cell(row, idx.published).toLowerCase() !== 'yes') continue;

    const item = {
      es: cell(row, idx.es),
      en: cell(row, idx.en),
      institution: cell(row, idx.institution),
      year: cell(row, idx.year),
      level: cell(row, idx.level).toLowerCase()
    };
    const type = cell(row, idx.type).toLowerCase();
    const area = cell(row, idx.area).toLowerCase();

    if (type === 'degree') groups.degrees.push(item);
    else if (type === 'language skill') groups.languages.push(item);
    else if (area === 'computer science') groups.cs.push(item);
    else if (area === 'science') groups.science.push(item);
    else groups.misc.push(item);
  }

  const degreeLevelOrder = { master: 1, specialist: 2, bachelor: 3, cfgs: 4, school: 5 };
  groups.degrees.sort((a, b) => (degreeLevelOrder[a.level] ?? 99) - (degreeLevelOrder[b.level] ?? 99));

  return groups;
}

function createCVItem(item) {
  const li = document.createElement('li');
  li.append(createEl('span', 'cv-title', item[currentLang] || item.en || item.es));
  // Los espacios separan los datos al copiar el texto o leerlo con lector de pantalla
  if (item.institution) li.append(' ', createEl('span', 'cv-institution', item.institution));
  if (item.year) li.append(' ', createEl('span', 'cv-year', item.year));
  return li;
}

// Mensaje de carga o error dentro de la propia lista (así no se desplaza nada al terminar la carga)
function createCVStatusItem() {
  const t = I18N[currentLang];
  const li = createEl('li', 'cv-status');
  if (cv.status === 'loading') {
    li.append(createSpinner(), t.cvLoading);
  } else {
    const retryBtn = createEl('button', 'btn', t.retry);
    retryBtn.type = 'button';
    retryBtn.addEventListener('click', loadCV);
    li.append(t.cvError, retryBtn);
  }
  return li;
}

function renderCV() {
  const t = I18N[currentLang];
  document.querySelector('.cv-grid')?.setAttribute('aria-busy', String(cv.status === 'loading'));

  document.querySelectorAll('.cv-card[data-category]').forEach((panel) => {
    const key = panel.dataset.category;
    const list = panel.querySelector('.cv-list');
    const pager = panel.querySelector('.pager');
    if (!list) return;

    if (cv.status !== 'ready') {
      list.replaceChildren(createCVStatusItem());
      if (pager) pager.hidden = true;
      return;
    }

    const items = cv.groups[key] || [];
    const pageCount = pager ? Math.max(1, Math.ceil(items.length / PAGE_SIZE)) : 1;
    const page = Math.min(Math.max(cv.pages[key] || 0, 0), pageCount - 1);
    cv.pages[key] = page;

    if (items.length === 0) {
      list.replaceChildren(createEl('li', 'cv-empty', t.noEntries));
    } else {
      const visible = pager ? items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) : items;
      list.replaceChildren(...visible.map(createCVItem));
    }

    if (pager) {
      pager.hidden = pageCount <= 1;
      pager.querySelector('.page-info').textContent = t.pageInfo(page + 1, pageCount);
      pager.querySelector('[data-page="prev"]').disabled = page === 0;
      pager.querySelector('[data-page="next"]').disabled = page >= pageCount - 1;
    }
  });
}

document.querySelector('.cv-grid')?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-page]');
  const panel = btn?.closest('.cv-card');
  if (!panel) return;

  const key = panel.dataset.category;
  cv.pages[key] = (cv.pages[key] || 0) + (btn.dataset.page === 'next' ? 1 : -1);
  renderCV();

  // Si el botón pulsado queda deshabilitado, el foco pasa al otro para no perderlo
  if (btn.disabled) {
    const other = panel.querySelector(`[data-page="${btn.dataset.page === 'next' ? 'prev' : 'next'}"]`);
    if (other && !other.disabled) other.focus();
  }
  // Si la lista nueva empieza por encima de la pantalla, se vuelve al inicio de la tarjeta
  if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView();
});

async function loadCV() {
  cv.status = 'loading';
  renderCV();
  try {
    const text = await fetchWithTimeout(SHEET_URL, (res) => res.text());
    cv.groups = buildCVGroups(parseGviz(text));
    cv.status = 'ready';
  } catch (err) {
    console.error('Error al cargar el CV:', err);
    cv.status = 'error';
  }
  renderCV();
}

/* =======================
   Blog (WP REST API)
   ======================= */
const blog = { status: 'loading', posts: [] };
const blogContainer = document.getElementById('blog-posts-container');

function makeExcerpt(html) {
  let text = htmlToText(html);
  // WordPress ya añade "[…]" cuando recorta: se quita para no duplicar los puntos suspensivos
  const alreadyCut = /\[(…|\.\.\.)\]$/.test(text);
  text = text.replace(/\s*\[(…|\.\.\.)\]$/, '');

  if (text.length > EXCERPT_LENGTH) {
    const cut = text.slice(0, EXCERPT_LENGTH);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > EXCERPT_LENGTH * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
  }
  return alreadyCut ? `${text}…` : text;
}

function createPostCard(post) {
  const t = I18N[currentLang];
  const article = createEl('article', 'blog-card');

  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = media?.media_details?.sizes?.medium_large?.source_url || media?.source_url;
  const imageSrc = imageUrl ? safeUrl(imageUrl, null) : null;
  if (imageSrc) {
    const img = createEl('img', 'blog-image');
    img.src = imageSrc;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    article.append(img);
  }

  const content = createEl('div', 'blog-content');

  const date = new Date(post.date);
  if (!Number.isNaN(date.getTime())) {
    const time = createEl('time', 'blog-date', date.toLocaleDateString(t.dateLocale, {
      year: 'numeric', month: 'long', day: 'numeric'
    }));
    time.dateTime = post.date;
    content.append(time);
  }

  const title = createEl('h3', 'blog-title');
  const link = createEl('a', '', htmlToText(post.title?.rendered));
  link.href = safeUrl(post.link, BLOG_URL);
  link.target = '_blank';
  link.rel = 'noopener';
  title.append(link);

  content.append(title, createEl('p', 'blog-excerpt', makeExcerpt(post.excerpt?.rendered)));
  article.append(content);
  return article;
}

function renderBlog() {
  if (!blogContainer) return;
  const t = I18N[currentLang];

  blogContainer.setAttribute('aria-busy', String(blog.status === 'loading'));

  if (blog.status === 'loading') {
    const status = createEl('p', 'blog-status');
    status.append(createSpinner(), t.blogLoading);
    blogContainer.replaceChildren(status);
  } else if (blog.status === 'error') {
    const status = createEl('p', 'blog-status', `${t.blogError} `);
    const link = createEl('a', '', t.blogErrorLink);
    link.href = BLOG_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    status.append(link);
    blogContainer.replaceChildren(status);
  } else if (blog.posts.length === 0) {
    blogContainer.replaceChildren(createEl('p', 'blog-status', t.blogEmpty));
  } else {
    blogContainer.replaceChildren(...blog.posts.map(createPostCard));
  }
}

async function loadBlog() {
  blog.status = 'loading';
  renderBlog();
  try {
    const posts = await fetchWithTimeout(BLOG_API_URL, (res) => res.json());
    if (!Array.isArray(posts)) throw new Error('Respuesta inesperada de WordPress');
    blog.posts = posts;
    blog.status = 'ready';
  } catch (err) {
    console.error('Error al cargar el blog:', err);
    blog.status = 'error';
  }
  renderBlog();
}

/* =======================
   Arranque
   (los textos se aplican siempre, aunque fallen las cargas externas)
   ======================= */
applyLanguage();
activateTabFromHash();
loadCV();
loadBlog();