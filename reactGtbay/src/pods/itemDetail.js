import React from "react";
import {getUrl} from "../etc/request";
import axios from "axios/index";
import {getCookie} from "../etc/cookie";
import Modal from './overlay'
import ItemRating from "./itemRating";


export class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {toggle: 0, isRatingOpen: false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
        this.openRating = this.openRating.bind(this);
        this.closeRating = this.closeRating.bind(this);
    }

    componentDidMount() {
        const self = this;
        self.reloadItem();
    }

    reloadItem() {
        const self = this;
        self.setState({toggle: 0});
        const url = getUrl("get_item");
        const data = {itemID: this.props.target.itemID};
        axios.post(url, JSON.stringify(data))
            .then(function (response) {
                const next = self.state.toggle + 1;
                const minBid = self.props.target.bid_price === null ? response.data.item.start_price + 1 : self.props.target.bid_price + 1;
                self.setState({toggle: next, bid: response.data.bid, item: response.data.item, minBid: minBid})
            })
    }

    changeDescription() {
        const content = prompt("Please enter new description","");
        if (content === null) {
            return
        }
        if (content.length === 0){
            alert("Description cannot be empty!");
            return
        }
        const data = {description: content, itemID: this.props.target.itemID};
        const url = getUrl("change_description");
        axios.post(url, JSON.stringify(data))
            .then(res => {
                if (res.status === 200){
                    this.reloadItem();
                }
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.item.owner_userID === Number(getCookie("userID"))){
            alert("Don't cheat! You cannot bid your own item!!");
            return
        }
        const dataFromForm = new FormData(event.target);
        const data = {itemID: this.props.target.itemID, userID: getCookie("userID"), userName: getCookie("userName")};
        for (const pair of dataFromForm.entries()) {
            if (pair[1].length > 0) {data[pair[0]] = pair[1];}
        }
        const url = getUrl("bid_item");
        data["getNow"] = this.props.target.get_it_now_price !== null && Number(data.bidPrice) >= this.props.target.get_it_now_price;
        if (data["getNow"]) {
            data["bidPrice"] = this.props.target.get_it_now_price;
        }
        axios.post(url, JSON.stringify(data))
            .then(res => {
                if (res.data.result) {
                    alert(res.data.message);
                    this.props.target.bid_price = Number(data.bidPrice);
                    this.reloadItem();
                }
                else {
                    alert(res.data.message);
                }
            });
    }

    render() {
        if (this.state.toggle === 0){
            return <h1>Loading.....</h1>
        }
        else {
            return (
                <div>
                    <label className="itemDetail">Item ID: </label>
                    <label className="itemDetail">{this.props.target.itemID}</label>
                    <a style={{marginLeft: "30px"}} href="javascript: return false;" onClick={this.openRating}>View Rating</a>
                    <Modal isOpen={this.state.isRatingOpen} onClose={() => this.closeRating()}>
                        <ItemRating itemID={this.props.target.itemID} itemName={this.props.target.item_name} closeRating={this.closeRating}/>
                    </Modal>
                    <br/>
                    <label className="itemDetail">Item Name: </label>
                    <label className="itemDetail">{this.props.target.item_name}</label>
                    <br/>
                    <label className="itemDetail">Description: </label>
                    <label className="itemDetail">{this.state.item.description}</label>
                    {this.state.item.owner_userID === Number(getCookie("userID")) && <a href="javascript: return false;" onClick={this.changeDescription}>Edit Description</a>}
                    <br/>
                    <label className="itemDetail">Category: </label>
                    <label className="itemDetail">{this.state.item.category}</label>
                    <br/>
                    <label className="itemDetail">Condition: </label>
                    <label className="itemDetail">{this.state.item.condition}</label>
                    <br/>
                    <label className="itemDetail">Return Accepted?: </label>
                    <label className="itemDetail">{this.state.item.returnable}</label>
                    <br/>
                    {this.props.target.get_it_now_price !== null && <form onSubmit={this.handleSubmit}>
                        <label className="itemDetail">Get it now Price: ${this.props.target.get_it_now_price.toFixed(2)}</label>
                        <input type="number" name="bidPrice" style={{display: "none"}} value={this.props.target.get_it_now_price}/>
                        <input id="submit2" type="submit" value="Get It Now!"/>
                        <br/>
                    </form>}
                    <label className="itemDetail">Auction Ends: </label>
                    <label className="itemDetail">{this.props.target.end_time}</label>
                    <br/>
                    <label>Latest Bids</label>
                    <Table data={this.state.bid}/>
                    <br/>
                    <form onSubmit={this.handleSubmit}>
                        <label className="itemDetail">Your bid: $</label>
                        <input name="bidPrice" type="number" step="0.01" min={this.state.minBid} max="999999999" placeholder="Bid Price" required/>
                        <br/>
                        <label className="itemDetail">Minimum bid ${this.state.minBid.toFixed(2)}</label>
                        <br/>
                        <input id="submit2" type="submit" value="Bid On This Item"/>
                        <button className="itemDetail" onClick={this.props.closeModal}>Cancel</button>
                    </form>
                </div>
            )
        }
    }

    openRating() {
        this.setState({ isRatingOpen: true })
    }

    closeRating() {
        this.setState({ isRatingOpen: false })
    }
}


class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isModalOpen: false };
    }

    render() {
        return (
            <table>
                <thead>
                <tr>
                    <th>Bid Amount</th>
                    <th>Time of Bid</th>
                    <th>Username</th>
                </tr>
                </thead>
                <tbody>
                {this.props.data.map(row => {
                    return <TableRow openModal={this.openModal} closeModal={this.closeModal} row={row}/>
                })}
                </tbody>
            </table>
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
                <td>${this.props.row.bid_price.toFixed(2)}</td>
                <td>{this.props.row.bid_time}</td>
                <td>{this.props.row.userName}</td>
            </tr>
        );
    }
}


export default ItemDetail