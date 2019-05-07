import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Admin from "./admin";
import '../styles/logins.css'
class Adminlogin  extends Component {

    constructor(props){
        super(props);

        this.state={
            dbuser:'',
            dbpass:'',
            username: "",
            password: "",
            isAdmin:false
        };
    }
    componentWillMount(){
       // axios.get('http://localhost:5000/api/admin')  
         //   .then(response => this.setState({dbuser: response.data[0].username, dbpass:response.data[0].password}))
    }
    validateForm(){
        return this.state.username === this.state.dbuser && this.state.password === this.state.dbpass;
    }
    
    handleChange = event => {
        console.log([event.target.id]+"  "+ event.target.value)
       this.setState({
            [event.target.id]: event.target.value
        });
    }



    render() { 
        const {isAdmin}=this.state
        this.handleSubmit = event => {
            event.preventDefault();
            this.setState({isAdmin:true})
        }
        return (
            <div >
                {
                    !isAdmin?
                    <div>
                        <div className='bold-line'></div>
                        <div className='container'>
                            <div className='window'>
                            <div className='overlay'></div>
                                <div className='content'>
                                    <div className='welcome'>Admin Login</div>
                                        <div className='input-fields'>
                                        <form onSubmit={this.handleSubmit}>
                                            <FormGroup controlId="username">
                                                <FormControl className='input-line full-width'  placeholder='Username' autoFocus value={this.state.username} onChange={this.handleChange}/>
                                            </FormGroup>
                                            <FormGroup controlId="password">
                                                <FormControl  className='input-line full-width' placeholder='Password' value={this.state.password} onChange={this.handleChange} type="password"/>
                                            </FormGroup>
                                            <Button className='ghost-round full-width' block disabled={!this.validateForm()} type="submit">Login</Button>
                                        </form>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                    :
                    <div>
                        <Admin/>
                    </div>
                }
                
            </div>
          );
    }
}
 
export default Adminlogin ;

/*

*/