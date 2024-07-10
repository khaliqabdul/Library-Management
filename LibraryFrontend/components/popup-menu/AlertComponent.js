import { View } from "react-native";
import React from "react";
import {
  Center,
  Button,
  ButtonText,
  AlertDialog,
  Text,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  Heading,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonGroup,
  Icon,
  CloseIcon,
} from "@gluestack-ui/themed";
import { useLogin } from "../context/LoginProvider";
import client from "../api/client";

export default function AlertComponent(props) {
  const { title, body, cancelButtonText, yesButtonText } = props.alertMessage;
  const { showAlert, setShowAlert, isLoggedin, memberData, profile } =
    useLogin();
  // console.log(memberData)
  const data = {
    memberId: { id: memberData.id },
    registration_id: profile.id,
  };

  // delete member
  const deleteMember = async () => {
    if (isLoggedin) {
      await client
        .post("/deleteReader", data)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((error) => {
          console.log("error", error);
          alert(res.data.message);
        })
        .finally(() => {
          setShowAlert(false);
        });
    }
  };
  return (
    <Center h={0}>
      {/* <Button onPress={() => setShowAlert(true)}>
        <ButtonText>Click me</ButtonText>
      </Button> */}
      <AlertDialog
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">{title}</Heading>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="lg">{body} "{memberData.name}"</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setShowAlert(false);
                }}
              >
                <ButtonText>{cancelButtonText}</ButtonText>
              </Button>
              <Button
                bg="$error600"
                action="negative"
                onPress={() => {
                  deleteMember();
                }}
              >
                <ButtonText>{yesButtonText}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Center>
  );
}
