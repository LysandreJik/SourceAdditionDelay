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

    componentDidMount(){
        this.draw = SVG('drawing').size(2500, 2500);
    }

    componentDidUpdate(){
        this.draw.clear();
        pointsController.getMicrophones().map(microphone => {
            pointsController.getSource().map(source => {
                this.drawLine(microphone.getX(), microphone.getY(), source.getX(), source.getY());
            })
        });
    }

    drawLine(x1, y1, x2, y2){
        console.log("Drawing line", x1, x2, y1, y2)
        let line = this.draw.polyline([x2+10, y2+10]).fill('#b9c4c9').stroke({color: "#32384d", width: 3});
        line.animate({ ease: '>', duration: '0.5s' }).plot([[x2 + 10, y2 + 10], [x1 + 10, y1 + 10]]);
        line.mouseover(function() {
            this.stroke({color: '#f06', width: 5})
        });
        line.mouseout(function() {
            this.stroke({color: '#32384d', width: 2})
        });
        let text = this.draw.text(String(Math.round(Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))))).fill('#b9c4c9').stroke({color: "#b9c4c9"}).move((x1+x2)/2, (y1+y2)/2);
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
