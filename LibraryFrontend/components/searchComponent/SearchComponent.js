import { StyleSheet, Text, View } from "react-native";
import React, { Fragment, useRef } from "react";
import Icon from "../Icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../formElements/FormInput";

const SearchComponent = ({
    headerText="",
    searchTextHandler=()=> {}
}) => {
  const searchRef = useRef();
  return (
    <Fragment>
      {/* header */}
      <Text style={styles.headerText}>{headerText}</Text>
      {/* search box */}
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon icon={faSearch} />
        </View>
        <FormInput
          placeholder="Search"
          marginHorizontal={20}
          reference={searchRef}
          onChangeText={(text) => searchTextHandler(text)}
        />
      </View>
    </Fragment>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 20,
    letterSpacing: 1,
  },
  inputContainer: {
    marginTop: 5,
  },
  iconContainer: {
    position: "absolute",
    top: 35,
    right: 30,
    width: 30,
    height: 30,
    borderRadius: 50,
  },
});
