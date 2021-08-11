import React from "react";
import {getUrl} from "../etc/request";
import axios from "axios/index";
import {getCookie} from "../etc/cookie";
import ReactStars from 'react-stars'

export class ItemRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {toggle: 0, stars: 0};
        this.deleteMyRating = this.deleteMyRating.bind(this);
        this.submitRating = this.submitRating.bind(this);
        this.data = []
    }

    componentDidMount() {
        const self = this;
        self.reloadRating()
    }

    reloadRating() {
        const self = this;
        self.setState({toggle: 0});
        const url = getUrl("get_rating");
        const data = {itemID: this.props.itemID, userID: getCookie("userID")};
        axios.post(url, JSON.stringify(data))
            .then(function (res) {
                self.data = res.data.ratings;
                self.setState({toggle: 1, avg: res.data.avg, isOwner: res.data.isOwner})
            })
    }

    deleteMyRating() {
        const self = this;
        const confirm = window.confirm('Are you sure you wish to delete your rating?');
        if (!confirm) {
            return
        }
        const data = {userID: getCookie("userID"), itemID: this.props.itemID};
        const url = getUrl("delete_rating");
        axios.post(url, JSON.stringify(data))
            .then(function (res) {
                if (res.status === 200) {
                    self.reloadRating();
                }
            })
    }

    submitRating(event) {
        event.preventDefault();
        if (this.state.isOwner) {
            alert("You cannot rate an item twice, please delete your previous rating first.");
            return
        }
        if (this.state.stars === 0) {
            alert("Please rate item from 1 to 5 stars before submit.");
            return
        }
        const self = this;
        const dataFromForm = new FormData(event.target);
        const data = {userID: getCookie("userID"), itemID: this.props.itemID, rating: this.state.stars, comment: dataFromForm.get("comment")};
        const url = getUrl("rate_item");
        axios.post(url, JSON.stringify(data))
            .then(function (res) {
                if (res.status === 200) {
                    self.reloadRating();
                }
            })
    }

    render() {
        if (this.state.toggle === 0) {
            return <h1>Loading.....</h1>
        }
        else{
            return (
                <div>
                    <label className="itemDetail">Item ID: </label>
                    <label className="itemDetail">{this.props.itemID}</label>
                    <br/>
                    <label className="itemDetail">Item Name: </label>
                    <label className="itemDetail">{this.props.itemName}</label>
                    <br/>
                    <label className="itemDetail">Average Rating: </label>
                    <label className="itemDetail">{this.state.avg === null ? 'N/A' : this.state.avg}</label>
                    {this.data.map(row => {
                        return <RatingBlock data={row} deleteToggle={this.deleteMyRating}/>
                    })}
                    <br/>
                    <label className="itemDetail">My Rating</label>
                    <ReactStars onChange={(newRating) => {this.state.stars = newRating}} count={5} size={36} half={false}/>
                    <label className="itemDetail">Comments</label>
                    <form onSubmit={this.submitRating}>
                        <textarea name="comment" placeholder="Enter Comments" rows="5" cols="50"/>
                        <input id="submit2" type="submit" value="Rate This Item"/>
                        <button className="itemDetail" onClick={this.props.closeRating}>Cancel</button>
                    </form>
                </div>
            )
        }
    }
}


class RatingBlock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="rating">
                {this.props.data.isOwner === 1 && <a className="itemDetail" href="javascript: return false;" onClick={this.props.deleteToggle}>Delete My Rating</a>}
                <label className="itemDetail">Rated by</label>
                <label className="itemDetail">{this.props.data.userName}</label>
                <label className="itemDetail">{this.props.data.item_rating} Stars</label>
                <br/>
                <label className="itemDetail">Date: </label>
                <label className="itemDetail">{this.props.data.rateTime}</label>
                <br/>
                <label className="itemDetail">{this.props.data.comment}</label>
            </div>
        );
    }
}


export default ItemRating