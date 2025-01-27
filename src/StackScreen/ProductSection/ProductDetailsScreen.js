import { Text, View, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { FAB, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import CustomerDetailsCard from "../../Component/Cards/CustomerDetailsCard";
import Searchbarwithmic from "../../Component/Searchbarwithmic";
import EditCustomerDetailsModal from "../../Modal/EditCustomerDetailsModal";
import ProductDetailsCard from "../../Component/Cards/ProductDetailsCard";
import { setProduct } from "../../Redux/CartProductRedux/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { ProductItems } from "../../../ProductItems";

const ProductDetailsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [SelectedEditItem, setSelectedEditItem] = useState(null);
  const [editmodal, seteditmodal] = useState(false);
  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setProduct(ProductItems));
  }, []);

console.log("Value is123 ",products )

  const filteredData = products.filter((item) =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
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
      />

      {/* <FAB
        icon={() => <Icon name="add" size={25} color="#fff" />}
        style={styles.fab}
        onPress={() => console.log("FAB pressed")}
      /> */}

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
    backgroundColor: "#1bd18f",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductDetailsScreen;
