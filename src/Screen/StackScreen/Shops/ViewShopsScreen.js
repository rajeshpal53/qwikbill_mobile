// ViewShopsScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FAB, Text, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ItemList from "../../../Components/Lists/ItemList";
import { fontSize, readApi } from "../../../Util/UtilApi";
import { useIsFocused } from "@react-navigation/native";
import { useSnackbar } from "../../../Store/SnackbarContext";
import { deleteApi } from "../../../Util/UtilApi";
import DeleteModal from "../../../UI/DeleteModal";
import { AuthContext } from "../../../Store/AuthContext";
import UserDataContext from "../../../Store/UserDataContext";
import ViewAllVendersCard from "../../../Component/Cards/ViewAllVendersCard";
import Searchbarwithmic from "../../../Component/Searchbarwithmic";
import OpenmiqModal from "../../../Modal/Openmicmodal";
// const fetchSearchData = async (searchQuery) => {
//   try {
//     // console.log("shopid , ,", shopId)
//     const response = readApi(`api/shop/list?&q=${searchQuery}&fields=shopname`);
//     const result = await response;
//     return result.result;
//   } catch (error) {
//     console.error("error to search data", error);
//   }
// };

export default function ViewShopsScreen() {
  const navigation = useNavigation();
  const [shopData, setShopData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  // const { searchQuery } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { showSnackbar } = useSnackbar();
  const isFocused = useIsFocused();
  const { userData } = useContext(UserDataContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [SelectedBtn, setSelectedBtn] = useState("");
  // useEffect(() => {
  //   const getShopData = async () => {

  //     try{
  //     const response = await readApi(`api/shop/list`);
  //     setShopData(response.result);

  //     }catch(error){
  //       console.error("error", error)
  //     }finally{
  //       setIsLoading(false);
  //     }
  //   };
  //   getShopData();
  // }, [isFocused]);

  useEffect(() => {
    console.log("Inside a useeffect ");
    const fetchVendorData = async () => {
      try {
        setIsLoading(true);
        const token = userData?.token;
        // const api = `qapi/vendors/${userData?.user?.id}`
        const response = await readApi(
          `qapi/vendors//getVendorsByUserId/${userData?.user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setShopData(response);
      } catch (err) {
        setShopData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [isFocused]);

  // useEffect(() => {
  //   const fetchSearchingData = async () => {
  //     const newData = await fetchSearchData(searchQuery);

  //     //  setSearchedData(newData);
  //     setShopData(newData);
  //   };

  //   fetchSearchingData();
  // }, [searchQuery]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const handleDelete = async () => {
    // console.log(`Shop with ID ${item._id} deleted`);
    const updatedShops = shopData.filter((item) => item._id !== deleteId);

    try {
      const response = await deleteApi(`api/shop/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("Shop deleted successfully", "success");
      setShopData(updatedShops);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the Shop", "error");
    }
  };

  const handleEdit = (item) => {
    // console.log(`Editing shop with ID ${id}`);
    // console.log("item under viewshop , ", item);
    navigation.navigate("CreateShopScreen", { shop: item });
  };

  // const handleView = (id) => {
  //   console.log(`Viewing shop with ID ${id}`);
  //   navigation.navigate("StackNavigator", {
  //     screen: "ShopDetails",
  //     params: {
  //       shopId: id,
  //     },
  //   });
  // };

  const setModalVisible = (item) => {
    setDeleteId(item._id);
    setIsModalVisible(true);
  };

  const renderExpandedContent = (item) => (
    <View>
      <Text style={{ color: "#777", fontSize: 12 }}>
        {item.address[0].city}
      </Text>
      <Text style={{ color: "#777", fontSize: 12 }}>{item.email}</Text>
    </View>
  );

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (item) => handleEdit(item) },
    { title: "Delete", onPress: (item) => setModalVisible(item) },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.InnerContainer}>
        <Searchbarwithmic
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setsearchmodal={setsearchmodal}
          setTranscript={setTranscript}
          placeholderText="Search Vender ..."
          //    refuser={searchBarRef}
        />

        <View style={styles.allbuttonView}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["AllVenders", "Approved", "Pending", "Reject"].map(
              (suggestbtn, key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.suggestionButton,
                    SelectedBtn === suggestbtn &&
                      styles.selectedSuggestionButton,
                  ]}
                  onPress={() => setSelectedBtn(suggestbtn)}
                >
                  <Text style={styles.suggestbtnText}>{suggestbtn}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        <FlatList
          data={shopData}
          renderItem={({ item, index }) => (
            <ViewAllVendersCard
              item={item}
              index={index}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: "gray" }}>
                No products found.
              </Text>
            </View>
          )}
        />

        {/* <ItemList
        data={shopData}
        titleKey="shopname"
        subtitleKey="phone"
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
        expandedItems={renderExpandedContent}
        menuItems={menuItems}
      /> */}

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() =>
            navigation.navigate("CreateShopScreen", {
              isHome: false,
            })
          }
        />
        {isModalVisible && (
          <DeleteModal
            visible={isModalVisible}
            setVisible={setIsModalVisible}
            handleDelete={handleDelete}
          />
        )}

        {searchmodal && (
          <OpenmiqModal
            modalVisible={searchmodal}
            setModalVisible={setsearchmodal}
            transcript={transcript}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    backgroundColor: "#fff",
  },
  InnerContainer: {
    marginTop: 10,
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  selectedSuggestionButton: {
    backgroundColor: "#bee2eb",
  },
  allbuttonView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
    // backgroundColor:"#F5F5F5"
  },
  suggestionButton: {
    borderWidth: 2,
    paddingVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  suggestbtnText: {
    fontSize: fontSize.labelMedium,
    fontFamily: "Poppins-Medium",

    // backgroundColor:"#F5F5F5"
  },
});
