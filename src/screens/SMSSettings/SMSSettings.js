import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import TextInputModal from '../../components/Modals/TextInputModal';
import IconWithTextInput from '../../components/ListItems/IconWithTextInput';
import deviceStorage from '../../services/deviceStorage';
import theme from '../../config';

class SMSSettings extends Component {
	state = {
	  smsSettings: [],
	  modalVisible: false,
	  modalProps: {
	    index: null,
	    value: '',
	  },
	}

	async componentDidMount() {
	  const smsSettings = [];
	  for (let i = 0; i < 3; i++) {
	    let sms = await deviceStorage.getItem(`sms${i}`);
	    if (!sms) sms = `Autosvar nummer ${i}`;
	    smsSettings.push(sms);
	  }
	  this.setState({ smsSettings });
	}

	onSettingChanged = (index, value) => {
	  this.setState((prevState) => {
	    const { smsSettings } = prevState;
	    smsSettings[index] = value;
	    return {
	      ...prevState,
	      smsSettings,
	    };
	  });
	  deviceStorage.saveItem(`sms${index}`, value);
	  this.toggleModal();
	}

	toggleModal = (index = null, value = '') => {
	  this.setState(prevState => ({
	    modalVisible: !prevState.modalVisible,
	    modalProps: {
	      index,
	      value,
	    },
	  }));
	}

	render() {
	  return (
  <ScrollView
  style={styles.flex}
  keyboardShouldPersistTaps="always"
	    >
  <TouchableWithoutFeedback
	        onPress={Keyboard.dismiss}
	        style={styles.flex}
	      >
	        <View style={styles.container}>
      {
	            this.state.smsSettings.map((item, index) => (
	              <IconWithTextInput
	                value={item}
	                icon={theme.ICON_SMS_BLUE}
	                key={index}
	                index={index}
    toggleModal={this.toggleModal}
  />
	            ))
	          }
      <TextInputModal
	            visible={this.state.modalVisible}
	            {...this.state.modalProps}
  title="Ange önskat meddelande för autosvar"
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

export default connect(mapStateToProps)(SMSSettings);
