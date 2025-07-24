import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch } from "react-redux";
import { clearCart } from "../Redux/slices/CartSlice";

const ViewCartOverlay = ({ navigation, carts }) => {
  const { t } = useTranslation();
  const pendingActionRef = useRef(null);
  const dispatch = useDispatch();

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlayBox}>
        {/* Left Section: Cart Count */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemText}>
            {t("Selected Item")} : {carts.length}
          </Text>
        </View>

        {/* Middle Section: Go to Invoice */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.invoiceButton}
        >
          <Text style={styles.invoiceText}>{t("Go to Invoice")}</Text>
        </TouchableOpacity>

        {/* Right Section: Clear Cart Icon */}
        <TouchableOpacity
          onPress={handleClearCart}
          style={styles.clearButton}
          accessibilityLabel="Clear Cart"
        >
          <Icon name="cart-remove" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewCartOverlay;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "10%",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  overlayBox: {
    flexDirection: "row",
    backgroundColor: "#E0F7FA",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B",
  },
  invoiceButton: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginHorizontal: 6,
  },
  invoiceText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,          // ✅ Outline
    borderColor: "red",     // ✅ White border
    justifyContent: "center",
    alignItems: "center",
    marginLeft:8,
  },
});
