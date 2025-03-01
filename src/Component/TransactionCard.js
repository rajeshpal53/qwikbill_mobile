import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontFamily } from '../Util/UtilApi';

const TransactionCard = ({transaction}) => {
  return (
    <View style={styles.card}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{transaction?.user?.name?transaction?.user?.name[0].toUpperCase():"U"}</Text>
    </View>

    <View style={styles.info}>
      <Text style={styles.name}>{transaction?.user?.name||"UserName"}</Text>
      <Text style={styles.amount}>{transaction?.amount||"NaN"}</Text>
      <Text style={[styles.status]}>{transaction?.transactionStatus||"NaN"}</Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily:fontFamily.bold

  },
  amount: {
    fontSize: 14,
    color: "#555",
    fontFamily:fontFamily.regular

  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
    fontFamily:fontFamily.regular
  },
});
const statusStyles = {
    Paid: { color: "green" },
    Unpaid: { color: "orange" },
    "partially paid": { color: "red" },
  }

export default TransactionCard;
