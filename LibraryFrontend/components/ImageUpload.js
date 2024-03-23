import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import client from "./api/client";
import { useLogin } from "./context/LoginProvider";

export default function ImageUpload() {
  const [profileImage, setProfileImage] = useState("");
  const { isToken } = useLogin();
  // console.log("profileImage", profileImage)

  const openImageLibrary = async () => {
    const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status } = response;
    if (status !== "granted") {
      alert("Sorry! we need camera rool permissions to make this work!");
    }
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        // quality: 1,
      });
      if (!image.canceled) {
        setProfileImage(image.assets[0].uri);
        // console.log(image.assets[0].uri)
      }
    }
  };
  const uploadProfileImage = async () => {
    const imageData = new FormData();
    imageData.append("profile", {
      name: new Date() + "_profile",
      uri: profileImage,
      type: "image/jpg  ",
    });
    var options = { content: imageData };
    // console.log(options);

    try {
      const res = await client.post("/upload-profile", imageData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          authorization: `${isToken}`,
        },
        onUploadProgress: ({loaded, total}) => console.log(loaded / total)
      });
      console.log("res.data",res.data);
    } catch (error) {
      console.log("err",error.message);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Pressable onPress={openImageLibrary} style={styles.uploadBtnContainer}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Text style={styles.UploadBtnText}>Upload Profile Image</Text>
          )}
        </Pressable>
        <Text style={styles.skipText}>Skip</Text>
        {profileImage ? (
          <Text
            onPress={uploadProfileImage}
            style={[
              styles.skipText,
              { backgroundColor: "green", borderRadius: 8, color: "white" },
            ]}
          >
            Upload
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 125 / 2,
    borderStyle: "dashed",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  UploadBtnText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    opacity: 0.3,
  },
  skipText: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.5,
  },
});
