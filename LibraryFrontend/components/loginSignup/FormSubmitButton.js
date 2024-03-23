import { StyleSheet, Text, Pressable } from "react-native";

const FormSubmitButton = ({ title, onPress }) => {
  return (
    <>
      <Pressable style={styles.container} onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 45,
    backgroundColor: 'rgba(27, 27, 51, 1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    color: "#fff"
  }
});

export default FormSubmitButton;
