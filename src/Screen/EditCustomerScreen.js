import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import { Text,ActivityIndicator } from "react-native-paper"
import AddCustomer from "../Components/AddCustomer"
import { useSnackbar } from '../Store/SnackbarContext'
import { readApi, updateApi } from "../Util/UtilApi"
function EditCustomerScreen({route,navigation}) {
  const[initialValues,setInitialValues]=useState({name: '', email: '', phone: '', type: ''})
  const [isLoading,setIsLoading]=useState(true)
  const customerId= route.params.customerId
  console.log( "cstmr id is ", customerId)
  const{showSnackbar}= useSnackbar();
    useEffect(()=>{
      const fetchDataHandler = async () => {
        try {
          const response = await readApi(`api/people/read/${customerId}`);
          const data = await response;
          const customerData = data.result;
          console.log(customerData)
          setInitialValues({
            name: customerData.name,
            gstnumber: customerData.gstnumber,
            address: customerData.address,
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
          people: customerId,
          }
            try{
              const headers={
                "Content-Type": "application/json",
              }
              const response= await updateApi(`api/people/update/${customerId}`,postData,headers);
                showSnackbar("successfully update customer","success")
                navigation.navigate("Customer");
            }
             catch (error){
              console.error("Failed to update invoice", "error");
              showSnackbar("Failed to update invoice", "error")
            }
          }
  return (
   <ScrollView>
          <AddCustomer initialValues={initialValues} handleSubmit={submitHandler} buttonText="Edit Customer" />
   </ScrollView>
  )
}

export default EditCustomerScreen
