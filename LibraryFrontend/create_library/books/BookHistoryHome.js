import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookLendingHistory from "./BookLendingHistory";
import BookPurchaseHistory from "./BookPurchaseHistory";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const BookHistoryHome = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Lending History" component={BookLendingHistory} />
      <Tab.Screen name="Purchase History" component={BookPurchaseHistory} />
    </Tab.Navigator>
  );
};

export default BookHistoryHome;
