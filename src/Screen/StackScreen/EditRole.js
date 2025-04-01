import { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import UserDataContext from "../../Store/UserDataContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ButtonColor, readApi } from "../../Util/UtilApi";
import { ShopContext } from "../../Store/ShopContext";
import DropDownList from "../../UI/DropDownList";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import AllRoleDetailsCard from "../../Component/Cards/AllRoleDetailsCard";
import { FlatList } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";

const EditRole = () => {
  const [RoleData, setRoleData] = useState([]);
  const { userData } = useContext(UserDataContext);
  const { allShops, selectedShop } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  console.log("DATA OF SELECTED SHOP ", selectedShop?.id)


  useEffect(() => {
    const getRoleData = async () => {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${userData?.token}`,
      };
      try {
        const response = await readApi(`userRoles/getUserRoleByVendorfk/${selectedShop?.id}`, headers);
        console.log("GET ALL DATA IS125 ", response?.data);
        if (response?.data) {
          setRoleData(response.data);
          setFilteredData(response.data)
          console.log("GET ALL DATA IS response", response.data);
        } else {
          setRoleData([]); // If no data is found
          setFilteredData([])
        }
      } catch (error) {
        console.log("Unable to fetch Role data", error);
        setRoleData([]); // On error, clear the list
        setFilteredData([])
      } finally {
        setLoading(false);
      }
    };
    getRoleData();
  }, [isFocused, selectedShop]);


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
      setFilteredData([...RoleData]);  // Reset to full list when search is empty
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
  



  return (
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
                  placeholderText="Search User by name ..."
                  searchData={searchData}  // Pass searchData function
                />
              </View>

              <View style={styles.dropdownContainer}>
                <DropDownList options={allShops} />
              </View>
            </>
          }
          data={filteredData} // Use filteredData instead of RoleData
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => <AllRoleDetailsCard item={item} />}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: "gray" }}>No roles found.</Text>
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
          ListFooterComponent={Loader}
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() =>
            navigation.navigate("AddroleScreen", { isUpdateEditdata: false, })
          }
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
    marginBottom: 10,
  
  },
  dropdownContainer: {
    marginBottom: 8,
    paddingVertical:3,
    
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

