import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FAB, Searchbar } from "react-native-paper";
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
  const isfocused = useIsFocused()

  // useEffect(() => {
  //   dispatch(setProductitem(ProductItems));
  // }, []);

  console.log("DATA IS REDUX PRODUCT",products)

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

  console.log("Productdata ------------", Productdata);

  const filteredData = products.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("DATA IS FILTER ",filteredData)

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
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>
              No products found.
            </Text>
          </View>
        )}
      />

      <FAB
        icon={() => <Icon name="add" size={25} color="#fff" />}
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
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
});

export default ProductDetailsScreen;
