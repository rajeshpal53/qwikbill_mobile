import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const LoginTimeContext = createContext();

const LoginTimeProvider = ({ children }) => {
  const [lastLoginTime, setLastLoginTime] = useState(null); // state only for displaying
  const setCurrentAsLastTime = useRef(false); // for internal first-time logic

  // Store login time in AsyncStorage ONLY if state is null (first login)
  const storeCurrentTime = async () => {
    try {
      const currentLoginTime = moment().format('DD MM YYYY, h:mm A');

      // Only store in AsyncStorage if lastLoginTime state is null
      if (!lastLoginTime) {
        await AsyncStorage.setItem('lastLoginTime', currentLoginTime);
      }
    } catch (error) {
      console.error('Error storing login times:', error);
    }
  };

  // Fetch lastLoginTime from AsyncStorage and set state for displaying
  const fetchLoginTimes = async () => {
    try {
      const storedLastLoginTime = await AsyncStorage.getItem('lastLoginTime');
      if (storedLastLoginTime) {
        setLastLoginTime(storedLastLoginTime); // only set state for displaying
        return true;
      }
      setLastLoginTime(null);
      return false;
    } catch (error) {
      console.error('Failed to fetch login times:', error);
      setLastLoginTime(null);
      return false;
    }
  };

  // Clear both AsyncStorage and state on logout or visiting login/signup
  const clearLoginTime = async () => {
    try {
      await AsyncStorage.removeItem('lastLoginTime');
      setLastLoginTime(null);
    } catch (error) {
      console.error('Failed to clear login time:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchLoginTimes();
    };
    initialize();
  }, []);

  return (
    <LoginTimeContext.Provider
      value={{
        lastLoginTime,       // displayed in UI
        storeCurrentTime,    // store on login
        clearLoginTime,      // reset on logout/login/signup
      }}
    >
      {children}
    </LoginTimeContext.Provider>
  );
};

export { LoginTimeProvider, LoginTimeContext };
