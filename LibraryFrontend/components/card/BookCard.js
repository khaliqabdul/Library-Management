import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { faEdit, faTrash, faListDots } from "@fortawesome/free-solid-svg-icons";
import Colors from "../Colors";
import Icon from "../Icons";
import { useLogin } from "../context/LoginProvider";
import client from "../api/client";
import AlertComponent from "../popup-menu/AlertComponent";
import ModalComponent from "../popup-menu/ModalComponent";

const BookCard = ({
  bookTitle,
  author,
  price,
  image,
  genre,
  _id,
  lendingHistory,
  navigation,
}) => {
  const { isLoggedin, profile, setBookData, isToken } = useLogin();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedBook, setSelectedBook] = useState();
  const [showModal, setShowModal] = useState(false);
  
  let bookStatus = "Available";
  lendingHistory.forEach((element) => {
    if (!element.returnedOn) {
      bookStatus = "Issued";
    } else {
      bookStatus = "Available";
    }
  });

  const activateAlert = () => {
    setShowAlert(true);
    setSelectedBook({ _id, bookTitle });
  };
  // Modal Component
  const openModal = () => {
    setShowModal(true);
  };

  const openPurchaseDetail = () => {
    setShowModal(false)
    navigation.navigate("bookPurchase");
  }

  function openBookDetail() {
    setShowModal(false)
    navigation.navigate("bookDetail");
    setBookData({
      _id,
      bookTitle,
      price,
      author,
      genre,
      image,
      lendingHistory,
    });
  }

  // AlertComponent props
  let book = "";
  let data = {};
  if (selectedBook) {
    book = selectedBook.bookTitle;
    data = {
      bookId: selectedBook._id,
      registration_id: profile.id,
    };
  }
  const onCancelClick = () => {
    setShowAlert(false);
  };

  const onYesClick = async () => {
    if (isLoggedin) {
      await client
        .post("/deleteBook", data, {
          headers: {
            "Content-Type": "application/json",
            authorization: `${isToken}`,
          },
        })
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
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Pressable onPress={() => openModal()}>
          <Image source={{ uri: image }} style={styles.image} />
        </Pressable>
      </View>
      <View style={styles.itemRight}>
        <View style={styles.verticalItem}>
          <View style={styles.top}>
            <Text style={styles.title}>{bookTitle}</Text>
            <Text style={styles.price}>{genre}</Text>
            <Text style={styles.author}>{author}</Text>
            <Text style={styles.price}>Rs.{price}</Text>
            <Text style={styles.status}>{`Status: ${bookStatus}`}</Text>
          </View>
          <View style={styles.bottom}>
            <View style={styles.icons}>
              {/* edit icon */}
              <Pressable style={styles.circle} onPress={() => {}}>
                <Icon icon={faEdit} />
              </Pressable>
              {/* delete icon */}
              <Pressable style={styles.circle} onPress={() => activateAlert()}>
                <Icon icon={faTrash} />
              </Pressable>
              {/* listDots icon */}
              <Pressable style={styles.circle} onPress={() => openModal()}>
                <Icon icon={faListDots} />
              </Pressable>
            </View>
          </View>
        </View>
        {showAlert ? (
          <AlertComponent
            title="Warning"
            showAlert
            setShowAlert={setShowAlert}
            onCancelClick={onCancelClick}
            onYesClick={onYesClick}
            data={book}
          >
            Are you sure you want to delete book
          </AlertComponent>
        ) : null}
        {/* Modal Component */}
        {showModal ? (
          <ModalComponent
            showModal={showModal}
            setShowModal={setShowModal}
            function2={openBookDetail}
            function3={openPurchaseDetail}
            data2="Lending Record"
            data3="Purchase Record"
          />
        ) : null}
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
    height: "65%",
  },
  bottom: {
    height: "20%",
    marginTop: 20,
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
    color: Colors.purple,
  },
  image: {
    width: 110,
    height: 160,
    borderRadius: 10,
    borderColor: "green",
    borderWidth: 2,
  },
  circle: {
    // backgroundColor: 'white',
    borderWidth: 1,
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
