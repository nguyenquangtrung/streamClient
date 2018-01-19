import {AsyncStorage} from 'react-native';

export const saveUser = async (user) => {
     try {
        await AsyncStorage.setItem('@myuser', JSON.stringify(user));
     } catch (error) {
        
     }
}

export const getUser = async () => {
    try {
        const value = await AsyncStorage.getItem("@myuser");
        if(value !== null){
            
        }
    } catch (error) {
        
    }
}
