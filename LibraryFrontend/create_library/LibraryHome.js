import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ImageUpload from '../components/ImageUpload';
import LoginScreen from "./LoginScreen"
import RegisterScreen from "./RegisterScreen";
import Dashboard from "./Dashboard";
import { useLogin } from "../components/context/LoginProvider";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function LibraryHome(){
    const { isLoggedin, isToken } = useLogin();
    
    // console.log(isLoggedin)
    console.log("istoken", isToken)
    return(
        isLoggedin ?
        <Stack.Navigator>
          <Stack.Screen name='Dashboard' component={Dashboard}/>
        </Stack.Navigator>
        :
        <Tab.Navigator>
            <Tab.Screen name="Login" component={LoginScreen}/>
            <Tab.Screen name="Register" component={RegisterScreen}/>
        </Tab.Navigator>
    )
}