import React from 'react'
import "../../theme/Footer.css"
import {pointsController} from "../../App";
import Template from "../../model/Template";
import {refreshApp} from "../../controller/actions/UXActions";
import store from '../../controller/store/Store'
import {signalsController} from "../Signal/SignalCanvas";

function gaussianRand() {
    let rand = 0;

    for (let i = 0; i < 6; i += 1) {
        rand += Math.random();
    }

    return rand / 6;
}

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

    randomizeBankSignals(){
        pointsController.clearPoints();

        let bankSignals = signalsController.getBankSignals();

        //console.log(bankSignals);

        bankSignals.forEach(signal => {
            if(signal.signal.startsWith('.')){
                signal.path = signal.signal.substring(9)
            }
            pointsController.setSources(signal);
            pointsController.addPoint(0, 0, pointsController.getMethod(), Math.random()*60);
        });

        let microphones = gaussianRand()*bankSignals.length;

        pointsController.setMicrophones();
        for(let i = 0; i < microphones; i++){pointsController.addPoint(0, 0, pointsController.getMethod())}

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
                    className="Footer__button "
                    onClick={this.randomizeBankSignals}
                >
                    Randomize bank signals
                </button>
                <button
                    className="Footer__button "
                    onClick={() => {Template.fetchMicrophonesInput()}}
                >
                    Generate
                </button>
                <button
                    className="Footer__button "
                    onClick={() => {Template.fetchAndSave()}}
                >
                    Generate 10
                </button>
            </div>
        )
    }
}
