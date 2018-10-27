import React from 'react'
import "../theme/Switchwindow.css";


export default class SwitchWindow extends React.Component{

    getStyle(){

        console.log(this.props);

        let style = {};
        if(this.props.left){
            style.left = this.props.left
        }

        if(this.props.microphone){
            style.top = "calc(50% + 50px)";
        }

        let val = (2*this.props.position + 1 - this.props.total)*50 - 50;
        console.log(val);

        style.top = "calc(50% + " + val + "px)";
        console.log(style.top);

        return style;
    }

    getClass(){
        let classStyle = "SwitchWindow";

        if(this.props.left){
            classStyle += " SwitchWindow--left";
        }

        if(this.props.right){
            classStyle += " SwitchWindow--Right";
        }

        return classStyle;

    }

    render(){
        return(
            <div onClick={this.props.change} style={this.getStyle()} className={this.getClass()}>
                <img className="SwitchWindow__icon" src={this.props.icon} width={15} height={15}/>
            </div>
        )
    }
}
