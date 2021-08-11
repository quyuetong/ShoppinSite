import React from 'react';
import { getUrl } from '../etc/request';
import axios from "axios/index";


export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {success: 1}
    }

    handleSubmit(event) {
        event.preventDefault();
        const dataFromForm = new FormData(event.target);
        const data = {};
        for (const pair of dataFromForm.entries()) {
            if (pair[1].length > 0) {data[pair[0]] = pair[1];}
        }
        if (data.password === data.password2){
            const url = getUrl("register");
            axios.post(url, JSON.stringify(data)).then(res =>
            {
                if (res.data.result) {
                    this.setState({success: 2});
                }
                else {
                    alert(res.data.message);
                    this.setState({success: 3});
                }
            });
        }
        else {
            alert("Confirm Password not match with Password!")
        }
    }

    render() {
        if (this.state.success === 1) {
            return (
                <div>
                    <form className="full" onSubmit={this.handleSubmit}>
                        <label> Username: </label>
                        <input name="username" type="text" placeholder="Enter Username" required/>
                        <br/>
                        <label> Password: </label>
                        <input name="password" type="password" placeholder="Enter Password" required/>
                        <br/>
                        <label> Confirm Password: </label>
                        <input name="password2" type="password" placeholder="Re Enter Password" required/>
                        <br/>
                        <label> First Name: </label>
                        <input name="firstname" type="text" placeholder="Enter First Name" required/>
                        <br/>
                        <label> Last Name: </label>
                        <input name="lastname" type="text" placeholder="Enter Last Name" required/>
                        <br/>
                        <input type="submit" value="Register" id="submit1"/>
                        <input type="reset" id="submit1"/>
                    </form>
                </div>
            );
        }
        else if (this.state.success === 2) {
            return <h2>You have successful registered, please proceed to login.</h2>
        }
        else {
            return <h2>Register failed, please try again.</h2>
        }
    }
}

export default Register;
