var mongoose = require('mongoose');
var PrivateChatSchema = mongoose.Schema({
    sender: String,
    reciever: String,
    msg: String,
    time: {type:Date, default:Date}
})
module.exports = mongoose.model('PrivateMessage', PrivateChatSchema);