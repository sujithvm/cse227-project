var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var UserGame = mongoose.model('UserGame');

/* GET signup page. */
router.get('/', function(req, res, next) {
    if (req.query.name && req.query.email && req.query.authentication_type) {
        var token = crypto.createHash('md5').update(req.query.name).digest('hex');
        if (req.query.authentication_type == "game") {
            UserGame.findOne({token: token}, function (err, user) {
                if (!user) {
                    var obj = new Object();
                    obj.name = req.query.name;
                    obj.email = req.query.email;
                    obj.token = token;
                    UserGame(obj).save();
                } 
                res.redirect("/game/train?token=" + token);
            });
        } else if (req.query.authentication_type == "game") {
            res.redirect("/word/train?token=" + token);
        } else if (req.query.authentication_type == "poc") {
            res.render('signup', { title: 'Signup' });
        } else {
            res.render('signup', { title: 'Signup' });
        }
    } else {
        res.render('signup', { title: 'Signup' });
    }
});

module.exports = router;
