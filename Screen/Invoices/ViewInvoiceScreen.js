// import { Text } from "react-native-paper"
import { useRoute } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { readApi } from "../../Util/UtilApi";

export default function ViewInvoiceScreen() {
  const data = useRoute().params;
  // const [invoiceData, setInvoiceData] = useState({});
  const shopId = data.data.selectedShopId;
  const [invoiceData, setInvoiceData] = useState([]);
  let headline;
  let formattedDate = "NA";

  if(data.data.filteredBy === "dateRange"){
    headline = data.data.selectedOption;
  }
  else{
    headline = data.data.numberOfInvoices;
  }
  // console.log("gettin data is , ", data.data);
  // const startDate = '2024-07-26'; // Start date for filtering (format: YYYY-MM-DD)
  // const endDate = '2024-07-26'; // End date for filtering (format: YYYY-MM-DD)

  useEffect(() => {

    const fetchData = async () => {
        try {
          const response = await readApi(`api/invoice/list?shop=${shopId}`);

          // console.log("response, ", response.result.length);

          // Format the updated date for each item and prepare data for rendering
          const formattedData = response.result.map(item => {
          const updatedDate = new Date(item.updated);
          const options = { day: '2-digit', month: 'short', year: 'numeric' };
          const formattedDate = updatedDate.toLocaleDateString('en-GB', options).replace(/\s/g, '-');
          
          return { 
            clientName: item.client.name,
            number: item.number,
            paymentStatus: item.paymentStatus,
            total: item.total,
            formattedDate
          };
        });

        setInvoiceData(formattedData);
        // console.log("formatted InvoiceData , ", invoiceData)

        } catch (error) {
          console.error("error", error);
        }
      };
    
      // Call the async function
      fetchData();

  }, [])

  // console.log("invoice data, ", invoiceData);
  const InvoiceItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.date}>{item.formattedDate}</Text>
      <Text style={styles.number}>{item.number}</Text>
      <Text style={styles.clientName}>{item.clientName}</Text>
      <Text style={styles.paymentStatus}>{item.paymentStatus}</Text>
      <Text style={styles.total}>{item.total}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Statement for last {headline} Invoices
        </Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Date</Text>
        <Text style={styles.tableHeaderText}>Phone No.</Text>
        <Text style={styles.tableHeaderText}>Customer Name</Text>
        <Text style={styles.tableHeaderText}>Paid / Unpaid (₹)</Text>
        <Text style={styles.tableHeaderTextLast}>Amount (₹)</Text>
      </View>
      <Divider/>
      <FlatList
        data={invoiceData}
        renderItem={InvoiceItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollView:{
        
    },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    borderRightColor:"gray",
    borderRightWidth:1,
    padding:5
  },
  tableHeaderTextLast:{
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    padding:5
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  date: {
    flex: 1,
    textAlign: "center",
    borderRightWidth:1,
    borderRightColor:"gray",
    padding:5,
  },
  number: {
    flex: 1,
    textAlign: "center",
    borderRightWidth:1,
    borderRightColor:"gray",
    padding:5
  },
  clientName: {
    flex: 1,
    textAlign: "center",
    borderRightWidth:1,
    borderRightColor:"gray",
    padding:5
  },
  paymentStatus:{
    flex:1,
    textAlign:"center",
    color:"red", // or green depending on logic
    borderRightWidth:1,
    borderRightColor:"gray",
    padding:5
  },
  total: {
    flex: 1,
    textAlign: "center",
    padding:5
  },
});
