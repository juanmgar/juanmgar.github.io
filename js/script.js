/* =======================
   Datos hoja & estado
   ======================= */
const SHEET_ID = '1A2qHdYFzmOcLU4-xqKwREIbchy-H3CRWzin_Ht2GV9k';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let currentLang = "en";

/* =======================
   Textos multilengua
   ======================= */
const homepageTexts = {
    en: {
        hello: "Hello, I'm JuanMa Sierra García!",
        jobTitle: "Dev + Biologist ↔ Bioinformatician wannabe",
        p1: `Well, as you might guess, my name is JuanMa Sierra Garcia, aka juanmgar. I'm from Cadiz but I live in <s>Madrid Granada Málaga Córdoba Gijón Porto (Portugal)</s> Oviedo. I love the music of Los Planetas and I accumulate shelves of books read and to be read.`,
        p2: `If you have come this far you may be interested to know that I studied Biology and Biotechnology between Granada and Malaga. Although I had some work experience in research and analysis laboratories, I have developed most of my professional career between Madrid and Asturias as a Full-Stack developer.`,
        p3: `If you want to know more about me or my current projects, I encourage you to contact me through my email (juanmgar at gmail dot com) or any of my social networks.`,
        langBtn: "Español",
        linkText: "Check my updated CV"
    },
    es: {
        hello: "¡Hola, soy JuanMa Sierra García!",
        jobTitle: "Dev + Biólogo ↔ Bioinformático wannabe",
        p1: `Bueno, como habrás adivinado, me llamo JuanMa Sierra García, alias juanmgar. Soy de Cádiz pero vivo en <s>Madrid Granada Málaga Córdoba Gijón Porto (Portugal)</s> Oviedo. Me encanta la música de Los Planetas y acumulo estanterías de libros leídos y por leer.`,
        p2: `Si has llegado hasta aquí, quizá te interese saber que estudié Biología y Biotecnología entre Granada y Málaga. Aunque trabajé en laboratorios de análisis e investigación, la mayor parte de mi carrera profesional ha sido como desarrollador Full-Stack en Madrid y Asturias.`,
        p3: `Si quieres saber más sobre mí o mis proyectos actuales, te animo a contactarme por correo (juanmgar at gmail dot com) o por cualquiera de mis redes sociales.`,
        langBtn: "English",
        linkText: "Consulta mi CV actualizado"
    }
};

const sectionTitles = {
    en: {
        catDegrees: "Official Degrees",
        catLanguages: "Languages",
        catCS: "Computer Science",
        catScience: "Science",
        catOther: "Other",
        degrees: "Official Degrees",
        languages: "Languages",
        certificates: "Other Certificates",
        cs: "Computer Science",
        sci: "Science",
        misc: "Other",
        back: "← Back to main page",
        langBtn: "Español"
    },
    es: {
        catDegrees: "Titulaciones Oficiales",
        catLanguages: "Idiomas",
        catCS: "Informática",
        catScience: "Ciencias",
        catOther: "Otros",
        degrees: "Titulaciones Oficiales",
        languages: "Idiomas",
        certificates: "Otros Certificados",
        cs: "Informática",
        sci: "Ciencias",
        misc: "Otros",
        back: "← Volver a la página principal",
        langBtn: "English"
    }
};

/* =======================
   Helpers para la home (si existe)
   ======================= */
function updateHomepageLang(lang) {
    const t = homepageTexts[lang];
    // algunos elementos solo existen en la home; protegemos con checks
    if (document.getElementById("hello")) document.getElementById("hello").innerHTML = t.hello;
    if (document.getElementById("jobTitle")) document.getElementById("jobTitle").innerHTML = t.jobTitle;
    if (document.getElementById("p1")) document.getElementById("p1").innerHTML = t.p1;
    if (document.getElementById("p2")) document.getElementById("p2").textContent = t.p2;
    if (document.getElementById("p3")) document.getElementById("p3").textContent = t.p3;
    if (document.getElementById("toggle-lang")) document.getElementById("toggle-lang").textContent = t.langBtn;
    if (document.getElementById("cv-link")) document.getElementById("cv-link").textContent = t.linkText;
    document.documentElement.lang = lang;
}

/* =======================
   Paginación: estado y función de render
   ======================= */
