import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceStorage = {
    
    async saveItem(key, value) {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
        }
      },

      async getToken () {
        try {
          const accessToken =  await AsyncStorage.getItem('id_token');
          if(accessToken != null){
            return accessToken;
          }
        } catch(error) {
            console.log("Something went wrong when fetching the token.");
        }
      },

      async getItem (item) {
        try {
        const result =  await AsyncStorage.getItem(item);
        if(result != null){
          return result;
        }
        } catch(error) {
            console.log("Something went wrong when fetching", `${item}`);
        }
      },
      async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error){
            console.log("There was a problem when removing a item");
            return false;
        }
    },

    async clearItems() {
      try {
          await AsyncStorage.clear();
          return true;
      } catch (error){
          console.log("There was a problem when clearing");
          return false;
      }
  }
};

export default deviceStorage;