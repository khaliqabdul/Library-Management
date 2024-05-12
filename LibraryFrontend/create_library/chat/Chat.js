import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import socketServices from "../../components/utils/socketService";

const Chat = () => {
  const [messages, setMessages] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  useEffect(() => {
    socketServices.on('receive_message', (msg) => {
      let cloneArray = [...data];
      setData(cloneArray.concat(msg))
    });
  }, [data]);

  const sendMessage = () => {
    if (messages) {
      socketServices.emit("send_message", messages);
      setMessages('')
      return;
    }
    alert("plaese enter your message");
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <View style={{ flex: 0.8 }}>
          <TextInput
            placeholder="Enter your Message here"
            style={styles.inputStyle}
            onChangeText={(text) => setMessages(text)}
            value={messages}
          />
        </View>
        <View style={{ flex: 0.2 }}>
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
      {data.map((value, i) => {
       return(
        <Text style={{fontWeight: '600', marginBottom: 8}} key={i}>{value}</Text>
       )  
      })}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    margin: 30,
  },
  inputStyle: {
    borderWidth: 1,
    height: 42,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginRight: 20,
  },
});
