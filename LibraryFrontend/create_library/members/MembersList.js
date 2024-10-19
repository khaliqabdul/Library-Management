import { Text, FlatList, StyleSheet, View } from "react-native";
import { Spinner, VStack, useMedia } from "@gluestack-ui/themed";
import { useEffect, useState, useCallback } from "react";
import client from "../../components/api/client";
import { useLogin } from "../../components/context/LoginProvider";
import socketServices from "../../components/utils/socketService";
import UserCard from "../../components/card/UserCard";
import SearchComponent from "../../components/searchComponent/SearchComponent";
import ListEmptyComponent from "../../components/listEmptyComponent/ListEmptyComponent";

const MembersList = ({ navigation }) => {
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { profile, isLoggedin, isToken } = useLogin();

  const registration_id = profile.id;
  const data = {
    libr: { id: registration_id },
  };
  // console.log(memberData)
  const searchTextHandler = (text) => {
    if (text !== "") {
      let tempData = memberData.filter((item) => {
        return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setMemberData(tempData);
    } else {
      fetchData();
    }
  };

  const listEmptyComponent = useCallback(() => {
    return (
      <ListEmptyComponent
        navigation={navigation}
        text="Tap below button to add reader!"
        screen="Add Member Screen"
        buttonTitle="Add Reader"
      />
    );
  }, [memberData]);

  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  useEffect(() => {
    socketServices.emit("join room", registration_id);
    // listen from readerController
    socketServices.on("send_member", (data) => {
      setMemberData(data);  
    });
    socketServices.on("delete_member", (data) => {
      setMemberData(data);
    });
    return () => {
      socketServices.removeListener("send_member");
      socketServices.removeListener("delete_member");
    };
  }, [memberData]);

  async function fetchData() {
    if (isLoggedin) {
      await client
        .post("/getAllReaders", data.libr, {
          headers: {
            "Content-Type": "application/json",
            authorization: `${isToken}`,
          },
        })
        .then((res) => {
          // alert(res.data.message);
          setMemberData(res.data.memberData);
        })
        .catch((err) => {
          console.log("Error", err.message);
          alert(err.message);
          setError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const media = useMedia();

  return (
    <>
      {isLoading || error ? (
        <VStack mt="$5">
          <Text style={styles.errorMsg}>Unable to connect to the server.</Text>
          <Spinner size="large" />
        </VStack>
      ) : (
        <>
          <FlatList
            numColumns={media.lg ? 3 : 1}
            ListHeaderComponent={
              <>
                <SearchComponent
                  headerText="Member's List"
                  searchTextHandler={searchTextHandler}
                />
              </>
            }
            ListEmptyComponent={listEmptyComponent}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{paddingBottom: 150}}
            keyExtractor={(item) => item._id.toString()}
            data={memberData}
            renderItem={({ item }) => (
              <UserCard
                name={item.name}
                gender={item.gender}
                age={item.age}
                phone={item.phone}
                CNIC_No={item.CNIC_No}
                address={item.address}
                id={item._id}
              />
            )}
          />
        </>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  errorMsg: {
    color: "#ee8888",
    fontSize: 20,
    padding: 24,
    textAlign: "center",
  },
});

export default MembersList;
