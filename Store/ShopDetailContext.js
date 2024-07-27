import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const ShopDetailContext = createContext();

// Create provider component
const ShopDetailProvider = ({ children }) => {
  const [shopDetails, setShopDetails] = useState([]);

  // Load shop details from local storage
  useEffect(() => {
    const loadShopDetails = async () => {
      try {
        const storedShopDetails = await AsyncStorage.getItem('shopDetails');
        if (storedShopDetails) {
          setShopDetails(JSON.parse(storedShopDetails));
        }
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
      }
    };

    loadShopDetails();
  }, []);

  // Save shop details to local storage whenever they change
  useEffect(() => {
    const saveShopDetails = async () => {
      try {
        await AsyncStorage.setItem('shopDetails', JSON.stringify(shopDetails));
      } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
      }
    };

    if (shopDetails.length > 0) {
      saveShopDetails();
    }
  }, [shopDetails]);

  // Add shop detail function
  const addShopDetails = (newShopDetail) => {
    setShopDetails(newShopDetail);
  };

  return (
    <ShopDetailContext.Provider value={{ shopDetails, addShopDetails }}>
      {children}
    </ShopDetailContext.Provider>
  );
};

export { ShopDetailProvider, ShopDetailContext };
