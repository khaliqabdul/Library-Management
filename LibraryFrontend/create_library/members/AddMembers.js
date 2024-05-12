import { useEffect, useState } from "react";
import {
  FormControl,
  View,
  VStack,
  Spinner,
  ScrollView,
  useMedia,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";
import FormInput from "../../components/loginSignup/FormInput";
import FormSubmitButton from "../../components/loginSignup/FormSubmitButton";
import FormHeader from "../../components/loginSignup/ٖFormHeader";
import FormTextarea from "../../components/loginSignup/FormTextarea";

import client from "../../components/api/client";
import { useLogin } from "../../components/context/LoginProvider";
import {
  isValidFieldObject,
  updateError,
} from "../../components/utils/formValidationMethods";
import socketServices from "../../components/utils/socketService";

export default function AddMember() {
  const { isLoggedin, profile } = useLogin();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputInfo, setInputInfo] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
  });
  const { name, age, gender, address } = inputInfo;
  const registration_id = profile.id;

  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  const onChangeTextHandler = (value, fieldName) => {
    setInputInfo({ ...inputInfo, [fieldName]: value });
  };

  // console.log("id", registration_id);
  const media = useMedia();
  // reset form
  function resetForm() {
    setInputInfo({
      name: "",
      age: "",
      gender: "",
      address: "",
    });
  }
  // form validation
  const isvalidForm = () => {
    // We will accept only if all the fields have value
    if (!isValidFieldObject(inputInfo)) {
      return updateError("Required all fields", setError);
    }
    // if valid name with 3 or more characters
    if (!name.trim() || name.length < 3) {
      return updateError("invalid Name", setError);
    }
    // if valid age with 2 or more characters
    if (!age.trim() || age.length < 2) {
      return updateError("invalid Name", setError);
    }
    // gender validation
    if (!gender.trim() || gender.length < 4) {
      return updateError("gender is required", setError);
    }
    // address validation
    if (!address.trim() || address.length < 10) {
      return updateError("Too Short address", setError);
    }
    return true;
  };

  async function sendRequestToAddNewReader() {
    if (isvalidForm()) {
      setIsLoading(true);
      const data = {
        member: {
          registration_id,
          name,
          age,
          gender,
          address,
          isBlackListed: false,
        },
      };
      if (isLoggedin) {
        await client
          .post(`/reader`, data.member)
          .then((res) => {
            socketServices.emit("add_member", data.member)
            resetForm();
            alert(res.data.message);
          })
          .catch((err) => {
            console.log("Error", err);
            alert(res.data.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
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
        <View style={styles.formHeaderContainer}>
          <FormHeader
            leftHeading="Add"
            rightHeading="Member"
            style={{ color: "#FAF9F6", paddingTop: 5, fontWeight: "300" }}
          />
        </View>
        <ScrollView>
          <FormControl p="$4" borderWidth="$1" borderRadius="$lg">
            {/* Full Name */}
            <FormInput
              inputLabel="Full Name"
              placeholder="Full Name"
              type="text"
              value={name}
              onChangeText={(value) => onChangeTextHandler(value, "name")}
              error={!name.trim() || name.length < 3 ? error : null}
            />
            {/* Age */}
            <FormInput
              inputLabel="Age"
              placeholder="Age"
              type="text"
              keyboardType="numeric"
              value={age}
              onChangeText={(value) => onChangeTextHandler(value, "age")}
              error={!age.trim() || age.length < 2 ? error : null}
            />
            {/* Gender */}
            <FormInput
              inputLabel="Gender"
              placeholder="Gender"
              type="text"
              value={gender}
              onChangeText={(value) => onChangeTextHandler(value, "gender")}
              error={!gender.trim() || gender.length < 4 ? error : null}
            />
            {/* Address */}
            <FormTextarea
              inputLabel="Address"
              placeholder="Address..."
              type="text"
              row={4}
              value={address}
              onChangeText={(value) => onChangeTextHandler(value, "address")}
              error={!address.trim() || address.length < 10 ? error : null}
            />
            {/* Submit Button */}
            {isLoading ? (
              <VStack mt="$5">
                <Spinner size="large" />
              </VStack>
            ) : (
              <VStack mt="$5">
                <FormSubmitButton
                  title={"Save Member"}
                  onPress={() => sendRequestToAddNewReader()}
                />
              </VStack>
            )}
          </FormControl>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  formHeaderContainer: {
    height: 60,
    margin: 10,
    backgroundColor: "#1b1b33",
    borderRadius: 10,
  },
});
