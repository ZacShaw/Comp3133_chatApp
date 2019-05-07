import React from "react";
import '../styles/containers.css'
class RoomSelectionContainer extends React.Component {

    render() { 
        return (
            <div>
                <div className='chatbox__room-list'>
                    <h1>Chat Rooms</h1>
                    <div>
                        <div>
                                {
                                    this.props.rooms.map((room, i)=>{
                                        return (<div  key={i}>
                                                    <button className='btn btn-2 btn-2g' onClick={this.props.onChangeValue} value={room}>{room}</button>
                                                </div>
                                        )
                                    })
                                }
                        </div>
                    </div>
                </div>
            </div>
          );
    }
}
 
export default RoomSelectionContainer;