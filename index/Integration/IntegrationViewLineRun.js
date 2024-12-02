import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView,Alert } from 'react-native';
import IntegrationVLRStyles from '../../styles/IntegrationVLRStyles';
import { useDispatch, useSelector } from 'react-redux';
import { postIntegrationViewLineRun,postIntegrationPlacementsForLineRun } from '../../redux/action';
import OverviewTab from './OverViewTab';
import ActivitiesTab from './ActivitiesTab';
import AllowanceTab from './AllowanceTab'; 
import HistoryTab from './HistoryTab';


const IntegrationViewLineRun = ({ route }) => {
    
    const [activeTab, setActiveTab] = useState('Overview');
    const dispatch = useDispatch();

    const { userToken } = useSelector((state) => state.postLoginEmployeeReducer);
    const { postIntegrationViewLineRunData,postIntegrationViewLineRunError,postIntegrationViewLineRunDataErrorInvalid } = useSelector((state) => state.postIntegrationViewLineRunReducer);
    const { postIntegrationPlacementsForLineRunData } = useSelector((state) => state.postIntegrationPlacementsForLineRunReducer);

    useEffect(() => {
        if (route.params && route.params.item) {
            const item = route.params.item;
            const result = {
                id: item.ParamStr,
                geoLocation: item.GeoLocation || 'defaultLocation',
            };
            dispatch(postIntegrationViewLineRun(userToken, result));
        }
    }, [dispatch, userToken, route.params]);


    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };


    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return IntegrationVLRStyles.completedContainer;
            case 'Running':
                return IntegrationVLRStyles.runningContainer;
            case 'Draft':
                return IntegrationVLRStyles.draftContainer;
            default:
                return IntegrationVLRStyles.defaultContainer;
        }
    };

    const getTabStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return { backgroundColor: 'green', borderColor: 'green', borderWidth: 1 };
            case 'Running':
                return { backgroundColor: 'red', borderColor: 'red', borderWidth: 1 };
            case 'Draft':
                return { backgroundColor: '#f6a62e', borderColor: '#f6a62e', borderWidth: 1 };
            default:
                return { backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 1 };
        }
    };

    const getTabStatusStyleborder = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    backgroundColor: "white",
                    borderWidth: 0.5,
                    borderColor: '#d0f7d0',
                    backgroundColor: "#d0f7d0",
                    borderRadius: 5,
                    marginHorizontal: 10,
                    shadowOffset: {
                        width: 0,
                        height: 0
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    fontWeight: 'bold',
                    elevation: 6,
                };
            case 'Running':
                return {
                    backgroundColor: "white",
                    borderWidth: 0.5,
                    borderColor: '#fcdad9',
                    backgroundColor: "#fcdad9",
                    borderRadius: 5,
                    marginHorizontal: 10,
                    fontWeight: 'bold',
                    shadowOffset: {
                        width: 0,
                        height: 0
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    elevation: 6,
                };
            case 'Draft':
                return {
                    backgroundColor: "white",
                    borderWidth: 0.5,
                    borderColor: '#fce7cc',
                    backgroundColor: '#fce7cc',
                    borderRadius: 5,
                    fontWeight: 'bold',
                    marginHorizontal: 10,
                    shadowOffset: {
                        width: 0,
                        height: 0
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    elevation: 6,
                };
            default:
                return { backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 1 };
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


    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const handleOverviewPress = (tab) => {
        setActiveTab(tab);
        if (route.params && route.params.item) {
            const item = route.params.item;
            const result = {
                id: item.ParamStr,
                geoLocation: item.GeoLocation || 'defaultLocation',
            };
            dispatch(postIntegrationViewLineRun(userToken, result));
        }
    };
    
    const handleActivitiesPress = (tab) => {
        setActiveTab(tab);
        if (route.params && route.params.item) {
            const item = route.params.item;
            const result = {
                id: item.ParamStr,
                geoLocation: item.GeoLocation || 'defaultLocation',
            };
            dispatch(postIntegrationViewLineRun(userToken, result));
            console.log('Submitting data:', { userToken, result });
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTab data={postIntegrationViewLineRunData} />;
            case 'Activities':
                return <ActivitiesTab selectedItem={route.params.item} status={postIntegrationViewLineRunData?.Status} />;
            case 'Allowance':
                return <AllowanceTab />;
            case 'History':
                return <HistoryTab />;
            default:
                return null;
        }
    };
    

    
    const renderTabs = () => {
        const status = postIntegrationViewLineRunData ? postIntegrationViewLineRunData.Status : '';

        if (status === 'Completed' || status === 'Running') {
            return (
                <>
                    <TouchableOpacity style={[IntegrationVLRStyles.tab,
                    activeTab === 'Overview' ? IntegrationVLRStyles.activeTab : IntegrationVLRStyles.inactiveTab,
                    activeTab === 'Overview' && getTabStatusStyle(status)]} onPress={() => handleOverviewPress('Overview')}>
                        <Text style={activeTab === 'Overview' ? IntegrationVLRStyles.activeTabText : IntegrationVLRStyles.inactiveTabText}>Overview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[IntegrationVLRStyles.tab,
                    activeTab === 'Activities' ? IntegrationVLRStyles.activeTab : IntegrationVLRStyles.inactiveTab,
                    activeTab === 'Activities' && getTabStatusStyle(status)]} onPress={() => handleActivitiesPress('Activities')}>
                        <Text style={activeTab === 'Activities' ? IntegrationVLRStyles.activeTabText : IntegrationVLRStyles.inactiveTabText}>Activities</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[IntegrationVLRStyles.tab,
                    activeTab === 'Allowance' ? IntegrationVLRStyles.activeTab : IntegrationVLRStyles.inactiveTab,
                    activeTab === 'Allowance' && getTabStatusStyle(status)]} onPress={() => handleTabPress('Allowance')}>
                        <Text style={activeTab === 'Allowance' ? IntegrationVLRStyles.activeTabText : IntegrationVLRStyles.inactiveTabText}>Allowance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[IntegrationVLRStyles.tab,
                    activeTab === 'History' ? IntegrationVLRStyles.activeTab : IntegrationVLRStyles.inactiveTab,
                    activeTab === 'History' && getTabStatusStyle(status)]} onPress={() => handleTabPress('History')}>
                        <Text style={activeTab === 'History' ? IntegrationVLRStyles.activeTabText : IntegrationVLRStyles.inactiveTabText}>History</Text>
                    </TouchableOpacity>
                </>
            );
        } else if (status === 'Draft') {
            return (
                <>
                    <TouchableOpacity style={[
                        IntegrationVLRStyles.tab,
                        activeTab === 'Overview' ? IntegrationVLRStyles.activeTab : IntegrationVLRStyles.inactiveTab,
                        activeTab === 'Overview' && getTabStatusStyle(status)]} onPress={() => handleOverviewPress('Overview')}>
                        <Text style={activeTab === 'Overview' ? IntegrationVLRStyles.activeTabText : IntegrationVLRStyles.inactiveTabText}>Overview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[IntegrationVLRStyles.tab, activeTab === 'History' ? IntegrationVLRStyles.activeTab : IntegrationVLRStyles.inactiveTab, activeTab === 'History' && getTabStatusStyle(status)]} onPress={() => handleTabPress('History')}>
                        <Text style={activeTab === 'History' ? IntegrationVLRStyles.activeTabText : IntegrationVLRStyles.inactiveTabText}>History</Text>
                    </TouchableOpacity>
                </>
            );
        }

        return null;
    };

    return (
        <View style={IntegrationVLRStyles.container}>
            <View style={[IntegrationVLRStyles.header, getStatusStyle(postIntegrationViewLineRunData ? postIntegrationViewLineRunData.Status : '')]}>
                <View>
                    <Text style={[IntegrationVLRStyles.batchName, { marginBottom: '1%', marginHorizontal: 10 }]}>
                        {postIntegrationViewLineRunData ? postIntegrationViewLineRunData.LrNo : 'Loading.'}
                    </Text>
                </View>
                <View >
                    <View style={IntegrationVLRStyles.container1}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={[IntegrationVLRStyles.statutstext, getStatusTextStyle(postIntegrationViewLineRunData ? postIntegrationViewLineRunData.Status : ''), getTabStatusStyleborder(postIntegrationViewLineRunData ? postIntegrationViewLineRunData.Status : '')]}>
                                {postIntegrationViewLineRunData ? postIntegrationViewLineRunData.Status : 'Loading...'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={IntegrationVLRStyles.batchStats}>
                    <Text style={IntegrationVLRStyles.statsText}>{postIntegrationViewLineRunData ? formatDate(postIntegrationViewLineRunData.Date) : 'Loading...'} </Text>
                    <Text style={[IntegrationVLRStyles.runnerText]}>{postIntegrationViewLineRunData ? postIntegrationViewLineRunData.RunnerName : 'Loading...'}
                    </Text>
                </View>

            </View>

            {/* Tabs */}
            <View style={IntegrationVLRStyles.tabs}>
                {renderTabs()}
            </View>

            {/* Content */}
            <ScrollView style={[IntegrationVLRStyles.content, getStatusStyle(postIntegrationViewLineRunData ? postIntegrationViewLineRunData.Status : '')]}>
               {renderContent()}
            </ScrollView>
        </View>
    );
};

export default IntegrationViewLineRun;
