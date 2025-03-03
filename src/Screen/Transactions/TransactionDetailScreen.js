import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Card, Button } from "react-native-paper";
import { FontAwesome, MaterialIcons,AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const TransactionDetailScreen = () => {
  const route = useRoute();
  const transaction = route.params;

  if (!transaction) {
    return <Text style={styles.errorText}>Error: No transaction data provided.</Text>;
  }
 
  console.log(transaction, "transaction");
  const {
    amount,
    createdAt,
    transactionStatus,
    id,
    invoice = {},
    user = {},
  } = transaction.transaction;

  return (
    <Card style={styles.card}>
      <Text style={styles.amount}>₹{amount}</Text>
      <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
      <AntDesign name="checkcircleo" size={16} color="green" /> 
           <Text style={[styles.status, transactionStatus === "complete" ? styles.statusComplete : styles.statusPending]}>
        {transactionStatus}
      </Text>
      </View>
      
      <Text style={styles.date}>{new Date(createdAt).toLocaleString()}</Text>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome name="credit-card" size={16} color="gray" />
          <Text style={styles.label}>Payment Mode: {invoice.paymentMode || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="file" size={16} color="gray" />
          <Text style={styles.label}>Invoice ID: {invoice.id || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="hashtag" size={16} color="gray" />
          <Text style={styles.label}>Provision Number: {invoice.provisionNumber || "N/A"}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Avatar.Text size={40} label={user.name ? user.name.charAt(0).toUpperCase() : "U"} />
          <Text style={styles.label}>{user.mobile || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={16} color="gray" />
          <Text style={styles.address}>{invoice.address || "N/A"}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome name="id-card" size={16} color="gray" />
          <Text style={styles.label}>Vendor ID: {id || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="money" size={16} color="gray" />
          <Text style={styles.label}>Vendor Profit: ₹{invoice.vendorprofit ?? "N/A"}</Text>
        </View>
      </View>
      
      <Button mode="contained" style={styles.button}>Download Invoice</Button>
      <TouchableOpacity style={styles.supportButton}>
        <FontAwesome name="phone" size={16} color="blue" />
        <Text style={styles.supportText}>Contact Support</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical:5
  },
  status: {
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  statusComplete: {
    color: "green",
  },
  statusPending: {
    color: "red",
  },
  date: {
    color: "gray",
    textAlign: "center",
    marginBottom: 8,
  },
  section: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    marginLeft: 8,
    fontWeight: "500",
  },
  address: {
    marginLeft: 8,
    color: "gray",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#007bff",
  },
  supportButton: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  supportText: {
    marginLeft: 8,
    color: "#007bff",
  },
  errorText: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
});

export default TransactionDetailScreen;
