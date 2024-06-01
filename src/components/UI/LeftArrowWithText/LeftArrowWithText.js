import React from 'react';
import {
	TouchableOpacity,
	Image,
	Text,
	Platform,
	StyleSheet,
} from 'react-native';
import theme from '../../../config';

const LeftArrowWithText = (props) => (
	<TouchableOpacity
		style={styles.button}
		onPress={props.onPress}
	>
		<Image source={theme.ICON_ARROW_LEFT_WHITE} />
		<Text style={[styles.text, {
			...Platform.select({
				ios: {
					fontSize: theme.SIZE_WINDOW_WIDTH >= theme.SIZE_IPHONE_PLUS ? 18 : 16,
				},
				android: {
					fontSize: 18,
				},
			})}]}
		>{props.date}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 8,
	},
	text: {
		color: theme.COLOR_WHITE,
	},
});

export default LeftArrowWithText;
