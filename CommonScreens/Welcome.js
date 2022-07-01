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
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  ToastAndroid,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { Input, Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

export default class Welcome extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      pwd: "",
      ngoSignUpModalShow: false,
      donorSignUpModalShow: false,
      ngoName: "",
      ngoEmail: "",
      ngoPhone: "",
      ngoAddress: "",
      ngoType: "",
      ngoPassword: "",
      ngoConfirmpwd: "",
      ngoWebsite: "",
      donorName: "",
      donorEmail: "",
      donorPhone: "",
      donorCity: "",
      donorPassword: "",
      donorConfirmpwd: "",
      hidden: true,
      showLoading: true,
      animationValue1: new Animated.Value(175),
      animationValue2: new Animated.Value(400),
    };
  }

  componentDidMount = async () => {
    await firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        var isDonor = "";
        var dbref = await db
          .collection("Donor_Details")
          .where("email", "==", user.email)
          .get();

        this.setState({ showLoading: false });
        console.log("lenght", dbref.docs.length);
        if (dbref.docs.length === 0) {
          isDonor = 0;
          console.log("I'm again in if");
        } else {
          isDonor = 1;
          console.log("I'm in else");
        }
        console.log("in Auth value of isDonor after query execution", isDonor);
        if (isDonor === "") {
          this.props.navigation.navigate("screen1");
        }
        if (isDonor === 1) {
          this.props.navigation.navigate("screen2");
        }
        if (isDonor === 0) {
          this.props.navigation.navigate("screen3");
        }
      } else {
        this.props.navigation.navigate("screen1");
        this.setState({ showLoading: false });
      }
    });

    this.handleAnimation();
  };

  toggle = () => {
    this.setState({
      hidden: !this.state.hidden,
    });
  };

  login = async (email, pwd) => {
    var edittedEmail = email.trim().toLowerCase();
    var isDonor = 0;

    await firebase
      .auth()
      .signInWithEmailAndPassword(edittedEmail, pwd)
      .then(() => {
        Alert.alert("Login Successful");
        db.collection("Donor_Details")
          .where("email", "==", edittedEmail)
          .get()
          .then(async (snapShot) => {
            await snapShot.docs.map((doc) => {
              console.log("I'm here");
              isDonor = 1;
              console.log(
                "in login value of isDonor after query execution",
                isDonor
              );
              if (isDonor !== 0) {
                this.props.navigation.navigate("screen3");
              } else {
                this.props.navigation.navigate("screen2");
              }
            });
          });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  showNGOSignUpModal = () => {
    return (
      <Modal
        visible={this.state.ngoSignUpModalShow}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalConatiner}>
          <ScrollView style={styles.modal}>
            <KeyboardAvoidingView>
              <Text style={styles.modalHeader}>{"NGO\nRegistration"}</Text>
              <Input
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
                placeholder="NGO Name"
                label="NGO Name*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoName: txt,
                  });
                }}
                leftIcon={{ type: "font-awesome-5", name: "hands-helping" }}
              />
              <Input
                placeholder="Email"
                label="NGO Email*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoEmail: txt,
                  });
                }}
                keyboardType="email-address"
                leftIcon={{ type: "font-awesome", name: "envelope" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Phone no."
                label="Phone No.*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoPhone: txt,
                  });
                }}
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon={{ type: "font-awesome-5", name: "phone" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Where is NGO located"
                label="Address*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoAddress: txt,
                  });
                }}
                leftIcon={{ type: "font-awesome-5", name: "map-marker-alt" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Who do you support"
                label="NGO Type*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoType: txt,
                  });
                }}
                leftIcon={{ type: "font-awesome-5", name: "users" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Website"
                label="Website*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoWebsite: txt,
                  });
                }}
                leftIcon={{ type: "font-awesome-5", name: "external-link-alt" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Create a Password"
                label="Password*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoPassword: txt,
                  });
                }}
                secureTextEntry={this.state.hidden}
                leftIcon={{ type: "font-awesome-5", name: "key" }}
                rightIcon={
                  <Icon
                    name={this.state.hidden ? "eye-slash" : "eye"}
                    type="font-awesome-5"
                    onPress={() => {
                      this.toggle();
                    }}
                    size={20}
                    color="grey"
                  />
                }
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Retype Password"
                label="Confirm Password*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    ngoConfirmpwd: txt,
                  });
                }}
                secureTextEntry={this.state.hidden}
                leftIcon={{ type: "font-awesome-5", name: "check" }}
                rightIcon={
                  <Icon
                    name={this.state.hidden ? "eye-slash" : "eye"}
                    type="font-awesome-5"
                    onPress={() => {
                      this.toggle();
                    }}
                    size={20}
                    color="grey"
                  />
                }
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.ngoSignUp();
                }}
              >
                <Text style={styles.buttonTxt}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { marginBottom: RFValue(20), flexDirection: "row-reverse" },
                ]}
                onPress={() => {
                  this.setState({ ngoSignUpModalShow: false });
                }}
              >
                <Icon
                  style={{ marginTop: RFValue(1) }}
                  type="font-awesome-5"
                  name="times"
                  color="#539D8B"
                />
                <Text style={[styles.buttonTxt, { marginRight: RFValue(10) }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  showDonorSignUpModal = () => {
    return (
      <Modal
        visible={this.state.donorSignUpModalShow}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalConatiner}>
          <ScrollView>
            <KeyboardAvoidingView>
              <Text style={styles.modalHeader}>{"Donor\nRegistration"}</Text>
              <Input
                placeholder="Your Name"
                label="Name*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    donorName: txt,
                  });
                }}
                leftIcon={{ type: "font-awesome", name: "user" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Email"
                label="Email*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    donorEmail: txt,
                  });
                }}
                keyboardType="email-address"
                leftIcon={{ type: "font-awesome", name: "envelope" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Phone no."
                label="Phone no.*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    donorPhone: txt,
                  });
                }}
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon={{ type: "font-awesome-5", name: "phone" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="City"
                label="City*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    donorCity: txt,
                  });
                }}
                leftIcon={{ type: "font-awesome-5", name: "city" }}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Create a Password"
                label="Password*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    donorPassword: txt,
                  });
                }}
                secureTextEntry={this.state.hidden}
                leftIcon={{ type: "font-awesome-5", name: "key" }}
                rightIcon={
                  <Icon
                    name={this.state.hidden ? "eye-slash" : "eye"}
                    type="font-awesome-5"
                    onPress={() => {
                      this.toggle();
                    }}
                    size={20}
                    color="grey"
                  />
                }
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <Input
                placeholder="Retype Password"
                label="Confirm Password*"
                labelStyle={styles.labelStyle}
                onChangeText={(txt) => {
                  this.setState({
                    donorConfirmpwd: txt,
                  });
                }}
                secureTextEntry={this.state.hidden}
                leftIcon={{ type: "font-awesome-5", name: "check" }}
                rightIcon={
                  <Icon
                    name={this.state.hidden ? "eye-slash" : "eye"}
                    type="font-awesome-5"
                    onPress={() => {
                      this.toggle();
                    }}
                    size={20}
                    color="grey"
                  />
                }
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ padding: RFValue(5) }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.donorSignUp();
                }}
              >
                <Text style={styles.buttonTxt}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { marginBottom: RFValue(20), flexDirection: "row-reverse" },
                ]}
                onPress={() => {
                  this.setState({ donorSignUpModalShow: false });
                }}
              >
                <Icon
                  style={{ marginTop: RFValue(1) }}
                  type="font-awesome-5"
                  name="times"
                  color="#539D8B"
                />
                <Text style={[styles.buttonTxt, { marginRight: RFValue(10) }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  ngoSignUp = () => {
    this.state.ngoEmail.trim();

    if (
      (this.state.ngoPassword === this.state.ngoConfirmpwd &&
        this.state.ngoPassword != "") ||
      this.state.ngoConfirmpwd != ""
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.ngoEmail.toLowerCase(),
          this.state.ngoPassword
        )
        .then(() => {
          db.collection("NGO_Details").add({
            name: this.state.ngoName,
            email: this.state.ngoEmail.trim().toLowerCase(),
            phone: this.state.ngoPhone,
            address: this.state.ngoAddress,
            type: this.state.ngoType,
            website: this.state.ngoWebsite,
          });
          Alert.alert("Registration Successful", "", [
            {
              text: "Ok",
              onPress: () => {
                this.setState({
                  ngoSignUpModalShow: false,
                });
                ToastAndroid.show(
                  "Login with the informations you provided.",
                  ToastAndroid.SHORT
                );
              },
            },
          ]);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    } else if (
      this.state.ngoName === "" ||
      this.state.ngoEmail === "" ||
      this.state.ngoPhone === "" ||
      this.state.ngoAddress === "" ||
      this.state.ngoType === "" ||
      this.state.ngoWebsite === "" ||
      this.state.ngoPassword === "" ||
      this.state.ngoConfirmpwd === ""
    ) {
      Alert.alert("Please enter all the required details.");
    } else {
      Alert.alert("Password and Confirm Password do not match");
    }
  };

  donorSignUp = () => {
    this.state.donorEmail.trim();

    if (
      (this.state.donorPassword === this.state.donorConfirmpwd &&
        this.state.donorPassword != "") ||
      this.state.donorConfirmpwd != ""
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.donorEmail.trim().toLowerCase(),
          this.state.donorPassword
        )
        .then(() => {
          db.collection("Donor_Details").add({
            name: this.state.donorName,
            email: this.state.donorEmail.trim().toLowerCase(),
            phone: this.state.donorPhone,
            address: this.state.donorCity,
          });
          Alert.alert("Registration Successful", "", [
            {
              text: "Ok",
              onPress: () => {
                this.setState({
                  donorSignUpModalShow: false,
                });
              },
            },
          ]);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    } else if (
      this.state.donorName === "" ||
      this.state.donorEmail === "" ||
      this.state.donorPhone === "" ||
      this.state.donorCity === "" ||
      this.state.donorPassword === "" ||
      this.state.donorConfirmpwd === ""
    ) {
      Alert.alert("Please enter all the required details.");
    } else {
      Alert.alert("Password and Confirm Password do not match");
    }
  };

  handleAnimation = () => {
    Animated.timing(this.state.animationValue1, {
      toValue: 0,
      duration: 1200,
    }).start();
    Animated.timing(this.state.animationValue2, {
      toValue: 0,
      duration: 1500,
    }).start();
  };

  render() {
    if (this.state.showLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#539D8B",
          }}
        >
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 450, height: 450, alignSelf: "center" }}
          />
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <View>{this.showNGOSignUpModal()}</View>
          <View>{this.showDonorSignUpModal()}</View>
          <Animated.View
            style={[
              styles.logoConatiner,
              { marginTop: this.state.animationValue1 },
            ]}
          >
            <Image source={require("../assets/logo.png")} style={styles.logo} />
          </Animated.View>
          <Animated.View style={{ marginTop: this.state.animationValue2 }}>
            <Input
              onChangeText={(txt) => {
                this.setState({
                  email: txt,
                });
              }}
              placeholder="yourname@example.com"
              value={this.state.email}
              leftIcon={{ name: "envelope", type: "font-awesome" }}
              keyboardAppearance={"default"}
              keyboardType="email-address"
              inputContainerStyle={styles.inputContainer}
              inputStyle={{ padding: RFValue(5) }}
            />
            <Input
              onChangeText={(txt) => {
                this.setState({
                  pwd: txt,
                });
              }}
              placeholder="Password"
              value={this.state.pwd}
              secureTextEntry={this.state.hidden}
              leftIcon={{ type: "font-awesome-5", name: "lock" }}
              rightIcon={
                <Icon
                  name={this.state.hidden ? "eye-slash" : "eye"}
                  type="font-awesome"
                  onPress={() => {
                    this.toggle();
                  }}
                  size={25}
                  color="black"
                />
              }
              inputContainerStyle={styles.inputContainer}
              inputStyle={{ padding: RFValue(5) }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.login(this.state.email.toLowerCase(), this.state.pwd);
              }}
            >
              <Text style={styles.buttonTxt}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({
                  donorSignUpModalShow: true,
                });
              }}
            >
              <Text style={styles.buttonTxt}>Donor Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { marginBottom: RFValue(20) }]}
              onPress={() => {
                this.setState({
                  ngoSignUpModalShow: true,
                });
              }}
            >
              <Text style={styles.buttonTxt}>NGO Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#539D8B",
  },
  modalHeader: {
    textAlign: "center",
    color: "#F5C5BE",
    fontSize: RFValue(35),
    fontWeight: "bold",
    marginBottom: RFValue(30),
    marginTop: RFValue(15),
  },
  inputContainer: {
    borderWidth: RFValue(1),
    backgroundColor: "#F5C5BE",
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(5),
    marginHorizontal: RFValue(15),
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    borderRadius: RFValue(10),
    width: RFValue(150),
    height: RFValue(40),
    marginTop: RFValue(15),
    backgroundColor: "#d2d4c8",
    justifyContent: "center",
  },
  buttonTxt: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    color: "#539D8B",
  },
  logo: { width: 450, height: 450, alignSelf: "center" },
  logoConatiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalConatiner: {
    width: "100%",
    height: "100%",
    backgroundColor: "#539D8B",
  },
  labelStyle: {
    color: "#F5C5BE",
    marginLeft: RFValue(20),
    fontSize: RFValue(16),
    marginBottom: RFValue(3),
    marginTop: RFValue(-15),
  },
});
