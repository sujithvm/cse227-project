var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserTrainGame = mongoose.model('UserTrainGame');
var UserTestGame = mongoose.model('UserTestGame');
var GameSequenceGenerator = require('../utils/game_sequence_generator')


router.get('/train', function(req, res, next) {
  var user = new Object();
  user.name = req.query.name;
  user.email = req.query.email;
  user.data = GameSequenceGenerator(null)  
  res.render('game', { userdata: user, type: "train" });
});

router.post('/trainstore', function(req, res, next) {
  var obj = req.body
  UserTrainGame(obj).save(function(err) {
    if (err) {
      return res.render('error');
    } else {
      return res.render('authenticate');
    }
  });
});

router.get('/test', function(req, res, next) {
  UserTrainGame.findOne({'name': req.query.name, 'email': req.query.email}, function(err, usergame){
    if (err) {
      res.render('error')
    } else if(usergame) {
      var user = new Object();
      user.name = req.query.name;
      user.email = req.query.email;
      user.data = GameSequenceGenerator(usergame.data.password)  
      res.render('game', { userdata: user, type: "test" });
    } else {
      return res.render('authenticate', {"err": true, "message": "User does not exist. Please signup first"});
    }
  })
});

router.post('/teststore', function(req, res, next) {
  var obj = req.body
  UserTestGame(obj).save(function(err) {
    if (err) {
      return res.render('error');
    } else {
      return res.render('index');
    }
  });
});

module.exports = router;
