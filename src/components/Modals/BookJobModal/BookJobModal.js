import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addHours, convertDateToTime } from '../../../utils/DateHandler';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import BookJobAgenda from './BookJobAgenda';
import {
	bookCalendarJob,
	updateJob,
} from '../../../store/actions/index';
import { API_ENDPOINTS, ORDER_STATUS_TEXT } from '../../../api/constants';
import BookJobModalButton from './BookJobModalButton';
import theme from '../../../config';
import DefaultModal from '../DefaultModal';
import CalendarModal from '../../Modals/CalendarModal';
import Icon from 'react-native-vector-icons/MaterialIcons';

const roundedUp = Math.ceil(moment().minute() / 15) * 15;
const buttons = ["Bokad", "Förslag"];
const changeBookingButtons = ["Ändra Bokning", "Förslag"];

class BookJobModal extends React.Component {
	constructor(props) {
		super(props);
		
		const startDate = moment().minute(roundedUp).second(0);
		const HOURS_TO_ADD = 3;

    	this.state = {
			startDate: startDate,
			showStartDatePicker: false,
			endDate: addHours(startDate, HOURS_TO_ADD),
			showEndDatePicker: false,
			showAlert: false,
			selectedInstaller: '',
			hoursToBook: HOURS_TO_ADD,
			calendarVisible: false,
			indexUser: 0,
    	}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.job && this.props.job) {
			const { Start, End } = this.props.job;
			let index;
			if(this.props.job.ResourceId){
				index = this.props.installerName.findIndex(
					value => value.userId === +this.props.job.ResourceId
				);
			}

			if (Start && End) {
				this.setState({
					startDate: moment(Start),
					endDate: moment(End),
					selectedInstaller: this.props.job.ResourceId 
						? +this.props.job.ResourceId 
						: '',
					indexUser: index ?? 0,
				});
			}
		}
	}

	toggleCalendarModal = () => {
		this.setState(prevState => ({ calendarVisible: !prevState.calendarVisible }));
	}

	onNewDateSelected = (newDate, isEndTime = false) => {
		if (newDate === undefined) {
			this.setState({ showEndDatePicker: false, showStartDatePicker: false });
			return;
		}

		const dateSplit = newDate.split(':');
		let hours = parseInt(dateSplit[0]);
		const min = parseInt(dateSplit[1]);
		let showAlert = false;

		if(hours > 18) hours = 18;
		if(hours < 7) hours = 7; 
		const date = moment(this.props.date).set({
		'hour': hours,
		'minute': min
		});
		
		if (isEndTime && moment(this.state.startDate).diff(date, 's') >= 0) {
		showAlert = true;
		}

		let diff = 0;
		if (isEndTime) {
		diff = date.diff(this.state.startDate, 'minutes');
		diff = Math.ceil(diff / 60);
		} else {
		diff = moment(this.state.endDate).diff(date, 'minutes');
		diff = Math.ceil(diff / 60);
		}

		if (!isEndTime) {
		this.setState({
			startDate: date,
			endDate: addHours(date, date.minutes() > 0 ?
			this.state.hoursToBook + 1 : this.state.hoursToBook),
			showAlert,
			hoursToBook: diff,
			showEndDatePicker: false, 
			showStartDatePicker: false
		});
		} else {
		this.setState({
			endDate: date,
			showAlert,
			hoursToBook: diff,
			showEndDatePicker: false, 
			showStartDatePicker: false
		});
		}
	}

	onTimeSlotSelected = (date) => {
		this.setState({
			startDate: date,
			endDate: addHours(date, this.state.hoursToBook),
		});
	}

  	onConfirmBookingInCalendar = async (endpoint, index) => {
		const startDate = this.props.selectedDate.set({
				'hours': convertDateToTime(this.state.startDate).split(":")[0],
				'minutes': convertDateToTime(this.state.startDate).split(":")[1],
				'seconds': 0,
		}).format('YYYY-MM-DD HH:mm:ss');

		const endDate = this.props.selectedDate.set({
				'hours': convertDateToTime(this.state.endDate).split(":")[0],
				'minutes': convertDateToTime(this.state.endDate).split(":")[1],
				'seconds': 0,
		}).format('YYYY-MM-DD HH:mm:ss');

		const userAndInstallid = this.state.selectedInstaller != '' ? this.state.selectedInstaller : this.props.installerName[0].userId;
		const userName = this.props.installerName[this.state.indexUser].userDisplayName;
		const parameters = {
		'param1': this.props.job.OrderId || this.props.job.Id || this.props.job.orderId,
		'param2': this.props.job.Task_Company_Id,
		'param3': userAndInstallid,
		'param4': userAndInstallid,
		'param5': startDate,
		'param6': endDate,
		}
		this.props.bookCalendarJob(parameters, this.props.job, endpoint, this.props.allBookedWeekDays, userName);
		this.props.toggleModal();
	}
	
	onUpdateJob = async (orderStatusId) => {
		const { selectedDate, job } = this.props;
		const { startDate, endDate } = this.state;

		const start = selectedDate.set({
			'hours': convertDateToTime(startDate).split(":")[0],
			'minutes': convertDateToTime(startDate).split(":")[1],
			'seconds': 0,
    	}).format('YYYY-MM-DDTHH:mm');

    	const end = selectedDate.set({
			'hours': convertDateToTime(endDate).split(":")[0],
			'minutes': convertDateToTime(endDate).split(":")[1],
			'seconds': 0,
		}).format('YYYY-MM-DDTHH:mm');
		
		const query = {
			'param[start]': start,
			'param[end]': end,
			'param[date]': selectedDate.format('YYYY-MM-DD'),
			'param[resourceId]': parseInt(job.ResourceId),
			'param[orderId]': job.Id || job.orderId || job.OrderId,
			'param[orderStatusId]': orderStatusId,
		}

		console.log(query);
		
		this.props.onUpdateJob(query, job);
		this.props.toggleModal();
	}

  	onConfirmBookingSelected = (index) => {
		const { OrderStatus } = this.props.job;
		if (OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer
			|| OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer) {
				const orderStatusId = index === 0 ? 11 : 4;
				this.onUpdateJob(orderStatusId);
		} else {
			switch (index) {
				case 0:
					this.onConfirmBookingInCalendar(API_ENDPOINTS.BookJobConfirmedCustomer, index);
					break;
				case 1:
					this.onConfirmBookingInCalendar(API_ENDPOINTS.SendCustomerBookingProposal, index);
					break;
				default: 
					break;
			}
		}
  	}

	getBookedJobsForSelectedDate = () => {
		let jobs = [];
		Object.keys(this.props.allBookedWeekDays).map(index => {
		if (moment(index).diff(this.props.selectedDate, 'd') === 0) {
			jobs = this.props.allBookedWeekDays[index];
		}
		});
		
		if(this.props.job && this.props.job.ResourceId){
			jobs = jobs.filter(job => job.orderId !== this.props.job.Id);
		}

		return jobs;
	}

  timeFromString = (time) => {
	const dateSplit = time.split(':');
    const hours = dateSplit[0];
	const min = dateSplit[1];
	
	return `${hours}:${min}`
  }

  getTimePicker = (isEndTime) => <DateTimePicker
		value={isEndTime ? this.state.endDate.toDate() : this.state.startDate.toDate()}
		mode="time"
		is24Hour
		minuteInterval={15}
		onChange={(event, date) => {
			this.onNewDateSelected(date ? date.toLocaleTimeString() : undefined, isEndTime);
		}}
	/>

  	render() {
      	return (
			<DefaultModal
				bookJobModal
				visible={this.props.visible}
				toggleModal={() => this.props.toggleModal()}
				toggleCalendarModal={this.toggleCalendarModal}
				animationType="slide"
				headerText={this.props.selectedDate
					? this.props.selectedDate.format("YYYY-MM-DD") : 
					this.props.givenDate ? this.props.givenDate.format("YYYY-MM-DD") : ''}
			>
				<CalendarModal
					minDate={this.props.minDate}
					selectedDate={this.props.selectedDate ?? this.props.givenDate}
					toggleModal={this.toggleCalendarModal}
					visible={this.state.calendarVisible}
					dateSelected={this.props.onToggleSelectedDate}
					jobs={this.props.bookedJobs}
				/>
				<View style={styles.innerMainContainer}>
					<View style={styles.innerLeftContainer}>
						<View>
							<View style={{ flexDirection: 'row' }}>
								<Text style={styles.pickerTitle}>{"Start:"}</Text>
								<Text style={styles.pickerTitle}>
									{this.timeFromString(this.state.startDate.toDate().toLocaleTimeString())}
								</Text>
								<TouchableWithoutFeedback onPress={()=>this.setState({ showStartDatePicker: true })}>
									<Icon style={{ marginLeft: 5, marginTop: 5 }} name='update' size={26} color='black' />
								</TouchableWithoutFeedback>
							</View>
							{this.state.showStartDatePicker && this.getTimePicker(false)}
							<View style={{ flexDirection: 'row' }}>
								<Text style={styles.pickerTitle}>{"Slut:"}</Text>
								<Text style={styles.pickerTitle}>
									{this.timeFromString(this.state.endDate.toDate().toLocaleTimeString())}
								</Text>
								<TouchableWithoutFeedback onPress={()=>this.setState({ showEndDatePicker: true })}>
									<Icon style={{ marginLeft: 5, marginTop: 5 }} name='update' size={26} color='black' />
								</TouchableWithoutFeedback>
							</View>
							{this.state.showEndDatePicker && this.getTimePicker(true)}
						</View>    
						{this.state.showAlert && (
							<Text style={styles.alertText}>{"Sluttiden måste vara senare än starttiden"}</Text>
						)}
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTitle}>{"Välj installator:"}</Text>
							<Picker
								selectedValue={this.state.selectedInstaller}
								style={styles.picker}
								onValueChange={(itemValue, position) => {
									this.setState({ selectedInstaller: itemValue, indexUser: position });
								}}
							>
								{
									this.props.installerName.map((value, index) => (
										<Picker.Item 
											label={value.userDisplayName} 
											value={value.userId} 
											key={index}
										/>
									))
								}
							</Picker>
						</View>
					</View>
					<View style={styles.agendaContainer}>
						<BookJobAgenda
							onTimeSlotSelected={this.onTimeSlotSelected}
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							jobs={this.getBookedJobsForSelectedDate()}
						/>
					</View>
				</View>
				<View style={styles.buttonsContainer}>
					{
						this.props.job && this.props.job.ResourceId 
						? changeBookingButtons.map((item, index) => (
							<BookJobModalButton
								key={index}
								index={index}
								onPress={this.onConfirmBookingSelected}
								text={item}
							/>
						))
						: buttons.map((item, index) => (
							<BookJobModalButton
								key={index}
								index={index}
								onPress={this.onConfirmBookingSelected}
								text={item}
							/>
						))
					}
				</View>
			</DefaultModal>
    	)
 	}
}

