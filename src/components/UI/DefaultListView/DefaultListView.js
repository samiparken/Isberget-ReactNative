import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import * as geolib from 'geolib';
import DefaultTextForListView from '../DefaultTextForListView';
import DefaultButtonForListView from '../DefaultButtonForListView';
import theme from '../../../config';
import Axios from 'axios'
import { API_ENDPOINTS } from '../../../api/constants';
import { API } from '../../../api/ApiHandler';

const GOOGLE_MAPS_API_KEY = "AIzaSyB0TQQhGmFvi7SbUvt7r_ypjMVbprMITFg";

const DefaultListView = (props) => {
  const [state, setState] = useState({
    distance: '',
    duration: '',
    answers: [],
    startTime: '',
    address: '',
    color: theme.COLOR_GREEN,
  });

  useEffect(()=>{
    const startTime = props.showTimeForJob ? moment(props.dataToRender.Start).format('hh:mm') : '';
    let address = props.dataToRender.Address || props.dataToRender.FullAdress
      || props.dataToRender.Adress;

    if (address) {
      address = address.trim();
      address = address.replace(',', '');
      const addressArr = address.split(' ');

      let zipCode = addressArr[2];
      let city = addressArr[3];
      if (addressArr[4]) city = `${city} ${addressArr[4]}`;

      if (zipCode.length !== 5) {
        zipCode = addressArr[3];
        city = addressArr[4];
        if (addressArr[5]) city = `${city} ${addressArr[5]}`;
      }
      address = `${zipCode}, ${city}`;
      address = address.toUpperCase();
    }

    const daysDiff = moment().diff(moment(props.dataToRender.OrderCreatedAsDate), 'days');
    const color = daysDiff >= 2 ? daysDiff >= 7 ? theme.COLOR_RED : theme.COLOR_ORANGE : theme.COLOR_GREEN

    calculateDistance();
    getAnswers();

    setState((prevState)=>({
      ...prevState,
      startTime: startTime,
      address: address,
      color: color,
    }));
  }, []);
  
  const calculateDistance = () => {
    if(props.currentPosition && props.dataToRender){
      const { lat, lng } = props.dataToRender;
      const { latitude, longitude } = props.currentPosition;
    
      Axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params:{
          origins: `${latitude},${longitude}`,
          destinations: `${lat},${lng}`,
          key: GOOGLE_MAPS_API_KEY,
        }
      }).then((result) => {
        if(result.data.rows && result.data.rows.length > 0 
          && result.data.rows[0].elements 
          && result.data.rows[0].elements.length > 0
          && result.data.rows[0].elements[0].distance
          && result.data.rows[0].elements[0].duration){

            setState((prevState)=>({ 
              ...prevState,
              distance: result.data.rows[0].elements[0].distance.text,
              duration: result.data.rows[0].elements[0].duration.text
                .replace("hours", "h").replace("mins", "m")
                .replace("hour", "h").replace("min", "m"),
            }));
        }
        else{
          calculateDistanceOnError(lat, lng);
        }
      }).catch(error => {
        calculateDistanceOnError(lat, lng);
      });
    }
    else{
      setState((prevState)=>({
        ...prevState, 
        duration: 'GPS permission denied'
      }));
    }
  }

  const getAnswers = () => {
    if(props.dataToRender){
      API.get(API_ENDPOINTS.GetCustomerHistory, {param: props.dataToRender.OrderId ?? props.dataToRender.Id})
        .then(result => {
          if(result && result.length > 0){
            const answersToFill = [];

            result[0].Answers.forEach((answer) => {
              answersToFill.push(answer);
            });

            setState((prevState)=>({
              ...prevState,
              answers: answersToFill,
            }));
          }          
        });
    }
  }

  const calculateDistanceOnError = (lat, lng) => {
    let distance = '';
    if (props.currentPosition && lat && lng) {
      distance = geolib.getDistance(
        { latitude: props.currentPosition.latitude, longitude: props.currentPosition.longitude },
        { latitude: lat, longitude: lng },
      );
      // meters to km
      if (distance > 1000) {
        distance /= 1000;
        distance = distance.toFixed(0);
        distance += ' km';
      } else {
        distance += ' m';
      }
    }
    setState((prevState)=>({ ...prevState, distance: distance }));
  }

  return (
    <TouchableOpacity
      style={[
        styles.listcontainer,
        props.selected && styles.selected,
        props.showTimeForJob ? { height: 125 } : { height: 105 }]}
      onPress={() => props.onListViewPress(props.dataToRender, props.index)}
    >
      <View style={styles.containerLeft}>
        <View style={styles.innerContainerLeftTop}>
          <DefaultTextForListView
            textInput={`${props.dataToRender.OrderType}, ${
              props.dataToRender.ProductList[0].ProductName}`}
          />
          <DefaultTextForListView textInput={state.address} />
          {props.showTimeForJob && (
            <DefaultTextForListView textInput={`Klockan ${state.startTime}`} />
          )}
        </View>
        <View style={styles.innerContainerLeftBottom}>
          <DefaultTextForListView
            textInput={`${state.distance} (${state.duration})`}
            style={{
              fontWeight: 'bold',
              fontSize: state.duration.includes('GPS') ? 13 : 15,
              color: theme.COLOR_PRIMARY,
              textAlign: 'center',
              marginTop: 3,
            }}
          />
        </View>
      </View>
      <View style={styles.containerRight}>
        <View style={styles.buttonContainer}>
          {
            props.icons.map((icon, index) => (
              <DefaultButtonForListView
                indexList={props.index}
                data={props.dataToRender}
                answers={state.answers}
                source={icon}
                key={index}
                index={index}
                onPress={props.onButtonPress}
                fromAcceptcreen={props.fromAcceptcreen}
              />
            ))
          }
        </View>
        <DefaultTextForListView
          textInput={moment(props.dataToRender.OrderCreatedAsDate).fromNow()}
          style={{ color: state.color, fontSize: 16, fontWeight: 'bold',}}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listcontainer: {
    height: theme.HEIGHT_DEFAULT_LIST_ITEM,
    zIndex: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
    marginTop: 8,
    elevation: 4,
    flexDirection: 'row',
    padding: 8,
    marginHorizontal: 8,
    // width: '100%',
  },
  selected: {
    backgroundColor: theme.COLOR_WHITE,
    borderColor: theme.COLOR_RED,
    borderWidth: 2,
  },
  containerLeft: {
    height: '100%',
    width: '50%',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  innerContainerLeftBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerRight: {
    height: '100%',
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default DefaultListView;
