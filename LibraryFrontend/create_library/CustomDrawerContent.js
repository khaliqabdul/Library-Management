import React, { useState } from "react";
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

function CustomDrawerContent({ navigation, progress, ...rest }) {
  const { setIsLoggedIn, profile, setLoginPending } = useLogin();
  const [menuIndex, setMenuIndex] = useState(-1);

  const { firstName, lastName, email, avatar } = profile;
  // console.log("avatar",avatar)
  const handleSubMenuClick = (subMenu) => {
    navigation.navigate(subMenu.label);
  };

  const picture = "https://images.unsplash.com/photo-1682695794947-17061dc284dd?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
            source={{uri: avatar || picture}}
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
                  <Icon icon={menuIndex == index ? menu.icon2 : menu.icon1} />
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
                            <Icon icon={subMenu.icon} />
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
      <Pressable
        style={{
          position: "absolute",
          bottom: 50,
          right: 0,
          left: 0,
          padding: 20,
          backgroundColor: "#f1f1f1",
        }}
        onPress={async () => {
          setLoginPending(true);
          const isLoggedOut = await signOut();
          if (isLoggedOut) {
            setIsLoggedIn(false);
          }
          setLoginPending(false);
        }}
      >
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
});