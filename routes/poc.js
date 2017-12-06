var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/train', function(req, res, next) {
  request("http://localhost:5000/poc/signup?user=" + req.query.name, function (error, response, body) {
    if (error) {
      res.render('error')
    } else {
      res.render('poc', { user: req.query.name, data: body, type: "train"});
    }
  });
});

router.post('/trainstore', function(req, res, next) {
    var data = {'user': req.body.user, 'choices': req.body.choices}
    request.post({url:'http://localhost:5000/poc/train', form: data}, function(err, response, body){ 
        if (err) {
            res.render('error')
        } else {
            res.render('authenticate')
        }
     })
});

router.get('/test', function(req, res, next) {
    request("http://localhost:5000/poc/test?user=" + req.query.name, function (error, response, body) {
      if (error) {
        res.render('error')
      } else {
        res.render('poc', { user: req.query.name, data: body, type: "test"});
      }
    });
  });

router.post('/teststore', function(req, res, next) {
    var data = {'user': req.body.user, 'choices': req.body.choices}
    request.post({url:'http://localhost:5000/poc/auth', form: data}, function(err, response, body){ 
        if (err) {
            res.render('error')
        } else {
            res.render('authenticate')
        }
     })
});

module.exports = router;
