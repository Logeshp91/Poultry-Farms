import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Button, ToastAndroid, Alert, LogBox } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postIntegrationBodyWeightEntry, postIntegrationViewLineRun,postIntegrationLoadDataForBodyWytEntry, postIntegrationPlacementsForLineRun } from '../../redux/action';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const IntegrationBodyWeightEntry = ({ route = {} }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [quanty, setQuanty] = useState('0');
    const [weight, setWeight] = useState('0');
    const [average, setAverage] = useState('0');
    const [description, setDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        quanty: '',
        weight: '',
        average: '',
    });

    const { userToken } = useSelector((state) => state.postLoginEmployeeReducer);
    const { postIntegrationLoadDataForBodyWytEntryData, postIntegrationLoadDataForBodyWytEntryLoading, postIntegrationLoadDataForBodyWytEntryError } = useSelector((state) => state.postIntegrationLoadDataForBodyWytEntryReducer);
    const { postIntegrationBodyWeightEntryData, postIntegrationBodyWeightEntryLoading, postIntegrationBodyWeightEntryError } = useSelector((state) => state.postIntegrationBodyWeightEntryReducer);
    const { postIntegrationViewLineRunData } = useSelector((state) => state.postIntegrationViewLineRunReducer);
  
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
    
    useEffect(() => {
        if (route.params && route.params.paramStr) {
            const { ParamStr } = route.params.paramStr;
            const result = {
                id: ParamStr, 
                geoLocation: 'defaultLocation',
            };
            dispatch(postIntegrationLoadDataForBodyWytEntry(userToken, result));
            console.log("result", result);
        }
    }, [dispatch, userToken, route.params]);

    useEffect(() => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setSelectedDate(formattedDate);
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        setSelectedDate(formattedDate);
        hideDatePicker();
    };

    const handleQuantity = (value) => {
        const quantity = parseFloat(value) || 0; 
        setQuanty(value);
        calculateAverage(quantity, parseFloat(weight) || 0);
        if (value!== '0') {
            setErrors({...errors, quanty: '' });
        }
    };
    
    const handleWeight = (value) => {
        const weight = parseFloat(value) || 0; 
        setWeight(value);
        calculateAverage(parseFloat(quanty) || 0, weight);
        if (value!== '0') {
            setErrors({...errors, weight: '' });
        }
    };
    
    const calculateAverage = (quantity, weight) => {
        if (quantity > 0) {
            const average = (weight / quantity).toFixed(3); 
            setAverage(average);
            setErrors({...errors, average: '' });
        } else {
            setAverage('0');
            setErrors({...errors, average: 'Average *' });
        }
    };
    const validateFields = () => {
    
        const newErrors = {
          quanty: quanty === '0' ? 'Required Qty *' : '',
          weight: weight === '0' ? 'Required Wyt *' : '',
        };
        setErrors(newErrors);
        return !newErrors.quanty && !newErrors.weight && !newErrors.average;
      };

    const submitData = async () => {
        const location = await getLocation();      

        if (!validateFields()) {
            return;
          }
        const data = {
            batchId: postIntegrationLoadDataForBodyWytEntryData?.Data?.BatchStr,
            lineRunId: postIntegrationViewLineRunData.ParamStr || '',
            date: selectedDate,
            quantity: parseFloat(quanty),
            weight: parseFloat(weight),
            avarage: parseFloat(average),
            geoLoc: location,
            description: description
        };
        setIsSubmitted(true);
        dispatch(postIntegrationBodyWeightEntry(userToken, data));
    };

    useEffect(() => {
        if (isSubmitted && !postIntegrationBodyWeightEntryLoading && postIntegrationBodyWeightEntryData && postIntegrationBodyWeightEntryData.result === "success") {
            Toast.show({
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: postIntegrationBodyWeightEntryData.Msg,
                text1Style: { color: 'green', flexWrap: 'wrap', flexShrink: 1 },
                style: { width: '90%' },
            });
        }
        if (isSubmitted && !postIntegrationBodyWeightEntryLoading && postIntegrationBodyWeightEntryData && postIntegrationBodyWeightEntryData.result === "Failed") {
            Toast.show({
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: postIntegrationBodyWeightEntryData.Msg,
                text1Style: { color: 'red', flexWrap: 'wrap', flexShrink: 1 },
                style: { width: '90%', height: 40 },
            });
        }
        if (isSubmitted && !postIntegrationBodyWeightEntryLoading && postIntegrationBodyWeightEntryData && postIntegrationBodyWeightEntryData.result === "Error") {
            Toast.show({
                type: 'Error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: postIntegrationBodyWeightEntryData.Msg,
                text1Style: { color: 'red', flexWrap: 'wrap', flexShrink: 1 },
                style: { width: '90%' },
            });
        }
    }, [postIntegrationBodyWeightEntryData, postIntegrationBodyWeightEntryLoading]);

    if (postIntegrationBodyWeightEntryLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (postIntegrationBodyWeightEntryError) {
        return <Text style={styles.error}>Error: {postIntegrationBodyWeightEntryError}</Text>;
    }
    
    return (
        <ScrollView style={styles.container}>
            <View styles={{ flex: 1, marginBottom: 30 }}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                        {postIntegrationLoadDataForBodyWytEntryData?.Data?.BatchName}  -  {postIntegrationLoadDataForBodyWytEntryData?.Data?.FarmName?.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.fieldavaiContainer}>
                    <Text style={styles.avalabel}>Available Birds:</Text>
                    <Text style={styles.avaresponse}>{postIntegrationLoadDataForBodyWytEntryData?.Data?.BalQty}</Text>
                    <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>{selectedDate}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Body Weight
                    </Text>
                    <View style={styles.mortalityContainer}>
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Quantity</Text>
                        {errors.quanty !== '' && <Text style={styles.errorText}>{errors.quanty}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={quanty}
                            onChangeText={handleQuantity}
                        />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Weight</Text>
                        {errors.weight !== '' && <Text style={styles.errorText}>{errors.weight}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={handleWeight}
                        />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Average</Text>
                        {errors.average!== '' && <Text style={styles.errorText}>{errors.average}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={average}
                            onChangeText={calculateAverage}
                            editable={false}
                        />
                    </View>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Description
                    </Text>
                    <View style={styles.mortalityContainer}>
                        <TextInput
                            style={styles.obserinput}
                            placeholder=""
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Submit" onPress={submitData} />
                </View>
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    fieldContainer: {
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: '#03b6fc',
        shadowColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: "white",
        borderRadius: 6
    },
    buttonContainer: {
        marginBottom: 20,
        padding: 10,
        shadowColor: '#000',
        backgroundColor: "white",
        borderRadius: 6
    },
    fieldavaiContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#03b6fc',
        shadowColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: 6
    },
    avalabel: {
        fontSize: 14,
        padding: 4,
        color:'gray'

    },
    avaresponse: {
        fontSize: 14,
        color: 'black',
        marginRight: "30%",
        fontWeight: "bold",
        padding: 4
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        color: 'black',
        textAlign: 'center',
        fontWeight: "bold"
    },
    // dateButton: {
    //     backgroundColor: 'white',
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     borderColor: 'gray',
    //     // height: '80%',
    //     // width: '28%',

    // },
    dateButtonText: {
        color: 'black',
        fontSize: 14,
        textAlign: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        fontWeight: 'bold',
        width: '100%',
        height: 30,
        padding: 4,
       borderRadius:5
    },
    error: {
        color: 'red',
        fontSize: 14,
        padding: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        padding: 4,
    },
    mortalityContainer: {
        flexDirection: 'row',
        justifyContent: 'pace-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mortalityLabel: {
        flex: 1,
        fontSize: 14,
        marginRight: 20,
        color:'gray'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: 100,
        color: 'black',
    },
    obserinput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: "100%",
        height: 100,
        color: 'black',
        textAlignVertical: 'top',
    },
});

export default IntegrationBodyWeightEntry;