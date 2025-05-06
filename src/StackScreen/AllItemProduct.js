import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import { clearCart } from "../Redux/slices/CartSlice";
import { ActivityIndicator } from "react-native-paper";

const AllItemProduct = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showOverlay, setshowOverlay] = useState(false);
  const dispatch = useDispatch();
  // const products = useSelector((state) => state.product.products);
  const [products, setProducts] = useState(null);
  const carts = useSelector((state) => state.cart.Carts);
  const { selectedShop } = useContext(ShopContext);
  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();
  const [loader, setloader] = useState(false);
  const [page, setpage] = useState(1);
  const PAGE_LIMIT = 10;
  const [hasmore, setHasmore] = useState(true);
  const [totalpage, settotalpage] = useState(1);

  console.log("PAGE IS SSSS", page);
  console.log("TOTAL PAGE IS ", totalpage);

  const fetchProductData = async () => {
    try {
      setloader(true);
      const response = await readApi(
        `products/getProductByVendorfk/${selectedShop?.vendor?.id}?page=${page}&limit=${PAGE_LIMIT}`,
        {
          Authorization: `Bearer ${userData?.token}`,
        }
      );
      console.log("response of getting products is , ", response?.totalPages);
      if (page == 1) {
        setProducts(response?.products);
        settotalpage(response?.totalPages || 1);
      } else if (response?.products.length > 0) {
        setProducts((prev) => [
          ...prev,
          ...response?.products.filter(
            (product) =>
              !prev.some((prevProduct) => prevProduct.id === product.id)
          ),
        ]);
      } else {
        setHasmore(false);
      }
    } catch (error) {
      if (page === 1) {
        setProducts([]);
      }
      console.log("error of getting ", error);
      showSnackbar("Something went Wrong ", "error");
    } finally {
      setloader(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const loadmore = () => {
    if (hasmore && !loader && page < totalpage) {
      setpage((prev) => prev + 1);
    }
  };

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

  // const filteredData = useMemo(() => {
  //   return (products || []).filter((item) =>
  //     item.Name?.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // }, [products, searchQuery]);

  // if (loader) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator animating={loader} color={"#FFC107"} size="large" />
  //     </View>
  //   );
  // }

  const Loader = () => {
    if (!loader) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={products}
        ListHeaderComponent={() => (
          <View style={{ marginTop: 5 }}>
            <Searchbarwithmic
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setsearchmodal={setsearchmodal}
              setTranscript={setTranscript}
              placeholderText="Search User by name ..."
            />
            {carts.length > 0 && (
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginRight: 20,
                  marginBottom: 10,
                }}
                onPress={() => dispatch(clearCart())}
              >
                <Text style={{ color: "#007BFF" }}>Clear Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item, index }) => (
          <ProductCardDetails
            item={item}
            index={index}
            setshowOverlay={setshowOverlay}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
        onEndReached={loadmore}
        onEndReachedThreshold={0.8}
        ListFooterComponent={Loader}
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
    paddingBottom: 130, // Add padding to the bottom of the FlatList content
  },
});

export default AllItemProduct;
