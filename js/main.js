const QUANTITY_NEXT_DAYS = 3;
const UNIT_CELSIUS = 'metric';
const UNIT_FAHRENHEIT = 'imperial';
const EN_LANGUAGE = 'en';
const RU_LANGUAGE = 'ru';

const searchElementTranslate = {
  ru: {
    placeholder: 'Город Район Область',
    search: 'поиск'
  },
  en: {
    placeholder: 'Town Region',
      search: 'search'
  }
};

function initWeatherApp () {
  const language = document.querySelector('.language-button-content');
  const temperatureButtons = document.querySelector('.temperature-buttons');
  const mapContainer = document.querySelector('.user-location__geolocation');

  const searchField = document.querySelector('.search-field');
  const searchButton = document.querySelector('.search-button');

  let lang = localStorage.getItem('lang') || EN_LANGUAGE;
  let unitDegree = localStorage.getItem('unitDegree') || UNIT_CELSIUS;
  let cityName;

  getBackkgroundImage();
  changeBackgroundHandly();
  getCoordinateCurrentCityNavigator(mapContainer, lang, unitDegree, cityName, searchField, searchButton);
  setDefaultAttributeValueLanguageUnit(language, lang, unitDegree);

  temperatureButtons.addEventListener('change', (event) => changeTemperatureUnit(event) );
  language.addEventListener('change',  () => changeLanguage(language, searchField,  searchButton, lang));
  searchButton.addEventListener('click', ()=> getDataSearchForm(mapContainer, cityName, searchField));
  searchField.addEventListener('keydown', (e) => getDataSearchFormPressEnter(mapContainer, e, cityName, searchField)); 
}

function setDefaultAttributeValueLanguageUnit(language, lang, unitDegree) {
  const options = document.querySelectorAll('option');
  const unitButtons = document.querySelectorAll('.radio-input');

  if(language.value === lang) {
    options[0].setAttribute('selected', true);
  } else {
    options[1].setAttribute('selected', true);
  } 

  if(unitDegree === UNIT_CELSIUS) {
    unitButtons[0].checked = true;
  } else {
    unitButtons[1].checked = true;
  } 
}

function getDataLocalStorage() {
  latitudeCurrentCity = localStorage.getItem('latitudeCurrentCity');
  longitudeCurrentCity = localStorage.getItem('longitudeCurrentCity');
  lang = localStorage.getItem('lang');
  unitDegree = localStorage.getItem('unitDegree');
}

function setDAtaLocalStorage(latitudeCurrentCity, longitudeCurrentCity, lang, unitDegree) {
  localStorage.setItem('latitudeCurrentCity', latitudeCurrentCity);
  localStorage.setItem('longitudeCurrentCity', longitudeCurrentCity );
  localStorage.setItem('lang', lang);
  localStorage.setItem('unitDegree', unitDegree);
}

function changeTemperatureUnit(event) {
  const item = event.target.id;
  getDataLocalStorage();

if(item === 'temperature-celsius'){
    unitDegree = UNIT_CELSIUS;
    localStorage.setItem('unitDegree', unitDegree);
    getPlaceNameWeatherDataPlace(lang, latitudeCurrentCity, longitudeCurrentCity);
  } else {
    unitDegree = UNIT_FAHRENHEIT;
    localStorage.setItem('unitDegree', unitDegree);
    getPlaceNameWeatherDataPlace(lang, latitudeCurrentCity, longitudeCurrentCity);
  }
}

function changeLanguage(language, searchField,  searchButton, lang){
  lang = language.value;
  localStorage.setItem('lang', lang);
  setSelectedLanguage(latitudeCurrentCity, longitudeCurrentCity, searchField,  searchButton, lang);
}

function setSelectedLanguage (latitudeCurrentCity, longitudeCurrentCity, searchField,  searchButton, lang) {
  getDataLocalStorage();
  getCurrentFullTime(lang);
  getPlaceNameWeatherDataPlace(lang, latitudeCurrentCity, longitudeCurrentCity);
  translateSearchForm(searchField,  searchButton, lang);
}

function translateSearchForm(searchField,  searchButton, lang) {
  searchField.setAttribute('placeholder',`${searchElementTranslate[lang].placeholder}`);
  searchButton.innerHTML = `${searchElementTranslate[lang].search}`.toUpperCase();
}

