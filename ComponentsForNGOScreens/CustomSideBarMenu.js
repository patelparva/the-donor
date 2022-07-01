import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  Alert,
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import db from "../config";
import { Icon, Avatar } from "react-native-elements";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RFValue } from "react-native-responsive-fontsize";

var drawerHeight = 0;

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
    // Alert.alert(Dimensions.get('window').height.toString())
  }

  getUserName = async () => {
    this.setState({ refreshing: true });
    db.collection("NGO_Details")
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
      .child("ngo_profile/" + email);
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
        scrollEnabled
      >
        <SafeAreaProvider>
          <View style={styles.container}>
            <View
              style={{
                // flex: 1,
                alignSelf: "center",
                alignItems: "center",
                backgroundColor: "#539D8B",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <View style={{ alignSelf: "center", marginTop: "15%" }}>
                <this.ProfilePicture {...this.props} />
              </View>
              <Text
                style={{
                  marginTop: "5%",
                  fontWeight: "bold",
                  marginBottom: "5%",
                  fontSize: RFValue(14),
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
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    // flex: 1,
    marginTop: "5%",
  },
  logOutContainer: {
    marginTop: Dimensions.get("window").height / 3,
  },
  logOutButton: {
    flex: 1,
    flexDirection: "row",
    marginLeft: "10%",
    width: "100%",
  },
});
