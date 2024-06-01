import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../../config';

const RoundListItem = props => (
  <TouchableOpacity
    {...props}
    style={[styles.container, props.style]}
  >
    {props.children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 52,
    width: '95%',
    backgroundColor: theme.COLOR_WHITE,
    paddingLeft: 16,
    paddingRight: 10,
    borderRadius: 10,
    paddingVertical: 8,
    marginBottom: 4,
    marginTop: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});

export default RoundListItem;
