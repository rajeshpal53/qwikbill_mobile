import React from 'react'
import AddProduct from '../Components/AddProduct'
import { StyleSheet ,ScrollView} from 'react-native'
import { useSnackbar } from '../Store/SnackbarContext'
import { createApi } from '../Util/UtilApi'
const AddProductScreen = ({navigation}) => {
  const {showSnackbar}=useSnackbar();
  const initialValues={
    name: "",
    productCategory: "",
    sellingPrice: "",
    taxValue: "",
    purchasePrice: "",
    hsncode: "",
  }
  async function  handleSubmit (values){
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
  try{
    headers={
      "Content-Type": "application/json",
    }
  const response = await createApi("api/product/create",postData,headers);
    showSnackbar("product added successfully","success")
    navigation.navigate("wertone", { screen: "Products" });
} catch(error) {
    console.error("errror to create new product", response);
    showSnackbar("error to create new product","error")
  }
  }
  return (
<ScrollView style={styles.container}>
    <AddProduct navigation={navigation} initialValues={initialValues} handleSubmit={handleSubmit}/>
</ScrollView>
  )
}
styles= StyleSheet.create({
    container:{
       flex:1,
    }
})

export default AddProductScreen;
