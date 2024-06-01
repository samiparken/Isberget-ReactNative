import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View} from 'react-native';
import theme from '../../../config';

const ErrorMessage = (props) => {

    const getMessage = () => {
        switch(props.message){
            default: return props.message + '. Please try again.';
        }
    }

    return <SafeAreaView style={styles.container}>
        <Text style={styles.message}>
            {getMessage()}
        </Text>
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                style={{...styles.button, marginRight: 30}}
                onPress={props.onRefresh}
            >
                <Image
                    style={{ width: 30, height: 30 }}
                    source={theme.ICON_REFRESH_BLUE}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={props.goToSettings}
            >
                <Image
                    style={{ width: 30, height: 30 }}
                    source={theme.ICON_SETTINGS}
                />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLOR_WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: theme.COLOR_WHITE,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: theme.COLOR_LIGHT_GREY,
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40, 
        height: 40, 
        borderRadius: 20,
    }
});

export default ErrorMessage;