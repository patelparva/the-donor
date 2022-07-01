import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../CommonComponents/Header";
import SearchBar from "../CommonComponents/SearchBar";
import List from "../ComponentsForNGOScreens/ListForVoluntaryDonations";
import RequestLottie from "../LottieComponents/RequestLottie";
import NotFoundLottie from "../LottieComponents/NotFoundLottie";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      allVoluntaryDonations: "",
      currentUser: firebase.auth().currentUser.email,
      refreshing: false,
      searchPhrase: "",
      clicked: false,
      showLottie: true,
    };
  }

  getAllVoluntaryDonations = async () => {
    this.setState({
      allVoluntaryDonations: "",
      refreshing: true,
      showLottie: true,
    });
    await db
      .collection("All_Donations")
      .where("ngoID", "==", this.state.currentUser)
      .where("donationType", "==", "Voluntary Donation")
      .onSnapshot((snapshot) => {
        this.setState({ allVoluntaryDonations: "" });
        snapshot.docs.map((i) => {
          var donation = i.data();
          donation["docId"] = i.id;
          this.setState({
            allVoluntaryDonations: [
              ...this.state.allVoluntaryDonations,
              donation,
            ],
          });
        });
      });
    this.setState({
      refreshing: false,
    });
    setTimeout(() => {
      this.setState({ showLottie: false });
    }, 2000);
  };

  componentDidMount = async () => {
    this.getAllVoluntaryDonations();
  };

  showLottie() {
    if (this.state.showLottie) {
      return <RequestLottie />;
    } else {
      if (this.state.allVoluntaryDonations !== "") {
        return (
          <List
            searchPhrase={this.state.searchPhrase}
            data={this.state.allVoluntaryDonations}
            setClicked={(boolean) => this.setState({ clicked: boolean })}
            {...this.props}
          />
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: "25%",
            }}
          >
            <NotFoundLottie/>
            <Text>You did not recieve any voluntary donation yet.</Text>
          </View>
        );
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader
            title="Voluntary Donations"
            navigation={this.props.navigation}
          />
        </View>
        <ScrollView
          style={{ flex: 0.9, marginTop: "7%" }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getAllVoluntaryDonations();
              }}
            />
          }
        >
          {!this.state.clicked}
          <SearchBar
            searchPhrase={this.state.searchPhrase}
            setSearchPhrase={(txt) => this.setState({ searchPhrase: txt })}
            clicked={this.state.clicked}
            setClicked={(boolean) => this.setState({ clicked: boolean })}
          />
          {this.showLottie()}
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
});
