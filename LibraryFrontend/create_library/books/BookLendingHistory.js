import { StyleSheet, Text, View, FlatList } from "react-native";
import React, {useEffect, useState} from "react";
import Colors from "../../components/Colors";
import { useLogin } from "../../components/context/LoginProvider";
import socketServices from "../../components/utils/socketService";

const BookLendingHistory = () => {
  const { bookData, profile } = useLogin();
  const [bookLendingHistory, setBookLendingHistory] = useState()
  const { lendingHistory } = bookData;
  
  const registration_id = profile.id;

  useEffect(() => {
    socketServices.iniliazeSocket();
    setBookLendingHistory(lendingHistory)
  }, [lendingHistory]);

  useEffect(() => {
    socketServices.emit("join room", registration_id)
    // listen from bookController
    socketServices.on("sendTo_bookDetail", (data) => {
      setBookLendingHistory(data)
    });
  }, [lendingHistory]);
  
  return (
    <View style={styles.wrapper}>
      {/* Table Conrainer */}
      <View style={styles.table}>
        {/* table head */}
        <View style={styles.table_head}>
          {/* table heading row */}
          <View style={{ width: "40%" }}>
            <Text style={styles.table_caption}>Lender</Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={styles.table_caption}>IssueDate</Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={styles.table_caption}>ReturnDate</Text>
          </View>
        </View>
        {/* table body */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={bookLendingHistory}
          // keyExtractor={(item) => item._id.toString()}
          listKey={(item, index) => "D" + index.toString()}
          renderItem={({ item, index }) => {
            const isoLendedOnDate = item.lendedOn;
            const isoReturnedOnDate = item.returnedOn;
            let lendedOn = new Date(isoLendedOnDate).toLocaleDateString(
              "en-GB"
            );
            let returnedOn = new Date(isoReturnedOnDate).toLocaleDateString(
              "en-GB"
            );
            
            return (
              <>
                <View style={styles.table_body}>
                  {/* table body row */}
                  <View style={{ width: "40%" }}>
                    <Text style={styles.table_data}>{item.lendedByName}</Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text style={styles.table_data}>{lendedOn}</Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text style={styles.table_data}>{returnedOn == "Invalid Date" ? "issued" : returnedOn}</Text>
                  </View>
                </View>
              </>
            );
          }}
        />
      </View>
    </View>
  );
};

export default BookLendingHistory;

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  table: {
    marginVertical: 10,
  },
  table_head: {
    flexDirection: "row",
    backgroundColor: Colors.blue,
    padding: 10,
  },
  table_caption: {
    color: "#fff",
    fontWeight: "bold",
  },
  table_body: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  table_data: {
    fontSize: 12,
  },
});
