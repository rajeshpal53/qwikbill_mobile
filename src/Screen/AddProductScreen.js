import React from "react";
import AddProduct from "../Components/AddProduct";
import { StyleSheet, ScrollView } from "react-native";
import { useSnackbar } from "../Store/SnackbarContext";
import { createApi } from "../Util/UtilApi";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import { useContext,useState} from "react";
import { ActivityIndicator } from "react-native-paper";
import { ShopContext } from "../Store/ShopContext";
import UserDataContext from "../Store/UserDataContext";
const AddProductScreen = ({ navigation }) => {
  const { selectedShop } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const {userData} = useContext(UserDataContext);
  const initialValues = {
    name: "",
    productCategory: "",
    sellingPrice: "",
    taxValue: "",
    purchasePrice: "",
    hsncode: "",
  };
  async function handleSubmit(values) {

    console.log("selected shop is 23 , ", selectedShop);
    // return;
    const postData = {
      costPrice: values.purchasePrice,
      name: values.name,
      vendorfk: selectedShop.id,
      sellPrice: values.sellingPrice,
      // productCategory: "66541ab2e30f1c041bd776e8", //:values.productCategory,,
      
      // currency: "USD",
      
      // hsncode: values.hsncode,
      // taxvalue: values.taxValue,
    };
    console.log("post Data is , addProduct ", postData)
    try {
  
      setIsLoading(true);
      const response = await createApi("qapi/products/", postData, {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.token}`
      });
      
      // console.log(response?.result);
      console.log("response of creating product is , ", response)
      showSnackbar("Add Product successfully", "success");
      // navigation.navigate("wertone", { screen: "Products" });
    } catch (error) {
      console.error("errror to create new product", error);
      // showSnackbar(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    <ActivityIndicator size="large" />;
  }
  return (
    // <ScrollView style={styles.container}>
      <AddProduct
        navigation={navigation}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
      />
    // </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddProductScreen;