function getDataSearchFormPressEnter(mapContainer, e, cityName, searchField){
  if (e.keyCode === 13) {
    e.preventDefault();
    getDataSearchForm(mapContainer, cityName, searchField);
  }
}

function getDataSearchForm(mapContainer, cityName, searchField){
  cityName = searchField.value;
  searchField.value ='';
  getCoordinateByPlaceName(mapContainer, cityName);
}

// Initialize and add the map
function initMap(mapContainer, latitudeCurrentCity, longitudeCurrentCity, cityName) {
  const city = { lat: latitudeCurrentCity, lng: longitudeCurrentCity };
  mapboxgl.accessToken = 'pk.eyJ1Ijoicm1sZXZzaGEiLCJhIjoiY2tsYzJkYTh2MWRudTJ4bjByZDczcXpxOCJ9.a0ZsKhYLsJ6ogaUa3AnPAQ';

  const map = new mapboxgl.Map({
  container: mapContainer,
  style: 'mapbox://styles/mapbox/streets-v12',
  center: city, 
  zoom: 7
  });

  const marker = new mapboxgl.Marker()
    .setLngLat(city)
    .addTo(map);
}

/*--------------------get current month, day, time---------------*/

function getCurrentFullTime(lang) {
  let today = new Date();
  
  switch (lang) {
    case EN_LANGUAGE: [dayToday, month, dateToday, , timeNow] = today.toString().split(' ');
      break; 
  
    case lang:[dayToday, dateToday, month, timeNow]= today.toLocaleString(`${lang}`, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }).replace(/[.,\/#!$%\^&\*;{}=\-_`~()]/g,'').split(' ');
      break;
  }
  setInterval(() => {
    showCurrentTime(dayToday, month, dateToday, timeNow);
  }, 1000);
}

function showCurrentTime(dayToday, month, dateToday, timeNow) {
  const monthElement = document.querySelector('.month');
  const dateTodayElement = document.querySelector('.date-today');
  const dayTodayElement = document.querySelector('.day-today');
  const timeElement = document.querySelector('.time');

  monthElement.innerHTML = month;
  dateTodayElement.innerHTML = dateToday;
  dayTodayElement.innerHTML = dayToday;
  timeElement.innerHTML = timeNow;
}

/*--------------------get geolocation--------------------*/

function showCurrentCountryNameCityName(currentCountry, currentTown) {
  const countryNameElement = document.querySelector('.country-name');
  const cityNameElement = document.querySelector('.city-name');

  countryNameElement.innerHTML = currentCountry.toUpperCase();
  cityNameElement.innerHTML = currentTown.toUpperCase();
}

function getCoordinateCurrentCityNavigator(mapContainer, lang, unitDegree, cityName, searchField, searchButton) {
  navigator.geolocation.getCurrentPosition(success, error, {
    maximumAge: 60000,
    timeout: 5000,
    enableHighAccuracy: true,
  });

  function success(pos) {
    const crd = pos.coords;
    latitudeCurrentCity = +crd.latitude;
    longitudeCurrentCity = +crd.longitude;

    initMap(mapContainer, latitudeCurrentCity, longitudeCurrentCity, cityName);
    setDAtaLocalStorage(latitudeCurrentCity, longitudeCurrentCity, lang, unitDegree);
    setSelectedLanguage (latitudeCurrentCity, longitudeCurrentCity, searchField, searchButton, lang);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    getCoordinateIpAdress (mapContainer, searchField, searchButton);
  } 
}

async function getCoordinateIpAdress (mapContainer, searchField, searchButton) {
  const response = await fetch('https://ipinfo.io/json?token=543fd5d393e868');
    const place = await response.json();
    [latitude, longitude] = place.loc.split(',');
    
    latitudeCurrentCity = +latitude;
    longitudeCurrentCity = +longitude;

    initMap(mapContainer, latitudeCurrentCity, longitudeCurrentCity, cityName);
    setDAtaLocalStorage(latitudeCurrentCity, longitudeCurrentCity, lang, unitDegree);
    setSelectedLanguage (latitudeCurrentCity, longitudeCurrentCity, searchField, searchButton, lang);
}

async function getPlaceNameWeatherDataPlace(lang, latitudeCurrentCity, longitudeCurrentCity){
  await getPlaceNameByCoordinate(latitudeCurrentCity,longitudeCurrentCity );
  await getWeatherData(lang, latitudeCurrentCity, longitudeCurrentCity);
}

async function getPlaceNameByCoordinate(latitudeCurrentCity,longitudeCurrentCity ) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitudeCurrentCity.toString()},${longitudeCurrentCity.toString()}&key=0f2efca19d1747cd906baa8bb7f8c2f7&language=${lang}`;
  const response = await fetch(url);
  const place = await response.json();
  
  const currentCountry = place.results[0].components.country;
  const currentTown = place.results[0].components.hamlet || place.results[0].components.town || place.results[0].components.city;

  showCurrentCountryNameCityName(currentCountry, currentTown);
  showCoordinateCurrentPlace(place);
}

function showCoordinateCurrentPlace(place) {
  const latitudeElement = document.querySelector('.latitude');
  const longitudeElement = document.querySelector('.longitude');

  latitudeElement.innerHTML = `${coordinateName[lang].latitude}  ${place.results[0].annotations.DMS.lat}`;
  longitudeElement.innerHTML = `${coordinateName[lang].longitude} ${place.results[0].annotations.DMS.lng}`;
}

async function getWeatherData(lang, latitudeCurrentCity, longitudeCurrentCity) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeCurrentCity.toString()}&lon=${longitudeCurrentCity.toString()}&units=${unitDegree}&appid=0f57bad2b641ca690297cce9e9f87665&lang=${lang}`;
  const responseWeatherData = await fetch(url);
  const weatherData = await responseWeatherData.json();
 
  showCurrentWeatherPlace(weatherData);
  setNextDays(lang, weatherData);
}

