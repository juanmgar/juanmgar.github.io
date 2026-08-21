/* =======================
   Datos hoja & estado
   ======================= */
const SHEET_ID = '1A2qHdYFzmOcLU4-xqKwREIbchy-H3CRWzin_Ht2GV9k';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let currentLang = "en";
let cvData = null; // Guardamos los datos para no recargar

/* =======================
   Textos multilengua
   ======================= */
const homepageTexts = {
  en: {
    hello: "Hello, I'm <span itemprop='givenName'>JuanMa</span> <span itemprop='familyName'>Sierra García</span>!",
    jobTitle: "Dev + Biologist ↔ Bioinformatician wannabe",
    p1: `Well, as you might guess, my name is JuanMa Sierra Garcia, aka <span itemprop="alternateName">juanmgar</span>. I'm from <span itemprop="birthPlace">Cadiz</span> but I live in <span itemprop="address" itemscope itemtype="https://schema.org/PostalAddress"><span itemprop="addressLocality">Porto</span>, <span itemprop="addressRegion">Portugal</span></span>. I love the music of Los Planetas and I accumulate shelves of books read and to be read.`,
    p2: `If you have come this far you may be interested to know that I studied Biology and Biotechnology between Granada and Malaga. Although I had some work experience in research and analysis laboratories, I have developed most of my professional career between Madrid and Asturias as a Full-Stack developer.`,
    p3: `If you want to know more about me or my current projects, I encourage you to contact me through my email (<span itemprop="email"><a href="mailto:juanmgar%20at%20gmail%20dot%20com">juanmgar at gmail dot com</a></span>) or any of my social networks.`,
    langBtn: "Español"
  },
  es: {
    hello: "¡Hola, soy <span itemprop='givenName'>JuanMa</span> <span itemprop='familyName'>Sierra García</span>!",
    jobTitle: "Dev + Biólogo ↔ Bioinformático wannabe",
    p1: `Bueno, como habrás adivinado, me llamo JuanMa Sierra García, alias <span itemprop="alternateName">juanmgar</span>. Soy de <span itemprop="birthPlace">Cádiz</span> pero vivo en <span itemprop="address" itemscope itemtype="https://schema.org/PostalAddress"><span itemprop="addressLocality">Oporto</span>, <span itemprop="addressRegion">Portugal</span></span>. Me encanta la música de Los Planetas y acumulo estanterías de libros leídos y por leer.`,
    p2: `Si has llegado hasta aquí, quizá te interese saber que estudié Biología y Biotecnología entre Granada y Málaga. Aunque trabajé en laboratorios de análisis e investigación, la mayor parte de mi carrera profesional ha sido como desarrollador Full-Stack en Madrid y Asturias.`,
    p3: `Si quieres saber más sobre mí o mis proyectos actuales, te animo a contactarme por correo (<span itemprop="email"><a href="mailto:juanmgar%20at%20gmail%20dot%20com">juanmgar at gmail dot com</a></span>) o por cualquiera de mis redes sociales.`,
    langBtn: "English"
  }
};

const sectionTitles = {
  en: {
    catDegrees: "Official Degrees", catLanguages: "Languages", catCS: "Computer Science", catScience: "Science", catOther: "Other",
    degrees: "Official Degrees", languages: "Languages", cs: "Computer Science", sci: "Science", misc: "Other"
  },
  es: {
    catDegrees: "Títulos Oficiales", catLanguages: "Idiomas", catCS: "Informática", catScience: "Ciencias", catOther: "Otros",
    degrees: "Títulos Oficiales", languages: "Idiomas", cs: "Informática", sci: "Ciencias", misc: "Otros"
  }
};

/* =======================
   Funciones de actualización
   ======================= */
function updateAllTexts() {
  const t = homepageTexts[currentLang];
  document.getElementById("hello").innerHTML = t.hello;
  document.getElementById("jobTitle").innerHTML = t.jobTitle;
  document.getElementById("p1").innerHTML = t.p1;
  document.getElementById("p2").innerHTML = t.p2;
  document.getElementById("p3").innerHTML = t.p3;
  document.getElementById("toggle-lang").textContent = t.langBtn;
  document.documentElement.lang = currentLang;

  if (cvData) renderCV(cvData, currentLang);
}

document.getElementById("toggle-lang").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  updateAllTexts();
});

/* =======================
   Paginación
   ======================= */
const pageSize = 10;
const pages = { cs: 0, science: 0, misc: 0 };
let itemsStore = { cs: [], science: [], misc: [] };

function renderCategory(listEl, items, key) {
  if (!listEl) return;
  listEl.innerHTML = '';
  const total = items.length;
  const start = pages[key] * pageSize;
  const end = Math.min(total, start + pageSize);

  if (total === 0) {
    listEl.innerHTML = `<li><em>No entries</em></li>`;
  } else {
    for (let i = start; i < end; i++) listEl.appendChild(items[i]);
  }

  // Ahora buscamos '.cv-card' en lugar de 'section'
  const section = listEl.closest('.cv-card');
  if (section) {
    const pageInfo = section.querySelector('.page-info');
    const prevBtn = section.querySelector('.prev');
    const nextBtn = section.querySelector('.next');
    const pagesCount = Math.max(1, Math.ceil(total / pageSize));
    if (pageInfo) pageInfo.textContent = `Página ${pages[key] + 1} de ${pagesCount}`;
    if (prevBtn) prevBtn.disabled = pages[key] === 0;
    if (nextBtn) nextBtn.disabled = (end >= total);
  }
}

