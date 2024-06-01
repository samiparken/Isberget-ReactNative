import React, {Component} from 'react';
import {
	View,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
	StyleSheet,
} from 'react-native';
import IconWithTextInput from '../../components/ListItems/IconWithTextInput';
import TextInputModal from '../../components/Modals/TextInputModal';
import SettingsListItem from '../../components/ListItems/SettingsListItem';
import { connect } from 'react-redux';
import theme from '../../config';

const icons = [
	theme.ICON_USER_GREY,
	theme.ICON_HOUSE_GREY,
	theme.ICON_MAIL_GREY,
];

class AccountSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accountSettings: [
				{
					value: props.auth.name,
					title: 'Namn',
				},
				{
					value: props.auth.address,
					title: 'Adress',
				},
				{
					value: props.auth.email,
					title: 'E-post',
				},
				{
					value: props.auth.password,
					title: 'Gammalt lösenord',
				}
			],
			modalVisible: false,
			modalProps: {
				secureTextEntry: false,
				keyboardType: 'default',
				index: null,
				value: '',
				title: '',
			}
		}
	}
    
    onSettingChanged = (index, value) => {
        this.setState(prevState => {
            const newState = prevState.accountSettings;
            newState[index].value = value;
            return {
                accountSettings: newState
            }
        });
        this.toggleModal();
    }

    toggleModal = (index = null, value = '') => {

        const title = index === null ? '' : this.state.accountSettings[index].title
        
        this.setState(prevState => ({
            modalVisible: !prevState.modalVisible,
            modalProps: {
                secureTextEntry: index === 3 ? true : false,
                keyboardType: index === 2 ? 'email-address' : 'default',
                index,
                value,
                title
            }
        }));
    }

	render () {
		return (
			<ScrollView
				style={styles.flex}
				keyboardShouldPersistTaps='always'
			>
				<TouchableWithoutFeedback
					onPress={Keyboard.dismiss}
					style={styles.flex}
				>
					<View style={styles.container}>
						{
							this.state.accountSettings.map((item, index) => {
								return index < this.state.accountSettings.length - 1 && (
									<IconWithTextInput
										value={item.value}
										icon={icons[index]}
										key={index}
										index={index}
										toggleModal={this.toggleModal}
									/>
								)
							})
						}
						<SettingsListItem
							title={"Ändra lösenord"}
							onPress={this.toggleModal}
							index={this.state.accountSettings.length - 1}
							style={{marginTop: 16}}
							icon={theme.ICON_LOCK_GREY}
						/>
						<TextInputModal
							visible={this.state.modalVisible}
							{...this.state.modalProps}
							toggleModal={this.toggleModal}
							onSettingChanged={this.onSettingChanged}
						/>
					</View>
				</TouchableWithoutFeedback>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
		backgroundColor: Platform.OS === 'ios' ? 'white' : 'transparent',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		marginTop: 20,
	},
});

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(AccountSettings);
