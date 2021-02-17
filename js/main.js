const LANGUAGE = document.querySelector('.dropdown-content');
let LANG = localStorage.getItem('LANG') || 'en';
let UNIT_DEGREE = localStorage.getItem('UNIT_DEGREE') || 'metric';
let FIRST_DAY_UTC;
let SECOND_DAY_UTC;
let THIRD_DAY_UTC;
let CITY_NAME;
let LATITUDE_CURRENT_CITY;
let LONGITUDE_CURRENT_CITY;

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

changeBackkgroundImage();
changeBackgroundHandly();
getCoordinateCurrentCityNavigator();


let buttons = document.querySelector('.temperature-buttons');

buttons.addEventListener("change", function changeTemperatureUnit(event) {
    getDataLocalStorage();
    let item = event.target.id;
  if(item === 'temperature-celsius'){
    UNIT_DEGREE = 'metric';
    localStorage.setItem('UNIT_DEGREE', UNIT_DEGREE);
    getPlaceNameByCoordinate(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
    getWeatherData(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  } else {
    UNIT_DEGREE = 'imperial';
    localStorage.setItem('UNIT_DEGREE', UNIT_DEGREE);
    getPlaceNameByCoordinate(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
    getWeatherData(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  }
});

LANGUAGE.addEventListener("change", function changeLanguage(){
  LANG = this.value;
  localStorage.setItem('LANG', LANG);
  setSelectedLanguage(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
});

function setSelectedLanguage (LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY) {
  getDataLocalStorage();
  setInterval(() => {
    getCurrentFullTime(LANG);
  }, 1000);
  
  getPlaceNameByCoordinate(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  getWeatherData(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  setThreeNextDays(LANG);
  translateSearchForm();
}

 
// Initialize and add the map
function initMap(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY) {
  // The location of Minsk
  const city = { lat: LATITUDE_CURRENT_CITY, lng: LONGITUDE_CURRENT_CITY };
  // The map, centered at minsk
  const map = new google.maps.Map(
    document.querySelector('.user-location__geolocation'),
    {
      zoom: 7,
      center: city,
    }
  );

  // The marker, positioned at city
  const marker = new google.maps.Marker({
    position: city,
    map: map,
  });
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
  const monthEl = document.querySelector('.month');
  const dateTodayEl = document.querySelector('.date-today');
  const dayTodayEl = document.querySelector('.day-today');
  const timeEl = document.querySelector('.time');

  monthEl.innerHTML = month;
  dateTodayEl.innerHTML = dateToday;
  dayTodayEl.innerHTML = dayToday;
  timeEl.innerHTML = timeNow;
}



/*--------------------get geolocation--------------------*/

function showCurrentCountryName(currentCountry) {
  const countryNameElement = document.querySelector('.country-name');
  countryNameElement.innerHTML = currentCountry.toUpperCase();
}

function showCurrentCityName(currentTown) {
  const cityNameElement = document.querySelector('.city-name');
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

async function getPlaceNameByCoordinate(LATITUDE_CURRENT_CITY,LONGITUDE_CURRENT_CITY ) {
  let url = `https://api.opencagedata.com/geocode/v1/json?q=${LATITUDE_CURRENT_CITY.toString()},${LONGITUDE_CURRENT_CITY.toString()}&key=0f2efca19d1747cd906baa8bb7f8c2f7&language=${LANG}`;
  let response = await fetch(url);
  let place = await response.json();
  console.log (place);
  let currentCountry = place.results[0].components.country;
  let currentTown = place.results[0].components.hamlet || place.results[0].components.town || place.results[0].components.city;

  showCurrentCountryName(currentCountry);
  showCurrentCityName(currentTown);
  showCoordinateCurrentPlace(place);
}

function showCoordinateCurrentPlace(place) {
  let latitude = document.querySelector('.latitude');
  let longitude = document.querySelector('.longitude');

  if (LANG === 'ru'){
    latitude.innerHTML = `Широта:  ${place.results[0].annotations.DMS.lat}`;
    longitude.innerHTML = `Долгота: ${place.results[0].annotations.DMS.lng}`;
    } else {
    latitude.innerHTML = `Latitude:  ${place.results[0].annotations.DMS.lat}`;
    longitude.innerHTML = `Longitude: ${place.results[0].annotations.DMS.lng}`;
  } 
}

async function getWeatherData(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE_CURRENT_CITY.toString()}&lon=${LONGITUDE_CURRENT_CITY.toString()}&units=${UNIT_DEGREE}&appid=0f57bad2b641ca690297cce9e9f87665&lang=${LANG}`;
  let responseWeatherData = await fetch(url);
  let weatherData = await responseWeatherData.json();


  console.log(weatherData);
  showCurrentTemperature(weatherData);
  showCurrentWeatherDescribe(weatherData);
  showCurrentIcon(weatherData);
  showIconsNextThreeDays(weatherData);
}

function showCurrentTemperature(weatherData) {
  let currentTemperature = document.querySelector(
    '.weather-today__temperature_number_value'
  );
  currentTemperature.innerHTML = Math.trunc(weatherData.list[0].main.temp);
}

function showCurrentIcon(weatherData) {
  let currentIcon = document.querySelector('.current-icon');
  let iconDescriptor = weatherData.list[0].weather[0].icon;
  currentIcon.src = `http://openweathermap.org/img/wn/${iconDescriptor}@2x.png`;
}

function showCurrentWeatherDescribe(weatherData) {
  let summury = document.querySelector('.weather-today_summury');
  let feel = document.querySelector('.weather-today_feel');
  let wind = document.querySelector('.weather-today_wind');
  let humidity = document.querySelector('.weather-today_humidity');

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

function setThreeNextDays(LANG) {
  let today = new Date();
  let todayDate = today.getDate();

  FIRST_DAY_UTC = new Date(today.setDate(`${todayDate + 1}`));
  FIRST_DAY_UTC = FIRST_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + 10800;

  SECOND_DAY_UTC = new Date(today.setDate(`${todayDate + 2}`));
  SECOND_DAY_UTC = SECOND_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + 10800;

  THIRD_DAY_UTC = new Date(today.setDate(`${todayDate + 3}`));
  THIRD_DAY_UTC = THIRD_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + 10800;

  showNameNextThreeDays(LANG, FIRST_DAY_UTC, SECOND_DAY_UTC, THIRD_DAY_UTC);
}

function showNameNextThreeDays(LANG, FIRST_DAY_UTC, SECOND_DAY_UTC, THIRD_DAY_UTC) {
  let firstNameDay = document.querySelector(
    '.weather-next-days__first_name-day'
  );
  let secondNameDay = document.querySelector(
    '.weather-next-days__second_name-day'
  );
  let thirdNameDay = document.querySelector(
    '.weather-next-days__third_name-day'
  );
  
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
  let indexFirstDayUTC = weatherData.list.findIndex(
    (item) => item.dt === FIRST_DAY_UTC
  );
  let indexSecondDayUTC = weatherData.list.findIndex(
    (item) => item.dt === SECOND_DAY_UTC
  );
  let indexThirdDayUTC = weatherData.list.findIndex(
    (item) => item.dt === THIRD_DAY_UTC
  );

  let firstDayIcon = document.querySelector(
    '.weather-next-days__first_icons-img'
  );
  let secondDayIcon = document.querySelector(
    '.weather-next-days__second_icons-img'
  );
  let thirdDayIcon = document.querySelector(
    '.weather-next-days__third_icons-img'
  );

  let iconDescriptorFirst = weatherData.list[indexFirstDayUTC].weather[0].icon;
  let iconDescriptorSecond = weatherData.list[indexSecondDayUTC].weather[0].icon;
  let iconDescriptorThird = weatherData.list[indexThirdDayUTC].weather[0].icon;

  firstDayIcon.src = `http://openweathermap.org/img/wn/${iconDescriptorFirst}@2x.png`;
  secondDayIcon.src = `http://openweathermap.org/img/wn/${iconDescriptorSecond}@2x.png`;
  thirdDayIcon.src = `http://openweathermap.org/img/wn/${iconDescriptorThird}@2x.png`;
  showTemperatureNumberNextThreeDays(
    weatherData,
    indexFirstDayUTC,
    indexSecondDayUTC,
    indexThirdDayUTC
  );
}

function showTemperatureNumberNextThreeDays(
  weatherData,
  indexFirstDayUTC,
  indexSecondDayUTC,
  indexThirdDayUTC
) {
  let firstDayTempratureNumber = document.querySelector(
    '.weather-next-days__first_temperature_value'
  );
  let secondDayTempratureNumber = document.querySelector(
    '.weather-next-days__second_temperature_value'
  );
  let thirdDayTempratureNumber = document.querySelector(
    '.weather-next-days__third_temperature_value'
  );

  firstDayTempratureNumber.innerHTML = Math.trunc(
    weatherData.list[indexFirstDayUTC].main.temp
  );
  secondDayTempratureNumber.innerHTML = Math.trunc(
    weatherData.list[indexSecondDayUTC].main.temp
  );
  thirdDayTempratureNumber.innerHTML = Math.trunc(
    weatherData.list[indexThirdDayUTC].main.temp
  );
}

async function changeBackkgroundImage() {
  let response = await fetch(
    'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=76d735b7381e9ed633854a67b69d8387&tags=nature,weather,dark&tag_mode=all&extras=url_h&format=json&nojsoncallback=1'
  );
  let images = await response.json();
  let item =
    images.photos.photo[Math.floor(Math.random() * images.photos.photo.length)];
  urlPhoto = item.url_h;
  document.documentElement.style.background = `url(${urlPhoto})`;
}

function changeBackgroundHandly() {
  let refreshButton = document.querySelector('.refresh-button');
  refreshButton.addEventListener('click', changeBackkgroundImageClickRefreshButton);
  refreshButton.addEventListener('animationend', changeBackkgroundImageRefreshButtonAnimationEnd);

  function changeBackkgroundImageClickRefreshButton() {
    refreshButton.classList.add('active');
    changeBackkgroundImage();
  }

  function changeBackkgroundImageRefreshButtonAnimationEnd() {
    refreshButton.classList.remove('active');
  }
}



function translateSearchForm() {
  let search = document.querySelector('.search-field');
  let button = document.querySelector('.search-button');
  if (LANG === 'ru') {
    search.setAttribute('placeholder','Поиск города');
    button.innerHTML = 'поиск';
  } else {
    search.setAttribute('placeholder','Search city');
    button.innerHTML = 'SEARCH';
  }
}



 async function getCoordinateByPlaceName(CITY_NAME) {
  let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${CITY_NAME}&key=0f2efca19d1747cd906baa8bb7f8c2f7`);
  let coord = await response.json();
  console.log(coord);
  LATITUDE_CURRENT_CITY = coord.results[0].geometry.lat;
  LONGITUDE_CURRENT_CITY = coord.results[0].geometry.lng;
  setDAtaLocalStorage(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY, LANG, UNIT_DEGREE);
  initMap(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  getPlaceNameByCoordinate(LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
  getWeatherData(LANG, LATITUDE_CURRENT_CITY, LONGITUDE_CURRENT_CITY);
}


let searchButton = document.querySelector('.search-button');
let searchField = document.querySelector('.search-field');

searchButton.addEventListener('click', getDataSearchForm);

searchField.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    getDataSearchForm();
  }
}); 

function getDataSearchForm(){
  CITY_NAME = searchField.value;
  searchField.value ='';
  getCoordinateByPlaceName(CITY_NAME);
}