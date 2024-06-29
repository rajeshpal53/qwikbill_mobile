import { ActivityIndicator, Text } from "react-native-paper"
import { useState,useEffect } from "react"
import { View } from "react-native"
import ProductDetail from "../Components/ProductDetail"
import { readApi } from "../Util/UtilApi"
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
            const response = await readApi(`api/product/read/${productId}`) 
            const data = await response;
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
