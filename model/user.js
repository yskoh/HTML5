var mongoose = require('mongoose');

Schema = mongoose.Schema;

var userSchema = new Schema({
    user_id: {type:int, unique:true},
    name: String,
    nickname: String,
    password: String
});

var User = mongoose.model('user', userSchema);
