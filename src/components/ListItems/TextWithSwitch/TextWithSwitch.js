import React from 'react';
import { Text, Switch, StyleSheet } from 'react-native';
import RoundListItem from '../RoundListItem';

const TextWithSwitch = props => {
    return (
        <RoundListItem disabled>
            <Text style={styles.text}>{props.text}</Text>
            <Switch {...props} on/>
        </RoundListItem>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: 'black'
    }
});

export default TextWithSwitch;