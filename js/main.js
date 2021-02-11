/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleLanguage() {
  document.getElementById('myDropdown').classList.toggle('show');
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');

    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// Initialize and add the map
function initMap(latitudeCurrentCity, longitudeCurrentCity) {
  console.log(latitudeCurrentCity, longitudeCurrentCity);
  // The location of Minsk
  const city = { lat: latitudeCurrentCity, lng: longitudeCurrentCity };
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

let FIRST_DAY_UTC;
let SECOND_DAY_UTC;
let THIRD_DAY_UTC;

function getCurrentFullTime(month, dateToday, dayToday, timeNow) {
  let today = new Date();
  const arr = today.toString().split(' ');
  arr.length = 5;

  month = arr[1];
  dateToday = arr[2];
  dayToday = arr[0];
  timeNow = arr[4];

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

setInterval(() => {
  getCurrentFullTime();
}, 1000);

/*--------------------get geolocation--------------------*/

getCoordinateCurrentCityNavigator();
setThreeNextDays();

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
    let latitudeCurrentCity = +crd.latitude;
    let longitudeCurrentCity = +crd.longitude;

    console.log('Ваше текущее метоположение:');
    console.log(`Широта: ${crd.latitude}`);
    console.log(`Долгота: ${crd.longitude}`);
    console.log(`Плюс-минус ${crd.accuracy} метров.`);

    initMap(latitudeCurrentCity, longitudeCurrentCity);
    getPlaceNameByCoordinate(latitudeCurrentCity, longitudeCurrentCity);
    getWeatherData(latitudeCurrentCity, longitudeCurrentCity);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
}

/* async function getCoordinateByPlaceName() {
  let response = await fetch('https://api.opencagedata.com/geocode/v1/json?q=СМОЛЕВИЧИ&key=0f2efca19d1747cd906baa8bb7f8c2f7');
  let coord = await response.json();
  console.log(coord);
}
getCoordinateByPlaceName(); */

async function getPlaceNameByCoordinate(
  latitudeCurrentCity,
  longitudeCurrentCity
) {
  let url = `https://api.opencagedata.com/geocode/v1/json?q=${latitudeCurrentCity.toString()},${longitudeCurrentCity.toString()}&key=0f2efca19d1747cd906baa8bb7f8c2f7&language=en`;
  let response = await fetch(url);
  let place = await response.json();
  let currentCountry = place.results[0].components.country;
  let currentTown = place.results[0].components.town;

  showCurrentCountryName(currentCountry);
  showCurrentCityName(currentTown);
  showCoordinateCurrentPlace(latitudeCurrentCity, longitudeCurrentCity);
  console.log(place);
}

function showCoordinateCurrentPlace(latitudeCurrentCity, longitudeCurrentCity) {
  let latitude = document.querySelector('.latitude');
  let longitude = document.querySelector('.longitude');

  latitude.innerHTML = `Latitude: ${latitudeCurrentCity.toFixed(6)}`;
  longitude.innerHTML = `Longitude: ${longitudeCurrentCity.toFixed(6)}`;
}

async function getWeatherData(latitudeCurrentCity, longitudeCurrentCity) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeCurrentCity.toString()}&lon=${longitudeCurrentCity.toString()}&units=metric&appid=0f57bad2b641ca690297cce9e9f87665`;
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

  summury.innerHTML = weatherData.list[0].weather[0].description;
  feel.innerHTML = `FEELS LIKE: ${Math.trunc(
    weatherData.list[0].main.feels_like
  )}°`;
  wind.innerHTML = `WIND: ${Math.trunc(
    weatherData.list[0].wind.speed
  )} m/s ${translateValueWindDirectionDegToCard(weatherData.list[0].wind.deg)}`;
  humidity.innerHTML = `HUMIDITY: ${weatherData.list[0].main.humidity}%`;
}

function translateValueWindDirectionDegToCard(deg) {
  if (deg > 11.25 && deg <= 33.75) {
    return 'NNE';
  } else if (deg > 33.75 && deg <= 56.25) {
    return 'ENE';
  } else if (deg > 56.25 && deg <= 78.75) {
    return 'E';
  } else if (deg > 78.75 && deg <= 101.25) {
    return 'ESE';
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

function setThreeNextDays() {
  let today = new Date();
  let todayDate = today.getDate();

  FIRST_DAY_UTC = new Date(today.setDate(`${todayDate + 1}`));
  FIRST_DAY_UTC = FIRST_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + 10800;

  SECOND_DAY_UTC = new Date(today.setDate(`${todayDate + 2}`));
  SECOND_DAY_UTC = SECOND_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + 10800;

  THIRD_DAY_UTC = new Date(today.setDate(`${todayDate + 3}`));
  THIRD_DAY_UTC = THIRD_DAY_UTC.setHours(12, 0, 0, 0) / 1000 + 10800;

  console.log(FIRST_DAY_UTC, SECOND_DAY_UTC, THIRD_DAY_UTC);
  showNameNextThreeDays(FIRST_DAY_UTC, SECOND_DAY_UTC, THIRD_DAY_UTC);
}

function showNameNextThreeDays(FIRST_DAY_UTC, SECOND_DAY_UTC, THIRD_DAY_UTC) {
  let firstNameDay = document.querySelector(
    '.weather-next-days__first_name-day'
  );
  let secondNameDay = document.querySelector(
    '.weather-next-days__second_name-day'
  );
  let thirdNameDay = document.querySelector(
    '.weather-next-days__third_name-day'
  );

  const daysRus = [
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

  firstNameDay.innerHTML = daysEn[first];
  secondNameDay.innerHTML = daysEn[second];
  thirdNameDay.innerHTML = daysEn[third];
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
  let iconDescriptorSecond =
    weatherData.list[indexSecondDayUTC].weather[0].icon;
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
