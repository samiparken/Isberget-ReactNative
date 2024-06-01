import { Navigation } from 'react-native-navigation';
import register from './register.routes';
import screens from './screens';
import theme from '../config';

export default {
  registerComponents: () => register(),
  startSingleScreenApp: () => startApp(),
  newLoginScreen: () => newLoginScreen(),
  startMainTabsAdmin: () => startTabsAdmin(),
  startMainTabsInstaller: () => startTabsInstaller(),
  changeScreen: (componentId, screen, title, visibleTopBar) => changeScreen(componentId, screen, title, visibleTopBar),
  showModal: (screen, visibleTopBar) => showModal(screen, visibleTopBar),
  dismissAllModals: () => dismissAllModals(),
  removeAllBadges: () => removeAllBadges(),
};

const startApp = () => {
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root: {
        stack:{
          children:[
            {
              component:{
                options:{
                  topBar:{
                    visible: false,
                  }
                },
                name: screens.AUTH_SCREEN,
              }
            }
          ]
        },
      },
    });
  });
};

const newLoginScreen = () => {
  Navigation.setRoot({
    root: {
      stack:{
        children:[
          {
            component:{
              options:{
                topBar:{
                  visible: false,
                }
              },
              name: screens.AUTH_SCREEN,
            }
          }
        ]
      },
    },
  });
};

const defaultOptions = {
  layout: {
    orientation: ['portrait'],
  },
  topBar: {
    background:{
      color: theme.COLOR_PRIMARY,
    }, 
    elevation: 5,
    title:{
      alignment: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      color: theme.COLOR_WHITE,
    },
    backButton: {
      color: theme.COLOR_WHITE,
    },
  },
  bottomTabs: {
    elevation: 0,
    hideShadow: true,
    backgroundColor: theme.COLOR_WHITE,
    titleDisplayMode: 'alwaysShow',
  },
  statusBar: {
    backgroundColor: theme.COLOR_PRIMARY,
  },
};

const getTab = (text, screen, icon) => {
  return {
    stack: {
      id: screen,
      children: [
        {
          component: {
            id: screen + '_component',
            name: screen,
            passProps:{
              notificationData: null,
            }
          },
        }
      ],
      options: {
        bottomTab:{
          text: text,
          icon: icon,
          selectedIconColor: theme.COLOR_PRIMARY,
          selectedTextColor: theme.COLOR_PRIMARY,
        },
        topBar: {
          visible: false,
        }
      }
    }
  };
};

const startTabsAdmin = () => {
  Navigation.setDefaultOptions(defaultOptions);

  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BOTTOM_TABS',
        children: [
          getTab(
            'Meddelanden', 
            screens.MESSAGE_SCREEN, 
            theme.TABS.TAB_1,
          ),
          getTab(
            'Acceptera jobb', 
            screens.ACCEPT_JOBS_SCREEN, 
            theme.TABS.TAB_2,
          ),
          getTab(
            'Boka Jobb', 
            screens.BOOK_JOBS_SCREEN, 
            theme.TABS.TAB_3,
          ),
          getTab(
            'Dagens jobb', 
            screens.TODAYS_JOBS_SCREEN, 
            theme.TABS.TAB_4,
          ),
          getTab(
            'Sök', 
            screens.SEARCH_SCREEN, 
            theme.TABS.TAB_5,
          ),
        ],
      }
    }
  });
};

const startTabsInstaller = () => {
  Navigation.setDefaultOptions(defaultOptions);

  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BOTTOM_TABS',
        children: [
          getTab(
            'Meddelanden', 
            screens.MESSAGE_SCREEN, 
            theme.TABS.TAB_1,
          ),
          getTab(
            'Boka Jobb', 
            screens.BOOK_JOBS_SCREEN, 
            theme.TABS.TAB_3,
          ),
          getTab(
            'Dagens jobb', 
            screens.TODAYS_JOBS_SCREEN, 
            theme.TABS.TAB_4,
          ),
          getTab(
            'Sök', 
            screens.SEARCH_SCREEN, 
            theme.TABS.TAB_5,
          ),
        ],
      }
    }
  });
};

const changeScreen = (componentId, screen, title, visibleTopBar) => {
  if(title){
    Navigation.push(componentId,{
      component: {
        name: screen,
        options: {
          topBar: {
            title: {
              text: title,
            },
            visible: visibleTopBar,
          },
          bottomTabs: {
            visible: false,
          },
        },
      },
    });
  }
  else{
    Navigation.push(componentId,{
      component:{
        name: screen,
      }
    });
  }
};

const showModal = (screen, visibleTopBar) => {
  Navigation.showModal({
    component: {
      name: screen,
      options: {
        topBar: {
          visible: visibleTopBar,
        }
      }
    }
  });
}

const dismissAllModals = () => Navigation.dismissAllModals();

const removeAllBadges = () => {
  Navigation.mergeOptions(screens.ACCEPT_JOBS_SCREEN, {
    bottomTab: {
      badge: '',
      badgeColor: 'red',
    }
  });
  Navigation.mergeOptions(screens.BOOK_JOBS_SCREEN, {
    bottomTab: {
      badge: '',
      badgeColor: 'red',
    }
  });
  Navigation.mergeOptions(screens.TODAYS_JOBS_SCREEN, {
    bottomTab: {
      badge: '',
      badgeColor: 'red',
    }
  });
}