import React from "react";
import { StyleSheet, View, Text } from "react-native";
// import { View, Text } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import { textScale, moderateScale, moderateScaleVertical } from "../styles/responsiveSize";
import Colors from "../Colors";

const FormHeader = (props) => {
  const { leftHeading, rightHeading, subHeading, style } = props;
  // fonts
  const [loaded] = useFonts({
    arima_bold: fontFamily.arima_Bold,
    arima_medium: fontFamily.arima_Medium,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

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
    marginBottom: moderateScaleVertical(-10)
  },
  heading: {
    fontSize: textScale(30),
    color: Colors.black,
    paddingRight: moderateScale(5),
    fontFamily: "arima_bold",
  },
  subHeading: {
    fontSize: textScale(18),
    textAlign: "center",
    color: Colors.Charcoal,
    fontFamily: "arima_medium",
  },
});
