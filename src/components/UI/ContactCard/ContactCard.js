import React from 'react';
import {
	TouchableOpacity,
	Text,
	Dimensions,
	StyleSheet,
} from 'react-native';
import theme from '../../../config';

const { width } = Dimensions.get('window');

const ContactCard = props => (
	<TouchableOpacity
	style={styles.container}
	onPress={() => props.onPress(props.item)}>
		<Text style={styles.titleText}>{props.item.name}</Text>
		<Text style={styles.subTitleText}>{props.item.position}</Text>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.COLOR_WHITE,
		width: (width / 2) - 20,
		marginHorizontal: 5,
		marginVertical: 5,
		paddingVertical: 15,
		paddingHorizontal: 5,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		shadowColor: theme.COLOR_LIGHT_GREY,
		shadowOpacity: 0.5,
		shadowRadius: 8,
		shadowOffset: {width: 0, height: 2},
		elevation: 2,
	},
	titleText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.COLOR_PRIMARY,
		textAlign: 'center',
	},
	subTitleText: {
		fontSize: 16,
		fontWeight: 'normal',
		color: theme.COLOR_GREY,
	}
});

export default ContactCard;
