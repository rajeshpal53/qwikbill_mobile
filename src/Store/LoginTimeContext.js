import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const LoginTimeContext = createContext();

const LoginTimeProvider = ({ children }) => {
  // const [currentLoginTime, setCurrentLoginTime] = useState(null);
  const [lastLoginTime, setLastLoginTime] = useState(null);
  const setCurrentAsLastTime = useRef(false);

  const storeCurrentTime = async () => {
    try {
      // const previousLoginTime = await AsyncStorage.getItem('currentLoginTime');
      const currentLoginTime = moment().format('DD MM YYYY, h:mm A');

      if (setCurrentAsLastTime.current) {
        setLastLoginTime(currentLoginTime);
      }

      await AsyncStorage.setItem('lastLoginTime', currentLoginTime);

     

      // const newCurrentLoginTime = moment().format('D MMM YYYY, h:mm A');
      // await AsyncStorage.setItem('currentLoginTime', newCurrentLoginTime);
      // setCurrentLoginTime(newCurrentLoginTime);
      // console.log('Current Login Time:', newCurrentLoginTime);
    } catch (error) {
      console.error('Error storing login times:', error);
    }
  };

  const fetchLoginTimes = async () => {
    try {
      // const storedCurrentLoginTime = await AsyncStorage.getItem('currentLoginTime');
      const storedLastLoginTime = await AsyncStorage.getItem('lastLoginTime');

      // if (storedCurrentLoginTime) {
      //   setCurrentLoginTime(storedCurrentLoginTime);
      // }

      if (storedLastLoginTime) {
        setLastLoginTime(storedLastLoginTime);
        return true;
      }
      return false;

    } catch (error) {
      console.error('Failed to fetch login times:', error);
      return false;
    }
  };

  useEffect(() => {
    
    const getTimes = async() => {
      const alreadyStored = await fetchLoginTimes();

      if(!alreadyStored){
        setCurrentAsLastTime.current = true;
      }

      // await storeCurrentTime();
    }
   

    getTimes();
  }, []);

  return (
    <LoginTimeContext.Provider value={{ 
      // currentLoginTime, 
      lastLoginTime, 
      storeCurrentTime,
      setCurrentAsLastTime,
      }}>
      {children}
    </LoginTimeContext.Provider>
  );
};

export { LoginTimeProvider, LoginTimeContext };
