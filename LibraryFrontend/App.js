import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Center, GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LibraryHome from './create_library/LibraryHome';
import Dashboard from './create_library/Dashboard';
import ExpandableDrawer from './create_library/ExpandableDrawer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <StatusBar backgroundColor='#005DB4' style='auto' />
    <GluestackUIProvider config={config}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={LibraryHome}/>
          <Stack.Screen name='Dashboard' component={Dashboard}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
    </>
  );
}


