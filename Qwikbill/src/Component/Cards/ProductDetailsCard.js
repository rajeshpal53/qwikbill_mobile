import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { ShopContext } from "../../Store/ShopContext";
import { fontSize } from "../../Util/UtilApi";

const ProductDetailsCard = ({ item, setRefresh, setProductId, setVisible }) => {
  const navigation = useNavigation();
  const { selectedShop } = useContext(ShopContext);

  const HandleProductDelete = () => {
    setProductId(item?.id);
    setVisible(true);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.contentContainer}>
        {/* Avatar and Product Name */}
        <View style={styles.headerRow}>
          <Avatar.Text
            size={40}
            label={item?.name?.charAt(0)?.toUpperCase()}
            style={styles.avatar}
          />
          <Text style={styles.productName}>{item.name}</Text>

          {/* Action Buttons */}
          {(selectedShop?.role?.name === "owner" || selectedShop?.role?.name === "manager") && (
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
                <MaterialIcons name="edit" size={22} color="#1E88E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={HandleProductDelete}>
                <MaterialIcons name="delete" size={22} color="#E53935" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Price and HSN details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.label}>Selling Price:</Text>
            <Text style={styles.value}>₹{item.sellPrice}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.label}>Tax Rate:</Text>
            <Text style={styles.value}>{item.taxRate}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.label}>Cost Price:</Text>
            <Text style={styles.value}>₹{item.costPrice}</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.label}>HSN Code:</Text>
            <Text style={styles.value}>{item.hsncode}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 28,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 2,
    padding: 15,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexDirection: "column",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal:0,
  },
  avatar: {
    backgroundColor: "#0D47A1",
    marginLeft: 16,
  },
  productName: {
    fontSize: fontSize.labelLarge + 2,
    fontFamily: "Poppins-Medium",
    marginLeft: 15,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginRight:20,
    marginTop:-5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    gap: "30%",
    marginLeft:20,
  },
  detailColumn: {
    flex: 1,
    
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: fontSize.label+2,
    color: "#555",
  },
  value: {
    fontFamily: "Poppins-Medium",
    fontSize: fontSize.label + 2,
    color: "#000",
  },
});

export default ProductDetailsCard;
