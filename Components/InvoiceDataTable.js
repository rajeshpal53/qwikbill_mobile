import * as React from 'react';
import { DataTable, Text, Divider } from 'react-native-paper';
import { useState, useEffect} from 'react';
import {StyleSheet} from "react-native";


const InvoiceDataTable = ({formData}) => {
    console.log("fdfs", formData.items)
  // const [page, setPage] = useState(0);
  // const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  // const [itemsPerPage, onItemsPerPageChange] = useState(
  //   numberOfItemsPerPageList[0]
  // );

 
  // const [items] = useState([
  //  {
  //    key: 1,
  //    name: 'Cupcake',
  //    calories: 356,
  //    fat: 16,
  //  },
  //  {
  //    key: 2,
  //    name: 'Eclair',
  //    calories: 262,
  //    fat: 16,
  //  },
  //  {
  //    key: 3,
  //    name: 'Frozen yogurt',
  //    calories: 159,
  //    fat: 6,
  //  },
  //  {
  //    key: 4,
  //    name: 'Gingerbread',
  //    calories: 305,
  //    fat: 3.7,
  //  },
  // ]);

  // const from = page * itemsPerPage;
  // const to = Math.min((page + 1) * itemsPerPage, formData.items.length);

  
  // useEffect(() => {
  //   console.log("pra")
  //   setPage(0);
  // }, [itemsPerPage]);

  return (
    <DataTable style={{flex:1}}>
      <DataTable.Header style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>
      Sr. No. </Text>
        <Text numeric style={styles.tableHeaderText}>
         Product Name </Text>
        <Text numeric style={styles.tableHeaderText}>
          Quantity</Text>
        <Text numeric style={styles.tableHeaderText}>
        GST Rate</Text>
        <Text numeric style={styles.tableHeaderTextLast}>
         Amt </Text>
      </DataTable.Header>
      <Divider />
      {formData.items.map((item, index) => (
        <DataTable.Row key={index} style={styles.row}>
          <Text style={styles.srNo}>{(index+1)}</Text>
          <Text style={styles.item}>{(item.itemName)}</Text>
          <Text numeric style={styles.quantity}>{item.quantity}</Text>
          <Text numeric style={styles.gst}>{}</Text>
          <Text numeric style={styles.total}>{(item.total)}</Text>
        </DataTable.Row>
      ))}

      
    </DataTable>
  );
};

export default InvoiceDataTable;

const styles = StyleSheet.create({

  tableHeader: {
    flexDirection: "row",
    // justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 0,
  },
  tableHeaderText: {
    flex: 1,
    textAlign: "center",
    borderRightColor: "gray",
    borderRightWidth: 1,
    padding: 5,
    fontWeight: "bold",
  },
  tableHeaderTextLast: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // backgroundColor:"orange",
    paddingHorizontal: 0,
  },
  srNo: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
    // backgroundColor:"lightgreen"
  },
  item: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
  },
  gst: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
  },
  quantity: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
  },
  total: {
    flex: 1,
    textAlign: "center",
    padding: 5,
  },
});