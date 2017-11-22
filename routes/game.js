var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserGame = mongoose.model('UserGame');

/* GET home page. */
router.get('/train', function(req, res, next) {
  var token = req.query.token;
  UserGame.findOne({token: token}, function (err, user) {
    if (err) {
      res.render('error');
      return;
    }
    res.render('game', { data: user });
  });
});

router.post('/trainstore', function(req, res, next) {
  var obj = req.body

  UserGame.findOne({token: obj.token}, function (err, user) {
    if (err) {
      res.render('error');
      return;
    }
    console.log(user)
    user.patterns = obj.patterns;
    user.save(function(err){
      if (err) {res.render('error'); }
      else {res.sendStatus(200);}
    })
  });
  
});

router.get('/test', function(req, res, next) {
  res.render('game', { title: 'Game' });
});

module.exports = router;
