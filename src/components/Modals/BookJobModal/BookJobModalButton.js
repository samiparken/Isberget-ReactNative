import React from 'react';
import {
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import theme from '../../../config';

const BookJobModalButton = props => (
  <TouchableOpacity
    style={[ styles.button,
      props.disabled ? styles.disabled : styles.enabled
    ]}
    onPress={() => props.onPress(props.index)}>
    <Text style={props.text.split(" ").length > 1 ? styles.longText : styles.text}>{props.text}</Text>
    <Image
      source={props.index === 0 ? theme.ICON_BOOK_JOB_WHITE : theme.ICON_MAIL_WHITE}
      style={styles.icon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: theme.COLOR_PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 40,
  },
  enabled: {
    backgroundColor: theme.COLOR_PRIMARY,
  },
  disabled: {
    backgroundColor: theme.COLOR_GREY,
  },
  text: {
    fontSize: 18,
    color: theme.COLOR_WHITE,
    marginRight: 5,
  },
  longText: {
    fontSize: 15,
    color: theme.COLOR_WHITE,
    marginRight: 5,
  },
  icon: {
    paddingRight: 3,
    paddingTop: 3,
  },
});

export default BookJobModalButton;