import React, {Component} from 'react';
import {
    ScrollView
} from 'react-native';
import TextWithSwitch from '../../components/ListItems/TextWithSwitch';

class NotificationSettings extends Component {
    constructor() {
        super();

        this.state = {
            notifications: [
                {
                    name: "Notis nummer 1",
                    value: false
                },
                {
                    name: "Notis nummer 2",
                    value: true
                },                {
                    name: "Notis nummer 3",
                    value: false
                },
                {
                    name: "Notis nummer 4",
                    value: true
                },
            ]
        }
    }

    onNotificationValueChanged = (index, newValue) => {
        this.setState(prevState => {
            const newState = prevState.notifications;
            newState[index].value = newValue;
            return {
                notifications: newState
            }
        });
    }

    render () {
        return (
            <ScrollView
                style={{flex: 1, paddingTop: 20, backgroundColor: Platform.OS === 'ios' ? 'white' : 'transparent'}}
                contentContainerStyle={{alignItems: 'center'}}
            >
                {
                    this.state.notifications.map((item, index) => {
                        return (
                            <TextWithSwitch
                                value={item.value}
                                text={item.name}
                                key={index}
                                index={index}
                                onValueChange={(newValue) =>
                                    this.onNotificationValueChanged(index, newValue)}
                            />
                        )
                    })
                }
            </ScrollView>
            
        );
    }
}
export default NotificationSettings;