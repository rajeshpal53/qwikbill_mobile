import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // Load data from AsyncStorage when the app starts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);


  const fetchUserData = () => {
    console.log("2 check before Promise");

    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('userData')
        .then((storedData) => {
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserData(parsedData);

            console.log("3 check resolve Promise", parsedData);
            resolve(parsedData);
            console.log("4 after resolve");
          } else {
            reject("No user data found in AsyncStorage");
          }
        })
        .catch((error) => {
          console.log('Error loading user data:', error);
          reject(error);
        });
    });
  };



  // Function to store data both in state and AsyncStorage
  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserData(null);
    } catch (error) {
      console.log('Error clearing user data:', error);
    }
  };

  return (
    <UserDataContext.Provider value={{ userData, saveUserData, clearUserData, fetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
