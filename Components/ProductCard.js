import React, { useState, useContext } from "react";
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet, View, FlatList } from "react-native";
import DeleteModal from "../UI/DeleteModal";
import{useSnackbar} from "../Store/SnackbarContext";
import { deleteApi } from "../Util/UtilApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function ProductCard({ products, navigation,setProducts }) {
  const [visible, setVisible] = useState(false);
  const [productId, setProductId] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const{showSnackbar}=useSnackbar()
  function deleteProductHandler(id) {
    setProductId(id);
    setVisible(true);
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
        <Card
        // key={index}
        style={styles.card}
        onPress={() => {
          // customerDetail(item._id);
          toggleExpand(item._id)
        }}
      >
        {/* <Card.Title title={item.created} titleStyle={styles.cardTitle} /> */}
        <Card.Content style={styles.itemContent}>
          <View style = {styles.cardMainContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>${item.price}</Text>
          </View>
          
          {isExpanded && (
            <View style={styles.extraInfo}>
              <Text>{item.name}</Text>
              <Text>{item.name}</Text>
              <Text>{item.name}</Text> 
              <Text>{item.name}</Text> 
            </View>
          )}
        </Card.Content>
        {isExpanded && (
          <Card.Actions>
            <View style={styles.actionBtnContainer}>
            <Button
            style={styles.actionBtns}
            onPress={() => ProductDetail(item._id)}>
              <Icon source="eye" color="white" size={20} />{" "}
              <Text style={{ color: "white" }}>View</Text>
          </Button>
          <IconButton
            icon="delete"
            iconColor="#0c3b73"
            size={20}
            onPress={() => deleteProductHandler(item._id)}
          />
          {visible && (
            <DeleteModal
              visible={visible}
              setVisible={setVisible}
              handleDelete={handleDelete}
            />
          )}
          <Button
            style={styles.actionBtns}
            onPress={() => editProductHandler(item._id)}
          >
            <Icon source="pencil" color="white" size={20} /> 
            <Text style={{color:"white"}}>Edit</Text>
          </Button>
          </View>
        </Card.Actions>
        )}

        </Card>
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
    padding: 20,
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
    flexDirection: 'column',
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
});
export default ProductCard;
