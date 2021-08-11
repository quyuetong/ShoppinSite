import React, { Component } from "react";
import {getUrl} from "../etc/request";
import axios from "axios/index";

class AuctionResult extends Component {
    constructor(props) {
        super(props);
        this.state = {toggle: 0};
        this.data = [];
    }

    componentDidMount() {
        const self = this;
        const url = getUrl("auction_result");
        axios.get(url)
            .then(function (response) {
                self.data = response.data;
                self.setState({toggle: 1});
            })
    }

    render() {
        if (this.state.toggle === 0) {
            return <h1>Loading.....</h1>
        }
        else {
            return (
                <div>
                    <Table data={this.data}/>
                </div>
            )
        }
    }
}

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <table id="t01">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Sales Price</th>
                        <th>Winner</th>
                        <th>Auction Ended</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.data.map(row => {
                        return <TableRow row={row}/>
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

class TableRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.row.itemID}</td>
                <td>{this.props.row.item_name}</td>
                <td>${this.props.row.sold_price.toFixed(2)}</td>
                <td>{this.props.row.winner}</td>
                <td>{this.props.row.sold_time}</td>
            </tr>
        );
    }
}

export default AuctionResult;