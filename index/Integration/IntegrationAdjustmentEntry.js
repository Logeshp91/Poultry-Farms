import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postIntegrationBodyWeightEntry, postIntegrationViewLineRun, postIntegrationLoadDataForBodyWytEntry, postIntegrationAdjustmentEntry } from '../../redux/action';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import Geolocation from 'react-native-geolocation-service';

const IntegrationAdjustmentEntry = ({ route = {} }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [reason, setReason] = useState('');
    const [reference, setReference] = useState('');
    const [quantity, setQuantity] = useState('0');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        reason: false,
        reference: false,
        quantity: false,
        type: false,
    });

    const { userToken } = useSelector((state) => state.postLoginEmployeeReducer);
    const { postIntegrationLoadDataForBodyWytEntryData, postIntegrationLoadDataForBodyWytEntryLoading, postIntegrationLoadDataForBodyWytEntryError } = useSelector((state) => state.postIntegrationLoadDataForBodyWytEntryReducer);
    const { postIntegrationBodyWeightEntryData, postIntegrationBodyWeightEntryLoading, postIntegrationBodyWeightEntryError } = useSelector((state) => state.postIntegrationBodyWeightEntryReducer);
    const { postIntegrationViewLineRunData } = useSelector((state) => state.postIntegrationViewLineRunReducer);
    const { postIntegrationAdjustmentEntryData, postIntegrationAdjustmentEntryLoading, postIntegrationAdjustmentEntryError } = useSelector((state) => state.postIntegrationAdjustmentEntryReducer);


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

    const validateFields = () => {
        let valid = true;
        const newErrors = {
            reason: !reason,
            quantity: quantity === '' || quantity === '0',
            type: !type,
        };
        setErrors(newErrors);
        for (const key in newErrors) {
            if (newErrors[key]) valid = false;
        }
        return valid;
    };

    const handleChangeText = (setter, field) => (text) => {
        setter(text);
        setErrors(prevErrors => ({ ...prevErrors, [field]: false }));
    };

    const submitData = async () => {
        const location = await getLocation();      

        if (!validateFields()) return; 

        const data = {
            batchId: postIntegrationLoadDataForBodyWytEntryData?.Data?.BatchStr,
            lineRunId: postIntegrationViewLineRunData.ParamStr || '',
            date: selectedDate,
            reason: reason,
            reference: reference,
            quantity: Number(quantity),
            type: type,
            geoLoc: location,
            description: description
        };
        setIsSubmitted(true);
        dispatch(postIntegrationAdjustmentEntry(userToken, data));
    };

    useEffect(() => {
        if (isSubmitted && !postIntegrationAdjustmentEntryLoading) {
            const result = postIntegrationAdjustmentEntryData?.result;
            const message = postIntegrationAdjustmentEntryData?.Msg;
            if (result) {
                Toast.show({
                    type: result === "success" ? 'success' : 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60,
                    bottomOffset: 40,
                    onHide: () => { },
                    text1: message,
                    text1Style: { color: result === "success" ? 'green' : 'red', flexWrap: 'wrap', flexShrink: 1 },
                    style: { width: '90%' },
                });
            }
        }
    }, [postIntegrationAdjustmentEntryData, postIntegrationAdjustmentEntryLoading]);

    if (postIntegrationAdjustmentEntryLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (postIntegrationAdjustmentEntryError) {
        return <Text style={styles.error}>Error: {postIntegrationAdjustmentEntryError}</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View styles={{ flex: 1, marginBottom: 30 }}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                        {postIntegrationLoadDataForBodyWytEntryData?.Data?.FarmName?.toUpperCase()}
                    </Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Adjustment Entry</Text>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.datelabel}>Date</Text>
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

                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Reason</Text>
                        <Dropdown
                            style={errors.reason ? styles.inputError : styles.input}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                                { label: 'Bird Excess', value: 'Bird Excess' },
                                { label: 'Bird Shortage', value: 'Bird Shortage' },
                            ]}
                            labelField="label"
                            itemTextStyle={{color:'black'}}
                            valueField="value"
                            placeholder="Select"
                            value={reason}
                            onChange={(item) => handleChangeText(setReason, 'reason')(item.value)}
                        />
                        {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Reference</Text>
                        <TextInput
                            style={ styles.referenceinput}
                            placeholder=""
                            keyboardType="numeric"
                            value={reference}
                            onChangeText={setReference}
                        />
                        {errors.reference && <Text style={styles.errorText}>{errors.reference}</Text>}
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Quantity</Text>
                        <TextInput
                            style={errors.quantity ? styles.errorquantityinput : styles.quantityinput}
                            placeholder=""
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={handleChangeText(setQuantity, 'quantity')}
                        />
                        <Dropdown
                            style={errors.type ? styles.quantityinputseconderror : styles.inputQty}
                            placeholderStyle={styles.placeholderQtyStyle}
                            selectedTextStyle={styles.selectedQtyStyle}
                            data={[
                                { label: 'Add', value: 'Add' },
                                { label: 'Less', value: 'Less' },
                            ]}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={{color:'black'}}
                            placeholder="Select"
                            value={type}
                            onChange={(item) => handleChangeText(setType, 'type')(item.value)}
                        />
                        {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
                    </View>
                   
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
        </ScrollView>
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
        padding: 4

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
    dateButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        borderColor: 'gray',
        height: 30,
        width: '30%',
        marginTop:10,
        marginBottom:22

    },
    dateButtonText: {
        color: 'black',
        fontSize: 14,
        textAlign: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        color: 'black',
        fontWeight: 'bold',
        width: 113,
        height: 43,
        alignSelf:"center",
        borderRadius:6,
        marginTop:7,
        padding:12,
        marginRight:15
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#aaa',
    },
    selectedQtyStyle: {
        fontSize: 16,
        color: '#000',
    },
    placeholderQtyStyle: {
        fontSize: 16,
        color: '#aaa',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    mortalityContainer: {
        flexDirection: 'row',
        justifyContent: 'pace-between',
        alignItems: 'center',
        marginBottom:10,
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
        width: '67%',
        color: 'black',
    },
    referenceinput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: '67%',
        color: 'black',
        marginLeft:20
    },
    inputQty: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: '33%',
        height:38,
        color: 'black',
    },
    quantityinput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: '29%',
        height:'85%',
        marginRight:15,
        color: 'black',
    },
    quantityinputsecond: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        marginLeft:8,
        width: '34%',
        color: 'black',
    },
    datelabel: {
        flex: 1,
        fontSize: 14,
        marginTop:30,
        color:'gray'
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
    inputError: {
        borderWidth: 1,
        borderColor: '#ff0000', 
        padding: 8,
        borderRadius: 5,
        width: '70%',
        color: 'black',
    },
    quantityinputError: {
        borderWidth: 1,
        borderColor: '#ff0000',
        padding: 8,
        borderRadius: 5,
        width: '35%',
        height:38,
        color: 'black',

    },
    errorquantityinput: {
        borderWidth: 1,
        borderColor: '#ff0000',
        padding: 8,
        borderRadius: 5,
        width: '30%',
        height:'85%',
        marginRight:10,
        color: 'black',
    },
    quantityError: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: '30%',
        height:'45%',
        color: 'black',      

    },
    quantityinputseconderror: {
        borderWidth: 1,
        borderColor: 'red',
        padding: 8,
        borderRadius: 5,
        marginLeft:8,
        width: '34%',
        color: 'black',
    },
});

export default IntegrationAdjustmentEntry;