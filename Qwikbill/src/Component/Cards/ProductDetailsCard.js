import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { ShopContext } from "../../Store/ShopContext";
import { fontSize } from "../../Util/UtilApi";
import { useTheme } from "../../../constants/Theme";

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
  const { colors,isDark } = useTheme();

  const HandleProductDelete = () => {
    setProductId(item?.id);
    setVisible(true);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (selectionMode) {
          onSelect();
        } else {
          navigation.navigate("ProductDetail", { item });
        }
      }}
      onLongPress={onLongSelect}
    >
      <Card
        style={[
          styles.card,
          { backgroundColor: colors.background ,
             shadowColor: isDark === true ? "#ffffff30" : "#000000", // light shadow in dark mode
          },

          isSelected && {
            borderColor: colors.primary,
            backgroundColor: colors.secondary + "22", // ✅ faint tint
          },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Avatar.Text
            size={38}
            label={item?.name?.charAt(0)?.toUpperCase()}
            style={{ backgroundColor: colors.primary }}
            color={colors.text}
          />
          <Text
            style={[styles.productName, { color: colors.text }]}
            numberOfLines={1}
          >
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
                <MaterialIcons name="edit" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={HandleProductDelete}>
                <MaterialIcons name="delete" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.rowBetween}>
            <View style={styles.detailBox}>
              <Text style={[styles.label, { color: colors.text }]}>
                Sell Price
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                ₹{item.sellPrice}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={[styles.label, { color: colors.text }]}>
                Tax Rate
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {Number(item.taxRate).toFixed(2)}%
              </Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <View style={styles.detailBox}>
              <Text style={[styles.label, { color: colors.text }]}>
                Cost Price
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                ₹{item.costPrice}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={[styles.label, { color: colors.text }]}>
                HSN Code
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {item.hsncode || "-"}
              </Text>
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
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  productName: {
    fontSize: fontSize.labelLarge,
    fontFamily: "Poppins-Medium",
    marginLeft: 12,
    flex: 1,
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
    marginRight: 10,
  },
  value: {
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label + 1,
  },
});

export default ProductDetailsCard;
