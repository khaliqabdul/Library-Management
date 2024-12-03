import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import Dashboard from "./Dashboard";

import { useLogin } from "../components/context/LoginProvider";
import LoadingScreen from "../components/formElements/LoadingScreen";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function LibraryHome() {
  const { isLoggedin, loginPending } = useLogin();

  return isLoggedin ? (
    <>
      {loginPending ? <LoadingScreen /> : null}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </>
  ) : (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: "0%" },
        tabBarIndicatorStyle: { left: "100%" },
      }}
    >
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
    </Tab.Navigator>
  );
}
