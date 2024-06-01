import {
    now,
    startOf,
    endOf,
    minBookDate
} from '../../utils/DateHandler';

import {
	FETCH_BOOKED_FAILURE,
	FETCH_BOOKED_BEGIN,
	FETCH_BOOKED_SUCCESS,
	NEXT_BOOK_WEEK,
	PREV_BOOK_WEEK,
	UPDATE_BOOK_WEEKS,
	BOOK_DATE_SELECTED,
	ON_UPDATE_STATUS, 
	ON_BOOK_JOB_CALENDAR_SUCCESS,
	ON_BOOK_JOB_CALENDAR_BEGIN,
	ON_BOOK_JOB_CALENDAR_ERROR,
	DELETE_EVENT_BEGIN,
	UPDATE_FILER_INSTALLER,
	// DELETE_EVENT_ERROR,
	DELETE_EVENT_SUCCESS,
	TOGGLE_SHOW_WEEKENDS,
	RESET_BOOK_JOBS_FOR_SELECTED_DATES,
	UPDATE_JOB_BEGIN,
	UPDATE_JOB_ERROR,
	UPDATE_JOB_SUCCESS,
	POST_PROTOCOL_BEGIN,
	POST_PROTOCOL_ERROR,
	POST_PROTOCOL_SUCCESS,
	UPDATE_ORDER,
	UPDATE_USER_NAME_FILTER,
	INSERT_ALL_USER_NAMES_FILTER,
	REMOVE_ORDER,
	CLEAR_ALL_DATA,
} from '../actions/actionTypes';
import moment from 'moment';
import { ORDER_STATUS_TEXT } from '../../api/constants';

const bookJobsReducerDefaultState = {
	today: now(),
	fromDate: startOf(now()),
	toDate: endOf(now()),
	minDate: minBookDate(),
	selectedDate: null,
	jobsForSelectedDate: null,
	isLoading: false,
	firstTimeLoading: false,
	error: null,
	allEventsForCompany: [],
	allAcceptedJobs: [],
	allFilteredJobs: [],
	AllBookedWeekDays: {},
	showWeekend: false,
	userNamesFilter: [],
};

// REMINDER:
// Hämta från fromDate och toDate from local storage, om inget finns:
// Sätt fromDate till veckans första dag
// Sätt toDate till veckans sista dag

