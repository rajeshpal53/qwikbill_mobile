import React, { useState, useContext } from "react";
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon, AvatarMenu, Avatar, Menu} from "react-native-paper";
import { StyleSheet, View, FlatList } from "react-native";
import DeleteModal from "../UI/DeleteModal";
import { useSnackbar } from "../Store/SnackbarContext";
import { deleteApi } from "../Util/UtilApi";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function CustomerCard({ customer, navigation, setCustomer }) {
  const [visible, setVisible] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const { showSnackbar } = useSnackbar();
  function deleteCustomerDelete(id) {
    setCustomerId(id);
    setVisible(true);
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

  const handleDelete = async () => {
    const updateCustomer = customer.filter((item) => item._id !== customerId);
    setCustomer(updateCustomer);
    setVisible(false);
    try {
      const response = await deleteApi(`api/people/delete/${customerId}`);

      showSnackbar("item delete successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete the item", "error");
    }
  };
  function customerDetail(id) {
    navigation.navigate("CustomerDetail", {
      customerId: id,
    });
  }
  function editCustomerhandler(id) {
    navigation.navigate("EditCustomer", {
      customerId: id,
    });
  }

  const renderItem = ({ item }) => {
    const isExpanded = item._id === expandedId;
    return (
      
      <TouchableOpacity
        onPress={() => {
          // customerDetail(item._id);
          toggleExpand(item._id);
        }}
      >

        <View style={styles.itemContainer}>
          <View style={styles.underItemContainer}>
           <Avatar.Text label={item.firstname.charAt(0)} size={40} />
           <View style={styles.itemContent}>
             <Text style={styles.name}>{`${item.firstname} ${item.lastname}`}</Text>
             <Text style={styles.phone}>{item.phone}</Text>
            </View>

            <Menu
            visible={visible && currentItem?._id === item._id} // Check if currentItem matches the item
            onDismiss={hideMenu}
            anchor={
              <TouchableOpacity
                onPress={() => showMenu(item)}
                style={styles.menuButton}
              >
                <Feather name="more-vertical" size={24} color="black" />
              </TouchableOpacity>
            }
            anchorPosition="bottom"
           >
            <Menu.Item
              style={{ color: "black" }}
              onPress={() => customerDetail(item._id)}
              title="View Customer"
            />
            <Menu.Item
              style={{ color: "black" }}
              onPress={() => editCustomerhandler(item._id)}
              title="Edit Customer"
            />
            <Menu.Item
              onPress={() => deleteCustomerDelete(item._id)}
              title="Delete People"
            />
           </Menu>
           </View>
          {isExpanded && (
            <View style={styles.extraInfo}>
              <Text>{item.email}</Text>
              <Text>{item.isClient ? "Client" : "not a Client"}</Text>
              <Text>Address : {item?.address || "NA"}</Text>
              <Text>GST Number : {item?.gstnumber || "NA"}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peoples List</Text>
      <FlatList
        data={customer}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  cardTitle: {
    color: "gray",
  },
  card: {
    padding: 10,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor:"orange"
  },
  cardMainContent: {
    // backgroundColor:"orange",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  cardText: {
    marginVertical: 5,
  },
  actionBtnContainer: {
    // backgroundColor: "orange",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  actionBtns:{ 
    backgroundColor: "#0c3b73", 
    width:100, 
    justifyContent:"center"  
  },
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemContent: {
    flex:1,
    marginLeft:10
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 16,
    color: "#555",
  },
  extraInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  underItemContainer: {
    flexDirection:"row"
  },
  menuButton: {
    padding: 10,
  },
});
