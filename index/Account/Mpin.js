import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StatusBar, Text, Alert, PermissionsAndroid, Platform } from "react-native"; // Import PermissionsAndroid here
import ReactNativePinView from "react-native-pin-view";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postMpin } from "../../redux/action";
import Icon from "react-native-vector-icons/Ionicons";
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const Mpin = ({ navigation }) => {
  const dispatch = useDispatch();  
  const { postMpinEmployeeData, postMpinEmployeeError } = useSelector((state) => state.postMpinEmployeeReducer);

  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [isSubmitButtonPressed, setIsSubmitButtonPressed] = useState(false);
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@Auth_Token');
      console.log(token);
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.error('Permission Error:', err);
      return false;
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current Location:', `Latitude: ${latitude}, Longitude: ${longitude}`); 

          resolve(`${latitude},${longitude}`);
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  const userData = async () => {
    const data = await AsyncStorage.getItem('@User_Data');
    console.log('Retrieved user data:', data);
    return data != null ? JSON.parse(data) : null;
  };

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length === 4) {
      setShowCompletedButton(true);
    } else {
      setShowCompletedButton(false);
    }
  }, [enteredPin]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = await getToken();
        console.log('AuthToken:', authToken);

        if (authToken) {
          const data = await userData();
          console.log("UserData:", data);
        } else {
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, [navigation]);

  const handlePinComplete = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Location Permission Denied', 'We need your location to provide better services. Please enable location services in your device settings.');
      return;
    }
    try {
      const token = await getToken();
      const userdata = await userData();
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        navigation.navigate('Login');
        return;
      }
      dispatch({type:'SET_AUTH_TOKEN',payload: {token, userdata}})
      const location = await getLocation(); 
      const mPin = parseInt(enteredPin);
      const paramStr = userdata?.ParamStr;     
      console.log("paramStr",paramStr);
      const geoLocation = location;
      dispatch(postMpin(token, mPin, geoLocation, paramStr));
      console.log("token, mPin, geoLocation, ParamStr", token, mPin, geoLocation, paramStr)
    } catch (error) {
      Alert.alert('Location Error', 'Unable to retrieve location.');
    }
  };

  useEffect(() => {
    if (postMpinEmployeeError) {
      Alert.alert("Error", postMpinEmployeeError.message || "Something went wrong");
    } else if (postMpinEmployeeData) {
      if (postMpinEmployeeData.result === "success") {
        Alert.alert("Success", "MPIN successfully updated.");
        navigation.navigate('TabNavigation');
      } else if (postMpinEmployeeData.result === "Failed") {
        Alert.alert("Error", postMpinEmployeeData.Msg || "Operation failed. Please try again.");
      } else {
        Alert.alert("Error", "Unexpected response received. Please try again.");
      }
    }
  }, [postMpinEmployeeError, postMpinEmployeeData, navigation]);
  
  const handleButtonPress = (key) => {
    if (key === "custom_left") {
      pinView.current.clear();
    }
    if (key === "custom_right" && enteredPin.length === 4) {
      setIsSubmitButtonPressed(true);
    }
  };
  
  useEffect(() => {
    if (isSubmitButtonPressed && enteredPin.length === 4) {
      handlePinComplete();
      setIsSubmitButtonPressed(false);
    }
  }, [enteredPin, isSubmitButtonPressed]);
  
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            paddingTop: 24,
            paddingBottom: 48,
            color: "rgba(255,255,255,0.7)",
            fontSize: 30,
          }}>
          MPIN
        </Text>
        <ReactNativePinView
          inputSize={20}
          ref={pinView}
          pinLength={4}
          buttonSize={60}
          onValueChange={value => setEnteredPin(value)}
          buttonAreaStyle={{
            marginTop: 24,
          }}
          inputAreaStyle={{
            marginBottom: 24,
          }}
          inputViewEmptyStyle={{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#FFF",
          }}
          inputViewFilledStyle={{
            backgroundColor: "#FFF",
          }}
          buttonViewStyle={{
            borderWidth: 1,
            borderColor: "#FFF",
          }}
          buttonTextStyle={{
            color: "#FFF",
          }}
          onButtonPress={handleButtonPress}
          customLeftButton={showRemoveButton ? <Icon name={"backspace"} size={36} color={"#FFF"} /> : undefined}
          customRightButton={<Icon name={"checkmark-outline"} size={36} color={"#FFF"} />}
        />
      </SafeAreaView>
    </>
  );
};

export default Mpin;
