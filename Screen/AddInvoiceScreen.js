import React,{useState,useContext} from 'react'
import { ScrollView } from "react-native"
import { Text } from "react-native-paper"
import AddInvoice from "../Components/AddInvoice"
import { InvoiceContext } from '../Store/InvoiceContext'
const getYear = (date) => {
     if (!date) return "";
     const dateObj = new Date(date);
     return dateObj.getFullYear();
   };
   const getNextMonthDate = (date) => {
     if (!date) return "";
     const dateObj = new Date(date);
     const nextMonth = new Date(dateObj.setMonth(dateObj.getMonth() + 1));
     return nextMonth.toISOString().substring(0, 10);
   };

const AddInvoiceScreen=({navigation})=>{
     const {setInvoices}= useContext(InvoiceContext)
     const[initialValues,setInitialValues]=useState({
          client: "",
          phone: "",
          people:"",
          date: new Date().toISOString().substring(0, 10),
          items: [{ itemName: "", price: "", quantity: "", total: "" }],
        })
const submitHandler= async( values,fetchDataId)=>{
     const postData = {
          ...values,
          client: "666130c9a9c613f884628d76",
          people:fetchDataId,
          number: parseInt(values.phone),
          taxRate: 0,
          currency: "USD",
          status: "draft",
          year: getYear(values.date),
          expiredDate: getNextMonthDate(values.date),
        };
        delete postData.phone;
        console.log(postData, "------postdata");
        try{
        const response = await fetch(
          "http://192.168.1.3:8888/api/invoice/create",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          }
        ); 
        const data= response.json();
        console.log(data,'sssssssssssssss') 
          }
          catch(error){
          console.error("Failed to add invoice", response);
          }
          finally{
            navigation.navigate("Invoice");
          }
}
     return( 
     <ScrollView>
       <AddInvoice initialValues={initialValues} navigation={navigation} submitHandler={submitHandler}/>
      </ScrollView>
     )
}
export default AddInvoiceScreen;