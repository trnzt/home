// Initialize and add the map
function initMap() {
  const dataElement = document.getElementById("agencies_by_country");
  const data = JSON.parse(dataElement.innerText);
  const agenciesByCountryCode = Array.from(data).reduce(
    (acc, cur) => ({ ...acc, [cur.code]: cur }),
    {}
  );
  console.debug(agenciesByCountryCode);
  const mapElement = document.getElementById("map");
  map = new google.maps.Map(mapElement, {
    zoom: 2,
    center: { lat: 0, lng: 0 },
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      map.setCenter(initialLocation);
    });
  }

  // zoom to show all the features
  var bounds = new google.maps.LatLngBounds();
  //   map.data.addListener("addfeature", function (e) {
  //     processPoints(e.feature.getGeometry(), bounds.extend, bounds);
  //     map.fitBounds(bounds);
  //   });
  map.data.setStyle(function (feature) {
    var code = feature.getProperty("iso_a2");
    const agencies = agenciesByCountryCode[code];

    if (agencies) {
      return {
        fillColor: "red",
        strokeWeight: 1,
      };
    }
    return {
      fillColor: "transparent",
      strokeWeight: 0,
    };
  });

  map.data.loadGeoJson("/assets/geojson/ne_110m_admin_0_countries.geojson");
}
function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach(function (g) {
      processPoints(g, callback, thisArg);
    });
  }
}

window.initMap = initMap;
