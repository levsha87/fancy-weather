const LANGUAGE = document.querySelector('.language-button-content');
const BUTTONS_UNIT = document.querySelectorAll('.radio-input');
const TEMPERATURE_BUTTONS = document.querySelector('.temperature-buttons');
const SEARCH_FIELD = document.querySelector('.search-field');
const SEARCH_BUTTON = document.querySelector('.search-button');
const MAP_CONTAINER = document.querySelector('.user-location__geolocation');


let LANG = localStorage.getItem('LANG') || 'en';
let UNIT_DEGREE = localStorage.getItem('UNIT_DEGREE') || 'metric';
let FIRST_DAY_UTC;
let SECOND_DAY_UTC;
let THIRD_DAY_UTC;
let CITY_NAME;
let LATITUDE_CURRENT_CITY;
let LONGITUDE_CURRENT_CITY;

function setDefaultAttributeValueLanguageUnit(LANG, UNIT_DEGREE) {
  const options = document.querySelectorAll('option');

  if(LANGUAGE.value === LANG) {
    options[0].setAttribute('selected', true);
  } else {
    options[1].setAttribute('selected', true);
  } 

  if(UNIT_DEGREE === 'metric') {
    BUTTONS_UNIT[0].checked = true;
  } else {
    BUTTONS_UNIT[1].checked = true;
  } 
}

function getDataLocalStorage() {
  LATITUDE_CURRENT_CITY = localStorage.getItem('LATITUDE_CURRENT_CITY');
  LONGITUDE_CURRENT_CITY = localStorage.getItem('LONGITUDE_CURRENT_CITY');
  LANG = localStorage.getItem('LANG');
  UNIT_DEGREE = localStorage.getItem('UNIT_DEGREE');
}

function setDAtaLocalStorage(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY, LANG, UNIT_DEGREE) {
  localStorage.setItem('LATITUDE_CURRENT_CITY', LATITUDE_CURRENT_CITY);
  localStorage.setItem('LONGITUDE_CURRENT_CITY', LONGITUDE_CURRENT_CITY );
  localStorage.setItem('LANG', LANG);
  localStorage.setItem('UNIT_DEGREE', UNIT_DEGREE);
}

getBackkgroundImage();
changeBackgroundHandly();
getCoordinateCurrentCityNavigator();
setDefaultAttributeValueLanguageUnit(LANG, UNIT_DEGREE);


TEMPERATURE_BUTTONS.addEventListener("change", (event) => changeTemperatureUnit(event) );
LANGUAGE.addEventListener("change", changeLanguage);
SEARCH_BUTTON.addEventListener('click', getDataSearchForm);
SEARCH_FIELD.addEventListener('keydown', (e) => getDataSearchFormPressEnter(e)); 




