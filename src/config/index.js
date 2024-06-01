import { Platform, Dimensions } from 'react-native';
import logoIcon from '../assets/full_logo.png';
import searchIcon from '../assets/icons/searchWhite/search.png';
import infoIcon from '../assets/icons/infoBlue/info.png';
import declineIcon from '../assets/icons/timesRed/times-rod.png';
import checkIcon from '../assets/icons/checkGreen/check.png';
import arrowUp from '../assets/icons/arrowUpBlue/chevron-up.png';
import arrowDown from '../assets/icons/arrowDownBlue/chevron-down.png';
import arrowLeftWhite from '../assets/icons/arrowLeftWhite/angle-left.png';
import arrowRightWhite from '../assets/icons/arrowRightWhite/angle-right.png';
import mapReset from '../assets/icons/mapReset/compress-solid.png';
import phoneIconBlue from '../assets/icons/phoneBlue/phone.png';
import phoneIconWhite from '../assets/icons/phoneWhite/Path.png';
import calendarIcon from '../assets/icons/calendarBlue/calendar-check-solid.png';
import homeIcon from '../assets/map/iconHome/Group.png';
import iconGps from '../assets/icons/gpsBlue/iconGps.png';
import iconSmsBlue from '../assets/icons/smsBlue/comments-solid.png';
import iconSmsWhite from '../assets/icons/smsWhite/comments-solid.png';
import iconSend from '../assets/icons/sendIcon/telegram-plane-brands.png';
import iconExitWhite from '../assets/icons/timesWhite/times-vit.png';
import iconMailWhite from '../assets/icons/mailWhite/Shape.png';
import iconCarWhite from '../assets/icons/carWhite/car-solid.png';
import iconCalendarWhite from '../assets/icons/calendarWhite/calendar-vit.png';
import iconCalendarGreen from '../assets/icons/calendarGreen/calendar-vit.png';
import iconExitGrey from '../assets/icons/timesGrey/times-gra.png';
import iconBookJobWhite from '../assets/icons/bookJob/calendar-check-solid.png';
import filterUnAccepted from '../assets/map/filterMarkers/unAccepted/bla.png';
import filterAccepted from '../assets/map/filterMarkers/accepted/orange.png';
import filterSentToCustomer from '../assets/map/filterMarkers/sentToCustomer/gul.png';
import filterBooked from '../assets/map/filterMarkers/booked/gron.png';
import protocolIcon from '../assets/icons/protocolBlue/file-text.png';
import iconCarBlue from '../assets/icons/carBlue/car.png';
import iconHouseGrey from '../assets/icons/homeGrey/home-gra.png';
import iconMailGrey from '../assets/icons/envelopeGrey/envelope.png';
import iconLockGrey from '../assets/icons/lockGrey/lock-gra.png';
import iconUserGrey from '../assets/icons/userGrey/user.png';
import iconRightArrowGrey from '../assets/icons/arrowRightGrey/chevron-right-solid.png';
import iconArrowLeftBlue from '../assets/icons/arrowLeftBlue/arrow-left.png';
import iconArrowRightBlue from '../assets/icons/arrowRightBlue/arrow-right.png';
import acceptJobsIcon from '../assets/tabs/acceptJobs/check-circle.png';
import bookJobsIcon from '../assets/tabs/bookJobs/calendar-check.png';
import todaysJobsIcon from '../assets/tabs/todaysJobs/calendar-gra.png';
import searchTabIcon from '../assets/tabs/search/search-solid.png';
import settingsIcon from '../assets/tabs/settings/gear.png';
import iconCalBlueReg from '../assets/icons/calBlueReg/calendar-alt-solid.png';
import iconRefreshBlue from '../assets/icons/iconRefreshBlue/ic_refresh_blue.png';

import iconUnacceptedNotShipped from '../assets/markers/unAccepted/notShipped/bla-rod.png';
import iconUnacceptedShipped from '../assets/markers/unAccepted/shipped/bla-orange.png';
import iconUnacceptedDelivered from '../assets/markers/unAccepted/delivered/bla-gron.png';

