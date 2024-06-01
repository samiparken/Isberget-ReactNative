import { SET_ACTIVE_PAGE } from "../actions/actionTypes";

const initialState = {
    activePage: 0,
}

const navigationStateReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_ACTIVE_PAGE: 
            return {
                ...state,
                activePage: action.payload,
            }
        default: 
            return state;
    }
}

export default navigationStateReducer;