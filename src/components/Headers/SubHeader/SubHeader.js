import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../../../config';
import DateCell from './DateCell';
import moment from 'moment';
import { convertTo, DATE_FORMAT, now } from '../../../utils/DateHandler';

const SubHeader = props => {

  const [filteredDates, setFilteredDates] = useState({});

  useEffect(()=>{
    let filteredDates = {...props.dates};
    Object.keys(filteredDates).forEach(key => {
      let jobs = [];
  
      filteredDates[key].forEach((job, index) => {
        if(!jobs.find(el => el.orderId === job.orderId)){
          jobs.push(job);
        }
      });
  
      filteredDates[key] = [...jobs];
    });

    setFilteredDates(filteredDates);
  }, [props.dates]);

  return <View
    style={[
      styles.container,
    ]}
  >
    {
      Object.keys(filteredDates).map(((date, i) => (
        <DateCell
          key={i}
          date={date}
          selected={convertTo(props.selectedDate, DATE_FORMAT) === convertTo(date, DATE_FORMAT)}
          disabled={ props.fromTodaysJobs ? false : moment(date).isBefore(now())}
          jobs={filteredDates[date]}
          onToggleSelectedDate={props.onToggleSelectedDate}
        />
        )
      ))
    }
  </View>
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOpacity: 1,
    shadowOffset: {width: 0, height: 1},
    borderBottomColor: theme.COLOR_GREY,
    borderBottomWidth: 1,
    elevation: 1,
  },
  alert: {
    // borderColor: theme.COLOR_RED,
    // borderWidth: 3,
    borderBottomColor: theme.COLOR_RED,
    borderBottomWidth: 3,
    borderTopColor: theme.COLOR_RED,
    borderTopWidth: 3,
  },
});

export default SubHeader;