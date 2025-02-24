import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  FAB,
  Searchbar,
  Portal,
  PaperProvider,
  ActivityIndicator,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import CustomerDetailsCard from "../../Component/Cards/CustomerDetailsCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";
import ProductDetailsCard from "../../Component/Cards/ProductDetailsCard";
// import { setProductitem } from "../../Redux/CartProductRedux/ProductSlice";
import { setProductitem } from "../../Redux/slices/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
// import { ProductItems } from "../../../ProductItems";
import { readApi } from "../../Util/UtilApi";
import { useIsFocused } from "@react-navigation/native";
import FileUploadModal from "../../Components/BulkUpload/FileUploadModal";
import { ShopContext } from "../../Store/ShopContext";
import UserDataContext from "../../Store/UserDataContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProductDetailsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [SelectedEditItem, setSelectedEditItem] = useState(null);
  const [editmodal, seteditmodal] = useState(false);
  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch();
  const [Productdata, SetProductData] = useState([]);
  const isfocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const onStateChange = (state) => setOpen(state.open);
  const [bulkUploadModalVisible, setBulkUploadModalVisible] = useState(false);
  const [loader, setloader] = useState(false);
  const { userData } = useContext(UserDataContext);
  const [searchedData, setSearchedData] = useState([]);

  const { selectedShop } = useContext(ShopContext);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const FilterOption = [
    "Sort By Name",
    "Low to High Price",
    "High to Low Price",
  ];

  useEffect(() => {
    getproductdata(page);
  }, [page, selectedShop]);

  // useEffect(() => {
  const getproductdata = async (pageNum) => {
    const api = `qapi/products/getProductByVendorfk/${selectedShop?.id}?page=${pageNum}&limit=${PAGE_SIZE}`;

    try {
      setloader(true);
      const response = await readApi(api, {
        Authorization: `Bearer ${userData?.token}`,
      });
      if (response?.products?.length > 0) {
        SetProductData((prevData) => [...prevData, ...response?.products]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Unable to fetch Data", error);
      setHasMore(false);
      if (page == 1) {
        SetProductData([]);
      }
    } finally {
      setloader(false);
    }
  };
  //   getproductdata();
  // }, [page, isfocused, selectedShop?.id]);

  // const fetchSearchedData = async () => {
  //   try {
  //     setSearchCalled(true);
  //     setIsLoading(true);
  //     const trimmedQuery = searchQuery?.trim();

  //     let api = `users/searchUser?searchTerm=${trimmedQuery}`;

  //     const response = await readApi(api, {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${userData?.token}`,
  //     });

  //     if (response?.users?.length > 0) {
  //       setSearchedData(response?.users);
  //     } else {
  //       setSearchedData([]);
  //     }
  //   } catch (error) {
  //     if (error?.status === 404) {
  //       setSearchedData([]);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const filteredData = products.filter((item) =>
  //   item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  //  // Load more data when reaching the end
  const loadMoreData = () => {
    if (searchedData?.length <= 0 && !loader && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const openEditModal = (item) => {
    setSelectedEditItem(item);
  };

  useEffect(() => {
    if (SelectedEditItem) {
      seteditmodal(true);
    }
  }, [SelectedEditItem]);

  const handleBulkproduct = () => {
    setBulkUploadModalVisible(true);
    // <FileUploadModal />;
  };

  const Loader = () => {
    if (!loader) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  // if (loader) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator animating={loader} color={"#FFC107"} size="large" />
  //     </View>
  //   );
  // }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Searchbarwithmic
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setsearchmodal={setsearchmodal}
            setTranscript={setTranscript}
            placeholderText="Search User by name ..."
            //    refuser={searchBarRef}
          />
        </View>
        <View View style={{ marginRight: 5 }}>
          <TouchableOpacity
          onPress={()=>console.log("Button pressed")}>
            <MaterialCommunityIcons
              name="menu"
              size={35}
              color="rgba(0, 0, 0, 0.6)"
              style={styles.icon} // Custom style
            />
            {/* <View style={[styles.priceView]}>
              <Text style={styles.label}>Status</Text>
              <CustomDropdown
                paymentStatuses={paymentStatuses}
                setSelectedStatus={setSelectedStatus}
                selectedStatus={selectedStatus}
              />
            </View> */}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={Productdata}
        renderItem={({ item, index }) => (
          <ProductDetailsCard
            item={item}
            index={index}
            navigation={navigation}
            onEdit={() => openEditModal(item)}
            setloader
          />
        )}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>
              No products found.
            </Text>
          </View>
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={Loader}
        // ListFooterComponent={() =>
        //   loader ? <ActivityIndicator size="large" /> : null
        // }
      />

      {/* {loader && <ActivityIndicator size="large" />} */}

      {/* <FAB
        icon={() => <Icon name="add" size={25} color="#fff" />}
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
      /> */}
      <FAB.Group
        open={open}
        visible
        icon={open ? "close" : "plus"}
        actions={[
          {
            icon: "plus",
            label: "Add Product",
            onPress: () => navigation.navigate("AddProduct"),
            style: { backgroundColor: "#2196F3" },
          },
          {
            icon: "archive",
            label: "Bulk Product",
            onPress: handleBulkproduct,
            style: { backgroundColor: "#2196F3" },
          },
        ]}
        onStateChange={onStateChange}
        style={
          {
            // position: 'absolute',
            // right: 10,
            // bottom: 20,
            // elevation: 5, // To give the button a floating effect on Android
          }
        }
        fabStyle={{
          backgroundColor: "#0c3b73", //
        }}
      />

      {/* Bulk Upload Modal */}
      {bulkUploadModalVisible && (
        <FileUploadModal
          setBulkUploadModalVisible={setBulkUploadModalVisible}
        />
      )}

      {editmodal && (
        <EditCustomerDetailsModal
          visible={editmodal}
          seteditmodal={seteditmodal}
          SelectedEditItem={SelectedEditItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#0c3b73",
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    paddingBottom: 70, // Add padding to the bottom of the FlatList content
  },
});

export default ProductDetailsScreen;
