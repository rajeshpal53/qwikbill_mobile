import React, { useEffect, useState } from 'react'
import {View,Text,StyleSheet}from 'react-native'
import { useRoute } from '@react-navigation/native';
import { readApi } from '../../Util/UtilApi';
import { FlatList } from 'react-native-gesture-handler';
import TransactionCard from '../../Component/TransactionCard';
import { ActivityIndicator,FAB} from 'react-native-paper';
import Icon from "react-native-vector-icons/Ionicons";
import TransactionModal from '../../Modal/TransactionModal';
function InvoiceTransactionScreen() {
  const route= useRoute();
  const{invoices}=route.params||null
  console.log(invoices,"invocieIde")
  const[transactions,setTransactions]=useState([])
  const[isLoading,setIsLoading]=useState(false)
  const [visible,setVisible]=useState(false)
  useEffect(()=>{
    fetchinvoiceData()
  },[])
  const fetchinvoiceData=async()=>{
    try{
      setIsLoading(true)
    const response=  await readApi(`transaction/getTransactionsByInvoicefk/${invoices.invoicefk}`)
    console.log(response,"response of transaction")
      setTransactions(response.transactions)
    }catch(err){
      console.error(err)
    }
    finally{
      setIsLoading(false)
    }
  }
  
  if(isLoading){
    return(
      <ActivityIndicator size={"large"}/>
    )
  }

  return (
  <View style={{flex:1}}>
      <FlatList
      data={transactions}
        renderItem={({item})=>(<TransactionCard item={item}/>)}
        keyExtractor={(item) => item.id.toString()}
      />
       <FAB icon={() => <Icon name="add-outline" size={25} color="white" />}
           theme={{ colors: { primary: '#fff' } }}
              style={styles.fab}
              color="white"
              onPress={()=>{setVisible(true)}}
            
              labelStyle={{color:"#ffffff"}}
             />   
    
    <TransactionModal visible={visible} onClose={() => setVisible(false)} invoices={invoices}/>
  </View>
  )
}
const styles=StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 13,
    right: 0,
    bottom: 0,
    color: "floralwhite ",
    backgroundColor: "#0c3b73",
    zIndex:100,
    color:"white"
  },
})

export default InvoiceTransactionScreen;
