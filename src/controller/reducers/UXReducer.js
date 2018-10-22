import {AVAILABLE_PAGES} from "./PageReducer";

export const AVAILABLE_UX_ACTIONS = {
    NONE: "NONE",
    TOGGLE_BANK: "TOGGLE_BANK",
    REFRESH_APP: "REFRESH_APP",
    CLOSE_BANK: "CLOSE_BANK",
    ASK_FOR_T0: "ASK_FOR_T0",
    HIDE_T0: "HIDE_T0"
};

export const AVAILABLE_TYPES = {
    CHANGE_PAGE: "CHANGE_PAGE",
    UX_ACTION: "UX_ACTION"
};

export default function UXReducer(state = {
    type: AVAILABLE_TYPES.CHANGE_PAGE,
    action: AVAILABLE_UX_ACTIONS.NONE
}, action) {
    if (action.type === AVAILABLE_TYPES.UX_ACTION) {
        switch (action.action) {
            case AVAILABLE_UX_ACTIONS.TOGGLE_BANK:
                return {...action, openBank: !state.openBank, refreshApp: state.refreshApp};
            case AVAILABLE_UX_ACTIONS.CLOSE_BANK:
                return {...action, openBank: false, refreshApp: state.refreshApp};
            case AVAILABLE_UX_ACTIONS.REFRESH_APP:
                return {...action, refreshApp: !state.refreshApp, openBank: state.openBank};
            case AVAILABLE_UX_ACTIONS.ASK_FOR_T0:
                return action;
            case AVAILABLE_UX_ACTIONS.HIDE_T0:
                return action;
            default:
                return state;
        }
    }

    return state;
};
