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
import { StyleSheet } from "react-native";
import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
} from "../components/utils/formValidationMethods";
import { signIn } from "../components/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function LoginScreen({ navigation }) {
  const { loginPending, setLoginPending, setIsLoggedIn, setProfile, setIsToken } =
    useLogin();
  
  const [error, setError] = useState("");
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
    if (isValidForm()) {
      setLoginPending(true);
      const res = await signIn(email, password);
      // console.log(res.data)
      if (!res.data.success) {
        alert(res.data.message);
        alert(res.data.type);
        setLoginPending(false);
        setInputInfo({ email: "", password: "" });
      } else {
        const token = await AsyncStorage.getItem("token")
        setIsToken(token)
        setProfile(res.data.user);
        setInputInfo({ email: "", password: "" });
        setIsLoggedIn(true);
        setLoginPending(false);
        // alert(res.data.message);
      }
    }
  };
  const media = useMedia(); 
  return (
    <>
      <View
        style={styles.container}
        bg="#f8f9fe"
        width={media.lg ? "$1/3" : "$full"}
        marginRight={"auto"}
        marginLeft={"auto"}
      >
        <View style={{ height: 80 }}>
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
        {/* <ProgressScreen/> */}
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
                <Text fontSize="$xs">Don't have account?</Text>
                <Pressable
                  onPress={() => navigation.navigate("Register")}
                  $hover-bg="$primary400"
                >
                  <Text fontSize="$sm" color="#005DB4" ml="$1">
                    Register Now
                  </Text>
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
                error={!password.trim() || password.length < 8 ? error : null}
                autoCapitalize="none"
                // secureTextEntry
                value={password}
                onChangeText={(value) => onChangeTextHandler(value, "password")}
              />
              {/* Loading screen */}
              {loginPending ? <LoadingScreen /> : null}
              {/* submit Button */}
              <FormSubmitButton
                title={"Login"}
                onPress={() => sendRequestToLogin()}
              />
              <Center>
                <HStack alignItems="center">
                  <Text fontSize={"$xs"}>Need help?</Text>
                  <Text fontSize={"$sm"} color="#005DB4" ml={"$1"}>
                    Contact Us
                  </Text>
                </HStack>
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
    paddingTop: 20,
  },
  borderLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  borderRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
