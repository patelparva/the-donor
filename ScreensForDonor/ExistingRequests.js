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
  SafeAreaView,
  StatusBar,
  ListView,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { ListItem } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import MyHeader from "../CommonComponents/Header";
import SearchBar from "../CommonComponents/SearchBar";
import List from "../ComponentsForDonorScreens/ListForExistingRequests";
import ListLottie from "../LottieComponents/ListLottie";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allRequests: [],
      showLoading: true,
      refreshing: false,
      searchPhrase: "",
      clicked: false,
      showLottie: true,
    };
  }

  getAllRequests = async () => {
    this.setState({
      allRequests: [],
      refreshing: true,
      showLottie: true,
    });
    await db
      .collection("All_Requests")
      .where("requestStatus", "==", "Item(s) Requested")
      .onSnapshot((snapshot) => {
        snapshot.forEach((data) => {
          this.setState({
            allRequests: [...this.state.allRequests, data.data()],
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

  componentDidMount() {
    this.getAllRequests();
  }

  showLottie() {
    if (this.state.showLottie) {
      return <ListLottie />;
    } else {
      return (
        <List
          searchPhrase={this.state.searchPhrase}
          data={this.state.allRequests}
          // onRefresh={() => {
          //   this.getAllRequests();
          // }}
          // isRefreshing={this.state.refreshing}
          setClicked={(boolean) => this.setState({ clicked: boolean })}
          {...this.props}
        />
      );
    }
  }

  render() {
    return (
      <SafeAreaProvider style={styles.container}>
        <MyHeader
          title="Existing Requests"
          navigation={this.props.navigation}
        />
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getAllRequests();
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
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
