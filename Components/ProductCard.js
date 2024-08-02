import React, { useState, useContext } from "react";
import { Button, Card, Text, IconButton, Icon, Menu, Avatar } from "react-native-paper";
import { StyleSheet, View, FlatList } from "react-native";
import DeleteModal from "../UI/DeleteModal";
import{useSnackbar} from "../Store/SnackbarContext";
import { deleteApi } from "../Util/UtilApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
// import Icon from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-gesture-handler";

function ProductCard({ products, navigation,setProducts }) {
  const [visible, setVisible] = useState(false);
  const [productId, setProductId] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const{showSnackbar}=useSnackbar()
  function deleteProductHandler(id) {
    setProductId(id);
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
    // Your delete logic here
    console.log(productId);
    const updatedInvoice = products.filter((item) => item._id !== productId);
    // setInvoices((prev)=>prev.filter((item) => item.id !== productId));
    setProducts(updatedInvoice);
    setVisible(false);
    try {
      const response = await deleteApi(`api/product/delete/${productId}`);
        console.log("item delted");
        showSnackbar("item delete successfully","success")
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the item","error")
    }
  };
  function ProductDetail(id) {
    navigation.navigate("ProductDetail", {
      productId: id,
    });
  }



  function editProductHandler(id) {
    navigation.navigate("EditProduct", {
      productId: id,
    });
  }

  const renderItem = ({ item }) => {
    const isExpanded = item._id === expandedId;
    return (
        <TouchableOpacity 
        onPress={() => {
          // customerDetail(item._id);
          toggleExpand(item._id)
        }}
        // style={{backgroundColor:"orange"}}
      >
        <View style={styles.itemContainer}>
          <View style={styles.underItemContainer}>
            <Avatar.Text label={item.name.charAt(0)} size={40} />
            <View style={styles.itemContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>${item.price}</Text>
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
              onPress={() => ProductDetail(item._id)}
              title="View Product"
            />
            <Menu.Item
              style={{ color: "black" }}
              onPress={() => editProductHandler(item._id)}
              title="Edit Product"
            />
            <Menu.Item
              onPress={() => deleteProductHandler(item._id)}
              title="Delete Product"
            />
           </Menu>
          </View>
          {isExpanded && (
            <View style={styles.extraInfo}>
              <Text>{item.name}</Text>
              <Text>{item.name}</Text>
              <Text>{item.name}</Text> 
              <Text>{item.name}</Text> 
            </View>
          )}
        </View>

        </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Products List</Text>
           <FlatList
             data={products}
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
    marginVertical: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor:"orange"
  },
  cardMainContent:{
    // backgroundColor:"orange",
    flexDirection:"row",
    justifyContent:"space-between",
    paddingBottom:10
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
    backgroundColor: '#fff',
    // backgroundColor:"orange",
    // marginBottom:75
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#f9f9f9',
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
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
    color: '#555',
  },
  extraInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  underItemContainer: {
    flexDirection:"row"
  },
  menuButton: {
    padding: 10,
  },
});
export default ProductCard;
