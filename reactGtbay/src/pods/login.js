import React from 'react';
import { getUrl } from '../etc/request';
import Cookies from 'universal-cookie';
import axios from "axios/index";


export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {message: ""};
    }

    handleSubmit(event) {
        event.preventDefault();
        const username = this.refs["username"].value;
        const password = this.refs["password"].value;
        const data = {"username": username, "password": password};
        const url = getUrl("login");
        axios.post(url, data).then(res =>
        {
            if (res.data.result) {
                const cookies = new Cookies();
                Object.keys(res.data.data).forEach(
                    function (key) {
                        cookies.set(key, res.data.data[key], { path: '/' });
                    }
                );
                this.props.loginToggle();
            }
            else {
                this.setState({message: res.data.message});
            }
        });
    }

    render() {
        return (
            <div>
                <form className="full" onSubmit={this.handleSubmit}>
                    <label> Username: </label>
                    <input ref="username" type="text" placeholder="Enter Username" required/>
                    <br/>
                    <label> Password: </label>
                    <input ref="password" type="password" placeholder="Enter Password" required/>
                    <br/>
                    {this.state.message !== "" && <label className="errorMessage">{this.state.message}</label>}
                    <br/>
                    <input type="submit" value="Submit" id="submit1"/>
                    <input type="reset" id="submit1"/>
                </form>
            </div>
        );
    }
}

export default Login;
