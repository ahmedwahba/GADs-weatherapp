//import getTempratureForCity from './tempServices';

//const getTempratureForCity = require('./tempServices');

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

function onSearchPress() {
    const searchField = document.querySelector('#city-search');
    if (searchField?.value !== "") {
        onCityPress(searchField.value);
    }
}

function bindWeatherData(data) {
    let cityName = document.querySelector('#city-name');
    if (data.name && cityName) {
        cityName.innerHTML = data.name;
    }
    let tempValue = document.querySelector('#temp-value');
    if (data.main?.temp && tempValue) {
        tempValue.innerHTML = Number(data.main.temp).toFixed(0);
    }
    let humadityValue = document.querySelector('#humadity-value');
    if (data.main?.humidity && humadityValue) {
        humadityValue.innerHTML = data.main.humidity;
    }
    let windValue = document.querySelector('#wind-value');
    if (data.wind?.speed && windValue) {
        windValue.innerHTML = data.wind.speed;
    }
}

function loadDefaultCity() {
    getTempratureForCity().then((result) => {
        console.log('else res--->', result);
        bindWeatherData(result);
    });
}

function loadcityWeather() {
    const currentURL = new URL(window.location.href);
    const city = currentURL.searchParams.get("city");
    if (city) {
        getTempratureForCity(city).then((result) => {
            console.log('if res--->', result);
            if (result.cod == 200) {
                bindWeatherData(result); 
            } else {
                loadDefaultCity();
                document.location.href = document.location.origin;
                alert("Error while getting weather of your city, Try again with correct name");
            }
        });
    } else {
       loadDefaultCity();
    }
}

function onCityPress(cityName) {
    let URL = document.location.origin;
    if (cityName) {
        URL = URL + "?city=" + cityName;
    }
    document.location.href = URL;
}

function getCurrentCity() {
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
        currentCity.addEventListener('click',(event) => {
            onCityPress(currentCity.innerHTML);
        });
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    adjustBodyStyle();
    adjustBackground();
    addMenuToggleListener();
    getCurrentCity();
    addCurrentCityClickListener();
    loadcityWeather();
})

