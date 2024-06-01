import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import theme from '../../../config';
import Axios from 'axios';
import moment from 'moment';

const GOOGLE_MAPS_API_KEY = "AIzaSyB0TQQhGmFvi7SbUvt7r_ypjMVbprMITFg";

const MessageComponent = (props) => {
    const [distance, setDistance] = useState('');

    useEffect(()=>{
        const address = `
            ${props.message.installer_actions_street_adress.replace(/\s/g, "+")}+
            ${props.message.installer_actions_city.replace(/\s/g, "+")}+
            ${props.message.installer_actions_zip_code.replace(/\s/g, "")}+
            Sweden
        `;
        
        Axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params:{
            origins: `${props.baseLocation.lat},${props.baseLocation.lng}`,
            destinations: address,
            key: GOOGLE_MAPS_API_KEY,
            }
        }).then((result)=>{
            if(result.data.rows && result.data.rows.length > 0 
                && result.data.rows[0].elements 
                && result.data.rows[0].elements.length > 0
                && result.data.rows[0].elements[0].distance){
            
                    setDistance(result.data.rows[0].elements[0].distance.text);
            }
        }).catch((error)=>{
            console.log(error);
        });   
    }, [])

    const readButton = <TouchableWithoutFeedback 
            onPress={()=>props.onMessageRead(props.message.installer_actions_id)}
        >
            <View style={styles.toggleReadButton}>
                <Image 
                    source={props.message.installer_actions_read 
                        ? theme.ICON_MESSAGE_READ
                        : theme.ICON_MESSAGE_UNREAD}
                    style={{
                        height: 25,
                        width: 25,
                    }}
                />
            </View>
        </TouchableWithoutFeedback>;

    if(props.message.installer_actions_type_of_message === 'standardMessage'){
        return <View style={{
            ...styles.main, 
            backgroundColor: theme.COLOR_PRIMARY,
        }}> 
            <Text style={styles.title}>
                {props.message.installer_actions_message}
            </Text>
            {readButton}
        </View>
    }

    return <View style={{
        ...styles.main, 
        backgroundColor: props.message.installer_actions_type_of_message === 'auctionJob' 
            ? '#005c2d' 
            : '#880407'
    }}>
        <Text style={styles.title}>
            {props.message.installer_actions_message}
        </Text>
        <Text style={styles.description}>
            {props.message.installer_actions_installation_name},{' '}
            {props.message.installer_actions_installation_type}
        </Text>
        <Text style={styles.description}>
            Betalning: {props.message.installer_actions_job_pay.toString()} SEK
        </Text>
        {distance !== '' && <Text style={styles.description}>
            Distans: {distance}
        </Text>}
        <View style={styles.ckeckboxRow}>
            <View style={styles.smallColumn}>
                <Text style={styles.checkboxText}>
                    Klientens svar
                </Text>
                {props.message.installer_actions_got_customer_answer 
                    && <TouchableWithoutFeedback onPress={()=>props.seeAnswers(props.message.installer_actions_order_id)}>
                        <Text style={styles.subTextLink}>
                            Se svar
                        </Text>
                    </TouchableWithoutFeedback>
                }
            </View>
            <Image 
                source={props.message.installer_actions_got_customer_answer 
                    ? theme.ICON_CHECKBOX_YES 
                    : theme.ICON_CHECKBOX_NO 
                }
                style={styles.checkboxImage}
            />
        </View>
        <View style={styles.ckeckboxRow}>
            <View style={styles.smallColumn}>
                <Text style={styles.checkboxText}>
                    Leveransmeddelande
                </Text>
                {props.message.installer_actions_got_delivery_notice 
                    && <Text style={styles.subText}>
                        ({props.message.installer_actions_delivery_date.split('T')[0]})
                    </Text>
                }
            </View>
            <Image 
                source={props.message.installer_actions_got_delivery_notice 
                    ? theme.ICON_CHECKBOX_YES 
                    : theme.ICON_CHECKBOX_NO 
                }
                style={styles.checkboxImage}
            />
        </View>
        {readButton}
        {props.message.installer_actions_type_of_message === 'systemMessage' && 
            <Text style={styles.description}>
                Ombokad för: {moment(props.message.installer_actions_unbooked_for_time).fromNow()}
            </Text>
        }
        {!props.message.installer_actions_read && props.message.installer_actions_type_of_message === 'auctionJob'
            && <TouchableOpacity onPress={()=>props.onAcceptPressed(
                props.message.installer_actions_order_id,
                props.message.installer_actions_id,
            )}>
                <View style={styles.mainButton}>
                    <Text style={styles.buttonText}>Acceptera order</Text>
                </View>
            </TouchableOpacity>
        }
        {!props.message.installer_actions_read && props.message.installer_actions_type_of_message === 'systemMessage'
            && <TouchableOpacity onPress={()=>props.findJob(
                props.message.installer_actions_order_id,
                props.message.installer_actions_id,
            )}>
                <View style={styles.mainButton}>
                    <Text style={styles.buttonText}>Acceptera/Boka order</Text>
                </View>
            </TouchableOpacity>
        }
    </View>
}

const styles = StyleSheet.create({
    main: {
        marginHorizontal: 30,
        paddingRight: 30,
        paddingLeft: 15,
        paddingVertical: 20,
        marginVertical: 10,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        borderTopLeftRadius: 60,
        flexDirection: 'column',
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: theme.COLOR_LIGHT_GREY,
        shadowRadius: 2,
        shadowOpacity: 1,
        alignItems: 'center'
    }, 
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        color: theme.COLOR_WHITE,
        textAlign: 'center',
    },
    description: {
        marginTop: 10,
        fontSize: 20,
        color: theme.COLOR_WHITE,
        textAlign: 'center',
    },
    ckeckboxRow:{
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        marginRight: 20,
        fontSize: 20,
        color: theme.COLOR_WHITE,
    },
    checkboxImage: {
        height: 25,
        width: 25,
    },
    smallColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subText: {
        marginRight: 20,
        marginTop: 3,
        fontSize: 20,
        color: theme.COLOR_WHITE,
        textAlign: 'center',
    },
    subTextLink: {
        marginRight: 20,
        marginTop: 3,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    toggleReadButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    mainButton:{
        marginTop: 20,
        borderRadius: 50,
        backgroundColor: 'white'
    },
    buttonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: 'black',
        margin: 15,
    }
});

export default MessageComponent;