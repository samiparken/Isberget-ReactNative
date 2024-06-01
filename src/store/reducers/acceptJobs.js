import { 
    ON_ACCEPT_JOB_SUCCESS,  
    NEXT_ACC_WEEK, 
    PREV_ACC_WEEK, 
    ACC_DATE_SELECTED, 
    UPDATE_ACC_WEEKS, 
    FETCH_ACCEPT_BEGIN, 
    FETCH_ACCEPT_SUCCESS, 
    FETCH_ACCEPT_FAILURE,
    ON_DECLINE_JOB_SUCCESS,
    FETCH_DECLINE_FAILURE,
    FETCH_DECLINE_BEGIN,
    UPDATE_TO_DATE,
    REMOVE_ORDER,
    CLEAR_ALL_DATA,
} from '../actions/actionTypes';
import {
    now,
    startOf,
    endOf,
    addWeek,
    subtractWeek,
    minBookDate
} from '../../utils/DateHandler';


const defaultAccJobsState = {
    today: now(),
    fromDate: startOf(now()),
    toDate: endOf(now()),
    minDate: minBookDate(),
    selectedDate: null,
    allUnAcceptedJobs: [],
    isLoading: false,
    error: null,
    firstTimeLoading: false
};

const acceptJobsReducer = (state = defaultAccJobsState, action) => {
    switch(action.type) {
        case NEXT_ACC_WEEK:
            return {
                ...state,
                fromDate: addWeek(action.fromDate),
                toDate: addWeek(action.toDate)
            }
        case PREV_ACC_WEEK:
            return {
                ...state,
                fromDate: subtractWeek(action.fromDate),
                toDate: subtractWeek(action.toDate)
            }
        case UPDATE_ACC_WEEKS:
            return {
                ...state,
                fromDate: startOf(action.date),
                toDate: endOf(action.date)
            }
        case UPDATE_TO_DATE:
            return {
                ...state,
                toDate: endOf(state.toDate, action.showWeekend)
            }
        case ACC_DATE_SELECTED:
            return {
                ...state,
                selectedDate: action.selectedDate
            }
    case REMOVE_ORDER: 
			return {
				...state,
				allUnAcceptedJobs: state.allUnAcceptedJobs.filter( index =>  (index.OrderId || index.Id || index.orderId) !== action.orderId),
			}
     case FETCH_ACCEPT_BEGIN: 
            return {
                ...state,
                isLoading: true,
                firstTimeLoading: true,
                error: null
            }
        case FETCH_ACCEPT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                firstTimeLoading: false,
                allUnAcceptedJobs: action.payload.data.AllUnAcceptedJobs
            }
        
        case FETCH_ACCEPT_FAILURE:
            return {
                ...state,
                isLoading: false,
                firstTimeLoading: false,
                error: action.payload.error,
                allUnAcceptedJobs: []
            }
        case ON_ACCEPT_JOB_SUCCESS:        
            return {
                ...state,
                isLoading: false,
                firstTimeLoading: false,
                allUnAcceptedJobs: state.allUnAcceptedJobs.filter(
                    index => index.OrderId !== action.payload.data.orderId
                )
            }
        case FETCH_DECLINE_BEGIN: 
            return {
                ...state,
                isLoading: true,
                firstTimeLoading: false,
                error: null
            } 
        case ON_DECLINE_JOB_SUCCESS:
            return {
                ...state,
                isLoading: false,
                firstTimeLoading: false,
                allUnAcceptedJobs: state.allUnAcceptedJobs.filter(
                    index => index.OrderId !== action.orderId
                )
            }
        case CLEAR_ALL_DATA:
            return {
                today: now(),
                fromDate: startOf(now()),
                toDate: endOf(now()),
                minDate: minBookDate(),
                selectedDate: null,
                allUnAcceptedJobs: [],
                isLoading: false,
                error: null,
                firstTimeLoading: false
            }
        default:
         return state;
    }
}

export default acceptJobsReducer;