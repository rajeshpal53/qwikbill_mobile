import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Searchbar, FAB } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
// import Voice from "@react-native-voice/voice"; // Import Voice for speech recognition
import UserDataContext from "../../Store/UserDataContext";
import { fontSize, readApi } from "../../Util/UtilApi";

import NoDataFound from "../../../src/Components/NoDataFound";
import UserCard from "../../Component/Cards/UserCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Modal/Openmicmodal";

const AllUsersScreen = () => {
  const { userData } = useContext(UserDataContext);
  const searchBarRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [isRecording, setIsRecording] = useState(false); // Mic recording state
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const PAGE_SIZE = 10;
  const [totalPages, settotalPages] = useState(1);

  useEffect(() => {
    getalldata();
  }, [page]);

  const getalldata = async () => {
    let api = `users/?page=${page}&limit=${PAGE_SIZE}`;
    try {
      setIsLoading(true);
      const response = await readApi(api);
      console.log("DATA OF Responce ", response);
      if (page == 1) {
        setUsersData(response?.users);
        settotalPages(response?.totalPages || 1);
      }
      if (response?.users?.length > 0) {
        setUsersData((prev) => [...prev, ...response?.users]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (page === 1) {
        setUsersData([]);
      }
      console.log("Unable to fetch Data ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = () => {
    if (hasMore && !isLoading && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  return (
    <>
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
        data={usersData}
        renderItem={({ item, index }) => (
          <UserCard
            item={item}
            index={index}
            // navigation={navigation}
            // handleEditProfile={handleEditProfile}
          />
        )}
        // renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        // onScrollBeginDrag={handleSearchBar}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={Loader}
        ListEmptyComponent={() =>
          !isLoading && usersData?.length === 0 ? (
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },

  searchbar: {
    marginBottom: 18,
    borderRadius: 10,
    backgroundColor: "#EDEDED",
    height: 45, // Reduced height
    paddingHorizontal: 8,
    marginHorizontal: 2,
  },
  searchbarInput: {
    fontSize: 15, // Adjusted font size
    fontFamily: "Poppins-Medium",
    alignSelf: "center",
    padding: 0, // Remove extra padding
  },
  micButton: {
    marginRight: 10,
    justifyContent: "center", // Center the icon vertically
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 3,
    shadowOffset: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDetailsContainer: {
    flex: 1,
    marginLeft: 18,
    marginBottom: 1,
  },
  userName: {
    fontFamily: "Poppins-Bold",
    // fontWeight: "bold",
    fontSize: 15,
    color: "rgba(0,0,0,0.7)",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: fontSize.label,
    fontFamily: "Poppins-Bold",
    color: "rgba(0,0,0,0.3)",

    marginBottom: 3,
    marginLeft: 5,
  },
  address: {
    fontSize: fontSize.label,
    fontFamily: "Poppins-Medium",
    color: "rgba(0,0,0,0.3)",

    marginLeft: 5,
    marginRight: 8,
  },
  loader: {
    marginVertical: 10,
  },
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#1bd18f",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AllUsersScreen;
