import React, { Component } from 'react';
import SendMessageContainer from './components/containers/sendMessageContatiner'
import DisplayMessageContainer from './components/containers/displayMessageContainer'
import OnlineUsersContainer from './components/containers/onlineUsersConatiner'
import Username from './components/username'
import RoomSelectionContainer from './components/containers/roomSelectionContainer'
import Adminlogin from './components/admin/Adminlogin'
import io from "socket.io-client";
import './components/styles/containers.css'
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      socket:null,
      username:'',
      message:'',
      messages:[],
      rooms:[],
      error:'',
      room:'Main',
      users:[],
      currentRoom:'',
      user:'',
      admin:false
      
    }
    this.socket =  io('localhost:5000');
  }
  ///////////Choosing a username///////////
  submitUsername = e =>{
    e.preventDefault()
    this.socket.emit('NEW_USER', this.state.username, ()=>{
      this.setState({user:this.state.username, error:'Username Taken'})
    })
  }
  handleChange = event => {
    event.preventDefault();
    this.setState({
        [event.target.id]: event.target.value
    });
  }

///////////Realtime Sockets///////////
componentDidMount(){
  this.socket.on('USER_ADDED', data=>{
    this.setState({users:data}) 
  })
  this.socket.on('UPDATE_CHAT', data=>{
    this.addMessage(data)
  })
  this.socket.on('UPDATE_ROOMS', (rooms, currentRoom)=>{
    console.log(currentRoom)
    this.setState({rooms:rooms, currentRoom:currentRoom})
  })
  this.socket.on('NEW_MESSAGE', data=>{
    this.addMessage(data)
  })
}
/////Display Message/////
addMessage = data => {
  this.setState({messages: [...this.state.messages, data]});
}
//send message//
onEnter=(ev)=>{
  if(ev.key==='Enter'){
    this.sendMessage(ev)
  }
}
  
sendMessage = ev => {
  ev.preventDefault()
  this.socket.emit('SEND_MESSAGE', {
      author: this.props.user,
      message: this.state.message,
      room: this.state.room
  });
  this.setState({message: ''});

}
showAdmin=()=>{
  this.setState({admin:true});
}
showUser=()=>{
  this.setState({admin:false});
}
  render() {
///////////Populating Rooms///////////
const {rooms, user, room, admin} = this.state

let roomName=[]
rooms.forEach(room=>{
    return roomName.push(room)
})
///////////Changing Rooms///////////
this.handleRoomChange = e =>{
  if(room===e.target.value){
    alert('You are already in this room')
  }else{
    this.socket.emit('SWITCH_ROOM', e.target.value)
    this.setState({room:e.target.value})
  }

  
}

    return (
<div >
  {
    !user?
    <div>
      
      {
        !admin?
        
        <div>
          <button className='ghost-round2 full-width' onClick={this.showAdmin}>Admin Login</button>
          <Username change={this.handleChange} submit={this.submitUsername} user={this.state.username}/>
        </div>
        :
        <div>
          <button className='ghost-round2 full-width' onClick={this.showUser}>Chat Login</button>
          <Adminlogin/>
        </div>
      }
    </div>
    :
    <div className='container'>
    <div className='chatbox' id='contentWrap'>
    <h1 align="center">{room} Chatroom</h1>
      <OnlineUsersContainer online={this.state.users}/>
      <RoomSelectionContainer rooms={roomName} value={this.state.room} onChangeValue={this.handleRoomChange}/>
      <DisplayMessageContainer messages={this.state.messages}/>
      <SendMessageContainer message={this.state.message} change={ev=>this.setState({message: ev.target.value})} send={this.onEnter}/>    
    </div>
    </div>
  }
  
  
</div>
    );
  }
}

export default App;
