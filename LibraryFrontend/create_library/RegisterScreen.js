import {
  FormControl,
  ScrollView,
  Text,
  View,
  useMedia,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import { useState } from "react";
import axios from "axios";

import FormInput from "../components/loginSignup/FormInput"
import FormHeader from "../components/loginSignup/ٖFormHeader";
import FormSelectorButton from "../components/loginSignup/FormSelectorButton";
import FormSubmitButton from "../components/loginSignup/FormSubmitButton";
import { isValidFieldObject, isvalidEmail, updateError } from "../components/utils/formValidationMethods";
import client from "../components/api/client";

export default function RegisterScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState("");
  const { firstName, lastName, email, password, confirmPassword } = userInfo
 
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  }

  const media = useMedia();

  const isvalidForm = () => {
    // We will accept only if all the fields have value
    if (!isValidFieldObject(userInfo)) {
      return updateError("Required all fields", setError);
    }
    // if valid firstname with 3 or more characters
    if (!firstName.trim() || firstName.length < 3) {
      return updateError("invalid First Name", setError);
    }
    // if valid lastname with 3 or more characters
    if (!lastName.trim() || lastName.length < 3) {
      return updateError("invalid Last Name", setError);
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
    if (password !== confirmPassword) {
      return updateError("password does not match", setError);
    }
    return true
  };
  
  const submitForm = async () => {
    if (isvalidForm()) {
      const res = await client.post('/signup', {
        ...userInfo
      } )
      console.log(res.data);
    }

    // fetchApi();
  };
  // const fetchApi = async () => {
  //   const formData = {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     confirmPassword,
  //   };
  //   console.log(formData);
  //   try {
  //     await axios
  //       .post("http://192.168.1.3:3001/signup", formData)
  //       .then(function (response) {
  //         console.log(response);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
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
            rightHeading=""
            subHeading="Library Management System"
          />
        </View>
        <View style={{ flexDirection: "row", padding: 20, marginBottom: 10 }}>
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
        {!isValidFieldObject(userInfo) ? 
          <Text style={styles.errorMessage}>{error}</Text> : null
        }
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
              <Text fontSize="$md" mb={"$2"}>
                Create New Account
              </Text>
              <FormInput
                inputLabel={"First Name"}
                type={"text"}
                placeholder={"First Name"}
                focus={null}
                error= {!firstName.trim() || firstName.length < 3 ? error : null}
                value={firstName}
                onChangeText={(value) => handleOnChangeText(value, 'firstName')}
              />
              <FormInput
                inputLabel={"Last Name"}
                type={"text"}
                placeholder={"Last Name"}
                focus={null}
                error= {!lastName.trim() || lastName.length < 3 ? error : null}
                value={lastName}
                onChangeText={(value) => handleOnChangeText(value, 'lastName')}
              />
              <FormInput
                inputLabel={"Email"}
                type={"text"}
                placeholder={"Email"}
                autoCapitalize="none"
                error= {!isvalidEmail(email) ? error : null}
                focus={null}
                value={email}
                onChangeText={(value) => handleOnChangeText(value, 'email')}
              />
              <FormInput
                inputLabel={"Password"}
                type={"password"}
                placeholder={"Password"}
                autoCapitalize="none"
                error= {!password.trim() || password.length < 8 ? error : null}
                focus={null}
                value={password}
                onChangeText={(value) => handleOnChangeText(value, 'password')}
              />
              <FormInput
                inputLabel={"Confirm Password"}
                type={"password"}
                placeholder={"Confirm Password"}
                autoCapitalize="none"
                error= {password !== confirmPassword ? error : null}
                focus={null}
                value={confirmPassword}
                onChangeText={(value) => handleOnChangeText(value, 'confirmPassword')}
              />
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
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
});
