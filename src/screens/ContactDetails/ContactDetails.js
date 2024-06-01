import React, { Component } from 'react';
import {
  ScrollView,
  Linking,
  ActionSheetIOS,
  StyleSheet,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ContactCard from '../../components/UI/ContactCard';
import { View } from 'native-base';

const contacts = [
  {
    name: 'Carl Palsson',
    phone: '0735-000096',
    position: 'VD',
    email: 'carl.palsson@installationspartner.se',
  },
  {
    name: 'Olof Watson',
    phone: '0735-360149',
    position: 'Affärsutvecklare',
    email: 'olof.watson@installationspartner.se',
  },
  {
    name: 'Lukas Larsson',
    phone: '0737-409788',
    position: 'Affärsutvecklare',
    email: 'lukas.larsson@installationspartner.se',
  },
  {
    name: 'Benny Hilding',
    phone: '0762-009391',
    position: 'IT',
    email: 'it@installationspartner.se',
  },
];

class ContactDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      item: null,
    }
  }

    onPerformAction = async (action) => {
      try {
        const supported = await Linking.canOpenURL(action);
        if (!supported) { console.log(`Can't handle url: ${action}`); } else { return Linking.openURL(action); }
      } catch (error) {
        alert('Ett fel uppstod...');
      }
    }

    contactSelected = (item) => {
      this.setState({
        item,
      });
      this.ActionSheet.show();
    }

    render() {
      return (
        <View style={{ flex: 1, backgroundColor: Platform.OS === 'ios' ? 'white' : 'transparent' }}> 
          <ScrollView contentContainerStyle={styles.container} >
            {
              contacts.map((value, index) => (
                <ContactCard
                  key={index}
                  item={value}
                  onPress={this.contactSelected}
                />
              ))
            }
            <ActionSheet
              ref={o => this.ActionSheet = o}
              options={['Skicka SMS', 'Skicka epost', 'Ringa', 'Avbryt']}
              title="Vad vill du göra?"
              destructiveButtonIndex={3}
              cancelButtonIndex={3}
              onPress={(index) => {
                if (index !== 0) {
                  let key = null;
                  let value = null;
                  switch (index) {
                  case 0:
                    key = 'sms';
                    value = this.state.item.phone;
                    break;
                  case 1:
                    key = 'mailto';
                    value = this.state.item.email;
                    break;
                  case 2:
                    key = 'tel';
                    value = this.state.item.phone;
                    break;
                  default:
                    return;
                  }
                  value = value.replace(' ', '');
                  value = value.replace('-', '');
                  this.onPerformAction(`${key}:${value}`);
                }
              }}
            />
          </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default ContactDetails;
