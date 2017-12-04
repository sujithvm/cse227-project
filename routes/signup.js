var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var UserGame = mongoose.model('UserGame');
var GameSequenceGenerator = require('../utils/game_sequence_generator')

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
                    obj.data = GameSequenceGenerator()

                    // var p1 = new Object()
                    // p1.encoding = "SDFJKL"
                    // p1.pattern = [0, 1, 0, 2, 3, 4, 5]
                    // p1.results = []

                    // var p2 = new Object()
                    // p2.encoding = "LSDKFJ"
                    // p2.pattern = [0, 5, 0, 1, 4, 2, 3]
                    // p2.results = []

                    // obj.patterns.push(p1);
                    // obj.patterns.push(p2);
                    
                    UserGame(obj).save(function(err) {
                        if (!err) {
                            res.redirect("/game/train?token=" + token);
                        } else {
                            res.render('error', { title: 'Error' });
                        }
                    });
                } else {
                    res.redirect("/game/train?token=" + token);
                }
            });
        } else if (req.query.authentication_type == "word_completion") {
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
