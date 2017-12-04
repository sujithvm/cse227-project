var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserGame = mongoose.model('UserGame');
var GameSequenceGenerator = require('../utils/game_sequence_generator')


router.get('/train', function(req, res, next) {
  var user = new Object();
  user.name = req.query.name;
  user.email = req.query.email;
  user.data = GameSequenceGenerator()  
  res.render('game', { userdata: user });
});

router.post('/trainstore', function(req, res, next) {
  var obj = req.body
  UserGame(obj).save(function(err) {
    if (err) {
      res.render('error');
    } else {
      res.sendStatus(200);
    }
  });
});

router.get('/test', function(req, res, next) {
  res.render('game', { title: 'Game' });
});

module.exports = router;
