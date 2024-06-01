import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  FlatList,
  Platform,
  Linking,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';
import DayHeader from '../../components/Headers/DayHeader';
import SubHeader from '../../components/Headers/SubHeader';
import DefaultListView from '../../components/UI/DefaultListView';
import OrderDetailModal from '../../components/Modals/OrderDetailModal';
import AnimatedDrawerWithToggle from '../../components/AnimatedDrawerWithToggle';
import ProtocolModal from '../../components/Modals/ProtocolModal/ProtocolModal';
import Spinner from '../../components/UI/Spinner';
import DefaultMap from '../../components/Map/DefaultMap';
import {
  nextBookWeek,
  prevBookWeek,
  bookDateSelected,
  updateBookWeeks,
  fetchDataBookJobs,
} from '../../store/actions/index';
import theme from '../../config';
import { now, DATE_FORMAT } from '../../utils/DateHandler';
import { ORDER_STATUS_TEXT } from '../../api/constants';
import deviceStorage from '../../services/deviceStorage';
import Alert from '../../components/Helpers/Alert';
import { Navigation } from 'react-native-navigation';
import screens from '../../routes/screens';
import Geolocation from '@react-native-community/geolocation';
import BookJobModal from '../../components/Modals/BookJobModal';
import ErrorMessage from '../../components/Helpers/ErrorMessage/ErrorMessage';

const NotificationDuration = 5000;

