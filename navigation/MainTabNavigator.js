import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from "react-native-elements";
import TabBarIcon from '../components/TabBarIcon';
import StoreScreen from '../screens/StoreScreen';
import BasketScreen from '../screens/BasketScreen';
import DetailsScreen from '../screens/DetailsScreen';


const StoreStack = createStackNavigator({
  Store: StoreScreen,
  Details: DetailsScreen,
});



StoreStack.navigationOptions = {
  tabBarLabel: 'Store',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-grid${focused ? '' : '-outline'}`
          : 'md-apps'
      }
    />
  ),
};

const BasketStack = createStackNavigator({
  Basket: BasketScreen,
  Details: DetailsScreen,
});

BasketStack.navigationOptions = {
  tabBarLabel: 'Basket',
  tabBarIcon: ({ count, focused }) => (
    <TabBarIcon name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'} focused={focused}></TabBarIcon>
  )
};

export default createBottomTabNavigator({
  StoreStack,
  BasketStack,
});