const bookJobsReducer = (state = bookJobsReducerDefaultState, action) => {
	switch (action.type) {
		case NEXT_BOOK_WEEK:
				return {
						...state,
						fromDate: action.fromDate,
						toDate: action.toDate,
						AllBookedWeekDays: action.AllBookedWeekDays
				}
		case PREV_BOOK_WEEK:
				return {
						...state,
						fromDate: action.fromDate,
						toDate: action.toDate,
						AllBookedWeekDays: action.AllBookedWeekDays
				}
		case UPDATE_BOOK_WEEKS:
				return {
						...state,
						fromDate: action.fromDate,
						toDate: action.toDate,
						AllBookedWeekDays: action.AllBookedWeekDays,
				}
		case BOOK_DATE_SELECTED:
				let jobs = null;
				if (action.selectedDate) {
					jobs = getJobsForSelectedDate(
						state.allEventsForCompany, action.selectedDate, state.userNamesFilter);
				}
				return {
						...state,
						selectedDate: action.selectedDate,
						jobsForSelectedDate: jobs,
				}
		case FETCH_BOOKED_BEGIN:
		case DELETE_EVENT_BEGIN:
		case UPDATE_JOB_BEGIN:
		case ON_BOOK_JOB_CALENDAR_BEGIN:
		case POST_PROTOCOL_BEGIN:
			return {
				...state,
				isLoading: true,
				firstTimeLoading: true,
				error: null,
			}
		case FETCH_BOOKED_SUCCESS:
			return {
					...state,
					isLoading: false,
					firstTimeLoading: false,
					allEventsForCompany: action.payload.AllEventsForCompany,
					allAcceptedJobs: action.payload.AllAcceptedJob,
					AllBookedWeekDays: action.payload.AllBookedWeekDays,
					allFilteredJobs: action.payload.AllEventsForCompany,
					showWeekend: action.payload.showWeekend,
			}
		case UPDATE_FILER_INSTALLER: 
			return {
				...state,
				allFilteredJobs: state.allEventsForCompany.filter(index => {
					if(!index.ResourceName){
						return true;
					}
					return (action.installerData.includes(index.ResourceName))
				})
			}

			case INSERT_ALL_USER_NAMES_FILTER:
			return {
				...state,
				userNamesFilter: action.userNames
			}

			case UPDATE_USER_NAME_FILTER:
			let userNamesArray = state.userNamesFilter;
			if(userNamesArray.includes(action.userName)){
				userNamesArray = userNamesArray.filter(index => index !== action.userName)
			} else {
				userNamesArray.push(action.userName);
			}
		
			return {
				...state,
				userNamesFilter: userNamesArray
			}

		case FETCH_BOOKED_FAILURE:
				return {
						...state,
						isLoading: false,
						firstTimeLoading: false,
						error: action.payload.error
				}
		case ON_UPDATE_STATUS:
				state.allAcceptedJobs.map((value, index) => {
					const orderId1 = value.OrderId || value.Id;
					const orderId2 = action.payload.data.UpdatedData.OrderId || action.payload.data.UpdatedData.Id
						if(orderId1 === orderId2){
								state.allAcceptedJobs[index] = action.payload.data.UpdatedData
						}

				})
				return {
						...state,
						isLoading: false,
						firstTimeLoading: false,
						allEventsForCompany: [...state.allEventsForCompany, action.payload.data.UpdatedData],
						allFilteredJobs: [...state.allFilteredJobs, action.payload.data.UpdatedData],
						allAcceptedJobs: [...state.allAcceptedJobs, action.payload.data.UpdatedData]
				}
		case ON_BOOK_JOB_CALENDAR_SUCCESS: 
			state.allEventsForCompany.map((value, index) => {
				const orderId1 = value.OrderId || value.Id;
				const orderId2 = action.payload.data.UpdatedData.OrderId || action.payload.data.UpdatedData.Id
				if(orderId1 === orderId2){
					state.allEventsForCompany[index] = action.payload.data.UpdatedData
				}
			});
			return {
				...state,
				isLoading: false,
				firstTimeLoading: false,
				selectedDate: null,
				allAcceptedJobs: state.allAcceptedJobs.filter(
					index => (index.OrderId || index.Id) !== (action.payload.data.UpdatedData.OrderId || action.payload.data.UpdatedData.Id),
				),
			}
		case UPDATE_ORDER: 
			return {
					...state,
					isLoading: false,
					firstTimeLoading: false,
					AllBookedWeekDays: action.AllBookedWeekDays,
			}
		case ON_BOOK_JOB_CALENDAR_ERROR:
			const { newJob, error } = action.payload;
			const { allEventsForCompany } = state;

			// Find and update job (w/ previous OrderStatus) in allEventsForCompany
			const jobIndex = allEventsForCompany
				.find((job) => (job.OrderId || job.Id) === (newJob.OrderId || newJob.Id));
			allEventsForCompany[jobIndex] = newJob;

			return {
				...state,
				allEventsForCompany,
				isLoading: false,
				error,
			}
		case DELETE_EVENT_SUCCESS:
			 let index;
			 const job = action.payload;
			 const { AllBookedWeekDays } = state;
			
			let dateIndex = Object.keys(AllBookedWeekDays)
				 .find(index => moment(index).isSame(job.Start, 'd'));
			 if (dateIndex){
				AllBookedWeekDays[dateIndex].map((index, key) => {
						if(index.orderId === job.Id || index.orderId === job.OrderId) {
							AllBookedWeekDays[dateIndex].splice(key, 1);
						}
				});
			}
			return {
				...state,
				isLoading: false,
				firstTimeLoading: false,
				allAcceptedJobs: [...state.allAcceptedJobs, action.payload],
				AllBookedWeekDays,
			}

		case REMOVE_ORDER: 
			return {
				...state,
				allEventsForCompany: state.allEventsForCompany.filter( index =>  (index.OrderId || index.Id || index.orderId) !== action.orderId),
				allAcceptedJobs: state.allAcceptedJobs.filter( index =>  (index.OrderId || index.Id || index.orderId) !== action.orderId),
				allFilteredJobs: state.allFilteredJobs.filter( index => (index.OrderId || index.Id || index.orderId) !== action.orderId),
			}
		case TOGGLE_SHOW_WEEKENDS:
			return {
					...state,
					showWeekend: !state.showWeekend,
					AllBookedWeekDays: action.data ? action.data : state.AllBookedWeekDays,
					toDate: endOf(state.toDate, !state.showWeekend) 
			}
		case RESET_BOOK_JOBS_FOR_SELECTED_DATES:
			return {
				...state,
				jobsForSelectedDate: null,
			}
		case UPDATE_JOB_SUCCESS: {
			const { allEventsForCompany, allFilteredJobs } = state;
			const { payload } = action;

			let foundIndex = null;
			let foundOldJob = allEventsForCompany.find((value, index) => {
				if ((value.Id || value.orderId || value.OrderId) === payload['param[orderId]']) {
					foundIndex = index;
					return true;
				}
				return false;
			});

			let foundIndexForFilter = null;
			allFilteredJobs.find((value, index) => {
				if ((value.Id || value.orderId || value.OrderId) === payload['param[orderId]']) {
					foundIndexForFilter = index;
					return true;
				}
				return false;
			});

			const newJob = {
				...foundOldJob,
				Start: payload['param[start]'],
				End: payload['param[end]'],
				// Date: payload['param[date]'], don't know where to put the date param
				ResourceId: payload['param[resourceId]'],
				OrderId: payload['param[orderId]'],
				OrderStatusId: payload['param[orderStatusId]'],
				OrderStatus: payload['param[orderStatusId]'] === 4
					? ORDER_STATUS_TEXT.notBookedWithCustomer : ORDER_STATUS_TEXT.bookedWithCustomer,
			}
			
			let { AllBookedWeekDays } = state;
			if (!moment(foundOldJob.Start).isSame(payload['param[start]'], 'days')) {
				AllBookedWeekDays = onUpdateJobsForWeek(state.AllBookedWeekDays, newJob, foundOldJob);
			}

			allEventsForCompany[foundIndex] = newJob;
			allFilteredJobs[foundIndexForFilter] = newJob;
			return {
				...state,
				allEventsForCompany,
				allFilteredJobs,
				AllBookedWeekDays,
				isLoading: false,
				error: null,
			}
		}
		case UPDATE_JOB_ERROR: {
			const { allEventsForCompany } = state;
			const { oldJob, newJobParams, mess } = action.error; // payload egentligen
			const foundIndex = allEventsForCompany.find(value => value.Id === newJobParams['param[orderId]']);
			allEventsForCompany[foundIndex] = oldJob;
			const newJob = {
				...oldJob,
				Start: newJobParams['param[start]'],
				End: newJobParams['param[end]'],
				// Date: payload['param[date]'], don't know where to put the date param
				ResourceId: newJobParams['param[resourceId]'],
				OrderId: newJobParams['param[orderId]'],
				OrderStatusId: newJobParams['param[orderStatusId]'],
				OrderStatus: newJobParams['param[orderStatusId]'] === 4
					? ORDER_STATUS_TEXT.bookedWithCustomer : ORDER_STATUS_TEXT.notBookedWithCustomer,
			}

			let { AllBookedWeekDays } = state;
			if (!moment(oldJob.Start).isSame(newJob.Start)) {
				AllBookedWeekDays = onUpdateJobsForWeek(state.AllBookedWeekDays, oldJob, newJob);
			}

			return {
				...state,
				allEventsForCompany,
				AllBookedWeekDays,
				isLoading: false,
				error: mess,
			}
		}
		case POST_PROTOCOL_SUCCESS: {
			const job = action.payload;
			const val = action.val;
			if(val !== 6) {
			const { allEventsForCompany, AllBookedWeekDays } = state;
			job.OrderStatus = ORDER_STATUS_TEXT.completed;

			const foundIndex = allEventsForCompany.findIndex(element => (
				(element.Id || element.orderId || element.OrderId) === (job.Id || job.orderId || job.OrderId)
			));
			if (foundIndex) {
				allEventsForCompany[foundIndex] = job;
			}

			const foundDate = Object.keys(AllBookedWeekDays).find((date => (
				moment(date).isSame(job.Start, 'days')
			)));
			
			let filteredJobs = AllBookedWeekDays;
			if (foundDate) {
				filteredJobs = AllBookedWeekDays[foundDate].filter(element => (
					(element.orderId || element.Id || element.OrderId) !== (job.Id || job.orderId || job.OrderId)
				));
				AllBookedWeekDays[foundDate] = filteredJobs;
			}
			return {
				...state,
				error: null,
				isLoading: false,
				allEventsForCompany,
				AllBookedWeekDays,
				firstTimeLoading: false
			}
		}
		return {
			...state,
			error: null,
			isLoading: false,
			firstTimeLoading: false
		}
			
		}
		case POST_PROTOCOL_ERROR: {
			const { job, mess } = action.error;
			const { AllBookedWeekDays, allEventsForCompany } = state;

			const jobForBookBar = {
				orderId: job.Id || job.orderId || job.OrderId,
				startTime: job.Start,
				endTime: job.End,
				status: job.OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer ? 1 : 2,
				lat: job.lat,
				lng: job.lng,
			}

			job.OrderStatus = ORDER_STATUS_TEXT.bookedWithCustomer;

			const foundIndex = allEventsForCompany.findIndex(element => (
				(element.Id || element.orderId || element.OrderId) === (job.Id || job.orderId || job.OrderId)
			));
			if (foundIndex) {
				allEventsForCompany[foundIndex] = job;
			}

			const foundDate = Object.keys(AllBookedWeekDays).find((date => (
				moment(date).isSame(job.Start, 'days')
			)));
			AllBookedWeekDays[foundDate].push(jobForBookBar);

			return {
				...state,
				isLoading: false,
				error: mess,
				AllBookedWeekDays,
				allEventsForCompany,
			}
		}
		case CLEAR_ALL_DATA: {
			return {
				today: now(),
				fromDate: startOf(now()),
				toDate: endOf(now()),
				minDate: minBookDate(),
				selectedDate: null,
				jobsForSelectedDate: null,
				isLoading: false,
				firstTimeLoading: false,
				error: null,
				allEventsForCompany: [],
				allAcceptedJobs: [],
				allFilteredJobs: [],
				AllBookedWeekDays: {},
				showWeekend: false,
				userNamesFilter: [],
			};
		}
		default:
			return state;
	}
}

const getJobsForSelectedDate = (jobs, date, installers) => {
	const jobsArr = [];
	jobs.forEach((job) => {
		if ((job.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer
			|| job.OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer)
			&& moment(job.Start).isSame(date, 'days') && installers.includes(job.ResourceName)) {
				jobsArr.push(job);
		}
	});
	return jobsArr;
}

const onUpdateJobsForWeek = (AllBookedWeekDays, newJob, oldJob) => {
	const newJobDate = moment(newJob.Start);
	const oldJobDate = moment(oldJob.Start);

	Object.keys(AllBookedWeekDays).forEach((date) => {
		let jobsForDate = AllBookedWeekDays[date];
		if (newJobDate.isSame(date, 'days')) {
			jobsForDate.push({
				orderId: newJob.Id || newJob.OrderId,
				startTime: newJob.Start,
				endTime: newJob.End,
				status: newJob.OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer ? 1 : 2,
				lat: newJob.lat,
				lng: newJob.lng,
			});
		}
		if (oldJobDate.isSame(date, 'days')) {
			jobsForDate.splice(jobsForDate.indexOf(oldJob), 1);
		}
	});
	return AllBookedWeekDays;
}

export default bookJobsReducer;
