import { useEffect, useState } from "react"
import { View } from "react-native"
import { Text,ActivityIndicator } from "react-native-paper"
import AddCustomer from "../Components/AddCustomer"
import { useSnackbar } from '../Store/SnackbarContext'
function EditCustomerScreen({route,navigation}) {
  const[initialValues,setInitialValues]=useState({firstname: '', lastname: '', email: '', phone: '', type: ''})
  const [isLoading,setIsLoading]=useState(true)
  const customerId= route.params.customerId
  const{showSnackbar}= useSnackbar();
    useEffect(()=>{
      const fetchDataHandler = async () => {
        try {
          const response = await fetch(
            `http://192.168.1.6:8888/api/people/read/${customerId}`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          const customerData = data.result;
          setInitialValues({
            firstname: customerData.firstname,
            lastname: customerData.lastname,
            phone: customerData.phone,
            email: customerData.email,
            type: customerData.type || "",
          });

         
        } catch (Error) {
          throw new Error("Item not found");
        } finally {
          setIsLoading(false);
        }
      }

      fetchDataHandler();

    },[])
    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }     
          const submitHandler=async(values)=>{
            const postData={
              ...values,
              country: "USA",
          people: "6655af58afe60865000019cc",
          }
            try{
              const response= await fetch(`http://192.168.1.6:8888/api/people/update/${customerId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
              });     
              if (response.ok) {
                showSnackbar("successfully update customer","success")
                navigation.navigate("Customer");
              }   else{
                console.error(response)
              }
    
            } 
             catch (error){
              console.error("Failed to update invoice", "error");
              showSnackbar("Failed to update invoice", "error")
            }
          }
  return (
   <View>
          <AddCustomer initialValues={initialValues} handleSubmit={submitHandler} />
   </View>
  )
}

export default EditCustomerScreen
