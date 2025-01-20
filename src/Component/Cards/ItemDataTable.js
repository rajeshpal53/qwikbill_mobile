import { Card, IconButton } from "react-native-paper";
import { View, Text, StyleSheet, Image } from "react-native";
import { useState } from "react";

const ItemDataTable = () => {
  const [quantity, setQuantity] = useState(1); // State for quantity

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1); // Prevent going below 1
  };

  return (
    <Card style={styles.card}>
      <Card style={styles.Innercard}>
        <View style={styles.innerContainer}>
          {/* Product Image */}
          <Image
            source={require("../../../assets/profile.png")}
            style={styles.productImage}
            resizeMode="contain"
          />

          {/* Product Details */}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>iPhone</Text>
            <Text style={styles.productPrice}>$300</Text>
          </View>

          {/* Quantity Control */}
          <View style={styles.counterContainer}>
            <IconButton
              icon="minus"
              size={15}
              onPress={decreaseQuantity}
              style={styles.iconButton}
            />
            <Text style={styles.quantityText}>{quantity}</Text>
            <IconButton
              icon="plus"
              size={15}
              onPress={increaseQuantity}
              style={styles.iconButton}
            />
          </View>
        </View>
      </Card>
      <View style={styles.PriceView}>
        <Text style={styles.Price}>Total : {300}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical:10,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#fff",

  },
  Innercard:{
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#fff",

  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 10,
    color: "gray",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "#f0f0f0",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  PriceView: {
    marginVertical: 10,
    paddingVertical: 10,
  },
  Price: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});

export default ItemDataTable;
