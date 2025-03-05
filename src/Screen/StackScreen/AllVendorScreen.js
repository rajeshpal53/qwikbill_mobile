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

  useEffect(() => {
    getAllVenderData();
  }, []);

  const getAllVenderData = async () => {
    let api = `vendors`;
    try {
      setloader(true);
      const response = await readApi(api);
      if (response) {
        setVenderData(response);
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
    // <ScrollView>
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
            />
          </View>
        }
          data={VenderData}
          renderItem={({ item, index }) => <AllVenderDataCard item={item} />}
          // renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          // onScrollBeginDrag={handleSearchBar}
          showsVerticalScrollIndicator={false}
          //   onEndReached={loadMoreData}
          //   onEndReachedThreshold={0.5}
          //   ListFooterComponent={Loader}
          ListEmptyComponent={
            // <View style={styles.empty}><Text>No Data Found</Text></View>
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
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 2,
    marginTop:10
  },
});

export default AllVenderScreen;
