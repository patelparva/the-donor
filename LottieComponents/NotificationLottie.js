import * as React from "react";
import { Dimensions } from "react-native";
import LottieView from "lottie-react-native";
// import LottieView from 'react-native-web-lottie';
import { View } from "react-native";

export default class NotificationLottie extends React.Component {
  constructor() {
    super();
    this.state = {
      randomNo: (Math.random() * 2) | 0,
      // randomNo: 0,
    };
  }

  render() {
    if (this.state.randomNo === 0) {
      return (
        <LottieView
          source={require("../Lotties/notification1.json")}
          style={{
            width: "80%",
            alignSelf: "center",
            marginTop: "35%",
            flex: 1,
          }}
          resizeMode="cover"
          autoPlay
          loop
          autoSize={false}
        />
      );
    } else {
      return (
        <LottieView
          source={require("../Lotties/notification2.json")}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignSelf: "center",
            flex: 1,
          }}
          resizeMode="cover"
          autoPlay
          loop
        />
      );
    }
  }
}
