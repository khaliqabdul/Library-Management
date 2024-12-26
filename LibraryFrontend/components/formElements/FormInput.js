import {
  FormControl,
  Input,
  InputSlot,
  InputIcon,
  EyeIcon,
  EyeOffIcon,
  InputField,
  HStack,
  Text,
  Pressable,
} from "@gluestack-ui/themed";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import Colors from "../Colors";
import {
  scale,
  textScale,
  moderateScale,
  moderateScaleVertical,
} from "../styles/responsiveSize";

export default function FormInput(props) {
  const {
    inputLabel,
    keyboardType,
    rightInputLabel,
    value,
    editable,
    error,
    defaultValue,
    type,
    placeholder,
    focus,
    marginHorizontal,
    maxLength,
    inputRef,
    openScreen = () => {},
  } = props;
  const [showPassword, setShowpassword] = useState(false);

  const handleState = () => {
    setShowpassword((showState) => {
      return !showState;
    });
  };
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
    <FormControl>
      <HStack>
        <Text style={styles.inputLabel}>{inputLabel}</Text>
        <Pressable
          style={{ marginLeft: "auto" }}
          onPress={openScreen}
          activeOpacity={0.7}
        >
          <Text style={styles.rightInputLabel}>{rightInputLabel}</Text>
        </Pressable>
      </HStack>

      <Input style={[styles.input, { marginHorizontal: marginHorizontal }]}>
        <InputField
          {...props}
          ref={inputRef}
          type={!showPassword ? type : null}
          placeholder={placeholder}
          onFocus={focus}
          value={value}
          defaultValue={defaultValue}
          keyboardType={keyboardType}
          editable={editable}
          maxLength={maxLength}
        />
        {type == "password" ? (
          <InputSlot pr="$4" onPress={handleState}>
            <InputIcon
              as={showPassword ? EyeIcon : EyeOffIcon}
              color={Colors.primary}
            />
          </InputSlot>
        ) : null}
      </Input>
      <Text style={styles.errorMessage}>{error}</Text>
    </FormControl>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: moderateScaleVertical(1),
    borderColor: Colors.gray, //"#1b1b33"
    borderRadius: 0,
    height: moderateScaleVertical(40),
    fontSize: textScale(16),
    paddingLeft: moderateScale(5),
    marginBottom: 0,
    fontFamily: "raleway_regular",
  },
  inputLabel: {
    fontFamily: "raleway_bold",
    fontSize: textScale(16),
    color: Colors.Charcoal,
    paddingBottom: moderateScaleVertical(5),
    lineHeight: moderateScaleVertical(25),
  },
  rightInputLabel: {
    fontSize: textScale(15),
    color: Colors.primary,
    fontFamily: "raleway_medium",
  },
  errorMessage: {
    textAlign: "right",
    color: Colors.pink,
    fontSize: textScale(14),
    marginBottom: moderateScale(10),
  },
});
