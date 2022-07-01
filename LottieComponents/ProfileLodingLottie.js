import * as React from "react";
import { Dimensions } from "react-native";
import LottieView from 'lottie-react-native';
// import LottieView from "react-native-web-lottie";
import { View } from "react-native";

export default class ProfileLottie extends React.Component {
  constructor() {
    super();
    this.state = {
      randomNo: (Math.random() * 2) | 0,
      // randomNo: 1,
    };
  }

  render() {
    if (this.state.randomNo === 0) {
      return (
        <View style={{ width: "100%", alignItems: "center" }}>
          <LottieView
            source={require("../Lotties/profile1.json")}
            style={{
              width: "150%",
              alignSelf: "center",
              // marginTop: '10%',
              flex: 1,
              marginTop: "-2%",
            }}
            resizeMode="cover"
            autoPlay
            loop
          />
        </View>
      );
    } else if (this.state.randomNo === 1) {
      return (
        <View style={{ justifyContent: "center" , flex:1}}>
          <LottieView
            source={require("../Lotties/profile2.json")}
            style={{
              width: "110%",
              height: "100%",
              justifyContent: "center",
              alignSelf: "center",
              flex: 1,
            }}
            resizeMode="cover"
            autoPlay
            loop
          />
        </View>
      );
    }
  }
}
