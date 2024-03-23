import React from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
// import { View, Text } from "@gluestack-ui/themed";

const FormSelectorButton = ({title, backgroundColor, style, onPress}) => {
  return (
    <>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.container, style, {backgroundColor}]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};
export default FormSelectorButton;

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: "50%",
    backgroundColor: "#1b1b33",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  }
});
