import React from 'react'
import "../../theme/Canvas.css";
import {pointsController} from "../../App";
import {SnapToGrid} from "./Options";
import store from '../../controller/store/Store';
import {askForT0, hideT0} from "../../controller/actions/UXActions";
import '../../theme/RecycleBin.css';

const SVG = require('svg.js');

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {points: [], mouseLocation: {x: 0, y: 0}, dragging: false, mouseDown: false};

        this.addPoint = this.addPoint.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.hideLines = this.hideLines.bind(this);
        this.removePoint = this.removePoint.bind(this);
        this.refreshCanvas = this.refreshCanvas.bind(this);
    }

    addPoint(event) {
        if (event.target.id.startsWith("SvgjsSvg")) {
            let x = event.clientX;
            let y = event.clientY;
            if (x > 30 && y > 30) {
                if(pointsController.getMethod() !== "microphone"){
                    store.dispatch(
                        askForT0(
                            (T0) => {
                                store.dispatch(hideT0());
                                pointsController.addPoint(x - 15, y - 85, pointsController.getMethod(), T0);
                                this.setState({points: pointsController.getPoints()});
                            },
                            () => {
                                store.dispatch(hideT0())
                            }
                        )
                    );
                }else{
                    pointsController.addPoint(x - 15, y - 85, pointsController.getMethod());
                    this.setState({points: pointsController.getPoints()});
                }
            }
        }
    }



    componentDidMount() {
        if (!this.draw)
            this.draw = SVG('drawing').size(2500, 2500);

        this.setState({points: pointsController.getPoints()});
    }

    componentDidUpdate() {
        if(this.state.points !== pointsController.getPoints()){
            this.setState({points: pointsController.getPoints()});
        }
        this.draw.clear();
        pointsController.getMicrophones().map(microphone => {
            pointsController.getSources().map(source => {
                this.drawLine(microphone.getX(), microphone.getY(), source.getX(), source.getY());
            })
        });
    }

    hideLines() {
        this.draw.clear();
    }

    refreshCanvas() {
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

    removePoint(index){
        console.log('deleting', index);
        pointsController.removePoint(index);
        this.setState({points: pointsController.getPoints()})
    }

    render() {
        return (
            <div id="Canvas" className="Canvas blueprint" onClick={this.addPoint}>
                {this.state.points.map((point, index) => {
                    return (
                        <Point index={index} key={index} object={point} hideLines={this.hideLines}
                               refreshCanvas={this.refreshCanvas} removePoint={this.removePoint}/>
                    );
                })}
                <div id={"drawing"}/>
                <MouseIndicator/>
                <RecycleBin/>
            </div>
        )
    }
}

let hoverRecycleBin = false;

class RecycleBin extends React.Component{

    componentDidMount(){
        document.getElementById("RecycleBin").addEventListener("mouseover", () => {hoverRecycleBin = true});
        document.getElementById("RecycleBin").addEventListener("mouseleave", () => {hoverRecycleBin = false});
    }

    render(){
        return(
            <div className="RecycleBin" id="RecycleBin">
                <span className="sampah">
                    <span/>
                    <i/>
                </span>
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

    componentWillUnmount() {
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

    componentDidMount() {
        document.getElementById("Canvas").addEventListener("mousemove", this.onMouseMove);
        document.getElementById("Canvas").addEventListener("mouseup", this.onMouseUp);
        document.getElementById("Canvas").addEventListener("mousedown", this.onMouseDown);
    }

    onMouseDown(e) {
        if (e.clientX - 15 - 30 < this.props.object.getX() && e.clientX - 15 + 30 > this.props.object.getX() && e.clientY - 65 - 30 < this.props.object.getY() && e.clientY - 65 + 30 > this.props.object.getY()) {
            this.dragging = true;
        }
    }

    onMouseUp() {
        if(hoverRecycleBin && this.dragging){
            this.props.removePoint(this.props.index);
        }
        this.dragging = false;
        this.props.refreshCanvas();
    }

    onMouseMove(e) {
        if (this.dragging) {
            this.props.hideLines();
            if (SnapToGrid > 0) {
                this.props.object.setX(Math.round((e.clientX - 15) / SnapToGrid) * SnapToGrid);
                this.props.object.setY(Math.round((e.clientY - 85) / SnapToGrid) * SnapToGrid);
            } else {
                this.props.object.setX(Math.round((e.clientX - 15)));
                this.props.object.setY(Math.round((e.clientY - 85)));
            }

            this.setState({update: !this.state.update});
        }
    }

    getClass() {
        if (this.props.object.getType() === "microphone") {
            return "Point Point--microphone" + (this.state.closed ? "" : " Point--large")
        } else if (this.props.object.getType().path === "basic") {
            return "Point Point--source" + (this.state.closed ? "" : " Point--large")
        } else {
            return "Point Point--voice" + (this.state.closed ? "" : " Point--large")
        }
    }

    getSmallText() {
        if (this.props.object.getType() === "microphone") {
            return "M"
        } else if (this.props.object.getType().path === "basic") {
            return "S"
        } else {
            return "S+"
        }
    }

    getLargeText() {
        if (this.props.object.getType() === "microphone") {
            return (
                <div>
                    <div>Microphone</div>
                    <div className="Point--text">{this.props.object.getX() + ", " + this.props.object.getY()}</div>
                </div>
            );
        } else if (this.props.object.getType().path === "basic") {
            return (
                <div>
                    <div>{this.props.object.getType().name}</div>
                    <div className="Point--text">{this.props.object.getX() + ", " + this.props.object.getY()}. T0 = {this.props.object.getT0()}s</div>
                    <div className="Point--text">{"t = " + Math.floor(this.props.object.getType().metadata.n / this.props.object.getType().metadata.fs) + "s, f = " + this.props.object.getType().metadata.fs + "Hz"}</div>
                </div>
            );
        } else {
            return (
                <div>
                    <div>{this.props.object.getType().name}</div>
                    <div className="Point--text">{this.props.object.getX() + ", " + this.props.object.getY()}. T0 = {this.props.object.getT0()}s</div>
                    <div className="Point--text">{"t = " + Math.floor(this.props.object.getType().metadata.n / this.props.object.getType().metadata.fs) + "s, f = " + this.props.object.getType().metadata.fs + "Hz"}</div>
                </div>
            );
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
                className={this.getClass()}
                id={"Point_" + this.props.index}
            >
                {this.state.closed ?
                    this.getSmallText()
                    :
                    this.getLargeText()
                }
            </div>
        )
    }


    render() {
        return this.getStyle();
    }
}
