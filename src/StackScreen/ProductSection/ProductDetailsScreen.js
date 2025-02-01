import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FAB, Searchbar, Portal, PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import CustomerDetailsCard from "../../Component/Cards/CustomerDetailsCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";
import ProductDetailsCard from "../../Component/Cards/ProductDetailsCard";
import { setProductitem } from "../../Redux/CartProductRedux/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
// import { ProductItems } from "../../../ProductItems";
import { readApi } from "../../Util/UtilApi";
import { useIsFocused } from "@react-navigation/native";

const ProductDetailsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [SelectedEditItem, setSelectedEditItem] = useState(null);
  const [editmodal, seteditmodal] = useState(false);
  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch();
  const [Productdata, SetProductData] = useState([]);
  const isfocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const onStateChange = (state) => setOpen(state.open);


  useEffect(() => {
    const getproductdata = async () => {
      try {
        const api = `qapi/products/`;
        const response = await readApi(api);
        dispatch(setProductitem(response));
        SetProductData(response);
      } catch (error) {
        console.log("Unable to fetch Data", error);
      }
    };
    getproductdata();
  }, [isfocused]);

  const filteredData = products.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (item) => {
    setSelectedEditItem(item); // Set selected offer
  };

  useEffect(() => {
    if (SelectedEditItem) {
      seteditmodal(true);
    }
  }, [SelectedEditItem]);

  return (
    <View style={{ flex: 1 }}>
      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setsearchmodal}
        setTranscript={setTranscript}
        placeholderText="Search User by name ..."
        //    refuser={searchBarRef}
      />

      <FlatList
        data={filteredData}
        renderItem={({ item, index }) => (
          <ProductDetailsCard
            item={item}
            index={index}
            navigation={navigation}
            onEdit={() => openEditModal(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>
              No products found.
            </Text>
          </View>
        )}
      />
      {/* <FAB
        icon={() => <Icon name="add" size={25} color="#fff" />}
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
      /> */}
          <FAB.Group
            open={open}
            visible
            icon={open ? "close" : "plus"}
            actions={[
              {
                icon: "plus",
                label: "Add Product",
                onPress: () => navigation.navigate("AddProduct"),
                style: { backgroundColor: '#2196F3' },
              },
              {
                icon: "archive",
                label: "Bulk Product",
                onPress: () => console.log("Pressed notifications"),
                style: { backgroundColor: '#2196F3' },
              },
            ]}
            onStateChange={onStateChange}
            style={{
              // position: 'absolute',
              // right: 10,
              // bottom: 20,
              // elevation: 5, // To give the button a floating effect on Android
            }}
            fabStyle={{
              backgroundColor: '#0c3b73', // This style applies to the main FAB button itself (the one with the "plus" icon)
            }}
          />


      {editmodal && (
        <EditCustomerDetailsModal
          visible={editmodal}
          seteditmodal={seteditmodal}
          SelectedEditItem={SelectedEditItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#0c3b73",
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    paddingBottom: 70, // Add padding to the bottom of the FlatList content
  },
});

export default ProductDetailsScreen;
