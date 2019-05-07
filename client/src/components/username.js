import React from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";

class Username extends React.Component {

    render() { 
        return (
            <div>
                <div className='bold-line'></div>
                <div className='container'>
                    <div className='window'>
                        <div className='overlay'></div>
                        <div className='content'>
                            <div className='welcome'>Chat Login</div>
                            <div className='input-fields'>
                                <form onSubmit={this.props.submit}>
                                    <FormGroup controlId="username">
                                        <FormControl className='input-line full-width'  placeholder='Username' autoFocus value={this.props.user} onChange={this.props.change}/>
                                    </FormGroup>
                                    <Button className='ghost-round full-width' type="submit">Login</Button>
                                    <p>{this.error}</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          );
    }
}
 
export default Username;