var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/train', function(req, res, next) {
  request("http://localhost:5000/perceptive/signup?user=" + req.query.name, function (error, response, body) {
    if (error) {
      res.render('error')
    } else {
      res.render('word', { data: body});
    }
  });
});

router.get('/auth', function(req, res, next) {
  request("http://localhost:5000/perceptive/test?user=" + req.query.name, function (error, response, body) {
    if (error) {
      res.render('error')
    } else {
      res.render('wordcomplete', { data: body , user: req.query.name});
    }
  });
});

router.post('/store', function(req, res, next) {

  request({
    url: "http://localhost:5000/perceptive/auth?user=",
    method: "POST",
    json: true,   
    body: req.body
  }, function (error, response, body){

    console.log(error)
    console.log(body)
  
    if (error) {
      res.render('error')
    } else {
      res.render('index');
    }
  });

});

module.exports = router;
