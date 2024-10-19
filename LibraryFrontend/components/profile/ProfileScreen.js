import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  // View,
  ImageBackground,
} from "react-native";
import { useMedia, View } from "@gluestack-ui/themed";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import client from "../api/client";
import { useLogin } from "../context/LoginProvider";
import ProgressScreen from "../formElements/ProgressScreen";
import bgCover from "../../assets/images/splash.jpeg";
import ProfileText from "./ProfileText";
import RoundImage from "./RoundImage";

export default function ProfileScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState();
  const [progress, setProgress] = useState(0);
  const { isToken, setProfile, profile } = useLogin();
  const { firstName, lastName, libraryName, avatar } = profile;
  const userName = `${firstName} ${lastName}`;
  const image = require("../../assets/images/userAvatar.png");

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
  const media = useMedia();
  return (
    <ImageBackground style={{ flex: 1 }} resizeMode="cover">
      <View
        style={styles.container}
        width={media.lg ? "$1/3" : "$full"}
        marginRight={"auto"}
        marginLeft={"auto"}
      >
        <View style={styles.editProfile}>
          <Text style={styles.editProfileButton}>Edit Profile</Text>
        </View>

        {/* <RoundImage/> */}

        {/* prfile image section */}
        <View style={styles.topSection}>
          {progress ? <ProgressScreen process={progress} /> : null}
          <View style={styles.picSection}>
            <Pressable onPress={openImageLibrary} style={styles.picSection}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage.uri }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Image
                  source={avatar == null ? image : { uri: avatar }}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </Pressable>
          </View>
          <Text style={styles.nameText}>{libraryName}</Text>
          {profileImage ? (
            <Text
              onPress={uploadProfileImage}
              style={[
                styles.nameText,
                { backgroundColor: "green", borderRadius: 8, color: "white" },
              ]}
            >
              Upload
            </Text>
          ) : null}
        </View>
        {/* profile text section */}
        <ProfileText />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  topSection: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  picSection: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    borderStyle: "solid",
    borderColor: "#FFBB3B",
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  UploadBtnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.3,
    color: "white",
  },
  nameText: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    // opacity: 0.5,
    color: "white",
    marginTop: 10,
  },
  editProfile: {
    width: "100%",
    height: 40,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  editProfileButton: {
    color: "white",
    marginRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 1,
  },
});
