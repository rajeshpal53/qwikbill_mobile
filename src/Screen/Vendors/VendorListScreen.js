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
import InvoiceFilterModel from "../../Components/Modal/InvoiceFilterModel";
import UserDataContext from "../../Store/UserDataContext";

const fetchSearchData = async (searchQuery) => {
  try {
    const response = readApi(`api/vendor/list?&q=${searchQuery}&fields=name`);
    const result = await response;

    return result.result;
  } catch (error) {
    console.error("error to search data", error);
  }
};

export default function VendorListScreen() {
  const navigation = useNavigation();
  const [vendors, setVendors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();
  const { shopDetails } = useContext(ShopDetailContext);
  const { searchQuery } = useContext(AuthContext);
  const [filterModal, setFilterModal] = useState(false);
  // const [fetchingUrl, setFetchingurl] = useState(`api/vendor/list?shop=`);
  const { userData } = useContext(UserDataContext);

  // useEffect(() => {
  //   async function fetchData() {
  //     setIsLoading(true);
  //     try {
  //       const url=`${fetchingUrl}${shopDetails._id}`
  //       const response = await readApi(url);
  //       setVendors(response.result);
  //     } catch (error) {
  //       console.error("error", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, [isFocused, fetchingUrl]);

  useEffect(() => {
    const fetchVendorData = async () => {
      console.log("Working function");
      try {
        setIsLoading(true);
        const token = userData?.token;
        // const api = `vendors/${userData?.user?.id}`
        const response = await readApi(
          `vendors//getVendorsByUserId/${userData?.user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("RES -------------", response);
        setVendors(response);
      } catch (err) {
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [isFocused,userData]);

  useEffect(() => {
    console.log("Working function fetchSearchingData")
    const fetchSearchingData = async () => {
      const newData = await fetchSearchData(searchQuery);

      setVendors(newData);
    };

    fetchSearchingData();
  }, [searchQuery]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  const handleDelete = async () => {
    const updatedVendors = vendors.filter((item) => item._id !== deleteId);

    try {
      setIsLoading(true);
      const response = await deleteApi(`api/vendor/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("Vendor delete successfully", "success");
      setVendors(updatedVendors);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the Vendor", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    navigation.navigate("VendorForm", { vendor: item });
  };

  const handleView = (id) => {
    // console.log("vendor Viewed ,", id);
    navigation.navigate("VendorDetail", { vendorId: id });
  };

  const setModalVisible = (item) => {
    setDeleteId(item._id);
    setIsModalVisible(true);
  };

  const renderExpandedContent = (item) => (
    <View>
      <Text style={{ color: "#777", fontSize: 12 }}>{item.people.name}</Text>
    </View>
  );

  const toggleModal = (sortBy) => {
    // Check if invoiceData is empty
    if (vendors.length > 0) {
      setModalVisible(!isModalVisible);
      return;
    }

    let filterData = [];
    let noFound = <Text>NO Data found</Text>;

    if (sortBy === "paid") {
      setFetchingurl(`api/vendor/filter?filter=paymentStatus&equal=paid&shop=`);
    } else if (sortBy === "unpaid") {
      setFetchingurl(
        `api/vendor/filter?filter=paymentStatus&equal=unpaid&shop=`
      );
    } else {
      setFetchingurl(`api/vendor/list?shop=`);
    }
    // Only update if filterData is not empty
    if (filterData.length > 0) {
    }
    setFilterModal(!filterModal);
  };
  const openModel = () => {
    setFilterModal(true);
  };

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (item) => handleEdit(item) },
    { title: "Delete", onPress: (item) => setModalVisible(item) },
  ];

  return (
    <View style={styles.container}>
      <View>
        <ItemList
          data={vendors}
          titleKey="paymentStatus"
          subtitleKey="amount"
          onDelete={setIsModalVisible}
          onEdit={handleEdit}
          onView={handleView}
          expandedItems={renderExpandedContent}
          menuItems={menuItems}
        />
      </View>
      <FAB
        icon={() => <Icon name="add-outline" size={25} color="black" />}
        theme={{ colors: { primary: "#fff" } }}
        style={styles.fab}
        onPress={() => navigation.navigate("VendorForm")}
      />
      {vendors.length > 0 && (
        <FAB
          icon="filter"
          style={styles.filterfab}
          onPress={() => {
            openModel();
          }}
        />
      )}

      <InvoiceFilterModel
        style={{ backgroundColor: "lightblue" }}
        isModalVisible={filterModal}
        setModalVisible={setFilterModal}
        toggleModal={toggleModal}
        vendorFilter={true}
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
  fab: {
    position: "absolute",
    margin: 13,
    right: 0,
    bottom: 0,
    // padding:0,
    color: "black",
    // backgroundColor: "#96214e",
    zIndex: 100,
    color: "white",
  },
  filterfab: {
    position: "absolute",
    margin: 13,
    right: 0,
    bottom: 70,
    // padding:0,
    color: "black",
    // backgroundColor: "#96214e",
    zIndex: 100,
    color: "white",
  },
  container: {
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
  },
});
