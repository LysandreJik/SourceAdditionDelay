import React from 'react'
import "../theme/Footer.css"
import {pointsController} from "../App";

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

    render(){
        return(
            <div className="Footer">
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
            </div>
        )
    }
}
