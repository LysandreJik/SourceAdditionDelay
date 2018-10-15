import React from 'react'
import "../theme/Canvas.css";
import {pointsController} from "../App";
const SVG = require('svg.js');

export default class Canvas extends React.Component{
    constructor(props){
        super(props);

        this.state = {points: []};

        this.addPoint = this.addPoint.bind(this);
        this.drawLine = this.drawLine.bind(this);
    }

    addPoint(event){
        console.log(event.button);
        if(event.clientX > 30 && event.clientY > 30){
            pointsController.addPoint(event.clientX - 15, event.clientY - 15, pointsController.getMethod());
            this.setState({points: pointsController.getPoints()});
        }
    }

    componentDidUpdate(){
        this.draw = SVG('drawing').size(1500, 1500);

        pointsController.getMicrophones().map(microphone => {
            pointsController.getSource().map(source => {
                this.drawLine(microphone.getX(), microphone.getY(), source.getX(), source.getY());
            })
        });



    }

    drawLine(x1, y1, x2, y2){
        console.log("Drawing line", x1, x2, y1, y2)
        let line = this.draw.line(x1, y1, x2, y2).fill('#f06').move(0, 0);
        var rect = this.draw.rect(x1, y1)
    }

    render(){



        return(
            <div className="Canvas" onClick={this.addPoint}>
                {this.state.points.map((point, index) => {
                    return(
                        <div key={index} style={{left: point.getX()+"px", top: point.getY()+"px"}} className={"Point" + (point.getType() === "source" ? " Point--source" : " Point--microphone")}>
                            {point.getType() === "source" ? "S" : "M"}
                        </div>
                    );
                })}
                <div id={"drawing"}/>
            </div>
        )
    }
}
