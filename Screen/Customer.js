import React, { useState,useEffect, useContext } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper'
import CustomerCard from '../Components/CustomerCard'
import { useIsFocused } from '@react-navigation/native';
import { readApi } from '../Util/UtilApi';
 export default function Customer({navigation}) {
  const [isLoading,setIsLoading]=useState(true)
  const [customer,setCustomer]=useState([])
  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi("api/people/list");
        const result = await response
        setCustomer(result.result)
      } catch (error) {
        console.error("error", error);
      }
      finally{
        setIsLoading(false);
      }
    }
    fetchData();
  }, [isFocused]);

  if(isLoading){
    return<ActivityIndicator size='large'/>
  }
  return (
    <ScrollView style={styles.container}>
       <Button style={styles.addButton} buttonColor='#ffffff' textColor='white' onPress={()=>{ navigation.navigate('AddCustomer')}}> Add New Customer</Button>
      {customer?<CustomerCard customer={customer} navigation={navigation} setCustomer={setCustomer}/>: <Text> no Customer found</Text>}
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
    padding:16,
  },
  text: {
    fontSize: 24,
  },
});


