import React, { Component } from 'react';

import History from "./history";
import Events from "./events";
import Rooms from "./rooms";
class Admin extends Component {
  logout(){
    window.location.replace('/')
  }
  render() {
    return (
      <div>
        <h1>Admin Room</h1>
        <h5><button onClick={this.logout}>Logout</button></h5>
        <History/>
        <Events/>
        <Rooms/>
      </div>
    );
  }
}

export default Admin;