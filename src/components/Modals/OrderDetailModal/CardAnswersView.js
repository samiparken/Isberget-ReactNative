import React from 'react';
import Card from '../../UI/Card';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '../../../config';
import Icon from 'react-native-vector-icons/MaterialIcons' 

const CardAnswersView = (props) => {
    return <Card>
        <View>
            <View style={styles.column}>
                <Text style={styles.titleText} >
                    Answers
                </Text>
                <Text style={styles.subtitleText} >
                    See the answers from the client
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={props.onViewAnswers}>
                    <Icon
                        size={25}
                        name='question-answer'
                        color='white'
                    />
                </TouchableOpacity>
            </View>
        </View>
    </Card>
}

const styles = StyleSheet.create({
    titleText: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 18,
        color: 'black'
    },
    subtitleText: {
        marginBottom: 8,
        fontSize: 18,
    },
    column: {
        flexDirection: 'column',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.COLOR_PRIMARY,
        padding: 16,
        marginTop: 8,
        marginHorizontal: 4,
        borderRadius: 40,
        shadowColor: theme.COLOR_LIGHT_GREY,
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
      }
});

export default CardAnswersView;