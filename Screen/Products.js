// Products.js
import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Button, TouchableWithoutFeedback } from "react-native";
import {
  ActivityIndicator,
  FAB,
  Portal,
  Provider,
  Text,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { readApi, createApi } from "../Util/UtilApi";
import { AuthContext } from "../Store/AuthContext";
import ItemList from "../Components/Lists/ItemList";
import Icon from "react-native-vector-icons/Ionicons";
import { deleteApi } from "../Util/UtilApi";
import { useSnackbar } from "../Store/SnackbarContext";
import DeleteModal from "../UI/DeleteModal";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import FabGroup from "../Components/FabGroup";
import { TouchableOpacity } from "react-native-gesture-handler";
import FileUploadModal from "../Components/BulkUpload/FileUploadModal";
import axios from "axios";


const fetchSearchData = async (searchQuery, shopId) => {
  try {
    const response = readApi(
      `api/product/list?shop=${shopId}&q=${searchQuery}&fields=name`
    );
    const result = await response;

    return result.result;
    
  } catch (error) {
    console.error("error to search data", error);
  }
};


export default function Products({ navigation }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const { searchQuery } = useContext(AuthContext);
  const { shopDetails } = useContext(ShopDetailContext);
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { showSnackbar } = useSnackbar();
  const onStateChange = ({ open }) => setOpen(open);

  console.log("shopDetails p23 , ", shopDetails._id);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi(
          `api/product/list?shop=${shopDetails._id}`
        );
        setProducts(response.result);
      } catch (Error) {
        console.error("Error fetching products", Error);
      } finally {
        setIsLoading(false);
        setRefresh(false);
        setOpen(false)
      }
    }
    fetchData();
  }, [isFocused, refresh]);

  useEffect(() => {
    
    const fetchSearchingData = async() => {
      const newData = await fetchSearchData(searchQuery, shopDetails._id);

      setProducts(newData);
    }
    
    fetchSearchingData();
  }, [searchQuery])

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

  const handleEdit = (item) => {
    navigation.navigate("EditProduct", { productId: item._id });
  };

  const handleView = (id) => {
    navigation.navigate("ProductDetail", { productId: id });
  };

  const setModalVisible = (item) => {
    setDeleteId(item._id);
    setIsModalVisible(true);
  };

  const handleFileUpload = async (file) => {

    const formData = new FormData();
    formData.append('file',{
      uri: file.uri,
      name: file.name,
      type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    formData.append('shop',shopDetails._id);

    try {
      const response = await axios.post('http://192.168.29.81:8888/api/product/upload', formData, {


        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
  
      console.log('Data uploaded successfully:', response.result);
      showSnackbar("Products uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.result : error.message);
      showSnackbar("Error uploading new products", "error");
    } finally {
      setIsUploadModalVisible(false);
      setIsLoading(false);
      setRefresh(true);
      
    }
    
  };

  const renderExpandedContent = (item) => (
    <View>
      <Text style={{color: "#777", fontSize: 12}}>Cost price:{item.costprice}</Text>
      <Text style={{color: "#777", fontSize: 12}}>hsn code:{item.hsncode}</Text>
      </View>
  );

  const fabActions = [
    {
      icon: "plus",
      label: "Add New Product",
      onPress: () => navigation.navigate("AddProduct"),
    },
    {
      icon: "pencil",
      label: "Add New Product",
      onPress: () => navigation.navigate("AddProduct"),
    },
    // Add more actions as needed
  ];

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (item) => handleEdit(item) },
    { title: "Delete", onPress: (item) => setModalVisible(item) },
  ];

  const handleOutsidePress = () => {
    console.log("out pressed")
  }

  return (
    <>
      <SafeAreaProvider>
        <Provider>
          <Portal>
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
              <FAB.Group
                open={open}
                fabStyle={styles.actionStyle}
                icon={() => (
                  <Icon
                    name={open ? "close-outline" : "add-outline"}
                    size={25}
                    color="white"
                  />
                )}
                actions={[
                  {
                    color: "white",
                    style: styles.actionStyle,
                    icon: "account-plus",
                    label: "Add Product",
                    onPress: () => {
                      navigation.navigate("AddProduct");
                    },
                  },
                  {
                    color: "white",
                    style: styles.actionStyle,
                    icon: "file-upload",
                    label: "Add Product from File",
                    onPress: () => {
                      setIsUploadModalVisible(true);
                    },
                  },
                ]}
                onStateChange={onStateChange}
                onPress={() => {
                  open && setOpen(false);
                }}
              />
              {isModalVisible && (
                <DeleteModal
                  visible={isModalVisible}
                  setVisible={setIsModalVisible}
                  handleDelete={handleDelete}
                />
              )}

              {/* File Upload Modal */}
              {isUploadModalVisible && (
                <FileUploadModal
                  isVisible={isUploadModalVisible}
                  onClose={() => setIsUploadModalVisible(false)}
                  onUpload={handleFileUpload}
                />
              )}
            </View>
          </Portal>
        </Provider>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:"#fff"
    justifyContent:"center",
        backgroundColor:"#fff"
    // backgroundColor:"blue"
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    color: "floralwhite ",
    backgroundColor: "#96214e",
    zIndex: 100,
    color: "white",
  },
  actionStyle: {
    backgroundColor: "#0c3b73",
    color: "floralwhite ",
  },
});
