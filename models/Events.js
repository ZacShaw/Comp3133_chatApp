var mongoose = require('mongoose');
var EventLog = new mongoose.Schema({
    type: String,
    name:{type:String, default:null},
    socket: String,
    room: String,
    connect: {type:Date, default:Date},
    disconnect: {type:Date, default:null}
});
module.exports = mongoose.model('EventLog', EventLog);