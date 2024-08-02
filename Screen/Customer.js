// Customer.js
import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { readApi } from "../Util/UtilApi";
import { AuthContext } from "../Store/AuthContext";
import ItemList from "../Components/Lists/ItemList";
import Icon from "react-native-vector-icons/Ionicons";
import { useSnackbar } from "../Store/SnackbarContext";
import DeleteModal from "../UI/DeleteModal";
import { deleteApi } from "../Util/UtilApi";

export default function Customer({ navigation }) {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  // const [customer, setCustomer] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setSearchMode } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi("api/people/list");
        setCustomers(response.result);
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
    console.log("delte id , ", deleteId);
    const updatedCustomers = customers.filter((item) => item._id !== deleteId);
    
    try {
      const response = await deleteApi(`api/people/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("People delete successfully", "success");
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the people", "error");
    }
  };

  const handleEdit = (id) => {
    navigation.navigate("EditCustomer", { customerId: id });
  };

  const handleView = (id) => {
    navigation.navigate("CustomerDetail", { customerId: id });
  };

  const setModalVisible = (id) => {

    setDeleteId(id);
    setIsModalVisible(true);

  }

  return (
    <View style={styles.container}>
      <ItemList
        data={customers}
        titleKey="firstname"
        subtitleKey="phone"
        onDelete={setModalVisible}
        onEdit={handleEdit}
        onView={handleView}
      />
      <FAB
        icon={() => <Icon name="person-add" size={20} color="white" />}
        style={styles.fab}
        onPress={() => navigation.navigate("AddCustomer")}
        label="Add New Customer"
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
