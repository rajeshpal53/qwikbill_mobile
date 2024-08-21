import React from "react";
import AddProduct from "../Components/AddProduct";
import { StyleSheet, ScrollView } from "react-native";
import { useSnackbar } from "../Store/SnackbarContext";
import { createApi } from "../Util/UtilApi";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import { useContext,useState} from "react";
import { ActivityIndicator } from "react-native-paper";
const AddProductScreen = ({ navigation }) => {
  const { shopDetails } = useContext(ShopDetailContext);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const initialValues = {
    name: "",
    productCategory: "",
    sellingPrice: "",
    taxValue: "",
    purchasePrice: "",
    hsncode: "",
  };
  async function handleSubmit(values) {
    const postData = {
      name: values.name,
      price: values.sellingPrice,
      productCategory: "66541ab2e30f1c041bd776e8", //:values.productCategory,,
      shop: shopDetails._id,
      currency: "USD",
      costprice: values.purchasePrice,
      hsncode: values.hsncode,
      taxvalue: values.taxValue,
    };
    try {
      headers = {
        "Content-Type": "application/json",
      };
      setIsLoading(true);
      const response = await createApi("api/product/create", postData, headers);
      showSnackbar("product added successfully", "success");
      console.log(response.result);
      navigation.navigate("wertone", { screen: "Products" });
    } catch (error) {
      console.error("errror to create new product", response);
      showSnackbar("error to create new product", "error");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    <ActivityIndicator size="large" />;
  }
  return (
    <ScrollView style={styles.container}>
      <AddProduct
        navigation={navigation}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
      />
    </ScrollView>
  );
};
styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddProductScreen;
