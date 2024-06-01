import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import theme from '../../../config';

const DATE_FORMAT = 'YYYY-MM-DD';

const SearchCalendar = (props) => {
  createMarkedDates = () => {
    let markedDates = {};

    if (props.selectedDates.length === 1) { 
      let dateString = props.selectedDates[0].format(DATE_FORMAT);
      markedDates = {
        [dateString]: {color: theme.COLOR_PRIMARY, textColor: theme.COLOR_WHITE},
      } 
    }
    else if (props.selectedDates.length > 1) { 
      let date1 = moment(props.selectedDates[0]);
      let date2 = props.selectedDates[1];

      while(date1.isBefore(date2, 'd') || date1.isSame(date2, 'd')){
        let dateString = date1.format(DATE_FORMAT);
        markedDates = {
          ...markedDates,
          [dateString]: {color: theme.COLOR_PRIMARY, textColor: theme.COLOR_WHITE},
        }

        date1 = date1.add(1, "days");
      }      
    }

    return markedDates;
  };

  onDayPress = (day) => {
    const date = props.selectedDates && moment(props.selectedDates).isSame(day.dateString) ? null : day.dateString;
    props.dateSelected(date);
  };

  return (
    <View style={styles.containerCalendar}>
      <Calendar
        markingType='period'
        firstDay={1}
        horizontal
        pagingEnabled
        showWeekNumbers
        onDayPress={this.onDayPress}
        markedDates={this.createMarkedDates()}
        hideArrows={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerCalendar: {
    padding: 16,
    backgroundColor: theme.COLOR_WHITE,
  },
});

export default SearchCalendar;
