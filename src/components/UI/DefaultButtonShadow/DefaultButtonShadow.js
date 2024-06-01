import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import theme from '../../../config';

const defaultButtonShadow = props => (
  <TouchableOpacity 
    style={[styles.buttonContainer, props.disabled && styles.disabled]}
    {...props}
  >
    <Text 
      style={[
        styles.buttonText,
        props.isLoading && {marginRight: 10}
      ]}>{props.buttonTitle}
    </Text>
    { props.isLoading && <ActivityIndicator color='white' animating  /> }
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 15,
    backgroundColor: theme.COLOR_PRIMARY,
    borderRadius: 8,
    shadowOffset:{ width: 0, height: 2, },
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  }, 
  buttonText : {
    textAlign: 'center',
    fontWeight: 'normal',
    color: 'white',
    fontSize: 18,
  },
  disabled: {
    backgroundColor: theme.COLOR_GREY,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default defaultButtonShadow;
