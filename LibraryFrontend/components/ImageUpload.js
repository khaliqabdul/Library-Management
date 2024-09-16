import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import client from "./api/client";
import { useLogin } from "./context/LoginProvider";
import ProgressScreen from "./formElements/ProgressScreen";
import bgCover from "../assets/images/splash.jpeg"

export default function ImageUpload({ navigation }) {
  const [profileImage, setProfileImage] = useState();
  const [progress, setProgress] = useState(0);
  const { isToken, setProfile } = useLogin();
  
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
      });
      // console.log(image)
      if (!image.canceled) {
        const data = {
          uri: image.assets[0].uri,
          name: new Date() + "_profile",
          type: `image/jpg`,
        };
        setProfileImage(data);
      }
    }
  };

  const uploadProfileImage = async () => {
    const imageData = new FormData();
    imageData.append("profile", profileImage);
    // console.log(profileImage);
    try {
      const res = await client.post("/upload-profile", imageData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          authorization: `${isToken}`,
        },
        withCredentials: false,
        onUploadProgress: ({ loaded, total }) => setProgress(loaded / total),
      });
      // console.log(res.data);
      if (res.data.success == false) {
        alert(res.data.message);
      } else {
        alert(res.data.message);
        setProfile(res.data.user);
        setProfileImage("");
        setProgress(0);
        navigation.openDrawer();
      }
    } catch (error) {
      alert(error.message);
      console.log("err", error.message);
    }
  };

  return (
    <ImageBackground source={bgCover} style={{flex: 1}} resizeMode="cover">
      <View style={styles.container}>
        {progress ? <ProgressScreen process={progress} /> : null}
        <View style={styles.innerContainer}>
          <Pressable
            onPress={openImageLibrary}
            style={styles.uploadBtnContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage.uri }}
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
    </ImageBackground>
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
