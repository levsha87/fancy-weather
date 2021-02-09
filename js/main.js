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
function initMap() {
  // The location of Minsk
  const minsk = { lat: 53.8962037, lng: 27.5504956 };
  // The map, centered at minsk
  const map = new google.maps.Map(
    document.querySelector('.user-location__geolocation'),
    {
      zoom: 7,
      center: minsk,
    }
  );
  // The marker, positioned at minsk
  const marker = new google.maps.Marker({
    position: minsk,
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
