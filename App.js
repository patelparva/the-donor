import * as React from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import Welcome from "./CommonScreens/Welcome";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import NGOAppDrawer from "./ComponentsForNGOScreens/AppDrawer";
import DonorAppDrawer from "./ComponentsForDonorScreens/AppDrawer";
import NetInfo from "@react-native-community/netinfo";
import NoInternetLottie from "./LottieComponents/NoInternetLottie";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import 'react-native-gesture-handler';
import SplashScreen from "react-native-splash-screen";

export default class App extends React.Component {
  NetInfoSubscribtion = null;

  constructor(props) {
    super(props);
    this.state = {
      isInternetReachable: "",
      showLoading: true,
    };
  }

  componentDidMount() {
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this.handleConnectivityChange
    );

    console.log(this.state.isInternetReachable);

    // SplashScreen.hide()
  }

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  handleConnectivityChange = (state) => {
    this.setState({
      isInternetReachable: state.isInternetReachable,
      showLoading: false,
    });
  };

  render() {
    if (this.state.showLoading) {
      return (
        <SafeAreaProvider>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size={RFValue(50)} color="#000" />;
          </View>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      );
    } else {
      if (this.state.isInternetReachable) {
        return (
          <SafeAreaProvider>
            <View style={styles.container}>
              <AppContainer />
              <StatusBar style="auto" />
            </View>
          </SafeAreaProvider>
        );
      } else {
        return (
          <View style={{ alignSelf: "center", justifyContent: "center" }}>
            <NoInternetLottie />
            <Text style={{ textAlign: "center", fontSize: 25 }}>
              No Internet
            </Text>
            <StatusBar style="auto" />
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

const SwitchNavigator = createSwitchNavigator({
  screen1: Welcome,
  screen2: DonorAppDrawer,
  screen3: NGOAppDrawer,
});

const AppContainer = createAppContainer(SwitchNavigator);
