import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { readApi } from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";
import TransactionCard from "../../Component/TransactionCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import NoDataFound from "../../Components/NoDataFound";
import OpenmiqModal from "../../Components/Modal/Openmicmodal";

function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const { selectedShop } = useContext(ShopContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const [totalPages, settotalPages] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (searchQuery?.length <= 0) {
      setSearchedData([]);
      setSearchCalled(false);
    }
  }, [searchQuery]);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        // Fetch data from API
        const response = await readApi(
          `transaction/getTransactionsByVendorfk/${selectedShop?.vendor?.id}/?page=${page}&limit=${PAGE_SIZE}`
        );
        console.log("API Response:", response);
        if (page == 1) {
          setTransactions(response?.transactions);
          settotalPages(response?.totalPages || 1);
          console.log("Transactions updated:", response?.transactions);
          console.log("Length of transaction", response?.transactions.length)
        } else if (response?.transactions.length > 0) {
          console.log("Inside of else if condition")
          setTransactions((prev) => [...prev, ...response?.transactions]);
        } else {
          setError("No transaction data found in response");
          setHasMore(false);
        }
      } catch (error) {
        if (page === 1) {
          setTransactions([]);
        }
        console.log("Unable to fetch Data ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [page, selectedShop?.vendor?.id, hasMore]);

  // Log transactions AFTER state update
  useEffect(() => {
    console.log("Updated Transactions:", transactions);
  }, [transactions]);

  const fetchSearchedData = async () => {
    try {
      setSearchCalled(true);
      setIsLoading(true);
      const trimmedQuery = searchQuery?.trim();
      console.log("trimmedQuery DATA IS ", trimmedQuery);

      let api = `users/searchUser?searchTerm=${trimmedQuery}`;

      const response = await readApi(api, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      });

      console.log("RESPONSE DATA IS ", response);

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
      setIsLoading(false);
    }
  };

  console.log("Length of ", searchedData?.length)
  const loadMoreData = () => {
    if (
      searchedData?.length <= 0 &&
      hasMore &&
      !isLoading &&
      page < totalPages
    ) {

      setPage((prev) => prev + 1);
    }
  };

  const filteredData = transactions
    .map((item) => ({
      ...item,
      name: item.user.name ?? "Unknown", // Replace null or undefined name with "Unknown"
    }))
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  console.log("DATA OF TRANSACTION IS ", transactions);

  return (
    <View style={styles.container}>
      <View style={styles.Innercontainer}>
        <View style={{ flex: 1 }}>
          <Searchbarwithmic
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setsearchmodal={setsearchmodal}
            setTranscript={setTranscript}
            placeholderText="Search Your transactions..."
            searchData={fetchSearchedData}
          />
        </View>
      </View>

      <FlatList
        data={searchQuery?.length > 0 ? filteredData : transactions}
        renderItem={({ item }) => <TransactionCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={Loader}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() =>
          !isLoading && transactions?.length === 0 ? (
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

      {searchmodal && (
        <OpenmiqModal
          modalVisible={searchmodal}
          setModalVisible={setsearchmodal}
          transcript={transcript}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 2,
    marginTop: 10,
  },
  Innercontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});

export default TransactionScreen;

// a