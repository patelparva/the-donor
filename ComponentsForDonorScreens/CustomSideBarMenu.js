import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import db from "../config";
import { Icon, Avatar } from "react-native-elements";

export default class SideBarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser.email,
      name: "",
      image: "#",
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getUserName();

    this.fetchUrl(this.state.currentUser);
  }

  getUserName = async () => {
    this.setState({ refreshing: true });
    db.collection("Donor_Details")
      .where("email", "==", this.state.currentUser)
      .get()
      .then((snapshot) => {
        snapshot.forEach((i) => {
          var data = i.data();

          this.setState({
            name: data.name,
          });
        });
      });
    this.setState({ refreshing: false });
  };

  fetchUrl = async (email) => {
    var imageRef = await firebase
      .storage()
      .ref()
      .child("donor_profile/" + email);
    imageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((error) => {
        this.setState({
          image: "#",
        });
      });
  };

  ProfilePicture = () => {
    if (this.state.image === "#") {
      return (
        <Avatar
          rounded
          title={this.state.name[0]}
          size="large"
          containerStyle={{
            backgroundColor: "#78909C",
          }}
        />
      );
    } else {
      return (
        <Avatar
          rounded
          source={{ uri: this.state.image }}
          size="large"
          containerStyle={{ backgroundColor: "" }}
        />
      );
    }
  };

  render() {
    return (
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.getUserName();
              this.fetchUrl(this.state.currentUser);
            }}
          />
        }
      >
        <SafeAreaView>
          <View style={styles.container}>
            <View
              style={{
                flex: 1,
                alignSelf: "center",
                alignItems: "center",
                backgroundColor: "#539D8B",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <View style={{ alignSelf: "center", marginTop: "10%" }}>
                <this.ProfilePicture {...this.props} />
              </View>
              <Text
                style={{
                  marginTop: "5%",
                  fontWeight: "bold",
                  marginBottom: "5%",
                  fontSize: 16,
                }}
              >
                {this.state.name}
              </Text>
            </View>
            <View style={styles.drawerItemsContainer}>
              <DrawerItems {...this.props} />
            </View>
            <View style={styles.logOutContainer}>
              <TouchableOpacity
                style={styles.logOutButton}
                onPress={() => {
                  this.props.navigation.navigate("screen1");
                  firebase.auth().signOut();
                }}
              >
                <Icon name="sign-out-alt" type="font-awesome-5" />
                <Text style={{ paddingLeft: "5%", fontWeight: "bold" }}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
    marginTop: "5%",
  },
  logOutButton: {
    flex: 1,
    flexDirection: "row",
    marginLeft: "10%",
    marginTop: "100%",
    bottom: 0,
    width: "100%",
  },
});
