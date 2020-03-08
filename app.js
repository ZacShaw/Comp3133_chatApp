var express = require('express'),
    app = express(),
    path = require('path');
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 5000;
    require('./socketManager/socket')(io);


//Port Function
server.listen(port, function(){
    console.log('Listening on port ' + port);
});

//Connecting to Database cluster
mongoose.connect('mongodb+srv://admin:Charl3magn3@cluster0-dqyal.mongodb.net/Mern',{ useNewUrlParser: true }, (err)=> {
    if (err){
        console.log(err);
    }else {
        console.log('Successfully Connected to Database')
    }
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', require('./routes/index'));
app.use('/', require('./routes/rooms'));
app.use('/chats', require('./routes/chats'));