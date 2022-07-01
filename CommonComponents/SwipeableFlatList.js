import * as React from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { ListItem, Icon } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";

export default class SwipeableFlatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotification,
    };
  }

  markAsRead = async (rowMap, rowKey, notification) => {
    rowMap[rowKey].closeRow();

    const newData = [...this.state.allNotifications];
    const prevIndex = this.state.allNotifications.findIndex(
      (item) => item.docID === notification.item.docID
    );
    console.log(prevIndex);
    newData.splice(prevIndex, 1);
    this.setState({ allNotifications: newData });

    await db
      .collection("Notifications")
      .doc(notification.item.docID)
      .update({ notificationStatus: "read" });
  };

  renderItem = (data) => (
    <Animated.View>
      <ListItem
        key={data.i}
        title={data.item.itemName}
        subtitle={data.item.message}
        titleStyle={{ fontWeight: "bold" }}
        leftElement={<Icon type="font-awesome-5" name="box" />}
        bottomDivider
      />
    </Animated.View>
  );

  renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          this.markAsRead(rowMap, data.index, data);
        }}
      >
        <Text style={styles.backTextWhite}>Mark As Read</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <SafeAreaProvider style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          previewRowKey={"0"}
          previewOpenValue={RFValue(-90)}
          rightOpenValue={RFValue(-90)}
          previewOpenDelay={700}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1 },
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: RFValue(15),
    textAlign: "center",
    alignSelf: "flex-start",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#006DB0",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backRightBtn: {
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: "25%",
    backgroundColor: "#006DB0",
    right: 0,
    paddingHorizontal: RFValue(10),
  },
  backRightBtnRight: {
    backgroundColor: "#006DB0",
    right: 0,
  },
});
