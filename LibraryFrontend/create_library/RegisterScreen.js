import { 
    FormControl, ScrollView, VStack, Button, ButtonText, Text,
    FormControlLabel, FormControlLabelText } from "@gluestack-ui/themed";
import { useState, useEffect } from "react";
import axios from 'axios';

import FormInput from "../components/FormInput";

export default function RegisterScreen(){
    const [firstName, setFirstName] = useState("");

    const sendCredentials = ()=>{
        fetchApi()
    }
    const fetchApi = async () => {
        try {
            const res = await axios.get('http://192.168.1.4:3000/');
            console.log(res.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        fetchApi()
    }, [])
    return(
        <ScrollView>
            <FormControl
                p="$5"
                // bg="$blue"
                borderWidth="$1"
                borderRadius={"$lg"}
                borderColor="$borderLight300"
                $dark-borderWidth="$1"
                $dark-borderRadius="$lg"
                $dark-borderColor="$borderDark800"
            >
                <FormControlLabel>
                    <FormControlLabelText color="#005DB4" fontSize={"$lg"} fontWeight="$bold" mb={"$2"}>
                        Register
                    </FormControlLabelText>
                </FormControlLabel>
                <Text fontSize="$md">Create New Account</Text>
                <FormInput 
                    inputLabel={"First Name"} 
                    type={"text"} 
                    placeholder={"First Name"} 
                    focus={null} 
                    value={firstName} 
                    state={setFirstName}
                />

                <FormInput 
                inputLabel={"Last Name"} 
                type={"text"} 
                placeholder={"Last Name"} 
                focus={null}
                />

                <FormInput 
                inputLabel={"Email"} 
                type={"text"} 
                placeholder={"Email"} 
                focus={null}
                />

                <FormInput 
                inputLabel={"Password"} 
                type={"password"} 
                placeholder={"Password"} 
                focus={null}
                />

                <FormInput 
                inputLabel={"Confirm Password"} 
                type={"password"} 
                placeholder={"Confirm Password"} 
                focus={null}
                />
                <VStack mt="$6">
                    <Button onPress={()=>sendCredentials()}>
                        <ButtonText color="$white">Register</ButtonText>
                    </Button>
                </VStack>
            </FormControl>
        </ScrollView>
    )
}