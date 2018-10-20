import React from 'react'
import "../../theme/Footer.css"
import {pointsController} from "../../App";
import Template from "../../model/Template";

export default class Footer extends React.Component{
    constructor(props){
        super(props);

        this.state = {selected: "microphone"};

        this.setMicrophones = this.setMicrophones.bind(this);
        this.setSources = this.setSources.bind(this);
    }

    setMicrophones(){
        this.setState({selected: "microphone"});
        pointsController.setMicrophones();
    }

    setSources(){
        this.setState({selected: "source"});
        pointsController.setSources();
    }

    export(){
        Template.export();
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
                    onClick={this.setSources}
                    className={"Footer__button" + (this.state.selected === "source" ? " Footer__button--selected" : "")}
                >
                    Add source
                </button>
                <button
                    className="Footer__button Footer__button--small"
                    onClick={() => Template.export()}
                >
                    JSON
                </button>
                <button
                    className="Footer__button Footer__button--small"
                    onClick={() => Template.exportDelaysAndAttenuations()}
                >
                    DELAYS
                </button>
            </div>
        )
    }
}
