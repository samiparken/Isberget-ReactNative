import React from 'react';
import {
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import theme from '../../../config';

const DefaultButtonForListView = props => {
  const width = Platform.OS === 'ios' && theme.SIZE_WINDOW_WIDTH !== theme.SIZE_IPHONE_SE 
    ? 42 : 38;
  const height = Platform.OS === 'ios' && theme.SIZE_WINDOW_WIDTH !== theme.SIZE_IPHONE_SE 
    ? 42 : 38;

  return (
    <TouchableOpacity
      onPress={() => { props.onPress(props.index, props.data, props.answers); }}
      style={{ 
        ...styles.button, 
        width: props.big ? 50 :  width, 
        height: props.big ? 50 :  height, 
      }}
    >
      <Image source={props.source} />
      {props.answers 
        && props.answers.length > 0 
        && ((props.index === 1 && props.fromAcceptcreen) || (props.index === 0 && !props.fromAcceptcreen))
        && <View style={styles.badge}>
          <Text style={{ color: 'white', }}>{props.answers.length}</Text>
      </View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.COLOR_WHITE,
    borderRadius: 50,
    padding: Platform.OS === 'ios' ? 8 : 12,
    marginHorizontal: 6,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: theme.COLOR_GREY,
    shadowOpacity: 1,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'red',
    flexDirection: 'column',
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DefaultButtonForListView;
