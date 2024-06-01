import { CheckBox } from 'react-native-elements';
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Text
} from 'react-native';
import { ORDER_STATUS_TEXT } from '../../../api/constants';
import theme from '../../../config';

export default class SearchHeader extends React.Component {

  getCheckbox = (index) => {
    const entry = Object.entries(ORDER_STATUS_TEXT)[index];

    return <CheckBox 
      title={entry[1]}
      checked={this.props.checked[entry[0]]}
      onPress={()=>this.props.changeChecked(entry[0])}
      containerStyle={{
        backgroundColor: theme.COLOR_PRIMARY,
        borderColor: theme.COLOR_PRIMARY,
        padding: 0,
      }}
      textStyle={{
        color: 'white',
        fontSize: 13,
      }}
      uncheckedColor='white'
      checkedColor={theme.COLOR_GREEN}
    />
  }

  render() {
    return (

      <SafeAreaView style={styles.rootView}>
        <View style={styles.container}>
          <TextInput
            style={styles.searchInput}
            placeholder="Sök..."
            onChangeText={searchInput => this.props.onSearchInputChanged(searchInput)}
            autoCorrect={false}
            clearButtonMode="while-editing"
            underlineColorAndroid="transparent"
            returnKeyType="search"
            value={this.props.searchInput}
            onSubmitEditing={() => this.props.onPress()}
          />
          <TouchableOpacity
            onPress={() => this.props.onPress()}
            activeOpacity={1}
          >
            <Image
              style={styles.searchIcon}
              source={theme.ICON_SEARCH}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.onClear()}
            activeOpacity={1}
          >
            <Image
              style={styles.searchIcon}
              source={theme.ICON_DECLINE}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <View style={{ flex: 1 }}>
            {this.getCheckbox(0)}
          </View>
          <View style={{ flex: 1 }}>
            {this.getCheckbox(1)}
          </View>
        </View>
        <View style={styles.checkboxContainer}>
        <View style={{ flex: 1 }}>
            {this.getCheckbox(2)}
          </View>
          <View style={{ flex: 1 }}>
            {this.getCheckbox(3)}
          </View>
        </View>
        <View style={styles.checkboxContainer}>
        <View style={{ flex: 1 }}>
            {this.getCheckbox(4)}
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={this.props.toggleCalendar}
            >
              <View style={styles.checkboxContainer}>
                <Image
                  style={styles.calendarIcon}
                  source={this.props.hasSelectedDates ? theme.ICON_CALENDAR_GREEN : theme.ICON_CALENDAR_WHITE}
                  resizeMode="contain"
                />
                <Text style={styles.calendarText}>
                  Kalender
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  rootView:{
    height: theme.HEIGHT_NAV_BAR_SEARCH,
    backgroundColor: theme.COLOR_PRIMARY,
    flexDirection: 'column',
    paddingTop: 10,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  checkboxContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    textAlignVertical: 'center',
    backgroundColor: theme.COLOR_WHITE,
    borderRadius: 19,
    marginRight: 10,
    height: 38,
    fontSize: theme.FONT_SIZE_MEDIUM,
  },
  searchIcon: {
    padding: 5,
    marginRight: 14,
  },
  calendarIcon: {
    marginRight: 8,
    marginLeft: 8,
    marginTop: 5,
  },
  calendarText: {
    color: 'white', 
    fontWeight: 'bold', 
    marginTop: 7,
    fontSize: 13,
  }
});
