var mongoose = require('mongoose');
var sockio = new mongoose.Schema({
    socket_id: String,
    connectTime: {type:Date, default:Date},
    createdBy: String,
    disconnectTime: {type:Date, default:null},
})
module.exports = mongoose.model("Sockets", sockio);