import AsyncStorage from "@react-native-async-storage/async-storage"

const getToken=async()=>{
    const token=await AsyncStorage.getItem('@Token')
    return token!=null? JSON.parse(token):null;
}