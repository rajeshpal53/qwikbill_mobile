// import React, { useState } from 'react'
// import { View } from 'react-native'
// import { Button, Text } from 'react-native-paper'
// import TaxModel from './TaxModel'
// function TaxScreen() {
//     const[isModalVisible,setIsModalVisible]=useState(false)
//    const handleOpen=()=> setIsModalVisible(true)
//     const handleClose = () => setIsModalVisible(false);
//   return (
//     <View>
//         <Button onPress={handleOpen}>Add hsncode</Button>
//         <TaxModel visible={isModalVisible} close={handleClose}/>

//     </View>
//   )
// }

// export default TaxScreen
import React, { useState, useEffect, useContext } from "react";
import { Text, ActivityIndicator, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../../Store/AuthContext";
import ItemList from "../../Components/Lists/ItemList";
import { readApi, deleteApi } from "../../Util/UtilApi";
import { ShopDetailContext } from "../../Store/ShopDetailContext";
import { useSnackbar } from "../../Store/SnackbarContext";
import DeleteModal from "../../UI/DeleteModal";
import TaxModel from "./TaxModel";



const fetchSearchData = async (searchQuery) => {
  try {
    const response = readApi(
      `api/taxes/list?&q=${searchQuery}&fields=taxName`
    );
    const result = await response;

    return result.result;
    
  } catch (error) {
    console.error("error to search data", error);
  }
};


export default function TaxScreen() {
  const navigation = useNavigation();
  const [taxes, setTaxes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();
  const { searchQuery } = useContext(AuthContext);
  const { shopDetails } = useContext(ShopDetailContext);
  const [openTax,setOpenTax]=useState(false)


  const handleOpen=()=> setOpenTax(true) 
  const handleClose = () => setOpenTax(false);


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
          const response = await readApi(
            `api/taxes/list/`
          );
          setTaxes(response.result);
          console.log(response.result, "   res")

      } catch (error) {
        console.error("error", error);
      } finally {
        setIsLoading(false);
      }

    }
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    
    const fetchSearchingData = async() => {
      const newData = await fetchSearchData(searchQuery);

      setTaxes(newData);
    }
    
    fetchSearchingData();
  }, [searchQuery])

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  console.log(taxes, "taxes");
  const handleDelete = async () => {
    const updatedtaxes = taxes.filter((item) => item._id !== deleteId);

    try {
      const response = await deleteApi(`api/taxes/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("Tax delete successfully", "success");
      setTaxes(updatedtaxes);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the Tax", "error");
    }
  };

  const handleEdit = (item) => {
    // console.log("item under edit ", item)
    handleOpen()
  };

  const handleView = (id) => {

    console.log("Tax Viewed ," , id);
    // navigation.navigate("CustomerDetail", { customerId: id });
  };

  const setModalVisible = (item) => {

    setDeleteId(item._id);
    setIsModalVisible(true);

  }

  const renderExpandedContent = (item) => (
    <View style={{marginLeft:"14%"}}>
      <Text> Default :{item.isDefault?"Yes":"No"}</Text>    
    </View>
  );

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (item) => handleEdit(item) },
    { title: "Delete", onPress: (item) => setModalVisible(item) },
  ]
  
  return (
    <>
    <View style={styles.container}>
        <TaxModel visible={openTax} close={handleClose}/>
      <ItemList
       data={taxes}
       titleKey='taxName'
       subtitleKey="taxValue"
       onDelete={setIsModalVisible}
       onEdit={handleEdit}
       onView={handleView}
       expandedItems={renderExpandedContent}
       menuItems={menuItems}
       />
      
    </View>
    <FAB 
    icon={() => <Icon name="add-outline" size={25}      color="black" />}
    theme={{ colors: { primary: '#fff' } }}
    style={styles.fab}
    onPress={() => handleOpen()}
   />
   {isModalVisible && (
        <DeleteModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          handleDelete={handleDelete}
        />
      )}

   </>
  );
}


const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        margin: 13,
        right: 0,
        bottom:0,
        // padding:0,
        color: "black",
        // backgroundColor: "#96214e",
        zIndex:100,
        color:"white"
      },
});
