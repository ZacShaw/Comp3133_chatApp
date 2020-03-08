var mongoose = require('mongoose');
var Admin = mongoose.Schema({
    username:String,
    password:String
})
module.exports = mongoose.model('Admin', Admin);