function showCurrentWeatherPlace(weatherData){
  showCurrentTemperature(weatherData);
  showCurrentWeatherDescribe(lang, weatherData);
  showCurrentIcon(weatherData);
}

function showCurrentTemperature(weatherData) {
  const currentTemperature = document.querySelector('.weather-today__temperature_number_value');
  currentTemperature.innerHTML = Math.trunc(weatherData.list[0].main.temp);
}

function showCurrentIcon(weatherData) {
  const currentIcon = document.querySelector('.current-icon');
  const iconDescriptor = weatherData.list[0].weather[0].icon;
  currentIcon.src = `./images/animated/${iconDescriptor}.svg`;
}

function showCurrentWeatherDescribe(lang, weatherData) {
  const summuryElement = document.querySelector('.weather-today_summury');
  const feelElement = document.querySelector('.weather-today_feel');
  const windElement = document.querySelector('.weather-today_wind');
  const humidityElement = document.querySelector('.weather-today_humidity');

  summuryElement.innerHTML = weatherData.list[0].weather[0].description.toUpperCase();
  feelElement.innerHTML = `${weatherDescription[lang].feel.toUpperCase()} ${Math.trunc(weatherData.list[0].main.feels_like)}°`;
  windElement.innerHTML = `${weatherDescription[lang].wind.toUpperCase()} ${Math.trunc(weatherData.list[0].wind.speed)} ${weatherDescription[lang].windUnit} ${translateValueWindDirectionDegToCard(weatherData.list[0].wind.deg, lang)}`;
  humidityElement.innerHTML = `${weatherDescription[lang].humidity.toUpperCase()} ${weatherData.list[0].main.humidity}%`;
}

function translateValueWindDirectionDegToCard(deg, LANG) {
  for (let key in windDirection[lang]){
    if(windDirection[lang][key].lowBoundary > deg && windDirection[lang][key].highBoundary <= deg){
      return key;
    }
  }
}

function setNextDays(lang, weatherData) {
  const nextDays = [];
  const today = new Date();

  for (let i = 0; i < QUANTITY_NEXT_DAYS; i++) {
    nextDays[i] = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (i + 1)) );
  }

  showNameNextDays(lang, nextDays);
  getShotRenderDateNextDays(weatherData, nextDays);
}

