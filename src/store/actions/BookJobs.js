import moment from 'moment';
import { API } from '../../api/ApiHandler';
import deviceStorage from '../../services/deviceStorage';
import { API_ENDPOINTS, ORDER_STATUS_TEXT } from '../../api/constants';

import {
  FETCH_BOOKED_BEGIN,
  FETCH_BOOKED_FAILURE,
  FETCH_BOOKED_SUCCESS,
  NEXT_BOOK_WEEK,
  PREV_BOOK_WEEK,
  UPDATE_BOOK_WEEKS,
  BOOK_DATE_SELECTED,
  FETCH_DATA_BOOKED,
  ON_UPDATE_STATUS,
  TOGGLE_SHOW_WEEKENDS,
  RESET_BOOK_JOBS_FOR_SELECTED_DATES,
  ON_BOOK_JOB_CALENDAR_SUCCESS,
  ON_BOOK_JOB_CALENDAR_BEGIN,
  ON_BOOK_JOB_CALENDAR_ERROR,
  DELETE_EVENT_BEGIN,
  DELETE_EVENT_ERROR,
  DELETE_EVENT_SUCCESS,
  UPDATE_JOB_BEGIN,
  UPDATE_JOB_ERROR,
  UPDATE_JOB_SUCCESS,
  POST_PROTOCOL_BEGIN,
  POST_PROTOCOL_ERROR,
  POST_PROTOCOL_SUCCESS,
  UPDATE_ORDER,
  UPDATE_FILER_INSTALLER,
  INSERT_ALL_USER_NAMES_FILTER,
  UPDATE_USER_NAME_FILTER,
  REMOVE_ORDER,
  CLEAR_ALL_DATA,
} from './actionTypes';
import {
  compareDates,
  compareDatesExplicit,
  addWeek,
  subtractWeek,
  startOf,
  endOf,
} from '../../utils/DateHandler';

export const nextBookWeek = ({
  fromDate, toDate, allEventsForCompany, showWeekend,
}) =>
// console.log("ALL EVENTS; ", allEventsForCompany);
  ({
    type: NEXT_BOOK_WEEK,
    fromDate: addWeek(fromDate),
    toDate: addWeek(toDate),
    AllBookedWeekDays: this.getWeekDays(allEventsForCompany, addWeek(fromDate), showWeekend),
  });
export const prevBookWeek = ({
  fromDate, toDate, allEventsForCompany, showWeekend, fromTodaysJob,
}) => {
  let subtractedWeekFrom = subtractWeek(fromDate);
  let subtractedWeekTo = subtractWeek(toDate);
  if (fromTodaysJob) {
    subtractedWeekFrom = moment(fromDate).subtract(1, 'weeks').format('YYYY-MM-DD');
    subtractedWeekTo = moment(toDate).subtract(1, 'weeks').format('YYYY-MM-DD');
  }
  return {
    type: PREV_BOOK_WEEK,
    fromDate: subtractedWeekFrom,
    toDate: subtractedWeekTo,
    AllBookedWeekDays: this.getWeekDays(allEventsForCompany, subtractedWeekFrom, showWeekend),
  };
};

export const updateBookWeeks = (date, data) => ({
  type: UPDATE_BOOK_WEEKS,
  fromDate: startOf(date),
  toDate: endOf(date, data.showWeekend),
  AllBookedWeekDays: this.getWeekDays(data.allEventsForCompany, startOf(date), data.showWeekend),
});

export const fetchDataBookJobs = (fromDate, showWeekend) => async (dispatch) => {
  dispatch(fetchBookedBegin());
  try {
    const id = await deviceStorage.getItem('company_id');
    const body = {
      param1: id,
      param2: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      param3: '3999-12-31',
    };

    const response = await API.get(API_ENDPOINTS.BookedJobs, { param: id });
    if(response.error){
      dispatch(fetchBookedError(response.error));
      return false;
    }

    const newResponse = await API.get(API_ENDPOINTS.GetEventsForCompanyByDate, body);
    if(newResponse.error){
      dispatch(fetchBookedError(newResponse.error));
      return false;
    }

    const concatResponse = newResponse.concat(response);
      dispatch(fetchBookedSuccess({
        AllEventsForCompany: concatResponse,
        AllAcceptedJob: response,
        AllBookedWeekDays: this.getWeekDays(concatResponse, fromDate, showWeekend),
        showWeekend,
    }));
    return true;
    
  } catch (error) {
    dispatch(fetchBookedError(error));
    return false;
  }
};

