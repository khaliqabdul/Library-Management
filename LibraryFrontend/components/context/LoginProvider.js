import React, { createContext, useContext, useState, useEffect } from "react";
const LoginContext = createContext();
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginProvider = ({children}) => {
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState({});
    const [isToken, setIsToken] = useState(null)
    
    useEffect(() => {
        (async () => {
          try {
            const token = await AsyncStorage.getItem('token')
            setIsToken(token)
          // const removetoken = await AsyncStorage.removeItem('token')
          // console.log("removetoken", removetoken)
          } catch (err) {
            console.error(err);
          }
        })();
      }, []);
    return(
        <LoginContext.Provider value={{isLoggedin, setIsLoggedIn, isToken, profile, setProfile}}>
            {children}
        </LoginContext.Provider>
    )
};

export const useLogin = () => useContext(LoginContext)
// 
export default LoginProvider