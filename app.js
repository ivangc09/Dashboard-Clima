let cityInput = document.getElementById('city_input');
let searchBtn = document.getElementById('searchBtn');
let locationBtn = document.getElementById('locationBtn');
let currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
let fiveDaysForecastCard = document.querySelector('.day-forecast');
let aqiCard = document.querySelectorAll('.highlights .card')[0];
let aqiList = ['Good','Fair','Moderate','Poor','Very Poor'];
let sunriseCard = document.querySelectorAll('.highlights .card')[1];
let humidityVal = document.getElementById('humidityVal');
let pressureVal = document.getElementById('pressureVal');
let visibiltyVal = document.getElementById('visibiltyVal');
let windSpeedyVal = document.getElementById('windSpeedyVal');
let feelsVal = document.getElementById('feelsVal');

let apiKey = 'b827dd3423eb7efb584d8891fb6d8071';


function getWeatherDetails(name,lat,lon,country,state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    AIR_QUALITY_API_URL =  `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    days =[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],

    months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                        <img src="assets/04d@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-light fa-calendar"></i> &ensp; ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i> &ensp; ${name}, ${country}</p>
            </div>        
        `;

        let {sunrise,sunset} = data.sys,
        {timezone, visibility} = data,
        {humidity,pressure,feels_like} = data.main,
        {speed} = data.wind,
        sRiseTime = moment.utc(sunrise,'X').add(timezone, 'seconds').format('hh:mm A'),
        sSetTime = moment.utc(sunset,'X').add(timezone, 'seconds').format('hh:mm A');

        sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>

                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunset fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
        `;


        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure}hPa`;
        visibiltyVal.innerHTML = `${visibility /1000}km`;
        windSpeedyVal.innerHTML = `${speed}m/s`;
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;

    }).catch(() => {
        alert('Failed to fetch the current weather');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();

            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });

        fiveDaysForecastCard.innerHTML = '';
        for(i = 0; i < fiveDaysForecast.length; i++){
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="assets/02d@2x.png" alt="">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>

                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert('Failed to fetch weather forecast');
    });


    fetch(AIR_QUALITY_API_URL).then(res => res.json()).then(data => {
        console.log(data)
        let{co,no,no2,o3,so2,pm2_5,pm10,nh3} = data.list[0].components;

        aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>

            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>

                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>

                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>

                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>

                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>

                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>

                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>
        `;
        
    }).catch(() => {
        alert('Failed to fetch air quality');
    });
}

searchBtn.addEventListener('click',function getCityCoordinates (){
    let cityName = cityInput.value.trim();
    cityInput = '';

    if (!cityName){
        return;
    }

    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let {name,lat,lon,country,state} = data[0];
        getWeatherDetails(name,lat,lon,country,state)
    }).catch(() =>{
        alert(`Failed`);
    });
});
