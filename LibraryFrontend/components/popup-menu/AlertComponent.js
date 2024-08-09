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

// AlertComponent is used in UserCard, 
export default function AlertComponent(props) {
  const { title, body, cancelButtonText, yesButtonText, onClick, data } =
    props.alertMessage;
  const { showAlert, setShowAlert } = useLogin();
  
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
            <Text size="lg">
              {body} "{data}"
            </Text>
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
              <Button bg="$error600" action="negative" onPress={onClick}>
                <ButtonText>{yesButtonText}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Center>
  );
}
