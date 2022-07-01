import * as React from "react";
import { Dimensions } from "react-native";
import LottieView from "lottie-react-native";
// import LottieView from 'react-native-web-lottie';
import { View } from "react-native";

export default class LoadingLottie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomNo: (Math.random() * 4) | 0,
      // randomNo: 3,
    };
  }

  render() {
    if (this.state.randomNo === 0) {
      return (
        <LottieView
          source={require("../Lotties/loading1.json")}
          style={{
            width: "100%",
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
    }
    if (this.state.randomNo === 1) {
      return (
        <LottieView
          source={require("../Lotties/loading2.json")}
          style={{
            width: "120%",
            alignSelf: "center",
            marginTop: "25%",
            flex: 1,
          }}
          resizeMode="cover"
          autoPlay
          loop
          autoSize={false}
        />
      );
    }
    if (this.state.randomNo === 2) {
      return (
        <LottieView
          source={require("../Lotties/loading3.json")}
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: "25%",
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
          source={require("../Lotties/loading4.json")}
          style={{
            width: "60%",
            alignSelf: "center",
            marginTop: "40%",
            flex: 1,
          }}
          resizeMode="cover"
          autoPlay
          loop
          autoSize={false}
        />
      );
    }
  }
}
