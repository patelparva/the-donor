import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Linking,
  RefreshControl,
  Animated,
  Alert,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { ListItem, Card, Input, Icon, Header } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import Hyperlink from "react-native-hyperlink";
import MyHeader from "../CommonComponents/Header";
import AnimatedLottieView from "lottie-react-native";
import LoadingLottie from "../LottieComponents/LoadingLottie";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser.email,
      ngoID: this.props.navigation.getParam("details")["email"],
      ngoDetails: [],
      showLoading: true,
      showModal: false,
      itemName: "",
      itemQuantity: "",
      itemDescription: "",
      name: "",
      refreshing: false,
      showSuccessModal: false,
      scaleValue: new Animated.Value(0),
    };
  }

  showModal = () => {
    return (
      <Modal
        visible={this.state.showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackGround}>
          <View style={styles.modal}>
            {/* <KeyboardAvoidingView> */}
            <Input
              style={{ marginTop: "10%" }}
              label="What are you donating?"
              labelStyle={{
                alignSelf: "center",
                color: "#28231D",
                marginBottom: RFValue(15),
                fontSize: 18,
              }}
              placeholder="Item Name"
              maxLength={15}
              inputStyle={{
                borderWidth: 0.8,
                // borderBottomWidth: 0,
                paddingHorizontal: RFValue(5),
                borderRadius: RFValue(5),
              }}
              inputContainerStyle={{
                marginBottom: RFValue(-15),
                borderBottomWidth: 0,
              }}
              onChangeText={(txt) => {
                this.setState({
                  itemName: txt,
                });
              }}
            />
            <Input
              style={{ marginTop: "10%" }}
              placeholder="Quantity"
              maxLength={4}
              inputStyle={{
                borderWidth: 0.8,
                // borderBottomWidth: 0,
                paddingHorizontal: RFValue(5),
                borderRadius: RFValue(5),
              }}
              inputContainerStyle={{
                marginBottom: RFValue(-15),
                borderBottomWidth: 0,
              }}
              onChangeText={(txt) => {
                this.setState({
                  itemQuantity: txt,
                });
              }}
              keyboardType="numeric"
            />
            <Input
              style={{ marginTop: "10%" }}
              placeholder="Description"
              // maxLength={4}
              inputStyle={{
                borderWidth: 0.8,
                // borderBottomWidth: 0,
                paddingHorizontal: RFValue(5),
                borderRadius: RFValue(5),
                textAlignVertical : "top",
              }}
              inputContainerStyle={{
                marginBottom: RFValue(-15),
                borderBottomWidth: 0,
              }}
              onChangeText={(txt) => {
                this.setState({
                  itemDescription: txt,
                });
              }}
              
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.itemName && this.state.itemQuantity && this.state.itemDescription) {
                    this.addDonation();
                    this.setState({
                      showSuccessModal: true,
                      showModal: false,
                    });
                    this.createNotification();
                  } else {
                    Alert.alert("Kindly Enter all the Details on top.");
                  }
                }}
                style={{ marginHorizontal: 7.5, padding: 15 }}
              >
                <Icon type="font-awesome" name="check" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 7.5, padding: 15 }}
                onPress={() => {
                  this.setState({
                    showModal: false,
                  });
                }}
              >
                <Icon type="font-awesome" name="times" />
              </TouchableOpacity>
            </View>
            {/* </KeyboardAvoidingView> */}
          </View>
        </View>
      </Modal>
    );
  };

  getNGODetails = async () => {
    this.setState({
      refreshing: true,
      ngoDetails: [],
      showLoading: true,
    });
    await db
      .collection("NGO_Details")
      .where("email", "==", this.state.ngoID)
      .get()
      .then((i) => {
        i.docs.map((data) => {
          this.setState({
            ngoDetails: data.data(),
          });
        });
      });
    this.setState({
      refreshing: false,
    });
  };

  addDonation = async () => {
    await db.collection("All_Donations").add({
      ngoID: this.state.ngoID,
      donorID: this.state.currentUser,
      itemName: this.state.itemName,
      itemQuantity: this.state.itemQuantity,
      itemDescription: this.state.itemDescription,
      ngoName: this.state.ngoDetails.name,
      requestState: "Donor Interested",
      donationType: "Voluntary Donation",
    });
  };

  getUserName = async () => {
    this.setState({ name: "" });
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

    setTimeout(() => {
      this.setState({ showLoading: false });
    }, 2000);
  };

  createNotification = async () => {
    var message =
      this.state.name +
      " has shown interest in donating the " +
      this.state.itemName +
      ".";

    await db.collection("Notifications").add({
      donorID: this.state.currentUser,
      itemName: this.state.itemName,
      targetID: this.state.ngoID,
      message: message,
      notificationStatus: "unread",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  componentDidMount = async () => {
    await this.getNGODetails();
    await this.getUserName();
  };

  showSuccessModal() {
    if (this.state.showSuccessModal) {
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
      <Modal transparent={true} visible={this.state.showSuccessModal}>
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
                    this.setState({ showSuccessModal: false });
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
        <View style={styles.container}>
          {<View>{this.showModal()}</View>}
          {<View>{this.showSuccessModal()}</View>}
          <View style={{ marginTop: "30%" }}>
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
            {this.state.name !== "" ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.setState({
                    showModal: true,
                  });
                }}
              >
                <Text>Donate</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView
        style={{ flex: 0.9 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.getNGODetails();
              this.getUserName();
            }}
          />
        }
      >
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
              text: "NGO Details",
              style: { fontSize: 20, color: "#cecdc5" },
            }}
            backgroundColor="#539D8B"
          />
        </View>
        {this.showLottie()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  modal: {
    backgroundColor: "#d8f3dc",
    borderRadius: 5,
    justifyContent: "center",
    height: RFValue(310),
    // marginTop: "40%",
    width: "90%",
    alignSelf: "center",
  },
  modalButtons: {
    display: "flex",
    flexDirection: "row-reverse",
    alignSelf: "center",
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
    // paddingVertical: RFValue(20),
    borderRadius: RFValue(20),
    elevation: 20,
  },
});
