import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import UserDataContext from "../../Store/UserDataContext";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ButtonColor,
  deleteApi,
  formatDate,
  readApi,
} from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";
import DropDownList from "../../UI/DropDownList";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import AllRoleDetailsCard from "../../Component/Cards/AllRoleDetailsCard";
import { FlatList } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import NoDataFound from "../../Components/NoDataFound";
import OpenmiqModal from "../../Components/Modal/Openmicmodal";
import DeleteModal from "../../UI/DeleteModal";
import { useSnackbar } from "../../Store/SnackbarContext";

const EditRole = () => {
  const route = useRoute();
  const { isAdmin, AdminRoleData } = route.params;
  const [RoleData, setRoleData] = useState([]);
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const { showSnackbar } = useSnackbar();
  const isFocused = useIsFocused();
  const searchBarRef = useRef();
  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [refreshing, setRefreshing] = useState(false);


  console.log("SHOP Id IS ",selectedShop?.vendor?.id)
  console.log("SHOP Id IS123 ",AdminRoleData?.id)


  useEffect(() => {
    searchdata();
  }, [searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    await getRoleData(); // Fetch new data
    setRefreshing(false); // Set refreshing state to false once done
  };

  const getRoleData = async () => {
    setLoading(true);
    const headers = {
      Authorization: `Bearer ${userData?.token}`,
    };
    let api = ``;
    if (isAdmin) {
      if (AdminRoleData?.id) {
        api = `userRoles/getUserRoleByVendorfk/${AdminRoleData.id}`;
      } else {
        console.log("AdminRoleData.id is missing");
        setLoading(false);
        return;
      }
    } else {
      if (selectedShop?.vendor?.id) {
        api = `userRoles/getUserRoleByVendorfk/${selectedShop?.vendor?.id}`;
      } else {
        console.log("selectedShop?. vendor?.id is missing");
        setLoading(false);
        return;
      }
    }
    try {
      const response = await readApi(api, headers);
      console.log("GET ALL DATA IS125 ", response?.data);
      if (response?.data) {
        setRoleData(response.data);
        console.log("GET ALL DATA IS response", response.data);
      } else {
        setRoleData([]); // If no data is found
      }
    } catch (error) {
      console.log("Unable to fetch Role data", error);
      setRoleData([]); // On error, clear the list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoleData();
  }, [isFocused, selectedShop]);


  const HandleDeleteRole = async (roleId) => {
    console.log("Data of item is 345", roleId);
    const headers = {
      Authorization: `Bearer ${userData?.token}`,
    };
    try {
      setLoading(true);
      const response = await deleteApi(`userRoles/${roleId}`,headers);
      console.log("GET ALL DATA IS125 ", response?.data);
      if (response?.data) {
        setRoleData((prevData) =>
          prevData.filter((role) => role.id !== roleId)
        );
        console.log("GET ALL DATA IS response", response.data);
        showSnackbar("Role deleted successfully","success")
      } else {
        console.log("No data returned from delete API");
      }
    } catch (error) {
      console.log("Unable to fetch Role data", error);
      showSnackbar("Unable to fetch Role data", "error");

    } finally {
      setLoading(false);
      setVisible(false);
     
    }
  };

  const searchdata = () => {
    if (searchQuery?.length > 0) {
      const trimmedQuery = searchQuery.trim();
      const found = RoleData.filter((item) =>
        item?.user?.name?.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
      setSearchedData(found);
      setSearchCalled(true);
    } else {
      setSearchedData([]);
      setSearchCalled(false);
    }
  };
  const Loader = () => {
    if (!loading) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  const searchData = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredData([...RoleData]); // Reset to full list when search is empty
      return;
    }

    const filtered = RoleData.filter((role) =>
      // role?.name?.toLowerCase()?.includes(query.toLowerCase())
      role?.user?.name?.toLowerCase()?.includes(query.toLowerCase())
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData([...RoleData]);
    }
  }, [searchQuery, RoleData]);

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <View style={styles.Main}>
      <View style={styles.container}>
        {/* Search Bar */}
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.searchContainer}>
                <Searchbarwithmic
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setsearchmodal={setsearchmodal}
                  setTranscript={setTranscript}
                  placeholderText="Search User Role ..."
                  refuser={searchBarRef}
                  searchData={searchData} // Pass searchData function
                />
              </View>

              <View style={styles.dropdownContainer}>
                <DropDownList options={allShops} />
              </View>
            </>
          }
          data={filteredData} // Use filteredData instead of RoleData
          // keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <AllRoleDetailsCard
              item={item}
              getRoleData={getRoleData}
              setRoleId={setRoleId}
              setVisible={setVisible}
            />
          )}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0a6846"]}
              progressBackgroundColor={"#fff"}
            />
          }
          ListEmptyComponent={() =>
            !loading && RoleData.length <= 0 ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "40%",
                }}
              >
                <NoDataFound textString={"No roles assigned "} />
              </View>
            ) : null
          }
          // ListEmptyComponent={() => (
          //   <View style={{ alignItems: "center", marginTop: 20 }}>
          //     <Text style={{ fontSize: 16, color: "gray" }}>
          //       No roles found.
          //     </Text>
          //   </View>
          // )}
          contentContainerStyle={styles.flatListContainer}
          ListFooterComponent={Loader}
          showsVerticalScrollIndicator={false}
        />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() =>
            navigation.navigate("AddroleScreen", { isUpdateEditdata: false })
          }
        />

        {searchmodal && (
          <OpenmiqModal
            modalVisible={searchmodal}
            setModalVisible={setsearchmodal}
            transcript={transcript}
          />
        )}

        {visible && (
          <DeleteModal
            visible={visible}
            setVisible={setVisible}
            handleDelete={() => HandleDeleteRole(roleId)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Main: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: 2,
  },
  dropdownContainer: {
    marginBottom: 5,
    paddingVertical: 3,
  },
  flatListContainer: {
    paddingBottom: 70, // Add padding to the bottom of the FlatList content
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: ButtonColor.SubmitBtn,
  },
});

export default EditRole;
