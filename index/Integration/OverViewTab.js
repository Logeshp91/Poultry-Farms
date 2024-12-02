import React from 'react';
import { View, Text } from 'react-native';
import IntegrationVLRStyles from '../../styles/IntegrationVLRStyles';



const formatDateTime = (dateString, timeString) => {
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(str => str.trim()); date.toDateString(hours, minutes);
    const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-GB', timeOptions).format(date);

    return `${formattedDate}, ${formattedTime}`;
};
const OverviewTab = ({ data }) => {
    return (
        <View>
            <Text style={IntegrationVLRStyles.contentText}>
                <Text style={IntegrationVLRStyles.contentlabelText}>Line : </Text>
                <Text>{data ? data.LineName : 'Loading...'}</Text>
            </Text>
            <Text style={IntegrationVLRStyles.contentText}>
                <Text style={IntegrationVLRStyles.contentlabelText}>VehicleType : </Text>
                <Text>{data ? `${data.VehicleType} (${data.VehicleNo})` : 'Loading...'}</Text>
            </Text>
            <View style={IntegrationVLRStyles.batchStats}>
                <Text style={IntegrationVLRStyles.contentlabelText}>Time</Text>
                <Text style={IntegrationVLRStyles.contentlabelText}>Kilo Meter</Text>
            </View>
            <View style={IntegrationVLRStyles.batchStats}>
                <Text style={IntegrationVLRStyles.contentText}>
                    <Text style={IntegrationVLRStyles.contentlabelText}>Start : </Text>
                    <Text>
                        {data ? (data.StartTime && data.StartTimeString ? formatDateTime(data.StartTime, data.StartTimeString) : 'N/A') : 'Loading...'}
                    </Text>
                </Text>
                <Text style={IntegrationVLRStyles.contentText}>
                    <Text style={IntegrationVLRStyles.contentlabelText}>Start : </Text>
                    <Text>{data ? data.StartKm || 'N/A' : 'Loading...'}</Text>
                </Text>
            </View>
            <View style={IntegrationVLRStyles.batchStats}>
                <Text style={IntegrationVLRStyles.contentText}>
                    <Text style={IntegrationVLRStyles.contentlabelText}>End : </Text>
                    <Text>
                        {data ? (data.EndTime && data.EndTimeString ? formatDateTime(data.EndTime, data.EndTimeString) : 'N/A') : 'Loading...'}
                    </Text>
                </Text>
                <Text style={IntegrationVLRStyles.contentText}>
                    <Text style={IntegrationVLRStyles.contentlabelText}>End : </Text>
                    <Text>{data ? data.EndKm || 'N/A' : 'Loading...'}</Text>
                </Text>
            </View>
        </View>
    );
};

export default OverviewTab;
