import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet } from "react-native";


const Icon = ({icon, color}) => {
    return(
        <FontAwesomeIcon style={{color: color}} icon={icon}/>
    )
}
export default Icon