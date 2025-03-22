import { FlatList, StyleSheet, Text, View } from "react-native";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Modal/Openmicmodal";
import { useEffect, useRef, useState } from "react";
import NoDataFound from "../../Components/NoDataFound";
import { readApi } from "../../Util/UtilApi";
import AllInvoiceCard from "../../Component/Cards/AllInvoiceCard";
import { ActivityIndicator } from "react-native-paper";

const AllInvoiceScreen = () => {
  //   const { userData } = useContext(UserDataContext);
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

  useEffect(() => {
    GetallInvoiceData();
  }, [page]);

  const GetallInvoiceData = async () => {
    let api = `invoice/invoices?page=${page}&limit=${PAZE_SIZE}`;
    try {
      setloader(true);
      const response = await readApi(api);
      if (page === 1) {
        setInvoiceData(response?.invoices);
        SetTotalpage(response?.totalPages || 1);
      } else if (response?.invoices?.length > 0) {
        setInvoiceData((pre) => [...pre, ...response?.invoices]);
      } else {
        SetHasmore(false);
      }
    } catch (error) {
      console.log("Unable to fetch", error);
      if (page === 1) {
        setInvoiceData([]);
      }
      setloader(false);
    } finally {
      setloader(false);
    }
  };

  const loadMoreData = () => {
    if (!loader && Hasmore && page < totalpage) {
      setPage((pre) => pre + 1);
    }
  };

    const fetchSearchedData = async () => {
      try {
        setSearchCalled(true);
        setIsLoading(true);
        const trimmedQuery = searchQuery?.trim();
        console.log("trimmedQuery DATA IS ", trimmedQuery)

        let api = `invoice/searchInvoices/5?searchTerm=Enterprises`;

        const response = await readApi(api, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        });

        console.log("RESPONSE DATA IS ", response)

        if (response?.users?.length > 0) {
          setSearchedData(response?.users);
        } else {
          setSearchedData([]);
        }
      } catch (error) {
        console.log("Unable to get data ", error)
        if (error?.status === 404) {
          setSearchedData([]);

        }
      } finally {
        setIsLoading(false);
      }
    };


  const Loader = () => {
    if (!loader) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  };

  return (
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
          </View>
        }
        data={( searchQuery?.length > 0 && searchCalled ) ? searchedData : InvoiceData}
        renderItem={({ item, index }) => <AllInvoiceCard item={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
      {searchmodal && (
        <OpenmiqModal
          modalVisible={searchmodal}
          setModalVisible={setsearchmodal}
          transcript={transcript}
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
