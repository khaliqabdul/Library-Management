import { Text, View, Button } from "@gluestack-ui/themed";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions, StyleSheet } from 'react-native';

import CustomDrawerContent from "./CustomDrawerContent";
import AddReader from "../components/AddReader";
import Colors from "../components/Colors";
import ImageUpload from '../components/ImageUpload';


function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => navigation.navigate('Notifications')}
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home">
        <Text>Welcome in Notifications</Text>
        </Button>
      </View>
    );
  }

function Article() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Article Screen</Text>
        </View>
    );
}

const Drawer = createDrawerNavigator();

export default function Dashboard() {
    const dimensions = useWindowDimensions();
    return (
        <>
           <Drawer.Navigator
                drawerContent={props => <CustomDrawerContent {...props} />}
                initialRouteName='HomeScreen'
                screenOptions={{
                    drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                    headerShown: true,
                    headerTitle: '',
                    overlayColor: 'transparent',
                    drawerStyle: styles.drawerStyle,
                    drawerActiveBackgroundColor: Colors.red,
                    drawerItemStyle: styles.drawerItemStyles,
                    drawerActiveTintColor: Colors.yellow,
                    drawerLabelStyle: styles.drawerLabelStyles,
                }}
            >
                <Drawer.Screen name='HomeScreen' component={ImageUpload} />
                <Drawer.Screen name='Notifications' component={NotificationsScreen}/>
                <Drawer.Screen name='Add Reader Screen' component={AddReader}/>
                <Drawer.Screen name='Article' component={Article}/>
            </Drawer.Navigator>
        </>
    )
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
})