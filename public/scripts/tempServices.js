const APP_ID = 'd43a204d705dee337054cb4e8b38fdeb';

function getClientCity() {
    return new Promise((resolve, reject) => {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
    
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            } 
        });
        const URL = "https://api.ipregistry.co/?key=hyl7c0xgpb0yth";
    
        xhr.open("GET", URL, true);
    
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Access-Control-Allow-Credentials", true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.send(data);
    })
}

function getTempratureForCity(city) {
    return new Promise((resolve, reject) => {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
    
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            } 
        });
    
        let params = {
            q: city ? city : 'New York',
            units: 'metric'
        };
        const URL = "https://api.openweathermap.org/data/2.5/weather?q=";
    
        xhr.open("GET", URL + params.q + "&appid=" + APP_ID + "&units=" + params.units, true);
    
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send(data);
    })
}

function getTempratureForPosition(lat, long) {
    return new Promise((resolve, reject) => {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
    
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            } 
        });
    
        let paramsString = "?lat="     + lat +  
                           "&lon="     + long + 
                           "&exclude=" + "hourly" + 
                           "&appid="   + APP_ID + 
                           "&units="   + "metric"; 
        const URL = "https://api.openweathermap.org/data/2.5/onecall";
    
        xhr.open("GET", URL + paramsString, true);
    
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send(data);
    })
}
