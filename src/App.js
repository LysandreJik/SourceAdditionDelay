import React, { Component } from "react";
import {connect} from 'react-redux';

import Canvas from "./components/Environment/Canvas";
import Footer from "./components/Environment/Footer";
import PointsController from "./controller/PointsController"
import Options from "./components/Environment/Options";
import Mic from "./icons/ionicons_oldschool_mic.svg";
import Network from "./icons/ionicons_network.svg";
import Pulse from "./icons/ionicons_pulse.svg";
import Close from './icons/ionicons_close.svg';
import Expand from './icons/ionicons_expand.svg';
import Minimize from './icons/ionicons_remove.svg';


import SwitchWindow from "./components/SwitchWindow";
import Signal from "./components/Signal/Signal";
import store from "./controller/store/Store";


import {showMicrophoneCanvas, showEnvironmentCanvas, showSignal} from "./controller/actions/PageActions";

import "./App.css";
import {AVAILABLE_PAGES} from "./controller/reducers/PageReducer";
import Loading from "./components/Loading/Loading";
import SignalCanvas, {signalsController} from "./components/Signal/SignalCanvas";
import Bank from "./components/Bank";
import {toggleBank} from "./controller/actions/UXActions";
import MicrophoneCanvas from "./components/Signal/MicrophoneCanvas";
import MicrophoneSignalsController from "./controller/MicrophoneSignalsController";

const win = window.require('electron').remote.getCurrentWindow();
export const pointsController = new PointsController();
export const microphoneSignalsController = new MicrophoneSignalsController();

class App extends Component {

    constructor(props){
        super(props);
        this.state = {};
        window.addEventListener('resize', () => {this.setState({update: !this.state.update})});
    }

    showMicrophonesAndSources(){
        store.dispatch(showEnvironmentCanvas())
    }

    showSignals(){
        store.dispatch(showSignal())
    }

	render() {
		switch(this.props.page.page){
            case AVAILABLE_PAGES.ENVIRONMENT_CANVAS:
                return microphonesAndSources({showSignals: this.showSignals, microphoneCanvas: this.props.page.microphoneDisplayAvailable});
            case AVAILABLE_PAGES.SIGNAL_CANVAS:
                return signalCanvas({showMicrophonesAndSources: this.showMicrophonesAndSources, signal: this.props.page.signal, microphoneCanvas: this.props.page.microphoneDisplayAvailable, microphoneCanvas: this.props.page.microphoneDisplayAvailable});
            case AVAILABLE_PAGES.SIGNAL:
                return signals({showMicrophonesAndSources: this.showMicrophonesAndSources, microphoneCanvas: this.props.page.microphoneDisplayAvailable});
            case AVAILABLE_PAGES.LOADING:
                return loading({showMicrophonesAndSources: this.showMicrophonesAndSources, callback: this.props.page.callback});
            case AVAILABLE_PAGES.MICROPHONE_CANVAS:
                return microphoneCanvas({showMicrophonesAndSources: this.showMicrophonesAndSources, signal: this.props.page.signal});
            default:
                return microphonesAndSources;
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

const microphonesAndSources = ({showSignals, microphoneCanvas}) => {
    return <div className="App">
        <TitleBar/>
        <Options/>
        <Canvas/>
        <Footer/>
        <SwitchWindow change={showSignals} icon={Pulse}/>
        {microphoneCanvas ? <SwitchWindow change={() => store.dispatch(showMicrophoneCanvas())} icon={Mic} microphone/> : ""}
        <Bank basic removeSignal={signalsController.removeSignalFromBank} signals={signalsController.getBankSignals()}/>
    </div>
};

const signals = ({showMicrophonesAndSources, microphoneCanvas}) => {
    return <div className="App">
        <TitleBar/>
        <Signal/>
        <SwitchWindow change={showMicrophonesAndSources} icon={Network}/>
        {microphoneCanvas ? <SwitchWindow change={() => store.dispatch(showMicrophoneCanvas())} icon={Mic} microphone/> : ""}
        <Bank removeSignal={signalsController.removeSignalFromBank} signals={signalsController.getBankSignals()}/>
    </div>
};

const signalCanvas = ({showMicrophonesAndSources, signal, microphoneCanvas}) => {
    return <div className="App">
        <TitleBar/>
        <SignalCanvas signal={signal}/>
        <SwitchWindow change={showMicrophonesAndSources} icon={Network}/>
        {microphoneCanvas ? <SwitchWindow change={() => store.dispatch(showMicrophoneCanvas())} icon={Mic} microphone/> : ""}
        <Bank add removeSignal={signalsController.removeSignalFromBank} signals={signalsController.getBankSignals()}/>
    </div>
};

const microphoneCanvas = ({showMicrophonesAndSources, signal}) => {
    return <div className="App">
        <TitleBar/>
        <MicrophoneCanvas signal={signal}/>
        <SwitchWindow change={showMicrophonesAndSources} icon={Network}/>
    </div>
};

const loading = ({showMicrophonesAndSources, callback}) => {
    return <div className="App">
        <TitleBar/>
        <Loading callback={callback}/>
        <SwitchWindow change={showMicrophonesAndSources} icon={Network}/>
    </div>
};

function mapStateToProps(state) {
    return {page: state.PageReducer, ux: state.UXReducer};
}

export default connect(mapStateToProps)(App);
