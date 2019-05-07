var express = require('express');
var router = express.Router();
var Rooms = require('../models/Rooms');
var bodyParser = require('body-parser');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));



/* GET ALL ROOMS */
router.get('/api/room', function(req, res, next) {
  Rooms.find((err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

/* SAVE ROOMS */

router.post("/api/room", (req,res)=>{
  var data = new Rooms(req.body);
  data.save()
  .then(
    res.redirect('/')
  )
});

router.get('/api/room/delete/:id', function(req, res, next) {
  Rooms.findByIdAndDelete({_id:req.params.id},(err, results)=>{
    if(err) throw err;
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(results, null, 4));
  });
}); 

/* UPDATE ROOM */
router.post('/api/room/update/:id', function(req,res,next){
  Rooms.findById(req.params.id,(err, results)=>{
    if(err) throw err;
    console.log('\nUPDATE')
    console.log(req.body.status)
    results.status = req.body.status
    results.edited = Date.now()
    results.save().then(()=>{
      res.json('Update Complete')
      console.log('Room Updated')
    })
  });
});

module.exports = router;
