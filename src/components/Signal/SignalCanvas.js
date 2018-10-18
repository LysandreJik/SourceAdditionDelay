import React from 'react'
import '../../theme/SignalCanvas.css'
import Chartist from 'chartist'
import './../../theme/chartist.min.css';
import './../../theme/Graph.css';
const remote = window.require('electron').remote;

export default class SignalCanvas extends React.Component{

    constructor(props){
        super(props);

        this.state = {data: []};

        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }

    componentDidMount(){
        new Chartist.Line('.ct-chart', {
            series: [
                this.state.data
            ]
        }, {
            fullWidth: true,
            chartPadding: {
                right: 40
            }
        });
    }

    componentDidUpdate(){
        console.log(this.state);
        new Chartist.Line('.ct-chart', {
            series: [
                this.state.data
            ]
        }, {
            fullWidth: true,
            chartPadding: {
                right: 40
            }
        });
    }


    fetchData(){
        remote.getGlobal('shared').backend.getData('get_elle').then(data => this.setState({data: JSON.parse(data)}));
    }

    render(){



        return(
            <div className="SignalCanvas">
                <div className="ct-chart"/>
            </div>
        )
    }
}
