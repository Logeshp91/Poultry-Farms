import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StatusBar, Text, Alert, Platform, PermissionsAndroid } from "react-native";
import ReactNativePinView from "react-native-pin-view";
import { useDispatch, useSelector } from 'react-redux';
import { postSetMpin } from '../../redux/action'; 
import Icon from "react-native-vector-icons/Ionicons";
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetMpin = ({ navigation }) => {
  const dispatch = useDispatch();
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [firstPin, setFirstPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [pinViewKey, setPinViewKey] = useState(Math.random());
  const [location, setLocation] = useState(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      handlePermissionResult(result);
    } else if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      handlePermissionResult(result);
    }
  };

  const handlePermissionResult = (result) => {
    if (result === RESULTS.GRANTED || result === true) {
      getLocation();
    } else {
      requestLocationPermission();
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        handlePermissionResult(result);
      } else if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        handlePermissionResult(result);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to request location permission.");
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
      },
      error => {
        Alert.alert("Error", "Failed to get location.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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


  const getToken=async()=>{
    const token=await AsyncStorage.getItem('@Auth_Token')
    return token!=null? JSON.parse(token):null;
}
const userData=async()=>{
  const token=await AsyncStorage.getItem('@User_Data')
  return token!=null? JSON.parse(token):null;
}

  const handlePinComplete = async() => {
    const token=await getToken();
    const userdata = await userData();

    if (!isConfirming) {
      setFirstPin(enteredPin);
      setEnteredPin("");
      setPinViewKey(Math.random());
      setIsConfirming(true);
    } else {
      if (enteredPin === firstPin) {
        if (token) {
          try {
            const mPin = parseInt(enteredPin);
            const ParamStr = userdata?.ParamStr;
            const geoLocation = location ? `${location.coords.latitude},${location.coords.longitude}` : "unknown";
            dispatch(postSetMpin(token, mPin, geoLocation, ParamStr));
            console.log("postSetMpin", mPin, geoLocation, ParamStr);
            navigation.navigate('IntegrationListLine');
          } catch (error) {
            Alert.alert("Error", "Failed to save MPIN locally.");
          }
        } else {
          Alert.alert("Error", "User token is missing. Navigating to Menu page.");
          navigation.navigate('IntegrationListLine');
        }
      } else {
        Alert.alert("PIN Mismatch", "The Mpin and SetMpin do not match. Please try again.");
        setFirstPin("");
        setEnteredPin("");
        setPinViewKey(Math.random());
        setIsConfirming(false);
      }
    }
  };

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
          {isConfirming ? "Confirm MPIN" : "Set MPIN"}
        </Text>
        <ReactNativePinView
          key={pinViewKey}
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
          onButtonPress={key => {
            if (key === "custom_left") {
              pinView.current.clear();
            }
            if (key === "custom_right") {
              handlePinComplete();
            }
          }}
          customLeftButton={showRemoveButton ? <Icon name={"backspace"} size={36} color={"#FFF"} /> : undefined}
          customRightButton={showCompletedButton ? <Icon name={"checkmark-outline"} size={36} color={"#FFF"} /> : undefined}
        />
      </SafeAreaView>
    </>
  );
};

export default SetMpin;
