import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import theme from '../../../config';
import Card from '../../UI/Card';
import OrderDetailListItem from '../../ListItems/OderDetailListItem';
import { SelectableText } from "@astrocoders/react-native-selectable-text";
import { copyText } from '../../../utils/CopyText';

const CardProducts = ({ products }) => (
  <Card>
    <View style={styles.productHeader}>
      <SelectableText 
        menuItems={['Copy']} 
        style={styles.productHeaderText} 
        value='PRODUKTER' 
        onSelection={copyText}
      />
      <SelectableText 
        menuItems={['Copy']} 
        style={styles.productHeaderText} 
        value='ANTAL' 
        onSelection={copyText}
      />
    </View>
    <FlatList
      showsVerticalScrollIndicator={false}
      style={styles.containerFlatList}
      data={products}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => <OrderDetailListItem data={item} />}
      nestedScrollEnabled
    />
  </Card>
);

const styles = StyleSheet.create({
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: theme.COLOR_GREY,
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginBottom: 5,
  },
  productHeaderText: {
    fontSize: 16,
  },
  containerFlatList: {
    height: 150,
    paddingHorizontal: 8,
    marginBottom: 10,
    zIndex: 100,
  },
});

export default CardProducts;
