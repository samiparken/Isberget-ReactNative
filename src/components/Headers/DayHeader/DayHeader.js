import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import theme from '../../../config';
import IconHeader from '../../UI/IconHeader';
import CalendarModal from '../../Modals/CalendarModal';
import AdminFilterModal from '../../Modals/AdminFilterModal';

const DayHeader = (props) => {
  const [state, setState] = useState({
    calendarVisible: false,
    showFilter: false,
  });

  const toggleModal = () => {
    setState(prevState => ({
      ...prevState,
      calendarVisible: !prevState.calendarVisible,
    }));
  }

  const toggleFilter = () => {
    setState(prevState => ({
      ...prevState,
      showFilter: !prevState.showFilter,
    }));
  }

  return (
    <View style={styles.container}>
      <IconHeader
        toggleModal={toggleFilter}
        style={{ position: 'absolute', left: 16 }}
        source="user"
      />
      {
        props.showAdminFilter
          && (
            <AdminFilterModal
              isVisible={state.showFilter}
              toggleFilter={toggleFilter}
            />
          )
      }
      <View style={styles.datesContainer}>
        <TouchableOpacity
          onPress={() => props.prevDay(props.currentDate)}
        >
          <Image
            source={theme.ICON_ARROW_LEFT_WHITE}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.dateText}>{props.currentDate}</Text>

        <TouchableOpacity
          onPress={() => props.nextDay(props.currentDate)}
        >
          <Image
            source={theme.ICON_ARROW_RIGHT_WHITE}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <CalendarModal
        // minDate={moment().format('YYYY-MM-DD')}
        selectedDate={moment(props.currentDate)}
        toggleModal={toggleModal}
        visible={state.calendarVisible}
        dateSelected={props.onToggleSelectedDate}
        jobs={props.jobs}
      />
      <IconHeader toggleModal={toggleModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: theme.HEIGHT_NAV_BAR,
    backgroundColor: theme.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  datesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dateText: {
    color: theme.COLOR_WHITE,
    fontSize: 18,
  },
  icon: {
    marginHorizontal: 8,
  },
});

export default DayHeader;
