import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Completed from '../index/Tabscreens/Integrationlistview/Completed';
import Running from '../index/Tabscreens/Integrationlistview/Running';
import Draft from '../index/Tabscreens/Integrationlistview/Draft';
import IntegrationListLine from '../index/Integration/IntegrationListLine';
import { View } from 'react-native';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const TabNavigation = () => {

  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: { backgroundColor: "#ccc" },
          headerStyle: { backgroundColor: "white" },
          headerTintColor: 'black',
          headerTitleStyle: { fontSize: 18, fontStyle: 'italic', },
        }}
      >
        <Drawer.Screen
          name="ListView" option={{ headerShown: true }}
        >
          {() => (
            <View style={{ flex: 1 }}>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'IntegrationListLine') {
                      iconName = focused ? 'th-large' : 'th';
                    } else if (route.name === 'Completed') {
                      iconName = focused ? 'check-circle' : 'check-circle-o';
                    } else if (route.name === 'Running') {
                      iconName = focused ? 'play-circle' : 'play-circle-o';
                    } else if (route.name === 'Draft') {
                      iconName = focused ? 'file' : 'file-o';
                    }
                    return <FontAwesome name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: 'green',
                  tabBarInactiveTintColor: '#ccc',
                  tabBarStyle: {
                    backgroundColor: 'white',
                    height: 50,
                    width: "90%",
                    paddingVertical: 5,
                    alignSelf: "center",
                    borderRadius: 50,
                    marginBottom:1,
                    marginTop:1
                  },
                  tabBarLabelStyle: { fontSize: 13, fontStyle: 'italic' },
                })}
              >
                <Tab.Screen
                  name="IntegrationListLine"
                  component={IntegrationListLine}
                  options={{ headerShown: false, tabBarLabel: 'All' }}
                />
                <Tab.Screen
                  name="Completed"
                  component={Completed}
                  options={{ headerShown: false }}
                />
                <Tab.Screen
                  name="Running"
                  component={Running}
                  options={{ headerShown: false }}
                />
                <Tab.Screen
                  name="Draft"
                  component={Draft}
                  options={{ headerShown: false }}
                />
              </Tab.Navigator>
            </View>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  );
};
export default TabNavigation;
