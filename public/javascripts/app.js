function init() {
  //
  // Hyperlapse
  //
  var hyperlapse = new Hyperlapse(document.getElementById('pano'), {
    width: 854,
    height: 480,
    zoom: 1,
    use_lookat: false,
    millis: 100,
    max_points: 1000000,
    distance_between_points: 5
  });

  hyperlapse.onError = function(e) {
    console.log(e);
  };

  hyperlapse.onRouteComplete = function(e) {
    hyperlapse.load();
  };

  hyperlapse.onLoadProgress = function(e) {
    $('#status').text(e.position);
  }

  hyperlapse.onLoadComplete = function(e) {
    jQuery.post('/finish');
    //hyperlapse.play();
  };

  hyperlapse.onRender = function(e) {
    var image = document.getElementsByTagName('canvas')[0].toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');

    jQuery.post('/save', {
      image: image,
      index: e.index
    });
  }

  //
  // DirectionsService for Hyperlapse
  //
  var directionsService = new google.maps.DirectionsService();

  $('#generate-button').click(function() {
    var route = {
      request: {
        origin: new google.maps.LatLng(
          parseFloat($('#start-lat').text()),
          parseFloat($('#start-lng').text())
        ),
        destination: new google.maps.LatLng(
          parseFloat($('#end-lat').text()),
          parseFloat($('#end-lng').text())
        ),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      }
    };
    
    directionsService.route(route.request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        hyperlapse.generate( {route:response} );
      } else {
        console.log(status);
      }
    });
  });

  $('#cancel-button').click(function() {
    hyperlapse.cancel();
  });


  //
  // Map
  //
  var myOptions = {
    zoom: 13,
    center: new google.maps.LatLng(35.6638027,139.69819359999997),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

  // Start Panorama and End Panorama
  var startPanorama = new google.maps.StreetViewPanorama(document.getElementById('start-pano'), {
    heading: 34,
    pitch: 1,
    zoom: 1
  });
  var endPanorama = new google.maps.StreetViewPanorama(document.getElementById('end-pano'), {
    heading: 34,
    pitch: 1,
    zoom: 1
  });
  var streetViewService = new google.maps.StreetViewService();
  var directionsDisplay = new google.maps.DirectionsRenderer({
    'map': map,
    'preserveViewport': true,
    'draggable': true
  });
  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    var currentDirections = directionsDisplay.getDirections();
    var leg = currentDirections.routes[0].legs[0];
    streetViewService.getPanoramaByLocation(leg.start_location, 500, function(result, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var location = result.location;
        var nearestLatLng = location.latLng;
        startPanorama.setPosition(nearestLatLng);
        console.log(nearestLatLng);
        $('#start-lat').text(nearestLatLng.lat());
        $('#start-lng').text(nearestLatLng.lng());
      }
    });
    streetViewService.getPanoramaByLocation(leg.end_location, 500, function(result, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var location = result.location;
        var nearestLatLng = location.latLng;
        endPanorama.setPosition(nearestLatLng);
        console.log(nearestLatLng);
        $('#end-lat').text(nearestLatLng.lat());
        $('#end-lng').text(nearestLatLng.lng());
      }
    });
  });

  var start = 'Shibuya Station';
  var end = 'Omotesando' ;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
  
}

function calcRoute() {

}

window.onload = init;