/* =======================
   Render del CV
   ======================= */
function renderCV(data, lang) {
  const headers = data.table.cols.map(col => col.label.trim());
  const rows = data.table.rows;

  const colIndex = {
    spanish: headers.indexOf("Spanish"), english: headers.indexOf("English"),
    institution: headers.indexOf("Institution"), year: headers.indexOf("Year"),
    area: headers.indexOf("Area"), type: headers.indexOf("Type"),
    published: headers.indexOf("Published"), level: headers.indexOf("Level")
  };

  const get = (row, idx) => row.c[idx]?.v || "";
  const lists = {
    degrees: document.getElementById("list-degrees"),
    languages: document.getElementById("list-languages"),
    it: document.getElementById("list-it"),
    science: document.getElementById("list-science"),
    misc: document.getElementById("list-misc")
  };

  Object.values(lists).forEach(ul => { if (ul) ul.innerHTML = ""; });

  const degreeLevelOrder = { master: 1, specialist: 2, bachelor: 3, cfgs: 4, school: 5 };
  
  const degreeRows = rows.filter(r => get(r, colIndex.published)?.toLowerCase() === "yes" && get(r, colIndex.type)?.toLowerCase() === "degree");
  degreeRows.sort((a, b) => (degreeLevelOrder[get(a, colIndex.level)?.toLowerCase()] || 99) - (degreeLevelOrder[get(b, colIndex.level)?.toLowerCase()] || 99));

  degreeRows.forEach(row => {
    const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
    const li = document.createElement("li");
    li.innerHTML = `<span class="cv-title">${title}</span> <span class="cv-institution">${get(row, colIndex.institution)}</span> <span class="cv-year">${get(row, colIndex.year)}</span>`;
    lists.degrees.appendChild(li);
  });

  itemsStore = { languages: [], cs: [], science: [], misc: [] };

  rows.forEach(row => {
    if (get(row, colIndex.published)?.toLowerCase() !== "yes" || get(row, colIndex.type)?.toLowerCase() === "degree") return;
    const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
    const area = get(row, colIndex.area)?.toLowerCase();
    const type = get(row, colIndex.type)?.toLowerCase();

    const li = document.createElement("li");
    li.innerHTML = `<span class="cv-title">${title}</span> <span class="cv-institution">${get(row, colIndex.institution)}</span> <span class="cv-year">${get(row, colIndex.year)}</span>`;

    if (type === "language skill") itemsStore.languages.push(li);
    else if (area === "computer science") itemsStore.cs.push(li);
    else if (area === "science") itemsStore.science.push(li);
    else itemsStore.misc.push(li);
  });

  // Títulos
  const s = sectionTitles[lang];
  document.querySelector('#official-degrees .tagline').textContent = s.degrees;
  document.querySelector('#languages .tagline').textContent = s.languages;
  document.querySelector('#cs .tagline').textContent = s.cs;
  document.querySelector('#science .tagline').textContent = s.sci;
  document.querySelector('#misc .tagline').textContent = s.misc;

  document.getElementById("catDegrees").textContent = s.catDegrees;
  document.getElementById("catLanguages").textContent = s.catLanguages;
  document.getElementById("catCS").textContent = s.catCS;
  document.getElementById("catScience").textContent = s.catScience;
  document.getElementById("catOther").textContent = s.catOther;

  pages.cs = 0; pages.science = 0; pages.misc = 0;
  renderCategory(lists.it, itemsStore.cs, 'cs');
  renderCategory(lists.science, itemsStore.science, 'science');
  renderCategory(lists.misc, itemsStore.misc, 'misc');
  itemsStore.languages.forEach(li => lists.languages.appendChild(li));
}

/* =======================
   Event Listeners (Paginación y Pestañas/Tabs)
   ======================= */
document.addEventListener('click', (e) => {
  // Pestañas (Tabs)
  if (e.target.classList.contains('index-link')) {
    e.preventDefault();
    document.querySelectorAll('.index-link').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.cv-card').forEach(card => card.classList.remove('active'));
    
    e.target.classList.add('active');
    const targetId = e.target.getAttribute('href').substring(1);
    document.getElementById(targetId).classList.add('active');
  }

  // Paginación
  if (e.target.classList.contains('prev') || e.target.classList.contains('next')) {
    const card = e.target.closest('.cv-card');
    if (!card) return;
    const key = { cs: 'cs', science: 'science', misc: 'misc' }[card.id];
    if (!key) return;

    const maxPage = Math.max(0, Math.ceil(itemsStore[key].length / pageSize) - 1);
    pages[key] = e.target.classList.contains('prev') ? Math.max(0, pages[key] - 1) : Math.min(maxPage, pages[key] + 1);

    const listEl = document.getElementById(key === 'cs' ? 'list-it' : `list-${key}`);
    renderCategory(listEl, itemsStore[key], key);
  }
});

/* =======================
   Carga Inicial
   ======================= */
fetch(SHEET_URL)
  .then(res => res.ok ? res.text() : Promise.reject("Failed"))
  .then(text => {
    cvData = JSON.parse(text.substr(47).slice(0, -2));
    updateAllTexts();
    document.getElementById('loading-spinner').style.display = 'none';
  })
  .catch(err => {
    document.getElementById("list-degrees").innerHTML = "<li>Error al cargar CV.</li>";
    document.getElementById('loading-spinner').style.display = 'none';
  });
