import { SET_CONNECTION } from "../actions/actionTypes";

const initialState = {
    connectionState: 'fast'
}

const connectionReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_CONNECTION: 
            return {
                ...state,
                connectionState: action.connectionState,
            }
        default: 
            return state;
    }
}

export default connectionReducer;