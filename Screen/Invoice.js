
import React,{useState,useEffect} from 'react';
import { View, StyleSheet,Text} from 'react-native';
import { Button } from 'react-native-paper';
import InvoiceCard from '../Components/InvoiceCard'
import AddInvoice from '../Components/AddInvoice';
 export default function Invoice({navigation}){
  const[invoices,setInvoices]= useState();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://192.168.1.4:8888/api/invoice/list", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setInvoices(result.result);
      } catch (error) {
        console.error("error", error);
      }
    }
    fetchData();
  }, []);
 console.log(invoices)
 const addInvoiceHandler=()=>{
  navigation.navigate('addInvoice')
 }
//   const [invoices,setInvoices]=useState([])
//  useEffect(()=>{
//   async function fetchData() {
//         try {
//           const response = await fetch("http://192.168.1.3:3000/invoices/", {
//           });
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           const result = await response.json();
//           setInvoices(result);
//         } catch (error) {
//           console.error("error", error);
//         }
//       }
//       fetchData();
//  },[])
  return (
    <View style={styles.container}>
      <Button style={styles.addButton} buttonColor='#ffffff' textColor='white' onPress={addInvoiceHandler}> Add New Invoice</Button>
        {invoices?<InvoiceCard invoices={invoices}/>:<Text>no invoices found</Text>}
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


