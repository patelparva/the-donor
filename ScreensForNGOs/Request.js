import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Animated,
  Modal,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../CommonComponents/Header";
import { Input } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import AnimatedLottieView from "lottie-react-native";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      itemName: "",
      reason: "",
      quantity: "",
      currentUser: firebase.auth().currentUser.email,
      ngoName: "",
      keyboardOpen: false,
      showModal: false,
      scaleValue: new Animated.Value(0),
    };
  }

  getNGOName = async () => {
    await db
      .collection("NGO_Details")
      .where("email", "==", this.state.currentUser)
      .get()
      .then((i) => {
        i.docs.map((data) => {
          this.setState({
            ngoName: data.data().name,
          });

          console.log(this.state.ngoName);
        });
      });
  };

  componentDidMount() {
    this.getNGOName();
  }

  addRequest = async () => {
    await db.collection("All_Requests").add({
      itemName: this.state.itemName,
      reason: this.state.reason,
      quantity: this.state.quantity,
      ngoID: this.state.currentUser,
      requestID: Math.random().toString(32).substring(2),
      requestStatus: "Item(s) Requested",
      date: firebase.firestore.Timestamp.now().toDate().toString(),
      ngoName: this.state.ngoName,
    });
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
                    this.props.navigation.navigate("MyRequests");
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

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request" navigation={this.props.navigation} />
        </View>
        <KeyboardAvoidingView
          style={
            !this.state.keyboardOpen
              ? { marginTop: "12%" }
              : { marginTop: "20%" }
          }
        >
          <Input
            placeholder="Item Name"
            onChangeText={(txt) => {
              this.setState({
                itemName: txt,
              });
            }}
            style={styles.textInput}
            onFocus={() => {
              this.setState({ keyboardOpen: true });
            }}
            onBlur={() => {
              this.setState({ keyboardOpen: false });
            }}
            value={this.state.itemName}
          />
          <Input
            placeholder="Why do you want this item?"
            onChangeText={(txt) => {
              this.setState({
                reason: txt,
              });
            }}
            style={styles.textInput}
            onFocus={() => {
              this.setState({ keyboardOpen: true });
            }}
            onBlur={() => {
              this.setState({ keyboardOpen: false });
            }}
            value={this.state.reason}
          />
          <Input
            placeholder="Item Quantity"
            onChangeText={(txt) => {
              this.setState({
                quantity: txt,
              });
            }}
            style={styles.textInput}
            keyboardType="number-pad"
            onFocus={() => {
              this.setState({ keyboardOpen: true });
            }}
            onBlur={() => {
              this.setState({ keyboardOpen: false });
            }}
            value={this.state.quantity}
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (
              this.state.itemName &&
              this.state.reason &&
              this.state.quantity
            ) {
              this.addRequest();
              this.setState({
                showModal: true,
                itemName: "",
                reason: "",
                quantity: "",
              });
            } else {
              Alert.alert("Please fill all the required fields.");
            }
          }}
        >
          <Text style={{ fontWeight: "600" }}>Upload a Request</Text>
        </TouchableOpacity>
        {this.showModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    // backgroundColor:'#E8D9D9'
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
