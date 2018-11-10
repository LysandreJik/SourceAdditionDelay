import {AVAILABLE_TYPES, AVAILABLE_PAGES} from "../reducers/PageReducer";
import store from '../store/Store'
import {closeBank} from "./UXActions";
import {microphoneSignalsController} from "../../App";

export function showEnvironmentCanvas(){
    store.dispatch(closeBank());
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.ENVIRONMENT_CANVAS
    }
}

export function showSignalCanvas(signal){
    store.dispatch(closeBank());
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.SIGNAL_CANVAS,
        signal
    }
}

export function showMicrophoneCanvas(signal){
    if(signal){
        microphoneSignalsController.setSignals(signal)
    }
    store.dispatch(closeBank());
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.MICROPHONE_CANVAS,
        microphoneDisplayAvailable: true
    }
}


export function showSignal(path){
    if(path){
        console.log('path', path)
        path = path[0].replace(/\\/g, '/');
        console.log('path', path.replace(/\\/g, '/'))
    }

    store.dispatch(closeBank());
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.SIGNAL,
        path
    }
}

export function showNeural(){
    store.dispatch(closeBank());
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.NEURAL,
    }
}


export function showLoading(callback){
    store.dispatch(closeBank());
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.LOADING,
        callback
    }
}


