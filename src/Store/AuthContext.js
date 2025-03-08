 //AuthContext.js
import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';
import UserDataContext from "./UserDataContext";
import { createApi } from "../Util/UtilApi";
// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetail, setLoginDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState('');
  const [overlayHeight, setOverlayHeight] = useState('25%')
  const { userData, saveUserData } = useContext(UserDataContext);

  // Check if user is logged in on app startup
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        // const token2= await AsyncStorage.getItem("loginDetail");
        //   console.log(token2,"token2")
          console.log(token,"token12345")
        //   setLoginDetail(token2)

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
    console.log("Data of tokes", token)
    try {
      await AsyncStorage.setItem("userToken", userData?.token);
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
    }
  };
  const storeData = async (key, value) => {
    console.log(`Value is key ${key},${value}`)
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      if(key==="loginDetail"){
        setLoginDetail(value)
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

   const handleLogin = async (values) => {
      try {
        console.log("login screen");
        setIsLoading(true);

        const payload = {
          mobile: values?.mobile,
          password: values?.password,
        };
        const response = await createApi("users/loginUser", payload);
        await storeData("loginDetail", response);
        setLoginDetail(response);
        console.log("response of Login is , ", response);
        await saveUserData(response);
        // console.log(response.data, "newResponse");
        // const data = await response.data;
        // await storeData("loginDetail", data.result);
        // setLoginDetail(data.result);
        // const token = "dummyToken";
        // login(token);
        // if (isLoading) {
        //   {
        //     <View
        //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        //     >
        //       <ActivityIndicator size="large" />
        //     </View>;
        //   }
        // }
        if (isPasskey) {
          navigation.navigate("Passcode");
        } else {
          navigation.navigate("CreateNewPasscode");
        }
        // resetForm();
      } catch (err) {
        console.error(err);
      } finally {
        // resetForm();
        setIsLoading(false);
      }
    };



  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("loginDetail");
      await AsyncStorage.clear();
      await AsyncStorage.removeItem("allShops");
      await AsyncStorage.removeItem("selectedShop");

      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
  };
    // const value = useMemo(()=>{
    //  return  {
    //   isAuthenticated,
    //   login,
    //   logout,
    //   isLoading,
    //   storeData,
    //   getData,
    //   loginDetail,
    //   setLoginDetail,
    // }
    // } ,[ isAuthenticated,
    //   login,
    //   logout,
    //   isLoading,
    //   storeData,
    //   getData,
    //   loginDetail,
    //   setLoginDetail])
  return (
    <AuthContext.Provider
      value={ {
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
           handleLogin
         }}
    >
      {children}
    </AuthContext.Provider>
  );
};
