import { useRef } from 'react';
import { Animated } from 'react-native';

const useHideOnScroll = () => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const diffClamp = Animated.diffClamp(scrollY, 0, 50);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 50],
        extrapolate: 'clamp'
    });

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    return { translateY, handleScroll };
};

export default useHideOnScroll;
