import React,{useState} from 'react'
import { View } from "react-native"
import { Text } from "react-native-paper"
import AddInvoice from "../Components/AddInvoice"

const AddInvoiceScreen=({navigation})=>{
     const[initialValues,setInitialValues]=useState({
          client: "",
          phone: "",
          date: new Date().toISOString().substring(0, 10),
          items: [{ itemName: "", price: "", quantity: "", total: "" }],
        })
     return( 
     <View>
       <AddInvoice initialValues={initialValues} navigation={navigation}/>
      </View>
     )
}
export default AddInvoiceScreen;