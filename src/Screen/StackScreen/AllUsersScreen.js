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
import { deleteApi, fontSize, readApi, updateApi } from "../../Util/UtilApi";

import NoDataFound from "../../../src/Components/NoDataFound";
import UserCard from "../../Component/Cards/UserCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Modal/Openmicmodal";
import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";
import axios from "axios";
import { useSnackbar } from "../../Store/SnackbarContext";

const AllUsersScreen = ({ navigation }) => {
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

  const searchbarRef = useRef(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    if (searchQuery?.length <= 0) {
      setSearchedData([]);
      setSearchCalled(false);
    }
  }, [searchQuery]);

  console.log("Search Data is ", searchedData);

  useEffect(() => {
    getalldata();
  }, [page]);

  const getalldata = async () => {
    let api = `users/?page=${page}&limit=${PAGE_SIZE}`;
    try {
      setIsLoading(true);
      const response = await readApi(api);
      if (page == 1) {
        setUsersData(response?.users);
        settotalPages(response?.totalPages || 1);
      } else if (response?.users?.length > 0) {
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

  // const HandleDeleteUser = async (item) => {
  //   console.log("DATA OF ITEM ISSSSS", item.id);
  //   try {
  //     setIsLoading(true);
  //     if (item.id) {
  //       const token = userData?.token;
  //       console.log("token is ", token)
  //       const deleteresponse = await deleteApi(`users/${item.id}`
  //       //   {
  //       //   Authorization: `Bearer ${token}`,
  //       // }
  //     );

  //       console.log("response for delete is ", deleteresponse)

  //       console.log(`https://rajeshpal.online/qapi/users/${item.id}`)
  //       if (deleteresponse) {
  //         showSnackbar("This user data is deleted successfully", "success")
  //         setUsersData((prev) => prev.filter((data) => data.id !== item.id));
  //       } else {
  //         setIsLoading(false);
  //         console.log("Failed to delete the Response: ", deleteresponse);
  //       }
  //     } else {
  //       setIsLoading(false);
  //       console.log("Unable to get Id");
  //     }
  //   } catch (error) {
  //     showSnackbar("unable to delete this data ", "error")
  //     console.log("Unable to fetch Delete API : ", error);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const HandleDeleteUser = async (item) => {
    console.log("Attempting to delete user with ID:", item.id);

    if (!item?.id) {
      console.log("Error: Item ID is missing");
      showSnackbar(" Unable to get user ID", "error");
      return;
    }

    console.log("item name  is ", item.name)

    try {
      setIsLoading(true);

      const existingUser = usersData.find((data) => data.id === item.id);
      if (!existingUser) {
        showSnackbar(" user  not found or already deleted !", "error");
        return;
      }

      const apiUrl = `users/${item.id}`;
      console.log("Deleting user at API URL:", apiUrl);

      const deleteresponse = await deleteApi(apiUrl);

      console.log("Delete API response:", deleteresponse);

      if (deleteresponse?.success) {
        showSnackbar("User deleted successfully", "success");
        setUsersData((prev) => prev.filter((data) => data.id !== item.id));
        await getalldata();
      } else {
        showSnackbar("Failed to delete user", "error");
        console.log("Delete response does not indicate success:", deleteresponse);
      }
    } catch (error) {

      console.log("Error deleting user:", error?.response?.data || error?.message || error);
      showSnackbar("Unable to delete this user", "error");


    } finally {
      setIsLoading(false);
    }
  };



  const handleDataFromEditProfile = (updatedData, index) => {
    if (updatedData && index >= 0) {
      const dataForUpdating = [...usersData];
      dataForUpdating[index] = updatedData;
      try {
        setUsersData(dataForUpdating);
      } catch (error) {
        console.log("error is the , updata , ", error);
      }

      console.log("data 13 , ", dataForUpdating);
    }
  };

  const handleEditProfile = (item, index) => {
    navigation.navigate("EditProfilePage", {
      item: item,
      onGoBack: (updatedData) => handleDataFromEditProfile(updatedData, index),
      isAdmin: true,
    });
  };

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

  const Loader = () => {
    if (!isLoading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* <View style={{ flex: 1 }}>
          <Searchbarwithmic
            refuser={searchbarRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setsearchmodal={setsearchmodal}
            setTranscript={setTranscript}
            placeholderText="Search User by name ..."
            //    refuser={searchBarRef}
          />
        </View> */}
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 8 }}>
            <Searchbarwithmic
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setsearchmodal={setsearchmodal}
              setTranscript={setTranscript}
              placeholderText="Search User by name ..."
              searchData={fetchSearchedData}
            />
          </View>
        }

        data={
          searchQuery?.length > 0 && searchCalled ? searchedData : usersData
        }
        renderItem={({ item, index }) => (
          <UserCard
            item={item}
            index={index}
            // navigation={navigation}
            HandleDeleteUser={HandleDeleteUser}
            handleEditProfile={handleEditProfile}
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

      {/* <EditCustomerDetailsModal
        visible={editModalVisible}
        seteditmodal={setEditModalVisible}
        SelectedEditItem={selectedUser}
        onUpdate={handleUpdateUser}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
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
