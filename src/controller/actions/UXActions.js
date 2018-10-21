import {AVAILABLE_UX_ACTIONS, AVAILABLE_TYPES} from "../reducers/UXReducer";
import {AVAILABLE_PAGES} from "../reducers/PageReducer";

export function toggleBank(){
    return{
        type: AVAILABLE_TYPES.UX_ACTION,
        action: AVAILABLE_UX_ACTIONS.TOGGLE_BANK
    }
}


export function refreshApp(){
    return{
        type: AVAILABLE_TYPES.UX_ACTION,
        action: AVAILABLE_UX_ACTIONS.REFRESH_APP,
    }
}

export function closeBank(){
    return{
        type: AVAILABLE_TYPES.UX_ACTION,
        action: AVAILABLE_UX_ACTIONS.CLOSE_BANK,
    }
}

export function askForT0(success, failure){
    return{
        type: AVAILABLE_TYPES.UX_ACTION,
        action: AVAILABLE_UX_ACTIONS.ASK_FOR_T0,
        success, failure
    }
}

export function hideT0(){
    return{
        type: AVAILABLE_TYPES.UX_ACTION,
        action: AVAILABLE_UX_ACTIONS.HIDE_T0,
    }
}
