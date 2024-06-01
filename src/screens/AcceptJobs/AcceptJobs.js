import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {
  nextAccWeek,
  prevAccWeek,
  accDateSelected,
  updateAccWeeks,
  fetchDataAcceptsJobs,
  onAcceptJob,
  onUpdateOrderStatus,
  updateToDate,
  fetchDataBookJobs,
  onUpdateJobToBooked,
  onRemoveJob,
} from '../../store/actions/index';
import theme from '../../config';
import RangeHeader from '../../components/Headers/RangeHeader';
import DefaultListView from '../../components/UI/DefaultListView';
import OrderDetailModal from '../../components/Modals/OrderDetailModal';
import AnimatedDrawerWithToggle from '../../components/AnimatedDrawerWithToggle/AnimatedDrawerWithToggle';
import deviceStorage from '../../services/deviceStorage';
import Spinner from '../../components/UI/Spinner';
import DeclineJobModal from '../../components/Modals/DeclineJobModal';
import DefaultMap from '../../components/Map/DefaultMap';
import Geolocation from '@react-native-community/geolocation';
import screens from '../../routes/screens';
import { Navigation } from 'react-native-navigation';
import Alert from '../../components/Helpers/Alert';
import ErrorMessage from '../../components/Helpers/ErrorMessage/ErrorMessage';

const NotificationDuration = 5000;

