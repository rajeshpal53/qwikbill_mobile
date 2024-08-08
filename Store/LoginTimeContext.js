import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const LoginTimeContext = createContext();

const LoginTimeProvider = ({ children }) => {
  const [currentLoginTime, setCurrentLoginTime] = useState(null);
  const [lastLoginTime, setLastLoginTime] = useState(null);

  const storeTime = async () => {
    try {
      const previousLoginTime = await AsyncStorage.getItem('currentLoginTime');
      
      if (previousLoginTime) {
        await AsyncStorage.setItem('lastLoginTime', previousLoginTime);
        setLastLoginTime(previousLoginTime);
        console.log('Last Login Time:', previousLoginTime);
      }

      const newCurrentLoginTime = moment().format('D MMM YYYY, h:mm A');
      await AsyncStorage.setItem('currentLoginTime', newCurrentLoginTime);
      setCurrentLoginTime(newCurrentLoginTime);
      console.log('Current Login Time:', newCurrentLoginTime);
    } catch (error) {
      console.error('Error storing login times:', error);
    }
  };

  useEffect(() => {
    const fetchLoginTimes = async () => {
      try {
        const storedCurrentLoginTime = await AsyncStorage.getItem('currentLoginTime');
        const storedLastLoginTime = await AsyncStorage.getItem('lastLoginTime');

        if (storedCurrentLoginTime) {
          setCurrentLoginTime(storedCurrentLoginTime);
        }

        if (storedLastLoginTime) {
          setLastLoginTime(storedLastLoginTime);
        }
      } catch (error) {
        console.error('Failed to fetch login times:', error);
      }
    };

    fetchLoginTimes();
  }, []);

  return (
    <LoginTimeContext.Provider value={{ currentLoginTime, lastLoginTime, storeTime }}>
      {children}
    </LoginTimeContext.Provider>
  );
};

export { LoginTimeProvider, LoginTimeContext };
