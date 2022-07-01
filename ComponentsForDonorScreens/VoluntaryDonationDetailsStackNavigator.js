import * as React from 'react'
import { createStackNavigator } from 'react-navigation-stack';
import VoluntaryDonation from '../ScreensForDonor/VoluntaryDonation';
import VoluntaryDonationDetails from '../ScreensForDonor/VoluntaryDonationDetails';

export const VoluntaryDonationDetailsStackNavigator = createStackNavigator(
  {
    VoluntaryDonation: {
      screen: VoluntaryDonation,
      navigationOptions:{headerShown:false}
    },
    VoluntaryDonationDetails: {
      screen: VoluntaryDonationDetails,
      navigationOptions:{headerShown:false}
    },
  },
  { initialRouteName: 'VoluntaryDonation' }
);
