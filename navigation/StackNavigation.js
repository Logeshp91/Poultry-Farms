import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../index/Account/Login';
import ForgotPassword from '../index/Account/ForgotPassword';
import Mpin from '../index/Account/Mpin';
import SetMpin from '../index/Account/SetMpin';
import IntegrationStartLine from '../index/Integration/IntegrationStartLine';
import IntegrationAddeditLineRun from '../index/Integration/IntegrationAddeditLineRun';
import IntegrationViewLineRun from '../index/Integration/IntegrationViewLineRun';
import TabNavigation from './TabNavigation';
import IntegrationGeteditLineRun from '../index/Integration/IntegrationGeteditLineRun';
import IntegrationPlacementsForLineRun from '../index/Integration/IntegrationPlacementsForLineRun';
import IntegrationLoadDataForDataEntry from '../index/Integration/IntegrationLoadDataForDataEntry';
import IntegrationBodyWeightEntry from '../index/Integration/IntegrationBodyWeightEntry';
import DrawerNavigation from './DrawerNavigation';
import IntegrationAdjustmentEntry from '../index/Integration/IntegrationAdjustmentEntry';
import Loading from '../index/Account/Loading';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Loading" component={Loading} />
        <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Mpin" component={Mpin} />
        <Stack.Screen name="SetMpin" component={SetMpin} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="IntegrationStartLine" component={IntegrationStartLine} />
        <Stack.Screen name="IntegrationAddeditLineRun" component={IntegrationAddeditLineRun} />
        <Stack.Screen name="IntegrationViewLineRun" component={IntegrationViewLineRun} />
        <Stack.Screen name="IntegrationGeteditLineRun" component={IntegrationGeteditLineRun} />
        <Stack.Screen name="IntegrationPlacementsForLineRun" component={IntegrationPlacementsForLineRun} />
        <Stack.Screen name="IntegrationLoadDataForDataEntry" component={IntegrationLoadDataForDataEntry} />
        <Stack.Screen name="IntegrationBodyWeightEntry" component={IntegrationBodyWeightEntry} />
        <Stack.Screen name="IntegrationAdjustmentEntry" component={IntegrationAdjustmentEntry} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
