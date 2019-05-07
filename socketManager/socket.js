var rooms = [],
    users = {},
    User = require('../models/Users.js'),
    Chat = require('../models/Chats.js'),
    Sockio = require('../models/Sockets.js'),
    Elog = require('../models/Events.js'),
    Private = require('../models/PrivateChats.js'),
    Rooms = require('../models/Rooms')

module.exports = (io)=>{

    io.sockets.on('connection', (socket)=> {
        Rooms.find((err, results)=>{
            if(err) throw err;
            results.forEach((i)=>{
                if (rooms.includes(i.room)){
                    console.log('Lets not add this one: ' + i.room)
                }else{
                    console.log('lets add this one: ' + i.room)
                    rooms.push(i.room)
                }
            })
        });
    //store event
        var connectEvent=new Elog({type:'CONNECTION', socket:socket.id, room:'Lobby'})
        connectEvent.save((err)=>{
                if (err) throw err;
                     console.log('\n==========STORE EVENT IN DATABASE==========\nSocket: '+connectEvent.socket+'\nWith type: '+connectEvent.type+"\nHas been connected @: "+ connectEvent.connect +'\nIn the: '+connectEvent.room+'\nSaved to database at: '+ connectEvent.connect)
            })
        socket.on('NEW_USER',  (data ,callback) =>{ 
        //if a user exists in the dictionary, return an error message to client
            if (data in users){
                callback(false);
            }
            else {
            //if a new user exits, create one, store in dictionary
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            //store in database
                var newUser = new User({username: data})
                newUser.save((err)=>{
                    if (err) throw err;
                console.log('\n==========STORE USER IN DATABASE==========\nUser: '+newUser.username+"\nSaved to database")
                })
            //stores new socket
                var newSock=new Sockio({socket_id:socket.id, createdBy:newUser.username})
                newSock.save((err)=>{
                    if (err) throw err;
                    console.log('\n==========STORE SOCKET IN DATABASE==========\nSocket: '+newSock.socket_id+"\nCreated by: "+ newSock.createdBy+"\nSaved to database at: "+ newSock.connectTime)
                })
            //store event
                var newUserEvent=new Elog({type:'NEW USER',name:newUser.username, socket:socket.id, room:'Main Room'})
                newUserEvent.save((err)=>{
                    if (err) throw err;
                    console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newUserEvent.type+'\nCreated by: ' + newUserEvent.name + '\nFor Socket: '+newUserEvent.socket+'\nIn the: '+newUserEvent.room+'\nSaved to database at: '+ newUserEvent.connect)
                })
                socket.room = 'Main';
            // add the users's username to the global list
            // send user to Main room
                socket.join('Main');
            // echo to user they've connected
            // echo to Main room that another user has connected to their room
                message=({author:'CHAT BOT NINJA', message: 'You have connected to Main room'})
                message2=({author:'CHAT BOT NINJA', message: socket.nickname + ' has connected to this room'})
                socket.emit('UPDATE_CHAT', message);
                socket.broadcast.to('Main').emit('UPDATE_CHAT', message2);
                socket.emit('UPDATE_ROOMS', rooms, 'Main');
        }
    })

        const updateNicknames=()=> {
            io.sockets.emit('USER_ADDED', Object.keys(users));
        }


        //save messages to the database
        socket.on('SEND_MESSAGE',  (data)=> {
            
            /*var msg = data.trim();
            if(msg.substr(0,3) === '/w '){
                msg = msg.substr(3);
                var ind = msg.indexOf(' ');
                if(ind !== -1) {
                    var name = msg.substring(0, ind);
                    var msg  = msg.substring(ind+1);
                    if(name in users){
                        users[name].emit('whisper', {msg: msg ,nick: socket.nickname});
                    //store private message in database
                        var newPrivateMessage = new Private({sender:socket.nickname, reciever:name, msg:msg})
                        newPrivateMessage.save((err)=>{
                            console.log('\n==========STORE PRIVATE MESSAGE IN DATABASE==========\nSent by: '+newPrivateMessage.sender+'\nRecieved by: ' + newPrivateMessage.reciever + '\nWith Message: '+newPrivateMessage.msg+'\nSaved to database at: '+ newPrivateMessage.time)
                    //store private message event in database
                        var newMessageEvent=new Elog({type:'PRIVATE MESSAGE', name:socket.nickname, socket:socket.id})
                        newMessageEvent.save((err)=>{
                            if (err) throw err;
                            console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newMessageEvent.type+'\nCreated by: ' + newMessageEvent.name + '\nSent to: '+newPrivateMessage.reciever+'\nSaved to database at: '+ newMessageEvent.connect)
                    })
                        })
                    }else {
                        callback('Error! Enter a valid user');
                    }
                }else {
                    callback('Error! Please enter a message for your whisper');
                }
            }else{}*/
        //store new message event
            var newMessageEvent=new Elog({type:'MESSAGE SENT', name:socket.nickname, socket:socket.id, room:data['room']})
            newMessageEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newMessageEvent.type+'\nCreated by: ' + newMessageEvent.name + '\nFor Socket: '+newMessageEvent.socket+'\nIn the: '+newMessageEvent.room+'\nSaved to database at: '+ newMessageEvent.connect)
            })
            //var msg = data.trim();
            var newMsg = new Chat({msg: data['message'], nick: socket.nickname, room: data['room']})
            newMsg.save( (err) =>{
                if (err) throw err;
                console.log('\n==========STORE MESSAGE IN DATABASE==========\nMessage: '+newMsg.msg+'\nSent by: ' + newMsg.nick + '\nIn Room: '+newMsg.room)
                io.sockets.in(socket.room).emit('NEW_MESSAGE', {author:socket.nickname, message:data['message']})
            })
        })
        //handle the switching of rooms
        socket.on('SWITCH_ROOM', (newroom)=>{
            socket.leave(socket.room);
        //store leave room event
            var leaveRoomEvent=new Elog({type:'LEAVE ROOM', name:socket.nickname, socket:socket.id, room:socket.room})
            leaveRoomEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+leaveRoomEvent.type+'\nCreated by: ' + leaveRoomEvent.name + '\nFor Socket: '+leaveRoomEvent.socket+'\nIn the: '+leaveRoomEvent.room+'\nSaved to database at: '+ leaveRoomEvent.connect)
            })
            socket.join(newroom);
        //store join room event
            var joinRoomEvent=new Elog({type:'JOIN ROOM', name:socket.nickname, socket:socket.id, room:newroom})
            joinRoomEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+joinRoomEvent.type+'\nCreated by: ' + joinRoomEvent.name + '\nFor Socket: '+joinRoomEvent.socket+'\nIn the: '+joinRoomEvent.room+'\nSaved to database at: '+ joinRoomEvent.connect)
            })
            message3=({author:'CHAT BOT NINJA', message: 'You have connected to ' + newroom + ' and left ' + socket.room})
            socket.emit('UPDATE_CHAT', message3);
        // sent message to old room
            message4=({author:'CHAT BOT NINJA', message: socket.nickname+' has left this room'})
            socket.broadcast.to(socket.room).emit('UPDATE_CHAT', message4 );
        // update socket session room title
            socket.room = newroom;
        //let users know new user has joined the room
            message5=({author:'CHAT BOT NINJA', message: socket.nickname+'  has joined this room'})
            socket.broadcast.to(newroom).emit('UPDATE_CHAT', message5);
            socket.emit('UPDATE_ROOMS', rooms, newroom);
        });
        //when a user disconnects
        socket.on('disconnect',  (data) =>{
        if (!socket.nickname) return;
        //remove username from dictionary to allow its reuse
        delete  users[socket.nickname];
            Sockio.find({socket_id:socket.id},(err,socks)=>{
                if (err) throw err;
                //update disconnect time for socket in database 
                socks.forEach((sock)=> { 
                    sock.disconnectTime=new Date();
                    //save the update
                    sock.save((err)=>{
                        if (err) throw err;
                        console.log( "\n==========UPDATE SOCKET DISCONNECT IN DATABASE==========\nSocket_id: " + sock.socket_id + "\nNew disconnectTime: " + sock.disconnectTime + "\nSAVED" );
                    })
                })
            })
        //store disconnect event
            var disconnectEvent=new Elog({type:'DISCONNECT', disconnect: new Date(), name:socket.nickname, socket:socket.id})
            disconnectEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+disconnectEvent.type+'\nCreated by: ' + disconnectEvent.name + '\nFor Socket: '+disconnectEvent.socket+'\nSaved to database at: '+ disconnectEvent.disconnect)
            })
        //let other users in the room know user has disconnected
            message6=({author:'CHAT BOT NINJA', message: socket.nickname+' has disconnected'})
            socket.broadcast.emit('UPDATE_CHAT', message6);
            socket.leave(socket.room);
            updateNicknames();
        });
    })
}