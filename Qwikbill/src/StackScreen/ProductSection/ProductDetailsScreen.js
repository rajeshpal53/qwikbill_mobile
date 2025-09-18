import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import {
  ActivityIndicator,
  FAB
} from "react-native-paper";
import ProductDetailsCard from "../../Component/Cards/ProductDetailsCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import EditCustomerDetailsModal from "../../Components/Modal/EditCustomerDetailsModal";
// import { setProductitem } from "../../Redux/CartProductRedux/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
// import { ProductItems } from "../../../ProductItems";
import { useIsFocused } from "@react-navigation/native";
import FileUploadModal from "../../Components/BulkUpload/FileUploadModal";
import OpenmiqModal from "../../Components/Modal/Openmicmodal";
import { ShopContext } from "../../Store/ShopContext";
import UserDataContext from "../../Store/UserDataContext";
import { deleteApi, fontSize, readApi } from "../../Util/UtilApi";
//import CustomeFilterDropDown from "../../Component/CustomFilterDropDown";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import NoDataFound from "../../Components/NoDataFound";
import DeleteModal from "../../UI/DeleteModal";
import { useSnackbar } from "../../Store/SnackbarContext";
import SelectionOverlay from "../../Component/SelectionOverlay";

const ProductDetailsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [SelectedEditItem, setSelectedEditItem] = useState(null);
  const [editmodal, seteditmodal] = useState(false);
  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch();
  const [Productdata, SetProductData] = useState([]);
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const onStateChange = (state) => setOpen(state.open);
  const [bulkUploadModalVisible, setBulkUploadModalVisible] = useState(false);
  const [loader, setloader] = useState(false);
  const { userData } = useContext(UserDataContext);
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { selectedShop } = useContext(ShopContext);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [filterOptionSelect, SetfilterOptionSelect] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [mainLoading, setMainLoading] = useState(false);
  const showSearchedData = useRef(false);
  const [refresh, setRefresh] = useState(false);
  const [ProductId, setProductId] = useState("");
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
const [selectedProducts, setSelectedProducts] = useState([]);
const [selectionMode, setSelectionMode] = useState(false);
  console.log("token is", userData?.token)


  const toggleSelectProduct = (productId) => {
  setSelectedProducts((prev) => {
    if (prev.includes(productId)) {
      return prev.filter((id) => id !== productId); // deselect
    } else {
      return [...prev, productId]; // select
    }
  });
};

  useEffect(() => {
  if (isFocused) {
    // Always reload fresh data when screen comes into focus
    setPage(1);
    getproductdata(1);
  }
}, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      SetfilterOptionSelect("");
      // getproductdata()
    }, [])
  );

  useEffect(() => {
  setPage(1);
  getproductdata(1); // or whatever your fetch function is
}, [filterOptionSelect]);


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
  }, [
    page,
    filterOptionSelect,
    bulkUploadModalVisible,
    selectedShop?.vendor?.id,
    refresh,
  ]);
  console.log("SELECTED SHOP123 ", selectedShop)

  const onRefresh = async () => {
    setRefreshing(true);  // Set refreshing state to true
    await getproductdata(1); // Fetch new data
    setRefreshing(false); // Set refreshing state to false once done
  };


  const handleBulkDelete = async () => {
  try {
    // call delete API with selectedProducts
    console.log("Deleting products with IDs:", selectedProducts);
     const response=await deleteApi("products/deleteMultipleProducts",{ Authorization: `Bearer ${userData.token}`,},{productIds:selectedProducts});
    SetProductData((prev) => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    showSnackbar(`${response?.deletedIds?.length} products deleted successfully.`, "success");
    setTimeout(() => {
      if(response?.skippedIds?.length > 0){
        showSnackbar(
    `${response?.skippedIds?.length} product(s) were skipped because they are linked to invoices.`,
    "error"
  );
      }
  
}, 2000);
  } catch (error) {
    console.error(error);
    showSnackbar(`${error.data.message}` ,"error"
  );
  }
};

  const Apistore = (page) => {
    let api = `products/getProducts?vendorfk=${selectedShop?.vendor?.id}&page=${page}&limit=${PAGE_SIZE}`;
    console.log(" api for all products", api)

    if (filterOptionSelect === "Sort By Name") {
      api += "&sortBy=alphabetical";
    } else if (filterOptionSelect === "Low to High Price") {
      api += "&sortBy=lowToHigh";
    } else if (filterOptionSelect === "High to Low Price") {
      api += "&sortBy=highToLow";
    }
    return api;
  };

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
        //console.log("API Response ", response);
        console.log("appi response of all productsss ", response);

        // SetProductData((prevData) => {
        //   if (page === 1) {
        //     return response?.products || []; // Reset data for first page
        //   }
        //   return response?.products?.length > 0
        //     ? [...prevData, ...response?.products]
        //     : prevData;
        // });

        SetProductData((prevData) => {
          const newData = page === 1
            ? response?.products || []
            : [...prevData, ...(response?.products || [])];

          if (!filterOptionSelect || filterOptionSelect === "") {
            return newData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }

          // 🔁 Otherwise, assume backend has already sorted the data
          return newData;
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

  useEffect(() => {
    console.log("jayesh produccts data is ", Productdata);
  }, [])

  console.log(userData?.token, "toke iss ")

  const loadMoreData = () => {
    if (!loader && hasMore && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const openEditModal = (item) => {
    setSelectedEditItem(item);
  };

  const HandleDeleteProduct = async (ProductId) => {
    const api = `https://qwikbill.in/qapi/`
    console.log("Data of item is 345", ProductId);

    console.log(` api is ${api}products/${ProductId}`)

    try {
      setloader(true);
      // The following block is the actual delete logic using your deleteApi helper
      const response = await deleteApi(`products/${ProductId}`, { Authorization: `Bearer ${userData.token}`, });

      console.log("GET ALL DATA IS125 ", response?.data);
      if (response?.data) {
        showSnackbar(t("Product deleted successfully")), "success";
         setRefresh((prev) => !prev); 
          SetProductData((prev) => prev.filter((p) => p.id !== ProductId));
        await getproductdata(1);


        console.log("GET ALL DATA IS response", response.data);
      } else {
        console.log("No data returned from delete API");
        showSnackbar(t("No data returned from delete API","error"));
        showSnackbar(t("No data returned from delete API", "error"));
      }
    } catch (error) {
      console.log("Unable to delete role data", error);
      showSnackbar("Unable to delete role data", "error")
    } finally {
      setloader(false);
      setVisible(false);
    }
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

    // setSearchCalled(true);
    // setloader(true);
    // const trimmedQuery = searchQuery?.trim();
    // console.log("trimmedQuery DATA IS ", trimmedQuery);

    const trimmedQuery = searchQuery.trim();

    // ⬇️  1) Skip the call if nothing to search
    if (!trimmedQuery) {
      setSearchedData([]);     // clear previous results
      setSearchCalled(false);  // so FlatList shows full data set
      return;
    }

    try {
      setSearchCalled(true);
      setloader(true);


      //let api = `products/searchProducts?searchTerm=${trimmedQuery}&vendorfk=${selectedShop?.vendor?.id}`;
      const api = `products/searchProducts?searchTerm=${encodeURIComponent(trimmedQuery)}&vendorfk=${selectedShop.vendor.id}`;


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

const handleLongSelect = (id) => {
  setSelectionMode(true);
  setSelectedProducts([id]); // first selection
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
            placeholderText="Search Product by name..."
            searchData={fetchSearchedData}
          // showSearchedData={showSearchedData}
          />
        </View>
      </View>
      <FlatList
        ListHeaderComponent={() => (
          <>
            {
              Productdata.length > 0 ? (
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
                        <Text style={styles.suggestbtnText}>{t(suggestbtn)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                null
              )
            }
          </>
        )}
        data={
          searchQuery?.length > 0 && searchCalled ? searchedData : Productdata
        }
        renderItem={({ item, index }) => (
          <ProductDetailsCard
            item={item}
            index={index}
            navigation={navigation}
            onEdit={() => openEditModal(item)}
            setRefresh={setRefresh}
            setProductId={setProductId}
            setVisible={setVisible}
            isSelected={selectedProducts.includes(item.id)}  // ✅ highlight if selected
    onSelect={() => toggleSelectProduct(item.id)}
   
      onLongSelect={() => handleLongSelect(item.id)}
  selectionMode={selectionMode}
          />
        )}
        // keyExtractor={(item, index) =>
        //   item.id ? item.id.toString() : index.toString()
        // }
        keyExtractor={(item) => item.id?.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Control the refreshing state
            onRefresh={onRefresh} // Trigger the onRefresh function when pulled down
            colors={["#0a6846"]} // Color of the refresh spinner
            progressBackgroundColor={"#fff"} // Background color of the spinner
          />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.8}
        ListFooterComponent={Loader}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, marginTop: "38%" }}>
            <NoDataFound textString={"No Products Found"} />
          </View>
        )}
      />

      {selectedProducts.length > 0 && (
  <SelectionOverlay
    selectedProducts={selectedProducts}
    onDelete={handleBulkDelete}
     onClearSelection={() => setSelectedProducts([])}
  />
)}
      {
        (selectedShop?.role?.name === "owner" || selectedShop?.role?.name === "manager") && (
          <FAB.Group
            open={open}
            visible
            icon={open ? "close" : "plus"}
            actions={[
              {
                icon: "plus",
                label: t("Add Product"),
                onPress: () => {
                  if (selectedShop) {
                    navigation.navigate("AddProduct", {
                      EditData: null,
                      isUpdated: false,
                      setRefresh: setRefresh,
                    });
                  } else {
                    Alert.alert(t('Please first become a vendor'));
                  }
                },
                style: { backgroundColor: "#2196F3" },
              },
              {
                icon: "archive",
                label: t("Bulk Product"),
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
              backgroundColor: "#007bff", //
            }}
          />
        )
      }


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
      {visible && (
        <DeleteModal
          visible={visible}
          setVisible={setVisible}
          handleDelete={() => HandleDeleteProduct(ProductId)}
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
    marginHorizontal: 5,
    paddingHorizontal: 10,
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

