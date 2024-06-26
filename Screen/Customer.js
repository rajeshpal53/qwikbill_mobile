import React, { useState,useEffect, useContext } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper'
import CustomerCard from '../Components/CustomerCard'
import { CustomerContext } from '../Store/CustomerContext';
 export default function Customer({navigation}) {
  const {customer,setCustomer}= useContext(CustomerContext);
  const [isLoading,setIsLoading]=useState(true)
  async function fetchData() {
    try {
      const response = await fetch("http://192.168.1.3:8888/api/people/list", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setCustomer(result.result);
    } catch (error) {
      console.error("error", error);
    }
    finally{
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if(isLoading){
    return<ActivityIndicator size='large'/>
  }
  return (
    <ScrollView style={styles.container}>
       <Button style={styles.addButton} buttonColor='#ffffff' textColor='white' onPress={()=>{ navigation.navigate('AddCustomer')}}> Add New Customer</Button>
      {customer?<CustomerCard customer={customer} navigation={navigation}/>: <Text> no Customer found</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addButton:{
    color:"floralwhite ",
    backgroundColor:"#1976d2",
    marginVertical:20,   
 },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
  },
});


