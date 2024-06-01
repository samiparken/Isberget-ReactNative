import React, { Component } from 'react';
import {
  View, FlatList, SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import SearchListItem from '../../components/UI/SearchListItem';
import SearchHeader from '../../components/Headers/SearchHeader';
import SearchCalendar from '../../components/UI/SearchCalendar';
import {
  fetchDataSearchedOrders,
  clearSearchData,
} from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner';
import OrderDetailModal from '../../components/Modals/OrderDetailModal';
import theme from '../../config';
import { ORDER_STATUS_TEXT } from '../../api/constants';
import BookJobModal from '../../components/Modals/BookJobModal';
import { DATE_FORMAT } from '../../utils/DateHandler';
import deviceStorage from '../../services/deviceStorage';

class Search extends Component {
  constructor() {
    super();

    this.state = {
      searchInput: '',
      orderDetailVisible: false,
      dataToRenderForModal: '',
      currentDaysSelection: [],
      bookJobModalSelectedDay: null,
      calendarVisible: false,
      bookJobModalVisible: false,
      dataForJobModal: null,
      allInstallers: [], 
      searchedJobsIndexes: [],
      answersForDetailModal: [],
      checked: {
        accepted: false,
        notBookedWithCustomer: false,
        bookedWithCustomer: false,
        notAccpeted: false,
        completed: false,
      },
      searching: false,
    };
  }

  componentDidMount(){
    this.props.fetchDataSearchedOrders();
  }

  searchFields = [
    "Address",
    "AltPhone",
    "AltPhoneNumber",
    "PhoneNumber",
    "Phone",
    "Email",
    "Id",
    "OrderId",
    "Order_number_on_client",
    "order_number_on_client",
    "Description",
    "Title",
    "FullAdress",
    "FullName",
  ];

  onSearchPressed = () => {
    this.setState({
      searching: true,
      calendarVisible: false,
    });
    
    new Promise((resolve, reject)=>{
      let indexes = [];
      const allJobs = [...this.props.acceptData, ...this.props.bookData.allAcceptedJobs, ...this.props.searchData.searchedData];
  
      allJobs.forEach((job, index)=>{
        let isSearched = true;
  
        if (this.state.searchInput.length >= 1 && !this.filterByText(job)) {
          isSearched = false; 
        }
  
        if(this.state.currentDaysSelection.length > 0 && !this.filterByDate(job)){
          isSearched = false;
        }
  
        if(!this.filterByStatus(job)){
          isSearched = false;
        }
  
        if(isSearched){
          indexes.push(index);
        }
      });

      resolve(indexes);
      
    }).then((indexes)=>{
      this.setState({
        searchedJobsIndexes: [...indexes],
        searching: false,
      });
    });
  }

  filterByText = (job) => {
    let result = false;

    this.searchFields.forEach(field=>{
      if(job[field] && job[field].toString().includes(this.state.searchInput)){
        result = true;
      }
    });

    return result;
  }

  filterByDate = (job) => {
    let result = true;
    const date = job.Start ?? job.OrderCreatedAsDate;
    const dateMoment = moment(new Date(date));

    if(this.state.currentDaysSelection.length === 1){
      if(!dateMoment.isSame(this.state.currentDaysSelection[0], 'd')){
        result = false;
      }
    }
    else{
      if(dateMoment.isBefore(this.state.currentDaysSelection[0], 'd') 
        || dateMoment.isAfter(this.state.currentDaysSelection[1], 'd')){

        result = false;
      }
    }

    return result;
  }

  filterByStatus = (job) => {
    let result = true;
    const jobStatus = job.OrderStatus;
    const selectedStatus = Object.keys(this.state.checked).filter(key=>{
      return this.state.checked[key]
    }).map(key=>ORDER_STATUS_TEXT[key]);

    if(selectedStatus.length > 0 && !selectedStatus.includes(jobStatus)){
      result = false;
    }

    return result;
  }

  onSearchInputChanged = (value) => {
    this.setState({ 
      searchInput: value.trim(),
    });
  }

  onClearPressed = () => {
    this.setState({ 
      searchInput: '',  
      searchedJobsIndexes: [],
      checked: {
        accepted: false,
        notBookedWithCustomer: false,
        bookedWithCustomer: false,
        notAccpeted: false,
        completed: false,
      },
      currentDaysSelection: [],
    });
  }

  toggleOrderDetailModal = (data = '', answers = []) => {
    this.setState(prevState => ({
      orderDetailVisible: !prevState.orderDetailVisible,
      dataToRenderForModal: data,
      bookJobModalSelectedDay: null,
      answersForDetailModal: answers,
    }));
  }

  toggleCalendar = () => {
    this.setState(prevState => ({
      calendarVisible: !prevState.calendarVisible,
    }));
  }

  dateSelected = (dateString) => {
    if (dateString) {
      let date = moment(dateString);

      if(this.state.currentDaysSelection.length === 0 || this.state.currentDaysSelection.length === 2){
        this.setState({ currentDaysSelection: [date] });
      }
      else if(this.state.currentDaysSelection.length === 1){
        this.setState((prevState) => {
          if(date.isBefore(prevState.currentDaysSelection[0])){
            return { currentDaysSelection: [date, ...prevState.currentDaysSelection] }
          }
          else if(date.isSame(prevState.currentDaysSelection[0])){
            return { currentDaysSelection: [date] }
          }

          return { currentDaysSelection: [...prevState.currentDaysSelection, date] }
        });
      }
    }
  }

  onRebookJobSelected = async (data) => {
    if(this.props.connection.connectionState !== 'no'){
      const installers = await deviceStorage.getItem('usersInCompany');
      this.toggleBookJobModal(JSON.parse(installers), data);
    }
  }

  toggleBookJobModal = (installers, data) => {
    this.setState(prevState => ({
      bookJobModalVisible: !prevState.bookJobModalVisible,
      dataForJobModal: data,
      allInstallers: installers ?? [], 
      orderDetailVisible: false,
    }));
  }

  bookJobModalDateSelected = (dateString) => {
    if(dateString){
      this.setState({
        bookJobModalSelectedDay: dateString,
      });
    }
  }

  changeChecked = (id) => {
    this.setState(prevState=>({
      checked: {
        ...prevState.checked,
        [id]: !prevState.checked[id],
      }
    }));
  }

  render() {
    let bookedJobs = null;
    let jobsForList = null;

    if (this.props.bookData.allFilteredJobs) {
      bookedJobs = this.props.bookData.allFilteredJobs.filter(index => index.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer);
    }

    if(this.state.searchedJobsIndexes.length > 0){
      const allJobs = [...this.props.acceptData, ...this.props.bookData.allFilteredJobs, ...this.props.searchData.searchedData];
      jobsForList = allJobs.filter((job, index) => this.state.searchedJobsIndexes.includes(index));
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLOR_PRIMARY, paddingTop: 10 }}>
        <View style={{ flex: 1, backgroundColor: theme.COLOR_WHITE }}>
          <SearchHeader
            onPress={this.props.bookData.isLoading || this.props.searchData.isLoading || this.state.searching
                ? ()=>{} : this.onSearchPressed}
            toggleCalendar={() => this.toggleCalendar()}
            searchInput={this.state.searchInput}
            onSearchInputChanged={this.onSearchInputChanged}
            hasSelectedDates={this.state.currentDaysSelection.length > 0}
            checked={this.state.checked}
            changeChecked={this.changeChecked}
            onClear={this.onClearPressed}
          />
          {
            this.props.bookData.isLoading || this.props.searchData.isLoading || this.state.searching
              ? (
                <Spinner />
              )
              : (
                <View style={{ flex: 1 }}>
                  {
                    (this.state.calendarVisible && (
                        <SearchCalendar
                          selectedDates={this.state.currentDaysSelection}
                          dateSelected={this.dateSelected}
                        />
                      )
                    )
                  }
                  <FlatList
                    extraData={jobsForList}
                    data={jobsForList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <SearchListItem
                        onPress={this.toggleOrderDetailModal}
                        dataToRender={item}
                      />
                    )}
                  />
                </View>

              )
          }
          <OrderDetailModal
            visible={this.state.orderDetailVisible}
            toggleModal={this.toggleOrderDetailModal}
            products={this.state.dataToRenderForModal}
            showDeleteButton={false}
            onRebookJobSelected={this.onRebookJobSelected}
            answers={this.state.answersForDetailModal}
            componentId={this.props.componentId}
          />
          <BookJobModal
            visible={this.state.bookJobModalVisible}
            minDate={this.props.bookData.minDate}
            toggleModal={this.toggleBookJobModal}
            installerName={this.state.allInstallers}
            job={this.state.dataForJobModal}
            allBookedWeekDays={this.props.bookData.AllBookedWeekDays}
            selectedDate={
              moment(this.state.bookJobModalSelectedDay 
                ? this.state.bookJobModalSelectedDay 
                : this.state.dataForJobModal 
                  ? this.state.dataForJobModal.Start : '', DATE_FORMAT)
            }
            onToggleSelectedDate={this.bookJobModalDateSelected}
            bookedJobs={bookedJobs}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  searchData: state.searchOrder,
  bookData: state.bookJobs,
  connection: state.connection,
  acceptData: state.acceptJobs.allUnAcceptedJobs,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  fetchDataSearchedOrders: () => dispatch(fetchDataSearchedOrders()),
  onClearSearchData: () => dispatch(clearSearchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
