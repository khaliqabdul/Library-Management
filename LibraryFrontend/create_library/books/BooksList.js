import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import client from "../../components/api/client";
import socketServices from "../../components/utils/socketService";
import { useMedia } from "@gluestack-style/react";
import Icon from "../../components/Icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../../components/loginSignup/FormInput";
import BookCard from "../../components/card/BookCard";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  useEffect(() => {
    // listen from bookController
    socketServices.on("send_booksList", (data) => {
      setBooks(data);
    });
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

  async function getBooks() {
    await client
      .get("/booksList")
      .then((res) => {
        setBooks(res.data.booksList);
      })
      .catch((err) => {
        console.log("Error", err.message);
        // setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
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
                {/* header */}
                <Text style={styles.headerText}>Book's List</Text>
                {/* search box */}
                <View style={{ marginTop: 5 }}>
                  <View style={styles.iconContainer}>
                    <Icon icon={faSearch} />
                  </View>
                  <FormInput
                    placeholder="Search"
                    marginHorizontal={20}
                    reference={searchRef}
                    onChangeText={(text) => searchTextHandler(text)}
                  />
                </View>
              </>
            }
            data={books}
            renderItem={({ item }) => (
              <BookCard {...item} />
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
  container: {
    flex: 1,
    marginTop: "10%",
  },
  errorMsg: {
    color: "#ee8888",
    fontSize: 20,
    padding: 24,
    textAlign: "center",
  },
  
  // List Header
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 20,
    letterSpacing: 1,
  },
  iconContainer: {
    position: "absolute",
    top: 35,
    right: 30,
    width: 30,
    height: 30,
    borderRadius: 50,
    // backgroundColor: 'green'
  },
});
