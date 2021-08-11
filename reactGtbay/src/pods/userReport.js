import React, { Component } from "react";
import {getUrl} from "../etc/request";
import axios from "axios/index";

class UserReport extends Component {
    constructor(props) {
        super(props);
        this.state = {toggle: 0};
        this.data = [];
    }

    componentDidMount() {
        const self = this;
        const url = getUrl("user_report");
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
                        <th>Username</th>
                        <th>Listed</th>
                        <th>Sold</th>
                        <th>Purchased</th>
                        <th>Rated</th>
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
                <td>{this.props.row.userName}</td>
                <td>{this.props.row.listed}</td>
                <td>{this.props.row.sold}</td>
                <td>{this.props.row.purchased}</td>
                <td>{this.props.row.rated}</td>
            </tr>
        );
    }
}

export default UserReport;