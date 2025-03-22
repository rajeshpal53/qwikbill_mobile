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
  const { allShops, setAllShops } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  useEffect(() => {
    const getRoleData = async () => {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${userData?.token}`,
      };
      try {
        const response = await readApi(`userRoles/1`, headers);
        console.log("GET ALL DATA IS ", response);
        if (response?.data) {
          setRoleData([response.data]);
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
    getRoleData();
  }, [isFocused, setAllShops]);

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
          <Searchbarwithmic placeholderText="Search User by name ..." />
        </View>

        {/* Dropdown List */}
        <View style={styles.dropdownContainer}>
          <DropDownList options={allShops} />
        </View>

        <FlatList
          data={RoleData}
          renderItem={({ item }) => <AllRoleDetailsCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: "gray" }}>
                No roles found.
              </Text>
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
          ListFooterComponent={Loader}
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
