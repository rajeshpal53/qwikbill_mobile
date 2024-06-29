import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import AddProduct from "../Components/AddProduct"
import { useSnackbar } from '../Store/SnackbarContext'
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
            const response = await fetch(
              `http://192.168.1.6:8888/api/product/read/${productId}`,
              {
                credentials: "include",
              }
            );
            const data = await response.json();
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
        const response = await fetch(
          `http://192.168.1.6:8888/api/product/update/${productId}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          }
        );
        if (response.ok) {
          showSnackbar("update product Successfully","success")
          navigation.navigate("Products");
        }
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
