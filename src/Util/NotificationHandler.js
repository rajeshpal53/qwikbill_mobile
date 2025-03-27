// src/notificationService.js

import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { status } from "./UtilApi";

const STORAGE_KEY = 'counter_value';

// Function to increment the stored value
export const incrementValue = async () => {
  try {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    let newValue = storedValue ? parseInt(storedValue, 10) + 1 : 1;

    await AsyncStorage.setItem(STORAGE_KEY, newValue.toString());
    console.log('Updated Value:', newValue);
    return newValue;
  } catch (error) {
    console.error('Error updating value:', error);
  }
}
// Function to get the current stored value
export const getValue = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error fetching value:', error);
    return 0;
  }
};

// Function to reset the value to 0
export const resetValue = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, '0');
    console.log('Value reset to 0');
    return 0;
  } catch (error) {
    console.error('Error resetting value:', error);
  }
};



// Request Notification Permission
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    await getFcmToken(); // Request the token if permission is granted
  } else {
    Alert.alert("Notification Permission Denied");
  }
};

// Retrieve & Store FCM Token
export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    if (token) {
      console.log("FCM token:", token);
      await AsyncStorage.setItem("FCMToken", JSON.stringify(token));
      return token;
    } else {
      console.log("Failed to get FCM token");
    }
  } catch (error) {
    console.log("Error in getting FCM token:", error);
  }
};

// Function to Play Notification Sound
// export const playNotificationSound = async () => {
//   try {
//     console.log("Playing notification sound...");

//     // Configure Audio mode to allow background playback
//     await Audio.setAudioModeAsync({
//       playsInSilentModeIOS: true,  // Allow sound even if the phone is on silent
//       staysActiveInBackground: true,  // Allow playing audio in the background
//       shouldDuckAndroid: true,
//       playThroughEarpieceAndroid: false,
//     });

//     // Load and play the sound
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../assets/notification.mp3")
//     );
//     await sound.setPositionAsync(0); // Reset to start
//     await sound.playAsync();

//     // Release the sound after playing
//     sound.setOnPlaybackStatusUpdate(async (status) => {
//       if (status.didJustFinish) {
//         await sound.unloadAsync();
//       }
//     });
//   } catch (error) {
//     console.error("Error playing notification sound:", error);
//   }
// };

// Store Incoming Messages
export const storeMessage = async (message) => {
  try {
    const existingMessages = await AsyncStorage.getItem("remoteMessages");
    const messages = existingMessages ? JSON.parse(existingMessages) : [];
    
    messages.unshift(message); // Insert at the first index

    await AsyncStorage.setItem("remoteMessages", JSON.stringify(messages));
    console.log("Message stored successfully");
  } catch (error) {
    console.error("Failed to store message:", error);
  }
};


// Setup Token Refresh Listener
export const setupTokenRefreshListener = (setFcmToken) => {
  return messaging().onTokenRefresh(async (token) => {
    console.log("FCM token refreshed:", token);
    setFcmToken(token);
    await AsyncStorage.setItem("FCMToken", JSON.stringify(token));
  });
};

// Handle Background Notifications
export const setupBackgroundHandler = (setInitialRoute,setOrderId) => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Background message received:", remoteMessage);
    
    // Play sound only if the app is running in the background (not killed)
    if (remoteMessage) {
      // await playNotificationSound();
      await storeMessage(remoteMessage);
      await incrementValue();
      if (remoteMessage?.data?.screen) {
        const input = remoteMessage.notification.title
        setOrderId({orderId:remoteMessage.data.extraData, status:input.split(" ")[1]});
        setInitialRoute(remoteMessage.data.screen);
        console.log("Initial extraData:", remoteMessage.data.extraData);
      }
    }
  });
};


// function checkLastWord(str, word) {
//   return str.trim().endsWith(word);
// }

// // Example usage
// const sentence = "i have to go";
// const wordToCheck = "go";

// console.log(checkLastWord(sentence, wordToCheck)); // Output: true

// Handle Foreground Notifications
export const foregroundHandler = (storeMessage) => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log("Foreground message received:", remoteMessage);
    await incrementValue();
    await storeMessage(remoteMessage);
    // await playNotificationSound();
  });
};
