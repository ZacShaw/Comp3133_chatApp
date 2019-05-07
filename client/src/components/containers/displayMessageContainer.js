import React from "react";
import '../styles/containers.css'
class DisplayMessageContainer extends React.Component {
    render() { 
        return (
            <div >
                <div className='messageContainer'>
                {this.props.messages.map((message, i)=>{
                    return(
                            <div className="chatbox__messages" key={i}>
                                <div className="chatbox__messages__user-message">
                                    <div className=" message chatbox__messages__user-message--ind-message">
                                        <p className='name'>{message.author}</p>
                                        <br/>
                                        <p className="">{message.message}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>    
            </div>
        );
    }
}
 
export default DisplayMessageContainer;