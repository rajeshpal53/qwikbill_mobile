import { memo, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, TextInput, Alert } from "react-native";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  incrementQuantity,
  removeFromCart,
  updateQuantity,
} from "./slices/CartSlice";
import { useSnackbar } from "../Store/SnackbarContext";

const MAX_QUANTITY = 10000; // 👈 define max once

const IncAndDicButton = ({ item }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(String(item.quantity));
    const {showSnackbar}=useSnackbar()

  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item));
      setInputValue(String(item.quantity - 1));
    } else {
      dispatch(removeFromCart(item));
    }
  };

  const handleIncrement = () => {
    if (item.quantity < MAX_QUANTITY) {
      dispatch(incrementQuantity(item));
      setInputValue(String(item.quantity + 1));
    } else {
      showSnackbar(`Limit Reached ,You cannot add more than ${MAX_QUANTITY} items.`,"error")
      // Alert.alert("Limit Reached", `You cannot add more than ${MAX_QUANTITY} items.`);
    }
  };

  const handleQuantityChange = (text) => {
    // Allow only numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setInputValue(numericValue);

    if (numericValue === "") return;

    let quantity = parseInt(numericValue, 10);

    if (isNaN(quantity) || quantity <= 0) {
      // reset to 1 if invalid
      quantity = 1;
    } else if (quantity > MAX_QUANTITY) {
      // cap at 1000
      quantity = MAX_QUANTITY;
      // Alert.alert("Limit Reached", `Maximum allowed quantity is ${MAX_QUANTITY}.`);
    showSnackbar(`Limit Reached ,Maximum allowed quantity is ${MAX_QUANTITY}.`,"error")

    }

    dispatch(updateQuantity({ id: item.id, quantity }));
    setInputValue(String(quantity));
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
    width: 40,
    height: 40,
    textAlign: "center",
    fontSize: 14,
    borderRadius: 5,
  },
});

export default memo(IncAndDicButton);
