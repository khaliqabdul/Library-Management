import { Text, FlatList, StyleSheet } from "react-native";
import { Spinner, VStack, useMedia, View } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import client from "../../components/api/client";
import { useLogin } from "../../components/context/LoginProvider";
import socketServices from "../../components/utils/socketService";
import Card from "../../components/card/Card";

const MembersList = () => {
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { profile, isLoggedin } = useLogin();
  const registration_id = profile.id;
  const data = {
    libr: { id: registration_id },
  };
  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  useEffect(() => {
    socketServices.on("send_member", (data) => {
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
    <View
      width={media.lg ? "$1/3" : "$full"}
      marginRight={"auto"}
      marginLeft={"auto"}
    >
      {isLoading || error ? (
        <VStack mt="$5">
          <Text style={styles.errorMsg}>Unable to connect to the server.</Text>
          <Spinner size="large" />
        </VStack>
      ) : (
        <FlatList
          keyExtractor={(item) => item._id.toString()}
          data={memberData}
          renderItem={({ item }) => (
            <Card>
              <View>
                <Text style={styles.textStyle}>{item.name}</Text>
                <Text>{item.age} Years</Text>
              </View>
              <View
                style={{
                  borderTopWidth: 0.1,
                  borderTopColor: "green",
                  marginTop: 10,
                }}
              >
                <Text style={{ fontSize: 16, paddingTop: 8, color: "#444444" }}>
                  {item.address}
                </Text>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "lightgreen",
    padding: 20,
    margin: 8,
    borderRadius: 4,
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    letterSpacing: 1,
  },
  errorMsg: {
    color: "#ee8888",
    fontSize: 20,
    padding: 24,
    textAlign: "center",
  },
});

export default MembersList;
