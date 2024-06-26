// InvoiceContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const ProductContext = createContext();

// Create the provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  return (
    <ProductContext.Provider value={{ products, setProducts}}>
      {children}
    </ProductContext.Provider>
  );
};
