// Customer.js
import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, FAB, Portal, Provider, Text } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { readApi } from "../Util/UtilApi";
import { AuthContext } from "../Store/AuthContext";
import ItemList from "../Components/Lists/ItemList";
import Icon from "react-native-vector-icons/Ionicons";
import { useSnackbar } from "../Store/SnackbarContext";
import DeleteModal from "../UI/DeleteModal";
import { deleteApi } from "../Util/UtilApi";
import { ShopDetailContext } from "../Store/ShopDetailContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FileUploadModal from "../Components/BulkUpload/FileUploadModal";
import axios from "axios";


import FabGroup from "../Components/FabGroup";
export default function Customer({ navigation }) {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const { setSearchMode } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const { showSnackbar } = useSnackbar();
  const {shopDetails}= useContext(ShopDetailContext)
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const onStateChange = ({ open }) => setOpen(open);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi(`api/people/list?shop=${shopDetails._id}`);
        setCustomers(response.result);
      } catch (error) {
        console.error("error", error);
      } finally {
        setIsLoading(false);
        setRefresh(false);
      }
    }
    fetchData();
  }, [isFocused, refresh]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const handleDelete = async () => {

    const updatedCustomers = customers.filter((item) => item._id !== deleteId);
    
    try {
      const response = await deleteApi(`api/people/delete/${deleteId}`);
      setIsModalVisible(false);
      showSnackbar("People delete successfully", "success");
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to delete the people", "error");
    }
  };

  const handleEdit = (item) => {
    navigation.navigate("EditCustomer", { customerId: item._id });
  };

  const handleView = (id) => {
    navigation.navigate("CustomerDetail", { customerId: id });
  };

  const setModalVisible = (item) => {

    setDeleteId(item._id);
    setIsModalVisible(true);

  }

  const handleFileUpload = async (file) => {

    const formData = new FormData();
    formData.append('file',{
      uri: file.uri,
      name: file.name,
      type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    formData.append('shop',shopDetails._id);

    try {
      const response = await axios.post('http://192.168.1.6:8888/api/people/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
  
      console.log('Data uploaded successfully:', response.result);
      showSnackbar("Peoples uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.result : error.message);
      showSnackbar("Error uploading new Peoples", "error");
    } finally {
      setIsUploadModalVisible(false);
      setIsLoading(false);
      setRefresh(true);
    }
    
  };

  const renderExpandedContent = (item) => (
    <View style={{
      marginLeft:"14.5%"
    }}>
      <Text>{item.email}</Text>
      <Text>{(item.isClient)?"Client" : "not a Client"}</Text>
        
    </View>
  );

  const fabActions = [
    {
      icon: 'plus',
      label: 'Add New People',
      onPress: () => navigation.navigate("AddCustomer"),
    },
    // Add more actions as needed
  ];

  const menuItems = [
    // { title: "View", onPress: (id) => handleView(id) },
    { title: "Edit", onPress: (item) => handleEdit(item) },
    { title: "Delete", onPress: (item) => setModalVisible(item) },
  ]

  return (
    <SafeAreaProvider>
      <Provider>
        <Portal>
    <View style={styles.container}>
      <ItemList
        data={customers}
        titleKey="name"
        subtitleKey="phone"
        onDelete={setModalVisible}
        onEdit={handleEdit}
        onView={handleView}
        expandedItems={renderExpandedContent}
        menuItems={menuItems}
      />
      {/* <FAB
        icon={() => <Icon name="person-add" size={20} color="white" />}
        style={styles.fab}
        onPress={() => navigation.navigate("AddCustomer")}
        label="Add New Customer"
      /> */}
       <FAB.Group
              open={open}
              fabStyle={styles.actionStyle}
              icon={() => (
                <Icon
                  name={open ? "close-outline" : "add-outline"}
                  size={20}
                  color="white"
                />
              )}
              actions={[
                {
                  color: "white",
                  style: styles.actionStyle,
                  icon: "account-plus",
                  label: "Add Customer",
                  onPress: () => {
                    navigation.navigate("AddCustomer");
                  },
                },
                {
                  color: "white",
                  style: styles.actionStyle,
                  icon: "file-upload",
                  label: "Add Customer from File",
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 13,
    right: 0,
    bottom: 0,
    backgroundColor: "#96214e",
    color: "white",
  },
  actionStyle: {
    backgroundColor: "#96214e",
    color: "floralwhite ",
  },
});
