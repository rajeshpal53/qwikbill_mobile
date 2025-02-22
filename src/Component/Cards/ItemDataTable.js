import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import IncAndDicButton from "../../Redux/IncAndDicButton";
import { useDispatch, useSelector } from "react-redux";
import {
  applyDiscount,
  removeFromCart,
} from "../../Redux/slices/CartSlice";
import PriceDetails from "../PriceDetails";
import { fontSize } from "../../Util/UtilApi";

const ItemDataTable = () => {
  const carts = useSelector((state) => state.cart.Carts);
  const dispatch = useDispatch();

  return (
    <>
      <Card style={styles.card}>
        {/* Header */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.smallCell]}>No.</Text>
          <Text style={[styles.cell, styles.flexCell]}>Items</Text>
          <Text style={[styles.cell, styles.smallCell]}>Price</Text>
          <Text style={[styles.cell, styles.smallCell]}>Quantity</Text>
          <Text style={[styles.cell, styles.smallCell]}>Action</Text>
        </View>

        {/* Items List */}
        <FlatList
          data={carts}
          keyExtractor={(item) => item.id.toString()} // Using a unique `id` as key
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.smallCell]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.flexCell]}>{item?.Name}</Text>
              <Text style={[styles.cell, styles.smallCell]}>
                ${(item?.Price * item?.quantity).toFixed(2)}
              </Text>
              <View style={[styles.cell, styles.smallCell]}>
                <IncAndDicButton item={item} />
              </View>
              <View style={[styles.cell, styles.smallCell]}>
                <TouchableOpacity
                  onPress={() => dispatch(removeFromCart(item?.id))}
                >
                  <MaterialIcons name="delete" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </Card>
      {/* <PriceDetails /> */}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 2,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#fff",
    // paddingVertical: 20,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // paddingHorizontal: 5,
  },
  cell: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.label,
  },
  smallCell: {
    textAlign: "center",
  },
  flexCell: {
    flex: 1,
  },
  totalContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    height: 35,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 5,
    color: "white",
    fontWeight: "bold",
  },
});

export default ItemDataTable;

{
  /* Total Price Section
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          editable={false}
          value={`$ ${totalPrice.toFixed(2)}`}
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Discount :</Text>
      </View> */
}
