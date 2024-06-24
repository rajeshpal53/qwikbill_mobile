import { Text } from "react-native-paper"
import { useState,useEffect } from "react"
import { View } from "react-native"
import ProductDetail from "../Components/ProductDetail"
function ProductDetailScreen({route}) {
    const productId= route.params.productId
    const[detail,setDetail]= useState([])
    useEffect(()=>{
        async function fetchDetailHandler() {
            if (productId === undefined) {
              return [];
            }
            const response = await fetch(
              `http://192.168.1.2:8888/api/product/read/${productId}`,
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
    <View style={{justifyContent:"center"}}>
    <ProductDetail detail={detail}/>
    </View>
  )
}

export default ProductDetailScreen
