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
    blogSubtitle: "Reflections from <a href='https://lasinceridadestamalvista.com/' target='_blank'>La sinceridad está mal vista</a>",
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
    blogSubtitle: "Reflexiones desde <a href='https://lasinceridadestamalvista.com/' target='_blank'>La sinceridad está mal vista</a>",
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

/* =======================
   Funciones de actualización (Idiomas)
   ======================= */
function updateAllTexts() {
  const t = homepageTexts[currentLang];
  
  // Textos de presentación
  document.getElementById("hello").innerHTML = t.hello;
  document.getElementById("p1").innerHTML = t.p1;
  document.getElementById("p2").innerHTML = t.p2;
  document.getElementById("p3").innerHTML = t.p3;
  document.getElementById("toggle-lang").textContent = t.langBtn;
  document.getElementById("loading-text").textContent = t.loading;
  
  // Navegación y Títulos de sección
  if(document.getElementById("nav-exp")) document.getElementById("nav-exp").textContent = t.navExp;
  if(document.getElementById("nav-contact")) document.getElementById("nav-contact").textContent = t.navContact;
  if(document.getElementById("nav-blog")) document.getElementById("nav-blog").textContent = t.navBlog;
  
  if(document.getElementById("sec-trayectoria")) document.getElementById("sec-trayectoria").textContent = t.secTrayectoria;
  if(document.getElementById("sec-contacto")) document.getElementById("sec-contacto").textContent = t.secContacto;
  
  // Textos del Blog
  if(document.getElementById("sec-blog")) document.getElementById("sec-blog").textContent = t.secBlog;
  if(document.getElementById("blog-subtitle")) document.getElementById("blog-subtitle").innerHTML = t.blogSubtitle;
  if(document.getElementById("btn-more-blog")) document.getElementById("btn-more-blog").textContent = t.btnMoreBlog;
  
  // Textos del formulario
  if(document.getElementById("label-name")) document.getElementById("label-name").textContent = t.labelName;
  if(document.getElementById("label-email")) document.getElementById("label-email").textContent = t.labelEmail;
  if(document.getElementById("label-message")) document.getElementById("label-message").textContent = t.labelMsg;
  if(document.getElementById("btn-submit")) document.getElementById("btn-submit").textContent = t.btnSubmit;

  // Paginación
  document.querySelectorAll('.prev').forEach(btn => btn.textContent = t.prevBtn);
  document.querySelectorAll('.next').forEach(btn => btn.textContent = t.nextBtn);

  document.documentElement.lang = currentLang;

  // Renderiza de nuevo el CV (Google Sheets)
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
const icon = themeBtn.querySelector('i');

// Comprueba si el usuario ya tenía el modo oscuro guardado
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
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
   Event Listeners (Tabs / Paginación)
   ======================= */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('index-link')) {
    e.preventDefault();
    document.querySelectorAll('.index-link').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.cv-card').forEach(card => card.classList.remove('active'));
    
    e.target.classList.add('active');
    const targetId = e.target.getAttribute('href').substring(1);
    document.getElementById(targetId).classList.add('active');
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
    document.getElementById('loading-spinner').style.display = 'none';
  })
  .catch(err => {
    document.getElementById("list-degrees").innerHTML = "<li>Error al cargar CV.</li>";
    document.getElementById('loading-spinner').style.display = 'none';
  });

/* =======================
   Integración del Blog (WP REST API)
   ======================= */
async function loadLatestBlogPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    // La API de WordPress devuelve los últimos posts. _embed incluye imágenes destacadas.
    const wpApiUrl = 'https://lasinceridadestamalvista.com/wp-json/wp/v2/posts?per_page=3&_embed';

    try {
        const response = await fetch(wpApiUrl);
        if (!response.ok) throw new Error('Error al cargar el blog');
        const posts = await response.json();

        container.innerHTML = ''; // Limpiamos el mensaje de "Cargando"

        posts.forEach(post => {
            // Buscamos la imagen destacada (si la hay)
            let imageUrl = '';
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
                imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
            }

            // Limpiamos el extracto (viene con etiquetas HTML)
            const excerpt = post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 120) + '...';

            // Formateamos la fecha
            const date = new Date(post.date).toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Construimos la tarjeta
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
        container.innerHTML = `<p>No se han podido cargar los artículos. <a href="https://lasinceridadestamalvista.com/" target="_blank">Visita el blog directamente</a>.</p>`;
    }
}

// Llamamos a la función al cargar la página
window.addEventListener('DOMContentLoaded', loadLatestBlogPosts);
