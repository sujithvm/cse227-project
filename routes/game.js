var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/train', function(req, res, next) {
  res.render('game', { title: 'Game' });
});

router.get('/test', function(req, res, next) {
  res.render('game', { title: 'Game' });
});

module.exports = router;
