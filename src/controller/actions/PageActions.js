import {AVAILABLE_TYPES, AVAILABLE_PAGES} from "../reducers/PageReducer";

export function showEnvironmentCanvas(){
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.ENVIRONMENT_CANVAS
    }
}

export function showSignalCanvas(){
    return{
        type: AVAILABLE_TYPES.CHANGE_PAGE,
        page: AVAILABLE_PAGES.SIGNAL_CANVAS
    }
}
