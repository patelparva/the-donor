import * as React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import customSideBarMenu from './CustomSideBarMenu';
import MyProfile from '../ScreensForDonor/MyProflie';
import DonorTabNavigator from './TabNavigator';
import MyDonations from '../ScreensForDonor/MyDonations';
import Notifications from '../CommonScreens/Notifications';
import { Icon } from 'react-native-elements';

const DonorAppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: DonorTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="font-awesome-5" />,
      },
    },
    MyProfile: {
      screen: MyProfile,
      navigationOptions: {
        drawerIcon: <Icon name="user-alt" type="font-awesome-5" />,
        drawerLabel: 'My Profile',
      },
    },
    MyDonations: {
      screen: MyDonations,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: 'My Donations',
      },
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
      },
    },
  },
  { contentComponent: customSideBarMenu },
  { initialRouteName: 'Home' }
);

export default DonorAppDrawerNavigator;
