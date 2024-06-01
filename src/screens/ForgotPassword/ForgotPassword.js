import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import DefaultTextInput from '../../components/UI/DefaultTextInput';
import DefaultButtonShadow from '../../components/UI/DefaultButtonShadow';
import { API } from '../../api/ApiHandler';
import emailValidation from '../../utils/Validation';
import theme from '../../config';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
        emailInput: ''
    };
  }

  onSendButtonPressed = () => {
    if (emailValidation(this.state.emailInput)) { 
      this.forgotPasswordRequest(this.state.emailInput);
    }
  }

  forgotPasswordRequest = (email) => {
    API.post('/api/account/forgotpassword', {email}).then((res) => {
     console.log(res);
      Alert.alert('E-post skickad', 'Instruktioner har nu skickats till din e-postadress.');
    })
    .catch((err) => {
      //console.log(err.modelState['']);
      Alert.alert('Felaktig e-postadress', String(err.modelState['']));
    });
  }

  render() {        
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ios: 'padding'})}
        enabled
      >
        <View style={styles.logo}>
          <Image source={theme.ICON_LOGO} />
        </View>
        <View>
          <Text
            style={[
              styles.centerText,
              styles.subTitle,
            ]}
          >{"Fyll i din e-postadress nedan så skickar vi dig instruktioner om hur du ändrar ditt lösenord."}
          </Text>
          <View style={styles.formView}>
            <DefaultTextInput
              label="E-post"
              onChangeText={(emailInput) => this.setState({emailInput})}
              autoCorrect={false}
              autoCapitalize = 'none'
              keyboardType= 'email-address'
            />
            <DefaultButtonShadow
              buttonTitle="Skicka"
              onPress={this.onSendButtonPressed}
              disabled={!emailValidation(this.state.emailInput)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    flex: 1,
  },
  centerText: {
    textAlign: 'center',
    margin: 5,
  },
  logo: {
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 16,
    paddingHorizontal: 40,
    color: 'grey',
    marginBottom: 24,
    textAlign: 'center',
  },
  formView: {
    marginHorizontal: 30,
  },
});