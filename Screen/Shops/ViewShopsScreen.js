// ViewShopsScreen.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ItemList from "../../Components/Lists/ItemList";
import { readApi } from "../../Util/UtilApi";

export default function ViewShopsScreen() {
  const navigation = useNavigation();
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    const getShopData = async () => {
      const response = await readApi(`api/shop/list`);
      setShopData(response.result);
    };
    getShopData();
  }, []);

  const handleDelete = (id) => {
    console.log(`Shop with ID ${id} deleted`);
  };

  const handleEdit = (item) => {
    // console.log(`Editing shop with ID ${id}`);
    console.log("item under viewshop , ", item);
    navigation.navigate("CreateShopScreen", { shop: item });
  };

  const handleView = (id) => {
    console.log(`Viewing shop with ID ${id}`);
  };

  const renderExpandedContent = (item) => (
    <View style={{
      marginLeft:"14.5%"
    }}>
      <Text>Show Information</Text>
      {/* <Button title="more" onPress ={() => handleView(item._id)} /> */}
        
    </View>
  );

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (id) => handleEdit(item) },
    // { title: "Delete", onPress: (id) => setModalVisible(id) },
  ]

  return (
    <View style={styles.container}>
      <ItemList
        data={shopData}
        titleKey="shopname"
        subtitleKey="address[0].city"
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
        expandedItems={renderExpandedContent}
        menuItems={menuItems}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddShop")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
