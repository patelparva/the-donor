import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from "react-native";
import { ListItem } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DrawerActions } from "react-navigation-drawer";
import SearchNotFoundLottie from "../LottieComponents/SearchNotFoundLottie";

const Item = ({ item, i, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem
        key={item.key}
        title={"Item Requested : " + item.itemName + " (" + item.quantity + ")"}
        subtitle={"Requested By : " + item.ngoName}
        titleStyle={{ fontWeight: "bold" }}
        bottomDivider
        style={{ marginTop: "3%", marginHorizontal: "2%" }}
      />
    </TouchableOpacity>
  );
};

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notFound: false,
      searchResults: [],
    };
  }

  componentDidMount() {
    console.log(this.state.searchResults);

    this.checkSearchResults();
  }

  checkSearchResults() {
    for (const item in this.props.data) {
      if (!this.props.searchPhrase == "") {
        if (
          !item.itemName
            .toLowerCase()
            .includes(
              this.props.searchPhrase.toLowerCase().trim().replace(/\s/g, "")
            )
        ) {
          Alert.alert("Hi");
        }
      }
    }
  }

  render() {
    return (
      <SafeAreaProvider style={styles.list__container}>
        <View
          onStartShouldSetResponder={() => {
            this.props.setClicked(false);
          }}
        >
          <FlatList
            data={this.props.data}
            renderItem={({ item, i }) => {
              if (!this.props.searchPhrase === "") {
                return (
                  <Item
                    i={i}
                    item={item}
                    onPress={() => {
                      this.props.navigation.navigate("ExistingRequestDetails", {
                        details: item,
                      });
                    }}
                    key={item.key}
                  />
                );
              }

              if (
                item.itemName
                  .toLowerCase()
                  .includes(
                    this.props.searchPhrase
                      .toLowerCase()
                      .trim()
                      .replace(/\s/g, "")
                  )
              ) {
                return (
                  <Item
                    item={item}
                    i={i}
                    onPress={() => {
                      this.props.navigation.navigate("ExistingRequestDetails", {
                        details: item,
                      });
                    }}
                    key={item.key}
                  />
                );
              }

              if (
                item.ngoName
                  .toLowerCase()
                  .includes(
                    this.props.searchPhrase
                      .toLowerCase()
                      .trim()
                      .replace(/\s/g, "")
                  )
              ) {
                return (
                  <Item
                    i={i}
                    item={item}
                    onPress={() => {
                      this.props.navigation.navigate("ExistingRequestDetails", {
                        details: item,
                      });
                    }}
                    key={item.key}
                  />
                );
              }
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "93%",
  },
});
