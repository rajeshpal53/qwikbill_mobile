import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"

const useTokenExpiry = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          return; // No token saved
        }
            // console.log("Checking token expiry...",token);
        // Decode token
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds

        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expired. Redirecting to Login...");

          // Clear user session
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("loginDetail");

          // Navigate to login screen
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        }
      } catch (err) {
        console.error("Error checking token:", err);
      }
    };

    // Run immediately when component mounts
    checkToken();

    // Optionally, check every minute (if you want continuous monitoring)
    const interval = setInterval(checkToken, 60000);

    return () => clearInterval(interval);
  }, [navigation]);
};

export default useTokenExpiry;
