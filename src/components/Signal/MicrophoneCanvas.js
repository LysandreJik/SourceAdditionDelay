import React from 'react'
import {signalsController} from "./SignalCanvas";
import {showSignal} from "../../controller/actions/PageActions";
import store from "../../controller/store/Store";
import * as d3 from "d3";
import {microphoneSignalsController} from "../../App";

export default class MicrophoneCanvas extends React.Component{
    constructor(props){
        super(props);

        this.state = microphoneSignalsController.getSignals();
        //console.log(this.state);
    }

    render(){
        return(
            <div className="SignalCanvas" id="SignalCanvas">
                <Chart signal={this.state.microphones} max={this.state.max}/>
            </div>
        )
    }
}

export class Chart extends React.Component {
    constructor(props) {
        super(props);

        this.drawChart = this.drawChart.bind(this);
        this.zoomed = this.zoomed.bind(this);
    }


    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    drawChart() {
        if (document.getElementById('SignalCanvas__chartSvg')) {
            d3.select(".SignalCanvas__chartSvg").remove()
            d3.select(".tooltip").remove()
            d3.select(".zoom").remove()
        }
        let width = document.getElementById("SignalCanvas__chart" + this.props.index).getBoundingClientRect().width - 120,
            height = document.getElementById("SignalCanvas__chart" + this.props.index).getBoundingClientRect().height - 120;

        this.dims = ['x', 'y', 'z'].filter((item, index) => {
            if (index < this.props.signal[0].length) {
                return item
            } else {
                return null
            }
        });

        this.x = d3.scaleLinear().range([0, width]);
        this.x0 = d3.scaleLinear().range([0, width]);

        let Y = {};
        this.dims.forEach(dim => {
            Y[dim] = d3.scaleLinear().range([height, 0]);
        });

        this.lines = {};
        this.dims.forEach(dim => {
            this.lines[dim] = d3.line()
                .x(d => this.x(d.tick))
                .y(d => Y[dim](d[dim]));
        });

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.svg = d3.select(".SignalCanvas__chart").append("svg")
            .attr("class", "SignalCanvas__chartSvg")
            .attr('id', 'SignalCanvas__chartSvg')
            .append("g")
            .attr("transform",
                "translate(" + 50 + "," + 20 + ")");

        this.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        let data = [];

        for (let i = 0; i < this.props.signal.length; i++) {
            let obj = {tick: i};
            for(let j = 0; j < this.props.signal[i].length; j++){
                obj[this.dims[j]] = this.props.signal[i][j];
            }

            data.push(obj);
        }

        // Set domain scales
        this.x.domain(d3.extent(data, d => d.tick));
        this.x0.domain(this.x.domain());

        for (let dim of this.dims) {
            Y[dim].domain([-1.5*this.props.max, 1.5*this.props.max]);
        }

        this.zoom = d3.zoom()
            .scaleExtent([1, 50])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", this.zoomed);

        this.rect = this.svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .call(this.zoom);

        // Draw Paths
        for (let dim of this.dims) {
            this.svg.append("path")
                .data([data])
                .attr("class", "line line--" + dim)
                .attr("d", d => this.lines[dim](d))
        }

        // Add the X Axis
        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "SignalCanvas__axis")
            .call(d3.axisBottom(this.x));

        // Add the Y Axis (Note how we only need one axis)
        this.svg.append("g")
            .attr("class", "axisSteelBlue")
            .attr("class", "SignalCanvas__axis")
            .call(d3.axisLeft(Y['x']))

        // this.zoom.scaleBy(this.rect, 2);
        // this.zoom.translateBy(this.rect, width);
    }

    zoomed() {
        let t = d3.event.transform;
        this.x.domain(t.rescaleX(this.x0).domain());
        this.dims.forEach(dim => {
            let selector = ".line--" + dim;
            this.svg.select(selector)
                .attr("d", this.lines[dim]);
        });
        this.svg.select(".axis--x").call(d3.axisBottom(this.x));
    }

    render() {
        return <div className="SignalCanvas__chart" style={{height: "calc(100% - 80px)"}}
                    id={"SignalCanvas__chart" + this.props.index}/>
    }
}
