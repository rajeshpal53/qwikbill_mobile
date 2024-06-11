
import React,{useState,useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import InvoiceCard from '../components/InvoiceCard';

const invoiceData = [
  { id: '1', customerName: 'John Doe', productName: 'Product 1', price: 100, tax: 10, quantity: 2, total: 220 },
  { id: '2', customerName: 'Jane Smith', productName: 'Product 2', price: 200, tax: 20, quantity: 1, total: 220 },
  // Add more data here
];
const Invoice = () => {
  // const[invoices,setInvoices]= useState();
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await fetch("http://localhost:8888/api/invoice/list", {
  //         credentials: "include",
  //       });
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const result = await response.json();
  //       setInvoices(result.result);
  //     } catch (error) {
  //       console.error("error", error);
  //     }
  //   }
  //   fetchData();
  // }, []);
 // console.log(invoices)
  return (
    <View style={styles.container}>
      <Button style={styles.addButton} buttonColor='#ffffff' textColor='white'> Add New Invoice</Button>
      <InvoiceCard/>
  </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
  padding:16
  },
  text: {
    fontSize: 24,
  },
  addButton:{
     color:"floralwhite ",
     backgroundColor:"#1976d2",
     marginVertical:20,   
  },
});

export default Invoice;

