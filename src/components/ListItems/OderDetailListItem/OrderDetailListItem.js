import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../../../config';
import { SelectableText } from "@astrocoders/react-native-selectable-text";
import { copyText } from '../../../utils/CopyText';

const OrderDetailListItem = (props) => (
    <View style={styles.container}>
        <View style={styles.productNamesContainer}>
            <SelectableText 
                menuItems={['Copy']} 
                style={styles.productNamesText} 
                value={props.data.ProductName} 
                onSelection={copyText}
            />
            {
                <SelectableText 
                    menuItems={['Copy']} 
                    style={styles.productNamesSubText} 
                    value={props.data.ProductSKU} 
                    onSelection={copyText}
                />
            }
        </View>
        <SelectableText 
            menuItems={['Copy']} 
            style={styles.amountText} 
            value={props.data.Quantity} 
            onSelection={copyText}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 10
    },
    productNamesContainer: {
        flex: 1
    },
    productNamesText: {
        fontSize: 16,
        color: 'black'
    },
    productNamesSubText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: theme.COLOR_DARK_GREY
    },
    amountText: {
        marginHorizontal: 5,
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default OrderDetailListItem;