import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewPropTypes,
} from 'react-native';
import { func, number, any } from 'prop-types';
import theme from '../../../config';

const MapActionButton = ({
  style,
  onPress,
  size,
  icon,
}) => (
  <TouchableOpacity
    style={[
      styles.container,
      style,
      { width: size, height: size, borderRadius: size / 2 },
    ]}
    onPress={onPress}
  >
    <Image
      style={{ width: size - 16, height: size - 16 }}
      source={icon}
    />
  </TouchableOpacity>
);

MapActionButton.propTypes = {
  size: number,
  onPress: func.isRequired,
  style: ViewPropTypes.style,
  icon: any,
};

MapActionButton.defaultProps = {
  size: 20,
  style: null,
  icon: null,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLOR_WHITE,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapActionButton;
