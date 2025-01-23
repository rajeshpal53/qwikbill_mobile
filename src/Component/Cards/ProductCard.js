import { useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";
import IncAndDicButton from "../IncAndDicButton";

const ProductCardDetails = ({ item, setshowOverlay }) => {
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(0);

  const handleAddToCart = (item) => {
    console.log("Value of item", item);
    setInCart(true);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <View style={styles.container}>
          {/* Product Image */}
          {/* <Image
            source={require("../../../assets/profile.png")}
            style={styles.productImage}
            resizeMode="contain"
          /> */}

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.productName}>{item.Name}</Text>
            <Text style={styles.productInfo}>{item.info}</Text>

            {/* Price and Button */}
            <View style={styles.textButtonView}>
              <Text style={styles.productPrice}>${item["Selling Price"]}</Text>
              {/* Conditional rendering of 'Add to Cart' or quantity controls */}
              {
                !inCart ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                ) : (
                  <IncAndDicButton inCart={inCart} setInCart={setInCart} />
                )
                // (
                //   <View style={styles.quantityControlContainer}>
                //     <TouchableOpacity
                //       onPress={decreaseQuantity}
                //       style={styles.quantityButton}
                //     >
                //       <Text style={styles.quantityButtonText}>-</Text>
                //     </TouchableOpacity>
                //     <Text style={styles.quantityText}>{quantity}</Text>
                //     <TouchableOpacity
                //       onPress={increaseQuantity}
                //       style={styles.quantityButton}
                //     >
                //       <Text style={styles.quantityButtonText}>+</Text>
                //     </TouchableOpacity>
                //   </View>
                // )
              }
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  card: {
    elevation: 4,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 2,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  productImage: {
    width: 70,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  detailsContainer: {
    marginLeft: 15,
    justifyContent: "center",
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  textButtonView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  quantityControlContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ProductCardDetails;
