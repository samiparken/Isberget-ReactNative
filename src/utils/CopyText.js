import Clipboard from '@react-native-community/clipboard';

export const copyText = ({ content }) => {
    Clipboard.setString(content);
}