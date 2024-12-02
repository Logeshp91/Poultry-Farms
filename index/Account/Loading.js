import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loading = ({ navigation }) => {
    const henGif = require("../../assets/walking.gif");
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

    const getToken = async () => {
        const token = await AsyncStorage.getItem('@Auth_Token');        
        return token ? JSON.parse(token) : null;
    };

    const userData = async () => {
        const data = await AsyncStorage.getItem('@User_Data');
        return data ? JSON.parse(data) : null;
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authToken = await getToken();

                if (authToken) {
                    const data = await userData();

                    if (data && data.Mpin) {
                        navigation.navigate("Mpin");
                    } else {
                        navigation.navigate("SetMpin");
                    }
                } else {
                    navigation.navigate("Login");
                }
            } catch (error) {
                navigation.navigate("Login");
            }
        };

        checkAuth();
    }, [navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={styles.henContainer}>
                <FastImage
                    source={henGif}
                    style={styles.henStyle}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </Animated.View>
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({
    henContainer: {
        position: 'absolute',
    },
    henStyle: {
        width: 60,
        height: 60,
    },
});
