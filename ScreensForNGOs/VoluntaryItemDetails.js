import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../CommonComponents/Header";
import { RFValue } from "react-native-responsive-fontsize";
import LoadingLottie from "../LottieComponents/LoadingLottie";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser.email,
      itemDetails: [],
      showLoading: true,
      donorID: "",
      date: "",
      hasDonorSentDonation: false,
      details: this.props.navigation.getParam("details"),
      donorName: "",
    };
  }

  componentDidMount = async () => {
    await this.getDonorID();
    await this.getDonorName();
  };

  getDonorID = async () => {
    await db
      .collection("All_Donations")
      .doc(this.state.details.docId)
      .get()
      .then((doc) => {
        var data = doc.data();
        if (data.requestState === "Item Sent") {
          this.setState({
            donorID: data.donorID,
            hasDonorSentDonation: true,
          });
        }
      });
  };

  getDonorName = async () => {
    await db
      .collection("Donor_Details")
      .where("email", "==", this.state.donorID)
      .get()
      .then((snapShot) => {
        snapShot.forEach((i) => {
          var data = i.data();
          this.setState({
            donorName: data.name,
          });
        });
      });
    setTimeout(() => {
      this.setState({ showLoading: false });
    }, 2000);
  };

  updateStatus = async () => {
    await db
      .collection("All_Donations")
      .doc(this.state.details.docId)
      .update({ requestState: "Item Recieved" });
  };

  createNotification = async () => {
    if (this.state.hasDonorSentDonation) {
      await db.collection("Notifications").add({
        recieverID: this.state.currentUser,
        itemName: this.state.details.itemName,
        targetID: this.state.donorID,
        message:
          this.state.details.ngoName +
          " has recieved the " +
          this.state.details.itemName,
        notificationStatus: "unread",
        date: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  showLottie() {
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
            containerStyle={{
              alignSelf: "center",
              justifyContent: "center",
              width: "75%",
              alignItems: "center",
              // height: "18%",
              marginTop: "20%",
            }}
          >
            <Text style={styles.cardTxt}>
              Requested Item : {this.state.details.itemName}
            </Text>
            <Text style={styles.cardTxt}>
              Request Status : {this.state.details.requestState}
            </Text>
            <Text style={styles.cardTxt}>
              Donor Name :{" "}
              {this.state.donorName ? this.state.donorName : "      ----"}
            </Text>
          </Card>
          {this.state.hasDonorSentDonation ? (
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
                        this.props.navigation.navigate("VoluntaryDonations");
                      },
                    },
                  ]
                );
              }}
              style={styles.button}
            >
              <Text>Recieved</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  }

  render() {
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
            text: "Voluntary Item Details",
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
    elevation: RFValue(30),
    shadowOffset: { width: RFValue(8), height: RFValue(8) },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    marginTop: "10%",
    overflow: "visible",
  },
  cardTxt: {
    fontSize: RFValue(15),
  },
});
