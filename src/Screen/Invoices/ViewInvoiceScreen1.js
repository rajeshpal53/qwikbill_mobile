import React, { useEffect, useContext, useState, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import { readApi } from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";
import { ActivityIndicator, FAB } from "react-native-paper";
import ViewInvoiceCard from "../../Components/ViewInvoiceCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Modal/Openmicmodal";
import FilterButtons from "../../Components/FilterButtons";
import FilterModal from "../../Components/Modal/FilterModal";
import UserDataContext from "../../Store/UserDataContext";

function ViewInvoiceScreen1({ navigation }) {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [searchModal, setSearchmodal] = useState(false);
  const [selected, setSelected] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [date, setDate] = useState({ startDate: new Date(), endDate: new Date() });
  const [isModalVisible, setModalVisible] = useState(false);
  const searchBarRef = useRef();
  const debounceTimeout = useRef(null);
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  useEffect(() => {
    setPage(1);
    fetchInvoices(1);
  }, [selected, sortBy]);

  const buildApiUrl = (pageNum) => {
    let api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${pageNum}&size=10`;
    if (sortBy&&sortBy!="datewise") api += `&dateWise=${sortBy}`;
    if(sortBy&&sortBy=="datewise") api+=`&startDate=${formatDate(date.startDate)}&endDate=${formatDate(date.endDate)}`
    if (selected === "Partially Paid") api += "&statusfk=3";
    if (selected === "Unpaid") api += "&statusfk=1";
    if (selected === "Paid") api += "&statusfk=2";
    console.log(api,"api ssss")
    return api;
  };

  const fetchInvoices = async (pageNum = 1) => {
    if (pageNum === 1) {
      setHasMore(true)
      setMainLoading(true);
    }
    setIsLoading(true);
    try {
      const api = buildApiUrl(pageNum);
      const response = await readApi(api);
      if (pageNum === 1) {
        setInvoices(response.invoices);
        console.log(response,"fetchresponse")
      } else if (response?.invoices?.length > 0) {
        setInvoices((prevData) => [...prevData, ...response.invoices]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (pageNum === 1) setInvoices([]);
    } finally {
      setIsLoading(false);
      setMainLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!isLoading && hasMore) setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) fetchInvoices(page);
  }, [page]);

  const fetchSearchedData = async (query) => {
    setIsLoading(true);
    try {
      const response = await readApi(`invoice/searchInvoices?searchTerm=${query}`, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      });
      setSearchedData(response.length > 0 ? response : []);
    } catch (err) {
      if (err?.status === 404) setSearchedData([]);
    } finally {
      setIsLoading(false);
    }
  };
  // function formatDate(date) {
  //   return date ? date.toISOString().split("T")[0].split("-").reverse().join("/") : "";
  // }
  function formatDate(date) {
    return date ? date.toISOString().split("T")[0] : "";
  }
  return mainLoading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <View style={{ marginTop: 8 }}>
            <Searchbarwithmic
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setsearchmodal={setSearchmodal}
              placeholderText="Search Invoices..."
              refuser={searchBarRef}
              searchData={fetchSearchedData}
              fetchData={fetchInvoices}
            />
            <FilterButtons setSelected={setSelected} selected={selected} />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
        data={searchQuery?.length > 0 && searchCalled ? searchedData : invoices}
        renderItem={({ item }) => <ViewInvoiceCard invoice={item} navigation={navigation} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
        ListEmptyComponent={
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: "40%" }}>
            <Text> No Data Found </Text>
          </View>
        }
      />

      <FAB
        style={{ position: "absolute", margin: 16, right: 5, bottom: 10, backgroundColor: "#26a0df" }}
        icon="filter"
        onPress={() => setModalVisible(true)}
        color="#fff"
      />
      {searchModal && <OpenmiqModal modalVisible={searchModal} setModalVisible={setSearchmodal} />}
      {isModalVisible && (
        <FilterModal setModalVisible={setModalVisible} isModalVisible={isModalVisible} setSortBy={setSortBy} sortBy={sortBy} dateRange={date} setDateRange={setDate} formatDate={formatDate} />
      )}
    </View>
  );
}

export default ViewInvoiceScreen1;























// import React, { useEffect, useContext, useState, useRef } from "react";
// import { View, Text, FlatList } from "react-native";
// import { readApi } from "../../Util/UtilApi";
// import { ShopContext } from "../../Store/ShopContext";
// import { ActivityIndicator, FAB } from "react-native-paper";
// import ViewInvoiceCard from "../../Components/ViewInvoiceCard";
// import Searchbarwithmic from "../../Component/Searchbarwithmic";
// import OpenmiqModal from "../../Modal/Openmicmodal";
// import FilterButtons from "../../Components/FilterButtons";
// import FilterModal from "../../Components/Modal/FilterModal";
// import UserDataContext from "../../Store/UserDataContext";
// function ViewInvoiceScreen1({ navigation }) {
//   const [invoices, setInvoices] = useState([]);
//   const [page, setPage] = useState(1);
//   const { allShops, selectedShop } = useContext(ShopContext);
//   const [isLoading, setIsLoading] = useState(false);
//   const [mainLoading,setMainLoading]=useState(false)
//   const [hasMore, setHasMore] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchedData, setSearchedData] = useState([]);
//   const [searchCalled, setSearchCalled] = useState(false);
//   const [searchModal, setSearchmodal] = useState(false);
//   const searchBarRef = useRef();
//   const [transcript, setTranscript] = useState("");
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [selected, setSelected] = useState("All");
//   const [sortBy, setSortBy] = useState("");
//   const [date, setDate] = useState({
//     startDate: new Date(),
//     endDate: new Date(),
//   });
//   const debounceTimeout = useRef(null);
//   const {userData}=useContext(UserDataContext)
//   useEffect(() => {
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     // Set a 500ms debounce delay to trigger the data fetch
//     debounceTimeout.current = setTimeout(() => {
//       setPage(1);  // Reset page to 1 when the filter or search query changes
//     }, 500);

//     return () => {
//       clearTimeout(debounceTimeout.current);  // Cleanup timeout on component unmount
//     };
//   }, [selected, searchQuery, sortBy]);

//   useEffect(() => {
//     if(searchQuery?.length <= 0) {
//       setSearchedData([]);
//       setSearchCalled(false);
//     }
//   }, [searchQuery]);

//   useEffect(() => {
//     let api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10`;
//     if (sortBy) {
//       setPage(1);
//       api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10&dateWise=${sortBy}`;
//     } else {
//       api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10`;
//     }
//     fetchInvoices(page, api);
//     console.log(selectedShop, "selectedShop");
//   }, [page, sortBy]);

//   useEffect(() => {
//     setPage(1);
//     let api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10&dateWise=${sortBy}`;
//     if (selected === "Partially Paid") {
//       api = `invoice/getInvoices?vendorfk=${
//         selectedShop?.id
//       }&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}&statusfk=3`;
//     } else if (selected === "Unpaid") {
//       api = `invoice/getInvoices?vendorfk=${
//         selectedShop?.id
//       }&statusfk=1&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}`;
//     } else if (selected === "Paid") {
//       api = `invoice/getInvoices?vendorfk=${
//         selectedShop?.id
//       }&statusfk=2&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}`;
//     } else if (selected === "All") {
//       api = `invoice/getInvoices?vendorfk=${
//         selectedShop?.id
//       }&page=${page}&size=10${sortBy ?`&dateWise=${sortBy}` : ""}`;
//     }
//     fetchInvoices(page, api);
//   }, [selected]);

//   const fetchInvoices = async (pageNum=1, api=`invoice/getInvoices?vendorfk=${
//         selectedShop?.id
//       }&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}`) => {

//   //  if(api===`invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}`){
//   //         setSelected("All")
//   //     }
//     try {
//       setIsLoading(true);
//       if(pageNum==1){
//         setMainLoading(true)
//       }
//       const response = await readApi(api);
//       // console.log(JSON.stringify(response))
//       if (pageNum == 1) {
//         setInvoices(response.invoices);
//       } else if (response?.invoices?.length > 0) {
//         setInvoices((prevData) => [...prevData, ...response.invoices]);
//       } else {
//         setHasMore(false);
//       }
//     } catch (err) {
//       if (pageNum === 1) {
//         setInvoices([]);
//       }
//     } finally {
//       setIsLoading(false);
//       setMainLoading(false)
//     }
//   };

//   const loadMoreData = () => {
//     if (!isLoading && hasMore) {
//       setPage((prevPage) => prevPage + 1); // Increment Page number
//     }
//   };
//   const fetchSearchedData = async (searchQuery) => {
//     console.log("inside of searchData",searchQuery)
//     try{
//       setIsLoading(true)
//       const trimmedQuery = searchQuery.trim();
//       setSearchCalled(true);
//     if (trimmedQuery.length > 0) {
//       const response=await readApi(`invoice/searchInvoices?searchTerm=${searchQuery}`,{
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userData?.token}`,
//       })
//       console.log(response,"response")
//       if (response?.length > 0) {
//         setSearchedData(response);
//       } else {
//         setSearchedData([]);
//       }
//     }
//     }catch(err){
//       if (err?.status === 404) {
//         setSearchedData([]);
//         console.error(err)
//       }
//     }
//   finally{
//     setIsLoading(false);
//   }

//   };
//   const Loader = () => {
//     if (!isLoading) return null;
//     return (
//       <View style={{ flex: 1, justifyContent: "center" }}>
//         <ActivityIndicator size={"large"}></ActivityIndicator>
//       </View>
//     );
//   };
//   console.log(isLoading,"isLoading")

// // useEffect(()=>{
// //   console.log("DATA OF LOADING 158",isLoading)
// // },[isLoading])
// if(mainLoading){
//   return(
//     <View style={{ flex: 1, justifyContent: "center" }}>
//         <ActivityIndicator size={"large"}></ActivityIndicator>
//       </View>
//   )
// }

//   return (
//     <View style={{ backgroundColor: "#fff", flex: 1 }}>
//           <FlatList
//           ListHeaderComponent={
//             <View style={{ marginTop: 8 }}>
//               <Searchbarwithmic
//                 searchQuery={searchQuery}
//                 setSearchQuery={setSearchQuery}
//                 setsearchmodal={setSearchmodal}
//                 setTranscript={setTranscript}
//                 placeholderText="Search Invoices..."
//                 refuser={searchBarRef}
//                 searchData={fetchSearchedData}
//                 fetchData={fetchInvoices}
//               />
//               <FilterButtons setSelected={setSelected} selected={selected} />
//             </View>
//           }
//           contentContainerStyle={{ paddingBottom: 140 }}
//           data={( searchQuery?.length > 0 && searchCalled ) ? searchedData : invoices}
//           renderItem={({ item, index }) => (
//             <View>
//               <ViewInvoiceCard invoice={item} navigation={navigation} />
//             </View>
//           )}
//           // renderItem={renderItem}
//           keyExtractor={(item, index) => `${item.id}-${index}`}
//           // onScrollBeginDrag={handleSearchBar}
//           showsVerticalScrollIndicator={false}
//           onEndReached={loadMoreData}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={Loader}
//           ListEmptyComponent={
//             // <View style={styles.empty}><Text>No Data Found</Text></View>
//             <View
//               style={{
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginTop: "40%",
//               }}
//             >
//               <Text> No Data Found </Text>
//             </View>
//           }
//         />


//       <FAB
//         style={{
//           position: "absolute",
//           margin: 16,
//           right: 5,
//           bottom: 10,
//           backgroundColor: "#26a0df",
//         }}
//         icon="filter" // Plus icon for FAB
//         onPress={() => {
//           setModalVisible(true);
//         }}
//         color="#fff"
//       />
//       {searchModal && (
//         <OpenmiqModal
//           modalVisible={searchModal}
//           setModalVisible={setSearchmodal}
//           transcript={transcript}
//         />
//       )}
//       {isModalVisible && (
//         <FilterModal
//           setModalVisible={setModalVisible}
//           isModalVisible={isModalVisible}
//           setSortBy={setSortBy}
//           sortBy={sortBy}
//           dateRange={date}
//           setDateRange={setDate}
//         />
//       )}
//     </View>
//   );
// }

// export default ViewInvoiceScreen1;
