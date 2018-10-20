import React from 'react'
import '../../theme/SignalCanvas.css'
import * as d3 from 'd3'
import './../../theme/chartist.min.css';
import SignalsController from "../../controller/SignalsController";
import Return from "../../icons/ionicons_return.svg";
const remote = window.require('electron').remote;

export let signalsController = new SignalsController();

export default class SignalCanvas extends React.Component{

    constructor(props){
        super(props);

        this.state = {data: signalsController.getSignals(), signalChoice: false};

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData(){
        remote.getGlobal('shared').backend.getData('get_elle').then(data => {data = JSON.parse(data); signalsController.addSignal(data); this.setState({data: signalsController.getSignals()})});
    }

    render(){
        if(this.state.data.length > 0){
            return(
                <div className="SignalCanvas" id="SignalCanvas">
                    <img onClick={() => {this.setState({signalChoice: true, data: []}); signalsController.removeSignal(0)}} className="SignalCanvas__img" src={Return} width={30} height={30}/>
                    {this.state.data.map((curve, index) => {
                        return <Chart key={index} index={index} chartsQuantity={this.state.data.length} data={curve}/>
                    })}
                </div>
            )
        }else{
            return(
                <div className="SignalCanvas" id="SignalCanvas">
                    <div className="SignalCanvas__div">
                        No signals currently open
                        <br/>
                        <button className="SignalCanvas__button" onClick={() => this.setState({signalChoice: true})}>Open signal</button>
                        {this.state.signalChoice ?
                            <div className="SignalCanvas__divSignalChoice">
                                <button className="SignalCanvas__button SignalCanvas__button--big" onClick={() => this.fetchData('get_elle')}>Get elle</button>
                                <button className="SignalCanvas__button SignalCanvas__button--big" onClick={() => this.fetchData('get_bien')}>Get bien</button>
                                <button className="SignalCanvas__button SignalCanvas__button--big" onClick={() => this.fetchData('custom')}>Custom</button>
                            </div>
                            :
                            ""
                        }
                    </div>
                </div>
            );
        }
    }
}

class Chart extends React.Component{
    componentDidMount(){
        let width = document.getElementById("SignalCanvas__chart"+this.props.index).getBoundingClientRect().width - 120,
            height = document.getElementById("SignalCanvas__chart"+this.props.index).getBoundingClientRect().height - 120;

        console.log(width, height);

        let dims = ['x'];

        let x = d3.scaleLinear().range([0, width]);

        let Y = {};
        dims.forEach(dim => {
            Y[dim] = d3.scaleLinear().range([height, 0]);
        });

        let lines = {}
        dims.forEach(dim => {
            lines[dim] = d3.line()
                .x(d => x(d.tick))
                .y(d => Y[dim](d[dim]));
        });

        let svg = d3.select(".SignalCanvas__chart").append("svg")
            .attr("class", "SignalCanvas__chartSvg")
            .append("g")
            .attr("transform",
                "translate(" + 40 + "," + 20 + ")");


        let data = this.props.data.map((dataPoint, index) => {
            return {
                tick: index,
                x: dataPoint
            }
        });
        // Set domain scales
        x.domain(d3.extent(data, d => d.tick));
        for(let dim of dims) {
            Y[dim].domain(d3.extent(data, d => d[dim]));
        }

        // Draw Paths
        for (let dim of dims) {
            svg.append("path")
                .data([data])
                .attr("class", "line line--"+dim)
                .attr("d", d => lines[dim](d));
        }

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "SignalCanvas__axis")
            .call(d3.axisBottom(x));

        // Add the Y Axis (Note how we only need one axis)
        svg.append("g")
            .attr("class", "axisSteelBlue")
            .attr("class", "SignalCanvas__axis")
            .call(d3.axisLeft(Y['x']));
    }

    render(){
        return <div className="SignalCanvas__chart" style={{height: "calc("+100/this.props.chartsQuantity + "% - 80px)"}} id={"SignalCanvas__chart"+this.props.index}/>
    }
}