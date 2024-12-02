import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import CustomDrawerContent from './CustomDrawerContent';
import TabNavigation from './TabNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const dispatch = useDispatch();

  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="TabNavigation" component={TabNavigation} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
