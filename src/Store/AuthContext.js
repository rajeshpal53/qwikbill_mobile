 //AuthContext.js
import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';
import UserDataContext from "./UserDataContext";
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
  const { userData } = useContext(UserDataContext);

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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("loginDetail");
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
           setOverlayHeight
         }}
    >
      {children}
    </AuthContext.Provider>
  );
};
