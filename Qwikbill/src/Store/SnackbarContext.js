// SnackbarContext.js
import React, { createContext, useState, useContext } from 'react';
import { Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ visible: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar({ ...snackbar, visible: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={hideSnackbar}
        action={{
          label: 'Close',
          onPress: hideSnackbar,
        }}
        style={{ backgroundColor: snackbar.severity === 'error' ? '#c20d0a' : 'green',borderRadius:20, }}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbar.message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
export const useSnackbar = () => useContext(SnackbarContext);
