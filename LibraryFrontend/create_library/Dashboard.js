import { Text, View, Button } from "@gluestack-ui/themed";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from 'react-native';

import CustomDrawerContent from "./CustomDrawerContent";

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

  function Feed() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Feed Screen</Text>
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
                }}
            >
                <Drawer.Screen name='HomeScreen' component={HomeScreen} />
                <Drawer.Screen name='Notifications' component={NotificationsScreen}/>
                <Drawer.Screen name='Feed' component={Feed}/>
                <Drawer.Screen name='Article' component={Article}/>
            </Drawer.Navigator>
        </>
    )
}