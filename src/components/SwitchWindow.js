import React from 'react'
import "../theme/Switchwindow.css";


export default class SwitchWindow extends React.Component{
    render(){
        return(
            <div onClick={this.props.change} className="SwitchWindow">
                <img className="SwitchWindow__icon" src={this.props.icon} width={20} height={20}/>
            </div>
        )
    }
}
