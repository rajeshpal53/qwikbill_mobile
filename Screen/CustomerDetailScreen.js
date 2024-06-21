import { Text } from "react-native-paper"
import { useState,useEffect } from "react"
import { View } from "react-native"
import CustomerDetail from "../Components/CustomerDetail"
function CustomerDetailScreen({route}) {
    const customerId= route.params.customerId
    const[detail,setDetail]= useState([])
    useEffect(()=>{
        async function fetchDetailHandler() {
            if (customerId === undefined) {
              return [];
            }
            const response = await fetch(
              `http://192.168.1.3:8888/api/people/read/${customerId}`,
              {
                credentials: "include",
              }
            );
            if (!response.ok) {
              throw new Error("Item not found");
            }
            const data = await response.json();
             setDetail(data.result);
          }
          fetchDetailHandler();
    },[])
  return (
    <View>
    <Text> for checking of ProductDetailScreen{customerId}</Text>
    <CustomerDetail detail={detail}/>
    </View>
  )
}

export default CustomerDetailScreen
