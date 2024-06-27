import React, { useState, useContext } from "react";
import { Button, Card, Text } from "react-native-paper";
import { IconButton, Icon } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import DeleteModal from "../UI/DeleteModal";
import { ProductContext } from "../Store/ProductContext";
import{useSnackbar} from "../Store/SnackbarContext";
function ProductCard({ products, navigation }) {
  const [visible, setVisible] = useState(false);
  const [productId, setProductId] = useState("");
  const { setProducts } = useContext(ProductContext);
  const{showSnackbar}=useSnackbar()
  function deleteProductHandler(id) {
    setProductId(id);
    setVisible(true);
  }
 

  const handleDelete = async () => {
    // Your delete logic here
    console.log(productId);
    const updatedInvoice = products.filter((item) => item._id !== productId);
    // setInvoices((prev)=>prev.filter((item) => item.id !== productId));
    setProducts(updatedInvoice);
    setVisible(false);
    try {
      const response = await fetch(
        `http://192.168.1.9:8888/api/product/delete/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("item delted");
        showSnackbar("item delete successfully","success")
      } 
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
  return (
    <View>
      {products.map((item, index) => {
        return (
          <Card
            key={index}
            style={styles.card}
            onPress={() => {
              ProductDetail(item._id);
            }}
          >
            <Card.Title title={item.created} titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text variant="headlineLarge">{item.name}</Text>
              <Text variant="bodyMedium" style={styles.cardText}>
                {" "}
                {item.productCategory.name}
              </Text>
              <Text variant="labelSmall" style={styles.cardText}>
                {" "}
                {item.productCategory.description}
              </Text>
              <Text variant="labelSmall" style={styles.cardText}>
                {" "}
                ${item.price}
              </Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="delete"
                iconColor="#1976d2"
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
                style={{ backgroundColor: "#1976d2" }}
               onPress={()=>editProductHandler(item._id)}
              >
                <Icon source="pencil" color="white" size={20} /> Edit
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
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
  cardText: {
    marginVertical: 5,
  },
});
export default ProductCard;
