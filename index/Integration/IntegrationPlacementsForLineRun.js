import React, { useEffect,  } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postIntegrationPlacementsForLineRun,postIntegrationLoadDataForBodyWytEntry } from '../../redux/action';
import { useNavigation, useRoute } from '@react-navigation/native';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const IntegrationPlacementsForLineRun = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.postLoginEmployeeReducer);
  const { postIntegrationPlacementsForLineRunData, postIntegrationPlacementsForLineRunLoading, postIntegrationPlacementsForLineRunError } = useSelector((state) => state.postIntegrationPlacementsForLineRunReducer);

  const handleEditPress = (item) => {
    console.log("Edit button pressed for:", item);
  };

  const handleDataEntryPress = (paramStr, item) => {
    navigation.navigate("IntegrationLoadDataForDataEntry", { paramStr, item });
  };

  const handleAdjustmentEntryPress = (paramStr, item) => {
    navigation.navigate("IntegrationAdjustmentEntry", { paramStr, item });
  };
  const handleBodyWeightEntryPress = (paramStr, item) => {
    navigation.navigate("IntegrationBodyWeightEntry", { paramStr, item });
  };

  const renderContent = () => {
    if (postIntegrationPlacementsForLineRunLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    if (postIntegrationPlacementsForLineRunError) {
      return <Text style={styles.error}>Error fetching data: {postIntegrationPlacementsForLineRunError}</Text>;
    }
    if (!postIntegrationPlacementsForLineRunData || !postIntegrationPlacementsForLineRunData.Data || postIntegrationPlacementsForLineRunData.Data.length === 0) {
      return <Text>No data available</Text>;
    }

    return postIntegrationPlacementsForLineRunData.Data.map((item) => (
      <View key={item.PlNo} style={styles.itemContainer}>
        <View style={styles.rowsize}>
          <Text style={styles.labelText}>Placements No:</Text>
          <Text style={styles.labelText}>Farm Name:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemText}>{item.PlNo}</Text>
          <Text style={styles.itemText}>{item.FarmName}</Text>
        </View>
        <View style={styles.rowsize}>
          <Text style={styles.labelText}>Incharge Name:</Text>
          <Text style={styles.labelText}>Placed On:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemText}>{item.InchargeName}</Text>
          <Text style={styles.itemText}>{formatDate(item.PDate)}</Text>
        </View>
        <View style={styles.rowsize}>
          <Text style={styles.labelText}>Available Birds:</Text>
          <Text style={styles.labelText}>Status:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.itemText}>{item.AvailableBirds}</Text>
          <Text style={styles.itemText}>{item.Status}</Text>
        </View>
        <View style={styles.row}>
          {item.Status === 'Verified' ? (
            <TouchableOpacity style={styles.button} onPress={() => handleEditPress(item)}>
              <Text style={styles.buttonText}>Data Entry</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={() => handleDataEntryPress(item.ParamStr, item)}>
                <Text style={styles.buttonText}>Data Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleBodyWeightEntryPress(item)}>
                <Text style={styles.buttonText}>Body Weight Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleAdjustmentEntryPress(item)}>
                <Text style={styles.buttonText}>Adjustment Entry</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {renderContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#03b6fc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,   
  },
  rowsize: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#03b6fc',
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  error: {
    color: 'red',
    fontSize: 16,
    padding: 10,
  },
});

export default IntegrationPlacementsForLineRun;
