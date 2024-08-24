// ViewShopsScreen.js
import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { FAB, Text, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ItemList from "../../Components/Lists/ItemList";
import { readApi } from "../../Util/UtilApi";
import { useIsFocused } from "@react-navigation/native";
import { useSnackbar } from "../../Store/SnackbarContext";
import { deleteApi } from "../../Util/UtilApi";
import DeleteModal from "../../UI/DeleteModal";
import {AuthContext} from "../../Store/AuthContext"


const fetchSearchData = async (searchQuery) => {
  try {
    // console.log("shopid , ,", shopId)
    const response = readApi(
      `api/shop/list?&q=${searchQuery}&fields=shopname`
    );
    const result = await response;

    // console.log("searchResult is ", result.result);
    // console.log("searchResult length is ", result.result.length);
    return result.result;
    
  } catch (error) {
    console.error("error to search data", error);
  }
};

export default function ViewShopsScreen() {
  const navigation = useNavigation();
  const [shopData, setShopData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  const {searchQuery} = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {showSnackbar} = useSnackbar();
  const isFocused = useIsFocused();

  useEffect(() => {
    const getShopData = async () => {

      try{
      const response = await readApi(`api/shop/list`);
      setShopData(response.result);

      }catch(error){
        console.error("error", error)
      }finally{
        setIsLoading(false);
      }
    };
    getShopData();
  }, [isFocused]);


  useEffect(() => {

    const fetchSearchingData = async() => {
      const newData = await fetchSearchData(searchQuery);

      //  setSearchedData(newData);
      setShopData(newData);
    }
    
    fetchSearchingData();
  }, [searchQuery])

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const handleDelete = async() => {
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

  const handleView = (id) => {
    console.log(`Viewing shop with ID ${id}`);
    navigation.navigate("StackNavigator", {
      screen: "ShopDetails",
      params: {
        shopId: id,
      },
    })
  };

  const setModalVisible = (item) => {

    setDeleteId(item._id);
    setIsModalVisible(true);

  }

  const renderExpandedContent = (item) => (
    <View>
      <Text style={{color: "#777", fontSize: 12}}>{item.address[0].city}</Text>
      <Text style={{color: "#777", fontSize: 12}}>{item.email}</Text>
    </View>
  );

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (item) => handleEdit(item) },
    { title: "Delete", onPress: (item) => setModalVisible(item) },
  ]

  return (
    <View style={styles.container}>
      <ItemList
        data={shopData}
        titleKey="shopname"
        subtitleKey="phone"
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
        expandedItems={renderExpandedContent}
        menuItems={menuItems}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("CreateShopScreen" , {
            isHome:false,
          }
        )}
      />
      {isModalVisible && (
        <DeleteModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          handleDelete={handleDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center"
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
