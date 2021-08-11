import React, { Component } from "react";
import {getUrl} from "../etc/request";
import axios from "axios/index";

class CategoryReport extends Component {
    constructor(props) {
        super(props);
        this.state = {toggle: 0};
        this.data = [];
    }

    componentDidMount() {
        const self = this;
        const url = getUrl("category_report");
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
                        <th>Category</th>
                        <th>Total Item</th>
                        <th>Min Price</th>
                        <th>Max Price</th>
                        <th>Average Price</th>
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
                <td>{this.props.row.categoryName}</td>
                <td>{this.props.row.total}</td>
                <td>{this.props.row.minimum === null ? 'N/A' : '$' + this.props.row.minimum.toFixed(2)}</td>
                <td>{this.props.row.maximum === null ? 'N/A' : '$' + this.props.row.maximum.toFixed(2)}</td>
                <td>{this.props.row.average === null ? 'N/A' : '$' + this.props.row.average.toFixed(2)}</td>
            </tr>
        );
    }
}

export default CategoryReport;