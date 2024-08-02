// Products.js
import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { readApi } from "../Util/UtilApi";
import { AuthContext } from "../Store/AuthContext";
import ItemList from "../Components/Lists/ItemList";
import Icon from "react-native-vector-icons/Ionicons";
import { deleteApi } from "../Util/UtilApi";
import { useSnackbar } from "../Store/SnackbarContext";
import DeleteModal from "../UI/DeleteModal";

export default function Products({ navigation }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setSearchMode } = useContext(AuthContext);

  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchData() {
      console.log("pre")
      try {
        const response = await readApi("api/product/list");
        setProducts(response.result);
      } catch (Error) {
        console.error("Error fetching products", Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [isFocused]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const handleDelete = async () => {
    const updatedInvoice = products.filter((item) => item._id !== deleteId);
    // setInvoices((prev)=>prev.filter((item) => item.id !== productId));
    setProducts(updatedInvoice);
    // setVisible(false);
    try {
      const response = await deleteApi(`api/product/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("item delete successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the item", "error");
    }
  };

  const handleEdit = (id) => {
    navigation.navigate("EditProduct", { productId: id });
  };

  const handleView = (id) => {
    navigation.navigate("ProductDetail", { productId: id });
  };

  const setModalVisible = (id) => {

    setDeleteId(id);
    setIsModalVisible(true);

  }

  return (
    <View style={styles.container}>
      <ItemList
        data={products}
        titleKey="name"
        subtitleKey="price"
        onDelete={setModalVisible}
        onEdit={handleEdit}
        onView={handleView}
      />
      <FAB
        icon={() => <Icon name="add-outline" size={20} color="white" />}
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
        label="Add New Product"
      />
      {isModalVisible && (
        <DeleteModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          handleDelete={handleDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 13,
    right: 0,
    bottom: 0,
    backgroundColor: "#96214e",
    color: "white",
  },
});
