var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
    nick: String,
    msg: String,
    room:String,
    created: {type:Date, default:Date}
})
module.exports = mongoose.model('Messages', chatSchema);