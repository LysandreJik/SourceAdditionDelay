import React from 'react'
import "../theme/Switchwindow.css";


export default class SwitchWindow extends React.Component{

    getStyle(){
        let style = {};
        if(this.props.left){
            style.left = this.props.left
        }

        if(this.props.microphone){
            style.top = "calc(50% + 50px)";
        }

        return style;
    }

    render(){
        // console.log(this.props)
        return(
            <div onClick={this.props.change} style={this.getStyle()} className={"SwitchWindow" + (this.props.left ? " SwitchWindow--left" : "")}>
                <img className="SwitchWindow__icon" src={this.props.icon} width={15} height={15}/>
            </div>
        )
    }
}
