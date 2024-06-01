import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Linking,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';
import DefaultListView from '../../components/UI/DefaultListView';
import deviceStorage from '../../services/deviceStorage';
import RangeHeader from '../../components/Headers/RangeHeader';
import SubHeader from '../../components/Headers/SubHeader';
import {
  nextBookWeek,
  prevBookWeek,
  bookDateSelected,
  updateBookWeeks,
  fetchDataBookJobs,
  toggleShowWeekends,
  resetJobsForSelectedDate,
  fetchDataAcceptsJobs,
  onRemoveJob,
  onUpdateJobToBooked,
  setNoConnection,
  setFastConnection,
  setActivePage
} from '../../store/actions/index';
import OrderDetailModal from '../../components/Modals/OrderDetailModal';
import { NOTIFICATION_TYPES, ORDER_STATUS_TEXT } from '../../api/constants';
import AnimatedDrawerWithToggle from '../../components/AnimatedDrawerWithToggle';
import BookJobModal from '../../components/Modals/BookJobModal';
import Spinner from '../../components/UI/Spinner';
import theme from '../../config';
import Alert from '../../components/Helpers/Alert';
import DefaultMap from '../../components/Map/DefaultMap';
import { Navigation } from 'react-native-navigation';
import screens from '../../routes/screens';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";
import navigator from '../../routes/index';
import ErrorMessage from '../../components/Helpers/ErrorMessage/ErrorMessage';

const NotificationDuration = 5000;

