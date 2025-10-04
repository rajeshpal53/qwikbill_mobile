
import React, { useEffect, useContext, useState, useRef } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { API_BASE_URL, readApi } from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";
import { ActivityIndicator, FAB } from "react-native-paper";
import ViewInvoiceCard from "../../Components/ViewInvoiceCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Components/Modal/Openmicmodal";
import FilterButtons from "../../Components/FilterButtons";
import FilterModal from "../../Components/Modal/FilterModal";
import UserDataContext from "../../Store/UserDataContext";
import NoDataFound from "../../Components/NoDataFound";
import { Filter } from "react-native-svg";
import { useTheme } from "../../../constants/Theme";
import SelectionOverlay from "../../Component/SelectionOverlay";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../Store/SnackbarContext";
import { deleteApi } from "../../Util/UtilApi";
import { addToCart, removeFromCart } from "../../Redux/slices/CartSlice";

function ViewInvoiceScreen1({ navigation }) {
  const carts = useSelector((state) => state.cart.Carts);
  const dispatch = useDispatch();

  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // const [mainLoading, setMainLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [searchModal, setSearchmodal] = useState(false);
  const [selected, setSelected] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [dateRange, setDateRange] = useState({});
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const searchBarRef = useRef();
  const debounceTimeout = useRef(null);
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [transcript, setTranscript] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);
  const vendorId = selectedShop?.vendor?.id;          // <- **centralised**
  const authHeader = { Authorization: `Bearer ${userData?.token}` };
  const [typeFilter, setTypeFilter] = useState("");
  const { colors, isDark } = useTheme();
  const [selectedInvoice, setSelectedInvoice] = useState([]);
