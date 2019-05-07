var express = require('express');
var router = express.Router();
var Chats = require('../models/Chats.js');

/* GET ALL MESSAGES */
router.get('/api/history', function(req, res, next) {
  Chats.find((err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

/* SAVE MESSAGES */
router.post('/api/history', function(req, res, next) {
  Chats.create(req.body, function (err, chat) {
    if (err) return next(err);
    res.json(chat);
  });
});

module.exports = router;