const BookJobs = (props) => {
  const [state, setState] = useState({
    orderDetailVisible: false,
    region: null,
    orderDetailData: '',
    bookJobModalVisible: false,
    installerName: [],
    dataAboutCompany: null,
    selectedJob: null,
    refreshing: false,
    calendarVisible: false,
    shouldOpenBookModal: false,
    dateForBookModal: null,
    alertMessage: '',
    alertType: '',
    linkData: '',
    answersForDetailModal: [],
    hasNotificationData: true,
  });

  const [renderData, setRenderData] = useState({
    isFiltered: [],
    bookedJobs: [],
    jobsExists: false,
    allFilteredJobsHeader: {},
    currentLoc: null,
  });

  const flatListRef = useRef(null);
  const [mapRef, setMapRef] = useState(null);

  useEffect(()=>{
    const isFiltered = props.data.allFilteredJobs.filter(item => item.OrderStatus !== ORDER_STATUS_TEXT.completed);
    const bookedJobs = isFiltered.filter(index => index.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer);
    const jobsExists = addNotificationBadges();
    const allFilteredJobsHeader = renderAllCorrectFilterHeader();

    let currentLoc;
    if (state.region) {
      currentLoc = { latitude: state.region.latitude, longitude: state.region.longitude };
    }

    setRenderData({
      isFiltered: [...isFiltered],
      bookedJobs: [...bookedJobs],
      jobsExists: jobsExists,
      allFilteredJobsHeader: { ...allFilteredJobsHeader },
      currentLoc: { ...currentLoc },
    });
  }, [props.data.allFilteredJobs, props.data.AllBookedWeekDays, props.data.allAcceptedJobs]);

  useEffect(()=>{
    const bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
      props.onActivePage(selectedTabIndex);
      if((!props.auth.isInstaller && unselectedTabIndex === 2) || (props.auth.isInstaller && unselectedTabIndex === 1)){
        resetSelectedJob();
      }
    });

    deviceStorage.getItem('showWeekend').then((res)=>{
      props.fetchDataBookJobs(props.data.fromDate, res === '1');
    });
    
    const messageListener = messaging().onMessage((message) => {
      notificationListeners(message);
    });

    const unsubscribeNetListener = NetInfo.addEventListener(netState => {
      if(netState.isInternetReachable){
        props.onFastConnetion();
        showConnectionAlert();
      }
      else{
        props.onNoConnection();
        showNoConnectionAlert();
      }
    });

    Linking.getInitialURL().then(url => {
      if(url){
        handleURL(url);
      }
    });
    Linking.addEventListener('url', handleOpenURL);

    getCurrentPosition();

    return ()=>{
      bottomTabEventListener.remove();
      unsubscribeNetListener();
      messageListener();
      Linking.removeEventListener('url', handleOpenURL);
    }
  }, []);

  useEffect(()=>{
    if ((props.data.isLoading
      && props.data.firstTimeLoading
      && !state.refreshing) || props.data.error){
        return;
    }

    if(state.linkData !== ''){
      findAndSelectSpecificJob(state.linkData);
      setState({ ...state, linkData: '' });
      return;
    }
  }, [props.data.isLoading, props.data.firstTimeLoading, state.refreshing, props.data.error]);
  
  useEffect(()=>{
    if(props.notificationData && state.hasNotificationData && !props.data.isLoading){
      setState({
        ...state,
        hasNotificationData: false,
      });
      handleBckgroundNotification();
    }
  }, [props.notificationData, props.data.isLoading]);

  useEffect(()=>{
    if(props.selectJob){
      findAndSelectSpecificJob(props.selectJob.OrderId);
    }
  }, [props.selectJob, props.data.isLoading]);

  const handleOpenURL = (event) => {
    handleURL(event.url);
  }

  const handleURL = (url) => {
    Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN,{
      bottomTabs: {
        currentTabId: screens.BOOK_JOBS_SCREEN
      }
    });

    const alldata = url.split('/');
    const data = alldata[alldata.length - 1];

    setState({ ...state, linkData: data });
  }

  const showConnectionAlert = () => setState({...state, alertMessage: `Internet Connection Available/${moment()}`, alertType: 'success'});

  const showNoConnectionAlert = () => setState({...state, alertMessage: `No Internet Connection/${moment()}`, alertType: 'error'});

  const notificationListeners = (message) => {
    const {
      orderId, type, orderMessage, orderNumber,
    } = message.data;
    switch (type) {
      case NOTIFICATION_TYPES.jobAccepted:
        Toast.showWithGravity(`Order ${orderNumber} är nu bokad med kund!`, Toast.LONG, Toast.TOP);
        break;
      case NOTIFICATION_TYPES.jobCancelled:
        Toast.showWithGravity(`Order ${orderNumber} är borttagen!`, Toast.LONG, Toast.TOP);
        break;
      case NOTIFICATION_TYPES.jobUpdate:
        Toast.showWithGravity(`Nytt meddelande för order ${orderNumber}`, Toast.LONG, Toast.TOP);
        break;
      case NOTIFICATION_TYPES.newJobs:
        Toast.showWithGravity('Nya jobb finns tilldelade. Uppdatera flödet i acceptera vyn!', Toast.LONG, Toast.TOP);
        break;
    }

    handleRefresh();
  }

  const handleBckgroundNotification = () => {
    const data = props.notificationData;
    switch(data.type){
      case NOTIFICATION_TYPES.newJobs:
        //Give the data to the accept screen and go there
        Navigation.updateProps(screens.ACCEPT_JOBS_SCREEN + '_component', {
          notificationData: data,
        });
        Navigation.mergeOptions(screens.ACCEPT_JOBS_SCREEN,{
          bottomTabs: {
            currentTabId: screens.ACCEPT_JOBS_SCREEN
          }
        });
        break;

      case NOTIFICATION_TYPES.bookJob: 
        Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN,{
          bottomTabs: {
            currentTabId: screens.BOOK_JOBS_SCREEN
          }
        });
        
        findAndSelectSpecificJob(data.orderId, false, data.toBook);
        break;

      case NOTIFICATION_TYPES.jobAccepted: 
        Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN,{
          bottomTabs: {
            currentTabId: screens.BOOK_JOBS_SCREEN
          }
        });

        findAndSelectSpecificJob(data.orderId);
        break;

      case NOTIFICATION_TYPES.jobUpdate: 
        Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN,{
          bottomTabs: {
            currentTabId: screens.BOOK_JOBS_SCREEN
          }
        });
        
        findAndSelectSpecificJob(data.orderId, true);
        
        break;

      case NOTIFICATION_TYPES.jobCancelled: 
        break;

      default: break;
    }
  }

  const findAndSelectSpecificJob = (orderId, openDetailsModal, openCalendar) => {
    const order = props.data.allAcceptedJobs.find(el => el.OrderId === orderId);

    if(order){
      setTimeout(()=>{
        mapRef.animateToRegion({
          latitude: order.lat,
          longitude: order.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }, 1500);
        if(openCalendar){
          setState(prevState => ({
            ...prevState,
            calendarVisible: !prevState.calendarVisible,
            shouldOpenBookModal: true,
            selectedJob: order,
            dataAboutCompany: order,
          }));
        }
        else{
          setState({
            ...state,
            selectedJob: order,
          });
        }
      }, 500);

      if(openDetailsModal){
        toggleOrderDetailModal(order);
      }
    }
  }

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition((position) => {
      if (position) {
        setState({
          ...state,
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      }
    }, error => alert(JSON.stringify(error)),
    {
      timeout: 20000,
    });
  }

  const onPrevWeekPressed = () => {
    props.onPrevWeek(props.data, props.data.showWeekend);
  }

  const onNextWeekPressed = () => {
    props.onNextWeek(props.data, props.data.showWeekend);
  }

  const onListViewButtonPressed = (index, data, answers) => {
    switch (index) {
    case 0:
      toggleOrderDetailModal(data, answers);
      break;
    case 1:
      bringUpDialer(data.PhoneNumber || data.Phone);
      break;
    case 2:
      onBookJobSelected(data);
      break;
    default:
      break;
    }
  }

  const onBookJobSelected = async (data) => {
    if(props.connection.connectionState !== 'no'){
      if (props.data.selectedDate) {
        const installers = await deviceStorage.getItem('usersInCompany');
        toggleBookJobModal(JSON.parse(installers), data);
      } else {
        setState({ ...state, shouldOpenBookModal: true, dataAboutCompany: data });
        toggleCalendarModal();
      }
    }
    else{
      showNoConnectionAlert();
    }
  }

  const toggleOrderDetailModal = (data = '', answers = []) => {
    setState(prevState => ({
      ...prevState,
      orderDetailVisible: !prevState.orderDetailVisible,
      orderDetailData: data,
      answersForDetailModal: answers,
    }));
  }

  const toggleBookJobModal = (data = [], dataAboutCompany = null, date) => {
    if (data.length === 0 && !dataAboutCompany) {
      onToggleSelectedDate();
    } 

    setState(prevState => ({
      ...prevState,
      bookJobModalVisible: !prevState.bookJobModalVisible,
      installerName: data,
      dataAboutCompany: date ? prevState.dataAboutCompany : dataAboutCompany,
      dateForBookModal: date,
      shouldOpenBookModal: false,
    }));
  }

  const toggleCalendarModal = () => {
    setState(prevState => ({
      ...prevState,
      calendarVisible: !prevState.calendarVisible,
    }));
  }

  const onToggleSelectedDate = async (dateString) => {
    let date = null;
    if (dateString) {
      date = moment(dateString);

      if (date.isAfter(props.data.toDate)
        || date.isBefore(props.data.fromDate)) {
        props.onUpdateWeeks(dateString, props.data);
      }
      
      if(state.shouldOpenBookModal){
        const installers = await deviceStorage.getItem('usersInCompany');
        toggleBookJobModal(JSON.parse(installers), null, date);
      }
    } else {
      onMapResetSelected();
    }
    props.onDateSelected(date);
  }

  const handleRefresh = async () => {
    if(props.connection.connectionState !== 'no'){
      setState({ ...state, refreshing: true });
      const res = await deviceStorage.getItem('showWeekend');
      await props.fetchDataBookJobs(props.data.fromDate, res === '1');
      setState({ ...state, refreshing: false });
    }
    else{
      showNoConnectionAlert();
    }
  }

  const onRefreshPressed = async () => {
    if(props.connection.connectionState !== 'no'){
      const res = await deviceStorage.getItem('showWeekend');
      await props.fetchDataBookJobs(props.data.fromDate, res === '1');
    }
    else{
      showNoConnectionAlert();
    }
  }

  const onMarkerPressed = (job) => {
    setSelectedJob(job);
    if (job.OrderStatus === theme.ORDER_STATUS_NOT_ACCEPTED) {
      flatListRef.current.props.data.map((key, index) => {
        if (key === job) {
          flatListRef.current.scrollToIndex({ animated: true, index });
        }
      });
    }
  }

  const onListViewPress = (job) => {
    setSelectedJob(job);
  }

  const resetSelectedJob = () => {
    setState({ ...state, selectedJob: null });
    props.onResetJobsForSelectedDate();
    // props.onUpdateWeeks(now(), props.data);
    props.onDateSelected(null);
  }

  const onMapResetSelected = () => {
    const arr = [];
    const jobs = props.data.allEventsForCompany;
    jobs.map((value) => {
      arr.push({
        latitude: value.lat,
        longitude: value.lng,
      });
    });
    if (arr.length === 1) {
      mapRef.animateToRegion({
        ...arr[0],
        latitudeDelta: 0.6,
        longitudeDelta: 0.6,
      }, 1000);
    } else {
      mapRef.fitToCoordinates(arr, {
        edgePadding: {
          top: 16,
          right: 8,
          left: 8,
          bottom: props.data.allAcceptedJobs.length !== 0
            ? theme.HEIGHT_ANIMATED_DRAWER + 8 : 8,
        },
        animated: true,
      });
      if (state.selectedJob) {
        setState({ ...state, selectedJob: null });
      }
    }
  }

  const setSelectedJob = (job) => {
    if (state.selectedJob === job) {
      setState({
        ...state,
        selectedJob: null,
      });
      onMapResetSelected();
    } else {
      mapRef.animateToRegion({
        latitude: job.lat,
        longitude: job.lng,
        latitudeDelta: 0.6,
        longitudeDelta: 0.6,
      }, 1500);
      setState({
        ...state, 
        selectedJob: job,
      });
    }
  }

  const bringUpDialer = (phoneNr) => {
    Linking.canOpenURL(`tel:${phoneNr}`).then((supported) => {
      if (supported) {
        return Linking.openURL(`tel:${phoneNr}`);
      }
    }).catch(() => { });
  }

  const addNotificationBadges = () => {
    let jobsExists = false;
    if (props.data.allAcceptedJobs.length !== 0) {
      jobsExists = true;
      Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN, {
        bottomTab: {
          badge: props.data.allAcceptedJobs.length.toString(),
          badgeColor: 'red',
        }
      });
    } else {
      Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN, {
        bottomTab: {
          badge: '',
          badgeColor: 'red',
        }
      });
    }
    return jobsExists;
  }

  const goToSettings = () => {
    Navigation.push(props.componentId, {
      component:{
        name: screens.SETTINGS_SCREEN,
        options: {
          bottomTabs:{
            visible: false
          }
        }
      }
    });
  }

  const renderAllCorrectFilterHeader = () => {
    const objectWithData = {};
    if (props.data.allFilteredJobs.length > 0) {
      Object.keys(props.data.AllBookedWeekDays).map((date) => {
        const arrayData = props.data.AllBookedWeekDays[date];
        if (arrayData.length > 0 && Array.isArray(arrayData)) {
          if (arrayData[0]) {
            props.data.AllBookedWeekDays[date].map((index) => {
              props.data.allFilteredJobs.map((indexInner) => {
                const orderId = indexInner.Id || indexInner.OrderId;
                if (index.orderId === orderId) {
                  if (!objectWithData[date]) {
                    objectWithData[date] = [index];
                  } else {
                    const dateData = objectWithData[date];
                    dateData.push(index);
                    objectWithData[date] = dateData;
                  }
                }
              });
              if (!objectWithData[date]) {
                objectWithData[date] = [];
              }
            });
          } else {
            objectWithData[date] = [];
          }
        } else {
          objectWithData[date] = [];
        }
      });
    } else {
      Object.keys(props.data.AllBookedWeekDays).map((date) => {
        objectWithData[date] = [];
      });
    }
    return objectWithData;
  }
  
  if (props.data.isLoading && props.data.firstTimeLoading && !state.refreshing) {
    return <Spinner />;
  }

  if(props.data.error && props.data.error !== 'Network Error'){
    navigator.removeAllBadges();
    return <ErrorMessage message={props.data.error} goToSettings={goToSettings} onRefresh={onRefreshPressed} />
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {state.alertMessage !== '' ? 
        <Alert 
          message={state.alertMessage} 
          timeout={NotificationDuration} 
          type={state.alertType} 
        /> : null
      }
      <View style={styles.container}>
        <View>
          <RangeHeader
            onNextWeekPressed={onNextWeekPressed}
            onPrevWeekPressed={onPrevWeekPressed}
            onToggleSelectedDate={onToggleSelectedDate}
            dates={props.data}
            bookedJobs={renderData.bookedJobs}
            show
            selectedDate={props.data.selectedDate}
            showAdminFilter
            calendarVisible={state.calendarVisible}
            toggleCalendarModal={toggleCalendarModal}
          />
          <SubHeader
            dates={renderData.allFilteredJobsHeader}
            selectedDate={props.data.selectedDate}
            onToggleSelectedDate={onToggleSelectedDate}
          />
        </View>
        <DefaultMap
          onRef={ref => setMapRef(ref)}
          setSelectedJob={setSelectedJob}
          jobsForSelectedDate={props.data.jobsForSelectedDate}
          jobs={renderData.isFiltered}
          onMarkerPressed={onMarkerPressed}
          resetSelectedJob={resetSelectedJob}
          selectedJob={state.selectedJob}
          screen="book"
          jobsExists={renderData.jobsExists}
          region={state.region}
          onBookJobSelected={onBookJobSelected}
          toggleOrderDetailModal={toggleOrderDetailModal}
          onRefreshPressed={onRefreshPressed}
          goToSettings={goToSettings}
        />
        {
          renderData.jobsExists && (
            <AnimatedDrawerWithToggle>
              <View style={styles.wrapperFlatList}>
                <FlatList
                  style={styles.flatListContainer}
                  contentContainerStyle={styles.flatListContentContainer}
                  ref={flatListRef}
                  extraData={state.selectedJob}
                  data={(props.data.allAcceptedJobs.sort((el1, el2) => {
                    if(el1.Start && el2.Start){
                      return el1.Start > el2.Start;
                    }
                    return el1.OrderCreatedAsDate > el2.OrderCreatedAsDate
                  }))}
                  refreshControl={(
                    <RefreshControl
                      refreshing={state.refreshing}
                      onRefresh={handleRefresh}
                      title="Dra för att uppdatera"
                      tintColor="#fff"
                      titleColor="#fff"
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <DefaultListView
                      onButtonPress={onListViewButtonPressed}
                      icons={[
                        theme.ICON_INFO,
                        theme.ICON_PHONE_BLUE,
                        theme.ICON_CALENDAR,
                      ]}
                      dataToRender={item}
                      onListViewPress={onListViewPress}
                      index={index}
                      selected={state.selectedJob === item}
                      currentPosition={renderData.currentLoc}
                    />
                  )}
                />
              </View>
            </AnimatedDrawerWithToggle>
          )
        }
        <OrderDetailModal
          visible={state.orderDetailVisible}
          toggleModal={toggleOrderDetailModal}
          products={state.orderDetailData}
          showDeleteButton={false}
          answers={state.answersForDetailModal}
          componentId={props.componentId}
        />
        <BookJobModal
          visible={state.bookJobModalVisible}
          minDate={props.data.minDate}
          toggleModal={toggleBookJobModal}
          installerName={state.installerName}
          job={state.dataAboutCompany}
          allBookedWeekDays={props.data.AllBookedWeekDays}
          selectedDate={props.data.selectedDate}
          onToggleSelectedDate={onToggleSelectedDate}
          bookedJobs={renderData.bookedJobs}
          givenDate={state.dateForBookModal}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.COLOR_PRIMARY,
  },
  container: {
    flex: 1,
    backgroundColor: theme.COLOR_WHITE,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: theme.COLOR_PRIMARY_LIGHT,
    width: '96%',
  },
  flatListContentContainer: {
    paddingBottom: 64,
  },
  wrapperFlatList: {
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

const mapStateToProps = state => ({
  data: state.bookJobs,
  connection: state.connection,
  auth: state.auth,
  navigationState: state.navigationState,
});

const mapDispatchToProps = dispatch => ({
  onNextWeek: data => dispatch(nextBookWeek(data)),
  onPrevWeek: data => dispatch(prevBookWeek(data)),
  onDateSelected: selectedDate => dispatch(bookDateSelected(selectedDate)),
  onUpdateWeeks: (date, data) => dispatch(updateBookWeeks(date, data)),
  fetchDataBookJobs: (fromDate, showWeekend) => dispatch(fetchDataBookJobs(fromDate, showWeekend)),
  onToggleShowWeekend: () => dispatch(toggleShowWeekends()),
  onResetJobsForSelectedDate: () => dispatch(resetJobsForSelectedDate()),
  fetchDataAcceptsJobs: () => dispatch(fetchDataAcceptsJobs()),
  onRemoveJob: orderId => dispatch(onRemoveJob(orderId)),
  onUpdateJobToBooked: (orderId, data) => dispatch(onUpdateJobToBooked(orderId, data)),
  onNoConnection: () => dispatch(setNoConnection()),
  onFastConnetion: () => dispatch(setFastConnection()),
  onActivePage: (page) => dispatch(setActivePage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookJobs);
