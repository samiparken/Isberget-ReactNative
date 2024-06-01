import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import { func } from 'prop-types';
import theme from '../../../config';

const SIGN_REF = 'sign';

class Signature extends React.Component {
  state = {
    signatureEntered: false,
  };

  onSaveSignSelected = () => {
    this.setState(({ signatureEntered: false }));
    this.refs[SIGN_REF].saveImage();
  }

  onSignDrag = () => {
    if (!this.state.signatureEntered) {
      this.setState(prevState => ({
        signatureEntered: !prevState.signatureEntered,
      }));
    }
  }

  onClearSignSelected = () => {
    this.setState(({ signatureEntered: false }));
    this.refs[SIGN_REF].resetImage();
  }

  render() {
    const { onSaveSignature } = this.props;
    return (
      <View style={styles.containerMain}>
        <View style={styles.signatureContainer}>
          <SignatureCapture
            ref={SIGN_REF}
            style={styles.signature}
            viewMode="portrait"
            showTitleLabel={false}
            showBorder={false}
            saveImageFileInExtStorage={false}
            showNativeButtons={false}
            onSaveEvent={result => onSaveSignature(result.encoded)}
            onDragEvent={this.onSignDrag}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              !this.state.signatureEntered ? styles.disabled : { backgroundColor: theme.COLOR_RED },
            ]}
            onPress={this.onClearSignSelected}
            disabled={!this.state.signatureEntered}
          >
            <Text style={styles.buttonText}>Rensa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              !this.state.signatureEntered ? styles.disabled : { backgroundColor: theme.COLOR_GREEN },
            ]}
            onPress={this.onSaveSignSelected}
            disabled={!this.state.signatureEntered}
          >
            <Text style={styles.buttonText}>Signera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Signature.propTypes = {
  onSaveSignature: func.isRequired,
};

const styles = StyleSheet.create({
  containerMain: {
    padding: 8,
  },
  signatureContainer: {
    width: '100%',
    borderColor: theme.COLOR_LIGHT_GREY,
    borderWidth: 2,
    padding: 4,
    borderRadius: theme.BORDER_RADIUS_MEDIUM,
  },
  signature: {
    height: 180,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    borderRadius: theme.BORDER_RADIUS_MEDIUM,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowOffset: { height: 1, width: 0 },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  disabled: {
    backgroundColor: theme.COLOR_GREY,
  },
  buttonText: {
    fontSize: 16,
    color: theme.COLOR_WHITE,
  },
});

export default Signature;
