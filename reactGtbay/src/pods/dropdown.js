import React from "react";

export class DropDown extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <select name={this.props.name}>
                <option value="">Any</option>
                {
                    this.props.data.map(opt => {
                        return <option value={opt}>{opt}</option>
                    })
                }
            </select>
        );
    }
}

export default DropDown