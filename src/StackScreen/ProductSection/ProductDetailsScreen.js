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

  const { selectedShop } = useContext(ShopContext);
  const [page, setPage] = useState(1); // Track the current page
  const PAGE_SIZE = 10;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  console.log("DATTTTTTTTTTTTaaaaaaaaaa", Productdata)

  useEffect(() => {
    const getproductdata = async () => {
      try {
        setloader(true);
        const api = `qapi/products/getProductByVendorfk/${selectedShop?.id}?page=${page}&limit=${PAGE_SIZE}`;
        const response = await readApi(api);
        // dispatch(setProductitem(response));
        // SetProductData(response);
        if (page === 1) {
          console.log("Inside a if condition")
          console.log("DATA OF RESPONCEEEEEEEEE",response?.products )
          SetProductData(response?.products);
        } else {
          SetProductData((prevData) => [...prevData, ...response?.products]);
        }
      } catch (error) {
        console.log("Unable to fetch Data", error);
        SetProductData([]);
      } finally {
        setloader(false);
      }
    };
    getproductdata();
  }, [page, isfocused, selectedShop?.id]);



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

  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={loader} color={"#FFC107"} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setsearchmodal}
        setTranscript={setTranscript}
        placeholderText="Search User by name ..."
        //    refuser={searchBarRef}
      />

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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>
              No products found.
            </Text>
          </View>
        )}
        // onEndReached={handleLoadMore} // Trigger when the user scrolls to the end
        // onEndReachedThreshold={0.5} // Trigger when 50% of the list is scrolled
        ListFooterComponent={() =>
          isLoadingMore ? <ActivityIndicator size="large" /> : null
        }
      />

      {loader && <ActivityIndicator size="large" />}

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
