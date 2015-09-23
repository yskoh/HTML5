var mongoose = require('mongoose');

var scoreSchema = new Schema({
    user_id: {type:int, unique:true},
    playDate: {type: Date, dafault: Date.now},
    score: int
});

var Score = mongoose.model('score', scoreSchema);