function changeTemperatureUnit(event) {
  const item = event.target.id;
  getDataLocalStorage();

if(item === 'temperature-celsius'){
    UNIT_DEGREE = 'metric';
    localStorage.setItem('UNIT_DEGREE', UNIT_DEGREE);
    getPlaceNameWeatherDataPlace(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  } else {
    UNIT_DEGREE = 'imperial';
    localStorage.setItem('UNIT_DEGREE', UNIT_DEGREE);
    getPlaceNameWeatherDataPlace(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  }
}

function changeLanguage(){
  LANG = this.value;
  localStorage.setItem('LANG', LANG);
  setSelectedLanguage(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
}

function setSelectedLanguage (LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY) {
  getDataLocalStorage();
  setInterval(() => {
    getCurrentFullTime(LANG);
  }, 1000);
  
  getPlaceNameWeatherDataPlace(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  translateSearchForm();
}

function getDataSearchFormPressEnter(e){
  if (e.keyCode === 13) {
    e.preventDefault();
    getDataSearchForm();
  }
}

function getDataSearchForm(){
  CITY_NAME = SEARCH_FIELD.value;
  SEARCH_FIELD.value ='';
  getCoordinateByPlaceName(CITY_NAME);
}

// Initialize and add the map
function initMap(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY) {
  const city = { lat: LATITUDE_CURRENT_CITY, lng: LONGITUDE_CURRENT_CITY };

  const map = new mapboxgl.Map({
  container: MAP_CONTAINER,
  style: 'mapbox://styles/mapbox/streets-v11',
  center: city, 
  zoom: 7
  });

  const marker = new mapboxgl.Marker()
    .setLngLat(city)
    .addTo(map);
}

/*--------------------get current month, day, time---------------*/

function getCurrentFullTime(LANG) {
  let today = new Date();
  let arr = today.toString().split(' ');
  arr.length = 5;
  
  let month = arr[1];
  let dateToday = arr[2];
  let dayToday = arr[0];
  let timeNow = arr[4];

    if (LANG === 'ru') {
      arr = today.toLocaleString('ru', {
        day: 'numeric',
        weekday: 'short',
        month: 'short',
      }).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');
    month = arr[2];
    dateToday = arr[1];
    dayToday = arr[0];
    }

  showCurrentTime(month, dateToday, dayToday, timeNow);
}


function showCurrentTime(month, dateToday, dayToday, timeNow) {
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

function getCoordinateCurrentCityNavigator() {

  navigator.geolocation.getCurrentPosition(success, error, {
    maximumAge: 60000,
    timeout: 5000,
    enableHighAccuracy: true,
  });

  function success(pos) {
    let crd = pos.coords;
    LATITUDE_CURRENT_CITY = +crd.latitude;
    LONGITUDE_CURRENT_CITY = +crd.longitude;

    initMap(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
    setDAtaLocalStorage(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY, LANG, UNIT_DEGREE);
    setSelectedLanguage (LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
}

async function getPlaceNameWeatherDataPlace(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY){
  await getPlaceNameByCoordinate(LATITUDE_CURRENT_CITY,LONGITUDE_CURRENT_CITY );
  await getWeatherData(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
}

async function getPlaceNameByCoordinate(LATITUDE_CURRENT_CITY,LONGITUDE_CURRENT_CITY ) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${LATITUDE_CURRENT_CITY.toString()},${LONGITUDE_CURRENT_CITY.toString()}&key=0f2efca19d1747cd906baa8bb7f8c2f7&language=${LANG}`;
  const response = await fetch(url);
  const place = await response.json();
  
  const currentCountry = place.results[0].components.country;
  const currentTown = place.results[0].components.hamlet || place.results[0].components.town || place.results[0].components.city;

  showCurrentCountryNameCityName(currentCountry, currentTown);
  showCoordinateCurrentPlace(place);
}

function showCoordinateCurrentPlace(place) {
  const latitude = document.querySelector('.latitude');
  const longitude = document.querySelector('.longitude');

  if (LANG === 'ru'){
    latitude.innerHTML = `Широта:  ${place.results[0].annotations.DMS.lat}`;
    longitude.innerHTML = `Долгота: ${place.results[0].annotations.DMS.lng}`;
    } else {
    latitude.innerHTML = `Latitude:  ${place.results[0].annotations.DMS.lat}`;
    longitude.innerHTML = `Longitude: ${place.results[0].annotations.DMS.lng}`;
  } 
}

async function getWeatherData(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE_CURRENT_CITY.toString()}&lon=${LONGITUDE_CURRENT_CITY.toString()}&units=${UNIT_DEGREE}&appid=0f57bad2b641ca690297cce9e9f87665&lang=${LANG}`;
  const responseWeatherData = await fetch(url);
  const weatherData = await responseWeatherData.json();
 
  showCurrentWeatherPlace(weatherData);
  setThreeNextDays(LANG, weatherData);
}

function showCurrentWeatherPlace(weatherData){
  showCurrentTemperature(weatherData);
  showCurrentWeatherDescribe(weatherData);
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

function showCurrentWeatherDescribe(weatherData) {
  const summury = document.querySelector('.weather-today_summury');
  const feel = document.querySelector('.weather-today_feel');
  const wind = document.querySelector('.weather-today_wind');
  const humidity = document.querySelector('.weather-today_humidity');

  summury.innerHTML = weatherData.list[0].weather[0].description.toUpperCase();

  if (LANG === 'ru') {
    feel.innerHTML = `ОЩУЩАЕТСЯ КАК: ${Math.trunc(weatherData.list[0].main.feels_like)}°`;
    wind.innerHTML = `ВЕТЕР: ${Math.trunc(weatherData.list[0].wind.speed)} m/s ${translateValueWindDirectionDegToCard(weatherData.list[0].wind.deg, LANG)}`;
    humidity.innerHTML = `ВЛАЖНОСТЬ: ${weatherData.list[0].main.humidity}%`;
  } else {
    feel.innerHTML = `FEELS LIKE: ${Math.trunc(weatherData.list[0].main.feels_like)}°`;
    wind.innerHTML = `WIND: ${Math.trunc(weatherData.list[0].wind.speed)} m/s ${translateValueWindDirectionDegToCard(weatherData.list[0].wind.deg, LANG)}`;
    humidity.innerHTML = `HUMIDITY: ${weatherData.list[0].main.humidity}%`;}
}

function translateValueWindDirectionDegToCard(deg, LANG) {
  if (LANG === 'ru') {
      if (deg > 11.25 && deg <= 33.75) {
        return 'ССВ';
      } else if (deg > 33.75 && deg <= 56.25) {
        return 'СВ';
      } else if (deg > 56.25 && deg <= 78.75) {
        return 'ВСВ';
      } else if (deg > 78.75 && deg <= 101.25) {
        return 'В';
      } else if (deg > 101.25 && deg <= 123.75) {
        return 'ВЮВ';
      } else if (deg > 123.75 && deg <= 146.25) {
        return 'ЮВ';
      } else if (deg > 146.25 && deg <= 168.75) {
        return 'ЮЮВ';
      } else if (deg > 168.75 && deg <= 191.25) {
        return 'Ю';
      } else if (deg > 191.25 && deg <= 213.75) {
        return 'ЮЮЗ';
      } else if (deg > 213.75 && deg <= 236.25) {
        return 'ЮЗ';
      } else if (deg > 236.25 && deg <= 258.75) {
        return 'ЗЮЗ';
      } else if (deg > 258.75 && deg <= 281.25) {
        return 'З';
      } else if (deg > 281.25 && deg <= 303.75) {
        return 'ЗСЗ';
      } else if (deg > 303.75 && deg <= 326.25) {
        return 'СЗ';
      } else if (deg > 326.25 && deg <= 348.75) {
        return 'ССЗ';
      } else {
        return 'С';
      }
  } else {
      if (deg > 11.25 && deg <= 33.75) {
        return 'NNE';
      } else if (deg > 33.75 && deg <= 56.25) {
        return 'NE';
      } else if (deg > 56.25 && deg <= 78.75) {
        return 'ENE';
      } else if (deg > 78.75 && deg <= 101.25) {
        return 'E';
      } else if (deg > 101.25 && deg <= 123.75) {
        return 'ESE';
      } else if (deg > 123.75 && deg <= 146.25) {
        return 'SE';
      } else if (deg > 146.25 && deg <= 168.75) {
        return 'SSE';
      } else if (deg > 168.75 && deg <= 191.25) {
        return 'S';
      } else if (deg > 191.25 && deg <= 213.75) {
        return 'SSW';
      } else if (deg > 213.75 && deg <= 236.25) {
        return 'SW';
      } else if (deg > 236.25 && deg <= 258.75) {
        return 'WSW';
      } else if (deg > 258.75 && deg <= 281.25) {
        return 'W';
      } else if (deg > 281.25 && deg <= 303.75) {
        return 'WNW';
      } else if (deg > 303.75 && deg <= 326.25) {
        return 'NW';
      } else if (deg > 326.25 && deg <= 348.75) {
        return 'NNW';
      } else {
        return 'N';
      }
  }
}

function setThreeNextDays(LANG, weatherData) {
  const currentCityTimeZone = weatherData.city.timezone;
  const today = new Date();
  const todayDate = today.getDate();

  FIRST_DAY_UTC = new Date(today.setDate(`${todayDate + 1}`));
  FIRST_DAY_UTC = FIRST_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + currentCityTimeZone;

  SECOND_DAY_UTC = new Date(today.setDate(`${todayDate + 2}`));
  SECOND_DAY_UTC = SECOND_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + currentCityTimeZone;

  THIRD_DAY_UTC = new Date(today.setDate(`${todayDate + 3}`));
  THIRD_DAY_UTC = THIRD_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + currentCityTimeZone;

  showNameNextThreeDays(LANG, FIRST_DAY_UTC, SECOND_DAY_UTC, THIRD_DAY_UTC);
  showIconsNextThreeDays(weatherData);
}

function showNameNextThreeDays(LANG, FIRST_DAY_UTC, SECOND_DAY_UTC, THIRD_DAY_UTC) {
  const firstNameDay = document.querySelector('.weather-next-days__first_name-day');
  const secondNameDay = document.querySelector('.weather-next-days__second_name-day');
  const thirdNameDay = document.querySelector('.weather-next-days__third_name-day');
  
  const daysRu = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];

  const daysEn = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  
  let first = new Date(FIRST_DAY_UTC * 1000).getDay();
  let second = new Date(SECOND_DAY_UTC * 1000).getDay();
  let third = new Date(THIRD_DAY_UTC * 1000).getDay();

  if (LANG === 'ru') {
    firstNameDay.innerHTML = daysRu[first];
    secondNameDay.innerHTML = daysRu[second];
    thirdNameDay.innerHTML = daysRu[third];
  } else {
    firstNameDay.innerHTML = daysEn[first];
    secondNameDay.innerHTML = daysEn[second];
    thirdNameDay.innerHTML = daysEn[third];
  }
}

function showIconsNextThreeDays(weatherData) {
  let indexFirstDayUTC = weatherData.list.findIndex( (item) => item.dt === FIRST_DAY_UTC );
  let indexSecondDayUTC = weatherData.list.findIndex( (item) => item.dt === SECOND_DAY_UTC );
  let indexThirdDayUTC = weatherData.list.findIndex( (item) => item.dt === THIRD_DAY_UTC );

  const firstDayIcon = document.querySelector('.weather-next-days__first_icons-img');
  const secondDayIcon = document.querySelector('.weather-next-days__second_icons-img');
  const thirdDayIcon = document.querySelector('.weather-next-days__third_icons-img');

  const iconDescriptorFirst = weatherData.list[indexFirstDayUTC].weather[0].icon;
  const iconDescriptorSecond = weatherData.list[indexSecondDayUTC].weather[0].icon;
  const iconDescriptorThird = weatherData.list[indexThirdDayUTC].weather[0].icon;

  firstDayIcon.src = `./images/animated/${iconDescriptorFirst}.svg`;
  secondDayIcon.src = `./images/animated/${iconDescriptorSecond}.svg`;
  thirdDayIcon.src = `./images/animated/${iconDescriptorThird}.svg`;

  showTemperatureNumberNextThreeDays(weatherData, indexFirstDayUTC, indexSecondDayUTC, indexThirdDayUTC);
}

function showTemperatureNumberNextThreeDays( weatherData, indexFirstDayUTC, indexSecondDayUTC, indexThirdDayUTC) {
  const firstDayTempratureNumber = document.querySelector('.weather-next-days__first_temperature_value');
  const secondDayTempratureNumber = document.querySelector('.weather-next-days__second_temperature_value');
  const thirdDayTempratureNumber = document.querySelector('.weather-next-days__third_temperature_value');

  firstDayTempratureNumber.innerHTML = Math.trunc(weatherData.list[indexFirstDayUTC].main.temp);
  secondDayTempratureNumber.innerHTML = Math.trunc(weatherData.list[indexSecondDayUTC].main.temp);
  thirdDayTempratureNumber.innerHTML = Math.trunc(weatherData.list[indexThirdDayUTC].main.temp);
}

async function getBackkgroundImage() {
  const response = await fetch('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=76d735b7381e9ed633854a67b69d8387&tags=nature,weather,dark&tag_mode=all&extras=url_h&format=json&nojsoncallback=1');
  const images = await response.json();
  const item = images.photos.photo[Math.floor(Math.random() * images.photos.photo.length)].url_h;
  document.documentElement.style.background = `url(${item})`;
}

function changeBackgroundHandly() {
  const refreshButton = document.querySelector('.refresh-button');
  refreshButton.addEventListener('click', addClassBackkgroundImageClickRefreshButton);
  refreshButton.addEventListener('animationend', deleteBackkgroundImageAnimationEndRefreshButton);

  function addClassBackkgroundImageClickRefreshButton() {
    refreshButton.classList.add('active');
    getBackkgroundImage();
  }

  function deleteBackkgroundImageAnimationEndRefreshButton() {
    refreshButton.classList.remove('active');
  }
}

function translateSearchForm() {
  if (LANG === 'ru') {
    SEARCH_FIELD.setAttribute('placeholder','Город Район Область');
    SEARCH_BUTTON.innerHTML = 'поиск';
  } else {
    SEARCH_FIELD.setAttribute('placeholder','Town Region');
    SEARCH_BUTTON.innerHTML = 'SEARCH';
  }
}

 async function getCoordinateByPlaceName(CITY_NAME) {
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${CITY_NAME}&key=0f2efca19d1747cd906baa8bb7f8c2f7`);
  const coord = await response.json();
  
  LATITUDE_CURRENT_CITY = coord.results[0].geometry.lat;
  LONGITUDE_CURRENT_CITY = coord.results[0].geometry.lng;

  setDAtaLocalStorage(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY, LANG, UNIT_DEGREE);
  initMap(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  getPlaceNameWeatherDataPlace(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
}

