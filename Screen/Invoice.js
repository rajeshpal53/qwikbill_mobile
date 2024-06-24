
import React,{useState,useEffect, useContext} from 'react';
import { View, StyleSheet,Text,ScrollView} from 'react-native';
import { Button,ActivityIndicator} from 'react-native-paper';
import InvoiceCard from '../Components/InvoiceCard'
import { AuthContext } from '../Store/AuthContext';
export default function Invoice({navigation}){
  const[invoices,setInvoices]= useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://192.168.1.2:8888/api/invoice/list", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok",response);
        }
        const result = await response.json();
        setInvoices(result.result);
      } catch (error) {
        console.error("error", error);
      }
    }
    fetchData();
  }, []);
 const addInvoiceHandler=()=>{
  navigation.navigate('StackNavigator',{screen:'AddInvoice'})
 }

  return (
    <ScrollView style={styles.container}>
      <Button style={styles.addButton} buttonColor='#ffffff' textColor='white' onPress={addInvoiceHandler}> Add New Invoice</Button>
        {invoices?<InvoiceCard invoices={invoices} navigation={navigation}/>: <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>}
  </ScrollView>
    
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


