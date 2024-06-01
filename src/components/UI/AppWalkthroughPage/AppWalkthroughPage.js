import React from 'react';
import { 
	View,
	TouchableOpacity,
	Image,
	Text,
	Platform,
	StyleSheet,
} from 'react-native';
import theme from '../../../config';

const AppWalkthroughPage = props => (
    <View style={styles.container}>
        <TouchableOpacity
					style={styles.icon}
					onPress={props.onClose}>
					<Image
						source={theme.ICON_EXIT_GREY}
						style={{flex: 1}}
					/>
        </TouchableOpacity>
        <Image
					source={require('../../../assets/phone.png')}
					style={styles.mainImage}
					resizeMode='contain'
        />
        <View styles={styles.textContainer}>
					<Text style={styles.title}>{props.title}</Text>
					<Text style={styles.textArea}>{props.text}</Text>
        </View>
        <View style={styles.navigationContainer}>
        <TouchableOpacity
					onPress={() => props.onChangePage(props.index - 1)}>
					<Image
						source={theme.ICON_ARROW_LEFT_BLUE}
						style={styles.arrow}
					/>
        </TouchableOpacity>
        {
            props.lastPage ?
            (
                <TouchableOpacity
                    onPress={props.onClose}
                    style={styles.doneContainer}>
                    <Text
                        style={styles.doneText}>
                        {"Klar".toUpperCase()}</Text>
                </TouchableOpacity>
            ) :
            (
                <TouchableOpacity
                    style={styles.arrowContainer}
                    onPress={() => props.onChangePage(props.index + 1)}>
                    <Image
											source={theme.ICON_ARROW_RIGHT_BLUE}
											style={styles.arrow}
                    />
                </TouchableOpacity>
            )
        }
        </View>
    </View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 0 : 8,
		right: 8,
	},
	mainImage: {
		width: '90%',
		height: '50%',
		marginBottom: 10,
	},
	textContainer: {
		width: '90%',
		flex: 1,
		alignItems: 'flex-start',
		backgroundColor: theme.COLOR_LIGHT_GREY,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	textArea: {
		fontSize: 18,
	},
	navigationContainer: {
		width: '95%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		bottom: 8,
	},
	arrow: {
		flex: 1,
	},
	doneContainer: {
		borderWidth: 2,
		borderColor: theme.COLOR_PRIMARY,
		borderRadius: 3,
		paddingHorizontal: 3,
		alignItems: 'center',
		justifyContent: 'center',
		height: 30,
	},
	doneText: {
		color: theme.COLOR_PRIMARY,
		fontWeight: '700',
		fontSize: 16,
	}
});

export default AppWalkthroughPage;
