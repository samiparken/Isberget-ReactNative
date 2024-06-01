import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';
import { API } from '../../../api/ApiHandler';
import { API_ENDPOINTS } from '../../../api/constants';

const SearchListItem = ({
  dataToRender,
  onPress,
}) => {

  const [answers, setAnswers] = useState([]);

  useEffect(()=> {
    getAnswers();
  }, []);

  const getAnswers = () => {
    if(dataToRender){
      API.get(API_ENDPOINTS.GetCustomerHistory, {param: dataToRender.OrderId ?? dataToRender.Id})
        .then(result => {
          if(result && result.length > 0){
            const answersToFill = [];

            result[0].Answers.forEach((answer) => {
              answersToFill.push(answer);
            });

            setAnswers(answersToFill);
          }          
        });
    }
  }

  return <View style={styles.containerWrapper}>
    <View style={[theme.STYLE_CARD, styles.container]}>
      <View style={styles.leftContainer}>
        <Text style={styles.headerText}>
          {'Order: # '}
          { dataToRender.order_number_on_client || dataToRender.Order_number_on_client}
        </Text>
        <Text style={styles.subText}>{dataToRender.FullName}</Text>
        <Text style={styles.subText}>
          {dataToRender.OrderType}
          {', '}
          {dataToRender.ProductList[0].ProductName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => { onPress(dataToRender, answers); }}
        style={styles.buttonInfo}
      >
        <Image style={styles.image} source={theme.ICON_INFO} />
        {answers.length > 0 && <View style={styles.badge}>
            <Text style={{ color: 'white', }}>{answers.length}</Text>
        </View>}
      </TouchableOpacity>
    </View>
  </View>;
} 

const styles = StyleSheet.create({
  containerWrapper: {
    padding: 4,
    marginHorizontal: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLOR_PRIMARY,
  },
  subText: {
    fontSize: 16,
    color: theme.COLOR_GREY,
  },
  buttonInfo: {
    backgroundColor: theme.COLOR_WHITE,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowOffset: { width: 1, height: 1 },
    elevation: 2,
  },
  image: {
    width: 20,
    height: 20,
  },
  badge: {
    backgroundColor: 'red',
    flexDirection: 'column',
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default SearchListItem;
