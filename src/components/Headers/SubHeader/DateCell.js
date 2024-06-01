import React from 'react';
import {
	TouchableOpacity,
	Text,
	View,
	StyleSheet,
} from 'react-native';
import { convertTo } from '../../../utils/DateHandler';
import JobIndicator from './JobIndicator';
import theme from '../../../config';

const DateCell = props => (
	<TouchableOpacity
		style={[
			styles.container,
			props.selected ? styles.selected : styles.unselected,
		]}
		disabled={props.disabled}
		onPress={() => {
			const date = props.selected ? null : props.date;
			props.onToggleSelectedDate(date);
		}}
	>
		<Text style={styles.text}>
			{convertTo(props.date, 'DD/MM')}
		</Text>
		<View style={styles.indicatorContainer}>
			{
				props.jobs.map(job => {
					const color = job.status === 1 ? theme.COLOR_YELLOW : theme.COLOR_GREEN;
					return <JobIndicator key={Math.random()} color={color}/>;
				})
			}
		</View>
		{ props.disabled && <View style={styles.disabled} />}
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	container: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			borderLeftWidth: 0.5,
			borderRightWidth: 0.5,
			borderLeftColor: theme.COLOR_GREY,
			borderRightColor: theme.COLOR_GREY,
	},
	text: {
			paddingVertical: 5,
	},
	indicatorContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			height: 15,
	},
	selected: {
			backgroundColor: theme.COLOR_LIGHT_GREY,
	},
	unselected: {
			backgroundColor: 'white',
	},
	disabled: {
			backgroundColor: theme.COLOR_WHITE_TRANSPARENT,
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
	},
});

export default DateCell;