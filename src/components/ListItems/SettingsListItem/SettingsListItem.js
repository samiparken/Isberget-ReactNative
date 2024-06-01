import React from 'react';
import {
	Text,
	Image,
	StyleSheet,
} from 'react-native';
import RoundListItem from '../RoundListItem';
import theme from '../../../config';

const SettingsListItem = props => (
	<RoundListItem
		style={props.style}
		onPress={() => props.onPress(props.index)}
	>
		<Text style={styles.title}>{props.title}</Text>
		<Image source={props.icon} />
	</RoundListItem>
);

const styles = StyleSheet.create({
	title: {
		color: theme.COLOR_BLACK,
		fontSize: 18,
		fontWeight: 'normal',
	},
});

export default SettingsListItem;
