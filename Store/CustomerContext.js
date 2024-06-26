
import React, { createContext, useState } from 'react';

// Create the context
export const CustomerContext = createContext();

// Create the provider
export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState([]);

  return (
    <CustomerContext.Provider value={{ customer, setCustomer}}>
      {children}
    </CustomerContext.Provider>
  );
};
