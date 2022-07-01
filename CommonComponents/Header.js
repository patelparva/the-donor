import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import db from "../config";
import firebase from "firebase";
import { Header, Icon, Badge } from "react-native-elements";
import { DrawerActions } from "react-navigation-drawer";
import { RFValue } from "react-native-responsive-fontsize";

export default class MyHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      currentUser: firebase.auth().currentUser.email,
    };
  }

  componentDidMount() {
    this.getUnreadNotifications();
  }

  getUnreadNotifications = async () => {
    await db
      .collection("Notifications")
      .where("notificationStatus", "==", "unread")
      .where("targetID", "==", this.state.currentUser)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((i) => {
          var notification = i.data();

          allNotifications.push(notification);
        });

        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  BadgeWithIcon = () => {
    return (
      <View>
        <Icon
          type="font-awesome"
          name="bell"
          onPress={() => {
            this.props.navigation.navigate("Notifications");
          }}
        />
        <Badge
          value={this.state.allNotifications.length}
          containerStyle={{ position: "absolute", top: -4, right: -4 }}
        />
      </View>
    );
  };

  render() {
    return (
      <View>
        <Header
          centerComponent={{
            text: this.props.title,
            style: { fontSize: 20, color: "#cecdc5" },
          }}
          leftComponent={
            <TouchableOpacity
              style={{ width: RFValue(25), height: RFValue(25) }}
              onPress={() => {
                this.props.navigation.dispatch(DrawerActions.toggleDrawer());
              }}
            >
              <Icon
                // style={{ width: RFValue(15), height: RFValue(15) }}
                type="font-awesome"
                name="bars"
              />
            </TouchableOpacity>
          }
          rightComponent={<this.BadgeWithIcon {...this.props} />}
          backgroundColor="#539D8B"
        />
      </View>
    );
  }
}
