import React from 'react'
import AddProduct from '../Components/AddProduct'
import { StyleSheet ,ScrollView} from 'react-native'
import { useSnackbar } from '../Store/SnackbarContext'
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
  const response = await fetch(
    "http://192.168.1.9:8888/api/product/create",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }
  );
  if (response.ok) {
    showSnackbar("product added successfully","success")
    navigation.navigate("wertone", { screen: "Products" });
  } else {
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
