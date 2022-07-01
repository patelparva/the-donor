import * as React from 'react'
import { createStackNavigator } from 'react-navigation-stack';
import VoluntaryDonations from '../ScreensForNGOs/VoluntaryDonations';
import VoluntaryItemDetails from '../ScreensForNGOs/VoluntaryItemDetails';

const StackNavigator = createStackNavigator(
  {
    VoluntaryDonations: {
      screen: VoluntaryDonations,
      navigationOptions:{headerShown:false}
    },
    VoluntaryItemDetails: {
      screen: VoluntaryItemDetails,
      navigationOptions:{headerShown:false}
    },
  },
  { initialRouteName: 'VoluntaryDonations' }
);

export default StackNavigator