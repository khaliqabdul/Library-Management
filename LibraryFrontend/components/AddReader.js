import { useState } from 'react';
import {
    FormControl, Input, InputField, Textarea, TextareaInput, View,
    VStack, Button, ButtonText, Spinner, ScrollView, useMedia,
} from '@gluestack-ui/themed';
import appSettings from './appSettings';
import axios from 'axios';


export default function AddReader() {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState();
    const [age, setAge] = useState();
    const [gender, setGender] = useState();

    const media = useMedia();

    function resetForm() {
        setName('');
        setAge('');
        setGender('');
    }

    function sendRequestToAddNewReader() {
        setIsLoading(true);
        const data = {
            reader: { name, age, gender, isBlackListed: false }
        };
        console.log(data.reader)
        axios
            .post(`${appSettings.BACKEND_SERVER_HOST}/reader`, data)
            .then((res) => {
                resetForm();
                // Toast.show("Reader added successfully")
            })
            .catch((err) => {
                console.log('Error', err);
                // Toast.show("Unable to add new Reader")
            })
            .finally(() => {
                setIsLoading(false)
            })
    };

    return (
        <ScrollView>
            <View
                bg="#f8f9fe" 
                width={media.lg ? "$1/3" : "$full"}
                mx="$auto"
                mt="$5"
            >
            <FormControl
                p="$4"
                borderWidth="$1"
                borderRadius="$lg"
                borderColor="$borderLight300"
                $dark-borderWidth="$1"
                $dark-borderRadius="$lg"
                $dark-borderColor="$borderDark800"
                // alignItems='center'
                // w="100%"
            >
                <VStack space='lg'>
                    <Input size='lg'>
                        <InputField
                            type='text'
                            placeholder="Name"
                            onChangeText={(updatedText) => { setName(updatedText) }}
                            value={name}
                        />
                    </Input>
                    <Input size='lg'>
                        <InputField
                            placeholder="Age"
                            onChangeText={(updatedText) => { setAge(updatedText) }}
                            value={age}
                        />
                    </Input>
                    <Input size='lg'>
                        <InputField
                            placeholder="Gender"
                            onChangeText={(updatedText) => { setGender(updatedText) }}
                            value={gender}
                        />
                    </Input>
                    <Textarea>
                        <TextareaInput placeholder="Address..." />
                    </Textarea>
                </VStack>
                {
                    isLoading ? (
                        <VStack mt="$5">
                            <Spinner size='large' />
                        </VStack>
                    ) :
                        (
                            <VStack mt="$5">
                                <Button onPress={sendRequestToAddNewReader}>
                                    <ButtonText color="$white">Save Reader</ButtonText>
                                </Button>
                            </VStack>
                        )
                }
            </FormControl>
            </View>
        </ScrollView>
    )
}