import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Fragment,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  isValidFieldObject,
  updateError,
  updateNotification,
} from "../utils/formValidationMethods";
import client from "../api/client";
import LoadingScreen from "../formElements/LoadingScreen";
import Colors from "../Colors";
import AppNotification from "../AppNotification";

const ResetPassword = ({ navigation, route }) => {
  const { token, id } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  // const [tokenId, setTokenId] = useState({ token: "", id: "" });

  const [inputInfo, setInputInfo] = useState({
    password: "",
    conformPassword: "",
    code: "",
  });
  const { password, conformPassword, code } = inputInfo;

  const onChangeTextHandler = (value, fieldName) => {
    setInputInfo({ ...inputInfo, [fieldName]: value });
  };

  const verifyOTP = async () => {
    // setTokenId(route.params);
    // const { token, id } = tokenId;
    try {
      await client.get(`/verify-resetPassToken?token=${token}&id=${id}`);
      // if (data.success) updateNotification(data.message, setMessage, "success");
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return updateNotification(data.error, setMessage);
        return console.log("Error", error.response.data);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyOTP();
  }, []);

  const isValidForm = () => {
    // error if all fields are empty
    if (!isValidFieldObject(inputInfo)) {
      return updateError("Empty Fields!", setError);
    }
    // code must be 8 or more charactors
    if (!code.trim() || code.length < 8) {
      return updateError("invalid code", setError);
    }
    // password must be 8 or more charactors
    if (!password.trim() || password.length < 8) {
      return updateError("password is too short", setError);
    }
    // // password must be 8 or more charactors
    if (!conformPassword.trim() || conformPassword.length < 8) {
      return updateError("password is too short", setError);
    }
    return true;
  };

  const submitData = async () => {
    // const { token, id } = tokenId;
    if (isValidForm()) {
      if (code !== token) return updateNotification("Invalid Code", setMessage);

      if (password !== conformPassword)
        return updateNotification("Password does not match!", setMessage);

      try {
        setIsLoading(true);
        await client
          .post(
            `/reset-password?token=${token}&id=${id}`,
            { password },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            if (res.data.success) {
              setInputInfo({ conformPassword: "", password: "", code: "" });
              updateNotification(res.data.message, setMessage, "success");
              setTimeout(() => {
                navigation.navigate("Login");
              }, 5000);
            }
          })
          .catch((error) => {
            if (error?.response?.data) {
              return updateNotification(error.response.data.error, setMessage);
            }
            console.log(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        if (error?.response?.data) {
          const { data } = error.response;
          if (!data.success) return updateNotification(data.error, setMessage);
          return console.log("Error", error.response.data);
        }
        console.log(error);
      }
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
        <Pressable onPress={() => navigation.navigate("Login")}>
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
          Reset Password
        </Text>
      </View>
      {/* Notification messages */}
      {message.text ? (
        <AppNotification type={message.type} text={message.text} />
      ) : null}
      {/* if condition */}
      {!route.params ? (
        <Text style={styles.errorText}>Reset token not found</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.descText}>
            Password reset OTP is sent to your email, which is valid for 0ne
            hour only. Please check your email inbox or spam section
          </Text>
          <Text style={styles.descText}>
            Please enter valid OTP code, and new password.
          </Text>

          <View style={styles.input}>
            {/* token */}
            <FormInput
              inputLabel="Enter token"
              placeholder={"Enter valid token here"}
              type={"text"}
              // error={!code.trim() || code.length < 8 ? error : null}
              autoCapitalize="none"
              value={code}
              onChangeText={(value) => onChangeTextHandler(value, "code")}
            />
            {/* password */}
            <FormInput
              inputLabel="Enter New Password"
              placeholder={"************"}
              type={"password"}
              error={!password.trim() || password.length < 8 ? error : null}
              autoCapitalize="none"
              value={password}
              onChangeText={(value) => onChangeTextHandler(value, "password")}
            />
            {/* conformPassword */}
            <FormInput
              inputLabel="Conform New Password"
              placeholder={"************"}
              type={"password"}
              error={
                !conformPassword.trim() || conformPassword.length < 8
                  ? error
                  : null
              }
              autoCapitalize="none"
              value={conformPassword}
              onChangeText={(value) =>
                onChangeTextHandler(value, "conformPassword")
              }
            />
            {isLoading ? <LoadingScreen /> : null}
          </View>
          {/* submit Button */}
          <View style={{ width: "95%" }}>
            <FormSubmitButton title={"Submit"} onPress={() => submitData()} />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
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
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: textScale(18),
    fontFamily: "arima_bold",
  },
  descText: {
    fontSize: textScale(18),
    fontFamily: "raleway_regular",
    textAlign: "center",
    marginHorizontal: moderateScale(4),
    marginVertical: moderateScaleVertical(24),
  },
  input: {
    width: "95%",
    marginVertical: moderateScaleVertical(10),
  },
});
