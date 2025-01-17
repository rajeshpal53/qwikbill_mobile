import { ActivityIndicator, Text } from "react-native-paper"
import { useState,useEffect } from "react"
import { View } from "react-native"
import CustomerDetail from "../Components/CustomerDetail"
import { readApi } from "../Util/UtilApi"
function CustomerDetailScreen({route}) {
    const customerId= route.params.customerId
    const[detail,setDetail]= useState([])
    const[isLoading,setIsLoading]= useState(true)
    useEffect(()=>{
        async function fetchDetailHandler() {
            try{
            const response = await readApi(`api/people/read/${customerId}`);
            const data = await response;
             setDetail(data.result);
          }catch(error){
            throw new Error("Item not found");
          }finally{
            setIsLoading(false)
          }
          }
          fetchDetailHandler();
    },[])
            if(isLoading){
              return<ActivityIndicator/>
            }
  return (
    <View >
    <CustomerDetail detail={detail}/>
    </View>
  )
}

export default CustomerDetailScreen
