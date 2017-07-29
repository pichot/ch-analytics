// Map and Baselayer
var map = L.map('map').setView([41.520052, -81.556235], 15);
var basemap = new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png');
map.addLayer(basemap);


// Layer
var style = function(feature) {
  return {
    color: '#3182bd',
    weight: 3,
    opacity: 1
  }
}

var makePopUpContent = function(p) {
  return '<div class="popup-content">' +
           '<p><strong>ID:</strong> ' + p.parcel_id + '</p>' +
           '<p><strong>Address:</strong> ' + p.parcel_add + '</p>' +
         '</div>'
}

var buildingsLayer = L.geoJson(null, {
  style: style,
  onEachFeature: function(feature, layer) {
    layer.on({
      click: function(e) {
        window.location.href = '/building/' + e.target.feature.properties.parcel_id
      }
    });

    // if (feature.properties) {
    //   layer.bindPopup(makePopUpContent(feature.properties));
    //   // layer.on('mouseover', function() { layer.openPopup(); });
    //   // layer.on('mouseout', function() { layer.closePopup(); });
    // }
  }
}).addTo(map);


// Query
var sqlQuery = `SELECT the_geom, parcel_id, parcel_add FROM jp4772.ch_buildings`;

var cartoSql = new cartodb.SQL({ user: 'jp4772' });
cartoSql.execute(sqlQuery, null, { format: 'geojson' })
.done(function(data) {
  buildingsLayer.addData(data);
});
