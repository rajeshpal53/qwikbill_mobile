import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Modal/Openmicmodal";
import { useContext, useEffect, useRef, useState } from "react";
import NoDataFound from "../../Components/NoDataFound";
import { readApi } from "../../Util/UtilApi";
import AllInvoiceCard from "../../Component/Cards/AllInvoiceCard";
import { ActivityIndicator, FAB } from "react-native-paper";
import FilterModal from "../../Components/Modal/FilterModal";
import FilterButtons from "../../Components/FilterButtons";
import UserDataContext from "../../Store/UserDataContext";
import { ShopContext } from "../../Store/ShopContext";




const AllInvoiceScreen = () => {
  const { userData } = useContext(UserDataContext);
  const searchBarRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [InvoiceData, setInvoiceData] = useState([]);
  const [loader, setloader] = useState(false);
  const [Hasmore, SetHasmore] = useState(true);
  const [page, setPage] = useState(1);
  const PAZE_SIZE = 10;
  const [totalpage, SetTotalpage] = useState(1);
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const { allShops, selectedShop } = useContext(ShopContext);
  const [mainLoading, setMainLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPage(1);
    fetchInvoices(1);
  }, [selected, sortBy]);

  useEffect(() => {
    console.log("SET SELECTED VALUE152 ", selectedShop?. vendor?.id);
  }, [selectedShop]);

  // useEffect(() => {
  //   GetallInvoiceData();
  // }, [page]);

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    await fetchInvoices(); // Fetch new data
    setRefreshing(false); // Set refreshing state to false once done
  };

  const buildApiUrl = (pageNum) => {
    let api = `invoice/getInvoices?&page=${pageNum}&size=10`;
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
      SetHasmore(true);
      setMainLoading(true);
    }
    setloader(true);
    try {
      const api = buildApiUrl(pageNum);
      const response = await readApi(api);
      if (pageNum === 1) {
        setInvoiceData(response.invoices);
        console.log(response, "fetchresponse");
      } else if (response?.invoices?.length > 0) {
        setInvoiceData((prevData) => [...prevData, ...response.invoices]);
      } else {
        SetHasmore(false);
      }
    } catch (err) {
      if (pageNum === 1) setInvoiceData([]);
    } finally {
      setloader(false);
      setMainLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!loader && Hasmore) setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) fetchInvoices(page);
  }, [page]);

  const fetchSearchedData = async () => {
    try {
      setSearchCalled(true);
      setloader(true);
      const trimmedQuery = searchQuery?.trim();
      console.log("trimmedQuery DATA IS ", trimmedQuery);

      let api = `invoice/searchInvoices?searchTerm=${trimmedQuery}`;

      const response = await readApi(api, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      });

      console.log("RESPONSE DATA IS159", response);

      if (response?.users?.length > 0) {
        setSearchedData(response?.users);
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

  function formatDate(date) {
    return date ? date.toISOString().split("T")[0] : "";
  }

  const Loader = () => {
    if (!loader) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  };

  return mainLoading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.container}>
            <Searchbarwithmic
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setsearchmodal={setsearchmodal}
              setTranscript={setTranscript}
              placeholderText="Search User by name ..."
              refuser={searchBarRef}
              searchData={fetchSearchedData}
            />

            <FilterButtons setSelected={setSelected} selected={selected} />
          </View>
        }
        data={
          searchQuery?.length > 0 && searchCalled ? searchedData : InvoiceData
        }
        renderItem={({ item, index }) => <AllInvoiceCard item={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Control the refreshing state
            onRefresh={onRefresh} // Trigger the onRefresh function when pulled down
            colors={["#0a6846"]} // Color of the refresh spinner
            progressBackgroundColor={"#fff"} // Background color of the spinner
          />
        }
        // onScrollBeginDrag={handleSearchBar}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={Loader}
        ListEmptyComponent={() =>
          !loader && InvoiceData.length ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40%",
              }}
            >
              <NoDataFound textString={"No Users Found"} />
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

      {searchmodal && (
        <OpenmiqModal
          modalVisible={searchmodal}
          setModalVisible={setsearchmodal}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },
});

export default AllInvoiceScreen;
