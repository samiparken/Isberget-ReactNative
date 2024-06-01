import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import LeftArrowWithText from '../../UI/LeftArrowWithText';
import RightArrowWithText from '../../UI/RightArrowWithText';
import CalendarModal from '../../Modals/CalendarModal';
import IconHeader from '../../UI/IconHeader';
import theme from '../../../config';
import AdminFilterModal from '../../Modals/AdminFilterModal';

const RangeHeader = (props) => {

  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(prevState => ({
      showFilter: !prevState.showFilter,
    }));
  }
  
  return (
    <View
      style={styles.container}
      {...props}
    >
    {
      props.showAdminFilter &&
        <AdminFilterModal
          isVisible={showFilter}
          toggleFilter={toggleFilter}/>         
    }
      <CalendarModal
        minDate={props.dates.minDate}
        selectedDate={props.selectedDate}
        toggleModal={props.toggleCalendarModal}
        visible={props.calendarVisible}
        dateSelected={props.onToggleSelectedDate}
        jobs={props.bookedJobs}
      />
      { props.show &&
      <IconHeader 
        toggleModal={toggleFilter}
        style={{ position: 'absolute', left : 16}} 
        source={"user"}
        />
      }
      <View style={styles.datesContainer}>
        <LeftArrowWithText
          date={props.dates.fromDate}
          onPress={props.onPrevWeekPressed}
        />
        <RightArrowWithText
          date={props.dates.toDate}
          onPress={props.onNextWeekPressed}
        />
      </View>
      <IconHeader toggleModal={props.toggleCalendarModal} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: theme.HEIGHT_NAV_BAR,
    backgroundColor: theme.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    width:'100%',
  },
  datesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default RangeHeader;