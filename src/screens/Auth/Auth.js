import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import { getUniqueId } from 'react-native-device-info';
import moment from 'moment';
import { tryAuth, postDeviceToken } from '../../store/actions/index';
import DefaultTextInput from '../../components/UI/DefaultTextInput';
import DefaultButtonShadow from '../../components/UI/DefaultButtonShadow';
import theme from '../../config';
import Alert from '../../components/Helpers/Alert';
import deviceStorage from '../../services/deviceStorage';
import routes from '../../routes';
import validEmail from '../../utils/Validation';
import screens from '../../routes/screens';
import Spinner from '../../components/UI/Spinner';
import DeviceInfo from 'react-native-device-info';

class Auth extends Component {
  state = {
    checked: false,
    email: '',
    password: '',
    initialLoading: true,
  }

  async componentDidMount() {
    const rememberMe = await deviceStorage.getItem('remember');
    const isInstaller = await deviceStorage.getItem('isInstaller');

    if (rememberMe === '1') {
      const expiryDate = await deviceStorage.getItem('tokenExpiration');
      if (moment().diff(expiryDate, 'days') >= -1) {
        const authData = {
          email: await deviceStorage.getItem('email'),
          password: await deviceStorage.getItem('password'),
        };
        await this.props.onTryAuth(authData);
      }
      const userId = await deviceStorage.getItem('user_id');
      const deviceToken = await deviceStorage.getItem('deviceToken');
      const payload = {
        userId,
        deviceId: getUniqueId(),
        devicePlatform: Platform.OS,
        deviceToken,
      };

      this.props.onPostDeviceToken(payload);
      if (isInstaller === 'true') {
        routes.startMainTabsInstaller();
      } else {
        routes.startMainTabsAdmin();
      }
    }
    else{
      this.setState({ initialLoading: false });
    }
  }

  toggleCheckBox = () => {
    this.setState(prevState => ({
      checked: !prevState.checked,
    }));
  };

  onLoginButtonPressed = async () => {
    const authData = {
      email: this.state.email,
      password: this.state.password,
    };
    const res = await this.props.onTryAuth(authData);
    if (res) {
      if (this.state.checked) {
        await deviceStorage.saveItem('remember', '1');
        await deviceStorage.saveItem('email', this.state.email);
        await deviceStorage.saveItem('password', this.state.password);
      }
      const userId = await deviceStorage.getItem('user_id');
      const deviceToken = await deviceStorage.getItem('deviceToken');
      const payload = {
        userId,
        deviceId: getUniqueId(),
        devicePlatform: Platform.OS,
        deviceToken,
      };

      this.props.onPostDeviceToken(payload);
      const isInstaller = await deviceStorage.getItem('isInstaller');
      if (isInstaller === 'true') {
        routes.startMainTabsInstaller();
      } else {
        routes.startMainTabsAdmin();
      }
    }
  };

  onForgotPasswordPressed = () => {
    routes.changeScreen(this.props.componentId, screens.FORGOT_SCREEN);
  };

  render() {
    const { data } = this.props;

    if(this.state.initialLoading){
      return <Spinner />;
    }

    return (
      <SafeAreaView style={styles.flex}>
        {data.error && <Alert message={data.error} />}
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={
            Platform.select({
              ios: () => 0,
              android: () => -450,
            })()
          }
          style={styles.flex}
        >
          <TouchableWithoutFeedback
            style={styles.flex}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.container}>
              <View style={styles.logo}>
                <Image source={theme.ICON_LOGO} />
              </View>
              <DefaultTextInput
                label="E-post"
                keyboardType="email-address"
                returnKeyType="next"
                autoCorrect={false}
                autoCapitalize="none"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
              <DefaultTextInput
                secureTextEntry
                label="Lösenord"
                returnKeyType="go"
                autoCorrect={false}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
              <CheckBox
                left
                title="Kom ihåg mig"
                onPress={this.toggleCheckBox}
                onIconPress={this.toggleCheckBox}
                checked={this.state.checked}
                containerStyle={styles.checkBox}
              />
              <DefaultButtonShadow
                onPress={this.onLoginButtonPressed}
                buttonTitle="Logga in"
                isLoading={data.isLoading}
                disabled={!validEmail(this.state.email) || this.state.password.length === 0}
              />
              <TouchableOpacity
                style={styles.forgotPassContainer}
                onPress={this.onForgotPasswordPressed}
              >
                <Text
                  style={styles.forgotPassText}
                >
Glömt Lösenord?

                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <Text style={styles.versionText}>
          {DeviceInfo.getVersion()}
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'white' : 'transparent'
  },
  container: {
    paddingHorizontal: 40,
    paddingTop: 20,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 50,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  checkBox: {
    borderWidth: 0,
    width: 150,
    marginLeft: 0,
    backgroundColor: Platform.OS === 'ios' ? theme.COLOR_WHITE : 'transparent',
  },
  forgotPassContainer: {
    marginTop: 20,
    marginHorizontal: 70,
  },
  forgotPassText: {
    color: theme.COLOR_LIGHT_BLACK,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  versionText: {
    color: theme.COLOR_GREY,
    position: 'relative',
    bottom: 15,
    left: 15,
  },
});

const mapStateToProps = state => ({
  data: state.auth,
});

const mapDispatchToProps = dispatch => ({
  onTryAuth: authData => dispatch(tryAuth(authData)),
  onPostDeviceToken: data => dispatch(postDeviceToken(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
