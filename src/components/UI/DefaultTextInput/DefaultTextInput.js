import React from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View
} from 'react-native';
import theme from '../../../config';

const DefaultTextInput = props => (
  <View style={props.style}>
    {props.label && <Text style={styles.label}>{props.label}</Text>}
    <TextInput 
      underlineColorAndroid='transparent'
      clearButtonMode="while-editing"
      {...props}
      style={[styles.textInput, props.commentStyle]} 
    />
  </View>
);

const styles = StyleSheet.create ({
  textInput: {
    fontSize: 18,
    fontWeight: '200',
    height: 50,
    color: theme.COLOR_LIGHT_BLACK,
    marginBottom: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: theme.COLOR_GREY,
  },
  label: {
    fontSize: 16,
    color: theme.COLOR_LIGHT_BLACK,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default DefaultTextInput;
