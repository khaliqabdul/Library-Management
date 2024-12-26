import { View, Text, TextInput, StyleSheet } from "react-native";
import { HStack } from "@gluestack-ui/themed";
import {
  textScale,
  moderateScaleVertical,
  moderateScale,
} from "../styles/responsiveSize";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import Colors from "../Colors";

export default function FormTextarea(props) {
  const {
    inputLabel,
    placeholder,
    type,
    value,
    defaultValue,
    row,
    onChangeText,
    error,
  } = props;

  // fonts
  const [loaded] = useFonts({
    raleway_bold: fontFamily.raleway_Bold,
    raleway_light: fontFamily.raleway_light,
    raleway_medium: fontFamily.raleway_medium,
    raleway_regular: fontFamily.raleway_regular,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <View style={styles.Container}>
      <HStack>
        <Text style={styles.inputLabel}>{inputLabel}</Text>
        {/* <Text style={styles.errorMessage}>{error}</Text> */}
      </HStack>

      <View style={styles.textAreaContainer}>
        <TextInput
          style={styles.textArea}
          underlineColorAndroid="transparent"
          placeholder={placeholder}
          placeholderTextColor="grey"
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          // numberOfLines={row}
          row={row}
          multiline={true}
        />
      </View>
      <Text style={styles.errorMessage}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    // flex: 1,
    marginBottom: 10,
    // marginTop: 30,
  },
  inputLabel: {
    fontFamily: "raleway_bold",
    fontSize: textScale(16),
    color: Colors.Charcoal,
    paddingBottom: moderateScaleVertical(5),
    lineHeight: moderateScaleVertical(25),
  },
  textAreaContainer: {
    borderWidth: moderateScaleVertical(1),
    borderColor: Colors.gray, //"#1b1b33"
    borderRadius: 8,
    // backgroundColor: "red",
    // height: "100%",
  },
  textArea: {
    height: moderateScaleVertical(100),
    fontSize: textScale(16),
    paddingHorizontal: moderateScale(10),
    marginBottom: 0,
    fontFamily: "raleway_regular",
  },
  errorMessage: {
    textAlign: "right",
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: "auto",
  },
});
