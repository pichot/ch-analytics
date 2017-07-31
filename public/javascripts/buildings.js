mapboxgl.accessToken = 'pk.eyJ1IjoicGljaG90IiwiYSI6Ii0zSXN0bFkifQ.svxKy-nsJZ53Imf43Z7dXg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-81.5633295217516, 41.514041862836166],
    zoom: 12.071350911527107
});

map.on('load', function () {
  var cartoDiv = document.getElementById('carto');

  map.addSource("ch-buildings", {
      type: 'vector',
      tiles: [
        `https://jp4772.carto.com/api/v1/map/${cartoDiv.dataset.cartolayergroup}/{z}/{x}/{y}.mvt`
      ],
  });

  map.addLayer({
    "id": "buildings_fill",
    "type": "fill",
    "source": "ch-buildings",
    "source-layer": "layer0",
    'paint': {
      'fill-outline-color': '#000',
      'fill-opacity': 0.5,
      'fill-color': {
        'property': 'propcode',
        'type': 'categorical',
        'stops': [
          ['R', '#d7191c'],
          ['RE', '#d7191c'],
          ['C', '#2b83ba'],
          ['CE', '#2b83ba'],
          ['I', '#ffffbf'],
          ['IE', '#ffffbf'],
          ['A', '#abdda4'],
          ['AE', '#abdda4'],
          ['null', '#bababa'],
          ['H', '#bababa'],
          ['LW', '#bababa'],
          ['E', '#bababa'],
          ['B', '#bababa']
        ]
      }
    }
  });

  map.addLayer({
    "id": "buildings_fill_hover",
    "type": "fill",
    "source": "ch-buildings",
    "source-layer": "layer0",
    "layout": {},
    "paint": {
        "fill-color": "#3182bd",
        "fill-opacity": 1
    },
    "filter": ["==", "parcel_id", ""]
  });
});


// Click
map.on('click', 'buildings_fill', function (e) {
  if (e.features[0].properties.parcel_id !== null) {
    window.location.href = '/building/' + e.features[0].properties.parcel_id;
  }
});

// Hover
var propcodeTranslate = function(code) {
  switch (code) {
    case 'A':
      return "Agricultural";
      break;
    case 'B':
      return "Land Bank";
      break;
    case 'C':
      return "Commercial";
      break;
    case 'E':
      return "Exempt";
      break;
    case 'R':
      return "Residential";
      break;
    case 'I':
      return "Industrial";
      break;
    case 'P':
      return "Public Utility";
      break;
    case 'AE':
      return "Agricultural Exempt";
      break;
    case 'CE':
      return "Commericial Exempt";
      break;
    case 'IE':
      return "Industrial Exempt";
      break;
    case 'RE':
      return "Residential Exempt";
      break;
    case 'H':
      return "Highway Exempt";
      break;
    case 'M':
      return "Mineral Rights";
      break;
    case 'LW':
      return "Listed With";
      break;
    default:
      ""
  }
}

map.on('mousemove', 'buildings_fill', function(e) {
  map.getCanvas().style.cursor = 'pointer';

  var buildingNameDiv = document.getElementById("building-id");

  var buildingHTML = "<h4 class='building-info'>" + e.features[0].properties.parcel_add;
  buildingHTML += ` <span class='label label-default'>${propcodeTranslate(e.features[0].properties.propcode)}</span>`;
  if (e.features[0].properties.vacant) {
    buildingHTML += " <span class='label label-danger'>Vacant</span>"
  }

  buildingNameDiv.innerHTML = buildingHTML + "</h4>";
});

map.on('mouseleave', 'buildings_fill', function() {
  var buildingNameDiv = document.getElementById("building-id");
  buildingNameDiv.innerHTML = "";
});
