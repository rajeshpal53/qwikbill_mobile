import { FlatList, ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Modal/Openmicmodal";
import { useEffect, useRef, useState } from "react";
import NoDataFound from "../../Components/NoDataFound";
import { readApi } from "../../Util/UtilApi";
import AllVenderDataCard from "../../Component/Cards/AllVenderDataCard";
import { ActivityIndicator } from "react-native-paper";

const AllVenderScreen = () => {
  //   const { userData } = useContext(UserDataContext);
  const searchBarRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [VenderData, setVenderData] = useState([]);
  const [loader, setloader] = useState(false);
  const [Hasmore, setHasmore] = useState(true);
  const [page, setpage] = useState(1);
  const PAGE_SIZE = 10;
  const [totalpage, SetTotalpage] = useState(1);

  useEffect(() => {
    getAllVenderData();
  }, [page]);

  const getAllVenderData = async () => {
    let api = `vendors/?page=${page}&limit=${PAGE_SIZE}`;
    try {
      setloader(true);
      const response = await readApi(api);
      if (page === 1) {
        setVenderData(response?.vendors);
        SetTotalpage(response?.totalPages || 1);
      }
      if (response?.vendors?.length > 0) {
        setVenderData((pre) => [...pre, ...response?.vendors]);
      } else {
        setHasmore(false);
      }
    } catch (error) {
      console.log("Unable to fetch", error);
      if (page === 1) {
        setVenderData([]);
      }
      setloader(false);
    } finally {
      setloader(false);
    }
  };

  const loadMoreData = () => {
    if (!loader && Hasmore && page < totalpage) {
      setpage((pre) => pre + 1);
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
            />
          </View>
        }
        data={VenderData}
        renderItem={({ item, index }) => <AllVenderDataCard item={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        // onScrollBeginDrag={handleSearchBar}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.8}
        ListFooterComponent={Loader}
        ListEmptyComponent={
          () =>
            !loader && VenderData?.length === 0 ? (
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
    padding: 2,
    marginTop: 10,
  },
});

export default AllVenderScreen;
