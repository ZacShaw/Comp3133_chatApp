var mongoose = require('mongoose');
var room = new mongoose.Schema({
    room: String,
    created: {type:Date, default:Date},
    edited: {type:Date, default:Date},
    status: String
})

mongoose.model('Room', room);

module.exports = mongoose.model("Room", room);