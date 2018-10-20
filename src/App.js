import React, { Component } from "react";
import {connect} from 'react-redux';

import Canvas from "./components/Environment/Canvas";
import Footer from "./components/Environment/Footer";
import PointsController from "./controller/PointsController"
import Options from "./components/Environment/Options";
import Mic from "./icons/ionicons_mic.svg";
import Network from "./icons/ionicons_network.svg";

import Close from './icons/ionicons_close.svg';
import Expand from './icons/ionicons_expand.svg';
import Minimize from './icons/ionicons_remove.svg';
import SwitchWindow from "./components/SwitchWindow";
import Signal from "./components/Signal/Signal";
import Store from "./controller/store/Store";

import "./App.css";

const win = window.require('electron').remote.getCurrentWindow();
export const pointsController = new PointsController();

class App extends Component {
    constructor(props){
        super(props);

        this.state = {currentWindow: "Signals"};

        this.showMicrophonesAndSources = this.showMicrophonesAndSources.bind(this);
        this.showSignals = this.showSignals.bind(this);
    }

    showMicrophonesAndSources(){
        this.setState({currentWindow: "MicrophonesAndSources"});
    }

    showSignals(){
        this.setState({currentWindow: "Signals"});
    }

	render() {
        console.log(this.props);
		switch(this.state.currentWindow){
            case "MicrophonesAndSources":
                return MicrophonesAndSources({showSignals: this.showSignals});
            case "Signals":
                return Signals({showMicrophonesAndSources: this.showMicrophonesAndSources});
            default:
                return MicrophonesAndSources;
        }

	}
}


class TitleBar extends React.Component{
    render(){
        return(
            <div className="titlebar">
                <button className="titlebar__button" onClick={() => win.minimize()}><img className="titlebar__buttonImage" src={Minimize} height={15} width={15}/></button>
                <button className="titlebar__button" onClick={() => {win.isMaximized() ? win.unmaximize() : win.maximize()}}><img className="titlebar__buttonImage" src={Expand} height={15} width={15}/></button>
                <button className="titlebar__button" onClick={() => win.close()}><img className="titlebar__buttonImage" src={Close} height={15} width={15}/></button>
            </div>
        )
    }
}

const MicrophonesAndSources = ({showSignals}) => {
    return <div className="App">
        <TitleBar/>
        <Options/>
        <Canvas/>
        <Footer/>
        <SwitchWindow change={showSignals} icon={Mic}/>
    </div>
};

const Signals = ({showMicrophonesAndSources}) => {
    return <div className="App">
        <TitleBar/>
        <Signal/>
        <SwitchWindow change={showMicrophonesAndSources} icon={Network}/>
    </div>
}

function mapStateToProps(state) {
    return state.PageReducer;
}

export default connect(mapStateToProps)(App);
