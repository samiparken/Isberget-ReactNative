import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Linking,
  Image,
  TouchableOpacity,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';
import DefaultButtonForListView from '../../UI/DefaultButtonForListView';
import theme from '../../../config';
import deviceStorage from '../../../services/deviceStorage';
import { SelectableText } from "@astrocoders/react-native-selectable-text";
import { copyText } from '../../../utils/CopyText';

class CustomCallOut extends Component {
  constructor(props) {
    super(props);

    const icons = [
      theme.ICON_PHONE_BLUE,
      theme.ICON_SMS_BLUE,
      theme.ICON_GPS,
      theme.ICON_INFO,
    ];

    if (props.onBookJobSelected) {
      icons.push(theme.ICON_CALENDAR);
    }

    this.state = {
      icons,
      error: false,
      sms: [],
      phone: '',
    };
  }

  createActionSheet = async (phone) => {
    const autoSms = ['Avbryt'];
    for (let i = 0; i < 3; i++) {
      const sms = await deviceStorage.getItem(`sms${i}`);
      autoSms.push(sms);
    }
    this.setState({
      sms: autoSms,
      phone,
    });

    this.ActionSheet.show();
  }

  onButtonHandler = (index) => {
    const {
      callOutData,
      toggleOrderDetailModal,
      onBookJobSelected,
    } = this.props;

    let phone = callOutData.PhoneNumber;
    if (!phone) {
      phone = callOutData.Phone;
    }
    phone = phone.replace(' ', '');
    phone = phone.replace('-', '');

    switch (index) {
    case 0:
      this.bringUpDialer(phone);
      break;
    case 1:
      this.createActionSheet(phone);
      break;
    case 2:
      this.openNativeMaps(this.props.callOutData);
      break;
    case 3:
      toggleOrderDetailModal(this.props.callOutData);
      break;
    case 4:
      onBookJobSelected(this.props.callOutData);
    default:
      break;
    }
  }

  bringUpDialer = (phone) => {
    Linking.canOpenURL(`tel:${phone}`).then((supported) => {
      if (supported) {
        return Linking.openURL(`tel:${phone}`);
      }
    }).catch(() => { });
  }

  getSMSDivider() {
    return Platform.OS === "ios" ? "&" : "?";
  }

  bringUpSms = (text, phone) => {
    Linking.canOpenURL(`sms://${phone}/${this.getSMSDivider()}body=${encodeURIComponent(text)}`).then((supported) => {
      if (supported) {
        return Linking.openURL(`sms://${phone}/${this.getSMSDivider()}body=${encodeURIComponent(text)}`);
      }
    }).catch(() => { });
  };

  openNativeMaps = (data = '') => {
    Platform.select({
      ios: () => {
        Linking.openURL(`http://maps.apple.com/maps?daddr=${data.lat},${data.lng}`);
      },
      android: () => {
        Linking.openURL(`http://maps.google.com/maps?daddr=${data.lat},${data.lng}`);
      },
    })();
  }

  render() {
    const {
      callOutData,
      wrapperStyle,
      closeCallout,
    } = this.props;

    const orderNumber = callOutData.order_number_on_client
      || callOutData.Order_number_on_client;

    const name = callOutData.FullName
      || callOutData.Description;

    const streetAddress = callOutData.StreetAdress
      || callOutData.StreetAddress;

    const zipAddress = callOutData.ZipCode
      || callOutData.PostalAddress;

    const city = callOutData.City
      || callOutData.CityAddress;

    const date = callOutData.Start
      ? moment(callOutData.Start).format('DD/MM HH:mm') : '-';
    const shippingStatus = callOutData.ShippingStatus === 'NotYetShipped'
      ? '-' : callOutData.ShippingStatus;
    const installerName = callOutData.InstallerName || callOutData.ResourceName || '-';

    return (
      <View style={wrapperStyle}>
        <View style={styles.callOutContainer}>
          <View style={styles.header}>
            <SelectableText 
              menuItems={['Copy']} 
              style={styles.headerText}
              value={`Order: #${orderNumber}`} 
              onSelection={copyText}
            />
            <TouchableOpacity
              style={styles.iconExit}
              onPress={closeCallout}
            >
              <Image source={theme.ICON_DECLINE} />
            </TouchableOpacity>
          </View>
          <View style={styles.callOutContainerText}>
            <View style={styles.addressContainer}>
              <SelectableText 
                menuItems={['Copy']} 
                style={styles.addressText} 
                value={callOutData.OrderType} 
                onSelection={copyText}
              />
              <SelectableText 
                menuItems={['Copy']} 
                style={styles.addressText} 
                value={`Datum: ${date}`} 
                onSelection={copyText}
              />
              <SelectableText 
                menuItems={['Copy']} 
                style={styles.addressText} 
                value={`Leveransstatus: ${shippingStatus}`} 
                onSelection={copyText}
              />
              <SelectableText 
                menuItems={['Copy']} 
                style={styles.addressText} 
                value={`Installatör: ${installerName}`} 
                onSelection={copyText}
              />
            </View>
            <View style={[styles.addressContainer, styles.addressContainerSecond]}>
              <SelectableText 
                menuItems={['Copy']} 
                style={styles.addressText} 
                value={name} 
                onSelection={copyText}
              />
              <SelectableText 
                menuItems={['Copy']} 
                style={styles.addressText} 
                value={streetAddress} 
                onSelection={copyText}
              />
              <SelectableText 
                menuItems={['Copy']} 
                style={styles.addressText} 
                value={`${zipAddress} ${city}`} 
                onSelection={copyText}
              />
            </View>
          </View>
          <View style={styles.callOutContainerText}>
            <SelectableText 
              menuItems={['Copy']} 
              style={styles.callOutSubText} 
              value={callOutData.OrderStatus} 
              onSelection={copyText}
            />
          </View>
          <View style={styles.iconContainer}>
            {
              this.state.icons.map((icon, index) => (
                <DefaultButtonForListView
                  source={icon}
                  key={index}
                  index={index}
                  onPress={this.onButtonHandler}
                />
              ))
            }
          </View>
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={this.state.sms}
          cancelButtonIndex={0}
          destructiveButtonIndex={1}
          onPress={(index) => {
            if (index !== 0) {
              this.bringUpSms(this.state.sms[index], this.state.phone);
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  callOutContainer: {
    flex: 1,
    width: 300,
    backgroundColor: theme.COLOR_WHITE,
    borderRadius: 10,
    padding: 10,
    zIndex: 990,
  },
  iconExit: {
    flex: 1,
    alignItems: 'flex-end',
    zIndex: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    // paddingBottom: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: theme.COLOR_GREY,
  },
  headerText: {
    fontSize: theme.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  callOutContainerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  callOutSubText: {
    fontWeight: 'bold',
  },
  addressContainer: {
    flex: 1,
  },
  addressContainerSecond: {
    paddingLeft: 10,
  },
  addressText: {
    fontSize: theme.FONT_SIZE_MEDIUM,
    flexWrap: 'wrap',
  },
  iconContainer: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default CustomCallOut;
