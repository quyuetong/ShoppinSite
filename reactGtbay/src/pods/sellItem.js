import React from "react";
import {getUrl} from "../etc/request";
import axios from "axios/index";
import {getCookie} from "../etc/cookie";

export class SellItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {success: 1};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.changeContentToOne = this.changeContentToOne.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const dataFromForm = new FormData(event.target);
        const data = {};
        for (const pair of dataFromForm.entries()) {
            if (pair[1].length > 0) {data[pair[0]] = pair[1];}
        }
        data["ownerUserID"] = getCookie("userID");
        const url = getUrl("list_item");
        axios.post(url, JSON.stringify(data))
            .then(res => {
                if (res.data.result) {
                    this.changeContent({success: 2});
                }
                else {
                    alert(res.data.message);
                }
            });
    }

    changeContent(content) {
        this.setState(content);
    }

    changeContentToOne() {
        this.changeContent({success: 1})
    }

    render() {
        if (this.state.success === 1){
            return (
                <div>
                    <SellMenu submitToggle={this.handleSubmit}/>
                </div>
            );
        }
        else if (this.state.success === 2) {
            return (
                <div>
                    <h2>You item have been successful listed.</h2>
                    <button onClick={this.changeContentToOne}>List more item</button>
                </div>
            );
        }
    }
}

class SellMenu extends React.Component {
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
                    <div id="sellItem">
                        <label className="sellItem">Item Name: </label>
                        <input name="name" type="text" placeholder="Enter Item Name" required/>
                    </div>
                    <div id="sellItem">
                        <label className="sellItem">Description: </label>
                        <br/>
                        <textarea className="sellItem2" name="description" type="textarea" rows="5" cols="50" placeholder="Enter Description" required/>
                    </div>
                    <div id="sellItem">
                        <label className="sellItem2">Category: </label>
                        {this.state.category && <DropDown name="category" data={this.state.category}/>}
                    </div>
                    <div id="sellItem">
                        <label className="sellItem">Condition: </label>
                        <select name="condition">
                            <option value="5">New</option>
                            <option value="4">Very Good</option>
                            <option value="3">Good</option>
                            <option value="2">Fair</option>
                            <option value="1">Pool</option>
                        </select>
                    </div>
                    <div id="sellItem">
                        <label className="sellItem">Start auction bidding at $: </label>
                        <input name="startPrice" type="number" step="0.01" min="1" max="999999999" placeholder="Start Price" required/>
                    </div>
                    <div id="sellItem">
                        <label className="sellItem">Minimum sale price $: </label>
                        <input name="minPrice" type="number" step="0.01" min="1" max="999999999" placeholder="Min Price" required/>
                    </div>
                    <div id="sellItem">
                        <label className="sellItem">Auction ends in: </label>
                        <select name="endDays">
                            <option value="1">1 days</option>
                            <option value="3">3 days</option>
                            <option value="5">5 days</option>
                            <option value="7">7 days</option>
                        </select>
                    </div>
                    <div id="sellItem">
                        <label className="sellItem">Get It Now price(Optional) $: </label>
                        <input name="getNowPrice" type="number" step="0.01" min="1" max="999999999" placeholder="Get It Now Price"/>
                    </div>
                    <div id="sellItem">
                        <label className="sellItem">Returns Accepted?: </label>
                        <input name="returnable" type="checkbox"/>
                    </div>
                    <div id="sellItem">
                        <input id="submit2" type="submit" value="List my Item"/>
                    </div>
                </form>
            </div>
        );
    }
}


export class DropDown extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <select name={this.props.name}>
                {
                    this.props.data.map(opt => {
                        return <option value={opt}>{opt}</option>
                    })
                }
            </select>
        );
    }
}

export default SellItem;