const [selectionMode, setSelectionMode] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const[visible,setVisible]=useState(false)
  const {showSnackbar}=useSnackbar();
  const [apiError, setApiError] = useState(false);
  // useEffect(() => {
  //   if (page === 1) {
  //     fetchInvoices(1);
  //   } else {
  //     setPage(1); // triggers other useEffect, fetchInvoices will run from there
  //   }
  // }, [selected, sortBy, selectedShop?.vendor?.id]);

  // useEffect(() => {
  //   if (page > 1) {
  //     fetchInvoices(page);
  //   }
  // }, [page]);
  // console.log(" slected shop in invoiceScreen1", selectedShop);


  const toggleSelectInvoice = (invoiceId) => {
  setSelectedInvoice((prev) => {
    if (prev.includes(invoiceId)) {
      return prev.filter((id) => id !== invoiceId); // deselect
    } else {
      return [...prev, invoiceId]; // select
    }
  });
};
const handleBulkDelete = async () => {
  try {
    // call delete API with selectedProducts
    // console.log("Deleting products with IDs:", selectedProducts);
     const response=await deleteApi("invoice/deleteMultipleInvoice",{ Authorization: `Bearer ${userData.token}`,},{invoiceIds:selectedInvoice});
     setInvoices((prev) => prev.filter(i => !selectedInvoice.includes(i.id)));

    setSelectedInvoice([]);
    // showSnackbar(`${response?.deletedIds?.length} invoice deleted successfully.`, "success");;
        showSnackbar(` invoice deleted successfully.`, "success");;
        setSelectionMode(false)
  } catch (error) {
    console.error(error);
    showSnackbar(`${error.data.message}` ,"error"
  );
  }
};



  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInvoices(1, true);
    setRefreshing(false);
  };



  // Unified effect for filters and selected shop
  useEffect(() => {
  if (selectedShop?.vendor?.id && !apiError) {
    setPage(1);
    setSearchQuery("");
    setSearchCalled(false);
    setHasMore(true);
    fetchInvoices(1, true);
  }
}, [selected, sortBy, typeFilter, selectedShop?.vendor?.id,dateRange]);


  // Only used for pagination
  useEffect(() => {
    if (page > 1) {
      if (searchQuery?.length > 0 && searchCalled) {
        fetchSearchedData(searchQuery, page);
      } else {
        fetchInvoices(page);
      }
    }
  }, [page]);
  

  const buildApiUrl = (pageNum) => {
    const id = selectedShop?.vendor?.id
    console.log(id, date, "inViewinVoiceScreen")
    let api = `invoice/getInvoices?vendorfk=${vendorId}&page=${pageNum}&size=10`;
    if (sortBy && sortBy != "datewise") api += `&dateWise=${sortBy}`;
    if (sortBy && sortBy == "datewise")
      api += `&startDate=${formatDate(dateRange.startDate)}&endDate=${formatDate(
        dateRange.endDate
      )}`;
    if (selected === "Partially Paid") api += "&statusfk=3";
    if (selected === "Unpaid") api += "&statusfk=1";
    if (selected === "Paid") api += "&statusfk=2";
     if (selected === "Quatation") api += "&statusfk=4";

    if (typeFilter) {
      api += `&type=${typeFilter}`;
    }
    console.log(api, "api ssss");
    return api;
  };

 const fetchInvoices = async (pageNum = 1, force = false) => {
  if (!force && pageNum === 1 && !mainLoading) return;
  if (pageNum === 1) {
    setMainLoading(true);
    setHasMore(true);
    setApiError(false); // reset error on new fetch
  }
  setIsLoading(true);
  try {
    const api = buildApiUrl(pageNum);
    const response = await readApi(api, authHeader);

    if (pageNum === 1) {
      setInvoices(response.invoices || []);
    } else if (response?.invoices?.length > 0) {
      setInvoices(prev => [...prev, ...response.invoices]);
    } else {
      setHasMore(false);
    }
  } catch (err) {
    setApiError(true); // stop repeated calls
    if (pageNum === 1) setInvoices([]);
    console.error("API fetch failed:", err);
  } finally {
    setIsLoading(false);
    setMainLoading(false);
  }
};

    const loadMoreData = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);

      if (searchQuery?.length > 0 && searchCalled) {
        fetchSearchedData(searchQuery, nextPage);
      } else {
        fetchInvoices(nextPage);
      }
    }
  };


  const handleLongSelect = (id) => {
  setSelectionMode(true);
  setSelectedInvoice([id]); // first selection
};




  const onSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    fetchSearchedData(query, 1);
  };



  // useEffect(() => {
  //   if (page > 1) fetchInvoices(page);
  // }, [page, selectedShop]);
  console.log("type  filterisss ", typeFilter)
  const delteHandler=async(invoice,toggleHandler)=>{
      try{
        console.log("invoice to be deleted",`${API_BASE_URL}invoice/invoices/${invoice?.id}`)
        const response=await deleteApi(`invoice/invoices/${invoice?.id}`,{Authorization:`Bearer ${userData?.token}`},)
        if(response){
        setInvoices((prev) =>
  prev.filter((i) => i.id !== invoice?.id)
);
        }
        showSnackbar("Invoice delted successfully","success")
      }catch(error){
        showSnackbar("failed to delete invoice","error")
      }
      finally{
        toggleHandler()
      }
  }


  const cloneInvoiceHandler=(invoice,toggleHandler)=>{
     console.log("invoice is",invoice)
      const newCart = {
      address: invoice?.address || "",
      discount: Number(invoice?.discount) || 0, // not present in invoice
      finaltotal: Number(invoice?.finaltotal) || 0,
      gstNumber: invoice?.gstNumber || null,
      mobile: invoice?.user?.mobile || "",
      name: invoice?.user?.name || "",
      partialAmount: 0,
      paymentMode: invoice?.paymentMode || "Cash",
     discountRate:Number(invoice?.invoiceProducts?.[0]?.discountRate),
      products: invoice?.invoiceProducts?.map((p) => {
    console.log("p in map is",p)
       return (       
        {
        id: p?.productfk,
        price: Number(p?.price) || 0,
        productname: p?.Product?.name || "Unknown Product", 
        name: p?.Product?.name || "Unknown Product", /// ✅ you need to join with product table if available
        quantity: p?.quantity || 1,
        taxRate: Math.round(Number(p?.gstRate) * 100) ||p?.Product?.taxRate , // gstRate is 0.180 => 18
      discountRate:Number(p?.discountRate),
      sellPrice:Number(p?.Product?.sellPrice),
      }   
    )}) || [],
      remainingamount: Number(invoice?.finaltotal) || 0,
      statusfk: invoice?.statusfk, // default to new status
      subtotal: Number(invoice?.subtotal) || 0,
      userId: invoice?.usersfk,
      usersfk: invoice?.usersfk,
      vendorfk: invoice?.vendorfk,
    };
    console.log("🚀 newCart:", newCart);
    console.log("🚀 products:", newCart?.products);
    invoice?.invoiceProducts?.forEach((p) => {
     dispatch(addToCart({
        id: p?.productfk,
        price: Number(p?.price) || 0,
        productname: p?.name || "Unknown Product", // ✅ you need to join with product table if available
         name: p?.Product?.name || "Unknown Product", /// ✅ you need to join with product table if available
        quantity: p?.quantity ,
        taxRate: Math.round(Number(p?.gstRate) * 100) ||p?.Product?.taxRate , // gstRate is 0.180 => 18
      discountRate:Number(p?.discountRate),
      sellPrice:Number(p?.Product?.sellPrice),
      gstAmount:Number(p?.gstAmt),
      }))
    })
    navigation.navigate("CreateInvoice", {
      iscloneItem:newCart
    });

    toggleHandler(); // close menu

  }



  const fetchSearchedData = async (query, pageNum = 1) => {
    setSearchCalled(true); // Mark search as initiated
    setIsLoading(true);
    try {
      const response = await readApi(
        `invoice/getInvoices?page=${pageNum}&limit=10&searchTerm=${query}`,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        }
      );
      console.log("Search Response", response);

      if (response?.invoices?.length > 0) {
        if (pageNum === 1) {
          setSearchedData(response.invoices);
        } else {
          setSearchedData(prev => [...prev, ...response.invoices]);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Search error", err);
      if (pageNum === 1) setSearchedData([]);
    } finally {
      setIsLoading(false);
    }
  };




function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

  const Loader = () => {
    // if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  const handleFilterChange = (filterType) => {
    setSelected(filterType);

  };

  console.log(colors?.background,"inViewScreen")

  return (
    <View style={{ backgroundColor: colors?.background, flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <View style={{ marginTop: 8,backgroundColor: colors?.background, }}>
            <Searchbarwithmic
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setsearchmodal={setSearchmodal}
              setTranscript={setTranscript}
              placeholderText="Search Invoices..."
              refuser={searchBarRef}
              searchData={onSearch}
              fetchData={fetchInvoices}

            />

            {(invoices.length > 0 ||
              selected !== "All" ||
              sortBy !== "" ||
              typeFilter !== "" ||
              Object.keys(dateRange).length > 0 ||
              !(date.startDate.toDateString() === new Date().toDateString() &&
                date.endDate.toDateString() === new Date().toDateString())
            ) && (
                <FilterButtons onFilterChange={handleFilterChange} selected={selected} />
              )}


          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0a6846"]}
            progressBackgroundColor={"#fff"}
          />
        }
        contentContainerStyle={{ paddingBottom: 140 }}
        data={searchQuery?.length > 0 && searchCalled ? searchedData : invoices}
        renderItem={({ item }) => (
          <ViewInvoiceCard
           invoice={item} 
          navigation={navigation}
            setInvoiceId={setInvoiceId}
            setVisible={setVisible}
            isSelected={selectedInvoice.includes(item.id)}  // ✅ highlight if selected
    onSelect={() => toggleSelectInvoice(item.id)}
    cloneInvoiceHandler={cloneInvoiceHandler}
    delteHandler={delteHandler}
   
      onLongSelect={() => handleLongSelect(item.id)}
  selectionMode={selectionMode}/>
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <Loader /> : null}
        ListEmptyComponent={() =>
          !mainLoading && invoices.length <= 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "38%",

              }}
            >
              <NoDataFound textString={"No Invoice Found"} />
            </View>
          ) : null
        }
      />

      {/* {
        invoices.length >= 1 && (

          <FAB
            style={{
              position: "absolute",
              margin: 16,
              right: 5,
              bottom: 10,
              backgroundColor: "#26a0df",
            }}
            icon="filter"
            onPress={() => setModalVisible(true)}
            color="#fff"
          />
        )
      } */}



      {(invoices.length > 0 ||
        selected !== "All" ||
        sortBy !== "" ||
        typeFilter !== "" ||
        Object.keys(dateRange).length > 0 ||
        !(date.startDate.toDateString() === new Date().toDateString() &&
          date.endDate.toDateString() === new Date().toDateString())
      ) && (
          <FAB
            style={{
              position: "absolute",
              margin: 16,
              right: 5,
              bottom: 10,
              backgroundColor: "#26a0df",
            }}
            icon="filter"
            onPress={() => setModalVisible(true)}
            color="#fff"
          />)}
          {selectedInvoice.length > 0 && (
  <SelectionOverlay
    selectedProducts={selectedInvoice}
    onDelete={handleBulkDelete}
     onClearSelection={() => {setSelectedInvoice([]);setSelectionMode(false)}}
  />
)}


      {searchModal && (
        <OpenmiqModal
          modalVisible={searchModal}
          setModalVisible={setSearchmodal}
          transcript={transcript}
        />
      )}
      {isModalVisible && (
        <FilterModal
          setModalVisible={setModalVisible}
          isModalVisible={isModalVisible}
          setSortBy={setSortBy}
          sortBy={sortBy}
          dateRange={dateRange}
          setDateRange={setDateRange}
          formatDate={formatDate}
          setTypeFilter={setTypeFilter}

        />
      )}
    </View>
  );
}

export default ViewInvoiceScreen1;
