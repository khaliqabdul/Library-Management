import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Autocomplete from "react-native-autocomplete-input";
import Colors from "../Colors";

const AutoCompleteInput = ({
  readers,
  setQuery,
  autocompleteQuery,
  filteredReader,
  setFilteredReader,
  selectedReader,
  setSelectedReader,
}) => {
  // console.log(selectedReader)
  return (
    <SafeAreaView style={styles.saveView}>
      <View style={styles.container}>
        <View style={styles.autocompleteContainer}>
          <Pressable
            onPress={() => {
              setSelectedReader(null);
              setQuery("");
            }}
          >
            <Text style={styles.clearSelection}>clear selection</Text>
          </Pressable>
          {readers ? (
            <Autocomplete
              // editable={!isLoading}
              autoCorrect={false}
              data={autocompleteQuery ? filteredReader : []}
              value={autocompleteQuery}
              onChangeText={setQuery}
              placeholder="Search reader"
              flatListProps={{
                nestedScrollEnabled: true,
                keyboardShouldPersistTaps: "always",
                // keyExtractor: () => movie.episodeId,
                renderItem: ({ item }) => (
                  <Pressable
                    onPress={() => {
                      setFilteredReader([]);
                      setQuery(item.name);
                      setSelectedReader(item);
                    }}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </Pressable>
                ),
              }}
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AutoCompleteInput;

const styles = StyleSheet.create({
  saveView: {
    flex: 1,
  },
  container: {
    position: "relative",
    backgroundColor: "#F5FCFF",
    flex: 1,

    // Android requiers padding to avoid overlapping
    // with content and autocomplete
    paddingTop: 50,

    // Make space for the default top bar
    ...Platform.select({
      android: {
        marginTop: 25,
      },
      default: {
        marginTop: 0,
      },
    }),
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: "#F5FCFF",
    marginTop: 8,
  },
  infoText: {
    textAlign: "center",
  },
  autocompleteContainer: {
    // Hack required to make the autocomplete
    // work on Andrdoid
    // flex: 1,
    left: 0,
    // position: "absolute",
    right: 0,
    top: -40,
    // zIndex: 1,
    padding: 0,
  },
  clearSelection: {
    textAlign: "right",
    color: Colors.blue,
    marginBottom: 5,
  },
});
