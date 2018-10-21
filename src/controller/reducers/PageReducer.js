
export const AVAILABLE_PAGES = {
    ENVIRONMENT_CANVAS: "ENVIRONMENT_CANVAS",
    SIGNAL_CANVAS: "SIGNAL_CANVAS",
    SIGNAL: "SIGNAL",
    LOADING: "LOADING",
};

export const AVAILABLE_TYPES = {
    CHANGE_PAGE: "CHANGE_PAGE",
    UX_ACTION: "UX_ACTION"
};

export default function PageReducer(state = {
    type: AVAILABLE_TYPES.CHANGE_PAGE,
    page: AVAILABLE_PAGES.ENVIRONMENT_CANVAS
}, action) {
    if (action.type === AVAILABLE_TYPES.CHANGE_PAGE) {
        console.log(action);
        switch (action.page) {
            case AVAILABLE_PAGES.ENVIRONMENT_CANVAS:
                return action;
            case AVAILABLE_PAGES.SIGNAL:
                return action;
            case AVAILABLE_PAGES.SIGNAL_CANVAS:
                return action;
            case AVAILABLE_PAGES.LOADING:
                return action;
            default:
                return state;
        }
    }

    return state;
};
