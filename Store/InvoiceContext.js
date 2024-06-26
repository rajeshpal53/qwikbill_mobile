// InvoiceContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const InvoiceContext = createContext();

// Create the provider
export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);

  return (
    <InvoiceContext.Provider value={{ invoices, setInvoices}}>
      {children}
    </InvoiceContext.Provider>
  );
};
