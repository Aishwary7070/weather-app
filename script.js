const city = document.getElementById("location");
const weather = document.getElementById("weather");
const weatherImg = document.getElementById("weatherImg");
const body = document.querySelector("body");
const minTemp = document.getElementById("min-temp");
const maxTemp = document.getElementById("max-temp");
const humid = document.getElementById("humidity");
const windSpeed = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visible = document.getElementById("visible");
const degree = document.getElementById("degree");
const dateUpdate = document.getElementById("date-update");
const timeUpdate = document.getElementById("time-update");
const sunriseUI = document.getElementById("sunrise");
const sunsetUI = document.getElementById("sunset");
const search = document.getElementById("search-navbar");
const searchBtn = document.getElementById("search-btn");


let cityName = "Hazaribag";
const apiKey = import.meta.env.VITE_API_KEY;

fetchingAPI();

searchBtn.addEventListener("click", function (e) {
  cityName = search.value;
  fetchingAPI();
});

search.addEventListener("keypress", function (e) {
    if(e.key === 'Enter'){
        cityName = search.value;
        fetchingAPI();
    }
    
  });

function updateTimeAndDateUI() {
  const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrusday",
    "Friday",
    "Saturday",
  ];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  setInterval(() => {
    let date = new Date();
    let year = date.getFullYear();
    let mont = date.getMonth();
    let monthDate = date.getDate();
    let hour = date.getHours();
    let day = date.getDay();
    let hrIn12Formate = hour > 12 ? hour % 12 : hour;
    let amPm = hour > 12 ? "PM" : "AM";
    let minute = date.getMinutes();
    if(minute < 10){
        toString(minute);
        minute = '0' + minute;
        parseInt(minute)
    }

    dateUpdate.innerHTML = `${week[day]}, ${month[mont]} ${monthDate}, ${year}`;
    timeUpdate.innerHTML = `${hrIn12Formate} : ${minute} ${amPm}`;
  }, 1000);
}
function fetchingAPI() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      weatherData(data);
    })
    .catch((error) => {
      alert("Please enter correct city name");
    });
}

function weatherData(data) {
  degree.innerHTML = `${data.main.temp}°C`;
  weather.innerHTML = `${data.weather[0].main}`;
  if (data.weather[0].main === "Clouds") {
    weatherImg.src = "./images/cloud.png";
    body.style.background = "rgb(88,105,147);";
    backgroundChangeFxn(data.weather[0].main);
  } else if (data.weather[0].main === "Rain") {
    weatherImg.src = "./images/Rain.png";
    backgroundChangeFxn(data.weather[0].main);
  } else if (data.weather[0].main === "Thunderstorm") {
    weatherImg.src = "./images/Storm.png";
    backgroundChangeFxn(data.weather[0].main);
  } else if (data.weather[0].main === "Clear") {
    weatherImg.src = "./images/sun.png";
    backgroundChangeFxn(data.weather[0].main);
  }else if (data.weather[0].main === "Haze") {
    weatherImg.src = "./images/haze.png";
    backgroundChangeFxn(data.weather[0].main);
  }else if (data.weather[0].main === "Smoke") {
    weatherImg.src = "./images/smoke.png";
    backgroundChangeFxn(data.weather[0].main);
  }
  miniumTempFxn(data);
  maximumTempFxn(data);
  humidityFxn(data);
  windSpeedFxn(data);
  pressureFxn(data);
  visibleFxn(data);
  updateTimeAndDateUI();
  updateLocationFxn(data);
  const timezone = data.timezone;
  sunriseFxn(data, timezone);
  sunsetFxn(data, timezone);
}

function updateLocationFxn(data) {
  city.innerHTML = `${data.name}`;
}
function backgroundChangeFxn(weather) {
    if(weather === 'Clear'){
        body.style.backgroundImage = "linear-gradient(#2A3E96, #477AFC)";
        
    }else if(weather === 'Haze' || weather === 'Smoke'){
      body.style.backgroundImage = "linear-gradient(#9FAADD, #96B0F1)";
      search.style.backgroundColor = "#B3C8FC"
  }
    else{
        body.style.backgroundImage = "linear-gradient(#05060B, #586993)";
    }
  
}

function miniumTempFxn(data) {
  minTemp.innerHTML = `${Math.floor(data.main.temp_min)}°C`;
}

function maximumTempFxn(data) {
  maxTemp.innerHTML = `${Math.floor(data.main.temp_max)}°C`;
}

function humidityFxn(data) {
  humid.innerHTML = `${data.main.humidity}%`;
}

function windSpeedFxn(data) {
  windSpeed.innerHTML = `${data.wind.speed}km/hr`;
}

function pressureFxn(data) {
  pressure.innerHTML = `${data.main.pressure}`;
}

function visibleFxn(data) {
  visible.innerHTML = `${data.visibility / 1000}km`;
}

function sunriseFxn(data, timezone) {
  const sunrise = data.sys.sunrise;
  sunriseUI.innerHTML = `${sunRISEorSETtiming(sunrise, timezone)}`;
}

function sunsetFxn(data, timezone) {
  const sunset = data.sys.sunset;
  sunsetUI.innerHTML = `${sunRISEorSETtiming(sunset, timezone)}`;
}

// convert sunrise and sunset into HH:MM:SS AM/PM formate
function sunRISEorSETtiming(Timestamp, timezone) {
  // Convert to milliseconds, apply timezone offset
  const localSunrise = new Date((Timestamp + timezone) * 1000);

  // Manually format to HH:MM:SS AM/PM without relying on system timezone
  let hours = localSunrise.getUTCHours();
  let minutes = localSunrise.getUTCMinutes();
  let seconds = localSunrise.getUTCSeconds();

  // Convert to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert hour '0' to '12' for 12-hour format

  // Pad minutes and seconds with leading zeros if needed
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  // Format final result
  const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  return formattedTime;
}

// console.log(sunRISEorSETtiming(1729852501, 3600))
// setInterval(()=>{
    
// })