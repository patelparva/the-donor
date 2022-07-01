import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../CommonComponents/Header";
import LoadingLottie from "../LottieComponents/LoadingLottie";
import { RFValue } from "react-native-responsive-fontsize";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser.email,
      requestID: this.props.navigation.getParam("requestID"),
      requestDetails: {},
      showLoading: true,
      docID: "",
      donorID: "",
      date: "",
      hasDonorSentDonation: false,
      requestStatus: this.props.navigation.getParam("requestStatus"),
    };
  }

  componentDidMount = () => {
    console.log("requestID " + this.state.requestID);

    this.getItemDetails();
    this.getDonorID();
  };

  getItemDetails = async () => {
    await db
      .collection("All_Requests")
      .where("ngoID", "==", this.state.currentUser)
      .where("requestID", "==", this.state.requestID)
      .get()
      .then((i) => {
        i.docs.map((data) => {
          this.setState({
            requestDetails: data.data(),
            showLoading: false,
            docID: data.id,
          });
        });
      });
  };

  getDonorID = async () => {
    await db
      .collection("All_Donations")
      .where("requestID", "==", this.state.requestID)
      .where("requestState", "==", "Item Sent")
      .get()
      .then((i) => {
        i.docs.map((doc) => {
          var data = doc.data();
          this.setState({ donorID: data.donorID, hasDonorSentDonation: true });
        });
      });
    console.log("donorId: " + this.state.donorID);
  };

  updateStatus = async () => {
    console.log(this.state.docID);
    await db.collection("All_Requests").doc(this.state.docID).update({
      requestStatus: "Item(s) Recieved",
    });

    await db
      .collection("All_Donations")
      .where("requestID", "==", this.state.requestID)
      .where("requestState", "==", "Item Sent")
      .get()
      .then((i) => {
        i.docs.map(async (doc) => {
          await db
            .collection("All_Donations")
            .doc(doc.id)
            .update({ requestState: "Item Recieved" });
        });
      });
  };

  createNotification = async () => {
    if (this.state.hasDonorSentDonation) {
      await db.collection("Notifications").add({
        requestID: this.state.requestID,
        recieverID: this.state.currentUser,
        itemName: this.state.requestDetails.itemName,
        targetID: this.state.donorID,
        message:
          this.state.requestDetails.ngoName +
          " has recieved the " +
          this.state.requestDetails.itemName,
        notificationStatus: "unread",
        date: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  sendDeleteNotification = async (donorID) => {
    // Alert.alert(
    //   this.state.currentUser,
    //   this.state.requestDetails.itemName,
    //   donorID,
    //   this.state.requestDetails.ngoName
    // );
    await db.collection("Notifications").add({
      recieverID: this.state.currentUser,
      itemName: this.state.requestDetails.itemName,
      targetID: donorID,
      message:
        this.state.requestDetails.ngoName +
        " has deleted the request of " +
        this.state.requestDetails.itemName,
      notificationStatus: "unread",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  deleteDonations = async () => {
    await db
      .collection("All_Donations")
      .where("requestID", "==", this.state.requestID)
      .get()
      .then((i) => {
        i.docs.map(async (doc) => {
          await db.collection("All_Donations").doc(doc.id).delete();
          if (doc.data().requestState !== "Item Recieved") {
            this.sendDeleteNotification(doc.data().donorID);
          }
        });
      });
  };

  deleteRequest = async () => {
    // Alert.alert(this.state.requestID);
    await db
      .collection("All_Requests")
      .where("requestID", "==", this.state.requestID)
      .get()
      .then((i) => {
        i.docs.map(async (doc) => {
          await db
            .collection("All_Requests")
            .doc(doc.id)
            .delete()
            .then(() => {
              ToastAndroid.show(
                "Request Deleted Successfully!",
                ToastAndroid.SHORT
              );
            });
        });
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  showLottie() {
    var item = this.state.requestDetails;
    if (this.state.showLoading) {
      return (
        <View style={{ flex: 0.7, marginTop: "-30%" }}>
          <LoadingLottie />
        </View>
      );
    } else {
      return (
        <View>
          <Card
            containerStyle={{ alignSelf: "center", justifyContent: "center" }}
          >
            <Text>Requested Item : {this.state.requestDetails.itemName}</Text>
            <Text>Item Quantity : {this.state.requestDetails.quantity}</Text>
            <Text>
              Request Status : {this.state.requestDetails.requestStatus}
            </Text>
            <Text>{"Date: " + item.date}</Text>
          </Card>
          {this.state.requestStatus === "Item(s) Requested" ? (
            <View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirmation",
                  "Are you sure you recieved the donation.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        this.updateStatus();
                        this.createNotification();
                        this.props.navigation.navigate("MyRequests");
                      },
                    },
                  ]
                );
              }}
              style={styles.button}
            >
              <Text>Recieved</Text>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Confirmation",
                "Are you sure you want to delete the request",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      this.deleteRequest();
                      this.deleteDonations();
                      this.props.navigation.navigate("MyRequests");
                    },
                  },
                ]
              );
            }}
            style={[
              styles.button,
              { backgroundColor: "#ED5E68", flexDirection: "row" },
            ]}
          >
            <Text>Delete</Text>
            <Icon
              type="font-awesome-5"
              name="trash-alt"
              style={{ marginLeft: RFValue(2), transform: [{ scale: 0.75 }] }}
            />
          </TouchableOpacity>
          </View>
          ) : null}
        </View>
      );
    }
  }

  render() {
    console.log("donorID" + this.state.donorID);
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="feather"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          }
          centerComponent={{
            text: "Item Details",
            style: { fontSize: 20, color: "#cecdc5" },
          }}
          backgroundColor="#539D8B"
        />
        {this.showLottie()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: "30%",
    height: RFValue(35),
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: RFValue(10),
    backgroundColor: "#539D8B",
    shadowColor: "black",
    elevation: 30,
    shadowOffset: { width: RFValue(8), height: RFValue(8) },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    marginTop: "5%",
    overflow: "visible",
  },
});
