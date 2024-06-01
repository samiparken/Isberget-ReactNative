import React from 'react';
import { View, Text } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import theme from '../../../config'; 

const radio_props = [
    {label: 'Nej', value: false },
    {label: 'Ja', value: true }
];

const ProtocolRadioForm = (props) => (
    <View style={{marginVertical: 8}}>
        <Text
            style={{
                fontSize:16,
                marginBottom: 8,
                color: theme.COLOR_LIGHT_BLACK,
                alignSelf: 'flex-start'
            }}
        >{props.titleValue}</Text>
        <View style={{marginLeft: 10}}>
            <RadioForm
                radio_props={radio_props}
                initial={props.value}
                formHorizontal={true}
                labelHorizontal={false}
                buttonColor={theme.COLOR_GREY}
                animation={true}
                borderWidth={2}
                onPress={(value) => {props.onPress(value, props.stateKey)}}
            />
        </View>
    </View>
);

export default ProtocolRadioForm;
