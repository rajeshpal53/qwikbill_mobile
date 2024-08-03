import React, { useState, useEffect, useContext } from "react";
import { Text } from "react-native-paper";
import { FAB, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../../Store/AuthContext";
import ItemList from "../../Components/Lists/ItemList";
import { readApi, deleteApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";

export default function VendorListScreen() {
  const navigation = useNavigation();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();
  const shopDetails = useContext(ShopDetailContext).shopDetails;

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchData = async () => {
          const response = await readApi(
            `api/company/list?shop=${shopDetails._id}`
          );
          setVendors(response.result);
        };

      } catch (error) {
        console.error("error", error);
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

    const updatedVendors = vendors.filter((item) => item._id !== deleteId);
    
    try {
      const response = await deleteApi(`api/company/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar(" delete successfully", "success");
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the people", "error");
    }
  };

  return (
    <View>
      <Text>View vendors</Text>
    </View>
  );
}
