import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import SettingsListItem from '../../components/ListItems/SettingsListItem';
import { toggleShowWeekends, updateToDate, clearAllBookData, clearAllAcceptData } from '../../store/actions/index';
import deviceStorage from '../../services/deviceStorage';
import TextWithSwitch from '../../components/ListItems/TextWithSwitch';
import theme from '../../config';
import routes from '../../routes/index';
import screens from '../../routes/screens';
import ModalExitHeader from '../../components/Headers/ModalExitHeader';
import { Navigation } from 'react-native-navigation';

class Settings extends Component {
	state = {
	  options: [
	    'Konto',
	    'Notiser',
	    'App-genomgång',
	    'Kontaktuppgifter',
	    'Autosvar för SMS',
	  ],
	}

	onListItemSelected = (index) => {
	  let screen = null;
	  let title = null;
	  let navBarHidden = false;

	  switch (index) {
	  case 0:
	    screen = screens.ACCOUNT_SETTINGS;
	    title = 'Konto';
	    break;
	  case 1:
	    screen = screens.NOTIFICATION_SETTINGS;
	    title = 'Notiser';
	    break;
	  case 2:
	    screen = screens.APP_WALKTHROUGH;
	    title = '';
	    navBarHidden = true;
	    break;
	  case 3:
	    screen = screens.CONTACT_DETAILS;
	    title = 'Kontaktuppgifter';
	    break;
	  case 4:
	    screen = screens.SMS_SETTINGS;
	    title = 'Autosvar för SMS';
	    break;
	  default:
	    break;
	  }
	  this.onPushNewScreen(screen, title, navBarHidden);
	}

	onPushNewScreen = (screen, title, navBarHidden) => {
	  if (navBarHidden) {
		routes.showModal(screen, !navBarHidden);
	  } else {
		routes.changeScreen(this.props.componentId, screen, title, !navBarHidden);
	  }
	}

	onLogoutSelected = async () => {
	  this.props.onClearAllAcceptData();
	  this.props.onClearAllBookData();
	  const clearAllItems = await deviceStorage.clearItems();
	  if (clearAllItems) {
		  routes.newLoginScreen();
	  }
	}

	onWeekendJobsToggled = () => {
	  const newValue = this.props.bookJobs.showWeekend ? '0' : '1';
	  deviceStorage.saveItem('showWeekend', newValue);
	  this.props.onToggleShowWeekends(this.props.bookJobs);
	  this.props.onUpdateAccToDate(!this.props.bookJobs.showWeekend);
	}

	onExit = () => {
		Navigation.pop(this.props.componentId);
	}

	render() {
	  return (
		<ScrollView style={styles.scrollView}>
			<ModalExitHeader toggleModal={this.onExit} />
			<TouchableWithoutFeedback
				onPress={Keyboard.dismiss}
				style={styles.flex}
			>
				<View style={styles.container}>
					{this.state.options.map((value, index) => (
						<SettingsListItem
							title={value}
							onPress={this.onListItemSelected}
							index={index}
												key={value}
							icon={theme.ICON_ARROW_RIGHT_GREY}
						/>
					))}
					<TextWithSwitch
						value={this.props.bookJobs.showWeekend}
						text="Visa lördag & söndag"
						onValueChange={() => this.onWeekendJobsToggled()}
					/>
					<TouchableOpacity
						onPress={this.onLogoutSelected}
						style={styles.logoutButton}
					>
						<Text style={styles.logoutText}>Logga ut</Text>
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
	    </ScrollView>
	  );
	}
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.COLOR_WHITE,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  sectionTitle: {
    fontWeight: '100',
    fontSize: 16,
    margin: 8,
    alignSelf: 'flex-start',
  },
  logoutButton: {
    backgroundColor: theme.COLOR_RED,
    paddingVertical: 15,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3, // Android
    shadowColor: theme.COLOR_LIGHT_GREY, // iOS
    shadowOffset: { height: 0, width: 2 }, // iOS
    shadowOpacity: 1, // iOS
    shadowRadius: 8, // iOS
  },
  logoutText: {
    color: theme.COLOR_WHITE,
    fontWeight: '600',
    fontSize: 18,
  },
});

const mapStateToProps = state => ({
  bookJobs: state.bookJobs,
  connection: state.connection,
});

const mapDispatchToProps = dispatch => ({
  onToggleShowWeekends: data => dispatch(toggleShowWeekends(data)),
  onUpdateAccToDate: showWeekend => dispatch(updateToDate(showWeekend)),
  onClearAllBookData: () => dispatch(clearAllBookData()), 
  onClearAllAcceptData: () => dispatch(clearAllAcceptData()), 
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
