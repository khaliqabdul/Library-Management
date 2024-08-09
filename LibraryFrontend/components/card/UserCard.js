import { Image, StyleSheet, Text } from "react-native";
import { View, Pressable } from "@gluestack-ui/themed";
import React, { useState } from "react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Icon from "../Icons";
import Colors from "../Colors";
import ModalComponent from "../popup-menu/ModalComponent";
import { useLogin } from "../context/LoginProvider";
import AlertComponent from "../popup-menu/AlertComponent";
import client from "../api/client";

// user card starts
const UserCard = ({ name, age, gender, phone, CNIC_No, address, id }) => {
  const {
    setShowModal,
    setShowAlert,
    setMemberData,
    isLoggedin,
    memberData,
    profile,
  } = useLogin();

  const data = {
    memberId: { id: memberData.id },
    registration_id: profile.id,
  };
  // alertMessage is used in AlertComponent
  const alertMessage = {
    title: "Warning",
    body: "Are you sure you want to delete the member",
    cancelButtonText: "Cancel",
    yesButtonText: "Yes",
    data: memberData.name,
    onClick: async () => {
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
    },
  };

  const openModal = () => {
    setShowModal(true);
    setMemberData({ id, name });
  };
  return (
    <View style={styles.cardContainer}>
      <View style={styles.menuWrapper}>
        {/* image */}
        <Image
          source={require("../../assets/images/userAvatar.png")}
          style={styles.coverImage}
        />
        {/* threedot menu */}
        <Pressable
          onPress={() => openModal()}
          p="$5"
          bg="$primary100"
          $hover-bg="$primary400"
          borderRadius={50}
        >
          <Icon color={Colors.dark} icon={faEllipsisVertical} />
        </Pressable>
        {/* Modal component */}
        <ModalComponent />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.text}>{gender}</Text>
        <Text style={styles.text}>{age} Years</Text>
        <Text style={styles.text}>+{phone}</Text>
        <Text style={styles.text}>{CNIC_No}</Text>
        <Text style={styles.text}>{address}</Text>
      </View>
      <AlertComponent alertMessage={alertMessage} />
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: "80%",
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 8,
    shadowOffset: { width: 1, height: 4 },
    shadowColor: Colors.blue,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: Colors.white,
  },
  menuWrapper: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "30%",
  },
  coverImage: {
    height: 55,
    width: 50,
    borderRadius: 50,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  content: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: "600",
  },
  threedotMenuContainer: {
    height: 38,
    width: 38,
    backgroundColor: Colors.menu2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    position: "absolute",
    top: 20,
    left: 20,
  },
});
