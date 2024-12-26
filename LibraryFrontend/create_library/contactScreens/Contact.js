import React, { useState } from "react";
import {
  // View,
  StyleSheet,
  Text,
  Keyboard,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useMedia, View } from "@gluestack-ui/themed";
import FormInput from "../../components/formElements/FormInput";
import FormTextarea from "../../components/formElements/FormTextarea";
import FormSubmitButton from "../../components/formElements/FormSubmitButton";
import { useFonts } from "expo-font";
import fontFamily from "../../components/styles/fontFamily";
import Colors from "../../components/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../components/styles/responsiveSize";
import AppNotification from "../../components/AppNotification";
import { updateNotification } from "../../components/utils/formValidationMethods";
import client from "../../components/api/client";
import LoadingScreen from "../../components/formElements/LoadingScreen";
import { useLogin } from "../../components/context/LoginProvider";
import WrapperComponent from "../../components/WrapperComponent";
import HeaderComponent from "../../components/HeaderComponent";

const Contact = ({ navigation }) => {
  const { profile } = useLogin();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [contactInfo, setContactInfo] = useState({
    query: "",
    agree: false,
  });
  const { fullName, email, query, agree } = contactInfo;

  const profileName = `${profile.firstName} ${profile.lastName}`;
  const data = {
    fullName: profileName,
    email: profile.email,
    query,
  };

  // onChangeHandler
  const onChangeTextHandler = (value, name) => {
    setContactInfo({ ...contactInfo, [name]: value });
  };
  // submitContactInfo
  const submitContactInfo = async () => {
    Keyboard.dismiss();
    if (!fullName && !email && !query)
      return updateNotification("Empty Fields", setMessage, "error");

    setLoading(true);
    await client
      .post("/contact-us", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setLoading(false);
        updateNotification(res.data.message, setMessage, "success");
        setContactInfo({ query: "" });
        setTimeout(() => {
          navigation.navigate("HomeScreen");
        }, 5000);
      })
      .catch((error) => {
        if (error?.response?.data) {
          setContactInfo({ query: "" });
          return updateNotification(error.response.data.error, setMessage);
        }
        console.log("Error1", error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const media = useMedia();
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
  //
  const leftCustomView = () => {
    return (
      <Pressable onPress={() => navigation.goBack()}>
        <Text
          style={{ fontSize: textScale(18), fontFamily: "raleway_regular" }}
        >
          Back
        </Text>
      </Pressable>
    );
  };
  return (
    <>
      <HeaderComponent
        centerText="Contact Us"
        isLeftView={true}
        leftCustomView={leftCustomView}
        rightText="Done"
        containerStyle={{ paddingVertical: 5 }}
        rightTextStyle={{ color: Colors.white }}
      />
      <WrapperComponent
        containerStyle={{
          paddingHorizontal: moderateScale(10),
        }}
      >
        <View
          style={{ backgroundColor: "#f8f9fe" }}
          width={media.lg ? "$1/3" : "$full"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          <Text style={styles.mainHeader}>Level up your knowledge</Text>
          {message.text ? (
            <AppNotification type={message.type} text={message.text} />
          ) : null}

          <Text style={styles.description}>You can reach us any time via:</Text>
          <Text style={styles.description}>WhattsApp: 03327509421</Text>
          <Text
            style={{
              ...styles.description,
              marginBottom: moderateScaleVertical(15),
            }}
          >
            Send Us Your Query!
          </Text>
          <View style={styles.inputContainer}>
            <FormInput
              inputLabel="Enter your name"
              placeholder="Enter your name"
              type="text"
              autoCapitalize="none"
              value={profileName}
            />
            <FormInput
              inputLabel="Email"
              placeholder="example@email.com"
              type="text"
              autoCapitalize="none"
              value={profile.email}
            />
            <FormTextarea
              inputLabel="How can we help you?"
              placeholder="Enter your query please"
              row="10"
              value={query}
              onChangeText={(value) => onChangeTextHandler(value, "query")}
            />
          </View>
          {loading && <LoadingScreen />}
          {/* checkbox */}
          <View style={styles.checkboxWrapper}>
            <Checkbox
              value={agree}
              onValueChange={(value) => onChangeTextHandler(value, "agree")}
              color={agree ? Colors.blue : undefined}
            />
            <Text style={styles.checkboxText}>
              I have read and agreed with the Terms & Conditions
            </Text>
          </View>
          {/* submit button */}
          <FormSubmitButton
            title={"Contact Us"}
            customColor={agree}
            disabled={!agree}
            onPress={() => submitContactInfo()}
          />
        </View>
      </WrapperComponent>
    </>
  );
};

export default Contact;

const styles = StyleSheet.create({
  mainHeader: {
    fontSize: textScale(20),
    paddingVertical: moderateScaleVertical(10),
    textTransform: "capitalize",
    fontWeight: "500",
    fontFamily: "raleway_bold",
    // alignSelf: "center",
  },
  description: {
    fontSize: textScale(16),
    color: Colors.grey,
    paddingBottom: moderateScaleVertical(15),
    lineHeight: moderateScaleVertical(20),
    fontFamily: "raleway_regular",
    marginBottom: -10,
    // alignSelf: "center",
  },
  inputContainer: {
    // backgroundColor: Colors.light,
  },
  checkboxWrapper: {
    display: "flex",
    flexDirection: "row",
    marginBottom: moderateScaleVertical(30),
    marginHorizontal: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxText: {
    marginLeft: moderateScale(10),
    fontSize: textScale(15),
    fontFamily: "raleway_medium",
  },
});
