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
  var data = {'user': req.body.user, 'stats': req.body.stats}
  request.post({url:'http://localhost:5000/perceptive/auth', form: data}, function(err, response, body){ 
      if (err) {
          res.render('error')
      } else {
          res.render('index')
      }
   })
});

module.exports = router;
