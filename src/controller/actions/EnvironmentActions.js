import {AVAILABLE_TYPES, AVAILABLE_ACTIONS} from "../reducers/EnvironmentReducer";
import {pointsController} from "../../App";

export function selectSignal(signal){
    console.log(signal);
    console.log(signal.path);
    if(signal.path.startsWith('.')){
        signal.path = signal.path.substring(9)
    }
    console.log(signal);
    pointsController.setSources(signal);
    return{
        type: AVAILABLE_TYPES.ENVIRONMENT_ACTION,
        action: AVAILABLE_ACTIONS.SELECT_SIGNAL,
        signal
    }
}
