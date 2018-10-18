import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./components/Canvas";
import Footer from "./components/Footer";
import PointsController from "./controller/PointsController"
import Options from "./components/Options";
import Mic from "./icons/ionicons_mic.svg";
import Network from "./icons/ionicons_network.svg";

import Close from './icons/ionicons_close.svg';
import Expand from './icons/ionicons_expand.svg';
import Minimize from './icons/ionicons_remove.svg';
import SwitchWindow from "./components/SwitchWindow";
import SignalCanvas from "./components/Signal/SignalCanvas";

const win = window.require('electron').remote.getCurrentWindow();


export const pointsController = new PointsController();

class App extends Component {
    constructor(props){
        super(props);

        this.state = {currentWindow: "MicrophonesAndSources"};

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
        <SignalCanvas/>
        <SwitchWindow change={showMicrophonesAndSources} icon={Network}/>
    </div>
}

export default App;
