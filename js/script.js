/* =======================
   Datos hoja & estado
   ======================= */
const SHEET_ID = '1A2qHdYFzmOcLU4-xqKwREIbchy-H3CRWzin_Ht2GV9k';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let currentLang = "en";
let cvData = null; 

/* =======================
   Textos multilengua
   ======================= */
const homepageTexts = {
  en: {
    hello: "Hello, I'm <span itemprop='givenName'>JuanMa</span> <span itemprop='familyName'>Sierra García</span>!",
    p1: `Well, as you might guess, my name is JuanMa Sierra Garcia, aka <span itemprop="alternateName">juanmgar</span>. I'm from <span itemprop="birthPlace">Cadiz</span>, but I live in <s>Cadiz, Granada, Malaga, Cordoba, Ciudad Real, Madrid, Gijon, Porto</s> <span itemprop="address" itemscope itemtype="https://schema.org/PostalAddress"><span itemprop="addressLocality">Oviedo</span>, <span itemprop="addressRegion">Asturias</span></span>. I love the music of Los Planetas and I accumulate shelves of books read and to be read.`,
    p2: `If you have come this far you may be interested to know that I studied Biology and Biotechnology. After my time working as a DevOps and Full-Stack developer, I have graduated as a Computer Engineer. Recently, my main interest lies in the operationalization and study of fringe discourse on social networks. You can check out my Master's Thesis on the subject <a href="https://digibuo.uniovi.es/dspace/handle/10651/85090" target="_blank">right here</a>.`,
    p3: `If you want to know more about me or my current projects, I encourage you to contact me through the form below or any of my social networks.`,
    langBtn: "Español",
    navExp: "My Experience",
    navContact: "Contact",
    navBlog: "Blog",
    secTrayectoria: "My Path",
    secContacto: "Let's Talk",
    secBlog: "Latest posts on my blog",
    blogSubtitle: "Reflections from <a href='https://blog.juanmasierragarcia.eu/' target='_blank'>La sinceridad está mal vista</a>",
    btnMoreBlog: "Read more on the blog",
    labelName: "Name",
    labelEmail: "Email",
    labelMsg: "Message",
    btnSubmit: "Send Message",
    prevBtn: "Previous",
    nextBtn: "Next",
    pageText: "Page",
    ofText: "of",
    loading: "Loading data..."
  },
  es: {
    hello: "¡Hola, soy <span itemprop='givenName'>JuanMa</span> <span itemprop='familyName'>Sierra García</span>!",
    p1: `Bueno, como habrás adivinado, me llamo JuanMa Sierra García, alias <span itemprop="alternateName">juanmgar</span>. Soy de <span itemprop="birthPlace">Cádiz</span>, pero vivo en <s>Cádiz, Granada, Málaga, Córdoba, Ciudad Real, Madrid, Gijón, Oporto</s> <span itemprop="address" itemscope itemtype="https://schema.org/PostalAddress"><span itemprop="addressLocality">Oviedo</span>, <span itemprop="addressRegion">Asturias</span></span>. Me encanta la música de Los Planetas y acumulo estanterías de libros leídos y por leer.`,
    p2: `Si has llegado hasta aquí, quizá te interese saber que estudié Biología y Biotecnología. Tras mi etapa como desarrollador DevOps y Full-Stack, me he graduado como Ingeniero Informático Superior. En los últimos meses me he volcado en la operacionalización y el estudio del discurso <em>fringe</em> en redes sociales. De hecho, puedes consultar mi Trabajo Fin de Máster sobre el tema <a href="https://digibuo.uniovi.es/dspace/handle/10651/85090" target="_blank">justo aquí</a>.`,
    p3: `Si quieres saber más sobre mí o mis proyectos actuales, te animo a contactarme a través del formulario o por cualquiera de mis redes sociales.`,
    langBtn: "English",
    navExp: "Mi Experiencia",
    navContact: "Contacto",
    navBlog: "Blog",
    secTrayectoria: "Mi Trayectoria",
    secContacto: "Hablemos",
    secBlog: "Últimos artículos en mi blog",
    blogSubtitle: "Reflexiones desde <a href='https://blog.juanmasierragarcia.eu/' target='_blank'>La sinceridad está mal vista</a>",
    btnMoreBlog: "Leer más en el blog",
    labelName: "Nombre",
    labelEmail: "Correo Electrónico",
    labelMsg: "Mensaje",
    btnSubmit: "Enviar Mensaje",
    prevBtn: "Anterior",
    nextBtn: "Siguiente",
    pageText: "Página",
    ofText: "de",
    loading: "Cargando datos..."
  }
};

