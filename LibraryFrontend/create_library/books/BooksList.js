import React, { useState, useEffect, useCallback } from "react";
import { FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import client from "../../components/api/client";
import socketServices from "../../components/utils/socketService";
import { useMedia } from "@gluestack-style/react";
import BookCard from "../../components/card/BookCard";
import { useLogin } from "../../components/context/LoginProvider";
import SearchComponent from "../../components/searchComponent/SearchComponent";
import {
  textScale,
  moderateScale,
} from "../../components/styles/responsiveSize";
import ListEmptyComponent from "../../components/listEmptyComponent/ListEmptyComponent";

const BooksList = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { profile, isLoggedin, isToken } = useLogin();
  const registration_id = profile.id;
  const data = {
    librarianId: { id: registration_id },
  };
  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  useEffect(() => {
    socketServices.emit("join room", registration_id);
    // listen from bookController
    socketServices.on("send_booksList", (data) => {
      setBooks(data);
    });
    socketServices.on("delete_book", (data) => {
      setBooks(data);
    });
    return () => {
      socketServices.removeListener("send_booksList");
      socketServices.removeListener("delete_book");
    };
  }, [books]);

  const searchTextHandler = (text) => {
    if (text !== "") {
      let tempData = books.filter((item) => {
        return item.bookTitle.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setBooks(tempData);
    } else {
      getBooks();
    }
  };

  const listEmptyComponent = useCallback(() => {
    return (
      <ListEmptyComponent
        navigation={navigation}
        text="Tap below button to add books!"
        screen="addBook"
        buttonTitle="Add Book"
      />
    );
  }, [books]);

  async function getBooks() {
    if (isLoggedin) {
      await client
        .post("/booksList", data.librarianId, {
          headers: {
            "Content-Type": "application/json",
            authorization: `${isToken}`,
          },
        })
        .then((res) => {
          // alert(res.data.message)
          setBooks(res.data.booksList);
        })
        .catch((err) => {
          console.log("Error", err.message);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  useEffect(() => {
    getBooks();
  }, []);

  const media = useMedia();

  return (
    <>
      {loading || error ? (
        <>
          <Text style={styles.errorMsg}>Unable to connect to the server.</Text>
          <ActivityIndicator size="large" />
        </>
      ) : (
        <>
          <FlatList
            numColumns={media.lg ? 3 : 1}
            ListHeaderComponent={
              <>
                <SearchComponent
                  headerText="Book's List"
                  searchTextHandler={searchTextHandler}
                />
              </>
            }
            ListEmptyComponent={listEmptyComponent}
            data={books}
            renderItem={({ item }) => (
              <BookCard {...item} navigation={navigation} />
            )}
            keyExtractor={(item) => item._id.toString()}
          />
        </>
      )}
    </>
  );
};
export default BooksList;

const styles = StyleSheet.create({
  errorMsg: {
    color: "#ee8888",
    fontSize: textScale(20),
    padding: moderateScale(24),
    textAlign: "center",
  },
});
