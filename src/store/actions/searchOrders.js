import {
    FETCH_SEARCH_BEGIN,
    FETCH_SEARCH_SUCCESS,
    FETCH_SEARCH_FAILURE,
    CLEAR_SEARCH_DATA,
} from './actionTypes';
import { API } from '../../api/ApiHandler';
import { API_ENDPOINTS } from '../../api/constants';
import deviceStorage from '../../services/deviceStorage';
import moment from 'moment';

export const fetchDataSearchedOrders = () => {
  return async(dispatch) => {
    dispatch(fetchSearchedOrdersBegin());
    const id = await deviceStorage.getItem('company_id');
    const body = {
      param1: id,
      param2: moment().subtract(12, 'months').format('YYYY-MM-DD'),
      param3: '3999-12-31',
    };

    try{
      const result = await API.get(API_ENDPOINTS.GetEventsForCompanyByDate, body);
      dispatch(fetchSearchedOrdersSuccess(result));
    } catch(error) {
      dispatch(fetchSearchedOrdersError(error));
    }
  };
};

export const clearSearchData = () => {
  return dispatch => {
    dispatch({
      type: CLEAR_SEARCH_DATA,
    });
  }
}

const fetchSearchedOrdersBegin = () => ({
  type: FETCH_SEARCH_BEGIN
});


const fetchSearchedOrdersSuccess = (data) => ({
  type: FETCH_SEARCH_SUCCESS,
  payload: { data } 

});

const fetchSearchedOrdersError = (error) => ({
  type: FETCH_SEARCH_FAILURE,
  payload: { error }
});