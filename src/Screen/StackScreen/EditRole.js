import { useCallback, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import UserDataContext from "../../Store/UserDataContext";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ButtonColor, readApi } from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";
import DropDownList from "../../UI/DropDownList";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import AllRoleDetailsCard from "../../Component/Cards/AllRoleDetailsCard";
import { FlatList } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import NoDataFound from "../../Components/NoDataFound";


const EditRole = () => {
  const route = useRoute();
  const { isAdmin, AdminRoleData } = route.params;
  const [RoleData, setRoleData] = useState([]);
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const isFocused = useIsFocused();

  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);

  console.log("DATA OF SELECTED SHOP ", selectedShop?.id);

  console.log("IS ADMIN DATA IS ", RoleData.length);
  console.log("IS AdminRoleData DATA IS ", AdminRoleData?.id);

  useEffect(() => {
    searchdata();
  }, [searchQuery]);

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
      if (selectedShop?.id) {
        api = `userRoles/getUserRoleByVendorfk/${selectedShop.id}`;
      } else {
        console.log("selectedShop.id is missing");
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

  const searchdata = () => {
    if (searchQuery?.length > 0) {
      const found = RoleData.filter((item) =>
        item?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <View style={styles.Main}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbarwithmic
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setsearchmodal={setsearchmodal}
            setTranscript={setTranscript}
            placeholderText="Search Vender ..."
            searchData={searchdata}
          />
        </View>

        {/* Dropdown List */}
        {!isAdmin && (
          <View style={styles.dropdownContainer}>
            <DropDownList options={allShops} />
          </View>
        )}

        <FlatList
          data={searchCalled ? searchedData : RoleData}
          renderItem={({ item }) => (
            <AllRoleDetailsCard item={item} getRoleData={getRoleData} />
          )}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
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
                <NoDataFound textString={"No Users Found"} />
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
          onPress={() => navigation.navigate("AddroleScreen")}
        />
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
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
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

// Loading Indicator
//         {loading && (
//           <View style={{ flex: 1, justifyContent: "center" }}>
//             <ActivityIndicator size={"large"} />
//           </View>
//         )}
