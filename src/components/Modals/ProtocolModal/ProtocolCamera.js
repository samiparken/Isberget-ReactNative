import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { func } from 'prop-types';
import theme from '../../../config';
// More info on all the options is below in the README...just some common use cases shown here
const options = {
  title: 'Lägg till bild',
  customButtons: [{ name: 'remove', title: 'Ta bort bild' }],
  quality: Platform.OS === 'ios' ? 0 : 0.5,
};

class ProtocolCamera extends React.Component {
  state = {
    newImage: '',
    data: '',
  };

  onCameraPressed = () => {
    const { onSaveImage } = this.props;
    ImagePicker.showImagePicker(options, (response) => {
      if (response.customButton) {
        this.onRemoveImage();
      } else if (!response.didCancel) {
        const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ newImage: source, data: response.data });
        onSaveImage(response.data);
      }
    });
  }

  onRemoveImage = () => { this.setState({ newImage: '', data: '' }); }

  render() {
    return (
      <TouchableOpacity onPress={this.onCameraPressed}>
        <View style={[styles.photoContainer, !this.state.newImage && { paddingHorizontal: 16 }]}>
          {
            this.state.newImage ? (
              <Image
                source={this.state.newImage}
                resizeMode="contain"
                style={styles.image}
              />
            ) : <Text style={styles.text}>Klicka här för att lägga till bild</Text>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

ProtocolCamera.propTypes = {
  onSaveImage: func.isRequired,
};

const styles = StyleSheet.create({
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 200,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLOR_DARK_GREY,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

export default ProtocolCamera;
