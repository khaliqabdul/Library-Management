import React, { createContext, useContext, useState, useEffect } from "react";
const LoginContext = createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

const LoginProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [isToken, setIsToken] = useState(null);
  const [loginPending, setLoginPending] = useState(false);

  const fetchUser = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    if (token !== null) {
      const res = await client.get("/profile", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.data.success) {
        setProfile(res.data.profile);
        setIsToken(token)
        setIsLoggedIn(true);
      } else {
        setProfile({});
        setIsLoggedIn(false);
      }
      setLoginPending(false);
    } else {
      setProfile({});
      setIsLoggedIn(false);
    }
    setLoginPending(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <LoginContext.Provider
      value={{
        isLoggedin,
        setIsLoggedIn,
        isToken,
        profile,
        setProfile,
        loginPending,
        setLoginPending,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
//
export default LoginProvider;