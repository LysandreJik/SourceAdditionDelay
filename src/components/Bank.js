import React from "react";
import Add from "../icons/ionicons_add.svg";
import {connect} from 'react-redux';
import {toggleBank, refreshApp} from "../controller/actions/UXActions";
import {selectSignal} from "../controller/actions/EnvironmentActions";
import store from "../controller/store/Store";
import Folder from "../icons/ionicons_folder.svg";
import SwitchWindow from "./SwitchWindow";
import {signalsController} from "./Signal/SignalCanvas";
import {AVAILABLE_UX_ACTIONS} from "../controller/reducers/UXReducer";

class Bank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.removeSignal = this.removeSignal.bind(this);
    }

    componentDidUpdate(){
        if(this.state.openBank !== this.props.ux.openBank){
            this.setState({openBank: this.props.ux.openBank})
        }

        if(this.props.environment && this.props.environment.signal && this.state.selectedSignal !== this.props.environment.signal){
            this.setState({selectedSignal: this.props.environment.signal});
        }
    }

    removeSignal(key){
        this.props.removeSignal(key);
        store.dispatch(refreshApp())
    }

    render() {
        console.log(this.props.ux);
        if (!this.state.openBank) {
            return <div className="SignalBank">
                <SwitchWindow left change={() => store.dispatch(toggleBank())} icon={Folder}/>
                {this.props.ux.action === AVAILABLE_UX_ACTIONS.ASK_FOR_T0 ? <AskForT0 success={this.props.ux.success} failure={this.props.ux.failure}/> : ""}
            </div>

        } else {
            return (
                <div className="SignalBank" style={{width: "400px"}}>
                    <SwitchWindow left={"360px"} change={() => store.dispatch(toggleBank())} icon={Folder}/>
                    {this.props.basic ? <BasicSignals selectedSignal={this.state.selectedSignal}/> : ""}
                    {this.props.signals.map((signal, key) => {
                        if(signal.metadata){
                            return (
                                <button key={key} className={"SignalBank__button" + (this.props.basic && this.state.selectedSignal && this.state.selectedSignal.name === signal.name ? " SignalBank__button--selected" : "")}
                                        onClick={this.props.basic ? () => store.dispatch(selectSignal({path: signal.signal, name: signal.name, metadata: signal.metadata})) : () => this.removeSignal(key)}>
                                    {signal.name}
                                    <br/>
                                    {"t = " + Math.floor(signal.metadata.n / signal.metadata.fs) + "s, f = " + signal.metadata.fs + "Hz"}
                                </button>
                            );
                        }
                    })}
                    {this.props.add ?
                    <button className="SignalBank__button SignalBank__button--return" onClick={() => {signalsController.addSignalsToBank(); store.dispatch(refreshApp())}}>
                        <img src={Add} height={15} width={15}/>
                    </button> : ""}
                    {this.props.ux.action === AVAILABLE_UX_ACTIONS.ASK_FOR_T0 ? <AskForT0 success={this.props.ux.success} failure={this.props.ux.failure}/> : ""}
                </div>
            )
        }
    }
}

const BasicSignals = ({selectedSignal}) => {
    return(
        <div>
            <BasicSignalButton name={"Sine wave"} selectedSignal={selectedSignal}/>
            <BasicSignalButton name={"Square wave"} selectedSignal={selectedSignal}/>
            <BasicSignalButton name={"Sawtooth wave"} selectedSignal={selectedSignal}/>
            <div className="SignalBank__separator"/>
        </div>
    )
};

const BasicSignalButton = ({name, selectedSignal}) => {
    return (
        <div>
            <button
                className={"SignalBank__button SignalBank__button--basic" + (selectedSignal && selectedSignal.name === name ? " SignalBank__button--selected" : "")}
                onClick={() => store.dispatch(selectSignal({path: "basic", name: name, metadata: {fs: 41000, n: 410000}}))}
            >
                {name}
                <br/>
                t = 10s f = 41000Hz
            </button>
        </div>
    )
};

const AskForT0 = ({success, failure}) => {
    return(
        <div className="ASK_FOR_T0">
            <div className="ASK_FOR_T0__inner">
                <div className="ASK_FOR_T0__span">T0 :</div>
                <input id="T0" type="number" className="ASK_FOR_T0__input"/>
                <br/>
                <button className="ASK_FOR_T0__button" onClick={() => success(document.getElementById("T0").value)}>Ok</button>
                <button className="ASK_FOR_T0__button" onClick={failure}>Cancel</button>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {ux: state.UXReducer, environment: state.EnvironmentReducer};
}

export default connect(mapStateToProps)(Bank)
