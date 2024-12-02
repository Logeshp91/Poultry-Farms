import React, { useEffect, useRef } from 'react';
import { View, ImageBackground, Dimensions, TextInput, Button, Animated, Text, Image, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import styles from '../../styles/Styles';
import { postForgotPassword } from '../../redux/action'; 

const backgroundImage = require("../../assets/trees.jpg");
const henGif = require("../../assets/walking.gif");
const iconImage = require("../../assets/Crlogo.png");

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();

  const screenWidth = Dimensions.get('window').width;
  const henWidth = 100;
  const animatedValue = useRef(new Animated.Value(screenWidth + henWidth)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: -henWidth,
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const animatedStyle = {
    transform: [
      {
        translateX: animatedValue,
      },
    ],
  };

  const handleFormSubmit = (values) => {
    dispatch(postForgotPassword({ email: values.email })); 
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
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit} 
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <MaterialIcons name="email" size={20} color="black" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  style={styles.input}
                />
              </View>
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <View style={{ width: "100%" }}>
                <Button onPress={handleSubmit} title="Submit" color="brown" />
              </View>
              <View style={styles.forgotPasswordContainer}>
                <Text style={styles.checkboxText}>Have a password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.clickHereText}>Go back</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default ForgotPassword;
