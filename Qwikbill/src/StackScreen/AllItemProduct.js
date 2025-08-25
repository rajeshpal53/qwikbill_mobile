// screens/AllItemProduct.js

import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { ProductItem } from "../../ProductData";
import Searchbarwithmic from "../../src/Component/Searchbarwithmic";
import ProductCardDetails from "../Component/Cards/ProductCard";
import OpenmiqModal from "../Components/Modal/Openmicmodal";
import ViewCartOverlay from "../Overlays/ViewCartOverlays";
import { setProduct } from "../Redux/slices/ProductSlice";
import { ShopContext } from "../Store/ShopContext";
import { useSnackbar } from "../Store/SnackbarContext";
import UserDataContext from "../Store/UserDataContext";
import { readApi } from "../Util/UtilApi";

const AllItemProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchmodal, setsearchmodal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [products, setProducts] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [searchCalled, setSearchCalled] = useState(false);
  const [showOverlay, setshowOverlay] = useState(false);
  const [loader, setloader] = useState(false);
  const [page, setpage] = useState(1);
  const PAGE_LIMIT = 10;
  const [hasmore, setHasmore] = useState(true);
  const [totalpage, settotalpage] = useState(1);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const carts = useSelector((state) => state.cart.Carts);
  const { selectedShop } = useContext(ShopContext);
  const { userData } = useContext(UserDataContext);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectedShop?.vendor?.product?.length === 0) {
      showSnackbar("No data available for selected shop", "error");
    }
  }, []);

  useEffect(() => {
    dispatch(setProduct(ProductItem));
  }, []);

  const fetchProductData = async () => {
    try {
      setloader(true);
      const response = await readApi(
        `products/getProductByVendorfk?vendorfk=${selectedShop?.vendor?.id}&page=${page}&limit=${PAGE_LIMIT}`,
        {
          Authorization: `Bearer ${userData?.token}`,
        }
      );

      if (page === 1) {
        setProducts(response?.products);
        settotalpage(response?.totalPages || 1);
      } else if (response?.products.length > 0) {
        setProducts((prev) => [
          ...prev,
          ...response.products.filter(
            (product) =>
              !prev.some((prevProduct) => prevProduct.id === product.id)
          ),
        ]);
      } else {
        setHasmore(false);
      }
    } catch (error) {
      if (page === 1) setProducts([]);
      showSnackbar("Something went wrong while loading products.", "error");
    } finally {
      setloader(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  useEffect(() => {
    setshowOverlay(carts.length > 0);
  }, [carts]);

  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 0) {
      const found = products?.filter((item) =>
        item?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchedData(found);
      setSearchCalled(true);
    } else {
      setSearchedData([]);
      setSearchCalled(false);
    }
  }, [debouncedSearchQuery]);

  const SearchHandler = (text) => {
    if (text.trim().length > 0) {
      const found = products?.filter((item) =>
        item?.name?.toLowerCase().includes(text.toLowerCase())
      );
      setSearchedData(found);
      setSearchCalled(true);
    } else {
      setSearchedData([]);
      setSearchCalled(false);
    }
  }

  const loadmore = () => {
    if (hasmore && !loader && page < totalpage) {
      setpage((prev) => prev + 1);
    }
  };

  const Loader = () => {
    if (!loader) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
        <Searchbarwithmic
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setsearchmodal={setsearchmodal}
          setTranscript={setTranscript}
          placeholderText="Search Product by name..."
          searchData={SearchHandler}
        />
      </View>

      <FlatList
        data={searchCalled ? searchedData : products}
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

      {showOverlay && (
        <ViewCartOverlay navigation={navigation} carts={carts} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 130,
  },
});

export default AllItemProduct;