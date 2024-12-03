import { StyleSheet, Text, Pressable, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import { textScale, moderateScaleVertical } from "../styles/responsiveSize";
import Colors from "../Colors";

const FormSubmitButton = ({ title, onPress }) => {
  // fonts
  const [loaded] = useFonts({
    arima_bold: fontFamily.arima_Bold,
    raleway_light: fontFamily.raleway_light,
    raleway_medium: fontFamily.raleway_medium,
    raleway_regular: fontFamily.raleway_regular,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: moderateScaleVertical(45),
    backgroundColor: "rgba(27, 27, 51, 1)",
    borderRadius: moderateScaleVertical(8),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: textScale(20),
    fontFamily: "arima_bold",
    color: Colors.white,
  },
});

export default FormSubmitButton;
