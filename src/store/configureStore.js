import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import authReducer from './reducers/auth';
import bookJobsReducer from './reducers/bookJobs';
import acceptJobsReducer from './reducers/acceptJobs';
import searchOrderReducer from './reducers/searchOrders';
import connectionReducer from './reducers/connection'
import messagesReducer from './reducers/messages';
import navigationStateReducer from "./reducers/navigationState";

const rootReducer = combineReducers({
    auth: authReducer,
    bookJobs: bookJobsReducer,
    acceptJobs: acceptJobsReducer,
    searchOrder: searchOrderReducer,
    connection: connectionReducer,
    messages: messagesReducer,
    navigationState: navigationStateReducer,
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
