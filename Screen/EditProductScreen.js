import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import AddProduct from "../Components/AddProduct"
import { useSnackbar } from '../Store/SnackbarContext'
import { readApi, updateApi } from "../Util/UtilApi"
function EditProductScreen({route,navigation}) {
  const [isLoading,setIsLoading]=useState(true)
  
  const productId=route.params.productId
  const{showSnackbar}=useSnackbar()
  const[initialValues,setInitialValues]= useState({ name: "",
    productCategory: "",
    sellingPrice: "",
    taxValue: "",
    purchasePrice: "",
    hsncode: "",})

      useEffect(()=>{
        const fetchDataHandler = async () => {
          try {
      const response = await readApi(`api/product/read/${productId}`);
            const data = await response;
            const productData = data.result;
            console.log(productData)
            setInitialValues({
              name: productData.name,
              productCategory: productData.productCategory.name,
              sellingPrice: productData.price.toString()|| '',
              purchasePrice: productData.customField[0].fieldValue,
              hsncode: productData.customField[1].fieldValue || "",
              taxValue: productData.customField[2].fieldValue.toString() || "",
            });
           
          } catch (Error) {
            throw new Error("Item not found");
          } finally {
            setIsLoading(false);
          }
        }
  
        fetchDataHandler();


  
      },[])
      if(isLoading){
          return<ActivityIndicator size='large'/>
      }
     async function handleSubmit(values){
      const postData = {
        name: values.name,
        price: values.sellingPrice,
        productCategory: "66541ab2e30f1c041bd776e8", //:values.productCategory,,
        currency: "USD",
        customField: [
          {
            fieldName: "costPrice",
            fieldValue: values.purchasePrice,
          },
          {
            fieldName: "hsncode",
            fieldValue: values.hsncode,
          },
          {
            fieldName: "taxvalue",
            fieldValue: values.taxValue,
          },
        ],
      };
      try {
        const headers={
          "Content-Type": "application/json",
        }
        const response = await updateApi(`api/product/update/${productId}`,postData,headers);
          showSnackbar("update product Successfully","success")
          navigation.navigate("Products");
      } catch (error) {
        console.error("error", error);
        showSnackbar("Failed to update invoice","error")
      }
      }


  return (
   <ScrollView>
        <AddProduct initialValues={initialValues} handleSubmit={handleSubmit}/>
   </ScrollView>
  )
}

export default EditProductScreen
