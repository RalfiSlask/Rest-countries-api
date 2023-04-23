const dropdown = document.querySelector(".container-dropdown");
const button_dropdown = document.querySelector(".dropdown-logo");
const button_darkmode = document.querySelector(".moon-logo");
const section_countries = document.querySelector(".section-countries");
const input = document.querySelector(".input-countries");
const main = document.querySelector("main");
const moon_logo = document.querySelector(".moon-logo");
const regions = document.querySelectorAll(".container-dropdown p");
const body = document.querySelector("body");
let containers = document.querySelectorAll(".container");
let actualTheme = body.classList;

const regionDropdownOnClick = () => {
    button_dropdown.onclick = () => {
        dropdown.classList.toggle("visible");
    }
}

const activateDarkmode = () => {
    button_darkmode.onclick = () => {
        body.classList.toggle("dark");
        containers.forEach(container => {
            container.classList.toggle("dark2");
        })
        localStorage.setItem("theme", actualTheme);
    }
}

const isDarkThemeOn = (cont) => {
    let theme = localStorage.getItem("theme");
    if(theme == "dark") {
        body.classList.add("dark");
        cont.forEach(container => {
            container.classList.add("dark2");
        })
    } else {
        body.classList.remove("dark");
        cont.forEach(container => {
            container.classList.remove("dark2");
        })
    }
}

const fetchRestApi = async () => {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,population,capital,borders");
        const jsonData = await response.json();
        return jsonData;
    } catch(error) {
        console.log(error)
    } 
}

const onLoad = () => {
    document.addEventListener("DOMContentLoaded", () => {
        regionDropdownOnClick();
        activateDarkmode();
        fetchRestApi(); 
    })
}

onLoad();

const searchForCountry = (countries, name) => {
    input.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        if(!name.toLowerCase().includes(value)) {
            countries.classList.add("hidden");
        } else {
            countries.classList.remove("hidden");
        }
    })  
}

// Storing Country name as a variable in localstorage and changing the location

const clickingOnCountries = (countries, name) => {
    countries.onclick = () => {
        localStorage.setItem("name", name);
        location.assign("country.html")
    }
}

const filterByRegion = (reg, countries) => {
    regions.forEach(region => {
        region.addEventListener("click", () => {
            let isVisible = region.innerHTML == reg;
            countries.classList.toggle("hidden", !isVisible)
        })
    })
}

const createCountryContainers = (flag, name, population, region, capital) => {
    const container_country = document.createElement("div");
    container_country.classList.add("container-country");
    container_country.classList.add("container");
    container_country.innerHTML = `<div class="flag">
    <img src="${flag}">
    </div>
    <h3 class="country">${name}</h3>
    <div class="info-panel">
        <p class="population"><span>Population:</span>${population}</p>
        <p class="Region"><span>Region:</span>${region}</p>
        <p class="City"><span>Capital:</span>${capital}</p>
    </div>`
    section_countries.append(container_country);
}

const handleData = async () => {
    const jsData = await fetchRestApi();
    for(let i = 0; i < jsData.length; i++) {
        let country = jsData[i];
        const flag = country.flags.png;
        const name = country.name.common;
        const region = country.region;
        const population = country.population;
        const capital = country.capital;
        createCountryContainers(flag, name, population, region, capital);  
        let countries = document.querySelectorAll(".container-country");
        filterByRegion(region, countries[i]); 
        searchForCountry(countries[i], name);
        clickingOnCountries(countries[i], name);
    }     
    containers = document.querySelectorAll(".container");
    isDarkThemeOn(containers);
}


handleData(); 










