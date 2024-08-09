import React,{useState,useContext} from 'react'
import { ScrollView } from "react-native"
import { Snackbar, Text } from "react-native-paper"
import AddInvoice from "../Components/AddInvoice"
import { useSnackbar } from '../Store/SnackbarContext'
import { createApi } from '../Util/UtilApi'
import { ShopDetailContext } from "../Store/ShopDetailContext";
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

   const formatDate = (isoDateString) => {
    const [year, month, day] = isoDateString.split('-');
    return `${day}-${month}-${year}`;
  };
  
const AddInvoiceScreen=({navigation,invoiceType})=>{
     const{showSnackbar}= useSnackbar();
     const {shopDetails}=useContext(ShopDetailContext)
     const[initialValues,setInitialValues]=useState({
          client:"",
          phone: "",
          people:"",
          address:"",
          gstnumber:"",
          date: formatDate(new Date().toISOString().split('T')[0]),
          items: [{ itemName: "", price: "", quantity: "", total: "" }],
        })
const submitHandler= async( values,fetchDataId)=>{
     const postData = {
          ...values,
          shop:shopDetails._id,
          client:fetchDataId,
          number: parseInt(values.phone),
          taxRate: 0,
          currency: "USD",
          status: "draft",
          year: getYear(values.date),
          expiredDate: getNextMonthDate(values.date),
          people:fetchDataId,
        };
        delete postData.phone;
        // delete postData.address
        console.log(postData, "------postdata");
        try{
        
        const headers= {
          "Content-Type": "application/json",
        }
        const response= await createApi("api/invoice/create",postData,headers)
        showSnackbar("invoice Added Successfull","success")
        if(response){
          console.log(response.result)
          return(response.result)
        }
       
          }
          catch(error){
          console.error("Failed to add invoice", response);
          showSnackbar("Failed to add invoice","error")
          }
}
     return( 
     <ScrollView>
       <AddInvoice initialValues={initialValues} invoiceType={invoiceType} navigation={navigation} shopDetails={shopDetails} submitHandler={submitHandler}/>
      </ScrollView>
     )
}
export default AddInvoiceScreen;