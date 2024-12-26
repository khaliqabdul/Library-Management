import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import Colors from "./Colors";

// create a component
const WrapperComponent = ({
  children,
  statusBarColor = Colors.skyBlue,
  barStyle = "dark-content",
  containerStyle = {},
}) => {
  return (
    <ScrollView style={{ ...styles.container, ...containerStyle }}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
      <SafeAreaView>{children}</SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default WrapperComponent;
