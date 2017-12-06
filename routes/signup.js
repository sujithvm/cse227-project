var express = require('express');
var router = express.Router();

/* GET signup page. */
router.get('/', function(req, res, next) {
    if (req.query.name && req.query.email && req.query.authentication_type) {
        if (req.query.authentication_type == "game") {
            res.redirect("/game/train?name=" + req.query.name + "&email=" + req.query.email);
        } else if (req.query.authentication_type == "word_completion") {
            res.redirect("/word/train?name=" + req.query.name + "&email=" + req.query.email);
        } else if (req.query.authentication_type == "poc") {
            res.redirect("/poc/train?name=" + req.query.name + "&email=" + req.query.email);
        } else {
            res.render('signup', { title: 'Signup' });
        }
    } else {
        res.render('signup', { title: 'Signup' });
    }
});

module.exports = router;
