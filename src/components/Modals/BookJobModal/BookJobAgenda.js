import React from 'react';
import { View, StyleSheet } from 'react-native';
import AgendaSlot from './AgendaSlot';
import moment from 'moment';
import theme from '../../../config';

const timeSlotsArray = [7,8,9,10,11,12,13,14,15,16,17,18];

const BookJobAgenda = (props) =>  (
  <View style={styles.container}>
  {
    timeSlotsArray.map((value, index) => {
    let booked = false;
    
    props.jobs.map(job => {
      const startTime = moment(job.startTime).format("HH:mm");
      const endTime = moment(job.endTime).format("HH:mm");
      let startHours = parseInt(startTime.split(':')[0]);
      const startMin = parseInt(startTime.split(':')[1]);
      startHours = startMin != 0 ? startHours + 1 : startHours;

      let endHours = parseInt(endTime.split(':')[0]);
      const endMin = parseInt(endTime.split(':')[1]);
      endHours = endMin != 0 ? endHours + 1 : endHours;

      if (value >= startHours && value < endHours) {
          booked = true;
      }
    });

    return (
      <AgendaSlot
        key={index}
        index={index}
        timeSlot={value}
        onTimeSlotSelected={props.onTimeSlotSelected}
        selected={value >= props.startDate.hours() && value <= props.endDate.hours()}
        booked={booked}
        startDate={props.startDate}
        endDate={props.endDate}
      />
      )
    })
  }
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderLeftWidth: 2,
    borderLeftColor: theme.COLOR_LIGHT_GREY,
    borderRightWidth: 2,
    borderRightColor: theme.COLOR_LIGHT_GREY,
  },
})

export default BookJobAgenda;
