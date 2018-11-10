import React from 'react'
import '../../theme/SignalCanvas.css'
import * as d3 from 'd3'
import SignalsController from "../../controller/SignalsController";
import Return from "../../icons/ionicons_back.svg";


import Loading from "../Loading/Loading";
import store from '../../controller/store/Store';
import {showSignal} from "../../controller/actions/PageActions";
import SwitchWindow from "../SwitchWindow";
import '../../theme/SignalBank.css'

const remote = window.require('electron').remote;

export let signalsController = new SignalsController();

export default class SignalCanvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: signalsController.getSignals(), signalChoice: false};
        this.fetchData = this.fetchData.bind(this);
        this.addSignalsToBank = this.addSignalsToBank.bind(this);
        this.removeSignalFromBank = this.removeSignalFromBank.bind(this);

        if (this.props.signal)
            this.fetchData(this.props.signal);
    }

    fetchData(signal) {
        remote.getGlobal('shared').backend.getData(['signal', signal]).then(data => {
            data = JSON.parse(data);
            signalsController.addSignal({
                signal,
                name: signal.split('/')[signal.split('/').length - 1],
                data: data.signal,
                metadata: data.metadata
            });
            this.setState({data: signalsController.getSignals()})
        })
            .then(() => console.log('Fetched signal ! SignalsController signals : ', signalsController.getSignals()));
    }

    addSignalsToBank() {
        signalsController.addSignalsToBank(signalsController.getSignals());
        signalsController.getSignals().forEach(signal => console.log(signal.name));
        signalsController.clearSignals();

        this.setState({data: signalsController.getSignals()});
    }

    removeSignalFromBank(index) {
        signalsController.removeSignalFromBank(index);

        this.setState({update: !this.state.update});
    }

    render() {
        //console.log((this.state.data && this.state.data[0].data.length > 0) || signalsController.getBankSignals().length)
        if ((this.state.data && this.state.data[0].data.length > 0) || signalsController.getBankSignals().length) {
            return (
                <div className="SignalCanvas" id="SignalCanvas">
                    <img onClick={() => {
                        store.dispatch(showSignal())
                    }} className="SignalCanvas__img" src={Return} width={30} height={30}/>
                    <Chart data={signalsController.getSignals()}/>

                </div>
            )
        } else {
            return <Loading/>
        }
    }
}

class Chart extends React.Component {
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
            if (index < this.props.data.length) {
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
        let max = Math.max(...this.props.data.map(curve => {
            return curve.data.length
        }));
        for (let i = 0; i < max; i++) {
            let obj = {tick: i};
            for (let j = 0; j < this.props.data.length; j++) {
                obj[this.dims[j]] = this.props.data[j].data[i];
                if (!this.props.data[j].data[i]) {
                    obj[this.dims[j]] = 0;
                }
            }
            data.push(obj);
        }

        //console.log(data);

        // Set domain scales
        this.x.domain(d3.extent(data, d => d.tick));
        this.x0.domain(this.x.domain());

        for (let dim of this.dims) {
            Y[dim].domain([-1.2, 1.2]);
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
