import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { ShopContext } from "../../Store/ShopContext";
import { fontSize } from "../../Util/UtilApi";

const ProductDetailsCard = ({
  item,
  setRefresh,
  setProductId,
  setVisible,
  isSelected,
  onSelect,
  onLongSelect,
  selectionMode,
}) => {
  const navigation = useNavigation();
  const { selectedShop } = useContext(ShopContext);

  const HandleProductDelete = () => {
    setProductId(item?.id);
    setVisible(true);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (selectionMode) {
          onSelect(); // toggle selection
        } else {
          // normal navigation (when not in selection mode)
          navigation.navigate("ProductDetail", { item });
        }
      }}
      onLongPress={onLongSelect} // ✅ must be here, not inside onPress
    >
      <Card style={[styles.card, isSelected && styles.cardSelected]}>
        <View style={styles.headerRow}>
          <Avatar.Text
            size={38}
            label={item?.name?.charAt(0)?.toUpperCase()}
            style={styles.avatar}
          />
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          {(selectedShop?.role?.name === "owner" ||
            selectedShop?.role?.name === "manager") && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AddProduct", {
                    EditData: item,
                    isUpdated: true,
                    setRefresh: setRefresh,
                  })
                }
              >
                <MaterialIcons name="edit" size={20} color="#1E88E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={HandleProductDelete}>
                <MaterialIcons name="delete" size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Compact 2x2 Grid for details */}
        <View style={styles.detailsGrid}>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <View style={styles.detailBox}>
              <Text style={styles.label}>Sell Price</Text>
              <Text style={styles.value}>₹{item.sellPrice}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.label}>Tax Rate</Text>
              <Text style={styles.value}>
                {Number(item.taxRate).toFixed(2)}%
              </Text>
            </View>
          </View>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <View style={styles.detailBox}>
              <Text style={styles.label}>Cost Price</Text>
              <Text style={styles.value}>₹{item.costPrice}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.label}>HSN Code</Text>
              <Text style={styles.value}>{item.hsncode || "-"}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    padding: 12,
    backgroundColor: "#fff",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#0a6846",
    backgroundColor: "#E8F5E9", // ✅ light green tint when selected
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    backgroundColor: "#0D47A1",
  },
  productName: {
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Medium",
    marginLeft: 12,
    flex: 1,
    color: "#212529",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginLeft: 8,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  detailBox: {
    width: "50%",
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.label,
    color: "#6c757d",
    marginRight: 10,
  },
  value: {
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label + 1,
    color: "#000",
  },
});

export default ProductDetailsCard;
