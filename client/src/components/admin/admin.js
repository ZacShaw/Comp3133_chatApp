import React, { Component } from 'react';

import History from "./history";
import Events from "./events";
import Rooms from "./rooms";

const table1 = props => {
  return <button onClick={props.table1}>History</button>
}

class Admin extends Component {
  logout(){
    window.location.replace('/')
  }

  constructor(){
    super()
    this.state={
      showMe:false,
      showMe1:true,
      showMe2:false
    }
  }

  operation(){
    this.setState({
      showMe:!this.state.showMe,
      showMe1:false,
      showMe2:false
    })
    
  }

  operation1(){
    this.setState({
      showMe1:!this.state.showMe1,
      showMe:false,
      showMe2:false
    })
    
  }

  operation2(){
    this.setState({
      showMe2:!this.state.showMe2,
      showMe1:false,
      showMe:false
    })
    
  }
  render() {
    return (
      <div>
        <h1>Admin Room        <button onClick={this.logout}>Logout</button></h1>
        <h5><button onClick={()=>this.operation()}>History</button>
        <button onClick={()=>this.operation1()}>Rooms</button>
        <button onClick={()=>this.operation2()}>Events</button></h5>
        {
          this.state.showMe?
          <History/>
          :null
        }
        {
          this.state.showMe1?
          <Rooms/>
          :null
        }
        {
          this.state.showMe2?
          <Events/>
          :null
        }
       
       

      </div>
    );
  }
}

export default Admin;