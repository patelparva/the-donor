import * as React from 'react';
import { Image } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import customSideBarMenu from './CustomSideBarMenu';
import Notifications from '../CommonScreens/Notifications';
import NGOMyProfile from '../ScreensForNGOs/MyProflie';
import { Icon } from 'react-native-elements';
import ItemDetailsStackNavigator from './ItemDetailsStackNavigator';
import VoluntaryItemDetailsStackNavigator from './VoluntaryItemDetailsStackNavigator';
import Request from '../ScreensForNGOs/Request';
import ExploreTabNavigator from '../ComponentsForDonorScreens/TabNavigator';

const NGOAppDrawerNavigator = createDrawerNavigator(
  {
    Explore: {
      screen: ExploreTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="globe-asia" type="font-awesome-5" />,
      },
    },
    Request: {
      screen: Request,
      navigationOptions: {
        drawerIcon: <Icon name="exchange-alt" type="font-awesome-5" />,
      },
    },

    MyRequests: {
      screen: ItemDetailsStackNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="list" type="font-awesome-5" />,
        drawerLabel: 'My Requests',
      },
    },
    NGOVoluntaryDonations: {
      screen: VoluntaryItemDetailsStackNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="hands-helping" type="font-awesome-5" />,
        drawerLabel: 'Voluntary Donations',
      },
    },
    NGOMyProfile: {
      screen: NGOMyProfile,
      navigationOptions: {
        drawerIcon: <Icon name="users" type="font-awesome-5" />,
        drawerLabel: 'NGO Profile',
      },
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
      },
    },
  },
  { contentComponent: customSideBarMenu, initialRouteName: 'Request' }
);

export default NGOAppDrawerNavigator;
