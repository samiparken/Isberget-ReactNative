import React from 'react';
import {
	TouchableOpacity,
	Image,
	Text,
	Platform,
	StyleSheet,
} from 'react-native';
import theme from '../../../config';

const RightArrowWithText = (props) => (
    <TouchableOpacity
        style={styles.button}
        onPress={props.onPress}
    >
			<Text style={[
				styles.text,
				{
					...Platform.select({
						ios: {
							fontSize: theme.SIZE_WINDOW_WIDTH >= theme.SIZE_IPHONE_PLUS ? 18 : 16,
						},
						android: {
							fontSize: 18,
						},
					})
				}
			]}
			>{props.date}</Text>
			<Image source={theme.ICON_ARROW_RIGHT_WHITE} />
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 8,
	},
	text: {
		color: theme.COLOR_WHITE,
	},
});

export default RightArrowWithText;
