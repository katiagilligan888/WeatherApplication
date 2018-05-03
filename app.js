
window.onload = weatherData;


let lat;
let lang;
let result;
let newTemp;

let tempCelsius = false;

let summary = document.getElementById('summary');
let temperature = document.getElementById('temperature');
let time = document.getElementById('time');
let button = document.getElementById('button');
let currentLocation = document.getElementById('location');


function weatherData(){
    let currentPosition;
        //get the coordinates of the users location
    navigator.geolocation.getCurrentPosition(function(position){
    currentPosition = position;
    lat = currentPosition.coords.latitude;
    lng = currentPosition.coords.longitude;
    console.log("latitude: " + lat + " longitude: " + lng);
    googleReverseGeolocation(lat,lng);
    ajaxWeatherCall();
    setInterval(ajaxWeatherCall, 1000 * 60 * 30);
    });
}

function googleReverseGeolocation(lat, lng){
    let apiKey = "AIzaSyAypr-JaVXvORTVxDQuFv0vGhGMeeGr64w"
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + apiKey, true)
    xhr.onload = function(){
        if(this.status === 200){
            result = JSON.parse(this.responseText);
            currentLocation.innerHTML = result.results[2].formatted_address; 
        }
        else {
            console.log("There was a error with the request");
        }
    }
    xhr.send();
}


function ajaxWeatherCall(){

        //AJAX call
    let apiKey = "2c1796047341253aa42573d20f77f040/";
    let xhr = new XMLHttpRequest();
    xhr.open('GET',"https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + apiKey + lat + "," + lng, true)
    xhr.onload = function(){
        if(this.status === 200){
            result = JSON.parse(this.responseText);
            console.log(result);
            displayData();
            setInterval(displayData, 1000 * 30);
            }
            else{
                console.log("There was an error with the request")
            }
        }
    xhr.send();      
}

function displayData() {
    summary.innerHTML = result.currently.summary;
    temperature.innerHTML = Math.floor(result.currently.temperature) + "&deg F"; 
    time.innerHTML = displayTime();
    function skycons() {
        const skycons = new Skycons({"color": "#003B46", "resizeClear": true});
        skycons.add(document.getElementById("icon1"), result.currently.icon);
        skycons.play();
    }
    console.log("Its interval is working");
    skycons();
    switchMeasurement();
}

function displayTime(){
    const time = new Date();
    const options = {hour12: true, hour: "numeric", minute: "numeric", weekday: "long"};
     return time.toLocaleString('en-US', options)
}

function fahrenheit(celsius){
    return Math.floor(celsius * 9/5 + 32);
}

function celsius(fahrenheit){
    return Math.floor((fahrenheit - 32) * 5/9);
}

function switchMeasurement(){
    document.getElementById("button").addEventListener("click", function(){
        const temp = result.currently.temperature;
        if (!tempCelsius){
            newTemp= celsius(temp);
            tempCelsius = true;
            temperature.innerHTML = newTemp + "&deg C";
            button.innerHTML = "Switch to &deg F";
        }else if (tempCelsius){
            newTemp = fahrenheit(newTemp);
            tempCelsius = false;
            temperature.innerHTML = newTemp + "&deg F";
            button.innerHTML = "Switch to &deg C";
        }else{
            console.log("Error with temperature calculations");
            }
    });
}


