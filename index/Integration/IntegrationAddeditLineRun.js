import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { postIntegrationAddeditLineRun, postListLineRun, postMastersLineList, postMastersLineRunPurpose, postUserUserList } from '../../redux/action';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native'; 
import Geolocation from 'react-native-geolocation-service';

const IntegrationAddeditLineRun = ({ item = {} }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedRunner, setSelectedRunner] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const navigation = useNavigation(); 
  const [savePressed, setSavePressed] = useState(false);

  const [errors, setErrors] = useState({
    date: false,
    purpose: false,
    line: false,
    runner: false,
    vehicleType: false,
    vehicleNo: false,
    vehicleDetails: false,
  });

  const dispatch = useDispatch();
  const { userToken } = useSelector(state => state.postLoginEmployeeReducer);
  const { postMastersLineListData } = useSelector(state => state.postMastersLineListReducer);
  const { postMastersLineRunPurposeData } = useSelector(state => state.postMastersLineRunPurposeReducer);
  const { postUserUserListData } = useSelector(state => state.postUserUserListReducer);
  const { postIntegrationAddeditLineRunData, error } = useSelector(state => state.postIntegrationAddeditLineRunReducer);

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
    if (userToken) {
      dispatch(postMastersLineList(userToken)); 
      dispatch(postMastersLineRunPurpose(userToken));
      dispatch(postUserUserList(userToken));
    }
  }, [userToken]);

  useEffect(() => {
    if (postIntegrationAddeditLineRunData) {
      setResponseMsg(postIntegrationAddeditLineRunData.Msg);
    } else if (error) {
      setResponseMsg("Error: " + error);
    }
  }, [postIntegrationAddeditLineRunData, error]);

  const purposeOptions = postMastersLineRunPurposeData.map(item => ({
    label: item.Name,
    value: item.Id.toString(),
  }));

  const lineOptions = postMastersLineListData.map(item => ({
    label: item.Name,
    value: item.Id.toString(),
  }));

  const runnerOptions = postUserUserListData.map(item => ({
    label: item.Name,
    value: item.Id.toString(),
  }));

  const vehicleTypeOptions = [
    { label: 'Bike', value: 'Bike' },
    { label: 'Car', value: 'Car' },
    { label: 'Other', value: 'Other' },
  ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {
      date: !selectedDate,
      purpose: !selectedPurpose,
      line: !selectedLine,
      runner: !selectedRunner,
      vehicleType: !selectedVehicleType,
      vehicleNo: !vehicleNo.trim(),
      vehicleDetails: !vehicleDetails.trim(),
    };

    setErrors(newErrors);

    for (const error in newErrors) {
      if (newErrors[error]) {
        formIsValid = false;
        break;
      }
    }

    return formIsValid;
  };

  useEffect(() => {
    if (savePressed) {
      if (postIntegrationAddeditLineRunData) {
        console.log('postIntegrationAddeditLineRunData:', postIntegrationAddeditLineRunData);
        if (postIntegrationAddeditLineRunData.result === "success") {
          Toast.show({
            type: 'success',
            position: 'top',
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 60,
            bottomOffset: 40,
            onHide: () => {
              navigation.navigate('IntegrationListLine');
            },
            text1: postIntegrationAddeditLineRunData.Msg,
          });
        } else if (postIntegrationAddeditLineRunData.result === "failed") {
          Toast.show({
            type: 'error',
            position: 'top',
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 60,
            bottomOffset: 40,
            text1: postIntegrationAddeditLineRunData.Msg || "Error occurred",
          });
        }
        setSavePressed(false);
      } else if (error) {
        console.error('postIntegrationAddeditLineRunError:', error);
        Toast.show({
          type: 'error',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 60,
          bottomOffset: 40,
          text1: error.message || "Error occurred",
        });
        setSavePressed(false);
      }
    }
  }, [postIntegrationAddeditLineRunData, error, savePressed, navigation]);

 const handleSaveChanges = async() => {
  const location = await getLocation();      

    if (!validateForm()) {
      return;
    }

    const Data = {
      id: 0,
      date: selectedDate,
      lrNo: 'string',
      purpose: parseInt(selectedPurpose),
      vehicleType: selectedVehicleType,
      vehicleNo,
      runnerId: parseInt(selectedRunner),
      lineId: parseInt(selectedLine),
      vehicleDetails,
      paramStr: item.paramStr || "defaultParamStr",
      geoLocation: location ,
    };

    console.log("Dispatching data:", Data);
    dispatch(postIntegrationAddeditLineRun(userToken, Data));
    setSavePressed(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, errors.date ? styles.errorText : null]}>Date</Text>
        <Text style={styles.requiredAsterisk}>*</Text>
      </View>
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          style={[styles.input, styles.dateInput, errors.date ? styles.inputError : null]}
          placeholder="Select date"
          value={selectedDate}
          editable={false}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.labelContainer}>
        <Text style={[styles.label, errors.purpose ? styles.errorText : null]}>Purpose</Text>
        <Text style={styles.requiredAsterisk}>*</Text>
      </View>
      <Dropdown
        style={[styles.dropdown, styles.dropdownPurpose, errors.purpose ? styles.inputError : null]}
        data={purposeOptions}
        labelField="label"
        itemTextStyle={{color:'black'}}
        valueField="value"
        placeholder="Select purpose"
        value={selectedPurpose}
        onChange={item => setSelectedPurpose(item.value)}
        selectedTextStyle={styles.selectedText}
      />

      <View style={styles.labelContainer}>
        <Text style={[styles.label, errors.line ? styles.errorText : null]}>Line</Text>
        <Text style={styles.requiredAsterisk}>*</Text>
      </View>
      <Dropdown
        style={[styles.dropdown, errors.line ? styles.inputError : null]}
        data={lineOptions}
        labelField="label"
        valueField="value"
        itemTextStyle={{color:'black'}}
        placeholder="Select line"
        value={selectedLine}
        onChange={item => setSelectedLine(item.value)}
        selectedTextStyle={styles.selectedText}
      />

      <View style={styles.labelContainer}>
        <Text style={[styles.label, errors.runner ? styles.errorText : null]}>Runner</Text>
        <Text style={styles.requiredAsterisk}>*</Text>
      </View>
      <Dropdown
        style={[styles.dropdown, errors.runner ? styles.inputError : null]}
        data={runnerOptions}
        labelField="label"
        valueField="value"
        placeholder="Select runner"
        value={selectedRunner}
        itemTextStyle={{color:'black'}}
        onChange={item => setSelectedRunner(item.value)}
        selectedTextStyle={styles.selectedText}
      />

      <View style={styles.labelContainer}>
        <Text style={[styles.label, errors.vehicleType ? styles.errorText : null]}>Vehicle Type</Text>
        <Text style={styles.requiredAsterisk}>*</Text>
      </View>
      <Dropdown
        style={[styles.dropdown, errors.vehicleType ? styles.inputError : null]}
        data={vehicleTypeOptions}
        labelField="label"
        valueField="value"
        itemTextStyle={{color:'black'}}
        placeholder="Select vehicle type"
        value={selectedVehicleType}
        onChange={item => setSelectedVehicleType(item.value)}
        selectedTextStyle={styles.selectedText}
      />

      <View style={styles.labelContainer}>
        <Text style={[styles.label, errors.vehicleNo ? styles.errorText : null]}>Vehicle No</Text>
        <Text style={styles.requiredAsterisk}>*</Text>
      </View>
      <TextInput
        style={[styles.input, errors.vehicleNo ? styles.inputError : null]}
        placeholder="Enter vehicle number"
        value={vehicleNo}
        onChangeText={setVehicleNo}
      />

      <View style={styles.labelContainer}>
        <Text style={[styles.label, errors.vehicleDetails ? styles.errorText : null]}>Vehicle Details</Text>
        <Text style={styles.requiredAsterisk}>*</Text>
      </View>
      <TextInput
        style={[styles.input, errors.vehicleDetails ? styles.inputError : null]}
        placeholder="Enter vehicle details"
        value={vehicleDetails}
        onChangeText={setVehicleDetails}
      />

      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.customButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 29,
  },
  dropdown: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 5,
    width: '100%',
    height: 43,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    height: 43,
    backgroundColor: "white",
    fontSize: 16,
    color: "black",
  },
  selectedText: {
    color: 'black',
  },
  dateInput: {
    fontSize: 16,
    color: "black",
  },
  buttonContainer: {
    marginTop: 20,
  },
  customButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  inputError: {
    borderColor: 'red',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color:"#787777"
  },
  requiredAsterisk: {
    color: 'red',
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
  },
});

export default IntegrationAddeditLineRun;
