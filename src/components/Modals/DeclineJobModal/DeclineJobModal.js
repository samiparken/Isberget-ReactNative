import React from 'react';
import { 
	View,
	Modal,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Platform,
} from 'react-native';
import { connect } from 'react-redux';
import deviceStorage from '../../../services/deviceStorage';
import { declineJob } from '../../../store/actions/index';
import theme from '../../../config';

class DeclineJobModal extends React.Component {
	state = {
		icons: [],
		isLoading: false,
		message: ''
	}

	sendMessageHandler = () => {
		this.setState({
			isLoading: true,
		}); 
	}

	declineJob = () => {
		deviceStorage.getItem('user_id').then((id) => {
			const body = {
				'param1': this.props.data.OrderId,
				'param2': id,
				'param3': this.state.message,
			}  
			this.props.declineJob(body);
			this.props.toggleModal();
		});
	}

	render() {
		return (
			<Modal
				style={styles.modalContainer}
				transparent={true}
				visible={this.props.visible}
				animationType="fade"
				onRequestClose={() => this.props.toggleModal()}
			>
				<View style={styles.backgroundContainer}>
					<View style={styles.contentContainer}>
						<View>
							<View style={styles.header}>
								<Text style={styles.headerText}>Skriv ett meddelande</Text>
							</View>
							<TextInput
								multiline={true} 
								maxLength = {40}
								onChangeText={(message) => this.setState({ message })} 
								style={{ 
									height: 100,
									textAlignVertical: 'top',
									borderRadius: 5,
									borderWidth: 1,
									borderColor: theme.COLOR_GREY,
									marginHorizontal: 10,
								}}
							/>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.buttonStyle}
									onPress={() => this.props.toggleModal()}
								>
									<Text style={styles.textStyle}>{"Avbryt"}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.buttonStyle}
									onPress={() => this.declineJob()}
								>
									<Text style={styles.textStyle}>{"Neka jobb"}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
	},
	backgroundContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	contentContainer: {
		backgroundColor: 'rgba(255,255,255,0.95)',
		width: '100%',
		borderRadius: 10,
		paddingVertical: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
		paddingBottom: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.COLOR_GREY,
	},
	headerText: {
		...Platform.select({
			ios: {
				fontSize: '$windowWidth' >= '$iphonePLUS' ? 20 : 18,
			},
			android: {
				fontSize: 20,
			},
		}),
		fontWeight: 'bold',
	},  
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingTop: 10,
	},
	buttonStyle: {
		padding: 10,
		backgroundColor: theme.COLOR_PRIMARY,
		borderRadius: 5,
	},
	textStyle: {
		fontSize: 16,
		color: theme.COLOR_WHITE,
		textAlign: 'center'
	},
});

const mapStateToProps = (state) => ({
	jobs: state.acceptJobs,
});

const mapDispatchToProps = dispatch => ({
	declineJob: (data) => dispatch(declineJob(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeclineJobModal);
