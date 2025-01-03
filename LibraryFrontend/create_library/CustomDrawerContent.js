import React, { useState, useEffect } from "react";
import { Box, View, Pressable, HStack } from "@gluestack-ui/themed";
import { LayoutAnimation, StyleSheet, Image, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { drawerMenu } from "../components/Constants";
import Colors from "../components/Colors";
import Icon from "../components/Icons";
import { useLogin } from "../components/context/LoginProvider";
import { signOut } from "../components/api/user";
import socketServices from "../components/utils/socketService";

function CustomDrawerContent({ navigation, progress, ...rest }) {
  const { setIsLoggedIn, profile, setProfile, setLoginPending, setIsToken } =
    useLogin();
  const [menuIndex, setMenuIndex] = useState(-1);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const { id } = profile;

  const { firstName, lastName, email, avatar } = updatedProfile;
  // console.log("avatar",avatar)
  const handleSubMenuClick = (subMenu) => {
    navigation.navigate(subMenu.label, { profile });
  };
  // logout handler
  const logout = async () => {
    setLoginPending(true);
    const isLoggedOut = await signOut();
    if (isLoggedOut) {
      setIsLoggedIn(false);
      setProfile({});
      setIsToken("");
    }
    setLoginPending(false);
  };
  // contactUs handler
  const openContactUs = () => {
    navigation.navigate("contact");
  };

  const picture =
    "https://images.unsplash.com/photo-1682695794947-17061dc284dd?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    socketServices.iniliazeSocket();
  }, []);

  useEffect(() => {
    socketServices.emit("join room", id);
    socketServices.on("send_profile", (data) => {
      setUpdatedProfile(data);
    });

    return () => {
      socketServices.removeListener("send_profile");
    };
  }, [updatedProfile]);

  useEffect(() => {
    setUpdatedProfile(profile);
  }, [profile]);

  return (
    <>
      <DrawerContentScrollView {...rest}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            backgroundColor: "#f0f0f0",
            marginBottom: 20,
          }}
        >
          <View style={{ width: 150 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {firstName + " " + lastName}
            </Text>
            <Text style={{ fontSize: 10 }}>{email}</Text>
          </View>
          <Image
            source={{ uri: avatar || picture }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        </View>
        {/* Drawer menu with subMenu Section */}
        {drawerMenu.map((menu, index) => {
          return (
            <Pressable
              $active-bg={Colors.transparant}
              $hover-bg={Colors.transparant}
              key={index}
              style={[styles.menu]}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(200, "easeInEaseOut", "opacity")
                );
                setMenuIndex(menuIndex === index ? -1 : index);
              }}
            >
              <Box style={styles.menu}>
                <HStack>
                  <View style={{ alignSelf: "center" }}>
                    <Icon icon={menuIndex == index ? menu.icon2 : menu.icon1} />
                  </View>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: menuIndex === index ? Colors.black : Colors.gray,
                      },
                    ]}
                  >
                    {menu.title}
                  </Text>
                </HStack>
              </Box>
              {menuIndex == index && (
                <View style={styles.subMenuArea}>
                  {menu.menuList.map((subMenu, subIndex) => {
                    return (
                      <Pressable
                        $active-bg={Colors.transparant}
                        $hover-bg={Colors.white}
                        key={subIndex}
                        onPress={() => handleSubMenuClick(subMenu)}
                      >
                        <Box style={styles.subMenuItem}>
                          <HStack>
                            <View style={{ alignSelf: "center" }}>
                              <Icon icon={subMenu.icon} />
                            </View>
                            <Text style={[styles.text]}>{subMenu.title}</Text>
                          </HStack>
                        </Box>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </Pressable>
          );
        })}
      </DrawerContentScrollView>
      {/* Footer Section */}
      <Pressable style={styles.contactContainer} onPress={openContactUs}>
        <Text style={{ fontSize: 16, fontWeight: "400", color: Colors.gray }}>
          Contact Us
        </Text>
      </Pressable>
      <Pressable style={styles.logoutContainer} onPress={logout}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Log out</Text>
      </Pressable>
    </>
  );
}
export default CustomDrawerContent;

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 16 / 1.5,
    paddingVertical: 16 / 2,
  },
  text: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  subMenuArea: {
    borderRadius: 16,
    backgroundColor: Colors.transparant,
  },
  subMenuItem: {
    marginLeft: 16 / 0.5,
    paddingVertical: 10,
  },
  logoutContainer: {
    position: "absolute",
    bottom: 20,
    right: 0,
    left: 0,
    paddingLeft: 20,
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
  },
  contactContainer: {
    position: "absolute",
    bottom: 65,
    right: 0,
    left: 0,
    borderBottomColor: Colors.green,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
  },
});
