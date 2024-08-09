import { Text, FlatList, StyleSheet, TextInput } from "react-native";
import { Spinner, VStack, useMedia, View } from "@gluestack-ui/themed";
import { useEffect, useRef, useState } from "react";
import client from "../../components/api/client";
import { useLogin } from "../../components/context/LoginProvider";
import socketServices from "../../components/utils/socketService";
import UserCard from "../../components/card/UserCard";
import FormInput from "../../components/loginSignup/FormInput";
import Icon from "../../components/Icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const MembersList = () => {
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchRef = useRef();
  const { profile, isLoggedin } = useLogin();
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

  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  useEffect(() => {
    // listen from readerController
    socketServices.on("send_member", (data) => {
      setMemberData(data);
    });
    socketServices.on("delete_member", (data) => {
      setMemberData(data);
    });
  }, [memberData]);

  async function fetchData() {
    if (isLoggedin) {
      await client
        .post("/getAllReaders", data.libr, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setMemberData(res.data.memberData);
        })
        .catch((err) => {
          console.log("Error", err.message);
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
                {/* header */}
                <Text style={styles.headerText}>Member's List</Text>
                {/* search box */}
                <View style={styles.inputContainer}>
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
                {/* <CustomMenu/> */}
              </>
            }
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
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 20,
    letterSpacing: 1,
  },
  errorMsg: {
    color: "#ee8888",
    fontSize: 20,
    padding: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 5,
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

export default MembersList;
