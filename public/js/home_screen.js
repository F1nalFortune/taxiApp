$("#searchTextField").on('touchmove',ontouchmove);

function ontouchmove(e){
  if(e.cancelable){
    e.preventDefault();
  }
}
function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 41.311587, lng: -72.929541},
    disableDefaultUI: true
  });
  directionsDisplay.setMap(map);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, destLat, destLng) {
  directionsService.route({
    origin: {lat: 41.311587, lng: -72.929541},
    destination: {lat: destLat, lng: destLng},
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function confirmation(){
  setTimeout(function(){
    $('.custom-carousel').slick({
      infinite: false,
      prevArrow: false,
      nextArrow: false
    })
    $("#confirmation").slideToggle({
    })
  }, 2500)
}
  function initialize() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: 41.311587, lng: -72.929541},
      disableDefaultUI: true
    });
    directionsDisplay.setMap(map);
    var input = document.getElementById('searchTextField');
    var autocomplete = new google.maps.places.Autocomplete(input);
    new google.maps.event.addListener(autocomplete, 'place_changed', function(){
      //Grab GOOGLE Place
      var place = autocomplete.getPlace();
      //Stringify Google Place Functions
      var stringify = JSON.stringify(place, null, 2);
      //Create readable JSON object
      var place_object  = JSON.parse(stringify);
      console.log(place_object);
      var destLat = place_object.geometry.location.lat;
      var destLng = place_object.geometry.location.lng;
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 41.311587, lng: -72.929541},
        disableDefaultUI: true
      });
      directionsDisplay.setMap(map);
      calculateAndDisplayRoute(directionsService, directionsDisplay, destLat, destLng);
      confirmation();
    })
  }

  $(document).ready(function() {

        $.getJSON("/drivers/all-drivers/", function(data){
          console.log(data);
          var driver_data = '';
          // driver_data += "<div class='row nomargin'>";
          driver_data += "<h1 class='drivers'>Drivers</h1>";
          driver_data += "<h4 class='driver-sub'>Classy, Top Knotch Rides</h4>";
          driver_data += "<div class='custom-carousel'>";
          // driver_data += "<div class='swiper-container'>";
          // driver_data += "<div class='swiper-wrapper'>";
          $.each(data, function(key, value){
            // driver_data += "<div class='swiper-slide'>";
            // driver_data += "<div class='row nomargin'>";
            // driver_data += "<div class='col-xs-12 col-sm-12'>";
            driver_data += "<div>";
            driver_data += "<i class='fas fa-taxi fa-3x'></i>";
            // driver_data += "</div>";
            // driver_data += "<div class='col-xs-12 col-sm-12'>";
            driver_data += "<p>" + value.first + "</p>";
            driver_data += "<p><i class='far fa-user'></i>" + value.capacity + "</p>";
            driver_data += "</div>";
            // driver_data += "</div>";
            // driver_data += "</div>";
            console.log(value.first);
            // driver_data += "<div class='col-xs-4 col-sm-4'>";
            // driver_data += "<i class='fas fa-taxi'></i>";
            // driver_data += "<p>" + value.first + "</p>";
            // driver_data += "<p><i class='far fa-user'></i>" + value.capacity + "</p>";
            // driver_data += "</div>";
          });
          // driver_data += "</div>";
          // driver_data += "<div clas='swiper-pagination'></div>";
          driver_data += "</div>";
          driver_data += "<div class='row nomargin'>";
          driver_data += "<button>CONFIRM</button>";
          driver_data += "</div>";
          $("#confirmation").html(driver_data).promise().done(function(){})
        })



  });
