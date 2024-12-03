import React from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import Colors from "../Colors";
import { textScale, moderateScaleVertical } from "../styles/responsiveSize";

const FormSelectorButton = ({ title, backgroundColor, style, onPress }) => {
   // fonts
   const [loaded] = useFonts({
    arima_bold: fontFamily.arima_Bold,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.container, style, { backgroundColor }]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};
export default FormSelectorButton;

const styles = StyleSheet.create({
  container: {
    height: moderateScaleVertical(45),
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: textScale(18),
    fontFamily: "arima_bold",
    color: Colors.white,
  },
});
