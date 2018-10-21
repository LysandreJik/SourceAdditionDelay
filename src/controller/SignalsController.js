
export default class SignalsController{
    constructor(){
        this._signals = [];
        this._bank = [];
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

    clearSignals(){
        this._signals = [];
    }

    getBankSignals(){
        return this._bank;
    }

    addSignalsToBank(signals){
        this._bank.push(...signals);
    }

    removeSignalFromBank(index){
        this._bank.splice(index,  1)
    }
}
