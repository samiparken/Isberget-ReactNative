import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { func, string } from 'prop-types';
import theme from '../../../config';
import Card from '../../UI/Card';
import { SelectableText } from "@astrocoders/react-native-selectable-text";
import { copyText } from '../../../utils/CopyText';

class CardMessage extends React.Component {
  state = {
    message: '',
  }

  render() {
    const { comments, onPress } = this.props;
    return (
      <Card>
        <ScrollView
          style={styles.chatArea}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <SelectableText 
            menuItems={['Copy']} 
            style={styles.chatAreaText} 
            value={comments} 
            onSelection={copyText}
          />
        </ScrollView>
        <View style={styles.containerChatInput}>
          <TextInput
            style={styles.textChatInput}
            multiline
            placeholder="Skicka ett meddelande..."
            placeholderTextColor={theme.COLOR_LIGHT_GREY}
            value={this.state.message}
            returnKeyType="send"
            onSubmitEditing={() => onPress(this.state.message)}
            onChangeText={message => this.setState({ message })}
          />
          <TouchableOpacity
            style={styles.buttonChat}
            onPress={() => onPress(this.state.message)}
          >
            <Image source={theme.ICON_SEND} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  }
}

CardMessage.propTypes = {
  onToggleScrollEnabled: func,
  comments: string,
  onPress: func.isRequired,
};

CardMessage.defaultProps = {
  comments: '',
};

const styles = StyleSheet.create({
  chatArea: {
    borderRadius: 12,
    maxHeight: 240,
    minHeight: 170,
    backgroundColor: theme.COLOR_PRIMARY_LIGHT,
  },
  chatAreaText: {
    textAlignVertical: 'top',
    fontSize: theme.FONT_SIZE_MEDIUM,
    color: theme.COLOR_WHITE,
    padding: 10,
    paddingBottom: 30,
  },
  containerChatInput: {
    marginTop: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    ...Platform.select({
      ios: {
        height: 48,
        borderRadius: 24,
      },
      android: {
        height: 54,
        borderRadius: 27,
      },
    }),
    backgroundColor: theme.COLOR_PRIMARY_LIGHT,
    flexDirection: 'row',
  },
  textChatInput: {
    fontSize: theme.FONT_SIZE_MEDIUM,
    color: theme.COLOR_WHITE,
    flex: 1,
    paddingRight: 12,
  },
  buttonChat: {
    padding: 4,
  },
  buttonStyle: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: theme.COLOR_PRIMARY,
    borderRadius: 8,
    alignSelf: 'center',
    width: 200,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default CardMessage;
