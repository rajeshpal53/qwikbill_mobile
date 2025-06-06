import { FlatList, RefreshControl, ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import OpenmiqModal from "../../Components/Modal/Openmicmodal";
import { useContext, useEffect, useRef, useState } from "react";
import NoDataFound from "../../Components/NoDataFound";
import { readApi } from "../../Util/UtilApi";
import AllVenderDataCard from "../../Component/Cards/AllVenderDataCard";
import { ActivityIndicator } from "react-native-paper";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import { useNavigation } from "@react-navigation/native";
import UserDataContext from "../../Store/UserDataContext";

const AllVenderScreen = () => {
  const { userData } = useContext(UserDataContext);
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const navigation = useNavigation();
  const searchbarRef = useRef(null);
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  console.log("Data of user", userData);

  useEffect(() => {
    if (searchQuery?.length <= 0) {
      setSearchedData([]);
      setSearchCalled(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    getAllVenderData();
  }, [page]);

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    await getAllVenderData(); // Fetch new data
    setRefreshing(false); // Set refreshing state to false once done
  };

  const getAllVenderData = async () => {
    let api = `vendors/getVendorsByUserId/${userData?.user?.id}page=${page}&limit=${PAGE_SIZE}`;
    try {
      setloader(true);
      const response = await readApi(api);
      console.log("DATA OF CONSOLE", response);
      if (page === 1) {
        setVenderData(response);
        SetTotalpage(response?.totalPages || 1);
      } else if (response?.length > 0) {
        setVenderData((pre) => [...pre, ...response]);
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

  //Delete API
  const handleDeleteService = (item) => {
    console.log("item is edit 123, ", item);
    // setDeleteItemId(item?.id);
    // setDeleteModal(true);
  };

  const onDelete = (item) => {
    console.log("item is edit 123, ", item);
    setDeleteItemId(item?.id);
    setDeleteModal(true);
  };

  const onRole = (item) => {
    console.log("ITEM in a data ", item);
    console.log("click on the role screen");
    navigation.navigate("EditRoleScreen", {
      isAdmin: true,
      AdminRoleData: item,
    });
  };

  const handleEditDetails = (item) => {
    console.log("item is edit 123, ", item);
    navigation.navigate("CreateShopScreen", {
      editItem: item,
      isAdmin: true,
    });
  };

  const handleProductItems = (item) => {
    console.log("edit items clicked");
    navigation.navigate("ProductScreen");
  };

  const loadMoreData = () => {
    if (!loader && Hasmore && page < totalpage) {
      setpage((pre) => pre + 1);
    }
  };

  const fetchSearchedData = async () => {
    try {
      setSearchCalled(true);
      setloader(true);
      const trimmedQuery = searchQuery?.trim();
      console.log("trimmedQuery DATA IS ", trimmedQuery);

      let api = `vendors/searchVendor?searchTerm=${trimmedQuery}`;

      const response = await readApi(api, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.token}`,
      });

      console.log("RESPONSE DATA IS ", response);

      if (response?.length > 0) {
        setSearchedData(response);
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

  const Loader = () => {
    if (!loader) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  console.log("DATA OF ALL VENDER", VenderData);

  return (
    <View style={styles.container}>
      <View style={styles.Innercontainer}>
        <View style={{ flex: 1 }}>
          <Searchbarwithmic
            // refuser={searchbarRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setsearchmodal={setsearchmodal}
            setTranscript={setTranscript}
            placeholderText="Search User by name ..."
            searchData={fetchSearchedData}
          />
        </View>
      </View>

      <FlatList
        data={
          searchQuery?.length > 0 && searchCalled ? searchedData : VenderData
        }
        renderItem={({ item, index }) => (
          <AllVenderDataCard
            item={item}
            onDelete={onDelete}
            onEditDetails={handleEditDetails}
            onEditItems={handleProductItems}
            onRole={onRole}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        // onScrollBeginDrag={handleSearchBar}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Control the refreshing state
            onRefresh={onRefresh} // Trigger the onRefresh function when pulled down
            colors={["#0a6846"]} // Color of the refresh spinner
            progressBackgroundColor={"#fff"} // Background color of the spinner
          />
        }
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.8}
        ListFooterComponent={Loader}
        ListEmptyComponent={() =>
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

      {deleteModal && (
        <ConfirmModal
          visible={deleteModal}
          message="Confirm Delete This Service"
          heading={"Confirmation Message"}
          setVisible={setDeleteModal}
          handlePress={handleDeleteService}
          buttonTitle="Delete Now"
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
  Innercontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});

export default AllVenderScreen;
