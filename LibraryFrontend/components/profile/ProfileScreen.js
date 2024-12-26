import { Image, Pressable, StyleSheet, Text } from "react-native";
import { useMedia, View } from "@gluestack-ui/themed";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import client from "../api/client";
import { useLogin } from "../context/LoginProvider";
import ProgressScreen from "../formElements/ProgressScreen";
import ProfileText from "./ProfileText";
import Colors from "../Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  scale,
} from "../styles/responsiveSize";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";

// create a component
export default function ProfileScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState();
  const [progress, setProgress] = useState(0);
  const { isToken, setProfile, profile } = useLogin();
  const { gender, libraryName, libraryAddress, avatar } = profile;

  const maleAvatar = require("../../assets/images/userAvatar.png");
  const femaleAvatar = require("../../assets/images/femaleAvatar.png");

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
  // fonts
  const [loaded] = useFonts({
    raleway_medium: fontFamily.raleway_medium,
    raleway_regular: fontFamily.raleway_regular,
    raleway_bold: fontFamily.raleway_Bold,
    arima_bold: fontFamily.arima_Bold,
  });
  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <View
      style={styles.container}
      width={media.lg ? "$1/3" : "$full"}
      marginRight={"auto"}
      marginLeft={"auto"}
    >
      <View style={styles.editProfile}>
        <Pressable
          onPress={() => {
            navigation.navigate("editProfile", { profile });
          }}
        >
          <Text style={styles.editProfileButton}>Edit Profile</Text>
        </Pressable>
      </View>
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
              <>
                {gender == "Male" ? (
                  <Image
                    source={
                      avatar == "" || avatar == null
                        ? maleAvatar
                        : { uri: avatar }
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Image
                    source={
                      avatar == "" || avatar == null
                        ? femaleAvatar
                        : { uri: avatar }
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </>
            )}
          </Pressable>
        </View>

        {profileImage ? (
          <Text
            onPress={uploadProfileImage}
            style={[
              styles.nameText,
              {
                backgroundColor: "green",
                borderRadius: 8,
                color: Colors.white,
              },
            ]}
          >
            Upload
          </Text>
        ) : (
          <>
            <Text style={styles.nameText}>{libraryName}</Text>
            <Text style={styles.address}>{libraryAddress}</Text>
          </>
        )}
      </View>
      {/* profile text section */}
      <ProfileText />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Charcoal,
  },
  topSection: {
    height: moderateScaleVertical(300),
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: moderateScaleVertical(1),
    borderBlockColor: Colors.white,
    marginBottom: moderateScaleVertical(5),
  },
  picSection: {
    height: moderateScaleVertical(150),
    width: moderateScaleVertical(150),
    borderRadius: moderateScaleVertical(150 / 2),
    borderStyle: "solid",
    borderColor: Colors.gold,
    borderWidth: moderateScaleVertical(4),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  UploadBtnText: {
    textAlign: "center",
    fontSize: textScale(16),

    fontWeight: "bold",
    opacity: scale(0.3),
    color: Colors.white,
  },
  nameText: {
    textAlign: "center",
    padding: moderateScaleVertical(10),
    fontSize: textScale(16),
    fontFamily: "arima_bold",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: moderateScale(2),
    // opacity: 0.5,
    color: Colors.green,
    marginTop: moderateScaleVertical(10),
  },
  address: {
    textAlign: "center",
    color: Colors.green,
    fontSize: textScale(12),
    fontFamily: "raleway_regular",
  },
  editProfile: {
    width: "100%",
    height: moderateScaleVertical(40),
    marginTop: moderateScaleVertical(5),
    justifyContent: "center",
    alignItems: "flex-end",
  },
  editProfileButton: {
    color: Colors.white,
    fontFamily: "arima_bold",
    marginRight: moderateScale(10),
    paddingBottom: moderateScaleVertical(10),
    paddingTop: moderateScaleVertical(10),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScaleVertical(30),
    borderColor: Colors.white,
    borderWidth: moderateScaleVertical(1),
  },
});
