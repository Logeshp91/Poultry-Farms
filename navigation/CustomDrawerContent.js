import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearEventListingData, clearLoginFields } from '../redux/action';
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawerContent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { postLoginEmployeeData } = useSelector(state => state.postLoginEmployeeReducer);


  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@Auth_Token', '@User_Data']);
      dispatch(clearLoginFields());
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  const handleHome = () => {
    navigation.navigate('Home');
  };
  
  const profilePicSource =
    postLoginEmployeeData?.Data?.ProfilePic && postLoginEmployeeData?.Data?.ProfilePic !== 'null'
      ? { uri: postLoginEmployeeData?.Data?.ProfilePic }
      : require('../assets/business.jpeg');

  return (
    <View style={styles.container}>
      <View style={styles.upperHalf}>
      <Image 
          source={profilePicSource}
          style={styles.image} 
        />
          {postLoginEmployeeData && (
            <View style={styles.userDataContainer}>
              <Text style={styles.userData}>{postLoginEmployeeData?.Data?.Name}</Text>
              <Text style={styles.userData}>{postLoginEmployeeData?.Data?.UserName}</Text>
            </View>
          )}
      </View>
      <DrawerContentScrollView style={styles.lowerHalf}>
        <TouchableOpacity onPress={() => navigation.navigate('SetMpin')}>
          <Text style={styles.drawerItem}>Set MPIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.drawerItem}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperHalf: {
    height: 250,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerHalf: {
    backgroundColor: '#ccc',
  },
  drawerItem: {
    fontSize: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  logout: {
    color: 'black',
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 80,
    marginTop:20,
    marginRight:10
  },
  imageContainer: {
    alignItems: 'center',
  },
  userDataContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  userData: {
    fontSize: 16,
    color: 'white',
  },
  logoutButton: {
    fontSize: 20,
    marginBottom: 300,
    marginHorizontal: 4,
  },
});

export default CustomDrawerContent;
