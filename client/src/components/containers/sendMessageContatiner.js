import React from "react";
import '../styles/containers.css'
class SendMessageContainer extends React.Component {
    render() { 
        return (

            <div>
                <form>
                    <input onKeyDown={this.props.send} type="text" placeholder="TYPE MESSAGE HERE" value={this.props.message} onChange={this.props.change} />

                </form>
            </div>
          );
    }
}
 
export default SendMessageContainer;