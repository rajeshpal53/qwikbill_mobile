// import { Text } from "react-native-paper"
import { useRoute } from "@react-navigation/native";
import { Divider, DataTable, FAB } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { readApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import InvoiceFilterModel from "../../Components/Modal/InvoiceFilterModel";

const headlineMap = {
  lastOneMonth: "last One Month",
  lastThreeMonths: "last Three Months",
  lastSixMonths: "last Six Months",
};

const headlineHandler = (data) => {

  if(data.filteredBy === "recent"){
    return "Recent";
  }

  return data.filteredBy === "dateRange"
    ? headlineMap[data.selectedOption] || "Date Wise"
    : data.numberOfInvoices;
};

export default function ViewInvoiceScreen({navigation}) {
  const data = useRoute().params;
  // console.log("routedata , ", data.data.paidUnpaidAll);
  const { shopDetails } = useContext(ShopDetailContext);
  const shopId = shopDetails._id;
  const [isModalVisible, setModalVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  // let formattedDate = "NA";

  const headline = headlineHandler(data.data);
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await readApi(
          `api/invoice/list?shop=${shopId}&items=12`
        );
        console.log("response length : ", response.result.length);

        console.log("complete response \n  " , response.result[0].client)

        setInvoiceData(response.result);
      } catch (error) {
        console.error("error", error);
      }
    };

    // Call the async function
    fetchData();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, invoiceData.length);

  const formatDateHandler = (date) => {
    const updatedDate = new Date(date);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = updatedDate
      .toLocaleDateString("en-GB", options)
      .replace(/\s/g, "-");

    return formattedDate;
  };

  const InvoiceItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.date}>{formatDateHandler(item.updated)}</Text>
      <Text style={styles.number}>{item.number}</Text>
      <Text style={styles.clientName}>{item.client.name}</Text>
      {/* <Text style={styles.paymentStatus}>{item.paymentStatus}</Text> */}
      <Text
        style={[
          styles.total,
          { color: item.paymentStatus === "unpaid" ? "red" : "green" },
        ]}
      >
        {item.total}
      </Text>
    </View>
  );

  
const toggleModal = () => {
  setModalVisible(!isModalVisible);
};
const genrateInvoice=(item)=>{
  console.log(item,"item")
  navigation.navigate("StackNavigator", {
    screen: "genrateInvoice",
    params: {
     detail:item
    },
  });
}


  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Statement for {headline} Invoices
            </Text>
          </View>
          <DataTable style={{ flex: 1 }}>
            <DataTable.Header style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Phone No.</Text>
              <Text style={styles.tableHeaderText}>Customer Name</Text>
              <Text style={styles.tableHeaderTextLast}>Amount (₹)</Text>
            </DataTable.Header>
            <Divider />
            {invoiceData.slice(from, to).map((item, index) => 
            
            (
              <DataTable.Row key={index} style={styles.row} onPress={()=>{ genrateInvoice(item)}}>
                {/* <DataTable.Cell>{(from + index+1)}</DataTable.Cell> */}
                <Text style={styles.date}>
                  {formatDateHandler(item.updated)}
                </Text>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={styles.clientName}>{item.client.name}</Text>
                <Text
                  numeric
                  style={[
                    styles.total,
                    {
                      color: item.paymentStatus === "unpaid" ? "red" : "green",
                    },
                  ]}
                >
                  {item.total}
                </Text>
              </DataTable.Row>
            ) )}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(invoiceData.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${invoiceData.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </View>
      </ScrollView>
      <FAB
        icon="filter"
        style={styles.fab}
        onPress={toggleModal}
      />
      <InvoiceFilterModel isModalVisible = {isModalVisible} setModalVisible = {setModalVisible} toggleModal={toggleModal}/>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    // flexDirection: "row",
    // alignItems:"center",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
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
  date: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
    // backgroundColor:"lightgreen"
  },
  number: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
  },
  clientName: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
  },
  paymentStatus: {
    flex: 1,
    textAlign: "center",
    color: "red", // or green depending on logic
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
  },
  total: {
    flex: 1,
    textAlign: "center",
    padding: 5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    // backgroundColor: "black",
  },
});