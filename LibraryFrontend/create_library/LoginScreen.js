import {
  FormControl,
  Pressable,
  ScrollView,
  View,
  Text,
  VStack,
  useMedia,
  HStack,
  Center,
} from "@gluestack-ui/themed";
import { Keyboard, StyleSheet } from "react-native";
import { useState } from "react";
import { useLogin } from "../components/context/LoginProvider";
import FormHeader from "../components/formElements/ٖFormHeader";
import FormInput from "../components/formElements/FormInput";
import LoadingScreen from "../components/formElements/LoadingScreen";

import FormSelectorButton from "../components/formElements/FormSelectorButton";
import FormSubmitButton from "../components/formElements/FormSubmitButton";
import {
  isValidFieldObject,
  isvalidEmail,
  updateError,
  updateNotification,
} from "../components/utils/formValidationMethods";
import { signIn } from "../components/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import fontFamily from "../components/styles/fontFamily";
import Colors from "../components/Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../components/styles/responsiveSize";
import AppNotification from "../components/AppNotification";

export default function LoginScreen({ navigation }) {
  const {
    loginPending,
    setLoginPending,
    setIsLoggedIn,
    setProfile,
    setIsToken,
  } = useLogin();
  const [error, setError] = useState("");
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const [inputInfo, setInputInfo] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputInfo;

  const onChangeTextHandler = (value, fieldName) => {
    setInputInfo({ ...inputInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    // error if all fields are empty
    if (!isValidFieldObject(inputInfo)) {
      return updateError("Empty Fields!", setError);
    }
    // error if email is invalid
    if (!isvalidEmail(email)) {
      return updateError("invalid email!", setError);
    }
    // // password must be 8 or more charactors
    if (!password.trim() || password.length < 8) {
      return updateError("password is too short", setError);
    }
    return true;
  };
  const sendRequestToLogin = async () => {
    Keyboard.dismiss();
    if (isValidForm()) {
      setLoginPending(true);
      const res = await signIn(email, password);
      if (!res.data.success) {
        updateNotification(res.data.message, setMessage);
        setLoginPending(false);
        setInputInfo({ email: "", password: "" });
      } else {
        const token = await AsyncStorage.getItem("token");
        setIsToken(token);
        setProfile(res.data.user);
        setInputInfo({ email: "", password: "" });
        setIsLoggedIn(true);
        setLoginPending(false);
      }
    }
  };

  const openScreen = () => {
    navigation.navigate("ForgetPassword");
  };

  const media = useMedia();
  // fonts
  const [loaded] = useFonts({
    raleway_medium: fontFamily.raleway_medium,
    raleway_regular: fontFamily.raleway_regular,
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
            rightHeading="Back"
            subHeading="Library Management System"
          />
        </View>
        <View style={{ flexDirection: "row", padding: 20, marginBottom: 10 }}>
          <FormSelectorButton
            style={styles.borderLeft}
            backgroundColor="rgba(27, 27, 51, 1)"
            title="Login"
          />
          <FormSelectorButton
            style={styles.borderRight}
            backgroundColor="rgba(27, 27, 51, 0.4)"
            title="Sign up"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
        {message.text ? (
          <AppNotification type={message.type} text={message.text} />
        ) : null}
        <ScrollView>
          <FormControl
            p="$5"
            borderWidth="$1"
            borderRadius={"$lg"}
            borderColor="$borderLight300"
            $dark-borderWidth="$1"
            $dark-borderRadius="$lg"
            $dark-borderColor="$borderDark800"
          >
            <VStack space="xl">
              <HStack>
                <Text fontSize="$xs" fontFamily="raleway_regular">
                  Don't have account?
                </Text>
                <Pressable
                  onPress={() => navigation.navigate("Register")}
                  $hover-bg="$primary400"
                >
                  <Text style={styles.registerNow}>Register Now</Text>
                </Pressable>
              </HStack>
              {/* input email */}
              <FormInput
                inputLabel="Email"
                placeholder="example@email.com"
                type="text"
                error={!isvalidEmail(email) ? error : null}
                autoCapitalize="none"
                value={email}
                onChangeText={(value) => onChangeTextHandler(value, "email")}
              />
              {/* input password */}
              <FormInput
                inputLabel={"Password"}
                rightInputLabel={"Forget Password?"}
                placeholder={"************"}
                type={"password"}
                openScreen={openScreen}
                error={!password.trim() || password.length < 8 ? error : null}
                autoCapitalize="none"
                value={password}
                onChangeText={(value) => onChangeTextHandler(value, "password")}
              />
              {/* Loading screen */}
              {loginPending ? <LoadingScreen /> : null}
              {/* submit Button */}
              <FormSubmitButton
                title={"Login"}
                onPress={() => sendRequestToLogin()}
                customColor={true}
              />
              <Center>
                {/* <HStack alignItems="center">
                  <Text fontSize={"$xs"} fontFamily="raleway_regular">
                    Need help?
                  </Text>
                  <Pressable onPress={() => navigation.navigate("contact")}>
                    <Text style={styles.linkText}>Contact Us</Text>
                  </Pressable>
                </HStack> */}
                <Pressable onPress={openScreen}>
                  <Text style={styles.linkText}>Forget Password?</Text>
                </Pressable>
                {/* <Pressable onPress={() => navigation.navigate("VerifyEmail")}>
                  <Text style={styles.linkText}>Verify Email!</Text>
                </Pressable> */}
              </Center>
            </VStack>
          </FormControl>
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
  linkText: {
    fontSize: textScale(16),
    color: Colors.primary,
    marginLeft: moderateScale(5),
    fontFamily: "raleway_medium",
    marginVertical: moderateScaleVertical(5),
  },
});
