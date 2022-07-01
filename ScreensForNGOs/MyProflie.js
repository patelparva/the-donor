import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import MyHeader from "../CommonComponents/Header";
import db from "../config";
import firebase from "firebase";
import { Input, Avatar } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import LoadingLottie from "../LottieComponents/LoadingLottie";

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      phone: "",
      address: "",
      type: "",
      website: "",
      docID: "",
      currentUser: firebase.auth().currentUser.email,
      image: "#",
      showLoading: true,
    };
  }

  getDetails = async () => {
    this.setState({
      refreshing: true,
      name: "",
      phone: "",
      address: "",
      type: "",
      website: "",
      docID: "",
      showLoading: true,
    });
    var currentUser = await firebase.auth().currentUser.email;

    await db
      .collection("NGO_Details")
      .where("email", "==", currentUser)
      .get()
      .then((snapShot) => {
        snapShot.forEach((i) => {
          var data = i.data();
          this.setState({
            name: data.name,
            phone: data.phone,
            address: data.address,
            type: data.type,
            website: data.website,
            docID: i.id,
          });
        });
      });
    this.setState({
      refreshing: false,
    });
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
    setTimeout(() => {
      this.setState({ showLoading: false });
    }, 2000);
  };

  loadImage = async (uri, email) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var imageRef = await firebase
      .storage()
      .ref()
      .child("ngo_profile/" + email);
    return imageRef.put(blob).then(() => {
      this.fetchUrl(email);
    });
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.loadImage(uri, this.state.currentUser);
    }
  };

  componentDidMount = async () => {
    await this.getDetails();

    await this.fetchUrl(this.state.currentUser);
  };

  updateUserDetails = async () => {
    var currentUser = await firebase.auth().currentUser.email;

    await db.collection("NGO_Details").doc(this.state.docID).update({
      name: this.state.name,
      phone: this.state.phone,
      address: this.state.address,
      type: this.state.type,
      website: this.state.website,
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
          onPress={() => {
            this.selectPicture();
          }}
          showAccessory={true}
        />
      );
    } else {
      return (
        <Avatar
          rounded
          source={{ uri: this.state.image }}
          size="large"
          onPress={() => {
            this.selectPicture();
          }}
          showAccessory={true}
          containerStyle={{ backgroundColor: "" }}
        />
      );
    }
  };

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
        <View>
          <View
            style={{
              alignSelf: "center",
              marginVertical: "5%",
              marginTop: "15%",
            }}
          >
            <this.ProfilePicture {...this.props} />
          </View>
          <KeyboardAvoidingView style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Name"
              onChangeText={(txt) => {
                this.setState({
                  name: txt,
                });
              }}
              maxLength={30}
              value={this.state.name}
              style={styles.formTextInput}
              autoComplete="name"
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
              placeholder="Phone"
              onChangeText={(txt) => {
                this.setState({
                  phone: txt,
                });
              }}
              maxLength={10}
              value={this.state.phone}
              keyboardType="numeric"
              style={styles.formTextInput}
              autoComplete="tel"
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder="Address"
              onChangeText={(txt) => {
                this.setState({
                  address: txt,
                });
              }}
              value={this.state.address}
              multiline={true}
              style={[styles.formTextInput, { textAlignVertical: "top" }]}
              numberOfLines={5}
              textAlign="left"
              autoComplete="street-address"
            />
            <Text style={styles.label}>NGO Type</Text>
            <TextInput
              placeholder="NGO Type"
              onChangeText={(txt) => {
                this.setState({
                  type: txt,
                });
              }}
              value={this.state.type}
              style={styles.formTextInput}
              textAlign="left"
            />
            <Text style={styles.label}>Website</Text>
            <TextInput
              placeholder="Website"
              onChangeText={(txt) => {
                this.setState({
                  website: txt,
                });
              }}
              value={this.state.website}
              style={styles.formTextInput}
              textAlign="left"
              autoComplete="website"
            />
            <TouchableOpacity
              onPress={() => {
                this.updateUserDetails();
                Alert.alert("NGO Profile Updated Successfully");
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="My Profile" navigation={this.props.navigation} />
        <ScrollView
          // style={{ flex: 0.9 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getDetails();
                this.fetchUrl(this.state.currentUser);
              }}
            />
          }
        >
          {this.showLottie()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 2 },
  formContainer: {
    flex: 1,
    width: "100%",
    marginTop: "3%",
  },
  formTextInput: {
    width: "94%",
    alignSelf: "center",
    borderColor: "#A3ADB5",
    borderBottomWidth: RFValue(1),
    fontSize: RFValue(17),
    marginBottom: "3%",
    paddingVertical: "3%",
    left: 0,
    textAlign: "left",
  },
  button: {
    width: "35%",
    height: RFValue(35),
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: RFValue(10),
    backgroundColor: "#539D8B",
    shadowColor: "black",
    shadowOffset: { width: RFValue(8), height: RFValue(8) },
    shadowOpacity: RFValue(0.44),
    shadowRadius: RFValue(10.32),
    marginTop: "5%",
    marginBottom: RFValue(30),
  },
  buttonText: { fontSize: 25, fontWeight: "bold", color: "#fff" },
  label: {
    flex: 1,
    marginLeft: "3%",
    textDecorationColor: "#A3ADB5",
    fontWeight: "bold",
    color: "#86939E",
    fontSize: 16,
  },
});
