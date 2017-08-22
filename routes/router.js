var express = require('express');
var router = express.Router();
var request = require('request');
var accounting = require('accounting');
var path = require('path');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buildings', function(req, res, next) {
  var queryURI = `https://chrisstreich.carto.com/api/v1/map/named/ch_buildings?auth_token=${process.env.CARTO_API_KEY}`;

  // NOTE: Must still manually generate named template

  // POST https://carto_username.carto.com/api/v1/map/named
  //   {
  //     "version": "0.0.1",
  //     "name": "ch_buildings",
  //     "layergroup": {
  // 	    "version": "1.0.3",
  // 	    "layers": [
  // 	        {
  // 	            "type": "mapnik",
  // 	            "options": {
  // 	                "sql": "select the_geom_webmercator, parcel_id, parcel_add, vacant, propcode from ch_buildings",
  // 	                "cartocss": "#table { marker-placement: point; }",
  // 	                "cartocss_version": "2.3.0"
  // 	            }
  // 	        }
  // 	    ]
  //     }
  // }

  // Instantiate anonymous map from named map template (https://carto.com/docs/carto-engine/maps-api/named-maps#instantiate)
  request({
    headers: {
      'Content-Type': 'application/json'
    },
    uri: queryURI,
    method: 'POST'
  }, function(error, response, body) {
    const bodyJSON = JSON.parse(body);
    const cartoLayerGroup = bodyJSON.layergroupid;

    res.render('buildings', { cartoLayerGroup: cartoLayerGroup });
  });
});

var requestUrl = function(sql) {
  return `https://chrisstreich.carto.com/api/v2/sql?q=${sql}&api_key=${process.env.CARTO_API_KEY}`;
}

router.get('/building/:buildingId', function(req, res, next) {
  const sqlQuery = `SELECT * FROM ch_buildings WHERE parcel_id = ${req.params.buildingId}`;

  request(requestUrl(sqlQuery), function (error, response, body) {
    const bodyJSON = JSON.parse(body);
    console.log(bodyJSON);
    const building = bodyJSON.rows[0];

    const policeQuery = `SELECT offtext, enddate FROM ch_building_police WHERE parcel_id = ${req.params.buildingId} ORDER BY enddate DESC`;
    request(requestUrl(policeQuery), function (error, response, body) {
      const policeJSON = JSON.parse(body);
      const policecalls = policeJSON.rows;

      const negQuery = `SELECT action_code_desc, case_year, case_status, parcel_id FROM ch_neg_actions WHERE parcel_id = ${req.params.buildingId} ORDER BY case_year DESC`
      request(requestUrl(negQuery), function (error, response, body) {
        const negJSON = JSON.parse(body);
        const negactions = negJSON.rows;

        res.render('building', { b: building, a: accounting, policecalls: policecalls, negactions: negactions, propcode: propcodeTranslate(building.propcode) });
      });
    });
  });
});


// Not where it should be, but whatever
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

module.exports = router;
