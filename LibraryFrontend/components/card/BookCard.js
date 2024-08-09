import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import {
  faEdit,
  faTrash,
  faListDots,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "../Colors";
import Icon from "../Icons";
import { useLogin } from "../context/LoginProvider";
import client from "../api/client";
import AlertComponent from "../popup-menu/AlertComponent";

const BookCard = ({ bookTitle, author, price, image, genre, _id}) => {
  const { isLoggedin, profile, setShowAlert, bookData, setBookData } = useLogin();

  const activateAlert = () => {
    setShowAlert(true);
    setBookData({_id, bookTitle})
  };
  
  const data = {
    bookId: bookData._id,
    registration_id: profile.id,
  };

  // alertMessage is used in AlertComponent
  const alertMessage = {
    title: "Warning",
    body: "Are you sure you want to delete book",
    cancelButtonText: "Cancel",
    yesButtonText: "Yes",
    data: bookData.bookTitle,
    onClick: async () => {
      if (isLoggedin) {
        await client
          .post("/deleteBook", data)
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
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <View style={styles.itemRight}>
        <View style={styles.verticalItem}>
          <View style={styles.top}>
            <Text style={styles.title}>{bookTitle}</Text>
            <Text style={styles.price}>{genre}</Text>
            <Text style={styles.author}>{author}</Text>
            <Text style={styles.price}>Rs.{price}</Text>
            <Text style={styles.status}>Status:</Text>
          </View>
          <View style={styles.bottom}>
            <View style={styles.icons}>
              <Icon icon={faEdit} />
              <Pressable onPress={() => activateAlert()}>
                <Icon icon={faTrash} />
              </Pressable>
              <Icon icon={faListDots} />
            </View>
          </View>
        </View>
        <AlertComponent alertMessage={alertMessage}/>
      </View>
    </View>
  );
};

export default BookCard;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    backgroundColor: "#e4ede7",
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 8,
    shadowOffset: { width: 1, height: 4 },
    shadowColor: Colors.blue,
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  itemLeft: {
    width: "40%",
  },
  itemRight: {
    width: "60%",
  },
  verticalItem: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    // alignItems: 'flex-end'
  },
  top: {
    height: "80%",
  },
  bottom: {
    height: "20%",
    marginTop: 30,
  },
  icons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 16,
    color: "#ed5045",
    fontWeight: "600",
  },
  author: {
    fontSize: 14,
    color: "#333",
  },
  price: {
    fontSize: 14,
    color: "#333",
    // textAlign: "right",
  },
  status: {
    fontSize: 16,
    color: "#ee8888",
  },
  image: {
    width: 110,
    height: 160,
    borderRadius: 10,
    borderColor: "green",
    borderWidth: 2,
  },
});
