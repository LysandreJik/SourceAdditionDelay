import React from 'react'
import '../../theme/Options.css'

export let SnapToGrid = 0;
export let MaxNumberOfPoints = 1000;

export default class Options extends React.Component{

    constructor(props){
        super(props);

        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);

        this.state = {displayOptions: false, snapToGrid: 0, selectedNumberOfPoints: 10000};
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
                <div className="Options__SnapToGrid">
                    <div>Snap to grid :</div>
                    <input className="Options__snapToGridInput" id="SnapToGridInput" defaultValue={SnapToGrid}/>
                    <button className="Options__snapToGridValidate" onClick={() => {SnapToGrid = document.getElementById('SnapToGridInput').value}}>OK</button>
                </div>
                <div>
                    <div className="Options__NPoints">Max number of points :</div>
                    <button className={"Options__snapToGridValidate Options__snapToGridValidate--big" + (MaxNumberOfPoints === 1000 ? " Options__snapToGridValidate--selected" : "")} onClick={() => {this.setState({update: !this.state.update}); MaxNumberOfPoints = 1000}}>10⁴</button>
                    <button className={"Options__snapToGridValidate Options__snapToGridValidate--big" + (MaxNumberOfPoints === 10000 ? " Options__snapToGridValidate--selected" : "")} onClick={() => {this.setState({update: !this.state.update}); MaxNumberOfPoints = 10000}}>10⁵</button>
                    <button className={"Options__snapToGridValidate Options__snapToGridValidate--big" + (MaxNumberOfPoints === 100000 ? " Options__snapToGridValidate--selected" : "")} onClick={() => {this.setState({update: !this.state.update}); MaxNumberOfPoints = 100000}}>10⁶</button>
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