function getShotRenderDateNextDays(weatherData, nextDays){
  const nextDayShortString = [];
  const digitLength = 2;
  let year;
  let month;
  let day;

  for (let i = 0; i < QUANTITY_NEXT_DAYS; i++) {
  year = nextDays[i].getFullYear();
  month = `${nextDays[i].getMonth()+1}`.padStart(digitLength, 0);
  day =  `${nextDays[i].getDate()}`.padStart(digitLength, 0);

  nextDayShortString[i] = `${year}-${month}-${day}`;
  }
  showTemperatureNumberNextDays(weatherData, nextDayShortString);
}

function showNameNextDays(lang, nextDay) {
  const nextThreeDaysElements = document.querySelectorAll('.weather-next-days_name-day');

  for (let i = 0; i < nextDay.length; i++){
    nextThreeDaysElements[i].innerHTML = weekDays[lang][nextDay[i].getDay()];
  }
}

function showTemperatureNumberNextDays(weatherData, nextDayShortString) {
  const threeNextDayTemperatureElement = document.querySelectorAll('.weather-next-days_temperature_number');
  const threeNextDayWeatherDataArray = [];

    for (let i = 0; i < nextDayShortString.length; i++) {
      threeNextDayWeatherDataArray[i] = [];

      for (let j = 0; j < weatherData.list.length; j++){
          if(weatherData.list[j].dt_txt.slice(0,10) === nextDayShortString[i]){
              threeNextDayWeatherDataArray[i].push(weatherData.list[j]);
          }
      }

      let indexMaxDayTmeperature = 0;
      let minDayTemperature = threeNextDayWeatherDataArray[i][indexMaxDayTmeperature].main.temp;
      let maxDayTemperature = minDayTemperature;
    
      for (let k = 0; k < threeNextDayWeatherDataArray[i].length; k++){
        if (threeNextDayWeatherDataArray[i][k].main.temp > maxDayTemperature) {
          maxDayTemperature = threeNextDayWeatherDataArray[i][k].main.temp;
          indexMaxDayTmeperature = k;
        }
        if (threeNextDayWeatherDataArray[i][k].main.temp < minDayTemperature) {
          minDayTemperature = threeNextDayWeatherDataArray[i][k].main.temp;
        }
    } 
    threeNextDayTemperatureElement[i].innerHTML = Math.round(threeNextDayWeatherDataArray[i][indexMaxDayTmeperature].main.temp);
    showIconsNextDays(i, threeNextDayWeatherDataArray[i][indexMaxDayTmeperature]);
  }
} 

function showIconsNextDays(i, threeNextDayWeatherDataArray) {
  const dayIcons = document.querySelectorAll('.weather-next-days_icons_img');
  
  dayIcons[i].src = `./images/animated/${threeNextDayWeatherDataArray.weather[0].icon}.svg`;
}

async function getBackkgroundImage() {
  const response = await fetch('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=76d735b7381e9ed633854a67b69d8387&tags=nature,weather,dark&tag_mode=all&extras=url_h&format=json&nojsoncallback=1');
  const images = await response.json();
  
  const item = images.photos.photo[Math.floor(Math.random() * images.photos.photo.length)].url_h;
  document.documentElement.style.background = `url(${item})`;
}

function changeBackgroundHandly() {
  const refreshButton = document.querySelector('.refresh-button');
  const refreshSign = document.querySelector('#refresh-sign');

  refreshButton.addEventListener('click', function (){
    getBackkgroundImage();
    refreshSign.style.animationPlayState = 'running';

    setTimeout(() => {
      refreshSign.style.animationPlayState = 'paused';
    }, 1000);
  });
}

 async function getCoordinateByPlaceName(mapContainer, cityName) {
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=0f2efca19d1747cd906baa8bb7f8c2f7`);
  const coord = await response.json();
  
  latitudeCurrentCity = coord.results[0].geometry.lat;
  longitudeCurrentCity = coord.results[0].geometry.lng;

  setDAtaLocalStorage(latitudeCurrentCity, longitudeCurrentCity, lang, unitDegree);
  initMap(mapContainer, latitudeCurrentCity, longitudeCurrentCity, cityName);
  getPlaceNameWeatherDataPlace(lang, latitudeCurrentCity, longitudeCurrentCity);
}

initWeatherApp ();