/* LA VARIABLE QUE HABÍA BORRADO POR ERROR */
const sectionTitles = {
  en: { catDegrees: "Official Degrees", catLanguages: "Languages", catCS: "Computer Science", catScience: "Science", catOther: "Other", degrees: "Official Degrees", languages: "Languages", cs: "Computer Science", sci: "Science", misc: "Other" },
  es: { catDegrees: "Títulos Oficiales", catLanguages: "Idiomas", catCS: "Informática", catScience: "Ciencias", catOther: "Otros", degrees: "Títulos Oficiales", languages: "Idiomas", cs: "Informática", sci: "Ciencias", misc: "Otros" }
};

/* =======================
   Funciones de actualización (Idiomas) SEGURA
   ======================= */
function updateAllTexts() {
  const t = homepageTexts[currentLang];
  
  const setHTML = (id, text) => { 
      const el = document.getElementById(id); 
      if(el) el.innerHTML = text; 
  };
  const setText = (id, text) => { 
      const el = document.getElementById(id); 
      if(el) el.textContent = text; 
  };

  setHTML("hello", t.hello);
  setHTML("p1", t.p1);
  setHTML("p2", t.p2);
  setHTML("p3", t.p3);
  setText("toggle-lang", t.langBtn);
  setText("loading-text", t.loading);
  
  setText("nav-exp", t.navExp);
  setText("nav-contact", t.navContact);
  setText("nav-blog", t.navBlog);
  
  setText("sec-trayectoria", t.secTrayectoria);
  setText("sec-contacto", t.secContacto);
  
  setText("sec-blog", t.secBlog);
  setHTML("blog-subtitle", t.blogSubtitle);
  setText("btn-more-blog", t.btnMoreBlog);
  
  setText("label-name", t.labelName);
  setText("label-email", t.labelEmail);
  setText("label-message", t.labelMsg);
  setText("btn-submit", t.btnSubmit);

  document.querySelectorAll('.prev').forEach(btn => btn.textContent = t.prevBtn);
  document.querySelectorAll('.next').forEach(btn => btn.textContent = t.nextBtn);

  document.documentElement.lang = currentLang;

  // Renderiza de nuevo el CV
  if (cvData) renderCV(cvData, currentLang);
}

document.getElementById("toggle-lang").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  updateAllTexts();
});

/* =======================
   Modo Oscuro (Dark Mode)
   ======================= */
