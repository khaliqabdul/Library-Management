import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useLogin } from "../context/LoginProvider";
import Colors from "../Colors";
import Icon from "../Icons";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import client from "../api/client";

const Divider = () => <View style={styles.divider} />;
const deviceHeight = Dimensions.get("window").height;

const ModalComponent = () => {
  const { showModal, setShowModal, memberData, setShowAlert } = useLogin();

  // activate alert
  const activateAlert = () => {
    setShowAlert(true);
    setShowModal(false);
  };

  const EditMember = () => {
    setShowModal(false);
    console.log("in modal", memberData);
  };

  return (
    <Modal
      transparent={true}
      visible={showModal}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.barIcon}></View>
          {/* Delete Member */}
          <Pressable style={styles.row} onPress={() => activateAlert()}>
            <Text style={styles.text}>Delete</Text>
            <Text style={styles.text}>
              <Icon color={Colors.white} icon={faTrash} />
            </Text>
          </Pressable>
          <Divider />
          {/* Edit Member */}
          <Pressable style={styles.row} onPress={() => EditMember()}>
            <Text style={styles.text}>Edit</Text>
            <Text style={styles.text}>
              <Icon color={Colors.white} icon={faEdit} />
            </Text>
          </Pressable>
          {/* close Button */}
          <Pressable onPress={() => setShowModal(false)}>
            <Text style={styles.pressibleText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fffaa",
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    backgroundColor: Colors.Charcoal,
    width: "100%",
    alignSelf: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
    minHeight: deviceHeight * 0.3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.white,
    marginVertical: 5,
  },
  pressibleText: {
    backgroundColor: Colors.menu2,
    marginTop: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    borderRadius: 5,
    paddingVertical: 5,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: Colors.white,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});