const pageSize = 10;
const pages = { cs: 0, science: 0, misc: 0 };
let itemsStore = { cs: [], science: [], misc: [] };

/**
 * Renderiza un slice de items (LIs DOM nodes) en la lista correspondiente.
 * listEl: elemento UL
 * items: array de <li> (nodes)
 * key: 'cs'|'science'|'misc'
 */
function renderCategory(listEl, items, key) {
  if (!listEl) return;
  listEl.innerHTML = '';
  const total = items.length;
  const start = pages[key] * pageSize;
  const end = Math.min(total, start + pageSize);

  if (total === 0) {
    const li = document.createElement('li');
    li.innerHTML = `<em>No entries</em>`;
    listEl.appendChild(li);
  } else {
    for (let i = start; i < end; i++) listEl.appendChild(items[i]);
  }

  // actualizar pager (está dentro de la <section>)
  const section = listEl.closest('section');
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
   Render principal del CV
   ======================= */
function renderCV(data, lang = "en") {
  const headers = data.table.cols.map(col => col.label.trim());
  const rows = data.table.rows;

  const colIndex = {
    spanish: headers.indexOf("Spanish"),
    english: headers.indexOf("English"),
    institution: headers.indexOf("Institution"),
    year: headers.indexOf("Year"),
    area: headers.indexOf("Area"),
    type: headers.indexOf("Type"),
    published: headers.indexOf("Published"),
    level: headers.indexOf("Level")
  };

  const get = (row, idx) => row.c[idx]?.v || "";

  const listDegrees = document.getElementById("list-degrees");
  const listLanguages = document.getElementById("list-languages");
  const listIT = document.getElementById("list-it");
  const listScience = document.getElementById("list-science");
  const listMisc = document.getElementById("list-misc");

  // Limpiar
  [listDegrees, listLanguages, listIT, listScience, listMisc].forEach(ul => { if (ul) ul.innerHTML = ""; });

  // ---- Degrees (SIN PAGINACIÓN) ----
  const degreeRows = rows.filter(row =>
    (get(row, colIndex.published) || "").toLowerCase() === "yes" &&
    (get(row, colIndex.type) || "").toLowerCase() === "degree"
  );

  // ordenar por level
  const degreeLevelOrder = {
    master: 1,
    specialist: 2,
    bachelor: 3,
    cfgs: 4,
    school: 5
  };

  degreeRows.sort((a, b) => {
    const levelA = (get(a, colIndex.level) || "zzz").toLowerCase();
    const levelB = (get(b, colIndex.level) || "zzz").toLowerCase();
    return (degreeLevelOrder[levelA] || 99) - (degreeLevelOrder[levelB] || 99);
  });

  degreeRows.forEach(row => {
    const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
    const inst = get(row, colIndex.institution);
    const year = get(row, colIndex.year);
    const li = document.createElement("li");
    li.innerHTML = `<span class="cv-title">${title}</span>. 
                    <span class="cv-institution">${inst}</span> 
                    (<span class="cv-year">${year}</span>)`;
    if (listDegrees) listDegrees.appendChild(li);
  });

  // ---- Resto: generamos <li> pero los guardamos en itemsStore para paginar ----
  itemsStore = { languages: [], cs: [], science: [], misc: [] };

  rows.forEach(row => {
    if ((get(row, colIndex.published) || "").toLowerCase() !== "yes") return;
    if ((get(row, colIndex.type) || "").toLowerCase() === "degree") return;

    const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
    const inst = get(row, colIndex.institution);
    const year = get(row, colIndex.year);
    const area = (get(row, colIndex.area) || "").toLowerCase();
    const type = (get(row, colIndex.type) || "").toLowerCase();

    const li = document.createElement("li");
    li.innerHTML = `<span class="cv-title">${title}</span>. 
                    <span class="cv-institution">${inst}</span> 
                    (<span class="cv-year">${year}</span>)`;

    if (type === "language skill") {
      itemsStore.languages.push(li);
    } else {
      switch (area) {
        case "computer science": itemsStore.cs.push(li); break;
        case "science": itemsStore.science.push(li); break;
        default: itemsStore.misc.push(li);
      }
    }
  });

  // actualizar textos / títulos (multilengua)
  const degreesSummary = document.querySelector('#official-degrees h2.tagline');
  const languagesSummary = document.querySelector('#languages h2.tagline');
  const csSummary = document.querySelector('#cs h2.tagline');
  const scienceSummary = document.querySelector('#science h2.tagline');
  const miscSummary = document.querySelector('#misc h2.tagline');

  if (degreesSummary) degreesSummary.textContent = sectionTitles[lang].degrees;
  if (languagesSummary) languagesSummary.textContent = sectionTitles[lang].languages;
  if (csSummary) csSummary.textContent = sectionTitles[lang].cs;
  if (scienceSummary) scienceSummary.textContent = sectionTitles[lang].sci;
  if (miscSummary) miscSummary.textContent = sectionTitles[lang].misc;

  // actualizar enlaces del índice y botones
  const setIf = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setIf("catDegrees", sectionTitles[lang].catDegrees);
  setIf("catLanguages", sectionTitles[lang].catLanguages);
  setIf("catCS", sectionTitles[lang].catCS);
  setIf("catScience", sectionTitles[lang].catScience);
  setIf("catOther", sectionTitles[lang].catOther);
  setIf("back-btn", sectionTitles[lang].back);
  setIf("toggle-lang", sectionTitles[lang].langBtn);

  // reset páginas y render inicial de cada categoría paginada
  pages.cs = 0; pages.science = 0; pages.misc = 0;
  renderCategory(listIT, itemsStore.cs, 'cs');
  renderCategory(listScience, itemsStore.science, 'science');
  renderCategory(listMisc, itemsStore.misc, 'misc');
}

/* =======================
   Listeners de paginación (delegación)
   ======================= */
document.addEventListener('click', (e) => {
  if (!e.target) return;
  if (e.target.classList.contains('prev') || e.target.classList.contains('next')) {
    const section = e.target.closest('section');
    if (!section) return;
    const sectionId = section.id; //'cs'|'science'|'misc'
    const keyMap = { cs: 'cs', science: 'science', misc: 'misc' };
    const key = keyMap[sectionId];
    if (!key) return;

    const maxPage = Math.max(0, Math.ceil(itemsStore[key].length / pageSize) - 1);

    if (e.target.classList.contains('prev')) {
      pages[key] = Math.max(0, pages[key] - 1);
    } else {
      pages[key] = Math.min(maxPage, pages[key] + 1);
    }

    // obtener ul correspondiente
    const listId = (key === 'cs') ? 'list-it' : `list-${key}`;
    const listEl = document.getElementById(listId);
    renderCategory(listEl, itemsStore[key], key);
  }
});

/* =======================
   Carga de hoja y toggle-lang
   ======================= */
if (document.getElementById("p1")) {
  // si estamos en la home, activamos el toggle para la home (solo allí)
  updateHomepageLang(currentLang);
  document.getElementById("toggle-lang").addEventListener("click", () => {
    currentLang = currentLang === "en" ? "es" : "en";
    updateHomepageLang(currentLang);
  });
}

fetch(SHEET_URL)
  .then(res => res.ok ? res.text() : Promise.reject("Failed to load spreadsheet"))
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2));
    // Render inicial del CV con el idioma actual
    renderCV(json, currentLang);

    // toggle-lang en la página CV: solo renderizamos el CV con el nuevo idioma
    // (no hacemos updateHomepageLang aquí porque la home ya tiene su propio handler cuando corresponde)
    document.getElementById("toggle-lang").addEventListener("click", () => {
      currentLang = currentLang === "en" ? "es" : "en";
      renderCV(json, currentLang);
    });
  })
  .catch(error => {
    console.error("Error loading CV: ", error);
    const ld = document.getElementById("list-degrees");
    if (ld) ld.innerHTML = "<li>Could not load CV data.</li>";
  });

/* =======================
   Ocultar spinner cuando haya datos
   ======================= */
window.addEventListener('load', () => {
  const interval = setInterval(() => {
    if (document.querySelectorAll('#list-degrees li').length > 0 ||
        (document.getElementById('list-degrees') && document.getElementById('list-degrees').textContent.includes('Could not'))) {
      const spinner = document.getElementById('loading-spinner');
      if (spinner) spinner.style.display = 'none';
      clearInterval(interval);
    }
  }, 100);
});
