import React, { useState, useEffect, useContext } from "react";
import { Text, ActivityIndicator, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../../Store/AuthContext";
import ItemList from "../../Components/Lists/ItemList";
import { readApi, deleteApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import { useSnackbar } from "../../Store/SnackbarContext";
import DeleteModal from "../../UI/DeleteModal";

export default function VendorListScreen() {
  const navigation = useNavigation();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();
  const { shopDetails } = useContext(ShopDetailContext);


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
          const response = await readApi(
            `api/company/list`
          );
          setVendors(response.result);
          console.log(response.result, "   res")

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
  console.log(vendors, "vendors");
  const handleDelete = async () => {
    const updatedVendors = vendors.filter((item) => item._id !== deleteId);

    try {
      const response = await deleteApi(`api/company/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("Vendor delete successfully", "success");
      setVendors(updatedVendors);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the Vendor", "error");
    }
  };

  const handleEdit = (item) => {
    // console.log("item under edit ", item)
    navigation.navigate("VendorForm", { vendor: item });
  };

  const handleView = (id) => {

    console.log("vendor Viewed ," , id);
    // navigation.navigate("CustomerDetail", { customerId: id });
  };

  const setModalVisible = (item) => {

    setDeleteId(item._id);
    setIsModalVisible(true);

  }

  const renderExpandedContent = (item) => (
    <View style={{
      marginLeft:"14.5%"
    }}>
      {/* <Text>{item.email}</Text>
      <Text>{(item.isClient)?"Client" : "not a Client"}</Text> */}
      <Text>Hello this is Vendor</Text>
        
    </View>
  );

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (item) => handleEdit(item) },
    { title: "Delete", onPress: (item) => setModalVisible(item) },
  ]

  return (
    <>
    <View style={styles.container}>
      <ItemList
       data={vendors}
       titleKey="name"
       subtitleKey="phone"
       onDelete={setIsModalVisible}
       onEdit={handleEdit}
       onView={handleView}
       expandedItems={renderExpandedContent}
       menuItems={menuItems}
       />
      
    </View>
    <FAB 
    icon={() => <Icon name="add-outline" size={25}      color="black" />}
    theme={{ colors: { primary: '#fff' } }}
    style={styles.fab}
    onPress={() => navigation.navigate("VendorForm")}
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
        margin: 13,
        right: 0,
        bottom:0,
        // padding:0,
        color: "black",
        // backgroundColor: "#96214e",
        zIndex:100,
        color:"white"
      },
});