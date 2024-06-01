import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';

const Spinner = () => (
  <View style={styles.container}>
    <ActivityIndicator
      color={theme.COLOR_PRIMARY}
      size='large'
    />
    <Text style={styles.text}>{'Laddar...'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLOR_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginVertical: 10,
    color: theme.COLOR_PRIMARY,
    fontSize: 20,
  }
});

export default Spinner;
