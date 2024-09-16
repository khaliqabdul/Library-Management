import { Text, View, Button } from "@gluestack-ui/themed";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions, StyleSheet } from "react-native";

import CustomDrawerContent from "./CustomDrawerContent";
import AddMember from "./members/AddMembers";
import Colors from "../components/Colors";
import ImageUpload from "../components/ImageUpload";
import MembersList from "./members/MembersList";
import Chat from "./chat/Chat";
import BooksList from "./books/BooksList";
import AddBook from "./books/AddBook";
import BookDetail from "./books/BookDetail";
import BookPurchaseHistory from "./books/BookPurchaseHistory"

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Notifications")}
        title="Go to notifications"
      >
        <Text>Welcome in Home Screen</Text>
      </Button>
      {/* <Text>Welcome in Home Screen</Text> */}
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home">
        <Text>Welcome in Notifications</Text>
      </Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function Dashboard() {
  const dimensions = useWindowDimensions();
  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="HomeScreen"
        screenOptions={{
          drawerType: dimensions.width >= 768 ? "permanent" : "front",
          headerShown: true,
          headerTitle: "Library Management System",
          overlayColor: "transparent",
          drawerStyle: styles.drawerStyle,
          drawerActiveBackgroundColor: Colors.red,
          drawerItemStyle: styles.drawerItemStyles,
          drawerActiveTintColor: Colors.yellow,
          drawerLabelStyle: styles.drawerLabelStyles,
        }}
      >
        <Drawer.Screen name="HomeScreen" component={ImageUpload} />
        <Drawer.Screen name="Notifications" component={Chat} />
        <Drawer.Screen name="BooksList" component={BooksList} />
        <Drawer.Screen name="addBook" component={AddBook} />
        <Drawer.Screen name="MemberList" component={MembersList} />
        <Drawer.Screen name="Add Member Screen" component={AddMember} />
        <Drawer.Screen name="bookDetail" component={BookDetail} />
        <Drawer.Screen name="bookPurchase" component={BookPurchaseHistory} />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    width: 240,
  },
  drawerItemStyles: {
    borderRadius: 5,
  },
  drawerLabelStyles: {
    fontSize: 16,
    marginHorizontal: 16,
  },
});
