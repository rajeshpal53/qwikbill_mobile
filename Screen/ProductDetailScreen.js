import { ActivityIndicator, Text } from "react-native-paper"
import { useState,useEffect } from "react"
import { View } from "react-native"
import ProductDetail from "../Components/ProductDetail"
function ProductDetailScreen({route}) {
    const productId= route.params.productId
    const[detail,setDetail]= useState([])
    const[isLoading, setLoading]= useState(true);
    useEffect(()=>{
        async function fetchDetailHandler() {
            if (productId === undefined) {
              return [];
            }
            try{
            const response = await fetch(
              `http://192.168.1.2:8888/api/product/read/${productId}`,
              {
                credentials: "include",
              }
             
            ) 
            const data = await response.json();
            setDetail(data.result);
          }
           catch(Error) {
              throw new Error("Item not found");
            }
            finally{
              setLoading(false)
            }
           
          }
          fetchDetailHandler();
    },[])
    if(isLoading){
      return <ActivityIndicator size='large'/>
    }
  return (
    <View style={{justifyContent:"center"}}>
    <ProductDetail detail={detail}/>
    </View>
  )
}

export default ProductDetailScreen
