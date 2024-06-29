 //AuthContext.js
import React, { createContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';
// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDetail, setLoginDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  // Check if user is logged in on app startup
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        // const token2= await AsyncStorage.getItem("loginDetail");
        //   console.log(token2,"token2")
        //   console.log(token,"token")
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
    try {
      await AsyncStorage.setItem("userToken", token);
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
    }
  };
  const storeData = async (key, value) => {
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
           storeData,
           getData,
           loginDetail,
           setLoginDetail,
         }}
    >
      {children}
    </AuthContext.Provider>
  );
};
