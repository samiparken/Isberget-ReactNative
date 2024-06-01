import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './src/store/configureStore';
import InitiateNotifications from './src/services/Notifications';

const store = configureStore();
InitiateNotifications();

const RNRedux = () => (
    <Provider store={store}>
      <App />
    </Provider>
);
