import { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

const IncAndDicButton = ({ setInCart, InCart }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1); // Increase the quantity
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1); // Decrease the quantity, prevent going below 1
    } else {
      //   setInCart(false);
    }
  };
  return (
    <View style={styles.main}>
      <View style={styles.quantityControlContainer}>
        <TouchableOpacity
          onPress={decreaseQuantity}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          onPress={increaseQuantity}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    // borderRadius: 10,
    backgroundColor: "#fff",
    // marginHorizontal: 10,
    // marginVertical: 2,
  },
  quantityControlContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    // paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default IncAndDicButton;
