import { useEffect, useState } from 'react';
import {Text }from 'react-native-paper'
import{View} from 'react-native'
import InvoiceDetail from '../Components/InvoiceDetail';

function InvoiceDetailScreen({route}) {
    const invoiceId= route.params.invoiceId
    const[detail,setDetail]= useState([])
    useEffect(()=>{
        async function fetchDetailHandler() {
            if (invoiceId === undefined) {
              return [];
            }
            const response = await fetch(
              `http://192.168.1.3:8888/api/invoice/read/${invoiceId}`,
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

    console.log(detail)
  return (
    <View>
   <Text> hello InvoiceDetailScreen ishere {invoiceId}</Text>
    <InvoiceDetail detail={detail}/>
    </View>
  )
}

export default InvoiceDetailScreen
