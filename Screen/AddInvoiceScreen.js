import React,{useState} from 'react'
import { ScrollView } from "react-native"
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
     <ScrollView>
       <AddInvoice initialValues={initialValues} navigation={navigation}/>
      </ScrollView>
     )
}
export default AddInvoiceScreen;