import { FlatList, StyleSheet, Text, View } from "react-native";
import Searchbarwithmic from "../../src/Component/Searchbarwithmic";
import ProductCardDetails from "../Component/Cards/ProductCard";
import { useEffect, useMemo, useState } from "react";
import ViewCartOverlay from "../Overlays/ViewCartOverlays";
import { ProduchItem } from "../../ProductData";
import { setProduct } from "../Redux/CartProductRedux/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import OpenmiqModal from "../Modal/Openmicmodal";

const AllItemProduct = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showOverlay, setshowOverlay] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const carts = useSelector((state) => state.cart.Carts);

  useEffect(() => {
    if (carts.length > 0) {
      setshowOverlay(true);
    } else {
      setshowOverlay(false);
    }
  }, [carts]);

  useEffect(() => {
    dispatch(setProduct(ProduchItem));
  }, []);

  const filteredData = useMemo(() => {
    return (products || []).filter((item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products.products, searchQuery]);

  return (
    <View>
      <Searchbarwithmic
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setsearchmodal={setsearchmodal}
        setTranscript={setTranscript}
        placeholderText="Search User by name ..."
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
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>
              No products found.
            </Text>
          </View>
        )}
      />
      {searchmodal && (
        <OpenmiqModal
          modalVisible={searchmodal}
          setModalVisible={setsearchmodal}
          transcript={transcript}
        />
      )}
      {showOverlay && <ViewCartOverlay navigation={navigation} carts={carts} />}
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 150, // Add padding to the bottom of the FlatList content
  },
});

export default AllItemProduct;
