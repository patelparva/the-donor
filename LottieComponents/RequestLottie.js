import * as React from 'react';
import { Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
// import LottieView from 'react-native-web-lottie';
import { View } from 'react-native';

export default class RequestLottie extends React.Component {
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
        <View style={{ width: '100%', alignItems: 'center' }}>
          <LottieView
            source={require('../Lotties/request1.json')}
            style={{
              width: '110%',
              alignSelf: 'center',
              marginTop: '8%',
              flex: 1,
            }}
            resizeMode="cover"
            autoPlay
            loop
            autoSize={false}
          />
        </View>
      );
    } else {
      return (
        <LottieView
          source={require('../Lotties/request2.json')}
          style={{
            width: '120%',
            height: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
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
