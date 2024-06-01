import React from 'react';
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import configureStore from "../store/configureStore";
import InitiateNotifications from '../services/Notifications';

import AuthScreen from '../screens/Auth/Auth';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import AcceptJobScreen from '../screens/AcceptJobs/AcceptJobs';
import BookJobsScreen from '../screens/BookJobs/BookJobs';
import SearchScreen from '../screens/Search/Search';
import SettingsScreen from '../screens/Settings/Settings';
import TodaysJobScreen from '../screens/TodaysJobs/TodaysJobs';
import AccountSettingsScreen from '../screens/AccountSettings/AccountSettings';
import NotificationSettingsScreen from '../screens/NotificationSettings/NotificationSettings';
import AppWalkthroughScreen from '../screens/AppWalkthrough/AppWalkthrough';
import ContactDetailsScreen from '../screens/ContactDetails/ContactDetails';
import SMSSettingsScreen from '../screens/SMSSettings/SMSSettings';
import ClientAnswersScreen from '../screens/ClientAnswersScreen/ClientAnswersScreen'

import screens from '../routes/screens';
import MessageScreen from '../screens/MessageScreen/MessageScreen';

const store = configureStore();

const register = () => {
  Navigation.registerComponent(
    "Installationspartner.Notifications",
    () => InitiateNotifications,
  )

  Navigation.registerComponent(
    screens.AUTH_SCREEN,
    () => (props) =>
        <Provider store={store}>
            <AuthScreen {...props} />
        </Provider>,
    () => AuthScreen
  );
  Navigation.registerComponent(
      screens.FORGOT_SCREEN,
      () => (props) =>
        <Provider store={store}>
            <ForgotPassword {...props} />
        </Provider>,
      () => ForgotPassword,
  );
  Navigation.registerComponent(
    screens.MESSAGE_SCREEN,
    () => (props) =>
      <Provider store={store}>
          <MessageScreen {...props} />
      </Provider>,
    () => MessageScreen,
);
  Navigation.registerComponent(
      screens.ACCEPT_JOBS_SCREEN,
      () => (props) =>
        <Provider store={store}>
            <AcceptJobScreen {...props} />
        </Provider>,
      () => AcceptJobScreen,
  );
  Navigation.registerComponent(
      screens.BOOK_JOBS_SCREEN,
      () => (props) =>
        <Provider store={store}>
            <BookJobsScreen {...props} />
        </Provider>,
      () => BookJobsScreen,
  );
  Navigation.registerComponent(
      screens.SEARCH_SCREEN,
      () => (props) =>
        <Provider store={store}>
            <SearchScreen {...props} />
        </Provider>,
      () => SearchScreen,
  );
  Navigation.registerComponent(
      screens.SETTINGS_SCREEN,
      () => (props) =>
        <Provider store={store}>
            <SettingsScreen {...props} />
        </Provider>,
      () => SettingsScreen,
  );
  Navigation.registerComponent(
      screens.TODAYS_JOBS_SCREEN,
      () => (props) =>
        <Provider store={store}>
            <TodaysJobScreen {...props} />
        </Provider>,
      () => TodaysJobScreen,
  );
  Navigation.registerComponent(
      screens.ACCOUNT_SETTINGS,
      () => (props) =>
        <Provider store={store}>
            <AccountSettingsScreen {...props} />
        </Provider>,
      () => AccountSettingsScreen,
  );
  Navigation.registerComponent(
      screens.NOTIFICATION_SETTINGS,
      () => (props) =>
        <Provider store={store}>
            <NotificationSettingsScreen {...props} />
        </Provider>,
      () => NotificationSettingsScreen,
  );
  Navigation.registerComponent(
      screens.APP_WALKTHROUGH,
      () => (props) =>
        <Provider store={store}>
            <AppWalkthroughScreen {...props} />
        </Provider>,
      () => AppWalkthroughScreen,
  );
  Navigation.registerComponent(
      screens.CONTACT_DETAILS,
      () => (props) =>
        <Provider store={store}>
            <ContactDetailsScreen {...props} />
        </Provider>,
      () => ContactDetailsScreen,
  );
  Navigation.registerComponent(
      screens.SMS_SETTINGS,
      () => (props) =>
        <Provider store={store}>
            <SMSSettingsScreen {...props} />
        </Provider>,
      () => SMSSettingsScreen,
  );
  Navigation.registerComponent(
    screens.CLIENT_ANSWERS_SCREEN,
    () => (props) => <ClientAnswersScreen {...props} />,
    () => ClientAnswersScreen,
  );
}

export default register;
