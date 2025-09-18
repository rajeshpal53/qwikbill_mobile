import { memo, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  incrementQuantity,
  removeFromCart,
  updateQuantity,
} from "./slices/CartSlice";

const IncAndDicButton = ({ item }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(String(item.quantity));

  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item));
      setInputValue(String(item.quantity - 1));
    } else {
      dispatch(removeFromCart(item));
    }
  };

  const handleIncrement = () => {
    dispatch(incrementQuantity(item));
    setInputValue(String(item.quantity + 1));
  };

const handleQuantityChange = (text) => {
  // Allow only numbers
  const numericValue = text.replace(/[^0-9]/g, "");
  setInputValue(numericValue);

  // If user cleared input, don't dispatch yet
  if (numericValue === "") return;

  const quantity = parseInt(numericValue, 10);

  if (!isNaN(quantity) && quantity > 0) {
    dispatch(updateQuantity({ id: item.id, quantity }));
  } else {
    // If invalid (0, NaN), force reset to 1 in Redux
    dispatch(updateQuantity({ id: item.id, quantity: 1 }));
    setInputValue("1");
  }
};


  return (
    <View style={styles.main}>
      <View style={styles.quantityControlContainer}>
        <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.quantityInput}
          value={inputValue}
          keyboardType="numeric"
          onChangeText={handleQuantityChange}
         
        />

        <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#fff",
  },
  quantityControlContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    width: 30,
    height: 30,
    borderRadius: 20,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 30,
    height: 40,
    textAlign: "center",
    justifyContent:"flex-end",
    fontSize: 13,
    borderRadius: 5,
  },
});

export default memo(IncAndDicButton);
