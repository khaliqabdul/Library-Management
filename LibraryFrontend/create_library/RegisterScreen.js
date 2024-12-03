import {
  FormControl,
  ScrollView,
  Text,
  View,
  useMedia,
} from "@gluestack-ui/themed";
import { Keyboard, StyleSheet } from "react-native";
import { StackActions } from "@react-navigation/native";
import { useState } from "react";

import FormInput from "../components/formElements/FormInput";
import FormHeader from "../components/formElements/ٖFormHeader";
import FormSelectorButton from "../components/formElements/FormSelectorButton";
import FormSubmitButton from "../components/formElements/FormSubmitButton";
import {
  isValidFieldObject,
  isvalidEmail,
  updateError,
  updateNotification,
} from "../components/utils/formValidationMethods";
import LoadingScreen from "../components/formElements/LoadingScreen";
import { useLogin } from "../components/context/LoginProvider";
import { signUp } from "../components/api/user";
import CustomDropdownComponent from "../components/formElements/CustomDropdownComponent";
import { genderData } from "../components/popup-menu/data";
import { useFonts } from "expo-font";
import fontFamily from "../components/styles/fontFamily";
import Colors from "../components/Colors";
import {
  moderateScaleVertical,
  textScale,
} from "../components/styles/responsiveSize";
import AppNotification from "../components/AppNotification";

const genders = genderData.map((item, index) => {
  return `${item.gender}`;
});

