function init() {
  var hyperlapse = initHyperlapse();

  //
  // DirectionsService for Hyperlapse
  //
  var directionsService = new google.maps.DirectionsService();

  $('#generate-button').click(function() {
    jQuery.post('/start');
    var route = {
      request: {
        origin: new google.maps.LatLng(
          parseFloat($('#start-lat').text()),
          parseFloat($('#start-lng').text())
        ),
        destination: new google.maps.LatLng(
          parseFloat($('#goal-lat').text()),
          parseFloat($('#goal-lng').text())
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
  var map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoom: 13,
    center: new google.maps.LatLng(35.6638027,139.69819359999997),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var panoramaOptions = {
    heading: 34,
    pitch: 1,
    zoom: 1
  };
  var panoramaStart = new google.maps.StreetViewPanorama(document.getElementById('pano-start'), panoramaOptions);
  var panoramaGoal = new google.maps.StreetViewPanorama(document.getElementById('pano-goal'), panoramaOptions);
  var streetViewService = new google.maps.StreetViewService();
  var directionsRenderer = new google.maps.DirectionsRenderer({
    'map': map,
    'preserveViewport': true,
    'draggable': true
  });
  google.maps.event.addListener(directionsRenderer, 'directions_changed', function() {
    var currentDirections = directionsRenderer.getDirections();
    var leg = currentDirections.routes[0].legs[0];
    streetViewService.getPanoramaByLocation(leg.start_location, 500, function(result, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var location = result.location;
        var nearestLatLng = location.latLng;
        panoramaStart.setPosition(nearestLatLng);
        console.log(nearestLatLng);
        $('#start-lat').text(nearestLatLng.lat());
        $('#start-lng').text(nearestLatLng.lng());
      }
    });
    streetViewService.getPanoramaByLocation(leg.end_location, 500, function(result, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var location = result.location;
        var nearestLatLng = location.latLng;
        panoramaGoal.setPosition(nearestLatLng);
        console.log(nearestLatLng);
        $('#goal-lat').text(nearestLatLng.lat());
        $('#goal-lng').text(nearestLatLng.lng());
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
      directionsRenderer.setDirections(response);
    }
  });
  
}

function initHyperlapse() {
  var hyperlapse = new Hyperlapse(document.getElementById('pano-rendering'), {
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

  hyperlapse.onRouteProgress = function(e) {
    status('Loading points on the route: ' + e.index + '/' + e.length);
  }

  hyperlapse.onRouteComplete = function(e) {
    hyperlapse.load();
  };

  hyperlapse.onLoadProgress = function(e) {
    status('Rendering: ' + e.position + '/' + e.length);
  }

  hyperlapse.onLoadComplete = function(e) {
    status('Converting to a video...');
    jQuery.post('/finish', null, function () {
      $('#status').html('<a href="/video" target="_blank">Video</a>');
    });
  };

  hyperlapse.onRender = function(e) {
    var image = document.getElementById('pano-rendering').getElementsByTagName('canvas')[0].toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');

    jQuery.post('/save', {
      image: image,
      index: e.index
    });
  }

  return hyperlapse;
}

function status(obj) {
  $('#status').text(obj.toString());
}

window.onload = init;
