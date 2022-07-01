import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  RefreshControl,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../CommonComponents/Header";
import { Icon, ListItem } from "react-native-elements";
import SwipeAbleFlatList from "../CommonComponents/SwipeableFlatList";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NotificationLottie from "../LottieComponents/NotificationLottie";

export default class Notification extends React.Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      currentUser: firebase.auth().currentUser.email,
      refreshing: false,
      showLoading: true,
    };
  }

  componentDidMount = async () => {
    await this.getUnreadNotifications();
  };

  getUnreadNotifications = async () => {
    this.setState({
      allNotifications: [],
      refreshing: true,
      showLoading: true,
    });
    await db
      .collection("Notifications")
      .where("notificationStatus", "==", "unread")
      .where("targetID", "==", this.state.currentUser)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        var key = 0;
        snapshot.docs.map((i) => {
          var notification = i.data();
          notification["docID"] = i.id;

          allNotifications.push(notification);
        });

        this.setState({
          allNotifications: allNotifications,
        });

        console.log(this.state.allNotifications);
      });

    this.setState({
      refreshing: false,
    });
    setTimeout(() => {
      this.setState({ showLoading: false });
    }, 2000);
  };

  showLottie() {
    if (this.state.showLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            // height: Dimensions.get("window").height-(Dimensions.get('window').height/2),
          }}
        >
          <NotificationLottie />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length === 0 &&
          !this.state.showLoading ? (
            <View>
              <Text style={styles.noText}>You have no notifications.</Text>
            </View>
          ) : (
            <SwipeAbleFlatList allNotification={this.state.allNotifications} />
          )}
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Notifications" navigation={this.props.navigation} />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{ flex: 1, marginTop: "7%" }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getUnreadNotifications();
              }}
            />
          }
        >
          {this.showLottie()}
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  noText: {
    textAlign: "center",
    marginTop: "48%",
  },
  container: {
    flex: 1,
  },
});
