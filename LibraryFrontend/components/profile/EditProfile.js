import { Keyboard, Pressable, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useMedia, View } from "@gluestack-ui/themed";
import Colors from "../Colors";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../styles/responsiveSize";
import WrapperComponent from "../WrapperComponent";
import HeaderComponent from "../HeaderComponent";
import FormInput from "../formElements/FormInput";
import FormTextarea from "../formElements/FormTextarea";
import FormSubmitButton from "../formElements/FormSubmitButton";
import LoadingScreen from "../formElements/LoadingScreen";
import Checkbox from "expo-checkbox";
import AppNotification from "../AppNotification";
import { updateNotification } from "../utils/formValidationMethods";
import client from "../api/client";
import { useLogin } from "../context/LoginProvider";

// create a component
const EditProfile = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const { firstName, lastName, email, libraryName, libraryAddress } = userInfo;
  const [userChangeInfo, setUserChangeInfo] = useState({});
  const [checked, setChecked] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { isToken, setProfile } = useLogin();

  useEffect(() => {
    const { firstName, lastName, gender, email, libraryName, libraryAddress } =
      route.params.profile;
    setUserInfo({
      firstName,
      lastName,
      gender,
      email,
      libraryName,
      libraryAddress,
    });
    setUserChangeInfo({
      firstName,
      lastName,
      gender,
      libraryName,
      libraryAddress,
    });
    setChecked(gender);
  }, []);

  const handleOnChangeText = (value, fieldName) => {
    setUserChangeInfo({ ...userChangeInfo, [fieldName]: value });
  };

  const submitForm = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    const data = {
      firstName: userChangeInfo.firstName,
      lastName: userChangeInfo.lastName,
      gender: checked,
      email: email,
      libraryName: userChangeInfo.libraryName,
      libraryAddress: userChangeInfo.libraryAddress,
    };
    const { firstName, lastName, gender, libraryAddress, libraryName } = data;
    if (
      firstName == "" ||
      lastName == "" ||
      !gender ||
      libraryName == "" ||
      libraryAddress == ""
    )
      return updateNotification("Empty Field", setMessage, "error");
    try {
      await client
        .post("/update-profile", data, {
          headers: {
            Accept: "application/json",
            // "Content-Type": "multipart/form-data",
            authorization: `${isToken}`,
          },
        })
        .then((res) => {
          if (res.data.success == true) {
            updateNotification(res.data.message, setMessage, "success");
            // console.log(res.data.updatedUser);
            setProfile(res.data.updatedUser);
            setTimeout(() => {
              navigation.goBack();
            }, 5000);
          } else {
            updateNotification(res.data.message, setMessage, "error");
          }
        })
        .catch((error) => {
          if (error?.response?.data) {
            return updateNotification(
              error.response.data.error,
              setMessage,
              "error"
            );
          }
          console.log(error);
        })
        .finally(() => [setIsLoading(false)]);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success)
          return updateNotification(data.error, setMessage, "error");
        return console.log("error", error.response.data);
      }
      console.log(error);
    }
  };

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

  const media = useMedia();
  // fonts
  const [loaded] = useFonts({
    raleway_bold: fontFamily.raleway_Bold,
    raleway_light: fontFamily.raleway_light,
    raleway_medium: fontFamily.raleway_medium,
    raleway_regular: fontFamily.raleway_regular,
    arima_bold: fontFamily.arima_Bold,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <>
      <HeaderComponent
        centerText="Edit profile"
        leftText="Back"
        rightText="Done"
        isLeftView={true}
        leftCustomView={leftCustomView}
        rightTextStyle={{ color: Colors.white }}
        containerStyle={{
          marginBottom: moderateScaleVertical(20),
          paddingHorizontal: moderateScale(0),
        }}
      />
      <WrapperComponent
        containerStyle={{ paddingHorizontal: moderateScale(20) }}
      >
        {message.text && (
          <AppNotification type={message.type} text={message.text} />
        )}
        <View
          width={media.lg ? "$1/3" : "$full"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          {/* first name */}
          <FormInput
            inputLabel={"First Name"}
            type={"text"}
            placeholder={"First Name"}
            focus={null}
            defaultValue={firstName}
            // value={userChangeInfo.firstName}
            onChangeText={(value) => handleOnChangeText(value, "firstName")}
          />
          {/* last name */}
          <FormInput
            inputLabel={"Last Name"}
            type={"text"}
            placeholder={"Last Name"}
            focus={null}
            defaultValue={lastName}
            // value={userChangeInfo.lastName}
            onChangeText={(value) => handleOnChangeText(value, "lastName")}
          />
          {/* gender */}
          <Text style={{ ...styles.checkboxLabel }}>Gender:</Text>
          <View style={styles.checkboxWrapper}>
            <Checkbox
              value={checked == "Male" ? true : false}
              onValueChange={() => setChecked("Male")}
              color={checked == "Male" ? Colors.blue : undefined}
              marginLeft={moderateScale(0)}
            />
            <Text style={styles.checkboxText}>Male</Text>
            <Checkbox
              value={checked == "Female" ? true : false}
              onValueChange={() => setChecked("Female")}
              color={checked == "Female" ? Colors.blue : undefined}
              marginLeft={moderateScale(0)}
            />
            <Text style={styles.checkboxText}>Female</Text>
          </View>

          {/* library name */}
          <FormInput
            inputLabel={"Library Name"}
            type={"text"}
            placeholder={"Enter Library Name"}
            // value={userChangeInfo.libraryName}
            defaultValue={libraryName}
            onChangeText={(value) => handleOnChangeText(value, "libraryName")}
          />
          {/* library Address */}
          <FormTextarea
            inputLabel="Library Address"
            placeholder="Enter Library Address"
            row="10"
            // value={userChangeInfo.libraryAddress}
            defaultValue={libraryAddress}
            onChangeText={(value) =>
              handleOnChangeText(value, "libraryAddress")
            }
          />
          {/* Loading Screen */}
          {isLoading ? <LoadingScreen /> : null}
          {/* submit button */}
          <FormSubmitButton
            title={"Sign Up"}
            customColor={true}
            disabled={false}
            onPress={() => submitForm()}
          />
        </View>
      </WrapperComponent>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  mainHeader: {
    fontSize: textScale(20),
    paddingTop: moderateScaleVertical(20),
    paddingBottom: moderateScaleVertical(15),
    textTransform: "capitalize",
    fontWeight: "500",
    fontFamily: "arima_bold",
    alignSelf: "center",
  },
  checkboxWrapper: {
    display: "flex",
    flexDirection: "row",
    marginBottom: moderateScaleVertical(30),
    marginHorizontal: moderateScale(20),
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  checkboxText: {
    // marginRight: moderateScale(10),
    fontSize: textScale(15),
    fontFamily: "raleway_medium",
  },
  checkboxLabel: {
    fontFamily: "raleway_bold",
    fontSize: textScale(16),
    color: Colors.Charcoal,
    paddingBottom: moderateScaleVertical(5),
    lineHeight: moderateScaleVertical(25),
  },
});
