// Products.js
import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Button } from "react-native";
import { ActivityIndicator, FAB , Portal, Provider as PaperProvider, Text } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { readApi } from "../Util/UtilApi";
import { AuthContext } from "../Store/AuthContext";
import ItemList from "../Components/Lists/ItemList";
import Icon from "react-native-vector-icons/Ionicons";
import { deleteApi } from "../Util/UtilApi";
import { useSnackbar } from "../Store/SnackbarContext";
import DeleteModal from "../UI/DeleteModal";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import FabGroup from "../Components/FabGroup";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Products({ navigation }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setSearchMode } = useContext(AuthContext);
  const shopDetails = useContext(ShopDetailContext).shopDetails;
  console.log("shop details are , ", shopDetails);

  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  useEffect(() => {
    async function fetchData() {
      console.log("pre")
      try {
        const response = await readApi(`api/product/list?shop=${shopDetails._id}`);
        setProducts(response.result);
      } catch (Error) {
        console.error("Error fetching products", Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [isFocused]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const handleDelete = async () => {
    const updatedInvoice = products.filter((item) => item._id !== deleteId);
    // setInvoices((prev)=>prev.filter((item) => item.id !== productId));
    setProducts(updatedInvoice);
    // setVisible(false);
    try {
      const response = await deleteApi(`api/product/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("item delete successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the item", "error");
    }
  };

  const handleEdit = (id) => {
    navigation.navigate("EditProduct", { productId: id });
  };

  const handleView = (id) => {
    
    navigation.navigate("ProductDetail", { productId: id });
  };

  const setModalVisible = (id) => {

    setDeleteId(id);
    setIsModalVisible(true);

  }

  const renderExpandedContent = (item) => (
    <View style={{
      marginLeft:"14.5%"
    }}>
      <Text>{`${item.customField[0].fieldName} : ${item.customField[0].fieldValue}`}</Text>
      {/* <Button title="more" onPress ={() => handleView(item._id)} /> */}
        
    </View>
  );

  const fabActions = [
    {
      icon: 'plus',
      label: 'Add New Product',
      onPress: () => navigation.navigate("AddProduct"),
    },
    {
      icon: 'pencil',
      label: 'Add New Product',
      onPress: () => navigation.navigate("AddProduct"),
    },
    // Add more actions as needed
  ];

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (id) => handleEdit(id) },
    { title: "Delete", onPress: (id) => setModalVisible(id) },
  ]

  return (
    <>
    <View style={styles.container}>
      <ItemList
        data={products}
        titleKey="name"
        subtitleKey="price"
        onDelete={setModalVisible}
        onEdit={handleEdit}
        onView={handleView}
        expandedItems={renderExpandedContent}
        menuItems={menuItems}
      />
      <PaperProvider>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={"plus" || (open ? 'calendar-today' : 'plus')}
          actions={fabActions}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // Optional: Handle additional actions when FAB is open
            }
          }}
        />
      </Portal>
    </PaperProvider>
      {/* <FAB
        icon={() => <Icon name="add-outline" size={20} color="white" />}
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
        label="Add New Product"
      /> */}
      
      {/* <View style={styles.fab}>
    <FabGroup actions={fabActions} icon="plus"/>
    </View> */}
      {isModalVisible && (
        <DeleteModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          handleDelete={handleDelete}
        />
      )}
    </View>
    
    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    // width:50,
    // height:50,    
    position: "absolute",
    // margin: 16,
    right: 4,
    bottom: "15%",
    // backgroundColor: "#96214e",
    color: "white"
    // backgroundColor:"blue"
  },
});
