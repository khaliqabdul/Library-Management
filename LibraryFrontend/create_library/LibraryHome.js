import { Text } from "@gluestack-ui/themed";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import LoginScreen from "./LoginScreen"
import RegisterScreen from "./RegisterScreen";

const Tab = createMaterialTopTabNavigator();

export default function LibraryHome(){
    
    return(
        <Tab.Navigator 
            // tabBar={props => <LoginScreen {...props}/>}
        >
            <Tab.Screen name="Login" component={LoginScreen}/>
            <Tab.Screen name="Register" component={RegisterScreen}/>
        </Tab.Navigator>
    )
}