const styles = StyleSheet.create({
  backgroundContainer: {
		backgroundColor: theme.COLOR_MODAL_BACKGROUND,
		flex: 1,
  },
  modalContainer: {
		flex: 1,
	},
  container: {
		flexDirection: 'column',
		flex: 1,
		marginHorizontal: 20,
		marginVertical: 40,
		padding: 10,
		backgroundColor: theme.COLOR_WHITE,
		borderRadius: 12,
  },
  innerMainContainer: {
		flex: 1,
		flexDirection: 'row',
  },
  innerLeftContainer: {
		flex: 1,
		paddingLeft: 20,
  },
  agendaContainer: {
		width: 100,
  },
  buttonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: 10,
  },
  button: {
		height: 40,
		flex: 1,
		backgroundColor: theme.COLOR_PRIMARY,
		borderRadius: 2,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 3,
  },
  buttonText: {
		fontSize: 16,
		color: theme.COLOR_WHITE,
  },
  pickerTitle: {
		fontSize: 18,
		marginVertical: 5,
		paddingLeft: 3,
  },
  alertText: {
		fontSize: 14,
		color: theme.COLOR_RED,
		marginTop: 5,
		marginRight: 5,
  },
  pickerContainer: {
		marginTop: 20,
  },
  picker: {
		height: 40,
		width: '80%',
  }
});

const mapDispatchToProps = dispatch => ({
	bookCalendarJob: (parameters, data, endpoint, allBookedWeekDays, userName) => {
		dispatch(bookCalendarJob(parameters, data, endpoint, allBookedWeekDays, userName))
	},
	onUpdateJob: (query, oldJob) => dispatch(updateJob(query, oldJob)),
});

export default connect(null, mapDispatchToProps)(BookJobModal);
