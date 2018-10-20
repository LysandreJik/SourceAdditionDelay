
export default class SignalsController{
    constructor(){
        this._signals = [];
    }

    addSignal(signal){
        this._signals.push(signal);
    }

    removeSignal(index){
        this._signals.splice(index, 1);
    }

    getSignals(){
        return this._signals;
    }

    getSignal(index){
        return this._signals[index];
    }
}