export const onUpdateOrderStatus = data => (dispatch) => {
  data.OrderStatus = ORDER_STATUS_TEXT.accepted;
  dispatch(onUpdateORderStatus({
    UpdatedData: data,
  }));
  return (data);
};

export const bookCalendarJob = (parameters, data, endpoint, allBookedWeekDays, userName) => {
  let dateIndex = null;
  Object.keys(allBookedWeekDays).forEach((index) => {
    if (compareDatesExplicit(index, parameters.param5)) {
      dateIndex = index;
      if (endpoint == API_ENDPOINTS.BookJobConfirmedCustomer) {
        data.OrderStatus = ORDER_STATUS_TEXT.bookedWithCustomer;
        data.ResourceName = userName;
        data.ResourceId = parameters.param3;
      } else {
        data.OrderStatus = ORDER_STATUS_TEXT.notBookedWithCustomer;
        data.ResourceName = userName;
        data.ResourceId = parameters.param3;
      }
      data.Start = parameters.param5;
      data.End = parameters.param6;

      allBookedWeekDays[index].push({
        orderId: data.OrderId || data.Id || data.orderId,
        startTime: data.Start,
        endTime: data.End,
        status: data.OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer ? 1 : 2,
        lat: data.lat,
        lng: data.lng,
      });
    }
  });
  return (dispatch) => {
    dispatch(onBookJobCalendarBegin());
    dispatch(onBookJobCalendarSuccess({ UpdatedData: data }));
    return API.get(endpoint, parameters).then((response) => {
      if (response.includes('success')) {
        dispatch(onBookJobCalendarSuccess({ UpdatedData: data }));
        return (data);
      }
      data.OrderStatus = ORDER_STATUS_TEXT.accepted;

      // Find and remove job from the booking bar (i.e. allBookedWeekDays)
      const jobIndex = allBookedWeekDays[dateIndex]
        .find(job => (job.orderId || job.Id || job.OrderId) === (data.OrderId || data.Id || data.orderId));

      allBookedWeekDays[dateIndex].splice(jobIndex, 1);

      dispatch(onBookJobCalendarError({
        newJob: data,
        error: 'Jobbet kunde inte bokas...',
      }));
    });
  };
};

export const toggleShowWeekends = data => ({
  type: TOGGLE_SHOW_WEEKENDS,
  data: data ? this.getWeekDays(data.allEventsForCompany, data.fromDate, !data.showWeekend) : null,
});

export const deleteEventFromCalendar = data => (dispatch) => {
  dispatch(deleteFromCalendarBegin());
  data.OrderStatus = ORDER_STATUS_TEXT.accepted;
  data.ResourceName = null;
  return API.get(API_ENDPOINTS.DeleteEventFromCalendar, { param: data.Task_Company_Id }).then((response) => {
    dispatch(deleteFromCalendarSuccess(data));
    return (response);
  });
};

export const updateJob = (query, oldJob) => async (dispatch) => {
  dispatch(actionBegin(UPDATE_JOB_BEGIN));
  dispatch(actionSuccess(UPDATE_JOB_SUCCESS, query));
  try {
    await API.get(API_ENDPOINTS.updateJob, query);
    return true;
  } catch (error) {
    dispatch(actionError(UPDATE_JOB_ERROR, {
      oldJob,
      newJobParams: query,
      mess: 'Det gick inte att uppdatera jobbet...',
    }));
    return false;
  }
};

export const bookDateSelected = selectedDate => ({
  type: BOOK_DATE_SELECTED,
  selectedDate,
});


