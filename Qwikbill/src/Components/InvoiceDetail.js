import React, { useEffect } from "react";
import { ActivityIndicator, Text, Card, Divider } from "react-native-paper";

import { FlatList, StyleSheet } from "react-native";
import { View } from "react-native";
const InvoiceDetail = (props) => {
  const { detail } = props;
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.itemName}</Text>
      <Text style={styles.cell}>{item.price}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={styles.cell}>{item.total}</Text>
    </View>)
  useEffect(() => {
    detail;
  }, [detail]);
  return (
    <View style={styles.container}>
      <Card style={{ backgroundColor: "#fff",backgroundColor: "#0c3b73",
    color:'#fff' }}>
        <Card.Title title={detail.created} titleStyle={styles.descriptionText} />
        <Card.Content style={styles.cardContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}> {`${detail.people.firstname} ${detail.people.lastname}`} </Text>
        </Card.Content>
        <Card.Content style={styles.cardContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{detail.people.email}</Text>
        </Card.Content>
        <Card.Content style={styles.cardContainer}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{detail.people.phone} </Text>
        </Card.Content>
        <Divider style={{ marginVertical: 10 }} />

        <Card.Content style={styles.blueCardContainer}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <Text style={styles.descriptionText}> Type: </Text>
            <Text style={styles.descriptionText}>people</Text>
          </View>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <Text style={styles.descriptionText}>Currency: </Text>
            <Text style={styles.descriptionTextValue}> {detail.currency}</Text>
          </View>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <Text style={styles.descriptionText}> Date: </Text>
            <Text style={styles.descriptionTextValue}>{detail.date || ""}</Text>
          </View>
        </Card.Content>
      </Card>
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Item Name</Text>
          <Text style={styles.headerCell}>price</Text>
          <Text style={styles.headerCell}>Quantity</Text>
          <Text style={styles.headerCell}>Total</Text>
        </View>
      </View>
      <View>
      </View>
      <FlatList
        data={detail.items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    margin: 10,
    backgroundColor: "#fff",
  },

  label: {
    fontSize: 16,
    marginVertical: 10,
    marginRight: 5,
    color:"#fff"
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color:"#fff"
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionText: {
    color: "#fff",
    marginVertical: 5,
  },
  descriptionTextValue: {
    flex: 1,
    flexGrow: 1,
    color: "#fff",
    marginVertical: 5,
  },
  tableContainer: {
    width: "100%",
    marginVertical: 20,
    marginHorizontal: 2,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingVertical: 10,

    backgroundColor: "#f4f4f4",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InvoiceDetail;
