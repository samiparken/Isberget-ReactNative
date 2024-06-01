import React from 'react';
import {
  Text,
  Platform,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';

const DefaultTextForListView = props => (
  <Text 
    style ={[styles.textView, props.style]}
    {...props}
    numberOfLines={2}> {props.textInput}
  </Text>
);

const styles = StyleSheet.create({
  textView: {
    ...Platform.select({
      ios: {
        fontSize: theme.SIZE_WINDOW_WIDTH === theme.SIZE_IPHONE_SE ? 12 : 14
      },
      android: {
        fontSize: 12,
      },
    }),
    marginHorizontal: 3,
    fontWeight: '500',
    marginVertical: 1,
  }
});

export default DefaultTextForListView;
