import { API } from '../../api/ApiHandler';
import { API_ENDPOINTS } from '../../api/constants';
// import {
//   POST_DEVICE_TOKEN_BEGIN,
//   POST_DEVICE_TOKEN_ERROR,
//   POST_DEVICE_TOKEN_SUCCESS,
// } from './actionTypes';

export const postDeviceToken = (payload) => async (dispatch) => {
  try {
    const res = await API.get(API_ENDPOINTS.UpdateDeviceToken, payload);
    return true;
  } catch (error) {
    return false;
  }
}