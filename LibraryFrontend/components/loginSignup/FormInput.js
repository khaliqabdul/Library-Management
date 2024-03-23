import {
  FormControl,
  Input,
  InputSlot,
  InputIcon,
  EyeIcon,
  EyeOffIcon,
  InputField,
  SelectSectionHeaderText,
  HStack,
  Text,
} from "@gluestack-ui/themed";
import { useState } from "react";
import { StyleSheet, } from "react-native";

export default function FormInput(props) {
  const { 
    inputLabel,
    rightInputLabel,
    value,
    error,
    type,
    placeholder,
    focus, } = props
    
  const [showPassword, setShowpassword] = useState(false);
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
      
      <Input style={styles.input}>
        <InputField
          {...props}
          type={!showPassword ? type : null}
          placeholder={placeholder}
          onFocus={focus}
          value={value}
        />
        {type == "password" ? (
          <InputSlot pr="$4" onPress={handleState}>
            <InputIcon
              as={showPassword ? EyeIcon : EyeOffIcon}
              color="#005DB4"
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
    borderWidth: 1,
    borderColor: "#1b1b33",
    borderRadius: 8,
    height: 35,
    fontSize: 16,
    paddingLeft: 5,
    marginBottom: 0,
  },
  errorMessage: {
    textAlign: 'right',
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
});
