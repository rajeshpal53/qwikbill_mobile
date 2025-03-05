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

  useEffect(() => {
    GetallInvoiceData();
  }, []);

  const GetallInvoiceData = async () => {
    let api = `invoice/invoices`;
    try {
      setloader(true);
      const response = await readApi(api);
      console.log("INVOICE DATA IS ", response);
      if (response) {
        setInvoiceData(response);
      }
    } catch (error) {
      console.log("Unable to fetch", error);
      setloader(false);
    } finally {
      setloader(false);
    }
  };

  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setsearchmodal}
        setTranscript={setTranscript}
        placeholderText="Search User by name ..."
        refuser={searchBarRef}
        // searchData={fetchSearchedData}
      /> */}

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
              // searchData={fetchSearchedData}
            />
          </View>
        }
        data={InvoiceData}
        renderItem={({ item, index }) => <AllInvoiceCard item={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        // onScrollBeginDrag={handleSearchBar}
        showsVerticalScrollIndicator={false}
        //   onEndReached={loadMoreData}
        //   onEndReachedThreshold={0.5}
        //   ListFooterComponent={Loader}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: "40%",
            }}
          >
            <NoDataFound textString={"No Users Found"} />
          </View>
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
