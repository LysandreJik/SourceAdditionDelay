import React from 'react'
import '../../theme/Options.css'

export let SnapToGrid = 0;

export default class Options extends React.Component{

    constructor(props){
        super(props);

        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);

        this.state = {displayOptions: false, snapToGrid: 0};
    }

    onMouseOver(){
        this.setState({displayOptions: true})
    }

    onMouseLeave(){
        this.setState({displayOptions: false})
    }

    get options(){
        return(
            <div className="Options__div">
                {/*<div>*/}
                    {/*<div>Show Lines</div>*/}
                {/*</div>*/}
                <div>
                    <div>Snap to grid :</div>
                    <input className="Options__snapToGridInput" id="SnapToGridInput" defaultValue={SnapToGrid}/>
                    <button className="Options__snapToGridValidate" onClick={() => {SnapToGrid = document.getElementById('SnapToGridInput').value}}>OK</button>
                </div>
            </div>
        )
    }

    render(){
        return(
            <div className={"Options" + (this.state.displayOptions ? " Options--big" : "")} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
                {this.state.displayOptions ?
                    this.options
                    :
                    <div className="Options__header Options__text">Options</div>
                }
            </div>
        )
    }
}
