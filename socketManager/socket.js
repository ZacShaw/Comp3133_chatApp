var rooms = [],
    users = {},
    User = require('../models/Users.js'),
    Chat = require('../models/Chats.js'),
    Sockio = require('../models/Sockets.js'),
    Elog = require('../models/Events.js'),
    Private = require('../models/PrivateChats.js'),
    Rooms = require('../models/Rooms')

module.exports = (io)=>{
//Checks rooms on startup
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
    //Record Event in Database
        var connectEvent=new Elog({type:'CONNECTION', socket:socket.id, room:'Lobby'})
        connectEvent.save((err)=>{
                if (err) throw err;
                     console.log('\n==========STORE EVENT IN DATABASE==========\nSocket: '+connectEvent.socket+'\nWith type: '+connectEvent.type+"\nHas been connected @: "+ connectEvent.connect +'\nIn the: '+connectEvent.room+'\nSaved to database at: '+ connectEvent.connect)
            })
        socket.on('NEW_USER',  (data ,callback) =>{ 
        //checks for matching user in the dictionary
            if (data in users){
                callback(false);
            }
            else {
            //creates new entry in dictionary for new user
                callback(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            //store user in database
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
            //store event in database
                var newUserEvent=new Elog({type:'NEW USER',name:newUser.username, socket:socket.id, room:'Main Room'})
                newUserEvent.save((err)=>{
                    if (err) throw err;
                    console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newUserEvent.type+'\nCreated by: ' + newUserEvent.name + '\nFor Socket: '+newUserEvent.socket+'\nIn the: '+newUserEvent.room+'\nSaved to database at: '+ newUserEvent.connect)
                })
                socket.room = 'Main';
            // send user to Main room
                socket.join('Main');
            // announce to Main room that another user has connected to their room
                message=({author:'CHAT ANNOUNCER', message: 'You have connected to Main room'})
                message2=({author:'CHAT ANNOUNCER', message: socket.nickname + ' has connected to this room'})
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
            
        
        //record a message event
            var newMessageEvent=new Elog({type:'MESSAGE SENT', name:socket.nickname, socket:socket.id, room:data['room']})
            newMessageEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newMessageEvent.type+'\nCreated by: ' + newMessageEvent.name + '\nFor Socket: '+newMessageEvent.socket+'\nIn the: '+newMessageEvent.room+'\nSaved to database at: '+ newMessageEvent.connect)
            })

            var newMsg = new Chat({msg: data['message'], nick: socket.nickname, room: data['room'],})
            newMsg.save( (err) =>{
                if (err) throw err;
                console.log('\n==========STORE MESSAGE IN DATABASE==========\nMessage: '+newMsg.msg+'\nSent by: ' + newMsg.nick + '\nIn Room: '+newMsg.room)
                io.sockets.in(socket.room).emit('NEW_MESSAGE', {author:socket.nickname, message:data['message']})
            })
        })
        //Switching rooms
        socket.on('SWITCH_ROOM', (newroom)=>{
            socket.leave(socket.room);
        //record leave room event in database
            var leaveRoomEvent=new Elog({type:'LEAVE ROOM', name:socket.nickname, socket:socket.id, room:socket.room})
            leaveRoomEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+leaveRoomEvent.type+'\nCreated by: ' + leaveRoomEvent.name + '\nFor Socket: '+leaveRoomEvent.socket+'\nIn the: '+leaveRoomEvent.room+'\nSaved to database at: '+ leaveRoomEvent.connect)
            })
            socket.join(newroom);
        //record join room event in database
            var joinRoomEvent=new Elog({type:'JOIN ROOM', name:socket.nickname, socket:socket.id, room:newroom})
            joinRoomEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+joinRoomEvent.type+'\nCreated by: ' + joinRoomEvent.name + '\nFor Socket: '+joinRoomEvent.socket+'\nIn the: '+joinRoomEvent.room+'\nSaved to database at: '+ joinRoomEvent.connect)
            })
            message3=({author:'CHAT ANNOUNCER', message: 'You have connected to ' + newroom + ' and left ' + socket.room})
            socket.emit('UPDATE_CHAT', message3);
        // broadcast that user has left old room
            message4=({author:'CHAT ANNOUNCER', message: socket.nickname+' has left this room'})
            socket.broadcast.to(socket.room).emit('UPDATE_CHAT', message4 );
        // updateing room 
            socket.room = newroom;
        //broadcast that user has joined new room
            message5=({author:'CHAT ANNOUNCER', message: socket.nickname+'  has joined this room'})
            socket.broadcast.to(newroom).emit('UPDATE_CHAT', message5);
            socket.emit('UPDATE_ROOMS', rooms, newroom);
        });
        //User disconnect
        socket.on('disconnect',  (data) =>{
        if (!socket.nickname) return;
        //remove username entry from the dictionary
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
        //store disconnect event in the database
            var disconnectEvent=new Elog({type:'DISCONNECT', disconnect: new Date(), name:socket.nickname, socket:socket.id})
            disconnectEvent.save((err)=>{
                if (err) throw err;
                console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+disconnectEvent.type+'\nCreated by: ' + disconnectEvent.name + '\nFor Socket: '+disconnectEvent.socket+'\nSaved to database at: '+ disconnectEvent.disconnect)
            })
        //broadcast to other users in the room know user has disconnected
            message6=({author:'CHAT ANNOUNCER', message: socket.nickname+' has disconnected'})
            socket.broadcast.emit('UPDATE_CHAT', message6);
            socket.leave(socket.room);
            updateNicknames();
        });
    })
}