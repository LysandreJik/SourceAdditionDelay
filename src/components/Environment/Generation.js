import '../../theme/Generation.css'
import React from 'react'
import store from '../../controller/store/Store'
import {showEnvironmentCanvas} from "../../controller/actions/PageActions";

export default class Generation extends React.Component{

    constructor(props){
        super(props);

        this.state = {selected: "yes"};
    }

    render(){
        return(
            <div className="Generation">
                <div className="Generation__div">
                    <span>Generate</span><input onChange={() => this.val = parseInt(document.getElementById("amount").value)} id={"amount"}/><span>different audio clips</span>
                </div>
                <div className="Generation__div">
                    <span>Use base signals</span>
                    <button onClick={() => this.setState({selected: "yes"})} className={"Generation__button" + (this.state.selected === "yes" ? " Generation__button--selected" : "")}>Yes</button>
                    <button onClick={() => this.setState({selected: "no"})} className={"Generation__button" + (this.state.selected === "no" ? " Generation__button--selected" : "")}>No</button>
                </div>
                <button onClick={() => {
                    store.dispatch(
                        showEnvironmentCanvas(
                            () => this.props.callback(this.val, this.state.selected === "yes")
                        )
                    )
                }}>Generate</button>
            </div>
        )
    }
}