var mongoose = require('mongoose');

var UserGameSchema = new mongoose.Schema({
    name : String,
    email : String,
    token : String,
    time : { type : Date, default: Date.now },
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

mongoose.model('UserTrainGame', UserGameSchema)
mongoose.model('UserTestGame', UserGameSchema)
