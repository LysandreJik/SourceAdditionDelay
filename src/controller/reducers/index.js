import {combineReducers} from "redux";

import PageReducer from "./PageReducer";
import UXReducer from "./UXReducer";
import EnvironmentReducer from "./EnvironmentReducer";

export const AVAILABLE_TYPES = {
    CHANGE_PAGE: "CHANGE_PAGE"
};

export default combineReducers({
    PageReducer, EnvironmentReducer, UXReducer
});

