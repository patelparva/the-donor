import * as React from 'react'
import { createStackNavigator } from 'react-navigation-stack';
import MyRequests from '../ScreensForNGOs/MyRequests';
import ItemDetails from '../ScreensForNGOs/ItemDetails';

const StackNavigator = createStackNavigator(
  {
    MyRequests: {
      screen: MyRequests,
      navigationOptions:{headerShown:false}
    },
    ItemDetails: {
      screen: ItemDetails,
      navigationOptions:{headerShown:false}
    },
  },
  { initialRouteName: 'MyRequests' }
);

export default StackNavigator