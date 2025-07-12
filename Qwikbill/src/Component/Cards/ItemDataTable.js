import React, { useState,useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native";
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

const ItemDataTable = ({discountValue}) => {
  const carts = useSelector((state) => state.cart.Carts);
  const dispatch = useDispatch();
  console.log("carts is " , carts);
  const value = (carts?.sellPrice * carts?.quantity * carts?.taxRate) /
          100;
  console.log("value is " , value);
  const COLUMN_WIDTHS = {
  small: 80,
  medium: 120,
};
  const totalPrice = useSelector((state) => state.cart.totalPrice);

const [discountRate,setDiscountRate]=useState(0);

useEffect(() => {
  const discount = parseFloat(discountValue) || 0;
  const total = parseFloat(totalPrice) || 0;

  if (total > 0) {
    const rate = (1 - discount / total) * 100;
    setDiscountRate(parseFloat(rate.toFixed(2)));

  } else {
    setDiscountRate(0); // avoid division by zero
  }
}, [discountValue, totalPrice]);

console.log("discountRate is ", discountRate,totalPrice);  

  return (
    <View style={{ flex: 1 }}>
  <ScrollView
    horizontal
    contentContainerStyle={{ padding: 10 }}
    nestedScrollEnabled={true}
    keyboardShouldPersistTaps="handled"
  >
    <Card style={styles.card}>
      {/* Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>No.</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.medium }]}>Items</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Rate</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Qty</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Amount</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Discount %</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Discount Amt</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Amt After Disc</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>GST %</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>GST Amt</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Total</Text>
        <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>Action</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={carts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const amount = item.sellPrice * item.quantity||0;
          const discountAmt = (amount * discountRate) / 100;
          const amtAfterDiscount = amount - discountAmt;
          const gstAmt = (amtAfterDiscount * item.taxRate) / 100;
          const total = amtAfterDiscount + gstAmt;

          return (
            <View style={styles.row}>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>{index + 1}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.medium }]}>{item.name}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>₹{item.sellPrice}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>{item.quantity}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>₹{amount.toFixed(2)}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>{discountRate||0}%</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>₹{discountAmt.toFixed(2)}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>₹{amtAfterDiscount.toFixed(2)}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>{item.taxRate}%</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>₹{gstAmt.toFixed(2)}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>₹{total.toFixed(2)}</Text>
              <View style={[styles.cell, { width: COLUMN_WIDTHS.small }]}>
                <TouchableOpacity onPress={() => dispatch(removeFromCart(item))}>
                  <MaterialIcons name="delete" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </Card>
  </ScrollView>
</View>
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
    minWidth:200
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
    
    //paddingHorizontal: 5,
  },
  cell: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.labelMedium,
  },
  smallCell: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    
  },
  flexCell: {
    // flex: 1,
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