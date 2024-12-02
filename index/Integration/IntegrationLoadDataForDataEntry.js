import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Button} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postIntegrationLoadDataForDataEntry, postIntegrationDataEntry } from '../../redux/action';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const IntegrationLoadDataForDataEntry = ({ route = {} }) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [mortalityData, setMortalityData] = useState([]);
    const [feedStockDropdownData, setFeedStockDropdownData] = useState([]);
    const [selectedFeedStock, setSelectedFeedStock] = useState(null);
    const [BalQty, setBalQty] = useState(0);
    const [medbalQty, setmedbalqty] = useState('');
    const [consQty, setConsQty] = useState('');
    const [readingtype, setReadingtype] = useState('');
    const [readingQty, setReadingQty] = useState('');
    const [feedPerBird, setFeedPerBird] = useState('');
    const [observation, setObservation] = useState('');
    const [instruction, setInstruction] = useState('');
    const [notes, setNotes] = useState('');
    const [lateEntryRemark, setLateEntryRemark] = useState('');
    const [showLateEntryRemark, setShowLateEntryRemark] = useState(false);
    const [medicineConsQty, setMedicineConsQty] = useState('');
    const [medicineData, setMedicineData] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [feedStockEntries, setFeedStockEntries] = useState([]);
    const [medicineDataEntries, setMedicineDataEntries] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const { userToken } = useSelector((state) => state.postLoginEmployeeReducer);
    const { postIntegrationLoadDataForDataEntryData, postIntegrationLoadDataForDataEntryLoading, postIntegrationLoadDataForDataEntryError } = useSelector((state) => state.postIntegrationLoadDataForDataEntryReducer);
    const { postIntegrationDataEntryData, postIntegrationDataEntryLoading, postIntegrationrDataEntryError, postIntegrationrDataEntryErrorInvalid } = useSelector((state) => state.postIntegrationDataEntryReducer);
    const { postIntegrationViewLineRunData } = useSelector((state) => state.postIntegrationViewLineRunReducer);

    useEffect(() => {
        if (route.params && route.params.paramStr) {
            const paramStr = route.params.paramStr;
            const result = {
                id: paramStr,
                geoLocation: 'defaultLocation',
            };
            dispatch(postIntegrationLoadDataForDataEntry(userToken, result));
        }
    }, [dispatch, userToken, route.params]);

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
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setSelectedDate(formattedDate);
    }, []);

    useEffect(() => {

        if (postIntegrationLoadDataForDataEntryData?.MortalityMaster) {
            const initialData = postIntegrationLoadDataForDataEntryData.MortalityMaster.map(item => ({
                MortReasonId: item.MortReasonId,
                MortalityName: item.MortalityName,
                Mortality: 0,
                description: ''
            }));
            setMortalityData(initialData);
        }
    }, [postIntegrationLoadDataForDataEntryData]);

    useEffect(() => {
        if (postIntegrationLoadDataForDataEntryData?.Medicine) {
            const medicineDataFormatted = postIntegrationLoadDataForDataEntryData.Medicine.map((medicine) => ({
                label: medicine.Name,
                ItemId:medicine.ItemId,
                value: medicine.Id,
                BalQty: medicine.BalQty,
            }));
            setMedicineData(medicineDataFormatted);
            console.log("medicineDataFormatted",medicineDataFormatted)
        }
    }, [postIntegrationLoadDataForDataEntryData]);

    useEffect(() => {
        if (postIntegrationLoadDataForDataEntryData?.FeedStock && postIntegrationLoadDataForDataEntryData?.Items) {
            const feedStockNames = postIntegrationLoadDataForDataEntryData.FeedStock.reduce((acc, stock) => {
                const item = postIntegrationLoadDataForDataEntryData.Items.find((itm) => itm.Id === stock.ItemId);
                if (item) {
                    const existingItem = acc.find((i) => i.label === item.Name);
                    if (existingItem) {
                        existingItem.BalQty += stock.BalQty;
                    } else {
                        acc.push({ label: item.Name, value: stock.ItemId, BalQty: stock.BalQty });
                    }
                }
                return acc;
            }, []);
            setFeedStockDropdownData(feedStockNames);
        }
    }, [postIntegrationLoadDataForDataEntryData]);

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
        if (selectedDate <= yesterday) {
            setShowLateEntryRemark(true);
        } else {
            setShowLateEntryRemark(false);
        }
    };

    const handleMortalityChange = (index, value) => {
        const updatedData = [...mortalityData];
        updatedData[index].Mortality = Number(value);
        setMortalityData(updatedData);
    };

    const handleFeedStockChange = (item) => {
        setSelectedFeedStock(item.value);
        setBalQty(item.BalQty.toString());
    };

    const updateReadingQty = (consQty, readingtype) => {
        let readingQtyValue = 0;
        if (readingtype === 'K') {
            readingQtyValue = consQty;
        } else if (readingtype === 'B') {
            const bagWeight = 75;
            readingQtyValue = consQty * bagWeight;
        }
        setReadingQty(readingQtyValue.toString());
        calculateFeedPerBird(readingQtyValue);
    };


    const handleConsumptionChange = (value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            setConsQty('');
            setReadingQty('');
            setFeedPerBird('');
            setReadingtype('');
            return;
        }
        setConsQty(parsedValue);
        updateReadingQty(parsedValue, readingtype);
    };

    const handleMedicinenConsumptionChange = (value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            if (value === '') {
                setMedicineConsQty('');
            }
            return;
        }
        setMedicineConsQty(parsedValue.toString());
    };

    const calculateFeedPerBird = (totalFeed) => {
        const availableBirds = postIntegrationLoadDataForDataEntryData?.Available_Birds;
        if (availableBirds && totalFeed) {
            const feedPerBird = (totalFeed * 1000) / availableBirds;
            setFeedPerBird(feedPerBird.toFixed(6).toString());
        } else {
            setFeedPerBird('0');
        }
    };

    const handleFeedTypeChange = (item) => {
        setReadingtype(item.value);
        updateReadingQty(consQty, item.value);
        setReadingtype(item.value);
        updateReadingQty(consQty, item.value);
    };

    useEffect(() => {
        if (BalQty && readingQty) {
            if (parseFloat(BalQty) < parseFloat(readingQty)) {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60,
                    bottomOffset: 40,
                    onHide: () => { },
                    text1: 'Stock quantity cannot be less than reading quantity',
                    text1Style: { color: 'red' },
                });
                setHasError(true);
                setConsQty('');
                setReadingQty('');
                setFeedPerBird('');
                setReadingtype('');
            } else {
                setHasError(false);
            }
        }
    }, [BalQty, readingQty]);

    useEffect(() => {
        if (BalQty && feedPerBird) {
            if (parseFloat(BalQty) < parseFloat(feedPerBird)) {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60,
                    bottomOffset: 40,
                    onHide: () => { },
                    text1: 'Can not add mortality count more then available birds',
                    text1Style: { color: 'red' },
                });
                setHasError(true);
                setConsQty('');
                setReadingQty('');
                setFeedPerBird('');
                setReadingtype('');
            } else {
                setHasError(false);
            }
        }
    }, [BalQty, feedPerBird]);

    useEffect(() => {
        if (medbalQty && medicineConsQty) {
          if (parseFloat(medbalQty) < parseFloat(medicineConsQty)) {
            Toast.show({
              type: 'error',
              position: 'top',
              visibilityTime: 3000,
              autoHide: true,
              topOffset: 60,
              bottomOffset: 40,
              onHide: () => { },
              text1: 'Consumption value cannot be more than stock value',
              text1Style: { color: 'red' },
            });
            setMedicineConsQty('');
          }
        }
      }, [medbalQty, medicineConsQty]);
      
    const handleFeedStockAddition = () => {
        if (postIntegrationLoadDataForDataEntryData && postIntegrationLoadDataForDataEntryData.Items) {
            if (feedStockEntries.length >= postIntegrationLoadDataForDataEntryData.Items.length) {
                let msg = 'You can add only ' + postIntegrationLoadDataForDataEntryData.Items.length + ' items';
                Toast.show({
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60,
                    bottomOffset: 40,
                    text1: msg,
                    text2: 'failed',
                    text1Style: { color: 'red' },
                });
                return;
            }
        }

        if (!selectedFeedStock || !BalQty || !consQty || !readingtype || !readingQty || !feedPerBird) {
            Toast.show({
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: 'Please fill all the fields before adding feed stock details',
                text1Style: { color: 'red' },
            });
            return;
        }

        const newFeedStockEntry = {
            selectedFeedStock,
            BalQty,
            consQty,
            readingtype,
            readingQty,
            feedPerBird,
        };

        setFeedStockEntries([...feedStockEntries, newFeedStockEntry]);
        setSelectedFeedStock(null);
        setBalQty('');
        setConsQty('');
        setReadingtype('');
        setReadingQty('');
        setFeedPerBird('');
    };
    const getFeedStockLabel = (value) => {
        const item = feedStockDropdownData.find((stock) => stock.value === value);
        return item ? item.label : value;
    };

    const handleDeleteFeedStockEntry = (index) => {
        const updatedFeedStockEntries = [...feedStockEntries];
        updatedFeedStockEntries.splice(index, 1);
        setFeedStockEntries(updatedFeedStockEntries);
    };

    const handleDeleteMedicineEntry = (index) => {
        const updatedMedicineDataEntries = [...medicineDataEntries];
        updatedMedicineDataEntries.splice(index, 1);
        setMedicineDataEntries(updatedMedicineDataEntries);
      };    

    const getReadingTypeLabel = (value) => {
        const item = [
            { label: 'Kg', value: 'K' },
            { label: 'Bags', value: 'B' },
        ].find((type) => type.value === value);
        return item ? item.label : value;
    };

    const handleMedicineChange = (item) => {
        const selectedMedicine = postIntegrationLoadDataForDataEntryData?.Medicine.find(medicine => medicine.Id === item.value);
        if (selectedMedicine) {
          setSelectedMedicine(item);
          setmedbalqty(selectedMedicine.BalQty);
        }
      };

    const addMedicineItems = () => {
        if (postIntegrationLoadDataForDataEntryData && postIntegrationLoadDataForDataEntryData.Items) {
            if (medicineDataEntries.length >= postIntegrationLoadDataForDataEntryData.Items.length) {
                let msg = 'You can add only ' + postIntegrationLoadDataForDataEntryData.Items.length + ' items';
                Toast.show({
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60,
                    bottomOffset: 40,
                    text1: msg,
                    text2: 'failed',
                    text1Style: { color: 'red' },
                });
                return;
            }
        }

        if (!selectedMedicine || !medbalQty || !medicineConsQty) {
            Toast.show({
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: 'Please fill all the fields before adding medicine entries details',
                text1Style: { color: 'red' },
            });
            return;
        }
        const newEntry = {
            itemId: selectedMedicine.ItemId, 
            Name: selectedMedicine.label,
            stockId: selectedMedicine.value, // Ensure this is used as stockId
            ConsQty: medicineConsQty,
            BalQty: selectedMedicine.BalQty
        };

        setMedicineDataEntries([...medicineDataEntries, newEntry]);
        setSelectedMedicine(null);
        setmedbalqty('');
        setMedicineConsQty('');
    };

    const submitData = async () => {
        const location = await getLocation();      
        if (showLateEntryRemark && !lateEntryRemark) {
            Toast.show({
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: 'Update Late Entry Reason',
                text1Style: { color: 'red' },
            }); setTimeout(() => {
            }, 5000);
            return;
        }
        const data = {
            entryFor: postIntegrationLoadDataForDataEntryData?.EntryFor || '',
            batchId: postIntegrationLoadDataForDataEntryData?.Data?.ParamStr,
            lineRunId: postIntegrationViewLineRunData.ParamStr || '',
            date: selectedDate || '',
            lateEntryRemark: showLateEntryRemark ? lateEntryRemark : '',
            mortality: mortalityData,
            feed: feedStockEntries.map((entry) => ({
                consQty: parseFloat(entry.consQty) || 0,
                readingQty: parseFloat(entry.readingQty) || 0,
                readingType: entry.readingtype|| '',
                feedType: entry.selectedFeedStock,
            })),
            medicine: medicineDataEntries.map((entry) =>({
                    itemId: entry.itemId|| 0,
                    stockId: parseFloat(entry.stockId)||0,
                    consQty: parseFloat(entry.ConsQty)||0 
                })),
            notes: notes,
            observations: observation,
            instructions: instruction,
            geoLocation: location,
        };
        setIsSubmitted(true);
        dispatch(postIntegrationDataEntry(userToken, data));
        console.log("postIntegrationDataEntry",userToken,data)

    };

    useEffect(() => {
        if (isSubmitted && !postIntegrationDataEntryLoading && postIntegrationDataEntryData && postIntegrationDataEntryData.result === "success") {
            Toast.show({
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: postIntegrationDataEntryData.Msg,
                text1Style: { color: 'green', flexWrap: 'wrap', flexShrink: 1 },
                style: { width: '90%' },
            });
        }
        if (isSubmitted && !postIntegrationDataEntryLoading && postIntegrationDataEntryData && postIntegrationDataEntryData.result === "Failed") {
            Toast.show({
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: postIntegrationDataEntryData.Msg,
                text1Style: { color: 'red', flexWrap: 'wrap', flexShrink: 1 },
                style: { width: '90%', height: 40 },
            });
        }
        if (isSubmitted && !postIntegrationDataEntryLoading && postIntegrationDataEntryData && postIntegrationDataEntryData.result === "Error") {
            Toast.show({
                type: 'Error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                bottomOffset: 40,
                onHide: () => { },
                text1: postIntegrationDataEntryData.Msg,
                text1Style: { color: 'red', flexWrap: 'wrap', flexShrink: 1 },
                style: { width: '90%' },
            });
        }
    }, [postIntegrationDataEntryData, postIntegrationDataEntryLoading]);

    useEffect(() => {
        if (postIntegrationDataEntryData && postIntegrationDataEntryData.result === "success") {
            setMortalityData('');
            setFeedStockDropdownData([]);
            setSelectedFeedStock(null);
            setConsQty('');
            setBalQty('');
            setReadingtype('');
            setReadingQty('');
            setFeedPerBird('');
            setObservation('');
            setInstruction('');
            setNotes('');
            setLateEntryRemark('');
            setShowLateEntryRemark(false);
            setMedicineData([]);
            setHasError(false);
            setIsSubmitted(false);
            setFeedStockEntries([]);
            setMedicineDataEntries([]);
            navigation.navigate('IntegrationLoadDataForDataEntry');
        }
    }, [postIntegrationDataEntryData,dispatch]);

    if (postIntegrationLoadDataForDataEntryLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (postIntegrationLoadDataForDataEntryError) {
        return <Text style={styles.error}>Error: {postIntegrationLoadDataForDataEntryError}</Text>;
    }
    return (
        <ScrollView style={styles.container}>
            <View styles={{ flex: 1, marginBottom: 30 }}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                        {postIntegrationLoadDataForDataEntryData?.BatchName}  -  {postIntegrationLoadDataForDataEntryData?.FarmName?.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.fieldavaiContainer}>
                    <Text style={styles.avalabel}>Available Birds :</Text>
                    <Text style={styles.avaresponse}>{postIntegrationLoadDataForDataEntryData?.Available_Birds}</Text>
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
                {showLateEntryRemark && (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Late Entry Reason</Text>
                        <TextInput
                            style={styles.obserinput}
                            placeholder="Reason"
                            value={lateEntryRemark}
                            onChangeText={setLateEntryRemark}
                            multiline={true}
                        />
                    </View>
                )}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Mortality</Text>
                    {postIntegrationLoadDataForDataEntryData?.MortalityMaster?.map((item, index) => (
                        <View key={item.MortReasonId} style={styles.mortalityContainer}>
                            <Text style={styles.mortalityLabel}>{item.MortalityName}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={item.Mortality}
                                onChangeText={(value) => handleMortalityChange(index, value)}
                            />
                        </View>
                    ))}
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Feed Consumption</Text>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Item Details</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={feedStockDropdownData}
                            itemTextStyle={{color:'black'}}
                            labelField="label"
                            valueField="value"
                            placeholder="Select"
                            value={selectedFeedStock}
                            onChange={handleFeedStockChange}
                        />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Stock</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={BalQty}
                            editable={false}
                        />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Consumption</Text>
                        <TextInput
                            style={styles.consinput}
                            placeholder="0"
                            keyboardType="numeric"
                            value={consQty}
                            onChangeText={handleConsumptionChange}
                        />
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                                { label: 'kg', value: 'K' },
                                { label: 'Bag (75kg)', value: 'B' }
                            ]}
                            labelField="label"
                            itemTextStyle={{color:'black'}}
                            valueField="value"
                            placeholder="Select"
                            value={readingtype}
                            onChange={handleFeedTypeChange}
                        />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Reading Qty</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={readingQty}
                            editable={false}
                        />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Feed/Bird(G)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={feedPerBird}
                            editable={false}
                        />
                    </View>
                    <TouchableOpacity onPress={handleFeedStockAddition}>
                        <Text style={styles.button}>Add</Text>
                    </TouchableOpacity>
                    {feedStockEntries.length > 0 && (
                        <View style={styles.feedStockList}>
                            <Text style={styles.label}>Added Feed Consumption Entries</Text>
                            {feedStockEntries.map((entry, index) => (
                                <View key={index} style={styles.feedStockEntry}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text>
                                                <Text style={styles.textlabel}>Item:     </Text>
                                                <Text style={styles.getdata}>{getFeedStockLabel(entry.selectedFeedStock)}</Text>
                                            </Text>
                                            <Text>
                                                <Text style={styles.textlabel}>stock:     </Text>
                                                <Text style={styles.getdata}>{entry.BalQty}</Text>
                                            </Text>
                                            <Text>
                                                <Text style={styles.textlabel}>Consumption Quantity:     </Text>
                                                <Text style={styles.getdata}>{entry.consQty}</Text>
                                            </Text>
                                            <Text>
                                                <Text style={styles.textlabel}>Kg/Bag:     </Text>
                                                <Text style={styles.getdata}>{getReadingTypeLabel(entry.readingtype)}</Text>
                                            </Text>
                                            <Text>
                                                <Text style={styles.textlabel}>Reading Qty:     </Text>
                                                <Text style={styles.getdata}>{entry.readingQty}</Text>
                                            </Text>
                                            <Text>
                                                <Text style={styles.textlabel}>Feed Per Bird:     </Text>
                                                <Text style={styles.getdata}>{entry.feedPerBird}</Text>
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => handleDeleteFeedStockEntry(index)}>
                                            <AntDesign name="delete" size={15} color="red" style={{ fontWeight: 'bold' }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Medicine Consumption
                    </Text>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Item Details</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={medicineData}
                            labelField="label"
                            itemTextStyle={{color:'black'}}
                            valueField="value"
                            placeholder="Select"
                            value={selectedMedicine}
                            onChange={handleMedicineChange}
                        />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Stock</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={medbalQty.toString()}
                            onChangeText={setmedbalqty}
                            editable={false}


                            />
                    </View>
                    <View style={styles.mortalityContainer}>
                        <Text style={styles.mortalityLabel}>Consumption</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                            value={medicineConsQty}
                            onChangeText={handleMedicinenConsumptionChange}
                        />
                    </View>
                    {medicineData.length > 0 && (
                        <TouchableOpacity onPress={addMedicineItems}>
                            <Text style={styles.button}>Add</Text>
                        </TouchableOpacity>
                    )}
                    {medicineDataEntries.length > 0 && (
                        <View style={styles.feedStockList}>
                            <Text style={styles.label}>Added Medicine Entries</Text>
                            {medicineDataEntries.map((entry, index) => (
                                <View key={index} style={styles.feedStockEntry}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>

                                            <Text>
                                                <Text style={styles.textlabel}>Item: </Text>
                                                <Text style={styles.getdata}>{entry.Name}</Text>
                                            </Text>
                                            
                                             <View style={{flexDirection: 'row'}}>
                                            <Text>
                                                <Text style={styles.textlabel}>stock: </Text>
                                                <Text style={styles.getdata}>{entry.BalQty}</Text>
                                            </Text>
                                            <Text>
                                                <Text style={styles.idtextlabel}>stock    </Text>
                                                <Text style={styles.idgetdata}>{entry.stockId}</Text>
                                            </Text>
                                            </View>
                                            <View style={{flexDirection: 'row'}}>
                                            <Text>
                                                <Text style={styles.textlabel}>Consumption Quantity: </Text>
                                                <Text style={styles.getdata}>{entry.ConsQty}</Text>
                                            </Text>
                                            <Text>
                                                <Text style={styles.idtextlabel}>id:     </Text>
                                                <Text style={styles.idgetdata}>{entry.itemId}</Text>
                                            </Text>
                                            </View>
                                        </View>
                                            <TouchableOpacity onPress={() => handleDeleteMedicineEntry(index)}>
                                                <AntDesign name="delete" size={15} color="red" style={{ fontWeight: 'bold' }} />
                                            </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Observation
                    </Text>
                    <View style={styles.mortalityContainer}>
                        <TextInput
                            style={styles.obserinput}
                            placeholder=""
                            value={observation}
                            onChangeText={setObservation}
                            multiline={true}
                        />
                    </View>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Instruction
                    </Text>
                    <View style={styles.mortalityContainer}>
                        <TextInput
                            style={styles.obserinput}
                            placeholder=""
                            value={instruction}
                            onChangeText={setInstruction}
                            multiline={true}
                        />
                    </View>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Notes
                    </Text>
                    <View style={styles.mortalityContainer}>
                        <TextInput
                            style={styles.obserinput}
                            placeholder=""
                            value={notes}
                            onChangeText={setNotes}
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
    title: {
        fontSize: 2,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center'
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
        fontWeight: "bold",
        
    },
    datelabel: {
        fontSize: 14,
        marginRight: 10,
    },
    // dateButton: {
    //     backgroundColor: 'white',
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     borderColor: 'gray',
    //     height: 30,
    //     width: '30%',
    // },
    dateButtonText: {
        color: 'black',
        fontSize: 14,
        textAlign: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        color: 'black',
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
    mortalityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mortalityLabel: {
        flex: 1,
        fontSize: 14,
        marginRight: 20,
        color:'gray'
    },
    ConsumptionLabel: {
        flex: 1,
        fontSize: 14,
        marginRight: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: 100,
        color: 'black',
    },
    consinput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: 80,
        height: 50,
        color: 'black',
        marginRight: 10,
        textAlign: "center"
    },
    feedStockContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: "40%",
        color:"red"
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#aaa',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    balqtyLabel: {
        fontSize: 16,
        color: 'black',
        marginTop: 10,
        marginBottom: 5,
    },
    balqtyValue: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10,
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
    button: {
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        width: "40%",
        color: "white",
        textAlign: 'center'
    },
    feedStockEntry: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
    textlabel: {
        color: '#ccc',
    },
    getdata: {
        color: 'black'
    },
    idtextlabel: {
        color: 'white',
    },
    idgetdata: {
        color: 'white'
    }
});

export default IntegrationLoadDataForDataEntry;
