import {
  NEXT_ACC_WEEK,
  PREV_ACC_WEEK,
  ACC_DATE_SELECTED,
  UPDATE_ACC_WEEKS,
  FETCH_ACCEPT_BEGIN,
  FETCH_ACCEPT_FAILURE,
  FETCH_ACCEPT_SUCCESS,
  ON_ACCEPT_JOB_SUCCESS,
  FETCH_DECLINE_BEGIN,
  ON_DECLINE_JOB_SUCCESS,
  FETCH_DECLINE_FAILURE,
  UPDATE_TO_DATE,
  CLEAR_ALL_DATA
} from './actionTypes';
import { API } from '../../api/ApiHandler';
import deviceStorage from '../../services/deviceStorage';
import { API_ENDPOINTS } from '../../api/constants';


export const nextAccWeek = ({ fromDate, toDate }) => ({
  type: NEXT_ACC_WEEK,
  fromDate,
  toDate,
});

export const prevAccWeek = ({ fromDate, toDate }) => ({
  type: PREV_ACC_WEEK,
  fromDate,
  toDate,
});

export const updateAccWeeks = date => ({
  type: UPDATE_ACC_WEEKS,
  date,
});

export const updateToDate = showWeekend => ({
  type: UPDATE_TO_DATE,
  showWeekend,
});

export const accDateSelected = selectedDate => ({
  type: ACC_DATE_SELECTED,
  selectedDate,
});


export const fetchAcceptJobsBegin = () => ({
  type: FETCH_ACCEPT_BEGIN,
});


export const fetchAccpetJobsSuccess = data => ({
  type: FETCH_ACCEPT_SUCCESS,
  payload: { data },

});

export const onAcceptJobSuccess = data => ({
  type: ON_ACCEPT_JOB_SUCCESS,
  payload: { data },

});

export const fetchAcceptsJobsError = error => ({
  type: FETCH_ACCEPT_FAILURE,
  payload: { error },
});

export const fetchDeclineJobBegin = () => ({
  type: FETCH_DECLINE_BEGIN,
});

export const onDeclineJobSuccess = orderId => ({
  type: ON_DECLINE_JOB_SUCCESS,
  orderId,
});

export const fetchDeclinesJobError = error => ({
  type: FETCH_DECLINE_FAILURE,
  payload: { error },
});


export const fetchDataAcceptsJobs = () => async (dispatch) => {
  dispatch(fetchAcceptJobsBegin());

  try {
    const companyId = await deviceStorage.getItem('company_id');
    const response = await API.get(API_ENDPOINTS.UnacepetedJobs, { param: companyId });
    
    if(response.error){
      dispatch(fetchAcceptsJobsError(response.error));
      return null;
    }

    dispatch(fetchAccpetJobsSuccess({ AllUnAcceptedJobs: response }));
    return ({ AllUnAcceptedJobs: response });

  } catch (error) {
    dispatch(fetchAcceptsJobsError(error));
    return null;
  }
};

export const onAcceptJob = (orderId, userId) => async (dispatch) => {
  dispatch(fetchAcceptJobsBegin());

  const response = await API.get(API_ENDPOINTS.AcceptJobWithId, { param1: orderId, param2: userId });

  if(response.error){
    dispatch(fetchAcceptsJobsError(response.error));
    return null;
  }

  dispatch(onAcceptJobSuccess({ orderId }));
  return ({ orderId });
};

export const declineJob = data => async (dispatch) => {
  dispatch(fetchDeclineJobBegin());

  const response = await API.get(API_ENDPOINTS.DeclineJob, data);
  
  if(response.error){
    dispatch(fetchAcceptsJobsError(response.error));
    return null;
  }
  
  dispatch(onDeclineJobSuccess(data.param1));
  return (data.param1);
};

export const clearAllAcceptData = () => ({
  type: CLEAR_ALL_DATA,
});
