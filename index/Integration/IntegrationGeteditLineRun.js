import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { 
  postIntegrationGeteditLineRun, 
  postMastersLineList, 
  postMastersLineRunPurpose, 
  postUserUserList, 
  postIntegrationAddeditLineRun,
  postIntegrationViewLineRun,
} from '../../redux/action';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const IntegrationGeteditLineRun = () => {
  const route = useRoute();
  const { item = {} } = route.params || {};

  const [selectedDate, setSelectedDate] = useState(item.Date || '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(item.PurposeId || null);
  const [selectedPurposeName, setSelectedPurposeName] = useState(item.PurposeName || '');
  const [selectedLine, setSelectedLine] = useState(item.LineId || null);
  const [selectedLineName, setSelectedLineName] = useState(item.LineName || '');
  const [selectedRunner, setSelectedRunner] = useState(item.RunnerId || null);
  const [selectedRunnerName, setSelectedRunnerName] = useState(item.RunnerName || '');
  const [selectedVehicleType, setSelectedVehicleType] = useState(item.VehicleType || null);
  const [vehicleNo, setVehicleNo] = useState(item.VehicleNo || '');
  const [vehicleDetails, setVehicleDetails] = useState(item.VehicleDetails || '');
  const [responseMsg, setResponseMsg] = useState('');
  const [savePressed, setSavePressed] = useState(false);

  const navigation = useNavigation();
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
  const { postIntegrationAddeditLineRunData, postIntegrationAddeditLineRunLoading,postIntegrationAddeditLineRunError,postIntegrationAddeditLineRunErrorInvalid } = useSelector(state => state.postIntegrationAddeditLineRunReducer);
  const { postIntegrationGeteditLineRunData,postIntegrationGeteditLineRunLoading,postIntegrationGeteditLineRunError,postIntegrationGeteditLineRunErrorInvalid } = useSelector(state => state.postIntegrationGeteditLineRunReducer);

  const [purposeOptions, setPurposeOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [runnerOptions, setRunnerOptions] = useState([]);

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
    if (item && item.ParamStr) {
      const data = {
        id: item.ParamStr,
        geoLocation: item.GeoLocation || 'defaultLocation',
      };
      dispatch(postIntegrationGeteditLineRun(userToken, data));
    }
  }, [dispatch, userToken, item]);

  useEffect(() => {
    if (userToken) {
      dispatch(postMastersLineList(userToken));
      dispatch(postMastersLineRunPurpose(userToken));
      dispatch(postUserUserList(userToken));
      dispatch(postIntegrationViewLineRun(userToken))
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    if (postIntegrationGeteditLineRunData && postIntegrationGeteditLineRunData.Data) {
      const data = postIntegrationGeteditLineRunData.Data;
      setSelectedDate(data.Date || selectedDate);
      setSelectedPurpose(data.Purpose || selectedPurpose);
      setSelectedLine(data.LineId || selectedLine);
      setSelectedLineName(data.LineName || selectedLineName);
      setSelectedRunner(data.RunnerId || selectedRunner);
      setSelectedRunnerName(data.RunnerName || selectedRunnerName);
      setSelectedVehicleType(data.VehicleType || selectedVehicleType);
      setVehicleNo(data.VehicleNo || vehicleNo);
      setVehicleDetails(data.VehicleDetails || vehicleDetails);
    }
  }, [postIntegrationGeteditLineRunData]);

  useEffect(() => {
    if (postMastersLineRunPurposeData) {
      setPurposeOptions(postMastersLineRunPurposeData.map(purpose => ({
        label: purpose.Name,
        value: purpose.Id
      })));
    }
  }, [postMastersLineRunPurposeData]);

  useEffect(() => {
    if (postMastersLineListData) {
      setLineOptions(postMastersLineListData.map(line => ({
        label: line.Name,
        value: line.Id
      })));
    }
  }, [postMastersLineListData]);

  useEffect(() => {
    if (postUserUserListData) {
      setRunnerOptions(postUserUserListData.map(runner => ({
        label: runner.Name,
        value: runner.Id
      })));
    }
  }, [postUserUserListData]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
  
  const handleSaveChanges =async () => {
    const location = await getLocation();      
    if (!validateForm()) {
      return;
    }
    setSavePressed(true);
    const Data = {
      id: item.Id || 0,
      date: selectedDate,
      lrNo: item.LrNo,
      purpose: parseInt(selectedPurpose),
      purposeName: selectedPurposeName,
      vehicleType: selectedVehicleType,
      vehicleNo,
      runnerId: parseInt(selectedRunner),
      runnerName: selectedRunnerName,
      lineId: parseInt(selectedLine),
      lineName: selectedLineName,
      vehicleDetails,
      paramStr: item.ParamStr || "defaultParamStr",
      geoLocation: location,
    };

    dispatch(postIntegrationAddeditLineRun(userToken, Data));
  };

  useEffect(() => {
    if (savePressed && postIntegrationAddeditLineRunData) {
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
      } if (postIntegrationAddeditLineRunData.result === "failed") {
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
    } else if (savePressed && postIntegrationAddeditLineRunError) {
      console.error('postIntegrationAddeditLineRunError:', postIntegrationAddeditLineRunError);
      Toast.show({
        type: 'error',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
        text1: postIntegrationAddeditLineRunError.message || "Error occurred",
      });
      setSavePressed(false);
    }
  }, [postIntegrationAddeditLineRunData, postIntegrationAddeditLineRunError]);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          Date <Text style={styles.asterisk}>*</Text>
        </Text>
        <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          style={[styles.input, errors.date ? styles.inputError :{ color: 'black' }]}
          placeholder="Select date"
          value={selectedDate ? formatDate(selectedDate) : ''}
          editable={false}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          Purpose <Text style={styles.asterisk}>*</Text>
        </Text>
        <Dropdown
          style={[styles.input,errors.purpose && styles.inputError ]}
          data={purposeOptions}
          labelField="label"
          valueField="value"
          itemTextStyle={{color:'black'}}
          placeholder="Select Purpose"
          value={selectedPurpose}
          onChange={(item) => {
            setSelectedPurpose(item.value);
            setSelectedPurposeName(item.label);
          }}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          Line <Text style={styles.asterisk}>*</Text>
        </Text>
        <Dropdown
          style={[styles.input, errors.line && styles.inputError]}
          data={lineOptions}
          labelField="label"
          itemTextStyle={{color:'black'}}
          valueField="value"
          placeholder="Select Line"
          value={selectedLine}
          onChange={(item) => {
            setSelectedLine(item.value);
            setSelectedLineName(item.label);
          }}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          Runner <Text style={styles.asterisk}>*</Text>
        </Text>
        <Dropdown
          style={[styles.input, errors.runner && styles.inputError]}
          data={runnerOptions}
          labelField="label"
          itemTextStyle={{color:'black'}}
          valueField="value"
          placeholder="Select Runner"
          value={selectedRunner}
          onChange={(item) => {
            setSelectedRunner(item.value);
            setSelectedRunnerName(item.label);
          }}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          Vehicle Type <Text style={styles.asterisk}>*</Text>
        </Text>
        <Dropdown
          style={[styles.input, errors.vehicleType && styles.inputError]}
          data={vehicleTypeOptions}
          labelField="label"
          valueField="value"
          itemTextStyle={{color:'black'}}
          placeholder="Select Vehicle Type"
          value={selectedVehicleType}
          onChange={item => setSelectedVehicleType(item.value)}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          Vehicle No <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.vehicleNo && styles.inputError]}
          value={vehicleNo}
          onChangeText={setVehicleNo}
          placeholder="Enter Vehicle No"
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          Vehicle Details <Text style={styles.asterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.vehicleDetails && styles.inputError]}
          value={vehicleDetails}
          onChangeText={setVehicleDetails}
          placeholder="Enter Vehicle Details"
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  rowContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: '#787777',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ff0000',
  },
  buttonContainer: {
    marginTop: 16,
  },
  dropdown :
  {
color:"black"
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  asterisk: {
    color: '#ff0000',
  },
  responseMsg: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007bff',
  },
});

export default IntegrationGeteditLineRun;
