var express = require('express');
var router = express.Router();
var request = require('request');
var accounting = require('accounting');
var path = require('path');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buildings', function(req, res, next) {
  res.render('buildings');
});

router.get('/buildings/json', function(req, res, next) {
  const sqlQuery = `SELECT * FROM jp4772.ch_buildings`;
  const requestUrl = `https://jp4772.carto.com/api/v2/sql?q=${sqlQuery}&api_key=${process.env.CARTO_API_KEY}`;

  request(requestUrl, function (error, response, body) {
    res.send(body);
  });
});

router.get('/building/:buildingId', function(req, res, next) {
  const sqlQuery = `SELECT * FROM jp4772.ch_buildings WHERE parcel_id = ${req.params.buildingId}`;
  const requestUrl = `https://jp4772.carto.com/api/v2/sql?q=${sqlQuery}&api_key=${process.env.CARTO_API_KEY}`;

  request(requestUrl, function (error, response, body) {
    const bodyJSON = JSON.parse(body);
    const building = bodyJSON.rows[0];

    res.render('building', { b: building, a: accounting });

    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
  });
});

module.exports = router;
