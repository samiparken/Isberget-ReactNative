import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import emailValidation from '../../../utils/Validation';
import theme from '../../../config';

const clicked = (text) => {
  if (emailValidation(text)) {
    Linking.canOpenURL(`mailto:${text}`).then((supported) => {
      if (!supported) {
        console.log('Can\'t handle url: ' + `mailto:${text}`);
      } else {
        return Linking.openURL(`mailto:${text}`);
      }
    }).catch(err => console.log('An error occurred', err));
  } else {
    Linking.canOpenURL(`tel:${text}`).then((supported) => {
      if (!supported) {
        console.log('Can\'t handle url: ' + `tel:${text}`);
      } else {
        return Linking.openURL(`tel:${text}`);
      }
    }).catch(err => console.error('An error occurred', err));
  }
};

const ClickableIconWithText = props => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => { clicked(props.text); }}
  >
    <Image
      style={styles.icon}
      source={props.source}
      resizeMode="contain"
    />
    <Text style={styles.text}>{props.text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'center',
    backgroundColor: theme.COLOR_PRIMARY,
    padding: 8,
    borderRadius: 8,
  },
  icon: {
    padding: 0,
    marginRight: 10,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    justifyContent: 'flex-start',
    fontSize: 18,
  },
});


export default ClickableIconWithText;
