import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import { API } from '../../api/ApiHandler';
import { API_ENDPOINTS } from '../../api/constants';
import Spinner from '../../components/UI/Spinner';
import deviceStorage from '../../services/deviceStorage';
import { setMessages } from '../../store/actions/index';
import { SafeAreaView, StyleSheet } from 'react-native';
import Alert from '../../components/Helpers/Alert';
import theme from '../../config';
import moment from 'moment';
import { Navigation } from 'react-native-navigation';
import screens from '../../routes/screens';
import MapActionButton from '../../components/Map/MapActionButton';
import ErrorMessage from '../../components/Helpers/ErrorMessage/ErrorMessage';
import MessageComponent from '../../components/UI/Messages/MessageComponent';

const MessageScreen = (props) => {
    const NotificationDuration = 5000;
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ alertMessage: '', alertType: '' });
    const [update, setUpdate] = useState(0);
    const [onlyRead, setOnlyRead] = useState(true);
    const [noConnection, setNoConnection] = useState(false);
    const [error, setError] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [baseLocation, setBaseLocation] = useState();
    const [userId, setUserId] = useState();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(()=>{
        if(props.connection.connectionState === 'no'){
            showNoConnectionAlert();
            setNoConnection(true);
        }
        else if(noConnection){
            showConnectionAlert();
            setNoConnection(false);
        }

    }, [props.connection.connectionState]);

    useEffect(()=>{
        if(noConnection){
            showNoConnectionAlert();
            return;
        }

        setLoading(true);
        getUserInfo().then(async (userInfo) => {
            setUserId(userInfo.userId);
            setIsAdmin(userInfo.isAdmin);

            const messages = await API.get(API_ENDPOINTS.GetMessages, {
                companyId: userInfo.companyId,
                userId: userInfo.userId,
                isAdmin: userInfo.isAdmin,
            });
            
            if(messages.error){
                setLoading(false);
                setError(messages.error);
            }
            else{
                if(!baseLocation){
                    const location = await API.get(API_ENDPOINTS.GetCompanyLocation, {
                        companyId: userInfo.companyId,
                    });
                    
                    setBaseLocation({
                        lat: location[0].lat,
                        lng: location[0].long
                    });
                }

                props.onSetMessages(messages);
                setLoading(false);
                setBadge(messages);
                filterMessages(onlyRead, messages);
            }
        });
    }, [update]);

    const showConnectionAlert = () => setAlert({alertMessage: `Internet Connection Available/${moment()}`, alertType: 'success'});

    const showNoConnectionAlert = () => setAlert({alertMessage: `No Internet Connection/${moment()}`, alertType: 'error'});

    const getUserInfo = async () => {
        const userId = await deviceStorage.getItem('user_id');
        const companyId = await deviceStorage.getItem('company_id');

        return { userId, companyId, isAdmin: !props.auth.isInstaller };
    } 

    const setBadge = (messages) => {
        let unreadMessagesNum = messages.filter(message => !message.installer_actions_read).length;
        
        Navigation.mergeOptions(screens.MESSAGE_SCREEN, {
            bottomTab: {
              badge: unreadMessagesNum > 0 ? unreadMessagesNum.toString() : '',
              badgeColor: 'red',
            }
        });
    }

    const filterMessages = (newFilter, messages) => {
        if(newFilter !== onlyRead){
            setOnlyRead(newFilter);
        }

        const unfilteredMessages = messages ?? props.messages.messages;

        let filteredMessages = newFilter ? unfilteredMessages.filter(el => !el.installer_actions_read) 
            : unfilteredMessages;

        if(!isAdmin){
            filteredMessages = filteredMessages.filter(el => el.installer_actions_type_of_message !== 'auctionJob');
        }

        setFilteredMessages([...filteredMessages]);
    }

    const onRefreshPressed = () => setUpdate(preState => preState + 1);

    const setMessageRead = (id) => {
        API.get(API_ENDPOINTS.SetMessageRead, {
            installer_actions_id: id,
        }).then(()=>{
            onRefreshPressed();
        }).catch((error)=>{
            console.log(error);
        });
    }

    const onAcceptPressed = (orderId, messageId) => {
        API.get(API_ENDPOINTS.AcceptJobWithId, { 
            param1: orderId, 
            param2: userId 
        }).then(async ()=>{
            await API.get(API_ENDPOINTS.SetMessageRead, {installer_actions_id: messageId});
            onRefreshPressed();
        }).catch((error)=>{
            console.log(error);
        });
    }

    const findJob = (orderId, messageId) => {
        const bookjob = props.bookData.find(el => el.OrderId === orderId);
        const acceptjob = props.acceptData.find(el => el.OrderId === orderId);

        if(acceptjob){
            Navigation.updateProps(screens.ACCEPT_JOBS_SCREEN + '_component', {
                selectJob: acceptjob,
            });
            Navigation.mergeOptions(screens.ACCEPT_JOBS_SCREEN, {
                bottomTabs: {
                  currentTabId: screens.ACCEPT_JOBS_SCREEN
                }
            });
            API.get(API_ENDPOINTS.SetMessageRead, {
                installer_actions_id: messageId,
            }).then(()=>{
                onRefreshPressed();
            }).catch((error)=>{
                console.log(error);
            });
        }
        else if(bookjob){
            Navigation.updateProps(screens.BOOK_JOBS_SCREEN + '_component', {
                selectJob: bookjob,
            });
            Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN, {
                bottomTabs: {
                    currentTabId: screens.BOOK_JOBS_SCREEN
                }
            });
            API.get(API_ENDPOINTS.SetMessageRead, {
                installer_actions_id: messageId,
            }).then(()=>{
                onRefreshPressed();
            }).catch((error)=>{
                console.log(error);
            });
        }
    }

    const goToAnswers = (orderId) => {
        setLoading(true);
        API.get(API_ENDPOINTS.GetCustomerHistory, {param: orderId})
        .then((result)=>{
            if(result && result.length > 0){
                setLoading(false);
                Navigation.push(props.componentId,{
                    component:{
                      name: screens.CLIENT_ANSWERS_SCREEN,
                      passProps: {
                        answers: result[0].Answers,
                        headerText: this.getHeaderText(),
                      }
                    }
                });
            }
            else{
                setLoading(false);
            }
        }).catch(error=>{
            console.log(error);
            setLoading(false);
        });
    }

    const goToSettings = () => {
        Navigation.push(props.componentId, {
          component:{
            name: screens.SETTINGS_SCREEN,
            options: {
              bottomTabs:{
                visible: false
              }
            }
          }
        });
    }

    const topFilter = <View style={styles.filterView}>
        <TouchableWithoutFeedback onPress={() => filterMessages(true)}>
            <View style={{ 
                ...styles.leftFilterButton, 
                backgroundColor: onlyRead ? theme.COLOR_PRIMARY : theme.COLOR_DARK_GREY
            }}>
                <Text style={styles.filterText}>Nya</Text>
            </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => filterMessages(false)}>
            <View style={{ 
                ...styles.rightFilterButton, 
                backgroundColor: onlyRead ? theme.COLOR_DARK_GREY : theme.COLOR_PRIMARY 
            }}>
                <Text style={styles.filterText}>Allt</Text>
            </View>
        </TouchableWithoutFeedback>
    </View>

    const emptyMessages = <View style={styles.center}>
        <Text style={styles.emptyText}>
            {onlyRead ? 'Inga nya meddelanden' : 'Inga meddelanden'}
        </Text>
    </View>

    if(loading){
        return <Spinner />;
    }

    if(error){
        <ErrorMessage message={error} goToSettings={goToSettings} onRefresh={onRefreshPressed}/>;
    }
    
    return <SafeAreaView style={styles.safeArea}>
        {alert.alertMessage !== '' && 
          <Alert 
            message={alert.alertMessage} 
            timeout={NotificationDuration} 
            type={alert.alertType} 
          />
        }
        {topFilter}
        {filteredMessages.length === 0 && emptyMessages}
        {filteredMessages.length > 0 && <FlatList
            style={{ width: '100%' }}
            data={filteredMessages}
            renderItem={
                (item)=><MessageComponent 
                    message={item.item} 
                    baseLocation={baseLocation}
                    onMessageRead={setMessageRead}
                    onAcceptPressed={onAcceptPressed}
                    findJob={findJob}
                    seeAnswers={goToAnswers}
                />
            }
            keyExtractor={(item) => item.installer_actions_id.toString()}
        />}
        <MapActionButton
            onPress={onRefreshPressed}
            style={styles.buttonRefresh}
            size={40}
            icon={theme.ICON_REFRESH_BLUE}
        />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.COLOR_WHITE,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: 'black',
        fontSize: 30,
        textAlign: 'center',
    },  
    buttonRefresh: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        zIndex: 10,
        elevation: 0,
    },
    filterView: {
        flexDirection: 'row',
        height: 40,
        marginVertical: 10,
        width: '60%',
    },
    leftFilterButton: {
        flex: 1,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightFilterButton: {
        flex: 1,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterText: {
        fontSize: 20,
        color: theme.COLOR_WHITE
    },
});

const mapStateToProps = state => ({
    bookData: state.bookJobs.allAcceptedJobs,
    connection: state.connection,
    acceptData: state.acceptJobs.allUnAcceptedJobs,
    auth: state.auth,
    messages: state.messages,
});

const mapDispatchToProps = dispatch => ({
    onSetMessages: (messages) =>dispatch(setMessages(messages)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);