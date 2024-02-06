import {
    FormControl, Pressable,
    Input, 
    InputField, 
    Text, VStack, 
    Heading, InputSlot, InputIcon, EyeIcon, EyeOffIcon, Button, ButtonText, HStack, Center
} from "@gluestack-ui/themed";
import { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from "./Dashboard";

const Stack = createNativeStackNavigator();


function gotoDashboard(){
    return(
        <Stack.Navigator >
          <Stack.Screen name='Dashboard' component={Dashboard}/>
        </Stack.Navigator>
        // console.log(" welcome Dashboard")
    )
}

export default function LoginScreen({navigation}) {
    const [showPassword, setShowpassword] = useState(false)
    const handleState = () => {
        setShowpassword((showState) => {
            return !showState
        })
    }
    return (
        <FormControl
            p="$5"
            // mt={"$5/6"}
            borderWidth="$1"
            borderRadius={"$lg"}
            borderColor="$borderLight300"
            $dark-borderWidth="$1"
            $dark-borderRadius="$lg"
            $dark-borderColor="$borderDark800"
        >
            <VStack space="xl">
                <Heading color="#005DB4" lineHeight="$md">
                    Login
                </Heading>
                <HStack>
                    <Text fontSize="$xs">Don't have account?</Text>
                    <Pressable 
                        onPress={() => navigation.navigate('Register')} 
                        $hover-bg="$primary400"
                    >
                        <Text fontSize="$sm" color="#005DB4" ml="$1">Register Now</Text>
                    </Pressable>
                </HStack>
                <VStack>
                    <Text lineHeight="$xs">
                        Email
                    </Text>
                    <Input>
                        <InputField type="text" />
                    </Input>
                </VStack>
                <VStack space="xs">
                    <HStack>
                        <Text lineHeight="$xs">Password</Text>
                        <Text lineHeight="$xs" fontSize={"$xs"} color="#005DB4" ml={"auto"}>
                            Forget Password?
                        </Text>
                    </HStack>
                    <Input textAlign="center">
                        <InputField type={showPassword ? "text" : "password"} />
                        <InputSlot pr="$4" onPress={handleState}>
                            <InputIcon 
                                as={showPassword ? EyeIcon : EyeOffIcon}
                                color="#005DB4"
                            />
                        </InputSlot>
                    </Input>
                </VStack>
                <VStack mt="$3">
                    <Button onPress={() => navigation.navigate('Dashboard')}>
                        <ButtonText color="$white">Login</ButtonText>
                    </Button>
                </VStack>
                <Center>
                    <HStack alignItems="center">
                        <Text fontSize={"$xs"}>Need help?</Text>
                        <Text fontSize={"$sm"} color="#005DB4" ml={"$1"}>Contact Us</Text>
                    </HStack>
                </Center>
                
            </VStack>
        </FormControl>

    )
}