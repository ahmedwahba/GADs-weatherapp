
function adjustBodyStyle() {
    document.body.style.height = window.innerHeight + "px";
    let overlay = document.querySelector('.parent-container');
    if (overlay) {
        overlay.style.height = window.innerHeight + "px";  
    }
}

function adjustBackground() {
    const currentBGs = {
        default : "url('../images/default.jpg')",
        down: "url('../images/down.jpg')",
        noon: "url('../images/noon.jpg')",
        sunset: "url('../images/sunset.jpg')",
        night: "url('../images/night.png')",
    };
    const daytime = new Date().getHours();
    switch (true) {
        case (daytime > 20):
            document.body.style.backgroundImage = currentBGs.night;
            break;
        case (daytime >= 18):
            document.body.style.backgroundImage = currentBGs.sunset;
            break;
        case (daytime >= 10):
            document.body.style.backgroundImage = currentBGs.noon;
            break;
        case (daytime > 5):
            document.body.style.backgroundImage = currentBGs.down;
            break;
        default:
            document.body.style.backgroundImage = currentBGs.default;
            break;
    }
}

function addMenuToggleListener() {
    const menuIcon = document.querySelector('#side-menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click',(event) => {
            const menu = document.querySelector('#menu-items');
            const myCity = document.querySelector('#my-city');
            if (myCity && myCity.style.display === "inline-block") {
                myCity.style.display = "block";
            }
            menu.classList.toggle('side-menu-list');
        });
    }
}

function setCurrentActiveTab(tabid) {
    let allItems = document.querySelectorAll(".menu-items .item");
    allItems.forEach((item) => {
        item.classList.remove("active");
    });
    let tab = document.querySelector(tabid);
    tab.classList.add("active");
}

function onSearchPress() {
    const searchField = document.querySelector('#city-search');
    if (searchField?.value !== "") {
        onCityPress(searchField.value);
    }
}

function loadDefaultCity() {
    getTempratureForCity().then((result) => {
        console.log('else res--->', result);
        setCurrentActiveTab("#default-city");
        let mainWeather = {
            name: result.name,
            temp: result.main.temp,
            humidity: result.main.humidity,
            windSpeed: result.wind.speed,
            weatherIcon: result.weather[0].icon
        }
        bindWeatherData(mainWeather);
    });
}

function loadWeather() {
    const currentURL = new URL(window.location.href);
    const city = currentURL.searchParams.get("city");
    const myLocation = currentURL.searchParams.get("mylocation");
    if (city) {
        getTempratureForCity(city).then((result) => {
            console.log('if res--->', result);
            if (result.cod == 200) {
                let mainWeather = {
                    name: result.name,
                    temp: result.main.temp,
                    humidity: result.main.humidity,
                    windSpeed: result.wind.speed,
                    weatherIcon: result.weather[0].icon
                }
                bindWeatherData(mainWeather); 
                saveCityOnSearch(city);
            } else {
                loadDefaultCity();
                document.location.href = document.location.origin;
                alert("Error while getting weather of your city, Try again with correct name");
            }
        });
    } else if (myLocation) {
        setCurrentActiveTab("#my-location");
        getMyLocationWeather()
    } else {
        loadDefaultCity();
    }
}

function saveCityOnSearch(city) {
    let cities = JSON.parse(localStorage.getItem("cities"));
    if (cities && cities.length > 0) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(Array.from(new Set(cities))));
    } else {
        cities = [];
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(Array.from(new Set(cities))));
    }
}

function onCityPress(cityName) {
    let URL = document.location.origin;
    if (cityName) {
        URL = URL + "?city=" + cityName;
    }
    document.location.href = URL;
}

function setCurrentCityName() {
    const currentCity = document.querySelector('#my-city');
    const myCity = sessionStorage.getItem('currentCity');
    if (myCity) {
        if (myCity !== "New York") {
            currentCity.innerHTML = myCity;
            currentCity.style.display = "inline-block";
        }
    } else {
        getClientCity().then((result) => {
            console.log('current   --', result);
            if (currentCity && result.location?.city) {
                sessionStorage.setItem('currentCity', result.location.city);
                if (result.location.city !== "New York") {
                    currentCity.innerHTML = result.location.city;
                    currentCity.style.display = "inline-block";
                }
            }
        });
    }
}

function addCurrentCityClickListener() {
    const currentCity = document.querySelector('#my-city');
    if (currentCity) {
        setCurrentActiveTab("#my-city");
        currentCity.addEventListener('click',(event) => {
            onCityPress(currentCity.innerHTML);
        });
    }
}


function onMyLocationPress() {
    setCurrentActiveTab("#my-location");
    let URL = document.location.origin + "?mylocation=true";
    document.location.href = URL;
}

function onRecentCitiesPress() {
    setCurrentActiveTab("#recent-cities");
    let URL = document.location.origin + "/pages/recentCities.html";
    document.location.href = URL;
}

function loadRecentCities() {
    setCurrentActiveTab("#recent-cities");
}

document.addEventListener('DOMContentLoaded', (event) => {
    adjustBodyStyle();
    adjustBackground();
    addMenuToggleListener();
    setCurrentCityName();
    addCurrentCityClickListener();
    if (window.location.pathname !== '/pages/recentCities.html') {
        loadWeather();
    } else {
        loadRecentCities();
    }
})

