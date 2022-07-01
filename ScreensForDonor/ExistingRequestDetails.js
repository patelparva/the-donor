import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  ScrollView,
  RefreshControl,
  Modal,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { ListItem, Card, Header, Icon } from "react-native-elements";
import Communications from "react-native-communications";
import Hyperlink from "react-native-hyperlink";
import MyHeader from "../CommonComponents/Header";
import LottieView from "lottie-react-native";
import AnimatedLottieView from "lottie-react-native";
import LoadingLottie from "../LottieComponents/LoadingLottie";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestID: this.props.navigation.getParam("details")["requestID"],
      details: [],
      showLoading: true,
      ngoDetails: [],
      currentUser: firebase.auth().currentUser.email,
      donorName: "",
      donationAlreadyExist: false,
      myDonations: [],
      refreshing: false,
      showModal: false,
      scaleValue: new Animated.Value(0),
    };
  }

  getRequestDetails = async () => {
    this.setState({
      details: "",
      refreshing: true,
      showLoading: true,
    });
    await db
      .collection("All_Requests")
      .where("requestID", "==", this.state.requestID)
      .get()
      .then((i) => {
        i.docs.map((data) => {
          this.setState({
            details: data.data(),
          });

          this.getNGODetails();

          console.log(this.state.details);
        });
      });
    this.setState({
      refreshing: false,
    });
  };

  getNGODetails = async () => {
    this.setState({
      ngoDetails: [],
    });
    await db
      .collection("NGO_Details")
      .where("email", "==", this.state.details.ngoID)
      .get()
      .then((i) => {
        i.docs.map((data) => {
          this.setState({
            ngoDetails: data.data(),
          });
        });
      });
  };

  getMyDonations = async () => {
    this.setState({
      myDonations: [],
    });
    var myDonations = [];

    await db
      .collection("All_Donations")
      .where("donorID", "==", this.state.currentUser)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation["docID"] = doc.id;

          myDonations.push(donation);
        });

        this.setState({
          myDonations: myDonations,
        });

        this.checkMyDonations();

        console.log(myDonations);
      });

    setTimeout(() => {
      this.setState({ showLoading: false });
    }, 2000);
  };

  addDonation = async () => {
    if (!this.state.donationAlreadyExist) {
      await db.collection("All_Donations").add({
        ngoID: this.state.details.ngoID,
        requestID: this.state.requestID,
        donorID: this.state.currentUser,
        itemName: this.state.details.itemName,
        ngoName: this.state.details.ngoName,
        requestState: "Donor Interested",
        donationType: "Requested Donation",
      });
    }
  };

  getDonorName = async () => {
    await db
      .collection("Donor_Details")
      .where("email", "==", this.state.currentUser)
      .get()
      .then((snapShot) => {
        snapShot.forEach((i) => {
          var data = i.data();
          this.setState({
            donorName: data.name,
          });
        });
      });
  };

  createNotification = async () => {
    var message =
      this.state.donorName +
      " has shown interest in donating " +
      this.state.details.itemName +
      ".";

    if (!this.state.donationAlreadyExist) {
      await db.collection("Notifications").add({
        requestID: this.state.requestID,
        donorID: this.state.currentUser,
        itemName: this.state.details.itemName,
        targetID: this.state.details.ngoID,
        message: message,
        notificationStatus: "unread",
        date: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  checkMyDonations = () => {
    for (var i = 0; i < this.state.myDonations.length; i++) {
      console.log("Hi");

      if (this.state.myDonations[i]["requestID"] === this.state.requestID) {
        console.log("Hello");

        this.setState({
          donationAlreadyExist: true,
        });
      }
    }
  };

  componentDidMount = async () => {
    await this.getRequestDetails();
    await this.getDonorName();
    await this.getMyDonations();

    console.log(this.state.details.ngoID);
  };

  showModal() {
    if (this.state.showModal) {
      Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration: 500,
      }).start();
    } else {
      Animated.timing(this.state.scaleValue, {
        toValue: 0,
        duration: 500,
      }).start();
    }
    return (
      <Modal transparent={true} visible={this.state.showModal}>
        <View style={styles.modalBackGround}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: this.state.scaleValue }] },
            ]}
          >
            <View style={{ alignItems: "center" }}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ showModal: false });
                    this.props.navigation.navigate("MyDonations");
                  }}
                >
                  <Image
                    source={require("../assets/cancel.png")}
                    style={{ height: 30, width: 30 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <AnimatedLottieView
                source={require("../Lotties/success.json")}
                style={{
                  width: RFValue(1000),
                  height: RFValue(150),
                  marginTop: RFValue(-18),
                  marginBotto: RFValue(-30),
                }}
                autoPlay
                loop={false}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }

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
          <LoadingLottie />
        </View>
      );
    } else {
      return (
        <View style={{ marginTop: "30%" }}>
          <Card title="Request Details">
            <Text>Item Requested : {this.state.details.itemName}</Text>
            <Text>Quantity : {this.state.details.quantity}</Text>
          </Card>
          <Card title="NGO Details">
            <Text>NGO Name : {this.state.ngoDetails.name}</Text>
            <Text>Type : {this.state.ngoDetails.type}</Text>
            <Text
              onPress={() => {
                Linking.openURL("tel:" + this.state.ngoDetails.phone);
              }}
            >
              Contact No. : {this.state.ngoDetails.phone}
            </Text>
            <Hyperlink linkDefault={true}>
              <Text>Email : {this.state.ngoDetails.email}</Text>
            </Hyperlink>
            <Text>Address : {this.state.ngoDetails.address}</Text>
            <Hyperlink linkDefault={true}>
              <Text>Website : {this.state.ngoDetails.website}</Text>
            </Hyperlink>
          </Card>
          {this.state.donorName ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({ showModal: true });
                this.addDonation();
                this.createNotification();
              }}
            >
              <Text>Donate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
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
              text: "Existing Request Details",
              style: { fontSize: 20, color: "#cecdc5" },
            }}
            backgroundColor="#539D8B"
          />
        </View>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getRequestDetails();
                this.getDonorName();
                this.getMyDonations();
              }}
            />
          }
        >
          {this.showLottie()}
          {this.showModal()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    width: "40%",
    height: RFValue(40),
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
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    height: RFValue(40),
    alignItems: "flex-end",
    justifyContent: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: RFValue(10),
    borderRadius: RFValue(20),
    elevation: 20,
  },
});
