import React from "react";
import { getUrl } from '../etc/request';
import axios from "axios/index";
import DropDown from './dropdown'
import Modal from './overlay'
import ItemDetail from './itemDetail'


export class SearchItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {result: []};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeContent = this.changeContent.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const dataFromForm = new FormData(event.target);
        const data = {};
        for (const pair of dataFromForm.entries()) {
            if (pair[1].length > 0) {data[pair[0]] = pair[1];}
        }
        const url = getUrl("search_item");
        axios.post(url, JSON.stringify(data))
            .then(res => {
                this.changeContent(res.data);
            });
    }

    changeContent(content) {
        this.setState({result: content});
    }

    render() {
        if (this.state.result.length === 0){
            return (
                <div>
                    <SearchBar submitToggle={this.handleSubmit}/>
                </div>
            );
        }
        else {
            return (
                <div>
                    <SearchBar submitToggle={this.handleSubmit}/>
                    <Table data={this.state.result}/>
                </div>
            );
        }
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {category: []};
    }

    componentDidMount() {
        const self = this;
        const url = getUrl("get_category");
        axios.get(url)
            .then(function (response) {
                self.setState({category: response.data})
            })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.props.submitToggle}>
                    <label>Keyword: </label>
                    <input name="keyword" type="text" placeholder="Enter Keyword"/>
                    <label> Minimum Price: </label>
                    <input name="minPrice" type="number" step="0.01" min="0" max="999999999" placeholder="Min Price"/>
                    <label> Maximum Price: </label>
                    <input name="maxPrice" type="number" step="0.01" min="0" max="999999999" placeholder="Max Price"/>
                    <label> Category: </label>
                    {this.state.category && <DropDown name="category" data={this.state.category}/>}
                    <label> Condition: </label>
                    <select name="condition">
                        <option value="">Any</option>
                        <option value="5">New</option>
                        <option value="4">Very Good</option>
                        <option value="3">Good</option>
                        <option value="2">Fair</option>
                        <option value="1">Pool</option>
                    </select>
                    <input id="submit2" type="submit" value="Search"/>
                </form>
            </div>
        );
    }
}

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isModalOpen: false };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    render() {
        return (
            <div>
                <table id="t01">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Current Bid</th>
                        <th>High Bidder</th>
                        <th>Get It Now Price</th>
                        <th>Auction Ends</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map(row => {
                            return <TableRow openModal={this.openModal} closeModal={this.closeModal} row={row}/>
                        })}
                    </tbody>
                </table>
                <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                    <ItemDetail target={this.target} closeModal={this.closeModal}/>
                </Modal>
            </div>
        );
    }

    openModal(id) {
        this.target = id;
        this.setState({ isModalOpen: true })
    }

    closeModal() {
        this.setState({ isModalOpen: false })
    }
}

class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.goToItem = this.goToItem.bind(this);
    }

    goToItem() {
        this.props.openModal(this.props.row);
    }

    render() {
        return (
            <tr>
                <td>{this.props.row.itemID}</td>
                <td><a href="javascript: return false;" onClick={this.goToItem}>{this.props.row.item_name}</a></td>
                <td>{this.props.row.bid_price === null ? 'N/A' : '$ ' + this.props.row.bid_price.toFixed(2)}</td>
                <td>{this.props.row.userName === null ? 'N/A' : this.props.row.userName}</td>
                <td>{this.props.row.get_it_now_price  === null ? 'N/A' : '$ ' + this.props.row.get_it_now_price.toFixed(2)}</td>
                <td>{this.props.row.end_time}</td>
            </tr>
        );
    }
}

export default SearchItem;