import React from 'react'
import "../theme/Canvas.css";
import {pointsController} from "../App";

export default class Canvas extends React.Component{
    constructor(props){
        super(props);

        this.state = {points: []};

        this.addPoint = this.addPoint.bind(this);
    }

    addPoint(event){
        console.log(event.button);
        if(event.clientX > 30 && event.clientY > 30){
            pointsController.addPoint(event.clientX - 30, event.clientY - 30);
            this.setState({points: pointsController.getPoints()});
        }
    }

    render(){
        console.log(this.state);
        return(
            <div className="Canvas" onClick={this.addPoint}>
                {this.state.points.map((point, index) => {
                    return <div key={index} style={{left: point.getX()+"px", top: point.getY()+"px"}} className="Point"/>
                })}
            </div>
        )
    }
}