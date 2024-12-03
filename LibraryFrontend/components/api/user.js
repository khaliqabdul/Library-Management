import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";

const catchError = (error) => {
  if (error?.response?.data) {
    return error.response.data;
  }
  return { success: false, error: error.message };
};

// signUp method
export async function signUp({ ...userInfo }) {
  try {
    const signUpResponse = await client.post("/signup", { ...userInfo });
    // const { success, message, token } = signUpResponse.data;
    return signUpResponse;
  } catch (error) {
    return catchError(error);
  }
}

// signin method
export const signIn = async (email, password) => {
  try {
    const signInResponse = await client.post("/signin", {
      email,
      password,
    });
    const { success, token } = signInResponse.data;
    if (!success) {
      return signInResponse;
    } else {
      await AsyncStorage.setItem("token", token);
      return signInResponse;
    }
  } catch (error) {
    return catchError(error);
  }
};

// signout method
export const signOut = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token !== null) {
      const res = await client.post("/signout", null, {
        headers: {
          Accept: "application/json, text/plain, */*",
          authorization: `${token}`,
        },
      });
      if (res.data.success) {
        alert(res.data.message);
        await AsyncStorage.removeItem("token");
        return true;
      }
    }
    return false;
  } catch (error) {
    return catchError(error);
  }
};
