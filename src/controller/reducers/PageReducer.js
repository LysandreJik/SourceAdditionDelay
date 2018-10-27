
export const AVAILABLE_PAGES = {
    ENVIRONMENT_CANVAS: "ENVIRONMENT_CANVAS",
    SIGNAL_CANVAS: "SIGNAL_CANVAS",
    MICROPHONE_CANVAS: "MICROPHONE_CANVAS",
    SIGNAL: "SIGNAL",
    LOADING: "LOADING",
    NEURAL: "NEURAL",
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
        switch (action.page) {
            case AVAILABLE_PAGES.ENVIRONMENT_CANVAS:
                return {...action, microphoneDisplayAvailable: state.microphoneDisplayAvailable};
            case AVAILABLE_PAGES.SIGNAL:
                return {...action, microphoneDisplayAvailable: state.microphoneDisplayAvailable};
            case AVAILABLE_PAGES.SIGNAL_CANVAS:
                return {...action, microphoneDisplayAvailable: state.microphoneDisplayAvailable};
            case AVAILABLE_PAGES.NEURAL:
                return {...action, microphoneDisplayAvailable: state.microphoneDisplayAvailable};
            case AVAILABLE_PAGES.MICROPHONE_CANVAS:
                return action;
            case AVAILABLE_PAGES.LOADING:
                return action;
            default:
                return state;
        }
    }

    return state;
};
