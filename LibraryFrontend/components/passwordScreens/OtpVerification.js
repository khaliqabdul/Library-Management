import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StackActions } from "@react-navigation/native";
import Colors from "../Colors";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../styles/responsiveSize";
import FormSubmitButton from "../formElements/FormSubmitButton";
import LoadingScreen from "../formElements/LoadingScreen";
import client from "../api/client";
import { updateNotification } from "../utils/formValidationMethods";
import AppNotification from "../AppNotification";

const inputs = Array(4).fill("");
let newInputIndex = 0;
const isObject = (obj) => {
  return Object.values(obj).every((value) => value.trim());
};

const OtpVerification = ({ route, navigation }) => {
  const { Profile } = route.params;
  const input = useRef();

  const [OTP, setOTP] = useState({ 0: "", 1: "", 2: "", 3: "" });
  const [nextInputIndex, setNextInputIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const handleChangeText = (text, index) => {
    const newOTP = { ...OTP };
    newOTP[index] = text;
    setOTP(newOTP);
    // handle focus here
    const lastInputIndex = inputs.length - 1;
    if (!text) newInputIndex = index === 0 ? 0 : index - 1;
    else newInputIndex = index === lastInputIndex ? lastInputIndex : index + 1;
    setNextInputIndex(newInputIndex);
  };
  // submit OTP
  const submitOTP = async () => {
    Keyboard.dismiss();

    if (isObject(OTP)) {
      setLoading(true);
      let otpCode = "";
      Object.values(OTP).forEach((val) => {
        otpCode += val;
      });

      await client
        .post(
          `/verifyEmail?otp=${otpCode}&userId=${Profile.userId}`,
          { otpCode, userId: Profile.userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          updateNotification(res.data.message, setMessage, "success");
          setTimeout(() => {
            navigation.dispatch(StackActions.replace("LMS Home"));
          }, 5000);
        })
        .catch((error) => {
          if (error?.response?.data) {
            return updateNotification(error.response.data.error, setMessage);
          }
          console.log("Error", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      return updateNotification("Empty or missing fields", setMessage);
    }
  };

  useEffect(() => {
    {
      input.current ? input.current.focus() : null;
    }
  }, [nextInputIndex]);

  // fonts
  const [loaded] = useFonts({
    raleway_bold: fontFamily.raleway_Bold,
    raleway_medium: fontFamily.raleway_medium,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {message.text ? (
        <AppNotification type={message.type} text={message.text} />
      ) : null}
      <Text style={styles.heading}>
        OTP code has been sent to your email, Please verify your email!
      </Text>
      <View style={styles.otpContainer}>
        {inputs.map((inp, index) => {
          return (
            <View key={index.toString()} style={styles.inputContainer}>
              <TextInput
                value={OTP[index]}
                onChangeText={(text) => handleChangeText(text, index)}
                placeholder="0"
                keyboardType="numeric"
                maxLength={1}
                style={styles.input}
                ref={nextInputIndex === index ? input : null}
              />
            </View>
          );
        })}
      </View>
      {loading ? <LoadingScreen /> : null}
      <View style={styles.buttonContainer}>
        <FormSubmitButton
          onPress={() => submitOTP()}
          title={"Submit OTP"}
          customColor={true}
          disabled={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;

const { width } = Dimensions.get("window");
const inputWidth = Math.round(width / 6);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontFamily: "raleway_medium",
    fontSize: textScale(16),
    color: Colors.Charcoal,
    textAlign: "center",
    marginBottom: 25,
    marginTop: moderateScaleVertical(30),
    marginHorizontal: moderateScale(15),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: inputWidth / 2,
    marginBottom: moderateScaleVertical(40),
  },
  inputContainer: {
    width: inputWidth,
    height: inputWidth,
    borderWidth: 2,
    borderColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonContainer: {
    width: width / 1.2,
    alignSelf: "center",
  },
});
