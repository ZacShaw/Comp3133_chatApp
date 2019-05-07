var express = require('express'),
    router = express.Router(),
    Elog = require('../models/Events.js');
    Chat = require('../models/Chats.js');
    Admin = require('../models/Admin');
    Room = require('../models/Rooms');

router.get('/api/eventlog', function(req, res, next) {
  Elog.find((err, results)=>{
      if(err) throw err;
      res.header("Content-Type",'application/json');
      res.json(results)
  });
});

router.get('/api/eventLog/delete/:id', function(req, res, next) {
  Elog.findByIdAndDelete({_id:req.params.id},(err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

router.get('/api/admin', (req,res,next)=>{
  Admin.find()
  .exec(function(error,admin){
      if (error){
          return next(error);
      }else{
          if (admin === null){
              var err = new Error('no');
              err.status=400;
              return next(err);
          }else{
              return res.send(admin)
          }
      }
  })
})

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
})
router.get("/api/history", (req, res) => {
  Chat.find({}, (err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.json(results)
  });
});
router.get('/api/history/delete/:id', function(req, res, next) {
  Chat.findByIdAndDelete({_id:req.params.id},(err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 
router.get("/api/main", (req, res) => {
  Chat.find({room: "Main room"}, (err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
});

router.get("/api/games", (req, res) => {
  Chat.find({room: "Gaming room"}, (err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

router.get("/api/political", (req, res) => {
  Chat.find({room: "Political room"}, (err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
});
module.exports = router;
