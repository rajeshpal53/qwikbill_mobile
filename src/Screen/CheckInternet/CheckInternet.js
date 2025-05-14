// CheckInternet.js
import React, { useState, useEffect } from "react";
import InternetConnection from "../../Components/Modal/InternetConnection";
import NetInfo from "@react-native-community/netinfo";

const CheckInternet = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // If no internet connection, show the modal
  useEffect(() => {
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setModalVisible(!state.isConnected); // Show modal if no connection
    };
    checkConnection(); // Check when component mounts
    const unsubscribe = NetInfo.addEventListener((state) => {
      setModalVisible(!state.isConnected); // Show/hide modal on network change
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (

      <InternetConnection
      visible={modalVisible}
      onClose={() => setModalVisible(false)} // Close modal when user clicks Retry
    />

    
  );
};

export default CheckInternet;