export default function RegisterScreen({ navigation }) {
  const { loginPending, setLoginPending } = useLogin();
  const [gender, setGender] = useState("Select gender");
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    libraryName: "",
    libraryAddress: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    libraryName,
    libraryAddress,
  } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const media = useMedia();

  // reset form
  function resetForm() {
    setUserInfo({
      firstName: "",
      lastName: "",
      libraryName: "",
      libraryAddress: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setGender("Select gender");
  }
  // form validation
  const isvalidForm = () => {
    // We will accept only if all the fields have value
    if (!isValidFieldObject({ ...userInfo })) {
      return updateError("Empty field", setError);
    }
    // if valid firstname with 3 or more characters
    if (!firstName.trim() || firstName.length < 3) {
      return updateError("invalid First Name", setError);
    }
    // if valid lastname with 3 or more characters
    if (!lastName.trim() || lastName.length < 3) {
      return updateError("invalid Last Name", setError);
    }
    // if valid libraryName with 3 or more characters
    if (!libraryName.trim() || libraryName.length < 3) {
      return updateError("invalid Library Name", setError);
    }
    // if valid libraryAddress with 3 or more characters
    if (!libraryAddress.trim() || libraryAddress.length < 3) {
      return updateError("invalid Library Address", setError);
    }
    // only valid email id is allowed
    if (!isvalidEmail(email)) {
      return updateError("invalid email", setError);
    }
    // password must be 8 or more charactors
    if (!password.trim() || password.length < 8) {
      return updateError("password is less than 8 characters", setError);
    }
    // password and confirm password must be same
    if (!confirmPassword.trim() || confirmPassword.length < 8) {
      return updateError("password is less than 8 characters", setError);
    }
    return true;
  };
  const submitForm = async () => {
    Keyboard.dismiss();
    try {
      if (isvalidForm()) {
        setLoginPending(true);
        const res = await signUp({ ...userInfo, gender });
        const { success, message, user } = res.data;

        if (success) {
          updateNotification(message, setMessage, "success");
          resetForm();
          setLoginPending(false);
          navigation.dispatch(
            StackActions.replace("VerifyEmail", { Profile: user })
          );
          // navigation.navigate("VerifyEmail", user);
        } else {
          updateNotification(res.error, setMessage);
          updateNotification(message, setMessage);
          resetForm();
          setLoginPending(false);
        }
      }
    } catch (error) {
      if (error?.response?.data)
        return updateNotification(error.response.data, setMessage);
    }
  };

  const fetchItem = (item) => {
    setGender(item);
  };
  // fonts
  const [loaded] = useFonts({
    raleway_bold: fontFamily.raleway_Bold,
    raleway_medium: fontFamily.raleway_medium,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <>
      <View
        style={styles.container}
        bg="#f8f9fe"
        width={media.lg ? "$1/3" : "$full"}
        marginRight={"auto"}
        marginLeft={"auto"}
      >
        <View style={{ height: 70 }}>
          <FormHeader
            leftHeading="Welcome"
            rightHeading="in"
            subHeading="Library Management System"
          />
        </View>
        <View style={{ flexDirection: "row", padding: 20 }}>
          <FormSelectorButton
            style={styles.borderLeft}
            backgroundColor="rgba(27, 27, 51, 0.4)"
            title="Login"
            onPress={() => navigation.navigate("Login")}
          />
          <FormSelectorButton
            style={styles.borderRight}
            backgroundColor="rgba(27, 27, 51, 1)"
            title="Sign up"
          />
        </View>
        <Text style={styles.createAccount}>Create New Account</Text>
        {/* Notification message */}
        {message.text ? (
          <AppNotification type={message.type} text={message.text} />
        ) : null}
        <ScrollView>
          <View>
            <FormControl
              p="$5"
              borderWidth="$1"
              borderRadius={"$lg"}
              borderColor="$borderLight300"
              $dark-borderWidth="$1"
              $dark-borderRadius="$lg"
              $dark-borderColor="$borderDark800"
            >
              {/* first name */}
              <FormInput
                inputLabel={"First Name"}
                type={"text"}
                placeholder={"First Name"}
                focus={null}
                error={!firstName.trim() || firstName.length < 3 ? error : null}
                value={firstName}
                onChangeText={(value) => handleOnChangeText(value, "firstName")}
              />
              {/* last name */}
              <FormInput
                inputLabel={"Last Name"}
                type={"text"}
                placeholder={"Last Name"}
                focus={null}
                error={!lastName.trim() || lastName.length < 3 ? error : null}
                value={lastName}
                onChangeText={(value) => handleOnChangeText(value, "lastName")}
              />
              {/* gender */}
              <CustomDropdownComponent
                inputLabel="Gender"
                dropdownList={genders}
                value={gender}
                fetchItem={fetchItem}
                error={gender == "Select gender" ? error : null}
              />
              {/* library name */}
              <FormInput
                inputLabel={"Library Name"}
                type={"text"}
                placeholder={"Enter Library Name"}
                value={libraryName}
                error={
                  !libraryName.trim() || libraryName.length < 3 ? error : null
                }
                onChangeText={(value) =>
                  handleOnChangeText(value, "libraryName")
                }
              />
              {/* library Address */}
              <FormInput
                inputLabel={"Library Address"}
                type={"text"}
                placeholder={"Enter Library Address"}
                value={libraryAddress}
                error={
                  !libraryAddress.trim() || libraryAddress.length < 3
                    ? error
                    : null
                }
                onChangeText={(value) =>
                  handleOnChangeText(value, "libraryAddress")
                }
              />
              {/* Email */}
              <FormInput
                inputLabel={"Email"}
                type={"text"}
                placeholder={"Email"}
                autoCapitalize="none"
                error={!isvalidEmail(email) ? error : null}
                focus={null}
                value={email}
                onChangeText={(value) => handleOnChangeText(value, "email")}
              />
              {/* Password */}
              <FormInput
                inputLabel={"Password"}
                type={"password"}
                placeholder={"Password"}
                autoCapitalize="none"
                error={!password.trim() || password.length < 8 ? error : null}
                focus={null}
                value={password}
                onChangeText={(value) => handleOnChangeText(value, "password")}
              />
              {/* Confirm Password */}
              <FormInput
                inputLabel={"Confirm Password"}
                type={"password"}
                placeholder={"Confirm Password"}
                autoCapitalize="none"
                error={
                  !confirmPassword.trim() || confirmPassword.length < 8
                    ? error
                    : null
                }
                focus={null}
                value={confirmPassword}
                onChangeText={(value) =>
                  handleOnChangeText(value, "confirmPassword")
                }
              />
              {/* Loading Screen */}
              {loginPending ? <LoadingScreen /> : null}
              {/* submit button */}
              <FormSubmitButton
                title={"Sign Up"}
                onPress={() => submitForm()}
              />
            </FormControl>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: moderateScaleVertical(20),
  },
  borderLeft: {
    borderTopLeftRadius: moderateScaleVertical(8),
    borderBottomLeftRadius: moderateScaleVertical(8),
  },
  borderRight: {
    borderTopRightRadius: moderateScaleVertical(8),
    borderBottomRightRadius: moderateScaleVertical(8),
  },
  createAccount: {
    color: Colors.Charcoal,
    fontSize: textScale(18),
    fontFamily: "raleway_medium",
    alignSelf: "center",
    marginBottom: moderateScaleVertical(5),
  },
  errorMessage: {
    textAlign: "center",
    color: Colors.pink,
    fontSize: textScale(14),
    marginBottom: moderateScaleVertical(10),
  },
});
