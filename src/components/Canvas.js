import React from 'react'
import "../theme/Canvas.css";
import {pointsController} from "../App";
import {SnapToGrid} from "./Options";

const SVG = require('svg.js');

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {points: [], mouseLocation: {x: 0, y: 0}, dragging: false, mouseDown: false};

        this.addPoint = this.addPoint.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.hideLines = this.hideLines.bind(this);
        this.refreshCanvas = this.refreshCanvas.bind(this);
    }

    addPoint(event) {
        if(event.target.id.startsWith("SvgjsSvg")){
            if (event.clientX > 30 && event.clientY > 30) {
                pointsController.addPoint(event.clientX - 15, event.clientY - 85, pointsController.getMethod());
                this.setState({points: pointsController.getPoints()});
            }
        }
    }

    componentDidMount() {
        if(!this.draw)
            this.draw = SVG('drawing').size(2500, 2500);

        this.setState({points: pointsController.getPoints()});
    }

    componentDidUpdate() {
        this.draw.clear();
        pointsController.getMicrophones().map(microphone => {
            pointsController.getSource().map(source => {
                this.drawLine(microphone.getX(), microphone.getY(), source.getX(), source.getY());
            })
        });
    }

    hideLines(){
        this.draw.clear();
    }

    refreshCanvas(){
        this.setState({update: !this.state.update})
    }

    drawLine(x1, y1, x2, y2) {
        let line = this.draw.polyline([x2 + 10, y2 + 10]).fill('#b9c4c9').stroke({color: "#32384d", width: 3});
        line.animate({ease: '>', duration: '0.5s'}).plot([[x2 + 10, y2 + 10], [x1 + 10, y1 + 10]]);
        line.mouseover(function () {
            this.stroke({color: '#f06', width: 5})
        });
        line.mouseout(function () {
            this.stroke({color: '#32384d', width: 2})
        });
        let text = this.draw.text(String(Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))) + "cm").fill('#b9c4c9').stroke({color: "#b9c4c9"}).move((x1 + x2) / 2, (y1 + y2) / 2);
    }

    render() {
        return (
            <div id="Canvas" className="Canvas blueprint" onClick={this.addPoint} onMouseUp={this.mouseUp}
                 onMouseDown={this.mouseDown} onMouseMove={this.mouseMove}>
                {this.state.points.map((point, index) => {
                    return (
                        <Point index={index} key={index} object={point} hideLines={this.hideLines} refreshCanvas={this.refreshCanvas}/>
                    );
                })}
                <div id={"drawing"}/>
                <MouseIndicator/>
            </div>
        )
    }
}

class MouseIndicator extends React.Component {

    state = {mouseLocation: {x: 0, y: 0}};

    constructor(props) {
        super(props);

        this.onMouseMove = this.onMouseMove.bind(this);
    }

    componentDidMount() {
        document.getElementById("Canvas").addEventListener("mousemove", this.onMouseMove);
    }

    componentWillUnmount(){
        document.getElementById("Canvas").removeEventListener("mousemove", this.onMouseMove);
    }

    onMouseMove(e) {
        this.setState({mouseLocation: {x: e.pageX - 5, y: e.pageY - 75}});
    }


    render() {
        return (
            <div
                className="Canvas__mousePosition">{this.state.mouseLocation.x + ", " + this.state.mouseLocation.y}</div>
        )
    }
}

class Point extends React.Component {
    constructor(props) {
        super(props);

        this.state = {closed: true};

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        this.dragging = false;
    }

    componentDidMount(){
        document.getElementById("Canvas").addEventListener("mousemove", this.onMouseMove);
        document.getElementById("Canvas").addEventListener("mouseup", this.onMouseUp);
        document.getElementById("Canvas").addEventListener("mousedown", this.onMouseDown);
    }

    onMouseDown(e) {
        if(e.clientX-15 - 30 < this.props.object.getX() && e.clientX-15 + 30 > this.props.object.getX() && e.clientY-65 - 30 < this.props.object.getY() && e.clientY-65 + 30 > this.props.object.getY()){
            this.dragging = true;
        }
    }

    onMouseUp() {
        this.dragging = false;
        this.props.refreshCanvas();
    }

    onMouseMove(e) {
        if (this.dragging) {
            this.props.hideLines();
            if(SnapToGrid > 0){
                this.props.object.setX(Math.round((e.clientX - 15)/SnapToGrid)*SnapToGrid);
                this.props.object.setY(Math.round((e.clientY - 85)/SnapToGrid)*SnapToGrid);
            }else{
                this.props.object.setX(Math.round((e.clientX - 15)));
                this.props.object.setY(Math.round((e.clientY - 85)));
            }

            this.setState({update: !this.state.update});
        }
    }

    getStyle() {
        return (
            <div
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onMouseOver={() => this.setState({closed: false})}
                onMouseLeave={() => this.setState({closed: true})}
                style={{left: this.props.object.getX() + "px", top: this.props.object.getY() + "px"}}
                className={"Point" + (!this.state.closed ? " Point--large" : "") + (this.props.object.getType() === "source" ? " Point--source" : " Point--microphone")}
                id={"Point_"+this.props.index}
            >
                {this.state.closed ?
                    this.props.object.getType() === "source" ? "S" : "M"
                    :
                    <span className="Point--text">{this.props.object.getX() + ", " + this.props.object.getY()}</span>
                }
            </div>
        )
    }


    render() {
        return this.getStyle();
    }
}
