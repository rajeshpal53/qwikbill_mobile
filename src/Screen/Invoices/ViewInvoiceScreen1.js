
import React, { useEffect, useContext, useState, useRef } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { readApi } from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";
import { ActivityIndicator, FAB } from "react-native-paper";
import ViewInvoiceCard from "../../Components/ViewInvoiceCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Components/Modal/Openmicmodal";
import FilterButtons from "../../Components/FilterButtons";
import FilterModal from "../../Components/Modal/FilterModal";
import UserDataContext from "../../Store/UserDataContext";
import NoDataFound from "../../Components/NoDataFound";

function ViewInvoiceScreen1({ navigation }) {
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

  useEffect(() => {
    setPage(1);
    fetchInvoices(1);
  }, [selected, sortBy,selectedShop?.vendor?.id]);

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    await fetchInvoices(); // Fetch new data
    setRefreshing(false); // Set refreshing state to false once done
  };

  const buildApiUrl = (pageNum) => {
    const id = selectedShop?.vendor?.id
    let api = `invoice/getInvoices?vendorfk=${id}&page=${pageNum}&size=10`;
    if (sortBy && sortBy != "datewise") api += `&dateWise=${sortBy}`;
    if (sortBy && sortBy == "datewise")
      api += `&startDate=${formatDate(date.startDate)}&endDate=${formatDate(
        date.endDate
      )}`;
    if (selected === "Partially Paid") api += "&statusfk=3";
    if (selected === "Unpaid") api += "&statusfk=1";
    if (selected === "Paid") api += "&statusfk=2";
    console.log(api, "api ssss");
    return api;
  };

  const fetchInvoices = async (pageNum = 1) => {
    if (pageNum === 1) {
      setHasMore(true);
      // setMainLoading(true);
    }
    setIsLoading(true);
    try {
      const api = buildApiUrl(pageNum);
      const response = await readApi(api);
      if (pageNum === 1) {
        setInvoices(response.invoices);
        console.log(response, "fetchresponse");
      } else if (response?.invoices?.length > 0) {
        setInvoices((prevData) => [...prevData, ...response.invoices]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (pageNum === 1) setInvoices([]);
    } finally {
      setIsLoading(false);
      // setMainLoading(false);
    }
  };

  // const loadMoreData = () => {
  //   if (!isLoading && hasMore) setPage((prevPage) => prevPage + 1);
  // };

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

  const onSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    fetchSearchedData(query, 1);
  };
  
  

  useEffect(() => {
    if (page > 1) fetchInvoices(page);
  }, [page,selectedShop]);





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
    return date ? date.toISOString().split("T")[0] : "";
  }

  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };


  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <View style={{ marginTop: 8 }}>
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
            <FilterButtons setSelected={setSelected} selected={selected} />
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
          <ViewInvoiceCard invoice={item} navigation={navigation} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <Loader /> : null}
        ListEmptyComponent={() =>
          !isLoading && invoices.length <= 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40%",
              }}
            >
              <NoDataFound textString={"No Invoice Found"} />
            </View>
          ) : null
        }
      />

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
          dateRange={date}
          setDateRange={setDate}
          formatDate={formatDate}
        />
      )}
    </View>
  );
}

export default ViewInvoiceScreen1;