const TodaysJobs = (props) => {

  const [state, setState] = useState({
    region: null,
    dataToRenderForModal: '',
    orderDetailVisible: false,
    protocolModalVisible: false,
    protocolData: '',
    selectedJob: null,
    currentDay: now(),
    refreshing: false,
    bookJobModalVisible: false,
    dataForJobModal: null,
    allInstallers: [],
    alertMessage: '',
    alertType: '',
    answersForDetailModal: [],
  });

  const [renderData, setRenderData] = useState({
    allFilteredJobsHeader: {},
    jobsOfTheDay: [],
    pinsOfTheDay: [],
    bookedJobs: [],
    jobsExists: false,
    currentLoc: null,
  });

  const flatListRef = useRef(null);
  const [mapRef, setMapRef] = useState(null);
  const [noConnection, setNoConnection] = useState(false);

  useEffect(()=>{
    const isFiltered = props.data.allFilteredJobs;
    const allFilteredJobsHeader = renderAllCorrectFilterHeader();

    const jobsOfTheDay = isFiltered
      .filter(index => (
        (index.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer)
        && (moment(moment(index.Start)
          .format('YYYY-MM-DD'))
          .diff(state.currentDay, 'd') === 0)
      ));

    const pinsOfTheDay = isFiltered
      .filter(index => (
        (index.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer
        || index.OrderStatus === ORDER_STATUS_TEXT.completed
        || index.OrderStatus === ORDER_STATUS_TEXT.notBookedWithCustomer)
      && (moment(moment(index.Start)
        .format('YYYY-MM-DD'))
        .diff(state.currentDay, 'd') === 0)
      ));

    const bookedJobs = isFiltered.filter(index => index.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer);

    if (jobsOfTheDay.length !== 0) {
      Navigation.mergeOptions(screens.TODAYS_JOBS_SCREEN, {
        bottomTab: {
          badge: jobsOfTheDay.length.toString(),
          badgeColor: 'red',
        }
      });
    } else {
      Navigation.mergeOptions(screens.TODAYS_JOBS_SCREEN, {
        bottomTab: {
          badge: '',
          badgeColor: 'red',
        }
      });
    }
    const jobsExists = jobsOfTheDay.length !== 0;

    let currentLoc;
    if (state.region) {
      currentLoc = { latitude: state.region.latitude, longitude: state.region.longitude };
    }

    setRenderData({
      allFilteredJobsHeader: {...allFilteredJobsHeader},
      bookedJobs: [...bookedJobs],
      jobsOfTheDay: [...jobsOfTheDay],
      pinsOfTheDay: [...pinsOfTheDay],
      jobsExists: jobsExists,
      currentLoc: {...currentLoc},
    });
  }, [props.data.allFilteredJobs, props.data.AllBookedWeekDays, state.currentDay]);

  useEffect(()=>{
    const bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
      if(!props.auth.isInstaller && unselectedTabIndex === 3){
        resetSelectedJob();
      }
      else if(props.auth.isInstaller && unselectedTabIndex === 2){
        resetSelectedJob();
      }
    });
    
    const messageListener = messaging().onMessage((message) => {
      notificationListeners(message);
    });

    getCurrentPosition();

    return ()=>{
      bottomTabEventListener.remove();
      messageListener();
    }
  }, []);

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

  const showConnectionAlert = () => setState({ ...state, alertMessage: `Internet Connection Available/${moment()}`, alertType: 'success'});

  const showNoConnectionAlert = () => setState({ ...state, alertMessage: `No Internet Connection/${moment()}`, alertType: 'error'});

  const resetCurrentDate = () => {
    if (state.currentDay !== now()) {
      // props.onSetCurrentDate(now());
      setState({ ...state, currentDay: now() });
      props.onUpdateWeeks(now(), props.data);
    }
    if (state.selectedJob) {
      setState({ ...state, selectedJob: null });
    }
  }

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

  const onListViewButtonPressed = (index, data, answers) => {
    switch (index) {
    case 0:
      toggleOrderDetailModal(data, answers);
      break;
    case 1:
      if(props.connection.connectionState !== 'no'){
        toggleProtocolModal(data);
      }
      else{
        showNoConnectionAlert();
      }
      break;
    case 2:
      openNativeMaps(data);
      break;
    default:
      break;
    }
  }

  const toggleOrderDetailModal = (data = '', answers = []) => {
    setState(prevState => ({
      ...prevState, 
      orderDetailVisible: !prevState.orderDetailVisible,
      dataToRenderForModal: data,
      answersForDetailModal: answers,
    }));
  }

  const openNativeMaps = (data = '') => {
    Platform.select({
      ios: () => {
        Linking.openURL(`http://maps.apple.com/maps?daddr=${data.lat},${data.lng}`);
      },
      android: () => {
        Linking.openURL(`http://maps.google.com/maps?daddr=${data.lat},${data.lng}`);
      },
    })();
  }

  const toggleProtocolModal = (data = '', showAlert = false) => {
    setState(prevState => ({
      ...prevState, 
      protocolModalVisible: !prevState.protocolModalVisible,
      protocolData: data,
    }));
  }

  const onToggleSelectedDate = (dateString) => {
    let date = null;
    if (dateString) {
      date = moment(dateString);

      if (date.isAfter(props.data.toDate)
        || date.isBefore(props.data.fromDate)) {
        props.onUpdateWeeks(dateString, props.data);
      }
    }
    setState({ ...state, currentDay: dateString });
  }

  const getNextDay = (day) => {
    const newDay = moment(day);
    newDay.add(1, 'days');
    if (newDay.isAfter(props.data.toDate)) {
      newDay.add(2, 'days');
      props.onNextWeek(props.data, props.data.showWeekend);
    }
    setState({ ...state, currentDay: newDay.format('YYYY-MM-DD') });
  }

  const getPrevDay = (day) => {
    const newDay = moment(day);
    newDay.subtract(1, 'days');
    // if (newDay.isSameOrAfter(now())) {
    //   if (newDay.isBefore(props.data.fromDate)) {
    //     newDay.subtract(2, 'days');
    //     props.onPrevWeek(props.data, props.data.showWeekend);
    //   }
    //   setState({ currentDay: newDay.format('YYYY-MM-DD') });
    // }
    if (newDay.isBefore(props.data.fromDate)) {
      newDay.subtract(2, 'days');
      // props.onPrevWeek(props.data, props.data.showWeekend);
      props.onPrevWeek({ fromTodaysJob: true, ...props.data });
    }
    setState({ ...state, currentDay: newDay.format('YYYY-MM-DD') });
  }

  const onMarkerPressed = (job) => {
    setSelectedJob(job);
    if (job.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer) {
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

  const onRebookJobSelected = async (data) => {
    if(props.connection.connectionState !== 'no'){
      const installers = await deviceStorage.getItem('usersInCompany');
      toggleBookJobModal(JSON.parse(installers), data);
    }
    else{
      showNoConnectionAlert();
    }
  }

  const toggleBookJobModal = (installers, data) => {
    if(!data){
      resetCurrentDate();
    }

    setState(prevState => ({
      ...prevState, 
      bookJobModalVisible: !prevState.bookJobModalVisible,
      dataForJobModal: data,
      allInstallers: installers ?? [], 
      orderDetailVisible: false,
    }));
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

  if (props.data.isLoading
    && props.data.firstTimeLoading) {
    return <Spinner />;
  }

  if(props.data.error && props.data.error !== 'Network Error'){
    return <ErrorMessage message={props.data.error} goToSettings={goToSettings} onRefresh={onRefreshPressed} />
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLOR_PRIMARY }}>
      {state.alertMessage !== '' ? 
        <Alert 
          message={state.alertMessage} 
          timeout={NotificationDuration} 
          type={state.alertType} 
        /> : null
      }
      <View style={styles.container}>
        <View>
          <DayHeader
            prevDay={getPrevDay}
            nextDay={getNextDay}
            currentDate={state.currentDay}
            onToggleSelectedDate={onToggleSelectedDate}
            dates={props.data}
            jobs={renderData.bookedJobs}
            showAdminFilter
          />
          <SubHeader
            dates={renderData.allFilteredJobsHeader}
            selectedDate={state.currentDay}
            onToggleSelectedDate={onToggleSelectedDate}
            fromTodaysJobs
          />
        </View>
        <DefaultMap
          onRef={ref => setMapRef(ref)}
          setSelectedJob={setSelectedJob}
          jobs={renderData.pinsOfTheDay}
          onMarkerPressed={onMarkerPressed}
          resetSelectedJob={resetSelectedJob}
          selectedJob={state.selectedJob}
          screen="today"
          jobsExists={renderData.jobsExists}
          region={state.region}
          toggleOrderDetailModal={toggleOrderDetailModal}
          onRefreshPressed={onRefreshPressed}
          onBookJobSelected={onRebookJobSelected}
          goToSettings={goToSettings}
        />
        {
          renderData.jobsExists && (
            <AnimatedDrawerWithToggle>
              <View style={styles.wrapperFlatList}>
                <FlatList
                  style={styles.flatListContainer}
                  contentContainerStyle={styles.flatListContentContainer}
                  data={renderData.jobsOfTheDay.sort((el1, el2) => {
                    if(el1.Start && el2.Start){
                      return el1.Start > el2.Start;
                    }
                    return el1.OrderCreatedAsDate > el2.OrderCreatedAsDate
                  })}
                  keyExtractor={(item, index) => index.toString()}
                  ref={flatListRef}
                  extraData={state.selectedJob}
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
                      showTimeForJob
                      onButtonPress={onListViewButtonPressed}
                      icons={[
                        theme.ICON_INFO,
                        theme.ICON_PROTOCOL,
                        theme.ICON_CAR_BLUE,
                      ]}
                      dataToRender={item}
                      onListViewPress={onListViewPress}
                      index={index}
                      selected={state.selectedJob === item}
                      currentPosition={renderData.currentLoc}
                    />
                  )
                  }
                />
              </View>
            </AnimatedDrawerWithToggle>
          )
        }
        {
          renderData.jobsExists && (
            <OrderDetailModal
              visible={state.orderDetailVisible}
              toggleModal={toggleOrderDetailModal}
              products={state.dataToRenderForModal}
              showDeleteButton
              onRebookJobSelected={onRebookJobSelected}
              answers={state.answersForDetailModal}
              componentId={props.componentId}
            />
          )
        }
        {
          renderData.jobsExists && (
            <ProtocolModal
              toggleModal={toggleProtocolModal}
              visible={state.protocolModalVisible}
              job={state.protocolData}
              installerName={props.auth.email}
            />
          )
        }
      </View>
      <BookJobModal
        visible={state.bookJobModalVisible}
        minDate={props.data.minDate}
        toggleModal={toggleBookJobModal}
        installerName={state.allInstallers}
        job={state.dataForJobModal}
        allBookedWeekDays={props.data.AllBookedWeekDays}
        selectedDate={moment(state.currentDay, DATE_FORMAT)}
        onToggleSelectedDate={onToggleSelectedDate}
        bookedJobs={renderData.bookedJobs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
});

const mapDispatchToProps = dispatch => ({
  onNextWeek: data => dispatch(nextBookWeek(data)),
  onPrevWeek: data => dispatch(prevBookWeek(data)),
  onDateSelected: selectedDate => dispatch(bookDateSelected(selectedDate)),
  onUpdateWeeks: (date, data) => dispatch(updateBookWeeks(date, data)),
  fetchDataBookJobs: (fromDate, showWeekend) => dispatch(fetchDataBookJobs(fromDate, showWeekend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodaysJobs);
