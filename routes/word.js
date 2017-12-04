var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/train', function(req, res, next) {
  request("http://localhost:5000/signup?user=" + req.query.name, function (error, response, body) {
    if (error) {
      res.render('error')
    } else {
      res.render('word', { data: body});
    }
  });
});

module.exports = router;
