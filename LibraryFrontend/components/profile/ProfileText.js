import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { useLogin } from "../context/LoginProvider";
import { signOut } from "../api/user";

const ProfileText = () => {
  const { setProfile, profile, setLoginPending, setIsLoggedIn, setIsToken } =
    useLogin();
  const { firstName, lastName, email, gender, avatar } = profile;
  
  const userName = `${firstName} ${lastName}`;
  return (
    <>
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
    marginLeft: 20,
  },
  iconArea: {
    width: "20%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  coverImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  textArea: {
    width: "70%",
    color: "white",
    marginLeft: 0,
    fontSize: 16,
    letterSpacing: 1,
  },
  separatorLine: {
    width: "auto",
    height: 0.5,
    marginTop: 10,
    backgroundColor: "#FFFFFF90",
  },
});
