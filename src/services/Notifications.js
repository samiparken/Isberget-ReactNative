import deviceStorage from './deviceStorage';
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Navigation } from 'react-native-navigation';
import screens from '../routes/screens';
import messaging from '@react-native-firebase/messaging';
import { NOTIFICATION_TYPES } from '../api/constants';
import { API } from '../api/ApiHandler';
import { API_ENDPOINTS } from '../api/constants';
import { Linking } from 'react-native'

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    if(remoteMessage.notification){
      PushNotification.cancelAllLocalNotifications();
      const actions = [];
      switch(remoteMessage.data.type){
        case NOTIFICATION_TYPES.newJobs: 
          actions.push('Accept'); 
          break;
        case NOTIFICATION_TYPES.bookJob: 
          actions.push('Book'); 
          actions.push('Call'); 
          actions.push('Message'); 
          break;
        case NOTIFICATION_TYPES.jobUpdate: 
          actions.push('Call'); 
          actions.push('Message'); 
          break;
      }
      PushNotification.localNotification({
        channelId: "1",
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        ignoreInForeground: true,
        userInfo: remoteMessage.data,
        invokeApp: false,
        actions: actions,
      });
    }
  });

  PushNotification.configure({
    onRegister: function (token) {
      messaging().getToken().then((result) => {
        console.log(`Token '${result}'`)
        deviceStorage.saveItem('deviceToken', result);
      });
    },
    onNotification: async (notification) => {
      console.log("NOTIFICATION:", notification);

      if(!notification.foreground && notification.userInteraction && notification.title !== 'Error'){
        await timeout(2000); //make sure the auth screen has started from the app.js
        
        const data = {...notification.data, toBook: notification.action === 'Book'}
        Navigation.updateProps(screens.BOOK_JOBS_SCREEN + '_component', {
          notificationData: data
        });
      }
  
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    onAction: function (notification) {      
      switch(notification.action){
        case 'Accept': 
          deviceStorage.getItem('user_id').then((userId) => {
            API.get(API_ENDPOINTS.AcceptJobWithId, { param1: notification.userInfo.orderId, param2: userId })
              .then((res)=>{})
              .catch(error=>{
                PushNotification.invokeApp(notification);
              })
          });
          break;

        case 'Book': 
          PushNotification.invokeApp(notification); 
          break;

        case 'Call': 
          deviceStorage.getItem('company_id').then((id) => {
            API.get(API_ENDPOINTS.BookedJobs, { param: id }).then(res=>{
              const orderId = notification.userInfo.orderId;
              const job = res.find((job) => (
                (job.Id && job.Id.toString() === orderId) 
                || (job.OrderId && job.OrderId.toString() === orderId)
              ));

              if(job && (job.Phone || job.PhoneNumber)){
                let phone = job.PhoneNumber ?? job.Phone;
                phone = phone.replace(' ', '');
                phone = phone.replace('-', '');

                Linking.canOpenURL(`tel:${phone}`).then((supported) => {
                  if (supported) {
                    return Linking.openURL(`tel:${phone}`);
                  }
                });
              }
      
            });
          });
          break;

        case 'Message': 
          deviceStorage.getItem('company_id').then((id) => {
            API.get(API_ENDPOINTS.BookedJobs, { param: id }).then(res=>{
              const orderId = notification.userInfo.orderId;
              const job = res.find((job) => (
                (job.Id && job.Id.toString() === orderId) 
                || (job.OrderId && job.OrderId.toString() === orderId)
              ));

              if(job && (job.Phone || job.PhoneNumber)){
                let phone = job.PhoneNumber ?? job.Phone;
                phone = phone.replace(' ', '');
                phone = phone.replace('-', '');

                Linking.canOpenURL(`sms://${phone}`).then((supported) => {
                  if (supported) {
                    return Linking.openURL(`sms://${phone}`);
                  }
                });
              }
              
            });
          });
          break;

        default: break;
      }
    },
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: "1", 
      channelName: "default",
      channelDescription: "A channel to categorise your notifications",
      soundName: "default", 
      importance: 4, 
      vibrate: true, 
    },
  );

  PushNotification.createChannel(
    {
      channelId: "test", 
      channelName: "Test channel", 
      channelDescription: "A channel to categorise your notifications", 
      soundName: "default", 
      importance: 4, 
      vibrate: true, 
    },
  );

  messaging().onTokenRefresh((fcmToken) => {
    deviceStorage.saveItem('deviceToken', fcmToken);
  });
};
