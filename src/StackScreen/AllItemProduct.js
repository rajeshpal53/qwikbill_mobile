import { FlatList, StyleSheet, Text, View } from "react-native";
import Searchbarwithmic from "../../src/Component/Searchbarwithmic";
import ProductCardDetails from "../Component/Cards/ProductCard";
import { useContext, useEffect, useMemo, useState } from "react";
import ViewCartOverlay from "../Overlays/ViewCartOverlays";
import { ProductItem } from "../../ProductData";
// import { setProduct } from "../Redux/CartProductRedux/ProductSlice";
import { setProduct } from "../Redux/slices/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import OpenmiqModal from "../Modal/Openmicmodal";
import { readApi } from "../Util/UtilApi";
import { ShopContext } from "../Store/ShopContext";
import UserDataContext from "../Store/UserDataContext";
import { useSnackbar } from "../Store/SnackbarContext";

const AllItemProduct = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showOverlay, setshowOverlay] = useState(false);
  const dispatch = useDispatch();
  // const products = useSelector((state) => state.product.products);
  const [products, setProducts] = useState(null);
  const carts = useSelector((state) => state.cart.Carts);
  const {selectedShop} = useContext(ShopContext);
  const {userData} = useContext(UserDataContext);
  const {showSnackbar} = useSnackbar();

  useEffect(() => {

    const fetchProductData = async() => {

      try {
        
        const response = await readApi(`products/getProductByVendorfk/${selectedShop?.id}?page=1&limit=10`, {
          Authorization : `Bearer ${userData?.token}`,
        });

        console.log("response of getting products is , ", response);

        setProducts(response?.products);
      } catch (error) {
        console.log("error of getting ", error);
        showSnackbar("Something went Wrong ", "error");
      }
    }

    fetchProductData();
  }, [])

  useEffect(() => {
    if (carts.length > 0) {
      setshowOverlay(true);
    } else {
      setshowOverlay(false);
    }
  }, [carts]);

  useEffect(() => {
    dispatch(setProduct(ProductItem));
  }, []);

  const filteredData = useMemo(() => {
    return (products || []).filter((item) =>
      item.Name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

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
        data={products}
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
