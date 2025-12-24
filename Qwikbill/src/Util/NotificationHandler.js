// src/notificationService.js
import {
  getMessaging,
  getToken,
  requestPermission,
  AuthorizationStatus,
  onTokenRefresh,
  setBackgroundMessageHandler,
  onMessage,
} from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

/* ----------------------------
   🔢 COUNTER STORAGE FUNCTIONS
----------------------------- */
const STORAGE_KEY = "counter_value";

export const incrementValue = async () => {
  try {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    let newValue = storedValue ? parseInt(storedValue, 10) + 1 : 1;

    await AsyncStorage.setItem(STORAGE_KEY, newValue.toString());
    console.log("Updated Value:", newValue);
    return newValue;
  } catch (error) {
    console.error("Error updating value:", error);
  }
};

export const getValue = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error("Error fetching value:", error);
    return 0;
  }
};

export const resetValue = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, "0");
    console.log("Value reset to 0");
    return 0;
  } catch (error) {
    console.error("Error resetting value:", error);
  }
};

/* ----------------------------
   🔔 NOTIFICATION PERMISSIONS
----------------------------- */
export const requestUserPermission = async () => {
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
      await getFcmToken(); // Request the token if permission is granted
    } else {
      Alert.alert("Notification Permission Denied");
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
  }
};

/* ----------------------------
   🔑 FCM TOKEN MANAGEMENT
----------------------------- */
export const getFcmToken = async () => {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);

    if (token) {
      await AsyncStorage.setItem("FCMToken", JSON.stringify(token));
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Failed to get FCM token");
    }
  } catch (error) {
    console.log("Error in getting FCM token:", error);
  }
};

/* ----------------------------
   🔄 TOKEN REFRESH LISTENER
----------------------------- */
export const setupTokenRefreshListener = (setFcmToken) => {
  const messaging = getMessaging();

  // Return unsubscribe to clean up properly in useEffect
  const unsubscribe = onTokenRefresh(messaging, async (token) => {
    console.log("FCM Token refreshed:", token);
    setFcmToken(token);
    await AsyncStorage.setItem("FCMToken", JSON.stringify(token));
  });

  return unsubscribe;
};

/* ----------------------------
   🔊 PLAY NOTIFICATION SOUND
----------------------------- */
export const playNotificationSound = async (player) => {
  try {
    console.log("Playing notification sound...");
    if (player) {
      player.seekTo(0);
      player.play();
    }
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};

/* ----------------------------
   💾 STORE INCOMING MESSAGES
----------------------------- */
export const storeMessage = async (message) => {
  try {
    const existingMessages = await AsyncStorage.getItem("remoteMessages");
    const messages = existingMessages ? JSON.parse(existingMessages) : [];
    messages.unshift(message); // Add to start
    await AsyncStorage.setItem("remoteMessages", JSON.stringify(messages));
    console.log("Message stored successfully");
  } catch (error) {
    console.error("Failed to store message:", error);
  }
};

/* ----------------------------
   💤 BACKGROUND HANDLER
----------------------------- */
export const setupBackgroundHandler = () => {
  const messaging = getMessaging();

  // Background messages can’t return unsubscribe (they persist globally)
  setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    console.log("Background message received:", remoteMessage);

    if (remoteMessage) {
    //   await playNotificationSound(player);
      await storeMessage(remoteMessage);
      await incrementValue();
    }
  });
};

/* ----------------------------
   🟢 FOREGROUND HANDLER
----------------------------- */
export const foregroundHandler = (storeMessageCallback, ) => {
  const messaging = getMessaging();

  // Handle messages when the app is in the foreground
  const unsubscribe = onMessage(messaging, async (remoteMessage) => {
    console.log("Foreground message received:", remoteMessage);

    // await playNotificationSound(player);
    await storeMessageCallback(remoteMessage);
    await incrementValue();
  });

  return unsubscribe;
};
