import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, TextInput } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import IncAndDicButton from "../IncAndDicButton";

const ItemDataTable = () => {
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [amount, setAmount] = useState(300);

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.smallCell]}>No.</Text>
        <Text style={[styles.cell, styles.flexCell]}>Items</Text>
        <Text style={[styles.cell, styles.smallCell]}>Price</Text>
        <Text style={[styles.cell, styles.smallCell]}>Quantity</Text>
        <Text style={[styles.cell, styles.smallCell]}>Action</Text>
      </View>

      {/* Row */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.smallCell]}>1</Text>
        <Text style={[styles.cell, styles.flexCell]}>iPhone Plus</Text>
        <Text style={[styles.cell, styles.smallCell]}>$300</Text>
        <View style={[styles.cell, styles.smallCell]}>
          <IncAndDicButton />
        </View>
        <View style={[styles.cell, styles.smallCell]}>
          <TouchableOpacity>
            <MaterialIcons name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Price Section */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          editable={false}
          value={`$${amount * quantity}`}
        />
      </View>

      {/* Pay Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.payButton}>
          <MaterialIcons name="payment" size={20} color="white" />
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#fff",
    // paddingVertical:10
    paddingHorizontal:8

  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    // backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 5,
    // marginVertical:10
  },
  cell: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,

  },
  smallCell: {
    // flex: 0.5,
    textAlign:"center"
  },
  flexCell: {
    flex: 1,
  },
  totalContainer: {
    // flexDirection: "row",
    // alignItems: "center",
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
    // width:"25%"

  },
  payButton: {
    flexDirection: "row",
    // alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    paddingVertical:10,
    borderRadius: 8,
    marginBottom:10,

  },
  payButtonText: {
    marginLeft: 5,
    color: "white",
    fontWeight: "bold",
  },
});

export default ItemDataTable;
