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

async function getGeolocationIpInfo() {
  let response = await fetch('https://ipinfo.io/json?token=543fd5d393e868');
  let data = await response.json();
  await getCountryCode(data);
  showCurrentCityName (data);
  console.log(data, data.city, data.country);
  getCoordinateCurrentCity(data);
}


getGeolocationIpInfo();

async function getCountryCode(data) {
  let names = await fetch('./names.json');
  let countryCode = await names.json();
  for(let key in countryCode) {
    if(key === data.country) {
      showCurrentCountryName (key, countryCode);
    }
  }
}

function showCurrentCountryName (key, countryCode) {
  const countryNameElement = document.querySelector('.country-name');
  countryNameElement.innerHTML = countryCode[key].toUpperCase();
}

function showCurrentCityName (data) {
  const cityNameElement = document.querySelector('.city-name');
  cityNameElement.innerHTML = data.city.toUpperCase();
}

function getCoordinateCurrentCity(data){
  const coordinateFull = data.loc.split(',');
  let latitudeCurrentCity = +coordinateFull[0];
  let longitudeCurrentCity = +coordinateFull[1];
  console.log(latitudeCurrentCity, longitudeCurrentCity);
  initMap(latitudeCurrentCity, longitudeCurrentCity);
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
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
}

getCoordinateCurrentCityNavigator ();
