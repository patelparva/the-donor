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
  ActivityIndicator,
  Alert,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../CommonComponents/Header";
import SearchBar from "../CommonComponents/SearchBar";
import List from "../ComponentsForNGOScreens/ListForMyRequests";
import RequestLottie from "../LottieComponents/RequestLottie";
import NotFoundLottie from "../LottieComponents/NotFoundLottie";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      allMyRequests: "",
      currentUser: firebase.auth().currentUser.email,
      refreshing: false,
      searchPhrase: "",
      clicked: false,
      showLoading: true,
      showLottie: true,
    };
  }

  getAllMyRequests = async () => {
    this.setState({
      allMyRequests: [],
      refreshing: true,
      showLottie: true,
    });
    await db
      .collection("All_Requests")
      .where("ngoID", "==", this.state.currentUser)
      .onSnapshot((snapshot) => {
        this.setState({ allMyRequests: "" });
        snapshot.docs.map((i) => {
          this.setState({
            allMyRequests: [...this.state.allMyRequests, i.data()],
          });
        });
      });
    this.setState({
      refreshing: false,
      showLoading: false,
    });
    setTimeout(() => {
      this.setState({ showLottie: false });
    }, 2000);
  };

  componentDidMount = async () => {
    await this.getAllMyRequests();
  };

  showLottie() {
    console.log(this.state.allMyRequests);
    if (this.state.showLottie) {
      return <RequestLottie />;
    } else {
      if (this.state.allMyRequests !== "") {
        return (
          <List
            searchPhrase={this.state.searchPhrase}
            data={this.state.allMyRequests}
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
            <Text>
              You did not make any requests yet.{" "}
              <Text
                onPress={() => {
                  this.props.navigation.navigate("Request");
                }}
                style={{ color: "blue" }}
              >
                Make Request...
              </Text>
            </Text>
          </View>
        );
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="My Requests" navigation={this.props.navigation} />
        </View>
        <ScrollView
          style={{ flex: 1, marginTop: "7%" }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getAllMyRequests();
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
