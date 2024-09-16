import { View, Text, TextInput, StyleSheet } from "react-native";
import { HStack } from "@gluestack-ui/themed";

export default function FormTextarea(props) {
  const { inputLabel, placeholder, type, value, row, onChangeText, error } =
    props;
  return (
    <View style={styles.Container}>
      <HStack>
        <Text style={{ fontWeight: "bold" }}>{inputLabel}</Text>
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
          onChangeText={onChangeText}
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
    flex: 1,
    marginBottom: 10,
    // marginTop: 30,
  },
  textAreaContainer: {
    borderColor: "#1b1b33",
    borderWidth: 1,
    borderRadius: 8,
  },
  textArea: {
    height: 80,
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingTop: 5,
    borderRadius: 8,
    justifyContent: "flex-start",
  },
  errorMessage: {
    textAlign: "right",
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: "auto",
  },
});
