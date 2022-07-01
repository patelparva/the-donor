import * as React from "react";
import LottieView from 'lottie-react-native';
// import LottieView from "react-native-web-lottie";
import { View } from "react-native";

export default class NoInternetLottie extends React.Component {
  render() {
    return (
      <LottieView
        source={require("../Lotties/no-internet.json")}
        style={{
          width: "90%",
          height: "90%",
          justifyContent: "center",
          alignSelf: "center",
        }}
        autoPlay
        loop
      />
    );
  }
}
