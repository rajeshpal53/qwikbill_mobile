import { useContext, useEffect, useState, useRef } from "react";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { readApi } from "../../Util/UtilApi";
import React from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Menu, Divider, Text, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function ViewShopsScreen() {
  const navigation = useNavigation();
  const [shopData, setShopData] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const menuAnchorRef = useRef(null); // Ref for the menu anchor

  const showMenu = (item) => {
    setCurrentItem(item);
    setVisible(true);
    console.log("menu clicked");
  };

  const hideMenu = () => {
    setVisible(false);
    setCurrentItem(null); // Reset current item when hiding the menu
    console.log("hide clicked");
  };

  // const {shopDetails} = useContext(ShopDetailContext);
  // console.log("shopDetails ", shopDetails)

  useEffect(() => {
    const getshopdata = async () => {
      const response = await readApi(`api/shop/list`);
      // console.log("response is ", response);
      setShopData(response.result); // Adjust according to your API response
    };
    getshopdata();
  }, []);

  const shopClickHandler = (item) => {
    console.log("item clicked is ", item.shopname);
  };

  const modifyShopHandler = (item) => {
    console.log(item.shopname, " shop is modified");

    hideMenu();
    navigation.navigate("StackNavigator", {
      screen: "CreateShopScreen",
      params: {
        data: item,
      },
    });
  };

  const deleteShopHandler = (item) => {
    console.log(item.shopname, " shop is deleted");
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => shopClickHandler(item)}>
        <View style={styles.itemContainer}>
          <Avatar.Text label={item.shopname.charAt(0)} size={40} />
          <View style={styles.itemContent}>
            <Text style={styles.shopName}>{item.shopname}</Text>
            <Text style={styles.phone}>{item.address[0].city}</Text>
          </View>

          <Menu
            visible={visible && currentItem?._id === item._id} // Check if currentItem matches the item
            onDismiss={hideMenu}
            anchor={
              <TouchableOpacity
                onPress={() => showMenu(item)}
                style={styles.menuButton}
              >
                <Icon name="more-vert" size={24} color="black" />
              </TouchableOpacity>
            }
            anchorPosition="bottom"
          >
            <Menu.Item
              style={{ color: "black" }}
              onPress={() => modifyShopHandler(item)}
              title="Modify Shop"
            />
            <Menu.Item
              onPress={() => deleteShopHandler(item)}
              title="Delete Shop"
            />
            {/* <Divider />
            <Menu.Item onPress={() => console.log('Option 3')} title="Option 1" /> */}
          </Menu>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
    <View>
      <FlatList
        data={shopData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      
    </View>
    <FAB icon="plus" style={styles.fab} 
    //   onPress={toggleModal} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phone: {
    color: "#555",
  },
  menuButton: {
    padding: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    // backgroundColor: "black",
  },
});
