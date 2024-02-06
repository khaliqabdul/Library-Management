import { 
    FormControl, 
    Input, InputSlot, InputIcon, EyeIcon, EyeOffIcon,
    InputField, Text, SelectSectionHeaderText
} from "@gluestack-ui/themed";
import { useState } from "react";

export default function FormInput({
    inputLabel, value, state, type, placeholder, focus}){
        
        const [showPassword, setShowpassword] = useState(false)
        const handleState = () => {
            setShowpassword((showState) => {
                return !showState
            })
        }
    return(
        <FormControl>
            <Text fontSize="$xs" mt={"$3"}>{inputLabel}</Text>
            <Input borderColor="$borderLight300" >
                <InputField 
                type={!showPassword ? type : null} 
                placeholder={placeholder} 
                onFocus={focus} 
                value={value}
                onChangeText={(text)=> state(text)}
                />
                {type == "password" ? (
                    <InputSlot pr="$4" onPress={handleState}>
                        <InputIcon 
                            as={showPassword ? EyeIcon : EyeOffIcon}
                            color="#005DB4"
                        />
                    </InputSlot>) : (null)
                }
                
            </Input>
            
        </FormControl>
    )
}