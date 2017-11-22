var mongoose = require('mongoose');

var UserGameSchema = new mongoose.Schema({
    name : String,
    email : String,
    token : String,
    patterns : [{
        hits: Number,
        misses: Number,
        time: Number
    }]
})

mongoose.model('UserGame', UserGameSchema)
