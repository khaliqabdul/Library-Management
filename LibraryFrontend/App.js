import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LibraryHome from "./create_library/LibraryHome";
import ResetPassword from "./components/passwordScreens/ResetPassword";
import ForgetPassword from "./components/passwordScreens/ForgetPassword";
import OtpVerification from "./components/passwordScreens/OtpVerification";
import LoginProvider from "./components/context/LoginProvider";
import React from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#005DB4" style="auto" />
      <GluestackUIProvider config={config}>
        <LoginProvider>
          <NavigationContainer
            theme={{
              ...DefaultTheme,
              colors: { ...DefaultTheme.colors, background: "#fff" },
            }}
          >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="LMS Home" component={LibraryHome} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
              <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
              <Stack.Screen name="VerifyEmail" component={OtpVerification} />
            </Stack.Navigator>
          </NavigationContainer>
        </LoginProvider>
      </GluestackUIProvider>
    </>
  );
}
