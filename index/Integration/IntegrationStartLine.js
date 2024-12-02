import React, { useState } from "react";
import { View, Text, Modal, Button, StyleSheet, TextInput } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from 'react-redux';
import { postIntegrationStartLineRun,postListLineRun } from '../../redux/action';
import Geolocation from 'react-native-geolocation-service';

const IntegrationStartLine = ({ visible = false, onClose = () => {}, item = {} }) => {
    const dispatch = useDispatch();
    const [dateTime, setDateTime] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [startKm, setStartKm] = useState('');
    const { userToken } = useSelector(state => state.postLoginEmployeeReducer);

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
    
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        setDateTime(selectedDate);
        hideDatePicker();
    };

    const datetimecal = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setMinutes(formattedDate.getMinutes() - formattedDate.getTimezoneOffset());
        return formattedDate.toISOString();
    };

    const handleSubmit = async() => {
        const location = await getLocation();      

        const result = {
            StartKm: parseFloat(startKm) || 0,
            GeoLocation: location,
            ParamStr: item.ParamStr,
            startTime: datetimecal(dateTime),
        };
        dispatch(postIntegrationStartLineRun(userToken, result));
        dispatch(postListLineRun(userToken));  
        onClose();
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.backgrounddrop}>
                <View style={styles.modalView}>
                    <Text style={styles.viewText}>Start the progress</Text>
                    <Text style={styles.viewText}>{item?.RunnerName}</Text>

                    <TextInput
                        style={styles.textInput}
                        placeholder="KM"
                        value={startKm}
                        onChangeText={setStartKm}
                    />
                    <Button title="Select Date and Time" onPress={showDatePicker} color={"green"} />
                    <Text>Date and Time: {datetimecal(dateTime)}</Text>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Submit" onPress={handleSubmit} color={"blue"} />
                        <Button title="Close" onPress={onClose} color={"red"} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backgrounddrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    viewText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: 100,
        marginBottom: 15,
        paddingHorizontal: 10,
        textAlign:'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '50%',
        marginTop: 10,
    }
});

export default IntegrationStartLine;
