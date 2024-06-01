/* eslint-disable import/prefer-default-export */
import { API } from '../../api/ApiHandler';
import deviceStorage from '../../services/deviceStorage';
import { API_ENDPOINTS, INSTALLER } from '../../api/constants';
import {
  TRY_AUTH_BEGIN,
  TRY_AUTH_ERROR,
  TRY_AUTH_SUCCESS,
} from './actionTypes';

export const tryAuth = authData => async (dispatch) => {
  dispatch(actionBegin(TRY_AUTH_BEGIN));
  try {
    const body = {
      grant_type: 'password',
      username: authData.email,
      password: authData.password,
    };
    const token = await API.post(API_ENDPOINTS.Login, body);
    if(token.error === 'Network Error'){
      dispatch(actionError('No internet connection', TRY_AUTH_ERROR));
      return false;
    }
    if (!token.access_token) {
      dispatch(actionError('Fel e-post eller lösenord', TRY_AUTH_ERROR));
      return false;
    }
    await deviceStorage.saveItem('id_token', token.access_token);
    await deviceStorage.saveItem('installerName', authData.email);
    await deviceStorage.saveItem('tokenExpiration', token['.expires']);
    
    let address
    if (token.roles !== INSTALLER) {
      const userData = await API.get(API_ENDPOINTS.GetUserData);
      const bodyCompany = { CompanyId: userData.companyId };
      const usersInCompany = await API.get(API_ENDPOINTS.GetUsersInCompany, bodyCompany);
      address = await API.get(API_ENDPOINTS.GetCompanyAddress, { companyId: userData.companyId });

      await deviceStorage.saveItem('user_id', userData.userId);
      await deviceStorage.saveItem('company_id', userData.companyId);
      await deviceStorage.saveItem('usersInCompany', JSON.stringify(usersInCompany));
      await deviceStorage.saveItem('isInstaller', 'false');
      
    } else {
      const userData = await API.get(API_ENDPOINTS.GetUserData);
      const companyId = await API.get(API_ENDPOINTS.GetCurrentUserCompaniesAndChildren);
      const bodyCompany = { CompanyId: JSON.stringify(companyId[0].company_id) };
      const usersInCompany = await API.get(API_ENDPOINTS.GetUsersInCompany, bodyCompany);
      address = await API.get(API_ENDPOINTS.GetCompanyAddress, { companyId: userData.companyId });

      await deviceStorage.saveItem('user_id', JSON.stringify(userData.UserId));
      await deviceStorage.saveItem('company_id', JSON.stringify(companyId[0].company_id));
      await deviceStorage.saveItem('usersInCompany', JSON.stringify(usersInCompany));
      await deviceStorage.saveItem('isInstaller', 'true');
    }
    
    dispatch(actionSuccess({
      isInstaller: token.roles === INSTALLER, 
      email: authData.email,
      address: address
    }, TRY_AUTH_SUCCESS));
    return true;
  } catch (error) {
    dispatch(actionError('Fel e-post eller lösenord', TRY_AUTH_ERROR));
    return false;
  }
};

const actionBegin = type => ({
  type,
});

const actionSuccess = (data, type) => ({
  type,
  data,
});

const actionError = (error, type) => ({
  type,
  error,
});
