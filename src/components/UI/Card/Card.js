import React from 'react';
import { View } from 'react-native';
import theme from '../../../config';

const Card = ({ children }) => (
  <View style={{ padding: 4 }}>
    <View style={theme.STYLE_CARD}>
      {children}
    </View>
  </View>
);
export default Card;
