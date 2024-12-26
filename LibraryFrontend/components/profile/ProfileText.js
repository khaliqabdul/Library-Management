import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { useLogin } from "../context/LoginProvider";
import { signOut } from "../api/user";
import Colors from "../Colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  scale,
  height,
} from "../styles/responsiveSize";
import { useFonts } from "expo-font";
import fontFamily from "../styles/fontFamily";
import WrapperComponent from "../WrapperComponent";

// create a component
const ProfileText = () => {
  const { setProfile, profile, setLoginPending, setIsLoggedIn, setIsToken } =
    useLogin();
  const { firstName, lastName, email, gender, avatar } = profile;

  const userName = `${firstName} ${lastName}`;
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
    <>
      <WrapperComponent containerStyle={{ backgroundColor: Colors.Charcoal }}>
        {/* user name */}
        <View style={styles.profileSection}>
          <View style={styles.row}>
            {gender === "Female" ? (
              <>
                <View style={styles.iconArea}>
                  <Image
                    source={require("../../assets/images/femaleAvatar.png")}
                    style={styles.coverImage}
                  />
                </View>
                <Text style={styles.textArea}>{userName}</Text>
              </>
            ) : (
              <>
                <View style={styles.iconArea}>
                  <Image
                    source={require("../../assets/images/userAvatar.png")}
                    style={styles.coverImage}
                  />
                </View>
                <Text style={styles.textArea}>{userName}</Text>
              </>
            )}
          </View>
          <View style={styles.separatorLine}></View>
        </View>
        {/* email */}
        <View style={styles.profileSection}>
          <View style={styles.row}>
            <View style={styles.iconArea}>
              <Image
                source={require("../../assets/images/email.png")}
                style={styles.coverImage}
              />
            </View>
            <Text style={styles.textArea}>{email}</Text>
          </View>
          <View style={styles.separatorLine}></View>
        </View>
        {/* logout */}
        <View style={styles.profileSection}>
          <View style={styles.row}>
            <View style={styles.iconArea}>
              <Image
                source={require("../../assets/images/Logout.jpg")}
                style={styles.coverImage}
              />
            </View>
            <Pressable
              style={styles.textArea}
              onPress={async () => {
                setLoginPending(true);
                const isLoggedOut = await signOut();
                if (isLoggedOut) {
                  setIsLoggedIn(false);
                  setProfile({});
                  setIsToken("");
                }
                setLoginPending(false);
              }}
            >
              <Text style={styles.textArea}>Log out</Text>
            </Pressable>
          </View>
          <View style={styles.separatorLine}></View>
        </View>
      </WrapperComponent>
    </>
  );
};

export default ProfileText;

const styles = StyleSheet.create({
  profileSection: {
    // backgroundColor: "red",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: moderateScale(10),
  },
  iconArea: {
    width: "20%",
    height: moderateScaleVertical(50),
    alignItems: "center",
    justifyContent: "center",
  },
  coverImage: {
    width: moderateScaleVertical(40),
    height: moderateScaleVertical(40),
    borderRadius: scale(100),
  },
  textArea: {
    width: "70%",
    color: Colors.white,
    marginLeft: 0,
    fontSize: textScale(16),
    fontFamily: "raleway_regular",
    letterSpacing: moderateScale(1.5),
  },
  separatorLine: {
    width: "auto",
    height: moderateScaleVertical(0.5),
    marginTop: moderateScaleVertical(10),
    backgroundColor: Colors.white,
  },
});
