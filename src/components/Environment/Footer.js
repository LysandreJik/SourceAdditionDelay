import React from 'react'
import "../../theme/Footer.css"
import {pointsController} from "../../App";
import Template from "../../model/Template";
import {refreshApp} from "../../controller/actions/UXActions";
import store from '../../controller/store/Store'

export default class Footer extends React.Component{
    constructor(props){
        super(props);

        this.state = {selected: "microphone"};

        this.setMicrophones = this.setMicrophones.bind(this);
    }

    setMicrophones(){
        this.setState({selected: "microphone"});
        pointsController.setMicrophones();
    }

    randomizePoints(){
        let canvas = document.getElementById('Canvas').getBoundingClientRect();
        pointsController.randomizePositions(20, 20, canvas.width-20, canvas.height-20);
        store.dispatch(refreshApp());
    }

    render(){
        return(
            <div className="Footer">
                <div id={"downloadAnchorElem"}/>
                <button
                    onClick={this.setMicrophones}
                    className={"Footer__button" + (this.state.selected === "microphone" ? " Footer__button--selected" : "")}
                >
                    Add microphone
                </button>
                <button
                    className="Footer__button"
                    onClick={() => {Template.exportDelaysAndAttenuations()}}
                >
                    Save model
                </button>
                <button
                    className="Footer__button"
                    onClick={this.randomizePoints}
                >
                    Randomize positions
                </button>
                <br/>
                <button
                    className="Footer__button Footer__button--large"
                    onClick={() => {Template.exportDelaysAndAttenuations()}}
                >
                    Randomize bank signals
                </button>
                <button
                    className="Footer__button Footer__button--large"
                    onClick={() => {Template.fetchMicrophonesInput()}}
                >
                    Generate
                </button>
            </div>
        )
    }
}
