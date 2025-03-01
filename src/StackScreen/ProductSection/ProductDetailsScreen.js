import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
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
import { fontSize, readApi } from "../../Util/UtilApi";
import { useIsFocused } from "@react-navigation/native";
import FileUploadModal from "../../Components/BulkUpload/FileUploadModal";
import { ShopContext } from "../../Store/ShopContext";
import UserDataContext from "../../Store/UserDataContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OpenmiqModal from "../../Modal/Openmicmodal";
import CustomeFilterDropDown from "../../Component/CustomFilterDropDown";

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
  const PAGE_SIZE = 5;

  //Filter Data state
  const [filtermodal, setFilterModal] = useState(false);
  const [filterOptionSelect, SetfilterOptionSelect] = useState("");
  const [filterData, setFilterData] = useState([]);

  // const FilterOption = [
  //   "Sort By Name",
  //   "Low to High Price",
  //   "High to Low Price",
  // ];
  useEffect(() => {
    getproductdata(page);
  }, [page, selectedShop,isfocused]);

  console.log("SHOP ID IS ", selectedShop?.id);
  console.log("DATA OF PRODUCT ---------", Productdata);
  console.log("PAGE NUMBER ------", page);

  const getproductdata = async (pageNum) => {
    const api = `products/getProductByVendorfk/${selectedShop?.id}?page=${pageNum}&limit=${PAGE_SIZE}`;

    try {
      setloader(true);
      const response = await readApi(api, {
        Authorization: `Bearer ${userData?.token}`,
      });
      if (response?.products?.length > 0) {
        SetProductData((prevData) => [...prevData, ...response?.products]);
      } else {
        console.log("Inside a else condition ")
        setHasMore(false);
      }
      if(page==1){
        SetProductData(response?.products);
      }

    } catch (error) {
      console.log("Unable to fetch Data", error);
      setHasMore(false);
      SetProductData([]);
      if (page == 1) {
        console.log("Inside a catch if ")
        SetProductData([]);
      }
    } finally {
      setloader(false);
    }
  };

  useEffect(() => {
    setloader(true);
    const sortData = () => {
      let sortedData = [];

      if (filterOptionSelect === "Sort By Name") {
        sortedData = [...Productdata].sort((a, b) => {
          return a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : -1;
        });
      } else if (filterOptionSelect === "Low to High Price") {
        sortedData = [...Productdata].sort(
          (a, b) => a?.costPrice - b?.costPrice
        );
      } else if (filterOptionSelect === "High to Low Price") {
        sortedData = [...Productdata].sort(
          (a, b) => b?.costPrice - a?.costPrice
        );
      }
      setFilterData(sortedData);
      setloader(false);
    };

    sortData();
  }, [filterOptionSelect]);

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

  // Filter modal Operation
  // const handleFiltermodal = () => {
  //   setFilterModal(true);
  // };

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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
      >
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
        {/* <View View style={{ marginRight: 5 }}>
          <TouchableOpacity onPress={handleFiltermodal}>
            <MaterialCommunityIcons
              name="menu"
              size={35}
              color="rgba(0, 0, 0, 0.6)"
              style={styles.icon} // Custom style
            />
          </TouchableOpacity>
        </View> */}
      </View>

      <View style={styles.allbuttonView}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            "Sort By Name",
            "Low to High Price",
            "High to Low Price",
            "Clear All",
          ].map((suggestbtn, key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.suggestionButton,
                filterOptionSelect === suggestbtn &&
                  styles.selectedSuggestionButton,
              ]}
              onPress={() => SetfilterOptionSelect(suggestbtn)}
            >
              <Text style={styles.suggestbtnText}>{suggestbtn}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filterData?.length > 0 ? filterData : Productdata}
        renderItem={({ item, index }) => (
          <ProductDetailsCard
            item={item}
            index={index}
            navigation={navigation}
            onEdit={() => openEditModal(item)}
            setloader
          />
        )}
        // keyExtractor={(item, index) =>
        //   item.id ? item.id.toString() : index.toString()
        // }
        keyExtractor={(item, index) => index} // Use unique ID
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
      />

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
        visible={bulkUploadModalVisible}
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

      {searchmodal && (
        <OpenmiqModal
          modalVisible={searchmodal}
          setModalVisible={setsearchmodal}
          transcript={transcript}
        />
      )}

      {/* {filtermodal && (
        <CustomeFilterDropDown
          filtermodal={filtermodal}
          filterOptions={FilterOption}
          setFilterModal={setFilterModal}
          SetFilterData={SetfilterOptionSelect}
        />
      )} */}
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
  allbuttonView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
    // backgroundColor:"#F5F5F5"
  },

  suggestionButton: {
    borderWidth: 1,
    borderColor:"white",
    paddingVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "gray",
    color:"#fff",
    elevation:0.5
  },
  suggestbtnText: {
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Medium",
       color:"#fff"
    // backgroundColor:"#F5F5F5"
  },

  selectedSuggestionButton: {
    backgroundColor: "purple",
  },
});

export default ProductDetailsScreen;
