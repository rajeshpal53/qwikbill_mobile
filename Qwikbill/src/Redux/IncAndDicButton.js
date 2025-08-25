import { memo, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  incrementQuantity,
  removeFromCart,
} from "./slices/CartSlice";

const IncAndDicButton = ({item }) => {
  const dispatch = useDispatch();

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item));
    }else{
      dispatch(removeFromCart(item));
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.quantityControlContainer}>
        <TouchableOpacity
          onPress={()=> handleDecrement(item)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => dispatch(incrementQuantity(item))}
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
    width: 30,
    height: 30,
    // paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 3
  },
});

export default memo(IncAndDicButton);
