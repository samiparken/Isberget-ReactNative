import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';

const MapFilterIcon = ({
  type,
  source,
  onPress,
  unselected,
}) => (
  <TouchableOpacity
    style={[
      styles.container,
      unselected && styles.unSelected,
    ]}
    onPress={() => {onPress(type)}}    
  >
    <Image source={source} />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowOffset: {height: 2, width: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: theme.COLOR_WHITE,
    padding: 8,
    borderRadius: 8,
  },
  unSelected: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  }
});

export default MapFilterIcon;