const themeBtn = document.getElementById('toggle-theme');
if (themeBtn) {
    const icon = themeBtn.querySelector('i');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if(icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            if(icon) icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            if(icon) icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

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

  const section = listEl.closest('.cv-card');
  if (section) {
    const pageInfo = section.querySelector('.page-info');
    const prevBtn = section.querySelector('.prev');
    const nextBtn = section.querySelector('.next');
    const pagesCount = Math.max(1, Math.ceil(total / pageSize));
    
    const t = homepageTexts[currentLang]; 
    if (pageInfo) pageInfo.textContent = `${t.pageText} ${pages[key] + 1} ${t.ofText} ${pagesCount}`;
    
    if (prevBtn) prevBtn.disabled = pages[key] === 0;
    if (nextBtn) nextBtn.disabled = (end >= total);
  }
}

/* =======================
   Render del CV Blindado
   ======================= */
function renderCV(data, lang) {
  // Aseguramos que el encabezado no rompa si viene vacío
  const headers = data.table.cols.map(col => (col.label || "").trim());
  const rows = data.table.rows;

  const colIndex = {
    spanish: headers.indexOf("Spanish"), english: headers.indexOf("English"),
    institution: headers.indexOf("Institution"), year: headers.indexOf("Year"),
    area: headers.indexOf("Area"), type: headers.indexOf("Type"),
    published: headers.indexOf("Published"), level: headers.indexOf("Level")
  };

  // Lector a prueba de celdas vacías
  const get = (row, idx) => {
      if (!row || !row.c || !row.c[idx]) return "";
      return String(row.c[idx].v || "");
  };

  const lists = {
    degrees: document.getElementById("list-degrees"),
    languages: document.getElementById("list-languages"),
    it: document.getElementById("list-it"),
    science: document.getElementById("list-science"),
    misc: document.getElementById("list-misc")
  };

  Object.values(lists).forEach(ul => { if (ul) ul.innerHTML = ""; });

  const degreeLevelOrder = { master: 1, specialist: 2, bachelor: 3, cfgs: 4, school: 5 };
  
  const degreeRows = rows.filter(r => get(r, colIndex.published).toLowerCase() === "yes" && get(r, colIndex.type).toLowerCase() === "degree");
  degreeRows.sort((a, b) => (degreeLevelOrder[get(a, colIndex.level).toLowerCase()] || 99) - (degreeLevelOrder[get(b, colIndex.level).toLowerCase()] || 99));

  degreeRows.forEach(row => {
    const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
    const li = document.createElement("li");
    li.innerHTML = `<span class="cv-title">${title}</span> <span class="cv-institution">${get(row, colIndex.institution)}</span> <span class="cv-year">${get(row, colIndex.year)}</span>`;
    if(lists.degrees) lists.degrees.appendChild(li);
  });

  itemsStore = { languages: [], cs: [], science: [], misc: [] };

  rows.forEach(row => {
    if (get(row, colIndex.published).toLowerCase() !== "yes" || get(row, colIndex.type).toLowerCase() === "degree") return;
    const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
    const area = get(row, colIndex.area).toLowerCase();
    const type = get(row, colIndex.type).toLowerCase();

    const li = document.createElement("li");
    li.innerHTML = `<span class="cv-title">${title}</span> <span class="cv-institution">${get(row, colIndex.institution)}</span> <span class="cv-year">${get(row, colIndex.year)}</span>`;

    if (type === "language skill") itemsStore.languages.push(li);
    else if (area === "computer science") itemsStore.cs.push(li);
    else if (area === "science") itemsStore.science.push(li);
    else itemsStore.misc.push(li);
  });

  const s = sectionTitles[lang];
  const setElText = (selector, text) => { const el = document.querySelector(selector); if(el) el.textContent = text; };
  const setIdText = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };

  setElText('#official-degrees .tagline', s.degrees);
  setElText('#languages .tagline', s.languages);
  setElText('#cs .tagline', s.cs);
  setElText('#science .tagline', s.sci);
  setElText('#misc .tagline', s.misc);

  setIdText("catDegrees", s.catDegrees);
  setIdText("catLanguages", s.catLanguages);
  setIdText("catCS", s.catCS);
  setIdText("catScience", s.catScience);
  setIdText("catOther", s.catOther);

  pages.cs = 0; pages.science = 0; pages.misc = 0;
  renderCategory(lists.it, itemsStore.cs, 'cs');
  renderCategory(lists.science, itemsStore.science, 'science');
  renderCategory(lists.misc, itemsStore.misc, 'misc');
  itemsStore.languages.forEach(li => { if(lists.languages) lists.languages.appendChild(li); });
}

/* =======================
   Event Listeners (Tabs / Paginación)
   ======================= */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('index-link')) {
    e.preventDefault();
    document.querySelectorAll('.index-link').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.cv-card').forEach(card => card.classList.remove('active'));
    
    e.target.classList.add('active');
    const targetId = e.target.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if(targetEl) targetEl.classList.add('active');
  }

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
    const spinner = document.getElementById('loading-spinner');
    if(spinner) spinner.style.display = 'none';
  })
  .catch(err => {
    console.error("Error al procesar el CV:", err);
    const listDegrees = document.getElementById("list-degrees");
    if(listDegrees) listDegrees.innerHTML = "<li>Error al cargar CV.</li>";
    const spinner = document.getElementById('loading-spinner');
    if(spinner) spinner.style.display = 'none';
  });

/* =======================
   Integración del Blog (WP REST API)
   ======================= */
async function loadLatestBlogPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    const wpApiUrl = 'https://blog.juanmasierragarcia.eu/wp-json/wp/v2/posts?per_page=3&_embed';

    try {
        const response = await fetch(wpApiUrl);
        if (!response.ok) throw new Error('Error al cargar el blog');
        const posts = await response.json();

        container.innerHTML = ''; 

        posts.forEach(post => {
            let imageUrl = '';
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
                imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
            }

            const excerpt = post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 120) + '...';

            const date = new Date(post.date).toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const article = document.createElement('article');
            article.className = 'blog-card';
            article.innerHTML = `
                ${imageUrl ? `<div class="blog-image" style="background-image: url('${imageUrl}')"></div>` : ''}
                <div class="blog-content">
                    <span class="blog-date">${date}</span>
                    <h3 class="blog-title"><a href="${post.link}" target="_blank">${post.title.rendered}</a></h3>
                    <p class="blog-excerpt">${excerpt}</p>
                </div>
            `;
            container.appendChild(article);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p>No se han podido cargar los artículos. <a href="https://blog.juanmasierragarcia.eu/" target="_blank">Visita el blog directamente</a>.</p>`;
    }
}

window.addEventListener('DOMContentLoaded', loadLatestBlogPosts);
