import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import NoDataFound from "../../Components/NoDataFound";

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
  const [searchCalled, setSearchCalled] = useState(false);

  const { selectedShop } = useContext(ShopContext);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [filterOptionSelect, SetfilterOptionSelect] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [mainLoading, setMainLoading] = useState(false);
  const showSearchedData = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      SetfilterOptionSelect("");
      // getproductdata()
    }, [])
  );


    useEffect(() => {
      if (searchQuery?.length <= 0) {
        setSearchedData([]);
        setSearchCalled(false);
      }
    }, [searchQuery]);


  

  const handleFilterChange = (filterOption) => {
    setloader(true);
    SetfilterOptionSelect(filterOption);
    setPage(1);
  };

  useEffect(() => {
    getproductdata(page);
}, [page, filterOptionSelect, bulkUploadModalVisible, selectedShop?.id]); // Ensure it re-fetches when shop changes

const getproductdata = async (page) => {
    if (page === 1) {
        setHasMore(true);
        setMainLoading(true);
    }
    setloader(true);
    try {
        const api = Apistore(page);
        console.log("API URL:", api);

        if (api) {
            const response = await readApi(api);
            console.log("API Response:", response);

            SetProductData((prevData) => {
                if (page === 1) {
                    return response?.products || []; // Reset data for first page
                } 
                return response?.products?.length > 0 ? [...prevData, ...response?.products] : prevData;
            });

            setTotalPages(response?.totalPages || 1);
            setHasMore(response?.products?.length > 0);
        }
    } catch (error) {
        if (page === 1) {
            SetProductData([]);
        }
        console.error("Unable to fetch data", error);
    } finally {
        setloader(false);
        setMainLoading(false);
    }
};

const Apistore = (page) => {
    let api = `products/getProducts?vendorfk=${selectedShop?.id}&page=${page}&limit=${PAGE_SIZE}`;
    
    if (filterOptionSelect === "Sort By Name") {
        api += "&sortBy=alphabetical";
    } else if (filterOptionSelect === "Low to High Price") {
        api += "&sortBy=lowToHigh";
    } else if (filterOptionSelect === "High to Low Price") {
        api += "&sortBy=highToLow";
    }
    
    return api;
};


  const loadMoreData = () => {
    if (!loader && hasMore && page < totalPages) {
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





  //Search Function
  const fetchSearchedData = async () => {
    try {
      setSearchCalled(true);
      setloader(true);
      const trimmedQuery = searchQuery?.trim();
      console.log("trimmedQuery DATA IS ", trimmedQuery);

      let api = `products/searchProducts?searchTerm=${trimmedQuery}`;

      const response = await readApi(api, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      });

      console.log("RESPONSE DATA IS45989", response);

      if (response?.length > 0) {
        setSearchedData(response);
      } else {
        setSearchedData([]);
      }
    } catch (error) {
      console.log("Unable to get data ", error);
      if (error?.status === 404) {
        setSearchedData([]);
      }
    } finally {
      setloader(false);
    }
  };




  const Loader = () => {
    if (!loader) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  return mainLoading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <Searchbarwithmic
            // refuser={searchbarRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setsearchmodal={setsearchmodal}
            setTranscript={setTranscript}
            placeholderText="Search User by name ..."
            searchData={fetchSearchedData}
            // showSearchedData={showSearchedData}

          />
        </View>
      </View>
      <FlatList
        ListHeaderComponent={() => (
          <>
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
                    onPress={() => handleFilterChange(suggestbtn)}
                  >
                    <Text style={styles.suggestbtnText}>{suggestbtn}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        data={ searchQuery?.length > 0 && searchCalled ? searchedData : Productdata}
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
        keyExtractor={(item, index) => index}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.8}
        ListFooterComponent={Loader}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={() => (
          <View style={{flex:1,marginTop: "40%",}}>
           <NoDataFound textString={"No Products Found"}/>
          </View>
        )}
      />

      <FAB.Group
        open={open}
        visible
        icon={open ? "close" : "plus"}
        actions={[
          {
            icon: "plus",
            label: "Add Product",
            onPress: () => navigation.navigate("AddProduct", { EditData: null, isUpdated: false }),
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
    borderColor: "white",
    paddingVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "gray",
    color: "#fff",
    elevation: 0.5,
  },
  suggestbtnText: {
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    // backgroundColor:"#F5F5F5"
  },

  selectedSuggestionButton: {
    backgroundColor: "purple",
  },
});

export default ProductDetailsScreen;

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

// useEffect(() => {
//   setPage(1);
//   let sortedData = [];
//   if (filterOptionSelect === "Sort By Name") {
//     sortedData = [...Productdata].sort((a, b) => {
//       return a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : -1;
//     });
//   } else if (filterOptionSelect === "Low to High Price") {
//     sortedData = [...Productdata].sort((a, b) => a?.costPrice - b?.costPrice);
//   } else if (filterOptionSelect === "High to Low Price") {
//     sortedData = [...Productdata].sort((a, b) => b?.costPrice - a?.costPrice);
//   } else {
//     console.log("By default working");
//     sortedData = [...Productdata];
//   }
//   SetProductData(sortedData);
// }, [filterOptionSelect]);
// const api = `products/getProductByVendorfk/${selectedShop?.id}?page=${page}&limit=${PAGE_SIZE}`;

// useEffect(() => {
//   getproductdata();
// }, [page, isfocused, bulkUploadModalVisible, filterOptionSelect]);
