import React from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { convertTo, compareDates } from '../../../utils/DateHandler';
import theme from '../../../config';

const DATE_FORMAT = 'YYYY-MM-DD';

const CalendarModal = (props) => {
  createMarkedDates = () => {
    let markedDates = {};
    let selectedDateAdded = false;

    let selectedDateString = null;
    if (props.selectedDate)
      selectedDateString = props.selectedDate.format(DATE_FORMAT);

    if (props.jobs && props.jobs.length > 0) {
      props.jobs.map(value => {
          const date = convertTo(value.Start, DATE_FORMAT);
          
          const dots = [];
          props.jobs.find((job, index) => {
              if (compareDates(date, job.Start)) {
                  dots.push({key: '' + index, color: theme.COLOR_GREEN})
              }
          });

          let finalValue = {dots};
          if (selectedDateString === date) {
              finalValue = {dots, selected: true, selectedColor: theme.COLOR_PRIMARY};
              selectedDateAdded = true;
          }

          markedDates = {
              ...markedDates,
              [date]: finalValue
          }
      })
      if (selectedDateString && !selectedDateAdded) {
        markedDates = {
          ...markedDates,
          [selectedDateString]: {selected: true, selectedColor: theme.COLOR_PRIMARY}
        }
      }
    }
    return markedDates;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {props.toggleModal()}}
    >
      <TouchableWithoutFeedback
        onPress={() => {props.toggleModal()}}
        >
        <View style={styles.containerBackground}>
          <View style={styles.containerCalendar}>
            <Calendar
              firstDay={1}
              horizontal={true}
              pagingEnabled={true}
              showWeekNumbers={true}
              minDate={props.minDate}
              onDayPress={(day) => {
                props.toggleModal();
                const date = convertTo(props.selectedDate)
                  === convertTo(date) ? null : day.dateString;
                props.dateSelected(date);
              }}
              markedDates={this.createMarkedDates()}
              hideArrows={false}
              markingType='multi-dot'
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
};

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLOR_MODAL_BACKGROUND,
  },
  containerCalendar: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.COLOR_WHITE,
  },
});

export default CalendarModal;
