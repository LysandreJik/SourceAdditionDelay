import {combineReducers} from "redux";

import PageReducer from "./PageReducer";

export const AVAILABLE_TYPES = {
    CHANGE_PAGE: "CHANGE_PAGE"
};

export default combineReducers({
    PageReducer
});

