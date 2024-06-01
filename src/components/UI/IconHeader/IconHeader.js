import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';

const IconHeader = ({
  toggleModal,
  style,
  source
}) => (
 
  <TouchableOpacity
    style={style ? style : styles.button}
    onPress={toggleModal}
  >
    <Image source={source ? theme.ICON_USER_GREY :theme.ICON_CALENDAR_WHITE} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
  },
});

export default IconHeader;