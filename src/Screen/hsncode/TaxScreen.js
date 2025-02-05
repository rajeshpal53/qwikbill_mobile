import React, { useState, useEffect, useContext } from "react";
import { Text, ActivityIndicator, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../../Store/AuthContext";
import ItemList from "../../Components/Lists/ItemList";
import { readApi, deleteApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import { useSnackbar } from "../../Store/SnackbarContext";
import DeleteModal from "../../UI/DeleteModal";
import TaxModel from "./TaxModel";

const fetchSearchData = async (searchQuery) => {
  try {
    const response = readApi(`api/taxes/list?&q=${searchQuery}&fields=taxName`);
    const result = await response;

    return result.result;
  } catch (error) {
    console.error("error to search data", error);
  }
};

export default function TaxScreen({ navigation }) {
  const [taxes, setTaxes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();
  const { searchQuery } = useContext(AuthContext);
  const { shopDetails } = useContext(ShopDetailContext);
  const [openTax, setOpenTax] = useState(false);
  const [editData, setEditData] = useState();
  const [refresh, setRefresh] = useState(false);

  const handleOpen = () => setOpenTax(true);
  // const handleClose = () => setOpenTax(false);

  useEffect(() => {
    fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await readApi(
          // `api/taxes/list?shop=${shopDetails._id}`
          `qapi/hsn-codes`
        );
        console.log("Value response", response);
        setTaxes(response);
      } catch (error) {
        console.error("error", error);
      } finally {
        setIsLoading(false);
        setRefresh(false);
      }
    };
    fetchData();
  }, [isFocused, refresh]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          animating={isLoading}
          color={"#FFC107"}
          size="large"
        />
      </View>
    );
  }

  // useEffect(() => {
  //   const fetchSearchingData = async () => {
  //     const newData = await fetchSearchData(searchQuery);

  //     setTaxes(newData);
  //   };

  //   fetchSearchingData();
  // }, [searchQuery]);

  const handleDelete = async () => {
    console.log("editData.id", editData.id);
    try {
      const response = await deleteApi(`qapi/hsn-codes/${editData}`);
      console.log("Value of responce", response);

      const updatedTaxes = taxes.filter((item) => item.id !== response?.id);
      setTaxes(updatedTaxes); // Update the state with the filtered list
      setIsModalVisible(false);
      setEditData(null);
      setRefresh(true);
      showSnackbar("Tax delete successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the Tax", "error");
    }
  };

  const handleEdit = (item) => {
    console.log("item under edit ", item);
    setEditData(item);
    handleOpen();
  };
  const setModalVisible = (item) => {
    console.log("Item data is ", item);
    setEditData(item?.id);
    setIsModalVisible(true);
  };

  // const handleView = (id) => {
  //   // navigation.navigate("CustomerDetail", { customerId: id });
  // };

  // const renderExpandedContent = (item) => (
  //   <View>
  //     <Text style={{ color: "#777", fontSize: 12 }}>
  //       {" "}
  //       Default :{item.isDefault ? "Yes" : "No"}
  //     </Text>
  //   </View>
  // );

  // const setModalVisible = (item) => {
  //   setDeleteId(item._id);
  //   setIsModalVisible(true);
  // };

  // const menuItems = [
  //   // { title: "View", onPress: (id) => handleView(id) },
  //   { title: "Edit", onPress: (item) => handleEdit(item) },
  //   { title: "Delete", onPress: (item) => setModalVisible(item) },
  // ];

  return (
    <>
      <FlatList
        data={taxes}
        renderItem={({ item }) => (
          <ItemList
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => setModalVisible(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>
              No products found.
            </Text>
          </View>
        )}
      />

      <TaxModel
        visible={openTax}
        data={editData}
        navigation={navigation}
        setRefresh={setRefresh}
        setOpenTax={setOpenTax}
        setEditData={setEditData}
      />

      <FAB
        icon={() => <Icon name="add-outline" size={25} color="black" />}
        theme={{ colors: { primary: "#fff" } }}
        style={styles.fab}
        onPress={() => handleOpen()}
      />
      {isModalVisible && (
        <DeleteModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#0c3b73",
    justifyContent: "center",
    alignItems: "center",
  },
});
