import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import theme from '../../../config';

const AgendaSlot = (props) => {
  checkSelected = () => {
    if (props.booked) {
      return {
        top: 0,
        bottom: 0,
      }
    } else if (props.selected) {
      
      let styling = {}

      if (props.startDate.hours() < props.timeSlot && props.endDate.hours() > props.timeSlot) {
          styling = {
              top: 0,
              bottom: 0

          }
      } else if (props.startDate.hours() === props.timeSlot) {
          if (props.startDate.minutes() === 0) {
              styling = {
                  top: 0,
                  bottom: 0
              }
          } else {
              const minPerc = (1 - props.startDate.minutes() / 60) * 100;
              styling = {
                  bottom: 0,
                  height: `${minPerc}%`
              }
          }
      } else if (props.endDate.hours() === props.timeSlot) {
          /* if (props.endDate.minutes() === 0) {
              styling = {
                  top: 0,
                  bottom: 0
              }
          } else */ if (props.endDate.minutes() !== 0) {
              const minPerc = (props.endDate.minutes() / 60) * 100;
              styling = {
                  top: 0,
                  height: `${minPerc}%`
              }
          }
      }
      return {
          ...styling,
          backgroundColor: 'rgba(74,213,123,0.5)'
      };
    }
  }

  const dynamicStyling = this.checkSelected();

  return (
    <TouchableOpacity
    style={[styles.container,
        {
            borderTopWidth: props.index === 0 ? 0 : 1,
            borderBottomWidth: props.index === 11 ? 0 : 1
        }]}
    onPress={() => {
        const date = moment().set({
            'hours': props.timeSlot,
            'minutes': 0
        });

        props.onTimeSlotSelected(date);
    }}
    >
      <View style={styles.subContainer}>
        <View style={[styles.filler, props.booked ? {...dynamicStyling} : null]} />
        <View style={[styles.selectedFiller, props.selected ? {...dynamicStyling} : null]}></View>
        <Text style={{fontSize: 14}}>{props.timeSlot}</Text>
        <Text style={{fontSize: 8}}>{"00"}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopColor: theme.COLOR_LIGHT_GREY,
        borderBottomColor: theme.COLOR_LIGHT_GREY,
        backgroundColor: theme.COLOR_WHITE,
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 2,
        paddingTop: 2,
    },
    selectedFiller: {
        position: 'absolute',
        right: 0,
        left: 0,
        backgroundColor: theme.COLOR_GREY,
    },
    filler: {
        position: 'absolute',
        left: 0,
        right: 0,
        //bottom: 0,
        backgroundColor: 'rgba(255,0,0, 0.1)',
    },
});

export default AgendaSlot;