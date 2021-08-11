import React from 'react';
import { getCookie, removeCookie} from './etc/cookie'
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import Home from "./Home";
import SellItem from './pods/sellItem'
import SearchItem from "./pods/searchItem";
import AuctionResult from "./pods/auctionResult"
import CategoryReport from "./pods/categoryReport"
import UserReport from "./pods/userReport"

export class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {isAdmin: getCookie("isAdmin")};
    }

    logout() {
        removeCookie();
        this.props.logoutToggle();
    }

    render() {
        return (
            <HashRouter>
                <div>
                    {getCookie("isAdmin") === "false" && <h1>Hello {getCookie("firstName")}! Welcome to Team077's GTBay</h1>}
                    {getCookie("isAdmin") === "true" && <h1>Hello Admin, {getCookie("firstName")}! Your position is {getCookie("position")}</h1>}
                    <ul className="header">
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li><NavLink to="/pods/searchItem">Search Item</NavLink></li>
                        <li><NavLink to="/pods/sellItem">Sell Item</NavLink></li>
                        <li><NavLink to="/pods/auctionResult">Auction Results</NavLink></li>
                        {this.state.isAdmin === "true" && <li><NavLink to="/pods/categoryReport">Category Report</NavLink></li>}
                        {this.state.isAdmin === "true" && <li><NavLink to="/pods/UserReport">User Report</NavLink></li>}
                        <li><NavLink exact to="/logout" onClick={this.logout}>Logout</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route path="/pods/searchItem" component={SearchItem}/>
                        <Route path="/pods/sellItem" component={SellItem}/>
                        <Route path="/pods/auctionResult" component={AuctionResult}/>
                        <Route path="/pods/categoryReport" component={CategoryReport}/>
                        <Route path="/pods/UserReport" component={UserReport}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default MainPage;