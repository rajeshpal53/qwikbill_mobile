import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
const FileContext = createContext();

// Custom hook to use the FileContext
export const useStorageLocationContext = () => {
  return useContext(FileContext);
};

// Create the FileContext provider component
export const StorageLocationProvider = ({ children }) => {
  const [saveFolderUri, setSaveFolderUri] = useState(null);
  const [saveFileUri, setSaveFileUri] = useState(null);

  // Load the saved URIs from AsyncStorage when the app starts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedFolderUri = await AsyncStorage.getItem("saveFolderUri");
        const savedFileUri = await AsyncStorage.getItem("saveFileUri");

        if (savedFolderUri) {
          setSaveFolderUri(savedFolderUri);
        }
        if (savedFileUri) {
          setSaveFileUri(savedFileUri);
        }
      } catch (error) {
        console.error("Error loading saved data from AsyncStorage:", error);
      }
    };

    loadSavedData();
  }, []);

  // Function to save data to AsyncStorage
  const saveDataToStorage = async (folderUri, fileUri) => {
    try {
      if (folderUri) {
        await AsyncStorage.setItem("saveFolderUri", folderUri);
      }
      if (fileUri) {
        await AsyncStorage.setItem("saveFileUri", fileUri);
      }
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  const value = {
    saveFolderUri,
    setSaveFolderUri: async(uri) => {
      setSaveFolderUri(uri);
      await saveDataToStorage(uri, saveFileUri); // Save to AsyncStorage
    },
    saveFileUri,
    setSaveFileUri: async(uri) => {
      setSaveFileUri(uri);
      await saveDataToStorage(saveFolderUri, uri); // Save to AsyncStorage
    },
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