export const updateFilter = installerData => ({
  type: UPDATE_FILER_INSTALLER,
  installerData,
});


export const updateFilterUser = userName => ({
  type: UPDATE_USER_NAME_FILTER,
  userName,
});

export const updateUserNameFilter = userNames => ({
  type: INSERT_ALL_USER_NAMES_FILTER,
  userNames,
});

export const onUpdateJobToBooked = (orderId, data) => ({
  type: UPDATE_ORDER,
  orderId,
  AllBookedWeekDays: this.getWeekDays(data.allEventsForCompany, data.fromDate, data.showWeekend),
});

export const onRemoveJob = orderId => ({
  type: REMOVE_ORDER,
  orderId,
});


export const postProtocol = (body, job) => async (dispatch) => {
  dispatch(actionBegin(POST_PROTOCOL_BEGIN));
  dispatch(actionSuccess(POST_PROTOCOL_SUCCESS, job, body.installationProtocolType.val));
  try {
    const res = await API.post(API_ENDPOINTS.Protocol, body, { param: true });
    if (res !== null || res !== undefined) {
      return true;
    }
    console.log('Error post protcol');
    dispatch(actionError(POST_PROTOCOL_ERROR, {
      mess: 'Protokollet kunde inte slutföras',
      job,
    }));
    return false;
  } catch (error) {
    dispatch(actionError(POST_PROTOCOL_ERROR, {
      mess: 'Protokollet kunde inte slutföras',
      job,
    }));
    return false;
  }
};

const actionBegin = type => ({
  type,
});

const actionSuccess = (type, payload, val = null) => ({
  type,
  payload,
  val,
});

const actionError = (type, error) => ({
  type,
  error,
});

export const fetchBookedBegin = () => ({
  type: FETCH_BOOKED_BEGIN,
});

export const fetchBookedSuccess = payload => ({
  type: FETCH_BOOKED_SUCCESS,
  payload,
});

const onUpdateORderStatus = data => ({
  type: ON_UPDATE_STATUS,
  payload: { data },

});

const onBookJobCalendarBegin = () => ({
  type: ON_BOOK_JOB_CALENDAR_BEGIN,
});

const onBookJobCalendarSuccess = data => ({
  type: ON_BOOK_JOB_CALENDAR_SUCCESS,
  payload: { data },
});

const onBookJobCalendarError = payload => ({
  type: ON_BOOK_JOB_CALENDAR_ERROR,
  payload,
});

const fetchBookedError = error => ({
  type: FETCH_BOOKED_FAILURE,
  payload: { error },
});

export const resetJobsForSelectedDate = () => ({
  type: RESET_BOOK_JOBS_FOR_SELECTED_DATES,
});

export const deleteFromCalendarBegin = () => ({
  type: DELETE_EVENT_BEGIN,
});

export const deleteFromCalendarSuccess = data => ({
  type: DELETE_EVENT_SUCCESS,
  payload: data,
});

export const deleteFromCalendarError = error => ({
  type: DELETE_EVENT_ERROR,
  error,
});

export const clearAllBookData = () => ({
  type: CLEAR_ALL_DATA,
});

getWeekDays = (items, firstDay, showWeekend) => {
  const jobs = {};
  // const ifJobsExists = [];
  const days = showWeekend ? 7 : 5;
  for (i = 0; i < days; i++) {
    const date = moment(firstDay).add(i, 'days');
    const dateString = date.format('YYYY-MM-DD');
    const arr = [];
    items.map((item) => {
      if (compareDates(date, item.Start)) {
        if (item.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer
          || item.OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer) {
          arr.push({
            orderId: item.Id || item.OrderId,
            startTime: item.Start,
            endTime: item.End,
            status: item.OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer ? 1 : 2,
            lat: item.lat,
            lng: item.lng,
          });
        }
      }
    });
    jobs[dateString] = arr;

    weekArrayDates = ['02/02', '03/02', '04/02', '05/02'];
  }
  return jobs;
};
