import React from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';

const ModalExitHeader = ({
  toggleModal,
}) => (
  <TouchableOpacity style={styles.container} onPress={toggleModal}>
    <Image source={theme.ICON_DECLINE} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.COLOR_WHITE,
    borderRadius: 12,
    zIndex: 10,
  },
});

export default ModalExitHeader;
