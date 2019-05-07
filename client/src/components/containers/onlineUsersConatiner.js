import React from "react";
import '../styles/containers.css'
class OnlineUsersContainer extends React.Component {

    render() { 
        return (
            <div>
                <div className='chatbox__user-list'>
                    <h1>Online Users</h1> 
                    <div>
                        {
                            this.props.online.map((user, i)=>{
                                return <div  className='chatbox__user--active' key={i}>
                                            <p className='user'>{user}</p>
                                        </div>
                            })
                        }
                    </div>
                </div>
            </div>
          );
    }
}
 
export default OnlineUsersContainer;