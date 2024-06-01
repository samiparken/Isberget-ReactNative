import React from 'react'
import Card from '../../UI/Card';
import { View, StyleSheet } from 'react-native';
import RoundIconButton from '../../Buttons/RoundIconButton';
import theme from '../../../config';
import { SelectableText } from "@astrocoders/react-native-selectable-text";
import { copyText } from '../../../utils/CopyText';

const CardBookDetails = (props) => {

    const getTime = () => {
        const fullStart = props.order.Start;
        let startTime = fullStart.split('T')[1].split('.')[0];
        startTime = startTime.substring(0, startTime.length - 3);

        const fullEnd = props.order.End;
        let endTime = fullEnd.split('T')[1].split('.')[0];
        endTime = endTime.substring(0, endTime.length - 3);

        return `${startTime} - ${endTime}`;
    }

    const onButtonPressed = (index) => {
        switch(index){
            case 0: props.onRebookJobSelected(); break;
            default: break;
        }
    }

    return <Card>
        <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.column}>
                    <SelectableText 
                        menuItems={['Copy']} 
                        style={styles.titleText} 
                        value='Klockan' 
                        onSelection={copyText}
                    />
                    <SelectableText 
                        menuItems={['Copy']} 
                        style={styles.subtitleText} 
                        value={getTime()} 
                        onSelection={copyText}
                    />
                </View>
                <View style={styles.column}>
                    <SelectableText 
                        menuItems={['Copy']} 
                        style={styles.titleText} 
                        value='Installer' 
                        onSelection={copyText}
                    />
                    <SelectableText 
                        menuItems={['Copy']} 
                        style={styles.subtitleText} 
                        value={props.order.ResourceName} 
                        onSelection={copyText}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <RoundIconButton
                    index={0}
                    onPress={onButtonPressed}
                    icon={theme.ICON_BOOK_JOB_WHITE}
                />
            </View>
        </View>
    </Card>
}

const styles = StyleSheet.create({
    titleText: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 18,
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
});

export default CardBookDetails;