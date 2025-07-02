import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import UserDataContext from "./UserDataContext";
import { createApi } from "../Util/UtilApi";

import { usePasskey } from "../Store/PasskeyContext";
import { useNavigation } from "@react-navigation/native";
import { useSnackbar } from "./SnackbarContext";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const { isPasskey, passkey } = usePasskey();
  //const navigation = useNavigation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetail, setLoginDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState("");
  const [overlayHeight, setOverlayHeight] = useState("25%");
  const { userData, saveUserData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();


  useEffect(() => {
    console.log('[Auth] userData ➜', userData);
  }, [userData]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log(token, "token12345");

        if (token) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [isFocused]);

  const login = async (token) => {
    console.log("Data of tokens", token);
    try {
      await AsyncStorage.setItem("userToken", userData?.token);
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
    }
  };

  const storeData = async (key, value) => {
    console.log(`Value is key ${key},${value}`);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      if (key === "loginDetail") {
        setLoginDetail(value);
      }
    } catch (error) {
      console.error("Error setting item:", error);
    }
  };

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  };

  const handleLogin = async (values, navigation) => {
    try {
      console.log("login screen", values);
      console.log("login screen passkey", passkey);
      console.log(`isPasskey`, isPasskey, passkey);

      setIsLoading(true);

      const payload = {
        mobile: values.mobile,
        password: values?.password,
      };

      const response = await createApi("users/loginUser", payload);
      console.log("Full API Response:", response);

      if (!response || response?.error || !response?.token) {
        console.log("Login failed: Invalid credentials");
        showSnackbar("Invalid mobile number or password", "error");
        await AsyncStorage.removeItem("loginDetail");
        await saveUserData(null);
        setIsLoading(false);
        return;
      }

      await AsyncStorage.setItem("userToken", response.token);
      await saveUserData(response);

      await storeData("loginDetail", response);
      await AsyncStorage.setItem("firstTimeLogin", "true");

      setLoginDetail(response);
      console.log("Saving user data:", response);

      await saveUserData(response);
      return true;
      // if (isPasskey === false) {
      //   console.log("isPasskey is explicitly false");
      //   return true;
      // } else {
      //   console.log("isPasskey is true, null, or undefined");
      //   return true;
      //   // navigation.reset({ index: 0, routes: [{ name: "passcode" }] });
      // }
    } catch (error) {
      //console.error("Login error:", error);
      showSnackbar(`${error.data.message}`, "error");
      return false;
      // showSnackbar("Wrong phone number or password .", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("loginDetail");
      await AsyncStorage.clear();
      await AsyncStorage.removeItem("allShops");
      await AsyncStorage.removeItem("selectedShop");
      showSnackbar("Logged out successfully", "success");

      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isLoading,
        setIsLoading,
        storeData,
        getData,
        loginDetail,
        setLoginDetail,
        searchMode,
        setSearchMode,
        searchQuery,
        setSearchQuery,
        selectedShop,
        setSelectedShop,
        overlayHeight,
        setOverlayHeight,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
