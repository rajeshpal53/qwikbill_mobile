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

  

  if (isLoading) {
    <ActivityIndicator size="large" />;
  }
  return (
    // <ScrollView style={styles.container}>
      <AddProduct
        navigation={navigation}
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
