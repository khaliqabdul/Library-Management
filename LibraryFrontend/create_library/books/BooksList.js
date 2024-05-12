import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";

const BookItem = ({ title, author, price }) => (
  <View style={styles.item}>
    <View style={styles.itemLeft}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
    </View>
    <View style={styles.itemRight}>
      <Text style={styles.price}>Rs.{price}</Text>
    </View>
  </View>
);

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const options = {
    method: 'POST',
    body: JSON.stringify()
  }

  async function getBooks() {
    try {
      
      const {data: books} = await axios.get("http://192.168.1.2:3001/books")
      setBooks(books);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  if (error)
    return (
      <Text style={styles.errorMsg}>Unable to connect to the server.</Text>
    );

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookItem {...item} />}
      keyExtractor={(item) => item.id}
    />
  );
};
export default BooksList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    backgroundColor: "#eee",
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemLeft: {
    width: "70%",
  },
  itemRight: {
    width: "30%",
  },
  title: {
    fontSize: 22,
    color: "#222",
  },
  author: {
    fontSize: 16,
    color: "#333",
  },
  price: {
    fontSize: 20,
    color: "#333",
    textAlign: "right",
  },
  errorMsg: {
    color: "#ee8888",
    fontSize: 20,
    padding: 24,
    textAlign: "center",
  },
});
