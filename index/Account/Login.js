import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, Dimensions, TextInput, Button, Animated, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../styles/Styles';
import { useDispatch, useSelector } from 'react-redux';
import { postLogin } from '../../redux/action';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const backgroundImage = require("../../assets/trees.jpg");
const henGif = require("../../assets/walking.gif");
const iconImage = require("../../assets/Crlogo.png");

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width;
  const henWidth = 100;
  const animatedValue = useRef(new Animated.Value(screenWidth + henWidth)).current;
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState(null);

  
  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: -henWidth,
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const { postLoginEmployeeLoading, postLoginEmployeeData, postLoginEmployeeError, postLoginEmployeeErrorInvalid } = useSelector(state => state.postLoginEmployeeReducer);

  useEffect(() => {
    const handleLogin = async () => {
      if (postLoginEmployeeData && !postLoginEmployeeError && !postLoginEmployeeErrorInvalid) {
        if (postLoginEmployeeData.result === 'success') {
          try {
            const dataString = JSON.stringify(postLoginEmployeeData.Data);
            const tokenString=JSON.stringify(postLoginEmployeeData.AccessToken)
            await AsyncStorage.setItem('@User_Data', dataString);
            await AsyncStorage.setItem('@Auth_Token',tokenString);
            navigation.navigate('TabNavigation');
          } catch (error) {
            console.error('Failed to save data to AsyncStorage:', error);
            Alert.alert('Failed to save user data.');
          }
        } else {
          Alert.alert(postLoginEmployeeData.Msg);
        }
      }
    };

    handleLogin();
  }, [postLoginEmployeeData, postLoginEmployeeError, postLoginEmployeeErrorInvalid, navigation]);

  const animatedStyle = {
    transform: [
      {
        translateX: animatedValue,
      },
    ],
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
          resolve(`${latitude},${longitude}`);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true}
      );
    });
  };

  const handleSubmit = async (values) => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const location = await getLocation();
        const data = {
          userName: values.email,
          password: values.password,
          loginDevice: "string",
          rememberMe: true,
          geoLocation: location
        };
        dispatch(postLogin(data));
      } catch (error) {
        Alert.alert('Location not available', 'Unable to retrieve location.');
      }
    } else {
      Alert.alert('Location Permission Denied', 'We need your location to provide better services. Please enable location services in your device settings.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <Animated.View style={[styles.henContainer, animatedStyle]}>
          <FastImage
            source={henGif}
            style={styles.henStyle}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Animated.View>
      </ImageBackground>
      <View style={styles.overlayContainer}>
        <View style={styles.inputContainer}>
          <Image source={iconImage} style={styles.iconStyle} />
        </View>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="mail-outline" size={20} color="black" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  style={styles.input}
                />
              </View>
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <View style={styles.inputIconContainer}>
                <MaterialIcons name="lock" size={20} color="black" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  style={styles.input}
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                  <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="black" />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
              <View style={{ width: "100%" }}>
                <Button onPress={handleSubmit} title="Login" color="brown" />
              </View>
              <View style={styles.forgotPasswordContainer}>
                <Text style={styles.checkboxText}>Forgot Password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.clickHereText}>Click Here</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default Login;
