import { View } from "react-native";
import React, { useState } from "react";
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

// AlertComponent is used in UserCard,
export default function AlertComponent({
  title,
  children,
  onCancelClick,
  onYesClick,
  showAlert,
  setShowAlert,
  data,
}) {
  // const { showAlert, setShowAlert } = useLogin();

  return (
    <Center h={0}>
      <AlertDialog
        isOpen={showAlert}
        onClose={() => {setShowAlert(false)}}
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
            <Text size="lg">{children} "{data}"</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Button
                variant="outline"
                action="secondary"
                onPress={onCancelClick}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button bg="$error600" action="negative" onPress={onYesClick}>
                <ButtonText>Yes</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Center>
  );
}
