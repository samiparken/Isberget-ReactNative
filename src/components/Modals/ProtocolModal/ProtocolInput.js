import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { func, string, number } from 'prop-types';
import DefaultTextInput from '../../UI/DefaultTextInput';
import theme from '../../../config';

const ProtocolInput = props => (
  <View style={styles.container}>
    <DefaultTextInput
      {...props}
      style={styles.textInput}
      onChangeText={(text) => {
        if (props.stateKey) {
          props.onInputChange(text, props.stateKey);
        } else if (props.type) {
          props.onInputChange(text, props.type, props.index);
        } else {
          props.onInputChange(text);
        }
      }}
    />
    {
      props.icon && (
        <TouchableOpacity
          onPress={() => props.onRemove(props.index)}
          style={styles.button}
        >
          <Image
            style={styles.image}
            source={props.icon}
          />
        </TouchableOpacity>
      )
    }
  </View>
);

ProtocolInput.propTypes = {
  onInputChange: func,
  onRemove: func,
  stateKey: number,
  index: number,
  icon: string,
  type: string,
};

ProtocolInput.defaultProps = {
  onInputChange: null,
  onRemove: null,
  icon: null,
  type: null,
};

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    maxWidth: '100%',
    marginBottom: 10,
    flex: 1,
  },
  button: {
    backgroundColor: theme.COLOR_RED,
    borderRadius: 15,
    height: 30,
    width: 30,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProtocolInput;
