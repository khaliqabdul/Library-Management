import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import Colors from "./Colors";
import { textScale } from "./styles/responsiveSize";
import { useFonts } from "expo-font";
import fontFamily from "./styles/fontFamily";
// create a component
const HeaderComponent = ({
  centerText = "",
  rightText = "",
  leftCustomView = () => {},
  isLeftView = false,
  containerStyle = {},
  rightTextStyle = {},
}) => {
  // fonts
  const [loaded] = useFonts({
    raleway_medium: fontFamily.raleway_medium,
    raleway_regular: fontFamily.raleway_regular,
    raleway_bold: fontFamily.raleway_Bold,
    arima_bold: fontFamily.arima_Bold,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <Pressable>{isLeftView ? leftCustomView() : <View />}</Pressable>
      <Text style={styles.centerTextStyle}>{centerText}</Text>
      <Pressable>
        <Text style={{ ...styles.rightTextStyle, ...rightTextStyle }}>
          {rightText}
        </Text>
      </Pressable>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.gray,
    paddingVertical: 8,
  },
  centerTextStyle: {
    color: Colors.black,
    fontSize: textScale(20),
    fontFamily: "arima_bold",
  },
  rightTextStyle: {
    color: Colors.black,
    fontSize: textScale(18),
    fontFamily: "raleway_regular",
  },
});
