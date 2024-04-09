import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";


// signUp method
export async function signUp({ ...userInfo }) {
  try {
    const signUpResponse = await client.post("/signup", { ...userInfo });
    const { success, message, token } = signUpResponse.data;
    return signUpResponse;
  } catch (error) {
    console.log("Error inside signup method", error.message);
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
    console.log("Error inside signin method", error.message);
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
        await AsyncStorage.removeItem("token");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log("error inside signout method", error.message);
    return false;
  }
};
