import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import MapView from 'react-native-maps';
import theme from '../../../config';
import DefaultMarker from '../DefaultMarker';
import { ORDER_STATUS_TEXT } from '../../../api/constants';
import MapFilterIcon from '../MapFilterIcon';
import MapActionButton from '../MapActionButton';
import CustomCallout from '../CustomCallOut';

const IS_IOS = Platform.OS === 'ios';

const DefaultMap = (props) => {
  const [state, setState] = useState({
    selectedFilters: [
      ORDER_STATUS_TEXT.accepted,
      ORDER_STATUS_TEXT.notAccpeted,
      ORDER_STATUS_TEXT.bookedWithCustomer,
      ORDER_STATUS_TEXT.notBookedWithCustomer,
      ORDER_STATUS_TEXT.completed,
    ],
    calloutVisible: false,
    filteredJobs: [],
  });

  const mapRef = useRef(null);

  useEffect(()=>{
    if(props.jobsForSelectedDate && props.jobsForSelectedDate.length > 0 && mapRef){
      const arr = props.jobsForSelectedDate.map(value => ({
        latitude: value.lat,
        longitude: value.lng,
      }));
      if (arr.length === 1) {
        mapRef.current.animateToRegion({
          ...arr[0],
          latitudeDelta: 0.6,
          longitudeDelta: 0.6,
        }, 1000);
      } else {
        mapRef.current.fitToCoordinates(arr, {
          edgePadding: {
            top: 32,
            right: 32,
            left: 32,
            bottom: props.jobsExists ? theme.HEIGHT_ANIMATED_DRAWER + 32 : 32,
          },
          animated: true,
        });
      }
    }

  }, [props.jobsForSelectedDate, mapRef]);

  useEffect(()=>{
    const jobs = props.jobs.filter(job => state.selectedFilters.includes(job.OrderStatus));

    setState({
      ...state,
      filteredJobs: [...jobs],
    });
  }, [state.selectedFilters, props.jobs]);

  const onMapPress = () => {
    if (state.calloutVisible) {
      setAndroidCallout(false);
    }
  }

  const onMapFilterIconPressed = (type) => {
    let newFilters = [...state.selectedFilters]
    switch (type) {
    case 0: // unaccepted jobs
      if (!newFilters.includes(ORDER_STATUS_TEXT.notAccpeted)) {
        newFilters.push(ORDER_STATUS_TEXT.notAccpeted);
      }
      else{
        newFilters = newFilters.filter(el => el !== ORDER_STATUS_TEXT.notAccpeted);
      }
      break;
    case 1: // accepted jobs
      if (!newFilters.includes(ORDER_STATUS_TEXT.accepted)) {
        newFilters.push(ORDER_STATUS_TEXT.accepted);
      }
      else{
        newFilters = newFilters.filter(el => el !== ORDER_STATUS_TEXT.accepted);
      }
      break;
    case 2: // sent to customer jobs
      if (!newFilters.includes(ORDER_STATUS_TEXT.notBookedWithCustomer)) {
        newFilters.push(ORDER_STATUS_TEXT.notBookedWithCustomer);
      }
      else{
        newFilters = newFilters.filter(el => el !== ORDER_STATUS_TEXT.notBookedWithCustomer);
      }
      break;
    case 3: // booked jobs
      if (!newFilters.includes(ORDER_STATUS_TEXT.bookedWithCustomer)) {
        newFilters.push(ORDER_STATUS_TEXT.bookedWithCustomer);
      }
      else{
        newFilters = newFilters.filter(el => el !== ORDER_STATUS_TEXT.bookedWithCustomer);
      }
      break;
    case 4: // Completed jobs
      if (!newFilters.includes(ORDER_STATUS_TEXT.completed)) {
        newFilters.push(ORDER_STATUS_TEXT.completed);
      }
      else{
        newFilters = newFilters.filter(el => el !== ORDER_STATUS_TEXT.completed);
      }
      break;
    default:
      break;
    }
    setState({ ...state, selectedFilters: [...newFilters] });
  }

  const onMapResetSelected = () => {
    const arr = [];
    let { jobs } = props;
    if (state.selectedFilter) {
      jobs = jobs.filter(job => job.OrderStatus === state.selectedFilter);
    }
    jobs.forEach((value) => {
      arr.push({
        latitude: value.lat,
        longitude: value.lng,
      });
    });
    if (arr.length === 1) {
      mapRef.current.animateToRegion({
        ...arr[0],
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      }, 1000);
    } else if (arr.length > 1) {
      mapRef.current.fitToCoordinates(arr, {
        edgePadding: {
          top: 16,
          right: 8,
          left: 8,
          bottom: props.jobsExists ? theme.HEIGHT_ANIMATED_DRAWER + 8 : 8,
        },
        animated: true,
      });
      if (props.selectedJob) {
        props.resetSelectedJob();
        setAndroidCallout();
      }
    }
  }

  setAndroidCallout = (calloutVisible) => {
    if (!IS_IOS) {
      setState({ ...state, calloutVisible });
    }
  }

  const onToggleCallout = (calloutVisible) => {
    setAndroidCallout(calloutVisible);
  }

  const getTypeOfWorkPin = ({ OrderStatus, ShippingStatus }) => {
    const icons = theme.ICON_MAPS;
    switch (OrderStatus) {
    case ORDER_STATUS_TEXT.accepted:
      switch (ShippingStatus) {
      case 'NotYetShipped':
        return icons.ACCEPTED.NOT_SHIPPED;
      case 'Shipped':
        return icons.ACCEPTED.SHIPPED;
      case 'Delivered':
        return icons.ACCEPTED.DELIVERED;
      }
    case ORDER_STATUS_TEXT.bookedWithCustomer:
      switch (ShippingStatus) {
      case 'NotYetShipped':
        return icons.BOOKED.NOT_SHIPPED;
      case 'Shipped':
        return icons.BOOKED.SHIPPED;
      case 'Delivered':
        return icons.BOOKED.DELIVERED;
      }
    case ORDER_STATUS_TEXT.notBookedWithCustomer:
      switch (ShippingStatus) {
      case 'NotYetShipped':
        return icons.SENT_TO_CUSTOMER.NOT_SHIPPED;
      case 'Shipped':
        return icons.SENT_TO_CUSTOMER.SHIPPED;
      case 'Delivered':
        return icons.SENT_TO_CUSTOMER.DELIVERED;
      }
    case ORDER_STATUS_TEXT.notAccpeted:
      switch (ShippingStatus) {
      case 'NotYetShipped':
        return icons.UNACCEPTED.NOT_SHIPPED;
      case 'Shipped':
        return icons.UNACCEPTED.SHIPPED;
      case 'Delivered':
        return icons.UNACCEPTED.DELIVERED;
      }
    case ORDER_STATUS_TEXT.completed:
      return icons.COMPLETED;
    default:
    }
  }

  const onMapReady = () => {
    const { region } = props;

    if (region) {
      mapRef.current.animateToRegion({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      });
    }

    props.onRef(mapRef.current);
  }

  return (
    <View style={styles.map}>
      <MapActionButton
        onPress={onMapResetSelected}
        size={40}
        style={styles.buttonReset}
        icon={theme.ICON_MAP_RESET}
      />
      <MapActionButton
        onPress={props.goToSettings}
        size={40}
        style={styles.buttonSettings}
        icon={theme.ICON_SETTINGS}
      />
      {
        !props.jobsExists && (
          <MapActionButton
            onPress={props.onRefreshPressed}
            style={styles.buttonRefresh}
            size={40}
            icon={theme.ICON_REFRESH_BLUE}
          />
        )
      }
      <MapView
        style={styles.mapView}
        showsUserLocation
        ref={mapRef}
        onMapReady={onMapReady}
        onPress={onMapPress}
        showsMyLocationButton={false}
      >
        {
          state.filteredJobs.map((key, index) => {
            let selected = null;
            let selectedForDate = null;
            if (props.jobsForSelectedDate) {
              if (props.jobsForSelectedDate.indexOf(key) !== -1) {
                selectedForDate = true;
              } else {
                selectedForDate = false;
              }
            }
            if (props.selectedJob !== null) {
              if (props.selectedJob === key) selected = true;
              else selected = false;
            }
            return (
              <DefaultMarker
                key={index}
                index={index}
                imageSource={getTypeOfWorkPin(key)}
                coordinate={{ latitude: key.lat, longitude: key.lng }}
                onPressed={props.onMarkerPressed}
                orderId={key.OrderId}
                callOutData={key}
                selected={selected}
                selectedForDate={selectedForDate}
                onBookJobSelected={props.onBookJobSelected}
                toggleOrderDetailModal={props.toggleOrderDetailModal}
                onToggleCallout={onToggleCallout}
                calloutVisible={state.calloutVisible}
              />
            );
          })
        }
        {/* <Marker image={theme.ICON_MAP_HOME} coordinate={props.region} /> */}
      </MapView>
      <View style={{...styles.pinContainer, bottom: props.jobsExists ? 165 : 8}}>
        {
          props.screen === 'accept' && (
            <MapFilterIcon
              source={theme.ICONS_ARR_MAP_FILTER.UNACCEPTED}
              type={0}
              onPress={onMapFilterIconPressed}
              unselected={!state.selectedFilters.includes(ORDER_STATUS_TEXT.notAccpeted)}
            />
          )
        }
        {
          (props.screen === 'accept' || props.screen === 'book') && (
            <MapFilterIcon
              source={theme.ICONS_ARR_MAP_FILTER.ACCEPTED}
              type={1}
              onPress={onMapFilterIconPressed}
              unselected={!state.selectedFilters.includes(ORDER_STATUS_TEXT.accepted)}
            />
          )
        }
        <MapFilterIcon
          source={theme.ICONS_ARR_MAP_FILTER.SENT_TO_CUSTOMER}
          type={2}
          onPress={onMapFilterIconPressed}
          unselected={!state.selectedFilters.includes(ORDER_STATUS_TEXT.notBookedWithCustomer)}
        />
        <MapFilterIcon
          source={theme.ICONS_ARR_MAP_FILTER.BOOKED}
          type={3}
          onPress={onMapFilterIconPressed}
          unselected={!state.selectedFilters.includes(ORDER_STATUS_TEXT.bookedWithCustomer)}
        />
        {
          props.screen === 'today' && (
            <MapFilterIcon
              source={theme.ICONS_ARR_MAP_FILTER.COMPLETED}
              type={4}
              onPress={onMapFilterIconPressed}
              unselected={!state.selectedFilters.includes(ORDER_STATUS_TEXT.completed)}
            />
          )
        }
      </View>
      {
        !IS_IOS && state.calloutVisible && props.selectedJob && (
          <CustomCallout
            callOutData={props.selectedJob}
            onBookJobSelected={props.onBookJobSelected}
            toggleOrderDetailModal={props.toggleOrderDetailModal}
            closeCallout={() => setAndroidCallout(false)}
            wrapperStyle={styles.customAndroidCallout}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  pinContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 8,
  },
  mapView: {
    flex: 1,
  },
  customAndroidCallout: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: 8,
    zIndex: 100,
    elevation: 4,
  },
  buttonReset: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    elevation: 0,
  },
  buttonRefresh: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    zIndex: 10,
    elevation: 0,
  },
  buttonSettings: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    elevation: 0,
  },
});

export default DefaultMap;
