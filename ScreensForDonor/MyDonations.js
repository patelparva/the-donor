import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  ToastAndroid,
  Linking,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { Icon, ListItem } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import MyHeader from "../CommonComponents/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ListLottie from "../LottieComponents/ListLottie";
import NothingLottie from "../LottieComponents/NothingLottie";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myDonations: "",
      currentUser: firebase.auth().currentUser.email,
      showLoading: true,
      donorName: "",
      refreshing: false,
      showLottie: true,
    };
  }

  getMyDonations = async () => {
    this.setState({
      myDonations: "",
      refreshing: true,
      showLottie: true,
    });
    await db
      .collection("All_Donations")
      .where("donorID", "==", this.state.currentUser)
      .onSnapshot((snapshot) => {
        this.setState({ myDonations: "", showLottie: true });
        snapshot.forEach((i) => {
          if (i.data().requestState !== "Item Recieved") {
            var data = i.data();
            data["docID"] = i.id;
            this.setState({
              myDonations: [...this.state.myDonations, data],
              showLoading: false,
            });
          }
        });
        setTimeout(() => {
          this.setState({ showLottie: false });
        }, 2000);
      });

    this.setState({ showLoading: false, refreshing: false });
  };

  componentDidMount() {
    this.getMyDonations();
    this.getDonorName();
  }

  getDonorName = async () => {
    db.collection("Donor_Details")
      .where("email", "==", this.state.currentUser)
      .get()
      .then((snapshot) => {
        snapshot.forEach((i) => {
          var data = i.data();

          this.setState({
            donorName: data.name,
          });
        });
      });
  };

  sendItem = async (item) => {
    this.setState({ myDonations: [] });
    if (item.requestState === "Item Sent") {
      await db
        .collection("All_Donations")
        .doc(item.docID)
        .update({ requestState: "Donor Interested" });
      var requestState = "Donor Interested";
      this.updateNotification(item, requestState);
    } else {
      await db
        .collection("All_Donations")
        .doc(item.docID)
        .update({ requestState: "Item Sent" });
      var requestState1 = "Item Sent";
      this.updateNotification(item, requestState1);
    }
  };

  updateNotification = async (item, state) => {
    await db
      .collection("Notifications")
      .where("donorID", "==", this.state.currentUser)
      .where(
        "message",
        "==",
        this.state.donorName + " has sent the " + item.itemName + "." ||
          this.state.donorName +
            " has shown interest in donating the " +
            item.itemName +
            "."
      )
      .get()
      .then((snapshot) => {
        snapshot.forEach((i) => {
          var message;
          if (state === "Item Sent") {
            message =
              this.state.donorName + " has sent the " + item.itemName + ".";
          } else {
            message =
              this.state.donorName +
              " has shown interest in donating the " +
              item.itemName +
              ".";
          }

          db.collection("Notifications").doc(i.id).update({
            message: message,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            notificationStatus: "unread",
          });
        });
      });
  };

  deleteDonation = async (index) => {
    await db
      .collection("All_Donations")
      .doc(index)
      .delete()
      .then(() => {
        ToastAndroid.show("Request Deleted Successfully!", ToastAndroid.SHORT);
      });
  };

  sendDeleteNotification = async (item) => {
    await db.collection("Notifications").add({
      donorID: this.state.currentUser,
      itemName: item.itemName,
      targetID: item.ngoID,
      message:
        this.state.donorName + " has deleted the donation of " + item.itemName,
      notificationStatus: "unread",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  showLottie() {
    if (this.state.showLottie) {
      return <ListLottie />;
    } else {
      if (this.state.myDonations) {
        return (
          <FlatList
            data={this.state.myDonations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, i }) => {
              return (
                <View>
                  <ListItem
                    title={"Donation : " + item.itemName}
                    subtitle={"Donated to : " + item.ngoName}
                    rightElement={
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            {
                              backgroundColor:
                                item.requestState === "Item Sent"
                                  ? "#e5dec4"
                                  : "#539D8B",
                            },
                          ]}
                          onPress={() => {
                            this.sendItem(item);
                          }}
                        >
                          <Text>
                            {item.requestState === "Donor Interested"
                              ? "Send Item"
                              : "Item Sent"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              "Confirmation",
                              "Are you sure you want to delete the donation.",
                              [
                                {
                                  text: "Cancel",
                                  onPress: () => console.log("Cancel Pressed"),
                                  style: "cancel",
                                },
                                {
                                  text: "Yes",
                                  onPress: () => {
                                    this.sendDeleteNotification(item);
                                    this.deleteDonation(item.docID);
                                  },
                                },
                              ]
                            );
                          }}
                        >
                          <Icon
                            type="font-awesome-5"
                            name="trash-alt"
                            style={{ marginLeft: RFValue(15) }}
                          />
                        </TouchableOpacity>
                      </View>
                    }
                    bottomDivider
                  />
                </View>
              );
            }}
          />
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: "25%",
            }}
          >
            <NothingLottie/>
            <Text>
              You didn't donate yet.{" "}
              <Text
                style={{ color: "blue" }}
                onPress={() => {
                  this.props.navigation.navigate("Home");
                }}
              >
                Donate Now...
              </Text>
            </Text>
          </View>
        );
      }
    }
  }

  render() {
    if (this.state.showLoading) {
      return <ActivityIndicator size={RFValue(50)} color="#000" />;
    } else {
      return (
        <SafeAreaProvider style={styles.container}>
          <MyHeader title="My Donations" navigation={this.props.navigation} />
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.getMyDonations();
                  this.getDonorName();
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#539D8B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
    borderBottomColor: "black",
    borderBottomWidth: RFValue(5),
    marginLeft: RFValue(25),
  },
});
