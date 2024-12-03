import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Fragment,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import {
  textScale,
  moderateScale,
  moderateScaleVertical,
} from "../styles/responsiveSize";
import FormInput from "../formElements/FormInput";
import FormSubmitButton from "../formElements/FormSubmitButton";
import {
  isvalidEmail,
  updateError,
  updateNotification,
} from "../utils/formValidationMethods";
import client from "../api/client";
import LoadingScreen from "../formElements/LoadingScreen";
import AppNotification from "../AppNotification";

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const onChangeTextHandler = (value) => {
    setEmail(value);
  };

  const isValidForm = () => {
    if (!isvalidEmail(email)) {
      return updateError("invalid email!", setError);
    }
    return true;
  };

  const submitEmail = async () => {
    Keyboard.dismiss();
    const data = { email: email };
    if (isValidForm()) {
      setIsLoading(true);
      await client
        .post("/forgot-password", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            updateNotification(res.data.message, setMessage);
            setTimeout(() => {
              navigation.goBack();
            }, 5000);

            // navigation.navigate("ResetPassword", {
            //   token: res.data.token,
            //   id: res.data.id,
            // });
          }
        })
        .catch((error) => {
          if (error?.response?.data) {
            return updateNotification(error.response.data.error, setMessage);
            // alert(error.response.data.error);
          }
          console.log(error);
        })
        .finally(() => {
          setEmail("");
          setIsLoading(false);
        });
    }
  };
  // fonts
  const [loaded] = useFonts({
    arima_bold: fontFamily.arima_Bold,
    raleway_regular: fontFamily.raleway_regular,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ ...styles.headerText, flex: 1 }}>Back</Text>
        </Pressable>
        <Text
          style={{
            ...styles.headerText,
            flex: 2,
            marginLeft: moderateScale(50),
            paddingHorizontal: moderateScale(30),
          }}
        >
          Forgot Password
        </Text>
      </View>
      {message.text ? (
        <AppNotification type={message.type} text={message.text} />
      ) : null}
      <Text
        style={{
          ...styles.descText,
          marginVertical: moderateScaleVertical(24),
        }}
      >
        Please enter your email, and we will send you a link to change your
        password.
      </Text>
      <View style={styles.input}>
        <FormInput
          inputLabel="Email"
          placeholder="example@email.com"
          type="text"
          error={!isvalidEmail(email) ? error : null}
          autoCapitalize="none"
          value={email}
          onChangeText={(value) => onChangeTextHandler(value)}
        />
        {isLoading ? <LoadingScreen /> : null}
      </View>
      {/* submit Button */}
      <View style={{ width: "95%" }}>
        <FormSubmitButton title={"Send OTP"} onPress={() => submitEmail()} />
      </View>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: moderateScale(1),
    width: "95%",
    marginTop: moderateScaleVertical(40),
    paddingBottom: moderateScaleVertical(5),
  },
  headerText: {
    fontSize: textScale(18),
    fontFamily: "arima_bold",
  },
  descText: {
    fontSize: textScale(18),
    fontFamily: "raleway_regular",
    textAlign: "center",
  },
  input: {
    width: "95%",
    marginVertical: moderateScaleVertical(10),
  },
});