const AcceptJobs = (props) => {
  const [state, setState] = useState({
    region: null,
    dataToRenderForModal: '',
    orderDetailVisible: false,
    declineJobVisible: false,
    selectedJob: null,
    refreshing: false,
    calendarVisible: false,
    alertMessage: '',
    alertType: '',
    answersForDetailModal: [],
    hasNotificationData: true,
  });

  const [renderData, setRenderData] = useState({
    concatData: [],
    bookedJobs: [],
    jobsExists: false,
    currentLoc: null,
  });

  const flatListRef = useRef(null);
  const [mapRef, setMapRef] = useState(null);
  const [noConnection, setNoConnection] = useState(false);

  useEffect(()=>{
    const concatData = props.data.allUnAcceptedJobs.concat(props.dataWithAllEvents.allEventsForCompany);
    const bookedJobs = props.dataWithAllEvents.allEventsForCompany
      .filter(index => index.OrderStatus === theme.ORDER_STATUS_BOOKED);

    if (props.data.allUnAcceptedJobs.length !== 0) {
      Navigation.mergeOptions(screens.ACCEPT_JOBS_SCREEN, {
        bottomTab: {
          badge: props.data.allUnAcceptedJobs.length.toString(),
          badgeColor: 'red',
        }
      });
    } else {
      Navigation.mergeOptions(screens.ACCEPT_JOBS_SCREEN, {
        bottomTab: {
          badge: '',
          badgeColor: 'red',
        }
      });
    }
    const jobsExists = props.data.allUnAcceptedJobs.length !== 0;

    let currentLoc;
    if (state.region) {
      currentLoc = { latitude: state.region.latitude, longitude: state.region.longitude };
    }

    setRenderData({
      concatData: [...concatData],
      bookedJobs: [...bookedJobs],
      jobsExists: jobsExists,
      currentLoc: { ...currentLoc },
    });
  }, [props.dataWithAllEvents.allEventsForCompany, props.data.allUnAcceptedJobs]);

  useEffect(()=>{
    const messageListener = messaging().onMessage((message) => {
      notificationListeners(message);
    });

    const bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
      if(unselectedTabIndex === 1){
        resetSelectedJob();
      }
    });

    deviceStorage.getItem('showWeekend').then(shouldShowWeekDay=>{
      if (shouldShowWeekDay) {
        props.onUpdateAccToDate(shouldShowWeekDay === '1');
      }
      props.fetchDataAcceptsJobs();
    });

    getCurrentPosition();
    
    return ()=>{
      bottomTabEventListener.remove();
      messageListener();
    }
  }, []);

  useEffect(()=>{
    if(props.notificationData && state.hasNotificationData && !props.data.isLoading){
      setState({
        ...state,
        hasNotificationData: false,
      });
      handleBackgroundNotification(props.notificationData);
    }
  }, [props.notificationData, props.data.isLoading]);

  useEffect(()=>{
    if(props.connection.connectionState === 'no'){
      showNoConnectionAlert();
      setNoConnection(true);
    }
    else if(noConnection){
      showConnectionAlert();
      setNoConnection(false);
    }

  }, [props.connection.connectionState]);

  useEffect(()=>{
    if(props.selectJob){
      findAndSelectSpecificJob(props.selectJob.OrderId);
    }
  }, [props.selectJob, props.data.isLoading]);

  const findAndSelectSpecificJob = (orderId) => {
    const order = props.data.allUnAcceptedJobs.find(el => el.OrderId === orderId);

    if(order){
      setTimeout(()=>{
        mapRef.animateToRegion({
          latitude: order.lat,
          longitude: order.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }, 1500);
        setState({
          ...state,
          selectedJob: order,
        });
      }, 500);
    }
  }

  const handleBackgroundNotification = () => {
    const orderId = props.notificationData.orderId;
    const orders = props.data.allUnAcceptedJobs;
    const orderIndex = Object.keys(orders).find(index => (
      (orders[index].Id && orders[index].Id.toString() === orderId) 
      || (orders[index].OrderId && orders[index].OrderId.toString() === orderId)
    ));

    if(orderIndex){
      setTimeout(()=>{
        setState({
          ...state,
          selectedJob: orders[orderIndex],
        });
        mapRef.animateToRegion({
          latitude: orders[orderIndex].lat,
          longitude: orders[orderIndex].lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }, 1500);
      }, 500); // make sure the map is initiallized
    }
  }

  const showConnectionAlert = () => setState({...state, alertMessage: `Internet Connection Available/${moment()}`, alertType: 'success'});

  const showNoConnectionAlert = () => setState({...state, alertMessage: `No Internet Connection/${moment()}`, alertType: 'error'});

  const notificationListeners = (message) => {
    const {
      orderId, type, orderMessage, orderNumber,
    } = message.data;
    switch (type) {
      case 'jobAccepted':
        Toast.showWithGravity(`Order ${orderNumber} är nu bokad med kund!`, Toast.LONG, Toast.TOP);
        break;
      case 'jobCancelled':
        Toast.showWithGravity(`Order ${orderNumber} är borttagen!`, Toast.LONG, Toast.TOP);
        break;
      case 'jobUpdate':
        Toast.showWithGravity(`Nytt meddelande för order ${orderNumber}`, Toast.LONG, Toast.TOP);
        break;
      case 'newJobs':
        Toast.showWithGravity('Nya jobb finns tilldelade. Uppdatera flödet i acceptera vyn!', Toast.LONG, Toast.TOP);
        break;
    }

    handleRefresh();
  }

  const getCurrentPosition = () => {
    try {
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
    } catch (e) {
      console.log(e);
    }
  }

  const handleRefresh = async () => {
    if(props.connection.connectionState !== 'no'){
      setState({ ...state, refreshing: true });
      const shouldShowWeekDay = await deviceStorage.getItem('showWeekend');
      if (shouldShowWeekDay) {
        props.onUpdateAccToDate(shouldShowWeekDay === '1');
      }
      await props.fetchDataAcceptsJobs();
      setState({ ...state, refreshing: false });
    }
    else{
      showNoConnectionAlert();
    }
  }

  const onRefreshPressed = async () => {
    if(props.connection.connectionState !== 'no'){
      const shouldShowWeekDay = await deviceStorage.getItem('showWeekend');
      if (shouldShowWeekDay) {
        props.onUpdateAccToDate(shouldShowWeekDay === '1');
      }
      await props.fetchDataAcceptsJobs();
    }
    else{
      showNoConnectionAlert();
    }
  }

  const onPrevWeekPressed = () => {
    props.onPrevWeek(props.data);
  }

  const onNextWeekPressed = () => {
    props.onNextWeek(props.data);
  }

  const onToggleSelectedDate = (dateString) => {
    let date = null;
    if (dateString) {
      date = moment(dateString);

      if (date.isAfter(props.data.toDate) || date.isBefore(props.data.fromDate)) {
        props.onUpdateWeeks(dateString, props.data);
      }
      if (state.showNoDateSelectedAlert) {
        setState({ ...state, showNoDateSelectedAlert: false });
      }
    }
    props.onDateSelected(date);
  }

  const toggleCalendarModal = () => {
    setState(prevState => ({
      ...prevState,
      calendarVisible: !prevState.calendarVisible,
    }));
  }

  const onMarkerPressed = (job) => {
    setSelectedJob(job);
    if (job.OrderStatus === theme.ORDER_STATUS_NOT_ACCEPTED && flatListRef) {
      flatListRef.current.props.data.map((key, index) => {
        if (key === job) {
          flatListRef.current.scrollToIndex({ animated: true, index });
        }
      });
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
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 1500);
      setState({
        ...state,
        selectedJob: job,
      });
    }
  }

  const onListViewButtonPressed = (index, data, answers) => {
    switch (index) {
    case 0:
      if(props.connection.connectionState !== 'no'){
        setState({ ...state, selectedJob: null });
        toggleDeclineJobModal(data);
      }
      else{
        showNoConnectionAlert();
      }
      break;
    case 1:
      toggleOrderDetailModal(data, answers);
      break;
    case 2:
      if(props.connection.connectionState !== 'no'){
        setState({ ...state, selectedJob: null });
        deviceStorage.getItem('user_id').then((id) => {
          props.onAcceptJob(data.OrderId, id, index);
          props.onUpdateOrderStatus(data);
        });
      }
      else{
        showNoConnectionAlert();
      }
      break;
    default:
      alert('Selection was not recognised');
      break;
    }
  }

  const toggleDeclineJobModal = (data = '') => {
    setState(prevState => ({
      ...prevState,
      declineJobVisible: !prevState.declineJobVisible,
      dataToRenderForModal: data,
    }));
  }

  const toggleOrderDetailModal = (data = '', answers = []) => {
    setState(prevState => ({
      ...prevState,
      orderDetailVisible: !prevState.orderDetailVisible,
      dataToRenderForModal: data,
      answersForDetailModal: answers
    }));
  }

  const onListViewPress = (job) => {
    setSelectedJob(job);
  }

  const resetSelectedJob = () => {
    setState({ ...state, selectedJob: null });
  }

  const onMapResetSelected = () => {
    const arr = [];
    const jobs = props.data.allUnAcceptedJobs.concat(props.dataWithAllEvents.allEventsForCompany);

    jobs.map((value) => {
      arr.push({
        latitude: value.lat,
        longitude: value.lng,
      });
    });
    if (arr.length === 1) {
      mapRef.animateToRegion({
        ...arr[0],
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      }, 1000);
    } else {
      mapRef.fitToCoordinates(arr, {
        edgePadding: {
          top: 16,
          right: 8,
          left: 8,
          bottom: theme.HEIGHT_ANIMATED_DRAWER + 8,
        },
        animated: true,
      });
      if (state.selectedJob) {
        setState({ ...state, selectedJob: null });
      }
    }
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

  if (props.data.isLoading && props.data.firstTimeLoading && !state.refreshing) {
    return <Spinner />;
  }

  if(props.data.error && props.data.error !== 'Network Error'){
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
        <RangeHeader
          onNextWeekPressed={onNextWeekPressed}
          onPrevWeekPressed={onPrevWeekPressed}
          onToggleSelectedDate={onToggleSelectedDate}
          dates={props.data}
          bookedJobs={renderData.bookedJobs}
          selectedDate={props.data.selectedDate}
          calendarVisible={state.calendarVisible}
          toggleCalendarModal={toggleCalendarModal}
        />
        <DefaultMap
          onRef={ref => setMapRef(ref)}
          setSelectedJob={setSelectedJob}
          jobs={renderData.concatData}
          onMarkerPressed={onMarkerPressed}
          resetSelectedJob={resetSelectedJob}
          selectedJob={state.selectedJob}
          screen="accept"
          jobsExists={renderData.jobsExists}
          region={state.region}
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
                  data={props.data.allUnAcceptedJobs.sort((el1, el2) => {
                    if(el1.Start && el2.Start){
                      return el1.Start > el2.Start;
                    }
                    return el1.OrderCreatedAsDate > el2.OrderCreatedAsDate
                  })}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={state.selectedJob}
                  ref={flatListRef}
                  refreshControl={(
                    <RefreshControl
                      refreshing={state.refreshing}
                      onRefresh={handleRefresh}
                      title="Dra för att uppdatera"
                      tintColor="#fff"
                      titleColor="#fff"
                    />
                  )}
                  renderItem={({ item, index }) => (
                    <DefaultListView
                      onButtonPress={onListViewButtonPressed}
                      icons={[
                        theme.ICON_DECLINE,
                        theme.ICON_INFO,
                        theme.ICON_CHECK,
                      ]}
                      dataToRender={item}
                      onListViewPress={onListViewPress}
                      index={index}
                      selected={state.selectedJob === item}
                      currentPosition={renderData.currentLoc}
                      fromAcceptcreen
                    />
                  )}
                />
              </View>
            </AnimatedDrawerWithToggle>
          )
        }
        {
          renderData.jobsExists && (
            <DeclineJobModal
              visible={state.declineJobVisible}
              data={state.dataToRenderForModal}
              toggleModal={toggleDeclineJobModal}
            />
          )
        }
        <OrderDetailModal
          visible={state.orderDetailVisible}
          toggleModal={toggleOrderDetailModal}
          products={state.dataToRenderForModal}
          showDeleteButton={false}
          answers={state.answersForDetailModal}
          componentId={props.componentId}
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
  data: state.acceptJobs,
  dataWithAllEvents: state.bookJobs,
  connection: state.connection,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  onNextWeek: ({ fromDate, toDate }) => dispatch(nextAccWeek({ fromDate, toDate })),
  onPrevWeek: ({ fromDate, toDate }) => dispatch(prevAccWeek({ fromDate, toDate })),
  onDateSelected: selectedDate => dispatch(accDateSelected(selectedDate)),
  onUpdateWeeks: date => dispatch(updateAccWeeks(date)),
  fetchDataAcceptsJobs: () => dispatch(fetchDataAcceptsJobs()),
  onAcceptJob: (orderId, userId) => dispatch(onAcceptJob(orderId, userId)),
  onUpdateOrderStatus: data => dispatch(onUpdateOrderStatus(data)),
  onUpdateAccToDate: showWeekend => dispatch(updateToDate(showWeekend)),
  onFetchDataBookJobs: (fromDate, showWeekend) => { dispatch(fetchDataBookJobs(fromDate, showWeekend)); },
  onUpdateJobToBooked: (orderId, data) => dispatch(onUpdateJobToBooked(orderId, data)),
  onRemoveJob: orderId => dispatch(onRemoveJob(orderId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AcceptJobs);
