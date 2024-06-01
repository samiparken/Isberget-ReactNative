import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';

const RoundIconButton = ({
  onPress,
  index,
  icon,
  style,
}) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => onPress(index)}
  >
      <Image source={icon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLOR_PRIMARY,
    padding: 16,
    marginTop: 8,
    marginHorizontal: 4,
    borderRadius: 40,
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  }
});

export default RoundIconButton;
