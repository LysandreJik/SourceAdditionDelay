import '../../theme/Generation.css'
import React from 'react'
import store from '../../controller/store/Store'
import {showEnvironmentCanvas, showSignal} from "../../controller/actions/PageActions";
import Return from "../../icons/ionicons_back.svg";

export default class Generation extends React.Component{

    constructor(props){
        super(props);

        this.state = {selected: "yes"};
    }

    render(){
        return(
            <div className="Generation">
                <img onClick={() => {
                    store.dispatch(showEnvironmentCanvas())
                }} className="Generation__return" src={Return} width={30} height={30}/>
                <div className="Generation__div">
                    <span>Generate</span><input onChange={() => this.val = parseInt(document.getElementById("amount").value)} id={"amount"}/><span>different audio clips</span>
                </div>
                <div className="Generation__div">
                    <span>From between</span>
                    <input onChange={() => this.minAudio = parseInt(document.getElementById("minAudio").value)} id={"minAudio"}/>
                    and
                    <input onChange={() => this.maxAudio = parseInt(document.getElementById("maxAudio").value)} id={"maxAudio"}/>
                    <span>audio clips</span>
                </div>
                <div className="Generation__div">
                    <span>With T0 = [</span>
                    <input onChange={() => this.minT0 = parseInt(document.getElementById("minT0").value)} id={"minT0"}/>
                    ;
                    <input onChange={() => this.maxT0 = parseInt(document.getElementById("maxT0").value)} id={"maxT0"}/>
                    <span>]</span>
                </div>
                <div className="Generation__div">
                    <span>Use base signals</span>
                    <button onClick={() => this.setState({selected: "yes"})} className={"Generation__button" + (this.state.selected === "yes" ? " Generation__button--selected" : "")}>Yes</button>
                    <button onClick={() => this.setState({selected: "no"})} className={"Generation__button" + (this.state.selected === "no" ? " Generation__button--selected" : "")}>No</button>
                </div>
                <button onClick={() => {
                    store.dispatch(
                        showEnvironmentCanvas(
                            () => this.props.callback(this.val, [this.minAudio, this.maxAudio], [this.minT0, this.maxT0], this.state.selected === "yes")
                        )
                    )
                }}>Generate</button>
            </div>
        )
    }
}
