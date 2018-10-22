
export default class MicrophoneSignalsController{
    constructor(){
        this._signals = [];
    }

    getSignals(){
        return this._signals;
    }

    setSignals(signals){
        this._signals = signals;
    }
}