import iconAcceptedNotShipped from '../assets/markers/accepted/notShipped/orange-rod.png';
import iconAcceptedShipped from '../assets/markers/accepted/shipped/orange-orange.png';
import iconAcceptedDelivered from '../assets/markers/accepted/delivered/orange-gron.png';

import iconSentToCustomerNotShipped from '../assets/markers/sentToCustomer/notShipped/gul-rod.png';
import iconSentToCustomerShipped from '../assets/markers/sentToCustomer/shipped/gul-orange.png';
import iconSentToCustomerDelivered from '../assets/markers/sentToCustomer/delivered/gul-gron.png';

import iconBookedNotShipped from '../assets/markers/booked/notShipped/gron-rod.png';
import iconBookedShipped from '../assets/markers/booked/shipped/gron-orange.png';
import iconBookedDelivered from '../assets/markers/booked/delivered/gron-gron.png';

import iconInstallationCompleted from '../assets/markers/completed/completed.png';
import messageIcon from '../assets/tabs/message/message.png';
import checkboxYes from '../assets/icons/checkboxes/checkboxYes.png';
import checkboxNo from '../assets/icons/checkboxes/checkboxNo.png';
import readMessage from '../assets/icons/messages/readMessage.png';
import unreadMessage from '../assets/icons/messages/unreadMessage.png';

const { width, height } = Dimensions.get('window');

