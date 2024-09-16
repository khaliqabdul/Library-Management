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
} from "@gluestack-ui/themed";
import { useState } from "react";
import { StyleSheet } from "react-native";
// import { useLogin } from "../context/LoginProvider";

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
  } = props;
  // console.log(value)
  const [showPassword, setShowpassword] = useState(false);
  // const { showModal, setShowDateModal } = useLogin();

  const handleState = () => {
    setShowpassword((showState) => {
      return !showState;
    });
  };

  return (
    <FormControl>
      <HStack>
        <Text style={{ fontWeight: "bold" }}>{inputLabel}</Text>
        <Text lineHeight="$xs" fontSize={"$xs"} color="#005DB4" ml={"auto"}>
          {rightInputLabel}
        </Text>
        {/* <Text style={styles.errorMessage}>{error}</Text> */}
      </HStack>

      <Input style={[styles.input, { marginHorizontal: marginHorizontal }]}>
        <InputField
          {...props}
          type={!showPassword ? type : null}
          placeholder={placeholder}
          onFocus={focus}
          value={value}
          keyboardType={keyboardType}
          editable={editable}
          maxLength={maxLength}
        />
        {type == "password" ? (
          <InputSlot pr="$4" onPress={handleState}>
            <InputIcon
              as={showPassword ? EyeIcon : EyeOffIcon}
              color="#005DB4"
            />
          </InputSlot>
        ) : (
          null
        )}
      </Input>
      <Text style={styles.errorMessage}>{error}</Text>
    </FormControl>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#1b1b33",
    borderRadius: 0,
    height: 35,
    fontSize: 16,
    paddingLeft: 5,
    marginBottom: 0,
  },
  errorMessage: {
    textAlign: "right",
    color: "red",
    fontSize: 13,
    marginBottom: 10,
  },
});
