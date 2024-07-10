import { Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  Heading,
  VStack,
  FormControl,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Icon,
  CloseIcon,
  ModalBody,
  CalendarDaysIcon,
} from "@gluestack-ui/themed";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useLogin } from "../context/LoginProvider";

export default function DatePickerComponent(props) {
  const { inputLabel, error, } = props;
  const { showDateModal, setShowDateModal, setDateOfBirth } = useLogin();
  const [dateValue, setDateValue] = useState(dayjs());
  
  const t = new Date(dateValue.toString());
  const date = ("0" + t.getDate()).slice(-2);
  const month = ("0" + (t.getMonth() + 1)).slice(-2);
  const year = t.getFullYear();
  const birthDate = `${date}/${month}/${year}`;

  return (
    <>
      <VStack p="$0">
        <FormControl>
          {/* Label */}
          <Text style={styles.heading}>{inputLabel}</Text>
          {/* Date of Birth */}
          <Pressable
            style={styles.dropdownSelector}
            onPress={() => setShowDateModal(true)}
          >
            <Text>{birthDate}</Text>
            <Icon as={CalendarDaysIcon} />
          </Pressable>
          <Text style={styles.errorMessage}>{error}</Text>
          {/* Modal */}
          <Modal
            isOpen={showDateModal}
            onClose={() => {
              setShowDateModal(false);
            }}
          >
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Heading size="lg" color="$red600">
                  <Text>Date of Birth</Text>
                </Heading>
                <ModalCloseButton>
                  <Icon as={CloseIcon} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <View>
                  <DatePicker
                    mode="single"
                    date={dateValue}
                    onChange={(params) => {
                      setDateValue(params.date);
                      setDateOfBirth(params.date.toString());
                      setShowDateModal(false);
                    }}
                    firstDayOfWeek={1}
                    selectedItemColor="#0047FF"
                  />
                </View>
              </ModalBody>
            </ModalContent>
          </Modal>
        </FormControl>
      </VStack>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  dropdownSelector: {
    width: "100%",
    height: 35,
    borderWidth: 0.5,
    borderColor: "#1b1b33",
    alignSelf: "center",
    // marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  errorMessage: {
    textAlign: "right",
    color: "red",
    fontSize: 13,
    marginBottom: 10,
  },
});
