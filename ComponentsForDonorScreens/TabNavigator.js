import * as React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { Text, View, StyleSheet, Image } from "react-native";
import { Icon } from "react-native-elements";
import { VoluntaryDonationDetailsStackNavigator } from "./VoluntaryDonationDetailsStackNavigator";
import { ExistingRequestDetailsStackNavigator } from "./ExistingRequestsDetailsStackNavigator";
// import { createBottomTabNavigator } from "react-navigation-tabs";

// const DonorTabNavigator = createMaterialBottomTabNavigator({
//   ExistingRequests: {
//     screen: ExistingRequestDetailsStackNavigator,
//     navigationOptions: {
//       tabBarIcon: (
//         <Icon name='hand-holding-heart' type='font-awesome-5'/>
//       ),
//       tabBarLabel: 'Existing Requests',
//       shifting:true,
//       tabBarColor:'#256'
//     },
//   },
//   VoluntaryDonations: {
//     screen: VoluntaryDonationDetailsStackNavigator,
//     navigationOptions: {
//       tabBarIcon: (
//         <Icon name='gifts' type='font-awesome-5'/>
//       ),
//       tabBarLabel: 'Voluntary Donation',
//       shifting:true,
//       tabBarColor:'#153'
//     },
//   },
// });

const DonorTabNavigator = createMaterialBottomTabNavigator(
  {
    ExistingRequest: {
      screen: ExistingRequestDetailsStackNavigator,
      navigationOptions: {
        tabBarIcon: <Icon name="hand-holding-heart" type="font-awesome-5" />,
        tabBarLabel: "Existing Requests",
        shifting: true,
        activeColor: "#f0edf6",
        inactiveColor: "#3e2465",
        barStyle: { backgroundColor: "#264653" },
      },
    },
    VoluntaryDonation: {
      screen: VoluntaryDonationDetailsStackNavigator,
      navigationOptions: {
        tabBarIcon: <Icon name="gifts" type="font-awesome-5" />,
        tabBarLabel: "Voluntary Donation",
        shifting: true,
        activeColor: "#f0edf6",
        inactiveColor: "#3e2465",
        barStyle: { backgroundColor: "#265653" },
      },
    },
  },
  {
    initialRouteName: "ExistingRequest",
  }
);

export default DonorTabNavigator;
