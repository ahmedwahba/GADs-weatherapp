
function getImageURL(icon) {
    return "https://openweathermap.org/img/wn/" + icon + "@2x.png";
}

function bindWeatherData(weatherObj) {
    let cityName = document.querySelector('#city-name');
    if (weatherObj.name && cityName) {
        cityName.innerHTML = weatherObj.name;
    }
    let tempValue = document.querySelector('#temp-value');
    let tempUnit = document.querySelector(".temp-degree .degree-unit");
    if (weatherObj.temp && tempValue) {
        tempValue.innerHTML = Number(weatherObj.temp).toFixed(0);
        tempUnit.style.display = "inline-block";
    }
    let humadityValue = document.querySelector('#humadity-value');
    if (weatherObj.humidity && humadityValue) {
        humadityValue.innerHTML = weatherObj.humidity;
    }
    let windValue = document.querySelector('#wind-value');
    if (weatherObj.windSpeed && windValue) {
        windValue.innerHTML = weatherObj.windSpeed;
    }
    let tempIcon = document.querySelector('#temp-icon');
    if (weatherObj.weatherIcon && tempIcon) {
        tempIcon.style.backgroundImage = "url(" + getImageURL(weatherObj.weatherIcon ) + ")";
    }
}

function getDayName(date) {
    let d = new Date(Number(date) * 1000);
    return d.toString().split(' ')[0];
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); 
    template.innerHTML = html;
    return template.content.firstChild;
}


function creatDayDOM(day) {
    let dayName = getDayName(day.dt);
    let dayTemp = Number(day.temp?.day).toFixed(0);
    let dayElement = ` <div class="week-day">
                        <div class="day-name">${dayName}</div>
                        <div class="temp">${dayTemp}<span class="unit"> &deg; </span></div>
                        <div class="icon" code="${day.weather[0]?.icon}"></div>
                    </div>`;
    
    return htmlToElement(dayElement);
}

function loadWeekWeatherIcons() {
    let icons = document.querySelectorAll("#week-card .icon");
    icons.forEach((icon) => {
        icon.style.backgroundImage = "url(" + getImageURL(icon.attributes.code.value ) + ")";
    })
}

function bindWeekWeather(weekData) {
    let weekCard = document.querySelector('#week-card');
    weekCard.innerHTML = "";
    if (weekData.length > 0) {
        weekData.forEach((day) => {
           let dayElem = creatDayDOM(day);
           weekCard.appendChild(dayElem);
        });
        weekCard.style.borderWidth = "1px";
        loadWeekWeatherIcons();
    }
}

function loadMylocationWeatherData(weatherData) {
    let mainWeather = {
        name: weatherData.timezone?.split('/')[1],
        temp: weatherData.current.temp,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current['wind_speed'],
        weatherIcon: weatherData.current.weather[0].icon
    }
    bindWeatherData(mainWeather);
    bindWeekWeather(weatherData.daily);
}

function getMyLocationWeather() {
    const postionCallback = (position) => {
        getTempratureForPosition(position.coords.latitude, position.coords.longitude)
            .then((result) => {
               loadMylocationWeatherData(result)
            })
            .catch((error) => {
                alert("Error while getting weather in your location, ", error);
            })
    };
    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(postionCallback,(error) =>{
            alert("Error: failed to get location" + error.message);   
        });
    } else {
       alert("Error: can not get your current locartion"); 
    }
}