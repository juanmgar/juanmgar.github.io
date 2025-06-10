
const SHEET_ID = '1A2qHdYFzmOcLU4-xqKwREIbchy-H3CRWzin_Ht2GV9k';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let currentLang = "en";

const sectionTitles = {
    en: {
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
        url: headers.indexOf("URL")
    };

    const get = (row, idx) => row.c[idx]?.v || "";

    const listDegrees = document.getElementById("list-degrees");
    const listLanguages = document.getElementById("list-languages");
    const listIT = document.getElementById("list-it");
    const listScience = document.getElementById("list-science");
    const listMisc = document.getElementById("list-misc");

    [listDegrees, listLanguages, listIT, listScience, listMisc].forEach(ul => ul.innerHTML = "");

    rows.forEach(row => {
        if ((get(row, colIndex.published) || "").toLowerCase() !== "yes") return;

        const title = lang === "es" ? get(row, colIndex.spanish) : get(row, colIndex.english);
        const inst = get(row, colIndex.institution);
        const year = get(row, colIndex.year);
        const area = (get(row, colIndex.area) || "").toLowerCase();
        const type = (get(row, colIndex.type) || "").toLowerCase();
        const url = get(row, colIndex.url);

        const li = document.createElement("li");

        li.innerHTML = `
      <span class="cv-title">${title}</span>. 
      <span class="cv-institution">${inst}</span> 
      (<span class="cv-year">${year}</span>)
      ${url ? `<a href="${url}" target="_blank"> [${lang === "es" ? "Ver certificado" : "View certificate"}]</a>` : ""}
    `;

        if (type === "degree") {
            listDegrees.appendChild(li);
        } else if (type === "language skill") {
            listLanguages.appendChild(li);
        } else {
            switch (area) {
                case "computer science":
                case "informática":
                    listIT.appendChild(li);
                    break;
                case "science":
                case "ciencias":
                    listScience.appendChild(li);
                    break;
                default:
                    listMisc.appendChild(li);
            }
        }
    });

    const sections = document.querySelectorAll("section");
    const h3s = document.querySelectorAll("section h3");

    sections[0].querySelector("h2").textContent = sectionTitles[lang].degrees;
    sections[1].querySelector("h2").textContent = sectionTitles[lang].languages;
    sections[2].querySelector("h2").textContent = sectionTitles[lang].certificates;

    h3s[0].textContent = sectionTitles[lang].cs;
    h3s[1].textContent = sectionTitles[lang].sci;
    h3s[2].textContent = sectionTitles[lang].misc;

    document.querySelector("main p a").textContent = sectionTitles[lang].back;
    document.getElementById("toggle-lang").textContent = sectionTitles[lang].langBtn;
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
            document.querySelector('main').style.display = 'block';
            clearInterval(interval);
        }
    }, 100);
});