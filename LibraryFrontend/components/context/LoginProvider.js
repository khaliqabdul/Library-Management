import React, { createContext, useContext, useState, useEffect } from "react";
const LoginContext = createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
// import socketServices from "../utils/socketService";

const LoginProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [isToken, setIsToken] = useState(null);
  const [loginPending, setLoginPending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [memberData, setMemberData] = useState({})
  const [dropdownSelectedItem, setDropdownSelectedItem] = useState("Select")
  const [dateOfBirth, setDateOfBirth] = useState();
  
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
        showModal,
        setShowModal,
        showDateModal,
        setShowDateModal,
        showAlert,
        setShowAlert,
        memberData,
        setMemberData,
        dropdownSelectedItem,
        setDropdownSelectedItem,
        dateOfBirth,
        setDateOfBirth,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
//
export default LoginProvider;