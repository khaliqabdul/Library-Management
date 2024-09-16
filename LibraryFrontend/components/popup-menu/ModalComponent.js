import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Colors from "../Colors";

const Divider = () => <View style={styles.divider} />;
const deviceHeight = Dimensions.get("window").height;

const ModalComponent = ({
  data1,
  activateAlert,
  data2,
  function2,
  data3,
  function3,
  showModal,
  setShowModal,
}) => {
  return (
    <Modal
      transparent={true}
      visible={showModal}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Pressable onPress={() => setShowModal(false)}>
            <View style={styles.barIcon}></View>
          </Pressable>
          {/* data 1 */}
          {data1 ? (
            <>
              <Pressable style={styles.row} onPress={activateAlert}>
                <Text style={styles.text}>{data1}</Text>
              </Pressable>
              <Divider />
            </>
          ) : null}
          {/* data 2 */}
          <Pressable style={styles.row} onPress={function2}>
            <Text style={styles.text}>{data2}</Text>
          </Pressable>
          <Divider />
          {/* data 3 */}
          {data3 ? (
            <>
              <Pressable style={styles.row} onPress={function3}>
                <Text style={styles.text}>{data3}</Text>
              </Pressable>
              <Divider />
            </>
          ) : null}
          {/* cancel Button */}
          <Pressable onPress={() => setShowModal(false)}>
            <Text style={styles.pressibleText}>Cancel</Text>
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
    minHeight: deviceHeight * 0.2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.white,
    marginVertical: 5,
  },
  pressibleText: {
    // backgroundColor: Colors.menu2,
    color: Colors.white,
    marginTop: 20,
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
    justifyContent: "center",
  },
  text: {
    color: Colors.white,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});
