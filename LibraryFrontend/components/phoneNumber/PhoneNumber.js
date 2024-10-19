import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState, Fragment } from "react";
import CountryPicker from "./CountryPicker";
import { useLogin } from "../context/LoginProvider";
import { moderateScale, textScale, moderateScaleVertical } from "../styles/responsiveSize";

const PhoneNumber = ({
  onChangeTextHandler = () => {},
  error = "",
  value = "",
}) => {
  const {selectedCountry, setSelectedCountry} = useLogin()
  
  // receive this data from its children and
  // again sent to children as value
  const fetchCountry = (data) => {
    setSelectedCountry(data.item);
  };

  const cc = selectedCountry.code;

  return (
    <Fragment>
      <View style={{ marginTop: moderateScaleVertical(-20) }}>
        <Text style={styles.label}>Select Country</Text>
        <CountryPicker
          fetchCountry={fetchCountry}
          value={selectedCountry.country}
        />
      </View>
      {/* phone number */}
      <Text style={styles.phoneLabel}>Phone No.</Text>
      <View style={styles.phoneContainer}>
        {cc ? <Text style={styles.code}>+{cc}</Text> : null}
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Enter your phone number"
            keyboardType="numeric"
            value={value}
            maxLength={10}
            style={styles.phone}
            onChangeText={(value) =>
              onChangeTextHandler(value, "phoneNumber")
            }
          />
        </View>
      </View>
      <Text style={styles.errorMessage}>{error}</Text>
    </Fragment>
  );
};

export default PhoneNumber;

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: textScale(15),
  },
  phoneLabel: {
    fontWeight: "bold",
    marginTop: moderateScaleVertical(20),
    fontSize: textScale(15),
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: moderateScaleVertical(20),
  },
  code: {
    paddingLeft: moderateScale(15),
    fontSize: textScale(16),
  },
  phone: {
    paddingVertical: moderateScaleVertical(7),
    paddingHorizontal: moderateScale(15),
    fontSize: textScale(16),
  },
  errorMessage: {
    textAlign: "right",
    color: "red",
    fontSize: textScale(13),
    marginBottom: moderateScaleVertical(10),
    marginTop: moderateScaleVertical(-20),
  },
});
