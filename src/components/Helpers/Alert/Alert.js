import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';

const Alert = (props) => {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    setIsHidden(false);

    setTimeout(() => {
      setIsHidden(true);
    }, props.timeout ?? 2000);

  }, [props.message]);

  const getMessage = () => {
    if(props.message.includes('/')){
      return props.message.split('/')[0]
    }

    return props.message;
  }

  let color = theme.COLOR_ALERT_ERROR_TEXT;
  let backgroundColor = theme.COLOR_ALERT_ERROR_BACKGROUND;

  if (props.type === 'success') {
    color = theme.COLOR_ALERT_SUCCESS_TEXT;
    backgroundColor = theme.COLOR_ALERT_SUCCESS_BACKGROUND;
  }

  if (isHidden) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
      ]}
    >
      <Text
      style={[
        { color },
      ]}
      >{getMessage()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.IS_IPHONE_X() ?
    {
      paddingTop: 50,
      paddingBottom: 16,
    } :
    {
      paddingVertical: 24,
    },
  },
});

export default Alert;
