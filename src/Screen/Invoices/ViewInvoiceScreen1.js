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
function ViewInvoiceScreen1({ navigation }) {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModal, setSearchmodal] = useState(false);
  const searchBarRef = useRef();
  const [transcript, setTranscript] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  useEffect(() => {
    let api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10`;
    if (sortBy) {
      setPage(1);
      api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10&dateWise=${sortBy}`;
    } else {
      api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10`;
    }
    fetchInvoices(page, api);
    console.log(selectedShop, "selectedShop");
  }, [page, sortBy]);

  useEffect(() => {
    setPage(1);
    let api = `invoice/getInvoices?vendorfk=${selectedShop?.id}&page=${page}&size=10&dateWise=${sortBy}`;
    if (selected === "Partially Paid") {
      api = `invoice/getInvoices?vendorfk=${
        selectedShop?.id
      }&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}&statusfk=3`;
    } else if (selected === "Unpaid") {
      api = `invoice/getInvoices?vendorfk=${
        selectedShop?.id
      }&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}&statusfk=1`;
    } else if (selected === "Paid") {
      api = `invoice/getInvoices?vendorfk=${
        selectedShop?.id
      }&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}&statusfk=2`;
    } else if (selected === "All") {
      api = `invoice/getInvoices?vendorfk=${
        selectedShop?.id
      }&page=${page}&size=10${sortBy ? `&dateWise=${sortBy}` : ""}`;
    }
    fetchInvoices(page, api);
  }, [selected]);

  const fetchInvoices = async (pageNum, api) => {
    try {
      setIsLoading(true);
      const response = await readApi(api);
      // console.log(JSON.stringify(response))
      if (page == 1) {
        setInvoices(response.invoices);
      } else if (response?.invoices?.length > 0) {
        setInvoices((prevData) => [...prevData, ...response.invoices]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (page === 1) {
        setInvoices([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment Page number
    }
  };
  const fetchSearchedData = async () => {};
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
      <View style={{ marginTop: 8 }}>
        <Searchbarwithmic
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setsearchmodal={setSearchmodal}
          setTranscript={setTranscript}
          placeholderText="Search Invoices..."
          refuser={searchBarRef}
          searchData={fetchSearchedData}
        />
        <FilterButtons setSelected={setSelected} selected={selected} />
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 140 }}
        data={invoices}
        renderItem={({ item, index }) => (
          <View>
            <ViewInvoiceCard invoice={item} navigation={navigation} />
          </View>
        )}
        // renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        // onScrollBeginDrag={handleSearchBar}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={Loader}
        ListEmptyComponent={
          // <View style={styles.empty}><Text>No Data Found</Text></View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: "40%",
            }}
          >
            <Text> No Data Found </Text>
          </View>
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
        icon="filter" // Plus icon for FAB
        onPress={() => {
          setModalVisible(true);
        }}
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
        />
      )}
    </View>
  );
}

export default ViewInvoiceScreen1;
