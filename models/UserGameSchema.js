var mongoose = require('mongoose');

var UserGameSchema = new mongoose.Schema({
    name : String,
    email : String,
    token : String,
    data: {
        password: [],
        levels: [
            {
                speed: Number,
                interval: Number,
                sequence: [],
                pattern_scores: {}
            }
        ]
    }
})

mongoose.model('UserGame', UserGameSchema)
