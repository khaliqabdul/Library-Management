import { StyleSheet, Text, View } from "react-native";
import React, { Fragment } from "react";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../styles/responsiveSize";
import FormSubmitButton from "../formElements/FormSubmitButton";
import Colors from "../Colors";

const ListEmptyComponent = ({
  navigation,
  text = "",
  screen = "",
  buttonTitle = "",
}) => {
  return (
    <Fragment>
      <View style={styles.emptyListStyle}>
        <Text style={styles.emptyListText}>{text}</Text>
        <View style={styles.button}>
          <FormSubmitButton
            title={buttonTitle}
            onPress={() => navigation.navigate(screen)}
          />
        </View>
      </View>
    </Fragment>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  emptyListStyle: {
    flex: 1,
    alignItems: "center",
    marginTop: moderateScaleVertical(50),
  },
  emptyListText: {
    fontSize: textScale(20),
    color: Colors.menu1,
    fontWeight: "800",
  },
  button: {
    flex: 1,
    width: "80%",
    marginTop: moderateScale(20),
  },
});
