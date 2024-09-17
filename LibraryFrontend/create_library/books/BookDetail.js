import { StyleSheet, Text, Image, FlatList } from "react-native";
import { useMedia } from "@gluestack-style/react";
import { View, VStack, Spinner } from "@gluestack-ui/themed";
import React, { useState, useEffect } from "react";
import { useLogin } from "../../components/context/LoginProvider";
import Colors from "../../components/Colors";
import Icon from "../../components/Icons";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import AutoCompleteInput from "../../components/formElements/AutoCompleteInput";
import client from "../../components/api/client";
import FormSubmitButton from "../../components/formElements/FormSubmitButton";
import BookLendingHistory from "./BookLendingHistory";

const BookDetail = ({ navigation }) => {
  const { bookData, profile, isLoggedin, isToken } = useLogin();
  const [readers, setReaders] = useState([]); // total readers list
  const [autocompleteQuery, setQuery] = useState(""); // queried words
  const [filteredReader, setFilteredReader] = useState([]); // filtered list
  const [selectedReader, setSelectedReader] = useState(null); // selected reader
  const [loading, setLoading] = useState(false);
  const [currentLender, setCurrentLender] = useState(null);

  const registration_id = profile.id;
  const data = {
    reg_id: { id: registration_id },
  };
  const { lendingHistory } = bookData;
  // console.log(readers)
  const NoOfTimeIssued = lendingHistory.length;

  // fetch all readers
  async function fetchReaderData() {
    if (isLoggedin) {
      await client
        .post("/getAllReaders", data.reg_id, {
          headers: {
            "Content-Type": "application/json",
            authorization: `${isToken}`
          },
        })
        .then((res) => {
          setReaders(res.data.memberData);
        })
        .catch((err) => {
          console.log("Error", err.message);
          setError(true);
        })
        .finally(() => {
          // setIsLoading(false);
        });
    }
  }

  useEffect(() => {
    const xyz = getCurrentLender(lendingHistory);
    setCurrentLender(xyz);
    fetchReaderData();
  }, [lendingHistory]);

  useEffect(() => {
    if (readers.length) {
      const matchingReaders = readers.filter((reader) => {
        let regexp = new RegExp(autocompleteQuery, "ig");
        if (autocompleteQuery && reader.name.match(regexp)) {
          return true;
        }
        return false;
      });
      // filteredReader is state variable
      setFilteredReader(matchingReaders);
    }
  }, [autocompleteQuery]);
  // lend book request
  const setAsLended = async () => {
    const data = {
      bookId: bookData._id,
      lenderId: selectedReader._id,
      lenderName: selectedReader.name,
      reg_id: registration_id,
    };

    if (isLoggedin && autocompleteQuery) {
      setLoading(true);
      await client
        .post("/lendBook", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          alert(res.data.message);
          setCurrentLender({
            lendedById: selectedReader._id,
            lendedByName: selectedReader.name,
          });
        })
        .catch((err) => {
          console.log("unable to lend the book", err.message);
          alert("unable to lend the book", err.message);
        })
        .finally(() => {
          setSelectedReader("");
          setQuery("");
          setLoading(false);
        });
    } else {
      alert("Empty Field");
    }
  };
  // return book request
  const setAsReturned = async () => {
    const data = {
      bookId: bookData._id,
      lenderId: currentLender.lendedById,
      reg_id: registration_id,
    };
    if (isLoggedin) {
      setLoading(true);
      await client
        .post("/returnBook", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          console.log("unable to return the book", err.message);
          alert("unable to return the book", err.message);
        })
        .finally(() => {
          setLoading(false);
          setCurrentLender(null);
        });
    }
  };

  const getCurrentLender = (history) => {
    let currentLender = null;
    history.forEach((element) => {
      if (!element.returnedOn) {
        currentLender = {
          lendedById: element.lendedById,
          lendedByName: element.lendedByName,
        };
      }
    });
    return currentLender;
  };

  const media = useMedia();
  return (
    <View style={styles.item} width={media.lg ? "$1/3" : "$full"}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[1, 1]}
        renderItem={({ item, index }) => {
          return (
            <View style={{ width: "100%" }}>
              {/* Flatlist 1st list */}
              {index == 0 && (
                <View>
                  <Text
                    style={{ fontSize: 20, fontWeight: "600" }}
                    onPress={() => navigation.navigate("BooksList")}
                  >
                    <Icon icon={faBackward} /> Go back
                  </Text>
                  <View style={styles.imageTitleContainer}>
                    <View style={styles.titleWrapper}>
                      <Text style={styles.title}>{bookData.bookTitle}</Text>
                    </View>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: bookData.image }}
                        style={styles.image}
                      />
                    </View>
                  </View>
                  {/* Genre & Author Part */}
                  <View style={styles.contentWrapper}>
                    <Text>Genre: {bookData.genre}</Text>
                    <Text>Author: {bookData.author}</Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: Colors.menu1,
                      }}
                    >
                      {`No. of time issued: 0${NoOfTimeIssued}`}
                    </Text>
                    {/* Price & status row */}
                    <View style={styles.priceContainer}>
                      <View style={{ width: "40%" }}>
                        <Text>Price</Text>
                        <Text style={styles.price}>Rs.{bookData.price}</Text>
                      </View>
                      <View style={{ width: "60%" }}>
                        {currentLender ? (
                          <>
                            <Text style={{ textAlign: "right" }}>Status:</Text>
                            <Text style={styles.status}>Issued</Text>
                          </>
                        ) : (
                          <>
                            <Text style={{ textAlign: "right" }}>Status:</Text>
                            <Text style={styles.status}>Available</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                  {/* Book Detail */}
                  <Text style={styles.currentLender}>Book Detail</Text>
                  <Text style={styles.detailText}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </Text>
                  {currentLender ? (
                    <>
                      <Text style={styles.currentLender}>
                        Currently Lended to: {currentLender.lendedByName}
                      </Text>
                      <FormSubmitButton
                        title={"Return Book"}
                        onPress={() => setAsReturned()}
                      />
                    </>
                  ) : (
                    <>
                      <VStack mt="$3">
                        <Text style={styles.currentLender}>
                          Search Reader to Lend Book
                        </Text>
                        <AutoCompleteInput
                          readers={readers}
                          setQuery={setQuery}
                          autocompleteQuery={autocompleteQuery}
                          filteredReader={filteredReader}
                          setFilteredReader={setFilteredReader}
                          selectedReader={selectedReader}
                          setSelectedReader={setSelectedReader}
                        />
                      </VStack>
                      {selectedReader && (
                        <VStack mt="$5">
                          {loading ? (
                            <Spinner
                              size="small"
                              color="red"
                              style={{ marginBottom: 10 }}
                            />
                          ) : null}
                          <FormSubmitButton
                            title={"Lend Book"}
                            onPress={() => setAsLended()}
                          />
                        </VStack>
                      )}
                    </>
                  )}
                </View>
              )}
              {/* Flatlist 2nd list */}
              {index === 1 && (
                <>
                  <Text style={styles.currentLender}>Book Lending History</Text>
                  <BookLendingHistory />
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default BookDetail;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    // height: 500,
    // flexDirection: "column",
    // flexWrap: 'wrap',
    // alignItems: 'center',
    alignSelf: "center",
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
  imageTitleContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  titleWrapper: {
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "40%",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 10,
    borderColor: "green",
    borderWidth: 2,
  },
  contentWrapper: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    color: Colors.menu1,
    fontWeight: "800",
    textAlign: "left",
  },
  priceContainer: {
    flexDirection: "row",
    marginVertical: 15,
    backgroundColor: Colors.white,
  },
  price: {
    fontSize: 24,
    color: Colors.gray,
    textAlign: "left",
  },
  status: {
    fontSize: 20,
    color: Colors.blue,
    textAlign: "right",
  },
  detailText: {
    fontSize: 15,
    textAlign: "justify",
    letterSpacing: 1,
    lineHeight: 20,
    color: Colors.Charcoal,
  },
  currentLender: {
    textAlign: "left",
    fontWeight: "700",
    marginVertical: 10,
  },
});
