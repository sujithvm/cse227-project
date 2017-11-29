var mongoose = require('mongoose');

var UserGameSchema = new mongoose.Schema({
    name : String,
    email : String,
    token : String,
    patterns : [{
        encoding : String,
        pattern : [],
        results : [
            {
                hits: Number,
                misses: Number,
                time: Number
            }
        ]
    }]
})

mongoose.model('UserGame', UserGameSchema)
