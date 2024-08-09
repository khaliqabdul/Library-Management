import { useEffect, useState } from "react";
import {
  FormControl,
  View,
  VStack,
  HStack,
  Spinner,
  ScrollView,
  useMedia,
  Box,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";

import FormInput from "../../components/loginSignup/FormInput";
import FormSubmitButton from "../../components/loginSignup/FormSubmitButton";
import FormHeader from "../../components/loginSignup/ٖFormHeader";
import FormTextarea from "../../components/loginSignup/FormTextarea";
import DatePickerComponent from "../../components/loginSignup/DatePickerComponent";
import { genderData } from "../../components/popup-menu/data";
import CustomDropdownComponent from "../../components/loginSignup/CustomDropdownComponent";

import client from "../../components/api/client";
import { useLogin } from "../../components/context/LoginProvider";
import {
  isValidFieldObject,
  updateError,
  isvalidCNIC,
  isvalidMobileNo,
} from "../../components/utils/formValidationMethods";
import socketServices from "../../components/utils/socketService";

const genders = genderData.map((item, index) => {
  return `${item.gender}`;
});

export default function AddMember() {
  const {
    isLoggedin,
    profile,
    dropdownSelectedItem,
    setDropdownSelectedItem,
    dateOfBirth,
  } = useLogin();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false); //used in mobile no
  const pattern = new RegExp(/^\d{1,10}$/);
  const [inputInfo, setInputInfo] = useState({
    name: "",
    countryCode: "",
    phoneNumber: "",
    cnicNumber: "",
    address: "",
  });
  const { name, address, phoneNumber, countryCode, cnicNumber } = inputInfo;
  const registration_id = profile.id;
  const gender = dropdownSelectedItem;
  const birthDate = dateOfBirth;

  const getAge = (birthDate) => {
    return Math.floor(
      (new Date() - new Date(birthDate).getTime()) / 3.15576e10
    );
  };
  const age = getAge(birthDate);
  const mobileNumber = `+${countryCode}${phoneNumber}`;

  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  const onChangeTextHandler = (value, fieldName) => {
    setInputInfo({ ...inputInfo, [fieldName]: value });
    if (!pattern.test(value)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const media = useMedia();
  // reset form
  function resetForm() {
    setInputInfo({
      name: "",
      countryCode: "",
      phoneNumber: "",
      cnicNumber: "",
      address: "",
    });
    setDropdownSelectedItem("Select");
  }
  // form validation
  const isvalidForm = () => {
    // We will accept only if all the fields have value
    if (!isValidFieldObject(inputInfo)) {
      return updateError("Required", setError);
    }
    // name validation
    if (!name.trim() || name.length < 3) {
      return updateError("invalid Name", setError);
    }
    // birthDate validation
    if (!birthDate) {
      return updateError("Empty Field", setError);
    }
    // gender validation
    if (gender == "Select") {
      return updateError("Empty Field", setError);
    }
    // country code validation
    if (!countryCode.trim() || countryCode.length < 2) {
      return updateError("invalid code", setError);
    }
    // mobile No validation
    if (!isvalidMobileNo(phoneNumber)) {
      return updateError("invalid No", setError);
    }
    // cnic validation
    if (!isvalidCNIC(cnicNumber)) {
      return updateError("invalid cnic!", setError);
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
          birthDate,
          mobileNumber,
          cnicNumber,
          address,
          isBlackListed: false,
        },
      };
      if (isLoggedin) {
        await client
          .post(`/reader`, data.member)
          .then((res) => {
            // listen in readerController
            socketServices.emit("add_member", data.member);
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
            {/* Date of Birth */}
            <DatePickerComponent
              inputLabel="Date of Birth"
              error={!birthDate ? error : null}
            />
            {/* Gender dropdown */}
            <CustomDropdownComponent
              dropdownList={genders}
              inputLabel="Gender"
              value={gender}
              error={gender == "Select" ? error : null}
            />
            {/* Phone Number */}
            <HStack space="md" reversed={false}>
              <Box w="30%">
                <FormInput
                  inputLabel="Code"
                  rightInputLabel=""
                  placeholder="92"
                  keyboardType="numeric"
                  maxLength={5}
                  value={countryCode}
                  onChangeText={(value) =>
                    onChangeTextHandler(value, "countryCode")
                  }
                  error={
                    !countryCode.trim() || countryCode.length < 2 ? error : null
                  }
                />
              </Box>
              <Box w="65%">
                <FormInput
                  inputLabel="Mobile No."
                  rightInputLabel={
                    isError || mobileNumber.length < 13
                      ? "Invalid No"
                      : mobileNumber
                  }
                  placeholder="0000000000"
                  keyboardType="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={(value) =>
                    onChangeTextHandler(value, "phoneNumber")
                  }
                  error={!isvalidMobileNo(phoneNumber) ? error : null}
                />
              </Box>
            </HStack>
            {/* CNIC No */}
            <FormInput
              inputLabel="CNIC No."
              rightInputLabel={
                isError || cnicNumber.length < 15
                  ? "Invalid pattern"
                  : cnicNumber
              }
              placeholder="00000-0000000-0 (Follow the pattern)"
              keyboardType="numeric"
              maxLength={15}
              value={cnicNumber}
              onChangeText={(value) => onChangeTextHandler(value, "cnicNumber")}
              error={!isvalidCNIC(cnicNumber) ? error : null}
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
