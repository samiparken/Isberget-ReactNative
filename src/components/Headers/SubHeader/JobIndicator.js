import React from 'react';
import { View } from 'react-native';


const JobIndicator = props => (
    <View {...props} style={{
        backgroundColor: props.color,
        height: 8,
        width: 8,
        borderRadius: 15,
        margin: 3,
        borderColor: 'rgba(0,0,0,0.7)',
        borderWidth: 0.5,
    }}/>
);
export default JobIndicator;