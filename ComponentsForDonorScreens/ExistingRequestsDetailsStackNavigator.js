import * as React from 'react'
import { createStackNavigator } from 'react-navigation-stack';
import ExistingRequest from '../ScreensForDonor/ExistingRequests';
import ExistingRequestDetails from '../ScreensForDonor/ExistingRequestDetails';

export const ExistingRequestDetailsStackNavigator = createStackNavigator(
  {
    ExistingRequest: {
      screen: ExistingRequest,
      navigationOptions:{headerShown:false}
    },
    ExistingRequestDetails: {
      screen: ExistingRequestDetails,
      navigationOptions:{headerShown:false}
    },
  },
  { initialRouteName: 'ExistingRequest' }
)
