import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { postIntegrationPlacementsForLineRun } from '../../redux/action';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

const ActivitiesTab = ({ selectedItem, status }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.postLoginEmployeeReducer);
  const [loading, setLoading] = useState(false); 

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

  const handleEntryPress = useCallback(async () => {
    setLoading(true);
    if (selectedItem) {
      const location = await getLocation();      
      const results = {
        id: selectedItem.ParamStr,
        geoLocation: location ,
      };
       dispatch(postIntegrationPlacementsForLineRun(userToken, results));
      navigation.navigate('IntegrationPlacementsForLineRun', { item: selectedItem });
    } else {
      console.log('No item selected');
    }
    setLoading(false);
  }, [selectedItem, userToken, navigation]);

    return (
        <View style={styles.content}>
            {status === 'Running' && (
                <TouchableOpacity style={styles.saveButton} onPress={handleEntryPress}>
                    <Text style={styles.saveButtonText}>Entry</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#03b6fc',
        padding: 4,
        borderRadius: 3,
        alignItems: 'center',
        width: '20%',
        marginHorizontal: '80%',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ActivitiesTab;
