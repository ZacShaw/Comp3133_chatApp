var mongoose = require('mongoose');
var user = new mongoose.Schema({
    username: String,
    creationDate: {type:Date, default:Date}
})
module.exports = mongoose.model("User", user);