export default {
  COLOR_PRIMARY: '#274e96',
  COLOR_PRIMARY_LIGHT: '#6583BA',
  COLOR_PRIMARY_DARK: '#0c234d',
  COLOR_PRIMARY_EXTRA_DARK: '#18336b',
  COLOR_RED: '#ec6466',
  COLOR_GREEN: '#4ad57b',
  COLOR_ORANGE: '#f89634',
  COLOR_YELLOW: '#f5d57b',
  COLOR_LIGHT_BLACK: 'rgba(0,0,0,0.8)',
  COLOR_GREY: '#acb5bd',
  COLOR_LIGHT_GREY: 'lightgrey',
  COLOR_DARK_GREY: 'grey',
  COLOR_MODAL_BACKGROUND: 'rgba(0,0,0,0.7)',
  COLOR_BLACK: 'black',
  COLOR_WHITE: 'white',
  COLOR_WHITE_TRANSPARENT: 'rgba(255,255,255,0.8)',
  COLOR_TRANSPARENT: 'transparent',
  COLOR_ALERT_SUCCESS_BACKGROUND: '#D3ECD9',
  COLOR_ALERT_ERROR_BACKGROUND: '#F8D7DA',
  COLOR_ALERT_SUCCESS_TEXT: '#155724',
  COLOR_ALERT_ERROR_TEXT: '#721c23',
  // SIZES
  HEIGHT_NAV_BAR: Platform.OS === 'ios' ? 44 : 54,
  HEIGHT_NAV_BAR_SEARCH: 180,
  SIZE_IPHONE_SE: 320,
  SIZE_IPHONE_PLUS: 414,
  IS_IPHONE_X: () => Platform.OS === 'ios' && (height >= 812 || width >= 812),
  SIZE_WINDOW_WIDTH: width,
  SIZE_WINDOW_HEIGHT: height,
  HEIGHT_DEFAULT_LIST_ITEM: 80,
  HEIGHT_ANIMATED_DRAWER: 180,
  FONT_SIZE_SMALL: 12,
  FONT_SIZE_MEDIUM: 14,
  FONT_SIZE_LARGE: 16,
  BORDER_RADIUS_SMALL: 6,
  BORDER_RADIUS_MEDIUM: 8,
  BORDER_RADIUS_LARGE: 10,
  STYLE_CARD: {
    shadowColor: 'lightgrey',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 50,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  // ICONS
  ICON_LOGO: logoIcon,
  ICON_SEARCH: searchIcon,
  ICON_INFO: infoIcon,
  ICON_DECLINE: declineIcon,
  ICON_CHECK: checkIcon,
  ICON_ARROW_UP: arrowUp,
  ICON_ARROW_DOWN: arrowDown,
  ICON_ARROW_LEFT_WHITE: arrowLeftWhite,
  ICON_ARROW_RIGHT_WHITE: arrowRightWhite,
  ICON_ARROW_RIGHT_GREY: iconRightArrowGrey,
  ICON_MAP_RESET: mapReset,
  ICON_PHONE_BLUE: phoneIconBlue,
  ICON_PHONE_WHITE: phoneIconWhite,
  ICON_CALENDAR: calendarIcon,
  ICON_MAP_HOME: homeIcon,
  ICON_GPS: iconGps,
  ICON_SMS_BLUE: iconSmsBlue,
  ICON_SMS_WHITE: iconSmsWhite,
  ICON_SEND: iconSend,
  ICON_MAIL_WHITE: iconMailWhite,
  ICON_SEND_WHITE: iconSend,
  ICON_EXIT_WHITE: iconExitWhite,
  ICON_EXIT_GREY: iconExitGrey,
  ICON_CAR_WHITE: iconCarWhite,
  ICON_CALENDAR_WHITE: iconCalendarWhite,
  ICON_CALENDAR_GREEN: iconCalendarGreen,
  ICON_BOOK_JOB_WHITE: iconBookJobWhite,
  ICON_PROTOCOL: protocolIcon,
  ICON_CAR_BLUE: iconCarBlue,
  ICON_HOUSE_GREY: iconHouseGrey,
  ICON_MAIL_GREY: iconMailGrey,
  ICON_LOCK_GREY: iconLockGrey,
  ICON_USER_GREY: iconUserGrey,
  ICON_ARROW_LEFT_BLUE: iconArrowLeftBlue,
  ICON_ARROW_RIGHT_BLUE: iconArrowRightBlue,
  ICON_CALENDAR_BLUE: iconCalBlueReg,
  ICON_REFRESH_BLUE: iconRefreshBlue,
  ICON_SETTINGS: settingsIcon,
  ICON_CHECKBOX_YES: checkboxYes,
  ICON_CHECKBOX_NO: checkboxNo,
  ICON_MESSAGE_READ: readMessage,
  ICON_MESSAGE_UNREAD: unreadMessage,
  ICON_MAPS: {
    UNACCEPTED: {
      NOT_SHIPPED: iconUnacceptedNotShipped,
      SHIPPED: iconUnacceptedShipped,
      DELIVERED: iconUnacceptedDelivered,
    },
    ACCEPTED: {
      NOT_SHIPPED: iconAcceptedNotShipped,
      SHIPPED: iconAcceptedShipped,
      DELIVERED: iconAcceptedDelivered,
    },
    SENT_TO_CUSTOMER: {
      NOT_SHIPPED: iconSentToCustomerNotShipped,
      SHIPPED: iconSentToCustomerShipped,
      DELIVERED: iconSentToCustomerDelivered,
    },
    BOOKED: {
      NOT_SHIPPED: iconBookedNotShipped,
      SHIPPED: iconBookedShipped,
      DELIVERED: iconBookedDelivered,
    },
    COMPLETED: iconInstallationCompleted,
  },
  TABS: {
    TAB_1: messageIcon,
    TAB_2: acceptJobsIcon,
    TAB_3: bookJobsIcon,
    TAB_4: todaysJobsIcon,
    TAB_5: searchTabIcon,
  },
  // OTHER

  // Detta har inget med theme att göra. Finns redan i konstanter

  DATE_FORMAT: 'YYYY-MM-DD',
  ORDER_STATUS_ACCEPTED: 'Tilldelad företag',
  ORDER_STATUS_NOT_BOOKED: 'Inte bokad med kund',
  ORDER_STATUS_BOOKED: 'Bokad med kund',
  ORDER_STATUS_NOT_ACCEPTED: 'Inte accepterad än',
  completed: 'Installation klar',
  ICONS_ARR_MAP_FILTER: {
    ACCEPTED: filterAccepted,
    UNACCEPTED: filterUnAccepted,
    BOOKED: filterBooked,
    SENT_TO_CUSTOMER: filterSentToCustomer,
    COMPLETED: iconInstallationCompleted,
  },
};
