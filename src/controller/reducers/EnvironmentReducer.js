
export const AVAILABLE_ACTIONS = {
    SELECT_SIGNAL: "SELECT_SIGNAL"
};

export const AVAILABLE_TYPES = {
    CHANGE_PAGE: "CHANGE_PAGE",
    UX_ACTION: "UX_ACTION",
    ENVIRONMENT_ACTION: "ENVIRONMENT_ACTION",
};

export default function EnvironmentReducer(state = {
    type: AVAILABLE_TYPES.CHANGE_PAGE,
    action: AVAILABLE_ACTIONS.SELECT_SIGNAL
}, action) {
    if (action.type === AVAILABLE_TYPES.ENVIRONMENT_ACTION) {
        console.log(action);
        switch (action.action) {
            case AVAILABLE_ACTIONS.SELECT_SIGNAL:
                console.log("Selected signal : ", action.signal);
                return action;
            default:
                return state;
        }
    }

    return state;
};
