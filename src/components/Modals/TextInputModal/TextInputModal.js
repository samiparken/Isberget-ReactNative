import React, {Component} from 'react';
import {
	View,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TextInput,
	Text,
	StyleSheet,
} from 'react-native';
import theme from '../../../config';

class AccountSettingsModal extends Component {
	state = {
		value: '',
		newValue: '',
		confirmNewValue: '',
	}

	onSubmit = () => {
		if (this.props.index === 3 && this.onValidPassword()) {
			this.props.onSettingChanged(this.props.index, this.state.newValue);
		} else {
			this.props.onSettingChanged(this.props.index, this.state.value);
		}
		this.resetState();
	}

	onValidPassword = () => {
		return this.state.newValue != '' &&
			this.state.newValue === this.state.confirmNewValue;
	}

	onSubmitValid = () => {
		if (this.props.index === 3) {
			return this.onValidPassword();
		} else {
			return this.state.value !== '';
		}
	}

	onCloseModal = () => {
		this.resetState();
		this.props.toggleModal();
	}

	resetState = () => {
		this.setState({
			value: '',
			newValue: '',
			confirmNewValue: '',
		});
	}

	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.props.visible}
				onRequestClose={() => {this.onCloseModal()}}
			>
				<TouchableWithoutFeedback onPress={this.onCloseModal}>
					<View style={styles.backgroundContainer}>
						<View style={styles.container}>
							<Text style={styles.title}>{this.props.title}</Text>
							<TextInput
								style={styles.textInput}
								underlineColorAndroid='transparent'
								clearButtonMode="always"
								autoCapitalize = 'none'
								value={this.props.value}
								onChangeText={value => this.setState({value})}
								{...this.props}
							/>
							{
								this.props.index === 3 && (
									<View style={{width: '100%', alignItems: 'center'}}>
										<Text style={styles.title}>{"Nytt lösenord"}</Text>
										<TextInput
											style={styles.textInput}
											underlineColorAndroid='transparent'
											clearButtonMode="always"
											autoCapitalize='none'
											{...this.props}
											value={this.state.newValue}
											onChangeText={newValue =>
													this.setState({newValue})}
										/>
										<Text style={styles.title}>{"Repetera nytt lösenord"}</Text>
										<TextInput
											style={styles.textInput}
											underlineColorAndroid='transparent'
											clearButtonMode="always"
											autoCapitalize='none'
											{...this.props}
											value={this.state.confirmNewValue}
											onChangeText={confirmNewValue =>
												this.setState({confirmNewValue})}
										/>
									</View>
								)
							}
							<View style={{flexDirection: 'row'}}>
									<TouchableOpacity
										style={[
											styles.buttonContainer,
											{
												backgroundColor: theme.COLOR_RED,
												marginRight: 5,
											}
										]}
										onPress={() => this.onCloseModal()}
									>
										<Text style={[styles.submitText, styles.textButton]}>Avbryt</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.buttonContainer,
											{
												marginLeft: 5,
												backgroundColor: this.onSubmitValid() ?
													theme.COLOR_PRIMARY : theme.COLOR_GREY
											}
										]}
										onPress={() => this.onSubmit()}
										disabled={!this.onSubmitValid()}
									>
										<Text style={styles.textButton}>{"Spara"}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		);
	}
}


const styles = StyleSheet.create({
	backgroundContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	container: {
		backgroundColor: theme.COLOR_WHITE,
		borderRadius: 8,
		width: '90%',
		paddingTop: 10,
		paddingBottom: 15,
		paddingHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textInput: {
		width: '95%',
		borderBottomColor: theme.COLOR_LIGHT_GREY,
		borderBottomWidth: 2,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginBottom: 20,
		fontSize: 18,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: theme.COLOR_GREY,
		marginBottom: 20,
		marginTop: 10,
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		flex: 1,
		height: 40,
	},
	textButton: {
		color: theme.COLOR_WHITE,
		fontSize: 18,
	}
});

export default AccountSettingsModal;