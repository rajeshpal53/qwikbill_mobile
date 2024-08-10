import React, { useState, useEffect, useContext } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  FAB,
  Portal,
  Provider,
} from "react-native-paper";
import CustomerCard from "../Components/CustomerCard";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { createApi, readApi } from "../Util/UtilApi";
import * as DocumentPicker from "expo-document-picker";
import { useSnackbar } from "../Store/SnackbarContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { Searchbar } from "react-native-paper";
const fetchSearchData = async (searchQuery) => {
  try {
    const response = readApi(
      api/people/list?q=${searchQuery}&fields=name,email
    );
    const result = await response;

    return result.result;
  } catch (error) {
    console.error("error to search data", error);
  }
};

export default function Customer({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const [customer, setCustomer] = useState([]);
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  
  const onChangeSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const newData = await fetchSearchData(query);
      setData(newData);
    }
  };
  // useEffect(() => {

  // }, [isFocused]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await readApi("api/people/list");
        const result = await response;
        setCustomer(result.result);
      } catch (error) {
        console.error("error", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [isFocused]);
  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      console.log(result, "result customer");
      if (!result.canceled) {
        console.log("File picked:", result);
        handleUpload(result.assets[0].uri, result.assets[0].name, result.assets[0].mimeType);
      } else {
        showSnackbar(
          "Error selecting file. Please choose a valid Excel file.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error picking document:", error);
      showSnackbar("Error picking document. Please try again.", "error");
    }
  };

  const handleUpload = async (uri, name,mimeType) => {
    const formData = new FormData();
    const file={
      uri,
      name,
      type:mimeType
    }
    console.log(file,"fileeeee")
    formData.append("file",file );
      const response = await axios.post(
        "http://192.168.1.4:8888/api/product/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response.json(),"response");
      if (response.status === 200) {
        const data = response.data;
        console.log("Upload successful:", data);
        showSnackbar("Successfully uploaded customer file", "success");
        navigation.navigate("Customer");
      } else {
        console.error("Upload failed with status:", response.status);
        showSnackbar("Failed to upload product. Please try again.", "error");
      }
    //  catch (error) {
    //   console.error("Error uploading file:", error);
    //   showSnackbar(
    //     "Failed to upload product. Please check your network and try again.",
    //     "error"
    //   );
    // }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const onStateChange = ({ open }) => setOpen(open);
  return (
    <SafeAreaProvider>
      <Provider>
        <View style={styles.container}>
          <Portal>
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
                  onPress: handleDocumentPick,
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                open && setOpen(false);
              }}
            />
          </Portal>
          {/* <FAB  icon={() => <Icon name="person-add" size={20} color="white" />}
      theme={{ colors: { primary: '#fff' } }}
      color="white"
       onPress={() => {
        navigation.navigate("AddCustomer");
      }} style={styles.fab}
      label="Add New Customer"
      labelStyle={{color:"#ffffff"}}
      /> */}
          <ScrollView contentContainerStyle={{ paddingBottom: "20%" }}>
            <Searchbar
              style={styles.search}
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
            {customer ? (
              <CustomerCard
                customer={searchQuery.length > 1 ? data : customer}
                navigation={navigation}
                setCustomer={setCustomer}
              />
            ) : (
              <Text> no Customer found</Text>
            )}
          </ScrollView>
        </View>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  addButton: {
    color: "floralwhite ",
    backgroundColor: "#96214e",
    marginVertical: 20,
  },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
  },
  search: {
    marginTop: 15,
    backgroundColor: "white",
    marginHorizontal: 4,
    overflow: "hidden",
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
    backgroundColor: "#96214e",
    color: "floralwhite ",
  },
});