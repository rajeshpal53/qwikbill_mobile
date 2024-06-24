import React, { useEffect } from "react";
import { ActivityIndicator, Text,Card,Divider } from "react-native-paper";

import { StyleSheet } from "react-native";
import { View } from "react-native";
const InvoiceDetail = ({ detail }) => {

  console.log(typeof(detail.items));
  useEffect(()=>{
    detail
  },[detail])

  return (
    <View style={styles.container}>
      <Card style={{backgroundColor:'#fff'}} >
        <Card.Title title={detail.created} />
        <Card.Content style={styles.cardContainer}>
          <Text style={styles.label}>first name:</Text>
          <Text style={styles.value}> Rajesh pal </Text>
        </Card.Content>
        <Card.Content style={styles.cardContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>fs60faizan@gmail.com </Text>
        </Card.Content>
        <Card.Content style={styles.cardContainer}>
          <Text style={styles.label}>phone</Text>
          <Text style={styles.value}>9340950360 </Text>
        </Card.Content>
        <Divider style={{marginVertical: 10 }} />

        <Card.Content style={styles.cardContainer}>
          <View style={{width:'100%',flexDirection:'row'}}>
            <Text style={styles.descriptionText}> type: </Text>
            <Text style={styles.descriptionText}>people</Text>
          </View>
          <View  style={{width:'100%',flexDirection:'row'}}>
            <Text style={styles.descriptionText}>Currency: </Text>
            <Text style={styles.descriptionTextValue}> USD
            </Text>
          </View>
          <View  style={{width:'100%',flexDirection:'row'}}>
            <Text style={styles.descriptionText}> Date: </Text>
            <Text style={styles.descriptionTextValue}>
            {detail.date||''}
            </Text>
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
        <View style={styles.row}>
          
        </View>
        { detail.items?detail.items.map((item, index) => (
          <View key={index}>
            <Text style={styles.cell}>{item.itemName}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.total}</Text>
          </View>
        )) : <ActivityIndicator/>}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    margin:10,
    backgroundColor: "#fff",
  },
 
  label: {
    fontSize: 16,
    marginVertical: 10,
    marginRight: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
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
    color: "grey",
    marginVertical: 5,
  },
  descriptionTextValue: {
    flex: 1,
    flexGrow: 1,
    color: "grey",
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
