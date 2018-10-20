
export const AVAILABLE_PAGES = {
    INIT: "INIT",
    ENVIRONMENT_CANVAS: "ENVIRONMENT_CANVAS",
    SIGNAL_CANVAS: "SIGNAL_CANVAS"
};

export const AVAILABLE_TYPES = {
    CHANGE_PAGE: "CHANGE_PAGE"
};

export default function PageReducer(state = {
    type: AVAILABLE_TYPES.CHANGE_PAGE,
    page: AVAILABLE_PAGES.LOADING
}, action) {
    if (action.type === AVAILABLE_TYPES.CHANGE_PAGE) {
        switch (action.page) {
            case AVAILABLE_PAGES.INIT:
                return state;
            default:
                return state;
        }
    }

    return state;
};
