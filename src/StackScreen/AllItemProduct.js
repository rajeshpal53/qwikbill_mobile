import { FlatList, StyleSheet, Text, View } from "react-native";
import Searchbarwithmic from "../../src/Component/Searchbarwithmic";
import ProductCardDetails from "../Component/Cards/ProductCard";
import { useState } from "react";
import ViewCartOverlay from "../Overlays/ViewCartOverlays";

const AllItemProduct = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false); // State for modal visibility
  const [transcript, setTranscript] = useState(""); // State for transcript
  const [showOverlay, setshowOverlay] = useState(true);

  const ProduchItem = [
    {
      id: 1,
      Name: "Camera",
      "Selling Price": 67,
      info: "awosome Product",
    },
    {
      id: 2,
      Name: "Iphone",
      "Selling Price": 67,
      info: "awosome Product",
    },
    {
      id: 3,
      Name: "Laptop",
      "Selling Price": 67,
      info: "awosome Product",
    },
    {
      id: 4,
      Name: "Watch",
      "Selling Price": 67,
      info: "awosome Product",
    },
    {
      id: 5,
      Name: "Nokia",
      "Selling Price": 67,
      info: "awosome Product",
    },
    {
      id: 6,
      Name: "Nokia",
      "Selling Price": 67,
      info: "awosome Product",
    },
    {
      id: 7,
      Name: "Nokia",
      "Selling Price": 67,
      info: "awosome Product",
    },
  ];

  const filteredData = ProduchItem.filter((item) =>
    item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View>
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
          <ProductCardDetails
            item={item}
            index={index}
            setshowOverlay={setshowOverlay}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />

      {showOverlay && <ViewCartOverlay navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 150, // Add padding to the bottom of the FlatList content
  },
});

export default AllItemProduct;
