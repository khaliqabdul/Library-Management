import { Animated, StyleSheet, Text } from "react-native";
import React, { useEffect, useRef } from "react";

const AppNotification = ({ type, text }) => {
  const height = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(height, {
      toValue: 60,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);
  const backgroundColor =
    type === "error" ? "rgba(255, 0, 0, 0.7)" : "rgba(0, 255, 0, 0.7)";
  return (
    <Animated.View style={[styles.container, { height, backgroundColor }]}>
      <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
        {text}
      </Text>
    </Animated.View>
  );
};

export default AppNotification;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});
