import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment';

const setupLocales = () => {
  // Configurations for calendar
  LocaleConfig.locales['sv'] = {
    monthNames: ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','Decemeber'],
    monthNamesShort: ['Jan.','Feb.','Mars','April','Maj','Juni','Juli.','Aug.','Sept.','Okt.','Nov.','Dec.'],
    dayNames: ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'],
    dayNamesShort: ['Sön','Mån','Tis','Ons','Tor','Fre','Lör']
  };

  LocaleConfig.defaultLocale = 'sv'; 

  // Configuration for date picker
  moment.updateLocale('en', {
    relativeTime : {
      future: "Om %s",
      past:   "%s sedan",
      s  : ' några sekunder',
      ss : '%d sekunder',
      m:  "en minut",
      mm: "%d minuter",
      h:  "en timma",
      hh: "%d timmar",
      d:  "en dag",
      dd: "%d dagar",
      M:  "en månad",
      MM: "%d månader",
      y:  "ett år",
      yy: "%d år",
    }
  });
}

export default setupLocales;