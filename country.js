
const container_info = document.querySelector(".container-info");
const container_moreinfo = document.querySelector(".container-moreinfo");
const background_image = document.querySelector(".background-image");
const country_header = document.querySelector(".country-header");
const back_logo = document.querySelector(".back-logo");
const body = document.querySelector("body");
const button_darkmode = document.querySelector(".moon-logo");
const border_panel = document.querySelector(".border-panel");
const border_header = document.querySelector(".footer-header");

let containers = document.querySelectorAll(".container");
let localname = localStorage.getItem("name");
let actualTheme = body.classList;

const backToPreviousPage = () => {
    back_logo.onclick = () => {
        history.back();
    }
}

backToPreviousPage();

const fetchCountryAPI = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all?");
    const jsonData = await response.json();
    return jsonData;
}

fetchCountryAPI();

const activateDarkmode = () => {
    button_darkmode.onclick = () => {
        body.classList.toggle("dark");
        containers.forEach(container => {
            container.classList.toggle("dark2");
        })
        localStorage.setItem("theme", actualTheme);
    }
}

activateDarkmode();

const isDarkThemeOn = (containers) => {
    let theme = localStorage.getItem("theme");
    if(theme == "dark") {
        body.classList.add("dark");
        containers.forEach(container => {
            container.classList.add("dark2");
        })
    } else {
        body.classList.remove("dark");
        containers.forEach(container => {
            container.classList.remove("dark2");
        })
    }
}

// getting the bordername by fetching API with the country-code from the borderArray and with it getting the name

const getBorderNames = async (borderArray) => {
    for(let i = 0; i < borderArray.length; i++) {
        if(borderArray == "no countries") {
            border_header.style.visibility = "hidden";
        } else {
            let border = document.createElement("div");
            border.classList.add("container");
            border.classList.add("border-country");
            border_panel.append(border);
            let prom = await fetch(`https://restcountries.com/v3.1/alpha/${borderArray[i]}`)
            let jsD = await prom.json()
            let border_country = jsD[0].name.common;
            border.innerHTML = border_country;
        }
        containers = document.querySelectorAll(".container");
        isDarkThemeOn(containers)
    }
}

const createCountryContainer = (countries) => {
    countries.forEach(country => {
        if(localname == country.name.common) {
            let langArray = []; 
            let currArray = [];
            let borderArray = [];
            Object.values(country.languages).forEach(val => langArray.push(val));
            Object.values(country.currencies).forEach(val => currArray.push(val.name));
            if(country.borders != undefined) {
                Object.values(country.borders).forEach(val => borderArray.push(val)); 
            } else {
                borderArray = "no countries";
            }
            country_header.innerHTML = `${country.name.common}`;

            background_image.innerHTML = `
            <img src=${country.flag}>
            ` 
            container_info.innerHTML = `
            <p><span>Native Name:</span>${country.name.common}</p>
            <p><span>Population:</span>${country.population}</p>
            <p><span>Region:</span>${country.region}</p>
            <p><span>Sub Region:</span> ${country.subregion}e</p>
            <p><span>Capital:</span>${country.capital}</p>
            `
            container_moreinfo.innerHTML = `
            <p><span>Top Level Domain:</span>${country.tld}</p>
            <p><span>Currencies:</span>${currArray}</p>
            <p><span>Languages:</span>${langArray}</p>
            `
            
            getBorderNames(borderArray);
            containers = document.querySelectorAll(".container");
        }
    })
}

const handleData = async () => {
    let jsData = await fetchCountryAPI()
    let countries = jsData.map(object => {
        return {name: object.name, population: object.population, 
                region: object.region, subregion: object.subregion, 
                capital: object.capital, languages: object.languages, 
                currencies: object.currencies, tld: object.tld, flag: object.flags.png, borders: object.borders}
    })
    createCountryContainer(countries);
}

handleData();

