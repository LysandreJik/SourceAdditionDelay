
export default class SignalsController{
    constructor(){
        this._signals = [{data: []}];
        this._bank = [];

        this.addSignal = this.addSignal.bind(this);
        this.getSignal = this.getSignal.bind(this);
        this.getSignals = this.getSignals.bind(this);
        this.removeSignal = this.removeSignal.bind(this);
        this.clearSignals = this.clearSignals.bind(this);
        this.getBankSignals = this.getBankSignals.bind(this);
        this.addSignalsToBank = this.addSignalsToBank.bind(this);
        this.removeSignalFromBank = this.removeSignalFromBank.bind(this);
    }

    addSignal(signal){
        if(this._signals[0].data.length === 0){
            this._signals = [signal];
        }else{
            this._signals.push(signal);
        }

    }

    removeSignal(index){
        this._signals.splice(index, 1);
        if(this._signals.length === 0){
            this._signals = [{data: []}];
        }
    }

    getSignals(){
        return this._signals;
    }

    getSignal(index){
        return this._signals[index];
    }

    clearSignals(){
        this._signals = [{data: []}];
    }

    getBankSignals(){
        return this._bank;
    }

    addSignalsToBank(){
        this._bank.push(...this.getSignals());
        this.clearSignals();
    }

    removeSignalFromBank(index){
        this._bank.splice(index,  1)
    }
}
