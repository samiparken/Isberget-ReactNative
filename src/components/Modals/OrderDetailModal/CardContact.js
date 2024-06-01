import React from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import theme from '../../../config';
import RoundIconButton from '../../Buttons/RoundIconButton';
import deviceStorage from '../../../services/deviceStorage';
import Card from '../../UI/Card';
import { SelectableText } from "@astrocoders/react-native-selectable-text";
import { copyText } from '../../../utils/CopyText';

const iconsContactAction = [
  theme.ICON_MAIL_WHITE,
  theme.ICON_PHONE_WHITE,
  theme.ICON_SMS_WHITE,
  theme.ICON_CAR_WHITE,
];

class CardContact extends React.Component {
  state = {
    sms: [],
    phone: '',
  }

  actionSelected = (index) => {
    switch (index) {
    case 0:
      this.onEmailSelected();
      break;
    case 1:
      this.onPhoneCallSelected();
      break;
    case 2:
      this.createActionSheet();
      break;
    case 3:
      this.openNativeMaps();
    default:
      break;
    }
  }

  openNativeMaps = () => {
    const { lat, lng } = this.props.order;
    const baseUrl = Platform.OS === 'ios' ? 'http://maps.apple.com/maps?daddr='
      : 'http://maps.google.com/maps?daddr=';
    const linking = `${baseUrl}${lat},${lng}`;
    Linking.canOpenURL(linking).then((supported) => {
      if (supported) {
        return Linking.openURL(linking);
      }
    }).catch(() => { });
  }

  onEmailSelected = () => {
    const email = this.props.order.Email;
    Linking.canOpenURL(`mailto:${email}`).then((supported) => {
      if (supported) {
        return Linking.openURL(`mailto:${email}`);
      }
    }).catch(() => { });
  }

  onPhoneCallSelected = () => {
    const phone = this.props.order.PhoneNumber
      || this.props.order.Phone;
    Linking.canOpenURL(`tel:${phone}`).then((supported) => {
      if (supported) {
        return Linking.openURL(`tel:${phone}`);
      }
    }).catch(() => { });
  }

  getSMSDivider() {
    return Platform.OS === "ios" ? "&" : "?";
  }

  onSendMessageSelected = (text) => {
    const phone = this.props.order.PhoneNumber
      || this.props.order.Phone;
    Linking.canOpenURL(`sms://${phone}/${this.getSMSDivider()}body=${encodeURIComponent(text)}`).then((supported) => {
      if (supported) {
        return Linking.openURL(`sms://${phone}/${this.getSMSDivider()}body=${encodeURIComponent(text)}`);
      }
    }).catch(() => { });
  }

  createActionSheet = async () => {
    const autoSms = ['Avbryt'];
    for (let i = 0; i < 3; i++) {
      const sms = await deviceStorage.getItem(`sms${i}`);
      autoSms.push(sms);
    }
    this.setState({
      sms: autoSms,
    });

    this.ActionSheet.show();
  }

  render() {
    return (
      <Card>
        <View>
          <SelectableText 
            menuItems={['Copy']}
            style={[styles.addressText, styles.addressTextTitle]}
            value={this.props.order.FullName || this.props.order.Description}
            onSelection={copyText}
          />
          <SelectableText 
            menuItems={['Copy']}
            style={styles.addressText}
            value={this.props.order.StreetAdress || this.props.order.StreetAddress || this.props.order.FullAdress}
            onSelection={copyText}
          />
          <SelectableText 
            menuItems={['Copy']}
            style={styles.addressText}
            value={`${this.props.order.ZipCode || this.props.order.PostalAddress || ''} ${
                this.props.order.City || this.props.order.CityAddress || ''}`}
            onSelection={copyText}
          />  
        </View>
        <View style={styles.containerContactAction}>
          {
            iconsContactAction.map((value, index) => (
              <RoundIconButton
                key={index}
                index={index}
                onPress={this.actionSelected}
                icon={value}
              />
            ))
          }
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={this.state.sms}
          cancelButtonIndex={0}
          onPress={(index) => {
            if (index !== 0) {
              this.onSendMessageSelected(this.state.sms[index]);
            }
          }}
        />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  addressText: {
    marginVertical: 2,
    fontSize: 18,
  },
  addressTextTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  containerContactAction: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default CardContact;
