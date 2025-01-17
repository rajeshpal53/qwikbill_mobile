// import { Text } from "react-native-paper"
import { useRoute } from "@react-navigation/native";
import { Divider, DataTable, FAB, Menu, ActivityIndicator } from "react-native-paper";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { readApi, deleteApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import InvoiceFilterModel from "../../Components/Modal/InvoiceFilterModel";
import { Feather } from "@expo/vector-icons";
import DeleteModal from "../../UI/DeleteModal";
import { useSnackbar } from "../../Store/SnackbarContext";
import { useWindowDimensions, BackHandler } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation"
import { useFocusEffect } from "@react-navigation/native";

const headlineMap = {
  lastOneMonth: "Last One Month",
  lastThreeMonths: "Last Three Months",
  lastSixMonths: "Last Six Months",
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
  const url = data.data.url;
  const { shopDetails } = useContext(ShopDetailContext);
  const shopId = shopDetails._id;
  const [deleteItemId, setDeleteItemId] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 15, 20]);
  const { showSnackbar } = useSnackbar();
  const [refresh, setRefresh] = useState(false);
  const {width, height} = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isLandScape, setIsLandscape] = useState(width > height);
  const [isLoading, setIsLoading] = useState(false);

  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const headline = headlineHandler(data.data);

  useEffect(() => {
    setIsLandscape(width > height);
  }, [width])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let itemsLength = ""

        console.log(data.data.numberOfInvoices , "--- filtered by   33333");
        if(data.data.filteredBy === 'number' && data.data.numberOfInvoices > 0){
          
          itemsLength = `&items=${data.data.numberOfInvoices}`;
          console.log(data.data.numberOfInvoices , "--- filtered by   44444");
        }
 
        setIsLoading(true);
        const response = await readApi(
          `${url}shop=${shopId}${itemsLength}`
        );
        // console.log("response length : ", response.result.length);

        // console.log("complete response \n  " , response.result)

        setInvoiceData(response.result);
      } catch (error) {
        console.error("error", error);
      }finally{
        setIsLoading(false);
      }
    };

    // Call the async function
    fetchData();
  }, [refresh]);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

 // Custom back button handler
 const onBackPress = async() => {
  // Perform any action when the back button is pressed
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait

    navigation.goBack()
    return true; // Returning true prevents the default behavior (going back)
};

   // Use useFocusEffect to handle back button when the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Add the event listener when the screen is focused
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Clean up the event listener when the screen is unfocused
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  if(isLoading){
    return (
      <ActivityIndicator size="Medium" /> 
    );
  }

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

  // const InvoiceItem = ({ item }) => (
  //   <View style={styles.row}>
  //     <Text style={styles.date}>{formatDateHandler(item.updated)}</Text>
  //     <Text style={styles.number}>{item.people.phone}</Text>
  //     <Text style={styles.clientName}>{item.people?.name}</Text>
  //     {/* <Text style={styles.paymentStatus}>{item.paymentStatus}</Text> */}
  //     <Text
  //       style={[
  //         styles.total,
  //         { color: item.paymentStatus === "unpaid" ? "red" : "green" },
  //       ]}
  //     >
  //       {item.total}
  //     </Text>
  //   </View>
  // );

  
  const toggleModal = (sortBy) => {
    // Check if invoiceData is empty
    if (invoiceData.length === 0) {
      setModalVisible(!isModalVisible);
      return;
    }
  
    let filterData = [];
    let noFound = <Text>NO Data found</Text>;
  
    if (sortBy === "paid") {
      filterData = invoiceData.filter(item => item.paymentStatus === "paid");
    } else if (sortBy === "unpaid") {
      filterData = invoiceData.filter(item => item.paymentStatus === "unpaid");
    } else if (sortBy === "old to new") {
      filterData = [...invoiceData].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      filterData = [...invoiceData].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  
    // Only update if filterData is not empty
    if (filterData.length > 0) {
      setInvoiceData(filterData);
    }
  
    setModalVisible(!isModalVisible);
  };
  
const openModel=()=>{
  setModalVisible(true);
}
const genrateInvoice=(item)=>{
  // console.log(item,"item")
  navigation.navigate("StackNavigator", {
    screen: "genrateInvoice",
    params: {
     detail:item
    },
  });
}

const showMenu = (item) => {
  setCurrentItem(item);
  setVisible(true);
};

const hideMenu = () => {
  setVisible(false);
  setCurrentItem(null);
};

const onEdit = async(item) => {
  if(isLandScape){
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait
  }
  navigation.navigate("AddInvoice", {item:item})
  // console.log("Edit id is ", id);
}

const handleDelete = async() => {
  try {
    setIsLoading(true);
    const response = await deleteApi(`api/invoice/delete/${deleteItemId}`);
    setDeleteModalVisible(false);
    showSnackbar("item delete successfully", "success");
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error("Error:", error);
    showSnackbar("Failed to delete the item", "error");
  }finally{
    setIsLoading(false);
  }
  
}

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
               {headline} Invoices
            </Text>
          </View>
          {(invoiceData.length > 0) && (<DataTable style={{ flex: 1 }}>
            <DataTable.Header style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Phone No.</Text>
              <Text style={styles.tableHeaderText}>Name</Text>
              <Text style={[styles.tableHeaderText,]}>Amount (₹)</Text>
              <Text style={styles.tableHeaderTextLast}>options</Text>
            </DataTable.Header>
            <Divider />
            {invoiceData.slice(from, to).map((item, index) => 
            
            (
              <DataTable.Row key={index} style={styles.row} onPress={()=>{ genrateInvoice(item)}}>
                {/* <DataTable.Cell>{(from + index+1)}</DataTable.Cell> */}
                <Text style={styles.date}>
                  {formatDateHandler(item.date)}
                </Text>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={styles.clientName}>{item.people?.name}</Text>
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

                {/* menu items */}

                  <View style={{flex:0.5, justifyContent:"center", padding:5}}>

                  
                <Menu
                  visible={visible && currentItem?._id === item._id}
                  onDismiss={hideMenu}
                  
                  anchor={
                    <TouchableOpacity
                      onPress={() => showMenu(item)}
                      style={{alignItems:"center"}}
                    >
                      <Feather name="more-vertical" size={24} color="#777777" />
                    </TouchableOpacity>
                  }
                >
                  {/* {menuItems.map((menuItem, index) => (
                    <Menu.Item
                      key={index}
                      onPress={() => {
                        hideMenu();
                        menuItem.onPress(item);
                      }}
                      title={menuItem.title}
                    />
                  ))} */}
                  {/* <Menu.Item 
            onPress={() => {
                hideMenu()
                onView(item._id)
            }} 
            title="View" /> */}

            <Menu.Item onPress={() => {
                hideMenu()
                onEdit(item)
            }} 
            title="Edit" />

            <Menu.Item onPress={() => {
                hideMenu()
                // console.log("id , ", item._id)
                setDeleteItemId(item._id);
                setDeleteModalVisible(true);
                
                
            }} 
            title="Delete" />
                </Menu>
                </View>
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
          </DataTable>)}
          
        </View>
      </ScrollView>
      {(invoiceData.length > 0) && ( <FAB
        icon="filter"
        style={styles.fab}
        onPress={()=>{openModel()}}
      />)}

      {(invoiceData.length <= 0) && (
        <View style={{alignItems:"center", height:"100%"}}>
      <Image
        source={require("../../../assets/noDataFound.png")}
        style={{width:"50%", height:100}}
      ></Image>
      <Text variant="titleLarge" style={{ color: "#555" }}>
        No data found
      </Text>
    </View>)}
     
      {deleteModalVisible && (
                <DeleteModal
                  visible={deleteModalVisible}
                  setVisible={setDeleteModalVisible}
                  handleDelete={handleDelete}
                />
              )}
      <InvoiceFilterModel style={{backgroundColor:"lightblue"}} isModalVisible = {isModalVisible} setModalVisible = {setModalVisible} toggleModal={toggleModal}/>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height:"100%",
    backgroundColor: "#fff",
    // backgroundColor:"orange"
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
    flex: 0.5,
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
    flex: 0.9,
    textAlign: "center",
    color: "red", // or green depending on logic
    borderRightWidth: 1,
    borderRightColor: "gray",
    padding: 5,
  },
  total: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "gray",
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