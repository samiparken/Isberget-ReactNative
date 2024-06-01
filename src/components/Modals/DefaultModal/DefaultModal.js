import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../../../config';
import ModalExitHeader from '../../Headers/ModalExitHeader';
import Spinner from '../../UI/Spinner';

const DefaultModal = ({
  visible,
  toggleModal,
  animationType,
  children,
  isLoading,
  headerText,
  bookJobModal,
  toggleCalendarModal,
}) => (
  <Modal
    style={styles.modal}
    transparent
    visible={visible}
    animationType={animationType}
    onRequestClose={() => toggleModal()}
  >
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.contentContainer}>
          <ModalExitHeader toggleModal={toggleModal} />
          <KeyboardAwareScrollView
            style={styles.scrollView}
            contentContainerStyle={bookJobModal && styles.flex}
          >
            <View style={styles.containerHeader}>
              <Text
                selectable
                style={styles.headerText}
              >
                {headerText}
              </Text>
              {bookJobModal && (
                <TouchableOpacity
                  style={styles.buttoncalendar}
                  onPress={toggleCalendarModal}
                >
                  <Image source={theme.ICON_CALENDAR_BLUE} />
                </TouchableOpacity>
              )}
            </View>
            {isLoading ? <Spinner /> : children}
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 42,
    marginBottom: 20,
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
  },
  buttoncalendar: {
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  contentContainer: {
    backgroundColor: theme.COLOR_WHITE,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 15,
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'grey',
    textAlign: 'center',
  },
});

export default DefaultModal;
