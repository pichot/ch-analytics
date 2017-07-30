var express = require('express');
var router = express.Router();
var request = require('request');
var accounting = require('accounting');
var path = require('path');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buildings', function(req, res, next) {
  var queryURI = `https://jp4772.carto.com/api/v1/map/named/ch_buildings?auth_token=${process.env.CARTO_API_KEY}`;

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

    console.log(cartoLayerGroup);

    res.render('buildings', { cartoLayerGroup: cartoLayerGroup });
  });
});

router.get('/building/:buildingId', function(req, res, next) {
  const sqlQuery = `SELECT * FROM jp4772.ch_buildings WHERE parcel_id = ${req.params.buildingId}`;
  const requestUrl = `https://jp4772.carto.com/api/v2/sql?q=${sqlQuery}&api_key=${process.env.CARTO_API_KEY}`;

  request(requestUrl, function (error, response, body) {
    const bodyJSON = JSON.parse(body);
    const building = bodyJSON.rows[0];

    res.render('building', { b: building, a: accounting });
  });
});

module.exports = router;
