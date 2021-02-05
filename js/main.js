/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
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
  const map = new google.maps.Map(document.querySelector(".user-location__geolocation"), {
    zoom: 7,
    center: minsk,
  });
  // The marker, positioned at minsk
  const marker = new google.maps.Marker({
    position: minsk,
    map: map,
  });
}  