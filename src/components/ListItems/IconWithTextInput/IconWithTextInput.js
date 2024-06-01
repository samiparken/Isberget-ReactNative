import React from 'react';
import {
	Image,
	Text,
	StyleSheet,
} from 'react-native';
import RoundListItem from '../RoundListItem';

const IconWithTextInput = props => (
	<RoundListItem
		style={{paddingLeft: 5}}
		onPress={() => props.toggleModal(props.index, props.value)}>
		<Image
			source={props.icon}
			style={styles.icon}
		/>
		<Text style={styles.text}>{props.value}</Text>
	</RoundListItem>
);

const styles = StyleSheet.create({
	text: {
		flex: 1,
		fontSize: 16,
	},
	icon: {
		margin: 10,
	}
});

export default IconWithTextInput;