let cityInput = document.getElementById('city_input');
let searchBtn = document.getElementById('searchBtn');
let locationBtn = document.getElementById('locationBtn');
let api_key = 'b827dd3423eb7efb584d8891fb6d8071';

searchBtn.addEventListener('click',function getCityCoordinates (){
    let cityName = cityInput.value.trim();
    cityInput = '';

    if (!cityName){
        return;
    }

    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},{state code},{country code}&limit=1&
    // appid=${api_key}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        console.log(data)
    }).catch(() =>{
        alert(`Failed`);
    });
});
