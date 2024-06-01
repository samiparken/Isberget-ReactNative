import {
  FETCH_SEARCH_BEGIN,
  FETCH_SEARCH_FAILURE,
  FETCH_SEARCH_SUCCESS,
  CLEAR_SEARCH_DATA,
} from '../actions/actionTypes';

const defaultSearcDataState = {
  searchedData: [],
  isLoading: false,
  error: null,
};

const searchDataReducer = (state = defaultSearcDataState, action) => {
  switch(action.type) {
    case FETCH_SEARCH_BEGIN: 
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case FETCH_SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        searchedData: action.payload.data
      }
    case FETCH_SEARCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        searchedData: [],
      }
    case CLEAR_SEARCH_DATA:
      return {
        ...state,
        isLoading: false,
        error: null,
        searchedData: [],
      }
    default:
      return state;
  }
}

export default searchDataReducer;
