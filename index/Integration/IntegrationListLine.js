import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, ActivityIndicator, Text, View, TouchableOpacity, Image,Animated } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { postListLineRun, postIntegrationViewLineRun } from '../../redux/action';
import IntegrationListLineStyles from "../../styles/IntegrationListLineStyles";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IntegrationStartLine from "./IntegrationStartLine";
import moment from 'moment';

const IntegrationListLine = ({ navigation }) => {
    const dispatch = useDispatch();
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { userToken, postLoginEmployeeData } = useSelector(state => state.postLoginEmployeeReducer);
    const { postListLineRunData, postListLineRunLoading, postListLineRunError } = useSelector(state => state.postListLineRunReducer);
    const { postIntegrationStartLineRunData } = useSelector(state => state.postIntegrationStartLineRunReducer);
    const { postIntegrationViewLineRunData } = useSelector(state => state.postIntegrationViewLineRunReducer);

    useEffect(() => {
        if (userToken) {
            dispatch(postListLineRun(userToken));
        }
    }, [userToken,dispatch]);


    const handleImagePress = () => {
        setShowUserInfo(!showUserInfo);
    };

    const handleStartPress = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleViewPress = (item) => {
        setSelectedItem(item);
        navigation.navigate('IntegrationViewLineRun', { item });
    };

    const handlePlusPress = () => {
        navigation.navigate("IntegrationAddeditLineRun");
    };

    const handleEditPress = (item) => {
        setSelectedItem(item);
        navigation.navigate('IntegrationGeteditLineRun', { item });
    };
    
    const handleLogoutPress = () => {
        // handle logout
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const datetimecal = (dateString) => {
        const utcDate = moment.utc(dateString);
        const localDate = utcDate.local();
        return localDate.format('hh:mm A');
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return IntegrationListLineStyles.completedContainer;
            case 'Running':
                return IntegrationListLineStyles.runningContainer;
            case 'Draft':
                return IntegrationListLineStyles.draftContainer;
            default:
                return IntegrationListLineStyles.defaultContainer;
        }
    };

    const getStatusTextStyle = (status) => {
        switch (status) {
            case 'Completed':
                return { color: 'green', };
            case 'Running':
                return { color: 'red' };
            case 'Draft':
                return { color: '#f6a62e' };
            default:
                return { color: 'black' };
        }
    };

    const renderItem = ({ item }) => (
        <View style={IntegrationListLineStyles.itemContainer}>
            <View style={getStatusStyle(item.Status)}>
            <TouchableOpacity onPress={() => handleViewPress(item)}>
                <View style={IntegrationListLineStyles.timeContainer}>
                    <Text style={IntegrationListLineStyles.itemText}>
                        <Text style={IntegrationListLineStyles.labelText}>Date: </Text>
                        {formatDate(item.Date)}
                    </Text>
                    <Text style={[IntegrationListLineStyles.itemText, getStatusTextStyle(item.Status)]}>
                        <Text style={IntegrationListLineStyles.labelText}>Status: </Text>
                        {item.Status}
                    </Text>
                </View>
                <View style={IntegrationListLineStyles.item1Container}>
                    <View style={IntegrationListLineStyles.timeContainer}>
                        <Text style={IntegrationListLineStyles.itemText}>
                            <Text style={IntegrationListLineStyles.labelText}>LR No :
                            </Text>
                            {item.LrNo}
                        </Text> 
                          <Text style={IntegrationListLineStyles.itemText}>
                            <Text style={IntegrationListLineStyles.labelText}>Start Time: </Text>
                            {postIntegrationStartLineRunData && item.Id === postIntegrationStartLineRunData.Id ? datetimecal(postIntegrationStartLineRunData.StartTimeString) : item.StartTimeString}
                        </Text>

                    </View>
                    
                    <View style={IntegrationListLineStyles.timeContainer}>
                            <Text style={IntegrationListLineStyles.itemText}>
                            <Text style={IntegrationListLineStyles.labelText}>Runner Name: </Text>
                            {item.RunnerName}
                        </Text>
                        <Text style={IntegrationListLineStyles.itemText}>
                            <Text style={IntegrationListLineStyles.labelText}>End Time: </Text>
                            {item.EndTimeString}
                        </Text>
                    </View>
               
                    <View>
                        {item.Status === 'Completed' || item.Status === 'Running' ? (
                            <View style={IntegrationListLineStyles.iconContainer}>
                                <View style={IntegrationListLineStyles.iconWithText}>
                                </View>
                            </View>
                        ) : item.Status === 'Draft' ? (
                            <View style={IntegrationListLineStyles.icondraftContainer}>
                                <View style={IntegrationListLineStyles.iconWithTextView}>
                                    <TouchableOpacity style={IntegrationListLineStyles.iconButton} onPress={() => handleStartPress(item)}>
                                        <FontAwesome5 name="location-arrow" size={12} color="#f6a62e" />
                                        <Text style={IntegrationListLineStyles.startText}>Start</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={IntegrationListLineStyles.iconWithText}>
                                <TouchableOpacity style={IntegrationListLineStyles.iconButton} onPress={() => handleEditPress(item)}>
                                    <FontAwesome5 name="edit" size={14} color="#f6a62e" />
                                    <Text style={IntegrationListLineStyles.startText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={IntegrationListLineStyles.container}>
            {postListLineRunLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : postListLineRunError ? (
                <Text style={IntegrationListLineStyles.errorText}>{postListLineRunError}</Text>
            ) : (
                <FlatList
                    data={postListLineRunData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.Id.toString()}
                    ListEmptyComponent={() => (
                        <Text style={IntegrationListLineStyles.emptyText}>No data available</Text>
                    )}
                />
            )}

            <IntegrationStartLine
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                item={selectedItem}
            />
            <TouchableOpacity style={IntegrationListLineStyles.plusicon} onPress={handlePlusPress}>
                <MaterialCommunityIcons name="message-plus" size={40} color="green" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default IntegrationListLine;
