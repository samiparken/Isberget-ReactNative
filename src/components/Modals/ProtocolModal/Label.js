import React from 'react';
import {Text} from 'react-native';
import theme from '../../../config';

const Label = ({text}) => (
  <Text
    style={{
      fontSize: 16,
      color: theme.COLOR_PRIMARY_EXTRA_DARK,
      fontWeight: 'bold',
      marginLeft: 4,
      marginBottom: 8,
      marginTop: 30
    }}>{text}</Text>
);
export default Label;