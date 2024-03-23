import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Center, GluestackUIProvider, Text } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LibraryHome from "./create_library/LibraryHome";
import LoginProvider from "./components/context/LoginProvider";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#005DB4" style="auto" />
      <GluestackUIProvider config={config}>
        <LoginProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name="Home" component={LibraryHome}/>
            </Stack.Navigator>
          </NavigationContainer>
        </LoginProvider>
      </GluestackUIProvider>
    </>
  );
}
