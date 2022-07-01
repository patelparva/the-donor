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
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { ListItem } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import MyHeader from "../CommonComponents/Header";
import SearchBar from "../CommonComponents/SearchBar";
import List from "../ComponentsForDonorScreens/ListForVoluntaryDonations";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ListLottie from "../LottieComponents/ListLottie";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allNGOs: [],
      refreshing: false,
      clicked: false,
      searchPhrase: "",
      showLottie: true,
    };
  }

  getAllNGOs = async () => {
    this.setState({
      allNGOs: [],
      refreshing: true,
      showLottie:true
    });
    db.collection("NGO_Details")
      .get()
      .then((i) => {
        i.docs.map((data) => {
          this.setState({
            allNGOs: [...this.state.allNGOs, data.data()],
          });

          console.log(this.state.allNGOs);
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
    this.getAllNGOs();
  }

  showLottie() {
    if (this.state.showLottie) {
      return <ListLottie />;
    } else {
      return (
        <List
          searchPhrase={this.state.searchPhrase}
          data={this.state.allNGOs}
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
          title="Voluntary Donation"
          navigation={this.props.navigation}
        />
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getAllNGOs();
              }}
            />
          }
        >
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
