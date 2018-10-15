import React from 'react'
import "../theme/Footer.css"

export default class Footer extends React.Component{
    constructor(props){
        super(props);

        this.state = {selected: "microphone"};
    }

    render(){
        return(
            <div className="Footer">
                <button 
                    onClick={() => this.setState({selected: "microphone"})} 
                    className={"Footer__button" + (this.state.selected === "microphone" ? " Footer__button--selected" : "")}
                >
                    Add microphone
                </button>
                <button 
                    onClick={() => this.setState({selected: "source"})} 
                    className={"Footer__button" + (this.state.selected === "source" ? " Footer__button--selected" : "")}
                >
                    Add source
                </button>
            </div>
        )
    }
}
