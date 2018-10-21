import React from 'react'
import "../theme/Switchwindow.css";


export default class SwitchWindow extends React.Component{
    render(){
        return(
            <div onClick={this.props.change} className={"SwitchWindow" + (this.props.left ? " SwitchWindow--left" : "")}>
                <img className="SwitchWindow__icon" src={this.props.icon} width={15} height={15}/>
            </div>
        )
    }
}
