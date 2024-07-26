import React,{useState,useContext} from 'react'
import { ScrollView } from "react-native"
import { Snackbar, Text } from "react-native-paper"
import AddInvoice from "../Components/AddInvoice"
import { useSnackbar } from '../Store/SnackbarContext'
import { createApi } from '../Util/UtilApi'
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
     const{showSnackbar}= useSnackbar();
     const[initialValues,setInitialValues]=useState({
          client: "",
          phone: "",
          people:"",
          address:"",
          date: new Date().toISOString().split('T')[0],
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
        
        const headers= {
          "Content-Type": "application/json",
        }
        // const response= await createApi("api/invoice/create",postData,headers)
        showSnackbar("invoice Added Successfull","success")
          }
          catch(error){
          console.error("Failed to add invoice", response);
          showSnackbar("Failed to add invoice","error")
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