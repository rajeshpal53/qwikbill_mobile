import { lazy, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { View } from "react-native";
import InvoiceDetail from "../Components/InvoiceDetail";

function InvoiceDetailScreen({ route }) {
  const invoiceId = route.params.invoiceId;
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchDetailHandler() {
      if (invoiceId === undefined) {
        return [];
      }
      try {
      const response = await fetch(
        `http://192.168.1.6:8888/api/invoice/read/${invoiceId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      setDetail(data.result);
    }catch(errror){
          throw new Error("Item not found");
        
      }
      finally{
        setLoading(false)
      }
    }
    fetchDetailHandler();
  }, []);


    const copydetail= detail
    if(loading){
      return <ActivityIndicator size='large'/>
    }

  return (
    <View>
     <InvoiceDetail detail={copydetail} />
    </View>
  );
}

export default InvoiceDetailScreen;
