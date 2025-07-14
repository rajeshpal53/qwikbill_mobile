import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import IncAndDicButton from "../../Redux/IncAndDicButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { addToCart, removeFromCart } from "../../Redux/slices/CartSlice";
import { ButtonColor, fontSize } from "../../Util/UtilApi";

const ProductCardDetails = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.Carts);
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  const currentCartItem = cartItems.find((cartItem) => cartItem.id === item.id); // Get the actual item from cart

  useEffect(() => {
    // console.log("InCart is , ", isInCart); // Keep for debugging if needed
  }, [isInCart]);

  const handleAddToCart = () => {
    dispatch(addToCart(item));
  };

  const handleRemoveFromCart = () => {
    console.log("cart id is ",item?.id)
    dispatch(removeFromCart(item?.id));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <View style={styles.productNameContainer}>
          <Text style={styles.productName}>{item?.name}</Text>
        </View>
        <View style={styles.mainContentWrapper}>
          {/* Product Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.priceInfoContainer}>
              <Text style={styles.productInfo}>
                Cost Price:{" "}
                <Text style={styles.priceValue}>₹ {item?.costPrice}</Text>
              </Text>
              <Text style={styles.productInfo}>
                Sell Price:{" "}
                <Text style={styles.priceValue}>₹ {item?.sellPrice}</Text>
              </Text>
            </View>
            {/* Conditionally render Final Price only if it exists */}
            {item?.Price && (
              <Text style={styles.finalPrice}>
                Final Price:{" "}
                <Text style={styles.finalPriceValue}>₹ {item.Price}</Text>
              </Text>
            )}
          </View>

          {/* Action Buttons Section (Add/Remove & Quantity) */}
          <View style={styles.actionSection}>
            {isInCart ? (
              <View style={styles.inCartControls}>
                <View style={styles.quantityControls}>
                  <IncAndDicButton item={currentCartItem || item} />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemoveFromCart}
                >
                  <MaterialIcons name="delete" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    paddingVertical: 15,
  },
  productNameContainer: {
    paddingHorizontal: 27,
    marginBottom: -10,
  },
  productName: {
    fontWeight: "bold",
    color: "#343A40",
    fontFamily: "Poppins-Bold", // Use Poppins-Bold for product name
    fontSize: fontSize.headingSmall + 6,
    textAlign: "left",
  },
  mainContentWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  detailsSection: {
    flex: 2,
  },
  priceInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    flexWrap: 'wrap',
    paddingTop: 15,
  },
  productInfo: {
    color: "#6C757D",
    fontFamily: "Poppins-Medium", // Apply Poppins-Medium
    fontSize: fontSize.labelMedium,
    marginLeft: 7,
    marginTop: 5,
  },
  priceValue: {
    fontWeight: "bold",
    color: "#495057",
    fontFamily: "Poppins-SemiBold", // Consider using Poppins-SemiBold for values if available
  },
  finalPrice: {
    fontSize: fontSize.labelLarge + 2,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 5,
    fontFamily: "Poppins-Bold", // Apply Poppins-Bold
  },
  finalPriceValue: {
    fontWeight: "bold",
    color: "#007BFF",
    fontFamily: "Poppins-Bold", // Apply Poppins-Bold
  },
  actionSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: ButtonColor.SubmitBtn,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: -30,
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Medium", // Apply Poppins-Medium
  },
  inCartControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  removeButton: {
    backgroundColor: "#DC3545",
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginLeft: 20,
    marginTop: 30,
  },
  quantityControls: {
    marginTop: 30,
    marginRight: 10,
  },
});

export default ProductCardDetails;