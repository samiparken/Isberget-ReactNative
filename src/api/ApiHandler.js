import Axios from 'axios';
/* eslint-disable import/prefer-default-export */
import qs from 'query-string';
import deviceStorage from '../services/deviceStorage';

const BASE_URL = 'http://dev.installationspartner.se';
//const BASE_URL = 'http://sys.installationspartner.se';

export const API = {
  post: async (endpoint, payload, protocolSent = {}) => {
    const hasData = !!Object.keys(protocolSent).length;
    const headers = {
      'Content-Type': hasData ? 'application/json' : 'application/x-www-form-urlencoded;charset=UTF-8',
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
    };
    const hasQuery = !!Object.keys(payload).length;
    const queryString = hasQuery ? `${qs.stringify(payload)}` : '';

    try{
      const token = await deviceStorage.getToken();
      if (token !== null) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await Axios.post(BASE_URL + endpoint,  
        hasData ? JSON.stringify(payload) : queryString, 
        {
          headers: headers,
        }
      );

      if (response.status === 204) return {};
      return response.data;
    }
    catch(error){
      return { error: error.message };
    }
  },
  get: async (endpoint, query = {}) => {
    const hasQuery = !!Object.keys(query).length;
    const queryString = hasQuery ? `?${qs.stringify(query)}` : '';

    const headers = {
      Authorization: 'Bearer',
    };

    try{
      const token = await deviceStorage.getToken();
      if (token !== null) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await Axios.get(BASE_URL + endpoint + queryString, {
        headers: headers,
      });

      return response.data;
    }
    catch(error){
      return { error: error.message };
    }
  },
};
