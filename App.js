import deviceStorage from './src/services/deviceStorage';
import routes from './src/routes';
import setupLocales from './src/utils/locales';

deviceStorage.getItem('sms0').then((sms) => {
  if (!sms) {
    const smsArr = ['Jag blir sen!', 'Jag ringer snart!', 'Jag är framme strax!'];
    for (let i = 0; i < smsArr.length; i++) {
      deviceStorage.saveItem(`sms${i}`, smsArr[i]);
    }
  }
});

routes.registerComponents();
routes.startSingleScreenApp();

setupLocales();