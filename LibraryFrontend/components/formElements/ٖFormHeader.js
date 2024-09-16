import React from "react";
import { StyleSheet, View, Text, } from "react-native";
// import { View, Text } from "@gluestack-ui/themed";

const FormHeader = (props) => {
  const { leftHeading, rightHeading, subHeading, style } = props
  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.heading, style]}>{leftHeading}</Text>
        <Text style={[styles.heading, style]}>{rightHeading}</Text>
      </View>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </>
  );
};
export default FormHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1b1b33",
    paddingRight: 10
  },
  subHeading: {
    fontSize: 18,
    textAlign: "center",
    color: "#1b1b33",
  },
});
