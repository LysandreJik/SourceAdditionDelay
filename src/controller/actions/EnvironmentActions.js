import {AVAILABLE_TYPES, AVAILABLE_ACTIONS} from "../reducers/EnvironmentReducer";
import {pointsController} from "../../App";

export function selectSignal(signal){
    pointsController.setSources(signal);
    return{
        type: AVAILABLE_TYPES.ENVIRONMENT_ACTION,
        action: AVAILABLE_ACTIONS.SELECT_SIGNAL,
        signal
    }
}
