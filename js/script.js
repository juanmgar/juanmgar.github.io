
const SHEET_ID = '1A2qHdYFzmOcLU4-xqKwREIbchy-H3CRWzin_Ht2GV9k';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let currentLang = "en";

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

    [listDegrees, listLanguages, listIT, listScience, listMisc].forEach(ul => ul.innerHTML = "");

    // Ordenar grados oficiales por nivel
    const degreeLevelOrder = {
        master: 1,
        specialist: 2,
        bachelor: 3,
        cfgs: 4,
        school: 5
    };

    const degreeRows = rows.filter(row =>
        (get(row, colIndex.published) || "").toLowerCase() === "yes" &&
        (get(row, colIndex.type) || "").toLowerCase() === "degree"
    );

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
        li.innerHTML = `
          <span class="cv-title">${title}</span>. 
          <span class="cv-institution">${inst}</span> 
          (<span class="cv-year">${year}</span>)
        `;
        listDegrees.appendChild(li);
    });

    // Resto de elementos (idiomas y certificados)
    rows.forEach(row => {
        if ((get(row, colIndex.published) || "").toLowerCase() !== "yes") return;
        if ((get(row, colIndex.type) || "").toLowerCase() === "degree") return; // ya renderizado

        const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
        const inst = get(row, colIndex.institution);
        const year = get(row, colIndex.year);
        const area = (get(row, colIndex.area) || "").toLowerCase();
        const type = (get(row, colIndex.type) || "").toLowerCase();

        const li = document.createElement("li");
        li.innerHTML = `
          <span class="cv-title">${title}</span>. 
          <span class="cv-institution">${inst}</span> 
          (<span class="cv-year">${year}</span>)
        `;

        if (type === "language skill") {
            listLanguages.appendChild(li);
        } else {
            switch (area) {
                case "computer science":
                    listIT.appendChild(li);
                    break;
                case "science":
                    listScience.appendChild(li);
                    break;
                default:
                    listMisc.appendChild(li);
            }
        }
    });

    const degreesSummary = document.querySelector('#official-degrees summary h2');
    const languagesSummary = document.querySelector('#languages summary h2');
    const certificatesSummary = document.querySelector('#certificates summary h2');

    const h3CS = document.querySelector('#cs summary h3');
    const h3SCI = document.querySelector('#science summary h3');
    const h3MISC = document.querySelector('#misc summary h3');

    degreesSummary.textContent = sectionTitles[lang].degrees;
    languagesSummary.textContent = sectionTitles[lang].languages;
    certificatesSummary.textContent = sectionTitles[lang].certificates;

    h3CS.innerHTML = "<u>" + sectionTitles[lang].cs + "</u>";
    h3SCI.innerHTML = "<u>" + sectionTitles[lang].sci + "</u>";
    h3MISC.innerHTML = "<u>" + sectionTitles[lang].misc + "</u>";

    document.getElementById("catDegrees").textContent = sectionTitles[lang].catDegrees;
    document.getElementById("catLanguages").textContent = sectionTitles[lang].catLanguages;
    document.getElementById("catCS").textContent = sectionTitles[lang].catCS;
    document.getElementById("catScience").textContent = sectionTitles[lang].catScience;
    document.getElementById("catOther").textContent = sectionTitles[lang].catOther;
    document.getElementById("back-btn").textContent = sectionTitles[lang].back;
    document.getElementById("toggle-lang").textContent = sectionTitles[lang].langBtn;
}

function updateHomepageLang(lang) {
    const t = homepageTexts[lang];

    document.getElementById("hello").innerHTML = t.hello;
    document.getElementById("jobTitle").innerHTML = t.jobTitle;

    document.getElementById("p1").innerHTML = t.p1;
    document.getElementById("p2").textContent = t.p2;
    document.getElementById("p3").textContent = t.p3;

    document.getElementById("toggle-lang").textContent = t.langBtn;
    document.getElementById("cv-link").textContent = t.linkText;

    document.documentElement.lang = lang;
}

if (document.getElementById("p1")) {
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
        renderCV(json, currentLang);

        document.getElementById("toggle-lang").addEventListener("click", () => {
            currentLang = currentLang === "en" ? "es" : "en";
            renderCV(json, currentLang);
        });
    })
    .catch(error => {
        console.error("Error loading CV: ", error);
        document.getElementById("list-degrees").innerHTML = "<li>Could not load CV data.</li>";
    });

window.addEventListener('load', () => {
    const interval = setInterval(() => {
        if (document.querySelectorAll('#list-degrees li').length > 0 || document.querySelector('#list-degrees').textContent.includes('Could not')) {
            document.getElementById('loading-spinner').style.display = 'none';
            clearInterval(interval);
        }
    }, 100);
});