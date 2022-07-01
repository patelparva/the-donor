import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { DrawerActions } from 'react-navigation-drawer';

const Item = ({ item, i, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem
        key={i}
        title={item.itemName}
        subtitle={item.requestState}
        titleStyle={{ fontWeight: 'bold' }}
        bottomDivider
        style={{ marginTop: '3%', marginHorizontal: '2%' }}
      />
    </TouchableOpacity>
  );
};

export default class List extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={styles.list__container}>
        <View
          onStartShouldSetResponder={() => {
            this.props.setClicked(false);
          }}>
          <FlatList
            data={this.props.data}
            renderItem={({ item, i }) => {
              if (this.props.searchPhrase === '') {
                return (
                  <Item
                    i={i}
                    item={item}
                    onPress={() => {
                      this.props.navigation.navigate('VoluntaryItemDetails', {
                        details:item
                      });
                    }}
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
                      .replace(/\s/g, '')
                  )
              ) {
                return (
                  <Item
                    item={item}
                    i={i}
                    onPress={() => {
                      this.props.navigation.navigate('VoluntaryItemDetails', {
                        details:item
                      });
                    }}
                  />
                );
              }

              if (
                item.requestState
                  .toLowerCase()
                  .includes(
                    this.props.searchPhrase
                      .toLowerCase()
                      .trim()
                      .replace(/\s/g, '')
                  )
              ) {
                return (
                  <Item
                    i={i}
                    item={item}
                    onPress={() => {
                      this.props.navigation.navigate('VoluntaryItemDetails', {
                        details:item
                      });
                    }}
                  />
                );
              }
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: '85%',
    width: '93%',
  },
});
