import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Button,
  Text,
  ScrollView,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const SearchBar = (props) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View
          style={
            !props.clicked
              ? styles.searchBar__unclicked
              : styles.searchBar__clicked
          }
        >
          <Feather
            name="search"
            size={20}
            color="black"
            style={{ marginLeft: 1 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={props.searchPhrase}
            onChangeText={props.setSearchPhrase}
            onFocus={() => {
              props.setClicked(true);
            }}
            onBlur={() => {
              props.setClicked(false);
              Keyboard.dismiss();
            }}
          />
          {props.clicked !== false && (
            <TouchableOpacity
              onPress={() => {
                props.setSearchPhrase("");
              }}
            >
              <Entypo
                name="cross"
                size={20}
                color="black"
                style={{ padding: 1, marginRight: RFValue(5) }}
              />
            </TouchableOpacity>
          )}
        </View>
        {props.clicked !== false && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                props.setClicked(false);
              }}
            >
              <Text
                style={{
                  color: "#007AFF",
                  paddingLeft: "2%",
                  paddingTop: "23%",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBar__unclicked: {
    padding: 5,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: "-5%",
  },
  searchBar__clicked: {
    padding: 5,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: "-5%",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});
