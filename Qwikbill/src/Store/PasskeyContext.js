import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context
const PasskeyContext = createContext();

// Create a provider component
export const PasskeyProvider = ({ children }) => {
  const [passkey, setPasskey] = useState(null);
  const [isPasskey,setIsPasskey]=useState(false)

  // Function to load passkey from AsyncStorage
  const loadPasskey = async () => {
    try {
      const storedPasskey = await AsyncStorage.getItem('passkey');
      if (storedPasskey) {
        setPasskey(storedPasskey);
        setIsPasskey(true)
      }else{
        setIsPasskey(false)
      }
    } catch (error) {
      console.error('Failed to load passkey', error);
    }
  };

  // Function to save passkey to AsyncStorage
  const savePasskey = async (key) => {
    try {
      await AsyncStorage.setItem('passkey', key);
      setPasskey(key);
      setIsPasskey(true); // Ensure it updates when saving a new passkey

    } catch (error) {
      console.error('Failed to save passkey', error);
    }
  };

  // Function to remove passkey from AsyncStorage
  const removePasskey = async () => {
    try {
      await AsyncStorage.removeItem('passkey');
      setPasskey(null);
      setIsPasskey(false)
    } catch (error) {
      console.error('Failed to remove passkey', error);
    }
  };

  // Load passkey on component mount
  useEffect(() => {
    loadPasskey();
  }, []);

  return (
    <PasskeyContext.Provider value={{ passkey, savePasskey, removePasskey,isPasskey}}>
      {children}
    </PasskeyContext.Provider>
  );
};

// Custom hook to use the PasskeyContext
export const usePasskey = () => useContext(PasskeyContext);
