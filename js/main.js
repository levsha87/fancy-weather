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
  // The location of Minsk
  const city = {lat: latitudeCurrentCity, lng: longitudeCurrentCity};
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

getCoordinateCurrentCityNavigator ();

function showCurrentCountryName (currentCountry) {
  const countryNameElement = document.querySelector('.country-name');
  countryNameElement.innerHTML = currentCountry.toUpperCase();
}

function showCurrentCityName (currentTown) {
  const cityNameElement = document.querySelector('.city-name');
  cityNameElement.innerHTML = currentTown.toUpperCase();
}

function getCoordinateCurrentCityNavigator (){
  navigator.geolocation.getCurrentPosition(success, error);
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

async function  getPlaceNameByCoordinate(latitudeCurrentCity, longitudeCurrentCity) {
  let url = `https://api.opencagedata.com/geocode/v1/json?q=${latitudeCurrentCity.toString()},${longitudeCurrentCity.toString()}&key=0f2efca19d1747cd906baa8bb7f8c2f7&language=en`;
  let response = await fetch(url);
  let place = await response.json();
  let currentCountry = place.results[0].components.country;
  let currentTown = place.results[0].components.town;

  showCurrentCountryName (currentCountry);
  showCurrentCityName (currentTown);
  console.log(place);
}
